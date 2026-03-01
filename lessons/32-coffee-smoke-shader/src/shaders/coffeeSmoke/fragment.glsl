uniform float uTime;
uniform sampler2D uPerlinTexture;
uniform float uSmokeUvX;
uniform float uSmokeUvY;
uniform float uSmokeSpeed;
uniform float uSmoothStepXLeft;
uniform float uSmoothStepXRight;
uniform float uSmoothStepYTop;
uniform float uSmoothStepYBottom;
uniform vec3 uColor;

varying vec2 vUv;

void main() {
    // Scale and animate
    vec2 smokeUv = vUv;
    smokeUv.x *= uSmokeUvX;
    smokeUv.y *= uSmokeUvY;
    smokeUv.y -= uTime * uSmokeSpeed;

    // Smoke
    float smoke = texture(uPerlinTexture, smokeUv).r;

    // Remap smoke -> smooth transition from 0 to 1
    smoke = smoothstep(0.4, 1.0, smoke);

    // Edges
    // smoke = 1.0;
    smoke *= smoothstep(0.0, uSmoothStepXLeft, vUv.x); // left
    smoke *= smoothstep(1.0, uSmoothStepXRight, vUv.x); // right
    smoke *= smoothstep(0.0, uSmoothStepYBottom, vUv.y); // bottom
    smoke *= smoothstep(1.0, uSmoothStepYTop, vUv.y); // top

    // Final color
    // gl_FragColor = vec4(0.3, 0.3, 0.3, smoke);
    // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    gl_FragColor = vec4(uColor, smoke);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}