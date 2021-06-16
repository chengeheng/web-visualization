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

const setupShaders = gl => {
	const vertexShaderSource = `
		attribute vec3 aVertexPosition;					\n
		attribute vec4 aVertexColor;					\n
		varying vec4 vColor;							\n

		void main() {									\n
			vColor = aVertexColor;						\n
			gl_Position = vec4(aVertexPosition, 1.0);	\n
		}
	`;

	const fragmentShaderSource = `
		precision mediump float;						\n

		varying vec4 vColor;							\n
		void main() {									\n
			gl_FragColor = vColor;						\n
		}
	`;

	const vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, vertexShaderSource);
	gl.compileShader(vertexShader);

	const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, fragmentShaderSource);
	gl.compileShader(fragmentShader);

	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
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
	shaderProgram.vertexColorAttribute = gl.getAttribLocation(
		shaderProgram,
		"aVertexColor"
	);

	// we enable vertex attrib arrays for both position and color attribute
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
	gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

	return shaderProgram;
};

const setupBuffers = gl => {
	const traingleVertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, traingleVertexBuffer);
	// prettier-ignore
	const traingleVertices = [
        // ( x, y, z) ( r, g, b, a)
        0.0, 0.5, 0.0,  	255, 0, 0, 255, // V0
        0.5, -0.5, 0.0, 	0, 250, 6, 255, // V1
        -0.5, -0.5, 0.0, 	0, 0, 255, 255 // V2
    ];
	const nbrOfVertices = 3;
	// Calculate how many bytes that are needed for one vertex element
	// that consists of (x, y, z) + (r, g, b, a)
	const vertexSizeInBytes =
		3 * Float32Array.BYTES_PER_ELEMENT + 4 * Uint8Array.BYTES_PER_ELEMENT;
	const vertexSizeInFloats = vertexSizeInBytes / Float32Array.BYTES_PER_ELEMENT;
	// allocate the buffer
	const buffer = new ArrayBuffer(nbrOfVertices * vertexSizeInFloats);

	// map the buffer to a Float32Array view to access the position
	const positionView = new Float32Array(buffer);

	/// map the same buffer to a Uint8Array to access the color
	const colorView = new Uint8Array(buffer);

	// populate the ArrayBuffer from the Javascript Array
	let positionOffsetInFloats = 0;
	let colorOffsetInBytes = 12;
	let k = 0; // index to Javascript Array
	for (let i = 0; i < nbrOfVertices; i++) {
		positionView[positionOffsetInFloats] = traingleVertices[k];
		positionView[positionOffsetInFloats + 1] = traingleVertices[k + 1];
		positionView[positionOffsetInFloats + 2] = traingleVertices[k + 2];
		colorView[colorOffsetInBytes] = traingleVertices[k + 3];
		colorView[colorOffsetInBytes + 1] = traingleVertices[k + 4];
		colorView[colorOffsetInBytes + 2] = traingleVertices[k + 5];
		colorView[colorOffsetInBytes + 3] = traingleVertices[k + 6];

		positionOffsetInFloats += vertexSizeInFloats;
		colorOffsetInBytes += vertexSizeInBytes;
		k += 7;
	}
	console.log(buffer, new Float32Array(traingleVertices), colorView);
	gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW); // ? buffer上是否包含顶点坐标和颜色数据
	traingleVertexBuffer.positionSize = 3;
	traingleVertexBuffer.colorSize = 4;
	traingleVertexBuffer.numberOfItems = 3;

	return traingleVertexBuffer;
};

const draw = (gl, shaderProgram, traingleVertexBuffer) => {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.bindBuffer(gl.ARRAY_BUFFER, traingleVertexBuffer);

	gl.vertexAttribPointer(
		shaderProgram.vertexPositionAttribute,
		traingleVertexBuffer.positionSize,
		gl.FLOAT,
		false,
		16,
		0
	);

	gl.vertexAttribPointer(
		shaderProgram.vertexColorAttribute,
		traingleVertexBuffer.colorSize,
		gl.UNSIGNED_BYTE,
		true,
		16,
		12
	);

	gl.drawArrays(gl.TRIANGLES, 0, traingleVertexBuffer.numberOfItems);
};

const start = () => {
	/**
	 * @type {HTMLCanvasElement}
	 */
	const canvas = document.getElementById("canvas");
	const gl = createGLContext(canvas);
	const shaderProgram = setupShaders(gl);
	const traingleVertexBuffer = setupBuffers(gl);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);
	draw(gl, shaderProgram, traingleVertexBuffer);
};

// const draw = () => {
// 	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
// 	gl.clear(gl.COLOR_BUFFER_BIT);

// 	// bind the buffer containing both position and color
// };
start();
