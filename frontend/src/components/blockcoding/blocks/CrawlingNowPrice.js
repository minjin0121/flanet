import * as Blockly from "blockly/core";
import "blockly/javascript";

const crawlingNowPrice = {
  type: "crawling_now_price",
  message0: "실시간 크롤링 : %1의 주가",
  args0: [
    {
      type: "field_dropdown",
      name: "STOCK",
      options: [
        ["삼성전자", "1"],
        ["카카오", "2"],
      ],
    },
  ],
  nextStatement: null,
  colour: 444,
};

Blockly.Blocks.crawling_now_price_field = {
  init() {
    this.jsonInit(crawlingNowPrice);
  },
};

Blockly.JavaScript.crawling_now_price_field = function (block) {
  const stockId = block.getField("STOCK").value_;
  const user = JSON.parse(
    sessionStorage.getItem(
      `firebase:authUser:${process.env.REACT_APP_FIREBASE_APIKEY}:[DEFAULT]`
    )
  );

  fetch(`https://j4f002.p.ssafy.io/api/crawling/stocks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data_list_id: stockId,
      user_id: user.uid,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
    });

  return "return문 : 실시간 데이터 겟 \n";
};
