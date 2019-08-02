import { SuiSearchModule } from './../search/search.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuiChips } from './components/chips';

@NgModule({
    imports: [CommonModule, FormsModule, SuiSearchModule],
    declarations: [SuiChips],
    exports: [SuiChips]
})
export class SuiChipsModule {}
