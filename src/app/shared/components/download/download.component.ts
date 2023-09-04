import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {
  @Input() title: string = 'DownLoad Button';
  @Input() buttonStyle = 1 || 2;
  @Input()
  icon!: string;
  @Input() isLoading: boolean = false;
  @Input() disabled: boolean = false;



  constructor() { }

  ngOnInit(): void {
  }

}
