import Blockly from "blockly";
import store from "../../../index.js";
import {
  setUserDataSetId,
  setDisplayData,
  setDisplayCode,
} from "../../../actions/index";

const makeOptionsArray = function (userDataSets) {
  const options = [];

  for (let index = 0; index < userDataSets.length; index++) {
    const dateStart = new Date(userDataSets[index].user_data_set_start);
    const dateEnd = new Date(userDataSets[index].user_data_set_end);

    const dateDiff =
      (dateEnd.getTime() - dateStart.getTime()) / (1000 * 60 * 60 * 24);

    if (dateDiff > 300 || userDataSets[index].user_data_set_start === null) {
      const temp = [];

      temp.push(userDataSets[index].user_data_set_date);
      temp.push(String(userDataSets[index].user_data_set_id));
      options.push(temp);
    }
  }

  if (options.length === 0) {
    const temp = ["선택 불가", "0"];

    options.push(temp);
  }

  return options;
};

Blockly.Blocks.data_select = {
  init() {
    const userDataSets = store.getState().userDataSets;

    const dataSelect = new Blockly.FieldDropdown(
      makeOptionsArray(Object.values(userDataSets)[0])
    );

    this.appendDummyInput("user_data_set")
      .appendField("입력 데이터")
      .appendField(dataSelect, "SELECT");
    this.setNextStatement(true, null);
    this.setColour(225);
  },
};

Blockly.JavaScript.data_select = function (block) {
  const selectId = block.getFieldValue("SELECT");

  // 이거 링크 합쳐준다구 했음! 합쳐진 링크 넣으면 csv 파일도 긁어오기 가능!! => 벗 csv 데이터 시각화가 가능할까?
  const dataurl = `https://j4f002.p.ssafy.io/api/data/userdataset/${selectId}`;

  store.dispatch(setUserDataSetId(["crawling", selectId]));
  store.dispatch(setDisplayCode([]));

  fetch(dataurl, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      console.log(res.data_set);
      if (res.data_set.length > 1) {
        store.dispatch(setDisplayData(res.data_set));
      } else if (res.data_set.length > 0) {
        store.dispatch(
          setDisplayData([
            `실시간 데이터 수집 결과는 ${res.data_set[0].data_set_value} 입니다.`,
          ])
        );
      }
    });

  return "Data Select";
};
