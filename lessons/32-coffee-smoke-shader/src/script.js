import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import coffeeSmokeVertexShader from './shaders/coffeeSmoke/vertex.glsl'
import coffeeSmokeFragmentShader from './shaders/coffeeSmoke/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI()
const debugObject = {}
// Fragment pattern
// Vertex animation
// Color
// Use your own model for the scenery
// Add floating marshmallows
// Make the wind move with the cursor

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const textureLoader = new THREE.TextureLoader()
const gltfLoader = new GLTFLoader()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 8
camera.position.y = 10
camera.position.z = 12
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Model
 */
gltfLoader.load(
    './bakedModel.glb',
    (gltf) =>
    {
        gltf.scene.getObjectByName('baked').material.map.anisotropy = 8
        scene.add(gltf.scene)
    }
)

/**
 * Smoke
 */

// Geometry
const smokeGeometry = new THREE.PlaneGeometry(1, 1, 16, 64)
smokeGeometry.translate(0, 0.5, 0)
smokeGeometry.scale(1.5, 6, 1.5)

// Perlin texture
const perlinTexture = textureLoader.load('./perlin.png')
perlinTexture.wrapS = THREE.RepeatWrapping
perlinTexture.wrapT = THREE.RepeatWrapping

// Color
debugObject.smokeColor = '#e0e0e0'

// Material
const smokeMaterial = new THREE.ShaderMaterial({
    wireframe: false,
    vertexShader: coffeeSmokeVertexShader,
    fragmentShader: coffeeSmokeFragmentShader,
    uniforms: {
        uTime: new THREE.Uniform(0),
        uPerlinTexture: new THREE.Uniform(perlinTexture),

        // Twist
        uAngleMultiplier: new THREE.Uniform(10),
        uTwistFrequency: new THREE.Uniform(0.2),
        uTwistSpeed: new THREE.Uniform(0.005),
        uTwistTextureCoordinate: new THREE.Uniform(0.5),
        
        // Wind
        uWindSpeed: new THREE.Uniform(0.01),
        uWindTextureCoordinateX: new THREE.Uniform(0.25),
        uWindTextureCoordinateZ: new THREE.Uniform(0.75),
        uWindCurvature: new THREE.Uniform(2.0),
        uWindRadius: new THREE.Uniform(5.0),

        // Fragment
        uSmokeUvX: new THREE.Uniform(0.3),
        uSmokeUvY: new THREE.Uniform(0.3),
        uSmokeSpeed: new THREE.Uniform(0.03),
        uSmoothStepXLeft: new THREE.Uniform(0.1),
        uSmoothStepXRight: new THREE.Uniform(0.9),
        uSmoothStepYTop: new THREE.Uniform(0.4),
        uSmoothStepYBottom: new THREE.Uniform(0.1),
        uColor: new THREE.Uniform(new THREE.Color('#e0e0e0'))
    },
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
})

const materialFolder = gui.addFolder('Material')
const vertexShaderFolder = gui.addFolder('Vertex Shader')
const fragmentShaderFolder = gui.addFolder('Fragment Shader')

materialFolder.add(smokeMaterial, 'wireframe')
materialFolder.add(smokeMaterial, 'transparent')
materialFolder.add(smokeMaterial, 'depthWrite')

vertexShaderFolder.add(smokeMaterial.uniforms.uAngleMultiplier, 'value').min(0).max(20).step(1).name('Angle Multiplier')
vertexShaderFolder.add(smokeMaterial.uniforms.uTwistFrequency, 'value').min(0).max(1).step(0.01).name('Twist Frequency')
vertexShaderFolder.add(smokeMaterial.uniforms.uTwistSpeed, 'value').min(0).max(1).step(0.0001).name('Twist Speed')
vertexShaderFolder.add(smokeMaterial.uniforms.uTwistTextureCoordinate, 'value').min(0).max(1).step(0.01).name('Twist Texture Coordinate')

vertexShaderFolder.add(smokeMaterial.uniforms.uWindSpeed, 'value').min(0).max(1).step(0.0001).name('Wind Speed')
vertexShaderFolder.add(smokeMaterial.uniforms.uWindTextureCoordinateX, 'value').min(0).max(1).step(0.01).name('Wind Texture Coord X')
vertexShaderFolder.add(smokeMaterial.uniforms.uWindTextureCoordinateZ, 'value').min(0).max(1).step(0.01).name('Wind Texture Coord Z')
vertexShaderFolder.add(smokeMaterial.uniforms.uWindCurvature, 'value').min(1).max(10).step(0.1).name('Wind Curvature')
vertexShaderFolder.add(smokeMaterial.uniforms.uWindRadius, 'value').min(1).max(10).step(0.1).name('Wind Radius')

fragmentShaderFolder.add(smokeMaterial.uniforms.uSmokeUvX, 'value').min(0).max(1).step(0.01).name('SmokeUv X')
fragmentShaderFolder.add(smokeMaterial.uniforms.uSmokeUvY, 'value').min(0).max(1).step(0.01).name('SmokeUv Y')
fragmentShaderFolder.add(smokeMaterial.uniforms.uSmokeSpeed, 'value').min(0).max(0.1).step(0.001).name('Smoke Speed')
fragmentShaderFolder.add(smokeMaterial.uniforms.uSmoothStepXLeft, 'value').min(0).max(1.0).step(0.001).name('SmoothStep X Left')
fragmentShaderFolder.add(smokeMaterial.uniforms.uSmoothStepXRight, 'value').min(0).max(1.0).step(0.001).name('SmoothStep X Right')
fragmentShaderFolder.add(smokeMaterial.uniforms.uSmoothStepYTop, 'value').min(0).max(1.0).step(0.001).name('SmoothStep Y Top')
fragmentShaderFolder.add(smokeMaterial.uniforms.uSmoothStepYBottom, 'value').min(0).max(1.0).step(0.001).name('SmoothStep Y Bottom')

fragmentShaderFolder
    .addColor(debugObject, 'smokeColor')
    .name('Smoke color')
    .onChange(() => {
        smokeMaterial.uniforms.uColor.value.set(debugObject.smokeColor)
    })

// Mesh
const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial)
smoke.position.y = 1.83
scene.add(smoke)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update smoke
    smokeMaterial.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()