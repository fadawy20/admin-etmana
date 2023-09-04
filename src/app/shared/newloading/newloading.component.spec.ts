import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewloadingComponent } from './newloading.component';

describe('NewloadingComponent', () => {
  let component: NewloadingComponent;
  let fixture: ComponentFixture<NewloadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewloadingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewloadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
