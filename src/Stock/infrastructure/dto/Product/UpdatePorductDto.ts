import { AutoMap } from '@automapper/classes';
import UpdatePorductSchema from 'Stock/infrastructure/schema/UpdatePorductSchema';
import { z } from 'zod';

export class UpdatePorductDto {
  @AutoMap()
  id: number;
  @AutoMap()
  description: string;
  @AutoMap()
  buyPrice: number;
  @AutoMap()
  createdAt: Date;
  @AutoMap()
  minimumQuantity: number;

  constructor(data: z.infer<typeof UpdatePorductSchema>) {
    Object.assign(this, data);
  }
}
