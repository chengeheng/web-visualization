/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const gl = getWebGLContext(canvas);

const VSHADER_SOURCE = `
        attribute vec4 a_Position;
        attribute vec4 a_Color;
        uniform mat4 u_ViewMatirx;
        uniform mat4 u_ProjMatrix;
        varying vec4 v_Color;
        void main() {
            gl_Position = u_ProjMatrix * u_ViewMatirx  * a_Position;
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
            // 右侧的3个三角形
			0.75, 1.0, -4.0, 0.4, 1.0, 0.4, // 绿色三角形在最后面
			0.25, -1.0, -4.0, 0.4, 1.0, 0.4, 
			1.25, -1.0, -4.0, 1.0, 0.4, 0.4,

			0.75, 1.0, -2.0, 1.0, 1.0, 0.4, // 黄色三角形在中间
			0.25, -1.0, -2.0, 1.0, 1.0, 0.4,
			1.25, -1.0, -2.0, 1.0, 0.4, 0.4,

			0.75, 1.0, 0.0, 0.4, 0.4, 1.0, // 蓝色三角形在最前面
			0.25, -1.0, 0.0, 0.4, 0.4, 1.0, 
			1.25, -1.0, 0.0, 1.0, 0.4, 0.4,

			// 左侧的3个三角形
			-0.75, 1.0, -4.0, 0.4, 1.0, 0.4, // 绿色三角形在最后面
			-1.25, -1.0, -4.0, 1.0, 0.4, 0.4,
			-0.25, -1.0, -4.0, 0.4, 1.0, 0.4, 

			-0.75, 1.0, -2.0, 1.0, 1.0, 0.4, // 黄色三角形在中间
			-1.25, -1.0, -2.0, 1.0, 0.4, 0.4,
			-0.25, -1.0, -2.0, 1.0, 1.0, 0.4,

			-0.75, 1.0, 0.0, 0.4, 0.4, 1.0, // 蓝色三角形在最前面
			-1.25, -1.0, 0.0, 1.0, 0.4, 0.4,
			-0.25, -1.0, 0.0, 0.4, 0.4, 1.0, 
        ]);
	const n = 18;

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

const main = () => {
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		throw "Failed to intialize shaders.";
	}
	const n = initVertexBuffers();

	const viewMatrix = new Matrix4();
	viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);

	const projMatrix = new Matrix4();
	projMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);

	// 获取u_ViewMatirx变量的存储地址
	const u_ViewMatirx = gl.getUniformLocation(gl.program, "u_ViewMatirx");
	const u_ProjMatrix = gl.getUniformLocation(gl.program, "u_ProjMatrix");

	// 将视角矩阵传给u_ViewMatirx变量
	gl.uniformMatrix4fv(u_ViewMatirx, false, viewMatrix.elements);
	gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.drawArrays(gl.TRIANGLES, 0, n);
};
main();
