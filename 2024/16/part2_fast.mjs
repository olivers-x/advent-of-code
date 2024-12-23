import { read, sum, unique } from "../lib.mjs";

let map;
let start;
let end;
let rows;
let cols;

const OFFSET = 8;
const getNodeId = (dir, x, y) => (((x << OFFSET) + y) << 2) + dir;

const nodeIdToXY = (nodeId) => {
  const dir = nodeId % 4;
  const xy = nodeId >>> 2;
  const y = xy % 2 ** OFFSET;
  const x = xy >> OFFSET;

  return [x, y, dir];
};

const [x, y] = nodeIdToXY(getNodeId(0, 2, 3));

console.assert(x == 2 && y === 3, "Node Id is wrong", x, y);

const key = (x, y) => x + "," + y;
const keyToXY = (k) => JSON.parse("[" + k + "]");

function findSE(maze) {
  rows = maze.length;
  cols = maze[0].length;

  if (maze[rows - 2][1] === "S" && maze[1][cols - 2] === "E") {
    start = [rows - 2, 1];
    end = [1, cols - 2];
    return;
  }

  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      if (maze[x][y] === "S") {
        start = [x, y];
      } else if (maze[x][y] === "E") {
        end = [x, y];
      }
    }
    if (start && end) break;
  }

  if (!start) {
    throw new Error("No starting point 'S' found in the maze");
  }
}

const DIRECTIONS = [
  [0, 1], // Right  >
  [1, 0], // Down   v
  [0, -1], // Left  <
  [-1, 0], // Up    ^
];

function mazeToUndirectedGraph(maze) {
  findSE(maze);

  const graph = {};
  const branchingPoints = {};
  branchingPoints[key(...start)] = true;
  branchingPoints[key(...end)] = true;

  function insert(x, y) {
    let nPossiblePaths = 0;

    DIRECTIONS.forEach((d, di) => {
      const nx = x + d[0];
      const ny = y + d[1];
      if (maze[nx][ny] !== "#") {
        graph[key(x, y)] ??= {};
        graph[key(x, y)][key(nx, ny)] = { distance: 1, direction: di };
        nPossiblePaths++;
      }

      if (nPossiblePaths > 2) {
        branchingPoints[key(x, y)] = true;
      }
    });
  }

  for (let x = 0; x < rows; x++)
    for (let y = 0; y < cols; y++) {
      if (maze[x][y] !== "#") insert(x, y);
    }

  return { graph, branchingPoints };
}

function mazeToDirectedGraph(maze) {
  findSE(maze);

  const startNode = key(start[0], start[1]);
  const branchingPoints = {};

  const graph = {};
  const visited = {};

  function walk(x, y, currentDir) {
    const nodeId = key(x, y);

    // if (visited.has(nodeId)) return;

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

    validDirections.forEach((dir) => {
      const [dx, dy] = DIRECTIONS[dir];

      const nx = x + dx;
      const ny = y + dy;

      const neighborId = key(nx, ny);

      const weight = dir === currentDir ? 1 : 1001;

      graph[nodeId][neighborId] = { distance: 1, direction: dir };

      if (visited[nodeId] < 4) {
        walk(nx, ny, dir);
      }
    });
  }

  // start right
  walk(start[0], start[1], 0);

  return { graph, branchingPoints };
}

