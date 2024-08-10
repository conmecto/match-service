export enum Country {
    INDIA = 'in',
    // AUSTRALIA = 'au',
    // UNITED_KINGDOM = 'gb',
    UNITED_STATES_OF_AMERICA = 'us',
}

export enum Gender {
    MAN = 'man',
    WOMAN = 'woman',
    NON_BINARY = 'nonbinary',
    NOT_SPECIFIED = 'n/s'
}

export enum SearchFor {
    MEN = 'men',
    WOMEN = 'women',
    EVERYONE = 'everyone'
}

export enum SearchArea {
    CLOSE = 'close',
    MID = 'mid',
    DISTANT = 'distant'
}

export enum LocationAccess {
    YES = 'yes',
    NO = 'no',
    ONCE = 'once'
}

export enum StatusCodes {
    OK = 200,
    CREATED = 201,

    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INVALID_TOKEN = 498,

    INTERNAL_SERVER = 500
}

export enum Errors {
    UNAUTHORIZED = 'Unauthorized',
    FORBIDDEN = 'Forbidden Resource',

    TOKEN_NOT_SUPPLIED = 'Token not supplied',
    TOKEN_INVALID = 'Token invalid',
    TOKEN_EXPIRED = 'Token expired',
    INVALID_TOKEN_PARAMS = 'Token params invalid',

    CITY_NOT_FOUND = 'City not found',
    USER_NOT_FOUND = 'User not found',
    MATCH_NOT_FOUND = 'Match not found',
    TEXT_GEN_SETTING_NOT_FOUND = 'Text gen setting not found',
    JOB_NOT_FOUND = 'Job not found',

    USER_MATCH_SETTING_NOT_FOUND = 'User match settings not found',

    INVALID_AGE_LIMIT_SETTING = 'Invalid age limit for settings',

    INTERNAL_SERVER = 'Internal server error',
}

export enum ErrorCodes {
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',

    TOKEN_NOT_SUPPLIED = 'TOKEN_NOT_SUPPLIED',
    TOKEN_INVALID = 'TOKEN_INVALID',
    TOKEN_EXPIRED = 'TOKEN_EXPIRED',
    INVALID_TOKEN_PARAMS = 'INVALID_TOKEN_PARAMS',

    VALIDATION_ERROR = 'VALIDATION_ERROR',

    SETTING_NOT_FOUND = 'SETTING_NOT_FOUND',
    MATCH_NOT_FOUND = 'MATCH_NOT_FOUND',
    JOB_NOT_FOUND = 'JOB_NOT_FOUND',
    TEXT_GEN_SETTING_NOT_FOUND = 'TEXT_GEN_SETTING_NOT_FOUND',

    INVALID_AGE_LIMIT_SETTING = 'INVALID_AGE_LIMIT_SETTING',

    INTERNAL_SERVER = 'INTERNAL_SERVER',
}

export enum PrefixesForLogs {
    AUTH_TOKEN_INVALID_ERROR = 'Auth token invalid error: ',
    AUTH_TOKEN_EXPIRED_ERROR = 'Auth token expired error: ',

    REDIS_SET_OBJECT = 'Redis set object error: ',
    REDIS_GET_USER = 'Redis get user error: ', 
    REDIS_GET_OBJECT = 'Redis get object error: ', 
    REDIS_CONNECTION_ERROR_CLIENT1 = 'Redis client 1 connection error: ',
    REDIS_CONNECTION_ERROR_CLIENT2 = 'Redis client 2 connection error: ',
    REDIS_CONNECTION_READY_CLIENT1 = 'Redis client 1 is ready: ',
    REDIS_CONNECTION_READY_CLIENT2 = 'Redis client 2 is ready: ',
    REDIS_PUBLISH_CHANNEL_ERROR = 'Redis publish channel error: ',
    REDIS_SUBSCRIBE_CHANNEL_ERROR = 'Redis subscribe channel error: ',
    REDIS_PROCESS_MATCH_QUEUE_ERROR = 'Redis process match queue error: ',
    REDIS_HANDLE_MATCH_CREATED_ERROR = 'Redis handle match created error: ',
    REDIS_LOGGING_CHANNEL_ERROR = 'Redis logging channel error: ',

    DB_CONNECTED = 'DB connection successful: ',
    DB_CONNECTION_FAILED = 'DB connection failed: ',
    DB_ADD_SETTING_ERROR = 'DB add setting error: ',
    DB_UPDATE_USER_CURRENT_QUEUE_ERROR = 'DB update user current queue error: ',
    DB_CHECK_SETTING_ERROR = 'DB check user setting error: ',
    DB_GET_SETTING_ERROR = 'DB get user match setting error: ',
    DB_GET_CURRENT_MATCH_ERROR = 'DB get user current match error: ',
    DB_GET_MATCH_ERROR = 'DB get match error: ',
    DB_CREATE_CHAT_ROOM_ERROR = 'DB create chat room error: ',
    DB_GET_TOP_MATCHES_ERROR = 'DB get top matches error: ',
    DB_UPDATE_MATCH_SETTINGS_ERROR = 'DB update match settings error: ',
    DB_GET_USER_CHATS_ERROR = 'DB get user chats error: ',
    DB_END_MATCH_ERROR = 'DB end match error: ',
    DB_UPDATE_SETTING_POST_END_MATCH_ERROR = 'DB update setting post end match error: ',
    DB_CHAT_READ_ERROR = 'DB mark chats read error: ',
    DB_BLOCK_USER_ERROR = 'DB block user error',
    
    AWS_CHECK_BUCKET_ERROR = 'AWS check bucket error: ',
    AWS_CREATE_BUCKET_ERROR = 'AWS create bucket error: ',
    AWS_GENERATE_UPLOAD_URL_ERROR = 'AWS generate upload url error: ',
    
    EMAIL_SEND_ERROR = 'Email send error: '
}

export enum SocketEvents {
    MATCH_CREATED = 'match-created'
}

export enum FieldsDbName {
    'id' = 'id',
    'userId' = 'user_id',
    'user_id' = 'userId',
    'searchFor' = 'search_for',
    'search_for' = 'searchFor',
    'minSearchAge' = 'min_search_age',
    'min_search_age' = 'minSearchAge',
    'maxSearchAge' = 'max_search_age',
    'max_search_age' = 'maxSearchAge',
    'createdAt' = 'created_at',
    'created_at' = 'createdAt',
    'updatedAt' = 'updated_at',
    'updated_at' = 'updatedAt',
    'currentQueue' = 'current_queue',
    'current_queue' = 'currentQueue',
    'country' = 'country',
    'geohash' = 'geohash',
    'lat' = 'lat',
    'long' = 'long',
    'search_area' = 'searchArea',
    'searchArea' = 'search_area'
}

export enum ChatSocketEvents {
    SAVE_MESSAGE = 'save-message',
    SAVE_FILE = 'save-file',
    MARK_MESSAGES_AS_READ = 'mark-messages-as-read',
    MESSAGE_RECEIVED = 'message-received'
}