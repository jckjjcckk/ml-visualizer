export type DecisionTreeAxis2D = "x" | "y";

export type DecisionTreeSample2D = {
  classLabel: string;
  id: string;
  split?: string;
  x: number;
  y: number;
};

export type DecisionTreeDomain2D = {
  x: readonly [number, number];
  y: readonly [number, number];
};

export type DecisionTreeClassCount = {
  classLabel: string;
  count: number;
};

export type DecisionTreeSplit = {
  axis: DecisionTreeAxis2D;
  threshold: number;
};

export type DecisionTreeSplitEvaluation = {
  informationGain: number;
  leftClassCounts: readonly DecisionTreeClassCount[];
  leftCount: number;
  leftEntropy: number;
  parentClassCounts: readonly DecisionTreeClassCount[];
  parentEntropy: number;
  rightClassCounts: readonly DecisionTreeClassCount[];
  rightCount: number;
  rightEntropy: number;
  split: DecisionTreeSplit;
  weightedChildEntropy: number;
};

export type DecisionTreeLeafNode = {
  classCounts: readonly DecisionTreeClassCount[];
  classLabel: string | null;
  depth: number;
  id: string;
  kind: "leaf";
  sampleIds: readonly string[];
};

export type DecisionTreeSplitNode = {
  classCounts: readonly DecisionTreeClassCount[];
  classLabel: string | null;
  depth: number;
  id: string;
  informationGain: number;
  kind: "split";
  left: DecisionTreeNode;
  right: DecisionTreeNode;
  sampleIds: readonly string[];
  split: DecisionTreeSplit;
};

export type DecisionTreeNode = DecisionTreeLeafNode | DecisionTreeSplitNode;

export type DecisionTreeLeafRegion = {
  classCounts: readonly DecisionTreeClassCount[];
  classLabel: string | null;
  depth: number;
  nodeId: string;
  sampleIds: readonly string[];
  x0: number;
  x1: number;
  y0: number;
  y1: number;
};

export type DecisionTreeDepthComparison = {
  maxDepth: number;
  tree: DecisionTreeNode;
  trainingAccuracy: number | null;
  trainingError: number | null;
  validationAccuracy: number | null;
  validationError: number | null;
};

const DEFAULT_MIN_INFORMATION_GAIN = 1e-12;

export function countDecisionTreeClasses(
  samples: readonly DecisionTreeSample2D[],
  classOrder: readonly string[],
): readonly DecisionTreeClassCount[] {
  const counts = new Map<string, number>(
    classOrder.map((classLabel) => [classLabel, 0]),
  );

  for (const sample of samples) {
    counts.set(sample.classLabel, (counts.get(sample.classLabel) ?? 0) + 1);
  }

  const orderedLabels = [
    ...classOrder,
    ...[...counts.keys()].filter((classLabel) => !classOrder.includes(classLabel)),
  ];

  return orderedLabels
    .map((classLabel) => ({
      classLabel,
      count: counts.get(classLabel) ?? 0,
    }))
    .filter((classCount) => classCount.count > 0);
}

export function entropyFromClassCounts(
  classCounts: readonly DecisionTreeClassCount[],
): number {
  const totalCount = classCounts.reduce(
    (total, classCount) => total + classCount.count,
    0,
  );

  if (totalCount === 0) {
    return 0;
  }

  return classCounts.reduce((entropy, classCount) => {
    if (classCount.count === 0) {
      return entropy;
    }

    const probability = classCount.count / totalCount;

    return entropy - probability * Math.log2(probability);
  }, 0);
}

export function entropyForDecisionTreeSamples(
  samples: readonly DecisionTreeSample2D[],
  classOrder: readonly string[],
): number {
  return entropyFromClassCounts(countDecisionTreeClasses(samples, classOrder));
}

export function getDecisionTreeMajorityClassLabel({
  classOrder,
  samples,
}: {
  classOrder: readonly string[];
  samples: readonly DecisionTreeSample2D[];
}): string | null {
  const classCounts = countDecisionTreeClasses(samples, classOrder);

  if (classCounts.length === 0) {
    return null;
  }

  const classOrderLookup = new Map<string, number>(
    classOrder.map((classLabel, index) => [classLabel, index]),
  );

  return [...classCounts].sort(
    (a, b) =>
      b.count - a.count ||
      (classOrderLookup.get(a.classLabel) ?? classOrder.length) -
        (classOrderLookup.get(b.classLabel) ?? classOrder.length),
  )[0].classLabel;
}

