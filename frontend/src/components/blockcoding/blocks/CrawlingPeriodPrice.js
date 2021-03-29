import * as Blockly from "blockly/core";
import "@blockly/field-date";
import "blockly/javascript";
import store from "../../../index.js";
import { setNowUserDataId, setData, setNowCode } from "../../../actions/index";

const makeOptionsArray = function (dataLists) {
  const options = [];

  for (let index = 0; index < dataLists.length; index++) {
    if (dataLists[index].data_list_url !== null) {
      const temp = [];

      temp.push(
        `${dataLists[index].data_list_type} - ${dataLists[index].data_list_name}`
      );
      temp.push(String(dataLists[index].data_list_id));
      options.push(temp);
    }
  }

  return options;
};

Blockly.Blocks.crawling_period_price_field = {
  init() {
    const dataLists = store.getState().dataLists;

    const dataSelect = new Blockly.FieldDropdown(
      makeOptionsArray(Object.values(dataLists)[0])
    );

    this.appendDummyInput()
      .appendField("기간별 데이터 수집")
      .appendField(dataSelect, "DATA");
    this.appendDummyInput()
      .appendField("시작")
      .appendField(new Blockly.FieldDate("2016-03-17"), "STARTDATE");
    this.appendDummyInput()
      .appendField("끝")
      .appendField(new Blockly.FieldDate("2021-03-27"), "ENDDATE");
    this.setTooltip("원하는 데이터 값을 기간을 설정해 확인할 수 있습니다.");
    this.setColour(225);
    this.setNextStatement(true, null);
  },
};

Blockly.JavaScript.crawling_period_price_field = function (block) {
  const dataId = block.getFieldValue("DATA");
  const startDate = block.getFieldValue("STARTDATE");
  const endDate = block.getFieldValue("ENDDATE");
  const user = JSON.parse(
    sessionStorage.getItem(
      `firebase:authUser:${process.env.REACT_APP_FIREBASE_APIKEY}:[DEFAULT]`
    )
  );

  let url = "";

  if (dataId <= 6) {
    url = "https://j4f002.p.ssafy.io/api/crawling/stocks/period";
  } else {
    url = "https://j4f002.p.ssafy.io/api/crawling/temperatures/period";
  }

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data_list_id: dataId,
      user_id: user.uid,
      user_data_set_start: startDate,
      user_data_set_end: endDate,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      // console.log("res is", res);
      store.dispatch(setData(res.data_set));
      store.dispatch(
        setNowUserDataId(["crawling", res.user_data_set.user_data_set_id])
      );
    });

  const codeurl = `https://j4f002.p.ssafy.io/api/code/crawling/${dataId}/period`;
  let code = "기간별 데이터 code";

  fetch(codeurl, { method: "GET" })
    .then((res) => res.json())
    .then((res) => {
      code = res.code;
      store.dispatch(setNowCode(res.code));
    });

  return code;
};
