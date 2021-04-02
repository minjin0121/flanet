import Blockly from "blockly";

Blockly.Blocks.training_dropout_field = {
  init() {
    this.appendDummyInput()
      .appendField("Dropout")
      .appendField(new Blockly.FieldTextInput("0.1"), "RATE");
    this.setTooltip("rate를 입력해주세요");
    this.setColour("#47A644");
    this.setOutput(true, "String");
  },
};

Blockly.JavaScript.training_dropout_field = function (block) {
  // setTimeout(function () {}, 500);

  return "return CNN Training \n";
};
