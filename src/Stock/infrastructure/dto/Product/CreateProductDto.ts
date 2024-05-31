import { AutoMap } from '@automapper/classes';
import CreatePorductSchema from '../../schema/CreatePorductSchema';
import { z } from 'zod';

export class CreateProductDto {
  @AutoMap()
  description: string;
  @AutoMap()
  buyPrice: number;
  @AutoMap()
  sellPrice: number;
  @AutoMap()
  createdAt: Date;
  @AutoMap()
  minimumQuantity?: number;

  constructor(data: z.infer<typeof CreatePorductSchema>) {
    Object.assign(this, data);
  }
}
