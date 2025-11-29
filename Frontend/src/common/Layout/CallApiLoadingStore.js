import { makeAutoObservable } from "mobx";

export default class CallApiLoadingStore {
  activeRequests = 0;

  constructor () {
    makeAutoObservable (this);
  }

  startRequest () {
    this.activeRequests++;
  }

  endRequest () {
    this.activeRequests = Math.max (0, this.activeRequests - 1);
  }

  get isLoading() {
    return this.activeRequests > 0;
  }
}
