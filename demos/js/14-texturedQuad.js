/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const gl = getWebGLContext(canvas);

const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec2 a_TexCoord;
    varying vec2 v_TexCoord;
    void main() {
        gl_Position = a_Position;
        v_TexCoord = a_TexCoord;
    }
`;
const FSHADER_SOURCE = `
    precision mediump float;
    uniform sampler2D u_Sampler;
    varying vec2 v_TexCoord;
    void main() {
        gl_FragColor = texture2D(u_Sampler, v_TexCoord);
    }
`;

const initVertexBuffers = () => {
	// prettier-ignore
	const verticesTexCoords = new Float32Array([
        // 顶点坐标，纹理坐标
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0
     ]);
	const n = 4;

	const vertexTexCoordBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

	const FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

	const a_Position = gl.getAttribLocation(gl.program, "a_Position");
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);

	const a_TexCoord = gl.getAttribLocation(gl.program, "a_TexCoord");
	gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);

	gl.enableVertexAttribArray(a_Position);
	gl.enableVertexAttribArray(a_TexCoord);

	return n;
};

/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {*} n
 * @param {*} texture
 * @param {*} u_Sampler
 * @param {*} image
 */
const loadTexture = (gl, n, texture, u_Sampler, image) => {
	// 对纹理图像进行y轴反转
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
	// 开启0号纹理单元
	gl.activeTexture(gl.TEXTURE0);
	// 向target绑定纹理对象
	gl.bindTexture(gl.TEXTURE_2D, texture);

	// 配置纹理参数
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	// webgl设置图形纹理的时候，在设置水平和垂直如何填充的时候，设置成水平和垂直拉伸，否则图片显示不正常
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	// 配置纹理图像
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
	// 将0号纹理传递给着色器
	gl.uniform1i(u_Sampler, 0);

	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
};

/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {*} n
 */
const initTextures = (gl, n) => {
	// 创建纹理对象
	const texture = gl.createTexture();

	const u_Sampler = gl.getUniformLocation(gl.program, "u_Sampler");
	const image = new Image();
	image.onload = () => {
		loadTexture(gl, n, texture, u_Sampler, image);
	};
	image.src = "../images/sky.jpg";

	return true;
};

const main = () => {
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		throw "Failed to intialize shaders.";
	}

	const n = initVertexBuffers();

	if (!initTextures(gl, n)) throw "Failed to intialize textures";
};

main();
