import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui'

const gui = new dat.GUI();

//Loading
const textureLoader = new THREE.TextureLoader();

const normalTexture = textureLoader.load('./static/textures/leather_red_02_nor_1k.png');
const mapTexture = textureLoader.load('./static/textures/leather_red_02_coll1_1k.png')

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  alpha: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);


//Main asset
const geometry = new THREE.IcosahedronGeometry(10, 0)
const material = new THREE.MeshStandardMaterial({
  color: 0xFF6347,
  roughness: 0.2,
  metalness: 1,
  normalMap: normalTexture,
  map: mapTexture
});
const icosahedron = new THREE.Mesh(geometry, material);

scene.add(icosahedron);


//Lights
const ambientLight = new THREE.AmbientLight(0x404040);
const pointLight1 = new THREE.PointLight(0x49CE28, 10);
pointLight1.position.set(9, 11, 5);
const pointLight2 = new THREE.PointLight(0xB42607, 10);
pointLight2.position.set(-15, -15, 0);

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
  icosahedron.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();