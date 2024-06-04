import { AutoMap } from '@automapper/classes';
import { Product as IProductEntity } from '@prisma/client';
import WarehouseDetailEntity from './WarehouseDetailEntity';

class ProductEntity implements IProductEntity {
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
  @AutoMap(() => WarehouseDetailEntity)
  warehouses: WarehouseDetailEntity[];
  @AutoMap()
  warehousesIds?: number[];
}

export default ProductEntity;
