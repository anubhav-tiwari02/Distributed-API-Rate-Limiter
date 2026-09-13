const autocannon = require("autocannon");

const url = "http://localhost:8080/api/rate-limit/fixed-window";

const instance = autocannon(
  {
    url,
    connections: 10,
    duration: 30,
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      config: {
        maxRequests: 100000,
        windowSeconds: 60,
      },
    }),

    setupClient: (client) => {
      client.setBody(
        JSON.stringify({
          config: {
            maxRequests: 100000,
            windowSeconds: 60,
          },
        }),
      );
    },
  },
  finishedBenchmark,
);

autocannon.track(instance);

function finishedBenchmark(err, result) {
  if (err) {
    console.error("Benchmark error:", err);
    return;
  }

  console.log("\n========== BENCHMARK SUMMARY ==========");
  console.log(`Total requests: ${result.requests?.total}`);
  console.log(`Average throughput: ${result.requests?.average} req/sec`);
  console.log(`Average latency: ${result.latency?.average} ms`);
  console.log(`P99 latency: ${result.latency?.p99} ms`);
  console.log(`Errors: ${result.errors}`);
  console.log(`Timeouts: ${result.timeouts}`);
  console.log("========================================");
}