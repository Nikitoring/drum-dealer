import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

const YANDEX_STORAGE_ENDPOINT = 'https://storage.yandexcloud.net';
const YANDEX_STORAGE_REGION = 'ru-central1';

@Injectable()
export class StorageService {
  private client?: S3Client;

  constructor(private readonly config: ConfigService) {}

  private get bucket(): string | undefined {
    return this.config.get<string>('S3_BUCKET');
  }

  private get endpoint(): string {
    return this.config.get<string>('S3_ENDPOINT', YANDEX_STORAGE_ENDPOINT);
  }

  private configured(): boolean {
    return Boolean(
      this.bucket &&
      this.config.get<string>('S3_ACCESS_KEY') &&
      this.config.get<string>('S3_SECRET_KEY'),
    );
  }

  private getClient(): S3Client {
    if (!this.configured()) {
      throw new ServiceUnavailableException('S3_NOT_CONFIGURED');
    }

    this.client ??= new S3Client({
      endpoint: this.endpoint,
      region: this.config.get<string>('S3_REGION', YANDEX_STORAGE_REGION),
      forcePathStyle: this.config.get<string>('S3_FORCE_PATH_STYLE', 'true') !== 'false',
      credentials: {
        accessKeyId: this.config.getOrThrow<string>('S3_ACCESS_KEY'),
        secretAccessKey: this.config.getOrThrow<string>('S3_SECRET_KEY'),
      },
    });

    return this.client;
  }

  async upload(buffer: Buffer, contentType: string, folder = 'products'): Promise<string> {
    const bucket = this.bucket;
    const key = `${folder}/${randomUUID()}`;

    await this.getClient().send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      }),
    );

    const publicUrl = this.config.get<string>('S3_PUBLIC_URL', this.endpoint).replace(/\/$/, '');
    return `${publicUrl}/${bucket}/${key}`;
  }

  async remove(url: string): Promise<void> {
    if (!this.configured()) return;

    const bucket = this.bucket;
    if (!bucket) return;

    const marker = `/${bucket}/`;
    const markerIndex = url.indexOf(marker);
    if (markerIndex === -1) return;

    const key = decodeURIComponent(url.slice(markerIndex + marker.length));
    if (!key) return;

    await this.getClient().send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );
  }
}
