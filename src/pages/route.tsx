import { RouteObject, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

const route = [
    {
        path: "webgl",
        id: "webgl",
        element: lazy(() => import("./webgl")),
    },
    {
        path: "threejs",
        id: "threejs",
        element: lazy(() => import("./threejs")),
    },
];

const routes: RouteObject[] = route.map((i) => {
    return {
        ...i,
        element: (
            <Suspense fallback={<div>loading...</div>}>
                <i.element />
            </Suspense>
        ),
    };
});

routes.push({
    path: "*",
    element: <Navigate to={route[0]?.path} />,
});

export default routes;
