/* ============================================================
   ANIMACIONES ESPECÍFICAS (js/animations.js)
============================================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Animación de "Flotado" para la imagen del personaje Hero
    const heroCharacter = document.querySelector('.floating-character');
    if (heroCharacter) {
        animateFloating(heroCharacter);
    }

    function animateFloating(element) {
        let startTime = null;
        const amplitude = 15; // Cuántos píxeles flota
        const speed = 0.001; // Velocidad de la flotación

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const yOffset = Math.sin(progress * speed) * amplitude;
            element.style.transform = `translateY(${yOffset}px)`;
            requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }

    // 2. Animación de Entrada para items de galería (usando Intersection Observer)
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px',
            threshold: 0.1 // Cuánto debe estar visible para activarse
        });

        galleryItems.forEach(item => {
            item.classList.add('fade-in-hidden'); // Añade clase oculta inicial
            observer.observe(item);
        });
    }
});

/* Estilos CSS adicionales para la animación de fade-in */
/* (Puedes añadir esto al final de styles.css para que funcione) */
/*
.fade-in-hidden {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-in-visible {
    opacity: 1;
    transform: translateY(0);
}
*/