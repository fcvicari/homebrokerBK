import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn(),
  },
}));

describe('Application Bootstrap', () => {
  let appMock: { listen: jest.Mock };

  beforeEach(() => {
    appMock = {
      listen: jest.fn().mockResolvedValue(undefined),
    };
    (NestFactory.create as jest.Mock).mockResolvedValue(appMock);
  });

  it('should create the app', async () => {
    const { bootstrap } = await import('./main');

    await bootstrap();

    expect(appMock.listen).toHaveBeenCalledWith(3333);
  });
});
