import { TestBed } from '@angular/core/testing';

import { BoardUIService } from './board-ui.service.service';

describe('BoardUiServiceService', () => {
  let service: BoardUIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoardUIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
