import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const InjectBulkCreatedBy = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    console.log(req.body);
    console.log(req.user.id);

    const tes = req.body.data.map((item) => {
      return { ...item, created_by: { id: req.user.id } };
    });

    console.log(tes);

    req.body.data = tes;

    return req.body;
  },
);
