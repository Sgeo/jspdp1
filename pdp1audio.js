class PDP1Audio {
    enable() {
        // Must be called from an event handler
        document.querySelector("#enableaudio").disabled = true;

        this._audioContext = new AudioContext({sampleRate:40000});
        this._enabled = true;
        this._records = [];
        this._startTime = window.elapsedTime;
        
        this._audioBuffer = this._audioContext.createBuffer(2, 0.1 * this._audioContext.sampleRate, this._audioContext.sampleRate);
        this._audioBufferSource = this._audioContext.createBufferSource();
        this._audioBufferSource.loop = true;
        this._audioBufferSource.buffer = this._audioBuffer;
        this._audioBufferSource.connect(this._audioContext.destination);
        this._audioBufferSource.start();

        this.CYCLES_PER_SAMPLE = Math.round((1/0.000005) / this._audioContext.sampleRate);

        clearInterval(timer); // Abduct main loop

        let audioBufferSource = this.buffer(); // First CPU loop
        audioBufferSource.start();

        let audioBufferEnded = () => {
            audioBufferSource = this.buffer();
            audioBufferSource.onended = audioBufferEnded;
            audioBufferSource.start();
        }

        audioBufferSource.onended = audioBufferEnded;
        
    }

    buffer() {
        let startTime = performance.now();
        let audioBuffer = this._audioContext.createBuffer(2, this._audioContext.sampleRate, this._audioContext.sampleRate);
        let audioBufferSource = this._audioContext.createBufferSource();
        audioBufferSource.buffer = audioBuffer;
    
        audioBufferSource.connect(this._audioContext.destination);

        for(let i = 0; i < audioBuffer.length; i++) {
            let [sum_l, sum_r] = this.sample();
            audioBuffer.getChannelData(0)[i] = sum_l;
            audioBuffer.getChannelData(1)[i] = sum_r;
        }
        let endTime = performance.now();
        console.log("Timimg of buffer creation: ", endTime - startTime);
        return audioBufferSource;
        
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