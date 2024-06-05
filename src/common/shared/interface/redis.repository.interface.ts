export interface RedisRepositoryInterface {
  get(prefix: string, key: string, option?: string): Promise<string | null>;
  set(
    prefix: string,
    key: string,
    value: string,
    option?: string,
  ): Promise<void>;
  delete(prefix: string, key: string, option?: string): Promise<void>;
  setWithExpiry(
    prefix: string,
    key: string,
    value: string,
    expiry: number,
    option?: string,
  ): Promise<void>;
}
