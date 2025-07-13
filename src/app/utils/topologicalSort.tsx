import { Theorem } from '../mock';

export function topologicalSort(n: number, graph: number[][]): number[] {
    const indegrees = new Array(n).fill(0);

    // Count the indegrees
    for (const edges of graph) {
        for (const to of edges) {
            indegrees[to]++;
        }
    }

    const queue: number[] = [];

    // Add vertices with zero indegree to the queue
    for (let i = 0; i < n; i++) {
        if (indegrees[i] === 0) {
            queue.push(i);
        }
    }

    const order: number[] = [];

    // Topological Sort
    while (queue.length > 0) {
        const from = queue.shift()!;
        order.push(from);

        for (const to of graph[from]) {
            indegrees[to]--;
            if (indegrees[to] === 0) {
                queue.push(to);
            }
        }
    }

    // Cycle detection
    if (order.length !== n) {
        // There is a cycle
        return [];
    }

    return order;
}

export function buildOutgoingMap(data: Theorem[]): number[][] {
    const outgoingMap: number[][] = new Array(data.length).fill(null).map(() => []);
  
    for (const item of data) {
      outgoingMap[item.theoremId] = [];
    }

    for (const item of data) {
      for (const dep of item.dependencies) {
        if (!(dep in outgoingMap)) {
          outgoingMap[dep] = [];
        }
        outgoingMap[dep].push(item.theoremId);
      }
    }
  
    return outgoingMap;
  }

export function sortTheorem(mockData: Theorem[]): number[] {
    return topologicalSort(mockData.length, buildOutgoingMap(mockData));
}
