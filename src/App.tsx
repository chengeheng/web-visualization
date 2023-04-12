import { useMemo, useState, lazy, Suspense } from "react";
import styles from "./App.module.scss";

const routes = [
    {
        title: "基础练习",
        key: "basePractise",
        component: () => import("./basePractise"),
    },
];

const App = () => {
    const [activeKey, setActiveKey] = useState("basePractise");
    const Cmp = useMemo(() => {
        const item = routes.find((i) => i.key === activeKey);
        return lazy(item?.component!);
    }, [activeKey]);
    return (
        <div className={styles.main}>
            <div className={styles.header}>
                {routes.map((i) => {
                    return (
                        <div
                            className={styles.item}
                            key={i.key}
                            onClick={() => setActiveKey(i.key)}
                        >
                            <span>{i.title}</span>
                        </div>
                    );
                })}
            </div>
            <div className={styles.content}>
                <Suspense fallback="loading...">
                    <Cmp />
                </Suspense>
            </div>
        </div>
    );
};

export default App;
