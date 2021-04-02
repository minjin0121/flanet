import Blockly from "blockly";

Blockly.Blocks.cnn_training_minpooling1D_field = {
  init() {
    this.appendDummyInput()
      .appendField("MinPooling1D")
      .appendField(new Blockly.FieldTextInput("2"), "POOL_SIZE");
    this.setTooltip("pool size를 입력해주세요");
    this.setColour("#47A644");
    this.setOutput(true, "String");
  },
};

Blockly.JavaScript.cnn_training_minpooling1D_field = function (block) {
  // setTimeout(function () {}, 500);

  return "return CNN Training \n";
};
