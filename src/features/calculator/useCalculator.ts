import { useReducer } from 'react';
import {
  ADDITION_OPERATOR,
  CALCULATOR_BUTTON_LINES,
  DIVISION_OPERATOR,
  EQUAL_BUTTON_CLASSES,
  LANGUAGE_LABELS,
  MULTIPLICATION_OPERATOR,
  SUBTRACTION_OPERATOR,
} from '../../constants';
import { translate } from '../../i18n';
import type {
  CalculatorButton,
  CalculatorErrorKey,
  CalculatorState,
  Language,
  LanguageCode,
  Operator,
} from '../../types';
import {
  calculateBinaryOperation,
  calculateCube,
  calculateCubicRoot,
  calculateFactorial,
  calculatePercentage,
  calculateReciprocal,
  calculateSquare,
  calculateSquareRoot,
} from '../../utils/calculatorEngine';
import {
  formatReciprocalResult,
  formatResult,
  formatRootResult,
} from '../../utils/resultFormatter';

type Action =
  | { type: 'setLanguage'; payload: LanguageCode }
  | { type: 'addToCurrentValue'; payload: string }
  | { type: 'setCurrentValue'; payload: string }
  | { type: 'setCurrentTemporaryValue'; payload: string }
  | { type: 'setCurrentMemoryValue'; payload: string }
  | { type: 'setCurrentOperator'; payload: Operator | '' }
  | { type: 'setGoingToDoOperation'; payload: boolean }
  | { type: 'setIsInfinity'; payload: boolean }
  | { type: 'setAlreadyDoneEqualOperation'; payload: boolean }
  | { type: 'setError'; payload: CalculatorErrorKey | '' }
  | { type: 'reset' };

function createDefaultLanguages(): Language[] {
  return LANGUAGE_LABELS.map((language, index) => ({
    ...language,
    active: index === 0,
  }));
}

export function getCurrentLanguage(languages: Language[]): LanguageCode {
  return languages.find((language) => language.active)?.key ?? 'en-US';
}

export function createInitialState(): CalculatorState {
  return {
    languages: createDefaultLanguages(),
    currentValue: '0',
    currentTemporaryValue: '',
    currentMemoryValue: '',
    currentOperator: '',
    goingToDoOperation: false,
    isInfinity: false,
    alreadyDoneEqualOperation: false,
    error: '',
  };
}

export function reducer(state: CalculatorState, action: Action): CalculatorState {
  switch (action.type) {
    case 'setLanguage':
      return {
        ...state,
        languages: state.languages.map((language) => ({
          ...language,
          active: language.key === action.payload,
        })),
      };
    case 'addToCurrentValue': {
      if (action.payload === '.' && state.goingToDoOperation) {
        return {
          ...state,
          goingToDoOperation: false,
          currentValue: '0.',
        };
      }

      if (action.payload === '.' && state.currentValue.includes('.')) {
        return state;
      }

      const currentValue =
        (state.currentValue === '0' && action.payload !== '.') ||
        state.goingToDoOperation
          ? action.payload
          : `${state.currentValue}${action.payload}`;

      return {
        ...state,
        currentValue,
        goingToDoOperation: false,
      };
    }
    case 'setCurrentValue':
      return { ...state, currentValue: action.payload };
    case 'setCurrentTemporaryValue':
      return { ...state, currentTemporaryValue: action.payload };
    case 'setCurrentMemoryValue':
      return { ...state, currentMemoryValue: action.payload };
    case 'setCurrentOperator':
      return { ...state, currentOperator: action.payload };
    case 'setGoingToDoOperation':
      return { ...state, goingToDoOperation: action.payload };
    case 'setIsInfinity':
      return { ...state, isInfinity: action.payload };
    case 'setAlreadyDoneEqualOperation':
      return { ...state, alreadyDoneEqualOperation: action.payload };
    case 'setError':
      return { ...state, error: action.payload };
    case 'reset':
      return {
        ...state,
        currentValue: '0',
        currentTemporaryValue: '',
        currentOperator: '',
        isInfinity: false,
        error: '',
        goingToDoOperation: false,
        alreadyDoneEqualOperation: false,
      };
    default:
      return state;
  }
}

