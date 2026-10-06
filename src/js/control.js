import { auth, functions } from './firebase-config.js';
import { httpsCallable } from 'firebase/functions';
import { getFirestore, collection, doc, getDoc, setDoc, addDoc, query, where, getDocs, updateDoc, deleteDoc, orderBy, onSnapshot } from 'firebase/firestore';
import {initNotifications,mountNotificationSettings} from './notifications.js';
import { onAuthStateChanged } from 'firebase/auth';
import roleManager, { ROLES, OWNER_EMAILS } from './role-manager.js';
import { mountPlatformEditor, fillPlatformEditor, readPlatformEditor } from './product-editor.js';
import { prepareProductForm } from './product-form-ui.js';
import { mountProductRelationships, fillProductRelationships, readProductRelationships } from './product-relationships.js';
import { initializeCatalogue } from './product-data.js';
import { filterMessages, messageCounts, messageStatus } from './feedback-model.js';
import { safeURL, productActions, normalizeProduct, PLATFORMS } from './product-model.js';
import { initLocalization, t } from './localization.js';
import { initTheme } from './theme.js';
import { logout, pageURL, rejectUnverifiedSession } from './auth-service.js';
import { initCharacter } from './character.js';
import { initAdminLocalization } from './admin-localization.js';
import { initModals, busy, initValidation, toast } from './ui.js';
import {initTeamManagement} from './team-admin.js';

const db = getFirestore();

// Exchange rate: 1 USD = ~278 PKR (you can update this)
const PKR_TO_USD_RATE = 278;

// Helper function to convert PKR to USD
function convertPKRToUSD(priceInPKR) {
    if (!priceInPKR || priceInPKR === 0) return 0;
    return (priceInPKR / PKR_TO_USD_RATE).toFixed(2);
}

// Helper function to format price display
function formatPrice(priceInPKR) {
    const price = Number(priceInPKR) || 0;
    return price <= 0 ? t('product.free') : new Intl.NumberFormat(document.documentElement.lang, { style: 'currency', currency: 'PKR' }).format(price);
}

// ============================================================================
// DATA LOADING FUNCTIONS
// ============================================================================

