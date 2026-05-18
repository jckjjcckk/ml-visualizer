import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateLinearRegressionGradient,
  calculateLinearRegressionMse,
  calculateLinearRegressionObjective,
  calculateLinearRegressionResiduals,
  createLinearRegressionGradientDescentPath,
  fitLinearRegressionClosedForm,
  predictLinearRegression,
  stepLinearRegressionGradientDescent,
} from "./linear-regression.ts";

const exactLineSamples = [
  { id: "p0", target: 1, x: 0 },
  { id: "p1", target: 3, x: 1 },
  { id: "p2", target: 5, x: 2 },
];

test("linear regression closed-form fit recovers slope and intercept", () => {
  const result = fitLinearRegressionClosedForm(exactLineSamples);

  assert.equal(result.status, "ok");
  assert.deepEqual(result.model, {
    intercept: 1,
    slope: 2,
  });
  assert.equal(predictLinearRegression(result.model, 4), 9);
});

test("linear regression residuals, MSE, and lecture objective are deterministic", () => {
  const model = { intercept: 1, slope: 2 };
  const residuals = calculateLinearRegressionResiduals({
    model,
    samples: exactLineSamples,
  });

  assert.deepEqual(
    residuals.map((residual) => residual.squaredResidual),
    [0, 0, 0],
  );
  assert.equal(calculateLinearRegressionMse({ model, samples: exactLineSamples }), 0);
  assert.equal(
    calculateLinearRegressionObjective({ model, samples: exactLineSamples }),
    0,
  );
});

test("linear regression closed-form fit returns structured failure statuses", () => {
  assert.equal(fitLinearRegressionClosedForm([]).status, "empty");
  assert.equal(
    fitLinearRegressionClosedForm([
      { target: 1, x: 2 },
      { target: 3, x: 2 },
    ]).status,
    "constant-x",
  );
  assert.equal(
    fitLinearRegressionClosedForm([{ target: Number.NaN, x: 1 }]).status,
    "non-finite",
  );
});

test("linear regression gradient descent uses the lecture objective gradient", () => {
  const samples = [
    { target: 0, x: 0 },
    { target: 2, x: 1 },
  ];
  const model = { intercept: 0, slope: 0 };
  const gradient = calculateLinearRegressionGradient({ model, samples });
  const step = stepLinearRegressionGradientDescent({
    learningRate: 0.5,
    model,
    samples,
  });

  assert.deepEqual(gradient, {
    intercept: -1,
    slope: -1,
  });
  assert.deepEqual(step.nextModel, {
    intercept: 0.5,
    slope: 0.5,
  });
});

test("linear regression gradient descent path tracks stable progress", () => {
  const result = createLinearRegressionGradientDescentPath({
    initialModel: { intercept: 0, slope: 0 },
    iterations: 20,
    learningRate: 0.1,
    samples: exactLineSamples,
  });

  assert.equal(result.status, "ok");
  assert.ok(result.frames.length > 1);
  assert.ok(
    result.frames.at(-1).objective < result.frames[0].objective,
    "expected objective to decrease over the path",
  );
});

test("linear regression gradient descent reports divergence", () => {
  const result = createLinearRegressionGradientDescentPath({
    divergenceLimit: 1_000_000,
    initialModel: { intercept: 0, slope: 0 },
    iterations: 5,
    learningRate: 100,
    samples: [{ target: 100, x: 1 }],
  });

  assert.equal(result.status, "diverged");
  assert.ok(result.frames.length >= 1);
});
