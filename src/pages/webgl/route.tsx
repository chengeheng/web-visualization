import { RouteObject, Navigate } from "react-router-dom";

import Square from "./ch02-Square";
import RenderingModes from "./ch02-RenderingModes";

const route = [
    {
        chapter: "02",
        path: "square",
        id: "square",
        element: <Square.Component />,
        vertex: Square.vertex,
        fragment: Square.fragment,
    },
    {
        chapter: "02",
        path: "renderingModes",
        id: "renderingModes",
        element: <RenderingModes.Component />,
        vertex: RenderingModes.vertex,
        fragment: RenderingModes.fragment,
    },
    // {
    //     chapter: "01",
    //     path: "ajaxjson",
    //     id: "ajaxjson",
    //     element: lazy(() => import("./ch01-AjaxJSON")),
    // },
];

const routes: RouteObject[] = route.map((i) => {
    return {
        ...i,
        element: i.element,
    };
});

routes.push({
    path: "*",
    element: <Navigate to={route[0]?.path} />,
});

export { route, routes };
