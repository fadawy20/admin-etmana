import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-newloading',
  templateUrl: './newloading.component.html',
  styleUrls: ['./newloading.component.scss']
})
export class NewloadingComponent implements OnInit {
  @Input() loader: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
