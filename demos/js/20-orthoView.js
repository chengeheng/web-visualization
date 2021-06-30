/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const gl = getWebGLContext(canvas);

const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    uniform mat4 u_ProjMatrix;
    varying vec4 v_Color;
    void main() {
        gl_Position = u_ProjMatrix * a_Position;
        v_Color = a_Color;
    }
`;

const FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_Color;
    void main() {
        gl_FragColor = v_Color;
    }
`;

const initVertexBuffers = () => {
	// prettier-ignore
	const verticesColors = new Float32Array([
         // 顶点坐标和颜色
         0.0, 0.5, -0.4, 0.4, 1.0, 0.4, // 绿色三角形在最后面
         -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
         0.5, -0.5, -0.4, 1.0, 0.4, 0.4,
 
         0.5, 0.4, -0.2, 1.0, 0.4, 0.4, // 黄色三角形在中间
         -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
         0.0, -0.6, -0.2, 1.0, 1.0, 0.4,
 
         0.0, 0.5, 0.0, 0.4, 0.4, 1.0, // 蓝色三角形在最前面
         -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
         0.5, -0.5, 0.0, 1.0, 0.4, 0.4
     ]);
	const n = 9;

	const vertexColorbuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
	gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

	const FSIZE = verticesColors.BYTES_PER_ELEMENT;

	const a_Position = gl.getAttribLocation(gl.program, "a_Position");
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);

	const a_Color = gl.getAttribLocation(gl.program, "a_Color");
	gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);

	gl.enableVertexAttribArray(a_Position);
	gl.enableVertexAttribArray(a_Color);

	return n;
};

let g_near = 0.0,
	g_far = 0.5;

const keydown = (keyCode, n, u_ProjMatrix, projMatrix, nf) => {
	switch (keyCode) {
		case 39:
			g_near += 0.01;
			break;
		case 37:
			g_near -= 0.01;
			break;
		case 38:
			g_far += 0.01;
			break;
		case 40:
			g_far -= 0.01;
			break;
		default:
			return;
	}
	draw(n, u_ProjMatrix, projMatrix, nf);
};

const draw = (n, u_ProjMatrix, projMatrix, nf) => {
	// 使用矩阵设置可视空间
	projMatrix.setOrtho(-1, 1, -1, 1, g_near, g_far);

	// 将投影矩阵传给u_ProjMatrix变量
	gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

	gl.clear(gl.COLOR_BUFFER_BIT);
	nf.innerHTML = `near: ${Math.round(g_near * 100) / 100}, far:${
		Math.round(g_far * 100) / 100
	};`;
	gl.drawArrays(gl.TRIANGLES, 0, n);
};

const main = () => {
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		throw "Failed to intialize shaders.";
	}
	const n = initVertexBuffers();
	const nf = document.getElementById("nearFar");

	// 获取u_ProjMatrix变量的存储地址
	const u_ProjMatrix = gl.getUniformLocation(gl.program, "u_ProjMatrix");
	// 设置视点、视线和上方向
	const projMatrix = new Matrix4();

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	document.onkeydown = e => {
		const { keyCode } = e;
		keydown(keyCode, n, u_ProjMatrix, projMatrix, nf);
	};

	draw(n, u_ProjMatrix, projMatrix, nf);
};
main();
