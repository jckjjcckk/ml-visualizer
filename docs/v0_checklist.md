# V0 Checklist

Derived from `docs/principle.txt` and the real PDFs in `docs/lec note`.

## V0 Goal

Build a polished, playground-first machine learning visualization toolbox shell, then expose the full course-shaped route catalog derived from `docs/lec note`.

V0 has two route states:

- `available`: the route has a real interactive tool.
- `coming-soon`: the route is visible in the catalog, sidebar, and search, but renders a polished placeholder instead of a full visualizer.

The first available interactive tools are:

- kNN
- Decision Tree
- Linear Regression

V0 should feel like a real product from the first screen: dark-first, course-structured, fast, technical, and premium. Users should be able to open a tool, understand it quickly, interact with it, and observe model behavior without reading lecture-style content first.

All state is local in V0. Refreshing the page should reset visualization state.

## Explicitly Deferred

Do not implement these in V0:

- Lecture notes or PDF browsing
- Study progress tracking
- Backend sync logic
- Authentication or user accounts
- Quizzes
- Bookmarks
- Custom dataset upload
- Formula-heavy theory pages
- Sharing visualization state through URLs

Topics not covered by an available V0 visualizer should still appear as `coming-soon` routes.

## Repo Starting Point

- The app currently starts from the default Next.js shell.
- Stack already present in `package.json`:
  - Next.js 16.2.4 with App Router
  - React 19
  - TypeScript
  - Tailwind CSS 4
  - d3
  - framer-motion
  - zustand
  - lucide-react
- Current implementation surface is small:
  - `app/page.tsx`
  - `app/layout.tsx`
  - `app/globals.css`
- Follow the repo instruction in `AGENTS.md`: read the relevant local Next.js docs under `node_modules/next/dist/docs/` before writing implementation code.

## Lecture-Derived Route Map

Use course-first routes in development, for example `localhost:3000/week1/knn/basic`. Store paths as route strings like `/week1/knn/basic`.

Ignore Apple resource-fork files such as `docs/lec note/._lec01.pdf`; only use the real lecture PDFs.

Before implementing any route, read the corresponding week's content in both `docs/lec note` and `docs/homework` when available. For example, Week 1 routes should be grounded in `docs/lec note/lec01.pdf` and `docs/homework/w01hw.pdf`; Week 10 routes should be grounded in `docs/lec note/lec10-gaussian-discriminatnt-analysis.pdf` and `docs/homework/w10hw.pdf`.

