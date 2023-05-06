import { useEffect } from "react";

import vShaderSource from "./index.vert";
import fShaderSource from "./index.frag";
import { transform2Markdown } from "../util";

//声明初始化着色器函数
function initProgram(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string) {
    //创建顶点着色器对象
    var vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
    //创建片元着色器对象
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    //引入顶点、片元着色器源代码
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    //编译顶点、片元着色器
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    //创建程序对象program
    var program = gl.createProgram()!;
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
        -0.5, 0.5, 0.0, //Vertex 0
		-0.5,-0.5, 0.0, //Vertex 1
		 0.5,-0.5, 0.0, //Vertex 2
		 0.5, 0.5, 0.0  //Vertex 3
    ];
    const indices = [3, 2, 1, 3, 1, 0];
    const squareVertexBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // gl.bindBuffer(gl.ARRAY_BUFFER, null);

    const squareIndexBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return [squareVertexBuffer, squareIndexBuffer];
};

const draw = (id: string) => {
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
    const [squareVertexBuffer, squareIndexBuffer] = initBuffer(gl);

    const drawScene = (gl: WebGLRenderingContext, program: WebGLProgram): void => {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBuffer);
        const aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
        gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aVertexPosition);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareIndexBuffer);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    };
    renderLoop();

    function renderLoop() {
        window.requestAnimationFrame(renderLoop);
        drawScene(gl, program);
    }
};

const Square = () => {
    useEffect(() => {
        draw("canvas");
    }, []);
    return <canvas width={500} height={500} id="canvas"></canvas>;
};

const square = {
    Component: Square,
    vertex: `
    \r## 顶点着色器代码
    \r${transform2Markdown(vShaderSource)}
    `,
    fragment: `
    \r## 片元着色器代码
    \r${transform2Markdown(fShaderSource)}
    `,
};

export default square;
