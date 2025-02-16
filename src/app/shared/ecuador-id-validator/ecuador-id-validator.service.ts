import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class EcuadorIdValidatorService {

  // Method to validate Ecuadorian ID (Cedula)
  validateId(id: string): boolean {
    return this.isValidId(id, 10);
  }

  // Method to validate Ecuadorian RUC
  validateRuc(ruc: string): boolean {
    if (ruc.length !== 13) {
      return false;
    }

    // The first 10 digits should be a valid Ecuadorian ID (Cedula)
    const idPart = ruc.substring(0, 10);
    if (!this.isValidId(idPart, 10)) {
      return false;
    }

    // The last 3 digits must be '001' for a valid RUC
    const lastThreeDigits = ruc.substring(10, 13);
    return lastThreeDigits === '001';
  }

  // Common validation method for both ID and the first part of the RUC
  private isValidId(id: string, expectedLength: number): boolean {
    if (id.length !== expectedLength) {
      return false;
    }

    const regionDigit = Number(id.substring(0, 2));

    // Ecuador has 24 regions
    if (regionDigit < 1 || regionDigit > 24) {
      return false;
    }

    const lastDigit = Number(id.substring(9, 10));
    const evenSum = this.calculateEvenSum(id);
    const oddSum = this.calculateOddSum(id);
    const totalSum = evenSum + oddSum;
    const validatorDigit = this.calculateValidatorDigit(totalSum);

    return validatorDigit === lastDigit;
  }

  // Calculate the sum of even-positioned digits
  private calculateEvenSum(id: string): number {
    return Number(id[1]) + Number(id[3]) + Number(id[5]) + Number(id[7]);
  }

  // Calculate the sum of odd-positioned digits with multiplication and adjustment
  private calculateOddSum(id: string): number {
    return this.multiplyAndAdjust(Number(id[0])) +
           this.multiplyAndAdjust(Number(id[2])) +
           this.multiplyAndAdjust(Number(id[4])) +
           this.multiplyAndAdjust(Number(id[6])) +
           this.multiplyAndAdjust(Number(id[8]));
  }

  // Multiply odd-positioned digits by 2 and adjust if result is greater than 9
  private multiplyAndAdjust(number: number): number {
    const result = number * 2;
    return result > 9 ? result - 9 : result;
  }

  // Calculate the validator digit based on the total sum
  private calculateValidatorDigit(sum: number): number {
    const nextTens = Math.ceil(sum / 10) * 10;
    const validatorDigit = nextTens - sum;
    return validatorDigit === 10 ? 0 : validatorDigit;
  }
}