function compressDirectedGraph(graph, branchingPoints) {
  const compressedGraph = {};

  const graphNodes = Object.keys(graph);
  for (const startNode of graphNodes) {
    console.log(startNode);
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

function compressUndirectedGraph(graph, branchingPoints) {
  const compressedGraph = {};
  const deadEnds = [];

  for (const node in graph) {
    if (!branchingPoints[node]) continue; // Only process branching nodes

    const neighbors = graph[node];
    if (!compressedGraph[node]) compressedGraph[node] = {};

    for (const neighbor in neighbors) {
      let currentNode = neighbor;
      let totalWeight = graph[node][neighbor].distance;
      let direction = graph[node][neighbor].direction;
      let previousNode = node;

      // Follow the path until a branching node is reached or there is a turn
      while (
        !branchingPoints[currentNode] &&
        node.direction === neighbor.direction
      ) {
        const nextNodes = Object.keys(graph[currentNode]);
        const nextNode = nextNodes.find((n) => n !== previousNode); // Avoid going back

        if (!nextNode) {
          deadEnds.push(currentNode);
          break; // Dead end
        }
        totalWeight += graph[currentNode][nextNode].distance;
        previousNode = currentNode;
        currentNode = nextNode;
      }

      // Add the compressed edge to the graph
      compressedGraph[node][currentNode] = {
        distance: totalWeight,
        direction,
      };

      // Ensure the target node exists in the graph
      if (!compressedGraph[currentNode]) compressedGraph[currentNode] = {};
    }
  }

  for (const node in compressedGraph) {
    deadEnds.forEach((deadEnd) => {
      delete compressedGraph[node][deadEnd];
    });
  }

  deadEnds.forEach((deadEnd) => {
    delete compressedGraph[deadEnd];
  });

  return compressedGraph;
}

function dijkstra(graph, start) {
  const distances = {};
  const visited = {};
  const previous = {};
  const nodes = Object.keys(graph);

  // Initially, set the shortest distance to every node as Infinity
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

        // If the newly calculated distance is shorter than the previously known distance to this neighbor
        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;

          previous[neighbor] = [node];
        } else if (newDistance === distances[neighbor]) {
          previous[neighbor].push(node);
        }
      }
    }
  }

  return { distances, previous };
}

function directional_dijkstra(graph, start, startDir, end) {
  const _distances = {};
  const visited = {};
  const previous = {};
  const splitPoints = [];
  const nodes = Object.keys(graph);
  let cycles = 0;

  for (let node of nodes) {
    _distances[node] = [Infinity, Infinity, Infinity, Infinity];
  }

  _distances[start] = [0, Infinity, Infinity, Infinity];

  const pq = [
    {
      direction: startDir,
      node: start,
      weight: 0,
    },
  ];

  const getNewDistance = (from, to, dir) => {
    let { distance, direction } = graph[from][to];

    if (dir === direction) return { distance, direction };

    if (Math.abs(dir - direction) === 2) {
      // console.log("opposite direction");
      return { distance: distance + 2000, direction };
    }

    return { distance: distance + 1000, direction };
  };

  const getCurrentDistance = (to, dir) => _distances[to][dir];

  const getNeighborDistance = (to, dir) => {
    return _distances[to][dir];
  };

  const compare = (a, b) => a.weight - b.weight;

  while (pq.length) {
    const state = pq.shift();
    pq.sort(compare);

    let { node, direction: d } = state;

    if (node === end) break;

    visited[node] ??= [];
    if (visited[node][d]) continue;
    visited[node][d] = true;

    for (let neighbor in graph[node]) {
      const { distance: newDistance, direction: newDirection } = getNewDistance(
        node,
        neighbor,
        d
      );

      const currentDistance = getCurrentDistance(node, d);
      const neighborDistance = getNeighborDistance(neighbor, newDirection);
      const totalNewDistance = currentDistance + newDistance;

      if (totalNewDistance < neighborDistance) {
        _distances[neighbor][newDirection] = totalNewDistance;

        previous[node] = [];
      } else if (totalNewDistance === neighborDistance) {
      }

      const direction = graph[node][neighbor].direction;

      if (Math.abs(direction - d) === 2) continue;

      const schedule = { node: neighbor, direction, weight: currentDistance };
      pq.unshift(schedule);
    }
  }

  return { distances: _distances, previous, splitPoints };
}

