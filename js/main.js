window.openModal = function(archiveKey) {
    const targetModal = document.getElementById(`modal-${archiveKey}`) || document.getElementById(archiveKey);
    if (targetModal) {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    }
};

document.addEventListener('DOMContentLoaded', () => {

    const openBtns = document.querySelectorAll('.btn-modal, .btn-lore-action');
    const closeBtns = document.querySelectorAll('.close-modal, .modal-close-btn');
    const overlays = document.querySelectorAll('.modal-overlay');

    openBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-target') || btn.getAttribute('data-archive');
            if (!modalId) return;

            const targetModal = document.getElementById(modalId) || document.getElementById(`modal-${modalId}`);
            if (targetModal) {
                targetModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const activeModal = btn.closest('.modal-overlay');
            if (activeModal) {
                activeModal.classList.remove('active');
                document.body.style.overflow = 'auto'; 
            }
        });
    });

    overlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            overlays.forEach(overlay => {
                if (overlay.classList.contains('active')) {
                    overlay.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
        }
    });

    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled-header');
            } else {
                header.classList.remove('scrolled-header');
            }
        });
    }

    const dropdownItems = document.querySelectorAll('.dropdown-item');

    dropdownItems.forEach(item => {
        const trigger = item.querySelector('.dropdown-trigger');
        if (trigger) {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownItems.forEach(other => {
                    if (other !== item) other.classList.remove('active');
                });
                item.classList.toggle('active');
            });
        }
    });

    document.addEventListener('click', (e) => {
        dropdownItems.forEach(item => {
            if (!item.contains(e.target)) {
                item.classList.remove('active');
            }
        });
    });
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registrado con éxito:', reg.scope))
            .catch(err => console.error('Error al registrar Service Worker:', err));
    });
}