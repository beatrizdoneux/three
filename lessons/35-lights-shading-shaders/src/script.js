import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import shadingVertexShader from './shaders/shading/vertex.glsl'
import shadingFragmentShader from './shaders/shading/fragment.glsl'

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
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}

window.addEventListener('resize', () => {
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
camera.position.x = 7
camera.position.y = 7
camera.position.z = 7
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
// renderer.toneMapping = THREE.ACESFilmicToneMapping
// renderer.toneMappingExposure = 3
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

/**
 * Material
 */
const materialParameters = {}
materialParameters.color = '#ffffff'

const ambientLightParameters = {}
ambientLightParameters.color = new THREE.Color(1, 1, 1)

const directionalLightParameters = {}
directionalLightParameters.color = new THREE.Color(0.1, 0.1, 1.0)

const pointLight1Parameters = {}
pointLight1Parameters.color = new THREE.Color(1.0, 0.1, 0.1)

const pointLight2Parameters = {}
pointLight2Parameters.color = new THREE.Color(0.1, 1.0, 0.5)

const material = new THREE.ShaderMaterial({
    vertexShader: shadingVertexShader,
    fragmentShader: shadingFragmentShader,
    uniforms:
    {
        uColor: new THREE.Uniform(new THREE.Color(materialParameters.color)),

        uAmbientLightColor: new THREE.Uniform(new THREE.Color(ambientLightParameters.color)),
        uAmbientLightIntensity: new THREE.Uniform(0.03),

        uDirectionalLightColor: new THREE.Uniform(new THREE.Color(directionalLightParameters.color)),
        uDirectionalLightIntensity: new THREE.Uniform(1),
        uDirectionalLightSpecularPower: new THREE.Uniform(20),
        uDirectionalLightPosition: new THREE.Uniform(new THREE.Vector3(0, 0, 3)),

        uPointLight1Color: new THREE.Uniform(new THREE.Color(pointLight1Parameters.color)),
        uPointLight1Intensity: new THREE.Uniform(1),
        uPointLight1Position: new THREE.Uniform(new THREE.Vector3(0.0, 2.5, 0.0)),
        uPointLight1SpecularPower: new THREE.Uniform(20),
        uPointLight1Decay: new THREE.Uniform(0.25),

        uPointLight2Color: new THREE.Uniform(new THREE.Color(pointLight2Parameters.color)),
        uPointLight2Intensity: new THREE.Uniform(1),
        uPointLight2Position: new THREE.Uniform(new THREE.Vector3(2.0, 2.0, 2.0)),
        uPointLight2SpecularPower: new THREE.Uniform(20),
        uPointLight2Decay: new THREE.Uniform(0.2),
    }
})

const materialFolder = gui.addFolder('Material')
const ambientLightFolder = gui.addFolder('Ambient Light')
const directionalLightFolder = gui.addFolder('Directional Light')
const pointLight1Folder = gui.addFolder('Point Light 1')
const pointLight2Folder = gui.addFolder('Point Light 2')

// Material
materialFolder
    .addColor(materialParameters, 'color')
    .onChange(() => {
        material.uniforms.uColor.value.set(materialParameters.color)
    })
    .name('Color')

// Ambient Light
ambientLightFolder
    .addColor(ambientLightParameters, 'color')
    .onChange(() => {
        material.uniforms.uAmbientLightColor.value.set(ambientLightParameters.color)
    })
    .name('Color')
ambientLightFolder
    .add(material.uniforms.uAmbientLightIntensity, 'value', 0, 1, 0.001)
    .name('Intensity')

// Directional Light
directionalLightFolder
    .addColor(directionalLightParameters, 'color')
    .onChange(() => {
        material.uniforms.uDirectionalLightColor.value.set(directionalLightParameters.color)
    })
    .name('Color')
directionalLightFolder
    .add(material.uniforms.uDirectionalLightIntensity, 'value', 0, 5, 0.001)
    .name('Intensity')
directionalLightFolder
    .add(material.uniforms.uDirectionalLightSpecularPower, 'value', 0, 100, 0.1)
    .name('Specular')

directionalLightFolder
    .add(material.uniforms.uDirectionalLightPosition.value, 'x', -10, 10, 0.1)
    .name('Position X')
directionalLightFolder
    .add(material.uniforms.uDirectionalLightPosition.value, 'y', -10, 10, 0.1)
    .name('Position Y')
directionalLightFolder
    .add(material.uniforms.uDirectionalLightPosition.value, 'z', -10, 10, 0.1)
    .name('Position Z')

// Point Light 1
pointLight1Folder
    .addColor(pointLight1Parameters, 'color')
    .onChange(() => {
        material.uniforms.uPointLight1Color.value.set(pointLight1Parameters.color)
    })
    .name('Color')
pointLight1Folder
    .add(material.uniforms.uPointLight1Intensity, 'value', 0, 5, 0.001)
    .name('Intensity')
pointLight1Folder
    .add(material.uniforms.uPointLight1Position.value, 'x', -10, 10, 0.1)
    .name('Position X')
pointLight1Folder
    .add(material.uniforms.uPointLight1Position.value, 'y', -10, 10, 0.1)
    .name('Position Y')
pointLight1Folder
    .add(material.uniforms.uPointLight1Position.value, 'z', -10, 10, 0.1)
    .name('Position Z')
pointLight1Folder
    .add(material.uniforms.uPointLight1SpecularPower, 'value', 0, 100, 0.1)
    .name('Specular')
pointLight1Folder
    .add(material.uniforms.uPointLight1Decay, 'value', 0, 1, 0.001)
    .name('Decay')

// Point Light 2
pointLight2Folder
    .addColor(pointLight2Parameters, 'color')
    .onChange(() => {
        material.uniforms.uPointLight2Color.value.set(pointLight2Parameters.color)
    })
    .name('Color')
pointLight2Folder
    .add(material.uniforms.uPointLight2Intensity, 'value', 0, 5, 0.001)
    .name('Intensity')
pointLight2Folder
    .add(material.uniforms.uPointLight2Position.value, 'x', -10, 10, 0.1)
    .name('Position X')
pointLight2Folder
    .add(material.uniforms.uPointLight2Position.value, 'y', -10, 10, 0.1)
    .name('Position Y')
pointLight2Folder
    .add(material.uniforms.uPointLight2Position.value, 'z', -10, 10, 0.1)
    .name('Position Z')
pointLight2Folder
    .add(material.uniforms.uPointLight2SpecularPower, 'value', 0, 100, 0.1)
    .name('Specular')
pointLight2Folder
    .add(material.uniforms.uPointLight2Decay, 'value', 0, 1, 0.001)
    .name('Decay')

/**
 * Light helpers
 */
const directionalLightHelper = new THREE.Mesh(
    new THREE.PlaneGeometry(),
    new THREE.MeshBasicMaterial()
)
directionalLightHelper.material.color = directionalLightParameters.color
directionalLightHelper.material.side = THREE.DoubleSide
directionalLightHelper.position.copy(material.uniforms.uDirectionalLightPosition.value)
scene.add(directionalLightHelper)

const pointLight1Helper = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.1, 2),
    new THREE.MeshBasicMaterial()
)
pointLight1Helper.material.color = pointLight1Parameters.color
pointLight1Helper.position.copy(material.uniforms.uPointLight1Position.value)
scene.add(pointLight1Helper)

const pointLight2Helper = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.1, 2),
    new THREE.MeshBasicMaterial()
)
pointLight2Helper.material.color = pointLight2Parameters.color
pointLight2Helper.position.copy(material.uniforms.uPointLight2Position.value)
scene.add(pointLight2Helper)

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
    (gltf) => {
        suzanne = gltf.scene
        suzanne.traverse((child) => {
            if (child.isMesh)
                child.material = material
        })
        scene.add(suzanne)
    }
)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update light
    directionalLightHelper.position.copy(material.uniforms.uDirectionalLightPosition.value)
    pointLight1Helper.position.copy(material.uniforms.uPointLight1Position.value)
    pointLight2Helper.position.copy(material.uniforms.uPointLight2Position.value)

    // Rotate objects
    if (suzanne) {
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