import {
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ResponseSuccess } from 'src/interface/response';
import BaseResponse from 'src/utils/response/base.response';
import { JwtGuard } from '../auth/auth.guard';
import * as fs from 'fs';
import * as path from 'path';

@UseGuards(JwtGuard)
@Controller('upload')
export class UploadController extends BaseResponse {
  constructor() {
    super();
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'public/uploads',
        filename: (req, file, cb) => {
          const fileExtension = file.originalname.split('.').pop();
          console.log(file);

          if (
            fileExtension == 'pdf' ||
            ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)
          ) {
            cb(null, `${new Date().getTime()}.${fileExtension}`);
          } else {
            cb(null, 'notsupport');
          }
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 2,
      },
    }),
  )
  @Post('file')
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<any> {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    if (file.filename == 'notsupport') {
      fs.unlinkSync(`public/uploads/${file.filename}`);
      throw new HttpException(
        'Just Support Image and PDF',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const url = `http://localhost:5002/uploads/${file.filename}`;
      return {
        file_url: url,
        file_name: file.filename,
        file_size: file.size,
      };
    } catch (err) {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: 'public/uploads',
        filename: (req, file, cb) => {
          const fileExtension = file.originalname.split('.').pop();
          console.log(file.originalname);

          if (
            fileExtension === 'pdf' ||
            ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)
          ) {
            cb(null, `${new Date().getTime()}.${fileExtension}`);
          } else {
            cb(null, `${new Date().getTime()}.notsupport`);
          }
        },
      }),
    }),
  )
  @Post('files')
  async uploadFileMulti(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<ResponseSuccess | any> {
    if (!files || files.length == 0) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    const newFiles: Express.Multer.File[] = [];

    let gagal = 0;

    for (const file of files) {
      if (
        file.filename.split('.').pop() == 'notsupport' ||
        file.size > 1024 * 1024 * 2
      ) {
        fs.unlinkSync(path.join('public/uploads', file.filename));
        gagal += 1;
      }
      if (file.filename.split('.').pop() != 'notsupport') {
        newFiles.push(file);
      }
    }

    console.log(newFiles);

    try {
      const file_response: Array<{
        file_url: string;
        file_name: string;
        file_size: number;
      }> = [];

      newFiles.forEach((file) => {
        const url = `http://localhost:5002/uploads/${file.filename}`;
        file_response.push({
          file_url: url,
          file_name: file.filename,
          file_size: file.size,
        });
      });

      return this._success('OK', {
        gagal,
        berhasil: file_response.length,
        file: file_response,
      });
    } catch (err) {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('file/delete/:filename')
  async DeleteFile(
    @Param('filename') filename: string,
  ): Promise<ResponseSuccess> {
    try {
      const filePath = `public/uploads/${filename}`;
      fs.unlinkSync(filePath);
      return this._success('Berhasil menghapus File');
    } catch (err) {
      throw new HttpException('File not Found', HttpStatus.NOT_FOUND);
    }
  }
}
