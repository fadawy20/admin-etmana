import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-inventory-levels',
  templateUrl: './inventory-levels.component.html',
  styleUrls: ['./inventory-levels.component.scss'],
})
export class InventoryLevelsComponent implements OnInit {
  @Input() invLevels: any;

  constructor() {}

  ngOnInit(): void {}
}
