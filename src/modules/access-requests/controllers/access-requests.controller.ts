import { Controller, Get, Post, Body, Patch, Param, Delete, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { AccessRequestsService } from '../services/access-requests.service';
import { CreateAccessRequestDto } from '../dto/create-access-request.dto';
import { UpdateAccessRequestDto } from '../dto/update-access-request.dto';
import { StatusEnum } from '../../../common/types'

@Controller('access-requests')
export class AccessRequestsController {
  constructor(private readonly accessRequestsService: AccessRequestsService) {}

  @Post()
  async create(@Body() createAccessRequestDto: CreateAccessRequestDto) {
    try {
      return await this.accessRequestsService.create(createAccessRequestDto);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create access request');
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.accessRequestsService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve access requests');
    }
  }

  @Get('/pending')
  async findPendingRequests() {
    try {
      return await this.accessRequestsService.findPendingRequests();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve pending access requests');
    }
  }

  @Get(':userId/:datasetId/:frequencyId')
  async findOne(
    @Param('userId') userId: string,
    @Param('datasetId') datasetId: string,
    @Param('frequencyId') frequencyId: string,
  ) {
    try {
      return await this.accessRequestsService.findOne(userId, datasetId, frequencyId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve access request');
    }
  }

  @Patch(':userId/:datasetId/:frequencyId')
  async update(
    @Param('userId') userId: string,
    @Param('datasetId') datasetId: string,
    @Param('frequencyId') frequencyId: string,
    @Body() updateAccessRequestDto: UpdateAccessRequestDto,
  ) {
    try {
      const status = StatusEnum[updateAccessRequestDto.status.toUpperCase() as keyof typeof StatusEnum];
      return await this.accessRequestsService.update(userId, datasetId, frequencyId, status, updateAccessRequestDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update access request');
    }
  }

  @Patch('revoke/:userId/:datasetId/:frequencyId')
  async revokeAccess(
    @Param('userId') userId: string,
    @Param('datasetId') datasetId: string,
    @Param('frequencyId') frequencyId: string,
  ) {
    try {
      return await this.accessRequestsService.revokeAccess(userId, datasetId, frequencyId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to revoke access request');
    }
  }

  @Delete(':userId/:datasetId/:frequencyId')
  async remove(
    @Param('userId') userId: string,
    @Param('datasetId') datasetId: string,
    @Param('frequencyId') frequencyId: string,
  ) {
    try {
      return await this.accessRequestsService.remove(userId, datasetId, frequencyId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to remove access request');
    }
  }
}
