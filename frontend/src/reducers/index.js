const initialState = {
  dataLists: {},
  userDataSets: {},
  userDataSetId: [],
  displayData: [],
  displayCode: [],
  cnnChartMark: 0,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_DATA_LIST":
      return { ...state, dataLists: action.payload };
    case "GET_USER_DATA_SET":
      return { ...state, userDataSets: action.payload };
    case "SET_USER_DATA_SET_ID":
      return { ...state, userDataSetId: action.payload };
    case "SET_DISPLAY_DATA":
      return { ...state, displayData: action.payload };
    case "SET_DISPLAY_CODE":
      return { ...state, displayCode: action.payload };
    case "SET_CNN_CHART_MARK":
      return { ...state, cnnChartMark: action.payload };
    default:
      return state;
  }
};

export default rootReducer;
