uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uSpecularCloudsTexture;
uniform vec3 uSunDirection;
uniform float uSpecularPower;
uniform float uCloudQuantity;
uniform float uTwilightTxhresholdLow;
uniform float uTwilightTxhresholdHigh;
uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereTwilightColor;
uniform vec3 uCloudColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main()
{
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = vec3(0.0);

    // Sun orientation
    float sunOrientation = dot(uSunDirection, normal);
    // color = vec3(sunOrientation);

    // Day / Night color
    float dayMix = smoothstep(uTwilightTxhresholdLow, uTwilightTxhresholdHigh, sunOrientation);
    vec3 dayColor = texture(uDayTexture, vUv).rgb;
    vec3 nightColor = texture(uNightTexture, vUv).rgb;
    // color = dayColor;
    color = mix(nightColor, dayColor, dayMix);

    // Specular clouds color
    vec2 specularCloudsColor = texture(uSpecularCloudsTexture, vUv).rg;
    // color = vec3(specularCloudsColor, 0.0);

    // Clouds
    float cloudsMix = smoothstep(1.0 - uCloudQuantity, 1.0, specularCloudsColor.g);
    cloudsMix *= dayMix;
    color = mix(color, uCloudColor, cloudsMix);

    // Fresnel
    float fresnel = dot(viewDirection, normal) + 1.0;
    fresnel = pow(fresnel, 2.0);
    // color = vec3(fresnel);

    // Atmosphere
    float atmosphereDayMix = smoothstep(uTwilightTxhresholdLow, uTwilightTxhresholdHigh, sunOrientation);
    vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereDayMix);
    color = mix(color, atmosphereColor, fresnel * atmosphereDayMix);

    // Specular
    vec3 reflection = reflect(- uSunDirection, normal);
    float specular = - dot(reflection, viewDirection);
    specular = max(specular, 0.0);
    specular = pow(specular, uSpecularPower);
    // color = vec3(specular);

    // color = vec3(specularCloudsColor.r);
    specular *= specularCloudsColor.r;

    vec3 specularColor = mix(vec3(1.0), atmosphereColor, fresnel);
    // color = vec3(specularColor);
    color += specular * specularColor;

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}