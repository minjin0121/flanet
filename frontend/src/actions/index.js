export const getDataList = function () {
  return function (dispatch) {
    fetch(`https://j4f002.p.ssafy.io/api/data/datalist/all`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        dispatch({
          type: "GET_DATA_LIST",
          payload: res,
        });
      });
  };
};

export const getUserDataSet = function (userId) {
  return function (dispatch) {
    fetch(`https://j4f002.p.ssafy.io/api/data/userdataset/select/${userId}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        dispatch({
          type: "GET_USER_DATA_SET",
          payload: res,
        });
      });
  };
};

export const getUserModelSet = function (userId) {
  return function (dispatch) {
    fetch(`https://j4f002.p.ssafy.io/api/data/trainingmodel/select/${userId}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        dispatch({
          type: "GET_USER_MODEL_SET",
          payload: res,
        });
      });
  };
};

export const setUserDataSetId = function (userDataSetId) {
  return {
    type: "SET_USER_DATA_SET_ID",
    payload: userDataSetId,
  };
};

export const setDisplayData = function (data) {
  return {
    type: "SET_DISPLAY_DATA",
    payload: data,
  };
};

export const setDisplayCode = function (code) {
  return {
    type: "SET_DISPLAY_CODE",
    payload: code,
  };
};

export const setModelingStep = function (step) {
  return {
    type: "SET_MODELING_STEP",
    payload: step,
  };
};

export const initModelingStep = function (length) {
  return {
    type: "INIT_MODELING_STEP",
    payload: length,
  };
};
