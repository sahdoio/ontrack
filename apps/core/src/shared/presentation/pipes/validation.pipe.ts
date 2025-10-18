import { ValidationPipe as NestValidationPipe, BadRequestException } from '@nestjs/common';

/**
 * Global Validation Pipe
 * Validates all DTOs using class-validator decorators
 */
export const validationPipeConfig = {
  whitelist: true, // Strip properties that don't have decorators
  forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
  transform: true, // Auto-transform payloads to DTO instances
  transformOptions: {
    enableImplicitConversion: true, // Convert string to number, etc.
  },
  exceptionFactory: (errors) => {
    const messages = errors.map((error) => ({
      field: error.property,
      errors: Object.values(error.constraints || {}),
    }));

    return new BadRequestException({
      statusCode: 400,
      message: 'Validation failed',
      errors: messages,
    });
  },
};

export const ValidationPipe = new NestValidationPipe(validationPipeConfig);
