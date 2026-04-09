import { DeleteResult, Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./create-user.dto";

/*
 * @name: Kary
 * @Date: 2025-09-21 20:45:21
 * @Description: 
 */
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) { }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id })
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find()
  }

  add(createUserDto: CreateUserDto):Promise<User> {
    const user = new User();
    user.account = createUserDto.account;
    user.password = createUserDto.password;
    user.name = createUserDto.name || '新用户';
    return this.usersRepository.save(user);
  }

  remove(id: number):Promise<DeleteResult> {
   return this.usersRepository.delete(id)
  }

  findByAccount(account: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ account })
  }
}