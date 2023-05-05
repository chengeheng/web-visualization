import { useEffect } from "react";

import vShaderSource from "./index.vert";
import fShaderSource from "./index.frag";
import { transform2Markdown } from "../../util";

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

const MultiPoint = () => {
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
        const program = initShader(gl, vertexShaderSource, fragShaderSource);

        // prettier-ignore
        const vertices = new Float32Array([
             0.5, 0.5,
            -0.5,-0.5,
             0.5,-0.5,
            -0.5, 0.5
        ]);
        const n = 4;

        const vertexBuffer = gl.createBuffer();
        // 将缓冲区对象绑定到目标
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        // 向缓冲区对象中写入数据
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const a_Position = gl.getAttribLocation(program, "a_Position");
        // 将缓冲区对象分配给a_Position变量
        // 最后一个变量设置从哪个点开始读当前的坐标
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        // 连接a_Position变量与分配给它的缓冲区对象
        gl.enableVertexAttribArray(a_Position);

        const a_PointSize = gl.getAttribLocation(program, "a_PointSize");

        // 将顶点位置传输给attribute变量
        gl.vertexAttrib1f(a_PointSize, 5.0);

        gl.clearColor(1, 1, 1, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        // TODO 没法显示4个点，应该是参数错误
        gl.drawArrays(gl.POINTS, 0, n);
    }, []);
    return (
        <canvas
            style={{ width: "500px", height: "500px", boxShadow: "3px 3px 6px #e1e1e1" }}
            width={500}
            height={500}
            id="canvas"
        ></canvas>
    );
};

const multiPoint = {
    component: MultiPoint,
    keyCode: `
    \r## 顶点着色器代码
    \r${transform2Markdown(vShaderSource)}
    \r## 片元着色器代码
    \r${transform2Markdown(fShaderSource)}
    `,
};

export default multiPoint;
