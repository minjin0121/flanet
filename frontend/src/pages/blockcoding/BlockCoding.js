import React, { useState } from "react";
import BlocklyJS from "blockly/javascript";
import BlocklyWorkspace from "../../components/blockcoding/BlocklyWorkspace";
import {
  Block,
  Category,
  Value,
  Field,
  Shadow,
} from "../../components/blockcoding/BlocklyElement";
import "../../components/blockcoding/blocks/CrawlingNowPrice";
import "../../components/blockcoding/blocks/CrawlingPeriodPrice";
import "../../components/blockcoding/blocks/DataPreprocessing";

function BlockCoding() {
  const [simpleWorkspace] = useState(React.createRef());

  const execute = () => {
    const check = BlocklyJS.workspaceToCode(simpleWorkspace.current.workspace);

    console.log(check);
  };

  return (
    <div>
      <header>
        {/* 버튼 */}
        <button onClick={execute}>실행</button>
        <button>데이터 다운</button>
        <button>분석결과 다운</button>
        {/* Blockly Workspace */}
        <BlocklyWorkspace
          ref={simpleWorkspace}
          readOnly={false}
          trashcan={true}
          move={{
            scrollbars: true,
            drag: true,
            wheel: true,
          }}
          initialXml={`
            <xml xmlns="http://www.w3.org/1999/xhtml">
            </xml>
          `}
        >
          {/* Blockly Block 선언 */}
          <React.Fragment>
            <Category name="데이터 수집">
              <Block type="crawling_now_price_field" />
              <Block type="crawling_period_price_field" />
              <Block type="data_preprocessing_field" />
            </Category>
            <Category name="데이터 분석">
              <Block type="controls_repeat_ext">
                <Value name="TIMES">
                  <Shadow type="math_number">
                    <Field name="NUM">10</Field>
                  </Shadow>
                </Value>
              </Block>
            </Category>
          </React.Fragment>
        </BlocklyWorkspace>
        {/* 영역 표시 기능 X */}
        <div>
          <div className="div1"> 여기가 분석 결과 화면 </div>
          <div className="div2"> 여기가 코드 화면 </div>
        </div>
      </header>
    </div>
  );
}

export default BlockCoding;
