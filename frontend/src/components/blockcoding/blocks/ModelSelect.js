import Blockly from "blockly";
import store from "../../../index.js";
import { setModelingStep } from "../../../actions/index";

const makeOptionsArray = function (userModelSets) {
  const options = [];

  for (let index = 0; index < userModelSets.length; index++) {
    if (userModelSets[index].training_model_xml !== null) {
      const temp = [];

      if (userModelSets[index].training_model_name === null) {
        temp.push(`모델 (${userModelSets[index].training_model_date})`);
      } else {
        temp.push(userModelSets[index].training_model_name);
      }
      temp.push(String(userModelSets[index].training_model_id));
      options.push(temp);
    }
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

    this.appendDummyInput()
      .appendField("STEP 3. 학습 모델 선택")
      .appendField(modelSelect, "SELECT");
    this.setColour("#F2B90C");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  },
};

Blockly.JavaScript.model_select_field = function (block) {
  setTimeout(function () {
    const trainingModelId = block.getFieldValue("SELECT");

    store.dispatch(setModelingStep({ training_model_id: trainingModelId }));
  }, 1000);

  return "Model Select";
};
