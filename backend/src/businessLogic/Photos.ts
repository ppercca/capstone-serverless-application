import { PhotoItem } from '../models/PhotoItem';
import { parseUserId } from '../auth/utils';
import { CreatePhotoRequest } from '../requests/CreatePhotoRequest';
import { UpdatePhotoRequest } from '../requests/UpdatePhotoRequest';
import { PhotoUpdate } from '../models/PhotoUpdate';
import { PhotoAccess } from '../dataLayer/PhotoAccess';

const uuidv4 = require('uuid/v4');
const photoAccess = new PhotoAccess();

export async function getAllPhoto(jwtToken: string): Promise<PhotoItem[]> {
  const userId = parseUserId(jwtToken);
  return photoAccess.getAllPhoto(userId);
}

export function createPhoto(createPhotoRequest: CreatePhotoRequest, jwtToken: string): Promise<PhotoItem> {
  const userId = parseUserId(jwtToken);
  const photoId = uuidv4();
  const s3BucketName = process.env.S3_BUCKET_NAME;

  return photoAccess.createPhoto({
    userId: userId,
    photoId: photoId,
    attachmentUrl: `https://${s3BucketName}.s3.amazonaws.com/${photoId}`,
    createdAt: new Date().getTime().toString(),
    ...createPhotoRequest,
  });
}

export function updatePhoto(updatePhotoRequest: UpdatePhotoRequest, photoId: string, jwtToken: string): Promise<PhotoUpdate> {
  const userId = parseUserId(jwtToken);
  return photoAccess.updatePhoto(updatePhotoRequest, photoId, userId);
}

export function deletePhoto(photoId: string, jwtToken: string): Promise<string> {
  const userId = parseUserId(jwtToken);
  return photoAccess.deletePhoto(photoId, userId);
}

export function generateUploadUrl(photoId: string): Promise<string> {
  return photoAccess.generateUploadUrl(photoId);
}