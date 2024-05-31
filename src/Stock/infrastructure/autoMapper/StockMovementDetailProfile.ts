import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Resolver, type Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import StockMovementDetail from 'Stock/domain/models/StockMovementDetail';
import { StockMovementDetailDto } from '../dto/StockMovement/StockMovementDetailDto';
import StockMovementDetailEntity from '../entity/StockMovementDetailEntity';
import { Decimal } from '@prisma/client/runtime';

@Injectable()
export class StockMovementDetailProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, StockMovementDetailEntity, StockMovementDetail);
      createMap(mapper, StockMovementDetail, StockMovementDetailDto);
      createMap(mapper, StockMovementDetailDto, StockMovementDetail);
      createMap(mapper, StockMovementDetailDto, StockMovementDetail);
    };
  }
}
