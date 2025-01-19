

export interface CircuiteBreakerState {
  failures: number;
  threshold: number;
  timeout: number;
  state: "CLOSED" | "OPEN" | "HALF-OPEN";
  lastFailureTime: number;
}

export class CircuitBreaker {
  private state: CircuiteBreakerState;

  constructor(threshold: number = 3, timeout: number = 60 * 1000, private maxTimeout: number = 10 * 60 * 1000) {
    this.state = {
      failures: 0,
      threshold,
      timeout,
      state: "CLOSED",
      lastFailureTime: 0,
    };
  }

  // Check if connection attempt should proceed
  shouldAttemptConnection(): boolean {
    if (this.state.state === "CLOSED") {
      return true;
    }

    const now = Date.now();
    if (this.state.state === "OPEN") {
      if (now - this.state.lastFailureTime > this.state.timeout) {
        this.state.state = "HALF-OPEN";
        return true;
      }
      return false;
    }

    if (this.state.state === "HALF-OPEN") {
      return true;
    }

    return false;
  }

  // Handle a failed connection attempt
  handleFailure(): void {
    this.state.failures += 1;
    this.state.lastFailureTime = Date.now();
    this.state.timeout = Math.min(this.state.timeout * 2, this.maxTimeout); // Exponential backoff with a cap
    if (this.state.failures <= this.state.threshold) {
      this.state.state = "OPEN";
    
    }else{
      this.state.state = "CLOSED";
    }
  }

  // Handle a successful connection attempt
  handleSuccess(): void {
    this.state.failures = 0;
    this.state.state = "CLOSED";
    this.state.lastFailureTime = 0;
    this.state.timeout = 60 * 1000; // Reset to default timeout
   
  }

  // Get the current state of the circuit breaker
  getState(): CircuiteBreakerState {
    return this.state;
  }
}