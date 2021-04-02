import Blockly from "blockly";
import store from "../../../index.js";
import {
  setDisplayData,
  setModelingStep,
  setUserDataSetId,
} from "../../../actions/index";

Blockly.Blocks.model_lstm_training = {
  init() {
    this.appendDummyInput().appendField("3. LSTM 모델 학습");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(70);
  },
};

Blockly.JavaScript.model_lstm_training = function (block) {
  setTimeout(function () {
    const user = JSON.parse(
      sessionStorage.getItem(
        `firebase:authUser:${process.env.REACT_APP_FIREBASE_APIKEY}:[DEFAULT]`
      )
    );
    const modelingStep = store.getState().modelingStep;

    console.log("*** LSTM TRAINING ***");
    console.log(modelingStep);

    const url = "https://j4f002.p.ssafy.io/ml/tensorflow/lstm/training";

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
        console.log("*** TENSORFLOW LSTM TRAINING DONE ***");
        console.log(res);

        store.dispatch(setUserDataSetId(["training", res.result_training]));
        store.dispatch(setDisplayData(res.result_training));
        store.dispatch(setModelingStep(res));
      });
  }, 1000);

  return "Model LSTM Training";
};
