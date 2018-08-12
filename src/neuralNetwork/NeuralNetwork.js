import Matrix from './MatrixMath.js';
import activationFunctions from './activations';

const NN_DEFAULTS = {
  hiddenLayers: [3],
  learningRate: 0.05,
  defaultActivation: 'tanh',
};

const validateActivation = (activation) => {
  if (activation) {
    if (
      Object.prototype.hasOwnProperty.call(activationFunctions, activation)
    ) {
      return activationFunctions[activation];
    } else {
      throw new Error(`Incorrect activation function's name: ${activation}`);
    }
  } else {
    return activationFunctions[NN_DEFAULTS.defaultActivation];
  }
};

export default class NeuralNetwork {
  constructor({
    activation,
    learningRate,
    hiddenLayerN,
    hiddenLayers,
    inputSize,
    outputSize,
  } = {}) {
    this.inputSize = inputSize;
    this.hiddenLayersConfiguration = hiddenLayers || NN_DEFAULTS.hiddenLayers;
    this.hiddenLayerN = hiddenLayerN;
    this.outputSize = outputSize;
    this.learningRate = learningRate || NN_DEFAULTS.learningRate;
    this.epoch = 0;
    this.layers = [];

    this.weights = [];
    this.biases = [];

    const layersConfiguration = [
      inputSize,
      ...hiddenLayers,
      outputSize,
    ];

    this.layers = [];

    for (let layer = 0; layer < layersConfiguration.length; layer++) {
      const valuesMatrix = new Matrix(layersConfiguration[layer], 1);
      const biasMatrix = new Matrix(layersConfiguration[layer], 1);
      biasMatrix.randomize();

      const item = {
        values: valuesMatrix,
        biases: biasMatrix,
        biasesTemp: null,
      };

      if (layer > 0) {
        const prevSize = layersConfiguration[layer - 1];
        const weightMatrix = new Matrix(layersConfiguration[layer], prevSize);
        weightMatrix.randomize();

        item.prevWeights = weightMatrix;
        item.errors = null;
        item.prevDeltas = null;
        item.prevWeightsTemp = null;
      }

      this.layers.push(item);
    }

    this.layers.input = this.layers[0];
    this.layers.output = this.layers[this.layers.length - 1];

    this.activation = validateActivation(activation);
  }
  setLearningRate(rate) {
    this.learningRate = rate;
  }
  run(input) {
    return this.predictResult(input).toArray();
  }
  predictResult(input) {
    const activationFunction = this.activation.fn;
    const inputValuesMatrix = Matrix.from1dArray(input);

    const guess = this.layers.reduce((result, layer, currentIndex) => {
      if (currentIndex === 0) {
        result = inputValuesMatrix;
      } else {
        result = Matrix
          .matMul(layer.prevWeights, result)
          .add(layer.biases)
          .map(activationFunction);
      }
      this.layers[currentIndex].values = result;

      return result;
    }, null);

    return guess;
  }
  train(input, target) {
    this.epoch++;
    const activationFunctionD = this.activation.derivative;
    const layers = this.layers;
    const learningRate = this.learningRate;

    // create matrices from parameters

    const targetValuesMatrix = Matrix.from1dArray(target);
    this.predictResult(input);

    for (let index = layers.length - 1; index > 0; index--) {
      // 1 - Find errors

      let errorMatrix = null;

      if (index === layers.length - 1) {
        errorMatrix = Matrix.subtract(
          targetValuesMatrix,
          layers[index].values
        );
      } else {
        const weightsNextT = Matrix.transpose(layers[index + 1].prevWeights);
        errorMatrix = Matrix.matMul(weightsNextT, layers[index + 1].errors);
      }

      // errorMatrix.print();

      errorMatrix = errorMatrix.map((el) => {
        if (el < 0) {
          return (el ** 2) * (-1);
        }
        return el ** 2;
      });
      // errorMatrix.print();

      layers[index].errors = errorMatrix;

      // 2 - Calculate gradient (Dactivation(values) * errors * lr)

      const gradient = layers[index].values
        .map(activationFunctionD)
        .matMul(errorMatrix)
        .scalarMul(learningRate);


      // 3 - Deltas

      const prevValuesT = Matrix.transpose(layers[index - 1].values);
      const deltas = Matrix.matMul(
        gradient,
        prevValuesT,
      );

      layers[index].prevWeightsTemp = deltas;
      layers[index].biasesTemp = gradient;
    }

    for (let index = layers.length - 1; index > 0; index--) {
      layers[index].prevWeights = Matrix.add(
        layers[index].prevWeights,
        layers[index].prevWeightsTemp,
      );
      layers[index].biases = Matrix.add(
        layers[index].biases,
        layers[index].biasesTemp,
      );
    }
  }
}
