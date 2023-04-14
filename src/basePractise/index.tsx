import { useState, useMemo, Suspense } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkCold } from "react-syntax-highlighter/dist/esm/styles/prism";

import routes from "@/basePractise/route";

import styles from "./index.module.scss";

const BasePractise = () => {
    const [activeKey, setActiveKey] = useState("point");
    const Cmp = useMemo(() => {
        const item = routes.find((i) => i.key === activeKey);
        return item?.component!;
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
                        <div className={styles.sliderItem} key={i.key} onClick={() => setActiveKey(i.key)}>
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
            <div className={styles.keycode}>
                <ReactMarkdown
                    components={{
                        code: ({ children = [], className, ...props }) => {
                            const match = /language-(\w+)/.exec(className || "");
                            return (
                                <SyntaxHighlighter
                                    language={match?.[1]}
                                    showLineNumbers={true}
                                    style={coldarkCold as any}
                                    PreTag="div"
                                    className="syntax-hight-wrapper"
                                    {...props}
                                >
                                    {children as string[]}
                                </SyntaxHighlighter>
                            );
                        },
                    }}
                >
                    {keyCode!}
                </ReactMarkdown>
            </div>
        </div>
    );
};

export default BasePractise;
