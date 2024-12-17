import { read } from "../lib.mjs";

let map;
let start;
let end;
let rows;
let cols;

let char = 64;
function unique() {
  char++;
  return String.fromCharCode(char);
}

function printMap() {
  map.forEach((line) => console.log(line.join("")));
}

const OFFSET = 4;
// const getNodeId = (x, y) => (x << OFFSET) + y - (2 << (OFFSET - 1)) - 1;
const getNodeId = (dir, x, y) => {
  const d = [">", "v", "<", "^"][dir];

  return `${d}${x},${y}`;
};
const nodeIdToXY = (nodeId) => JSON.parse(`[${nodeId}]`);

function plotPoints(points) {
  const grid = Array.from({ length: rows }, () => Array(cols).fill(" "));

  points.forEach(([x, y]) => {
    grid[x][y] = "X";
  });

  console.table(grid);
}

function plotPointsToMap(points) {
  points.forEach(([x, y]) => {
    map[x][y] = "X";
  });

  console.table(map);
}

function mazeToDirectedGraph(maze) {
  rows = maze.length;
  cols = maze[0].length;

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

  // Adjacency list to represent the directed graph
  const graph = {};

  const DIRECTIONS = [
    [0, 1], // Right  >
    [1, 0], // Down   v
    [0, -1], // Left  <
    [-1, 0], // Up    ^
  ];

  const visited = {};

  function walk(x, y, currentDir) {
    const nodeId = getNodeId(currentDir, x, y);

    if (visited[nodeId]) return;

    visited[nodeId] ??= 0;
    visited[nodeId] += 1;

    // Initialize the adjacency list for this node

    graph[nodeId] ??= {};

    for (let di = 0; di < 4; di++) {
      const [dx, dy] = DIRECTIONS[di];

      if (Math.abs(di - currentDir) === 2) continue;

      const nx = x + dx;
      const ny = y + dy;

      // Ensure the neighbor is within bounds and walkable
      if (
        nx >= 0 &&
        nx < rows &&
        ny >= 0 &&
        ny < cols &&
        maze[nx][ny] !== "#" // Check walkable (not a wall)
      ) {
        const neighborId = getNodeId(di, nx, ny);

        // console.log("di", di, "currentDir", currentDir);
        const weight = di === currentDir ? 1 : 1001;

        graph[nodeId][neighborId] = weight;

        // if (weight === 1001) {
        //   graph[nodeId].push({ node: neighborId, weight });
        // } else {
        //   graph[nodeId].unshift({ node: neighborId, weight });
        // }

        if (visited[nodeId] < 3) {
          walk(nx, ny, di);
        }
      }
    }
  }

  // start right
  walk(start[0], start[1], 0);

  return graph;
}

function removeDeadEnds(graph, startNode, endNode) {
  // Function to identify reachable nodes from the start using BFS or DFS
  function getReachableNodes(graph, startNode) {
    const reachable = new Set();
    const stack = [startNode];

    while (stack.length > 0) {
      const node = stack.pop();
      if (!reachable.has(node)) {
        reachable.add(node);
        for (const edge of graph[node] || []) {
          stack.push(edge.node);
        }
      }
    }
    return reachable;
  }

  // Step 1: Find all reachable nodes from the start node
  const reachableFromStart = getReachableNodes(graph, startNode);

  // Step 2: Find all reachable nodes from the end node (to handle bi-directional paths)
  const reversedGraph = reverseGraph(graph);
  const reachableFromEnd = getReachableNodes(reversedGraph, endNode);

  // Step 3: Filter the graph to keep only nodes that are both reachable from start and end
  const validNodes = new Set(
    [...reachableFromStart].filter((node) => reachableFromEnd.has(node))
  );

  // Step 4: Remove dead ends (nodes that are not part of valid paths or are dead ends)
  const prunedGraph = {};
  for (const node in graph) {
    if (validNodes.has(node)) {
      prunedGraph[node] = graph[node].filter((edge) =>
        validNodes.has(edge.node)
      );
    }
  }

  return prunedGraph;
}

// Helper function to reverse the graph (for reverse traversal)
function reverseGraph(graph) {
  const reversed = {};
  for (const node in graph) {
    for (const edge of graph[node]) {
      if (!reversed[edge.node]) {
        reversed[edge.node] = [];
      }
      reversed[edge.node].push({ node: node, weight: edge.weight });
    }
  }
  return reversed;
}

function dijkstra(graph, start) {
  // Create an object to store the shortest distance from the start node to every other node
  let distances = {};

  // A set to keep track of all visited nodes
  let visited = {};

  // Get all the nodes of the graph
  let nodes = Object.keys(graph);

  // Initially, set the shortest distance to every node as Infinity
  for (let node of nodes) {
    distances[node] = Infinity;
  }

  // The distance from the start node to itself is 0
  distances[start] = 0;

  // Loop until all nodes are visited
  while (nodes.length) {
    // Sort nodes by distance and pick the closest unvisited node
    nodes.sort((a, b) => distances[a] - distances[b]);
    let closestNode = nodes.shift();

    // If the shortest distance to the closest node is still Infinity, then remaining nodes are unreachable and we can break
    if (distances[closestNode] === Infinity) break;

    // Mark the chosen node as visited
    visited[closestNode] = true;

    // For each neighboring node of the current node
    for (let neighbor in graph[closestNode]) {
      // If the neighbor hasn't been visited yet
      if (!visited[neighbor]) {
        // Calculate tentative distance to the neighboring node

        let newDistance = distances[closestNode] + graph[closestNode][neighbor];

        // If the newly calculated distance is shorter than the previously known distance to this neighbor
        if (newDistance < distances[neighbor]) {
          // Update the shortest distance to this neighbor
          distances[neighbor] = newDistance;
        }
      }
    }
  }

  // Return the shortest distance from the start node to all nodes
  return distances;
}

function part1(map) {
  const graph = mazeToDirectedGraph(map);
  console.log("start", start);
  console.log("end", end);

  const startNode = getNodeId(0, start[0], start[1]);
  const endNode = getNodeId(3, end[0], end[1]);

  console.table(map);
  //   const pruned = removeDeadEnds(graph, startNode, endNode);

  const distances = dijkstra(graph, startNode);

  const prices = [
    distances[getNodeId(0, end[0], end[1])],
    distances[getNodeId(1, end[0], end[1])],
    distances[getNodeId(2, end[0], end[1])],
    distances[getNodeId(3, end[0], end[1])],
  ];

  console.log(prices);

  // const result = findPath(graph, startNodeId, endNodeId);

  //   plotPoints(Object.keys(pruned).map(nodeIdToXY));
  //   const result = dijkstra(pruned, startNode, endNode);
  //   plotPointsToMap(result.map(nodeIdToXY));
  //   console.log(result);

  //   console.log("Total Cost:", result.cost);
}

/// main ///
map = read()
  .split("\n")
  .map((line) => line.split(""));

part1(map);
