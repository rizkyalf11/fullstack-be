import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const InjectDeleted = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    req.body.deleted_by = { id: req.user.id };

    return req.body;
  },
);
