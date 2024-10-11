import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { HttpCodes } from '../../utils';

export default function Validator(schema: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (Object.keys(req.body).length === 0) {
      return res.status(HttpCodes.BAD_REQUEST).json({
        message: 'Validation failed: Request body is empty'
      });
    }
    const instance = plainToInstance(schema, req.body);

    const errors = await validate(instance, {
      whitelist: true,
      forbidNonWhitelisted: true
    });

    if (errors.length > 0) {
      // If validation fails, send an error response
      res.status(HttpCodes.BAD_REQUEST).json({
        message: 'Validation failed',
        errors: errors.map(error => ({
          field: error.property,
          issues: Object.values(
            error.constraints || { error: 'Invalid values' }
          )
        }))
      });
    } else {
      next();
    }
  };
}
