import { S3Client, CreateBucketCommand, HeadBucketCommand, PutPublicAccessBlockCommand, BucketLocationConstraint, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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
    } catch(error: any) {
        const errorString = JSON.stringify({
            stack: error?.stack,
            message: error?.toString()
        });
        await logger(enums.PrefixesForLogs.AWS_CHECK_BUCKET_ERROR + errorString);
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
    } catch(error: any) {
        const errorString = JSON.stringify({
            stack: error?.stack,
            message: error?.toString()
        });
        await logger(enums.PrefixesForLogs.AWS_CREATE_BUCKET_ERROR + errorString);
    }
};

checkOrCreateBucket(Environments.aws.s3BucketChat);

const generatePresignedUploadUrl = async ({ matchId, userId, fileName, contentType }: interfaces.IGenerateUploadUrlBody) => {
    try {
        const Bucket = Environments.aws.s3BucketChat;
        const Key = 'match/' + matchId + '/user/' + userId + '/' + fileName;
        const command = new PutObjectCommand({
            Bucket,
            Key,
            ACL: 'public-read',
            ContentType: contentType
        });
        const url = await getSignedUrl(s3Client, command, { expiresIn: constants.AWS_PRESIGNED_URL_TIMEOUT_SEC });
        return url;
    } catch(error: any) {
        const errorString = JSON.stringify({
            stack: error?.stack,
            message: error?.toString()
        });
        await logger(enums.PrefixesForLogs.AWS_GENERATE_UPLOAD_URL_ERROR + errorString);
    }
}

export { runAwsFile, s3Client, generatePresignedUploadUrl }