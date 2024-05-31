import User from 'Authentication/domain/models/User';
import StockMovementType from './StockMovementType';
import Warehouse from './Warehouse';
import { AutoMap } from '@automapper/classes';
import StockMovementDetail from './StockMovementDetail';

export default class StockMovement {
  @AutoMap()
  description: string;
  @AutoMap()
  value: number;
  @AutoMap()
  id?: number;
  @AutoMap()
  user: User;
  @AutoMap()
  warehouseOrigin?: Warehouse;
  @AutoMap()
  warehouseDestiny?: Warehouse;
  @AutoMap()
  MovementType: StockMovementType;
  @AutoMap()
  date: Date;
  @AutoMap(() => StockMovementDetail)
  stockMovementDetail: StockMovementDetail[];

  constructor(
    description: string,
    value: number,
    MovementType: StockMovementType,
    warehouseMovementsDetail: StockMovementDetail[],
    user: User,
    warehouseOrigin?: Warehouse,
    warehouseDestiny?: Warehouse,
    id?: number,
  ) {
    this.description = description;
    this.value = value;
    this.user = user;
    this.warehouseOrigin = warehouseOrigin;
    this.warehouseDestiny = warehouseDestiny;
    this.id = id;
    this.MovementType = MovementType;
    this.stockMovementDetail = warehouseMovementsDetail;
  }
}
