import Blockly from "blockly";
import store from "../../../index.js";
import {
  setUserDataSetId,
  setDisplayData,
  setDisplayCode,
} from "../../../actions/index";

let file = "";

Blockly.Blocks.data_file_input = {
  init() {
    const fileInput = new Blockly.FieldTextInput(".csv 파일을 선택해주세요");

    this.appendDummyInput().appendField("데이터 입력").appendField(fileInput);
    this.setColour("#47A644");
    this.setNextStatement(true, null);
    this.setTooltip("CSV 파일을 업로드해서 데이터를 입력할 수 있습니다.");

    fileInput.showEditor_ = () => {
      const input = document.createElement("input");

      input.type = "file";
      input.accept = ".csv";
      input.onchange = function (event) {
        file = event.target.files[0];
        fileInput.setValue(event.target.files[0].name);
      };
      input.click();
    };
  },
};

Blockly.JavaScript.data_file_input = function (block) {
  const user = JSON.parse(
    sessionStorage.getItem(
      `firebase:authUser:${process.env.REACT_APP_FIREBASE_APIKEY}:[DEFAULT]`
    )
  );

  let url = "https://j4f002.p.ssafy.io/api/csv/upload/userdataset";
  const formData = new FormData();

  formData.append("file", file);
  formData.append("user_id", user.uid);

  fetch(url, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((res) => {
      store.dispatch(setDisplayCode(""));

      url = `https://j4f002.p.ssafy.io/api/easy/userdataset/${res.user_data_set.user_data_set_id}`;

      fetch(url, {
        method: "GET",
      })
        .then((res1) => res1.json())
        .then((res1) => {
          store.dispatch(
            setUserDataSetId(["crawling", res.user_data_set.user_data_set_id])
          );
          store.dispatch(setDisplayData(res1.data_set));
        });
    });

  return "CSV 파일 데이터 입력";
};