async function loadModerators() {
    const moderatorsList = document.getElementById('moderatorsList');
    if (!moderatorsList) {
        console.log('Moderators list element not found');
        return;
    }

    try {
        moderatorsList.innerHTML = '<div class="loading">Loading moderators...</div>';

        const q = query(collection(db, 'moderators'));
        const snapshot = await getDocs(q);

        let moderatorsList_data = [];

        snapshot.forEach(docSnap => {
            const mod = docSnap.data();
            moderatorsList_data.push({
                id: docSnap.id,
                ...mod,
                source: 'moderators'
            });
        });

        const users = await loadUsersByRole('MODERATOR');
        users.forEach(user => {
            if (!moderatorsList_data.find(m => m.email === user.email)) {
                moderatorsList_data.push({
                    ...user,
                    source: 'users'
                });
            }
        });

        moderatorsList.innerHTML = '';

        if (moderatorsList_data.length === 0) {
            moderatorsList.innerHTML = '<p class="no-moderators">No moderators found</p>';
            return;
        }

        moderatorsList_data.sort((a, b) => a.email.localeCompare(b.email));

        for (const mod of moderatorsList_data) {
            const canManage = await roleManager.checkPermission(
                auth.currentUser,
                'manage',
                ROLES.MODERATOR
            );

            const addedDate = mod.addedAt?.toDate?.() || mod.createdAt?.toDate?.() || null;
            const dateStr = addedDate ? new Date(addedDate).toLocaleDateString() : 'N/A';

            moderatorsList.innerHTML += `
                <div class="moderator-item">
                    <div class="moderator-info">
                        <div class="moderator-email">${escapeHtml(mod.email)}</div>
                        <div class="moderator-meta">
                            <span class="admin-type regular">
                                Moderator
                            </span>
                            <span class="moderator-date">Added: ${dateStr}</span>
                            <span class="moderator-by">by: ${escapeHtml(mod.addedBy || 'N/A')}
                        </div>
                    </div>
                    ${canManage ? `
                        <div class="moderator-actions">
                            <button onclick="removeModerator(${inlineArg(mod.id || mod.email)})" class="remove-btn">
                                Remove
                            </button>
                            <button onclick="showRolePicker(${inlineArg(mod.id || mod.email)}, ${inlineArg((mod.email))}, 'MODERATOR', this)" class="promote-btn">
                                Change Role
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading moderators:', error);
        moderatorsList.innerHTML = '<p class="error">Error loading moderators</p>';
    }
}

async function loadAdmins() {
    const adminsList = document.getElementById('adminsList');

    if (!adminsList) {
        console.log('Admin list element not found - this might be normal if section is not active');
        return;
    }

    try {
        console.log('Loading admin list... Element found:', !!adminsList);
        adminsList.innerHTML = '<div class="loading">Loading admins...</div>';

        const snapshot = await getDocs(query(collection(db, 'admins')));
        console.log('Fetching admin list data...');
        adminsList.innerHTML = '';

        if (snapshot.empty) {
            adminsList.innerHTML = '<p class="no-admins">No admins found</p>';
            return;
        }

        snapshot.forEach(docSnap => {
            const admin = docSnap.data();
            console.log('Admin list entry:', admin);

            // Treat the original owner as super admin regardless of stored flag
            const isSuperAdmin = admin.isSuperAdmin || admin.email === 'ag.aliengamerz@gmail.com';

            // Only show regular admins in the Admins management view.
            // Super admins should only be visible in the Super Admin management section.
            if (isSuperAdmin) return; // skip rendering super admins here

            const isOriginalSuperAdmin = auth.currentUser?.email === 'ag.aliengamerz@gmail.com';

            adminsList.innerHTML += `
                <div class="admin-item">
                    <div class="admin-info">
                        <div class="admin-email">${escapeHtml(admin.email)}</div>
                        <div class="admin-meta">
                            <span class="admin-type regular">
                                Admin
                            </span>
                            <span class="admin-date">Added: ${formatDate(admin.addedAt)}</span>
                            <span class="admin-by">by: ${escapeHtml(admin.addedBy || 'N/A')}
                        </div>
                    </div>
                    ${(isOriginalSuperAdmin && admin.email !== 'ag.aliengamerz@gmail.com') ? `
                        <div class="admin-actions">
                            <button onclick="showRolePicker(${inlineArg(docSnap.id)}, ${inlineArg((admin.email))}, 'ADMIN', this)" class="role-btn">
                                Change Role
                            </button>
                            <button onclick="removeAdmin(${inlineArg(docSnap.id)})" class="remove-btn">
                                Remove
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        });
    } catch (error) {
        console.error('Error loading admins:', error);
        if (adminsList) {
            adminsList.innerHTML = '<p class="error">Error loading admins</p>';
        }
    }
}

async function loadSuperAdmins() {
    const superAdminsList = document.getElementById('superAdminsList');

    if (!superAdminsList) {
        console.log('Super admins list element not found - this might be normal if section is not active');
        return;
    }

    try {
        superAdminsList.innerHTML = '<div class="loading">Loading super admins...</div>';

        const snapshot = await getDocs(
            query(collection(db, 'admins'), where('isSuperAdmin', '==', true))
        );

        superAdminsList.innerHTML = '';

        if (snapshot.empty) {
            superAdminsList.innerHTML = '<p class="no-super-admins">No super admins found</p>';
            return;
        }

        snapshot.forEach(docSnap => {
            const superAdmin = docSnap.data();
            const isOriginalSuperAdmin = auth.currentUser?.email === 'ag.aliengamerz@gmail.com';
            const canModify = isOriginalSuperAdmin && superAdmin.email !== 'ag.aliengamerz@gmail.com';

            superAdminsList.innerHTML += `
                <div class="super-admin-item">
                    <div class="super-admin-info">
                        <div class="super-admin-email">${escapeHtml(superAdmin.email)}</div>
                        <div class="super-admin-meta">
                        <span class="admin-type regular">
                            Super Admin
                        </span>
                            <span class="super-admin-date">Added: ${formatDate(superAdmin.addedAt)}</span>

                        </div>
                    </div>
                    ${canModify ? `
                        <div class="super-admin-actions">
                            <button onclick="showRolePicker(${inlineArg(docSnap.id || superAdmin.email)}, ${inlineArg((superAdmin.email))}, 'SUPER_ADMIN', this)" class="demote-btn">
                                Change Role
                            </button>
                            <button onclick="removeSuperAdmin(${inlineArg(docSnap.id)})" class="remove-btn">
                                Remove
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        });
    } catch (error) {
        console.error('Error loading super admins:', error);
        superAdminsList.innerHTML = '<p class="error">Error loading super admins</p>';
    }
}

let inboxMessages = [];
let inboxFilter = 'all';
let inboxUnsubscribe;
let inboxFiltersInitialized = false;

function renderMessages() {
    const messagesList = document.getElementById('messagesList');
    if (!messagesList) return;
    const counts = messageCounts(inboxMessages);
    for (const button of document.querySelectorAll('[data-message-filter]')) {
        const selected = button.dataset.messageFilter === inboxFilter;
        button.setAttribute('aria-pressed', String(selected));
        button.querySelector('.filter-count').textContent = counts[button.dataset.messageFilter];
    }
    const visible = filterMessages(inboxMessages, inboxFilter);
    if (!visible.length) {
        messagesList.innerHTML = `<div class="inbox-empty"><span aria-hidden="true">✉</span><p data-i18n="feedback.empty">${t('feedback.empty')}</p></div>`;
        return;
    }
    messagesList.innerHTML = visible.map(message => {
                const date = message.timestamp?.toDate?.()
                    ? message.timestamp.toDate().toLocaleString(document.documentElement.lang)
                    : '';
                const status = messageStatus(message);
                const archived = message.archived ? true : false;
                const adminReply = message.adminReply || '';
                return `
                    <article class="message-card ${archived ? 'archived' : ''} ${status}" id="${escapeHtml(message.id)}">
                        <div class="message-header">
                            <h3>${escapeHtml(message.name || t('auth.guest'))}</h3>
                            <div class="message-meta">
                                <span class="message-date">${date}</span>
                                <span class="status-badge ${status === 'read' ? 'read' : 'unread'}" data-status="${status === 'read' ? 'read' : 'unread'}" data-i18n="admin.${status === 'read' ? 'read' : 'unread'}">${t(status === 'read' ? 'admin.read' : 'admin.unread')}</span>
                                ${archived ? `<span class="archived-badge" data-i18n="admin.archived">${t('admin.archived')}</span>` : ''}
                            </div>
                        </div>
                        ${message.email ? `<div class="message-email">
                            <a href="mailto:${escapeHtml(message.email)}">${escapeHtml(message.email)}</a>
                        </div>` : ''}
                        <p class="message-content">${escapeHtml(message.message)}</p>
                        ${adminReply ? `<div class="admin-reply"><strong data-i18n="admin.reply">${t('admin.reply')}</strong><p>${escapeHtml(adminReply)}</p></div>` : ''}
                        <div class="message-actions">
                            <button onclick="markMessageRead(${inlineArg(message.id)})" class="mark-read-btn" data-i18n="admin.${status === 'read' ? 'markUnread' : 'markRead'}">
                                ${t(status === 'read' ? 'admin.markUnread' : 'admin.markRead')}
                            </button>
                            ${message.email ? `<button onclick="replyToEmail(decodeURIComponent(${inlineArg(encodeURIComponent(message.email || '').replace(/'/g, '%27'))}))" class="reply-btn" data-i18n="admin.reply">
                                ${t('admin.reply')}
                            </button>` : ''}
                            <button onclick="adminReplyPrompt(${inlineArg(message.id)})" class="admin-reply-btn" data-i18n="admin.addReply">
                                ${t('admin.addReply')}
                            </button>
                            <button onclick="deleteMessage(${inlineArg(message.id)})" class="delete-btn" data-i18n="admin.delete">
                                ${t('admin.delete')}
                            </button>
                        </div>
                    </article>
                `;
    }).join('');
}

async function loadMessages() {
    const messagesList = document.getElementById('messagesList');
    if (!messagesList) return;
    if (!inboxFiltersInitialized) {
        document.getElementById('messageFilters').addEventListener('click', event => {
            const button = event.target.closest('[data-message-filter]');
            if (!button) return;
            inboxFilter = button.dataset.messageFilter;
            renderMessages();
        });
        window.addEventListener('languageChanged', renderMessages);
        window.addEventListener('pagehide', () => { inboxUnsubscribe?.(); inboxUnsubscribe = null; });
        window.addEventListener('pageshow', event => { if (event.persisted) loadMessages(); });
        inboxFiltersInitialized = true;
    }
    // Navigation back to the inbox reuses the existing live Firestore listener.
    if (inboxUnsubscribe) { renderMessages(); return; }
    messagesList.innerHTML = `<p class="loading" data-i18n="msg.loading">${t('msg.loading')}</p>`;
    try {
        const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
        inboxUnsubscribe = onSnapshot(q, snapshot => {
            inboxMessages = snapshot.docs.map(docSnap => ({ ...docSnap.data(), id: docSnap.id }));
            renderMessages();
        }, (error) => {
            console.error('Error loading messages:', error);
            inboxUnsubscribe = null;
            messagesList.innerHTML = `<p class="error-message" data-i18n="auth.network">${t('auth.network')}</p>`;
        });
    } catch (error) {
        console.error('Error setting up message listener:', error);
    }
}

async function loadUsersByRole(role) {
    const usersQuery = query(collection(db, 'users'), where('rank', '==', role));
    const snapshot = await getDocs(usersQuery);
    return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
}

// ============================================================================
// USER MANAGEMENT FUNCTIONS
// ============================================================================

async function removeModerator(id) {
    if (!confirm(t('admin.confirm'))) return;
    try {
        let email = id;
        if (!id.includes('@')) email = (await getDoc(doc(db, 'users', id))).data()?.email;
        await roleManager.removeRole(auth.currentUser, email, ROLES.MODERATOR);
        await Promise.all([loadModerators(), window.loadUsers?.()]); alert(t('msg.success'));
    } catch { alert(t('msg.error')); }
}

async function removeAdmin(adminId) {
    if (!confirm('Are you sure you want to remove this admin?')) return;

    try {
        await roleManager.removeRole(auth.currentUser, adminId, ROLES.ADMIN);
        await Promise.all([window.loadAdmins?.(), window.loadUsers?.()]);
        alert('Admin removed successfully');
    } catch (error) {
        console.error('Error removing admin:', error);
        alert(error.message || 'Failed to remove admin');
    }
}

async function removeSuperAdmin(uid) {
    if (!confirm('Are you sure you want to remove this super admin?')) return;

    try {
        await roleManager.removeRole(auth.currentUser, uid, ROLES.SUPER_ADMIN);
        await Promise.all([window.loadSuperAdmins?.(), window.loadUsers?.()]);
        alert('Super admin removed successfully');
    } catch (error) {
        console.error('Error removing super admin:', error);
        alert(error.message || 'Failed to remove super admin');
    }
}

async function toggleAdminRole(adminId, currentIsSuperAdmin) {
    try {
        const wasSuper = currentIsSuperAdmin === true || currentIsSuperAdmin === 'true';
        await roleManager.assignRole(auth.currentUser, adminId, wasSuper ? ROLES.ADMIN : ROLES.SUPER_ADMIN);
        await Promise.all([loadAdmins(), loadSuperAdmins()]); alert(t('msg.success'));
    } catch { alert(t('msg.error')); }
}

async function promoteModerator(id) {
    if (!confirm(t('admin.confirm'))) return;
    try {
        const email = id.includes('@') ? id : (await getDoc(doc(db, 'users', id))).data()?.email;
        await roleManager.assignRole(auth.currentUser, email, ROLES.ADMIN);
        await Promise.all([loadModerators(), loadAdmins(), window.loadUsers?.()]); alert(t('msg.success'));
    } catch { alert(t('msg.error')); }
}

async function demoteFromSuperAdmin(adminEmail) {
    if (!confirm(t('admin.confirm'))) return;
    try { await roleManager.assignRole(auth.currentUser, adminEmail, ROLES.ADMIN); await Promise.all([loadAdmins(),loadSuperAdmins()]); alert(t('msg.success')); }
    catch { alert(t('msg.error')); }
}

async function deleteMessage(messageId) {
    if (confirm('Are you sure you want to delete this message?')) {
        try {
            await deleteDoc(doc(db, 'messages', messageId));
            console.log('Message deleted successfully');
        } catch (error) {
            console.error('Error deleting message:', error);
            alert('Failed to delete message');
        }
    }
}

function replyToEmail(email) {
    window.location.href = `mailto:${email}`;
}

async function updateMessageMetadata(messageId, updates) {
    try { await httpsCallable(functions, 'updateMessage')({ messageId, updates }); }
    catch { alert(t('msg.error')); }
}

async function markMessageRead(messageId) {
    try {
        // Toggle based on current DOM badge text
        const el = document.getElementById(messageId);
        const statusBadge = el?.querySelector('.status-badge');
        const current = statusBadge?.dataset.status || 'unread';
        const newStatus = current === 'read' ? 'unread' : 'read';
        await updateMessageMetadata(messageId, { status: newStatus });
    } catch (err) {
        console.error(err);
    }
}

async function toggleArchiveMessage(messageId, currentlyArchived) {
    // archive functionality removed from UI; keep function for backwards compatibility if needed
    try {
        await updateMessageMetadata(messageId, { archived: !currentlyArchived });
    } catch (err) {
        console.error(err);
    }
}

async function adminReplyPrompt(messageId) {
    const reply = prompt('Enter admin reply (this will be saved and visible to other admins):');
    if (reply === null) return; // cancelled
    if (reply.trim() === '') {
        alert('Reply cannot be empty');
        return;
    }
    await updateMessageMetadata(messageId, { adminReply: reply.trim() });
}

async function changeUserRole(userId) {
    try {
        const profile = (await getDoc(doc(db, 'users', userId))).data();
        const current = await roleManager.getUserRole(userId), roles = ['USER','MODERATOR','ADMIN'];
        const next = roles[(roles.indexOf(current) + 1) % roles.length];
        if (!confirm(t('admin.confirm'))) return;
        await httpsCallable(functions, 'setUserRole')({ targetEmail: profile.email, role: next });
        window.loadUsers?.(); alert(t('msg.success'));
    } catch { alert(t('msg.error')); }
}

async function deleteUser(userId) {
    if (!confirm(t('admin.confirm'))) return;
    try { await httpsCallable(functions, 'deleteUserProfile')({ userId }); window.loadUsers?.(); alert(t('msg.success')); }
    catch { alert(t('msg.error')); }
}

// ============================================================================
// MODAL FUNCTIONS
// ============================================================================

function openAddModeratorModal() {
    const modal = document.getElementById('addModeratorModal');
    const emailInput = document.getElementById('moderatorEmail');

    if (!modal) {
        console.error('Moderator modal not found');
        alert('Error: Modal not found. Please refresh the page.');
        return;
    }

    modal.classList.remove('hidden');

    if (emailInput) {
        emailInput.focus();
    }
}

// Expose moderator modal functions immediately to window for inline onclick handlers
window.openAddModeratorModal = openAddModeratorModal;
window.closeAddModeratorModal = closeAddModeratorModal;

function closeAddModeratorModal() {
    const modal = document.getElementById('addModeratorModal');
    const form = document.getElementById('addModeratorForm');

    if (modal) {
        modal.classList.add('hidden');
    }

    if (form) {
        form.reset();
    }
}

// Modal open/close handlers for Super Admin
function openAddSuperAdminModal() {
    document.getElementById('addSuperAdminModal').classList.remove('hidden');
}

function closeAddSuperAdminModal() {
    document.getElementById('addSuperAdminModal').classList.add('hidden');
}

// Export modal functions to window object for HTML onclick handlers
window.openAddSuperAdminModal = openAddSuperAdminModal;
window.closeAddSuperAdminModal = closeAddSuperAdminModal;

function openAddAdminModal() {
    const modal = document.getElementById('addAdminModal');
    if (modal) {
        modal.classList.remove('hidden');
        const emailInput = document.getElementById('adminEmail');
        if (emailInput) emailInput.focus();
    }
}

// Expose admin modal functions immediately to window for inline onclick handlers
window.openAddAdminModal = openAddAdminModal;
window.closeAddAdminModal = closeAddAdminModal;

function closeAddAdminModal() {
    const modal = document.getElementById('addAdminModal');
    if (modal) {
        modal.classList.add('hidden');
        const form = document.getElementById('addAdminForm');
        if (form) form.reset();
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatDate(date) {
    if (!date) return 'N/A';
    const dateObj = date?.toDate?.() ? date.toDate() : (date instanceof Date ? date : null);
    if (!dateObj) return 'N/A';
    return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Expose formatDate to other dynamically imported modules that rely on it
window.formatDate = formatDate;

async function assignRole(email, role) { return roleManager.assignRole(auth.currentUser, email, role); }

async function isUserAdmin(user) {
    if (!user?.emailVerified) return false;
    try { return [ROLES.OWNER, ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(await roleManager.getUserRole(user.uid)); }
    catch { return false; }
}

async function setupUI(user, isSuperAdmin) {
    try {
        // First setup sections and UI elements
        const userDisplay = document.getElementById('userDisplay');
        if (userDisplay) {
            userDisplay.textContent = user.email;
        }

        if (isSuperAdmin || user.email === 'hamza.datashare@gmail.com') {
            const superAdminLinks = document.getElementById('superAdminLinks');
            if (superAdminLinks) {
                superAdminLinks.classList.remove('hidden');
            }
            document.querySelectorAll('.admin-controls')?.forEach(el =>
                el.classList.remove('hidden')
            );
        }

        // Show initial section based on hash or default
        const hash = window.location.hash.slice(1) || 'messages';
        showSection(hash);

        // Load data after UI is ready
        await Promise.all([
            loadMessages(),
            loadAdmins(),
            window.loadUsers?.()
        ]);

        // Setup notifications last
        initNotifications();
        if(!document.getElementById('staffNotifications')) {
            const section=document.createElement('details');section.id='staffNotifications';section.className='staff-notifications';
            const summary=document.createElement('summary');summary.dataset.i18n='notifications.title';summary.textContent=t('notifications.title');section.append(summary);
            (document.querySelector('.admin-content > header')||document.querySelector('header'))?.append(section);
            mountNotificationSettings(section);
        }
    } catch (error) {
        console.error('Error setting up UI:', error);
    }
}

// ============================================================================
// EVENT LISTENERS & INITIALIZATION
// ============================================================================

// ---------------------------------------------------------------------------
// Utilities for owner to recreate role documents (useful for recovery)
// Exposed on window so owner can call from the browser console.
// Example: recreateModerators(['mod1@example.com','mod2@example.com'])
// Example: recreateSuperAdmin('new-super@example.com')
window.recreateModerators = async function (emails) {
    if (!auth.currentUser) throw new Error('You must be logged in as owner to run this');
    if (!Array.isArray(emails)) throw new Error('Please pass an array of emails');

    const results = { created: [], failed: [] };
    for (const rawEmail of emails) {
        const email = String(rawEmail).trim().toLowerCase();
        try {
            await roleManager.assignRole(auth.currentUser, email, ROLES.MODERATOR);
            results.created.push(email);
        } catch (err) {
            console.error('Failed to create moderator for', email, err);
            results.failed.push({ email, error: err.message || String(err) });
        }
    }
    console.log('recreateModerators result:', results);
    return results;
};

window.recreateSuperAdmin = async function (email) {
    if (!auth.currentUser) throw new Error('You must be logged in as owner to run this');
    if (!email) throw new Error('Please provide an email');
    const e = String(email).trim().toLowerCase();
    try {
        await roleManager.assignRole(auth.currentUser, e, ROLES.SUPER_ADMIN);
        console.log('Super admin created:', e);
        return { email: e, ok: true };
    } catch (err) {
        console.error('Failed to create super admin for', e, err);
        return { email: e, ok: false, error: err.message || String(err) };
    }
};

async function setupOwners() {
    try {
        if (!auth.currentUser) return;
        const email = String(auth.currentUser.email || '').toLowerCase();
        if (!email) return;

        if (OWNER_EMAILS.includes(email)) {
            // Reveal owner-only UI
            const ownerSection = document.getElementById('owner-section');
            if (ownerSection) ownerSection.classList.remove('hidden');

            // Attach any owner helper functions to window for convenience
            // (recreateModerators/recreateSuperAdmin are already exposed)
            console.log('Owner detected, owner UI enabled for', email);
        }
    } catch (err) {
        console.error('Error in setupOwners:', err);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM Content Loaded - Setting up form handlers');

    // Dynamically load UI helpers to avoid circular import timing issues
    try {
        const ui = await import('./ui-handlers.clean.js');
        ui.setupFormHandlers?.();
        ui.setupNavigationHandlers?.();
        // expose showSection and loadUsers from ui module if needed
        if (ui.showSection) window.showSection = ui.showSection;
        if (ui.loadUsers) window.loadUsers = ui.loadUsers;
        // expose message helper functions so inline onclick handlers can call them
        if (typeof markMessageRead === 'function') window.markMessageRead = markMessageRead;
        if (typeof adminReplyPrompt === 'function') window.adminReplyPrompt = adminReplyPrompt;
        if (typeof updateMessageMetadata === 'function') window.updateMessageMetadata = updateMessageMetadata;
        if (typeof deleteMessage === 'function') window.deleteMessage = deleteMessage;
        if (typeof replyToEmail === 'function') window.replyToEmail = replyToEmail;
    } catch (err) {
        console.warn('Could not load ui-handlers.clean.js dynamically:', err);
    }

    await setupOwners();

    // If auth user is present, determine super-admin status and reveal links immediately
    try {
        if (auth.currentUser && auth.currentUser.email) {
            const email = String(auth.currentUser.email).toLowerCase();
            const adminRef = doc(db, 'admins', email);
            const adminDoc = await getDoc(adminRef);
            const isSuperAdmin = (adminDoc.exists() && adminDoc.data().isSuperAdmin) || (email === 'hamza.datashare@gmail.com');
            if (isSuperAdmin) {
                const superAdminLinks = document.getElementById('superAdminLinks');
                if (superAdminLinks) superAdminLinks.classList.remove('hidden');
            }
        }
    } catch (err) {
        console.error('Error checking super admin status:', err);
    }

    // UI helpers own moderator/super-admin forms; avoid duplicate submissions.
    document.getElementById('addAdminForm')?.addEventListener('submit', async event => {
        event.preventDefault();
        try {
            const email = document.getElementById('adminEmail').value.trim();
            const role = document.getElementById('isSuperAdmin')?.checked ? ROLES.SUPER_ADMIN : ROLES.ADMIN;
            await roleManager.assignRole(auth.currentUser, email, role);
            closeAddAdminModal(); await loadAdmins(); alert(t('msg.success'));
        } catch { alert(t('msg.error')); }
    });
    document.getElementById('addModeratorModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'addModeratorModal') closeAddModeratorModal();
    });

    document.getElementById('addSuperAdminModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'addSuperAdminModal') closeAddSuperAdminModal();
    });

    document.getElementById('addAdminModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'addAdminModal') closeAddAdminModal();
    });

    document.getElementById('addProductModal')?.addEventListener('modalclose', closeAddProductModal);

    // Navigation handlers are managed by ui-handlers.clean.js (dynamically loaded above).
    window.setupNavigationHandlers?.();
});
// ============================================================================
// EXPORT FUNCTIONS TO WINDOW OBJECT (IMMEDIATE)
// ============================================================================

// Export functions in a way that ensures they're available immediately
const exportedFunctions = {
    openAddModeratorModal,
    closeAddModeratorModal,
    openAddSuperAdminModal,
    closeAddSuperAdminModal,
    openAddAdminModal,
    closeAddAdminModal,
    removeModerator,
    removeAdmin,
    removeSuperAdmin,
    toggleAdminRole,
    promoteModerator,
    demoteFromSuperAdmin,
    deleteMessage,
    replyToEmail,
    changeUserRole,
    deleteUser,
    // Expose data loaders for ui-handlers to call
    loadModerators,
    loadAdmins,
    loadSuperAdmins,
    loadMessages,
    // Product management functions
    openAddProductModal,
    closeAddProductModal,
    closeProductDetailsModal,
    openEditProductModal,
    closeEditProductModal,
    addProduct,
    updateProduct,
    loadControlPanelProducts,
    deleteProduct,
    editProduct,
    showProductDetails,
    clearImagePreview,
    // alias for compatibility
    loadModeratorList: loadModerators
};

// Assign to window immediately and log for verification
Object.assign(window, exportedFunctions);
// Expose setupUI and setupOwners so external auth listeners can call them
window.setupUI = setupUI;
window.setupOwners = setupOwners;

// Allow setting a user's role to a specific rank (used by the UI role picker)
async function setUserRole(userId, userEmail, role) {
    try {
        if (!auth.currentUser) throw new Error('You must be signed in to perform this action');
        if (!userEmail) throw new Error('User email is required to set role');

        // Protect owners from being changed client-side
        const normalized = String(userEmail).toLowerCase();
        if (OWNER_EMAILS.includes(normalized)) throw new Error('Owner accounts cannot be modified');

        await roleManager.assignRole(auth.currentUser, normalized, role);

        // Refresh relevant lists
        await Promise.all([window.loadUsers?.(), window.loadAdmins?.(), window.loadModerators?.(), window.loadSuperAdmins?.()]);

        alert(`Role updated to ${role} for ${userEmail}`);
        return true;
    } catch (err) {
        console.error('Error setting user role:', err);
        alert(err.message || 'Failed to set role');
        throw err;
    }
}

window.setUserRole = setUserRole;

// Listen for auth state changes and initialize the UI when a user signs in.
onAuthStateChanged(auth, async (user) => {
    try {
        if (!user) {
            // Clear UI state for signed-out users
            const userDisplayEl = document.getElementById('userDisplay');
            if (userDisplayEl) userDisplayEl.textContent = '';
            location.replace(pageURL('index.html'));
            return;
        }

        if (!user.emailVerified) {
            if (user.email) await rejectUnverifiedSession(user);
            location.replace(pageURL('index.html')); return;
        }

        const email = String(user.email || '').toLowerCase();

        // Restrict access: only staff (owner/admin/superadmin/moderator) may use control panel.
        try {
            const rank = await roleManager.getUserRole(user.uid);
            const isOwner = rank === ROLES.OWNER;
            if (!isOwner && ![ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MODERATOR].includes(rank)) {
                alert('Access denied: Control Panel is for staff only.');
                location.replace(pageURL('home.html'));
                return;
            }
            initTeamManagement(rank);
            mountCatalogueImport(rank);
        } catch (err) {
            console.warn('Role check failed, denying access as a safety measure:', err);
            alert('Access denied: could not verify permissions.');
            const baseUrl = window.location.pathname.startsWith('/AG-Home/') ? '/AG-Home' : '';
            try { window.location.href = baseUrl + '/'; } catch (e) { /* ignore */ }
            return;
        }

        // Determine super-admin status from admins collection or owner emails
        let isSuperAdmin = false;
        try {
            const adminRef = doc(db, 'admins', email);
            const adminDoc = await getDoc(adminRef);
            isSuperAdmin = (adminDoc.exists() && adminDoc.data().isSuperAdmin) || OWNER_EMAILS.includes(email) || (email === 'hamza.datashare@gmail.com');
        } catch (err) {
            console.warn('Could not determine admin status on auth change:', err);
        }

        // Reveal super-admin links if applicable
        if (isSuperAdmin) {
            document.getElementById('superAdminLinks')?.classList.remove('hidden');
        }

        // Call setupUI to finish initializing the control panel UI
        document.documentElement.classList.remove('auth-pending');
        try {
            await setupUI(user, isSuperAdmin);
        } catch (err) {
            console.error('Error running setupUI on auth change:', err);
        }
    } catch (e) {
        console.error('Unexpected error in auth listener:', e);
    }
});

// ============================================================================
// PRODUCT MANAGEMENT FUNCTIONS
// ============================================================================

function mountCatalogueImport(rank) {
    if (![ROLES.OWNER, ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(rank) || document.getElementById('initializeCatalogue')) return;
    const section = document.querySelector('.products-management-container');
    const notice = document.createElement('div'); notice.className = 'catalogue-import';
    const hint = document.createElement('p'); hint.dataset.i18n = 'catalogue.initialWarning'; hint.textContent = t('catalogue.initialWarning');
    const button = document.createElement('button'); button.id = 'initializeCatalogue'; button.type = 'button'; button.className = 'secondary-btn'; button.dataset.i18n = 'catalogue.initialize'; button.textContent = t('catalogue.initialize');
    button.onclick = () => busy(button, async () => {
        try { await initializeCatalogue(); toast(t('catalogue.initialized')); notice.hidden = true; await loadControlPanelProducts(); }
        catch (error) { toast(t(error.message?.startsWith('catalogue.') ? error.message : 'catalogue.initializeError'), 'error'); }
    });
    notice.append(hint, button); section.querySelector('.products-header').after(notice);
    getDoc(doc(db, 'catalogue', 'main')).then(snapshot => { notice.hidden = snapshot.data()?.initialized === true; }).catch(() => {});
}

let uploadedImageUrl = null;

// Open/Close Product Modal
function openAddProductModal() {
    document.getElementById('addProductModal').classList.remove('hidden');
    document.getElementById('addProductForm').reset();
    fillPlatformEditor(document.getElementById('addProductForm'), {});
    fillProductRelationships(document.getElementById('addProductForm'), {});
    uploadedImageUrl = null;
    clearImagePreview();
}

function closeAddProductModal() {
    document.getElementById('addProductModal').classList.add('hidden');
    document.getElementById('addProductForm').reset();
    uploadedImageUrl = null;
    clearImagePreview();
}

function closeProductDetailsModal() {
    console.log('Closing product details modal');
    const modal = document.getElementById('productDetailsModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.setProperty('display', 'none', 'important');
    }
}

// Open Edit Product Modal
function openEditProductModal() {
    closeProductDetailsModal();

    const product = window.currentProduct;
    const productId = window.currentProductId;

    if (!product || !productId) {
        alert('Error: Product data not found');
        return;
    }
    const form = document.getElementById('editProductForm');
    form.reset();
    clearImagePreview();
    fillPlatformEditor(form, product);
    fillProductRelationships(form, product);
    document.getElementById('editProductVersion').value = product.version || '';
    document.getElementById('editProductStatus').value = product.status || '';

    // Populate translation fields
    document.getElementById('editProductNameEn').value = product.name_en || product.name || '';
    document.getElementById('editProductNameUr').value = product.name_ur || '';
    document.getElementById('editProductCategoryEn').value = product.category_en || product.category || '';
    document.getElementById('editProductCategoryUr').value = product.category_ur || '';
    document.getElementById('editProductDescriptionEn').value = product.description_en || product.description || '';
    document.getElementById('editProductDescriptionUr').value = product.description_ur || '';

    // Populate other form fields
    document.getElementById('editProductPrice').value = product.price ?? '';
    document.getElementById('editProductSubCategory').value = product.subCategory || '';
    document.getElementById('editProductSKU').value = product.sku || '';
    document.getElementById('editProductBrand').value = product.brand || '';
    document.getElementById('editProductRating').value = product.rating || '';
    document.getElementById('editProductLink').value = product.productLink || '';
    document.getElementById('editDownloadLink').value = product.downloadLink || '';
    document.getElementById('editDownloadLabel').value = product.downloadLabel || '';

    // Handle tags
    if (product.tags && Array.isArray(product.tags)) {
        document.getElementById('editProductTags').value = product.tags.join(', ');
    }

    // Handle specifications
    if (product.specifications && typeof product.specifications === 'object') {
        document.getElementById('editProductSpecs').value = JSON.stringify(product.specifications, null, 2);
    }

    // Handle stock (select or custom)
    const stockSelect = document.getElementById('editProductStock');
    if (product.stock === -1) {
        stockSelect.value = '-1';
        document.getElementById('editProductStockCustom').style.display = 'none';
    } else if ([0, 1, 5, 10, 25, 50, 100].includes(product.stock)) {
        stockSelect.value = String(product.stock);
        document.getElementById('editProductStockCustom').style.display = 'none';
    } else {
        stockSelect.value = 'custom';
        document.getElementById('editProductStockCustom').value = product.stock || '';
        document.getElementById('editProductStockCustom').style.display = 'block';
    }

    // Handle image (URL vs File)
    if (product.image && product.image.startsWith('data:')) {
        // Binary data, can't easily show in file input
        document.querySelector('input[name="editImageType"][value="url"]').checked = true;
        document.getElementById('editProductImageUrl').value = '';
        document.getElementById('editImageUrlGroup').style.display = 'block';
        document.getElementById('editImageFileGroup').style.display = 'none';
    } else {
        document.querySelector('input[name="editImageType"][value="url"]').checked = true;
        document.getElementById('editProductImageUrl').value = product.image || '';
        document.getElementById('editImageUrlGroup').style.display = 'block';
        document.getElementById('editImageFileGroup').style.display = 'none';
    }

    // Show preview of current image
    if (product.image) {
        const preview = document.getElementById('editImagePreview');
        const previewImg = document.getElementById('editPreviewImage');
        previewImg.src = product.image;
        preview.classList.remove('hidden');
    }

    // Show edit modal
    const modal = document.getElementById('editProductModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.setProperty('display', 'flex', 'important');
    }
}

// Close Edit Product Modal
function closeEditProductModal() {
    const modal = document.getElementById('editProductModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.setProperty('display', 'none', 'important');
    }
}

// Handle Image Type Toggle for Edit Form
document.addEventListener('DOMContentLoaded', () => {
    const editImageTypeRadios = document.querySelectorAll('input[name="editImageType"]');
    editImageTypeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const imageUrlInput = document.getElementById('editProductImageUrl');
            const imageFileInput = document.getElementById('editProductImageFile');
            const imageUrlGroup = document.getElementById('editImageUrlGroup');
            const imageFileGroup = document.getElementById('editImageFileGroup');

            if (e.target.value === 'url') {
                imageUrlGroup.style.display = 'block';
                imageFileGroup.style.display = 'none';
                imageFileInput.value = '';
            } else {
                imageUrlGroup.style.display = 'none';
                imageFileGroup.style.display = 'block';
                imageUrlInput.value = '';
            }
        });
    });

    // Stock select change handler for edit form
    const editStockSelect = document.getElementById('editProductStock');
    if (editStockSelect) {
        editStockSelect.addEventListener('change', (e) => {
            const customInput = document.getElementById('editProductStockCustom');
            if (e.target.value === 'custom') {
                customInput.style.display = 'block';
                customInput.focus();
            } else {
                customInput.style.display = 'none';
            }
        });
    }

    // Edit image file change handler
    const editImageFileInput = document.getElementById('editProductImageFile');
    if (editImageFileInput) {
        editImageFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Check file size (500KB max)
                if (file.size > 500 * 1024) {
                    alert('Image size exceeds 500KB limit');
                    e.target.value = '';
                    return;
                }

                // Preview image
                const reader = new FileReader();
                reader.onload = (event) => {
                    const preview = document.getElementById('editImagePreview');
                    const previewImg = document.getElementById('editPreviewImage');
                    previewImg.src = event.target.result;
                    preview.classList.remove('hidden');
                    uploadedImageUrl = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Stock select change handler for add form
    const addFormStockSelect = document.getElementById('productStock');
    if (addFormStockSelect) {
        addFormStockSelect.addEventListener('change', (e) => {
            const customInput = document.getElementById('productStockCustom');
            if (e.target.value === 'custom') {
                customInput.style.display = 'block';
                customInput.focus();
            } else {
                customInput.style.display = 'none';
            }
        });
    }

    // Edit form submission
    const editForm = document.getElementById('editProductForm');
    if (editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await busy(e.submitter, updateProduct);
        });
    }

    // Add product form handling
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await busy(e.submitter, addProduct);
        });
    }

    // Image type toggle for add form
    const imageTypeRadios = document.querySelectorAll('input[name="imageType"]');
    imageTypeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const imageUrlInput = document.getElementById('productImageUrl');
            const imageFileInput = document.getElementById('productImageFile');

            if (e.target.value === 'url') {
                imageUrlInput.disabled = false;
                imageFileInput.disabled = true;
                imageFileInput.value = '';
            } else {
                imageUrlInput.disabled = true;
                imageUrlInput.value = '';
                imageFileInput.disabled = false;
            }
        });
    });

    // Image file change handler
    const imageFileInput = document.getElementById('productImageFile');
    if (imageFileInput) {
        imageFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Check file size (500KB max)
                if (file.size > 500 * 1024) {
                    alert('Image size exceeds 500KB limit');
                    e.target.value = '';
                    return;
                }

                // Preview image
                const reader = new FileReader();
                reader.onload = (event) => {
                    const preview = document.getElementById('imagePreview');
                    const previewImg = document.getElementById('previewImg');
                    previewImg.src = event.target.result;
                    preview.classList.remove('hidden');
                    uploadedImageUrl = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

// Clear Image Preview
function clearImagePreview() {
    // Clear add form image preview
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const productImageFile = document.getElementById('productImageFile');

    if (imagePreview) imagePreview.classList.add('hidden');
    if (previewImg) previewImg.src = '';
    if (productImageFile) productImageFile.value = '';

    // Clear edit form image preview
    const editImagePreview = document.getElementById('editImagePreview');
    const editPreviewImg = document.getElementById('editPreviewImage');
    const editProductImageFile = document.getElementById('editProductImageFile');

    if (editImagePreview) editImagePreview.classList.add('hidden');
    if (editPreviewImg) editPreviewImg.src = '';
    if (editProductImageFile) editProductImageFile.value = '';

    uploadedImageUrl = null;
}

// Add Product to Firestore
async function addProduct() {
    try {
        const compatibility = readPlatformEditor(document.getElementById('addProductForm'));
        if (!compatibility) return;
        // Translation fields
        const name_en = document.getElementById('productNameEn').value;
        const name_ur = document.getElementById('productNameUr').value;
        const category_en = document.getElementById('productCategoryEn').value;
        const category_ur = document.getElementById('productCategoryUr').value;
        const description_en = document.getElementById('productDescriptionEn').value;
        const description_ur = document.getElementById('productDescriptionUr').value;

        // Use English name as default fallback
        const name = name_en || name_ur;
        const category = category_en || category_ur;
        const priceInput = document.getElementById('productPrice').value.trim();
        const price = priceInput === '' ? null : Number(priceInput);
        if (price === null) Object.assign(compatibility, normalizeProduct({ ...compatibility, schemaVersion: 3 }));
        const relationships = readProductRelationships(document.getElementById('addProductForm'));
        const subCategory = document.getElementById('productSubCategory').value;
        const tagsInput = document.getElementById('productTags').value;
        const sku = document.getElementById('productSKU').value;
        const brand = document.getElementById('productBrand').value;

        // Handle stock - can be unlimited (-1) or a number
        let stock = 0;
        const stockSelect = document.getElementById('productStock');
        if (stockSelect.value === 'custom') {
            stock = parseInt(document.getElementById('productStockCustom').value) || 0;
        } else {
            stock = parseInt(stockSelect.value) || 0;
        }

        const rating = parseFloat(document.getElementById('productRating').value) || 0;
        const specsInput = document.getElementById('productSpecs').value;
        const productLink = document.getElementById('productLink').value;
        const downloadLink = document.getElementById('productDownloadLink').value;
        const downloadLabel = document.getElementById('productDownloadLabel').value || 'Download';

        // Determine image
        let image = null;
        const imageType = document.querySelector('input[name="imageType"]:checked').value;

        if (imageType === 'url') {
            image = document.getElementById('productImageUrl').value;
        } else if (uploadedImageUrl) {
            image = uploadedImageUrl;
        }

        // Parse tags
        if (image && !safeURL(image, { image: true })) { alert(t('validation.url')); return; }
        if ((price !== null && (!Number.isFinite(price) || price < 0)) || stock < -1 || rating < 0 || rating > 5) { alert(t('validation.required')); return; }
        const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];

        // Parse specifications
        let specs = {};
        if (specsInput) {
            try {
                specs = JSON.parse(specsInput); if (!specs || Array.isArray(specs) || typeof specs !== 'object') throw new Error('Invalid specifications');
            } catch (err) {
                alert('Invalid JSON in specifications field');
                return;
            }
        }

        // Create product object with translation fields
        const product = {
            // Fallback fields for compatibility
            name,
            category,
            description: description_en || description_ur || '',
            description_en: description_en || null,
            description_ur: description_ur || null,
            // Translation-specific fields (Strategy 1: Language-specific field names)
            name_en: name_en || null,
            name_ur: name_ur || null,
            category_en: category_en || null,
            category_ur: category_ur || null,
            // Other fields
            price,
            subCategory: subCategory || null,
            tags,
            image: image || null,
            sku: sku || null,
            brand: brand || null,
            stock,
            rating,
            specifications: specs,
            productLink: productLink || null,
            downloadLink: downloadLink || null,
            downloadLabel: downloadLabel || 'Download',
            ...compatibility,
            ...relationships,
            version: document.getElementById('productVersion').value.trim(),
            status: document.getElementById('productStatus').value,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: auth.currentUser?.email || 'unknown'
        };

        // Add to Firestore
        const productsCollection = collection(db, 'products');
        const docRef = await addDoc(productsCollection, product);

        console.log('Product added successfully with translations:', docRef.id);
        alert('✅ Product added successfully with translations!');

        // Close modal and reload products
        closeAddProductModal();
        loadControlPanelProducts();

    } catch (error) {
        console.error('Error adding product:', error);
        alert(`❌ Error adding product: ${error.message}`);
    }
}

// Update Product
async function updateProduct() {
    try {
        const compatibility = readPlatformEditor(document.getElementById('editProductForm'));
        if (!compatibility) return;
        const productId = window.currentProductId;
        if (!productId) {
            alert('Error: Product ID not found');
            return;
        }

        // Translation fields
        const name_en = document.getElementById('editProductNameEn').value;
        const name_ur = document.getElementById('editProductNameUr').value;
        const category_en = document.getElementById('editProductCategoryEn').value;
        const category_ur = document.getElementById('editProductCategoryUr').value;
        const description_en = document.getElementById('editProductDescriptionEn').value;
        const description_ur = document.getElementById('editProductDescriptionUr').value;

        // Use English name as default fallback
        const name = name_en || name_ur;
        const category = category_en || category_ur;
        const priceInput = document.getElementById('editProductPrice').value.trim();
        const price = priceInput === '' ? null : Number(priceInput);
        if (price === null) Object.assign(compatibility, normalizeProduct({ ...compatibility, schemaVersion: 3 }));
        const relationships = readProductRelationships(document.getElementById('editProductForm'));
        const description = description_en || description_ur;
        const subCategory = document.getElementById('editProductSubCategory').value;
        const tagsInput = document.getElementById('editProductTags').value;
        const sku = document.getElementById('editProductSKU').value;
        const brand = document.getElementById('editProductBrand').value;
        const rating = parseFloat(document.getElementById('editProductRating').value) || 0;
        const specsInput = document.getElementById('editProductSpecs').value;
        const productLink = document.getElementById('editProductLink').value;
        const downloadLink = document.getElementById('editDownloadLink').value;
        const downloadLabel = document.getElementById('editDownloadLabel').value || 'Download';

        // Handle stock - can be unlimited (-1) or a number
        let stock = 0;
        const stockSelect = document.getElementById('editProductStock');
        if (stockSelect.value === 'custom') {
            stock = parseInt(document.getElementById('editProductStockCustom').value) || 0;
        } else {
            stock = parseInt(stockSelect.value) || 0;
        }

        // Determine image
        let image = window.currentProduct.image;
        const imageType = document.querySelector('input[name="editImageType"]:checked').value;

        if (imageType === 'url') {
            const imageUrl = document.getElementById('editProductImageUrl').value;
            if (imageUrl) {
                image = imageUrl;
            }
        } else if (uploadedImageUrl) {
            image = uploadedImageUrl;
        }

        // Parse tags
        if (image && !safeURL(image, { image: true })) { alert(t('validation.url')); return; }
        if ((price !== null && (!Number.isFinite(price) || price < 0)) || stock < -1 || rating < 0 || rating > 5) { alert(t('validation.required')); return; }
        const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];

        // Parse specifications
        let specs = {};
        if (specsInput) {
            try {
                specs = JSON.parse(specsInput); if (!specs || Array.isArray(specs) || typeof specs !== 'object') throw new Error('Invalid specifications');
            } catch (err) {
                alert('Invalid JSON in specifications field');
                return;
            }
        }

        // Create updated product object with translation fields
        const updatedProduct = {
            // Fallback fields for compatibility
            name,
            category,
            description: description || null,
            // Translation-specific fields (Strategy 1: Language-specific field names)
            name_en: name_en || null,
            name_ur: name_ur || null,
            category_en: category_en || null,
            category_ur: category_ur || null,
            description_en: description_en || null,
            description_ur: description_ur || null,
            // Other fields
            price,
            subCategory: subCategory || null,
            tags,
            image: image || null,
            sku: sku || null,
            brand: brand || null,
            stock,
            rating,
            specifications: specs,
            productLink: productLink || null,
            downloadLink: downloadLink || null,
            downloadLabel: downloadLabel || 'Download',
            ...compatibility,
            ...relationships,
            ...(window.currentProduct.catalogueKey ? { catalogueKey: window.currentProduct.catalogueKey, slug: window.currentProduct.slug } : {}),
            version: document.getElementById('editProductVersion').value.trim(),
            status: document.getElementById('editProductStatus').value,
            updatedAt: new Date(),
            updatedBy: auth.currentUser?.email || 'unknown'
        };

        // Update in Firestore
        const productDocRef = doc(db, 'products', productId);
        await updateDoc(productDocRef, updatedProduct);

        console.log('Product updated successfully with translations:', productId);
        alert('✅ Product updated successfully with translations!');

        // Close modal and reload products
        closeEditProductModal();
        loadControlPanelProducts();

    } catch (error) {
        console.error('Error updating product:', error);
        alert(`❌ Error updating product: ${error.message}`);
    }
}

