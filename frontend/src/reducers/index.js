const initialState = {
  dataLists: {},
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_DATA_LIST":
      return { ...state, dataLists: action.payload };
    default:
      return state;
  }
};

export default rootReducer;
