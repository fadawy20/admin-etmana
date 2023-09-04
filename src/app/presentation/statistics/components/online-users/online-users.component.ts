import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-online-users',
  templateUrl: './online-users.component.html',
  styleUrls: ['./online-users.component.scss'],
})
export class OnlineUsersComponent implements OnInit, OnChanges {
  @Input() online!: any;
  onlineUsers: any[] = [];
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    let desktop = 0,
      mobile = 0,
      ios = 0,
      android = 0;
    changes['online'].currentValue.forEach((ele: any) => {
      if (ele.platformType == 'Android' && ele.online) android = ++android;

      if (ele.platformType == 'WEB_MObile' && ele.online) mobile = ++mobile;

      if (ele.platformType == 'IOS' && ele.online) ios = ++ios;

      if (ele.platformType == 'WEB_DESKTOP' && ele.online) desktop = ++desktop;
    });

    this.onlineUsers = [
      { id: 1, name: 'Web Desktop', num: desktop },
      { id: 2, name: 'Web Mobile', num: mobile },
      { id: 3, name: 'IOS', num: ios },
      { id: 4, name: 'Android', num: android },
    ];
  }

  ngOnInit(): void {}
}
