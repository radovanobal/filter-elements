const defaults = {
    handleSelector: '[data-filter-key]',
    targetSelector: 'body',
    filterableSelector: '[data-filterable]',

    activeClass: '-active',

    useQuery: false,
    filterOnCreate: true,
    toggleActive: false
}

export default class FilterElements
{
    /**
     * Set a class on elements based on filters.
     * Filter handles can be links or selects.
     *
     * @param {Object} options
     * @param {string} options.handleSelector Selector for filter handle elements
     * @param {string} options.targetSelector Selector for wrapping filter target
     * @param {string} options.activeClass Class used for active handles and elements
     * @param {string} options.filterableSelector Selector for elements which can be filtered
     * @param {boolean} options.useQuery Whether to look at location.search for filter arguments
     * @param {boolean} options.filterOnCreate Whether to filter elements on creation
     * @param {boolean} options.toggleActive Whether to toggle a filter when handling events
     *
     */
    constructor(options) {
        this.options = Object.assign({}, defaults, options);
        this.init();

        if (this.options.filterOnCreate) {
            this.filter();
        }
    }

    init() {
        this.handleElements = document.querySelectorAll(this.options.handleSelector);
        this.targetElement = document.querySelector(this.options.targetSelector);

        this.initFilters();
        this.initHandlers();

        if (this.options.useQuery) {
            this.filterByQuery();
        }

        document.dispatchEvent(new CustomEvent('filter.ready'));
    }

    initFilters() {
        this.filters = {};

        this.handleElements.forEach(el => {
            let key = el.getAttribute('data-filter-key');

            if (key in this.filters && !el.classList.contains(this.options.activeClass)) return;

            let value = el.classList.contains(this.options.activeClass)
                        ? el.tagName === 'SELECT'
                            ? el.value
                            : el.getAttribute('data-filter-value')
                        : '';

            this.filters[key] = value
        });
    }

    initHandlers() {
        this.handleElements.forEach(element => {
            if (element.tagName === 'SELECT') {
                element.addEventListener('change', this.handleEvent.bind(this));
            } else {
                element.addEventListener('click', this.handleEvent.bind(this));
            }
        });
    }

    destroy() {
        this.handleElements.forEach(el => el.tagName === 'SELECT'
            ? el.removeEventListener('change', this.handleEvent.bind(this))
            : el.removeEventListener('click', this.handleEvent.bind(this))
        );

        this.filters = {};
    }

    refresh() {
        this.destroy();
        this.init();
    }



    filterByQuery() {
        // Not compatible with IE11
        let params = new URLSearchParams(location.search);
        params.forEach((value, key) => this.filters[key] = value.trim());
    }

    handleEvent(event) {
        const origin = event.currentTarget;

        const key = origin.getAttribute('data-filter-key');
        const value = (origin.tagName === 'SELECT')
                ? origin.value
                : origin.getAttribute('data-filter-value')

        if(!this.filters[key] || !this.options.toggleActive){
            this.filters[key] = value
        } else {
            this.filters = this.filters.filter(item => item[key] !== value)
        }
        
        this.filter();
    }

    filter() {
        let elements = this.filterElements();
        this.toggleHandleElements();

        if (this.options.useQuery) {
            this.updateQueryParams();
        }

        // Trigger event
        document.dispatchEvent(new CustomEvent('filter.filtered', {
            detail: {
                filter: this.filters,
                elements
            }
        }));
    }

    filterElements() {
        // Toggle filterableSelector items
        let elements = this.targetElement.querySelectorAll(this.options.filterableSelector);
        elements.forEach(element => element.setAttribute('data-filter-filtered', true));

        for (let [key, value] of Object.entries(this.filters)) {
            if (value.trim().length === 0) continue;

            elements = Array.prototype.filter.call(elements, el => {
                let items = el.getAttribute('data-filter-' + key).trim().split(',');
                return items.indexOf(value) >= 0;
            })
        }

        elements.forEach(element => element.setAttribute('data-filter-filtered', false));
        return elements;
    }

    toggleHandleElements() {
        // Toggle filter links nav
        this.handleElements.forEach(el => {
            let filterKey = el.getAttribute('data-filter-key');
            let filterValue = this.filters[filterKey] || '';

            if (el.tagName === 'SELECT') {
                for (let option of el.options) {
                    option.selected = (option.value == filterValue);
                }
                return;
            }

            let value = el.getAttribute('data-filter-value');

            if (value == filterValue) {
                el.classList.add(this.options.activeClass);
            } else {
                el.classList.remove(this.options.activeClass);
            }
        });
    }

    updateQueryParams() {
        let url = new URL(location.href);

        for (let [key, value] of Object.entries(this.filters)) {
            if (value.length == 0) {
                url.searchParams.delete(key);
            } else {
                url.searchParams.set(key, value);
            }
        }

        history.replaceState(null, '', url.toString());
    }
}
