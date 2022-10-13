module.exports = [
  {
    name: "assessment-worker",
    script: "ts-node",
    args: "src/workers/worker.ts",
    watch: ["src"],
    autorestart: false,
  },
];
