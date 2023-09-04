import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isImage'
})
export class IsImagePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
