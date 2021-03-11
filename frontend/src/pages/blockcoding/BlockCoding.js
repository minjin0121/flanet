import React, { useState } from "react";
import BlocklyWorkspace from "../../components/blockcoding/BlocklyWorkspace";
import {
  Block,
  Category,
  Value,
  Field,
  Shadow,
} from "../../components/blockcoding/BlocklyElement";

function BlockCoding() {
  const [simpleWorkspace] = useState(React.createRef());

  return (
    <div>
      <header>
        {/* 버튼 껍데기 기능 X */}
        <button>실행</button>
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
          <Category name="데이터 수집">
            <Block type="logic_compare" />
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
