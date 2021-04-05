import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import { CodeMirror } from "codemirror";

function DisplayCode({ code }) {
  // const textarea = document.getElementsByClassName("displayContent");

  // CodeMirror.fromTextArea(textarea, {
  //   lineNumbers: true,
  //   lineWrapping: true,
  //   theme: "eclipse",
  //   val: textarea.value,
  // });

  const myCode = code;

  return (
    <React.Fragment>
      <input name="nav" type="radio" className="nav" id="code" />
      <div className="page code-page">
        <div className="page-contents">
          <div className="displayCode">
            {/* <CodeMirror
              value={code}
              options={options}
              onBeforeChange={(editor, data, code) => {
                this.setState({code});
              }}
              onChange={(editor, value) => {
                console.log('controlled', {code});
              }}
            /> */}
            {myCode}
          </div>
        </div>
      </div>
      <label className="nav" htmlFor="code">
        <span>코드</span>
      </label>
    </React.Fragment>
  );
}

DisplayCode.propTypes = {
  code: PropTypes.string,
};

export default connect((state) => ({ code: state.displayCode }))(DisplayCode);
