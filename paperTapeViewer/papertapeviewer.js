// Dummy data
// https://bitsavers.org/bits/MIT/rle_pdp1x/RVH/BALL-RVH_721027.ptp
// Should look like
// https://bitsavers.org/bits/MIT/rle_pdp1x/RVH/BALL.jpg

const BALL = `00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 5F 55 55 55 4A 40 5E 45 45 45 5E 40 5F 50 50 50 50 40 5F 50 50 50 50 40 40 40 40 40 40 40 44 44 44 44 44 40 40 40 40 40 40 40 5F 45 45 4D 52 40 47 48 50 48 47 40 5F 44 44 44 5F 40 40 40 40 40 40 40 40 41 59 45 43 40 52 59 55 55 52 40 40 52 5F 50 40 40 4E 51 51 51 4E 40 52 59 55 55 52 40 40 41 59 45 43 40 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 32 31 23 23 80 2C 80 29 15 38 80 07 02 01 10 02 07 BF 91 A7 23 26 13 80 26 B6 80 32 26 94 25 B3 B9 25 37 80 32 31 23 23 80 B9 25 80 29 26 26 A4 BF 13 16 26 92 BF BF 01 10 02 91 BF 31 23 A7 38 31 9B 9E B5 02 A4 BF 9E A1 34 A7 80 25 B5 16 9E 91 37 B5 13 80 92 13 31 29 13 B9 25 37 80 A7 26 B9 25 13 BF 32 B5 13 31 9B 9E A1 34 A7 80 34 B9 92 A7 23 98 9E 91 34 B9 92 A7 23 31 98 80 13 38 B5 80 32 31 23 23 80 31 25 34 80 29 26 26 A4 BF 9E A1 34 A7 80 A4 26 15 B5 9E 91 A4 26 15 B5 80 32 31 23 23 80 92 13 29 31 B9 37 38 13 80 B6 26 29 80 34 13 BF 9E A1 34 A7 80 37 29 31 15 9E 91 B9 25 34 94 B3 B5 80 37 29 31 15 B9 13 31 13 B9 26 25 9B 80 92 A2 B9 A7 80 B9 B6 80 32 31 23 23 80 A4 26 15 B9 25 37 80 92 13 B9 23 23 BF 9E A1 A4 A7 80 31 23 A7 38 31 BC 2C BA 01 9E 91 92 13 31 29 13 80 26 15 B5 29 80 31 37 31 B9 25 BF 9E A1 A4 A7 80 32 B5 13 31 9E 91 A2 B5 B5 A7 80 37 26 B9 25 37 BF BF 91 B3 26 25 92 13 31 25 13 92 80 16 38 B9 B3 38 80 37 26 15 B5 29 25 80 13 38 B5 80 A7 29 26 A7 B5 29 13 B9 B5 92 BF 91 26 B6 80 13 38 B5 80 92 B9 A4 94 23 31 13 B9 26 25 BF BF 23 26 92 92 9B 9E BC 29 92 31 BA 80 83 9E 91 B9 25 B5 23 31 92 13 B9 B3 B9 13 98 80 26 B6 80 32 26 94 25 B3 B5 BF 34 13 9B 9E BC 29 92 31 BA 80 86 9E 91 13 B9 A4 B5 80 B9 25 B3 29 B5 A4 B5 25 13 BF 37 9B 9E 01 10 10 10 9E 91 B6 26 29 B3 B5 80 26 B6 80 37 29 31 15 B9 13 98 BF 16 31 B9 13 9B 9E 01 10 10 9E 91 25 94 A4 32 B5 29 80 26 B6 80 13 B9 A4 B5 92 80 13 26 80 34 B9 92 A7 23 31 98 80 32 31 23 23 BF 32 26 97 9B 9E 01 07 10 10 10 10 9E 91 38 31 23 B6 2C 16 B9 34 13 38 80 92 B9 19 B5 80 26 B6 80 29 26 26 A4 BF 97 A7 26 92 9B 9E 10 9E 91 97 2C A7 26 92 B9 13 B9 26 25 BF 98 A7 26 92 9B 9E 10 9E 91 98 2C A7 26 92 B9 13 B9 26 25 BF 97 15 B5 23 9B 9E 10 9E 91 97 2C 15 B5 23 26 B3 B9 13 98 BF 98 15 B5 23 9B 9E 10 9E 91 98 2C 15 B5 23 26 B3 B9 13 98 BF A7 A4 B9 25 9B 9E 02 10 10 10 9E 91 23 26 16 B5 92 13 80 A7 26 92 B9 13 B9 26 25 BF 15 A4 B9 25 9B 9E 02 10 10 10 9E 91 23 26 16 B5 92 13 80 15 B5 23 26 B3 B9 13 98 BF BF 25 B5 16 9B 9E 10 9E 91 92 94 32 29 26 94 13 B9 25 B5 80 13 26 80 B6 B9 25 34 80 B9 25 B9 13 B9 31 23 80 B3 26 25 34 B9 13 B9 26 25 92 BF 9E 23 31 13 9E 91 23 26 31 34 80 13 B5 92 13 80 16 26 29 34 BF 9E 34 31 B3 80 97 15 B5 23 9E 91 38 B9 37 38 80 26 29 34 B5 29 80 32 B9 13 92 80 13 26 80 97 15 B5 23 BF 9E BC 23 29 31 BA 80 89 3B BF 9E 34 31 B3 80 98 15 B5 23 9E 91 23 26 16 80 26 29 34 B5 29 80 32 B9 13 92 80 13 26 80 98 15 B5 23 BF 9E 23 31 B3 80 32 26 97 BF 9E B3 92 31 BF 9E 34 31 B3 80 97 A7 26 92 9E 91 92 13 31 29 13 B9 25 37 80 A7 26 92 B9 13 B9 26 25 80 B9 92 80 23 26 16 B5 29 BF 9E 34 31 B3 80 98 A7 26 92 9E 91 23 B5 B6 13 80 B3 26 29 25 B5 29 80 26 B6 80 92 B3 26 A7 B5 BF 9E A1 A4 A7 80 B9 80 25 B5 16 9E 91 29 B5 13 94 29 25 BF BF 34 B9 92 A7 23 18 1B 1E 10 9E 11 34 39 92 A7 23 31 98 80 29 26 26 A4 80 31 25 34 80 32 31 23 23 BF 9E 23 97 29 80 2F 02 10 10 10 BF 9E 23 31 B3 80 32 26 97 BF 9E BC 23 92 31 BA 80 01 BF 9E BC 25 31 31 B9 BA BF 34 B9 92 A7 01 9B 9E B9 26 13 80 02 10 07 9E 91 92 13 31 29 13 80 34 B9 92 A7 23 31 98 B9 25 37 80 29 26 26 A4 BF 9E B3 A4 31 BF 9E B9 26 13 80 02 10 07 BF 9E B3 A4 B9 BF 9E B9 26 13 80 02 10 07 BF 9E B3 A4 31 BF 9E B9 26 13 80 02 10 07 BF 9E B3 A4 B9 BF 9E 92 16 A7 BF 9E BC 25 97 97 08 BA BF 9E A1 A4 A7 80 34 B9 92 A7 01 BF 9E BC 97 2C 31 31 08 BA BF 9E A1 A4 A7 80 34 B9 92 A7 01 BF 9E 23 97 29 80 16 31 B9 13 9E 91 25 26 16 80 34 B9 92 A7 23 31 98 80 13 38 B5 80 32 31 23 23 BF 9E BC 25 97 97 BA BF 9E 23 31 B3 80 97 A7 26 92 BF 9E 23 B9 26 80 98 A7 26 92 BF 9E BC 23 92 31 85 23 92 B9 BA 80 01 9E 91 31 29 B9 13 38 A4 B5 13 B9 B3 80 34 26 25 B5 80 92 26 80 25 26 80 26 15 B5 29 B6 23 26 16 BF 9E B9 26 13 80 02 10 07 BF 9E BC 82 97 97 08 BA BF 9E A1 A4 A7 80 3B 2C 02 9E 91 A2 B5 B5 A7 80 34 B9 92 A7 23 31 98 B9 25 37 BF 9E A1 A4 A7 80 B9 80 34 B9 92 A7 23 98 BF BF A4 26 15 B5 9B 9E 10 9E 91 A4 26 15 B5 92 80 32 31 23 23 80 92 13 29 31 B9 37 38 13 80 31 25 34 80 32 26 94 25 B3 B5 92 80 26 B6 B6 80 29 26 26 A4 BF 9E 23 31 16 80 97 A7 26 92 BF 9E 34 31 B3 80 A7 A7 26 92 9E 91 94 92 B5 80 A7 26 B9 25 13 B5 29 92 80 13 26 80 B9 25 B6 26 BF 9E 23 31 16 80 97 15 B5 23 BF 9E 34 31 B3 80 A7 15 B5 23 BF A4 26 15 B5 02 9B 9E 23 31 B3 80 B9 80 A7 15 B5 23 9E 91 23 26 31 34 80 13 38 B5 80 15 B5 23 26 B3 B9 13 98 BF 9E 97 B3 13 80 34 13 9E 91 13 B9 A4 B5 92 80 34 13 BF 9E 31 34 A4 80 B9 80 A7 A7 26 92 9E 91 31 34 34 80 13 26 80 A7 26 92 B9 13 B9 26 25 BF 9E 92 A7 31 BF 9E B3 92 31 BF 9E 92 94 32 80 32 26 97 BF 9E 92 A7 31 BF 9E A1 A4 A7 80 A4 26 15 B5 83 BF 9E 23 31 B3 80 B9 80 A7 15 B5 23 BF 9E BC 25 31 B9 BA BF 9E 97 B3 13 80 23 26 92 92 9E 91 BC 29 92 31 80 BA 04 BF 9E BC 31 2C B9 31 BA BF 9E 34 31 B3 80 B9 80 A7 15 B5 23 BF 9E 97 B3 13 80 34 13 BF 9E 31 34 A4 80 B9 80 A7 A7 26 92 BF A4 26 15 B5 83 9B 9E B9 34 97 80 A7 A7 26 92 BF 9E B9 34 97 80 A7 15 B5 23 BF 9E 92 31 92 80 2F 98 15 B5 23 BC 2C BA 01 BF 9E A1 A4 A7 80 A4 26 15 B5 02 BF 9E A1 A4 A7 80 B9 80 A4 26 15 B5 BF BF A7 A7 26 92 9B 9E 10 BF A7 15 B5 23 9B 9E 10 BF BF 37 29 31 15 9B 9E 10 9E 91 37 29 31 15 B9 13 31 13 B9 26 25 9B 80 13 B5 92 13 80 B9 B6 80 34 26 25 B5 BF 9E 23 31 B3 80 37 BF 9E B3 92 31 BF 9E 31 34 A4 80 98 15 B5 23 9E 91 31 34 34 80 B9 25 80 37 29 31 15 B9 13 98 BF 9E 92 A7 31 BF 9E B3 92 31 BF 9E 92 94 32 80 15 A4 B9 25 BF 9E 92 A4 31 9E 91 13 B5 92 13 80 B9 B6 80 23 B5 92 92 80 13 38 31 25 80 A4 B9 25 80 15 B5 23 26 B3 B9 13 98 BF 9E A1 A4 A7 80 37 29 31 15 01 BF 9E 23 31 B3 80 98 A7 26 92 BF 9E 31 34 34 80 32 26 97 BF 9E 92 94 32 80 A7 A4 B9 25 BF 9E 92 A4 31 9E 91 13 B5 92 13 80 B9 B6 80 23 B5 92 92 80 13 38 31 25 80 A4 B9 25 80 A7 26 92 B9 13 B9 26 25 BF 37 29 31 15 01 9B 9E B9 34 97 80 37 29 31 15 9E 91 92 A2 B9 A7 80 B9 B6 80 31 23 29 B9 37 38 13 BF 9E A1 A4 A7 80 B9 80 37 29 31 15 9E 91 29 B5 13 94 29 25 BF BF B3 26 25 92 13 31 25 13 92 BF 92 13 31 29 13 80 31 23 A7 38 31 BF 04 BF 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 0B 7E 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00`.split(" ").map(byte => parseInt(byte, 16));

