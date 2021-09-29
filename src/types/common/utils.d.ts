type Assign<T, V> = {
  [key in keyof T]: V
}

interface Result<T> {
  result: T
}
