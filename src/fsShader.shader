    precision highp float;
    varying vec2 vTextureCoord;
    uniform sampler2D uSampler;
    vec4 fcolor;
    void main(void) {
       fcolor = texture2D(uSampler, vTextureCoord);
        gl_FragColor = vec4(fcolor.rgb, 0.0);
    }