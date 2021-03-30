import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

function DisplayCode({ code }) {
  let codeToString = "";

  for (let index = 0; index < code.length; index++) {
    codeToString += code[index];
    codeToString += "\n";
  }

  return (
    <div className="displayCode">
      <div className="displayTitle">
        <span>코드</span>
      </div>
      <div className="displayContent">{codeToString}</div>
    </div>
  );
}

DisplayCode.propTypes = {
  code: PropTypes.array,
};

export default connect((state) => ({ code: state.displayCode }))(DisplayCode);
