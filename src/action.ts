import { SelectNodeType } from "./pages/KnowledgeGraph";

// actions.js
export const SELECT_NODE = 'SELECT_NODE';

export const selectNode = (node: SelectNodeType) => ({
  type: SELECT_NODE,
  payload: node,
});
