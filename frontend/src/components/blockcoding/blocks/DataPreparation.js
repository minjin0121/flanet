import Blockly from "blockly";
import store from "../../../index.js";
import { setModelingStep } from "../../../actions/index";

Blockly.Blocks.data_preparation = {
  init() {
    const options = [
      ["8 : 2", "0.8"],
      ["7 : 3", "0.7"],
      ["6 : 4", "0.6"],
    ];

    this.appendDummyInput().appendField("2. 모델링 데이터 준비");
    this.appendDummyInput()
      .appendField("    Data Set 비율 (Train : Test)")
      .appendField(new Blockly.FieldDropdown(options), "SELECT");
    this.setColour(70);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  },
};

Blockly.JavaScript.data_preparation = function (block) {
  setTimeout(function () {
    const rate = block.getFieldValue("SELECT");
    const modelingStep = store.getState().modelingStep;

    console.log("*** DATA PREPARATION ***");
    console.log(rate);

    const url = "https://j4f002.p.ssafy.io/ml/tensorflow/preprocess";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input_raw_data: modelingStep[1],
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("*** TENSORFLOW DATA PREPROCESSING DONE ***");
        console.log(res);
        store.dispatch(setModelingStep(res));
      });
  }, 500);

  return "Data Preparation";
};
