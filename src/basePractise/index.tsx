import { useState, useMemo, lazy, Suspense } from "react";

import routes from "./route";

import styles from "./index.module.scss";

const BasePractise = () => {
    const [activeKey, setActiveKey] = useState("point");
    const Cmp = useMemo(() => {
        const item = routes.find((i) => i.key === activeKey);
        return lazy(item?.component!);
    }, [activeKey]);
    const keyCode = useMemo(() => {
        const item = routes.find((i) => i.key === activeKey);
        return item?.keyCode;
    }, [activeKey]);
    return (
        <div className={styles.main}>
            <div className={styles.slider}>
                {routes.map((i, index) => {
                    return (
                        <div
                            className={styles.sliderItem}
                            key={i.key}
                            onClick={() => setActiveKey(i.key)}
                        >
                            <span>{`${index + 1} - ${i.title}`}</span>
                        </div>
                    );
                })}
            </div>
            <div className={styles.demo}>
                <Suspense fallback="loading...">
                    <Cmp />
                </Suspense>
            </div>
            <div className={styles.keycode}>{keyCode}</div>
        </div>
    );
};

export default BasePractise;