function isNumeric(value: string): boolean {
  return !Number.isNaN(+value);
}

function createButton(
  id: string,
  label: string,
  onClick: () => void,
  options: Omit<CalculatorButton, 'id' | 'label' | 'onClick'> = {}
): CalculatorButton {
  return {
    id,
    label,
    onClick,
    ...options,
  };
}

export function useCalculator() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  const currentLanguage = getCurrentLanguage(state.languages);

  const displayValue = state.error
    ? translate(currentLanguage, state.error)
    : state.isInfinity
      ? state.currentValue === '-Infinity'
        ? translate(currentLanguage, '-infinity')
        : translate(currentLanguage, 'infinity')
      : state.currentValue;

  const setCurrentValue = (value: string) =>
    dispatch({ type: 'setCurrentValue', payload: value });

  const setCurrentTemporaryValue = (value: string) =>
    dispatch({ type: 'setCurrentTemporaryValue', payload: value });

  const setCurrentMemoryValue = (value: string) =>
    dispatch({ type: 'setCurrentMemoryValue', payload: value });

  const setCurrentOperator = (value: Operator | '') =>
    dispatch({ type: 'setCurrentOperator', payload: value });

  const setGoingToDoOperation = (value: boolean) =>
    dispatch({ type: 'setGoingToDoOperation', payload: value });

  const setIsInfinity = (value: boolean) =>
    dispatch({ type: 'setIsInfinity', payload: value });

  const setAlreadyDoneEqualOperation = (value: boolean) =>
    dispatch({ type: 'setAlreadyDoneEqualOperation', payload: value });

  const setError = (value: CalculatorErrorKey | '') =>
    dispatch({ type: 'setError', payload: value });

  function reset() {
    dispatch({ type: 'reset' });
  }

  function clickOnPiKey() {
    setCurrentValue(Math.PI.toFixed(11));
    setError('');
    setIsInfinity(false);
  }

  function clickOnCEKey() {
    if (state.error !== '' || state.isInfinity) {
      reset();
      return;
    }

    setCurrentValue('0');
  }

  function clickOnMCKey() {
    setCurrentMemoryValue('');
  }

  function clickOnMRKey() {
    setCurrentValue(state.currentMemoryValue);
    setError('');
    setIsInfinity(false);
  }

  function clickOnMSKey() {
    if (state.currentValue !== '0') {
      setCurrentMemoryValue(state.currentValue);
    }
  }

  function clickOnPercentageKey() {
    setCurrentValue(
      calculatePercentage(+state.currentValue, state.currentOperator !== '')
    );
  }

  function clickOnBackKey() {
    const trimmedValue =
      state.currentValue.length === 1 ? '0' : state.currentValue.slice(0, -1);

    setCurrentValue(trimmedValue === '' || trimmedValue === '-' ? '0' : trimmedValue);
  }

  function setFormattedCurrentValue(result: number) {
    applyFormattedResult(result);
  }

  function applyFormattedResult(result: number) {
    const formattedResult = formatResult(result, state.currentOperator);
    const displayResult = formattedResult.isInfinity ? result.toString() : formattedResult.value;

    setError('');
    setIsInfinity(formattedResult.isInfinity);
    setCurrentValue(displayResult);

    return displayResult;
  }

  function setErrorCurrentValue(error: CalculatorErrorKey) {
    setIsInfinity(false);
    setError(error);
  }

  function getPendingBinaryOperationResult(alreadyRepeated: boolean) {
    if (!state.currentOperator || Number.isNaN(+state.currentValue)) {
      return null;
    }

    const currentValueNumber = +state.currentValue;
    const currentTemporaryValueNumber = +state.currentTemporaryValue;
    const result = calculateBinaryOperation(
      state.currentOperator,
      currentTemporaryValueNumber,
      currentValueNumber,
      alreadyRepeated
    );

    return {
      currentValueNumber,
      result,
    };
  }

  function clickOnXToThePowerOf2() {
    setFormattedCurrentValue(calculateSquare(+state.currentValue));
  }

  function clickOnXToThePowerOf3() {
    setFormattedCurrentValue(calculateCube(+state.currentValue));
  }

  function setResultOperationOrInvalidInput(value: number, error: CalculatorErrorKey) {
    setIsInfinity(false);
    if (Number.isNaN(value)) {
      setError(error);
      return;
    }

    setError('');
    setCurrentValue(formatRootResult(value));
  }

  function clickOnSquareRoot() {
    setResultOperationOrInvalidInput(
      calculateSquareRoot(+state.currentValue),
      'invalid_number_for_square_root'
    );
  }

  function clickOnCubicRoot() {
    setResultOperationOrInvalidInput(
      calculateCubicRoot(+state.currentValue),
      'invalid_number_for_cubic_root'
    );
  }

  function clickOnFactorial() {
    const result = calculateFactorial(+state.currentValue);

    if (typeof result === 'string') {
      setErrorCurrentValue(result);
      return;
    }

    setFormattedCurrentValue(result);
  }

  function clickOnOneDividedByX() {
    const result = calculateReciprocal(+state.currentValue);

    if (typeof result === 'string') {
      setErrorCurrentValue(result);
      return;
    }

    setError('');
    setIsInfinity(false);
    setCurrentValue(formatReciprocalResult(result));
  }

  function clickOnEKey() {
    setCurrentValue(Math.E.toFixed(11));
    setError('');
    setIsInfinity(false);
  }

  function clickOnNumber(number: string | number) {
    const numberValue = number.toString();

    if (state.alreadyDoneEqualOperation) {
      setCurrentValue(numberValue);
      setCurrentTemporaryValue('0');
      setAlreadyDoneEqualOperation(false);
      setCurrentOperator('');
      return;
    }

    dispatch({ type: 'addToCurrentValue', payload: numberValue });
  }

  function clickOnNumberZero() {
    if (state.currentValue !== '0') {
      dispatch({ type: 'addToCurrentValue', payload: '0' });
    }
  }

  function clickOnPlusMinusKey() {
    setCurrentValue((+state.currentValue * -1).toString());
  }

  function clickOnPointKey() {
    if (
      state.goingToDoOperation ||
      (isNumeric(state.currentValue) && state.currentValue.indexOf('.') === -1)
    ) {
      dispatch({ type: 'addToCurrentValue', payload: '.' });
    }
  }

  function clickOnEqualKey() {
    const pendingResult = getPendingBinaryOperationResult(state.alreadyDoneEqualOperation);

    if (!pendingResult) {
      return;
    }

    const { currentValueNumber, result } = pendingResult;

    if (typeof result === 'string') {
      setErrorCurrentValue(result);
      return;
    }

    if (!state.alreadyDoneEqualOperation) {
      setCurrentTemporaryValue(currentValueNumber.toString());
      setAlreadyDoneEqualOperation(true);
    }

    setGoingToDoOperation(false);
    setFormattedCurrentValue(result);
  }

  function operation(operator: Operator) {
    const hadAlreadyDoneEqualOperation = state.alreadyDoneEqualOperation;
    setAlreadyDoneEqualOperation(false);

    if (hadAlreadyDoneEqualOperation) {
      setCurrentTemporaryValue(state.currentValue);
      setCurrentOperator(operator);
      setGoingToDoOperation(true);
      return;
    }

    if (state.goingToDoOperation) {
      setCurrentOperator(operator);
      return;
    }

    if (state.currentOperator !== '') {
      const pendingResult = getPendingBinaryOperationResult(false);

      if (!pendingResult) {
        return;
      }

      const { result } = pendingResult;

      if (typeof result === 'string') {
        setErrorCurrentValue(result);
        return;
      }

      const displayResult = applyFormattedResult(result);
      setCurrentTemporaryValue(displayResult);
      setCurrentOperator(operator);
      setGoingToDoOperation(true);
      return;
    }

    setCurrentTemporaryValue(state.currentValue);
    setCurrentOperator(operator);
    setGoingToDoOperation(true);
  }

  function handleLanguageChange(language: LanguageCode) {
    dispatch({ type: 'setLanguage', payload: language });
  }

  const buttonRows: CalculatorButton[][] = [
    [
      createButton('pi', CALCULATOR_BUTTON_LINES.line1[0], clickOnPiKey),
      createButton('ce', CALCULATOR_BUTTON_LINES.line1[1], clickOnCEKey),
      createButton('clear', CALCULATOR_BUTTON_LINES.line1[2], reset),
      createButton('backspace', CALCULATOR_BUTTON_LINES.line1[3], clickOnBackKey),
    ],
    [
      createButton('memory-clear', CALCULATOR_BUTTON_LINES.line2[0], clickOnMCKey, {
        disabled: !state.currentMemoryValue,
      }),
      createButton('memory-recall', CALCULATOR_BUTTON_LINES.line2[1], clickOnMRKey, {
        disabled: !state.currentMemoryValue,
      }),
      createButton('memory-store', CALCULATOR_BUTTON_LINES.line2[2], clickOnMSKey),
      createButton('percentage', CALCULATOR_BUTTON_LINES.line2[3], clickOnPercentageKey),
    ],
    [
      createButton('square', CALCULATOR_BUTTON_LINES.line3[0], clickOnXToThePowerOf2),
      createButton('cube', CALCULATOR_BUTTON_LINES.line3[1], clickOnXToThePowerOf3),
      createButton('square-root', CALCULATOR_BUTTON_LINES.line3[2], clickOnSquareRoot),
      createButton('cubic-root', CALCULATOR_BUTTON_LINES.line3[3], clickOnCubicRoot),
    ],
    [
      createButton('factorial', CALCULATOR_BUTTON_LINES.line4[0], clickOnFactorial),
      createButton('reciprocal', CALCULATOR_BUTTON_LINES.line4[1], clickOnOneDividedByX),
      createButton('constant-e', CALCULATOR_BUTTON_LINES.line4[2], clickOnEKey),
      createButton('divide', CALCULATOR_BUTTON_LINES.line4[3], () =>
        operation(DIVISION_OPERATOR)
      ),
    ],
    [
      createButton('seven', CALCULATOR_BUTTON_LINES.line5[0], () => clickOnNumber('7')),
      createButton('eight', CALCULATOR_BUTTON_LINES.line5[1], () => clickOnNumber('8')),
      createButton('nine', CALCULATOR_BUTTON_LINES.line5[2], () => clickOnNumber('9')),
      createButton('multiply', CALCULATOR_BUTTON_LINES.line5[3], () =>
        operation(MULTIPLICATION_OPERATOR)
      ),
    ],
    [
      createButton('four', CALCULATOR_BUTTON_LINES.line6[0], () => clickOnNumber('4')),
      createButton('five', CALCULATOR_BUTTON_LINES.line6[1], () => clickOnNumber('5')),
      createButton('six', CALCULATOR_BUTTON_LINES.line6[2], () => clickOnNumber('6')),
      createButton('subtract', CALCULATOR_BUTTON_LINES.line6[3], () =>
        operation(SUBTRACTION_OPERATOR)
      ),
    ],
    [
      createButton('one', CALCULATOR_BUTTON_LINES.line7[0], () => clickOnNumber('1')),
      createButton('two', CALCULATOR_BUTTON_LINES.line7[1], () => clickOnNumber('2')),
      createButton('three', CALCULATOR_BUTTON_LINES.line7[2], () => clickOnNumber('3')),
      createButton('add', CALCULATOR_BUTTON_LINES.line7[3], () =>
        operation(ADDITION_OPERATOR)
      ),
    ],
    [
      createButton('toggle-sign', CALCULATOR_BUTTON_LINES.line8[0], clickOnPlusMinusKey),
      createButton('zero', CALCULATOR_BUTTON_LINES.line8[1], clickOnNumberZero),
      createButton('decimal', CALCULATOR_BUTTON_LINES.line8[2], clickOnPointKey),
      createButton('equals', CALCULATOR_BUTTON_LINES.line8[3], clickOnEqualKey, {
        disabled: Boolean(state.error || state.isInfinity),
        className: EQUAL_BUTTON_CLASSES[3],
      }),
    ],
  ];

  return {
    currentLanguage,
    displayValue,
    error: state.error,
    languages: state.languages,
    buttonRows,
    handleLanguageChange,
  };
}
