import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

const gui = new dat.GUI();
const gltfLoader = new GLTFLoader();
const objLoader = new OBJLoader();
const mtlLoader = new MTLLoader();
const textureLoader = new THREE.TextureLoader;

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
camera.position.setZ(50);

renderer.render(scene, camera);

/**
 * DICE MODEL LOADER
 */
let dice_model = undefined;
let dice_rotation_speed = {
  x: 0,
  y: 0.1,
  z: 0.1
}
//loadDice();
loadDesktop();

let ambientLight, pointLight1, pointLight2;
const pointLightsPalette = {
  light1: 0x49CE28,
  light2: 0xB42607
};
loadLights();
const particles_objs = loadParticles();
scene.add(particles_objs);



loadDebugHelpers();


//Mouse orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

/**
 * Scroll behaviour
*/
let lastScrollTop = 0
window.addEventListener('scroll', () => {
  console.log('scroll detected')
  var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
  if (st > lastScrollTop) {
    // downscroll
    if (typeof dice_model !== "undefined") {
      dice_model.rotateY(0.03);
      dice_model.rotateX(0.03);
      particles_objs.position.y += 1;
    }
  } else {
    // upscroll
    if (typeof dice_model !== "undefined") {
      dice_model.rotateY(-0.03);
      dice_model.rotateX(-0.03);
      particles_objs.position.y -= 1;
    }
  }
  lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
});


/**
 * START FUNCITONS
*/

function loadDice() {
  gltfLoader.load('static/textures/dice/scene.gltf',
    (gltf) => {
      dice_model = gltf.scene.children[0];
      dice_model.lookAt(1, 0, 0);
      scene.add(dice_model);
    },
    (progress) => {
      console.log(`${progress.loaded / progress.total} % loaded`);
    },
    (e) => {
      console.error(e);
    }
  );
}


function loadLights() {
  ambientLight = new THREE.AmbientLight(0x404040);
  pointLight1 = new THREE.PointLight(0x8928ce, 10);
  pointLight1.position.set(5, 2, 1);
  pointLight2 = new THREE.PointLight(0xffffff, 1);
  pointLight2.position.set(-14, 20, 17);

  scene.add(ambientLight, pointLight1, pointLight2);
}

function loadParticles() {
  const particles_geometry = new THREE.BufferGeometry;
  const particles_cnt = 1000;
  const posArray = new Float32Array(particles_cnt * 3);
  //const star_point = textureLoader.load('./star-point.png');

  for (let i = 0; i < particles_cnt * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 55;
  }

  particles_geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  const particles_material = new THREE.PointsMaterial({
    size: 0.005,
    transparent: true
  });

  const particles_mesh = new THREE.Points(particles_geometry, particles_material);

  return particles_mesh;
}

let desktop;
function loadDesktop() {
  mtlLoader.load('static/desktop/home-office.mtl', (mat) => {
    mat.preload();

    objLoader.setMaterials(mat);

    objLoader.load('static/desktop/home-office.obj',
      function (object) {
        object.scale.set(0.1, 0.1, 0.1)
        scene.add(object);
        object.position.set(0, 0, 0);
      },
      // called when loading is in progresses
      function (xhr) {
  
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  
      },
      // called when loading has errors
      function (error) {
  
        console.log('An error happened');
  
      }
    )
    
  })
}

//GUI & VISUAL HELPERS
function loadDebugHelpers() {
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

  const dice_gui_folder = gui.addFolder('Dice');
  dice_gui_folder.add(dice_rotation_speed, 'y');
  dice_gui_folder.add(dice_rotation_speed, 'z');

  const lightHelper1 = new THREE.PointLightHelper(pointLight1);
  const lightHelper2 = new THREE.PointLightHelper(pointLight2);
  //const gridHelper = new THREE.GridHelper(50, 50);

  scene.add(lightHelper1, lightHelper2);
}


/**
 * END FUNCTIONS
 */


///////////////////////
//FRAME UPDATE SCENE//
/////////////////////
const clock = new THREE.Clock();
let elapsed_time = 0;
function animate() {

  elapsed_time = clock.getElapsedTime();
  if (typeof dice_model !== "undefined") {
    dice_model.rotateY(dice_rotation_speed.y * elapsed_time);
    dice_model.rotateZ(dice_rotation_speed.z * elapsed_time);
  }
  particles_objs.rotateY(0.001);

  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
  clock.start()
}

animate();