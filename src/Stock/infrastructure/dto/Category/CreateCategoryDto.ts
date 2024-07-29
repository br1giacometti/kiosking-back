import { AutoMap } from '@automapper/classes';
import CreateBatchSchema from 'Stock/infrastructure/schema/CreateBatchSchema';
import { z } from 'zod';

export class CreateCategoryDto {
  @AutoMap()
  description: string;

  constructor(data: z.infer<typeof CreateBatchSchema>) {
    Object.assign(this, data);
  }
}
