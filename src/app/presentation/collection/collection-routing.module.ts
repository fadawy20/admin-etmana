import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectioncmsComponent } from './collectioncms.component';
import { CreatecollectionComponent } from './createcollection/createcollection.component';

const routes: Routes = [
{path : '', component : CollectioncmsComponent},
{path : 'createCollection', component : CreatecollectionComponent},
{path : 'editCollection/:id', component : CreatecollectionComponent, pathMatch : "full"}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectionRoutingModule { }
