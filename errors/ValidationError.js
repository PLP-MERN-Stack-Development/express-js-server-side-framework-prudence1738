// errors/ValidationError.js
import AppError from './AppError.js';

export default class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 400);
  }
}
