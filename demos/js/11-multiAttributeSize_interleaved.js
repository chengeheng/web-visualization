/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const gl = getWebGLContext(canvas);

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

const initVertexBuffers = () => {
	// prettier-ignore
	const vertices = new Float32Array([
         0.0, 0.5, 10.0,
         -0.5, -0.5, 20.0,
         0.5, -0.5, 30.0
     ]);
	const n = 3;

	const vertexBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	const FSIZE = vertices.BYTES_PER_ELEMENT;

	const a_Position = gl.getAttribLocation(gl.program, "a_Position");
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0);

	const a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");
	gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2);

	gl.enableVertexAttribArray(a_Position);
	gl.enableVertexAttribArray(a_PointSize);

	return n;
};

const main = () => {
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		throw "Failed to intialize shaders.";
	}

	const n = initVertexBuffers();

	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.drawArrays(gl.POINTS, 0, n);
};

main();
