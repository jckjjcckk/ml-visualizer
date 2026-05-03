import "server-only";

export type CourseSourceMaterial = {
  lecturePdf: string | null;
  homeworkPdf: string | null;
};

export const COURSE_SOURCE_MATERIALS_BY_WEEK = {
  1: {
    lecturePdf: "docs/lec note/lec01.pdf",
    homeworkPdf: "docs/homework/w01hw.pdf",
  },
  2: {
    lecturePdf: "docs/lec note/lec02.pdf",
    homeworkPdf: "docs/homework/w02hw.pdf",
  },
  3: {
    lecturePdf: "docs/lec note/lec03.pdf",
    homeworkPdf: "docs/homework/w03hw.pdf",
  },
  4: {
    lecturePdf: null,
    homeworkPdf: "docs/homework/w04hw.pdf",
  },
  6: {
    lecturePdf: "docs/lec note/lec06-multi-layer-perceptrons-and-neural-networks.pdf",
    homeworkPdf: "docs/homework/w06hw.pdf",
  },
  7: {
    lecturePdf:
      "docs/lec note/lec07-bias-variance-decomposition-maximum-likelihood-and-bayesian-estimation.pdf",
    homeworkPdf: "docs/homework/w07hw.pdf",
  },
  8: {
    lecturePdf: "docs/lec note/lec08-naive-bayes.pdf",
    homeworkPdf: "docs/homework/w08hw.pdf",
  },
  9: {
    lecturePdf: "docs/lec note/lec09-algorithmic-faireness.pdf",
    homeworkPdf: "docs/homework/w09hw.pdf",
  },
  10: {
    lecturePdf: "docs/lec note/lec10-gaussian-discriminatnt-analysis.pdf",
    homeworkPdf: "docs/homework/w10hw.pdf",
  },
  11: {
    lecturePdf: "docs/lec note/lec11-clustering.pdf",
    homeworkPdf: "docs/homework/w11hw.pdf",
  },
  12: {
    lecturePdf: "docs/lec note/lec12.pdf",
    homeworkPdf: "docs/homework/w12hw.pdf",
  },
} as const satisfies Record<number, CourseSourceMaterial>;