| # | Topic | Route | V0 status | Plan |
| --- | --- | --- | --- | --- |
| 1 | Supervised learning setup | `/week1/supervised-learning/setup` | `coming-soon` | N/A |
| 2 | kNN basics | `/week1/knn/basic` | `available` | 2D points, draggable query, `k` slider, highlighted neighbors. |
| 3 | kNN normalization pitfall | `/week1/knn/normalization` | `available` | Raw vs normalized 2D neighbor comparison. |
| 4 | kNN MNIST digit example | `/week1/knn/mnist` | `coming-soon` | Deferred to Step 16a: packed local digits, query selector, drawing pad, nearest digits, vote counts, prediction. |
| 5 | Train, validation, test split | `/week1/model-evaluation/train-validation-test` | `coming-soon` | N/A |
| 6 | Decision tree basics | `/week2/decision-tree/basic` | `available` | 2D split builder with leaf regions and step controls. |
| 7 | Entropy and information gain | `/week2/decision-tree/information-gain` | `available` | Candidate split, class counts, entropy, information gain. |
| 8 | Decision tree pruning | `/week2/decision-tree/pruning` | `available` | Shallow vs deep tree comparison with validation error. |
| 9 | Regression tree | `/week2/decision-tree/regression-tree` | `coming-soon` | Piecewise-constant regression bands. |
| 10 | Linear regression basics | `/week3/linear-regression/basic` | `available` | Draggable scatterplot with fitted line. |
| 11 | Residuals and MSE | `/week3/linear-regression/residuals` | `available` | Residual segments, squared error, MSE. |
| 12 | Gradient descent | `/week3/linear-regression/gradient-descent` | `available` | Fitted-line animation plus loss trajectory. |
| 13 | Many-feature linear regression | `/week3/linear-regression/many-features` | `coming-soon` | N/A |
| 14 | Linear models for classification | `/week4/logistic-regression/basic` | `coming-soon` | 2D boundary, probability contours, threshold control. |
| 15 | Multilayer perceptrons | `/week6/neural-networks/mlp` | `coming-soon` | Network graph plus 2D decision boundary. |
| 16 | Backpropagation | `/week6/neural-networks/backpropagation` | `coming-soon` | Forward activations and backward gradients. |
| 17 | Bias-variance decomposition | `/week7/bias-variance/decomposition` | `coming-soon` | Repeated fits showing bias and variance. |
| 18 | Bagging | `/week7/ensembles/bagging` | `coming-soon` | Bootstrap learners and aggregated prediction. |
| 19 | Random forests | `/week7/ensembles/random-forest` | `coming-soon` | Individual trees vs forest boundary. |
| 20 | Generative classifiers | `/week8/generative-classifiers/basic` | `coming-soon` | Class densities and posterior regions. |
| 21 | Naive Bayes | `/week8/naive-bayes/basic` | `coming-soon` | Feature likelihoods and posterior calculation. |
| 22 | Bayesian parameter estimation | `/week8/bayesian-estimation/parameters` | `coming-soon` | Prior, likelihood, posterior updates. |
| 23 | Algorithmic fairness | `/week9/fairness/basic` | `coming-soon` | N/A |
| 24 | Individual fairness | `/week9/fairness/individual` | `coming-soon` | N/A |
| 25 | Group fairness metrics | `/week9/fairness/group-metrics` | `coming-soon` | N/A |
| 26 | Gaussian Discriminant Analysis | `/week10/gda/basic` | `coming-soon` | Gaussian contours and decision boundary. |
| 27 | Univariate GDA | `/week10/gda/univariate` | `coming-soon` | 1D class densities and posterior crossing. |
| 28 | GDA learning | `/week10/gda/learning` | `coming-soon` | Editable samples updating Gaussian parameters. |
| 29 | K-means clustering | `/week11/clustering/k-means` | `coming-soon` | Assignment/refit steps and centroids. |
| 30 | Mixture of Gaussians | `/week11/clustering/mixture-of-gaussians` | `coming-soon` | Soft clusters and EM steps. |
| 31 | Dimensionality reduction | `/week12/dimensionality-reduction/basic` | `coming-soon` | N/A |
| 32 | Principal Component Analysis | `/week12/pca/basic` | `coming-soon` | Principal axes, projection, reconstruction error. |

## Implementation Sequence

Step count: 20 ordered steps.

The order below favors dependency safety and future scalability: establish framework rules first, then course route contracts, then shell, then plotting infrastructure, then algorithm cores, then each visualizer.

### Step 1: Framework Grounding

Step 1 framework notes are recorded in `README.md` under "Next.js 16 App Router Rules".

- [x] Read `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`.
- [x] Read `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`.
- [x] Read `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`.
- [x] Confirm the app uses App Router conventions and avoid Pages Router APIs.
- [x] Keep interactive visualizer components behind focused `"use client"` boundaries.

### Step 2: Course Topic Map

- [x] Encode the lecture-derived route map in a local source file.
- [x] Preserve the `available` and `coming-soon` status for every route.
- [x] Preserve the concise plan text for each route in registry metadata.
- [ ] Before implementing each route, read the matching week's PDFs in `docs/lec note` and `docs/homework` when available.
- [x] Keep missing or uncovered tools visible as `coming-soon`, not silently hidden.
- [x] Do not expose raw PDFs or lecture-note browsing in V0.

### Step 3: Project Structure

- [x] Create the scalable folder shape before feature work begins.
- [x] Put algorithm logic under `lib/algorithms`.
- [x] Put visualizer UI under `components/visualizers`.
- [x] Put app structure under `components/layout`.
- [x] Put reusable controls and primitives under `components/ui`.
- [x] Put shared plotting primitives under `components/plots`.
- [x] Put route and course catalog data under `lib/course`.
- [x] Keep algorithm logic pure and separate from React UI.

