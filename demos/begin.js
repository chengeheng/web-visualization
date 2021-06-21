const vertexShaderSource = `
    void main() {
        gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
        gl_PointSize = 10.0;
    }
`;

const fragmentShaderSource = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl");

const initShaders = (gl, VSHADER_SOURCE, FSHADER_SOURCE) => {
	const program = gl.createProgram();

	const vertexShader = gl.createShader(gl.VERTEX_SHADER);
	const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, VSHADER_SOURCE);
	gl.shaderSource(fragmentShader, FSHADER_SOURCE);

	gl.compileShader(vertexShader);
	gl.compileShader(fragmentShader);

	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);

	gl.linkProgram(program);
	gl.useProgram(program);

	return program;
};

const main = () => {
	// Initialize shaders
	if (!initShaders(gl, vertexShaderSource, fragmentShaderSource)) {
		console.log("Failed to intialize shaders.");
		return;
	}

	// 设置背景色
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	// 用指定背景色清空canvas
	gl.clear(gl.COLOR_BUFFER_BIT);

	// 绘制一个点
	gl.drawArrays(gl.POINTS, 0, 1);
};
main();
