import { useRoutes } from "react-router-dom";

import routes from "./route";

import styles from "./App.module.scss";

const App = () => {
    const element = useRoutes(routes);
    return <div className={styles.main}>{element}</div>;
};

export default App;
