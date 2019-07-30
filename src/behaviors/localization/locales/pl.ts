import { ILocaleValues } from './interfaces/values';

const pl: ILocaleValues = {
    datepicker: {
        months: [
            'Styczeń',
            'Luty',
            'Marzec',
            'Kwiecień',
            'Maj',
            'Czerwiec',
            'Lipiec',
            'Sierpień',
            'Wrzesień',
            'Październik',
            'Listopad',
            'Grudzień '
        ],
        monthsShort: [
            'Sty',
            'Lut',
            'Mar',
            'Kwi',
            'Maj',
            'Cze',
            'Lip',
            'Sie',
            'Wrz',
            'Paź',
            'Lis',
            'Gru'
        ],
        weekdays: ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'],
        weekdaysShort: ['Nie', 'Pn', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob'],
        weekdaysNarrow: ['N', 'P', 'W', 'Ś', 'C', 'P', 'S'],
        timesOfDay: ['a.m.', 'p.m.'],
        timesOfDayUppercase: ['AM', 'PM'],
        timesOfDayLowercase: ['am', 'pm'],
        formats: {
            time: 'h:mm A',
            datetime: 'D MMMM YYYY h:mm A',
            date: 'D MMMM YYYY',
            month: 'MMMM YYYY',
            year: 'YYYY'
        },
        firstDayOfWeek: 1
    },
    search: {
        placeholder: 'Szukaj...',
        noResults: {
            header: 'Brak wyników',
            message: 'Twoje wyszukiwanie, nie zwróciło wyników.'
        }
    },
    select: {
        noResultsMessage: 'Brak wyników',
        single: {
            placeholder: 'Wybierz'
        },
        multi: {
            placeholder: 'Wybierz...',
            maxSelectedMessage: 'Maks. #{max} zaznaczeń',
            selectedMessage: '#{count} zaznaczeń'
        }
    }
};

export default pl;
