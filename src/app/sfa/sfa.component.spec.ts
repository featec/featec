import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SFAComponent } from './sfa.component';

describe('SFAComponent', () => {
  let component: SFAComponent;
  let fixture: ComponentFixture<SFAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SFAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SFAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
