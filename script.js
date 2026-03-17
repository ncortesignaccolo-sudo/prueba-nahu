const cursorLight = document.querySelector(".cursor-light");
const tiltCards = document.querySelectorAll(".tilt-card");
const tiltMini = document.querySelector(".tilt-mini");
const magneticButton = document.querySelector(".magnetic");
const auroras = document.querySelectorAll(".aurora");
const holoCards = document.querySelectorAll(".holo-card");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let currentX = mouseX;
let currentY = mouseY;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // TILT 3D EN TARJETAS
  tiltCards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 10;
    const rotateX = -((y - centerY) / centerY) * 10;

    card.style.transform = `
      perspective(1400px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateZ(0)
      translateY(-4px)
    `;

    const shineX = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;
    card.style.setProperty("--mx", `${shineX}%`);
    card.style.setProperty("--my", `${shineY}%`);
  });

  // MINI CUBO REACTIVO
  if (tiltMini) {
    const rx = ((e.clientY - window.innerHeight / 2) / window.innerHeight) * -18;
    const ry = ((e.clientX - window.innerWidth / 2) / window.innerWidth) * 18;
    tiltMini.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  }

  // BOTÓN MAGNÉTICO
  if (magneticButton) {
    const rect = magneticButton.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clamp((e.clientX - centerX) * 0.2, -18, 18);
    const deltaY = clamp((e.clientY - centerY) * 0.2, -18, 18);

    magneticButton.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  }

  // PARALLAX DE FONDO
  auroras.forEach((aurora, index) => {
    const factor = (index + 1) * 0.01;
    const moveX = (e.clientX - window.innerWidth / 2) * factor;
    const moveY = (e.clientY - window.innerHeight / 2) * factor;
    aurora.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });

  // EFECTO HOLOGRÁFICO / SHINE
  holoCards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = clamp((x / rect.width) * 100, 0, 100);
    const percentY = clamp((y / rect.height) * 100, 0, 100);

    card.style.background = `
      linear-gradient(180deg, rgba(255,255,255,0.15), rgba(255,255,255,0.08)),
      radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255,255,255,0.22), transparent 28%),
      linear-gradient(135deg, rgba(110,200,255,0.10), rgba(255,120,220,0.08), rgba(140,110,255,0.07))
    `;
  });
});

window.addEventListener("mouseleave", () => {
  tiltCards.forEach((card) => {
    card.style.transform = `
      perspective(1400px)
      rotateX(0deg)
      rotateY(0deg)
      translateY(0)
    `;
  });

  if (magneticButton) {
    magneticButton.style.transform = "translate(0, 0)";
  }

  if (tiltMini) {
    tiltMini.style.transform = "rotateX(0deg) rotateY(0deg)";
  }
});

tiltCards.forEach((card) => {
  card.addEventListener("mouseleave", () => {
    card.style.transform = `
      perspective(1400px)
      rotateX(0deg)
      rotateY(0deg)
      translateY(0)
    `;
  });
});

if (magneticButton) {
  magneticButton.addEventListener("mouseleave", () => {
    magneticButton.style.transform = "translate(0, 0)";
  });
}

// LUZ SUAVE QUE SIGUE AL CURSOR
function animateCursorLight() {
  currentX += (mouseX - currentX) * 0.1;
  currentY += (mouseY - currentY) * 0.1;

  if (cursorLight) {
    cursorLight.style.left = `${currentX}px`;
    cursorLight.style.top = `${currentY}px`;
  }

  requestAnimationFrame(animateCursorLight);
}

animateCursorLight();
