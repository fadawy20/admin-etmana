import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormbannerComponent } from './formbanner.component';

describe('FormbannerComponent', () => {
  let component: FormbannerComponent;
  let fixture: ComponentFixture<FormbannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormbannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormbannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
