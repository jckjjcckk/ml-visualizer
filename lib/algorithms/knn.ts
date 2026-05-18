export type KnnDistanceMetric = "cosine" | "euclidean" | "manhattan";

export type KnnPoint2D = {
  x: number;
  y: number;
};

export type KnnSample2D = KnnPoint2D & {
  classLabel: string;
  id: string;
};

export type KnnNormalizationStats2D = {
  mean: KnnPoint2D;
  standardDeviation: KnnPoint2D;
};

export type KnnRankedNeighbor<TSample extends KnnSample2D = KnnSample2D> = {
  distance: number;
  rank: number;
  sample: TSample;
};

export type KnnVote = {
  classLabel: string;
  count: number;
  summedDistance: number;
};

export type KnnPredictionResult<TSample extends KnnSample2D = KnnSample2D> = {
  effectiveK: number;
  neighbors: readonly KnnRankedNeighbor<TSample>[];
  predictedClassLabel: string | null;
  votes: readonly KnnVote[];
};

type VoteAccumulator = {
  classLabel: string;
  count: number;
  order: number;
  summedDistance: number;
};

export function euclideanDistance(a: KnnPoint2D, b: KnnPoint2D): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function manhattanDistance(a: KnnPoint2D, b: KnnPoint2D): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function cosineDistance(a: KnnPoint2D, b: KnnPoint2D): number {
  const aMagnitude = Math.hypot(a.x, a.y);
  const bMagnitude = Math.hypot(b.x, b.y);

  if (aMagnitude === 0 && bMagnitude === 0) {
    return 0;
  }

  if (aMagnitude === 0 || bMagnitude === 0) {
    return 1;
  }

  const similarity = (a.x * b.x + a.y * b.y) / (aMagnitude * bMagnitude);

  return 1 - Math.max(-1, Math.min(1, similarity));
}

export function calculateKnnDistance(
  a: KnnPoint2D,
  b: KnnPoint2D,
  metric: KnnDistanceMetric,
): number {
  if (metric === "cosine") {
    return cosineDistance(a, b);
  }

  if (metric === "manhattan") {
    return manhattanDistance(a, b);
  }

  return euclideanDistance(a, b);
}

export function clampK(k: number, sampleCount: number): number {
  if (!Number.isFinite(k) || sampleCount <= 0) {
    return 0;
  }

  return Math.min(sampleCount, Math.max(1, Math.floor(k)));
}

export function calculateZScoreStats2D(
  samples: readonly KnnPoint2D[],
): KnnNormalizationStats2D {
  if (samples.length === 0) {
    return {
      mean: { x: 0, y: 0 },
      standardDeviation: { x: 1, y: 1 },
    };
  }

  const mean = samples.reduce<KnnPoint2D>(
    (total, sample) => ({
      x: total.x + sample.x,
      y: total.y + sample.y,
    }),
    { x: 0, y: 0 },
  );

  mean.x /= samples.length;
  mean.y /= samples.length;

  const variance = samples.reduce<KnnPoint2D>(
    (total, sample) => ({
      x: total.x + (sample.x - mean.x) ** 2,
      y: total.y + (sample.y - mean.y) ** 2,
    }),
    { x: 0, y: 0 },
  );

  variance.x /= samples.length;
  variance.y /= samples.length;

  return {
    mean,
    standardDeviation: {
      x: Math.sqrt(variance.x) || 1,
      y: Math.sqrt(variance.y) || 1,
    },
  };
}

export function normalizePointWithZScore(
  point: KnnPoint2D,
  stats: KnnNormalizationStats2D,
): KnnPoint2D {
  return {
    x: (point.x - stats.mean.x) / stats.standardDeviation.x,
    y: (point.y - stats.mean.y) / stats.standardDeviation.y,
  };
}

export function rankKnnNeighbors<TSample extends KnnSample2D>({
  metric,
  normalize = false,
  query,
  samples,
}: {
  metric: KnnDistanceMetric;
  normalize?: boolean;
  query: KnnPoint2D;
  samples: readonly TSample[];
}): readonly KnnRankedNeighbor<TSample>[] {
  const stats = normalize ? calculateZScoreStats2D(samples) : null;
  const preparedQuery = stats ? normalizePointWithZScore(query, stats) : query;

  return samples
    .map((sample, index) => {
      const preparedSample = stats
        ? normalizePointWithZScore(sample, stats)
        : sample;

      return {
        distance: calculateKnnDistance(preparedQuery, preparedSample, metric),
        index,
        sample,
      };
    })
    .sort((a, b) => a.distance - b.distance || a.index - b.index)
    .map(({ distance, sample }, index) => ({
      distance,
      rank: index + 1,
      sample,
    }));
}

export function summarizeKnnVotes<TSample extends KnnSample2D>({
  classOrder,
  neighbors,
}: {
  classOrder: readonly string[];
  neighbors: readonly KnnRankedNeighbor<TSample>[];
}): readonly KnnVote[] {
  const classOrderLookup = new Map<string, number>(
    classOrder.map((classLabel, index) => [classLabel, index]),
  );
  const voteMap = new Map<string, VoteAccumulator>();

  for (const neighbor of neighbors) {
    const classLabel = neighbor.sample.classLabel;
    const existing = voteMap.get(classLabel);

    if (existing) {
      existing.count += 1;
      existing.summedDistance += neighbor.distance;
      continue;
    }

    voteMap.set(classLabel, {
      classLabel,
      count: 1,
      order: classOrderLookup.get(classLabel) ?? classOrder.length + voteMap.size,
      summedDistance: neighbor.distance,
    });
  }

  return [...voteMap.values()]
    .sort(
      (a, b) =>
        b.count - a.count ||
        a.summedDistance - b.summedDistance ||
        a.order - b.order,
    )
    .map(({ classLabel, count, summedDistance }) => ({
      classLabel,
      count,
      summedDistance,
    }));
}

export function predictKnnClass<TSample extends KnnSample2D>({
  classOrder,
  k,
  metric,
  normalize = false,
  query,
  samples,
}: {
  classOrder: readonly string[];
  k: number;
  metric: KnnDistanceMetric;
  normalize?: boolean;
  query: KnnPoint2D;
  samples: readonly TSample[];
}): KnnPredictionResult<TSample> {
  const effectiveK = clampK(k, samples.length);
  const rankedNeighbors = rankKnnNeighbors({
    metric,
    normalize,
    query,
    samples,
  });
  const neighbors = rankedNeighbors.slice(0, effectiveK);
  const votes = summarizeKnnVotes({ classOrder, neighbors });

  return {
    effectiveK,
    neighbors,
    predictedClassLabel: votes[0]?.classLabel ?? null,
    votes,
  };
}
