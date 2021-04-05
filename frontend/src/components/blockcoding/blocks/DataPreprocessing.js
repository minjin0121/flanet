import Blockly from "blockly/core";
import store from "../../../index.js";
import { setDisplayCode, setSpinner } from "../../../actions/index";

const dataPreprocessing = {
  type: "DataPreprocessing",
  message0: "데이터 정제",
  previousStatement: null,
  nextStatement: null,
  colour: "#47a644",
};

Blockly.Blocks.DataPreprocessing = {
  init() {
    this.jsonInit(dataPreprocessing);
  },
};

Blockly.JavaScript.DataPreprocessing = function (block) {
  setTimeout(function () {
    store.dispatch(setSpinner(true));
    let codeurl = "";
    const userDataSetId = store.getState().userDataSetId;
    const code = store.getState().displayCode;

    if (userDataSetId[0] === "stock crawling") {
      codeurl = "https://j4f002.p.ssafy.io/api/code/dataprocessing/stock";
    } else if (userDataSetId[0] === "stock period crawling") {
      codeurl =
        "https://j4f002.p.ssafy.io/api/code/dataprocessing/stock/period";
    } else if (userDataSetId[0] === "temperature crawling") {
      codeurl = "https://j4f002.p.ssafy.io/api/code/dataprocessing/temperature";
    } else if (userDataSetId[0] === "temperature period crawling") {
      codeurl =
        "https://j4f002.p.ssafy.io/api/code/dataprocessing/temperature/period";
    }

    fetch(codeurl, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        store.dispatch(setDisplayCode(code + res.code));
        store.dispatch(setSpinner(false));
      });
  }, 500);

  return "DataPreprocessing";
};
