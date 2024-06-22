import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { AccessRequest } from '../models/access-request.model';

@Table({
    tableName: 'users', 
    schema: 'public',   
    timestamps: false
})
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  api_key: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  role: string;

  @Column({
    type: DataType.STRING, 
    allowNull: false,
  })
  first_name: string;

  @Column({
    type: DataType.STRING, 
    allowNull: false,
  })
  last_name: string;

  @HasMany(() => AccessRequest)
  accessRequests: AccessRequest[];
}
