import { useEffect } from "react";

import vShaderSource from "./basePoint.vert";
import fShaderSource from "./basePoint.frag";
import { transform2Markdown } from "../util";

//声明初始化着色器函数
function initShader(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string) {
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

const BasePoint = () => {
    useEffect(() => {
        //通过getElementById()方法获取canvas画布
        var canvas = document.getElementById("canvas")! as HTMLCanvasElement;
        //通过方法getContext()获取WebGL上下文
        var gl = canvas.getContext("webgl")!;
        //顶点着色器源码
        var vertexShaderSource = vShaderSource;

        //片元着色器源码
        var fragShaderSource = fShaderSource;

        //初始化着色器
        initShader(gl, vertexShaderSource, fragShaderSource);
        //开始绘制，显示器显示结果
        gl.drawArrays(gl.POINTS, 0, 1);
    }, []);
    return <canvas style={{ width: "500px", height: "500px" }} width={500} height={500} id="canvas"></canvas>;
};

const basePoint = {
    component: BasePoint,
    keyCode: `
    \r## 顶点着色器代码
    \r${transform2Markdown(vShaderSource)}
    \r## 片元着色器代码
    \r${transform2Markdown(fShaderSource)}
    `,
};

export default basePoint;
