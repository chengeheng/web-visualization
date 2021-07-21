/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const gl = getWebGLContext(canvas);

const VSHADER_SOURCE = `
     attribute vec4 a_Position;
     attribute vec4 a_Normal;
     uniform mat4 u_MvpMatrix;
     uniform mat4 u_NormalMatrix;
     varying vec4 v_Color;
     void main() {
         gl_Position = u_MvpMatrix * a_Position;
         // 计算光照
         vec3 lightDirection = normalize(vec3(0.0, 0.5, 0.7)); // 平行光方向
         vec4 color = vec4(1.0, 0.4, 0.0, 1.0);
         vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));
         float nDotL = max(dot(normal, lightDirection), 0.0);
         v_Color = vec4(color.rgb * nDotL + vec3(0.1), color.a);
     }
 `;

const FSHADER_SOURCE = `
     precision mediump float;
     varying vec4 v_Color;
     void main() {
         gl_FragColor = v_Color;
     }
 `;

const initArrayBuffer = (attribute, data, type, num) => {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    const a_attribute = gl.getAttribLocation(gl.program, attribute);

    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute);
    return true;
};

const initVertexBuffers = () => {
    // Coordinates（Cube which length of one side is 1 with the origin on the center of the bottom)
    // prettier-ignore
    var vertices = new Float32Array([
        0.5, 1.0, 0.5, -0.5, 1.0, 0.5, -0.5, 0.0, 0.5,  0.5, 0.0, 0.5, // v0-v1-v2-v3 front
        0.5, 1.0, 0.5,  0.5, 0.0, 0.5,  0.5, 0.0,-0.5,  0.5, 1.0,-0.5, // v0-v3-v4-v5 right
        0.5, 1.0, 0.5,  0.5, 1.0,-0.5, -0.5, 1.0,-0.5, -0.5, 1.0, 0.5, // v0-v5-v6-v1 up
        -0.5, 1.0, 0.5, -0.5, 1.0,-0.5, -0.5, 0.0,-0.5, -0.5, 0.0, 0.5, // v1-v6-v7-v2 left
        -0.5, 0.0,-0.5,  0.5, 0.0,-0.5,  0.5, 0.0, 0.5, -0.5, 0.0, 0.5, // v7-v4-v3-v2 down
        0.5, 0.0,-0.5, -0.5, 0.0,-0.5, -0.5, 1.0,-0.5,  0.5, 1.0,-0.5  // v4-v7-v6-v5 back
    ]);

    // Normal
    // prettier-ignore
    var normals = new Float32Array([
        0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
        1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
        0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
        0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
        0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
    ]);

    // Indices of the vertices
    // prettier-ignore
    var indices = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // right
        8, 9,10,   8,10,11,    // up
        12,13,14,  12,14,15,    // left
        16,17,18,  16,18,19,    // down
        20,21,22,  20,22,23     // back
    ]);
    initArrayBuffer("a_Position", vertices, gl.FLOAT, 3);
    initArrayBuffer("a_Normal", normals, gl.FLOAT, 3);

    // unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
};

let ANGLE_STEP = 3.0; // 每次按键转动的角度
let g_arm1Angle = 90.0; // arm1的当前角度
let g_joint1Angle = 45.0; // joint1的当前角度
let g_joint2Angle = 0.0; // joint2的当前角度
let g_joint3Angle = 0.0; // joint3的当前角度

const keydown = (e, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) => {
    switch (e.keyCode) {
        case 38:
            if (g_joint1Angle < 135.0) g_joint1Angle += ANGLE_STEP;
            break;
        case 40:
            if (g_joint1Angle > -135.0) g_joint1Angle -= ANGLE_STEP;
            break;
        case 39:
            g_arm1Angle = (g_arm1Angle + ANGLE_STEP) % 360;
            break;
        case 37:
            g_arm1Angle = (g_arm1Angle - ANGLE_STEP) % 360;
            break;
        case 90:
            g_joint2Angle = (g_joint2Angle + ANGLE_STEP) % 360;
            break;
        case 88:
            g_joint2Angle = (g_joint2Angle - ANGLE_STEP) % 360;
            break;
        case 86:
            if (g_joint3Angle < 60.0) g_joint3Angle = (g_joint3Angle + ANGLE_STEP) % 360;
            break;
        case 67:
            if (g_joint3Angle > -60.0) g_joint3Angle = (g_joint3Angle - ANGLE_STEP) % 360;
            break;
        default:
            return;
    }
    draw(n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
};

let g_modelMatrix = new Matrix4();
const g_mvpMatrix = new Matrix4();
const g_normalMatrix = new Matrix4();

const draw = (n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // 绘制基座
    let baseHeight = 2.0;
    g_modelMatrix.setTranslate(0.0, -12.0, 0.0);
    drawBox(n, 10.0, baseHeight, 10.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);

    // arm1
    let arm1Length = 10.0;
    g_modelMatrix.translate(0.0, baseHeight, 0.0);
    g_modelMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0);
    drawBox(n, 3.0, arm1Length, 3.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);

    // arm2
    const arm2Length = 10.0;
    g_modelMatrix.translate(0.0, arm1Length, 0.0);
    g_modelMatrix.rotate(g_joint1Angle, 0.0, 0.0, 1.0);
    drawBox(n, 4.0, arm2Length, 4.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);

    // a plam
    const palmLength = 2.0;
    g_modelMatrix.translate(0.0, arm2Length, 0.0);
    g_modelMatrix.rotate(g_joint2Angle, 0.0, 1.0, 0.0);
    drawBox(n, 2.0, palmLength, 6.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);

    g_modelMatrix.translate(0.0, palmLength, 0.0);

    // finger 1
    pushMatrix(g_modelMatrix);
    g_modelMatrix.translate(0.0, 0.0, 2.0);
    g_modelMatrix.rotate(g_joint3Angle, 1.0, 0.0, 0.0);
    drawBox(n, 1.0, 2.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);

    g_modelMatrix = popMatrix();
    // finger 2
    g_modelMatrix.translate(0.0, 0.0, -2.0);
    g_modelMatrix.rotate(-g_joint3Angle, 1.0, 0.0, 0.0);
    drawBox(n, 1.0, 2.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
};

const g_matrixStack = [];
const pushMatrix = (m) => {
    const m2 = new Matrix4(m);
    g_matrixStack.push(m2);
};
const popMatrix = () => {
    return g_matrixStack.pop();
};

const main = () => {
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        throw "Failed to intialize shaders";
    }

    const n = initVertexBuffers(gl);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    const u_MvpMatrix = gl.getUniformLocation(gl.program, "u_MvpMatrix");
    const u_NormalMatrix = gl.getUniformLocation(gl.program, "u_NormalMatrix");

    const viewProjMatrix = new Matrix4();
    viewProjMatrix.setPerspective(50.0, canvas.width / canvas.height, 1.0, 100.0);
    viewProjMatrix.lookAt(20.0, 10.0, 30.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    document.onkeydown = (e) => keydown(e, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);

    draw(n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
};

const drawBox = (n, width, height, depth, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) => {
    pushMatrix(g_modelMatrix);
    g_modelMatrix.scale(width, height, depth);

    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);

    g_normalMatrix.setInverseOf(g_modelMatrix);
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);

    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    g_modelMatrix = popMatrix();
};
main();
