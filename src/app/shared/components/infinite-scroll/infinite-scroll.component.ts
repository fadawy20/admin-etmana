import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-infinite-scroll',
  templateUrl: './infinite-scroll.component.html',
  styleUrls: ['./infinite-scroll.component.scss']
})
export class InfiniteScrollComponent implements OnInit {

  @Input() next?: string
  @Input() data: any
  @Input() flag: boolean = false
  @Output() paginateOnScroll: EventEmitter<any> = new EventEmitter();
  current = 1

  constructor() { }

  ngOnInit(): void {
  }

  getNextBatch() {
    this.current++
    let paginator = {
      page: this.current,
      size: 15
    }
    this.paginateOnScroll.emit(paginator)
  }

}
