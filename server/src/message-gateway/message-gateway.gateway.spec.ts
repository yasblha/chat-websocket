import { Test, TestingModule } from '@nestjs/testing';
import { MessageGatewayGateway } from './message-gateway.gateway';

describe('MessageGatewayGateway', () => {
  let gateway: MessageGatewayGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageGatewayGateway],
    }).compile();

    gateway = module.get<MessageGatewayGateway>(MessageGatewayGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
