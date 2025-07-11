export type Theorem = {
    theoremId: number;
    theoremName: string;
    dependencies: number[];
}

export const mockData: Theorem[] = [
    {
        theoremId: 1,
        theoremName: "1.1",
        dependencies: [],
    },
    {
        theoremId: 2,
        theoremName: "1.2",
        dependencies: [1],
    },
    {
        theoremId: 3,
        theoremName: "1.3",
        dependencies: [1, 2],
    },
    {
        theoremId: 4,
        theoremName: "1.4",
        dependencies: [2],
    },
    {
        theoremId: 5,
        theoremName: "1.5",
        dependencies: [3, 4],
    },
];