import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Plotly from "plotly.js";

function DisplayTable({ result, data }) {
  if (Object.values(data).length > 1) {
    // datas를 날짜와 값만 뽑아서 가공
    let dataDisplay = [];
    let tablePlotly = [];

    // 데이터 수집 그래프 그리기
    if (result[0] === "crawling") {
      if (data) {
        const dataDate = data.map((d) => d.data_set_date);
        const dataValue = data.map((d) => d.data_set_value);

        dataDisplay = [dataDate, dataValue];
      }

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

      document.getElementById("displayTable").innerHTML = "";
      Plotly.newPlot("displayTable", tablePlotly);
    }
    // Prophet 그래프 그리기
    else if (result[0] === "prophet") {
      if (data) {
        const datasDate = data.map((d) => d.ds);
        const datasYhat = data.map((d) => d.yhat);
        const datasClose = data.map((d) => d.Close);

        dataDisplay = [datasDate, datasYhat, datasClose];
      }

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

      document.getElementById("displayTable").innerHTML = "";
      Plotly.newPlot("displayTable", tablePlotly);
    }

    // CNN 그래프 그리기
    else if (
      result[0] === "cnn training" ||
      result[0] === "cnn evaluate" ||
      result[0] === "cnn predict"
    ) {
      if (result[0] === "cnn training") {
        if (data) {
          const datasLoss = data.map((d) => d.loss);
          const datasValLoss = data.map((d) => d.val_loss);

          dataDisplay = [datasLoss, datasValLoss];
        }

        tablePlotly = [
          {
            type: "table",
            header: {
              values: [["<b>Loss</b>"], ["<b>Var_Loss</b>"]],
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

        Plotly.newPlot("displayTable", tablePlotly);
      } else if (result[0] === "cnn evaluate") {
        if (data) {
          const datasTrain = data.map((d) => d.x_train_prediction);
          const datasTest = data.map((d) => d.x_test_prediction);

          dataDisplay = [datasTrain, datasTest];
        }

        tablePlotly = [
          {
            type: "table",
            header: {
              values: [["<b>Table_Prediction</b>"], ["<b>Test_Prediction</b>"]],
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

        Plotly.newPlot("displayTable", tablePlotly);
      } else if (result[0] === "cnn predict") {
        const datasFuture = data.map((d) => d.future);
        const datasDisplay = [datasFuture];

        tablePlotly = [
          {
            type: "table",
            header: {
              values: [["<b>Future</b>"]],
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

        Plotly.newPlot("displayTable", tablePlotly);
      }
    }
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
