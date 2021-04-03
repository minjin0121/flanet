import * as Blockly from "blockly/core";
import "blockly/javascript";
import store from "../../../index.js";
import {
  setUserDataSetId,
  setDisplayData,
  setDisplayCode,
} from "../../../actions/index";

Blockly.Blocks.analysis_prophet_field = {
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

Blockly.JavaScript.analysis_prophet_field = function (block) {
  setTimeout(function () {
    const dataId = store.getState().userDataSetId[1];
    const periods = block.getFieldValue("PERIOD");
    const cps = block.getFieldValue("CPS");

    console.log("block input is", dataId, periods, cps);

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
      .then((res) => res.json())
      .then((res) => {
        console.log("block result is ", res);
        const dataurl = `https://j4f002.p.ssafy.io/csv/download/userdatapredict/json/${res.user_data_predict_id}`;
        const code = store.getState().displayCode;

        store.dispatch(setUserDataSetId(["prophet", res.user_data_predict_id]));
        store.dispatch(setDisplayCode(code + res.code));

        fetch(dataurl, {
          method: "GET",
        })
          .then((data) => data.json())
          .then((data) => {
            console.log("block result data is", data);
            store.dispatch(setDisplayData(data));
          });
      });
  }, 500);

  return "return문 : Prophet 분석 \n";
};
