uniform float uTime;
uniform float uGlitchStrengthMultiplier;
uniform float uGlitchRemapLowerValue;
uniform float uGlitchRemapUpperValue;
uniform float uGlitchSinMultiplier1;
uniform float uGlitchSinMultiplier2;

varying vec3 vPosition;
varying vec3 vNormal;

#include ../includes/random2D.glsl

void main() {
    // Position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Glitch
    float glitchTime = uTime - modelPosition.y;
    float glitchStrength = sin(glitchTime) + sin(glitchTime * uGlitchSinMultiplier1) + sin(glitchTime + uGlitchSinMultiplier2);
    glitchStrength /= 3.0;

    glitchStrength = smoothstep(uGlitchRemapLowerValue, uGlitchRemapUpperValue, glitchStrength);

    glitchStrength *= uGlitchStrengthMultiplier;
    modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * glitchStrength;
    modelPosition.z += (random2D(modelPosition.zx + uTime) - 0.5) * glitchStrength;

    // Final position
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    // Model normal
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);
    // set last value to zero to not apply the translation to the normal

    vPosition = modelPosition.xyz;
    vNormal = modelNormal.xyz;
}