import { Table, Column, Model, DataType, ForeignKey, Index } from 'sequelize-typescript';
import { Dataset } from './dataset.model';
import { Frequency } from './frequency.model';
import { User } from './user.model';

@Table({
  tableName: 'access-requests',
  schema: 'public',
  timestamps: false, 
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'dataset_id', 'frequency_id'],
    },
  ]
})
export class AccessRequest extends Model<AccessRequest> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'user_id'
  })
  userId: string;

  @ForeignKey(() => Dataset)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'dataset_id'
  })
  datasetId: string;

  @ForeignKey(() => Frequency)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'frequency_id'
  })
  frequencyId: string;

  @Column({
    type: DataType.ENUM('pending', 'approved', 'rejected', 'expired', 'revoked'),
    allowNull: false
  })
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'revoked';

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'requested_at'
  })
  requestedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'resolved_at'
  })
  resolvedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'expiry_date'
  })
  expiryDate: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_temporary'
  })
  isTemporary: boolean;
}
