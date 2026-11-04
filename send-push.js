const webpush = require('web-push');

// 1. Claves VAPID
const publicVapidKey = 'BI-scwfRMcV5uCuUjPZvP6avIyXT5809VpxyNWl-U8bEgZ3pIslgzIR4nnJMuqDQ3xBQh6vfGVk7R0vPTVrmEog';

// IMPORTANTE: Coloca aquí la Private Key que te dio `npx web-push generate-vapid-keys`
const privateVapidKey = 'idKFLOVXBZXk0B9kdlqd72vH6OtbIn59MCm9tLjtYZU';

webpush.setVapidDetails(
    'mailto:contacto@toxichorizon.com',
    publicVapidKey,
    privateVapidKey
);

// 2. Tu objeto de suscripción generado en la consola
const pushSubscription = {"endpoint":"https://wns2-bn3p.notify.windows.com/w/?token=BQYAAABSY%2bCs5WBdc7sw7MgI%2fm1j7f7zsGEm%2bj3uDYaaPdj64Jr%2b9Ejbq3kIH1Mfc89EMyLNVv39iRDqA%2fhaqJt5Y2QZudX2KS8cYg2ws640%2b7G1u1EyT%2f%2f10463l69PIg8hQ3Nre0zlir%2bACb6P5j1cHa%2fvnwL4xicE0fnHgYIo%2bQ90FsnI3p0Kp%2bRKu%2fhkQzKown8l%2fbAwSF7qp4bveAMfGz7zS6m8D%2fr4b2stTtvz8PI9BjGQZW63bZYIhsNSK0F9cDBpWFlNZvIlefp9rC2NSE%2b6yTlZgcj30BD2Evg6nnQW5yYGNTVUk%2bSKiXacH0jkHULStGjR2139PqbtXvlyFPYd","expirationTime":null,"keys":{"p256dh":"BLpsPYr_k-xUiwAxt81EYl-4f3DntT8f1uZ1lnvWgsmDfSvUDq6Z4gitk9IWKKDXllhY51Rcw41Z7ubliMKsLMg","auth":"SRSAW7VYynbuy1YcKg7YVQ"}};

// 3. Contenido del mensaje que se mostrará
const payload = JSON.stringify({
    title: 'Toxic Horizon: Alerta de Refugio',
    body: '¡Radiación detectada en el sector exterior! Revisa tu equipo.',
    url: './'
});

// 4. Enviar notificación al navegador
console.log('Enviando notificación push...');

webpush.sendNotification(pushSubscription, payload)
    .then(response => {
        console.log('¡Notificación enviada con éxito! Código de estado:', response.statusCode);
    })
    .catch(error => {
        console.error('Error al enviar la notificación:', error);
    });