import Blockly from "blockly";

Blockly.Blocks.MaxPooling1D = {
  init() {
    this.appendDummyInput().appendField("Max-Pooling Layer");
    this.appendDummyInput()
      .appendField("     풀링 크기")
      .appendField(new Blockly.FieldTextInput("2"), "pool_size");
    this.setColour("#0FC9F2");
    this.setOutput(true, "String");
    this.setTooltip(
      "Pooling Layer는 Convolution Layer의 출력 데이터 크기를 줄이거나 특정 데이터를 강조합니다.\n" +
        "Max-Pooling Layer는 특정 영역의 값 중 최대값을 모으는 방식으로 동작합니다."
    );
  },
};
