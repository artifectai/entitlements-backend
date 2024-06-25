import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Dataset } from './dataset.model';

@Table({
  tableName: 'frequencies',
  schema: 'public',
  timestamps: true 
})
export class Frequency extends Model<Frequency> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Dataset)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'dataset_id'
  })
  datasetId: string;

  @BelongsTo(() => Dataset)
  dataset: Dataset;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  frequency: string;

  @Column({
    type: DataType.DECIMAL(20, 2),
    allowNull: true,
    field: 'market_cap_usd'
  })
  marketCapUsd: number;
}
