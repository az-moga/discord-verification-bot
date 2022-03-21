import NodeCache from "node-cache";

export class ApplicationCache
{
    // 10 minutes
    static EXPIRATION_SECONDS = 60 * 10;
    private _cache: NodeCache = new NodeCache();

    add<T>(key: string, handler: T) {
        this._cache.set(key, handler, ApplicationCache.EXPIRATION_SECONDS);
    }     

    get<T>(key: string): T | undefined {
        return this._cache.get(key);
    }

    expire(key: string) {
        this._cache.del(key);
    }
}

const registry = new ApplicationCache();

export default registry;