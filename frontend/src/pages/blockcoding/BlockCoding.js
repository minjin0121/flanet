import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Plotly from "plotly.js";
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
import {
  getDataList,
  getUserDataSet,
  setNowUserDataId,
  setData,
  setNowCode,
} from "../../actions/index";
// import DataTable from "../../components/blockcoding/DataTable";
// import DataVisualization from "../../components/blockcoding/DataVisualization";
import store from "../../index.js";

function BlockCoding() {
  const [simpleWorkspace] = useState(React.createRef());
  const dispatch = useDispatch();
  const [code, setCode] = useState("code");

  const user = JSON.parse(
    sessionStorage.getItem(
      `firebase:authUser:${process.env.REACT_APP_FIREBASE_APIKEY}:[DEFAULT]`
    )
  );

  dispatch(getDataList());
  dispatch(getUserDataSet(user.uid));
  dispatch(setData(0));
  dispatch(setNowUserDataId(105));
  dispatch(setNowCode("코드입니다."));

  // let DataTableArea = "";
  // let DataVisualizationArea = "";

  // 실행 버튼
  function execute() {
    // 코드 반환용 code 둘 중 하나 사용 예정

    // return문용
    setCode(BlocklyJS.workspaceToCode(simpleWorkspace.current.workspace));
    // store용 => 현재 작동하는건 이 친구
    setCode(store.getState().nowCode);

    // DataTableArea = DataTable();
    // DataVisualizationArea = DataVisualization();
    // 화면에 표시할 데이터
    const datas = store.getState().datas;

    // datas를 날짜와 값만 뽑아서 가공
    let datasDisplay = [];
    let dataPlotly = [];
    let visualPlotly = [];

    if (store.getState().nowUserDataId[0] === "crawling") {
      console.log("this is crawling");

      if (datas) {
        const datasDate = datas.map((d) => d.data_set_date);
        const datasValue = datas.map((d) => d.data_set_value);

        datasDisplay = [datasDate, datasValue];
        console.log(datasDisplay);
      }

      // 표 그리기
      dataPlotly = [
        {
          type: "table",
          header: {
            values: [["<b>Date</b>"], ["<b>Value</b>"]],
            align: "center",
            line: { width: 1, color: "black" },
            fill: { color: "grey" },
            font: { family: "Arial", size: 12, color: "white" },
          },
          cells: {
            values: datasDisplay,
            align: "center",
            line: { color: "black", width: 1 },
            font: { family: "Arial", size: 11, color: ["black"] },
          },
        },
      ];

      // 그래프 그리기
      visualPlotly = [
        {
          x: datasDisplay[0],
          y: datasDisplay[1],
          line: { color: "#17BECF" },
          type: "scatter",
        },
      ];
    } else if (store.getState().nowUserDataId[0] === "prophet") {
      console.log("this is prophet");

      if (datas) {
        const datasDate = datas.map((d) => d.ds);
        const datasYhat = datas.map((d) => d.yhat);
        const datasClose = datas.map((d) => d.Close);

        datasDisplay = [datasDate, datasYhat, datasClose];
        console.log(datasDisplay);
      }

      // 표 그리기
      dataPlotly = [
        {
          type: "table",
          header: {
            values: [["<b>Date</b>"], ["<b>Yhat</b>"], ["<b>Close</b>"]],
            align: "center",
            line: { width: 1, color: "black" },
            fill: { color: "grey" },
            font: { family: "Arial", size: 12, color: "white" },
          },
          cells: {
            values: datasDisplay,
            align: "center",
            line: { color: "black", width: 1 },
            font: { family: "Arial", size: 11, color: ["black"] },
          },
        },
      ];

      // 그래프 그리기
      visualPlotly = [
        {
          x: datasDisplay[0],
          y: datasDisplay[1],
          line: { color: "red" },
          type: "scatter",
        },
        {
          x: datasDisplay[0],
          y: datasDisplay[2],
          line: { color: "#17BECF" },
          type: "scatter",
        },
      ];
    }

    Plotly.newPlot("dataset", dataPlotly);
    Plotly.newPlot("visualization", visualPlotly);
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
    const datanum = store.getState().nowUserDataId;

    fetch(
      `https://j4f002.p.ssafy.io/csv/download/userdataset/file/${datanum}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      if (res.status === 200) {
        location.href = `https://j4f002.p.ssafy.io/csv/download/userdataset/file/${datanum}`;
      } else {
        alert("데이터를 다운받을 수 없습니다.");
      }
    });
  };

  // 블록 작업실 초기화 버튼
  const reset = () => {
    simpleWorkspace.current.workspace.clear();
  };

  return (
    <div>
      {/* 버튼 */}
      <button onClick={execute}>실행</button>
      <button>저장</button>
      <button onClick={dataDownload}>데이터 다운</button>
      <button onClick={reset}>블록 작업실 초기화</button>
      {/* Blockly Workspace */}
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
        {/* Blockly Block 선언 */}
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
      {/* 영역 표시 기능 X */}
      <div>
        {/* {DataTableArea}
        {DataVisualizationArea} */}
        <div className="div1" id="dataset">
          데이터
        </div>
        <div className="div2" id="visualization">
          시각화
        </div>
        <div className="div3" id="code">
          코드 <br />
          {code}
        </div>
      </div>
    </div>
  );
}

export default BlockCoding;
