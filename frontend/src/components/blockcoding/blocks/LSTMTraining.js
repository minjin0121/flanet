import Blockly from "blockly";

Blockly.Blocks.lstm_training_field = {
  init() {
    this.appendDummyInput()
      .appendField("LSTM")
      .appendField(new Blockly.FieldTextInput("64"), "UNITS");
    this.setTooltip("units를 입력해주세요");
    this.setColour("#47A644");
    this.setOutput(true, "String");
  },
};

Blockly.JavaScript.lstm_training_field = function (block) {
  // setTimeout(function () {}, 500);

  return "return LSTM Training \n";
};
