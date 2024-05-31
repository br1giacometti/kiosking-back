import { StockMovementType } from '@prisma/client';
import { StockMovement as IStockMovementEntity } from '@prisma/client';
import { AutoMap } from '@automapper/classes';
import StockMovementDetailEntity from './StockMovementDetailEntity';
import WarehouseEntity from './WarehouseEntity';
import UserEntity from 'Authentication/infrastructure/entity/UserEntity';

class StockMovementEntity implements IStockMovementEntity {
  @AutoMap()
  description: string;
  @AutoMap()
  createdAt: Date;
  @AutoMap()
  userId: string;
  @AutoMap()
  value: number;
  @AutoMap()
  id: number;
  @AutoMap()
  user: UserEntity;
  @AutoMap()
  warehouseDestinyId: number;
  @AutoMap()
  warehouseOriginId: number;
  @AutoMap(() => WarehouseEntity)
  warehouseOrigin: WarehouseEntity;
  @AutoMap(() => WarehouseEntity)
  warehouseDestiny: WarehouseEntity;
  @AutoMap()
  movementType: StockMovementType;
  @AutoMap()
  date: Date;
  @AutoMap(() => StockMovementDetailEntity)
  stockMovementDetail: StockMovementDetailEntity[];
}

export default StockMovementEntity;
