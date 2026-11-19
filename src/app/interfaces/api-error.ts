/** Corpo di errore uniforme restituito dal GlobalExceptionHandler del backend. */
export interface ApiError {
  timestamp: string;
  status: number;
  reason: string;
  message: string;
  path: string;
}
