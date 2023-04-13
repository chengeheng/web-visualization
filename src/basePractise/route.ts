import point from "./point";

const routes = [
    {
        component: point.basePoint.component,
        keyCode: point.basePoint.keyCode,
        title: "点显示",
        key: "point",
    },
    {
        component: point.multiPoint.component,
        keyCode: point.multiPoint.keyCode,
        title: "多点显示",
        key: "multiPoint",
    },
];

export default routes;
