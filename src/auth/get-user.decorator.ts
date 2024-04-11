import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from './user.entity';

export const GetUser = createParamDecorator(
  (_, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    console.log('GetUser', req.user);
    return req.user;
  },
);
