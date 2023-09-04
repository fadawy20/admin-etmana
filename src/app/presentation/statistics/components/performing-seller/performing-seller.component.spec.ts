import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformingSellerComponent } from './performing-seller.component';

describe('PerformingSellerComponent', () => {
  let component: PerformingSellerComponent;
  let fixture: ComponentFixture<PerformingSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerformingSellerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformingSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
