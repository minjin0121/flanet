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
