import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateZScoreStats2D,
  cosineDistance,
  euclideanDistance,
  manhattanDistance,
  normalizePointWithZScore,
  predictKnnClass,
  rankKnnNeighbors,
} from "./knn.ts";

test("kNN distance helpers calculate Euclidean, Manhattan, and Cosine distances", () => {
  const a = { x: 0, y: 0 };
  const b = { x: 3, y: 4 };

  assert.equal(euclideanDistance(a, b), 5);
  assert.equal(manhattanDistance(a, b), 7);
  assert.equal(cosineDistance({ x: 1, y: 0 }, { x: 0, y: 1 }), 1);
  assert.equal(cosineDistance({ x: 1, y: 0 }, { x: 2, y: 0 }), 0);
});

test("kNN z-score normalization uses training-set mean and standard deviation", () => {
  const stats = calculateZScoreStats2D([
    { x: 0, y: 0 },
    { x: 2, y: 4 },
  ]);

  assert.deepEqual(stats, {
    mean: { x: 1, y: 2 },
    standardDeviation: { x: 1, y: 2 },
  });
  assert.deepEqual(normalizePointWithZScore({ x: 2, y: 4 }, stats), {
    x: 1,
    y: 1,
  });
});

test("kNN ranks neighbors deterministically and clamps k", () => {
  const samples = [
    { classLabel: "A", id: "a-near", x: 0, y: 0 },
    { classLabel: "B", id: "b-mid", x: 0, y: 2 },
    { classLabel: "A", id: "a-far", x: 0, y: 4 },
  ];
  const query = { x: 0, y: 0 };

  assert.deepEqual(
    rankKnnNeighbors({
      metric: "euclidean",
      query,
      samples,
    }).map((neighbor) => neighbor.sample.id),
    ["a-near", "b-mid", "a-far"],
  );

  const prediction = predictKnnClass({
    classOrder: ["A", "B"],
    k: 99,
    metric: "euclidean",
    query,
    samples,
  });

  assert.equal(prediction.effectiveK, 3);
  assert.equal(prediction.predictedClassLabel, "A");
});

test("kNN cosine distance can change nearest-neighbor ranking", () => {
  const samples = [
    { classLabel: "A", id: "a-same-direction", x: 10, y: 0 },
    { classLabel: "B", id: "b-near-euclidean", x: 1, y: 1 },
  ];
  const query = { x: 1, y: 0 };

  const prediction = predictKnnClass({
    classOrder: ["A", "B"],
    k: 1,
    metric: "cosine",
    query,
    samples,
  });

  assert.equal(prediction.neighbors[0].sample.id, "a-same-direction");
  assert.equal(prediction.predictedClassLabel, "A");
});

test("kNN tie breaks by vote count, summed distance, then class order", () => {
  const distanceTieSamples = [
    { classLabel: "A", id: "a", x: 0, y: 0 },
    { classLabel: "B", id: "b", x: 0, y: 1 },
  ];
  const distanceTie = predictKnnClass({
    classOrder: ["B", "A"],
    k: 2,
    metric: "euclidean",
    query: { x: 0, y: 0 },
    samples: distanceTieSamples,
  });

  assert.equal(distanceTie.predictedClassLabel, "A");

  const classOrderTieSamples = [
    { classLabel: "A", id: "a", x: 1, y: 0 },
    { classLabel: "B", id: "b", x: -1, y: 0 },
  ];
  const classOrderTie = predictKnnClass({
    classOrder: ["B", "A"],
    k: 2,
    metric: "euclidean",
    query: { x: 0, y: 0 },
    samples: classOrderTieSamples,
  });

  assert.equal(classOrderTie.predictedClassLabel, "B");
});

test("kNN normalization changes ranking in scale-sensitive data", () => {
  const samples = [
    { classLabel: "negative", id: "negative", x: 0, y: 0 },
    { classLabel: "positive", id: "positive", x: 1000, y: 1 },
  ];
  const query = { x: 900, y: 0 };

  const raw = predictKnnClass({
    classOrder: ["negative", "positive"],
    k: 1,
    metric: "euclidean",
    query,
    samples,
  });
  const normalized = predictKnnClass({
    classOrder: ["negative", "positive"],
    k: 1,
    metric: "euclidean",
    normalize: true,
    query,
    samples,
  });

  assert.equal(raw.predictedClassLabel, "positive");
  assert.equal(normalized.predictedClassLabel, "negative");
});
