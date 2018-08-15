const scribble = require('scribbletune');
const binance = require('node-binance-api')().options({
    APIKEY: '<your-key>',
    APISECRET: '<your-secret>',
    useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
    test: true // If you want to use sandbox mode where orders are simulated
});

let closes = [];
binance.candlesticks("BNBBTC", "5m", (error, ticks, symbol) => {

    const closes = ticks.map(tick => {
        let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = tick;
        return parseInt(close * 10000000);
    })
    
    const notesStr = mapPricesToNotes(closes, Math.min(...closes), Math.max(...closes));

    scribble.midi(scribble.clip({
        notes: notesStr,
        pattern: '[x]'.repeat(closes.length)
    }), 'crypto.midi')
}, {limit: 500, endTime: 1514764800000});

function mapPricesToNotes(closes, min, max) {

    // check if note is between the step
    function compareStep(close, min, step, stepNr) {
        return close > min + step*stepNr && close < min+step*(stepNr+1)
    }

    // 12 notes per octave x 4 octaves
    const step = parseInt((max-min) / 48);

    const notes = [];
    for(let close of closes) {
        for(let octave = 1; octave <= 4; octave++) {
            const octaveStep = (octave-1)*12;
            if (compareStep(close, min, step, 0+octaveStep)) {
                notes.push(`Cm-${octave}`);
            }
            else if (compareStep(close, min, step, 1+octaveStep)) {
                notes.push(`C#m-${octave}`);
            }
            else if (compareStep(close, min, step, 2+octaveStep)) {
                notes.push(`Dm-${octave}`);
            }
            else if (compareStep(close, min, step, 3+octaveStep)) {
                notes.push(`D#m-${octave}`);
            }
            else if (compareStep(close, min, step, 4+octaveStep)) {
                notes.push(`Em-${octave}`);
            }
            else if (compareStep(close, min, step, 5+octaveStep)) {
                notes.push(`Fm-${octave}`);
            }
            else if (compareStep(close, min, step, 6+octaveStep)) {
                notes.push(`F#m-${octave}`);
            }
            else if (compareStep(close, min, step, 7+octaveStep)) {
                notes.push(`Gm-${octave}`);
            }        
            else if (compareStep(close, min, step, 8+octaveStep)) {
                notes.push(`G#m-${octave}`);
            }
            else if (compareStep(close, min, step, 9+octaveStep)) {
                notes.push(`Am-${octave}`);
            }
            else if (compareStep(close, min, step, 10+octaveStep)) {
                notes.push(`A#m-${octave}`);
            }
            else if (compareStep(close, min, step, 11+octaveStep)) {
                notes.push(`Bm-${octave}`);
            }
        }
    }
    return notes.join(" ");
}

