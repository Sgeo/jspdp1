class PaperTapeReader {
    word([byte0, byte1, byte2]) {
        return ((byte0 & 0b00111111) << 12) | (byte1 & 0b00111111) << 6 | (byte2 & 0b00111111);
    }

    load(bytes) {
        this._index = 0;
        this._bytes = bytes;
    }

    rpbi() {
        let bytes = [];
        for(let i = 0; i < 3; i++) {
            while(!(this._bytes[this._index] & 0x80)) {
                this._index++;
                if(this._index >= this._bytes.length) {
                    running = false;
                    throw "rpb ran out of tape!";
                }
            }
            bytes[i] = this._bytes[this._index];
            this._index++;
        }
        return this.word(bytes);
    }

    rim() { // Not sure the cleanest way to express mutation of main PDP-1
        while(true) {
            console.log("About to retrieve a RIM instruction");
            let inst = this.rpbi();
            let instcode = inst >> 13;
            let y = inst & 0o7777;
            if(instcode === 0o15 || instcode === 0o12) { // DIO or DAC. Supposed to only be DIO, but other emulators accept DAC, claiming that there are tapes that (wrongly) use it
                let value = this.rpbi();
                memory[(bank<<12)|y] = value;
                console.log(`Inserting ${oct(y)} = ${oct(value)}`);
            } else if(instcode === 0o30) { // JMP
                pc = y;
                console.log(`Jumping to ${oct(pc)}`);
                window.running = 1;
                break;
            } else {
                console.error("Unrecognized instruction in RIM 0o", inst.toString(8), "at index ", this._index);
                break;
            }
        }
    }
}

window.ptr = new PaperTapeReader;