import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatecollectionComponent } from './createcollection.component';

describe('CreatecollectionComponent', () => {
  let component: CreatecollectionComponent;
  let fixture: ComponentFixture<CreatecollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatecollectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatecollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
