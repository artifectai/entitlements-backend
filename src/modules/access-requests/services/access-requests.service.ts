import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AccessRequest } from '../../../models/access-request.model';
import { CreateAccessRequestDto } from '../dto/create-access-request.dto';
import { UpdateAccessRequestDto } from '../dto/update-access-request.dto';

@Injectable()
export class AccessRequestsService {
  constructor(
    @InjectModel(AccessRequest)
    private accessRequestModel: typeof AccessRequest,
  ) {}

  async create(createAccessRequestDto: CreateAccessRequestDto): Promise<AccessRequest> {
    const { user_id, dataset_id, frequency, requested_at, resolved_at } = createAccessRequestDto;
    
    const accessRequest = new AccessRequest({
        user_id,
        dataset_id,
        frequency,
        status: 'pending',
        requested_at: requested_at ? new Date(requested_at) : new Date(),
        resolved_at: resolved_at ? new Date(resolved_at) : null,
      });

    return accessRequest.save();
  }

  async findAll(): Promise<AccessRequest[]> {
    return this.accessRequestModel.findAll();
  }

  async findPendingRequests(): Promise<AccessRequest[]> {
    return this.accessRequestModel.findAll({ where: { status: 'pending' } });
  }

  async findOne(user_id: number, dataset_id: number, frequency: string): Promise<AccessRequest> {
    return this.accessRequestModel.findOne({ where: { user_id, dataset_id, frequency } });
  }

  async update(user_id: number, dataset_id: number, frequency: string, status: string, updateAccessRequestDto: UpdateAccessRequestDto): Promise<[number, AccessRequest[]]> {
    const [affectedCount, affectedRows] = await this.accessRequestModel.update(updateAccessRequestDto, {
        where: { user_id, dataset_id, frequency },
        returning: true,
      });
  
      if (affectedCount > 0) {
        const updatedAccessRequest = affectedRows[0];
        if (status) {
            updatedAccessRequest.status = status;
          }
        if (updateAccessRequestDto.resolved_at) {
            updatedAccessRequest.resolved_at = new Date(updateAccessRequestDto.resolved_at);
        }
        await updatedAccessRequest.save();
        return [affectedCount, [updatedAccessRequest]];
    }
  
      throw new Error('Access request not found');
}

  async remove(user_id: number, dataset_id: number, frequency: string): Promise<void> {
    const accessRequest = await this.findOne(user_id, dataset_id, frequency);
    if (accessRequest) {
        await accessRequest.destroy();
    }
  }
}
