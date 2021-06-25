/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const gl = getWebGLContext(canvas);

const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    void main() {
        gl_Position = a_Position;
    }
`;

// const FSHADER_SOURCE = `
//     void main() {
//         gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
//     }
// `;

const FSHADER_SOURCE = `
    precision mediump float;
    uniform float u_Width;
    uniform float u_Height;
    void main(){
        gl_FragColor = vec4(gl_FragCoord.x/u_Width, 0.0, gl_FragCoord.y/u_Height, 1.0);
    }
`;

const initVertexBuffers = () => {
	// prettier-ignore
	const verticesColors = new Float32Array([
         0.0, 0.5, 
         -0.5, -0.5, 
         0.5, -0.5
     ]);
	const n = 3;

	const vertexBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

	const a_Position = gl.getAttribLocation(gl.program, "a_Position");
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

	const u_Width = gl.getUniformLocation(gl.program, "u_Width");
	gl.uniform1f(u_Width, gl.drawingBufferWidth);
	const u_Height = gl.getUniformLocation(gl.program, "u_Height");
	gl.uniform1f(u_Height, gl.drawingBufferHeight);

	gl.enableVertexAttribArray(a_Position);

	return n;
};

const main = () => {
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		throw "Failed to intialize shaders.";
	}

	const n = initVertexBuffers();

	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.drawArrays(gl.TRIANGLES, 0, n);
};

main();
