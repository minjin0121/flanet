import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Plotly from "plotly.js";
import store from "../../index.js";
import { setCNNChartMark } from "../../actions/index";

function DisplayChart({ result, data }) {
  if (Object.values(data).length > 1) {
    // datas를 날짜와 값만 뽑아서 가공
    let dataDisplay = [];
    let chartPlotly = [];
    let layout = {};

    // 데이터 수집 그래프 그리기
    if (result[0] === "crawling") {
      if (data) {
        const dataDate = data.map((d) => d.data_set_date);
        const dataValue = data.map((d) => d.data_set_value);

        dataDisplay = [dataDate, dataValue];
      }

      chartPlotly = [
        {
          x: dataDisplay[0],
          y: dataDisplay[1],
          line: { color: "#17BECF" },
          type: "scatter",
        },
      ];

      layout = {
        title: {
          text: "데이터 수집 결과",
        },
      };

      document.getElementById("displayChart").innerHTML = "";
      Plotly.newPlot("displayChart", chartPlotly, layout);
    }
    // Prophet 그래프 그리기
    else if (result[0] === "prophet") {
      if (data) {
        const datasDate = data.map((d) => d.ds);
        const datasYhat = data.map((d) => d.yhat);
        const datasClose = data.map((d) => d.Close);

        dataDisplay = [datasDate, datasYhat, datasClose];
      }

      chartPlotly = [
        {
          name: "yhat",
          x: dataDisplay[0],
          y: dataDisplay[1],
          line: { color: "red" },
          type: "scatter",
        },
        {
          name: "Close",
          x: dataDisplay[0],
          y: dataDisplay[2],
          line: { color: "#17BECF" },
          type: "scatter",
        },
      ];

      layout = {
        title: {
          text: "PROPHET 결과",
        },
      };

      document.getElementById("displayChart").innerHTML = "";
      Plotly.newPlot("displayChart", chartPlotly, layout);
    }
    // TENSORFLOW (CNN, LSTM) 그래프 그리기
    else if (
      result[0] === "training" ||
      result[0] === "evaluate" ||
      result[0] === "predict"
    ) {
      if (result[0] === "training") {
        if (data) {
          const datasLoss = data.map((d) => d.loss);
          const datasValLoss = data.map((d) => d.val_loss);

          dataDisplay = [datasLoss, datasValLoss];
        }

        chartPlotly = [
          {
            name: "loss",
            y: dataDisplay[0],
            line: { color: "red" },
            type: "scatter",
          },
          {
            name: "var_loss",
            y: dataDisplay[1],
            line: { color: "#17BECF" },
            type: "scatter",
          },
        ];

        layout = {
          title: {
            text: "모델 훈련 결과",
          },
        };

        Plotly.newPlot("displayChart", chartPlotly, layout);
      } else if (result[0] === "evaluate") {
        if (data) {
          const datasTrain = data.map((d) => d.x_train_prediction);
          let datasTest = data.map((d) => d.x_test_prediction);

          datasTest = datasTest.filter(function (d) {
            return d !== "";
          });

          dataDisplay = [datasTrain, datasTest];
        }

        const datasTrainLength = dataDisplay[0].length;
        const idxTrain = [];

        for (let i = 1; i <= datasTrainLength + 2; i++) {
          idxTrain.push(i);
        }

        const datasTestLength = dataDisplay[1].length;
        const idxTest = [];

        for (
          let i = datasTrainLength;
          i <= datasTrainLength + datasTestLength + 1;
          i++
        ) {
          idxTest.push(i);
        }

        store.dispatch(setCNNChartMark(datasTrainLength + datasTestLength));

        chartPlotly = [
          {
            name: "test prediction",
            x: idxTrain,
            y: dataDisplay[0],
            line: { color: "red" },
            type: "scatter",
          },
          {
            name: "train prediction",
            x: idxTest,
            y: dataDisplay[1],
            line: { color: "#17BECF" },
            type: "scatter",
          },
        ];

        layout = {
          title: {
            text: "모델 평가 결과",
          },
        };

        Plotly.newPlot("displayChart", chartPlotly, layout);
      } else if (result[0] === "predict") {
        const datasFuture = data.map((d) => d.future);
        const idx = [];

        const chart = store.getState().cnnChartMark;

        for (let i = chart + 1; i <= chart + data.length; i++) {
          idx.push(i);
        }

        Plotly.addTraces("displayChart", {
          name: "future",
          x: idx,
          y: datasFuture,
          line: { color: "blue" },
          type: "scatter",
        });
      }
    }
  } else if (Object.values(data).length > 0) {
    document.getElementById("displayChart").innerHTML =
      "<h5>차트를 그릴 수 없습니다.</h5>";
  }

  return (
    <div className="displayChart">
      <div className="displayTitle">
        <span>차트</span>
      </div>
      <div className="displayContent" id="displayChart"></div>
    </div>
  );
}

DisplayChart.propTypes = {
  result: PropTypes.array,
  data: PropTypes.array,
};

export default connect((state) => ({
  result: state.userDataSetId,
  data: state.displayData,
}))(DisplayChart);
