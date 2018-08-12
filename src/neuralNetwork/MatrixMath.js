export default class Matrix {
  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;
    this.values = [];

    this.values = new Array(rows).fill(0).map(() => new Array(columns).fill(0));
  }
  randomize() {
    const result = this.map((el) => {
      return Math.random() * 2 - 1;
    });
    this.values = result.values;
  }
  print() {
    /* eslint-disable-next-line  */
    console.table(this.values);
  }
  forEach(fn) {
    const { values } = this;

    for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
      for (let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
        const element = values[rowIndex][columnIndex];
        fn(element, rowIndex, columnIndex);
      }
    }
  }
  map(fn) {
    const { values } = this;
    const result = new Matrix(this.rows, this.columns);
    const resultData = result.values;

    for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
      for (let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
        const element = values[rowIndex][columnIndex];
        resultData[rowIndex][columnIndex] = fn(element, rowIndex, columnIndex);
      }
    }
    return result;
  }
  add(mat2) {
    return this.constructor.add(this, mat2);
  }
  scalarMul(mat2) {
    return this.constructor.scalarMul(this, mat2);
  }
  matMul(mat2) {
    return this.constructor.matMul(this, mat2);
  }
  static add(mat1, mat2) {
    const result = new Matrix(mat1.rows, mat1.columns);

    const matData1 = mat1.values;
    const matData2 = mat2.values;

    return result.map((element, rowIndex, columnIndex) => {
      return matData1[rowIndex][columnIndex] + matData2[rowIndex][columnIndex];
    });
  }
  static subtract(mat1, mat2) {
    const result = new Matrix(mat1.rows, mat1.columns);

    return result.map((el, rowIdx, colIdx) => {
      return mat1.values[rowIdx][colIdx] - mat2.values[rowIdx][colIdx];
    });
  }
  static matMul(mat1, mat2) {
    const result = new Matrix(mat1.rows, mat2.columns);
    result.forEach((el, rowIndex, columnIndex) => {
      let sum = 0;
      for (let k = 0; k < mat1.columns; k++) {
        sum += mat1.values[rowIndex][k] * mat2.values[k][columnIndex];
      }
      result.values[rowIndex][columnIndex] = sum;
    });
    return result;
  }
  static scalarMul(mat1, scalar) {
    return mat1.map((el) => {
      return el * scalar;
    });
  }
  static from1dArray(array) {
    const matrix = new Matrix(array.length, 1);
    return matrix.map((el, rowIdx, colIdx) => {
      return array[rowIdx];
    });
  }
  static transpose(mat) {
    const result = new Matrix(mat.columns, mat.rows);

    mat.forEach((el, rowIdx, columnIndex) => {
      result.values[columnIndex][rowIdx] = mat.values[rowIdx][columnIndex];
    });
    return result;
  }
  toArray() {
    const array = [];
    this.map((el) => {
      array.push(el);
    });

    return array;
  }
};
