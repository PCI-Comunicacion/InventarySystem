import { TestBed } from '@angular/core/testing';

import { EcuadorIdValidatorService } from './ecuador-id-validator.service';

describe('EcuadorIdValidatorService', () => {
  let service: EcuadorIdValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EcuadorIdValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
