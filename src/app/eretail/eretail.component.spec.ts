import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EretailComponent } from './eretail.component';

describe('EretailComponent', () => {
  let component: EretailComponent;
  let fixture: ComponentFixture<EretailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EretailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EretailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
