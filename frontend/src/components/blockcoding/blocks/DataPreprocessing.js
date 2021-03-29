import * as Blockly from "blockly/core";
import "blockly/javascript";

const dataPreprocessing = {
  type: "data_preprocessing",
  message0: "데이터 전처리",
  previousStatement: null,
  nextStatement: null,
  colour: 444,
};

Blockly.Blocks.data_preprocessing_field = {
  init() {
    this.jsonInit(dataPreprocessing);
  },
};

Blockly.JavaScript.data_preprocessing_field = function (block) {
  return "return문 : 데이터 전처리~ \n";
};
