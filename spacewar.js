function oct(num) {
	return `0o${num.toString(8)}`;
}

var ac=0, io=0, pc=4, y, ib, ov=0, bank=0, ma=0, mb=0;
// pc contains 12-bit address even in extended mode, 4 bit bank is in bank only.
// instructions retrieving from pc or modifying pc or exposing pc need to take this into account.
var flag = [false, false, false, false, false, false, false];
var sense = [false, false, false, false, false, false];
var extend = 0;
var control=0;
var elapsedTime = 0;
var running = true;
var testWord = 0o000000;
var cpuhistory = false;
var pdp1console;

var timer, canvas, ctx;

var k17=0400000, k18=01000000, k19=02000000, k35=0400000000000;

var AND=001, IOR=002, XOR=003, XCT=004, CALJDA=007,
    LAC=010, LIO=011, DAC=012, DAP=013, DIO=015, DZM=016, DIP=014,
    ADD=020, SUB=021, IDX=022, ISP=023, SAD=024, SAS=025, MUS=026, DIS=027,
    JMP=030, JSP=031, SKP=032, SFT=033, LAW=034, IOT=035, OPR=037;

function setup(){
	pdp1console = new PDP1Console;
	canvas = document.getElementById('swcanvas');
	canvas.width = 550;
	canvas.height =550;
	ctx = canvas.getContext('2d');
	ctx.fillStyle = '#ffffff';
	ctx.clearRect(0,0,550,550);
	window.onkeydown = function(e){handleKeydown (e);}
	window.onkeyup = function(e){handleKeyup(e);}
	timer = setInterval(frame, 56); 
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

function frame(){
	//ctx.clearRect(0,0,550,550);
	ctx.fillStyle = "rgb(0 0 0 / 5%)";
	ctx.fillRect(0, 0, 550, 550);
	ctx.fillStyle = '#ffffff';
	startingTime = elapsedTime;
	while(elapsedTime - startingTime < 56000) {
		if(!running) {
			break;
		}
		step();
	}
}

function step(){
	if(running) {
		ma = pc++;
		pc = pc % 0o10000;
		dispatch(memory[ma])
	}
	pdp1console.display();
}

function dispatch(md) {
	elapsedTime += 5;
	//pc = pc % 0o10000;
	if(cpuhistory) {
		console.log(oct(md));
	}
	y=md&07777; ib=(md>>12)&1;
	switch(md>>13) {
	case AND: ea(); ac&=memory[ma]; break;
	case IOR: ea(); ac|=memory[ma]; break;
	case XOR: ea(); ac^=memory[ma]; break;
	case XCT: ea(); dispatch(memory[ma]); break;
	case CALJDA: 
		var target=(ib==0)?64:y;
		memory[(bank<<12)+target]=ac;
		ac=(ov<<17)+(extend<<16)+(extend ? (bank<<12) : 0)+pc; // TODO: Don't know if the bank bits are hidden in non-extend mode
		pc=target+1;
		break;
	case LAC: ea(); ac=memory[ma]; break;
	case LIO: ea(); io=memory[ma]; break;
	case DAC: ea(); memory[ma]=ac; break;
	case DAP: ea(); memory[ma]=(memory[ma]&0770000)+(ac&07777); break;
	case DIP: ea(); memory[ma]=(ac&0o770000)|(memory[ma]&0o007777); break;
	case DIO: ea(); memory[ma]=io; break;
	case DZM: ea(); memory[ma]=0; break;
	case ADD:
		ea();
		ac=ac+memory[ma];
		ov=ac>>18;
		ac=(ac+ov)&0777777;
		if (ac==0777777) ac=0;
		break;
	case SUB:
		ea();
		var diffsigns=((ac>>17)^(memory[ma]>>17))==1;
		ac=ac+(memory[ma]^0777777);
		ac=(ac+(ac>>18))&0777777;
		if (ac==0777777) ac=0;
		if (diffsigns&&(memory[ma]>>17==ac>>17)) ov=1;
		break;
	case IDX:
		ea(); 
		ac=memory[ma]+1; 
		if(ac==0777777) ac=0;
		memory[ma]=ac;
		break;
	case ISP:
		ea();
		ac=memory[ma]+1; 
		if(ac==0777777) ac=0;
		memory[ma]=ac;
		if((ac&0400000)==0) pc++;
		break;
	case SAD: ea(); if(ac!=memory[ma]) pc++; break;
	case SAS: ea(); if(ac==memory[ma]) pc++; break;
	case MUS:
		ea();
		if ((io&1)==1){
			ac=ac+memory[ma];
			ac=(ac+(ac>>18))&0777777;
			if (ac==0777777) ac=0;
		}
		io=(io>>1|ac<<17)&0777777;
		ac>>=1;
		break;
	case DIS:
		ea();
		var acl=ac>>17;
		ac=(ac<<1|io>>17)&0777777;
		io=((io<<1|acl)&0777777)^1;
		if ((io&1)==1){
			ac=ac+(memory[ma]^0777777);
			ac=(ac+(ac>>18))&0777777;}
		else {
			ac=ac+1+memory[ma];
			ac=(ac+(ac>>18))&0777777;
		}
		if (ac==0777777) ac=0;
		break;
	case JMP: ea(); pc=ma&0o7777; bank=ma>>12; break;
	case JSP: ea(); ac=(ov<<17)+(extend<<16)+(bank<<12)+pc; pc=ma&0o7777; bank=ma>>12; break;
	case SKP:
		var cond =
			(((y&0100)==0100)&&(ac==0)) ||
			(((y&0200)==0200)&&(ac>>17==0)) ||
			(((y&0400)==0400)&&(ac>>17==1)) ||
			(((y&01000)==01000)&&(ov==0)) ||
			(((y&02000)==02000)&&(io>>17==0))||
			(((y&7)!=0)&&!flag[y&7])||
			(((y&070)!=0)&&((y&070)!=070)&&!sense[((y&070)>>3)-1])||
			((y&070)==070)&&sense.every(b => !b);
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
		console.error("Unknown IOT", `0o${md.toString(8)}`);
		running = false;
		break;
	case OPR:	
		if((y&0200)==0200) ac=0;
		if((y&04000)==04000) io=0;
		if((y&01000)==01000) ac^=0777777;
		if((y&02000)==02000) ac|=testWord;
		if((y&0400)==0400) {running=false; console.log("HALT");}
		var nflag=y&7; 
		if (nflag<2) break;
		var state=(y&010)==010;
		if (nflag==7) {
			for (var i=2;i<7;i++) flag[i]=state;
			break;
		}
		flag[nflag]=state;
		break;
	default:	console.log('Undefined instruction:', os(md), 'at', os(pc-1), 'opcode', (md>>13).toString(8)); running = false;
    //Runtime.getRuntime().exit(0);
  }
}

function ea() {
	elapsedTime += 5;
	ma = y;
	if(!extend) {
		while(true){
			ma = (bank<<12) + ma;
			if (ib==0) return;
			elapsedTime += 5;
			ib=(memory[ma]>>12)&1;
			ma=memory[ma]&07777;
		}
	} else {
		ma = (bank<<12) + ma;
		if (ib==0) return;
		elasedTime += 5;
		ma=memory[ma]&&0o177777;
	}
}

function dpy(){
	var x=(ac+0400000)&0777777;
	var y=(io+0400000)&0777777;
	x=x*550/0777777; y=y*550/0777777;
	ctx.fillRect(x,y,1,1);
}


function os(n){
	n += 01000000;
	return '0'+ n.toString(8).substring(1);
}
    
function regs(){
	console.log('pc:', os(pc), 'mpc:', os(memory[pc]), 'ac:', os(ac), 'io;', os(io), 'ov:', ov);
}