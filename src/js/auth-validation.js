export function validEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim()); }
export function passwordCriteria(value) {
    return { length: value.length >= 12, upper: /[A-Z]/.test(value), lower: /[a-z]/.test(value), number: /\d/.test(value), symbol: /[^A-Za-z0-9\s]/.test(value) };
}
export function validateSignup(data, today = new Date()) {
    if (!data.firstName?.trim() || !data.secondName?.trim() || !data.username?.trim() || !data.dob) return 'validation.required';
    if (!/^[\p{L}\p{N}_.-]{3,30}$/u.test(data.username)) return 'validation.username';
    if (!validEmail(data.email)) return 'validation.email';
    if (data.password !== data.confirmPassword) return 'validation.mismatch';
    if (data.password.length < 8) return 'validation.passwordLength';
    const birthday = new Date(data.dob + 'T00:00:00');
    if (!Number.isFinite(birthday.getTime()) || birthday > today || today.getFullYear() - birthday.getFullYear() > 120 || birthday.toLocaleDateString('en-CA') !== data.dob) return 'validation.dob';
    return '';
}
export function canUseSensitiveFeatures(user) { return !!user && user.emailVerified === true; }
export function requiresEmailVerification(user) { return !!user?.email && user.emailVerified !== true; }
export function entryDestination(user) {
    if (user?.email && user.emailVerified === true) return 'home.html';
    if (user?.isAnonymous || (user?.phoneNumber && !user.email)) return 'products.html';
    return null;
}
export const SESSION_KEYS = ['ag.session', 'ag.user', 'ag.authRedirect', 'ag.pendingVerification', 'showLoader'];
