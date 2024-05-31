import { AutoMap } from '@automapper/classes';
import StockMovement from './StockMovement';

export default class StockMovementDetail {
  @AutoMap()
  id?: number;
  @AutoMap()
  productId: number;
  @AutoMap()
  quantity: number;
  @AutoMap()
  buyPrice: number;
  @AutoMap()
  stockMovementId: number;
  @AutoMap(() => StockMovement)
  stockMovement: StockMovement;

  constructor(
    quantity: number,
    productId: number,
    stockMovementId: number,
    buyPrice: number,
    id?: number,
  ) {
    this.quantity = quantity;
    this.id = id;
    this.productId = productId;
    this.buyPrice = buyPrice;
    this.stockMovementId = stockMovementId;
  }
}
