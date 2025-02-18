/** @odoo-module **/

import { X2ManyField, x2ManyField } from "@web/views/fields/x2many/x2many_field";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { useState } from "@odoo/owl";

// Custom X2Many Field widget for showing all records without pagination
export class O2mShowAll extends X2ManyField {
    /**
     * Setup method initializes the state and calls the parent setup method.
     */
    setup() {
        super.setup();
        // Initialize the state with showButton set to true and pagerLimit set to the current limit or total
        this.state = useState({
            showAllButton: false,
            showLessButton: false,
            pagerLimit: this.pagerProps.limit || this.pagerProps.total,
        });
    }

    /**
     * Getter for showAllButton state.
     * @returns {boolean} The current state of the showAllButton.
     */
    get showAll() {
        if (this.pagerProps.total  > 0) {
            this.state.showAllButton = this.pagerProps.total > 0 && this.pagerProps.limit < this.pagerProps.total ? true : false;
        }
        else{
            this.state.showAllButton = false
        }
        return this.state.showAllButton;
    }

    /**
     * Getter for showLessButton state.
     * @returns {boolean} The current state of the showLessButton.
     */
    get showLess() {
        if (this.pagerProps.total>0 && this.showAllButton===true) {
            this.state.showLessButton = false
        }
        return this.state.showLessButton;
    }

    /**
     * Method to show all records.
     * Loads all records by setting the limit to the total number of records.
     */
    async showAllRecords() {
        const list = this.list;
        await list.load({ limit: this.pagerProps.total });
        // Hide the "Show All" button after clicking and
        // Show the "Show Less" button after clicking
        this.state.showAllButton = false;
        this.state.showLessButton = true;
    }

    /**
     * Method to show a limited number of records.
     * Loads records based on the initial pager limit.
     */
    async showLimitedRecords() {
        const list = this.list;
        await list.load({ limit: this.state.pagerLimit });
        // Show the "Show All" button after clicking and
        // Hide the "Show Less" button after clicking
        this.state.showAllButton = true;
        this.state.showLessButton = false;
    }
}

// Register the custom field
export const O2manyShowAll = {
    ...x2ManyField,
    component: O2mShowAll,
};
O2mShowAll.template = "O2mShowAll";

registry.category("fields").add("one2many_show_all", O2manyShowAll);
