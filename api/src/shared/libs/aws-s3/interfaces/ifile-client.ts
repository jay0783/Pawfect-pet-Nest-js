import { FileLib } from "./file.lib";
import { PhotoEntity } from "../../../db/entities";
import { FolderEnum } from "../folder.enum";

export interface IFileStorageClient {
  delete(key: string): Promise<void>;
  upload(photo: FileLib, folder: FolderEnum): Promise<PhotoEntity>;
}
