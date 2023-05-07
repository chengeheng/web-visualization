import { useEffect, useState } from "react";

import vShaderSource from "./index.vert";
import fShaderSource from "./index.frag";
import { transform2Markdown } from "../util";
import { Select } from "antd";

//声明初始化着色器函数
function initProgram(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string) {
    //创建顶点着色器对象
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
    //创建片元着色器对象
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    //引入顶点、片元着色器源代码
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    //编译顶点、片元着色器
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    //创建程序对象program
    const program = gl.createProgram()!;
    //附着顶点着色器和片元着色器到program
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    //链接program
    gl.linkProgram(program);
    //使用program
    gl.useProgram(program);
    //返回程序program对象
    return program;
}

const initBuffer = (gl: WebGLRenderingContext): WebGLBuffer[] => {
    // prettier-ignore
    const vertices = [
        -0.5,   -0.5,    0.0, 	//Vertex 0
        -0.25,   0.5,    0.0, 	//Vertex 1
         0.0,   -0.5,    0.0,  //Vertex 2
         0.25,   0.5,    0.0,  //Vertex 3
         0.5,   -0.5,    0.0	//Vertex 4
    ];

    const vertexBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const indicesBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);

    return [vertexBuffer, indicesBuffer];
};

const draw = (id: string, type: string) => {
    //通过getElementById()方法获取canvas画布
    const canvas = document.getElementById(id)! as HTMLCanvasElement;
    //通过方法getContext()获取WebGL上下文
    const gl = canvas.getContext("webgl")!;
    //顶点着色器源码
    const vertexShaderSource = vShaderSource;
    //片元着色器源码
    const fragShaderSource = fShaderSource;
    //Initializes the program (shaders). More about this on chapter 3!
    const program = initProgram(gl, vertexShaderSource, fragShaderSource);
    //Initializes the buffers that we are going to use to draw the square (vertex buffer and index buffer)
    initBuffer(gl);

    const drawScene = (gl: WebGLRenderingContext, program: WebGLProgram, renderingType: string): void => {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, canvas.width, canvas.height);

        const aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
        gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aVertexPosition);

        switch (renderingType) {
            case "TRIANGLES": {
                const indices = [0, 1, 2, 2, 3, 4];
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
                gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
                break;
            }
            case "LINES": {
                const indices = [1, 3, 0, 4, 1, 2, 2, 3];
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
                gl.drawElements(gl.LINES, indices.length, gl.UNSIGNED_SHORT, 0);
                break;
            }
            case "POINTS": {
                const indices = [0, 1, 2, 3, 4];
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
                gl.drawElements(gl.POINTS, indices.length, gl.UNSIGNED_SHORT, 0);
                break;
            }
            case "LINE_LOOP": {
                const indices = [2, 3, 4, 1, 0];
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
                gl.drawElements(gl.LINE_LOOP, indices.length, gl.UNSIGNED_SHORT, 0);
                break;
            }
            case "LINE_STRIP": {
                const indices = [2, 3, 4, 1, 0];
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
                gl.drawElements(gl.LINE_STRIP, indices.length, gl.UNSIGNED_SHORT, 0);
                break;
            }
            case "TRIANGLE_STRIP": {
                const indices = [0, 1, 2, 3, 4];
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
                gl.drawElements(gl.TRIANGLE_STRIP, indices.length, gl.UNSIGNED_SHORT, 0);
                break;
            }
            case "TRIANGLE_FAN": {
                const indices = [0, 1, 2, 3, 4];
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
                gl.drawElements(gl.TRIANGLE_FAN, indices.length, gl.UNSIGNED_SHORT, 0);
                break;
            }
        }
    };

    const renderLoop = () => {
        window.requestAnimationFrame(renderLoop);
        drawScene(gl, program, type);
    };

    renderLoop();
};

const Main = () => {
    const [type, setType] = useState<string>("TRIANGLES");
    useEffect(() => {
        draw("canvas", type);
    }, [type]);
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <Select
                value={type}
                style={{ width: 200, marginLeft: "10px" }}
                onSelect={(e) => setType(e)}
                options={[
                    {
                        lable: "TRIANGLES",
                        value: "TRIANGLES",
                    },
                    {
                        lable: "LINES",
                        value: "LINES",
                    },
                    {
                        lable: "POINTS",
                        value: "POINTS",
                    },
                    {
                        lable: "LINE_LOOP",
                        value: "LINE_LOOP",
                    },
                    {
                        lable: "LINE_STRIP",
                        value: "LINE_STRIP",
                    },
                    {
                        lable: "TRIANGLE_STRIP",
                        value: "TRIANGLE_STRIP",
                    },
                    {
                        lable: "TRIANGLE_FAN",
                        value: "TRIANGLE_FAN",
                    },
                ]}
            ></Select>
            <canvas width={500} height={500} id="canvas"></canvas>
        </div>
    );
};

const main = {
    Component: Main,
    vertex: `
    \r## 顶点着色器代码
    \r${transform2Markdown(vShaderSource)}
    `,
    fragment: `
    \r## 片元着色器代码
    \r${transform2Markdown(fShaderSource)}
    `,
};

export default main;
