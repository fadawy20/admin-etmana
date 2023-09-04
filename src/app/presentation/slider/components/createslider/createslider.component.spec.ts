import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatesliderComponent } from './createslider.component';

describe('CreatesliderComponent', () => {
  let component: CreatesliderComponent;
  let fixture: ComponentFixture<CreatesliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatesliderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatesliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
