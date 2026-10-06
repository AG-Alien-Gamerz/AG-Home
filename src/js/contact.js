import { auth, db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { t } from './localization.js';
import { validEmail, canUseSensitiveFeatures } from './auth-validation.js';
import { toast, busy } from './ui.js';
import {initContactMap} from './contact-map.js';
import 'leaflet/dist/leaflet.css';
initContactMap();
const form = document.getElementById('contactForm');
form?.addEventListener('submit', event => {
    event.preventDefault();
    busy(event.submitter, async () => {
        await auth.authStateReady();
        if (!canUseSensitiveFeatures(auth.currentUser)) { toast(t('auth.verificationRequired'), 'error'); return; }
        const name = document.getElementById('name').value.trim(), email = document.getElementById('email').value.trim(), message = document.getElementById('message').value.trim();
        if (!name || !message) { toast(t('validation.required'), 'error'); return; }
        if (!validEmail(email)) { toast(t('validation.email'), 'error'); return; }
        try {
            await addDoc(collection(db, 'messages'), { name, email, message, timestamp: serverTimestamp(), userId: auth.currentUser.uid, status: 'unread', archived: false });
            // The onNewMessage backend trigger delivers notifications once.
            toast(t('msg.success')); form.reset();
        } catch { toast(t('msg.error'), 'error'); }
    });
});
