export class Graph {
  constructor() {
    this.adjacencyList = new Map();
  }

  addConnection(node1, node2) {
    if (!this.adjacencyList.has(node1))
      this.adjacencyList.set(node1, new Set());

    if (!this.adjacencyList.has(node2))
      this.adjacencyList.set(node2, new Set());

    this.adjacencyList.get(node1).add(node2);
    this.adjacencyList.get(node2).add(node1);
  }

  addPair(pair) {
    this.addConnection(pair.p1, pair.p2);
  }

  findClusters() {
    const visited = new Set();
    const clusters = [];

    for (const startNode of this.adjacencyList.keys()) {
      if (!visited.has(startNode)) {
        const currentCluster = [];
        const stack = [startNode];
        visited.add(startNode);

        while (stack.length > 0) {
          const node = stack.pop();
          currentCluster.push(node);

          const neighbors = this.adjacencyList.get(node);
          for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
              visited.add(neighbor);
              stack.push(neighbor);
            }
          }
        }

        clusters.push(currentCluster);
      }
    }
    return clusters;
  }
}
