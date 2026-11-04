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

    const btnSubscribe = document.getElementById('btn-subscribe');
    if (btnSubscribe) {
        btnSubscribe.addEventListener('click', subscribeUserToPush);
    }
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registrado con éxito:', reg.scope))
            .catch(err => console.error('Error al registrar Service Worker:', err));
    });
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

window.subscribeUserToPush = async function() {
    console.log('1. Botón presionado. Verificando compatibilidad...');

    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Las notificaciones Push no están soportadas en este navegador.');
        return;
    }

    console.log('2. Solicitando permisos de notificación al usuario...');
    const permission = await Notification.requestPermission();
    console.log('Estado del permiso:', permission);

    if (permission !== 'granted') {
        console.warn('Permiso no concedido:', permission);
        return;
    }

    console.log('3. Esperando que el Service Worker esté listo...');
    const registration = await navigator.serviceWorker.ready;

    const PUBLIC_VAPID_KEY = 'BI-scwfRMcV5uCuUjPZvP6avIyXT5809VpxyNWl-U8bEgZ3pIslgzIR4nnJMuqDQ3xBQh6vfGVk7R0vPTVrmEog';

    try {
        console.log('4. Creando la suscripción push...');
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
        });

        console.log('¡Suscripción registrada con éxito en el cliente!');

        // 5. DISPARO INMEDIATO DE LA NOTIFICACIÓN NATIVA
        await registration.showNotification('Toxic Horizon: Alerta de Refugio', {
            body: '¡Alertas activadas! Monitoreando actividad radiactiva en el sector.',
            icon: './img/icon-192.png',
            badge: './img/icon-192.png',
            vibrate: [150, 50, 150],
            data: {
                url: './'
            }
        });

    } catch (error) {
        console.error('Error durante la suscripción Push:', error);
    }
};