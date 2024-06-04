import { AutoMap } from '@automapper/classes';
import WarehouseDetail from 'Stock/domain/models/WarehouseDetail';

export class ProductDto {
  @AutoMap()
  id: number;
  @AutoMap()
  description: string;
  @AutoMap()
  buyPrice: number;
  @AutoMap()
  createdAt: Date;
  @AutoMap()
  minimumQuantity?: number;
  @AutoMap()
  warehousesIds?: number[];
  @AutoMap(() => WarehouseDetail)
  warehouses?: WarehouseDetail[];
}
