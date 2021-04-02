import Blockly from "blockly";
import store from "../../../index.js";
import {
  setDisplayData,
  setModelingStep,
  setUserDataSetId,
} from "../../../actions/index";

Blockly.Blocks.model_evaluate_field = {
  init() {
    this.appendDummyInput().appendField("4. 학습 모델 평가");
    this.setColour(70);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  },
};

Blockly.JavaScript.model_evaluate_field = function (block) {
  setTimeout(function () {
    const modelingStep = store.getState().modelingStep;

    console.log("*** MODEL EVALUATE *** ");
    console.log(modelingStep);

    const url = "https://j4f002.p.ssafy.io/ml/tensorflow/evaluate";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input_processed_data: modelingStep[2],
        training_model_id: modelingStep[3].training_model_id,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("*** TENSORFLOW CNN EVALUATE DONE ***");
        console.log(res.result_evaluate);

        store.dispatch(setUserDataSetId(["evaluate", res.result_evaluate]));
        store.dispatch(setDisplayData(res.result_evaluate));
        store.dispatch(setModelingStep(res));
      });
  }, 3500);

  return "Model Evaluate";
};
