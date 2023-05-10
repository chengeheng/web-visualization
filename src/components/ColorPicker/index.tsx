import { FC, useEffect, useRef, useState } from "react";

import { drawBg } from "./util";

import styles from "./index.module.scss";

const ColorPicker: FC = () => {
    const ref = useRef<HTMLCanvasElement | null>(null);
    const [color] = useState<string>("");
    const [type] = useState<string>("HEX");

    useEffect(() => {
        if (ref.current) {
            const canvas = ref.current;
            const ctx = canvas.getContext("2d")!;
            drawBg(ctx, "#ff0000");
        }
    }, [ref]);

    return (
        <div className={styles.main}>
            <div className={styles.left}></div>
            <div className={styles.right}>
                <canvas className={styles.canvas} ref={ref} width={300} height={300}></canvas>
                <div className={styles.color}>
                    <div className={styles.des}>
                        <div className={styles.text} style={{ backgroundColor: color ?? "#fff" }}>
                            {color}
                        </div>
                        <div className={styles.label}>{type}</div>
                    </div>
                    <div className={styles.change}></div>
                </div>
            </div>
        </div>
    );
};

export default ColorPicker;
