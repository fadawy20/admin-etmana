import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../core/layout/dashboard/dashboard.component';
import { AppRoutes } from 'src/app/routes';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      // {
      //   path: '',
      //   redirectTo: AppRoutes.dashboard.statistics.main,
      //   pathMatch: 'full',
      // },
      {
        path: '',
        redirectTo: AppRoutes.dashboard.product.main,
        pathMatch: 'full',
      },
      {
        path: AppRoutes.dashboard.statistics.main,
        loadChildren: () =>
          import('./statistics/statistics.module').then(
            (m) => m.StatisticsModule
          ),
      },
      {
        path: AppRoutes.dashboard.users.main,
        loadChildren: () =>
          import('./users/users.module').then((m) => m.UsersModule),
      },
      {
        path: AppRoutes.dashboard.colors.main,
        loadChildren: () =>
          import('./colors/colors.module').then((m) => m.ColorsModule),
      },
      {
        path: AppRoutes.dashboard.atrributes.main,
        loadChildren: () =>
          import('./attributes/attributes.module').then(
            (m) => m.AttributesModule
          ),
      },
      {
        path: AppRoutes.dashboard.productSets.main,
        loadChildren: () =>
          import('./product-sets/product-sets.module').then(
            (m) => m.ProductSetsModule
          ),
      },
      {
        path: AppRoutes.dashboard.categories.main,
        loadChildren: () =>
          import('./categories/categories.module').then(
            (m) => m.CategoriesModule
          ),
      },
      {
        path: AppRoutes.dashboard.brands.main,
        loadChildren: () =>
          import('./brand/brand.module').then((m) => m.BrandModule),
      },
      {
        path: AppRoutes.dashboard.product.main,
        loadChildren: () =>
          import('./product/product.module').then((m) => m.ProductModule),
      },
      {
        path: AppRoutes.dashboard.reasons.main,
        loadChildren: () =>
          import('./reasons/reasons.module').then((m) => m.REASONSModule),
      },
      {
        path: AppRoutes.dashboard.systemUser.main,
        loadChildren: () =>
          import('./system-user/system-user.module').then(
            (m) => m.SystemUserModule
          ),
      },
      {
        path: AppRoutes.dashboard.permissionGroup.main,
        loadChildren: () =>
          import('./permission-group/permission-group.module').then(
            (m) => m.PermissionGroupModule
          ),
      },
      {
        path: AppRoutes.dashboard.storageCondition.main,
        loadChildren: () =>
          import('./storage-condition/storage-condition.module').then(
            (m) => m.StorageConditionModule
          ),
      },
      {
        path: AppRoutes.dashboard.import.main,
        loadChildren: () =>
          import('./import/import.module').then((m) => m.ImportModule),
      },
      {
        path: AppRoutes.dashboard.seller.main,
        loadChildren: () =>
          import('./seller/seller.module').then((m) => m.SellerModule),
      },
      {
        path: AppRoutes.dashboard.order.main,
        loadChildren: () =>
          import('./order/order.module').then((m) => m.OrderModule),
      },
      {
        path: AppRoutes.dashboard.promotions.main,
        loadChildren: () =>
          import('./promotions/promotions.module').then(
            (m) => m.PromotionsModule
          ),
      },
      {
        path: AppRoutes.dashboard.report.main,
        loadChildren: () =>
          import('./report/report.module').then((m) => m.ReportModule),
      },
      {
        path: AppRoutes.dashboard.shipping.main,
        loadChildren: () =>
          import('./shipping-ruls/shipping-ruls.module').then(
            (m) => m.ShippingRulsModule
          ),
      },
      {
        path: AppRoutes.dashboard.credit.main,
        loadChildren: () =>
          import('./credit-store/credit-store.module').then(
            (m) => m.CreditStoreModule
          ),
      },
      {
        path : AppRoutes.dashboard.slider.main, loadChildren : ()=> import ('./slider/slider.module').then((m)=> m.SliderModule)
      },
      {
        path : AppRoutes.dashboard.banner.main, loadChildren : ()=> import ('./banner/banner.module').then((m)=> m.BannerModule)
      },
      {
        path : AppRoutes.dashboard.collection.main, loadChildren : ()=> import ('./collection/collection.module').then((m)=> m.CollectionModule)
      },
      {
        path: AppRoutes.dashboard.taxes.main,
        loadChildren: () =>
          import('./taxes/taxes.module').then((m) => m.TaxesModule),
      },

      {
        path:
          AppRoutes.dashboard.users.main +
          '/' +
          AppRoutes.dashboard.profile.main,
        loadChildren: () =>
          import('./profileUser/profile-user.module').then(
            (m) => m.ProfileUserModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, SharedModule],
  declarations: [],
})
export class PresentationModule {}
