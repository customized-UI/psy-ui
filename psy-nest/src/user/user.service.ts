import {
  Injectable,
  UseInterceptors,
  ClassSerializerInterceptor,
  Inject,
  forwardRef,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Groups } from './entities/groups.entity';
import { Histories } from './entities/history.eneity';
import { OtherHistories } from './entities/otherhistory.eneity';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Groups)
    private readonly groupsRepository: Repository<Groups>,
    @InjectRepository(Histories)
    private readonly historiesRepository: Repository<Histories>,
    @InjectRepository(OtherHistories)
    private readonly otherHistoriesRepository: Repository<OtherHistories>,
  ) {}

  

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({
      id: id,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async addGroup(params: { name: string, type: string }, userId) {
    if (!params.name) {
      throw new UnauthorizedException({
        code: '40003',
        message: '请输入组名'
      });
    }
    const userinfo = await this.userRepository.findOneBy({
      id: userId,
    })
    const data = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.groups', 'u')
      .where('user.id = :id', { id: userId })
      .getMany()
    let groupsArr = data[0]['groups']
    let G = new Groups()
    G.name = params.name
    G.type = params.type
    await this.groupsRepository.save(G)
    await groupsArr.push(G)
    userinfo.groups = await groupsArr
    let result = await this.userRepository.save(userinfo)
    return result.groups[result.groups.length - 1]
  }

  async editGroup(id, params: { name: string }) {
    if (!params.name) {
      throw new UnauthorizedException({
        code: '40003',
        message: '请输入组名'
      });
    }
    const groupData = await this.groupsRepository.findOne({ 
      where: {
        id: id
      }
    })
    groupData.name = params.name
    return this.groupsRepository.save(groupData)
  }

  async deleteGroup(id) {
    if (!id) {
      throw new UnauthorizedException({
        code: '40004',
        message: '请传入正确的id'
      });
    }
    const groupData = await this.groupsRepository.findOne({ 
      where: {
        id: id
      }
    })
    return this.groupsRepository.remove(groupData)
  }

  async addHistories(params: { role: string, message: string, groupsId: number }) {
    const groupsinfo = await this.groupsRepository.findOne({
      where: {
        id: params.groupsId
      }
    })
    const data = await this.groupsRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.histories', 'g')
      .where('group.id = :id', { id: params.groupsId })
      .getMany();
    let historiesArr = data[0]['histories']
    let H = new Histories()
    H.message = params.message
    H.role = params.role
    await historiesArr.push(H)
    await this.historiesRepository.save(H)
    groupsinfo.histories = await historiesArr
    await this.groupsRepository.save(groupsinfo)
    return
  }
//存储除了聊天之外的其他的历史记录
  async addOtherHistories(params: { role: string, title: string, type: string, content: string, grade: string, arraydata: any }, userId) {
    const userinfo = await this.userRepository.findOneBy({
      id: userId,
    })
    const data = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.otherHistories', 'u')
      .where('user.id = :id', { id: userId })
      .getMany()
    let ohArr = data[0]['otherHistories']
    let OH = new OtherHistories()
    OH.role = params.role
    OH.title = params.title
    OH.type = params.type
    OH.content = params.content
    OH.grade = params.grade
    OH.arraydata = params.arraydata
    await this.otherHistoriesRepository.save(OH)
    await ohArr.push(OH)
    userinfo.otherHistories = await ohArr
    let result = await this.userRepository.save(userinfo)
    return result.otherHistories[result.otherHistories.length - 1]
  }

  async findGroups(userId: number, type: string) {
    const groupsData = await this.groupsRepository
      .createQueryBuilder('groups')
      .where('groups.userId = :id', { id: userId })
      .andWhere('groups.type = :type', { type })
      .orderBy('groups.create_time', 'DESC')
      .getMany()
    return groupsData
  }

  async findHistories(groupsId: number) {
    const historyData = await this.historiesRepository
      .createQueryBuilder('histories')
      .where('histories.groupsId = :id', { id: groupsId })
      .orderBy('histories.create_time', 'DESC')
      .getMany()
    return historyData.reverse()
  }

  //查找除聊天以外的聊天记录,按type以及userId筛选
  async findOtherHistoriesList(userId: number, type: string) {
    const historyData = await this.otherHistoriesRepository
      .createQueryBuilder('other_histories')
      .where('other_histories.userId = :id', { id: userId })
      .andWhere('other_histories.type = :type', { type })
      .orderBy('other_histories.create_time', 'DESC')
      .getMany()
    return historyData
    // const data = await this.userRepository
    //   .createQueryBuilder('user')
    //   .leftJoinAndSelect('user.otherHistories', 'u')
    //   .where('user.id = :id', { id: userId })
    //   .andWhere('u.type = :type', { type: type })
    //   .getMany()
    // if (data.length && data[0]['otherHistories']) {
    //   return data[0]['otherHistories']
    // } else {
    //   return []
    // }
  }
  
}
