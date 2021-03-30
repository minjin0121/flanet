import Blockly from "blockly";
import store from "../../../index.js";

const makeOptionsArray = function (userModelSets) {
  const options = [];

  for (let index = 0; index < userModelSets.length; index++) {
    const temp = [];

    temp.push(userModelSets[index].training_model_name);
    temp.push(String(userModelSets[index].training_model_id));
    options.push(temp);
  }

  if (options.length === 0) {
    const temp = ["선택 불가", "0"];

    options.push(temp);
  }

  return options;
};

Blockly.Blocks.model_select_field = {
  init() {
    const userModelSets = store.getState().userModelSets;

    const modelSelect = new Blockly.FieldDropdown(
      makeOptionsArray(Object.values(userModelSets)[0])
    );

    this.appendDummyInput("user_model_set")
      .appendField("이전 모델 선택")
      .appendField(modelSelect, "SELECT");
    this.setNextStatement(true, null);
    this.setColour(225);
  },
};

Blockly.JavaScript.model_select_field = function (block) {
  const selectId = block.getFieldValue("SELECT");

  console.log(selectId);

  return "Model Select";
};
