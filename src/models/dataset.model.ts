import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Frequency } from './frequency.model';
import { AccessRequest } from './access-request.model';

@Table({
  tableName: 'datasets',
  schema: 'public',
  timestamps: true
})
export class Dataset extends Model<Dataset> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  symbol: string;

  @HasMany(() => Frequency)
  frequencies: Frequency[];

  @HasMany(() => AccessRequest)
  accessRequests: AccessRequest[];
}
