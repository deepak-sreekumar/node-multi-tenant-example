module.exports = [
  {
    name: "scoring-worker",
    script: "ts-node",
    args: "src/workers/worker.ts",
    watch: ["src"],
    autorestart: false,
  },
];
