import Blockly from "blockly";
import store from "../../../index.js";
import {
  initModelingStep,
  setDisplayCode,
  setDisplayData,
  setModelingStep,
  setUserDataSetId,
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
      .appendField("1. 모델링 데이터 입력")
      .appendField(dataSelect, "SELECT");
    this.setNextStatement(true, null);
    this.setColour(70);
  },
};

Blockly.JavaScript.data_select = function (block) {
  const userDataSetId = block.getFieldValue("SELECT");

  let url = `https://j4f002.p.ssafy.io/api/easy/userdataset/${userDataSetId}`;

  store.dispatch(initModelingStep(store.getState().modelingStep.length));
  store.dispatch(setUserDataSetId(["crawling", userDataSetId]));
  store.dispatch(setDisplayCode(""));
  store.dispatch(setModelingStep({ userDataSetId }));

  fetch(url, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((res) => {
      store.dispatch(setDisplayData(res.data_set));
    })
    .catch();

  url = "https://j4f002.p.ssafy.io/ml/tensorflow/input";

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_data_set_id: userDataSetId,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("*** TENSORFLOW DATA INPUT DONE ***");
      console.log(res);

      store.dispatch(setModelingStep(res));
    })
    .catch();

  return "Data Select";
};
