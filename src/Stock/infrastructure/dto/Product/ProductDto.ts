import { AutoMap } from '@automapper/classes';
import Category from 'Stock/domain/models/Category';
import WarehouseDetail from 'Stock/domain/models/WarehouseDetail';

export class ProductDto {
  @AutoMap()
  description: string;
  @AutoMap()
  sellPrice: number;
  @AutoMap()
  categoryId: number;

  @AutoMap()
  createdAt: Date;
  @AutoMap(() => Category)
  category?: Category;
  @AutoMap()
  barCode?: string;
  @AutoMap()
  warehousesIds?: number[];
  @AutoMap(() => WarehouseDetail)
  warehouses?: WarehouseDetail[];
}
