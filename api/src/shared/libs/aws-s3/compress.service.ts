import { Injectable } from "@nestjs/common";
import sharp from "sharp";
import { FileLib } from "./interfaces/file.lib";


@Injectable()
export class CompressService {
  async compress(file: FileLib): Promise<Buffer> {
    const fileSharpStream = sharp(file.buffer, { failOnError: false }).jpeg({ quality: 80 });
    return fileSharpStream.toBuffer();
  }
}