### Step 4: Design Tokens

- [x] Define dark-first tokens in `app/globals.css`.
- [x] Establish reusable color roles for background, panels, borders, text, focus, classes, predictions, and residuals.
- [x] Establish spacing, radius, shadow, and typography conventions.
- [x] Keep cards at 8px border radius or less unless a shared design token says otherwise.

### Step 5: Tool Registry

- [x] Add a local registry for all visible lecture-derived routes.
- [x] Include `path`, `slug`, `title`, `week`, `topic`, `tags`, `summary`, `plan`, and `status`.
- [x] Support `available` and `coming-soon` statuses.
- [x] Mark kNN, Decision Tree, and Linear Regression routes from the route map as V0 available.
- [x] Keep unavailable tools visible but clearly marked as `coming-soon`.
- [x] Use the registry as the single source of truth for sidebar and search.

### Step 6: App Shell

- [x] Replace the default create-next-app screen with the ML Visualizer shell.
- [x] Add a persistent top bar with product identity and global search access.
- [x] Add a main content area sized for interactive canvases/SVGs.
- [x] Keep the first screen as the usable app, not a marketing landing page.
- [x] Ensure the shell has no backend, auth, or persistence assumptions.

### Step 7: Sidebar Navigation

- [x] Add a hideable linear sidebar.
- [x] Organize sidebar items by course hierarchy: week, topic, tool.
- [x] Highlight the active tool route.
- [x] Preserve a scalable structure that can later support more weeks and topics.
- [x] Visually distinguish `available` tools from `coming-soon` tools.
- [x] Ensure desktop and mobile sidebar states do not overlap the visualizer.

### Step 8: Course Routes

- [x] Use course-first routes, not `/tools/...` routes.
- [x] Create route handling for `/week1/knn/basic`.
- [x] Create route handling for `/week1/knn/normalization`.
- [x] Create route handling for `/week1/knn/mnist`.
- [x] Create route handling for `/week2/decision-tree/basic`.
- [x] Create route handling for `/week2/decision-tree/information-gain`.
- [x] Create route handling for `/week2/decision-tree/pruning`.
- [x] Create route handling for `/week3/linear-regression/basic`.
- [x] Create route handling for `/week3/linear-regression/residuals`.
- [x] Create route handling for `/week3/linear-regression/gradient-descent`.
- [x] Create route handling for every `coming-soon` route in the route map.
- [x] Route every page through a shared tool page layout.
- [x] Ensure each route can be reached from the registry-backed sidebar.
- [x] Do not use `/tools/...` as the canonical V0 route shape.

### Step 9: Shared Tool Layout

- [x] Create a standard layout with a visualization region and control panel region.
- [x] Reserve space for tool title, short guided intro, and current output summary.
- [x] Add reset placement that is consistent across tools.
- [x] Render a polished `coming-soon` page when a route exists but has no interactive implementation.
- [x] Ensure the layout works on desktop and mobile without overlapping UI.

### Step 10: Shared UI Controls

- [x] Add reusable slider, segmented toggle, preset selector, play controls, reset button, and tooltip patterns.
- [x] Add a light/dark mode toggle using the Step 4 theme tokens.
- [x] Use lucide-react icons for common actions where appropriate.
- [x] Keep controls keyboard-accessible.
- [x] Use restrained framer-motion animations for overlays, panel transitions, and selected states.

### Step 11: Plotting Foundation

- [x] Treat plotting as a core shared subsystem, not per-tool throwaway code.
- [x] Create reusable 2D plotting primitives for scales, axes, grid lines, points, labels, regions, overlays, and legends.
- [x] Use d3 for scales and geometry helpers while keeping React responsible for component state.
- [x] Define one coordinate contract for all tools: data domain, plot bounds, screen transform, inverse pointer transform, and clamping.
- [x] Centralize pointer interaction helpers for drag, hover, add point, and keyboard nudging.
- [x] Keep rendering responsive with stable plot dimensions, `ResizeObserver`, and explicit min/max sizes.
- [x] Avoid layout shift when controls, labels, predictions, or legends change.
- [x] Throttle or memoize expensive region rendering such as decision boundaries and tree leaf regions.
- [x] Use SVG for low-to-medium point counts and overlays; consider canvas only for dense preview layers such as MNIST or decision-region rasterization.
- [x] Add visual test guidance for nonblank plots, correct framing, readable labels, and mobile fit.

