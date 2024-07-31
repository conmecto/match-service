import { interfaces, validationSchema, enums } from '../utils';
import { CustomError, userMatchesSummary } from '../services';

const getUserMatchesSummary = async (req: interfaces.IRequestObject) => {
    await validationSchema.paramsUserMatchSettingSchema.validateAsync(req.params);
    const userId = Number(req.params['userId']);
    const user = req.user;
    if (!user) {
        throw new CustomError(enums.StatusCodes.INTERNAL_SERVER, enums.Errors.INTERNAL_SERVER, enums.ErrorCodes.INTERNAL_SERVER);
    }
    if (Number(user.userId) !== Number(userId)) {
        throw new CustomError(enums.StatusCodes.FORBIDDEN, enums.Errors.FORBIDDEN, enums.ErrorCodes.FORBIDDEN);
    }
    const matchesSummary = await userMatchesSummary(userId);
    if (!matchesSummary) {
        throw new CustomError(enums.StatusCodes.INTERNAL_SERVER, enums.Errors.INTERNAL_SERVER, enums.ErrorCodes.INTERNAL_SERVER);
    }
    const currentMatches = matchesSummary.length ? matchesSummary[0].activeMatchesCount : 0;
    const highestMatchStreak = matchesSummary.reduce((prev, current) => Math.max(prev, current.score), 0);
    const matchesScoreSum = matchesSummary.reduce((prev, current) => prev + current.score, 0);
    const avgMatchStreak = Math.floor((matchesScoreSum / matchesSummary.length) * 100) / 100;
    const matchesDurationSum = Math.floor(matchesSummary.reduce((prev, current) => prev + current.matchDurationHours, 0) / 24);
    const avgMatchDuration = Math.floor((matchesDurationSum / matchesSummary.length) * 100) / 100; 
    const totalMatches = matchesSummary.length === 1 ? (
        matchesSummary[0].matchId ? 1 : 0
    ) : matchesSummary.length;
    return {
        currentMatches,
        totalMatches,
        highestMatchStreak,
        conmectoScore: matchesSummary.length ? matchesSummary[0].totalMatchScore : 0,
        avgMatchStreak,
        avgMatchDuration
    }
}

export default getUserMatchesSummary;