import * as crypto from 'crypto';

const s3Key = process.env.APP_S3_ACCESS_KEY!;
const s3Secret = process.env.APP_S3_SECRET_KEY!;
const host = process.env.APP_S3_HOST!;
const bucket = process.env.APP_S3_BUCKET!;

export const uploadToS3 = async (blob: Blob, pathOnS3: string, name: string) => {
  const resource = `/${bucket}/${pathOnS3}/${name}`;
  const content_type = 'application/octet-stream';
  const date = new Date().toUTCString();
  const method = 'PUT';
  const signature = crypto
    .createHmac('sha1', s3Secret)
    .update(`${method}\n\n${content_type}\n${date}\n${resource}`)
    .digest('base64');

  const url = `${host}${resource}`;
  return fetch(url, {
    method,
    headers: {
      'Content-Type': content_type,
      Date: date,
      Authorization: `AWS ${s3Key}:${signature}`,
    },
    body: blob,
  }).then(() => url);
};
