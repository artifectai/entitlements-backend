import { Injectable, NotFoundException } from '@nestjs/common';
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
    const {
      userId,
      datasetId,
      frequencyId,
      status,
      requestedAt,
      resolvedAt,
      expiryDate,
      isTemporary,
    } = createAccessRequestDto;

    const accessRequestData: CreateAccessRequestAttributes = {
      userId,
      datasetId,
      frequencyId,
      status,
      requestedAt: requestedAt ?? new Date(),
      resolvedAt: resolvedAt ?? null,
      expiryDate: expiryDate ?? null,
      isTemporary: isTemporary ?? false,
    };

    const accessRequest = this.accessRequestModel.build(accessRequestData);
    const savedAccessRequest = await accessRequest.save();

    this.notificationsService.sendNotification({
      type: 'NEW_ACCESS_REQUEST',
      message: `New access request from user ${userId} for dataset ${datasetId} (${frequencyId})`,
      accessRequest: savedAccessRequest,
    });

    return savedAccessRequest;
  }

  async findAll(): Promise<AccessRequest[]> {
    return this.accessRequestModel.findAll();
  }

  async findPendingRequests(): Promise<AccessRequest[]> {
    return this.accessRequestModel.findAll({ where: { status: 'pending' } });
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
  ): Promise<[number, AccessRequest[]]> {
    const [affectedCount, affectedRows] = await this.accessRequestModel.update(updateAccessRequestDto, {
      where: { userId, datasetId, frequencyId },
      returning: true,
    });

    if (affectedCount > 0) {
      const updatedAccessRequest = affectedRows[0];
      if (status) {
        updatedAccessRequest.status = status;
      }
      if (updateAccessRequestDto.resolvedAt) {
        updatedAccessRequest.resolvedAt = new Date(updateAccessRequestDto.resolvedAt);
      }
      if (updateAccessRequestDto.expiryDate) {
        updatedAccessRequest.expiryDate = new Date(updateAccessRequestDto.expiryDate);
      }
      if (typeof updateAccessRequestDto.isTemporary !== 'undefined') {
        updatedAccessRequest.isTemporary = updateAccessRequestDto.isTemporary;
      }
      await updatedAccessRequest.save();

      this.notificationsService.sendNotification({
        type: 'ACCESS_REQUEST_UPDATED',
        message: `Your access request for dataset ${datasetId} and frequency ${frequencyId} has been ${status}.`,
        accessRequest: updatedAccessRequest,
      });

      return [affectedCount, [updatedAccessRequest]];
    }

    throw new NotFoundException('Access request not found');
  }

  async remove(userId: string, datasetId: string, frequencyId: string): Promise<void> {
    const accessRequest = await this.findOne(userId, datasetId, frequencyId);
    if (accessRequest) {
      await accessRequest.destroy();
    }
  }

  async revokeAccess(userId: string, datasetId: string, frequencyId: string): Promise<void> {
    const accessRequest = await this.findOne(userId, datasetId, frequencyId);
    if (accessRequest) {
      accessRequest.status = 'revoked';
      await accessRequest.save();

      this.notificationsService.sendNotification({
        type: 'ACCESS_REVOKED',
        message: `Your access for dataset ${datasetId} and frequency ${frequencyId} has been revoked.`,
        accessRequest,
      });
    } else {
      throw new NotFoundException('Access request not found');
    }
  }

  async checkExpiredAccessRequests(): Promise<void> {
    const now = new Date();
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

      this.notificationsService.sendNotification({
        type: 'ACCESS_EXPIRED',
        message: `Your temporary access for dataset ${request.datasetId} and frequency ${request.frequencyId} has expired.`,
        accessRequest: request,
      });
    }
  }
}
