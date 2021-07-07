import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

const gui = new dat.GUI();

window.scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  alpha: true,
});


/**
 * Sizes for camera view size
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(sizes.width, sizes.height);
camera.position.setZ(3);

renderer.render(scene, camera);


const loader = new GLTFLoader();

loader.load( 'static/textures/dice/scene.gltf', 
  (gltf) => {
    console.log(`gltf asset loaded`);
    scene.add( gltf.scene );
  },
  (progress) => {
    console.log(`${progress.loaded / progress.total} % loaded`);
  },
  (e) => {
    console.error(e);
  })


//Lights
const ambientLight = new THREE.AmbientLight(0x404040);
const pointLight1 = new THREE.PointLight(0x8928ce, 10);
pointLight1.position.set(5, 5, -1);
const pointLight2 = new THREE.PointLight(0xB42607, 20);
pointLight2.position.set(-5, -5, 1);

scene.add(ambientLight, pointLight1, pointLight2);

const pointLightsPalette = {
  light1: 0x49CE28,
  light2: 0xB42607
}

const light1_gui_folder = gui.addFolder('Light 1');
light1_gui_folder.add(pointLight1.position, 'x');
light1_gui_folder.add(pointLight1.position, 'y');
light1_gui_folder.add(pointLight1.position, 'z');
light1_gui_folder.add(pointLight1, 'intensity');
light1_gui_folder.addColor(pointLightsPalette, 'light1')
  .onChange(() => {
    pointLight1.color.set(pointLightsPalette.light1);
  });

const light2_gui_folder = gui.addFolder('Light 2');
light2_gui_folder.add(pointLight2.position, 'x');
light2_gui_folder.add(pointLight2.position, 'y');
light2_gui_folder.add(pointLight2.position, 'z');
light2_gui_folder.add(pointLight2, 'intensity');
light2_gui_folder.addColor(pointLightsPalette, 'light2')
  .onChange(() => {
    pointLight2.color.set(pointLightsPalette.light2);
  });

//Visual Helpers


const lightHelper1 = new THREE.PointLightHelper(pointLight1);
const lightHelper2 = new THREE.PointLightHelper(pointLight2);
const gridHelper = new THREE.GridHelper(50, 50);

scene.add(lightHelper1, lightHelper2, gridHelper);


//Mouse orbit controls
const controls = new OrbitControls(camera, renderer.domElement);


//FRAME UPDATE SCENE
function animate() {
  requestAnimationFrame(animate);

  //Main asset movement
  //icosahedron.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();