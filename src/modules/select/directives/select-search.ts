import {
    Directive,
    Input,
    EventEmitter,
    Renderer2,
    ElementRef,
    HostListener,
    HostBinding
} from '@angular/core';

@Directive({
    selector: 'input[suiSelectSearch]'
})
export class SuiSelectSearch {
    @HostBinding('class.search')
    public readonly hasClasses: boolean;

    @HostBinding('attr.autocomplete')
    public readonly autoComplete: string;

    public set query(query: string) {
        this._renderer.setProperty(this._element.nativeElement, 'value', query);
    }

    debounce = (func: (any) => any, wait: number, immediate = false) => {
        let timeout;
        return function() {
            let context = this;
            let args = arguments;
            let later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            let callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    public onQueryUpdated: EventEmitter<string>;
    public onQueryKeyDown: EventEmitter<KeyboardEvent>;

    debouncedUpdateQuery: (query: string) => void;
    debouncedKeyDown: (e: KeyboardEvent) => void;
    constructor(private _renderer: Renderer2, private _element: ElementRef) {
        this.onQueryUpdated = new EventEmitter<string>();
        this.onQueryKeyDown = new EventEmitter<KeyboardEvent>();

        this.hasClasses = true;
        this.autoComplete = 'off';

        this.debouncedUpdateQuery = this.debounce((query) => {
            this.onQueryUpdated.emit(query);
        }, 300);
        this.debouncedKeyDown = this.debounce((e) => {
            this.onQueryKeyDown.emit(e);
        }, 300);
    }

    @HostListener('input', ['$event.target.value'])
    public updateQuery(query: string): void {
        this.debouncedUpdateQuery(query);
    }

    @HostListener('keydown', ['$event'])
    public onKeyDown(e: KeyboardEvent): void {
        this.debouncedKeyDown(e);
    }

    public focus(): void {
        // Slightly delay to support in menu search.
        this._element.nativeElement.focus();
        setTimeout(() => this._element.nativeElement.focus());
    }
}
