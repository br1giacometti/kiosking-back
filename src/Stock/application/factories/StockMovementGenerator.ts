import { Inject, Injectable, forwardRef } from '@nestjs/common';
import StockMovementType from 'Stock/domain/models/StockMovementType';

import { CreateStockMovementDto } from 'Stock/infrastructure/dto/StockMovement/CreateStockMovementDto';
import WarehouseService from '../service/WarehouseService';
import InvalidStocmMovementTypeException from '../exception/InvalidStocmMovementTypeException';
import { Buy } from './States/Buy';
import WarehouseDetailService from '../service/WarehouseDetailService';
import WarehouseValidations from '../validations/WarehouseValidations';
import ProductService from '../service/ProductService';
import { Sell } from './States/Sell';
import { Aplication } from './States/Aplication';
import BatchService from '../service/BatchService';
import AplicatorService from '../service/AplicatorService';
import AfipService from '../service/AfipService';
import StockParametersService from '../service/StockParametersService';
import StockMovementService from '../service/StockMovementService';

@Injectable()
export class StockMovementGenerator {
  constructor(
    private readonly warehouseService: WarehouseService,
    private readonly warehouseDetailService: WarehouseDetailService,
    private readonly productService: ProductService,
    private readonly warehouseValidations: WarehouseValidations, //private readonly cashBoxMovementService: CashBoxMovementService,
    private readonly batchService: BatchService,
    private readonly aplicatorService: AplicatorService,
    private readonly afipService: AfipService,
    private readonly stockParametersService: StockParametersService,
    @Inject(forwardRef(() => StockMovementService))
    private readonly stockMovementService: StockMovementService,
  ) {}

  createMovement(
    createStockMovementDto: CreateStockMovementDto,
  ): Buy | Sell | Aplication /*| Movement*/ {
    switch (createStockMovementDto.movementType) {
      case StockMovementType.BUY:
        return new Buy(
          createStockMovementDto,
          this.warehouseService,
          this.warehouseDetailService,
          this.productService,
          this.warehouseValidations,
        );
      case StockMovementType.SELL:
        return new Sell(
          createStockMovementDto,
          this.warehouseService,
          this.warehouseDetailService,
          this.warehouseValidations,
          this.afipService,
          this.stockParametersService,
          this.stockMovementService,
        );
      case StockMovementType.APLICATION:
        return new Aplication(
          createStockMovementDto,
          this.warehouseService,
          this.warehouseDetailService,
          this.batchService,
          this.aplicatorService,
          this.warehouseValidations,
        );
      default:
        throw new InvalidStocmMovementTypeException();
    }
  }
}
