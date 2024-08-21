import logger from './logger';
import { getKey } from './cache';
import { redisClient1 } from '../config';
import { interfaces } from '../utils';

const base32 = '0123456789bcdefghjkmnpqrstuvwxyz';

const encodeGeoLocation = (latitude: number, longitude: number, precision: number) => {
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

const updateUserGeohashCache = async ({ userId, lat, long, geohash }: interfaces.IUpdateUserGeohashCache) => {
    const key = userId + ':geohash';
    const oldGeohash = await getKey(key);
    if (geohash) {
        const client = await redisClient1.MULTI();
        if (oldGeohash) {
            client.SREM(oldGeohash, userId?.toString());
        }
        client.SADD(geohash, userId?.toString());
        client.set(key, geohash);
        await client.EXEC();
        return geohash;
    }
}

export { encodeGeoLocation, updateUserGeohashCache }