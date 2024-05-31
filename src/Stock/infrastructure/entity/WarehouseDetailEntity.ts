import { AutoMap } from '@automapper/classes';
import Product from 'Stock/domain/models/Product';
import { WarehouseDetail as IWarehouseDetailEntity } from '@prisma/client';

class WarehouseDetailEntity implements IWarehouseDetailEntity {
  @AutoMap()
  id: number;
  @AutoMap()
  productId: number;
  @AutoMap(() => Product)
  product?: Product;
  @AutoMap()
  warehouseId: number;
  @AutoMap()
  quantity: number;
  @AutoMap()
  buyPrice: number;
  @AutoMap()
  lastUpdate: Date;
}
export default WarehouseDetailEntity;
