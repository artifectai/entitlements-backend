import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';

interface UserAttributes {
  id: number;
  api_key: string;
  role: string;
  created_at: Date;
}

export async function seedDatabase(sequelize: Sequelize) {
  const userCount = await User.count();
  if (userCount === 0) {
    const users: UserAttributes[] = [
      { id: 1, api_key: `api_key_quant_${uuidv4()}`, role: 'Quant', created_at: new Date() },
      { id: 2, api_key: `api_key_quant_${uuidv4()}`, role: 'Quant', created_at: new Date() },
      { id: 3, api_key: `api_key_quant_${uuidv4()}`, role: 'Quant', created_at: new Date() },
      { id: 4, api_key: `api_key_quant_${uuidv4()}`, role: 'Quant', created_at: new Date() },
      { id: 5, api_key: `api_key_quant_${uuidv4()}`, role: 'Quant', created_at: new Date() },
      { id: 6, api_key: `api_key_ops_${uuidv4()}`, role: 'Ops', created_at: new Date() },
      { id: 7, api_key: `api_key_ops_${uuidv4()}`, role: 'Ops', created_at: new Date() },
      { id: 8, api_key: `api_key_ops_${uuidv4()}`, role: 'Ops', created_at: new Date() },
      { id: 9, api_key: `api_key_ops_${uuidv4()}`, role: 'Ops', created_at: new Date() },
      { id: 10, api_key: `api_key_ops_${uuidv4()}`, role: 'Ops', created_at: new Date() },
    ];
    
    for (const userData of users) {
      await User.create(userData as User);
    }
    console.log('Seeded database with User data.');
  } else {
    console.log('Database already seeded.');
  }
}
