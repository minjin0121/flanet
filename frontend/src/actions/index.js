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

export const setNowUserDataId = function (nowUserDataId) {
  return function (dispatch) {
    dispatch({
      type: "SET_NOW_USER_DATA_ID",
      payload: nowUserDataId,
    });
  };
};

export const setData = function (datas) {
  return function (dispatch) {
    dispatch({
      type: "SET_DATA",
      payload: datas,
    });
  };
};

export const setNowCode = function (nowCode) {
  return function (dispatch) {
    dispatch({
      type: "SET_NOW_CODE",
      payload: nowCode,
    });
  };
};
