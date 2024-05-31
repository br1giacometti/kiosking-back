import { Module } from '@nestjs/common';
import { ProductMapperProfile } from '../autoMapper/ProductMapperProfile';
import ProductController from '../controller/ProductController';
import FieldController from '../controller/FieldController';
import WarehouseController from '../controller/WarehouseController';
import StockMovementController from '../controller/StockMovementController';
import BatchController from '../controller/BatchController';
import BatchService from 'Stock/application/service/BatchService';
import ProductService from 'Stock/application/service/ProductService';
import FieldService from 'Stock/application/service/FieldService';
import WarehouseDetailService from 'Stock/application/service/WarehouseDetailService';
import StockMovementDetailService from 'Stock/application/service/StockMovementDetailService';
import WarehouseService from 'Stock/application/service/WarehouseService';
import StockMovementService from 'Stock/application/service/StockMovementService';
import StockMovementDataProvider from '../dataProvider/StockMovementDataProvider';
import WarehouseDataProvider from '../dataProvider/WarehouseDataProvider';
import BatchDataProvider from '../dataProvider/BatchDataProvider';
import FieldDataProvider from '../dataProvider/FieldDataProvider';
import WarehouseDetailDataProvider from '../dataProvider/WarehouseDetailDataProvider';
import StockMovementDetailDataProvider from '../dataProvider/StockMovementDetailDataProvider';
import ProductDataProvider from '../dataProvider/ProductDataProvider';
import ProductRepository from 'Stock/application/repository/ProductRepository';
import StockMovementDetailRepository from 'Stock/application/repository/StockMovementDetailRepository';
import WarehouseDetailRepository from 'Stock/application/repository/WarehouseDetailRepository';
import WarehouseRepository from 'Stock/application/repository/WarehouseRepository';
import StockMovementRepository from 'Stock/application/repository/StockMovementRepository';
import BatchRepository from 'Stock/application/repository/BatchRepository';
import FieldRepository from 'Stock/application/repository/FieldRepository';
import ProductValidations from 'Stock/application/validations/ProductValidations';
import WarehouseValidations from 'Stock/application/validations/WarehouseValidations';
import FieldValidations from 'Stock/application/validations/FieldValidations';
import BatchValidations from 'Stock/application/validations/BatchValidations';
import { WarehouseMapperProfile } from '../autoMapper/WarehouseMapperProfile';
import { StockMovementDetailProfile } from '../autoMapper/StockMovementDetailProfile';
import { StockMovementProfile } from '../autoMapper/StockMovementMapperProfile';
import { WarehouseDetailMapperProfile } from '../autoMapper/WarehouseDetailMapperProfile';
import { BatchMapperProfile } from '../autoMapper/BatchMapperProfile';
import { FieldMapperProfile } from '../autoMapper/FieldMapperProfile';
import { StockMovementGenerator } from 'Stock/application/factories/StockMovementGenerator';

@Module({
  controllers: [
    ProductController,
    WarehouseController,
    StockMovementController,
    BatchController,
    FieldController,
  ],
  providers: [
    ProductService,
    {
      provide: ProductRepository,
      useClass: ProductDataProvider,
    },
    ProductMapperProfile,
    ProductValidations,
    WarehouseService,
    {
      provide: WarehouseRepository,
      useClass: WarehouseDataProvider,
    },
    WarehouseMapperProfile,
    WarehouseValidations,
    WarehouseDetailService,
    {
      provide: WarehouseDetailRepository,
      useClass: WarehouseDetailDataProvider,
    },
    StockMovementService,
    {
      provide: StockMovementRepository,
      useClass: StockMovementDataProvider,
    },
    StockMovementProfile,
    StockMovementDetailService,
    {
      provide: StockMovementDetailRepository,
      useClass: StockMovementDetailDataProvider,
    },
    StockMovementDetailProfile,
    WarehouseDetailMapperProfile,
    StockMovementGenerator,
    BatchService,
    {
      provide: BatchRepository,
      useClass: BatchDataProvider,
    },
    BatchMapperProfile,
    BatchValidations,
    FieldService,
    FieldValidations,
    {
      provide: FieldRepository,
      useClass: FieldDataProvider,
    },
    FieldMapperProfile,
  ],
})
export default class StockModule {}