// Load Products for Control Panel
async function loadControlPanelProducts() {
    const productsList = document.getElementById('productsList');
    if (!productsList) return;

    try {
        productsList.innerHTML = '<div class="loading">Loading products...</div>';

        const q = query(collection(db, 'products'));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            productsList.innerHTML = '<p class="no-products">No products yet. Add one to get started!</p>';
            return;
        }

        productsList.innerHTML = '';

        snapshot.forEach(doc => {
            const product = doc.data();
            const createdDate = product.createdAt?.toDate?.() || new Date();
            const dateStr = new Date(createdDate).toLocaleDateString();

            const productCard = document.createElement('div');
            productCard.className = 'product-control-card';
            productCard.style.cursor = 'pointer';

            // Set onclick handler with error handling
            productCard.tabIndex = 0;
            productCard.onkeydown = e => { if (e.key === "Enter") showProductDetails(doc.id, product); };
            productCard.onclick = function(e) {
                console.log('Product card clicked:', doc.id, product);
                if (e.target.closest('.product-card-actions')) {
                    console.log('Click was on action buttons, ignoring');
                    return;
                }
                showProductDetails(doc.id, product);
            };

            productCard.innerHTML = `
                <div class="product-card-image">
                    ${product.image ? `<img src="${escapeHtml(safeURL(product.image, { image: true }))}" alt="${escapeHtml(product.name)}">` : '<div class="no-image">No Image</div>'}
                </div>
                <div class="product-card-info">
                    <h3>${escapeHtml(product.name)}</h3>
                    <p class="product-card-price">${formatPrice(product.price || 0)}</p>
                    <p class="product-card-category">
                        <strong>Category:</strong> ${escapeHtml(product.category)}
                        ${product.subCategory ? ` > ${escapeHtml(product.subCategory)}` : ''}
                    </p>
                    <p class="product-card-description">${escapeHtml(product.description || product.description_en || product.description_ur || '')}</p>
                    <div class="product-card-meta">
                        <span><strong>SKU:</strong> ${escapeHtml(product.sku || '—')}</span>
                        <span><strong>Brand:</strong> ${escapeHtml(product.brand || '—')}</span>
                        <span><strong data-i18n="details.stock">${t('details.stock')}</strong>: ${product.stock === -1 ? `<span data-i18n="details.stockUnlimited">${t('details.stockUnlimited')}</span>` : escapeHtml(product.stock || 0)}</span>
                        <span><strong>Rating:</strong> ${escapeHtml(product.rating ? product.rating + '/5' : '—')}</span>
                    </div>
                    ${product.tags && product.tags.length > 0 ? `
                        <div class="product-card-tags">
                            ${product.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                        </div>
                    ` : ''}
                    <p class="product-card-date"><span data-i18n="admin.added">${t('admin.added')}</span>: ${dateStr} <span data-i18n="admin.by">${t('admin.by')}</span> ${escapeHtml(product.createdBy || '—')}</p>
                </div>
                <div class="product-card-actions" onclick="event.stopPropagation();">
                    <button onclick="editProduct(${inlineArg(doc.id)})" class="edit-btn" title="Edit Product">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
                            <path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                    </button>
                    <button onclick="deleteProduct(${inlineArg(doc.id)}, '')" class="delete-btn" title="Delete Product">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-9l-1 1H5v2h14V4z" />
                        </svg>
                    </button>
                </div>
            `;
            productsList.appendChild(productCard);
        });

    } catch (error) {
        console.error('Error loading products:', error);
        productsList.innerHTML = '<p class="error">Error loading products</p>';
    }
}

