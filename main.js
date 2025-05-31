function oct(num) {
	return `0o${num.toString(8)}`;
}

var ac=0, io=0, pc=4, y, ib, ov=0, bank=0, ma=0, mb=0;
// pc contains 12-bit address even in extended mode, 4 bit bank is in bank only.
// instructions retrieving from pc or modifying pc or exposing pc need to take this into account.
var _flag = [false, false, false, false, false, false];
var _sense = [false, false, false, false, false, false];
var _mouse = undefined; // undefined when mouse not held down. Array of [x, y] when mouse button held down
function flag(flagnum, value) {
	if(typeof value === 'undefined') {
		if(flagnum === 7) {
			// Flag 7 is effectively on if any flag is on
			return _flag.some(f => f);
		} else {
			return _flag[flagnum - 1];
		}
	} else {
		value = !!value;
		if(flagnum === 7) {
			_flag.fill(value);
		} else {
			_flag[flagnum - 1] = value;
		}
	}
}
function sense(sensenum, value) {
	if(typeof value === 'undefined') {
		if(sensenum === 7) {
			// Flag 7 is effectively on if any flag is on
			return _sense.some(f => f);
		} else {
			return _sense[sensenum - 1];
		}
	} else {
		value = !!value;
		if(sensenum === 7) {
			_sense.fill(value);
		} else {
			_sense[sensenum - 1] = value;
		}
	}
}
var extend = 0;
var control=0;
var elapsedTime = 0;
var running = 0;
var testWord = 0o000000;
var testAddress = 0;
var cpuhistory = false;
var pdp1console;

var timer, canvas, ctx;

var k17=0400000, k18=01000000, k19=02000000, k35=0400000000000;

var AND=001, IOR=002, XOR=003, XCT=004, CALJDA=007,
    LAC=010, LIO=011, DAC=012, DAP=013, DIO=015, DZM=016, DIP=014,
    ADD=020, SUB=021, IDX=022, ISP=023, SAD=024, SAS=025, MUS=026, DIS=027,
    JMP=030, JSP=031, SKP=032, SFT=033, LAW=034, IOT=035, OPR=037;

function eac(num) {
	// End-around carry,
	// In one's complement, if a carry is generated, that carry gets added to the number
	// Instead of being dropped
	let c = num>>18;
	return (num+c)&0o777777;
}

function fixMinusZero(num) {
	if(num===0o777777) {
		return 0;
	} else {
		return num;
	}
}

function sign(num) {
	// Returns the sign bit
	// 0 for positive number, 1 for negative number

	return (num&0o400000)>>17;
}

function setup(){
	pdp1console = new PDP1Console;
	pdp1audio = new PDP1Audio;
	pdp1term = new PDP1Term;
	canvas = document.getElementById('swcanvas');
	canvas.width = 512;
	canvas.height =512;
	ctx = canvas.getContext('2d');
	ctx.fillStyle = '#ffffff';
	ctx.clearRect(0,0,512,512);
	window.onkeydown = function(e){handleKeydown (e);}
	window.onkeyup = function(e){handleKeyup(e);}
	canvas.onpointerdown = handlePointerDown;
	canvas.onpointerup = handlePointerUp;
	pdp1term.createScreen("any", 24, 80);
	document.getElementById("termframe").append(pdp1term.getCanvas());
	timer = setInterval(frame, 56); 
	requestAnimationFrame(onAnimationFrame);
}

function handleKeydown(e){
	var c = e.keyCode;
	c = String.fromCharCode(c);
	if (c=='W') control |= 01;
	if (c=='S') control |= 02;
	if (c=='A') control |= 04;
	if (c=='D') control |= 010;
	if (c=='I')control |= 040000;
	if (c=='K') control |= 0100000;
	if (c=='J') control |= 0200000;
	if (c=='L') control |= 0400000;
}

function handleKeyup(e){
	var c = e.keyCode;
	c = String.fromCharCode(c);
	if (c=='W') control &= ~01;
	if (c=='S') control &= ~02;
	if (c=='A') control &= ~04;
	if (c=='D') control &= ~010;
	if (c=='I')control &= ~040000;
	if (c=='K') control &= ~0100000;
	if (c=='J') control &= ~0200000;
	if (c=='L') control &= ~0400000;
}

function handlePointerDown(e) {
	_mouse = [e.offsetX, e.offsetY];
}

function handlePointerUp(e) {
	_mouse = undefined;
}

function onAnimationFrame() {
	ctx.fillStyle = "rgb(0 0 0 / 5%)";
	ctx.fillRect(0, 0, 512, 512);
	ctx.fillStyle = '#ffffff';
	pdp1console.display();
	requestAnimationFrame(onAnimationFrame);
}

let stepgen;
function frame(){
	if(!stepgen) {
		stepgen = step();
	}
	for(let i = 0; i < (56000/5); i++) {
		stepgen.next();
	}
}

function* step(){
	while(true) {
		if(running) {
			ma = (bank<<12)|(pc&0o7777);
			pc++;
			pc = pc&0o7777;
			yield* emb();
			yield* dispatch(mb);
		} else {
			yield;
		}
	}
}

