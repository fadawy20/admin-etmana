import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatebannerComponent } from './createbanner.component';

describe('CreatebannerComponent', () => {
  let component: CreatebannerComponent;
  let fixture: ComponentFixture<CreatebannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatebannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatebannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
