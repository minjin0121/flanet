import React from "react";
import Plotly from "plotly.js";
import store from "../../index.js";

function DataVisualization() {
  // 화면에 표시할 데이터
  const datas = store.getState().datas;

  // datas를 날짜와 값만 뽑아서 가공
  let datasDisplay = [];

  if (datas) {
    const datasDate = datas.data_set.map((d) => d.data_set_date);
    const datasValue = datas.data_set.map((d) => d.data_set_value);

    datasDisplay = [datasDate, datasValue];
    console.log(datasDisplay);
  }

  // 그래프 그리기
  // 각각의 값들 매칭 => 날짜(x축), 예측 값(평균), 최소 예측값, 최대 예측값, 기존 데이터
  const visualPlotly = [
    {
      // mode: "lines",
      // name: "AAPL High",
      x: datasDisplay[0],
      y: datasDisplay[1],
      line: { color: "#17BECF" },
      type: "scatter",
    },
  ];

  Plotly.newPlot("visualization", visualPlotly);

  return (
    <div className="div2" id="visualization">
      시각화
    </div>
  );
}

export default DataVisualization;
