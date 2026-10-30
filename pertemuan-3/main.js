import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let camera, scene, renderer, orbit;
const controllers = [];
const interactables = [];
const initialTransforms = new Map();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const tempMatrix = new THREE.Matrix4();
const logBox = document.getElementById('log');
const logLines = [];

function log(message) {
  console.log(message);
  logLines.unshift(message);
  logLines.length = Math.min(logLines.length, 3);
  logBox.textContent = 'Log: ' + logLines.join(' | ');
}

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x151c2c);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1.65, 3.2);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x39445c, 1.8));
  const keyLight = new THREE.DirectionalLight(0xffffff, 2);
  keyLight.position.set(3, 5, 4);
  scene.add(keyLight);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 12),
    new THREE.MeshStandardMaterial({ color: 0x30394d, roughness: 0.9 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  scene.add(floor);
  scene.add(new THREE.GridHelper(12, 24, 0x718096, 0x46516a));

  // Objek interaktif: kubus, bola, dan kerucut.
  addObject(new THREE.BoxGeometry(0.42, 0.42, 0.42), 0xef5350, -0.75, 1.25, -1.1, 'Kubus');
  addObject(new THREE.SphereGeometry(0.25, 32, 20), 0x42a5f5, 0, 1.25, -1.1, 'Bola');
  addObject(new THREE.ConeGeometry(0.25, 0.5, 32), 0x66bb6a, 0.75, 1.25, -1.1, 'Kerucut');

  // Objek tambahan untuk pengayaan.
  addObject(new THREE.TorusKnotGeometry(0.18, 0.06, 80, 12), 0xffca28, -1.25, 1.25, -1.8, 'Torus Knot');

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  document.body.appendChild(renderer.domElement);
  document.body.appendChild(VRButton.createButton(renderer));

  orbit = new OrbitControls(camera, renderer.domElement);
  orbit.target.set(0, 1.2, -1.2);
  orbit.enableDamping = true;
  orbit.update();

  setupControllers();
  window.addEventListener('resize', onResize);
  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.setAnimationLoop(render);
  log('Scene berhasil dimuat. Pilih objek untuk mencoba interaksi.');
}

function addObject(geometry, color, x, y, z, label) {
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.42,
    metalness: 0.08,
    emissive: 0x000000
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.userData.label = label;
  scene.add(mesh);
  interactables.push(mesh);
  initialTransforms.set(mesh, {
    position: mesh.position.clone(),
    quaternion: mesh.quaternion.clone(),
    scale: mesh.scale.clone(),
    color
  });
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function setupControllers() {
  const modelFactory = new XRControllerModelFactory();

  for (let i = 0; i < 2; i++) {
    const controller = renderer.xr.getController(i);

    controller.addEventListener('connected', (event) => {
      controller.userData.gamepad = event.data.gamepad;
      controller.add(buildRay());
      log(`Controller ${i + 1} terhubung (${event.data.handedness || 'unknown'})`);
    });

    controller.addEventListener('disconnected', () => {
      controller.clear();
      controller.userData.gamepad = null;
    });

    controller.addEventListener('selectstart', onSelectStart);
    controller.addEventListener('selectend', onSelectEnd);
    controller.addEventListener('squeezestart', onSqueezeStart);

    scene.add(controller);
    controllers.push(controller);

    const grip = renderer.xr.getControllerGrip(i);
    grip.add(modelFactory.createControllerModel(grip));
    scene.add(grip);
  }
}

function buildRay() {
  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, -1)
  ]);
  const ray = new THREE.Line(
    geometry,
    new THREE.LineBasicMaterial({ color: 0xffffff })
  );
  ray.name = 'ray';
  ray.scale.z = 5;
  return ray;
}

function getIntersections(controller) {
  tempMatrix.identity().extractRotation(controller.matrixWorld);
  raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
  raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
  return raycaster.intersectObjects(interactables, false);
}

function pulse(controller, strength = 0.5, duration = 80) {
  const gamepad = controller.userData.gamepad;
  const actuator = gamepad?.hapticActuators?.[0];
  if (actuator?.pulse) actuator.pulse(strength, duration);
}

function onSelectStart(event) {
  const controller = event.target;
  const hits = getIntersections(controller);
  if (!hits.length) return;

  const object = hits[0].object;
  controller.attach(object);
  controller.userData.selected = object;
  pulse(controller);
  log(`GRAB: ${object.userData.label}`);
}

function onSelectEnd(event) {
  const controller = event.target;
  const object = controller.userData.selected;
  if (!object) return;

  scene.attach(object);
  controller.userData.selected = undefined;
  log(`RELEASE: ${object.userData.label}`);
}

function onSqueezeStart(event) {
  const controller = event.target;
  const hits = getIntersections(controller);
  if (!hits.length) return;

  const object = hits[0].object;
  object.material.color.setHex(Math.floor(Math.random() * 0xffffff));
  pulse(controller, 0.3, 50);
  log(`SQUEEZE: warna ${object.userData.label} berubah`);
}

function onPointerDown(event) {
  if (renderer.xr.isPresenting) return;

  pointer.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(interactables, false);
  if (!hits.length) return;

  const object = hits[0].object;
  object.material.color.setHex(Math.floor(Math.random() * 0xffffff));
  log(`CLICK DESKTOP: warna ${object.userData.label} berubah`);
}

function render() {
  interactables.forEach((object) => object.material.emissive.setHex(0x000000));

  controllers.forEach((controller) => {
    const held = controller.userData.selected;

    if (held) {
      held.material.emissive.setHex(0x252525);
      const gamepad = controller.userData.gamepad;
      if (gamepad?.axes?.length >= 4) {
        const y = gamepad.axes[3];
        if (Math.abs(y) > 0.15) {
          held.scale.multiplyScalar(1 - y * 0.02);
          held.scale.clampScalar(0.3, 3);
        }
        // Pengayaan: sumbu X thumbstick memutar objek yang sedang digenggam.
        const x = gamepad.axes[2] || 0;
        if (Math.abs(x) > 0.15) held.rotation.y += x * 0.025;
      }
    } else if (controller.userData.gamepad) {
      const hits = getIntersections(controller);
      if (hits.length) hits[0].object.material.emissive.setHex(0x444444);
    }
  });

  if (!renderer.xr.isPresenting) orbit.update();
  renderer.render(scene, camera);
}

init();
