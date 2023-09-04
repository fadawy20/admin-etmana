import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sallerconvert'
})
export class SallerconvertPipe implements PipeTransform {

  transform(item: any,product:any): unknown {
    let input=  item.shipments.find((itemf:any)=> itemf.seller_id==product.seller_variation.seller_id)
    return input.seller.name;
  }

}
