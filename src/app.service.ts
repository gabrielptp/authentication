import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  getStatus() {
    return {
      status: 'OK',
      message: 'Authentication API is running',
      timestamp: new Date().toISOString()
    };
  }
}
