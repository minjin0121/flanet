import * as Blockly from "blockly/core";
import "blockly/javascript";
import store from "../../../index.js";
import { setNowUserDataId, setData } from "../../../actions/index";

Blockly.Blocks.analysis_prophet_field = {
  init() {
    this.appendDummyInput().appendField("Prophet");
    this.appendDummyInput()
      .appendField("기간")
      .appendField(new Blockly.FieldTextInput("기간을 입력해주세요"), "PERIOD");
    this.appendDummyInput()
      .appendField("CPS")
      .appendField(new Blockly.FieldTextInput("민감도을 입력해주세요"), "CPS");
    this.setTooltip("Prophet을 통해 분석을 진행할 수 있습니다.");
    this.setColour(225);
    this.setPreviousStatement(true, null);
  },
};

Blockly.JavaScript.analysis_prophet_field = function (block) {
  const dataId = store.getState().nowUserDataId[1];
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
      const dataurl = `https://j4f002.p.ssafy.io/csv/download/userdatapredict/json/${res}`;

      store.dispatch(setNowUserDataId(["prophet", res]));
      fetch(dataurl, {
        method: "GET",
      })
        .then((data) => data.json())
        .then((data) => {
          console.log("block result data is", data);
          store.dispatch(setData(data));
        });
    });

  return "return문 : Prophet 분석 \n";
};
