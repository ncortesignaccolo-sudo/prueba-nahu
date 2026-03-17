const cursorLight = document.querySelector(".cursor-light");
const tiltCards = document.querySelectorAll(".tilt-card");
const tiltSoft = document.querySelectorAll(".tilt-soft");
const tiltMini = document.querySelector(".tilt-mini");
const magneticButton = document.querySelector(".magnetic");
const auroras = document.querySelectorAll(".aurora");
const holoCards = document.querySelectorAll(".holo-card");
const dockItems = document.querySelectorAll(".dock-item");
const floatingPanel = document.querySelector(".floating-panel");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let currentX = mouseX;
let currentY = mouseY;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function resetTransform(element) {
  element.style.transform = "perspective(1400px) rotateX(0deg) rotateY(0deg) translateY(0)";
}

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // TILT FUERTE EN TARJETAS PRINCIPALES
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
      translateY(-4px)
    `;

    const shineX = clamp((x / rect.width) * 100, 0, 100);
    const shineY = clamp((y / rect.height) * 100, 0, 100);

    card.style.setProperty("--mx", `${shineX}%`);
    card.style.setProperty("--my", `${shineY}%`);
  });

  // TILT SUAVE EN ELEMENTOS SECUNDARIOS
  tiltSoft.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 5;
    const rotateX = -((y - centerY) / centerY) * 5;

    card.style.transform = `
      perspective(1200px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-2px)
    `;
  });

  // EFECTO HOLOGRÁFICO EN CARDS
  holoCards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = clamp((x / rect.width) * 100, 0, 100);
    const percentY = clamp((y / rect.height) * 100, 0, 100);

    card.style.background = `
      linear-gradient(180deg, rgba(255,255,255,0.15), rgba(255,255,255,0.08)),
      radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255,255,255,0.18), transparent 28%),
      linear-gradient(135deg, rgba(110,200,255,0.10), rgba(255,120,220,0.08), rgba(140,110,255,0.07))
    `;
  });

  // MINI CUBO 3D REACTIVO
  if (tiltMini) {
    const rx = ((e.clientY - window.innerHeight / 2) / window.innerHeight) * -20;
    const ry = ((e.clientX - window.innerWidth / 2) / window.innerWidth) * 20;
    tiltMini.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  }

  // BOTÓN MAGNÉTICO
  if (magneticButton) {
    const rect = magneticButton.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clamp((e.clientX - centerX) * 0.18, -18, 18);
    const deltaY = clamp((e.clientY - centerY) * 0.18, -18, 18);

    magneticButton.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  }

  // PANEL FLOTANTE CON MOVIMIENTO EXTRA
  if (floatingPanel) {
    const fx = ((e.clientX - window.innerWidth / 2) / window.innerWidth) * 18;
    const fy = ((e.clientY - window.innerHeight / 2) / window.innerHeight) * 18;

    floatingPanel.style.transform = `
      perspective(1400px)
      translate3d(${fx}px, ${fy}px, 20px)
      rotateX(${-fy * 0.3}deg)
      rotateY(${fx * 0.3}deg)
    `;
  }

  // AURORAS PARALLAX
  auroras.forEach((aurora, index) => {
    const factor = (index + 1) * 0.008;
    const moveX = (e.clientX - window.innerWidth / 2) * factor;
    const moveY = (e.clientY - window.innerHeight / 2) * factor;
    aurora.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });
});

window.addEventListener("mouseleave", () => {
  tiltCards.forEach((card) => resetTransform(card));

  tiltSoft.forEach((card) => {
    card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0)";
  });

  if (magneticButton) {
    magneticButton.style.transform = "translate(0, 0)";
  }

  if (tiltMini) {
    tiltMini.style.transform = "rotateX(0deg) rotateY(0deg)";
  }

  if (floatingPanel) {
    floatingPanel.style.transform = "perspective(1400px) translate3d(0,0,0)";
  }
});

// RESET INDIVIDUAL
[...tiltCards, ...tiltSoft].forEach((item) => {
  item.addEventListener("mouseleave", () => {
    if (item.classList.contains("tilt-card")) {
      resetTransform(item);
    } else {
      item.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0)";
    }
  });
});

if (magneticButton) {
  magneticButton.addEventListener("mouseleave", () => {
    magneticButton.style.transform = "translate(0, 0)";
  });
}

// CURSOR GLOW SUAVE
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

// DOCK TIPO APPLE
dockItems.forEach((item) => {
  item.addEventListener("mousemove", () => {
    dockItems.forEach((other) => {
      const rect = other.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const distance = Math.abs(mouseX - center);

      let scale = 1;
      if (distance < 140) {
        scale = 1.45 - distance / 320;
      }

      other.style.transform = `translateY(${distance < 140 ? -8 : 0}px) scale(${scale})`;
    });
  });

  item.addEventListener("mouseleave", () => {
    dockItems.forEach((other) => {
      other.style.transform = "translateY(0) scale(1)";
    });
  });
});
