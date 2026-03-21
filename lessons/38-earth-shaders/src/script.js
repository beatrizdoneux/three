import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import earthVertexShader from './shaders/earth/vertex.glsl'
import earthFragmentShader from './shaders/earth/fragment.glsl'
import atmosphereVertexShader from './shaders/atmosphere/vertex.glsl'
import atmosphereFragmentShader from './shaders/atmosphere/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const textureLoader = new THREE.TextureLoader()

/**
 * Earth
 */
const earthParameters = {}
earthParameters.atmosphereDayColor = '#00aaff'
earthParameters.atmosphereTwilightColor = '#ff6600'
earthParameters.cloudColor = '#fff'

// Textures
const earthDayTexture = textureLoader.load('./earth/day.jpg')
const earthNightTexture = textureLoader.load('./earth/night.jpg')
const earthSpecularCloudsTexture = textureLoader.load('./earth/specularClouds.jpg')

earthDayTexture.colorSpace = THREE.SRGBColorSpace
earthNightTexture.colorSpace = THREE.SRGBColorSpace

// Reduce blurriness on the poles
earthDayTexture.anisotropy = 8
earthNightTexture.anisotropy = 8
earthSpecularCloudsTexture.anisotropy = 8

// Mesh
const earthGeometry = new THREE.SphereGeometry(2, 64, 64)
const earthMaterial = new THREE.ShaderMaterial({
    vertexShader: earthVertexShader,
    fragmentShader: earthFragmentShader,
    uniforms:
    {
        uDayTexture: new THREE.Uniform(earthDayTexture),
        uNightTexture: new THREE.Uniform(earthNightTexture),
        uSpecularCloudsTexture: new THREE.Uniform(earthSpecularCloudsTexture),
        uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
        uSpecularPower: new THREE.Uniform(32),

        uCloudQuantity: new THREE.Uniform(0.5),
        uCloudColor: new THREE.Uniform(new THREE.Color(earthParameters.cloudColor)),

        uTwilightTxhresholdLow: new THREE.Uniform(- 0.25),
        uTwilightTxhresholdHigh: new THREE.Uniform(0.5),

        uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereDayColor)),
        uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereTwilightColor)),
    }
})
const earth = new THREE.Mesh(earthGeometry, earthMaterial)
scene.add(earth)

// Atmosphere
const atmosphereMaterial = new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    uniforms:
    {
        uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
        uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereDayColor)),
        uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereTwilightColor)),
        uEdgeAlpha: new THREE.Uniform(0.5,),
        uDayAlpha: new THREE.Uniform(0.5,),
        uDayMix: new THREE.Uniform(0.5),
    },
    side: THREE.BackSide,
    transparent: true
})

const atmosphereParameters = {}
atmosphereParameters.scale = 1.04
const atmosphere = new THREE.Mesh(earthGeometry, atmosphereMaterial)
atmosphere.scale.set(atmosphereParameters.scale, atmosphereParameters.scale, atmosphereParameters.scale)
scene.add(atmosphere)

/**
 * Sun
 */
const sunSpherical = new THREE.Spherical(1, Math.PI * 0.5, 0.5)
const sunDirection = new THREE.Vector3()

// Debug
const debugSun = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.1, 2),
    new THREE.MeshBasicMaterial()
)
scene.add(debugSun)

// Update
const updateSun = () => {
    // Sun direction
    sunDirection.setFromSpherical(sunSpherical)

    // Debug
    debugSun.position
        .copy(sunDirection)
        .multiplyScalar(5)
    
    // Uniforms
    earthMaterial.uniforms.uSunDirection.value.copy(sunDirection)
    atmosphereMaterial.uniforms.uSunDirection.value.copy(sunDirection)
}
updateSun()

/**
 * Debug panel
 */
const sunFolder = gui.addFolder('Sun')
const earthFolder = gui.addFolder('Earth')
const atmosphereFolder = gui.addFolder('Atmosphere')

sunFolder
    .add(sunSpherical, 'phi')
    .min(0)
    .max(Math.PI)
    .onChange(updateSun)
sunFolder
    .add(sunSpherical, 'theta')
    .min(- Math.PI)
    .max(Math.PI)
    .onChange(updateSun)
sunFolder
    .add(earthMaterial.uniforms.uSpecularPower, 'value')
    .min(0)
    .max(100)
    .name('specular')

earthFolder
    .add(earthMaterial.uniforms.uCloudQuantity, 'value')
    .min(0.01)
    .max(2)
    .step(0.001)
    .name('clouds')
earthFolder
    .addColor(earthParameters, 'cloudColor')
    .onChange(() => {
        earthMaterial.uniforms.uCloudColor.value.set(earthParameters.cloudColor)
    })
    .name('CloudColor')
earthFolder
    .add(earthMaterial.uniforms.uTwilightTxhresholdLow, 'value')
    .min(- 5)
    .max(5)
    .step(0.001)
    .name('TwilightTxhresholdLow')
earthFolder
    .add(earthMaterial.uniforms.uTwilightTxhresholdHigh, 'value')
    .min(- 5)
    .max(5)
    .step(0.001)
    .name('TwilightTxhresholdHigh')

atmosphereFolder
    .addColor(earthParameters, 'atmosphereDayColor')
    .onChange(() => {
        earthMaterial.uniforms.uAtmosphereDayColor.value.set(earthParameters.atmosphereDayColor)
        atmosphereMaterial.uniforms.uAtmosphereDayColor.value.set(earthParameters.atmosphereDayColor)
    })
    .name('DayColor')
atmosphereFolder
    .addColor(earthParameters, 'atmosphereTwilightColor')
    .onChange(() => {
        earthMaterial.uniforms.uAtmosphereTwilightColor.value.set(earthParameters.atmosphereTwilightColor)
        atmosphereMaterial.uniforms.uAtmosphereTwilightColor.value.set(earthParameters.atmosphereTwilightColor)
    })
    .name('TwilightColor')
atmosphereFolder
    .add(atmosphereMaterial.uniforms.uEdgeAlpha, 'value')
    .min(0)
    .max(1)
    .step(0.01)
    .name('EdgeAlpha')
atmosphereFolder
    .add(atmosphereMaterial.uniforms.uDayAlpha, 'value')
    .min(0)
    .max(1)
    .step(0.01)
    .name('DayAlpha')
atmosphereFolder
    .add(atmosphereMaterial.uniforms.uDayMix, 'value')
    .min(0)
    .max(1)
    .step(0.01)
    .name('DayMix')
atmosphereFolder
    .add(atmosphereParameters, 'scale')
    .min(1.01)
    .max(1.1)
    .step(0.001)
    .name('Scale')
    .onChange((value) => {
        atmosphere.scale.set(value, value, value)
    })

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(sizes.pixelRatio)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 12
camera.position.y = 5
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)
renderer.setClearColor('#000011')
// renderer.setClearColor('#333333')

console.log('MaxAnisotropy:', renderer.capabilities.getMaxAnisotropy())

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    earth.rotation.y = elapsedTime * 0.1

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()