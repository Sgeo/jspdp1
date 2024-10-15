class PDP1Console {
    constructor() {
        this._elems = {
            pc: document.querySelector("#pcelem"),
            bank: document.querySelector("#bankelem"),
            ma: document.querySelector("#maelem"),
            ac: document.querySelector("#acelem"),
            io: document.querySelector("#ioelem"),
            run: document.querySelector("#runelem")
        };
    }

    display() {
        this._elems.pc.innerText = oct(pc);
        this._elems.bank.innerText = oct(bank);
        this._elems.ma.innerText = oct(ma);
        this._elems.ac.innerText = oct(ac);
        this._elems.io.innerText = oct(io);
        this._elems.run.checked = running;
    }
}