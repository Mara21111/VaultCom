import { TestBed } from '@angular/core/testing';

import { UserRelationshipService } from './user_relationship.service';

describe('UserRelationshipService', () => {
  let service: UserRelationshipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserRelationshipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
