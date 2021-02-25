import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Types } from 'aws-sdk/clients/s3';
import { PhotoItem } from "../models/PhotoItem";
import { PhotoUpdate } from "../models/PhotoUpdate";

export class PhotoAccess {
  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly s3Client: Types = new AWS.S3({ signatureVersion: 'v4' }),
    private readonly photoTable = process.env.PHOTOS_TABLE,
    private readonly s3BucketName = process.env.S3_BUCKET_NAME) {
  }

  async getAllPhoto(userId: string): Promise<PhotoItem[]> {
    console.log("Getting all photos");

    const params = {
      TableName: this.photoTable,
      KeyConditionExpression: "#userId = :userId",
      ExpressionAttributeNames: {
        "#userId": "userId"
      },
      ExpressionAttributeValues: {
        ":userId": userId
      }
    };

    const result = await this.docClient.query(params).promise();
    console.log(result);
    const items = result.Items;

    return items as PhotoItem[];
  }

  async createPhoto(photoItem: PhotoItem): Promise<PhotoItem> {
    console.log("Creating new photo");

    const params = {
      TableName: this.photoTable,
      Item: photoItem,
    };

    const result = await this.docClient.put(params).promise();
    console.log(result);

    return photoItem as PhotoItem;
  }

  async updatePhoto(photoUpdate: PhotoUpdate, photoId: string, userId: string): Promise<PhotoUpdate> {
    console.log("Updating photo");

    const params = {
      TableName: this.photoTable,
      Key: {
        "userId": userId,
        "photoId": photoId
      },
      UpdateExpression: "set #a = :a, #b = :b",
      ExpressionAttributeNames: {
        "#a": "description",
        "#b": "creationDate"
      },
      ExpressionAttributeValues: {
        ":a": photoUpdate['description'],
        ":b": photoUpdate['creationDate']
      },
      ReturnValues: "ALL_NEW"
    };

    const result = await this.docClient.update(params).promise();
    console.log(result);
    const attributes = result.Attributes;

    return attributes as PhotoUpdate;
  }

  async deletePhoto(photoId: string, userId: string): Promise<string> {
    console.log("Deleting photo");

    const params = {
      TableName: this.photoTable,
      Key: {
        "userId": userId,
        "photoId": photoId
      },
    };

    const result = await this.docClient.delete(params).promise();
    console.log(result);

    return "" as string;
  }

  async generateUploadUrl(photoId: string): Promise<string> {
    console.log("Generating URL");

    const url = this.s3Client.getSignedUrl('putObject', {
      Bucket: this.s3BucketName,
      Key: photoId,
      Expires: 1000,
    });
    console.log(url);

    return url as string;
  }
}