import Blockly from "blockly/core";
import store from "../../../index.js";
import { setUserDataSetId, setDisplayData } from "../../../actions/index";

Blockly.Blocks.analysis_lstm_field = {
  init() {
    this.appendDummyInput().appendField("LSTM 모델 - 훈련, 평가, 추론");
    this.appendDummyInput()
      .appendField("     추론 기간")
      .appendField(new Blockly.FieldTextInput("ex. 10, 20, 30"), "PERIOD")
      .appendField("일");
    this.setColour("#0DB3D9");
    this.setPreviousStatement(true, null);
    this.setTooltip("LSTM 모델을 통해 분석을 진행할 수 있습니다.");
  },
};

Blockly.JavaScript.analysis_lstm_field = function (block) {
  setTimeout(function () {
    const dataId = store.getState().userDataSetId[1];
    const modelingStep = store.getState().modelingStep;
    const periods = block.getFieldValue("PERIOD");

    const user = JSON.parse(
      sessionStorage.getItem(
        `firebase:authUser:${process.env.REACT_APP_FIREBASE_APIKEY}:[DEFAULT]`
      )
    );

    console.log("LSTM Block input is", dataId, periods);

    let url = "https://j4f002.p.ssafy.io/ml/tensorflow/lstm/training";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input_processed_data: modelingStep[2],
        user_id: user.uid,
      }),
    })
      .then((res1) => res1.json())
      .then((res1) => {
        console.log("*** TENSORFLOW LSTM TRAINING DONE ***");
        console.log(res1.result_training);

        store.dispatch(setUserDataSetId(["training", res1.result_training]));
        store.dispatch(setDisplayData(res1.result_training));

        url = "https://j4f002.p.ssafy.io/ml/tensorflow/evaluate";

        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input_processed_data: modelingStep[2],
            training_model_id: res1.training_model_id,
          }),
        })
          .then((res2) => res2.json())
          .then((res2) => {
            console.log("*** TENSORFLOW LSTM EVALUATE DONE ***");
            console.log(res2.result_evaluate);

            store.dispatch(
              setUserDataSetId(["evaluate", res2.result_evaluate])
            );
            store.dispatch(setDisplayData(res2.result_evaluate));

            url = "https://j4f002.p.ssafy.io/ml/tensorflow/predict";

            fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user_data_set_id: dataId,
                input_processed_data: modelingStep[2],
                training_model_id: res1.training_model_id,
                user_id: user.uid,
                period: periods,
              }),
            })
              .then((res3) => res3.json())
              .then((res3) => {
                console.log("*** TENSORFLOW LSTM PREDICT DONE ***");
                console.log(res3.result_predict);

                store.dispatch(
                  setUserDataSetId(["predict", res3.result_predict])
                );
                store.dispatch(setDisplayData(res3.result_predict));
              });
          });
      });
  }, 2000);

  return "return문 : LSTM 분석 \n";
};
