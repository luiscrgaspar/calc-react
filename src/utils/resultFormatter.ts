import { DIVISION_OPERATOR } from '../constants';
import type { Operator } from '../types';

const MAX_RESULT_LENGTH = 12;

export interface FormattedResult {
  value: string;
  isInfinity: boolean;
}

export function countNumberBeforePoint(value: number): number {
  const absoluteValue = Math.abs(value);

  if (Math.floor(absoluteValue) === absoluteValue) {
    return 0;
  }

  return absoluteValue.toString().split('.')[0].length;
}

export function countDecimals(value: number): number {
  if (Math.floor(value) === value) {
    return 0;
  }

  return value.toString().split('.')[1]?.length ?? 0;
}

export function getMinDecimalPlaces(value: number): number {
  return countDecimals(value) === 0
    ? 0
    : Math.max(
        0,
        Math.min(
          MAX_RESULT_LENGTH - countNumberBeforePoint(value),
          value.toString().length
        )
      );
}

export function formatResult(
  result: number,
  operator: Operator | ''
): FormattedResult {
  if (Number.isNaN(result)) {
    return {
      value: 'NaN',
      isInfinity: false,
    };
  }

  if (!Number.isFinite(result)) {
    return {
      value: result === Infinity ? 'Infinity' : '-Infinity',
      isInfinity: true,
    };
  }

  const totalNumberResult = result.toString().length;

  if (operator === DIVISION_OPERATOR) {
    return {
      value:
        totalNumberResult > MAX_RESULT_LENGTH
          ? result.toFixed(getMinDecimalPlaces(result))
          : result.toString(),
      isInfinity: false,
    };
  }

  return {
    value:
      totalNumberResult > MAX_RESULT_LENGTH
        ? result.toExponential(6)
        : result.toString(),
    isInfinity: false,
  };
}

export function formatRootResult(result: number): string {
  return result.toFixed(getMinDecimalPlaces(result));
}

export function formatReciprocalResult(result: number): string {
  return countDecimals(result) > MAX_RESULT_LENGTH
    ? result.toExponential(7)
    : result.toString();
}
