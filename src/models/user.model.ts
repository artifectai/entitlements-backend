import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript';

@Table({
  tableName: 'users',
  schema: 'public',
  timestamps: true
})
export class User extends Model<User> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'api_key'
  })
  apiKey: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'role'
  })
  role: string;
}
