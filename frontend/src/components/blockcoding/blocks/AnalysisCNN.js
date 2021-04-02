import Blockly from "blockly";
import store from "../../../index.js";
import { setUserDataSetId, setDisplayData } from "../../../actions/index";

Blockly.Blocks.analysis_cnn_field = {
  init() {
    this.appendDummyInput().appendField("CNN 모델 - 학습, 평가, 추론");
    this.appendDummyInput()
      .appendField("    추론 기간")
      .appendField(new Blockly.FieldTextInput("ex. 10, 20, 30"), "PERIOD")
      .appendField("일");
    this.setColour("#0DB3D9");
    this.setPreviousStatement(true, null);
    this.setTooltip(
      "CNN 모델을 통해 모델 학습, 평가, 데이터 추론까지 할 수 있습니다."
    );
  },
};

Blockly.JavaScript.analysis_cnn_field = function (block) {
  setTimeout(function () {
    const dataId = store.getState().userDataSetId[1];
    const periods = block.getFieldValue("PERIOD");

    const user = JSON.parse(
      sessionStorage.getItem(
        `firebase:authUser:${process.env.REACT_APP_FIREBASE_APIKEY}:[DEFAULT]`
      )
    );

    console.log("CNN Block input is", dataId, periods);

    let url = "https://j4f002.p.ssafy.io/ml/tensorflow/input";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_data_set_id: dataId,
      }),
    })
      .then((res1) => res1.json())
      .then((res1) => {
        console.log("*** TENSORFLOW DATA INPUT DONE ***");
        console.log(res1);

        url = "https://j4f002.p.ssafy.io/ml/tensorflow/preprocess";

        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input_raw_data: res1,
          }),
        })
          .then((res2) => res2.json())
          .then((res2) => {
            console.log("*** TENSORFLOW DATA PREPROCESSING DONE ***");
            console.log(res2);

            url = "https://j4f002.p.ssafy.io/ml/tensorflow/cnn/training";

            fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                input_processed_data: res2,
                user_id: user.uid,
              }),
            })
              .then((res3) => res3.json())
              .then((res3) => {
                console.log("*** TENSORFLOW CNN TRAINING DONE ***");
                console.log(res3.result_training);

                store.dispatch(
                  setUserDataSetId(["training", res3.result_training])
                );
                store.dispatch(setDisplayData(res3.result_training));

                url = "https://j4f002.p.ssafy.io/ml/tensorflow/evaluate";

                fetch(url, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    input_processed_data: res2,
                    training_model_id: res3.training_model_id,
                  }),
                })
                  .then((res4) => res4.json())
                  .then((res4) => {
                    console.log("*** TENSORFLOW CNN EVALUATE DONE ***");
                    console.log(res4.result_evaluate);

                    store.dispatch(
                      setUserDataSetId(["evaluate", res4.result_evaluate])
                    );
                    store.dispatch(setDisplayData(res4.result_evaluate));

                    url = "https://j4f002.p.ssafy.io/ml/tensorflow/predict";

                    fetch(url, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        user_data_set_id: dataId,
                        input_processed_data: res2,
                        training_model_id: res3.training_model_id,
                        user_id: user.uid,
                        period: periods,
                      }),
                    })
                      .then((res5) => res5.json())
                      .then((res5) => {
                        console.log("*** TENSORFLOW CNN PREDICT DONE ***");
                        console.log(res5.result_predict);

                        store.dispatch(
                          setUserDataSetId(["predict", res5.result_predict])
                        );
                        store.dispatch(setDisplayData(res5.result_predict));
                      });
                  });
              });
          });
      });
  }, 500);

  return "return문 : CNN 분석 \n";
};
