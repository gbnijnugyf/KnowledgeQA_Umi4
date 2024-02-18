import { SelectNodeType } from "./pages/KnowledgeGraph";

// actions.js
export const SELECT_NODE = 'SELECT_NODE';
export const ADD_COURSE = 'ADD_COURSE';


export const selectNode = (node: SelectNodeType) => ({
  type: SELECT_NODE,
  payload: node,
});

export const addCourse = (sign:boolean) => ({
  type: ADD_COURSE,
  payload: sign,
});



