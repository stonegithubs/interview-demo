export class TokenService {
  static saveAuthToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  static getAuthToken(): string {
    return localStorage.getItem('authToken') || '';
  }

  static removeAuthToken():void {
    localStorage.removeItem('authToken');
  }
}
