/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Post, Req, Get } from '@nestjs/common';
import { WxpayService } from './wxpay.service';
import { Public } from 'src/common/decorators/public.decorator';
import { request } from 'http';

@Controller('pay')
export class WxpayController {
    constructor(private readonly wxpayService: WxpayService) { }
    
    @Post('/create-order') // /pay/create-order
    async createOrder(@Req() request, @Body() params: { amount, duration, description }) {
        let req = await request.res.req.user
        return this.wxpayService.createOrder(params.amount, params.duration, params.description, req.uid)
    }

    @Post('/get-paycode') // /pay/get-paycode
    async createPay(@Body() params: {orderId, amount, description}) {
        return this.wxpayService.createPay(params.orderId,params.amount,params.description)
    }

    @Post('check-pay')
    async checkCode(@Req() request, @Body() params: { orderId, duration }) {
        let req = await request.res.req.user
        return this.wxpayService.checkOrder(req.uid, params.orderId, params.duration)
    }

    @Public()
    @Post('pay-cb')
    async payCaller(@Req() request) {
        return this.wxpayService.payCaller(request)
    }

    @Get('/notify')
    async getCaller() {
        return this.wxpayService.getCaller()
    }

    @Post('finish-pay')
    async finishPay(@Req() request, @Body() params: { duration }) { 
        let req = await request.res.req.user
        return this.wxpayService.finishPay(req.id, params.duration)
    }

    @Public()
    @Post('set-m')
    async setM(@Body() params: { uid, duration }) {
        return this.wxpayService.finishPay(params.uid, params.duration)
    }
}
