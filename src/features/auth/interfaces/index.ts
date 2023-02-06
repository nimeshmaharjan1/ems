export interface IRegister {
  username: string;
  full_name: string;
  email: string;
  password: string;
  phone_number: string;
}

export interface ILoginWithPassword {
  username: string;
  password: string;
}
