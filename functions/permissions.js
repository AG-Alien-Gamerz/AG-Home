const ownerEmails = ['ag.aliengamerz@gmail.com', 'hamza.datashare@gmail.com'];
const levels = { OWNER: 1000, SUPER_ADMIN: 100, ADMIN: 80, MODERATOR: 50, USER: 10 };
function canAssign(caller, previous, next) {
    if (!['USER','MODERATOR','ADMIN','SUPER_ADMIN'].includes(next)) return false;
    if (previous === 'OWNER') return false;
    if (caller === 'OWNER') return true;
    if (caller === 'SUPER_ADMIN') return ['USER','MODERATOR','ADMIN'].includes(previous) && ['USER','MODERATOR','ADMIN'].includes(next);
    if (caller === 'ADMIN') return ['USER','MODERATOR'].includes(previous) && ['USER','MODERATOR'].includes(next);
    return false;
}
function canRemove(caller, previous) { return previous !== 'USER' && canAssign(caller, previous, 'USER'); }
module.exports = { canAssign, canRemove, ownerEmails, levels };
