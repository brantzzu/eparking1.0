export interface UserInfo {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  avatarId: string;
  avatarPath: string;
  description: string;
  token: string;
}
export interface LoginInfo {
  access_token: string;
  user: UserInfo;
}