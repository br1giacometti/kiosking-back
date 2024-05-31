import { AutoMap } from '@automapper/classes';
// import Warehouse from './Warehouse';
import WarehouseDetail from './WarehouseDetail';

export default class Product {
  @AutoMap()
  id: number;
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
  @AutoMap(() => WarehouseDetail)
  warehouses?: WarehouseDetail[];
  @AutoMap()
  warehousesIds?: number[];

  constructor(
    description: string,
    buyPrice: number,
    sellPrice: number,
    warehouses?: WarehouseDetail[],
    minimumQuantity?: number,
    id?: number,
    createdAt?: Date,
    warehousesIds?: number[],
  ) {
    this.id = id;
    this.description = description;
    this.buyPrice = buyPrice;
    this.sellPrice = sellPrice;
    this.createdAt = createdAt;
    this.minimumQuantity = minimumQuantity;
    this.warehouses = warehouses;
    this.warehousesIds = warehousesIds;
  }
}
