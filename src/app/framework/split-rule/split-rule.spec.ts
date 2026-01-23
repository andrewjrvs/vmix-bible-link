import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitRule } from './split-rule';

describe('SplitRule', () => {
  let component: SplitRule;
  let fixture: ComponentFixture<SplitRule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SplitRule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SplitRule);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
