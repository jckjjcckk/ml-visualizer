# Raw Digit Source Files

Place future raw digit files here, grouped by label:

```text
data/digits/raw/0/
data/digits/raw/1/
...
data/digits/raw/9/
```

These raw files are source material, not runtime assets. Do not serve 70,000
individual image files directly from the browser path: that would create heavy
request, header, scheduling, cache, and decode overhead even when each image is
small.

The `/week1/knn/mnist` runtime dataset is packed from this source folder by
`scripts/pack-digit-dataset.mjs` into `lib/datasets/digits.ts`. The packed V0
dataset embeds a tiny deterministic subset as compact pixel vectors for
nearest-neighbor math, so the browser does not fetch individual raw images.
