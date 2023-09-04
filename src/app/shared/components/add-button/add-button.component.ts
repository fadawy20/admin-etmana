import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.scss'],
})
export class AddButtonComponent implements OnInit {

  @Input() title: string = 'Submit button';
  @Input() buttonStyle = 1 || 2;
  @Input()
  icon!: string;
  @Input() isLoading: boolean = false;
  @Input() disabled: boolean = false;




  constructor() { }

  ngOnInit(): void {
  }

}