function reconstructAllPaths(previous, start, end) {
  const paths = [];
  const stack = [[end, []]];

  while (stack.length > 0) {
    const [currentNode, path] = stack.pop();
    const newPath = [currentNode, ...path];

    if (currentNode === start) {
      paths.push(newPath);
      continue;
    }

    if (previous[currentNode]) {
      for (const prevNode of previous[currentNode]) {
        stack.push([prevNode, newPath]);
      }
    }
  }

  return paths;
}
function part2_fast(map) {
  const t0 = performance.now();

  // const { graph: undirected, branchingPoints } = mazeToUndirectedGraph(map);

  const { graph } = mazeToDirectedGraph(map);
  console.log("START @", start);
  console.log("END @", end);

  const startKey = key(...start);
  const endKey = key(...end);

  const t1 = performance.now();
  console.log("\x1b[41m  map to graph \x1b[0m", t1 - t0);

  // const compressed = compressUndirectedGraph(graph, branchingPoints);

  //   if (!compressed[key(...start)]) compressed[key(...start)] = {};
  //   if (!compressed[key(...end)]) compressed[key(...end)] = {};

  // console.log(compressed, "compressed");
  // console.log(graph);

  const t2 = performance.now();
  console.log("graph compression", t2 - t1);

  const { distances, previous } = directional_dijkstra(
    graph,
    startKey,
    0,
    endKey
  );

  const t3 = performance.now();
  console.log("dijkstra", t3 - t2);

  // for (let node in distances) {
  //   const [x, y] = keyToXY(node);
  //   map[x][y] = Math.min(...distances[node]);
  // }

  const shortestDistance = Math.min(...distances[endKey]);

  console.log("shortestDistance", shortestDistance);

  // console.log(distances);

  const t4 = performance.now();

  console.log("previous", previous);

  const minDists = Object.keys(distances).filter((key) => {
    const min = Math.min(...distances[key]);
    const [x, y] = keyToXY(key);

    map[x][y] = min;

    if (min === Infinity) return false;

    if (distances[key].includes(min + 1000)) return true;

    return false;
  });

  console.log(minDists);

  const visited = { [startKey]: true };
  function countPrevious(node) {
    const nodes = previous[node];
    delete previous[node];

    if (!nodes) return;

    const flatted = nodes.filter((a) => typeof a === "Array").flat();
    console.log("flatted", flatted);

    if (!flatted) return;

    if (flatted.length === 1) {
      const [node] = nodes;
      const [x, y] = keyToXY(node);
      // if (visited[node]) return;
      visited[node] = true;
      countPrevious(node);
      map[x][y] = "x";
    } else {
      flatted.forEach(countPrevious);
    }
  }

  countPrevious(endKey);

  console.table(map);

  console.log("part2", t4 - t3);

  // console.log(visited);
  console.log(Object.keys(visited).length);
}

function part2(map) {
  const t0 = performance.now();

  const { graph, branchingPoints } = mazeToDirectedGraph(map);
  const t1 = performance.now();

  console.log("\x1b[41m  map to graph \x1b[0m", t1 - t0);

  const startNode = getNodeId(0, start[0], start[1]);
  const endNode = getNodeId(3, end[0], end[1]);

  const compressed = compressDirectedGraph(graph, branchingPoints);
  const t2 = performance.now();

  console.log("graph compression", t2 - t1);

  const { distances, previous } = dijkstra(compressed, startNode);

  const prices = [
    distances[getNodeId(0, end[0], end[1])],
    distances[getNodeId(1, end[0], end[1])],
    distances[getNodeId(2, end[0], end[1])],
    distances[getNodeId(3, end[0], end[1])],
  ]; // .sort((a, b) => a - b);

  console.log(prices);

  const t3 = performance.now();

  console.log("dijkstra", t3 - t2);

  const visited = { [endNode]: 0 };
  const splitPoints = [];
  let totalDistance = 0;

  function countPrevious(node) {
    const nodes = previous[node];

    if (!nodes) return;

    if (nodes.length === 1) {
      const [node] = nodes;
      if (visited[node]) {
        console.log("visited - ", node);
        return;
      }

      const [x, y, dir] = nodeIdToXY(node);
      console.log(x, y, [">", "v", "<", "^"][dir], distances[node] % 1000);

      const d = distances[node] % 1000;
      visited[node] = d;
      totalDistance += d;
      countPrevious(node);
      map[x][y] = 0;
    } else {
      console.log("split");
      nodes.forEach(countPrevious);
      //   countPrevious(nodes[0]);
      nodes.forEach((n) => {
        const [x, y, dir] = nodeIdToXY(n);
        console.log("split @", x, y, dir);
        map[x][y] = 7;
        splitPoints.push(n);
      });

      // countPrevious(nodes[0]);
    }
  }

  countPrevious(endNode);
  // visited[start] = true;

  console.log(visited);
  console.log("splitPoints", splitPoints);
  console.log(Object.values(visited).reduce(sum));
  console.log(totalDistance, totalDistance);

  console.table(map);

  const t4 = performance.now();
  console.log("part 2", t4 - t3);
}

/// main ///
map = read()
  .split("\n")
  .map((line) => line.split(""));

part2_fast(map);
