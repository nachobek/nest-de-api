import { Controller, HttpStatus, Logger, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiStandardResponseDecorator } from 'src/common/decorators/api-standard-response.decorator';
import ResponseMessages from 'src/common/enums/response-messages.enum';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';
import { SyncService } from '../services/sync.service';

@Controller('sync')
@ApiTags('sync')
@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post()
  @ApiOperation({ description: 'Triggers a manual load of the history data' })
  @ApiStandardResponseDecorator({
    status: HttpStatus.OK,
    message: ResponseMessages.MANUAL_LOAD_TRIGGERED,
  })
  async loadHistoryData() {
    Logger.log(ResponseMessages.MANUAL_LOAD_TRIGGERED, this.constructor.name);

    this.syncService
      .generalLoad()
      .then(() => {
        Logger.log(ResponseMessages.MANUAL_LOAD_SUCCESS, this.constructor.name);
      })
      .catch(() => {
        Logger.error(ResponseMessages.MANUAL_LOAD_ERROR, this.constructor.name);
      });

    return {
      statusCode: HttpStatus.OK,
      message: ResponseMessages.MANUAL_LOAD_TRIGGERED,
    };
  }
}
