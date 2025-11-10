import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsBoolean,
  MinLength,
  MaxLength,
  IsNotEmpty,
  Matches,
  IsPhoneNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatus, UserType } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ description: 'Username (unique)', example: 'john.doe' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9._-]+$/, {
    message: 'Username can only contain letters, numbers, dots, underscores, and hyphens',
  })
  username: string;

  @ApiProperty({ description: 'Email address', example: 'john.doe@company.com' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  email: string;

  @ApiProperty({ description: 'Password', example: 'SecureP@ss123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain uppercase, lowercase, number, and special character',
  })
  password: string;

  @ApiProperty({ description: 'First name', example: 'John' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @ApiPropertyOptional({ description: 'Phone number', example: '+1234567890' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phoneNumber?: string;

  @ApiPropertyOptional({ description: 'Employee ID', example: 'EMP001' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  employeeId?: string;

  @ApiPropertyOptional({ description: 'User type', enum: UserType })
  @IsEnum(UserType)
  @IsOptional()
  userType?: UserType;

  @ApiPropertyOptional({ description: 'Department', example: 'IT' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  department?: string;

  @ApiPropertyOptional({ description: 'Designation', example: 'Manager' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  designation?: string;

  @ApiPropertyOptional({ description: 'Location', example: 'New York' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  location?: string;

  @ApiPropertyOptional({ description: 'Is system admin', default: false })
  @IsBoolean()
  @IsOptional()
  isSystemAdmin?: boolean;

  @ApiPropertyOptional({ description: 'Must change password on first login', default: true })
  @IsBoolean()
  @IsOptional()
  mustChangePassword?: boolean;

  @ApiPropertyOptional({ description: 'Role IDs to assign', type: [String] })
  @IsOptional()
  roleIds?: string[];
}
