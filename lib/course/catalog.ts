export type CourseToolStatus = "available" | "coming-soon";

export type CourseTool = {
  path: string;
  slug: string;
  title: string;
  week: number;
  topic: string;
  tags: readonly string[];
  summary: string;
  plan: string;
  status: CourseToolStatus;
};

export type CourseTopicGroup = {
  topic: string;
  tools: readonly CourseTool[];
};

export type CourseWeekGroup = {
  week: number;
  topics: readonly CourseTopicGroup[];
};

type CourseToolInput = Omit<CourseTool, "slug">;

type MutableCourseTopicGroup = {
  topic: string;
  tools: CourseTool[];
};

type MutableCourseWeekGroup = {
  week: number;
  topics: MutableCourseTopicGroup[];
};

const COURSE_TOOL_INPUTS = [
  {
    path: "/week1/supervised-learning/setup",
    title: "Supervised learning setup",
    week: 1,
    topic: "Supervised learning",
    tags: ["supervised-learning", "features", "labels", "training"],
    summary: "Frame inputs, labels, and prediction targets before the models arrive.",
    status: "coming-soon",
    plan: "N/A",
  },
  {
    path: "/week1/knn/basic",
    title: "kNN basics",
    week: 1,
    topic: "kNN",
    tags: ["knn", "nearest-neighbor", "classification", "distance", "neighbors"],
    summary: "Move a query point and watch nearby examples shape the kNN prediction.",
    status: "available",
    plan: "2D points, draggable query, `k` slider, highlighted neighbors.",
  },
  {
    path: "/week1/knn/normalization",
    title: "kNN normalization pitfall",
    week: 1,
    topic: "kNN",
    tags: ["knn", "normalization", "scaling", "distance", "comparison"],
    summary: "Compare raw and normalized spaces to see how scale can redirect neighbors.",
    status: "available",
    plan: "Raw vs normalized 2D neighbor comparison.",
  },
  {
    path: "/week1/knn/mnist",
    title: "kNN MNIST digit example",
    week: 1,
    topic: "kNN",
    tags: ["knn", "mnist", "digits", "nearest-neighbor", "vote"],
    summary: "Inspect nearest digit examples and the vote that drives the prediction.",
    status: "available",
    plan: "Query digit, nearest digits, vote counts, prediction.",
  },
  {
    path: "/week1/model-evaluation/train-validation-test",
    title: "Train, validation, test split",
    week: 1,
    topic: "Model evaluation",
    tags: ["evaluation", "train", "validation", "test", "split"],
    summary: "Preview how dataset partitions support tuning and honest evaluation.",
    status: "coming-soon",
    plan: "N/A",
  },
  {
    path: "/week2/decision-tree/basic",
    title: "Decision tree basics",
    week: 2,
    topic: "Decision tree",
    tags: ["decision-tree", "classification", "splits", "leaves", "regions"],
    summary: "Build split-by-split intuition for how a tree carves the feature plane.",
    status: "available",
    plan: "2D split builder with leaf regions and step controls.",
  },
  {
    path: "/week2/decision-tree/information-gain",
    title: "Entropy and information gain",
    week: 2,
    topic: "Decision tree",
    tags: ["decision-tree", "entropy", "information-gain", "splits"],
    summary: "Test candidate splits and see the class counts behind information gain.",
    status: "available",
    plan: "Candidate split, class counts, entropy, information gain.",
  },
  {
    path: "/week2/decision-tree/pruning",
    title: "Decision tree pruning",
    week: 2,
    topic: "Decision tree",
    tags: ["decision-tree", "pruning", "validation", "overfitting", "depth"],
    summary: "Compare shallow and deep trees to understand when pruning improves fit.",
    status: "available",
    plan: "Shallow vs deep tree comparison with validation error.",
  },
  {
    path: "/week2/decision-tree/regression-tree",
    title: "Regression tree",
    week: 2,
    topic: "Decision tree",
    tags: ["decision-tree", "regression", "piecewise", "prediction"],
    summary: "Preview piecewise-constant predictions for continuous targets.",
    status: "coming-soon",
    plan: "Piecewise-constant regression bands.",
  },
  {
    path: "/week3/linear-regression/basic",
    title: "Linear regression basics",
    week: 3,
    topic: "Linear regression",
    tags: ["linear-regression", "scatterplot", "fit", "prediction"],
    summary: "Adjust points and watch the fitted line respond in real time.",
    status: "available",
    plan: "Draggable scatterplot with fitted line.",
  },
  {
    path: "/week3/linear-regression/residuals",
    title: "Residuals and MSE",
    week: 3,
    topic: "Linear regression",
    tags: ["linear-regression", "residuals", "mse", "error", "fit"],
    summary: "Trace residual segments and connect individual errors to total MSE.",
    status: "available",
    plan: "Residual segments, squared error, MSE.",
  },
  {
    path: "/week3/linear-regression/gradient-descent",
    title: "Gradient descent",
    week: 3,
    topic: "Linear regression",
    tags: ["linear-regression", "gradient-descent", "loss", "optimization"],
    summary: "Animate parameter updates as the line descends toward a better fit.",
    status: "available",
    plan: "Fitted-line animation plus loss trajectory.",
  },
  {
    path: "/week3/linear-regression/many-features",
    title: "Many-feature linear regression",
    week: 3,
    topic: "Linear regression",
    tags: ["linear-regression", "features", "multivariate", "prediction"],
    summary: "Preview how linear models extend beyond a single plotted feature.",
    status: "coming-soon",
    plan: "N/A",
  },
  {
    path: "/week4/logistic-regression/basic",
    title: "Linear models for classification",
    week: 4,
    topic: "Logistic regression",
    tags: ["logistic-regression", "classification", "boundary", "probability"],
    summary: "Preview probability contours and thresholded decisions for linear classifiers.",
    status: "coming-soon",
    plan: "2D boundary, probability contours, threshold control.",
  },
  {
    path: "/week6/neural-networks/mlp",
    title: "Multilayer perceptrons",
    week: 6,
    topic: "Neural networks",
    tags: ["neural-networks", "mlp", "layers", "boundary"],
    summary: "Preview how layered units can reshape a decision boundary.",
    status: "coming-soon",
    plan: "Network graph plus 2D decision boundary.",
  },
  {
    path: "/week6/neural-networks/backpropagation",
    title: "Backpropagation",
    week: 6,
    topic: "Neural networks",
    tags: ["neural-networks", "backpropagation", "gradients", "training"],
    summary: "Preview forward activations and backward gradient flow through a network.",
    status: "coming-soon",
    plan: "Forward activations and backward gradients.",
  },
  {
    path: "/week7/bias-variance/decomposition",
    title: "Bias-variance decomposition",
    week: 7,
    topic: "Bias-variance",
    tags: ["bias-variance", "generalization", "variance", "bias"],
    summary: "Preview repeated fits that separate systematic bias from model variance.",
    status: "coming-soon",
    plan: "Repeated fits showing bias and variance.",
  },
  {
    path: "/week7/ensembles/bagging",
    title: "Bagging",
    week: 7,
    topic: "Ensembles",
    tags: ["ensembles", "bagging", "bootstrap", "aggregation"],
    summary: "Preview bootstrap learners and how aggregation steadies predictions.",
    status: "coming-soon",
    plan: "Bootstrap learners and aggregated prediction.",
  },
  {
    path: "/week7/ensembles/random-forest",
    title: "Random forests",
    week: 7,
    topic: "Ensembles",
    tags: ["ensembles", "random-forest", "trees", "boundary"],
    summary: "Preview how many varied trees combine into a stronger boundary.",
    status: "coming-soon",
    plan: "Individual trees vs forest boundary.",
  },
  {
    path: "/week8/generative-classifiers/basic",
    title: "Generative classifiers",
    week: 8,
    topic: "Generative classifiers",
    tags: ["generative-classifiers", "densities", "posterior", "classification"],
    summary: "Preview class densities and posterior regions for generative prediction.",
    status: "coming-soon",
    plan: "Class densities and posterior regions.",
  },
  {
    path: "/week8/naive-bayes/basic",
    title: "Naive Bayes",
    week: 8,
    topic: "Naive Bayes",
    tags: ["naive-bayes", "likelihood", "posterior", "features"],
    summary: "Preview feature likelihoods as they combine into a posterior decision.",
    status: "coming-soon",
    plan: "Feature likelihoods and posterior calculation.",
  },
  {
    path: "/week8/bayesian-estimation/parameters",
    title: "Bayesian parameter estimation",
    week: 8,
    topic: "Bayesian estimation",
    tags: ["bayesian", "estimation", "prior", "posterior", "likelihood"],
    summary: "Preview prior-to-posterior updates as evidence accumulates.",
    status: "coming-soon",
    plan: "Prior, likelihood, posterior updates.",
  },
  {
    path: "/week9/fairness/basic",
    title: "Algorithmic fairness",
    week: 9,
    topic: "Fairness",
    tags: ["fairness", "algorithmic-fairness", "ethics", "classification"],
    summary: "Preview fairness questions that emerge when models affect people.",
    status: "coming-soon",
    plan: "N/A",
  },
  {
    path: "/week9/fairness/individual",
    title: "Individual fairness",
    week: 9,
    topic: "Fairness",
    tags: ["fairness", "individual-fairness", "similarity", "metrics"],
    summary: "Preview how similar individuals can be compared under fair treatment goals.",
    status: "coming-soon",
    plan: "N/A",
  },
  {
    path: "/week9/fairness/group-metrics",
    title: "Group fairness metrics",
    week: 9,
    topic: "Fairness",
    tags: ["fairness", "group-fairness", "metrics", "classification"],
    summary: "Preview group-level metrics for comparing model outcomes.",
    status: "coming-soon",
    plan: "N/A",
  },
  {
    path: "/week10/gda/basic",
    title: "Gaussian Discriminant Analysis",
    week: 10,
    topic: "GDA",
    tags: ["gda", "gaussian", "classification", "boundary", "contours"],
    summary: "Preview Gaussian class contours and the boundary they imply.",
    status: "coming-soon",
    plan: "Gaussian contours and decision boundary.",
  },
  {
    path: "/week10/gda/univariate",
    title: "Univariate GDA",
    week: 10,
    topic: "GDA",
    tags: ["gda", "gaussian", "univariate", "posterior"],
    summary: "Preview one-dimensional class densities and their posterior crossing point.",
    status: "coming-soon",
    plan: "1D class densities and posterior crossing.",
  },
  {
    path: "/week10/gda/learning",
    title: "GDA learning",
    week: 10,
    topic: "GDA",
    tags: ["gda", "gaussian", "parameters", "learning"],
    summary: "Preview how editable samples update Gaussian parameters.",
    status: "coming-soon",
    plan: "Editable samples updating Gaussian parameters.",
  },
  {
    path: "/week11/clustering/k-means",
    title: "K-means clustering",
    week: 11,
    topic: "Clustering",
    tags: ["clustering", "k-means", "centroids", "assignment"],
    summary: "Preview assignment and refit steps as centroids settle into clusters.",
    status: "coming-soon",
    plan: "Assignment/refit steps and centroids.",
  },
  {
    path: "/week11/clustering/mixture-of-gaussians",
    title: "Mixture of Gaussians",
    week: 11,
    topic: "Clustering",
    tags: ["clustering", "gaussian-mixture", "em", "soft-clusters"],
    summary: "Preview soft cluster memberships and EM-style updates.",
    status: "coming-soon",
    plan: "Soft clusters and EM steps.",
  },
  {
    path: "/week12/dimensionality-reduction/basic",
    title: "Dimensionality reduction",
    week: 12,
    topic: "Dimensionality reduction",
    tags: ["dimensionality-reduction", "projection", "features", "embedding"],
    summary: "Preview how high-dimensional structure can be compressed for inspection.",
    status: "coming-soon",
    plan: "N/A",
  },
  {
    path: "/week12/pca/basic",
    title: "Principal Component Analysis",
    week: 12,
    topic: "PCA",
    tags: ["pca", "projection", "principal-components", "reconstruction"],
    summary: "Preview principal axes, projections, and reconstruction error.",
    status: "coming-soon",
    plan: "Principal axes, projection, reconstruction error.",
  },
] as const satisfies readonly CourseToolInput[];

