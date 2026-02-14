"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VmixService = void 0;
const jsdom_1 = require("jsdom");
class VmixService {
    async fetchInputs(host, port) {
        const url = `http://${host}:${port}/api/`;
        const response = await fetch(url);
        const xml = await response.text();
        return this.parseInputsFromXml(xml);
    }
    async fetchState(host, port, inputKey) {
        const url = `http://${host}:${port}/api/`;
        const response = await fetch(url);
        const xml = await response.text();
        const dom = new jsdom_1.JSDOM(xml, { contentType: 'text/xml' });
        const doc = dom.window.document;
        const active = parseInt(doc.querySelector('active')?.textContent || '0', 10);
        const preview = parseInt(doc.querySelector('preview')?.textContent || '0', 10);
        let inputName = '';
        let inputStatus = 'unknown';
        if (inputKey) {
            const input = doc.querySelector(`input[key="${inputKey}"]`);
            if (input) {
                inputName = input.getAttribute('title') || '';
                const inputNumber = parseInt(input.getAttribute('number') || '0', 10);
                if (inputNumber === active) {
                    inputStatus = 'active';
                }
                else if (inputNumber === preview) {
                    inputStatus = 'preview';
                }
                else {
                    inputStatus = 'inactive';
                }
            }
        }
        return { active, preview, inputName, inputStatus };
    }
    async setText(host, port, inputKey, fieldName, value) {
        const params = new URLSearchParams({
            Function: 'SetText',
            Input: inputKey,
            SelectedName: fieldName,
            Value: value,
        });
        const url = `http://${host}:${port}/api/?${params.toString()}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`vMix API error: ${response.status} ${response.statusText}`);
        }
    }
    parseInputsFromXml(xml) {
        const dom = new jsdom_1.JSDOM(xml, { contentType: 'text/xml' });
        const doc = dom.window.document;
        const inputElements = doc.querySelectorAll('input');
        const inputs = [];
        inputElements.forEach((el) => {
            const textElements = el.querySelectorAll('text');
            const textFields = [];
            textElements.forEach((textEl) => {
                const name = textEl.getAttribute('name');
                if (name)
                    textFields.push(name);
            });
            inputs.push({
                key: el.getAttribute('key') || '',
                number: parseInt(el.getAttribute('number') || '0', 10),
                name: el.getAttribute('title') || '',
                type: el.getAttribute('type') || '',
                textFields,
            });
        });
        return inputs;
    }
}
exports.VmixService = VmixService;
