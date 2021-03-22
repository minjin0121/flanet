import * as Blockly from "blockly/core";
import "@blockly/field-date";
import "blockly/javascript";

const crawlingPeriodPrice = {
  type: "crawling_period_price",
  message0: "기간별 크롤링 : %1의 주가, 기간 %2 ~ %3",
  args0: [
    {
      type: "field_dropdown",
      name: "STOCK",
      options: [
        ["삼성전자", "1"],
        ["카카오", "2"],
      ],
    },
    {
      type: "field_date",
      name: "STARTDATE",
      date: "2016-03-17",
    },
    {
      type: "field_date",
      name: "ENDDATE",
      date: "2021-03-19",
    },
  ],
  nextStatement: null,
  colour: 444,
};

Blockly.Blocks.crawling_period_price_field = {
  init() {
    this.jsonInit(crawlingPeriodPrice);
  },
};

Blockly.JavaScript.crawling_period_price_field = function (block) {
  const stockId = block.getField("STOCK").value_;
  const startDate = block.getField("STARTDATE").value_;
  const endDate = block.getField("ENDDATE").value_;
  const user = JSON.parse(
    sessionStorage.getItem(
      `firebase:authUser:${process.env.REACT_APP_FIREBASE_APIKEY}:[DEFAULT]`
    )
  );

  fetch(`https://j4f002.p.ssafy.io/api/crawling/stocks/period`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data_list_id: stockId,
      user_id: user.uid,
      user_data_set_start: startDate,
      user_data_set_end: endDate,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
    });

  return "return문 : 기간별 데이터 겟 \n";
};
