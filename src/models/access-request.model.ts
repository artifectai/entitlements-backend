import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';
import { Dataset } from './dataset.model';

@Table({
  tableName: 'access_requests', 
  schema: 'public', 
  timestamps: false
})

export class AccessRequest extends Model<AccessRequest> {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Dataset)
  @Column
  datasetId: number;

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
    allowNull: false,
  })
  requested_at: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  resolved_at: Date | null;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Dataset)
  dataset: Dataset;
}
