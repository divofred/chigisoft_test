import { Request } from 'express';

interface Session {
  userId: string;
  token: string;
}

export interface AuthenticatedRequest extends Request {
  session: Session;
}
