import Question from './Question';

export interface QuestionConstructors {
    free: QuestionConstructor;
    multi: QuestionConstructor;
    number: QuestionConstructor;
    scale: QuestionConstructor;
    boolean: QuestionConstructor;

    [type: string]: QuestionConstructor | undefined;
}

export interface QuestionOptions {
    [optionName: string]: unknown;
}

export interface NumberQuestionOptions extends QuestionOptions {
    step?: number;
}

export interface ScaleQuestionOptions extends NumberQuestionOptions {
    minValue: number;
    maxValue: number;
}

export type QuestionConstructor = (options?: QuestionOptions) => Question;