function* dispatch(md) {
	//pc = pc % 0o10000;
	if(cpuhistory) {
		console.log(`bank: ${oct(bank)}, pc: ${oct(pc)}, ma: ${oct(ma)}, instr: ${oct(md)}`);
	}
	y=md&07777; ib=(md>>12)&1;
	switch(md>>13) {
	case AND: yield* ea(); yield* emb(); ac&=mb; break;
	case IOR: yield* ea(); yield* emb(); ac|=mb; break;
	case XOR: yield* ea(); yield* emb(); ac^=mb; break;
	case XCT: yield* ea(); yield* emb(); yield* dispatch(mb); break;
	case CALJDA: 
		var target=(ib==0)?64:y;
		memory[(bank<<12)+target]=ac;
		ac=(ov<<17)+(extend<<16)+(bank<<12)+pc; // TODO: Don't know if the bank bits are hidden in non-extend mode
		pc=target+1;
		break;
	case LAC: yield* ea(); yield* emb(); ac=mb; break;
	case LIO: yield* ea(); yield* emb(); io=mb; break;
	case DAC: yield* ea(); yield* emb(); memory[ma]=ac; break;
	case DAP: yield* ea(); yield* emb(); memory[ma]=(mb&0770000)+(ac&07777); break;
	case DIP: yield* ea(); yield* emb(); memory[ma]=(ac&0o770000)|(mb&0o007777); break;
	case DIO: yield* ea(); yield* emb(); memory[ma]=io; break;
	case DZM: yield* ea(); yield* emb(); memory[ma]=0; break;
	case ADD:
		yield* ea(); yield* emb();
		let oldsign = sign(ac);
		ac=ac+mb;
		let memsign = sign(mb);
		ac=eac(ac);
		let newsign = sign(ac);
		ac=fixMinusZero(ac);
		if(memsign === oldsign && oldsign !== newsign) {
			ov = 1;
		}
		break;
	case SUB:
		yield* ea(); yield* emb();
		var diffsigns=((ac>>17)^(mb>>17))==1;
		ac=ac+(mb^0777777);
		ac=(ac+(ac>>18))&0777777;
		if (ac==0777777) ac=0; // TODO: Sus
		if (diffsigns&&(mb>>17==ac>>17)) ov=1;
		break;
	case IDX:
		yield* ea(); yield* emb();
		ac=mb+1;
		ac=eac(ac);
		ac=fixMinusZero(ac);
		memory[ma]=ac;
		break;
	case ISP:
		yield* ea(); yield* emb();
		ac=mb+1; 
		ac=eac(ac);
		ac=fixMinusZero(ac);
		memory[ma]=ac;
		if((ac&0400000)==0) pc++;
		break;
	case SAD: yield* ea(); yield* emb(); if(ac!=mb) pc++; break;
	case SAS: yield* ea(); yield* emb(); if(ac==mb) pc++; break;
	case MUS:
		yield* ea(); yield* emb();
		if ((io&1)==1){
			ac=ac+mb;
			ac=(ac+(ac>>18))&0777777;
			if (ac==0777777) ac=0;
		}
		io=(io>>1|ac<<17)&0777777;
		ac>>=1;
		break;
	case DIS:
		yield* ea(); yield* emb();
		var acl=ac>>17;
		ac=(ac<<1|io>>17)&0777777;
		io=((io<<1|acl)&0777777)^1;
		if ((io&1)==1){
			ac=ac+(mb^0777777);
			ac=(ac+(ac>>18))&0777777;}
		else {
			ac=ac+1+mb;
			ac=(ac+(ac>>18))&0777777;
		}
		if (ac==0o1000000) ac=0;
		break;
	case JMP: yield* ea(); pc=ma&0o7777; bank=ma>>12; break;
	case JSP: yield* ea(); ac=(ov<<17)+(extend<<16)+(bank<<12)+pc; pc=ma&0o7777; bank=ma>>12; break;
	case SKP:
		var cond =
			(((y&0100)==0100)&&(ac==0)) ||
			(((y&0200)==0200)&&(ac>>17==0)) ||
			(((y&0400)==0400)&&(ac>>17==1)) ||
			(((y&01000)==01000)&&(ov==0)) ||
			(((y&02000)==02000)&&(io>>17==0))||
			(((y&7)!=0)&&!flag(y&7))||
			(((y&070)!=0)&&!sense((y&070)>>3))
		if (ib==0) {if (cond) pc++;}
		else {if (!cond) pc++;}
		if ((y&01000)==01000) ov=0;
		break;
	case SFT:	
		var nshift=0, mask=md&0777;
		while (mask!=0) {nshift+=mask&1; mask=mask>>1;}
		switch((md>>9)&017){
		case 1: for(var i=0;i<nshift;i++) ac=(ac<<1|ac>>17)&0777777; break;
		case 2: for(var i=0;i<nshift;i++) io=(io<<1|io>>17)&0777777; break;
		case 3:	
			for(var i=0;i<nshift;i++){
				var both=ac*k19+io*2+Math.floor(ac/k17);
				ac = Math.floor(both/k18)%k18;
				io = both%k18;
			}
			break;
		case 5: 
			for(var i=0;i<nshift;i++) ac=((ac<<1|ac>>17)&0377777)+(ac&0400000);
			break;
		case 6: 
			for(var i=0;i<nshift;i++) io=((io<<1|io>>17)&0377777)+(io&0400000);
			break;
		case 7:	
			for(var i=0;i<nshift;i++) {
				var both = (ac&0177777)*k19+io*2+Math.floor(ac/k17);
				both += (ac&0400000)*k18;
				ac = Math.floor(both/k18)%k18;
				io = both%k18;
			}
			break;
		case 9: for(var i=0;i<nshift;i++) ac=(ac>>1|ac<<17)&0777777; break;
		case 10: for(var i=0;i<nshift;i++) io=(io>>1|io<<17)&0777777; break;
		case 11: 
			for(var i=0;i<nshift;i++){
				var both = ac*k17+Math.floor(io/2)+(io&1)*k35;
				ac = Math.floor(both/k18)%k18;
				io = both%k18;
			}
			break;
		case 13: for(var i=0;i<nshift;i++) ac=(ac>>1)+(ac&0400000); break;
		case 14: for(var i=0;i<nshift;i++) io=(io>>1)+(io&0400000); break;
		case 15: 
			for(var i=0;i<nshift;i++){
				var both = ac*k17+Math.floor(io/2)+(ac&0400000)*k18;
				ac = Math.floor(both/k18)%k18;
				io = both%k18;
			}
			break;
		default:	console.log('Undefined shift:',os(md),'at'+os(pc-1));
      //Runtime.getRuntime().exit(0);
      	}	
      break;
	case LAW: ac=(ib==0)?y:y^0777777; break;
	case IOT:
		if ((y&077)==0) {break;} // Special wait, not implemented properly.
		if ((y&077)==7) {dpy();break;};
		if ((ib && ((y&0o77)==2))) {io=ptr.rpbi(); break;}
		if ((y&077)==011) {io = control; break;}
		if ((y&0o7777)==0o4074) {extend = 1; break;} // eem
		if ((y&0o7777)==0o0074) {extend = 0; break;} // lem
		if((y&0o0003)==0o0003) {console.log(`Typewriter out: ${oct(io&0o77)}`); pdp1term.renderCode(io&0o77); break;}
		console.error("Unknown IOT", `0o${md.toString(8)}`);
		running = 0;
		break;
	case OPR:	
		if((y&0200)==0200) ac=0;
		if((y&04000)==04000) io=0;
		if((y&01000)==01000) ac^=0777777;
		if((y&02000)==02000) ac|=testWord;
		if((y&0400)==0400) {running=0; console.log("HALT");}
		var nflag=y&7; 
		if (nflag<1) break;
		var state=(y&010)==010;
		flag(nflag, state);
		break;
	default:	console.log('Undefined instruction:', os(md), 'at', os(pc-1), 'opcode', (md>>13).toString(8)); running = false;
    //Runtime.getRuntime().exit(0);
  }
}

