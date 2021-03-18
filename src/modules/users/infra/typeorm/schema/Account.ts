import { v4 as uuidv4 } from 'uuid';

export class Account {
  id?: string;

  name: string;

  email: string;

  cpf: string;

  cellPhone: number;

  score: number;

  negative: boolean;

  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
