/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const gl = getWebGLContext(canvas);
let g_last = Date.now();

const VSHADER_SOURCE = `
     attribute vec4 a_Position;
     uniform mat4 u_ModelMatrix;
     void main() {
         gl_Position = u_ModelMatrix * a_Position;
     }
 `;

const FSHADER_SOURCE = `
     void main() {
         gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
     }
 `;

const ANGLE = 60.0;
const Tx = 0.5;
// 旋转速度（度/秒）
const ANGLE_STEP = 45.0;

const initVertexBuffers = () => {
	// prettier-ignore
	const vertices = new Float32Array([
           0.0, 0.5, 
           0.5, -0.5,
           -0.5, -0.5,
       ]);
	const n = 3;

	const vertexBuffer = gl.createBuffer();
	if (!vertexBuffer) {
		throw "Failed to create the buffer object.";
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

const animate = angle => {
	const now = Date.now();
	const elapsed = now - g_last;
	g_last = now;
	let newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
	return (newAngle %= 360);
};

const draw = (n, currentAngle, modelMatrix, u_ModelMatrix) => {
	modelMatrix.setRotate(currentAngle, 0, 0, 1);
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES, 0, n);
};

const main = () => {
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		throw "Failed to intialize shaders.";
	}

	const [n, vertexBuffer] = initVertexBuffers(gl);
	// 设置背景色
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	gl.clear(gl.COLOR_BUFFER_BIT);

	const u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
	let currentAngle = 0.0;
	const modelMatrix = new Matrix4();

	const tick = () => {
		currentAngle = animate(currentAngle);
		draw(n, currentAngle, modelMatrix, u_ModelMatrix);
		requestAnimationFrame(tick);
	};
	tick();
};

main();
