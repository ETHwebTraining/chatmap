import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { MapComponent } from './pages/map/map.component';

const mapRoutes: Routes = [
    {path: '', component: MapComponent }
];


@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(mapRoutes)
    ],
    exports: [
        RouterModule
    ],
    declarations: [],
    providers: [],
})
export class MapRoutingModule { }
