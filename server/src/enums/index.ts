export enum UserRole {
  CANDIDATE = 'candidate',
  REZULTER = 'rezulter',
  SUPER_ADMIN = 'super_admin',
}

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
}

export enum OtpPurpose {
  REGISTRATION = 'registration',
  FORGOT_PASSWORD = 'forgot_password',
}

export enum StatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}
