import Product from '../../domain/models/Product';
import BaseRepository from 'Base/repository/BaseRepository';

export default abstract class ProductRepository extends BaseRepository<Product> {
  abstract findProductByDescription: (
    description: string,
  ) => Promise<Product | null>;
  abstract validateProductsIds(ids: number[]): Promise<Product[] | null>;
}
