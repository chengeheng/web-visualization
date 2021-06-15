/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl");

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

const setupShaders = () => {
	const trangleVertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, trangleVertexBuffer);
	// prettier-ignore
	const traingleVertices = [
        // ( x, y, z) ( r, g, b, a)
        0.0, 0.5, 0.0, 255, 0, 0, 255, // V0
        0.5, -0.5, 0.0, 0, 250, 6, 255, // V1
        -0.5, -0.5, 0.0, 0, 0, 255, 255 // V2
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
	}
};

const start = () => {
	setupShaders();
};

// const draw = () => {
// 	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
// 	gl.clear(gl.COLOR_BUFFER_BIT);

// 	// bind the buffer containing both position and color
// };
