import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { AccessRequest } from '../models/access-request.model';

@Table
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  apiKey: string;

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
  firstName: string;

  @Column({
    type: DataType.STRING, 
    allowNull: false,
  })
  lastName: string;

  @HasMany(() => AccessRequest)
  accessRequests: AccessRequest[];
}
