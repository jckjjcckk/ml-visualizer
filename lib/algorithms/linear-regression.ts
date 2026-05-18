export type LinearRegressionSample1D = {
  id?: string;
  target: number;
  x: number;
};

export type LinearRegressionModel = {
  intercept: number;
  slope: number;
};

export type LinearRegressionFitStatus = "constant-x" | "empty" | "non-finite" | "ok";

export type LinearRegressionFitResult =
  | {
      model: LinearRegressionModel;
      status: "ok";
    }
  | {
      model: null;
      status: Exclude<LinearRegressionFitStatus, "ok">;
    };

export type LinearRegressionResidual = {
  id?: string;
  prediction: number;
  residual: number;
  squaredResidual: number;
  target: number;
  x: number;
};

export type LinearRegressionGradient = {
  intercept: number;
  slope: number;
};

export type LinearRegressionGradientFrame = {
  gradient: LinearRegressionGradient;
  gradientNorm: number;
  iteration: number;
  model: LinearRegressionModel;
  mse: number;
  objective: number;
};

export type LinearRegressionGradientDescentStatus =
  | "converged"
  | "diverged"
  | "empty"
  | "non-finite"
  | "ok";

export type LinearRegressionGradientDescentResult = {
  frames: readonly LinearRegressionGradientFrame[];
  status: LinearRegressionGradientDescentStatus;
};

const CONSTANT_X_EPSILON = 1e-12;
const DEFAULT_DIVERGENCE_LIMIT = 1e12;
const DEFAULT_TOLERANCE = 1e-8;

export function fitLinearRegressionClosedForm(
  samples: readonly LinearRegressionSample1D[],
): LinearRegressionFitResult {
  if (samples.length === 0) {
    return { model: null, status: "empty" };
  }

  if (!areLinearRegressionSamplesFinite(samples)) {
    return { model: null, status: "non-finite" };
  }

  const count = samples.length;
  const sums = samples.reduce(
    (total, sample) => ({
      sumTarget: total.sumTarget + sample.target,
      sumX: total.sumX + sample.x,
      sumXX: total.sumXX + sample.x * sample.x,
      sumXY: total.sumXY + sample.x * sample.target,
    }),
    {
      sumTarget: 0,
      sumX: 0,
      sumXX: 0,
      sumXY: 0,
    },
  );
  const denominator = count * sums.sumXX - sums.sumX ** 2;

  if (Math.abs(denominator) <= CONSTANT_X_EPSILON) {
    return { model: null, status: "constant-x" };
  }

  const slope =
    (count * sums.sumXY - sums.sumX * sums.sumTarget) / denominator;
  const intercept = (sums.sumTarget - slope * sums.sumX) / count;

  return {
    model: {
      intercept,
      slope,
    },
    status: "ok",
  };
}

export function predictLinearRegression(
  model: LinearRegressionModel,
  x: number,
): number {
  return model.slope * x + model.intercept;
}

export function calculateLinearRegressionResiduals({
  model,
  samples,
}: {
  model: LinearRegressionModel;
  samples: readonly LinearRegressionSample1D[];
}): readonly LinearRegressionResidual[] {
  return samples.map((sample) => {
    const prediction = predictLinearRegression(model, sample.x);
    const residual = prediction - sample.target;

    return {
      id: sample.id,
      prediction,
      residual,
      squaredResidual: residual ** 2,
      target: sample.target,
      x: sample.x,
    };
  });
}

export function calculateLinearRegressionMse({
  model,
  samples,
}: {
  model: LinearRegressionModel;
  samples: readonly LinearRegressionSample1D[];
}): number {
  if (samples.length === 0) {
    return Number.NaN;
  }

  const residuals = calculateLinearRegressionResiduals({ model, samples });

  return (
    residuals.reduce(
      (total, residual) => total + residual.squaredResidual,
      0,
    ) / samples.length
  );
}

