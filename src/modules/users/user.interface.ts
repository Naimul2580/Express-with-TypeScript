export interface IUser {
  name: string;
  email: string;
  password: string;
  age?: number | null;
  role?: string;
}

export interface UpUser {
  name?: string | null;
  password?: string | null;
  age?: number | null;
  is_Active?: boolean | null;
}
