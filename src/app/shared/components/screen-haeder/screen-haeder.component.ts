import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { OpendailogService } from 'src/app/Services/opendailog.service';

@Component({
  selector: 'app-screen-haeder',
  templateUrl: './screen-haeder.component.html',
  styleUrls: ['./screen-haeder.component.scss'],
})
export class ScreenHaederComponent implements OnInit {
  @Input() table: any;
  @Input() pageName: string = '';
  @Output() CreateHandler: EventEmitter<boolean> = new EventEmitter();
  @Output() uploadHandler: EventEmitter<boolean> = new EventEmitter();
  @Input() buttonStyle = 1 || 2;
  @Input() firstLetter = '';
  @Input() title = '';
  @Input() showFilter: boolean = false;
  @Input() showCreateBtn: boolean = true;
  @Input() filterOfNames: any[] = [];
  @Input() hide: any[] = [];
  showFilterField: boolean = false;
  @Output() searchValue: EventEmitter<string> = new EventEmitter();
  fieldInputs: any;
  @Output() showFilterField2: EventEmitter<boolean> = new EventEmitter();
  serchValue!: string;
  userQuestionUpdate = new Subject<string>();
  constructor(private _openDialog: OpendailogService) {
    this.userQuestionUpdate
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.getSearchColumn();
      });
  }

  changeShowFilterField() {
    this.showFilterField = !this.showFilterField;
    this.showFilterField2.emit(this.showFilterField);
  }
  ngOnInit(): void { }
  getSearchColumn() {
    this.searchValue.emit(this.serchValue);
  }
  openDialog() {
    this.CreateHandler.emit(true);
    this.setVisible(true)
  }
  setVisible(visible: boolean) {
    this._openDialog.setVisible(visible);

  }

  openDialog1() {
    this.uploadHandler.emit(true);
  }

}
