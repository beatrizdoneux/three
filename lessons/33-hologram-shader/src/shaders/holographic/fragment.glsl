uniform float uTime;
uniform vec3 uColor;

uniform float uStripesSpeed;
uniform float uStripesNumber;
uniform float uStripesSharpness;
uniform float uShineDepth;
uniform float uShineIntensity;
uniform float uFalloffLowerEdge;
uniform float uFalloffUpperEdge;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {

    // Normal
    vec3 normal = normalize(vNormal);
    // Normalize so that the normal hast a length of 1
    
    if(!gl_FrontFacing) { // check if the fragment is at the back of the model
        normal *= - 1.0;
    }

    // Stripes
    float stripes = mod((vPosition.y - uTime * uStripesSpeed) * uStripesNumber, 1.0);
    stripes = pow(stripes, uStripesSharpness);
    // pow makes the stripes sharper

    // Fresnel
    vec3 viewDirection = vPosition - cameraPosition; // vector from camera position to the fragment
    viewDirection = normalize(viewDirection); // forces the length of the vector to be == 1

    float fresnel = dot(viewDirection, normal) + 1.0;
    // returns 1 when the vectors are going in the same direction, 0 when vectors are penpendicular and -1 when vectors are going in opposite directions, and all the values in between
    // added 1 to 'invert' the values returned by the dot function -1 -> 0, 0 -> 1
    
    fresnel = pow(fresnel, uShineDepth);
    // Pushed gradient to the surface of the models

    // Falloff
    float falloff = smoothstep(uFalloffLowerEdge, uFalloffUpperEdge, fresnel);

    // Holographic
    float holographic = stripes * fresnel;
    holographic += fresnel * uShineIntensity;
    holographic *= falloff;

    // Final Color
    gl_FragColor = vec4(uColor, holographic);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}