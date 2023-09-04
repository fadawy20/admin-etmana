import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SideBarService {
  arr: any[] = [];
  constructor() {
    // let x: any = localStorage.getItem('permissions');
    // this.arr = JSON.parse(x);
  }
  navItemsDashboard = [
    // {
    //   namePermission: 'dashboard',
    //   displayName: 'Dashboard',
    //   route: '/Dashboard/statistics',
    //   iconName: 'icon-Group-28-7',
    // },
    {
      displayName: 'Product Catalog',
      iconName: 'icon-Group-15145',
      children: [
        {
          namePermission: 'products',
          displayName: 'Products',
          route: '/Dashboard/product',
          iconName: 'chevron_right',
          parent: 'PRODUCT_CATALOG',
        },
        {
          namePermission: 'categories',
          displayName: 'Categories',
          route: '/Dashboard/categories',
          iconName: 'chevron_right',
          parent: 'PRODUCT_CATALOG',
        },
        {
          namePermission: 'brands',
          displayName: 'Brands',
          route: '/Dashboard/brands',
          iconName: 'chevron_right',
          parent: 'PRODUCT_CATALOG',
        },
        {
          namePermission: 'attributes',
          displayName: 'Attributes',
          route: '/Dashboard/attributes',
          iconName: 'chevron_right',
          parent: 'PRODUCT_CATALOG',
        },
        {
          namePermission: 'attribute values',
          displayName: 'Attribute Sets',
          route: '/Dashboard/productSets',
          iconName: 'chevron_right',
          parent: 'PRODUCT_CATALOG',
        },
        {
          namePermission: 'import logs',
          displayName: 'Imports',
          route: '/Dashboard/import',
          iconName: 'chevron_right',
          parent: 'PRODUCT_CATALOG',
        },
        {
          namePermission: 'reasons',
          displayName: 'Reasons',
          route: '/Dashboard/reasons',
          iconName: 'chevron_right',
          parent: 'PRODUCT_CATALOG',
        },
      ],
    },
    {
      namePermission: 'orders',
      displayName: 'Orders',
      route: '/Dashboard/order',
      iconName: 'icon-Group-28-2',
    },
    {
      namePermission: 'clients',
      displayName: 'Customers',
      route: '/Dashboard/users',
      iconName: 'icon-Group-28',
    },
    {
      namePermission: 'sellers',
      displayName: 'Sellers',
      route: '/Dashboard/seller',
      iconName: 'icon-Group-14859',
    },
    {
      namePermission: 'promotions',
      displayName: 'Promotions',
      route: '/Dashboard/promotions',
      iconName: 'icon-Group-28-3',
    },
    {
      namePermission: 'shipping fees',
      displayName: 'Shipping Rules',
      route: '/Dashboard/shipping',
      iconName: 'icon-Group-14917',
    },
    // {
    //   displayName: 'Help Desk',
    //   iconName: 'icon-Group-28-4',
    // },
    {
      namePermission: 'store credits',
      displayName: 'Store Credit',
      route: '/Dashboard/credit',
      iconName: 'icon-Group-28-7',
    },
    {
      namePermission: 'orders report',
      displayName: 'Reports',
      iconName: 'icon-Group-14859',
      route: '/Dashboard/report',
    },
    // {
    //   displayName: 'Taxes',
    //   iconName: 'icon-Group-28-4',
    // },

    {
      displayName: 'Settings',
      iconName: 'icon-Group-28-6',
      children: [
        {
          namePermission: 'admins',
          displayName: 'Users',
          route: '/Dashboard/systemUser',
          iconName: 'chevron_right',
          parent: 'SETTING',
        },
        {
          namePermission: 'roles',
          displayName: 'Permission Group',
          route: '/Dashboard/permissionGroup',
          iconName: 'chevron_right',
          parent: 'SETTING',
        },
        {
          namePermission: 'storage conditions',
          displayName: 'Storage Condition',
          route: '/Dashboard/storageCondition',
          iconName: 'chevron_right',
          parent: 'SETTING',
        },
        {
          displayName: 'Taxes',
          iconName: 'chevron_right',
          parent: 'SETTING',
          route: '/Dashboard/taxes',
        },
      ],
    },
    {
      displayName: 'CMS',
      iconName: 'icon-Group-28-6',
      children: [
        {
          namePermission: 'cms',
          displayName: 'Slider',
          route: '/Dashboard/slider',
          iconName: 'chevron_right',
          parent: 'CMS',
        },
        {
          namePermission: 'cms',
          displayName: 'Banner',
          route: '/Dashboard/banner',
          iconName: 'chevron_right',
          parent: 'CMS',
        },
        {
          namePermission: 'cms',
          displayName: 'Product List',
          route: '/Dashboard/collection',
          iconName: 'chevron_right',
          parent: 'CMS',
        },

      ],
    },
  ];
}
