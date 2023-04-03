
export class JwtUser {
  id: number;
  username: string;
  token: string;
  type: string;
  refreshToken: string;
  roles: Set<string>;

  constructor() {
    this.id = 0;
    this.username = '';
    this.token = '';
    this.type = '';
    this.refreshToken = '';
    this.roles = new Set<string>();
  }
}
