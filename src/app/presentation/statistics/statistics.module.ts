import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatisticsRoutingModule } from './statistics-routing.module';
import { StatisticsComponent } from './statistics.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SalesFunnelComponent } from './components/sales-funnel/sales-funnel.component';
import { SalesComponent } from './components/sales/sales.component';
import { InventoryLevelsComponent } from './components/inventory-levels/inventory-levels.component';
import { OnlineUsersComponent } from './components/online-users/online-users.component';
import { PromotionComponent } from './components/promotion/promotion.component';
import { OrderStatusComponent } from './components/order-status/order-status.component';
import { PerformingSellerComponent } from './components/performing-seller/performing-seller.component';
import { PerformingCategoriesComponent } from './components/performing-categories/performing-categories.component';

@NgModule({
  declarations: [
    StatisticsComponent,
    SalesFunnelComponent,
    SalesComponent,
    InventoryLevelsComponent,
    OnlineUsersComponent,
    PromotionComponent,
    OrderStatusComponent,
    PerformingSellerComponent,
    PerformingCategoriesComponent,
  ],
  imports: [CommonModule, StatisticsRoutingModule, SharedModule],
})
export class StatisticsModule {}
