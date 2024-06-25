import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';

interface UserAttributes {
  id: string;
  apiKey: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function seedDatabase(sequelize: Sequelize) {
  const userCount = await User.count();
  if (userCount === 0) {
    const users: UserAttributes[] = [
      { id: `${uuidv4()}`, apiKey: `api_key_quant_${uuidv4()}`, role: 'Quant', createdAt: new Date(), updatedAt: new Date() },
      { id: `${uuidv4()}`, apiKey: `api_key_quant_${uuidv4()}`, role: 'Quant', createdAt: new Date(), updatedAt: new Date()},
      { id: `${uuidv4()}`, apiKey: `api_key_quant_${uuidv4()}`, role: 'Quant', createdAt: new Date(), updatedAt: new Date()},
      { id: `${uuidv4()}`, apiKey: `api_key_quant_${uuidv4()}`, role: 'Quant', createdAt: new Date(), updatedAt: new Date()},
      { id: `${uuidv4()}`, apiKey: `api_key_quant_${uuidv4()}`, role: 'Quant', createdAt: new Date(), updatedAt: new Date()},
      { id: `${uuidv4()}`, apiKey: `api_key_ops_${uuidv4()}`, role: 'Ops', createdAt: new Date(), updatedAt: new Date()},
      { id: `${uuidv4()}`, apiKey: `api_key_ops_${uuidv4()}`, role: 'Ops', createdAt: new Date(), updatedAt: new Date()},
      { id: `${uuidv4()}`, apiKey: `api_key_ops_${uuidv4()}`, role: 'Ops', createdAt: new Date(), updatedAt: new Date()},
      { id: `${uuidv4()}`, apiKey: `api_key_ops_${uuidv4()}`, role: 'Ops', createdAt: new Date(), updatedAt: new Date()},
      { id: `${uuidv4()}`, apiKey: `api_key_ops_${uuidv4()}`, role: 'Ops', createdAt: new Date(), updatedAt: new Date()},
    ];
    
    for (const userData of users) {
      await User.create(userData as User);
    }
    console.log('Seeded database with User data.');
  } else {
    console.log('Database already seeded.');
  }
}
