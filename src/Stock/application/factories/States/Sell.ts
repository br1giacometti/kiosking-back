import WarehouseService from 'Stock/application/service/WarehouseService';
import { CreateStockMovementDto } from 'Stock/infrastructure/dto/StockMovement/CreateStockMovementDto';
import { AbstractStockMovement } from './AbstractStockMovement';
import StockMovement from 'Stock/domain/models/StockMovement';
import WarehouseDetailService from 'Stock/application/service/WarehouseDetailService';
import WarehouseValidations from 'Stock/application/validations/WarehouseValidations';
import WarehouseDetail from 'Stock/domain/models/WarehouseDetail';
import ProductNotFoundToSellException from 'Stock/application/exception/ProductNotFoundToSellException';
import InsufficientQuantityException from 'Stock/application/exception/InsufficientQuantityException';
import AfipService from 'Stock/application/service/AfipService';

export class Sell extends AbstractStockMovement {
  warehouseDetailItems: WarehouseDetail[] = [];
  constructor(
    private readonly createStockMovementDto: CreateStockMovementDto,
    private readonly warehouseService: WarehouseService,
    private readonly warehouseDetailService: WarehouseDetailService,
    private readonly warehouseValidations: WarehouseValidations,
    private readonly AfipService: AfipService,
  ) {
    super(createStockMovementDto);
  }

  public async generateMovement(): Promise<StockMovement> {
    const warehouseOrigin = await this.warehouseService.findWarehouseById(
      this.createStockMovementDto.warehouseOriginId,
    );

    this.warehouseValidations.validateExistingWarehouse(warehouseOrigin);

    if (this.createStockMovementDto.wasFactured) {
      await this.AfipService.generarFacturaB(
        5,
        this.createStockMovementDto.value,
      );
    }

    return new StockMovement(
      this.createStockMovementDto.description,
      this.createStockMovementDto.value,
      this.createStockMovementDto.movementType,
      this.createStockMovementDto.stockMovementDetail,
      this.createStockMovementDto.user,
      this.createStockMovementDto.wasFactured,
      this.createStockMovementDto.factureLink,
      'VENTA',
      warehouseOrigin,
      null,
    );
  }

  async validateProductsInWarehouseDetail() {
    const stockMovementDetails =
      this.createStockMovementDto.stockMovementDetail;
    this.warehouseDetailItems =
      await this.warehouseDetailService.findManyByWarehouseId(
        this.createStockMovementDto.warehouseOriginId,
      );

    for (const stockDetail of stockMovementDetails) {
      const matchingWarehouseDetail = this.warehouseDetailItems.find(
        (detail) => detail.productId === stockDetail.productId,
      );

      if (!matchingWarehouseDetail) {
        throw new ProductNotFoundToSellException();
      }

      if (stockDetail.quantity > matchingWarehouseDetail.quantity) {
        throw new InsufficientQuantityException();
      }
    }
  }

  async updateWarehouseDetail() {
    const productDetails = this.createStockMovementDto.stockMovementDetail.map(
      (detail) => ({
        productId: detail.productId,
        id: this.warehouseDetailItems.find(
          (item) => item.productId === detail.productId,
        )?.id,
        quantity: detail.quantity,
      }),
    );

    // Itera a través de productDetails y actualiza la cantidad para cada elemento
    for (const productDetail of productDetails) {
      if (
        !(await this.warehouseDetailService.updateQuantity(
          productDetail.id,
          productDetail.quantity,
        ))
      )
        throw new ProductNotFoundToSellException();
    }
  }
}
