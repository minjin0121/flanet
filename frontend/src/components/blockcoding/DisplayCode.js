import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

function DisplayCode({ code }) {
  return <div className="displayCode">{code}</div>;
}

DisplayCode.propTypes = {
  code: PropTypes.array,
};

export default connect((state) => ({ code: state.displayCode }))(DisplayCode);
