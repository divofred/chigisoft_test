import bcrypt from 'bcrypt';
import config from '../config';
import jwt from 'jsonwebtoken';

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (data: any): string => {
  return jwt.sign(data, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
};

export async function verifyToken(token: string): Promise<{ id: string }> {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      config.jwt.secret,
      (err: any, decoded: { id: string } | undefined) => {
        if (err) {
          reject(err);
        }
        resolve(decoded as { id: string });
      }
    );
  });
}

export const HttpCodes = {
  // Informational
  CONTINUE: 100,
  SWITCHING_PROTOCOLS: 101,
  PROCESSING: 102,

  // Success
  OK: 200,
  CREATED: 201,

  // Redirection
  MOVED_PERMANENTLY: 301,
  NOT_MODIFIED: 304,
  TEMPORARY_REDIRECT: 307,

  // Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,

  // Server Errors
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
};

export function PageInfo(
  totalCount: number,
  pageSize: number,
  pageNumber: number
): {
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  totalPages: number;
  totalCount: number;
} {
  const totalPages = Math.ceil(totalCount / pageSize);
  const hasNextPage = pageNumber < totalPages;
  const hasPrevPage = pageNumber > 1;
  const nextPage = hasNextPage ? pageNumber + 1 : null;
  const prevPage = hasPrevPage ? pageNumber - 1 : null;

  return {
    currentPage: pageNumber,
    nextPage,
    prevPage,
    totalPages,
    totalCount
  };
}
