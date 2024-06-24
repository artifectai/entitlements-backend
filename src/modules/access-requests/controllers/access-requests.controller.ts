import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AccessRequestsService } from '../services/access-requests.service';
import { CreateAccessRequestDto } from '../dto/create-access-request.dto';
import { UpdateAccessRequestDto } from '../dto/update-access-request.dto';

@Controller('access-requests')
export class AccessRequestsController {
  constructor(private readonly accessRequestsService: AccessRequestsService) {}

  @Post()
  create(@Body() createAccessRequestDto: CreateAccessRequestDto) {
    return this.accessRequestsService.create(createAccessRequestDto);
  }
  
  @Get()
  findAll() {
    return this.accessRequestsService.findAll();
  }

  @Get('/pending')
  findPendingRequests() {
    return this.accessRequestsService.findPendingRequests();
  }

  @Get(':userId/:datasetId/:frequencyId')
  findOne(
    @Param('userId') userId: string,
    @Param('datasetId') datasetId: string,
    @Param('frequencyId') frequencyId: string,
  ) {
    return this.accessRequestsService.findOne(userId, datasetId, frequencyId);
  }

  @Patch(':userId/:datasetId/:frequencyId')
  update(
    @Param('userId') userId: string,
    @Param('datasetId') datasetId: string,
    @Param('frequencyId') frequencyId: string,
    @Body() updateAccessRequestDto: UpdateAccessRequestDto,
  ) {
    return this.accessRequestsService.update(userId, datasetId, frequencyId, updateAccessRequestDto.status, updateAccessRequestDto);
  }

  @Patch('revoke/:userId/:datasetId/:frequencyId')
  revokeAccess(
    @Param('userId') userId: string,
    @Param('datasetId') datasetId: string,
    @Param('frequencyId') frequencyId: string,
  ) {
    return this.accessRequestsService.revokeAccess(userId, datasetId, frequencyId);
  }

  @Delete(':userId/:datasetId/:frequencyId')
  remove(
    @Param('userId') userId: string,
    @Param('datasetId') datasetId: string,
    @Param('frequencyId') frequencyId: string,
  ) {
    return this.accessRequestsService.remove(userId, datasetId, frequencyId);
  }
}