export function generateDecisionTreeCandidateSplits(
  samples: readonly DecisionTreeSample2D[],
): readonly DecisionTreeSplit[] {
  return (["x", "y"] as const).flatMap((axis) => {
    const values = [...new Set(samples.map((sample) => sample[axis]))]
      .filter(Number.isFinite)
      .sort((a, b) => a - b);

    return values.slice(1).map((value, index) => ({
      axis,
      threshold: (values[index] + value) / 2,
    }));
  });
}

export function partitionDecisionTreeSamples({
  samples,
  split,
}: {
  samples: readonly DecisionTreeSample2D[];
  split: DecisionTreeSplit;
}): {
  left: readonly DecisionTreeSample2D[];
  right: readonly DecisionTreeSample2D[];
} {
  const left: DecisionTreeSample2D[] = [];
  const right: DecisionTreeSample2D[] = [];

  for (const sample of samples) {
    if (sample[split.axis] < split.threshold) {
      left.push(sample);
    } else {
      right.push(sample);
    }
  }

  return { left, right };
}

export function evaluateDecisionTreeSplit({
  classOrder,
  samples,
  split,
}: {
  classOrder: readonly string[];
  samples: readonly DecisionTreeSample2D[];
  split: DecisionTreeSplit;
}): DecisionTreeSplitEvaluation | null {
  const { left, right } = partitionDecisionTreeSamples({ samples, split });

  if (left.length === 0 || right.length === 0) {
    return null;
  }

  const parentClassCounts = countDecisionTreeClasses(samples, classOrder);
  const leftClassCounts = countDecisionTreeClasses(left, classOrder);
  const rightClassCounts = countDecisionTreeClasses(right, classOrder);
  const parentEntropy = entropyFromClassCounts(parentClassCounts);
  const leftEntropy = entropyFromClassCounts(leftClassCounts);
  const rightEntropy = entropyFromClassCounts(rightClassCounts);
  const weightedChildEntropy =
    (left.length / samples.length) * leftEntropy +
    (right.length / samples.length) * rightEntropy;

  return {
    informationGain: parentEntropy - weightedChildEntropy,
    leftClassCounts,
    leftCount: left.length,
    leftEntropy,
    parentClassCounts,
    parentEntropy,
    rightClassCounts,
    rightCount: right.length,
    rightEntropy,
    split,
    weightedChildEntropy,
  };
}

export function findBestDecisionTreeSplit({
  candidateSplits,
  classOrder,
  samples,
}: {
  candidateSplits?: readonly DecisionTreeSplit[];
  classOrder: readonly string[];
  samples: readonly DecisionTreeSample2D[];
}): DecisionTreeSplitEvaluation | null {
  let bestEvaluation: DecisionTreeSplitEvaluation | null = null;
  const splits = candidateSplits ?? generateDecisionTreeCandidateSplits(samples);

  for (const split of splits) {
    const evaluation = evaluateDecisionTreeSplit({
      classOrder,
      samples,
      split,
    });

    if (!evaluation) {
      continue;
    }

    if (
      !bestEvaluation ||
      evaluation.informationGain > bestEvaluation.informationGain ||
      (evaluation.informationGain === bestEvaluation.informationGain &&
        compareDecisionTreeSplits(evaluation.split, bestEvaluation.split) < 0)
    ) {
      bestEvaluation = evaluation;
    }
  }

  return bestEvaluation;
}

export function trainDecisionTreeClassifier({
  classOrder,
  maxDepth,
  minInformationGain = DEFAULT_MIN_INFORMATION_GAIN,
  samples,
}: {
  classOrder: readonly string[];
  maxDepth: number;
  minInformationGain?: number;
  samples: readonly DecisionTreeSample2D[];
}): DecisionTreeNode {
  const safeMaxDepth = Math.max(0, Math.floor(maxDepth));

  return buildDecisionTreeNode({
    classOrder,
    depth: 0,
    id: "root",
    maxDepth: safeMaxDepth,
    minInformationGain,
    samples,
  });
}

export function predictDecisionTreeClass(
  tree: DecisionTreeNode,
  point: Pick<DecisionTreeSample2D, "x" | "y">,
): string | null {
  if (tree.kind === "leaf") {
    return tree.classLabel;
  }

  if (point[tree.split.axis] < tree.split.threshold) {
    return predictDecisionTreeClass(tree.left, point);
  }

  return predictDecisionTreeClass(tree.right, point);
}

export function extractDecisionTreeLeafRegions({
  domain,
  tree,
}: {
  domain: DecisionTreeDomain2D;
  tree: DecisionTreeNode;
}): readonly DecisionTreeLeafRegion[] {
  return collectLeafRegions({
    region: {
      x0: domain.x[0],
      x1: domain.x[1],
      y0: domain.y[0],
      y1: domain.y[1],
    },
    tree,
  });
}

