import Blockly from "blockly";
import createTrainingPlus from "./TrainingPlus";
import createTrainingMinus from "./TrainingMinus";

const cnnTraining = {
  type: "cnn_training",
  message0: "모델 훈련",
  previousStatement: null,
  nextStatement: null,
  colour: 444,
  mutator: "training_list_mutators",
};

Blockly.Blocks.cnn_training_field = {
  init() {
    this.jsonInit(cnnTraining);
  },
};

Blockly.JavaScript.cnn_training_field = function (block) {
  console.log(block.inputList);
  // setTimeout(function () {}, 500);

  return "return CNN Training \n";
};

const listCreateMutator = {
  itemCount_: 0,

  mutationToDom() {
    const container = Blockly.utils.xml.createElement("mutation");

    container.setAttribute("items", this.itemCount_);

    const filters = this.getFieldValue("FILTERS");

    container.setAttribute("FILTERS", filters);

    console.log("container", container);

    return container;
  },

  domToMutation(xmlElement) {
    const targetCount = parseInt(xmlElement.getAttribute("items"), 10);

    this.updateShape_(targetCount);

    const filters = xmlElement.getAttribute("FILTERS");

    this.updateShape_(filters);

    console.log("targetCount", targetCount);
  },

  updateShape_(targetCount) {
    while (this.itemCount_ < targetCount) {
      this.addPart_();
    }
    while (this.itemCount_ > targetCount) {
      this.removePart_();
    }
    this.updateMinus_();
  },

  plus() {
    this.addPart_();
    this.updateMinus_();
  },

  minus() {
    if (this.itemCount_ === 0) {
      return;
    }
    this.removePart_();
    this.updateMinus_();
  },

  addPart_() {
    if (this.itemCount_ === 0) {
      this.topInput_ = this.appendValueInput(`ADD ${this.itemCount_}`)
        .appendField(createTrainingPlus(), "PLUS")
        .appendField("모델 훈련을 위해 블록을 조립해주세요.");
    } else {
      this.appendValueInput(`ADD ${this.itemCount_}`);
    }
    this.itemCount_++;
  },

  removePart_() {
    this.itemCount_--;
    this.removeInput(`ADD ${this.itemCount_}`);
    if (this.itemCount_ === 0) {
      this.topInput_ = this.appendDummyInput("EMPTY")
        .appendField(createTrainingPlus(), "PLUS")
        .appendField("추가해주세요");
    }
  },

  updateMinus_() {
    const minusField = this.getField("MINUS");

    if (!minusField && this.itemCount_ > 0) {
      this.topInput_.insertFieldAt(1, createTrainingMinus(), "MINUS");
    } else if (minusField && this.itemCount_ < 1) {
      this.topInput_.removeField("MINUS");
    }
  },
};

const listCreateHelper = function () {
  this.updateShape_(3);
};

Blockly.Extensions.registerMutator(
  "training_list_mutators",
  listCreateMutator,
  listCreateHelper,
  ["cnn_training_conv1D_field", "cnn_training_maxpooling1D_field"]
);
