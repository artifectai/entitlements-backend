import { Injectable, NotFoundException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AccessRequest } from '../../../models/access-request.model';
import { CreateAccessRequestDto } from '../dto/create-access-request.dto';
import { UpdateAccessRequestDto } from '../dto/update-access-request.dto';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { Op } from 'sequelize';

interface CreateAccessRequestAttributes {
  userId: string;
  datasetId: string;
  frequencyId: string;
  status: string;
  requestedAt: Date;
  resolvedAt: Date | null;
  expiryDate: Date | null;
  isTemporary: boolean;
}

@Injectable()
export class AccessRequestsService {
  constructor(
    @InjectModel(AccessRequest)
    private accessRequestModel: typeof AccessRequest,
    private notificationsService: NotificationsService
  ) {}

  async create(createAccessRequestDto: CreateAccessRequestDto): Promise<AccessRequest> {
    const accessRequestData: CreateAccessRequestAttributes = {
      ...createAccessRequestDto,
      requestedAt: createAccessRequestDto.requestedAt ?? new Date(),
      resolvedAt: createAccessRequestDto.resolvedAt ?? null,
      expiryDate: createAccessRequestDto.expiryDate ?? null,
      isTemporary: createAccessRequestDto.isTemporary ?? false,
    };

    const existingRequest = await this.accessRequestModel.findOne({
      where: {
        userId: accessRequestData.userId,
        datasetId: accessRequestData.datasetId,
        frequencyId: accessRequestData.frequencyId,
      },
    });

    if (existingRequest) {
      throw new ConflictException('Access request already exists');
    }
    
    try {
      const accessRequest = await this.accessRequestModel.create(accessRequestData);
      await this.notificationsService.sendNotification({
        type: 'NEW_ACCESS_REQUEST',
        message: `New access request from user ${accessRequestData.userId} for dataset ${accessRequestData.datasetId} (${accessRequestData.frequencyId})`,
        accessRequest,
      });

      return accessRequest;
    } catch (error) {
      console.error('Error creating access request:', {
        message: error.message,
        stack: error.stack,
        details: error,
      });
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
    const accessRequest = await this.accessRequestModel.findOne({
      where: { userId, datasetId, frequencyId },
    });
    if (!accessRequest) {
      throw new NotFoundException('Access request not found');
    }
    return accessRequest;
  }

  async update(
    userId: string,
    datasetId: string,
    frequencyId: string,
    status: string,
    updateAccessRequestDto: UpdateAccessRequestDto
  ): Promise<AccessRequest> {
    const accessRequest = await this.findOne(userId, datasetId, frequencyId);

    if (!accessRequest) {
      throw new NotFoundException('Access request not found');
    }

    try {
      await accessRequest.update({ ...updateAccessRequestDto, status });
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
    const accessRequest = await this.findOne(userId, datasetId, frequencyId);
    if (accessRequest) {
      await accessRequest.destroy();
    } else {
      throw new NotFoundException('Access request not found');
    }
  }

  async revokeAccess(userId: string, datasetId: string, frequencyId: string): Promise<void> {
    const accessRequest = await this.findOne(userId, datasetId, frequencyId);
    if (accessRequest) {
      try {
        accessRequest.status = 'revoked';
        await accessRequest.save();

        await this.notificationsService.sendNotification({
          type: 'ACCESS_REVOKED',
          message: `Your access for dataset ${datasetId} and frequency ${frequencyId} has been revoked.`,
          accessRequest,
        });
      } catch (error) {
        console.error('Error revoking access:', error);
        throw new InternalServerErrorException('Failed to revoke access request');
      }
    } else {
      throw new NotFoundException('Access request not found');
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
        request.status = 'expired';
        await request.save();

        await this.notificationsService.sendNotification({
          type: 'ACCESS_EXPIRED',
          message: `Your temporary access for dataset ${request.datasetId} and frequency ${request.frequencyId} has expired.`,
          accessRequest: request,
        });
      }
    } catch (error) {
      console.error('Error checking expired access requests:', error);
      throw new InternalServerErrorException('Failed to check expired access requests');
    }
  }
}
