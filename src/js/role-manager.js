import { auth, functions } from './firebase-config.js';
import { getFirestore, collection, doc, getDoc, setDoc, addDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

const db = getFirestore();

// Role definitions
export const ROLES = {
    OWNER: 'OWNER',
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    MODERATOR: 'MODERATOR',
    USER: 'USER'
};

// Role configuration with permissions
export const ROLE_CONFIG = {
    [ROLES.OWNER]: {
        level: 1000,
        canManage: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER],
        canDelete: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER],
        description: 'Full system access and control'
    },
    [ROLES.SUPER_ADMIN]: {
        level: 100,
        // Super Admins may manage Admins and Moderators only (not Owners)
        canManage: [ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER],
        canDelete: [ROLES.ADMIN, ROLES.MODERATOR],
        description: 'Can manage Admins and Moderators only'
    },
    [ROLES.ADMIN]: {
        level: 80,
        // Admins can manage Moderators only
        canManage: [ROLES.MODERATOR, ROLES.USER],
        canDelete: [ROLES.MODERATOR],
        description: 'Can manage Moderators only'
    },
    [ROLES.MODERATOR]: {
        level: 50,
        // Moderators cannot manage anyone
        canManage: [],
        canDelete: [],
        description: 'Moderator: limited privileges; cannot manage other users'
    },
    [ROLES.USER]: {
        level: 10,
        canManage: [],
        canDelete: [],
        description: 'Basic user access'
    }
};

export const OWNER_EMAILS = ['ag.aliengamerz@gmail.com', 'hamza.datashare@gmail.com'];

class RoleManager {
    async getUserRole(userId) {
        const user = auth.currentUser;
        if (!user?.emailVerified) return ROLES.USER;
        let email = user.email?.toLowerCase();
        if (userId !== user.uid) {
            const profile = await getDoc(doc(db, 'users', userId));
            email = profile.data()?.email;
        }
        if (!email) return ROLES.USER;
        email = email.toLowerCase();
        if (OWNER_EMAILS.includes(email)) return ROLES.OWNER;
        const administrator = await getDoc(doc(db, 'admins', email));
        if (administrator.exists()) return administrator.data().isSuperAdmin ? ROLES.SUPER_ADMIN : ROLES.ADMIN;
        const moderator = await getDoc(doc(db, 'moderators', email));
        return moderator.exists() ? ROLES.MODERATOR : ROLES.USER;
    }
    async checkPermission(user, action, targetRole) {
        if (!user?.emailVerified) return false;
        try {
            const role = await this.getUserRole(user.uid), config = ROLE_CONFIG[role];
            if (!config) return false;
            if (action === 'manage') return config.canManage.includes(targetRole);
            if (action === 'delete') return config.canDelete.includes(targetRole);
            return config.level >= (ROLE_CONFIG[targetRole]?.level || Infinity);
        } catch { return false; }
    }
    async assignRole(user, targetEmail, role) {
        if (!await this.checkPermission(user, 'manage', role)) throw new Error('Insufficient permissions');
        const result = await httpsCallable(functions, 'setUserRole')({ targetEmail: targetEmail.trim().toLowerCase(), role });
        return result.data.success;
    }
    async removeRole(user, targetEmail, role) {
        if (!await this.checkPermission(user, 'delete', role)) throw new Error('Insufficient permissions');
        const result = await httpsCallable(functions, 'removeUserRole')({ targetEmail: targetEmail.trim().toLowerCase(), role });
        return result.data.success;
    }
}
export const roleManager = new RoleManager();
export default roleManager;
