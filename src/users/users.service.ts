import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { AccountStatus, UserType } from '../common/enums';
import { User } from '../models/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const password_hash = await bcrypt.hash(createUserDto.password, 10);

    return this.userModel.create({
      ...createUserDto,
      type: createUserDto.type ?? UserType.USER,
      status: createUserDto.status ?? AccountStatus.ACTIVE,
      email_verified: createUserDto.email_verified ?? false,
      password_hash,
    });
  }

  findAll() {
    return this.userModel.findAll({
      attributes: { exclude: ['password_hash'] },
    });
  }

  findOne(id: number) {
    return this.userModel.findByPk(id, {
      attributes: { exclude: ['password_hash'] },
    });
  }

  findByEmail(email: string) {
    return this.userModel.findOne({
      where: { email },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updatePayload: Partial<UpdateUserDto & { password_hash?: string }> = {
      ...updateUserDto,
    };

    if (updateUserDto.password) {
      updatePayload.password_hash = await bcrypt.hash(updateUserDto.password, 10);
      delete updatePayload.password;
    }

    await this.userModel.update(updatePayload, {
      where: { id },
    });

    return this.findOne(id);
  }

  remove(id: number) {
    return this.userModel.destroy({
      where: { id },
    });
  }
}
