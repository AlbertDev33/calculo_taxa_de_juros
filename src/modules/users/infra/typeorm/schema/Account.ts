import { v4 as uuidv4 } from 'uuid';

export class Account {
  id?: string;

  name: string;

  cpf: number;

  cellphone: number;

  score: number;

  negative: boolean;

  constructor() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
