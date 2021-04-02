import Blockly from "blockly/core";
import store from "../../../index.js";
import { setDisplayCode } from "../../../actions/index";

const dataPreprocessing = {
  type: "data_preprocessing",
  message0: "데이터 정제",
  previousStatement: null,
  nextStatement: null,
  colour: 444,
};

Blockly.Blocks.data_preprocessing_field = {
  init() {
    this.jsonInit(dataPreprocessing);
  },
};

Blockly.JavaScript.data_preprocessing_field = function (block) {
  setTimeout(function () {
    let codeurl = "";
    const userDataSetId = store.getState().userDataSetId;
    const code = store.getState().displayCode;

    console.log("now code is", code);

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
        console.log(res);
        store.dispatch(setDisplayCode(code + res.code));
      });
  }, 500);

  return "return문 : 데이터 전처리~ \n";
};
