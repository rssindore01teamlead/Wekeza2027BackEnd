import { IsDate, IsEmail, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {

  @IsString({ groups: ['update', 'create'] })
  @IsNotEmpty()
  fname: string;

  @IsString({ groups: ['update', 'create'] })
  @IsNotEmpty()
  lname: string;

  @IsString({ groups: ['create'] })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdateUserDto {

  @IsNotEmpty()
  user_id: number;

  // @IsString({ groups: ['create'] })
  // @IsNotEmpty()
  // fname: string;

  // @IsString({ groups: ['create'] })
  // @IsNotEmpty()
  // lname: string;

  // @IsString({ groups: ['update', 'create'] })
  // @IsNotEmpty()
  // @IsEmail()
  // email: string;

  // @IsString()
  // @IsNotEmpty()
  // password: string;

}

export class loginUserDto {

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class mailDto {

  @IsInt()
  id: number;

  @IsEmail()
  toemail: string;

  @IsString()
  message: string;

  @IsString()
  subject: string;
}

export class laneDto {

  lane_id: number;

  @IsInt()
  user_id: number;

  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsString()
  media: string;

  // @IsDate()
  add_date: Date;
}

export class storeTrendingDto {

  @IsOptional()
  id: number;

  @IsString({ groups: ['create'] })
  symbol: string;

  @IsString({ groups: ['create'] })
  stock_name: string;

  @IsString({ groups: ['create'] })
  created_at: Date;
}

export class resetPasswordDto {

  @IsString()
  user_id: string;

  @IsString()
  password: string;

  @IsString()
  token_id: string;
}

export class contactUsDto {

  @IsString()
  fullname

  @IsString()
  company_name

  @IsEmail()
  email

  @IsString()
  phone

  @IsString()
  message

}

export class ChangePasswordDto {

  @IsString()
  user_id: string;

  @IsString()
  password: string;

  @IsString()
  newpassword: string;
}
