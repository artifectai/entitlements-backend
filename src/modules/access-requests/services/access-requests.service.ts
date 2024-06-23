import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AccessRequest } from '../../../models/access-request.model';
import { CreateAccessRequestDto } from '../dto/create-access-request.dto';
import { UpdateAccessRequestDto } from '../dto/update-access-request.dto';
import { NotificationsService } from 'src/modules/notifications/services/notifications.service';
import { Op } from 'sequelize';

@Injectable()
export class AccessRequestsService {
  constructor(
    @InjectModel(AccessRequest)
    private accessRequestModel: typeof AccessRequest,
    private notificationsService: NotificationsService
  ) {}

  async create(createAccessRequestDto: CreateAccessRequestDto): Promise<AccessRequest> {
    const { user_id, dataset_id, frequency, requested_at, resolved_at, expiry_date, is_temporary } = createAccessRequestDto;
    
    const accessRequest = new AccessRequest({
        user_id,
        dataset_id,
        frequency,
        status: 'pending',
        requested_at: requested_at ? new Date(requested_at) : new Date(),
        resolved_at: resolved_at ? new Date(resolved_at) : null,
        expiry_date: expiry_date ? new Date(expiry_date) : null,
        is_temporary: is_temporary ?? false,
      });

    const savedAccessRequest = await accessRequest.save();

    this.notificationsService.sendNotification({
      type: 'NEW_ACCESS_REQUEST',
      message: `New access request from user ${user_id} for dataset ${dataset_id} (${frequency})`,
      accessRequest: savedAccessRequest
    });

    return savedAccessRequest;
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
        if (updateAccessRequestDto.expiry_date) {
            updatedAccessRequest.expiry_date = new Date(updateAccessRequestDto.expiry_date);
        }
        if (typeof updateAccessRequestDto.is_temporary !== 'undefined') {
        updatedAccessRequest.is_temporary = updateAccessRequestDto.is_temporary;
        }
        await updatedAccessRequest.save();

        this.notificationsService.sendNotification({
          type: 'ACCESS_REQUEST_UPDATED',
          message: `Your access request for dataset ${dataset_id} and frequency ${frequency} has been ${status}.`,
          accessRequest: updatedAccessRequest
        });
        console.log('Notification sent:', {
            type: 'ACCESS_REQUEST_UPDATED',
            message: `Your access request for dataset ${dataset_id} and frequency ${frequency} has been ${status}.`,
            accessRequest: updatedAccessRequest
          });


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

  async revokeAccess(user_id: number, dataset_id: number, frequency: string): Promise<void> {
    const accessRequest = await this.findOne(user_id, dataset_id, frequency);
    if (accessRequest) {
        accessRequest.status = 'revoked';
        await accessRequest.save();

        this.notificationsService.sendNotification({
          type: 'ACCESS_REVOKED',
          message: `Your access for dataset ${dataset_id} and frequency ${frequency} has been revoked.`,
          accessRequest
        });

    } else {
        throw new NotFoundException('Access request not found');
    }
  }

  async checkExpiredAccessRequests(): Promise<void> {
    const now = new Date();
    const expiredRequests = await this.accessRequestModel.findAll({
        where: {
        expiry_date: { [Op.lt]: now },
        status: 'approved',
        is_temporary: true,
        }
    });

    for (const request of expiredRequests) {
        request.status = 'expired';
        await request.save();

        this.notificationsService.sendNotification({
          type: 'ACCESS_EXPIRED',
          message: `Your temporary access for dataset ${request.dataset_id} and frequency ${request.frequency} has expired.`,
          accessRequest: request
        });
    }
  }
}

