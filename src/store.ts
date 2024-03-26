import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducer';  // 你的 reducer 文件的路径

const store = configureStore({
  reducer: rootReducer,
});

export default store;
