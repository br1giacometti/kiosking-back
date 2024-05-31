import { AutoMap } from '@automapper/classes';
import { StockMovementDetail as IStockMovementDetailEntity } from '@prisma/client';
import StockMovementEntity from './StockMovementEntity';

class StockMovementDetailEntity implements IStockMovementDetailEntity {
  @AutoMap()
  stockMovementId: number;
  @AutoMap(() => StockMovementEntity)
  stockMovement: StockMovementEntity;
  @AutoMap()
  id: number;
  @AutoMap()
  productId: number;
  @AutoMap()
  buyPrice: number;
  @AutoMap()
  quantity: number;
}
export default StockMovementDetailEntity;
