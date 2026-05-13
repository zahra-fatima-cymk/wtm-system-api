import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from '../../models/user.model';
import { UserType, AccountStatus } from '../../common/enums';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return null;
    }

    const validatedUser = user.get({ plain: true }) as User & { password_hash?: string };
    const { password_hash, ...userWithoutPassword } = validatedUser;
    return userWithoutPassword as User;
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email, type: user.type };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterUserDto) {
    const createdUser = await this.usersService.create({
      ...registerDto,
      type: UserType.USER,
      status: AccountStatus.ACTIVE,
    });

    const result = createdUser.get({ plain: true }) as User & { password_hash?: string };
    const { password_hash, ...userWithoutPassword } = result;
    return userWithoutPassword as User;
  }
}
