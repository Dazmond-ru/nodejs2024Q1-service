import { Injectable, NestMiddleware } from '@nestjs/common';
import { CustomLogger } from './logger.service';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly customLogger: CustomLogger) {}
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, query, body } = req;

    res.on('finish', () => {
      const { statusCode } = res;
      this.customLogger.log(
        `${method} ${originalUrl}: Query parameters: ${JSON.stringify(query)}, Body: ${JSON.stringify(body)}, ${statusCode}.`,
      );
    });

    next();
  }
}
