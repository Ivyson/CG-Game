precision mediump float;
attribute vec2 pos;
uniform mat4 translate;
void main()
{
    gl_Position = vec4(pos, 0.0, 1.0);
}