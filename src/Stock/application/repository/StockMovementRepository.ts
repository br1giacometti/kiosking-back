import BaseRepository from 'Base/repository/BaseRepository';
import StockMovement from 'Stock/domain/models/StockMovement';

export default abstract class StockMovementRepository {
  abstract findById(id: number): Promise<StockMovement>;
  abstract findAll(): Promise<StockMovement[]>;
  abstract insert(StockMovement: StockMovement): Promise<StockMovement>;
}
