import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import GUI from "lil-gui";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

// Select the first canvas element with class "webgl"
const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

const gui = new GUI({
  width: 400,
  title: "Debug UI",
  closeFolders: true,
});

gui.show(false);

const debugObject = {
  active: true,
};

const helperTweaks = gui.addFolder("Helpers");
const cameraTweaks = gui.addFolder("Camera");
const lightTweaks = gui.addFolder("Lights");
const modelTweaks = gui.addFolder("Model");
const animationTweaks = gui.addFolder("Animation");

window.addEventListener("keydown", (event) => {
  if (event.key === "h") {
    gui.show(gui._hidden);
  }
});

const sizes = {
  width: 600,
  height: 400,
};

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height, // Use canvas width and height
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas }); // Pass the canvas element
renderer.setClearColor(new THREE.Color("#d1ccb8"));
renderer.setSize(sizes.width, sizes.height); // Use canvas width and height

const keyLight = new THREE.DirectionalLight(0xffffff, 250);
keyLight.position.set(5, 10, 20);
scene.add(keyLight);

const fillLight = new THREE.AmbientLight(0xffffff, 30);
scene.add(fillLight);

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

let model;
let mixer = null;

loader.load(
  "/models/OFFF.glb",
  function (gltf) {
    gltf.scene.scale.set(2.5, 2.5, 2.5);

    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.material.color.setHex(0x93e7cf);
        child.material.metalness = 1;
        child.material.roughness = 0.1;
      }
    });

    scene.add(gltf.scene);

    model = gltf.scene;

    mixer = new THREE.AnimationMixer(gltf.scene);
    const animations = gltf.animations;
    if (animations && animations.length) {
      animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });
    }
  },
  function (xhr) {
    console.log("progress");
  },
  function (error) {
    console.error("An error happened", error);
  }
);

const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  if (mixer) {
    mixer.update(deltaTime);
  }

  if (model) {
    model.rotation.y += 0.01;

    const amplitude = 0.1;
    const frequency = 0.5;
    const offsetY = amplitude * Math.sin(frequency * elapsedTime);
    model.position.y = offsetY;
  }

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

// Second canvas element with class "webgl2"
const canvas2 = document.querySelector("canvas.webgl2");

const scene2 = new THREE.Scene();

const camera2 = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height, // Use canvas width and height
  0.1,
  1000
);
camera2.position.z = 5;

const renderer2 = new THREE.WebGLRenderer({ canvas: canvas2 }); // Pass the second canvas element
renderer2.setClearColor(new THREE.Color("#d1ccb8"));
renderer2.setSize(sizes.width, sizes.height); // Use canvas width and height

let model2;
let mixer2 = null;

loader.load(
  "/models/houdini.glb", // Load the second model
  function (gltf) {
    gltf.scene.scale.set(1, 1, 1);
    model.position.set(0, 0, 0); // Offset the position of the second model for clarity

    scene2.add(gltf.scene);

    model2 = gltf.scene;

    mixer2 = new THREE.AnimationMixer(gltf.scene);
    const animations = gltf.animations;
    if (animations && animations.length) {
      animations.forEach((clip) => {
        mixer2.clipAction(clip).play();
      });
    }
  },
  function (xhr) {
    console.log("progress");
  },
  function (error) {
    console.error("An error happened", error);
  }
);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene2.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
directionalLight.position.set(0.2, 5, 3);
scene2.add(directionalLight);

const clock2 = new THREE.Clock();
let previousTime2 = 0;

const tick2 = () => {
  const elapsedTime = clock2.getElapsedTime();
  const deltaTime = elapsedTime - previousTime2;
  previousTime2 = elapsedTime;

  if (mixer2) {
    mixer2.update(deltaTime);
  }

  if (model2) {
    model2.rotation.x += 0.01;
    model2.rotation.y += 0.01;
    model2.rotation.z += 0.01;
  }

  renderer2.render(scene2, camera2);
  window.requestAnimationFrame(tick2);
};

tick2();
