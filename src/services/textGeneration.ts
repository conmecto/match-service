import { VertexAI } from '@google-cloud/vertexai';
import logger from './logger';
import { Environments, constants } from '../utils';

const generateFromTextInput = async (context: string) => {
    try {
        const { 
            model, project, location, clientId, clientSecret, refreshToken, type, universeDomain 
        } = Environments.google;
        const credentials = {
            type,
            client_id: clientId,
            client_secret: clientSecret,
            universe_domain: universeDomain,
            refresh_token: refreshToken
        }
        const vertexAI = new VertexAI({ 
            googleAuthOptions: { credentials }, 
            project, 
            location
        });
        const timeout = constants.GOOGLE_VERTEX_API_TIMEOUT_MILLIS;
        const generativeModel = vertexAI.getGenerativeModel({ model }, { timeout });
        const prompt = `Context: *The user ${context}*. Generate a message to impress the user, within 100 tokens.`;
        const resp = await generativeModel.generateContent(prompt); 
        const contentResponse = await resp.response;
        if (contentResponse?.candidates && contentResponse?.usageMetadata) {
            return {
                response: contentResponse.candidates[0].content.parts[0].text as string,
                inputTokenCount: contentResponse.usageMetadata.promptTokenCount as number,
                outputTokenCount: contentResponse.usageMetadata.candidatesTokenCount as number
            }
        }
    } catch(error) {
        await logger('Generate From Text Input' + error?.toString());
    }
}

export default generateFromTextInput