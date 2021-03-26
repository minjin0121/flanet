export const getDataList = () => (dispatch) => {
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

export default getDataList;
