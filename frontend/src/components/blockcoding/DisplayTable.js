import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Plotly from "plotly.js";

function DisplayTable({ result, data }) {
  if (Object.values(data).length > 1) {
    // datas를 날짜와 값만 뽑아서 가공
    let dataDisplay = [];
    let tablePlotly = [];
    let layout = {};

    // 데이터 수집 그래프 그리기
    if (result[0].slice(-8) === "crawling") {
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

      layout = {
        title: {
          text: "데이터 수집 결과",
        },
      };

      document.getElementById("displayTable").innerHTML = "";
      Plotly.newPlot("displayTable", tablePlotly, layout);
    }
    // Prophet 그래프 그리기
    else if (result[0] === "prophet") {
      if (data) {
        const datasDate = data.map((d) => d.ds);
        const datasYhat = data.map((d) => d.yhat);
        const datasClose = data.map((d) => d.Close);
        const datasTrend = data.map((d) => d.trend);
        const datasWeekly = data.map((d) => d.weekly);
        const datasYearly = data.map((d) => d.yearly);

        dataDisplay = [
          datasDate,
          datasYhat,
          datasClose,
          datasTrend,
          datasWeekly,
          datasYearly,
        ];
      }

      tablePlotly = [
        {
          type: "table",
          header: {
            values: [
              ["<b>Date</b>"],
              ["<b>Yhat</b>"],
              ["<b>Close</b>"],
              ["<b>Trend</b>"],
              ["<b>Weekly</b>"],
              ["<b>Yearly</b>"],
            ],
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

      layout = {
        title: {
          text: "PROPHET 결과",
        },
      };

      document.getElementById("displayTable").innerHTML = "";
      Plotly.newPlot("displayTable", tablePlotly, layout);
    }

    // TENSORFLOW (CNN, LSTM) 그래프 그리기
    else if (
      result[0] === "training" ||
      result[0] === "evaluate" ||
      result[0] === "predict"
    ) {
      if (result[0] === "training") {
        if (data) {
          const datasEpoch = data.map((d) => d.epoch);
          const datasLoss = data.map((d) => d.loss);
          const datasValLoss = data.map((d) => d.val_loss);

          dataDisplay = [datasEpoch, datasLoss, datasValLoss];
        }

        tablePlotly = [
          {
            type: "table",
            header: {
              values: [["<b>Epos</b>"], ["<b>Loss</b>"], ["<b>Var_Loss</b>"]],
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

        layout = {
          title: {
            text: "모델 훈련 결과",
          },
        };

        Plotly.newPlot("displayTable", tablePlotly, layout);
      } else if (result[0] === "evaluate") {
        if (data) {
          const datasDate = data.map((d) => d.Date);
          const datasActual = data.map((d) => d.actual);
          const datasTrain = data.map((d) => {
            if (d.train_evaluate) {
              return d.train_evaluate;
            }
            return "";
          });
          const datasTest = data.map((d) => {
            if (d.test_evaluate) {
              return d.test_evaluate;
            }
            return "";
          });

          dataDisplay = [datasDate, datasActual, datasTrain, datasTest];
        }

        tablePlotly = [
          {
            type: "table",
            header: {
              values: [
                ["<b>Date</b>"],
                ["<b>Actual</b>"],
                ["<b>Table_Prediction</b>"],
                ["<b>Test_Prediction</b>"],
              ],
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

        layout = {
          title: {
            text: "모델 평가 결과",
          },
        };

        Plotly.newPlot("displayTable", tablePlotly, layout);
      } else if (result[0] === "predict") {
        if (data) {
          const datasDate = data.map((d) => d.date);
          const datasFuture = data.map((d) => d.future);

          dataDisplay = [datasDate, datasFuture];
        }

        tablePlotly = [
          {
            type: "table",
            header: {
              values: [["<b>Date</b>"], ["<b>Future</b>"]],
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

        layout = {
          title: {
            text: "모델 예측 결과",
          },
        };

        Plotly.newPlot("displayTable", tablePlotly, layout);
      }
    }
  } else if (Object.values(data).length > 0) {
    document.getElementById("displayTable").innerHTML = `<h5>${data}</h5>`;
  } else if (result[0] === "initialize") {
    document.getElementById("displayTable").innerHTML = "";
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
