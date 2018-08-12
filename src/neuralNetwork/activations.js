const activationFunctions = {
  'sigmoid': {
    fn: (x) => 1 / (1 + Math.exp(-x)),
    derivative: (y) => y * (1 - y),
  },
  'tanh': {
    tanh: (x) => {

    },
    fn: (x) => {
      return Math.tanh(x);
    },
    derivative: (y) => 1 - y ** 2,
  },
  'relu': {
    fn: (x) => Math.max(0, x),
    derivative: (y) => y < 0 ? 0 : 1,
  },
  'leaky-relu': {
    fn: (x) => (x < 0 ? 0.01 * x : x),
    derivative: (y) => (y < 0 ? 0.01 : 1),
  },
};

export default activationFunctions;
