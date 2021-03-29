import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Plotly from "plotly.js";

function DisplayChart({ result, data }) {
  if (Object.values(data).length > 0) {
    // datas를 날짜와 값만 뽑아서 가공
    let dataDisplay = [];
    let chartPlotly = [];

    if (result[0] === "crawling") {
      if (data) {
        const dataDate = data.map((d) => d.data_set_date);
        const dataValue = data.map((d) => d.data_set_value);

        dataDisplay = [dataDate, dataValue];
      }

      // 그래프 그리기
      chartPlotly = [
        {
          x: dataDisplay[0],
          y: dataDisplay[1],
          line: { color: "#17BECF" },
          type: "scatter",
        },
      ];
    } else if (result[0] === "prophet") {
      if (data) {
        const datasDate = data.map((d) => d.ds);
        const datasYhat = data.map((d) => d.yhat);
        const datasClose = data.map((d) => d.Close);

        dataDisplay = [datasDate, datasYhat, datasClose];
      }

      // 그래프 그리기
      chartPlotly = [
        {
          x: dataDisplay[0],
          y: dataDisplay[1],
          line: { color: "red" },
          type: "scatter",
        },
        {
          x: dataDisplay[0],
          y: dataDisplay[2],
          line: { color: "#17BECF" },
          type: "scatter",
        },
      ];
    }

    Plotly.newPlot("displayChart", chartPlotly);
  }

  return <div className="displayChart" id="displayChart"></div>;
}

DisplayChart.propTypes = {
  result: PropTypes.array,
  data: PropTypes.array,
};

export default connect((state) => ({
  result: state.userDataSetId,
  data: state.displayData,
}))(DisplayChart);
