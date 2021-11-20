import { configService } from './config.service';

describe('ConfigService', () => {
  it('Should Get Port', () => {
    expect(typeof configService.getPort()).toBe('string');
  });
});
