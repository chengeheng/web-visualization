// /**
//  * @type {HTMLCanvasElement}
//  */
// const canvas = document.getElementById("canvas");
// const gl = canvas.getContext("webgl");

const canvas = document.getElementById("canvas");
const gl = getWebGLContext(canvas);

const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    void main() {
        gl_Position = a_Position;
    }
`;

const FSHADER_SOURCE = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

const initVertexBuffers = gl => {
	// prettier-ignore
	const vertices = new Float32Array([
        0.5, 0.5, 
        0.5, -0.5,
        -0.5, -0.5,
        -0.5, 0.5
    ]);
	const n = 4;

	const vertexBuffer = gl.createBuffer();
	if (!vertexBuffer) {
		throw "Failed to create the buffer object.";
		return -1;
	}

	// 将缓冲区对象绑定到目标
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	// 向缓冲区对象中写入数据
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	const a_Position = gl.getAttribLocation(gl.program, "a_Position");
	// 将缓冲区对象分配给a_Position变量
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
	// 连接a_Position变量与分配给它的缓冲区对象
	gl.enableVertexAttribArray(a_Position);
	return [n, vertexBuffer];
};

const main = () => {
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		throw "Failed to intialize shaders.";
	}

	const [n, vertexBuffer] = initVertexBuffers(gl);

	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
	setTimeout(() => {
		gl.clear(gl.COLOR_BUFFER_BIT);
		console.log("start updating");
		// prettier-ignore
		const vertices = new Float32Array([
			-0.5, 0.5,
			-0.5, -0.5,
			0.5, -0.5,
			0.5, 0.5
		]);

		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
		// 将缓冲区对象绑定到目标
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

		gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
	}, 5000);
};

main();