### Step 12: Global Search

- [x] Search across tool title, topic, tags, and summary.
- [x] Show only relevant registry-backed results.
- [x] Navigate directly to the selected tool.
- [x] Include `coming-soon` tools in search results with clear status.
- [x] Keep search local and deterministic.
- [x] Ensure search remains usable when more tools are added later.

### Step 13: Guided Intro Overlay (Deferred)

- [ ] Add a guided intro overlay for each `available` tool.
- [ ] Show the overlay on first visit to the available tool during the session.
- [ ] Keep intro content short and interaction-focused.
- [ ] Do not add lecture notes, formulas, quizzes, or progress tracking.

### Step 14: Shared Datasets

- [x] Create deterministic local datasets for classification tools.
- [x] Create deterministic local datasets for regression tools.
- [x] Provide at least two preset datasets per non-digit V0 visualizer.
- [x] Provide a packed local digit dataset foundation for `/week1/knn/mnist`; do not fetch external data in V0. Runtime data is packed from `data/digits/raw/{0..9}` into `lib/datasets/digits.ts`, while the interactive MNIST route remains deferred to Step 16a.
- [x] Keep dataset definitions independent of React components.
- [x] Do not add custom dataset upload in V0.

### Step 15: Algorithm Cores

- [x] Implement pure kNN helpers for distance, neighbor ranking, and class prediction.
- [x] Implement pure Decision Tree helpers for candidate splits, entropy, information gain, pruning step state, and leaf regions.
- [x] Implement pure Linear Regression helpers for closed-form fit, prediction, residuals, and MSE.
- [x] Implement pure gradient descent helpers for Linear Regression path animation.
- [x] Keep all algorithm functions deterministic and easy to test.
- [x] Avoid UI-specific state inside algorithm modules.

### Step 16: kNN Visualizers

- [x] `/week1/knn/basic`: build a 2D classification playground with draggable/clickable query point, `k` slider, Euclidean/Manhattan/Cosine distance metric toggle, nearest-neighbor highlighting, prediction display, reset, and toggleable decision-region preview.
- [x] `/week1/knn/normalization`: show how feature scale changes neighbor selection, with linked raw vs normalized comparison and reset.
- [x] Temporarily defer `/week1/knn/mnist` to Step 16a and render it as `coming-soon`.
- [x] Reuse the shared plotting primitives for all 2D kNN views.
- [x] Keep all visualization state local.
- [x] Confirm refreshing 2D kNN routes resets temporary tool state.

### Step 16a: kNN MNIST Digit Visualizer

- [ ] Manually upload strict 28x28 MNIST-style PNG files under `data/digits/raw/{0..9}`.
- [ ] Validate that uploaded files are PNG, 28x28, bright digit strokes on dark background.
- [ ] Pack all uploaded digit files into compressed browser-friendly runtime assets.
- [ ] Decompress packed digit data in-browser; do not fetch raw PNG files individually.
- [ ] Implement `/week1/knn/mnist` with query selector, drawing pad, nearest examples, vote counts, predicted label, and reset.
- [ ] Support Euclidean, Manhattan, and Cosine distance for digit vectors.
- [ ] Add `k` slider from 1-100 plus a correlated numeric input that supports values above 100 up to the sample count.
- [ ] Add an include/exclude-self toggle for selected stored query samples.
- [ ] Mark `/week1/knn/mnist` back to `available` after the runtime dataset and visualizer are complete.
- [ ] Confirm refreshing the MNIST route resets temporary tool state.

### Step 17: Decision Tree Visualizers

