import Blockly from "blockly";
import store from "../../../index.js";
import { setUserDataSetId } from "../../../actions/index";

const changeCSV = function (csv) {
  const lines = csv.split("\n");

  const result = [];

  const headers = lines[0].split(",");

  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentline = lines[i].split(",");

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }

    result.push(obj);
  }

  return result;
};

Blockly.Blocks.analysis_cnn_field = {
  init() {
    this.appendDummyInput().appendField("CNN 모델 - 훈련, 평가, 추론");
    this.appendDummyInput()
      .appendField("기간")
      .appendField(new Blockly.FieldTextInput("기간을 입력해주세요"), "PERIOD");
    this.setTooltip("CNN 모델을 통해 분석을 진행할 수 있습니다.");
    this.setColour("#0DB3D9");
    this.setPreviousStatement(true, null);
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

        store.dispatch(setUserDataSetId(["cnn", res1]));

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

            store.dispatch(setUserDataSetId(["cnn preprocessing", res2]));

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
                console.log(res3);

                const trainingModelId = Number(
                  changeCSV(res3)[0].training_model_id
                );

                store.dispatch(setUserDataSetId(["cnn training", res3]));

                url = "https://j4f002.p.ssafy.io/ml/tensorflow/evaluate";

                fetch(url, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    input_processed_data: res2,
                    training_model_id: trainingModelId,
                  }),
                })
                  .then((res4) => res4.json())
                  .then((res4) => {
                    console.log("*** TENSORFLOW CNN EVALUATE DONE ***");
                    console.log(res4);

                    store.dispatch(setUserDataSetId(["cnn evaluate", res4]));

                    url = "https://j4f002.p.ssafy.io/ml/tensorflow/predict";

                    fetch(url, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        user_data_set_id: dataId,
                        input_processed_data: res2,
                        training_model_id: trainingModelId,
                        user_id: user.uid,
                        period: periods,
                      }),
                    })
                      .then((res5) => res5.json())
                      .then((res5) => {
                        console.log("*** TENSORFLOW CNN PREDICT DONE ***");
                        console.log(res5);

                        store.dispatch(setUserDataSetId(["cnn predict", res5]));
                      });
                  });
              });
          });
      });
  }, 500);

  return "return문 : CNN 분석 \n";
};
