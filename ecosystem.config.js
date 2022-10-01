module.exports = [
  {
    name: "scoring-worker",
    script: "ts-node",
    args: "src/worker.ts",
    watch: ["src"],
    autorestart: false,
  },
];
