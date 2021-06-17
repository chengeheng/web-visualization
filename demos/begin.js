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

const main = () => {
	/**
	 * @type {HTMLCanvasElement}
	 */
	const canvas = document.getElementById("canvas");
	const gl = canvas.getContext("webgl");

	// Initialize shaders
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
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
