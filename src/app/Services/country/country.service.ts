import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor() { }

  getCountry() {
    let countries =
      [
        {
          code: '+2',
          value: 'Egypt',
        },
        {
          code: '+966',
          value: 'Saudi Arabia',
        },
      ]
      return countries
  }

}