function* ea() {
	ma = y;
	if(!extend) {
		while(true){
			ma = (bank<<12) + ma;
			if (ib==0) return;
			yield* emb();
			ib=(mb>>12)&1;
			ma=mb&07777;
		}
	} else {
		ma = (bank<<12) + ma;
		if (ib==0) return;
		yield* emb();
		ma=mb&0o177777;
	}
}

function* emb() {
	yield;
	mb=memory[ma];
}

function num_from_ones(width) {
	// num_from_ones(width)(ones) converts 1's complement with a width to JS number
	// Curried as a probably premature optimization
	let mask = (2**width) - 1;
	return function(ones) {
		let sign = ones >> (width - 1);
		if(sign) {
			return -(ones ^ mask);
		} else {
			return ones;
		}
	}
}

num_from_ones_dpy = num_from_ones(10);

const JITTER = 1;

function display_jitter(coord) {
	// https://bitsavers.org/pdf/mit/rle_pdp1/memos/pdp35-2_sep71.pdf states accuracy is 3% of raster size
	// Easier to just jitter by a small amount
	return coord + (Math.random() * JITTER * 2 - JITTER);
}

function dpy(){
	let x = ac>>8; // Top 10 bits out of 18
	let y = io>>8;
	x = num_from_ones_dpy(x);
	y = num_from_ones_dpy(y);
	x = x + 512;
	y = 512 - y;
	x = display_jitter(x);
	y = display_jitter(y);
	ctx.fillRect(x/2,y/2,1,1);
	if(typeof _mouse === "object") {
		let [mouse_x, mouse_y] = _mouse;
		let delta_x = Math.abs(mouse_x - x/2); // x is internal coords, convert to screen coords
		let delta_y = Math.abs(mouse_y - y/2);
		if((delta_x**2 + delta_y**2) < 9) {
			flag(3, true);
}
	}
}


function os(n){
	n += 01000000;
	return '0'+ n.toString(8).substring(1);
}
    
function regs(){
	console.log('pc:', os(pc), 'mpc:', os(memory[pc]), 'ac:', os(ac), 'io;', os(io), 'ov:', ov);
}