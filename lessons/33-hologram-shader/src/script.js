import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import holographicVertexShader from './shaders/holographic/vertex.glsl'
import holographicFragmentShader from './shaders/holographic/fragment.glsl'

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
camera.position.set(7, 7, 7)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const rendererParameters = {}
rendererParameters.clearColor = '#1d1f2a'

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setClearColor(rendererParameters.clearColor)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

gui
    .addColor(rendererParameters, 'clearColor')
    .onChange(() =>
    {
        renderer.setClearColor(rendererParameters.clearColor)
    })

/**
 * Material
 */
const materialParameters = {}
materialParameters.color = '#78c1ff'

gui.addColor(materialParameters, 'color').onChange(() => {
    material.uniforms.uColor.value.set(materialParameters.color)
})

const material = new THREE.ShaderMaterial({
    vertexShader: holographicVertexShader,
    fragmentShader: holographicFragmentShader,
    uniforms: {
        uTime: new THREE.Uniform(0),
        uColor: new THREE.Uniform(new THREE.Color(materialParameters.color)),
        
        uGlitchStrengthMultiplier: new THREE.Uniform(0.25),
        uGlitchRemapLowerValue: new THREE.Uniform(0.3),
        uGlitchRemapUpperValue: new THREE.Uniform(1.0),
        uGlitchSinMultiplier1: new THREE.Uniform(3.45),
        uGlitchSinMultiplier2: new THREE.Uniform(8.76),

        uStripesSpeed: new THREE.Uniform(0.02),
        uStripesNumber: new THREE.Uniform(20),
        uStripesSharpness: new THREE.Uniform(3),
        uShineDepth: new THREE.Uniform(2),
        uShineIntensity: new THREE.Uniform(1.25),
        uFalloffLowerEdge: new THREE.Uniform(0.8),
        uFalloffUpperEdge: new THREE.Uniform(0),
    },
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
})

const materialFolder = gui.addFolder('Material')
const guiVertexFolder = gui.addFolder('Vertex Shader')
const guiFragmentFolder = gui.addFolder('Fragment Shader')

materialFolder.add(material, 'transparent')
materialFolder.add(material, 'depthWrite')

guiVertexFolder.add(material.uniforms.uGlitchStrengthMultiplier, 'value').min(0).max(1).step(0.01).name('uGlitchStrengthMultiplier')
guiVertexFolder.add(material.uniforms.uGlitchRemapLowerValue, 'value').min(0).max(1).step(0.01).name('uGlitchRemapLowerValue')
guiVertexFolder.add(material.uniforms.uGlitchRemapUpperValue, 'value').min(0).max(1).step(0.01).name('uGlitchRemapUpperValue')
guiVertexFolder.add(material.uniforms.uGlitchSinMultiplier1, 'value').min(0).max(10).step(0.01).name('uGlitchSinMultiplier1')
guiVertexFolder.add(material.uniforms.uGlitchSinMultiplier2, 'value').min(0).max(10).step(0.01).name('uGlitchSinMultiplier2')

guiFragmentFolder.add(material.uniforms.uStripesSpeed, 'value').min(0).max(1).step(0.001).name('uStripesSpeed')
guiFragmentFolder.add(material.uniforms.uStripesNumber, 'value').min(0).max(50).step(1).name('uStripesNumber')
guiFragmentFolder.add(material.uniforms.uStripesSharpness, 'value').min(0).max(10).step(0.1).name('uStripesSharpness')
guiFragmentFolder.add(material.uniforms.uShineDepth, 'value').min(0).max(5).step(0.1).name('uShineDepth')
guiFragmentFolder.add(material.uniforms.uShineIntensity, 'value').min(0).max(5).step(0.1).name('uShineIntensity')
guiFragmentFolder.add(material.uniforms.uFalloffLowerEdge, 'value').min(0).max(1).step(0.01).name('uFalloffLowerEdge')
guiFragmentFolder.add(material.uniforms.uFalloffUpperEdge, 'value').min(0).max(1).step(0.01).name('uFalloffUpperEdge')

/**
 * Objects
 */
// Torus knot
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32),
    material
)
torusKnot.position.x = 3
scene.add(torusKnot)

// Sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(),
    material
)
sphere.position.x = - 3
scene.add(sphere)

// Suzanne
let suzanne = null
gltfLoader.load(
    './suzanne.glb',
    (gltf) =>
    {
        suzanne = gltf.scene
        suzanne.traverse((child) =>
        {
            if(child.isMesh)
                child.material = material
        })
        scene.add(suzanne)
    }
)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update material
    material.uniforms.uTime.value = elapsedTime

    // Rotate objects
    if(suzanne)
    {
        suzanne.rotation.x = - elapsedTime * 0.1
        suzanne.rotation.y = elapsedTime * 0.2
    }

    sphere.rotation.x = - elapsedTime * 0.1
    sphere.rotation.y = elapsedTime * 0.2

    torusKnot.rotation.x = - elapsedTime * 0.1
    torusKnot.rotation.y = elapsedTime * 0.2

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()