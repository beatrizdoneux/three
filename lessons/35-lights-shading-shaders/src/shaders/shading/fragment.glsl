uniform vec3 uColor;

uniform vec3 uAmbientLightColor;
uniform float uAmbientLightIntensity;

uniform vec3 uDirectionalLightColor;
uniform float uDirectionalLightIntensity;
uniform float uDirectionalLightSpecularPower;
uniform vec3 uDirectionalLightPosition;

uniform vec3 uPointLight1Color;
uniform float uPointLight1Intensity;
uniform float uPointLight1SpecularPower;
uniform float uPointLight1Decay;
uniform vec3 uPointLight1Position;

uniform vec3 uPointLight2Color;
uniform float uPointLight2Intensity;
uniform float uPointLight2SpecularPower;
uniform float uPointLight2Decay;
uniform vec3 uPointLight2Position;

varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambientLight.glsl
#include ../includes/directionalLight.glsl
#include ../includes/pointLight.glsl

void main()
{
    vec3 normal = normalize(vNormal);
    vec3 color = uColor;
    vec3 viewDirection = normalize(vPosition - cameraPosition);

    // Light
    vec3 light = vec3(0.0);
    light += ambientLight(
        uAmbientLightColor,               // Light color
        uAmbientLightIntensity            // Light intensity
        );

    light += directionalLight(
        uDirectionalLightColor,           // Light color
        uDirectionalLightIntensity,       // Light intensity
        uDirectionalLightPosition,        // Light Position
        uDirectionalLightSpecularPower,   // Specular Power
        normal,                           // Normal
        viewDirection                     // View Direction
        );

    light += pointLight(
        uPointLight1Color,                // Light color
        uPointLight1Intensity,            // Light intensity
        uPointLight1Position,             // Light Position
        uPointLight1SpecularPower,        // Specular Power
        uPointLight1Decay,                 // Light Decay
        viewDirection,                    // View Direction
        normal,                           // Normal
        vPosition                        // Position
        );

    light += pointLight(
        uPointLight2Color,                // Light color
        uPointLight2Intensity,            // Light intensity
        uPointLight2Position,             // Light Position
        uPointLight2SpecularPower,        // Specular Power
        uPointLight2Decay,                 // Light Decay
        viewDirection,                    // View Direction
        normal,                           // Normal
        vPosition                        // Position
        );


    color *= light;

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}