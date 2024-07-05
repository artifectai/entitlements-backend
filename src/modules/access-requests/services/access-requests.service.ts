import { Injectable, NotFoundException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { AccessRequest } from '../../../models/access-request.model';
import { CreateAccessRequestDto } from '../dto/create-access-request.dto';
import { UpdateAccessRequestDto } from '../dto/update-access-request.dto';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { CreateAccessRequestAttributes, StatusEnum } from '../../../common/types'

@Injectable()
export class AccessRequestsService {
  constructor(
    @InjectModel(AccessRequest)
    private accessRequestModel: typeof AccessRequest,
    private notificationsService: NotificationsService
  ) {}

  async create(createAccessRequestDto: CreateAccessRequestDto & { userId: string }): Promise<AccessRequest> {
    const { userId, datasetId, frequencyId, ...rest } = createAccessRequestDto;

    const accessRequestData: CreateAccessRequestAttributes = {
      datasetId,
      frequencyId,
      userId,
      status: StatusEnum.PENDING,
      requestedAt: new Date(),
      resolvedAt: null,
      expiryDate: null,
      isTemporary: false,
    };

    const existingRequest = await this.accessRequestModel.findOne({
      where: {
        userId,
        datasetId,
        frequencyId
      },
    });

    if (existingRequest) {
      throw new ConflictException('Access request already exists');
    }
    
    try {
      const accessRequest = await this.accessRequestModel.create(accessRequestData);
      await this.notificationsService.sendNotification({
        type: 'NEW_ACCESS_REQUEST',
        message: `New access request from user ${userId} for dataset ${datasetId} (${frequencyId})`,
        accessRequest,
      });

      return accessRequest;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create access request');
    }
  }

  async findAll(): Promise<AccessRequest[]> {
    try {
      return await this.accessRequestModel.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve access requests');
    }
  }

  async findPendingRequests(): Promise<AccessRequest[]> {
    try {
      return await this.accessRequestModel.findAll({ where: { status: 'pending' } });
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve pending access requests');
    }
  }

  async findOne(userId: string, datasetId: string, frequencyId: string): Promise<AccessRequest> {
    try {
      const accessRequest = await this.accessRequestModel.findOne({
        where: { userId, datasetId, frequencyId },
      });
      if (!accessRequest) {
        throw new NotFoundException('Access request not found');
      }
      return accessRequest;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve access request');
    }
  }

  async update(
    userId: string,
    datasetId: string,
    frequencyId: string,
    status: StatusEnum,
    updateAccessRequestDto: UpdateAccessRequestDto
  ): Promise<AccessRequest> {
    try {
      const accessRequest = await this.findOne(userId, datasetId, frequencyId);

      if (!accessRequest) {
        throw new NotFoundException('Access request not found');
      }

      await accessRequest.update({
        ...updateAccessRequestDto,
        status: status,
        resolvedAt: status !== StatusEnum.PENDING ? new Date() : accessRequest.resolvedAt,
      });
      
      await this.notificationsService.sendNotification({
        type: 'ACCESS_REQUEST_UPDATED',
        message: `Your access request for dataset ${datasetId} and frequency ${frequencyId} has been ${status}.`,
        accessRequest,
      });

      return accessRequest;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update access request');
    }
  }

  async remove(userId: string, datasetId: string, frequencyId: string): Promise<void> {
    try {
      const accessRequest = await this.findOne(userId, datasetId, frequencyId);
      if (accessRequest) {
        await accessRequest.destroy();
      } else {
        throw new NotFoundException('Access request not found');
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to remove access request');
    }
  }

  async revokeAccess(userId: string, datasetId: string, frequencyId: string): Promise<void> {
    try {
      const accessRequest = await this.findOne(userId, datasetId, frequencyId);
      if (accessRequest) {
        accessRequest.status = StatusEnum.REVOKED;
        await accessRequest.save();

        await this.notificationsService.sendNotification({
          type: 'ACCESS_REVOKED',
          message: `Your access for dataset ${datasetId} and frequency ${frequencyId} has been revoked.`,
          accessRequest,
        });
      } else {
        throw new NotFoundException('Access request not found');
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to revoke access request');
    }
  }

  async checkExpiredAccessRequests(): Promise<void> {
    const now = new Date();
    try {
      const expiredRequests = await this.accessRequestModel.findAll({
        where: {
          expiryDate: { [Op.lt]: now },
          status: 'approved',
          isTemporary: true,
        },
      });

      for (const request of expiredRequests) {
        request.status = StatusEnum.EXPIRED;
        await request.save();

        await this.notificationsService.sendNotification({
          type: 'ACCESS_EXPIRED',
          message: `Your temporary access for dataset ${request.datasetId} and frequency ${request.frequencyId} has expired.`,
          accessRequest: request,
        });
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to check expired access requests');
    }
  }
}
