/* Cérebro Galáctico — gerado por scripts/montar-plugin.mjs a partir de plugin/src e motor/. Não edite à mão. */
"use strict";var yc=Object.defineProperty;var Cf=Object.getOwnPropertyDescriptor;var Rf=Object.getOwnPropertyNames;var Pf=Object.prototype.hasOwnProperty;var If=(i,t)=>{for(var e in t)yc(i,e,{get:t[e],enumerable:!0})},Lf=(i,t,e,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of Rf(t))!Pf.call(i,s)&&s!==e&&yc(i,s,{get:()=>t[s],enumerable:!(n=Cf(t,s))||n.enumerable});return i};var Df=i=>Lf(yc({},"__esModule",{value:!0}),i);var Lx={};If(Lx,{default:()=>Zl});module.exports=Df(Lx);var Hn=require("obsidian");var as={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},os={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},$u=0,jc=1,Ju=2;var fa=1,Ku=2,Mr=3,Ui=0,cn=1,Vn=2,_i=0,As=1,Ps=2,Qc=3,th=4,Pn=5;var ji=100,ju=101,Qu=102,td=103,ed=104,br=200,Pe=201,nd=202,id=203,hr=204,ur=205,sd=206,rd=207,ad=208,od=209,ld=210,cd=211,hd=212,ud=213,dd=214,go=0,_o=1,xo=2,ws=3,vo=4,yo=5,Mo=6,bo=7,eh=0,fd=1,pd=2,ii=0,nh=1,ih=2,sh=3,rh=4,ah=5,oh=6,lh=7;var ch=300,ls=301,Is=302,Ko=303,jo=304,pa=306,So=1e3,pi=1001,Eo=1002,on=1003,md=1004;var ma=1005;var Ue=1006,Qo=1007;var si=1008;var Sn=1009,hh=1010,uh=1011,Sr=1012,tl=1013,ri=1014,ai=1015,$n=1016,el=1017,nl=1018,Er=1020,dh=35902,fh=35899,ph=1021,mh=1022,Jn=1023,mi=1026,cs=1027,gh=1028,il=1029,hs=1030,sl=1031;var rl=1033,ga=33776,_a=33777,xa=33778,va=33779,al=35840,ol=35841,ll=35842,cl=35843,hl=36196,ul=37492,dl=37496,fl=37488,pl=37489,ya=37490,ml=37491,gl=37808,_l=37809,xl=37810,vl=37811,yl=37812,Ml=37813,bl=37814,Sl=37815,El=37816,Tl=37817,Al=37818,wl=37819,Cl=37820,Rl=37821,Pl=36492,Il=36494,Ll=36495,Dl=36283,Nl=36284,Ma=36285,Ul=36286;var Jr=2300,To=2301,mo=2302,Gc=2303,Wc=2400,Xc=2401,qc=2402;var gd=3200;var _h=0,_d=1,Bi="",On="srgb",Kr="srgb-linear",jr="linear",ve="srgb";var Es=7680;var Yc=519,xd=512,vd=513,yd=514,Fl=515,Md=516,bd=517,Ol=518,Sd=519,Zc=35044;var xh="300 es",ei=2e3,Qr=2001;function Nf(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Uf(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function ta(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Ed(){let i=ta("canvas");return i.style.display="block",i}var Eu={},dr=null;function vh(...i){let t="THREE."+i.shift();dr?dr("log",t,...i):console.log(t,...i)}function Td(i){let t=i[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=i[1];e&&e.isStackTrace?i[0]+=" "+e.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Gt(...i){i=Td(i);let t="THREE."+i.shift();if(dr)dr("warn",t,...i);else{let e=i[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...i)}}function qt(...i){i=Td(i);let t="THREE."+i.shift();if(dr)dr("error",t,...i);else{let e=i[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...i)}}function Ts(...i){let t=i.join(" ");t in Eu||(Eu[t]=!0,Gt(...i))}function Ad(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var wd={[go]:_o,[xo]:Mo,[vo]:bo,[ws]:yo,[_o]:go,[Mo]:xo,[bo]:vo,[yo]:ws},ni=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let s=n[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}},dn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Tu=1234567,Zr=Math.PI/180,fr=180/Math.PI;function Tr(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(dn[i&255]+dn[i>>8&255]+dn[i>>16&255]+dn[i>>24&255]+"-"+dn[t&255]+dn[t>>8&255]+"-"+dn[t>>16&15|64]+dn[t>>24&255]+"-"+dn[e&63|128]+dn[e>>8&255]+"-"+dn[e>>16&255]+dn[e>>24&255]+dn[n&255]+dn[n>>8&255]+dn[n>>16&255]+dn[n>>24&255]).toLowerCase()}function re(i,t,e){return Math.max(t,Math.min(e,i))}function yh(i,t){return(i%t+t)%t}function Ff(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Of(i,t,e){return i!==t?(e-i)/(t-i):0}function $r(i,t,e){return(1-e)*i+e*t}function Bf(i,t,e,n){return $r(i,t,1-Math.exp(-e*n))}function zf(i,t=1){return t-Math.abs(yh(i,t*2)-t)}function Vf(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function kf(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Hf(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Gf(i,t){return i+Math.random()*(t-i)}function Wf(i){return i*(.5-Math.random())}function Xf(i){i!==void 0&&(Tu=i);let t=Tu+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function qf(i){return i*Zr}function Yf(i){return i*fr}function Zf(i){return(i&i-1)===0&&i!==0}function $f(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Jf(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Kf(i,t,e,n,s){let r=Math.cos,a=Math.sin,o=r(e/2),c=a(e/2),l=r((t+n)/2),d=a((t+n)/2),m=r((t-n)/2),h=a((t-n)/2),x=r((n-t)/2),p=a((n-t)/2);switch(s){case"XYX":i.set(o*d,c*m,c*h,o*l);break;case"YZY":i.set(c*h,o*d,c*m,o*l);break;case"ZXZ":i.set(c*m,c*h,o*d,o*l);break;case"XZX":i.set(o*d,c*p,c*x,o*l);break;case"YXY":i.set(c*x,o*d,c*p,o*l);break;case"ZYZ":i.set(c*p,c*x,o*d,o*l);break;default:Gt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function lr(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function yn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var xi={DEG2RAD:Zr,RAD2DEG:fr,generateUUID:Tr,clamp:re,euclideanModulo:yh,mapLinear:Ff,inverseLerp:Of,lerp:$r,damp:Bf,pingpong:zf,smoothstep:Vf,smootherstep:kf,randInt:Hf,randFloat:Gf,randFloatSpread:Wf,seededRandom:Xf,degToRad:qf,radToDeg:Yf,isPowerOfTwo:Zf,ceilPowerOfTwo:$f,floorPowerOfTwo:Jf,setQuaternionFromProperEuler:Kf,normalize:yn,denormalize:lr},Th=class Th{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=re(this.x,t.x,e.x),this.y=re(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=re(this.x,t,e),this.y=re(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(re(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(re(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Th.prototype.isVector2=!0;var $t=Th,Bn=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let c=n[s+0],l=n[s+1],d=n[s+2],m=n[s+3],h=r[a+0],x=r[a+1],p=r[a+2],S=r[a+3];if(m!==S||c!==h||l!==x||d!==p){let _=c*h+l*x+d*p+m*S;_<0&&(h=-h,x=-x,p=-p,S=-S,_=-_);let f=1-o;if(_<.9995){let A=Math.acos(_),I=Math.sin(A);f=Math.sin(f*A)/I,o=Math.sin(o*A)/I,c=c*f+h*o,l=l*f+x*o,d=d*f+p*o,m=m*f+S*o}else{c=c*f+h*o,l=l*f+x*o,d=d*f+p*o,m=m*f+S*o;let A=1/Math.sqrt(c*c+l*l+d*d+m*m);c*=A,l*=A,d*=A,m*=A}}t[e]=c,t[e+1]=l,t[e+2]=d,t[e+3]=m}static multiplyQuaternionsFlat(t,e,n,s,r,a){let o=n[s],c=n[s+1],l=n[s+2],d=n[s+3],m=r[a],h=r[a+1],x=r[a+2],p=r[a+3];return t[e]=o*p+d*m+c*x-l*h,t[e+1]=c*p+d*h+l*m-o*x,t[e+2]=l*p+d*x+o*h-c*m,t[e+3]=d*p-o*m-c*h-l*x,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(n/2),d=o(s/2),m=o(r/2),h=c(n/2),x=c(s/2),p=c(r/2);switch(a){case"XYZ":this._x=h*d*m+l*x*p,this._y=l*x*m-h*d*p,this._z=l*d*p+h*x*m,this._w=l*d*m-h*x*p;break;case"YXZ":this._x=h*d*m+l*x*p,this._y=l*x*m-h*d*p,this._z=l*d*p-h*x*m,this._w=l*d*m+h*x*p;break;case"ZXY":this._x=h*d*m-l*x*p,this._y=l*x*m+h*d*p,this._z=l*d*p+h*x*m,this._w=l*d*m-h*x*p;break;case"ZYX":this._x=h*d*m-l*x*p,this._y=l*x*m+h*d*p,this._z=l*d*p-h*x*m,this._w=l*d*m+h*x*p;break;case"YZX":this._x=h*d*m+l*x*p,this._y=l*x*m+h*d*p,this._z=l*d*p-h*x*m,this._w=l*d*m-h*x*p;break;case"XZY":this._x=h*d*m-l*x*p,this._y=l*x*m-h*d*p,this._z=l*d*p+h*x*m,this._w=l*d*m+h*x*p;break;default:Gt("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],c=e[9],l=e[2],d=e[6],m=e[10],h=n+o+m;if(h>0){let x=.5/Math.sqrt(h+1);this._w=.25/x,this._x=(d-c)*x,this._y=(r-l)*x,this._z=(a-s)*x}else if(n>o&&n>m){let x=2*Math.sqrt(1+n-o-m);this._w=(d-c)/x,this._x=.25*x,this._y=(s+a)/x,this._z=(r+l)/x}else if(o>m){let x=2*Math.sqrt(1+o-n-m);this._w=(r-l)/x,this._x=(s+a)/x,this._y=.25*x,this._z=(c+d)/x}else{let x=2*Math.sqrt(1+m-n-o);this._w=(a-s)/x,this._x=(r+l)/x,this._y=(c+d)/x,this._z=.25*x}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(re(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,c=e._y,l=e._z,d=e._w;return this._x=n*d+a*o+s*l-r*c,this._y=s*d+a*c+r*o-n*l,this._z=r*d+a*l+n*c-s*o,this._w=a*d-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){let n=t._x,s=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let c=1-e;if(o<.9995){let l=Math.acos(o),d=Math.sin(l);c=Math.sin(c*l)/d,e=Math.sin(e*l)/d,this._x=this._x*c+n*e,this._y=this._y*c+s*e,this._z=this._z*c+r*e,this._w=this._w*c+a*e,this._onChangeCallback()}else this._x=this._x*c+n*e,this._y=this._y*c+s*e,this._z=this._z*c+r*e,this._w=this._w*c+a*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Ah=class Ah{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Au.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Au.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*s-o*n),d=2*(o*e-r*s),m=2*(r*n-a*e);return this.x=e+c*l+a*m-o*d,this.y=n+c*d+o*l-r*m,this.z=s+c*m+r*d-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=re(this.x,t.x,e.x),this.y=re(this.y,t.y,e.y),this.z=re(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=re(this.x,t,e),this.y=re(this.y,t,e),this.z=re(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(re(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,c=e.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Mc.copy(this).projectOnVector(t),this.sub(Mc)}reflect(t){return this.sub(Mc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(re(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Ah.prototype.isVector3=!0;var U=Ah,Mc=new U,Au=new Bn,wh=class wh{constructor(t,e,n,s,r,a,o,c,l){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,l)}set(t,e,n,s,r,a,o,c,l){let d=this.elements;return d[0]=t,d[1]=s,d[2]=o,d[3]=e,d[4]=r,d[5]=c,d[6]=n,d[7]=a,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],d=n[4],m=n[7],h=n[2],x=n[5],p=n[8],S=s[0],_=s[3],f=s[6],A=s[1],I=s[4],E=s[7],R=s[2],w=s[5],D=s[8];return r[0]=a*S+o*A+c*R,r[3]=a*_+o*I+c*w,r[6]=a*f+o*E+c*D,r[1]=l*S+d*A+m*R,r[4]=l*_+d*I+m*w,r[7]=l*f+d*E+m*D,r[2]=h*S+x*A+p*R,r[5]=h*_+x*I+p*w,r[8]=h*f+x*E+p*D,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],d=t[8];return e*a*d-e*o*l-n*r*d+n*o*c+s*r*l-s*a*c}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],d=t[8],m=d*a-o*l,h=o*c-d*r,x=l*r-a*c,p=e*m+n*h+s*x;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let S=1/p;return t[0]=m*S,t[1]=(s*l-d*n)*S,t[2]=(o*n-s*a)*S,t[3]=h*S,t[4]=(d*e-s*c)*S,t[5]=(s*r-o*e)*S,t[6]=x*S,t[7]=(n*c-l*e)*S,t[8]=(a*e-n*r)*S,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+t,-s*l,s*c,-s*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return Ts("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(bc.makeScale(t,e)),this}rotate(t){return Ts("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(bc.makeRotation(-t)),this}translate(t,e){return Ts("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(bc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};wh.prototype.isMatrix3=!0;var jt=wh,bc=new jt,wu=new jt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Cu=new jt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function jf(){let i={enabled:!0,workingColorSpace:Kr,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ve&&(s.r=Ni(s.r),s.g=Ni(s.g),s.b=Ni(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ve&&(s.r=cr(s.r),s.g=cr(s.g),s.b=cr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Bi?jr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Ts("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Ts("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Kr]:{primaries:t,whitePoint:n,transfer:jr,toXYZ:wu,fromXYZ:Cu,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:On},outputColorSpaceConfig:{drawingBufferColorSpace:On}},[On]:{primaries:t,whitePoint:n,transfer:ve,toXYZ:wu,fromXYZ:Cu,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:On}}}),i}var he=jf();function Ni(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function cr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Js,Ao=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Js===void 0&&(Js=ta("canvas")),Js.width=t.width,Js.height=t.height;let s=Js.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=Js}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=ta("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Ni(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Ni(e[n]/255)*255):e[n]=Ni(e[n]);return{data:e,width:t.width,height:t.height}}else return Gt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Qf=0,pr=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Qf++}),this.uuid=Tr(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Sc(s[a].image)):r.push(Sc(s[a]))}else r=Sc(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function Sc(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ao.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Gt("Texture: Unable to serialize Texture."),{})}var tp=0,Ec=new U,Mn=class i extends ni{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=pi,s=pi,r=Ue,a=si,o=Jn,c=Sn,l=i.DEFAULT_ANISOTROPY,d=Bi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:tp++}),this.uuid=Tr(),this.name="",this.source=new pr(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new $t(0,0),this.repeat=new $t(1,1),this.center=new $t(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new jt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Ec).x}get height(){return this.source.getSize(Ec).y}get depth(){return this.source.getSize(Ec).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){Gt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Gt(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==ch)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case So:t.x=t.x-Math.floor(t.x);break;case pi:t.x=t.x<0?0:1;break;case Eo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case So:t.y=t.y-Math.floor(t.y);break;case pi:t.y=t.y<0?0:1;break;case Eo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};Mn.DEFAULT_IMAGE=null;Mn.DEFAULT_MAPPING=ch;Mn.DEFAULT_ANISOTROPY=1;var Ch=class Ch{constructor(t=0,e=0,n=0,s=1){this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,c=t.elements,l=c[0],d=c[4],m=c[8],h=c[1],x=c[5],p=c[9],S=c[2],_=c[6],f=c[10];if(Math.abs(d-h)<.01&&Math.abs(m-S)<.01&&Math.abs(p-_)<.01){if(Math.abs(d+h)<.1&&Math.abs(m+S)<.1&&Math.abs(p+_)<.1&&Math.abs(l+x+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let I=(l+1)/2,E=(x+1)/2,R=(f+1)/2,w=(d+h)/4,D=(m+S)/4,v=(p+_)/4;return I>E&&I>R?I<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(I),s=w/n,r=D/n):E>R?E<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(E),n=w/s,r=v/s):R<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(R),n=D/r,s=v/r),this.set(n,s,r,e),this}let A=Math.sqrt((_-p)*(_-p)+(m-S)*(m-S)+(h-d)*(h-d));return Math.abs(A)<.001&&(A=1),this.x=(_-p)/A,this.y=(m-S)/A,this.z=(h-d)/A,this.w=Math.acos((l+x+f-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=re(this.x,t.x,e.x),this.y=re(this.y,t.y,e.y),this.z=re(this.z,t.z,e.z),this.w=re(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=re(this.x,t,e),this.y=re(this.y,t,e),this.z=re(this.z,t,e),this.w=re(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(re(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Ch.prototype.isVector4=!0;var Le=Ch,wo=class extends ni{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ue,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new Le(0,0,t,e),this.scissorTest=!1,this.viewport=new Le(0,0,t,e),this.textures=[];let s={width:t,height:e,depth:n.depth},r=new Mn(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:Ue,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new pr(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},mn=class extends wo{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},ea=class extends Mn{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=on,this.minFilter=on,this.wrapR=pi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Co=class extends Mn{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=on,this.minFilter=on,this.wrapR=pi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Jo=class Jo{constructor(t,e,n,s,r,a,o,c,l,d,m,h,x,p,S,_){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,l,d,m,h,x,p,S,_)}set(t,e,n,s,r,a,o,c,l,d,m,h,x,p,S,_){let f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=s,f[1]=r,f[5]=a,f[9]=o,f[13]=c,f[2]=l,f[6]=d,f[10]=m,f[14]=h,f[3]=x,f[7]=p,f[11]=S,f[15]=_,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Jo().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,n=t.elements,s=1/Ks.setFromMatrixColumn(t,0).length(),r=1/Ks.setFromMatrixColumn(t,1).length(),a=1/Ks.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),d=Math.cos(r),m=Math.sin(r);if(t.order==="XYZ"){let h=a*d,x=a*m,p=o*d,S=o*m;e[0]=c*d,e[4]=-c*m,e[8]=l,e[1]=x+p*l,e[5]=h-S*l,e[9]=-o*c,e[2]=S-h*l,e[6]=p+x*l,e[10]=a*c}else if(t.order==="YXZ"){let h=c*d,x=c*m,p=l*d,S=l*m;e[0]=h+S*o,e[4]=p*o-x,e[8]=a*l,e[1]=a*m,e[5]=a*d,e[9]=-o,e[2]=x*o-p,e[6]=S+h*o,e[10]=a*c}else if(t.order==="ZXY"){let h=c*d,x=c*m,p=l*d,S=l*m;e[0]=h-S*o,e[4]=-a*m,e[8]=p+x*o,e[1]=x+p*o,e[5]=a*d,e[9]=S-h*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){let h=a*d,x=a*m,p=o*d,S=o*m;e[0]=c*d,e[4]=p*l-x,e[8]=h*l+S,e[1]=c*m,e[5]=S*l+h,e[9]=x*l-p,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){let h=a*c,x=a*l,p=o*c,S=o*l;e[0]=c*d,e[4]=S-h*m,e[8]=p*m+x,e[1]=m,e[5]=a*d,e[9]=-o*d,e[2]=-l*d,e[6]=x*m+p,e[10]=h-S*m}else if(t.order==="XZY"){let h=a*c,x=a*l,p=o*c,S=o*l;e[0]=c*d,e[4]=-m,e[8]=l*d,e[1]=h*m+S,e[5]=a*d,e[9]=x*m-p,e[2]=p*m-x,e[6]=o*d,e[10]=S*m+h}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(ep,t,np)}lookAt(t,e,n){let s=this.elements;return Un.subVectors(t,e),Un.lengthSq()===0&&(Un.z=1),Un.normalize(),Xi.crossVectors(n,Un),Xi.lengthSq()===0&&(Math.abs(n.z)===1?Un.x+=1e-4:Un.z+=1e-4,Un.normalize(),Xi.crossVectors(n,Un)),Xi.normalize(),Wa.crossVectors(Un,Xi),s[0]=Xi.x,s[4]=Wa.x,s[8]=Un.x,s[1]=Xi.y,s[5]=Wa.y,s[9]=Un.y,s[2]=Xi.z,s[6]=Wa.z,s[10]=Un.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],d=n[1],m=n[5],h=n[9],x=n[13],p=n[2],S=n[6],_=n[10],f=n[14],A=n[3],I=n[7],E=n[11],R=n[15],w=s[0],D=s[4],v=s[8],C=s[12],k=s[1],F=s[5],G=s[9],V=s[13],Q=s[2],Y=s[6],it=s[10],K=s[14],rt=s[3],ct=s[7],_t=s[11],ft=s[15];return r[0]=a*w+o*k+c*Q+l*rt,r[4]=a*D+o*F+c*Y+l*ct,r[8]=a*v+o*G+c*it+l*_t,r[12]=a*C+o*V+c*K+l*ft,r[1]=d*w+m*k+h*Q+x*rt,r[5]=d*D+m*F+h*Y+x*ct,r[9]=d*v+m*G+h*it+x*_t,r[13]=d*C+m*V+h*K+x*ft,r[2]=p*w+S*k+_*Q+f*rt,r[6]=p*D+S*F+_*Y+f*ct,r[10]=p*v+S*G+_*it+f*_t,r[14]=p*C+S*V+_*K+f*ft,r[3]=A*w+I*k+E*Q+R*rt,r[7]=A*D+I*F+E*Y+R*ct,r[11]=A*v+I*G+E*it+R*_t,r[15]=A*C+I*V+E*K+R*ft,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],c=t[9],l=t[13],d=t[2],m=t[6],h=t[10],x=t[14],p=t[3],S=t[7],_=t[11],f=t[15],A=c*x-l*h,I=o*x-l*m,E=o*h-c*m,R=a*x-l*d,w=a*h-c*d,D=a*m-o*d;return e*(S*A-_*I+f*E)-n*(p*A-_*R+f*w)+s*(p*I-S*R+f*D)-r*(p*E-S*w+_*D)}determinantAffine(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[1],a=t[5],o=t[9],c=t[2],l=t[6],d=t[10];return e*(a*d-o*l)-n*(r*d-o*c)+s*(r*l-a*c)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],d=t[8],m=t[9],h=t[10],x=t[11],p=t[12],S=t[13],_=t[14],f=t[15],A=e*o-n*a,I=e*c-s*a,E=e*l-r*a,R=n*c-s*o,w=n*l-r*o,D=s*l-r*c,v=d*S-m*p,C=d*_-h*p,k=d*f-x*p,F=m*_-h*S,G=m*f-x*S,V=h*f-x*_,Q=A*V-I*G+E*F+R*k-w*C+D*v;if(Q===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let Y=1/Q;return t[0]=(o*V-c*G+l*F)*Y,t[1]=(s*G-n*V-r*F)*Y,t[2]=(S*D-_*w+f*R)*Y,t[3]=(h*w-m*D-x*R)*Y,t[4]=(c*k-a*V-l*C)*Y,t[5]=(e*V-s*k+r*C)*Y,t[6]=(_*E-p*D-f*I)*Y,t[7]=(d*D-h*E+x*I)*Y,t[8]=(a*G-o*k+l*v)*Y,t[9]=(n*k-e*G-r*v)*Y,t[10]=(p*w-S*E+f*A)*Y,t[11]=(m*E-d*w-x*A)*Y,t[12]=(o*C-a*F-c*v)*Y,t[13]=(e*F-n*C+s*v)*Y,t[14]=(S*I-p*R-_*A)*Y,t[15]=(d*R-m*I+h*A)*Y,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,c=t.z,l=r*a,d=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,d*o+n,d*c-s*a,0,l*c-s*o,d*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,a=e._y,o=e._z,c=e._w,l=r+r,d=a+a,m=o+o,h=r*l,x=r*d,p=r*m,S=a*d,_=a*m,f=o*m,A=c*l,I=c*d,E=c*m,R=n.x,w=n.y,D=n.z;return s[0]=(1-(S+f))*R,s[1]=(x+E)*R,s[2]=(p-I)*R,s[3]=0,s[4]=(x-E)*w,s[5]=(1-(h+f))*w,s[6]=(_+A)*w,s[7]=0,s[8]=(p+I)*D,s[9]=(_-A)*D,s[10]=(1-(h+S))*D,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let a=Ks.set(s[0],s[1],s[2]).length(),o=Ks.set(s[4],s[5],s[6]).length(),c=Ks.set(s[8],s[9],s[10]).length();r<0&&(a=-a),jn.copy(this);let l=1/a,d=1/o,m=1/c;return jn.elements[0]*=l,jn.elements[1]*=l,jn.elements[2]*=l,jn.elements[4]*=d,jn.elements[5]*=d,jn.elements[6]*=d,jn.elements[8]*=m,jn.elements[9]*=m,jn.elements[10]*=m,e.setFromRotationMatrix(jn),n.x=a,n.y=o,n.z=c,this}makePerspective(t,e,n,s,r,a,o=ei,c=!1){let l=this.elements,d=2*r/(e-t),m=2*r/(n-s),h=(e+t)/(e-t),x=(n+s)/(n-s),p,S;if(c)p=r/(a-r),S=a*r/(a-r);else if(o===ei)p=-(a+r)/(a-r),S=-2*a*r/(a-r);else if(o===Qr)p=-a/(a-r),S=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=d,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=m,l[9]=x,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=S,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=ei,c=!1){let l=this.elements,d=2/(e-t),m=2/(n-s),h=-(e+t)/(e-t),x=-(n+s)/(n-s),p,S;if(c)p=1/(a-r),S=a/(a-r);else if(o===ei)p=-2/(a-r),S=-(a+r)/(a-r);else if(o===Qr)p=-1/(a-r),S=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=d,l[4]=0,l[8]=0,l[12]=h,l[1]=0,l[5]=m,l[9]=0,l[13]=x,l[2]=0,l[6]=0,l[10]=p,l[14]=S,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};Jo.prototype.isMatrix4=!0;var Oe=Jo,Ks=new U,jn=new Oe,ep=new U(0,0,0),np=new U(1,1,1),Xi=new U,Wa=new U,Un=new U,Ru=new Oe,Pu=new Bn,Qi=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],d=s[9],m=s[2],h=s[6],x=s[10];switch(e){case"XYZ":this._y=Math.asin(re(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,x),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(h,l),this._z=0);break;case"YXZ":this._x=Math.asin(-re(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,x),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-m,r),this._z=0);break;case"ZXY":this._x=Math.asin(re(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-m,x),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-re(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(h,x),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(re(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-m,r)):(this._x=0,this._y=Math.atan2(o,x));break;case"XZY":this._z=Math.asin(-re(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-d,x),this._y=0);break;default:Gt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Ru.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ru,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Pu.setFromEuler(this),this.setFromQuaternion(Pu,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Qi.DEFAULT_ORDER="XYZ";var na=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},ip=0,Iu=new U,js=new Bn,Ci=new Oe,Xa=new U,Gr=new U,sp=new U,rp=new Bn,Lu=new U(1,0,0),Du=new U(0,1,0),Nu=new U(0,0,1),Uu={type:"added"},ap={type:"removed"},Qs={type:"childadded",child:null},Tc={type:"childremoved",child:null},Rn=class i extends ni{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ip++}),this.uuid=Tr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new U,e=new Qi,n=new Bn,s=new U(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Oe},normalMatrix:{value:new jt}}),this.matrix=new Oe,this.matrixWorld=new Oe,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new na,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return js.setFromAxisAngle(t,e),this.quaternion.multiply(js),this}rotateOnWorldAxis(t,e){return js.setFromAxisAngle(t,e),this.quaternion.premultiply(js),this}rotateX(t){return this.rotateOnAxis(Lu,t)}rotateY(t){return this.rotateOnAxis(Du,t)}rotateZ(t){return this.rotateOnAxis(Nu,t)}translateOnAxis(t,e){return Iu.copy(t).applyQuaternion(this.quaternion),this.position.add(Iu.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Lu,t)}translateY(t){return this.translateOnAxis(Du,t)}translateZ(t){return this.translateOnAxis(Nu,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Ci.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Xa.copy(t):Xa.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Gr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ci.lookAt(Gr,Xa,this.up):Ci.lookAt(Xa,Gr,this.up),this.quaternion.setFromRotationMatrix(Ci),s&&(Ci.extractRotation(s.matrixWorld),js.setFromRotationMatrix(Ci),this.quaternion.premultiply(js.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(qt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Uu),Qs.child=t,this.dispatchEvent(Qs),Qs.child=null):qt("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(ap),Tc.child=t,this.dispatchEvent(Tc),Tc.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Ci.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Ci.multiply(t.parent.matrixWorld)),t.applyMatrix4(Ci),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Uu),Qs.child=t,this.dispatchEvent(Qs),Qs.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gr,t,sp),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gr,rp,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,n=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*s,r[13]+=n-r[1]*e-r[5]*n-r[9]*s,r[14]+=s-r[2]*e-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){let s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){let r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let c=o.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){let m=c[l];r(t.shapes,m)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(t.materials,this.material[c]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let c=this.animations[o];s.animations.push(r(t.animations,c))}}if(e){let o=a(t.geometries),c=a(t.materials),l=a(t.textures),d=a(t.images),m=a(t.shapes),h=a(t.skeletons),x=a(t.animations),p=a(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),d.length>0&&(n.images=d),m.length>0&&(n.shapes=m),h.length>0&&(n.skeletons=h),x.length>0&&(n.animations=x),p.length>0&&(n.nodes=p)}return n.object=s,n;function a(o){let c=[];for(let l in o){let d=o[l];delete d.metadata,c.push(d)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}};Rn.DEFAULT_UP=new U(0,1,0);Rn.DEFAULT_MATRIX_AUTO_UPDATE=!0;Rn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Di=class extends Rn{constructor(){super(),this.isGroup=!0,this.type="Group"}},op={type:"move"},mr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Di,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Di,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Di,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null,o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(let S of t.hand.values()){let _=e.getJointPose(S,n),f=this._getHandJoint(l,S);_!==null&&(f.matrix.fromArray(_.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=_.radius),f.visible=_!==null}let d=l.joints["index-finger-tip"],m=l.joints["thumb-tip"],h=d.position.distanceTo(m.position),x=.02,p=.005;l.inputState.pinching&&h>x+p?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&h<=x-p&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(op)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Di;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},Cd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},qi={h:0,s:0,l:0},qa={h:0,s:0,l:0};function Ac(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var kt=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=On){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,he.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=he.workingColorSpace){return this.r=t,this.g=e,this.b=n,he.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=he.workingColorSpace){if(t=yh(t,1),e=re(e,0,1),n=re(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=Ac(a,r,t+1/3),this.g=Ac(a,r,t),this.b=Ac(a,r,t-1/3)}return he.colorSpaceToWorking(this,s),this}setStyle(t,e=On){function n(r){r!==void 0&&parseFloat(r)<1&&Gt("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Gt("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);Gt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=On){let n=Cd[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Gt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ni(t.r),this.g=Ni(t.g),this.b=Ni(t.b),this}copyLinearToSRGB(t){return this.r=cr(t.r),this.g=cr(t.g),this.b=cr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=On){return he.workingToColorSpace(fn.copy(this),t),Math.round(re(fn.r*255,0,255))*65536+Math.round(re(fn.g*255,0,255))*256+Math.round(re(fn.b*255,0,255))}getHexString(t=On){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=he.workingColorSpace){he.workingToColorSpace(fn.copy(this),e);let n=fn.r,s=fn.g,r=fn.b,a=Math.max(n,s,r),o=Math.min(n,s,r),c,l,d=(o+a)/2;if(o===a)c=0,l=0;else{let m=a-o;switch(l=d<=.5?m/(a+o):m/(2-a-o),a){case n:c=(s-r)/m+(s<r?6:0);break;case s:c=(r-n)/m+2;break;case r:c=(n-s)/m+4;break}c/=6}return t.h=c,t.s=l,t.l=d,t}getRGB(t,e=he.workingColorSpace){return he.workingToColorSpace(fn.copy(this),e),t.r=fn.r,t.g=fn.g,t.b=fn.b,t}getStyle(t=On){he.workingToColorSpace(fn.copy(this),t);let e=fn.r,n=fn.g,s=fn.b;return t!==On?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(qi),this.setHSL(qi.h+t,qi.s+e,qi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(qi),t.getHSL(qa);let n=$r(qi.h,qa.h,e),s=$r(qi.s,qa.s,e),r=$r(qi.l,qa.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},fn=new kt;kt.NAMES=Cd;var Cs=class extends Rn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Qi,this.environmentIntensity=1,this.environmentRotation=new Qi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}},Qn=new U,Ri=new U,wc=new U,Pi=new U,tr=new U,er=new U,Fu=new U,Cc=new U,Rc=new U,Pc=new U,Ic=new Le,Lc=new Le,Dc=new Le,Ki=class i{constructor(t=new U,e=new U,n=new U){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Qn.subVectors(t,e),s.cross(Qn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){Qn.subVectors(s,e),Ri.subVectors(n,e),wc.subVectors(t,e);let a=Qn.dot(Qn),o=Qn.dot(Ri),c=Qn.dot(wc),l=Ri.dot(Ri),d=Ri.dot(wc),m=a*l-o*o;if(m===0)return r.set(0,0,0),null;let h=1/m,x=(l*c-o*d)*h,p=(a*d-o*c)*h;return r.set(1-x-p,p,x)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Pi)===null?!1:Pi.x>=0&&Pi.y>=0&&Pi.x+Pi.y<=1}static getInterpolation(t,e,n,s,r,a,o,c){return this.getBarycoord(t,e,n,s,Pi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Pi.x),c.addScaledVector(a,Pi.y),c.addScaledVector(o,Pi.z),c)}static getInterpolatedAttribute(t,e,n,s,r,a){return Ic.setScalar(0),Lc.setScalar(0),Dc.setScalar(0),Ic.fromBufferAttribute(t,e),Lc.fromBufferAttribute(t,n),Dc.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(Ic,r.x),a.addScaledVector(Lc,r.y),a.addScaledVector(Dc,r.z),a}static isFrontFacing(t,e,n,s){return Qn.subVectors(n,e),Ri.subVectors(t,e),Qn.cross(Ri).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Qn.subVectors(this.c,this.b),Ri.subVectors(this.a,this.b),Qn.cross(Ri).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,a,o;tr.subVectors(s,n),er.subVectors(r,n),Cc.subVectors(t,n);let c=tr.dot(Cc),l=er.dot(Cc);if(c<=0&&l<=0)return e.copy(n);Rc.subVectors(t,s);let d=tr.dot(Rc),m=er.dot(Rc);if(d>=0&&m<=d)return e.copy(s);let h=c*m-d*l;if(h<=0&&c>=0&&d<=0)return a=c/(c-d),e.copy(n).addScaledVector(tr,a);Pc.subVectors(t,r);let x=tr.dot(Pc),p=er.dot(Pc);if(p>=0&&x<=p)return e.copy(r);let S=x*l-c*p;if(S<=0&&l>=0&&p<=0)return o=l/(l-p),e.copy(n).addScaledVector(er,o);let _=d*p-x*m;if(_<=0&&m-d>=0&&x-p>=0)return Fu.subVectors(r,s),o=(m-d)/(m-d+(x-p)),e.copy(s).addScaledVector(Fu,o);let f=1/(_+S+h);return a=S*f,o=h*f,e.copy(n).addScaledVector(tr,a).addScaledVector(er,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},ts=class{constructor(t=new U(1/0,1/0,1/0),e=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(ti.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(ti.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=ti.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,ti):ti.fromBufferAttribute(r,a),ti.applyMatrix4(t.matrixWorld),this.expandByPoint(ti);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ya.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ya.copy(n.boundingBox)),Ya.applyMatrix4(t.matrixWorld),this.union(Ya)}let s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,ti),ti.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Wr),Za.subVectors(this.max,Wr),nr.subVectors(t.a,Wr),ir.subVectors(t.b,Wr),sr.subVectors(t.c,Wr),Yi.subVectors(ir,nr),Zi.subVectors(sr,ir),ys.subVectors(nr,sr);let e=[0,-Yi.z,Yi.y,0,-Zi.z,Zi.y,0,-ys.z,ys.y,Yi.z,0,-Yi.x,Zi.z,0,-Zi.x,ys.z,0,-ys.x,-Yi.y,Yi.x,0,-Zi.y,Zi.x,0,-ys.y,ys.x,0];return!Nc(e,nr,ir,sr,Za)||(e=[1,0,0,0,1,0,0,0,1],!Nc(e,nr,ir,sr,Za))?!1:($a.crossVectors(Yi,Zi),e=[$a.x,$a.y,$a.z],Nc(e,nr,ir,sr,Za))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,ti).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(ti).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Ii[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Ii[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Ii[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Ii[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Ii[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Ii[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Ii[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Ii[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Ii),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},Ii=[new U,new U,new U,new U,new U,new U,new U,new U],ti=new U,Ya=new ts,nr=new U,ir=new U,sr=new U,Yi=new U,Zi=new U,ys=new U,Wr=new U,Za=new U,$a=new U,Ms=new U;function Nc(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Ms.fromArray(i,r);let o=s.x*Math.abs(Ms.x)+s.y*Math.abs(Ms.y)+s.z*Math.abs(Ms.z),c=t.dot(Ms),l=e.dot(Ms),d=n.dot(Ms);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>o)return!1}return!0}var We=new U,Ja=new $t,lp=0,Qt=class extends ni{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:lp++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Zc,this.updateRanges=[],this.gpuType=ai,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Ja.fromBufferAttribute(this,e),Ja.applyMatrix3(t),this.setXY(e,Ja.x,Ja.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)We.fromBufferAttribute(this,e),We.applyMatrix3(t),this.setXYZ(e,We.x,We.y,We.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)We.fromBufferAttribute(this,e),We.applyMatrix4(t),this.setXYZ(e,We.x,We.y,We.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)We.fromBufferAttribute(this,e),We.applyNormalMatrix(t),this.setXYZ(e,We.x,We.y,We.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)We.fromBufferAttribute(this,e),We.transformDirection(t),this.setXYZ(e,We.x,We.y,We.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=lr(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=yn(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=lr(e,this.array)),e}setX(t,e){return this.normalized&&(e=yn(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=lr(e,this.array)),e}setY(t,e){return this.normalized&&(e=yn(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=lr(e,this.array)),e}setZ(t,e){return this.normalized&&(e=yn(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=lr(e,this.array)),e}setW(t,e){return this.normalized&&(e=yn(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=yn(e,this.array),n=yn(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=yn(e,this.array),n=yn(n,this.array),s=yn(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=yn(e,this.array),n=yn(n,this.array),s=yn(s,this.array),r=yn(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Zc&&(t.usage=this.usage),t}dispose(){this.dispatchEvent({type:"dispose"})}};var ia=class extends Qt{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var sa=class extends Qt{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var ln=class extends Qt{constructor(t,e,n){super(new Float32Array(t),e,n)}},cp=new ts,Xr=new U,Uc=new U,es=class{constructor(t=new U,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):cp.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Xr.subVectors(t,this.center);let e=Xr.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Xr,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Uc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Xr.copy(t.center).add(Uc)),this.expandByPoint(Xr.copy(t.center).sub(Uc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},hp=0,Yn=new Oe,Fc=new Rn,rr=new U,Fn=new ts,qr=new ts,an=new U,Re=class i extends ni{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:hp++}),this.uuid=Tr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Nf(t)?sa:ia)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new jt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return Yn.makeRotationFromQuaternion(t),this.applyMatrix4(Yn),this}rotateX(t){return Yn.makeRotationX(t),this.applyMatrix4(Yn),this}rotateY(t){return Yn.makeRotationY(t),this.applyMatrix4(Yn),this}rotateZ(t){return Yn.makeRotationZ(t),this.applyMatrix4(Yn),this}translate(t,e,n){return Yn.makeTranslation(t,e,n),this.applyMatrix4(Yn),this}scale(t,e,n){return Yn.makeScale(t,e,n),this.applyMatrix4(Yn),this}lookAt(t){return Fc.lookAt(t),Fc.updateMatrix(),this.applyMatrix4(Fc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(rr).negate(),this.translate(rr.x,rr.y,rr.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let s=0,r=t.length;s<r;s++){let a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ln(n,3))}else{let n=Math.min(t.length,e.count);for(let s=0;s<n;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&Gt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ts);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){qt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];Fn.setFromBufferAttribute(r),this.morphTargetsRelative?(an.addVectors(this.boundingBox.min,Fn.min),this.boundingBox.expandByPoint(an),an.addVectors(this.boundingBox.max,Fn.max),this.boundingBox.expandByPoint(an)):(this.boundingBox.expandByPoint(Fn.min),this.boundingBox.expandByPoint(Fn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&qt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new es);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){qt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(t){let n=this.boundingSphere.center;if(Fn.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){let o=e[r];qr.setFromBufferAttribute(o),this.morphTargetsRelative?(an.addVectors(Fn.min,qr.min),Fn.expandByPoint(an),an.addVectors(Fn.max,qr.max),Fn.expandByPoint(an)):(Fn.expandByPoint(qr.min),Fn.expandByPoint(qr.max))}Fn.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)an.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(an));if(e)for(let r=0,a=e.length;r<a;r++){let o=e[r],c=this.morphTargetsRelative;for(let l=0,d=o.count;l<d;l++)an.fromBufferAttribute(o,l),c&&(rr.fromBufferAttribute(t,l),an.add(rr)),s=Math.max(s,n.distanceToSquared(an))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&qt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){qt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,s=e.normal,r=e.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new Qt(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let o=[],c=[];for(let v=0;v<n.count;v++)o[v]=new U,c[v]=new U;let l=new U,d=new U,m=new U,h=new $t,x=new $t,p=new $t,S=new U,_=new U;function f(v,C,k){l.fromBufferAttribute(n,v),d.fromBufferAttribute(n,C),m.fromBufferAttribute(n,k),h.fromBufferAttribute(r,v),x.fromBufferAttribute(r,C),p.fromBufferAttribute(r,k),d.sub(l),m.sub(l),x.sub(h),p.sub(h);let F=1/(x.x*p.y-p.x*x.y);isFinite(F)&&(S.copy(d).multiplyScalar(p.y).addScaledVector(m,-x.y).multiplyScalar(F),_.copy(m).multiplyScalar(x.x).addScaledVector(d,-p.x).multiplyScalar(F),o[v].add(S),o[C].add(S),o[k].add(S),c[v].add(_),c[C].add(_),c[k].add(_))}let A=this.groups;A.length===0&&(A=[{start:0,count:t.count}]);for(let v=0,C=A.length;v<C;++v){let k=A[v],F=k.start,G=k.count;for(let V=F,Q=F+G;V<Q;V+=3)f(t.getX(V+0),t.getX(V+1),t.getX(V+2))}let I=new U,E=new U,R=new U,w=new U;function D(v){R.fromBufferAttribute(s,v),w.copy(R);let C=o[v];I.copy(C),I.sub(R.multiplyScalar(R.dot(C))).normalize(),E.crossVectors(w,C);let F=E.dot(c[v])<0?-1:1;a.setXYZW(v,I.x,I.y,I.z,F)}for(let v=0,C=A.length;v<C;++v){let k=A[v],F=k.start,G=k.count;for(let V=F,Q=F+G;V<Q;V+=3)D(t.getX(V+0)),D(t.getX(V+1)),D(t.getX(V+2))}this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new Qt(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let h=0,x=n.count;h<x;h++)n.setXYZ(h,0,0,0);let s=new U,r=new U,a=new U,o=new U,c=new U,l=new U,d=new U,m=new U;if(t)for(let h=0,x=t.count;h<x;h+=3){let p=t.getX(h+0),S=t.getX(h+1),_=t.getX(h+2);s.fromBufferAttribute(e,p),r.fromBufferAttribute(e,S),a.fromBufferAttribute(e,_),d.subVectors(a,r),m.subVectors(s,r),d.cross(m),o.fromBufferAttribute(n,p),c.fromBufferAttribute(n,S),l.fromBufferAttribute(n,_),o.add(d),c.add(d),l.add(d),n.setXYZ(p,o.x,o.y,o.z),n.setXYZ(S,c.x,c.y,c.z),n.setXYZ(_,l.x,l.y,l.z)}else for(let h=0,x=e.count;h<x;h+=3)s.fromBufferAttribute(e,h+0),r.fromBufferAttribute(e,h+1),a.fromBufferAttribute(e,h+2),d.subVectors(a,r),m.subVectors(s,r),d.cross(m),n.setXYZ(h+0,d.x,d.y,d.z),n.setXYZ(h+1,d.x,d.y,d.z),n.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)an.fromBufferAttribute(t,e),an.normalize(),t.setXYZ(e,an.x,an.y,an.z)}toNonIndexed(){function t(o,c){let l=o.array,d=o.itemSize,m=o.normalized,h=new l.constructor(c.length*d),x=0,p=0;for(let S=0,_=c.length;S<_;S++){o.isInterleavedBufferAttribute?x=c[S]*o.data.stride+o.offset:x=c[S]*d;for(let f=0;f<d;f++)h[p++]=l[x++]}return new Qt(h,d,m)}if(this.index===null)return Gt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let o in s){let c=s[o],l=t(c,n);e.setAttribute(o,l)}let r=this.morphAttributes;for(let o in r){let c=[],l=r[o];for(let d=0,m=l.length;d<m;d++){let h=l[d],x=t(h,n);c.push(x)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,c=a.length;o<c;o++){let l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let c in n){let l=n[c];t.data.attributes[c]=l.toJSON(t.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],d=[];for(let m=0,h=l.length;m<h;m++){let x=l[m];d.push(x.toJSON(t.data))}d.length>0&&(s[c]=d,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let s=t.attributes;for(let l in s){let d=s[l];this.setAttribute(l,d.clone(e))}let r=t.morphAttributes;for(let l in r){let d=[],m=r[l];for(let h=0,x=m.length;h<x;h++)d.push(m[h].clone(e));this.morphAttributes[l]=d}this.morphTargetsRelative=t.morphTargetsRelative;let a=t.groups;for(let l=0,d=a.length;l<d;l++){let m=a[l];this.addGroup(m.start,m.count,m.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var up=0,Fi=class extends ni{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:up++}),this.uuid=Tr(),this.name="",this.type="Material",this.blending=As,this.side=Ui,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=hr,this.blendDst=ur,this.blendEquation=ji,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new kt(0,0,0),this.blendAlpha=0,this.depthFunc=ws,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Yc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Es,this.stencilZFail=Es,this.stencilZPass=Es,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){Gt(`Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Gt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==As&&(n.blending=this.blending),this.side!==Ui&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==hr&&(n.blendSrc=this.blendSrc),this.blendDst!==ur&&(n.blendDst=this.blendDst),this.blendEquation!==ji&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ws&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Yc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Es&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Es&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Es&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let c=r[o];delete c.metadata,a.push(c)}return a}if(e){let r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new kt().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new $t().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new $t().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}};var Li=new U,Oc=new U,Ka=new U,$i=new U,Bc=new U,ja=new U,zc=new U,ns=class{constructor(t=new U,e=new U(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Li)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Li.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Li.copy(this.origin).addScaledVector(this.direction,e),Li.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Oc.copy(t).add(e).multiplyScalar(.5),Ka.copy(e).sub(t).normalize(),$i.copy(this.origin).sub(Oc);let r=t.distanceTo(e)*.5,a=-this.direction.dot(Ka),o=$i.dot(this.direction),c=-$i.dot(Ka),l=$i.lengthSq(),d=Math.abs(1-a*a),m,h,x,p;if(d>0)if(m=a*c-o,h=a*o-c,p=r*d,m>=0)if(h>=-p)if(h<=p){let S=1/d;m*=S,h*=S,x=m*(m+a*h+2*o)+h*(a*m+h+2*c)+l}else h=r,m=Math.max(0,-(a*h+o)),x=-m*m+h*(h+2*c)+l;else h=-r,m=Math.max(0,-(a*h+o)),x=-m*m+h*(h+2*c)+l;else h<=-p?(m=Math.max(0,-(-a*r+o)),h=m>0?-r:Math.min(Math.max(-r,-c),r),x=-m*m+h*(h+2*c)+l):h<=p?(m=0,h=Math.min(Math.max(-r,-c),r),x=h*(h+2*c)+l):(m=Math.max(0,-(a*r+o)),h=m>0?r:Math.min(Math.max(-r,-c),r),x=-m*m+h*(h+2*c)+l);else h=a>0?-r:r,m=Math.max(0,-(a*h+o)),x=-m*m+h*(h+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,m),s&&s.copy(Oc).addScaledVector(Ka,h),x}intersectSphere(t,e){Li.subVectors(t.center,this.origin);let n=Li.dot(this.direction),s=Li.dot(Li)-n*n,r=t.radius*t.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,c,l=1/this.direction.x,d=1/this.direction.y,m=1/this.direction.z,h=this.origin;return l>=0?(n=(t.min.x-h.x)*l,s=(t.max.x-h.x)*l):(n=(t.max.x-h.x)*l,s=(t.min.x-h.x)*l),d>=0?(r=(t.min.y-h.y)*d,a=(t.max.y-h.y)*d):(r=(t.max.y-h.y)*d,a=(t.min.y-h.y)*d),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),m>=0?(o=(t.min.z-h.z)*m,c=(t.max.z-h.z)*m):(o=(t.max.z-h.z)*m,c=(t.min.z-h.z)*m),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Li)!==null}intersectTriangle(t,e,n,s,r){Bc.subVectors(e,t),ja.subVectors(n,t),zc.crossVectors(Bc,ja);let a=this.direction.dot(zc),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;$i.subVectors(this.origin,t);let c=o*this.direction.dot(ja.crossVectors($i,ja));if(c<0)return null;let l=o*this.direction.dot(Bc.cross($i));if(l<0||c+l>a)return null;let d=-o*$i.dot(zc);return d<0?null:this.at(d/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ra=class extends Fi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new kt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Qi,this.combine=eh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},Ou=new Oe,bs=new ns,Qa=new es,Bu=new U,to=new U,eo=new U,no=new U,Vc=new U,io=new U,zu=new U,so=new U,$e=class extends Rn{constructor(t=new Re,e=new ra){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let o=this.morphTargetInfluences;if(r&&o){io.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let d=o[c],m=r[c];d!==0&&(Vc.fromBufferAttribute(m,t),a?io.addScaledVector(Vc,d):io.addScaledVector(Vc.sub(e),d))}e.add(io)}return e}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Qa.copy(n.boundingSphere),Qa.applyMatrix4(r),bs.copy(t.ray).recast(t.near),!(Qa.containsPoint(bs.origin)===!1&&(bs.intersectSphere(Qa,Bu)===null||bs.origin.distanceToSquared(Bu)>(t.far-t.near)**2))&&(Ou.copy(r).invert(),bs.copy(t.ray).applyMatrix4(Ou),!(n.boundingBox!==null&&bs.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,bs)))}_computeIntersections(t,e,n){let s,r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,d=r.attributes.uv1,m=r.attributes.normal,h=r.groups,x=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,S=h.length;p<S;p++){let _=h[p],f=a[_.materialIndex],A=Math.max(_.start,x.start),I=Math.min(o.count,Math.min(_.start+_.count,x.start+x.count));for(let E=A,R=I;E<R;E+=3){let w=o.getX(E),D=o.getX(E+1),v=o.getX(E+2);s=ro(this,f,t,n,l,d,m,w,D,v),s&&(s.faceIndex=Math.floor(E/3),s.face.materialIndex=_.materialIndex,e.push(s))}}else{let p=Math.max(0,x.start),S=Math.min(o.count,x.start+x.count);for(let _=p,f=S;_<f;_+=3){let A=o.getX(_),I=o.getX(_+1),E=o.getX(_+2);s=ro(this,a,t,n,l,d,m,A,I,E),s&&(s.faceIndex=Math.floor(_/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let p=0,S=h.length;p<S;p++){let _=h[p],f=a[_.materialIndex],A=Math.max(_.start,x.start),I=Math.min(c.count,Math.min(_.start+_.count,x.start+x.count));for(let E=A,R=I;E<R;E+=3){let w=E,D=E+1,v=E+2;s=ro(this,f,t,n,l,d,m,w,D,v),s&&(s.faceIndex=Math.floor(E/3),s.face.materialIndex=_.materialIndex,e.push(s))}}else{let p=Math.max(0,x.start),S=Math.min(c.count,x.start+x.count);for(let _=p,f=S;_<f;_+=3){let A=_,I=_+1,E=_+2;s=ro(this,a,t,n,l,d,m,A,I,E),s&&(s.faceIndex=Math.floor(_/3),e.push(s))}}}};function dp(i,t,e,n,s,r,a,o){let c;if(t.side===cn?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,t.side===Ui,o),c===null)return null;so.copy(o),so.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo(so);return l<e.near||l>e.far?null:{distance:l,point:so.clone(),object:i}}function ro(i,t,e,n,s,r,a,o,c,l){i.getVertexPosition(o,to),i.getVertexPosition(c,eo),i.getVertexPosition(l,no);let d=dp(i,t,e,n,to,eo,no,zu);if(d){let m=new U;Ki.getBarycoord(zu,to,eo,no,m),s&&(d.uv=Ki.getInterpolatedAttribute(s,o,c,l,m,new $t)),r&&(d.uv1=Ki.getInterpolatedAttribute(r,o,c,l,m,new $t)),a&&(d.normal=Ki.getInterpolatedAttribute(a,o,c,l,m,new U),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));let h={a:o,b:c,c:l,normal:new U,materialIndex:0};Ki.getNormal(to,eo,no,h.normal),d.face=h,d.barycoord=m}return d}var Ro=class extends Mn{constructor(t=null,e=1,n=1,s,r,a,o,c,l=on,d=on,m,h){super(null,a,o,c,l,d,s,r,m,h),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var kc=new U,fp=new U,pp=new jt,Zn=class{constructor(t=new U(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=kc.subVectors(n,e).cross(fp.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){let s=t.delta(kc),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let a=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:e.copy(t.start).addScaledVector(s,a)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||pp.getNormalMatrix(t),s=this.coplanarPoint(kc).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},Ss=new es,mp=new $t(.5,.5),ao=new U,aa=class{constructor(t=new Zn,e=new Zn,n=new Zn,s=new Zn,r=new Zn,a=new Zn){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){let o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=ei,n=!1){let s=this.planes,r=t.elements,a=r[0],o=r[1],c=r[2],l=r[3],d=r[4],m=r[5],h=r[6],x=r[7],p=r[8],S=r[9],_=r[10],f=r[11],A=r[12],I=r[13],E=r[14],R=r[15];if(s[0].setComponents(l-a,x-d,f-p,R-A).normalize(),s[1].setComponents(l+a,x+d,f+p,R+A).normalize(),s[2].setComponents(l+o,x+m,f+S,R+I).normalize(),s[3].setComponents(l-o,x-m,f-S,R-I).normalize(),n)s[4].setComponents(c,h,_,E).normalize(),s[5].setComponents(l-c,x-h,f-_,R-E).normalize();else if(s[4].setComponents(l-c,x-h,f-_,R-E).normalize(),e===ei)s[5].setComponents(l+c,x+h,f+_,R+E).normalize();else if(e===Qr)s[5].setComponents(c,h,_,E).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ss.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ss.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ss)}intersectsSprite(t){Ss.center.set(0,0,0);let e=mp.distanceTo(t.center);return Ss.radius=.7071067811865476+e,Ss.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ss)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(ao.x=s.normal.x>0?t.max.x:t.min.x,ao.y=s.normal.y>0?t.max.y:t.min.y,ao.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(ao)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var gr=class extends Fi{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new kt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},Po=new U,Io=new U,Vu=new Oe,Yr=new ns,oo=new es,Hc=new U,ku=new U,Lo=class extends Rn{constructor(t=new Re,e=new gr){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)Po.fromBufferAttribute(e,s-1),Io.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Po.distanceTo(Io);t.setAttribute("lineDistance",new ln(n,1))}else Gt("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),oo.copy(n.boundingSphere),oo.applyMatrix4(s),oo.radius+=r,t.ray.intersectsSphere(oo)===!1)return;Vu.copy(s).invert(),Yr.copy(t.ray).applyMatrix4(Vu);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,d=n.index,h=n.attributes.position;if(d!==null){let x=Math.max(0,a.start),p=Math.min(d.count,a.start+a.count);for(let S=x,_=p-1;S<_;S+=l){let f=d.getX(S),A=d.getX(S+1),I=lo(this,t,Yr,c,f,A,S);I&&e.push(I)}if(this.isLineLoop){let S=d.getX(p-1),_=d.getX(x),f=lo(this,t,Yr,c,S,_,p-1);f&&e.push(f)}}else{let x=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let S=x,_=p-1;S<_;S+=l){let f=lo(this,t,Yr,c,S,S+1,S);f&&e.push(f)}if(this.isLineLoop){let S=lo(this,t,Yr,c,p-1,x,p-1);S&&e.push(S)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function lo(i,t,e,n,s,r,a){let o=i.geometry.attributes.position;if(Po.fromBufferAttribute(o,s),Io.fromBufferAttribute(o,r),e.distanceSqToSegment(Po,Io,Hc,ku)>n)return;Hc.applyMatrix4(i.matrixWorld);let l=t.ray.origin.distanceTo(Hc);if(!(l<t.near||l>t.far))return{distance:l,point:ku.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}var Hu=new U,Gu=new U,_r=class extends Lo{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)Hu.fromBufferAttribute(e,s),Gu.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Hu.distanceTo(Gu);t.setAttribute("lineDistance",new ln(n,1))}else Gt("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var Do=class extends Fi{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new kt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Wu=new Oe,$c=new ns,co=new es,ho=new U,bn=class extends Rn{constructor(t=new Re,e=new Do){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),co.copy(n.boundingSphere),co.applyMatrix4(s),co.radius+=r,t.ray.intersectsSphere(co)===!1)return;Wu.copy(s).invert(),$c.copy(t.ray).applyMatrix4(Wu);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,m=n.attributes.position;if(l!==null){let h=Math.max(0,a.start),x=Math.min(l.count,a.start+a.count);for(let p=h,S=x;p<S;p++){let _=l.getX(p);ho.fromBufferAttribute(m,_),Xu(ho,_,c,s,t,e,this)}}else{let h=Math.max(0,a.start),x=Math.min(m.count,a.start+a.count);for(let p=h,S=x;p<S;p++)ho.fromBufferAttribute(m,p),Xu(ho,p,c,s,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function Xu(i,t,e,n,s,r,a){let o=$c.distanceSqToPoint(i);if(o<e){let c=new U;$c.closestPointToPoint(i,c),c.applyMatrix4(n);let l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}var oa=class extends Mn{constructor(t=[],e=ls,n,s,r,a,o,c,l,d){super(t,e,n,s,r,a,o,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},xr=class extends Mn{constructor(t,e,n,s,r,a,o,c,l){super(t,e,n,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Oi=class extends Mn{constructor(t,e,n=ri,s,r,a,o=on,c=on,l,d=mi,m=1){if(d!==mi&&d!==cs)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:t,height:e,depth:m};super(h,s,r,a,o,c,d,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new pr(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},No=class extends Oi{constructor(t,e=ri,n=ls,s,r,a=on,o=on,c,l=mi){let d={width:t,height:t,depth:1},m=[d,d,d,d,d,d];super(t,t,e,n,s,r,a,o,c,l),this.image=m,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},la=class extends Mn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},vr=class i extends Re{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let c=[],l=[],d=[],m=[],h=0,x=0;p("z","y","x",-1,-1,n,e,t,a,r,0),p("z","y","x",1,-1,n,e,-t,a,r,1),p("x","z","y",1,1,t,n,e,s,a,2),p("x","z","y",1,-1,t,n,-e,s,a,3),p("x","y","z",1,-1,t,e,n,s,r,4),p("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new ln(l,3)),this.setAttribute("normal",new ln(d,3)),this.setAttribute("uv",new ln(m,2));function p(S,_,f,A,I,E,R,w,D,v,C){let k=E/D,F=R/v,G=E/2,V=R/2,Q=w/2,Y=D+1,it=v+1,K=0,rt=0,ct=new U;for(let _t=0;_t<it;_t++){let ft=_t*F-V;for(let Rt=0;Rt<Y;Rt++){let ie=Rt*k-G;ct[S]=ie*A,ct[_]=ft*I,ct[f]=Q,l.push(ct.x,ct.y,ct.z),ct[S]=0,ct[_]=0,ct[f]=w>0?1:-1,d.push(ct.x,ct.y,ct.z),m.push(Rt/D),m.push(1-_t/v),K+=1}}for(let _t=0;_t<v;_t++)for(let ft=0;ft<D;ft++){let Rt=h+ft+Y*_t,ie=h+ft+Y*(_t+1),ye=h+(ft+1)+Y*(_t+1),Ft=h+(ft+1)+Y*_t;c.push(Rt,ie,Ft),c.push(ie,ye,Ft),rt+=6}o.addGroup(x,rt,C),x+=rt,h+=K}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var gi=class i extends Re{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,a=e/2,o=Math.floor(n),c=Math.floor(s),l=o+1,d=c+1,m=t/o,h=e/c,x=[],p=[],S=[],_=[];for(let f=0;f<d;f++){let A=f*h-a;for(let I=0;I<l;I++){let E=I*m-r;p.push(E,-A,0),S.push(0,0,1),_.push(I/o),_.push(1-f/c)}}for(let f=0;f<c;f++)for(let A=0;A<o;A++){let I=A+l*f,E=A+l*(f+1),R=A+1+l*(f+1),w=A+1+l*f;x.push(I,E,w),x.push(E,R,w)}this.setIndex(x),this.setAttribute("position",new ln(p,3)),this.setAttribute("normal",new ln(S,3)),this.setAttribute("uv",new ln(_,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}};var ca=class i extends Re{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let c=Math.min(a+o,Math.PI),l=0,d=[],m=new U,h=new U,x=[],p=[],S=[],_=[];for(let f=0;f<=n;f++){let A=[],I=f/n,E=a+I*o,R=t*Math.cos(E),w=Math.sqrt(t*t-R*R),D=0;f===0&&a===0?D=.5/e:f===n&&c===Math.PI&&(D=-.5/e);for(let v=0;v<=e;v++){let C=v/e,k=s+C*r;m.x=-w*Math.cos(k),m.y=R,m.z=w*Math.sin(k),p.push(m.x,m.y,m.z),h.copy(m).normalize(),S.push(h.x,h.y,h.z),_.push(C+D,1-I),A.push(l++)}d.push(A)}for(let f=0;f<n;f++)for(let A=0;A<e;A++){let I=d[f][A+1],E=d[f][A],R=d[f+1][A],w=d[f+1][A+1];(f!==0||a>0)&&x.push(I,E,w),(f!==n-1||c<Math.PI)&&x.push(E,R,w)}this.setIndex(x),this.setAttribute("position",new ln(p,3)),this.setAttribute("normal",new ln(S,3)),this.setAttribute("uv",new ln(_,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};function Ls(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];if(qu(s))s.isRenderTargetTexture?(Gt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone();else if(Array.isArray(s))if(qu(s[0])){let r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();t[e][n]=r}else t[e][n]=s.slice();else t[e][n]=s}}return t}function gn(i){let t={};for(let e=0;e<i.length;e++){let n=Ls(i[e]);for(let s in n)t[s]=n[s]}return t}function qu(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function gp(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Mh(i){let t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:he.workingColorSpace}var Rd={clone:Ls,merge:gn},_p=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,xp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Se=class extends Fi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=_p,this.fragmentShader=xp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ls(t.uniforms),this.uniformsGroups=gp(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let n in t.uniforms){let s=t.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=e[s.value]||null;break;case"c":this.uniforms[n].value=new kt().setHex(s.value);break;case"v2":this.uniforms[n].value=new $t().fromArray(s.value);break;case"v3":this.uniforms[n].value=new U().fromArray(s.value);break;case"v4":this.uniforms[n].value=new Le().fromArray(s.value);break;case"m3":this.uniforms[n].value=new jt().fromArray(s.value);break;case"m4":this.uniforms[n].value=new Oe().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},Uo=class extends Se{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}};var Fo=class extends Fi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=gd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Oo=class extends Fi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function uo(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}var is=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let a;e:{i:if(!(t<s)){for(let o=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=e[++n],t<s)break t}a=e.length;break e}if(!(t>=r)){let o=e[1];t<o&&(n=2,r=o);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=e[--n-1],t>=r)break t}a=n,n=0;break e}break n}for(;n<a;){let o=n+a>>>1;t<e[o]?a=o:n=o+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let a=0;a!==s;++a)e[a]=n[r+a];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Bo=class extends is{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Wc,endingEnd:Wc}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,a=t+1,o=s[r],c=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Xc:r=t,o=2*e-n;break;case qc:r=s.length-2,o=e+s[r]-s[r+1];break;default:r=t,o=n}if(c===void 0)switch(this.getSettings_().endingEnd){case Xc:a=t,c=2*n-e;break;case qc:a=1,c=n+s[1]-s[0];break;default:a=t-1,c=e}let l=(n-e)*.5,d=this.valueSize;this._weightPrev=l/(e-o),this._weightNext=l/(c-n),this._offsetPrev=r*d,this._offsetNext=a*d}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,d=this._offsetPrev,m=this._offsetNext,h=this._weightPrev,x=this._weightNext,p=(n-e)/(s-e),S=p*p,_=S*p,f=-h*_+2*h*S-h*p,A=(1+h)*_+(-1.5-2*h)*S+(-.5+h)*p+1,I=(-1-x)*_+(1.5+x)*S+.5*p,E=x*_-x*S;for(let R=0;R!==o;++R)r[R]=f*a[d+R]+A*a[l+R]+I*a[c+R]+E*a[m+R];return r}},zo=class extends is{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,d=(n-e)/(s-e),m=1-d;for(let h=0;h!==o;++h)r[h]=a[l+h]*m+a[c+h]*d;return r}},Vo=class extends is{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},ko=class extends is{interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,d=this.inTangents,m=this.outTangents;if(!d||!m){let p=(n-e)/(s-e),S=1-p;for(let _=0;_!==o;++_)r[_]=a[l+_]*S+a[c+_]*p;return r}let h=o*2,x=t-1;for(let p=0;p!==o;++p){let S=a[l+p],_=a[c+p],f=x*h+p*2,A=m[f],I=m[f+1],E=t*h+p*2,R=d[E],w=d[E+1],D=(n-e)/(s-e),v,C,k,F,G;for(let V=0;V<8;V++){v=D*D,C=v*D,k=1-D,F=k*k,G=F*k;let Y=G*e+3*F*D*A+3*k*v*R+C*s-n;if(Math.abs(Y)<1e-10)break;let it=3*F*(A-e)+6*k*D*(R-A)+3*v*(s-R);if(Math.abs(it)<1e-10)break;D=D-Y/it,D=Math.max(0,Math.min(1,D))}r[p]=G*S+3*F*D*I+3*k*v*w+C*_}return r}},zn=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=uo(e,this.TimeBufferType),this.values=uo(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:uo(t.times,Array),values:uo(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new Vo(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new zo(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Bo(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new ko(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case Jr:e=this.InterpolantFactoryMethodDiscrete;break;case To:e=this.InterpolantFactoryMethodLinear;break;case mo:e=this.InterpolantFactoryMethodSmooth;break;case Gc:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Gt("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Jr;case this.InterpolantFactoryMethodLinear:return To;case this.InterpolantFactoryMethodSmooth:return mo;case this.InterpolantFactoryMethodBezier:return Gc}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<t;)++r;for(;a!==-1&&n[a]>e;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(qt("KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(qt("KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==r;o++){let c=n[o];if(typeof c=="number"&&isNaN(c)){qt("KeyframeTrack: Time is not a valid number.",this,o,c),t=!1;break}if(a!==null&&a>c){qt("KeyframeTrack: Out of order keys.",this,o,c,a),t=!1;break}a=c}if(s!==void 0&&Uf(s))for(let o=0,c=s.length;o!==c;++o){let l=s[o];if(isNaN(l)){qt("KeyframeTrack: Value is not a valid number.",this,o,l),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===mo,r=t.length-1,a=1;for(let o=1;o<r;++o){let c=!1,l=t[o],d=t[o+1];if(l!==d&&(o!==1||l!==t[0]))if(s)c=!0;else{let m=o*n,h=m-n,x=m+n;for(let p=0;p!==n;++p){let S=e[m+p];if(S!==e[h+p]||S!==e[x+p]){c=!0;break}}}if(c){if(o!==a){t[a]=t[o];let m=o*n,h=a*n;for(let x=0;x!==n;++x)e[h+x]=e[m+x]}++a}}if(r>0){t[a]=t[r];for(let o=r*n,c=a*n,l=0;l!==n;++l)e[c+l]=e[o+l];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};zn.prototype.ValueTypeName="";zn.prototype.TimeBufferType=Float32Array;zn.prototype.ValueBufferType=Float32Array;zn.prototype.DefaultInterpolation=To;var ss=class extends zn{constructor(t,e,n){super(t,e,n)}};ss.prototype.ValueTypeName="bool";ss.prototype.ValueBufferType=Array;ss.prototype.DefaultInterpolation=Jr;ss.prototype.InterpolantFactoryMethodLinear=void 0;ss.prototype.InterpolantFactoryMethodSmooth=void 0;var Ho=class extends zn{constructor(t,e,n,s){super(t,e,n,s)}};Ho.prototype.ValueTypeName="color";var Go=class extends zn{constructor(t,e,n,s){super(t,e,n,s)}};Go.prototype.ValueTypeName="number";var Wo=class extends is{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(n-e)/(s-e),l=t*o;for(let d=l+o;l!==d;l+=4)Bn.slerpFlat(r,0,a,l-o,a,l,c);return r}},ha=class extends zn{constructor(t,e,n,s){super(t,e,n,s)}InterpolantFactoryMethodLinear(t){return new Wo(this.times,this.values,this.getValueSize(),t)}};ha.prototype.ValueTypeName="quaternion";ha.prototype.InterpolantFactoryMethodSmooth=void 0;var rs=class extends zn{constructor(t,e,n){super(t,e,n)}};rs.prototype.ValueTypeName="string";rs.prototype.ValueBufferType=Array;rs.prototype.DefaultInterpolation=Jr;rs.prototype.InterpolantFactoryMethodLinear=void 0;rs.prototype.InterpolantFactoryMethodSmooth=void 0;var Xo=class extends zn{constructor(t,e,n,s){super(t,e,n,s)}};Xo.prototype.ValueTypeName="vector";var qo=class{constructor(t,e,n){let s=this,r=!1,a=0,o=0,c,l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this._abortController=null,this.itemStart=function(d){o++,r===!1&&s.onStart!==void 0&&s.onStart(d,a,o),r=!0},this.itemEnd=function(d){a++,s.onProgress!==void 0&&s.onProgress(d,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(d){s.onError!==void 0&&s.onError(d)},this.resolveURL=function(d){return d=d.normalize("NFC"),c?c(d):d},this.setURLModifier=function(d){return c=d,this},this.addHandler=function(d,m){return l.push(d,m),this},this.removeHandler=function(d){let m=l.indexOf(d);return m!==-1&&l.splice(m,2),this},this.getHandler=function(d){for(let m=0,h=l.length;m<h;m+=2){let x=l[m],p=l[m+1];if(x.global&&(x.lastIndex=0),x.test(d))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Pd=new qo,Yo=class{constructor(t){this.manager=t!==void 0?t:Pd,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};Yo.DEFAULT_MATERIAL_NAME="__DEFAULT";var fo=new U,po=new Bn,fi=new U,ua=class extends Rn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Oe,this.projectionMatrix=new Oe,this.projectionMatrixInverse=new Oe,this.coordinateSystem=ei,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(fo,po,fi),fi.x===1&&fi.y===1&&fi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(fo,po,fi.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(fo,po,fi),fi.x===1&&fi.y===1&&fi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(fo,po,fi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Ji=new U,Yu=new $t,Zu=new $t,pn=class extends ua{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=fr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Zr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return fr*2*Math.atan(Math.tan(Zr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Ji.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Ji.x,Ji.y).multiplyScalar(-t/Ji.z),Ji.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ji.x,Ji.y).multiplyScalar(-t/Ji.z)}getViewSize(t,e){return this.getViewBounds(t,Yu,Zu),e.subVectors(Zu,Yu)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Zr*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,e-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}let o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}};var Rs=class extends ua{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,a=n+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=d*this.view.offsetY,c=o-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}};var ar=-90,or=1,Zo=class extends Rn{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new pn(ar,or,t,e);s.layers=this.layers,this.add(s);let r=new pn(ar,or,t,e);r.layers=this.layers,this.add(r);let a=new pn(ar,or,t,e);a.layers=this.layers,this.add(a);let o=new pn(ar,or,t,e);o.layers=this.layers,this.add(o);let c=new pn(ar,or,t,e);c.layers=this.layers,this.add(c);let l=new pn(ar,or,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,c]=e;for(let l of e)this.remove(l);if(t===ei)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Qr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,c,l,d]=this.children,m=t.getRenderTarget(),h=t.getActiveCubeFace(),x=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;let S=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let _=!1;t.isWebGLRenderer===!0?_=t.state.buffers.depth.getReversed():_=t.reversedDepthBuffer,t.setRenderTarget(n,0,s),_&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,s),_&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,2,s),_&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,3,s),_&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),t.setRenderTarget(n,4,s),_&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),n.texture.generateMipmaps=S,t.setRenderTarget(n,5,s),_&&t.autoClear===!1&&t.clearDepth(),t.render(e,d),t.setRenderTarget(m,h,x),t.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},$o=class extends pn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var bh="\\[\\]\\.:\\/",vp=new RegExp("["+bh+"]","g"),Sh="[^"+bh+"]",yp="[^"+bh.replace("\\.","")+"]",Mp=/((?:WC+[\/:])*)/.source.replace("WC",Sh),bp=/(WCOD+)?/.source.replace("WCOD",yp),Sp=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Sh),Ep=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Sh),Tp=new RegExp("^"+Mp+bp+Sp+Ep+"$"),Ap=["material","materials","bones","map"],Jc=class{constructor(t,e,n){let s=n||Ie.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},Ie=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(vp,"")}static parseTrackName(t){let e=Tp.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Ap.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===e||o.uuid===e)return o;let c=n(o.children);if(c)return c}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Gt("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=e.objectIndex;switch(n){case"materials":if(!t.material){qt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){qt("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){qt("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let d=0;d<t.length;d++)if(t[d].name===l){l=d;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){qt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){qt("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){qt("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(l!==void 0){if(t[l]===void 0){qt("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}let a=t[s];if(a===void 0){let l=e.nodeName;qt("PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?o=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){qt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){qt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ie.Composite=Jc;Ie.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Ie.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Ie.prototype.GetterByBindingType=[Ie.prototype._getValue_direct,Ie.prototype._getValue_array,Ie.prototype._getValue_arrayElement,Ie.prototype._getValue_toArray];Ie.prototype.SetterByBindingTypeAndVersioning=[[Ie.prototype._setValue_direct,Ie.prototype._setValue_direct_setNeedsUpdate,Ie.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ie.prototype._setValue_array,Ie.prototype._setValue_array_setNeedsUpdate,Ie.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ie.prototype._setValue_arrayElement,Ie.prototype._setValue_arrayElement_setNeedsUpdate,Ie.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ie.prototype._setValue_fromArray,Ie.prototype._setValue_fromArray_setNeedsUpdate,Ie.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Ux=new Float32Array(1);var yr=class{constructor(t=1,e=0,n=0){this.radius=t,this.phi=e,this.theta=n}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=re(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(re(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var Rh=class Rh{constructor(t,e,n,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,s){let r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=s,this}};Rh.prototype.isMatrix2=!0;var Kc=Rh;var da=class extends ni{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){if(t===void 0){Gt("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}};function Eh(i,t,e,n){let s=wp(n);switch(e){case ph:return i*t;case gh:return i*t/s.components*s.byteLength;case il:return i*t/s.components*s.byteLength;case hs:return i*t*2/s.components*s.byteLength;case sl:return i*t*2/s.components*s.byteLength;case mh:return i*t*3/s.components*s.byteLength;case Jn:return i*t*4/s.components*s.byteLength;case rl:return i*t*4/s.components*s.byteLength;case ga:case _a:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case xa:case va:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ol:case cl:return Math.max(i,16)*Math.max(t,8)/4;case al:case ll:return Math.max(i,8)*Math.max(t,8)/2;case hl:case ul:case fl:case pl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case dl:case ya:case ml:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case gl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case _l:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case xl:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case vl:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case yl:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Ml:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case bl:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Sl:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case El:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Tl:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Al:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case wl:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Cl:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Rl:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Pl:case Il:case Ll:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Dl:case Nl:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Ma:case Ul:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function wp(i){switch(i){case Sn:case hh:return{byteLength:1,components:1};case Sr:case uh:case $n:return{byteLength:2,components:1};case el:case nl:return{byteLength:2,components:4};case ri:case tl:case ai:return{byteLength:4,components:1};case dh:case fh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"185"}}));typeof window<"u"&&(window.__THREE__?Gt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="185");function Qd(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&i!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Rp(i){let t=new WeakMap;function e(o,c){let l=o.array,d=o.usage,m=l.byteLength,h=i.createBuffer();i.bindBuffer(c,h),i.bufferData(c,l,d),o.onUploadCallback();let x;if(l instanceof Float32Array)x=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)x=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?x=i.HALF_FLOAT:x=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)x=i.SHORT;else if(l instanceof Uint32Array)x=i.UNSIGNED_INT;else if(l instanceof Int32Array)x=i.INT;else if(l instanceof Int8Array)x=i.BYTE;else if(l instanceof Uint8Array)x=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)x=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:h,type:x,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:m}}function n(o,c,l){let d=c.array,m=c.updateRanges;if(i.bindBuffer(l,o),m.length===0)i.bufferSubData(l,0,d);else{m.sort((x,p)=>x.start-p.start);let h=0;for(let x=1;x<m.length;x++){let p=m[h],S=m[x];S.start<=p.start+p.count+1?p.count=Math.max(p.count,S.start+S.count-p.start):(++h,m[h]=S)}m.length=h+1;for(let x=0,p=m.length;x<p;x++){let S=m[x];i.bufferSubData(l,S.start*d.BYTES_PER_ELEMENT,d,S.start,S.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let c=t.get(o);c&&(i.deleteBuffer(c.buffer),t.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let d=t.get(o);(!d||d.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var Pp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ip=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Lp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Dp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Np=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Up=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Fp=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Op=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Bp=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,zp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Vp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,kp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Hp=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Gp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Wp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Xp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,qp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Yp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Zp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,$p=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Jp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Kp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,jp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Qp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,tm=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,em=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,nm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,im=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,sm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,rm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,am="gl_FragColor = linearToOutputTexel( gl_FragColor );",om=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,lm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,cm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,hm=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,um=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,dm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,pm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,mm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,gm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,_m=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,xm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,vm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ym=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Mm=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,bm=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Sm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Em=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Tm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Am=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,wm=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Cm=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Rm=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Pm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Im=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Lm=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Dm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Nm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Um=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Fm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Om=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Bm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,zm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Vm=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,km=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Hm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Gm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Wm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Xm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,qm=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Ym=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Zm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,$m=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Jm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Km=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,jm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Qm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,tg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,eg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,ng=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ig=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,sg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,rg=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,ag=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,og=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,lg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,cg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,hg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ug=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,dg=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,fg=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,pg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,mg=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,gg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,_g=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,xg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,vg=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,yg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Mg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,bg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Sg=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Eg=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Tg=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Ag=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,wg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Cg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Rg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Pg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Ig=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Lg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Dg=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ng=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ug=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Fg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Og=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Bg=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,zg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Vg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,kg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Hg=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Gg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Wg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Xg=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qg=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Yg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Zg=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,$g=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Jg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Kg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,jg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Qg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,t0=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,e0=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,n0=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,i0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,s0=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,r0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,a0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,o0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,l0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,c0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ne={alphahash_fragment:Pp,alphahash_pars_fragment:Ip,alphamap_fragment:Lp,alphamap_pars_fragment:Dp,alphatest_fragment:Np,alphatest_pars_fragment:Up,aomap_fragment:Fp,aomap_pars_fragment:Op,batching_pars_vertex:Bp,batching_vertex:zp,begin_vertex:Vp,beginnormal_vertex:kp,bsdfs:Hp,iridescence_fragment:Gp,bumpmap_pars_fragment:Wp,clipping_planes_fragment:Xp,clipping_planes_pars_fragment:qp,clipping_planes_pars_vertex:Yp,clipping_planes_vertex:Zp,color_fragment:$p,color_pars_fragment:Jp,color_pars_vertex:Kp,color_vertex:jp,common:Qp,cube_uv_reflection_fragment:tm,defaultnormal_vertex:em,displacementmap_pars_vertex:nm,displacementmap_vertex:im,emissivemap_fragment:sm,emissivemap_pars_fragment:rm,colorspace_fragment:am,colorspace_pars_fragment:om,envmap_fragment:lm,envmap_common_pars_fragment:cm,envmap_pars_fragment:hm,envmap_pars_vertex:um,envmap_physical_pars_fragment:bm,envmap_vertex:dm,fog_vertex:fm,fog_pars_vertex:pm,fog_fragment:mm,fog_pars_fragment:gm,gradientmap_pars_fragment:_m,lightmap_pars_fragment:xm,lights_lambert_fragment:vm,lights_lambert_pars_fragment:ym,lights_pars_begin:Mm,lights_toon_fragment:Sm,lights_toon_pars_fragment:Em,lights_phong_fragment:Tm,lights_phong_pars_fragment:Am,lights_physical_fragment:wm,lights_physical_pars_fragment:Cm,lights_fragment_begin:Rm,lights_fragment_maps:Pm,lights_fragment_end:Im,lightprobes_pars_fragment:Lm,logdepthbuf_fragment:Dm,logdepthbuf_pars_fragment:Nm,logdepthbuf_pars_vertex:Um,logdepthbuf_vertex:Fm,map_fragment:Om,map_pars_fragment:Bm,map_particle_fragment:zm,map_particle_pars_fragment:Vm,metalnessmap_fragment:km,metalnessmap_pars_fragment:Hm,morphinstance_vertex:Gm,morphcolor_vertex:Wm,morphnormal_vertex:Xm,morphtarget_pars_vertex:qm,morphtarget_vertex:Ym,normal_fragment_begin:Zm,normal_fragment_maps:$m,normal_pars_fragment:Jm,normal_pars_vertex:Km,normal_vertex:jm,normalmap_pars_fragment:Qm,clearcoat_normal_fragment_begin:tg,clearcoat_normal_fragment_maps:eg,clearcoat_pars_fragment:ng,iridescence_pars_fragment:ig,opaque_fragment:sg,packing:rg,premultiplied_alpha_fragment:ag,project_vertex:og,dithering_fragment:lg,dithering_pars_fragment:cg,roughnessmap_fragment:hg,roughnessmap_pars_fragment:ug,shadowmap_pars_fragment:dg,shadowmap_pars_vertex:fg,shadowmap_vertex:pg,shadowmask_pars_fragment:mg,skinbase_vertex:gg,skinning_pars_vertex:_g,skinning_vertex:xg,skinnormal_vertex:vg,specularmap_fragment:yg,specularmap_pars_fragment:Mg,tonemapping_fragment:bg,tonemapping_pars_fragment:Sg,transmission_fragment:Eg,transmission_pars_fragment:Tg,uv_pars_fragment:Ag,uv_pars_vertex:wg,uv_vertex:Cg,worldpos_vertex:Rg,background_vert:Pg,background_frag:Ig,backgroundCube_vert:Lg,backgroundCube_frag:Dg,cube_vert:Ng,cube_frag:Ug,depth_vert:Fg,depth_frag:Og,distance_vert:Bg,distance_frag:zg,equirect_vert:Vg,equirect_frag:kg,linedashed_vert:Hg,linedashed_frag:Gg,meshbasic_vert:Wg,meshbasic_frag:Xg,meshlambert_vert:qg,meshlambert_frag:Yg,meshmatcap_vert:Zg,meshmatcap_frag:$g,meshnormal_vert:Jg,meshnormal_frag:Kg,meshphong_vert:jg,meshphong_frag:Qg,meshphysical_vert:t0,meshphysical_frag:e0,meshtoon_vert:n0,meshtoon_frag:i0,points_vert:s0,points_frag:r0,shadow_vert:a0,shadow_frag:o0,sprite_vert:l0,sprite_frag:c0},At={common:{diffuse:{value:new kt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new jt},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new jt}},envmap:{envMap:{value:null},envMapRotation:{value:new jt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new jt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new jt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new jt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new jt},normalScale:{value:new $t(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new jt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new jt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new jt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new jt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new kt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new U},probesMax:{value:new U},probesResolution:{value:new U}},points:{diffuse:{value:new kt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0},uvTransform:{value:new jt}},sprite:{diffuse:{value:new kt(16777215)},opacity:{value:1},center:{value:new $t(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new jt},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0}}},yi={basic:{uniforms:gn([At.common,At.specularmap,At.envmap,At.aomap,At.lightmap,At.fog]),vertexShader:ne.meshbasic_vert,fragmentShader:ne.meshbasic_frag},lambert:{uniforms:gn([At.common,At.specularmap,At.envmap,At.aomap,At.lightmap,At.emissivemap,At.bumpmap,At.normalmap,At.displacementmap,At.fog,At.lights,{emissive:{value:new kt(0)},envMapIntensity:{value:1}}]),vertexShader:ne.meshlambert_vert,fragmentShader:ne.meshlambert_frag},phong:{uniforms:gn([At.common,At.specularmap,At.envmap,At.aomap,At.lightmap,At.emissivemap,At.bumpmap,At.normalmap,At.displacementmap,At.fog,At.lights,{emissive:{value:new kt(0)},specular:{value:new kt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ne.meshphong_vert,fragmentShader:ne.meshphong_frag},standard:{uniforms:gn([At.common,At.envmap,At.aomap,At.lightmap,At.emissivemap,At.bumpmap,At.normalmap,At.displacementmap,At.roughnessmap,At.metalnessmap,At.fog,At.lights,{emissive:{value:new kt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ne.meshphysical_vert,fragmentShader:ne.meshphysical_frag},toon:{uniforms:gn([At.common,At.aomap,At.lightmap,At.emissivemap,At.bumpmap,At.normalmap,At.displacementmap,At.gradientmap,At.fog,At.lights,{emissive:{value:new kt(0)}}]),vertexShader:ne.meshtoon_vert,fragmentShader:ne.meshtoon_frag},matcap:{uniforms:gn([At.common,At.bumpmap,At.normalmap,At.displacementmap,At.fog,{matcap:{value:null}}]),vertexShader:ne.meshmatcap_vert,fragmentShader:ne.meshmatcap_frag},points:{uniforms:gn([At.points,At.fog]),vertexShader:ne.points_vert,fragmentShader:ne.points_frag},dashed:{uniforms:gn([At.common,At.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ne.linedashed_vert,fragmentShader:ne.linedashed_frag},depth:{uniforms:gn([At.common,At.displacementmap]),vertexShader:ne.depth_vert,fragmentShader:ne.depth_frag},normal:{uniforms:gn([At.common,At.bumpmap,At.normalmap,At.displacementmap,{opacity:{value:1}}]),vertexShader:ne.meshnormal_vert,fragmentShader:ne.meshnormal_frag},sprite:{uniforms:gn([At.sprite,At.fog]),vertexShader:ne.sprite_vert,fragmentShader:ne.sprite_frag},background:{uniforms:{uvTransform:{value:new jt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ne.background_vert,fragmentShader:ne.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new jt}},vertexShader:ne.backgroundCube_vert,fragmentShader:ne.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ne.cube_vert,fragmentShader:ne.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ne.equirect_vert,fragmentShader:ne.equirect_frag},distance:{uniforms:gn([At.common,At.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ne.distance_vert,fragmentShader:ne.distance_frag},shadow:{uniforms:gn([At.lights,At.fog,{color:{value:new kt(0)},opacity:{value:1}}]),vertexShader:ne.shadow_vert,fragmentShader:ne.shadow_frag}};yi.physical={uniforms:gn([yi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new jt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new jt},clearcoatNormalScale:{value:new $t(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new jt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new jt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new jt},sheen:{value:0},sheenColor:{value:new kt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new jt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new jt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new jt},transmissionSamplerSize:{value:new $t},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new jt},attenuationDistance:{value:0},attenuationColor:{value:new kt(0)},specularColor:{value:new kt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new jt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new jt},anisotropyVector:{value:new $t},anisotropyMap:{value:null},anisotropyMapTransform:{value:new jt}}]),vertexShader:ne.meshphysical_vert,fragmentShader:ne.meshphysical_frag};var Bl={r:0,b:0,g:0},h0=new Oe,tf=new jt;tf.set(-1,0,0,0,1,0,0,0,1);function u0(i,t,e,n,s,r){let a=new kt(0),o=s===!0?0:1,c,l,d=null,m=0,h=null;function x(A){let I=A.isScene===!0?A.background:null;if(I&&I.isTexture){let E=A.backgroundBlurriness>0;I=t.get(I,E)}return I}function p(A){let I=!1,E=x(A);E===null?_(a,o):E&&E.isColor&&(_(E,1),I=!0);let R=i.xr.getEnvironmentBlendMode();R==="additive"?e.buffers.color.setClear(0,0,0,1,r):R==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(i.autoClear||I)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function S(A,I){let E=x(I);E&&(E.isCubeTexture||E.mapping===pa)?(l===void 0&&(l=new $e(new vr(1,1,1),new Se({name:"BackgroundCubeMaterial",uniforms:Ls(yi.backgroundCube.uniforms),vertexShader:yi.backgroundCube.vertexShader,fragmentShader:yi.backgroundCube.fragmentShader,side:cn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(R,w,D){this.matrixWorld.copyPosition(D.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(l)),l.material.uniforms.envMap.value=E,l.material.uniforms.backgroundBlurriness.value=I.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=I.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(h0.makeRotationFromEuler(I.backgroundRotation)).transpose(),E.isCubeTexture&&E.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(tf),l.material.toneMapped=he.getTransfer(E.colorSpace)!==ve,(d!==E||m!==E.version||h!==i.toneMapping)&&(l.material.needsUpdate=!0,d=E,m=E.version,h=i.toneMapping),l.layers.enableAll(),A.unshift(l,l.geometry,l.material,0,0,null)):E&&E.isTexture&&(c===void 0&&(c=new $e(new gi(2,2),new Se({name:"BackgroundMaterial",uniforms:Ls(yi.background.uniforms),vertexShader:yi.background.vertexShader,fragmentShader:yi.background.fragmentShader,side:Ui,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=E,c.material.uniforms.backgroundIntensity.value=I.backgroundIntensity,c.material.toneMapped=he.getTransfer(E.colorSpace)!==ve,E.matrixAutoUpdate===!0&&E.updateMatrix(),c.material.uniforms.uvTransform.value.copy(E.matrix),(d!==E||m!==E.version||h!==i.toneMapping)&&(c.material.needsUpdate=!0,d=E,m=E.version,h=i.toneMapping),c.layers.enableAll(),A.unshift(c,c.geometry,c.material,0,0,null))}function _(A,I){A.getRGB(Bl,Mh(i)),e.buffers.color.setClear(Bl.r,Bl.g,Bl.b,I,r)}function f(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(A,I=1){a.set(A),o=I,_(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(A){o=A,_(a,o)},render:p,addToRenderList:S,dispose:f}}function d0(i,t){let e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=h(null),r=s,a=!1;function o(F,G,V,Q,Y){let it=!1,K=m(F,Q,V,G);r!==K&&(r=K,l(r.object)),it=x(F,Q,V,Y),it&&p(F,Q,V,Y),Y!==null&&t.update(Y,i.ELEMENT_ARRAY_BUFFER),(it||a)&&(a=!1,E(F,G,V,Q),Y!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(Y).buffer))}function c(){return i.createVertexArray()}function l(F){return i.bindVertexArray(F)}function d(F){return i.deleteVertexArray(F)}function m(F,G,V,Q){let Y=Q.wireframe===!0,it=n[G.id];it===void 0&&(it={},n[G.id]=it);let K=F.isInstancedMesh===!0?F.id:0,rt=it[K];rt===void 0&&(rt={},it[K]=rt);let ct=rt[V.id];ct===void 0&&(ct={},rt[V.id]=ct);let _t=ct[Y];return _t===void 0&&(_t=h(c()),ct[Y]=_t),_t}function h(F){let G=[],V=[],Q=[];for(let Y=0;Y<e;Y++)G[Y]=0,V[Y]=0,Q[Y]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:G,enabledAttributes:V,attributeDivisors:Q,object:F,attributes:{},index:null}}function x(F,G,V,Q){let Y=r.attributes,it=G.attributes,K=0,rt=V.getAttributes();for(let ct in rt)if(rt[ct].location>=0){let ft=Y[ct],Rt=it[ct];if(Rt===void 0&&(ct==="instanceMatrix"&&F.instanceMatrix&&(Rt=F.instanceMatrix),ct==="instanceColor"&&F.instanceColor&&(Rt=F.instanceColor)),ft===void 0||ft.attribute!==Rt||Rt&&ft.data!==Rt.data)return!0;K++}return r.attributesNum!==K||r.index!==Q}function p(F,G,V,Q){let Y={},it=G.attributes,K=0,rt=V.getAttributes();for(let ct in rt)if(rt[ct].location>=0){let ft=it[ct];ft===void 0&&(ct==="instanceMatrix"&&F.instanceMatrix&&(ft=F.instanceMatrix),ct==="instanceColor"&&F.instanceColor&&(ft=F.instanceColor));let Rt={};Rt.attribute=ft,ft&&ft.data&&(Rt.data=ft.data),Y[ct]=Rt,K++}r.attributes=Y,r.attributesNum=K,r.index=Q}function S(){let F=r.newAttributes;for(let G=0,V=F.length;G<V;G++)F[G]=0}function _(F){f(F,0)}function f(F,G){let V=r.newAttributes,Q=r.enabledAttributes,Y=r.attributeDivisors;V[F]=1,Q[F]===0&&(i.enableVertexAttribArray(F),Q[F]=1),Y[F]!==G&&(i.vertexAttribDivisor(F,G),Y[F]=G)}function A(){let F=r.newAttributes,G=r.enabledAttributes;for(let V=0,Q=G.length;V<Q;V++)G[V]!==F[V]&&(i.disableVertexAttribArray(V),G[V]=0)}function I(F,G,V,Q,Y,it,K){K===!0?i.vertexAttribIPointer(F,G,V,Y,it):i.vertexAttribPointer(F,G,V,Q,Y,it)}function E(F,G,V,Q){S();let Y=Q.attributes,it=V.getAttributes(),K=G.defaultAttributeValues;for(let rt in it){let ct=it[rt];if(ct.location>=0){let _t=Y[rt];if(_t===void 0&&(rt==="instanceMatrix"&&F.instanceMatrix&&(_t=F.instanceMatrix),rt==="instanceColor"&&F.instanceColor&&(_t=F.instanceColor)),_t!==void 0){let ft=_t.normalized,Rt=_t.itemSize,ie=t.get(_t);if(ie===void 0)continue;let ye=ie.buffer,Ft=ie.type,tt=ie.bytesPerElement,mt=Ft===i.INT||Ft===i.UNSIGNED_INT||_t.gpuType===tl;if(_t.isInterleavedBufferAttribute){let at=_t.data,Xt=at.stride,Jt=_t.offset;if(at.isInstancedInterleavedBuffer){for(let Et=0;Et<ct.locationSize;Et++)f(ct.location+Et,at.meshPerAttribute);F.isInstancedMesh!==!0&&Q._maxInstanceCount===void 0&&(Q._maxInstanceCount=at.meshPerAttribute*at.count)}else for(let Et=0;Et<ct.locationSize;Et++)_(ct.location+Et);i.bindBuffer(i.ARRAY_BUFFER,ye);for(let Et=0;Et<ct.locationSize;Et++)I(ct.location+Et,Rt/ct.locationSize,Ft,ft,Xt*tt,(Jt+Rt/ct.locationSize*Et)*tt,mt)}else{if(_t.isInstancedBufferAttribute){for(let at=0;at<ct.locationSize;at++)f(ct.location+at,_t.meshPerAttribute);F.isInstancedMesh!==!0&&Q._maxInstanceCount===void 0&&(Q._maxInstanceCount=_t.meshPerAttribute*_t.count)}else for(let at=0;at<ct.locationSize;at++)_(ct.location+at);i.bindBuffer(i.ARRAY_BUFFER,ye);for(let at=0;at<ct.locationSize;at++)I(ct.location+at,Rt/ct.locationSize,Ft,ft,Rt*tt,Rt/ct.locationSize*at*tt,mt)}}else if(K!==void 0){let ft=K[rt];if(ft!==void 0)switch(ft.length){case 2:i.vertexAttrib2fv(ct.location,ft);break;case 3:i.vertexAttrib3fv(ct.location,ft);break;case 4:i.vertexAttrib4fv(ct.location,ft);break;default:i.vertexAttrib1fv(ct.location,ft)}}}}A()}function R(){C();for(let F in n){let G=n[F];for(let V in G){let Q=G[V];for(let Y in Q){let it=Q[Y];for(let K in it)d(it[K].object),delete it[K];delete Q[Y]}}delete n[F]}}function w(F){if(n[F.id]===void 0)return;let G=n[F.id];for(let V in G){let Q=G[V];for(let Y in Q){let it=Q[Y];for(let K in it)d(it[K].object),delete it[K];delete Q[Y]}}delete n[F.id]}function D(F){for(let G in n){let V=n[G];for(let Q in V){let Y=V[Q];if(Y[F.id]===void 0)continue;let it=Y[F.id];for(let K in it)d(it[K].object),delete it[K];delete Y[F.id]}}}function v(F){for(let G in n){let V=n[G],Q=F.isInstancedMesh===!0?F.id:0,Y=V[Q];if(Y!==void 0){for(let it in Y){let K=Y[it];for(let rt in K)d(K[rt].object),delete K[rt];delete Y[it]}delete V[Q],Object.keys(V).length===0&&delete n[G]}}}function C(){k(),a=!0,r!==s&&(r=s,l(r.object))}function k(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:C,resetDefaultState:k,dispose:R,releaseStatesOfGeometry:w,releaseStatesOfObject:v,releaseStatesOfProgram:D,initAttributes:S,enableAttribute:_,disableUnusedAttributes:A}}function f0(i,t,e){let n;function s(c){n=c}function r(c,l){i.drawArrays(n,c,l),e.update(l,n,1)}function a(c,l,d){d!==0&&(i.drawArraysInstanced(n,c,l,d),e.update(l,n,d))}function o(c,l,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,l,0,d);let h=0;for(let x=0;x<d;x++)h+=l[x];e.update(h,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function p0(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let D=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(D.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(D){return!(D!==Jn&&n.convert(D)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(D){let v=D===$n&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(D!==Sn&&n.convert(D)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&D!==ai&&!v)}function c(D){if(D==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";D="mediump"}return D==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp",d=c(l);d!==l&&(Gt("WebGLRenderer:",l,"not supported, using",d,"instead."),l=d);let m=e.logarithmicDepthBuffer===!0,h=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&h===!1&&Gt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let x=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),S=i.getParameter(i.MAX_TEXTURE_SIZE),_=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),A=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),I=i.getParameter(i.MAX_VARYING_VECTORS),E=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),R=i.getParameter(i.MAX_SAMPLES),w=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:m,reversedDepthBuffer:h,maxTextures:x,maxVertexTextures:p,maxTextureSize:S,maxCubemapSize:_,maxAttributes:f,maxVertexUniforms:A,maxVaryings:I,maxFragmentUniforms:E,maxSamples:R,samples:w}}function m0(i){let t=this,e=null,n=0,s=!1,r=!1,a=new Zn,o=new jt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(m,h){let x=m.length!==0||h||n!==0||s;return s=h,n=m.length,x},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(m,h){e=d(m,h,0)},this.setState=function(m,h,x){let p=m.clippingPlanes,S=m.clipIntersection,_=m.clipShadows,f=i.get(m);if(!s||p===null||p.length===0||r&&!_)r?d(null):l();else{let A=r?0:n,I=A*4,E=f.clippingState||null;c.value=E,E=d(p,h,I,x);for(let R=0;R!==I;++R)E[R]=e[R];f.clippingState=E,this.numIntersection=S?this.numPlanes:0,this.numPlanes+=A}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function d(m,h,x,p){let S=m!==null?m.length:0,_=null;if(S!==0){if(_=c.value,p!==!0||_===null){let f=x+S*4,A=h.matrixWorldInverse;o.getNormalMatrix(A),(_===null||_.length<f)&&(_=new Float32Array(f));for(let I=0,E=x;I!==S;++I,E+=4)a.copy(m[I]).applyMatrix4(A,o),a.normal.toArray(_,E),_[E+3]=a.constant}c.value=_,c.needsUpdate=!0}return t.numPlanes=S,t.numIntersection=0,_}}var us=4,Id=[.125,.215,.35,.446,.526,.582],Ds=20,g0=256,ba=new Rs,Ld=new kt,Ph=null,Ih=0,Lh=0,Dh=!1,_0=new U,Vl=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,s=100,r={}){let{size:a=256,position:o=_0}=r;Ph=this._renderer.getRenderTarget(),Ih=this._renderer.getActiveCubeFace(),Lh=this._renderer.getActiveMipmapLevel(),Dh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,n,s,c,o),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ud(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Nd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(Ph,Ih,Lh),this._renderer.xr.enabled=Dh,t.scissorTest=!1,Ar(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ls||t.mapping===Is?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ph=this._renderer.getRenderTarget(),Ih=this._renderer.getActiveCubeFace(),Lh=this._renderer.getActiveMipmapLevel(),Dh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Ue,minFilter:Ue,generateMipmaps:!1,type:$n,format:Jn,colorSpace:Kr,depthBuffer:!1},s=Dd(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Dd(t,e,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=x0(r)),this._blurMaterial=y0(r,t,e),this._ggxMaterial=v0(r,t,e)}return s}_compileMaterial(t){let e=new $e(new Re,t);this._renderer.compile(e,ba)}_sceneToCubeUV(t,e,n,s,r){let c=new pn(90,1,e,n),l=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],m=this._renderer,h=m.autoClear,x=m.toneMapping;m.getClearColor(Ld),m.toneMapping=ii,m.autoClear=!1,m.state.buffers.depth.getReversed()&&(m.setRenderTarget(s),m.clearDepth(),m.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new $e(new vr,new ra({name:"PMREM.Background",side:cn,depthWrite:!1,depthTest:!1})));let S=this._backgroundBox,_=S.material,f=!1,A=t.background;A?A.isColor&&(_.color.copy(A),t.background=null,f=!0):(_.color.copy(Ld),f=!0);for(let I=0;I<6;I++){let E=I%3;E===0?(c.up.set(0,l[I],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+d[I],r.y,r.z)):E===1?(c.up.set(0,0,l[I]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+d[I],r.z)):(c.up.set(0,l[I],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+d[I]));let R=this._cubeSize;Ar(s,E*R,I>2?R:0,R,R),m.setRenderTarget(s),f&&m.render(S,c),m.render(t,c)}m.toneMapping=x,m.autoClear=h,t.background=A}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===ls||t.mapping===Is;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ud()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Nd());let r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=t;let c=this._cubeSize;Ar(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,ba)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){let s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let c=a.uniforms,l=n/(this._lodMeshes.length-1),d=e/(this._lodMeshes.length-1),m=Math.sqrt(l*l-d*d),h=0+l*1.25,x=m*h,{_lodMax:p}=this,S=this._sizeLods[n],_=3*S*(n>p-us?n-p+us:0),f=4*(this._cubeSize-S);c.envMap.value=t.texture,c.roughness.value=x,c.mipInt.value=p-e,Ar(r,_,f,3*S,2*S),s.setRenderTarget(r),s.render(o,ba),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=p-n,Ar(t,_,f,3*S,2*S),s.setRenderTarget(t),s.render(o,ba)}_blur(t,e,n,s,r){let a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){let c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&qt("blur direction must be either latitudinal or longitudinal!");let d=3,m=this._lodMeshes[s];m.material=l;let h=l.uniforms,x=this._sizeLods[n]-1,p=isFinite(r)?Math.PI/(2*x):2*Math.PI/(2*Ds-1),S=r/p,_=isFinite(r)?1+Math.floor(d*S):Ds;_>Ds&&Gt(`sigmaRadians, ${r}, is too large and will clip, as it requested ${_} samples when the maximum is set to ${Ds}`);let f=[],A=0;for(let D=0;D<Ds;++D){let v=D/S,C=Math.exp(-v*v/2);f.push(C),D===0?A+=C:D<_&&(A+=2*C)}for(let D=0;D<f.length;D++)f[D]=f[D]/A;h.envMap.value=t.texture,h.samples.value=_,h.weights.value=f,h.latitudinal.value=a==="latitudinal",o&&(h.poleAxis.value=o);let{_lodMax:I}=this;h.dTheta.value=p,h.mipInt.value=I-n;let E=this._sizeLods[s],R=3*E*(s>I-us?s-I+us:0),w=4*(this._cubeSize-E);Ar(e,R,w,3*E,2*E),c.setRenderTarget(e),c.render(m,ba)}};function x0(i){let t=[],e=[],n=[],s=i,r=i-us+1+Id.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);t.push(o);let c=1/o;a>i-us?c=Id[a-i+us-1]:a===0&&(c=0),e.push(c);let l=1/(o-2),d=-l,m=1+l,h=[d,d,m,d,m,m,d,d,m,m,d,m],x=6,p=6,S=3,_=2,f=1,A=new Float32Array(S*p*x),I=new Float32Array(_*p*x),E=new Float32Array(f*p*x);for(let w=0;w<x;w++){let D=w%3*2/3-1,v=w>2?0:-1,C=[D,v,0,D+2/3,v,0,D+2/3,v+1,0,D,v,0,D+2/3,v+1,0,D,v+1,0];A.set(C,S*p*w),I.set(h,_*p*w);let k=[w,w,w,w,w,w];E.set(k,f*p*w)}let R=new Re;R.setAttribute("position",new Qt(A,S)),R.setAttribute("uv",new Qt(I,_)),R.setAttribute("faceIndex",new Qt(E,f)),n.push(new $e(R,null)),s>us&&s--}return{lodMeshes:n,sizeLods:t,sigmas:e}}function Dd(i,t,e){let n=new mn(i,t,e);return n.texture.mapping=pa,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ar(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function v0(i,t,e){return new Se({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:g0,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Gl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:_i,depthTest:!1,depthWrite:!1})}function y0(i,t,e){let n=new Float32Array(Ds),s=new U(0,1,0);return new Se({name:"SphericalGaussianBlur",defines:{n:Ds,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Gl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:_i,depthTest:!1,depthWrite:!1})}function Nd(){return new Se({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Gl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:_i,depthTest:!1,depthWrite:!1})}function Ud(){return new Se({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Gl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:_i,depthTest:!1,depthWrite:!1})}function Gl(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}var kl=class extends mn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new oa(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new vr(5,5,5),r=new Se({name:"CubemapFromEquirect",uniforms:Ls(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:cn,blending:_i});r.uniforms.tEquirect.value=e;let a=new $e(s,r),o=e.minFilter;return e.minFilter===si&&(e.minFilter=Ue),new Zo(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){let r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}};function M0(i){let t=new WeakMap,e=new WeakMap,n=null;function s(h,x=!1){return h==null?null:x?a(h):r(h)}function r(h){if(h&&h.isTexture){let x=h.mapping;if(x===Ko||x===jo)if(t.has(h)){let p=t.get(h).texture;return o(p,h.mapping)}else{let p=h.image;if(p&&p.height>0){let S=new kl(p.height);return S.fromEquirectangularTexture(i,h),t.set(h,S),h.addEventListener("dispose",l),o(S.texture,h.mapping)}else return null}}return h}function a(h){if(h&&h.isTexture){let x=h.mapping,p=x===Ko||x===jo,S=x===ls||x===Is;if(p||S){let _=e.get(h),f=_!==void 0?_.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==f)return n===null&&(n=new Vl(i)),_=p?n.fromEquirectangular(h,_):n.fromCubemap(h,_),_.texture.pmremVersion=h.pmremVersion,e.set(h,_),_.texture;if(_!==void 0)return _.texture;{let A=h.image;return p&&A&&A.height>0||S&&A&&c(A)?(n===null&&(n=new Vl(i)),_=p?n.fromEquirectangular(h):n.fromCubemap(h),_.texture.pmremVersion=h.pmremVersion,e.set(h,_),h.addEventListener("dispose",d),_.texture):null}}}return h}function o(h,x){return x===Ko?h.mapping=ls:x===jo&&(h.mapping=Is),h}function c(h){let x=0,p=6;for(let S=0;S<p;S++)h[S]!==void 0&&x++;return x===p}function l(h){let x=h.target;x.removeEventListener("dispose",l);let p=t.get(x);p!==void 0&&(t.delete(x),p.dispose())}function d(h){let x=h.target;x.removeEventListener("dispose",d);let p=e.get(x);p!==void 0&&(e.delete(x),p.dispose())}function m(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:m}}function b0(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s=i.getExtension(n);return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let s=e(n);return s===null&&Ts("WebGLRenderer: "+n+" extension not supported."),s}}}function S0(i,t,e,n){let s={},r=new WeakMap;function a(m){let h=m.target;h.index!==null&&t.remove(h.index);for(let p in h.attributes)t.remove(h.attributes[p]);h.removeEventListener("dispose",a),delete s[h.id];let x=r.get(h);x&&(t.remove(x),r.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,e.memory.geometries--}function o(m,h){return s[h.id]===!0||(h.addEventListener("dispose",a),s[h.id]=!0,e.memory.geometries++),h}function c(m){let h=m.attributes;for(let x in h)t.update(h[x],i.ARRAY_BUFFER)}function l(m){let h=[],x=m.index,p=m.attributes.position,S=0;if(p===void 0)return;if(x!==null){let A=x.array;S=x.version;for(let I=0,E=A.length;I<E;I+=3){let R=A[I+0],w=A[I+1],D=A[I+2];h.push(R,w,w,D,D,R)}}else{let A=p.array;S=p.version;for(let I=0,E=A.length/3-1;I<E;I+=3){let R=I+0,w=I+1,D=I+2;h.push(R,w,w,D,D,R)}}let _=new(p.count>=65535?sa:ia)(h,1);_.version=S;let f=r.get(m);f&&t.remove(f),r.set(m,_)}function d(m){let h=r.get(m);if(h){let x=m.index;x!==null&&h.version<x.version&&l(m)}else l(m);return r.get(m)}return{get:o,update:c,getWireframeAttribute:d}}function E0(i,t,e){let n;function s(m){n=m}let r,a;function o(m){r=m.type,a=m.bytesPerElement}function c(m,h){i.drawElements(n,h,r,m*a),e.update(h,n,1)}function l(m,h,x){x!==0&&(i.drawElementsInstanced(n,h,r,m*a,x),e.update(h,n,x))}function d(m,h,x){if(x===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,r,m,0,x);let S=0;for(let _=0;_<x;_++)S+=h[_];e.update(S,n,1)}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=d}function T0(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:qt("WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function A0(i,t,e){let n=new WeakMap,s=new Le;function r(a,o,c){let l=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,m=d!==void 0?d.length:0,h=n.get(o);if(h===void 0||h.count!==m){let C=function(){D.dispose(),n.delete(o),o.removeEventListener("dispose",C)};h!==void 0&&h.texture.dispose();let x=o.morphAttributes.position!==void 0,p=o.morphAttributes.normal!==void 0,S=o.morphAttributes.color!==void 0,_=o.morphAttributes.position||[],f=o.morphAttributes.normal||[],A=o.morphAttributes.color||[],I=0;x===!0&&(I=1),p===!0&&(I=2),S===!0&&(I=3);let E=o.attributes.position.count*I,R=1;E>t.maxTextureSize&&(R=Math.ceil(E/t.maxTextureSize),E=t.maxTextureSize);let w=new Float32Array(E*R*4*m),D=new ea(w,E,R,m);D.type=ai,D.needsUpdate=!0;let v=I*4;for(let k=0;k<m;k++){let F=_[k],G=f[k],V=A[k],Q=E*R*4*k;for(let Y=0;Y<F.count;Y++){let it=Y*v;x===!0&&(s.fromBufferAttribute(F,Y),w[Q+it+0]=s.x,w[Q+it+1]=s.y,w[Q+it+2]=s.z,w[Q+it+3]=0),p===!0&&(s.fromBufferAttribute(G,Y),w[Q+it+4]=s.x,w[Q+it+5]=s.y,w[Q+it+6]=s.z,w[Q+it+7]=0),S===!0&&(s.fromBufferAttribute(V,Y),w[Q+it+8]=s.x,w[Q+it+9]=s.y,w[Q+it+10]=s.z,w[Q+it+11]=V.itemSize===4?s.w:1)}}h={count:m,texture:D,size:new $t(E,R)},n.set(o,h),o.addEventListener("dispose",C)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let x=0;for(let S=0;S<l.length;S++)x+=l[S];let p=o.morphTargetsRelative?1:1-x;c.getUniforms().setValue(i,"morphTargetBaseInfluence",p),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",h.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:r}}function w0(i,t,e,n,s){let r=new WeakMap;function a(l){let d=s.render.frame,m=l.geometry,h=t.get(l,m);if(r.get(h)!==d&&(t.update(h),r.set(h,d)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==d&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,d))),l.isSkinnedMesh){let x=l.skeleton;r.get(x)!==d&&(x.update(),r.set(x,d))}return h}function o(){r=new WeakMap}function c(l){let d=l.target;d.removeEventListener("dispose",c),n.releaseStatesOfObject(d),e.remove(d.instanceMatrix),d.instanceColor!==null&&e.remove(d.instanceColor)}return{update:a,dispose:o}}var C0={[nh]:"LINEAR_TONE_MAPPING",[ih]:"REINHARD_TONE_MAPPING",[sh]:"CINEON_TONE_MAPPING",[rh]:"ACES_FILMIC_TONE_MAPPING",[oh]:"AGX_TONE_MAPPING",[lh]:"NEUTRAL_TONE_MAPPING",[ah]:"CUSTOM_TONE_MAPPING"};function R0(i,t,e,n,s,r){let a=new mn(t,e,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,depthTexture:s?new Oi(t,e):void 0}),o=new mn(t,e,{type:$n,depthBuffer:!1,stencilBuffer:!1}),c=new Re;c.setAttribute("position",new ln([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new ln([0,2,0,0,2,0],2));let l=new Uo({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new $e(c,l),m=new Rs(-1,1,1,-1,0,1),h=null,x=null,p=!1,S,_=null,f=[],A=!1;this.setSize=function(I,E){a.setSize(I,E),o.setSize(I,E);for(let R=0;R<f.length;R++){let w=f[R];w.setSize&&w.setSize(I,E)}},this.setEffects=function(I){f=I,A=f.length>0&&f[0].isRenderPass===!0;let E=a.width,R=a.height;for(let w=0;w<f.length;w++){let D=f[w];D.setSize&&D.setSize(E,R)}},this.begin=function(I,E){if(p||I.toneMapping===ii&&f.length===0)return!1;if(_=E,E!==null){let R=E.width,w=E.height;(a.width!==R||a.height!==w)&&this.setSize(R,w)}return A===!1&&I.setRenderTarget(a),S=I.toneMapping,I.toneMapping=ii,!0},this.hasRenderPass=function(){return A},this.end=function(I,E){I.toneMapping=S,p=!0;let R=a,w=o;for(let D=0;D<f.length;D++){let v=f[D];if(v.enabled!==!1&&(v.render(I,w,R,E),v.needsSwap!==!1)){let C=R;R=w,w=C}}if(h!==I.outputColorSpace||x!==I.toneMapping){h=I.outputColorSpace,x=I.toneMapping,l.defines={},he.getTransfer(h)===ve&&(l.defines.SRGB_TRANSFER="");let D=C0[x];D&&(l.defines[D]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=R.texture,I.setRenderTarget(_),I.render(d,m),_=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),c.dispose(),l.dispose()}}var ef=new Mn,Fh=new Oi(1,1),nf=new ea,sf=new Co,rf=new oa,Fd=[],Od=[],Bd=new Float32Array(16),zd=new Float32Array(9),Vd=new Float32Array(4);function Cr(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=Fd[s];if(r===void 0&&(r=new Float32Array(s),Fd[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function Je(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ke(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Wl(i,t){let e=Od[t];e===void 0&&(e=new Int32Array(t),Od[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function P0(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function I0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Je(e,t))return;i.uniform2fv(this.addr,t),Ke(e,t)}}function L0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Je(e,t))return;i.uniform3fv(this.addr,t),Ke(e,t)}}function D0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Je(e,t))return;i.uniform4fv(this.addr,t),Ke(e,t)}}function N0(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Je(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ke(e,t)}else{if(Je(e,n))return;Vd.set(n),i.uniformMatrix2fv(this.addr,!1,Vd),Ke(e,n)}}function U0(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Je(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ke(e,t)}else{if(Je(e,n))return;zd.set(n),i.uniformMatrix3fv(this.addr,!1,zd),Ke(e,n)}}function F0(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Je(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ke(e,t)}else{if(Je(e,n))return;Bd.set(n),i.uniformMatrix4fv(this.addr,!1,Bd),Ke(e,n)}}function O0(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function B0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Je(e,t))return;i.uniform2iv(this.addr,t),Ke(e,t)}}function z0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Je(e,t))return;i.uniform3iv(this.addr,t),Ke(e,t)}}function V0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Je(e,t))return;i.uniform4iv(this.addr,t),Ke(e,t)}}function k0(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function H0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Je(e,t))return;i.uniform2uiv(this.addr,t),Ke(e,t)}}function G0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Je(e,t))return;i.uniform3uiv(this.addr,t),Ke(e,t)}}function W0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Je(e,t))return;i.uniform4uiv(this.addr,t),Ke(e,t)}}function X0(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Fh.compareFunction=e.isReversedDepthBuffer()?Ol:Fl,r=Fh):r=ef,e.setTexture2D(t||r,s)}function q0(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||sf,s)}function Y0(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||rf,s)}function Z0(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||nf,s)}function $0(i){switch(i){case 5126:return P0;case 35664:return I0;case 35665:return L0;case 35666:return D0;case 35674:return N0;case 35675:return U0;case 35676:return F0;case 5124:case 35670:return O0;case 35667:case 35671:return B0;case 35668:case 35672:return z0;case 35669:case 35673:return V0;case 5125:return k0;case 36294:return H0;case 36295:return G0;case 36296:return W0;case 35678:case 36198:case 36298:case 36306:case 35682:return X0;case 35679:case 36299:case 36307:return q0;case 35680:case 36300:case 36308:case 36293:return Y0;case 36289:case 36303:case 36311:case 36292:return Z0}}function J0(i,t){i.uniform1fv(this.addr,t)}function K0(i,t){let e=Cr(t,this.size,2);i.uniform2fv(this.addr,e)}function j0(i,t){let e=Cr(t,this.size,3);i.uniform3fv(this.addr,e)}function Q0(i,t){let e=Cr(t,this.size,4);i.uniform4fv(this.addr,e)}function t_(i,t){let e=Cr(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function e_(i,t){let e=Cr(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function n_(i,t){let e=Cr(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function i_(i,t){i.uniform1iv(this.addr,t)}function s_(i,t){i.uniform2iv(this.addr,t)}function r_(i,t){i.uniform3iv(this.addr,t)}function a_(i,t){i.uniform4iv(this.addr,t)}function o_(i,t){i.uniform1uiv(this.addr,t)}function l_(i,t){i.uniform2uiv(this.addr,t)}function c_(i,t){i.uniform3uiv(this.addr,t)}function h_(i,t){i.uniform4uiv(this.addr,t)}function u_(i,t,e){let n=this.cache,s=t.length,r=Wl(e,s);Je(n,r)||(i.uniform1iv(this.addr,r),Ke(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=Fh:a=ef;for(let o=0;o!==s;++o)e.setTexture2D(t[o]||a,r[o])}function d_(i,t,e){let n=this.cache,s=t.length,r=Wl(e,s);Je(n,r)||(i.uniform1iv(this.addr,r),Ke(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||sf,r[a])}function f_(i,t,e){let n=this.cache,s=t.length,r=Wl(e,s);Je(n,r)||(i.uniform1iv(this.addr,r),Ke(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||rf,r[a])}function p_(i,t,e){let n=this.cache,s=t.length,r=Wl(e,s);Je(n,r)||(i.uniform1iv(this.addr,r),Ke(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||nf,r[a])}function m_(i){switch(i){case 5126:return J0;case 35664:return K0;case 35665:return j0;case 35666:return Q0;case 35674:return t_;case 35675:return e_;case 35676:return n_;case 5124:case 35670:return i_;case 35667:case 35671:return s_;case 35668:case 35672:return r_;case 35669:case 35673:return a_;case 5125:return o_;case 36294:return l_;case 36295:return c_;case 36296:return h_;case 35678:case 36198:case 36298:case 36306:case 35682:return u_;case 35679:case 36299:case 36307:return d_;case 35680:case 36300:case 36308:case 36293:return f_;case 36289:case 36303:case 36311:case 36292:return p_}}var Oh=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=$0(e.type)}},Bh=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=m_(e.type)}},zh=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(t,e[o.id],n)}}},Nh=/(\w+)(\])?(\[|\.)?/g;function kd(i,t){i.seq.push(t),i.map[t.id]=t}function g_(i,t,e){let n=i.name,s=n.length;for(Nh.lastIndex=0;;){let r=Nh.exec(n),a=Nh.lastIndex,o=r[1],c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){kd(e,l===void 0?new Oh(o,i,t):new Bh(o,i,t));break}else{let m=e.map[o];m===void 0&&(m=new zh(o),kd(e,m)),e=m}}}var wr=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=t.getActiveUniform(e,a),c=t.getUniformLocation(e,o.name);g_(o,c,this)}let s=[],r=[];for(let a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){let o=e[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let a=t[s];a.id in e&&n.push(a)}return n}};function Hd(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var __=37297,x_=0;function v_(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}var Gd=new jt;function y_(i){he._getMatrix(Gd,he.workingColorSpace,i);let t=`mat3( ${Gd.elements.map(e=>e.toFixed(4))} )`;switch(he.getTransfer(i)){case jr:return[t,"LinearTransferOETF"];case ve:return[t,"sRGBTransferOETF"];default:return Gt("WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Wd(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+v_(i.getShaderSource(t),o)}else return r}function M_(i,t){let e=y_(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}var b_={[nh]:"Linear",[ih]:"Reinhard",[sh]:"Cineon",[rh]:"ACESFilmic",[oh]:"AgX",[lh]:"Neutral",[ah]:"Custom"};function S_(i,t){let e=b_[t];return e===void 0?(Gt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var zl=new U;function E_(){he.getLuminanceCoefficients(zl);let i=zl.x.toFixed(4),t=zl.y.toFixed(4),e=zl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function T_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ea).join(`
`)}function A_(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function w_(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function Ea(i){return i!==""}function Xd(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function qd(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var C_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Vh(i){return i.replace(C_,P_)}var R_=new Map;function P_(i,t){let e=ne[t];if(e===void 0){let n=R_.get(t);if(n!==void 0)e=ne[n],Gt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return Vh(e)}var I_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Yd(i){return i.replace(I_,L_)}function L_(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Zd(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}var D_={[fa]:"SHADOWMAP_TYPE_PCF",[Mr]:"SHADOWMAP_TYPE_VSM"};function N_(i){return D_[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var U_={[ls]:"ENVMAP_TYPE_CUBE",[Is]:"ENVMAP_TYPE_CUBE",[pa]:"ENVMAP_TYPE_CUBE_UV"};function F_(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":U_[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var O_={[Is]:"ENVMAP_MODE_REFRACTION"};function B_(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":O_[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var z_={[eh]:"ENVMAP_BLENDING_MULTIPLY",[fd]:"ENVMAP_BLENDING_MIX",[pd]:"ENVMAP_BLENDING_ADD"};function V_(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":z_[i.combine]||"ENVMAP_BLENDING_NONE"}function k_(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function H_(i,t,e,n){let s=i.getContext(),r=e.defines,a=e.vertexShader,o=e.fragmentShader,c=N_(e),l=F_(e),d=B_(e),m=V_(e),h=k_(e),x=T_(e),p=A_(r),S=s.createProgram(),_,f,A=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(_=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Ea).join(`
`),_.length>0&&(_+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Ea).join(`
`),f.length>0&&(f+=`
`)):(_=[Zd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+d:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ea).join(`
`),f=[Zd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+d:"",e.envMap?"#define "+m:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ii?"#define TONE_MAPPING":"",e.toneMapping!==ii?ne.tonemapping_pars_fragment:"",e.toneMapping!==ii?S_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ne.colorspace_pars_fragment,M_("linearToOutputTexel",e.outputColorSpace),E_(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ea).join(`
`)),a=Vh(a),a=Xd(a,e),a=qd(a,e),o=Vh(o),o=Xd(o,e),o=qd(o,e),a=Yd(a),o=Yd(o),e.isRawShaderMaterial!==!0&&(A=`#version 300 es
`,_=[x,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+_,f=["#define varying in",e.glslVersion===xh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===xh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let I=A+_+a,E=A+f+o,R=Hd(s,s.VERTEX_SHADER,I),w=Hd(s,s.FRAGMENT_SHADER,E);s.attachShader(S,R),s.attachShader(S,w),e.index0AttributeName!==void 0?s.bindAttribLocation(S,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(S,0,"position"),s.linkProgram(S);function D(F){if(i.debug.checkShaderErrors){let G=s.getProgramInfoLog(S)||"",V=s.getShaderInfoLog(R)||"",Q=s.getShaderInfoLog(w)||"",Y=G.trim(),it=V.trim(),K=Q.trim(),rt=!0,ct=!0;if(s.getProgramParameter(S,s.LINK_STATUS)===!1)if(rt=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,S,R,w);else{let _t=Wd(s,R,"vertex"),ft=Wd(s,w,"fragment");qt("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(S,s.VALIDATE_STATUS)+`

Material Name: `+F.name+`
Material Type: `+F.type+`

Program Info Log: `+Y+`
`+_t+`
`+ft)}else Y!==""?Gt("WebGLProgram: Program Info Log:",Y):(it===""||K==="")&&(ct=!1);ct&&(F.diagnostics={runnable:rt,programLog:Y,vertexShader:{log:it,prefix:_},fragmentShader:{log:K,prefix:f}})}s.deleteShader(R),s.deleteShader(w),v=new wr(s,S),C=w_(s,S)}let v;this.getUniforms=function(){return v===void 0&&D(this),v};let C;this.getAttributes=function(){return C===void 0&&D(this),C};let k=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return k===!1&&(k=s.getProgramParameter(S,__)),k},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(S),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=x_++,this.cacheKey=t,this.usedTimes=1,this.program=S,this.vertexShader=R,this.fragmentShader=w,this}var G_=0,kh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){let s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Hh(t),e.set(t,n)),n}},Hh=class{constructor(t){this.id=G_++,this.code=t,this.usedTimes=0}};function W_(i){return i===hs||i===ya||i===Ma}function X_(i,t,e,n,s,r){let a=new na,o=new kh,c=new Set,l=[],d=new Map,m=n.logarithmicDepthBuffer,h=n.precision,x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(v){return c.add(v),v===0?"uv":`uv${v}`}function S(v,C,k,F,G,V){let Q=F.fog,Y=G.geometry,it=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?F.environment:null,K=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,rt=t.get(v.envMap||it,K),ct=rt&&rt.mapping===pa?rt.image.height:null,_t=x[v.type];v.precision!==null&&(h=n.getMaxPrecision(v.precision),h!==v.precision&&Gt("WebGLProgram.getParameters:",v.precision,"not supported, using",h,"instead."));let ft=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,Rt=ft!==void 0?ft.length:0,ie=0;Y.morphAttributes.position!==void 0&&(ie=1),Y.morphAttributes.normal!==void 0&&(ie=2),Y.morphAttributes.color!==void 0&&(ie=3);let ye,Ft,tt,mt;if(_t){let Dt=yi[_t];ye=Dt.vertexShader,Ft=Dt.fragmentShader}else{ye=v.vertexShader,Ft=v.fragmentShader;let Dt=o.getVertexShaderStage(v),Ae=o.getFragmentShaderStage(v);o.update(v,Dt,Ae),tt=Dt.id,mt=Ae.id}let at=i.getRenderTarget(),Xt=i.state.buffers.depth.getReversed(),Jt=G.isInstancedMesh===!0,Et=G.isBatchedMesh===!0,Te=!!v.map,se=!!v.matcap,pe=!!rt,ae=!!v.aoMap,ue=!!v.lightMap,Be=!!v.bumpMap&&v.wireframe===!1,ze=!!v.normalMap,Ve=!!v.displacementMap,Xe=!!v.emissiveMap,De=!!v.metalnessMap,be=!!v.roughnessMap,B=v.anisotropy>0,Qe=v.clearcoat>0,fe=v.dispersion>0,T=v.iridescence>0,g=v.sheen>0,H=v.transmission>0,Z=B&&!!v.anisotropyMap,et=Qe&&!!v.clearcoatMap,ut=Qe&&!!v.clearcoatNormalMap,gt=Qe&&!!v.clearcoatRoughnessMap,nt=T&&!!v.iridescenceMap,st=T&&!!v.iridescenceThicknessMap,yt=g&&!!v.sheenColorMap,Ot=g&&!!v.sheenRoughnessMap,bt=!!v.specularMap,xt=!!v.specularColorMap,Bt=!!v.specularIntensityMap,Wt=H&&!!v.transmissionMap,Ut=H&&!!v.thicknessMap,O=!!v.gradientMap,pt=!!v.alphaMap,J=v.alphaTest>0,Mt=!!v.alphaHash,Tt=!!v.extensions,ot=ii;v.toneMapped&&(at===null||at.isXRRenderTarget===!0)&&(ot=i.toneMapping);let zt={shaderID:_t,shaderType:v.type,shaderName:v.name,vertexShader:ye,fragmentShader:Ft,defines:v.defines,customVertexShaderID:tt,customFragmentShaderID:mt,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:h,batching:Et,batchingColor:Et&&G._colorsTexture!==null,instancing:Jt,instancingColor:Jt&&G.instanceColor!==null,instancingMorph:Jt&&G.morphTexture!==null,outputColorSpace:at===null?i.outputColorSpace:at.isXRRenderTarget===!0?at.texture.colorSpace:he.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:Te,matcap:se,envMap:pe,envMapMode:pe&&rt.mapping,envMapCubeUVHeight:ct,aoMap:ae,lightMap:ue,bumpMap:Be,normalMap:ze,displacementMap:Ve,emissiveMap:Xe,normalMapObjectSpace:ze&&v.normalMapType===_d,normalMapTangentSpace:ze&&v.normalMapType===_h,packedNormalMap:ze&&v.normalMapType===_h&&W_(v.normalMap.format),metalnessMap:De,roughnessMap:be,anisotropy:B,anisotropyMap:Z,clearcoat:Qe,clearcoatMap:et,clearcoatNormalMap:ut,clearcoatRoughnessMap:gt,dispersion:fe,iridescence:T,iridescenceMap:nt,iridescenceThicknessMap:st,sheen:g,sheenColorMap:yt,sheenRoughnessMap:Ot,specularMap:bt,specularColorMap:xt,specularIntensityMap:Bt,transmission:H,transmissionMap:Wt,thicknessMap:Ut,gradientMap:O,opaque:v.transparent===!1&&v.blending===As&&v.alphaToCoverage===!1,alphaMap:pt,alphaTest:J,alphaHash:Mt,combine:v.combine,mapUv:Te&&p(v.map.channel),aoMapUv:ae&&p(v.aoMap.channel),lightMapUv:ue&&p(v.lightMap.channel),bumpMapUv:Be&&p(v.bumpMap.channel),normalMapUv:ze&&p(v.normalMap.channel),displacementMapUv:Ve&&p(v.displacementMap.channel),emissiveMapUv:Xe&&p(v.emissiveMap.channel),metalnessMapUv:De&&p(v.metalnessMap.channel),roughnessMapUv:be&&p(v.roughnessMap.channel),anisotropyMapUv:Z&&p(v.anisotropyMap.channel),clearcoatMapUv:et&&p(v.clearcoatMap.channel),clearcoatNormalMapUv:ut&&p(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:gt&&p(v.clearcoatRoughnessMap.channel),iridescenceMapUv:nt&&p(v.iridescenceMap.channel),iridescenceThicknessMapUv:st&&p(v.iridescenceThicknessMap.channel),sheenColorMapUv:yt&&p(v.sheenColorMap.channel),sheenRoughnessMapUv:Ot&&p(v.sheenRoughnessMap.channel),specularMapUv:bt&&p(v.specularMap.channel),specularColorMapUv:xt&&p(v.specularColorMap.channel),specularIntensityMapUv:Bt&&p(v.specularIntensityMap.channel),transmissionMapUv:Wt&&p(v.transmissionMap.channel),thicknessMapUv:Ut&&p(v.thicknessMap.channel),alphaMapUv:pt&&p(v.alphaMap.channel),vertexTangents:!!Y.attributes.tangent&&(ze||B),vertexNormals:!!Y.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,pointsUvs:G.isPoints===!0&&!!Y.attributes.uv&&(Te||pt),fog:!!Q,useFog:v.fog===!0,fogExp2:!!Q&&Q.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||Y.attributes.normal===void 0&&ze===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:m,reversedDepthBuffer:Xt,skinning:G.isSkinnedMesh===!0,hasPositionAttribute:Y.attributes.position!==void 0,morphTargets:Y.morphAttributes.position!==void 0,morphNormals:Y.morphAttributes.normal!==void 0,morphColors:Y.morphAttributes.color!==void 0,morphTargetsCount:Rt,morphTextureStride:ie,numDirLights:C.directional.length,numPointLights:C.point.length,numSpotLights:C.spot.length,numSpotLightMaps:C.spotLightMap.length,numRectAreaLights:C.rectArea.length,numHemiLights:C.hemi.length,numDirLightShadows:C.directionalShadowMap.length,numPointLightShadows:C.pointShadowMap.length,numSpotLightShadows:C.spotShadowMap.length,numSpotLightShadowsWithMaps:C.numSpotLightShadowsWithMaps,numLightProbes:C.numLightProbes,numLightProbeGrids:V.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&k.length>0,shadowMapType:i.shadowMap.type,toneMapping:ot,decodeVideoTexture:Te&&v.map.isVideoTexture===!0&&he.getTransfer(v.map.colorSpace)===ve,decodeVideoTextureEmissive:Xe&&v.emissiveMap.isVideoTexture===!0&&he.getTransfer(v.emissiveMap.colorSpace)===ve,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Vn,flipSided:v.side===cn,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:Tt&&v.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Tt&&v.extensions.multiDraw===!0||Et)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return zt.vertexUv1s=c.has(1),zt.vertexUv2s=c.has(2),zt.vertexUv3s=c.has(3),c.clear(),zt}function _(v){let C=[];if(v.shaderID?C.push(v.shaderID):(C.push(v.customVertexShaderID),C.push(v.customFragmentShaderID)),v.defines!==void 0)for(let k in v.defines)C.push(k),C.push(v.defines[k]);return v.isRawShaderMaterial===!1&&(f(C,v),A(C,v),C.push(i.outputColorSpace)),C.push(v.customProgramCacheKey),C.join()}function f(v,C){v.push(C.precision),v.push(C.outputColorSpace),v.push(C.envMapMode),v.push(C.envMapCubeUVHeight),v.push(C.mapUv),v.push(C.alphaMapUv),v.push(C.lightMapUv),v.push(C.aoMapUv),v.push(C.bumpMapUv),v.push(C.normalMapUv),v.push(C.displacementMapUv),v.push(C.emissiveMapUv),v.push(C.metalnessMapUv),v.push(C.roughnessMapUv),v.push(C.anisotropyMapUv),v.push(C.clearcoatMapUv),v.push(C.clearcoatNormalMapUv),v.push(C.clearcoatRoughnessMapUv),v.push(C.iridescenceMapUv),v.push(C.iridescenceThicknessMapUv),v.push(C.sheenColorMapUv),v.push(C.sheenRoughnessMapUv),v.push(C.specularMapUv),v.push(C.specularColorMapUv),v.push(C.specularIntensityMapUv),v.push(C.transmissionMapUv),v.push(C.thicknessMapUv),v.push(C.combine),v.push(C.fogExp2),v.push(C.sizeAttenuation),v.push(C.morphTargetsCount),v.push(C.morphAttributeCount),v.push(C.numDirLights),v.push(C.numPointLights),v.push(C.numSpotLights),v.push(C.numSpotLightMaps),v.push(C.numHemiLights),v.push(C.numRectAreaLights),v.push(C.numDirLightShadows),v.push(C.numPointLightShadows),v.push(C.numSpotLightShadows),v.push(C.numSpotLightShadowsWithMaps),v.push(C.numLightProbes),v.push(C.shadowMapType),v.push(C.toneMapping),v.push(C.numClippingPlanes),v.push(C.numClipIntersection),v.push(C.depthPacking)}function A(v,C){a.disableAll(),C.instancing&&a.enable(0),C.instancingColor&&a.enable(1),C.instancingMorph&&a.enable(2),C.matcap&&a.enable(3),C.envMap&&a.enable(4),C.normalMapObjectSpace&&a.enable(5),C.normalMapTangentSpace&&a.enable(6),C.clearcoat&&a.enable(7),C.iridescence&&a.enable(8),C.alphaTest&&a.enable(9),C.vertexColors&&a.enable(10),C.vertexAlphas&&a.enable(11),C.vertexUv1s&&a.enable(12),C.vertexUv2s&&a.enable(13),C.vertexUv3s&&a.enable(14),C.vertexTangents&&a.enable(15),C.anisotropy&&a.enable(16),C.alphaHash&&a.enable(17),C.batching&&a.enable(18),C.dispersion&&a.enable(19),C.batchingColor&&a.enable(20),C.gradientMap&&a.enable(21),C.packedNormalMap&&a.enable(22),C.vertexNormals&&a.enable(23),v.push(a.mask),a.disableAll(),C.fog&&a.enable(0),C.useFog&&a.enable(1),C.flatShading&&a.enable(2),C.logarithmicDepthBuffer&&a.enable(3),C.reversedDepthBuffer&&a.enable(4),C.skinning&&a.enable(5),C.morphTargets&&a.enable(6),C.morphNormals&&a.enable(7),C.morphColors&&a.enable(8),C.premultipliedAlpha&&a.enable(9),C.shadowMapEnabled&&a.enable(10),C.doubleSided&&a.enable(11),C.flipSided&&a.enable(12),C.useDepthPacking&&a.enable(13),C.dithering&&a.enable(14),C.transmission&&a.enable(15),C.sheen&&a.enable(16),C.opaque&&a.enable(17),C.pointsUvs&&a.enable(18),C.decodeVideoTexture&&a.enable(19),C.decodeVideoTextureEmissive&&a.enable(20),C.alphaToCoverage&&a.enable(21),C.numLightProbeGrids>0&&a.enable(22),C.hasPositionAttribute&&a.enable(23),v.push(a.mask)}function I(v){let C=x[v.type],k;if(C){let F=yi[C];k=Rd.clone(F.uniforms)}else k=v.uniforms;return k}function E(v,C){let k=d.get(C);return k!==void 0?++k.usedTimes:(k=new H_(i,C,v,s),l.push(k),d.set(C,k)),k}function R(v){if(--v.usedTimes===0){let C=l.indexOf(v);l[C]=l[l.length-1],l.pop(),d.delete(v.cacheKey),v.destroy()}}function w(v){o.remove(v)}function D(){o.dispose()}return{getParameters:S,getProgramCacheKey:_,getUniforms:I,acquireProgram:E,releaseProgram:R,releaseShaderCache:w,programs:l,dispose:D}}function q_(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function Y_(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.materialVariant!==t.materialVariant?i.materialVariant-t.materialVariant:i.z!==t.z?i.z-t.z:i.id-t.id}function $d(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Jd(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(h){let x=0;return h.isInstancedMesh&&(x+=2),h.isSkinnedMesh&&(x+=1),x}function o(h,x,p,S,_,f){let A=i[t];return A===void 0?(A={id:h.id,object:h,geometry:x,material:p,materialVariant:a(h),groupOrder:S,renderOrder:h.renderOrder,z:_,group:f},i[t]=A):(A.id=h.id,A.object=h,A.geometry=x,A.material=p,A.materialVariant=a(h),A.groupOrder=S,A.renderOrder=h.renderOrder,A.z=_,A.group=f),t++,A}function c(h,x,p,S,_,f){let A=o(h,x,p,S,_,f);p.transmission>0?n.push(A):p.transparent===!0?s.push(A):e.push(A)}function l(h,x,p,S,_,f){let A=o(h,x,p,S,_,f);p.transmission>0?n.unshift(A):p.transparent===!0?s.unshift(A):e.unshift(A)}function d(h,x,p){e.length>1&&e.sort(h||Y_),n.length>1&&n.sort(x||$d),s.length>1&&s.sort(x||$d),p&&(e.reverse(),n.reverse(),s.reverse())}function m(){for(let h=t,x=i.length;h<x;h++){let p=i[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:c,unshift:l,finish:m,sort:d}}function Z_(){let i=new WeakMap;function t(n,s){let r=i.get(n),a;return r===void 0?(a=new Jd,i.set(n,[a])):s>=r.length?(a=new Jd,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function $_(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new U,color:new kt};break;case"SpotLight":e={position:new U,direction:new U,color:new kt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new U,color:new kt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new U,skyColor:new kt,groundColor:new kt};break;case"RectAreaLight":e={color:new kt,position:new U,halfWidth:new U,halfHeight:new U};break}return i[t.id]=e,e}}}function J_(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $t};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $t};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $t,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var K_=0;function j_(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Q_(i){let t=new $_,e=J_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new U);let s=new U,r=new Oe,a=new Oe;function o(l){let d=0,m=0,h=0;for(let C=0;C<9;C++)n.probe[C].set(0,0,0);let x=0,p=0,S=0,_=0,f=0,A=0,I=0,E=0,R=0,w=0,D=0;l.sort(j_);for(let C=0,k=l.length;C<k;C++){let F=l[C],G=F.color,V=F.intensity,Q=F.distance,Y=null;if(F.shadow&&F.shadow.map&&(F.shadow.map.texture.format===hs?Y=F.shadow.map.texture:Y=F.shadow.map.depthTexture||F.shadow.map.texture),F.isAmbientLight)d+=G.r*V,m+=G.g*V,h+=G.b*V;else if(F.isLightProbe){for(let it=0;it<9;it++)n.probe[it].addScaledVector(F.sh.coefficients[it],V);D++}else if(F.isDirectionalLight){let it=t.get(F);if(it.color.copy(F.color).multiplyScalar(F.intensity),F.castShadow){let K=F.shadow,rt=e.get(F);rt.shadowIntensity=K.intensity,rt.shadowBias=K.bias,rt.shadowNormalBias=K.normalBias,rt.shadowRadius=K.radius,rt.shadowMapSize=K.mapSize,n.directionalShadow[x]=rt,n.directionalShadowMap[x]=Y,n.directionalShadowMatrix[x]=F.shadow.matrix,A++}n.directional[x]=it,x++}else if(F.isSpotLight){let it=t.get(F);it.position.setFromMatrixPosition(F.matrixWorld),it.color.copy(G).multiplyScalar(V),it.distance=Q,it.coneCos=Math.cos(F.angle),it.penumbraCos=Math.cos(F.angle*(1-F.penumbra)),it.decay=F.decay,n.spot[S]=it;let K=F.shadow;if(F.map&&(n.spotLightMap[R]=F.map,R++,K.updateMatrices(F),F.castShadow&&w++),n.spotLightMatrix[S]=K.matrix,F.castShadow){let rt=e.get(F);rt.shadowIntensity=K.intensity,rt.shadowBias=K.bias,rt.shadowNormalBias=K.normalBias,rt.shadowRadius=K.radius,rt.shadowMapSize=K.mapSize,n.spotShadow[S]=rt,n.spotShadowMap[S]=Y,E++}S++}else if(F.isRectAreaLight){let it=t.get(F);it.color.copy(G).multiplyScalar(V),it.halfWidth.set(F.width*.5,0,0),it.halfHeight.set(0,F.height*.5,0),n.rectArea[_]=it,_++}else if(F.isPointLight){let it=t.get(F);if(it.color.copy(F.color).multiplyScalar(F.intensity),it.distance=F.distance,it.decay=F.decay,F.castShadow){let K=F.shadow,rt=e.get(F);rt.shadowIntensity=K.intensity,rt.shadowBias=K.bias,rt.shadowNormalBias=K.normalBias,rt.shadowRadius=K.radius,rt.shadowMapSize=K.mapSize,rt.shadowCameraNear=K.camera.near,rt.shadowCameraFar=K.camera.far,n.pointShadow[p]=rt,n.pointShadowMap[p]=Y,n.pointShadowMatrix[p]=F.shadow.matrix,I++}n.point[p]=it,p++}else if(F.isHemisphereLight){let it=t.get(F);it.skyColor.copy(F.color).multiplyScalar(V),it.groundColor.copy(F.groundColor).multiplyScalar(V),n.hemi[f]=it,f++}}_>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=At.LTC_FLOAT_1,n.rectAreaLTC2=At.LTC_FLOAT_2):(n.rectAreaLTC1=At.LTC_HALF_1,n.rectAreaLTC2=At.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=m,n.ambient[2]=h;let v=n.hash;(v.directionalLength!==x||v.pointLength!==p||v.spotLength!==S||v.rectAreaLength!==_||v.hemiLength!==f||v.numDirectionalShadows!==A||v.numPointShadows!==I||v.numSpotShadows!==E||v.numSpotMaps!==R||v.numLightProbes!==D)&&(n.directional.length=x,n.spot.length=S,n.rectArea.length=_,n.point.length=p,n.hemi.length=f,n.directionalShadow.length=A,n.directionalShadowMap.length=A,n.pointShadow.length=I,n.pointShadowMap.length=I,n.spotShadow.length=E,n.spotShadowMap.length=E,n.directionalShadowMatrix.length=A,n.pointShadowMatrix.length=I,n.spotLightMatrix.length=E+R-w,n.spotLightMap.length=R,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=D,v.directionalLength=x,v.pointLength=p,v.spotLength=S,v.rectAreaLength=_,v.hemiLength=f,v.numDirectionalShadows=A,v.numPointShadows=I,v.numSpotShadows=E,v.numSpotMaps=R,v.numLightProbes=D,n.version=K_++)}function c(l,d){let m=0,h=0,x=0,p=0,S=0,_=d.matrixWorldInverse;for(let f=0,A=l.length;f<A;f++){let I=l[f];if(I.isDirectionalLight){let E=n.directional[m];E.direction.setFromMatrixPosition(I.matrixWorld),s.setFromMatrixPosition(I.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(_),m++}else if(I.isSpotLight){let E=n.spot[x];E.position.setFromMatrixPosition(I.matrixWorld),E.position.applyMatrix4(_),E.direction.setFromMatrixPosition(I.matrixWorld),s.setFromMatrixPosition(I.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(_),x++}else if(I.isRectAreaLight){let E=n.rectArea[p];E.position.setFromMatrixPosition(I.matrixWorld),E.position.applyMatrix4(_),a.identity(),r.copy(I.matrixWorld),r.premultiply(_),a.extractRotation(r),E.halfWidth.set(I.width*.5,0,0),E.halfHeight.set(0,I.height*.5,0),E.halfWidth.applyMatrix4(a),E.halfHeight.applyMatrix4(a),p++}else if(I.isPointLight){let E=n.point[h];E.position.setFromMatrixPosition(I.matrixWorld),E.position.applyMatrix4(_),h++}else if(I.isHemisphereLight){let E=n.hemi[S];E.direction.setFromMatrixPosition(I.matrixWorld),E.direction.transformDirection(_),S++}}}return{setup:o,setupView:c,state:n}}function Kd(i){let t=new Q_(i),e=[],n=[],s=[];function r(h){m.camera=h,e.length=0,n.length=0,s.length=0}function a(h){e.push(h)}function o(h){n.push(h)}function c(h){s.push(h)}function l(){t.setup(e)}function d(h){t.setupView(e,h)}let m={lightsArray:e,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:m,setupLights:l,setupLightsView:d,pushLight:a,pushShadow:o,pushLightProbeGrid:c}}function tx(i){let t=new WeakMap;function e(s,r=0){let a=t.get(s),o;return a===void 0?(o=new Kd(i),t.set(s,[o])):r>=a.length?(o=new Kd(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}var ex=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,nx=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,ix=[new U(1,0,0),new U(-1,0,0),new U(0,1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1)],sx=[new U(0,-1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1),new U(0,-1,0),new U(0,-1,0)],jd=new Oe,Sa=new U,Uh=new U;function rx(i,t,e){let n=new aa,s=new $t,r=new $t,a=new Le,o=new Fo,c=new Oo,l={},d=e.maxTextureSize,m={[Ui]:cn,[cn]:Ui,[Vn]:Vn},h=new Se({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new $t},radius:{value:4}},vertexShader:ex,fragmentShader:nx}),x=h.clone();x.defines.HORIZONTAL_PASS=1;let p=new Re;p.setAttribute("position",new Qt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let S=new $e(p,h),_=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=fa;let f=this.type;this.render=function(w,D,v){if(_.enabled===!1||_.autoUpdate===!1&&_.needsUpdate===!1||w.length===0)return;this.type===Ku&&(Gt("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=fa);let C=i.getRenderTarget(),k=i.getActiveCubeFace(),F=i.getActiveMipmapLevel(),G=i.state;G.setBlending(_i),G.buffers.depth.getReversed()===!0?G.buffers.color.setClear(0,0,0,0):G.buffers.color.setClear(1,1,1,1),G.buffers.depth.setTest(!0),G.setScissorTest(!1);let V=f!==this.type;V&&D.traverse(function(Q){Q.material&&(Array.isArray(Q.material)?Q.material.forEach(Y=>Y.needsUpdate=!0):Q.material.needsUpdate=!0)});for(let Q=0,Y=w.length;Q<Y;Q++){let it=w[Q],K=it.shadow;if(K===void 0){Gt("WebGLShadowMap:",it,"has no shadow.");continue}if(K.autoUpdate===!1&&K.needsUpdate===!1)continue;s.copy(K.mapSize);let rt=K.getFrameExtents();s.multiply(rt),r.copy(K.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/rt.x),s.x=r.x*rt.x,K.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/rt.y),s.y=r.y*rt.y,K.mapSize.y=r.y));let ct=i.state.buffers.depth.getReversed();if(K.camera._reversedDepth=ct,K.map===null||V===!0){if(K.map!==null&&(K.map.depthTexture!==null&&(K.map.depthTexture.dispose(),K.map.depthTexture=null),K.map.dispose()),this.type===Mr){if(it.isPointLight){Gt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}K.map=new mn(s.x,s.y,{format:hs,type:$n,minFilter:Ue,magFilter:Ue,generateMipmaps:!1}),K.map.texture.name=it.name+".shadowMap",K.map.depthTexture=new Oi(s.x,s.y,ai),K.map.depthTexture.name=it.name+".shadowMapDepth",K.map.depthTexture.format=mi,K.map.depthTexture.compareFunction=null,K.map.depthTexture.minFilter=on,K.map.depthTexture.magFilter=on}else it.isPointLight?(K.map=new kl(s.x),K.map.depthTexture=new No(s.x,ri)):(K.map=new mn(s.x,s.y),K.map.depthTexture=new Oi(s.x,s.y,ri)),K.map.depthTexture.name=it.name+".shadowMap",K.map.depthTexture.format=mi,this.type===fa?(K.map.depthTexture.compareFunction=ct?Ol:Fl,K.map.depthTexture.minFilter=Ue,K.map.depthTexture.magFilter=Ue):(K.map.depthTexture.compareFunction=null,K.map.depthTexture.minFilter=on,K.map.depthTexture.magFilter=on);K.camera.updateProjectionMatrix()}let _t=K.map.isWebGLCubeRenderTarget?6:1;for(let ft=0;ft<_t;ft++){if(K.map.isWebGLCubeRenderTarget)i.setRenderTarget(K.map,ft),i.clear();else{ft===0&&(i.setRenderTarget(K.map),i.clear());let Rt=K.getViewport(ft);a.set(r.x*Rt.x,r.y*Rt.y,r.x*Rt.z,r.y*Rt.w),G.viewport(a)}if(it.isPointLight){let Rt=K.camera,ie=K.matrix,ye=it.distance||Rt.far;ye!==Rt.far&&(Rt.far=ye,Rt.updateProjectionMatrix()),Sa.setFromMatrixPosition(it.matrixWorld),Rt.position.copy(Sa),Uh.copy(Rt.position),Uh.add(ix[ft]),Rt.up.copy(sx[ft]),Rt.lookAt(Uh),Rt.updateMatrixWorld(),ie.makeTranslation(-Sa.x,-Sa.y,-Sa.z),jd.multiplyMatrices(Rt.projectionMatrix,Rt.matrixWorldInverse),K._frustum.setFromProjectionMatrix(jd,Rt.coordinateSystem,Rt.reversedDepth)}else K.updateMatrices(it);n=K.getFrustum(),E(D,v,K.camera,it,this.type)}K.isPointLightShadow!==!0&&this.type===Mr&&A(K,v),K.needsUpdate=!1}f=this.type,_.needsUpdate=!1,i.setRenderTarget(C,k,F)};function A(w,D){let v=t.update(S);h.defines.VSM_SAMPLES!==w.blurSamples&&(h.defines.VSM_SAMPLES=w.blurSamples,x.defines.VSM_SAMPLES=w.blurSamples,h.needsUpdate=!0,x.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new mn(s.x,s.y,{format:hs,type:$n})),h.uniforms.shadow_pass.value=w.map.depthTexture,h.uniforms.resolution.value=w.mapSize,h.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(D,null,v,h,S,null),x.uniforms.shadow_pass.value=w.mapPass.texture,x.uniforms.resolution.value=w.mapSize,x.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(D,null,v,x,S,null)}function I(w,D,v,C){let k=null,F=v.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(F!==void 0)k=F;else if(k=v.isPointLight===!0?c:o,i.localClippingEnabled&&D.clipShadows===!0&&Array.isArray(D.clippingPlanes)&&D.clippingPlanes.length!==0||D.displacementMap&&D.displacementScale!==0||D.alphaMap&&D.alphaTest>0||D.map&&D.alphaTest>0||D.alphaToCoverage===!0){let G=k.uuid,V=D.uuid,Q=l[G];Q===void 0&&(Q={},l[G]=Q);let Y=Q[V];Y===void 0&&(Y=k.clone(),Q[V]=Y,D.addEventListener("dispose",R)),k=Y}if(k.visible=D.visible,k.wireframe=D.wireframe,C===Mr?k.side=D.shadowSide!==null?D.shadowSide:D.side:k.side=D.shadowSide!==null?D.shadowSide:m[D.side],k.alphaMap=D.alphaMap,k.alphaTest=D.alphaToCoverage===!0?.5:D.alphaTest,k.map=D.map,k.clipShadows=D.clipShadows,k.clippingPlanes=D.clippingPlanes,k.clipIntersection=D.clipIntersection,k.displacementMap=D.displacementMap,k.displacementScale=D.displacementScale,k.displacementBias=D.displacementBias,k.wireframeLinewidth=D.wireframeLinewidth,k.linewidth=D.linewidth,v.isPointLight===!0&&k.isMeshDistanceMaterial===!0){let G=i.properties.get(k);G.light=v}return k}function E(w,D,v,C,k){if(w.visible===!1)return;if(w.layers.test(D.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&k===Mr)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,w.matrixWorld);let V=t.update(w),Q=w.material;if(Array.isArray(Q)){let Y=V.groups;for(let it=0,K=Y.length;it<K;it++){let rt=Y[it],ct=Q[rt.materialIndex];if(ct&&ct.visible){let _t=I(w,ct,C,k);w.onBeforeShadow(i,w,D,v,V,_t,rt),i.renderBufferDirect(v,null,V,_t,w,rt),w.onAfterShadow(i,w,D,v,V,_t,rt)}}}else if(Q.visible){let Y=I(w,Q,C,k);w.onBeforeShadow(i,w,D,v,V,Y,null),i.renderBufferDirect(v,null,V,Y,w,null),w.onAfterShadow(i,w,D,v,V,Y,null)}}let G=w.children;for(let V=0,Q=G.length;V<Q;V++)E(G[V],D,v,C,k)}function R(w){w.target.removeEventListener("dispose",R);for(let v in l){let C=l[v],k=w.target.uuid;k in C&&(C[k].dispose(),delete C[k])}}}function ax(i,t){function e(){let O=!1,pt=new Le,J=null,Mt=new Le(0,0,0,0);return{setMask:function(Tt){J!==Tt&&!O&&(i.colorMask(Tt,Tt,Tt,Tt),J=Tt)},setLocked:function(Tt){O=Tt},setClear:function(Tt,ot,zt,Dt,Ae){Ae===!0&&(Tt*=Dt,ot*=Dt,zt*=Dt),pt.set(Tt,ot,zt,Dt),Mt.equals(pt)===!1&&(i.clearColor(Tt,ot,zt,Dt),Mt.copy(pt))},reset:function(){O=!1,J=null,Mt.set(-1,0,0,0)}}}function n(){let O=!1,pt=!1,J=null,Mt=null,Tt=null;return{setReversed:function(ot){if(pt!==ot){let zt=t.get("EXT_clip_control");ot?zt.clipControlEXT(zt.LOWER_LEFT_EXT,zt.ZERO_TO_ONE_EXT):zt.clipControlEXT(zt.LOWER_LEFT_EXT,zt.NEGATIVE_ONE_TO_ONE_EXT),pt=ot;let Dt=Tt;Tt=null,this.setClear(Dt)}},getReversed:function(){return pt},setTest:function(ot){ot?at(i.DEPTH_TEST):Xt(i.DEPTH_TEST)},setMask:function(ot){J!==ot&&!O&&(i.depthMask(ot),J=ot)},setFunc:function(ot){if(pt&&(ot=wd[ot]),Mt!==ot){switch(ot){case go:i.depthFunc(i.NEVER);break;case _o:i.depthFunc(i.ALWAYS);break;case xo:i.depthFunc(i.LESS);break;case ws:i.depthFunc(i.LEQUAL);break;case vo:i.depthFunc(i.EQUAL);break;case yo:i.depthFunc(i.GEQUAL);break;case Mo:i.depthFunc(i.GREATER);break;case bo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Mt=ot}},setLocked:function(ot){O=ot},setClear:function(ot){Tt!==ot&&(Tt=ot,pt&&(ot=1-ot),i.clearDepth(ot))},reset:function(){O=!1,J=null,Mt=null,Tt=null,pt=!1}}}function s(){let O=!1,pt=null,J=null,Mt=null,Tt=null,ot=null,zt=null,Dt=null,Ae=null;return{setTest:function(Me){O||(Me?at(i.STENCIL_TEST):Xt(i.STENCIL_TEST))},setMask:function(Me){pt!==Me&&!O&&(i.stencilMask(Me),pt=Me)},setFunc:function(Me,En,Gn){(J!==Me||Mt!==En||Tt!==Gn)&&(i.stencilFunc(Me,En,Gn),J=Me,Mt=En,Tt=Gn)},setOp:function(Me,En,Gn){(ot!==Me||zt!==En||Dt!==Gn)&&(i.stencilOp(Me,En,Gn),ot=Me,zt=En,Dt=Gn)},setLocked:function(Me){O=Me},setClear:function(Me){Ae!==Me&&(i.clearStencil(Me),Ae=Me)},reset:function(){O=!1,pt=null,J=null,Mt=null,Tt=null,ot=null,zt=null,Dt=null,Ae=null}}}let r=new e,a=new n,o=new s,c=new WeakMap,l=new WeakMap,d={},m={},h={},x=new WeakMap,p=[],S=null,_=!1,f=null,A=null,I=null,E=null,R=null,w=null,D=null,v=new kt(0,0,0),C=0,k=!1,F=null,G=null,V=null,Q=null,Y=null,it=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),K=!1,rt=0,ct=i.getParameter(i.VERSION);ct.indexOf("WebGL")!==-1?(rt=parseFloat(/^WebGL (\d)/.exec(ct)[1]),K=rt>=1):ct.indexOf("OpenGL ES")!==-1&&(rt=parseFloat(/^OpenGL ES (\d)/.exec(ct)[1]),K=rt>=2);let _t=null,ft={},Rt=i.getParameter(i.SCISSOR_BOX),ie=i.getParameter(i.VIEWPORT),ye=new Le().fromArray(Rt),Ft=new Le().fromArray(ie);function tt(O,pt,J,Mt){let Tt=new Uint8Array(4),ot=i.createTexture();i.bindTexture(O,ot),i.texParameteri(O,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(O,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let zt=0;zt<J;zt++)O===i.TEXTURE_3D||O===i.TEXTURE_2D_ARRAY?i.texImage3D(pt,0,i.RGBA,1,1,Mt,0,i.RGBA,i.UNSIGNED_BYTE,Tt):i.texImage2D(pt+zt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Tt);return ot}let mt={};mt[i.TEXTURE_2D]=tt(i.TEXTURE_2D,i.TEXTURE_2D,1),mt[i.TEXTURE_CUBE_MAP]=tt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),mt[i.TEXTURE_2D_ARRAY]=tt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),mt[i.TEXTURE_3D]=tt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),at(i.DEPTH_TEST),a.setFunc(ws),Be(!1),ze(jc),at(i.CULL_FACE),ae(_i);function at(O){d[O]!==!0&&(i.enable(O),d[O]=!0)}function Xt(O){d[O]!==!1&&(i.disable(O),d[O]=!1)}function Jt(O,pt){return h[O]!==pt?(i.bindFramebuffer(O,pt),h[O]=pt,O===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=pt),O===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=pt),!0):!1}function Et(O,pt){let J=p,Mt=!1;if(O){J=x.get(pt),J===void 0&&(J=[],x.set(pt,J));let Tt=O.textures;if(J.length!==Tt.length||J[0]!==i.COLOR_ATTACHMENT0){for(let ot=0,zt=Tt.length;ot<zt;ot++)J[ot]=i.COLOR_ATTACHMENT0+ot;J.length=Tt.length,Mt=!0}}else J[0]!==i.BACK&&(J[0]=i.BACK,Mt=!0);Mt&&i.drawBuffers(J)}function Te(O){return S!==O?(i.useProgram(O),S=O,!0):!1}let se={[ji]:i.FUNC_ADD,[ju]:i.FUNC_SUBTRACT,[Qu]:i.FUNC_REVERSE_SUBTRACT};se[td]=i.MIN,se[ed]=i.MAX;let pe={[br]:i.ZERO,[Pe]:i.ONE,[nd]:i.SRC_COLOR,[hr]:i.SRC_ALPHA,[ld]:i.SRC_ALPHA_SATURATE,[ad]:i.DST_COLOR,[sd]:i.DST_ALPHA,[id]:i.ONE_MINUS_SRC_COLOR,[ur]:i.ONE_MINUS_SRC_ALPHA,[od]:i.ONE_MINUS_DST_COLOR,[rd]:i.ONE_MINUS_DST_ALPHA,[cd]:i.CONSTANT_COLOR,[hd]:i.ONE_MINUS_CONSTANT_COLOR,[ud]:i.CONSTANT_ALPHA,[dd]:i.ONE_MINUS_CONSTANT_ALPHA};function ae(O,pt,J,Mt,Tt,ot,zt,Dt,Ae,Me){if(O===_i){_===!0&&(Xt(i.BLEND),_=!1);return}if(_===!1&&(at(i.BLEND),_=!0),O!==Pn){if(O!==f||Me!==k){if((A!==ji||R!==ji)&&(i.blendEquation(i.FUNC_ADD),A=ji,R=ji),Me)switch(O){case As:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ps:i.blendFunc(i.ONE,i.ONE);break;case Qc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case th:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:qt("WebGLState: Invalid blending: ",O);break}else switch(O){case As:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ps:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Qc:qt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case th:qt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:qt("WebGLState: Invalid blending: ",O);break}I=null,E=null,w=null,D=null,v.set(0,0,0),C=0,f=O,k=Me}return}Tt=Tt||pt,ot=ot||J,zt=zt||Mt,(pt!==A||Tt!==R)&&(i.blendEquationSeparate(se[pt],se[Tt]),A=pt,R=Tt),(J!==I||Mt!==E||ot!==w||zt!==D)&&(i.blendFuncSeparate(pe[J],pe[Mt],pe[ot],pe[zt]),I=J,E=Mt,w=ot,D=zt),(Dt.equals(v)===!1||Ae!==C)&&(i.blendColor(Dt.r,Dt.g,Dt.b,Ae),v.copy(Dt),C=Ae),f=O,k=!1}function ue(O,pt){O.side===Vn?Xt(i.CULL_FACE):at(i.CULL_FACE);let J=O.side===cn;pt&&(J=!J),Be(J),O.blending===As&&O.transparent===!1?ae(_i):ae(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),a.setFunc(O.depthFunc),a.setTest(O.depthTest),a.setMask(O.depthWrite),r.setMask(O.colorWrite);let Mt=O.stencilWrite;o.setTest(Mt),Mt&&(o.setMask(O.stencilWriteMask),o.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),o.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),Xe(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?at(i.SAMPLE_ALPHA_TO_COVERAGE):Xt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Be(O){F!==O&&(O?i.frontFace(i.CW):i.frontFace(i.CCW),F=O)}function ze(O){O!==$u?(at(i.CULL_FACE),O!==G&&(O===jc?i.cullFace(i.BACK):O===Ju?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Xt(i.CULL_FACE),G=O}function Ve(O){O!==V&&(K&&i.lineWidth(O),V=O)}function Xe(O,pt,J){O?(at(i.POLYGON_OFFSET_FILL),(Q!==pt||Y!==J)&&(Q=pt,Y=J,a.getReversed()&&(pt=-pt),i.polygonOffset(pt,J))):Xt(i.POLYGON_OFFSET_FILL)}function De(O){O?at(i.SCISSOR_TEST):Xt(i.SCISSOR_TEST)}function be(O){O===void 0&&(O=i.TEXTURE0+it-1),_t!==O&&(i.activeTexture(O),_t=O)}function B(O,pt,J){J===void 0&&(_t===null?J=i.TEXTURE0+it-1:J=_t);let Mt=ft[J];Mt===void 0&&(Mt={type:void 0,texture:void 0},ft[J]=Mt),(Mt.type!==O||Mt.texture!==pt)&&(_t!==J&&(i.activeTexture(J),_t=J),i.bindTexture(O,pt||mt[O]),Mt.type=O,Mt.texture=pt)}function Qe(){let O=ft[_t];O!==void 0&&O.type!==void 0&&(i.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function fe(){try{i.compressedTexImage2D(...arguments)}catch(O){qt("WebGLState:",O)}}function T(){try{i.compressedTexImage3D(...arguments)}catch(O){qt("WebGLState:",O)}}function g(){try{i.texSubImage2D(...arguments)}catch(O){qt("WebGLState:",O)}}function H(){try{i.texSubImage3D(...arguments)}catch(O){qt("WebGLState:",O)}}function Z(){try{i.compressedTexSubImage2D(...arguments)}catch(O){qt("WebGLState:",O)}}function et(){try{i.compressedTexSubImage3D(...arguments)}catch(O){qt("WebGLState:",O)}}function ut(){try{i.texStorage2D(...arguments)}catch(O){qt("WebGLState:",O)}}function gt(){try{i.texStorage3D(...arguments)}catch(O){qt("WebGLState:",O)}}function nt(){try{i.texImage2D(...arguments)}catch(O){qt("WebGLState:",O)}}function st(){try{i.texImage3D(...arguments)}catch(O){qt("WebGLState:",O)}}function yt(O){return m[O]!==void 0?m[O]:i.getParameter(O)}function Ot(O,pt){m[O]!==pt&&(i.pixelStorei(O,pt),m[O]=pt)}function bt(O){ye.equals(O)===!1&&(i.scissor(O.x,O.y,O.z,O.w),ye.copy(O))}function xt(O){Ft.equals(O)===!1&&(i.viewport(O.x,O.y,O.z,O.w),Ft.copy(O))}function Bt(O,pt){let J=l.get(pt);J===void 0&&(J=new WeakMap,l.set(pt,J));let Mt=J.get(O);Mt===void 0&&(Mt=i.getUniformBlockIndex(pt,O.name),J.set(O,Mt))}function Wt(O,pt){let Mt=l.get(pt).get(O);c.get(pt)!==Mt&&(i.uniformBlockBinding(pt,Mt,O.__bindingPointIndex),c.set(pt,Mt))}function Ut(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),d={},m={},_t=null,ft={},h={},x=new WeakMap,p=[],S=null,_=!1,f=null,A=null,I=null,E=null,R=null,w=null,D=null,v=new kt(0,0,0),C=0,k=!1,F=null,G=null,V=null,Q=null,Y=null,ye.set(0,0,i.canvas.width,i.canvas.height),Ft.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:at,disable:Xt,bindFramebuffer:Jt,drawBuffers:Et,useProgram:Te,setBlending:ae,setMaterial:ue,setFlipSided:Be,setCullFace:ze,setLineWidth:Ve,setPolygonOffset:Xe,setScissorTest:De,activeTexture:be,bindTexture:B,unbindTexture:Qe,compressedTexImage2D:fe,compressedTexImage3D:T,texImage2D:nt,texImage3D:st,pixelStorei:Ot,getParameter:yt,updateUBOMapping:Bt,uniformBlockBinding:Wt,texStorage2D:ut,texStorage3D:gt,texSubImage2D:g,texSubImage3D:H,compressedTexSubImage2D:Z,compressedTexSubImage3D:et,scissor:bt,viewport:xt,reset:Ut}}function ox(i,t,e,n,s,r,a){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new $t,d=new WeakMap,m=new Set,h,x=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function S(T,g){return p?new OffscreenCanvas(T,g):ta("canvas")}function _(T,g,H){let Z=1,et=fe(T);if((et.width>H||et.height>H)&&(Z=H/Math.max(et.width,et.height)),Z<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){let ut=Math.floor(Z*et.width),gt=Math.floor(Z*et.height);h===void 0&&(h=S(ut,gt));let nt=g?S(ut,gt):h;return nt.width=ut,nt.height=gt,nt.getContext("2d").drawImage(T,0,0,ut,gt),Gt("WebGLRenderer: Texture has been resized from ("+et.width+"x"+et.height+") to ("+ut+"x"+gt+")."),nt}else return"data"in T&&Gt("WebGLRenderer: Image in DataTexture is too big ("+et.width+"x"+et.height+")."),T;return T}function f(T){return T.generateMipmaps}function A(T){i.generateMipmap(T)}function I(T){return T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?i.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function E(T,g,H,Z,et,ut=!1){if(T!==null){if(i[T]!==void 0)return i[T];Gt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let gt;Z&&(gt=t.get("EXT_texture_norm16"),gt||Gt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let nt=g;if(g===i.RED&&(H===i.FLOAT&&(nt=i.R32F),H===i.HALF_FLOAT&&(nt=i.R16F),H===i.UNSIGNED_BYTE&&(nt=i.R8),H===i.UNSIGNED_SHORT&&gt&&(nt=gt.R16_EXT),H===i.SHORT&&gt&&(nt=gt.R16_SNORM_EXT)),g===i.RED_INTEGER&&(H===i.UNSIGNED_BYTE&&(nt=i.R8UI),H===i.UNSIGNED_SHORT&&(nt=i.R16UI),H===i.UNSIGNED_INT&&(nt=i.R32UI),H===i.BYTE&&(nt=i.R8I),H===i.SHORT&&(nt=i.R16I),H===i.INT&&(nt=i.R32I)),g===i.RG&&(H===i.FLOAT&&(nt=i.RG32F),H===i.HALF_FLOAT&&(nt=i.RG16F),H===i.UNSIGNED_BYTE&&(nt=i.RG8),H===i.UNSIGNED_SHORT&&gt&&(nt=gt.RG16_EXT),H===i.SHORT&&gt&&(nt=gt.RG16_SNORM_EXT)),g===i.RG_INTEGER&&(H===i.UNSIGNED_BYTE&&(nt=i.RG8UI),H===i.UNSIGNED_SHORT&&(nt=i.RG16UI),H===i.UNSIGNED_INT&&(nt=i.RG32UI),H===i.BYTE&&(nt=i.RG8I),H===i.SHORT&&(nt=i.RG16I),H===i.INT&&(nt=i.RG32I)),g===i.RGB_INTEGER&&(H===i.UNSIGNED_BYTE&&(nt=i.RGB8UI),H===i.UNSIGNED_SHORT&&(nt=i.RGB16UI),H===i.UNSIGNED_INT&&(nt=i.RGB32UI),H===i.BYTE&&(nt=i.RGB8I),H===i.SHORT&&(nt=i.RGB16I),H===i.INT&&(nt=i.RGB32I)),g===i.RGBA_INTEGER&&(H===i.UNSIGNED_BYTE&&(nt=i.RGBA8UI),H===i.UNSIGNED_SHORT&&(nt=i.RGBA16UI),H===i.UNSIGNED_INT&&(nt=i.RGBA32UI),H===i.BYTE&&(nt=i.RGBA8I),H===i.SHORT&&(nt=i.RGBA16I),H===i.INT&&(nt=i.RGBA32I)),g===i.RGB&&(H===i.UNSIGNED_SHORT&&gt&&(nt=gt.RGB16_EXT),H===i.SHORT&&gt&&(nt=gt.RGB16_SNORM_EXT),H===i.UNSIGNED_INT_5_9_9_9_REV&&(nt=i.RGB9_E5),H===i.UNSIGNED_INT_10F_11F_11F_REV&&(nt=i.R11F_G11F_B10F)),g===i.RGBA){let st=ut?jr:he.getTransfer(et);H===i.FLOAT&&(nt=i.RGBA32F),H===i.HALF_FLOAT&&(nt=i.RGBA16F),H===i.UNSIGNED_BYTE&&(nt=st===ve?i.SRGB8_ALPHA8:i.RGBA8),H===i.UNSIGNED_SHORT&&gt&&(nt=gt.RGBA16_EXT),H===i.SHORT&&gt&&(nt=gt.RGBA16_SNORM_EXT),H===i.UNSIGNED_SHORT_4_4_4_4&&(nt=i.RGBA4),H===i.UNSIGNED_SHORT_5_5_5_1&&(nt=i.RGB5_A1)}return(nt===i.R16F||nt===i.R32F||nt===i.RG16F||nt===i.RG32F||nt===i.RGBA16F||nt===i.RGBA32F)&&t.get("EXT_color_buffer_float"),nt}function R(T,g){let H;return T?g===null||g===ri||g===Er?H=i.DEPTH24_STENCIL8:g===ai?H=i.DEPTH32F_STENCIL8:g===Sr&&(H=i.DEPTH24_STENCIL8,Gt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):g===null||g===ri||g===Er?H=i.DEPTH_COMPONENT24:g===ai?H=i.DEPTH_COMPONENT32F:g===Sr&&(H=i.DEPTH_COMPONENT16),H}function w(T,g){return f(T)===!0||T.isFramebufferTexture&&T.minFilter!==on&&T.minFilter!==Ue?Math.log2(Math.max(g.width,g.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?g.mipmaps.length:1}function D(T){let g=T.target;g.removeEventListener("dispose",D),C(g),g.isVideoTexture&&d.delete(g),g.isHTMLTexture&&m.delete(g)}function v(T){let g=T.target;g.removeEventListener("dispose",v),F(g)}function C(T){let g=n.get(T);if(g.__webglInit===void 0)return;let H=T.source,Z=x.get(H);if(Z){let et=Z[g.__cacheKey];et.usedTimes--,et.usedTimes===0&&k(T),Object.keys(Z).length===0&&x.delete(H)}n.remove(T)}function k(T){let g=n.get(T);i.deleteTexture(g.__webglTexture);let H=T.source,Z=x.get(H);delete Z[g.__cacheKey],a.memory.textures--}function F(T){let g=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(g.__webglFramebuffer[Z]))for(let et=0;et<g.__webglFramebuffer[Z].length;et++)i.deleteFramebuffer(g.__webglFramebuffer[Z][et]);else i.deleteFramebuffer(g.__webglFramebuffer[Z]);g.__webglDepthbuffer&&i.deleteRenderbuffer(g.__webglDepthbuffer[Z])}else{if(Array.isArray(g.__webglFramebuffer))for(let Z=0;Z<g.__webglFramebuffer.length;Z++)i.deleteFramebuffer(g.__webglFramebuffer[Z]);else i.deleteFramebuffer(g.__webglFramebuffer);if(g.__webglDepthbuffer&&i.deleteRenderbuffer(g.__webglDepthbuffer),g.__webglMultisampledFramebuffer&&i.deleteFramebuffer(g.__webglMultisampledFramebuffer),g.__webglColorRenderbuffer)for(let Z=0;Z<g.__webglColorRenderbuffer.length;Z++)g.__webglColorRenderbuffer[Z]&&i.deleteRenderbuffer(g.__webglColorRenderbuffer[Z]);g.__webglDepthRenderbuffer&&i.deleteRenderbuffer(g.__webglDepthRenderbuffer)}let H=T.textures;for(let Z=0,et=H.length;Z<et;Z++){let ut=n.get(H[Z]);ut.__webglTexture&&(i.deleteTexture(ut.__webglTexture),a.memory.textures--),n.remove(H[Z])}n.remove(T)}let G=0;function V(){G=0}function Q(){return G}function Y(T){G=T}function it(){let T=G;return T>=s.maxTextures&&Gt("WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),G+=1,T}function K(T){let g=[];return g.push(T.wrapS),g.push(T.wrapT),g.push(T.wrapR||0),g.push(T.magFilter),g.push(T.minFilter),g.push(T.anisotropy),g.push(T.internalFormat),g.push(T.format),g.push(T.type),g.push(T.generateMipmaps),g.push(T.premultiplyAlpha),g.push(T.flipY),g.push(T.unpackAlignment),g.push(T.colorSpace),g.join()}function rt(T,g){let H=n.get(T);if(T.isVideoTexture&&B(T),T.isRenderTargetTexture===!1&&T.isExternalTexture!==!0&&T.version>0&&H.__version!==T.version){let Z=T.image;if(Z===null)Gt("WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)Gt("WebGLRenderer: Texture marked for update but image is incomplete");else{Xt(H,T,g);return}}else T.isExternalTexture&&(H.__webglTexture=T.sourceTexture?T.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,H.__webglTexture,i.TEXTURE0+g)}function ct(T,g){let H=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&H.__version!==T.version){Xt(H,T,g);return}else T.isExternalTexture&&(H.__webglTexture=T.sourceTexture?T.sourceTexture:null);e.bindTexture(i.TEXTURE_2D_ARRAY,H.__webglTexture,i.TEXTURE0+g)}function _t(T,g){let H=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&H.__version!==T.version){Xt(H,T,g);return}e.bindTexture(i.TEXTURE_3D,H.__webglTexture,i.TEXTURE0+g)}function ft(T,g){let H=n.get(T);if(T.isCubeDepthTexture!==!0&&T.version>0&&H.__version!==T.version){Jt(H,T,g);return}e.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture,i.TEXTURE0+g)}let Rt={[So]:i.REPEAT,[pi]:i.CLAMP_TO_EDGE,[Eo]:i.MIRRORED_REPEAT},ie={[on]:i.NEAREST,[md]:i.NEAREST_MIPMAP_NEAREST,[ma]:i.NEAREST_MIPMAP_LINEAR,[Ue]:i.LINEAR,[Qo]:i.LINEAR_MIPMAP_NEAREST,[si]:i.LINEAR_MIPMAP_LINEAR},ye={[xd]:i.NEVER,[Sd]:i.ALWAYS,[vd]:i.LESS,[Fl]:i.LEQUAL,[yd]:i.EQUAL,[Ol]:i.GEQUAL,[Md]:i.GREATER,[bd]:i.NOTEQUAL};function Ft(T,g){if(g.type===ai&&t.has("OES_texture_float_linear")===!1&&(g.magFilter===Ue||g.magFilter===Qo||g.magFilter===ma||g.magFilter===si||g.minFilter===Ue||g.minFilter===Qo||g.minFilter===ma||g.minFilter===si)&&Gt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,Rt[g.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,Rt[g.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,Rt[g.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,ie[g.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,ie[g.minFilter]),g.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,ye[g.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(g.magFilter===on||g.minFilter!==ma&&g.minFilter!==si||g.type===ai&&t.has("OES_texture_float_linear")===!1)return;if(g.anisotropy>1||n.get(g).__currentAnisotropy){let H=t.get("EXT_texture_filter_anisotropic");i.texParameterf(T,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(g.anisotropy,s.getMaxAnisotropy())),n.get(g).__currentAnisotropy=g.anisotropy}}}function tt(T,g){let H=!1;T.__webglInit===void 0&&(T.__webglInit=!0,g.addEventListener("dispose",D));let Z=g.source,et=x.get(Z);et===void 0&&(et={},x.set(Z,et));let ut=K(g);if(ut!==T.__cacheKey){et[ut]===void 0&&(et[ut]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,H=!0),et[ut].usedTimes++;let gt=et[T.__cacheKey];gt!==void 0&&(et[T.__cacheKey].usedTimes--,gt.usedTimes===0&&k(g)),T.__cacheKey=ut,T.__webglTexture=et[ut].texture}return H}function mt(T,g,H){return Math.floor(Math.floor(T/H)/g)}function at(T,g,H,Z){let ut=T.updateRanges;if(ut.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,g.width,g.height,H,Z,g.data);else{ut.sort((Ot,bt)=>Ot.start-bt.start);let gt=0;for(let Ot=1;Ot<ut.length;Ot++){let bt=ut[gt],xt=ut[Ot],Bt=bt.start+bt.count,Wt=mt(xt.start,g.width,4),Ut=mt(bt.start,g.width,4);xt.start<=Bt+1&&Wt===Ut&&mt(xt.start+xt.count-1,g.width,4)===Wt?bt.count=Math.max(bt.count,xt.start+xt.count-bt.start):(++gt,ut[gt]=xt)}ut.length=gt+1;let nt=e.getParameter(i.UNPACK_ROW_LENGTH),st=e.getParameter(i.UNPACK_SKIP_PIXELS),yt=e.getParameter(i.UNPACK_SKIP_ROWS);e.pixelStorei(i.UNPACK_ROW_LENGTH,g.width);for(let Ot=0,bt=ut.length;Ot<bt;Ot++){let xt=ut[Ot],Bt=Math.floor(xt.start/4),Wt=Math.ceil(xt.count/4),Ut=Bt%g.width,O=Math.floor(Bt/g.width),pt=Wt,J=1;e.pixelStorei(i.UNPACK_SKIP_PIXELS,Ut),e.pixelStorei(i.UNPACK_SKIP_ROWS,O),e.texSubImage2D(i.TEXTURE_2D,0,Ut,O,pt,J,H,Z,g.data)}T.clearUpdateRanges(),e.pixelStorei(i.UNPACK_ROW_LENGTH,nt),e.pixelStorei(i.UNPACK_SKIP_PIXELS,st),e.pixelStorei(i.UNPACK_SKIP_ROWS,yt)}}function Xt(T,g,H){let Z=i.TEXTURE_2D;(g.isDataArrayTexture||g.isCompressedArrayTexture)&&(Z=i.TEXTURE_2D_ARRAY),g.isData3DTexture&&(Z=i.TEXTURE_3D);let et=tt(T,g),ut=g.source;e.bindTexture(Z,T.__webglTexture,i.TEXTURE0+H);let gt=n.get(ut);if(ut.version!==gt.__version||et===!0){if(e.activeTexture(i.TEXTURE0+H),(typeof ImageBitmap<"u"&&g.image instanceof ImageBitmap)===!1){let J=he.getPrimaries(he.workingColorSpace),Mt=g.colorSpace===Bi?null:he.getPrimaries(g.colorSpace),Tt=g.colorSpace===Bi||J===Mt?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Tt)}e.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment);let st=_(g.image,!1,s.maxTextureSize);st=Qe(g,st);let yt=r.convert(g.format,g.colorSpace),Ot=r.convert(g.type),bt=E(g.internalFormat,yt,Ot,g.normalized,g.colorSpace,g.isVideoTexture);Ft(Z,g);let xt,Bt=g.mipmaps,Wt=g.isVideoTexture!==!0,Ut=gt.__version===void 0||et===!0,O=ut.dataReady,pt=w(g,st);if(g.isDepthTexture)bt=R(g.format===cs,g.type),Ut&&(Wt?e.texStorage2D(i.TEXTURE_2D,1,bt,st.width,st.height):e.texImage2D(i.TEXTURE_2D,0,bt,st.width,st.height,0,yt,Ot,null));else if(g.isDataTexture)if(Bt.length>0){Wt&&Ut&&e.texStorage2D(i.TEXTURE_2D,pt,bt,Bt[0].width,Bt[0].height);for(let J=0,Mt=Bt.length;J<Mt;J++)xt=Bt[J],Wt?O&&e.texSubImage2D(i.TEXTURE_2D,J,0,0,xt.width,xt.height,yt,Ot,xt.data):e.texImage2D(i.TEXTURE_2D,J,bt,xt.width,xt.height,0,yt,Ot,xt.data);g.generateMipmaps=!1}else Wt?(Ut&&e.texStorage2D(i.TEXTURE_2D,pt,bt,st.width,st.height),O&&at(g,st,yt,Ot)):e.texImage2D(i.TEXTURE_2D,0,bt,st.width,st.height,0,yt,Ot,st.data);else if(g.isCompressedTexture)if(g.isCompressedArrayTexture){Wt&&Ut&&e.texStorage3D(i.TEXTURE_2D_ARRAY,pt,bt,Bt[0].width,Bt[0].height,st.depth);for(let J=0,Mt=Bt.length;J<Mt;J++)if(xt=Bt[J],g.format!==Jn)if(yt!==null)if(Wt){if(O)if(g.layerUpdates.size>0){let Tt=Eh(xt.width,xt.height,g.format,g.type);for(let ot of g.layerUpdates){let zt=xt.data.subarray(ot*Tt/xt.data.BYTES_PER_ELEMENT,(ot+1)*Tt/xt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,ot,xt.width,xt.height,1,yt,zt)}g.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,0,xt.width,xt.height,st.depth,yt,xt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,J,bt,xt.width,xt.height,st.depth,0,xt.data,0,0);else Gt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Wt?O&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,0,xt.width,xt.height,st.depth,yt,Ot,xt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,J,bt,xt.width,xt.height,st.depth,0,yt,Ot,xt.data)}else{Wt&&Ut&&e.texStorage2D(i.TEXTURE_2D,pt,bt,Bt[0].width,Bt[0].height);for(let J=0,Mt=Bt.length;J<Mt;J++)xt=Bt[J],g.format!==Jn?yt!==null?Wt?O&&e.compressedTexSubImage2D(i.TEXTURE_2D,J,0,0,xt.width,xt.height,yt,xt.data):e.compressedTexImage2D(i.TEXTURE_2D,J,bt,xt.width,xt.height,0,xt.data):Gt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Wt?O&&e.texSubImage2D(i.TEXTURE_2D,J,0,0,xt.width,xt.height,yt,Ot,xt.data):e.texImage2D(i.TEXTURE_2D,J,bt,xt.width,xt.height,0,yt,Ot,xt.data)}else if(g.isDataArrayTexture)if(Wt){if(Ut&&e.texStorage3D(i.TEXTURE_2D_ARRAY,pt,bt,st.width,st.height,st.depth),O)if(g.layerUpdates.size>0){let J=Eh(st.width,st.height,g.format,g.type);for(let Mt of g.layerUpdates){let Tt=st.data.subarray(Mt*J/st.data.BYTES_PER_ELEMENT,(Mt+1)*J/st.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Mt,st.width,st.height,1,yt,Ot,Tt)}g.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,st.width,st.height,st.depth,yt,Ot,st.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,bt,st.width,st.height,st.depth,0,yt,Ot,st.data);else if(g.isData3DTexture)Wt?(Ut&&e.texStorage3D(i.TEXTURE_3D,pt,bt,st.width,st.height,st.depth),O&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,st.width,st.height,st.depth,yt,Ot,st.data)):e.texImage3D(i.TEXTURE_3D,0,bt,st.width,st.height,st.depth,0,yt,Ot,st.data);else if(g.isFramebufferTexture){if(Ut)if(Wt)e.texStorage2D(i.TEXTURE_2D,pt,bt,st.width,st.height);else{let J=st.width,Mt=st.height;for(let Tt=0;Tt<pt;Tt++)e.texImage2D(i.TEXTURE_2D,Tt,bt,J,Mt,0,yt,Ot,null),J>>=1,Mt>>=1}}else if(g.isHTMLTexture){if("texElementImage2D"in i){let J=i.canvas;if(J.hasAttribute("layoutsubtree")||J.setAttribute("layoutsubtree","true"),st.parentNode!==J){J.appendChild(st),m.add(g),J.onpaint=Mt=>{let Tt=Mt.changedElements;for(let ot of m)Tt.includes(ot.image)&&(ot.needsUpdate=!0)},J.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,st);else{let Tt=i.RGBA,ot=i.RGBA,zt=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,Tt,ot,zt,st)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Bt.length>0){if(Wt&&Ut){let J=fe(Bt[0]);e.texStorage2D(i.TEXTURE_2D,pt,bt,J.width,J.height)}for(let J=0,Mt=Bt.length;J<Mt;J++)xt=Bt[J],Wt?O&&e.texSubImage2D(i.TEXTURE_2D,J,0,0,yt,Ot,xt):e.texImage2D(i.TEXTURE_2D,J,bt,yt,Ot,xt);g.generateMipmaps=!1}else if(Wt){if(Ut){let J=fe(st);e.texStorage2D(i.TEXTURE_2D,pt,bt,J.width,J.height)}O&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,yt,Ot,st)}else e.texImage2D(i.TEXTURE_2D,0,bt,yt,Ot,st);f(g)&&A(Z),gt.__version=ut.version,g.onUpdate&&g.onUpdate(g)}T.__version=g.version}function Jt(T,g,H){if(g.image.length!==6)return;let Z=tt(T,g),et=g.source;e.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+H);let ut=n.get(et);if(et.version!==ut.__version||Z===!0){e.activeTexture(i.TEXTURE0+H);let gt=he.getPrimaries(he.workingColorSpace),nt=g.colorSpace===Bi?null:he.getPrimaries(g.colorSpace),st=g.colorSpace===Bi||gt===nt?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),e.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,st);let yt=g.isCompressedTexture||g.image[0].isCompressedTexture,Ot=g.image[0]&&g.image[0].isDataTexture,bt=[];for(let ot=0;ot<6;ot++)!yt&&!Ot?bt[ot]=_(g.image[ot],!0,s.maxCubemapSize):bt[ot]=Ot?g.image[ot].image:g.image[ot],bt[ot]=Qe(g,bt[ot]);let xt=bt[0],Bt=r.convert(g.format,g.colorSpace),Wt=r.convert(g.type),Ut=E(g.internalFormat,Bt,Wt,g.normalized,g.colorSpace),O=g.isVideoTexture!==!0,pt=ut.__version===void 0||Z===!0,J=et.dataReady,Mt=w(g,xt);Ft(i.TEXTURE_CUBE_MAP,g);let Tt;if(yt){O&&pt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Mt,Ut,xt.width,xt.height);for(let ot=0;ot<6;ot++){Tt=bt[ot].mipmaps;for(let zt=0;zt<Tt.length;zt++){let Dt=Tt[zt];g.format!==Jn?Bt!==null?O?J&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,zt,0,0,Dt.width,Dt.height,Bt,Dt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,zt,Ut,Dt.width,Dt.height,0,Dt.data):Gt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):O?J&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,zt,0,0,Dt.width,Dt.height,Bt,Wt,Dt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,zt,Ut,Dt.width,Dt.height,0,Bt,Wt,Dt.data)}}}else{if(Tt=g.mipmaps,O&&pt){Tt.length>0&&Mt++;let ot=fe(bt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Mt,Ut,ot.width,ot.height)}for(let ot=0;ot<6;ot++)if(Ot){O?J&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,0,0,bt[ot].width,bt[ot].height,Bt,Wt,bt[ot].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,Ut,bt[ot].width,bt[ot].height,0,Bt,Wt,bt[ot].data);for(let zt=0;zt<Tt.length;zt++){let Ae=Tt[zt].image[ot].image;O?J&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,zt+1,0,0,Ae.width,Ae.height,Bt,Wt,Ae.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,zt+1,Ut,Ae.width,Ae.height,0,Bt,Wt,Ae.data)}}else{O?J&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,0,0,Bt,Wt,bt[ot]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,Ut,Bt,Wt,bt[ot]);for(let zt=0;zt<Tt.length;zt++){let Dt=Tt[zt];O?J&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,zt+1,0,0,Bt,Wt,Dt.image[ot]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,zt+1,Ut,Bt,Wt,Dt.image[ot])}}}f(g)&&A(i.TEXTURE_CUBE_MAP),ut.__version=et.version,g.onUpdate&&g.onUpdate(g)}T.__version=g.version}function Et(T,g,H,Z,et,ut){let gt=r.convert(H.format,H.colorSpace),nt=r.convert(H.type),st=E(H.internalFormat,gt,nt,H.normalized,H.colorSpace),yt=n.get(g),Ot=n.get(H);if(Ot.__renderTarget=g,!yt.__hasExternalTextures){let bt=Math.max(1,g.width>>ut),xt=Math.max(1,g.height>>ut);et===i.TEXTURE_3D||et===i.TEXTURE_2D_ARRAY?e.texImage3D(et,ut,st,bt,xt,g.depth,0,gt,nt,null):e.texImage2D(et,ut,st,bt,xt,0,gt,nt,null)}e.bindFramebuffer(i.FRAMEBUFFER,T),be(g)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Z,et,Ot.__webglTexture,0,De(g)):(et===i.TEXTURE_2D||et>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&et<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Z,et,Ot.__webglTexture,ut),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Te(T,g,H){if(i.bindRenderbuffer(i.RENDERBUFFER,T),g.depthBuffer){let Z=g.depthTexture,et=Z&&Z.isDepthTexture?Z.type:null,ut=R(g.stencilBuffer,et),gt=g.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;be(g)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,De(g),ut,g.width,g.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,De(g),ut,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,ut,g.width,g.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,gt,i.RENDERBUFFER,T)}else{let Z=g.textures;for(let et=0;et<Z.length;et++){let ut=Z[et],gt=r.convert(ut.format,ut.colorSpace),nt=r.convert(ut.type),st=E(ut.internalFormat,gt,nt,ut.normalized,ut.colorSpace);be(g)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,De(g),st,g.width,g.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,De(g),st,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,st,g.width,g.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function se(T,g,H){let Z=g.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(i.FRAMEBUFFER,T),!(g.depthTexture&&g.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let et=n.get(g.depthTexture);if(et.__renderTarget=g,(!et.__webglTexture||g.depthTexture.image.width!==g.width||g.depthTexture.image.height!==g.height)&&(g.depthTexture.image.width=g.width,g.depthTexture.image.height=g.height,g.depthTexture.needsUpdate=!0),Z){if(et.__webglInit===void 0&&(et.__webglInit=!0,g.depthTexture.addEventListener("dispose",D)),et.__webglTexture===void 0){et.__webglTexture=i.createTexture(),e.bindTexture(i.TEXTURE_CUBE_MAP,et.__webglTexture),Ft(i.TEXTURE_CUBE_MAP,g.depthTexture);let yt=r.convert(g.depthTexture.format),Ot=r.convert(g.depthTexture.type),bt;g.depthTexture.format===mi?bt=i.DEPTH_COMPONENT24:g.depthTexture.format===cs&&(bt=i.DEPTH24_STENCIL8);for(let xt=0;xt<6;xt++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,bt,g.width,g.height,0,yt,Ot,null)}}else rt(g.depthTexture,0);let ut=et.__webglTexture,gt=De(g),nt=Z?i.TEXTURE_CUBE_MAP_POSITIVE_X+H:i.TEXTURE_2D,st=g.depthTexture.format===cs?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(g.depthTexture.format===mi)be(g)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,st,nt,ut,0,gt):i.framebufferTexture2D(i.FRAMEBUFFER,st,nt,ut,0);else if(g.depthTexture.format===cs)be(g)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,st,nt,ut,0,gt):i.framebufferTexture2D(i.FRAMEBUFFER,st,nt,ut,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function pe(T){let g=n.get(T),H=T.isWebGLCubeRenderTarget===!0;if(g.__boundDepthTexture!==T.depthTexture){let Z=T.depthTexture;if(g.__depthDisposeCallback&&g.__depthDisposeCallback(),Z){let et=()=>{delete g.__boundDepthTexture,delete g.__depthDisposeCallback,Z.removeEventListener("dispose",et)};Z.addEventListener("dispose",et),g.__depthDisposeCallback=et}g.__boundDepthTexture=Z}if(T.depthTexture&&!g.__autoAllocateDepthBuffer)if(H)for(let Z=0;Z<6;Z++)se(g.__webglFramebuffer[Z],T,Z);else{let Z=T.texture.mipmaps;Z&&Z.length>0?se(g.__webglFramebuffer[0],T,0):se(g.__webglFramebuffer,T,0)}else if(H){g.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(e.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer[Z]),g.__webglDepthbuffer[Z]===void 0)g.__webglDepthbuffer[Z]=i.createRenderbuffer(),Te(g.__webglDepthbuffer[Z],T,!1);else{let et=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ut=g.__webglDepthbuffer[Z];i.bindRenderbuffer(i.RENDERBUFFER,ut),i.framebufferRenderbuffer(i.FRAMEBUFFER,et,i.RENDERBUFFER,ut)}}else{let Z=T.texture.mipmaps;if(Z&&Z.length>0?e.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer),g.__webglDepthbuffer===void 0)g.__webglDepthbuffer=i.createRenderbuffer(),Te(g.__webglDepthbuffer,T,!1);else{let et=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ut=g.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ut),i.framebufferRenderbuffer(i.FRAMEBUFFER,et,i.RENDERBUFFER,ut)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function ae(T,g,H){let Z=n.get(T);g!==void 0&&Et(Z.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),H!==void 0&&pe(T)}function ue(T){let g=T.texture,H=n.get(T),Z=n.get(g);T.addEventListener("dispose",v);let et=T.textures,ut=T.isWebGLCubeRenderTarget===!0,gt=et.length>1;if(gt||(Z.__webglTexture===void 0&&(Z.__webglTexture=i.createTexture()),Z.__version=g.version,a.memory.textures++),ut){H.__webglFramebuffer=[];for(let nt=0;nt<6;nt++)if(g.mipmaps&&g.mipmaps.length>0){H.__webglFramebuffer[nt]=[];for(let st=0;st<g.mipmaps.length;st++)H.__webglFramebuffer[nt][st]=i.createFramebuffer()}else H.__webglFramebuffer[nt]=i.createFramebuffer()}else{if(g.mipmaps&&g.mipmaps.length>0){H.__webglFramebuffer=[];for(let nt=0;nt<g.mipmaps.length;nt++)H.__webglFramebuffer[nt]=i.createFramebuffer()}else H.__webglFramebuffer=i.createFramebuffer();if(gt)for(let nt=0,st=et.length;nt<st;nt++){let yt=n.get(et[nt]);yt.__webglTexture===void 0&&(yt.__webglTexture=i.createTexture(),a.memory.textures++)}if(T.samples>0&&be(T)===!1){H.__webglMultisampledFramebuffer=i.createFramebuffer(),H.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let nt=0;nt<et.length;nt++){let st=et[nt];H.__webglColorRenderbuffer[nt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,H.__webglColorRenderbuffer[nt]);let yt=r.convert(st.format,st.colorSpace),Ot=r.convert(st.type),bt=E(st.internalFormat,yt,Ot,st.normalized,st.colorSpace,T.isXRRenderTarget===!0),xt=De(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,xt,bt,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+nt,i.RENDERBUFFER,H.__webglColorRenderbuffer[nt])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(H.__webglDepthRenderbuffer=i.createRenderbuffer(),Te(H.__webglDepthRenderbuffer,T,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ut){e.bindTexture(i.TEXTURE_CUBE_MAP,Z.__webglTexture),Ft(i.TEXTURE_CUBE_MAP,g);for(let nt=0;nt<6;nt++)if(g.mipmaps&&g.mipmaps.length>0)for(let st=0;st<g.mipmaps.length;st++)Et(H.__webglFramebuffer[nt][st],T,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,st);else Et(H.__webglFramebuffer[nt],T,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0);f(g)&&A(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(gt){for(let nt=0,st=et.length;nt<st;nt++){let yt=et[nt],Ot=n.get(yt),bt=i.TEXTURE_2D;(T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(bt=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(bt,Ot.__webglTexture),Ft(bt,yt),Et(H.__webglFramebuffer,T,yt,i.COLOR_ATTACHMENT0+nt,bt,0),f(yt)&&A(bt)}e.unbindTexture()}else{let nt=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(nt=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(nt,Z.__webglTexture),Ft(nt,g),g.mipmaps&&g.mipmaps.length>0)for(let st=0;st<g.mipmaps.length;st++)Et(H.__webglFramebuffer[st],T,g,i.COLOR_ATTACHMENT0,nt,st);else Et(H.__webglFramebuffer,T,g,i.COLOR_ATTACHMENT0,nt,0);f(g)&&A(nt),e.unbindTexture()}T.depthBuffer&&pe(T)}function Be(T){let g=T.textures;for(let H=0,Z=g.length;H<Z;H++){let et=g[H];if(f(et)){let ut=I(T),gt=n.get(et).__webglTexture;e.bindTexture(ut,gt),A(ut),e.unbindTexture()}}}let ze=[],Ve=[];function Xe(T){if(T.samples>0){if(be(T)===!1){let g=T.textures,H=T.width,Z=T.height,et=i.COLOR_BUFFER_BIT,ut=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,gt=n.get(T),nt=g.length>1;if(nt)for(let yt=0;yt<g.length;yt++)e.bindFramebuffer(i.FRAMEBUFFER,gt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,gt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,gt.__webglMultisampledFramebuffer);let st=T.texture.mipmaps;st&&st.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,gt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,gt.__webglFramebuffer);for(let yt=0;yt<g.length;yt++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(et|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(et|=i.STENCIL_BUFFER_BIT)),nt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,gt.__webglColorRenderbuffer[yt]);let Ot=n.get(g[yt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Ot,0)}i.blitFramebuffer(0,0,H,Z,0,0,H,Z,et,i.NEAREST),c===!0&&(ze.length=0,Ve.length=0,ze.push(i.COLOR_ATTACHMENT0+yt),T.depthBuffer&&T.resolveDepthBuffer===!1&&(ze.push(ut),Ve.push(ut),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Ve)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ze))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),nt)for(let yt=0;yt<g.length;yt++){e.bindFramebuffer(i.FRAMEBUFFER,gt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.RENDERBUFFER,gt.__webglColorRenderbuffer[yt]);let Ot=n.get(g[yt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,gt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.TEXTURE_2D,Ot,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,gt.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&c){let g=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[g])}}}function De(T){return Math.min(s.maxSamples,T.samples)}function be(T){let g=n.get(T);return T.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&g.__useRenderToTexture!==!1}function B(T){let g=a.render.frame;d.get(T)!==g&&(d.set(T,g),T.update())}function Qe(T,g){let H=T.colorSpace,Z=T.format,et=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||H!==Kr&&H!==Bi&&(he.getTransfer(H)===ve?(Z!==Jn||et!==Sn)&&Gt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):qt("WebGLTextures: Unsupported texture color space:",H)),g}function fe(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(l.width=T.naturalWidth||T.width,l.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(l.width=T.displayWidth,l.height=T.displayHeight):(l.width=T.width,l.height=T.height),l}this.allocateTextureUnit=it,this.resetTextureUnits=V,this.getTextureUnits=Q,this.setTextureUnits=Y,this.setTexture2D=rt,this.setTexture2DArray=ct,this.setTexture3D=_t,this.setTextureCube=ft,this.rebindTextures=ae,this.setupRenderTarget=ue,this.updateRenderTargetMipmap=Be,this.updateMultisampleRenderTarget=Xe,this.setupDepthRenderbuffer=pe,this.setupFrameBufferTexture=Et,this.useMultisampledRTT=be,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function lx(i,t){function e(n,s=Bi){let r,a=he.getTransfer(s);if(n===Sn)return i.UNSIGNED_BYTE;if(n===el)return i.UNSIGNED_SHORT_4_4_4_4;if(n===nl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===dh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===fh)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===hh)return i.BYTE;if(n===uh)return i.SHORT;if(n===Sr)return i.UNSIGNED_SHORT;if(n===tl)return i.INT;if(n===ri)return i.UNSIGNED_INT;if(n===ai)return i.FLOAT;if(n===$n)return i.HALF_FLOAT;if(n===ph)return i.ALPHA;if(n===mh)return i.RGB;if(n===Jn)return i.RGBA;if(n===mi)return i.DEPTH_COMPONENT;if(n===cs)return i.DEPTH_STENCIL;if(n===gh)return i.RED;if(n===il)return i.RED_INTEGER;if(n===hs)return i.RG;if(n===sl)return i.RG_INTEGER;if(n===rl)return i.RGBA_INTEGER;if(n===ga||n===_a||n===xa||n===va)if(a===ve)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===ga)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===_a)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===xa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===va)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===ga)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===_a)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===xa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===va)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===al||n===ol||n===ll||n===cl)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===al)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ol)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ll)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===cl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===hl||n===ul||n===dl||n===fl||n===pl||n===ya||n===ml)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===hl||n===ul)return a===ve?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===dl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===fl)return r.COMPRESSED_R11_EAC;if(n===pl)return r.COMPRESSED_SIGNED_R11_EAC;if(n===ya)return r.COMPRESSED_RG11_EAC;if(n===ml)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===gl||n===_l||n===xl||n===vl||n===yl||n===Ml||n===bl||n===Sl||n===El||n===Tl||n===Al||n===wl||n===Cl||n===Rl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===gl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===_l)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===xl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===vl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===yl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ml)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===bl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Sl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===El)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Tl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Al)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===wl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Cl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Rl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Pl||n===Il||n===Ll)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Pl)return a===ve?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Il)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ll)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Dl||n===Nl||n===Ma||n===Ul)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Dl)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Nl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ma)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ul)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Er?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}var cx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,hx=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Gh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new la(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new Se({vertexShader:cx,fragmentShader:hx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new $e(new gi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Wh=class extends ni{constructor(t,e){super();let n=this,s=null,r=1,a=null,o="local-floor",c=1,l=null,d=null,m=null,h=null,x=null,p=null,S=typeof XRWebGLBinding<"u",_=new Gh,f={},A=e.getContextAttributes(),I=null,E=null,R=[],w=[],D=new $t,v=null,C=new pn;C.viewport=new Le;let k=new pn;k.viewport=new Le;let F=[C,k],G=new $o,V=null,Q=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(tt){let mt=R[tt];return mt===void 0&&(mt=new mr,R[tt]=mt),mt.getTargetRaySpace()},this.getControllerGrip=function(tt){let mt=R[tt];return mt===void 0&&(mt=new mr,R[tt]=mt),mt.getGripSpace()},this.getHand=function(tt){let mt=R[tt];return mt===void 0&&(mt=new mr,R[tt]=mt),mt.getHandSpace()};function Y(tt){let mt=w.indexOf(tt.inputSource);if(mt===-1)return;let at=R[mt];at!==void 0&&(at.update(tt.inputSource,tt.frame,l||a),at.dispatchEvent({type:tt.type,data:tt.inputSource}))}function it(){s.removeEventListener("select",Y),s.removeEventListener("selectstart",Y),s.removeEventListener("selectend",Y),s.removeEventListener("squeeze",Y),s.removeEventListener("squeezestart",Y),s.removeEventListener("squeezeend",Y),s.removeEventListener("end",it),s.removeEventListener("inputsourceschange",K);for(let tt=0;tt<R.length;tt++){let mt=w[tt];mt!==null&&(w[tt]=null,R[tt].disconnect(mt))}V=null,Q=null,_.reset();for(let tt in f)delete f[tt];t.setRenderTarget(I),x=null,h=null,m=null,s=null,E=null,Ft.stop(),n.isPresenting=!1,t.setPixelRatio(v),t.setSize(D.width,D.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(tt){r=tt,n.isPresenting===!0&&Gt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(tt){o=tt,n.isPresenting===!0&&Gt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(tt){l=tt},this.getBaseLayer=function(){return h!==null?h:x},this.getBinding=function(){return m===null&&S&&(m=new XRWebGLBinding(s,e)),m},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(tt){if(s=tt,s!==null){if(I=t.getRenderTarget(),s.addEventListener("select",Y),s.addEventListener("selectstart",Y),s.addEventListener("selectend",Y),s.addEventListener("squeeze",Y),s.addEventListener("squeezestart",Y),s.addEventListener("squeezeend",Y),s.addEventListener("end",it),s.addEventListener("inputsourceschange",K),A.xrCompatible!==!0&&await e.makeXRCompatible(),v=t.getPixelRatio(),t.getSize(D),S&&"createProjectionLayer"in XRWebGLBinding.prototype){let at=null,Xt=null,Jt=null;A.depth&&(Jt=A.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,at=A.stencil?cs:mi,Xt=A.stencil?Er:ri);let Et={colorFormat:e.RGBA8,depthFormat:Jt,scaleFactor:r};m=this.getBinding(),h=m.createProjectionLayer(Et),s.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),E=new mn(h.textureWidth,h.textureHeight,{format:Jn,type:Sn,depthTexture:new Oi(h.textureWidth,h.textureHeight,Xt,void 0,void 0,void 0,void 0,void 0,void 0,at),stencilBuffer:A.stencil,colorSpace:t.outputColorSpace,samples:A.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}else{let at={antialias:A.antialias,alpha:!0,depth:A.depth,stencil:A.stencil,framebufferScaleFactor:r};x=new XRWebGLLayer(s,e,at),s.updateRenderState({baseLayer:x}),t.setPixelRatio(1),t.setSize(x.framebufferWidth,x.framebufferHeight,!1),E=new mn(x.framebufferWidth,x.framebufferHeight,{format:Jn,type:Sn,colorSpace:t.outputColorSpace,stencilBuffer:A.stencil,resolveDepthBuffer:x.ignoreDepthValues===!1,resolveStencilBuffer:x.ignoreDepthValues===!1})}E.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),Ft.setContext(s),Ft.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function K(tt){for(let mt=0;mt<tt.removed.length;mt++){let at=tt.removed[mt],Xt=w.indexOf(at);Xt>=0&&(w[Xt]=null,R[Xt].disconnect(at))}for(let mt=0;mt<tt.added.length;mt++){let at=tt.added[mt],Xt=w.indexOf(at);if(Xt===-1){for(let Et=0;Et<R.length;Et++)if(Et>=w.length){w.push(at),Xt=Et;break}else if(w[Et]===null){w[Et]=at,Xt=Et;break}if(Xt===-1)break}let Jt=R[Xt];Jt&&Jt.connect(at)}}let rt=new U,ct=new U;function _t(tt,mt,at){rt.setFromMatrixPosition(mt.matrixWorld),ct.setFromMatrixPosition(at.matrixWorld);let Xt=rt.distanceTo(ct),Jt=mt.projectionMatrix.elements,Et=at.projectionMatrix.elements,Te=Jt[14]/(Jt[10]-1),se=Jt[14]/(Jt[10]+1),pe=(Jt[9]+1)/Jt[5],ae=(Jt[9]-1)/Jt[5],ue=(Jt[8]-1)/Jt[0],Be=(Et[8]+1)/Et[0],ze=Te*ue,Ve=Te*Be,Xe=Xt/(-ue+Be),De=Xe*-ue;if(mt.matrixWorld.decompose(tt.position,tt.quaternion,tt.scale),tt.translateX(De),tt.translateZ(Xe),tt.matrixWorld.compose(tt.position,tt.quaternion,tt.scale),tt.matrixWorldInverse.copy(tt.matrixWorld).invert(),Jt[10]===-1)tt.projectionMatrix.copy(mt.projectionMatrix),tt.projectionMatrixInverse.copy(mt.projectionMatrixInverse);else{let be=Te+Xe,B=se+Xe,Qe=ze-De,fe=Ve+(Xt-De),T=pe*se/B*be,g=ae*se/B*be;tt.projectionMatrix.makePerspective(Qe,fe,T,g,be,B),tt.projectionMatrixInverse.copy(tt.projectionMatrix).invert()}}function ft(tt,mt){mt===null?tt.matrixWorld.copy(tt.matrix):tt.matrixWorld.multiplyMatrices(mt.matrixWorld,tt.matrix),tt.matrixWorldInverse.copy(tt.matrixWorld).invert()}this.updateCamera=function(tt){if(s===null)return;let mt=tt.near,at=tt.far;_.texture!==null&&(_.depthNear>0&&(mt=_.depthNear),_.depthFar>0&&(at=_.depthFar)),G.near=k.near=C.near=mt,G.far=k.far=C.far=at,(V!==G.near||Q!==G.far)&&(s.updateRenderState({depthNear:G.near,depthFar:G.far}),V=G.near,Q=G.far),G.layers.mask=tt.layers.mask|6,C.layers.mask=G.layers.mask&-5,k.layers.mask=G.layers.mask&-3;let Xt=tt.parent,Jt=G.cameras;ft(G,Xt);for(let Et=0;Et<Jt.length;Et++)ft(Jt[Et],Xt);Jt.length===2?_t(G,C,k):G.projectionMatrix.copy(C.projectionMatrix),Rt(tt,G,Xt)};function Rt(tt,mt,at){at===null?tt.matrix.copy(mt.matrixWorld):(tt.matrix.copy(at.matrixWorld),tt.matrix.invert(),tt.matrix.multiply(mt.matrixWorld)),tt.matrix.decompose(tt.position,tt.quaternion,tt.scale),tt.updateMatrixWorld(!0),tt.projectionMatrix.copy(mt.projectionMatrix),tt.projectionMatrixInverse.copy(mt.projectionMatrixInverse),tt.isPerspectiveCamera&&(tt.fov=fr*2*Math.atan(1/tt.projectionMatrix.elements[5]),tt.zoom=1)}this.getCamera=function(){return G},this.getFoveation=function(){if(!(h===null&&x===null))return c},this.setFoveation=function(tt){c=tt,h!==null&&(h.fixedFoveation=tt),x!==null&&x.fixedFoveation!==void 0&&(x.fixedFoveation=tt)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(G)},this.getCameraTexture=function(tt){return f[tt]};let ie=null;function ye(tt,mt){if(d=mt.getViewerPose(l||a),p=mt,d!==null){let at=d.views;x!==null&&(t.setRenderTargetFramebuffer(E,x.framebuffer),t.setRenderTarget(E));let Xt=!1;at.length!==G.cameras.length&&(G.cameras.length=0,Xt=!0);for(let se=0;se<at.length;se++){let pe=at[se],ae=null;if(x!==null)ae=x.getViewport(pe);else{let Be=m.getViewSubImage(h,pe);ae=Be.viewport,se===0&&(t.setRenderTargetTextures(E,Be.colorTexture,Be.depthStencilTexture),t.setRenderTarget(E))}let ue=F[se];ue===void 0&&(ue=new pn,ue.layers.enable(se),ue.viewport=new Le,F[se]=ue),ue.matrix.fromArray(pe.transform.matrix),ue.matrix.decompose(ue.position,ue.quaternion,ue.scale),ue.projectionMatrix.fromArray(pe.projectionMatrix),ue.projectionMatrixInverse.copy(ue.projectionMatrix).invert(),ue.viewport.set(ae.x,ae.y,ae.width,ae.height),se===0&&(G.matrix.copy(ue.matrix),G.matrix.decompose(G.position,G.quaternion,G.scale)),Xt===!0&&G.cameras.push(ue)}let Jt=s.enabledFeatures;if(Jt&&Jt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&S){m=n.getBinding();let se=m.getDepthInformation(at[0]);se&&se.isValid&&se.texture&&_.init(se,s.renderState)}if(Jt&&Jt.includes("camera-access")&&S){t.state.unbindTexture(),m=n.getBinding();for(let se=0;se<at.length;se++){let pe=at[se].camera;if(pe){let ae=f[pe];ae||(ae=new la,f[pe]=ae);let ue=m.getCameraImage(pe);ae.sourceTexture=ue}}}}for(let at=0;at<R.length;at++){let Xt=w[at],Jt=R[at];Xt!==null&&Jt!==void 0&&Jt.update(Xt,mt,l||a)}ie&&ie(tt,mt),mt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:mt}),p=null}let Ft=new Qd;Ft.setAnimationLoop(ye),this.setAnimationLoop=function(tt){ie=tt},this.dispose=function(){}}},ux=new Oe,af=new jt;af.set(-1,0,0,0,1,0,0,0,1);function dx(i,t){function e(_,f){_.matrixAutoUpdate===!0&&_.updateMatrix(),f.value.copy(_.matrix)}function n(_,f){f.color.getRGB(_.fogColor.value,Mh(i)),f.isFog?(_.fogNear.value=f.near,_.fogFar.value=f.far):f.isFogExp2&&(_.fogDensity.value=f.density)}function s(_,f,A,I,E){f.isNodeMaterial?f.uniformsNeedUpdate=!1:f.isMeshBasicMaterial?r(_,f):f.isMeshLambertMaterial?(r(_,f),f.envMap&&(_.envMapIntensity.value=f.envMapIntensity)):f.isMeshToonMaterial?(r(_,f),m(_,f)):f.isMeshPhongMaterial?(r(_,f),d(_,f),f.envMap&&(_.envMapIntensity.value=f.envMapIntensity)):f.isMeshStandardMaterial?(r(_,f),h(_,f),f.isMeshPhysicalMaterial&&x(_,f,E)):f.isMeshMatcapMaterial?(r(_,f),p(_,f)):f.isMeshDepthMaterial?r(_,f):f.isMeshDistanceMaterial?(r(_,f),S(_,f)):f.isMeshNormalMaterial?r(_,f):f.isLineBasicMaterial?(a(_,f),f.isLineDashedMaterial&&o(_,f)):f.isPointsMaterial?c(_,f,A,I):f.isSpriteMaterial?l(_,f):f.isShadowMaterial?(_.color.value.copy(f.color),_.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(_,f){_.opacity.value=f.opacity,f.color&&_.diffuse.value.copy(f.color),f.emissive&&_.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(_.map.value=f.map,e(f.map,_.mapTransform)),f.alphaMap&&(_.alphaMap.value=f.alphaMap,e(f.alphaMap,_.alphaMapTransform)),f.bumpMap&&(_.bumpMap.value=f.bumpMap,e(f.bumpMap,_.bumpMapTransform),_.bumpScale.value=f.bumpScale,f.side===cn&&(_.bumpScale.value*=-1)),f.normalMap&&(_.normalMap.value=f.normalMap,e(f.normalMap,_.normalMapTransform),_.normalScale.value.copy(f.normalScale),f.side===cn&&_.normalScale.value.negate()),f.displacementMap&&(_.displacementMap.value=f.displacementMap,e(f.displacementMap,_.displacementMapTransform),_.displacementScale.value=f.displacementScale,_.displacementBias.value=f.displacementBias),f.emissiveMap&&(_.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,_.emissiveMapTransform)),f.specularMap&&(_.specularMap.value=f.specularMap,e(f.specularMap,_.specularMapTransform)),f.alphaTest>0&&(_.alphaTest.value=f.alphaTest);let A=t.get(f),I=A.envMap,E=A.envMapRotation;I&&(_.envMap.value=I,_.envMapRotation.value.setFromMatrix4(ux.makeRotationFromEuler(E)).transpose(),I.isCubeTexture&&I.isRenderTargetTexture===!1&&_.envMapRotation.value.premultiply(af),_.reflectivity.value=f.reflectivity,_.ior.value=f.ior,_.refractionRatio.value=f.refractionRatio),f.lightMap&&(_.lightMap.value=f.lightMap,_.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,_.lightMapTransform)),f.aoMap&&(_.aoMap.value=f.aoMap,_.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,_.aoMapTransform))}function a(_,f){_.diffuse.value.copy(f.color),_.opacity.value=f.opacity,f.map&&(_.map.value=f.map,e(f.map,_.mapTransform))}function o(_,f){_.dashSize.value=f.dashSize,_.totalSize.value=f.dashSize+f.gapSize,_.scale.value=f.scale}function c(_,f,A,I){_.diffuse.value.copy(f.color),_.opacity.value=f.opacity,_.size.value=f.size*A,_.scale.value=I*.5,f.map&&(_.map.value=f.map,e(f.map,_.uvTransform)),f.alphaMap&&(_.alphaMap.value=f.alphaMap,e(f.alphaMap,_.alphaMapTransform)),f.alphaTest>0&&(_.alphaTest.value=f.alphaTest)}function l(_,f){_.diffuse.value.copy(f.color),_.opacity.value=f.opacity,_.rotation.value=f.rotation,f.map&&(_.map.value=f.map,e(f.map,_.mapTransform)),f.alphaMap&&(_.alphaMap.value=f.alphaMap,e(f.alphaMap,_.alphaMapTransform)),f.alphaTest>0&&(_.alphaTest.value=f.alphaTest)}function d(_,f){_.specular.value.copy(f.specular),_.shininess.value=Math.max(f.shininess,1e-4)}function m(_,f){f.gradientMap&&(_.gradientMap.value=f.gradientMap)}function h(_,f){_.metalness.value=f.metalness,f.metalnessMap&&(_.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,_.metalnessMapTransform)),_.roughness.value=f.roughness,f.roughnessMap&&(_.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,_.roughnessMapTransform)),f.envMap&&(_.envMapIntensity.value=f.envMapIntensity)}function x(_,f,A){_.ior.value=f.ior,f.sheen>0&&(_.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),_.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(_.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,_.sheenColorMapTransform)),f.sheenRoughnessMap&&(_.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,_.sheenRoughnessMapTransform))),f.clearcoat>0&&(_.clearcoat.value=f.clearcoat,_.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(_.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,_.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(_.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,_.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(_.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,_.clearcoatNormalMapTransform),_.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===cn&&_.clearcoatNormalScale.value.negate())),f.dispersion>0&&(_.dispersion.value=f.dispersion),f.iridescence>0&&(_.iridescence.value=f.iridescence,_.iridescenceIOR.value=f.iridescenceIOR,_.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],_.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(_.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,_.iridescenceMapTransform)),f.iridescenceThicknessMap&&(_.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,_.iridescenceThicknessMapTransform))),f.transmission>0&&(_.transmission.value=f.transmission,_.transmissionSamplerMap.value=A.texture,_.transmissionSamplerSize.value.set(A.width,A.height),f.transmissionMap&&(_.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,_.transmissionMapTransform)),_.thickness.value=f.thickness,f.thicknessMap&&(_.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,_.thicknessMapTransform)),_.attenuationDistance.value=f.attenuationDistance,_.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(_.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(_.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,_.anisotropyMapTransform))),_.specularIntensity.value=f.specularIntensity,_.specularColor.value.copy(f.specularColor),f.specularColorMap&&(_.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,_.specularColorMapTransform)),f.specularIntensityMap&&(_.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,_.specularIntensityMapTransform))}function p(_,f){f.matcap&&(_.matcap.value=f.matcap)}function S(_,f){let A=t.get(f).light;_.referencePosition.value.setFromMatrixPosition(A.matrixWorld),_.nearDistance.value=A.shadow.camera.near,_.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function fx(i,t,e,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(E,R){let w=R.program;n.uniformBlockBinding(E,w)}function l(E,R){let w=s[E.id];w===void 0&&(_(E),w=d(E),s[E.id]=w,E.addEventListener("dispose",A));let D=R.program;n.updateUBOMapping(E,D);let v=t.render.frame;r[E.id]!==v&&(h(E),r[E.id]=v)}function d(E){let R=m();E.__bindingPointIndex=R;let w=i.createBuffer(),D=E.__size,v=E.usage;return i.bindBuffer(i.UNIFORM_BUFFER,w),i.bufferData(i.UNIFORM_BUFFER,D,v),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,R,w),w}function m(){for(let E=0;E<o;E++)if(a.indexOf(E)===-1)return a.push(E),E;return qt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(E){let R=s[E.id],w=E.uniforms,D=E.__cache;i.bindBuffer(i.UNIFORM_BUFFER,R);for(let v=0,C=w.length;v<C;v++){let k=w[v];if(Array.isArray(k))for(let F=0,G=k.length;F<G;F++)x(k[F],v,F,D);else x(k,v,0,D)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function x(E,R,w,D){if(S(E,R,w,D)===!0){let v=E.__offset,C=E.value;if(Array.isArray(C)){let k=0;for(let F=0;F<C.length;F++){let G=C[F],V=f(G);p(G,E.__data,k),typeof G!="number"&&typeof G!="boolean"&&!G.isMatrix3&&!ArrayBuffer.isView(G)&&(k+=V.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(C,E.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,v,E.__data)}}function p(E,R,w){typeof E=="number"||typeof E=="boolean"?R[0]=E:E.isMatrix3?(R[0]=E.elements[0],R[1]=E.elements[1],R[2]=E.elements[2],R[3]=0,R[4]=E.elements[3],R[5]=E.elements[4],R[6]=E.elements[5],R[7]=0,R[8]=E.elements[6],R[9]=E.elements[7],R[10]=E.elements[8],R[11]=0):ArrayBuffer.isView(E)?R.set(new E.constructor(E.buffer,E.byteOffset,R.length)):E.toArray(R,w)}function S(E,R,w,D){let v=E.value,C=R+"_"+w;if(D[C]===void 0)return typeof v=="number"||typeof v=="boolean"?D[C]=v:ArrayBuffer.isView(v)?D[C]=v.slice():D[C]=v.clone(),!0;{let k=D[C];if(typeof v=="number"||typeof v=="boolean"){if(k!==v)return D[C]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(k.equals(v)===!1)return k.copy(v),!0}}return!1}function _(E){let R=E.uniforms,w=0,D=16;for(let C=0,k=R.length;C<k;C++){let F=Array.isArray(R[C])?R[C]:[R[C]];for(let G=0,V=F.length;G<V;G++){let Q=F[G],Y=Array.isArray(Q.value)?Q.value:[Q.value];for(let it=0,K=Y.length;it<K;it++){let rt=Y[it],ct=f(rt),_t=w%D,ft=_t%ct.boundary,Rt=_t+ft;w+=ft,Rt!==0&&D-Rt<ct.storage&&(w+=D-Rt),Q.__data=new Float32Array(ct.storage/Float32Array.BYTES_PER_ELEMENT),Q.__offset=w,w+=ct.storage}}}let v=w%D;return v>0&&(w+=D-v),E.__size=w,E.__cache={},this}function f(E){let R={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(R.boundary=4,R.storage=4):E.isVector2?(R.boundary=8,R.storage=8):E.isVector3||E.isColor?(R.boundary=16,R.storage=12):E.isVector4?(R.boundary=16,R.storage=16):E.isMatrix3?(R.boundary=48,R.storage=48):E.isMatrix4?(R.boundary=64,R.storage=64):E.isTexture?Gt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(E)?(R.boundary=16,R.storage=E.byteLength):Gt("WebGLRenderer: Unsupported uniform value type.",E),R}function A(E){let R=E.target;R.removeEventListener("dispose",A);let w=a.indexOf(R.__bindingPointIndex);a.splice(w,1),i.deleteBuffer(s[R.id]),delete s[R.id],delete r[R.id]}function I(){for(let E in s)i.deleteBuffer(s[E]);a=[],s={},r={}}return{bind:c,update:l,dispose:I}}var px=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),vi=null;function mx(){return vi===null&&(vi=new Ro(px,16,16,hs,$n),vi.name="DFG_LUT",vi.minFilter=Ue,vi.magFilter=Ue,vi.wrapS=pi,vi.wrapT=pi,vi.generateMipmaps=!1,vi.needsUpdate=!0),vi}var Hl=class{constructor(t={}){let{canvas:e=Ed(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:m=!1,reversedDepthBuffer:h=!1,outputBufferType:x=Sn}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;let S=x,_=new Set([rl,sl,il]),f=new Set([Sn,ri,Sr,Er,el,nl]),A=new Uint32Array(4),I=new Int32Array(4),E=new U,R=null,w=null,D=[],v=[],C=null;this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ii,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let k=this,F=!1,G=null,V=null,Q=null,Y=null;this._outputColorSpace=On;let it=0,K=0,rt=null,ct=-1,_t=null,ft=new Le,Rt=new Le,ie=null,ye=new kt(0),Ft=0,tt=e.width,mt=e.height,at=1,Xt=null,Jt=null,Et=new Le(0,0,tt,mt),Te=new Le(0,0,tt,mt),se=!1,pe=new aa,ae=!1,ue=!1,Be=new Oe,ze=new U,Ve=new Le,Xe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},De=!1;function be(){return rt===null?at:1}let B=n;function Qe(y,z){return e.getContext(y,z)}try{let y={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:d,failIfMajorPerformanceCaveat:m};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"185"}`),e.addEventListener("webglcontextlost",Ae,!1),e.addEventListener("webglcontextrestored",Me,!1),e.addEventListener("webglcontextcreationerror",En,!1),B===null){let z="webgl2";if(B=Qe(z,y),B===null)throw Qe(z)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(y){throw qt("WebGLRenderer: "+y.message),y}let fe,T,g,H,Z,et,ut,gt,nt,st,yt,Ot,bt,xt,Bt,Wt,Ut,O,pt,J,Mt,Tt,ot;function zt(){fe=new b0(B),fe.init(),Mt=new lx(B,fe),T=new p0(B,fe,t,Mt),g=new ax(B,fe),T.reversedDepthBuffer&&h&&g.buffers.depth.setReversed(!0),V=B.createFramebuffer(),Q=B.createFramebuffer(),Y=B.createFramebuffer(),H=new T0(B),Z=new q_,et=new ox(B,fe,g,Z,T,Mt,H),ut=new M0(k),gt=new Rp(B),Tt=new d0(B,gt),nt=new S0(B,gt,H,Tt),st=new w0(B,nt,gt,Tt,H),O=new A0(B,T,et),Bt=new m0(Z),yt=new X_(k,ut,fe,T,Tt,Bt),Ot=new dx(k,Z),bt=new Z_,xt=new tx(fe),Ut=new u0(k,ut,g,st,p,c),Wt=new rx(k,st,T),ot=new fx(B,H,T,g),pt=new f0(B,fe,H),J=new E0(B,fe,H),H.programs=yt.programs,k.capabilities=T,k.extensions=fe,k.properties=Z,k.renderLists=bt,k.shadowMap=Wt,k.state=g,k.info=H}zt(),S!==Sn&&(C=new R0(S,e.width,e.height,o,s,r));let Dt=new Wh(k,B);this.xr=Dt,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){let y=fe.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){let y=fe.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return at},this.setPixelRatio=function(y){y!==void 0&&(at=y,this.setSize(tt,mt,!1))},this.getSize=function(y){return y.set(tt,mt)},this.setSize=function(y,z,$=!0){if(Dt.isPresenting){Gt("WebGLRenderer: Can't change size while VR device is presenting.");return}tt=y,mt=z,e.width=Math.floor(y*at),e.height=Math.floor(z*at),$===!0&&(e.style.width=y+"px",e.style.height=z+"px"),C!==null&&C.setSize(e.width,e.height),this.setViewport(0,0,y,z)},this.getDrawingBufferSize=function(y){return y.set(tt*at,mt*at).floor()},this.setDrawingBufferSize=function(y,z,$){tt=y,mt=z,at=$,e.width=Math.floor(y*$),e.height=Math.floor(z*$),this.setViewport(0,0,y,z)},this.setEffects=function(y){if(S===Sn){qt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(y){for(let z=0;z<y.length;z++)if(y[z].isOutputPass===!0){Gt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}C.setEffects(y||[])},this.getCurrentViewport=function(y){return y.copy(ft)},this.getViewport=function(y){return y.copy(Et)},this.setViewport=function(y,z,$,X){y.isVector4?Et.set(y.x,y.y,y.z,y.w):Et.set(y,z,$,X),g.viewport(ft.copy(Et).multiplyScalar(at).round())},this.getScissor=function(y){return y.copy(Te)},this.setScissor=function(y,z,$,X){y.isVector4?Te.set(y.x,y.y,y.z,y.w):Te.set(y,z,$,X),g.scissor(Rt.copy(Te).multiplyScalar(at).round())},this.getScissorTest=function(){return se},this.setScissorTest=function(y){g.setScissorTest(se=y)},this.setOpaqueSort=function(y){Xt=y},this.setTransparentSort=function(y){Jt=y},this.getClearColor=function(y){return y.copy(Ut.getClearColor())},this.setClearColor=function(){Ut.setClearColor(...arguments)},this.getClearAlpha=function(){return Ut.getClearAlpha()},this.setClearAlpha=function(){Ut.setClearAlpha(...arguments)},this.clear=function(y=!0,z=!0,$=!0){let X=0;if(y){let W=!1;if(rt!==null){let vt=rt.texture.format;W=_.has(vt)}if(W){let vt=rt.texture.type,wt=f.has(vt),St=Ut.getClearColor(),Pt=Ut.getClearAlpha(),It=St.r,Kt=St.g,Yt=St.b;wt?(A[0]=It,A[1]=Kt,A[2]=Yt,A[3]=Pt,B.clearBufferuiv(B.COLOR,0,A)):(I[0]=It,I[1]=Kt,I[2]=Yt,I[3]=Pt,B.clearBufferiv(B.COLOR,0,I))}else X|=B.COLOR_BUFFER_BIT}z&&(X|=B.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),$&&(X|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),X!==0&&B.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(y){y.setRenderer(this),G=y},this.dispose=function(){e.removeEventListener("webglcontextlost",Ae,!1),e.removeEventListener("webglcontextrestored",Me,!1),e.removeEventListener("webglcontextcreationerror",En,!1),Ut.dispose(),bt.dispose(),xt.dispose(),Z.dispose(),ut.dispose(),st.dispose(),Tt.dispose(),ot.dispose(),yt.dispose(),Dt.dispose(),Dt.removeEventListener("sessionstart",Kn),Dt.removeEventListener("sessionend",Lr),li.stop()};function Ae(y){y.preventDefault(),vh("WebGLRenderer: Context Lost."),F=!0}function Me(){vh("WebGLRenderer: Context Restored."),F=!1;let y=H.autoReset,z=Wt.enabled,$=Wt.autoUpdate,X=Wt.needsUpdate,W=Wt.type;zt(),H.autoReset=y,Wt.enabled=z,Wt.autoUpdate=$,Wt.needsUpdate=X,Wt.type=W}function En(y){qt("WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function Gn(y){let z=y.target;z.removeEventListener("dispose",Gn),Pr(z)}function Pr(y){Ir(y),Z.remove(y)}function Ir(y){let z=Z.get(y).programs;z!==void 0&&(z.forEach(function($){yt.releaseProgram($)}),y.isShaderMaterial&&yt.releaseShaderCache(y))}this.renderBufferDirect=function(y,z,$,X,W,vt){z===null&&(z=Xe);let wt=W.isMesh&&W.matrixWorld.determinantAffine()<0,St=Mi(y,z,$,X,W);g.setMaterial(X,wt);let Pt=$.index,It=1;if(X.wireframe===!0){if(Pt=nt.getWireframeAttribute($),Pt===void 0)return;It=2}let Kt=$.drawRange,Yt=$.attributes.position,Nt=Kt.start*It,ge=(Kt.start+Kt.count)*It;vt!==null&&(Nt=Math.max(Nt,vt.start*It),ge=Math.min(ge,(vt.start+vt.count)*It)),Pt!==null?(Nt=Math.max(Nt,0),ge=Math.min(ge,Pt.count)):Yt!=null&&(Nt=Math.max(Nt,0),ge=Math.min(ge,Yt.count));let Ne=ge-Nt;if(Ne<0||Ne===1/0)return;Tt.setup(W,X,St,$,Pt);let _e,me=pt;if(Pt!==null&&(_e=gt.get(Pt),me=J,me.setIndex(_e)),W.isMesh)X.wireframe===!0?(g.setLineWidth(X.wireframeLinewidth*be()),me.setMode(B.LINES)):me.setMode(B.TRIANGLES);else if(W.isLine){let we=X.linewidth;we===void 0&&(we=1),g.setLineWidth(we*be()),W.isLineSegments?me.setMode(B.LINES):W.isLineLoop?me.setMode(B.LINE_LOOP):me.setMode(B.LINE_STRIP)}else W.isPoints?me.setMode(B.POINTS):W.isSprite&&me.setMode(B.TRIANGLES);if(W.isBatchedMesh)if(fe.get("WEBGL_multi_draw"))me.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{let we=W._multiDrawStarts,Ct=W._multiDrawCounts,tn=W._multiDrawCount,oe=Pt?gt.get(Pt).bytesPerElement:1,en=Z.get(X).currentProgram.getUniforms();for(let _n=0;_n<tn;_n++)en.setValue(B,"_gl_DrawID",_n),me.render(we[_n]/oe,Ct[_n])}else if(W.isInstancedMesh)me.renderInstances(Nt,Ne,W.count);else if($.isInstancedBufferGeometry){let we=$._maxInstanceCount!==void 0?$._maxInstanceCount:1/0,Ct=Math.min($.instanceCount,we);me.renderInstances(Nt,Ne,Ct)}else me.render(Nt,Ne)};function ds(y,z,$){y.transparent===!0&&y.side===Vn&&y.forceSinglePass===!1?(y.side=cn,y.needsUpdate=!0,zi(y,z,$),y.side=Ui,y.needsUpdate=!0,zi(y,z,$),y.side=Vn):zi(y,z,$)}this.compile=function(y,z,$=null){$===null&&($=y),w=xt.get($),w.init(z),v.push(w),$.traverseVisible(function(W){W.isLight&&W.layers.test(z.layers)&&(w.pushLight(W),W.castShadow&&w.pushShadow(W))}),y!==$&&y.traverseVisible(function(W){W.isLight&&W.layers.test(z.layers)&&(w.pushLight(W),W.castShadow&&w.pushShadow(W))}),w.setupLights();let X=new Set;return y.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;let vt=W.material;if(vt)if(Array.isArray(vt))for(let wt=0;wt<vt.length;wt++){let St=vt[wt];ds(St,$,W),X.add(St)}else ds(vt,$,W),X.add(vt)}),w=v.pop(),X},this.compileAsync=function(y,z,$=null){let X=this.compile(y,z,$);return new Promise(W=>{function vt(){if(X.forEach(function(wt){Z.get(wt).currentProgram.isReady()&&X.delete(wt)}),X.size===0){W(y);return}setTimeout(vt,10)}fe.get("KHR_parallel_shader_compile")!==null?vt():setTimeout(vt,10)})};let fs=null;function oi(y){fs&&fs(y)}function Kn(){li.stop()}function Lr(){li.start()}let li=new Qd;li.setAnimationLoop(oi),typeof self<"u"&&li.setContext(self),this.setAnimationLoop=function(y){fs=y,Dt.setAnimationLoop(y),y===null?li.stop():li.start()},Dt.addEventListener("sessionstart",Kn),Dt.addEventListener("sessionend",Lr),this.render=function(y,z){if(z!==void 0&&z.isCamera!==!0){qt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(F===!0)return;G!==null&&G.renderStart(y,z);let $=Dt.enabled===!0&&Dt.isPresenting===!0,X=C!==null&&(rt===null||$)&&C.begin(k,rt);if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),Dt.enabled===!0&&Dt.isPresenting===!0&&(C===null||C.isCompositing()===!1)&&(Dt.cameraAutoUpdate===!0&&Dt.updateCamera(z),z=Dt.getCamera()),y.isScene===!0&&y.onBeforeRender(k,y,z,rt),w=xt.get(y,v.length),w.init(z),w.state.textureUnits=et.getTextureUnits(),v.push(w),Be.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),pe.setFromProjectionMatrix(Be,ei,z.reversedDepth),ue=this.localClippingEnabled,ae=Bt.init(this.clippingPlanes,ue),R=bt.get(y,D.length),R.init(),D.push(R),Dt.enabled===!0&&Dt.isPresenting===!0){let wt=k.xr.getDepthSensingMesh();wt!==null&&Ns(wt,z,-1/0,k.sortObjects)}Ns(y,z,0,k.sortObjects),R.finish(),k.sortObjects===!0&&R.sort(Xt,Jt,z.reversedDepth),De=Dt.enabled===!1||Dt.isPresenting===!1||Dt.hasDepthSensing()===!1,De&&Ut.addToRenderList(R,y),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ae===!0&&Bt.beginShadows();let W=w.state.shadowsArray;if(Wt.render(W,y,z),ae===!0&&Bt.endShadows(),(X&&C.hasRenderPass())===!1){let wt=R.opaque,St=R.transmissive;if(w.setupLights(),z.isArrayCamera){let Pt=z.cameras;if(St.length>0)for(let It=0,Kt=Pt.length;It<Kt;It++){let Yt=Pt[It];Dr(wt,St,y,Yt)}De&&Ut.render(y);for(let It=0,Kt=Pt.length;It<Kt;It++){let Yt=Pt[It];Us(R,y,Yt,Yt.viewport)}}else St.length>0&&Dr(wt,St,y,z),De&&Ut.render(y),Us(R,y,z)}rt!==null&&K===0&&(et.updateMultisampleRenderTarget(rt),et.updateRenderTargetMipmap(rt)),X&&C.end(k),y.isScene===!0&&y.onAfterRender(k,y,z),Tt.resetDefaultState(),ct=-1,_t=null,v.pop(),v.length>0?(w=v[v.length-1],et.setTextureUnits(w.state.textureUnits),ae===!0&&Bt.setGlobalState(k.clippingPlanes,w.state.camera)):w=null,D.pop(),D.length>0?R=D[D.length-1]:R=null,G!==null&&G.renderEnd()};function Ns(y,z,$,X){if(y.visible===!1)return;if(y.layers.test(z.layers)){if(y.isGroup)$=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(z);else if(y.isLightProbeGrid)w.pushLightProbeGrid(y);else if(y.isLight)w.pushLight(y),y.castShadow&&w.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||pe.intersectsSprite(y)){X&&Ve.setFromMatrixPosition(y.matrixWorld).applyMatrix4(Be);let wt=st.update(y),St=y.material;St.visible&&R.push(y,wt,St,$,Ve.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||pe.intersectsObject(y))){let wt=st.update(y),St=y.material;if(X&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),Ve.copy(y.boundingSphere.center)):(wt.boundingSphere===null&&wt.computeBoundingSphere(),Ve.copy(wt.boundingSphere.center)),Ve.applyMatrix4(y.matrixWorld).applyMatrix4(Be)),Array.isArray(St)){let Pt=wt.groups;for(let It=0,Kt=Pt.length;It<Kt;It++){let Yt=Pt[It],Nt=St[Yt.materialIndex];Nt&&Nt.visible&&R.push(y,wt,Nt,$,Ve.z,Yt)}}else St.visible&&R.push(y,wt,St,$,Ve.z,null)}}let vt=y.children;for(let wt=0,St=vt.length;wt<St;wt++)Ns(vt[wt],z,$,X)}function Us(y,z,$,X){let{opaque:W,transmissive:vt,transparent:wt}=y;w.setupLightsView($),ae===!0&&Bt.setGlobalState(k.clippingPlanes,$),X&&g.viewport(ft.copy(X)),W.length>0&&hn(W,z,$),vt.length>0&&hn(vt,z,$),wt.length>0&&hn(wt,z,$),g.buffers.depth.setTest(!0),g.buffers.depth.setMask(!0),g.buffers.color.setMask(!0),g.setPolygonOffset(!1)}function Dr(y,z,$,X){if(($.isScene===!0?$.overrideMaterial:null)!==null)return;if(w.state.transmissionRenderTarget[X.id]===void 0){let Nt=fe.has("EXT_color_buffer_half_float")||fe.has("EXT_color_buffer_float");w.state.transmissionRenderTarget[X.id]=new mn(1,1,{generateMipmaps:!0,type:Nt?$n:Sn,minFilter:si,samples:Math.max(4,T.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:he.workingColorSpace})}let vt=w.state.transmissionRenderTarget[X.id],wt=X.viewport||ft;vt.setSize(wt.z*k.transmissionResolutionScale,wt.w*k.transmissionResolutionScale);let St=k.getRenderTarget(),Pt=k.getActiveCubeFace(),It=k.getActiveMipmapLevel();k.setRenderTarget(vt),k.getClearColor(ye),Ft=k.getClearAlpha(),Ft<1&&k.setClearColor(16777215,.5),k.clear(),De&&Ut.render($);let Kt=k.toneMapping;k.toneMapping=ii;let Yt=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),w.setupLightsView(X),ae===!0&&Bt.setGlobalState(k.clippingPlanes,X),hn(y,$,X),et.updateMultisampleRenderTarget(vt),et.updateRenderTargetMipmap(vt),fe.has("WEBGL_multisampled_render_to_texture")===!1){let Nt=!1;for(let ge=0,Ne=z.length;ge<Ne;ge++){let _e=z[ge],{object:me,geometry:we,material:Ct,group:tn}=_e;if(Ct.side===Vn&&me.layers.test(X.layers)){let oe=Ct.side;Ct.side=cn,Ct.needsUpdate=!0,Nr(me,$,X,we,Ct,tn),Ct.side=oe,Ct.needsUpdate=!0,Nt=!0}}Nt===!0&&(et.updateMultisampleRenderTarget(vt),et.updateRenderTargetMipmap(vt))}k.setRenderTarget(St,Pt,It),k.setClearColor(ye,Ft),Yt!==void 0&&(X.viewport=Yt),k.toneMapping=Kt}function hn(y,z,$){let X=z.isScene===!0?z.overrideMaterial:null;for(let W=0,vt=y.length;W<vt;W++){let wt=y[W],{object:St,geometry:Pt,group:It}=wt,Kt=wt.material;Kt.allowOverride===!0&&X!==null&&(Kt=X),St.layers.test($.layers)&&Nr(St,z,$,Pt,Kt,It)}}function Nr(y,z,$,X,W,vt){y.onBeforeRender(k,z,$,X,W,vt),y.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),W.onBeforeRender(k,z,$,X,y,vt),W.transparent===!0&&W.side===Vn&&W.forceSinglePass===!1?(W.side=cn,W.needsUpdate=!0,k.renderBufferDirect($,z,X,W,y,vt),W.side=Ui,W.needsUpdate=!0,k.renderBufferDirect($,z,X,W,y,vt),W.side=Vn):k.renderBufferDirect($,z,X,W,y,vt),y.onAfterRender(k,z,$,X,W,vt)}function zi(y,z,$){z.isScene!==!0&&(z=Xe);let X=Z.get(y),W=w.state.lights,vt=w.state.shadowsArray,wt=W.state.version,St=yt.getParameters(y,W.state,vt,z,$,w.state.lightProbeGridArray),Pt=yt.getProgramCacheKey(St),It=X.programs;X.environment=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?z.environment:null,X.fog=z.fog;let Kt=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap;X.envMap=ut.get(y.envMap||X.environment,Kt),X.envMapRotation=X.environment!==null&&y.envMap===null?z.environmentRotation:y.envMapRotation,It===void 0&&(y.addEventListener("dispose",Gn),It=new Map,X.programs=It);let Yt=It.get(Pt);if(Yt!==void 0){if(X.currentProgram===Yt&&X.lightsStateVersion===wt)return Fs(y,St),Yt}else St.uniforms=yt.getUniforms(y),G!==null&&y.isNodeMaterial&&G.build(y,$,St),y.onBeforeCompile(St,k),Yt=yt.acquireProgram(St,Pt),It.set(Pt,Yt),X.uniforms=St.uniforms;let Nt=X.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(Nt.clippingPlanes=Bt.uniform),Fs(y,St),X.needsLights=Aa(y),X.lightsStateVersion=wt,X.needsLights&&(Nt.ambientLightColor.value=W.state.ambient,Nt.lightProbe.value=W.state.probe,Nt.directionalLights.value=W.state.directional,Nt.directionalLightShadows.value=W.state.directionalShadow,Nt.spotLights.value=W.state.spot,Nt.spotLightShadows.value=W.state.spotShadow,Nt.rectAreaLights.value=W.state.rectArea,Nt.ltc_1.value=W.state.rectAreaLTC1,Nt.ltc_2.value=W.state.rectAreaLTC2,Nt.pointLights.value=W.state.point,Nt.pointLightShadows.value=W.state.pointShadow,Nt.hemisphereLights.value=W.state.hemi,Nt.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Nt.spotLightMatrix.value=W.state.spotLightMatrix,Nt.spotLightMap.value=W.state.spotLightMap,Nt.pointShadowMatrix.value=W.state.pointShadowMatrix),X.lightProbeGrid=w.state.lightProbeGridArray.length>0,X.currentProgram=Yt,X.uniformsList=null,Yt}function ps(y){if(y.uniformsList===null){let z=y.currentProgram.getUniforms();y.uniformsList=wr.seqWithValue(z.seq,y.uniforms)}return y.uniformsList}function Fs(y,z){let $=Z.get(y);$.outputColorSpace=z.outputColorSpace,$.batching=z.batching,$.batchingColor=z.batchingColor,$.instancing=z.instancing,$.instancingColor=z.instancingColor,$.instancingMorph=z.instancingMorph,$.skinning=z.skinning,$.morphTargets=z.morphTargets,$.morphNormals=z.morphNormals,$.morphColors=z.morphColors,$.morphTargetsCount=z.morphTargetsCount,$.numClippingPlanes=z.numClippingPlanes,$.numIntersection=z.numClipIntersection,$.vertexAlphas=z.vertexAlphas,$.vertexTangents=z.vertexTangents,$.toneMapping=z.toneMapping}function qe(y,z){if(y.length===0)return null;if(y.length===1)return y[0].texture!==null?y[0]:null;E.setFromMatrixPosition(z.matrixWorld);for(let $=0,X=y.length;$<X;$++){let W=y[$];if(W.texture!==null&&W.boundingBox.containsPoint(E))return W}return null}function Mi(y,z,$,X,W){z.isScene!==!0&&(z=Xe),et.resetTextureUnits();let vt=z.fog,wt=X.isMeshStandardMaterial||X.isMeshLambertMaterial||X.isMeshPhongMaterial?z.environment:null,St=rt===null?k.outputColorSpace:rt.isXRRenderTarget===!0?rt.texture.colorSpace:he.workingColorSpace,Pt=X.isMeshStandardMaterial||X.isMeshLambertMaterial&&!X.envMap||X.isMeshPhongMaterial&&!X.envMap,It=ut.get(X.envMap||wt,Pt),Kt=X.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,Yt=!!$.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Nt=!!$.morphAttributes.position,ge=!!$.morphAttributes.normal,Ne=!!$.morphAttributes.color,_e=ii;X.toneMapped&&(rt===null||rt.isXRRenderTarget===!0)&&(_e=k.toneMapping);let me=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,we=me!==void 0?me.length:0,Ct=Z.get(X),tn=w.state.lights;if(ae===!0&&(ue===!0||y!==_t)){let xe=y===_t&&X.id===ct;Bt.setState(X,y,xe)}let oe=!1;X.version===Ct.__version?(Ct.needsLights&&Ct.lightsStateVersion!==tn.state.version||Ct.outputColorSpace!==St||W.isBatchedMesh&&Ct.batching===!1||!W.isBatchedMesh&&Ct.batching===!0||W.isBatchedMesh&&Ct.batchingColor===!0&&W.colorTexture===null||W.isBatchedMesh&&Ct.batchingColor===!1&&W.colorTexture!==null||W.isInstancedMesh&&Ct.instancing===!1||!W.isInstancedMesh&&Ct.instancing===!0||W.isSkinnedMesh&&Ct.skinning===!1||!W.isSkinnedMesh&&Ct.skinning===!0||W.isInstancedMesh&&Ct.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&Ct.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&Ct.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&Ct.instancingMorph===!1&&W.morphTexture!==null||Ct.envMap!==It||X.fog===!0&&Ct.fog!==vt||Ct.numClippingPlanes!==void 0&&(Ct.numClippingPlanes!==Bt.numPlanes||Ct.numIntersection!==Bt.numIntersection)||Ct.vertexAlphas!==Kt||Ct.vertexTangents!==Yt||Ct.morphTargets!==Nt||Ct.morphNormals!==ge||Ct.morphColors!==Ne||Ct.toneMapping!==_e||Ct.morphTargetsCount!==we||!!Ct.lightProbeGrid!=w.state.lightProbeGridArray.length>0)&&(oe=!0):(oe=!0,Ct.__version=X.version);let en=Ct.currentProgram;oe===!0&&(en=zi(X,z,W),G&&X.isNodeMaterial&&G.onUpdateProgram(X,en,Ct));let _n=!1,Ln=!1,bi=!1,le=en.getUniforms(),Fe=Ct.uniforms;if(g.useProgram(en.program)&&(_n=!0,Ln=!0,bi=!0),X.id!==ct&&(ct=X.id,Ln=!0),Ct.needsLights){let xe=qe(w.state.lightProbeGridArray,W);Ct.lightProbeGrid!==xe&&(Ct.lightProbeGrid=xe,Ln=!0)}if(_n||_t!==y){g.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),le.setValue(B,"projectionMatrix",y.projectionMatrix),le.setValue(B,"viewMatrix",y.matrixWorldInverse);let Wn=le.map.cameraPosition;Wn!==void 0&&Wn.setValue(B,ze.setFromMatrixPosition(y.matrixWorld)),T.logarithmicDepthBuffer&&le.setValue(B,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&le.setValue(B,"isOrthographic",y.isOrthographicCamera===!0),_t!==y&&(_t=y,Ln=!0,bi=!0)}if(Ct.needsLights&&(tn.state.directionalShadowMap.length>0&&le.setValue(B,"directionalShadowMap",tn.state.directionalShadowMap,et),tn.state.spotShadowMap.length>0&&le.setValue(B,"spotShadowMap",tn.state.spotShadowMap,et),tn.state.pointShadowMap.length>0&&le.setValue(B,"pointShadowMap",tn.state.pointShadowMap,et)),W.isSkinnedMesh){le.setOptional(B,W,"bindMatrix"),le.setOptional(B,W,"bindMatrixInverse");let xe=W.skeleton;xe&&(xe.boneTexture===null&&xe.computeBoneTexture(),le.setValue(B,"boneTexture",xe.boneTexture,et))}W.isBatchedMesh&&(le.setOptional(B,W,"batchingTexture"),le.setValue(B,"batchingTexture",W._matricesTexture,et),le.setOptional(B,W,"batchingIdTexture"),le.setValue(B,"batchingIdTexture",W._indirectTexture,et),le.setOptional(B,W,"batchingColorTexture"),W._colorsTexture!==null&&le.setValue(B,"batchingColorTexture",W._colorsTexture,et));let ci=$.morphAttributes;if((ci.position!==void 0||ci.normal!==void 0||ci.color!==void 0)&&O.update(W,$,en),(Ln||Ct.receiveShadow!==W.receiveShadow)&&(Ct.receiveShadow=W.receiveShadow,le.setValue(B,"receiveShadow",W.receiveShadow)),(X.isMeshStandardMaterial||X.isMeshLambertMaterial||X.isMeshPhongMaterial)&&X.envMap===null&&z.environment!==null&&(Fe.envMapIntensity.value=z.environmentIntensity),Fe.dfgLUT!==void 0&&(Fe.dfgLUT.value=mx()),Ln){if(le.setValue(B,"toneMappingExposure",k.toneMappingExposure),Ct.needsLights&&Os(Fe,bi),vt&&X.fog===!0&&Ot.refreshFogUniforms(Fe,vt),Ot.refreshMaterialUniforms(Fe,X,at,mt,w.state.transmissionRenderTarget[y.id]),Ct.needsLights&&Ct.lightProbeGrid){let xe=Ct.lightProbeGrid;Fe.probesSH.value=xe.texture,Fe.probesMin.value.copy(xe.boundingBox.min),Fe.probesMax.value.copy(xe.boundingBox.max),Fe.probesResolution.value.copy(xe.resolution)}wr.upload(B,ps(Ct),Fe,et)}if(X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(wr.upload(B,ps(Ct),Fe,et),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&le.setValue(B,"center",W.center),le.setValue(B,"modelViewMatrix",W.modelViewMatrix),le.setValue(B,"normalMatrix",W.normalMatrix),le.setValue(B,"modelMatrix",W.matrixWorld),X.uniformsGroups!==void 0){let xe=X.uniformsGroups;for(let Wn=0,Xn=xe.length;Wn<Xn;Wn++){let Ur=xe[Wn];ot.update(Ur,en),ot.bind(Ur,en)}}return en}function Os(y,z){y.ambientLightColor.needsUpdate=z,y.lightProbe.needsUpdate=z,y.directionalLights.needsUpdate=z,y.directionalLightShadows.needsUpdate=z,y.pointLights.needsUpdate=z,y.pointLightShadows.needsUpdate=z,y.spotLights.needsUpdate=z,y.spotLightShadows.needsUpdate=z,y.rectAreaLights.needsUpdate=z,y.hemisphereLights.needsUpdate=z}function Aa(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return it},this.getActiveMipmapLevel=function(){return K},this.getRenderTarget=function(){return rt},this.setRenderTargetTextures=function(y,z,$){let X=Z.get(y);X.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),Z.get(y.texture).__webglTexture=z,Z.get(y.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:$,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,z){let $=Z.get(y);$.__webglFramebuffer=z,$.__useDefaultFramebuffer=z===void 0},this.setRenderTarget=function(y,z=0,$=0){rt=y,it=z,K=$;let X=null,W=!1,vt=!1;if(y){let St=Z.get(y);if(St.__useDefaultFramebuffer!==void 0){g.bindFramebuffer(B.FRAMEBUFFER,St.__webglFramebuffer),ft.copy(y.viewport),Rt.copy(y.scissor),ie=y.scissorTest,g.viewport(ft),g.scissor(Rt),g.setScissorTest(ie),ct=-1;return}else if(St.__webglFramebuffer===void 0)et.setupRenderTarget(y);else if(St.__hasExternalTextures)et.rebindTextures(y,Z.get(y.texture).__webglTexture,Z.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){let Kt=y.depthTexture;if(St.__boundDepthTexture!==Kt){if(Kt!==null&&Z.has(Kt)&&(y.width!==Kt.image.width||y.height!==Kt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");et.setupDepthRenderbuffer(y)}}let Pt=y.texture;(Pt.isData3DTexture||Pt.isDataArrayTexture||Pt.isCompressedArrayTexture)&&(vt=!0);let It=Z.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(It[z])?X=It[z][$]:X=It[z],W=!0):y.samples>0&&et.useMultisampledRTT(y)===!1?X=Z.get(y).__webglMultisampledFramebuffer:Array.isArray(It)?X=It[$]:X=It,ft.copy(y.viewport),Rt.copy(y.scissor),ie=y.scissorTest}else ft.copy(Et).multiplyScalar(at).floor(),Rt.copy(Te).multiplyScalar(at).floor(),ie=se;if($!==0&&(X=V),g.bindFramebuffer(B.FRAMEBUFFER,X)&&g.drawBuffers(y,X),g.viewport(ft),g.scissor(Rt),g.setScissorTest(ie),W){let St=Z.get(y.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+z,St.__webglTexture,$)}else if(vt){let St=z;for(let Pt=0;Pt<y.textures.length;Pt++){let It=Z.get(y.textures[Pt]);B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0+Pt,It.__webglTexture,$,St)}}else if(y!==null&&$!==0){let St=Z.get(y.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,St.__webglTexture,$)}ct=-1},this.readRenderTargetPixels=function(y,z,$,X,W,vt,wt,St=0){if(!(y&&y.isWebGLRenderTarget)){qt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Pt=Z.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&wt!==void 0&&(Pt=Pt[wt]),Pt){g.bindFramebuffer(B.FRAMEBUFFER,Pt);try{let It=y.textures[St],Kt=It.format,Yt=It.type;if(y.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+St),!T.textureFormatReadable(Kt)){qt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!T.textureTypeReadable(Yt)){qt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=y.width-X&&$>=0&&$<=y.height-W&&B.readPixels(z,$,X,W,Mt.convert(Kt),Mt.convert(Yt),vt)}finally{let It=rt!==null?Z.get(rt).__webglFramebuffer:null;g.bindFramebuffer(B.FRAMEBUFFER,It)}}},this.readRenderTargetPixelsAsync=async function(y,z,$,X,W,vt,wt,St=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Pt=Z.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&wt!==void 0&&(Pt=Pt[wt]),Pt)if(z>=0&&z<=y.width-X&&$>=0&&$<=y.height-W){g.bindFramebuffer(B.FRAMEBUFFER,Pt);let It=y.textures[St],Kt=It.format,Yt=It.type;if(y.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+St),!T.textureFormatReadable(Kt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!T.textureTypeReadable(Yt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Nt=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,Nt),B.bufferData(B.PIXEL_PACK_BUFFER,vt.byteLength,B.STREAM_READ),B.readPixels(z,$,X,W,Mt.convert(Kt),Mt.convert(Yt),0);let ge=rt!==null?Z.get(rt).__webglFramebuffer:null;g.bindFramebuffer(B.FRAMEBUFFER,ge);let Ne=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await Ad(B,Ne,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,Nt),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,vt),B.deleteBuffer(Nt),B.deleteSync(Ne),vt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,z=null,$=0){let X=Math.pow(2,-$),W=Math.floor(y.image.width*X),vt=Math.floor(y.image.height*X),wt=z!==null?z.x:0,St=z!==null?z.y:0;et.setTexture2D(y,0),B.copyTexSubImage2D(B.TEXTURE_2D,$,0,0,wt,St,W,vt),g.unbindTexture()},this.copyTextureToTexture=function(y,z,$=null,X=null,W=0,vt=0){let wt,St,Pt,It,Kt,Yt,Nt,ge,Ne,_e=y.isCompressedTexture?y.mipmaps[vt]:y.image;if($!==null)wt=$.max.x-$.min.x,St=$.max.y-$.min.y,Pt=$.isBox3?$.max.z-$.min.z:1,It=$.min.x,Kt=$.min.y,Yt=$.isBox3?$.min.z:0;else{let Fe=Math.pow(2,-W);wt=Math.floor(_e.width*Fe),St=Math.floor(_e.height*Fe),y.isDataArrayTexture?Pt=_e.depth:y.isData3DTexture?Pt=Math.floor(_e.depth*Fe):Pt=1,It=0,Kt=0,Yt=0}X!==null?(Nt=X.x,ge=X.y,Ne=X.z):(Nt=0,ge=0,Ne=0);let me=Mt.convert(z.format),we=Mt.convert(z.type),Ct;z.isData3DTexture?(et.setTexture3D(z,0),Ct=B.TEXTURE_3D):z.isDataArrayTexture||z.isCompressedArrayTexture?(et.setTexture2DArray(z,0),Ct=B.TEXTURE_2D_ARRAY):(et.setTexture2D(z,0),Ct=B.TEXTURE_2D),g.activeTexture(B.TEXTURE0),g.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,z.flipY),g.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),g.pixelStorei(B.UNPACK_ALIGNMENT,z.unpackAlignment);let tn=g.getParameter(B.UNPACK_ROW_LENGTH),oe=g.getParameter(B.UNPACK_IMAGE_HEIGHT),en=g.getParameter(B.UNPACK_SKIP_PIXELS),_n=g.getParameter(B.UNPACK_SKIP_ROWS),Ln=g.getParameter(B.UNPACK_SKIP_IMAGES);g.pixelStorei(B.UNPACK_ROW_LENGTH,_e.width),g.pixelStorei(B.UNPACK_IMAGE_HEIGHT,_e.height),g.pixelStorei(B.UNPACK_SKIP_PIXELS,It),g.pixelStorei(B.UNPACK_SKIP_ROWS,Kt),g.pixelStorei(B.UNPACK_SKIP_IMAGES,Yt);let bi=y.isDataArrayTexture||y.isData3DTexture,le=z.isDataArrayTexture||z.isData3DTexture;if(y.isDepthTexture){let Fe=Z.get(y),ci=Z.get(z),xe=Z.get(Fe.__renderTarget),Wn=Z.get(ci.__renderTarget);g.bindFramebuffer(B.READ_FRAMEBUFFER,xe.__webglFramebuffer),g.bindFramebuffer(B.DRAW_FRAMEBUFFER,Wn.__webglFramebuffer);for(let Xn=0;Xn<Pt;Xn++)bi&&(B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Z.get(y).__webglTexture,W,Yt+Xn),B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Z.get(z).__webglTexture,vt,Ne+Xn)),B.blitFramebuffer(It,Kt,wt,St,Nt,ge,wt,St,B.DEPTH_BUFFER_BIT,B.NEAREST);g.bindFramebuffer(B.READ_FRAMEBUFFER,null),g.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else if(W!==0||y.isRenderTargetTexture||Z.has(y)){let Fe=Z.get(y),ci=Z.get(z);g.bindFramebuffer(B.READ_FRAMEBUFFER,Q),g.bindFramebuffer(B.DRAW_FRAMEBUFFER,Y);for(let xe=0;xe<Pt;xe++)bi?B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Fe.__webglTexture,W,Yt+xe):B.framebufferTexture2D(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,Fe.__webglTexture,W),le?B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,ci.__webglTexture,vt,Ne+xe):B.framebufferTexture2D(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,ci.__webglTexture,vt),W!==0?B.blitFramebuffer(It,Kt,wt,St,Nt,ge,wt,St,B.COLOR_BUFFER_BIT,B.NEAREST):le?B.copyTexSubImage3D(Ct,vt,Nt,ge,Ne+xe,It,Kt,wt,St):B.copyTexSubImage2D(Ct,vt,Nt,ge,It,Kt,wt,St);g.bindFramebuffer(B.READ_FRAMEBUFFER,null),g.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else le?y.isDataTexture||y.isData3DTexture?B.texSubImage3D(Ct,vt,Nt,ge,Ne,wt,St,Pt,me,we,_e.data):z.isCompressedArrayTexture?B.compressedTexSubImage3D(Ct,vt,Nt,ge,Ne,wt,St,Pt,me,_e.data):B.texSubImage3D(Ct,vt,Nt,ge,Ne,wt,St,Pt,me,we,_e):y.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,vt,Nt,ge,wt,St,me,we,_e.data):y.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,vt,Nt,ge,_e.width,_e.height,me,_e.data):B.texSubImage2D(B.TEXTURE_2D,vt,Nt,ge,wt,St,me,we,_e);g.pixelStorei(B.UNPACK_ROW_LENGTH,tn),g.pixelStorei(B.UNPACK_IMAGE_HEIGHT,oe),g.pixelStorei(B.UNPACK_SKIP_PIXELS,en),g.pixelStorei(B.UNPACK_SKIP_ROWS,_n),g.pixelStorei(B.UNPACK_SKIP_IMAGES,Ln),vt===0&&z.generateMipmaps&&B.generateMipmap(Ct),g.unbindTexture()},this.initRenderTarget=function(y){Z.get(y).__webglFramebuffer===void 0&&et.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?et.setTextureCube(y,0):y.isData3DTexture?et.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?et.setTexture2DArray(y,0):et.setTexture2D(y,0),g.unbindTexture()},this.resetState=function(){it=0,K=0,rt=null,g.reset(),Tt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ei}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=he._getDrawingBufferColorSpace(t),e.unpackColorSpace=he._getUnpackColorSpace()}};var of={type:"change"},qh={type:"start"},cf={type:"end"},Xl=new ns,lf=new Zn,_x=Math.cos(70*xi.DEG2RAD),je=new U,In=2*Math.PI,Ee={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Xh=1e-6,ql=class extends da{constructor(t,e=null){super(t,e),this.state=Ee.NONE,this.target=new U,this.cursor=new U,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:as.ROTATE,MIDDLE:as.DOLLY,RIGHT:as.PAN},this.touches={ONE:os.ROTATE,TWO:os.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new U,this._lastQuaternion=new Bn,this._lastTargetPosition=new U,this._quat=new Bn().setFromUnitVectors(t.up,new U(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new yr,this._sphericalDelta=new yr,this._scale=1,this._panOffset=new U,this._rotateStart=new $t,this._rotateEnd=new $t,this._rotateDelta=new $t,this._panStart=new $t,this._panEnd=new $t,this._panDelta=new $t,this._dollyStart=new $t,this._dollyEnd=new $t,this._dollyDelta=new $t,this._dollyDirection=new U,this._mouse=new $t,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=vx.bind(this),this._onPointerDown=xx.bind(this),this._onPointerUp=yx.bind(this),this._onContextMenu=wx.bind(this),this._onMouseWheel=Sx.bind(this),this._onKeyDown=Ex.bind(this),this._onTouchStart=Tx.bind(this),this._onTouchMove=Ax.bind(this),this._onMouseDown=Mx.bind(this),this._onMouseMove=bx.bind(this),this._interceptControlDown=Cx.bind(this),this._interceptControlUp=Rx.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(t){this._cursorStyle=t,t==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction=""}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(of),this.update(),this.state=Ee.NONE}pan(t,e){this._pan(t,e),this.update()}dollyIn(t){this._dollyIn(t),this.update()}dollyOut(t){this._dollyOut(t),this.update()}rotateLeft(t){this._rotateLeft(t),this.update()}rotateUp(t){this._rotateUp(t),this.update()}update(t=null){let e=this.object.position;je.copy(e).sub(this.target),je.applyQuaternion(this._quat),this._spherical.setFromVector3(je),this.autoRotate&&this.state===Ee.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=In:n>Math.PI&&(n-=In),s<-Math.PI?s+=In:s>Math.PI&&(s-=In),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(je.setFromSpherical(this._spherical),je.applyQuaternion(this._quatInverse),e.copy(this.target).add(je),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){let o=je.length();a=this._clampDistance(o*this._scale);let c=o-a;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){let o=new U(this._mouse.x,this._mouse.y,0);o.unproject(this.object);let c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;let l=new U(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(o),this.object.updateMatrixWorld(),a=je.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Xl.origin.copy(this.object.position),Xl.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Xl.direction))<_x?this.object.lookAt(this.target):(lf.setFromNormalAndCoplanarPoint(this.object.up,this.target),Xl.intersectPlane(lf,this.target))))}else if(this.object.isOrthographicCamera){let a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Xh||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Xh||this._lastTargetPosition.distanceToSquared(this.target)>Xh?(this.dispatchEvent(of),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?In/60*this.autoRotateSpeed*t:In/60/60*this.autoRotateSpeed}_getZoomScale(t){let e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){je.setFromMatrixColumn(e,0),je.multiplyScalar(-t),this._panOffset.add(je)}_panUp(t,e){this.screenSpacePanning===!0?je.setFromMatrixColumn(e,1):(je.setFromMatrixColumn(e,0),je.crossVectors(this.object.up,je)),je.multiplyScalar(t),this._panOffset.add(je)}_pan(t,e){let n=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;je.copy(s).sub(this.target);let r=je.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/n.clientHeight,this.object.matrix),this._panUp(2*e*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),s=t-n.left,r=e-n.top,a=n.width,o=n.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(In*this._rotateDelta.x/e.clientHeight),this._rotateUp(In*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(In*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-In*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(In*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-In*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(n,s)}}_handleTouchStartDolly(t){let e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{let n=this._getSecondPointerPosition(t),s=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(In*this._rotateDelta.x/e.clientHeight),this._rotateUp(In*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){let e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let a=(t.pageX+e.x)*.5,o=(t.pageY+e.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new $t,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){let e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){let e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function xx(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function vx(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function yx(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(cf),this.state=Ee.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:let t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function Mx(i){let t;switch(i.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case as.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=Ee.DOLLY;break;case as.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Ee.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Ee.ROTATE}break;case as.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Ee.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Ee.PAN}break;default:this.state=Ee.NONE}this.state!==Ee.NONE&&this.dispatchEvent(qh)}function bx(i){switch(this.state){case Ee.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case Ee.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case Ee.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function Sx(i){this.enabled===!1||this.enableZoom===!1||this.state!==Ee.NONE||(i.preventDefault(),this.dispatchEvent(qh),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(cf))}function Ex(i){this.enabled!==!1&&this._handleKeyDown(i)}function Tx(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case os.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=Ee.TOUCH_ROTATE;break;case os.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=Ee.TOUCH_PAN;break;default:this.state=Ee.NONE}break;case 2:switch(this.touches.TWO){case os.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=Ee.TOUCH_DOLLY_PAN;break;case os.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=Ee.TOUCH_DOLLY_ROTATE;break;default:this.state=Ee.NONE}break;default:this.state=Ee.NONE}this.state!==Ee.NONE&&this.dispatchEvent(qh)}function Ax(i){switch(this._trackPointer(i),this.state){case Ee.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case Ee.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case Ee.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case Ee.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=Ee.NONE}}function wx(i){this.enabled!==!1&&i.preventDefault()}function Cx(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Rx(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var Px=`<div id="simular" class="hud" role="group" aria-label="Simular eventos do Obsidian (s\xF3 na pr\xE9via)">
  <span class="legenda">Pr\xE9via \xB7 simular</span>
  <button data-evento="abrir">Abrir nota</button>
  <button data-evento="salvar">Salvar</button>
  <button data-evento="nova">Nota nova</button>
  <button data-evento="captura">Captura no 01_ENTRADA</button>
  <button id="demo" aria-pressed="true">Manh\xE3 de trabalho</button>
</div>`;function hf(i={}){return`<div id="palco" aria-label="O cofre como gal\xE1xia em tr\xEAs dimens\xF5es. Arraste para girar, role para voar na dire\xE7\xE3o do ponteiro, clique numa estrela para abrir a nota."></div>
<div id="grao" aria-hidden="true"></div>

<header id="marca" class="hud">
  <h1>C\xE9rebro Gal\xE1ctico</h1>
  <p><b id="n-notas">0</b> estrelas \xB7 <b id="n-sinapses">0</b> sinapses</p>
</header>

<div id="comandos" class="hud">
  <div id="busca" role="search">
    <svg class="lupa" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="7" cy="7" r="4.75"/><path d="m10.6 10.6 3.4 3.4" stroke-linecap="round"/></svg>
    <input id="busca-campo" type="search" placeholder="Buscar nota\u2026" aria-label="Buscar nota pelo t\xEDtulo" autocomplete="off" spellcheck="false" role="combobox" aria-controls="resultados" aria-expanded="false">
    <kbd>Ctrl K</kbd>
    <ul id="resultados" role="listbox" aria-label="Notas encontradas" hidden></ul>
  </div>
  <div style="position:relative">
    <button id="botao-filtros" class="botao-icone" aria-expanded="false" aria-controls="filtros" title="Filtros">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M2 4.5h7M12.5 4.5H14M2 11.5h2M7.5 11.5H14"/><circle cx="10.75" cy="4.5" r="1.75"/><circle cx="5.75" cy="11.5" r="1.75"/></svg>
      <span class="sr" hidden>Filtros</span>
    </button>
    <div id="filtros" hidden>
      <h2>Mostrar</h2>
      <div>
        <label class="chave">Esconder 99_ARQUIVO (halo) <input type="checkbox" id="f-arquivo"></label>
        <label class="chave">Atividade de fundo <input type="checkbox" id="f-fundo" checked></label>
        <label class="chave">Efeitos reduzidos <input type="checkbox" id="f-reduzidos"></label>
        <label class="chave">Som de trov\xE3o <input type="checkbox" id="f-som"></label>
      </div>
      <h2>S\xF3 uma regi\xE3o</h2>
      <div id="lobos"></div>
      <p id="poeira"></p>
      <p id="desempenho">Medindo desempenho\u2026</p>
    </div>
  </div>
</div>

<div id="rotulo" class="hud" role="tooltip"><strong></strong><span></span></div>
<p id="evento" class="hud" aria-live="polite"></p>

${i.simulacao?Px:""}

<div id="sem-webgl" hidden><div><strong>A gal\xE1xia precisa de WebGL.</strong>Este computador ou navegador n\xE3o liberou a acelera\xE7\xE3o gr\xE1fica.</div></div>`}function uf(i,t,e={}){i.classList.add("cg-raiz"),e.simulacao&&i.classList.add("com-simulacao"),i.innerHTML=hf(e);let n=u=>i.querySelector("#"+u),s=[];function r(u,M,b,L){u.addEventListener(M,b,L),s.push(()=>u.removeEventListener(M,b,L))}let a=Math.min(5e3,e.carga||0),o=Math.max(0,a-t.nos.length);if(o){let u=t.nos.length,M=t.arestas.length*2/u,b=1,L=()=>(b=b*16807%2147483647,b/2147483647);for(let j=0;j<o;j++){let P=t.nos[Math.floor(L()*u)];t.nos.push({...P,id:`${P.id} (sint\xE9tica ${j+1})`,t:`Sint\xE9tica ${j+1}`});let N=t.nos.length-1;for(let q=0;q<Math.round(M/2);q++)t.arestas.push([Math.floor(L()*N),N])}}let c={regra:"#ff8a3d",incidente:"#ff4d4d",decisao:"#ffc233",metodo:"#2ee59d",conhecimento:"#569cff",projeto:"#8f7bff",fonte:"#7ea2ff",pesquisa:"#7ea2ff",arquivo:"#58627e",sistema:"#fff1d6"},l=[{id:"frontal",nome:"Conhecimento",curto:"CON",onde:"bra\xE7o do conhecimento"},{id:"motor",nome:"Decis\xF5es",curto:"DEC",onde:"bra\xE7o das decis\xF5es"},{id:"parietal",nome:"Projetos",curto:"PRO",onde:"ponta do bra\xE7o das decis\xF5es"},{id:"temporal",nome:"Regras e m\xE9todos",curto:"REG",onde:"bra\xE7o das regras"},{id:"occipital",nome:"Incidentes",curto:"INC",onde:"ponta do bra\xE7o das regras"},{id:"cerebelo",nome:"Fontes",curto:"FON",onde:"bra\xE7o das fontes"},{id:"tronco",nome:"Arquivo",curto:"ARQ",onde:"halo"},{id:"talamo",nome:"N\xFAcleo",curto:"NUC",onde:"n\xFAcleo"}],d=Object.fromEntries(l.map((u,M)=>[u.id,M])),m={regra:"regra",incidente:"incidente",decisao:"decis\xE3o",metodo:"m\xE9todo",conhecimento:"conhecimento",projeto:"projeto",fonte:"fonte",pesquisa:"pesquisa",arquivo:"arquivo",sistema:"sistema"},h={ferrugem:new kt("#8c3b22"),laranja:new kt("#e0733a"),ouro:new kt("#f0b44c"),teal:new kt("#3cc3d0"),cavidade:new kt("#2a4fb8"),nucleo:new kt("#fff1d6"),violeta:new kt("#4a3a8c")},x=matchMedia("(prefers-reduced-motion: reduce)"),p={esconderArquivo:!1,fundo:!0,reduzidos:!1,som:!1,regiao:null,selecionado:-1,sobre:-1,demo:!!e.simulacao,qualidadeAjustada:!1,get movimentoReduzido(){return x.matches}};for(let u of["esconderArquivo","fundo","reduzidos","som"])typeof e.config?.[u]=="boolean"&&(p[u]=e.config[u]);let S=()=>({esconderArquivo:p.esconderArquivo,fundo:p.fundo,reduzidos:p.reduzidos,som:p.som});function _(u){let M=2166136261;for(let b=0;b<u.length;b++)M^=u.charCodeAt(b),M=Math.imul(M,16777619);return M>>>0}function f(u){let M=u>>>0;return()=>{M=M+1831565813>>>0;let b=M;return b=Math.imul(b^b>>>15,b|1),b^=b+Math.imul(b^b>>>7,b|61),((b^b>>>14)>>>0)/4294967296}}function A(u){let M=Math.max(u(),1e-9),b=u();return Math.sqrt(-2*Math.log(M))*Math.cos(2*Math.PI*b)}let I=new Uint8Array(512);{let u=f(7031),M=Array.from({length:256},(b,L)=>L);for(let b=255;b>0;b--){let L=Math.floor(u()*(b+1));[M[b],M[L]]=[M[L],M[b]]}for(let b=0;b<512;b++)I[b]=M[b&255]}let E=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],R=u=>u*u*u*(u*(u*6-15)+10);function w(u,M,b){let L=Math.floor(u)&255,j=Math.floor(M)&255,P=Math.floor(b)&255;u-=Math.floor(u),M-=Math.floor(M),b-=Math.floor(b);let N=R(u),q=R(M),ht=R(b),lt=(ee,wn,rn,vn)=>{let Ye=E[ee%12];return Ye[0]*wn+Ye[1]*rn+Ye[2]*vn},dt=I[L]+j,Lt=I[dt]+P,de=I[dt+1]+P,Ht=I[L+1]+j,te=I[Ht]+P,Vt=I[Ht+1]+P,Zt=(ee,wn,rn)=>ee+rn*(wn-ee);return Zt(Zt(Zt(lt(I[Lt],u,M,b),lt(I[te],u-1,M,b),N),Zt(lt(I[de],u,M-1,b),lt(I[Vt],u-1,M-1,b),N),q),Zt(Zt(lt(I[Lt+1],u,M,b-1),lt(I[te+1],u-1,M,b-1),N),Zt(lt(I[de+1],u,M-1,b-1),lt(I[Vt+1],u-1,M-1,b-1),N),q),ht)}let D=2.35,v=.14,C={frontal:{theta0:0,r:[.18,1]},temporal:{theta0:Math.PI/2,r:[.16,.56]},occipital:{theta0:Math.PI/2,r:[.56,1]},motor:{theta0:Math.PI,r:[.16,.6]},parietal:{theta0:Math.PI,r:[.6,.96]},cerebelo:{theta0:Math.PI*1.5,r:[.2,.82]}},k=(u,M)=>u+D*Math.log(Math.max(M,.02)/v),F=t.nos.length,G=F+96,V=t.nos.map((u,M)=>({...u,i:M,viz:[]}));for(let[u,M]of t.arestas)V[u].viz.push(M),V[M].viz.push(u);let Q=new Float32Array(G*3);function Y(u){let M=new Map;for(let dt of V)dt.l===u&&M.set(dt.s,(M.get(dt.s)||0)+1);let b=[...M.entries()].sort((dt,Lt)=>Lt[1]-dt[1]||dt[0].localeCompare(Lt[0])),[L,j]=C[u].r,P=b.map(([,dt])=>Math.sqrt(dt)),N=P.reduce((dt,Lt)=>dt+Lt,0)||1,q=b.map((dt,Lt)=>Lt).sort((dt,Lt)=>dt%2-Lt%2||(dt%2?Lt-dt:dt-Lt)),ht=new Map,lt=L;for(let dt of q){let Lt=(j-L)*P[dt]/N;ht.set(b[dt][0],[lt,lt+Lt]),lt+=Lt}return ht}let it={frontal:Y("frontal"),parietal:Y("parietal")};function K(u){let M=f(_(u.id)),b=new U;if(u.id==="00_PAINEL")return b.set(0,0,0);if(u.l==="talamo")return b.set(A(M)*.035,A(M)*.022,A(M)*.035);if(u.l==="tronco"){let lt=M()*Math.PI*2,dt=1.04+M()*.34;return b.set(Math.cos(lt)*dt,A(M)*.07,Math.sin(lt)*dt)}let L=C[u.l]||C.frontal,j=it[u.l]?.get(u.s)||L.r,P=j[0]+Math.pow(M(),.85)*(j[1]-j[0]),N=.065+P*.035,q=k(L.theta0,P)+A(M)*N,ht=P+A(M)*.016;return b.set(Math.cos(q)*ht,A(M)*.016*(1.25-P*.6),Math.sin(q)*ht)}V.forEach(u=>{let M=K(u);Q.set([M.x,M.y,M.z],u.i*3)});let rt=new U,ct=new U,_t=new U,ft=new U;function Rt(u,M,b){b.addVectors(u,M).multiplyScalar(.5);let L=u.distanceTo(M),j=1-Math.min(.45,L*.35),P=.28*Math.min(1,L),N=b.x*j,q=b.z*j;return b.set(N*Math.cos(P)-q*Math.sin(P),b.y,N*Math.sin(P)+q*Math.cos(P))}function ie(u,M,b,L,j){let P=1-L;return j.set(P*P*u.x+2*P*L*M.x+L*L*b.x,P*P*u.y+2*P*L*M.y+L*L*b.y,P*P*u.z+2*P*L*M.z+L*L*b.z)}let ye=n("palco"),Ft;try{Ft=new Hl({antialias:!1,powerPreference:"low-power"})}catch{return n("sem-webgl").hidden=!1,null}Ft.setClearColor(461590,1),ye.appendChild(Ft.domElement);let tt=new Cs,mt=50,at=new pn(mt,1,.005,80),Xt=new U(0,-.05,.12),Jt=new U(0,Math.sin(xi.degToRad(40)),Math.cos(xi.degToRad(40)));at.position.copy(Xt).addScaledVector(Jt,1.5);let Et=new ql(at,Ft.domElement);Et.target.copy(Xt),Et.enableDamping=!0,Et.dampingFactor=.07,Et.minDistance=.03,Et.maxDistance=6,Et.zoomToCursor=!0,Et.zoomSpeed=1.1,Et.rotateSpeed=.55,Et.autoRotateSpeed=.12;let Te=new $e(new gi(2,2),new Se({depthTest:!1,depthWrite:!1,uniforms:{uAspecto:{value:1}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:`varying vec2 vUv; uniform float uAspecto;
      void main(){ vec2 p = (vUv - vec2(0.5, 0.55)) * vec2(uAspecto, 1.0) / min(uAspecto, 1.0);
        float h = smoothstep(0.9, 0.0, length(p));
        gl_FragColor = vec4(mix(vec3(0.0275, 0.043, 0.086), vec3(0.047, 0.086, 0.188), h * h * 0.8), 1.0); }`}));Te.frustumCulled=!1,Te.renderOrder=-10,tt.add(Te);let se=`
  float h3(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
  float vn(vec3 x){ vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(h3(i), h3(i + vec3(1,0,0)), f.x), mix(h3(i + vec3(0,1,0)), h3(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(h3(i + vec3(0,0,1)), h3(i + vec3(1,0,1)), f.x), mix(h3(i + vec3(0,1,1)), h3(i + vec3(1,1,1)), f.x), f.y), f.z); }
  float fbm(vec3 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 6; i++) { s += a * vn(p); p = p * 2.03 + vec3(1.7, 9.2, 3.1); a *= 0.5; } return s; }`,pe=new U(.42,.78,-.46).normalize(),ae=new Di;ae.renderOrder=-9,tt.add(ae);let ue=(()=>{let u=new mn(2048,1024,{depthBuffer:!1,minFilter:Ue,magFilter:Ue,generateMipmaps:!1}),M=new Cs,b=new Rs(-1,1,1,-1,0,1);return M.add(new $e(new gi(2,2),new Se({uniforms:{uN:{value:pe}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:`uniform vec3 uN; varying vec2 vUv; ${se}
      void main(){
        float lon = (vUv.x - 0.5) * 6.2831853, lat = (vUv.y - 0.5) * 3.1415927;
        vec3 dir = vec3(cos(lat) * sin(lon), sin(lat), cos(lat) * cos(lon));
        vec3 C = normalize(cross(uN, vec3(0.0, 0.0, 1.0)));
        float bojo = exp(-dot(dir - C, dir - C) / 0.35);
        float d = dot(dir, uN), d2 = d + (fbm(dir * 2.5) - 0.5) * 0.12;
        float brilho = exp(-d2 * d2 / 0.010) * (0.5 + 0.5 * bojo) + exp(-d2 * d2 / 0.06) * 0.22;
        float mancha = fbm(dir * 6.0 + 3.0);
        brilho *= 0.35 + mancha * 1.2;
        // faixas escuras de poeira, concentradas na linha central (a Grande Fenda)
        float faixa = smoothstep(0.47, 0.64, fbm(dir * 9.0 + 11.0)) * exp(-d * d / 0.005);
        brilho *= 1.0 - 0.85 * faixa;
        vec3 cor = mix(vec3(0.55, 0.62, 0.86), vec3(0.88, 0.75, 0.6), clamp(bojo * 0.8 + mancha * 0.3, 0.0, 1.0)) * brilho;
        // estrelas n\xE3o resolvidas: o gr\xE3o da faixa
        // regi\xF5es HII rosadas ao longo da faixa
        cor += vec3(0.78, 0.3, 0.38) * smoothstep(0.6, 0.78, fbm(dir * 4.0 + 20.0)) * exp(-d * d / 0.02) * 0.45;
        cor += vec3(0.05, 0.06, 0.1) * fbm(dir * 1.5 + 7.0) * 0.4;
        gl_FragColor = vec4(cor, 1.0); }`}))),Ft.setRenderTarget(u),Ft.render(M,b),Ft.setRenderTarget(null),M.children[0].geometry.dispose(),M.children[0].material.dispose(),u.texture})();{let u=new Se({transparent:!0,depthTest:!1,depthWrite:!1,side:cn,uniforms:{uVia:{value:ue},uIntens:{value:.3}},vertexShader:"varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform sampler2D uVia; uniform float uIntens; varying vec3 vD;
      void main(){ vec3 d = normalize(vD);
        vec2 uv = vec2(atan(d.x, d.z) / 6.2831853 + 0.5, asin(clamp(d.y, -1.0, 1.0)) / 3.1415927 + 0.5);
        gl_FragColor = vec4(texture2D(uVia, uv).rgb * uIntens, 1.0); }`});u.blending=Pn,u.blendSrc=Pe,u.blendDst=Pe;let M=new $e(new ca(40,64,32),u);M.frustumCulled=!1,M.renderOrder=-9.5,ae.add(M)}{let u=f(404),M=14e3,b=new Float32Array(M*3),L=new Float32Array(M*3),j=new Float32Array(M),P=new kt,N=new U,q=["#ffffff","#cfe0ff","#aac8ff","#ffe2c4","#ffd0a8","#ffb98a"];for(let Lt=0;Lt<M;Lt++){N.set(A(u),A(u),A(u)).normalize();let de=u()<.6;if(de){let Ht=N.dot(pe);N.addScaledVector(pe,-Ht+A(u)*.06).normalize()}N.multiplyScalar(30),b.set([N.x,N.y,N.z],Lt*3),P.set(q[Math.floor(u()*q.length)]),L.set([P.r,P.g,P.b],Lt*3),j[Lt]=de?.3+Math.pow(u(),9)*2.6:.4+Math.pow(u(),7)*3.2}let ht=new Re;ht.setAttribute("position",new Qt(b,3)),ht.setAttribute("aCor",new Qt(L,3)),ht.setAttribute("aTam",new Qt(j,1));let lt=new Se({transparent:!0,depthTest:!1,depthWrite:!1,uniforms:{uDpr:{value:1}},vertexShader:`attribute vec3 aCor; attribute float aTam; uniform float uDpr; varying vec3 vC; varying float vE;
      void main(){ vC = aCor; vE = step(2.0, aTam); vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aTam * uDpr * (1.6 + vE * 4.0); gl_Position = projectionMatrix * mv; }`,fragmentShader:`varying vec3 vC; varying float vE;
      void main(){ vec2 d = gl_PointCoord - 0.5; float k = 1.0 + vE * 4.0;
        float a = exp(-dot(d, d) * 18.0 * k * k);
        vec2 q = abs(d) * 2.0;
        a += vE * (exp(-q.x * 60.0) * exp(-q.y * 4.0) + exp(-q.y * 60.0) * exp(-q.x * 4.0)) * 0.5;
        gl_FragColor = vec4(vC * a * 0.6, 1.0); }`});lt.blending=Pn,lt.blendSrc=Pe,lt.blendDst=Pe;let dt=new bn(ht,lt);dt.frustumCulled=!1,dt.renderOrder=-9,dt.name="ceu",ae.add(dt)}function Be(){let b=document.createElement("canvas");b.width=b.height=640;let L=b.getContext("2d"),j=L.createImageData(640,640),P=q=>Math.exp(q);for(let q=0;q<16;q++){let ht=q%4*160,lt=Math.floor(q/4)*160,dt=q*5.31,Lt=q%3===0?3:2,de=2.2+q%4*.5;for(let Ht=0;Ht<160;Ht++)for(let te=0;te<160;te++){let Vt=(te+.5)/160*2-1,Zt=(Ht+.5)/160*2-1,ee=Math.hypot(Vt,Zt),wn=Math.atan2(Zt,Vt),rn=w(Vt*6+dt,Zt*6-dt,.7)*.5+.5,vn=0,Ye=0,He=0;if(q<=7){let Ce=q>=6,Ze=Math.cos(Lt*(wn-de*Math.log(ee+.04))),ui=Math.pow(Math.max(0,Ze*.5+.5),3)*(Ce?Math.min(1,Math.max(0,(ee-.18)*5)):1),di=P(-ee*3.4),vc=P(-ee*ee*70),Ga=di*(.18+.95*ui*(.55+.45*rn));Ce&&(Ga+=P(-(Vt*Vt/.09+Zt*Zt/.003))*.6),vn=vc*1.2+Ga*.62,Ye=vc*1.05+Ga*.72,He=vc*.8+Ga*1,ui>.7&&rn>.62&&(vn+=di*.5,Ye+=di*.18,He+=di*.3)}else if(q<=9){let Ce=P(-Math.pow(ee/.16,.6)*2.2)*1.1;vn=Ce,Ye=Ce*.86,He=Ce*.66}else if(q<=11){let Ce=P(-Math.abs(Zt)*20-Math.abs(Vt)*2.6),Ze=P(-(Vt*Vt+Zt*Zt*3)*28),ui=1-.85*P(-Math.pow((Zt-.012)*70,2))*Math.max(0,1-Math.abs(Vt)*1.1),di=(Ce*(.6+.4*rn)+Ze)*ui;vn=di*.9+Ze*.3,Ye=di*.85+Ze*.2,He=di*.95}else if(q===12){let Ce=0;for(let Ze=0;Ze<6;Ze++){let ui=Math.sin(Ze*2.1+1)*.35,di=Math.cos(Ze*3.7)*.25;Ce+=P(-((Vt-ui)**2+(Zt-di)**2)*30)*(.4+Ze%3*.2)}Ce*=.6+.6*rn,vn=Ce*.7,Ye=Ce*.8,He=Ce*1.05}else if(q===13){let Ce=P(-Math.pow((ee-.6-.1*(rn-.5))/.09,2))*(.45+.55*Math.abs(Math.sin(wn+.6)))*(.5+rn),Ze=P(-ee*ee*7)*.55,ui=P(-ee*ee*400);vn=Ce*1+Ze*.7+ui,Ye=Ce*.5+Ze*.35+ui,He=Ce*.22+Ze*1+ui*1.2}else if(q===14){let Ce=Math.pow(.5+.5*Math.sin(wn*23+rn*5),6)*P(-ee*3.2)*(.6+rn),Ze=P(-ee*ee*40)*1.4;vn=Ze*.9+Ce*1,Ye=Ze*.95+Ce*.5,He=Ze*1.1+Ce*.3+P(-ee*ee*9)*.2}else{let Ce=P(-ee*4.5)*.7+P(-ee*ee*50)*.8;vn=Ce,Ye=Ce*.9,He=Ce*.78}let ce=Math.max(0,Math.min(1,(1-ee)/.2)),Cn=((lt+Ht)*160*4+ht+te)*4;j.data[Cn]=Math.min(255,vn*ce*255),j.data[Cn+1]=Math.min(255,Ye*ce*255),j.data[Cn+2]=Math.min(255,He*ce*255),j.data[Cn+3]=255}}L.putImageData(j,0,0);let N=new xr(b);return N.generateMipmaps=!0,N.minFilter=si,N.magFilter=Ue,N}let ze={value:1},Ve={value:200};{let u=f(808),M=120,b=M+420,L=new Float32Array(b*3),j=new Float32Array(b),P=new Float32Array(b),N=new Float32Array(b),q=new Float32Array(b),ht=new Float32Array(b),lt=new U;for(let Ht=0;Ht<b;Ht++){do lt.set(A(u),A(u),A(u)).normalize();while(Math.abs(lt.dot(pe))<.13&&u()<.88);let te=Ht<M,Vt=te?14+u()*20:30+u()*8;L.set([lt.x*Vt,lt.y*Vt,lt.z*Vt],Ht*3);let Zt=te?xi.degToRad(1+Math.pow(u(),2.2)*6.5):xi.degToRad(.25+u()*.5);j[Ht]=Vt*Zt;let ee=Math.floor(te?u()*16:u()*12);P[Ht]=ee,N[Ht]=u()*Math.PI*2,q[Ht]=ee>=10&&ee<=11||ee>=13&&ee<=14?1:.25+u()*.75,ht[Ht]=te?.6+u()*.5:.35+u()*.4}let dt=new Re;dt.setAttribute("position",new Qt(L,3));for(let[Ht,te]of[["aTam",j],["aCel",P],["aRot",N],["aIncl",q],["aAlfa",ht]])dt.setAttribute(Ht,new Qt(te,1));let Lt=new Se({transparent:!0,depthTest:!1,depthWrite:!1,uniforms:{uAtlas:{value:Be()},uProj:ze,uCap:Ve},vertexShader:`attribute float aTam; attribute float aCel; attribute float aRot; attribute float aIncl; attribute float aAlfa;
      uniform float uProj; uniform float uCap; varying float vCel; varying float vRot; varying float vIncl; varying float vA;
      void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float px = aTam * uProj / -mv.z;
        gl_PointSize = clamp(px, 1.5, uCap);
        vA = aAlfa * min(1.0, px / 1.5); vCel = aCel; vRot = aRot; vIncl = aIncl;
        gl_Position = projectionMatrix * mv; }`,fragmentShader:`uniform sampler2D uAtlas; varying float vCel; varying float vRot; varying float vIncl; varying float vA;
      void main(){ vec2 p = gl_PointCoord - 0.5;
        float c = cos(vRot), s = sin(vRot);
        p = vec2(c * p.x - s * p.y, (s * p.x + c * p.y) / vIncl) + 0.5;
        if (p.x < 0.0 || p.y < 0.0 || p.x > 1.0 || p.y > 1.0) discard;
        vec2 cel = vec2(mod(vCel, 4.0), floor(vCel / 4.0));
        gl_FragColor = vec4(texture2D(uAtlas, (cel + p) / 4.0).rgb * vA, 1.0); }`});Lt.blending=Pn,Lt.blendSrc=Pe,Lt.blendDst=Pe;let de=new bn(dt,Lt);de.frustumCulled=!1,de.renderOrder=-8,tt.add(de)}function Xe(){let b=document.createElement("canvas");b.width=b.height=512;let L=b.getContext("2d"),j=L.createImageData(512,512);for(let N=0;N<16;N++){let q=N%4*128,ht=Math.floor(N/4)*128,lt=N*13.7,dt=N*7.3;for(let Lt=0;Lt<128;Lt++)for(let de=0;de<128;de++){let Ht=de/128-.5,te=Lt/128-.5,Vt=w(Ht*3+lt,te*3+dt,1.7)*.35,Zt=w(Ht*3+lt,te*3+dt,9.1)*.35,ee=0,wn=.5,rn=2.2;for(let Cn=0;Cn<4;Cn++)ee+=wn*w((Ht+Vt)*rn+lt,(te+Zt)*rn+dt,Cn*3.3),wn*=.5,rn*=2.1;let vn=Math.sqrt(Ht*Ht+te*te)*2,Ye=Math.max(0,1-vn),He=Math.max(0,Math.min(1,ee*1.6+.42))*Math.pow(Ye,1.6),ce=((ht+Lt)*128*4+q+de)*4;j.data[ce]=j.data[ce+1]=j.data[ce+2]=255,j.data[ce+3]=Math.round(He*255)}}L.putImageData(j,0,0);let P=new xr(b);return P.generateMipmaps=!0,P.minFilter=si,P.magFilter=Ue,P}let De=Xe(),be=8,B=Array.from({length:be},()=>({pos:new U,cor:new kt,t0:-1e9,forca:0,raio:.1,dur:600,piscar:!1})),Qe={value:B.map(()=>new Le(0,0,0,0))},fe={value:B.map(()=>new U)},T={value:B.map(()=>.01)},g=0;function H(u,M,b,L,j,P=!1){let N=B[g++%be];N.pos.copy(u),N.cor.set(M),N.t0=un,N.forca=b,N.raio=L,N.dur=j,N.piscar=P&&!p.reduzidos&&!p.movimentoReduzido}let Z=`
  uniform vec4 uClaroes[${be}]; uniform vec3 uClaroesCor[${be}]; uniform float uClaroesRaio[${be}];
  vec3 luzClaroes(vec3 p) {
    vec3 s = vec3(0.0);
    for (int i = 0; i < ${be}; i++) {
      vec4 c = uClaroes[i];
      if (c.w <= 0.001) continue;
      vec3 d = p - c.xyz;
      s += uClaroesCor[i] * c.w * exp(-dot(d, d) / uClaroesRaio[i]);
    }
    return s;
  }`,et=u=>.2+.8*(1-Math.exp(-u/7e3)),ut={value:et(t.arestas.length)},gt={value:1},nt={value:-1},st={value:0},yt={value:1},Ot={value:100},bt={value:1},xt={value:1};function Bt(u,M,b,L){return b==="tronco"?L.copy(h.violeta).lerp(h.cavidade,M()*.4):b==="talamo"||u<.07?L.copy(h.nucleo).lerp(h.ouro,M()*.6):u<.2?L.copy(h.teal).lerp(h.cavidade,M()*.8):u<.32?L.copy(h.teal).lerp(h.ouro,(u-.2)/.12*(.6+M()*.4)):u<.62?L.copy(h.ouro).lerp(h.laranja,(u-.32)/.3*(.5+M()*.5)):L.copy(h.laranja).lerp(h.ferrugem,Math.min(1,(u-.62)/.4)*(.5+M()*.5))}let Wt=2600,Ut={pos:[],cor:[],tam:[],alfa:[],var:[],rot:[],reg:[],keep:[]},O={pos:[],cor:[],tam:[],alfa:[],var:[],rot:[],reg:[],keep:[]};function pt(u,M,b,L,j,P,N){u.pos.push(M.x,M.y,M.z),u.cor.push(b.r,b.g,b.b),u.tam.push(L),u.alfa.push(j),u.var.push(Math.floor(P()*16)),u.rot.push(P()*Math.PI*2),u.reg.push(N),u.keep.push(P())}{let u=f(1234),M=new kt,b=new U;for(let L=0;L<26;L++)b.set(A(u)*.05,A(u)*.02,A(u)*.05),M.copy(h.nucleo).lerp(h.ouro,u()*.5),pt(Ut,b,M,.16+u()*.18,.16,u,7);for(let L=0;L<40;L++){let j=u()*Math.PI*2,P=.1+u()*.14;b.set(Math.cos(j)*P,A(u)*.02,Math.sin(j)*P),pt(Ut,b,Bt(P,u,"cavidade",M),.16+u()*.12,.07,u,7)}for(let L of V){b.fromArray(Q,L.i*3);let j=Math.hypot(b.x,b.z);b.x+=A(u)*.03,b.z+=A(u)*.03,b.y+=A(u)*.008;let P=L.l==="tronco";if(pt(Ut,b,Bt(j,u,L.l,M),.1+u()*.1,P?.035:.13,u,d[L.l]??7),!P&&L.l!=="talamo"&&u()<.45){let N=Math.atan2(b.z,b.x),q=Math.max(.05,j-.035-u()*.03),ht=new U(Math.cos(N+.05)*q,b.y,Math.sin(N+.05)*q);pt(O,ht,M.setRGB(0,0,0),.07+u()*.07,.3,u,d[L.l]??7)}}}let J=t.arestas.map(([u,M])=>[u,M]);function Mt(u,M,b=1){let[L,j]=J[u];rt.fromArray(Q,L*3),ct.fromArray(Q,j*3),Rt(rt,ct,_t),ie(rt,_t,ct,.2+M()*.6,ft);let P=Math.hypot(ft.x,ft.z),N=new kt;Bt(P,M,V[L].l,N),pt(Ut,ft,N,.06+M()*.07,.085*b,M,d[V[L].l]??7)}{let u=f(77),M=Math.max(1,J.length/Wt);for(let b=0;b<J.length;b+=M)Mt(Math.floor(b),u,Math.min(2,M))}let Tt=Ut.tam.length+600;function ot(u,M){let b=new Re,L=(j,P)=>{let N=new Float32Array(M*P);return N.set(j),new Qt(N,P)};return b.setAttribute("position",L(u.pos,3)),b.setAttribute("aCor",L(u.cor,3)),b.setAttribute("aTam",L(u.tam,1)),b.setAttribute("aAlfa",L(u.alfa,1)),b.setAttribute("aVar",L(u.var,1)),b.setAttribute("aRot",L(u.rot,1)),b.setAttribute("aReg",L(u.reg,1)),b.setAttribute("aKeep",L(u.keep,1)),b.setDrawRange(0,u.tam.length),b}let zt=`attribute vec3 aCor; attribute float aTam; attribute float aAlfa; attribute float aVar; attribute float aRot; attribute float aReg; attribute float aKeep;
  uniform float uProj; uniform float uCap; uniform float uQualidade; uniform float uDens; uniform float uRegiao; uniform float uEscondeArq;
  varying vec3 vCor; varying float vA; varying float vVar; varying float vRot; varying vec3 vLuz;
  ${Z}
  void main(){
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float z = -mv.z;
    float px = aTam * uProj / z;
    gl_PointSize = min(px, uCap);
    // perto da c\xE2mera a nuvem se abre e some: \xE9 o voo atravessando o g\xE1s
    float perto = smoothstep(0.015, 0.16, z);
    float filtro = (uRegiao < 0.0 || abs(aReg - uRegiao) < 0.5) ? 1.0 : 0.12;
    if (uEscondeArq > 0.5 && abs(aReg - 6.0) < 0.5) filtro = 0.0;
    float corte = px > uCap ? (uCap / px) * (uCap / px) : 1.0;
    vA = aAlfa * uDens * perto * filtro * corte * step(aKeep, uQualidade);
    vCor = aCor; vVar = aVar; vRot = aRot; vLuz = luzClaroes(position) * filtro;
    gl_Position = projectionMatrix * mv;
    // invis\xEDvel n\xE3o custa nada: fora do recorte, tamanho zero
    if (vA < 0.003) { gl_PointSize = 0.0; gl_Position = vec4(2.0, 2.0, 2.0, 1.0); }
  }`,Dt=u=>`uniform sampler2D uAtlas; varying vec3 vCor; varying float vA; varying float vVar; varying float vRot; varying vec3 vLuz;
  void main(){
    vec2 p = gl_PointCoord - 0.5;
    float c = cos(vRot), s = sin(vRot);
    p = vec2(c * p.x - s * p.y, s * p.x + c * p.y) + 0.5;
    if (p.x < 0.0 || p.y < 0.0 || p.x > 1.0 || p.y > 1.0) discard;
    vec2 cel = vec2(mod(vVar, 4.0), floor(vVar / 4.0));
    float t = texture2D(uAtlas, (cel + p) / 4.0).a;
    ${u?"float l = clamp(dot(vLuz, vec3(0.33)), 0.0, 1.0); gl_FragColor = vec4(0.0, 0.0, 0.0, t * vA * (1.0 - l));":"gl_FragColor = vec4(vCor * t * vA + vLuz * t * 0.9, 1.0);"}
  }`;function Ae(u){let M=new Se({transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uAtlas:{value:De},uProj:yt,uCap:Ot,uQualidade:bt,uDens:ut,uRegiao:nt,uEscondeArq:st,uClaroes:Qe,uClaroesCor:fe,uClaroesRaio:T},vertexShader:zt,fragmentShader:Dt(u)});return M.blending=Pn,u?(M.blendSrc=M.blendSrcAlpha=br,M.blendDst=M.blendDstAlpha=ur):(M.blendSrc=Pe,M.blendDst=Pe,M.blendSrcAlpha=br,M.blendDstAlpha=Pe),M}let Me=ot(Ut,Tt),En=new bn(Me,Ae(!1));En.frustumCulled=!1,En.renderOrder=1;let Gn=ot(O,O.tam.length),Pr=new bn(Gn,Ae(!0));Pr.frustumCulled=!1,Pr.renderOrder=2;let Ir=new Cs;Ir.add(En,Pr);let ds=.5,fs=new mn(1,1,{type:Ft.capabilities.isWebGL2&&Ft.extensions.has("EXT_color_buffer_float")?$n:Sn,depthBuffer:!1,minFilter:Ue,magFilter:Ue}),oi=new $e(new gi(2,2),new Se({transparent:!0,depthTest:!1,depthWrite:!1,uniforms:{uPoeira:{value:fs.texture}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:`uniform sampler2D uPoeira; varying vec2 vUv;
      void main(){ vec4 p = texture2D(uPoeira, vUv);
        gl_FragColor = vec4(vec3(1.0) - exp(-p.rgb * 1.15), p.a); }`}));oi.material.blending=Pn,oi.material.blendSrc=Pe,oi.material.blendDst=hr,oi.material.blendSrcAlpha=br,oi.material.blendDstAlpha=Pe,oi.frustumCulled=!1,oi.renderOrder=1,tt.add(oi);let Kn=J.length+400,Lr=new Float32Array(Kn*3),li=new Float32Array(Kn),Ns=new Float32Array(Kn),Us=new Float32Array(Kn).fill(1);function Dr(u,M){let[b,L]=J[u];rt.fromArray(Q,b*3),ct.fromArray(Q,L*3),Rt(rt,ct,_t),ie(rt,_t,ct,.15+M()*.7,ft),Lr.set([ft.x+A(M)*.006,ft.y+A(M)*.003,ft.z+A(M)*.006],u*3),li[u]=M()*100,Ns[u]=d[V[b].l]??7}{let u=f(31);J.forEach((M,b)=>Dr(b,u))}let hn=new Re;hn.setAttribute("position",new Qt(Lr,3)),hn.setAttribute("aFase",new Qt(li,1)),hn.setAttribute("aReg",new Qt(Ns,1)),hn.setAttribute("aNasc",new Qt(Us,1)),hn.setDrawRange(0,J.length);let Nr={value:0},zi={value:1},ps=new Se({transparent:!0,depthTest:!1,depthWrite:!1,blending:Ps,uniforms:{uTempo:Nr,uDpr:zi,uRegiao:nt,uEscondeArq:st,uClaroes:Qe,uClaroesCor:fe,uClaroesRaio:T,uDens:ut,uTela:xt},vertexShader:`attribute float aFase; attribute float aReg; attribute float aNasc; uniform float uTempo; uniform float uDpr; uniform float uRegiao; uniform float uEscondeArq; uniform float uDens; uniform float uTela;
    varying float vA; varying vec3 vLuz;
    ${Z}
    void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0);
      float pisca = 0.55 + 0.45 * sin(uTempo * (0.6 + fract(aFase) * 1.4) + aFase);
      float filtro = (uRegiao < 0.0 || abs(aReg - uRegiao) < 0.5) ? 1.0 : 0.12;
      if (uEscondeArq > 0.5 && abs(aReg - 6.0) < 0.5) filtro = 0.0;
      vA = pisca * filtro * aNasc * (0.5 + 0.5 * uDens) * uTela * smoothstep(0.0, 0.08, -mv.z);
      vLuz = luzClaroes(position);
      gl_PointSize = (1.3 + 1.6 * aNasc * step(aNasc, 0.999)) * uDpr * clamp(1.4 / -mv.z, 0.8, 3.0);
      gl_Position = projectionMatrix * mv; }`,fragmentShader:`varying float vA; varying vec3 vLuz;
    void main(){ vec2 d = gl_PointCoord - 0.5; float g = exp(-dot(d, d) * 14.0);
      gl_FragColor = vec4((vec3(1.0, 0.86, 0.62) * 0.4 + vLuz * 1.2) * g * vA, 1.0); }`});ps.blending=Pn,ps.blendSrc=Pe,ps.blendDst=Pe;let Fs=new bn(hn,ps);Fs.frustumCulled=!1,Fs.renderOrder=3,tt.add(Fs);let qe=5,Mi=new Float32Array(Kn*qe*6),Os=new Float32Array(Kn*qe*2),Aa=new Float32Array(Kn);function y(u){let[M,b]=J[u];rt.fromArray(Q,M*3),ct.fromArray(Q,b*3),Rt(rt,ct,_t),Aa[u]=Math.exp(-rt.distanceTo(ct)*3.2)*Math.min(1,6/Math.sqrt(Math.max(1,V[M].viz.length*V[b].viz.length)));let L=u*qe*6,j=rt.clone();for(let P=1;P<=qe;P++)ie(rt,_t,ct,P/qe,ft),Mi[L++]=j.x,Mi[L++]=j.y,Mi[L++]=j.z,Mi[L++]=ft.x,Mi[L++]=ft.y,Mi[L++]=ft.z,j.copy(ft)}J.forEach((u,M)=>y(M));let z=new Re;z.setAttribute("position",new Qt(Mi,3)),z.setAttribute("aAlfa",new Qt(Os,1)),z.setDrawRange(0,J.length*qe*2);let $=new Se({transparent:!0,depthWrite:!1,depthTest:!1,blending:Ps,uniforms:{uAlfa:{value:.07},uTela:xt},vertexShader:"attribute float aAlfa; varying float vA; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vA = aAlfa * smoothstep(0.0, 0.1, -mv.z); gl_Position = projectionMatrix * mv; }",fragmentShader:"uniform float uAlfa; uniform float uTela; varying float vA; void main(){ gl_FragColor = vec4(vec3(1.0, 0.78, 0.5), uAlfa * uTela * vA); }"}),X=new _r(z,$);X.frustumCulled=!1,X.renderOrder=4,tt.add(X);let W=new Re,vt=new Float32Array(400*qe*6);W.setAttribute("position",new Qt(vt,3)),W.setDrawRange(0,0);let wt=new gr({color:"#ffffff",transparent:!0,opacity:.28,blending:Ps,depthTest:!1,depthWrite:!1}),St=new _r(W,wt);St.frustumCulled=!1,St.renderOrder=5,tt.add(St);let Pt=new Float32Array(G),It=new Float32Array(G),Kt=new Float32Array(G*3),Yt=new Float32Array(G),Nt=new Float32Array(G),ge=new Float32Array(G),Ne=new Float32Array(G),_e=new kt;function me(u){let M=u.viz.length;Pt[u.i]=u.id==="00_PAINEL"?5:1.3+Math.min(3.2,Math.log2(1+M)*.5),ge[u.i]=M>=40||u.id==="00_PAINEL"?1:0,_e.set(c[u.k]||c.sistema),Kt.set([_e.r,_e.g,_e.b],u.i*3),Yt[u.i]=1,Nt[u.i]=1,Ne[u.i]=u.l==="tronco"?.4:1}V.forEach(me);let we=new Re;we.setAttribute("position",new Qt(Q,3));for(let[u,M,b]of[["aTam",Pt,1],["aAtiv",It,1],["aCor",Kt,3],["aVis",Yt,1],["aNasc",Nt,1],["aEspinho",ge,1],["aDim",Ne,1]])we.setAttribute(u,new Qt(M,b));we.setDrawRange(0,F);let Ct={value:1},tn=new Se({transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uEscala:Ct},vertexShader:`attribute float aTam; attribute float aAtiv; attribute vec3 aCor; attribute float aVis; attribute float aNasc; attribute float aEspinho; attribute float aDim;
    uniform float uEscala;
    varying float vAtiv; varying vec3 vCor; varying float vVis; varying float vHalo; varying float vEsp; varying float vPerto; varying float vDim;
    void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0);
      float a = clamp(aAtiv, 0.0, 1.6);
      vHalo = 1.0 + a * 6.0 + (1.0 - aNasc) * 10.0;
      vEsp = aEspinho;
      float z = -mv.z;
      gl_PointSize = min(aTam * vHalo * (1.0 + aEspinho * 2.6) * uEscala * clamp(1.6 / z, 0.6, 14.0), 260.0) * aVis;
      vAtiv = a; vCor = aCor; vVis = aVis; vDim = max(aDim, min(a, 1.0)); vPerto = smoothstep(0.004, 0.03, z);
      gl_Position = projectionMatrix * mv; }`,fragmentShader:`varying float vAtiv; varying vec3 vCor; varying float vVis; varying float vHalo; varying float vEsp; varying float vPerto; varying float vDim;
    void main(){ vec2 d = gl_PointCoord - 0.5; float r2 = dot(d, d) * 4.0;
      if (r2 > 1.0) discard;
      float esc = vHalo * (1.0 + vEsp * 2.6);
      float nucleo = exp(-r2 * 7.0 * esc * esc);
      float halo = exp(-r2 * 4.0) * min(vAtiv, 1.0);
      // raios de difra\xE7\xE3o em cruz nas estrelas-hub, como na foto de refer\xEAncia
      vec2 q = abs(d) * 2.0;
      float esp = vEsp * (exp(-q.x * 70.0) * exp(-q.y * 3.2) + exp(-q.y * 70.0) * exp(-q.x * 3.2)) * (0.55 + vAtiv);
      vec3 repouso = mix(vec3(1.0, 0.96, 0.9), vCor, 0.38);
      vec3 c = mix(repouso, vCor, smoothstep(0.0, 0.35, vAtiv));
      float brilho = nucleo * (0.9 + vAtiv * 1.6) + halo * 0.6 + esp * 0.7;
      gl_FragColor = vec4(c * brilho * vVis * vPerto * vDim, 1.0); }`});tn.blending=Pn,tn.blendSrc=Pe,tn.blendDst=Pe;let oe=new bn(we,tn);oe.frustumCulled=!1,oe.renderOrder=6,tt.add(oe);let en=700,_n=new Float32Array(en*3),Ln=new Float32Array(en*3),bi=new Float32Array(en),le=new Re;le.setAttribute("position",new Qt(_n,3)),le.setAttribute("aCor",new Qt(Ln,3)),le.setAttribute("aForca",new Qt(bi,1));let Fe=`attribute vec3 aCor; attribute float aForca; uniform float uEscala; varying vec3 vCor; varying float vF;
  void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vCor = aCor; vF = aForca;
    gl_PointSize = min((2.0 + 6.0 * aForca) * uEscala * clamp(1.6 / -mv.z, 0.6, 10.0), 120.0); gl_Position = projectionMatrix * mv; }`,ci=`varying vec3 vCor; varying float vF;
  void main(){ vec2 d = gl_PointCoord - 0.5; float r2 = dot(d, d) * 4.0; if (r2 > 1.0) discard;
    float g = exp(-r2 * 6.0) * 0.8 + exp(-r2 * 40.0);
    gl_FragColor = vec4(vCor * g * vF, 1.0); }`;function xe(){let u=new Se({transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uEscala:Ct},vertexShader:Fe,fragmentShader:ci});return u.blending=Pn,u.blendSrc=Pe,u.blendDst=Pe,u}let Wn=new bn(le,xe());Wn.frustumCulled=!1,Wn.renderOrder=7,tt.add(Wn);let Xn=[],Ur={value:new $t(1,1)};function Zh(u,M){let b=new Float32Array(u*12),L=new Float32Array(u*12),j=new Float32Array(u*4),P=new Float32Array(u*4),N=new Float32Array(u*4),q=new Float32Array(u*4),ht=new Float32Array(u*12),lt=new Uint32Array(u*6);for(let Vt=0;Vt<u;Vt++){let Zt=Vt*4;lt.set([Zt,Zt+1,Zt+2,Zt+2,Zt+1,Zt+3],Vt*6),j.set([-1,1,1,-1],Zt),P.set([-1,1,-1,1],Zt)}let dt=new Re;dt.setIndex(new Qt(lt,1));let Lt={position:[b,3],aOutro:[L,3],aLado:[j,1],aAlfa:[N,1],aLarg:[q,1],aCor:[ht,3]};for(let Vt in Lt)dt.setAttribute(Vt,new Qt(Lt[Vt][0],Lt[Vt][1]));dt.setAttribute("aPerfil",new Qt(P,1)),dt.setDrawRange(0,0);let de=new Se({transparent:!0,depthWrite:!1,depthTest:!1,side:Vn,uniforms:{uRes:Ur,uDpr:zi,uBranco:{value:M}},vertexShader:`attribute vec3 aOutro; attribute float aLado; attribute float aPerfil; attribute float aAlfa; attribute float aLarg; attribute vec3 aCor;
      uniform vec2 uRes; uniform float uDpr; varying float vA; varying float vL; varying vec3 vC;
      void main(){
        vec4 a = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vec4 b = projectionMatrix * modelViewMatrix * vec4(aOutro, 1.0);
        vec2 sa = a.xy / max(a.w, 1e-4) * uRes, sb = b.xy / max(b.w, 1e-4) * uRes;
        vec2 dir = sb - sa; float L = length(dir); dir = L > 1e-3 ? dir / L : vec2(1.0, 0.0);
        // a ponta passa um pouco do v\xE9rtice, e os segmentos se emendam sem falha nas curvas
        a.xy += (vec2(-dir.y, dir.x) * aLado - dir * 0.5) * aLarg * uDpr / uRes * a.w;
        vA = a.w > 0.0 ? aAlfa : 0.0; vL = aPerfil; vC = aCor;
        gl_Position = a; }`,fragmentShader:`uniform float uBranco; varying float vA; varying float vL; varying vec3 vC;
      void main(){ float x = abs(vL);
        float nucleo = exp(-x * x * 22.0), brilho = exp(-x * x * 3.0) * (1.0 - x * x);
        gl_FragColor = vec4((mix(vC, vec3(0.95, 0.97, 1.0), uBranco) * nucleo * 0.85 + vC * brilho * 0.3) * vA, 1.0); }`});de.blending=Pn,de.blendSrc=Pe,de.blendDst=Pe;let Ht=new $e(dt,de);Ht.frustumCulled=!1;let te={mesh:Ht,n:0,seg(Vt,Zt,ee,wn,rn,vn,Ye){if(te.n>=u)return;let He=te.n*4,ce=He*3;b[ce]=b[ce+3]=Vt.x,b[ce+1]=b[ce+4]=Vt.y,b[ce+2]=b[ce+5]=Vt.z,b[ce+6]=b[ce+9]=Zt.x,b[ce+7]=b[ce+10]=Zt.y,b[ce+8]=b[ce+11]=Zt.z,L[ce]=L[ce+3]=Zt.x,L[ce+1]=L[ce+4]=Zt.y,L[ce+2]=L[ce+5]=Zt.z,L[ce+6]=L[ce+9]=Vt.x,L[ce+7]=L[ce+10]=Vt.y,L[ce+8]=L[ce+11]=Vt.z,N[He]=N[He+1]=ee,N[He+2]=N[He+3]=wn,q[He]=q[He+1]=rn,q[He+2]=q[He+3]=vn;for(let Cn=0;Cn<4;Cn++)ht[ce+Cn*3]=Ye.r,ht[ce+Cn*3+1]=Ye.g,ht[ce+Cn*3+2]=Ye.b;te.n++},fim(){if(dt.setDrawRange(0,te.n*6),te.n||te.sujo)for(let Vt in Lt)dt.attributes[Vt].needsUpdate=!0;te.sujo=te.n>0,te.n=0}};return te}let Jl=24,wa=Zh(Jl*150,1);wa.mesh.renderOrder=8;let Ca=Jl*24,Ra=new Float32Array(Ca*3),Pa=new Float32Array(Ca*3),$h=new Float32Array(Ca),Vi=new Re;Vi.setAttribute("position",new Qt(Ra,3)),Vi.setAttribute("aCor",new Qt(Pa,3)),Vi.setAttribute("aForca",new Qt($h,1));let Kl=new bn(Vi,xe());Kl.frustumCulled=!1,Kl.renderOrder=8,tt.add(wa.mesh,Kl);let Bs=[],Si=f(4242),Fr=new U;function Jh(u,M,b,L,j,P=0,N=0,q=1){let ht=[u.clone(),M.clone()],lt=u.distanceTo(M),dt=M.clone().sub(u).normalize(),Lt=lt*(P?.17:.12);for(let te=0;te<b;te++){for(let Vt=ht.length-1;Vt>0;Vt--){let Zt=ht[Vt-1].clone().add(ht[Vt]).multiplyScalar(.5);Fr.set(A(Si),A(Si)*.6,A(Si)),Fr.addScaledVector(dt,-Fr.dot(dt)*.8),Zt.addScaledVector(Fr,Lt),ht.splice(Vt,0,Zt)}Lt*=.5}let de=ht.length,Ht=ht.map((te,Vt)=>N+Vt/(de-1)*q);L.push({pts:ht,prof:P,cheg:Ht});for(let te=0;te<j;te++){let Vt=2+Math.floor(Si()*(de*.75-2)),Zt=ht[Vt+1].clone().sub(ht[Vt-1]).normalize();Zt.add(Fr.set(A(Si),A(Si)*.5,A(Si)).multiplyScalar(.85)).normalize();let ee=ht[Vt].clone().addScaledVector(Zt,lt*(.08+Si()*.16)*(P?.55:1)),wn=P===0&&!p.reduzidos?Si()<.6?2:1:0;Jh(ht[Vt],ee,Math.max(2,b-2),L,wn,P+1,Ht[Vt],q*.55)}return L}let pf=new kt("#a8c0ff");function Kh(u,M,b,L=1,j=!0){if(p.movimentoReduzido){j&&H(M,b,.5*L,.12,700);return}let P=Jh(u,M,5,[],p.reduzidos?1:3);Bs.length>=Jl&&Bs.shift(),Bs.push({linhas:P,t0:un,cor:pf.clone().lerp(new kt(b),.3),forca:L,clarao:j?M.clone():null})}let Ei=110,jh=Ei+760;function mf(u){if(p.reduzidos||p.movimentoReduzido){let b=Math.min(1,u/jh);return{prog:Math.min(1,u/Ei),canal:Math.pow(1-b,2),galho:Math.pow(1-b,2)*.6,ponta:0}}if(u<Ei)return{prog:(Math.floor(u/Ei*8)+1)/8,canal:.28,galho:.2,ponta:.9};let M=u-Ei;return M<55?{prog:1,canal:1.3,galho:.8,ponta:0}:M<105?{prog:1,canal:.3,galho:.12,ponta:0}:M<165?{prog:1,canal:1,galho:.28,ponta:0}:{prog:1,canal:.75*Math.exp(-(M-165)/190),galho:.35*Math.exp(-(M-165)/90),ponta:0}}function gf(u){return p.reduzidos||p.movimentoReduzido?Math.pow(1-u,2):u<.12?1:u<.22?.25:u<.42?.9:Math.max(0,1-(u-.42)/.58)*.8}let _f=[7,3.6,2.2],xf=new kt("#9a7bff"),Qh=new kt;function vf(u){let M=0;for(let b=Bs.length-1;b>=0;b--){let L=Bs[b],j=u-L.t0;if(j>=jh){Bs.splice(b,1);continue}let P=mf(j);L.clarao&&j>=Ei&&(H(L.clarao,"#cfe6ff",.55*L.forca,.16,650),L.clarao=null);let N=Math.min(1,Math.max(0,(j-Ei-165)/400));Qh.copy(L.cor).lerp(xf,N);for(let{pts:q,prof:ht,cheg:lt}of L.linhas){let dt=(ht===0?P.canal:P.galho/ht)*L.forca;if(dt<.004&&!P.ponta)continue;let Lt=_f[Math.min(2,ht)],de=q.length;for(let Ht=1;Ht<de&&!(lt[Ht]>P.prog);Ht++){let te=P.ponta&&lt[Ht]>P.prog-.07?P.ponta:0,Vt=Math.max(dt,te)*(ht?1-.5*Ht/de:1),Zt=ht?Lt*(1-.6*(Ht-1)/de):Lt,ee=ht?Lt*(1-.6*Ht/de):Lt;wa.seg(q[Ht-1],q[Ht],Vt,Vt,Zt,ee,Qh),ht===0&&Ht%5===0&&M<Ca&&Vt>.2&&(Ra[M*3]=q[Ht].x,Ra[M*3+1]=q[Ht].y,Ra[M*3+2]=q[Ht].z,Pa[M*3]=L.cor.r,Pa[M*3+1]=L.cor.g,Pa[M*3+2]=L.cor.b,$h[M]=Vt*.3,M++)}}}wa.fim(),Vi.setDrawRange(0,M),Vi.attributes.position.needsUpdate=!0,Vi.attributes.aCor.needsUpdate=!0,Vi.attributes.aForca.needsUpdate=!0}let zs=new Se({transparent:!0,depthWrite:!1,depthTest:!1,side:Vn,uniforms:{uP:{value:0},uSem:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uP; uniform float uSem; varying vec2 vUv;
    void main(){ vec2 q = vUv - 0.5; float r = length(q) * 2.0, a = atan(q.y, q.x);
      // frente irregular: a onda avan\xE7a mais em uns \xE2ngulos que em outros
      float irr = sin(a * 7.0 + uSem) * 0.5 + sin(a * 13.0 - uSem * 2.0) * 0.3 + sin(a * 29.0 + uSem * 3.0) * 0.2;
      float fr = 0.95 + irr * 0.012;
      float frente = exp(-pow((r - fr) / 0.016, 2.0)) * (0.75 + 0.25 * sin(a * 3.0 + uSem));
      float rastro = exp(-pow((r - fr + 0.1) / 0.09, 2.0)) * step(r, fr);
      float f = pow(1.0 - uP, 1.5) * step(r, 1.0);
      vec3 c = vec3(0.7, 0.88, 1.0) * frente * 0.24 + mix(vec3(0.94, 0.55, 0.24), vec3(0.55, 0.23, 0.13), uP) * rastro * 0.3;
      gl_FragColor = vec4(c * f, 1.0); }`});zs.blending=Pn,zs.blendSrc=Pe,zs.blendDst=Pe;let ki=new $e(new gi(2,2),zs);ki.rotation.x=-Math.PI/2,ki.visible=!1,ki.renderOrder=7,ki.frustumCulled=!1,tt.add(ki);let Hi=null,Vs=new Se({transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uF:{value:0},uTam:{value:100}},vertexShader:"uniform float uTam; void main(){ gl_PointSize = uTam; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uF;
    void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d) * 2.0;
      float nucleo = exp(-r * r * 220.0) * 1.0 + exp(-r * r * 30.0) * 0.22 + exp(-r * 7.0) * 0.08;
      vec2 q = abs(d) * 2.0;
      float esp = exp(-q.x * 110.0) * exp(-q.y * 2.4) + exp(-q.y * 110.0) * exp(-q.x * 2.4);
      vec2 e = abs(vec2(d.x + d.y, d.x - d.y)) * 1.4142;
      float esp2 = (exp(-e.x * 160.0) * exp(-e.y * 6.0) + exp(-e.y * 160.0) * exp(-e.x * 6.0)) * 0.4;
      vec3 c = vec3(1.0, 0.97, 0.92) * nucleo + vec3(0.72, 0.84, 1.0) * esp * 0.9 + vec3(0.66, 0.78, 1.0) * esp2
             + vec3(0.72, 0.42, 0.95) * exp(-r * r * 5.0) * 0.12;
      gl_FragColor = vec4(c * uF * smoothstep(1.0, 0.55, r), 1.0); }`});Vs.blending=Pn,Vs.blendSrc=Pe,Vs.blendDst=Pe;let tu=new Re;tu.setAttribute("position",new Qt(new Float32Array(3),3));let ks=new bn(tu,Vs);ks.frustumCulled=!1,ks.renderOrder=9,ks.visible=!1,tt.add(ks);let Ia=Zh(520,.3);Ia.mesh.renderOrder=8,tt.add(Ia.mesh);let ms=[],eu=140,jl=ot({pos:[],cor:[],tam:[],alfa:[],var:[],rot:[],reg:[],keep:[]},eu),Ql=new bn(jl,Ae(!1));Ql.frustumCulled=!1,Ql.renderOrder=1,Ir.add(Ql);let La=[],Ge=f(5150),Ti=[[0,"#ffffff"],[.1,"#9fd8ff"],[.32,"#f0b44c"],[.58,"#e0733a"],[1,"#8c3b22"]].map(([u,M])=>[u,new kt(M)]);function yf(u,M){for(let b=1;b<Ti.length;b++)if(u<=Ti[b][0])return M.copy(Ti[b-1][1]).lerp(Ti[b][1],(u-Ti[b-1][0])/(Ti[b][0]-Ti[b-1][0]));return M.copy(Ti[Ti.length-1][1])}function Mf(){let u=p.reduzidos,M=p.movimentoReduzido;if(gs={t0:un,dur:M?900:2600},M)return;let b=u?140:420;for(let j=0;j<b;j++){let P=new U(A(Ge),A(Ge)*.32,A(Ge)).normalize();ms.push({dir:P,vel:.22+Math.pow(Ge(),.6)*1.15,t0:un+Ge()*60,vida:1200+Ge()*1500,larg:1.6+Ge()*2.2,rastro:.05+Ge()*.12})}ms.length>1200&&ms.splice(0,ms.length-1200);let L=u?50:eu;La.length=0;for(let j=0;j<L;j++){let P=new U(A(Ge),A(Ge)*.35,A(Ge)).normalize(),N=Ge(),q=new kt;N<.55?q.copy(h.laranja).lerp(h.ferrugem,Ge()):N<.82?q.copy(h.ouro).lerp(h.nucleo,Ge()*.5):q.copy(h.teal).lerp(h.cavidade,Ge()*.5),La.push({dir:P,R:.18+Math.pow(Ge(),.7)*.75,vida:2400+Ge()*1400,tam:.1+Ge()*.14,cor:q,varia:Math.floor(Ge()*16),rot:Ge()*6.28})}}let gs=null,Da=null,Na=new U;function bf(u){if(gs){let P=u-gs.t0;if(P/gs.dur>=1)gs=null,ks.visible=!1;else{let q=Math.min(1,P/60);Vs.uniforms.uF.value=(p.movimentoReduzido?.5:1)*.8*q*Math.exp(-Math.max(0,P-60)/520),Vs.uniforms.uTam.value=Math.min(1024,Ft.domElement.height*(.26+.16*_c(Math.min(1,P/900)))),ks.visible=!0}}let M=new U,b=new U,L=new kt;for(let P=ms.length-1;P>=0;P--){let N=ms[P],q=u-N.t0;if(q>=N.vida){ms.splice(P,1);continue}if(q<0)continue;let ht=.85,lt=q/1e3,dt=q/N.vida,Lt=N.vel*ht*(1-Math.exp(-lt/ht)),de=N.vel*Math.exp(-lt/ht);M.copy(N.dir).multiplyScalar(.012+Lt),b.copy(N.dir).multiplyScalar(Math.max(.006,Lt-de*N.rastro-.01)),yf(dt,L);let Ht=Math.pow(1-dt,1.4)*Math.min(1,q/40);Ia.seg(b,M,0,Ht,N.larg*.5,N.larg*(1-dt*.5),L)}Ia.fim();let j=0;if(gs&&La.length){let P=u-gs.t0,N=jl.attributes;for(let q of La){let ht=P/q.vida;if(ht>=1||ht<0)continue;let lt=1-Math.pow(1-ht,3);N.position.array.set([q.dir.x*q.R*lt,q.dir.y*q.R*lt,q.dir.z*q.R*lt],j*3),N.aCor.array.set([q.cor.r,q.cor.g,q.cor.b],j*3),N.aTam.array[j]=q.tam*(.5+1.6*lt),N.aAlfa.array[j]=.3*Math.min(1,ht/.12)*Math.pow(1-ht,1.4),N.aVar.array[j]=q.varia,N.aRot.array[j]=q.rot+ht*.6,N.aReg.array[j]=7,N.aKeep.array[j]=0,j++}for(let q of["position","aCor","aTam","aAlfa","aVar","aRot","aReg","aKeep"])N[q].needsUpdate=!0}if(jl.setDrawRange(0,j),Na.set(0,0,0),Da){let P=(u-Da.t0)/520;if(P>=1)Da=null;else{let N=.0045*at.position.distanceTo(Et.target)*Math.pow(1-P,2);Na.set(Math.sin(u*.09)*N,Math.sin(u*.13+1)*N,Math.sin(u*.07+2)*N)}}}let Ua=240,Fa=new Float32Array(Ua*3),Oa=new Float32Array(Ua*3),nu=new Float32Array(Ua),Gi=new Re;Gi.setAttribute("position",new Qt(Fa,3)),Gi.setAttribute("aCor",new Qt(Oa,3)),Gi.setAttribute("aForca",new Qt(nu,1));let tc=new bn(Gi,xe());tc.frustumCulled=!1,tc.renderOrder=7,tt.add(tc);let Or=[];function Tn(u){return Yt[u]>.5&&Nt[u]>0}function Ai(u,M){It[u]=Math.max(It[u],M)}let Dn=(u,M=new U)=>M.fromArray(Q,u*3);function ec(u,M,b,L,j){if(Xn.length>=(p.reduzidos?160:en)||!Tn(u)||!Tn(M))return;let P=Dn(u),N=Dn(M),q=Rt(P,N,new U),ht=p.movimentoReduzido?0:300+P.distanceTo(N)*700;Xn.push({a:P,b:N,c:q,t0:un,dur:ht,forca:b,cor:L,aoChegar:j})}let Sf=f(99);function iu(u){for(let M=u.length-1;M>0;M--){let b=Math.floor(Sf()*(M+1));[u[M],u[b]]=[u[b],u[M]]}return u}function nc(u,M,b,L,j=12){if(Ai(u,M),b<=0)return;iu(V[u].viz.filter(Tn)).slice(0,j).forEach((N,q)=>{setTimeout(()=>ec(u,N,M*.8,L,()=>{nc(N,M*.55,b-1,L,Math.max(3,Math.floor(j/2.5)))}),p.movimentoReduzido?0:q*30)})}let ke={ctx:null,marrom:null,branco:null,saida:null};function su(){if(!ke.ctx){let u=window.AudioContext||window.webkitAudioContext;if(!u)return!1;let M=ke.ctx=new u,b=M.sampleRate*4;ke.marrom=M.createBuffer(1,b,M.sampleRate),ke.branco=M.createBuffer(1,M.sampleRate,M.sampleRate);let L=ke.marrom.getChannelData(0),j=ke.branco.getChannelData(0),P=0;for(let q=0;q<b;q++)P=(P+.02*(Math.random()*2-1))/1.02,L[q]=P*3.5;for(let q=0;q<j.length;q++)j[q]=Math.random()*2-1;let N=M.createDynamicsCompressor();ke.saida=M.createGain(),ke.saida.gain.value=.55,ke.saida.connect(N).connect(M.destination)}return ke.ctx.resume(),!0}function Ba({estalo:u=0,ronco:M=.5,atraso:b=0,dur:L=2.6,grave:j=220}={}){if(!p.som||document.hidden||!ke.ctx&&!su())return;let P=ke.ctx,N=P.currentTime+b/1e3;if(u){let Lt=P.createBufferSource(),de=P.createBiquadFilter(),Ht=P.createGain();Lt.buffer=ke.branco,de.type="highpass",de.frequency.value=900,Ht.gain.setValueAtTime(1e-4,N),Ht.gain.exponentialRampToValueAtTime(u,N+.006),Ht.gain.exponentialRampToValueAtTime(1e-4,N+.32),Lt.connect(de).connect(Ht).connect(ke.saida),Lt.start(N,Math.random()*.5,.4)}let q=P.createBufferSource(),ht=P.createBiquadFilter(),lt=P.createGain();q.buffer=ke.marrom,q.playbackRate.value=.8+Math.random()*.4,ht.type="lowpass",ht.frequency.setValueAtTime(j*2.2,N),ht.frequency.exponentialRampToValueAtTime(j*.45,N+L);let dt=u?.06:.25;lt.gain.setValueAtTime(1e-4,N),lt.gain.exponentialRampToValueAtTime(M,N+dt),lt.gain.exponentialRampToValueAtTime(M*.4,N+L*.22),lt.gain.exponentialRampToValueAtTime(M*.75,N+L*.36),lt.gain.exponentialRampToValueAtTime(1e-4,N+L),q.connect(ht).connect(lt).connect(ke.saida),q.start(N,Math.random()*(4-L-.2),L+.1)}let xn=u=>c[V[u].k]||c.sistema,ic=u=>l[d[V[u].l]??7],ru=u=>{let M=ic(u).onde;return(M.startsWith("ponta")?"na ":"no ")+M},Hs=n("evento"),sc=0;function Br(u,M){Hs.innerHTML="";let b=document.createElement("i");b.style.background=M,Hs.append(b),u.split("**").forEach((L,j)=>{if(j%2){let P=document.createElement("b");P.textContent=L,Hs.append(P)}else Hs.append(L)}),Hs.style.opacity=1,clearTimeout(sc),sc=setTimeout(()=>{Hs.style.opacity=0},6e3)}let Ef=Math.max(0,V.findIndex(u=>u.id==="00_PAINEL")),Tf=15e3,au=new Map,Gs=[],zr=new Map(V.map(u=>[u.id,u.i]));function ou(u,M,b){if(J.length>=Kn)return-1;J.push([u,M]),V[u].viz.push(M),V[M].viz.push(u);let L=J.length-1;y(L),Dr(L,b),Us[L]=0;for(let j=0;j<qe*2;j++)Os[L*qe*2+j]=0;return Ut.tam.length<Tt&&Mt(L,b,1.4),L}function lu(){hc(),z.setDrawRange(0,J.length*qe*2),hn.setDrawRange(0,J.length),z.attributes.position.needsUpdate=!0,hn.attributes.position.needsUpdate=!0,hn.attributes.aFase.needsUpdate=!0,hn.attributes.aReg.needsUpdate=!0,we.setDrawRange(0,V.length),["position","aTam","aCor","aVis","aEspinho","aDim"].forEach(u=>{we.attributes[u].needsUpdate=!0}),ut.value=et(J.length),cu(),xu()}function cu(){let u=V.reduce((M,b)=>M+(b.removida?1:0),0);n("n-notas").textContent=vs(V.length-o-u),n("n-sinapses").textContent=vs(J.length-(t.arestas.length-t.sinapses))}let nn={abrir(u,M="abriu"){Tn(u)&&(nc(u,1,2,xn(u),12),H(Dn(u),xn(u),.35,.08,900),M&&Br(`${M==="clique"?e.textoClique||"Abriria numa aba nova":"Abriu"} **${V[u].t}** \xB7 ${m[V[u].k]} ${ru(u)}`,xn(u)))},salvar(u){if(!Tn(u))return;if(un-(au.get(u)??-1e9)<Tf){nc(u,.7,1,xn(u),6),H(Dn(u),xn(u),.3,.12,900),Br(`Salvou **${V[u].t}** de novo \xB7 pulso suave (raio no m\xE1ximo a cada 15 s)`,xn(u));return}au.set(u,un),Ai(u,1.5);let M=Dn(u),b=p.reduzidos?2:4,L=V[u].viz.filter(Tn).map(lt=>[lt,M.distanceTo(Dn(lt))]).sort((lt,dt)=>dt[1]-lt[1]),j=L.filter(([lt])=>V[lt].l!==V[u].l),P=L.filter(([lt])=>V[lt].l===V[u].l),N=j.slice(0,Math.ceil(b/2)),q=[...j.slice(N.length),...P].sort((lt,dt)=>dt[1]-lt[1]).slice(0,b-N.length),ht=[...N,...q].map(([lt])=>lt);H(M,xn(u),.55,.13,900,!0),Ba({estalo:.5,ronco:.6,atraso:p.movimentoReduzido?0:Ei,dur:2.4,grave:260}),ht.forEach((lt,dt)=>setTimeout(()=>{Kh(M,Dn(lt),xn(u),dt?.75:1,dt<3),setTimeout(()=>Ai(lt,.9),p.movimentoReduzido?0:Ei)},p.movimentoReduzido?0:dt*40)),Br(`Salvou **${V[u].t}** \xB7 raio para ${ht.length} ${ht.length===1?"nota ligada":"notas ligadas"}`,xn(u))},nova(u,M){if(V.length>=G)return-1;let b=V.length,L,j;if(typeof u=="number"){let lt=V[u];L={id:`${lt.id.split("/")[0]}/Nota nova ${b-F+1}`,t:`Nota nova ${b-F+1}`,l:lt.l,k:lt.k,s:lt.s,i:b,viz:[]},j=[u,...iu(lt.viz.slice()).slice(0,2)]}else L={...u,i:b,viz:[]},j=(M||[]).filter(lt=>lt>=0&&lt<b);V.push(L),zr.set(L.id,b);let P=K(L);Q.set([P.x,P.y,P.z],b*3),me(L),Nt[b]=0;let N=f(_(L.id)),q=[];for(let lt of j){let dt=ou(lt,b,N);dt>=0&&q.push(dt)}if(Ut.tam.length<Tt){let lt=new kt;Bt(Math.hypot(P.x,P.z),N,L.l,lt),pt(Ut,P,lt,.12,.08,N,d[L.l]??7)}lu();let ht=p.reduzidos?18:44;for(let lt=0;lt<ht&&Or.length<Ua;lt++){let dt=N()*Math.PI*2,Lt=.05+N()*.07;Or.push({alvo:P.clone(),ang:dt,r:Lt,y:A(N)*.02,t0:un+N()*200,dur:1300+N()*300,cor:Bt(Math.hypot(P.x,P.z),N,L.l,new kt)})}return Gs.push({i:b,t0:un,arestas:q}),Br(`Nasceu **${L.t}** ${ru(b)}, ligada a ${q.length} ${q.length===1?"nota":"notas"}`,xn(b)),b},ligar(u,M){if(u===M||u<0||M<0||V[u].viz.includes(M))return;let b=ou(u,M,f(_(V[u].id+">"+V[M].id)));b<0||(me(V[u]),me(V[M]),lu(),Gs.push({i:u,t0:un,arestas:[b],soArestas:!0}),ec(u,M,.8,xn(u),()=>Ai(M,.7)))},remover(u){u<0||V[u].removida||(V[u].removida=!0,zr.delete(V[u].id),p.selecionado===u&&Wi(-1),kr(),cu())},renomear(u,M,b){u<0||(zr.delete(V[u].id),V[u].id=M,V[u].t=b,zr.set(M,u))},captura(){Hi={t0:un,dur:p.movimentoReduzido?1:2400},zs.uniforms.uSem.value=Math.random()*100,Ai(Ef,1.6),Mf(),H(new U(0,0,0),"#fff1d6",.5,.24,1300),setTimeout(()=>H(new U(0,0,0),"#e0733a",.35,.5,1800),p.movimentoReduzido?0:260),!p.movimentoReduzido&&!p.reduzidos&&(Da={t0:un}),Ba({estalo:.35,ronco:.95,dur:3.8,grave:130}),Br("Captura nova no **01_ENTRADA** \xB7 tempestade a partir do n\xFAcleo","#cfe6ff")}},_s=n("rotulo"),sn={x:0,y:0,dentro:!1,moveu:!0,baixo:null},Ws=new U;function hu(u,M){let b=Ft.domElement.getBoundingClientRect(),L=-1,j=1/0;for(let P=0;P<V.length;P++){if(!Tn(P)||(Ws.fromArray(Q,P*3).project(at),Ws.z>1||Ws.z<-1))continue;let N=(Ws.x*.5+.5)*b.width+b.left,q=(-Ws.y*.5+.5)*b.height+b.top,ht=Math.hypot(N-u,q-M);if(ht<9+Pt[P]*1.5){let lt=Ws.z+ht*6e-4;lt<j&&(j=lt,L=P)}}return L}function uu(u,M,b){if(u<0){_s.classList.remove("visivel");return}let L=V[u];_s.querySelector("strong").textContent=L.t,_s.querySelector("span").textContent=`${ic(u).nome} \xB7 ${m[L.k]} \xB7 ${L.viz.length} ${L.viz.length===1?"sinapse":"sinapses"}`;let j=_s.offsetWidth,P=i.getBoundingClientRect();_s.style.left=`${Math.min(M-P.left,P.width-j-20)}px`,_s.style.top=`${b-P.top}px`,_s.classList.add("visivel")}Ft.domElement.addEventListener("pointermove",u=>{sn.x=u.clientX,sn.y=u.clientY,sn.dentro=!0,sn.moveu=!0}),Ft.domElement.addEventListener("pointerleave",()=>{sn.dentro=!1,p.sobre=-1,uu(-1)}),Ft.domElement.addEventListener("pointerdown",u=>{sn.baixo=[u.clientX,u.clientY],lc(),Nn=null}),Ft.domElement.addEventListener("pointerup",u=>{if(!sn.baixo)return;let M=Math.hypot(u.clientX-sn.baixo[0],u.clientY-sn.baixo[1]);if(sn.baixo=null,M>4)return;let b=hu(u.clientX,u.clientY);b>=0?(Wi(b,!0),nn.abrir(b,"clique"),e.aoAbrir?.(V[b].id)):Wi(-1)}),Ft.domElement.addEventListener("wheel",()=>{lc(),Nn=null},{passive:!0});function Wi(u,M){if(p.selecionado=u,u<0){W.setDrawRange(0,0),du();return}let b=V[u].viz.filter(Tn).slice(0,400),L=Dn(u),j=new U,P=new U,N=new U,q=0;for(let ht of b){Dn(ht,j),Rt(L,j,P);let lt=L.clone();for(let dt=1;dt<=qe;dt++)ie(L,P,j,dt/qe,N),vt[q++]=lt.x,vt[q++]=lt.y,vt[q++]=lt.z,vt[q++]=N.x,vt[q++]=N.y,vt[q++]=N.z,lt.copy(N)}W.attributes.position.needsUpdate=!0,W.setDrawRange(0,b.length*qe*2),wt.color.set(xn(u)),rc=.28*Math.min(1,4/Math.sqrt(Math.max(1,b.length))),wt.opacity=rc,za=M?-1:un,M&&oc(L,.32)}let rc=.28,za=-1,Nn=null,ac=()=>1.5*Math.max(1,1.3/(ye.clientWidth/ye.clientHeight));function oc(u,M,b=at.position.clone().sub(Et.target).normalize()){let L=u.clone().addScaledVector(b,M);Nn={t0:un,dur:p.movimentoReduzido?1:1700,alvo0:Et.target.clone(),alvo1:u.clone(),cam0:at.position.clone(),cam1:L,meio:at.position.clone().lerp(L,.5).add(new U(0,.08*at.position.distanceTo(L),0))}}function du(){Et.target.distanceTo(Xt)<.01&&Math.abs(at.position.distanceTo(Et.target)-ac())<.05||oc(Xt,ac(),Jt.clone().applyAxisAngle(new U(0,1,0),Math.atan2(at.position.x-Et.target.x,at.position.z-Et.target.z)))}let fu=0;function lc(){Et.autoRotate=!1,clearTimeout(fu),fu=setTimeout(()=>{du(),Et.autoRotate=!p.movimentoReduzido},25e3)}Et.autoRotate=!p.movimentoReduzido,r(x,"change",()=>{Et.autoRotate=!p.movimentoReduzido});let pu=u=>u.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase(),An=n("busca-campo"),xs=n("resultados"),qn=[],Xs=0;function cc(){let u=pu(An.value.trim());if(xs.innerHTML="",!u){xs.hidden=!0,An.setAttribute("aria-expanded","false");return}qn=[];for(let M=0;M<V.length;M++){if(!Tn(M))continue;let b=pu(V[M].t).indexOf(u);b>=0&&qn.push([b===0?0:1,-V[M].viz.length,M])}if(qn.sort((M,b)=>M[0]-b[0]||M[1]-b[1]),qn=qn.slice(0,8).map(M=>M[2]),Xs=0,!qn.length){let M=document.createElement("li");M.className="vazio",M.textContent="Nenhuma estrela com esse t\xEDtulo.",xs.append(M)}qn.forEach((M,b)=>{let L=document.createElement("li");L.setAttribute("role","option"),L.id=`r${b}`,L.setAttribute("aria-selected",b===0?"true":"false");let j=document.createElement("span");j.className="ponto",j.style.background=xn(M);let P=document.createElement("span");P.className="titulo",P.textContent=V[M].t;let N=document.createElement("span");N.className="lobo",N.textContent=ic(M).nome,L.append(j,P,N),L.addEventListener("mousedown",q=>{q.preventDefault(),mu(M)}),xs.append(L)}),xs.hidden=!1,An.setAttribute("aria-expanded","true")}function mu(u){An.value="",cc(),An.blur(),lc(),Wi(u,!0),nn.abrir(u,"clique"),e.aoAbrir?.(V[u].id)}An.addEventListener("input",cc),An.addEventListener("keydown",u=>{if(u.key==="ArrowDown"||u.key==="ArrowUp"){if(u.preventDefault(),!qn.length)return;Xs=(Xs+(u.key==="ArrowDown"?1:-1)+qn.length)%qn.length,[...xs.children].forEach((M,b)=>M.setAttribute("aria-selected",b===Xs?"true":"false")),An.setAttribute("aria-activedescendant",`r${Xs}`)}else u.key==="Enter"&&qn.length?mu(qn[Xs]):u.key==="Escape"&&(An.value="",cc(),An.blur())}),An.addEventListener("blur",()=>setTimeout(()=>{xs.hidden=!0},120)),r(e.alvoTeclado||window,"keydown",u=>{(u.ctrlKey||u.metaKey)&&u.key.toLowerCase()==="k"?(u.preventDefault(),An.focus(),An.select()):u.key==="Escape"&&document.activeElement!==An&&(Wi(-1),gu())});let Va=n("botao-filtros"),Vr=n("filtros");function gu(){Vr.hidden=!0,Va.setAttribute("aria-expanded","false")}Va.addEventListener("click",()=>{let u=Vr.hidden;Vr.hidden=!u,Va.setAttribute("aria-expanded",String(u))}),r(document,"pointerdown",u=>{!Vr.hidden&&!Vr.contains(u.target)&&!Va.contains(u.target)&&gu()});let _u=n("lobos");[{id:null,nome:"Todas"},...l].forEach(u=>{let M=document.createElement("button");M.textContent=u.nome,M.title=u.onde?`${u.nome}: ${u.onde}`:"Todas as regi\xF5es",M.setAttribute("aria-pressed",u.id===null?"true":"false"),M.addEventListener("click",()=>{p.regiao=u.id,[..._u.children].forEach(b=>b.setAttribute("aria-pressed",b===M?"true":"false")),kr()}),_u.append(M)});function kr(){for(let u=0;u<V.length;u++){let M=V[u],b=1;M.removida||p.esconderArquivo&&M.l==="tronco"?b=0:p.regiao&&M.l!==p.regiao&&(b=.14),Yt[u]=b}for(let u=0;u<J.length;u++){if(Gs.some(P=>P.arestas.includes(u)))continue;let[M,b]=J[u],L=Math.min(Yt[M],Yt[b]),j=(L>=1?1:L>0?.08:0)*Aa[u];for(let P=0;P<qe*2;P++)Os[u*qe*2+P]=j}nt.value=p.regiao?d[p.regiao]:-1,st.value=p.esconderArquivo?1:0,we.attributes.aVis.needsUpdate=!0,z.attributes.aAlfa.needsUpdate=!0}function hc(){let u=Me,M=Ut.tam.length;["position","aCor","aTam","aAlfa","aVar","aRot","aReg","aKeep"].forEach(b=>{let L={position:Ut.pos,aCor:Ut.cor,aTam:Ut.tam,aAlfa:Ut.alfa,aVar:Ut.var,aRot:Ut.rot,aReg:Ut.reg,aKeep:Ut.keep}[b];u.attributes[b].array.set(L),u.attributes[b].needsUpdate=!0}),u.setDrawRange(0,M),bt.value=p.reduzidos||p.qualidadeAjustada?.6:1}function xu(){n("poeira").innerHTML="";let u=n("poeira"),M=document.createElement("b");M.textContent=`${Math.round(ut.value*100)}%`,u.append("Poeira estelar ",M,` \xB7 cresce com as sinapses (${vs(J.length-(t.arestas.length-t.sinapses))})`)}n("f-arquivo").addEventListener("change",u=>{p.esconderArquivo=u.target.checked,kr(),e.aoMudarConfig?.(S())}),n("f-fundo").addEventListener("change",u=>{p.fundo=u.target.checked,e.aoMudarConfig?.(S())}),n("f-reduzidos").addEventListener("change",u=>{p.reduzidos=u.target.checked,hc(),Ha(!1),e.aoMudarConfig?.(S())}),n("f-som").addEventListener("change",u=>{p.som=u.target.checked&&su(),u.target.checked=p.som,p.som&&Ba({ronco:.3,dur:2.2,grave:180}),e.aoMudarConfig?.(S())}),n("f-arquivo").checked=p.esconderArquivo,n("f-fundo").checked=p.fundo,n("f-reduzidos").checked=p.reduzidos,n("f-som").checked=p.som;let qs=f(2024),uc=V.filter(u=>u.l==="parietal"&&u.viz.length>20).map(u=>u.i),wi=uc[0]??0;function vu(){let u=V[wi].viz.filter(Tn);return!u.length||qs()<.18?wi=uc[Math.floor(qs()*uc.length)]??wi:wi=u[Math.floor(qs()*u.length)],wi}i.querySelectorAll("#simular [data-evento]").forEach(u=>u.addEventListener("click",()=>{let M=u.dataset.evento;if(M==="abrir"){let b=vu();Wi(b,!1),nn.abrir(b)}else M==="salvar"?nn.salvar(p.selecionado>=0?p.selecionado:wi):M==="nova"?nn.nova(p.selecionado>=0?p.selecionado:wi):nn.captura()}));let dc=n("demo");dc&&dc.addEventListener("click",()=>{p.demo=!p.demo,dc.setAttribute("aria-pressed",String(p.demo))});let Ys=1800;function Af(u){if(!p.demo||(Ys-=u,Ys>0))return;let M=qs();if(M<.55){let b=vu();Wi(b,!1),nn.abrir(b),Ys=3200+qs()*3500}else M<.82?(nn.salvar(wi),Ys=2800+qs()*2600):M<.91?(nn.captura(),Ys=4600):(nn.nova(wi),Ys=4600)}let vs=u=>u.toLocaleString("pt-BR");n("n-notas").textContent=vs(t.notas),n("n-sinapses").textContent=vs(t.sinapses);let un=performance.now(),fc=un,pc=600,mc=9e3,Zs=!0,Hr=0,$s=[],wf=n("desempenho"),ka=0;kr(),xu();function Ha(u=!0){let M=ye.clientWidth,b=ye.clientHeight,L=Math.min(devicePixelRatio||1,p.reduzidos||p.qualidadeAjustada?1:1.5);Ft.setPixelRatio(L),Ft.setSize(M,b,!1),at.aspect=M/b,u&&!Nn&&at.position.sub(Et.target).setLength(ac()).add(Et.target),at.updateProjectionMatrix(),gt.value=b*L/2/Math.tan(xi.degToRad(mt/2)),Ct.value=b*L*.0016,zi.value=L,yt.value=gt.value*ds,Ot.value=Math.max(24,.12*b*L*ds),fs.setSize(Math.max(1,Math.round(M*L*ds)),Math.max(1,Math.round(b*L*ds))),xt.value=xi.clamp(Math.min(M,b)/800,.35,1),Ur.value.set(M*L/2,b*L/2),ze.value=gt.value,Ve.value=.2*b*L,tt.getObjectByName("ceu").material.uniforms.uDpr.value=L,Te.material.uniforms.uAspecto.value=M/b}let yu=new ResizeObserver(()=>Ha());yu.observe(ye),Ha();let Mu=!0,bu=!1;function gc(){let u=Zs;Zs=!bu&&Mu&&!document.hidden,ke.ctx&&(Zs&&p.som?ke.ctx.resume():ke.ctx.suspend()),Zs!==u&&(cancelAnimationFrame(Hr),Zs&&(fc=performance.now(),Hr=requestAnimationFrame(xc)))}r(document,"visibilitychange",gc);let _c=u=>1-Math.pow(1-u,3),Su=u=>u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;function xc(u){if(!Zs)return;un=u;let M=Math.min(64,u-fc);if(fc=u,$s.push(M),$s.length>90&&$s.shift(),Nr.value=u/1e3,p.fundo){if(pc-=M,pc<=0){let P=Math.floor(Math.random()*V.length);if(Tn(P)&&(Ai(P,.22+Math.random()*.12),Math.random()<.15&&!p.reduzidos)){let N=V[P].viz[Math.floor(Math.random()*V[P].viz.length)];N!==void 0&&ec(P,N,.35,xn(P),()=>Ai(N,.18))}pc=(p.reduzidos?900:280)+Math.random()*520}if(mc-=M,mc<=0&&!p.movimentoReduzido){let P=Math.floor(Math.random()*F);Tn(P)&&(H(Dn(P),Math.random()<.5?"#f0b44c":"#3cc3d0",.32,.12,900,!0),Ba({ronco:.16,atraso:700+Math.random()*1200,dur:3,grave:150})),mc=9e3+Math.random()*9e3}}Af(M);for(let P=0;P<be;P++){let N=B[P],q=(u-N.t0)/N.dur,ht=q<0||q>=1?0:N.forca*(N.piscar?gf(q):Math.pow(1-q,2));Qe.value[P].set(N.pos.x,N.pos.y,N.pos.z,ht),fe.value[P].set(N.cor.r,N.cor.g,N.cor.b),T.value[P]=N.raio*N.raio}if(Hi){let P=Math.min(1,(u-Hi.t0)/Hi.dur),N=.05+_c(P)*1.05;ki.visible=!0,ki.scale.setScalar(N),zs.uniforms.uP.value=P,Hi.raios||(Hi.raios=[.3,.55,.8].map(q=>({x:q,feito:!1})));for(let q of Hi.raios)if(!q.feito&&N>q.x){q.feito=!0;for(let ht=0;ht<(p.reduzidos?1:2);ht++){let lt=V.filter(Lt=>Tn(Lt.i)&&Math.abs(Math.hypot(Q[Lt.i*3],Q[Lt.i*3+2])-q.x)<.04),dt=lt[Math.floor(Math.random()*lt.length)];dt&&dt.viz.length&&Kh(Dn(dt.i),Dn(dt.viz[Math.floor(Math.random()*dt.viz.length)]),"#cfe6ff",.8,!1)}}for(let q=0;q<V.length;q++){if(!Tn(q))continue;let ht=Math.hypot(Q[q*3],Q[q*3+2]);Math.abs(ht-N)<.02&&Ai(q,.4)}P>=1&&(Hi=null,ki.visible=!1)}let b=Math.exp(-M/850);for(let P=0;P<V.length;P++)It[P]=It[P]>.001?It[P]*b:0;we.attributes.aAtiv.needsUpdate=!0;let L=0;for(let P=Or.length-1;P>=0;P--){let N=Or[P],q=(u-N.t0)/N.dur;if(q>=1){Or.splice(P,1);continue}if(q<0)continue;let ht=Su(q),lt=N.ang+ht*5.5,dt=N.r*(1-ht);Fa[L*3]=N.alvo.x+Math.cos(lt)*dt,Fa[L*3+1]=N.alvo.y+N.y*(1-ht),Fa[L*3+2]=N.alvo.z+Math.sin(lt)*dt,Oa[L*3]=N.cor.r,Oa[L*3+1]=N.cor.g,Oa[L*3+2]=N.cor.b,nu[L]=.25+ht*.6,L++}Gi.setDrawRange(0,L),Gi.attributes.position.needsUpdate=!0,Gi.attributes.aCor.needsUpdate=!0,Gi.attributes.aForca.needsUpdate=!0;for(let P=Gs.length-1;P>=0;P--){let N=Gs[P],q=Math.min(1,(u-N.t0)/(p.movimentoReduzido?1:2400)),ht=Math.max(0,(q-.58)/.42);N.soArestas||(Nt[N.i]=ht>0?Math.max(.001,_c(ht)):0,ht>0&&!N.clarao&&(N.clarao=!0,H(Dn(N.i),xn(N.i),1.1,.1,900),Ai(N.i,1.3)));let lt=Math.max(0,(q-.7)/.3);for(let dt of N.arestas){for(let Lt=0;Lt<qe*2;Lt++)Os[dt*qe*2+Lt]=lt*2;Us[dt]=lt}z.attributes.aAlfa.needsUpdate=!0,hn.attributes.aNasc.needsUpdate=!0,q>=1&&(Gs.splice(P,1),kr())}we.attributes.aNasc.needsUpdate=!0;let j=0;for(let P=Xn.length-1;P>=0;P--){let N=Xn[P],q=N.dur?(u-N.t0)/N.dur:1;if(q>=1){Xn.splice(P,1),N.aoChegar&&N.aoChegar();continue}j>=en||(ie(N.a,N.c,N.b,q,ft),_n[j*3]=ft.x,_n[j*3+1]=ft.y,_n[j*3+2]=ft.z,_e.set(N.cor),Ln[j*3]=_e.r,Ln[j*3+1]=_e.g,Ln[j*3+2]=_e.b,bi[j]=N.forca*(q<.15?q/.15:1),j++)}if(le.setDrawRange(0,j),le.attributes.position.needsUpdate=!0,le.attributes.aCor.needsUpdate=!0,le.attributes.aForca.needsUpdate=!0,vf(u),bf(u),za>=0){let P=(u-za)/3e3;wt.opacity=rc*Math.max(0,1-P),P>=1&&(za=-1,W.setDrawRange(0,0))}if(Nn){let P=Math.min(1,(u-Nn.t0)/Nn.dur),N=Su(P);Et.target.lerpVectors(Nn.alvo0,Nn.alvo1,N),ie(Nn.cam0,Nn.meio,Nn.cam1,N,at.position),at.fov=mt+(p.movimentoReduzido?0:9*Math.sin(Math.PI*N)),at.updateProjectionMatrix(),P>=1&&(Nn=null,at.fov=mt,at.updateProjectionMatrix())}if(sn.dentro&&sn.moveu&&!sn.baixo){sn.moveu=!1;let P=hu(sn.x,sn.y);P!==p.sobre&&(p.sobre=P,Ft.domElement.classList.toggle("sobre-no",P>=0)),uu(P,sn.x,sn.y)}if(Et.update(),Ft.setRenderTarget(fs),Ft.setClearColor(0,1),Ft.clear(!0,!1,!1),at.position.add(Na),ae.position.copy(at.position),Ft.render(Ir,at),Ft.setRenderTarget(null),Ft.setClearColor(461590,1),Ft.render(tt,at),at.position.sub(Na),$s.length>=30&&Math.round(u/500)!==Math.round((u-M)/500)){let N=1e3/($s.reduce((q,ht)=>q+ht,0)/$s.length);window.__fps=N,N<28&&!p.qualidadeAjustada?(ka=ka||u,u-ka>3e3&&(p.qualidadeAjustada=!0,hc(),Ha(!1))):ka=0,wf.textContent=`Desempenho: ${Math.round(N)} fps \xB7 ${vs(V.length)} estrelas${o?` (${vs(o)} sint\xE9ticas, carga de teste)`:""}${p.qualidadeAjustada?" \xB7 qualidade ajustada":""}`}Hr=requestAnimationFrame(xc)}Hr=requestAnimationFrame(xc);let hi=u=>zr.get(u)??-1;return{eventos:nn,nos:V,selecionar:Wi,estado:p,camera:at,controls:Et,voarPara:oc,indice:hi,abrir(u){let M=hi(u);M>=0&&nn.abrir(M)},salvar(u){let M=hi(u);M>=0&&nn.salvar(M)},captura(){nn.captura()},nova(u,M){return hi(u.id)>=0?hi(u.id):nn.nova(u,M.map(hi))},ligar(u,M){nn.ligar(hi(u),hi(M))},remover(u){nn.remover(hi(u))},renomear(u,M,b){nn.renomear(hi(u),M,b)},definirVisivel(u){Mu=u,gc()},definirConfig(u){let M={esconderArquivo:"f-arquivo",fundo:"f-fundo",reduzidos:"f-reduzidos",som:"f-som"};for(let b in M){let L=n(M[b]);typeof u[b]=="boolean"&&L.checked!==u[b]&&(L.checked=u[b],L.dispatchEvent(new Event("change")))}},destruir(){bu=!0,gc(),cancelAnimationFrame(Hr),s.forEach(u=>u()),yu.disconnect(),clearTimeout(sc),ke.ctx&&ke.ctx.close(),Ft.dispose(),Ft.forceContextLoss(),i.innerHTML="",i.classList.remove("cg-raiz","com-simulacao")}}}var Ta="cerebro-galactico",ff="orbit",Yl={som:!1,reduzidos:!1,fundo:!0,esconderArquivo:!1,novaAba:!0,notaCaptura:"01_ENTRADA.md"},Ix={"60_CONHECIMENTO":["frontal","conhecimento"],"10_PROJETOS":["parietal","projeto"],"20_REGRAS":["temporal","regra"],"50_METODOS":["temporal","metodo"],"30_INCIDENTES":["occipital","incidente"],"40_DECISOES":["motor","decisao"],"70_FONTES":["cerebelo","fonte"],"80_PESQUISA":["cerebelo","pesquisa"],"99_ARQUIVO":["tronco","arquivo"],"90_SISTEMA":["talamo","sistema"]},kn=i=>i.replace(/\.md$/i,""),Rr=i=>i instanceof Hn.TFile&&i.extension==="md";function df(i){let t=kn(i),e=t.split("/"),n=e.length>1?e[0]:"",[s,r]=Ix[n]??["talamo","sistema"],a="";return n==="60_CONHECIMENTO"&&e.length>2?(a=e[1],a==="VIDEO"&&e.length>3&&(a=`VIDEO/${e[2]}`)):n==="10_PROJETOS"&&e.length>2&&(a=e[1]),{id:t,t:e[e.length-1],l:s,k:r,s:a}}var Zl=class extends Hn.Plugin{constructor(){super(...arguments);this.config={...Yl}}async onload(){this.config={...Yl,...await this.loadData()},this.registerView(Ta,e=>new $l(e,this)),this.addRibbonIcon(ff,"Abrir C\xE9rebro Gal\xE1ctico",()=>this.abrirVisao()),this.addCommand({id:"abrir",name:"Abrir C\xE9rebro Gal\xE1ctico",callback:()=>this.abrirVisao()}),this.addSettingTab(new Yh(this.app,this)),this.app.workspace.onLayoutReady(()=>this.ouvirCofre())}visao(){let e=this.app.workspace.getLeavesOfType(Ta)[0];return e?.view instanceof $l?e.view:null}async abrirVisao(){let{workspace:e}=this.app,n=e.getLeavesOfType(Ta)[0];n||(n=e.getLeaf("tab"),await n.setViewState({type:Ta,active:!0})),await e.revealLeaf(n)}async salvarConfig(e){Object.assign(this.config,e),await this.saveData(this.config)}ouvirCofre(){let{workspace:e,vault:n,metadataCache:s}=this.app;this.registerEvent(e.on("file-open",r=>{Rr(r)&&this.visao()?.aoAbrirArquivo(r)})),this.registerEvent(n.on("modify",r=>{Rr(r)&&this.visao()?.aoModificar(r)})),this.registerEvent(n.on("create",r=>{Rr(r)&&this.visao()?.aoCriar(r)})),this.registerEvent(n.on("delete",r=>{Rr(r)&&this.visao()?.aoApagar(r)})),this.registerEvent(n.on("rename",(r,a)=>{Rr(r)&&this.visao()?.aoRenomear(r,a)})),this.registerEvent(s.on("resolve",r=>{Rr(r)&&this.visao()?.aoResolver(r)}))}},$l=class extends Hn.ItemView{constructor(e,n){super(e);this.plugin=n;this.galaxia=null;this.raiz=null;this.links=new Map;this.pendentes=new Map;this.ultimoClique={caminho:"",quando:0};this.reconstruir=0;this.scope=new Hn.Scope(this.app.scope),this.scope.register(["Mod"],"k",()=>{let s=this.contentEl.querySelector("#busca-campo");return s?.focus(),s?.select(),!1})}getViewType(){return Ta}getDisplayText(){return"C\xE9rebro Gal\xE1ctico"}getIcon(){return ff}async onOpen(){this.contentEl.addClass("cg-visao"),this.contentEl.tabIndex=-1,this.registerDomEvent(this.contentEl,"pointerdown",n=>{n.target instanceof HTMLInputElement||n.target instanceof HTMLButtonElement||this.contentEl.focus({preventScroll:!0})});let e=()=>this.galaxia?.definirVisivel(this.contentEl.isShown());if(this.registerEvent(this.app.workspace.on("layout-change",e)),this.registerEvent(this.app.workspace.on("active-leaf-change",e)),this.registerEvent(this.app.workspace.on("resize",e)),Object.keys(this.app.metadataCache.resolvedLinks).length===0&&this.app.vault.getMarkdownFiles().length>0){this.registerEvent(this.app.metadataCache.on("resolved",()=>{this.galaxia||this.montar()})),this.contentEl.setText("Lendo o cofre\u2026");return}this.montar()}async onClose(){window.clearTimeout(this.reconstruir),this.pendentes.forEach(e=>window.clearTimeout(e)),this.desmontar()}remontar(){this.galaxia&&this.montar()}montar(){this.desmontar(),this.contentEl.empty(),this.raiz=this.contentEl.createDiv();let e=this.plugin.config;this.galaxia=uf(this.raiz,this.lerGrafo(),{config:{som:e.som,reduzidos:e.reduzidos,fundo:e.fundo,esconderArquivo:e.esconderArquivo},textoClique:e.novaAba?"Abriu numa aba nova":"Abriu",aoAbrir:n=>this.abrirNota(n),aoMudarConfig:n=>{this.plugin.salvarConfig(n)},alvoTeclado:this.contentEl}),this.galaxia?.definirVisivel(this.contentEl.isShown())}desmontar(){this.galaxia?.destruir(),this.galaxia=null,this.raiz?.remove(),this.raiz=null}remontarDepois(){window.clearTimeout(this.reconstruir),this.reconstruir=window.setTimeout(()=>this.montar(),1200)}lerGrafo(){let e=this.app.vault.getMarkdownFiles().sort((c,l)=>c.path<l.path?-1:c.path>l.path?1:0),n=new Map(e.map((c,l)=>[c.path,l])),s=e.map(c=>df(c.path)),r=new Set,a=[];this.links.clear();let o=this.app.metadataCache.resolvedLinks;for(let c in o){let l=n.get(c);if(l===void 0)continue;let d=new Set;for(let m in o[c]){let h=n.get(m);if(h===void 0||h===l)continue;d.add(m);let x=Math.min(l,h),p=Math.max(l,h),S=`${x}:${p}`;r.has(S)||(r.add(S),a.push([x,p]))}this.links.set(c,d)}return{fonte:this.app.vault.getName(),notas:s.length,sinapses:a.length,nos:s,arestas:a}}async abrirNota(e){let n=this.app.vault.getFileByPath(`${e}.md`);if(!n)return;this.ultimoClique={caminho:n.path,quando:Date.now()};let{workspace:s}=this.app;await(this.plugin.config.novaAba?s.getLeaf("tab"):s.getLeavesOfType("markdown")[0]??s.getLeaf("tab")).openFile(n)}aoAbrirArquivo(e){e.path===this.ultimoClique.caminho&&Date.now()-this.ultimoClique.quando<1500||this.galaxia?.abrir(kn(e.path))}aoModificar(e){this.galaxia&&(e.path===this.plugin.config.notaCaptura?this.galaxia.captura():this.galaxia.salvar(kn(e.path)))}aoCriar(e){this.galaxia&&this.pendentes.set(e.path,window.setTimeout(()=>this.nascer(e.path),2e3))}aoResolver(e){if(!this.galaxia)return;if(this.pendentes.has(e.path)){this.nascer(e.path);return}let n=this.galaxia;if(n.indice(kn(e.path))<0)return;let s=Object.keys(this.app.metadataCache.resolvedLinks[e.path]??{}),r=this.links.get(e.path)??new Set;for(let a of s)r.has(a)||a===e.path||!a.endsWith(".md")||n.indice(kn(a))<0||(n.ligar(kn(e.path),kn(a)),r.add(a));this.links.set(e.path,r)}nascer(e){let n=this.pendentes.get(e);if(n===void 0||!this.galaxia)return;window.clearTimeout(n),this.pendentes.delete(e);let s=this.galaxia,r=this.app.metadataCache.resolvedLinks,a=Object.keys(r[e]??{}).filter(l=>l!==e&&s.indice(kn(l))>=0),o=Object.keys(r).filter(l=>l!==e&&r[l][e]&&s.indice(kn(l))>=0),c=[...new Set([...a,...o])];if(s.nova(df(e),c.map(kn))<0){this.remontarDepois();return}this.links.set(e,new Set(a));for(let l of o)(this.links.get(l)??this.links.set(l,new Set).get(l)).add(e)}aoApagar(e){let n=this.pendentes.get(e.path);n!==void 0&&(window.clearTimeout(n),this.pendentes.delete(e.path)),this.links.delete(e.path),this.galaxia?.remover(kn(e.path))}aoRenomear(e,n){let s=this.links.get(n);s&&(this.links.delete(n),this.links.set(e.path,s));for(let r of this.links.values())r.delete(n)&&r.add(e.path);this.galaxia?.renomear(kn(n),kn(e.path),e.basename)}aplicarConfig(){let e=this.plugin.config;this.galaxia?.definirConfig({som:e.som,reduzidos:e.reduzidos,fundo:e.fundo,esconderArquivo:e.esconderArquivo})}},Yh=class extends Hn.PluginSettingTab{constructor(e,n){super(e,n);this.plugin=n}display(){let{containerEl:e}=this;e.empty();let n=(s,r,a)=>new Hn.Setting(e).setName(s).setDesc(r).addToggle(o=>o.setValue(this.plugin.config[a]).onChange(async c=>{await this.plugin.salvarConfig({[a]:c}),a==="novaAba"?this.plugin.visao()?.remontar():this.plugin.visao()?.aplicarConfig()}));n("Som de trov\xE3o","Cada raio e cada captura t\xEAm trov\xE3o sintetizado. Desligado por padr\xE3o.","som"),n("Efeitos reduzidos","Menos poeira e menos raios por evento. Ajuda em GPU integrada fraca.","reduzidos"),n("Atividade de fundo","Pulsos suaves de neur\xF4nios quando nada acontece no cofre.","fundo"),n("Esconder 99_ARQUIVO","Tira o halo do arquivo morto da gal\xE1xia.","esconderArquivo"),n("Abrir em aba nova","Clique numa estrela abre a nota numa aba nova. Desligado, reaproveita a \xFAltima aba de nota.","novaAba"),new Hn.Setting(e).setName("Nota de captura").setDesc("Salvar esta nota dispara a tempestade a partir do n\xFAcleo. Caminho a partir da raiz do cofre.").addText(s=>s.setPlaceholder(Yl.notaCaptura).setValue(this.plugin.config.notaCaptura).onChange(async r=>{await this.plugin.salvarConfig({notaCaptura:r.trim()||Yl.notaCaptura})}))}};
