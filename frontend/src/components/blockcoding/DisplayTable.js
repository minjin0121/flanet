import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Plotly from "plotly.js";

function DisplayTable({ result, data }) {
  if (Object.values(data).length > 1) {
    // datas를 날짜와 값만 뽑아서 가공
    let dataDisplay = [];
    let tablePlotly = [];

    if (result[0] === "crawling") {
      if (data) {
        const dataDate = data.map((d) => d.data_set_date);
        const dataValue = data.map((d) => d.data_set_value);

        dataDisplay = [dataDate, dataValue];
      }

      // 표 그리기
      tablePlotly = [
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
            values: dataDisplay,
            align: "center",
            line: { color: "black", width: 1 },
            font: { family: "Arial", size: 11, color: ["black"] },
          },
        },
      ];
    } else if (result[0] === "prophet") {
      if (data) {
        const datasDate = data.map((d) => d.ds);
        const datasYhat = data.map((d) => d.yhat);
        const datasClose = data.map((d) => d.Close);

        dataDisplay = [datasDate, datasYhat, datasClose];
      }

      // 표 그리기
      tablePlotly = [
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
            values: dataDisplay,
            align: "center",
            line: { color: "black", width: 1 },
            font: { family: "Arial", size: 11, color: ["black"] },
          },
        },
      ];
    }

    document.getElementById("displayTable").innerHTML = "";
    Plotly.newPlot("displayTable", tablePlotly);
  } else if (Object.values(data).length > 0) {
    document.getElementById("displayTable").innerHTML = `<h5>${data}</h5>`;
  }

  return (
    <div className="displayTable">
      <div className="displayTitle">
        <span>데이터</span>
      </div>
      <div className="displayContent" id="displayTable"></div>
    </div>
  );
}

DisplayTable.propTypes = {
  result: PropTypes.array,
  data: PropTypes.array,
};

export default connect((state) => ({
  result: state.userDataSetId,
  data: state.displayData,
}))(DisplayTable);
