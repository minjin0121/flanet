import React, { useState } from "react";
import { useDispatch } from "react-redux";
import BlocklyJS from "blockly/javascript";
import BlocklyWorkspace from "../../components/blockcoding/BlocklyWorkspace";
import { Block, Category } from "../../components/blockcoding/BlocklyElement";
import "../../components/blockcoding/blocks/CrawlingNowPrice";
import "../../components/blockcoding/blocks/CrawlingPeriodPrice";
import "../../components/blockcoding/blocks/DataFileInput";
import "../../components/blockcoding/blocks/DataSelect";
import "../../components/blockcoding/blocks/DataPreprocessing";
import "../../components/blockcoding/blocks/AnalysisCNN";
import "../../components/blockcoding/blocks/AnalysisLSTM";
import "../../components/blockcoding/blocks/AnalysisProphet";
import DisplayTable from "../../components/blockcoding/DisplayTable";
import DisplayChart from "../../components/blockcoding/DisplayChart";
import DisplayCode from "../../components/blockcoding/DisplayCode";
import store from "../../index.js";
import { getDataList, getUserDataSet } from "../../actions/index";

function BlockCoding() {
  const [simpleWorkspace] = useState(React.createRef());
  const dispatch = useDispatch();

  const user = JSON.parse(
    sessionStorage.getItem(
      `firebase:authUser:${process.env.REACT_APP_FIREBASE_APIKEY}:[DEFAULT]`
    )
  );

  dispatch(getDataList());
  dispatch(getUserDataSet(user.uid));

  // 실행 버튼
  function execute() {
    BlocklyJS.workspaceToCode(simpleWorkspace.current.workspace);
  }

  // 데이터 다운 버튼
  const dataDownload = () => {
    // 이거 기점으로 다운로드 링크 설정해줄게요 !
    if (store.getState().nowUserDataId[0] === "crawling") {
      console.log("crawling down");
    } else if (store.getState().nowUserDataId[0] === "prophet") {
      console.log("analysis down");
    }
    // 사용자가 지금 작업 중인 data랑 매칭 해줄 datanum
    const datanum = store.getState().userDataSetId[1];
    let url = "";

    // 이거 기점으로 다운로드 링크 설정해줄게요 !
    if (store.getState().userDataSetId[0] === "crawling") {
      url = `https://j4f002.p.ssafy.io/csv/download/userdataset/file/${datanum}`;
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        if (res.status === 200) {
          location.href = url;
        } else {
          alert("데이터를 다운받을 수 없습니다.");
        }
      });
    } else if (store.getState().userDataSetId[0] === "prophet") {
      url = `https://j4f002.p.ssafy.io/csv/download/userdatapredict/file/${datanum}`;
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        if (res.status === 200) {
          location.href = url;
        } else {
          alert("데이터를 다운받을 수 없습니다.");
        }
      });
    }
  };

  // 블록 작업실 초기화 버튼
  const reset = () => {
    simpleWorkspace.current.workspace.clear();
  };

  return (
    <div>
      <button onClick={execute}>실행</button>
      <button>저장</button>
      <button onClick={dataDownload}>데이터 다운</button>
      <button onClick={reset}>블록 작업실 초기화</button>
      <BlocklyWorkspace
        ref={simpleWorkspace}
        readOnly={false}
        trashcan={true}
        move={{
          scrollbars: true,
          drag: true,
          wheel: true,
        }}
        initialXml={`
          <xml xmlns="http://www.w3.org/1999/xhtml">
          </xml>
        `}
      >
        <React.Fragment>
          <Category name="데이터 수집">
            <Block type="crawling_now_price_field" />
            <Block type="crawling_period_price_field" />
            <Block type="data_file_input" />
            <Block type="data_select" />
            <Block type="data_preprocessing_field" />
          </Category>
          <Category name="데이터 분석">
            <Block type="analysis_cnn_field" />
            <Block type="analysis_lstm_field" />
            <Block type="analysis_prophet_field" />
          </Category>
        </React.Fragment>
      </BlocklyWorkspace>
      <div>
        <DisplayTable />
        <DisplayChart />
        <DisplayCode />
      </div>
    </div>
  );
}

export default BlockCoding;