export function calculateLinearRegressionObjective({
  model,
  samples,
}: {
  model: LinearRegressionModel;
  samples: readonly LinearRegressionSample1D[];
}): number {
  return calculateLinearRegressionMse({ model, samples }) / 2;
}

export function calculateLinearRegressionGradient({
  model,
  samples,
}: {
  model: LinearRegressionModel;
  samples: readonly LinearRegressionSample1D[];
}): LinearRegressionGradient {
  if (samples.length === 0) {
    return {
      intercept: Number.NaN,
      slope: Number.NaN,
    };
  }

  return samples.reduce<LinearRegressionGradient>(
    (gradient, sample) => {
      const residual = predictLinearRegression(model, sample.x) - sample.target;

      return {
        intercept: gradient.intercept + residual / samples.length,
        slope: gradient.slope + (residual * sample.x) / samples.length,
      };
    },
    {
      intercept: 0,
      slope: 0,
    },
  );
}

export function stepLinearRegressionGradientDescent({
  learningRate,
  model,
  samples,
}: {
  learningRate: number;
  model: LinearRegressionModel;
  samples: readonly LinearRegressionSample1D[];
}): {
  gradient: LinearRegressionGradient;
  nextModel: LinearRegressionModel;
} {
  const gradient = calculateLinearRegressionGradient({ model, samples });

  return {
    gradient,
    nextModel: {
      intercept: model.intercept - learningRate * gradient.intercept,
      slope: model.slope - learningRate * gradient.slope,
    },
  };
}

export function createLinearRegressionGradientDescentPath({
  divergenceLimit = DEFAULT_DIVERGENCE_LIMIT,
  initialModel,
  iterations,
  learningRate,
  samples,
  tolerance = DEFAULT_TOLERANCE,
}: {
  divergenceLimit?: number;
  initialModel: LinearRegressionModel;
  iterations: number;
  learningRate: number;
  samples: readonly LinearRegressionSample1D[];
  tolerance?: number;
}): LinearRegressionGradientDescentResult {
  if (samples.length === 0) {
    return { frames: [], status: "empty" };
  }

  if (
    !areLinearRegressionSamplesFinite(samples) ||
    !isLinearRegressionModelFinite(initialModel) ||
    !Number.isFinite(iterations) ||
    !Number.isFinite(learningRate)
  ) {
    return { frames: [], status: "non-finite" };
  }

  const frameCount = Math.max(0, Math.floor(iterations));
  const frames: LinearRegressionGradientFrame[] = [];
  let model = initialModel;
  let status: LinearRegressionGradientDescentStatus = "ok";

  for (let iteration = 0; iteration <= frameCount; iteration += 1) {
    const gradient = calculateLinearRegressionGradient({ model, samples });
    const gradientNorm = Math.hypot(gradient.intercept, gradient.slope);
    const mse = calculateLinearRegressionMse({ model, samples });
    const objective = mse / 2;

    if (
      !Number.isFinite(gradientNorm) ||
      !Number.isFinite(mse) ||
      !Number.isFinite(objective) ||
      Math.abs(model.intercept) > divergenceLimit ||
      Math.abs(model.slope) > divergenceLimit ||
      objective > divergenceLimit
    ) {
      status = "diverged";
      break;
    }

    frames.push({
      gradient,
      gradientNorm,
      iteration,
      model,
      mse,
      objective,
    });

    if (gradientNorm <= tolerance) {
      status = "converged";
      break;
    }

    if (iteration === frameCount) {
      break;
    }

    model = {
      intercept: model.intercept - learningRate * gradient.intercept,
      slope: model.slope - learningRate * gradient.slope,
    };
  }

  return { frames, status };
}

function areLinearRegressionSamplesFinite(
  samples: readonly LinearRegressionSample1D[],
): boolean {
  return samples.every(
    (sample) => Number.isFinite(sample.x) && Number.isFinite(sample.target),
  );
}

function isLinearRegressionModelFinite(model: LinearRegressionModel): boolean {
  return Number.isFinite(model.intercept) && Number.isFinite(model.slope);
}
