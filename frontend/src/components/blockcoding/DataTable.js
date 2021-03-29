import React from "react";
import Plotly from "plotly.js";
import store from "../../index.js";

function DataTable() {
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

  // 표 그리기
  const dataPlotly = [
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

  Plotly.newPlot("dataset", dataPlotly);

  return (
    <div className="div1" id="dataset">
      데이터
    </div>
  );
}

export default DataTable;
