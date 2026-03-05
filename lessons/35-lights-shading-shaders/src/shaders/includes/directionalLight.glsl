vec3 directionalLight(
    vec3 lightColor,
    float lightIntensity,
    vec3 lightPosition,
    float specularPower,
    vec3 normal,
    vec3 viewDirection
) {
    vec3 lightDirection = normalize(lightPosition);
    vec3 lightReflection = reflect(- lightDirection, normal);

    // Shading
    float shading = dot(normal, lightDirection);
    shading = max(0.0, shading);

    // Specular
    float specular = - dot(lightReflection, viewDirection);
    specular = max(0.0, specular);
    specular = pow(specular, specularPower);

    // return vec3(shading);
    // return vec3(specular);
    return lightColor * lightIntensity * (shading + specular);
}