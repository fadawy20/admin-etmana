import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-addres',
  templateUrl: './order-addres.component.html',
  styleUrls: ['./order-addres.component.scss'],
})
export class OrderAddresComponent implements OnInit {
  constructor() {}
  @Input() addres: any;

  ngOnInit(): void {}
}
