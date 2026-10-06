export function normalizePhone(value) {
    const phone = String(value).trim().replace(/[\s()-]/g,'');
    return /^\+[1-9]\d{7,14}$/.test(phone) ? phone : '';
}
