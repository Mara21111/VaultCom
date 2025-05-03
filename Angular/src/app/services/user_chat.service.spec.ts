import { TestBed } from '@angular/core/testing';

import { UserChatService } from './user_chat.service';

describe('User_ChatService', () => {
  let service: UserChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
