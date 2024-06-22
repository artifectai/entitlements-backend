import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { AccessRequest } from '../models/access-request.model';

@Table({
    tableName: 'datasets', 
    schema: 'public',  
    timestamps: false
})
export class Dataset extends Model<Dataset> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  symbol: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  frequency: string;

  @HasMany(() => AccessRequest)
  accessRequests: AccessRequest[];
}
