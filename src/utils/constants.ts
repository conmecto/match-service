const SOCKET_MAX_PAYLOAD = 1000000;

const MATCH_DETAILS = 'User match details';
const CHECK_USER_MATCHED_KEY = 'match:userId:';

const DB_CONNECTION_TIMEOUT_MILLIS = 10000;
const DB_MAX_CLIENTS = 20;
const DB_IDLE_TIMEOUT_MILLIS = 30000;

const CHAT_SOCKET_PATH = '/v1/match/chat-socket';

const AWS_PRESIGNED_URL_TIMEOUT_SEC = 120;
const AWS_PRESIGNED_URL_MIN_SIZE_BYTES = 102400;
const AWS_PRESIGNED_URL_MAX_SIZE_BYTES = 10485760;

const ALLOWED_IMAGE_TYPES = [
    'image/avif', 'image/bmp', 'image/gif', 'image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp', 'image/heic', 
    'image/heif', 'image/heic-sequence', 'image/apng'
]

export {
    MATCH_DETAILS, SOCKET_MAX_PAYLOAD, DB_CONNECTION_TIMEOUT_MILLIS, DB_MAX_CLIENTS, DB_IDLE_TIMEOUT_MILLIS, 
    CHECK_USER_MATCHED_KEY, CHAT_SOCKET_PATH, AWS_PRESIGNED_URL_TIMEOUT_SEC, AWS_PRESIGNED_URL_MIN_SIZE_BYTES,
    AWS_PRESIGNED_URL_MAX_SIZE_BYTES, ALLOWED_IMAGE_TYPES
}