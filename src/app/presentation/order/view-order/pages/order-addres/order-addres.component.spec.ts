import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAddresComponent } from './order-addres.component';

describe('OrderAddresComponent', () => {
  let component: OrderAddresComponent;
  let fixture: ComponentFixture<OrderAddresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderAddresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderAddresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
