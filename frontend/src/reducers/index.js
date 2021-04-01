const initialState = {
  dataLists: {},
  userDataSets: {},
  userModelSets: {},
  userDataSetId: [],
  displayData: [],
  displayCode: "",
  modelingStep: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_DATA_LIST":
      return { ...state, dataLists: action.payload };
    case "GET_USER_DATA_SET":
      return { ...state, userDataSets: action.payload };
    case "GET_USER_MODEL_SET":
      return { ...state, userModelSets: action.payload };
    case "SET_USER_DATA_SET_ID":
      return { ...state, userDataSetId: action.payload };
    case "SET_DISPLAY_DATA":
      return { ...state, displayData: action.payload };
    case "SET_DISPLAY_CODE":
      return { ...state, displayCode: action.payload };
    case "SET_MODELING_STEP":
      return {
        ...state,
        modelingStep: [...state.modelingStep, action.payload],
      };
    case "INIT_MODELING_STEP":
      return {
        ...state,
        modelingStep: state.modelingStep.slice(action.payload + 1),
      };
    default:
      return state;
  }
};

export default rootReducer;
