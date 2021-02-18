export class DbMock {
  createDb = jest.fn();
  doesDbExist = jest.fn().mockReturnValue(true);
  exec = jest.fn();
}
