/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, HostBinding, ElementRef, EventEmitter, Output, Input, Directive } from "@angular/core";
import { KeyCode, customValueAccessorFactory, CustomValueAccessor } from "../../../misc/util/internal";
import { SuiLocalizationService } from "../../../behaviors/localization/internal";
import { SuiSelectBase } from "../classes/select-base";
/**
 * @template T, U
 */
var SuiMultiSelect = /** @class */ (function (_super) {
    tslib_1.__extends(SuiMultiSelect, _super);
    function SuiMultiSelect(element, localizationService) {
        var _this = _super.call(this, element, localizationService) || this;
        _this.selectedOptions = [];
        _this.selectedOptionsChange = new EventEmitter();
        _this.hasLabels = true;
        _this.hasClasses = true;
        return _this;
    }
    Object.defineProperty(SuiMultiSelect.prototype, "filteredOptions", {
        get: /**
         * @return {?}
         */
        function () {
            var _this = this;
            if (this.maxSelectedReached) {
                // If we have reached the maximum number of selections, then empty the results completely.
                return [];
            }
            /** @type {?} */
            var searchResults = this.searchService.results;
            if (!this.hasLabels) {
                return searchResults;
            }
            else {
                // Returns the search results \ selected options.
                return searchResults
                    .filter(function (r) { return _this.selectedOptions.find(function (o) { return r === o; }) == undefined; });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SuiMultiSelect.prototype, "availableOptions", {
        get: /**
         * @return {?}
         */
        function () {
            return this.filteredOptions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SuiMultiSelect.prototype, "hasLabels", {
        get: /**
         * @return {?}
         */
        function () {
            return this._hasLabels;
        },
        set: /**
         * @param {?} hasLabels
         * @return {?}
         */
        function (hasLabels) {
            this._hasLabels = hasLabels;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SuiMultiSelect.prototype, "placeholder", {
        get: /**
         * @return {?}
         */
        function () {
            return this._placeholder || this.localeValues.multi.placeholder;
        },
        set: /**
         * @param {?} placeholder
         * @return {?}
         */
        function (placeholder) {
            this._placeholder = placeholder;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SuiMultiSelect.prototype, "maxSelectedReached", {
        get: /**
         * @return {?}
         */
        function () {
            if (this.maxSelected == undefined) {
                // If there is no maximum then we can immediately return.
                return false;
            }
            return this.selectedOptions.length === this.maxSelected;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SuiMultiSelect.prototype, "maxSelectedMessage", {
        get: /**
         * @return {?}
         */
        function () {
            return this._localizationService.interpolate(this.localeValues.multi.maxSelectedMessage, [["max", this.maxSelected.toString()]]);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SuiMultiSelect.prototype, "selectedMessage", {
        get: /**
         * @return {?}
         */
        function () {
            return this._localizationService.interpolate(this.localeValues.multi.selectedMessage, [["count", this.selectedOptions.length.toString()]]);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    SuiMultiSelect.prototype.optionsUpdateHook = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this._writtenOptions && this.selectedOptions.length > 0) {
            // We need to check the options still exist.
            this.writeValue(this.selectedOptions.map(function (o) { return _this.valueGetter(o); }));
        }
        if (this._writtenOptions && this.searchService.options.length > 0) {
            // If there were values written by ngModel before the options had been loaded, this runs to fix it.
            this.selectedOptions = this._writtenOptions
                .map(function (v) { return ((_this.findOption(_this.searchService.options, v))); })
                .filter(function (v) { return v != undefined; });
            if (this.selectedOptions.length === this._writtenOptions.length) {
                this._writtenOptions = undefined;
            }
        }
    };
    /**
     * @param {?} option
     * @return {?}
     */
    SuiMultiSelect.prototype.initialiseRenderedOption = /**
     * @param {?} option
     * @return {?}
     */
    function (option) {
        _super.prototype.initialiseRenderedOption.call(this, option);
        // Boldens the item so it appears selected in the dropdown.
        option.isActive = !this.hasLabels && this.selectedOptions.indexOf(option.value) !== -1;
    };
    /**
     * @param {?} option
     * @return {?}
     */
    SuiMultiSelect.prototype.selectOption = /**
     * @param {?} option
     * @return {?}
     */
    function (option) {
        var _this = this;
        if (this.selectedOptions.indexOf(option) !== -1) {
            this.deselectOption(option);
            return;
        }
        this.selectedOptions.push(option);
        this.selectedOptionsChange.emit(this.selectedOptions.map(function (o) { return _this.valueGetter(o); }));
        this.resetQuery(false);
        // Automatically refocus the search input for better keyboard accessibility.
        this.focus();
        if (!this.hasLabels) {
            this.onAvailableOptionsRendered();
        }
    };
    /**
     * @param {?} values
     * @return {?}
     */
    SuiMultiSelect.prototype.writeValue = /**
     * @param {?} values
     * @return {?}
     */
    function (values) {
        var _this = this;
        if (values instanceof Array) {
            if (this.searchService.options.length > 0) {
                // If the options have already been loaded, we can immediately match the ngModel values to options.
                this.selectedOptions = values
                    .map(function (v) { return ((_this.findOption(_this.searchService.options, v))); })
                    .filter(function (v) { return v != undefined; });
            }
            if (values.length > 0 && this.selectedOptions.length === 0) {
                if (this.valueField && this.searchService.hasItemLookup) {
                    // If the search service has a selected lookup function, make use of that to load the initial values.
                    this.searchService
                        .initialLookup(values)
                        .then(function (items) { return _this.selectedOptions = items; });
                }
                else {
                    // Otherwise, cache the written value for when options are set.
                    this._writtenOptions = values;
                }
            }
            if (values.length === 0) {
                this.selectedOptions = [];
            }
        }
        else {
            this.selectedOptions = [];
        }
    };
    /**
     * @param {?} option
     * @return {?}
     */
    SuiMultiSelect.prototype.deselectOption = /**
     * @param {?} option
     * @return {?}
     */
    function (option) {
        var _this = this;
        // Update selected options to the previously selected options \ {option}.
        this.selectedOptions = this.selectedOptions.filter(function (so) { return so !== option; });
        this.selectedOptionsChange.emit(this.selectedOptions.map(function (o) { return _this.valueGetter(o); }));
        // Automatically refocus the search input for better keyboard accessibility.
        this.focus();
        if (!this.hasLabels) {
            this.onAvailableOptionsRendered();
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    SuiMultiSelect.prototype.onQueryInputKeydown = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (event.keyCode === KeyCode.Backspace && this.query === "" && this.selectedOptions.length > 0) {
            // Deselect the rightmost option when the user presses backspace in the search input.
            this.deselectOption(this.selectedOptions[this.selectedOptions.length - 1]);
        }
    };
    SuiMultiSelect.decorators = [
        { type: Component, args: [{
                    selector: "sui-multi-select",
                    template: "\n<!-- Dropdown icon -->\n<i class=\"{{ icon }} icon\" (click)=\"onCaretClick($event)\"></i>\n\n<ng-container *ngIf=\"hasLabels\">\n<!-- Multi-select labels -->\n    <sui-multi-select-label *ngFor=\"let selected of selectedOptions;\"\n                            [value]=\"selected\"\n                            [query]=\"query\"\n                            [formatter]=\"configuredFormatter\"\n                            [template]=\"optionTemplate\"\n                            (deselected)=\"deselectOption($event)\"></sui-multi-select-label>\n</ng-container>\n\n<!-- Query input -->\n<input suiSelectSearch\n       type=\"text\"\n       [hidden]=\"!isSearchable || isSearchExternal\">\n\n<!-- Helper text -->\n<div class=\"text\"\n     [class.default]=\"hasLabels\"\n     [class.filtered]=\"!!query && !isSearchExternal\">\n    \n    <!-- Placeholder text -->\n    <ng-container *ngIf=\"hasLabels; else selectedBlock\">{{ placeholder }}</ng-container>\n    \n    <!-- Summary shown when labels are hidden -->\n    <ng-template #selectedBlock> {{ selectedMessage }}</ng-template>\n</div>\n\n<!-- Select dropdown menu -->\n<div class=\"menu\"\n     suiDropdownMenu\n     [menuTransition]=\"transition\"\n     [menuTransitionDuration]=\"transitionDuration\"\n     [menuAutoSelectFirst]=\"true\">\n\n    <ng-content></ng-content>\n    <ng-container *ngIf=\"availableOptions.length == 0 \">\n        <div *ngIf=\"!maxSelectedReached\" class=\"message\">{{ localeValues.noResultsMessage }}</div>\n        <div *ngIf=\"maxSelectedReached\" class=\"message\">{{ maxSelectedMessage }}</div>\n    </ng-container>\n</div>\n",
                    styles: ["\n:host input.search {\n    width: 12em !important;\n}\n"]
                },] },
    ];
    /** @nocollapse */
    SuiMultiSelect.ctorParameters = function () { return [
        { type: ElementRef },
        { type: SuiLocalizationService }
    ]; };
    SuiMultiSelect.propDecorators = {
        selectedOptionsChange: [{ type: Output }],
        hasLabels: [{ type: Input }],
        placeholder: [{ type: Input }],
        maxSelected: [{ type: Input }],
        hasClasses: [{ type: HostBinding, args: ["class.multiple",] }]
    };
    return SuiMultiSelect;
}(SuiSelectBase));
export { SuiMultiSelect };
if (false) {
    /** @type {?} */
    SuiMultiSelect.prototype.selectedOptions;
    /** @type {?} */
    SuiMultiSelect.prototype._writtenOptions;
    /** @type {?} */
    SuiMultiSelect.prototype.selectedOptionsChange;
    /** @type {?} */
    SuiMultiSelect.prototype._hasLabels;
    /** @type {?} */
    SuiMultiSelect.prototype._placeholder;
    /** @type {?} */
    SuiMultiSelect.prototype.maxSelected;
    /** @type {?} */
    SuiMultiSelect.prototype.hasClasses;
}
/**
 * @template T, U
 */
var SuiMultiSelectValueAccessor = /** @class */ (function (_super) {
    tslib_1.__extends(SuiMultiSelectValueAccessor, _super);
    function SuiMultiSelectValueAccessor(host) {
        return _super.call(this, host) || this;
    }
    SuiMultiSelectValueAccessor.decorators = [
        { type: Directive, args: [{
                    selector: "sui-multi-select",
                    host: {
                        "(selectedOptionsChange)": "onChange($event)",
                        "(touched)": "onTouched()"
                    },
                    providers: [customValueAccessorFactory(SuiMultiSelectValueAccessor)]
                },] },
    ];
    /** @nocollapse */
    SuiMultiSelectValueAccessor.ctorParameters = function () { return [
        { type: SuiMultiSelect }
    ]; };
    return SuiMultiSelectValueAccessor;
}(CustomValueAccessor));
export { SuiMultiSelectValueAccessor };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGktc2VsZWN0LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmcyLXNlbWFudGljLXVpLyIsInNvdXJjZXMiOlsibW9kdWxlcy9zZWxlY3QvY29tcG9uZW50cy9tdWx0aS1zZWxlY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNHLE9BQU8sRUFBNEIsT0FBTyxFQUFFLDBCQUEwQixFQUFFLG1CQUFtQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDakksT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFDbEYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDOzs7OztJQXdEYiwwQ0FBbUI7SUE2RXpELHdCQUFZLE9BQWtCLEVBQUUsbUJBQTBDO1FBQTFFLFlBQ0ksa0JBQU0sT0FBTyxFQUFFLG1CQUFtQixDQUFDLFNBT3RDO1FBTEcsS0FBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7UUFDMUIsS0FBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFFckQsS0FBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDdEIsS0FBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7O0tBQzFCOzBCQTdFVSwyQ0FBZTs7Ozs7O1lBQ3RCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7O2dCQUUxQixNQUFNLENBQUMsRUFBRSxDQUFDO2FBQ2I7O1lBRUQsSUFBTSxhQUFhLEdBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUM7WUFFckQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDbEIsTUFBTSxDQUFDLGFB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QUE4QztJQUNqRyxxQ0FBWSxJQUF5QjtlQUNqQyxrQkFBTSxJQUFJLENBQUM7S0FDZDs7Z0JBWEosU0FBUyxTQUFDO29CQUNQLFFBQVEsRUFBRSxrQkFBa0I7b0JBQzVCLElBQUksRUFBRTt3QkFDRix5QkFBeUIsRUFBRSxrQkFBa0I7d0JBQzdDLFdBQVcsRUFBRSxhQUFhO3FCQUM3QjtvQkFDRCxTQUFTLEVBQUUsQ0FBQywwQkFBMEIsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO2lCQUN2RTs7OztnQkFFb0IsY0FBYzs7c0NBelBuQztFQXdQdUQsbUJBQW1CO1NBQTdELDJCQUEyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSG9zdEJpbmRpbmcsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgT3V0cHV0LCBJbnB1dCwgRGlyZWN0aXZlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IElDdXN0b21WYWx1ZUFjY2Vzc29ySG9zdCwgS2V5Q29kZSwgY3VzdG9tVmFsdWVBY2Nlc3NvckZhY3RvcnksIEN1c3RvbVZhbHVlQWNjZXNzb3IgfSBmcm9tIFwiLi4vLi4vLi4vbWlzYy91dGlsL2ludGVybmFsXCI7XG5pbXBvcnQgeyBTdWlMb2NhbGl6YXRpb25TZXJ2aWNlIH0gZnJvbSBcIi4uLy4uLy4uL2JlaGF2aW9ycy9sb2NhbGl6YXRpb24vaW50ZXJuYWxcIjtcbmltcG9ydCB7IFN1aVNlbGVjdEJhc2UgfSBmcm9tIFwiLi4vY2xhc3Nlcy9zZWxlY3QtYmFzZVwiO1xuaW1wb3J0IHsgU3VpU2VsZWN0T3B0aW9uIH0gZnJvbSBcIi4vc2VsZWN0LW9wdGlvblwiO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJzdWktbXVsdGktc2VsZWN0XCIsXG4gICAgdGVtcGxhdGU6IGBcbjwhLS0gRHJvcGRvd24gaWNvbiAtLT5cbjxpIGNsYXNzPVwie3sgaWNvbiB9fSBpY29uXCIgKGNsaWNrKT1cIm9uQ2FyZXRDbGljaygkZXZlbnQpXCI+PC9pPlxuXG48bmctY29udGFpbmVyICpuZ0lmPVwiaGFzTGFiZWxzXCI+XG48IS0tIE11bHRpLXNlbGVjdCBsYWJlbHMgLS0+XG4gICAgPHN1aS1tdWx0aS1zZWxlY3QtbGFiZWwgKm5nRm9yPVwibGV0IHNlbGVjdGVkIG9mIHNlbGVjdGVkT3B0aW9ucztcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFt2YWx1ZV09XCJzZWxlY3RlZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3F1ZXJ5XT1cInF1ZXJ5XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbZm9ybWF0dGVyXT1cImNvbmZpZ3VyZWRGb3JtYXR0ZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFt0ZW1wbGF0ZV09XCJvcHRpb25UZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGRlc2VsZWN0ZWQpPVwiZGVzZWxlY3RPcHRpb24oJGV2ZW50KVwiPjwvc3VpLW11bHRpLXNlbGVjdC1sYWJlbD5cbjwvbmctY29udGFpbmVyPlxuXG48IS0tIFF1ZXJ5IGlucHV0IC0tPlxuPGlucHV0IHN1aVNlbGVjdFNlYXJjaFxuICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICBbaGlkZGVuXT1cIiFpc1NlYXJjaGFibGUgfHwgaXNTZWFyY2hFeHRlcm5hbFwiPlxuXG48IS0tIEhlbHBlciB0ZXh0IC0tPlxuPGRpdiBjbGFzcz1cInRleHRcIlxuICAgICBbY2xhc3MuZGVmYXVsdF09XCJoYXNMYWJlbHNcIlxuICAgICBbY2xhc3MuZmlsdGVyZWRdPVwiISFxdWVyeSAmJiAhaXNTZWFyY2hFeHRlcm5hbFwiPlxuICAgIFxuICAgIDwhLS0gUGxhY2Vob2xkZXIgdGV4dCAtLT5cbiAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiaGFzTGFiZWxzOyBlbHNlIHNlbGVjdGVkQmxvY2tcIj57eyBwbGFjZWhvbGRlciB9fTwvbmctY29udGFpbmVyPlxuICAgIFxuICAgIDwhLS0gU3VtbWFyeSBzaG93biB3aGVuIGxhYmVscyBhcmUgaGlkZGVuIC0tPlxuICAgIDxuZy10ZW1wbGF0ZSAjc2VsZWN0ZWRCbG9jaz4ge3sgc2VsZWN0ZWRNZXNzYWdlIH19PC9uZy10ZW1wbGF0ZT5cbjwvZGl2PlxuXG48IS0tIFNlbGVjdCBkcm9wZG93biBtZW51IC0tPlxuPGRpdiBjbGFzcz1cIm1lbnVcIlxuICAgICBzdWlEcm9wZG93bk1lbnVcbiAgICAgW21lbnVUcmFuc2l0aW9uXT1cInRyYW5zaXRpb25cIlxuICAgICBbbWVudVRyYW5zaXRpb25EdXJhdGlvbl09XCJ0cmFuc2l0aW9uRHVyYXRpb25cIlxuICAgICBbbWVudUF1dG9TZWxlY3RGaXJzdF09XCJ0cnVlXCI+XG5cbiAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImF2YWlsYWJsZU9wdGlvbnMubGVuZ3RoID09IDAgXCI+XG4gICAgICAgIDxkaXYgKm5nSWY9XCIhbWF4U2VsZWN0ZWRSZWFjaGVkXCIgY2xhc3M9XCJtZXNzYWdlXCI+e3sgbG9jYWxlVmFsdWVzLm5vUmVzdWx0c01lc3NhZ2UgfX08L2Rpdj5cbiAgICAgICAgPGRpdiAqbmdJZj1cIm1heFNlbGVjdGVkUmVhY2hlZFwiIGNsYXNzPVwibWVzc2FnZVwiPnt7IG1heFNlbGVjdGVkTWVzc2FnZSB9fTwvZGl2PlxuICAgIDwvbmctY29udGFpbmVyPlxuPC9kaXY+XG5gLFxuICAgIHN0eWxlczogW2Bcbjpob3N0IGlucHV0LnNlYXJjaCB7XG4gICAgd2lkdGg6IDEyZW0gIWltcG9ydGFudDtcbn1cbmBdXG59KVxuZXhwb3J0IGNsYXNzIFN1aU11bHRpU2VsZWN0PFQsIFU+IGV4dGVuZHMgU3VpU2VsZWN0QmFzZTxULCBVPiBpbXBsZW1lbnRzIElDdXN0b21WYWx1ZUFjY2Vzc29ySG9zdDxVW10+IHtcbiAgICBwdWJsaWMgc2VsZWN0ZWRPcHRpb25zOlRbXTtcbiAgICAvLyBTdG9yZXMgdGhlIHZhbHVlcyB3cml0dGVuIGJ5IG5nTW9kZWwgYmVmb3JlIGl0IGNhbiBiZSBtYXRjaGVkIHRvIGFuIG9wdGlvbiBmcm9tIGBvcHRpb25zYC5cbiAgICBwcml2YXRlIF93cml0dGVuT3B0aW9ucz86VVtdO1xuXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIHNlbGVjdGVkT3B0aW9uc0NoYW5nZTpFdmVudEVtaXR0ZXI8VVtdPjtcblxuICAgIHB1YmxpYyBnZXQgZmlsdGVyZWRPcHRpb25zKCk6VFtdIHtcbiAgICAgICAgaWYgKHRoaXMubWF4U2VsZWN0ZWRSZWFjaGVkKSB7XG4gICAgICAgICAgICAvLyBJZiB3ZSBoYXZlIHJlYWNoZWQgdGhlIG1heGltdW0gbnVtYmVyIG9mIHNlbGVjdGlvbnMsIHRoZW4gZW1wdHkgdGhlIHJlc3VsdHMgY29tcGxldGVseS5cbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNlYXJjaFJlc3VsdHM6VFtdID0gdGhpcy5zZWFyY2hTZXJ2aWNlLnJlc3VsdHM7XG5cbiAgICAgICAgaWYgKCF0aGlzLmhhc0xhYmVscykge1xuICAgICAgICAgICAgcmV0dXJuIHNlYXJjaFJlc3VsdHM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBSZXR1cm5zIHRoZSBzZWFyY2ggcmVzdWx0cyBcXCBzZWxlY3RlZCBvcHRpb25zLlxuICAgICAgICAgICAgcmV0dXJuIHNlYXJjaFJlc3VsdHNcbiAgICAgICAgICAgICAgICAuZmlsdGVyKHIgPT4gdGhpcy5zZWxlY3RlZE9wdGlvbnMuZmluZChvID0+IHIgPT09IG8pID09IHVuZGVmaW5lZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGF2YWlsYWJsZU9wdGlvbnMoKTpUW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5maWx0ZXJlZE9wdGlvbnM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfaGFzTGFiZWxzOmJvb2xlYW47XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgaGFzTGFiZWxzKCk6Ym9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9oYXNMYWJlbHM7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBoYXNMYWJlbHMoaGFzTGFiZWxzOmJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5faGFzTGFiZWxzID0gaGFzTGFiZWxzO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3BsYWNlaG9sZGVyOnN0cmluZztcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBwbGFjZWhvbGRlcigpOnN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wbGFjZWhvbGRlciB8fCB0aGlzLmxvY2FsZVZhbHVlcy5tdWx0aS5wbGFjZWhvbGRlcjtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IHBsYWNlaG9sZGVyKHBsYWNlaG9sZGVyOnN0cmluZykge1xuICAgICAgICB0aGlzLl9wbGFjZWhvbGRlciA9IHBsYWNlaG9sZGVyO1xuICAgIH1cblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIG1heFNlbGVjdGVkOm51bWJlcjtcblxuICAgIHB1YmxpYyBnZXQgbWF4U2VsZWN0ZWRSZWFjaGVkKCk6Ym9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLm1heFNlbGVjdGVkID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gSWYgdGhlcmUgaXMgbm8gbWF4aW11bSB0aGVuIHdlIGNhbiBpbW1lZGlhdGVseSByZXR1cm4uXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRPcHRpb25zLmxlbmd0aCA9PT0gdGhpcy5tYXhTZWxlY3RlZDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IG1heFNlbGVjdGVkTWVzc2FnZSgpOnN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2NhbGl6YXRpb25TZXJ2aWNlLmludGVycG9sYXRlKFxuICAgICAgICAgICAgdGhpcy5sb2NhbGVWYWx1ZXMubXVsdGkubWF4U2VsZWN0ZWRNZXNzYWdlLFxuICAgICAgICAgICAgW1tcIm1heFwiLCB0aGlzLm1heFNlbGVjdGVkLnRvU3RyaW5nKCldXSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBzZWxlY3RlZE1lc3NhZ2UoKTpzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxpemF0aW9uU2VydmljZS5pbnRlcnBvbGF0ZShcbiAgICAgICAgICAgIHRoaXMubG9jYWxlVmFsdWVzLm11bHRpLnNlbGVjdGVkTWVzc2FnZSxcbiAgICAgICAgICAgIFtbXCJjb3VudFwiLCB0aGlzLnNlbGVjdGVkT3B0aW9ucy5sZW5ndGgudG9TdHJpbmcoKV1dKTtcbiAgICB9XG5cbiAgICBASG9zdEJpbmRpbmcoXCJjbGFzcy5tdWx0aXBsZVwiKVxuICAgIHB1YmxpYyByZWFkb25seSBoYXNDbGFzc2VzOmJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OkVsZW1lbnRSZWYsIGxvY2FsaXphdGlvblNlcnZpY2U6U3VpTG9jYWxpemF0aW9uU2VydmljZSkge1xuICAgICAgICBzdXBlcihlbGVtZW50LCBsb2NhbGl6YXRpb25TZXJ2aWNlKTtcblxuICAgICAgICB0aGlzLnNlbGVjdGVkT3B0aW9ucyA9IFtdO1xuICAgICAgICB0aGlzLnNlbGVjdGVkT3B0aW9uc0NoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8VVtdPigpO1xuXG4gICAgICAgIHRoaXMuaGFzTGFiZWxzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5oYXNDbGFzc2VzID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgb3B0aW9uc1VwZGF0ZUhvb2soKTp2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLl93cml0dGVuT3B0aW9ucyAmJiB0aGlzLnNlbGVjdGVkT3B0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIHRoZSBvcHRpb25zIHN0aWxsIGV4aXN0LlxuICAgICAgICAgICAgdGhpcy53cml0ZVZhbHVlKHRoaXMuc2VsZWN0ZWRPcHRpb25zLm1hcChvID0+IHRoaXMudmFsdWVHZXR0ZXIobykpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl93cml0dGVuT3B0aW9ucyAmJiB0aGlzLnNlYXJjaFNlcnZpY2Uub3B0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGVyZSB3ZXJlIHZhbHVlcyB3cml0dGVuIGJ5IG5nTW9kZWwgYmVmb3JlIHRoZSBvcHRpb25zIGhhZCBiZWVuIGxvYWRlZCwgdGhpcyBydW5zIHRvIGZpeCBpdC5cbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRPcHRpb25zID0gdGhpcy5fd3JpdHRlbk9wdGlvbnNcbiAgICAgICAgICAgICAgICAvLyBub24tbnVsbCBhc3NlcnRpb24gYWRkZWQgaGVyZSBiZWNhdXNlIFR5cGVzY3JpcHQgZG9lc24ndCByZWNvZ25pc2UgdGhlIG5vbi1udWxsIGZpbHRlci5cbiAgICAgICAgICAgICAgICAubWFwKHYgPT4gdGhpcy5maW5kT3B0aW9uKHRoaXMuc2VhcmNoU2VydmljZS5vcHRpb25zLCB2KSEpXG4gICAgICAgICAgICAgICAgLmZpbHRlcih2ID0+IHYgIT0gdW5kZWZpbmVkKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRPcHRpb25zLmxlbmd0aCA9PT0gdGhpcy5fd3JpdHRlbk9wdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fd3JpdHRlbk9wdGlvbnMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaW5pdGlhbGlzZVJlbmRlcmVkT3B0aW9uKG9wdGlvbjpTdWlTZWxlY3RPcHRpb248VD4pOnZvaWQge1xuICAgICAgICBzdXBlci5pbml0aWFsaXNlUmVuZGVyZWRPcHRpb24ob3B0aW9uKTtcblxuICAgICAgICAvLyBCb2xkZW5zIHRoZSBpdGVtIHNvIGl0IGFwcGVhcnMgc2VsZWN0ZWQgaW4gdGhlIGRyb3Bkb3duLlxuICAgICAgICBvcHRpb24uaXNBY3RpdmUgPSAhdGhpcy5oYXNMYWJlbHMgJiYgdGhpcy5zZWxlY3RlZE9wdGlvbnMuaW5kZXhPZihvcHRpb24udmFsdWUpICE9PSAtMTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2VsZWN0T3B0aW9uKG9wdGlvbjpUKTp2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRPcHRpb25zLmluZGV4T2Yob3B0aW9uKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuZGVzZWxlY3RPcHRpb24ob3B0aW9uKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNlbGVjdGVkT3B0aW9ucy5wdXNoKG9wdGlvbik7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRPcHRpb25zQ2hhbmdlLmVtaXQodGhpcy5zZWxlY3RlZE9wdGlvbnMubWFwKG8gPT4gdGhpcy52YWx1ZUdldHRlcihvKSkpO1xuXG4gICAgICAgIHRoaXMucmVzZXRRdWVyeShmYWxzZSk7XG5cbiAgICAgICAgLy8gQXV0b21hdGljYWxseSByZWZvY3VzIHRoZSBzZWFyY2ggaW5wdXQgZm9yIGJldHRlciBrZXlib2FyZCBhY2Nlc3NpYmlsaXR5LlxuICAgICAgICB0aGlzLmZvY3VzKCk7XG5cbiAgICAgICAgaWYgKCF0aGlzLmhhc0xhYmVscykge1xuICAgICAgICAgICAgdGhpcy5vbkF2YWlsYWJsZU9wdGlvbnNSZW5kZXJlZCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHdyaXRlVmFsdWUodmFsdWVzOlVbXSk6dm9pZCB7XG4gICAgICAgIGlmICh2YWx1ZXMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2VhcmNoU2VydmljZS5vcHRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgb3B0aW9ucyBoYXZlIGFscmVhZHkgYmVlbiBsb2FkZWQsIHdlIGNhbiBpbW1lZGlhdGVseSBtYXRjaCB0aGUgbmdNb2RlbCB2YWx1ZXMgdG8gb3B0aW9ucy5cbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkT3B0aW9ucyA9IHZhbHVlc1xuICAgICAgICAgICAgICAgICAgICAvLyBub24tbnVsbCBhc3NlcnRpb24gYWRkZWQgaGVyZSBiZWNhdXNlIFR5cGVzY3JpcHQgZG9lc24ndCByZWNvZ25pc2UgdGhlIG5vbi1udWxsIGZpbHRlci5cbiAgICAgICAgICAgICAgICAgICAgLm1hcCh2ID0+IHRoaXMuZmluZE9wdGlvbih0aGlzLnNlYXJjaFNlcnZpY2Uub3B0aW9ucywgdikhKVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKHYgPT4gdiAhPSB1bmRlZmluZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHZhbHVlcy5sZW5ndGggPiAwICYmIHRoaXMuc2VsZWN0ZWRPcHRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlRmllbGQgJiYgdGhpcy5zZWFyY2hTZXJ2aWNlLmhhc0l0ZW1Mb29rdXApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIHNlYXJjaCBzZXJ2aWNlIGhhcyBhIHNlbGVjdGVkIGxvb2t1cCBmdW5jdGlvbiwgbWFrZSB1c2Ugb2YgdGhhdCB0byBsb2FkIHRoZSBpbml0aWFsIHZhbHVlcy5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hTZXJ2aWNlXG4gICAgICAgICAgICAgICAgICAgICAgICAuaW5pdGlhbExvb2t1cCh2YWx1ZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihpdGVtcyA9PiB0aGlzLnNlbGVjdGVkT3B0aW9ucyA9IGl0ZW1zKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBPdGhlcndpc2UsIGNhY2hlIHRoZSB3cml0dGVuIHZhbHVlIGZvciB3aGVuIG9wdGlvbnMgYXJlIHNldC5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fd3JpdHRlbk9wdGlvbnMgPSB2YWx1ZXM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHZhbHVlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkT3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZE9wdGlvbnMgPSBbXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBkZXNlbGVjdE9wdGlvbihvcHRpb246VCk6dm9pZCB7XG4gICAgICAgIC8vIFVwZGF0ZSBzZWxlY3RlZCBvcHRpb25zIHRvIHRoZSBwcmV2aW91c2x5IHNlbGVjdGVkIG9wdGlvbnMgXFwge29wdGlvbn0uXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRPcHRpb25zID0gdGhpcy5zZWxlY3RlZE9wdGlvbnMuZmlsdGVyKHNvID0+IHNvICE9PSBvcHRpb24pO1xuICAgICAgICB0aGlzLnNlbGVjdGVkT3B0aW9uc0NoYW5nZS5lbWl0KHRoaXMuc2VsZWN0ZWRPcHRpb25zLm1hcChvID0+IHRoaXMudmFsdWVHZXR0ZXIobykpKTtcblxuICAgICAgICAvLyBBdXRvbWF0aWNhbGx5IHJlZm9jdXMgdGhlIHNlYXJjaCBpbnB1dCBmb3IgYmV0dGVyIGtleWJvYXJkIGFjY2Vzc2liaWxpdHkuXG4gICAgICAgIHRoaXMuZm9jdXMoKTtcblxuICAgICAgICBpZiAoIXRoaXMuaGFzTGFiZWxzKSB7XG4gICAgICAgICAgICB0aGlzLm9uQXZhaWxhYmxlT3B0aW9uc1JlbmRlcmVkKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgb25RdWVyeUlucHV0S2V5ZG93bihldmVudDpLZXlib2FyZEV2ZW50KTp2b2lkIHtcbiAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IEtleUNvZGUuQmFja3NwYWNlICYmIHRoaXMucXVlcnkgPT09IFwiXCIgJiYgdGhpcy5zZWxlY3RlZE9wdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgLy8gRGVzZWxlY3QgdGhlIHJpZ2h0bW9zdCBvcHRpb24gd2hlbiB0aGUgdXNlciBwcmVzc2VzIGJhY2tzcGFjZSBpbiB0aGUgc2VhcmNoIGlucHV0LlxuICAgICAgICAgICAgdGhpcy5kZXNlbGVjdE9wdGlvbih0aGlzLnNlbGVjdGVkT3B0aW9uc1t0aGlzLnNlbGVjdGVkT3B0aW9ucy5sZW5ndGggLSAxXSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIFZhbHVlIGFjY2Vzc29yIGRpcmVjdGl2ZSBmb3IgdGhlIHNlbGVjdCB0byBzdXBwb3J0IG5nTW9kZWwuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogXCJzdWktbXVsdGktc2VsZWN0XCIsXG4gICAgaG9zdDoge1xuICAgICAgICBcIihzZWxlY3RlZE9wdGlvbnNDaGFuZ2UpXCI6IFwib25DaGFuZ2UoJGV2ZW50KVwiLFxuICAgICAgICBcIih0b3VjaGVkKVwiOiBcIm9uVG91Y2hlZCgpXCJcbiAgICB9LFxuICAgIHByb3ZpZGVyczogW2N1c3RvbVZhbHVlQWNjZXNzb3JGYWN0b3J5KFN1aU11bHRpU2VsZWN0VmFsdWVBY2Nlc3NvcildXG59KVxuZXhwb3J0IGNsYXNzIFN1aU11bHRpU2VsZWN0VmFsdWVBY2Nlc3NvcjxULCBVPiBleHRlbmRzIEN1c3RvbVZhbHVlQWNjZXNzb3I8VVtdLCBTdWlNdWx0aVNlbGVjdDxULCBVPj4ge1xuICAgIGNvbnN0cnVjdG9yKGhvc3Q6U3VpTXVsdGlTZWxlY3Q8VCwgVT4pIHtcbiAgICAgICAgc3VwZXIoaG9zdCk7XG4gICAgfVxufVxuIl19