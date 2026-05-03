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

The `/week1/knn/mnist` runtime dataset is intentionally deferred. A later
implementation should preprocess these raw files into browser-friendly chunks,
such as compact pixel-vector binaries for nearest-neighbor math plus sprite or
atlas images for visual previews.