function pxFromInch(inch) {
    return inch * 96;
}

const TAPE_HEIGHT = 1.0;
const HOLE_SPACING = 0.1; // Both horizontal and vertical
const DATA_HOLE_DIAMETER = 0.072;
const SPROKET_HOLE_DIAMETER = 0.046;

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

function circle(ctx, radius, x, y) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function createTapeImage(data) {
    let canvas = new OffscreenCanvas(pxFromInch(HOLE_SPACING * data.length + 2), pxFromInch(TAPE_HEIGHT)); // Have some space at beginning and end
    let ctx = canvas.getContext("2d");
    let column_num = 1; // Start from 1st column, empty space on left
    for(let byte of data) {
        for(let hole = 0; hole < 9; hole++) {
            let bit = bitFromHoleNum(hole);
            let x = pxFromInch(column_num * HOLE_SPACING);
            let y = pxFromInch((hole + 1) * HOLE_SPACING);
            if(bit === "sprocket") {
                circle(ctx, pxFromInch(SPROKET_HOLE_DIAMETER / 2.0), x, y);
            } else {
                let bitvalue = byte & (1<<bit);
                if(bitvalue) {
                    circle(ctx, pxFromInch(DATA_HOLE_DIAMETER / 2.0), x, y);
                }
            }
        }
        column_num++;
    }
    return canvas.convertToBlob();
}


