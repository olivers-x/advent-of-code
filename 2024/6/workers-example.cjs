const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");

if (isMainThread) {
  // Main thread logic
  async function parallelizeComputation() {
    // Define tasks (ranges for computation)
    const tasks = [
      { start: 1, end: 1000000 },
      { start: 1000001, end: 2000000 },
      { start: 2000001, end: 3000000 },
      { start: 3000001, end: 4000000 },
    ];

    // Function to run a worker
    function runWorker(task) {
      return new Promise((resolve, reject) => {
        const worker = new Worker(__filename, { workerData: task }); // Spawn worker using the same file
        worker.on("message", resolve); // Resolve promise on successful result
        worker.on("error", reject); // Reject promise on error
        worker.on("exit", (code) => {
          // Handle worker exit
          if (code !== 0) {
            reject(new Error(`Worker stopped with exit code ${code}`));
          }
        });
      });
    }

    // Run all workers in parallel
    const results = await Promise.all(tasks.map((task) => runWorker(task)));

    // Combine results from all workers
    const totalSum = results.reduce(
      (sum, workerResult) => sum + workerResult,
      0
    );
    console.log("Total Sum of Squares:", totalSum);
  }

  // Run the main function
  parallelizeComputation().catch((err) => console.error(err));
} else {
  // Worker thread logic
  const { start, end } = workerData;

  // Heavy computation function
  function heavyComputation(start, end) {
    let sum = 0;
    for (let i = start; i <= end; i++) {
      sum += i * i; // Sum of squares
    }
    return sum;
  }

  // Perform computation and send result to the main thread
  const result = heavyComputation(start, end);
  parentPort.postMessage(result);
}
