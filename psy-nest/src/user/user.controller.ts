import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor,Req, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  // @Public()
  @Get('info')
  async findOne(@Req() request) {
    let req = await request.res.req.user
    return this.userService.findOne(+req.uid);
  }

  @Get('/groups/list')
  async findGroups(@Req() request, @Query() query: { type: string }) {
    let req = await request.res.req.user
    return this.userService.findGroups(req.uid, query.type)
  }

  @Get('histories/:groupsId')
  async findHistories(@Param('groupsId') groupsId: number) {
    return this.userService.findHistories(groupsId)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return 
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post('addgroup')//  /user/addgroup body: { name: '' }
  async addGroup(@Req() request, @Body() params: { name: string, type: string }) {
    let req = await request.res.req.user
    return this.userService.addGroup(params, req.uid)
  }

  @Patch('editgroup/:id') // /user/editgroup/:id
  async editGroup(@Param('id') id:number, @Body() params: { name: string }) {
    return this.userService.editGroup(id, params) 
  }

  @Delete('deletegroup/:id') // /user/deletegroup/:id
  async deleteGroup(@Param('id') id: number) {
    return this.userService.deleteGroup(id)
  }

  @Post('addhistories') // /user/addhistories body: { role: '', message: '' }
  async addHistories(@Body() params: { role: string, message: string, groupsId: number }) {
    return this.userService.addHistories(params)
  }

  @Post('addotherhistories')
  async addOtherHistories(@Req() request, @Body() params: { role: string, title: string, type: string, content: string, grade: string, arraydata: any }) {
    return this.userService.addOtherHistories(params, request.res.req.user.uid)
  }

  @Get('/otherhistories/list')
  async getOtherHistories(@Req() request, @Query() query: { type: string }) {
    return this.userService.findOtherHistoriesList(request.res.req.user.uid, query.type)
  }
  
}
