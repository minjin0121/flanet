import Blockly from "blockly";
import store from "../../../index.js";
import {
  setDisplayData,
  setModelingStep,
  setUserDataSetId,
} from "../../../actions/index";

Blockly.Blocks.model_cnn_training = {
  init() {
    this.appendDummyInput().appendField("STEP 3. CNN 모델 학습");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#F2B90C");
  },
};

Blockly.JavaScript.model_cnn_training = function (block) {
  setTimeout(function () {
    const user = JSON.parse(
      sessionStorage.getItem(
        `firebase:authUser:${process.env.REACT_APP_FIREBASE_APIKEY}:[DEFAULT]`
      )
    );
    const modelingStep = store.getState().modelingStep;

    console.log("*** CNN TRAINING ***");
    console.log(modelingStep);

    const url = "https://j4f002.p.ssafy.io/ml/tensorflow/cnn/training";

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
      .then((res) => res.json())
      .then((res) => {
        console.log("*** TENSORFLOW CNN TRAINING DONE ***");
        console.log(res);

        store.dispatch(setUserDataSetId(["training", res.result_training]));
        store.dispatch(setDisplayData(res.result_training));
        store.dispatch(setModelingStep(res));
      });
  }, 1000);

  return "Model CNN Training";
};
