import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';

@Component({
  selector: 'app-performing-categories',
  templateUrl: './performing-categories.component.html',
  styleUrls: ['./performing-categories.component.scss'],
})
export class PerformingCategoriesComponent implements OnInit, OnChanges {
  @Input() performingCategories: any;
  currency: any
  parent_categories: any[] = []
  performingCategoriesTest: any[] = [];
  bestFive: any[] = [];
  categoriesTest = {
    1: "Kids",
    2: "Women",
    3: "Men"
  }

  constructor(private _authService: AuthService) {
    this.currency = this._authService.currency
  }

  ngOnChanges(changes: any): void {
    if (changes.performingCategories.previousValue) {
      this.parent_categories = this.performingCategories.parent_categories;
      this.performingCategoriesTest = [];
      this.ngOnInit();
    }
  }

  ngOnInit(): void {
    this.bestFive = this.performingCategories.top_five_categories;

    console.log(this.performingCategories);

    this.bestFive.forEach((e) => {
      if (e.path.includes('/')) {
        e.path = e.path.toString().replace(/\//g, '>');
      }
    });

    if (this.parent_categories.length > 1) {
      for (let i = 0; i < this.parent_categories.length; i++) {

        if (this.parent_categories[i].name == this.categoriesTest[1] || this.parent_categories[i].name == this.categoriesTest[2] || this.parent_categories[i].name == this.categoriesTest[3]) {
          this.performingCategoriesTest.push(this.parent_categories[i])
        }
      }
    }

  }
}
