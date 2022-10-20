module.exports = [
  {
    name: "assessment-worker",
    script: "ts-node",
    args: "src/workers/assessmentWorker.ts",
    watch: ["src"],
    autorestart: false,
  },
  {
    name: "scoring-worker",
    script: "ts-node",
    args: "src/workers/scoringWorker.ts",
    watch: ["src"],
    autorestart: false,
  },
];
