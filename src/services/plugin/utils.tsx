import React from 'react';
import { MenuItem, RouteItem } from './globalInter';

export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值
}

//防抖
type ThisParameterType<T> = T extends (this: infer U, ...args: any[]) => any ? U : unknown;
export function debounce<F extends (this: any, ...args: any[]) => any>(
  func: F,
  wait: number,
): (this: ThisParameterType<F>, ...args: Parameters<F>) => void {
  let timeout: NodeJS.Timeout | null;
  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    const later = () => {
      timeout = null;
      func.apply(this, args);
    };
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

//将列表转换为一组columns个的二维数组
export function convertTo2DArray<T>(arr: T[], columns: number): T[][] {
  const result: T[][] = [];
  const rows = Math.ceil(arr.length / columns);

  for (let i = 0; i < rows; i++) {
    const row = arr.slice(i * columns, (i + 1) * columns);
    result.push(row);
  }

  return result;
}
