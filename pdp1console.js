let BIT_DISPLAYS = ["bank", "pc", "ma", "ac", "io", "running", "ov", "extend"];
let FORWARD_ELEMS = ["pf", "sense"];

class PDP1Console {

    constructor() {
        this._elems = {};
        this._inputs = {};
        for(let elem of document.querySelectorAll("input[data-console]")) {
            let list = this._elems[elem.dataset.console];
            if(!list) {
                list = [];
                this._elems[elem.dataset.console] = list;
            }
            if(!FORWARD_ELEMS.includes(elem.dataset.console)) {
                list.unshift(elem); // Reverse order. 0th element will be LSB
            } else {
                list.push(elem);
            }
        }
        for(let elem of document.querySelectorAll("[data-console-test-input]")) {
            let checkboxes = elem.querySelectorAll("input[type=checkbox]");
            let maxbit = checkboxes.length - 1;
            for(let i = 0; i < checkboxes.length; i++) {
                let checkbox = checkboxes[i];
                let bit = maxbit - i;
                checkbox.addEventListener("change", function(e) {
                    if(this.checked) {
                        window[elem.dataset.consoleTestInput] |= (1<<bit);
                    } else {
                        window[elem.dataset.consoleTestInput] &= ~(1<<bit);
                    }
                });
            }
        }
        for(let elem of document.querySelectorAll("[data-console-input]")) {
            let checkboxes = elem.querySelectorAll("input[type=checkbox");
            for(let i = 0; i < checkboxes.length; i++) {
                checkboxes[i].addEventListener("change", function() {
                    window.sense(i+1, this.checked);
                });
            }
        }
    }

    displayBits(elems, value) {
        for(let i = 0; i < elems.length; i++) {
            elems[i].checked = (value>>i)&1 === 1;
        }
    }

    displayPF() {
        for(let i = 0; i < 6; i++) {
            this._elems.pf[i].checked = flag(i+1);
        }
    }

    display() {
        for(let valToDisplay of BIT_DISPLAYS) {
            this.displayBits(this._elems[valToDisplay], window[valToDisplay]);
        }
        this.displayPF();
    }

    start() {
        window.ov = 0;
        window.extend = 0; // TODO: Option to start with extend
        window.bank = window.testAddress >> 12;
        window.pc = window.testAddress & 0o7777;
        window.running = 1;
    }

    stop() {
        window.running = 0;
    }

    continue() {
        window.running = 1;
    }

    examine() {
        window.ac = window.memory[window.testAddress];
    }

    deposit() {
        window.memory[window.testAddress] = window.testWord;
    }
}