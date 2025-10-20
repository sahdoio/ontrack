import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileLoggerService extends ConsoleLogger {
  private readonly logDir: string;
  private readonly logFile: string;

  constructor() {
    super();
    this.logDir = process.env.LOG_DIR || '/app/logs';
    this.logFile = path.join(this.logDir, 'application.log');
    this.ensureLogDirectory();
  }

  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private writeToFile(level: string, message: string, context?: string): void {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` [${context}]` : '';
    const logLine = `${timestamp} [${level}]${contextStr} ${message}\n`;

    try {
      fs.appendFileSync(this.logFile, logLine, 'utf8');
    } catch (error) {
      // Fallback to console only if file write fails
      super.error(`Failed to write to log file: ${error}`);
    }
  }

  log(message: any, context?: string) {
    super.log(message, context);
    this.writeToFile('LOG', message, context);
  }

  error(message: any, stack?: string, context?: string) {
    super.error(message, stack, context);
    const errorMessage = stack ? `${message}\n${stack}` : message;
    this.writeToFile('ERROR', errorMessage, context);
  }

  warn(message: any, context?: string) {
    super.warn(message, context);
    this.writeToFile('WARN', message, context);
  }

  debug(message: any, context?: string) {
    super.debug(message, context);
    this.writeToFile('DEBUG', message, context);
  }

  verbose(message: any, context?: string) {
    super.verbose(message, context);
    this.writeToFile('VERBOSE', message, context);
  }
}
