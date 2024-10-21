class PDP1Audio {
    enable() {
        // Must be called from an event handler
        document.querySelector("#enableaudio").disabled = true;

        this._audioContext = new AudioContext({sampleRate:40000});
        this._enabled = true;
        this._records = [];
        this._startTime = window.elapsedTime;
        
        let scriptProcessorNode = this._audioContext.createScriptProcessor(0, 0, 2);
        scriptProcessorNode.onaudioprocess = this.buffer.bind(this);
        scriptProcessorNode.connect(this._audioContext.destination);

        this.CYCLES_PER_SAMPLE = Math.round((1/0.000005) / this._audioContext.sampleRate);

        clearInterval(timer); // Abduct main loop

        
    }

    buffer(audioProcessingEvent) {

        let audioBuffer = audioProcessingEvent.outputBuffer;

        for(let i = 0; i < audioBuffer.length; i++) {
            let [sum_l, sum_r] = this.sample();
            audioBuffer.getChannelData(0)[i] = sum_l;
            audioBuffer.getChannelData(1)[i] = sum_r;
        }
        
    }

    sample() {
        let sum_l = 0;
        let sum_r = 0;
        for(let i = 0; i < this.CYCLES_PER_SAMPLE; i++) {
            let [f1, f2, f3, f4] = this.cycle();
            sum_l += f1 ? 0.5 / this.CYCLES_PER_SAMPLE : 0.0;
            sum_l += f2 ? 0.5 / this.CYCLES_PER_SAMPLE : 0.0;
            sum_r += f3 ? 0.5 / this.CYCLES_PER_SAMPLE : 0.0;
            sum_r += f4 ? 0.5 / this.CYCLES_PER_SAMPLE : 0.0;
        }
        return [sum_l, sum_r];
    }

    cycle() {
        if(!this._enabled) {
            return;
        }
        if(!stepgen) {
            stepgen = step();
        }
        //pdp1console.display();
        stepgen.next();
        return [flag(1), flag(2), flag(3), flag(4)];
    }
}