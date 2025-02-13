
export class DatabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public query?: string
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class ConnectionError extends DatabaseError {
  constructor(message: string) {
    super(message);
    this.name = 'ConnectionError';
  }
}
