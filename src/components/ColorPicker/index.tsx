import { FC, useEffect, useMemo, useRef, useState } from "react";

import { drawBg, drawCircle, calcuateColor } from "./util";

import styles from "./index.module.scss";

const ColorPicker: FC = () => {
    const ref = useRef<HTMLCanvasElement | null>(null);
    const [color, setColor] = useState<string>("#ff0000");
    const [position, setPosition] = useState<[number, number]>([0, 0]);
    // const [selectColor, setSelectColor] = useState<string>("#ff0000");
    // const [type] = useState<string>("HEX");

    const selectColor = useMemo<string>(() => {
        if (ref.current) {
            const { width, height } = ref.current;
            const [x, y] = position;
            return calcuateColor(x, y, width, height, color);
        } else {
            return "#FFFFFF";
        }
    }, [ref, position, color]);

    useEffect(() => {
        // 根据选中颜色绘制背景
        if (ref.current) {
            const canvas = ref.current;
            const ctx = canvas.getContext("2d")!;
            drawBg(ctx, color);
            drawCircle(ctx, ...position);
        }
    }, [ref, color, position]);

    useEffect(() => {
        if (ref.current) {
            // 添加事件
            const canvas = ref.current;
            const { left, top } = canvas.getBoundingClientRect();
            const [width, height] = [canvas.width, canvas.height];
            const onMouseMove = (e: MouseEvent) => {
                const [x, y] = [e.clientX, e.clientY];
                const finalX = x < left ? 0 : x > left + width ? width : x - left;
                const finalY = y < top ? 0 : y > top + height ? height : y - top;
                setPosition([finalX, finalY]);
            };
            const addMouseUpFn = () => {
                document.removeEventListener("mousemove", onMouseMove);
            };
            canvas.onmousedown = (e) => {
                const [x, y] = [e.offsetX, e.offsetY];
                setPosition([x, y]);
                document.addEventListener("mousemove", onMouseMove);
            };
            canvas.onmouseup = (e) => {
                document.removeEventListener("mousemove", onMouseMove);
            };
            document.addEventListener("mouseup", addMouseUpFn);
            return () => {
                canvas.onmousedown = null;
                canvas.onmouseup = null;
                document.removeEventListener("mouseup", addMouseUpFn);
            };
        }
    }, [ref]);

    return (
        <div className={styles.main}>
            <div className={styles.left}></div>
            <div className={styles.right}>
                <div className={styles.top}>
                    <div className={styles.color} style={{ backgroundColor: selectColor ?? "#fff" }}></div>
                    <div className={styles.text}>{selectColor}</div>
                </div>
                <div className={styles.bottom}>
                    <canvas className={styles.canvas} ref={ref} width={300} height={200}></canvas>
                    <div className={styles.picker}></div>
                </div>
            </div>
        </div>
    );
};

export default ColorPicker;
