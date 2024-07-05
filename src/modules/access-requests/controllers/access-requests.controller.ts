import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { AccessRequestsService } from '../services/access-requests.service';
import { CreateAccessRequestDto } from '../dto/create-access-request.dto';
import { UpdateAccessRequestDto } from '../dto/update-access-request.dto';
import { StatusEnum } from '../../../common/types'
import { Roles } from '../../../common/auth/auth.decorator'

@Controller('access-requests')
export class AccessRequestsController {
  constructor(private readonly accessRequestsService: AccessRequestsService) {}

  @Post()
  @Roles('Quant')
  async create(@Body() createAccessRequestDto: CreateAccessRequestDto, @Req() req) {
    const userId = req.user.sub; 
    return await this.accessRequestsService.create({ ...createAccessRequestDto, userId });
  }

  @Get()
  @Roles('Ops')
  async findAll() {
    return await this.accessRequestsService.findAll();
  }

  @Get('/pending')
  @Roles('Ops', 'Quant')
  async findPendingRequests() {
    return await this.accessRequestsService.findPendingRequests();
  }

  @Get(':userId/:datasetId/:frequencyId')
  @Roles('Ops')
  async findOne(
    @Param('userId') userId: string,
    @Param('datasetId') datasetId: string,
    @Param('frequencyId') frequencyId: string,
  ) {
    return await this.accessRequestsService.findOne(userId, datasetId, frequencyId);
  }

  @Patch(':userId/:datasetId/:frequencyId')
  @Roles('Ops')
  async update(
    @Param('userId') userId: string,
    @Param('datasetId') datasetId: string,
    @Param('frequencyId') frequencyId: string,
    @Body() updateAccessRequestDto: UpdateAccessRequestDto,
  ) {
      const status = StatusEnum[updateAccessRequestDto.status.toUpperCase() as keyof typeof StatusEnum];
      return await this.accessRequestsService.update(userId, datasetId, frequencyId, status, updateAccessRequestDto);
  }

  @Patch('revoke/:userId/:datasetId/:frequencyId')
  @Roles('Ops')
  async revokeAccess(
    @Param('userId') userId: string,
    @Param('datasetId') datasetId: string,
    @Param('frequencyId') frequencyId: string,
  ) {
      return await this.accessRequestsService.revokeAccess(userId, datasetId, frequencyId);
  }

  @Delete(':userId/:datasetId/:frequencyId')
  @Roles('Ops')
  async remove(
    @Param('userId') userId: string,
    @Param('datasetId') datasetId: string,
    @Param('frequencyId') frequencyId: string,
  ) {
      return await this.accessRequestsService.remove(userId, datasetId, frequencyId);
  }
}
