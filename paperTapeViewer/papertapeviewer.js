// Dummy data
// https://bitsavers.org/bits/MIT/rle_pdp1x/RVH/BALL-RVH_721027.ptp
// Should look like
// https://bitsavers.org/bits/MIT/rle_pdp1x/RVH/BALL.jpg


// https://www.govinfo.gov/content/pkg/GOVPUB-C13-ca9eb746e25a5f1218b695f4e8e6e367/pdf/GOVPUB-C13-ca9eb746e25a5f1218b695f4e8e6e367.pdf

const TAPE_HEIGHT = 1.0;
const HOLE_SPACING = 0.1; // Both horizontal and vertical
const DATA_HOLE_DIAMETER = 0.072;
const SPROKET_HOLE_DIAMETER = 0.046;
const EDGE_TO_SPROCKET = 0.392;
const SPROCKET_HOLE = 3;

function bitFromHoleNum(hole) {
    // Returns which bit to use from the byte for a given hole
    // Returns the string "sproket" if it's a sproket hole
    // Holes numbered from top to bottom, 0 - 8 inclusive
    if(0 <= hole && hole <= 2) {
        return hole
    } else if(hole === 3) {
        return "sprocket";
    } else if(hole <= 8) {
        return hole - 1;
    } else {
        console.error("Weird hole number!");
    }
}


const SVGNS = "http://www.w3.org/2000/svg";

function circleSVG(symbol, radius, x, y) {
    // radius, x, y assumed to be inches as a number
    let circle = symbol.ownerDocument.createElementNS(SVGNS, "circle");
    circle.setAttributeNS(null, "cx", `${x}in`);
    circle.setAttributeNS(null, "cy", `${y}in`);
    circle.setAttributeNS(null, "r", `${radius}in`);
    circle.setAttributeNS(null, "fill", "black");
    symbol.appendChild(circle);
}

let BYTE_SYMBOL_EXISTS = []; // Undefined if byte doesn't have a symbol yet, true if it does

function getUseForByte(defs, byte) {
    let id = byte.toString(16).padStart(2, "0");

    if(!BYTE_SYMBOL_EXISTS[byte]) {
        let symbol = document.createElementNS(SVGNS, "symbol");
        symbol.setAttributeNS(null, "id", id);
        for(let hole = 0; hole < 9; hole++) {
            let bit = bitFromHoleNum(hole);
            let x = 0.1;
            let y = EDGE_TO_SPROCKET + (hole - SPROCKET_HOLE) * HOLE_SPACING;
            if(bit === "sprocket") {
                circleSVG(symbol, SPROKET_HOLE_DIAMETER / 2.0, x, y);
            } else {
                let bitvalue = byte & (1<<bit);
                if(bitvalue) {
                    circleSVG(symbol, DATA_HOLE_DIAMETER / 2.0, x, y);
                }
            }
        }
        defs.append(symbol);
        BYTE_SYMBOL_EXISTS[byte] = true;
    }

    let use = document.createElementNS(SVGNS, "use");
    use.setAttributeNS(null, "href", `#${id}`);

    return use;

}

function createTapeSVG(data) {
    let svgDocument = document.implementation.createDocument(SVGNS, "svg");
    let svg = svgDocument.documentElement;
    svg.setAttributeNS(null, "width", `${HOLE_SPACING * data.length + 2}in`);
    svg.setAttributeNS(null, "height", `${TAPE_HEIGHT}in`);
    let defs = document.createElementNS(SVGNS, "defs");
    svg.append(defs);
    let background = document.createElementNS(SVGNS, "rect");
    background.setAttributeNS(null, "fill", "lightyellow");
    background.setAttributeNS(null, "x", "0");
    background.setAttributeNS(null, "y", "0");
    background.setAttributeNS(null, "width", "100%");
    background.setAttributeNS(null, "height", "100%");
    svg.append(background);
    let column_num = 0;
    for(let byte of data) {
        let use = getUseForByte(defs, byte);
        use.setAttributeNS(null, "x", `${column_num * HOLE_SPACING}in`);
        svg.append(use);
        column_num++;
    }
    return new Blob([(new XMLSerializer).serializeToString(svgDocument)], {type: "image/svg+xml"});
}

export { createTapeImage, createTapeSVG }