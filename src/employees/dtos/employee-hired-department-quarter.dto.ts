import { ApiProperty } from '@nestjs/swagger';

export class EmployeeHiredByDeptartmentByQuarter {
  @ApiProperty({
    description: 'Department name',
    example: 'Staff',
    type: String,
  })
  department: string;

  @ApiProperty({
    description: 'Job title',
    example: 'Recruiter',
    type: String,
  })
  job: string;

  @ApiProperty({
    description: 'Quantity hired for Q1',
    example: 1,
    type: Number,
  })
  Q1: number;

  @ApiProperty({
    description: 'Quantity hired for Q2',
    example: 1,
    type: Number,
  })
  Q2: number;

  @ApiProperty({
    description: 'Quantity hired for Q3',
    example: 0,
    type: Number,
  })
  Q3: number;

  @ApiProperty({
    description: 'Quantity hired for Q4',
    example: 3,
    type: Number,
  })
  Q4: number;
}
