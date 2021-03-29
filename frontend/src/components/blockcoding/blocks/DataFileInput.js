import * as Blockly from "blockly/core";
import store from "../../../index.js";
import { setNowUserDataId } from "../../../actions/index";

let file = "";

Blockly.Blocks.data_file_input = {
  init() {
    const fileInput = new Blockly.FieldTextInput(".csv 파일을 선택해주세요");

    this.appendValueInput("file_name")
      .setCheck()
      .appendField("데이터 입력 : ")
      .appendField(fileInput);
    this.setNextStatement(true, null);
    this.setColour(444);

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

  const formData = new FormData();

  formData.append("file", file);
  formData.append("user_id", user.uid);

  fetch(`https://j4f002.p.ssafy.io/api/csv/upload/userdataset`, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("res is", res);
      store.dispatch(setNowUserDataId(res.user_data_set.user_data_set_id));
    });

  return "dataFileInput return";
};
