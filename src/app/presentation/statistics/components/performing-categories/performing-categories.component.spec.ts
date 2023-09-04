import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformingCategoriesComponent } from './performing-categories.component';

describe('PerformingCategoriesComponent', () => {
  let component: PerformingCategoriesComponent;
  let fixture: ComponentFixture<PerformingCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerformingCategoriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformingCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
