import Matrix from '../src/MatrixMath';

test('Matrix.forEach()', () => {
  const rows = Math.floor(Math.random() * 11 + 1);
  const columns = Math.floor(Math.random() * 11 + 1);

  const mockCallback = jest.fn();
  const matrix = new Matrix(rows, columns);
  matrix.forEach(mockCallback);

  expect(mockCallback.mock.calls.length).toBe(rows * columns);
});

test('Matrix.add(): both matrices', () => {
  const m1 = new Matrix(3, 3);
  const m2 = new Matrix(3, 3);

  const result = Matrix.add(m1, m2);

  result.forEach((el, rowIndex, colIndex) => {
    const compareTo =
      m1.values[rowIndex][colIndex] + m2.values[rowIndex][colIndex];
    expect(el).toEqual(compareTo);
  });
});

test('Matrix.from1dArray()', () => {
  const length = Math.floor(Math.random() * 11);
  const array = Array.from({length}, () => Math.floor(Math.random() * 9));
  const matrix = Matrix.from1dArray(array);
  expect(array.length).toEqual(matrix.values.length);
});

test('Matrix.transpose()', () => {
  const rows = Math.floor(Math.random() * 11 + 1);
  const columns = Math.floor(Math.random() * 11 + 1);

  const matrix = new Matrix(rows, columns);
  matrix.randomize();

  const matrixT = Matrix.transpose(matrix);


  matrix.forEach((el, rowIndex, colIndex) => {
    const original = el;
    const transposed = matrixT.values[colIndex][rowIndex];

    expect(original).toEqual(transposed);
  });
});
