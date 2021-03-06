import { Deserializable } from '../../../shared/interfaces/deserializable.interface';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class User implements Deserializable {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  role: Role;

  constructor(user: any = {}) {
    this.id = user.id;
    this.email = user.email;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.role = user.role;
  }

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