export function compareDecisionTreeDepths({
  classOrder,
  depths,
  samples,
}: {
  classOrder: readonly string[];
  depths: readonly number[];
  samples: readonly DecisionTreeSample2D[];
}): readonly DecisionTreeDepthComparison[] {
  const trainingSamples = samples.filter((sample) => sample.split !== "validation");
  const validationSamples = samples.filter(
    (sample) => sample.split === "validation",
  );

  return depths.map((maxDepth) => {
    const tree = trainDecisionTreeClassifier({
      classOrder,
      maxDepth,
      samples: trainingSamples,
    });
    const trainingAccuracy = calculateDecisionTreeAccuracy(tree, trainingSamples);
    const validationAccuracy = calculateDecisionTreeAccuracy(tree, validationSamples);

    return {
      maxDepth,
      tree,
      trainingAccuracy,
      trainingError:
        trainingAccuracy === null ? null : 1 - trainingAccuracy,
      validationAccuracy,
      validationError:
        validationAccuracy === null ? null : 1 - validationAccuracy,
    };
  });
}

export function calculateDecisionTreeAccuracy(
  tree: DecisionTreeNode,
  samples: readonly DecisionTreeSample2D[],
): number | null {
  if (samples.length === 0) {
    return null;
  }

  const correctCount = samples.filter(
    (sample) => predictDecisionTreeClass(tree, sample) === sample.classLabel,
  ).length;

  return correctCount / samples.length;
}

function buildDecisionTreeNode({
  classOrder,
  depth,
  id,
  maxDepth,
  minInformationGain,
  samples,
}: {
  classOrder: readonly string[];
  depth: number;
  id: string;
  maxDepth: number;
  minInformationGain: number;
  samples: readonly DecisionTreeSample2D[];
}): DecisionTreeNode {
  const classCounts = countDecisionTreeClasses(samples, classOrder);
  const classLabel = getDecisionTreeMajorityClassLabel({ classOrder, samples });
  const sampleIds = samples.map((sample) => sample.id);

  if (
    depth >= maxDepth ||
    samples.length === 0 ||
    classCounts.length <= 1
  ) {
    return {
      classCounts,
      classLabel,
      depth,
      id,
      kind: "leaf",
      sampleIds,
    };
  }

  const bestSplit = findBestDecisionTreeSplit({ classOrder, samples });

  if (!bestSplit || bestSplit.informationGain <= minInformationGain) {
    return {
      classCounts,
      classLabel,
      depth,
      id,
      kind: "leaf",
      sampleIds,
    };
  }

  const { left, right } = partitionDecisionTreeSamples({
    samples,
    split: bestSplit.split,
  });

  return {
    classCounts,
    classLabel,
    depth,
    id,
    informationGain: bestSplit.informationGain,
    kind: "split",
    left: buildDecisionTreeNode({
      classOrder,
      depth: depth + 1,
      id: `${id}-left`,
      maxDepth,
      minInformationGain,
      samples: left,
    }),
    right: buildDecisionTreeNode({
      classOrder,
      depth: depth + 1,
      id: `${id}-right`,
      maxDepth,
      minInformationGain,
      samples: right,
    }),
    sampleIds,
    split: bestSplit.split,
  };
}

function collectLeafRegions({
  region,
  tree,
}: {
  region: Omit<DecisionTreeLeafRegion, "classCounts" | "classLabel" | "depth" | "nodeId" | "sampleIds">;
  tree: DecisionTreeNode;
}): readonly DecisionTreeLeafRegion[] {
  if (tree.kind === "leaf") {
    return [
      {
        ...region,
        classCounts: tree.classCounts,
        classLabel: tree.classLabel,
        depth: tree.depth,
        nodeId: tree.id,
        sampleIds: tree.sampleIds,
      },
    ];
  }

  if (tree.split.axis === "x") {
    return [
      ...collectLeafRegions({
        region: {
          ...region,
          x1: Math.min(region.x1, tree.split.threshold),
        },
        tree: tree.left,
      }),
      ...collectLeafRegions({
        region: {
          ...region,
          x0: Math.max(region.x0, tree.split.threshold),
        },
        tree: tree.right,
      }),
    ];
  }

  return [
    ...collectLeafRegions({
      region: {
        ...region,
        y1: Math.min(region.y1, tree.split.threshold),
      },
      tree: tree.left,
    }),
    ...collectLeafRegions({
      region: {
        ...region,
        y0: Math.max(region.y0, tree.split.threshold),
      },
      tree: tree.right,
    }),
  ];
}

function compareDecisionTreeSplits(
  a: DecisionTreeSplit,
  b: DecisionTreeSplit,
): number {
  if (a.axis !== b.axis) {
    return a.axis === "x" ? -1 : 1;
  }

  return a.threshold - b.threshold;
}
