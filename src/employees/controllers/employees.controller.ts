import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { stringify } from 'csv-stringify/sync';
import { ApiStandardResponseDecorator } from 'src/common/decorators/api-standard-response.decorator';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';
import { EmployeeHiredByDeptartmentByQuarter } from '../dtos/employee-hired-department-quarter.dto';
import { EmployeeHiredByDeptartmentByYearAboveMean } from '../dtos/employee-hired-department-year-above-mean.dto';
import { EmployeesService } from '../services/employees.service';

@Controller('employees')
@ApiTags('employees')
@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get('hired-by-department-by-quarter')
  @ApiOperation({
    description:
      'Number of employees hired for each job and department in 2021 divided by quarter. Ordered alphabetically by department and job',
  })
  @ApiQuery({
    name: 'plainCsvResponse',
    description: 'If true, the response will be in plain text, csv-like format',
    type: Boolean,
    required: false,
    example: false,
  })
  @ApiStandardResponseDecorator({
    status: HttpStatus.OK,
    data: EmployeeHiredByDeptartmentByQuarter,
    isArray: true,
  })
  async getRequirementOne(@Query('plainCsvResponse') plainCsvResponse?: boolean) {
    const data = await this.employeesService.findAllEmployeesHiredByDeptartmentByQuarter();

    if (plainCsvResponse) {
      return stringify(data, { header: true });
    }

    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('hired-by-department-above-mean')
  @ApiOperation({
    description:
      'List of ids, name and number of employees hired of each department that hired more employees than the mean of employees hired in 2021 for all the departments, ordered by the number of employees hired (descending).',
  })
  @ApiQuery({
    name: 'plainCsvResponse',
    description: 'If true, the response will be in plain text, csv-like format',
    type: Boolean,
    required: false,
    example: false,
  })
  @ApiStandardResponseDecorator({
    status: HttpStatus.OK,
    data: EmployeeHiredByDeptartmentByYearAboveMean,
    isArray: true,
  })
  async getRequirementTwo(@Query('plainCsvResponse') plainCsvResponse?: boolean) {
    const data = await this.employeesService.findAllEmployeesHiredByDeptartmentByYearAboveMean();

    if (plainCsvResponse) {
      return stringify(data, { header: true });
    }

    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }
}
