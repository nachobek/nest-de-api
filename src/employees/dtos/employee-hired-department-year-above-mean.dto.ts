import { ApiProperty } from '@nestjs/swagger';

export class EmployeeHiredByDeptartmentByYearAboveMean {
  @ApiProperty({
    description: 'Department id',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'Department name',
    example: 'Staff',
    type: String,
  })
  department: string;

  @ApiProperty({
    description: 'Quantity hired for the year',
    example: 45,
    type: Number,
  })
  hired: number;
}
