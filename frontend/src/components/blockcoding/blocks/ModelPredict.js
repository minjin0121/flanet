import Blockly from "blockly";
import store from "../../../index.js";
import { setDisplayData, setUserDataSetId } from "../../../actions/index";

Blockly.Blocks.ModelPredict = {
  init() {
    this.appendDummyInput().appendField("STEP 5. 데이터 추론");
    this.appendDummyInput()
      .appendField("     추론 기간")
      .appendField(new Blockly.FieldTextInput("ex. 10, 20, 30"), "PERIOD")
      .appendField("일");
    this.setColour("#F2B90C");
    this.setPreviousStatement(true, null);
    this.setTooltip(
      "학습이 완료된 모델을 통해 원하는 기간의 데이터를 추론할 수 있습니다."
    );
  },
};

Blockly.JavaScript.ModelPredict = function (block) {
  setTimeout(function () {
    const periods = block.getFieldValue("PERIOD");
    const user = JSON.parse(
      sessionStorage.getItem(
        `firebase:authUser:${process.env.REACT_APP_FIREBASE_APIKEY}:[DEFAULT]`
      )
    );
    const modelingStep = store.getState().modelingStep;

    console.log("*** MODEL PREDICT ***");
    console.log(modelingStep);

    const url = "https://j4f002.p.ssafy.io/ml/tensorflow/predict";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_data_set_id: modelingStep[0].userDataSetId,
        input_processed_data: modelingStep[2],
        training_model_id: modelingStep[3].training_model_id,
        user_id: user.uid,
        period: periods,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("*** TENSORFLOW CNN PREDICT DONE ***");
        console.log(res.result_predict);

        store.dispatch(setUserDataSetId(["predict", res.result_predict]));
        store.dispatch(setDisplayData(res.result_predict));
      });
  }, 40000);

  return "ModelPredict";
};
