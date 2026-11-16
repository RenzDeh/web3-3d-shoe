import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// --- Renderer -------------------------------------------------------------
const canvas = document.querySelector('#scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

// --- Scene & camera -------------------------------------------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

// Zachte studio-belichting via een environment map
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(3, 2, 4);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0.5, 0);
controls.minDistance = 2;
controls.maxDistance = 12;
controls.saveState();

const rotationButton = document.querySelector('#toggle-rotation');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const setAutoRotate = (enabled) => {
  controls.autoRotate = enabled;
  rotationButton.setAttribute('aria-pressed', String(enabled));
  rotationButton.textContent = enabled ? 'Pauzeer draaien' : 'Automatisch draaien';
};
controls.autoRotateSpeed = 1;
setAutoRotate(!reducedMotion.matches);
reducedMotion.addEventListener('change', (event) => setAutoRotate(!event.matches));
rotationButton.addEventListener('click', () => setAutoRotate(!controls.autoRotate));
document.querySelector('#reset-view').addEventListener('click', () => controls.reset());

const modelStatus = document.querySelector('#model-status');

// --- Licht ----------------------------------------------------------------
const keyLight = new THREE.DirectionalLight(0xffffff, 2);
keyLight.position.set(4, 6, 3);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
scene.add(keyLight);

// --- Vloer ----------------------------------------------------------------
const floor = new THREE.Mesh(
  new THREE.CircleGeometry(5, 64),
  new THREE.ShadowMaterial({ opacity: 0.35 })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// --- Model ----------------------------------------------------------------
// Zet een schoenmodel in public/models/shoe.glb; tot dan tonen we een placeholder.
const placeholder = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.5, 0.18, 200, 32),
  new THREE.MeshStandardMaterial({ color: 0x4f8cff, metalness: 0.3, roughness: 0.35 })
);
placeholder.position.y = 0.9;
placeholder.castShadow = true;
scene.add(placeholder);

new GLTFLoader().load(
  `${import.meta.env.BASE_URL}models/shoe.glb`,
  (gltf) => {
    const shoe = gltf.scene;
    shoe.traverse((child) => {
      if (child.isMesh) child.castShadow = true;
    });

    // Schaal en centreer het model zodat het ~2 eenheden groot is en op de vloer staat
    const box = new THREE.Box3().setFromObject(shoe);
    const size = box.getSize(new THREE.Vector3());
    shoe.scale.setScalar(2 / Math.max(size.x, size.y, size.z));
    box.setFromObject(shoe);
    const center = box.getCenter(new THREE.Vector3());
    shoe.position.x -= center.x;
    shoe.position.z -= center.z;
    shoe.position.y -= box.min.y;

    scene.remove(placeholder);
    scene.add(shoe);
    modelStatus.textContent = 'Schoenmodel geladen.';
  },
  undefined,
  () => {
    modelStatus.textContent = 'Schoenmodel niet beschikbaar. Een demomodel wordt getoond.';
  }
);

// --- Resize ---------------------------------------------------------------
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Render loop ----------------------------------------------------------
const timer = new THREE.Timer();
renderer.setAnimationLoop((time) => {
  timer.update(time);
  const delta = timer.getDelta();
  controls.update(delta);
  renderer.render(scene, camera);
});