// Show Product Details Modal
function showProductDetails(productId, product) {
    try {
        console.log('showProductDetails called with:', productId, product);

        const modal = document.getElementById('productDetailsModal');
        if (!modal) {
            console.error('Modal element #productDetailsModal not found!');
            alert('Error: Product details modal not found. Please refresh the page.');
            return;
        }

        console.log('Modal found, populating details...');

        // Helper function to safely set text content
        const setTextContent = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
            else console.warn(`Element #${id} not found`);
        };

        // Helper function to safely set value
        const setElementContent = (id, value, type = 'text') => {
            const el = document.getElementById(id);
            if (!el) {
                console.warn(`Element #${id} not found`);
                return;
            }
            if (type === 'text') {
                el.textContent = value;
            } else if (type === 'html') {
                el.innerHTML = value;
            }
        };

        // Store current product ID for editing
        window.currentProductId = productId;
        window.currentProduct = product;

        // Set basic info
        setTextContent('detailsProductName', product.name || 'Unknown Product');
        setTextContent('detailsName', product.name || '');

        const priceValue = product.price ? parseFloat(product.price) : 0;
        console.log('control.js - Product price:', product.price, 'Parsed as:', priceValue);
        const formattedPriceCtrl = formatPrice(priceValue);
        console.log('control.js - Formatted price:', formattedPriceCtrl);
        setTextContent('detailsPrice', formattedPriceCtrl);
        console.log('control.js - Price element content:', document.getElementById('detailsPrice')?.textContent);
        setTextContent('detailsCategory', product.category || 'N/A');

        // Set product image
        const imgElement = document.getElementById('detailsProductImage');
        if (imgElement) {
            if (product.image) {
                imgElement.src = product.image;
                imgElement.style.display = 'block';
            } else {
                imgElement.style.display = 'none';
            }
        }

        // Set optional fields with conditional display
        const setOptionalField = (id, rowId, value) => {
            const el = document.getElementById(id);
            const row = document.getElementById(rowId);
            if (el && row) {
                if (value) {
                    el.textContent = value;
                    row.style.display = 'flex';
                } else {
                    row.style.display = 'none';
                }
            }
        };

        setOptionalField('detailsSubCategory', 'subCategoryRow', product.subCategory);
        setOptionalField('detailsBrand', 'brandRow', product.brand);
        setOptionalField('detailsSKU', 'skuRow', product.sku);

        const stockRow = document.getElementById('stockRow');
        const stockEl = document.getElementById('detailsStock');
        let stockValue = null;
        if (product.stock !== undefined && product.stock !== null) {
            stockValue = parseInt(product.stock, 10); // Explicitly use base 10 for parseInt
        }
        console.log('control.js - Stock value:', product.stock, 'Parsed as:', stockValue, 'Type:', typeof stockValue);
        console.log('control.js - stockValue === -1?', stockValue === -1);

        if (stockValue === -1) {
            // Unlimited stock
            console.log('control.js - Setting stock to Unlimited');
            if (stockEl) {
                stockEl.textContent = 'Unlimited';
                console.log('control.js - Stock element:', stockEl.textContent);
            }
            if (stockRow) stockRow.style.display = 'flex';
        } else if (stockValue !== null && stockValue >= 0) {
            // Specific stock amount
            console.log('control.js - Setting stock to', stockValue, 'units');
            if (stockEl) {
                stockEl.textContent = `${stockValue} units`;
                console.log('control.js - Stock element:', stockEl.textContent);
            }
            if (stockRow) stockRow.style.display = 'flex';
        } else {
            // No stock info
            console.log('control.js - Hiding stock row (no valid value)');
            if (stockRow) stockRow.style.display = 'none';
        }

        setOptionalField('detailsRating', 'ratingRow', product.rating ? `${product.rating}/5 ⭐` : null);

        const descRow = document.getElementById('descriptionRow');
        const descEl = document.getElementById('detailsDescription');
        if (product.description) {
            if (descEl) descEl.textContent = product.description;
            if (descRow) descRow.style.display = 'flex';
        } else if (descRow) {
            descRow.style.display = 'none';
        }

        // Set tags
        const tagsRow = document.getElementById('tagsRow');
        const tagsContainer = document.getElementById('detailsTags');
        if (product.tags && product.tags.length > 0 && tagsContainer && tagsRow) {
            tagsContainer.innerHTML = product.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('');
            tagsRow.style.display = 'flex';
        } else if (tagsRow) {
            tagsRow.style.display = 'none';
        }

        // Set specifications
        const specsRow = document.getElementById('specsRow');
        const specsContainer = document.getElementById('detailsSpecs');
        if (product.specifications && Object.keys(product.specifications).length > 0 && specsContainer && specsRow) {
            const specsHTML = Object.entries(product.specifications)
                .map(([key, value]) => `<div class="spec-item"><strong>${escapeHtml(key)}:</strong> ${escapeHtml(String(value))}</div>`)
                .join('');
            specsContainer.innerHTML = specsHTML;
            specsRow.style.display = 'flex';
        } else if (specsRow) {
            specsRow.style.display = 'none';
        }

        // Set product link button
        const productLinkBtn = document.getElementById('productLinkBtn');
        if (productLinkBtn) {
            if (product.productLink) {
                productLinkBtn.href = product.productLink;
                productLinkBtn.style.display = 'inline-block';
            } else {
                productLinkBtn.style.display = 'none';
            }
        }

        // Set download link button
        const downloadLinkBtn = document.getElementById('downloadLinkBtn');
        const downloadBtnLabel = document.getElementById('downloadBtnLabel');
        if (downloadLinkBtn) {
            if (product.downloadLink) {
                downloadLinkBtn.href = product.downloadLink;
                downloadLinkBtn.download = true;
                if (downloadBtnLabel) {
                    downloadBtnLabel.textContent = `📥 ${product.downloadLabel || 'Download'}`;
                }
                downloadLinkBtn.style.display = 'inline-block';
            } else {
                downloadLinkBtn.style.display = 'none';
            }
        }

        // Show modal
        console.log('Removing hidden class from modal');
        modal.classList.remove('hidden');
        modal.style.setProperty('display', 'flex', 'important');
        console.log('Modal should now be visible. Classes:', modal.className, 'Display:', modal.style.display);
    } catch (error) {
        console.error('Error in showProductDetails:', error);
        alert('Error displaying product details: ' + error.message);
    }
}