- [ ] `/week2/decision-tree/basic`: build a 2D classification tree playground with step/play split building, max-depth control, current split visualization, leaf region coloring, concise explanation labels, and reset.
- [ ] `/week2/decision-tree/information-gain`: visualize entropy and information gain for candidate splits.
- [ ] `/week2/decision-tree/pruning`: visualize simpler vs deeper trees and show why pruning can improve generalization.
- [ ] `/week2/decision-tree/regression-tree`: render the route as `coming-soon` unless a continuous-output tree is implemented after the classification tree is stable.
- [ ] Reuse the shared plotting primitives for split lines, regions, points, labels, and legends.
- [ ] Keep all visualization state local.
- [ ] Confirm refreshing Decision Tree routes resets temporary tool state.

### Step 18: Linear Regression Visualizers

- [ ] `/week3/linear-regression/basic`: build a 2D scatter playground with draggable or editable points, fitted line, prediction display, and reset.
- [ ] `/week3/linear-regression/residuals`: show residual lines, squared-error contribution, and MSE.
- [ ] `/week3/linear-regression/gradient-descent`: animate gradient descent over the loss surface or parameter trajectory.
- [ ] `/week3/linear-regression/many-features`: render the route as `coming-soon` unless a clear non-2D interaction is designed.
- [ ] Reuse the shared plotting primitives for scatter points, fit lines, residual overlays, and axes.
- [ ] Keep all visualization state local.
- [ ] Confirm refreshing Linear Regression routes resets temporary tool state.

### Step 19: Coming Soon Routes

- [ ] Render every `coming-soon` route from the route map with a polished placeholder.
- [ ] Show the lecture-derived topic title, short summary, and status.
- [ ] Do not show fake controls for unavailable tools.
- [ ] Keep `coming-soon` pages searchable and navigable.
- [ ] Avoid implementing backend sync, progress tracking, lecture-note browsing, or quizzes for these routes.

## Visual Quality Gate

- [ ] Use high-quality typography with readable numeric/data labels.
- [ ] Use meaningful colors for classes, predictions, residuals, and focus states.
- [ ] Avoid generic dashboard styling.
- [ ] Avoid overly flashy effects.
- [ ] Avoid unfinished minimalism.
- [ ] Confirm desktop and mobile layouts are polished before adding more tools.

## V0 Acceptance Checklist

V0 is done when:

- [ ] The product shell is complete.
- [ ] Sidebar navigation works across the full lecture-derived route map.
- [ ] Global search works across both `available` and `coming-soon` routes.
- [ ] kNN routes under `/week1/knn/...` are navigable, interactive, and resettable.
- [ ] Decision Tree routes under `/week2/decision-tree/...` are navigable, interactive, and resettable where marked `available`.
- [ ] Linear Regression routes under `/week3/linear-regression/...` are navigable, interactive, and resettable where marked `available`.
- [ ] `coming-soon` routes render polished placeholders instead of broken pages.
- [ ] Plotting primitives are shared across kNN, Decision Tree, and Linear Regression instead of duplicated per tool.
- [ ] All visualizer controls work locally.
- [ ] Refreshing the page resets visualization state.
- [ ] There is no backend or network persistence.
- [ ] There is no lecture-note UI.
- [ ] There is no progress-tracking UI.
- [ ] The app feels polished rather than like a default template.

## Verification Checklist

- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Manually review desktop layout.
- [ ] Manually review mobile layout.
- [ ] Confirm core controls are keyboard-accessible.
- [ ] Smoke test search and navigation for `/week1/knn/basic`, `/week1/knn/normalization`, and `/week1/knn/mnist`.
- [ ] Smoke test search and navigation for `/week2/decision-tree/basic`, `/week2/decision-tree/information-gain`, and `/week2/decision-tree/pruning`.
- [ ] Smoke test search and navigation for `/week3/linear-regression/basic`, `/week3/linear-regression/residuals`, and `/week3/linear-regression/gradient-descent`.
- [ ] Smoke test at least one `coming-soon` route from weeks 6-12.
- [ ] Smoke test reset behavior for every `available` visualizer route.
- [ ] Visually confirm plots are nonblank, correctly framed, responsive, and readable.
- [ ] Confirm no out-of-scope sections appear in the UI.
