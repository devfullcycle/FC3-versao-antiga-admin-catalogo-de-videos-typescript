export class InvalidDateError extends Error {
    constructor(message?: string) {
      super(message || "Date must be a valid Date");
      this.name = "InvalidDateError";
    }
  }
  
  export default InvalidDateError;