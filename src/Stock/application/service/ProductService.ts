import { Injectable } from '@nestjs/common';

import Product from '../../domain/models/Product';

import ProductValidations from '../validations/ProductValidations';
import ProductRepository from '../repository/ProductRepository';

@Injectable()
export default class ProductService {
  constructor(
    private readonly repository: ProductRepository,
    private readonly validator: ProductValidations,
  ) {}

  async createProduct(product: Product): Promise<Product> {
    const productCreated = await this.repository.insert({
      sellPrice: product.sellPrice,
      description: product.description,
      barCode: product.barCode,
      categoryId: product.categoryId,
      createdAt: product.createdAt,
      id: product.id,
    });
    return productCreated;
  }

  async updateProduct(id: number, product: Product): Promise<Product> {
    const productCreated = await this.repository.update(id, {
      sellPrice: product.sellPrice,
      description: product.description,
      categoryId: product.categoryId,
      barCode: product.barCode,
    });
    return productCreated;
  }

  async deleteProduct(productId: number): Promise<Product> {
    return await this.repository.delete(productId);
  }

  async findProductByDescription(description: string): Promise<Product> {
    const product = await this.repository.findProductByDescription(description);
    this.validator.validateExistingProduct(product);
    return product;
  }

  async validateProductsIds(ids: number[]): Promise<Product[]> {
    const products = await this.repository.validateProductsIds(ids);
    return products;
  }

  validateProductsIdsAgainstProductList(
    products: Product[],
    ids: number[],
  ): boolean {
    this.validator.validateExistingProductsIds(products, ids);
    return true;
  }

  async findProductById(productId: number): Promise<Product> {
    const product = await this.repository.findById(productId);
    this.validator.validateExistingProduct(product);
    return product;
  }

  async fetchAllProducts(): Promise<Product[]> {
    const products = await this.repository.findAll();
    return products;
  }
}
