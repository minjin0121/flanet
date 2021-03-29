const initialState = {
  dataLists: {},
  userDataSets: {},
  datas: {},
  nowUserDataId: {},
  nowCode: "",
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_DATA_LIST":
      return { ...state, dataLists: action.payload };
    case "GET_USER_DATA_SET":
      return { ...state, userDataSets: action.payload };
    case "SET_NOW_USER_DATA_ID":
      return { ...state, nowUserDataId: action.payload };
    case "SET_DATA":
      return { ...state, datas: action.payload };
    case "SET_NOW_CODE":
      return { ...state, nowCode: action.payload };
    default:
      return state;
  }
};

export default rootReducer;
