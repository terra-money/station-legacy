export type Assign<T, V> = {
  [key in keyof T]: V
}

export interface Result<T> {
  result: T
}
