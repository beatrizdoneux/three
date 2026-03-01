uniform float uTime;
uniform sampler2D uPerlinTexture;

uniform float uAngleMultiplier;
uniform float uTwistFrequency;
uniform float uTwistSpeed;
uniform float uTwistTextureCoordinate;

uniform float uWindSpeed;
uniform float uWindTextureCoordinateX;
uniform float uWindTextureCoordinateZ;
uniform float uWindCurvature;
uniform float uWindRadius;

varying vec2 vUv;

#include ../includes/rotate2D.glsl

void main() {

    vec3 newPosition = position;

    // Twist
    float twistPerlin = texture(
        uPerlinTexture,
        vec2(uTwistTextureCoordinate, uv.y * uTwistFrequency - uTime * uTwistSpeed)
        ).r;
        
    // float angle = newPosition.y;
    float angle = twistPerlin * uAngleMultiplier;
    newPosition.xz = rotate2D(newPosition.xz, angle);


// uWindSpeed
// uWindTextureCoordinateTop
// uWindTextureCoordinateBottom

    // Wind
    vec2 windOffset = vec2(
        texture(uPerlinTexture, vec2(uWindTextureCoordinateX, uTime * uWindSpeed)).r - 0.5,
        texture(uPerlinTexture, vec2(uWindTextureCoordinateZ, uTime * uWindSpeed)).r - 0.5
    );
    // windOffset *= pow(uv.y, uWindCurvature);
    windOffset *= uv.y  * uWindRadius;
    // multiplied by uv.y to keep the bottom of the smoke glued to the coffee
    // power creates a curvature on the smoke
    newPosition.xz += windOffset;

    // Final position
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    // Varying
    vUv = uv;
}