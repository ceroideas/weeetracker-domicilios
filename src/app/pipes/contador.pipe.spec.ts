import { ContadorPipe } from './contador.pipe';

describe('ContadorPipe', () => {
  it('create an instance', () => {
    const pipe = new ContadorPipe();
    expect(pipe).toBeTruthy();
  });
});
