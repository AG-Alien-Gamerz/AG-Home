// Older messages without a status are new messages. Counts always include the
// complete inbox, independently of the selected filter.
export function messageStatus(message) {
    return message.status === 'read' ? 'read' : 'unread';
}
export function filterMessages(messages, filter = 'all') {
    return ['read', 'unread'].includes(filter)
        ? messages.filter(message => messageStatus(message) === filter) : messages;
}
export function messageCounts(messages) {
    const read = messages.filter(message => messageStatus(message) === 'read').length;
    return { all: messages.length, read, unread: messages.length - read };
}
