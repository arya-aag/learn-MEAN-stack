import { NgModule } from '../../node_modules/@angular/core';

import {
  MatToolbarModule,
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatIconModule,
  MatExpansionModule
} from '@angular/material';

@NgModule({
  declarations: [],
  imports: [MatToolbarModule, MatInputModule, MatCardModule, MatButtonModule, MatIconModule, MatExpansionModule],
  providers: [],
  exports: [MatToolbarModule, MatInputModule, MatCardModule, MatButtonModule, MatIconModule, MatExpansionModule]
})
export class AppMaterialModule {}
