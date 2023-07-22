import { object, string, number } from 'joi';
import { Search } from './enums';

const updateMatchFilterSchema = object({
    minAge: number().min(18).max(59),
    maxAge: number().min(20).max(60),
    city: string().min(3),
    searchFor: string().insensitive().valid(...Object.values(Search))
});

export { updateMatchFilterSchema };