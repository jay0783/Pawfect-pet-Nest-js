import { BadRequestException } from "@nestjs/common";


const allowMimeTypes = [
  "image/jpeg",
  "image/pjpeg",
  "image/png",
  "image/tiff",
  "image/webp",
  "image/gif",
  "image/svg+xml",

  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];


// HINT: not work fileFilter validation in nest/multer
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function fileFilter(req: any, file: {
  /** A Buffer of the entire file (MemoryStorage) */
  buffer: Buffer;
  /** The folder to which the file has been saved (DiskStorage) */
  destination: string;
  /** Encoding type of the file */
  encoding: string;
  /** Field name specified in the form */
  fieldname: string;
  /** The name of the file within the destination (DiskStorage) */
  filename: string;
  /** Name of the file on the user's computer */
  mimetype: string;
  /** Size of the file in bytes */
  originalname: string;
  /** Location of the uploaded file (DiskStorage) */
  path: string;
  /** Mime type of the file */
  size: number;
}, callback: (error: Error | null, acceptFile: boolean) => void): void {
  if (!allowMimeTypes.includes(file.mimetype)) {
    const err = new BadRequestException("file extension is not allow");
    callback(err, false);
    return;
  }

  callback(null, true);
}
