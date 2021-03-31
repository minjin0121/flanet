import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

function DisplayCode({ code }) {
  return (
    <div className="displayCode">
      <div className="displayTitle">
        <span>코드</span>
      </div>
      <div className="displayContent">{code}</div>
    </div>
  );
}

DisplayCode.propTypes = {
  code: PropTypes.string,
};

export default connect((state) => ({ code: state.displayCode }))(DisplayCode);
