const initialState = {
  dataLists: {},
  userDataSets: {},
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_DATA_LIST":
      return { ...state, dataLists: action.payload };
    case "GET_USER_DATA_SET":
      return { ...state, userDataSets: action.payload };
    default:
      return state;
  }
};

export default rootReducer;
