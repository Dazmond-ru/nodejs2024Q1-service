import { Injectable, LogLevel, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as os from 'os';

@Injectable()
export class CustomLogger implements LoggerService {
  private readonly appLogLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'verbose';
  private readonly logFilePath = './logs/app_log.log';
  private readonly errFilePath = './logs/app_err.log';
  private readonly fileSize: number = parseInt(process.env.FILE_SIZE) || 1024;

  log(message: string) {
    this.logMessage('log', message);
  }

  error(message: string) {
    this.logMessage('error', message);
  }

  warn(message: string) {
    this.logMessage('warn', message);
  }

  debug(message: string) {
    this.logMessage('debug', message);
  }

  verbose(message: string) {
    this.logMessage('verbose', message);
  }

  private logMessage(level: LogLevel, message: string) {
    if (this.isLogLevelEnable(level)) {
      const timestamp = new Date().toISOString();
      const formattedMessage = this.formatMessage(timestamp, level, message);
      this.writeToFile(formattedMessage, level === 'error');
      this.printToConsole(formattedMessage, level);
    }
  }

  private writeToFile(logMessage: string, isError: boolean = false) {
    const logFilePath = isError ? this.errFilePath : this.logFilePath;

    fs.appendFile(logFilePath, `${logMessage}${os.EOL}\n`, (err) => {
      if (err) {
        console.error('Error writing log to file:', err);
      } else {
        this.rotateLogFileIfNeeded(logFilePath);
      }
    });
  }

  private rotateLogFileIfNeeded(logFilePath: string) {
    fs.stat(logFilePath, (err, stats) => {
      if (err) {
        console.error('Error getting file stats:', err);
        return;
      }

      if (stats.size >= 1024 * this.fileSize) {
        const rotatedFilePath = logFilePath.replace('.log', `_old_${Date.now()}.log`);
        fs.rename(logFilePath, rotatedFilePath, (renameErr) => {
          if (renameErr) {
            console.error('Error rotating file:', renameErr);
          }
        });
      }
    });
  }

  private formatMessage(timestamp: string, level: LogLevel, message: string): string {
    return `${timestamp} ${level.toUpperCase()} ${message}`;
  }

  private isLogLevelEnable(level: LogLevel): boolean {
    const logLevelHierarchy = [
      'log',
      'error',
      'warn',
      'debug',
      'verbose',
    ] as LogLevel[];

    return (
      logLevelHierarchy.indexOf(level) <=
      logLevelHierarchy.indexOf(this.appLogLevel)
    );
  }

  private printToConsole(formattedMessage: string, level: LogLevel) {
    const colors = {
        log: '\x1b[0m',
        error: '\x1b[31m',
        warn: '\x1b[33m',
        debug: '\x1b[36m',
        verbose: '\x1b[35m',
        time: '\x1b[2m',
    };
    console[level](colors[level] + formattedMessage);
  }
}
