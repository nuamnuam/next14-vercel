importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: 'AIzaSyC9Mo3A7cgz0qyshuHXujRZyu2l_C4G5Xc',
    authDomain: 'pwa-push-27891.firebaseapp.com',
    projectId: 'pwa-push-27891',
    storageBucket: 'pwa-push-27891.appspot.com',
    messagingSenderId: '242957308057',
    appId: '1:242957308057:web:3983856e910fde6091a808',
    measurementId: 'G-TR7NS3YNM2',
};

firebase.initializeApp(firebaseConfig);

class CustomPushEvent extends Event {
    constructor(data) {
        super('push');

        Object.assign(this, data);
        this.custom = true;
    }
}


self.addEventListener('push', (e) => {
    if (e.custom) return;

    const oldData = e.data;

    const newEvent = new CustomPushEvent({
        data: {
            ehheh: oldData.json(),
            json() {
                const newData = oldData.json();
                newData.data = {
                    ...newData.data,
                    ...newData.notification,
                };
                delete newData.notification;
                return newData;
            },
        },
        waitUntil: e.waitUntil.bind(e),
    });

    e.stopImmediatePropagation();

    dispatchEvent(newEvent);
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const { title, body, image, icon, ...restPayload } = payload.data;
    const notificationOptions = {
        body,
        icon: image || '/static/images/196.png',
        data: restPayload,
    };
    return self.registration.showNotification(title, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
    if (event?.notification?.data && event?.notification?.data?.link) {
        self.clients.openWindow(event.notification.data.link);
    }
    event.notification.close();
});