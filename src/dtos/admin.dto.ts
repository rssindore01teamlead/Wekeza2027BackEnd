
import { IsEmail, IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class storeAlpacaDto {

  @IsNumber()
  @IsNotEmpty()
  user_id: string;
  @IsString({ groups: ['create'] })
  @IsNotEmpty()
  al_id: string;
  @IsString({ groups: ['create'] })
  @IsNotEmpty()
  al_account_number: string;
  @IsString({ groups: ['create'] })
  @IsNotEmpty()
  al_status: string;
  @IsString()
  @IsNotEmpty()
  al_crypto_status: string;
  @IsString()
  @IsNotEmpty()
  al_currency: string;
  @IsString()
  @IsNotEmpty()
  al_last_equity: string;
  @IsString()
  al_created_at: string;
}

export class AlpacaUserDto {

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

export class ChangePasswordDto {

  @IsString()
  user_id: string;

  @IsString()
  password: string;

  @IsString()
  newpassword: string;
}