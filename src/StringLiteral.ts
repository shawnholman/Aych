import {Renderable, SimpleObject} from "./interfaces";

const TEMPLATE_START_TAG = '{{';
const TEMPLATE_END_TAG = '}}';
const TEMPLATE_TAG = new RegExp(TEMPLATE_START_TAG + '([A-z]+)' + TEMPLATE_END_TAG);

export class StringLiteral implements Renderable {
    private string: string = '';
    private templates: string[] = [];

    constructor(str: string) {
        this.setString(str);
    }

    render(templates?: SimpleObject): string {
        if (!templates) {
            return this.string;
        }
        return StringLiteral.template(this.string, templates);
    }

    /**
     * Returns true if this string caries templates.
     */
    hasTemplate() {
        return this.templates.length > 0;
    }

    /**
     * Resolves templates inside of a string.
     * @param string the string to template
     * @param templates the date to use for the tempalte
     */
    private static template(string: string, templates: SimpleObject) {
        let templateEntries = Object.entries(templates);
        for (const [name, value] of templateEntries) {
            string = string.replace(TEMPLATE_START_TAG + name + TEMPLATE_END_TAG, value.toString());
        }
        return string;
    }

    /**
     * Sets the string property and finds the templates inside.
     * @param string
     */
    private setString(string: string) {
        this.string = StringLiteral.escapeHtml(string);
        this.setAvailableTemplates(string);
    }

    /**
     * Takes a string and finds its templates
     * @param templateString
     */
    private setAvailableTemplates(templateString: string): void {
        const foundTemplates = templateString.match(TEMPLATE_TAG);

        if (foundTemplates !== null) {
            this.templates = foundTemplates.map((item) => item.substring(2, item.length - 2));
        }
    }

    /**
     * Escape HTML inside of a string
     * @param unsafe the string to escape
     */
    private static escapeHtml(unsafe:string): string {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}
