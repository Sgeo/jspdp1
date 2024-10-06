function rim(bytes) {

    function word(byte0, byte1, byte2) {
        return ((byte0 & 0b00111111) << 12) | (byte1 & 0b00111111) << 6 | (byte2 & 0b00111111);
    }


    bytes = bytes.filter(byte => byte & 0x80);
    let index = 0;
    while(true) {
        console.log("About to retrieve a RIM instruction");
        let inst = word(bytes[index], bytes[index+1], bytes[index+2]);
        let instcode = inst >> 13;
        let y = inst & 0o7777;
        if(instcode === 0o15 || instcode === 0o12) { // DIO or DAC. Supposed to only be DIO, but other emulators accept DAC, claiming that there are tapes that (wrongly) use it
            let value = word(bytes[index+3], bytes[index+4], bytes[index+5]);
            memory[y] = value;
            index += 6;
            console.log("Inserting");
        } else if(instcode === 0o30) { // JMP
            pc = y;
            console.log("Jumping");
            break;
        } else {
            console.error("Unrecognized instruction in RIM", inst, "at index ", index);
            break;
        }
    }

}