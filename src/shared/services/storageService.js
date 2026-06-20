// shared/services/storageService.ts
export class StorageService {
    static set(key, value) {
        try {
            const serialized = JSON.stringify(value);
            localStorage.setItem(this.prefix + key, serialized);
        }
        catch (error) {
            console.error('Storage write error:', error);
        }
    }
    static get(key, defaultValue) {
        try {
            const item = localStorage.getItem(this.prefix + key);
            return item ? JSON.parse(item) : defaultValue || null;
        }
        catch (error) {
            console.error('Storage read error:', error);
            return defaultValue || null;
        }
    }
    static remove(key) {
        localStorage.removeItem(this.prefix + key);
    }
    static clear() {
        Object.keys(localStorage)
            .filter(key => key.startsWith(this.prefix))
            .forEach(key => localStorage.removeItem(key));
    }
    static getAllKeys() {
        return Object.keys(localStorage)
            .filter(key => key.startsWith(this.prefix))
            .map(key => key.replace(this.prefix, ''));
    }
}
Object.defineProperty(StorageService, "prefix", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'budget_app_'
});
