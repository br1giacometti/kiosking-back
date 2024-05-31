export default class ProductNotFoundToAplicationException extends Error {
  constructor(message = 'StockErrors.PRODUCT_NOT_FOUND_TO_SELL') {
    super(message);
    this.name = 'ProductNotFoundToAplicationException';
  }
}
