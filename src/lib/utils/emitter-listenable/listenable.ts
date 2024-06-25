import { type IEmitter } from "$/lib/utils/emitter-listenable/emitter";

export class Listenable<DataType> implements IListenable<DataType> {
  private emitter: IEmitter<DataType>;

  on: IEmitter<DataType>["on"];
  off: IEmitter<DataType>["off"];
  getPromise: IEmitter<DataType>["getPromise"];

  constructor(emitter: IEmitter<DataType>) {
    this.emitter = emitter;

    // The methods are bound in Emitter's constructor, so we can safely use them here.
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { on, off, getPromise } = this.emitter;

    this.on = on;
    this.off = off;
    this.getPromise = getPromise;
  }
}

export interface IListenable<DataType> {
  on: IEmitter<DataType>["on"];
  off: IEmitter<DataType>["off"];
  getPromise: IEmitter<DataType>["getPromise"];
}
