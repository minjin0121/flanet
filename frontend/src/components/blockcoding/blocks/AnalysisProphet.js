import * as Blockly from "blockly/core";
import "blockly/javascript";
import store from "../../../index.js";
import {
  setUserDataSetId,
  setDisplayData,
  setDisplayCode,
} from "../../../actions/index";

Blockly.Blocks.AnalysisProphet = {
  init() {
    this.appendDummyInput().appendField("PROPHET - 분석, 추론");
    this.appendDummyInput()
      .appendField("     추론 기간")
      .appendField(new Blockly.FieldTextInput("ex. 10, 20, 30"), "PERIOD")
      .appendField("일");
    this.appendDummyInput()
      .appendField("     민감도")
      .appendField(new Blockly.FieldTextInput("ex. 0.1 (0 ~ 1)"), "CPS");
    this.setTooltip("PROPHET을 통해 분석을 진행할 수 있습니다.");
    this.setColour("#0DB3D9");
    this.setPreviousStatement(true, null);
  },
};

Blockly.JavaScript.AnalysisProphet = function (block) {
  setTimeout(function () {
    const dataId = store.getState().userDataSetId[1];
    const periods = block.getFieldValue("PERIOD");
    const cps = block.getFieldValue("CPS");

    const url = "https://j4f002.p.ssafy.io/ml/prophet/stock/";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_data_set_id: dataId,
        periods,
        cps,
      }),
    })
      .then((res1) => res1.json())
      .then((res1) => {
        const dataurl = `https://j4f002.p.ssafy.io/csv/download/userdatapredict/json/${res1.user_data_predict_id}`;
        const code = store.getState().displayCode;

        store.dispatch(
          setUserDataSetId(["prophet", res1.user_data_predict_id])
        );
        store.dispatch(setDisplayCode(code + res1.code));

        fetch(dataurl, {
          method: "GET",
        })
          .then((res2) => res2.json())
          .then((res2) => {
            store.dispatch(setDisplayData(res2));
          });
      });
  }, 500);

  return "AnalysisProphet";
};
