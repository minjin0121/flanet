import * as Blockly from "blockly/core";
import "blockly/javascript";

const analysisLSTM = {
  type: "analysis_lstm",
  message0: "LSTM 분석을 하자!",
  message1: "데이터 선택 : %1",
  args1: [
    {
      type: "field_dropdown",
      name: "DATA",
      options: [
        ["데이터1", "Data1"],
        ["데이터2", "Data2"],
      ],
    },
  ],
  message2: "Window Size : %1",
  args2: [
    {
      type: "field_input",
      name: "WINDOWSIZE",
      text: "입력해주세요.",
    },
  ],
  message3: "예측 기간 : %1 ~ %2",
  args3: [
    {
      type: "field_date",
      name: "PREDICTSTARTDATE",
      date: "2021-03-22",
    },
    {
      type: "field_date",
      name: "PREDICTENDDATE",
      date: "2021-03-22",
    },
  ],
  nextStatement: null,
  colour: 333,
};

Blockly.Blocks.analysis_lstm_field = {
  init() {
    this.jsonInit(analysisLSTM);
  },
};

Blockly.JavaScript.analysis_lstm_field = function (block) {
  const data = block.getField("DATA").value_;
  const windowSize = block.getField("WINDOWSIZE").value_;
  const startDate = block.getField("PREDICTSTARTDATE").value_;
  const endDate = block.getField("PREDICTENDDATE").value_;

  console.log(data, windowSize, startDate, endDate);

  return "return문 : LSTM 분석 \n";
};
