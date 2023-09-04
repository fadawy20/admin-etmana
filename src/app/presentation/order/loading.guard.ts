import { HostListener, Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CreateOrderComponent } from './create-order/create-order.component';

@Injectable({providedIn: 'root'})
export class LoadingGuard implements CanDeactivate<CreateOrderComponent> {
  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
}
  canDeactivate(component: CreateOrderComponent): boolean {
    // if(!component.canDeactivate){
    //     if (confirm("You have made updates on this page but have not submitted the information. Are you sure you want to reload this page?")) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }
    // unloadHandler(event: Event) {
    // console.log("Processing beforeunload...");
    // // Do more processing...
    // event.returnValue = false;
    // }
    return component.canDeactivate
  }

}
