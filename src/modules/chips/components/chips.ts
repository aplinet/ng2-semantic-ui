import { SuiSearch } from './../../search/components/search';
import {
    Component,
    ViewChild,
    Input,
    Output,
    EventEmitter,
    OnInit,
    forwardRef,
    ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HostBinding } from '@angular/core';
@Component({
    selector: 'sui-chips',
    templateUrl: './chips.html',
    styleUrls: ['./chips.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SuiChips),
            multi: true
        }
    ]
})
export class SuiChips implements OnInit, ControlValueAccessor {
    chips: string[] = [];
    propagateChange = (_: any) => {};
    activeChipIndex: number | null = null;

    @ViewChild(SuiSearch)
    search: SuiSearch<string>;

    @Input()
    options: string[];
    @Input()
    searchDelay: number;
    @Input()
    unique = true;

    @Output('resultSelected')
    public onResultSelected: EventEmitter<string> = new EventEmitter();

    @HostBinding('class.ui')
    @HostBinding('class.selection')
    @HostBinding('class.dropdown')
    @HostBinding('class.search')
    public readonly hasClasses: boolean = true;

    ngOnInit() {}

    resultSelected($event) {
        this.addChip($event);
        this.search.query = '';
        this.onResultSelected.next($event);
    }
    activateLastChip() {
        if (this.activeChipIndex !== null) {
            this.deleteChip(this.activeChipIndex);
            this.activeChipIndex = null;
        } else {
            this.activeChipIndex = this.getLastChip();
        }
    }
    parseChipInput(force = false) {
        const split = this.search.query.split(/[, ]+/);
        console.log('split',split);
        if (split.length > 1 || force) {
            split.forEach((chip) => {
                this.addChip(chip);
            });
            this.search.query = '';
        }
    }
    onInput($event: any) {
        console.log('input',$event);
        this.parseChipInput();
    }

    onInputBlur($event:FocusEvent){
        const relatedTarget = $event.relatedTarget as HTMLElement;
        if (!(relatedTarget && relatedTarget.classList.contains('ui') && relatedTarget.classList.contains('search'))){
            this.parseChipInput(true);
        } 
    }
    onKeyDown($event: KeyboardEvent) {
        this.parseChipInput();

        // 229 mobile space
        switch ($event.key) {
            case 'Enter':
                this.parseChipInput(true);
                $event.preventDefault();
                break;
            case 'Backspace':
                if (this.search.query === '') {
                    this.activateLastChip();
                }
                break;
            default:
                this.activeChipIndex = null;

                break;
        }
    }
    getLastChip(): number | null {
        const index = this.chips.length - 1;
        if (index < 0) {
            return null;
        }
        return index;
    }

    writeValue(value: string[]) {
        if (value !== undefined && Array.isArray(value)) {
            this.chips = value;
        } else {
            this.chips = [];
        }
    }
    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    registerOnTouched() {}

    onSearchFocus($event) {
        this.activeChipIndex = null;
    }
    deleteChip(index: number) {
        this.chips.splice(index, 1);
        this.propagateChange(this.chips);
    }
    addChip(chip: string) {
        if (!chip) {
            return false;
        }
        if (this.unique && this.chips.indexOf(chip) > -1) {
            return false;
        }
        this.chips.push(chip);
        this.propagateChange(this.chips);
    }
}
