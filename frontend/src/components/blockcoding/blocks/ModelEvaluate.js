import Blockly from "blockly";
import store from "../../../index.js";
import {
  setDisplayCode,
  setDisplayData,
  setModelingStep,
  setUserDataSetId,
  setSpinner,
} from "../../../actions/index";

Blockly.Blocks.ModelEvaluate = {
  init() {
    this.appendDummyInput().appendField("STEP 4. 학습 모델 평가");
    this.setColour("#f2b90c");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  },
};

Blockly.JavaScript.ModelEvaluate = function (block) {
  setTimeout(function () {
    store.dispatch(setSpinner(true));
    const modelingStep = store.getState().modelingStep;
    const code = store.getState().displayCode;

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
        console.log(res);

        store.dispatch(
          setUserDataSetId(["evaluate", modelingStep[3].training_model_id])
        );
        store.dispatch(setDisplayCode(`${code}\n${res.code}`));
        store.dispatch(setDisplayData(res.result_evaluate));
        store.dispatch(setModelingStep(res));
        store.dispatch(setSpinner(false));
      });
  }, 30000);

  return "ModelEvaluate";
};
