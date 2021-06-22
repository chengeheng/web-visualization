/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const gl = getWebGLContext(canvas);

// 旋转变换
// x' = xcosb - ysinb;
// y' = xsinb - ycosb;
// z' = z;
const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform float u_CosB, u_SinB;
    void main() {
        gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;
        gl_Position.y = a_Position.x * u_SinB - a_Position.y * u_CosB;
        gl_Position.z = a_Position.z;
        gl_Position.w = 1.0;
    }
`;

const FSHADER_SOURCE = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

const ANGLE = 90.0;

const initVertexBuffers = () => {
	// prettier-ignore
	const vertices = new Float32Array([
        0.0, 0.5, 
        0.5, -0.5,
        -0.5, -0.5,
    ]);
	const n = 3;

	const radian = (Math.PI * ANGLE) / 180.0;
	const cosB = Math.cos(radian);
	const sinB = Math.sin(radian);

	const vertexBuffer = gl.createBuffer();
	if (!vertexBuffer) {
		throw "Failed to create the buffer object.";
	}

	// 将缓冲区对象绑定到目标
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	// 向缓冲区对象中写入数据
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	const a_Position = gl.getAttribLocation(gl.program, "a_Position");
	const u_CosB = gl.getUniformLocation(gl.program, "u_CosB");
	const u_SinB = gl.getUniformLocation(gl.program, "u_SinB");

	gl.uniform1f(u_CosB, cosB);
	gl.uniform1f(u_SinB, sinB);
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

	gl.drawArrays(gl.TRIANGLES, 0, n);
	// setTimeout(() => {
	// 	gl.clear(gl.COLOR_BUFFER_BIT);
	// 	console.log("start updating");
	// 	// prettier-ignore
	// 	const vertices = new Float32Array([
	// 		-0.5, 0.5,
	// 		-0.5, -0.5,
	// 		0.5, -0.5,
	// 		0.5, 0.5
	// 	]);
	// 	const u_Translation = gl.getUniformLocation(gl.program, "u_Translation");

	// 	gl.uniform4f(u_Translation, Tx, Ty - 0.5, Tz, 0.0);
	// 	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
	// 	// 将缓冲区对象绑定到目标
	// 	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	// 	gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
	// }, 5000);
};

main();
