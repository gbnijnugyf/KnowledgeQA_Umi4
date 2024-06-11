// reducer.js

import { ADD_COURSE, SELECT_NODE, SET_BASEURL } from './action';
import { BASEURL } from './services/plugin/globalInter';

const initialState = {
  selectedNode: null,
  baseUrl: BASEURL,
  // ...other state
};

const reducer = (state = initialState, action: { type: any; payload: any }) => {
  switch (action.type) {
    case SELECT_NODE:
      return {
        ...state,
        selectedNode: action.payload,
      };
    case SET_BASEURL:
      return {
        ...state,
        setBaseUrl: action.payload,
      };
    case ADD_COURSE:
      return {
        ...state,
        addCourse: action.payload,
      };
    // ...other cases
    default:
      return state;
  }
};

export default reducer;
