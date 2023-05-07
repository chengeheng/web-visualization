attribute vec3 aVertexPosition;

void main(void){
    gl_Position=vec4(aVertexPosition,1.);
    gl_PointSize=4.;
}