// Delete Product
async function deleteProduct(productId, productName) {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) {
        return;
    }

    try {
        await deleteDoc(doc(db, 'products', productId));
        console.log('Product deleted successfully');
        alert('✅ Product deleted successfully!');
        loadControlPanelProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
        alert(`❌ Error deleting product: ${error.message}`);
    }
}

// ============================================================================
// PRODUCT REPORTS FUNCTIONS
// ============================================================================

let allReports = [];

// Load all reports from Firestore
async function loadReports() {
    const reportsList = document.getElementById('reportsList');
    if (!reportsList) {
        console.log('Reports list element not found');
        return;
    }

    try {
        console.log('Loading reports...');
        reportsList.innerHTML = '<div class="loading">Loading reports...</div>';

        // Fetch all reports - simple query without orderBy for Firebase emulator compatibility
        const q = query(collection(db, 'reports'));

        const snapshot = await getDocs(q);
        console.log('Reports snapshot received. Document count:', snapshot.size);
        console.log('Snapshot empty?', snapshot.empty);

        allReports = [];
        snapshot.forEach(docSnap => {
            const report = docSnap.data();
            console.log('Processing report document:', docSnap.id);
            console.log('Report data structure:', Object.keys(report));
            console.log('Full report data:', JSON.stringify(report, null, 2));

            let reportTimestamp = new Date();
            if (report.timestamp) {
                if (typeof report.timestamp?.toDate === 'function') {
                    reportTimestamp = report.timestamp.toDate();
                } else if (typeof report.timestamp === 'number') {
                    reportTimestamp = new Date(report.timestamp);
                } else if (report.timestamp instanceof Date) {
                    reportTimestamp = report.timestamp;
                }
            }

            const reportObj = {
                id: docSnap.id,
                ...report,
                timestamp: reportTimestamp
            };

            console.log('Adding report to allReports:', reportObj);
            allReports.push(reportObj);
        });

        console.log('Total reports loaded:', allReports.length);
        console.log('allReports array:', allReports);

        // Sort by timestamp descending (in case orderBy didn't work)
        allReports.sort((a, b) => {
            const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : 0;
            const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : 0;
            return timeB - timeA;
        });

        displayReports(allReports);
    } catch (error) {
        console.error('Error loading reports:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Full error:', error);
        reportsList.innerHTML = '<p class="error">Error loading reports: ' + error.message + '</p>';
    }
}

