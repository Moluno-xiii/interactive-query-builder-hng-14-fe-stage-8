class LocalStorageStore {
  private isBrowser() {
    return typeof window !== "undefined";
  }

  get<T>(k: string): T | null {
    if (!this.isBrowser()) return null;
    const v = window.localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : null;
  }

  set(k: string, v: unknown) {
    if (!this.isBrowser()) return;
    window.localStorage.setItem(k, JSON.stringify(v));
  }
}

const localStorageStore = new LocalStorageStore();

export default localStorageStore;
