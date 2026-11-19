/** Credenziali in ingresso per /auth/login e /auth/register. */
export interface Auth {
  username: string;
  password: string;
}

/** Risposta di POST /auth/login. */
export interface LoginResponse {
  token: string;
}

/** Risposta di GET /auth/me. */
export interface AuthMe {
  username: string;
}
