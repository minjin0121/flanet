import * as Blockly from "blockly/core";
import store from "../../../index.js";

const makeOptionsArray = function (userDataSets) {
  const options = [];

  for (let index = 0; index < userDataSets.length; index++) {
    const temp = [];

    temp.push(userDataSets[index].user_data_set_date);
    temp.push(String(userDataSets[index].user_data_set_id));
    options.push(temp);
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

    this.appendValueInput("user_data_set")
      .setCheck(null)
      .appendField("입력 데이터 선택 : ")
      .appendField(dataSelect, "SELECT");
    this.setColour(225);
  },
};

Blockly.JavaScript.data_select = function (block) {
  return block.getFieldValue("SELECT");
};
