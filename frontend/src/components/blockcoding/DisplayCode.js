import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

function DisplayCode({ code }) {
  return (
    <React.Fragment>
      <input name="nav" type="radio" className="nav" id="code" />
      <div className="page">
        <div className="page-contents displayCode">{code}</div>
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
