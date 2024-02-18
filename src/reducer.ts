// reducer.js

import { ADD_COURSE, SELECT_NODE } from './action';

const initialState = {
  selectedNode: null,
  // ...other state
};

const reducer = (state = initialState, action: { type: any; payload: any }) => {
  switch (action.type) {
    case SELECT_NODE:
      return {
        ...state,
        selectedNode: action.payload,
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
