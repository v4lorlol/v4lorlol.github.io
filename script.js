function createParticles() {
  const avatar = document.querySelector('.avatar-container');
  const rect = avatar.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  let particleCount = 0;

  setInterval(() => {
    const particle = document.createElement('div');
    particle.className = 'particle';
    document.body.appendChild(particle);

    const size = 16 + Math.random() * 4;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    const angle = Math.random() * 2 * Math.PI;
    particle.style.left = `${centerX}px`;
    particle.style.top = `${centerY}px`;

    const maxDistance = Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2)) / 2;
    const distance = maxDistance * (0.8 + Math.random() * 0.2);
    const xOffset = Math.cos(angle) * distance;
    const yOffset = Math.sin(angle) * distance;

    const duration = 5 + Math.random() * 3;
    const animName = `burst-${particleCount}`;
    particle.style.animation = `${animName} ${duration}s ease-out forwards`;

    const opacity = 0.1 + Math.random() * 0.4;
    particle.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
    particle.style.position = 'absolute';
    particle.style.borderRadius = '50%';

    const keyframes = `
      @keyframes ${animName} {
        0% {
          transform: translate(0, 0);
          opacity: 0;
        }
        10% {
          opacity: ${opacity};
        }
        90% {
          opacity: ${opacity};
        }
        100% {
          transform: translate(${xOffset}px, ${yOffset}px);
          opacity: 0;
        }
      }
    `;
    style.innerHTML += keyframes;

    setTimeout(() => {
      particle.remove();
    }, duration * 1000);

    particleCount++;
  }, 500);
}

const style = document.createElement('style');
style.innerHTML = `
@keyframes flip {
  0% {
    transform: rotateY(0);
  }
  100% {
    transform: rotateY(180deg);
  }
}

@keyframes flipBack {
  0% {
    transform: rotateY(180deg);
  }
  100% {
    transform: rotateY(0);
  }
}`;
document.head.appendChild(style);

window.onload = () => {
  createParticles();

  const flipCard = document.querySelector('.avatar-container');
  if (flipCard) {
    flipCard.addEventListener('mouseenter', () => {
      flipCard.classList.add('flipped');
    });
    flipCard.addEventListener('mouseleave', () => {
      flipCard.classList.remove('flipped');
    });
  }
};
