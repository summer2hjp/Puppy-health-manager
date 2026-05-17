const KEY_PREFIX = 'phm-v1';

export function createStorage(localStorageRef) {
    function makeKey(accountId, moduleName) {
        return `${KEY_PREFIX}:${accountId}:${moduleName}`;
    }

    function read(accountId, moduleName, fallback) {
        const key = makeKey(accountId, moduleName);
        const raw = localStorageRef.getItem(key);
        if (!raw) {
            return fallback;
        }
        try {
            return JSON.parse(raw);
        } catch {
            return fallback;
        }
    }

    function write(accountId, moduleName, data) {
        const key = makeKey(accountId, moduleName);
        localStorageRef.setItem(key, JSON.stringify(data));
    }

    return { read, write };
}
