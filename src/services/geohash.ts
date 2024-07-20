import logger from './logger';
import { getKey, cacheClient } from './cache';
import { interfaces, constants } from '../utils';

const base32 = '0123456789bcdefghjkmnpqrstuvwxyz';

const encode = (latitude: number, longitude: number, precision: number) => {
    try {
        let findLong = true;
        let minLat = -90, maxLat = 90;
        let minLong = -180, maxLong = 180;
        let bit = 0;
        let idx = 0;
        let geohash = '';
        while(geohash.length < precision) {
            if (findLong) {
                const mid = (minLong + maxLong) / 2;
                if (longitude >= mid) {
                    minLong = mid;
                    idx = idx * 2 + 1;
                } else {
                    maxLong = mid;
                    idx = idx * 2;
                }
            } else {
                const mid = (minLat + maxLat) / 2;
                if (latitude >= mid) {
                    minLat = mid;
                    idx = idx * 2 + 1;
                } else {
                    maxLat = mid;
                    idx = idx * 2;
                }
            }
            findLong = !findLong;
            if (++bit === 5) {
                const ch = base32.charAt(idx);
                geohash += ch;
                bit = 0;
                idx = 0;
            }
        }
        return geohash; 
    } catch(error: any) {
        logger(error?.toString());
    }
} 

const updateUserGeohashCache = async ({ userId, lat, long }: interfaces.IUpdateUserGeohashCache) => {
    const geohash = encode(lat, long, constants.GEOHASH_PRECISION);
    const key = userId + ':geohash';
    const oldGeohash = await getKey(key);
    if (geohash && oldGeohash !== geohash) {
        const client = await cacheClient.MULTI();
        client.SADD(geohash, userId?.toString());
        if (oldGeohash) {
            client.SREM(oldGeohash, userId?.toString());
        }
        client.set(key, geohash);
        await client.EXEC();
        return geohash;
    }
}

export { updateUserGeohashCache }