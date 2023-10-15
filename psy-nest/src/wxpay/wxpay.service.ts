/*
https://docs.nestjs.com/providers#services
*/

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import WxPay from 'wechatpay-node-v3';
import { WECHAT_PAY_MANAGER } from 'nest-wechatpay-node-v3';
import CodeInfo from 'config/code';
import { Order } from 'src/user/entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { toDataURL } from 'qrcode'

@Injectable()
export class WxpayService {
    private resultData: any = {};
    constructor(
        @Inject(WECHAT_PAY_MANAGER) private wxPay: WxPay,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }
    private async generateRandomOrderNumber(): Promise<string> {
        // 生成随机的商户订单号
        const characters =
          '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-*';
        let result = '';
        let isCodeUnique = false;
        while (!isCodeUnique) {
            for (let i = 0; i < 32; i++) {
                result += characters.charAt(
                  Math.floor(Math.random() * characters.length),
                );
            }
            const existingCode = await this.orderRepository.findOneBy({
              orderId: result,
            });
      
            isCodeUnique = !existingCode;
          }
        
        return result;
      }
    async createOrder(amount, duration, description, uid) {
        const userinfo = await this.userRepository.findOneBy({
            id: uid,
        })
        const data = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.orders', 'u')
        .where('user.id = :id', { id: uid })
            .getMany()
        let ordersArr = data[0]['orders']
        let orderId = await this.generateRandomOrderNumber()
        let O = new Order()
        O.money = await +amount * 100
        O.orderId = await orderId
        O.duration = await duration
        await this.orderRepository.save(O)
        await ordersArr.push(O)
        userinfo.orders = await ordersArr
        await this.userRepository.save(userinfo)
        return this.createPay(orderId, amount, description)
    }
    
    async createPay(orderId, amount, description) {
        const order = {
            out_trade_no: orderId,
            description: description,
            notify_url: "https://psy.callable.cc/api/pay/pay-cb",
            amount: {
                total: +amount * 100,
                currency: 'CNY'
            }
        }
        const pay = await this.wxPay.transactions_native(order)
        if (pay.code) {
            switch (pay.code) {
                case 'PARAM_ERROR':
                    throw new UnauthorizedException({
                        code: '40008',
                        message: CodeInfo['40008']
                    });
                case 'ORDER_CLOSED':
                    throw new UnauthorizedException({
                        code: '40009',
                        message: CodeInfo['40009']
                    });
                case 'RULELIMIT':
                    throw new UnauthorizedException({
                        code: '40010',
                        message: CodeInfo['40010']
                    });
                case 'INVALID_REQUEST':
                    throw new UnauthorizedException({
                        code: '40011',
                        message: CodeInfo['40011']
                    });
            }
        }
        let qrcode = await toDataURL(pay.code_url)
        return {qrcode, orderId}
    }

    async checkOrder(uid, orderId, duration) {
        const check = await this.wxPay.query({ out_trade_no: orderId })
        const orderData = await this.orderRepository.findOne({ where: { orderId } })
        const userData = await this.userRepository.findOne({ where: { id: uid } })
        if (check['trade_state'] == 'SUCCESS') {
                const nowTime = !userData.memberTime ? new Date() : userData.memberTime
                // const day = orderData.duration == 'monthly' ? 31 : orderData.duration == 'yearly' ? 365 : 93
                nowTime.setDate(+nowTime.getDate() + +duration)
                userData.memberTime = nowTime
                await this.userRepository.save(userData)
        }
        return {
            code: check['trade_state'] == 'SUCCESS' ? 200 : 40012,
            msg: check['trade_state_desc']
        }
    }

    async payCaller(result) {
        this.resultData = result['body']
        // console.log(result['body'])
        if (!result['body']['id']) {
            throw new UnauthorizedException({
                code: 'FAIL',
                message: '失败'
            })
        } else {
        throw  new UnauthorizedException({
            code: 'SUCCESS'
        })
        }
        // return result
    }

    async getCaller() {
        return this.resultData
    }

    async finishPay(uid, duration) {
        const userData = await this.userRepository.findOne({ where: { id: uid } })
        const nowTime = !userData.memberTime ? new Date() : userData.memberTime > new Date() ? userData.memberTime : new Date()
        nowTime.setDate(+nowTime.getDate() + +duration)
        userData.memberTime = nowTime
        await this.userRepository.save(userData)
        this.resultData = {}
        return true
    }
    async upgradeMembership(uid, duration: string): Promise<User> {
        const user = await this.userRepository.findOne(uid);
        if (!user) {
          throw new Error('User not found');
        }
    
        const expirationDate = this.calculateExpirationDate(user.memberTime, duration);
        user.memberTime = expirationDate;
        return this.userRepository.save(user);
      }
    
      private calculateExpirationDate(currentExpiration: Date, duration: string): Date {
        const expiration = new Date(currentExpiration);
        switch (duration) {
          case 'monthly':
            expiration.setMonth(expiration.getMonth() + 1);
            break;
          case 'quarterly':
            expiration.setMonth(expiration.getMonth() + 3);
            break;
          case 'yearly':
            expiration.setFullYear(expiration.getFullYear() + 1);
            break;
          default:
            throw new Error('Invalid duration');
        }
        return expiration;
      }
}