// Display reports in the list
function displayReports(reports) {
    const reportsList = document.getElementById('reportsList');
    if (!reportsList) {
        console.log('reportsList element not found in displayReports');
        return;
    }

    console.log('displayReports called with', reports.length, 'reports');
    reportsList.innerHTML = '';

    if (!reports || reports.length === 0) {
        console.log('No reports to display');
        reportsList.innerHTML = '<p class="no-reports">No reports found</p>';
        return;
    }

    reports.forEach(report => {
        console.log('Rendering report:', report.id, report);

        let dateStr = 'Unknown date';
        try {
            let timestamp = report.timestamp;
            if (!timestamp) {
                dateStr = 'No date';
            } else if (timestamp instanceof Date) {
                dateStr = timestamp.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            } else if (typeof timestamp === 'number') {
                dateStr = new Date(timestamp).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            } else {
                dateStr = String(timestamp).substring(0, 16);
            }
        } catch (e) {
            console.warn('Error formatting date:', e);
            dateStr = 'Invalid date';
        }

        const reasonDisplay = {
            'inappropriate': '🚫 Inappropriate Content',
            'fake': '❌ Fake/Counterfeit',
            'misleading': '⚠️ Misleading Info',
            'broken_link': '🔗 Broken Link',
            'spam': '📧 Spam',
            'offensive': '😤 Offensive',
            'other': '❓ Other'
        };

        const statusBadge = {
            'pending': '<span class="badge badge-warning">Pending</span>',
            'reviewed': '<span class="badge badge-info">Reviewed</span>',
            'resolved': '<span class="badge badge-success">Resolved</span>',
            'dismissed': '<span class="badge badge-secondary">Dismissed</span>'
        };

        const productName = escapeHtml(report.productName || 'Unknown Product');
        const productId = escapeHtml(report.productId || 'N/A');
        const productCategory = escapeHtml(report.productCategory || 'N/A');
        const userEmail = escapeHtml(report.userEmail || 'Unknown User');
        const reportReason = reasonDisplay[report.reason] || escapeHtml(report.reason || 'Unknown');
        const reportDetails = report.details ? escapeHtml(report.details) : '';
        const reportStatus = statusBadge[report.status] || '<span class="badge badge-warning">Pending</span>';

        console.log('Rendering report - Name:', productName, 'ID:', productId, 'Status:', report.status);

        const reportHtml = `
            <div class="report-item">
                <div class="report-header">
                    <div class="report-title">
                        <h3>${productName}</h3>
                        ${reportStatus}
                    </div>
                    <div class="report-date">${dateStr}</div>
                </div>
                <div class="report-details">
                    <div class="detail-row">
                        <span class="label">Product ID:</span>
                        <span class="value">${productId}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Category:</span>
                        <span class="value">${productCategory}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Reason:</span>
                        <span class="value">${reportReason}</span>
                    </div>
                    ${reportDetails ? `
                        <div class="detail-row">
                            <span class="label">Details:</span>
                            <span class="value description">${reportDetails}</span>
                        </div>
                    ` : ''}
                    <div class="detail-row">
                        <span class="label">Reported By:</span>
                        <span class="value">${userEmail}</span>
                    </div>
                </div>
                <div class="report-actions">
                    <button onclick="markReportStatus(${inlineArg(report.id)}, 'reviewed')" class="action-btn btn-primary" ${report.status === 'reviewed' ? 'disabled' : ''}>✓ Mark Reviewed</button>
                    <button onclick="markReportStatus(${inlineArg(report.id)}, 'resolved')" class="action-btn btn-success" ${report.status === 'resolved' ? 'disabled' : ''}>✓ Resolve</button>
                    <button onclick="markReportStatus(${inlineArg(report.id)}, 'dismissed')" class="action-btn btn-secondary" ${report.status === 'dismissed' ? 'disabled' : ''}>✗ Dismiss</button>
                    <button onclick="deleteReport(${inlineArg(report.id)})" class="action-btn btn-danger">🗑️ Delete</button>
                </div>
            </div>
        `;

        reportsList.innerHTML += reportHtml;
    });

    console.log('Finished rendering all reports');
}