const SVGNS = "http://www.w3.org/2000/svg";

function circleSVG(svg, radius, x, y) {
    // radius, x, y assumed to be inches as a number
    let circle = svg.ownerDocument.createElementNS(SVGNS, "circle");
    circle.setAttributeNS(null, "cx", `${x}in`);
    circle.setAttributeNS(null, "cy", `${y}in`);
    circle.setAttributeNS(null, "r", `${radius}in`);
    circle.setAttributeNS(null, "fill", "black");
    svg.appendChild(circle);
}

function createTapeSVG(data) {
    let svgDocument = document.implementation.createDocument(SVGNS, "svg");
    let svg = svgDocument.documentElement;
    svg.setAttributeNS(null, "width", `${HOLE_SPACING * data.length + 2}in`);
    svg.setAttributeNS(null, "height", `${TAPE_HEIGHT}in`);
    let background = document.createElementNS(SVGNS, "rect");
    background.setAttributeNS(null, "fill", "lightyellow");
    background.setAttributeNS(null, "x", "0");
    background.setAttributeNS(null, "y", "0");
    background.setAttributeNS(null, "width", "100%");
    background.setAttributeNS(null, "height", "100%");
    svg.append(background);
    let column_num = 1;
    for(let byte of data) {
        for(let hole = 0; hole < 9; hole++) {
            let bit = bitFromHoleNum(hole);
            let x = column_num * HOLE_SPACING;
            let y = (hole + 1) * HOLE_SPACING;
            if(bit === "sprocket") {
                circleSVG(svg, SPROKET_HOLE_DIAMETER / 2.0, x, y);
            } else {
                let bitvalue = byte & (1<<bit);
                if(bitvalue) {
                    circleSVG(svg, DATA_HOLE_DIAMETER / 2.0, x, y);
                }
            }
        }
        column_num++;
    }
    return new Blob([(new XMLSerializer).serializeToString(svgDocument)], {type: "image/svg+xml"});
}

export { BALL, createTapeImage, createTapeSVG }