export const layerFiltersTemplate = () => `
    <div class="filters-content">
        <div class="filters-section">
            <div class="filters-header">
                <h3>Filters</h3>
                <span class="applied-filters">3 applied <span class="remove">×</span></span>
            </div>
            
            <div class="filter-group">
                <button class="filter-button">
                    <span>Company name</span>
                    <span>›</span>
                </button>
            </div>

            <div class="filter-group">
                <button class="filter-button">
                    <span>Location</span>
                    <span>›</span>
                </button>
                <div class="filter-tags">
                    <span class="filter-tag">Berlin <span class="remove">×</span></span>
                    <span class="filter-tag">France <span class="remove">×</span></span>
                </div>
            </div>

            <div class="filter-group">
                <button class="filter-button">
                    <span>Industry</span>
                    <span>›</span>
                </button>
            </div>

            <div class="filter-group">
                <button class="filter-button">
                    <span>Employee headcount</span>
                    <span>›</span>
                </button>
            </div>

            <div class="filter-group">
                <button class="filter-button">
                    <span>Revenue</span>
                    <span>›</span>
                </button>
                <div class="filter-tags">
                    <span class="filter-tag">1mil <span class="remove">×</span></span>
                </div>
            </div>

            <div class="filter-group">
                <button class="filter-button">
                    <span>Funding</span>
                    <span>›</span>
                </button>
            </div>

            <div class="filter-group">
                <button class="filter-button">
                    <span>Technology</span>
                    <span>›</span>
                </button>
            </div>

            <div class="filter-group">
                <button class="filter-button">
                    <span>Year founded</span>
                    <span>›</span>
                </button>
                <div class="filter-tags">
                    <span class="filter-tag">2024 <span class="remove">×</span></span>
                    <span class="filter-tag">2023 <span class="remove">×</span></span>
                </div>
            </div>
        </div>

        <div class="funding-section">
            <h3>Select funding date and type</h3>
            
            <div class="funding-options">
                <label class="funding-option selected">
                    <input type="radio" name="funding" checked>
                    <span>Any round</span>
                </label>
                <label class="funding-option">
                    <input type="radio" name="funding">
                    <span>Last round</span>
                </label>
            </div>

            <div class="funding-range">
                <label>Funding date</label>
                <div class="range-input">
                    <select>
                        <option>All times</option>
                    </select>
                </div>
            </div>

            <div class="advanced-section">
                <button class="advanced-toggle">
                    <span>▼</span> Advanced
                </button>

                <div class="funding-range">
                    <label>Select last funding amount</label>
                    <div class="range-inputs">
                        <div class="range-input">
                            <select>
                                <option>$ Min</option>
                            </select>
                        </div>
                        <span>to</span>
                        <div class="range-input">
                            <select>
                                <option>$ Max</option>
                            </select>
                        </div>
                    </div>
                    <button class="advanced-toggle">Apply</button>
                </div>

                <div class="funding-range">
                    <label>Select total funding amount</label>
                    <div class="range-inputs">
                        <div class="range-input">
                            <select>
                                <option>$ Min</option>
                            </select>
                        </div>
                        <span>to</span>
                        <div class="range-input">
                            <select>
                                <option>$ Max</option>
                            </select>
                        </div>
                    </div>
                    <button class="advanced-toggle">Apply</button>
                </div>
            </div>
        </div>
    </div>
`;