// Filter reports by status
function filterReports() {
    const statusFilter = document.getElementById('reportStatusFilter')?.value || '';
    console.log('Filtering reports by status:', statusFilter);

    if (statusFilter === '') {
        console.log('No filter, displaying all', allReports.length, 'reports');
        displayReports(allReports);
    } else {
        const filtered = allReports.filter(r => r.status === statusFilter);
        console.log('Filtered to', filtered.length, 'reports with status:', statusFilter);
        displayReports(filtered);
    }
}

// Update report status
async function markReportStatus(reportId, status) {
    console.log('markReportStatus called for', reportId, 'with status:', status);
    try {
        const reportRef = doc(db, 'reports', reportId);
        await updateDoc(reportRef, {
            status: status,
            updatedAt: new Date(),
            updatedBy: auth.currentUser?.email || 'unknown'
        });
        console.log(`Report ${reportId} marked as ${status}`);
        await loadReports();
    } catch (error) {
        console.error('Error updating report status:', error);
        alert('Error updating report status: ' + error.message);
    }
}

// Delete a report
async function deleteReport(reportId) {
    console.log('deleteReport called for', reportId);
    if (!confirm('Are you sure you want to delete this report?')) {
        return;
    }

    try {
        await deleteDoc(doc(db, 'reports', reportId));
        console.log('Report deleted successfully');
        await loadReports();
    } catch (error) {
        console.error('Error deleting report:', error);
        alert('Error deleting report: ' + error.message);
    }
}

