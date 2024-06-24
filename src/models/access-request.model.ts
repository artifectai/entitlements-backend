import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';
import { Dataset } from './dataset.model';

@Table({
  tableName: 'access_requests', 
  schema: 'public', 
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'dataset_id', 'frequency'],
    },
  ]
})

export class AccessRequest extends Model<AccessRequest> {
  @ForeignKey(() => User)
  @Column
  user_id: number;

  @ForeignKey(() => Dataset)
  @Column
  dataset_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  frequency: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  requested_at: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  resolved_at: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  expiry_date: Date | null;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  is_temporary: boolean;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Dataset)
  dataset: Dataset;
}
