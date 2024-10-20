class PDP1Audio {
    enable() {
        // Must be called from an event handler
        this._audioContext = new AudioContext({sampleRate:40000});
        this._enabled = true;
        this._records = [];
        this._startTime = window.elapsedTime;
        this._sampleIndex = 0;
        
        this._audioBuffer = this._audioContext.createBuffer(2, this._audioContext.sampleRate, this._audioContext.sampleRate);
        this._audioBufferSource = this._audioContext.createBufferSource();
        this._audioBufferSource.loop = true;
        this._audioBufferSource.buffer = this._audioBuffer;
        this._audioBufferSource.connect(this._audioContext.destination);
        this._audioBufferSource.start();

        this.CYCLES_PER_SAMPLE = Math.round((1/0.000005) / this._audioContext.sampleRate);
    }

    cycle() {
        if(!this._enabled) {
            return;
        }
        this._records.push([flag(1), flag(2), flag(3), flag(4)]);
        if(this._records.length == this.CYCLES_PER_SAMPLE) {
            let sum = 0;
            for(let r of this._records) {
                sum += r[0] ? 1.0 / this.CYCLES_PER_SAMPLE : 0.0;
            }
            for(let channel = 0; channel < 2; channel++) {
                this._audioBuffer.getChannelData(channel)[this._sampleIndex] = sum;
            }
            this._records = [];
            this._sampleIndex++;
            if(this._sampleIndex === this._audioBuffer.length) {
                this._sampleIndex = 0;
            }
        }
    }
}