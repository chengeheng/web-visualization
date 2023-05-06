import { FC, useMemo, useState } from "react";
import { useNavigate, useRoutes } from "react-router-dom";
import { Select, Tabs } from "antd";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkCold } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { TabsProps } from "antd";

import { route, routes } from "./route";

import styles from "./index.module.scss";

const options = route.map((i) => {
    return {
        label: `${i.chapter}-${i.id}`,
        value: i.path,
    };
});

const Main: FC = () => {
    const element = useRoutes(routes);
    const [select, setSelect] = useState<string>(route[0].path);

    const navigate = useNavigate();

    const tabs: TabsProps["items"] = useMemo(() => {
        if (!select) return [];
        const item = route.find((i) => select === i.path);
        return [
            {
                key: "vertex",
                label: "顶点着色器",
                children: (
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
                        {item?.vertex!}
                    </ReactMarkdown>
                ),
            },
            {
                key: "fragment",
                label: "片元着色器",
                children: (
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
                        {item?.fragment!}
                    </ReactMarkdown>
                ),
            },
        ];
    }, [select]);

    return (
        <div className={styles.main}>
            <div className={styles.top}>
                <div className={styles.lable}>当前章节</div>
                <Select
                    style={{ width: 200 }}
                    defaultValue={route[0].path}
                    options={options}
                    onSelect={(e) => {
                        const item = route.find((i) => e === i.path);
                        navigate(item?.path!);
                        setSelect(e);
                    }}
                />
            </div>
            <div className={styles.content}>
                <div className={styles.code}>
                    <Tabs items={tabs}></Tabs>
                </div>
                <div className={styles.canvas}>{element}</div>
            </div>
        </div>
    );
};

export default Main;
