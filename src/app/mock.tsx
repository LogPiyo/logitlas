import testData from './testData.json';

export type Theorem = {
    theoremId: number;
    theoremName: string;
    dependencies: number[];
}

export const mockData: Theorem[] = testData;