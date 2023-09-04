import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberB',
})
export class NumberPipe implements PipeTransform {
  transform(value: any): unknown {
    const MILLION = 1000000;
    const THOUSAND = 1000;
    if (value.toString().length > 6) {
      let num = (value / MILLION).toFixed(1);
      return value + 'M';
    } else if (value.toString().length > 3) {
      let num = (value / THOUSAND).toFixed(1);
      return value+ 'K';
    } else return value;
    
    // const tHOUSAND = 1000;
    // const tenThousand = 10000;
    // const oneHundredThousand = 100000;
    // const mILLION = 1000000;
    // if (value > tHOUSAND && value < tenThousand ) {
    //   console.log(value);
      
    //   return value + 'k';
    // }
    // else return value
  
  }


}
