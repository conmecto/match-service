import { interfaces, validationSchema, enums } from '../utils';
import { CustomError, updateLocationSetting, updateUserGeohashCache } from '../services';

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
    const geohash = await updateUserGeohashCache({ userId, lat, long });
    const updateObj: interfaces.IUpdateUserGeohash = { lat, long };
    if (geohash) {
        updateObj.geohash = geohash;
    }
    await updateLocationSetting(userId, updateObj);
    return {
        message: 'Location updated successfully'
    }
}

export default updateUserLocation;