import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/user.model';

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
      { id: 1, api_key: 'api_key_quant_89a52d57-9b18-4e19-b80c-1535d5e8d9b3', role: 'Quant', created_at: new Date() },
      { id: 2, api_key: 'api_key_quant_3d6a93b1-686d-404d-92b1-bdbef2d6d4f2', role: 'Quant', created_at: new Date() },
      { id: 3, api_key: 'api_key_quant_64b02c3b-5ad5-4f6a-8e2d-0949d21d41f0', role: 'Quant', created_at: new Date() },
      { id: 4, api_key: 'api_key_quant_7b1a4b14-3e47-4e77-8b67-8838eb726e3a', role: 'Quant', created_at: new Date() },
      { id: 5, api_key: 'api_key_quant_256d9c63-6a23-4a45-b774-3a6238a37e5d', role: 'Quant', created_at: new Date() },
      { id: 6, api_key: 'api_key_ops_f3a1e7c7-646f-4c27-9306-3e9a063848cf', role: 'Ops', created_at: new Date() },
      { id: 7, api_key: 'api_key_ops_b06ff789-d46f-4b6d-9efb-76b1ff1d5b6d', role: 'Ops', created_at: new Date() },
      { id: 8, api_key: 'api_key_ops_a6dfe5e4-82b2-4530-95e1-3a6710b0de68', role: 'Ops', created_at: new Date() },
      { id: 9, api_key: 'api_key_ops_34e632f2-4927-4fcb-b0ef-0a4b6c2b07c3', role: 'Ops', created_at: new Date() },
      { id: 10, api_key: 'api_key_ops_55562c31-d630-4d3a-8252-3d59b466bd5b', role: 'Ops', created_at: new Date() },
    ];
  
    async function seedDatabase() {
      for (const userData of users) {
        const user = User.build(userData as User); 
        await user.save();
      }
    }

    seedDatabase()
    console.log('Seeded database with User data.');
  } else {
    console.log('Database already seeded.');
  }
}
