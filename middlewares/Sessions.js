import session from 'express-session';
import sessionStore from '../utilities/sessionStore.js';
import dotenv from 'dotenv';
dotenv.config();
export function expressSessions() {
    return session({
        store: sessionStore,
        secret: process.env.SESSION_SECRET, // Ensure SESSION_SECRET is treated as a string
        resave: false,
        saveUninitialized: false,
        rolling: true,
        cookie: {
            maxAge: 30 * 60 * 1000, // Set cookie expiration to 30 minutes
            httpOnly: true,
            secure: false,
            sameSite: 'none',
        }
    });
}
async function syncSessionStore() {
    try {
        sessionStore.sync();
        console.log('Session store synced successfully.');
    }
    catch (err) {
        console.error('Failed to sync session store:', err);
    }
}
// Call the function to sync the session store
syncSessionStore();
