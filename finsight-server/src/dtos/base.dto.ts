export abstract class BaseDTO<T> {
  constructor(data: T) {
    Object.assign(this, data);
  }
}
