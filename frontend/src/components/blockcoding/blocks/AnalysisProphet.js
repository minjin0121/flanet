import * as Blockly from "blockly/core";
import "blockly/javascript";
import store from "../../../index.js";

const analysisProphet = {
  type: "analysis_prophet",
  message0: "Prophet 분석을 하자!",
  message1: "주가 코드 : %1",
  args1: [
    {
      type: "field_dropdown",
      name: "STOCK",
      options: [
        ["삼성전자", "1"],
        ["카카오", "2"],
      ],
    },
  ],
  message2: "분석 기간 : %1 ~ %2",
  args2: [
    {
      type: "field_date",
      name: "STARTDATE",
      date: "2021-03-22",
    },
    {
      type: "field_date",
      name: "ENDDATE",
      date: "2021-03-22",
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
  message4: "민감도 : %1",
  args4: [
    {
      type: "field_input",
      name: "CPS",
      text: "입력해주세요.",
    },
  ],
  previousStatement: null,
  colour: 111,
};

Blockly.Blocks.analysis_prophet_field = {
  init() {
    this.jsonInit(analysisProphet);
  },
};

Blockly.JavaScript.analysis_prophet_field = function (block) {
  const stockId = block.getField("STOCK").value_;
  const startDate = block.getField("STARTDATE").value_;
  const endDate = block.getField("ENDDATE").value_;
  const predictStartDate = block.getField("PREDICTSTARTDATE").value_;
  const predictEndDate = block.getField("PREDICTENDDATE").value_;
  const cps = block.getField("CPS").value_;

  console.log(
    stockId,
    startDate,
    endDate,
    predictStartDate,
    predictEndDate,
    cps
  );

  const dataId = store.getState().nowUserData;

  console.log("분석할 데이터는", dataId);

  const url = "https://j4f002.p.ssafy.io/ml/prophet/stock/";

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_data_set_id: 105,
      periods: 10,
      cps: 1,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("prophet res is", res);
    });

  return "return문 : Prophet 분석 \n";
};
