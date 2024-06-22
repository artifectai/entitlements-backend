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

  @Get(':user_id/:dataset_id/:frequency')
  findOne(
    @Param('user_id') user_id: number,
    @Param('dataset_id') dataset_id: number,
    @Param('frequency') frequency: string,
  ) {
    return this.accessRequestsService.findOne(user_id, dataset_id, frequency);
  }

  @Patch(':user_id/:dataset_id/:frequency')
  update(
    @Param('user_id') user_id: number,
    @Param('dataset_id') dataset_id: number,
    @Param('frequency') frequency: string,
    @Param('status') status: string,
    @Body() updateAccessRequestDto: UpdateAccessRequestDto,
  ) {
    return this.accessRequestsService.update(user_id, dataset_id, frequency, status, updateAccessRequestDto);
  }

  @Patch('revoke/:user_id/:dataset_id/:frequency')
  revokeAccess(
    @Param('user_id') user_id: number,
    @Param('dataset_id') dataset_id: number,
    @Param('frequency') frequency: string,
  ) {
    return this.accessRequestsService.revokeAccess(user_id, dataset_id, frequency);
  }

  @Delete(':user_id/:dataset_id/:frequency')
  remove(
    @Param('user_id') user_id: number,
    @Param('dataset_id') dataset_id: number,
    @Param('frequency') frequency: string,
  ) {
    return this.accessRequestsService.remove(user_id, dataset_id, frequency);
  }
  
}