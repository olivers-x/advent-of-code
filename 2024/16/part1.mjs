import { read, sum } from "../lib.mjs";

let map;
let start;
let end;
let rows;
let cols;

const OFFSET = 8;
const getNodeId = (dir, x, y) => (((x << OFFSET) + y) << 2) + dir;

const nodeIdToXY = (nodeId) => {
  const xy = nodeId >>> 2;
  const y = xy % 2 ** OFFSET;
  const x = xy >> OFFSET;

  return [x, y];
};

const [x, y] = nodeIdToXY(getNodeId(0, 2, 3));

console.assert(x == 2 && y === 3, "Node Id is wrong", x, y);

function findSE(maze) {
  rows = maze.length;
  cols = maze[0].length;

  if (maze[rows - 2][1] === "S" && maze[1][cols - 2] === "E") {
    start = [rows - 2, 1];
    end = [1, cols - 2];
    return;
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (maze[row][col] === "S") {
        start = [row, col];
      } else if (maze[row][col] === "E") {
        end = [row, col];
      }
    }
    if (start && end) break;
  }

  if (!start) {
    throw new Error("No starting point 'S' found in the maze");
  }
}

function mazeToDirectedGraph(maze) {
  findSE(maze);

  const startNode = getNodeId(0, start[0], start[1]);
  const endNode0 = getNodeId(0, end[0], end[1]);
  const endNode1 = getNodeId(1, end[0], end[1]);
  const endNode2 = getNodeId(2, end[0], end[1]);
  const endNode3 = getNodeId(3, end[0], end[1]);

  const graph = {};
  const branchingPoints = {
    [startNode]: true,
    [endNode0]: true,
    [endNode1]: true,
    [endNode2]: true,
    [endNode3]: true,
  };

  const DIRECTIONS = [
    [0, 1], // Right  >
    [1, 0], // Down   v
    [0, -1], // Left  <
    [-1, 0], // Up    ^
  ];

  const visited = {};

  function walk(x, y, currentDir) {
    const nodeId = getNodeId(currentDir, x, y);

    visited[nodeId] ??= 0;
    visited[nodeId] += 1;

    graph[nodeId] ??= {}; // adjacency

    let validDirections = [];

    for (let dir = 0; dir < 4; dir++) {
      const [dx, dy] = DIRECTIONS[dir];

      if (Math.abs(dir - currentDir) === 2) continue;

      const nx = x + dx;
      const ny = y + dy;

      if (
        maze[nx][ny] !== "#" // Check walkable (not a wall)
      ) {
        validDirections.push(dir);
      }
    }

    if (validDirections.length > 1) {
      branchingPoints[nodeId] = true;
    }

    validDirections.forEach((dir) => {
      const [dx, dy] = DIRECTIONS[dir];

      const nx = x + dx;
      const ny = y + dy;

      const neighborId = getNodeId(dir, nx, ny);

      const weight = dir === currentDir ? 1 : 1001;

      graph[nodeId][neighborId] = weight;

      if (visited[nodeId] < 4) {
        walk(nx, ny, dir);
      }
    });
  }

  // start right
  walk(start[0], start[1], 0);

  return { graph, branchingPoints };
}

function compressGraph(graph, branchingPoints) {
  const compressedGraph = {};

  for (const startNode of Object.keys(graph)) {
    // Only process branching points
    if (branchingPoints[startNode]) {
      compressedGraph[startNode] = {};
      for (const [neighbor, weight] of Object.entries(graph[startNode])) {
        let totalWeight = weight;
        let currentNode = neighbor;

        // Follow the linear path until another branching point or end of graph
        while (!branchingPoints[currentNode] && graph[currentNode]) {
          const nextNodes = Object.entries(graph[currentNode]);
          if (nextNodes.length !== 1) break; // Stop if not a linear path
          const [nextNode, nextWeight] = nextNodes[0];
          totalWeight += nextWeight;
          currentNode = nextNode;
        }

        // Add the compressed edge to the graph
        compressedGraph[startNode][currentNode] = totalWeight;
      }
    }
  }

  return compressedGraph;
}

function dijkstra(graph, start) {
  const distances = {};
  const visited = {};
  const previous = {};
  const nodes = Object.keys(graph);

  for (let node of nodes) {
    distances[node] = Infinity;
  }

  distances[start] = 0;

  const compare = (a, b) => distances[a] - distances[b];

  while (nodes.length) {
    // Sort nodes by distance and pick the closest unvisited node
    nodes.sort(compare);
    let node = nodes.shift();

    if (distances[node] === Infinity) break;

    visited[node] = true;

    for (let neighbor in graph[node]) {
      if (!visited[neighbor]) {
        let newDistance = distances[node] + graph[node][neighbor];

        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;

          previous[neighbor] = [node];
        } else if (newDistance === distances[neighbor]) {
          previous[neighbor].push(node);
        }
      }
    }
  }

  // Return the shortest distance from the start node to all nodes
  return { distances, previous };
}

function part1(map) {
  let { graph, branchingPoints } = mazeToDirectedGraph(map);

  const startNode = getNodeId(0, start[0], start[1]);

  graph = compressGraph(graph, branchingPoints);

  const { distances } = dijkstra(graph, startNode);

  const prices = [
    distances[getNodeId(0, end[0], end[1])],
    distances[getNodeId(1, end[0], end[1])],
    distances[getNodeId(2, end[0], end[1])],
    distances[getNodeId(3, end[0], end[1])],
  ].sort((a, b) => a - b);

  console.log(prices[0]);
}

/// main ///
map = read()
  .split("\n")
  .map((line) => line.split(""));

part1(map);
