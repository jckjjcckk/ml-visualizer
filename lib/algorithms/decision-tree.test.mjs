import assert from "node:assert/strict";
import test from "node:test";
import {
  compareDecisionTreeDepths,
  entropyForDecisionTreeSamples,
  evaluateDecisionTreeSplit,
  extractDecisionTreeLeafRegions,
  findBestDecisionTreeSplit,
  predictDecisionTreeClass,
  trainDecisionTreeClassifier,
} from "./decision-tree.ts";

const classOrder = ["A", "B"];

const separableSamples = [
  { classLabel: "A", id: "a-1", split: "train", x: 0, y: 0 },
  { classLabel: "A", id: "a-2", split: "train", x: 1, y: 0 },
  { classLabel: "B", id: "b-1", split: "train", x: 2, y: 0 },
  { classLabel: "B", id: "b-2", split: "train", x: 3, y: 0 },
];

test("decision tree entropy measures class uncertainty in bits", () => {
  assert.equal(entropyForDecisionTreeSamples(separableSamples, classOrder), 1);
  assert.equal(
    entropyForDecisionTreeSamples(separableSamples.slice(0, 2), classOrder),
    0,
  );
});

test("decision tree split evaluation reports information gain", () => {
  const evaluation = evaluateDecisionTreeSplit({
    classOrder,
    samples: separableSamples,
    split: { axis: "x", threshold: 1.5 },
  });

  assert.ok(evaluation);
  assert.equal(evaluation.informationGain, 1);
  assert.equal(evaluation.leftCount, 2);
  assert.equal(evaluation.rightCount, 2);
});

test("decision tree picks midpoint splits and predicts with left/right convention", () => {
  const bestSplit = findBestDecisionTreeSplit({
    classOrder,
    samples: separableSamples,
  });
  const tree = trainDecisionTreeClassifier({
    classOrder,
    maxDepth: 1,
    samples: separableSamples,
  });

  assert.deepEqual(bestSplit?.split, { axis: "x", threshold: 1.5 });
  assert.equal(tree.kind, "split");
  assert.equal(predictDecisionTreeClass(tree, { x: 1.49, y: 0 }), "A");
  assert.equal(predictDecisionTreeClass(tree, { x: 1.5, y: 0 }), "B");
});

test("decision tree leaf regions map leaves back into plot-domain rectangles", () => {
  const tree = trainDecisionTreeClassifier({
    classOrder,
    maxDepth: 1,
    samples: separableSamples,
  });
  const regions = extractDecisionTreeLeafRegions({
    domain: { x: [0, 4], y: [0, 1] },
    tree,
  });

  assert.equal(regions.length, 2);
  assert.deepEqual(
    regions.map((region) => ({
      classLabel: region.classLabel,
      x0: region.x0,
      x1: region.x1,
    })),
    [
      { classLabel: "A", x0: 0, x1: 1.5 },
      { classLabel: "B", x0: 1.5, x1: 4 },
    ],
  );
});

test("decision tree depth comparison trains on train split and scores validation split", () => {
  const samples = [
    ...separableSamples,
    { classLabel: "A", id: "validation-a", split: "validation", x: 0.25, y: 0 },
    { classLabel: "B", id: "validation-b", split: "validation", x: 2.75, y: 0 },
  ];
  const comparisons = compareDecisionTreeDepths({
    classOrder,
    depths: [0, 1, 2],
    samples,
  });

  assert.equal(comparisons.length, 3);
  assert.equal(comparisons[0].trainingAccuracy, 0.5);
  assert.equal(comparisons[1].trainingAccuracy, 1);
  assert.equal(comparisons[1].validationAccuracy, 1);
  assert.equal(comparisons[2].validationError, 0);
});
