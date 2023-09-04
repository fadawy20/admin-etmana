import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cancel-button',
  templateUrl: './cancel-button.component.html',
  styleUrls: ['./cancel-button.component.scss']
})
export class CancelButtonComponent implements OnInit {
  @Input() label:string = 'Cancel';


  constructor() { }

  ngOnInit(): void {
  }

}
