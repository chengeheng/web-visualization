/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const gl = getWebGLContext(canvas);

const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    uniform mat4 u_MvpMatrix;
    varying vec4 v_Color;
    void main() {
        gl_Position = u_MvpMatrix * a_Position;
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
        // 顶点颜色和坐标
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, // v0 白色
        -1.0, 1.0, 1.0, 1.0, 0.0, 1.0, // v1 品红色
        -1.0, -1.0, 1.0, 1.0, 0.0, 0.0, // v2 红色
        1.0, -1.0, 1.0, 1.0, 0.0, 0.0, // v3 黄色
        1.0, -1.0, -1.0, 0.0, 1.0, 0.0, // v4 绿色
        1.0, 1.0, -1.0, 0.0, 1.0, 1.0, // v5 青色
        -1.0, 1.0, -1.0, 0.0, 0.0, 1.0, // v6 蓝色
        -1.0, -1.0, -1.0, 0.0, 0.0, 0.0, // v7 黑色
    ]);

	// prettier-ignore
	const indices = new Uint8Array([
        0, 1, 2, 0, 2, 3, // 前
        0, 3, 4, 0, 4, 5, // 右
        0, 5, 6, 0, 6, 1, // 上
        1, 6, 7, 1, 7, 2, // 左
        7, 4, 3, 7, 3, 2, // 下
        4, 7, 6, 4, 6, 5, // 后
    ])

	const vertexColorbuffer = gl.createBuffer();
	const indexBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
	gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

	const FSIZE = verticesColors.BYTES_PER_ELEMENT;

	const a_Position = gl.getAttribLocation(gl.program, "a_Position");
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);

	const a_Color = gl.getAttribLocation(gl.program, "a_Color");
	gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);

	gl.enableVertexAttribArray(a_Position);
	gl.enableVertexAttribArray(a_Color);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

	return indices.length;
};

const main = () => {
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		throw "Failed to intialize shaders.";
	}
	const n = initVertexBuffers();

	const mvpMatrix = new Matrix4();
	mvpMatrix.setPerspective(30, 1, 1, 100);
	mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);

	// 获取u_ViewMatirx变量的存储地址
	const u_MvpMatrix = gl.getUniformLocation(gl.program, "u_MvpMatrix");

	// 将视角矩阵传给u_ViewMatirx变量
	gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
};
main();
