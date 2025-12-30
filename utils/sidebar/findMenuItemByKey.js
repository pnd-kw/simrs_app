export function findMenuItemByKey(items, key) {
    for (const item of items) {
        if (item.key === key) return item;
        if (item.children) {
            const found = findMenuItemByKey(item.children, key);
            if (found) return found;
        }
    }
    return null;
}