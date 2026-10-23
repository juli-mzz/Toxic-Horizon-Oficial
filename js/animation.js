document.addEventListener('DOMContentLoaded', () => {
    
    const heroCharacter = document.querySelector('.floating-character');
    if (heroCharacter) {
        animateFloating(heroCharacter);
    }

    function animateFloating(element) {
        let startTime = null;
        const amplitude = 15;
        const speed = 0.001;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const yOffset = Math.sin(progress * speed) * amplitude;
            element.style.transform = `translateY(${yOffset}px)`;
            requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }

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
            threshold: 0.1
        });

        galleryItems.forEach(item => {
            item.classList.add('fade-in-hidden'); 
            observer.observe(item);
        });
    }
});