const visibleName = value => typeof value === 'string' && value.trim() && !value.includes('@') ? value.trim() : '';

export function chatSenderName(message, profile = {}, fallback = '') {
    return visibleName(profile.username) || visibleName(message.senderUsername) ||
        visibleName(profile.displayName) || visibleName(message.senderName) ||
        visibleName([profile.firstName, profile.secondName, profile.lastName].filter(Boolean).join(' ')) ||
        visibleName((message.senderEmail || message.senderName || profile.email || '').split('@')[0]) || fallback;
}

export function isOwnChatMessage(message, user) {
    if (!user) return false;
    if (message.senderId) return message.senderId === user.uid;
    // Older records may have only email; never override a conflicting sender UID.
    const email = message.senderEmail || (message.senderName?.includes('@') ? message.senderName : '');
    return Boolean(email && user.email && email.toLowerCase() === user.email.toLowerCase());
}
