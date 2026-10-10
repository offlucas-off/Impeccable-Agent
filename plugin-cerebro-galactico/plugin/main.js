/* Cérebro Galáctico — gerado por scripts/montar-plugin.mjs a partir de plugin/src e motor/. Não edite à mão. */
"use strict";var Sc=Object.defineProperty;var Of=Object.getOwnPropertyDescriptor;var Bf=Object.getOwnPropertyNames;var zf=Object.prototype.hasOwnProperty;var Vf=(i,t)=>{for(var e in t)Sc(i,e,{get:t[e],enumerable:!0})},kf=(i,t,e,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of Bf(t))!zf.call(i,s)&&s!==e&&Sc(i,s,{get:()=>t[s],enumerable:!(n=Of(t,s))||n.enumerable});return i};var Hf=i=>kf(Sc({},"__esModule",{value:!0}),i);var Xx={};Vf(Xx,{default:()=>Jl});module.exports=Hf(Xx);var Ye=require("obsidian");var os={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},ls={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},id=0,eh=1,sd=2;var pa=1,rd=2,Sr=3,Ui=0,cn=1,Gn=2,xi=0,ws=1,Is=2,nh=3,ih=4,In=5;var Qi=100,ad=101,od=102,ld=103,cd=104,Er=200,we=201,hd=202,ud=203,dr=204,fr=205,dd=206,fd=207,pd=208,md=209,gd=210,_d=211,xd=212,vd=213,yd=214,_o=0,xo=1,vo=2,Cs=3,yo=4,Mo=5,bo=6,So=7,sh=0,Md=1,bd=2,si=0,rh=1,ah=2,oh=3,lh=4,ch=5,hh=6,uh=7;var dh=300,cs=301,Ds=302,jo=303,Qo=304,ma=306,Eo=1e3,mi=1001,To=1002,an=1003,Sd=1004;var ga=1005;var Ne=1006,tl=1007;var ri=1008;var Sn=1009,fh=1010,ph=1011,Tr=1012,el=1013,ai=1014,oi=1015,Zn=1016,nl=1017,il=1018,Ar=1020,mh=35902,gh=35899,_h=1021,xh=1022,$n=1023,gi=1026,hs=1027,vh=1028,sl=1029,us=1030,rl=1031;var al=1033,_a=33776,xa=33777,va=33778,ya=33779,ol=35840,ll=35841,cl=35842,hl=35843,ul=36196,dl=37492,fl=37496,pl=37488,ml=37489,Ma=37490,gl=37491,_l=37808,xl=37809,vl=37810,yl=37811,Ml=37812,bl=37813,Sl=37814,El=37815,Tl=37816,Al=37817,wl=37818,Cl=37819,Rl=37820,Pl=37821,Il=36492,Dl=36494,Ll=36495,Nl=36283,Ul=36284,ba=36285,Fl=36286;var Kr=2300,Ao=2301,go=2302,qc=2303,Yc=2400,Zc=2401,$c=2402;var Ed=3200;var yh=0,Td=1,Bi="",Vn="srgb",jr="srgb-linear",Qr="linear",ve="srgb";var Ts=7680;var Jc=519,Ad=512,wd=513,Cd=514,Ol=515,Rd=516,Pd=517,Bl=518,Id=519,Kc=35044;var Mh="300 es",ni=2e3,ta=2001;function Gf(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Wf(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function ea(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Dd(){let i=ea("canvas");return i.style.display="block",i}var Du={},pr=null;function bh(...i){let t="THREE."+i.shift();pr?pr("log",t,...i):console.log(t,...i)}function Ld(i){let t=i[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=i[1];e&&e.isStackTrace?i[0]+=" "+e.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Ht(...i){i=Ld(i);let t="THREE."+i.shift();if(pr)pr("warn",t,...i);else{let e=i[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...i)}}function Xt(...i){i=Ld(i);let t="THREE."+i.shift();if(pr)pr("error",t,...i);else{let e=i[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...i)}}function As(...i){let t=i.join(" ");t in Du||(Du[t]=!0,Ht(...i))}function Nd(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var Ud={[_o]:xo,[vo]:bo,[yo]:So,[Cs]:Mo,[xo]:_o,[bo]:vo,[So]:yo,[Mo]:Cs},ii=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let s=n[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}},fn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Lu=1234567,$r=Math.PI/180,mr=180/Math.PI;function wr(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(fn[i&255]+fn[i>>8&255]+fn[i>>16&255]+fn[i>>24&255]+"-"+fn[t&255]+fn[t>>8&255]+"-"+fn[t>>16&15|64]+fn[t>>24&255]+"-"+fn[e&63|128]+fn[e>>8&255]+"-"+fn[e>>16&255]+fn[e>>24&255]+fn[n&255]+fn[n>>8&255]+fn[n>>16&255]+fn[n>>24&255]).toLowerCase()}function oe(i,t,e){return Math.max(t,Math.min(e,i))}function Sh(i,t){return(i%t+t)%t}function Xf(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function qf(i,t,e){return i!==t?(e-i)/(t-i):0}function Jr(i,t,e){return(1-e)*i+e*t}function Yf(i,t,e,n){return Jr(i,t,1-Math.exp(-e*n))}function Zf(i,t=1){return t-Math.abs(Sh(i,t*2)-t)}function $f(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Jf(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Kf(i,t){return i+Math.floor(Math.random()*(t-i+1))}function jf(i,t){return i+Math.random()*(t-i)}function Qf(i){return i*(.5-Math.random())}function tp(i){i!==void 0&&(Lu=i);let t=Lu+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function ep(i){return i*$r}function np(i){return i*mr}function ip(i){return(i&i-1)===0&&i!==0}function sp(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function rp(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function ap(i,t,e,n,s){let r=Math.cos,a=Math.sin,o=r(e/2),c=a(e/2),l=r((t+n)/2),d=a((t+n)/2),m=r((t-n)/2),h=a((t-n)/2),_=r((n-t)/2),p=a((n-t)/2);switch(s){case"XYX":i.set(o*d,c*m,c*h,o*l);break;case"YZY":i.set(c*h,o*d,c*m,o*l);break;case"ZXZ":i.set(c*m,c*h,o*d,o*l);break;case"XZX":i.set(o*d,c*p,c*_,o*l);break;case"YXY":i.set(c*_,o*d,c*p,o*l);break;case"ZYZ":i.set(c*p,c*_,o*d,o*l);break;default:Ht("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function hr(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function yn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var vi={DEG2RAD:$r,RAD2DEG:mr,generateUUID:wr,clamp:oe,euclideanModulo:Sh,mapLinear:Xf,inverseLerp:qf,lerp:Jr,damp:Yf,pingpong:Zf,smoothstep:$f,smootherstep:Jf,randInt:Kf,randFloat:jf,randFloatSpread:Qf,seededRandom:tp,degToRad:ep,radToDeg:np,isPowerOfTwo:ip,ceilPowerOfTwo:sp,floorPowerOfTwo:rp,setQuaternionFromProperEuler:ap,normalize:yn,denormalize:hr},Ch=class Ch{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=oe(this.x,t.x,e.x),this.y=oe(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=oe(this.x,t,e),this.y=oe(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(oe(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(oe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Ch.prototype.isVector2=!0;var $t=Ch,kn=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let c=n[s+0],l=n[s+1],d=n[s+2],m=n[s+3],h=r[a+0],_=r[a+1],p=r[a+2],S=r[a+3];if(m!==S||c!==h||l!==_||d!==p){let x=c*h+l*_+d*p+m*S;x<0&&(h=-h,_=-_,p=-p,S=-S,x=-x);let f=1-o;if(x<.9995){let A=Math.acos(x),I=Math.sin(A);f=Math.sin(f*A)/I,o=Math.sin(o*A)/I,c=c*f+h*o,l=l*f+_*o,d=d*f+p*o,m=m*f+S*o}else{c=c*f+h*o,l=l*f+_*o,d=d*f+p*o,m=m*f+S*o;let A=1/Math.sqrt(c*c+l*l+d*d+m*m);c*=A,l*=A,d*=A,m*=A}}t[e]=c,t[e+1]=l,t[e+2]=d,t[e+3]=m}static multiplyQuaternionsFlat(t,e,n,s,r,a){let o=n[s],c=n[s+1],l=n[s+2],d=n[s+3],m=r[a],h=r[a+1],_=r[a+2],p=r[a+3];return t[e]=o*p+d*m+c*_-l*h,t[e+1]=c*p+d*h+l*m-o*_,t[e+2]=l*p+d*_+o*h-c*m,t[e+3]=d*p-o*m-c*h-l*_,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(n/2),d=o(s/2),m=o(r/2),h=c(n/2),_=c(s/2),p=c(r/2);switch(a){case"XYZ":this._x=h*d*m+l*_*p,this._y=l*_*m-h*d*p,this._z=l*d*p+h*_*m,this._w=l*d*m-h*_*p;break;case"YXZ":this._x=h*d*m+l*_*p,this._y=l*_*m-h*d*p,this._z=l*d*p-h*_*m,this._w=l*d*m+h*_*p;break;case"ZXY":this._x=h*d*m-l*_*p,this._y=l*_*m+h*d*p,this._z=l*d*p+h*_*m,this._w=l*d*m-h*_*p;break;case"ZYX":this._x=h*d*m-l*_*p,this._y=l*_*m+h*d*p,this._z=l*d*p-h*_*m,this._w=l*d*m+h*_*p;break;case"YZX":this._x=h*d*m+l*_*p,this._y=l*_*m+h*d*p,this._z=l*d*p-h*_*m,this._w=l*d*m-h*_*p;break;case"XZY":this._x=h*d*m-l*_*p,this._y=l*_*m-h*d*p,this._z=l*d*p+h*_*m,this._w=l*d*m+h*_*p;break;default:Ht("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],c=e[9],l=e[2],d=e[6],m=e[10],h=n+o+m;if(h>0){let _=.5/Math.sqrt(h+1);this._w=.25/_,this._x=(d-c)*_,this._y=(r-l)*_,this._z=(a-s)*_}else if(n>o&&n>m){let _=2*Math.sqrt(1+n-o-m);this._w=(d-c)/_,this._x=.25*_,this._y=(s+a)/_,this._z=(r+l)/_}else if(o>m){let _=2*Math.sqrt(1+o-n-m);this._w=(r-l)/_,this._x=(s+a)/_,this._y=.25*_,this._z=(c+d)/_}else{let _=2*Math.sqrt(1+m-n-o);this._w=(a-s)/_,this._x=(r+l)/_,this._y=(c+d)/_,this._z=.25*_}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(oe(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,c=e._y,l=e._z,d=e._w;return this._x=n*d+a*o+s*l-r*c,this._y=s*d+a*c+r*o-n*l,this._z=r*d+a*l+n*c-s*o,this._w=a*d-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){let n=t._x,s=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let c=1-e;if(o<.9995){let l=Math.acos(o),d=Math.sin(l);c=Math.sin(c*l)/d,e=Math.sin(e*l)/d,this._x=this._x*c+n*e,this._y=this._y*c+s*e,this._z=this._z*c+r*e,this._w=this._w*c+a*e,this._onChangeCallback()}else this._x=this._x*c+n*e,this._y=this._y*c+s*e,this._z=this._z*c+r*e,this._w=this._w*c+a*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Rh=class Rh{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Nu.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Nu.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*s-o*n),d=2*(o*e-r*s),m=2*(r*n-a*e);return this.x=e+c*l+a*m-o*d,this.y=n+c*d+o*l-r*m,this.z=s+c*m+r*d-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=oe(this.x,t.x,e.x),this.y=oe(this.y,t.y,e.y),this.z=oe(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=oe(this.x,t,e),this.y=oe(this.y,t,e),this.z=oe(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(oe(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,c=e.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Ec.copy(this).projectOnVector(t),this.sub(Ec)}reflect(t){return this.sub(Ec.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(oe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Rh.prototype.isVector3=!0;var F=Rh,Ec=new F,Nu=new kn,Ph=class Ph{constructor(t,e,n,s,r,a,o,c,l){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,l)}set(t,e,n,s,r,a,o,c,l){let d=this.elements;return d[0]=t,d[1]=s,d[2]=o,d[3]=e,d[4]=r,d[5]=c,d[6]=n,d[7]=a,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],d=n[4],m=n[7],h=n[2],_=n[5],p=n[8],S=s[0],x=s[3],f=s[6],A=s[1],I=s[4],E=s[7],R=s[2],w=s[5],L=s[8];return r[0]=a*S+o*A+c*R,r[3]=a*x+o*I+c*w,r[6]=a*f+o*E+c*L,r[1]=l*S+d*A+m*R,r[4]=l*x+d*I+m*w,r[7]=l*f+d*E+m*L,r[2]=h*S+_*A+p*R,r[5]=h*x+_*I+p*w,r[8]=h*f+_*E+p*L,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],d=t[8];return e*a*d-e*o*l-n*r*d+n*o*c+s*r*l-s*a*c}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],d=t[8],m=d*a-o*l,h=o*c-d*r,_=l*r-a*c,p=e*m+n*h+s*_;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let S=1/p;return t[0]=m*S,t[1]=(s*l-d*n)*S,t[2]=(o*n-s*a)*S,t[3]=h*S,t[4]=(d*e-s*c)*S,t[5]=(s*r-o*e)*S,t[6]=_*S,t[7]=(n*c-l*e)*S,t[8]=(a*e-n*r)*S,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+t,-s*l,s*c,-s*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return As("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Tc.makeScale(t,e)),this}rotate(t){return As("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Tc.makeRotation(-t)),this}translate(t,e){return As("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Tc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};Ph.prototype.isMatrix3=!0;var Jt=Ph,Tc=new Jt,Uu=new Jt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Fu=new Jt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function op(){let i={enabled:!0,workingColorSpace:jr,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ve&&(s.r=Ni(s.r),s.g=Ni(s.g),s.b=Ni(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ve&&(s.r=ur(s.r),s.g=ur(s.g),s.b=ur(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Bi?Qr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return As("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return As("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[jr]:{primaries:t,whitePoint:n,transfer:Qr,toXYZ:Uu,fromXYZ:Fu,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Vn},outputColorSpaceConfig:{drawingBufferColorSpace:Vn}},[Vn]:{primaries:t,whitePoint:n,transfer:ve,toXYZ:Uu,fromXYZ:Fu,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Vn}}}),i}var de=op();function Ni(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ur(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var js,wo=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{js===void 0&&(js=ea("canvas")),js.width=t.width,js.height=t.height;let s=js.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=js}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=ea("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Ni(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Ni(e[n]/255)*255):e[n]=Ni(e[n]);return{data:e,width:t.width,height:t.height}}else return Ht("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},lp=0,gr=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:lp++}),this.uuid=wr(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Ac(s[a].image)):r.push(Ac(s[a]))}else r=Ac(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function Ac(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?wo.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Ht("Texture: Unable to serialize Texture."),{})}var cp=0,wc=new F,Mn=class i extends ii{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=mi,s=mi,r=Ne,a=ri,o=$n,c=Sn,l=i.DEFAULT_ANISOTROPY,d=Bi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:cp++}),this.uuid=wr(),this.name="",this.source=new gr(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new $t(0,0),this.repeat=new $t(1,1),this.center=new $t(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Jt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(wc).x}get height(){return this.source.getSize(wc).y}get depth(){return this.source.getSize(wc).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){Ht(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Ht(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==dh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Eo:t.x=t.x-Math.floor(t.x);break;case mi:t.x=t.x<0?0:1;break;case To:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Eo:t.y=t.y-Math.floor(t.y);break;case mi:t.y=t.y<0?0:1;break;case To:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};Mn.DEFAULT_IMAGE=null;Mn.DEFAULT_MAPPING=dh;Mn.DEFAULT_ANISOTROPY=1;var Ih=class Ih{constructor(t=0,e=0,n=0,s=1){this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,c=t.elements,l=c[0],d=c[4],m=c[8],h=c[1],_=c[5],p=c[9],S=c[2],x=c[6],f=c[10];if(Math.abs(d-h)<.01&&Math.abs(m-S)<.01&&Math.abs(p-x)<.01){if(Math.abs(d+h)<.1&&Math.abs(m+S)<.1&&Math.abs(p+x)<.1&&Math.abs(l+_+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let I=(l+1)/2,E=(_+1)/2,R=(f+1)/2,w=(d+h)/4,L=(m+S)/4,v=(p+x)/4;return I>E&&I>R?I<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(I),s=w/n,r=L/n):E>R?E<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(E),n=w/s,r=v/s):R<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(R),n=L/r,s=v/r),this.set(n,s,r,e),this}let A=Math.sqrt((x-p)*(x-p)+(m-S)*(m-S)+(h-d)*(h-d));return Math.abs(A)<.001&&(A=1),this.x=(x-p)/A,this.y=(m-S)/A,this.z=(h-d)/A,this.w=Math.acos((l+_+f-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=oe(this.x,t.x,e.x),this.y=oe(this.y,t.y,e.y),this.z=oe(this.z,t.z,e.z),this.w=oe(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=oe(this.x,t,e),this.y=oe(this.y,t,e),this.z=oe(this.z,t,e),this.w=oe(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(oe(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Ih.prototype.isVector4=!0;var Pe=Ih,Co=class extends ii{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ne,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new Pe(0,0,t,e),this.scissorTest=!1,this.viewport=new Pe(0,0,t,e),this.textures=[];let s={width:t,height:e,depth:n.depth},r=new Mn(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:Ne,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new gr(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},gn=class extends Co{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},na=class extends Mn{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=an,this.minFilter=an,this.wrapR=mi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Ro=class extends Mn{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=an,this.minFilter=an,this.wrapR=mi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ko=class Ko{constructor(t,e,n,s,r,a,o,c,l,d,m,h,_,p,S,x){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,l,d,m,h,_,p,S,x)}set(t,e,n,s,r,a,o,c,l,d,m,h,_,p,S,x){let f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=s,f[1]=r,f[5]=a,f[9]=o,f[13]=c,f[2]=l,f[6]=d,f[10]=m,f[14]=h,f[3]=_,f[7]=p,f[11]=S,f[15]=x,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ko().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,n=t.elements,s=1/Qs.setFromMatrixColumn(t,0).length(),r=1/Qs.setFromMatrixColumn(t,1).length(),a=1/Qs.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),d=Math.cos(r),m=Math.sin(r);if(t.order==="XYZ"){let h=a*d,_=a*m,p=o*d,S=o*m;e[0]=c*d,e[4]=-c*m,e[8]=l,e[1]=_+p*l,e[5]=h-S*l,e[9]=-o*c,e[2]=S-h*l,e[6]=p+_*l,e[10]=a*c}else if(t.order==="YXZ"){let h=c*d,_=c*m,p=l*d,S=l*m;e[0]=h+S*o,e[4]=p*o-_,e[8]=a*l,e[1]=a*m,e[5]=a*d,e[9]=-o,e[2]=_*o-p,e[6]=S+h*o,e[10]=a*c}else if(t.order==="ZXY"){let h=c*d,_=c*m,p=l*d,S=l*m;e[0]=h-S*o,e[4]=-a*m,e[8]=p+_*o,e[1]=_+p*o,e[5]=a*d,e[9]=S-h*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){let h=a*d,_=a*m,p=o*d,S=o*m;e[0]=c*d,e[4]=p*l-_,e[8]=h*l+S,e[1]=c*m,e[5]=S*l+h,e[9]=_*l-p,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){let h=a*c,_=a*l,p=o*c,S=o*l;e[0]=c*d,e[4]=S-h*m,e[8]=p*m+_,e[1]=m,e[5]=a*d,e[9]=-o*d,e[2]=-l*d,e[6]=_*m+p,e[10]=h-S*m}else if(t.order==="XZY"){let h=a*c,_=a*l,p=o*c,S=o*l;e[0]=c*d,e[4]=-m,e[8]=l*d,e[1]=h*m+S,e[5]=a*d,e[9]=_*m-p,e[2]=p*m-_,e[6]=o*d,e[10]=S*m+h}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(hp,t,up)}lookAt(t,e,n){let s=this.elements;return Bn.subVectors(t,e),Bn.lengthSq()===0&&(Bn.z=1),Bn.normalize(),qi.crossVectors(n,Bn),qi.lengthSq()===0&&(Math.abs(n.z)===1?Bn.x+=1e-4:Bn.z+=1e-4,Bn.normalize(),qi.crossVectors(n,Bn)),qi.normalize(),Xa.crossVectors(Bn,qi),s[0]=qi.x,s[4]=Xa.x,s[8]=Bn.x,s[1]=qi.y,s[5]=Xa.y,s[9]=Bn.y,s[2]=qi.z,s[6]=Xa.z,s[10]=Bn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],d=n[1],m=n[5],h=n[9],_=n[13],p=n[2],S=n[6],x=n[10],f=n[14],A=n[3],I=n[7],E=n[11],R=n[15],w=s[0],L=s[4],v=s[8],C=s[12],V=s[1],O=s[5],W=s[9],z=s[13],it=s[2],G=s[6],et=s[10],K=s[14],rt=s[3],lt=s[7],mt=s[11],St=s[15];return r[0]=a*w+o*V+c*it+l*rt,r[4]=a*L+o*O+c*G+l*lt,r[8]=a*v+o*W+c*et+l*mt,r[12]=a*C+o*z+c*K+l*St,r[1]=d*w+m*V+h*it+_*rt,r[5]=d*L+m*O+h*G+_*lt,r[9]=d*v+m*W+h*et+_*mt,r[13]=d*C+m*z+h*K+_*St,r[2]=p*w+S*V+x*it+f*rt,r[6]=p*L+S*O+x*G+f*lt,r[10]=p*v+S*W+x*et+f*mt,r[14]=p*C+S*z+x*K+f*St,r[3]=A*w+I*V+E*it+R*rt,r[7]=A*L+I*O+E*G+R*lt,r[11]=A*v+I*W+E*et+R*mt,r[15]=A*C+I*z+E*K+R*St,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],c=t[9],l=t[13],d=t[2],m=t[6],h=t[10],_=t[14],p=t[3],S=t[7],x=t[11],f=t[15],A=c*_-l*h,I=o*_-l*m,E=o*h-c*m,R=a*_-l*d,w=a*h-c*d,L=a*m-o*d;return e*(S*A-x*I+f*E)-n*(p*A-x*R+f*w)+s*(p*I-S*R+f*L)-r*(p*E-S*w+x*L)}determinantAffine(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[1],a=t[5],o=t[9],c=t[2],l=t[6],d=t[10];return e*(a*d-o*l)-n*(r*d-o*c)+s*(r*l-a*c)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],d=t[8],m=t[9],h=t[10],_=t[11],p=t[12],S=t[13],x=t[14],f=t[15],A=e*o-n*a,I=e*c-s*a,E=e*l-r*a,R=n*c-s*o,w=n*l-r*o,L=s*l-r*c,v=d*S-m*p,C=d*x-h*p,V=d*f-_*p,O=m*x-h*S,W=m*f-_*S,z=h*f-_*x,it=A*z-I*W+E*O+R*V-w*C+L*v;if(it===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let G=1/it;return t[0]=(o*z-c*W+l*O)*G,t[1]=(s*W-n*z-r*O)*G,t[2]=(S*L-x*w+f*R)*G,t[3]=(h*w-m*L-_*R)*G,t[4]=(c*V-a*z-l*C)*G,t[5]=(e*z-s*V+r*C)*G,t[6]=(x*E-p*L-f*I)*G,t[7]=(d*L-h*E+_*I)*G,t[8]=(a*W-o*V+l*v)*G,t[9]=(n*V-e*W-r*v)*G,t[10]=(p*w-S*E+f*A)*G,t[11]=(m*E-d*w-_*A)*G,t[12]=(o*C-a*O-c*v)*G,t[13]=(e*O-n*C+s*v)*G,t[14]=(S*I-p*R-x*A)*G,t[15]=(d*R-m*I+h*A)*G,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,c=t.z,l=r*a,d=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,d*o+n,d*c-s*a,0,l*c-s*o,d*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,a=e._y,o=e._z,c=e._w,l=r+r,d=a+a,m=o+o,h=r*l,_=r*d,p=r*m,S=a*d,x=a*m,f=o*m,A=c*l,I=c*d,E=c*m,R=n.x,w=n.y,L=n.z;return s[0]=(1-(S+f))*R,s[1]=(_+E)*R,s[2]=(p-I)*R,s[3]=0,s[4]=(_-E)*w,s[5]=(1-(h+f))*w,s[6]=(x+A)*w,s[7]=0,s[8]=(p+I)*L,s[9]=(x-A)*L,s[10]=(1-(h+S))*L,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let a=Qs.set(s[0],s[1],s[2]).length(),o=Qs.set(s[4],s[5],s[6]).length(),c=Qs.set(s[8],s[9],s[10]).length();r<0&&(a=-a),Qn.copy(this);let l=1/a,d=1/o,m=1/c;return Qn.elements[0]*=l,Qn.elements[1]*=l,Qn.elements[2]*=l,Qn.elements[4]*=d,Qn.elements[5]*=d,Qn.elements[6]*=d,Qn.elements[8]*=m,Qn.elements[9]*=m,Qn.elements[10]*=m,e.setFromRotationMatrix(Qn),n.x=a,n.y=o,n.z=c,this}makePerspective(t,e,n,s,r,a,o=ni,c=!1){let l=this.elements,d=2*r/(e-t),m=2*r/(n-s),h=(e+t)/(e-t),_=(n+s)/(n-s),p,S;if(c)p=r/(a-r),S=a*r/(a-r);else if(o===ni)p=-(a+r)/(a-r),S=-2*a*r/(a-r);else if(o===ta)p=-a/(a-r),S=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=d,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=m,l[9]=_,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=S,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=ni,c=!1){let l=this.elements,d=2/(e-t),m=2/(n-s),h=-(e+t)/(e-t),_=-(n+s)/(n-s),p,S;if(c)p=1/(a-r),S=a/(a-r);else if(o===ni)p=-2/(a-r),S=-(a+r)/(a-r);else if(o===ta)p=-1/(a-r),S=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=d,l[4]=0,l[8]=0,l[12]=h,l[1]=0,l[5]=m,l[9]=0,l[13]=_,l[2]=0,l[6]=0,l[10]=p,l[14]=S,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};Ko.prototype.isMatrix4=!0;var Ue=Ko,Qs=new F,Qn=new Ue,hp=new F(0,0,0),up=new F(1,1,1),qi=new F,Xa=new F,Bn=new F,Ou=new Ue,Bu=new kn,ts=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],d=s[9],m=s[2],h=s[6],_=s[10];switch(e){case"XYZ":this._y=Math.asin(oe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,_),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(h,l),this._z=0);break;case"YXZ":this._x=Math.asin(-oe(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,_),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-m,r),this._z=0);break;case"ZXY":this._x=Math.asin(oe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-m,_),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-oe(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(h,_),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(oe(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-m,r)):(this._x=0,this._y=Math.atan2(o,_));break;case"XZY":this._z=Math.asin(-oe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-d,_),this._y=0);break;default:Ht("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Ou.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ou,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Bu.setFromEuler(this),this.setFromQuaternion(Bu,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ts.DEFAULT_ORDER="XYZ";var ia=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},dp=0,zu=new F,tr=new kn,Ci=new Ue,qa=new F,Wr=new F,fp=new F,pp=new kn,Vu=new F(1,0,0),ku=new F(0,1,0),Hu=new F(0,0,1),Gu={type:"added"},mp={type:"removed"},er={type:"childadded",child:null},Cc={type:"childremoved",child:null},Pn=class i extends ii{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:dp++}),this.uuid=wr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new F,e=new ts,n=new kn,s=new F(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Ue},normalMatrix:{value:new Jt}}),this.matrix=new Ue,this.matrixWorld=new Ue,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ia,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return tr.setFromAxisAngle(t,e),this.quaternion.multiply(tr),this}rotateOnWorldAxis(t,e){return tr.setFromAxisAngle(t,e),this.quaternion.premultiply(tr),this}rotateX(t){return this.rotateOnAxis(Vu,t)}rotateY(t){return this.rotateOnAxis(ku,t)}rotateZ(t){return this.rotateOnAxis(Hu,t)}translateOnAxis(t,e){return zu.copy(t).applyQuaternion(this.quaternion),this.position.add(zu.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Vu,t)}translateY(t){return this.translateOnAxis(ku,t)}translateZ(t){return this.translateOnAxis(Hu,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Ci.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?qa.copy(t):qa.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Wr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ci.lookAt(Wr,qa,this.up):Ci.lookAt(qa,Wr,this.up),this.quaternion.setFromRotationMatrix(Ci),s&&(Ci.extractRotation(s.matrixWorld),tr.setFromRotationMatrix(Ci),this.quaternion.premultiply(tr.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Xt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Gu),er.child=t,this.dispatchEvent(er),er.child=null):Xt("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(mp),Cc.child=t,this.dispatchEvent(Cc),Cc.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Ci.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Ci.multiply(t.parent.matrixWorld)),t.applyMatrix4(Ci),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Gu),er.child=t,this.dispatchEvent(er),er.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Wr,t,fp),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Wr,pp,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,n=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*s,r[13]+=n-r[1]*e-r[5]*n-r[9]*s,r[14]+=s-r[2]*e-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){let s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){let r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let c=o.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){let m=c[l];r(t.shapes,m)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(t.materials,this.material[c]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let c=this.animations[o];s.animations.push(r(t.animations,c))}}if(e){let o=a(t.geometries),c=a(t.materials),l=a(t.textures),d=a(t.images),m=a(t.shapes),h=a(t.skeletons),_=a(t.animations),p=a(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),d.length>0&&(n.images=d),m.length>0&&(n.shapes=m),h.length>0&&(n.skeletons=h),_.length>0&&(n.animations=_),p.length>0&&(n.nodes=p)}return n.object=s,n;function a(o){let c=[];for(let l in o){let d=o[l];delete d.metadata,c.push(d)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}};Pn.DEFAULT_UP=new F(0,1,0);Pn.DEFAULT_MATRIX_AUTO_UPDATE=!0;Pn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Li=class extends Pn{constructor(){super(),this.isGroup=!0,this.type="Group"}},gp={type:"move"},_r=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Li,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Li,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new F,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new F),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Li,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new F,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new F,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null,o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(let S of t.hand.values()){let x=e.getJointPose(S,n),f=this._getHandJoint(l,S);x!==null&&(f.matrix.fromArray(x.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=x.radius),f.visible=x!==null}let d=l.joints["index-finger-tip"],m=l.joints["thumb-tip"],h=d.position.distanceTo(m.position),_=.02,p=.005;l.inputState.pinching&&h>_+p?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&h<=_-p&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(gp)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Li;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},Fd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Yi={h:0,s:0,l:0},Ya={h:0,s:0,l:0};function Rc(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var zt=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Vn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,de.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=de.workingColorSpace){return this.r=t,this.g=e,this.b=n,de.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=de.workingColorSpace){if(t=Sh(t,1),e=oe(e,0,1),n=oe(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=Rc(a,r,t+1/3),this.g=Rc(a,r,t),this.b=Rc(a,r,t-1/3)}return de.colorSpaceToWorking(this,s),this}setStyle(t,e=Vn){function n(r){r!==void 0&&parseFloat(r)<1&&Ht("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Ht("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);Ht("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Vn){let n=Fd[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Ht("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ni(t.r),this.g=Ni(t.g),this.b=Ni(t.b),this}copyLinearToSRGB(t){return this.r=ur(t.r),this.g=ur(t.g),this.b=ur(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Vn){return de.workingToColorSpace(pn.copy(this),t),Math.round(oe(pn.r*255,0,255))*65536+Math.round(oe(pn.g*255,0,255))*256+Math.round(oe(pn.b*255,0,255))}getHexString(t=Vn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=de.workingColorSpace){de.workingToColorSpace(pn.copy(this),e);let n=pn.r,s=pn.g,r=pn.b,a=Math.max(n,s,r),o=Math.min(n,s,r),c,l,d=(o+a)/2;if(o===a)c=0,l=0;else{let m=a-o;switch(l=d<=.5?m/(a+o):m/(2-a-o),a){case n:c=(s-r)/m+(s<r?6:0);break;case s:c=(r-n)/m+2;break;case r:c=(n-s)/m+4;break}c/=6}return t.h=c,t.s=l,t.l=d,t}getRGB(t,e=de.workingColorSpace){return de.workingToColorSpace(pn.copy(this),e),t.r=pn.r,t.g=pn.g,t.b=pn.b,t}getStyle(t=Vn){de.workingToColorSpace(pn.copy(this),t);let e=pn.r,n=pn.g,s=pn.b;return t!==Vn?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Yi),this.setHSL(Yi.h+t,Yi.s+e,Yi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Yi),t.getHSL(Ya);let n=Jr(Yi.h,Ya.h,e),s=Jr(Yi.s,Ya.s,e),r=Jr(Yi.l,Ya.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},pn=new zt;zt.NAMES=Fd;var Rs=class extends Pn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ts,this.environmentIntensity=1,this.environmentRotation=new ts,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}},ti=new F,Ri=new F,Pc=new F,Pi=new F,nr=new F,ir=new F,Wu=new F,Ic=new F,Dc=new F,Lc=new F,Nc=new Pe,Uc=new Pe,Fc=new Pe,ji=class i{constructor(t=new F,e=new F,n=new F){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),ti.subVectors(t,e),s.cross(ti);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){ti.subVectors(s,e),Ri.subVectors(n,e),Pc.subVectors(t,e);let a=ti.dot(ti),o=ti.dot(Ri),c=ti.dot(Pc),l=Ri.dot(Ri),d=Ri.dot(Pc),m=a*l-o*o;if(m===0)return r.set(0,0,0),null;let h=1/m,_=(l*c-o*d)*h,p=(a*d-o*c)*h;return r.set(1-_-p,p,_)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Pi)===null?!1:Pi.x>=0&&Pi.y>=0&&Pi.x+Pi.y<=1}static getInterpolation(t,e,n,s,r,a,o,c){return this.getBarycoord(t,e,n,s,Pi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Pi.x),c.addScaledVector(a,Pi.y),c.addScaledVector(o,Pi.z),c)}static getInterpolatedAttribute(t,e,n,s,r,a){return Nc.setScalar(0),Uc.setScalar(0),Fc.setScalar(0),Nc.fromBufferAttribute(t,e),Uc.fromBufferAttribute(t,n),Fc.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(Nc,r.x),a.addScaledVector(Uc,r.y),a.addScaledVector(Fc,r.z),a}static isFrontFacing(t,e,n,s){return ti.subVectors(n,e),Ri.subVectors(t,e),ti.cross(Ri).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return ti.subVectors(this.c,this.b),Ri.subVectors(this.a,this.b),ti.cross(Ri).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,a,o;nr.subVectors(s,n),ir.subVectors(r,n),Ic.subVectors(t,n);let c=nr.dot(Ic),l=ir.dot(Ic);if(c<=0&&l<=0)return e.copy(n);Dc.subVectors(t,s);let d=nr.dot(Dc),m=ir.dot(Dc);if(d>=0&&m<=d)return e.copy(s);let h=c*m-d*l;if(h<=0&&c>=0&&d<=0)return a=c/(c-d),e.copy(n).addScaledVector(nr,a);Lc.subVectors(t,r);let _=nr.dot(Lc),p=ir.dot(Lc);if(p>=0&&_<=p)return e.copy(r);let S=_*l-c*p;if(S<=0&&l>=0&&p<=0)return o=l/(l-p),e.copy(n).addScaledVector(ir,o);let x=d*p-_*m;if(x<=0&&m-d>=0&&_-p>=0)return Wu.subVectors(r,s),o=(m-d)/(m-d+(_-p)),e.copy(s).addScaledVector(Wu,o);let f=1/(x+S+h);return a=S*f,o=h*f,e.copy(n).addScaledVector(nr,a).addScaledVector(ir,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},es=class{constructor(t=new F(1/0,1/0,1/0),e=new F(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(ei.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(ei.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=ei.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,ei):ei.fromBufferAttribute(r,a),ei.applyMatrix4(t.matrixWorld),this.expandByPoint(ei);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Za.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Za.copy(n.boundingBox)),Za.applyMatrix4(t.matrixWorld),this.union(Za)}let s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,ei),ei.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Xr),$a.subVectors(this.max,Xr),sr.subVectors(t.a,Xr),rr.subVectors(t.b,Xr),ar.subVectors(t.c,Xr),Zi.subVectors(rr,sr),$i.subVectors(ar,rr),Ms.subVectors(sr,ar);let e=[0,-Zi.z,Zi.y,0,-$i.z,$i.y,0,-Ms.z,Ms.y,Zi.z,0,-Zi.x,$i.z,0,-$i.x,Ms.z,0,-Ms.x,-Zi.y,Zi.x,0,-$i.y,$i.x,0,-Ms.y,Ms.x,0];return!Oc(e,sr,rr,ar,$a)||(e=[1,0,0,0,1,0,0,0,1],!Oc(e,sr,rr,ar,$a))?!1:(Ja.crossVectors(Zi,$i),e=[Ja.x,Ja.y,Ja.z],Oc(e,sr,rr,ar,$a))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,ei).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(ei).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Ii[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Ii[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Ii[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Ii[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Ii[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Ii[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Ii[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Ii[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Ii),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},Ii=[new F,new F,new F,new F,new F,new F,new F,new F],ei=new F,Za=new es,sr=new F,rr=new F,ar=new F,Zi=new F,$i=new F,Ms=new F,Xr=new F,$a=new F,Ja=new F,bs=new F;function Oc(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){bs.fromArray(i,r);let o=s.x*Math.abs(bs.x)+s.y*Math.abs(bs.y)+s.z*Math.abs(bs.z),c=t.dot(bs),l=e.dot(bs),d=n.dot(bs);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>o)return!1}return!0}var qe=new F,Ka=new $t,_p=0,Qt=class extends ii{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:_p++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Kc,this.updateRanges=[],this.gpuType=oi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Ka.fromBufferAttribute(this,e),Ka.applyMatrix3(t),this.setXY(e,Ka.x,Ka.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)qe.fromBufferAttribute(this,e),qe.applyMatrix3(t),this.setXYZ(e,qe.x,qe.y,qe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)qe.fromBufferAttribute(this,e),qe.applyMatrix4(t),this.setXYZ(e,qe.x,qe.y,qe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)qe.fromBufferAttribute(this,e),qe.applyNormalMatrix(t),this.setXYZ(e,qe.x,qe.y,qe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)qe.fromBufferAttribute(this,e),qe.transformDirection(t),this.setXYZ(e,qe.x,qe.y,qe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=hr(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=yn(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=hr(e,this.array)),e}setX(t,e){return this.normalized&&(e=yn(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=hr(e,this.array)),e}setY(t,e){return this.normalized&&(e=yn(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=hr(e,this.array)),e}setZ(t,e){return this.normalized&&(e=yn(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=hr(e,this.array)),e}setW(t,e){return this.normalized&&(e=yn(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=yn(e,this.array),n=yn(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=yn(e,this.array),n=yn(n,this.array),s=yn(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=yn(e,this.array),n=yn(n,this.array),s=yn(s,this.array),r=yn(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Kc&&(t.usage=this.usage),t}dispose(){this.dispatchEvent({type:"dispose"})}};var sa=class extends Qt{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var ra=class extends Qt{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var ln=class extends Qt{constructor(t,e,n){super(new Float32Array(t),e,n)}},xp=new es,qr=new F,Bc=new F,ns=class{constructor(t=new F,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):xp.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;qr.subVectors(t,this.center);let e=qr.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(qr,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Bc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(qr.copy(t.center).add(Bc)),this.expandByPoint(qr.copy(t.center).sub(Bc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},vp=0,qn=new Ue,zc=new Pn,or=new F,zn=new es,Yr=new es,rn=new F,Ae=class i extends ii{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:vp++}),this.uuid=wr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Gf(t)?ra:sa)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Jt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return qn.makeRotationFromQuaternion(t),this.applyMatrix4(qn),this}rotateX(t){return qn.makeRotationX(t),this.applyMatrix4(qn),this}rotateY(t){return qn.makeRotationY(t),this.applyMatrix4(qn),this}rotateZ(t){return qn.makeRotationZ(t),this.applyMatrix4(qn),this}translate(t,e,n){return qn.makeTranslation(t,e,n),this.applyMatrix4(qn),this}scale(t,e,n){return qn.makeScale(t,e,n),this.applyMatrix4(qn),this}lookAt(t){return zc.lookAt(t),zc.updateMatrix(),this.applyMatrix4(zc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(or).negate(),this.translate(or.x,or.y,or.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let s=0,r=t.length;s<r;s++){let a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ln(n,3))}else{let n=Math.min(t.length,e.count);for(let s=0;s<n;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&Ht("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new es);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Xt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new F(-1/0,-1/0,-1/0),new F(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];zn.setFromBufferAttribute(r),this.morphTargetsRelative?(rn.addVectors(this.boundingBox.min,zn.min),this.boundingBox.expandByPoint(rn),rn.addVectors(this.boundingBox.max,zn.max),this.boundingBox.expandByPoint(rn)):(this.boundingBox.expandByPoint(zn.min),this.boundingBox.expandByPoint(zn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Xt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ns);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Xt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new F,1/0);return}if(t){let n=this.boundingSphere.center;if(zn.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){let o=e[r];Yr.setFromBufferAttribute(o),this.morphTargetsRelative?(rn.addVectors(zn.min,Yr.min),zn.expandByPoint(rn),rn.addVectors(zn.max,Yr.max),zn.expandByPoint(rn)):(zn.expandByPoint(Yr.min),zn.expandByPoint(Yr.max))}zn.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)rn.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(rn));if(e)for(let r=0,a=e.length;r<a;r++){let o=e[r],c=this.morphTargetsRelative;for(let l=0,d=o.count;l<d;l++)rn.fromBufferAttribute(o,l),c&&(or.fromBufferAttribute(t,l),rn.add(or)),s=Math.max(s,n.distanceToSquared(rn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Xt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Xt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,s=e.normal,r=e.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new Qt(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let o=[],c=[];for(let v=0;v<n.count;v++)o[v]=new F,c[v]=new F;let l=new F,d=new F,m=new F,h=new $t,_=new $t,p=new $t,S=new F,x=new F;function f(v,C,V){l.fromBufferAttribute(n,v),d.fromBufferAttribute(n,C),m.fromBufferAttribute(n,V),h.fromBufferAttribute(r,v),_.fromBufferAttribute(r,C),p.fromBufferAttribute(r,V),d.sub(l),m.sub(l),_.sub(h),p.sub(h);let O=1/(_.x*p.y-p.x*_.y);isFinite(O)&&(S.copy(d).multiplyScalar(p.y).addScaledVector(m,-_.y).multiplyScalar(O),x.copy(m).multiplyScalar(_.x).addScaledVector(d,-p.x).multiplyScalar(O),o[v].add(S),o[C].add(S),o[V].add(S),c[v].add(x),c[C].add(x),c[V].add(x))}let A=this.groups;A.length===0&&(A=[{start:0,count:t.count}]);for(let v=0,C=A.length;v<C;++v){let V=A[v],O=V.start,W=V.count;for(let z=O,it=O+W;z<it;z+=3)f(t.getX(z+0),t.getX(z+1),t.getX(z+2))}let I=new F,E=new F,R=new F,w=new F;function L(v){R.fromBufferAttribute(s,v),w.copy(R);let C=o[v];I.copy(C),I.sub(R.multiplyScalar(R.dot(C))).normalize(),E.crossVectors(w,C);let O=E.dot(c[v])<0?-1:1;a.setXYZW(v,I.x,I.y,I.z,O)}for(let v=0,C=A.length;v<C;++v){let V=A[v],O=V.start,W=V.count;for(let z=O,it=O+W;z<it;z+=3)L(t.getX(z+0)),L(t.getX(z+1)),L(t.getX(z+2))}this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new Qt(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let h=0,_=n.count;h<_;h++)n.setXYZ(h,0,0,0);let s=new F,r=new F,a=new F,o=new F,c=new F,l=new F,d=new F,m=new F;if(t)for(let h=0,_=t.count;h<_;h+=3){let p=t.getX(h+0),S=t.getX(h+1),x=t.getX(h+2);s.fromBufferAttribute(e,p),r.fromBufferAttribute(e,S),a.fromBufferAttribute(e,x),d.subVectors(a,r),m.subVectors(s,r),d.cross(m),o.fromBufferAttribute(n,p),c.fromBufferAttribute(n,S),l.fromBufferAttribute(n,x),o.add(d),c.add(d),l.add(d),n.setXYZ(p,o.x,o.y,o.z),n.setXYZ(S,c.x,c.y,c.z),n.setXYZ(x,l.x,l.y,l.z)}else for(let h=0,_=e.count;h<_;h+=3)s.fromBufferAttribute(e,h+0),r.fromBufferAttribute(e,h+1),a.fromBufferAttribute(e,h+2),d.subVectors(a,r),m.subVectors(s,r),d.cross(m),n.setXYZ(h+0,d.x,d.y,d.z),n.setXYZ(h+1,d.x,d.y,d.z),n.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)rn.fromBufferAttribute(t,e),rn.normalize(),t.setXYZ(e,rn.x,rn.y,rn.z)}toNonIndexed(){function t(o,c){let l=o.array,d=o.itemSize,m=o.normalized,h=new l.constructor(c.length*d),_=0,p=0;for(let S=0,x=c.length;S<x;S++){o.isInterleavedBufferAttribute?_=c[S]*o.data.stride+o.offset:_=c[S]*d;for(let f=0;f<d;f++)h[p++]=l[_++]}return new Qt(h,d,m)}if(this.index===null)return Ht("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let o in s){let c=s[o],l=t(c,n);e.setAttribute(o,l)}let r=this.morphAttributes;for(let o in r){let c=[],l=r[o];for(let d=0,m=l.length;d<m;d++){let h=l[d],_=t(h,n);c.push(_)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,c=a.length;o<c;o++){let l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let c in n){let l=n[c];t.data.attributes[c]=l.toJSON(t.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],d=[];for(let m=0,h=l.length;m<h;m++){let _=l[m];d.push(_.toJSON(t.data))}d.length>0&&(s[c]=d,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let s=t.attributes;for(let l in s){let d=s[l];this.setAttribute(l,d.clone(e))}let r=t.morphAttributes;for(let l in r){let d=[],m=r[l];for(let h=0,_=m.length;h<_;h++)d.push(m[h].clone(e));this.morphAttributes[l]=d}this.morphTargetsRelative=t.morphTargetsRelative;let a=t.groups;for(let l=0,d=a.length;l<d;l++){let m=a[l];this.addGroup(m.start,m.count,m.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var yp=0,Fi=class extends ii{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:yp++}),this.uuid=wr(),this.name="",this.type="Material",this.blending=ws,this.side=Ui,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=dr,this.blendDst=fr,this.blendEquation=Qi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new zt(0,0,0),this.blendAlpha=0,this.depthFunc=Cs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Jc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ts,this.stencilZFail=Ts,this.stencilZPass=Ts,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){Ht(`Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Ht(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ws&&(n.blending=this.blending),this.side!==Ui&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==dr&&(n.blendSrc=this.blendSrc),this.blendDst!==fr&&(n.blendDst=this.blendDst),this.blendEquation!==Qi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Cs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Jc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ts&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ts&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ts&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let c=r[o];delete c.metadata,a.push(c)}return a}if(e){let r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new zt().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new $t().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new $t().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}};var Di=new F,Vc=new F,ja=new F,Ji=new F,kc=new F,Qa=new F,Hc=new F,is=class{constructor(t=new F,e=new F(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Di)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Di.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Di.copy(this.origin).addScaledVector(this.direction,e),Di.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Vc.copy(t).add(e).multiplyScalar(.5),ja.copy(e).sub(t).normalize(),Ji.copy(this.origin).sub(Vc);let r=t.distanceTo(e)*.5,a=-this.direction.dot(ja),o=Ji.dot(this.direction),c=-Ji.dot(ja),l=Ji.lengthSq(),d=Math.abs(1-a*a),m,h,_,p;if(d>0)if(m=a*c-o,h=a*o-c,p=r*d,m>=0)if(h>=-p)if(h<=p){let S=1/d;m*=S,h*=S,_=m*(m+a*h+2*o)+h*(a*m+h+2*c)+l}else h=r,m=Math.max(0,-(a*h+o)),_=-m*m+h*(h+2*c)+l;else h=-r,m=Math.max(0,-(a*h+o)),_=-m*m+h*(h+2*c)+l;else h<=-p?(m=Math.max(0,-(-a*r+o)),h=m>0?-r:Math.min(Math.max(-r,-c),r),_=-m*m+h*(h+2*c)+l):h<=p?(m=0,h=Math.min(Math.max(-r,-c),r),_=h*(h+2*c)+l):(m=Math.max(0,-(a*r+o)),h=m>0?r:Math.min(Math.max(-r,-c),r),_=-m*m+h*(h+2*c)+l);else h=a>0?-r:r,m=Math.max(0,-(a*h+o)),_=-m*m+h*(h+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,m),s&&s.copy(Vc).addScaledVector(ja,h),_}intersectSphere(t,e){Di.subVectors(t.center,this.origin);let n=Di.dot(this.direction),s=Di.dot(Di)-n*n,r=t.radius*t.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,c,l=1/this.direction.x,d=1/this.direction.y,m=1/this.direction.z,h=this.origin;return l>=0?(n=(t.min.x-h.x)*l,s=(t.max.x-h.x)*l):(n=(t.max.x-h.x)*l,s=(t.min.x-h.x)*l),d>=0?(r=(t.min.y-h.y)*d,a=(t.max.y-h.y)*d):(r=(t.max.y-h.y)*d,a=(t.min.y-h.y)*d),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),m>=0?(o=(t.min.z-h.z)*m,c=(t.max.z-h.z)*m):(o=(t.max.z-h.z)*m,c=(t.min.z-h.z)*m),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Di)!==null}intersectTriangle(t,e,n,s,r){kc.subVectors(e,t),Qa.subVectors(n,t),Hc.crossVectors(kc,Qa);let a=this.direction.dot(Hc),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Ji.subVectors(this.origin,t);let c=o*this.direction.dot(Qa.crossVectors(Ji,Qa));if(c<0)return null;let l=o*this.direction.dot(kc.cross(Ji));if(l<0||c+l>a)return null;let d=-o*Ji.dot(Hc);return d<0?null:this.at(d/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},aa=class extends Fi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new zt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ts,this.combine=sh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},Xu=new Ue,Ss=new is,to=new ns,qu=new F,eo=new F,no=new F,io=new F,Gc=new F,so=new F,Yu=new F,ro=new F,Ke=class extends Pn{constructor(t=new Ae,e=new aa){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let o=this.morphTargetInfluences;if(r&&o){so.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let d=o[c],m=r[c];d!==0&&(Gc.fromBufferAttribute(m,t),a?so.addScaledVector(Gc,d):so.addScaledVector(Gc.sub(e),d))}e.add(so)}return e}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),to.copy(n.boundingSphere),to.applyMatrix4(r),Ss.copy(t.ray).recast(t.near),!(to.containsPoint(Ss.origin)===!1&&(Ss.intersectSphere(to,qu)===null||Ss.origin.distanceToSquared(qu)>(t.far-t.near)**2))&&(Xu.copy(r).invert(),Ss.copy(t.ray).applyMatrix4(Xu),!(n.boundingBox!==null&&Ss.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Ss)))}_computeIntersections(t,e,n){let s,r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,d=r.attributes.uv1,m=r.attributes.normal,h=r.groups,_=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,S=h.length;p<S;p++){let x=h[p],f=a[x.materialIndex],A=Math.max(x.start,_.start),I=Math.min(o.count,Math.min(x.start+x.count,_.start+_.count));for(let E=A,R=I;E<R;E+=3){let w=o.getX(E),L=o.getX(E+1),v=o.getX(E+2);s=ao(this,f,t,n,l,d,m,w,L,v),s&&(s.faceIndex=Math.floor(E/3),s.face.materialIndex=x.materialIndex,e.push(s))}}else{let p=Math.max(0,_.start),S=Math.min(o.count,_.start+_.count);for(let x=p,f=S;x<f;x+=3){let A=o.getX(x),I=o.getX(x+1),E=o.getX(x+2);s=ao(this,a,t,n,l,d,m,A,I,E),s&&(s.faceIndex=Math.floor(x/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let p=0,S=h.length;p<S;p++){let x=h[p],f=a[x.materialIndex],A=Math.max(x.start,_.start),I=Math.min(c.count,Math.min(x.start+x.count,_.start+_.count));for(let E=A,R=I;E<R;E+=3){let w=E,L=E+1,v=E+2;s=ao(this,f,t,n,l,d,m,w,L,v),s&&(s.faceIndex=Math.floor(E/3),s.face.materialIndex=x.materialIndex,e.push(s))}}else{let p=Math.max(0,_.start),S=Math.min(c.count,_.start+_.count);for(let x=p,f=S;x<f;x+=3){let A=x,I=x+1,E=x+2;s=ao(this,a,t,n,l,d,m,A,I,E),s&&(s.faceIndex=Math.floor(x/3),e.push(s))}}}};function Mp(i,t,e,n,s,r,a,o){let c;if(t.side===cn?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,t.side===Ui,o),c===null)return null;ro.copy(o),ro.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo(ro);return l<e.near||l>e.far?null:{distance:l,point:ro.clone(),object:i}}function ao(i,t,e,n,s,r,a,o,c,l){i.getVertexPosition(o,eo),i.getVertexPosition(c,no),i.getVertexPosition(l,io);let d=Mp(i,t,e,n,eo,no,io,Yu);if(d){let m=new F;ji.getBarycoord(Yu,eo,no,io,m),s&&(d.uv=ji.getInterpolatedAttribute(s,o,c,l,m,new $t)),r&&(d.uv1=ji.getInterpolatedAttribute(r,o,c,l,m,new $t)),a&&(d.normal=ji.getInterpolatedAttribute(a,o,c,l,m,new F),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));let h={a:o,b:c,c:l,normal:new F,materialIndex:0};ji.getNormal(eo,no,io,h.normal),d.face=h,d.barycoord=m}return d}var Po=class extends Mn{constructor(t=null,e=1,n=1,s,r,a,o,c,l=an,d=an,m,h){super(null,a,o,c,l,d,s,r,m,h),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Wc=new F,bp=new F,Sp=new Jt,Yn=class{constructor(t=new F(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=Wc.subVectors(n,e).cross(bp.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){let s=t.delta(Wc),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let a=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:e.copy(t.start).addScaledVector(s,a)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||Sp.getNormalMatrix(t),s=this.coplanarPoint(Wc).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},Es=new ns,Ep=new $t(.5,.5),oo=new F,oa=class{constructor(t=new Yn,e=new Yn,n=new Yn,s=new Yn,r=new Yn,a=new Yn){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){let o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=ni,n=!1){let s=this.planes,r=t.elements,a=r[0],o=r[1],c=r[2],l=r[3],d=r[4],m=r[5],h=r[6],_=r[7],p=r[8],S=r[9],x=r[10],f=r[11],A=r[12],I=r[13],E=r[14],R=r[15];if(s[0].setComponents(l-a,_-d,f-p,R-A).normalize(),s[1].setComponents(l+a,_+d,f+p,R+A).normalize(),s[2].setComponents(l+o,_+m,f+S,R+I).normalize(),s[3].setComponents(l-o,_-m,f-S,R-I).normalize(),n)s[4].setComponents(c,h,x,E).normalize(),s[5].setComponents(l-c,_-h,f-x,R-E).normalize();else if(s[4].setComponents(l-c,_-h,f-x,R-E).normalize(),e===ni)s[5].setComponents(l+c,_+h,f+x,R+E).normalize();else if(e===ta)s[5].setComponents(c,h,x,E).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Es.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Es.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Es)}intersectsSprite(t){Es.center.set(0,0,0);let e=Ep.distanceTo(t.center);return Es.radius=.7071067811865476+e,Es.applyMatrix4(t.matrixWorld),this.intersectsSphere(Es)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(oo.x=s.normal.x>0?t.max.x:t.min.x,oo.y=s.normal.y>0?t.max.y:t.min.y,oo.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(oo)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var xr=class extends Fi{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new zt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},Io=new F,Do=new F,Zu=new Ue,Zr=new is,lo=new ns,Xc=new F,$u=new F,Lo=class extends Pn{constructor(t=new Ae,e=new xr){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)Io.fromBufferAttribute(e,s-1),Do.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Io.distanceTo(Do);t.setAttribute("lineDistance",new ln(n,1))}else Ht("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),lo.copy(n.boundingSphere),lo.applyMatrix4(s),lo.radius+=r,t.ray.intersectsSphere(lo)===!1)return;Zu.copy(s).invert(),Zr.copy(t.ray).applyMatrix4(Zu);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,d=n.index,h=n.attributes.position;if(d!==null){let _=Math.max(0,a.start),p=Math.min(d.count,a.start+a.count);for(let S=_,x=p-1;S<x;S+=l){let f=d.getX(S),A=d.getX(S+1),I=co(this,t,Zr,c,f,A,S);I&&e.push(I)}if(this.isLineLoop){let S=d.getX(p-1),x=d.getX(_),f=co(this,t,Zr,c,S,x,p-1);f&&e.push(f)}}else{let _=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let S=_,x=p-1;S<x;S+=l){let f=co(this,t,Zr,c,S,S+1,S);f&&e.push(f)}if(this.isLineLoop){let S=co(this,t,Zr,c,p-1,_,p-1);S&&e.push(S)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function co(i,t,e,n,s,r,a){let o=i.geometry.attributes.position;if(Io.fromBufferAttribute(o,s),Do.fromBufferAttribute(o,r),e.distanceSqToSegment(Io,Do,Xc,$u)>n)return;Xc.applyMatrix4(i.matrixWorld);let l=t.ray.origin.distanceTo(Xc);if(!(l<t.near||l>t.far))return{distance:l,point:$u.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}var Ju=new F,Ku=new F,vr=class extends Lo{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)Ju.fromBufferAttribute(e,s),Ku.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Ju.distanceTo(Ku);t.setAttribute("lineDistance",new ln(n,1))}else Ht("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var No=class extends Fi{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new zt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},ju=new Ue,jc=new is,ho=new ns,uo=new F,bn=class extends Pn{constructor(t=new Ae,e=new No){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ho.copy(n.boundingSphere),ho.applyMatrix4(s),ho.radius+=r,t.ray.intersectsSphere(ho)===!1)return;ju.copy(s).invert(),jc.copy(t.ray).applyMatrix4(ju);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,m=n.attributes.position;if(l!==null){let h=Math.max(0,a.start),_=Math.min(l.count,a.start+a.count);for(let p=h,S=_;p<S;p++){let x=l.getX(p);uo.fromBufferAttribute(m,x),Qu(uo,x,c,s,t,e,this)}}else{let h=Math.max(0,a.start),_=Math.min(m.count,a.start+a.count);for(let p=h,S=_;p<S;p++)uo.fromBufferAttribute(m,p),Qu(uo,p,c,s,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function Qu(i,t,e,n,s,r,a){let o=jc.distanceSqToPoint(i);if(o<e){let c=new F;jc.closestPointToPoint(i,c),c.applyMatrix4(n);let l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}var la=class extends Mn{constructor(t=[],e=cs,n,s,r,a,o,c,l,d){super(t,e,n,s,r,a,o,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},yr=class extends Mn{constructor(t,e,n,s,r,a,o,c,l){super(t,e,n,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Oi=class extends Mn{constructor(t,e,n=ai,s,r,a,o=an,c=an,l,d=gi,m=1){if(d!==gi&&d!==hs)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:t,height:e,depth:m};super(h,s,r,a,o,c,d,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new gr(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},Uo=class extends Oi{constructor(t,e=ai,n=cs,s,r,a=an,o=an,c,l=gi){let d={width:t,height:t,depth:1},m=[d,d,d,d,d,d];super(t,t,e,n,s,r,a,o,c,l),this.image=m,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},ca=class extends Mn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},Mr=class i extends Ae{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let c=[],l=[],d=[],m=[],h=0,_=0;p("z","y","x",-1,-1,n,e,t,a,r,0),p("z","y","x",1,-1,n,e,-t,a,r,1),p("x","z","y",1,1,t,n,e,s,a,2),p("x","z","y",1,-1,t,n,-e,s,a,3),p("x","y","z",1,-1,t,e,n,s,r,4),p("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new ln(l,3)),this.setAttribute("normal",new ln(d,3)),this.setAttribute("uv",new ln(m,2));function p(S,x,f,A,I,E,R,w,L,v,C){let V=E/L,O=R/v,W=E/2,z=R/2,it=w/2,G=L+1,et=v+1,K=0,rt=0,lt=new F;for(let mt=0;mt<et;mt++){let St=mt*O-z;for(let xt=0;xt<G;xt++){let le=xt*V-W;lt[S]=le*A,lt[x]=St*I,lt[f]=it,l.push(lt.x,lt.y,lt.z),lt[S]=0,lt[x]=0,lt[f]=w>0?1:-1,d.push(lt.x,lt.y,lt.z),m.push(xt/L),m.push(1-mt/v),K+=1}}for(let mt=0;mt<v;mt++)for(let St=0;St<L;St++){let xt=h+St+G*mt,le=h+St+G*(mt+1),ye=h+(St+1)+G*(mt+1),re=h+(St+1)+G*mt;c.push(xt,le,re),c.push(le,ye,re),rt+=6}o.addGroup(_,rt,C),_+=rt,h+=K}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var _i=class i extends Ae{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,a=e/2,o=Math.floor(n),c=Math.floor(s),l=o+1,d=c+1,m=t/o,h=e/c,_=[],p=[],S=[],x=[];for(let f=0;f<d;f++){let A=f*h-a;for(let I=0;I<l;I++){let E=I*m-r;p.push(E,-A,0),S.push(0,0,1),x.push(I/o),x.push(1-f/c)}}for(let f=0;f<c;f++)for(let A=0;A<o;A++){let I=A+l*f,E=A+l*(f+1),R=A+1+l*(f+1),w=A+1+l*f;_.push(I,E,w),_.push(E,R,w)}this.setIndex(_),this.setAttribute("position",new ln(p,3)),this.setAttribute("normal",new ln(S,3)),this.setAttribute("uv",new ln(x,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}};var ha=class i extends Ae{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let c=Math.min(a+o,Math.PI),l=0,d=[],m=new F,h=new F,_=[],p=[],S=[],x=[];for(let f=0;f<=n;f++){let A=[],I=f/n,E=a+I*o,R=t*Math.cos(E),w=Math.sqrt(t*t-R*R),L=0;f===0&&a===0?L=.5/e:f===n&&c===Math.PI&&(L=-.5/e);for(let v=0;v<=e;v++){let C=v/e,V=s+C*r;m.x=-w*Math.cos(V),m.y=R,m.z=w*Math.sin(V),p.push(m.x,m.y,m.z),h.copy(m).normalize(),S.push(h.x,h.y,h.z),x.push(C+L,1-I),A.push(l++)}d.push(A)}for(let f=0;f<n;f++)for(let A=0;A<e;A++){let I=d[f][A+1],E=d[f][A],R=d[f+1][A],w=d[f+1][A+1];(f!==0||a>0)&&_.push(I,E,w),(f!==n-1||c<Math.PI)&&_.push(E,R,w)}this.setIndex(_),this.setAttribute("position",new ln(p,3)),this.setAttribute("normal",new ln(S,3)),this.setAttribute("uv",new ln(x,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};function Ls(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];if(td(s))s.isRenderTargetTexture?(Ht("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone();else if(Array.isArray(s))if(td(s[0])){let r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();t[e][n]=r}else t[e][n]=s.slice();else t[e][n]=s}}return t}function _n(i){let t={};for(let e=0;e<i.length;e++){let n=Ls(i[e]);for(let s in n)t[s]=n[s]}return t}function td(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function Tp(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Eh(i){let t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:de.workingColorSpace}var Od={clone:Ls,merge:_n},Ap=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,wp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Se=class extends Fi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ap,this.fragmentShader=wp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ls(t.uniforms),this.uniformsGroups=Tp(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let n in t.uniforms){let s=t.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=e[s.value]||null;break;case"c":this.uniforms[n].value=new zt().setHex(s.value);break;case"v2":this.uniforms[n].value=new $t().fromArray(s.value);break;case"v3":this.uniforms[n].value=new F().fromArray(s.value);break;case"v4":this.uniforms[n].value=new Pe().fromArray(s.value);break;case"m3":this.uniforms[n].value=new Jt().fromArray(s.value);break;case"m4":this.uniforms[n].value=new Ue().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},Fo=class extends Se{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}};var Oo=class extends Fi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Ed,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Bo=class extends Fi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function fo(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}var ss=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let a;e:{i:if(!(t<s)){for(let o=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=e[++n],t<s)break t}a=e.length;break e}if(!(t>=r)){let o=e[1];t<o&&(n=2,r=o);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=e[--n-1],t>=r)break t}a=n,n=0;break e}break n}for(;n<a;){let o=n+a>>>1;t<e[o]?a=o:n=o+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let a=0;a!==s;++a)e[a]=n[r+a];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},zo=class extends ss{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Yc,endingEnd:Yc}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,a=t+1,o=s[r],c=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Zc:r=t,o=2*e-n;break;case $c:r=s.length-2,o=e+s[r]-s[r+1];break;default:r=t,o=n}if(c===void 0)switch(this.getSettings_().endingEnd){case Zc:a=t,c=2*n-e;break;case $c:a=1,c=n+s[1]-s[0];break;default:a=t-1,c=e}let l=(n-e)*.5,d=this.valueSize;this._weightPrev=l/(e-o),this._weightNext=l/(c-n),this._offsetPrev=r*d,this._offsetNext=a*d}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,d=this._offsetPrev,m=this._offsetNext,h=this._weightPrev,_=this._weightNext,p=(n-e)/(s-e),S=p*p,x=S*p,f=-h*x+2*h*S-h*p,A=(1+h)*x+(-1.5-2*h)*S+(-.5+h)*p+1,I=(-1-_)*x+(1.5+_)*S+.5*p,E=_*x-_*S;for(let R=0;R!==o;++R)r[R]=f*a[d+R]+A*a[l+R]+I*a[c+R]+E*a[m+R];return r}},Vo=class extends ss{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,d=(n-e)/(s-e),m=1-d;for(let h=0;h!==o;++h)r[h]=a[l+h]*m+a[c+h]*d;return r}},ko=class extends ss{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},Ho=class extends ss{interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,d=this.inTangents,m=this.outTangents;if(!d||!m){let p=(n-e)/(s-e),S=1-p;for(let x=0;x!==o;++x)r[x]=a[l+x]*S+a[c+x]*p;return r}let h=o*2,_=t-1;for(let p=0;p!==o;++p){let S=a[l+p],x=a[c+p],f=_*h+p*2,A=m[f],I=m[f+1],E=t*h+p*2,R=d[E],w=d[E+1],L=(n-e)/(s-e),v,C,V,O,W;for(let z=0;z<8;z++){v=L*L,C=v*L,V=1-L,O=V*V,W=O*V;let G=W*e+3*O*L*A+3*V*v*R+C*s-n;if(Math.abs(G)<1e-10)break;let et=3*O*(A-e)+6*V*L*(R-A)+3*v*(s-R);if(Math.abs(et)<1e-10)break;L=L-G/et,L=Math.max(0,Math.min(1,L))}r[p]=W*S+3*O*L*I+3*V*v*w+C*x}return r}},Hn=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=fo(e,this.TimeBufferType),this.values=fo(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:fo(t.times,Array),values:fo(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new ko(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Vo(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new zo(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new Ho(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case Kr:e=this.InterpolantFactoryMethodDiscrete;break;case Ao:e=this.InterpolantFactoryMethodLinear;break;case go:e=this.InterpolantFactoryMethodSmooth;break;case qc:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Ht("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Kr;case this.InterpolantFactoryMethodLinear:return Ao;case this.InterpolantFactoryMethodSmooth:return go;case this.InterpolantFactoryMethodBezier:return qc}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<t;)++r;for(;a!==-1&&n[a]>e;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(Xt("KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(Xt("KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==r;o++){let c=n[o];if(typeof c=="number"&&isNaN(c)){Xt("KeyframeTrack: Time is not a valid number.",this,o,c),t=!1;break}if(a!==null&&a>c){Xt("KeyframeTrack: Out of order keys.",this,o,c,a),t=!1;break}a=c}if(s!==void 0&&Wf(s))for(let o=0,c=s.length;o!==c;++o){let l=s[o];if(isNaN(l)){Xt("KeyframeTrack: Value is not a valid number.",this,o,l),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===go,r=t.length-1,a=1;for(let o=1;o<r;++o){let c=!1,l=t[o],d=t[o+1];if(l!==d&&(o!==1||l!==t[0]))if(s)c=!0;else{let m=o*n,h=m-n,_=m+n;for(let p=0;p!==n;++p){let S=e[m+p];if(S!==e[h+p]||S!==e[_+p]){c=!0;break}}}if(c){if(o!==a){t[a]=t[o];let m=o*n,h=a*n;for(let _=0;_!==n;++_)e[h+_]=e[m+_]}++a}}if(r>0){t[a]=t[r];for(let o=r*n,c=a*n,l=0;l!==n;++l)e[c+l]=e[o+l];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};Hn.prototype.ValueTypeName="";Hn.prototype.TimeBufferType=Float32Array;Hn.prototype.ValueBufferType=Float32Array;Hn.prototype.DefaultInterpolation=Ao;var rs=class extends Hn{constructor(t,e,n){super(t,e,n)}};rs.prototype.ValueTypeName="bool";rs.prototype.ValueBufferType=Array;rs.prototype.DefaultInterpolation=Kr;rs.prototype.InterpolantFactoryMethodLinear=void 0;rs.prototype.InterpolantFactoryMethodSmooth=void 0;var Go=class extends Hn{constructor(t,e,n,s){super(t,e,n,s)}};Go.prototype.ValueTypeName="color";var Wo=class extends Hn{constructor(t,e,n,s){super(t,e,n,s)}};Wo.prototype.ValueTypeName="number";var Xo=class extends ss{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(n-e)/(s-e),l=t*o;for(let d=l+o;l!==d;l+=4)kn.slerpFlat(r,0,a,l-o,a,l,c);return r}},ua=class extends Hn{constructor(t,e,n,s){super(t,e,n,s)}InterpolantFactoryMethodLinear(t){return new Xo(this.times,this.values,this.getValueSize(),t)}};ua.prototype.ValueTypeName="quaternion";ua.prototype.InterpolantFactoryMethodSmooth=void 0;var as=class extends Hn{constructor(t,e,n){super(t,e,n)}};as.prototype.ValueTypeName="string";as.prototype.ValueBufferType=Array;as.prototype.DefaultInterpolation=Kr;as.prototype.InterpolantFactoryMethodLinear=void 0;as.prototype.InterpolantFactoryMethodSmooth=void 0;var qo=class extends Hn{constructor(t,e,n,s){super(t,e,n,s)}};qo.prototype.ValueTypeName="vector";var Yo=class{constructor(t,e,n){let s=this,r=!1,a=0,o=0,c,l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this._abortController=null,this.itemStart=function(d){o++,r===!1&&s.onStart!==void 0&&s.onStart(d,a,o),r=!0},this.itemEnd=function(d){a++,s.onProgress!==void 0&&s.onProgress(d,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(d){s.onError!==void 0&&s.onError(d)},this.resolveURL=function(d){return d=d.normalize("NFC"),c?c(d):d},this.setURLModifier=function(d){return c=d,this},this.addHandler=function(d,m){return l.push(d,m),this},this.removeHandler=function(d){let m=l.indexOf(d);return m!==-1&&l.splice(m,2),this},this.getHandler=function(d){for(let m=0,h=l.length;m<h;m+=2){let _=l[m],p=l[m+1];if(_.global&&(_.lastIndex=0),_.test(d))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Bd=new Yo,Zo=class{constructor(t){this.manager=t!==void 0?t:Bd,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};Zo.DEFAULT_MATERIAL_NAME="__DEFAULT";var po=new F,mo=new kn,pi=new F,da=class extends Pn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ue,this.projectionMatrix=new Ue,this.projectionMatrixInverse=new Ue,this.coordinateSystem=ni,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(po,mo,pi),pi.x===1&&pi.y===1&&pi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(po,mo,pi.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(po,mo,pi),pi.x===1&&pi.y===1&&pi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(po,mo,pi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Ki=new F,ed=new $t,nd=new $t,mn=class extends da{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=mr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan($r*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return mr*2*Math.atan(Math.tan($r*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Ki.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Ki.x,Ki.y).multiplyScalar(-t/Ki.z),Ki.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ki.x,Ki.y).multiplyScalar(-t/Ki.z)}getViewSize(t,e){return this.getViewBounds(t,ed,nd),e.subVectors(nd,ed)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan($r*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,e-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}let o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}};var Ps=class extends da{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,a=n+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=d*this.view.offsetY,c=o-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}};var lr=-90,cr=1,$o=class extends Pn{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new mn(lr,cr,t,e);s.layers=this.layers,this.add(s);let r=new mn(lr,cr,t,e);r.layers=this.layers,this.add(r);let a=new mn(lr,cr,t,e);a.layers=this.layers,this.add(a);let o=new mn(lr,cr,t,e);o.layers=this.layers,this.add(o);let c=new mn(lr,cr,t,e);c.layers=this.layers,this.add(c);let l=new mn(lr,cr,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,c]=e;for(let l of e)this.remove(l);if(t===ni)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===ta)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,c,l,d]=this.children,m=t.getRenderTarget(),h=t.getActiveCubeFace(),_=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;let S=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let x=!1;t.isWebGLRenderer===!0?x=t.state.buffers.depth.getReversed():x=t.reversedDepthBuffer,t.setRenderTarget(n,0,s),x&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,s),x&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,2,s),x&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,3,s),x&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),t.setRenderTarget(n,4,s),x&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),n.texture.generateMipmaps=S,t.setRenderTarget(n,5,s),x&&t.autoClear===!1&&t.clearDepth(),t.render(e,d),t.setRenderTarget(m,h,_),t.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},Jo=class extends mn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var Th="\\[\\]\\.:\\/",Cp=new RegExp("["+Th+"]","g"),Ah="[^"+Th+"]",Rp="[^"+Th.replace("\\.","")+"]",Pp=/((?:WC+[\/:])*)/.source.replace("WC",Ah),Ip=/(WCOD+)?/.source.replace("WCOD",Rp),Dp=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Ah),Lp=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Ah),Np=new RegExp("^"+Pp+Ip+Dp+Lp+"$"),Up=["material","materials","bones","map"],Qc=class{constructor(t,e,n){let s=n||Re.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},Re=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Cp,"")}static parseTrackName(t){let e=Np.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Up.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===e||o.uuid===e)return o;let c=n(o.children);if(c)return c}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Ht("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=e.objectIndex;switch(n){case"materials":if(!t.material){Xt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Xt("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Xt("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let d=0;d<t.length;d++)if(t[d].name===l){l=d;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Xt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Xt("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){Xt("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(l!==void 0){if(t[l]===void 0){Xt("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}let a=t[s];if(a===void 0){let l=e.nodeName;Xt("PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?o=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){Xt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Xt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Re.Composite=Qc;Re.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Re.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Re.prototype.GetterByBindingType=[Re.prototype._getValue_direct,Re.prototype._getValue_array,Re.prototype._getValue_arrayElement,Re.prototype._getValue_toArray];Re.prototype.SetterByBindingTypeAndVersioning=[[Re.prototype._setValue_direct,Re.prototype._setValue_direct_setNeedsUpdate,Re.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Re.prototype._setValue_array,Re.prototype._setValue_array_setNeedsUpdate,Re.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Re.prototype._setValue_arrayElement,Re.prototype._setValue_arrayElement_setNeedsUpdate,Re.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Re.prototype._setValue_fromArray,Re.prototype._setValue_fromArray_setNeedsUpdate,Re.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Zx=new Float32Array(1);var br=class{constructor(t=1,e=0,n=0){this.radius=t,this.phi=e,this.theta=n}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=oe(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(oe(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var Dh=class Dh{constructor(t,e,n,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,s){let r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=s,this}};Dh.prototype.isMatrix2=!0;var th=Dh;var fa=class extends ii{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){if(t===void 0){Ht("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}};function wh(i,t,e,n){let s=Fp(n);switch(e){case _h:return i*t;case vh:return i*t/s.components*s.byteLength;case sl:return i*t/s.components*s.byteLength;case us:return i*t*2/s.components*s.byteLength;case rl:return i*t*2/s.components*s.byteLength;case xh:return i*t*3/s.components*s.byteLength;case $n:return i*t*4/s.components*s.byteLength;case al:return i*t*4/s.components*s.byteLength;case _a:case xa:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case va:case ya:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ll:case hl:return Math.max(i,16)*Math.max(t,8)/4;case ol:case cl:return Math.max(i,8)*Math.max(t,8)/2;case ul:case dl:case pl:case ml:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case fl:case Ma:case gl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case _l:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case xl:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case vl:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case yl:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Ml:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case bl:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Sl:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case El:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Tl:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Al:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case wl:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Cl:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Rl:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Pl:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Il:case Dl:case Ll:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Nl:case Ul:return Math.ceil(i/4)*Math.ceil(t/4)*8;case ba:case Fl:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Fp(i){switch(i){case Sn:case fh:return{byteLength:1,components:1};case Tr:case ph:case Zn:return{byteLength:2,components:1};case nl:case il:return{byteLength:2,components:4};case ai:case el:case oi:return{byteLength:4,components:1};case mh:case gh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"185"}}));typeof window<"u"&&(window.__THREE__?Ht("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="185");function lf(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&i!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Bp(i){let t=new WeakMap;function e(o,c){let l=o.array,d=o.usage,m=l.byteLength,h=i.createBuffer();i.bindBuffer(c,h),i.bufferData(c,l,d),o.onUploadCallback();let _;if(l instanceof Float32Array)_=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)_=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?_=i.HALF_FLOAT:_=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)_=i.SHORT;else if(l instanceof Uint32Array)_=i.UNSIGNED_INT;else if(l instanceof Int32Array)_=i.INT;else if(l instanceof Int8Array)_=i.BYTE;else if(l instanceof Uint8Array)_=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)_=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:h,type:_,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:m}}function n(o,c,l){let d=c.array,m=c.updateRanges;if(i.bindBuffer(l,o),m.length===0)i.bufferSubData(l,0,d);else{m.sort((_,p)=>_.start-p.start);let h=0;for(let _=1;_<m.length;_++){let p=m[h],S=m[_];S.start<=p.start+p.count+1?p.count=Math.max(p.count,S.start+S.count-p.start):(++h,m[h]=S)}m.length=h+1;for(let _=0,p=m.length;_<p;_++){let S=m[_];i.bufferSubData(l,S.start*d.BYTES_PER_ELEMENT,d,S.start,S.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let c=t.get(o);c&&(i.deleteBuffer(c.buffer),t.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let d=t.get(o);(!d||d.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var zp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Vp=`#ifdef USE_ALPHAHASH
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
#endif`,kp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Hp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Gp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Wp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Xp=`#ifdef USE_AOMAP
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
#endif`,qp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Yp=`#ifdef USE_BATCHING
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
#endif`,Zp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,$p=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Jp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Kp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,jp=`#ifdef USE_IRIDESCENCE
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
#endif`,Qp=`#ifdef USE_BUMPMAP
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
#endif`,tm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,em=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,nm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,im=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,sm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,rm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,am=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,om=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,lm=`#define PI 3.141592653589793
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
} // validated`,cm=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,hm=`vec3 transformedNormal = objectNormal;
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
#endif`,um=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,dm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,fm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,pm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,mm="gl_FragColor = linearToOutputTexel( gl_FragColor );",gm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,_m=`#ifdef USE_ENVMAP
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
#endif`,xm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,vm=`#ifdef USE_ENVMAP
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
#endif`,ym=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Mm=`#ifdef USE_ENVMAP
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
#endif`,bm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Sm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Em=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Tm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Am=`#ifdef USE_GRADIENTMAP
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
}`,wm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Cm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Rm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Pm=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,Im=`#ifdef USE_ENVMAP
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
#endif`,Dm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Lm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Nm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Um=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Fm=`PhysicalMaterial material;
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
#endif`,Om=`uniform sampler2D dfgLUT;
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
}`,Bm=`
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
#endif`,zm=`#if defined( RE_IndirectDiffuse )
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
#endif`,Vm=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,km=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,Hm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Gm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Wm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Xm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,qm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Ym=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Zm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,$m=`#if defined( USE_POINTS_UV )
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
#endif`,Jm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Km=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,jm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Qm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,tg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,eg=`#ifdef USE_MORPHTARGETS
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
#endif`,ng=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ig=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,sg=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,rg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ag=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,og=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,lg=`#ifdef USE_NORMALMAP
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
#endif`,cg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,hg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,ug=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,dg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,fg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,pg=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,mg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,gg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,_g=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,xg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,vg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,yg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Mg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,bg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Sg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Eg=`float getShadowMask() {
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
}`,Tg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ag=`#ifdef USE_SKINNING
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
#endif`,wg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Cg=`#ifdef USE_SKINNING
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
#endif`,Rg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Pg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Ig=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Dg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Lg=`#ifdef USE_TRANSMISSION
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
#endif`,Ng=`#ifdef USE_TRANSMISSION
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
#endif`,Ug=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Fg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Og=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Bg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,zg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Vg=`uniform sampler2D t2D;
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
}`,kg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Hg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Gg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Wg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Xg=`#include <common>
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
}`,qg=`#if DEPTH_PACKING == 3200
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
}`,Yg=`#define DISTANCE
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
}`,Zg=`#define DISTANCE
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
}`,$g=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Jg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Kg=`uniform float scale;
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
}`,jg=`uniform vec3 diffuse;
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
}`,Qg=`#include <common>
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
}`,t0=`uniform vec3 diffuse;
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
}`,e0=`#define LAMBERT
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
}`,n0=`#define LAMBERT
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
}`,i0=`#define MATCAP
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
}`,s0=`#define MATCAP
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
}`,r0=`#define NORMAL
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
}`,a0=`#define NORMAL
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
}`,o0=`#define PHONG
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
}`,l0=`#define PHONG
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
}`,c0=`#define STANDARD
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
}`,h0=`#define STANDARD
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
}`,u0=`#define TOON
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
}`,d0=`#define TOON
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
}`,f0=`uniform float size;
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
}`,p0=`uniform vec3 diffuse;
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
}`,m0=`#include <common>
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
}`,g0=`uniform vec3 color;
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
}`,_0=`uniform float rotation;
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
}`,x0=`uniform vec3 diffuse;
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
}`,ie={alphahash_fragment:zp,alphahash_pars_fragment:Vp,alphamap_fragment:kp,alphamap_pars_fragment:Hp,alphatest_fragment:Gp,alphatest_pars_fragment:Wp,aomap_fragment:Xp,aomap_pars_fragment:qp,batching_pars_vertex:Yp,batching_vertex:Zp,begin_vertex:$p,beginnormal_vertex:Jp,bsdfs:Kp,iridescence_fragment:jp,bumpmap_pars_fragment:Qp,clipping_planes_fragment:tm,clipping_planes_pars_fragment:em,clipping_planes_pars_vertex:nm,clipping_planes_vertex:im,color_fragment:sm,color_pars_fragment:rm,color_pars_vertex:am,color_vertex:om,common:lm,cube_uv_reflection_fragment:cm,defaultnormal_vertex:hm,displacementmap_pars_vertex:um,displacementmap_vertex:dm,emissivemap_fragment:fm,emissivemap_pars_fragment:pm,colorspace_fragment:mm,colorspace_pars_fragment:gm,envmap_fragment:_m,envmap_common_pars_fragment:xm,envmap_pars_fragment:vm,envmap_pars_vertex:ym,envmap_physical_pars_fragment:Im,envmap_vertex:Mm,fog_vertex:bm,fog_pars_vertex:Sm,fog_fragment:Em,fog_pars_fragment:Tm,gradientmap_pars_fragment:Am,lightmap_pars_fragment:wm,lights_lambert_fragment:Cm,lights_lambert_pars_fragment:Rm,lights_pars_begin:Pm,lights_toon_fragment:Dm,lights_toon_pars_fragment:Lm,lights_phong_fragment:Nm,lights_phong_pars_fragment:Um,lights_physical_fragment:Fm,lights_physical_pars_fragment:Om,lights_fragment_begin:Bm,lights_fragment_maps:zm,lights_fragment_end:Vm,lightprobes_pars_fragment:km,logdepthbuf_fragment:Hm,logdepthbuf_pars_fragment:Gm,logdepthbuf_pars_vertex:Wm,logdepthbuf_vertex:Xm,map_fragment:qm,map_pars_fragment:Ym,map_particle_fragment:Zm,map_particle_pars_fragment:$m,metalnessmap_fragment:Jm,metalnessmap_pars_fragment:Km,morphinstance_vertex:jm,morphcolor_vertex:Qm,morphnormal_vertex:tg,morphtarget_pars_vertex:eg,morphtarget_vertex:ng,normal_fragment_begin:ig,normal_fragment_maps:sg,normal_pars_fragment:rg,normal_pars_vertex:ag,normal_vertex:og,normalmap_pars_fragment:lg,clearcoat_normal_fragment_begin:cg,clearcoat_normal_fragment_maps:hg,clearcoat_pars_fragment:ug,iridescence_pars_fragment:dg,opaque_fragment:fg,packing:pg,premultiplied_alpha_fragment:mg,project_vertex:gg,dithering_fragment:_g,dithering_pars_fragment:xg,roughnessmap_fragment:vg,roughnessmap_pars_fragment:yg,shadowmap_pars_fragment:Mg,shadowmap_pars_vertex:bg,shadowmap_vertex:Sg,shadowmask_pars_fragment:Eg,skinbase_vertex:Tg,skinning_pars_vertex:Ag,skinning_vertex:wg,skinnormal_vertex:Cg,specularmap_fragment:Rg,specularmap_pars_fragment:Pg,tonemapping_fragment:Ig,tonemapping_pars_fragment:Dg,transmission_fragment:Lg,transmission_pars_fragment:Ng,uv_pars_fragment:Ug,uv_pars_vertex:Fg,uv_vertex:Og,worldpos_vertex:Bg,background_vert:zg,background_frag:Vg,backgroundCube_vert:kg,backgroundCube_frag:Hg,cube_vert:Gg,cube_frag:Wg,depth_vert:Xg,depth_frag:qg,distance_vert:Yg,distance_frag:Zg,equirect_vert:$g,equirect_frag:Jg,linedashed_vert:Kg,linedashed_frag:jg,meshbasic_vert:Qg,meshbasic_frag:t0,meshlambert_vert:e0,meshlambert_frag:n0,meshmatcap_vert:i0,meshmatcap_frag:s0,meshnormal_vert:r0,meshnormal_frag:a0,meshphong_vert:o0,meshphong_frag:l0,meshphysical_vert:c0,meshphysical_frag:h0,meshtoon_vert:u0,meshtoon_frag:d0,points_vert:f0,points_frag:p0,shadow_vert:m0,shadow_frag:g0,sprite_vert:_0,sprite_frag:x0},wt={common:{diffuse:{value:new zt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Jt}},envmap:{envMap:{value:null},envMapRotation:{value:new Jt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Jt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Jt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Jt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Jt},normalScale:{value:new $t(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Jt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Jt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Jt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Jt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new zt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new F},probesMax:{value:new F},probesResolution:{value:new F}},points:{diffuse:{value:new zt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0},uvTransform:{value:new Jt}},sprite:{diffuse:{value:new zt(16777215)},opacity:{value:1},center:{value:new $t(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}}},Mi={basic:{uniforms:_n([wt.common,wt.specularmap,wt.envmap,wt.aomap,wt.lightmap,wt.fog]),vertexShader:ie.meshbasic_vert,fragmentShader:ie.meshbasic_frag},lambert:{uniforms:_n([wt.common,wt.specularmap,wt.envmap,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.fog,wt.lights,{emissive:{value:new zt(0)},envMapIntensity:{value:1}}]),vertexShader:ie.meshlambert_vert,fragmentShader:ie.meshlambert_frag},phong:{uniforms:_n([wt.common,wt.specularmap,wt.envmap,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.fog,wt.lights,{emissive:{value:new zt(0)},specular:{value:new zt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ie.meshphong_vert,fragmentShader:ie.meshphong_frag},standard:{uniforms:_n([wt.common,wt.envmap,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.roughnessmap,wt.metalnessmap,wt.fog,wt.lights,{emissive:{value:new zt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ie.meshphysical_vert,fragmentShader:ie.meshphysical_frag},toon:{uniforms:_n([wt.common,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.gradientmap,wt.fog,wt.lights,{emissive:{value:new zt(0)}}]),vertexShader:ie.meshtoon_vert,fragmentShader:ie.meshtoon_frag},matcap:{uniforms:_n([wt.common,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.fog,{matcap:{value:null}}]),vertexShader:ie.meshmatcap_vert,fragmentShader:ie.meshmatcap_frag},points:{uniforms:_n([wt.points,wt.fog]),vertexShader:ie.points_vert,fragmentShader:ie.points_frag},dashed:{uniforms:_n([wt.common,wt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ie.linedashed_vert,fragmentShader:ie.linedashed_frag},depth:{uniforms:_n([wt.common,wt.displacementmap]),vertexShader:ie.depth_vert,fragmentShader:ie.depth_frag},normal:{uniforms:_n([wt.common,wt.bumpmap,wt.normalmap,wt.displacementmap,{opacity:{value:1}}]),vertexShader:ie.meshnormal_vert,fragmentShader:ie.meshnormal_frag},sprite:{uniforms:_n([wt.sprite,wt.fog]),vertexShader:ie.sprite_vert,fragmentShader:ie.sprite_frag},background:{uniforms:{uvTransform:{value:new Jt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ie.background_vert,fragmentShader:ie.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Jt}},vertexShader:ie.backgroundCube_vert,fragmentShader:ie.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ie.cube_vert,fragmentShader:ie.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ie.equirect_vert,fragmentShader:ie.equirect_frag},distance:{uniforms:_n([wt.common,wt.displacementmap,{referencePosition:{value:new F},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ie.distance_vert,fragmentShader:ie.distance_frag},shadow:{uniforms:_n([wt.lights,wt.fog,{color:{value:new zt(0)},opacity:{value:1}}]),vertexShader:ie.shadow_vert,fragmentShader:ie.shadow_frag}};Mi.physical={uniforms:_n([Mi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Jt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Jt},clearcoatNormalScale:{value:new $t(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Jt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Jt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Jt},sheen:{value:0},sheenColor:{value:new zt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Jt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Jt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Jt},transmissionSamplerSize:{value:new $t},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Jt},attenuationDistance:{value:0},attenuationColor:{value:new zt(0)},specularColor:{value:new zt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Jt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Jt},anisotropyVector:{value:new $t},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Jt}}]),vertexShader:ie.meshphysical_vert,fragmentShader:ie.meshphysical_frag};var zl={r:0,b:0,g:0},v0=new Ue,cf=new Jt;cf.set(-1,0,0,0,1,0,0,0,1);function y0(i,t,e,n,s,r){let a=new zt(0),o=s===!0?0:1,c,l,d=null,m=0,h=null;function _(A){let I=A.isScene===!0?A.background:null;if(I&&I.isTexture){let E=A.backgroundBlurriness>0;I=t.get(I,E)}return I}function p(A){let I=!1,E=_(A);E===null?x(a,o):E&&E.isColor&&(x(E,1),I=!0);let R=i.xr.getEnvironmentBlendMode();R==="additive"?e.buffers.color.setClear(0,0,0,1,r):R==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(i.autoClear||I)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function S(A,I){let E=_(I);E&&(E.isCubeTexture||E.mapping===ma)?(l===void 0&&(l=new Ke(new Mr(1,1,1),new Se({name:"BackgroundCubeMaterial",uniforms:Ls(Mi.backgroundCube.uniforms),vertexShader:Mi.backgroundCube.vertexShader,fragmentShader:Mi.backgroundCube.fragmentShader,side:cn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(R,w,L){this.matrixWorld.copyPosition(L.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(l)),l.material.uniforms.envMap.value=E,l.material.uniforms.backgroundBlurriness.value=I.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=I.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(v0.makeRotationFromEuler(I.backgroundRotation)).transpose(),E.isCubeTexture&&E.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(cf),l.material.toneMapped=de.getTransfer(E.colorSpace)!==ve,(d!==E||m!==E.version||h!==i.toneMapping)&&(l.material.needsUpdate=!0,d=E,m=E.version,h=i.toneMapping),l.layers.enableAll(),A.unshift(l,l.geometry,l.material,0,0,null)):E&&E.isTexture&&(c===void 0&&(c=new Ke(new _i(2,2),new Se({name:"BackgroundMaterial",uniforms:Ls(Mi.background.uniforms),vertexShader:Mi.background.vertexShader,fragmentShader:Mi.background.fragmentShader,side:Ui,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=E,c.material.uniforms.backgroundIntensity.value=I.backgroundIntensity,c.material.toneMapped=de.getTransfer(E.colorSpace)!==ve,E.matrixAutoUpdate===!0&&E.updateMatrix(),c.material.uniforms.uvTransform.value.copy(E.matrix),(d!==E||m!==E.version||h!==i.toneMapping)&&(c.material.needsUpdate=!0,d=E,m=E.version,h=i.toneMapping),c.layers.enableAll(),A.unshift(c,c.geometry,c.material,0,0,null))}function x(A,I){A.getRGB(zl,Eh(i)),e.buffers.color.setClear(zl.r,zl.g,zl.b,I,r)}function f(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(A,I=1){a.set(A),o=I,x(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(A){o=A,x(a,o)},render:p,addToRenderList:S,dispose:f}}function M0(i,t){let e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=h(null),r=s,a=!1;function o(O,W,z,it,G){let et=!1,K=m(O,it,z,W);r!==K&&(r=K,l(r.object)),et=_(O,it,z,G),et&&p(O,it,z,G),G!==null&&t.update(G,i.ELEMENT_ARRAY_BUFFER),(et||a)&&(a=!1,E(O,W,z,it),G!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(G).buffer))}function c(){return i.createVertexArray()}function l(O){return i.bindVertexArray(O)}function d(O){return i.deleteVertexArray(O)}function m(O,W,z,it){let G=it.wireframe===!0,et=n[W.id];et===void 0&&(et={},n[W.id]=et);let K=O.isInstancedMesh===!0?O.id:0,rt=et[K];rt===void 0&&(rt={},et[K]=rt);let lt=rt[z.id];lt===void 0&&(lt={},rt[z.id]=lt);let mt=lt[G];return mt===void 0&&(mt=h(c()),lt[G]=mt),mt}function h(O){let W=[],z=[],it=[];for(let G=0;G<e;G++)W[G]=0,z[G]=0,it[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:W,enabledAttributes:z,attributeDivisors:it,object:O,attributes:{},index:null}}function _(O,W,z,it){let G=r.attributes,et=W.attributes,K=0,rt=z.getAttributes();for(let lt in rt)if(rt[lt].location>=0){let St=G[lt],xt=et[lt];if(xt===void 0&&(lt==="instanceMatrix"&&O.instanceMatrix&&(xt=O.instanceMatrix),lt==="instanceColor"&&O.instanceColor&&(xt=O.instanceColor)),St===void 0||St.attribute!==xt||xt&&St.data!==xt.data)return!0;K++}return r.attributesNum!==K||r.index!==it}function p(O,W,z,it){let G={},et=W.attributes,K=0,rt=z.getAttributes();for(let lt in rt)if(rt[lt].location>=0){let St=et[lt];St===void 0&&(lt==="instanceMatrix"&&O.instanceMatrix&&(St=O.instanceMatrix),lt==="instanceColor"&&O.instanceColor&&(St=O.instanceColor));let xt={};xt.attribute=St,St&&St.data&&(xt.data=St.data),G[lt]=xt,K++}r.attributes=G,r.attributesNum=K,r.index=it}function S(){let O=r.newAttributes;for(let W=0,z=O.length;W<z;W++)O[W]=0}function x(O){f(O,0)}function f(O,W){let z=r.newAttributes,it=r.enabledAttributes,G=r.attributeDivisors;z[O]=1,it[O]===0&&(i.enableVertexAttribArray(O),it[O]=1),G[O]!==W&&(i.vertexAttribDivisor(O,W),G[O]=W)}function A(){let O=r.newAttributes,W=r.enabledAttributes;for(let z=0,it=W.length;z<it;z++)W[z]!==O[z]&&(i.disableVertexAttribArray(z),W[z]=0)}function I(O,W,z,it,G,et,K){K===!0?i.vertexAttribIPointer(O,W,z,G,et):i.vertexAttribPointer(O,W,z,it,G,et)}function E(O,W,z,it){S();let G=it.attributes,et=z.getAttributes(),K=W.defaultAttributeValues;for(let rt in et){let lt=et[rt];if(lt.location>=0){let mt=G[rt];if(mt===void 0&&(rt==="instanceMatrix"&&O.instanceMatrix&&(mt=O.instanceMatrix),rt==="instanceColor"&&O.instanceColor&&(mt=O.instanceColor)),mt!==void 0){let St=mt.normalized,xt=mt.itemSize,le=t.get(mt);if(le===void 0)continue;let ye=le.buffer,re=le.type,J=le.bytesPerElement,ht=re===i.INT||re===i.UNSIGNED_INT||mt.gpuType===el;if(mt.isInterleavedBufferAttribute){let ut=mt.data,Rt=ut.stride,qt=mt.offset;if(ut.isInstancedInterleavedBuffer){for(let Gt=0;Gt<lt.locationSize;Gt++)f(lt.location+Gt,ut.meshPerAttribute);O.isInstancedMesh!==!0&&it._maxInstanceCount===void 0&&(it._maxInstanceCount=ut.meshPerAttribute*ut.count)}else for(let Gt=0;Gt<lt.locationSize;Gt++)x(lt.location+Gt);i.bindBuffer(i.ARRAY_BUFFER,ye);for(let Gt=0;Gt<lt.locationSize;Gt++)I(lt.location+Gt,xt/lt.locationSize,re,St,Rt*J,(qt+xt/lt.locationSize*Gt)*J,ht)}else{if(mt.isInstancedBufferAttribute){for(let ut=0;ut<lt.locationSize;ut++)f(lt.location+ut,mt.meshPerAttribute);O.isInstancedMesh!==!0&&it._maxInstanceCount===void 0&&(it._maxInstanceCount=mt.meshPerAttribute*mt.count)}else for(let ut=0;ut<lt.locationSize;ut++)x(lt.location+ut);i.bindBuffer(i.ARRAY_BUFFER,ye);for(let ut=0;ut<lt.locationSize;ut++)I(lt.location+ut,xt/lt.locationSize,re,St,xt*J,xt/lt.locationSize*ut*J,ht)}}else if(K!==void 0){let St=K[rt];if(St!==void 0)switch(St.length){case 2:i.vertexAttrib2fv(lt.location,St);break;case 3:i.vertexAttrib3fv(lt.location,St);break;case 4:i.vertexAttrib4fv(lt.location,St);break;default:i.vertexAttrib1fv(lt.location,St)}}}}A()}function R(){C();for(let O in n){let W=n[O];for(let z in W){let it=W[z];for(let G in it){let et=it[G];for(let K in et)d(et[K].object),delete et[K];delete it[G]}}delete n[O]}}function w(O){if(n[O.id]===void 0)return;let W=n[O.id];for(let z in W){let it=W[z];for(let G in it){let et=it[G];for(let K in et)d(et[K].object),delete et[K];delete it[G]}}delete n[O.id]}function L(O){for(let W in n){let z=n[W];for(let it in z){let G=z[it];if(G[O.id]===void 0)continue;let et=G[O.id];for(let K in et)d(et[K].object),delete et[K];delete G[O.id]}}}function v(O){for(let W in n){let z=n[W],it=O.isInstancedMesh===!0?O.id:0,G=z[it];if(G!==void 0){for(let et in G){let K=G[et];for(let rt in K)d(K[rt].object),delete K[rt];delete G[et]}delete z[it],Object.keys(z).length===0&&delete n[W]}}}function C(){V(),a=!0,r!==s&&(r=s,l(r.object))}function V(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:C,resetDefaultState:V,dispose:R,releaseStatesOfGeometry:w,releaseStatesOfObject:v,releaseStatesOfProgram:L,initAttributes:S,enableAttribute:x,disableUnusedAttributes:A}}function b0(i,t,e){let n;function s(c){n=c}function r(c,l){i.drawArrays(n,c,l),e.update(l,n,1)}function a(c,l,d){d!==0&&(i.drawArraysInstanced(n,c,l,d),e.update(l,n,d))}function o(c,l,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,l,0,d);let h=0;for(let _=0;_<d;_++)h+=l[_];e.update(h,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function S0(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let L=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(L.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(L){return!(L!==$n&&n.convert(L)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(L){let v=L===Zn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(L!==Sn&&n.convert(L)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&L!==oi&&!v)}function c(L){if(L==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";L="mediump"}return L==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp",d=c(l);d!==l&&(Ht("WebGLRenderer:",l,"not supported, using",d,"instead."),l=d);let m=e.logarithmicDepthBuffer===!0,h=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&h===!1&&Ht("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let _=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),S=i.getParameter(i.MAX_TEXTURE_SIZE),x=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),A=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),I=i.getParameter(i.MAX_VARYING_VECTORS),E=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),R=i.getParameter(i.MAX_SAMPLES),w=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:m,reversedDepthBuffer:h,maxTextures:_,maxVertexTextures:p,maxTextureSize:S,maxCubemapSize:x,maxAttributes:f,maxVertexUniforms:A,maxVaryings:I,maxFragmentUniforms:E,maxSamples:R,samples:w}}function E0(i){let t=this,e=null,n=0,s=!1,r=!1,a=new Yn,o=new Jt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(m,h){let _=m.length!==0||h||n!==0||s;return s=h,n=m.length,_},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(m,h){e=d(m,h,0)},this.setState=function(m,h,_){let p=m.clippingPlanes,S=m.clipIntersection,x=m.clipShadows,f=i.get(m);if(!s||p===null||p.length===0||r&&!x)r?d(null):l();else{let A=r?0:n,I=A*4,E=f.clippingState||null;c.value=E,E=d(p,h,I,_);for(let R=0;R!==I;++R)E[R]=e[R];f.clippingState=E,this.numIntersection=S?this.numPlanes:0,this.numPlanes+=A}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function d(m,h,_,p){let S=m!==null?m.length:0,x=null;if(S!==0){if(x=c.value,p!==!0||x===null){let f=_+S*4,A=h.matrixWorldInverse;o.getNormalMatrix(A),(x===null||x.length<f)&&(x=new Float32Array(f));for(let I=0,E=_;I!==S;++I,E+=4)a.copy(m[I]).applyMatrix4(A,o),a.normal.toArray(x,E),x[E+3]=a.constant}c.value=x,c.needsUpdate=!0}return t.numPlanes=S,t.numIntersection=0,x}}var ds=4,zd=[.125,.215,.35,.446,.526,.582],Ns=20,T0=256,Sa=new Ps,Vd=new zt,Lh=null,Nh=0,Uh=0,Fh=!1,A0=new F,kl=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,s=100,r={}){let{size:a=256,position:o=A0}=r;Lh=this._renderer.getRenderTarget(),Nh=this._renderer.getActiveCubeFace(),Uh=this._renderer.getActiveMipmapLevel(),Fh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,n,s,c,o),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Gd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Hd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(Lh,Nh,Uh),this._renderer.xr.enabled=Fh,t.scissorTest=!1,Cr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===cs||t.mapping===Ds?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Lh=this._renderer.getRenderTarget(),Nh=this._renderer.getActiveCubeFace(),Uh=this._renderer.getActiveMipmapLevel(),Fh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Ne,minFilter:Ne,generateMipmaps:!1,type:Zn,format:$n,colorSpace:jr,depthBuffer:!1},s=kd(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=kd(t,e,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=w0(r)),this._blurMaterial=R0(r,t,e),this._ggxMaterial=C0(r,t,e)}return s}_compileMaterial(t){let e=new Ke(new Ae,t);this._renderer.compile(e,Sa)}_sceneToCubeUV(t,e,n,s,r){let c=new mn(90,1,e,n),l=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],m=this._renderer,h=m.autoClear,_=m.toneMapping;m.getClearColor(Vd),m.toneMapping=si,m.autoClear=!1,m.state.buffers.depth.getReversed()&&(m.setRenderTarget(s),m.clearDepth(),m.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Ke(new Mr,new aa({name:"PMREM.Background",side:cn,depthWrite:!1,depthTest:!1})));let S=this._backgroundBox,x=S.material,f=!1,A=t.background;A?A.isColor&&(x.color.copy(A),t.background=null,f=!0):(x.color.copy(Vd),f=!0);for(let I=0;I<6;I++){let E=I%3;E===0?(c.up.set(0,l[I],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+d[I],r.y,r.z)):E===1?(c.up.set(0,0,l[I]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+d[I],r.z)):(c.up.set(0,l[I],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+d[I]));let R=this._cubeSize;Cr(s,E*R,I>2?R:0,R,R),m.setRenderTarget(s),f&&m.render(S,c),m.render(t,c)}m.toneMapping=_,m.autoClear=h,t.background=A}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===cs||t.mapping===Ds;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Gd()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Hd());let r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=t;let c=this._cubeSize;Cr(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,Sa)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){let s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let c=a.uniforms,l=n/(this._lodMeshes.length-1),d=e/(this._lodMeshes.length-1),m=Math.sqrt(l*l-d*d),h=0+l*1.25,_=m*h,{_lodMax:p}=this,S=this._sizeLods[n],x=3*S*(n>p-ds?n-p+ds:0),f=4*(this._cubeSize-S);c.envMap.value=t.texture,c.roughness.value=_,c.mipInt.value=p-e,Cr(r,x,f,3*S,2*S),s.setRenderTarget(r),s.render(o,Sa),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=p-n,Cr(t,x,f,3*S,2*S),s.setRenderTarget(t),s.render(o,Sa)}_blur(t,e,n,s,r){let a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){let c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Xt("blur direction must be either latitudinal or longitudinal!");let d=3,m=this._lodMeshes[s];m.material=l;let h=l.uniforms,_=this._sizeLods[n]-1,p=isFinite(r)?Math.PI/(2*_):2*Math.PI/(2*Ns-1),S=r/p,x=isFinite(r)?1+Math.floor(d*S):Ns;x>Ns&&Ht(`sigmaRadians, ${r}, is too large and will clip, as it requested ${x} samples when the maximum is set to ${Ns}`);let f=[],A=0;for(let L=0;L<Ns;++L){let v=L/S,C=Math.exp(-v*v/2);f.push(C),L===0?A+=C:L<x&&(A+=2*C)}for(let L=0;L<f.length;L++)f[L]=f[L]/A;h.envMap.value=t.texture,h.samples.value=x,h.weights.value=f,h.latitudinal.value=a==="latitudinal",o&&(h.poleAxis.value=o);let{_lodMax:I}=this;h.dTheta.value=p,h.mipInt.value=I-n;let E=this._sizeLods[s],R=3*E*(s>I-ds?s-I+ds:0),w=4*(this._cubeSize-E);Cr(e,R,w,3*E,2*E),c.setRenderTarget(e),c.render(m,Sa)}};function w0(i){let t=[],e=[],n=[],s=i,r=i-ds+1+zd.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);t.push(o);let c=1/o;a>i-ds?c=zd[a-i+ds-1]:a===0&&(c=0),e.push(c);let l=1/(o-2),d=-l,m=1+l,h=[d,d,m,d,m,m,d,d,m,m,d,m],_=6,p=6,S=3,x=2,f=1,A=new Float32Array(S*p*_),I=new Float32Array(x*p*_),E=new Float32Array(f*p*_);for(let w=0;w<_;w++){let L=w%3*2/3-1,v=w>2?0:-1,C=[L,v,0,L+2/3,v,0,L+2/3,v+1,0,L,v,0,L+2/3,v+1,0,L,v+1,0];A.set(C,S*p*w),I.set(h,x*p*w);let V=[w,w,w,w,w,w];E.set(V,f*p*w)}let R=new Ae;R.setAttribute("position",new Qt(A,S)),R.setAttribute("uv",new Qt(I,x)),R.setAttribute("faceIndex",new Qt(E,f)),n.push(new Ke(R,null)),s>ds&&s--}return{lodMeshes:n,sizeLods:t,sigmas:e}}function kd(i,t,e){let n=new gn(i,t,e);return n.texture.mapping=ma,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Cr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function C0(i,t,e){return new Se({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:T0,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Wl(),fragmentShader:`

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
		`,blending:xi,depthTest:!1,depthWrite:!1})}function R0(i,t,e){let n=new Float32Array(Ns),s=new F(0,1,0);return new Se({name:"SphericalGaussianBlur",defines:{n:Ns,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Wl(),fragmentShader:`

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
		`,blending:xi,depthTest:!1,depthWrite:!1})}function Hd(){return new Se({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Wl(),fragmentShader:`

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
		`,blending:xi,depthTest:!1,depthWrite:!1})}function Gd(){return new Se({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Wl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:xi,depthTest:!1,depthWrite:!1})}function Wl(){return`

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
	`}var Hl=class extends gn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new la(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Mr(5,5,5),r=new Se({name:"CubemapFromEquirect",uniforms:Ls(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:cn,blending:xi});r.uniforms.tEquirect.value=e;let a=new Ke(s,r),o=e.minFilter;return e.minFilter===ri&&(e.minFilter=Ne),new $o(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){let r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}};function P0(i){let t=new WeakMap,e=new WeakMap,n=null;function s(h,_=!1){return h==null?null:_?a(h):r(h)}function r(h){if(h&&h.isTexture){let _=h.mapping;if(_===jo||_===Qo)if(t.has(h)){let p=t.get(h).texture;return o(p,h.mapping)}else{let p=h.image;if(p&&p.height>0){let S=new Hl(p.height);return S.fromEquirectangularTexture(i,h),t.set(h,S),h.addEventListener("dispose",l),o(S.texture,h.mapping)}else return null}}return h}function a(h){if(h&&h.isTexture){let _=h.mapping,p=_===jo||_===Qo,S=_===cs||_===Ds;if(p||S){let x=e.get(h),f=x!==void 0?x.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==f)return n===null&&(n=new kl(i)),x=p?n.fromEquirectangular(h,x):n.fromCubemap(h,x),x.texture.pmremVersion=h.pmremVersion,e.set(h,x),x.texture;if(x!==void 0)return x.texture;{let A=h.image;return p&&A&&A.height>0||S&&A&&c(A)?(n===null&&(n=new kl(i)),x=p?n.fromEquirectangular(h):n.fromCubemap(h),x.texture.pmremVersion=h.pmremVersion,e.set(h,x),h.addEventListener("dispose",d),x.texture):null}}}return h}function o(h,_){return _===jo?h.mapping=cs:_===Qo&&(h.mapping=Ds),h}function c(h){let _=0,p=6;for(let S=0;S<p;S++)h[S]!==void 0&&_++;return _===p}function l(h){let _=h.target;_.removeEventListener("dispose",l);let p=t.get(_);p!==void 0&&(t.delete(_),p.dispose())}function d(h){let _=h.target;_.removeEventListener("dispose",d);let p=e.get(_);p!==void 0&&(e.delete(_),p.dispose())}function m(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:m}}function I0(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s=i.getExtension(n);return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let s=e(n);return s===null&&As("WebGLRenderer: "+n+" extension not supported."),s}}}function D0(i,t,e,n){let s={},r=new WeakMap;function a(m){let h=m.target;h.index!==null&&t.remove(h.index);for(let p in h.attributes)t.remove(h.attributes[p]);h.removeEventListener("dispose",a),delete s[h.id];let _=r.get(h);_&&(t.remove(_),r.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,e.memory.geometries--}function o(m,h){return s[h.id]===!0||(h.addEventListener("dispose",a),s[h.id]=!0,e.memory.geometries++),h}function c(m){let h=m.attributes;for(let _ in h)t.update(h[_],i.ARRAY_BUFFER)}function l(m){let h=[],_=m.index,p=m.attributes.position,S=0;if(p===void 0)return;if(_!==null){let A=_.array;S=_.version;for(let I=0,E=A.length;I<E;I+=3){let R=A[I+0],w=A[I+1],L=A[I+2];h.push(R,w,w,L,L,R)}}else{let A=p.array;S=p.version;for(let I=0,E=A.length/3-1;I<E;I+=3){let R=I+0,w=I+1,L=I+2;h.push(R,w,w,L,L,R)}}let x=new(p.count>=65535?ra:sa)(h,1);x.version=S;let f=r.get(m);f&&t.remove(f),r.set(m,x)}function d(m){let h=r.get(m);if(h){let _=m.index;_!==null&&h.version<_.version&&l(m)}else l(m);return r.get(m)}return{get:o,update:c,getWireframeAttribute:d}}function L0(i,t,e){let n;function s(m){n=m}let r,a;function o(m){r=m.type,a=m.bytesPerElement}function c(m,h){i.drawElements(n,h,r,m*a),e.update(h,n,1)}function l(m,h,_){_!==0&&(i.drawElementsInstanced(n,h,r,m*a,_),e.update(h,n,_))}function d(m,h,_){if(_===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,r,m,0,_);let S=0;for(let x=0;x<_;x++)S+=h[x];e.update(S,n,1)}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=d}function N0(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:Xt("WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function U0(i,t,e){let n=new WeakMap,s=new Pe;function r(a,o,c){let l=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,m=d!==void 0?d.length:0,h=n.get(o);if(h===void 0||h.count!==m){let C=function(){L.dispose(),n.delete(o),o.removeEventListener("dispose",C)};h!==void 0&&h.texture.dispose();let _=o.morphAttributes.position!==void 0,p=o.morphAttributes.normal!==void 0,S=o.morphAttributes.color!==void 0,x=o.morphAttributes.position||[],f=o.morphAttributes.normal||[],A=o.morphAttributes.color||[],I=0;_===!0&&(I=1),p===!0&&(I=2),S===!0&&(I=3);let E=o.attributes.position.count*I,R=1;E>t.maxTextureSize&&(R=Math.ceil(E/t.maxTextureSize),E=t.maxTextureSize);let w=new Float32Array(E*R*4*m),L=new na(w,E,R,m);L.type=oi,L.needsUpdate=!0;let v=I*4;for(let V=0;V<m;V++){let O=x[V],W=f[V],z=A[V],it=E*R*4*V;for(let G=0;G<O.count;G++){let et=G*v;_===!0&&(s.fromBufferAttribute(O,G),w[it+et+0]=s.x,w[it+et+1]=s.y,w[it+et+2]=s.z,w[it+et+3]=0),p===!0&&(s.fromBufferAttribute(W,G),w[it+et+4]=s.x,w[it+et+5]=s.y,w[it+et+6]=s.z,w[it+et+7]=0),S===!0&&(s.fromBufferAttribute(z,G),w[it+et+8]=s.x,w[it+et+9]=s.y,w[it+et+10]=s.z,w[it+et+11]=z.itemSize===4?s.w:1)}}h={count:m,texture:L,size:new $t(E,R)},n.set(o,h),o.addEventListener("dispose",C)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let _=0;for(let S=0;S<l.length;S++)_+=l[S];let p=o.morphTargetsRelative?1:1-_;c.getUniforms().setValue(i,"morphTargetBaseInfluence",p),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",h.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:r}}function F0(i,t,e,n,s){let r=new WeakMap;function a(l){let d=s.render.frame,m=l.geometry,h=t.get(l,m);if(r.get(h)!==d&&(t.update(h),r.set(h,d)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==d&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,d))),l.isSkinnedMesh){let _=l.skeleton;r.get(_)!==d&&(_.update(),r.set(_,d))}return h}function o(){r=new WeakMap}function c(l){let d=l.target;d.removeEventListener("dispose",c),n.releaseStatesOfObject(d),e.remove(d.instanceMatrix),d.instanceColor!==null&&e.remove(d.instanceColor)}return{update:a,dispose:o}}var O0={[rh]:"LINEAR_TONE_MAPPING",[ah]:"REINHARD_TONE_MAPPING",[oh]:"CINEON_TONE_MAPPING",[lh]:"ACES_FILMIC_TONE_MAPPING",[hh]:"AGX_TONE_MAPPING",[uh]:"NEUTRAL_TONE_MAPPING",[ch]:"CUSTOM_TONE_MAPPING"};function B0(i,t,e,n,s,r){let a=new gn(t,e,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,depthTexture:s?new Oi(t,e):void 0}),o=new gn(t,e,{type:Zn,depthBuffer:!1,stencilBuffer:!1}),c=new Ae;c.setAttribute("position",new ln([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new ln([0,2,0,0,2,0],2));let l=new Fo({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),d=new Ke(c,l),m=new Ps(-1,1,1,-1,0,1),h=null,_=null,p=!1,S,x=null,f=[],A=!1;this.setSize=function(I,E){a.setSize(I,E),o.setSize(I,E);for(let R=0;R<f.length;R++){let w=f[R];w.setSize&&w.setSize(I,E)}},this.setEffects=function(I){f=I,A=f.length>0&&f[0].isRenderPass===!0;let E=a.width,R=a.height;for(let w=0;w<f.length;w++){let L=f[w];L.setSize&&L.setSize(E,R)}},this.begin=function(I,E){if(p||I.toneMapping===si&&f.length===0)return!1;if(x=E,E!==null){let R=E.width,w=E.height;(a.width!==R||a.height!==w)&&this.setSize(R,w)}return A===!1&&I.setRenderTarget(a),S=I.toneMapping,I.toneMapping=si,!0},this.hasRenderPass=function(){return A},this.end=function(I,E){I.toneMapping=S,p=!0;let R=a,w=o;for(let L=0;L<f.length;L++){let v=f[L];if(v.enabled!==!1&&(v.render(I,w,R,E),v.needsSwap!==!1)){let C=R;R=w,w=C}}if(h!==I.outputColorSpace||_!==I.toneMapping){h=I.outputColorSpace,_=I.toneMapping,l.defines={},de.getTransfer(h)===ve&&(l.defines.SRGB_TRANSFER="");let L=O0[_];L&&(l.defines[L]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=R.texture,I.setRenderTarget(x),I.render(d,m),x=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),c.dispose(),l.dispose()}}var hf=new Mn,zh=new Oi(1,1),uf=new na,df=new Ro,ff=new la,Wd=[],Xd=[],qd=new Float32Array(16),Yd=new Float32Array(9),Zd=new Float32Array(4);function Pr(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=Wd[s];if(r===void 0&&(r=new Float32Array(s),Wd[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function je(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Qe(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Xl(i,t){let e=Xd[t];e===void 0&&(e=new Int32Array(t),Xd[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function z0(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function V0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(je(e,t))return;i.uniform2fv(this.addr,t),Qe(e,t)}}function k0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(je(e,t))return;i.uniform3fv(this.addr,t),Qe(e,t)}}function H0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(je(e,t))return;i.uniform4fv(this.addr,t),Qe(e,t)}}function G0(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(je(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Qe(e,t)}else{if(je(e,n))return;Zd.set(n),i.uniformMatrix2fv(this.addr,!1,Zd),Qe(e,n)}}function W0(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(je(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Qe(e,t)}else{if(je(e,n))return;Yd.set(n),i.uniformMatrix3fv(this.addr,!1,Yd),Qe(e,n)}}function X0(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(je(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Qe(e,t)}else{if(je(e,n))return;qd.set(n),i.uniformMatrix4fv(this.addr,!1,qd),Qe(e,n)}}function q0(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Y0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(je(e,t))return;i.uniform2iv(this.addr,t),Qe(e,t)}}function Z0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(je(e,t))return;i.uniform3iv(this.addr,t),Qe(e,t)}}function $0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(je(e,t))return;i.uniform4iv(this.addr,t),Qe(e,t)}}function J0(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function K0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(je(e,t))return;i.uniform2uiv(this.addr,t),Qe(e,t)}}function j0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(je(e,t))return;i.uniform3uiv(this.addr,t),Qe(e,t)}}function Q0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(je(e,t))return;i.uniform4uiv(this.addr,t),Qe(e,t)}}function t_(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(zh.compareFunction=e.isReversedDepthBuffer()?Bl:Ol,r=zh):r=hf,e.setTexture2D(t||r,s)}function e_(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||df,s)}function n_(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||ff,s)}function i_(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||uf,s)}function s_(i){switch(i){case 5126:return z0;case 35664:return V0;case 35665:return k0;case 35666:return H0;case 35674:return G0;case 35675:return W0;case 35676:return X0;case 5124:case 35670:return q0;case 35667:case 35671:return Y0;case 35668:case 35672:return Z0;case 35669:case 35673:return $0;case 5125:return J0;case 36294:return K0;case 36295:return j0;case 36296:return Q0;case 35678:case 36198:case 36298:case 36306:case 35682:return t_;case 35679:case 36299:case 36307:return e_;case 35680:case 36300:case 36308:case 36293:return n_;case 36289:case 36303:case 36311:case 36292:return i_}}function r_(i,t){i.uniform1fv(this.addr,t)}function a_(i,t){let e=Pr(t,this.size,2);i.uniform2fv(this.addr,e)}function o_(i,t){let e=Pr(t,this.size,3);i.uniform3fv(this.addr,e)}function l_(i,t){let e=Pr(t,this.size,4);i.uniform4fv(this.addr,e)}function c_(i,t){let e=Pr(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function h_(i,t){let e=Pr(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function u_(i,t){let e=Pr(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function d_(i,t){i.uniform1iv(this.addr,t)}function f_(i,t){i.uniform2iv(this.addr,t)}function p_(i,t){i.uniform3iv(this.addr,t)}function m_(i,t){i.uniform4iv(this.addr,t)}function g_(i,t){i.uniform1uiv(this.addr,t)}function __(i,t){i.uniform2uiv(this.addr,t)}function x_(i,t){i.uniform3uiv(this.addr,t)}function v_(i,t){i.uniform4uiv(this.addr,t)}function y_(i,t,e){let n=this.cache,s=t.length,r=Xl(e,s);je(n,r)||(i.uniform1iv(this.addr,r),Qe(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=zh:a=hf;for(let o=0;o!==s;++o)e.setTexture2D(t[o]||a,r[o])}function M_(i,t,e){let n=this.cache,s=t.length,r=Xl(e,s);je(n,r)||(i.uniform1iv(this.addr,r),Qe(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||df,r[a])}function b_(i,t,e){let n=this.cache,s=t.length,r=Xl(e,s);je(n,r)||(i.uniform1iv(this.addr,r),Qe(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||ff,r[a])}function S_(i,t,e){let n=this.cache,s=t.length,r=Xl(e,s);je(n,r)||(i.uniform1iv(this.addr,r),Qe(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||uf,r[a])}function E_(i){switch(i){case 5126:return r_;case 35664:return a_;case 35665:return o_;case 35666:return l_;case 35674:return c_;case 35675:return h_;case 35676:return u_;case 5124:case 35670:return d_;case 35667:case 35671:return f_;case 35668:case 35672:return p_;case 35669:case 35673:return m_;case 5125:return g_;case 36294:return __;case 36295:return x_;case 36296:return v_;case 35678:case 36198:case 36298:case 36306:case 35682:return y_;case 35679:case 36299:case 36307:return M_;case 35680:case 36300:case 36308:case 36293:return b_;case 36289:case 36303:case 36311:case 36292:return S_}}var Vh=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=s_(e.type)}},kh=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=E_(e.type)}},Hh=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(t,e[o.id],n)}}},Oh=/(\w+)(\])?(\[|\.)?/g;function $d(i,t){i.seq.push(t),i.map[t.id]=t}function T_(i,t,e){let n=i.name,s=n.length;for(Oh.lastIndex=0;;){let r=Oh.exec(n),a=Oh.lastIndex,o=r[1],c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){$d(e,l===void 0?new Vh(o,i,t):new kh(o,i,t));break}else{let m=e.map[o];m===void 0&&(m=new Hh(o),$d(e,m)),e=m}}}var Rr=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=t.getActiveUniform(e,a),c=t.getUniformLocation(e,o.name);T_(o,c,this)}let s=[],r=[];for(let a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){let o=e[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let a=t[s];a.id in e&&n.push(a)}return n}};function Jd(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var A_=37297,w_=0;function C_(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}var Kd=new Jt;function R_(i){de._getMatrix(Kd,de.workingColorSpace,i);let t=`mat3( ${Kd.elements.map(e=>e.toFixed(4))} )`;switch(de.getTransfer(i)){case Qr:return[t,"LinearTransferOETF"];case ve:return[t,"sRGBTransferOETF"];default:return Ht("WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function jd(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+C_(i.getShaderSource(t),o)}else return r}function P_(i,t){let e=R_(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}var I_={[rh]:"Linear",[ah]:"Reinhard",[oh]:"Cineon",[lh]:"ACESFilmic",[hh]:"AgX",[uh]:"Neutral",[ch]:"Custom"};function D_(i,t){let e=I_[t];return e===void 0?(Ht("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var Vl=new F;function L_(){de.getLuminanceCoefficients(Vl);let i=Vl.x.toFixed(4),t=Vl.y.toFixed(4),e=Vl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function N_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ta).join(`
`)}function U_(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function F_(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function Ta(i){return i!==""}function Qd(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function tf(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var O_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Gh(i){return i.replace(O_,z_)}var B_=new Map;function z_(i,t){let e=ie[t];if(e===void 0){let n=B_.get(t);if(n!==void 0)e=ie[n],Ht('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return Gh(e)}var V_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ef(i){return i.replace(V_,k_)}function k_(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function nf(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}var H_={[pa]:"SHADOWMAP_TYPE_PCF",[Sr]:"SHADOWMAP_TYPE_VSM"};function G_(i){return H_[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var W_={[cs]:"ENVMAP_TYPE_CUBE",[Ds]:"ENVMAP_TYPE_CUBE",[ma]:"ENVMAP_TYPE_CUBE_UV"};function X_(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":W_[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var q_={[Ds]:"ENVMAP_MODE_REFRACTION"};function Y_(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":q_[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var Z_={[sh]:"ENVMAP_BLENDING_MULTIPLY",[Md]:"ENVMAP_BLENDING_MIX",[bd]:"ENVMAP_BLENDING_ADD"};function $_(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":Z_[i.combine]||"ENVMAP_BLENDING_NONE"}function J_(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function K_(i,t,e,n){let s=i.getContext(),r=e.defines,a=e.vertexShader,o=e.fragmentShader,c=G_(e),l=X_(e),d=Y_(e),m=$_(e),h=J_(e),_=N_(e),p=U_(r),S=s.createProgram(),x,f,A=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(x=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Ta).join(`
`),x.length>0&&(x+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Ta).join(`
`),f.length>0&&(f+=`
`)):(x=[nf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+d:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ta).join(`
`),f=[nf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+d:"",e.envMap?"#define "+m:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==si?"#define TONE_MAPPING":"",e.toneMapping!==si?ie.tonemapping_pars_fragment:"",e.toneMapping!==si?D_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ie.colorspace_pars_fragment,P_("linearToOutputTexel",e.outputColorSpace),L_(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ta).join(`
`)),a=Gh(a),a=Qd(a,e),a=tf(a,e),o=Gh(o),o=Qd(o,e),o=tf(o,e),a=ef(a),o=ef(o),e.isRawShaderMaterial!==!0&&(A=`#version 300 es
`,x=[_,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,f=["#define varying in",e.glslVersion===Mh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Mh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let I=A+x+a,E=A+f+o,R=Jd(s,s.VERTEX_SHADER,I),w=Jd(s,s.FRAGMENT_SHADER,E);s.attachShader(S,R),s.attachShader(S,w),e.index0AttributeName!==void 0?s.bindAttribLocation(S,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(S,0,"position"),s.linkProgram(S);function L(O){if(i.debug.checkShaderErrors){let W=s.getProgramInfoLog(S)||"",z=s.getShaderInfoLog(R)||"",it=s.getShaderInfoLog(w)||"",G=W.trim(),et=z.trim(),K=it.trim(),rt=!0,lt=!0;if(s.getProgramParameter(S,s.LINK_STATUS)===!1)if(rt=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,S,R,w);else{let mt=jd(s,R,"vertex"),St=jd(s,w,"fragment");Xt("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(S,s.VALIDATE_STATUS)+`

Material Name: `+O.name+`
Material Type: `+O.type+`

Program Info Log: `+G+`
`+mt+`
`+St)}else G!==""?Ht("WebGLProgram: Program Info Log:",G):(et===""||K==="")&&(lt=!1);lt&&(O.diagnostics={runnable:rt,programLog:G,vertexShader:{log:et,prefix:x},fragmentShader:{log:K,prefix:f}})}s.deleteShader(R),s.deleteShader(w),v=new Rr(s,S),C=F_(s,S)}let v;this.getUniforms=function(){return v===void 0&&L(this),v};let C;this.getAttributes=function(){return C===void 0&&L(this),C};let V=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return V===!1&&(V=s.getProgramParameter(S,A_)),V},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(S),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=w_++,this.cacheKey=t,this.usedTimes=1,this.program=S,this.vertexShader=R,this.fragmentShader=w,this}var j_=0,Wh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){let s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Xh(t),e.set(t,n)),n}},Xh=class{constructor(t){this.id=j_++,this.code=t,this.usedTimes=0}};function Q_(i){return i===us||i===Ma||i===ba}function tx(i,t,e,n,s,r){let a=new ia,o=new Wh,c=new Set,l=[],d=new Map,m=n.logarithmicDepthBuffer,h=n.precision,_={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(v){return c.add(v),v===0?"uv":`uv${v}`}function S(v,C,V,O,W,z){let it=O.fog,G=W.geometry,et=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?O.environment:null,K=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,rt=t.get(v.envMap||et,K),lt=rt&&rt.mapping===ma?rt.image.height:null,mt=_[v.type];v.precision!==null&&(h=n.getMaxPrecision(v.precision),h!==v.precision&&Ht("WebGLProgram.getParameters:",v.precision,"not supported, using",h,"instead."));let St=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,xt=St!==void 0?St.length:0,le=0;G.morphAttributes.position!==void 0&&(le=1),G.morphAttributes.normal!==void 0&&(le=2),G.morphAttributes.color!==void 0&&(le=3);let ye,re,J,ht;if(mt){let Dt=Mi[mt];ye=Dt.vertexShader,re=Dt.fragmentShader}else{ye=v.vertexShader,re=v.fragmentShader;let Dt=o.getVertexShaderStage(v),De=o.getFragmentShaderStage(v);o.update(v,Dt,De),J=Dt.id,ht=De.id}let ut=i.getRenderTarget(),Rt=i.state.buffers.depth.getReversed(),qt=W.isInstancedMesh===!0,Gt=W.isBatchedMesh===!0,Yt=!!v.map,te=!!v.matcap,Me=!!rt,ce=!!v.aoMap,se=!!v.lightMap,Fe=!!v.bumpMap&&v.wireframe===!1,Be=!!v.normalMap,ze=!!v.displacementMap,Ge=!!v.emissiveMap,Ie=!!v.metalnessMap,Oe=!!v.roughnessMap,B=v.anisotropy>0,We=v.clearcoat>0,me=v.dispersion>0,T=v.iridescence>0,g=v.sheen>0,H=v.transmission>0,X=B&&!!v.anisotropyMap,Q=We&&!!v.clearcoatMap,pt=We&&!!v.clearcoatNormalMap,gt=We&&!!v.clearcoatRoughnessMap,tt=T&&!!v.iridescenceMap,st=T&&!!v.iridescenceThicknessMap,vt=g&&!!v.sheenColorMap,Ft=g&&!!v.sheenRoughnessMap,Et=!!v.specularMap,Mt=!!v.specularColorMap,Ot=!!v.specularIntensityMap,Vt=H&&!!v.transmissionMap,Kt=H&&!!v.thicknessMap,N=!!v.gradientMap,_t=!!v.alphaMap,nt=v.alphaTest>0,ct=!!v.alphaHash,At=!!v.extensions,at=si;v.toneMapped&&(ut===null||ut.isXRRenderTarget===!0)&&(at=i.toneMapping);let Nt={shaderID:mt,shaderType:v.type,shaderName:v.name,vertexShader:ye,fragmentShader:re,defines:v.defines,customVertexShaderID:J,customFragmentShaderID:ht,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:h,batching:Gt,batchingColor:Gt&&W._colorsTexture!==null,instancing:qt,instancingColor:qt&&W.instanceColor!==null,instancingMorph:qt&&W.morphTexture!==null,outputColorSpace:ut===null?i.outputColorSpace:ut.isXRRenderTarget===!0?ut.texture.colorSpace:de.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:Yt,matcap:te,envMap:Me,envMapMode:Me&&rt.mapping,envMapCubeUVHeight:lt,aoMap:ce,lightMap:se,bumpMap:Fe,normalMap:Be,displacementMap:ze,emissiveMap:Ge,normalMapObjectSpace:Be&&v.normalMapType===Td,normalMapTangentSpace:Be&&v.normalMapType===yh,packedNormalMap:Be&&v.normalMapType===yh&&Q_(v.normalMap.format),metalnessMap:Ie,roughnessMap:Oe,anisotropy:B,anisotropyMap:X,clearcoat:We,clearcoatMap:Q,clearcoatNormalMap:pt,clearcoatRoughnessMap:gt,dispersion:me,iridescence:T,iridescenceMap:tt,iridescenceThicknessMap:st,sheen:g,sheenColorMap:vt,sheenRoughnessMap:Ft,specularMap:Et,specularColorMap:Mt,specularIntensityMap:Ot,transmission:H,transmissionMap:Vt,thicknessMap:Kt,gradientMap:N,opaque:v.transparent===!1&&v.blending===ws&&v.alphaToCoverage===!1,alphaMap:_t,alphaTest:nt,alphaHash:ct,combine:v.combine,mapUv:Yt&&p(v.map.channel),aoMapUv:ce&&p(v.aoMap.channel),lightMapUv:se&&p(v.lightMap.channel),bumpMapUv:Fe&&p(v.bumpMap.channel),normalMapUv:Be&&p(v.normalMap.channel),displacementMapUv:ze&&p(v.displacementMap.channel),emissiveMapUv:Ge&&p(v.emissiveMap.channel),metalnessMapUv:Ie&&p(v.metalnessMap.channel),roughnessMapUv:Oe&&p(v.roughnessMap.channel),anisotropyMapUv:X&&p(v.anisotropyMap.channel),clearcoatMapUv:Q&&p(v.clearcoatMap.channel),clearcoatNormalMapUv:pt&&p(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:gt&&p(v.clearcoatRoughnessMap.channel),iridescenceMapUv:tt&&p(v.iridescenceMap.channel),iridescenceThicknessMapUv:st&&p(v.iridescenceThicknessMap.channel),sheenColorMapUv:vt&&p(v.sheenColorMap.channel),sheenRoughnessMapUv:Ft&&p(v.sheenRoughnessMap.channel),specularMapUv:Et&&p(v.specularMap.channel),specularColorMapUv:Mt&&p(v.specularColorMap.channel),specularIntensityMapUv:Ot&&p(v.specularIntensityMap.channel),transmissionMapUv:Vt&&p(v.transmissionMap.channel),thicknessMapUv:Kt&&p(v.thicknessMap.channel),alphaMapUv:_t&&p(v.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(Be||B),vertexNormals:!!G.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:W.isPoints===!0&&!!G.attributes.uv&&(Yt||_t),fog:!!it,useFog:v.fog===!0,fogExp2:!!it&&it.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||G.attributes.normal===void 0&&Be===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:m,reversedDepthBuffer:Rt,skinning:W.isSkinnedMesh===!0,hasPositionAttribute:G.attributes.position!==void 0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:xt,morphTextureStride:le,numDirLights:C.directional.length,numPointLights:C.point.length,numSpotLights:C.spot.length,numSpotLightMaps:C.spotLightMap.length,numRectAreaLights:C.rectArea.length,numHemiLights:C.hemi.length,numDirLightShadows:C.directionalShadowMap.length,numPointLightShadows:C.pointShadowMap.length,numSpotLightShadows:C.spotShadowMap.length,numSpotLightShadowsWithMaps:C.numSpotLightShadowsWithMaps,numLightProbes:C.numLightProbes,numLightProbeGrids:z.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&V.length>0,shadowMapType:i.shadowMap.type,toneMapping:at,decodeVideoTexture:Yt&&v.map.isVideoTexture===!0&&de.getTransfer(v.map.colorSpace)===ve,decodeVideoTextureEmissive:Ge&&v.emissiveMap.isVideoTexture===!0&&de.getTransfer(v.emissiveMap.colorSpace)===ve,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Gn,flipSided:v.side===cn,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:At&&v.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(At&&v.extensions.multiDraw===!0||Gt)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return Nt.vertexUv1s=c.has(1),Nt.vertexUv2s=c.has(2),Nt.vertexUv3s=c.has(3),c.clear(),Nt}function x(v){let C=[];if(v.shaderID?C.push(v.shaderID):(C.push(v.customVertexShaderID),C.push(v.customFragmentShaderID)),v.defines!==void 0)for(let V in v.defines)C.push(V),C.push(v.defines[V]);return v.isRawShaderMaterial===!1&&(f(C,v),A(C,v),C.push(i.outputColorSpace)),C.push(v.customProgramCacheKey),C.join()}function f(v,C){v.push(C.precision),v.push(C.outputColorSpace),v.push(C.envMapMode),v.push(C.envMapCubeUVHeight),v.push(C.mapUv),v.push(C.alphaMapUv),v.push(C.lightMapUv),v.push(C.aoMapUv),v.push(C.bumpMapUv),v.push(C.normalMapUv),v.push(C.displacementMapUv),v.push(C.emissiveMapUv),v.push(C.metalnessMapUv),v.push(C.roughnessMapUv),v.push(C.anisotropyMapUv),v.push(C.clearcoatMapUv),v.push(C.clearcoatNormalMapUv),v.push(C.clearcoatRoughnessMapUv),v.push(C.iridescenceMapUv),v.push(C.iridescenceThicknessMapUv),v.push(C.sheenColorMapUv),v.push(C.sheenRoughnessMapUv),v.push(C.specularMapUv),v.push(C.specularColorMapUv),v.push(C.specularIntensityMapUv),v.push(C.transmissionMapUv),v.push(C.thicknessMapUv),v.push(C.combine),v.push(C.fogExp2),v.push(C.sizeAttenuation),v.push(C.morphTargetsCount),v.push(C.morphAttributeCount),v.push(C.numDirLights),v.push(C.numPointLights),v.push(C.numSpotLights),v.push(C.numSpotLightMaps),v.push(C.numHemiLights),v.push(C.numRectAreaLights),v.push(C.numDirLightShadows),v.push(C.numPointLightShadows),v.push(C.numSpotLightShadows),v.push(C.numSpotLightShadowsWithMaps),v.push(C.numLightProbes),v.push(C.shadowMapType),v.push(C.toneMapping),v.push(C.numClippingPlanes),v.push(C.numClipIntersection),v.push(C.depthPacking)}function A(v,C){a.disableAll(),C.instancing&&a.enable(0),C.instancingColor&&a.enable(1),C.instancingMorph&&a.enable(2),C.matcap&&a.enable(3),C.envMap&&a.enable(4),C.normalMapObjectSpace&&a.enable(5),C.normalMapTangentSpace&&a.enable(6),C.clearcoat&&a.enable(7),C.iridescence&&a.enable(8),C.alphaTest&&a.enable(9),C.vertexColors&&a.enable(10),C.vertexAlphas&&a.enable(11),C.vertexUv1s&&a.enable(12),C.vertexUv2s&&a.enable(13),C.vertexUv3s&&a.enable(14),C.vertexTangents&&a.enable(15),C.anisotropy&&a.enable(16),C.alphaHash&&a.enable(17),C.batching&&a.enable(18),C.dispersion&&a.enable(19),C.batchingColor&&a.enable(20),C.gradientMap&&a.enable(21),C.packedNormalMap&&a.enable(22),C.vertexNormals&&a.enable(23),v.push(a.mask),a.disableAll(),C.fog&&a.enable(0),C.useFog&&a.enable(1),C.flatShading&&a.enable(2),C.logarithmicDepthBuffer&&a.enable(3),C.reversedDepthBuffer&&a.enable(4),C.skinning&&a.enable(5),C.morphTargets&&a.enable(6),C.morphNormals&&a.enable(7),C.morphColors&&a.enable(8),C.premultipliedAlpha&&a.enable(9),C.shadowMapEnabled&&a.enable(10),C.doubleSided&&a.enable(11),C.flipSided&&a.enable(12),C.useDepthPacking&&a.enable(13),C.dithering&&a.enable(14),C.transmission&&a.enable(15),C.sheen&&a.enable(16),C.opaque&&a.enable(17),C.pointsUvs&&a.enable(18),C.decodeVideoTexture&&a.enable(19),C.decodeVideoTextureEmissive&&a.enable(20),C.alphaToCoverage&&a.enable(21),C.numLightProbeGrids>0&&a.enable(22),C.hasPositionAttribute&&a.enable(23),v.push(a.mask)}function I(v){let C=_[v.type],V;if(C){let O=Mi[C];V=Od.clone(O.uniforms)}else V=v.uniforms;return V}function E(v,C){let V=d.get(C);return V!==void 0?++V.usedTimes:(V=new K_(i,C,v,s),l.push(V),d.set(C,V)),V}function R(v){if(--v.usedTimes===0){let C=l.indexOf(v);l[C]=l[l.length-1],l.pop(),d.delete(v.cacheKey),v.destroy()}}function w(v){o.remove(v)}function L(){o.dispose()}return{getParameters:S,getProgramCacheKey:x,getUniforms:I,acquireProgram:E,releaseProgram:R,releaseShaderCache:w,programs:l,dispose:L}}function ex(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function nx(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.materialVariant!==t.materialVariant?i.materialVariant-t.materialVariant:i.z!==t.z?i.z-t.z:i.id-t.id}function sf(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function rf(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(h){let _=0;return h.isInstancedMesh&&(_+=2),h.isSkinnedMesh&&(_+=1),_}function o(h,_,p,S,x,f){let A=i[t];return A===void 0?(A={id:h.id,object:h,geometry:_,material:p,materialVariant:a(h),groupOrder:S,renderOrder:h.renderOrder,z:x,group:f},i[t]=A):(A.id=h.id,A.object=h,A.geometry=_,A.material=p,A.materialVariant=a(h),A.groupOrder=S,A.renderOrder=h.renderOrder,A.z=x,A.group=f),t++,A}function c(h,_,p,S,x,f){let A=o(h,_,p,S,x,f);p.transmission>0?n.push(A):p.transparent===!0?s.push(A):e.push(A)}function l(h,_,p,S,x,f){let A=o(h,_,p,S,x,f);p.transmission>0?n.unshift(A):p.transparent===!0?s.unshift(A):e.unshift(A)}function d(h,_,p){e.length>1&&e.sort(h||nx),n.length>1&&n.sort(_||sf),s.length>1&&s.sort(_||sf),p&&(e.reverse(),n.reverse(),s.reverse())}function m(){for(let h=t,_=i.length;h<_;h++){let p=i[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:c,unshift:l,finish:m,sort:d}}function ix(){let i=new WeakMap;function t(n,s){let r=i.get(n),a;return r===void 0?(a=new rf,i.set(n,[a])):s>=r.length?(a=new rf,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function sx(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new F,color:new zt};break;case"SpotLight":e={position:new F,direction:new F,color:new zt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new F,color:new zt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new F,skyColor:new zt,groundColor:new zt};break;case"RectAreaLight":e={color:new zt,position:new F,halfWidth:new F,halfHeight:new F};break}return i[t.id]=e,e}}}function rx(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $t};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $t};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $t,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var ax=0;function ox(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function lx(i){let t=new sx,e=rx(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new F);let s=new F,r=new Ue,a=new Ue;function o(l){let d=0,m=0,h=0;for(let C=0;C<9;C++)n.probe[C].set(0,0,0);let _=0,p=0,S=0,x=0,f=0,A=0,I=0,E=0,R=0,w=0,L=0;l.sort(ox);for(let C=0,V=l.length;C<V;C++){let O=l[C],W=O.color,z=O.intensity,it=O.distance,G=null;if(O.shadow&&O.shadow.map&&(O.shadow.map.texture.format===us?G=O.shadow.map.texture:G=O.shadow.map.depthTexture||O.shadow.map.texture),O.isAmbientLight)d+=W.r*z,m+=W.g*z,h+=W.b*z;else if(O.isLightProbe){for(let et=0;et<9;et++)n.probe[et].addScaledVector(O.sh.coefficients[et],z);L++}else if(O.isDirectionalLight){let et=t.get(O);if(et.color.copy(O.color).multiplyScalar(O.intensity),O.castShadow){let K=O.shadow,rt=e.get(O);rt.shadowIntensity=K.intensity,rt.shadowBias=K.bias,rt.shadowNormalBias=K.normalBias,rt.shadowRadius=K.radius,rt.shadowMapSize=K.mapSize,n.directionalShadow[_]=rt,n.directionalShadowMap[_]=G,n.directionalShadowMatrix[_]=O.shadow.matrix,A++}n.directional[_]=et,_++}else if(O.isSpotLight){let et=t.get(O);et.position.setFromMatrixPosition(O.matrixWorld),et.color.copy(W).multiplyScalar(z),et.distance=it,et.coneCos=Math.cos(O.angle),et.penumbraCos=Math.cos(O.angle*(1-O.penumbra)),et.decay=O.decay,n.spot[S]=et;let K=O.shadow;if(O.map&&(n.spotLightMap[R]=O.map,R++,K.updateMatrices(O),O.castShadow&&w++),n.spotLightMatrix[S]=K.matrix,O.castShadow){let rt=e.get(O);rt.shadowIntensity=K.intensity,rt.shadowBias=K.bias,rt.shadowNormalBias=K.normalBias,rt.shadowRadius=K.radius,rt.shadowMapSize=K.mapSize,n.spotShadow[S]=rt,n.spotShadowMap[S]=G,E++}S++}else if(O.isRectAreaLight){let et=t.get(O);et.color.copy(W).multiplyScalar(z),et.halfWidth.set(O.width*.5,0,0),et.halfHeight.set(0,O.height*.5,0),n.rectArea[x]=et,x++}else if(O.isPointLight){let et=t.get(O);if(et.color.copy(O.color).multiplyScalar(O.intensity),et.distance=O.distance,et.decay=O.decay,O.castShadow){let K=O.shadow,rt=e.get(O);rt.shadowIntensity=K.intensity,rt.shadowBias=K.bias,rt.shadowNormalBias=K.normalBias,rt.shadowRadius=K.radius,rt.shadowMapSize=K.mapSize,rt.shadowCameraNear=K.camera.near,rt.shadowCameraFar=K.camera.far,n.pointShadow[p]=rt,n.pointShadowMap[p]=G,n.pointShadowMatrix[p]=O.shadow.matrix,I++}n.point[p]=et,p++}else if(O.isHemisphereLight){let et=t.get(O);et.skyColor.copy(O.color).multiplyScalar(z),et.groundColor.copy(O.groundColor).multiplyScalar(z),n.hemi[f]=et,f++}}x>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=wt.LTC_FLOAT_1,n.rectAreaLTC2=wt.LTC_FLOAT_2):(n.rectAreaLTC1=wt.LTC_HALF_1,n.rectAreaLTC2=wt.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=m,n.ambient[2]=h;let v=n.hash;(v.directionalLength!==_||v.pointLength!==p||v.spotLength!==S||v.rectAreaLength!==x||v.hemiLength!==f||v.numDirectionalShadows!==A||v.numPointShadows!==I||v.numSpotShadows!==E||v.numSpotMaps!==R||v.numLightProbes!==L)&&(n.directional.length=_,n.spot.length=S,n.rectArea.length=x,n.point.length=p,n.hemi.length=f,n.directionalShadow.length=A,n.directionalShadowMap.length=A,n.pointShadow.length=I,n.pointShadowMap.length=I,n.spotShadow.length=E,n.spotShadowMap.length=E,n.directionalShadowMatrix.length=A,n.pointShadowMatrix.length=I,n.spotLightMatrix.length=E+R-w,n.spotLightMap.length=R,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=L,v.directionalLength=_,v.pointLength=p,v.spotLength=S,v.rectAreaLength=x,v.hemiLength=f,v.numDirectionalShadows=A,v.numPointShadows=I,v.numSpotShadows=E,v.numSpotMaps=R,v.numLightProbes=L,n.version=ax++)}function c(l,d){let m=0,h=0,_=0,p=0,S=0,x=d.matrixWorldInverse;for(let f=0,A=l.length;f<A;f++){let I=l[f];if(I.isDirectionalLight){let E=n.directional[m];E.direction.setFromMatrixPosition(I.matrixWorld),s.setFromMatrixPosition(I.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(x),m++}else if(I.isSpotLight){let E=n.spot[_];E.position.setFromMatrixPosition(I.matrixWorld),E.position.applyMatrix4(x),E.direction.setFromMatrixPosition(I.matrixWorld),s.setFromMatrixPosition(I.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(x),_++}else if(I.isRectAreaLight){let E=n.rectArea[p];E.position.setFromMatrixPosition(I.matrixWorld),E.position.applyMatrix4(x),a.identity(),r.copy(I.matrixWorld),r.premultiply(x),a.extractRotation(r),E.halfWidth.set(I.width*.5,0,0),E.halfHeight.set(0,I.height*.5,0),E.halfWidth.applyMatrix4(a),E.halfHeight.applyMatrix4(a),p++}else if(I.isPointLight){let E=n.point[h];E.position.setFromMatrixPosition(I.matrixWorld),E.position.applyMatrix4(x),h++}else if(I.isHemisphereLight){let E=n.hemi[S];E.direction.setFromMatrixPosition(I.matrixWorld),E.direction.transformDirection(x),S++}}}return{setup:o,setupView:c,state:n}}function af(i){let t=new lx(i),e=[],n=[],s=[];function r(h){m.camera=h,e.length=0,n.length=0,s.length=0}function a(h){e.push(h)}function o(h){n.push(h)}function c(h){s.push(h)}function l(){t.setup(e)}function d(h){t.setupView(e,h)}let m={lightsArray:e,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:m,setupLights:l,setupLightsView:d,pushLight:a,pushShadow:o,pushLightProbeGrid:c}}function cx(i){let t=new WeakMap;function e(s,r=0){let a=t.get(s),o;return a===void 0?(o=new af(i),t.set(s,[o])):r>=a.length?(o=new af(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}var hx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ux=`uniform sampler2D shadow_pass;
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
}`,dx=[new F(1,0,0),new F(-1,0,0),new F(0,1,0),new F(0,-1,0),new F(0,0,1),new F(0,0,-1)],fx=[new F(0,-1,0),new F(0,-1,0),new F(0,0,1),new F(0,0,-1),new F(0,-1,0),new F(0,-1,0)],of=new Ue,Ea=new F,Bh=new F;function px(i,t,e){let n=new oa,s=new $t,r=new $t,a=new Pe,o=new Oo,c=new Bo,l={},d=e.maxTextureSize,m={[Ui]:cn,[cn]:Ui,[Gn]:Gn},h=new Se({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new $t},radius:{value:4}},vertexShader:hx,fragmentShader:ux}),_=h.clone();_.defines.HORIZONTAL_PASS=1;let p=new Ae;p.setAttribute("position",new Qt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let S=new Ke(p,h),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=pa;let f=this.type;this.render=function(w,L,v){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||w.length===0)return;this.type===rd&&(Ht("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=pa);let C=i.getRenderTarget(),V=i.getActiveCubeFace(),O=i.getActiveMipmapLevel(),W=i.state;W.setBlending(xi),W.buffers.depth.getReversed()===!0?W.buffers.color.setClear(0,0,0,0):W.buffers.color.setClear(1,1,1,1),W.buffers.depth.setTest(!0),W.setScissorTest(!1);let z=f!==this.type;z&&L.traverse(function(it){it.material&&(Array.isArray(it.material)?it.material.forEach(G=>G.needsUpdate=!0):it.material.needsUpdate=!0)});for(let it=0,G=w.length;it<G;it++){let et=w[it],K=et.shadow;if(K===void 0){Ht("WebGLShadowMap:",et,"has no shadow.");continue}if(K.autoUpdate===!1&&K.needsUpdate===!1)continue;s.copy(K.mapSize);let rt=K.getFrameExtents();s.multiply(rt),r.copy(K.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/rt.x),s.x=r.x*rt.x,K.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/rt.y),s.y=r.y*rt.y,K.mapSize.y=r.y));let lt=i.state.buffers.depth.getReversed();if(K.camera._reversedDepth=lt,K.map===null||z===!0){if(K.map!==null&&(K.map.depthTexture!==null&&(K.map.depthTexture.dispose(),K.map.depthTexture=null),K.map.dispose()),this.type===Sr){if(et.isPointLight){Ht("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}K.map=new gn(s.x,s.y,{format:us,type:Zn,minFilter:Ne,magFilter:Ne,generateMipmaps:!1}),K.map.texture.name=et.name+".shadowMap",K.map.depthTexture=new Oi(s.x,s.y,oi),K.map.depthTexture.name=et.name+".shadowMapDepth",K.map.depthTexture.format=gi,K.map.depthTexture.compareFunction=null,K.map.depthTexture.minFilter=an,K.map.depthTexture.magFilter=an}else et.isPointLight?(K.map=new Hl(s.x),K.map.depthTexture=new Uo(s.x,ai)):(K.map=new gn(s.x,s.y),K.map.depthTexture=new Oi(s.x,s.y,ai)),K.map.depthTexture.name=et.name+".shadowMap",K.map.depthTexture.format=gi,this.type===pa?(K.map.depthTexture.compareFunction=lt?Bl:Ol,K.map.depthTexture.minFilter=Ne,K.map.depthTexture.magFilter=Ne):(K.map.depthTexture.compareFunction=null,K.map.depthTexture.minFilter=an,K.map.depthTexture.magFilter=an);K.camera.updateProjectionMatrix()}let mt=K.map.isWebGLCubeRenderTarget?6:1;for(let St=0;St<mt;St++){if(K.map.isWebGLCubeRenderTarget)i.setRenderTarget(K.map,St),i.clear();else{St===0&&(i.setRenderTarget(K.map),i.clear());let xt=K.getViewport(St);a.set(r.x*xt.x,r.y*xt.y,r.x*xt.z,r.y*xt.w),W.viewport(a)}if(et.isPointLight){let xt=K.camera,le=K.matrix,ye=et.distance||xt.far;ye!==xt.far&&(xt.far=ye,xt.updateProjectionMatrix()),Ea.setFromMatrixPosition(et.matrixWorld),xt.position.copy(Ea),Bh.copy(xt.position),Bh.add(dx[St]),xt.up.copy(fx[St]),xt.lookAt(Bh),xt.updateMatrixWorld(),le.makeTranslation(-Ea.x,-Ea.y,-Ea.z),of.multiplyMatrices(xt.projectionMatrix,xt.matrixWorldInverse),K._frustum.setFromProjectionMatrix(of,xt.coordinateSystem,xt.reversedDepth)}else K.updateMatrices(et);n=K.getFrustum(),E(L,v,K.camera,et,this.type)}K.isPointLightShadow!==!0&&this.type===Sr&&A(K,v),K.needsUpdate=!1}f=this.type,x.needsUpdate=!1,i.setRenderTarget(C,V,O)};function A(w,L){let v=t.update(S);h.defines.VSM_SAMPLES!==w.blurSamples&&(h.defines.VSM_SAMPLES=w.blurSamples,_.defines.VSM_SAMPLES=w.blurSamples,h.needsUpdate=!0,_.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new gn(s.x,s.y,{format:us,type:Zn})),h.uniforms.shadow_pass.value=w.map.depthTexture,h.uniforms.resolution.value=w.mapSize,h.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(L,null,v,h,S,null),_.uniforms.shadow_pass.value=w.mapPass.texture,_.uniforms.resolution.value=w.mapSize,_.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(L,null,v,_,S,null)}function I(w,L,v,C){let V=null,O=v.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(O!==void 0)V=O;else if(V=v.isPointLight===!0?c:o,i.localClippingEnabled&&L.clipShadows===!0&&Array.isArray(L.clippingPlanes)&&L.clippingPlanes.length!==0||L.displacementMap&&L.displacementScale!==0||L.alphaMap&&L.alphaTest>0||L.map&&L.alphaTest>0||L.alphaToCoverage===!0){let W=V.uuid,z=L.uuid,it=l[W];it===void 0&&(it={},l[W]=it);let G=it[z];G===void 0&&(G=V.clone(),it[z]=G,L.addEventListener("dispose",R)),V=G}if(V.visible=L.visible,V.wireframe=L.wireframe,C===Sr?V.side=L.shadowSide!==null?L.shadowSide:L.side:V.side=L.shadowSide!==null?L.shadowSide:m[L.side],V.alphaMap=L.alphaMap,V.alphaTest=L.alphaToCoverage===!0?.5:L.alphaTest,V.map=L.map,V.clipShadows=L.clipShadows,V.clippingPlanes=L.clippingPlanes,V.clipIntersection=L.clipIntersection,V.displacementMap=L.displacementMap,V.displacementScale=L.displacementScale,V.displacementBias=L.displacementBias,V.wireframeLinewidth=L.wireframeLinewidth,V.linewidth=L.linewidth,v.isPointLight===!0&&V.isMeshDistanceMaterial===!0){let W=i.properties.get(V);W.light=v}return V}function E(w,L,v,C,V){if(w.visible===!1)return;if(w.layers.test(L.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&V===Sr)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,w.matrixWorld);let z=t.update(w),it=w.material;if(Array.isArray(it)){let G=z.groups;for(let et=0,K=G.length;et<K;et++){let rt=G[et],lt=it[rt.materialIndex];if(lt&&lt.visible){let mt=I(w,lt,C,V);w.onBeforeShadow(i,w,L,v,z,mt,rt),i.renderBufferDirect(v,null,z,mt,w,rt),w.onAfterShadow(i,w,L,v,z,mt,rt)}}}else if(it.visible){let G=I(w,it,C,V);w.onBeforeShadow(i,w,L,v,z,G,null),i.renderBufferDirect(v,null,z,G,w,null),w.onAfterShadow(i,w,L,v,z,G,null)}}let W=w.children;for(let z=0,it=W.length;z<it;z++)E(W[z],L,v,C,V)}function R(w){w.target.removeEventListener("dispose",R);for(let v in l){let C=l[v],V=w.target.uuid;V in C&&(C[V].dispose(),delete C[V])}}}function mx(i,t){function e(){let N=!1,_t=new Pe,nt=null,ct=new Pe(0,0,0,0);return{setMask:function(At){nt!==At&&!N&&(i.colorMask(At,At,At,At),nt=At)},setLocked:function(At){N=At},setClear:function(At,at,Nt,Dt,De){De===!0&&(At*=Dt,at*=Dt,Nt*=Dt),_t.set(At,at,Nt,Dt),ct.equals(_t)===!1&&(i.clearColor(At,at,Nt,Dt),ct.copy(_t))},reset:function(){N=!1,nt=null,ct.set(-1,0,0,0)}}}function n(){let N=!1,_t=!1,nt=null,ct=null,At=null;return{setReversed:function(at){if(_t!==at){let Nt=t.get("EXT_clip_control");at?Nt.clipControlEXT(Nt.LOWER_LEFT_EXT,Nt.ZERO_TO_ONE_EXT):Nt.clipControlEXT(Nt.LOWER_LEFT_EXT,Nt.NEGATIVE_ONE_TO_ONE_EXT),_t=at;let Dt=At;At=null,this.setClear(Dt)}},getReversed:function(){return _t},setTest:function(at){at?ut(i.DEPTH_TEST):Rt(i.DEPTH_TEST)},setMask:function(at){nt!==at&&!N&&(i.depthMask(at),nt=at)},setFunc:function(at){if(_t&&(at=Ud[at]),ct!==at){switch(at){case _o:i.depthFunc(i.NEVER);break;case xo:i.depthFunc(i.ALWAYS);break;case vo:i.depthFunc(i.LESS);break;case Cs:i.depthFunc(i.LEQUAL);break;case yo:i.depthFunc(i.EQUAL);break;case Mo:i.depthFunc(i.GEQUAL);break;case bo:i.depthFunc(i.GREATER);break;case So:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ct=at}},setLocked:function(at){N=at},setClear:function(at){At!==at&&(At=at,_t&&(at=1-at),i.clearDepth(at))},reset:function(){N=!1,nt=null,ct=null,At=null,_t=!1}}}function s(){let N=!1,_t=null,nt=null,ct=null,At=null,at=null,Nt=null,Dt=null,De=null;return{setTest:function(ge){N||(ge?ut(i.STENCIL_TEST):Rt(i.STENCIL_TEST))},setMask:function(ge){_t!==ge&&!N&&(i.stencilMask(ge),_t=ge)},setFunc:function(ge,Nn,En){(nt!==ge||ct!==Nn||At!==En)&&(i.stencilFunc(ge,Nn,En),nt=ge,ct=Nn,At=En)},setOp:function(ge,Nn,En){(at!==ge||Nt!==Nn||Dt!==En)&&(i.stencilOp(ge,Nn,En),at=ge,Nt=Nn,Dt=En)},setLocked:function(ge){N=ge},setClear:function(ge){De!==ge&&(i.clearStencil(ge),De=ge)},reset:function(){N=!1,_t=null,nt=null,ct=null,At=null,at=null,Nt=null,Dt=null,De=null}}}let r=new e,a=new n,o=new s,c=new WeakMap,l=new WeakMap,d={},m={},h={},_=new WeakMap,p=[],S=null,x=!1,f=null,A=null,I=null,E=null,R=null,w=null,L=null,v=new zt(0,0,0),C=0,V=!1,O=null,W=null,z=null,it=null,G=null,et=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),K=!1,rt=0,lt=i.getParameter(i.VERSION);lt.indexOf("WebGL")!==-1?(rt=parseFloat(/^WebGL (\d)/.exec(lt)[1]),K=rt>=1):lt.indexOf("OpenGL ES")!==-1&&(rt=parseFloat(/^OpenGL ES (\d)/.exec(lt)[1]),K=rt>=2);let mt=null,St={},xt=i.getParameter(i.SCISSOR_BOX),le=i.getParameter(i.VIEWPORT),ye=new Pe().fromArray(xt),re=new Pe().fromArray(le);function J(N,_t,nt,ct){let At=new Uint8Array(4),at=i.createTexture();i.bindTexture(N,at),i.texParameteri(N,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(N,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Nt=0;Nt<nt;Nt++)N===i.TEXTURE_3D||N===i.TEXTURE_2D_ARRAY?i.texImage3D(_t,0,i.RGBA,1,1,ct,0,i.RGBA,i.UNSIGNED_BYTE,At):i.texImage2D(_t+Nt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,At);return at}let ht={};ht[i.TEXTURE_2D]=J(i.TEXTURE_2D,i.TEXTURE_2D,1),ht[i.TEXTURE_CUBE_MAP]=J(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ht[i.TEXTURE_2D_ARRAY]=J(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ht[i.TEXTURE_3D]=J(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ut(i.DEPTH_TEST),a.setFunc(Cs),Fe(!1),Be(eh),ut(i.CULL_FACE),ce(xi);function ut(N){d[N]!==!0&&(i.enable(N),d[N]=!0)}function Rt(N){d[N]!==!1&&(i.disable(N),d[N]=!1)}function qt(N,_t){return h[N]!==_t?(i.bindFramebuffer(N,_t),h[N]=_t,N===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=_t),N===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=_t),!0):!1}function Gt(N,_t){let nt=p,ct=!1;if(N){nt=_.get(_t),nt===void 0&&(nt=[],_.set(_t,nt));let At=N.textures;if(nt.length!==At.length||nt[0]!==i.COLOR_ATTACHMENT0){for(let at=0,Nt=At.length;at<Nt;at++)nt[at]=i.COLOR_ATTACHMENT0+at;nt.length=At.length,ct=!0}}else nt[0]!==i.BACK&&(nt[0]=i.BACK,ct=!0);ct&&i.drawBuffers(nt)}function Yt(N){return S!==N?(i.useProgram(N),S=N,!0):!1}let te={[Qi]:i.FUNC_ADD,[ad]:i.FUNC_SUBTRACT,[od]:i.FUNC_REVERSE_SUBTRACT};te[ld]=i.MIN,te[cd]=i.MAX;let Me={[Er]:i.ZERO,[we]:i.ONE,[hd]:i.SRC_COLOR,[dr]:i.SRC_ALPHA,[gd]:i.SRC_ALPHA_SATURATE,[pd]:i.DST_COLOR,[dd]:i.DST_ALPHA,[ud]:i.ONE_MINUS_SRC_COLOR,[fr]:i.ONE_MINUS_SRC_ALPHA,[md]:i.ONE_MINUS_DST_COLOR,[fd]:i.ONE_MINUS_DST_ALPHA,[_d]:i.CONSTANT_COLOR,[xd]:i.ONE_MINUS_CONSTANT_COLOR,[vd]:i.CONSTANT_ALPHA,[yd]:i.ONE_MINUS_CONSTANT_ALPHA};function ce(N,_t,nt,ct,At,at,Nt,Dt,De,ge){if(N===xi){x===!0&&(Rt(i.BLEND),x=!1);return}if(x===!1&&(ut(i.BLEND),x=!0),N!==In){if(N!==f||ge!==V){if((A!==Qi||R!==Qi)&&(i.blendEquation(i.FUNC_ADD),A=Qi,R=Qi),ge)switch(N){case ws:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Is:i.blendFunc(i.ONE,i.ONE);break;case nh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ih:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Xt("WebGLState: Invalid blending: ",N);break}else switch(N){case ws:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Is:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case nh:Xt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ih:Xt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Xt("WebGLState: Invalid blending: ",N);break}I=null,E=null,w=null,L=null,v.set(0,0,0),C=0,f=N,V=ge}return}At=At||_t,at=at||nt,Nt=Nt||ct,(_t!==A||At!==R)&&(i.blendEquationSeparate(te[_t],te[At]),A=_t,R=At),(nt!==I||ct!==E||at!==w||Nt!==L)&&(i.blendFuncSeparate(Me[nt],Me[ct],Me[at],Me[Nt]),I=nt,E=ct,w=at,L=Nt),(Dt.equals(v)===!1||De!==C)&&(i.blendColor(Dt.r,Dt.g,Dt.b,De),v.copy(Dt),C=De),f=N,V=!1}function se(N,_t){N.side===Gn?Rt(i.CULL_FACE):ut(i.CULL_FACE);let nt=N.side===cn;_t&&(nt=!nt),Fe(nt),N.blending===ws&&N.transparent===!1?ce(xi):ce(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),a.setFunc(N.depthFunc),a.setTest(N.depthTest),a.setMask(N.depthWrite),r.setMask(N.colorWrite);let ct=N.stencilWrite;o.setTest(ct),ct&&(o.setMask(N.stencilWriteMask),o.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),o.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),Ge(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?ut(i.SAMPLE_ALPHA_TO_COVERAGE):Rt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Fe(N){O!==N&&(N?i.frontFace(i.CW):i.frontFace(i.CCW),O=N)}function Be(N){N!==id?(ut(i.CULL_FACE),N!==W&&(N===eh?i.cullFace(i.BACK):N===sd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Rt(i.CULL_FACE),W=N}function ze(N){N!==z&&(K&&i.lineWidth(N),z=N)}function Ge(N,_t,nt){N?(ut(i.POLYGON_OFFSET_FILL),(it!==_t||G!==nt)&&(it=_t,G=nt,a.getReversed()&&(_t=-_t),i.polygonOffset(_t,nt))):Rt(i.POLYGON_OFFSET_FILL)}function Ie(N){N?ut(i.SCISSOR_TEST):Rt(i.SCISSOR_TEST)}function Oe(N){N===void 0&&(N=i.TEXTURE0+et-1),mt!==N&&(i.activeTexture(N),mt=N)}function B(N,_t,nt){nt===void 0&&(mt===null?nt=i.TEXTURE0+et-1:nt=mt);let ct=St[nt];ct===void 0&&(ct={type:void 0,texture:void 0},St[nt]=ct),(ct.type!==N||ct.texture!==_t)&&(mt!==nt&&(i.activeTexture(nt),mt=nt),i.bindTexture(N,_t||ht[N]),ct.type=N,ct.texture=_t)}function We(){let N=St[mt];N!==void 0&&N.type!==void 0&&(i.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function me(){try{i.compressedTexImage2D(...arguments)}catch(N){Xt("WebGLState:",N)}}function T(){try{i.compressedTexImage3D(...arguments)}catch(N){Xt("WebGLState:",N)}}function g(){try{i.texSubImage2D(...arguments)}catch(N){Xt("WebGLState:",N)}}function H(){try{i.texSubImage3D(...arguments)}catch(N){Xt("WebGLState:",N)}}function X(){try{i.compressedTexSubImage2D(...arguments)}catch(N){Xt("WebGLState:",N)}}function Q(){try{i.compressedTexSubImage3D(...arguments)}catch(N){Xt("WebGLState:",N)}}function pt(){try{i.texStorage2D(...arguments)}catch(N){Xt("WebGLState:",N)}}function gt(){try{i.texStorage3D(...arguments)}catch(N){Xt("WebGLState:",N)}}function tt(){try{i.texImage2D(...arguments)}catch(N){Xt("WebGLState:",N)}}function st(){try{i.texImage3D(...arguments)}catch(N){Xt("WebGLState:",N)}}function vt(N){return m[N]!==void 0?m[N]:i.getParameter(N)}function Ft(N,_t){m[N]!==_t&&(i.pixelStorei(N,_t),m[N]=_t)}function Et(N){ye.equals(N)===!1&&(i.scissor(N.x,N.y,N.z,N.w),ye.copy(N))}function Mt(N){re.equals(N)===!1&&(i.viewport(N.x,N.y,N.z,N.w),re.copy(N))}function Ot(N,_t){let nt=l.get(_t);nt===void 0&&(nt=new WeakMap,l.set(_t,nt));let ct=nt.get(N);ct===void 0&&(ct=i.getUniformBlockIndex(_t,N.name),nt.set(N,ct))}function Vt(N,_t){let ct=l.get(_t).get(N);c.get(_t)!==ct&&(i.uniformBlockBinding(_t,ct,N.__bindingPointIndex),c.set(_t,ct))}function Kt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),d={},m={},mt=null,St={},h={},_=new WeakMap,p=[],S=null,x=!1,f=null,A=null,I=null,E=null,R=null,w=null,L=null,v=new zt(0,0,0),C=0,V=!1,O=null,W=null,z=null,it=null,G=null,ye.set(0,0,i.canvas.width,i.canvas.height),re.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ut,disable:Rt,bindFramebuffer:qt,drawBuffers:Gt,useProgram:Yt,setBlending:ce,setMaterial:se,setFlipSided:Fe,setCullFace:Be,setLineWidth:ze,setPolygonOffset:Ge,setScissorTest:Ie,activeTexture:Oe,bindTexture:B,unbindTexture:We,compressedTexImage2D:me,compressedTexImage3D:T,texImage2D:tt,texImage3D:st,pixelStorei:Ft,getParameter:vt,updateUBOMapping:Ot,uniformBlockBinding:Vt,texStorage2D:pt,texStorage3D:gt,texSubImage2D:g,texSubImage3D:H,compressedTexSubImage2D:X,compressedTexSubImage3D:Q,scissor:Et,viewport:Mt,reset:Kt}}function gx(i,t,e,n,s,r,a){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new $t,d=new WeakMap,m=new Set,h,_=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function S(T,g){return p?new OffscreenCanvas(T,g):ea("canvas")}function x(T,g,H){let X=1,Q=me(T);if((Q.width>H||Q.height>H)&&(X=H/Math.max(Q.width,Q.height)),X<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){let pt=Math.floor(X*Q.width),gt=Math.floor(X*Q.height);h===void 0&&(h=S(pt,gt));let tt=g?S(pt,gt):h;return tt.width=pt,tt.height=gt,tt.getContext("2d").drawImage(T,0,0,pt,gt),Ht("WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+pt+"x"+gt+")."),tt}else return"data"in T&&Ht("WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),T;return T}function f(T){return T.generateMipmaps}function A(T){i.generateMipmap(T)}function I(T){return T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?i.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function E(T,g,H,X,Q,pt=!1){if(T!==null){if(i[T]!==void 0)return i[T];Ht("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let gt;X&&(gt=t.get("EXT_texture_norm16"),gt||Ht("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let tt=g;if(g===i.RED&&(H===i.FLOAT&&(tt=i.R32F),H===i.HALF_FLOAT&&(tt=i.R16F),H===i.UNSIGNED_BYTE&&(tt=i.R8),H===i.UNSIGNED_SHORT&&gt&&(tt=gt.R16_EXT),H===i.SHORT&&gt&&(tt=gt.R16_SNORM_EXT)),g===i.RED_INTEGER&&(H===i.UNSIGNED_BYTE&&(tt=i.R8UI),H===i.UNSIGNED_SHORT&&(tt=i.R16UI),H===i.UNSIGNED_INT&&(tt=i.R32UI),H===i.BYTE&&(tt=i.R8I),H===i.SHORT&&(tt=i.R16I),H===i.INT&&(tt=i.R32I)),g===i.RG&&(H===i.FLOAT&&(tt=i.RG32F),H===i.HALF_FLOAT&&(tt=i.RG16F),H===i.UNSIGNED_BYTE&&(tt=i.RG8),H===i.UNSIGNED_SHORT&&gt&&(tt=gt.RG16_EXT),H===i.SHORT&&gt&&(tt=gt.RG16_SNORM_EXT)),g===i.RG_INTEGER&&(H===i.UNSIGNED_BYTE&&(tt=i.RG8UI),H===i.UNSIGNED_SHORT&&(tt=i.RG16UI),H===i.UNSIGNED_INT&&(tt=i.RG32UI),H===i.BYTE&&(tt=i.RG8I),H===i.SHORT&&(tt=i.RG16I),H===i.INT&&(tt=i.RG32I)),g===i.RGB_INTEGER&&(H===i.UNSIGNED_BYTE&&(tt=i.RGB8UI),H===i.UNSIGNED_SHORT&&(tt=i.RGB16UI),H===i.UNSIGNED_INT&&(tt=i.RGB32UI),H===i.BYTE&&(tt=i.RGB8I),H===i.SHORT&&(tt=i.RGB16I),H===i.INT&&(tt=i.RGB32I)),g===i.RGBA_INTEGER&&(H===i.UNSIGNED_BYTE&&(tt=i.RGBA8UI),H===i.UNSIGNED_SHORT&&(tt=i.RGBA16UI),H===i.UNSIGNED_INT&&(tt=i.RGBA32UI),H===i.BYTE&&(tt=i.RGBA8I),H===i.SHORT&&(tt=i.RGBA16I),H===i.INT&&(tt=i.RGBA32I)),g===i.RGB&&(H===i.UNSIGNED_SHORT&&gt&&(tt=gt.RGB16_EXT),H===i.SHORT&&gt&&(tt=gt.RGB16_SNORM_EXT),H===i.UNSIGNED_INT_5_9_9_9_REV&&(tt=i.RGB9_E5),H===i.UNSIGNED_INT_10F_11F_11F_REV&&(tt=i.R11F_G11F_B10F)),g===i.RGBA){let st=pt?Qr:de.getTransfer(Q);H===i.FLOAT&&(tt=i.RGBA32F),H===i.HALF_FLOAT&&(tt=i.RGBA16F),H===i.UNSIGNED_BYTE&&(tt=st===ve?i.SRGB8_ALPHA8:i.RGBA8),H===i.UNSIGNED_SHORT&&gt&&(tt=gt.RGBA16_EXT),H===i.SHORT&&gt&&(tt=gt.RGBA16_SNORM_EXT),H===i.UNSIGNED_SHORT_4_4_4_4&&(tt=i.RGBA4),H===i.UNSIGNED_SHORT_5_5_5_1&&(tt=i.RGB5_A1)}return(tt===i.R16F||tt===i.R32F||tt===i.RG16F||tt===i.RG32F||tt===i.RGBA16F||tt===i.RGBA32F)&&t.get("EXT_color_buffer_float"),tt}function R(T,g){let H;return T?g===null||g===ai||g===Ar?H=i.DEPTH24_STENCIL8:g===oi?H=i.DEPTH32F_STENCIL8:g===Tr&&(H=i.DEPTH24_STENCIL8,Ht("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):g===null||g===ai||g===Ar?H=i.DEPTH_COMPONENT24:g===oi?H=i.DEPTH_COMPONENT32F:g===Tr&&(H=i.DEPTH_COMPONENT16),H}function w(T,g){return f(T)===!0||T.isFramebufferTexture&&T.minFilter!==an&&T.minFilter!==Ne?Math.log2(Math.max(g.width,g.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?g.mipmaps.length:1}function L(T){let g=T.target;g.removeEventListener("dispose",L),C(g),g.isVideoTexture&&d.delete(g),g.isHTMLTexture&&m.delete(g)}function v(T){let g=T.target;g.removeEventListener("dispose",v),O(g)}function C(T){let g=n.get(T);if(g.__webglInit===void 0)return;let H=T.source,X=_.get(H);if(X){let Q=X[g.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&V(T),Object.keys(X).length===0&&_.delete(H)}n.remove(T)}function V(T){let g=n.get(T);i.deleteTexture(g.__webglTexture);let H=T.source,X=_.get(H);delete X[g.__cacheKey],a.memory.textures--}function O(T){let g=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(g.__webglFramebuffer[X]))for(let Q=0;Q<g.__webglFramebuffer[X].length;Q++)i.deleteFramebuffer(g.__webglFramebuffer[X][Q]);else i.deleteFramebuffer(g.__webglFramebuffer[X]);g.__webglDepthbuffer&&i.deleteRenderbuffer(g.__webglDepthbuffer[X])}else{if(Array.isArray(g.__webglFramebuffer))for(let X=0;X<g.__webglFramebuffer.length;X++)i.deleteFramebuffer(g.__webglFramebuffer[X]);else i.deleteFramebuffer(g.__webglFramebuffer);if(g.__webglDepthbuffer&&i.deleteRenderbuffer(g.__webglDepthbuffer),g.__webglMultisampledFramebuffer&&i.deleteFramebuffer(g.__webglMultisampledFramebuffer),g.__webglColorRenderbuffer)for(let X=0;X<g.__webglColorRenderbuffer.length;X++)g.__webglColorRenderbuffer[X]&&i.deleteRenderbuffer(g.__webglColorRenderbuffer[X]);g.__webglDepthRenderbuffer&&i.deleteRenderbuffer(g.__webglDepthRenderbuffer)}let H=T.textures;for(let X=0,Q=H.length;X<Q;X++){let pt=n.get(H[X]);pt.__webglTexture&&(i.deleteTexture(pt.__webglTexture),a.memory.textures--),n.remove(H[X])}n.remove(T)}let W=0;function z(){W=0}function it(){return W}function G(T){W=T}function et(){let T=W;return T>=s.maxTextures&&Ht("WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),W+=1,T}function K(T){let g=[];return g.push(T.wrapS),g.push(T.wrapT),g.push(T.wrapR||0),g.push(T.magFilter),g.push(T.minFilter),g.push(T.anisotropy),g.push(T.internalFormat),g.push(T.format),g.push(T.type),g.push(T.generateMipmaps),g.push(T.premultiplyAlpha),g.push(T.flipY),g.push(T.unpackAlignment),g.push(T.colorSpace),g.join()}function rt(T,g){let H=n.get(T);if(T.isVideoTexture&&B(T),T.isRenderTargetTexture===!1&&T.isExternalTexture!==!0&&T.version>0&&H.__version!==T.version){let X=T.image;if(X===null)Ht("WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)Ht("WebGLRenderer: Texture marked for update but image is incomplete");else{Rt(H,T,g);return}}else T.isExternalTexture&&(H.__webglTexture=T.sourceTexture?T.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,H.__webglTexture,i.TEXTURE0+g)}function lt(T,g){let H=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&H.__version!==T.version){Rt(H,T,g);return}else T.isExternalTexture&&(H.__webglTexture=T.sourceTexture?T.sourceTexture:null);e.bindTexture(i.TEXTURE_2D_ARRAY,H.__webglTexture,i.TEXTURE0+g)}function mt(T,g){let H=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&H.__version!==T.version){Rt(H,T,g);return}e.bindTexture(i.TEXTURE_3D,H.__webglTexture,i.TEXTURE0+g)}function St(T,g){let H=n.get(T);if(T.isCubeDepthTexture!==!0&&T.version>0&&H.__version!==T.version){qt(H,T,g);return}e.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture,i.TEXTURE0+g)}let xt={[Eo]:i.REPEAT,[mi]:i.CLAMP_TO_EDGE,[To]:i.MIRRORED_REPEAT},le={[an]:i.NEAREST,[Sd]:i.NEAREST_MIPMAP_NEAREST,[ga]:i.NEAREST_MIPMAP_LINEAR,[Ne]:i.LINEAR,[tl]:i.LINEAR_MIPMAP_NEAREST,[ri]:i.LINEAR_MIPMAP_LINEAR},ye={[Ad]:i.NEVER,[Id]:i.ALWAYS,[wd]:i.LESS,[Ol]:i.LEQUAL,[Cd]:i.EQUAL,[Bl]:i.GEQUAL,[Rd]:i.GREATER,[Pd]:i.NOTEQUAL};function re(T,g){if(g.type===oi&&t.has("OES_texture_float_linear")===!1&&(g.magFilter===Ne||g.magFilter===tl||g.magFilter===ga||g.magFilter===ri||g.minFilter===Ne||g.minFilter===tl||g.minFilter===ga||g.minFilter===ri)&&Ht("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,xt[g.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,xt[g.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,xt[g.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,le[g.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,le[g.minFilter]),g.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,ye[g.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(g.magFilter===an||g.minFilter!==ga&&g.minFilter!==ri||g.type===oi&&t.has("OES_texture_float_linear")===!1)return;if(g.anisotropy>1||n.get(g).__currentAnisotropy){let H=t.get("EXT_texture_filter_anisotropic");i.texParameterf(T,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(g.anisotropy,s.getMaxAnisotropy())),n.get(g).__currentAnisotropy=g.anisotropy}}}function J(T,g){let H=!1;T.__webglInit===void 0&&(T.__webglInit=!0,g.addEventListener("dispose",L));let X=g.source,Q=_.get(X);Q===void 0&&(Q={},_.set(X,Q));let pt=K(g);if(pt!==T.__cacheKey){Q[pt]===void 0&&(Q[pt]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,H=!0),Q[pt].usedTimes++;let gt=Q[T.__cacheKey];gt!==void 0&&(Q[T.__cacheKey].usedTimes--,gt.usedTimes===0&&V(g)),T.__cacheKey=pt,T.__webglTexture=Q[pt].texture}return H}function ht(T,g,H){return Math.floor(Math.floor(T/H)/g)}function ut(T,g,H,X){let pt=T.updateRanges;if(pt.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,g.width,g.height,H,X,g.data);else{pt.sort((Ft,Et)=>Ft.start-Et.start);let gt=0;for(let Ft=1;Ft<pt.length;Ft++){let Et=pt[gt],Mt=pt[Ft],Ot=Et.start+Et.count,Vt=ht(Mt.start,g.width,4),Kt=ht(Et.start,g.width,4);Mt.start<=Ot+1&&Vt===Kt&&ht(Mt.start+Mt.count-1,g.width,4)===Vt?Et.count=Math.max(Et.count,Mt.start+Mt.count-Et.start):(++gt,pt[gt]=Mt)}pt.length=gt+1;let tt=e.getParameter(i.UNPACK_ROW_LENGTH),st=e.getParameter(i.UNPACK_SKIP_PIXELS),vt=e.getParameter(i.UNPACK_SKIP_ROWS);e.pixelStorei(i.UNPACK_ROW_LENGTH,g.width);for(let Ft=0,Et=pt.length;Ft<Et;Ft++){let Mt=pt[Ft],Ot=Math.floor(Mt.start/4),Vt=Math.ceil(Mt.count/4),Kt=Ot%g.width,N=Math.floor(Ot/g.width),_t=Vt,nt=1;e.pixelStorei(i.UNPACK_SKIP_PIXELS,Kt),e.pixelStorei(i.UNPACK_SKIP_ROWS,N),e.texSubImage2D(i.TEXTURE_2D,0,Kt,N,_t,nt,H,X,g.data)}T.clearUpdateRanges(),e.pixelStorei(i.UNPACK_ROW_LENGTH,tt),e.pixelStorei(i.UNPACK_SKIP_PIXELS,st),e.pixelStorei(i.UNPACK_SKIP_ROWS,vt)}}function Rt(T,g,H){let X=i.TEXTURE_2D;(g.isDataArrayTexture||g.isCompressedArrayTexture)&&(X=i.TEXTURE_2D_ARRAY),g.isData3DTexture&&(X=i.TEXTURE_3D);let Q=J(T,g),pt=g.source;e.bindTexture(X,T.__webglTexture,i.TEXTURE0+H);let gt=n.get(pt);if(pt.version!==gt.__version||Q===!0){if(e.activeTexture(i.TEXTURE0+H),(typeof ImageBitmap<"u"&&g.image instanceof ImageBitmap)===!1){let nt=de.getPrimaries(de.workingColorSpace),ct=g.colorSpace===Bi?null:de.getPrimaries(g.colorSpace),At=g.colorSpace===Bi||nt===ct?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,At)}e.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment);let st=x(g.image,!1,s.maxTextureSize);st=We(g,st);let vt=r.convert(g.format,g.colorSpace),Ft=r.convert(g.type),Et=E(g.internalFormat,vt,Ft,g.normalized,g.colorSpace,g.isVideoTexture);re(X,g);let Mt,Ot=g.mipmaps,Vt=g.isVideoTexture!==!0,Kt=gt.__version===void 0||Q===!0,N=pt.dataReady,_t=w(g,st);if(g.isDepthTexture)Et=R(g.format===hs,g.type),Kt&&(Vt?e.texStorage2D(i.TEXTURE_2D,1,Et,st.width,st.height):e.texImage2D(i.TEXTURE_2D,0,Et,st.width,st.height,0,vt,Ft,null));else if(g.isDataTexture)if(Ot.length>0){Vt&&Kt&&e.texStorage2D(i.TEXTURE_2D,_t,Et,Ot[0].width,Ot[0].height);for(let nt=0,ct=Ot.length;nt<ct;nt++)Mt=Ot[nt],Vt?N&&e.texSubImage2D(i.TEXTURE_2D,nt,0,0,Mt.width,Mt.height,vt,Ft,Mt.data):e.texImage2D(i.TEXTURE_2D,nt,Et,Mt.width,Mt.height,0,vt,Ft,Mt.data);g.generateMipmaps=!1}else Vt?(Kt&&e.texStorage2D(i.TEXTURE_2D,_t,Et,st.width,st.height),N&&ut(g,st,vt,Ft)):e.texImage2D(i.TEXTURE_2D,0,Et,st.width,st.height,0,vt,Ft,st.data);else if(g.isCompressedTexture)if(g.isCompressedArrayTexture){Vt&&Kt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,_t,Et,Ot[0].width,Ot[0].height,st.depth);for(let nt=0,ct=Ot.length;nt<ct;nt++)if(Mt=Ot[nt],g.format!==$n)if(vt!==null)if(Vt){if(N)if(g.layerUpdates.size>0){let At=wh(Mt.width,Mt.height,g.format,g.type);for(let at of g.layerUpdates){let Nt=Mt.data.subarray(at*At/Mt.data.BYTES_PER_ELEMENT,(at+1)*At/Mt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,nt,0,0,at,Mt.width,Mt.height,1,vt,Nt)}g.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,nt,0,0,0,Mt.width,Mt.height,st.depth,vt,Mt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,nt,Et,Mt.width,Mt.height,st.depth,0,Mt.data,0,0);else Ht("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Vt?N&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,nt,0,0,0,Mt.width,Mt.height,st.depth,vt,Ft,Mt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,nt,Et,Mt.width,Mt.height,st.depth,0,vt,Ft,Mt.data)}else{Vt&&Kt&&e.texStorage2D(i.TEXTURE_2D,_t,Et,Ot[0].width,Ot[0].height);for(let nt=0,ct=Ot.length;nt<ct;nt++)Mt=Ot[nt],g.format!==$n?vt!==null?Vt?N&&e.compressedTexSubImage2D(i.TEXTURE_2D,nt,0,0,Mt.width,Mt.height,vt,Mt.data):e.compressedTexImage2D(i.TEXTURE_2D,nt,Et,Mt.width,Mt.height,0,Mt.data):Ht("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Vt?N&&e.texSubImage2D(i.TEXTURE_2D,nt,0,0,Mt.width,Mt.height,vt,Ft,Mt.data):e.texImage2D(i.TEXTURE_2D,nt,Et,Mt.width,Mt.height,0,vt,Ft,Mt.data)}else if(g.isDataArrayTexture)if(Vt){if(Kt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,_t,Et,st.width,st.height,st.depth),N)if(g.layerUpdates.size>0){let nt=wh(st.width,st.height,g.format,g.type);for(let ct of g.layerUpdates){let At=st.data.subarray(ct*nt/st.data.BYTES_PER_ELEMENT,(ct+1)*nt/st.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ct,st.width,st.height,1,vt,Ft,At)}g.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,st.width,st.height,st.depth,vt,Ft,st.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Et,st.width,st.height,st.depth,0,vt,Ft,st.data);else if(g.isData3DTexture)Vt?(Kt&&e.texStorage3D(i.TEXTURE_3D,_t,Et,st.width,st.height,st.depth),N&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,st.width,st.height,st.depth,vt,Ft,st.data)):e.texImage3D(i.TEXTURE_3D,0,Et,st.width,st.height,st.depth,0,vt,Ft,st.data);else if(g.isFramebufferTexture){if(Kt)if(Vt)e.texStorage2D(i.TEXTURE_2D,_t,Et,st.width,st.height);else{let nt=st.width,ct=st.height;for(let At=0;At<_t;At++)e.texImage2D(i.TEXTURE_2D,At,Et,nt,ct,0,vt,Ft,null),nt>>=1,ct>>=1}}else if(g.isHTMLTexture){if("texElementImage2D"in i){let nt=i.canvas;if(nt.hasAttribute("layoutsubtree")||nt.setAttribute("layoutsubtree","true"),st.parentNode!==nt){nt.appendChild(st),m.add(g),nt.onpaint=ct=>{let At=ct.changedElements;for(let at of m)At.includes(at.image)&&(at.needsUpdate=!0)},nt.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,st);else{let At=i.RGBA,at=i.RGBA,Nt=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,At,at,Nt,st)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Ot.length>0){if(Vt&&Kt){let nt=me(Ot[0]);e.texStorage2D(i.TEXTURE_2D,_t,Et,nt.width,nt.height)}for(let nt=0,ct=Ot.length;nt<ct;nt++)Mt=Ot[nt],Vt?N&&e.texSubImage2D(i.TEXTURE_2D,nt,0,0,vt,Ft,Mt):e.texImage2D(i.TEXTURE_2D,nt,Et,vt,Ft,Mt);g.generateMipmaps=!1}else if(Vt){if(Kt){let nt=me(st);e.texStorage2D(i.TEXTURE_2D,_t,Et,nt.width,nt.height)}N&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,vt,Ft,st)}else e.texImage2D(i.TEXTURE_2D,0,Et,vt,Ft,st);f(g)&&A(X),gt.__version=pt.version,g.onUpdate&&g.onUpdate(g)}T.__version=g.version}function qt(T,g,H){if(g.image.length!==6)return;let X=J(T,g),Q=g.source;e.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+H);let pt=n.get(Q);if(Q.version!==pt.__version||X===!0){e.activeTexture(i.TEXTURE0+H);let gt=de.getPrimaries(de.workingColorSpace),tt=g.colorSpace===Bi?null:de.getPrimaries(g.colorSpace),st=g.colorSpace===Bi||gt===tt?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),e.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,st);let vt=g.isCompressedTexture||g.image[0].isCompressedTexture,Ft=g.image[0]&&g.image[0].isDataTexture,Et=[];for(let at=0;at<6;at++)!vt&&!Ft?Et[at]=x(g.image[at],!0,s.maxCubemapSize):Et[at]=Ft?g.image[at].image:g.image[at],Et[at]=We(g,Et[at]);let Mt=Et[0],Ot=r.convert(g.format,g.colorSpace),Vt=r.convert(g.type),Kt=E(g.internalFormat,Ot,Vt,g.normalized,g.colorSpace),N=g.isVideoTexture!==!0,_t=pt.__version===void 0||X===!0,nt=Q.dataReady,ct=w(g,Mt);re(i.TEXTURE_CUBE_MAP,g);let At;if(vt){N&&_t&&e.texStorage2D(i.TEXTURE_CUBE_MAP,ct,Kt,Mt.width,Mt.height);for(let at=0;at<6;at++){At=Et[at].mipmaps;for(let Nt=0;Nt<At.length;Nt++){let Dt=At[Nt];g.format!==$n?Ot!==null?N?nt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Nt,0,0,Dt.width,Dt.height,Ot,Dt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Nt,Kt,Dt.width,Dt.height,0,Dt.data):Ht("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):N?nt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Nt,0,0,Dt.width,Dt.height,Ot,Vt,Dt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Nt,Kt,Dt.width,Dt.height,0,Ot,Vt,Dt.data)}}}else{if(At=g.mipmaps,N&&_t){At.length>0&&ct++;let at=me(Et[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,ct,Kt,at.width,at.height)}for(let at=0;at<6;at++)if(Ft){N?nt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,Et[at].width,Et[at].height,Ot,Vt,Et[at].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,Kt,Et[at].width,Et[at].height,0,Ot,Vt,Et[at].data);for(let Nt=0;Nt<At.length;Nt++){let De=At[Nt].image[at].image;N?nt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Nt+1,0,0,De.width,De.height,Ot,Vt,De.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Nt+1,Kt,De.width,De.height,0,Ot,Vt,De.data)}}else{N?nt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,Ot,Vt,Et[at]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,Kt,Ot,Vt,Et[at]);for(let Nt=0;Nt<At.length;Nt++){let Dt=At[Nt];N?nt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Nt+1,0,0,Ot,Vt,Dt.image[at]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Nt+1,Kt,Ot,Vt,Dt.image[at])}}}f(g)&&A(i.TEXTURE_CUBE_MAP),pt.__version=Q.version,g.onUpdate&&g.onUpdate(g)}T.__version=g.version}function Gt(T,g,H,X,Q,pt){let gt=r.convert(H.format,H.colorSpace),tt=r.convert(H.type),st=E(H.internalFormat,gt,tt,H.normalized,H.colorSpace),vt=n.get(g),Ft=n.get(H);if(Ft.__renderTarget=g,!vt.__hasExternalTextures){let Et=Math.max(1,g.width>>pt),Mt=Math.max(1,g.height>>pt);Q===i.TEXTURE_3D||Q===i.TEXTURE_2D_ARRAY?e.texImage3D(Q,pt,st,Et,Mt,g.depth,0,gt,tt,null):e.texImage2D(Q,pt,st,Et,Mt,0,gt,tt,null)}e.bindFramebuffer(i.FRAMEBUFFER,T),Oe(g)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,X,Q,Ft.__webglTexture,0,Ie(g)):(Q===i.TEXTURE_2D||Q>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,X,Q,Ft.__webglTexture,pt),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Yt(T,g,H){if(i.bindRenderbuffer(i.RENDERBUFFER,T),g.depthBuffer){let X=g.depthTexture,Q=X&&X.isDepthTexture?X.type:null,pt=R(g.stencilBuffer,Q),gt=g.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;Oe(g)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ie(g),pt,g.width,g.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ie(g),pt,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,pt,g.width,g.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,gt,i.RENDERBUFFER,T)}else{let X=g.textures;for(let Q=0;Q<X.length;Q++){let pt=X[Q],gt=r.convert(pt.format,pt.colorSpace),tt=r.convert(pt.type),st=E(pt.internalFormat,gt,tt,pt.normalized,pt.colorSpace);Oe(g)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ie(g),st,g.width,g.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ie(g),st,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,st,g.width,g.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function te(T,g,H){let X=g.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(i.FRAMEBUFFER,T),!(g.depthTexture&&g.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let Q=n.get(g.depthTexture);if(Q.__renderTarget=g,(!Q.__webglTexture||g.depthTexture.image.width!==g.width||g.depthTexture.image.height!==g.height)&&(g.depthTexture.image.width=g.width,g.depthTexture.image.height=g.height,g.depthTexture.needsUpdate=!0),X){if(Q.__webglInit===void 0&&(Q.__webglInit=!0,g.depthTexture.addEventListener("dispose",L)),Q.__webglTexture===void 0){Q.__webglTexture=i.createTexture(),e.bindTexture(i.TEXTURE_CUBE_MAP,Q.__webglTexture),re(i.TEXTURE_CUBE_MAP,g.depthTexture);let vt=r.convert(g.depthTexture.format),Ft=r.convert(g.depthTexture.type),Et;g.depthTexture.format===gi?Et=i.DEPTH_COMPONENT24:g.depthTexture.format===hs&&(Et=i.DEPTH24_STENCIL8);for(let Mt=0;Mt<6;Mt++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,0,Et,g.width,g.height,0,vt,Ft,null)}}else rt(g.depthTexture,0);let pt=Q.__webglTexture,gt=Ie(g),tt=X?i.TEXTURE_CUBE_MAP_POSITIVE_X+H:i.TEXTURE_2D,st=g.depthTexture.format===hs?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(g.depthTexture.format===gi)Oe(g)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,st,tt,pt,0,gt):i.framebufferTexture2D(i.FRAMEBUFFER,st,tt,pt,0);else if(g.depthTexture.format===hs)Oe(g)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,st,tt,pt,0,gt):i.framebufferTexture2D(i.FRAMEBUFFER,st,tt,pt,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Me(T){let g=n.get(T),H=T.isWebGLCubeRenderTarget===!0;if(g.__boundDepthTexture!==T.depthTexture){let X=T.depthTexture;if(g.__depthDisposeCallback&&g.__depthDisposeCallback(),X){let Q=()=>{delete g.__boundDepthTexture,delete g.__depthDisposeCallback,X.removeEventListener("dispose",Q)};X.addEventListener("dispose",Q),g.__depthDisposeCallback=Q}g.__boundDepthTexture=X}if(T.depthTexture&&!g.__autoAllocateDepthBuffer)if(H)for(let X=0;X<6;X++)te(g.__webglFramebuffer[X],T,X);else{let X=T.texture.mipmaps;X&&X.length>0?te(g.__webglFramebuffer[0],T,0):te(g.__webglFramebuffer,T,0)}else if(H){g.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(e.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer[X]),g.__webglDepthbuffer[X]===void 0)g.__webglDepthbuffer[X]=i.createRenderbuffer(),Yt(g.__webglDepthbuffer[X],T,!1);else{let Q=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,pt=g.__webglDepthbuffer[X];i.bindRenderbuffer(i.RENDERBUFFER,pt),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,pt)}}else{let X=T.texture.mipmaps;if(X&&X.length>0?e.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer),g.__webglDepthbuffer===void 0)g.__webglDepthbuffer=i.createRenderbuffer(),Yt(g.__webglDepthbuffer,T,!1);else{let Q=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,pt=g.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,pt),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,pt)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function ce(T,g,H){let X=n.get(T);g!==void 0&&Gt(X.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),H!==void 0&&Me(T)}function se(T){let g=T.texture,H=n.get(T),X=n.get(g);T.addEventListener("dispose",v);let Q=T.textures,pt=T.isWebGLCubeRenderTarget===!0,gt=Q.length>1;if(gt||(X.__webglTexture===void 0&&(X.__webglTexture=i.createTexture()),X.__version=g.version,a.memory.textures++),pt){H.__webglFramebuffer=[];for(let tt=0;tt<6;tt++)if(g.mipmaps&&g.mipmaps.length>0){H.__webglFramebuffer[tt]=[];for(let st=0;st<g.mipmaps.length;st++)H.__webglFramebuffer[tt][st]=i.createFramebuffer()}else H.__webglFramebuffer[tt]=i.createFramebuffer()}else{if(g.mipmaps&&g.mipmaps.length>0){H.__webglFramebuffer=[];for(let tt=0;tt<g.mipmaps.length;tt++)H.__webglFramebuffer[tt]=i.createFramebuffer()}else H.__webglFramebuffer=i.createFramebuffer();if(gt)for(let tt=0,st=Q.length;tt<st;tt++){let vt=n.get(Q[tt]);vt.__webglTexture===void 0&&(vt.__webglTexture=i.createTexture(),a.memory.textures++)}if(T.samples>0&&Oe(T)===!1){H.__webglMultisampledFramebuffer=i.createFramebuffer(),H.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let tt=0;tt<Q.length;tt++){let st=Q[tt];H.__webglColorRenderbuffer[tt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,H.__webglColorRenderbuffer[tt]);let vt=r.convert(st.format,st.colorSpace),Ft=r.convert(st.type),Et=E(st.internalFormat,vt,Ft,st.normalized,st.colorSpace,T.isXRRenderTarget===!0),Mt=Ie(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,Mt,Et,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+tt,i.RENDERBUFFER,H.__webglColorRenderbuffer[tt])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(H.__webglDepthRenderbuffer=i.createRenderbuffer(),Yt(H.__webglDepthRenderbuffer,T,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(pt){e.bindTexture(i.TEXTURE_CUBE_MAP,X.__webglTexture),re(i.TEXTURE_CUBE_MAP,g);for(let tt=0;tt<6;tt++)if(g.mipmaps&&g.mipmaps.length>0)for(let st=0;st<g.mipmaps.length;st++)Gt(H.__webglFramebuffer[tt][st],T,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,st);else Gt(H.__webglFramebuffer[tt],T,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0);f(g)&&A(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(gt){for(let tt=0,st=Q.length;tt<st;tt++){let vt=Q[tt],Ft=n.get(vt),Et=i.TEXTURE_2D;(T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(Et=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Et,Ft.__webglTexture),re(Et,vt),Gt(H.__webglFramebuffer,T,vt,i.COLOR_ATTACHMENT0+tt,Et,0),f(vt)&&A(Et)}e.unbindTexture()}else{let tt=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(tt=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(tt,X.__webglTexture),re(tt,g),g.mipmaps&&g.mipmaps.length>0)for(let st=0;st<g.mipmaps.length;st++)Gt(H.__webglFramebuffer[st],T,g,i.COLOR_ATTACHMENT0,tt,st);else Gt(H.__webglFramebuffer,T,g,i.COLOR_ATTACHMENT0,tt,0);f(g)&&A(tt),e.unbindTexture()}T.depthBuffer&&Me(T)}function Fe(T){let g=T.textures;for(let H=0,X=g.length;H<X;H++){let Q=g[H];if(f(Q)){let pt=I(T),gt=n.get(Q).__webglTexture;e.bindTexture(pt,gt),A(pt),e.unbindTexture()}}}let Be=[],ze=[];function Ge(T){if(T.samples>0){if(Oe(T)===!1){let g=T.textures,H=T.width,X=T.height,Q=i.COLOR_BUFFER_BIT,pt=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,gt=n.get(T),tt=g.length>1;if(tt)for(let vt=0;vt<g.length;vt++)e.bindFramebuffer(i.FRAMEBUFFER,gt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,gt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,gt.__webglMultisampledFramebuffer);let st=T.texture.mipmaps;st&&st.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,gt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,gt.__webglFramebuffer);for(let vt=0;vt<g.length;vt++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(Q|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(Q|=i.STENCIL_BUFFER_BIT)),tt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,gt.__webglColorRenderbuffer[vt]);let Ft=n.get(g[vt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Ft,0)}i.blitFramebuffer(0,0,H,X,0,0,H,X,Q,i.NEAREST),c===!0&&(Be.length=0,ze.length=0,Be.push(i.COLOR_ATTACHMENT0+vt),T.depthBuffer&&T.resolveDepthBuffer===!1&&(Be.push(pt),ze.push(pt),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,ze)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Be))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),tt)for(let vt=0;vt<g.length;vt++){e.bindFramebuffer(i.FRAMEBUFFER,gt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.RENDERBUFFER,gt.__webglColorRenderbuffer[vt]);let Ft=n.get(g[vt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,gt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.TEXTURE_2D,Ft,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,gt.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&c){let g=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[g])}}}function Ie(T){return Math.min(s.maxSamples,T.samples)}function Oe(T){let g=n.get(T);return T.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&g.__useRenderToTexture!==!1}function B(T){let g=a.render.frame;d.get(T)!==g&&(d.set(T,g),T.update())}function We(T,g){let H=T.colorSpace,X=T.format,Q=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||H!==jr&&H!==Bi&&(de.getTransfer(H)===ve?(X!==$n||Q!==Sn)&&Ht("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Xt("WebGLTextures: Unsupported texture color space:",H)),g}function me(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(l.width=T.naturalWidth||T.width,l.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(l.width=T.displayWidth,l.height=T.displayHeight):(l.width=T.width,l.height=T.height),l}this.allocateTextureUnit=et,this.resetTextureUnits=z,this.getTextureUnits=it,this.setTextureUnits=G,this.setTexture2D=rt,this.setTexture2DArray=lt,this.setTexture3D=mt,this.setTextureCube=St,this.rebindTextures=ce,this.setupRenderTarget=se,this.updateRenderTargetMipmap=Fe,this.updateMultisampleRenderTarget=Ge,this.setupDepthRenderbuffer=Me,this.setupFrameBufferTexture=Gt,this.useMultisampledRTT=Oe,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function _x(i,t){function e(n,s=Bi){let r,a=de.getTransfer(s);if(n===Sn)return i.UNSIGNED_BYTE;if(n===nl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===il)return i.UNSIGNED_SHORT_5_5_5_1;if(n===mh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===gh)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===fh)return i.BYTE;if(n===ph)return i.SHORT;if(n===Tr)return i.UNSIGNED_SHORT;if(n===el)return i.INT;if(n===ai)return i.UNSIGNED_INT;if(n===oi)return i.FLOAT;if(n===Zn)return i.HALF_FLOAT;if(n===_h)return i.ALPHA;if(n===xh)return i.RGB;if(n===$n)return i.RGBA;if(n===gi)return i.DEPTH_COMPONENT;if(n===hs)return i.DEPTH_STENCIL;if(n===vh)return i.RED;if(n===sl)return i.RED_INTEGER;if(n===us)return i.RG;if(n===rl)return i.RG_INTEGER;if(n===al)return i.RGBA_INTEGER;if(n===_a||n===xa||n===va||n===ya)if(a===ve)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===_a)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===xa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===va)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ya)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===_a)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===xa)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===va)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ya)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ol||n===ll||n===cl||n===hl)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ol)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ll)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===cl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===hl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ul||n===dl||n===fl||n===pl||n===ml||n===Ma||n===gl)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===ul||n===dl)return a===ve?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===fl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===pl)return r.COMPRESSED_R11_EAC;if(n===ml)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Ma)return r.COMPRESSED_RG11_EAC;if(n===gl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===_l||n===xl||n===vl||n===yl||n===Ml||n===bl||n===Sl||n===El||n===Tl||n===Al||n===wl||n===Cl||n===Rl||n===Pl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===_l)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===xl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===vl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===yl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ml)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===bl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Sl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===El)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Tl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Al)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===wl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Cl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Rl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Pl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Il||n===Dl||n===Ll)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Il)return a===ve?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Dl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ll)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Nl||n===Ul||n===ba||n===Fl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Nl)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ul)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ba)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Fl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ar?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}var xx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,vx=`
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

}`,qh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new ca(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new Se({vertexShader:xx,fragmentShader:vx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Ke(new _i(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Yh=class extends ii{constructor(t,e){super();let n=this,s=null,r=1,a=null,o="local-floor",c=1,l=null,d=null,m=null,h=null,_=null,p=null,S=typeof XRWebGLBinding<"u",x=new qh,f={},A=e.getContextAttributes(),I=null,E=null,R=[],w=[],L=new $t,v=null,C=new mn;C.viewport=new Pe;let V=new mn;V.viewport=new Pe;let O=[C,V],W=new Jo,z=null,it=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let ht=R[J];return ht===void 0&&(ht=new _r,R[J]=ht),ht.getTargetRaySpace()},this.getControllerGrip=function(J){let ht=R[J];return ht===void 0&&(ht=new _r,R[J]=ht),ht.getGripSpace()},this.getHand=function(J){let ht=R[J];return ht===void 0&&(ht=new _r,R[J]=ht),ht.getHandSpace()};function G(J){let ht=w.indexOf(J.inputSource);if(ht===-1)return;let ut=R[ht];ut!==void 0&&(ut.update(J.inputSource,J.frame,l||a),ut.dispatchEvent({type:J.type,data:J.inputSource}))}function et(){s.removeEventListener("select",G),s.removeEventListener("selectstart",G),s.removeEventListener("selectend",G),s.removeEventListener("squeeze",G),s.removeEventListener("squeezestart",G),s.removeEventListener("squeezeend",G),s.removeEventListener("end",et),s.removeEventListener("inputsourceschange",K);for(let J=0;J<R.length;J++){let ht=w[J];ht!==null&&(w[J]=null,R[J].disconnect(ht))}z=null,it=null,x.reset();for(let J in f)delete f[J];t.setRenderTarget(I),_=null,h=null,m=null,s=null,E=null,re.stop(),n.isPresenting=!1,t.setPixelRatio(v),t.setSize(L.width,L.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,n.isPresenting===!0&&Ht("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){o=J,n.isPresenting===!0&&Ht("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(J){l=J},this.getBaseLayer=function(){return h!==null?h:_},this.getBinding=function(){return m===null&&S&&(m=new XRWebGLBinding(s,e)),m},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(J){if(s=J,s!==null){if(I=t.getRenderTarget(),s.addEventListener("select",G),s.addEventListener("selectstart",G),s.addEventListener("selectend",G),s.addEventListener("squeeze",G),s.addEventListener("squeezestart",G),s.addEventListener("squeezeend",G),s.addEventListener("end",et),s.addEventListener("inputsourceschange",K),A.xrCompatible!==!0&&await e.makeXRCompatible(),v=t.getPixelRatio(),t.getSize(L),S&&"createProjectionLayer"in XRWebGLBinding.prototype){let ut=null,Rt=null,qt=null;A.depth&&(qt=A.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,ut=A.stencil?hs:gi,Rt=A.stencil?Ar:ai);let Gt={colorFormat:e.RGBA8,depthFormat:qt,scaleFactor:r};m=this.getBinding(),h=m.createProjectionLayer(Gt),s.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),E=new gn(h.textureWidth,h.textureHeight,{format:$n,type:Sn,depthTexture:new Oi(h.textureWidth,h.textureHeight,Rt,void 0,void 0,void 0,void 0,void 0,void 0,ut),stencilBuffer:A.stencil,colorSpace:t.outputColorSpace,samples:A.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}else{let ut={antialias:A.antialias,alpha:!0,depth:A.depth,stencil:A.stencil,framebufferScaleFactor:r};_=new XRWebGLLayer(s,e,ut),s.updateRenderState({baseLayer:_}),t.setPixelRatio(1),t.setSize(_.framebufferWidth,_.framebufferHeight,!1),E=new gn(_.framebufferWidth,_.framebufferHeight,{format:$n,type:Sn,colorSpace:t.outputColorSpace,stencilBuffer:A.stencil,resolveDepthBuffer:_.ignoreDepthValues===!1,resolveStencilBuffer:_.ignoreDepthValues===!1})}E.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),re.setContext(s),re.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function K(J){for(let ht=0;ht<J.removed.length;ht++){let ut=J.removed[ht],Rt=w.indexOf(ut);Rt>=0&&(w[Rt]=null,R[Rt].disconnect(ut))}for(let ht=0;ht<J.added.length;ht++){let ut=J.added[ht],Rt=w.indexOf(ut);if(Rt===-1){for(let Gt=0;Gt<R.length;Gt++)if(Gt>=w.length){w.push(ut),Rt=Gt;break}else if(w[Gt]===null){w[Gt]=ut,Rt=Gt;break}if(Rt===-1)break}let qt=R[Rt];qt&&qt.connect(ut)}}let rt=new F,lt=new F;function mt(J,ht,ut){rt.setFromMatrixPosition(ht.matrixWorld),lt.setFromMatrixPosition(ut.matrixWorld);let Rt=rt.distanceTo(lt),qt=ht.projectionMatrix.elements,Gt=ut.projectionMatrix.elements,Yt=qt[14]/(qt[10]-1),te=qt[14]/(qt[10]+1),Me=(qt[9]+1)/qt[5],ce=(qt[9]-1)/qt[5],se=(qt[8]-1)/qt[0],Fe=(Gt[8]+1)/Gt[0],Be=Yt*se,ze=Yt*Fe,Ge=Rt/(-se+Fe),Ie=Ge*-se;if(ht.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(Ie),J.translateZ(Ge),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),qt[10]===-1)J.projectionMatrix.copy(ht.projectionMatrix),J.projectionMatrixInverse.copy(ht.projectionMatrixInverse);else{let Oe=Yt+Ge,B=te+Ge,We=Be-Ie,me=ze+(Rt-Ie),T=Me*te/B*Oe,g=ce*te/B*Oe;J.projectionMatrix.makePerspective(We,me,T,g,Oe,B),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function St(J,ht){ht===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(ht.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(s===null)return;let ht=J.near,ut=J.far;x.texture!==null&&(x.depthNear>0&&(ht=x.depthNear),x.depthFar>0&&(ut=x.depthFar)),W.near=V.near=C.near=ht,W.far=V.far=C.far=ut,(z!==W.near||it!==W.far)&&(s.updateRenderState({depthNear:W.near,depthFar:W.far}),z=W.near,it=W.far),W.layers.mask=J.layers.mask|6,C.layers.mask=W.layers.mask&-5,V.layers.mask=W.layers.mask&-3;let Rt=J.parent,qt=W.cameras;St(W,Rt);for(let Gt=0;Gt<qt.length;Gt++)St(qt[Gt],Rt);qt.length===2?mt(W,C,V):W.projectionMatrix.copy(C.projectionMatrix),xt(J,W,Rt)};function xt(J,ht,ut){ut===null?J.matrix.copy(ht.matrixWorld):(J.matrix.copy(ut.matrixWorld),J.matrix.invert(),J.matrix.multiply(ht.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(ht.projectionMatrix),J.projectionMatrixInverse.copy(ht.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=mr*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return W},this.getFoveation=function(){if(!(h===null&&_===null))return c},this.setFoveation=function(J){c=J,h!==null&&(h.fixedFoveation=J),_!==null&&_.fixedFoveation!==void 0&&(_.fixedFoveation=J)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(W)},this.getCameraTexture=function(J){return f[J]};let le=null;function ye(J,ht){if(d=ht.getViewerPose(l||a),p=ht,d!==null){let ut=d.views;_!==null&&(t.setRenderTargetFramebuffer(E,_.framebuffer),t.setRenderTarget(E));let Rt=!1;ut.length!==W.cameras.length&&(W.cameras.length=0,Rt=!0);for(let te=0;te<ut.length;te++){let Me=ut[te],ce=null;if(_!==null)ce=_.getViewport(Me);else{let Fe=m.getViewSubImage(h,Me);ce=Fe.viewport,te===0&&(t.setRenderTargetTextures(E,Fe.colorTexture,Fe.depthStencilTexture),t.setRenderTarget(E))}let se=O[te];se===void 0&&(se=new mn,se.layers.enable(te),se.viewport=new Pe,O[te]=se),se.matrix.fromArray(Me.transform.matrix),se.matrix.decompose(se.position,se.quaternion,se.scale),se.projectionMatrix.fromArray(Me.projectionMatrix),se.projectionMatrixInverse.copy(se.projectionMatrix).invert(),se.viewport.set(ce.x,ce.y,ce.width,ce.height),te===0&&(W.matrix.copy(se.matrix),W.matrix.decompose(W.position,W.quaternion,W.scale)),Rt===!0&&W.cameras.push(se)}let qt=s.enabledFeatures;if(qt&&qt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&S){m=n.getBinding();let te=m.getDepthInformation(ut[0]);te&&te.isValid&&te.texture&&x.init(te,s.renderState)}if(qt&&qt.includes("camera-access")&&S){t.state.unbindTexture(),m=n.getBinding();for(let te=0;te<ut.length;te++){let Me=ut[te].camera;if(Me){let ce=f[Me];ce||(ce=new ca,f[Me]=ce);let se=m.getCameraImage(Me);ce.sourceTexture=se}}}}for(let ut=0;ut<R.length;ut++){let Rt=w[ut],qt=R[ut];Rt!==null&&qt!==void 0&&qt.update(Rt,ht,l||a)}le&&le(J,ht),ht.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ht}),p=null}let re=new lf;re.setAnimationLoop(ye),this.setAnimationLoop=function(J){le=J},this.dispose=function(){}}},yx=new Ue,pf=new Jt;pf.set(-1,0,0,0,1,0,0,0,1);function Mx(i,t){function e(x,f){x.matrixAutoUpdate===!0&&x.updateMatrix(),f.value.copy(x.matrix)}function n(x,f){f.color.getRGB(x.fogColor.value,Eh(i)),f.isFog?(x.fogNear.value=f.near,x.fogFar.value=f.far):f.isFogExp2&&(x.fogDensity.value=f.density)}function s(x,f,A,I,E){f.isNodeMaterial?f.uniformsNeedUpdate=!1:f.isMeshBasicMaterial?r(x,f):f.isMeshLambertMaterial?(r(x,f),f.envMap&&(x.envMapIntensity.value=f.envMapIntensity)):f.isMeshToonMaterial?(r(x,f),m(x,f)):f.isMeshPhongMaterial?(r(x,f),d(x,f),f.envMap&&(x.envMapIntensity.value=f.envMapIntensity)):f.isMeshStandardMaterial?(r(x,f),h(x,f),f.isMeshPhysicalMaterial&&_(x,f,E)):f.isMeshMatcapMaterial?(r(x,f),p(x,f)):f.isMeshDepthMaterial?r(x,f):f.isMeshDistanceMaterial?(r(x,f),S(x,f)):f.isMeshNormalMaterial?r(x,f):f.isLineBasicMaterial?(a(x,f),f.isLineDashedMaterial&&o(x,f)):f.isPointsMaterial?c(x,f,A,I):f.isSpriteMaterial?l(x,f):f.isShadowMaterial?(x.color.value.copy(f.color),x.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(x,f){x.opacity.value=f.opacity,f.color&&x.diffuse.value.copy(f.color),f.emissive&&x.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(x.map.value=f.map,e(f.map,x.mapTransform)),f.alphaMap&&(x.alphaMap.value=f.alphaMap,e(f.alphaMap,x.alphaMapTransform)),f.bumpMap&&(x.bumpMap.value=f.bumpMap,e(f.bumpMap,x.bumpMapTransform),x.bumpScale.value=f.bumpScale,f.side===cn&&(x.bumpScale.value*=-1)),f.normalMap&&(x.normalMap.value=f.normalMap,e(f.normalMap,x.normalMapTransform),x.normalScale.value.copy(f.normalScale),f.side===cn&&x.normalScale.value.negate()),f.displacementMap&&(x.displacementMap.value=f.displacementMap,e(f.displacementMap,x.displacementMapTransform),x.displacementScale.value=f.displacementScale,x.displacementBias.value=f.displacementBias),f.emissiveMap&&(x.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,x.emissiveMapTransform)),f.specularMap&&(x.specularMap.value=f.specularMap,e(f.specularMap,x.specularMapTransform)),f.alphaTest>0&&(x.alphaTest.value=f.alphaTest);let A=t.get(f),I=A.envMap,E=A.envMapRotation;I&&(x.envMap.value=I,x.envMapRotation.value.setFromMatrix4(yx.makeRotationFromEuler(E)).transpose(),I.isCubeTexture&&I.isRenderTargetTexture===!1&&x.envMapRotation.value.premultiply(pf),x.reflectivity.value=f.reflectivity,x.ior.value=f.ior,x.refractionRatio.value=f.refractionRatio),f.lightMap&&(x.lightMap.value=f.lightMap,x.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,x.lightMapTransform)),f.aoMap&&(x.aoMap.value=f.aoMap,x.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,x.aoMapTransform))}function a(x,f){x.diffuse.value.copy(f.color),x.opacity.value=f.opacity,f.map&&(x.map.value=f.map,e(f.map,x.mapTransform))}function o(x,f){x.dashSize.value=f.dashSize,x.totalSize.value=f.dashSize+f.gapSize,x.scale.value=f.scale}function c(x,f,A,I){x.diffuse.value.copy(f.color),x.opacity.value=f.opacity,x.size.value=f.size*A,x.scale.value=I*.5,f.map&&(x.map.value=f.map,e(f.map,x.uvTransform)),f.alphaMap&&(x.alphaMap.value=f.alphaMap,e(f.alphaMap,x.alphaMapTransform)),f.alphaTest>0&&(x.alphaTest.value=f.alphaTest)}function l(x,f){x.diffuse.value.copy(f.color),x.opacity.value=f.opacity,x.rotation.value=f.rotation,f.map&&(x.map.value=f.map,e(f.map,x.mapTransform)),f.alphaMap&&(x.alphaMap.value=f.alphaMap,e(f.alphaMap,x.alphaMapTransform)),f.alphaTest>0&&(x.alphaTest.value=f.alphaTest)}function d(x,f){x.specular.value.copy(f.specular),x.shininess.value=Math.max(f.shininess,1e-4)}function m(x,f){f.gradientMap&&(x.gradientMap.value=f.gradientMap)}function h(x,f){x.metalness.value=f.metalness,f.metalnessMap&&(x.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,x.metalnessMapTransform)),x.roughness.value=f.roughness,f.roughnessMap&&(x.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,x.roughnessMapTransform)),f.envMap&&(x.envMapIntensity.value=f.envMapIntensity)}function _(x,f,A){x.ior.value=f.ior,f.sheen>0&&(x.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),x.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(x.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,x.sheenColorMapTransform)),f.sheenRoughnessMap&&(x.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,x.sheenRoughnessMapTransform))),f.clearcoat>0&&(x.clearcoat.value=f.clearcoat,x.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(x.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,x.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(x.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,x.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(x.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,x.clearcoatNormalMapTransform),x.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===cn&&x.clearcoatNormalScale.value.negate())),f.dispersion>0&&(x.dispersion.value=f.dispersion),f.iridescence>0&&(x.iridescence.value=f.iridescence,x.iridescenceIOR.value=f.iridescenceIOR,x.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],x.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(x.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,x.iridescenceMapTransform)),f.iridescenceThicknessMap&&(x.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,x.iridescenceThicknessMapTransform))),f.transmission>0&&(x.transmission.value=f.transmission,x.transmissionSamplerMap.value=A.texture,x.transmissionSamplerSize.value.set(A.width,A.height),f.transmissionMap&&(x.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,x.transmissionMapTransform)),x.thickness.value=f.thickness,f.thicknessMap&&(x.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,x.thicknessMapTransform)),x.attenuationDistance.value=f.attenuationDistance,x.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(x.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(x.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,x.anisotropyMapTransform))),x.specularIntensity.value=f.specularIntensity,x.specularColor.value.copy(f.specularColor),f.specularColorMap&&(x.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,x.specularColorMapTransform)),f.specularIntensityMap&&(x.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,x.specularIntensityMapTransform))}function p(x,f){f.matcap&&(x.matcap.value=f.matcap)}function S(x,f){let A=t.get(f).light;x.referencePosition.value.setFromMatrixPosition(A.matrixWorld),x.nearDistance.value=A.shadow.camera.near,x.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function bx(i,t,e,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(E,R){let w=R.program;n.uniformBlockBinding(E,w)}function l(E,R){let w=s[E.id];w===void 0&&(x(E),w=d(E),s[E.id]=w,E.addEventListener("dispose",A));let L=R.program;n.updateUBOMapping(E,L);let v=t.render.frame;r[E.id]!==v&&(h(E),r[E.id]=v)}function d(E){let R=m();E.__bindingPointIndex=R;let w=i.createBuffer(),L=E.__size,v=E.usage;return i.bindBuffer(i.UNIFORM_BUFFER,w),i.bufferData(i.UNIFORM_BUFFER,L,v),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,R,w),w}function m(){for(let E=0;E<o;E++)if(a.indexOf(E)===-1)return a.push(E),E;return Xt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(E){let R=s[E.id],w=E.uniforms,L=E.__cache;i.bindBuffer(i.UNIFORM_BUFFER,R);for(let v=0,C=w.length;v<C;v++){let V=w[v];if(Array.isArray(V))for(let O=0,W=V.length;O<W;O++)_(V[O],v,O,L);else _(V,v,0,L)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function _(E,R,w,L){if(S(E,R,w,L)===!0){let v=E.__offset,C=E.value;if(Array.isArray(C)){let V=0;for(let O=0;O<C.length;O++){let W=C[O],z=f(W);p(W,E.__data,V),typeof W!="number"&&typeof W!="boolean"&&!W.isMatrix3&&!ArrayBuffer.isView(W)&&(V+=z.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(C,E.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,v,E.__data)}}function p(E,R,w){typeof E=="number"||typeof E=="boolean"?R[0]=E:E.isMatrix3?(R[0]=E.elements[0],R[1]=E.elements[1],R[2]=E.elements[2],R[3]=0,R[4]=E.elements[3],R[5]=E.elements[4],R[6]=E.elements[5],R[7]=0,R[8]=E.elements[6],R[9]=E.elements[7],R[10]=E.elements[8],R[11]=0):ArrayBuffer.isView(E)?R.set(new E.constructor(E.buffer,E.byteOffset,R.length)):E.toArray(R,w)}function S(E,R,w,L){let v=E.value,C=R+"_"+w;if(L[C]===void 0)return typeof v=="number"||typeof v=="boolean"?L[C]=v:ArrayBuffer.isView(v)?L[C]=v.slice():L[C]=v.clone(),!0;{let V=L[C];if(typeof v=="number"||typeof v=="boolean"){if(V!==v)return L[C]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(V.equals(v)===!1)return V.copy(v),!0}}return!1}function x(E){let R=E.uniforms,w=0,L=16;for(let C=0,V=R.length;C<V;C++){let O=Array.isArray(R[C])?R[C]:[R[C]];for(let W=0,z=O.length;W<z;W++){let it=O[W],G=Array.isArray(it.value)?it.value:[it.value];for(let et=0,K=G.length;et<K;et++){let rt=G[et],lt=f(rt),mt=w%L,St=mt%lt.boundary,xt=mt+St;w+=St,xt!==0&&L-xt<lt.storage&&(w+=L-xt),it.__data=new Float32Array(lt.storage/Float32Array.BYTES_PER_ELEMENT),it.__offset=w,w+=lt.storage}}}let v=w%L;return v>0&&(w+=L-v),E.__size=w,E.__cache={},this}function f(E){let R={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(R.boundary=4,R.storage=4):E.isVector2?(R.boundary=8,R.storage=8):E.isVector3||E.isColor?(R.boundary=16,R.storage=12):E.isVector4?(R.boundary=16,R.storage=16):E.isMatrix3?(R.boundary=48,R.storage=48):E.isMatrix4?(R.boundary=64,R.storage=64):E.isTexture?Ht("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(E)?(R.boundary=16,R.storage=E.byteLength):Ht("WebGLRenderer: Unsupported uniform value type.",E),R}function A(E){let R=E.target;R.removeEventListener("dispose",A);let w=a.indexOf(R.__bindingPointIndex);a.splice(w,1),i.deleteBuffer(s[R.id]),delete s[R.id],delete r[R.id]}function I(){for(let E in s)i.deleteBuffer(s[E]);a=[],s={},r={}}return{bind:c,update:l,dispose:I}}var Sx=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),yi=null;function Ex(){return yi===null&&(yi=new Po(Sx,16,16,us,Zn),yi.name="DFG_LUT",yi.minFilter=Ne,yi.magFilter=Ne,yi.wrapS=mi,yi.wrapT=mi,yi.generateMipmaps=!1,yi.needsUpdate=!0),yi}var Gl=class{constructor(t={}){let{canvas:e=Dd(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:m=!1,reversedDepthBuffer:h=!1,outputBufferType:_=Sn}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;let S=_,x=new Set([al,rl,sl]),f=new Set([Sn,ai,Tr,Ar,nl,il]),A=new Uint32Array(4),I=new Int32Array(4),E=new F,R=null,w=null,L=[],v=[],C=null;this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=si,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let V=this,O=!1,W=null,z=null,it=null,G=null;this._outputColorSpace=Vn;let et=0,K=0,rt=null,lt=-1,mt=null,St=new Pe,xt=new Pe,le=null,ye=new zt(0),re=0,J=e.width,ht=e.height,ut=1,Rt=null,qt=null,Gt=new Pe(0,0,J,ht),Yt=new Pe(0,0,J,ht),te=!1,Me=new oa,ce=!1,se=!1,Fe=new Ue,Be=new F,ze=new Pe,Ge={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ie=!1;function Oe(){return rt===null?ut:1}let B=n;function We(y,k){return e.getContext(y,k)}try{let y={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:d,failIfMajorPerformanceCaveat:m};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"185"}`),e.addEventListener("webglcontextlost",De,!1),e.addEventListener("webglcontextrestored",ge,!1),e.addEventListener("webglcontextcreationerror",Nn,!1),B===null){let k="webgl2";if(B=We(k,y),B===null)throw We(k)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(y){throw Xt("WebGLRenderer: "+y.message),y}let me,T,g,H,X,Q,pt,gt,tt,st,vt,Ft,Et,Mt,Ot,Vt,Kt,N,_t,nt,ct,At,at;function Nt(){me=new I0(B),me.init(),ct=new _x(B,me),T=new S0(B,me,t,ct),g=new mx(B,me),T.reversedDepthBuffer&&h&&g.buffers.depth.setReversed(!0),z=B.createFramebuffer(),it=B.createFramebuffer(),G=B.createFramebuffer(),H=new N0(B),X=new ex,Q=new gx(B,me,g,X,T,ct,H),pt=new P0(V),gt=new Bp(B),At=new M0(B,gt),tt=new D0(B,gt,H,At),st=new F0(B,tt,gt,At,H),N=new U0(B,T,Q),Ot=new E0(X),vt=new tx(V,pt,me,T,At,Ot),Ft=new Mx(V,X),Et=new ix,Mt=new cx(me),Kt=new y0(V,pt,g,st,p,c),Vt=new px(V,st,T),at=new bx(B,H,T,g),_t=new b0(B,me,H),nt=new L0(B,me,H),H.programs=vt.programs,V.capabilities=T,V.extensions=me,V.properties=X,V.renderLists=Et,V.shadowMap=Vt,V.state=g,V.info=H}Nt(),S!==Sn&&(C=new B0(S,e.width,e.height,o,s,r));let Dt=new Yh(V,B);this.xr=Dt,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){let y=me.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){let y=me.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return ut},this.setPixelRatio=function(y){y!==void 0&&(ut=y,this.setSize(J,ht,!1))},this.getSize=function(y){return y.set(J,ht)},this.setSize=function(y,k,$=!0){if(Dt.isPresenting){Ht("WebGLRenderer: Can't change size while VR device is presenting.");return}J=y,ht=k,e.width=Math.floor(y*ut),e.height=Math.floor(k*ut),$===!0&&(e.style.width=y+"px",e.style.height=k+"px"),C!==null&&C.setSize(e.width,e.height),this.setViewport(0,0,y,k)},this.getDrawingBufferSize=function(y){return y.set(J*ut,ht*ut).floor()},this.setDrawingBufferSize=function(y,k,$){J=y,ht=k,ut=$,e.width=Math.floor(y*$),e.height=Math.floor(k*$),this.setViewport(0,0,y,k)},this.setEffects=function(y){if(S===Sn){Xt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(y){for(let k=0;k<y.length;k++)if(y[k].isOutputPass===!0){Ht("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}C.setEffects(y||[])},this.getCurrentViewport=function(y){return y.copy(St)},this.getViewport=function(y){return y.copy(Gt)},this.setViewport=function(y,k,$,Y){y.isVector4?Gt.set(y.x,y.y,y.z,y.w):Gt.set(y,k,$,Y),g.viewport(St.copy(Gt).multiplyScalar(ut).round())},this.getScissor=function(y){return y.copy(Yt)},this.setScissor=function(y,k,$,Y){y.isVector4?Yt.set(y.x,y.y,y.z,y.w):Yt.set(y,k,$,Y),g.scissor(xt.copy(Yt).multiplyScalar(ut).round())},this.getScissorTest=function(){return te},this.setScissorTest=function(y){g.setScissorTest(te=y)},this.setOpaqueSort=function(y){Rt=y},this.setTransparentSort=function(y){qt=y},this.getClearColor=function(y){return y.copy(Kt.getClearColor())},this.setClearColor=function(){Kt.setClearColor(...arguments)},this.getClearAlpha=function(){return Kt.getClearAlpha()},this.setClearAlpha=function(){Kt.setClearAlpha(...arguments)},this.clear=function(y=!0,k=!0,$=!0){let Y=0;if(y){let q=!1;if(rt!==null){let yt=rt.texture.format;q=x.has(yt)}if(q){let yt=rt.texture.type,Ct=f.has(yt),bt=Kt.getClearColor(),Pt=Kt.getClearAlpha(),Ut=bt.r,Wt=bt.g,jt=bt.b;Ct?(A[0]=Ut,A[1]=Wt,A[2]=jt,A[3]=Pt,B.clearBufferuiv(B.COLOR,0,A)):(I[0]=Ut,I[1]=Wt,I[2]=jt,I[3]=Pt,B.clearBufferiv(B.COLOR,0,I))}else Y|=B.COLOR_BUFFER_BIT}k&&(Y|=B.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),$&&(Y|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),Y!==0&&B.clear(Y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(y){y.setRenderer(this),W=y},this.dispose=function(){e.removeEventListener("webglcontextlost",De,!1),e.removeEventListener("webglcontextrestored",ge,!1),e.removeEventListener("webglcontextcreationerror",Nn,!1),Kt.dispose(),Et.dispose(),Mt.dispose(),X.dispose(),pt.dispose(),st.dispose(),At.dispose(),at.dispose(),vt.dispose(),Dt.dispose(),Dt.removeEventListener("sessionstart",Jn),Dt.removeEventListener("sessionend",Kn),li.stop()};function De(y){y.preventDefault(),bh("WebGLRenderer: Context Lost."),O=!0}function ge(){bh("WebGLRenderer: Context Restored."),O=!1;let y=H.autoReset,k=Vt.enabled,$=Vt.autoUpdate,Y=Vt.needsUpdate,q=Vt.type;Nt(),H.autoReset=y,Vt.enabled=k,Vt.autoUpdate=$,Vt.needsUpdate=Y,Vt.type=q}function Nn(y){Xt("WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function En(y){let k=y.target;k.removeEventListener("dispose",En),jl(k)}function jl(y){Lr(y),X.remove(y)}function Lr(y){let k=X.get(y).programs;k!==void 0&&(k.forEach(function($){vt.releaseProgram($)}),y.isShaderMaterial&&vt.releaseShaderCache(y))}this.renderBufferDirect=function(y,k,$,Y,q,yt){k===null&&(k=Ge);let Ct=q.isMesh&&q.matrixWorld.determinantAffine()<0,bt=Ze(y,k,$,Y,q);g.setMaterial(Y,Ct);let Pt=$.index,Ut=1;if(Y.wireframe===!0){if(Pt=tt.getWireframeAttribute($),Pt===void 0)return;Ut=2}let Wt=$.drawRange,jt=$.attributes.position,Lt=Wt.start*Ut,pe=(Wt.start+Wt.count)*Ut;yt!==null&&(Lt=Math.max(Lt,yt.start*Ut),pe=Math.min(pe,(yt.start+yt.count)*Ut)),Pt!==null?(Lt=Math.max(Lt,0),pe=Math.min(pe,Pt.count)):jt!=null&&(Lt=Math.max(Lt,0),pe=Math.min(pe,jt.count));let Le=pe-Lt;if(Le<0||Le===1/0)return;At.setup(q,Y,bt,$,Pt);let Ce,he=_t;if(Pt!==null&&(Ce=gt.get(Pt),he=nt,he.setIndex(Ce)),q.isMesh)Y.wireframe===!0?(g.setLineWidth(Y.wireframeLinewidth*Oe()),he.setMode(B.LINES)):he.setMode(B.TRIANGLES);else if(q.isLine){let Ve=Y.linewidth;Ve===void 0&&(Ve=1),g.setLineWidth(Ve*Oe()),q.isLineSegments?he.setMode(B.LINES):q.isLineLoop?he.setMode(B.LINE_LOOP):he.setMode(B.LINE_STRIP)}else q.isPoints?he.setMode(B.POINTS):q.isSprite&&he.setMode(B.TRIANGLES);if(q.isBatchedMesh)if(me.get("WEBGL_multi_draw"))he.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else{let Ve=q._multiDrawStarts,Tt=q._multiDrawCounts,on=q._multiDrawCount,ae=Pt?gt.get(Pt).bytesPerElement:1,hn=X.get(Y).currentProgram.getUniforms();for(let un=0;un<on;un++)hn.setValue(B,"_gl_DrawID",un),he.render(Ve[un]/ae,Tt[un])}else if(q.isInstancedMesh)he.renderInstances(Lt,Le,q.count);else if($.isInstancedBufferGeometry){let Ve=$._maxInstanceCount!==void 0?$._maxInstanceCount:1/0,Tt=Math.min($.instanceCount,Ve);he.renderInstances(Lt,Le,Tt)}else he.render(Lt,Le)};function Us(y,k,$){y.transparent===!0&&y.side===Gn&&y.forceSinglePass===!1?(y.side=cn,y.needsUpdate=!0,ps(y,k,$),y.side=Ui,y.needsUpdate=!0,ps(y,k,$),y.side=Gn):ps(y,k,$)}this.compile=function(y,k,$=null){$===null&&($=y),w=Mt.get($),w.init(k),v.push(w),$.traverseVisible(function(q){q.isLight&&q.layers.test(k.layers)&&(w.pushLight(q),q.castShadow&&w.pushShadow(q))}),y!==$&&y.traverseVisible(function(q){q.isLight&&q.layers.test(k.layers)&&(w.pushLight(q),q.castShadow&&w.pushShadow(q))}),w.setupLights();let Y=new Set;return y.traverse(function(q){if(!(q.isMesh||q.isPoints||q.isLine||q.isSprite))return;let yt=q.material;if(yt)if(Array.isArray(yt))for(let Ct=0;Ct<yt.length;Ct++){let bt=yt[Ct];Us(bt,$,q),Y.add(bt)}else Us(yt,$,q),Y.add(yt)}),w=v.pop(),Y},this.compileAsync=function(y,k,$=null){let Y=this.compile(y,k,$);return new Promise(q=>{function yt(){if(Y.forEach(function(Ct){X.get(Ct).currentProgram.isReady()&&Y.delete(Ct)}),Y.size===0){q(y);return}setTimeout(yt,10)}me.get("KHR_parallel_shader_compile")!==null?yt():setTimeout(yt,10)})};let zi=null;function Nr(y){zi&&zi(y)}function Jn(){li.stop()}function Kn(){li.start()}let li=new lf;li.setAnimationLoop(Nr),typeof self<"u"&&li.setContext(self),this.setAnimationLoop=function(y){zi=y,Dt.setAnimationLoop(y),y===null?li.stop():li.start()},Dt.addEventListener("sessionstart",Jn),Dt.addEventListener("sessionend",Kn),this.render=function(y,k){if(k!==void 0&&k.isCamera!==!0){Xt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(O===!0)return;W!==null&&W.renderStart(y,k);let $=Dt.enabled===!0&&Dt.isPresenting===!0,Y=C!==null&&(rt===null||$)&&C.begin(V,rt);if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),Dt.enabled===!0&&Dt.isPresenting===!0&&(C===null||C.isCompositing()===!1)&&(Dt.cameraAutoUpdate===!0&&Dt.updateCamera(k),k=Dt.getCamera()),y.isScene===!0&&y.onBeforeRender(V,y,k,rt),w=Mt.get(y,v.length),w.init(k),w.state.textureUnits=Q.getTextureUnits(),v.push(w),Fe.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),Me.setFromProjectionMatrix(Fe,ni,k.reversedDepth),se=this.localClippingEnabled,ce=Ot.init(this.clippingPlanes,se),R=Et.get(y,L.length),R.init(),L.push(R),Dt.enabled===!0&&Dt.isPresenting===!0){let Ct=V.xr.getDepthSensingMesh();Ct!==null&&Fs(Ct,k,-1/0,V.sortObjects)}Fs(y,k,0,V.sortObjects),R.finish(),V.sortObjects===!0&&R.sort(Rt,qt,k.reversedDepth),Ie=Dt.enabled===!1||Dt.isPresenting===!1||Dt.hasDepthSensing()===!1,Ie&&Kt.addToRenderList(R,y),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ce===!0&&Ot.beginShadows();let q=w.state.shadowsArray;if(Vt.render(q,y,k),ce===!0&&Ot.endShadows(),(Y&&C.hasRenderPass())===!1){let Ct=R.opaque,bt=R.transmissive;if(w.setupLights(),k.isArrayCamera){let Pt=k.cameras;if(bt.length>0)for(let Ut=0,Wt=Pt.length;Ut<Wt;Ut++){let jt=Pt[Ut];Os(Ct,bt,y,jt)}Ie&&Kt.render(y);for(let Ut=0,Wt=Pt.length;Ut<Wt;Ut++){let jt=Pt[Ut];Ur(R,y,jt,jt.viewport)}}else bt.length>0&&Os(Ct,bt,y,k),Ie&&Kt.render(y),Ur(R,y,k)}rt!==null&&K===0&&(Q.updateMultisampleRenderTarget(rt),Q.updateRenderTargetMipmap(rt)),Y&&C.end(V),y.isScene===!0&&y.onAfterRender(V,y,k),At.resetDefaultState(),lt=-1,mt=null,v.pop(),v.length>0?(w=v[v.length-1],Q.setTextureUnits(w.state.textureUnits),ce===!0&&Ot.setGlobalState(V.clippingPlanes,w.state.camera)):w=null,L.pop(),L.length>0?R=L[L.length-1]:R=null,W!==null&&W.renderEnd()};function Fs(y,k,$,Y){if(y.visible===!1)return;if(y.layers.test(k.layers)){if(y.isGroup)$=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(k);else if(y.isLightProbeGrid)w.pushLightProbeGrid(y);else if(y.isLight)w.pushLight(y),y.castShadow&&w.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||Me.intersectsSprite(y)){Y&&ze.setFromMatrixPosition(y.matrixWorld).applyMatrix4(Fe);let Ct=st.update(y),bt=y.material;bt.visible&&R.push(y,Ct,bt,$,ze.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||Me.intersectsObject(y))){let Ct=st.update(y),bt=y.material;if(Y&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),ze.copy(y.boundingSphere.center)):(Ct.boundingSphere===null&&Ct.computeBoundingSphere(),ze.copy(Ct.boundingSphere.center)),ze.applyMatrix4(y.matrixWorld).applyMatrix4(Fe)),Array.isArray(bt)){let Pt=Ct.groups;for(let Ut=0,Wt=Pt.length;Ut<Wt;Ut++){let jt=Pt[Ut],Lt=bt[jt.materialIndex];Lt&&Lt.visible&&R.push(y,Ct,Lt,$,ze.z,jt)}}else bt.visible&&R.push(y,Ct,bt,$,ze.z,null)}}let yt=y.children;for(let Ct=0,bt=yt.length;Ct<bt;Ct++)Fs(yt[Ct],k,$,Y)}function Ur(y,k,$,Y){let{opaque:q,transmissive:yt,transparent:Ct}=y;w.setupLightsView($),ce===!0&&Ot.setGlobalState(V.clippingPlanes,$),Y&&g.viewport(St.copy(Y)),q.length>0&&fs(q,k,$),yt.length>0&&fs(yt,k,$),Ct.length>0&&fs(Ct,k,$),g.buffers.depth.setTest(!0),g.buffers.depth.setMask(!0),g.buffers.color.setMask(!0),g.setPolygonOffset(!1)}function Os(y,k,$,Y){if(($.isScene===!0?$.overrideMaterial:null)!==null)return;if(w.state.transmissionRenderTarget[Y.id]===void 0){let Lt=me.has("EXT_color_buffer_half_float")||me.has("EXT_color_buffer_float");w.state.transmissionRenderTarget[Y.id]=new gn(1,1,{generateMipmaps:!0,type:Lt?Zn:Sn,minFilter:ri,samples:Math.max(4,T.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:de.workingColorSpace})}let yt=w.state.transmissionRenderTarget[Y.id],Ct=Y.viewport||St;yt.setSize(Ct.z*V.transmissionResolutionScale,Ct.w*V.transmissionResolutionScale);let bt=V.getRenderTarget(),Pt=V.getActiveCubeFace(),Ut=V.getActiveMipmapLevel();V.setRenderTarget(yt),V.getClearColor(ye),re=V.getClearAlpha(),re<1&&V.setClearColor(16777215,.5),V.clear(),Ie&&Kt.render($);let Wt=V.toneMapping;V.toneMapping=si;let jt=Y.viewport;if(Y.viewport!==void 0&&(Y.viewport=void 0),w.setupLightsView(Y),ce===!0&&Ot.setGlobalState(V.clippingPlanes,Y),fs(y,$,Y),Q.updateMultisampleRenderTarget(yt),Q.updateRenderTargetMipmap(yt),me.has("WEBGL_multisampled_render_to_texture")===!1){let Lt=!1;for(let pe=0,Le=k.length;pe<Le;pe++){let Ce=k[pe],{object:he,geometry:Ve,material:Tt,group:on}=Ce;if(Tt.side===Gn&&he.layers.test(Y.layers)){let ae=Tt.side;Tt.side=cn,Tt.needsUpdate=!0,Tn(he,$,Y,Ve,Tt,on),Tt.side=ae,Tt.needsUpdate=!0,Lt=!0}}Lt===!0&&(Q.updateMultisampleRenderTarget(yt),Q.updateRenderTargetMipmap(yt))}V.setRenderTarget(bt,Pt,Ut),V.setClearColor(ye,re),jt!==void 0&&(Y.viewport=jt),V.toneMapping=Wt}function fs(y,k,$){let Y=k.isScene===!0?k.overrideMaterial:null;for(let q=0,yt=y.length;q<yt;q++){let Ct=y[q],{object:bt,geometry:Pt,group:Ut}=Ct,Wt=Ct.material;Wt.allowOverride===!0&&Y!==null&&(Wt=Y),bt.layers.test($.layers)&&Tn(bt,k,$,Pt,Wt,Ut)}}function Tn(y,k,$,Y,q,yt){y.onBeforeRender(V,k,$,Y,q,yt),y.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),q.onBeforeRender(V,k,$,Y,y,yt),q.transparent===!0&&q.side===Gn&&q.forceSinglePass===!1?(q.side=cn,q.needsUpdate=!0,V.renderBufferDirect($,k,Y,q,y,yt),q.side=Ui,q.needsUpdate=!0,V.renderBufferDirect($,k,Y,q,y,yt),q.side=Gn):V.renderBufferDirect($,k,Y,q,y,yt),y.onAfterRender(V,k,$,Y,q,yt)}function ps(y,k,$){k.isScene!==!0&&(k=Ge);let Y=X.get(y),q=w.state.lights,yt=w.state.shadowsArray,Ct=q.state.version,bt=vt.getParameters(y,q.state,yt,k,$,w.state.lightProbeGridArray),Pt=vt.getProgramCacheKey(bt),Ut=Y.programs;Y.environment=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?k.environment:null,Y.fog=k.fog;let Wt=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap;Y.envMap=pt.get(y.envMap||Y.environment,Wt),Y.envMapRotation=Y.environment!==null&&y.envMap===null?k.environmentRotation:y.envMapRotation,Ut===void 0&&(y.addEventListener("dispose",En),Ut=new Map,Y.programs=Ut);let jt=Ut.get(Pt);if(jt!==void 0){if(Y.currentProgram===jt&&Y.lightsStateVersion===Ct)return ms(y,bt),jt}else bt.uniforms=vt.getUniforms(y),W!==null&&y.isNodeMaterial&&W.build(y,$,bt),y.onBeforeCompile(bt,V),jt=vt.acquireProgram(bt,Pt),Ut.set(Pt,jt),Y.uniforms=bt.uniforms;let Lt=Y.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(Lt.clippingPlanes=Ot.uniform),ms(y,bt),Y.needsLights=zs(y),Y.lightsStateVersion=Ct,Y.needsLights&&(Lt.ambientLightColor.value=q.state.ambient,Lt.lightProbe.value=q.state.probe,Lt.directionalLights.value=q.state.directional,Lt.directionalLightShadows.value=q.state.directionalShadow,Lt.spotLights.value=q.state.spot,Lt.spotLightShadows.value=q.state.spotShadow,Lt.rectAreaLights.value=q.state.rectArea,Lt.ltc_1.value=q.state.rectAreaLTC1,Lt.ltc_2.value=q.state.rectAreaLTC2,Lt.pointLights.value=q.state.point,Lt.pointLightShadows.value=q.state.pointShadow,Lt.hemisphereLights.value=q.state.hemi,Lt.directionalShadowMatrix.value=q.state.directionalShadowMatrix,Lt.spotLightMatrix.value=q.state.spotLightMatrix,Lt.spotLightMap.value=q.state.spotLightMap,Lt.pointShadowMatrix.value=q.state.pointShadowMatrix),Y.lightProbeGrid=w.state.lightProbeGridArray.length>0,Y.currentProgram=jt,Y.uniformsList=null,jt}function Bs(y){if(y.uniformsList===null){let k=y.currentProgram.getUniforms();y.uniformsList=Rr.seqWithValue(k.seq,y.uniforms)}return y.uniformsList}function ms(y,k){let $=X.get(y);$.outputColorSpace=k.outputColorSpace,$.batching=k.batching,$.batchingColor=k.batchingColor,$.instancing=k.instancing,$.instancingColor=k.instancingColor,$.instancingMorph=k.instancingMorph,$.skinning=k.skinning,$.morphTargets=k.morphTargets,$.morphNormals=k.morphNormals,$.morphColors=k.morphColors,$.morphTargetsCount=k.morphTargetsCount,$.numClippingPlanes=k.numClippingPlanes,$.numIntersection=k.numClipIntersection,$.vertexAlphas=k.vertexAlphas,$.vertexTangents=k.vertexTangents,$.toneMapping=k.toneMapping}function Fr(y,k){if(y.length===0)return null;if(y.length===1)return y[0].texture!==null?y[0]:null;E.setFromMatrixPosition(k.matrixWorld);for(let $=0,Y=y.length;$<Y;$++){let q=y[$];if(q.texture!==null&&q.boundingBox.containsPoint(E))return q}return null}function Ze(y,k,$,Y,q){k.isScene!==!0&&(k=Ge),Q.resetTextureUnits();let yt=k.fog,Ct=Y.isMeshStandardMaterial||Y.isMeshLambertMaterial||Y.isMeshPhongMaterial?k.environment:null,bt=rt===null?V.outputColorSpace:rt.isXRRenderTarget===!0?rt.texture.colorSpace:de.workingColorSpace,Pt=Y.isMeshStandardMaterial||Y.isMeshLambertMaterial&&!Y.envMap||Y.isMeshPhongMaterial&&!Y.envMap,Ut=pt.get(Y.envMap||Ct,Pt),Wt=Y.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,jt=!!$.attributes.tangent&&(!!Y.normalMap||Y.anisotropy>0),Lt=!!$.morphAttributes.position,pe=!!$.morphAttributes.normal,Le=!!$.morphAttributes.color,Ce=si;Y.toneMapped&&(rt===null||rt.isXRRenderTarget===!0)&&(Ce=V.toneMapping);let he=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,Ve=he!==void 0?he.length:0,Tt=X.get(Y),on=w.state.lights;if(ce===!0&&(se===!0||y!==mt)){let be=y===mt&&Y.id===lt;Ot.setState(Y,y,be)}let ae=!1;Y.version===Tt.__version?(Tt.needsLights&&Tt.lightsStateVersion!==on.state.version||Tt.outputColorSpace!==bt||q.isBatchedMesh&&Tt.batching===!1||!q.isBatchedMesh&&Tt.batching===!0||q.isBatchedMesh&&Tt.batchingColor===!0&&q.colorTexture===null||q.isBatchedMesh&&Tt.batchingColor===!1&&q.colorTexture!==null||q.isInstancedMesh&&Tt.instancing===!1||!q.isInstancedMesh&&Tt.instancing===!0||q.isSkinnedMesh&&Tt.skinning===!1||!q.isSkinnedMesh&&Tt.skinning===!0||q.isInstancedMesh&&Tt.instancingColor===!0&&q.instanceColor===null||q.isInstancedMesh&&Tt.instancingColor===!1&&q.instanceColor!==null||q.isInstancedMesh&&Tt.instancingMorph===!0&&q.morphTexture===null||q.isInstancedMesh&&Tt.instancingMorph===!1&&q.morphTexture!==null||Tt.envMap!==Ut||Y.fog===!0&&Tt.fog!==yt||Tt.numClippingPlanes!==void 0&&(Tt.numClippingPlanes!==Ot.numPlanes||Tt.numIntersection!==Ot.numIntersection)||Tt.vertexAlphas!==Wt||Tt.vertexTangents!==jt||Tt.morphTargets!==Lt||Tt.morphNormals!==pe||Tt.morphColors!==Le||Tt.toneMapping!==Ce||Tt.morphTargetsCount!==Ve||!!Tt.lightProbeGrid!=w.state.lightProbeGridArray.length>0)&&(ae=!0):(ae=!0,Tt.__version=Y.version);let hn=Tt.currentProgram;ae===!0&&(hn=ps(Y,k,q),W&&Y.isNodeMaterial&&W.onUpdateProgram(Y,hn,Tt));let un=!1,Un=!1,jn=!1,_e=hn.getUniforms(),xe=Tt.uniforms;if(g.useProgram(hn.program)&&(un=!0,Un=!0,jn=!0),Y.id!==lt&&(lt=Y.id,Un=!0),Tt.needsLights){let be=Fr(w.state.lightProbeGridArray,q);Tt.lightProbeGrid!==be&&(Tt.lightProbeGrid=be,Un=!0)}if(un||mt!==y){g.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),_e.setValue(B,"projectionMatrix",y.projectionMatrix),_e.setValue(B,"viewMatrix",y.matrixWorldInverse);let Wn=_e.map.cameraPosition;Wn!==void 0&&Wn.setValue(B,Be.setFromMatrixPosition(y.matrixWorld)),T.logarithmicDepthBuffer&&_e.setValue(B,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(Y.isMeshPhongMaterial||Y.isMeshToonMaterial||Y.isMeshLambertMaterial||Y.isMeshBasicMaterial||Y.isMeshStandardMaterial||Y.isShaderMaterial)&&_e.setValue(B,"isOrthographic",y.isOrthographicCamera===!0),mt!==y&&(mt=y,Un=!0,jn=!0)}if(Tt.needsLights&&(on.state.directionalShadowMap.length>0&&_e.setValue(B,"directionalShadowMap",on.state.directionalShadowMap,Q),on.state.spotShadowMap.length>0&&_e.setValue(B,"spotShadowMap",on.state.spotShadowMap,Q),on.state.pointShadowMap.length>0&&_e.setValue(B,"pointShadowMap",on.state.pointShadowMap,Q)),q.isSkinnedMesh){_e.setOptional(B,q,"bindMatrix"),_e.setOptional(B,q,"bindMatrixInverse");let be=q.skeleton;be&&(be.boneTexture===null&&be.computeBoneTexture(),_e.setValue(B,"boneTexture",be.boneTexture,Q))}q.isBatchedMesh&&(_e.setOptional(B,q,"batchingTexture"),_e.setValue(B,"batchingTexture",q._matricesTexture,Q),_e.setOptional(B,q,"batchingIdTexture"),_e.setValue(B,"batchingIdTexture",q._indirectTexture,Q),_e.setOptional(B,q,"batchingColorTexture"),q._colorsTexture!==null&&_e.setValue(B,"batchingColorTexture",q._colorsTexture,Q));let ci=$.morphAttributes;if((ci.position!==void 0||ci.normal!==void 0||ci.color!==void 0)&&N.update(q,$,hn),(Un||Tt.receiveShadow!==q.receiveShadow)&&(Tt.receiveShadow=q.receiveShadow,_e.setValue(B,"receiveShadow",q.receiveShadow)),(Y.isMeshStandardMaterial||Y.isMeshLambertMaterial||Y.isMeshPhongMaterial)&&Y.envMap===null&&k.environment!==null&&(xe.envMapIntensity.value=k.environmentIntensity),xe.dfgLUT!==void 0&&(xe.dfgLUT.value=Ex()),Un){if(_e.setValue(B,"toneMappingExposure",V.toneMappingExposure),Tt.needsLights&&bi(xe,jn),yt&&Y.fog===!0&&Ft.refreshFogUniforms(xe,yt),Ft.refreshMaterialUniforms(xe,Y,ut,ht,w.state.transmissionRenderTarget[y.id]),Tt.needsLights&&Tt.lightProbeGrid){let be=Tt.lightProbeGrid;xe.probesSH.value=be.texture,xe.probesMin.value.copy(be.boundingBox.min),xe.probesMax.value.copy(be.boundingBox.max),xe.probesResolution.value.copy(be.resolution)}Rr.upload(B,Bs(Tt),xe,Q)}if(Y.isShaderMaterial&&Y.uniformsNeedUpdate===!0&&(Rr.upload(B,Bs(Tt),xe,Q),Y.uniformsNeedUpdate=!1),Y.isSpriteMaterial&&_e.setValue(B,"center",q.center),_e.setValue(B,"modelViewMatrix",q.modelViewMatrix),_e.setValue(B,"normalMatrix",q.normalMatrix),_e.setValue(B,"modelMatrix",q.matrixWorld),Y.uniformsGroups!==void 0){let be=Y.uniformsGroups;for(let Wn=0,hi=be.length;Wn<hi;Wn++){let Vi=be[Wn];at.update(Vi,hn),at.bind(Vi,hn)}}return hn}function bi(y,k){y.ambientLightColor.needsUpdate=k,y.lightProbe.needsUpdate=k,y.directionalLights.needsUpdate=k,y.directionalLightShadows.needsUpdate=k,y.pointLights.needsUpdate=k,y.pointLightShadows.needsUpdate=k,y.spotLights.needsUpdate=k,y.spotLightShadows.needsUpdate=k,y.rectAreaLights.needsUpdate=k,y.hemisphereLights.needsUpdate=k}function zs(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return et},this.getActiveMipmapLevel=function(){return K},this.getRenderTarget=function(){return rt},this.setRenderTargetTextures=function(y,k,$){let Y=X.get(y);Y.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,Y.__autoAllocateDepthBuffer===!1&&(Y.__useRenderToTexture=!1),X.get(y.texture).__webglTexture=k,X.get(y.depthTexture).__webglTexture=Y.__autoAllocateDepthBuffer?void 0:$,Y.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,k){let $=X.get(y);$.__webglFramebuffer=k,$.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(y,k=0,$=0){rt=y,et=k,K=$;let Y=null,q=!1,yt=!1;if(y){let bt=X.get(y);if(bt.__useDefaultFramebuffer!==void 0){g.bindFramebuffer(B.FRAMEBUFFER,bt.__webglFramebuffer),St.copy(y.viewport),xt.copy(y.scissor),le=y.scissorTest,g.viewport(St),g.scissor(xt),g.setScissorTest(le),lt=-1;return}else if(bt.__webglFramebuffer===void 0)Q.setupRenderTarget(y);else if(bt.__hasExternalTextures)Q.rebindTextures(y,X.get(y.texture).__webglTexture,X.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){let Wt=y.depthTexture;if(bt.__boundDepthTexture!==Wt){if(Wt!==null&&X.has(Wt)&&(y.width!==Wt.image.width||y.height!==Wt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Q.setupDepthRenderbuffer(y)}}let Pt=y.texture;(Pt.isData3DTexture||Pt.isDataArrayTexture||Pt.isCompressedArrayTexture)&&(yt=!0);let Ut=X.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Ut[k])?Y=Ut[k][$]:Y=Ut[k],q=!0):y.samples>0&&Q.useMultisampledRTT(y)===!1?Y=X.get(y).__webglMultisampledFramebuffer:Array.isArray(Ut)?Y=Ut[$]:Y=Ut,St.copy(y.viewport),xt.copy(y.scissor),le=y.scissorTest}else St.copy(Gt).multiplyScalar(ut).floor(),xt.copy(Yt).multiplyScalar(ut).floor(),le=te;if($!==0&&(Y=z),g.bindFramebuffer(B.FRAMEBUFFER,Y)&&g.drawBuffers(y,Y),g.viewport(St),g.scissor(xt),g.setScissorTest(le),q){let bt=X.get(y.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+k,bt.__webglTexture,$)}else if(yt){let bt=k;for(let Pt=0;Pt<y.textures.length;Pt++){let Ut=X.get(y.textures[Pt]);B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0+Pt,Ut.__webglTexture,$,bt)}}else if(y!==null&&$!==0){let bt=X.get(y.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,bt.__webglTexture,$)}lt=-1},this.readRenderTargetPixels=function(y,k,$,Y,q,yt,Ct,bt=0){if(!(y&&y.isWebGLRenderTarget)){Xt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Pt=X.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&Ct!==void 0&&(Pt=Pt[Ct]),Pt){g.bindFramebuffer(B.FRAMEBUFFER,Pt);try{let Ut=y.textures[bt],Wt=Ut.format,jt=Ut.type;if(y.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+bt),!T.textureFormatReadable(Wt)){Xt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!T.textureTypeReadable(jt)){Xt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=y.width-Y&&$>=0&&$<=y.height-q&&B.readPixels(k,$,Y,q,ct.convert(Wt),ct.convert(jt),yt)}finally{let Ut=rt!==null?X.get(rt).__webglFramebuffer:null;g.bindFramebuffer(B.FRAMEBUFFER,Ut)}}},this.readRenderTargetPixelsAsync=async function(y,k,$,Y,q,yt,Ct,bt=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Pt=X.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&Ct!==void 0&&(Pt=Pt[Ct]),Pt)if(k>=0&&k<=y.width-Y&&$>=0&&$<=y.height-q){g.bindFramebuffer(B.FRAMEBUFFER,Pt);let Ut=y.textures[bt],Wt=Ut.format,jt=Ut.type;if(y.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+bt),!T.textureFormatReadable(Wt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!T.textureTypeReadable(jt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Lt=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,Lt),B.bufferData(B.PIXEL_PACK_BUFFER,yt.byteLength,B.STREAM_READ),B.readPixels(k,$,Y,q,ct.convert(Wt),ct.convert(jt),0);let pe=rt!==null?X.get(rt).__webglFramebuffer:null;g.bindFramebuffer(B.FRAMEBUFFER,pe);let Le=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await Nd(B,Le,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,Lt),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,yt),B.deleteBuffer(Lt),B.deleteSync(Le),yt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,k=null,$=0){let Y=Math.pow(2,-$),q=Math.floor(y.image.width*Y),yt=Math.floor(y.image.height*Y),Ct=k!==null?k.x:0,bt=k!==null?k.y:0;Q.setTexture2D(y,0),B.copyTexSubImage2D(B.TEXTURE_2D,$,0,0,Ct,bt,q,yt),g.unbindTexture()},this.copyTextureToTexture=function(y,k,$=null,Y=null,q=0,yt=0){let Ct,bt,Pt,Ut,Wt,jt,Lt,pe,Le,Ce=y.isCompressedTexture?y.mipmaps[yt]:y.image;if($!==null)Ct=$.max.x-$.min.x,bt=$.max.y-$.min.y,Pt=$.isBox3?$.max.z-$.min.z:1,Ut=$.min.x,Wt=$.min.y,jt=$.isBox3?$.min.z:0;else{let xe=Math.pow(2,-q);Ct=Math.floor(Ce.width*xe),bt=Math.floor(Ce.height*xe),y.isDataArrayTexture?Pt=Ce.depth:y.isData3DTexture?Pt=Math.floor(Ce.depth*xe):Pt=1,Ut=0,Wt=0,jt=0}Y!==null?(Lt=Y.x,pe=Y.y,Le=Y.z):(Lt=0,pe=0,Le=0);let he=ct.convert(k.format),Ve=ct.convert(k.type),Tt;k.isData3DTexture?(Q.setTexture3D(k,0),Tt=B.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(Q.setTexture2DArray(k,0),Tt=B.TEXTURE_2D_ARRAY):(Q.setTexture2D(k,0),Tt=B.TEXTURE_2D),g.activeTexture(B.TEXTURE0),g.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,k.flipY),g.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),g.pixelStorei(B.UNPACK_ALIGNMENT,k.unpackAlignment);let on=g.getParameter(B.UNPACK_ROW_LENGTH),ae=g.getParameter(B.UNPACK_IMAGE_HEIGHT),hn=g.getParameter(B.UNPACK_SKIP_PIXELS),un=g.getParameter(B.UNPACK_SKIP_ROWS),Un=g.getParameter(B.UNPACK_SKIP_IMAGES);g.pixelStorei(B.UNPACK_ROW_LENGTH,Ce.width),g.pixelStorei(B.UNPACK_IMAGE_HEIGHT,Ce.height),g.pixelStorei(B.UNPACK_SKIP_PIXELS,Ut),g.pixelStorei(B.UNPACK_SKIP_ROWS,Wt),g.pixelStorei(B.UNPACK_SKIP_IMAGES,jt);let jn=y.isDataArrayTexture||y.isData3DTexture,_e=k.isDataArrayTexture||k.isData3DTexture;if(y.isDepthTexture){let xe=X.get(y),ci=X.get(k),be=X.get(xe.__renderTarget),Wn=X.get(ci.__renderTarget);g.bindFramebuffer(B.READ_FRAMEBUFFER,be.__webglFramebuffer),g.bindFramebuffer(B.DRAW_FRAMEBUFFER,Wn.__webglFramebuffer);for(let hi=0;hi<Pt;hi++)jn&&(B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,X.get(y).__webglTexture,q,jt+hi),B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,X.get(k).__webglTexture,yt,Le+hi)),B.blitFramebuffer(Ut,Wt,Ct,bt,Lt,pe,Ct,bt,B.DEPTH_BUFFER_BIT,B.NEAREST);g.bindFramebuffer(B.READ_FRAMEBUFFER,null),g.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else if(q!==0||y.isRenderTargetTexture||X.has(y)){let xe=X.get(y),ci=X.get(k);g.bindFramebuffer(B.READ_FRAMEBUFFER,it),g.bindFramebuffer(B.DRAW_FRAMEBUFFER,G);for(let be=0;be<Pt;be++)jn?B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,xe.__webglTexture,q,jt+be):B.framebufferTexture2D(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,xe.__webglTexture,q),_e?B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,ci.__webglTexture,yt,Le+be):B.framebufferTexture2D(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,ci.__webglTexture,yt),q!==0?B.blitFramebuffer(Ut,Wt,Ct,bt,Lt,pe,Ct,bt,B.COLOR_BUFFER_BIT,B.NEAREST):_e?B.copyTexSubImage3D(Tt,yt,Lt,pe,Le+be,Ut,Wt,Ct,bt):B.copyTexSubImage2D(Tt,yt,Lt,pe,Ut,Wt,Ct,bt);g.bindFramebuffer(B.READ_FRAMEBUFFER,null),g.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else _e?y.isDataTexture||y.isData3DTexture?B.texSubImage3D(Tt,yt,Lt,pe,Le,Ct,bt,Pt,he,Ve,Ce.data):k.isCompressedArrayTexture?B.compressedTexSubImage3D(Tt,yt,Lt,pe,Le,Ct,bt,Pt,he,Ce.data):B.texSubImage3D(Tt,yt,Lt,pe,Le,Ct,bt,Pt,he,Ve,Ce):y.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,yt,Lt,pe,Ct,bt,he,Ve,Ce.data):y.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,yt,Lt,pe,Ce.width,Ce.height,he,Ce.data):B.texSubImage2D(B.TEXTURE_2D,yt,Lt,pe,Ct,bt,he,Ve,Ce);g.pixelStorei(B.UNPACK_ROW_LENGTH,on),g.pixelStorei(B.UNPACK_IMAGE_HEIGHT,ae),g.pixelStorei(B.UNPACK_SKIP_PIXELS,hn),g.pixelStorei(B.UNPACK_SKIP_ROWS,un),g.pixelStorei(B.UNPACK_SKIP_IMAGES,Un),yt===0&&k.generateMipmaps&&B.generateMipmap(Tt),g.unbindTexture()},this.initRenderTarget=function(y){X.get(y).__webglFramebuffer===void 0&&Q.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?Q.setTextureCube(y,0):y.isData3DTexture?Q.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?Q.setTexture2DArray(y,0):Q.setTexture2D(y,0),g.unbindTexture()},this.resetState=function(){et=0,K=0,rt=null,g.reset(),At.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ni}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=de._getDrawingBufferColorSpace(t),e.unpackColorSpace=de._getUnpackColorSpace()}};var mf={type:"change"},$h={type:"start"},_f={type:"end"},ql=new is,gf=new Yn,Ax=Math.cos(70*vi.DEG2RAD),tn=new F,Dn=2*Math.PI,Ee={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Zh=1e-6,Yl=class extends fa{constructor(t,e=null){super(t,e),this.state=Ee.NONE,this.target=new F,this.cursor=new F,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:os.ROTATE,MIDDLE:os.DOLLY,RIGHT:os.PAN},this.touches={ONE:ls.ROTATE,TWO:ls.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new F,this._lastQuaternion=new kn,this._lastTargetPosition=new F,this._quat=new kn().setFromUnitVectors(t.up,new F(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new br,this._sphericalDelta=new br,this._scale=1,this._panOffset=new F,this._rotateStart=new $t,this._rotateEnd=new $t,this._rotateDelta=new $t,this._panStart=new $t,this._panEnd=new $t,this._panDelta=new $t,this._dollyStart=new $t,this._dollyEnd=new $t,this._dollyDelta=new $t,this._dollyDirection=new F,this._mouse=new $t,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Cx.bind(this),this._onPointerDown=wx.bind(this),this._onPointerUp=Rx.bind(this),this._onContextMenu=Fx.bind(this),this._onMouseWheel=Dx.bind(this),this._onKeyDown=Lx.bind(this),this._onTouchStart=Nx.bind(this),this._onTouchMove=Ux.bind(this),this._onMouseDown=Px.bind(this),this._onMouseMove=Ix.bind(this),this._interceptControlDown=Ox.bind(this),this._interceptControlUp=Bx.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(t){this._cursorStyle=t,t==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction=""}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(mf),this.update(),this.state=Ee.NONE}pan(t,e){this._pan(t,e),this.update()}dollyIn(t){this._dollyIn(t),this.update()}dollyOut(t){this._dollyOut(t),this.update()}rotateLeft(t){this._rotateLeft(t),this.update()}rotateUp(t){this._rotateUp(t),this.update()}update(t=null){let e=this.object.position;tn.copy(e).sub(this.target),tn.applyQuaternion(this._quat),this._spherical.setFromVector3(tn),this.autoRotate&&this.state===Ee.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=Dn:n>Math.PI&&(n-=Dn),s<-Math.PI?s+=Dn:s>Math.PI&&(s-=Dn),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(tn.setFromSpherical(this._spherical),tn.applyQuaternion(this._quatInverse),e.copy(this.target).add(tn),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){let o=tn.length();a=this._clampDistance(o*this._scale);let c=o-a;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){let o=new F(this._mouse.x,this._mouse.y,0);o.unproject(this.object);let c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;let l=new F(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(o),this.object.updateMatrixWorld(),a=tn.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(ql.origin.copy(this.object.position),ql.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(ql.direction))<Ax?this.object.lookAt(this.target):(gf.setFromNormalAndCoplanarPoint(this.object.up,this.target),ql.intersectPlane(gf,this.target))))}else if(this.object.isOrthographicCamera){let a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Zh||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Zh||this._lastTargetPosition.distanceToSquared(this.target)>Zh?(this.dispatchEvent(mf),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?Dn/60*this.autoRotateSpeed*t:Dn/60/60*this.autoRotateSpeed}_getZoomScale(t){let e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){tn.setFromMatrixColumn(e,0),tn.multiplyScalar(-t),this._panOffset.add(tn)}_panUp(t,e){this.screenSpacePanning===!0?tn.setFromMatrixColumn(e,1):(tn.setFromMatrixColumn(e,0),tn.crossVectors(this.object.up,tn)),tn.multiplyScalar(t),this._panOffset.add(tn)}_pan(t,e){let n=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;tn.copy(s).sub(this.target);let r=tn.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/n.clientHeight,this.object.matrix),this._panUp(2*e*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),s=t-n.left,r=e-n.top,a=n.width,o=n.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(Dn*this._rotateDelta.x/e.clientHeight),this._rotateUp(Dn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(Dn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-Dn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(Dn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-Dn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(n,s)}}_handleTouchStartDolly(t){let e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{let n=this._getSecondPointerPosition(t),s=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(Dn*this._rotateDelta.x/e.clientHeight),this._rotateUp(Dn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){let e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let a=(t.pageX+e.x)*.5,o=(t.pageY+e.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new $t,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){let e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){let e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function wx(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function Cx(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function Rx(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(_f),this.state=Ee.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:let t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function Px(i){let t;switch(i.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case os.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=Ee.DOLLY;break;case os.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Ee.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Ee.ROTATE}break;case os.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Ee.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Ee.PAN}break;default:this.state=Ee.NONE}this.state!==Ee.NONE&&this.dispatchEvent($h)}function Ix(i){switch(this.state){case Ee.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case Ee.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case Ee.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function Dx(i){this.enabled===!1||this.enableZoom===!1||this.state!==Ee.NONE||(i.preventDefault(),this.dispatchEvent($h),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(_f))}function Lx(i){this.enabled!==!1&&this._handleKeyDown(i)}function Nx(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case ls.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=Ee.TOUCH_ROTATE;break;case ls.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=Ee.TOUCH_PAN;break;default:this.state=Ee.NONE}break;case 2:switch(this.touches.TWO){case ls.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=Ee.TOUCH_DOLLY_PAN;break;case ls.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=Ee.TOUCH_DOLLY_ROTATE;break;default:this.state=Ee.NONE}break;default:this.state=Ee.NONE}this.state!==Ee.NONE&&this.dispatchEvent($h)}function Ux(i){switch(this._trackPointer(i),this.state){case Ee.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case Ee.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case Ee.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case Ee.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=Ee.NONE}}function Fx(i){this.enabled!==!1&&i.preventDefault()}function Ox(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Bx(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var zx=`<div id="simular" class="hud" role="group" aria-label="Simular eventos do Obsidian (s\xF3 na pr\xE9via)">
  <span class="legenda">Pr\xE9via \xB7 simular</span>
  <button data-evento="abrir">Abrir nota</button>
  <button data-evento="salvar">Salvar</button>
  <button data-evento="nova">Nota nova</button>
  <button data-evento="captura">Captura no 01_ENTRADA</button>
  <button id="demo" aria-pressed="true">Manh\xE3 de trabalho</button>
</div>`,Vx=i=>String(i).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]);function xf(i={}){let t=i.simulacao?zx:"";return`<div id="palco" aria-label="O cofre como gal\xE1xia em tr\xEAs dimens\xF5es. Arraste para girar, role para voar na dire\xE7\xE3o do ponteiro, clique numa estrela para abrir a nota."></div>
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
        <label class="chave">${Vx(i.rotuloHalo||"Esconder o halo (99_ARQUIVO)")} <input type="checkbox" id="f-arquivo"></label>
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

${t}

<div id="sem-webgl" hidden><div><strong>A gal\xE1xia precisa de WebGL.</strong>Este computador ou navegador n\xE3o liberou a acelera\xE7\xE3o gr\xE1fica.</div></div>`}function vf(i,t,e={}){i.classList.add("cg-raiz"),e.simulacao&&i.classList.add("com-simulacao"),i.innerHTML=xf(e);let n=u=>i.querySelector("#"+u),s=[];function r(u,M,b,D){u.addEventListener(M,b,D),s.push(()=>u.removeEventListener(M,b,D))}let a=Math.min(5e3,e.carga||0),o=Math.max(0,a-t.nos.length);if(o){let u=t.nos.length,M=t.arestas.length*2/u,b=1,D=()=>(b=b*16807%2147483647,b/2147483647);for(let j=0;j<o;j++){let P=t.nos[Math.floor(D()*u)];t.nos.push({...P,id:`${P.id} (sint\xE9tica ${j+1})`,t:`Sint\xE9tica ${j+1}`});let U=t.nos.length-1;for(let Z=0;Z<Math.round(M/2);Z++)t.arestas.push([Math.floor(D()*U),U])}}let c={regra:"#ff8a3d",incidente:"#ff4d4d",decisao:"#ffc233",metodo:"#2ee59d",conhecimento:"#569cff",projeto:"#8f7bff",fonte:"#7ea2ff",pesquisa:"#7ea2ff",arquivo:"#58627e",sistema:"#fff1d6"},l=[{id:"frontal",nome:"Conhecimento",curto:"CON",onde:"bra\xE7o do conhecimento"},{id:"motor",nome:"Decis\xF5es",curto:"DEC",onde:"bra\xE7o das decis\xF5es"},{id:"parietal",nome:"Projetos",curto:"PRO",onde:"ponta do bra\xE7o das decis\xF5es"},{id:"temporal",nome:"Regras e m\xE9todos",curto:"REG",onde:"bra\xE7o das regras"},{id:"occipital",nome:"Incidentes",curto:"INC",onde:"ponta do bra\xE7o das regras"},{id:"cerebelo",nome:"Fontes",curto:"FON",onde:"bra\xE7o das fontes"},{id:"tronco",nome:"Arquivo",curto:"ARQ",onde:"halo"},{id:"talamo",nome:"N\xFAcleo",curto:"NUC",onde:"n\xFAcleo"}];for(let u of l)e.regioes?.[u.id]&&Object.assign(u,e.regioes[u.id]);let d=Object.fromEntries(l.map((u,M)=>[u.id,M])),m={regra:"regra",incidente:"incidente",decisao:"decis\xE3o",metodo:"m\xE9todo",conhecimento:"conhecimento",projeto:"projeto",fonte:"fonte",pesquisa:"pesquisa",arquivo:"arquivo",sistema:"sistema"},h={ferrugem:new zt("#8c3b22"),laranja:new zt("#e0733a"),ouro:new zt("#f0b44c"),teal:new zt("#3cc3d0"),cavidade:new zt("#2a4fb8"),nucleo:new zt("#fff1d6"),violeta:new zt("#4a3a8c")},_=matchMedia("(prefers-reduced-motion: reduce)"),p={esconderArquivo:!1,fundo:!0,reduzidos:!1,som:!1,regiao:null,selecionado:-1,sobre:-1,demo:!!e.simulacao,qualidadeAjustada:!1,get movimentoReduzido(){return _.matches}};for(let u of["esconderArquivo","fundo","reduzidos","som"])typeof e.config?.[u]=="boolean"&&(p[u]=e.config[u]);let S=()=>({esconderArquivo:p.esconderArquivo,fundo:p.fundo,reduzidos:p.reduzidos,som:p.som});function x(u){let M=2166136261;for(let b=0;b<u.length;b++)M^=u.charCodeAt(b),M=Math.imul(M,16777619);return M>>>0}function f(u){let M=u>>>0;return()=>{M=M+1831565813>>>0;let b=M;return b=Math.imul(b^b>>>15,b|1),b^=b+Math.imul(b^b>>>7,b|61),((b^b>>>14)>>>0)/4294967296}}function A(u){let M=Math.max(u(),1e-9),b=u();return Math.sqrt(-2*Math.log(M))*Math.cos(2*Math.PI*b)}let I=new Uint8Array(512);{let u=f(7031),M=Array.from({length:256},(b,D)=>D);for(let b=255;b>0;b--){let D=Math.floor(u()*(b+1));[M[b],M[D]]=[M[D],M[b]]}for(let b=0;b<512;b++)I[b]=M[b&255]}let E=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],R=u=>u*u*u*(u*(u*6-15)+10);function w(u,M,b){let D=Math.floor(u)&255,j=Math.floor(M)&255,P=Math.floor(b)&255;u-=Math.floor(u),M-=Math.floor(M),b-=Math.floor(b);let U=R(u),Z=R(M),dt=R(b),ot=(ne,Cn,sn,vn)=>{let $e=E[ne%12];return $e[0]*Cn+$e[1]*sn+$e[2]*vn},ft=I[D]+j,It=I[ft]+P,fe=I[ft+1]+P,kt=I[D+1]+j,ee=I[kt]+P,Bt=I[kt+1]+P,Zt=(ne,Cn,sn)=>ne+sn*(Cn-ne);return Zt(Zt(Zt(ot(I[It],u,M,b),ot(I[ee],u-1,M,b),U),Zt(ot(I[fe],u,M-1,b),ot(I[Bt],u-1,M-1,b),U),Z),Zt(Zt(ot(I[It+1],u,M,b-1),ot(I[ee+1],u-1,M,b-1),U),Zt(ot(I[fe+1],u,M-1,b-1),ot(I[Bt+1],u-1,M-1,b-1),U),Z),dt)}let L=2.35,v=.14,C={frontal:{theta0:0,r:[.18,1]},temporal:{theta0:Math.PI/2,r:[.16,.56]},occipital:{theta0:Math.PI/2,r:[.56,1]},motor:{theta0:Math.PI,r:[.16,.6]},parietal:{theta0:Math.PI,r:[.6,.96]},cerebelo:{theta0:Math.PI*1.5,r:[.2,.82]}},V=(u,M)=>u+L*Math.log(Math.max(M,.02)/v),O=t.nos.length,W=O+96,z=t.nos.map((u,M)=>({...u,i:M,viz:[]}));for(let[u,M]of t.arestas)z[u].viz.push(M),z[M].viz.push(u);let it=z.findIndex(u=>u.id===(e.nucleo??"00_PAINEL"));it<0&&(it=z.reduce((u,M)=>M.viz.length>(z[u]?.viz.length??-1)?M.i:u,0));let G=new Float32Array(W*3);function et(u){let M=new Map;for(let ft of z)ft.l===u&&M.set(ft.s,(M.get(ft.s)||0)+1);let b=[...M.entries()].sort((ft,It)=>It[1]-ft[1]||ft[0].localeCompare(It[0])),[D,j]=C[u].r,P=b.map(([,ft])=>Math.sqrt(ft)),U=P.reduce((ft,It)=>ft+It,0)||1,Z=b.map((ft,It)=>It).sort((ft,It)=>ft%2-It%2||(ft%2?It-ft:ft-It)),dt=new Map,ot=D;for(let ft of Z){let It=(j-D)*P[ft]/U;dt.set(b[ft][0],[ot,ot+It]),ot+=It}return dt}let K=Object.fromEntries(Object.keys(C).map(u=>[u,et(u)]));function rt(u){let M=f(x(u.id)),b=new F;if(u.i===it)return b.set(0,0,0);if(u.l==="talamo")return b.set(A(M)*.035,A(M)*.022,A(M)*.035);if(u.l==="tronco"){let ot=M()*Math.PI*2,ft=1.04+M()*.34;return b.set(Math.cos(ot)*ft,A(M)*.07,Math.sin(ot)*ft)}let D=C[u.l]||C.frontal,j=K[u.l]?.get(u.s)||D.r,P=j[0]+Math.pow(M(),.85)*(j[1]-j[0]),U=.065+P*.035,Z=V(D.theta0,P)+A(M)*U,dt=P+A(M)*.016;return b.set(Math.cos(Z)*dt,A(M)*.016*(1.25-P*.6),Math.sin(Z)*dt)}z.forEach(u=>{let M=rt(u);G.set([M.x,M.y,M.z],u.i*3)});let lt=new F,mt=new F,St=new F,xt=new F;function le(u,M,b){b.addVectors(u,M).multiplyScalar(.5);let D=u.distanceTo(M),j=1-Math.min(.45,D*.35),P=.28*Math.min(1,D),U=b.x*j,Z=b.z*j;return b.set(U*Math.cos(P)-Z*Math.sin(P),b.y,U*Math.sin(P)+Z*Math.cos(P))}function ye(u,M,b,D,j){let P=1-D;return j.set(P*P*u.x+2*P*D*M.x+D*D*b.x,P*P*u.y+2*P*D*M.y+D*D*b.y,P*P*u.z+2*P*D*M.z+D*D*b.z)}let re=n("palco"),J;try{J=new Gl({antialias:!1,powerPreference:"low-power"})}catch{return n("sem-webgl").hidden=!1,null}J.setClearColor(461590,1),re.appendChild(J.domElement);let ht=new Rs,ut=50,Rt=new mn(ut,1,.005,80),qt=new F(0,-.05,.12),Gt=new F(0,Math.sin(vi.degToRad(40)),Math.cos(vi.degToRad(40)));Rt.position.copy(qt).addScaledVector(Gt,1.5);let Yt=new Yl(Rt,J.domElement);Yt.target.copy(qt),Yt.enableDamping=!0,Yt.dampingFactor=.07,Yt.minDistance=.03,Yt.maxDistance=6,Yt.zoomToCursor=!0,Yt.zoomSpeed=1.1,Yt.rotateSpeed=.55,Yt.autoRotateSpeed=.12;let te=new Ke(new _i(2,2),new Se({depthTest:!1,depthWrite:!1,uniforms:{uAspecto:{value:1}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:`varying vec2 vUv; uniform float uAspecto;
      void main(){ vec2 p = (vUv - vec2(0.5, 0.55)) * vec2(uAspecto, 1.0) / min(uAspecto, 1.0);
        float h = smoothstep(0.9, 0.0, length(p));
        gl_FragColor = vec4(mix(vec3(0.0275, 0.043, 0.086), vec3(0.047, 0.086, 0.188), h * h * 0.8), 1.0); }`}));te.frustumCulled=!1,te.renderOrder=-10,ht.add(te);let Me=`
  float h3(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
  float vn(vec3 x){ vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(h3(i), h3(i + vec3(1,0,0)), f.x), mix(h3(i + vec3(0,1,0)), h3(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(h3(i + vec3(0,0,1)), h3(i + vec3(1,0,1)), f.x), mix(h3(i + vec3(0,1,1)), h3(i + vec3(1,1,1)), f.x), f.y), f.z); }
  float fbm(vec3 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 6; i++) { s += a * vn(p); p = p * 2.03 + vec3(1.7, 9.2, 3.1); a *= 0.5; } return s; }`,ce=new F(.42,.78,-.46).normalize(),se=new Li;se.renderOrder=-9,ht.add(se);let Fe=(()=>{let u=new gn(2048,1024,{depthBuffer:!1,minFilter:Ne,magFilter:Ne,generateMipmaps:!1}),M=new Rs,b=new Ps(-1,1,1,-1,0,1);return M.add(new Ke(new _i(2,2),new Se({uniforms:{uN:{value:ce}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:`uniform vec3 uN; varying vec2 vUv; ${Me}
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
        gl_FragColor = vec4(cor, 1.0); }`}))),J.setRenderTarget(u),J.render(M,b),J.setRenderTarget(null),M.children[0].geometry.dispose(),M.children[0].material.dispose(),u.texture})();{let u=new Se({transparent:!0,depthTest:!1,depthWrite:!1,side:cn,uniforms:{uVia:{value:Fe},uIntens:{value:.3}},vertexShader:"varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform sampler2D uVia; uniform float uIntens; varying vec3 vD;
      void main(){ vec3 d = normalize(vD);
        vec2 uv = vec2(atan(d.x, d.z) / 6.2831853 + 0.5, asin(clamp(d.y, -1.0, 1.0)) / 3.1415927 + 0.5);
        gl_FragColor = vec4(texture2D(uVia, uv).rgb * uIntens, 1.0); }`});u.blending=In,u.blendSrc=we,u.blendDst=we;let M=new Ke(new ha(40,64,32),u);M.frustumCulled=!1,M.renderOrder=-9.5,se.add(M)}{let u=f(404),M=14e3,b=new Float32Array(M*3),D=new Float32Array(M*3),j=new Float32Array(M),P=new zt,U=new F,Z=["#ffffff","#cfe0ff","#aac8ff","#ffe2c4","#ffd0a8","#ffb98a"];for(let It=0;It<M;It++){U.set(A(u),A(u),A(u)).normalize();let fe=u()<.6;if(fe){let kt=U.dot(ce);U.addScaledVector(ce,-kt+A(u)*.06).normalize()}U.multiplyScalar(30),b.set([U.x,U.y,U.z],It*3),P.set(Z[Math.floor(u()*Z.length)]),D.set([P.r,P.g,P.b],It*3),j[It]=fe?.3+Math.pow(u(),9)*2.6:.4+Math.pow(u(),7)*3.2}let dt=new Ae;dt.setAttribute("position",new Qt(b,3)),dt.setAttribute("aCor",new Qt(D,3)),dt.setAttribute("aTam",new Qt(j,1));let ot=new Se({transparent:!0,depthTest:!1,depthWrite:!1,uniforms:{uDpr:{value:1}},vertexShader:`attribute vec3 aCor; attribute float aTam; uniform float uDpr; varying vec3 vC; varying float vE;
      void main(){ vC = aCor; vE = step(2.0, aTam); vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aTam * uDpr * (1.6 + vE * 4.0); gl_Position = projectionMatrix * mv; }`,fragmentShader:`varying vec3 vC; varying float vE;
      void main(){ vec2 d = gl_PointCoord - 0.5; float k = 1.0 + vE * 4.0;
        float a = exp(-dot(d, d) * 18.0 * k * k);
        vec2 q = abs(d) * 2.0;
        a += vE * (exp(-q.x * 60.0) * exp(-q.y * 4.0) + exp(-q.y * 60.0) * exp(-q.x * 4.0)) * 0.5;
        gl_FragColor = vec4(vC * a * 0.6, 1.0); }`});ot.blending=In,ot.blendSrc=we,ot.blendDst=we;let ft=new bn(dt,ot);ft.frustumCulled=!1,ft.renderOrder=-9,ft.name="ceu",se.add(ft)}function Be(){let b=document.createElement("canvas");b.width=b.height=640;let D=b.getContext("2d"),j=D.createImageData(640,640),P=Z=>Math.exp(Z);for(let Z=0;Z<16;Z++){let dt=Z%4*160,ot=Math.floor(Z/4)*160,ft=Z*5.31,It=Z%3===0?3:2,fe=2.2+Z%4*.5;for(let kt=0;kt<160;kt++)for(let ee=0;ee<160;ee++){let Bt=(ee+.5)/160*2-1,Zt=(kt+.5)/160*2-1,ne=Math.hypot(Bt,Zt),Cn=Math.atan2(Zt,Bt),sn=w(Bt*6+ft,Zt*6-ft,.7)*.5+.5,vn=0,$e=0,He=0;if(Z<=7){let Te=Z>=6,Je=Math.cos(It*(Cn-fe*Math.log(ne+.04))),di=Math.pow(Math.max(0,Je*.5+.5),3)*(Te?Math.min(1,Math.max(0,(ne-.18)*5)):1),fi=P(-ne*3.4),bc=P(-ne*ne*70),Wa=fi*(.18+.95*di*(.55+.45*sn));Te&&(Wa+=P(-(Bt*Bt/.09+Zt*Zt/.003))*.6),vn=bc*1.2+Wa*.62,$e=bc*1.05+Wa*.72,He=bc*.8+Wa*1,di>.7&&sn>.62&&(vn+=fi*.5,$e+=fi*.18,He+=fi*.3)}else if(Z<=9){let Te=P(-Math.pow(ne/.16,.6)*2.2)*1.1;vn=Te,$e=Te*.86,He=Te*.66}else if(Z<=11){let Te=P(-Math.abs(Zt)*20-Math.abs(Bt)*2.6),Je=P(-(Bt*Bt+Zt*Zt*3)*28),di=1-.85*P(-Math.pow((Zt-.012)*70,2))*Math.max(0,1-Math.abs(Bt)*1.1),fi=(Te*(.6+.4*sn)+Je)*di;vn=fi*.9+Je*.3,$e=fi*.85+Je*.2,He=fi*.95}else if(Z===12){let Te=0;for(let Je=0;Je<6;Je++){let di=Math.sin(Je*2.1+1)*.35,fi=Math.cos(Je*3.7)*.25;Te+=P(-((Bt-di)**2+(Zt-fi)**2)*30)*(.4+Je%3*.2)}Te*=.6+.6*sn,vn=Te*.7,$e=Te*.8,He=Te*1.05}else if(Z===13){let Te=P(-Math.pow((ne-.6-.1*(sn-.5))/.09,2))*(.45+.55*Math.abs(Math.sin(Cn+.6)))*(.5+sn),Je=P(-ne*ne*7)*.55,di=P(-ne*ne*400);vn=Te*1+Je*.7+di,$e=Te*.5+Je*.35+di,He=Te*.22+Je*1+di*1.2}else if(Z===14){let Te=Math.pow(.5+.5*Math.sin(Cn*23+sn*5),6)*P(-ne*3.2)*(.6+sn),Je=P(-ne*ne*40)*1.4;vn=Je*.9+Te*1,$e=Je*.95+Te*.5,He=Je*1.1+Te*.3+P(-ne*ne*9)*.2}else{let Te=P(-ne*4.5)*.7+P(-ne*ne*50)*.8;vn=Te,$e=Te*.9,He=Te*.78}let ue=Math.max(0,Math.min(1,(1-ne)/.2)),Rn=((ot+kt)*160*4+dt+ee)*4;j.data[Rn]=Math.min(255,vn*ue*255),j.data[Rn+1]=Math.min(255,$e*ue*255),j.data[Rn+2]=Math.min(255,He*ue*255),j.data[Rn+3]=255}}D.putImageData(j,0,0);let U=new yr(b);return U.generateMipmaps=!0,U.minFilter=ri,U.magFilter=Ne,U}let ze={value:1},Ge={value:200};{let u=f(808),M=120,b=M+420,D=new Float32Array(b*3),j=new Float32Array(b),P=new Float32Array(b),U=new Float32Array(b),Z=new Float32Array(b),dt=new Float32Array(b),ot=new F;for(let kt=0;kt<b;kt++){do ot.set(A(u),A(u),A(u)).normalize();while(Math.abs(ot.dot(ce))<.13&&u()<.88);let ee=kt<M,Bt=ee?14+u()*20:30+u()*8;D.set([ot.x*Bt,ot.y*Bt,ot.z*Bt],kt*3);let Zt=ee?vi.degToRad(1+Math.pow(u(),2.2)*6.5):vi.degToRad(.25+u()*.5);j[kt]=Bt*Zt;let ne=Math.floor(ee?u()*16:u()*12);P[kt]=ne,U[kt]=u()*Math.PI*2,Z[kt]=ne>=10&&ne<=11||ne>=13&&ne<=14?1:.25+u()*.75,dt[kt]=ee?.6+u()*.5:.35+u()*.4}let ft=new Ae;ft.setAttribute("position",new Qt(D,3));for(let[kt,ee]of[["aTam",j],["aCel",P],["aRot",U],["aIncl",Z],["aAlfa",dt]])ft.setAttribute(kt,new Qt(ee,1));let It=new Se({transparent:!0,depthTest:!1,depthWrite:!1,uniforms:{uAtlas:{value:Be()},uProj:ze,uCap:Ge},vertexShader:`attribute float aTam; attribute float aCel; attribute float aRot; attribute float aIncl; attribute float aAlfa;
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
        gl_FragColor = vec4(texture2D(uAtlas, (cel + p) / 4.0).rgb * vA, 1.0); }`});It.blending=In,It.blendSrc=we,It.blendDst=we;let fe=new bn(ft,It);fe.frustumCulled=!1,fe.renderOrder=-8,ht.add(fe)}function Ie(){let b=document.createElement("canvas");b.width=b.height=512;let D=b.getContext("2d"),j=D.createImageData(512,512);for(let U=0;U<16;U++){let Z=U%4*128,dt=Math.floor(U/4)*128,ot=U*13.7,ft=U*7.3;for(let It=0;It<128;It++)for(let fe=0;fe<128;fe++){let kt=fe/128-.5,ee=It/128-.5,Bt=w(kt*3+ot,ee*3+ft,1.7)*.35,Zt=w(kt*3+ot,ee*3+ft,9.1)*.35,ne=0,Cn=.5,sn=2.2;for(let Rn=0;Rn<4;Rn++)ne+=Cn*w((kt+Bt)*sn+ot,(ee+Zt)*sn+ft,Rn*3.3),Cn*=.5,sn*=2.1;let vn=Math.sqrt(kt*kt+ee*ee)*2,$e=Math.max(0,1-vn),He=Math.max(0,Math.min(1,ne*1.6+.42))*Math.pow($e,1.6),ue=((dt+It)*128*4+Z+fe)*4;j.data[ue]=j.data[ue+1]=j.data[ue+2]=255,j.data[ue+3]=Math.round(He*255)}}D.putImageData(j,0,0);let P=new yr(b);return P.generateMipmaps=!0,P.minFilter=ri,P.magFilter=Ne,P}let Oe=Ie(),B=8,We=Array.from({length:B},()=>({pos:new F,cor:new zt,t0:-1e9,forca:0,raio:.1,dur:600,piscar:!1})),me={value:We.map(()=>new Pe(0,0,0,0))},T={value:We.map(()=>new F)},g={value:We.map(()=>.01)},H=0;function X(u,M,b,D,j,P=!1){let U=We[H++%B];U.pos.copy(u),U.cor.set(M),U.t0=dn,U.forca=b,U.raio=D,U.dur=j,U.piscar=P&&!p.reduzidos&&!p.movimentoReduzido}let Q=`
  uniform vec4 uClaroes[${B}]; uniform vec3 uClaroesCor[${B}]; uniform float uClaroesRaio[${B}];
  vec3 luzClaroes(vec3 p) {
    vec3 s = vec3(0.0);
    for (int i = 0; i < ${B}; i++) {
      vec4 c = uClaroes[i];
      if (c.w <= 0.001) continue;
      vec3 d = p - c.xyz;
      s += uClaroesCor[i] * c.w * exp(-dot(d, d) / uClaroesRaio[i]);
    }
    return s;
  }`,pt=u=>.2+.8*(1-Math.exp(-u/7e3)),gt={value:pt(t.arestas.length)},tt={value:1},st={value:-1},vt={value:0},Ft={value:1},Et={value:100},Mt={value:1},Ot={value:1};function Vt(u,M,b,D){return b==="tronco"?D.copy(h.violeta).lerp(h.cavidade,M()*.4):b==="talamo"||u<.07?D.copy(h.nucleo).lerp(h.ouro,M()*.6):u<.2?D.copy(h.teal).lerp(h.cavidade,M()*.8):u<.32?D.copy(h.teal).lerp(h.ouro,(u-.2)/.12*(.6+M()*.4)):u<.62?D.copy(h.ouro).lerp(h.laranja,(u-.32)/.3*(.5+M()*.5)):D.copy(h.laranja).lerp(h.ferrugem,Math.min(1,(u-.62)/.4)*(.5+M()*.5))}let Kt=2600,N={pos:[],cor:[],tam:[],alfa:[],var:[],rot:[],reg:[],keep:[]},_t={pos:[],cor:[],tam:[],alfa:[],var:[],rot:[],reg:[],keep:[]};function nt(u,M,b,D,j,P,U){u.pos.push(M.x,M.y,M.z),u.cor.push(b.r,b.g,b.b),u.tam.push(D),u.alfa.push(j),u.var.push(Math.floor(P()*16)),u.rot.push(P()*Math.PI*2),u.reg.push(U),u.keep.push(P())}{let u=f(1234),M=new zt,b=new F;for(let D=0;D<26;D++)b.set(A(u)*.05,A(u)*.02,A(u)*.05),M.copy(h.nucleo).lerp(h.ouro,u()*.5),nt(N,b,M,.16+u()*.18,.16,u,7);for(let D=0;D<40;D++){let j=u()*Math.PI*2,P=.1+u()*.14;b.set(Math.cos(j)*P,A(u)*.02,Math.sin(j)*P),nt(N,b,Vt(P,u,"cavidade",M),.16+u()*.12,.07,u,7)}for(let D of z){b.fromArray(G,D.i*3);let j=Math.hypot(b.x,b.z);b.x+=A(u)*.03,b.z+=A(u)*.03,b.y+=A(u)*.008;let P=D.l==="tronco";if(nt(N,b,Vt(j,u,D.l,M),.1+u()*.1,P?.035:.13,u,d[D.l]??7),!P&&D.l!=="talamo"&&u()<.45){let U=Math.atan2(b.z,b.x),Z=Math.max(.05,j-.035-u()*.03),dt=new F(Math.cos(U+.05)*Z,b.y,Math.sin(U+.05)*Z);nt(_t,dt,M.setRGB(0,0,0),.07+u()*.07,.3,u,d[D.l]??7)}}}let ct=t.arestas.map(([u,M])=>[u,M]);function At(u,M,b=1){let[D,j]=ct[u];lt.fromArray(G,D*3),mt.fromArray(G,j*3),le(lt,mt,St),ye(lt,St,mt,.2+M()*.6,xt);let P=Math.hypot(xt.x,xt.z),U=new zt;Vt(P,M,z[D].l,U),nt(N,xt,U,.06+M()*.07,.085*b,M,d[z[D].l]??7)}{let u=f(77),M=Math.max(1,ct.length/Kt);for(let b=0;b<ct.length;b+=M)At(Math.floor(b),u,Math.min(2,M))}let at=N.tam.length+600;function Nt(u,M){let b=new Ae,D=(j,P)=>{let U=new Float32Array(M*P);return U.set(j),new Qt(U,P)};return b.setAttribute("position",D(u.pos,3)),b.setAttribute("aCor",D(u.cor,3)),b.setAttribute("aTam",D(u.tam,1)),b.setAttribute("aAlfa",D(u.alfa,1)),b.setAttribute("aVar",D(u.var,1)),b.setAttribute("aRot",D(u.rot,1)),b.setAttribute("aReg",D(u.reg,1)),b.setAttribute("aKeep",D(u.keep,1)),b.setDrawRange(0,u.tam.length),b}let Dt=`attribute vec3 aCor; attribute float aTam; attribute float aAlfa; attribute float aVar; attribute float aRot; attribute float aReg; attribute float aKeep;
  uniform float uProj; uniform float uCap; uniform float uQualidade; uniform float uDens; uniform float uRegiao; uniform float uEscondeArq;
  varying vec3 vCor; varying float vA; varying float vVar; varying float vRot; varying vec3 vLuz;
  ${Q}
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
  }`,De=u=>`uniform sampler2D uAtlas; varying vec3 vCor; varying float vA; varying float vVar; varying float vRot; varying vec3 vLuz;
  void main(){
    vec2 p = gl_PointCoord - 0.5;
    float c = cos(vRot), s = sin(vRot);
    p = vec2(c * p.x - s * p.y, s * p.x + c * p.y) + 0.5;
    if (p.x < 0.0 || p.y < 0.0 || p.x > 1.0 || p.y > 1.0) discard;
    vec2 cel = vec2(mod(vVar, 4.0), floor(vVar / 4.0));
    float t = texture2D(uAtlas, (cel + p) / 4.0).a;
    ${u?"float l = clamp(dot(vLuz, vec3(0.33)), 0.0, 1.0); gl_FragColor = vec4(0.0, 0.0, 0.0, t * vA * (1.0 - l));":"gl_FragColor = vec4(vCor * t * vA + vLuz * t * 0.9, 1.0);"}
  }`;function ge(u){let M=new Se({transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uAtlas:{value:Oe},uProj:Ft,uCap:Et,uQualidade:Mt,uDens:gt,uRegiao:st,uEscondeArq:vt,uClaroes:me,uClaroesCor:T,uClaroesRaio:g},vertexShader:Dt,fragmentShader:De(u)});return M.blending=In,u?(M.blendSrc=M.blendSrcAlpha=Er,M.blendDst=M.blendDstAlpha=fr):(M.blendSrc=we,M.blendDst=we,M.blendSrcAlpha=Er,M.blendDstAlpha=we),M}let Nn=Nt(N,at),En=new bn(Nn,ge(!1));En.frustumCulled=!1,En.renderOrder=1;let jl=Nt(_t,_t.tam.length),Lr=new bn(jl,ge(!0));Lr.frustumCulled=!1,Lr.renderOrder=2;let Us=new Rs;Us.add(En,Lr);let zi=.5,Nr=new gn(1,1,{type:J.capabilities.isWebGL2&&J.extensions.has("EXT_color_buffer_float")?Zn:Sn,depthBuffer:!1,minFilter:Ne,magFilter:Ne}),Jn=new Ke(new _i(2,2),new Se({transparent:!0,depthTest:!1,depthWrite:!1,uniforms:{uPoeira:{value:Nr.texture}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:`uniform sampler2D uPoeira; varying vec2 vUv;
      void main(){ vec4 p = texture2D(uPoeira, vUv);
        gl_FragColor = vec4(vec3(1.0) - exp(-p.rgb * 1.15), p.a); }`}));Jn.material.blending=In,Jn.material.blendSrc=we,Jn.material.blendDst=dr,Jn.material.blendSrcAlpha=Er,Jn.material.blendDstAlpha=we,Jn.frustumCulled=!1,Jn.renderOrder=1,ht.add(Jn);let Kn=ct.length+400,li=new Float32Array(Kn*3),Fs=new Float32Array(Kn),Ur=new Float32Array(Kn),Os=new Float32Array(Kn).fill(1);function fs(u,M){let[b,D]=ct[u];lt.fromArray(G,b*3),mt.fromArray(G,D*3),le(lt,mt,St),ye(lt,St,mt,.15+M()*.7,xt),li.set([xt.x+A(M)*.006,xt.y+A(M)*.003,xt.z+A(M)*.006],u*3),Fs[u]=M()*100,Ur[u]=d[z[b].l]??7}{let u=f(31);ct.forEach((M,b)=>fs(b,u))}let Tn=new Ae;Tn.setAttribute("position",new Qt(li,3)),Tn.setAttribute("aFase",new Qt(Fs,1)),Tn.setAttribute("aReg",new Qt(Ur,1)),Tn.setAttribute("aNasc",new Qt(Os,1)),Tn.setDrawRange(0,ct.length);let ps={value:0},Bs={value:1},ms=new Se({transparent:!0,depthTest:!1,depthWrite:!1,blending:Is,uniforms:{uTempo:ps,uDpr:Bs,uRegiao:st,uEscondeArq:vt,uClaroes:me,uClaroesCor:T,uClaroesRaio:g,uDens:gt,uTela:Ot},vertexShader:`attribute float aFase; attribute float aReg; attribute float aNasc; uniform float uTempo; uniform float uDpr; uniform float uRegiao; uniform float uEscondeArq; uniform float uDens; uniform float uTela;
    varying float vA; varying vec3 vLuz;
    ${Q}
    void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0);
      float pisca = 0.55 + 0.45 * sin(uTempo * (0.6 + fract(aFase) * 1.4) + aFase);
      float filtro = (uRegiao < 0.0 || abs(aReg - uRegiao) < 0.5) ? 1.0 : 0.12;
      if (uEscondeArq > 0.5 && abs(aReg - 6.0) < 0.5) filtro = 0.0;
      vA = pisca * filtro * aNasc * (0.5 + 0.5 * uDens) * uTela * smoothstep(0.0, 0.08, -mv.z);
      vLuz = luzClaroes(position);
      gl_PointSize = (1.3 + 1.6 * aNasc * step(aNasc, 0.999)) * uDpr * clamp(1.4 / -mv.z, 0.8, 3.0);
      gl_Position = projectionMatrix * mv; }`,fragmentShader:`varying float vA; varying vec3 vLuz;
    void main(){ vec2 d = gl_PointCoord - 0.5; float g = exp(-dot(d, d) * 14.0);
      gl_FragColor = vec4((vec3(1.0, 0.86, 0.62) * 0.4 + vLuz * 1.2) * g * vA, 1.0); }`});ms.blending=In,ms.blendSrc=we,ms.blendDst=we;let Fr=new bn(Tn,ms);Fr.frustumCulled=!1,Fr.renderOrder=3,ht.add(Fr);let Ze=5,bi=new Float32Array(Kn*Ze*6),zs=new Float32Array(Kn*Ze*2),y=new Float32Array(Kn);function k(u){let[M,b]=ct[u];lt.fromArray(G,M*3),mt.fromArray(G,b*3),le(lt,mt,St),y[u]=Math.exp(-lt.distanceTo(mt)*3.2)*Math.min(1,6/Math.sqrt(Math.max(1,z[M].viz.length*z[b].viz.length)));let D=u*Ze*6,j=lt.clone();for(let P=1;P<=Ze;P++)ye(lt,St,mt,P/Ze,xt),bi[D++]=j.x,bi[D++]=j.y,bi[D++]=j.z,bi[D++]=xt.x,bi[D++]=xt.y,bi[D++]=xt.z,j.copy(xt)}ct.forEach((u,M)=>k(M));let $=new Ae;$.setAttribute("position",new Qt(bi,3)),$.setAttribute("aAlfa",new Qt(zs,1)),$.setDrawRange(0,ct.length*Ze*2);let Y=new Se({transparent:!0,depthWrite:!1,depthTest:!1,blending:Is,uniforms:{uAlfa:{value:.07},uTela:Ot},vertexShader:"attribute float aAlfa; varying float vA; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vA = aAlfa * smoothstep(0.0, 0.1, -mv.z); gl_Position = projectionMatrix * mv; }",fragmentShader:"uniform float uAlfa; uniform float uTela; varying float vA; void main(){ gl_FragColor = vec4(vec3(1.0, 0.78, 0.5), uAlfa * uTela * vA); }"}),q=new vr($,Y);q.frustumCulled=!1,q.renderOrder=4,ht.add(q);let yt=new Ae,Ct=new Float32Array(400*Ze*6);yt.setAttribute("position",new Qt(Ct,3)),yt.setDrawRange(0,0);let bt=new xr({color:"#ffffff",transparent:!0,opacity:.28,blending:Is,depthTest:!1,depthWrite:!1}),Pt=new vr(yt,bt);Pt.frustumCulled=!1,Pt.renderOrder=5,ht.add(Pt);let Ut=new Float32Array(W),Wt=new Float32Array(W),jt=new Float32Array(W*3),Lt=new Float32Array(W),pe=new Float32Array(W),Le=new Float32Array(W),Ce=new Float32Array(W),he=new zt;function Ve(u){let M=u.viz.length;Ut[u.i]=u.i===it?5:1.3+Math.min(3.2,Math.log2(1+M)*.5),Le[u.i]=M>=40||u.i===it?1:0,he.set(c[u.k]||c.sistema),jt.set([he.r,he.g,he.b],u.i*3),Lt[u.i]=1,pe[u.i]=1,Ce[u.i]=u.l==="tronco"?.4:1}z.forEach(Ve);let Tt=new Ae;Tt.setAttribute("position",new Qt(G,3));for(let[u,M,b]of[["aTam",Ut,1],["aAtiv",Wt,1],["aCor",jt,3],["aVis",Lt,1],["aNasc",pe,1],["aEspinho",Le,1],["aDim",Ce,1]])Tt.setAttribute(u,new Qt(M,b));Tt.setDrawRange(0,O);let on={value:1},ae=new Se({transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uEscala:on},vertexShader:`attribute float aTam; attribute float aAtiv; attribute vec3 aCor; attribute float aVis; attribute float aNasc; attribute float aEspinho; attribute float aDim;
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
      gl_FragColor = vec4(c * brilho * vVis * vPerto * vDim, 1.0); }`});ae.blending=In,ae.blendSrc=we,ae.blendDst=we;let hn=new bn(Tt,ae);hn.frustumCulled=!1,hn.renderOrder=6,ht.add(hn);let un=700,Un=new Float32Array(un*3),jn=new Float32Array(un*3),_e=new Float32Array(un),xe=new Ae;xe.setAttribute("position",new Qt(Un,3)),xe.setAttribute("aCor",new Qt(jn,3)),xe.setAttribute("aForca",new Qt(_e,1));let ci=`attribute vec3 aCor; attribute float aForca; uniform float uEscala; varying vec3 vCor; varying float vF;
  void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vCor = aCor; vF = aForca;
    gl_PointSize = min((2.0 + 6.0 * aForca) * uEscala * clamp(1.6 / -mv.z, 0.6, 10.0), 120.0); gl_Position = projectionMatrix * mv; }`,be=`varying vec3 vCor; varying float vF;
  void main(){ vec2 d = gl_PointCoord - 0.5; float r2 = dot(d, d) * 4.0; if (r2 > 1.0) discard;
    float g = exp(-r2 * 6.0) * 0.8 + exp(-r2 * 40.0);
    gl_FragColor = vec4(vCor * g * vF, 1.0); }`;function Wn(){let u=new Se({transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uEscala:on},vertexShader:ci,fragmentShader:be});return u.blending=In,u.blendSrc=we,u.blendDst=we,u}let hi=new bn(xe,Wn());hi.frustumCulled=!1,hi.renderOrder=7,ht.add(hi);let Vi=[],tu={value:new $t(1,1)};function eu(u,M){let b=new Float32Array(u*12),D=new Float32Array(u*12),j=new Float32Array(u*4),P=new Float32Array(u*4),U=new Float32Array(u*4),Z=new Float32Array(u*4),dt=new Float32Array(u*12),ot=new Uint32Array(u*6);for(let Bt=0;Bt<u;Bt++){let Zt=Bt*4;ot.set([Zt,Zt+1,Zt+2,Zt+2,Zt+1,Zt+3],Bt*6),j.set([-1,1,1,-1],Zt),P.set([-1,1,-1,1],Zt)}let ft=new Ae;ft.setIndex(new Qt(ot,1));let It={position:[b,3],aOutro:[D,3],aLado:[j,1],aAlfa:[U,1],aLarg:[Z,1],aCor:[dt,3]};for(let Bt in It)ft.setAttribute(Bt,new Qt(It[Bt][0],It[Bt][1]));ft.setAttribute("aPerfil",new Qt(P,1)),ft.setDrawRange(0,0);let fe=new Se({transparent:!0,depthWrite:!1,depthTest:!1,side:Gn,uniforms:{uRes:tu,uDpr:Bs,uBranco:{value:M}},vertexShader:`attribute vec3 aOutro; attribute float aLado; attribute float aPerfil; attribute float aAlfa; attribute float aLarg; attribute vec3 aCor;
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
        gl_FragColor = vec4((mix(vC, vec3(0.95, 0.97, 1.0), uBranco) * nucleo * 0.85 + vC * brilho * 0.3) * vA, 1.0); }`});fe.blending=In,fe.blendSrc=we,fe.blendDst=we;let kt=new Ke(ft,fe);kt.frustumCulled=!1;let ee={mesh:kt,n:0,seg(Bt,Zt,ne,Cn,sn,vn,$e){if(ee.n>=u)return;let He=ee.n*4,ue=He*3;b[ue]=b[ue+3]=Bt.x,b[ue+1]=b[ue+4]=Bt.y,b[ue+2]=b[ue+5]=Bt.z,b[ue+6]=b[ue+9]=Zt.x,b[ue+7]=b[ue+10]=Zt.y,b[ue+8]=b[ue+11]=Zt.z,D[ue]=D[ue+3]=Zt.x,D[ue+1]=D[ue+4]=Zt.y,D[ue+2]=D[ue+5]=Zt.z,D[ue+6]=D[ue+9]=Bt.x,D[ue+7]=D[ue+10]=Bt.y,D[ue+8]=D[ue+11]=Bt.z,U[He]=U[He+1]=ne,U[He+2]=U[He+3]=Cn,Z[He]=Z[He+1]=sn,Z[He+2]=Z[He+3]=vn;for(let Rn=0;Rn<4;Rn++)dt[ue+Rn*3]=$e.r,dt[ue+Rn*3+1]=$e.g,dt[ue+Rn*3+2]=$e.b;ee.n++},fim(){if(ft.setDrawRange(0,ee.n*6),ee.n||ee.sujo)for(let Bt in It)ft.attributes[Bt].needsUpdate=!0;ee.sujo=ee.n>0,ee.n=0}};return ee}let Ql=24,Ca=eu(Ql*150,1);Ca.mesh.renderOrder=8;let Ra=Ql*24,Pa=new Float32Array(Ra*3),Ia=new Float32Array(Ra*3),nu=new Float32Array(Ra),ki=new Ae;ki.setAttribute("position",new Qt(Pa,3)),ki.setAttribute("aCor",new Qt(Ia,3)),ki.setAttribute("aForca",new Qt(nu,1));let tc=new bn(ki,Wn());tc.frustumCulled=!1,tc.renderOrder=8,ht.add(Ca.mesh,tc);let Vs=[],Si=f(4242),Or=new F;function iu(u,M,b,D,j,P=0,U=0,Z=1){let dt=[u.clone(),M.clone()],ot=u.distanceTo(M),ft=M.clone().sub(u).normalize(),It=ot*(P?.17:.12);for(let ee=0;ee<b;ee++){for(let Bt=dt.length-1;Bt>0;Bt--){let Zt=dt[Bt-1].clone().add(dt[Bt]).multiplyScalar(.5);Or.set(A(Si),A(Si)*.6,A(Si)),Or.addScaledVector(ft,-Or.dot(ft)*.8),Zt.addScaledVector(Or,It),dt.splice(Bt,0,Zt)}It*=.5}let fe=dt.length,kt=dt.map((ee,Bt)=>U+Bt/(fe-1)*Z);D.push({pts:dt,prof:P,cheg:kt});for(let ee=0;ee<j;ee++){let Bt=2+Math.floor(Si()*(fe*.75-2)),Zt=dt[Bt+1].clone().sub(dt[Bt-1]).normalize();Zt.add(Or.set(A(Si),A(Si)*.5,A(Si)).multiplyScalar(.85)).normalize();let ne=dt[Bt].clone().addScaledVector(Zt,ot*(.08+Si()*.16)*(P?.55:1)),Cn=P===0&&!p.reduzidos?Si()<.6?2:1:0;iu(dt[Bt],ne,Math.max(2,b-2),D,Cn,P+1,kt[Bt],Z*.55)}return D}let Sf=new zt("#a8c0ff");function su(u,M,b,D=1,j=!0){if(p.movimentoReduzido){j&&X(M,b,.5*D,.12,700);return}let P=iu(u,M,5,[],p.reduzidos?1:3);Vs.length>=Ql&&Vs.shift(),Vs.push({linhas:P,t0:dn,cor:Sf.clone().lerp(new zt(b),.3),forca:D,clarao:j?M.clone():null})}let Ei=110,ru=Ei+760;function Ef(u){if(p.reduzidos||p.movimentoReduzido){let b=Math.min(1,u/ru);return{prog:Math.min(1,u/Ei),canal:Math.pow(1-b,2),galho:Math.pow(1-b,2)*.6,ponta:0}}if(u<Ei)return{prog:(Math.floor(u/Ei*8)+1)/8,canal:.28,galho:.2,ponta:.9};let M=u-Ei;return M<55?{prog:1,canal:1.3,galho:.8,ponta:0}:M<105?{prog:1,canal:.3,galho:.12,ponta:0}:M<165?{prog:1,canal:1,galho:.28,ponta:0}:{prog:1,canal:.75*Math.exp(-(M-165)/190),galho:.35*Math.exp(-(M-165)/90),ponta:0}}function Tf(u){return p.reduzidos||p.movimentoReduzido?Math.pow(1-u,2):u<.12?1:u<.22?.25:u<.42?.9:Math.max(0,1-(u-.42)/.58)*.8}let Af=[7,3.6,2.2],wf=new zt("#9a7bff"),au=new zt;function Cf(u){let M=0;for(let b=Vs.length-1;b>=0;b--){let D=Vs[b],j=u-D.t0;if(j>=ru){Vs.splice(b,1);continue}let P=Ef(j);D.clarao&&j>=Ei&&(X(D.clarao,"#cfe6ff",.55*D.forca,.16,650),D.clarao=null);let U=Math.min(1,Math.max(0,(j-Ei-165)/400));au.copy(D.cor).lerp(wf,U);for(let{pts:Z,prof:dt,cheg:ot}of D.linhas){let ft=(dt===0?P.canal:P.galho/dt)*D.forca;if(ft<.004&&!P.ponta)continue;let It=Af[Math.min(2,dt)],fe=Z.length;for(let kt=1;kt<fe&&!(ot[kt]>P.prog);kt++){let ee=P.ponta&&ot[kt]>P.prog-.07?P.ponta:0,Bt=Math.max(ft,ee)*(dt?1-.5*kt/fe:1),Zt=dt?It*(1-.6*(kt-1)/fe):It,ne=dt?It*(1-.6*kt/fe):It;Ca.seg(Z[kt-1],Z[kt],Bt,Bt,Zt,ne,au),dt===0&&kt%5===0&&M<Ra&&Bt>.2&&(Pa[M*3]=Z[kt].x,Pa[M*3+1]=Z[kt].y,Pa[M*3+2]=Z[kt].z,Ia[M*3]=D.cor.r,Ia[M*3+1]=D.cor.g,Ia[M*3+2]=D.cor.b,nu[M]=Bt*.3,M++)}}}Ca.fim(),ki.setDrawRange(0,M),ki.attributes.position.needsUpdate=!0,ki.attributes.aCor.needsUpdate=!0,ki.attributes.aForca.needsUpdate=!0}let ks=new Se({transparent:!0,depthWrite:!1,depthTest:!1,side:Gn,uniforms:{uP:{value:0},uSem:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uP; uniform float uSem; varying vec2 vUv;
    void main(){ vec2 q = vUv - 0.5; float r = length(q) * 2.0, a = atan(q.y, q.x);
      // frente irregular: a onda avan\xE7a mais em uns \xE2ngulos que em outros
      float irr = sin(a * 7.0 + uSem) * 0.5 + sin(a * 13.0 - uSem * 2.0) * 0.3 + sin(a * 29.0 + uSem * 3.0) * 0.2;
      float fr = 0.95 + irr * 0.012;
      float frente = exp(-pow((r - fr) / 0.016, 2.0)) * (0.75 + 0.25 * sin(a * 3.0 + uSem));
      float rastro = exp(-pow((r - fr + 0.1) / 0.09, 2.0)) * step(r, fr);
      float f = pow(1.0 - uP, 1.5) * step(r, 1.0);
      vec3 c = vec3(0.7, 0.88, 1.0) * frente * 0.24 + mix(vec3(0.94, 0.55, 0.24), vec3(0.55, 0.23, 0.13), uP) * rastro * 0.3;
      gl_FragColor = vec4(c * f, 1.0); }`});ks.blending=In,ks.blendSrc=we,ks.blendDst=we;let Hi=new Ke(new _i(2,2),ks);Hi.rotation.x=-Math.PI/2,Hi.visible=!1,Hi.renderOrder=7,Hi.frustumCulled=!1,ht.add(Hi);let Gi=null,Hs=new Se({transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uF:{value:0},uTam:{value:100}},vertexShader:"uniform float uTam; void main(){ gl_PointSize = uTam; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uF;
    void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d) * 2.0;
      float nucleo = exp(-r * r * 220.0) * 1.0 + exp(-r * r * 30.0) * 0.22 + exp(-r * 7.0) * 0.08;
      vec2 q = abs(d) * 2.0;
      float esp = exp(-q.x * 110.0) * exp(-q.y * 2.4) + exp(-q.y * 110.0) * exp(-q.x * 2.4);
      vec2 e = abs(vec2(d.x + d.y, d.x - d.y)) * 1.4142;
      float esp2 = (exp(-e.x * 160.0) * exp(-e.y * 6.0) + exp(-e.y * 160.0) * exp(-e.x * 6.0)) * 0.4;
      vec3 c = vec3(1.0, 0.97, 0.92) * nucleo + vec3(0.72, 0.84, 1.0) * esp * 0.9 + vec3(0.66, 0.78, 1.0) * esp2
             + vec3(0.72, 0.42, 0.95) * exp(-r * r * 5.0) * 0.12;
      gl_FragColor = vec4(c * uF * smoothstep(1.0, 0.55, r), 1.0); }`});Hs.blending=In,Hs.blendSrc=we,Hs.blendDst=we;let ou=new Ae;ou.setAttribute("position",new Qt(new Float32Array(3),3));let Gs=new bn(ou,Hs);Gs.frustumCulled=!1,Gs.renderOrder=9,Gs.visible=!1,ht.add(Gs);let Da=eu(520,.3);Da.mesh.renderOrder=8,ht.add(Da.mesh);let gs=[],lu=140,ec=Nt({pos:[],cor:[],tam:[],alfa:[],var:[],rot:[],reg:[],keep:[]},lu),nc=new bn(ec,ge(!1));nc.frustumCulled=!1,nc.renderOrder=1,Us.add(nc);let La=[],Xe=f(5150),Ti=[[0,"#ffffff"],[.1,"#9fd8ff"],[.32,"#f0b44c"],[.58,"#e0733a"],[1,"#8c3b22"]].map(([u,M])=>[u,new zt(M)]);function Rf(u,M){for(let b=1;b<Ti.length;b++)if(u<=Ti[b][0])return M.copy(Ti[b-1][1]).lerp(Ti[b][1],(u-Ti[b-1][0])/(Ti[b][0]-Ti[b-1][0]));return M.copy(Ti[Ti.length-1][1])}function Pf(){let u=p.reduzidos,M=p.movimentoReduzido;if(_s={t0:dn,dur:M?900:2600},M)return;let b=u?140:420;for(let j=0;j<b;j++){let P=new F(A(Xe),A(Xe)*.32,A(Xe)).normalize();gs.push({dir:P,vel:.22+Math.pow(Xe(),.6)*1.15,t0:dn+Xe()*60,vida:1200+Xe()*1500,larg:1.6+Xe()*2.2,rastro:.05+Xe()*.12})}gs.length>1200&&gs.splice(0,gs.length-1200);let D=u?50:lu;La.length=0;for(let j=0;j<D;j++){let P=new F(A(Xe),A(Xe)*.35,A(Xe)).normalize(),U=Xe(),Z=new zt;U<.55?Z.copy(h.laranja).lerp(h.ferrugem,Xe()):U<.82?Z.copy(h.ouro).lerp(h.nucleo,Xe()*.5):Z.copy(h.teal).lerp(h.cavidade,Xe()*.5),La.push({dir:P,R:.18+Math.pow(Xe(),.7)*.75,vida:2400+Xe()*1400,tam:.1+Xe()*.14,cor:Z,varia:Math.floor(Xe()*16),rot:Xe()*6.28})}}let _s=null,Na=null,Ua=new F;function If(u){if(_s){let P=u-_s.t0;if(P/_s.dur>=1)_s=null,Gs.visible=!1;else{let Z=Math.min(1,P/60);Hs.uniforms.uF.value=(p.movimentoReduzido?.5:1)*.8*Z*Math.exp(-Math.max(0,P-60)/520),Hs.uniforms.uTam.value=Math.min(1024,J.domElement.height*(.26+.16*yc(Math.min(1,P/900)))),Gs.visible=!0}}let M=new F,b=new F,D=new zt;for(let P=gs.length-1;P>=0;P--){let U=gs[P],Z=u-U.t0;if(Z>=U.vida){gs.splice(P,1);continue}if(Z<0)continue;let dt=.85,ot=Z/1e3,ft=Z/U.vida,It=U.vel*dt*(1-Math.exp(-ot/dt)),fe=U.vel*Math.exp(-ot/dt);M.copy(U.dir).multiplyScalar(.012+It),b.copy(U.dir).multiplyScalar(Math.max(.006,It-fe*U.rastro-.01)),Rf(ft,D);let kt=Math.pow(1-ft,1.4)*Math.min(1,Z/40);Da.seg(b,M,0,kt,U.larg*.5,U.larg*(1-ft*.5),D)}Da.fim();let j=0;if(_s&&La.length){let P=u-_s.t0,U=ec.attributes;for(let Z of La){let dt=P/Z.vida;if(dt>=1||dt<0)continue;let ot=1-Math.pow(1-dt,3);U.position.array.set([Z.dir.x*Z.R*ot,Z.dir.y*Z.R*ot,Z.dir.z*Z.R*ot],j*3),U.aCor.array.set([Z.cor.r,Z.cor.g,Z.cor.b],j*3),U.aTam.array[j]=Z.tam*(.5+1.6*ot),U.aAlfa.array[j]=.3*Math.min(1,dt/.12)*Math.pow(1-dt,1.4),U.aVar.array[j]=Z.varia,U.aRot.array[j]=Z.rot+dt*.6,U.aReg.array[j]=7,U.aKeep.array[j]=0,j++}for(let Z of["position","aCor","aTam","aAlfa","aVar","aRot","aReg","aKeep"])U[Z].needsUpdate=!0}if(ec.setDrawRange(0,j),Ua.set(0,0,0),Na){let P=(u-Na.t0)/520;if(P>=1)Na=null;else{let U=.0045*Rt.position.distanceTo(Yt.target)*Math.pow(1-P,2);Ua.set(Math.sin(u*.09)*U,Math.sin(u*.13+1)*U,Math.sin(u*.07+2)*U)}}}let Fa=240,Oa=new Float32Array(Fa*3),Ba=new Float32Array(Fa*3),cu=new Float32Array(Fa),Wi=new Ae;Wi.setAttribute("position",new Qt(Oa,3)),Wi.setAttribute("aCor",new Qt(Ba,3)),Wi.setAttribute("aForca",new Qt(cu,1));let ic=new bn(Wi,Wn());ic.frustumCulled=!1,ic.renderOrder=7,ht.add(ic);let Br=[];function An(u){return Lt[u]>.5&&pe[u]>0}function Ai(u,M){Wt[u]=Math.max(Wt[u],M)}let Fn=(u,M=new F)=>M.fromArray(G,u*3);function sc(u,M,b,D,j){if(Vi.length>=(p.reduzidos?160:un)||!An(u)||!An(M))return;let P=Fn(u),U=Fn(M),Z=le(P,U,new F),dt=p.movimentoReduzido?0:300+P.distanceTo(U)*700;Vi.push({a:P,b:U,c:Z,t0:dn,dur:dt,forca:b,cor:D,aoChegar:j})}let Df=f(99);function hu(u){for(let M=u.length-1;M>0;M--){let b=Math.floor(Df()*(M+1));[u[M],u[b]]=[u[b],u[M]]}return u}function rc(u,M,b,D,j=12){if(Ai(u,M),b<=0)return;hu(z[u].viz.filter(An)).slice(0,j).forEach((U,Z)=>{setTimeout(()=>sc(u,U,M*.8,D,()=>{rc(U,M*.55,b-1,D,Math.max(3,Math.floor(j/2.5)))}),p.movimentoReduzido?0:Z*30)})}let ke={ctx:null,marrom:null,branco:null,saida:null};function uu(){if(!ke.ctx){let u=window.AudioContext||window.webkitAudioContext;if(!u)return!1;let M=ke.ctx=new u,b=M.sampleRate*4;ke.marrom=M.createBuffer(1,b,M.sampleRate),ke.branco=M.createBuffer(1,M.sampleRate,M.sampleRate);let D=ke.marrom.getChannelData(0),j=ke.branco.getChannelData(0),P=0;for(let Z=0;Z<b;Z++)P=(P+.02*(Math.random()*2-1))/1.02,D[Z]=P*3.5;for(let Z=0;Z<j.length;Z++)j[Z]=Math.random()*2-1;let U=M.createDynamicsCompressor();ke.saida=M.createGain(),ke.saida.gain.value=.55,ke.saida.connect(U).connect(M.destination)}return ke.ctx.resume(),!0}function za({estalo:u=0,ronco:M=.5,atraso:b=0,dur:D=2.6,grave:j=220}={}){if(!p.som||document.hidden||!ke.ctx&&!uu())return;let P=ke.ctx,U=P.currentTime+b/1e3;if(u){let It=P.createBufferSource(),fe=P.createBiquadFilter(),kt=P.createGain();It.buffer=ke.branco,fe.type="highpass",fe.frequency.value=900,kt.gain.setValueAtTime(1e-4,U),kt.gain.exponentialRampToValueAtTime(u,U+.006),kt.gain.exponentialRampToValueAtTime(1e-4,U+.32),It.connect(fe).connect(kt).connect(ke.saida),It.start(U,Math.random()*.5,.4)}let Z=P.createBufferSource(),dt=P.createBiquadFilter(),ot=P.createGain();Z.buffer=ke.marrom,Z.playbackRate.value=.8+Math.random()*.4,dt.type="lowpass",dt.frequency.setValueAtTime(j*2.2,U),dt.frequency.exponentialRampToValueAtTime(j*.45,U+D);let ft=u?.06:.25;ot.gain.setValueAtTime(1e-4,U),ot.gain.exponentialRampToValueAtTime(M,U+ft),ot.gain.exponentialRampToValueAtTime(M*.4,U+D*.22),ot.gain.exponentialRampToValueAtTime(M*.75,U+D*.36),ot.gain.exponentialRampToValueAtTime(1e-4,U+D),Z.connect(dt).connect(ot).connect(ke.saida),Z.start(U,Math.random()*(4-D-.2),D+.1)}let xn=u=>c[z[u].k]||c.sistema,ac=u=>l[d[z[u].l]??7],du=u=>{let M=ac(u).onde;return(/^(ponta|região)/.test(M)?"na ":"no ")+M},fu=u=>e.mostrarTipo===!1?"":` \xB7 ${m[u.k]||u.k}`,Ws=n("evento"),oc=0;function zr(u,M){Ws.innerHTML="";let b=document.createElement("i");b.style.background=M,Ws.append(b),u.split("**").forEach((D,j)=>{if(j%2){let P=document.createElement("b");P.textContent=D,Ws.append(P)}else Ws.append(D)}),Ws.style.opacity=1,clearTimeout(oc),oc=setTimeout(()=>{Ws.style.opacity=0},6e3)}let Lf=it,Nf=15e3,pu=new Map,Xs=[],Vr=new Map(z.map(u=>[u.id,u.i]));function mu(u,M,b){if(ct.length>=Kn)return-1;ct.push([u,M]),z[u].viz.push(M),z[M].viz.push(u);let D=ct.length-1;k(D),fs(D,b),Os[D]=0;for(let j=0;j<Ze*2;j++)zs[D*Ze*2+j]=0;return N.tam.length<at&&At(D,b,1.4),D}function gu(){fc(),$.setDrawRange(0,ct.length*Ze*2),Tn.setDrawRange(0,ct.length),$.attributes.position.needsUpdate=!0,Tn.attributes.position.needsUpdate=!0,Tn.attributes.aFase.needsUpdate=!0,Tn.attributes.aReg.needsUpdate=!0,Tt.setDrawRange(0,z.length),["position","aTam","aCor","aVis","aEspinho","aDim"].forEach(u=>{Tt.attributes[u].needsUpdate=!0}),gt.value=pt(ct.length),_u(),Au()}function _u(){let u=z.reduce((M,b)=>M+(b.removida?1:0),0);n("n-notas").textContent=ys(z.length-o-u),n("n-sinapses").textContent=ys(ct.length-(t.arestas.length-t.sinapses))}let en={abrir(u,M="abriu"){An(u)&&(rc(u,1,2,xn(u),12),X(Fn(u),xn(u),.35,.08,900),M&&zr(`${M==="clique"?e.textoClique||"Abriria numa aba nova":"Abriu"} **${z[u].t}**${fu(z[u])} ${du(u)}`,xn(u)))},salvar(u){if(!An(u))return;if(dn-(pu.get(u)??-1e9)<Nf){rc(u,.7,1,xn(u),6),X(Fn(u),xn(u),.3,.12,900),zr(`Salvou **${z[u].t}** de novo \xB7 pulso suave (raio no m\xE1ximo a cada 15 s)`,xn(u));return}pu.set(u,dn),Ai(u,1.5);let M=Fn(u),b=p.reduzidos?2:4,D=z[u].viz.filter(An).map(ot=>[ot,M.distanceTo(Fn(ot))]).sort((ot,ft)=>ft[1]-ot[1]),j=D.filter(([ot])=>z[ot].l!==z[u].l),P=D.filter(([ot])=>z[ot].l===z[u].l),U=j.slice(0,Math.ceil(b/2)),Z=[...j.slice(U.length),...P].sort((ot,ft)=>ft[1]-ot[1]).slice(0,b-U.length),dt=[...U,...Z].map(([ot])=>ot);X(M,xn(u),.55,.13,900,!0),za({estalo:.5,ronco:.6,atraso:p.movimentoReduzido?0:Ei,dur:2.4,grave:260}),dt.forEach((ot,ft)=>setTimeout(()=>{su(M,Fn(ot),xn(u),ft?.75:1,ft<3),setTimeout(()=>Ai(ot,.9),p.movimentoReduzido?0:Ei)},p.movimentoReduzido?0:ft*40)),zr(`Salvou **${z[u].t}** \xB7 raio para ${dt.length} ${dt.length===1?"nota ligada":"notas ligadas"}`,xn(u))},nova(u,M){if(z.length>=W)return-1;let b=z.length,D,j;if(typeof u=="number"){let ot=z[u];D={id:`${ot.id.split("/")[0]}/Nota nova ${b-O+1}`,t:`Nota nova ${b-O+1}`,l:ot.l,k:ot.k,s:ot.s,i:b,viz:[]},j=[u,...hu(ot.viz.slice()).slice(0,2)]}else D={...u,i:b,viz:[]},j=(M||[]).filter(ot=>ot>=0&&ot<b);z.push(D),Vr.set(D.id,b);let P=rt(D);G.set([P.x,P.y,P.z],b*3),Ve(D),pe[b]=0;let U=f(x(D.id)),Z=[];for(let ot of j){let ft=mu(ot,b,U);ft>=0&&Z.push(ft)}if(N.tam.length<at){let ot=new zt;Vt(Math.hypot(P.x,P.z),U,D.l,ot),nt(N,P,ot,.12,.08,U,d[D.l]??7)}gu();let dt=p.reduzidos?18:44;for(let ot=0;ot<dt&&Br.length<Fa;ot++){let ft=U()*Math.PI*2,It=.05+U()*.07;Br.push({alvo:P.clone(),ang:ft,r:It,y:A(U)*.02,t0:dn+U()*200,dur:1300+U()*300,cor:Vt(Math.hypot(P.x,P.z),U,D.l,new zt)})}return Xs.push({i:b,t0:dn,arestas:Z}),zr(`Nasceu **${D.t}** ${du(b)}, ligada a ${Z.length} ${Z.length===1?"nota":"notas"}`,xn(b)),b},ligar(u,M){if(u===M||u<0||M<0||z[u].viz.includes(M))return;let b=mu(u,M,f(x(z[u].id+">"+z[M].id)));b<0||(Ve(z[u]),Ve(z[M]),gu(),Xs.push({i:u,t0:dn,arestas:[b],soArestas:!0}),sc(u,M,.8,xn(u),()=>Ai(M,.7)))},remover(u){u<0||z[u].removida||(z[u].removida=!0,Vr.delete(z[u].id),p.selecionado===u&&Xi(-1),Hr(),_u())},renomear(u,M,b){u<0||(Vr.delete(z[u].id),z[u].id=M,z[u].t=b,Vr.set(M,u))},captura(){Gi={t0:dn,dur:p.movimentoReduzido?1:2400},ks.uniforms.uSem.value=Math.random()*100,Ai(Lf,1.6),Pf(),X(new F(0,0,0),"#fff1d6",.5,.24,1300),setTimeout(()=>X(new F(0,0,0),"#e0733a",.35,.5,1800),p.movimentoReduzido?0:260),!p.movimentoReduzido&&!p.reduzidos&&(Na={t0:dn}),za({estalo:.35,ronco:.95,dur:3.8,grave:130}),zr(`Captura nova em **${e.nomeCaptura||"01_ENTRADA"}** \xB7 tempestade a partir do n\xFAcleo`,"#cfe6ff")}},xs=n("rotulo"),nn={x:0,y:0,dentro:!1,moveu:!0,baixo:null},qs=new F;function xu(u,M){let b=J.domElement.getBoundingClientRect(),D=-1,j=1/0;for(let P=0;P<z.length;P++){if(!An(P)||(qs.fromArray(G,P*3).project(Rt),qs.z>1||qs.z<-1))continue;let U=(qs.x*.5+.5)*b.width+b.left,Z=(-qs.y*.5+.5)*b.height+b.top,dt=Math.hypot(U-u,Z-M);if(dt<9+Ut[P]*1.5){let ot=qs.z+dt*6e-4;ot<j&&(j=ot,D=P)}}return D}function vu(u,M,b){if(u<0){xs.classList.remove("visivel");return}let D=z[u];xs.querySelector("strong").textContent=D.t,xs.querySelector("span").textContent=`${ac(u).nome}${fu(D)} \xB7 ${D.viz.length} ${D.viz.length===1?"sinapse":"sinapses"}`;let j=xs.offsetWidth,P=i.getBoundingClientRect();xs.style.left=`${Math.min(M-P.left,P.width-j-20)}px`,xs.style.top=`${b-P.top}px`,xs.classList.add("visivel")}J.domElement.addEventListener("pointermove",u=>{nn.x=u.clientX,nn.y=u.clientY,nn.dentro=!0,nn.moveu=!0}),J.domElement.addEventListener("pointerleave",()=>{nn.dentro=!1,p.sobre=-1,vu(-1)}),J.domElement.addEventListener("pointerdown",u=>{nn.baixo=[u.clientX,u.clientY],uc(),On=null}),J.domElement.addEventListener("pointerup",u=>{if(!nn.baixo)return;let M=Math.hypot(u.clientX-nn.baixo[0],u.clientY-nn.baixo[1]);if(nn.baixo=null,M>4)return;let b=xu(u.clientX,u.clientY);b>=0?(Xi(b,!0),en.abrir(b,"clique"),e.aoAbrir?.(z[b].id)):Xi(-1)}),J.domElement.addEventListener("wheel",()=>{uc(),On=null},{passive:!0});function Xi(u,M){if(p.selecionado=u,u<0){yt.setDrawRange(0,0),yu();return}let b=z[u].viz.filter(An).slice(0,400),D=Fn(u),j=new F,P=new F,U=new F,Z=0;for(let dt of b){Fn(dt,j),le(D,j,P);let ot=D.clone();for(let ft=1;ft<=Ze;ft++)ye(D,P,j,ft/Ze,U),Ct[Z++]=ot.x,Ct[Z++]=ot.y,Ct[Z++]=ot.z,Ct[Z++]=U.x,Ct[Z++]=U.y,Ct[Z++]=U.z,ot.copy(U)}yt.attributes.position.needsUpdate=!0,yt.setDrawRange(0,b.length*Ze*2),bt.color.set(xn(u)),lc=.28*Math.min(1,4/Math.sqrt(Math.max(1,b.length))),bt.opacity=lc,Va=M?-1:dn,M&&hc(D,.32)}let lc=.28,Va=-1,On=null,cc=()=>1.5*Math.max(1,1.3/(re.clientWidth/re.clientHeight));function hc(u,M,b=Rt.position.clone().sub(Yt.target).normalize()){let D=u.clone().addScaledVector(b,M);On={t0:dn,dur:p.movimentoReduzido?1:1700,alvo0:Yt.target.clone(),alvo1:u.clone(),cam0:Rt.position.clone(),cam1:D,meio:Rt.position.clone().lerp(D,.5).add(new F(0,.08*Rt.position.distanceTo(D),0))}}function yu(){Yt.target.distanceTo(qt)<.01&&Math.abs(Rt.position.distanceTo(Yt.target)-cc())<.05||hc(qt,cc(),Gt.clone().applyAxisAngle(new F(0,1,0),Math.atan2(Rt.position.x-Yt.target.x,Rt.position.z-Yt.target.z)))}let Mu=0;function uc(){Yt.autoRotate=!1,clearTimeout(Mu),Mu=setTimeout(()=>{yu(),Yt.autoRotate=!p.movimentoReduzido},25e3)}Yt.autoRotate=!p.movimentoReduzido,r(_,"change",()=>{Yt.autoRotate=!p.movimentoReduzido});let bu=u=>u.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase(),wn=n("busca-campo"),vs=n("resultados"),Xn=[],Ys=0;function dc(){let u=bu(wn.value.trim());if(vs.innerHTML="",!u){vs.hidden=!0,wn.setAttribute("aria-expanded","false");return}Xn=[];for(let M=0;M<z.length;M++){if(!An(M))continue;let b=bu(z[M].t).indexOf(u);b>=0&&Xn.push([b===0?0:1,-z[M].viz.length,M])}if(Xn.sort((M,b)=>M[0]-b[0]||M[1]-b[1]),Xn=Xn.slice(0,8).map(M=>M[2]),Ys=0,!Xn.length){let M=document.createElement("li");M.className="vazio",M.textContent="Nenhuma estrela com esse t\xEDtulo.",vs.append(M)}Xn.forEach((M,b)=>{let D=document.createElement("li");D.setAttribute("role","option"),D.id=`r${b}`,D.setAttribute("aria-selected",b===0?"true":"false");let j=document.createElement("span");j.className="ponto",j.style.background=xn(M);let P=document.createElement("span");P.className="titulo",P.textContent=z[M].t;let U=document.createElement("span");U.className="lobo",U.textContent=ac(M).nome,D.append(j,P,U),D.addEventListener("mousedown",Z=>{Z.preventDefault(),Su(M)}),vs.append(D)}),vs.hidden=!1,wn.setAttribute("aria-expanded","true")}function Su(u){wn.value="",dc(),wn.blur(),uc(),Xi(u,!0),en.abrir(u,"clique"),e.aoAbrir?.(z[u].id)}wn.addEventListener("input",dc),wn.addEventListener("keydown",u=>{if(u.key==="ArrowDown"||u.key==="ArrowUp"){if(u.preventDefault(),!Xn.length)return;Ys=(Ys+(u.key==="ArrowDown"?1:-1)+Xn.length)%Xn.length,[...vs.children].forEach((M,b)=>M.setAttribute("aria-selected",b===Ys?"true":"false")),wn.setAttribute("aria-activedescendant",`r${Ys}`)}else u.key==="Enter"&&Xn.length?Su(Xn[Ys]):u.key==="Escape"&&(wn.value="",dc(),wn.blur())}),wn.addEventListener("blur",()=>setTimeout(()=>{vs.hidden=!0},120)),r(e.alvoTeclado||window,"keydown",u=>{(u.ctrlKey||u.metaKey)&&u.key.toLowerCase()==="k"?(u.preventDefault(),wn.focus(),wn.select()):u.key==="Escape"&&document.activeElement!==wn&&(Xi(-1),Eu())});let ka=n("botao-filtros"),kr=n("filtros");function Eu(){kr.hidden=!0,ka.setAttribute("aria-expanded","false")}ka.addEventListener("click",()=>{let u=kr.hidden;kr.hidden=!u,ka.setAttribute("aria-expanded",String(u))}),r(document,"pointerdown",u=>{!kr.hidden&&!kr.contains(u.target)&&!ka.contains(u.target)&&Eu()});let Tu=n("lobos");[{id:null,nome:"Todas"},...l.filter(u=>z.some(M=>M.l===u.id))].forEach(u=>{let M=document.createElement("button");M.textContent=u.nome,M.title=u.onde?`${u.nome}: ${u.onde}`:"Todas as regi\xF5es",M.setAttribute("aria-pressed",u.id===null?"true":"false"),M.addEventListener("click",()=>{p.regiao=u.id,[...Tu.children].forEach(b=>b.setAttribute("aria-pressed",b===M?"true":"false")),Hr()}),Tu.append(M)});function Hr(){for(let u=0;u<z.length;u++){let M=z[u],b=1;M.removida||p.esconderArquivo&&M.l==="tronco"?b=0:p.regiao&&M.l!==p.regiao&&(b=.14),Lt[u]=b}for(let u=0;u<ct.length;u++){if(Xs.some(P=>P.arestas.includes(u)))continue;let[M,b]=ct[u],D=Math.min(Lt[M],Lt[b]),j=(D>=1?1:D>0?.08:0)*y[u];for(let P=0;P<Ze*2;P++)zs[u*Ze*2+P]=j}st.value=p.regiao?d[p.regiao]:-1,vt.value=p.esconderArquivo?1:0,Tt.attributes.aVis.needsUpdate=!0,$.attributes.aAlfa.needsUpdate=!0}function fc(){let u=Nn,M=N.tam.length;["position","aCor","aTam","aAlfa","aVar","aRot","aReg","aKeep"].forEach(b=>{let D={position:N.pos,aCor:N.cor,aTam:N.tam,aAlfa:N.alfa,aVar:N.var,aRot:N.rot,aReg:N.reg,aKeep:N.keep}[b];u.attributes[b].array.set(D),u.attributes[b].needsUpdate=!0}),u.setDrawRange(0,M),Mt.value=p.reduzidos||p.qualidadeAjustada?.6:1}function Au(){n("poeira").innerHTML="";let u=n("poeira"),M=document.createElement("b");M.textContent=`${Math.round(gt.value*100)}%`,u.append("Poeira estelar ",M,` \xB7 cresce com as sinapses (${ys(ct.length-(t.arestas.length-t.sinapses))})`)}n("f-arquivo").addEventListener("change",u=>{p.esconderArquivo=u.target.checked,Hr(),e.aoMudarConfig?.(S())}),n("f-fundo").addEventListener("change",u=>{p.fundo=u.target.checked,e.aoMudarConfig?.(S())}),n("f-reduzidos").addEventListener("change",u=>{p.reduzidos=u.target.checked,fc(),Ga(!1),e.aoMudarConfig?.(S())}),n("f-som").addEventListener("change",u=>{p.som=u.target.checked&&uu(),u.target.checked=p.som,p.som&&za({ronco:.3,dur:2.2,grave:180}),e.aoMudarConfig?.(S())}),n("f-arquivo").checked=p.esconderArquivo,n("f-fundo").checked=p.fundo,n("f-reduzidos").checked=p.reduzidos,n("f-som").checked=p.som;let Zs=f(2024),pc=z.filter(u=>u.l==="parietal"&&u.viz.length>20).map(u=>u.i),wi=pc[0]??0;function wu(){let u=z[wi].viz.filter(An);return!u.length||Zs()<.18?wi=pc[Math.floor(Zs()*pc.length)]??wi:wi=u[Math.floor(Zs()*u.length)],wi}i.querySelectorAll("#simular [data-evento]").forEach(u=>u.addEventListener("click",()=>{let M=u.dataset.evento;if(M==="abrir"){let b=wu();Xi(b,!1),en.abrir(b)}else M==="salvar"?en.salvar(p.selecionado>=0?p.selecionado:wi):M==="nova"?en.nova(p.selecionado>=0?p.selecionado:wi):en.captura()}));let mc=n("demo");mc&&mc.addEventListener("click",()=>{p.demo=!p.demo,mc.setAttribute("aria-pressed",String(p.demo))});let $s=1800;function Uf(u){if(!p.demo||($s-=u,$s>0))return;let M=Zs();if(M<.55){let b=wu();Xi(b,!1),en.abrir(b),$s=3200+Zs()*3500}else M<.82?(en.salvar(wi),$s=2800+Zs()*2600):M<.91?(en.captura(),$s=4600):(en.nova(wi),$s=4600)}let ys=u=>u.toLocaleString("pt-BR");n("n-notas").textContent=ys(t.notas),n("n-sinapses").textContent=ys(t.sinapses);let dn=performance.now(),gc=dn,_c=600,xc=9e3,Js=!0,Gr=0,Ks=[],Ff=n("desempenho"),Ha=0;Hr(),Au();function Ga(u=!0){let M=re.clientWidth,b=re.clientHeight,D=Math.min(devicePixelRatio||1,p.reduzidos||p.qualidadeAjustada?1:1.5);J.setPixelRatio(D),J.setSize(M,b,!1),Rt.aspect=M/b,u&&!On&&Rt.position.sub(Yt.target).setLength(cc()).add(Yt.target),Rt.updateProjectionMatrix(),tt.value=b*D/2/Math.tan(vi.degToRad(ut/2)),on.value=b*D*.0016,Bs.value=D,Ft.value=tt.value*zi,Et.value=Math.max(24,.12*b*D*zi),Nr.setSize(Math.max(1,Math.round(M*D*zi)),Math.max(1,Math.round(b*D*zi))),Ot.value=vi.clamp(Math.min(M,b)/800,.35,1),tu.value.set(M*D/2,b*D/2),ze.value=tt.value,Ge.value=.2*b*D,ht.getObjectByName("ceu").material.uniforms.uDpr.value=D,te.material.uniforms.uAspecto.value=M/b}let Cu=new ResizeObserver(()=>Ga());Cu.observe(re),Ga();let Ru=!0,Pu=!1;function vc(){let u=Js;Js=!Pu&&Ru&&!document.hidden,ke.ctx&&(Js&&p.som?ke.ctx.resume():ke.ctx.suspend()),Js!==u&&(cancelAnimationFrame(Gr),Js&&(gc=performance.now(),Gr=requestAnimationFrame(Mc)))}r(document,"visibilitychange",vc);let yc=u=>1-Math.pow(1-u,3),Iu=u=>u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;function Mc(u){if(!Js)return;dn=u;let M=Math.min(64,u-gc);if(gc=u,Ks.push(M),Ks.length>90&&Ks.shift(),ps.value=u/1e3,p.fundo){if(_c-=M,_c<=0){let P=Math.floor(Math.random()*z.length);if(An(P)&&(Ai(P,.22+Math.random()*.12),Math.random()<.15&&!p.reduzidos)){let U=z[P].viz[Math.floor(Math.random()*z[P].viz.length)];U!==void 0&&sc(P,U,.35,xn(P),()=>Ai(U,.18))}_c=(p.reduzidos?900:280)+Math.random()*520}if(xc-=M,xc<=0&&!p.movimentoReduzido){let P=Math.floor(Math.random()*O);An(P)&&(X(Fn(P),Math.random()<.5?"#f0b44c":"#3cc3d0",.32,.12,900,!0),za({ronco:.16,atraso:700+Math.random()*1200,dur:3,grave:150})),xc=9e3+Math.random()*9e3}}Uf(M);for(let P=0;P<B;P++){let U=We[P],Z=(u-U.t0)/U.dur,dt=Z<0||Z>=1?0:U.forca*(U.piscar?Tf(Z):Math.pow(1-Z,2));me.value[P].set(U.pos.x,U.pos.y,U.pos.z,dt),T.value[P].set(U.cor.r,U.cor.g,U.cor.b),g.value[P]=U.raio*U.raio}if(Gi){let P=Math.min(1,(u-Gi.t0)/Gi.dur),U=.05+yc(P)*1.05;Hi.visible=!0,Hi.scale.setScalar(U),ks.uniforms.uP.value=P,Gi.raios||(Gi.raios=[.3,.55,.8].map(Z=>({x:Z,feito:!1})));for(let Z of Gi.raios)if(!Z.feito&&U>Z.x){Z.feito=!0;for(let dt=0;dt<(p.reduzidos?1:2);dt++){let ot=z.filter(It=>An(It.i)&&Math.abs(Math.hypot(G[It.i*3],G[It.i*3+2])-Z.x)<.04),ft=ot[Math.floor(Math.random()*ot.length)];ft&&ft.viz.length&&su(Fn(ft.i),Fn(ft.viz[Math.floor(Math.random()*ft.viz.length)]),"#cfe6ff",.8,!1)}}for(let Z=0;Z<z.length;Z++){if(!An(Z))continue;let dt=Math.hypot(G[Z*3],G[Z*3+2]);Math.abs(dt-U)<.02&&Ai(Z,.4)}P>=1&&(Gi=null,Hi.visible=!1)}let b=Math.exp(-M/850);for(let P=0;P<z.length;P++)Wt[P]=Wt[P]>.001?Wt[P]*b:0;Tt.attributes.aAtiv.needsUpdate=!0;let D=0;for(let P=Br.length-1;P>=0;P--){let U=Br[P],Z=(u-U.t0)/U.dur;if(Z>=1){Br.splice(P,1);continue}if(Z<0)continue;let dt=Iu(Z),ot=U.ang+dt*5.5,ft=U.r*(1-dt);Oa[D*3]=U.alvo.x+Math.cos(ot)*ft,Oa[D*3+1]=U.alvo.y+U.y*(1-dt),Oa[D*3+2]=U.alvo.z+Math.sin(ot)*ft,Ba[D*3]=U.cor.r,Ba[D*3+1]=U.cor.g,Ba[D*3+2]=U.cor.b,cu[D]=.25+dt*.6,D++}Wi.setDrawRange(0,D),Wi.attributes.position.needsUpdate=!0,Wi.attributes.aCor.needsUpdate=!0,Wi.attributes.aForca.needsUpdate=!0;for(let P=Xs.length-1;P>=0;P--){let U=Xs[P],Z=Math.min(1,(u-U.t0)/(p.movimentoReduzido?1:2400)),dt=Math.max(0,(Z-.58)/.42);U.soArestas||(pe[U.i]=dt>0?Math.max(.001,yc(dt)):0,dt>0&&!U.clarao&&(U.clarao=!0,X(Fn(U.i),xn(U.i),1.1,.1,900),Ai(U.i,1.3)));let ot=Math.max(0,(Z-.7)/.3);for(let ft of U.arestas){for(let It=0;It<Ze*2;It++)zs[ft*Ze*2+It]=ot*2;Os[ft]=ot}$.attributes.aAlfa.needsUpdate=!0,Tn.attributes.aNasc.needsUpdate=!0,Z>=1&&(Xs.splice(P,1),Hr())}Tt.attributes.aNasc.needsUpdate=!0;let j=0;for(let P=Vi.length-1;P>=0;P--){let U=Vi[P],Z=U.dur?(u-U.t0)/U.dur:1;if(Z>=1){Vi.splice(P,1),U.aoChegar&&U.aoChegar();continue}j>=un||(ye(U.a,U.c,U.b,Z,xt),Un[j*3]=xt.x,Un[j*3+1]=xt.y,Un[j*3+2]=xt.z,he.set(U.cor),jn[j*3]=he.r,jn[j*3+1]=he.g,jn[j*3+2]=he.b,_e[j]=U.forca*(Z<.15?Z/.15:1),j++)}if(xe.setDrawRange(0,j),xe.attributes.position.needsUpdate=!0,xe.attributes.aCor.needsUpdate=!0,xe.attributes.aForca.needsUpdate=!0,Cf(u),If(u),Va>=0){let P=(u-Va)/3e3;bt.opacity=lc*Math.max(0,1-P),P>=1&&(Va=-1,yt.setDrawRange(0,0))}if(On){let P=Math.min(1,(u-On.t0)/On.dur),U=Iu(P);Yt.target.lerpVectors(On.alvo0,On.alvo1,U),ye(On.cam0,On.meio,On.cam1,U,Rt.position),Rt.fov=ut+(p.movimentoReduzido?0:9*Math.sin(Math.PI*U)),Rt.updateProjectionMatrix(),P>=1&&(On=null,Rt.fov=ut,Rt.updateProjectionMatrix())}if(nn.dentro&&nn.moveu&&!nn.baixo){nn.moveu=!1;let P=xu(nn.x,nn.y);P!==p.sobre&&(p.sobre=P,J.domElement.classList.toggle("sobre-no",P>=0)),vu(P,nn.x,nn.y)}if(Yt.update(),J.setRenderTarget(Nr),J.setClearColor(0,1),J.clear(!0,!1,!1),Rt.position.add(Ua),se.position.copy(Rt.position),J.render(Us,Rt),J.setRenderTarget(null),J.setClearColor(461590,1),J.render(ht,Rt),Rt.position.sub(Ua),Ks.length>=30&&Math.round(u/500)!==Math.round((u-M)/500)){let U=1e3/(Ks.reduce((Z,dt)=>Z+dt,0)/Ks.length);window.__fps=U,U<28&&!p.qualidadeAjustada?(Ha=Ha||u,u-Ha>3e3&&(p.qualidadeAjustada=!0,fc(),Ga(!1))):Ha=0,Ff.textContent=`Desempenho: ${Math.round(U)} fps \xB7 ${ys(z.length)} estrelas${o?` (${ys(o)} sint\xE9ticas, carga de teste)`:""}${p.qualidadeAjustada?" \xB7 qualidade ajustada":""}`}Gr=requestAnimationFrame(Mc)}Gr=requestAnimationFrame(Mc);let ui=u=>Vr.get(u)??-1;return{eventos:en,nos:z,selecionar:Xi,estado:p,camera:Rt,controls:Yt,voarPara:hc,indice:ui,abrir(u){let M=ui(u);M>=0&&en.abrir(M)},salvar(u){let M=ui(u);M>=0&&en.salvar(M)},captura(){en.captura()},nova(u,M){return ui(u.id)>=0?ui(u.id):en.nova(u,M.map(ui))},ligar(u,M){en.ligar(ui(u),ui(M))},remover(u){en.remover(ui(u))},renomear(u,M,b){en.renomear(ui(u),M,b)},definirVisivel(u){Ru=u,vc()},definirConfig(u){let M={esconderArquivo:"f-arquivo",fundo:"f-fundo",reduzidos:"f-reduzidos",som:"f-som"};for(let b in M){let D=n(M[b]);typeof u[b]=="boolean"&&D.checked!==u[b]&&(D.checked=u[b],D.dispatchEvent(new Event("change")))}},destruir(){Pu=!0,vc(),cancelAnimationFrame(Gr),s.forEach(u=>u()),Cu.disconnect(),clearTimeout(oc),ke.ctx&&ke.ctx.close(),J.dispose(),J.forceContextLoss(),i.innerHTML="",i.classList.remove("cg-raiz","com-simulacao")}}}var Aa={frontal:"Bra\xE7o 1 (o mais longo)",motor:"Bra\xE7o 2",parietal:"Ponta do bra\xE7o 2",temporal:"Bra\xE7o 3",occipital:"Ponta do bra\xE7o 3",cerebelo:"Bra\xE7o 4",tronco:"Halo, fora do disco",talamo:"N\xFAcleo"},kx=i=>typeof i=="string"&&i in Aa,Ir={"60_CONHECIMENTO":["frontal","conhecimento"],"10_PROJETOS":["parietal","projeto"],"20_REGRAS":["temporal","regra"],"50_METODOS":["temporal","metodo"],"30_INCIDENTES":["occipital","incidente"],"40_DECISOES":["motor","decisao"],"70_FONTES":["cerebelo","fonte"],"80_PESQUISA":["cerebelo","pesquisa"],"99_ARQUIVO":["tronco","arquivo"],"90_SISTEMA":["talamo","sistema"]},Hx={frontal:"conhecimento",motor:"decisao",parietal:"projeto",temporal:"regra",occipital:"incidente",cerebelo:"fonte",tronco:"arquivo",talamo:"sistema"},yf=["frontal","motor","temporal","cerebelo","parietal","occipital"],Gx=/arquiv|archive|antig|^old$|lixeira|trash/i,Wx=i=>i.includes("/")?i.slice(0,i.indexOf("/")):"";function Zl(i,t){let e=new Map;for(let d of i){let m=Wx(d);m&&e.set(m,(e.get(m)??0)+1)}let n=[...e.keys()].sort((d,m)=>e.get(m)-e.get(d)||d.localeCompare(m)),s=new Map,r=new Map,a=(d,m)=>{s.set(m,d),r.set(d,(r.get(d)??0)+e.get(m))};for(let d of n)Ir[d]&&a(Ir[d][0],d);let o=yf.filter(d=>!r.has(d));for(let d of n){if(s.has(d))continue;if(Gx.test(d)){a("tronco",d);continue}let m=o.shift()??yf.reduce((h,_)=>(r.get(_)??0)<(r.get(h)??0)?_:h);a(m,d)}let c=new Map;for(let d of n){let m=t[d];c.set(d,kx(m)?m:s.get(d))}let l=n.filter(d=>Ir[d]).length>=3;return{regiao:c,auto:s,contagem:e,cerebro:l}}function Jh(i,t){let e=i.replace(/\.md$/i,""),n=e.split("/"),s=n.length>1?n[0]:"",r=s?t.regiao.get(s)??"talamo":"talamo",a=t.cerebro&&Ir[s]?.[1]||Hx[r],o="";return Ir[s]&&t.cerebro?s==="60_CONHECIMENTO"&&n.length>2?o=n[1]==="VIDEO"&&n.length>3?`VIDEO/${n[2]}`:n[1]:s==="10_PROJETOS"&&n.length>2&&(o=n[1]):n.length>2&&(o=n[1]),{id:e,t:n[n.length-1],l:r,k:a,s:o}}function $l(i){let t=i.replace(/^[\d\s._-]+/,"").replace(/[_-]+/g," ").trim()||i;return t===t.toUpperCase()&&(t=t.toLowerCase()),t.charAt(0).toUpperCase()+t.slice(1)}function Mf(i){let t=new Map;for(let[r,a]of i.regiao)t.set(a,[...t.get(a)??[],r]);let e={};for(let[r,a]of t){if(r==="talamo"||i.cerebro&&a.every(d=>Ir[d]?.[0]===r))continue;let c=a.map($l),l=c.length>2?`${c.slice(0,2).join(" \xB7 ")} +${c.length-2}`:c.join(" \xB7 ");e[r]=r==="tronco"?{nome:l}:{nome:l,onde:`regi\xE3o ${l}`}}let n=t.get("tronco")??[],s=n.length?`Esconder o halo (${n.length>2?`${n.slice(0,2).join(", ")}\u2026`:n.join(", ")})`:"Esconder o halo";return{regioes:e,rotuloHalo:s}}var wa="cerebro-galactico",bf="orbit",Kh={som:!1,reduzidos:!1,fundo:!0,esconderArquivo:!1,novaAba:!0,notaCaptura:"01_ENTRADA.md",nucleo:"00_PAINEL.md",pastas:{}},Ln=i=>i.replace(/\.md$/i,""),Dr=i=>i instanceof Ye.TFile&&i.extension==="md",Jl=class extends Ye.Plugin{constructor(){super(...arguments);this.config={...Kh}}async onload(){let e=await this.loadData();this.config={...Kh,...e,pastas:{...e?.pastas??{}}},this.registerView(wa,n=>new Kl(n,this)),this.addRibbonIcon(bf,"Abrir C\xE9rebro Gal\xE1ctico",()=>this.abrirVisao()),this.addCommand({id:"abrir",name:"Abrir a gal\xE1xia",callback:()=>this.abrirVisao()}),this.addSettingTab(new Qh(this.app,this)),this.app.workspace.onLayoutReady(()=>this.ouvirCofre())}visao(){let e=this.app.workspace.getLeavesOfType(wa)[0];return e?.view instanceof Kl?e.view:null}async abrirVisao(){let{workspace:e}=this.app,n=e.getLeavesOfType(wa)[0];n||(n=e.getLeaf("tab"),await n.setViewState({type:wa,active:!0})),await e.revealLeaf(n)}async salvarConfig(e){Object.assign(this.config,e),await this.saveData(this.config)}ouvirCofre(){let{workspace:e,vault:n,metadataCache:s}=this.app;this.registerEvent(e.on("file-open",r=>{Dr(r)&&this.visao()?.aoAbrirArquivo(r)})),this.registerEvent(n.on("modify",r=>{Dr(r)&&this.visao()?.aoModificar(r)})),this.registerEvent(n.on("create",r=>{Dr(r)&&this.visao()?.aoCriar(r)})),this.registerEvent(n.on("delete",r=>{Dr(r)&&this.visao()?.aoApagar(r)})),this.registerEvent(n.on("rename",(r,a)=>{Dr(r)&&this.visao()?.aoRenomear(r,a)})),this.registerEvent(s.on("resolve",r=>{Dr(r)&&this.visao()?.aoResolver(r)}))}},Kl=class extends Ye.ItemView{constructor(e,n){super(e);this.plugin=n;this.galaxia=null;this.raiz=null;this.links=new Map;this.pendentes=new Map;this.ultimoClique={caminho:"",quando:0};this.reconstruir=0;this.mapa=null;this.scope=new Ye.Scope(this.app.scope),this.scope.register(["Mod"],"k",()=>{let s=this.contentEl.querySelector("#busca-campo");return s?.focus(),s?.select(),!1})}getViewType(){return wa}getDisplayText(){return"C\xE9rebro Gal\xE1ctico"}getIcon(){return bf}async onOpen(){this.contentEl.addClass("cg-visao"),this.contentEl.tabIndex=-1,this.registerDomEvent(this.contentEl,"pointerdown",n=>{n.target instanceof HTMLInputElement||n.target instanceof HTMLButtonElement||this.contentEl.focus({preventScroll:!0})});let e=()=>this.galaxia?.definirVisivel(this.contentEl.isShown());if(this.registerEvent(this.app.workspace.on("layout-change",e)),this.registerEvent(this.app.workspace.on("active-leaf-change",e)),this.registerEvent(this.app.workspace.on("resize",e)),Object.keys(this.app.metadataCache.resolvedLinks).length===0&&this.app.vault.getMarkdownFiles().length>0){this.registerEvent(this.app.metadataCache.on("resolved",()=>{this.galaxia||this.montar()})),this.contentEl.setText("Lendo o cofre\u2026");return}this.montar()}async onClose(){window.clearTimeout(this.reconstruir),this.pendentes.forEach(e=>window.clearTimeout(e)),this.desmontar()}remontar(){this.montar()}montar(){this.desmontar(),this.contentEl.empty();let e=this.plugin.config,n=this.lerGrafo();if(n.nos.length===0){let a=this.contentEl.createDiv({cls:"cg-vazio"});a.createEl("strong",{text:"A gal\xE1xia nasce com a primeira nota."}),a.createSpan({text:"Crie uma nota no cofre e ela acende aqui."});return}let{regioes:s,rotuloHalo:r}=Mf(this.mapa);this.raiz=this.contentEl.createDiv(),this.galaxia=vf(this.raiz,n,{config:{som:e.som,reduzidos:e.reduzidos,fundo:e.fundo,esconderArquivo:e.esconderArquivo},textoClique:e.novaAba?"Abriu numa aba nova":"Abriu",aoAbrir:a=>this.abrirNota(a),aoMudarConfig:a=>{this.plugin.salvarConfig(a)},alvoTeclado:this.contentEl,regioes:s,rotuloHalo:r,nucleo:Ln(e.nucleo),mostrarTipo:this.mapa.cerebro,nomeCaptura:e.notaCaptura?Ln(e.notaCaptura).split("/").pop():void 0}),this.galaxia?.definirVisivel(this.contentEl.isShown())}desmontar(){this.galaxia?.destruir(),this.galaxia=null,this.raiz?.remove(),this.raiz=null}remontarDepois(){window.clearTimeout(this.reconstruir),this.reconstruir=window.setTimeout(()=>this.montar(),1200)}lerGrafo(){let e=this.app.vault.getMarkdownFiles().sort((c,l)=>c.path<l.path?-1:c.path>l.path?1:0),n=new Map(e.map((c,l)=>[c.path,l]));this.mapa=Zl(e.map(c=>c.path),this.plugin.config.pastas);let s=e.map(c=>Jh(c.path,this.mapa)),r=new Set,a=[];this.links.clear();let o=this.app.metadataCache.resolvedLinks;for(let c in o){let l=n.get(c);if(l===void 0)continue;let d=new Set;for(let m in o[c]){let h=n.get(m);if(h===void 0||h===l)continue;d.add(m);let _=Math.min(l,h),p=Math.max(l,h),S=`${_}:${p}`;r.has(S)||(r.add(S),a.push([_,p]))}this.links.set(c,d)}return{fonte:this.app.vault.getName(),notas:s.length,sinapses:a.length,nos:s,arestas:a}}async abrirNota(e){let n=this.app.vault.getFileByPath(`${e}.md`);if(!n)return;this.ultimoClique={caminho:n.path,quando:Date.now()};let{workspace:s}=this.app;await(this.plugin.config.novaAba?s.getLeaf("tab"):s.getLeavesOfType("markdown")[0]??s.getLeaf("tab")).openFile(n)}aoAbrirArquivo(e){e.path===this.ultimoClique.caminho&&Date.now()-this.ultimoClique.quando<1500||this.galaxia?.abrir(Ln(e.path))}aoModificar(e){this.galaxia&&(this.plugin.config.notaCaptura&&e.path===this.plugin.config.notaCaptura?this.galaxia.captura():this.galaxia.salvar(Ln(e.path)))}aoCriar(e){if(!this.galaxia){this.contentEl.querySelector(".cg-vazio")&&this.remontarDepois();return}this.pendentes.set(e.path,window.setTimeout(()=>this.nascer(e.path),2e3))}aoResolver(e){if(!this.galaxia)return;if(this.pendentes.has(e.path)){this.nascer(e.path);return}let n=this.galaxia;if(n.indice(Ln(e.path))<0)return;let s=Object.keys(this.app.metadataCache.resolvedLinks[e.path]??{}),r=this.links.get(e.path)??new Set;for(let a of s)r.has(a)||a===e.path||!a.endsWith(".md")||n.indice(Ln(a))<0||(n.ligar(Ln(e.path),Ln(a)),r.add(a));this.links.set(e.path,r)}nascer(e){let n=this.pendentes.get(e);if(n===void 0||!this.galaxia)return;window.clearTimeout(n),this.pendentes.delete(e);let s=this.galaxia,r=this.app.metadataCache.resolvedLinks,a=Object.keys(r[e]??{}).filter(l=>l!==e&&s.indice(Ln(l))>=0),o=Object.keys(r).filter(l=>l!==e&&r[l][e]&&s.indice(Ln(l))>=0),c=[...new Set([...a,...o])];if(!this.mapa||e.includes("/")&&!this.mapa.regiao.has(e.split("/")[0])){this.remontarDepois();return}if(s.nova(Jh(e,this.mapa),c.map(Ln))<0){this.remontarDepois();return}this.links.set(e,new Set(a));for(let l of o)(this.links.get(l)??this.links.set(l,new Set).get(l)).add(e)}aoApagar(e){let n=this.pendentes.get(e.path);n!==void 0&&(window.clearTimeout(n),this.pendentes.delete(e.path)),this.links.delete(e.path),this.galaxia?.remover(Ln(e.path))}aoRenomear(e,n){let s=this.links.get(n);s&&(this.links.delete(n),this.links.set(e.path,s));for(let r of this.links.values())r.delete(n)&&r.add(e.path);this.galaxia?.renomear(Ln(n),Ln(e.path),e.basename)}mapaAtual(){return Zl(this.app.vault.getMarkdownFiles().map(e=>e.path),this.plugin.config.pastas)}aplicarConfig(){let e=this.plugin.config;this.galaxia?.definirConfig({som:e.som,reduzidos:e.reduzidos,fundo:e.fundo,esconderArquivo:e.esconderArquivo})}},jh=class extends Ye.AbstractInputSuggest{constructor(e,n,s){super(e,n);this.campo=n;this.escolher=s}getSuggestions(e){let n=e.toLowerCase();return this.app.vault.getMarkdownFiles().filter(s=>s.path.toLowerCase().includes(n)).slice(0,30)}renderSuggestion(e,n){n.setText(e.path)}selectSuggestion(e){this.campo.value=e.path,this.escolher(e),this.close()}},Qh=class extends Ye.PluginSettingTab{constructor(e,n){super(e,n);this.plugin=n;this.remontar=0}remontarGalaxia(){window.clearTimeout(this.remontar),this.remontar=window.setTimeout(()=>this.plugin.visao()?.remontar(),600)}display(){let{containerEl:e}=this;e.empty();let n=(s,r,a)=>new Ye.Setting(e).setName(s).setDesc(r).addToggle(o=>o.setValue(this.plugin.config[a]).onChange(async c=>{await this.plugin.salvarConfig({[a]:c}),a==="novaAba"?this.remontarGalaxia():this.plugin.visao()?.aplicarConfig()}));n("Som de trov\xE3o","Cada raio e cada captura t\xEAm trov\xE3o sintetizado. Desligado por padr\xE3o.","som"),n("Efeitos reduzidos","Menos poeira e menos raios por evento. Ajuda em GPU integrada fraca.","reduzidos"),n("Atividade de fundo","Pulsos suaves entre as estrelas quando nada acontece no cofre.","fundo"),n("Esconder o halo","Tira da gal\xE1xia as pastas que est\xE3o no halo (o arquivo morto).","esconderArquivo"),n("Abrir em aba nova","Clique numa estrela abre a nota numa aba nova. Desligado, reaproveita a \xFAltima aba de nota.","novaAba"),this.notas(),this.regioes()}campoNota(e,n,s){new Ye.Setting(this.containerEl).setName(e).setDesc(n).addSearch(r=>{r.setPlaceholder(Kh[s]).setValue(this.plugin.config[s]);let a=async o=>{await this.plugin.salvarConfig({[s]:o.trim()}),this.remontarGalaxia()};new jh(this.app,r.inputEl,o=>{a(o.path)}),r.onChange(o=>{a(o)})})}notas(){new Ye.Setting(this.containerEl).setName("Notas especiais").setHeading(),this.campoNota("Nota do n\xFAcleo","Fica no centro da gal\xE1xia, maior que as outras, e \xE9 de onde sai a tempestade. Se n\xE3o existir, o n\xFAcleo \xE9 a nota com mais links.","nucleo"),this.campoNota("Nota de captura","Salvar esta nota dispara a tempestade a partir do n\xFAcleo. Vazio desliga.","notaCaptura")}regioes(){let{containerEl:e}=this;new Ye.Setting(e).setName("Regi\xF5es").setHeading().setDesc("Cada pasta de topo do cofre ocupa uma regi\xE3o da gal\xE1xia. No autom\xE1tico, as maiores pastas ficam com os bra\xE7os longos e pastas de arquivo v\xE3o para o halo. Notas soltas na raiz ficam no n\xFAcleo.");let n=this.plugin.visao()?.mapaAtual()??Zl(this.app.vault.getMarkdownFiles().map(r=>r.path),this.plugin.config.pastas);if(n.contagem.size===0){new Ye.Setting(e).setDesc("O cofre ainda n\xE3o tem pastas: todas as notas ficam no n\xFAcleo.");return}let s=Object.keys(Aa);for(let[r,a]of n.contagem){let o=n.auto.get(r);new Ye.Setting(e).setName(r).setDesc(`${a.toLocaleString("pt-BR")} ${a===1?"nota":"notas"}${$l(r)!==r?` \xB7 aparece como \u201C${$l(r)}\u201D`:""}`).addDropdown(c=>{c.addOption("",`Autom\xE1tico: ${Aa[o]}`);for(let l of s)c.addOption(l,Aa[l]);c.setValue(this.plugin.config.pastas[r]??""),c.onChange(async l=>{let d={...this.plugin.config.pastas};l?d[r]=l:delete d[r],await this.plugin.salvarConfig({pastas:d}),this.remontarGalaxia()})})}new Ye.Setting(e).addButton(r=>r.setButtonText("Voltar tudo ao autom\xE1tico").onClick(async()=>{await this.plugin.salvarConfig({pastas:{}}),this.remontarGalaxia(),this.display()}))}};
