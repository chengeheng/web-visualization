import basePoint from "./basePoint/index";
import multiPoint from "./multiPoint/index";

const routes = [
    {
        component: basePoint.component,
        keyCode: basePoint.keyCode,
        title: "点显示",
        key: "point",
    },
    {
        component: multiPoint.component,
        keyCode: multiPoint.keyCode,
        title: "多点显示",
        key: "multiPoint",
    },
];

export default routes;
