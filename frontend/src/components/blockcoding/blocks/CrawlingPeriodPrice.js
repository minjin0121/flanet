import Blockly from "blockly";
import "@blockly/field-date";
import store from "../../../index.js";
import {
  setUserDataSetId,
  setDisplayData,
  setDisplayCode,
} from "../../../actions/index";

const makeOptionsArray = function (dataLists) {
  const options = [];

  for (let index = 0; index < dataLists.length; index++) {
    if (dataLists[index].data_list_url !== null) {
      const temp = [];

      temp.push(
        `${dataLists[index].data_list_type === "stock" ? "주식" : "기온"} - ${
          dataLists[index].data_list_name
        }`
      );
      temp.push(String(dataLists[index].data_list_id));
      options.push(temp);
    }
  }

  return options.sort();
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
      .appendField("기간 : ")
      .appendField(new Blockly.FieldDate("2016-03-17"), "STARTDATE")
      .appendField("부터")
      .appendField(new Blockly.FieldDate("2021-03-27"), "ENDDATE")
      .appendField("까지");
    this.setTooltip("원하는 데이터 값을 기간을 설정해 확인할 수 있습니다.");
    this.setColour("#F2B90C");
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
  let userDataSetName = "";

  if (dataId <= 6) {
    url = "https://j4f002.p.ssafy.io/api/crawling/stocks/period";
    userDataSetName = "stock period crawling";
  } else {
    url = "https://j4f002.p.ssafy.io/api/crawling/temperatures/period";
    userDataSetName = "temperature period crawling";
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
      console.log("crawl", res);
      store.dispatch(
        setUserDataSetId([userDataSetName, res.user_data_set.user_data_set_id])
      );
      store.dispatch(setDisplayData(res.data_set));
    });

  const codeurl = `https://j4f002.p.ssafy.io/api/code/crawling/${dataId}/period`;

  fetch(codeurl, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((res) => {
      store.dispatch(setDisplayCode(res.code));
    });

  return "기간별 데이터 수집";
};
