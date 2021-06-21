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
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

const main = () => {
	const canvas = document.getElementById("canvas");
	const gl = getWebGLContext(canvas);

	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		throw "Failed to intialize shaders.";
	}

	const a_Position = gl.getAttribLocation(gl.program, "a_Position");
	const a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");
	if (a_Position < 0) {
		throw "Failed to get the storage location of a_Position";
	}

	// 将顶点位置传输给attribute变量
	gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
	gl.vertexAttrib1f(a_PointSize, 5.0);

	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.drawArrays(gl.POINTS, 0, 1);
};

main();
