import ColorPicker from "@/components/ColorPicker";
import styles from "./index.module.scss";

const Test: React.FC = () => {
    return (
        <div className={styles.main}>
            <ColorPicker />
        </div>
    );
};

export default Test;
