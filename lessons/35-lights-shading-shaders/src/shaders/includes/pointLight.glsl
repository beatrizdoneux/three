vec3 pointLight(
    vec3 lightColor,
    float lightIntensity,
    vec3 lightPosition,
    float specularPower,
    float lightDecay,
    vec3 viewDirection,
    vec3 normal,
    vec3 position
) {
    vec3 lightDelta = lightPosition - position; // Vector going from the fragment position to the light position
    float lightDistance = length(lightDelta);
    vec3 lightDirection = normalize(lightDelta);
    vec3 lightReflection = reflect(- lightDirection, normal);

    // Shading
    float shading = dot(normal, lightDirection);
    shading = max(0.0, shading);

    // Specular
    float specular = - dot(lightReflection, viewDirection);
    specular = max(0.0, specular);
    specular = pow(specular, specularPower);

    // Decay
    float decay = 1.0 - lightDistance * lightDecay;
    decay = max(0.0, decay);

    // return vec3(shading);
    // return vec3(specular);
    // return vec3(decay);
    return lightColor * lightIntensity * decay * (shading + specular);
}