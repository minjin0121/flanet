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
  const execute = () => {
    const check = BlocklyJS.workspaceToCode(simpleWorkspace.current.workspace);

    console.log(check);

    // 실행 시 시각화
    // [동식님 says] prophet 모델에서는 추론 값이 날짜(x축), 예측 값(평균), 최소 예측값, 최대 예측값, 기존 데이터으로 던져줄꺼에요!

    // 시각화할 csv 주소
    const csvAddress =
      "https://raw.githubusercontent.com/plotly/datasets/master/finance-charts-apple.csv";

    Plotly.d3.csv(csvAddress, function (rows) {
      console.log(rows);

      function unpack(atts, key) {
        return atts.map(function (att) {
          return att[key];
        });
      }

      // 각각의 값들 매칭 => 날짜(x축), 예측 값(평균), 최소 예측값, 최대 예측값, 기존 데이터
      const trace1 = {
        type: "scatter",
        mode: "lines",
        name: "AAPL High",
        x: unpack(rows, "Date"),
        y: unpack(rows, "AAPL.High"),
        line: { color: "#17BECF" },
      };

      const data = [trace1];

      const layout = {
        title: "시각화 결과는!",
      };

      Plotly.newPlot("visualization", data, layout);
    });
  };

  // 데이터 다운 버튼
  const dataDownload = () => {
    // 사용자가 지금 작업 중인 data랑 매칭 해줄 datanum
    const datanum = 105;

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
      <button>분석결과 다운</button>
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
        <div className="div1">데이터</div>
        <div className="div2" id="visualization">
          시각화
        </div>
        <div className="div3">코드</div>
      </div>
    </div>
  );
}

export default BlockCoding;
