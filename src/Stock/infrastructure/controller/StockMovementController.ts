import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import User from 'Authentication/domain/models/User';
import JwtAuthGuard from 'Authentication/infrastructure/guards/JwtAuthGuard';
import StockMovementService from 'Stock/application/service/StockMovementService';
import StockMovement from 'Stock/domain/models/StockMovement';
import { I18n, I18nContext } from 'nestjs-i18n';
import { CreateStockMovementDto } from '../dto/StockMovement/CreateStockMovementDto';
import { MapInterceptor } from '@automapper/nestjs';
import Product from 'Stock/domain/models/Product';
import { ProductDto } from '../dto/Product/ProductDto';
import { StockMovementDto } from '../dto/StockMovement/StockMovementDto';

@Controller('StockMovement')
export default class StockMovementController {
  constructor(private stockMovementService: StockMovementService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createStockMovement(
    @Body() createStockMovementDto: CreateStockMovementDto,
    @I18n() i18n: I18nContext,
    @Req() request: Request & { user: User },
  ): Promise<StockMovement> {
    createStockMovementDto.user = request.user;
    return this.stockMovementService
      .createStockMovement(createStockMovementDto)
      .then((CashBox) => CashBox)
      .catch((error) => {
        switch (error.name) {
          case 'ProductNotFoundForStockMovementException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'WarehouseNotFoundException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'InvalidTypeMovementException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'InsufficientQuantityException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          default: {
            throw new HttpException(error.message, 500);
          }
        }
      });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MapInterceptor(Product, ProductDto, { isArray: true }))
  async getAllProducts(): Promise<StockMovement[]> {
    return this.stockMovementService
      .fetchAllMovimientosStock()
      .then((products) => products);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MapInterceptor(StockMovement, StockMovementDto))
  async getProductById(
    @Param('id') stockMovementId: string,
  ): Promise<StockMovement> {
    return this.stockMovementService
      .findStockMovementById(parseInt(stockMovementId))
      .then((product) => product)
      .catch((error) => {
        switch (error.name) {
          default: {
            throw new HttpException(error.message, 500);
          }
        }
      });
  }
}
