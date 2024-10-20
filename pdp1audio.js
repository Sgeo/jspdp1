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
            let sum_l = 0;
            let sum_r = 0;
            for(let r of this._records) {
                sum_l += r[0] ? 0.5 / this.CYCLES_PER_SAMPLE : 0.0;
                sum_l += r[1] ? 0.5 / this.CYCLES_PER_SAMPLE : 0.0;
                sum_r += r[2] ? 0.5 / this.CYCLES_PER_SAMPLE : 0.0;
                sum_r += r[3] ? 0.5 / this.CYCLES_PER_SAMPLE : 0.0;
            }
            this._audioBuffer.getChannelData(0)[this._sampleIndex] = sum_l;
            this._audioBuffer.getChannelData(1)[this._sampleIndex] = sum_r;
            this._records = [];
            this._sampleIndex++;
            if(this._sampleIndex === this._audioBuffer.length) {
                this._sampleIndex = 0;
            }
        }
    }
}