import { v4 as uuidv4 } from 'uuid';

export class Rate {
  id?: string;

  type: string;

  installments: number;

  constructor() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
