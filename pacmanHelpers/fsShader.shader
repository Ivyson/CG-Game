   // Set precision to medium
    precision highp float;

    // Varying variables
    varying vec2 vTextureCoord;
    varying vec4 fColor;

    // Texture sampler
    uniform sampler2D uSampler;

    void main(void) {
        // Set fragment color to the color calculated in the vertex shader,
        // multiplied by the texture color
        gl_FragColor = fColor * texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    }
