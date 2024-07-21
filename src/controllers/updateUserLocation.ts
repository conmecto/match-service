import { interfaces, validationSchema, enums, constants } from '../utils';
import { CustomError, updateLocationSetting, updateUserGeohashCache, encodeGeoLocation } from '../services';

const updateUserLocation = async (req: interfaces.IRequestObject) => {
    await validationSchema.updateUserLocationSchema.validateAsync(req.body);
    const userId = Number(req.params['userId']);
    const user = req.user;
    if (!user) {
        throw new CustomError(enums.StatusCodes.INTERNAL_SERVER, enums.Errors.INTERNAL_SERVER, enums.ErrorCodes.INTERNAL_SERVER);
    }
    if (Number(user.userId) !== Number(userId)) {
        throw new CustomError(enums.StatusCodes.FORBIDDEN, enums.Errors.FORBIDDEN, enums.ErrorCodes.FORBIDDEN);
    }
    const { latitude: lat, longitude: long } = req.body;
    const geohash = encodeGeoLocation(lat, long, constants.GEOHASH_PRECISION);
    if (!geohash) {
        throw new CustomError(enums.StatusCodes.INTERNAL_SERVER, enums.Errors.INTERNAL_SERVER, enums.ErrorCodes.INTERNAL_SERVER);
    }
    const updateObj: interfaces.IUpdateUserGeohash = { lat, long, geohash };
    await Promise.all([
        updateLocationSetting(userId, updateObj),
        updateUserGeohashCache({ userId, lat, long, geohash })
    ]);
    return {
        message: 'Location updated successfully'
    }
}

export default updateUserLocation;