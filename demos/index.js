/**
 * 创建WebGL上下文
 * @param {HTLMCanvasElement} canvas
 */
const createGLContext = canvas => {
	// 判断当前浏览器是否支持WebGL
	if (!window.WebGLRenderingContext) {
		throw "The browser dose not know WebGL is.";
	}
	const names = ["webgl", "experimental-webgl"];
	let context = null;
	for (let i = 0; i < names.length; i++) {
		try {
			context = canvas.getContext(names[i]);
		} catch (e) {}
		if (context) break;
	}
	if (context) {
		context.viewportWidth = canvas.width;
		context.viewportHeight = canvas.height;
	} else {
		throw "Failed to create WebGL context!";
	}
	return context;
};

const loaderShader = (gl, type, shaderSource) => {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, shaderSource);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		const errLog = gl.getShaderInfoLog(shader);
		gl.deleteShader(shader);
		throw "Error compiling shader" + errLog;
	}
	return shader;
};

const setupShaders = gl => {
	// 定义顶点着色器
	const vertexshaderSource = `
        attribute vec3 aVertexPosition;                 \n 
        void main() {                                   \n
            gl_Position = vec4(aVertexPosition, 1.0);   \n
        }                                               \n
    `;
	// 定义片段着色器
	const fragmentShaderSource = `
        precision mediump float;                        \n
        void main() {                                   \n
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);    \n
        }                                               \n
    `;

	const vertexshader = loaderShader(gl, gl.VERTEX_SHADER, vertexshaderSource);
	const fragmentShader = loaderShader(
		gl,
		gl.FRAGMENT_SHADER,
		fragmentShaderSource
	);

	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexshader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		throw "Failed to setup shaders";
	}

	gl.useProgram(shaderProgram);
	// getAttribLocation 返回指定属性的下标
	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(
		shaderProgram,
		"aVertexPosition"
	);

	return shaderProgram;
};

const setupBuffers = gl => {
	const vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	// prettier-ignore
	const triangleVertices = [
        0.0, 0.5, 0.0,
        -0.5, -0.5, 0.0,
        0.5, -0.5, 0.0,
		0.5, 0.0, 0.0
    ];
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array(triangleVertices), // 用来把顶点数据传递给WebGL
		gl.STATIC_DRAW
	);
	vertexBuffer.itemSize = 3;
	vertexBuffer.numberOfItems = 4;
	return vertexBuffer;
};

const draw = (gl, shaderProgram, vertexBuffer) => {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.vertexAttribPointer(
		shaderProgram.vertexPositionAttribute,
		vertexBuffer.itemSize,
		gl.FLOAT,
		false,
		0,
		0
	);

	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
	gl.drawArrays(gl.TRIANGLES, 0, vertexBuffer.numberOfItems);
};

const startUp = () => {
	/**
	 * @type {HTMLCanvasElement}
	 */
	const canvas = document.getElementById("canvas");
	/**
	 * @type {WebGLRenderingContext}
	 */
	const gl = createGLContext(canvas);
	// const gl = canvas.getContext("webgl");
	const shaderProgram = setupShaders(gl);
	const vertexBuffer = setupBuffers(gl);
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	draw(gl, shaderProgram, vertexBuffer);
};

startUp();
