import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';

export const documentFileFilter = (req: any, file: any, callback: any) => {
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.png', '.jpg', '.jpeg'];
    const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/png',
        'image/jpeg',
    ];

    const ext = extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
        return callback(new BadRequestException(`File extension ${ext} is not allowed`), false);
    }

    if (!allowedMimeTypes.includes(file.mimetype)) {
        return callback(new BadRequestException(`MIME type ${file.mimetype} is not allowed`), false);
    }

    callback(null, true);
};
