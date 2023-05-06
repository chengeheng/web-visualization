import { FC, useMemo } from "react";
import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import { Menu } from "antd";
import type { MenuProps } from "antd";

import { route, routes } from "./route";

import styles from "./index.module.scss";

const menus: MenuProps["items"] = route.map((i) => {
    return {
        label: i.title!,
        key: i.path!,
        keypath: i.path,
    };
});

const Main: FC = () => {
    const element = useRoutes(routes);
    const navigate = useNavigate();
    const location = useLocation();

    const activeKey = useMemo(() => {
        const { pathname } = location;
        const item = routes.find((i) => pathname.indexOf(`/${i.path!.split("*")[0]}`) > -1);
        return item?.path!;
    }, [location]);

    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <Menu selectedKeys={[activeKey]} onClick={(e) => navigate(e.key)} mode="horizontal" items={menus} />
            </div>
            <div className={styles.content}>{element}</div>
        </div>
    );
};

export default Main;