export const getCourseToolSlug = (path: string) =>
  path.replace(/^\//, "").replaceAll("/", "-");

export const COURSE_TOOLS: readonly CourseTool[] = COURSE_TOOL_INPUTS.map(
  (tool) => ({
    ...tool,
    slug: getCourseToolSlug(tool.path),
  }),
);

const COURSE_TOOLS_BY_PATH = new Map(
  COURSE_TOOLS.map((tool) => [tool.path, tool]),
);

const COURSE_TOOLS_BY_SLUG = new Map(
  COURSE_TOOLS.map((tool) => [tool.slug, tool]),
);

export const getCourseToolByPath = (path: string) =>
  COURSE_TOOLS_BY_PATH.get(path);

export const getCourseToolBySegments = (
  week: string,
  topic: string,
  tool: string,
) => getCourseToolByPath(`/${week}/${topic}/${tool}`);

export const getCourseToolBySlug = (slug: string) =>
  COURSE_TOOLS_BY_SLUG.get(slug);

export const getCourseToolsByStatus = (status: CourseToolStatus) =>
  COURSE_TOOLS.filter((tool) => tool.status === status);

export const getAvailableCourseTools = () =>
  getCourseToolsByStatus("available");

export const getComingSoonCourseTools = () =>
  getCourseToolsByStatus("coming-soon");

export const getCourseToolsByWeek = (week: number) =>
  COURSE_TOOLS.filter((tool) => tool.week === week);

export const getCourseWeeks = () => [
  ...new Set(COURSE_TOOLS.map((tool) => tool.week)),
];

export const getCourseToolGroupsByWeek = (): readonly CourseWeekGroup[] => {
  const weekGroups: MutableCourseWeekGroup[] = [];

  for (const tool of COURSE_TOOLS) {
    let weekGroup = weekGroups.find((group) => group.week === tool.week);

    if (!weekGroup) {
      weekGroup = { week: tool.week, topics: [] };
      weekGroups.push(weekGroup);
    }

    let topicGroup = weekGroup.topics.find(
      (group) => group.topic === tool.topic,
    );

    if (!topicGroup) {
      topicGroup = { topic: tool.topic, tools: [] };
      weekGroup.topics.push(topicGroup);
    }

    topicGroup.tools.push(tool);
  }

  return weekGroups;
};
