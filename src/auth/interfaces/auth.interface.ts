export interface Token {
  userId: string;
  login: string;
}

export interface TokenData {
  expiresIn: string;
  secret: string;
}
