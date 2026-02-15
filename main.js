// ===== SCENE SETUP =====
const scene = new THREE.Scene();

const isMobile = window.innerWidth < 768;

const camera = new THREE.PerspectiveCamera(
  isMobile ? 85 : 75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 20;

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "low-power"
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ===== VARIABLES =====
const objects = [];
const loader = new THREE.TextureLoader();

const imagesList = [
  "img1.jpg",
  "img2.jpg",
  "img3.jpg",
  "img4.jpg"
];

const totalImages = 25;

// ===== RESET POSITION FUNCTION =====
function resetObject(obj) {
  obj.position.x = Math.random() * 40 - 20;
  obj.position.y = Math.random() * 40 - 20;
  obj.position.z = -Math.random() * 200 - 50;

  obj.material.opacity = 0;
}

// ===== CREATE IMAGE OBJECT =====
function createImage(imgName) {

  const geometry = new THREE.PlaneGeometry(
    isMobile ? 7 : 9,
    isMobile ? 10 : 13
  );

  const texture = loader.load(`images/${imgName}`);

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0
  });

  const mesh = new THREE.Mesh(geometry, material);

  resetObject(mesh);

  scene.add(mesh);
  objects.push(mesh);
}

// ===== CREATE TEXT OBJECT =====
function createText(message) {

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 1024;
  canvas.height = 256;

  ctx.font = isMobile ? "70px Arial" : "50px Arial";
  ctx.fillStyle = "#ff69b4";
  ctx.shadowColor = "#ff1493";
  ctx.shadowBlur = 30;
  ctx.fillText(message, 50, 150);

  const texture = new THREE.CanvasTexture(canvas);

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 0
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(isMobile ? 35 : 25, isMobile ? 9 : 6, 1);

  resetObject(sprite);

  scene.add(sprite);
  objects.push(sprite);
}

// ===== GENERATE IMAGES =====
for (let i = 0; i < totalImages; i++) {
  const randomImage = imagesList[Math.floor(Math.random() * imagesList.length)];
  createImage(randomImage);
}

// ===== GENERATE WISHES =====
const wishes = [
  "Hey Shravani 💖",
  "Happy Birthday 🎂",
  "You Are My Favorite ✨",
  "Stay Happy Always 😊",
  "Forever Special 💕",
  "Smile More 🌸"
];

wishes.forEach(w => createText(w));

// ===== ANIMATION LOOP =====
function animate() {
  requestAnimationFrame(animate);

  objects.forEach(obj => {

    // Move forward
    obj.position.z += 0.8;

    // Fade In (when far)
    if (obj.position.z < -30) {
      obj.material.opacity = THREE.MathUtils.clamp(
        obj.material.opacity + 0.02,
        0,
        1
      );
    }

    // Fade Out (near camera)
    if (obj.position.z > 5) {
      obj.material.opacity -= 0.05;
    }

    // Reset when passed camera
    if (obj.position.z > 20) {
      resetObject(obj);
    }

    // Slight rotation for cinematic effect
    obj.rotation.z += 0.002;
  });

  renderer.render(scene, camera);
}

animate();

// ===== RESPONSIVE RESIZE =====
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
