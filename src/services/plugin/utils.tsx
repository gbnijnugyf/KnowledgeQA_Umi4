import React from "react";
import { MenuItem, RouteItem } from "./globalInter";
import { Navigate } from "@umijs/max";

export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值
}

export const loopMenuItem = (menus: MenuItem[], pId: number | string): RouteItem[] => {
  return menus.flatMap((item) => {
    let Component: React.ComponentType<any> | null = null;
    if (item.page) {
      // 防止配置了路由，但本地暂未添加对应的页面，产生的错误
      Component = React.lazy(() => new Promise((resolve, reject) => {
          import(`@/pages${item.page}`)
              .then(module => resolve(module))
              // .catch((error) => resolve(import(`../pages/404.tsx`)))
      }))
    }
    if (item.children) {
      return [
        {
          path: item.url,
          name: item.menuName,
          icon: item.icon,
          id: item.menuID,
          parentId: pId,
          children: [
            {
              path: item.url,
              element: <Navigate to={item.children[0].url} replace />,
            },
            ...loopMenuItem(item.children, item.menuID)
          ]
        }
      ]
    } else {
      return [
        {
          path: item.url,
          name: item.menuName,
          icon: item.icon,
          id: item.menuID,
          parentId: pId,
          children:[],
          element: (
            <React.Suspense fallback={<div>Loading...</div>}>
              {Component && <Component />}
            </React.Suspense>
          )
        }
      ]
    }
  })
}