import { S3Client, CreateBucketCommand, HeadBucketCommand, PutPublicAccessBlockCommand, BucketLocationConstraint } from '@aws-sdk/client-s3';
import { createPresignedPost, PresignedPostOptions } from '@aws-sdk/s3-presigned-post';
import { Environments, enums, constants, interfaces } from '../utils';
import { logger } from '../services';

const runAwsFile = () => {};

const s3Client = new S3Client({ 
    credentials: {
        accessKeyId: Environments.aws.accessKeyId,
        secretAccessKey: Environments.aws.secretAccessKey,
    },
    region: Environments.aws.s3Region
});

const checkOrCreateBucket = async (bucket: string) => {
    let checkBucketExists = false;
    if (!s3Client) {
        throw new Error('S3 client not found');
    } 
    try {
        const command = new HeadBucketCommand({
            Bucket: bucket
        });            
        const res = await s3Client.send(command);
        checkBucketExists = true; 
    } catch(error) {
        await logger('Match Service: ' + enums.PrefixesForLogs.AWS_CHECK_BUCKET_ERROR + error?.toString());
    }

    try {
        if (checkBucketExists) {
            return;
        }
        const createCommand = new CreateBucketCommand({
            Bucket: bucket,
            CreateBucketConfiguration: {
                LocationConstraint: Environments.aws.s3Region as BucketLocationConstraint
            },
            ObjectOwnership: 'BucketOwnerPreferred',
        });
        const updateBucketCommand = new PutPublicAccessBlockCommand({
            Bucket: bucket,
            PublicAccessBlockConfiguration: {
                BlockPublicAcls: false
            }
        });
        const createRes = await s3Client.send(createCommand);
        if (createRes?.Location) {
            await s3Client.send(updateBucketCommand);
        }
    } catch(error) {
        await logger('Match Service: ' + enums.PrefixesForLogs.AWS_CREATE_BUCKET_ERROR + error?.toString());
    }
};

checkOrCreateBucket(Environments.aws.s3BucketChat);

const generatePresignedUploadUrl = async ({ matchId, userId, fileName, contentType }: interfaces.IGenerateUploadUrlBody) => {
    try {
        const Bucket = Environments.aws.s3BucketChat;
        const Key = 'match/' + matchId + '/user/' + userId + '/' + fileName;
        const Conditions: Record<string, any>[] = [
            { 
                acl: 'public-read' 
            }, 
            { 
                bucket: Bucket 
            }, 
            ['starts-with', '$key', Key],
            ['starts-with', '$Content-Type', contentType],
            ['content-length-range', constants.AWS_PRESIGNED_URL_MIN_SIZE_BYTES, constants.AWS_PRESIGNED_URL_MAX_SIZE_BYTES]
        ];
        const Fields = {
            acl: 'public-read',

        };
        const postOptions: PresignedPostOptions = {
            Bucket,
            Key,
            Conditions,
            Fields,
            Expires: constants.AWS_PRESIGNED_URL_TIMEOUT_SEC
        };
        const { url, fields } = await createPresignedPost(s3Client, postOptions);
        return { url, fields };
    } catch(error) {
        await logger('Match Service: ' + enums.PrefixesForLogs.AWS_GENERATE_UPLOAD_URL_ERROR + error?.toString());
    }
}

export { runAwsFile, s3Client, generatePresignedUploadUrl }