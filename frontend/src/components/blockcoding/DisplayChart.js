import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Plotly from "plotly.js";

function DisplayChart({ result, data }) {
  if (Object.values(data).length > 1) {
    // datas를 날짜와 값만 뽑아서 가공
    let dataDisplay = [];
    let chartPlotly = [];
    let layout = {};

    // 데이터 수집 그래프 그리기
    if (result[0].slice(-8) === "crawling") {
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
      let yhatDisplay = [];
      let trendDisplay = [];
      let weeklyDisplay = [];
      let yearlyDisplay = [];

      if (data) {
        const datasDate = data.map((d) => d.ds);
        const datasYhat = data.map((d) => d.yhat);
        const datasClose = data.map((d) => d.Close);
        const datasTrend = data.map((d) => d.trend);
        const datasWeekly = data.map((d) => d.weekly);
        const datasYearly = data.map((d) => d.yearly);

        yhatDisplay = [datasDate, datasYhat, datasClose];
        trendDisplay = [datasDate, datasTrend];
        weeklyDisplay = [datasDate, datasWeekly];
        yearlyDisplay = [datasDate, datasYearly];
      }

      const yhatPlotly = {
        name: "yhat",
        x: yhatDisplay[0],
        y: yhatDisplay[1],
        line: { color: "red" },
        type: "scatter",
      };

      const closePlotly = {
        name: "Close",
        x: yhatDisplay[0],
        y: yhatDisplay[2],
        line: { color: "blue" },
        type: "scatter",
      };

      const trendPlotly = {
        name: "trend",
        x: trendDisplay[0],
        y: trendDisplay[1],
        line: { color: "yellow" },
        type: "scatter",
        xaxis: "x2",
        yaxis: "y2",
      };

      const weeklyPlotly = {
        name: "weekly",
        x: weeklyDisplay[0],
        y: weeklyDisplay[1],
        line: { color: "orange" },
        type: "scatter",
        xaxis: "x3",
        yaxis: "y3",
      };

      const yearlyPlotly = {
        name: "yearly",
        x: yearlyDisplay[0],
        y: yearlyDisplay[1],
        line: { color: "green" },
        type: "scatter",
        xaxis: "x4",
        yaxis: "y4",
      };

      chartPlotly = [
        yhatPlotly,
        closePlotly,
        trendPlotly,
        weeklyPlotly,
        yearlyPlotly,
      ];

      layout = {
        title: {
          text: "PROPHET 결과",
        },
        grid: {
          rows: 2,
          columns: 2,
          pattern: "independent",
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
          const datasEpoch = data.map((d) => d.epoch);
          const datasLoss = data.map((d) => d.loss);
          const datasValLoss = data.map((d) => d.val_loss);

          dataDisplay = [datasEpoch, datasLoss, datasValLoss];
        }

        chartPlotly = [
          {
            name: "loss",
            x: dataDisplay[0],
            y: dataDisplay[1],
            line: { color: "red" },
            type: "scatter",
          },
          {
            name: "val_loss",
            x: dataDisplay[0],
            y: dataDisplay[2],
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
          const datasDate = data.map((d) => d.Date);
          const datasActual = data.map((d) => d.actual);
          const datasTrain = data.map((d) => d.train_evaluate);
          const datasTest = data.map((d) => d.test_evaluate);

          dataDisplay = [datasDate, datasActual, datasTrain, datasTest];
        }

        chartPlotly = [
          {
            name: "actual",
            x: dataDisplay[0],
            y: dataDisplay[1],
            line: { color: "black" },
            type: "scatter",
          },
          {
            name: "train prediction",
            x: dataDisplay[0],
            y: dataDisplay[2],
            line: { color: "red" },
            type: "scatter",
          },
          {
            name: "test prediction",
            x: dataDisplay[0],
            y: dataDisplay[3],
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
        if (data) {
          const datasDate = data.map((d) => d.date);
          const datasFuture = data.map((d) => d.future);

          dataDisplay = [datasDate, datasFuture];
        }

        Plotly.addTraces("displayChart", {
          name: "future",
          x: dataDisplay[0],
          y: dataDisplay[1],
          line: { color: "blue" },
          type: "scatter",
        });
      }
    }
  } else if (Object.values(data).length > 0) {
    document.getElementById("displayChart").innerHTML =
      "<h5>차트를 그릴 수 없습니다.</h5>";
  } else if (result[0] === "initialize") {
    document.getElementById("displayChart").innerHTML = "";
  }

  return (
    <React.Fragment>
      <input name="nav" type="radio" className="nav" id="chart" />
      <div className="page chart-page">
        <div className="page-contents">
          <div className="displayContent" id="displayChart"></div>
        </div>
      </div>
      <label className="nav" htmlFor="chart">
        <span>차트</span>
      </label>
    </React.Fragment>
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
