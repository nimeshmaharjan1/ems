import { OurFileRouter } from '@/features/upload-thing';
import { generateComponents } from '@uploadthing/react';

export const { UploadButton, UploadDropzone, Uploader } = generateComponents<OurFileRouter>();
