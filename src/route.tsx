import { RouteObject, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

const route = [
    {
        path: "/*",
        id: "main",
        element: lazy(() => import("./pages")),
    },
];
if (process.env.NODE_ENV === "development") {
    route.push({
        path: "/test",
        id: "test",
        element: lazy(() => import("./test")),
    });
}

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
    element: <Navigate to={routes[0].path!} />,
});

export default routes;
