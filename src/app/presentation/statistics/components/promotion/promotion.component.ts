import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss'],
})
export class PromotionComponent implements OnInit {
  @Input() promotion: any;
  constructor() {}
  ngOnInit(): void {}
}
