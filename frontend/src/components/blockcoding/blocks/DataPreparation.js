import Blockly from "blockly";
import store from "../../../index.js";
import {
  setDisplayCode,
  setModelingStep,
  setSpinner,
} from "../../../actions/index";

Blockly.Blocks.DataPreparation = {
  init() {
    const options = [
      ["8 : 2", "0.8"],
      ["7 : 3", "0.7"],
      ["6 : 4", "0.6"],
    ];

    this.appendDummyInput().appendField("STEP 2. 데이터 준비");
    this.appendDummyInput()
      .appendField("     Data Set 비율 ")
      .appendField(new Blockly.FieldDropdown(options), "SELECT")
      .appendField(" (Train : Test)");
    this.setColour("#47a644");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  },
};

Blockly.JavaScript.DataPreparation = function (block) {
  setTimeout(function () {
    store.dispatch(setSpinner(true));
    const rate = block.getFieldValue("SELECT");
    const modelingStep = store.getState().modelingStep;
    const code = store.getState().displayCode;

    console.log("*** DATA PREPARATION ***");
    console.log(modelingStep);

    const url = "https://j4f002.p.ssafy.io/ml/tensorflow/preprocess";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input_raw_data: modelingStep[1],
        set_rate: rate,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("*** TENSORFLOW DATA PREPROCESSING DONE ***");
        console.log(res);
        store.dispatch(setDisplayCode(`${code}\n${res.code}`));
        store.dispatch(setModelingStep(res));
        store.dispatch(setSpinner(false));
      });
  }, 5000);

  return "DataPreparation";
};
