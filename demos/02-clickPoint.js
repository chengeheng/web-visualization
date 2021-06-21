// /**
//  * @type {HTMLCanvasElement}
//  */
// const canvas = document.getElementById("canvas");
// const gl = canvas.getContext("webgl");

const VSHADER_SOURCE = `
    attribute vec4 a_Position;
	attribute float a_PointSize;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = a_PointSize;
    }
`;

const FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
    }
`;

const main = () => {
	/**
	 * @type {HTMLCanvasElement}
	 */
	const canvas = document.getElementById("canvas");
	const gl = getWebGLContext(canvas);
	// const gl = canvas.getContext("webgl");

	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		throw "Failed to intialize shaders.";
	}

	const a_Position = gl.getAttribLocation(gl.program, "a_Position");
	const a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");

	const u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");

	if (a_Position < 0) {
		throw "Failed to get the storage location of a_Position";
	}

	// 将顶点位置传输给attribute变量
	gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
	gl.vertexAttrib1f(a_PointSize, 10.0);

	// 将点的颜色传输到u_FragColor变量中
	gl.uniform4f(
		u_FragColor,
		Math.random().toFixed(2),
		Math.random().toFixed(2),
		Math.random().toFixed(2),
		1.0
	);

	gl.clearColor(0.0, 0.0, 0.0, 0.0);

	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.drawArrays(gl.POINTS, 0, 1);

	canvas.onmousedown = e => {
		const { clientX, clientY } = e;
		const rect = e.target.getBoundingClientRect();
		let relativeX = (clientX - rect.left - 250) / 250;
		let relativeY = -(clientY - rect.top - 250) / 250;
		// 将顶点位置传输给attribute变量
		gl.vertexAttrib3f(a_Position, relativeX, relativeY, 0.0);
		gl.uniform4f(
			u_FragColor,
			Math.random().toFixed(2),
			Math.random().toFixed(2),
			Math.random().toFixed(2),
			1.0
		);

		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.drawArrays(gl.POINTS, 0, 1);
	};
};

main();