// Helper function to escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text ?? '').replace(/[&<>"']/g, m => map[m]);
}

// Edit Product (placeholder - can be expanded)
async function editProduct(productId) {
    try {
        const snapshot = await getDoc(doc(db, 'products', productId));
        if (!snapshot.exists()) return;
        window.currentProductId = productId;
        window.currentProduct = normalizeProduct({ ...snapshot.data(), id: snapshot.id });
        openEditProductModal();
    } catch { alert(t('msg.error')); }
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initLocalization();
    initAdminLocalization();
    initModals();
    initCharacter();
    const logoutButton = document.getElementById('logoutBtn');
    if (logoutButton) { logoutButton.type = 'button'; logoutButton.addEventListener('click', event => { event.preventDefault(); logout().catch(() => alert(t('msg.error'))); }); }
    for (const [formId, prefix] of [['addProductForm', 'product'], ['editProductForm', 'editProduct']]) {
        const form = document.getElementById(formId);
        mountPlatformEditor(form, prefix);
        mountProductRelationships(form, prefix);
        document.getElementById(`${prefix}Price`).required = false;
        for (const id of prefix === 'product' ? ['productLink', 'productDownloadLink', 'productDownloadLabel'] : ['editProductLink', 'editDownloadLink', 'editDownloadLabel']) {
            const input = document.getElementById(id);
            input.closest('.form-group, .input-group')?.setAttribute('hidden', '');
            input.required = false;
            input.closest('fieldset')?.setAttribute('hidden', '');
        }
        const group = document.createElement('div');
        group.className = 'form-grid';
        group.innerHTML = `<div class="form-group"><label for="${prefix}Version" data-i18n="editor.version">${t('editor.version')}</label><input id="${prefix}Version" maxlength="40"></div><div class="form-group"><label for="${prefix}Status" data-i18n="editor.status">${t('editor.status')}</label><select id="${prefix}Status"><option value="available" data-i18n="editor.available">${t('editor.available')}</option><option value="beta" data-i18n="editor.beta">${t('editor.beta')}</option><option value="coming-soon" data-i18n="editor.comingSoon">${t('editor.comingSoon')}</option><option value="" data-i18n="org.unspecified">${t('org.unspecified')}</option></select></div>`;
        form.querySelector('.compatibility-editor').before(group);
        prepareProductForm(form, prefix);
        initValidation(form);
    }
});

console.log('Exported functions:', Object.keys(exportedFunctions));

console.log('Control panel script loaded successfully');
console.log('Exported functions:', Object.keys(window).filter(k =>
    ['openAddModeratorModal', 'openAddSuperAdminModal', 'openAddAdminModal', 'openAddProductModal'].includes(k)
));

// Expose report functions to window
window.loadReports = loadReports;
window.filterReports = filterReports;
window.markReportStatus = markReportStatus;
window.deleteReport = deleteReport;





function inlineArg(value) { return escapeHtml(JSON.stringify(String(value ?? ''))); }
