import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsliderComponent } from './formslider.component';

describe('FormsliderComponent', () => {
  let component: FormsliderComponent;
  let fixture: ComponentFixture<FormsliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormsliderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormsliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
