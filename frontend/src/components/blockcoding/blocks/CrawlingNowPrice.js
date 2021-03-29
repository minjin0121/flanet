import Blockly from "blockly";
import store from "../../../index.js";
import { setDisplayCode } from "../../../actions/index.js";

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

Blockly.Blocks.crawling_now_price_field = {
  init() {
    const dataLists = store.getState().dataLists;

    const dataSelect = new Blockly.FieldDropdown(
      makeOptionsArray(Object.values(dataLists)[0])
    );

    this.appendDummyInput()
      .appendField("실시간 데이터 수집")
      .appendField(dataSelect, "DATA");
    this.setTooltip("원하는 데이터 값을 실시간으로 확인할 수 있습니다.");
    this.setColour("#47A644");
    this.setNextStatement(true, null);
  },
};

Blockly.JavaScript.crawling_now_price_field = function (block) {
  const dataId = block.getFieldValue("DATA");

  const user = JSON.parse(
    sessionStorage.getItem(
      `firebase:authUser:${process.env.REACT_APP_FIREBASE_APIKEY}:[DEFAULT]`
    )
  );

  let url = "";

  if (dataId <= 6) {
    url = "https://j4f002.p.ssafy.io/api/crawling/stocks";
  } else {
    url = "https://j4f002.p.ssafy.io/api/crawling/temperatures";
  }

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data_list_id: dataId,
      user_id: user.uid,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      // store.dispatch(setUserDataSetId(res.user_data_set.user_data_set_id));
      // store.dispatch(setDisplayData(res));
    });

  url = `https://j4f002.p.ssafy.io/api/code/crawling/${dataId}`;

  fetch(url, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((res) => {
      store.dispatch(setDisplayCode(res.code));
    });

  return "실시간 데이터 수집";
};
