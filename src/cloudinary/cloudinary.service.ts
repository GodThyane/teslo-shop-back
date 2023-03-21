import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { Express } from 'express';
import * as process from 'process';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  constructor() {
    v2.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_KEY,
      api_secret: process.env.CLOUD_SECRET,
    });
  }

  async upload(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      toStream(file.buffer).pipe(upload);
    });
  }

  async delete(image: string) {
    const [fileId] = image
      .substring(image.lastIndexOf('/') + 1)
      .split('.');
    if (fileId) {
      return v2.uploader.destroy(fileId);
    }
  }
}
