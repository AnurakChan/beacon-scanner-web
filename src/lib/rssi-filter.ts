export class MovingAverage {
  private window: number[]
  private readonly size: number

  constructor(windowSize = 5) {
    this.size = windowSize
    this.window = []
  }

  push(value: number): number {
    if (value === 127) return this.average()
    this.window.push(value)
    if (this.window.length > this.size) this.window.shift()
    return this.average()
  }

  private average(): number {
    if (this.window.length === 0) return -70
    return this.window.reduce((a, b) => a + b, 0) / this.window.length
  }

  reset(): void {
    this.window = []
  }
}

export class KalmanFilter {
  private R: number
  private Q: number
  private p: number
  private x: number | null

  constructor(R = 0.008, Q = 0.1) {
    this.R = R
    this.Q = Q
    this.p = 1
    this.x = null
  }

  process(measurement: number): number {
    if (this.x === null) {
      this.x = measurement
      return measurement
    }
    this.p = this.p + this.Q
    const K = this.p / (this.p + this.R)
    this.x = this.x + K * (measurement - this.x)
    this.p = (1 - K) * this.p
    return this.x
  }

  reset(): void {
    this.p = 1
    this.x = null
  }
}
