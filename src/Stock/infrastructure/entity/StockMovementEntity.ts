import { StockMovementType } from '@prisma/client';
import { StockMovement as IStockMovementEntity } from '@prisma/client';
import { AutoMap } from '@automapper/classes';
import StockMovementDetailEntity from './StockMovementDetailEntity';
import WarehouseEntity from './WarehouseEntity';
import UserEntity from 'Authentication/infrastructure/entity/UserEntity';
import FieldEntity from './FieldEntity';
import BatchEntity from './BatchEntity';

class StockMovementEntity implements IStockMovementEntity {
  @AutoMap()
  description: string;
  @AutoMap()
  voucherDescription: string;
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
  @AutoMap()
  movementType: StockMovementType;
  @AutoMap()
  date: Date;
  @AutoMap()
  fieldId: number;
  @AutoMap()
  batchId: number;
  @AutoMap(() => WarehouseEntity)
  warehouseOrigin: WarehouseEntity;
  @AutoMap(() => WarehouseEntity)
  warehouseDestiny: WarehouseEntity;
  @AutoMap(() => FieldEntity)
  field: FieldEntity;
  @AutoMap(() => BatchEntity)
  batch: BatchEntity;
  @AutoMap(() => StockMovementDetailEntity)
  stockMovementDetail: StockMovementDetailEntity[];
}

export default StockMovementEntity;
