(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=t(i);fetch(i.href,s)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const zl="169",vg={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},yg={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},mp=0,Nh=1,gp=2,xg=3,Mg=0,tu=1,nu=2,jn=3,oi=0,sn=1,vn=2,ti=0,ws=1,$a=2,Dh=3,Uh=4,_p=5,Wi=100,vp=101,yp=102,xp=103,Mp=104,Sp=200,bp=201,wp=202,Tp=203,Za=204,Ja=205,Ap=206,Ep=207,Cp=208,Rp=209,Pp=210,Ip=211,Lp=212,Np=213,Dp=214,ja=0,Qa=1,el=2,Cs=3,tl=4,nl=5,il=6,sl=7,Lo=0,Up=1,Op=2,bi=0,iu=1,su=2,ru=3,Hl=4,Fp=5,ou=6,au=7,Oh="attached",Bp="detached",Gl=300,Ti=301,$i=302,fo=303,po=304,Pr=306,Wt=1e3,Pn=1001,xr=1002,Ut=1003,Vl=1004,Sg=1004,ys=1005,bg=1005,Et=1006,mr=1007,wg=1007,Bn=1008,Tg=1008,ai=1009,lu=1010,cu=1011,Mr=1012,Wl=1013,Ai=1014,Mn=1015,ni=1016,ql=1017,Xl=1018,Rs=1020,hu=35902,uu=1021,du=1022,un=1023,fu=1024,pu=1025,Ts=1026,Ps=1027,Yl=1028,No=1029,mu=1030,Kl=1031,Ag=1032,$l=1033,no=33776,io=33777,so=33778,ro=33779,rl=35840,ol=35841,al=35842,ll=35843,cl=36196,hl=37492,ul=37496,dl=37808,fl=37809,pl=37810,ml=37811,gl=37812,_l=37813,vl=37814,yl=37815,xl=37816,Ml=37817,Sl=37818,bl=37819,wl=37820,Tl=37821,oo=36492,Al=36494,El=36495,gu=36283,Cl=36284,Rl=36285,Pl=36286,kp=2200,zp=2201,Hp=2202,Sr=2300,br=2301,qa=2302,xs=2400,Ms=2401,mo=2402,Zl=2500,_u=2501,Gp=0,vu=1,Il=2,Vp=3200,Wp=3201,Eg=3202,Cg=3203,Ji=0,qp=1,yi="",Nt="srgb",qt="srgb-linear",Jl="display-p3",Do="display-p3-linear",go="linear",ut="srgb",_o="rec709",vo="p3",Rg=0,ms=7680,Pg=7681,Ig=7682,Lg=7683,Ng=34055,Dg=34056,Ug=5386,Og=512,Fg=513,Bg=514,kg=515,zg=516,Hg=517,Gg=518,Fh=519,Xp=512,Yp=513,Kp=514,yu=515,$p=516,Zp=517,Jp=518,jp=519,yo=35044,Vg=35048,Wg=35040,qg=35045,Xg=35049,Yg=35041,Kg=35046,$g=35050,Zg=35042,Jg="100",Bh="300 es",ei=2e3,xo=2001;class ci{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const s=i.indexOf(t);s!==-1&&i.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let s=0,o=i.length;s<o;s++)i[s].call(this,e);e.target=null}}}const jt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let dd=1234567;const As=Math.PI/180,wr=180/Math.PI;function Ln(){const r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(jt[r&255]+jt[r>>8&255]+jt[r>>16&255]+jt[r>>24&255]+"-"+jt[e&255]+jt[e>>8&255]+"-"+jt[e>>16&15|64]+jt[e>>24&255]+"-"+jt[t&63|128]+jt[t>>8&255]+"-"+jt[t>>16&255]+jt[t>>24&255]+jt[n&255]+jt[n>>8&255]+jt[n>>16&255]+jt[n>>24&255]).toLowerCase()}function At(r,e,t){return Math.max(e,Math.min(t,r))}function xu(r,e){return(r%e+e)%e}function jg(r,e,t,n,i){return n+(r-e)*(i-n)/(t-e)}function Qg(r,e,t){return r!==e?(t-r)/(e-r):0}function ao(r,e,t){return(1-t)*r+t*e}function e0(r,e,t,n){return ao(r,e,1-Math.exp(-t*n))}function t0(r,e=1){return e-Math.abs(xu(r,e*2)-e)}function n0(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*(3-2*r))}function i0(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*r*(r*(r*6-15)+10))}function s0(r,e){return r+Math.floor(Math.random()*(e-r+1))}function r0(r,e){return r+Math.random()*(e-r)}function o0(r){return r*(.5-Math.random())}function a0(r){r!==void 0&&(dd=r);let e=dd+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function l0(r){return r*As}function c0(r){return r*wr}function h0(r){return(r&r-1)===0&&r!==0}function u0(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function d0(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function f0(r,e,t,n,i){const s=Math.cos,o=Math.sin,a=s(t/2),l=o(t/2),c=s((e+n)/2),h=o((e+n)/2),u=s((e-n)/2),d=o((e-n)/2),f=s((n-e)/2),p=o((n-e)/2);switch(i){case"XYX":r.set(a*h,l*u,l*d,a*c);break;case"YZY":r.set(l*d,a*h,l*u,a*c);break;case"ZXZ":r.set(l*u,l*d,a*h,a*c);break;case"XZX":r.set(a*h,l*p,l*f,a*c);break;case"YXY":r.set(l*f,a*h,l*p,a*c);break;case"ZYZ":r.set(l*p,l*f,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function cn(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function Xe(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}const Ie={DEG2RAD:As,RAD2DEG:wr,generateUUID:Ln,clamp:At,euclideanModulo:xu,mapLinear:jg,inverseLerp:Qg,lerp:ao,damp:e0,pingpong:t0,smoothstep:n0,smootherstep:i0,randInt:s0,randFloat:r0,randFloatSpread:o0,seededRandom:a0,degToRad:l0,radToDeg:c0,isPowerOfTwo:h0,ceilPowerOfTwo:u0,floorPowerOfTwo:d0,setQuaternionFromProperEuler:f0,normalize:Xe,denormalize:cn};class W{constructor(e=0,t=0){W.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(At(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*n-o*i+e.x,this.y=s*i+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class qe{constructor(e,t,n,i,s,o,a,l,c){qe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,o,a,l,c)}set(e,t,n,i,s,o,a,l,c){const h=this.elements;return h[0]=e,h[1]=i,h[2]=a,h[3]=t,h[4]=s,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],p=n[8],_=i[0],m=i[3],g=i[6],y=i[1],v=i[4],x=i[7],R=i[2],A=i[5],T=i[8];return s[0]=o*_+a*y+l*R,s[3]=o*m+a*v+l*A,s[6]=o*g+a*x+l*T,s[1]=c*_+h*y+u*R,s[4]=c*m+h*v+u*A,s[7]=c*g+h*x+u*T,s[2]=d*_+f*y+p*R,s[5]=d*m+f*v+p*A,s[8]=d*g+f*x+p*T,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*s*h+n*a*l+i*s*c-i*o*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=h*o-a*c,d=a*l-h*s,f=c*s-o*l,p=t*u+n*d+i*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/p;return e[0]=u*_,e[1]=(i*c-h*n)*_,e[2]=(a*n-i*o)*_,e[3]=d*_,e[4]=(h*t-i*l)*_,e[5]=(i*s-a*t)*_,e[6]=f*_,e[7]=(n*l-c*t)*_,e[8]=(o*t-n*s)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-i*c,i*l,-i*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Ec.makeScale(e,t)),this}rotate(e){return this.premultiply(Ec.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ec.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Ec=new qe;function Qp(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}const p0={Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array};function ur(r,e){return new p0[r](e)}function Mo(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function em(){const r=Mo("canvas");return r.style.display="block",r}const fd={};function Xa(r){r in fd||(fd[r]=!0,console.warn(r))}function m0(r,e,t){return new Promise(function(n,i){function s(){switch(r.clientWaitSync(e,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:i();break;case r.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}function g0(r){const e=r.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function _0(r){const e=r.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const pd=new qe().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),md=new qe().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),kr={[qt]:{transfer:go,primaries:_o,luminanceCoefficients:[.2126,.7152,.0722],toReference:r=>r,fromReference:r=>r},[Nt]:{transfer:ut,primaries:_o,luminanceCoefficients:[.2126,.7152,.0722],toReference:r=>r.convertSRGBToLinear(),fromReference:r=>r.convertLinearToSRGB()},[Do]:{transfer:go,primaries:vo,luminanceCoefficients:[.2289,.6917,.0793],toReference:r=>r.applyMatrix3(md),fromReference:r=>r.applyMatrix3(pd)},[Jl]:{transfer:ut,primaries:vo,luminanceCoefficients:[.2289,.6917,.0793],toReference:r=>r.convertSRGBToLinear().applyMatrix3(md),fromReference:r=>r.applyMatrix3(pd).convertLinearToSRGB()}},v0=new Set([qt,Do]),Je={enabled:!0,_workingColorSpace:qt,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(r){if(!v0.has(r))throw new Error(`Unsupported working color space, "${r}".`);this._workingColorSpace=r},convert:function(r,e,t){if(this.enabled===!1||e===t||!e||!t)return r;const n=kr[e].toReference,i=kr[t].fromReference;return i(n(r))},fromWorkingColorSpace:function(r,e){return this.convert(r,this._workingColorSpace,e)},toWorkingColorSpace:function(r,e){return this.convert(r,e,this._workingColorSpace)},getPrimaries:function(r){return kr[r].primaries},getTransfer:function(r){return r===yi?go:kr[r].transfer},getLuminanceCoefficients:function(r,e=this._workingColorSpace){return r.fromArray(kr[e].luminanceCoefficients)}};function gr(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function Cc(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let qs;class tm{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{qs===void 0&&(qs=Mo("canvas")),qs.width=e.width,qs.height=e.height;const n=qs.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=qs}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Mo("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),s=i.data;for(let o=0;o<s.length;o++)s[o]=gr(s[o]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(gr(t[n]/255)*255):t[n]=gr(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let y0=0;class Ss{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:y0++}),this.uuid=Ln(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?s.push(Rc(i[o].image)):s.push(Rc(i[o]))}else s=Rc(i);n.url=s}return t||(e.images[this.uuid]=n),n}}function Rc(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?tm.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let x0=0;class St extends ci{constructor(e=St.DEFAULT_IMAGE,t=St.DEFAULT_MAPPING,n=Pn,i=Pn,s=Et,o=Bn,a=un,l=ai,c=St.DEFAULT_ANISOTROPY,h=yi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:x0++}),this.uuid=Ln(),this.name="",this.source=new Ss(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new W(0,0),this.repeat=new W(1,1),this.center=new W(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new qe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Gl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Wt:e.x=e.x-Math.floor(e.x);break;case Pn:e.x=e.x<0?0:1;break;case xr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Wt:e.y=e.y-Math.floor(e.y);break;case Pn:e.y=e.y<0?0:1;break;case xr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}St.DEFAULT_IMAGE=null;St.DEFAULT_MAPPING=Gl;St.DEFAULT_ANISOTROPY=1;class tt{constructor(e=0,t=0,n=0,i=1){tt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*i+o[12]*s,this.y=o[1]*t+o[5]*n+o[9]*i+o[13]*s,this.z=o[2]*t+o[6]*n+o[10]*i+o[14]*s,this.w=o[3]*t+o[7]*n+o[11]*i+o[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,s;const l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],p=l[9],_=l[2],m=l[6],g=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(p-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(p+m)<.1&&Math.abs(c+f+g-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(c+1)/2,x=(f+1)/2,R=(g+1)/2,A=(h+d)/4,T=(u+_)/4,I=(p+m)/4;return v>x&&v>R?v<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(v),i=A/n,s=T/n):x>R?x<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(x),n=A/i,s=I/i):R<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(R),n=T/s,i=I/s),this.set(n,i,s,t),this}let y=Math.sqrt((m-p)*(m-p)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(y)<.001&&(y=1),this.x=(m-p)/y,this.y=(u-_)/y,this.z=(d-h)/y,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class nm extends ci{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new tt(0,0,e,t),this.scissorTest=!1,this.viewport=new tt(0,0,e,t);const i={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Et,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const s=new St(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);s.flipY=!1,s.generateMipmaps=n.generateMipmaps,s.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Ss(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class dn extends nm{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class jl extends St{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Ut,this.minFilter=Ut,this.wrapR=Pn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class M0 extends dn{constructor(e=1,t=1,n=1,i={}){super(e,t,i),this.isWebGLArrayRenderTarget=!0,this.depth=n,this.texture=new jl(null,e,t,n),this.texture.isRenderTargetTexture=!0}}class Mu extends St{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Ut,this.minFilter=Ut,this.wrapR=Pn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class S0 extends dn{constructor(e=1,t=1,n=1,i={}){super(e,t,i),this.isWebGL3DRenderTarget=!0,this.depth=n,this.texture=new Mu(null,e,t,n),this.texture.isRenderTargetTexture=!0}}class ct{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,s,o,a){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3];const d=s[o+0],f=s[o+1],p=s[o+2],_=s[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=d,e[t+1]=f,e[t+2]=p,e[t+3]=_;return}if(u!==_||l!==d||c!==f||h!==p){let m=1-a;const g=l*d+c*f+h*p+u*_,y=g>=0?1:-1,v=1-g*g;if(v>Number.EPSILON){const R=Math.sqrt(v),A=Math.atan2(R,g*y);m=Math.sin(m*A)/R,a=Math.sin(a*A)/R}const x=a*y;if(l=l*m+d*x,c=c*m+f*x,h=h*m+p*x,u=u*m+_*x,m===1-a){const R=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=R,c*=R,h*=R,u*=R}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,s,o){const a=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=s[o],d=s[o+1],f=s[o+2],p=s[o+3];return e[t]=a*p+h*u+l*f-c*d,e[t+1]=l*p+h*d+c*u-a*f,e[t+2]=c*p+h*f+a*d-l*u,e[t+3]=h*p-a*u-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(i/2),u=a(s/2),d=l(n/2),f=l(i/2),p=l(s/2);switch(o){case"XYZ":this._x=d*h*u+c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u-d*f*p;break;case"YXZ":this._x=d*h*u+c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u+d*f*p;break;case"ZXY":this._x=d*h*u-c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u-d*f*p;break;case"ZYX":this._x=d*h*u-c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u+d*f*p;break;case"YZX":this._x=d*h*u+c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u-d*f*p;break;case"XZY":this._x=d*h*u-c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u+d*f*p;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],s=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+a+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(s-c)*f,this._z=(o-i)*f}else if(n>a&&n>u){const f=2*Math.sqrt(1+n-a-u);this._w=(h-l)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(s+c)/f}else if(a>u){const f=2*Math.sqrt(1+a-n-u);this._w=(s-c)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-n-a);this._w=(o-i)/f,this._x=(s+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(At(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,s=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+i*c-s*l,this._y=i*h+o*l+s*a-n*c,this._z=s*h+o*c+n*l-i*a,this._w=o*h-n*a-i*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,s=this._z,o=this._w;let a=o*e._w+n*e._x+i*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=i,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const f=1-t;return this._w=f*o+t*this._w,this._x=f*n+t*this._x,this._y=f*i+t*this._y,this._z=f*s+t*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-t)*h)/c,d=Math.sin(t*h)/c;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=i*u+this._y*d,this._z=s*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class S{constructor(e=0,t=0,n=0){S.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(gd.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(gd.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=e.elements,o=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*o,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*o,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*i-a*n),h=2*(a*t-s*i),u=2*(s*n-o*t);return this.x=t+l*c+o*u-a*h,this.y=n+l*h+a*c-s*u,this.z=i+l*u+s*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,s=e.z,o=t.x,a=t.y,l=t.z;return this.x=i*l-s*a,this.y=s*o-n*l,this.z=n*a-i*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Pc.copy(this).projectOnVector(e),this.sub(Pc)}reflect(e){return this.sub(Pc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(At(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Pc=new S,gd=new ct;class Kt{constructor(e=new S(1/0,1/0,1/0),t=new S(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(zn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(zn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=zn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,zn):zn.fromBufferAttribute(s,o),zn.applyMatrix4(e.matrixWorld),this.expandByPoint(zn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Zo.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Zo.copy(n.boundingBox)),Zo.applyMatrix4(e.matrixWorld),this.union(Zo)}const i=e.children;for(let s=0,o=i.length;s<o;s++)this.expandByObject(i[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,zn),zn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(zr),Jo.subVectors(this.max,zr),Xs.subVectors(e.a,zr),Ys.subVectors(e.b,zr),Ks.subVectors(e.c,zr),Li.subVectors(Ys,Xs),Ni.subVectors(Ks,Ys),ts.subVectors(Xs,Ks);let t=[0,-Li.z,Li.y,0,-Ni.z,Ni.y,0,-ts.z,ts.y,Li.z,0,-Li.x,Ni.z,0,-Ni.x,ts.z,0,-ts.x,-Li.y,Li.x,0,-Ni.y,Ni.x,0,-ts.y,ts.x,0];return!Ic(t,Xs,Ys,Ks,Jo)||(t=[1,0,0,0,1,0,0,0,1],!Ic(t,Xs,Ys,Ks,Jo))?!1:(jo.crossVectors(Li,Ni),t=[jo.x,jo.y,jo.z],Ic(t,Xs,Ys,Ks,Jo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,zn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(zn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(di[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),di[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),di[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),di[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),di[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),di[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),di[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),di[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(di),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const di=[new S,new S,new S,new S,new S,new S,new S,new S],zn=new S,Zo=new Kt,Xs=new S,Ys=new S,Ks=new S,Li=new S,Ni=new S,ts=new S,zr=new S,Jo=new S,jo=new S,ns=new S;function Ic(r,e,t,n,i){for(let s=0,o=r.length-3;s<=o;s+=3){ns.fromArray(r,s);const a=i.x*Math.abs(ns.x)+i.y*Math.abs(ns.y)+i.z*Math.abs(ns.z),l=e.dot(ns),c=t.dot(ns),h=n.dot(ns);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const b0=new Kt,Hr=new S,Lc=new S;class $t{constructor(e=new S,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):b0.setFromPoints(e).getCenter(n);let i=0;for(let s=0,o=e.length;s<o;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Hr.subVectors(e,this.center);const t=Hr.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Hr,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Lc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Hr.copy(e.center).add(Lc)),this.expandByPoint(Hr.copy(e.center).sub(Lc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const fi=new S,Nc=new S,Qo=new S,Di=new S,Dc=new S,ea=new S,Uc=new S;class Ir{constructor(e=new S,t=new S(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,fi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=fi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(fi.copy(this.origin).addScaledVector(this.direction,t),fi.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Nc.copy(e).add(t).multiplyScalar(.5),Qo.copy(t).sub(e).normalize(),Di.copy(this.origin).sub(Nc);const s=e.distanceTo(t)*.5,o=-this.direction.dot(Qo),a=Di.dot(this.direction),l=-Di.dot(Qo),c=Di.lengthSq(),h=Math.abs(1-o*o);let u,d,f,p;if(h>0)if(u=o*l-a,d=o*a-l,p=s*h,u>=0)if(d>=-p)if(d<=p){const _=1/h;u*=_,d*=_,f=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=s,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d=-s,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d<=-p?(u=Math.max(0,-(-o*s+a)),d=u>0?-s:Math.min(Math.max(-s,-l),s),f=-u*u+d*(d+2*l)+c):d<=p?(u=0,d=Math.min(Math.max(-s,-l),s),f=d*(d+2*l)+c):(u=Math.max(0,-(o*s+a)),d=u>0?s:Math.min(Math.max(-s,-l),s),f=-u*u+d*(d+2*l)+c);else d=o>0?-s:s,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(Nc).addScaledVector(Qo,d),f}intersectSphere(e,t){fi.subVectors(e.center,this.origin);const n=fi.dot(this.direction),i=fi.dot(fi)-n*n,s=e.radius*e.radius;if(i>s)return null;const o=Math.sqrt(s-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,s,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,i=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,i=(e.min.x-d.x)*c),h>=0?(s=(e.min.y-d.y)*h,o=(e.max.y-d.y)*h):(s=(e.max.y-d.y)*h,o=(e.min.y-d.y)*h),n>o||s>i||((s>n||isNaN(n))&&(n=s),(o<i||isNaN(i))&&(i=o),u>=0?(a=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(a=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,fi)!==null}intersectTriangle(e,t,n,i,s){Dc.subVectors(t,e),ea.subVectors(n,e),Uc.crossVectors(Dc,ea);let o=this.direction.dot(Uc),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Di.subVectors(this.origin,e);const l=a*this.direction.dot(ea.crossVectors(Di,ea));if(l<0)return null;const c=a*this.direction.dot(Dc.cross(Di));if(c<0||l+c>o)return null;const h=-a*Di.dot(Uc);return h<0?null:this.at(h/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Pe{constructor(e,t,n,i,s,o,a,l,c,h,u,d,f,p,_,m){Pe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,o,a,l,c,h,u,d,f,p,_,m)}set(e,t,n,i,s,o,a,l,c,h,u,d,f,p,_,m){const g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=i,g[1]=s,g[5]=o,g[9]=a,g[13]=l,g[2]=c,g[6]=h,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=_,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Pe().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/$s.setFromMatrixColumn(e,0).length(),s=1/$s.setFromMatrixColumn(e,1).length(),o=1/$s.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,s=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(s),u=Math.sin(s);if(e.order==="XYZ"){const d=o*h,f=o*u,p=a*h,_=a*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+p*c,t[5]=d-_*c,t[9]=-a*l,t[2]=_-d*c,t[6]=p+f*c,t[10]=o*l}else if(e.order==="YXZ"){const d=l*h,f=l*u,p=c*h,_=c*u;t[0]=d+_*a,t[4]=p*a-f,t[8]=o*c,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=f*a-p,t[6]=_+d*a,t[10]=o*l}else if(e.order==="ZXY"){const d=l*h,f=l*u,p=c*h,_=c*u;t[0]=d-_*a,t[4]=-o*u,t[8]=p+f*a,t[1]=f+p*a,t[5]=o*h,t[9]=_-d*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const d=o*h,f=o*u,p=a*h,_=a*u;t[0]=l*h,t[4]=p*c-f,t[8]=d*c+_,t[1]=l*u,t[5]=_*c+d,t[9]=f*c-p,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const d=o*l,f=o*c,p=a*l,_=a*c;t[0]=l*h,t[4]=_-d*u,t[8]=p*u+f,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=f*u+p,t[10]=d-_*u}else if(e.order==="XZY"){const d=o*l,f=o*c,p=a*l,_=a*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+_,t[5]=o*h,t[9]=f*u-p,t[2]=p*u-f,t[6]=a*h,t[10]=_*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(w0,e,T0)}lookAt(e,t,n){const i=this.elements;return An.subVectors(e,t),An.lengthSq()===0&&(An.z=1),An.normalize(),Ui.crossVectors(n,An),Ui.lengthSq()===0&&(Math.abs(n.z)===1?An.x+=1e-4:An.z+=1e-4,An.normalize(),Ui.crossVectors(n,An)),Ui.normalize(),ta.crossVectors(An,Ui),i[0]=Ui.x,i[4]=ta.x,i[8]=An.x,i[1]=Ui.y,i[5]=ta.y,i[9]=An.y,i[2]=Ui.z,i[6]=ta.z,i[10]=An.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],p=n[2],_=n[6],m=n[10],g=n[14],y=n[3],v=n[7],x=n[11],R=n[15],A=i[0],T=i[4],I=i[8],F=i[12],M=i[1],w=i[5],B=i[9],z=i[13],q=i[2],j=i[6],k=i[10],$=i[14],L=i[3],Q=i[7],ne=i[11],le=i[15];return s[0]=o*A+a*M+l*q+c*L,s[4]=o*T+a*w+l*j+c*Q,s[8]=o*I+a*B+l*k+c*ne,s[12]=o*F+a*z+l*$+c*le,s[1]=h*A+u*M+d*q+f*L,s[5]=h*T+u*w+d*j+f*Q,s[9]=h*I+u*B+d*k+f*ne,s[13]=h*F+u*z+d*$+f*le,s[2]=p*A+_*M+m*q+g*L,s[6]=p*T+_*w+m*j+g*Q,s[10]=p*I+_*B+m*k+g*ne,s[14]=p*F+_*z+m*$+g*le,s[3]=y*A+v*M+x*q+R*L,s[7]=y*T+v*w+x*j+R*Q,s[11]=y*I+v*B+x*k+R*ne,s[15]=y*F+v*z+x*$+R*le,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],p=e[3],_=e[7],m=e[11],g=e[15];return p*(+s*l*u-i*c*u-s*a*d+n*c*d+i*a*f-n*l*f)+_*(+t*l*f-t*c*d+s*o*d-i*o*f+i*c*h-s*l*h)+m*(+t*c*u-t*a*f-s*o*u+n*o*f+s*a*h-n*c*h)+g*(-i*a*h-t*l*u+t*a*d+i*o*u-n*o*d+n*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],p=e[12],_=e[13],m=e[14],g=e[15],y=u*m*c-_*d*c+_*l*f-a*m*f-u*l*g+a*d*g,v=p*d*c-h*m*c-p*l*f+o*m*f+h*l*g-o*d*g,x=h*_*c-p*u*c+p*a*f-o*_*f-h*a*g+o*u*g,R=p*u*l-h*_*l-p*a*d+o*_*d+h*a*m-o*u*m,A=t*y+n*v+i*x+s*R;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/A;return e[0]=y*T,e[1]=(_*d*s-u*m*s-_*i*f+n*m*f+u*i*g-n*d*g)*T,e[2]=(a*m*s-_*l*s+_*i*c-n*m*c-a*i*g+n*l*g)*T,e[3]=(u*l*s-a*d*s-u*i*c+n*d*c+a*i*f-n*l*f)*T,e[4]=v*T,e[5]=(h*m*s-p*d*s+p*i*f-t*m*f-h*i*g+t*d*g)*T,e[6]=(p*l*s-o*m*s-p*i*c+t*m*c+o*i*g-t*l*g)*T,e[7]=(o*d*s-h*l*s+h*i*c-t*d*c-o*i*f+t*l*f)*T,e[8]=x*T,e[9]=(p*u*s-h*_*s-p*n*f+t*_*f+h*n*g-t*u*g)*T,e[10]=(o*_*s-p*a*s+p*n*c-t*_*c-o*n*g+t*a*g)*T,e[11]=(h*a*s-o*u*s-h*n*c+t*u*c+o*n*f-t*a*f)*T,e[12]=R*T,e[13]=(h*_*i-p*u*i+p*n*d-t*_*d-h*n*m+t*u*m)*T,e[14]=(p*a*i-o*_*i-p*n*l+t*_*l+o*n*m-t*a*m)*T,e[15]=(o*u*i-h*a*i+h*n*l-t*u*l-o*n*d+t*a*d)*T,this}scale(e){const t=this.elements,n=e.x,i=e.y,s=e.z;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),s=1-n,o=e.x,a=e.y,l=e.z,c=s*o,h=s*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,h*a+n,h*l-i*o,0,c*l-i*a,h*l+i*o,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,o){return this.set(1,n,s,0,e,1,o,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,s=t._x,o=t._y,a=t._z,l=t._w,c=s+s,h=o+o,u=a+a,d=s*c,f=s*h,p=s*u,_=o*h,m=o*u,g=a*u,y=l*c,v=l*h,x=l*u,R=n.x,A=n.y,T=n.z;return i[0]=(1-(_+g))*R,i[1]=(f+x)*R,i[2]=(p-v)*R,i[3]=0,i[4]=(f-x)*A,i[5]=(1-(d+g))*A,i[6]=(m+y)*A,i[7]=0,i[8]=(p+v)*T,i[9]=(m-y)*T,i[10]=(1-(d+_))*T,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let s=$s.set(i[0],i[1],i[2]).length();const o=$s.set(i[4],i[5],i[6]).length(),a=$s.set(i[8],i[9],i[10]).length();this.determinant()<0&&(s=-s),e.x=i[12],e.y=i[13],e.z=i[14],Hn.copy(this);const c=1/s,h=1/o,u=1/a;return Hn.elements[0]*=c,Hn.elements[1]*=c,Hn.elements[2]*=c,Hn.elements[4]*=h,Hn.elements[5]*=h,Hn.elements[6]*=h,Hn.elements[8]*=u,Hn.elements[9]*=u,Hn.elements[10]*=u,t.setFromRotationMatrix(Hn),n.x=s,n.y=o,n.z=a,this}makePerspective(e,t,n,i,s,o,a=ei){const l=this.elements,c=2*s/(t-e),h=2*s/(n-i),u=(t+e)/(t-e),d=(n+i)/(n-i);let f,p;if(a===ei)f=-(o+s)/(o-s),p=-2*o*s/(o-s);else if(a===xo)f=-o/(o-s),p=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=p,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,i,s,o,a=ei){const l=this.elements,c=1/(t-e),h=1/(n-i),u=1/(o-s),d=(t+e)*c,f=(n+i)*h;let p,_;if(a===ei)p=(o+s)*u,_=-2*u;else if(a===xo)p=s*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=_,l[14]=-p,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const $s=new S,Hn=new Pe,w0=new S(0,0,0),T0=new S(1,1,1),Ui=new S,ta=new S,An=new S,_d=new Pe,vd=new ct;class Zt{constructor(e=0,t=0,n=0,i=Zt.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,s=i[0],o=i[4],a=i[8],l=i[1],c=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(At(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-At(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(At(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-At(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(At(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-At(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return _d.makeRotationFromQuaternion(e),this.setFromRotationMatrix(_d,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return vd.setFromEuler(this),this.setFromQuaternion(vd,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Zt.DEFAULT_ORDER="XYZ";class Ql{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let A0=0;const yd=new S,Zs=new ct,pi=new Pe,na=new S,Gr=new S,E0=new S,C0=new ct,xd=new S(1,0,0),Md=new S(0,1,0),Sd=new S(0,0,1),bd={type:"added"},R0={type:"removed"},Js={type:"childadded",child:null},Oc={type:"childremoved",child:null};class Ze extends ci{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:A0++}),this.uuid=Ln(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ze.DEFAULT_UP.clone();const e=new S,t=new Zt,n=new ct,i=new S(1,1,1);function s(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Pe},normalMatrix:{value:new qe}}),this.matrix=new Pe,this.matrixWorld=new Pe,this.matrixAutoUpdate=Ze.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ze.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ql,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Zs.setFromAxisAngle(e,t),this.quaternion.multiply(Zs),this}rotateOnWorldAxis(e,t){return Zs.setFromAxisAngle(e,t),this.quaternion.premultiply(Zs),this}rotateX(e){return this.rotateOnAxis(xd,e)}rotateY(e){return this.rotateOnAxis(Md,e)}rotateZ(e){return this.rotateOnAxis(Sd,e)}translateOnAxis(e,t){return yd.copy(e).applyQuaternion(this.quaternion),this.position.add(yd.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(xd,e)}translateY(e){return this.translateOnAxis(Md,e)}translateZ(e){return this.translateOnAxis(Sd,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(pi.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?na.copy(e):na.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Gr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?pi.lookAt(Gr,na,this.up):pi.lookAt(na,Gr,this.up),this.quaternion.setFromRotationMatrix(pi),i&&(pi.extractRotation(i.matrixWorld),Zs.setFromRotationMatrix(pi),this.quaternion.premultiply(Zs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(bd),Js.child=e,this.dispatchEvent(Js),Js.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(R0),Oc.child=e,this.dispatchEvent(Oc),Oc.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),pi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),pi.multiply(e.parent.matrixWorld)),e.applyMatrix4(pi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(bd),Js.child=e,this.dispatchEvent(Js),Js.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let s=0,o=i.length;s<o;s++)i[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gr,e,E0),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gr,C0,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const i=this.children;for(let s=0,o=i.length;s<o;s++)i[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];s(e.shapes,u)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));i.material=a}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];i.animations.push(s(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),u=o(e.shapes),d=o(e.skeletons),f=o(e.animations),p=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=i,n;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}Ze.DEFAULT_UP=new S(0,1,0);Ze.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ze.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Gn=new S,mi=new S,Fc=new S,gi=new S,js=new S,Qs=new S,wd=new S,Bc=new S,kc=new S,zc=new S,Hc=new tt,Gc=new tt,Vc=new tt;class yn{constructor(e=new S,t=new S,n=new S){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),Gn.subVectors(e,t),i.cross(Gn);const s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(e,t,n,i,s){Gn.subVectors(i,t),mi.subVectors(n,t),Fc.subVectors(e,t);const o=Gn.dot(Gn),a=Gn.dot(mi),l=Gn.dot(Fc),c=mi.dot(mi),h=mi.dot(Fc),u=o*c-a*a;if(u===0)return s.set(0,0,0),null;const d=1/u,f=(c*l-a*h)*d,p=(o*h-a*l)*d;return s.set(1-f-p,p,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,gi)===null?!1:gi.x>=0&&gi.y>=0&&gi.x+gi.y<=1}static getInterpolation(e,t,n,i,s,o,a,l){return this.getBarycoord(e,t,n,i,gi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,gi.x),l.addScaledVector(o,gi.y),l.addScaledVector(a,gi.z),l)}static getInterpolatedAttribute(e,t,n,i,s,o){return Hc.setScalar(0),Gc.setScalar(0),Vc.setScalar(0),Hc.fromBufferAttribute(e,t),Gc.fromBufferAttribute(e,n),Vc.fromBufferAttribute(e,i),o.setScalar(0),o.addScaledVector(Hc,s.x),o.addScaledVector(Gc,s.y),o.addScaledVector(Vc,s.z),o}static isFrontFacing(e,t,n,i){return Gn.subVectors(n,t),mi.subVectors(e,t),Gn.cross(mi).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Gn.subVectors(this.c,this.b),mi.subVectors(this.a,this.b),Gn.cross(mi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return yn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return yn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,s){return yn.getInterpolation(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return yn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return yn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,s=this.c;let o,a;js.subVectors(i,n),Qs.subVectors(s,n),Bc.subVectors(e,n);const l=js.dot(Bc),c=Qs.dot(Bc);if(l<=0&&c<=0)return t.copy(n);kc.subVectors(e,i);const h=js.dot(kc),u=Qs.dot(kc);if(h>=0&&u<=h)return t.copy(i);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(n).addScaledVector(js,o);zc.subVectors(e,s);const f=js.dot(zc),p=Qs.dot(zc);if(p>=0&&f<=p)return t.copy(s);const _=f*c-l*p;if(_<=0&&c>=0&&p<=0)return a=c/(c-p),t.copy(n).addScaledVector(Qs,a);const m=h*p-f*u;if(m<=0&&u-h>=0&&f-p>=0)return wd.subVectors(s,i),a=(u-h)/(u-h+(f-p)),t.copy(i).addScaledVector(wd,a);const g=1/(m+_+d);return o=_*g,a=d*g,t.copy(n).addScaledVector(js,o).addScaledVector(Qs,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const im={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Oi={h:0,s:0,l:0},ia={h:0,s:0,l:0};function Wc(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*6*(2/3-t):r}class oe{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Nt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Je.toWorkingColorSpace(this,t),this}setRGB(e,t,n,i=Je.workingColorSpace){return this.r=e,this.g=t,this.b=n,Je.toWorkingColorSpace(this,i),this}setHSL(e,t,n,i=Je.workingColorSpace){if(e=xu(e,1),t=At(t,0,1),n=At(n,0,1),t===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+t):n+t-n*t,o=2*n-s;this.r=Wc(o,s,e+1/3),this.g=Wc(o,s,e),this.b=Wc(o,s,e-1/3)}return Je.toWorkingColorSpace(this,i),this}setStyle(e,t=Nt){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=i[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Nt){const n=im[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=gr(e.r),this.g=gr(e.g),this.b=gr(e.b),this}copyLinearToSRGB(e){return this.r=Cc(e.r),this.g=Cc(e.g),this.b=Cc(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Nt){return Je.fromWorkingColorSpace(Qt.copy(this),e),Math.round(At(Qt.r*255,0,255))*65536+Math.round(At(Qt.g*255,0,255))*256+Math.round(At(Qt.b*255,0,255))}getHexString(e=Nt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Je.workingColorSpace){Je.fromWorkingColorSpace(Qt.copy(this),t);const n=Qt.r,i=Qt.g,s=Qt.b,o=Math.max(n,i,s),a=Math.min(n,i,s);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(i-s)/u+(i<s?6:0);break;case i:l=(s-n)/u+2;break;case s:l=(n-i)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Je.workingColorSpace){return Je.fromWorkingColorSpace(Qt.copy(this),t),e.r=Qt.r,e.g=Qt.g,e.b=Qt.b,e}getStyle(e=Nt){Je.fromWorkingColorSpace(Qt.copy(this),e);const t=Qt.r,n=Qt.g,i=Qt.b;return e!==Nt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Oi),this.setHSL(Oi.h+e,Oi.s+t,Oi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Oi),e.getHSL(ia);const n=ao(Oi.h,ia.h,t),i=ao(Oi.s,ia.s,t),s=ao(Oi.l,ia.l,t);return this.setHSL(n,i,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*i,this.g=s[1]*t+s[4]*n+s[7]*i,this.b=s[2]*t+s[5]*n+s[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Qt=new oe;oe.NAMES=im;let P0=0;class Bt extends ci{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:P0++}),this.uuid=Ln(),this.name="",this.type="Material",this.blending=ws,this.side=oi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Za,this.blendDst=Ja,this.blendEquation=Wi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new oe(0,0,0),this.blendAlpha=0,this.depthFunc=Cs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Fh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ms,this.stencilZFail=ms,this.stencilZPass=ms,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ws&&(n.blending=this.blending),this.side!==oi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Za&&(n.blendSrc=this.blendSrc),this.blendDst!==Ja&&(n.blendDst=this.blendDst),this.blendEquation!==Wi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Cs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Fh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ms&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ms&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ms&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(t){const s=i(e.textures),o=i(e.images);s.length>0&&(n.textures=s),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Ot extends Bt{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new oe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Zt,this.combine=Lo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const xi=I0();function I0(){const r=new ArrayBuffer(4),e=new Float32Array(r),t=new Uint32Array(r),n=new Uint32Array(512),i=new Uint32Array(512);for(let l=0;l<256;++l){const c=l-127;c<-27?(n[l]=0,n[l|256]=32768,i[l]=24,i[l|256]=24):c<-14?(n[l]=1024>>-c-14,n[l|256]=1024>>-c-14|32768,i[l]=-c-1,i[l|256]=-c-1):c<=15?(n[l]=c+15<<10,n[l|256]=c+15<<10|32768,i[l]=13,i[l|256]=13):c<128?(n[l]=31744,n[l|256]=64512,i[l]=24,i[l|256]=24):(n[l]=31744,n[l|256]=64512,i[l]=13,i[l|256]=13)}const s=new Uint32Array(2048),o=new Uint32Array(64),a=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;!(c&8388608);)c<<=1,h-=8388608;c&=-8388609,h+=947912704,s[l]=c|h}for(let l=1024;l<2048;++l)s[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)o[l]=l<<23;o[31]=1199570944,o[32]=2147483648;for(let l=33;l<63;++l)o[l]=2147483648+(l-32<<23);o[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(a[l]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:i,mantissaTable:s,exponentTable:o,offsetTable:a}}function gn(r){Math.abs(r)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),r=At(r,-65504,65504),xi.floatView[0]=r;const e=xi.uint32View[0],t=e>>23&511;return xi.baseTable[t]+((e&8388607)>>xi.shiftTable[t])}function Qr(r){const e=r>>10;return xi.uint32View[0]=xi.mantissaTable[xi.offsetTable[e]+(r&1023)]+xi.exponentTable[e],xi.floatView[0]}const L0={toHalfFloat:gn,fromHalfFloat:Qr},It=new S,sa=new W;class st{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=yo,this.updateRanges=[],this.gpuType=Mn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)sa.fromBufferAttribute(this,t),sa.applyMatrix3(e),this.setXY(t,sa.x,sa.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)It.fromBufferAttribute(this,t),It.applyMatrix3(e),this.setXYZ(t,It.x,It.y,It.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)It.fromBufferAttribute(this,t),It.applyMatrix4(e),this.setXYZ(t,It.x,It.y,It.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)It.fromBufferAttribute(this,t),It.applyNormalMatrix(e),this.setXYZ(t,It.x,It.y,It.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)It.fromBufferAttribute(this,t),It.transformDirection(e),this.setXYZ(t,It.x,It.y,It.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=cn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Xe(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=cn(t,this.array)),t}setX(e,t){return this.normalized&&(t=Xe(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=cn(t,this.array)),t}setY(e,t){return this.normalized&&(t=Xe(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=cn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Xe(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=cn(t,this.array)),t}setW(e,t){return this.normalized&&(t=Xe(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Xe(t,this.array),n=Xe(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=Xe(t,this.array),n=Xe(n,this.array),i=Xe(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.normalized&&(t=Xe(t,this.array),n=Xe(n,this.array),i=Xe(i,this.array),s=Xe(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==yo&&(e.usage=this.usage),e}}class N0 extends st{constructor(e,t,n){super(new Int8Array(e),t,n)}}class D0 extends st{constructor(e,t,n){super(new Uint8Array(e),t,n)}}class U0 extends st{constructor(e,t,n){super(new Uint8ClampedArray(e),t,n)}}class O0 extends st{constructor(e,t,n){super(new Int16Array(e),t,n)}}class Su extends st{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class F0 extends st{constructor(e,t,n){super(new Int32Array(e),t,n)}}class bu extends st{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class B0 extends st{constructor(e,t,n){super(new Uint16Array(e),t,n),this.isFloat16BufferAttribute=!0}getX(e){let t=Qr(this.array[e*this.itemSize]);return this.normalized&&(t=cn(t,this.array)),t}setX(e,t){return this.normalized&&(t=Xe(t,this.array)),this.array[e*this.itemSize]=gn(t),this}getY(e){let t=Qr(this.array[e*this.itemSize+1]);return this.normalized&&(t=cn(t,this.array)),t}setY(e,t){return this.normalized&&(t=Xe(t,this.array)),this.array[e*this.itemSize+1]=gn(t),this}getZ(e){let t=Qr(this.array[e*this.itemSize+2]);return this.normalized&&(t=cn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Xe(t,this.array)),this.array[e*this.itemSize+2]=gn(t),this}getW(e){let t=Qr(this.array[e*this.itemSize+3]);return this.normalized&&(t=cn(t,this.array)),t}setW(e,t){return this.normalized&&(t=Xe(t,this.array)),this.array[e*this.itemSize+3]=gn(t),this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Xe(t,this.array),n=Xe(n,this.array)),this.array[e+0]=gn(t),this.array[e+1]=gn(n),this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=Xe(t,this.array),n=Xe(n,this.array),i=Xe(i,this.array)),this.array[e+0]=gn(t),this.array[e+1]=gn(n),this.array[e+2]=gn(i),this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.normalized&&(t=Xe(t,this.array),n=Xe(n,this.array),i=Xe(i,this.array),s=Xe(s,this.array)),this.array[e+0]=gn(t),this.array[e+1]=gn(n),this.array[e+2]=gn(i),this.array[e+3]=gn(s),this}}class Ee extends st{constructor(e,t,n){super(new Float32Array(e),t,n)}}let k0=0;const On=new Pe,qc=new Ze,er=new S,En=new Kt,Vr=new Kt,Gt=new S;class Ve extends ci{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:k0++}),this.uuid=Ln(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Qp(e)?bu:Su)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new qe().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return On.makeRotationFromQuaternion(e),this.applyMatrix4(On),this}rotateX(e){return On.makeRotationX(e),this.applyMatrix4(On),this}rotateY(e){return On.makeRotationY(e),this.applyMatrix4(On),this}rotateZ(e){return On.makeRotationZ(e),this.applyMatrix4(On),this}translate(e,t,n){return On.makeTranslation(e,t,n),this.applyMatrix4(On),this}scale(e,t,n){return On.makeScale(e,t,n),this.applyMatrix4(On),this}lookAt(e){return qc.lookAt(e),qc.updateMatrix(),this.applyMatrix4(qc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(er).negate(),this.translate(er.x,er.y,er.z),this}setFromPoints(e){const t=[];for(let n=0,i=e.length;n<i;n++){const s=e[n];t.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new Ee(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Kt);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new S(-1/0,-1/0,-1/0),new S(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const s=t[n];En.setFromBufferAttribute(s),this.morphTargetsRelative?(Gt.addVectors(this.boundingBox.min,En.min),this.boundingBox.expandByPoint(Gt),Gt.addVectors(this.boundingBox.max,En.max),this.boundingBox.expandByPoint(Gt)):(this.boundingBox.expandByPoint(En.min),this.boundingBox.expandByPoint(En.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new $t);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new S,1/0);return}if(e){const n=this.boundingSphere.center;if(En.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const a=t[s];Vr.setFromBufferAttribute(a),this.morphTargetsRelative?(Gt.addVectors(En.min,Vr.min),En.expandByPoint(Gt),Gt.addVectors(En.max,Vr.max),En.expandByPoint(Gt)):(En.expandByPoint(Vr.min),En.expandByPoint(Vr.max))}En.getCenter(n);let i=0;for(let s=0,o=e.count;s<o;s++)Gt.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(Gt));if(t)for(let s=0,o=t.length;s<o;s++){const a=t[s],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Gt.fromBufferAttribute(a,c),l&&(er.fromBufferAttribute(e,c),Gt.add(er)),i=Math.max(i,n.distanceToSquared(Gt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new st(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let I=0;I<n.count;I++)a[I]=new S,l[I]=new S;const c=new S,h=new S,u=new S,d=new W,f=new W,p=new W,_=new S,m=new S;function g(I,F,M){c.fromBufferAttribute(n,I),h.fromBufferAttribute(n,F),u.fromBufferAttribute(n,M),d.fromBufferAttribute(s,I),f.fromBufferAttribute(s,F),p.fromBufferAttribute(s,M),h.sub(c),u.sub(c),f.sub(d),p.sub(d);const w=1/(f.x*p.y-p.x*f.y);isFinite(w)&&(_.copy(h).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(w),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-p.x).multiplyScalar(w),a[I].add(_),a[F].add(_),a[M].add(_),l[I].add(m),l[F].add(m),l[M].add(m))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let I=0,F=y.length;I<F;++I){const M=y[I],w=M.start,B=M.count;for(let z=w,q=w+B;z<q;z+=3)g(e.getX(z+0),e.getX(z+1),e.getX(z+2))}const v=new S,x=new S,R=new S,A=new S;function T(I){R.fromBufferAttribute(i,I),A.copy(R);const F=a[I];v.copy(F),v.sub(R.multiplyScalar(R.dot(F))).normalize(),x.crossVectors(A,F);const w=x.dot(l[I])<0?-1:1;o.setXYZW(I,v.x,v.y,v.z,w)}for(let I=0,F=y.length;I<F;++I){const M=y[I],w=M.start,B=M.count;for(let z=w,q=w+B;z<q;z+=3)T(e.getX(z+0)),T(e.getX(z+1)),T(e.getX(z+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new st(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const i=new S,s=new S,o=new S,a=new S,l=new S,c=new S,h=new S,u=new S;if(e)for(let d=0,f=e.count;d<f;d+=3){const p=e.getX(d+0),_=e.getX(d+1),m=e.getX(d+2);i.fromBufferAttribute(t,p),s.fromBufferAttribute(t,_),o.fromBufferAttribute(t,m),h.subVectors(o,s),u.subVectors(i,s),h.cross(u),a.fromBufferAttribute(n,p),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(p,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)i.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),h.subVectors(o,s),u.subVectors(i,s),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Gt.fromBufferAttribute(e,t),Gt.normalize(),e.setXYZ(t,Gt.x,Gt.y,Gt.z)}toNonIndexed(){function e(a,l){const c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h);let f=0,p=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?f=l[_]*a.data.stride+a.offset:f=l[_]*h;for(let g=0;g<h;g++)d[p++]=c[f++]}return new st(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Ve,n=this.index.array,i=this.attributes;for(const a in i){const l=i[a],c=e(l,n);t.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=e(d,n);l.push(f)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(i[l]=h,s=!0)}s&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const i=e.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(t))}const s=e.morphAttributes;for(const c in s){const h=[],u=s[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,h=o.length;c<h;c++){const u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Td=new Pe,is=new Ir,ra=new $t,Ad=new S,oa=new S,aa=new S,la=new S,Xc=new S,ca=new S,Ed=new S,ha=new S;class ce extends Ze{constructor(e=new Ve,t=new Ot){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){const a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const a=this.morphTargetInfluences;if(s&&a){ca.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=a[l],u=s[l];h!==0&&(Xc.fromBufferAttribute(u,e),o?ca.addScaledVector(Xc,h):ca.addScaledVector(Xc.sub(t),h))}t.add(ca)}return t}raycast(e,t){const n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ra.copy(n.boundingSphere),ra.applyMatrix4(s),is.copy(e.ray).recast(e.near),!(ra.containsPoint(is.origin)===!1&&(is.intersectSphere(ra,Ad)===null||is.origin.distanceToSquared(Ad)>(e.far-e.near)**2))&&(Td.copy(s).invert(),is.copy(e.ray).applyMatrix4(Td),!(n.boundingBox!==null&&is.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,is)))}_computeIntersections(e,t,n){let i;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,d=s.groups,f=s.drawRange;if(a!==null)if(Array.isArray(o))for(let p=0,_=d.length;p<_;p++){const m=d[p],g=o[m.materialIndex],y=Math.max(m.start,f.start),v=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let x=y,R=v;x<R;x+=3){const A=a.getX(x),T=a.getX(x+1),I=a.getX(x+2);i=ua(this,g,e,n,c,h,u,A,T,I),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const p=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let m=p,g=_;m<g;m+=3){const y=a.getX(m),v=a.getX(m+1),x=a.getX(m+2);i=ua(this,o,e,n,c,h,u,y,v,x),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let p=0,_=d.length;p<_;p++){const m=d[p],g=o[m.materialIndex],y=Math.max(m.start,f.start),v=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let x=y,R=v;x<R;x+=3){const A=x,T=x+1,I=x+2;i=ua(this,g,e,n,c,h,u,A,T,I),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const p=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let m=p,g=_;m<g;m+=3){const y=m,v=m+1,x=m+2;i=ua(this,o,e,n,c,h,u,y,v,x),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}}}function z0(r,e,t,n,i,s,o,a){let l;if(e.side===sn?l=n.intersectTriangle(o,s,i,!0,a):l=n.intersectTriangle(i,s,o,e.side===oi,a),l===null)return null;ha.copy(a),ha.applyMatrix4(r.matrixWorld);const c=t.ray.origin.distanceTo(ha);return c<t.near||c>t.far?null:{distance:c,point:ha.clone(),object:r}}function ua(r,e,t,n,i,s,o,a,l,c){r.getVertexPosition(a,oa),r.getVertexPosition(l,aa),r.getVertexPosition(c,la);const h=z0(r,e,t,n,oa,aa,la,Ed);if(h){const u=new S;yn.getBarycoord(Ed,oa,aa,la,u),i&&(h.uv=yn.getInterpolatedAttribute(i,a,l,c,u,new W)),s&&(h.uv1=yn.getInterpolatedAttribute(s,a,l,c,u,new W)),o&&(h.normal=yn.getInterpolatedAttribute(o,a,l,c,u,new S),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a,b:l,c,normal:new S,materialIndex:0};yn.getNormal(oa,aa,la,d.normal),h.face=d,h.barycoord=u}return h}class it extends Ve{constructor(e=1,t=1,n=1,i=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:o};const a=this;i=Math.floor(i),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],h=[],u=[];let d=0,f=0;p("z","y","x",-1,-1,n,t,e,o,s,0),p("z","y","x",1,-1,n,t,-e,o,s,1),p("x","z","y",1,1,e,n,t,i,o,2),p("x","z","y",1,-1,e,n,-t,i,o,3),p("x","y","z",1,-1,e,t,n,i,s,4),p("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(l),this.setAttribute("position",new Ee(c,3)),this.setAttribute("normal",new Ee(h,3)),this.setAttribute("uv",new Ee(u,2));function p(_,m,g,y,v,x,R,A,T,I,F){const M=x/T,w=R/I,B=x/2,z=R/2,q=A/2,j=T+1,k=I+1;let $=0,L=0;const Q=new S;for(let ne=0;ne<k;ne++){const le=ne*w-z;for(let we=0;we<j;we++){const Fe=we*M-B;Q[_]=Fe*y,Q[m]=le*v,Q[g]=q,c.push(Q.x,Q.y,Q.z),Q[_]=0,Q[m]=0,Q[g]=A>0?1:-1,h.push(Q.x,Q.y,Q.z),u.push(we/T),u.push(1-ne/I),$+=1}}for(let ne=0;ne<I;ne++)for(let le=0;le<T;le++){const we=d+le+j*ne,Fe=d+le+j*(ne+1),G=d+(le+1)+j*(ne+1),ie=d+(le+1)+j*ne;l.push(we,Fe,ie),l.push(Fe,G,ie),L+=6}a.addGroup(f,L,F),f+=L,d+=$}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new it(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Tr(r){const e={};for(const t in r){e[t]={};for(const n in r[t]){const i=r[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function an(r){const e={};for(let t=0;t<r.length;t++){const n=Tr(r[t]);for(const i in n)e[i]=n[i]}return e}function H0(r){const e=[];for(let t=0;t<r.length;t++)e.push(r[t].clone());return e}function sm(r){const e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Je.workingColorSpace}const Is={clone:Tr,merge:an};var G0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,V0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ft extends Bt{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=G0,this.fragmentShader=V0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Tr(e.uniforms),this.uniformsGroups=H0(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?t.uniforms[i]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[i]={type:"m4",value:o.toArray()}:t.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class ec extends Ze{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Pe,this.projectionMatrix=new Pe,this.projectionMatrixInverse=new Pe,this.coordinateSystem=ei}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Fi=new S,Cd=new W,Rd=new W;class Dt extends ec{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=wr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(As*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return wr*2*Math.atan(Math.tan(As*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Fi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Fi.x,Fi.y).multiplyScalar(-e/Fi.z),Fi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Fi.x,Fi.y).multiplyScalar(-e/Fi.z)}getViewSize(e,t){return this.getViewBounds(e,Cd,Rd),t.subVectors(Rd,Cd)}setViewOffset(e,t,n,i,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(As*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*i/l,t-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const tr=-90,nr=1;class rm extends Ze{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Dt(tr,nr,e,t);i.layers=this.layers,this.add(i);const s=new Dt(tr,nr,e,t);s.layers=this.layers,this.add(s);const o=new Dt(tr,nr,e,t);o.layers=this.layers,this.add(o);const a=new Dt(tr,nr,e,t);a.layers=this.layers,this.add(a);const l=new Dt(tr,nr,e,t);l.layers=this.layers,this.add(l);const c=new Dt(tr,nr,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,s,o,a,l]=t;for(const c of t)this.remove(c);if(e===ei)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===xo)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,s),e.setRenderTarget(n,1,i),e.render(t,o),e.setRenderTarget(n,2,i),e.render(t,a),e.setRenderTarget(n,3,i),e.render(t,l),e.setRenderTarget(n,4,i),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,i),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}}class Uo extends St{constructor(e,t,n,i,s,o,a,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:Ti,super(e,t,n,i,s,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class om extends dn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new Uo(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Et}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new it(5,5,5),s=new Ft({name:"CubemapFromEquirect",uniforms:Tr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:sn,blending:ti});s.uniforms.tEquirect.value=t;const o=new ce(i,s),a=t.minFilter;return t.minFilter===Bn&&(t.minFilter=Et),new rm(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,i){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,i);e.setRenderTarget(s)}}const Yc=new S,W0=new S,q0=new qe;class Gi{constructor(e=new S(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=Yc.subVectors(n,t).cross(W0.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Yc),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/i;return s<0||s>1?null:t.copy(e.start).addScaledVector(n,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||q0.getNormalMatrix(e),i=this.coplanarPoint(Yc).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ss=new $t,da=new S;class Oo{constructor(e=new Gi,t=new Gi,n=new Gi,i=new Gi,s=new Gi,o=new Gi){this.planes=[e,t,n,i,s,o]}set(e,t,n,i,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(s),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=ei){const n=this.planes,i=e.elements,s=i[0],o=i[1],a=i[2],l=i[3],c=i[4],h=i[5],u=i[6],d=i[7],f=i[8],p=i[9],_=i[10],m=i[11],g=i[12],y=i[13],v=i[14],x=i[15];if(n[0].setComponents(l-s,d-c,m-f,x-g).normalize(),n[1].setComponents(l+s,d+c,m+f,x+g).normalize(),n[2].setComponents(l+o,d+h,m+p,x+y).normalize(),n[3].setComponents(l-o,d-h,m-p,x-y).normalize(),n[4].setComponents(l-a,d-u,m-_,x-v).normalize(),t===ei)n[5].setComponents(l+a,d+u,m+_,x+v).normalize();else if(t===xo)n[5].setComponents(a,u,_,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ss.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ss.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ss)}intersectsSprite(e){return ss.center.set(0,0,0),ss.radius=.7071067811865476,ss.applyMatrix4(e.matrixWorld),this.intersectsSphere(ss)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(da.x=i.normal.x>0?e.max.x:e.min.x,da.y=i.normal.y>0?e.max.y:e.min.y,da.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(da)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function am(){let r=null,e=!1,t=null,n=null;function i(s,o){t(s,o),n=r.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=r.requestAnimationFrame(i),e=!0)},stop:function(){r.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){r=s}}}function X0(r){const e=new WeakMap;function t(a,l){const c=a.array,h=a.usage,u=c.byteLength,d=r.createBuffer();r.bindBuffer(l,d),r.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=r.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=r.HALF_FLOAT:f=r.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=r.SHORT;else if(c instanceof Uint32Array)f=r.UNSIGNED_INT;else if(c instanceof Int32Array)f=r.INT;else if(c instanceof Int8Array)f=r.BYTE;else if(c instanceof Uint8Array)f=r.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){const h=l.array,u=l.updateRanges;if(r.bindBuffer(c,a),u.length===0)r.bufferSubData(c,0,h);else{u.sort((f,p)=>f.start-p.start);let d=0;for(let f=1;f<u.length;f++){const p=u[d],_=u[f];_.start<=p.start+p.count+1?p.count=Math.max(p.count,_.start+_.count-p.start):(++d,u[d]=_)}u.length=d+1;for(let f=0,p=u.length;f<p;f++){const _=u[f];r.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(r.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:i,remove:s,update:o}}class In extends Ve{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const s=e/2,o=t/2,a=Math.floor(n),l=Math.floor(i),c=a+1,h=l+1,u=e/a,d=t/l,f=[],p=[],_=[],m=[];for(let g=0;g<h;g++){const y=g*d-o;for(let v=0;v<c;v++){const x=v*u-s;p.push(x,-y,0),_.push(0,0,1),m.push(v/a),m.push(1-g/l)}}for(let g=0;g<l;g++)for(let y=0;y<a;y++){const v=y+c*g,x=y+c*(g+1),R=y+1+c*(g+1),A=y+1+c*g;f.push(v,x,A),f.push(x,R,A)}this.setIndex(f),this.setAttribute("position",new Ee(p,3)),this.setAttribute("normal",new Ee(_,3)),this.setAttribute("uv",new Ee(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new In(e.width,e.height,e.widthSegments,e.heightSegments)}}var Y0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,K0=`#ifdef USE_ALPHAHASH
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
#endif`,$0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Z0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,J0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,j0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Q0=`#ifdef USE_AOMAP
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
#endif`,e_=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,t_=`#ifdef USE_BATCHING
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
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,n_=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,i_=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,s_=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,r_=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,o_=`#ifdef USE_IRIDESCENCE
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
#endif`,a_=`#ifdef USE_BUMPMAP
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
#endif`,l_=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,c_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,h_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,u_=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,d_=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,f_=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,p_=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,m_=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,g_=`#define PI 3.141592653589793
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
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
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
} // validated`,__=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,v_=`vec3 transformedNormal = objectNormal;
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
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,y_=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,x_=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,M_=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,S_=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,b_="gl_FragColor = linearToOutputTexel( gl_FragColor );",w_=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,T_=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,A_=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,E_=`#ifdef USE_ENVMAP
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
#endif`,C_=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,R_=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,P_=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,I_=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,L_=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,N_=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,D_=`#ifdef USE_GRADIENTMAP
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
}`,U_=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,O_=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,F_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,B_=`uniform bool receiveShadow;
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
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
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
#endif`,k_=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
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
#endif`,z_=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,H_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,G_=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,V_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,W_=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
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
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
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
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
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
#endif`,q_=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
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
		float v = 0.5 / ( gv + gl );
		return saturate(v);
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
	vec3 f0 = material.specularColor;
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
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
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
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
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
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
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
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,X_=`
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
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
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
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
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
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Y_=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
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
#endif`,K_=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,$_=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Z_=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,J_=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,j_=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Q_=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,ev=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,tv=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,nv=`#if defined( USE_POINTS_UV )
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
#endif`,iv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,sv=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,rv=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,ov=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,av=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,lv=`#ifdef USE_MORPHTARGETS
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
#endif`,cv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,hv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
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
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,uv=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,dv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,fv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,pv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,mv=`#ifdef USE_NORMALMAP
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
#endif`,gv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,_v=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,vv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,yv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,xv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Mv=`vec3 packNormalToRGB( const in vec3 normal ) {
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
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Sv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,bv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,wv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Tv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Av=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Ev=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Cv=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
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
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
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
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
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
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Rv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Pv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
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
#endif`,Iv=`float getShadowMask() {
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
	#if NUM_POINT_LIGHT_SHADOWS > 0
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
}`,Lv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Nv=`#ifdef USE_SKINNING
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
#endif`,Dv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Uv=`#ifdef USE_SKINNING
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
#endif`,Ov=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Fv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Bv=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,kv=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,zv=`#ifdef USE_TRANSMISSION
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
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Hv=`#ifdef USE_TRANSMISSION
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
#endif`,Gv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Vv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Wv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,qv=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Xv=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Yv=`uniform sampler2D t2D;
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
}`,Kv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,$v=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Jv=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jv=`#include <common>
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
}`,Qv=`#if DEPTH_PACKING == 3200
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
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,ey=`#define DISTANCE
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
}`,ty=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,ny=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,iy=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sy=`uniform float scale;
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
}`,ry=`uniform vec3 diffuse;
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
}`,oy=`#include <common>
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
}`,ay=`uniform vec3 diffuse;
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
}`,ly=`#define LAMBERT
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
}`,cy=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
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
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
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
}`,hy=`#define MATCAP
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
}`,uy=`#define MATCAP
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
}`,dy=`#define NORMAL
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
}`,fy=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
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
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,py=`#define PHONG
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
}`,my=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
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
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
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
}`,gy=`#define STANDARD
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
}`,_y=`#define STANDARD
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
#include <packing>
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
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
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
}`,vy=`#define TOON
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
}`,yy=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
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
}`,xy=`uniform float size;
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
}`,My=`uniform vec3 diffuse;
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
}`,Sy=`#include <common>
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
}`,by=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
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
}`,wy=`uniform float rotation;
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
}`,Ty=`uniform vec3 diffuse;
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
}`,Ye={alphahash_fragment:Y0,alphahash_pars_fragment:K0,alphamap_fragment:$0,alphamap_pars_fragment:Z0,alphatest_fragment:J0,alphatest_pars_fragment:j0,aomap_fragment:Q0,aomap_pars_fragment:e_,batching_pars_vertex:t_,batching_vertex:n_,begin_vertex:i_,beginnormal_vertex:s_,bsdfs:r_,iridescence_fragment:o_,bumpmap_pars_fragment:a_,clipping_planes_fragment:l_,clipping_planes_pars_fragment:c_,clipping_planes_pars_vertex:h_,clipping_planes_vertex:u_,color_fragment:d_,color_pars_fragment:f_,color_pars_vertex:p_,color_vertex:m_,common:g_,cube_uv_reflection_fragment:__,defaultnormal_vertex:v_,displacementmap_pars_vertex:y_,displacementmap_vertex:x_,emissivemap_fragment:M_,emissivemap_pars_fragment:S_,colorspace_fragment:b_,colorspace_pars_fragment:w_,envmap_fragment:T_,envmap_common_pars_fragment:A_,envmap_pars_fragment:E_,envmap_pars_vertex:C_,envmap_physical_pars_fragment:k_,envmap_vertex:R_,fog_vertex:P_,fog_pars_vertex:I_,fog_fragment:L_,fog_pars_fragment:N_,gradientmap_pars_fragment:D_,lightmap_pars_fragment:U_,lights_lambert_fragment:O_,lights_lambert_pars_fragment:F_,lights_pars_begin:B_,lights_toon_fragment:z_,lights_toon_pars_fragment:H_,lights_phong_fragment:G_,lights_phong_pars_fragment:V_,lights_physical_fragment:W_,lights_physical_pars_fragment:q_,lights_fragment_begin:X_,lights_fragment_maps:Y_,lights_fragment_end:K_,logdepthbuf_fragment:$_,logdepthbuf_pars_fragment:Z_,logdepthbuf_pars_vertex:J_,logdepthbuf_vertex:j_,map_fragment:Q_,map_pars_fragment:ev,map_particle_fragment:tv,map_particle_pars_fragment:nv,metalnessmap_fragment:iv,metalnessmap_pars_fragment:sv,morphinstance_vertex:rv,morphcolor_vertex:ov,morphnormal_vertex:av,morphtarget_pars_vertex:lv,morphtarget_vertex:cv,normal_fragment_begin:hv,normal_fragment_maps:uv,normal_pars_fragment:dv,normal_pars_vertex:fv,normal_vertex:pv,normalmap_pars_fragment:mv,clearcoat_normal_fragment_begin:gv,clearcoat_normal_fragment_maps:_v,clearcoat_pars_fragment:vv,iridescence_pars_fragment:yv,opaque_fragment:xv,packing:Mv,premultiplied_alpha_fragment:Sv,project_vertex:bv,dithering_fragment:wv,dithering_pars_fragment:Tv,roughnessmap_fragment:Av,roughnessmap_pars_fragment:Ev,shadowmap_pars_fragment:Cv,shadowmap_pars_vertex:Rv,shadowmap_vertex:Pv,shadowmask_pars_fragment:Iv,skinbase_vertex:Lv,skinning_pars_vertex:Nv,skinning_vertex:Dv,skinnormal_vertex:Uv,specularmap_fragment:Ov,specularmap_pars_fragment:Fv,tonemapping_fragment:Bv,tonemapping_pars_fragment:kv,transmission_fragment:zv,transmission_pars_fragment:Hv,uv_pars_fragment:Gv,uv_pars_vertex:Vv,uv_vertex:Wv,worldpos_vertex:qv,background_vert:Xv,background_frag:Yv,backgroundCube_vert:Kv,backgroundCube_frag:$v,cube_vert:Zv,cube_frag:Jv,depth_vert:jv,depth_frag:Qv,distanceRGBA_vert:ey,distanceRGBA_frag:ty,equirect_vert:ny,equirect_frag:iy,linedashed_vert:sy,linedashed_frag:ry,meshbasic_vert:oy,meshbasic_frag:ay,meshlambert_vert:ly,meshlambert_frag:cy,meshmatcap_vert:hy,meshmatcap_frag:uy,meshnormal_vert:dy,meshnormal_frag:fy,meshphong_vert:py,meshphong_frag:my,meshphysical_vert:gy,meshphysical_frag:_y,meshtoon_vert:vy,meshtoon_frag:yy,points_vert:xy,points_frag:My,shadow_vert:Sy,shadow_frag:by,sprite_vert:wy,sprite_frag:Ty},_e={common:{diffuse:{value:new oe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new qe}},envmap:{envMap:{value:null},envMapRotation:{value:new qe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new qe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new qe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new qe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new qe},normalScale:{value:new W(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new qe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new qe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new qe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new qe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new oe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new oe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0},uvTransform:{value:new qe}},sprite:{diffuse:{value:new oe(16777215)},opacity:{value:1},center:{value:new W(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}}},Vn={basic:{uniforms:an([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.fog]),vertexShader:Ye.meshbasic_vert,fragmentShader:Ye.meshbasic_frag},lambert:{uniforms:an([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new oe(0)}}]),vertexShader:Ye.meshlambert_vert,fragmentShader:Ye.meshlambert_frag},phong:{uniforms:an([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new oe(0)},specular:{value:new oe(1118481)},shininess:{value:30}}]),vertexShader:Ye.meshphong_vert,fragmentShader:Ye.meshphong_frag},standard:{uniforms:an([_e.common,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.roughnessmap,_e.metalnessmap,_e.fog,_e.lights,{emissive:{value:new oe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag},toon:{uniforms:an([_e.common,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.gradientmap,_e.fog,_e.lights,{emissive:{value:new oe(0)}}]),vertexShader:Ye.meshtoon_vert,fragmentShader:Ye.meshtoon_frag},matcap:{uniforms:an([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,{matcap:{value:null}}]),vertexShader:Ye.meshmatcap_vert,fragmentShader:Ye.meshmatcap_frag},points:{uniforms:an([_e.points,_e.fog]),vertexShader:Ye.points_vert,fragmentShader:Ye.points_frag},dashed:{uniforms:an([_e.common,_e.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ye.linedashed_vert,fragmentShader:Ye.linedashed_frag},depth:{uniforms:an([_e.common,_e.displacementmap]),vertexShader:Ye.depth_vert,fragmentShader:Ye.depth_frag},normal:{uniforms:an([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,{opacity:{value:1}}]),vertexShader:Ye.meshnormal_vert,fragmentShader:Ye.meshnormal_frag},sprite:{uniforms:an([_e.sprite,_e.fog]),vertexShader:Ye.sprite_vert,fragmentShader:Ye.sprite_frag},background:{uniforms:{uvTransform:{value:new qe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ye.background_vert,fragmentShader:Ye.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new qe}},vertexShader:Ye.backgroundCube_vert,fragmentShader:Ye.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ye.cube_vert,fragmentShader:Ye.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ye.equirect_vert,fragmentShader:Ye.equirect_frag},distanceRGBA:{uniforms:an([_e.common,_e.displacementmap,{referencePosition:{value:new S},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ye.distanceRGBA_vert,fragmentShader:Ye.distanceRGBA_frag},shadow:{uniforms:an([_e.lights,_e.fog,{color:{value:new oe(0)},opacity:{value:1}}]),vertexShader:Ye.shadow_vert,fragmentShader:Ye.shadow_frag}};Vn.physical={uniforms:an([Vn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new qe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new qe},clearcoatNormalScale:{value:new W(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new qe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new qe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new qe},sheen:{value:0},sheenColor:{value:new oe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new qe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new qe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new qe},transmissionSamplerSize:{value:new W},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new qe},attenuationDistance:{value:0},attenuationColor:{value:new oe(0)},specularColor:{value:new oe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new qe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new qe},anisotropyVector:{value:new W},anisotropyMap:{value:null},anisotropyMapTransform:{value:new qe}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag};const fa={r:0,b:0,g:0},rs=new Zt,Ay=new Pe;function Ey(r,e,t,n,i,s,o){const a=new oe(0);let l=s===!0?0:1,c,h,u=null,d=0,f=null;function p(y){let v=y.isScene===!0?y.background:null;return v&&v.isTexture&&(v=(y.backgroundBlurriness>0?t:e).get(v)),v}function _(y){let v=!1;const x=p(y);x===null?g(a,l):x&&x.isColor&&(g(x,1),v=!0);const R=r.xr.getEnvironmentBlendMode();R==="additive"?n.buffers.color.setClear(0,0,0,1,o):R==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(r.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function m(y,v){const x=p(v);x&&(x.isCubeTexture||x.mapping===Pr)?(h===void 0&&(h=new ce(new it(1,1,1),new Ft({name:"BackgroundCubeMaterial",uniforms:Tr(Vn.backgroundCube.uniforms),vertexShader:Vn.backgroundCube.vertexShader,fragmentShader:Vn.backgroundCube.fragmentShader,side:sn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(R,A,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),rs.copy(v.backgroundRotation),rs.x*=-1,rs.y*=-1,rs.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(rs.y*=-1,rs.z*=-1),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Ay.makeRotationFromEuler(rs)),h.material.toneMapped=Je.getTransfer(x.colorSpace)!==ut,(u!==x||d!==x.version||f!==r.toneMapping)&&(h.material.needsUpdate=!0,u=x,d=x.version,f=r.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(c===void 0&&(c=new ce(new In(2,2),new Ft({name:"BackgroundMaterial",uniforms:Tr(Vn.background.uniforms),vertexShader:Vn.background.vertexShader,fragmentShader:Vn.background.fragmentShader,side:oi,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=x,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=Je.getTransfer(x.colorSpace)!==ut,x.matrixAutoUpdate===!0&&x.updateMatrix(),c.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||d!==x.version||f!==r.toneMapping)&&(c.material.needsUpdate=!0,u=x,d=x.version,f=r.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function g(y,v){y.getRGB(fa,sm(r)),n.buffers.color.setClear(fa.r,fa.g,fa.b,v,o)}return{getClearColor:function(){return a},setClearColor:function(y,v=1){a.set(y),l=v,g(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,g(a,l)},render:_,addToRenderList:m}}function Cy(r,e){const t=r.getParameter(r.MAX_VERTEX_ATTRIBS),n={},i=d(null);let s=i,o=!1;function a(M,w,B,z,q){let j=!1;const k=u(z,B,w);s!==k&&(s=k,c(s.object)),j=f(M,z,B,q),j&&p(M,z,B,q),q!==null&&e.update(q,r.ELEMENT_ARRAY_BUFFER),(j||o)&&(o=!1,x(M,w,B,z),q!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(q).buffer))}function l(){return r.createVertexArray()}function c(M){return r.bindVertexArray(M)}function h(M){return r.deleteVertexArray(M)}function u(M,w,B){const z=B.wireframe===!0;let q=n[M.id];q===void 0&&(q={},n[M.id]=q);let j=q[w.id];j===void 0&&(j={},q[w.id]=j);let k=j[z];return k===void 0&&(k=d(l()),j[z]=k),k}function d(M){const w=[],B=[],z=[];for(let q=0;q<t;q++)w[q]=0,B[q]=0,z[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:w,enabledAttributes:B,attributeDivisors:z,object:M,attributes:{},index:null}}function f(M,w,B,z){const q=s.attributes,j=w.attributes;let k=0;const $=B.getAttributes();for(const L in $)if($[L].location>=0){const ne=q[L];let le=j[L];if(le===void 0&&(L==="instanceMatrix"&&M.instanceMatrix&&(le=M.instanceMatrix),L==="instanceColor"&&M.instanceColor&&(le=M.instanceColor)),ne===void 0||ne.attribute!==le||le&&ne.data!==le.data)return!0;k++}return s.attributesNum!==k||s.index!==z}function p(M,w,B,z){const q={},j=w.attributes;let k=0;const $=B.getAttributes();for(const L in $)if($[L].location>=0){let ne=j[L];ne===void 0&&(L==="instanceMatrix"&&M.instanceMatrix&&(ne=M.instanceMatrix),L==="instanceColor"&&M.instanceColor&&(ne=M.instanceColor));const le={};le.attribute=ne,ne&&ne.data&&(le.data=ne.data),q[L]=le,k++}s.attributes=q,s.attributesNum=k,s.index=z}function _(){const M=s.newAttributes;for(let w=0,B=M.length;w<B;w++)M[w]=0}function m(M){g(M,0)}function g(M,w){const B=s.newAttributes,z=s.enabledAttributes,q=s.attributeDivisors;B[M]=1,z[M]===0&&(r.enableVertexAttribArray(M),z[M]=1),q[M]!==w&&(r.vertexAttribDivisor(M,w),q[M]=w)}function y(){const M=s.newAttributes,w=s.enabledAttributes;for(let B=0,z=w.length;B<z;B++)w[B]!==M[B]&&(r.disableVertexAttribArray(B),w[B]=0)}function v(M,w,B,z,q,j,k){k===!0?r.vertexAttribIPointer(M,w,B,q,j):r.vertexAttribPointer(M,w,B,z,q,j)}function x(M,w,B,z){_();const q=z.attributes,j=B.getAttributes(),k=w.defaultAttributeValues;for(const $ in j){const L=j[$];if(L.location>=0){let Q=q[$];if(Q===void 0&&($==="instanceMatrix"&&M.instanceMatrix&&(Q=M.instanceMatrix),$==="instanceColor"&&M.instanceColor&&(Q=M.instanceColor)),Q!==void 0){const ne=Q.normalized,le=Q.itemSize,we=e.get(Q);if(we===void 0)continue;const Fe=we.buffer,G=we.type,ie=we.bytesPerElement,pe=G===r.INT||G===r.UNSIGNED_INT||Q.gpuType===Wl;if(Q.isInterleavedBufferAttribute){const ue=Q.data,Oe=ue.stride,Le=Q.offset;if(ue.isInstancedInterleavedBuffer){for(let Ne=0;Ne<L.locationSize;Ne++)g(L.location+Ne,ue.meshPerAttribute);M.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ue.meshPerAttribute*ue.count)}else for(let Ne=0;Ne<L.locationSize;Ne++)m(L.location+Ne);r.bindBuffer(r.ARRAY_BUFFER,Fe);for(let Ne=0;Ne<L.locationSize;Ne++)v(L.location+Ne,le/L.locationSize,G,ne,Oe*ie,(Le+le/L.locationSize*Ne)*ie,pe)}else{if(Q.isInstancedBufferAttribute){for(let ue=0;ue<L.locationSize;ue++)g(L.location+ue,Q.meshPerAttribute);M.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let ue=0;ue<L.locationSize;ue++)m(L.location+ue);r.bindBuffer(r.ARRAY_BUFFER,Fe);for(let ue=0;ue<L.locationSize;ue++)v(L.location+ue,le/L.locationSize,G,ne,le*ie,le/L.locationSize*ue*ie,pe)}}else if(k!==void 0){const ne=k[$];if(ne!==void 0)switch(ne.length){case 2:r.vertexAttrib2fv(L.location,ne);break;case 3:r.vertexAttrib3fv(L.location,ne);break;case 4:r.vertexAttrib4fv(L.location,ne);break;default:r.vertexAttrib1fv(L.location,ne)}}}}y()}function R(){I();for(const M in n){const w=n[M];for(const B in w){const z=w[B];for(const q in z)h(z[q].object),delete z[q];delete w[B]}delete n[M]}}function A(M){if(n[M.id]===void 0)return;const w=n[M.id];for(const B in w){const z=w[B];for(const q in z)h(z[q].object),delete z[q];delete w[B]}delete n[M.id]}function T(M){for(const w in n){const B=n[w];if(B[M.id]===void 0)continue;const z=B[M.id];for(const q in z)h(z[q].object),delete z[q];delete B[M.id]}}function I(){F(),o=!0,s!==i&&(s=i,c(s.object))}function F(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:I,resetDefaultState:F,dispose:R,releaseStatesOfGeometry:A,releaseStatesOfProgram:T,initAttributes:_,enableAttribute:m,disableUnusedAttributes:y}}function Ry(r,e,t){let n;function i(c){n=c}function s(c,h){r.drawArrays(n,c,h),t.update(h,n,1)}function o(c,h,u){u!==0&&(r.drawArraysInstanced(n,c,h,u),t.update(h,n,u))}function a(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let f=0;for(let p=0;p<u;p++)f+=h[p];t.update(f,n,1)}function l(c,h,u,d){if(u===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let p=0;p<c.length;p++)o(c[p],h[p],d[p]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,d,0,u);let p=0;for(let _=0;_<u;_++)p+=h[_];for(let _=0;_<d.length;_++)t.update(p,n,d[_])}}this.setMode=i,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function Py(r,e,t,n){let i;function s(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const T=e.get("EXT_texture_filter_anisotropic");i=r.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(T){return!(T!==un&&n.convert(T)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(T){const I=T===ni&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(T!==ai&&n.convert(T)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==Mn&&!I)}function l(T){if(T==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=t.logarithmicDepthBuffer===!0,d=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control");if(d===!0){const T=e.get("EXT_clip_control");T.clipControlEXT(T.LOWER_LEFT_EXT,T.ZERO_TO_ONE_EXT)}const f=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),p=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=r.getParameter(r.MAX_TEXTURE_SIZE),m=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),g=r.getParameter(r.MAX_VERTEX_ATTRIBS),y=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),v=r.getParameter(r.MAX_VARYING_VECTORS),x=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),R=p>0,A=r.getParameter(r.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:f,maxVertexTextures:p,maxTextureSize:_,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:y,maxVaryings:v,maxFragmentUniforms:x,vertexTextures:R,maxSamples:A}}function Iy(r){const e=this;let t=null,n=0,i=!1,s=!1;const o=new Gi,a=new qe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||i;return i=d,n=u.length,f},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){const p=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,g=r.get(u);if(!i||p===null||p.length===0||s&&!m)s?h(null):c();else{const y=s?0:n,v=y*4;let x=g.clippingState||null;l.value=x,x=h(p,d,v,f);for(let R=0;R!==v;++R)x[R]=t[R];g.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,p){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=l.value,p!==!0||m===null){const g=f+_*4,y=d.matrixWorldInverse;a.getNormalMatrix(y),(m===null||m.length<g)&&(m=new Float32Array(g));for(let v=0,x=f;v!==_;++v,x+=4)o.copy(u[v]).applyMatrix4(y,a),o.normal.toArray(m,x),m[x+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function Ly(r){let e=new WeakMap;function t(o,a){return a===fo?o.mapping=Ti:a===po&&(o.mapping=$i),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===fo||a===po)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new om(l.height);return c.fromEquirectangularTexture(r,o),e.set(o,c),o.addEventListener("dispose",i),t(c.texture,o.mapping)}else return null}}return o}function i(o){const a=o.target;a.removeEventListener("dispose",i);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function s(){e=new WeakMap}return{get:n,dispose:s}}class Lr extends ec{constructor(e=-1,t=1,n=1,i=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let s=n-e,o=n+e,a=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const dr=4,Pd=[.125,.215,.35,.446,.526,.582],vs=20,Kc=new Lr,Id=new oe;let $c=null,Zc=0,Jc=0,jc=!1;const gs=(1+Math.sqrt(5))/2,ir=1/gs,Ld=[new S(-gs,ir,0),new S(gs,ir,0),new S(-ir,0,gs),new S(ir,0,gs),new S(0,gs,-ir),new S(0,gs,ir),new S(-1,1,-1),new S(1,1,-1),new S(-1,1,1),new S(1,1,1)];class Ll{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){$c=this._renderer.getRenderTarget(),Zc=this._renderer.getActiveCubeFace(),Jc=this._renderer.getActiveMipmapLevel(),jc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,i,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ud(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Dd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget($c,Zc,Jc),this._renderer.xr.enabled=jc,e.scissorTest=!1,pa(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ti||e.mapping===$i?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),$c=this._renderer.getRenderTarget(),Zc=this._renderer.getActiveCubeFace(),Jc=this._renderer.getActiveMipmapLevel(),jc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Et,minFilter:Et,generateMipmaps:!1,type:ni,format:un,colorSpace:qt,depthBuffer:!1},i=Nd(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Nd(e,t,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Ny(s)),this._blurMaterial=Dy(s,e,t)}return i}_compileMaterial(e){const t=new ce(this._lodPlanes[0],e);this._renderer.compile(t,Kc)}_sceneToCubeUV(e,t,n,i){const a=new Dt(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(Id),h.toneMapping=bi,h.autoClear=!1;const f=new Ot({name:"PMREM.Background",side:sn,depthWrite:!1,depthTest:!1}),p=new ce(new it,f);let _=!1;const m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,_=!0):(f.color.copy(Id),_=!0);for(let g=0;g<6;g++){const y=g%3;y===0?(a.up.set(0,l[g],0),a.lookAt(c[g],0,0)):y===1?(a.up.set(0,0,l[g]),a.lookAt(0,c[g],0)):(a.up.set(0,l[g],0),a.lookAt(0,0,c[g]));const v=this._cubeSize;pa(i,y*v,g>2?v:0,v,v),h.setRenderTarget(i),_&&h.render(p,a),h.render(e,a)}p.geometry.dispose(),p.material.dispose(),h.toneMapping=d,h.autoClear=u,e.background=m}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===Ti||e.mapping===$i;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ud()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Dd());const s=i?this._cubemapMaterial:this._equirectMaterial,o=new ce(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;const l=this._cubeSize;pa(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,Kc)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodPlanes.length;for(let s=1;s<i;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=Ld[(i-s-1)%Ld.length];this._blur(e,s-1,s,o,a)}t.autoClear=n}_blur(e,t,n,i,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,i,"latitudinal",s),this._halfBlur(o,e,n,n,i,"longitudinal",s)}_halfBlur(e,t,n,i,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new ce(this._lodPlanes[i],c),d=c.uniforms,f=this._sizeLods[n]-1,p=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*vs-1),_=s/p,m=isFinite(s)?1+Math.floor(h*_):vs;m>vs&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${vs}`);const g=[];let y=0;for(let T=0;T<vs;++T){const I=T/_,F=Math.exp(-I*I/2);g.push(F),T===0?y+=F:T<m&&(y+=2*F)}for(let T=0;T<g.length;T++)g[T]=g[T]/y;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=g,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:v}=this;d.dTheta.value=p,d.mipInt.value=v-n;const x=this._sizeLods[i],R=3*x*(i>v-dr?i-v+dr:0),A=4*(this._cubeSize-x);pa(t,R,A,3*x,2*x),l.setRenderTarget(t),l.render(u,Kc)}}function Ny(r){const e=[],t=[],n=[];let i=r;const s=r-dr+1+Pd.length;for(let o=0;o<s;o++){const a=Math.pow(2,i);t.push(a);let l=1/a;o>r-dr?l=Pd[o-r+dr-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,p=6,_=3,m=2,g=1,y=new Float32Array(_*p*f),v=new Float32Array(m*p*f),x=new Float32Array(g*p*f);for(let A=0;A<f;A++){const T=A%3*2/3-1,I=A>2?0:-1,F=[T,I,0,T+2/3,I,0,T+2/3,I+1,0,T,I,0,T+2/3,I+1,0,T,I+1,0];y.set(F,_*p*A),v.set(d,m*p*A);const M=[A,A,A,A,A,A];x.set(M,g*p*A)}const R=new Ve;R.setAttribute("position",new st(y,_)),R.setAttribute("uv",new st(v,m)),R.setAttribute("faceIndex",new st(x,g)),e.push(R),i>dr&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Nd(r,e,t){const n=new dn(r,e,t);return n.texture.mapping=Pr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function pa(r,e,t,n,i){r.viewport.set(e,t,n,i),r.scissor.set(e,t,n,i)}function Dy(r,e,t){const n=new Float32Array(vs),i=new S(0,1,0);return new Ft({name:"SphericalGaussianBlur",defines:{n:vs,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:wu(),fragmentShader:`

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
		`,blending:ti,depthTest:!1,depthWrite:!1})}function Dd(){return new Ft({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:wu(),fragmentShader:`

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
		`,blending:ti,depthTest:!1,depthWrite:!1})}function Ud(){return new Ft({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:wu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ti,depthTest:!1,depthWrite:!1})}function wu(){return`

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
	`}function Uy(r){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===fo||l===po,h=l===Ti||l===$i;if(c||h){let u=e.get(a);const d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return t===null&&(t=new Ll(r)),u=c?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{const f=a.image;return c&&f&&f.height>0||h&&f&&i(f)?(t===null&&(t=new Ll(r)),u=c?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",s),u.texture):null}}}return a}function i(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function Oy(r){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=r.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&Xa("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function Fy(r,e,t,n){const i={},s=new WeakMap;function o(u){const d=u.target;d.index!==null&&e.remove(d.index);for(const p in d.attributes)e.remove(d.attributes[p]);for(const p in d.morphAttributes){const _=d.morphAttributes[p];for(let m=0,g=_.length;m<g;m++)e.remove(_[m])}d.removeEventListener("dispose",o),delete i[d.id];const f=s.get(d);f&&(e.remove(f),s.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(u,d){return i[d.id]===!0||(d.addEventListener("dispose",o),i[d.id]=!0,t.memory.geometries++),d}function l(u){const d=u.attributes;for(const p in d)e.update(d[p],r.ARRAY_BUFFER);const f=u.morphAttributes;for(const p in f){const _=f[p];for(let m=0,g=_.length;m<g;m++)e.update(_[m],r.ARRAY_BUFFER)}}function c(u){const d=[],f=u.index,p=u.attributes.position;let _=0;if(f!==null){const y=f.array;_=f.version;for(let v=0,x=y.length;v<x;v+=3){const R=y[v+0],A=y[v+1],T=y[v+2];d.push(R,A,A,T,T,R)}}else if(p!==void 0){const y=p.array;_=p.version;for(let v=0,x=y.length/3-1;v<x;v+=3){const R=v+0,A=v+1,T=v+2;d.push(R,A,A,T,T,R)}}else return;const m=new(Qp(d)?bu:Su)(d,1);m.version=_;const g=s.get(u);g&&e.remove(g),s.set(u,m)}function h(u){const d=s.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return s.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function By(r,e,t){let n;function i(d){n=d}let s,o;function a(d){s=d.type,o=d.bytesPerElement}function l(d,f){r.drawElements(n,f,s,d*o),t.update(f,n,1)}function c(d,f,p){p!==0&&(r.drawElementsInstanced(n,f,s,d*o,p),t.update(f,n,p))}function h(d,f,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,s,d,0,p);let m=0;for(let g=0;g<p;g++)m+=f[g];t.update(m,n,1)}function u(d,f,p,_){if(p===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<d.length;g++)c(d[g]/o,f[g],_[g]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,s,d,0,_,0,p);let g=0;for(let y=0;y<p;y++)g+=f[y];for(let y=0;y<_.length;y++)t.update(g,n,_[y])}}this.setMode=i,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function ky(r){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,o,a){switch(t.calls++,o){case r.TRIANGLES:t.triangles+=a*(s/3);break;case r.LINES:t.lines+=a*(s/2);break;case r.LINE_STRIP:t.lines+=a*(s-1);break;case r.LINE_LOOP:t.lines+=a*s;break;case r.POINTS:t.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function zy(r,e,t){const n=new WeakMap,i=new tt;function s(o,a,l){const c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(a);if(d===void 0||d.count!==u){let M=function(){I.dispose(),n.delete(a),a.removeEventListener("dispose",M)};var f=M;d!==void 0&&d.texture.dispose();const p=a.morphAttributes.position!==void 0,_=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],y=a.morphAttributes.normal||[],v=a.morphAttributes.color||[];let x=0;p===!0&&(x=1),_===!0&&(x=2),m===!0&&(x=3);let R=a.attributes.position.count*x,A=1;R>e.maxTextureSize&&(A=Math.ceil(R/e.maxTextureSize),R=e.maxTextureSize);const T=new Float32Array(R*A*4*u),I=new jl(T,R,A,u);I.type=Mn,I.needsUpdate=!0;const F=x*4;for(let w=0;w<u;w++){const B=g[w],z=y[w],q=v[w],j=R*A*4*w;for(let k=0;k<B.count;k++){const $=k*F;p===!0&&(i.fromBufferAttribute(B,k),T[j+$+0]=i.x,T[j+$+1]=i.y,T[j+$+2]=i.z,T[j+$+3]=0),_===!0&&(i.fromBufferAttribute(z,k),T[j+$+4]=i.x,T[j+$+5]=i.y,T[j+$+6]=i.z,T[j+$+7]=0),m===!0&&(i.fromBufferAttribute(q,k),T[j+$+8]=i.x,T[j+$+9]=i.y,T[j+$+10]=i.z,T[j+$+11]=q.itemSize===4?i.w:1)}}d={count:u,texture:I,size:new W(R,A)},n.set(a,d),a.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(r,"morphTexture",o.morphTexture,t);else{let p=0;for(let m=0;m<c.length;m++)p+=c[m];const _=a.morphTargetsRelative?1:1-p;l.getUniforms().setValue(r,"morphTargetBaseInfluence",_),l.getUniforms().setValue(r,"morphTargetInfluences",c)}l.getUniforms().setValue(r,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(r,"morphTargetsTextureSize",d.size)}return{update:s}}function Hy(r,e,t,n){let i=new WeakMap;function s(l){const c=n.render.frame,h=l.geometry,u=e.get(l,h);if(i.get(u)!==c&&(e.update(u),i.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),i.get(l)!==c&&(t.update(l.instanceMatrix,r.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,r.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;i.get(d)!==c&&(d.update(),i.set(d,c))}return u}function o(){i=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:o}}class Tu extends St{constructor(e,t,n,i,s,o,a,l,c,h=Ts){if(h!==Ts&&h!==Ps)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Ts&&(n=Ai),n===void 0&&h===Ps&&(n=Rs),super(null,i,s,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Ut,this.minFilter=l!==void 0?l:Ut,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const lm=new St,Od=new Tu(1,1),cm=new jl,hm=new Mu,um=new Uo,Fd=[],Bd=[],kd=new Float32Array(16),zd=new Float32Array(9),Hd=new Float32Array(4);function Nr(r,e,t){const n=r[0];if(n<=0||n>0)return r;const i=e*t;let s=Fd[i];if(s===void 0&&(s=new Float32Array(i),Fd[i]=s),e!==0){n.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,r[o].toArray(s,a)}return s}function kt(r,e){if(r.length!==e.length)return!1;for(let t=0,n=r.length;t<n;t++)if(r[t]!==e[t])return!1;return!0}function zt(r,e){for(let t=0,n=e.length;t<n;t++)r[t]=e[t]}function tc(r,e){let t=Bd[e];t===void 0&&(t=new Int32Array(e),Bd[e]=t);for(let n=0;n!==e;++n)t[n]=r.allocateTextureUnit();return t}function Gy(r,e){const t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function Vy(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(kt(t,e))return;r.uniform2fv(this.addr,e),zt(t,e)}}function Wy(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(kt(t,e))return;r.uniform3fv(this.addr,e),zt(t,e)}}function qy(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(kt(t,e))return;r.uniform4fv(this.addr,e),zt(t,e)}}function Xy(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(kt(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),zt(t,e)}else{if(kt(t,n))return;Hd.set(n),r.uniformMatrix2fv(this.addr,!1,Hd),zt(t,n)}}function Yy(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(kt(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),zt(t,e)}else{if(kt(t,n))return;zd.set(n),r.uniformMatrix3fv(this.addr,!1,zd),zt(t,n)}}function Ky(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(kt(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),zt(t,e)}else{if(kt(t,n))return;kd.set(n),r.uniformMatrix4fv(this.addr,!1,kd),zt(t,n)}}function $y(r,e){const t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function Zy(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(kt(t,e))return;r.uniform2iv(this.addr,e),zt(t,e)}}function Jy(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(kt(t,e))return;r.uniform3iv(this.addr,e),zt(t,e)}}function jy(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(kt(t,e))return;r.uniform4iv(this.addr,e),zt(t,e)}}function Qy(r,e){const t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function ex(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(kt(t,e))return;r.uniform2uiv(this.addr,e),zt(t,e)}}function tx(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(kt(t,e))return;r.uniform3uiv(this.addr,e),zt(t,e)}}function nx(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(kt(t,e))return;r.uniform4uiv(this.addr,e),zt(t,e)}}function ix(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i);let s;this.type===r.SAMPLER_2D_SHADOW?(Od.compareFunction=yu,s=Od):s=lm,t.setTexture2D(e||s,i)}function sx(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||hm,i)}function rx(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||um,i)}function ox(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||cm,i)}function ax(r){switch(r){case 5126:return Gy;case 35664:return Vy;case 35665:return Wy;case 35666:return qy;case 35674:return Xy;case 35675:return Yy;case 35676:return Ky;case 5124:case 35670:return $y;case 35667:case 35671:return Zy;case 35668:case 35672:return Jy;case 35669:case 35673:return jy;case 5125:return Qy;case 36294:return ex;case 36295:return tx;case 36296:return nx;case 35678:case 36198:case 36298:case 36306:case 35682:return ix;case 35679:case 36299:case 36307:return sx;case 35680:case 36300:case 36308:case 36293:return rx;case 36289:case 36303:case 36311:case 36292:return ox}}function lx(r,e){r.uniform1fv(this.addr,e)}function cx(r,e){const t=Nr(e,this.size,2);r.uniform2fv(this.addr,t)}function hx(r,e){const t=Nr(e,this.size,3);r.uniform3fv(this.addr,t)}function ux(r,e){const t=Nr(e,this.size,4);r.uniform4fv(this.addr,t)}function dx(r,e){const t=Nr(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function fx(r,e){const t=Nr(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function px(r,e){const t=Nr(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function mx(r,e){r.uniform1iv(this.addr,e)}function gx(r,e){r.uniform2iv(this.addr,e)}function _x(r,e){r.uniform3iv(this.addr,e)}function vx(r,e){r.uniform4iv(this.addr,e)}function yx(r,e){r.uniform1uiv(this.addr,e)}function xx(r,e){r.uniform2uiv(this.addr,e)}function Mx(r,e){r.uniform3uiv(this.addr,e)}function Sx(r,e){r.uniform4uiv(this.addr,e)}function bx(r,e,t){const n=this.cache,i=e.length,s=tc(t,i);kt(n,s)||(r.uniform1iv(this.addr,s),zt(n,s));for(let o=0;o!==i;++o)t.setTexture2D(e[o]||lm,s[o])}function wx(r,e,t){const n=this.cache,i=e.length,s=tc(t,i);kt(n,s)||(r.uniform1iv(this.addr,s),zt(n,s));for(let o=0;o!==i;++o)t.setTexture3D(e[o]||hm,s[o])}function Tx(r,e,t){const n=this.cache,i=e.length,s=tc(t,i);kt(n,s)||(r.uniform1iv(this.addr,s),zt(n,s));for(let o=0;o!==i;++o)t.setTextureCube(e[o]||um,s[o])}function Ax(r,e,t){const n=this.cache,i=e.length,s=tc(t,i);kt(n,s)||(r.uniform1iv(this.addr,s),zt(n,s));for(let o=0;o!==i;++o)t.setTexture2DArray(e[o]||cm,s[o])}function Ex(r){switch(r){case 5126:return lx;case 35664:return cx;case 35665:return hx;case 35666:return ux;case 35674:return dx;case 35675:return fx;case 35676:return px;case 5124:case 35670:return mx;case 35667:case 35671:return gx;case 35668:case 35672:return _x;case 35669:case 35673:return vx;case 5125:return yx;case 36294:return xx;case 36295:return Mx;case 36296:return Sx;case 35678:case 36198:case 36298:case 36306:case 35682:return bx;case 35679:case 36299:case 36307:return wx;case 35680:case 36300:case 36308:case 36293:return Tx;case 36289:case 36303:case 36311:case 36292:return Ax}}class Cx{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=ax(t.type)}}class Rx{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Ex(t.type)}}class Px{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let s=0,o=i.length;s!==o;++s){const a=i[s];a.setValue(e,t[a.id],n)}}}const Qc=/(\w+)(\])?(\[|\.)?/g;function Gd(r,e){r.seq.push(e),r.map[e.id]=e}function Ix(r,e,t){const n=r.name,i=n.length;for(Qc.lastIndex=0;;){const s=Qc.exec(n),o=Qc.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){Gd(t,c===void 0?new Cx(a,r,e):new Rx(a,r,e));break}else{let u=t.map[a];u===void 0&&(u=new Px(a),Gd(t,u)),t=u}}}class Ya{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const s=e.getActiveUniform(t,i),o=e.getUniformLocation(t,s.name);Ix(s,o,this)}}setValue(e,t,n,i){const s=this.map[t];s!==void 0&&s.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let s=0,o=t.length;s!==o;++s){const a=t[s],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,s=e.length;i!==s;++i){const o=e[i];o.id in t&&n.push(o)}return n}}function Vd(r,e,t){const n=r.createShader(e);return r.shaderSource(n,t),r.compileShader(n),n}const Lx=37297;let Nx=0;function Dx(r,e){const t=r.split(`
`),n=[],i=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=i;o<s;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}function Ux(r){const e=Je.getPrimaries(Je.workingColorSpace),t=Je.getPrimaries(r);let n;switch(e===t?n="":e===vo&&t===_o?n="LinearDisplayP3ToLinearSRGB":e===_o&&t===vo&&(n="LinearSRGBToLinearDisplayP3"),r){case qt:case Do:return[n,"LinearTransferOETF"];case Nt:case Jl:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",r),[n,"LinearTransferOETF"]}}function Wd(r,e,t){const n=r.getShaderParameter(e,r.COMPILE_STATUS),i=r.getShaderInfoLog(e).trim();if(n&&i==="")return"";const s=/ERROR: 0:(\d+)/.exec(i);if(s){const o=parseInt(s[1]);return t.toUpperCase()+`

`+i+`

`+Dx(r.getShaderSource(e),o)}else return i}function Ox(r,e){const t=Ux(e);return`vec4 ${r}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function Fx(r,e){let t;switch(e){case iu:t="Linear";break;case su:t="Reinhard";break;case ru:t="Cineon";break;case Hl:t="ACESFilmic";break;case ou:t="AgX";break;case au:t="Neutral";break;case Fp:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const ma=new S;function Bx(){Je.getLuminanceCoefficients(ma);const r=ma.x.toFixed(4),e=ma.y.toFixed(4),t=ma.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function kx(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(eo).join(`
`)}function zx(r){const e=[];for(const t in r){const n=r[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Hx(r,e){const t={},n=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const s=r.getActiveAttrib(e,i),o=s.name;let a=1;s.type===r.FLOAT_MAT2&&(a=2),s.type===r.FLOAT_MAT3&&(a=3),s.type===r.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:r.getAttribLocation(e,o),locationSize:a}}return t}function eo(r){return r!==""}function qd(r,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Xd(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Gx=/^[ \t]*#include +<([\w\d./]+)>/gm;function kh(r){return r.replace(Gx,Wx)}const Vx=new Map;function Wx(r,e){let t=Ye[e];if(t===void 0){const n=Vx.get(e);if(n!==void 0)t=Ye[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return kh(t)}const qx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Yd(r){return r.replace(qx,Xx)}function Xx(r,e,t,n){let i="";for(let s=parseInt(e);s<parseInt(t);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function Kd(r){let e=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?e+=`
#define HIGH_PRECISION`:r.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Yx(r){let e="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===tu?e="SHADOWMAP_TYPE_PCF":r.shadowMapType===nu?e="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===jn&&(e="SHADOWMAP_TYPE_VSM"),e}function Kx(r){let e="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case Ti:case $i:e="ENVMAP_TYPE_CUBE";break;case Pr:e="ENVMAP_TYPE_CUBE_UV";break}return e}function $x(r){let e="ENVMAP_MODE_REFLECTION";if(r.envMap)switch(r.envMapMode){case $i:e="ENVMAP_MODE_REFRACTION";break}return e}function Zx(r){let e="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case Lo:e="ENVMAP_BLENDING_MULTIPLY";break;case Up:e="ENVMAP_BLENDING_MIX";break;case Op:e="ENVMAP_BLENDING_ADD";break}return e}function Jx(r){const e=r.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function jx(r,e,t,n){const i=r.getContext(),s=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=Yx(t),c=Kx(t),h=$x(t),u=Zx(t),d=Jx(t),f=kx(t),p=zx(s),_=i.createProgram();let m,g,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(eo).join(`
`),m.length>0&&(m+=`
`),g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(eo).join(`
`),g.length>0&&(g+=`
`)):(m=[Kd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(eo).join(`
`),g=[Kd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==bi?"#define TONE_MAPPING":"",t.toneMapping!==bi?Ye.tonemapping_pars_fragment:"",t.toneMapping!==bi?Fx("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ye.colorspace_pars_fragment,Ox("linearToOutputTexel",t.outputColorSpace),Bx(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(eo).join(`
`)),o=kh(o),o=qd(o,t),o=Xd(o,t),a=kh(a),a=qd(a,t),a=Xd(a,t),o=Yd(o),a=Yd(a),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,g=["#define varying in",t.glslVersion===Bh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Bh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const v=y+m+o,x=y+g+a,R=Vd(i,i.VERTEX_SHADER,v),A=Vd(i,i.FRAGMENT_SHADER,x);i.attachShader(_,R),i.attachShader(_,A),t.index0AttributeName!==void 0?i.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function T(w){if(r.debug.checkShaderErrors){const B=i.getProgramInfoLog(_).trim(),z=i.getShaderInfoLog(R).trim(),q=i.getShaderInfoLog(A).trim();let j=!0,k=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(j=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(i,_,R,A);else{const $=Wd(i,R,"vertex"),L=Wd(i,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+w.name+`
Material Type: `+w.type+`

Program Info Log: `+B+`
`+$+`
`+L)}else B!==""?console.warn("THREE.WebGLProgram: Program Info Log:",B):(z===""||q==="")&&(k=!1);k&&(w.diagnostics={runnable:j,programLog:B,vertexShader:{log:z,prefix:m},fragmentShader:{log:q,prefix:g}})}i.deleteShader(R),i.deleteShader(A),I=new Ya(i,_),F=Hx(i,_)}let I;this.getUniforms=function(){return I===void 0&&T(this),I};let F;this.getAttributes=function(){return F===void 0&&T(this),F};let M=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=i.getProgramParameter(_,Lx)),M},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Nx++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=R,this.fragmentShader=A,this}let Qx=0;class eM{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),s=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new tM(e),t.set(e,n)),n}}class tM{constructor(e){this.id=Qx++,this.code=e,this.usedTimes=0}}function nM(r,e,t,n,i,s,o){const a=new Ql,l=new eM,c=new Set,h=[],u=i.logarithmicDepthBuffer,d=i.reverseDepthBuffer,f=i.vertexTextures;let p=i.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(M){return c.add(M),M===0?"uv":`uv${M}`}function g(M,w,B,z,q){const j=z.fog,k=q.geometry,$=M.isMeshStandardMaterial?z.environment:null,L=(M.isMeshStandardMaterial?t:e).get(M.envMap||$),Q=L&&L.mapping===Pr?L.image.height:null,ne=_[M.type];M.precision!==null&&(p=i.getMaxPrecision(M.precision),p!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",p,"instead."));const le=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,we=le!==void 0?le.length:0;let Fe=0;k.morphAttributes.position!==void 0&&(Fe=1),k.morphAttributes.normal!==void 0&&(Fe=2),k.morphAttributes.color!==void 0&&(Fe=3);let G,ie,pe,ue;if(ne){const mn=Vn[ne];G=mn.vertexShader,ie=mn.fragmentShader}else G=M.vertexShader,ie=M.fragmentShader,l.update(M),pe=l.getVertexShaderID(M),ue=l.getFragmentShaderID(M);const Oe=r.getRenderTarget(),Le=q.isInstancedMesh===!0,Ne=q.isBatchedMesh===!0,ze=!!M.map,se=!!M.matcap,P=!!L,me=!!M.aoMap,X=!!M.lightMap,Y=!!M.bumpMap,te=!!M.normalMap,ge=!!M.displacementMap,ae=!!M.emissiveMap,C=!!M.metalnessMap,b=!!M.roughnessMap,U=M.anisotropy>0,Z=M.clearcoat>0,K=M.dispersion>0,ee=M.iridescence>0,ve=M.sheen>0,de=M.transmission>0,ye=U&&!!M.anisotropyMap,je=Z&&!!M.clearcoatMap,he=Z&&!!M.clearcoatNormalMap,Te=Z&&!!M.clearcoatRoughnessMap,He=ee&&!!M.iridescenceMap,Ge=ee&&!!M.iridescenceThicknessMap,Ae=ve&&!!M.sheenColorMap,Qe=ve&&!!M.sheenRoughnessMap,We=!!M.specularMap,pt=!!M.specularColorMap,N=!!M.specularIntensityMap,Se=de&&!!M.transmissionMap,J=de&&!!M.thicknessMap,re=!!M.gradientMap,xe=!!M.alphaMap,be=M.alphaTest>0,nt=!!M.alphaHash,Pt=!!M.extensions;let pn=bi;M.toneMapped&&(Oe===null||Oe.isXRRenderTarget===!0)&&(pn=r.toneMapping);const rt={shaderID:ne,shaderType:M.type,shaderName:M.name,vertexShader:G,fragmentShader:ie,defines:M.defines,customVertexShaderID:pe,customFragmentShaderID:ue,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:p,batching:Ne,batchingColor:Ne&&q._colorsTexture!==null,instancing:Le,instancingColor:Le&&q.instanceColor!==null,instancingMorph:Le&&q.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:Oe===null?r.outputColorSpace:Oe.isXRRenderTarget===!0?Oe.texture.colorSpace:qt,alphaToCoverage:!!M.alphaToCoverage,map:ze,matcap:se,envMap:P,envMapMode:P&&L.mapping,envMapCubeUVHeight:Q,aoMap:me,lightMap:X,bumpMap:Y,normalMap:te,displacementMap:f&&ge,emissiveMap:ae,normalMapObjectSpace:te&&M.normalMapType===qp,normalMapTangentSpace:te&&M.normalMapType===Ji,metalnessMap:C,roughnessMap:b,anisotropy:U,anisotropyMap:ye,clearcoat:Z,clearcoatMap:je,clearcoatNormalMap:he,clearcoatRoughnessMap:Te,dispersion:K,iridescence:ee,iridescenceMap:He,iridescenceThicknessMap:Ge,sheen:ve,sheenColorMap:Ae,sheenRoughnessMap:Qe,specularMap:We,specularColorMap:pt,specularIntensityMap:N,transmission:de,transmissionMap:Se,thicknessMap:J,gradientMap:re,opaque:M.transparent===!1&&M.blending===ws&&M.alphaToCoverage===!1,alphaMap:xe,alphaTest:be,alphaHash:nt,combine:M.combine,mapUv:ze&&m(M.map.channel),aoMapUv:me&&m(M.aoMap.channel),lightMapUv:X&&m(M.lightMap.channel),bumpMapUv:Y&&m(M.bumpMap.channel),normalMapUv:te&&m(M.normalMap.channel),displacementMapUv:ge&&m(M.displacementMap.channel),emissiveMapUv:ae&&m(M.emissiveMap.channel),metalnessMapUv:C&&m(M.metalnessMap.channel),roughnessMapUv:b&&m(M.roughnessMap.channel),anisotropyMapUv:ye&&m(M.anisotropyMap.channel),clearcoatMapUv:je&&m(M.clearcoatMap.channel),clearcoatNormalMapUv:he&&m(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Te&&m(M.clearcoatRoughnessMap.channel),iridescenceMapUv:He&&m(M.iridescenceMap.channel),iridescenceThicknessMapUv:Ge&&m(M.iridescenceThicknessMap.channel),sheenColorMapUv:Ae&&m(M.sheenColorMap.channel),sheenRoughnessMapUv:Qe&&m(M.sheenRoughnessMap.channel),specularMapUv:We&&m(M.specularMap.channel),specularColorMapUv:pt&&m(M.specularColorMap.channel),specularIntensityMapUv:N&&m(M.specularIntensityMap.channel),transmissionMapUv:Se&&m(M.transmissionMap.channel),thicknessMapUv:J&&m(M.thicknessMap.channel),alphaMapUv:xe&&m(M.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(te||U),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:q.isPoints===!0&&!!k.attributes.uv&&(ze||xe),fog:!!j,useFog:M.fog===!0,fogExp2:!!j&&j.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:d,skinning:q.isSkinnedMesh===!0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:we,morphTextureStride:Fe,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:r.shadowMap.enabled&&B.length>0,shadowMapType:r.shadowMap.type,toneMapping:pn,decodeVideoTexture:ze&&M.map.isVideoTexture===!0&&Je.getTransfer(M.map.colorSpace)===ut,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===vn,flipSided:M.side===sn,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Pt&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Pt&&M.extensions.multiDraw===!0||Ne)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return rt.vertexUv1s=c.has(1),rt.vertexUv2s=c.has(2),rt.vertexUv3s=c.has(3),c.clear(),rt}function y(M){const w=[];if(M.shaderID?w.push(M.shaderID):(w.push(M.customVertexShaderID),w.push(M.customFragmentShaderID)),M.defines!==void 0)for(const B in M.defines)w.push(B),w.push(M.defines[B]);return M.isRawShaderMaterial===!1&&(v(w,M),x(w,M),w.push(r.outputColorSpace)),w.push(M.customProgramCacheKey),w.join()}function v(M,w){M.push(w.precision),M.push(w.outputColorSpace),M.push(w.envMapMode),M.push(w.envMapCubeUVHeight),M.push(w.mapUv),M.push(w.alphaMapUv),M.push(w.lightMapUv),M.push(w.aoMapUv),M.push(w.bumpMapUv),M.push(w.normalMapUv),M.push(w.displacementMapUv),M.push(w.emissiveMapUv),M.push(w.metalnessMapUv),M.push(w.roughnessMapUv),M.push(w.anisotropyMapUv),M.push(w.clearcoatMapUv),M.push(w.clearcoatNormalMapUv),M.push(w.clearcoatRoughnessMapUv),M.push(w.iridescenceMapUv),M.push(w.iridescenceThicknessMapUv),M.push(w.sheenColorMapUv),M.push(w.sheenRoughnessMapUv),M.push(w.specularMapUv),M.push(w.specularColorMapUv),M.push(w.specularIntensityMapUv),M.push(w.transmissionMapUv),M.push(w.thicknessMapUv),M.push(w.combine),M.push(w.fogExp2),M.push(w.sizeAttenuation),M.push(w.morphTargetsCount),M.push(w.morphAttributeCount),M.push(w.numDirLights),M.push(w.numPointLights),M.push(w.numSpotLights),M.push(w.numSpotLightMaps),M.push(w.numHemiLights),M.push(w.numRectAreaLights),M.push(w.numDirLightShadows),M.push(w.numPointLightShadows),M.push(w.numSpotLightShadows),M.push(w.numSpotLightShadowsWithMaps),M.push(w.numLightProbes),M.push(w.shadowMapType),M.push(w.toneMapping),M.push(w.numClippingPlanes),M.push(w.numClipIntersection),M.push(w.depthPacking)}function x(M,w){a.disableAll(),w.supportsVertexTextures&&a.enable(0),w.instancing&&a.enable(1),w.instancingColor&&a.enable(2),w.instancingMorph&&a.enable(3),w.matcap&&a.enable(4),w.envMap&&a.enable(5),w.normalMapObjectSpace&&a.enable(6),w.normalMapTangentSpace&&a.enable(7),w.clearcoat&&a.enable(8),w.iridescence&&a.enable(9),w.alphaTest&&a.enable(10),w.vertexColors&&a.enable(11),w.vertexAlphas&&a.enable(12),w.vertexUv1s&&a.enable(13),w.vertexUv2s&&a.enable(14),w.vertexUv3s&&a.enable(15),w.vertexTangents&&a.enable(16),w.anisotropy&&a.enable(17),w.alphaHash&&a.enable(18),w.batching&&a.enable(19),w.dispersion&&a.enable(20),w.batchingColor&&a.enable(21),M.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.reverseDepthBuffer&&a.enable(4),w.skinning&&a.enable(5),w.morphTargets&&a.enable(6),w.morphNormals&&a.enable(7),w.morphColors&&a.enable(8),w.premultipliedAlpha&&a.enable(9),w.shadowMapEnabled&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),w.alphaToCoverage&&a.enable(20),M.push(a.mask)}function R(M){const w=_[M.type];let B;if(w){const z=Vn[w];B=Is.clone(z.uniforms)}else B=M.uniforms;return B}function A(M,w){let B;for(let z=0,q=h.length;z<q;z++){const j=h[z];if(j.cacheKey===w){B=j,++B.usedTimes;break}}return B===void 0&&(B=new jx(r,w,M,s),h.push(B)),B}function T(M){if(--M.usedTimes===0){const w=h.indexOf(M);h[w]=h[h.length-1],h.pop(),M.destroy()}}function I(M){l.remove(M)}function F(){l.dispose()}return{getParameters:g,getProgramCacheKey:y,getUniforms:R,acquireProgram:A,releaseProgram:T,releaseShaderCache:I,programs:h,dispose:F}}function iM(){let r=new WeakMap;function e(o){return r.has(o)}function t(o){let a=r.get(o);return a===void 0&&(a={},r.set(o,a)),a}function n(o){r.delete(o)}function i(o,a,l){r.get(o)[a]=l}function s(){r=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:s}}function sM(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.z!==e.z?r.z-e.z:r.id-e.id}function $d(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function Zd(){const r=[];let e=0;const t=[],n=[],i=[];function s(){e=0,t.length=0,n.length=0,i.length=0}function o(u,d,f,p,_,m){let g=r[e];return g===void 0?(g={id:u.id,object:u,geometry:d,material:f,groupOrder:p,renderOrder:u.renderOrder,z:_,group:m},r[e]=g):(g.id=u.id,g.object=u,g.geometry=d,g.material=f,g.groupOrder=p,g.renderOrder=u.renderOrder,g.z=_,g.group=m),e++,g}function a(u,d,f,p,_,m){const g=o(u,d,f,p,_,m);f.transmission>0?n.push(g):f.transparent===!0?i.push(g):t.push(g)}function l(u,d,f,p,_,m){const g=o(u,d,f,p,_,m);f.transmission>0?n.unshift(g):f.transparent===!0?i.unshift(g):t.unshift(g)}function c(u,d){t.length>1&&t.sort(u||sM),n.length>1&&n.sort(d||$d),i.length>1&&i.sort(d||$d)}function h(){for(let u=e,d=r.length;u<d;u++){const f=r[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:i,init:s,push:a,unshift:l,finish:h,sort:c}}function rM(){let r=new WeakMap;function e(n,i){const s=r.get(n);let o;return s===void 0?(o=new Zd,r.set(n,[o])):i>=s.length?(o=new Zd,s.push(o)):o=s[i],o}function t(){r=new WeakMap}return{get:e,dispose:t}}function oM(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new S,color:new oe};break;case"SpotLight":t={position:new S,direction:new S,color:new oe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new S,color:new oe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new S,skyColor:new oe,groundColor:new oe};break;case"RectAreaLight":t={color:new oe,position:new S,halfWidth:new S,halfHeight:new S};break}return r[e.id]=t,t}}}function aM(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new W};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new W};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new W,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=t,t}}}let lM=0;function cM(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function hM(r){const e=new oM,t=aM(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new S);const i=new S,s=new Pe,o=new Pe;function a(c){let h=0,u=0,d=0;for(let F=0;F<9;F++)n.probe[F].set(0,0,0);let f=0,p=0,_=0,m=0,g=0,y=0,v=0,x=0,R=0,A=0,T=0;c.sort(cM);for(let F=0,M=c.length;F<M;F++){const w=c[F],B=w.color,z=w.intensity,q=w.distance,j=w.shadow&&w.shadow.map?w.shadow.map.texture:null;if(w.isAmbientLight)h+=B.r*z,u+=B.g*z,d+=B.b*z;else if(w.isLightProbe){for(let k=0;k<9;k++)n.probe[k].addScaledVector(w.sh.coefficients[k],z);T++}else if(w.isDirectionalLight){const k=e.get(w);if(k.color.copy(w.color).multiplyScalar(w.intensity),w.castShadow){const $=w.shadow,L=t.get(w);L.shadowIntensity=$.intensity,L.shadowBias=$.bias,L.shadowNormalBias=$.normalBias,L.shadowRadius=$.radius,L.shadowMapSize=$.mapSize,n.directionalShadow[f]=L,n.directionalShadowMap[f]=j,n.directionalShadowMatrix[f]=w.shadow.matrix,y++}n.directional[f]=k,f++}else if(w.isSpotLight){const k=e.get(w);k.position.setFromMatrixPosition(w.matrixWorld),k.color.copy(B).multiplyScalar(z),k.distance=q,k.coneCos=Math.cos(w.angle),k.penumbraCos=Math.cos(w.angle*(1-w.penumbra)),k.decay=w.decay,n.spot[_]=k;const $=w.shadow;if(w.map&&(n.spotLightMap[R]=w.map,R++,$.updateMatrices(w),w.castShadow&&A++),n.spotLightMatrix[_]=$.matrix,w.castShadow){const L=t.get(w);L.shadowIntensity=$.intensity,L.shadowBias=$.bias,L.shadowNormalBias=$.normalBias,L.shadowRadius=$.radius,L.shadowMapSize=$.mapSize,n.spotShadow[_]=L,n.spotShadowMap[_]=j,x++}_++}else if(w.isRectAreaLight){const k=e.get(w);k.color.copy(B).multiplyScalar(z),k.halfWidth.set(w.width*.5,0,0),k.halfHeight.set(0,w.height*.5,0),n.rectArea[m]=k,m++}else if(w.isPointLight){const k=e.get(w);if(k.color.copy(w.color).multiplyScalar(w.intensity),k.distance=w.distance,k.decay=w.decay,w.castShadow){const $=w.shadow,L=t.get(w);L.shadowIntensity=$.intensity,L.shadowBias=$.bias,L.shadowNormalBias=$.normalBias,L.shadowRadius=$.radius,L.shadowMapSize=$.mapSize,L.shadowCameraNear=$.camera.near,L.shadowCameraFar=$.camera.far,n.pointShadow[p]=L,n.pointShadowMap[p]=j,n.pointShadowMatrix[p]=w.shadow.matrix,v++}n.point[p]=k,p++}else if(w.isHemisphereLight){const k=e.get(w);k.skyColor.copy(w.color).multiplyScalar(z),k.groundColor.copy(w.groundColor).multiplyScalar(z),n.hemi[g]=k,g++}}m>0&&(r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=_e.LTC_FLOAT_1,n.rectAreaLTC2=_e.LTC_FLOAT_2):(n.rectAreaLTC1=_e.LTC_HALF_1,n.rectAreaLTC2=_e.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const I=n.hash;(I.directionalLength!==f||I.pointLength!==p||I.spotLength!==_||I.rectAreaLength!==m||I.hemiLength!==g||I.numDirectionalShadows!==y||I.numPointShadows!==v||I.numSpotShadows!==x||I.numSpotMaps!==R||I.numLightProbes!==T)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=m,n.point.length=p,n.hemi.length=g,n.directionalShadow.length=y,n.directionalShadowMap.length=y,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=y,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=x+R-A,n.spotLightMap.length=R,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=T,I.directionalLength=f,I.pointLength=p,I.spotLength=_,I.rectAreaLength=m,I.hemiLength=g,I.numDirectionalShadows=y,I.numPointShadows=v,I.numSpotShadows=x,I.numSpotMaps=R,I.numLightProbes=T,n.version=lM++)}function l(c,h){let u=0,d=0,f=0,p=0,_=0;const m=h.matrixWorldInverse;for(let g=0,y=c.length;g<y;g++){const v=c[g];if(v.isDirectionalLight){const x=n.directional[u];x.direction.setFromMatrixPosition(v.matrixWorld),i.setFromMatrixPosition(v.target.matrixWorld),x.direction.sub(i),x.direction.transformDirection(m),u++}else if(v.isSpotLight){const x=n.spot[f];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(v.matrixWorld),i.setFromMatrixPosition(v.target.matrixWorld),x.direction.sub(i),x.direction.transformDirection(m),f++}else if(v.isRectAreaLight){const x=n.rectArea[p];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(m),o.identity(),s.copy(v.matrixWorld),s.premultiply(m),o.extractRotation(s),x.halfWidth.set(v.width*.5,0,0),x.halfHeight.set(0,v.height*.5,0),x.halfWidth.applyMatrix4(o),x.halfHeight.applyMatrix4(o),p++}else if(v.isPointLight){const x=n.point[d];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(m),d++}else if(v.isHemisphereLight){const x=n.hemi[_];x.direction.setFromMatrixPosition(v.matrixWorld),x.direction.transformDirection(m),_++}}}return{setup:a,setupView:l,state:n}}function Jd(r){const e=new hM(r),t=[],n=[];function i(h){c.camera=h,t.length=0,n.length=0}function s(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function l(h){e.setupView(t,h)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:a,setupLightsView:l,pushLight:s,pushShadow:o}}function uM(r){let e=new WeakMap;function t(i,s=0){const o=e.get(i);let a;return o===void 0?(a=new Jd(r),e.set(i,[a])):s>=o.length?(a=new Jd(r),o.push(a)):a=o[s],a}function n(){e=new WeakMap}return{get:t,dispose:n}}class Au extends Bt{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Vp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Eu extends Bt{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const dM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,fM=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function pM(r,e,t){let n=new Oo;const i=new W,s=new W,o=new tt,a=new Au({depthPacking:Wp}),l=new Eu,c={},h=t.maxTextureSize,u={[oi]:sn,[sn]:oi,[vn]:vn},d=new Ft({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new W},radius:{value:4}},vertexShader:dM,fragmentShader:fM}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const p=new Ve;p.setAttribute("position",new st(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new ce(p,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=tu;let g=this.type;this.render=function(A,T,I){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;const F=r.getRenderTarget(),M=r.getActiveCubeFace(),w=r.getActiveMipmapLevel(),B=r.state;B.setBlending(ti),B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);const z=g!==jn&&this.type===jn,q=g===jn&&this.type!==jn;for(let j=0,k=A.length;j<k;j++){const $=A[j],L=$.shadow;if(L===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(L.autoUpdate===!1&&L.needsUpdate===!1)continue;i.copy(L.mapSize);const Q=L.getFrameExtents();if(i.multiply(Q),s.copy(L.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(s.x=Math.floor(h/Q.x),i.x=s.x*Q.x,L.mapSize.x=s.x),i.y>h&&(s.y=Math.floor(h/Q.y),i.y=s.y*Q.y,L.mapSize.y=s.y)),L.map===null||z===!0||q===!0){const le=this.type!==jn?{minFilter:Ut,magFilter:Ut}:{};L.map!==null&&L.map.dispose(),L.map=new dn(i.x,i.y,le),L.map.texture.name=$.name+".shadowMap",L.camera.updateProjectionMatrix()}r.setRenderTarget(L.map),r.clear();const ne=L.getViewportCount();for(let le=0;le<ne;le++){const we=L.getViewport(le);o.set(s.x*we.x,s.y*we.y,s.x*we.z,s.y*we.w),B.viewport(o),L.updateMatrices($,le),n=L.getFrustum(),x(T,I,L.camera,$,this.type)}L.isPointLightShadow!==!0&&this.type===jn&&y(L,I),L.needsUpdate=!1}g=this.type,m.needsUpdate=!1,r.setRenderTarget(F,M,w)};function y(A,T){const I=e.update(_);d.defines.VSM_SAMPLES!==A.blurSamples&&(d.defines.VSM_SAMPLES=A.blurSamples,f.defines.VSM_SAMPLES=A.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new dn(i.x,i.y)),d.uniforms.shadow_pass.value=A.map.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,r.setRenderTarget(A.mapPass),r.clear(),r.renderBufferDirect(T,null,I,d,_,null),f.uniforms.shadow_pass.value=A.mapPass.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,r.setRenderTarget(A.map),r.clear(),r.renderBufferDirect(T,null,I,f,_,null)}function v(A,T,I,F){let M=null;const w=I.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(w!==void 0)M=w;else if(M=I.isPointLight===!0?l:a,r.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const B=M.uuid,z=T.uuid;let q=c[B];q===void 0&&(q={},c[B]=q);let j=q[z];j===void 0&&(j=M.clone(),q[z]=j,T.addEventListener("dispose",R)),M=j}if(M.visible=T.visible,M.wireframe=T.wireframe,F===jn?M.side=T.shadowSide!==null?T.shadowSide:T.side:M.side=T.shadowSide!==null?T.shadowSide:u[T.side],M.alphaMap=T.alphaMap,M.alphaTest=T.alphaTest,M.map=T.map,M.clipShadows=T.clipShadows,M.clippingPlanes=T.clippingPlanes,M.clipIntersection=T.clipIntersection,M.displacementMap=T.displacementMap,M.displacementScale=T.displacementScale,M.displacementBias=T.displacementBias,M.wireframeLinewidth=T.wireframeLinewidth,M.linewidth=T.linewidth,I.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const B=r.properties.get(M);B.light=I}return M}function x(A,T,I,F,M){if(A.visible===!1)return;if(A.layers.test(T.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&M===jn)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,A.matrixWorld);const z=e.update(A),q=A.material;if(Array.isArray(q)){const j=z.groups;for(let k=0,$=j.length;k<$;k++){const L=j[k],Q=q[L.materialIndex];if(Q&&Q.visible){const ne=v(A,Q,F,M);A.onBeforeShadow(r,A,T,I,z,ne,L),r.renderBufferDirect(I,null,z,ne,A,L),A.onAfterShadow(r,A,T,I,z,ne,L)}}}else if(q.visible){const j=v(A,q,F,M);A.onBeforeShadow(r,A,T,I,z,j,null),r.renderBufferDirect(I,null,z,j,A,null),A.onAfterShadow(r,A,T,I,z,j,null)}}const B=A.children;for(let z=0,q=B.length;z<q;z++)x(B[z],T,I,F,M)}function R(A){A.target.removeEventListener("dispose",R);for(const I in c){const F=c[I],M=A.target.uuid;M in F&&(F[M].dispose(),delete F[M])}}}const mM={[ja]:Qa,[el]:il,[tl]:sl,[Cs]:nl,[Qa]:ja,[il]:el,[sl]:tl,[nl]:Cs};function gM(r){function e(){let N=!1;const Se=new tt;let J=null;const re=new tt(0,0,0,0);return{setMask:function(xe){J!==xe&&!N&&(r.colorMask(xe,xe,xe,xe),J=xe)},setLocked:function(xe){N=xe},setClear:function(xe,be,nt,Pt,pn){pn===!0&&(xe*=Pt,be*=Pt,nt*=Pt),Se.set(xe,be,nt,Pt),re.equals(Se)===!1&&(r.clearColor(xe,be,nt,Pt),re.copy(Se))},reset:function(){N=!1,J=null,re.set(-1,0,0,0)}}}function t(){let N=!1,Se=!1,J=null,re=null,xe=null;return{setReversed:function(be){Se=be},setTest:function(be){be?pe(r.DEPTH_TEST):ue(r.DEPTH_TEST)},setMask:function(be){J!==be&&!N&&(r.depthMask(be),J=be)},setFunc:function(be){if(Se&&(be=mM[be]),re!==be){switch(be){case ja:r.depthFunc(r.NEVER);break;case Qa:r.depthFunc(r.ALWAYS);break;case el:r.depthFunc(r.LESS);break;case Cs:r.depthFunc(r.LEQUAL);break;case tl:r.depthFunc(r.EQUAL);break;case nl:r.depthFunc(r.GEQUAL);break;case il:r.depthFunc(r.GREATER);break;case sl:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}re=be}},setLocked:function(be){N=be},setClear:function(be){xe!==be&&(r.clearDepth(be),xe=be)},reset:function(){N=!1,J=null,re=null,xe=null}}}function n(){let N=!1,Se=null,J=null,re=null,xe=null,be=null,nt=null,Pt=null,pn=null;return{setTest:function(rt){N||(rt?pe(r.STENCIL_TEST):ue(r.STENCIL_TEST))},setMask:function(rt){Se!==rt&&!N&&(r.stencilMask(rt),Se=rt)},setFunc:function(rt,mn,ui){(J!==rt||re!==mn||xe!==ui)&&(r.stencilFunc(rt,mn,ui),J=rt,re=mn,xe=ui)},setOp:function(rt,mn,ui){(be!==rt||nt!==mn||Pt!==ui)&&(r.stencilOp(rt,mn,ui),be=rt,nt=mn,Pt=ui)},setLocked:function(rt){N=rt},setClear:function(rt){pn!==rt&&(r.clearStencil(rt),pn=rt)},reset:function(){N=!1,Se=null,J=null,re=null,xe=null,be=null,nt=null,Pt=null,pn=null}}}const i=new e,s=new t,o=new n,a=new WeakMap,l=new WeakMap;let c={},h={},u=new WeakMap,d=[],f=null,p=!1,_=null,m=null,g=null,y=null,v=null,x=null,R=null,A=new oe(0,0,0),T=0,I=!1,F=null,M=null,w=null,B=null,z=null;const q=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let j=!1,k=0;const $=r.getParameter(r.VERSION);$.indexOf("WebGL")!==-1?(k=parseFloat(/^WebGL (\d)/.exec($)[1]),j=k>=1):$.indexOf("OpenGL ES")!==-1&&(k=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),j=k>=2);let L=null,Q={};const ne=r.getParameter(r.SCISSOR_BOX),le=r.getParameter(r.VIEWPORT),we=new tt().fromArray(ne),Fe=new tt().fromArray(le);function G(N,Se,J,re){const xe=new Uint8Array(4),be=r.createTexture();r.bindTexture(N,be),r.texParameteri(N,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(N,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let nt=0;nt<J;nt++)N===r.TEXTURE_3D||N===r.TEXTURE_2D_ARRAY?r.texImage3D(Se,0,r.RGBA,1,1,re,0,r.RGBA,r.UNSIGNED_BYTE,xe):r.texImage2D(Se+nt,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,xe);return be}const ie={};ie[r.TEXTURE_2D]=G(r.TEXTURE_2D,r.TEXTURE_2D,1),ie[r.TEXTURE_CUBE_MAP]=G(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),ie[r.TEXTURE_2D_ARRAY]=G(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),ie[r.TEXTURE_3D]=G(r.TEXTURE_3D,r.TEXTURE_3D,1,1),i.setClear(0,0,0,1),s.setClear(1),o.setClear(0),pe(r.DEPTH_TEST),s.setFunc(Cs),X(!1),Y(Nh),pe(r.CULL_FACE),P(ti);function pe(N){c[N]!==!0&&(r.enable(N),c[N]=!0)}function ue(N){c[N]!==!1&&(r.disable(N),c[N]=!1)}function Oe(N,Se){return h[N]!==Se?(r.bindFramebuffer(N,Se),h[N]=Se,N===r.DRAW_FRAMEBUFFER&&(h[r.FRAMEBUFFER]=Se),N===r.FRAMEBUFFER&&(h[r.DRAW_FRAMEBUFFER]=Se),!0):!1}function Le(N,Se){let J=d,re=!1;if(N){J=u.get(Se),J===void 0&&(J=[],u.set(Se,J));const xe=N.textures;if(J.length!==xe.length||J[0]!==r.COLOR_ATTACHMENT0){for(let be=0,nt=xe.length;be<nt;be++)J[be]=r.COLOR_ATTACHMENT0+be;J.length=xe.length,re=!0}}else J[0]!==r.BACK&&(J[0]=r.BACK,re=!0);re&&r.drawBuffers(J)}function Ne(N){return f!==N?(r.useProgram(N),f=N,!0):!1}const ze={[Wi]:r.FUNC_ADD,[vp]:r.FUNC_SUBTRACT,[yp]:r.FUNC_REVERSE_SUBTRACT};ze[xp]=r.MIN,ze[Mp]=r.MAX;const se={[Sp]:r.ZERO,[bp]:r.ONE,[wp]:r.SRC_COLOR,[Za]:r.SRC_ALPHA,[Pp]:r.SRC_ALPHA_SATURATE,[Cp]:r.DST_COLOR,[Ap]:r.DST_ALPHA,[Tp]:r.ONE_MINUS_SRC_COLOR,[Ja]:r.ONE_MINUS_SRC_ALPHA,[Rp]:r.ONE_MINUS_DST_COLOR,[Ep]:r.ONE_MINUS_DST_ALPHA,[Ip]:r.CONSTANT_COLOR,[Lp]:r.ONE_MINUS_CONSTANT_COLOR,[Np]:r.CONSTANT_ALPHA,[Dp]:r.ONE_MINUS_CONSTANT_ALPHA};function P(N,Se,J,re,xe,be,nt,Pt,pn,rt){if(N===ti){p===!0&&(ue(r.BLEND),p=!1);return}if(p===!1&&(pe(r.BLEND),p=!0),N!==_p){if(N!==_||rt!==I){if((m!==Wi||v!==Wi)&&(r.blendEquation(r.FUNC_ADD),m=Wi,v=Wi),rt)switch(N){case ws:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case $a:r.blendFunc(r.ONE,r.ONE);break;case Dh:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case Uh:r.blendFuncSeparate(r.ZERO,r.SRC_COLOR,r.ZERO,r.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case ws:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case $a:r.blendFunc(r.SRC_ALPHA,r.ONE);break;case Dh:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case Uh:r.blendFunc(r.ZERO,r.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}g=null,y=null,x=null,R=null,A.set(0,0,0),T=0,_=N,I=rt}return}xe=xe||Se,be=be||J,nt=nt||re,(Se!==m||xe!==v)&&(r.blendEquationSeparate(ze[Se],ze[xe]),m=Se,v=xe),(J!==g||re!==y||be!==x||nt!==R)&&(r.blendFuncSeparate(se[J],se[re],se[be],se[nt]),g=J,y=re,x=be,R=nt),(Pt.equals(A)===!1||pn!==T)&&(r.blendColor(Pt.r,Pt.g,Pt.b,pn),A.copy(Pt),T=pn),_=N,I=!1}function me(N,Se){N.side===vn?ue(r.CULL_FACE):pe(r.CULL_FACE);let J=N.side===sn;Se&&(J=!J),X(J),N.blending===ws&&N.transparent===!1?P(ti):P(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),s.setFunc(N.depthFunc),s.setTest(N.depthTest),s.setMask(N.depthWrite),i.setMask(N.colorWrite);const re=N.stencilWrite;o.setTest(re),re&&(o.setMask(N.stencilWriteMask),o.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),o.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),ge(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?pe(r.SAMPLE_ALPHA_TO_COVERAGE):ue(r.SAMPLE_ALPHA_TO_COVERAGE)}function X(N){F!==N&&(N?r.frontFace(r.CW):r.frontFace(r.CCW),F=N)}function Y(N){N!==mp?(pe(r.CULL_FACE),N!==M&&(N===Nh?r.cullFace(r.BACK):N===gp?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):ue(r.CULL_FACE),M=N}function te(N){N!==w&&(j&&r.lineWidth(N),w=N)}function ge(N,Se,J){N?(pe(r.POLYGON_OFFSET_FILL),(B!==Se||z!==J)&&(r.polygonOffset(Se,J),B=Se,z=J)):ue(r.POLYGON_OFFSET_FILL)}function ae(N){N?pe(r.SCISSOR_TEST):ue(r.SCISSOR_TEST)}function C(N){N===void 0&&(N=r.TEXTURE0+q-1),L!==N&&(r.activeTexture(N),L=N)}function b(N,Se,J){J===void 0&&(L===null?J=r.TEXTURE0+q-1:J=L);let re=Q[J];re===void 0&&(re={type:void 0,texture:void 0},Q[J]=re),(re.type!==N||re.texture!==Se)&&(L!==J&&(r.activeTexture(J),L=J),r.bindTexture(N,Se||ie[N]),re.type=N,re.texture=Se)}function U(){const N=Q[L];N!==void 0&&N.type!==void 0&&(r.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function Z(){try{r.compressedTexImage2D.apply(r,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function K(){try{r.compressedTexImage3D.apply(r,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ee(){try{r.texSubImage2D.apply(r,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ve(){try{r.texSubImage3D.apply(r,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function de(){try{r.compressedTexSubImage2D.apply(r,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ye(){try{r.compressedTexSubImage3D.apply(r,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function je(){try{r.texStorage2D.apply(r,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function he(){try{r.texStorage3D.apply(r,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Te(){try{r.texImage2D.apply(r,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function He(){try{r.texImage3D.apply(r,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ge(N){we.equals(N)===!1&&(r.scissor(N.x,N.y,N.z,N.w),we.copy(N))}function Ae(N){Fe.equals(N)===!1&&(r.viewport(N.x,N.y,N.z,N.w),Fe.copy(N))}function Qe(N,Se){let J=l.get(Se);J===void 0&&(J=new WeakMap,l.set(Se,J));let re=J.get(N);re===void 0&&(re=r.getUniformBlockIndex(Se,N.name),J.set(N,re))}function We(N,Se){const re=l.get(Se).get(N);a.get(Se)!==re&&(r.uniformBlockBinding(Se,re,N.__bindingPointIndex),a.set(Se,re))}function pt(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),c={},L=null,Q={},h={},u=new WeakMap,d=[],f=null,p=!1,_=null,m=null,g=null,y=null,v=null,x=null,R=null,A=new oe(0,0,0),T=0,I=!1,F=null,M=null,w=null,B=null,z=null,we.set(0,0,r.canvas.width,r.canvas.height),Fe.set(0,0,r.canvas.width,r.canvas.height),i.reset(),s.reset(),o.reset()}return{buffers:{color:i,depth:s,stencil:o},enable:pe,disable:ue,bindFramebuffer:Oe,drawBuffers:Le,useProgram:Ne,setBlending:P,setMaterial:me,setFlipSided:X,setCullFace:Y,setLineWidth:te,setPolygonOffset:ge,setScissorTest:ae,activeTexture:C,bindTexture:b,unbindTexture:U,compressedTexImage2D:Z,compressedTexImage3D:K,texImage2D:Te,texImage3D:He,updateUBOMapping:Qe,uniformBlockBinding:We,texStorage2D:je,texStorage3D:he,texSubImage2D:ee,texSubImage3D:ve,compressedTexSubImage2D:de,compressedTexSubImage3D:ye,scissor:Ge,viewport:Ae,reset:pt}}function _M(r,e){const t=r.image&&r.image.width?r.image.width/r.image.height:1;return t>e?(r.repeat.x=1,r.repeat.y=t/e,r.offset.x=0,r.offset.y=(1-r.repeat.y)/2):(r.repeat.x=e/t,r.repeat.y=1,r.offset.x=(1-r.repeat.x)/2,r.offset.y=0),r}function vM(r,e){const t=r.image&&r.image.width?r.image.width/r.image.height:1;return t>e?(r.repeat.x=e/t,r.repeat.y=1,r.offset.x=(1-r.repeat.x)/2,r.offset.y=0):(r.repeat.x=1,r.repeat.y=t/e,r.offset.x=0,r.offset.y=(1-r.repeat.y)/2),r}function yM(r){return r.repeat.x=1,r.repeat.y=1,r.offset.x=0,r.offset.y=0,r}function zh(r,e,t,n){const i=xM(n);switch(t){case uu:return r*e;case fu:return r*e;case pu:return r*e*2;case Yl:return r*e/i.components*i.byteLength;case No:return r*e/i.components*i.byteLength;case mu:return r*e*2/i.components*i.byteLength;case Kl:return r*e*2/i.components*i.byteLength;case du:return r*e*3/i.components*i.byteLength;case un:return r*e*4/i.components*i.byteLength;case $l:return r*e*4/i.components*i.byteLength;case no:case io:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case so:case ro:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case ol:case ll:return Math.max(r,16)*Math.max(e,8)/4;case rl:case al:return Math.max(r,8)*Math.max(e,8)/2;case cl:case hl:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case ul:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case dl:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case fl:return Math.floor((r+4)/5)*Math.floor((e+3)/4)*16;case pl:return Math.floor((r+4)/5)*Math.floor((e+4)/5)*16;case ml:return Math.floor((r+5)/6)*Math.floor((e+4)/5)*16;case gl:return Math.floor((r+5)/6)*Math.floor((e+5)/6)*16;case _l:return Math.floor((r+7)/8)*Math.floor((e+4)/5)*16;case vl:return Math.floor((r+7)/8)*Math.floor((e+5)/6)*16;case yl:return Math.floor((r+7)/8)*Math.floor((e+7)/8)*16;case xl:return Math.floor((r+9)/10)*Math.floor((e+4)/5)*16;case Ml:return Math.floor((r+9)/10)*Math.floor((e+5)/6)*16;case Sl:return Math.floor((r+9)/10)*Math.floor((e+7)/8)*16;case bl:return Math.floor((r+9)/10)*Math.floor((e+9)/10)*16;case wl:return Math.floor((r+11)/12)*Math.floor((e+9)/10)*16;case Tl:return Math.floor((r+11)/12)*Math.floor((e+11)/12)*16;case oo:case Al:case El:return Math.ceil(r/4)*Math.ceil(e/4)*16;case gu:case Cl:return Math.ceil(r/4)*Math.ceil(e/4)*8;case Rl:case Pl:return Math.ceil(r/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function xM(r){switch(r){case ai:case lu:return{byteLength:1,components:1};case Mr:case cu:case ni:return{byteLength:2,components:1};case ql:case Xl:return{byteLength:2,components:4};case Ai:case Wl:case Mn:return{byteLength:4,components:1};case hu:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}const MM={contain:_M,cover:vM,fill:yM,getByteLength:zh};function SM(r,e,t,n,i,s,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new W,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(C,b){return f?new OffscreenCanvas(C,b):Mo("canvas")}function _(C,b,U){let Z=1;const K=ae(C);if((K.width>U||K.height>U)&&(Z=U/Math.max(K.width,K.height)),Z<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const ee=Math.floor(Z*K.width),ve=Math.floor(Z*K.height);u===void 0&&(u=p(ee,ve));const de=b?p(ee,ve):u;return de.width=ee,de.height=ve,de.getContext("2d").drawImage(C,0,0,ee,ve),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+ee+"x"+ve+")."),de}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),C;return C}function m(C){return C.generateMipmaps&&C.minFilter!==Ut&&C.minFilter!==Et}function g(C){r.generateMipmap(C)}function y(C,b,U,Z,K=!1){if(C!==null){if(r[C]!==void 0)return r[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let ee=b;if(b===r.RED&&(U===r.FLOAT&&(ee=r.R32F),U===r.HALF_FLOAT&&(ee=r.R16F),U===r.UNSIGNED_BYTE&&(ee=r.R8)),b===r.RED_INTEGER&&(U===r.UNSIGNED_BYTE&&(ee=r.R8UI),U===r.UNSIGNED_SHORT&&(ee=r.R16UI),U===r.UNSIGNED_INT&&(ee=r.R32UI),U===r.BYTE&&(ee=r.R8I),U===r.SHORT&&(ee=r.R16I),U===r.INT&&(ee=r.R32I)),b===r.RG&&(U===r.FLOAT&&(ee=r.RG32F),U===r.HALF_FLOAT&&(ee=r.RG16F),U===r.UNSIGNED_BYTE&&(ee=r.RG8)),b===r.RG_INTEGER&&(U===r.UNSIGNED_BYTE&&(ee=r.RG8UI),U===r.UNSIGNED_SHORT&&(ee=r.RG16UI),U===r.UNSIGNED_INT&&(ee=r.RG32UI),U===r.BYTE&&(ee=r.RG8I),U===r.SHORT&&(ee=r.RG16I),U===r.INT&&(ee=r.RG32I)),b===r.RGB_INTEGER&&(U===r.UNSIGNED_BYTE&&(ee=r.RGB8UI),U===r.UNSIGNED_SHORT&&(ee=r.RGB16UI),U===r.UNSIGNED_INT&&(ee=r.RGB32UI),U===r.BYTE&&(ee=r.RGB8I),U===r.SHORT&&(ee=r.RGB16I),U===r.INT&&(ee=r.RGB32I)),b===r.RGBA_INTEGER&&(U===r.UNSIGNED_BYTE&&(ee=r.RGBA8UI),U===r.UNSIGNED_SHORT&&(ee=r.RGBA16UI),U===r.UNSIGNED_INT&&(ee=r.RGBA32UI),U===r.BYTE&&(ee=r.RGBA8I),U===r.SHORT&&(ee=r.RGBA16I),U===r.INT&&(ee=r.RGBA32I)),b===r.RGB&&U===r.UNSIGNED_INT_5_9_9_9_REV&&(ee=r.RGB9_E5),b===r.RGBA){const ve=K?go:Je.getTransfer(Z);U===r.FLOAT&&(ee=r.RGBA32F),U===r.HALF_FLOAT&&(ee=r.RGBA16F),U===r.UNSIGNED_BYTE&&(ee=ve===ut?r.SRGB8_ALPHA8:r.RGBA8),U===r.UNSIGNED_SHORT_4_4_4_4&&(ee=r.RGBA4),U===r.UNSIGNED_SHORT_5_5_5_1&&(ee=r.RGB5_A1)}return(ee===r.R16F||ee===r.R32F||ee===r.RG16F||ee===r.RG32F||ee===r.RGBA16F||ee===r.RGBA32F)&&e.get("EXT_color_buffer_float"),ee}function v(C,b){let U;return C?b===null||b===Ai||b===Rs?U=r.DEPTH24_STENCIL8:b===Mn?U=r.DEPTH32F_STENCIL8:b===Mr&&(U=r.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===Ai||b===Rs?U=r.DEPTH_COMPONENT24:b===Mn?U=r.DEPTH_COMPONENT32F:b===Mr&&(U=r.DEPTH_COMPONENT16),U}function x(C,b){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==Ut&&C.minFilter!==Et?Math.log2(Math.max(b.width,b.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?b.mipmaps.length:1}function R(C){const b=C.target;b.removeEventListener("dispose",R),T(b),b.isVideoTexture&&h.delete(b)}function A(C){const b=C.target;b.removeEventListener("dispose",A),F(b)}function T(C){const b=n.get(C);if(b.__webglInit===void 0)return;const U=C.source,Z=d.get(U);if(Z){const K=Z[b.__cacheKey];K.usedTimes--,K.usedTimes===0&&I(C),Object.keys(Z).length===0&&d.delete(U)}n.remove(C)}function I(C){const b=n.get(C);r.deleteTexture(b.__webglTexture);const U=C.source,Z=d.get(U);delete Z[b.__cacheKey],o.memory.textures--}function F(C){const b=n.get(C);if(C.depthTexture&&C.depthTexture.dispose(),C.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(b.__webglFramebuffer[Z]))for(let K=0;K<b.__webglFramebuffer[Z].length;K++)r.deleteFramebuffer(b.__webglFramebuffer[Z][K]);else r.deleteFramebuffer(b.__webglFramebuffer[Z]);b.__webglDepthbuffer&&r.deleteRenderbuffer(b.__webglDepthbuffer[Z])}else{if(Array.isArray(b.__webglFramebuffer))for(let Z=0;Z<b.__webglFramebuffer.length;Z++)r.deleteFramebuffer(b.__webglFramebuffer[Z]);else r.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&r.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&r.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let Z=0;Z<b.__webglColorRenderbuffer.length;Z++)b.__webglColorRenderbuffer[Z]&&r.deleteRenderbuffer(b.__webglColorRenderbuffer[Z]);b.__webglDepthRenderbuffer&&r.deleteRenderbuffer(b.__webglDepthRenderbuffer)}const U=C.textures;for(let Z=0,K=U.length;Z<K;Z++){const ee=n.get(U[Z]);ee.__webglTexture&&(r.deleteTexture(ee.__webglTexture),o.memory.textures--),n.remove(U[Z])}n.remove(C)}let M=0;function w(){M=0}function B(){const C=M;return C>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+i.maxTextures),M+=1,C}function z(C){const b=[];return b.push(C.wrapS),b.push(C.wrapT),b.push(C.wrapR||0),b.push(C.magFilter),b.push(C.minFilter),b.push(C.anisotropy),b.push(C.internalFormat),b.push(C.format),b.push(C.type),b.push(C.generateMipmaps),b.push(C.premultiplyAlpha),b.push(C.flipY),b.push(C.unpackAlignment),b.push(C.colorSpace),b.join()}function q(C,b){const U=n.get(C);if(C.isVideoTexture&&te(C),C.isRenderTargetTexture===!1&&C.version>0&&U.__version!==C.version){const Z=C.image;if(Z===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Fe(U,C,b);return}}t.bindTexture(r.TEXTURE_2D,U.__webglTexture,r.TEXTURE0+b)}function j(C,b){const U=n.get(C);if(C.version>0&&U.__version!==C.version){Fe(U,C,b);return}t.bindTexture(r.TEXTURE_2D_ARRAY,U.__webglTexture,r.TEXTURE0+b)}function k(C,b){const U=n.get(C);if(C.version>0&&U.__version!==C.version){Fe(U,C,b);return}t.bindTexture(r.TEXTURE_3D,U.__webglTexture,r.TEXTURE0+b)}function $(C,b){const U=n.get(C);if(C.version>0&&U.__version!==C.version){G(U,C,b);return}t.bindTexture(r.TEXTURE_CUBE_MAP,U.__webglTexture,r.TEXTURE0+b)}const L={[Wt]:r.REPEAT,[Pn]:r.CLAMP_TO_EDGE,[xr]:r.MIRRORED_REPEAT},Q={[Ut]:r.NEAREST,[Vl]:r.NEAREST_MIPMAP_NEAREST,[ys]:r.NEAREST_MIPMAP_LINEAR,[Et]:r.LINEAR,[mr]:r.LINEAR_MIPMAP_NEAREST,[Bn]:r.LINEAR_MIPMAP_LINEAR},ne={[Xp]:r.NEVER,[jp]:r.ALWAYS,[Yp]:r.LESS,[yu]:r.LEQUAL,[Kp]:r.EQUAL,[Jp]:r.GEQUAL,[$p]:r.GREATER,[Zp]:r.NOTEQUAL};function le(C,b){if(b.type===Mn&&e.has("OES_texture_float_linear")===!1&&(b.magFilter===Et||b.magFilter===mr||b.magFilter===ys||b.magFilter===Bn||b.minFilter===Et||b.minFilter===mr||b.minFilter===ys||b.minFilter===Bn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(C,r.TEXTURE_WRAP_S,L[b.wrapS]),r.texParameteri(C,r.TEXTURE_WRAP_T,L[b.wrapT]),(C===r.TEXTURE_3D||C===r.TEXTURE_2D_ARRAY)&&r.texParameteri(C,r.TEXTURE_WRAP_R,L[b.wrapR]),r.texParameteri(C,r.TEXTURE_MAG_FILTER,Q[b.magFilter]),r.texParameteri(C,r.TEXTURE_MIN_FILTER,Q[b.minFilter]),b.compareFunction&&(r.texParameteri(C,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(C,r.TEXTURE_COMPARE_FUNC,ne[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===Ut||b.minFilter!==ys&&b.minFilter!==Bn||b.type===Mn&&e.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||n.get(b).__currentAnisotropy){const U=e.get("EXT_texture_filter_anisotropic");r.texParameterf(C,U.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,i.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy}}}function we(C,b){let U=!1;C.__webglInit===void 0&&(C.__webglInit=!0,b.addEventListener("dispose",R));const Z=b.source;let K=d.get(Z);K===void 0&&(K={},d.set(Z,K));const ee=z(b);if(ee!==C.__cacheKey){K[ee]===void 0&&(K[ee]={texture:r.createTexture(),usedTimes:0},o.memory.textures++,U=!0),K[ee].usedTimes++;const ve=K[C.__cacheKey];ve!==void 0&&(K[C.__cacheKey].usedTimes--,ve.usedTimes===0&&I(b)),C.__cacheKey=ee,C.__webglTexture=K[ee].texture}return U}function Fe(C,b,U){let Z=r.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(Z=r.TEXTURE_2D_ARRAY),b.isData3DTexture&&(Z=r.TEXTURE_3D);const K=we(C,b),ee=b.source;t.bindTexture(Z,C.__webglTexture,r.TEXTURE0+U);const ve=n.get(ee);if(ee.version!==ve.__version||K===!0){t.activeTexture(r.TEXTURE0+U);const de=Je.getPrimaries(Je.workingColorSpace),ye=b.colorSpace===yi?null:Je.getPrimaries(b.colorSpace),je=b.colorSpace===yi||de===ye?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,b.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,b.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,je);let he=_(b.image,!1,i.maxTextureSize);he=ge(b,he);const Te=s.convert(b.format,b.colorSpace),He=s.convert(b.type);let Ge=y(b.internalFormat,Te,He,b.colorSpace,b.isVideoTexture);le(Z,b);let Ae;const Qe=b.mipmaps,We=b.isVideoTexture!==!0,pt=ve.__version===void 0||K===!0,N=ee.dataReady,Se=x(b,he);if(b.isDepthTexture)Ge=v(b.format===Ps,b.type),pt&&(We?t.texStorage2D(r.TEXTURE_2D,1,Ge,he.width,he.height):t.texImage2D(r.TEXTURE_2D,0,Ge,he.width,he.height,0,Te,He,null));else if(b.isDataTexture)if(Qe.length>0){We&&pt&&t.texStorage2D(r.TEXTURE_2D,Se,Ge,Qe[0].width,Qe[0].height);for(let J=0,re=Qe.length;J<re;J++)Ae=Qe[J],We?N&&t.texSubImage2D(r.TEXTURE_2D,J,0,0,Ae.width,Ae.height,Te,He,Ae.data):t.texImage2D(r.TEXTURE_2D,J,Ge,Ae.width,Ae.height,0,Te,He,Ae.data);b.generateMipmaps=!1}else We?(pt&&t.texStorage2D(r.TEXTURE_2D,Se,Ge,he.width,he.height),N&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,he.width,he.height,Te,He,he.data)):t.texImage2D(r.TEXTURE_2D,0,Ge,he.width,he.height,0,Te,He,he.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){We&&pt&&t.texStorage3D(r.TEXTURE_2D_ARRAY,Se,Ge,Qe[0].width,Qe[0].height,he.depth);for(let J=0,re=Qe.length;J<re;J++)if(Ae=Qe[J],b.format!==un)if(Te!==null)if(We){if(N)if(b.layerUpdates.size>0){const xe=zh(Ae.width,Ae.height,b.format,b.type);for(const be of b.layerUpdates){const nt=Ae.data.subarray(be*xe/Ae.data.BYTES_PER_ELEMENT,(be+1)*xe/Ae.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,J,0,0,be,Ae.width,Ae.height,1,Te,nt,0,0)}b.clearLayerUpdates()}else t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,J,0,0,0,Ae.width,Ae.height,he.depth,Te,Ae.data,0,0)}else t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,J,Ge,Ae.width,Ae.height,he.depth,0,Ae.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else We?N&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,J,0,0,0,Ae.width,Ae.height,he.depth,Te,He,Ae.data):t.texImage3D(r.TEXTURE_2D_ARRAY,J,Ge,Ae.width,Ae.height,he.depth,0,Te,He,Ae.data)}else{We&&pt&&t.texStorage2D(r.TEXTURE_2D,Se,Ge,Qe[0].width,Qe[0].height);for(let J=0,re=Qe.length;J<re;J++)Ae=Qe[J],b.format!==un?Te!==null?We?N&&t.compressedTexSubImage2D(r.TEXTURE_2D,J,0,0,Ae.width,Ae.height,Te,Ae.data):t.compressedTexImage2D(r.TEXTURE_2D,J,Ge,Ae.width,Ae.height,0,Ae.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):We?N&&t.texSubImage2D(r.TEXTURE_2D,J,0,0,Ae.width,Ae.height,Te,He,Ae.data):t.texImage2D(r.TEXTURE_2D,J,Ge,Ae.width,Ae.height,0,Te,He,Ae.data)}else if(b.isDataArrayTexture)if(We){if(pt&&t.texStorage3D(r.TEXTURE_2D_ARRAY,Se,Ge,he.width,he.height,he.depth),N)if(b.layerUpdates.size>0){const J=zh(he.width,he.height,b.format,b.type);for(const re of b.layerUpdates){const xe=he.data.subarray(re*J/he.data.BYTES_PER_ELEMENT,(re+1)*J/he.data.BYTES_PER_ELEMENT);t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,re,he.width,he.height,1,Te,He,xe)}b.clearLayerUpdates()}else t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,he.width,he.height,he.depth,Te,He,he.data)}else t.texImage3D(r.TEXTURE_2D_ARRAY,0,Ge,he.width,he.height,he.depth,0,Te,He,he.data);else if(b.isData3DTexture)We?(pt&&t.texStorage3D(r.TEXTURE_3D,Se,Ge,he.width,he.height,he.depth),N&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,he.width,he.height,he.depth,Te,He,he.data)):t.texImage3D(r.TEXTURE_3D,0,Ge,he.width,he.height,he.depth,0,Te,He,he.data);else if(b.isFramebufferTexture){if(pt)if(We)t.texStorage2D(r.TEXTURE_2D,Se,Ge,he.width,he.height);else{let J=he.width,re=he.height;for(let xe=0;xe<Se;xe++)t.texImage2D(r.TEXTURE_2D,xe,Ge,J,re,0,Te,He,null),J>>=1,re>>=1}}else if(Qe.length>0){if(We&&pt){const J=ae(Qe[0]);t.texStorage2D(r.TEXTURE_2D,Se,Ge,J.width,J.height)}for(let J=0,re=Qe.length;J<re;J++)Ae=Qe[J],We?N&&t.texSubImage2D(r.TEXTURE_2D,J,0,0,Te,He,Ae):t.texImage2D(r.TEXTURE_2D,J,Ge,Te,He,Ae);b.generateMipmaps=!1}else if(We){if(pt){const J=ae(he);t.texStorage2D(r.TEXTURE_2D,Se,Ge,J.width,J.height)}N&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,Te,He,he)}else t.texImage2D(r.TEXTURE_2D,0,Ge,Te,He,he);m(b)&&g(Z),ve.__version=ee.version,b.onUpdate&&b.onUpdate(b)}C.__version=b.version}function G(C,b,U){if(b.image.length!==6)return;const Z=we(C,b),K=b.source;t.bindTexture(r.TEXTURE_CUBE_MAP,C.__webglTexture,r.TEXTURE0+U);const ee=n.get(K);if(K.version!==ee.__version||Z===!0){t.activeTexture(r.TEXTURE0+U);const ve=Je.getPrimaries(Je.workingColorSpace),de=b.colorSpace===yi?null:Je.getPrimaries(b.colorSpace),ye=b.colorSpace===yi||ve===de?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,b.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,b.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,ye);const je=b.isCompressedTexture||b.image[0].isCompressedTexture,he=b.image[0]&&b.image[0].isDataTexture,Te=[];for(let re=0;re<6;re++)!je&&!he?Te[re]=_(b.image[re],!0,i.maxCubemapSize):Te[re]=he?b.image[re].image:b.image[re],Te[re]=ge(b,Te[re]);const He=Te[0],Ge=s.convert(b.format,b.colorSpace),Ae=s.convert(b.type),Qe=y(b.internalFormat,Ge,Ae,b.colorSpace),We=b.isVideoTexture!==!0,pt=ee.__version===void 0||Z===!0,N=K.dataReady;let Se=x(b,He);le(r.TEXTURE_CUBE_MAP,b);let J;if(je){We&&pt&&t.texStorage2D(r.TEXTURE_CUBE_MAP,Se,Qe,He.width,He.height);for(let re=0;re<6;re++){J=Te[re].mipmaps;for(let xe=0;xe<J.length;xe++){const be=J[xe];b.format!==un?Ge!==null?We?N&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+re,xe,0,0,be.width,be.height,Ge,be.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+re,xe,Qe,be.width,be.height,0,be.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):We?N&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+re,xe,0,0,be.width,be.height,Ge,Ae,be.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+re,xe,Qe,be.width,be.height,0,Ge,Ae,be.data)}}}else{if(J=b.mipmaps,We&&pt){J.length>0&&Se++;const re=ae(Te[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,Se,Qe,re.width,re.height)}for(let re=0;re<6;re++)if(he){We?N&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,Te[re].width,Te[re].height,Ge,Ae,Te[re].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,Qe,Te[re].width,Te[re].height,0,Ge,Ae,Te[re].data);for(let xe=0;xe<J.length;xe++){const nt=J[xe].image[re].image;We?N&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+re,xe+1,0,0,nt.width,nt.height,Ge,Ae,nt.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+re,xe+1,Qe,nt.width,nt.height,0,Ge,Ae,nt.data)}}else{We?N&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,Ge,Ae,Te[re]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,Qe,Ge,Ae,Te[re]);for(let xe=0;xe<J.length;xe++){const be=J[xe];We?N&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+re,xe+1,0,0,Ge,Ae,be.image[re]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+re,xe+1,Qe,Ge,Ae,be.image[re])}}}m(b)&&g(r.TEXTURE_CUBE_MAP),ee.__version=K.version,b.onUpdate&&b.onUpdate(b)}C.__version=b.version}function ie(C,b,U,Z,K,ee){const ve=s.convert(U.format,U.colorSpace),de=s.convert(U.type),ye=y(U.internalFormat,ve,de,U.colorSpace);if(!n.get(b).__hasExternalTextures){const he=Math.max(1,b.width>>ee),Te=Math.max(1,b.height>>ee);K===r.TEXTURE_3D||K===r.TEXTURE_2D_ARRAY?t.texImage3D(K,ee,ye,he,Te,b.depth,0,ve,de,null):t.texImage2D(K,ee,ye,he,Te,0,ve,de,null)}t.bindFramebuffer(r.FRAMEBUFFER,C),Y(b)?a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,Z,K,n.get(U).__webglTexture,0,X(b)):(K===r.TEXTURE_2D||K>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,Z,K,n.get(U).__webglTexture,ee),t.bindFramebuffer(r.FRAMEBUFFER,null)}function pe(C,b,U){if(r.bindRenderbuffer(r.RENDERBUFFER,C),b.depthBuffer){const Z=b.depthTexture,K=Z&&Z.isDepthTexture?Z.type:null,ee=v(b.stencilBuffer,K),ve=b.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,de=X(b);Y(b)?a.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,de,ee,b.width,b.height):U?r.renderbufferStorageMultisample(r.RENDERBUFFER,de,ee,b.width,b.height):r.renderbufferStorage(r.RENDERBUFFER,ee,b.width,b.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,ve,r.RENDERBUFFER,C)}else{const Z=b.textures;for(let K=0;K<Z.length;K++){const ee=Z[K],ve=s.convert(ee.format,ee.colorSpace),de=s.convert(ee.type),ye=y(ee.internalFormat,ve,de,ee.colorSpace),je=X(b);U&&Y(b)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,je,ye,b.width,b.height):Y(b)?a.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,je,ye,b.width,b.height):r.renderbufferStorage(r.RENDERBUFFER,ye,b.width,b.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function ue(C,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(r.FRAMEBUFFER,C),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(b.depthTexture).__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),q(b.depthTexture,0);const Z=n.get(b.depthTexture).__webglTexture,K=X(b);if(b.depthTexture.format===Ts)Y(b)?a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,Z,0,K):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,Z,0);else if(b.depthTexture.format===Ps)Y(b)?a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,Z,0,K):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,Z,0);else throw new Error("Unknown depthTexture format")}function Oe(C){const b=n.get(C),U=C.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==C.depthTexture){const Z=C.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),Z){const K=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,Z.removeEventListener("dispose",K)};Z.addEventListener("dispose",K),b.__depthDisposeCallback=K}b.__boundDepthTexture=Z}if(C.depthTexture&&!b.__autoAllocateDepthBuffer){if(U)throw new Error("target.depthTexture not supported in Cube render targets");ue(b.__webglFramebuffer,C)}else if(U){b.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(t.bindFramebuffer(r.FRAMEBUFFER,b.__webglFramebuffer[Z]),b.__webglDepthbuffer[Z]===void 0)b.__webglDepthbuffer[Z]=r.createRenderbuffer(),pe(b.__webglDepthbuffer[Z],C,!1);else{const K=C.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ee=b.__webglDepthbuffer[Z];r.bindRenderbuffer(r.RENDERBUFFER,ee),r.framebufferRenderbuffer(r.FRAMEBUFFER,K,r.RENDERBUFFER,ee)}}else if(t.bindFramebuffer(r.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=r.createRenderbuffer(),pe(b.__webglDepthbuffer,C,!1);else{const Z=C.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,K=b.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,K),r.framebufferRenderbuffer(r.FRAMEBUFFER,Z,r.RENDERBUFFER,K)}t.bindFramebuffer(r.FRAMEBUFFER,null)}function Le(C,b,U){const Z=n.get(C);b!==void 0&&ie(Z.__webglFramebuffer,C,C.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),U!==void 0&&Oe(C)}function Ne(C){const b=C.texture,U=n.get(C),Z=n.get(b);C.addEventListener("dispose",A);const K=C.textures,ee=C.isWebGLCubeRenderTarget===!0,ve=K.length>1;if(ve||(Z.__webglTexture===void 0&&(Z.__webglTexture=r.createTexture()),Z.__version=b.version,o.memory.textures++),ee){U.__webglFramebuffer=[];for(let de=0;de<6;de++)if(b.mipmaps&&b.mipmaps.length>0){U.__webglFramebuffer[de]=[];for(let ye=0;ye<b.mipmaps.length;ye++)U.__webglFramebuffer[de][ye]=r.createFramebuffer()}else U.__webglFramebuffer[de]=r.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){U.__webglFramebuffer=[];for(let de=0;de<b.mipmaps.length;de++)U.__webglFramebuffer[de]=r.createFramebuffer()}else U.__webglFramebuffer=r.createFramebuffer();if(ve)for(let de=0,ye=K.length;de<ye;de++){const je=n.get(K[de]);je.__webglTexture===void 0&&(je.__webglTexture=r.createTexture(),o.memory.textures++)}if(C.samples>0&&Y(C)===!1){U.__webglMultisampledFramebuffer=r.createFramebuffer(),U.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,U.__webglMultisampledFramebuffer);for(let de=0;de<K.length;de++){const ye=K[de];U.__webglColorRenderbuffer[de]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,U.__webglColorRenderbuffer[de]);const je=s.convert(ye.format,ye.colorSpace),he=s.convert(ye.type),Te=y(ye.internalFormat,je,he,ye.colorSpace,C.isXRRenderTarget===!0),He=X(C);r.renderbufferStorageMultisample(r.RENDERBUFFER,He,Te,C.width,C.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+de,r.RENDERBUFFER,U.__webglColorRenderbuffer[de])}r.bindRenderbuffer(r.RENDERBUFFER,null),C.depthBuffer&&(U.__webglDepthRenderbuffer=r.createRenderbuffer(),pe(U.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(ee){t.bindTexture(r.TEXTURE_CUBE_MAP,Z.__webglTexture),le(r.TEXTURE_CUBE_MAP,b);for(let de=0;de<6;de++)if(b.mipmaps&&b.mipmaps.length>0)for(let ye=0;ye<b.mipmaps.length;ye++)ie(U.__webglFramebuffer[de][ye],C,b,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+de,ye);else ie(U.__webglFramebuffer[de],C,b,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+de,0);m(b)&&g(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ve){for(let de=0,ye=K.length;de<ye;de++){const je=K[de],he=n.get(je);t.bindTexture(r.TEXTURE_2D,he.__webglTexture),le(r.TEXTURE_2D,je),ie(U.__webglFramebuffer,C,je,r.COLOR_ATTACHMENT0+de,r.TEXTURE_2D,0),m(je)&&g(r.TEXTURE_2D)}t.unbindTexture()}else{let de=r.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(de=C.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(de,Z.__webglTexture),le(de,b),b.mipmaps&&b.mipmaps.length>0)for(let ye=0;ye<b.mipmaps.length;ye++)ie(U.__webglFramebuffer[ye],C,b,r.COLOR_ATTACHMENT0,de,ye);else ie(U.__webglFramebuffer,C,b,r.COLOR_ATTACHMENT0,de,0);m(b)&&g(de),t.unbindTexture()}C.depthBuffer&&Oe(C)}function ze(C){const b=C.textures;for(let U=0,Z=b.length;U<Z;U++){const K=b[U];if(m(K)){const ee=C.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:r.TEXTURE_2D,ve=n.get(K).__webglTexture;t.bindTexture(ee,ve),g(ee),t.unbindTexture()}}}const se=[],P=[];function me(C){if(C.samples>0){if(Y(C)===!1){const b=C.textures,U=C.width,Z=C.height;let K=r.COLOR_BUFFER_BIT;const ee=C.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ve=n.get(C),de=b.length>1;if(de)for(let ye=0;ye<b.length;ye++)t.bindFramebuffer(r.FRAMEBUFFER,ve.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+ye,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,ve.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+ye,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,ve.__webglMultisampledFramebuffer),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,ve.__webglFramebuffer);for(let ye=0;ye<b.length;ye++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(K|=r.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(K|=r.STENCIL_BUFFER_BIT)),de){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,ve.__webglColorRenderbuffer[ye]);const je=n.get(b[ye]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,je,0)}r.blitFramebuffer(0,0,U,Z,0,0,U,Z,K,r.NEAREST),l===!0&&(se.length=0,P.length=0,se.push(r.COLOR_ATTACHMENT0+ye),C.depthBuffer&&C.resolveDepthBuffer===!1&&(se.push(ee),P.push(ee),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,P)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,se))}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),de)for(let ye=0;ye<b.length;ye++){t.bindFramebuffer(r.FRAMEBUFFER,ve.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+ye,r.RENDERBUFFER,ve.__webglColorRenderbuffer[ye]);const je=n.get(b[ye]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,ve.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+ye,r.TEXTURE_2D,je,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,ve.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){const b=C.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[b])}}}function X(C){return Math.min(i.maxSamples,C.samples)}function Y(C){const b=n.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function te(C){const b=o.render.frame;h.get(C)!==b&&(h.set(C,b),C.update())}function ge(C,b){const U=C.colorSpace,Z=C.format,K=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||U!==qt&&U!==yi&&(Je.getTransfer(U)===ut?(Z!==un||K!==ai)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",U)),b}function ae(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=B,this.resetTextureUnits=w,this.setTexture2D=q,this.setTexture2DArray=j,this.setTexture3D=k,this.setTextureCube=$,this.rebindTextures=Le,this.setupRenderTarget=Ne,this.updateRenderTargetMipmap=ze,this.updateMultisampleRenderTarget=me,this.setupDepthRenderbuffer=Oe,this.setupFrameBufferTexture=ie,this.useMultisampledRTT=Y}function dm(r,e){function t(n,i=yi){let s;const o=Je.getTransfer(i);if(n===ai)return r.UNSIGNED_BYTE;if(n===ql)return r.UNSIGNED_SHORT_4_4_4_4;if(n===Xl)return r.UNSIGNED_SHORT_5_5_5_1;if(n===hu)return r.UNSIGNED_INT_5_9_9_9_REV;if(n===lu)return r.BYTE;if(n===cu)return r.SHORT;if(n===Mr)return r.UNSIGNED_SHORT;if(n===Wl)return r.INT;if(n===Ai)return r.UNSIGNED_INT;if(n===Mn)return r.FLOAT;if(n===ni)return r.HALF_FLOAT;if(n===uu)return r.ALPHA;if(n===du)return r.RGB;if(n===un)return r.RGBA;if(n===fu)return r.LUMINANCE;if(n===pu)return r.LUMINANCE_ALPHA;if(n===Ts)return r.DEPTH_COMPONENT;if(n===Ps)return r.DEPTH_STENCIL;if(n===Yl)return r.RED;if(n===No)return r.RED_INTEGER;if(n===mu)return r.RG;if(n===Kl)return r.RG_INTEGER;if(n===$l)return r.RGBA_INTEGER;if(n===no||n===io||n===so||n===ro)if(o===ut)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===no)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===io)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===so)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ro)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===no)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===io)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===so)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ro)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===rl||n===ol||n===al||n===ll)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===rl)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ol)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===al)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===ll)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===cl||n===hl||n===ul)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===cl||n===hl)return o===ut?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===ul)return o===ut?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===dl||n===fl||n===pl||n===ml||n===gl||n===_l||n===vl||n===yl||n===xl||n===Ml||n===Sl||n===bl||n===wl||n===Tl)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===dl)return o===ut?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===fl)return o===ut?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===pl)return o===ut?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===ml)return o===ut?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===gl)return o===ut?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===_l)return o===ut?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===vl)return o===ut?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===yl)return o===ut?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===xl)return o===ut?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ml)return o===ut?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Sl)return o===ut?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===bl)return o===ut?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===wl)return o===ut?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Tl)return o===ut?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===oo||n===Al||n===El)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===oo)return o===ut?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Al)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===El)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===gu||n===Cl||n===Rl||n===Pl)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===oo)return s.COMPRESSED_RED_RGTC1_EXT;if(n===Cl)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Rl)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Pl)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Rs?r.UNSIGNED_INT_24_8:r[n]!==void 0?r[n]:null}return{convert:t}}class fm extends Dt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Mt extends Ze{constructor(){super(),this.isGroup=!0,this.type="Group"}}const bM={type:"move"};class eh{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Mt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Mt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new S,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new S),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Mt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new S,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new S),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const _ of e.hand.values()){const m=t.getJointPose(_,n),g=this._getHandJoint(c,_);m!==null&&(g.matrix.fromArray(m.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=m.radius),g.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,p=.005;c.inputState.pinching&&d>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(bM)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Mt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const wM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,TM=`
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

}`;class AM{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const i=new St,s=e.properties.get(i);s.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Ft({vertexShader:wM,fragmentShader:TM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ce(new In(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class EM extends ci{constructor(e,t){super();const n=this;let i=null,s=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,p=null;const _=new AM,m=t.getContextAttributes();let g=null,y=null;const v=[],x=[],R=new W;let A=null;const T=new Dt;T.layers.enable(1),T.viewport=new tt;const I=new Dt;I.layers.enable(2),I.viewport=new tt;const F=[T,I],M=new fm;M.layers.enable(1),M.layers.enable(2);let w=null,B=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(G){let ie=v[G];return ie===void 0&&(ie=new eh,v[G]=ie),ie.getTargetRaySpace()},this.getControllerGrip=function(G){let ie=v[G];return ie===void 0&&(ie=new eh,v[G]=ie),ie.getGripSpace()},this.getHand=function(G){let ie=v[G];return ie===void 0&&(ie=new eh,v[G]=ie),ie.getHandSpace()};function z(G){const ie=x.indexOf(G.inputSource);if(ie===-1)return;const pe=v[ie];pe!==void 0&&(pe.update(G.inputSource,G.frame,c||o),pe.dispatchEvent({type:G.type,data:G.inputSource}))}function q(){i.removeEventListener("select",z),i.removeEventListener("selectstart",z),i.removeEventListener("selectend",z),i.removeEventListener("squeeze",z),i.removeEventListener("squeezestart",z),i.removeEventListener("squeezeend",z),i.removeEventListener("end",q),i.removeEventListener("inputsourceschange",j);for(let G=0;G<v.length;G++){const ie=x[G];ie!==null&&(x[G]=null,v[G].disconnect(ie))}w=null,B=null,_.reset(),e.setRenderTarget(g),f=null,d=null,u=null,i=null,y=null,Fe.stop(),n.isPresenting=!1,e.setPixelRatio(A),e.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(G){s=G,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(G){a=G,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(G){c=G},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return p},this.getSession=function(){return i},this.setSession=async function(G){if(i=G,i!==null){if(g=e.getRenderTarget(),i.addEventListener("select",z),i.addEventListener("selectstart",z),i.addEventListener("selectend",z),i.addEventListener("squeeze",z),i.addEventListener("squeezestart",z),i.addEventListener("squeezeend",z),i.addEventListener("end",q),i.addEventListener("inputsourceschange",j),m.xrCompatible!==!0&&await t.makeXRCompatible(),A=e.getPixelRatio(),e.getSize(R),i.renderState.layers===void 0){const ie={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(i,t,ie),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new dn(f.framebufferWidth,f.framebufferHeight,{format:un,type:ai,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let ie=null,pe=null,ue=null;m.depth&&(ue=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ie=m.stencil?Ps:Ts,pe=m.stencil?Rs:Ai);const Oe={colorFormat:t.RGBA8,depthFormat:ue,scaleFactor:s};u=new XRWebGLBinding(i,t),d=u.createProjectionLayer(Oe),i.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new dn(d.textureWidth,d.textureHeight,{format:un,type:ai,depthTexture:new Tu(d.textureWidth,d.textureHeight,pe,void 0,void 0,void 0,void 0,void 0,void 0,ie),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),Fe.setContext(i),Fe.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function j(G){for(let ie=0;ie<G.removed.length;ie++){const pe=G.removed[ie],ue=x.indexOf(pe);ue>=0&&(x[ue]=null,v[ue].disconnect(pe))}for(let ie=0;ie<G.added.length;ie++){const pe=G.added[ie];let ue=x.indexOf(pe);if(ue===-1){for(let Le=0;Le<v.length;Le++)if(Le>=x.length){x.push(pe),ue=Le;break}else if(x[Le]===null){x[Le]=pe,ue=Le;break}if(ue===-1)break}const Oe=v[ue];Oe&&Oe.connect(pe)}}const k=new S,$=new S;function L(G,ie,pe){k.setFromMatrixPosition(ie.matrixWorld),$.setFromMatrixPosition(pe.matrixWorld);const ue=k.distanceTo($),Oe=ie.projectionMatrix.elements,Le=pe.projectionMatrix.elements,Ne=Oe[14]/(Oe[10]-1),ze=Oe[14]/(Oe[10]+1),se=(Oe[9]+1)/Oe[5],P=(Oe[9]-1)/Oe[5],me=(Oe[8]-1)/Oe[0],X=(Le[8]+1)/Le[0],Y=Ne*me,te=Ne*X,ge=ue/(-me+X),ae=ge*-me;if(ie.matrixWorld.decompose(G.position,G.quaternion,G.scale),G.translateX(ae),G.translateZ(ge),G.matrixWorld.compose(G.position,G.quaternion,G.scale),G.matrixWorldInverse.copy(G.matrixWorld).invert(),Oe[10]===-1)G.projectionMatrix.copy(ie.projectionMatrix),G.projectionMatrixInverse.copy(ie.projectionMatrixInverse);else{const C=Ne+ge,b=ze+ge,U=Y-ae,Z=te+(ue-ae),K=se*ze/b*C,ee=P*ze/b*C;G.projectionMatrix.makePerspective(U,Z,K,ee,C,b),G.projectionMatrixInverse.copy(G.projectionMatrix).invert()}}function Q(G,ie){ie===null?G.matrixWorld.copy(G.matrix):G.matrixWorld.multiplyMatrices(ie.matrixWorld,G.matrix),G.matrixWorldInverse.copy(G.matrixWorld).invert()}this.updateCamera=function(G){if(i===null)return;let ie=G.near,pe=G.far;_.texture!==null&&(_.depthNear>0&&(ie=_.depthNear),_.depthFar>0&&(pe=_.depthFar)),M.near=I.near=T.near=ie,M.far=I.far=T.far=pe,(w!==M.near||B!==M.far)&&(i.updateRenderState({depthNear:M.near,depthFar:M.far}),w=M.near,B=M.far);const ue=G.parent,Oe=M.cameras;Q(M,ue);for(let Le=0;Le<Oe.length;Le++)Q(Oe[Le],ue);Oe.length===2?L(M,T,I):M.projectionMatrix.copy(T.projectionMatrix),ne(G,M,ue)};function ne(G,ie,pe){pe===null?G.matrix.copy(ie.matrixWorld):(G.matrix.copy(pe.matrixWorld),G.matrix.invert(),G.matrix.multiply(ie.matrixWorld)),G.matrix.decompose(G.position,G.quaternion,G.scale),G.updateMatrixWorld(!0),G.projectionMatrix.copy(ie.projectionMatrix),G.projectionMatrixInverse.copy(ie.projectionMatrixInverse),G.isPerspectiveCamera&&(G.fov=wr*2*Math.atan(1/G.projectionMatrix.elements[5]),G.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(G){l=G,d!==null&&(d.fixedFoveation=G),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=G)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(M)};let le=null;function we(G,ie){if(h=ie.getViewerPose(c||o),p=ie,h!==null){const pe=h.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let ue=!1;pe.length!==M.cameras.length&&(M.cameras.length=0,ue=!0);for(let Le=0;Le<pe.length;Le++){const Ne=pe[Le];let ze=null;if(f!==null)ze=f.getViewport(Ne);else{const P=u.getViewSubImage(d,Ne);ze=P.viewport,Le===0&&(e.setRenderTargetTextures(y,P.colorTexture,d.ignoreDepthValues?void 0:P.depthStencilTexture),e.setRenderTarget(y))}let se=F[Le];se===void 0&&(se=new Dt,se.layers.enable(Le),se.viewport=new tt,F[Le]=se),se.matrix.fromArray(Ne.transform.matrix),se.matrix.decompose(se.position,se.quaternion,se.scale),se.projectionMatrix.fromArray(Ne.projectionMatrix),se.projectionMatrixInverse.copy(se.projectionMatrix).invert(),se.viewport.set(ze.x,ze.y,ze.width,ze.height),Le===0&&(M.matrix.copy(se.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),ue===!0&&M.cameras.push(se)}const Oe=i.enabledFeatures;if(Oe&&Oe.includes("depth-sensing")){const Le=u.getDepthInformation(pe[0]);Le&&Le.isValid&&Le.texture&&_.init(e,Le,i.renderState)}}for(let pe=0;pe<v.length;pe++){const ue=x[pe],Oe=v[pe];ue!==null&&Oe!==void 0&&Oe.update(ue,ie,c||o)}le&&le(G,ie),ie.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ie}),p=null}const Fe=new am;Fe.setAnimationLoop(we),this.setAnimationLoop=function(G){le=G},this.dispose=function(){}}}const os=new Zt,CM=new Pe;function RM(r,e){function t(m,g){m.matrixAutoUpdate===!0&&m.updateMatrix(),g.value.copy(m.matrix)}function n(m,g){g.color.getRGB(m.fogColor.value,sm(r)),g.isFog?(m.fogNear.value=g.near,m.fogFar.value=g.far):g.isFogExp2&&(m.fogDensity.value=g.density)}function i(m,g,y,v,x){g.isMeshBasicMaterial||g.isMeshLambertMaterial?s(m,g):g.isMeshToonMaterial?(s(m,g),u(m,g)):g.isMeshPhongMaterial?(s(m,g),h(m,g)):g.isMeshStandardMaterial?(s(m,g),d(m,g),g.isMeshPhysicalMaterial&&f(m,g,x)):g.isMeshMatcapMaterial?(s(m,g),p(m,g)):g.isMeshDepthMaterial?s(m,g):g.isMeshDistanceMaterial?(s(m,g),_(m,g)):g.isMeshNormalMaterial?s(m,g):g.isLineBasicMaterial?(o(m,g),g.isLineDashedMaterial&&a(m,g)):g.isPointsMaterial?l(m,g,y,v):g.isSpriteMaterial?c(m,g):g.isShadowMaterial?(m.color.value.copy(g.color),m.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function s(m,g){m.opacity.value=g.opacity,g.color&&m.diffuse.value.copy(g.color),g.emissive&&m.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(m.map.value=g.map,t(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,t(g.alphaMap,m.alphaMapTransform)),g.bumpMap&&(m.bumpMap.value=g.bumpMap,t(g.bumpMap,m.bumpMapTransform),m.bumpScale.value=g.bumpScale,g.side===sn&&(m.bumpScale.value*=-1)),g.normalMap&&(m.normalMap.value=g.normalMap,t(g.normalMap,m.normalMapTransform),m.normalScale.value.copy(g.normalScale),g.side===sn&&m.normalScale.value.negate()),g.displacementMap&&(m.displacementMap.value=g.displacementMap,t(g.displacementMap,m.displacementMapTransform),m.displacementScale.value=g.displacementScale,m.displacementBias.value=g.displacementBias),g.emissiveMap&&(m.emissiveMap.value=g.emissiveMap,t(g.emissiveMap,m.emissiveMapTransform)),g.specularMap&&(m.specularMap.value=g.specularMap,t(g.specularMap,m.specularMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest);const y=e.get(g),v=y.envMap,x=y.envMapRotation;v&&(m.envMap.value=v,os.copy(x),os.x*=-1,os.y*=-1,os.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(os.y*=-1,os.z*=-1),m.envMapRotation.value.setFromMatrix4(CM.makeRotationFromEuler(os)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=g.reflectivity,m.ior.value=g.ior,m.refractionRatio.value=g.refractionRatio),g.lightMap&&(m.lightMap.value=g.lightMap,m.lightMapIntensity.value=g.lightMapIntensity,t(g.lightMap,m.lightMapTransform)),g.aoMap&&(m.aoMap.value=g.aoMap,m.aoMapIntensity.value=g.aoMapIntensity,t(g.aoMap,m.aoMapTransform))}function o(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,g.map&&(m.map.value=g.map,t(g.map,m.mapTransform))}function a(m,g){m.dashSize.value=g.dashSize,m.totalSize.value=g.dashSize+g.gapSize,m.scale.value=g.scale}function l(m,g,y,v){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.size.value=g.size*y,m.scale.value=v*.5,g.map&&(m.map.value=g.map,t(g.map,m.uvTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,t(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function c(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.rotation.value=g.rotation,g.map&&(m.map.value=g.map,t(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,t(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function h(m,g){m.specular.value.copy(g.specular),m.shininess.value=Math.max(g.shininess,1e-4)}function u(m,g){g.gradientMap&&(m.gradientMap.value=g.gradientMap)}function d(m,g){m.metalness.value=g.metalness,g.metalnessMap&&(m.metalnessMap.value=g.metalnessMap,t(g.metalnessMap,m.metalnessMapTransform)),m.roughness.value=g.roughness,g.roughnessMap&&(m.roughnessMap.value=g.roughnessMap,t(g.roughnessMap,m.roughnessMapTransform)),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)}function f(m,g,y){m.ior.value=g.ior,g.sheen>0&&(m.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),m.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(m.sheenColorMap.value=g.sheenColorMap,t(g.sheenColorMap,m.sheenColorMapTransform)),g.sheenRoughnessMap&&(m.sheenRoughnessMap.value=g.sheenRoughnessMap,t(g.sheenRoughnessMap,m.sheenRoughnessMapTransform))),g.clearcoat>0&&(m.clearcoat.value=g.clearcoat,m.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(m.clearcoatMap.value=g.clearcoatMap,t(g.clearcoatMap,m.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,t(g.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(m.clearcoatNormalMap.value=g.clearcoatNormalMap,t(g.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===sn&&m.clearcoatNormalScale.value.negate())),g.dispersion>0&&(m.dispersion.value=g.dispersion),g.iridescence>0&&(m.iridescence.value=g.iridescence,m.iridescenceIOR.value=g.iridescenceIOR,m.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(m.iridescenceMap.value=g.iridescenceMap,t(g.iridescenceMap,m.iridescenceMapTransform)),g.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=g.iridescenceThicknessMap,t(g.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),g.transmission>0&&(m.transmission.value=g.transmission,m.transmissionSamplerMap.value=y.texture,m.transmissionSamplerSize.value.set(y.width,y.height),g.transmissionMap&&(m.transmissionMap.value=g.transmissionMap,t(g.transmissionMap,m.transmissionMapTransform)),m.thickness.value=g.thickness,g.thicknessMap&&(m.thicknessMap.value=g.thicknessMap,t(g.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=g.attenuationDistance,m.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(m.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(m.anisotropyMap.value=g.anisotropyMap,t(g.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=g.specularIntensity,m.specularColor.value.copy(g.specularColor),g.specularColorMap&&(m.specularColorMap.value=g.specularColorMap,t(g.specularColorMap,m.specularColorMapTransform)),g.specularIntensityMap&&(m.specularIntensityMap.value=g.specularIntensityMap,t(g.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,g){g.matcap&&(m.matcap.value=g.matcap)}function _(m,g){const y=e.get(g).light;m.referencePosition.value.setFromMatrixPosition(y.matrixWorld),m.nearDistance.value=y.shadow.camera.near,m.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function PM(r,e,t,n){let i={},s={},o=[];const a=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,v){const x=v.program;n.uniformBlockBinding(y,x)}function c(y,v){let x=i[y.id];x===void 0&&(p(y),x=h(y),i[y.id]=x,y.addEventListener("dispose",m));const R=v.program;n.updateUBOMapping(y,R);const A=e.render.frame;s[y.id]!==A&&(d(y),s[y.id]=A)}function h(y){const v=u();y.__bindingPointIndex=v;const x=r.createBuffer(),R=y.__size,A=y.usage;return r.bindBuffer(r.UNIFORM_BUFFER,x),r.bufferData(r.UNIFORM_BUFFER,R,A),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,v,x),x}function u(){for(let y=0;y<a;y++)if(o.indexOf(y)===-1)return o.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){const v=i[y.id],x=y.uniforms,R=y.__cache;r.bindBuffer(r.UNIFORM_BUFFER,v);for(let A=0,T=x.length;A<T;A++){const I=Array.isArray(x[A])?x[A]:[x[A]];for(let F=0,M=I.length;F<M;F++){const w=I[F];if(f(w,A,F,R)===!0){const B=w.__offset,z=Array.isArray(w.value)?w.value:[w.value];let q=0;for(let j=0;j<z.length;j++){const k=z[j],$=_(k);typeof k=="number"||typeof k=="boolean"?(w.__data[0]=k,r.bufferSubData(r.UNIFORM_BUFFER,B+q,w.__data)):k.isMatrix3?(w.__data[0]=k.elements[0],w.__data[1]=k.elements[1],w.__data[2]=k.elements[2],w.__data[3]=0,w.__data[4]=k.elements[3],w.__data[5]=k.elements[4],w.__data[6]=k.elements[5],w.__data[7]=0,w.__data[8]=k.elements[6],w.__data[9]=k.elements[7],w.__data[10]=k.elements[8],w.__data[11]=0):(k.toArray(w.__data,q),q+=$.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,B,w.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function f(y,v,x,R){const A=y.value,T=v+"_"+x;if(R[T]===void 0)return typeof A=="number"||typeof A=="boolean"?R[T]=A:R[T]=A.clone(),!0;{const I=R[T];if(typeof A=="number"||typeof A=="boolean"){if(I!==A)return R[T]=A,!0}else if(I.equals(A)===!1)return I.copy(A),!0}return!1}function p(y){const v=y.uniforms;let x=0;const R=16;for(let T=0,I=v.length;T<I;T++){const F=Array.isArray(v[T])?v[T]:[v[T]];for(let M=0,w=F.length;M<w;M++){const B=F[M],z=Array.isArray(B.value)?B.value:[B.value];for(let q=0,j=z.length;q<j;q++){const k=z[q],$=_(k),L=x%R,Q=L%$.boundary,ne=L+Q;x+=Q,ne!==0&&R-ne<$.storage&&(x+=R-ne),B.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),B.__offset=x,x+=$.storage}}}const A=x%R;return A>0&&(x+=R-A),y.__size=x,y.__cache={},this}function _(y){const v={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(v.boundary=4,v.storage=4):y.isVector2?(v.boundary=8,v.storage=8):y.isVector3||y.isColor?(v.boundary=16,v.storage=12):y.isVector4?(v.boundary=16,v.storage=16):y.isMatrix3?(v.boundary=48,v.storage=48):y.isMatrix4?(v.boundary=64,v.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),v}function m(y){const v=y.target;v.removeEventListener("dispose",m);const x=o.indexOf(v.__bindingPointIndex);o.splice(x,1),r.deleteBuffer(i[v.id]),delete i[v.id],delete s[v.id]}function g(){for(const y in i)r.deleteBuffer(i[y]);o=[],i={},s={}}return{bind:l,update:c,dispose:g}}class pm{constructor(e={}){const{canvas:t=em(),context:n=null,depth:i=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=e;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=o;const f=new Uint32Array(4),p=new Int32Array(4);let _=null,m=null;const g=[],y=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Nt,this.toneMapping=bi,this.toneMappingExposure=1;const v=this;let x=!1,R=0,A=0,T=null,I=-1,F=null;const M=new tt,w=new tt;let B=null;const z=new oe(0);let q=0,j=t.width,k=t.height,$=1,L=null,Q=null;const ne=new tt(0,0,j,k),le=new tt(0,0,j,k);let we=!1;const Fe=new Oo;let G=!1,ie=!1;const pe=new Pe,ue=new Pe,Oe=new S,Le=new tt,Ne={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ze=!1;function se(){return T===null?$:1}let P=n;function me(E,D){return t.getContext(E,D)}try{const E={alpha:!0,depth:i,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${zl}`),t.addEventListener("webglcontextlost",re,!1),t.addEventListener("webglcontextrestored",xe,!1),t.addEventListener("webglcontextcreationerror",be,!1),P===null){const D="webgl2";if(P=me(D,E),P===null)throw me(D)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let X,Y,te,ge,ae,C,b,U,Z,K,ee,ve,de,ye,je,he,Te,He,Ge,Ae,Qe,We,pt,N;function Se(){X=new Oy(P),X.init(),We=new dm(P,X),Y=new Py(P,X,e,We),te=new gM(P),Y.reverseDepthBuffer&&te.buffers.depth.setReversed(!0),ge=new ky(P),ae=new iM,C=new SM(P,X,te,ae,Y,We,ge),b=new Ly(v),U=new Uy(v),Z=new X0(P),pt=new Cy(P,Z),K=new Fy(P,Z,ge,pt),ee=new Hy(P,K,Z,ge),Ge=new zy(P,Y,C),he=new Iy(ae),ve=new nM(v,b,U,X,Y,pt,he),de=new RM(v,ae),ye=new rM,je=new uM(X),He=new Ey(v,b,U,te,ee,d,l),Te=new pM(v,ee,Y),N=new PM(P,ge,Y,te),Ae=new Ry(P,X,ge),Qe=new By(P,X,ge),ge.programs=ve.programs,v.capabilities=Y,v.extensions=X,v.properties=ae,v.renderLists=ye,v.shadowMap=Te,v.state=te,v.info=ge}Se();const J=new EM(v,P);this.xr=J,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){const E=X.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=X.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return $},this.setPixelRatio=function(E){E!==void 0&&($=E,this.setSize(j,k,!1))},this.getSize=function(E){return E.set(j,k)},this.setSize=function(E,D,H=!0){if(J.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}j=E,k=D,t.width=Math.floor(E*$),t.height=Math.floor(D*$),H===!0&&(t.style.width=E+"px",t.style.height=D+"px"),this.setViewport(0,0,E,D)},this.getDrawingBufferSize=function(E){return E.set(j*$,k*$).floor()},this.setDrawingBufferSize=function(E,D,H){j=E,k=D,$=H,t.width=Math.floor(E*H),t.height=Math.floor(D*H),this.setViewport(0,0,E,D)},this.getCurrentViewport=function(E){return E.copy(M)},this.getViewport=function(E){return E.copy(ne)},this.setViewport=function(E,D,H,V){E.isVector4?ne.set(E.x,E.y,E.z,E.w):ne.set(E,D,H,V),te.viewport(M.copy(ne).multiplyScalar($).round())},this.getScissor=function(E){return E.copy(le)},this.setScissor=function(E,D,H,V){E.isVector4?le.set(E.x,E.y,E.z,E.w):le.set(E,D,H,V),te.scissor(w.copy(le).multiplyScalar($).round())},this.getScissorTest=function(){return we},this.setScissorTest=function(E){te.setScissorTest(we=E)},this.setOpaqueSort=function(E){L=E},this.setTransparentSort=function(E){Q=E},this.getClearColor=function(E){return E.copy(He.getClearColor())},this.setClearColor=function(){He.setClearColor.apply(He,arguments)},this.getClearAlpha=function(){return He.getClearAlpha()},this.setClearAlpha=function(){He.setClearAlpha.apply(He,arguments)},this.clear=function(E=!0,D=!0,H=!0){let V=0;if(E){let O=!1;if(T!==null){const fe=T.texture.format;O=fe===$l||fe===Kl||fe===No}if(O){const fe=T.texture.type,Me=fe===ai||fe===Ai||fe===Mr||fe===Rs||fe===ql||fe===Xl,Ce=He.getClearColor(),Re=He.getClearAlpha(),Be=Ce.r,ke=Ce.g,De=Ce.b;Me?(f[0]=Be,f[1]=ke,f[2]=De,f[3]=Re,P.clearBufferuiv(P.COLOR,0,f)):(p[0]=Be,p[1]=ke,p[2]=De,p[3]=Re,P.clearBufferiv(P.COLOR,0,p))}else V|=P.COLOR_BUFFER_BIT}D&&(V|=P.DEPTH_BUFFER_BIT,P.clearDepth(this.capabilities.reverseDepthBuffer?0:1)),H&&(V|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",re,!1),t.removeEventListener("webglcontextrestored",xe,!1),t.removeEventListener("webglcontextcreationerror",be,!1),ye.dispose(),je.dispose(),ae.dispose(),b.dispose(),U.dispose(),ee.dispose(),pt.dispose(),N.dispose(),ve.dispose(),J.dispose(),J.removeEventListener("sessionstart",sd),J.removeEventListener("sessionend",rd),es.stop()};function re(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),x=!0}function xe(){console.log("THREE.WebGLRenderer: Context Restored."),x=!1;const E=ge.autoReset,D=Te.enabled,H=Te.autoUpdate,V=Te.needsUpdate,O=Te.type;Se(),ge.autoReset=E,Te.enabled=D,Te.autoUpdate=H,Te.needsUpdate=V,Te.type=O}function be(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function nt(E){const D=E.target;D.removeEventListener("dispose",nt),Pt(D)}function Pt(E){pn(E),ae.remove(E)}function pn(E){const D=ae.get(E).programs;D!==void 0&&(D.forEach(function(H){ve.releaseProgram(H)}),E.isShaderMaterial&&ve.releaseShaderCache(E))}this.renderBufferDirect=function(E,D,H,V,O,fe){D===null&&(D=Ne);const Me=O.isMesh&&O.matrixWorld.determinant()<0,Ce=pg(E,D,H,V,O);te.setMaterial(V,Me);let Re=H.index,Be=1;if(V.wireframe===!0){if(Re=K.getWireframeAttribute(H),Re===void 0)return;Be=2}const ke=H.drawRange,De=H.attributes.position;let lt=ke.start*Be,yt=(ke.start+ke.count)*Be;fe!==null&&(lt=Math.max(lt,fe.start*Be),yt=Math.min(yt,(fe.start+fe.count)*Be)),Re!==null?(lt=Math.max(lt,0),yt=Math.min(yt,Re.count)):De!=null&&(lt=Math.max(lt,0),yt=Math.min(yt,De.count));const wt=yt-lt;if(wt<0||wt===1/0)return;pt.setup(O,V,Ce,H,Re);let wn,ot=Ae;if(Re!==null&&(wn=Z.get(Re),ot=Qe,ot.setIndex(wn)),O.isMesh)V.wireframe===!0?(te.setLineWidth(V.wireframeLinewidth*se()),ot.setMode(P.LINES)):ot.setMode(P.TRIANGLES);else if(O.isLine){let Ue=V.linewidth;Ue===void 0&&(Ue=1),te.setLineWidth(Ue*se()),O.isLineSegments?ot.setMode(P.LINES):O.isLineLoop?ot.setMode(P.LINE_LOOP):ot.setMode(P.LINE_STRIP)}else O.isPoints?ot.setMode(P.POINTS):O.isSprite&&ot.setMode(P.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)ot.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(X.get("WEBGL_multi_draw"))ot.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{const Ue=O._multiDrawStarts,Xt=O._multiDrawCounts,at=O._multiDrawCount,kn=Re?Z.get(Re).bytesPerElement:1,Ws=ae.get(V).currentProgram.getUniforms();for(let Tn=0;Tn<at;Tn++)Ws.setValue(P,"_gl_DrawID",Tn),ot.render(Ue[Tn]/kn,Xt[Tn])}else if(O.isInstancedMesh)ot.renderInstances(lt,wt,O.count);else if(H.isInstancedBufferGeometry){const Ue=H._maxInstanceCount!==void 0?H._maxInstanceCount:1/0,Xt=Math.min(H.instanceCount,Ue);ot.renderInstances(lt,wt,Xt)}else ot.render(lt,wt)};function rt(E,D,H){E.transparent===!0&&E.side===vn&&E.forceSinglePass===!1?(E.side=sn,E.needsUpdate=!0,$o(E,D,H),E.side=oi,E.needsUpdate=!0,$o(E,D,H),E.side=vn):$o(E,D,H)}this.compile=function(E,D,H=null){H===null&&(H=E),m=je.get(H),m.init(D),y.push(m),H.traverseVisible(function(O){O.isLight&&O.layers.test(D.layers)&&(m.pushLight(O),O.castShadow&&m.pushShadow(O))}),E!==H&&E.traverseVisible(function(O){O.isLight&&O.layers.test(D.layers)&&(m.pushLight(O),O.castShadow&&m.pushShadow(O))}),m.setupLights();const V=new Set;return E.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;const fe=O.material;if(fe)if(Array.isArray(fe))for(let Me=0;Me<fe.length;Me++){const Ce=fe[Me];rt(Ce,H,O),V.add(Ce)}else rt(fe,H,O),V.add(fe)}),y.pop(),m=null,V},this.compileAsync=function(E,D,H=null){const V=this.compile(E,D,H);return new Promise(O=>{function fe(){if(V.forEach(function(Me){ae.get(Me).currentProgram.isReady()&&V.delete(Me)}),V.size===0){O(E);return}setTimeout(fe,10)}X.get("KHR_parallel_shader_compile")!==null?fe():setTimeout(fe,10)})};let mn=null;function ui(E){mn&&mn(E)}function sd(){es.stop()}function rd(){es.start()}const es=new am;es.setAnimationLoop(ui),typeof self<"u"&&es.setContext(self),this.setAnimationLoop=function(E){mn=E,J.setAnimationLoop(E),E===null?es.stop():es.start()},J.addEventListener("sessionstart",sd),J.addEventListener("sessionend",rd),this.render=function(E,D){if(D!==void 0&&D.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(x===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),J.enabled===!0&&J.isPresenting===!0&&(J.cameraAutoUpdate===!0&&J.updateCamera(D),D=J.getCamera()),E.isScene===!0&&E.onBeforeRender(v,E,D,T),m=je.get(E,y.length),m.init(D),y.push(m),ue.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),Fe.setFromProjectionMatrix(ue),ie=this.localClippingEnabled,G=he.init(this.clippingPlanes,ie),_=ye.get(E,g.length),_.init(),g.push(_),J.enabled===!0&&J.isPresenting===!0){const fe=v.xr.getDepthSensingMesh();fe!==null&&bc(fe,D,-1/0,v.sortObjects)}bc(E,D,0,v.sortObjects),_.finish(),v.sortObjects===!0&&_.sort(L,Q),ze=J.enabled===!1||J.isPresenting===!1||J.hasDepthSensing()===!1,ze&&He.addToRenderList(_,E),this.info.render.frame++,G===!0&&he.beginShadows();const H=m.state.shadowsArray;Te.render(H,E,D),G===!0&&he.endShadows(),this.info.autoReset===!0&&this.info.reset();const V=_.opaque,O=_.transmissive;if(m.setupLights(),D.isArrayCamera){const fe=D.cameras;if(O.length>0)for(let Me=0,Ce=fe.length;Me<Ce;Me++){const Re=fe[Me];ad(V,O,E,Re)}ze&&He.render(E);for(let Me=0,Ce=fe.length;Me<Ce;Me++){const Re=fe[Me];od(_,E,Re,Re.viewport)}}else O.length>0&&ad(V,O,E,D),ze&&He.render(E),od(_,E,D);T!==null&&(C.updateMultisampleRenderTarget(T),C.updateRenderTargetMipmap(T)),E.isScene===!0&&E.onAfterRender(v,E,D),pt.resetDefaultState(),I=-1,F=null,y.pop(),y.length>0?(m=y[y.length-1],G===!0&&he.setGlobalState(v.clippingPlanes,m.state.camera)):m=null,g.pop(),g.length>0?_=g[g.length-1]:_=null};function bc(E,D,H,V){if(E.visible===!1)return;if(E.layers.test(D.layers)){if(E.isGroup)H=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(D);else if(E.isLight)m.pushLight(E),E.castShadow&&m.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||Fe.intersectsSprite(E)){V&&Le.setFromMatrixPosition(E.matrixWorld).applyMatrix4(ue);const Me=ee.update(E),Ce=E.material;Ce.visible&&_.push(E,Me,Ce,H,Le.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||Fe.intersectsObject(E))){const Me=ee.update(E),Ce=E.material;if(V&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Le.copy(E.boundingSphere.center)):(Me.boundingSphere===null&&Me.computeBoundingSphere(),Le.copy(Me.boundingSphere.center)),Le.applyMatrix4(E.matrixWorld).applyMatrix4(ue)),Array.isArray(Ce)){const Re=Me.groups;for(let Be=0,ke=Re.length;Be<ke;Be++){const De=Re[Be],lt=Ce[De.materialIndex];lt&&lt.visible&&_.push(E,Me,lt,H,Le.z,De)}}else Ce.visible&&_.push(E,Me,Ce,H,Le.z,null)}}const fe=E.children;for(let Me=0,Ce=fe.length;Me<Ce;Me++)bc(fe[Me],D,H,V)}function od(E,D,H,V){const O=E.opaque,fe=E.transmissive,Me=E.transparent;m.setupLightsView(H),G===!0&&he.setGlobalState(v.clippingPlanes,H),V&&te.viewport(M.copy(V)),O.length>0&&Ko(O,D,H),fe.length>0&&Ko(fe,D,H),Me.length>0&&Ko(Me,D,H),te.buffers.depth.setTest(!0),te.buffers.depth.setMask(!0),te.buffers.color.setMask(!0),te.setPolygonOffset(!1)}function ad(E,D,H,V){if((H.isScene===!0?H.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[V.id]===void 0&&(m.state.transmissionRenderTarget[V.id]=new dn(1,1,{generateMipmaps:!0,type:X.has("EXT_color_buffer_half_float")||X.has("EXT_color_buffer_float")?ni:ai,minFilter:Bn,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Je.workingColorSpace}));const fe=m.state.transmissionRenderTarget[V.id],Me=V.viewport||M;fe.setSize(Me.z,Me.w);const Ce=v.getRenderTarget();v.setRenderTarget(fe),v.getClearColor(z),q=v.getClearAlpha(),q<1&&v.setClearColor(16777215,.5),v.clear(),ze&&He.render(H);const Re=v.toneMapping;v.toneMapping=bi;const Be=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),m.setupLightsView(V),G===!0&&he.setGlobalState(v.clippingPlanes,V),Ko(E,H,V),C.updateMultisampleRenderTarget(fe),C.updateRenderTargetMipmap(fe),X.has("WEBGL_multisampled_render_to_texture")===!1){let ke=!1;for(let De=0,lt=D.length;De<lt;De++){const yt=D[De],wt=yt.object,wn=yt.geometry,ot=yt.material,Ue=yt.group;if(ot.side===vn&&wt.layers.test(V.layers)){const Xt=ot.side;ot.side=sn,ot.needsUpdate=!0,ld(wt,H,V,wn,ot,Ue),ot.side=Xt,ot.needsUpdate=!0,ke=!0}}ke===!0&&(C.updateMultisampleRenderTarget(fe),C.updateRenderTargetMipmap(fe))}v.setRenderTarget(Ce),v.setClearColor(z,q),Be!==void 0&&(V.viewport=Be),v.toneMapping=Re}function Ko(E,D,H){const V=D.isScene===!0?D.overrideMaterial:null;for(let O=0,fe=E.length;O<fe;O++){const Me=E[O],Ce=Me.object,Re=Me.geometry,Be=V===null?Me.material:V,ke=Me.group;Ce.layers.test(H.layers)&&ld(Ce,D,H,Re,Be,ke)}}function ld(E,D,H,V,O,fe){E.onBeforeRender(v,D,H,V,O,fe),E.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),O.onBeforeRender(v,D,H,V,E,fe),O.transparent===!0&&O.side===vn&&O.forceSinglePass===!1?(O.side=sn,O.needsUpdate=!0,v.renderBufferDirect(H,D,V,O,E,fe),O.side=oi,O.needsUpdate=!0,v.renderBufferDirect(H,D,V,O,E,fe),O.side=vn):v.renderBufferDirect(H,D,V,O,E,fe),E.onAfterRender(v,D,H,V,O,fe)}function $o(E,D,H){D.isScene!==!0&&(D=Ne);const V=ae.get(E),O=m.state.lights,fe=m.state.shadowsArray,Me=O.state.version,Ce=ve.getParameters(E,O.state,fe,D,H),Re=ve.getProgramCacheKey(Ce);let Be=V.programs;V.environment=E.isMeshStandardMaterial?D.environment:null,V.fog=D.fog,V.envMap=(E.isMeshStandardMaterial?U:b).get(E.envMap||V.environment),V.envMapRotation=V.environment!==null&&E.envMap===null?D.environmentRotation:E.envMapRotation,Be===void 0&&(E.addEventListener("dispose",nt),Be=new Map,V.programs=Be);let ke=Be.get(Re);if(ke!==void 0){if(V.currentProgram===ke&&V.lightsStateVersion===Me)return hd(E,Ce),ke}else Ce.uniforms=ve.getUniforms(E),E.onBeforeCompile(Ce,v),ke=ve.acquireProgram(Ce,Re),Be.set(Re,ke),V.uniforms=Ce.uniforms;const De=V.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(De.clippingPlanes=he.uniform),hd(E,Ce),V.needsLights=gg(E),V.lightsStateVersion=Me,V.needsLights&&(De.ambientLightColor.value=O.state.ambient,De.lightProbe.value=O.state.probe,De.directionalLights.value=O.state.directional,De.directionalLightShadows.value=O.state.directionalShadow,De.spotLights.value=O.state.spot,De.spotLightShadows.value=O.state.spotShadow,De.rectAreaLights.value=O.state.rectArea,De.ltc_1.value=O.state.rectAreaLTC1,De.ltc_2.value=O.state.rectAreaLTC2,De.pointLights.value=O.state.point,De.pointLightShadows.value=O.state.pointShadow,De.hemisphereLights.value=O.state.hemi,De.directionalShadowMap.value=O.state.directionalShadowMap,De.directionalShadowMatrix.value=O.state.directionalShadowMatrix,De.spotShadowMap.value=O.state.spotShadowMap,De.spotLightMatrix.value=O.state.spotLightMatrix,De.spotLightMap.value=O.state.spotLightMap,De.pointShadowMap.value=O.state.pointShadowMap,De.pointShadowMatrix.value=O.state.pointShadowMatrix),V.currentProgram=ke,V.uniformsList=null,ke}function cd(E){if(E.uniformsList===null){const D=E.currentProgram.getUniforms();E.uniformsList=Ya.seqWithValue(D.seq,E.uniforms)}return E.uniformsList}function hd(E,D){const H=ae.get(E);H.outputColorSpace=D.outputColorSpace,H.batching=D.batching,H.batchingColor=D.batchingColor,H.instancing=D.instancing,H.instancingColor=D.instancingColor,H.instancingMorph=D.instancingMorph,H.skinning=D.skinning,H.morphTargets=D.morphTargets,H.morphNormals=D.morphNormals,H.morphColors=D.morphColors,H.morphTargetsCount=D.morphTargetsCount,H.numClippingPlanes=D.numClippingPlanes,H.numIntersection=D.numClipIntersection,H.vertexAlphas=D.vertexAlphas,H.vertexTangents=D.vertexTangents,H.toneMapping=D.toneMapping}function pg(E,D,H,V,O){D.isScene!==!0&&(D=Ne),C.resetTextureUnits();const fe=D.fog,Me=V.isMeshStandardMaterial?D.environment:null,Ce=T===null?v.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:qt,Re=(V.isMeshStandardMaterial?U:b).get(V.envMap||Me),Be=V.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,ke=!!H.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),De=!!H.morphAttributes.position,lt=!!H.morphAttributes.normal,yt=!!H.morphAttributes.color;let wt=bi;V.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(wt=v.toneMapping);const wn=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,ot=wn!==void 0?wn.length:0,Ue=ae.get(V),Xt=m.state.lights;if(G===!0&&(ie===!0||E!==F)){const Un=E===F&&V.id===I;he.setState(V,E,Un)}let at=!1;V.version===Ue.__version?(Ue.needsLights&&Ue.lightsStateVersion!==Xt.state.version||Ue.outputColorSpace!==Ce||O.isBatchedMesh&&Ue.batching===!1||!O.isBatchedMesh&&Ue.batching===!0||O.isBatchedMesh&&Ue.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&Ue.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&Ue.instancing===!1||!O.isInstancedMesh&&Ue.instancing===!0||O.isSkinnedMesh&&Ue.skinning===!1||!O.isSkinnedMesh&&Ue.skinning===!0||O.isInstancedMesh&&Ue.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Ue.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&Ue.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&Ue.instancingMorph===!1&&O.morphTexture!==null||Ue.envMap!==Re||V.fog===!0&&Ue.fog!==fe||Ue.numClippingPlanes!==void 0&&(Ue.numClippingPlanes!==he.numPlanes||Ue.numIntersection!==he.numIntersection)||Ue.vertexAlphas!==Be||Ue.vertexTangents!==ke||Ue.morphTargets!==De||Ue.morphNormals!==lt||Ue.morphColors!==yt||Ue.toneMapping!==wt||Ue.morphTargetsCount!==ot)&&(at=!0):(at=!0,Ue.__version=V.version);let kn=Ue.currentProgram;at===!0&&(kn=$o(V,D,O));let Ws=!1,Tn=!1,wc=!1;const Ct=kn.getUniforms(),Ii=Ue.uniforms;if(te.useProgram(kn.program)&&(Ws=!0,Tn=!0,wc=!0),V.id!==I&&(I=V.id,Tn=!0),Ws||F!==E){Y.reverseDepthBuffer?(pe.copy(E.projectionMatrix),g0(pe),_0(pe),Ct.setValue(P,"projectionMatrix",pe)):Ct.setValue(P,"projectionMatrix",E.projectionMatrix),Ct.setValue(P,"viewMatrix",E.matrixWorldInverse);const Un=Ct.map.cameraPosition;Un!==void 0&&Un.setValue(P,Oe.setFromMatrixPosition(E.matrixWorld)),Y.logarithmicDepthBuffer&&Ct.setValue(P,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&Ct.setValue(P,"isOrthographic",E.isOrthographicCamera===!0),F!==E&&(F=E,Tn=!0,wc=!0)}if(O.isSkinnedMesh){Ct.setOptional(P,O,"bindMatrix"),Ct.setOptional(P,O,"bindMatrixInverse");const Un=O.skeleton;Un&&(Un.boneTexture===null&&Un.computeBoneTexture(),Ct.setValue(P,"boneTexture",Un.boneTexture,C))}O.isBatchedMesh&&(Ct.setOptional(P,O,"batchingTexture"),Ct.setValue(P,"batchingTexture",O._matricesTexture,C),Ct.setOptional(P,O,"batchingIdTexture"),Ct.setValue(P,"batchingIdTexture",O._indirectTexture,C),Ct.setOptional(P,O,"batchingColorTexture"),O._colorsTexture!==null&&Ct.setValue(P,"batchingColorTexture",O._colorsTexture,C));const Tc=H.morphAttributes;if((Tc.position!==void 0||Tc.normal!==void 0||Tc.color!==void 0)&&Ge.update(O,H,kn),(Tn||Ue.receiveShadow!==O.receiveShadow)&&(Ue.receiveShadow=O.receiveShadow,Ct.setValue(P,"receiveShadow",O.receiveShadow)),V.isMeshGouraudMaterial&&V.envMap!==null&&(Ii.envMap.value=Re,Ii.flipEnvMap.value=Re.isCubeTexture&&Re.isRenderTargetTexture===!1?-1:1),V.isMeshStandardMaterial&&V.envMap===null&&D.environment!==null&&(Ii.envMapIntensity.value=D.environmentIntensity),Tn&&(Ct.setValue(P,"toneMappingExposure",v.toneMappingExposure),Ue.needsLights&&mg(Ii,wc),fe&&V.fog===!0&&de.refreshFogUniforms(Ii,fe),de.refreshMaterialUniforms(Ii,V,$,k,m.state.transmissionRenderTarget[E.id]),Ya.upload(P,cd(Ue),Ii,C)),V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(Ya.upload(P,cd(Ue),Ii,C),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&Ct.setValue(P,"center",O.center),Ct.setValue(P,"modelViewMatrix",O.modelViewMatrix),Ct.setValue(P,"normalMatrix",O.normalMatrix),Ct.setValue(P,"modelMatrix",O.matrixWorld),V.isShaderMaterial||V.isRawShaderMaterial){const Un=V.uniformsGroups;for(let Ac=0,_g=Un.length;Ac<_g;Ac++){const ud=Un[Ac];N.update(ud,kn),N.bind(ud,kn)}}return kn}function mg(E,D){E.ambientLightColor.needsUpdate=D,E.lightProbe.needsUpdate=D,E.directionalLights.needsUpdate=D,E.directionalLightShadows.needsUpdate=D,E.pointLights.needsUpdate=D,E.pointLightShadows.needsUpdate=D,E.spotLights.needsUpdate=D,E.spotLightShadows.needsUpdate=D,E.rectAreaLights.needsUpdate=D,E.hemisphereLights.needsUpdate=D}function gg(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(E,D,H){ae.get(E.texture).__webglTexture=D,ae.get(E.depthTexture).__webglTexture=H;const V=ae.get(E);V.__hasExternalTextures=!0,V.__autoAllocateDepthBuffer=H===void 0,V.__autoAllocateDepthBuffer||X.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),V.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,D){const H=ae.get(E);H.__webglFramebuffer=D,H.__useDefaultFramebuffer=D===void 0},this.setRenderTarget=function(E,D=0,H=0){T=E,R=D,A=H;let V=!0,O=null,fe=!1,Me=!1;if(E){const Re=ae.get(E);if(Re.__useDefaultFramebuffer!==void 0)te.bindFramebuffer(P.FRAMEBUFFER,null),V=!1;else if(Re.__webglFramebuffer===void 0)C.setupRenderTarget(E);else if(Re.__hasExternalTextures)C.rebindTextures(E,ae.get(E.texture).__webglTexture,ae.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const De=E.depthTexture;if(Re.__boundDepthTexture!==De){if(De!==null&&ae.has(De)&&(E.width!==De.image.width||E.height!==De.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");C.setupDepthRenderbuffer(E)}}const Be=E.texture;(Be.isData3DTexture||Be.isDataArrayTexture||Be.isCompressedArrayTexture)&&(Me=!0);const ke=ae.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(ke[D])?O=ke[D][H]:O=ke[D],fe=!0):E.samples>0&&C.useMultisampledRTT(E)===!1?O=ae.get(E).__webglMultisampledFramebuffer:Array.isArray(ke)?O=ke[H]:O=ke,M.copy(E.viewport),w.copy(E.scissor),B=E.scissorTest}else M.copy(ne).multiplyScalar($).floor(),w.copy(le).multiplyScalar($).floor(),B=we;if(te.bindFramebuffer(P.FRAMEBUFFER,O)&&V&&te.drawBuffers(E,O),te.viewport(M),te.scissor(w),te.setScissorTest(B),fe){const Re=ae.get(E.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+D,Re.__webglTexture,H)}else if(Me){const Re=ae.get(E.texture),Be=D||0;P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,Re.__webglTexture,H||0,Be)}I=-1},this.readRenderTargetPixels=function(E,D,H,V,O,fe,Me){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ce=ae.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Me!==void 0&&(Ce=Ce[Me]),Ce){te.bindFramebuffer(P.FRAMEBUFFER,Ce);try{const Re=E.texture,Be=Re.format,ke=Re.type;if(!Y.textureFormatReadable(Be)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Y.textureTypeReadable(ke)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=E.width-V&&H>=0&&H<=E.height-O&&P.readPixels(D,H,V,O,We.convert(Be),We.convert(ke),fe)}finally{const Re=T!==null?ae.get(T).__webglFramebuffer:null;te.bindFramebuffer(P.FRAMEBUFFER,Re)}}},this.readRenderTargetPixelsAsync=async function(E,D,H,V,O,fe,Me){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ce=ae.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Me!==void 0&&(Ce=Ce[Me]),Ce){const Re=E.texture,Be=Re.format,ke=Re.type;if(!Y.textureFormatReadable(Be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Y.textureTypeReadable(ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(D>=0&&D<=E.width-V&&H>=0&&H<=E.height-O){te.bindFramebuffer(P.FRAMEBUFFER,Ce);const De=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,De),P.bufferData(P.PIXEL_PACK_BUFFER,fe.byteLength,P.STREAM_READ),P.readPixels(D,H,V,O,We.convert(Be),We.convert(ke),0);const lt=T!==null?ae.get(T).__webglFramebuffer:null;te.bindFramebuffer(P.FRAMEBUFFER,lt);const yt=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await m0(P,yt,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,De),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,fe),P.deleteBuffer(De),P.deleteSync(yt),fe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,D=null,H=0){E.isTexture!==!0&&(Xa("WebGLRenderer: copyFramebufferToTexture function signature has changed."),D=arguments[0]||null,E=arguments[1]);const V=Math.pow(2,-H),O=Math.floor(E.image.width*V),fe=Math.floor(E.image.height*V),Me=D!==null?D.x:0,Ce=D!==null?D.y:0;C.setTexture2D(E,0),P.copyTexSubImage2D(P.TEXTURE_2D,H,0,0,Me,Ce,O,fe),te.unbindTexture()},this.copyTextureToTexture=function(E,D,H=null,V=null,O=0){E.isTexture!==!0&&(Xa("WebGLRenderer: copyTextureToTexture function signature has changed."),V=arguments[0]||null,E=arguments[1],D=arguments[2],O=arguments[3]||0,H=null);let fe,Me,Ce,Re,Be,ke;H!==null?(fe=H.max.x-H.min.x,Me=H.max.y-H.min.y,Ce=H.min.x,Re=H.min.y):(fe=E.image.width,Me=E.image.height,Ce=0,Re=0),V!==null?(Be=V.x,ke=V.y):(Be=0,ke=0);const De=We.convert(D.format),lt=We.convert(D.type);C.setTexture2D(D,0),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,D.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,D.unpackAlignment);const yt=P.getParameter(P.UNPACK_ROW_LENGTH),wt=P.getParameter(P.UNPACK_IMAGE_HEIGHT),wn=P.getParameter(P.UNPACK_SKIP_PIXELS),ot=P.getParameter(P.UNPACK_SKIP_ROWS),Ue=P.getParameter(P.UNPACK_SKIP_IMAGES),Xt=E.isCompressedTexture?E.mipmaps[O]:E.image;P.pixelStorei(P.UNPACK_ROW_LENGTH,Xt.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,Xt.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Ce),P.pixelStorei(P.UNPACK_SKIP_ROWS,Re),E.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,O,Be,ke,fe,Me,De,lt,Xt.data):E.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,O,Be,ke,Xt.width,Xt.height,De,Xt.data):P.texSubImage2D(P.TEXTURE_2D,O,Be,ke,fe,Me,De,lt,Xt),P.pixelStorei(P.UNPACK_ROW_LENGTH,yt),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,wt),P.pixelStorei(P.UNPACK_SKIP_PIXELS,wn),P.pixelStorei(P.UNPACK_SKIP_ROWS,ot),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Ue),O===0&&D.generateMipmaps&&P.generateMipmap(P.TEXTURE_2D),te.unbindTexture()},this.copyTextureToTexture3D=function(E,D,H=null,V=null,O=0){E.isTexture!==!0&&(Xa("WebGLRenderer: copyTextureToTexture3D function signature has changed."),H=arguments[0]||null,V=arguments[1]||null,E=arguments[2],D=arguments[3],O=arguments[4]||0);let fe,Me,Ce,Re,Be,ke,De,lt,yt;const wt=E.isCompressedTexture?E.mipmaps[O]:E.image;H!==null?(fe=H.max.x-H.min.x,Me=H.max.y-H.min.y,Ce=H.max.z-H.min.z,Re=H.min.x,Be=H.min.y,ke=H.min.z):(fe=wt.width,Me=wt.height,Ce=wt.depth,Re=0,Be=0,ke=0),V!==null?(De=V.x,lt=V.y,yt=V.z):(De=0,lt=0,yt=0);const wn=We.convert(D.format),ot=We.convert(D.type);let Ue;if(D.isData3DTexture)C.setTexture3D(D,0),Ue=P.TEXTURE_3D;else if(D.isDataArrayTexture||D.isCompressedArrayTexture)C.setTexture2DArray(D,0),Ue=P.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,D.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,D.unpackAlignment);const Xt=P.getParameter(P.UNPACK_ROW_LENGTH),at=P.getParameter(P.UNPACK_IMAGE_HEIGHT),kn=P.getParameter(P.UNPACK_SKIP_PIXELS),Ws=P.getParameter(P.UNPACK_SKIP_ROWS),Tn=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,wt.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,wt.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Re),P.pixelStorei(P.UNPACK_SKIP_ROWS,Be),P.pixelStorei(P.UNPACK_SKIP_IMAGES,ke),E.isDataTexture||E.isData3DTexture?P.texSubImage3D(Ue,O,De,lt,yt,fe,Me,Ce,wn,ot,wt.data):D.isCompressedArrayTexture?P.compressedTexSubImage3D(Ue,O,De,lt,yt,fe,Me,Ce,wn,wt.data):P.texSubImage3D(Ue,O,De,lt,yt,fe,Me,Ce,wn,ot,wt),P.pixelStorei(P.UNPACK_ROW_LENGTH,Xt),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,at),P.pixelStorei(P.UNPACK_SKIP_PIXELS,kn),P.pixelStorei(P.UNPACK_SKIP_ROWS,Ws),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Tn),O===0&&D.generateMipmaps&&P.generateMipmap(Ue),te.unbindTexture()},this.initRenderTarget=function(E){ae.get(E).__webglFramebuffer===void 0&&C.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?C.setTextureCube(E,0):E.isData3DTexture?C.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?C.setTexture2DArray(E,0):C.setTexture2D(E,0),te.unbindTexture()},this.resetState=function(){R=0,A=0,T=null,te.reset(),pt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ei}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===Jl?"display-p3":"srgb",t.unpackColorSpace=Je.workingColorSpace===Do?"display-p3":"srgb"}}class Fo{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new oe(e),this.density=t}clone(){return new Fo(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class nc{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new oe(e),this.near=t,this.far=n}clone(){return new nc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Cu extends Ze{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Zt,this.environmentIntensity=1,this.environmentRotation=new Zt,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Bo{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=yo,this.updateRanges=[],this.version=0,this.uuid=Ln()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,s=this.stride;i<s;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ln()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ln()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const on=new S;class Zi{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)on.fromBufferAttribute(this,t),on.applyMatrix4(e),this.setXYZ(t,on.x,on.y,on.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)on.fromBufferAttribute(this,t),on.applyNormalMatrix(e),this.setXYZ(t,on.x,on.y,on.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)on.fromBufferAttribute(this,t),on.transformDirection(e),this.setXYZ(t,on.x,on.y,on.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=cn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Xe(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=Xe(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Xe(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Xe(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Xe(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=cn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=cn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=cn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=cn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Xe(t,this.array),n=Xe(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Xe(t,this.array),n=Xe(n,this.array),i=Xe(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Xe(t,this.array),n=Xe(n,this.array),i=Xe(i,this.array),s=Xe(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return new st(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Zi(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Ru extends Bt{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new oe(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let sr;const Wr=new S,rr=new S,or=new S,ar=new W,qr=new W,mm=new Pe,ga=new S,Xr=new S,_a=new S,jd=new W,th=new W,Qd=new W;class gm extends Ze{constructor(e=new Ru){if(super(),this.isSprite=!0,this.type="Sprite",sr===void 0){sr=new Ve;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Bo(t,5);sr.setIndex([0,1,2,0,2,3]),sr.setAttribute("position",new Zi(n,3,0,!1)),sr.setAttribute("uv",new Zi(n,2,3,!1))}this.geometry=sr,this.material=e,this.center=new W(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),rr.setFromMatrixScale(this.matrixWorld),mm.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),or.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&rr.multiplyScalar(-or.z);const n=this.material.rotation;let i,s;n!==0&&(s=Math.cos(n),i=Math.sin(n));const o=this.center;va(ga.set(-.5,-.5,0),or,o,rr,i,s),va(Xr.set(.5,-.5,0),or,o,rr,i,s),va(_a.set(.5,.5,0),or,o,rr,i,s),jd.set(0,0),th.set(1,0),Qd.set(1,1);let a=e.ray.intersectTriangle(ga,Xr,_a,!1,Wr);if(a===null&&(va(Xr.set(-.5,.5,0),or,o,rr,i,s),th.set(0,1),a=e.ray.intersectTriangle(ga,_a,Xr,!1,Wr),a===null))return;const l=e.ray.origin.distanceTo(Wr);l<e.near||l>e.far||t.push({distance:l,point:Wr.clone(),uv:yn.getInterpolation(Wr,ga,Xr,_a,jd,th,Qd,new W),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function va(r,e,t,n,i,s){ar.subVectors(r,t).addScalar(.5).multiply(n),i!==void 0?(qr.x=s*ar.x-i*ar.y,qr.y=i*ar.x+s*ar.y):qr.copy(ar),r.copy(e),r.x+=qr.x,r.y+=qr.y,r.applyMatrix4(mm)}const ya=new S,ef=new S;class _m extends Ze{constructor(){super(),this._currentLevel=0,this.type="LOD",Object.defineProperties(this,{levels:{enumerable:!0,value:[]},isLOD:{value:!0}}),this.autoUpdate=!0}copy(e){super.copy(e,!1);const t=e.levels;for(let n=0,i=t.length;n<i;n++){const s=t[n];this.addLevel(s.object.clone(),s.distance,s.hysteresis)}return this.autoUpdate=e.autoUpdate,this}addLevel(e,t=0,n=0){t=Math.abs(t);const i=this.levels;let s;for(s=0;s<i.length&&!(t<i[s].distance);s++);return i.splice(s,0,{distance:t,hysteresis:n,object:e}),this.add(e),this}removeLevel(e){const t=this.levels;for(let n=0;n<t.length;n++)if(t[n].distance===e){const i=t.splice(n,1);return this.remove(i[0].object),!0}return!1}getCurrentLevel(){return this._currentLevel}getObjectForDistance(e){const t=this.levels;if(t.length>0){let n,i;for(n=1,i=t.length;n<i;n++){let s=t[n].distance;if(t[n].object.visible&&(s-=s*t[n].hysteresis),e<s)break}return t[n-1].object}return null}raycast(e,t){if(this.levels.length>0){ya.setFromMatrixPosition(this.matrixWorld);const i=e.ray.origin.distanceTo(ya);this.getObjectForDistance(i).raycast(e,t)}}update(e){const t=this.levels;if(t.length>1){ya.setFromMatrixPosition(e.matrixWorld),ef.setFromMatrixPosition(this.matrixWorld);const n=ya.distanceTo(ef)/e.zoom;t[0].object.visible=!0;let i,s;for(i=1,s=t.length;i<s;i++){let o=t[i].distance;if(t[i].object.visible&&(o-=o*t[i].hysteresis),n>=o)t[i-1].object.visible=!1,t[i].object.visible=!0;else break}for(this._currentLevel=i-1;i<s;i++)t[i].object.visible=!1}}toJSON(e){const t=super.toJSON(e);this.autoUpdate===!1&&(t.object.autoUpdate=!1),t.object.levels=[];const n=this.levels;for(let i=0,s=n.length;i<s;i++){const o=n[i];t.object.levels.push({object:o.object.uuid,distance:o.distance,hysteresis:o.hysteresis})}return t}}const tf=new S,nf=new tt,sf=new tt,IM=new S,rf=new Pe,xa=new S,nh=new $t,of=new Pe,ih=new Ir;class Pu extends ce{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Oh,this.bindMatrix=new Pe,this.bindMatrixInverse=new Pe,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Kt),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,xa),this.boundingBox.expandByPoint(xa)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new $t),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,xa),this.boundingSphere.expandByPoint(xa)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),nh.copy(this.boundingSphere),nh.applyMatrix4(i),e.ray.intersectsSphere(nh)!==!1&&(of.copy(i).invert(),ih.copy(e.ray).applyMatrix4(of),!(this.boundingBox!==null&&ih.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,ih)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new tt,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);const s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Oh?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Bp?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,i=this.geometry;nf.fromBufferAttribute(i.attributes.skinIndex,e),sf.fromBufferAttribute(i.attributes.skinWeight,e),tf.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let s=0;s<4;s++){const o=sf.getComponent(s);if(o!==0){const a=nf.getComponent(s);rf.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(IM.copy(tf).applyMatrix4(rf),o)}}return t.applyMatrix4(this.bindMatrixInverse)}}class ic extends Ze{constructor(){super(),this.isBone=!0,this.type="Bone"}}class ii extends St{constructor(e=null,t=1,n=1,i,s,o,a,l,c=Ut,h=Ut,u,d){super(null,o,a,l,c,h,i,s,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const af=new Pe,LM=new Pe;class ko{constructor(e=[],t=[]){this.uuid=Ln(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Pe)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new Pe;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let s=0,o=e.length;s<o;s++){const a=e[s]?e[s].matrixWorld:LM;af.multiplyMatrices(a,t[s]),af.toArray(n,s*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new ko(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new ii(t,e,e,un,Mn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){const s=e.bones[n];let o=t[s];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",s),o=new ic),this.bones.push(o),this.boneInverses.push(new Pe().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let i=0,s=t.length;i<s;i++){const o=t[i];e.bones.push(o.uuid);const a=n[i];e.boneInverses.push(a.toArray())}return e}}class Ls extends st{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const lr=new Pe,lf=new Pe,Ma=[],cf=new Kt,NM=new Pe,Yr=new ce,Kr=new $t;class So extends ce{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Ls(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,NM)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Kt),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,lr),cf.copy(e.boundingBox).applyMatrix4(lr),this.boundingBox.union(cf)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new $t),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,lr),Kr.copy(e.boundingSphere).applyMatrix4(lr),this.boundingSphere.union(Kr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,s=n.length+1,o=e*s+1;for(let a=0;a<n.length;a++)n[a]=i[o+a]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(Yr.geometry=this.geometry,Yr.material=this.material,Yr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Kr.copy(this.boundingSphere),Kr.applyMatrix4(n),e.ray.intersectsSphere(Kr)!==!1))for(let s=0;s<i;s++){this.getMatrixAt(s,lr),lf.multiplyMatrices(n,lr),Yr.matrixWorld=lf,Yr.raycast(e,Ma);for(let o=0,a=Ma.length;o<a;o++){const l=Ma[o];l.instanceId=s,l.object=this,t.push(l)}Ma.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Ls(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new ii(new Float32Array(i*this.count),i,this.count,Yl,Mn));const s=this.morphTexture.source.data.data;let o=0;for(let c=0;c<n.length;c++)o+=n[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=i*e;s[l]=a,s.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}function DM(r,e){return r.z-e.z}function UM(r,e){return e.z-r.z}class OM{constructor(){this.index=0,this.pool=[],this.list=[]}push(e,t,n){const i=this.pool,s=this.list;this.index>=i.length&&i.push({start:-1,count:-1,z:-1,index:-1});const o=i[this.index];s.push(o),this.index++,o.start=e.start,o.count=e.count,o.z=t,o.index=n}reset(){this.list.length=0,this.index=0}}const Bi=new Pe,sh=new Pe,FM=new Pe,BM=new oe(1,1,1),hf=new Pe,rh=new Oo,Sa=new Kt,as=new $t,$r=new S,uf=new S,kM=new S,oh=new OM,en=new ce,ba=[];function zM(r,e,t=0){const n=e.itemSize;if(r.isInterleavedBufferAttribute||r.array.constructor!==e.array.constructor){const i=r.count;for(let s=0;s<i;s++)for(let o=0;o<n;o++)e.setComponent(s+t,o,r.getComponent(s,o))}else e.array.set(r.array,t*n);e.needsUpdate=!0}class vm extends ce{get maxInstanceCount(){return this._maxInstanceCount}constructor(e,t,n=t*2,i){super(new Ve,i),this.isBatchedMesh=!0,this.perObjectFrustumCulled=!0,this.sortObjects=!0,this.boundingBox=null,this.boundingSphere=null,this.customSort=null,this._drawInfo=[],this._availableInstanceIds=[],this._drawRanges=[],this._reservedRanges=[],this._bounds=[],this._maxInstanceCount=e,this._maxVertexCount=t,this._maxIndexCount=n,this._geometryInitialized=!1,this._geometryCount=0,this._multiDrawCounts=new Int32Array(e),this._multiDrawStarts=new Int32Array(e),this._multiDrawCount=0,this._multiDrawInstances=null,this._visibilityChanged=!0,this._matricesTexture=null,this._indirectTexture=null,this._colorsTexture=null,this._initMatricesTexture(),this._initIndirectTexture()}_initMatricesTexture(){let e=Math.sqrt(this._maxInstanceCount*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4),n=new ii(t,e,e,un,Mn);this._matricesTexture=n}_initIndirectTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);const t=new Uint32Array(e*e),n=new ii(t,e,e,No,Ai);this._indirectTexture=n}_initColorsTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);const t=new Float32Array(e*e*4).fill(1),n=new ii(t,e,e,un,Mn);n.colorSpace=Je.workingColorSpace,this._colorsTexture=n}_initializeGeometry(e){const t=this.geometry,n=this._maxVertexCount,i=this._maxIndexCount;if(this._geometryInitialized===!1){for(const s in e.attributes){const o=e.getAttribute(s),{array:a,itemSize:l,normalized:c}=o,h=new a.constructor(n*l),u=new st(h,l,c);t.setAttribute(s,u)}if(e.getIndex()!==null){const s=n>65535?new Uint32Array(i):new Uint16Array(i);t.setIndex(new st(s,1))}this._geometryInitialized=!0}}_validateGeometry(e){const t=this.geometry;if(!!e.getIndex()!=!!t.getIndex())throw new Error('BatchedMesh: All geometries must consistently have "index".');for(const n in t.attributes){if(!e.hasAttribute(n))throw new Error(`BatchedMesh: Added geometry missing "${n}". All geometries must have consistent attributes.`);const i=e.getAttribute(n),s=t.getAttribute(n);if(i.itemSize!==s.itemSize||i.normalized!==s.normalized)throw new Error("BatchedMesh: All attributes must have a consistent itemSize and normalized value.")}}setCustomSort(e){return this.customSort=e,this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Kt);const e=this.boundingBox,t=this._drawInfo;e.makeEmpty();for(let n=0,i=t.length;n<i;n++){if(t[n].active===!1)continue;const s=t[n].geometryIndex;this.getMatrixAt(n,Bi),this.getBoundingBoxAt(s,Sa).applyMatrix4(Bi),e.union(Sa)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new $t);const e=this.boundingSphere,t=this._drawInfo;e.makeEmpty();for(let n=0,i=t.length;n<i;n++){if(t[n].active===!1)continue;const s=t[n].geometryIndex;this.getMatrixAt(n,Bi),this.getBoundingSphereAt(s,as).applyMatrix4(Bi),e.union(as)}}addInstance(e){if(this._drawInfo.length>=this.maxInstanceCount&&this._availableInstanceIds.length===0)throw new Error("BatchedMesh: Maximum item count reached.");const n={visible:!0,active:!0,geometryIndex:e};let i=null;this._availableInstanceIds.length>0?(i=this._availableInstanceIds.pop(),this._drawInfo[i]=n):(i=this._drawInfo.length,this._drawInfo.push(n));const s=this._matricesTexture,o=s.image.data;FM.toArray(o,i*16),s.needsUpdate=!0;const a=this._colorsTexture;return a&&(BM.toArray(a.image.data,i*4),a.needsUpdate=!0),i}addGeometry(e,t=-1,n=-1){if(this._initializeGeometry(e),this._validateGeometry(e),this._drawInfo.length>=this._maxInstanceCount)throw new Error("BatchedMesh: Maximum item count reached.");const i={vertexStart:-1,vertexCount:-1,indexStart:-1,indexCount:-1};let s=null;const o=this._reservedRanges,a=this._drawRanges,l=this._bounds;this._geometryCount!==0&&(s=o[o.length-1]),t===-1?i.vertexCount=e.getAttribute("position").count:i.vertexCount=t,s===null?i.vertexStart=0:i.vertexStart=s.vertexStart+s.vertexCount;const c=e.getIndex(),h=c!==null;if(h&&(n===-1?i.indexCount=c.count:i.indexCount=n,s===null?i.indexStart=0:i.indexStart=s.indexStart+s.indexCount),i.indexStart!==-1&&i.indexStart+i.indexCount>this._maxIndexCount||i.vertexStart+i.vertexCount>this._maxVertexCount)throw new Error("BatchedMesh: Reserved space request exceeds the maximum buffer size.");const u=this._geometryCount;return this._geometryCount++,o.push(i),a.push({start:h?i.indexStart:i.vertexStart,count:-1}),l.push({boxInitialized:!1,box:new Kt,sphereInitialized:!1,sphere:new $t}),this.setGeometryAt(u,e),u}setGeometryAt(e,t){if(e>=this._geometryCount)throw new Error("BatchedMesh: Maximum geometry count reached.");this._validateGeometry(t);const n=this.geometry,i=n.getIndex()!==null,s=n.getIndex(),o=t.getIndex(),a=this._reservedRanges[e];if(i&&o.count>a.indexCount||t.attributes.position.count>a.vertexCount)throw new Error("BatchedMesh: Reserved space not large enough for provided geometry.");const l=a.vertexStart,c=a.vertexCount;for(const f in n.attributes){const p=t.getAttribute(f),_=n.getAttribute(f);zM(p,_,l);const m=p.itemSize;for(let g=p.count,y=c;g<y;g++){const v=l+g;for(let x=0;x<m;x++)_.setComponent(v,x,0)}_.needsUpdate=!0,_.addUpdateRange(l*m,c*m)}if(i){const f=a.indexStart;for(let p=0;p<o.count;p++)s.setX(f+p,l+o.getX(p));for(let p=o.count,_=a.indexCount;p<_;p++)s.setX(f+p,l);s.needsUpdate=!0,s.addUpdateRange(f,a.indexCount)}const h=this._bounds[e];t.boundingBox!==null?(h.box.copy(t.boundingBox),h.boxInitialized=!0):h.boxInitialized=!1,t.boundingSphere!==null?(h.sphere.copy(t.boundingSphere),h.sphereInitialized=!0):h.sphereInitialized=!1;const u=this._drawRanges[e],d=t.getAttribute("position");return u.count=i?o.count:d.count,this._visibilityChanged=!0,e}deleteInstance(e){const t=this._drawInfo;return e>=t.length||t[e].active===!1?this:(t[e].active=!1,this._availableInstanceIds.push(e),this._visibilityChanged=!0,this)}getBoundingBoxAt(e,t){if(e>=this._geometryCount)return null;const n=this._bounds[e],i=n.box,s=this.geometry;if(n.boxInitialized===!1){i.makeEmpty();const o=s.index,a=s.attributes.position,l=this._drawRanges[e];for(let c=l.start,h=l.start+l.count;c<h;c++){let u=c;o&&(u=o.getX(u)),i.expandByPoint($r.fromBufferAttribute(a,u))}n.boxInitialized=!0}return t.copy(i),t}getBoundingSphereAt(e,t){if(e>=this._geometryCount)return null;const n=this._bounds[e],i=n.sphere,s=this.geometry;if(n.sphereInitialized===!1){i.makeEmpty(),this.getBoundingBoxAt(e,Sa),Sa.getCenter(i.center);const o=s.index,a=s.attributes.position,l=this._drawRanges[e];let c=0;for(let h=l.start,u=l.start+l.count;h<u;h++){let d=h;o&&(d=o.getX(d)),$r.fromBufferAttribute(a,d),c=Math.max(c,i.center.distanceToSquared($r))}i.radius=Math.sqrt(c),n.sphereInitialized=!0}return t.copy(i),t}setMatrixAt(e,t){const n=this._drawInfo,i=this._matricesTexture,s=this._matricesTexture.image.data;return e>=n.length||n[e].active===!1?this:(t.toArray(s,e*16),i.needsUpdate=!0,this)}getMatrixAt(e,t){const n=this._drawInfo,i=this._matricesTexture.image.data;return e>=n.length||n[e].active===!1?null:t.fromArray(i,e*16)}setColorAt(e,t){this._colorsTexture===null&&this._initColorsTexture();const n=this._colorsTexture,i=this._colorsTexture.image.data,s=this._drawInfo;return e>=s.length||s[e].active===!1?this:(t.toArray(i,e*4),n.needsUpdate=!0,this)}getColorAt(e,t){const n=this._colorsTexture.image.data,i=this._drawInfo;return e>=i.length||i[e].active===!1?null:t.fromArray(n,e*4)}setVisibleAt(e,t){const n=this._drawInfo;return e>=n.length||n[e].active===!1||n[e].visible===t?this:(n[e].visible=t,this._visibilityChanged=!0,this)}getVisibleAt(e){const t=this._drawInfo;return e>=t.length||t[e].active===!1?!1:t[e].visible}setGeometryIdAt(e,t){const n=this._drawInfo;return e>=n.length||n[e].active===!1||t<0||t>=this._geometryCount?null:(n[e].geometryIndex=t,this)}getGeometryIdAt(e){const t=this._drawInfo;return e>=t.length||t[e].active===!1?-1:t[e].geometryIndex}getGeometryRangeAt(e,t={}){if(e<0||e>=this._geometryCount)return null;const n=this._drawRanges[e];return t.start=n.start,t.count=n.count,t}raycast(e,t){const n=this._drawInfo,i=this._drawRanges,s=this.matrixWorld,o=this.geometry;en.material=this.material,en.geometry.index=o.index,en.geometry.attributes=o.attributes,en.geometry.boundingBox===null&&(en.geometry.boundingBox=new Kt),en.geometry.boundingSphere===null&&(en.geometry.boundingSphere=new $t);for(let a=0,l=n.length;a<l;a++){if(!n[a].visible||!n[a].active)continue;const c=n[a].geometryIndex,h=i[c];en.geometry.setDrawRange(h.start,h.count),this.getMatrixAt(a,en.matrixWorld).premultiply(s),this.getBoundingBoxAt(c,en.geometry.boundingBox),this.getBoundingSphereAt(c,en.geometry.boundingSphere),en.raycast(e,ba);for(let u=0,d=ba.length;u<d;u++){const f=ba[u];f.object=this,f.batchId=a,t.push(f)}ba.length=0}en.material=null,en.geometry.index=null,en.geometry.attributes={},en.geometry.setDrawRange(0,1/0)}copy(e){return super.copy(e),this.geometry=e.geometry.clone(),this.perObjectFrustumCulled=e.perObjectFrustumCulled,this.sortObjects=e.sortObjects,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this._drawRanges=e._drawRanges.map(t=>({...t})),this._reservedRanges=e._reservedRanges.map(t=>({...t})),this._drawInfo=e._drawInfo.map(t=>({...t})),this._bounds=e._bounds.map(t=>({boxInitialized:t.boxInitialized,box:t.box.clone(),sphereInitialized:t.sphereInitialized,sphere:t.sphere.clone()})),this._maxInstanceCount=e._maxInstanceCount,this._maxVertexCount=e._maxVertexCount,this._maxIndexCount=e._maxIndexCount,this._geometryInitialized=e._geometryInitialized,this._geometryCount=e._geometryCount,this._multiDrawCounts=e._multiDrawCounts.slice(),this._multiDrawStarts=e._multiDrawStarts.slice(),this._matricesTexture=e._matricesTexture.clone(),this._matricesTexture.image.data=this._matricesTexture.image.data.slice(),this._colorsTexture!==null&&(this._colorsTexture=e._colorsTexture.clone(),this._colorsTexture.image.data=this._colorsTexture.image.data.slice()),this}dispose(){return this.geometry.dispose(),this._matricesTexture.dispose(),this._matricesTexture=null,this._indirectTexture.dispose(),this._indirectTexture=null,this._colorsTexture!==null&&(this._colorsTexture.dispose(),this._colorsTexture=null),this}onBeforeRender(e,t,n,i,s){if(!this._visibilityChanged&&!this.perObjectFrustumCulled&&!this.sortObjects)return;const o=i.getIndex(),a=o===null?1:o.array.BYTES_PER_ELEMENT,l=this._drawInfo,c=this._multiDrawStarts,h=this._multiDrawCounts,u=this._drawRanges,d=this.perObjectFrustumCulled,f=this._indirectTexture,p=f.image.data;d&&(hf.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse).multiply(this.matrixWorld),rh.setFromProjectionMatrix(hf,e.coordinateSystem));let _=0;if(this.sortObjects){sh.copy(this.matrixWorld).invert(),$r.setFromMatrixPosition(n.matrixWorld).applyMatrix4(sh),uf.set(0,0,-1).transformDirection(n.matrixWorld).transformDirection(sh);for(let y=0,v=l.length;y<v;y++)if(l[y].visible&&l[y].active){const x=l[y].geometryIndex;this.getMatrixAt(y,Bi),this.getBoundingSphereAt(x,as).applyMatrix4(Bi);let R=!1;if(d&&(R=!rh.intersectsSphere(as)),!R){const A=kM.subVectors(as.center,$r).dot(uf);oh.push(u[x],A,y)}}const m=oh.list,g=this.customSort;g===null?m.sort(s.transparent?UM:DM):g.call(this,m,n);for(let y=0,v=m.length;y<v;y++){const x=m[y];c[_]=x.start*a,h[_]=x.count,p[_]=x.index,_++}oh.reset()}else for(let m=0,g=l.length;m<g;m++)if(l[m].visible&&l[m].active){const y=l[m].geometryIndex;let v=!1;if(d&&(this.getMatrixAt(m,Bi),this.getBoundingSphereAt(y,as).applyMatrix4(Bi),v=!rh.intersectsSphere(as)),!v){const x=u[y];c[_]=x.start*a,h[_]=x.count,p[_]=m,_++}}f.needsUpdate=!0,this._multiDrawCount=_,this._visibilityChanged=!1}onBeforeShadow(e,t,n,i,s,o){this.onBeforeRender(e,null,i,s,o)}}class Jt extends Bt{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new oe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Nl=new S,Dl=new S,df=new Pe,Zr=new Ir,wa=new $t,ah=new S,ff=new S;class li extends Ze{constructor(e=new Ve,t=new Jt){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,s=t.count;i<s;i++)Nl.fromBufferAttribute(t,i-1),Dl.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Nl.distanceTo(Dl);e.setAttribute("lineDistance",new Ee(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,s=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),wa.copy(n.boundingSphere),wa.applyMatrix4(i),wa.radius+=s,e.ray.intersectsSphere(wa)===!1)return;df.copy(i).invert(),Zr.copy(e.ray).applyMatrix4(df);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const f=Math.max(0,o.start),p=Math.min(h.count,o.start+o.count);for(let _=f,m=p-1;_<m;_+=c){const g=h.getX(_),y=h.getX(_+1),v=Ta(this,e,Zr,l,g,y);v&&t.push(v)}if(this.isLineLoop){const _=h.getX(p-1),m=h.getX(f),g=Ta(this,e,Zr,l,_,m);g&&t.push(g)}}else{const f=Math.max(0,o.start),p=Math.min(d.count,o.start+o.count);for(let _=f,m=p-1;_<m;_+=c){const g=Ta(this,e,Zr,l,_,_+1);g&&t.push(g)}if(this.isLineLoop){const _=Ta(this,e,Zr,l,p-1,f);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){const a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Ta(r,e,t,n,i,s){const o=r.geometry.attributes.position;if(Nl.fromBufferAttribute(o,i),Dl.fromBufferAttribute(o,s),t.distanceSqToSegment(Nl,Dl,ah,ff)>n)return;ah.applyMatrix4(r.matrixWorld);const l=e.ray.origin.distanceTo(ah);if(!(l<e.near||l>e.far))return{distance:l,point:ff.clone().applyMatrix4(r.matrixWorld),index:i,face:null,faceIndex:null,barycoord:null,object:r}}const pf=new S,mf=new S;class Kn extends li{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,s=t.count;i<s;i+=2)pf.fromBufferAttribute(t,i),mf.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+pf.distanceTo(mf);e.setAttribute("lineDistance",new Ee(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Iu extends li{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class sc extends Bt{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new oe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const gf=new Pe,Hh=new Ir,Aa=new $t,Ea=new S;class Lu extends Ze{constructor(e=new Ve,t=new sc){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,s=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Aa.copy(n.boundingSphere),Aa.applyMatrix4(i),Aa.radius+=s,e.ray.intersectsSphere(Aa)===!1)return;gf.copy(i).invert(),Hh.copy(e.ray).applyMatrix4(gf);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,u=n.attributes.position;if(c!==null){const d=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let p=d,_=f;p<_;p++){const m=c.getX(p);Ea.fromBufferAttribute(u,m),_f(Ea,m,l,i,e,t,this)}}else{const d=Math.max(0,o.start),f=Math.min(u.count,o.start+o.count);for(let p=d,_=f;p<_;p++)Ea.fromBufferAttribute(u,p),_f(Ea,p,l,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){const a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function _f(r,e,t,n,i,s,o){const a=Hh.distanceSqToPoint(r);if(a<t){const l=new S;Hh.closestPointToPoint(r,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;s.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}class HM extends St{constructor(e,t,n,i,s,o,a,l,c){super(e,t,n,i,s,o,a,l,c),this.isVideoTexture=!0,this.minFilter=o!==void 0?o:Et,this.magFilter=s!==void 0?s:Et,this.generateMipmaps=!1;const h=this;function u(){h.needsUpdate=!0,e.requestVideoFrameCallback(u)}"requestVideoFrameCallback"in e&&e.requestVideoFrameCallback(u)}clone(){return new this.constructor(this.image).copy(this)}update(){const e=this.image;"requestVideoFrameCallback"in e===!1&&e.readyState>=e.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}}class GM extends St{constructor(e,t){super({width:e,height:t}),this.isFramebufferTexture=!0,this.magFilter=Ut,this.minFilter=Ut,this.generateMipmaps=!1,this.needsUpdate=!0}}class rc extends St{constructor(e,t,n,i,s,o,a,l,c,h,u,d){super(null,o,a,l,c,h,i,s,u,d),this.isCompressedTexture=!0,this.image={width:t,height:n},this.mipmaps=e,this.flipY=!1,this.generateMipmaps=!1}}class VM extends rc{constructor(e,t,n,i,s,o){super(e,t,n,s,o),this.isCompressedArrayTexture=!0,this.image.depth=i,this.wrapR=Pn,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class WM extends rc{constructor(e,t,n){super(void 0,e[0].width,e[0].height,t,n,Ti),this.isCompressedCubeTexture=!0,this.isCubeTexture=!0,this.image=e}}class _r extends St{constructor(e,t,n,i,s,o,a,l,c){super(e,t,n,i,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class $n{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,i=this.getPoint(0),s=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),s+=n.distanceTo(i),t.push(s),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const n=this.getLengths();let i=0;const s=n.length;let o;t?o=t:o=e*n[s-1];let a=0,l=s-1,c;for(;a<=l;)if(i=Math.floor(a+(l-a)/2),c=n[i]-o,c<0)a=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===o)return i/(s-1);const h=n[i],d=n[i+1]-h,f=(o-h)/d;return(i+f)/(s-1)}getTangent(e,t){let i=e-1e-4,s=e+1e-4;i<0&&(i=0),s>1&&(s=1);const o=this.getPoint(i),a=this.getPoint(s),l=t||(o.isVector2?new W:new S);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){const n=new S,i=[],s=[],o=[],a=new S,l=new Pe;for(let f=0;f<=e;f++){const p=f/e;i[f]=this.getTangentAt(p,new S)}s[0]=new S,o[0]=new S;let c=Number.MAX_VALUE;const h=Math.abs(i[0].x),u=Math.abs(i[0].y),d=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),s[0].crossVectors(i[0],a),o[0].crossVectors(i[0],s[0]);for(let f=1;f<=e;f++){if(s[f]=s[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(i[f-1],i[f]),a.length()>Number.EPSILON){a.normalize();const p=Math.acos(At(i[f-1].dot(i[f]),-1,1));s[f].applyMatrix4(l.makeRotationAxis(a,p))}o[f].crossVectors(i[f],s[f])}if(t===!0){let f=Math.acos(At(s[0].dot(s[e]),-1,1));f/=e,i[0].dot(a.crossVectors(s[0],s[e]))>0&&(f=-f);for(let p=1;p<=e;p++)s[p].applyMatrix4(l.makeRotationAxis(i[p],f*p)),o[p].crossVectors(i[p],s[p])}return{tangents:i,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class oc extends $n{constructor(e=0,t=0,n=1,i=1,s=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=i,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new W){const n=t,i=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=i;for(;s>i;)s-=i;s<Number.EPSILON&&(o?s=0:s=i),this.aClockwise===!0&&!o&&(s===i?s=-i:s=s-i);const a=this.aStartAngle+e*s;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class ym extends oc{constructor(e,t,n,i,s,o){super(e,t,n,n,i,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Nu(){let r=0,e=0,t=0,n=0;function i(s,o,a,l){r=s,e=a,t=-3*s+3*o-2*a-l,n=2*s-2*o+a+l}return{initCatmullRom:function(s,o,a,l,c){i(o,a,c*(a-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,a,l,c,h,u){let d=(o-s)/c-(a-s)/(c+h)+(a-o)/h,f=(a-o)/h-(l-o)/(h+u)+(l-a)/u;d*=h,f*=h,i(o,a,d,f)},calc:function(s){const o=s*s,a=o*s;return r+e*s+t*o+n*a}}}const Ca=new S,lh=new Nu,ch=new Nu,hh=new Nu;class xm extends $n{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new S){const n=t,i=this.points,s=i.length,o=(s-(this.closed?0:1))*e;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/s)+1)*s:l===0&&a===s-1&&(a=s-2,l=1);let c,h;this.closed||a>0?c=i[(a-1)%s]:(Ca.subVectors(i[0],i[1]).add(i[0]),c=Ca);const u=i[a%s],d=i[(a+1)%s];if(this.closed||a+2<s?h=i[(a+2)%s]:(Ca.subVectors(i[s-1],i[s-2]).add(i[s-1]),h=Ca),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let p=Math.pow(c.distanceToSquared(u),f),_=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);_<1e-4&&(_=1),p<1e-4&&(p=_),m<1e-4&&(m=_),lh.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,p,_,m),ch.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,p,_,m),hh.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,p,_,m)}else this.curveType==="catmullrom"&&(lh.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),ch.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),hh.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(lh.calc(l),ch.calc(l),hh.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new S().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function vf(r,e,t,n,i){const s=(n-e)*.5,o=(i-t)*.5,a=r*r,l=r*a;return(2*t-2*n+s+o)*l+(-3*t+3*n-2*s-o)*a+s*r+t}function qM(r,e){const t=1-r;return t*t*e}function XM(r,e){return 2*(1-r)*r*e}function YM(r,e){return r*r*e}function lo(r,e,t,n){return qM(r,e)+XM(r,t)+YM(r,n)}function KM(r,e){const t=1-r;return t*t*t*e}function $M(r,e){const t=1-r;return 3*t*t*r*e}function ZM(r,e){return 3*(1-r)*r*r*e}function JM(r,e){return r*r*r*e}function co(r,e,t,n,i){return KM(r,e)+$M(r,t)+ZM(r,n)+JM(r,i)}class Du extends $n{constructor(e=new W,t=new W,n=new W,i=new W){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new W){const n=t,i=this.v0,s=this.v1,o=this.v2,a=this.v3;return n.set(co(e,i.x,s.x,o.x,a.x),co(e,i.y,s.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Mm extends $n{constructor(e=new S,t=new S,n=new S,i=new S){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new S){const n=t,i=this.v0,s=this.v1,o=this.v2,a=this.v3;return n.set(co(e,i.x,s.x,o.x,a.x),co(e,i.y,s.y,o.y,a.y),co(e,i.z,s.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Uu extends $n{constructor(e=new W,t=new W){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new W){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new W){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Sm extends $n{constructor(e=new S,t=new S){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new S){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new S){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Ou extends $n{constructor(e=new W,t=new W,n=new W){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new W){const n=t,i=this.v0,s=this.v1,o=this.v2;return n.set(lo(e,i.x,s.x,o.x),lo(e,i.y,s.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Fu extends $n{constructor(e=new S,t=new S,n=new S){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new S){const n=t,i=this.v0,s=this.v1,o=this.v2;return n.set(lo(e,i.x,s.x,o.x),lo(e,i.y,s.y,o.y),lo(e,i.z,s.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Bu extends $n{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new W){const n=t,i=this.points,s=(i.length-1)*e,o=Math.floor(s),a=s-o,l=i[o===0?o:o-1],c=i[o],h=i[o>i.length-2?i.length-1:o+1],u=i[o>i.length-3?i.length-1:o+2];return n.set(vf(a,l.x,c.x,h.x,u.x),vf(a,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new W().fromArray(i))}return this}}var Ul=Object.freeze({__proto__:null,ArcCurve:ym,CatmullRomCurve3:xm,CubicBezierCurve:Du,CubicBezierCurve3:Mm,EllipseCurve:oc,LineCurve:Uu,LineCurve3:Sm,QuadraticBezierCurve:Ou,QuadraticBezierCurve3:Fu,SplineCurve:Bu});class bm extends $n{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ul[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),i=this.getCurveLengths();let s=0;for(;s<i.length;){if(i[s]>=n){const o=i[s]-n,a=this.curves[s],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}s++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,i=this.curves.length;n<i;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let i=0,s=this.curves;i<s.length;i++){const o=s[i],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(new Ul[i.type]().fromJSON(i))}return this}}class bo extends bm{constructor(e){super(),this.type="Path",this.currentPoint=new W,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new Uu(this.currentPoint.clone(),new W(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,i){const s=new Ou(this.currentPoint.clone(),new W(e,t),new W(n,i));return this.curves.push(s),this.currentPoint.set(n,i),this}bezierCurveTo(e,t,n,i,s,o){const a=new Du(this.currentPoint.clone(),new W(e,t),new W(n,i),new W(s,o));return this.curves.push(a),this.currentPoint.set(s,o),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new Bu(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,i,s,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,n,i,s,o),this}absarc(e,t,n,i,s,o){return this.absellipse(e,t,n,n,i,s,o),this}ellipse(e,t,n,i,s,o,a,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,i,s,o,a,l),this}absellipse(e,t,n,i,s,o,a,l){const c=new oc(e,t,n,i,s,o,a,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Bs extends Ve{constructor(e=[new W(0,-.5),new W(.5,0),new W(0,.5)],t=12,n=0,i=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:i},t=Math.floor(t),i=At(i,0,Math.PI*2);const s=[],o=[],a=[],l=[],c=[],h=1/t,u=new S,d=new W,f=new S,p=new S,_=new S;let m=0,g=0;for(let y=0;y<=e.length-1;y++)switch(y){case 0:m=e[y+1].x-e[y].x,g=e[y+1].y-e[y].y,f.x=g*1,f.y=-m,f.z=g*0,_.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case e.length-1:l.push(_.x,_.y,_.z);break;default:m=e[y+1].x-e[y].x,g=e[y+1].y-e[y].y,f.x=g*1,f.y=-m,f.z=g*0,p.copy(f),f.x+=_.x,f.y+=_.y,f.z+=_.z,f.normalize(),l.push(f.x,f.y,f.z),_.copy(p)}for(let y=0;y<=t;y++){const v=n+y*h*i,x=Math.sin(v),R=Math.cos(v);for(let A=0;A<=e.length-1;A++){u.x=e[A].x*x,u.y=e[A].y,u.z=e[A].x*R,o.push(u.x,u.y,u.z),d.x=y/t,d.y=A/(e.length-1),a.push(d.x,d.y);const T=l[3*A+0]*x,I=l[3*A+1],F=l[3*A+0]*R;c.push(T,I,F)}}for(let y=0;y<t;y++)for(let v=0;v<e.length-1;v++){const x=v+y*e.length,R=x,A=x+e.length,T=x+e.length+1,I=x+1;s.push(R,A,I),s.push(T,I,A)}this.setIndex(s),this.setAttribute("position",new Ee(o,3)),this.setAttribute("uv",new Ee(a,2)),this.setAttribute("normal",new Ee(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Bs(e.points,e.segments,e.phiStart,e.phiLength)}}class zo extends Bs{constructor(e=1,t=1,n=4,i=8){const s=new bo;s.absarc(0,-t/2,e,Math.PI*1.5,0),s.absarc(0,t/2,e,0,Math.PI*.5),super(s.getPoints(n),i),this.type="CapsuleGeometry",this.parameters={radius:e,length:t,capSegments:n,radialSegments:i}}static fromJSON(e){return new zo(e.radius,e.length,e.capSegments,e.radialSegments)}}class Ho extends Ve{constructor(e=1,t=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:i},t=Math.max(3,t);const s=[],o=[],a=[],l=[],c=new S,h=new W;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){const f=n+u/t*i;c.x=e*Math.cos(f),c.y=e*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[d]/e+1)/2,h.y=(o[d+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new Ee(o,3)),this.setAttribute("normal",new Ee(a,3)),this.setAttribute("uv",new Ee(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ho(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class dt extends Ve{constructor(e=1,t=1,n=1,i=32,s=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:l};const c=this;i=Math.floor(i),s=Math.floor(s);const h=[],u=[],d=[],f=[];let p=0;const _=[],m=n/2;let g=0;y(),o===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new Ee(u,3)),this.setAttribute("normal",new Ee(d,3)),this.setAttribute("uv",new Ee(f,2));function y(){const x=new S,R=new S;let A=0;const T=(t-e)/n;for(let I=0;I<=s;I++){const F=[],M=I/s,w=M*(t-e)+e;for(let B=0;B<=i;B++){const z=B/i,q=z*l+a,j=Math.sin(q),k=Math.cos(q);R.x=w*j,R.y=-M*n+m,R.z=w*k,u.push(R.x,R.y,R.z),x.set(j,T,k).normalize(),d.push(x.x,x.y,x.z),f.push(z,1-M),F.push(p++)}_.push(F)}for(let I=0;I<i;I++)for(let F=0;F<s;F++){const M=_[F][I],w=_[F+1][I],B=_[F+1][I+1],z=_[F][I+1];e>0&&(h.push(M,w,z),A+=3),t>0&&(h.push(w,B,z),A+=3)}c.addGroup(g,A,0),g+=A}function v(x){const R=p,A=new W,T=new S;let I=0;const F=x===!0?e:t,M=x===!0?1:-1;for(let B=1;B<=i;B++)u.push(0,m*M,0),d.push(0,M,0),f.push(.5,.5),p++;const w=p;for(let B=0;B<=i;B++){const q=B/i*l+a,j=Math.cos(q),k=Math.sin(q);T.x=F*k,T.y=m*M,T.z=F*j,u.push(T.x,T.y,T.z),d.push(0,M,0),A.x=j*.5+.5,A.y=k*.5*M+.5,f.push(A.x,A.y),p++}for(let B=0;B<i;B++){const z=R+B,q=w+B;x===!0?h.push(q,q+1,z):h.push(q+1,q,z),I+=3}c.addGroup(g,I,x===!0?1:2),g+=I}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new dt(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Dr extends dt{constructor(e=1,t=1,n=32,i=1,s=!1,o=0,a=Math.PI*2){super(0,e,t,n,i,s,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:s,thetaStart:o,thetaLength:a}}static fromJSON(e){return new Dr(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ji extends Ve{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const s=[],o=[];a(i),c(n),h(),this.setAttribute("position",new Ee(s,3)),this.setAttribute("normal",new Ee(s.slice(),3)),this.setAttribute("uv",new Ee(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(y){const v=new S,x=new S,R=new S;for(let A=0;A<t.length;A+=3)f(t[A+0],v),f(t[A+1],x),f(t[A+2],R),l(v,x,R,y)}function l(y,v,x,R){const A=R+1,T=[];for(let I=0;I<=A;I++){T[I]=[];const F=y.clone().lerp(x,I/A),M=v.clone().lerp(x,I/A),w=A-I;for(let B=0;B<=w;B++)B===0&&I===A?T[I][B]=F:T[I][B]=F.clone().lerp(M,B/w)}for(let I=0;I<A;I++)for(let F=0;F<2*(A-I)-1;F++){const M=Math.floor(F/2);F%2===0?(d(T[I][M+1]),d(T[I+1][M]),d(T[I][M])):(d(T[I][M+1]),d(T[I+1][M+1]),d(T[I+1][M]))}}function c(y){const v=new S;for(let x=0;x<s.length;x+=3)v.x=s[x+0],v.y=s[x+1],v.z=s[x+2],v.normalize().multiplyScalar(y),s[x+0]=v.x,s[x+1]=v.y,s[x+2]=v.z}function h(){const y=new S;for(let v=0;v<s.length;v+=3){y.x=s[v+0],y.y=s[v+1],y.z=s[v+2];const x=m(y)/2/Math.PI+.5,R=g(y)/Math.PI+.5;o.push(x,1-R)}p(),u()}function u(){for(let y=0;y<o.length;y+=6){const v=o[y+0],x=o[y+2],R=o[y+4],A=Math.max(v,x,R),T=Math.min(v,x,R);A>.9&&T<.1&&(v<.2&&(o[y+0]+=1),x<.2&&(o[y+2]+=1),R<.2&&(o[y+4]+=1))}}function d(y){s.push(y.x,y.y,y.z)}function f(y,v){const x=y*3;v.x=e[x+0],v.y=e[x+1],v.z=e[x+2]}function p(){const y=new S,v=new S,x=new S,R=new S,A=new W,T=new W,I=new W;for(let F=0,M=0;F<s.length;F+=9,M+=6){y.set(s[F+0],s[F+1],s[F+2]),v.set(s[F+3],s[F+4],s[F+5]),x.set(s[F+6],s[F+7],s[F+8]),A.set(o[M+0],o[M+1]),T.set(o[M+2],o[M+3]),I.set(o[M+4],o[M+5]),R.copy(y).add(v).add(x).divideScalar(3);const w=m(R);_(A,M+0,y,w),_(T,M+2,v,w),_(I,M+4,x,w)}}function _(y,v,x,R){R<0&&y.x===1&&(o[v]=y.x-1),x.x===0&&x.z===0&&(o[v]=R/2/Math.PI+.5)}function m(y){return Math.atan2(y.z,-y.x)}function g(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ji(e.vertices,e.indices,e.radius,e.details)}}class Go extends ji{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=1/n,s=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(s,o,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Go(e.radius,e.detail)}}const Ra=new S,Pa=new S,uh=new S,Ia=new yn;class wm extends Ve{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const i=Math.pow(10,4),s=Math.cos(As*t),o=e.getIndex(),a=e.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],h=["a","b","c"],u=new Array(3),d={},f=[];for(let p=0;p<l;p+=3){o?(c[0]=o.getX(p),c[1]=o.getX(p+1),c[2]=o.getX(p+2)):(c[0]=p,c[1]=p+1,c[2]=p+2);const{a:_,b:m,c:g}=Ia;if(_.fromBufferAttribute(a,c[0]),m.fromBufferAttribute(a,c[1]),g.fromBufferAttribute(a,c[2]),Ia.getNormal(uh),u[0]=`${Math.round(_.x*i)},${Math.round(_.y*i)},${Math.round(_.z*i)}`,u[1]=`${Math.round(m.x*i)},${Math.round(m.y*i)},${Math.round(m.z*i)}`,u[2]=`${Math.round(g.x*i)},${Math.round(g.y*i)},${Math.round(g.z*i)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let y=0;y<3;y++){const v=(y+1)%3,x=u[y],R=u[v],A=Ia[h[y]],T=Ia[h[v]],I=`${x}_${R}`,F=`${R}_${x}`;F in d&&d[F]?(uh.dot(d[F].normal)<=s&&(f.push(A.x,A.y,A.z),f.push(T.x,T.y,T.z)),d[F]=null):I in d||(d[I]={index0:c[y],index1:c[v],normal:uh.clone()})}}for(const p in d)if(d[p]){const{index0:_,index1:m}=d[p];Ra.fromBufferAttribute(a,_),Pa.fromBufferAttribute(a,m),f.push(Ra.x,Ra.y,Ra.z),f.push(Pa.x,Pa.y,Pa.z)}this.setAttribute("position",new Ee(f,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class bn extends bo{constructor(e){super(e),this.uuid=Ln(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,i=this.holes.length;n<i;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const i=this.holes[t];e.holes.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(new bo().fromJSON(i))}return this}}const jM={triangulate:function(r,e,t=2){const n=e&&e.length,i=n?e[0]*t:r.length;let s=Tm(r,0,i,t,!0);const o=[];if(!s||s.next===s.prev)return o;let a,l,c,h,u,d,f;if(n&&(s=iS(r,e,s,t)),r.length>80*t){a=c=r[0],l=h=r[1];for(let p=t;p<i;p+=t)u=r[p],d=r[p+1],u<a&&(a=u),d<l&&(l=d),u>c&&(c=u),d>h&&(h=d);f=Math.max(c-a,h-l),f=f!==0?32767/f:0}return wo(s,o,t,a,l,f,0),o}};function Tm(r,e,t,n,i){let s,o;if(i===pS(r,e,t,n)>0)for(s=e;s<t;s+=n)o=yf(s,r[s],r[s+1],o);else for(s=t-n;s>=e;s-=n)o=yf(s,r[s],r[s+1],o);return o&&ac(o,o.next)&&(Ao(o),o=o.next),o}function Ns(r,e){if(!r)return r;e||(e=r);let t=r,n;do if(n=!1,!t.steiner&&(ac(t,t.next)||bt(t.prev,t,t.next)===0)){if(Ao(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function wo(r,e,t,n,i,s,o){if(!r)return;!o&&s&&lS(r,n,i,s);let a=r,l,c;for(;r.prev!==r.next;){if(l=r.prev,c=r.next,s?eS(r,n,i,s):QM(r)){e.push(l.i/t|0),e.push(r.i/t|0),e.push(c.i/t|0),Ao(r),r=c.next,a=c.next;continue}if(r=c,r===a){o?o===1?(r=tS(Ns(r),e,t),wo(r,e,t,n,i,s,2)):o===2&&nS(r,e,t,n,i,s):wo(Ns(r),e,t,n,i,s,1);break}}}function QM(r){const e=r.prev,t=r,n=r.next;if(bt(e,t,n)>=0)return!1;const i=e.x,s=t.x,o=n.x,a=e.y,l=t.y,c=n.y,h=i<s?i<o?i:o:s<o?s:o,u=a<l?a<c?a:c:l<c?l:c,d=i>s?i>o?i:o:s>o?s:o,f=a>l?a>c?a:c:l>c?l:c;let p=n.next;for(;p!==e;){if(p.x>=h&&p.x<=d&&p.y>=u&&p.y<=f&&fr(i,a,s,l,o,c,p.x,p.y)&&bt(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function eS(r,e,t,n){const i=r.prev,s=r,o=r.next;if(bt(i,s,o)>=0)return!1;const a=i.x,l=s.x,c=o.x,h=i.y,u=s.y,d=o.y,f=a<l?a<c?a:c:l<c?l:c,p=h<u?h<d?h:d:u<d?u:d,_=a>l?a>c?a:c:l>c?l:c,m=h>u?h>d?h:d:u>d?u:d,g=Gh(f,p,e,t,n),y=Gh(_,m,e,t,n);let v=r.prevZ,x=r.nextZ;for(;v&&v.z>=g&&x&&x.z<=y;){if(v.x>=f&&v.x<=_&&v.y>=p&&v.y<=m&&v!==i&&v!==o&&fr(a,h,l,u,c,d,v.x,v.y)&&bt(v.prev,v,v.next)>=0||(v=v.prevZ,x.x>=f&&x.x<=_&&x.y>=p&&x.y<=m&&x!==i&&x!==o&&fr(a,h,l,u,c,d,x.x,x.y)&&bt(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;v&&v.z>=g;){if(v.x>=f&&v.x<=_&&v.y>=p&&v.y<=m&&v!==i&&v!==o&&fr(a,h,l,u,c,d,v.x,v.y)&&bt(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;x&&x.z<=y;){if(x.x>=f&&x.x<=_&&x.y>=p&&x.y<=m&&x!==i&&x!==o&&fr(a,h,l,u,c,d,x.x,x.y)&&bt(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function tS(r,e,t){let n=r;do{const i=n.prev,s=n.next.next;!ac(i,s)&&Am(i,n,n.next,s)&&To(i,s)&&To(s,i)&&(e.push(i.i/t|0),e.push(n.i/t|0),e.push(s.i/t|0),Ao(n),Ao(n.next),n=r=s),n=n.next}while(n!==r);return Ns(n)}function nS(r,e,t,n,i,s){let o=r;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&uS(o,a)){let l=Em(o,a);o=Ns(o,o.next),l=Ns(l,l.next),wo(o,e,t,n,i,s,0),wo(l,e,t,n,i,s,0);return}a=a.next}o=o.next}while(o!==r)}function iS(r,e,t,n){const i=[];let s,o,a,l,c;for(s=0,o=e.length;s<o;s++)a=e[s]*n,l=s<o-1?e[s+1]*n:r.length,c=Tm(r,a,l,n,!1),c===c.next&&(c.steiner=!0),i.push(hS(c));for(i.sort(sS),s=0;s<i.length;s++)t=rS(i[s],t);return t}function sS(r,e){return r.x-e.x}function rS(r,e){const t=oS(r,e);if(!t)return e;const n=Em(t,r);return Ns(n,n.next),Ns(t,t.next)}function oS(r,e){let t=e,n=-1/0,i;const s=r.x,o=r.y;do{if(o<=t.y&&o>=t.next.y&&t.next.y!==t.y){const d=t.x+(o-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=s&&d>n&&(n=d,i=t.x<t.next.x?t:t.next,d===s))return i}t=t.next}while(t!==e);if(!i)return null;const a=i,l=i.x,c=i.y;let h=1/0,u;t=i;do s>=t.x&&t.x>=l&&s!==t.x&&fr(o<c?s:n,o,l,c,o<c?n:s,o,t.x,t.y)&&(u=Math.abs(o-t.y)/(s-t.x),To(t,r)&&(u<h||u===h&&(t.x>i.x||t.x===i.x&&aS(i,t)))&&(i=t,h=u)),t=t.next;while(t!==a);return i}function aS(r,e){return bt(r.prev,r,e.prev)<0&&bt(e.next,r,r.next)<0}function lS(r,e,t,n){let i=r;do i.z===0&&(i.z=Gh(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==r);i.prevZ.nextZ=null,i.prevZ=null,cS(i)}function cS(r){let e,t,n,i,s,o,a,l,c=1;do{for(t=r,r=null,s=null,o=0;t;){for(o++,n=t,a=0,e=0;e<c&&(a++,n=n.nextZ,!!n);e++);for(l=c;a>0||l>0&&n;)a!==0&&(l===0||!n||t.z<=n.z)?(i=t,t=t.nextZ,a--):(i=n,n=n.nextZ,l--),s?s.nextZ=i:r=i,i.prevZ=s,s=i;t=n}s.nextZ=null,c*=2}while(o>1);return r}function Gh(r,e,t,n,i){return r=(r-t)*i|0,e=(e-n)*i|0,r=(r|r<<8)&16711935,r=(r|r<<4)&252645135,r=(r|r<<2)&858993459,r=(r|r<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,r|e<<1}function hS(r){let e=r,t=r;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==r);return t}function fr(r,e,t,n,i,s,o,a){return(i-o)*(e-a)>=(r-o)*(s-a)&&(r-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(s-a)>=(i-o)*(n-a)}function uS(r,e){return r.next.i!==e.i&&r.prev.i!==e.i&&!dS(r,e)&&(To(r,e)&&To(e,r)&&fS(r,e)&&(bt(r.prev,r,e.prev)||bt(r,e.prev,e))||ac(r,e)&&bt(r.prev,r,r.next)>0&&bt(e.prev,e,e.next)>0)}function bt(r,e,t){return(e.y-r.y)*(t.x-e.x)-(e.x-r.x)*(t.y-e.y)}function ac(r,e){return r.x===e.x&&r.y===e.y}function Am(r,e,t,n){const i=Na(bt(r,e,t)),s=Na(bt(r,e,n)),o=Na(bt(t,n,r)),a=Na(bt(t,n,e));return!!(i!==s&&o!==a||i===0&&La(r,t,e)||s===0&&La(r,n,e)||o===0&&La(t,r,n)||a===0&&La(t,e,n))}function La(r,e,t){return e.x<=Math.max(r.x,t.x)&&e.x>=Math.min(r.x,t.x)&&e.y<=Math.max(r.y,t.y)&&e.y>=Math.min(r.y,t.y)}function Na(r){return r>0?1:r<0?-1:0}function dS(r,e){let t=r;do{if(t.i!==r.i&&t.next.i!==r.i&&t.i!==e.i&&t.next.i!==e.i&&Am(t,t.next,r,e))return!0;t=t.next}while(t!==r);return!1}function To(r,e){return bt(r.prev,r,r.next)<0?bt(r,e,r.next)>=0&&bt(r,r.prev,e)>=0:bt(r,e,r.prev)<0||bt(r,r.next,e)<0}function fS(r,e){let t=r,n=!1;const i=(r.x+e.x)/2,s=(r.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&i<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==r);return n}function Em(r,e){const t=new Vh(r.i,r.x,r.y),n=new Vh(e.i,e.x,e.y),i=r.next,s=e.prev;return r.next=e,e.prev=r,t.next=i,i.prev=t,n.next=t,t.prev=n,s.next=n,n.prev=s,n}function yf(r,e,t,n){const i=new Vh(r,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Ao(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function Vh(r,e,t){this.i=r,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function pS(r,e,t,n){let i=0;for(let s=e,o=t-n;s<t;s+=n)i+=(r[o]-r[s])*(r[s+1]+r[o+1]),o=s;return i}class si{static area(e){const t=e.length;let n=0;for(let i=t-1,s=0;s<t;i=s++)n+=e[i].x*e[s].y-e[s].x*e[i].y;return n*.5}static isClockWise(e){return si.area(e)<0}static triangulateShape(e,t){const n=[],i=[],s=[];xf(e),Mf(n,e);let o=e.length;t.forEach(xf);for(let l=0;l<t.length;l++)i.push(o),o+=t[l].length,Mf(n,t[l]);const a=jM.triangulate(n,i);for(let l=0;l<a.length;l+=3)s.push(a.slice(l,l+3));return s}}function xf(r){const e=r.length;e>2&&r[e-1].equals(r[0])&&r.pop()}function Mf(r,e){for(let t=0;t<e.length;t++)r.push(e[t].x),r.push(e[t].y)}class Xn extends Ve{constructor(e=new bn([new W(.5,.5),new W(-.5,.5),new W(-.5,-.5),new W(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,i=[],s=[];for(let a=0,l=e.length;a<l;a++){const c=e[a];o(c)}this.setAttribute("position",new Ee(i,3)),this.setAttribute("uv",new Ee(s,2)),this.computeVertexNormals();function o(a){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1;let d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,p=t.bevelSize!==void 0?t.bevelSize:f-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3;const g=t.extrudePath,y=t.UVGenerator!==void 0?t.UVGenerator:mS;let v,x=!1,R,A,T,I;g&&(v=g.getSpacedPoints(h),x=!0,d=!1,R=g.computeFrenetFrames(h,!1),A=new S,T=new S,I=new S),d||(m=0,f=0,p=0,_=0);const F=a.extractPoints(c);let M=F.shape;const w=F.holes;if(!si.isClockWise(M)){M=M.reverse();for(let se=0,P=w.length;se<P;se++){const me=w[se];si.isClockWise(me)&&(w[se]=me.reverse())}}const z=si.triangulateShape(M,w),q=M;for(let se=0,P=w.length;se<P;se++){const me=w[se];M=M.concat(me)}function j(se,P,me){return P||console.error("THREE.ExtrudeGeometry: vec does not exist"),se.clone().addScaledVector(P,me)}const k=M.length,$=z.length;function L(se,P,me){let X,Y,te;const ge=se.x-P.x,ae=se.y-P.y,C=me.x-se.x,b=me.y-se.y,U=ge*ge+ae*ae,Z=ge*b-ae*C;if(Math.abs(Z)>Number.EPSILON){const K=Math.sqrt(U),ee=Math.sqrt(C*C+b*b),ve=P.x-ae/K,de=P.y+ge/K,ye=me.x-b/ee,je=me.y+C/ee,he=((ye-ve)*b-(je-de)*C)/(ge*b-ae*C);X=ve+ge*he-se.x,Y=de+ae*he-se.y;const Te=X*X+Y*Y;if(Te<=2)return new W(X,Y);te=Math.sqrt(Te/2)}else{let K=!1;ge>Number.EPSILON?C>Number.EPSILON&&(K=!0):ge<-Number.EPSILON?C<-Number.EPSILON&&(K=!0):Math.sign(ae)===Math.sign(b)&&(K=!0),K?(X=-ae,Y=ge,te=Math.sqrt(U)):(X=ge,Y=ae,te=Math.sqrt(U/2))}return new W(X/te,Y/te)}const Q=[];for(let se=0,P=q.length,me=P-1,X=se+1;se<P;se++,me++,X++)me===P&&(me=0),X===P&&(X=0),Q[se]=L(q[se],q[me],q[X]);const ne=[];let le,we=Q.concat();for(let se=0,P=w.length;se<P;se++){const me=w[se];le=[];for(let X=0,Y=me.length,te=Y-1,ge=X+1;X<Y;X++,te++,ge++)te===Y&&(te=0),ge===Y&&(ge=0),le[X]=L(me[X],me[te],me[ge]);ne.push(le),we=we.concat(le)}for(let se=0;se<m;se++){const P=se/m,me=f*Math.cos(P*Math.PI/2),X=p*Math.sin(P*Math.PI/2)+_;for(let Y=0,te=q.length;Y<te;Y++){const ge=j(q[Y],Q[Y],X);ue(ge.x,ge.y,-me)}for(let Y=0,te=w.length;Y<te;Y++){const ge=w[Y];le=ne[Y];for(let ae=0,C=ge.length;ae<C;ae++){const b=j(ge[ae],le[ae],X);ue(b.x,b.y,-me)}}}const Fe=p+_;for(let se=0;se<k;se++){const P=d?j(M[se],we[se],Fe):M[se];x?(T.copy(R.normals[0]).multiplyScalar(P.x),A.copy(R.binormals[0]).multiplyScalar(P.y),I.copy(v[0]).add(T).add(A),ue(I.x,I.y,I.z)):ue(P.x,P.y,0)}for(let se=1;se<=h;se++)for(let P=0;P<k;P++){const me=d?j(M[P],we[P],Fe):M[P];x?(T.copy(R.normals[se]).multiplyScalar(me.x),A.copy(R.binormals[se]).multiplyScalar(me.y),I.copy(v[se]).add(T).add(A),ue(I.x,I.y,I.z)):ue(me.x,me.y,u/h*se)}for(let se=m-1;se>=0;se--){const P=se/m,me=f*Math.cos(P*Math.PI/2),X=p*Math.sin(P*Math.PI/2)+_;for(let Y=0,te=q.length;Y<te;Y++){const ge=j(q[Y],Q[Y],X);ue(ge.x,ge.y,u+me)}for(let Y=0,te=w.length;Y<te;Y++){const ge=w[Y];le=ne[Y];for(let ae=0,C=ge.length;ae<C;ae++){const b=j(ge[ae],le[ae],X);x?ue(b.x,b.y+v[h-1].y,v[h-1].x+me):ue(b.x,b.y,u+me)}}}G(),ie();function G(){const se=i.length/3;if(d){let P=0,me=k*P;for(let X=0;X<$;X++){const Y=z[X];Oe(Y[2]+me,Y[1]+me,Y[0]+me)}P=h+m*2,me=k*P;for(let X=0;X<$;X++){const Y=z[X];Oe(Y[0]+me,Y[1]+me,Y[2]+me)}}else{for(let P=0;P<$;P++){const me=z[P];Oe(me[2],me[1],me[0])}for(let P=0;P<$;P++){const me=z[P];Oe(me[0]+k*h,me[1]+k*h,me[2]+k*h)}}n.addGroup(se,i.length/3-se,0)}function ie(){const se=i.length/3;let P=0;pe(q,P),P+=q.length;for(let me=0,X=w.length;me<X;me++){const Y=w[me];pe(Y,P),P+=Y.length}n.addGroup(se,i.length/3-se,1)}function pe(se,P){let me=se.length;for(;--me>=0;){const X=me;let Y=me-1;Y<0&&(Y=se.length-1);for(let te=0,ge=h+m*2;te<ge;te++){const ae=k*te,C=k*(te+1),b=P+X+ae,U=P+Y+ae,Z=P+Y+C,K=P+X+C;Le(b,U,Z,K)}}}function ue(se,P,me){l.push(se),l.push(P),l.push(me)}function Oe(se,P,me){Ne(se),Ne(P),Ne(me);const X=i.length/3,Y=y.generateTopUV(n,i,X-3,X-2,X-1);ze(Y[0]),ze(Y[1]),ze(Y[2])}function Le(se,P,me,X){Ne(se),Ne(P),Ne(X),Ne(P),Ne(me),Ne(X);const Y=i.length/3,te=y.generateSideWallUV(n,i,Y-6,Y-3,Y-2,Y-1);ze(te[0]),ze(te[1]),ze(te[3]),ze(te[1]),ze(te[2]),ze(te[3])}function Ne(se){i.push(l[se*3+0]),i.push(l[se*3+1]),i.push(l[se*3+2])}function ze(se){s.push(se.x),s.push(se.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return gS(t,n,e)}static fromJSON(e,t){const n=[];for(let s=0,o=e.shapes.length;s<o;s++){const a=t[e.shapes[s]];n.push(a)}const i=e.options.extrudePath;return i!==void 0&&(e.options.extrudePath=new Ul[i.type]().fromJSON(i)),new Xn(n,e.options)}}const mS={generateTopUV:function(r,e,t,n,i){const s=e[t*3],o=e[t*3+1],a=e[n*3],l=e[n*3+1],c=e[i*3],h=e[i*3+1];return[new W(s,o),new W(a,l),new W(c,h)]},generateSideWallUV:function(r,e,t,n,i,s){const o=e[t*3],a=e[t*3+1],l=e[t*3+2],c=e[n*3],h=e[n*3+1],u=e[n*3+2],d=e[i*3],f=e[i*3+1],p=e[i*3+2],_=e[s*3],m=e[s*3+1],g=e[s*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new W(o,1-l),new W(c,1-u),new W(d,1-p),new W(_,1-g)]:[new W(a,1-l),new W(h,1-u),new W(f,1-p),new W(m,1-g)]}};function gS(r,e,t){if(t.shapes=[],Array.isArray(r))for(let n=0,i=r.length;n<i;n++){const s=r[n];t.shapes.push(s.uuid)}else t.shapes.push(r.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class lc extends ji{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,s,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new lc(e.radius,e.detail)}}class Vo extends ji{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Vo(e.radius,e.detail)}}class Ur extends Ve{constructor(e=.5,t=1,n=32,i=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:s,thetaLength:o},n=Math.max(3,n),i=Math.max(1,i);const a=[],l=[],c=[],h=[];let u=e;const d=(t-e)/i,f=new S,p=new W;for(let _=0;_<=i;_++){for(let m=0;m<=n;m++){const g=s+m/n*o;f.x=u*Math.cos(g),f.y=u*Math.sin(g),l.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/t+1)/2,p.y=(f.y/t+1)/2,h.push(p.x,p.y)}u+=d}for(let _=0;_<i;_++){const m=_*(n+1);for(let g=0;g<n;g++){const y=g+m,v=y,x=y+n+1,R=y+n+2,A=y+1;a.push(v,x,A),a.push(x,R,A)}}this.setIndex(a),this.setAttribute("position",new Ee(l,3)),this.setAttribute("normal",new Ee(c,3)),this.setAttribute("uv",new Ee(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ur(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class cc extends Ve{constructor(e=new bn([new W(0,.5),new W(-.5,-.5),new W(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],i=[],s=[],o=[];let a=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(a,l,h),a+=l,l=0;this.setIndex(n),this.setAttribute("position",new Ee(i,3)),this.setAttribute("normal",new Ee(s,3)),this.setAttribute("uv",new Ee(o,2));function c(h){const u=i.length/3,d=h.extractPoints(t);let f=d.shape;const p=d.holes;si.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,g=p.length;m<g;m++){const y=p[m];si.isClockWise(y)===!0&&(p[m]=y.reverse())}const _=si.triangulateShape(f,p);for(let m=0,g=p.length;m<g;m++){const y=p[m];f=f.concat(y)}for(let m=0,g=f.length;m<g;m++){const y=f[m];i.push(y.x,y.y,0),s.push(0,0,1),o.push(y.x,y.y)}for(let m=0,g=_.length;m<g;m++){const y=_[m],v=y[0]+u,x=y[1]+u,R=y[2]+u;n.push(v,x,R),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return _S(t,e)}static fromJSON(e,t){const n=[];for(let i=0,s=e.shapes.length;i<s;i++){const o=t[e.shapes[i]];n.push(o)}return new cc(n,e.curveSegments)}}function _S(r,e){if(e.shapes=[],Array.isArray(r))for(let t=0,n=r.length;t<n;t++){const i=r[t];e.shapes.push(i.uuid)}else e.shapes.push(r.uuid);return e}class hi extends Ve{constructor(e=1,t=32,n=16,i=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:s,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const h=[],u=new S,d=new S,f=[],p=[],_=[],m=[];for(let g=0;g<=n;g++){const y=[],v=g/n;let x=0;g===0&&o===0?x=.5/t:g===n&&l===Math.PI&&(x=-.5/t);for(let R=0;R<=t;R++){const A=R/t;u.x=-e*Math.cos(i+A*s)*Math.sin(o+v*a),u.y=e*Math.cos(o+v*a),u.z=e*Math.sin(i+A*s)*Math.sin(o+v*a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),m.push(A+x,1-v),y.push(c++)}h.push(y)}for(let g=0;g<n;g++)for(let y=0;y<t;y++){const v=h[g][y+1],x=h[g][y],R=h[g+1][y],A=h[g+1][y+1];(g!==0||o>0)&&f.push(v,x,A),(g!==n-1||l<Math.PI)&&f.push(x,R,A)}this.setIndex(f),this.setAttribute("position",new Ee(p,3)),this.setAttribute("normal",new Ee(_,3)),this.setAttribute("uv",new Ee(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new hi(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class hc extends ji{constructor(e=1,t=0){const n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],i=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,i,e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new hc(e.radius,e.detail)}}class uc extends Ve{constructor(e=1,t=.4,n=12,i=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:s},n=Math.floor(n),i=Math.floor(i);const o=[],a=[],l=[],c=[],h=new S,u=new S,d=new S;for(let f=0;f<=n;f++)for(let p=0;p<=i;p++){const _=p/i*s,m=f/n*Math.PI*2;u.x=(e+t*Math.cos(m))*Math.cos(_),u.y=(e+t*Math.cos(m))*Math.sin(_),u.z=t*Math.sin(m),a.push(u.x,u.y,u.z),h.x=e*Math.cos(_),h.y=e*Math.sin(_),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(p/i),c.push(f/n)}for(let f=1;f<=n;f++)for(let p=1;p<=i;p++){const _=(i+1)*f+p-1,m=(i+1)*(f-1)+p-1,g=(i+1)*(f-1)+p,y=(i+1)*f+p;o.push(_,m,y),o.push(m,g,y)}this.setIndex(o),this.setAttribute("position",new Ee(a,3)),this.setAttribute("normal",new Ee(l,3)),this.setAttribute("uv",new Ee(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new uc(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class dc extends Ve{constructor(e=1,t=.4,n=64,i=8,s=2,o=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:e,tube:t,tubularSegments:n,radialSegments:i,p:s,q:o},n=Math.floor(n),i=Math.floor(i);const a=[],l=[],c=[],h=[],u=new S,d=new S,f=new S,p=new S,_=new S,m=new S,g=new S;for(let v=0;v<=n;++v){const x=v/n*s*Math.PI*2;y(x,s,o,e,f),y(x+.01,s,o,e,p),m.subVectors(p,f),g.addVectors(p,f),_.crossVectors(m,g),g.crossVectors(_,m),_.normalize(),g.normalize();for(let R=0;R<=i;++R){const A=R/i*Math.PI*2,T=-t*Math.cos(A),I=t*Math.sin(A);u.x=f.x+(T*g.x+I*_.x),u.y=f.y+(T*g.y+I*_.y),u.z=f.z+(T*g.z+I*_.z),l.push(u.x,u.y,u.z),d.subVectors(u,f).normalize(),c.push(d.x,d.y,d.z),h.push(v/n),h.push(R/i)}}for(let v=1;v<=n;v++)for(let x=1;x<=i;x++){const R=(i+1)*(v-1)+(x-1),A=(i+1)*v+(x-1),T=(i+1)*v+x,I=(i+1)*(v-1)+x;a.push(R,A,I),a.push(A,T,I)}this.setIndex(a),this.setAttribute("position",new Ee(l,3)),this.setAttribute("normal",new Ee(c,3)),this.setAttribute("uv",new Ee(h,2));function y(v,x,R,A,T){const I=Math.cos(v),F=Math.sin(v),M=R/x*v,w=Math.cos(M);T.x=A*(2+w)*.5*I,T.y=A*(2+w)*F*.5,T.z=A*Math.sin(M)*.5}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new dc(e.radius,e.tube,e.tubularSegments,e.radialSegments,e.p,e.q)}}class fc extends Ve{constructor(e=new Fu(new S(-1,-1,0),new S(-1,1,0),new S(1,1,0)),t=64,n=1,i=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:i,closed:s};const o=e.computeFrenetFrames(t,s);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;const a=new S,l=new S,c=new W;let h=new S;const u=[],d=[],f=[],p=[];_(),this.setIndex(p),this.setAttribute("position",new Ee(u,3)),this.setAttribute("normal",new Ee(d,3)),this.setAttribute("uv",new Ee(f,2));function _(){for(let v=0;v<t;v++)m(v);m(s===!1?t:0),y(),g()}function m(v){h=e.getPointAt(v/t,h);const x=o.normals[v],R=o.binormals[v];for(let A=0;A<=i;A++){const T=A/i*Math.PI*2,I=Math.sin(T),F=-Math.cos(T);l.x=F*x.x+I*R.x,l.y=F*x.y+I*R.y,l.z=F*x.z+I*R.z,l.normalize(),d.push(l.x,l.y,l.z),a.x=h.x+n*l.x,a.y=h.y+n*l.y,a.z=h.z+n*l.z,u.push(a.x,a.y,a.z)}}function g(){for(let v=1;v<=t;v++)for(let x=1;x<=i;x++){const R=(i+1)*(v-1)+(x-1),A=(i+1)*v+(x-1),T=(i+1)*v+x,I=(i+1)*(v-1)+x;p.push(R,A,I),p.push(A,T,I)}}function y(){for(let v=0;v<=t;v++)for(let x=0;x<=i;x++)c.x=v/t,c.y=x/i,f.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new fc(new Ul[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}}class Cm extends Ve{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){const t=[],n=new Set,i=new S,s=new S;if(e.index!==null){const o=e.attributes.position,a=e.index;let l=e.groups;l.length===0&&(l=[{start:0,count:a.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){const u=l[c],d=u.start,f=u.count;for(let p=d,_=d+f;p<_;p+=3)for(let m=0;m<3;m++){const g=a.getX(p+m),y=a.getX(p+(m+1)%3);i.fromBufferAttribute(o,g),s.fromBufferAttribute(o,y),Sf(i,s,n)===!0&&(t.push(i.x,i.y,i.z),t.push(s.x,s.y,s.z))}}}else{const o=e.attributes.position;for(let a=0,l=o.count/3;a<l;a++)for(let c=0;c<3;c++){const h=3*a+c,u=3*a+(c+1)%3;i.fromBufferAttribute(o,h),s.fromBufferAttribute(o,u),Sf(i,s,n)===!0&&(t.push(i.x,i.y,i.z),t.push(s.x,s.y,s.z))}}this.setAttribute("position",new Ee(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}function Sf(r,e,t){const n=`${r.x},${r.y},${r.z}-${e.x},${e.y},${e.z}`,i=`${e.x},${e.y},${e.z}-${r.x},${r.y},${r.z}`;return t.has(n)===!0||t.has(i)===!0?!1:(t.add(n),t.add(i),!0)}var bf=Object.freeze({__proto__:null,BoxGeometry:it,CapsuleGeometry:zo,CircleGeometry:Ho,ConeGeometry:Dr,CylinderGeometry:dt,DodecahedronGeometry:Go,EdgesGeometry:wm,ExtrudeGeometry:Xn,IcosahedronGeometry:lc,LatheGeometry:Bs,OctahedronGeometry:Vo,PlaneGeometry:In,PolyhedronGeometry:ji,RingGeometry:Ur,ShapeGeometry:cc,SphereGeometry:hi,TetrahedronGeometry:hc,TorusGeometry:uc,TorusKnotGeometry:dc,TubeGeometry:fc,WireframeGeometry:Cm});class Rm extends Bt{constructor(e){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new oe(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}}class ku extends Ft{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class $e extends Bt{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new oe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new oe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ji,this.normalScale=new W(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Zt,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Dn extends $e{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new W(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return At(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new oe(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new oe(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new oe(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class Pm extends Bt{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new oe(16777215),this.specular=new oe(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new oe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ji,this.normalScale=new W(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Zt,this.combine=Lo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Im extends Bt{constructor(e){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new oe(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new oe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ji,this.normalScale=new W(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.gradientMap=e.gradientMap,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}class Lm extends Bt{constructor(e){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ji,this.normalScale=new W(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}}class Nm extends Bt{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new oe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new oe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ji,this.normalScale=new W(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Zt,this.combine=Lo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Dm extends Bt{constructor(e){super(),this.isMeshMatcapMaterial=!0,this.defines={MATCAP:""},this.type="MeshMatcapMaterial",this.color=new oe(16777215),this.matcap=null,this.map=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ji,this.normalScale=new W(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={MATCAP:""},this.color.copy(e.color),this.matcap=e.matcap,this.map=e.map,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Um extends Jt{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}}function bs(r,e,t){return!r||!t&&r.constructor===e?r:typeof e.BYTES_PER_ELEMENT=="number"?new e(r):Array.prototype.slice.call(r)}function Om(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)}function Fm(r){function e(i,s){return r[i]-r[s]}const t=r.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function Wh(r,e,t){const n=r.length,i=new r.constructor(n);for(let s=0,o=0;o!==n;++s){const a=t[s]*e;for(let l=0;l!==e;++l)i[o++]=r[a+l]}return i}function zu(r,e,t,n){let i=1,s=r[0];for(;s!==void 0&&s[n]===void 0;)s=r[i++];if(s===void 0)return;let o=s[n];if(o!==void 0)if(Array.isArray(o))do o=s[n],o!==void 0&&(e.push(s.time),t.push.apply(t,o)),s=r[i++];while(s!==void 0);else if(o.toArray!==void 0)do o=s[n],o!==void 0&&(e.push(s.time),o.toArray(t,t.length)),s=r[i++];while(s!==void 0);else do o=s[n],o!==void 0&&(e.push(s.time),t.push(o)),s=r[i++];while(s!==void 0)}function vS(r,e,t,n,i=30){const s=r.clone();s.name=e;const o=[];for(let l=0;l<s.tracks.length;++l){const c=s.tracks[l],h=c.getValueSize(),u=[],d=[];for(let f=0;f<c.times.length;++f){const p=c.times[f]*i;if(!(p<t||p>=n)){u.push(c.times[f]);for(let _=0;_<h;++_)d.push(c.values[f*h+_])}}u.length!==0&&(c.times=bs(u,c.times.constructor),c.values=bs(d,c.values.constructor),o.push(c))}s.tracks=o;let a=1/0;for(let l=0;l<s.tracks.length;++l)a>s.tracks[l].times[0]&&(a=s.tracks[l].times[0]);for(let l=0;l<s.tracks.length;++l)s.tracks[l].shift(-1*a);return s.resetDuration(),s}function yS(r,e=0,t=r,n=30){n<=0&&(n=30);const i=t.tracks.length,s=e/n;for(let o=0;o<i;++o){const a=t.tracks[o],l=a.ValueTypeName;if(l==="bool"||l==="string")continue;const c=r.tracks.find(function(g){return g.name===a.name&&g.ValueTypeName===l});if(c===void 0)continue;let h=0;const u=a.getValueSize();a.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(h=u/3);let d=0;const f=c.getValueSize();c.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(d=f/3);const p=a.times.length-1;let _;if(s<=a.times[0]){const g=h,y=u-h;_=a.values.slice(g,y)}else if(s>=a.times[p]){const g=p*u+h,y=g+u-h;_=a.values.slice(g,y)}else{const g=a.createInterpolant(),y=h,v=u-h;g.evaluate(s),_=g.resultBuffer.slice(y,v)}l==="quaternion"&&new ct().fromArray(_).normalize().conjugate().toArray(_);const m=c.times.length;for(let g=0;g<m;++g){const y=g*f+d;if(l==="quaternion")ct.multiplyQuaternionsFlat(c.values,y,_,0,c.values,y);else{const v=f-d*2;for(let x=0;x<v;++x)c.values[y+x]-=_[x]}}}return r.blendMode=_u,r}const xS={convertArray:bs,isTypedArray:Om,getKeyframeOrder:Fm,sortedArray:Wh,flattenJSON:zu,subclip:vS,makeClipAdditive:yS};class Or{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],s=t[n-1];e:{t:{let o;n:{i:if(!(e<i)){for(let a=n+2;;){if(i===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(s=i,i=t[++n],e<i)break t}o=t.length;break n}if(!(e>=s)){const a=t[1];e<a&&(n=2,s=a);for(let l=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=s,s=t[--n-1],e>=s)break t}o=n,n=0;break n}break e}for(;n<o;){const a=n+o>>>1;e<t[a]?o=a:n=a+1}if(i=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i;for(let o=0;o!==i;++o)t[o]=n[s+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class Bm extends Or{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:xs,endingEnd:xs}}intervalChanged_(e,t,n){const i=this.parameterPositions;let s=e-2,o=e+1,a=i[s],l=i[o];if(a===void 0)switch(this.getSettings_().endingStart){case Ms:s=e,a=2*t-n;break;case mo:s=i.length-2,a=t+i[s]-i[s+1];break;default:s=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Ms:o=e,l=2*n-t;break;case mo:o=1,l=n+i[1]-i[0];break;default:o=e-1,l=t}const c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=s*h,this._offsetNext=o*h}interpolate_(e,t,n,i){const s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(i-t),_=p*p,m=_*p,g=-d*m+2*d*_-d*p,y=(1+d)*m+(-1.5-2*d)*_+(-.5+d)*p+1,v=(-1-f)*m+(1.5+f)*_+.5*p,x=f*m-f*_;for(let R=0;R!==a;++R)s[R]=g*o[h+R]+y*o[c+R]+v*o[l+R]+x*o[u+R];return s}}class Hu extends Or{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=(n-t)/(i-t),u=1-h;for(let d=0;d!==a;++d)s[d]=o[c+d]*u+o[l+d]*h;return s}}class km extends Or{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class Zn{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=bs(t,this.TimeBufferType),this.values=bs(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:bs(e.times,Array),values:bs(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new km(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Hu(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Bm(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Sr:t=this.InterpolantFactoryMethodDiscrete;break;case br:t=this.InterpolantFactoryMethodLinear;break;case qa:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Sr;case this.InterpolantFactoryMethodLinear:return br;case this.InterpolantFactoryMethodSmooth:return qa}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){const n=this.times,i=n.length;let s=0,o=i-1;for(;s!==i&&n[s]<e;)++s;for(;o!==-1&&n[o]>t;)--o;if(++o,s!==0||o!==i){s>=o&&(o=Math.max(o,1),s=o-1);const a=this.getValueSize();this.times=n.slice(s,o),this.values=this.values.slice(s*a,o*a)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,s=n.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==s;a++){const l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(i!==void 0&&Om(i))for(let a=0,l=i.length;a!==l;++a){const c=i[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===qa,s=e.length-1;let o=1;for(let a=1;a<s;++a){let l=!1;const c=e[a],h=e[a+1];if(c!==h&&(a!==1||c!==e[0]))if(i)l=!0;else{const u=a*n,d=u-n,f=u+n;for(let p=0;p!==n;++p){const _=t[u+p];if(_!==t[d+p]||_!==t[f+p]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];const u=a*n,d=o*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++o}}if(s>0){e[o]=e[s];for(let a=s*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}}Zn.prototype.TimeBufferType=Float32Array;Zn.prototype.ValueBufferType=Float32Array;Zn.prototype.DefaultInterpolation=br;class ks extends Zn{constructor(e,t,n){super(e,t,n)}}ks.prototype.ValueTypeName="bool";ks.prototype.ValueBufferType=Array;ks.prototype.DefaultInterpolation=Sr;ks.prototype.InterpolantFactoryMethodLinear=void 0;ks.prototype.InterpolantFactoryMethodSmooth=void 0;class Gu extends Zn{}Gu.prototype.ValueTypeName="color";class Ds extends Zn{}Ds.prototype.ValueTypeName="number";class zm extends Or{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(i-t);let c=e*a;for(let h=c+a;c!==h;c+=4)ct.slerpFlat(s,0,o,c-a,o,c,l);return s}}class Us extends Zn{InterpolantFactoryMethodLinear(e){return new zm(this.times,this.values,this.getValueSize(),e)}}Us.prototype.ValueTypeName="quaternion";Us.prototype.InterpolantFactoryMethodSmooth=void 0;class zs extends Zn{constructor(e,t,n){super(e,t,n)}}zs.prototype.ValueTypeName="string";zs.prototype.ValueBufferType=Array;zs.prototype.DefaultInterpolation=Sr;zs.prototype.InterpolantFactoryMethodLinear=void 0;zs.prototype.InterpolantFactoryMethodSmooth=void 0;class Os extends Zn{}Os.prototype.ValueTypeName="vector";class Ar{constructor(e="",t=-1,n=[],i=Zl){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=Ln(),this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let o=0,a=n.length;o!==a;++o)t.push(SS(n[o]).scale(i));const s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let s=0,o=n.length;s!==o;++s)t.push(Zn.toJSON(n[s]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const s=t.length,o=[];for(let a=0;a<s;a++){let l=[],c=[];l.push((a+s-1)%s,a,(a+1)%s),c.push(0,1,0);const h=Fm(l);l=Wh(l,1,h),c=Wh(c,1,h),!i&&l[0]===0&&(l.push(s),c.push(c[0])),o.push(new Ds(".morphTargetInfluences["+t[a].name+"]",l,c).scale(1/n))}return new this(e,-1,o)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},s=/^([\w-]*?)([\d]+)$/;for(let a=0,l=e.length;a<l;a++){const c=e[a],h=c.name.match(s);if(h&&h.length>1){const u=h[1];let d=i[u];d||(i[u]=d=[]),d.push(c)}}const o=[];for(const a in i)o.push(this.CreateFromMorphTargetSequence(a,i[a],t,n));return o}static parseAnimation(e,t){if(!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const n=function(u,d,f,p,_){if(f.length!==0){const m=[],g=[];zu(f,m,g,p),m.length!==0&&_.push(new u(d,m,g))}},i=[],s=e.name||"default",o=e.fps||30,a=e.blendMode;let l=e.length||-1;const c=e.hierarchy||[];for(let u=0;u<c.length;u++){const d=c[u].keys;if(!(!d||d.length===0))if(d[0].morphTargets){const f={};let p;for(p=0;p<d.length;p++)if(d[p].morphTargets)for(let _=0;_<d[p].morphTargets.length;_++)f[d[p].morphTargets[_]]=-1;for(const _ in f){const m=[],g=[];for(let y=0;y!==d[p].morphTargets.length;++y){const v=d[p];m.push(v.time),g.push(v.morphTarget===_?1:0)}i.push(new Ds(".morphTargetInfluence["+_+"]",m,g))}l=f.length*o}else{const f=".bones["+t[u].name+"]";n(Os,f+".position",d,"pos",i),n(Us,f+".quaternion",d,"rot",i),n(Os,f+".scale",d,"scl",i)}}return i.length===0?null:new this(s,l,i,a)}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const s=this.tracks[n];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}function MS(r){switch(r.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Ds;case"vector":case"vector2":case"vector3":case"vector4":return Os;case"color":return Gu;case"quaternion":return Us;case"bool":case"boolean":return ks;case"string":return zs}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+r)}function SS(r){if(r.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=MS(r.type);if(r.times===void 0){const t=[],n=[];zu(r.keys,t,n,"value"),r.times=t,r.values=n}return e.parse!==void 0?e.parse(r):new e(r.name,r.times,r.values,r.interpolation)}const Mi={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(this.files[r]=e)},get:function(r){if(this.enabled!==!1)return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}};class Vu{constructor(e,t,n){const i=this;let s=!1,o=0,a=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(h){a++,s===!1&&i.onStart!==void 0&&i.onStart(h,o,a),s=!0},this.itemEnd=function(h){o++,i.onProgress!==void 0&&i.onProgress(h,o,a),o===a&&(s=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){const u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){const f=c[u],p=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return p}return null}}}const Hm=new Vu;class fn{constructor(e){this.manager=e!==void 0?e:Hm,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,s){n.load(e,i,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}fn.DEFAULT_MATERIAL_NAME="__DEFAULT";const _i={};class bS extends Error{constructor(e,t){super(e),this.response=t}}class Yn extends fn{constructor(e){super(e)}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=Mi.get(e);if(s!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0),s;if(_i[e]!==void 0){_i[e].push({onLoad:t,onProgress:n,onError:i});return}_i[e]=[],_i[e].push({onLoad:t,onProgress:n,onError:i});const o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),a=this.mimeType,l=this.responseType;fetch(o).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const h=_i[e],u=c.body.getReader(),d=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=d?parseInt(d):0,p=f!==0;let _=0;const m=new ReadableStream({start(g){y();function y(){u.read().then(({done:v,value:x})=>{if(v)g.close();else{_+=x.byteLength;const R=new ProgressEvent("progress",{lengthComputable:p,loaded:_,total:f});for(let A=0,T=h.length;A<T;A++){const I=h[A];I.onProgress&&I.onProgress(R)}g.enqueue(x),y()}},v=>{g.error(v)})}}});return new Response(m)}else throw new bS(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return c.json();default:if(a===void 0)return c.text();{const u=/charset="?([^;"\s]*)"?/i.exec(a),d=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(d);return c.arrayBuffer().then(p=>f.decode(p))}}}).then(c=>{Mi.add(e,c);const h=_i[e];delete _i[e];for(let u=0,d=h.length;u<d;u++){const f=h[u];f.onLoad&&f.onLoad(c)}}).catch(c=>{const h=_i[e];if(h===void 0)throw this.manager.itemError(e),c;delete _i[e];for(let u=0,d=h.length;u<d;u++){const f=h[u];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class wS extends fn{constructor(e){super(e)}load(e,t,n,i){const s=this,o=new Yn(this.manager);o.setPath(this.path),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(e,function(a){try{t(s.parse(JSON.parse(a)))}catch(l){i?i(l):console.error(l),s.manager.itemError(e)}},n,i)}parse(e){const t=[];for(let n=0;n<e.length;n++){const i=Ar.parse(e[n]);t.push(i)}return t}}class TS extends fn{constructor(e){super(e)}load(e,t,n,i){const s=this,o=[],a=new rc,l=new Yn(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(s.withCredentials);let c=0;function h(u){l.load(e[u],function(d){const f=s.parse(d,!0);o[u]={width:f.width,height:f.height,format:f.format,mipmaps:f.mipmaps},c+=1,c===6&&(f.mipmapCount===1&&(a.minFilter=Et),a.image=o,a.format=f.format,a.needsUpdate=!0,t&&t(a))},n,i)}if(Array.isArray(e))for(let u=0,d=e.length;u<d;++u)h(u);else l.load(e,function(u){const d=s.parse(u,!0);if(d.isCubemap){const f=d.mipmaps.length/d.mipmapCount;for(let p=0;p<f;p++){o[p]={mipmaps:[]};for(let _=0;_<d.mipmapCount;_++)o[p].mipmaps.push(d.mipmaps[p*d.mipmapCount+_]),o[p].format=d.format,o[p].width=d.width,o[p].height=d.height}a.image=o}else a.image.width=d.width,a.image.height=d.height,a.mipmaps=d.mipmaps;d.mipmapCount===1&&(a.minFilter=Et),a.format=d.format,a.needsUpdate=!0,t&&t(a)},n,i);return a}}class Eo extends fn{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,o=Mi.get(e);if(o!==void 0)return s.manager.itemStart(e),setTimeout(function(){t&&t(o),s.manager.itemEnd(e)},0),o;const a=Mo("img");function l(){h(),Mi.add(e,this),t&&t(this),s.manager.itemEnd(e)}function c(u){h(),i&&i(u),s.manager.itemError(e),s.manager.itemEnd(e)}function h(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),s.manager.itemStart(e),a.src=e,a}}class AS extends fn{constructor(e){super(e)}load(e,t,n,i){const s=new Uo;s.colorSpace=Nt;const o=new Eo(this.manager);o.setCrossOrigin(this.crossOrigin),o.setPath(this.path);let a=0;function l(c){o.load(e[c],function(h){s.images[c]=h,a++,a===6&&(s.needsUpdate=!0,t&&t(s))},void 0,i)}for(let c=0;c<e.length;++c)l(c);return s}}class ES extends fn{constructor(e){super(e)}load(e,t,n,i){const s=this,o=new ii,a=new Yn(this.manager);return a.setResponseType("arraybuffer"),a.setRequestHeader(this.requestHeader),a.setPath(this.path),a.setWithCredentials(s.withCredentials),a.load(e,function(l){let c;try{c=s.parse(l)}catch(h){if(i!==void 0)i(h);else{console.error(h);return}}c.image!==void 0?o.image=c.image:c.data!==void 0&&(o.image.width=c.width,o.image.height=c.height,o.image.data=c.data),o.wrapS=c.wrapS!==void 0?c.wrapS:Pn,o.wrapT=c.wrapT!==void 0?c.wrapT:Pn,o.magFilter=c.magFilter!==void 0?c.magFilter:Et,o.minFilter=c.minFilter!==void 0?c.minFilter:Et,o.anisotropy=c.anisotropy!==void 0?c.anisotropy:1,c.colorSpace!==void 0&&(o.colorSpace=c.colorSpace),c.flipY!==void 0&&(o.flipY=c.flipY),c.format!==void 0&&(o.format=c.format),c.type!==void 0&&(o.type=c.type),c.mipmaps!==void 0&&(o.mipmaps=c.mipmaps,o.minFilter=Bn),c.mipmapCount===1&&(o.minFilter=Et),c.generateMipmaps!==void 0&&(o.generateMipmaps=c.generateMipmaps),o.needsUpdate=!0,t&&t(o,c)},n,i),o}}class Gm extends fn{constructor(e){super(e)}load(e,t,n,i){const s=new St,o=new Eo(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){s.image=a,s.needsUpdate=!0,t!==void 0&&t(s)},n,i),s}}class Qi extends Ze{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new oe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Wu extends Qi{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ze.DEFAULT_UP),this.updateMatrix(),this.groundColor=new oe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const dh=new Pe,wf=new S,Tf=new S;class qu{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new W(512,512),this.map=null,this.mapPass=null,this.matrix=new Pe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Oo,this._frameExtents=new W(1,1),this._viewportCount=1,this._viewports=[new tt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;wf.setFromMatrixPosition(e.matrixWorld),t.position.copy(wf),Tf.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Tf),t.updateMatrixWorld(),dh.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(dh),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(dh)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class CS extends qu{constructor(){super(new Dt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){const t=this.camera,n=wr*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height,s=e.distance||t.far;(n!==t.fov||i!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=i,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class Xu extends Qi{constructor(e,t,n=0,i=Math.PI/3,s=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Ze.DEFAULT_UP),this.updateMatrix(),this.target=new Ze,this.distance=n,this.angle=i,this.penumbra=s,this.decay=o,this.map=null,this.shadow=new CS}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const Af=new Pe,Jr=new S,fh=new S;class RS extends qu{constructor(){super(new Dt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new W(4,2),this._viewportCount=6,this._viewports=[new tt(2,1,1,1),new tt(0,1,1,1),new tt(3,1,1,1),new tt(1,1,1,1),new tt(3,0,1,1),new tt(1,0,1,1)],this._cubeDirections=[new S(1,0,0),new S(-1,0,0),new S(0,0,1),new S(0,0,-1),new S(0,1,0),new S(0,-1,0)],this._cubeUps=[new S(0,1,0),new S(0,1,0),new S(0,1,0),new S(0,1,0),new S(0,0,1),new S(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,i=this.matrix,s=e.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),Jr.setFromMatrixPosition(e.matrixWorld),n.position.copy(Jr),fh.copy(n.position),fh.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(fh),n.updateMatrixWorld(),i.makeTranslation(-Jr.x,-Jr.y,-Jr.z),Af.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Af)}}class Si extends Qi{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new RS}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class PS extends qu{constructor(){super(new Lr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Wo extends Qi{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ze.DEFAULT_UP),this.updateMatrix(),this.target=new Ze,this.shadow=new PS}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Yu extends Qi{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class Vm extends Qi{constructor(e,t,n=10,i=10){super(e,t),this.isRectAreaLight=!0,this.type="RectAreaLight",this.width=n,this.height=i}get power(){return this.intensity*this.width*this.height*Math.PI}set power(e){this.intensity=e/(this.width*this.height*Math.PI)}copy(e){return super.copy(e),this.width=e.width,this.height=e.height,this}toJSON(e){const t=super.toJSON(e);return t.object.width=this.width,t.object.height=this.height,t}}class Wm{constructor(){this.isSphericalHarmonics3=!0,this.coefficients=[];for(let e=0;e<9;e++)this.coefficients.push(new S)}set(e){for(let t=0;t<9;t++)this.coefficients[t].copy(e[t]);return this}zero(){for(let e=0;e<9;e++)this.coefficients[e].set(0,0,0);return this}getAt(e,t){const n=e.x,i=e.y,s=e.z,o=this.coefficients;return t.copy(o[0]).multiplyScalar(.282095),t.addScaledVector(o[1],.488603*i),t.addScaledVector(o[2],.488603*s),t.addScaledVector(o[3],.488603*n),t.addScaledVector(o[4],1.092548*(n*i)),t.addScaledVector(o[5],1.092548*(i*s)),t.addScaledVector(o[6],.315392*(3*s*s-1)),t.addScaledVector(o[7],1.092548*(n*s)),t.addScaledVector(o[8],.546274*(n*n-i*i)),t}getIrradianceAt(e,t){const n=e.x,i=e.y,s=e.z,o=this.coefficients;return t.copy(o[0]).multiplyScalar(.886227),t.addScaledVector(o[1],2*.511664*i),t.addScaledVector(o[2],2*.511664*s),t.addScaledVector(o[3],2*.511664*n),t.addScaledVector(o[4],2*.429043*n*i),t.addScaledVector(o[5],2*.429043*i*s),t.addScaledVector(o[6],.743125*s*s-.247708),t.addScaledVector(o[7],2*.429043*n*s),t.addScaledVector(o[8],.429043*(n*n-i*i)),t}add(e){for(let t=0;t<9;t++)this.coefficients[t].add(e.coefficients[t]);return this}addScaledSH(e,t){for(let n=0;n<9;n++)this.coefficients[n].addScaledVector(e.coefficients[n],t);return this}scale(e){for(let t=0;t<9;t++)this.coefficients[t].multiplyScalar(e);return this}lerp(e,t){for(let n=0;n<9;n++)this.coefficients[n].lerp(e.coefficients[n],t);return this}equals(e){for(let t=0;t<9;t++)if(!this.coefficients[t].equals(e.coefficients[t]))return!1;return!0}copy(e){return this.set(e.coefficients)}clone(){return new this.constructor().copy(this)}fromArray(e,t=0){const n=this.coefficients;for(let i=0;i<9;i++)n[i].fromArray(e,t+i*3);return this}toArray(e=[],t=0){const n=this.coefficients;for(let i=0;i<9;i++)n[i].toArray(e,t+i*3);return e}static getBasisAt(e,t){const n=e.x,i=e.y,s=e.z;t[0]=.282095,t[1]=.488603*i,t[2]=.488603*s,t[3]=.488603*n,t[4]=1.092548*n*i,t[5]=1.092548*i*s,t[6]=.315392*(3*s*s-1),t[7]=1.092548*n*s,t[8]=.546274*(n*n-i*i)}}class qm extends Qi{constructor(e=new Wm,t=1){super(void 0,t),this.isLightProbe=!0,this.sh=e}copy(e){return super.copy(e),this.sh.copy(e.sh),this}fromJSON(e){return this.intensity=e.intensity,this.sh.fromArray(e.sh),this}toJSON(e){const t=super.toJSON(e);return t.object.sh=this.sh.toArray(),t}}class pc extends fn{constructor(e){super(e),this.textures={}}load(e,t,n,i){const s=this,o=new Yn(s.manager);o.setPath(s.path),o.setRequestHeader(s.requestHeader),o.setWithCredentials(s.withCredentials),o.load(e,function(a){try{t(s.parse(JSON.parse(a)))}catch(l){i?i(l):console.error(l),s.manager.itemError(e)}},n,i)}parse(e){const t=this.textures;function n(s){return t[s]===void 0&&console.warn("THREE.MaterialLoader: Undefined texture",s),t[s]}const i=this.createMaterialFromType(e.type);if(e.uuid!==void 0&&(i.uuid=e.uuid),e.name!==void 0&&(i.name=e.name),e.color!==void 0&&i.color!==void 0&&i.color.setHex(e.color),e.roughness!==void 0&&(i.roughness=e.roughness),e.metalness!==void 0&&(i.metalness=e.metalness),e.sheen!==void 0&&(i.sheen=e.sheen),e.sheenColor!==void 0&&(i.sheenColor=new oe().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(i.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&i.emissive!==void 0&&i.emissive.setHex(e.emissive),e.specular!==void 0&&i.specular!==void 0&&i.specular.setHex(e.specular),e.specularIntensity!==void 0&&(i.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&i.specularColor!==void 0&&i.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(i.shininess=e.shininess),e.clearcoat!==void 0&&(i.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(i.dispersion=e.dispersion),e.iridescence!==void 0&&(i.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(i.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(i.transmission=e.transmission),e.thickness!==void 0&&(i.thickness=e.thickness),e.attenuationDistance!==void 0&&(i.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&i.attenuationColor!==void 0&&i.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(i.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(i.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(i.fog=e.fog),e.flatShading!==void 0&&(i.flatShading=e.flatShading),e.blending!==void 0&&(i.blending=e.blending),e.combine!==void 0&&(i.combine=e.combine),e.side!==void 0&&(i.side=e.side),e.shadowSide!==void 0&&(i.shadowSide=e.shadowSide),e.opacity!==void 0&&(i.opacity=e.opacity),e.transparent!==void 0&&(i.transparent=e.transparent),e.alphaTest!==void 0&&(i.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(i.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(i.depthFunc=e.depthFunc),e.depthTest!==void 0&&(i.depthTest=e.depthTest),e.depthWrite!==void 0&&(i.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(i.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(i.blendSrc=e.blendSrc),e.blendDst!==void 0&&(i.blendDst=e.blendDst),e.blendEquation!==void 0&&(i.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(i.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(i.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(i.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&i.blendColor!==void 0&&i.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(i.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(i.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(i.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(i.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(i.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(i.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(i.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(i.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(i.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(i.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(i.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(i.rotation=e.rotation),e.linewidth!==void 0&&(i.linewidth=e.linewidth),e.dashSize!==void 0&&(i.dashSize=e.dashSize),e.gapSize!==void 0&&(i.gapSize=e.gapSize),e.scale!==void 0&&(i.scale=e.scale),e.polygonOffset!==void 0&&(i.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(i.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(i.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(i.dithering=e.dithering),e.alphaToCoverage!==void 0&&(i.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(i.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(i.forceSinglePass=e.forceSinglePass),e.visible!==void 0&&(i.visible=e.visible),e.toneMapped!==void 0&&(i.toneMapped=e.toneMapped),e.userData!==void 0&&(i.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?i.vertexColors=e.vertexColors>0:i.vertexColors=e.vertexColors),e.uniforms!==void 0)for(const s in e.uniforms){const o=e.uniforms[s];switch(i.uniforms[s]={},o.type){case"t":i.uniforms[s].value=n(o.value);break;case"c":i.uniforms[s].value=new oe().setHex(o.value);break;case"v2":i.uniforms[s].value=new W().fromArray(o.value);break;case"v3":i.uniforms[s].value=new S().fromArray(o.value);break;case"v4":i.uniforms[s].value=new tt().fromArray(o.value);break;case"m3":i.uniforms[s].value=new qe().fromArray(o.value);break;case"m4":i.uniforms[s].value=new Pe().fromArray(o.value);break;default:i.uniforms[s].value=o.value}}if(e.defines!==void 0&&(i.defines=e.defines),e.vertexShader!==void 0&&(i.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(i.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(i.glslVersion=e.glslVersion),e.extensions!==void 0)for(const s in e.extensions)i.extensions[s]=e.extensions[s];if(e.lights!==void 0&&(i.lights=e.lights),e.clipping!==void 0&&(i.clipping=e.clipping),e.size!==void 0&&(i.size=e.size),e.sizeAttenuation!==void 0&&(i.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(i.map=n(e.map)),e.matcap!==void 0&&(i.matcap=n(e.matcap)),e.alphaMap!==void 0&&(i.alphaMap=n(e.alphaMap)),e.bumpMap!==void 0&&(i.bumpMap=n(e.bumpMap)),e.bumpScale!==void 0&&(i.bumpScale=e.bumpScale),e.normalMap!==void 0&&(i.normalMap=n(e.normalMap)),e.normalMapType!==void 0&&(i.normalMapType=e.normalMapType),e.normalScale!==void 0){let s=e.normalScale;Array.isArray(s)===!1&&(s=[s,s]),i.normalScale=new W().fromArray(s)}return e.displacementMap!==void 0&&(i.displacementMap=n(e.displacementMap)),e.displacementScale!==void 0&&(i.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(i.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(i.roughnessMap=n(e.roughnessMap)),e.metalnessMap!==void 0&&(i.metalnessMap=n(e.metalnessMap)),e.emissiveMap!==void 0&&(i.emissiveMap=n(e.emissiveMap)),e.emissiveIntensity!==void 0&&(i.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(i.specularMap=n(e.specularMap)),e.specularIntensityMap!==void 0&&(i.specularIntensityMap=n(e.specularIntensityMap)),e.specularColorMap!==void 0&&(i.specularColorMap=n(e.specularColorMap)),e.envMap!==void 0&&(i.envMap=n(e.envMap)),e.envMapRotation!==void 0&&i.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(i.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(i.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(i.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(i.lightMap=n(e.lightMap)),e.lightMapIntensity!==void 0&&(i.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(i.aoMap=n(e.aoMap)),e.aoMapIntensity!==void 0&&(i.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(i.gradientMap=n(e.gradientMap)),e.clearcoatMap!==void 0&&(i.clearcoatMap=n(e.clearcoatMap)),e.clearcoatRoughnessMap!==void 0&&(i.clearcoatRoughnessMap=n(e.clearcoatRoughnessMap)),e.clearcoatNormalMap!==void 0&&(i.clearcoatNormalMap=n(e.clearcoatNormalMap)),e.clearcoatNormalScale!==void 0&&(i.clearcoatNormalScale=new W().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(i.iridescenceMap=n(e.iridescenceMap)),e.iridescenceThicknessMap!==void 0&&(i.iridescenceThicknessMap=n(e.iridescenceThicknessMap)),e.transmissionMap!==void 0&&(i.transmissionMap=n(e.transmissionMap)),e.thicknessMap!==void 0&&(i.thicknessMap=n(e.thicknessMap)),e.anisotropyMap!==void 0&&(i.anisotropyMap=n(e.anisotropyMap)),e.sheenColorMap!==void 0&&(i.sheenColorMap=n(e.sheenColorMap)),e.sheenRoughnessMap!==void 0&&(i.sheenRoughnessMap=n(e.sheenRoughnessMap)),i}setTextures(e){return this.textures=e,this}createMaterialFromType(e){return pc.createMaterialFromType(e)}static createMaterialFromType(e){const t={ShadowMaterial:Rm,SpriteMaterial:Ru,RawShaderMaterial:ku,ShaderMaterial:Ft,PointsMaterial:sc,MeshPhysicalMaterial:Dn,MeshStandardMaterial:$e,MeshPhongMaterial:Pm,MeshToonMaterial:Im,MeshNormalMaterial:Lm,MeshLambertMaterial:Nm,MeshDepthMaterial:Au,MeshDistanceMaterial:Eu,MeshBasicMaterial:Ot,MeshMatcapMaterial:Dm,LineDashedMaterial:Um,LineBasicMaterial:Jt,Material:Bt};return new t[e]}}class qi{static decodeText(e){if(console.warn("THREE.LoaderUtils: decodeText() has been deprecated with r165 and will be removed with r175. Use TextDecoder instead."),typeof TextDecoder<"u")return new TextDecoder().decode(e);let t="";for(let n=0,i=e.length;n<i;n++)t+=String.fromCharCode(e[n]);try{return decodeURIComponent(escape(t))}catch{return t}}static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}class Xm extends Ve{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){const e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}}class Ym extends fn{constructor(e){super(e)}load(e,t,n,i){const s=this,o=new Yn(s.manager);o.setPath(s.path),o.setRequestHeader(s.requestHeader),o.setWithCredentials(s.withCredentials),o.load(e,function(a){try{t(s.parse(JSON.parse(a)))}catch(l){i?i(l):console.error(l),s.manager.itemError(e)}},n,i)}parse(e){const t={},n={};function i(f,p){if(t[p]!==void 0)return t[p];const m=f.interleavedBuffers[p],g=s(f,m.buffer),y=ur(m.type,g),v=new Bo(y,m.stride);return v.uuid=m.uuid,t[p]=v,v}function s(f,p){if(n[p]!==void 0)return n[p];const m=f.arrayBuffers[p],g=new Uint32Array(m).buffer;return n[p]=g,g}const o=e.isInstancedBufferGeometry?new Xm:new Ve,a=e.data.index;if(a!==void 0){const f=ur(a.type,a.array);o.setIndex(new st(f,1))}const l=e.data.attributes;for(const f in l){const p=l[f];let _;if(p.isInterleavedBufferAttribute){const m=i(e.data,p.data);_=new Zi(m,p.itemSize,p.offset,p.normalized)}else{const m=ur(p.type,p.array),g=p.isInstancedBufferAttribute?Ls:st;_=new g(m,p.itemSize,p.normalized)}p.name!==void 0&&(_.name=p.name),p.usage!==void 0&&_.setUsage(p.usage),o.setAttribute(f,_)}const c=e.data.morphAttributes;if(c)for(const f in c){const p=c[f],_=[];for(let m=0,g=p.length;m<g;m++){const y=p[m];let v;if(y.isInterleavedBufferAttribute){const x=i(e.data,y.data);v=new Zi(x,y.itemSize,y.offset,y.normalized)}else{const x=ur(y.type,y.array);v=new st(x,y.itemSize,y.normalized)}y.name!==void 0&&(v.name=y.name),_.push(v)}o.morphAttributes[f]=_}e.data.morphTargetsRelative&&(o.morphTargetsRelative=!0);const u=e.data.groups||e.data.drawcalls||e.data.offsets;if(u!==void 0)for(let f=0,p=u.length;f!==p;++f){const _=u[f];o.addGroup(_.start,_.count,_.materialIndex)}const d=e.data.boundingSphere;if(d!==void 0){const f=new S;d.center!==void 0&&f.fromArray(d.center),o.boundingSphere=new $t(f,d.radius)}return e.name&&(o.name=e.name),e.userData&&(o.userData=e.userData),o}}class IS extends fn{constructor(e){super(e)}load(e,t,n,i){const s=this,o=this.path===""?qi.extractUrlBase(e):this.path;this.resourcePath=this.resourcePath||o;const a=new Yn(this.manager);a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(e,function(l){let c=null;try{c=JSON.parse(l)}catch(u){i!==void 0&&i(u),console.error("THREE:ObjectLoader: Can't parse "+e+".",u.message);return}const h=c.metadata;if(h===void 0||h.type===void 0||h.type.toLowerCase()==="geometry"){i!==void 0&&i(new Error("THREE.ObjectLoader: Can't load "+e)),console.error("THREE.ObjectLoader: Can't load "+e);return}s.parse(c,t)},n,i)}async loadAsync(e,t){const n=this,i=this.path===""?qi.extractUrlBase(e):this.path;this.resourcePath=this.resourcePath||i;const s=new Yn(this.manager);s.setPath(this.path),s.setRequestHeader(this.requestHeader),s.setWithCredentials(this.withCredentials);const o=await s.loadAsync(e,t),a=JSON.parse(o),l=a.metadata;if(l===void 0||l.type===void 0||l.type.toLowerCase()==="geometry")throw new Error("THREE.ObjectLoader: Can't load "+e);return await n.parseAsync(a)}parse(e,t){const n=this.parseAnimations(e.animations),i=this.parseShapes(e.shapes),s=this.parseGeometries(e.geometries,i),o=this.parseImages(e.images,function(){t!==void 0&&t(c)}),a=this.parseTextures(e.textures,o),l=this.parseMaterials(e.materials,a),c=this.parseObject(e.object,s,l,a,n),h=this.parseSkeletons(e.skeletons,c);if(this.bindSkeletons(c,h),this.bindLightTargets(c),t!==void 0){let u=!1;for(const d in o)if(o[d].data instanceof HTMLImageElement){u=!0;break}u===!1&&t(c)}return c}async parseAsync(e){const t=this.parseAnimations(e.animations),n=this.parseShapes(e.shapes),i=this.parseGeometries(e.geometries,n),s=await this.parseImagesAsync(e.images),o=this.parseTextures(e.textures,s),a=this.parseMaterials(e.materials,o),l=this.parseObject(e.object,i,a,o,t),c=this.parseSkeletons(e.skeletons,l);return this.bindSkeletons(l,c),this.bindLightTargets(l),l}parseShapes(e){const t={};if(e!==void 0)for(let n=0,i=e.length;n<i;n++){const s=new bn().fromJSON(e[n]);t[s.uuid]=s}return t}parseSkeletons(e,t){const n={},i={};if(t.traverse(function(s){s.isBone&&(i[s.uuid]=s)}),e!==void 0)for(let s=0,o=e.length;s<o;s++){const a=new ko().fromJSON(e[s],i);n[a.uuid]=a}return n}parseGeometries(e,t){const n={};if(e!==void 0){const i=new Ym;for(let s=0,o=e.length;s<o;s++){let a;const l=e[s];switch(l.type){case"BufferGeometry":case"InstancedBufferGeometry":a=i.parse(l);break;default:l.type in bf?a=bf[l.type].fromJSON(l,t):console.warn(`THREE.ObjectLoader: Unsupported geometry type "${l.type}"`)}a.uuid=l.uuid,l.name!==void 0&&(a.name=l.name),l.userData!==void 0&&(a.userData=l.userData),n[l.uuid]=a}}return n}parseMaterials(e,t){const n={},i={};if(e!==void 0){const s=new pc;s.setTextures(t);for(let o=0,a=e.length;o<a;o++){const l=e[o];n[l.uuid]===void 0&&(n[l.uuid]=s.parse(l)),i[l.uuid]=n[l.uuid]}}return i}parseAnimations(e){const t={};if(e!==void 0)for(let n=0;n<e.length;n++){const i=e[n],s=Ar.parse(i);t[s.uuid]=s}return t}parseImages(e,t){const n=this,i={};let s;function o(l){return n.manager.itemStart(l),s.load(l,function(){n.manager.itemEnd(l)},void 0,function(){n.manager.itemError(l),n.manager.itemEnd(l)})}function a(l){if(typeof l=="string"){const c=l,h=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(c)?c:n.resourcePath+c;return o(h)}else return l.data?{data:ur(l.type,l.data),width:l.width,height:l.height}:null}if(e!==void 0&&e.length>0){const l=new Vu(t);s=new Eo(l),s.setCrossOrigin(this.crossOrigin);for(let c=0,h=e.length;c<h;c++){const u=e[c],d=u.url;if(Array.isArray(d)){const f=[];for(let p=0,_=d.length;p<_;p++){const m=d[p],g=a(m);g!==null&&(g instanceof HTMLImageElement?f.push(g):f.push(new ii(g.data,g.width,g.height)))}i[u.uuid]=new Ss(f)}else{const f=a(u.url);i[u.uuid]=new Ss(f)}}}return i}async parseImagesAsync(e){const t=this,n={};let i;async function s(o){if(typeof o=="string"){const a=o,l=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(a)?a:t.resourcePath+a;return await i.loadAsync(l)}else return o.data?{data:ur(o.type,o.data),width:o.width,height:o.height}:null}if(e!==void 0&&e.length>0){i=new Eo(this.manager),i.setCrossOrigin(this.crossOrigin);for(let o=0,a=e.length;o<a;o++){const l=e[o],c=l.url;if(Array.isArray(c)){const h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u],p=await s(f);p!==null&&(p instanceof HTMLImageElement?h.push(p):h.push(new ii(p.data,p.width,p.height)))}n[l.uuid]=new Ss(h)}else{const h=await s(l.url);n[l.uuid]=new Ss(h)}}}return n}parseTextures(e,t){function n(s,o){return typeof s=="number"?s:(console.warn("THREE.ObjectLoader.parseTexture: Constant should be in numeric form.",s),o[s])}const i={};if(e!==void 0)for(let s=0,o=e.length;s<o;s++){const a=e[s];a.image===void 0&&console.warn('THREE.ObjectLoader: No "image" specified for',a.uuid),t[a.image]===void 0&&console.warn("THREE.ObjectLoader: Undefined image",a.image);const l=t[a.image],c=l.data;let h;Array.isArray(c)?(h=new Uo,c.length===6&&(h.needsUpdate=!0)):(c&&c.data?h=new ii:h=new St,c&&(h.needsUpdate=!0)),h.source=l,h.uuid=a.uuid,a.name!==void 0&&(h.name=a.name),a.mapping!==void 0&&(h.mapping=n(a.mapping,LS)),a.channel!==void 0&&(h.channel=a.channel),a.offset!==void 0&&h.offset.fromArray(a.offset),a.repeat!==void 0&&h.repeat.fromArray(a.repeat),a.center!==void 0&&h.center.fromArray(a.center),a.rotation!==void 0&&(h.rotation=a.rotation),a.wrap!==void 0&&(h.wrapS=n(a.wrap[0],Ef),h.wrapT=n(a.wrap[1],Ef)),a.format!==void 0&&(h.format=a.format),a.internalFormat!==void 0&&(h.internalFormat=a.internalFormat),a.type!==void 0&&(h.type=a.type),a.colorSpace!==void 0&&(h.colorSpace=a.colorSpace),a.minFilter!==void 0&&(h.minFilter=n(a.minFilter,Cf)),a.magFilter!==void 0&&(h.magFilter=n(a.magFilter,Cf)),a.anisotropy!==void 0&&(h.anisotropy=a.anisotropy),a.flipY!==void 0&&(h.flipY=a.flipY),a.generateMipmaps!==void 0&&(h.generateMipmaps=a.generateMipmaps),a.premultiplyAlpha!==void 0&&(h.premultiplyAlpha=a.premultiplyAlpha),a.unpackAlignment!==void 0&&(h.unpackAlignment=a.unpackAlignment),a.compareFunction!==void 0&&(h.compareFunction=a.compareFunction),a.userData!==void 0&&(h.userData=a.userData),i[a.uuid]=h}return i}parseObject(e,t,n,i,s){let o;function a(d){return t[d]===void 0&&console.warn("THREE.ObjectLoader: Undefined geometry",d),t[d]}function l(d){if(d!==void 0){if(Array.isArray(d)){const f=[];for(let p=0,_=d.length;p<_;p++){const m=d[p];n[m]===void 0&&console.warn("THREE.ObjectLoader: Undefined material",m),f.push(n[m])}return f}return n[d]===void 0&&console.warn("THREE.ObjectLoader: Undefined material",d),n[d]}}function c(d){return i[d]===void 0&&console.warn("THREE.ObjectLoader: Undefined texture",d),i[d]}let h,u;switch(e.type){case"Scene":o=new Cu,e.background!==void 0&&(Number.isInteger(e.background)?o.background=new oe(e.background):o.background=c(e.background)),e.environment!==void 0&&(o.environment=c(e.environment)),e.fog!==void 0&&(e.fog.type==="Fog"?o.fog=new nc(e.fog.color,e.fog.near,e.fog.far):e.fog.type==="FogExp2"&&(o.fog=new Fo(e.fog.color,e.fog.density)),e.fog.name!==""&&(o.fog.name=e.fog.name)),e.backgroundBlurriness!==void 0&&(o.backgroundBlurriness=e.backgroundBlurriness),e.backgroundIntensity!==void 0&&(o.backgroundIntensity=e.backgroundIntensity),e.backgroundRotation!==void 0&&o.backgroundRotation.fromArray(e.backgroundRotation),e.environmentIntensity!==void 0&&(o.environmentIntensity=e.environmentIntensity),e.environmentRotation!==void 0&&o.environmentRotation.fromArray(e.environmentRotation);break;case"PerspectiveCamera":o=new Dt(e.fov,e.aspect,e.near,e.far),e.focus!==void 0&&(o.focus=e.focus),e.zoom!==void 0&&(o.zoom=e.zoom),e.filmGauge!==void 0&&(o.filmGauge=e.filmGauge),e.filmOffset!==void 0&&(o.filmOffset=e.filmOffset),e.view!==void 0&&(o.view=Object.assign({},e.view));break;case"OrthographicCamera":o=new Lr(e.left,e.right,e.top,e.bottom,e.near,e.far),e.zoom!==void 0&&(o.zoom=e.zoom),e.view!==void 0&&(o.view=Object.assign({},e.view));break;case"AmbientLight":o=new Yu(e.color,e.intensity);break;case"DirectionalLight":o=new Wo(e.color,e.intensity),o.target=e.target||"";break;case"PointLight":o=new Si(e.color,e.intensity,e.distance,e.decay);break;case"RectAreaLight":o=new Vm(e.color,e.intensity,e.width,e.height);break;case"SpotLight":o=new Xu(e.color,e.intensity,e.distance,e.angle,e.penumbra,e.decay),o.target=e.target||"";break;case"HemisphereLight":o=new Wu(e.color,e.groundColor,e.intensity);break;case"LightProbe":o=new qm().fromJSON(e);break;case"SkinnedMesh":h=a(e.geometry),u=l(e.material),o=new Pu(h,u),e.bindMode!==void 0&&(o.bindMode=e.bindMode),e.bindMatrix!==void 0&&o.bindMatrix.fromArray(e.bindMatrix),e.skeleton!==void 0&&(o.skeleton=e.skeleton);break;case"Mesh":h=a(e.geometry),u=l(e.material),o=new ce(h,u);break;case"InstancedMesh":h=a(e.geometry),u=l(e.material);const d=e.count,f=e.instanceMatrix,p=e.instanceColor;o=new So(h,u,d),o.instanceMatrix=new Ls(new Float32Array(f.array),16),p!==void 0&&(o.instanceColor=new Ls(new Float32Array(p.array),p.itemSize));break;case"BatchedMesh":h=a(e.geometry),u=l(e.material),o=new vm(e.maxInstanceCount,e.maxVertexCount,e.maxIndexCount,u),o.geometry=h,o.perObjectFrustumCulled=e.perObjectFrustumCulled,o.sortObjects=e.sortObjects,o._drawRanges=e.drawRanges,o._reservedRanges=e.reservedRanges,o._visibility=e.visibility,o._active=e.active,o._bounds=e.bounds.map(_=>{const m=new Kt;m.min.fromArray(_.boxMin),m.max.fromArray(_.boxMax);const g=new $t;return g.radius=_.sphereRadius,g.center.fromArray(_.sphereCenter),{boxInitialized:_.boxInitialized,box:m,sphereInitialized:_.sphereInitialized,sphere:g}}),o._maxInstanceCount=e.maxInstanceCount,o._maxVertexCount=e.maxVertexCount,o._maxIndexCount=e.maxIndexCount,o._geometryInitialized=e.geometryInitialized,o._geometryCount=e.geometryCount,o._matricesTexture=c(e.matricesTexture.uuid),e.colorsTexture!==void 0&&(o._colorsTexture=c(e.colorsTexture.uuid));break;case"LOD":o=new _m;break;case"Line":o=new li(a(e.geometry),l(e.material));break;case"LineLoop":o=new Iu(a(e.geometry),l(e.material));break;case"LineSegments":o=new Kn(a(e.geometry),l(e.material));break;case"PointCloud":case"Points":o=new Lu(a(e.geometry),l(e.material));break;case"Sprite":o=new gm(l(e.material));break;case"Group":o=new Mt;break;case"Bone":o=new ic;break;default:o=new Ze}if(o.uuid=e.uuid,e.name!==void 0&&(o.name=e.name),e.matrix!==void 0?(o.matrix.fromArray(e.matrix),e.matrixAutoUpdate!==void 0&&(o.matrixAutoUpdate=e.matrixAutoUpdate),o.matrixAutoUpdate&&o.matrix.decompose(o.position,o.quaternion,o.scale)):(e.position!==void 0&&o.position.fromArray(e.position),e.rotation!==void 0&&o.rotation.fromArray(e.rotation),e.quaternion!==void 0&&o.quaternion.fromArray(e.quaternion),e.scale!==void 0&&o.scale.fromArray(e.scale)),e.up!==void 0&&o.up.fromArray(e.up),e.castShadow!==void 0&&(o.castShadow=e.castShadow),e.receiveShadow!==void 0&&(o.receiveShadow=e.receiveShadow),e.shadow&&(e.shadow.intensity!==void 0&&(o.shadow.intensity=e.shadow.intensity),e.shadow.bias!==void 0&&(o.shadow.bias=e.shadow.bias),e.shadow.normalBias!==void 0&&(o.shadow.normalBias=e.shadow.normalBias),e.shadow.radius!==void 0&&(o.shadow.radius=e.shadow.radius),e.shadow.mapSize!==void 0&&o.shadow.mapSize.fromArray(e.shadow.mapSize),e.shadow.camera!==void 0&&(o.shadow.camera=this.parseObject(e.shadow.camera))),e.visible!==void 0&&(o.visible=e.visible),e.frustumCulled!==void 0&&(o.frustumCulled=e.frustumCulled),e.renderOrder!==void 0&&(o.renderOrder=e.renderOrder),e.userData!==void 0&&(o.userData=e.userData),e.layers!==void 0&&(o.layers.mask=e.layers),e.children!==void 0){const d=e.children;for(let f=0;f<d.length;f++)o.add(this.parseObject(d[f],t,n,i,s))}if(e.animations!==void 0){const d=e.animations;for(let f=0;f<d.length;f++){const p=d[f];o.animations.push(s[p])}}if(e.type==="LOD"){e.autoUpdate!==void 0&&(o.autoUpdate=e.autoUpdate);const d=e.levels;for(let f=0;f<d.length;f++){const p=d[f],_=o.getObjectByProperty("uuid",p.object);_!==void 0&&o.addLevel(_,p.distance,p.hysteresis)}}return o}bindSkeletons(e,t){Object.keys(t).length!==0&&e.traverse(function(n){if(n.isSkinnedMesh===!0&&n.skeleton!==void 0){const i=t[n.skeleton];i===void 0?console.warn("THREE.ObjectLoader: No skeleton found with UUID:",n.skeleton):n.bind(i,n.bindMatrix)}})}bindLightTargets(e){e.traverse(function(t){if(t.isDirectionalLight||t.isSpotLight){const n=t.target,i=e.getObjectByProperty("uuid",n);i!==void 0?t.target=i:t.target=new Ze}})}}const LS={UVMapping:Gl,CubeReflectionMapping:Ti,CubeRefractionMapping:$i,EquirectangularReflectionMapping:fo,EquirectangularRefractionMapping:po,CubeUVReflectionMapping:Pr},Ef={RepeatWrapping:Wt,ClampToEdgeWrapping:Pn,MirroredRepeatWrapping:xr},Cf={NearestFilter:Ut,NearestMipmapNearestFilter:Vl,NearestMipmapLinearFilter:ys,LinearFilter:Et,LinearMipmapNearestFilter:mr,LinearMipmapLinearFilter:Bn};class Km extends fn{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,o=Mi.get(e);if(o!==void 0){if(s.manager.itemStart(e),o.then){o.then(c=>{t&&t(c),s.manager.itemEnd(e)}).catch(c=>{i&&i(c)});return}return setTimeout(function(){t&&t(o),s.manager.itemEnd(e)},0),o}const a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader;const l=fetch(e,a).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(c){return Mi.add(e,c),t&&t(c),s.manager.itemEnd(e),c}).catch(function(c){i&&i(c),Mi.remove(e),s.manager.itemError(e),s.manager.itemEnd(e)});Mi.add(e,l),s.manager.itemStart(e)}}let Da;class Ku{static getContext(){return Da===void 0&&(Da=new(window.AudioContext||window.webkitAudioContext)),Da}static setContext(e){Da=e}}class NS extends fn{constructor(e){super(e)}load(e,t,n,i){const s=this,o=new Yn(this.manager);o.setResponseType("arraybuffer"),o.setPath(this.path),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(e,function(l){try{const c=l.slice(0);Ku.getContext().decodeAudioData(c,function(u){t(u)}).catch(a)}catch(c){a(c)}},n,i);function a(l){i?i(l):console.error(l),s.manager.itemError(e)}}}const Rf=new Pe,Pf=new Pe,ls=new Pe;class DS{constructor(){this.type="StereoCamera",this.aspect=1,this.eyeSep=.064,this.cameraL=new Dt,this.cameraL.layers.enable(1),this.cameraL.matrixAutoUpdate=!1,this.cameraR=new Dt,this.cameraR.layers.enable(2),this.cameraR.matrixAutoUpdate=!1,this._cache={focus:null,fov:null,aspect:null,near:null,far:null,zoom:null,eyeSep:null}}update(e){const t=this._cache;if(t.focus!==e.focus||t.fov!==e.fov||t.aspect!==e.aspect*this.aspect||t.near!==e.near||t.far!==e.far||t.zoom!==e.zoom||t.eyeSep!==this.eyeSep){t.focus=e.focus,t.fov=e.fov,t.aspect=e.aspect*this.aspect,t.near=e.near,t.far=e.far,t.zoom=e.zoom,t.eyeSep=this.eyeSep,ls.copy(e.projectionMatrix);const i=t.eyeSep/2,s=i*t.near/t.focus,o=t.near*Math.tan(As*t.fov*.5)/t.zoom;let a,l;Pf.elements[12]=-i,Rf.elements[12]=i,a=-o*t.aspect+s,l=o*t.aspect+s,ls.elements[0]=2*t.near/(l-a),ls.elements[8]=(l+a)/(l-a),this.cameraL.projectionMatrix.copy(ls),a=-o*t.aspect-s,l=o*t.aspect-s,ls.elements[0]=2*t.near/(l-a),ls.elements[8]=(l+a)/(l-a),this.cameraR.projectionMatrix.copy(ls)}this.cameraL.matrixWorld.copy(e.matrixWorld).multiply(Pf),this.cameraR.matrixWorld.copy(e.matrixWorld).multiply(Rf)}}class mc{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=If(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=If();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function If(){return performance.now()}const cs=new S,Lf=new ct,US=new S,hs=new S;class OS extends Ze{constructor(){super(),this.type="AudioListener",this.context=Ku.getContext(),this.gain=this.context.createGain(),this.gain.connect(this.context.destination),this.filter=null,this.timeDelta=0,this._clock=new mc}getInput(){return this.gain}removeFilter(){return this.filter!==null&&(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination),this.gain.connect(this.context.destination),this.filter=null),this}getFilter(){return this.filter}setFilter(e){return this.filter!==null?(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination)):this.gain.disconnect(this.context.destination),this.filter=e,this.gain.connect(this.filter),this.filter.connect(this.context.destination),this}getMasterVolume(){return this.gain.gain.value}setMasterVolume(e){return this.gain.gain.setTargetAtTime(e,this.context.currentTime,.01),this}updateMatrixWorld(e){super.updateMatrixWorld(e);const t=this.context.listener,n=this.up;if(this.timeDelta=this._clock.getDelta(),this.matrixWorld.decompose(cs,Lf,US),hs.set(0,0,-1).applyQuaternion(Lf),t.positionX){const i=this.context.currentTime+this.timeDelta;t.positionX.linearRampToValueAtTime(cs.x,i),t.positionY.linearRampToValueAtTime(cs.y,i),t.positionZ.linearRampToValueAtTime(cs.z,i),t.forwardX.linearRampToValueAtTime(hs.x,i),t.forwardY.linearRampToValueAtTime(hs.y,i),t.forwardZ.linearRampToValueAtTime(hs.z,i),t.upX.linearRampToValueAtTime(n.x,i),t.upY.linearRampToValueAtTime(n.y,i),t.upZ.linearRampToValueAtTime(n.z,i)}else t.setPosition(cs.x,cs.y,cs.z),t.setOrientation(hs.x,hs.y,hs.z,n.x,n.y,n.z)}}class $m extends Ze{constructor(e){super(),this.type="Audio",this.listener=e,this.context=e.context,this.gain=this.context.createGain(),this.gain.connect(e.getInput()),this.autoplay=!1,this.buffer=null,this.detune=0,this.loop=!1,this.loopStart=0,this.loopEnd=0,this.offset=0,this.duration=void 0,this.playbackRate=1,this.isPlaying=!1,this.hasPlaybackControl=!0,this.source=null,this.sourceType="empty",this._startedAt=0,this._progress=0,this._connected=!1,this.filters=[]}getOutput(){return this.gain}setNodeSource(e){return this.hasPlaybackControl=!1,this.sourceType="audioNode",this.source=e,this.connect(),this}setMediaElementSource(e){return this.hasPlaybackControl=!1,this.sourceType="mediaNode",this.source=this.context.createMediaElementSource(e),this.connect(),this}setMediaStreamSource(e){return this.hasPlaybackControl=!1,this.sourceType="mediaStreamNode",this.source=this.context.createMediaStreamSource(e),this.connect(),this}setBuffer(e){return this.buffer=e,this.sourceType="buffer",this.autoplay&&this.play(),this}play(e=0){if(this.isPlaying===!0){console.warn("THREE.Audio: Audio is already playing.");return}if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}this._startedAt=this.context.currentTime+e;const t=this.context.createBufferSource();return t.buffer=this.buffer,t.loop=this.loop,t.loopStart=this.loopStart,t.loopEnd=this.loopEnd,t.onended=this.onEnded.bind(this),t.start(this._startedAt,this._progress+this.offset,this.duration),this.isPlaying=!0,this.source=t,this.setDetune(this.detune),this.setPlaybackRate(this.playbackRate),this.connect()}pause(){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.isPlaying===!0&&(this._progress+=Math.max(this.context.currentTime-this._startedAt,0)*this.playbackRate,this.loop===!0&&(this._progress=this._progress%(this.duration||this.buffer.duration)),this.source.stop(),this.source.onended=null,this.isPlaying=!1),this}stop(e=0){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this._progress=0,this.source!==null&&(this.source.stop(this.context.currentTime+e),this.source.onended=null),this.isPlaying=!1,this}connect(){if(this.filters.length>0){this.source.connect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].connect(this.filters[e]);this.filters[this.filters.length-1].connect(this.getOutput())}else this.source.connect(this.getOutput());return this._connected=!0,this}disconnect(){if(this._connected!==!1){if(this.filters.length>0){this.source.disconnect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].disconnect(this.filters[e]);this.filters[this.filters.length-1].disconnect(this.getOutput())}else this.source.disconnect(this.getOutput());return this._connected=!1,this}}getFilters(){return this.filters}setFilters(e){return e||(e=[]),this._connected===!0?(this.disconnect(),this.filters=e.slice(),this.connect()):this.filters=e.slice(),this}setDetune(e){return this.detune=e,this.isPlaying===!0&&this.source.detune!==void 0&&this.source.detune.setTargetAtTime(this.detune,this.context.currentTime,.01),this}getDetune(){return this.detune}getFilter(){return this.getFilters()[0]}setFilter(e){return this.setFilters(e?[e]:[])}setPlaybackRate(e){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.playbackRate=e,this.isPlaying===!0&&this.source.playbackRate.setTargetAtTime(this.playbackRate,this.context.currentTime,.01),this}getPlaybackRate(){return this.playbackRate}onEnded(){this.isPlaying=!1}getLoop(){return this.hasPlaybackControl===!1?(console.warn("THREE.Audio: this Audio has no playback control."),!1):this.loop}setLoop(e){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.loop=e,this.isPlaying===!0&&(this.source.loop=this.loop),this}setLoopStart(e){return this.loopStart=e,this}setLoopEnd(e){return this.loopEnd=e,this}getVolume(){return this.gain.gain.value}setVolume(e){return this.gain.gain.setTargetAtTime(e,this.context.currentTime,.01),this}}const us=new S,Nf=new ct,FS=new S,ds=new S;class BS extends $m{constructor(e){super(e),this.panner=this.context.createPanner(),this.panner.panningModel="HRTF",this.panner.connect(this.gain)}connect(){super.connect(),this.panner.connect(this.gain)}disconnect(){super.disconnect(),this.panner.disconnect(this.gain)}getOutput(){return this.panner}getRefDistance(){return this.panner.refDistance}setRefDistance(e){return this.panner.refDistance=e,this}getRolloffFactor(){return this.panner.rolloffFactor}setRolloffFactor(e){return this.panner.rolloffFactor=e,this}getDistanceModel(){return this.panner.distanceModel}setDistanceModel(e){return this.panner.distanceModel=e,this}getMaxDistance(){return this.panner.maxDistance}setMaxDistance(e){return this.panner.maxDistance=e,this}setDirectionalCone(e,t,n){return this.panner.coneInnerAngle=e,this.panner.coneOuterAngle=t,this.panner.coneOuterGain=n,this}updateMatrixWorld(e){if(super.updateMatrixWorld(e),this.hasPlaybackControl===!0&&this.isPlaying===!1)return;this.matrixWorld.decompose(us,Nf,FS),ds.set(0,0,1).applyQuaternion(Nf);const t=this.panner;if(t.positionX){const n=this.context.currentTime+this.listener.timeDelta;t.positionX.linearRampToValueAtTime(us.x,n),t.positionY.linearRampToValueAtTime(us.y,n),t.positionZ.linearRampToValueAtTime(us.z,n),t.orientationX.linearRampToValueAtTime(ds.x,n),t.orientationY.linearRampToValueAtTime(ds.y,n),t.orientationZ.linearRampToValueAtTime(ds.z,n)}else t.setPosition(us.x,us.y,us.z),t.setOrientation(ds.x,ds.y,ds.z)}}class kS{constructor(e,t=2048){this.analyser=e.context.createAnalyser(),this.analyser.fftSize=t,this.data=new Uint8Array(this.analyser.frequencyBinCount),e.getOutput().connect(this.analyser)}getFrequencyData(){return this.analyser.getByteFrequencyData(this.data),this.data}getAverageFrequency(){let e=0;const t=this.getFrequencyData();for(let n=0;n<t.length;n++)e+=t[n];return e/t.length}}class Zm{constructor(e,t,n){this.binding=e,this.valueSize=n;let i,s,o;switch(t){case"quaternion":i=this._slerp,s=this._slerpAdditive,o=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,s=this._select,o=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,s=this._lerpAdditive,o=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=s,this._setIdentity=o,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){const n=this.buffer,i=this.valueSize,s=e*i+i;let o=this.cumulativeWeight;if(o===0){for(let a=0;a!==i;++a)n[s+a]=n[a];o=t}else{o+=t;const a=t/o;this._mixBufferRegion(n,s,0,a,i)}this.cumulativeWeight=o}accumulateAdditive(e){const t=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,i,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){const t=this.valueSize,n=this.buffer,i=e*t+t,s=this.cumulativeWeight,o=this.cumulativeWeightAdditive,a=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,s<1){const l=t*this._origIndex;this._mixBufferRegion(n,i,l,1-s,t)}o>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*t,1,t);for(let l=t,c=t+t;l!==c;++l)if(n[l]!==n[l+t]){a.setValue(n,i);break}}saveOriginalState(){const e=this.binding,t=this.buffer,n=this.valueSize,i=n*this._origIndex;e.getValue(t,i);for(let s=n,o=i;s!==o;++s)t[s]=t[i+s%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){const e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,i,s){if(i>=.5)for(let o=0;o!==s;++o)e[t+o]=e[n+o]}_slerp(e,t,n,i){ct.slerpFlat(e,t,e,t,e,n,i)}_slerpAdditive(e,t,n,i,s){const o=this._workIndex*s;ct.multiplyQuaternionsFlat(e,o,e,t,e,n),ct.slerpFlat(e,t,e,t,e,o,i)}_lerp(e,t,n,i,s){const o=1-i;for(let a=0;a!==s;++a){const l=t+a;e[l]=e[l]*o+e[n+a]*i}}_lerpAdditive(e,t,n,i,s){for(let o=0;o!==s;++o){const a=t+o;e[a]=e[a]+e[n+o]*i}}}const $u="\\[\\]\\.:\\/",zS=new RegExp("["+$u+"]","g"),Zu="[^"+$u+"]",HS="[^"+$u.replace("\\.","")+"]",GS=/((?:WC+[\/:])*)/.source.replace("WC",Zu),VS=/(WCOD+)?/.source.replace("WCOD",HS),WS=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Zu),qS=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Zu),XS=new RegExp("^"+GS+VS+WS+qS+"$"),YS=["material","materials","bones","map"];class KS{constructor(e,t,n){const i=n||et.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class et{constructor(e,t,n){this.path=t,this.parsedPath=n||et.parseTrackName(t),this.node=et.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new et.Composite(e,t,n):new et(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(zS,"")}static parseTrackName(e){const t=XS.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const s=n.nodeName.substring(i+1);YS.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(s){for(let o=0;o<s.length;o++){const a=s[o];if(a.name===t||a.uuid===t)return a;const l=n(a.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let s=t.propertyIndex;if(e||(e=et.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const o=e[i];if(o===void 0){const c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=s}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}et.Composite=KS;et.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};et.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};et.prototype.GetterByBindingType=[et.prototype._getValue_direct,et.prototype._getValue_array,et.prototype._getValue_arrayElement,et.prototype._getValue_toArray];et.prototype.SetterByBindingTypeAndVersioning=[[et.prototype._setValue_direct,et.prototype._setValue_direct_setNeedsUpdate,et.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[et.prototype._setValue_array,et.prototype._setValue_array_setNeedsUpdate,et.prototype._setValue_array_setMatrixWorldNeedsUpdate],[et.prototype._setValue_arrayElement,et.prototype._setValue_arrayElement_setNeedsUpdate,et.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[et.prototype._setValue_fromArray,et.prototype._setValue_fromArray_setNeedsUpdate,et.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class $S{constructor(){this.isAnimationObjectGroup=!0,this.uuid=Ln(),this._objects=Array.prototype.slice.call(arguments),this.nCachedObjects_=0;const e={};this._indicesByUUID=e;for(let n=0,i=arguments.length;n!==i;++n)e[arguments[n].uuid]=n;this._paths=[],this._parsedPaths=[],this._bindings=[],this._bindingsIndicesByPath={};const t=this;this.stats={objects:{get total(){return t._objects.length},get inUse(){return this.total-t.nCachedObjects_}},get bindingsPerObject(){return t._bindings.length}}}add(){const e=this._objects,t=this._indicesByUUID,n=this._paths,i=this._parsedPaths,s=this._bindings,o=s.length;let a,l=e.length,c=this.nCachedObjects_;for(let h=0,u=arguments.length;h!==u;++h){const d=arguments[h],f=d.uuid;let p=t[f];if(p===void 0){p=l++,t[f]=p,e.push(d);for(let _=0,m=o;_!==m;++_)s[_].push(new et(d,n[_],i[_]))}else if(p<c){a=e[p];const _=--c,m=e[_];t[m.uuid]=p,e[p]=m,t[f]=_,e[_]=d;for(let g=0,y=o;g!==y;++g){const v=s[g],x=v[_];let R=v[p];v[p]=x,R===void 0&&(R=new et(d,n[g],i[g])),v[_]=R}}else e[p]!==a&&console.error("THREE.AnimationObjectGroup: Different objects with the same UUID detected. Clean the caches or recreate your infrastructure when reloading scenes.")}this.nCachedObjects_=c}remove(){const e=this._objects,t=this._indicesByUUID,n=this._bindings,i=n.length;let s=this.nCachedObjects_;for(let o=0,a=arguments.length;o!==a;++o){const l=arguments[o],c=l.uuid,h=t[c];if(h!==void 0&&h>=s){const u=s++,d=e[u];t[d.uuid]=h,e[h]=d,t[c]=u,e[u]=l;for(let f=0,p=i;f!==p;++f){const _=n[f],m=_[u],g=_[h];_[h]=m,_[u]=g}}}this.nCachedObjects_=s}uncache(){const e=this._objects,t=this._indicesByUUID,n=this._bindings,i=n.length;let s=this.nCachedObjects_,o=e.length;for(let a=0,l=arguments.length;a!==l;++a){const c=arguments[a],h=c.uuid,u=t[h];if(u!==void 0)if(delete t[h],u<s){const d=--s,f=e[d],p=--o,_=e[p];t[f.uuid]=u,e[u]=f,t[_.uuid]=d,e[d]=_,e.pop();for(let m=0,g=i;m!==g;++m){const y=n[m],v=y[d],x=y[p];y[u]=v,y[d]=x,y.pop()}}else{const d=--o,f=e[d];d>0&&(t[f.uuid]=u),e[u]=f,e.pop();for(let p=0,_=i;p!==_;++p){const m=n[p];m[u]=m[d],m.pop()}}}this.nCachedObjects_=s}subscribe_(e,t){const n=this._bindingsIndicesByPath;let i=n[e];const s=this._bindings;if(i!==void 0)return s[i];const o=this._paths,a=this._parsedPaths,l=this._objects,c=l.length,h=this.nCachedObjects_,u=new Array(c);i=s.length,n[e]=i,o.push(e),a.push(t),s.push(u);for(let d=h,f=l.length;d!==f;++d){const p=l[d];u[d]=new et(p,e,t)}return u}unsubscribe_(e){const t=this._bindingsIndicesByPath,n=t[e];if(n!==void 0){const i=this._paths,s=this._parsedPaths,o=this._bindings,a=o.length-1,l=o[a],c=e[a];t[c]=n,o[n]=l,o.pop(),s[n]=s[a],s.pop(),i[n]=i[a],i.pop()}}}class Jm{constructor(e,t,n=null,i=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=i;const s=t.tracks,o=s.length,a=new Array(o),l={endingStart:xs,endingEnd:xs};for(let c=0;c!==o;++c){const h=s[c].createInterpolant(null);a[c]=h,h.settings=l}this._interpolantSettings=l,this._interpolants=a,this._propertyBindings=new Array(o),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=zp,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n){if(e.fadeOut(t),this.fadeIn(t),n){const i=this._clip.duration,s=e._clip.duration,o=s/i,a=i/s;e.warp(1,o,t),this.warp(a,1,t)}return this}crossFadeTo(e,t,n){return e.crossFadeFrom(this,t,n)}stopFading(){const e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){const i=this._mixer,s=i.time,o=this.timeScale;let a=this._timeScaleInterpolant;a===null&&(a=i._lendControlInterpolant(),this._timeScaleInterpolant=a);const l=a.parameterPositions,c=a.sampleValues;return l[0]=s,l[1]=s+n,c[0]=e/o,c[1]=t/o,this}stopWarping(){const e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,i){if(!this.enabled){this._updateWeight(e);return}const s=this._startTime;if(s!==null){const l=(e-s)*n;l<0||n===0?t=0:(this._startTime=null,t=n*l)}t*=this._updateTimeScale(e);const o=this._updateTime(t),a=this._updateWeight(e);if(a>0){const l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case _u:for(let h=0,u=l.length;h!==u;++h)l[h].evaluate(o),c[h].accumulateAdditive(a);break;case Zl:default:for(let h=0,u=l.length;h!==u;++h)l[h].evaluate(o),c[h].accumulate(i,a)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;const n=this._weightInterpolant;if(n!==null){const i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;const n=this._timeScaleInterpolant;if(n!==null){const i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopWarping(),t===0?this.paused=!0:this.timeScale=t)}}return this._effectiveTimeScale=t,t}_updateTime(e){const t=this._clip.duration,n=this.loop;let i=this.time+e,s=this._loopCount;const o=n===Hp;if(e===0)return s===-1?i:o&&(s&1)===1?t-i:i;if(n===kp){s===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(i>=t)i=t;else if(i<0)i=0;else{this.time=i;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(s===-1&&(e>=0?(s=0,this._setEndings(!0,this.repetitions===0,o)):this._setEndings(this.repetitions===0,!0,o)),i>=t||i<0){const a=Math.floor(i/t);i-=t*a,s+=Math.abs(a);const l=this.repetitions-s;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=e>0?t:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(l===1){const c=e<0;this._setEndings(c,!c,o)}else this._setEndings(!1,!1,o);this._loopCount=s,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:a})}}else this.time=i;if(o&&(s&1)===1)return t-i}return i}_setEndings(e,t,n){const i=this._interpolantSettings;n?(i.endingStart=Ms,i.endingEnd=Ms):(e?i.endingStart=this.zeroSlopeAtStart?Ms:xs:i.endingStart=mo,t?i.endingEnd=this.zeroSlopeAtEnd?Ms:xs:i.endingEnd=mo)}_scheduleFading(e,t,n){const i=this._mixer,s=i.time;let o=this._weightInterpolant;o===null&&(o=i._lendControlInterpolant(),this._weightInterpolant=o);const a=o.parameterPositions,l=o.sampleValues;return a[0]=s,l[0]=t,a[1]=s+e,l[1]=n,this}}const ZS=new Float32Array(1);class JS extends ci{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1}_bindAction(e,t){const n=e._localRoot||this._root,i=e._clip.tracks,s=i.length,o=e._propertyBindings,a=e._interpolants,l=n.uuid,c=this._bindingsByRootAndName;let h=c[l];h===void 0&&(h={},c[l]=h);for(let u=0;u!==s;++u){const d=i[u],f=d.name;let p=h[f];if(p!==void 0)++p.referenceCount,o[u]=p;else{if(p=o[u],p!==void 0){p._cacheIndex===null&&(++p.referenceCount,this._addInactiveBinding(p,l,f));continue}const _=t&&t._propertyBindings[u].binding.parsedPath;p=new Zm(et.create(n,f,_),d.ValueTypeName,d.getValueSize()),++p.referenceCount,this._addInactiveBinding(p,l,f),o[u]=p}a[u].resultBuffer=p.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){const n=(e._localRoot||this._root).uuid,i=e._clip.uuid,s=this._actionsByClip[i];this._bindAction(e,s&&s.knownActions[0]),this._addInactiveAction(e,i,n)}const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const s=t[n];s.useCount++===0&&(this._lendBinding(s),s.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const s=t[n];--s.useCount===0&&(s.restoreOriginalState(),this._takeBackBinding(s))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){const t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){const i=this._actions,s=this._actionsByClip;let o=s[t];if(o===void 0)o={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,s[t]=o;else{const a=o.knownActions;e._byClipCacheIndex=a.length,a.push(e)}e._cacheIndex=i.length,i.push(e),o.actionByRoot[n]=e}_removeInactiveAction(e){const t=this._actions,n=t[t.length-1],i=e._cacheIndex;n._cacheIndex=i,t[i]=n,t.pop(),e._cacheIndex=null;const s=e._clip.uuid,o=this._actionsByClip,a=o[s],l=a.knownActions,c=l[l.length-1],h=e._byClipCacheIndex;c._byClipCacheIndex=h,l[h]=c,l.pop(),e._byClipCacheIndex=null;const u=a.actionByRoot,d=(e._localRoot||this._root).uuid;delete u[d],l.length===0&&delete o[s],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const s=t[n];--s.referenceCount===0&&this._removeInactiveBinding(s)}}_lendAction(e){const t=this._actions,n=e._cacheIndex,i=this._nActiveActions++,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_takeBackAction(e){const t=this._actions,n=e._cacheIndex,i=--this._nActiveActions,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_addInactiveBinding(e,t,n){const i=this._bindingsByRootAndName,s=this._bindings;let o=i[t];o===void 0&&(o={},i[t]=o),o[n]=e,e._cacheIndex=s.length,s.push(e)}_removeInactiveBinding(e){const t=this._bindings,n=e.binding,i=n.rootNode.uuid,s=n.path,o=this._bindingsByRootAndName,a=o[i],l=t[t.length-1],c=e._cacheIndex;l._cacheIndex=c,t[c]=l,t.pop(),delete a[s],Object.keys(a).length===0&&delete o[i]}_lendBinding(e){const t=this._bindings,n=e._cacheIndex,i=this._nActiveBindings++,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_takeBackBinding(e){const t=this._bindings,n=e._cacheIndex,i=--this._nActiveBindings,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_lendControlInterpolant(){const e=this._controlInterpolants,t=this._nActiveControlInterpolants++;let n=e[t];return n===void 0&&(n=new Hu(new Float32Array(2),new Float32Array(2),1,ZS),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){const t=this._controlInterpolants,n=e.__cacheIndex,i=--this._nActiveControlInterpolants,s=t[i];e.__cacheIndex=i,t[i]=e,s.__cacheIndex=n,t[n]=s}clipAction(e,t,n){const i=t||this._root,s=i.uuid;let o=typeof e=="string"?Ar.findByName(i,e):e;const a=o!==null?o.uuid:e,l=this._actionsByClip[a];let c=null;if(n===void 0&&(o!==null?n=o.blendMode:n=Zl),l!==void 0){const u=l.actionByRoot[s];if(u!==void 0&&u.blendMode===n)return u;c=l.knownActions[0],o===null&&(o=c._clip)}if(o===null)return null;const h=new Jm(this,o,t,n);return this._bindAction(h,c),this._addInactiveAction(h,a,s),h}existingAction(e,t){const n=t||this._root,i=n.uuid,s=typeof e=="string"?Ar.findByName(n,e):e,o=s?s.uuid:e,a=this._actionsByClip[o];return a!==void 0&&a.actionByRoot[i]||null}stopAllAction(){const e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;const t=this._actions,n=this._nActiveActions,i=this.time+=e,s=Math.sign(e),o=this._accuIndex^=1;for(let c=0;c!==n;++c)t[c]._update(i,e,s,o);const a=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)a[c].apply(o);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){const t=this._actions,n=e.uuid,i=this._actionsByClip,s=i[n];if(s!==void 0){const o=s.knownActions;for(let a=0,l=o.length;a!==l;++a){const c=o[a];this._deactivateAction(c);const h=c._cacheIndex,u=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,u._cacheIndex=h,t[h]=u,t.pop(),this._removeInactiveBindingsForAction(c)}delete i[n]}}uncacheRoot(e){const t=e.uuid,n=this._actionsByClip;for(const o in n){const a=n[o].actionByRoot,l=a[t];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}const i=this._bindingsByRootAndName,s=i[t];if(s!==void 0)for(const o in s){const a=s[o];a.restoreOriginalState(),this._removeInactiveBinding(a)}}uncacheAction(e,t){const n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}}class Ju{constructor(e){this.value=e}clone(){return new Ju(this.value.clone===void 0?this.value:this.value.clone())}}let jS=0;class QS extends ci{constructor(){super(),this.isUniformsGroup=!0,Object.defineProperty(this,"id",{value:jS++}),this.name="",this.usage=yo,this.uniforms=[]}add(e){return this.uniforms.push(e),this}remove(e){const t=this.uniforms.indexOf(e);return t!==-1&&this.uniforms.splice(t,1),this}setName(e){return this.name=e,this}setUsage(e){return this.usage=e,this}dispose(){return this.dispatchEvent({type:"dispose"}),this}copy(e){this.name=e.name,this.usage=e.usage;const t=e.uniforms;this.uniforms.length=0;for(let n=0,i=t.length;n<i;n++){const s=Array.isArray(t[n])?t[n]:[t[n]];for(let o=0;o<s.length;o++)this.uniforms.push(s[o].clone())}return this}clone(){return new this.constructor().copy(this)}}class eb extends Bo{constructor(e,t,n=1){super(e,t),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){const t=super.clone(e);return t.meshPerAttribute=this.meshPerAttribute,t}toJSON(e){const t=super.toJSON(e);return t.isInstancedInterleavedBuffer=!0,t.meshPerAttribute=this.meshPerAttribute,t}}class tb{constructor(e,t,n,i,s){this.isGLBufferAttribute=!0,this.name="",this.buffer=e,this.type=t,this.itemSize=n,this.elementSize=i,this.count=s,this.version=0}set needsUpdate(e){e===!0&&this.version++}setBuffer(e){return this.buffer=e,this}setType(e,t){return this.type=e,this.elementSize=t,this}setItemSize(e){return this.itemSize=e,this}setCount(e){return this.count=e,this}}const Df=new Pe;class nb{constructor(e,t,n=0,i=1/0){this.ray=new Ir(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new Ql,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Df.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Df),this}intersectObject(e,t=!0,n=[]){return qh(e,this,n,t),n.sort(Uf),n}intersectObjects(e,t=!0,n=[]){for(let i=0,s=e.length;i<s;i++)qh(e[i],this,n,t);return n.sort(Uf),n}}function Uf(r,e){return r.distance-e.distance}function qh(r,e,t,n){let i=!0;if(r.layers.test(e.layers)&&r.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){const s=r.children;for(let o=0,a=s.length;o<a;o++)qh(s[o],e,t,!0)}}class ib{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(At(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class sb{constructor(e=1,t=0,n=0){return this.radius=e,this.theta=t,this.y=n,this}set(e,t,n){return this.radius=e,this.theta=t,this.y=n,this}copy(e){return this.radius=e.radius,this.theta=e.theta,this.y=e.y,this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+n*n),this.theta=Math.atan2(e,n),this.y=t,this}clone(){return new this.constructor().copy(this)}}class ju{constructor(e,t,n,i){ju.prototype.isMatrix2=!0,this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,i){const s=this.elements;return s[0]=e,s[2]=t,s[1]=n,s[3]=i,this}}const Of=new W;class rb{constructor(e=new W(1/0,1/0),t=new W(-1/0,-1/0)){this.isBox2=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Of.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(e){return this.isEmpty()?e.set(0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Of).distanceTo(e)}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Ff=new S,Ua=new S;class ob{constructor(e=new S,t=new S){this.start=e,this.end=t}set(e,t){return this.start.copy(e),this.end.copy(t),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e.addVectors(this.start,this.end).multiplyScalar(.5)}delta(e){return e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,t){return this.delta(t).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,t){Ff.subVectors(e,this.start),Ua.subVectors(this.end,this.start);const n=Ua.dot(Ua);let s=Ua.dot(Ff)/n;return t&&(s=At(s,0,1)),s}closestPointToPoint(e,t,n){const i=this.closestPointToPointParameter(e,t);return this.delta(n).multiplyScalar(i).add(this.start)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}const Bf=new S;class ab extends Ze{constructor(e,t){super(),this.light=e,this.matrixAutoUpdate=!1,this.color=t,this.type="SpotLightHelper";const n=new Ve,i=[0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,-1,0,1,0,0,0,0,1,1,0,0,0,0,-1,1];for(let o=0,a=1,l=32;o<l;o++,a++){const c=o/l*Math.PI*2,h=a/l*Math.PI*2;i.push(Math.cos(c),Math.sin(c),1,Math.cos(h),Math.sin(h),1)}n.setAttribute("position",new Ee(i,3));const s=new Jt({fog:!1,toneMapped:!1});this.cone=new Kn(n,s),this.add(this.cone),this.update()}dispose(){this.cone.geometry.dispose(),this.cone.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),this.parent?(this.parent.updateWorldMatrix(!0),this.matrix.copy(this.parent.matrixWorld).invert().multiply(this.light.matrixWorld)):this.matrix.copy(this.light.matrixWorld),this.matrixWorld.copy(this.light.matrixWorld);const e=this.light.distance?this.light.distance:1e3,t=e*Math.tan(this.light.angle);this.cone.scale.set(t,t,e),Bf.setFromMatrixPosition(this.light.target.matrixWorld),this.cone.lookAt(Bf),this.color!==void 0?this.cone.material.color.set(this.color):this.cone.material.color.copy(this.light.color)}}const ki=new S,Oa=new Pe,ph=new Pe;class lb extends Kn{constructor(e){const t=jm(e),n=new Ve,i=[],s=[],o=new oe(0,0,1),a=new oe(0,1,0);for(let c=0;c<t.length;c++){const h=t[c];h.parent&&h.parent.isBone&&(i.push(0,0,0),i.push(0,0,0),s.push(o.r,o.g,o.b),s.push(a.r,a.g,a.b))}n.setAttribute("position",new Ee(i,3)),n.setAttribute("color",new Ee(s,3));const l=new Jt({vertexColors:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0});super(n,l),this.isSkeletonHelper=!0,this.type="SkeletonHelper",this.root=e,this.bones=t,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1}updateMatrixWorld(e){const t=this.bones,n=this.geometry,i=n.getAttribute("position");ph.copy(this.root.matrixWorld).invert();for(let s=0,o=0;s<t.length;s++){const a=t[s];a.parent&&a.parent.isBone&&(Oa.multiplyMatrices(ph,a.matrixWorld),ki.setFromMatrixPosition(Oa),i.setXYZ(o,ki.x,ki.y,ki.z),Oa.multiplyMatrices(ph,a.parent.matrixWorld),ki.setFromMatrixPosition(Oa),i.setXYZ(o+1,ki.x,ki.y,ki.z),o+=2)}n.getAttribute("position").needsUpdate=!0,super.updateMatrixWorld(e)}dispose(){this.geometry.dispose(),this.material.dispose()}}function jm(r){const e=[];r.isBone===!0&&e.push(r);for(let t=0;t<r.children.length;t++)e.push.apply(e,jm(r.children[t]));return e}class cb extends ce{constructor(e,t,n){const i=new hi(t,4,2),s=new Ot({wireframe:!0,fog:!1,toneMapped:!1});super(i,s),this.light=e,this.color=n,this.type="PointLightHelper",this.matrix=this.light.matrixWorld,this.matrixAutoUpdate=!1,this.update()}dispose(){this.geometry.dispose(),this.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.color!==void 0?this.material.color.set(this.color):this.material.color.copy(this.light.color)}}const hb=new S,kf=new oe,zf=new oe;class ub extends Ze{constructor(e,t,n){super(),this.light=e,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.color=n,this.type="HemisphereLightHelper";const i=new Vo(t);i.rotateY(Math.PI*.5),this.material=new Ot({wireframe:!0,fog:!1,toneMapped:!1}),this.color===void 0&&(this.material.vertexColors=!0);const s=i.getAttribute("position"),o=new Float32Array(s.count*3);i.setAttribute("color",new st(o,3)),this.add(new ce(i,this.material)),this.update()}dispose(){this.children[0].geometry.dispose(),this.children[0].material.dispose()}update(){const e=this.children[0];if(this.color!==void 0)this.material.color.set(this.color);else{const t=e.geometry.getAttribute("color");kf.copy(this.light.color),zf.copy(this.light.groundColor);for(let n=0,i=t.count;n<i;n++){const s=n<i/2?kf:zf;t.setXYZ(n,s.r,s.g,s.b)}t.needsUpdate=!0}this.light.updateWorldMatrix(!0,!1),e.lookAt(hb.setFromMatrixPosition(this.light.matrixWorld).negate())}}class db extends Kn{constructor(e=10,t=10,n=4473924,i=8947848){n=new oe(n),i=new oe(i);const s=t/2,o=e/t,a=e/2,l=[],c=[];for(let d=0,f=0,p=-a;d<=t;d++,p+=o){l.push(-a,0,p,a,0,p),l.push(p,0,-a,p,0,a);const _=d===s?n:i;_.toArray(c,f),f+=3,_.toArray(c,f),f+=3,_.toArray(c,f),f+=3,_.toArray(c,f),f+=3}const h=new Ve;h.setAttribute("position",new Ee(l,3)),h.setAttribute("color",new Ee(c,3));const u=new Jt({vertexColors:!0,toneMapped:!1});super(h,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class fb extends Kn{constructor(e=10,t=16,n=8,i=64,s=4473924,o=8947848){s=new oe(s),o=new oe(o);const a=[],l=[];if(t>1)for(let u=0;u<t;u++){const d=u/t*(Math.PI*2),f=Math.sin(d)*e,p=Math.cos(d)*e;a.push(0,0,0),a.push(f,0,p);const _=u&1?s:o;l.push(_.r,_.g,_.b),l.push(_.r,_.g,_.b)}for(let u=0;u<n;u++){const d=u&1?s:o,f=e-e/n*u;for(let p=0;p<i;p++){let _=p/i*(Math.PI*2),m=Math.sin(_)*f,g=Math.cos(_)*f;a.push(m,0,g),l.push(d.r,d.g,d.b),_=(p+1)/i*(Math.PI*2),m=Math.sin(_)*f,g=Math.cos(_)*f,a.push(m,0,g),l.push(d.r,d.g,d.b)}}const c=new Ve;c.setAttribute("position",new Ee(a,3)),c.setAttribute("color",new Ee(l,3));const h=new Jt({vertexColors:!0,toneMapped:!1});super(c,h),this.type="PolarGridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}const Hf=new S,Fa=new S,Gf=new S;class pb extends Ze{constructor(e,t,n){super(),this.light=e,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.color=n,this.type="DirectionalLightHelper",t===void 0&&(t=1);let i=new Ve;i.setAttribute("position",new Ee([-t,t,0,t,t,0,t,-t,0,-t,-t,0,-t,t,0],3));const s=new Jt({fog:!1,toneMapped:!1});this.lightPlane=new li(i,s),this.add(this.lightPlane),i=new Ve,i.setAttribute("position",new Ee([0,0,0,0,0,1],3)),this.targetLine=new li(i,s),this.add(this.targetLine),this.update()}dispose(){this.lightPlane.geometry.dispose(),this.lightPlane.material.dispose(),this.targetLine.geometry.dispose(),this.targetLine.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),Hf.setFromMatrixPosition(this.light.matrixWorld),Fa.setFromMatrixPosition(this.light.target.matrixWorld),Gf.subVectors(Fa,Hf),this.lightPlane.lookAt(Fa),this.color!==void 0?(this.lightPlane.material.color.set(this.color),this.targetLine.material.color.set(this.color)):(this.lightPlane.material.color.copy(this.light.color),this.targetLine.material.color.copy(this.light.color)),this.targetLine.lookAt(Fa),this.targetLine.scale.z=Gf.length()}}const Ba=new S,Tt=new ec;class mb extends Kn{constructor(e){const t=new Ve,n=new Jt({color:16777215,vertexColors:!0,toneMapped:!1}),i=[],s=[],o={};a("n1","n2"),a("n2","n4"),a("n4","n3"),a("n3","n1"),a("f1","f2"),a("f2","f4"),a("f4","f3"),a("f3","f1"),a("n1","f1"),a("n2","f2"),a("n3","f3"),a("n4","f4"),a("p","n1"),a("p","n2"),a("p","n3"),a("p","n4"),a("u1","u2"),a("u2","u3"),a("u3","u1"),a("c","t"),a("p","c"),a("cn1","cn2"),a("cn3","cn4"),a("cf1","cf2"),a("cf3","cf4");function a(p,_){l(p),l(_)}function l(p){i.push(0,0,0),s.push(0,0,0),o[p]===void 0&&(o[p]=[]),o[p].push(i.length/3-1)}t.setAttribute("position",new Ee(i,3)),t.setAttribute("color",new Ee(s,3)),super(t,n),this.type="CameraHelper",this.camera=e,this.camera.updateProjectionMatrix&&this.camera.updateProjectionMatrix(),this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.pointMap=o,this.update();const c=new oe(16755200),h=new oe(16711680),u=new oe(43775),d=new oe(16777215),f=new oe(3355443);this.setColors(c,h,u,d,f)}setColors(e,t,n,i,s){const a=this.geometry.getAttribute("color");a.setXYZ(0,e.r,e.g,e.b),a.setXYZ(1,e.r,e.g,e.b),a.setXYZ(2,e.r,e.g,e.b),a.setXYZ(3,e.r,e.g,e.b),a.setXYZ(4,e.r,e.g,e.b),a.setXYZ(5,e.r,e.g,e.b),a.setXYZ(6,e.r,e.g,e.b),a.setXYZ(7,e.r,e.g,e.b),a.setXYZ(8,e.r,e.g,e.b),a.setXYZ(9,e.r,e.g,e.b),a.setXYZ(10,e.r,e.g,e.b),a.setXYZ(11,e.r,e.g,e.b),a.setXYZ(12,e.r,e.g,e.b),a.setXYZ(13,e.r,e.g,e.b),a.setXYZ(14,e.r,e.g,e.b),a.setXYZ(15,e.r,e.g,e.b),a.setXYZ(16,e.r,e.g,e.b),a.setXYZ(17,e.r,e.g,e.b),a.setXYZ(18,e.r,e.g,e.b),a.setXYZ(19,e.r,e.g,e.b),a.setXYZ(20,e.r,e.g,e.b),a.setXYZ(21,e.r,e.g,e.b),a.setXYZ(22,e.r,e.g,e.b),a.setXYZ(23,e.r,e.g,e.b),a.setXYZ(24,t.r,t.g,t.b),a.setXYZ(25,t.r,t.g,t.b),a.setXYZ(26,t.r,t.g,t.b),a.setXYZ(27,t.r,t.g,t.b),a.setXYZ(28,t.r,t.g,t.b),a.setXYZ(29,t.r,t.g,t.b),a.setXYZ(30,t.r,t.g,t.b),a.setXYZ(31,t.r,t.g,t.b),a.setXYZ(32,n.r,n.g,n.b),a.setXYZ(33,n.r,n.g,n.b),a.setXYZ(34,n.r,n.g,n.b),a.setXYZ(35,n.r,n.g,n.b),a.setXYZ(36,n.r,n.g,n.b),a.setXYZ(37,n.r,n.g,n.b),a.setXYZ(38,i.r,i.g,i.b),a.setXYZ(39,i.r,i.g,i.b),a.setXYZ(40,s.r,s.g,s.b),a.setXYZ(41,s.r,s.g,s.b),a.setXYZ(42,s.r,s.g,s.b),a.setXYZ(43,s.r,s.g,s.b),a.setXYZ(44,s.r,s.g,s.b),a.setXYZ(45,s.r,s.g,s.b),a.setXYZ(46,s.r,s.g,s.b),a.setXYZ(47,s.r,s.g,s.b),a.setXYZ(48,s.r,s.g,s.b),a.setXYZ(49,s.r,s.g,s.b),a.needsUpdate=!0}update(){const e=this.geometry,t=this.pointMap,n=1,i=1;Tt.projectionMatrixInverse.copy(this.camera.projectionMatrixInverse),Rt("c",t,e,Tt,0,0,-1),Rt("t",t,e,Tt,0,0,1),Rt("n1",t,e,Tt,-n,-i,-1),Rt("n2",t,e,Tt,n,-i,-1),Rt("n3",t,e,Tt,-n,i,-1),Rt("n4",t,e,Tt,n,i,-1),Rt("f1",t,e,Tt,-n,-i,1),Rt("f2",t,e,Tt,n,-i,1),Rt("f3",t,e,Tt,-n,i,1),Rt("f4",t,e,Tt,n,i,1),Rt("u1",t,e,Tt,n*.7,i*1.1,-1),Rt("u2",t,e,Tt,-n*.7,i*1.1,-1),Rt("u3",t,e,Tt,0,i*2,-1),Rt("cf1",t,e,Tt,-n,0,1),Rt("cf2",t,e,Tt,n,0,1),Rt("cf3",t,e,Tt,0,-i,1),Rt("cf4",t,e,Tt,0,i,1),Rt("cn1",t,e,Tt,-n,0,-1),Rt("cn2",t,e,Tt,n,0,-1),Rt("cn3",t,e,Tt,0,-i,-1),Rt("cn4",t,e,Tt,0,i,-1),e.getAttribute("position").needsUpdate=!0}dispose(){this.geometry.dispose(),this.material.dispose()}}function Rt(r,e,t,n,i,s,o){Ba.set(i,s,o).unproject(n);const a=e[r];if(a!==void 0){const l=t.getAttribute("position");for(let c=0,h=a.length;c<h;c++)l.setXYZ(a[c],Ba.x,Ba.y,Ba.z)}}const ka=new Kt;class gb extends Kn{constructor(e,t=16776960){const n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),i=new Float32Array(8*3),s=new Ve;s.setIndex(new st(n,1)),s.setAttribute("position",new st(i,3)),super(s,new Jt({color:t,toneMapped:!1})),this.object=e,this.type="BoxHelper",this.matrixAutoUpdate=!1,this.update()}update(e){if(e!==void 0&&console.warn("THREE.BoxHelper: .update() has no longer arguments."),this.object!==void 0&&ka.setFromObject(this.object),ka.isEmpty())return;const t=ka.min,n=ka.max,i=this.geometry.attributes.position,s=i.array;s[0]=n.x,s[1]=n.y,s[2]=n.z,s[3]=t.x,s[4]=n.y,s[5]=n.z,s[6]=t.x,s[7]=t.y,s[8]=n.z,s[9]=n.x,s[10]=t.y,s[11]=n.z,s[12]=n.x,s[13]=n.y,s[14]=t.z,s[15]=t.x,s[16]=n.y,s[17]=t.z,s[18]=t.x,s[19]=t.y,s[20]=t.z,s[21]=n.x,s[22]=t.y,s[23]=t.z,i.needsUpdate=!0,this.geometry.computeBoundingSphere()}setFromObject(e){return this.object=e,this.update(),this}copy(e,t){return super.copy(e,t),this.object=e.object,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class _b extends Kn{constructor(e,t=16776960){const n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),i=[1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1],s=new Ve;s.setIndex(new st(n,1)),s.setAttribute("position",new Ee(i,3)),super(s,new Jt({color:t,toneMapped:!1})),this.box=e,this.type="Box3Helper",this.geometry.computeBoundingSphere()}updateMatrixWorld(e){const t=this.box;t.isEmpty()||(t.getCenter(this.position),t.getSize(this.scale),this.scale.multiplyScalar(.5),super.updateMatrixWorld(e))}dispose(){this.geometry.dispose(),this.material.dispose()}}class vb extends li{constructor(e,t=1,n=16776960){const i=n,s=[1,-1,0,-1,1,0,-1,-1,0,1,1,0,-1,1,0,-1,-1,0,1,-1,0,1,1,0],o=new Ve;o.setAttribute("position",new Ee(s,3)),o.computeBoundingSphere(),super(o,new Jt({color:i,toneMapped:!1})),this.type="PlaneHelper",this.plane=e,this.size=t;const a=[1,1,0,-1,1,0,-1,-1,0,1,1,0,-1,-1,0,1,-1,0],l=new Ve;l.setAttribute("position",new Ee(a,3)),l.computeBoundingSphere(),this.add(new ce(l,new Ot({color:i,opacity:.2,transparent:!0,depthWrite:!1,toneMapped:!1})))}updateMatrixWorld(e){this.position.set(0,0,0),this.scale.set(.5*this.size,.5*this.size,1),this.lookAt(this.plane.normal),this.translateZ(-this.plane.constant),super.updateMatrixWorld(e)}dispose(){this.geometry.dispose(),this.material.dispose(),this.children[0].geometry.dispose(),this.children[0].material.dispose()}}const Vf=new S;let za,mh;class yb extends Ze{constructor(e=new S(0,0,1),t=new S(0,0,0),n=1,i=16776960,s=n*.2,o=s*.2){super(),this.type="ArrowHelper",za===void 0&&(za=new Ve,za.setAttribute("position",new Ee([0,0,0,0,1,0],3)),mh=new dt(0,.5,1,5,1),mh.translate(0,-.5,0)),this.position.copy(t),this.line=new li(za,new Jt({color:i,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new ce(mh,new Ot({color:i,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(e),this.setLength(n,s,o)}setDirection(e){if(e.y>.99999)this.quaternion.set(0,0,0,1);else if(e.y<-.99999)this.quaternion.set(1,0,0,0);else{Vf.set(e.z,0,-e.x).normalize();const t=Math.acos(e.y);this.quaternion.setFromAxisAngle(Vf,t)}}setLength(e,t=e*.2,n=t*.2){this.line.scale.set(1,Math.max(1e-4,e-t),1),this.line.updateMatrix(),this.cone.scale.set(n,t,n),this.cone.position.y=e,this.cone.updateMatrix()}setColor(e){this.line.material.color.set(e),this.cone.material.color.set(e)}copy(e){return super.copy(e,!1),this.line.copy(e.line),this.cone.copy(e.cone),this}dispose(){this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}}class xb extends Kn{constructor(e=1){const t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],i=new Ve;i.setAttribute("position",new Ee(t,3)),i.setAttribute("color",new Ee(n,3));const s=new Jt({vertexColors:!0,toneMapped:!1});super(i,s),this.type="AxesHelper"}setColors(e,t,n){const i=new oe,s=this.geometry.attributes.color.array;return i.set(e),i.toArray(s,0),i.toArray(s,3),i.set(t),i.toArray(s,6),i.toArray(s,9),i.set(n),i.toArray(s,12),i.toArray(s,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class Mb{constructor(){this.type="ShapePath",this.color=new oe,this.subPaths=[],this.currentPath=null}moveTo(e,t){return this.currentPath=new bo,this.subPaths.push(this.currentPath),this.currentPath.moveTo(e,t),this}lineTo(e,t){return this.currentPath.lineTo(e,t),this}quadraticCurveTo(e,t,n,i){return this.currentPath.quadraticCurveTo(e,t,n,i),this}bezierCurveTo(e,t,n,i,s,o){return this.currentPath.bezierCurveTo(e,t,n,i,s,o),this}splineThru(e){return this.currentPath.splineThru(e),this}toShapes(e){function t(g){const y=[];for(let v=0,x=g.length;v<x;v++){const R=g[v],A=new bn;A.curves=R.curves,y.push(A)}return y}function n(g,y){const v=y.length;let x=!1;for(let R=v-1,A=0;A<v;R=A++){let T=y[R],I=y[A],F=I.x-T.x,M=I.y-T.y;if(Math.abs(M)>Number.EPSILON){if(M<0&&(T=y[A],F=-F,I=y[R],M=-M),g.y<T.y||g.y>I.y)continue;if(g.y===T.y){if(g.x===T.x)return!0}else{const w=M*(g.x-T.x)-F*(g.y-T.y);if(w===0)return!0;if(w<0)continue;x=!x}}else{if(g.y!==T.y)continue;if(I.x<=g.x&&g.x<=T.x||T.x<=g.x&&g.x<=I.x)return!0}}return x}const i=si.isClockWise,s=this.subPaths;if(s.length===0)return[];let o,a,l;const c=[];if(s.length===1)return a=s[0],l=new bn,l.curves=a.curves,c.push(l),c;let h=!i(s[0].getPoints());h=e?!h:h;const u=[],d=[];let f=[],p=0,_;d[p]=void 0,f[p]=[];for(let g=0,y=s.length;g<y;g++)a=s[g],_=a.getPoints(),o=i(_),o=e?!o:o,o?(!h&&d[p]&&p++,d[p]={s:new bn,p:_},d[p].s.curves=a.curves,h&&p++,f[p]=[]):f[p].push({h:a,p:_[0]});if(!d[0])return t(s);if(d.length>1){let g=!1,y=0;for(let v=0,x=d.length;v<x;v++)u[v]=[];for(let v=0,x=d.length;v<x;v++){const R=f[v];for(let A=0;A<R.length;A++){const T=R[A];let I=!0;for(let F=0;F<d.length;F++)n(T.p,d[F].p)&&(v!==F&&y++,I?(I=!1,u[F].push(T)):g=!0);I&&u[v].push(T)}}y>0&&g===!1&&(f=u)}let m;for(let g=0,y=d.length;g<y;g++){l=d[g].s,c.push(l),m=f[g];for(let v=0,x=m.length;v<x;v++)l.holes.push(m[v].h)}return c}}class Sb extends ci{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}class bb extends dn{constructor(e=1,t=1,n=1,i={}){console.warn('THREE.WebGLMultipleRenderTargets has been deprecated and will be removed in r172. Use THREE.WebGLRenderTarget and set the "count" parameter to enable MRT.'),super(e,t,{...i,count:n}),this.isWebGLMultipleRenderTargets=!0}get texture(){return this.textures}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:zl}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=zl);const wb=Object.freeze(Object.defineProperty({__proto__:null,ACESFilmicToneMapping:Hl,AddEquation:Wi,AddOperation:Op,AdditiveAnimationBlendMode:_u,AdditiveBlending:$a,AgXToneMapping:ou,AlphaFormat:uu,AlwaysCompare:jp,AlwaysDepth:Qa,AlwaysStencilFunc:Fh,AmbientLight:Yu,AnimationAction:Jm,AnimationClip:Ar,AnimationLoader:wS,AnimationMixer:JS,AnimationObjectGroup:$S,AnimationUtils:xS,ArcCurve:ym,ArrayCamera:fm,ArrowHelper:yb,AttachedBindMode:Oh,Audio:$m,AudioAnalyser:kS,AudioContext:Ku,AudioListener:OS,AudioLoader:NS,AxesHelper:xb,BackSide:sn,BasicDepthPacking:Vp,BasicShadowMap:Mg,BatchedMesh:vm,Bone:ic,BooleanKeyframeTrack:ks,Box2:rb,Box3:Kt,Box3Helper:_b,BoxGeometry:it,BoxHelper:gb,BufferAttribute:st,BufferGeometry:Ve,BufferGeometryLoader:Ym,ByteType:lu,Cache:Mi,Camera:ec,CameraHelper:mb,CanvasTexture:_r,CapsuleGeometry:zo,CatmullRomCurve3:xm,CineonToneMapping:ru,CircleGeometry:Ho,ClampToEdgeWrapping:Pn,Clock:mc,Color:oe,ColorKeyframeTrack:Gu,ColorManagement:Je,CompressedArrayTexture:VM,CompressedCubeTexture:WM,CompressedTexture:rc,CompressedTextureLoader:TS,ConeGeometry:Dr,ConstantAlphaFactor:Np,ConstantColorFactor:Ip,Controls:Sb,CubeCamera:rm,CubeReflectionMapping:Ti,CubeRefractionMapping:$i,CubeTexture:Uo,CubeTextureLoader:AS,CubeUVReflectionMapping:Pr,CubicBezierCurve:Du,CubicBezierCurve3:Mm,CubicInterpolant:Bm,CullFaceBack:Nh,CullFaceFront:gp,CullFaceFrontBack:xg,CullFaceNone:mp,Curve:$n,CurvePath:bm,CustomBlending:_p,CustomToneMapping:Fp,CylinderGeometry:dt,Cylindrical:sb,Data3DTexture:Mu,DataArrayTexture:jl,DataTexture:ii,DataTextureLoader:ES,DataUtils:L0,DecrementStencilOp:Lg,DecrementWrapStencilOp:Dg,DefaultLoadingManager:Hm,DepthFormat:Ts,DepthStencilFormat:Ps,DepthTexture:Tu,DetachedBindMode:Bp,DirectionalLight:Wo,DirectionalLightHelper:pb,DiscreteInterpolant:km,DisplayP3ColorSpace:Jl,DodecahedronGeometry:Go,DoubleSide:vn,DstAlphaFactor:Ap,DstColorFactor:Cp,DynamicCopyUsage:$g,DynamicDrawUsage:Vg,DynamicReadUsage:Xg,EdgesGeometry:wm,EllipseCurve:oc,EqualCompare:Kp,EqualDepth:tl,EqualStencilFunc:Bg,EquirectangularReflectionMapping:fo,EquirectangularRefractionMapping:po,Euler:Zt,EventDispatcher:ci,ExtrudeGeometry:Xn,FileLoader:Yn,Float16BufferAttribute:B0,Float32BufferAttribute:Ee,FloatType:Mn,Fog:nc,FogExp2:Fo,FramebufferTexture:GM,FrontSide:oi,Frustum:Oo,GLBufferAttribute:tb,GLSL1:Jg,GLSL3:Bh,GreaterCompare:$p,GreaterDepth:il,GreaterEqualCompare:Jp,GreaterEqualDepth:nl,GreaterEqualStencilFunc:Gg,GreaterStencilFunc:zg,GridHelper:db,Group:Mt,HalfFloatType:ni,HemisphereLight:Wu,HemisphereLightHelper:ub,IcosahedronGeometry:lc,ImageBitmapLoader:Km,ImageLoader:Eo,ImageUtils:tm,IncrementStencilOp:Ig,IncrementWrapStencilOp:Ng,InstancedBufferAttribute:Ls,InstancedBufferGeometry:Xm,InstancedInterleavedBuffer:eb,InstancedMesh:So,Int16BufferAttribute:O0,Int32BufferAttribute:F0,Int8BufferAttribute:N0,IntType:Wl,InterleavedBuffer:Bo,InterleavedBufferAttribute:Zi,Interpolant:Or,InterpolateDiscrete:Sr,InterpolateLinear:br,InterpolateSmooth:qa,InvertStencilOp:Ug,KeepStencilOp:ms,KeyframeTrack:Zn,LOD:_m,LatheGeometry:Bs,Layers:Ql,LessCompare:Yp,LessDepth:el,LessEqualCompare:yu,LessEqualDepth:Cs,LessEqualStencilFunc:kg,LessStencilFunc:Fg,Light:Qi,LightProbe:qm,Line:li,Line3:ob,LineBasicMaterial:Jt,LineCurve:Uu,LineCurve3:Sm,LineDashedMaterial:Um,LineLoop:Iu,LineSegments:Kn,LinearDisplayP3ColorSpace:Do,LinearFilter:Et,LinearInterpolant:Hu,LinearMipMapLinearFilter:Tg,LinearMipMapNearestFilter:wg,LinearMipmapLinearFilter:Bn,LinearMipmapNearestFilter:mr,LinearSRGBColorSpace:qt,LinearToneMapping:iu,LinearTransfer:go,Loader:fn,LoaderUtils:qi,LoadingManager:Vu,LoopOnce:kp,LoopPingPong:Hp,LoopRepeat:zp,LuminanceAlphaFormat:pu,LuminanceFormat:fu,MOUSE:vg,Material:Bt,MaterialLoader:pc,MathUtils:Ie,Matrix2:ju,Matrix3:qe,Matrix4:Pe,MaxEquation:Mp,Mesh:ce,MeshBasicMaterial:Ot,MeshDepthMaterial:Au,MeshDistanceMaterial:Eu,MeshLambertMaterial:Nm,MeshMatcapMaterial:Dm,MeshNormalMaterial:Lm,MeshPhongMaterial:Pm,MeshPhysicalMaterial:Dn,MeshStandardMaterial:$e,MeshToonMaterial:Im,MinEquation:xp,MirroredRepeatWrapping:xr,MixOperation:Up,MultiplyBlending:Uh,MultiplyOperation:Lo,NearestFilter:Ut,NearestMipMapLinearFilter:bg,NearestMipMapNearestFilter:Sg,NearestMipmapLinearFilter:ys,NearestMipmapNearestFilter:Vl,NeutralToneMapping:au,NeverCompare:Xp,NeverDepth:ja,NeverStencilFunc:Og,NoBlending:ti,NoColorSpace:yi,NoToneMapping:bi,NormalAnimationBlendMode:Zl,NormalBlending:ws,NotEqualCompare:Zp,NotEqualDepth:sl,NotEqualStencilFunc:Hg,NumberKeyframeTrack:Ds,Object3D:Ze,ObjectLoader:IS,ObjectSpaceNormalMap:qp,OctahedronGeometry:Vo,OneFactor:bp,OneMinusConstantAlphaFactor:Dp,OneMinusConstantColorFactor:Lp,OneMinusDstAlphaFactor:Ep,OneMinusDstColorFactor:Rp,OneMinusSrcAlphaFactor:Ja,OneMinusSrcColorFactor:Tp,OrthographicCamera:Lr,P3Primaries:vo,PCFShadowMap:tu,PCFSoftShadowMap:nu,PMREMGenerator:Ll,Path:bo,PerspectiveCamera:Dt,Plane:Gi,PlaneGeometry:In,PlaneHelper:vb,PointLight:Si,PointLightHelper:cb,Points:Lu,PointsMaterial:sc,PolarGridHelper:fb,PolyhedronGeometry:ji,PositionalAudio:BS,PropertyBinding:et,PropertyMixer:Zm,QuadraticBezierCurve:Ou,QuadraticBezierCurve3:Fu,Quaternion:ct,QuaternionKeyframeTrack:Us,QuaternionLinearInterpolant:zm,RED_GREEN_RGTC2_Format:Rl,RED_RGTC1_Format:gu,REVISION:zl,RGBADepthPacking:Wp,RGBAFormat:un,RGBAIntegerFormat:$l,RGBA_ASTC_10x10_Format:bl,RGBA_ASTC_10x5_Format:xl,RGBA_ASTC_10x6_Format:Ml,RGBA_ASTC_10x8_Format:Sl,RGBA_ASTC_12x10_Format:wl,RGBA_ASTC_12x12_Format:Tl,RGBA_ASTC_4x4_Format:dl,RGBA_ASTC_5x4_Format:fl,RGBA_ASTC_5x5_Format:pl,RGBA_ASTC_6x5_Format:ml,RGBA_ASTC_6x6_Format:gl,RGBA_ASTC_8x5_Format:_l,RGBA_ASTC_8x6_Format:vl,RGBA_ASTC_8x8_Format:yl,RGBA_BPTC_Format:oo,RGBA_ETC2_EAC_Format:ul,RGBA_PVRTC_2BPPV1_Format:ll,RGBA_PVRTC_4BPPV1_Format:al,RGBA_S3TC_DXT1_Format:io,RGBA_S3TC_DXT3_Format:so,RGBA_S3TC_DXT5_Format:ro,RGBDepthPacking:Eg,RGBFormat:du,RGBIntegerFormat:Ag,RGB_BPTC_SIGNED_Format:Al,RGB_BPTC_UNSIGNED_Format:El,RGB_ETC1_Format:cl,RGB_ETC2_Format:hl,RGB_PVRTC_2BPPV1_Format:ol,RGB_PVRTC_4BPPV1_Format:rl,RGB_S3TC_DXT1_Format:no,RGDepthPacking:Cg,RGFormat:mu,RGIntegerFormat:Kl,RawShaderMaterial:ku,Ray:Ir,Raycaster:nb,Rec709Primaries:_o,RectAreaLight:Vm,RedFormat:Yl,RedIntegerFormat:No,ReinhardToneMapping:su,RenderTarget:nm,RepeatWrapping:Wt,ReplaceStencilOp:Pg,ReverseSubtractEquation:yp,RingGeometry:Ur,SIGNED_RED_GREEN_RGTC2_Format:Pl,SIGNED_RED_RGTC1_Format:Cl,SRGBColorSpace:Nt,SRGBTransfer:ut,Scene:Cu,ShaderChunk:Ye,ShaderLib:Vn,ShaderMaterial:Ft,ShadowMaterial:Rm,Shape:bn,ShapeGeometry:cc,ShapePath:Mb,ShapeUtils:si,ShortType:cu,Skeleton:ko,SkeletonHelper:lb,SkinnedMesh:Pu,Source:Ss,Sphere:$t,SphereGeometry:hi,Spherical:ib,SphericalHarmonics3:Wm,SplineCurve:Bu,SpotLight:Xu,SpotLightHelper:ab,Sprite:gm,SpriteMaterial:Ru,SrcAlphaFactor:Za,SrcAlphaSaturateFactor:Pp,SrcColorFactor:wp,StaticCopyUsage:Kg,StaticDrawUsage:yo,StaticReadUsage:qg,StereoCamera:DS,StreamCopyUsage:Zg,StreamDrawUsage:Wg,StreamReadUsage:Yg,StringKeyframeTrack:zs,SubtractEquation:vp,SubtractiveBlending:Dh,TOUCH:yg,TangentSpaceNormalMap:Ji,TetrahedronGeometry:hc,Texture:St,TextureLoader:Gm,TextureUtils:MM,TorusGeometry:uc,TorusKnotGeometry:dc,Triangle:yn,TriangleFanDrawMode:Il,TriangleStripDrawMode:vu,TrianglesDrawMode:Gp,TubeGeometry:fc,UVMapping:Gl,Uint16BufferAttribute:Su,Uint32BufferAttribute:bu,Uint8BufferAttribute:D0,Uint8ClampedBufferAttribute:U0,Uniform:Ju,UniformsGroup:QS,UniformsLib:_e,UniformsUtils:Is,UnsignedByteType:ai,UnsignedInt248Type:Rs,UnsignedInt5999Type:hu,UnsignedIntType:Ai,UnsignedShort4444Type:ql,UnsignedShort5551Type:Xl,UnsignedShortType:Mr,VSMShadowMap:jn,Vector2:W,Vector3:S,Vector4:tt,VectorKeyframeTrack:Os,VideoTexture:HM,WebGL3DRenderTarget:S0,WebGLArrayRenderTarget:M0,WebGLCoordinateSystem:ei,WebGLCubeRenderTarget:om,WebGLMultipleRenderTargets:bb,WebGLRenderTarget:dn,WebGLRenderer:pm,WebGLUtils:dm,WebGPUCoordinateSystem:xo,WireframeGeometry:Cm,WrapAroundEnding:mo,ZeroCurvatureEnding:xs,ZeroFactor:Sp,ZeroSlopeEnding:Ms,ZeroStencilOp:Rg,createCanvasElement:em},Symbol.toStringTag,{value:"Module"})),Qm={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class Hs{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Tb=new Lr(-1,1,1,-1,0,1);class Ab extends Ve{constructor(){super(),this.setAttribute("position",new Ee([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Ee([0,2,0,0,2,0],2))}}const Eb=new Ab;class Qu{constructor(e){this._mesh=new ce(Eb,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Tb)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Xh extends Hs{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof Ft?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Is.clone(e.uniforms),this.material=new Ft({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new Qu(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class Wf extends Hs{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const i=e.getContext(),s=e.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),s.buffers.stencil.setFunc(i.ALWAYS,o,4294967295),s.buffers.stencil.setClear(a),s.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(i.EQUAL,1,4294967295),s.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),s.buffers.stencil.setLocked(!0)}}class Cb extends Hs{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class Rb{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new W);this._width=n.width,this._height=n.height,t=new dn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:ni}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Xh(Qm),this.copyPass.material.blending=ti,this.clock=new mc}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let i=0,s=this.passes.length;i<s;i++){const o=this.passes[i];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),o.needsSwap){if(n){const a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}Wf!==void 0&&(o instanceof Wf?n=!0:o instanceof Cb&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new W);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(n,i),this.renderTarget2.setSize(n,i);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(n,i)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Pb extends Hs{constructor(e,t,n=null,i=null,s=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new oe}render(e,t,n){const i=e.autoClear;e.autoClear=!1;let s,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(s=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=i}}const Ib={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new oe(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class Er extends Hs{constructor(e,t,n,i){super(),this.strength=t!==void 0?t:1,this.radius=n,this.threshold=i,this.resolution=e!==void 0?new W(e.x,e.y):new W(256,256),this.clearColor=new oe(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new dn(s,o,{type:ni}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){const d=new dn(s,o,{type:ni});d.texture.name="UnrealBloomPass.h"+u,d.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(d);const f=new dn(s,o,{type:ni});f.texture.name="UnrealBloomPass.v"+u,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),s=Math.round(s/2),o=Math.round(o/2)}const a=Ib;this.highPassUniforms=Is.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Ft({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];const l=[3,5,7,9,11];s=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(l[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new W(1/s,1/o),s=Math.round(s/2),o=Math.round(o/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new S(1,1,1),new S(1,1,1),new S(1,1,1),new S(1,1,1),new S(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const h=Qm;this.copyUniforms=Is.clone(h.uniforms),this.blendMaterial=new Ft({uniforms:this.copyUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader,blending:$a,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new oe,this.oldClearAlpha=1,this.basic=new Ot,this.fsQuad=new Qu(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),i=Math.round(t/2);this.renderTargetBright.setSize(n,i);for(let s=0;s<this.nMips;s++)this.renderTargetsHorizontal[s].setSize(n,i),this.renderTargetsVertical[s].setSize(n,i),this.separableBlurMaterials[s].uniforms.invSize.value=new W(1/n,1/i),n=Math.round(n/2),i=Math.round(i/2)}render(e,t,n,i,s){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),s&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=Er.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=Er.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this.fsQuad.render(e),a=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(n),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=o}getSeperableBlurMaterial(e){const t=[];for(let n=0;n<e;n++)t.push(.39894*Math.exp(-.5*n*n/(e*e))/e);return new Ft({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new W(.5,.5)},direction:{value:new W(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(e){return new Ft({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}Er.BlurDirectionX=new W(1,0);Er.BlurDirectionY=new W(0,1);const Lb={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

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

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class Nb extends Hs{constructor(){super();const e=Lb;this.uniforms=Is.clone(e.uniforms),this.material=new ku({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new Qu(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Je.getTransfer(this._outputColorSpace)===ut&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===iu?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===su?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===ru?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Hl?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===ou?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===au&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const Db={name:"FXAAShader",uniforms:{tDiffuse:{value:null},resolution:{value:new W(1/1024,1/512)}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
		precision highp float;

		uniform sampler2D tDiffuse;

		uniform vec2 resolution;

		varying vec2 vUv;

		// FXAA 3.11 implementation by NVIDIA, ported to WebGL by Agost Biro (biro@archilogic.com)

		//----------------------------------------------------------------------------------
		// File:        es3-keplerFXAAassetsshaders/FXAA_DefaultES.frag
		// SDK Version: v3.00
		// Email:       gameworks@nvidia.com
		// Site:        http://developer.nvidia.com/
		//
		// Copyright (c) 2014-2015, NVIDIA CORPORATION. All rights reserved.
		//
		// Redistribution and use in source and binary forms, with or without
		// modification, are permitted provided that the following conditions
		// are met:
		//  * Redistributions of source code must retain the above copyright
		//    notice, this list of conditions and the following disclaimer.
		//  * Redistributions in binary form must reproduce the above copyright
		//    notice, this list of conditions and the following disclaimer in the
		//    documentation and/or other materials provided with the distribution.
		//  * Neither the name of NVIDIA CORPORATION nor the names of its
		//    contributors may be used to endorse or promote products derived
		//    from this software without specific prior written permission.
		//
		// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS ''AS IS'' AND ANY
		// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
		// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
		// PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
		// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
		// EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
		// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
		// PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
		// OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
		// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
		// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
		//
		//----------------------------------------------------------------------------------

		#ifndef FXAA_DISCARD
			//
			// Only valid for PC OpenGL currently.
			// Probably will not work when FXAA_GREEN_AS_LUMA = 1.
			//
			// 1 = Use discard on pixels which don't need AA.
			//     For APIs which enable concurrent TEX+ROP from same surface.
			// 0 = Return unchanged color on pixels which don't need AA.
			//
			#define FXAA_DISCARD 0
		#endif

		/*--------------------------------------------------------------------------*/
		#define FxaaTexTop(t, p) texture2D(t, p, -100.0)
		#define FxaaTexOff(t, p, o, r) texture2D(t, p + (o * r), -100.0)
		/*--------------------------------------------------------------------------*/

		#define NUM_SAMPLES 5

		// assumes colors have premultipliedAlpha, so that the calculated color contrast is scaled by alpha
		float contrast( vec4 a, vec4 b ) {
			vec4 diff = abs( a - b );
			return max( max( max( diff.r, diff.g ), diff.b ), diff.a );
		}

		/*============================================================================

									FXAA3 QUALITY - PC

		============================================================================*/

		/*--------------------------------------------------------------------------*/
		vec4 FxaaPixelShader(
			vec2 posM,
			sampler2D tex,
			vec2 fxaaQualityRcpFrame,
			float fxaaQualityEdgeThreshold,
			float fxaaQualityinvEdgeThreshold
		) {
			vec4 rgbaM = FxaaTexTop(tex, posM);
			vec4 rgbaS = FxaaTexOff(tex, posM, vec2( 0.0, 1.0), fxaaQualityRcpFrame.xy);
			vec4 rgbaE = FxaaTexOff(tex, posM, vec2( 1.0, 0.0), fxaaQualityRcpFrame.xy);
			vec4 rgbaN = FxaaTexOff(tex, posM, vec2( 0.0,-1.0), fxaaQualityRcpFrame.xy);
			vec4 rgbaW = FxaaTexOff(tex, posM, vec2(-1.0, 0.0), fxaaQualityRcpFrame.xy);
			// . S .
			// W M E
			// . N .

			bool earlyExit = max( max( max(
					contrast( rgbaM, rgbaN ),
					contrast( rgbaM, rgbaS ) ),
					contrast( rgbaM, rgbaE ) ),
					contrast( rgbaM, rgbaW ) )
					< fxaaQualityEdgeThreshold;
			// . 0 .
			// 0 0 0
			// . 0 .

			#if (FXAA_DISCARD == 1)
				if(earlyExit) FxaaDiscard;
			#else
				if(earlyExit) return rgbaM;
			#endif

			float contrastN = contrast( rgbaM, rgbaN );
			float contrastS = contrast( rgbaM, rgbaS );
			float contrastE = contrast( rgbaM, rgbaE );
			float contrastW = contrast( rgbaM, rgbaW );

			float relativeVContrast = ( contrastN + contrastS ) - ( contrastE + contrastW );
			relativeVContrast *= fxaaQualityinvEdgeThreshold;

			bool horzSpan = relativeVContrast > 0.;
			// . 1 .
			// 0 0 0
			// . 1 .

			// 45 deg edge detection and corners of objects, aka V/H contrast is too similar
			if( abs( relativeVContrast ) < .3 ) {
				// locate the edge
				vec2 dirToEdge;
				dirToEdge.x = contrastE > contrastW ? 1. : -1.;
				dirToEdge.y = contrastS > contrastN ? 1. : -1.;
				// . 2 .      . 1 .
				// 1 0 2  ~=  0 0 1
				// . 1 .      . 0 .

				// tap 2 pixels and see which ones are "outside" the edge, to
				// determine if the edge is vertical or horizontal

				vec4 rgbaAlongH = FxaaTexOff(tex, posM, vec2( dirToEdge.x, -dirToEdge.y ), fxaaQualityRcpFrame.xy);
				float matchAlongH = contrast( rgbaM, rgbaAlongH );
				// . 1 .
				// 0 0 1
				// . 0 H

				vec4 rgbaAlongV = FxaaTexOff(tex, posM, vec2( -dirToEdge.x, dirToEdge.y ), fxaaQualityRcpFrame.xy);
				float matchAlongV = contrast( rgbaM, rgbaAlongV );
				// V 1 .
				// 0 0 1
				// . 0 .

				relativeVContrast = matchAlongV - matchAlongH;
				relativeVContrast *= fxaaQualityinvEdgeThreshold;

				if( abs( relativeVContrast ) < .3 ) { // 45 deg edge
					// 1 1 .
					// 0 0 1
					// . 0 1

					// do a simple blur
					return mix(
						rgbaM,
						(rgbaN + rgbaS + rgbaE + rgbaW) * .25,
						.4
					);
				}

				horzSpan = relativeVContrast > 0.;
			}

			if(!horzSpan) rgbaN = rgbaW;
			if(!horzSpan) rgbaS = rgbaE;
			// . 0 .      1
			// 1 0 1  ->  0
			// . 0 .      1

			bool pairN = contrast( rgbaM, rgbaN ) > contrast( rgbaM, rgbaS );
			if(!pairN) rgbaN = rgbaS;

			vec2 offNP;
			offNP.x = (!horzSpan) ? 0.0 : fxaaQualityRcpFrame.x;
			offNP.y = ( horzSpan) ? 0.0 : fxaaQualityRcpFrame.y;

			bool doneN = false;
			bool doneP = false;

			float nDist = 0.;
			float pDist = 0.;

			vec2 posN = posM;
			vec2 posP = posM;

			int iterationsUsedN = 0;
			int iterationsUsedP = 0;
			for( int i = 0; i < NUM_SAMPLES; i++ ) {

				float increment = float(i + 1);

				if(!doneN) {
					nDist += increment;
					posN = posM + offNP * nDist;
					vec4 rgbaEndN = FxaaTexTop(tex, posN.xy);
					doneN = contrast( rgbaEndN, rgbaM ) > contrast( rgbaEndN, rgbaN );
					iterationsUsedN = i;
				}

				if(!doneP) {
					pDist += increment;
					posP = posM - offNP * pDist;
					vec4 rgbaEndP = FxaaTexTop(tex, posP.xy);
					doneP = contrast( rgbaEndP, rgbaM ) > contrast( rgbaEndP, rgbaN );
					iterationsUsedP = i;
				}

				if(doneN || doneP) break;
			}


			if ( !doneP && !doneN ) return rgbaM; // failed to find end of edge

			float dist = min(
				doneN ? float( iterationsUsedN ) / float( NUM_SAMPLES - 1 ) : 1.,
				doneP ? float( iterationsUsedP ) / float( NUM_SAMPLES - 1 ) : 1.
			);

			// hacky way of reduces blurriness of mostly diagonal edges
			// but reduces AA quality
			dist = pow(dist, .5);

			dist = 1. - dist;

			return mix(
				rgbaM,
				rgbaN,
				dist * .5
			);
		}

		void main() {
			const float edgeDetectionQuality = .2;
			const float invEdgeDetectionQuality = 1. / edgeDetectionQuality;

			gl_FragColor = FxaaPixelShader(
				vUv,
				tDiffuse,
				resolution,
				edgeDetectionQuality, // [0,1] contrast needed, otherwise early discard
				invEdgeDetectionQuality
			);

		}
	`};class gc extends Hs{constructor(e){super(),this.needsSwap=!1,this._renderer=e}render(e){const t=e.getSize(gc._v2);e.setViewport(0,0,t.x,t.y),e.setScissorTest(!1)}}gc._v2=new W;const Ub={uniforms:{tDiffuse:{value:null},uVignetteStrength:{value:.28},uGrainAmount:{value:.016},uTime:{value:0},uContrast:{value:1.04},uSaturation:{value:1.08}},vertexShader:`
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float uVignetteStrength;
    uniform float uGrainAmount;
    uniform float uTime;
    uniform float uContrast;
    uniform float uSaturation;
    varying vec2 vUv;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(41.7, 289.1))) * 43758.5453123); }
    void main() {
      vec3 c = texture2D(tDiffuse, vUv).rgb;
      vec3 sCurve = c * c * (3.0 - 2.0 * c);
      c = mix(c, sCurve, 0.15);
      c = (c - 0.5) * uContrast + 0.5;
      float luma = dot(c, vec3(0.2126, 0.7152, 0.0722));
      c = mix(vec3(luma), c, uSaturation);
      float shadowW = 1.0 - smoothstep(0.0, 0.5, luma);
      float highlightW = smoothstep(0.5, 1.0, luma);
      c += vec3(-0.008, -0.003, 0.01) * shadowW + vec3(0.01, 0.004, -0.01) * highlightW;
      vec2 d = vUv - 0.5;
      c *= 1.0 - dot(d, d) * uVignetteStrength;
      float g = (hash(vUv * vec2(1920.0, 1080.0) + uTime) - 0.5) * uGrainAmount;
      float dither = (hash(vUv * vec2(127.1, 311.7) + uTime * 0.37) - 0.5) * (1.0 / 255.0) * 2.0;
      c += g + dither;
      gl_FragColor = vec4(clamp(c, 0.0, 1.0), 1.0);
    }
  `};class Ob{constructor(e){this.renderer=new pm({canvas:e,antialias:!0,powerPreference:"high-performance",stencil:!1}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.75)),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=nu,this.renderer.toneMapping=Hl,this.renderer.toneMappingExposure=1.15,this.renderer.outputColorSpace=Nt,this.composer=null,this.fxaaPass=null,this.gradePass=null,this.bloomPass=null,this._useComposer=!1,this._composerHealthy=!1,this._probeFrames=0}setup(e,t){this._scene=e,this._camera=t;const n=window.innerWidth,i=window.innerHeight;try{const s=new Pb(e,t);this.bloomPass=new Er(new W(n,i),.22,.45,.82),this.gradePass=new Xh(Ub),this.fxaaPass=new Xh(Db);const o=this.renderer.getPixelRatio();this.fxaaPass.material.uniforms.resolution.value.set(1/(n*o),1/(i*o));const a=new Nb;this.composer=new Rb(this.renderer),this.composer.addPass(s),this.composer.addPass(this.bloomPass),this.composer.addPass(new gc(this.renderer)),this.composer.addPass(a),this.composer.addPass(this.gradePass),this.composer.addPass(this.fxaaPass)}catch(s){console.warn("[RenderPipeline] composer setup failed",s),this.composer=null}}resize(){const e=window.innerWidth,t=window.innerHeight;if(this.renderer.setSize(e,t),this.composer&&this.composer.setSize(e,t),this.fxaaPass){const n=this.renderer.getPixelRatio();this.fxaaPass.material.uniforms.resolution.value.set(1/(e*n),1/(t*n))}}render(e){if(this.gradePass&&(this.gradePass.uniforms.uTime.value=e),!this._useComposer||!this.composer){this.renderer.render(this._scene,this._camera),this._probeFrames++,this.composer&&!this._composerHealthy&&this._probeFrames===8&&(this._useComposer=!0);return}const t=this.renderer.info,n=t.autoReset;t.autoReset=!1,t.reset();try{this.composer.render(),t.render.triangles<=10?(this._composerFail=(this._composerFail||0)+1,this._composerFail>3&&(this._useComposer=!1,this._composerHealthy=!1,console.warn("[RenderPipeline] composer output collapsed; using raw renderer"))):(this._composerHealthy=!0,this._composerFail=0)}catch(i){this._useComposer=!1,this.renderer.render(this._scene,this._camera),console.warn("[RenderPipeline] composer threw; raw fallback",i)}finally{t.autoReset=n}}}const gh={uniforms:{uSunDirection:{value:new S(0,.5,-1)},uZenithColor:{value:new oe(1854854)},uHorizonColor:{value:new oe(11455453)},uSunColor:{value:new oe(16773846)},uCloudCoverage:{value:.22},uCloudiness:{value:.92},uCloudColorLit:{value:new oe(16777215)},uCloudColorShadow:{value:new oe(4280676)},uTime:{value:0}},vertexShader:`
    varying vec3 vWorldPosition;
    void main() {
      vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      gl_Position.z = gl_Position.w;
    }
  `,fragmentShader:`
    varying vec3 vWorldPosition;
    uniform vec3 uSunDirection;
    uniform vec3 uZenithColor;
    uniform vec3 uHorizonColor;
    uniform vec3 uSunColor;
    uniform float uCloudCoverage;
    uniform float uCloudiness;
    uniform vec3 uCloudColorLit;
    uniform vec3 uCloudColorShadow;
    uniform float uTime;

    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }
    float fbm(vec2 p) {
      float v = 0.0, amp = 0.52;
      for (int i = 0; i < 6; i++) { v += amp * noise(p); p *= 2.08; amp *= 0.5; }
      return v;
    }

    void main() {
      vec3 dir = normalize(vWorldPosition - cameraPosition);
      float elevation = dir.y;

      float skyMix = pow(clamp(elevation, 0.0, 1.0), 0.45);
      vec3 sky = mix(uHorizonColor, uZenithColor, skyMix);

      // subtle extra warmth low near the horizon
      float lowBand = 1.0 - smoothstep(0.0, 0.22, elevation);
      sky = mix(sky, sky + vec3(0.05, 0.02, -0.02), lowBand * 0.5);

      // Directional aerial-perspective haze: real skies are visibly brighter and warmer
      // in a band around the sun's azimuth near the horizon (forward Mie scattering),
      // and slightly darker/cooler on the anti-sun side. A horizonColor that's flat in
      // every direction is one of the biggest "cheap CG sky" tells — this breaks that up
      // and gives the sky a sense of depth/directionality without touching the base
      // gradient uniforms (still fully driven by uZenithColor/uHorizonColor).
      vec3 horizDirN = normalize(vec3(dir.x, 0.0, dir.z));
      vec3 horizSunN = normalize(vec3(uSunDirection.x, 0.0, uSunDirection.z));
      float sunAz = dot(horizDirN, horizSunN);
      float hazeBand = (1.0 - smoothstep(0.0, 0.5, elevation)) * clamp(elevation * 4.0 + 0.15, 0.0, 1.0);
      float hazeDir = sunAz * 0.5 + 0.5;
      vec3 hazeWarm = vec3(0.07, 0.032, -0.034) * pow(hazeDir, 2.0);
      vec3 hazeCool = vec3(-0.016, -0.006, 0.012) * pow(1.0 - hazeDir, 2.0);
      sky += (hazeWarm + hazeCool) * hazeBand;

      // below-horizon (looking down toward sea from a height, sky box interior) — keep consistent with horizon color
      if (elevation < 0.0) {
        sky = uHorizonColor * 0.9;
      }

      // sun disc / corona / halo
      float sunDot = dot(dir, normalize(uSunDirection));
      float sunDisc = smoothstep(0.99920, 0.99982, sunDot);
      float corona = pow(clamp(sunDot, 0.0, 1.0), 280.0) * 1.15;
      float halo = pow(clamp(sunDot, 0.0, 1.0), 9.0) * 0.32;
      vec3 sunContribution = uSunColor * (sunDisc * 14.0 + corona * 5.5 + halo);

      // cloud layer — simple spherical (azimuth, elevation) sky-dome UV, robust at all angles
      float cloudFade = smoothstep(0.0, 0.12, elevation) * (1.0 - smoothstep(0.7, 1.0, elevation));
      float az = atan(dir.z, dir.x);
      vec2 cuv = vec2(az * 1.6, elevation * 3.0) + vec2(uTime * 0.006, uTime * 0.0015);
      float base = fbm(cuv);
      float detail = fbm(cuv * 3.3 + 4.0) * 0.5;
      float cloudN = base * 0.7 + detail * 0.3;
      float cloud = smoothstep(uCloudCoverage, uCloudCoverage + 0.42, cloudN);
      cloud = pow(cloud, 1.3);

      vec3 horizDir = normalize(vec3(dir.x, 0.0, dir.z));
      vec3 horizSun = normalize(vec3(uSunDirection.x, 0.0, uSunDirection.z));
      float sunFacing = clamp(dot(horizDir, horizSun) * 0.5 + 0.5, 0.0, 1.0);
      vec3 cloudColor = mix(uCloudColorShadow, uCloudColorLit, pow(sunFacing, 1.6));
      cloudColor += uSunColor * corona * 0.15;

      sky = mix(sky, cloudColor, cloud * cloudFade * uCloudiness);

      vec3 color = sky + sunContribution * (1.0 - cloud * cloudFade * 0.85);
      gl_FragColor = vec4(color, 1.0);
    }
  `};class Fb{constructor(e,t){this.renderer=e,this.scene=t;const n=new it(1,1,1),i=new Ft({uniforms:Is.clone(gh.uniforms),vertexShader:gh.vertexShader,fragmentShader:gh.fragmentShader,side:sn,depthWrite:!1,fog:!1,toneMapped:!1});this.sky=new ce(n,i),this.sky.scale.setScalar(45e3),t.add(this.sky),this.sunPosition=new S,this.sunDirection=new S,this.sunLight=new Wo(16773856,3.2),this.sunLight.castShadow=!0,this.sunLight.shadow.mapSize.set(2048,2048),this.sunLight.shadow.camera.near=10,this.sunLight.shadow.camera.far=900,this.sunLight.shadow.camera.left=-260,this.sunLight.shadow.camera.right=260,this.sunLight.shadow.camera.top=260,this.sunLight.shadow.camera.bottom=-260,this.sunLight.shadow.bias=-7e-4,this.sunLight.shadow.normalBias=.02,t.add(this.sunLight),t.add(this.sunLight.target),this.hemiLight=new Wu(10470632,1714975,.65),t.add(this.hemiLight),this.pmrem=new Ll(e),this.pmrem.compileEquirectangularShader(),this.envRT=null,this._elevation=34,this._azimuth=200,this.setSunAngle(this._elevation,this._azimuth),this.updateEnvMap()}setSunAngle(e,t){this._elevation=e,this._azimuth=t;const n=Ie.degToRad(90-e),i=Ie.degToRad(t);this.sunPosition.setFromSphericalCoords(1,n,i),this.sunDirection.copy(this.sunPosition).normalize(),this.sky.material.uniforms.uSunDirection.value.copy(this.sunDirection),this.sunLight.position.copy(this.sunPosition).multiplyScalar(400),this.sunLight.target.position.set(0,0,0);const o=Ie.clamp(e/45,0,1);this.sunLight.intensity=Ie.lerp(1.6,3.6,o);const a=new oe(16751954),l=new oe(16774370);this.sunLight.color.copy(a).lerp(l,o);const c=this.sky.material.uniforms,h=new oe(1723784),u=new oe(2899819),d=new oe(12178662),f=new oe(15247466);c.uZenithColor.value.copy(u).lerp(h,o),c.uHorizonColor.value.copy(f).lerp(d,o),c.uSunColor.value.copy(a).lerp(l,o),c.uZenithColor.value.set(998776),c.uHorizonColor.value.set(10339292)}updateEnvMap(){return this.envRT&&this.envRT.dispose(),this.envRT=this.pmrem.fromScene(this.sky,.04),this.scene.environment=this.envRT.texture,this.envRT.texture}update(e,t=0){this.sky.position.set(e.position.x,0,e.position.z),this.sky.material.uniforms.uTime.value=t}}const hr=[[1,.2,.34,74,1.05],[.65,-.75,.28,48,1.3],[-.4,.9,.22,31,1.7],[.9,.5,.16,19,2.1],[-.75,-.6,.13,12,2.6],[.2,-1,.09,7.2,3.4],[-1,.15,.07,4.1,4.3],[.55,.83,.05,2.3,5.6]];function Bb(){let r=`#define NUM_WAVES ${hr.length}
`;return r+=`uniform vec4 uWaveA[NUM_WAVES];
uniform vec2 uWaveB[NUM_WAVES];
`,r}const kb=`
// Returns displaced position + accumulates normal
vec3 gerstner(vec3 p, float t, out vec3 tangent, out vec3 binormal) {
  vec3 offset = vec3(0.0);
  tangent = vec3(1.0, 0.0, 0.0);
  binormal = vec3(0.0, 0.0, 1.0);
  float steepSum = 0.0;
  for (int i = 0; i < NUM_WAVES; i++) {
    vec2 dir = uWaveA[i].xy;
    float steepness = uWaveA[i].z;
    float wavelength = uWaveA[i].w;
    float speed = uWaveB[i].x;
    float k = 6.28318530718 / wavelength;
    float c = sqrt(9.8 / k) * speed * 0.35 + speed * 0.15;
    float f = k * (dot(dir, p.xz) - c * t * 3.0);
    float a = steepness / k / float(NUM_WAVES) * 2.2;
    offset.x += dir.x * a * cos(f);
    offset.z += dir.y * a * cos(f);
    offset.y += a * sin(f) * 0.72;

    float wa = k * a;
    tangent += vec3(
      -dir.x * dir.x * wa * sin(f),
      dir.x * wa * cos(f),
      -dir.x * dir.y * wa * sin(f)
    );
    binormal += vec3(
      -dir.x * dir.y * wa * sin(f),
      dir.y * wa * cos(f),
      -dir.y * dir.y * wa * sin(f)
    );
  }
  return offset;
}
`,zb=`
${Bb()}
uniform float uTime;
uniform vec3 uCamPos;
varying vec3 vWorldPos;
varying vec3 vNormal;
varying float vFoamFactor;
varying float vFresnelBoost;

${kb}

void main() {
  vec3 pos = position;
  // world-space XZ (grid is re-centered on camera each frame via mesh position)
  vec3 worldXZ = pos + vec3(modelMatrix[3].x, 0.0, modelMatrix[3].z);

  vec3 tangent, binormal;
  vec3 disp = gerstner(worldXZ, uTime, tangent, binormal);
  pos += disp;

  vec3 n = normalize(cross(binormal, tangent));
  vNormal = n;

  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vWorldPos = worldPos.xyz;

  // crude crest/foam factor from steepness accumulation (jacobian-ish)
  float steep = length(tangent - vec3(1.0,0.0,0.0)) + length(binormal - vec3(0.0,0.0,1.0));
  vFoamFactor = clamp(steep - 0.55, 0.0, 1.6);

  float distToCam = length(uCamPos - worldPos.xyz);
  vFresnelBoost = smoothstep(800.0, 40.0, distToCam);

  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`,Hb=`
uniform float uTime;
uniform vec3 uSunDirection;
uniform vec3 uSunColor;
uniform vec3 uCamPos;
uniform samplerCube uEnvMap;
uniform vec3 uDeepColor;
uniform vec3 uShallowColor;
uniform vec3 uFogColor;
uniform float uFogDensity;

varying vec3 vWorldPos;
varying vec3 vNormal;
varying float vFoamFactor;
varying float vFresnelBoost;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float fbm(vec2 p) {
  float v = 0.0, amp = 0.5;
  for (int i = 0; i < 5; i++) { v += amp * noise(p); p *= 2.02; amp *= 0.5; }
  return v;
}

void main() {
  vec3 viewDir = normalize(uCamPos - vWorldPos);

  // Fine ripple detail via layered noise-driven normal perturbation
  vec2 rp = vWorldPos.xz * 0.06 + uTime * 0.035;
  float n1 = fbm(rp);
  vec2 grad = vec2(n1 - fbm(rp + vec2(0.6, 0.0)), n1 - fbm(rp + vec2(0.0, 0.6)));

  // Second, much higher-frequency micro-ripple layer. This is what actually reads as
  // "crisp" sun glitter rather than "soft": real ocean sparkle comes from high-frequency
  // slope variance breaking a highlight into many small glints, not from the low-freq
  // layer alone (which just makes broad, smeared crescents). Kept low-amplitude so it
  // perturbs the specular response without visibly roughening the base water shading.
  vec2 rp2 = vWorldPos.xz * 0.34 - uTime * 0.05;
  float n2 = fbm(rp2);
  vec2 grad2 = vec2(n2 - fbm(rp2 + vec2(0.35, 0.0)), n2 - fbm(rp2 + vec2(0.0, 0.35)));

  vec3 detailNormal = normalize(vec3(grad.x * 1.4 + grad2.x * 0.6, 1.0, grad.y * 1.4 + grad2.y * 0.6));

  vec3 N = normalize(mix(vNormal, normalize(vNormal + detailNormal * 0.6), 0.8));

  float NdotV = clamp(dot(N, viewDir), 0.0, 1.0);
  float fresnel = pow(1.0 - NdotV, 5.0);
  fresnel = mix(0.02, 1.0, fresnel);

  // Reflection
  vec3 reflectDir = reflect(-viewDir, N);
  vec3 reflColor = textureCube(uEnvMap, reflectDir).rgb;

  // Water body colour — deeper for grazing view, lighter/greener near-surface
  float depthMix = clamp(dot(N, vec3(0.0,1.0,0.0)), 0.0, 1.0);
  vec3 waterColor = mix(uDeepColor, uShallowColor, pow(depthMix, 3.0) * 0.4);

  // Sun specular glitter — sharp + sparkle-modulated. Values here feed straight into
  // UnrealBloomPass on the raw HDR buffer (before tonemapping), so a large multiplier
  // doesn't just look "bright" after ACES compresses it — it blooms out into one huge
  // clipped white blob. Keep the core tight and soft-clamp the peak instead of letting
  // it run away, so bloom sees a field of small sparkles rather than one flashbulb.
  vec3 halfDir = normalize(uSunDirection + viewDir);
  float NdotH = clamp(dot(N, halfDir), 0.0, 1.0);
  float specRaw = pow(NdotH, 900.0);
  float spec = min(specRaw * 0.9, 0.9);
  // Tight secondary lobe: a much higher exponent than the base lobe, low weight, layered
  // underneath it. It only lights up the exact peak of each glint (a tiny fraction of the
  // pixels the base lobe already covers), giving the highlight a hard, defined core
  // instead of one uniformly-soft blob — without materially raising the energy the broad
  // lobe already sends into bloom, so it doesn't reopen the old clipped-sunpath bug.
  float specCore = pow(NdotH, 3000.0) * 0.4;
  float sparkle = smoothstep(0.965, 1.0, noise(vWorldPos.xz * 9.0 + uTime * 1.9));
  float glitter = pow(NdotH, 260.0) * sparkle * 0.9;
  vec3 sunSpec = uSunColor * (spec + specCore + glitter) * (0.4 + 0.6 * vFresnelBoost);

  // Foam — multi-scale so crests read as organic streaks, not noise speckles
  float foamNoise = fbm(vWorldPos.xz * 0.35 + uTime * 0.12);
  float foamFine = fbm(vWorldPos.xz * 1.4 - uTime * 0.2);
  float foamMask = clamp(vFoamFactor * 1.55 - 0.18, 0.0, 1.0);
  foamMask *= smoothstep(0.2, 0.78, foamNoise * 0.65 + foamFine * 0.35 + vFoamFactor * 0.25);
  vec3 foamColor = vec3(0.92, 0.96, 0.99);

  // Distant water deepens + desaturates (beer-lambert-ish) so the near field pops
  float dist = length(uCamPos - vWorldPos);
  float absorb = 1.0 - exp(-dist * 0.00035);
  waterColor = mix(waterColor, uDeepColor * 0.72, absorb * 0.65);

  // Stronger env reflection near horizon (grazing angles)
  float horizonBoost = pow(1.0 - clamp(N.y, 0.0, 1.0), 2.5);
  vec3 base = mix(waterColor, reflColor, fresnel * 0.88 + horizonBoost * 0.25);
  base += sunSpec * (1.0 + horizonBoost * 0.5);
  base = mix(base, foamColor, foamMask);

  // Distance fog — dithered in the grade pass; keep soft here
  float fog = 1.0 - exp(-dist * uFogDensity);
  fog = clamp(fog, 0.0, 1.0);
  // Keep a touch more water color at mid range so the ocean doesn't go to flat haze
  fog *= smoothstep(0.0, 1.0, fog);
  vec3 color = mix(base, uFogColor, fog * 0.92);

  gl_FragColor = vec4(color, 1.0);
}
`;class Gb{constructor(e,t){this.renderer=e;const n=2600,i=320,s=new In(n,n,i,i);s.rotateX(-Math.PI/2),s.computeBoundingSphere();const o=hr.map(c=>new tt(c[0],c[1],c[2],c[3])),a=hr.map(c=>new W(c[4],0));this.uniforms={uTime:{value:0},uCamPos:{value:new S},uWaveA:{value:o},uWaveB:{value:a},uSunDirection:{value:t.clone()},uSunColor:{value:new oe(16773336)},uEnvMap:{value:null},uDeepColor:{value:new oe(137258)},uShallowColor:{value:new oe(810086)},uFogColor:{value:new oe(11454422)},uFogDensity:{value:75e-5}},this.material=new Ft({vertexShader:zb,fragmentShader:Hb,uniforms:this.uniforms,lights:!1,fog:!1}),this.mesh=new ce(s,this.material),this.mesh.receiveShadow=!1,this.mesh.frustumCulled=!1;const l=new Ur(n*.48,18e3,64,1);l.rotateX(-Math.PI/2),this.skirtMat=new Ot({color:736326,fog:!1}),this.skirt=new ce(l,this.skirtMat),this.skirt.position.y=-1.2,this.group=new Mt,this.group.add(this.mesh),this.group.add(this.skirt)}setEnvMap(e){this.uniforms.uEnvMap.value=e}setFogColor(e){this.uniforms.uFogColor.value.copy(e),this.skirtMat.color.copy(e).multiplyScalar(.55)}update(e,t,n){this.uniforms.uTime.value=t,this.uniforms.uCamPos.value.copy(n.position);const i=2600/320;this.mesh.position.x=Math.round(n.position.x/i)*i,this.mesh.position.z=Math.round(n.position.z/i)*i,this.skirt.position.x=n.position.x,this.skirt.position.z=n.position.z}getHeightAt(e,t,n){let i=0;for(const[s,o,a,l]of hr){const c=2*Math.PI/l,h=hr.find(p=>p[3]===l)[4],u=Math.sqrt(9.8/c)*h*.35+h*.15,d=c*(s*e+o*t-u*n*3),f=a/c/hr.length*2.2;i+=f*Math.sin(d)*.72}return i}}const qf=new ct;new S;function Vb(r){return r<.5?4*r*r*r:1-Math.pow(-2*r+2,3)/2}class Wb{constructor(e){this.camera=e,this.position=e.position.clone(),this.quaternion=e.quaternion.clone(),this.fov=e.fov,this._fromPos=this.position.clone(),this._fromQuat=this.quaternion.clone(),this._fromFov=this.fov,this._toPos=this.position.clone(),this._toQuat=this.quaternion.clone(),this._toFov=this.fov,this._t=1,this._duration=1,this._onComplete=null,this.lookYaw=0,this.lookPitch=0,this.lookEnabled=!1,this.lookLimits={yaw:Math.PI,pitchMin:-1.3,pitchMax:1.3}}setImmediate(e,t,n=this.camera.fov){this.position.copy(e),this.quaternion.copy(t),this.fov=n,this._fromPos.copy(e),this._fromQuat.copy(t),this._fromFov=n,this._toPos.copy(e),this._toQuat.copy(t),this._toFov=n,this._t=1,this._applyToCamera()}transitionTo(e,t,n=this.camera.fov,i=1.1,s=null){this._fromPos.copy(this.position),this._fromQuat.copy(this.quaternion),this._fromFov=this.fov,this._toPos.copy(e),this._toQuat.copy(t),this._toFov=n,this._duration=Math.max(i,1e-4),this._t=0,this._onComplete=s}retarget(e,t,n=this._toFov){this._toPos.copy(e),this._toQuat.copy(t),this._toFov=n}get isTransitioning(){return this._t<1}update(e){if(this._t<1){this._t=Math.min(1,this._t+e/this._duration);const t=Vb(this._t);if(this.position.lerpVectors(this._fromPos,this._toPos,t),qf.copy(this._fromQuat).slerp(this._toQuat,t),this.quaternion.copy(qf),this.fov=Ie.lerp(this._fromFov,this._toFov,t),this._t>=1&&this._onComplete){const n=this._onComplete;this._onComplete=null,n()}}this._applyToCamera()}_applyToCamera(){if(this.camera.position.copy(this.position),this.lookEnabled){const e=new Zt().setFromQuaternion(this.quaternion,"YXZ"),t=e.y+this.lookYaw,n=Ie.clamp(e.x+this.lookPitch,this.lookLimits.pitchMin,this.lookLimits.pitchMax);this.camera.quaternion.setFromEuler(new Zt(n,t,e.z,"YXZ"))}else this.camera.quaternion.copy(this.quaternion);Math.abs(this.camera.fov-this.fov)>.001&&(this.camera.fov=this.fov,this.camera.updateProjectionMatrix())}addLook(e,t){this.lookYaw=Ie.clamp(this.lookYaw+e,-this.lookLimits.yaw,this.lookLimits.yaw),this.lookPitch=Ie.clamp(this.lookPitch+t,this.lookLimits.pitchMin,this.lookLimits.pitchMax)}resetLook(){this.lookYaw=0,this.lookPitch=0}}function Xf(r,e){if(e===Gp)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),r;if(e===Il||e===vu){let t=r.getIndex();if(t===null){const o=[],a=r.getAttribute("position");if(a!==void 0){for(let l=0;l<a.count;l++)o.push(l);r.setIndex(o),t=r.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),r}const n=t.count-2,i=[];if(e===Il)for(let o=1;o<=n;o++)i.push(t.getX(0)),i.push(t.getX(o)),i.push(t.getX(o+1));else for(let o=0;o<n;o++)o%2===0?(i.push(t.getX(o)),i.push(t.getX(o+1)),i.push(t.getX(o+2))):(i.push(t.getX(o+2)),i.push(t.getX(o+1)),i.push(t.getX(o)));i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const s=r.clone();return s.setIndex(i),s.clearGroups(),s}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),r}class _c extends fn{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new $b(t)}),this.register(function(t){return new Zb(t)}),this.register(function(t){return new rw(t)}),this.register(function(t){return new ow(t)}),this.register(function(t){return new aw(t)}),this.register(function(t){return new jb(t)}),this.register(function(t){return new Qb(t)}),this.register(function(t){return new ew(t)}),this.register(function(t){return new tw(t)}),this.register(function(t){return new Kb(t)}),this.register(function(t){return new nw(t)}),this.register(function(t){return new Jb(t)}),this.register(function(t){return new sw(t)}),this.register(function(t){return new iw(t)}),this.register(function(t){return new Xb(t)}),this.register(function(t){return new lw(t)}),this.register(function(t){return new cw(t)})}load(e,t,n,i){const s=this;let o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){const c=qi.extractUrlBase(e);o=qi.resolveURL(c,this.path)}else o=qi.extractUrlBase(e);this.manager.itemStart(e);const a=function(c){i?i(c):console.error(c),s.manager.itemError(e),s.manager.itemEnd(e)},l=new Yn(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{s.parse(c,o,function(h){t(h),s.manager.itemEnd(e)},a)}catch(h){a(h)}},n,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let s;const o={},a={},l=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===eg){try{o[Ke.KHR_BINARY_GLTF]=new hw(e)}catch(u){i&&i(u);return}s=JSON.parse(o[Ke.KHR_BINARY_GLTF].content)}else s=JSON.parse(l.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const c=new bw(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){const u=this.pluginCallbacks[h](c);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[u.name]=u,o[u.name]=!0}if(s.extensionsUsed)for(let h=0;h<s.extensionsUsed.length;++h){const u=s.extensionsUsed[h],d=s.extensionsRequired||[];switch(u){case Ke.KHR_MATERIALS_UNLIT:o[u]=new Yb;break;case Ke.KHR_DRACO_MESH_COMPRESSION:o[u]=new uw(s,this.dracoLoader);break;case Ke.KHR_TEXTURE_TRANSFORM:o[u]=new dw;break;case Ke.KHR_MESH_QUANTIZATION:o[u]=new fw;break;default:d.indexOf(u)>=0&&a[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}c.setExtensions(o),c.setPlugins(a),c.parse(n,i)}parseAsync(e,t){const n=this;return new Promise(function(i,s){n.parse(e,t,i,s)})}}function qb(){let r={};return{get:function(e){return r[e]},add:function(e,t){r[e]=t},remove:function(e){delete r[e]},removeAll:function(){r={}}}}const Ke={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class Xb{constructor(e){this.parser=e,this.name=Ke.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){const s=t[n];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let i=t.cache.get(n);if(i)return i;const s=t.json,l=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e];let c;const h=new oe(16777215);l.color!==void 0&&h.setRGB(l.color[0],l.color[1],l.color[2],qt);const u=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new Wo(h),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new Si(h),c.distance=u;break;case"spot":c=new Xu(h),c.distance=u,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),c.decay=2,vi(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),i=Promise.resolve(c),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,s=n.json.nodes[e],a=(s.extensions&&s.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(l){return n._getNodeRef(t.cache,a,l)})}}class Yb{constructor(){this.name=Ke.KHR_MATERIALS_UNLIT}getMaterialType(){return Ot}extendParams(e,t,n){const i=[];e.color=new oe(1,1,1),e.opacity=1;const s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){const o=s.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],qt),e.opacity=o[3]}s.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",s.baseColorTexture,Nt))}return Promise.all(i)}}class Kb{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=i.extensions[this.name].emissiveStrength;return s!==void 0&&(t.emissiveIntensity=s),Promise.resolve()}}class $b{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Dn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],o=i.extensions[this.name];if(o.clearcoatFactor!==void 0&&(t.clearcoat=o.clearcoatFactor),o.clearcoatTexture!==void 0&&s.push(n.assignTexture(t,"clearcoatMap",o.clearcoatTexture)),o.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=o.clearcoatRoughnessFactor),o.clearcoatRoughnessTexture!==void 0&&s.push(n.assignTexture(t,"clearcoatRoughnessMap",o.clearcoatRoughnessTexture)),o.clearcoatNormalTexture!==void 0&&(s.push(n.assignTexture(t,"clearcoatNormalMap",o.clearcoatNormalTexture)),o.clearcoatNormalTexture.scale!==void 0)){const a=o.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new W(a,a)}return Promise.all(s)}}class Zb{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_DISPERSION}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Dn}extendMaterialParams(e,t){const i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=i.extensions[this.name];return t.dispersion=s.dispersion!==void 0?s.dispersion:0,Promise.resolve()}}class Jb{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Dn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],o=i.extensions[this.name];return o.iridescenceFactor!==void 0&&(t.iridescence=o.iridescenceFactor),o.iridescenceTexture!==void 0&&s.push(n.assignTexture(t,"iridescenceMap",o.iridescenceTexture)),o.iridescenceIor!==void 0&&(t.iridescenceIOR=o.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),o.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=o.iridescenceThicknessMinimum),o.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=o.iridescenceThicknessMaximum),o.iridescenceThicknessTexture!==void 0&&s.push(n.assignTexture(t,"iridescenceThicknessMap",o.iridescenceThicknessTexture)),Promise.all(s)}}class jb{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_SHEEN}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Dn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[];t.sheenColor=new oe(0,0,0),t.sheenRoughness=0,t.sheen=1;const o=i.extensions[this.name];if(o.sheenColorFactor!==void 0){const a=o.sheenColorFactor;t.sheenColor.setRGB(a[0],a[1],a[2],qt)}return o.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=o.sheenRoughnessFactor),o.sheenColorTexture!==void 0&&s.push(n.assignTexture(t,"sheenColorMap",o.sheenColorTexture,Nt)),o.sheenRoughnessTexture!==void 0&&s.push(n.assignTexture(t,"sheenRoughnessMap",o.sheenRoughnessTexture)),Promise.all(s)}}class Qb{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Dn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],o=i.extensions[this.name];return o.transmissionFactor!==void 0&&(t.transmission=o.transmissionFactor),o.transmissionTexture!==void 0&&s.push(n.assignTexture(t,"transmissionMap",o.transmissionTexture)),Promise.all(s)}}class ew{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_VOLUME}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Dn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],o=i.extensions[this.name];t.thickness=o.thicknessFactor!==void 0?o.thicknessFactor:0,o.thicknessTexture!==void 0&&s.push(n.assignTexture(t,"thicknessMap",o.thicknessTexture)),t.attenuationDistance=o.attenuationDistance||1/0;const a=o.attenuationColor||[1,1,1];return t.attenuationColor=new oe().setRGB(a[0],a[1],a[2],qt),Promise.all(s)}}class tw{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_IOR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Dn}extendMaterialParams(e,t){const i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=i.extensions[this.name];return t.ior=s.ior!==void 0?s.ior:1.5,Promise.resolve()}}class nw{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_SPECULAR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Dn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],o=i.extensions[this.name];t.specularIntensity=o.specularFactor!==void 0?o.specularFactor:1,o.specularTexture!==void 0&&s.push(n.assignTexture(t,"specularIntensityMap",o.specularTexture));const a=o.specularColorFactor||[1,1,1];return t.specularColor=new oe().setRGB(a[0],a[1],a[2],qt),o.specularColorTexture!==void 0&&s.push(n.assignTexture(t,"specularColorMap",o.specularColorTexture,Nt)),Promise.all(s)}}class iw{constructor(e){this.parser=e,this.name=Ke.EXT_MATERIALS_BUMP}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Dn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],o=i.extensions[this.name];return t.bumpScale=o.bumpFactor!==void 0?o.bumpFactor:1,o.bumpTexture!==void 0&&s.push(n.assignTexture(t,"bumpMap",o.bumpTexture)),Promise.all(s)}}class sw{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Dn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],o=i.extensions[this.name];return o.anisotropyStrength!==void 0&&(t.anisotropy=o.anisotropyStrength),o.anisotropyRotation!==void 0&&(t.anisotropyRotation=o.anisotropyRotation),o.anisotropyTexture!==void 0&&s.push(n.assignTexture(t,"anisotropyMap",o.anisotropyTexture)),Promise.all(s)}}class rw{constructor(e){this.parser=e,this.name=Ke.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;const s=i.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,s.source,o)}}class ow{constructor(e){this.parser=e,this.name=Ke.EXT_TEXTURE_WEBP,this.isSupported=null}loadTexture(e){const t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;const o=s.extensions[t],a=i.images[o.source];let l=n.textureLoader;if(a.uri){const c=n.options.manager.getHandler(a.uri);c!==null&&(l=c)}return this.detectSupport().then(function(c){if(c)return n.loadTextureImage(e,o.source,l);if(i.extensionsRequired&&i.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");return n.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){const t=new Image;t.src="data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}}class aw{constructor(e){this.parser=e,this.name=Ke.EXT_TEXTURE_AVIF,this.isSupported=null}loadTexture(e){const t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;const o=s.extensions[t],a=i.images[o.source];let l=n.textureLoader;if(a.uri){const c=n.options.manager.getHandler(a.uri);c!==null&&(l=c)}return this.detectSupport().then(function(c){if(c)return n.loadTextureImage(e,o.source,l);if(i.extensionsRequired&&i.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: AVIF required by asset but unsupported.");return n.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){const t=new Image;t.src="data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}}class lw{constructor(e){this.name=Ke.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const i=n.extensions[this.name],s=this.parser.getDependency("buffer",i.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(a){const l=i.byteOffset||0,c=i.byteLength||0,h=i.count,u=i.byteStride,d=new Uint8Array(a,l,c);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(h,u,d,i.mode,i.filter).then(function(f){return f.buffer}):o.ready.then(function(){const f=new ArrayBuffer(h*u);return o.decodeGltfBuffer(new Uint8Array(f),h,u,d,i.mode,i.filter),f})})}else return null}}class cw{constructor(e){this.name=Ke.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const i=t.meshes[n.mesh];for(const c of i.primitives)if(c.mode!==Fn.TRIANGLES&&c.mode!==Fn.TRIANGLE_STRIP&&c.mode!==Fn.TRIANGLE_FAN&&c.mode!==void 0)return null;const o=n.extensions[this.name].attributes,a=[],l={};for(const c in o)a.push(this.parser.getDependency("accessor",o[c]).then(h=>(l[c]=h,l[c])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(c=>{const h=c.pop(),u=h.isGroup?h.children:[h],d=c[0].count,f=[];for(const p of u){const _=new Pe,m=new S,g=new ct,y=new S(1,1,1),v=new So(p.geometry,p.material,d);for(let x=0;x<d;x++)l.TRANSLATION&&m.fromBufferAttribute(l.TRANSLATION,x),l.ROTATION&&g.fromBufferAttribute(l.ROTATION,x),l.SCALE&&y.fromBufferAttribute(l.SCALE,x),v.setMatrixAt(x,_.compose(m,g,y));for(const x in l)if(x==="_COLOR_0"){const R=l[x];v.instanceColor=new Ls(R.array,R.itemSize,R.normalized)}else x!=="TRANSLATION"&&x!=="ROTATION"&&x!=="SCALE"&&p.geometry.setAttribute(x,l[x]);Ze.prototype.copy.call(v,p),this.parser.assignFinalMaterial(v),f.push(v)}return h.isGroup?(h.clear(),h.add(...f),h):f[0]}))}}const eg="glTF",jr=12,Yf={JSON:1313821514,BIN:5130562};class hw{constructor(e){this.name=Ke.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,jr),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==eg)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const i=this.header.length-jr,s=new DataView(e,jr);let o=0;for(;o<i;){const a=s.getUint32(o,!0);o+=4;const l=s.getUint32(o,!0);if(o+=4,l===Yf.JSON){const c=new Uint8Array(e,jr+o,a);this.content=n.decode(c)}else if(l===Yf.BIN){const c=jr+o;this.body=e.slice(c,c+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class uw{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=Ke.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,i=this.dracoLoader,s=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,a={},l={},c={};for(const h in o){const u=Yh[h]||h.toLowerCase();a[u]=o[h]}for(const h in e.attributes){const u=Yh[h]||h.toLowerCase();if(o[h]!==void 0){const d=n.accessors[e.attributes[h]],f=vr[d.componentType];c[u]=f.name,l[u]=d.normalized===!0}}return t.getDependency("bufferView",s).then(function(h){return new Promise(function(u,d){i.decodeDracoFile(h,function(f){for(const p in f.attributes){const _=f.attributes[p],m=l[p];m!==void 0&&(_.normalized=m)}u(f)},a,c,qt,d)})})}}class dw{constructor(){this.name=Ke.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class fw{constructor(){this.name=Ke.KHR_MESH_QUANTIZATION}}class tg extends Or{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i*3+i;for(let o=0;o!==i;o++)t[o]=n[s+o];return t}interpolate_(e,t,n,i){const s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=a*2,c=a*3,h=i-t,u=(n-t)/h,d=u*u,f=d*u,p=e*c,_=p-c,m=-2*f+3*d,g=f-d,y=1-m,v=g-d+u;for(let x=0;x!==a;x++){const R=o[_+x+a],A=o[_+x+l]*h,T=o[p+x+a],I=o[p+x]*h;s[x]=y*R+v*A+m*T+g*I}return s}}const pw=new ct;class mw extends tg{interpolate_(e,t,n,i){const s=super.interpolate_(e,t,n,i);return pw.fromArray(s).normalize().toArray(s),s}}const Fn={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},vr={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Kf={9728:Ut,9729:Et,9984:Vl,9985:mr,9986:ys,9987:Bn},$f={33071:Pn,33648:xr,10497:Wt},_h={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Yh={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},zi={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},gw={CUBICSPLINE:void 0,LINEAR:br,STEP:Sr},vh={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function _w(r){return r.DefaultMaterial===void 0&&(r.DefaultMaterial=new $e({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:oi})),r.DefaultMaterial}function fs(r,e,t){for(const n in t.extensions)r[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function vi(r,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(r.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function vw(r,e,t){let n=!1,i=!1,s=!1;for(let c=0,h=e.length;c<h;c++){const u=e[c];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(i=!0),u.COLOR_0!==void 0&&(s=!0),n&&i&&s)break}if(!n&&!i&&!s)return Promise.resolve(r);const o=[],a=[],l=[];for(let c=0,h=e.length;c<h;c++){const u=e[c];if(n){const d=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):r.attributes.position;o.push(d)}if(i){const d=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):r.attributes.normal;a.push(d)}if(s){const d=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):r.attributes.color;l.push(d)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l)]).then(function(c){const h=c[0],u=c[1],d=c[2];return n&&(r.morphAttributes.position=h),i&&(r.morphAttributes.normal=u),s&&(r.morphAttributes.color=d),r.morphTargetsRelative=!0,r})}function yw(r,e){if(r.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)r.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(r.morphTargetInfluences.length===t.length){r.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)r.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function xw(r){let e;const t=r.extensions&&r.extensions[Ke.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+yh(t.attributes):e=r.indices+":"+yh(r.attributes)+":"+r.mode,r.targets!==void 0)for(let n=0,i=r.targets.length;n<i;n++)e+=":"+yh(r.targets[n]);return e}function yh(r){let e="";const t=Object.keys(r).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+r[t[n]]+";";return e}function Kh(r){switch(r){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function Mw(r){return r.search(/\.jpe?g($|\?)/i)>0||r.search(/^data\:image\/jpeg/)===0?"image/jpeg":r.search(/\.webp($|\?)/i)>0||r.search(/^data\:image\/webp/)===0?"image/webp":"image/png"}const Sw=new Pe;class bw{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new qb,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,s=!1,o=-1;if(typeof navigator<"u"){const a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;const l=a.match(/Version\/(\d+)/);i=n&&l?parseInt(l[1],10):-1,s=a.indexOf("Firefox")>-1,o=s?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||s&&o<98?this.textureLoader=new Gm(this.options.manager):this.textureLoader=new Km(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Yn(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,i=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(o){const a={scene:o[0][i.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:i.asset,parser:n,userData:{}};return fs(s,a,i),vi(a,i),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(a)})).then(function(){for(const l of a.scenes)l.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,s=t.length;i<s;i++){const o=t[i].joints;for(let a=0,l=o.length;a<l;a++)e[o[a]].isBone=!0}for(let i=0,s=e.length;i<s;i++){const o=e[i];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(n[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const i=n.clone(),s=(o,a)=>{const l=this.associations.get(o);l!=null&&this.associations.set(a,l);for(const[c,h]of o.children.entries())s(h,a.children[c])};return s(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const i=e(t[n]);if(i)return i}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let i=0;i<t.length;i++){const s=e(t[i]);s&&n.push(s)}return n}getDependency(e,t){const n=e+":"+t;let i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":i=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(s,o){return n.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Ke.KHR_BINARY_GLTF].body);const i=this.options;return new Promise(function(s,o){n.load(qi.resolveURL(t.uri,i.path),s,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const i=t.byteLength||0,s=t.byteOffset||0;return n.slice(s,s+i)})}loadAccessor(e){const t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){const o=_h[i.type],a=vr[i.componentType],l=i.normalized===!0,c=new a(i.count*o);return Promise.resolve(new st(c,o,l))}const s=[];return i.bufferView!==void 0?s.push(this.getDependency("bufferView",i.bufferView)):s.push(null),i.sparse!==void 0&&(s.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(s).then(function(o){const a=o[0],l=_h[i.type],c=vr[i.componentType],h=c.BYTES_PER_ELEMENT,u=h*l,d=i.byteOffset||0,f=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,p=i.normalized===!0;let _,m;if(f&&f!==u){const g=Math.floor(d/f),y="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+g+":"+i.count;let v=t.cache.get(y);v||(_=new c(a,g*f,i.count*f/h),v=new Bo(_,f/h),t.cache.add(y,v)),m=new Zi(v,l,d%f/h,p)}else a===null?_=new c(i.count*l):_=new c(a,d,i.count*l),m=new st(_,l,p);if(i.sparse!==void 0){const g=_h.SCALAR,y=vr[i.sparse.indices.componentType],v=i.sparse.indices.byteOffset||0,x=i.sparse.values.byteOffset||0,R=new y(o[1],v,i.sparse.count*g),A=new c(o[2],x,i.sparse.count*l);a!==null&&(m=new st(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let T=0,I=R.length;T<I;T++){const F=R[T];if(m.setX(F,A[T*l]),l>=2&&m.setY(F,A[T*l+1]),l>=3&&m.setZ(F,A[T*l+2]),l>=4&&m.setW(F,A[T*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=p}return m})}loadTexture(e){const t=this.json,n=this.options,s=t.textures[e].source,o=t.images[s];let a=this.textureLoader;if(o.uri){const l=n.manager.getHandler(o.uri);l!==null&&(a=l)}return this.loadTextureImage(e,s,a)}loadTextureImage(e,t,n){const i=this,s=this.json,o=s.textures[e],a=s.images[t],l=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[l])return this.textureCache[l];const c=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=o.name||a.name||"",h.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(h.name=a.uri);const d=(s.samplers||{})[o.sampler]||{};return h.magFilter=Kf[d.magFilter]||Et,h.minFilter=Kf[d.minFilter]||Bn,h.wrapS=$f[d.wrapS]||Wt,h.wrapT=$f[d.wrapT]||Wt,i.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){const n=this,i=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());const o=i.images[e],a=self.URL||self.webkitURL;let l=o.uri||"",c=!1;if(o.bufferView!==void 0)l=n.getDependency("bufferView",o.bufferView).then(function(u){c=!0;const d=new Blob([u],{type:o.mimeType});return l=a.createObjectURL(d),l});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const h=Promise.resolve(l).then(function(u){return new Promise(function(d,f){let p=d;t.isImageBitmapLoader===!0&&(p=function(_){const m=new St(_);m.needsUpdate=!0,d(m)}),t.load(qi.resolveURL(u,s.path),p,void 0,f)})}).then(function(u){return c===!0&&a.revokeObjectURL(l),vi(u,o),u.userData.mimeType=o.mimeType||Mw(o.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),u});return this.sourceCache[e]=h,h}assignTexture(e,t,n,i){const s=this;return this.getDependency("texture",n.index).then(function(o){if(!o)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(o=o.clone(),o.channel=n.texCoord),s.extensions[Ke.KHR_TEXTURE_TRANSFORM]){const a=n.extensions!==void 0?n.extensions[Ke.KHR_TEXTURE_TRANSFORM]:void 0;if(a){const l=s.associations.get(o);o=s.extensions[Ke.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),s.associations.set(o,l)}}return i!==void 0&&(o.colorSpace=i),e[t]=o,o})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const i=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){const a="PointsMaterial:"+n.uuid;let l=this.cache.get(a);l||(l=new sc,Bt.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(a,l)),n=l}else if(e.isLine){const a="LineBasicMaterial:"+n.uuid;let l=this.cache.get(a);l||(l=new Jt,Bt.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(a,l)),n=l}if(i||s||o){let a="ClonedMaterial:"+n.uuid+":";i&&(a+="derivative-tangents:"),s&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let l=this.cache.get(a);l||(l=n.clone(),s&&(l.vertexColors=!0),o&&(l.flatShading=!0),i&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(a,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return $e}loadMaterial(e){const t=this,n=this.json,i=this.extensions,s=n.materials[e];let o;const a={},l=s.extensions||{},c=[];if(l[Ke.KHR_MATERIALS_UNLIT]){const u=i[Ke.KHR_MATERIALS_UNLIT];o=u.getMaterialType(),c.push(u.extendParams(a,s,t))}else{const u=s.pbrMetallicRoughness||{};if(a.color=new oe(1,1,1),a.opacity=1,Array.isArray(u.baseColorFactor)){const d=u.baseColorFactor;a.color.setRGB(d[0],d[1],d[2],qt),a.opacity=d[3]}u.baseColorTexture!==void 0&&c.push(t.assignTexture(a,"map",u.baseColorTexture,Nt)),a.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,a.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(a,"metalnessMap",u.metallicRoughnessTexture)),c.push(t.assignTexture(a,"roughnessMap",u.metallicRoughnessTexture))),o=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,a)})))}s.doubleSided===!0&&(a.side=vn);const h=s.alphaMode||vh.OPAQUE;if(h===vh.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,h===vh.MASK&&(a.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&o!==Ot&&(c.push(t.assignTexture(a,"normalMap",s.normalTexture)),a.normalScale=new W(1,1),s.normalTexture.scale!==void 0)){const u=s.normalTexture.scale;a.normalScale.set(u,u)}if(s.occlusionTexture!==void 0&&o!==Ot&&(c.push(t.assignTexture(a,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&o!==Ot){const u=s.emissiveFactor;a.emissive=new oe().setRGB(u[0],u[1],u[2],qt)}return s.emissiveTexture!==void 0&&o!==Ot&&c.push(t.assignTexture(a,"emissiveMap",s.emissiveTexture,Nt)),Promise.all(c).then(function(){const u=new o(a);return s.name&&(u.name=s.name),vi(u,s),t.associations.set(u,{materials:e}),s.extensions&&fs(i,u,s),u})}createUniqueName(e){const t=et.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,i=this.primitiveCache;function s(a){return n[Ke.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(l){return Zf(l,a,t)})}const o=[];for(let a=0,l=e.length;a<l;a++){const c=e[a],h=xw(c),u=i[h];if(u)o.push(u.promise);else{let d;c.extensions&&c.extensions[Ke.KHR_DRACO_MESH_COMPRESSION]?d=s(c):d=Zf(new Ve,c,t),i[h]={primitive:c,promise:d},o.push(d)}}return Promise.all(o)}loadMesh(e){const t=this,n=this.json,i=this.extensions,s=n.meshes[e],o=s.primitives,a=[];for(let l=0,c=o.length;l<c;l++){const h=o[l].material===void 0?_w(this.cache):this.getDependency("material",o[l].material);a.push(h)}return a.push(t.loadGeometries(o)),Promise.all(a).then(function(l){const c=l.slice(0,l.length-1),h=l[l.length-1],u=[];for(let f=0,p=h.length;f<p;f++){const _=h[f],m=o[f];let g;const y=c[f];if(m.mode===Fn.TRIANGLES||m.mode===Fn.TRIANGLE_STRIP||m.mode===Fn.TRIANGLE_FAN||m.mode===void 0)g=s.isSkinnedMesh===!0?new Pu(_,y):new ce(_,y),g.isSkinnedMesh===!0&&g.normalizeSkinWeights(),m.mode===Fn.TRIANGLE_STRIP?g.geometry=Xf(g.geometry,vu):m.mode===Fn.TRIANGLE_FAN&&(g.geometry=Xf(g.geometry,Il));else if(m.mode===Fn.LINES)g=new Kn(_,y);else if(m.mode===Fn.LINE_STRIP)g=new li(_,y);else if(m.mode===Fn.LINE_LOOP)g=new Iu(_,y);else if(m.mode===Fn.POINTS)g=new Lu(_,y);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(g.geometry.morphAttributes).length>0&&yw(g,s),g.name=t.createUniqueName(s.name||"mesh_"+e),vi(g,s),m.extensions&&fs(i,g,m),t.assignFinalMaterial(g),u.push(g)}for(let f=0,p=u.length;f<p;f++)t.associations.set(u[f],{meshes:e,primitives:f});if(u.length===1)return s.extensions&&fs(i,u[0],s),u[0];const d=new Mt;s.extensions&&fs(i,d,s),t.associations.set(d,{meshes:e});for(let f=0,p=u.length;f<p;f++)d.add(u[f]);return d})}loadCamera(e){let t;const n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new Dt(Ie.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new Lr(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),vi(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let i=0,s=t.joints.length;i<s;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){const s=i.pop(),o=i,a=[],l=[];for(let c=0,h=o.length;c<h;c++){const u=o[c];if(u){a.push(u);const d=new Pe;s!==null&&d.fromArray(s.array,c*16),l.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new ko(a,l)})}loadAnimation(e){const t=this.json,n=this,i=t.animations[e],s=i.name?i.name:"animation_"+e,o=[],a=[],l=[],c=[],h=[];for(let u=0,d=i.channels.length;u<d;u++){const f=i.channels[u],p=i.samplers[f.sampler],_=f.target,m=_.node,g=i.parameters!==void 0?i.parameters[p.input]:p.input,y=i.parameters!==void 0?i.parameters[p.output]:p.output;_.node!==void 0&&(o.push(this.getDependency("node",m)),a.push(this.getDependency("accessor",g)),l.push(this.getDependency("accessor",y)),c.push(p),h.push(_))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l),Promise.all(c),Promise.all(h)]).then(function(u){const d=u[0],f=u[1],p=u[2],_=u[3],m=u[4],g=[];for(let y=0,v=d.length;y<v;y++){const x=d[y],R=f[y],A=p[y],T=_[y],I=m[y];if(x===void 0)continue;x.updateMatrix&&x.updateMatrix();const F=n._createAnimationTracks(x,R,A,T,I);if(F)for(let M=0;M<F.length;M++)g.push(F[M])}return new Ar(s,void 0,g)})}createNodeMesh(e){const t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(s){const o=n._getNodeRef(n.meshCache,i.mesh,s);return i.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let l=0,c=i.weights.length;l<c;l++)a.morphTargetInfluences[l]=i.weights[l]}),o})}loadNode(e){const t=this.json,n=this,i=t.nodes[e],s=n._loadNodeShallow(e),o=[],a=i.children||[];for(let c=0,h=a.length;c<h;c++)o.push(n.getDependency("node",a[c]));const l=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([s,Promise.all(o),l]).then(function(c){const h=c[0],u=c[1],d=c[2];d!==null&&h.traverse(function(f){f.isSkinnedMesh&&f.bind(d,Sw)});for(let f=0,p=u.length;f<p;f++)h.add(u[f]);return h})}_loadNodeShallow(e){const t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const s=t.nodes[e],o=s.name?i.createUniqueName(s.name):"",a=[],l=i._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&a.push(l),s.camera!==void 0&&a.push(i.getDependency("camera",s.camera).then(function(c){return i._getNodeRef(i.cameraCache,s.camera,c)})),i._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){a.push(c)}),this.nodeCache[e]=Promise.all(a).then(function(c){let h;if(s.isBone===!0?h=new ic:c.length>1?h=new Mt:c.length===1?h=c[0]:h=new Ze,h!==c[0])for(let u=0,d=c.length;u<d;u++)h.add(c[u]);if(s.name&&(h.userData.name=s.name,h.name=o),vi(h,s),s.extensions&&fs(n,h,s),s.matrix!==void 0){const u=new Pe;u.fromArray(s.matrix),h.applyMatrix4(u)}else s.translation!==void 0&&h.position.fromArray(s.translation),s.rotation!==void 0&&h.quaternion.fromArray(s.rotation),s.scale!==void 0&&h.scale.fromArray(s.scale);return i.associations.has(h)||i.associations.set(h,{}),i.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],i=this,s=new Mt;n.name&&(s.name=i.createUniqueName(n.name)),vi(s,n),n.extensions&&fs(t,s,n);const o=n.nodes||[],a=[];for(let l=0,c=o.length;l<c;l++)a.push(i.getDependency("node",o[l]));return Promise.all(a).then(function(l){for(let h=0,u=l.length;h<u;h++)s.add(l[h]);const c=h=>{const u=new Map;for(const[d,f]of i.associations)(d instanceof Bt||d instanceof St)&&u.set(d,f);return h.traverse(d=>{const f=i.associations.get(d);f!=null&&u.set(d,f)}),u};return i.associations=c(s),s})}_createAnimationTracks(e,t,n,i,s){const o=[],a=e.name?e.name:e.uuid,l=[];zi[s.path]===zi.weights?e.traverse(function(d){d.morphTargetInfluences&&l.push(d.name?d.name:d.uuid)}):l.push(a);let c;switch(zi[s.path]){case zi.weights:c=Ds;break;case zi.rotation:c=Us;break;case zi.position:case zi.scale:c=Os;break;default:switch(n.itemSize){case 1:c=Ds;break;case 2:case 3:default:c=Os;break}break}const h=i.interpolation!==void 0?gw[i.interpolation]:br,u=this._getArrayFromAccessor(n);for(let d=0,f=l.length;d<f;d++){const p=new c(l[d]+"."+zi[s.path],t.array,u,h);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(p),o.push(p)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=Kh(t.constructor),i=new Float32Array(t.length);for(let s=0,o=t.length;s<o;s++)i[s]=t[s]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const i=this instanceof Us?mw:tg;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function ww(r,e,t){const n=e.attributes,i=new Kt;if(n.POSITION!==void 0){const a=t.json.accessors[n.POSITION],l=a.min,c=a.max;if(l!==void 0&&c!==void 0){if(i.set(new S(l[0],l[1],l[2]),new S(c[0],c[1],c[2])),a.normalized){const h=Kh(vr[a.componentType]);i.min.multiplyScalar(h),i.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const s=e.targets;if(s!==void 0){const a=new S,l=new S;for(let c=0,h=s.length;c<h;c++){const u=s[c];if(u.POSITION!==void 0){const d=t.json.accessors[u.POSITION],f=d.min,p=d.max;if(f!==void 0&&p!==void 0){if(l.setX(Math.max(Math.abs(f[0]),Math.abs(p[0]))),l.setY(Math.max(Math.abs(f[1]),Math.abs(p[1]))),l.setZ(Math.max(Math.abs(f[2]),Math.abs(p[2]))),d.normalized){const _=Kh(vr[d.componentType]);l.multiplyScalar(_)}a.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(a)}r.boundingBox=i;const o=new $t;i.getCenter(o.center),o.radius=i.min.distanceTo(i.max)/2,r.boundingSphere=o}function Zf(r,e,t){const n=e.attributes,i=[];function s(o,a){return t.getDependency("accessor",o).then(function(l){r.setAttribute(a,l)})}for(const o in n){const a=Yh[o]||o.toLowerCase();a in r.attributes||i.push(s(n[o],a))}if(e.indices!==void 0&&!r.index){const o=t.getDependency("accessor",e.indices).then(function(a){r.setIndex(a)});i.push(o)}return Je.workingColorSpace!==qt&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Je.workingColorSpace}" not supported.`),vi(r,e),ww(r,e,t),Promise.all(i).then(function(){return e.targets!==void 0?vw(r,e.targets,t):r})}class Ol{constructor({length:e=180,beam:t=21,maxSpeedKn:n=32,accel:i=2.2,turnRate:s=.35}={}){this.length=e,this.beam=t,this.maxSpeedMs=n*.5144,this.accel=i,this.turnRate=s,this.position=new S,this.heading=0,this.speed=0,this.throttle=0,this.rudder=0,this.roll=0,this.pitch=0,this.heave=0,this._rollVel=0,this._pitchVel=0,this.quaternion=new ct,this._probeLocal={bow:new S(0,0,e*.46),stern:new S(0,0,-e*.46),port:new S(-t*.48,0,0),starboard:new S(t*.48,0,0)},this._probeWorld={bow:new S,stern:new S,port:new S,starboard:new S}}get speedKnots(){return this.speed/.5144}get forward(){return new S(Math.sin(this.heading),0,Math.cos(this.heading))}setCommand(e,t){this.throttle=Ie.clamp(e,-1,1),this.rudder=Ie.clamp(t,-1,1)}update(e,t,n){const i=this.throttle*this.maxSpeedMs,s=this.accel*(Math.sign(i-this.speed)===Math.sign(this.speed)||this.speed===0?1:2.2);this.speed+=Ie.clamp(i-this.speed,-s*e,s*e);const o=Ie.clamp(Math.abs(this.speed)/(this.maxSpeedMs*.35),0,1);this.heading+=this.rudder*this.turnRate*o*e*Math.sign(this.speed||1);const a=this.forward;this.position.addScaledVector(a,this.speed*e),this.quaternion.setFromAxisAngle(new S(0,1,0),this.heading);for(const g in this._probeLocal)Jf.copy(this._probeLocal[g]).applyQuaternion(this.quaternion).add(this.position),this._probeWorld[g].copy(Jf);const l=t(this._probeWorld.bow.x,this._probeWorld.bow.z,n),c=t(this._probeWorld.stern.x,this._probeWorld.stern.z,n),h=t(this._probeWorld.port.x,this._probeWorld.port.z,n),u=t(this._probeWorld.starboard.x,this._probeWorld.starboard.z,n),d=(l+c+h+u)/4,f=Math.atan2(l-c,this.length*.92)*-1,p=Math.atan2(h-u,this.beam*.96),_=6,m=3.2;this._pitchVel+=(f-this.pitch)*_*e,this._pitchVel*=1-Math.min(1,m*e),this.pitch+=this._pitchVel*e,this._rollVel+=(p-this.roll)*_*e,this._rollVel*=1-Math.min(1,m*e),this.roll+=this._rollVel*e,this.heave+=(d-this.heave)*Math.min(1,5*e)}applyToObject3D(e){e.position.set(this.position.x,this.heave,this.position.z);const t=new ct().setFromAxisAngle(new S(0,1,0),this.heading),n=new ct().setFromAxisAngle(new S(1,0,0),this.pitch),i=new ct().setFromAxisAngle(new S(0,0,1),this.roll);t.multiply(n).multiply(i),e.quaternion.copy(t)}}const Jf=new S;function Tw({length:r=180,beam:e=21}={}){const t=new Mt;t.name="ShipPlaceholder";const n=new $e({color:7041658,roughness:.55,metalness:.35}),i=new $e({color:2830131,roughness:.85,metalness:.1}),s=new $e({color:1316634,roughness:.4,metalness:.5}),o=9,a=new bn,l=r/2;a.moveTo(-l*.98,0),a.quadraticCurveTo(-l,0,-l,e*.28),a.lineTo(-l*.3,e*.5),a.lineTo(l*.55,e*.5),a.quadraticCurveTo(l*.92,e*.5,l,0),a.quadraticCurveTo(l*.92,-e*.5,l*.55,-e*.5),a.lineTo(-l*.3,-e*.5),a.quadraticCurveTo(-l,-e*.5,-l,-e*.28),a.lineTo(-l*.98,0);const c=new Xn(a,{depth:o,bevelEnabled:!0,bevelSize:.4,bevelThickness:.4,bevelSegments:3,steps:1});c.rotateX(-Math.PI/2),c.rotateY(Math.PI/2);const h=new ce(c,n);h.castShadow=!0,h.receiveShadow=!0,t.add(h);function u(_,m,g,y,v,x,R=n){const A=new ce(new it(_,m,g),R);return A.position.set(y,v,x),A.castShadow=!0,A.receiveShadow=!0,t.add(A),A}u(16,9,20,0,o+4.5,25,n),u(9,11,12,0,o+9+5.5,25,n),u(10,.5,10,0,o+15.2,25,s),u(15,6,20,0,o+3,-35,n),u(20,.3,30,0,o+6.05,-45,i),u(4,3,5,0,o+1.5,75,n);const d=new ce(new dt(.3,.3,9,12),s);d.rotation.x=Math.PI/2,d.position.set(0,o+2.6,82),d.castShadow=!0,t.add(d);const f=new ce(new In(e*.94,r*.88),i);f.rotation.x=-Math.PI/2,f.position.set(0,o+.03,0),f.receiveShadow=!0,t.add(f);const p={helm:new S(-6.5,21.3,17),weaponsStation:new S(8,20.6,17),bridgeInteriorCenter:new S(0,19.5,17),gunBarrelTip:new S(0,13.6,76),missileTubes:[new S(-3,10.5,37),new S(3,10.5,37),new S(-3,10.5,41),new S(3,10.5,41)],ciws:[new S(0,16.6,31.6),new S(0,12,-49.5)],deckY:o,length:r,beam:e};return{group:t,mountPoints:p}}function nn(r,e){const t=Math.sin(r*127.1+e*311.7)*43758.5453;return t-Math.floor(t)}function ng(r,e){const t=Math.floor(r),n=Math.floor(e),i=r-t,s=e-n,o=nn(t,n),a=nn(t+1,n),l=nn(t,n+1),c=nn(t+1,n+1),h=i*i*(3-2*i),u=s*s*(3-2*s);return Ie.lerp(Ie.lerp(o,a,h),Ie.lerp(l,c,h),u)}function ig(r,e,t=5){let n=0,i=.5,s=1;for(let o=0;o<t;o++)n+=i*ng(r*s,e*s),s*=2.03,i*=.5;return n}function Aw({size:r=512,baseColor:e=[.42,.44,.47],panelCols:t=8,panelRows:n=14,rustColor:i=[.3,.19,.14],rustAmount:s=.35,seed:o=0}={}){const a=document.createElement("canvas");a.width=r,a.height=r;const l=a.getContext("2d"),[c,h,u]=e.map(L=>Math.round(L*255));l.fillStyle=`rgb(${c},${h},${u})`,l.fillRect(0,0,r,r);const d=l.getImageData(0,0,r,r),f=new Float32Array(r*r);for(let L=0;L<r;L++)for(let Q=0;Q<r;Q++){const ne=(L*r+Q)*4,le=ig(Q*.035+o*91,L*.035+o*57,5),we=(le-.5)*22;d.data[ne]=Ie.clamp(d.data[ne]+we,0,255),d.data[ne+1]=Ie.clamp(d.data[ne+1]+we,0,255),d.data[ne+2]=Ie.clamp(d.data[ne+2]+we,0,255),f[L*r+Q]=.5+(le-.5)*.3}l.putImageData(d,0,0);const _=.2126*e[0]+.7152*e[1]+.0722*e[2]<.35,m=_?"255,255,255":"8,8,10",g=_?.5:.6,y=_?"235,238,240":"0,0,0",v=_?.55:.4;l.strokeStyle=`rgba(${m},${g})`,l.lineWidth=Math.max(1,r/300);const x=[0];for(let L=1;L<t;L++)x.push((L/t+(nn(L,o)-.5)*.02)*r);x.push(r);const R=[0];for(let L=1;L<n;L++)R.push((L/n+(nn(o,L)-.5)*.015)*r);R.push(r);for(const L of x)l.beginPath(),l.moveTo(L,0),l.lineTo(L,r),l.stroke(),jf(f,r,L,!0);for(const L of R)l.beginPath(),l.moveTo(0,L),l.lineTo(r,L),l.stroke(),jf(f,r,L,!1);l.fillStyle=`rgba(${y},${v})`;for(const L of x.slice(1,-1))for(const Q of R.slice(1,-1))for(const[ne,le]of[[-10,-10],[10,-10],[-10,10],[10,10]])l.beginPath(),l.arc(L+ne*(r/512),Q+le*(r/512),r/340,0,Math.PI*2),l.fill();const[A,T,I]=i.map(L=>Math.round(L*255));for(let L=0;L<Math.round(t*2.2*s);L++){const Q=x[1+Math.floor(nn(L,o+1)*(x.length-2))]+(nn(L,o+5)-.5)*14,ne=nn(L,o+2)*r*.4,le=r*(.25+nn(L,o+3)*.55),we=r*(.006+nn(L,o+4)*.016),Fe=l.createLinearGradient(Q,ne,Q,ne+le);Fe.addColorStop(0,`rgba(${A},${T},${I},0)`),Fe.addColorStop(.15,`rgba(${A},${T},${I},${.32+nn(L,o)*.25})`),Fe.addColorStop(1,`rgba(${A},${T},${I},0.0)`),l.fillStyle=Fe,l.beginPath(),l.moveTo(Q-we/2,ne),l.quadraticCurveTo(Q+we*(nn(L,o+9)-.5)*3,ne+le*.5,Q-we/2+(nn(L,o+8)-.5)*10,ne+le),l.lineTo(Q+we/2+(nn(L,o+8)-.5)*10,ne+le),l.quadraticCurveTo(Q+we*(nn(L,o+9)-.5)*3+we,ne+le*.5,Q+we/2,ne),l.closePath(),l.fill()}l.fillStyle="rgba(5,5,6,0.5)";for(let L=0;L<r*1.2;L++){const Q=Math.random()*r,ne=Math.random()*r,le=Math.random()*(r/260);l.globalAlpha=.06+Math.random()*.1,l.beginPath(),l.arc(Q,ne,le,0,Math.PI*2),l.fill()}l.globalAlpha=1;const F=new _r(a);F.colorSpace=Nt,F.wrapS=F.wrapT=Wt;const M=document.createElement("canvas");M.width=r,M.height=r;const w=M.getContext("2d"),B=w.createImageData(r,r),z=2.2;for(let L=0;L<r;L++)for(let Q=0;Q<r;Q++){const ne=f[L*r+(Q-1+r)%r],le=f[L*r+(Q+1)%r],we=f[(L-1+r)%r*r+Q],Fe=f[(L+1)%r*r+Q],G=(ne-le)*z,ie=(we-Fe)*z,pe=-G,ue=-ie,Oe=1,Le=Math.sqrt(pe*pe+ue*ue+Oe*Oe),Ne=(L*r+Q)*4;B.data[Ne]=(pe/Le*.5+.5)*255,B.data[Ne+1]=(ue/Le*.5+.5)*255,B.data[Ne+2]=(Oe/Le*.5+.5)*255,B.data[Ne+3]=255}w.putImageData(B,0,0);const q=new _r(M);q.wrapS=q.wrapT=Wt;const j=document.createElement("canvas");j.width=r,j.height=r;const k=j.getContext("2d");k.fillStyle="#9a9a9a",k.fillRect(0,0,r,r),k.globalAlpha=.5,k.drawImage(a,0,0),k.globalAlpha=1;const $=new _r(j);return $.wrapS=$.wrapT=Wt,{map:F,normalMap:q,roughnessMap:$}}function jf(r,e,t,n){const i=Math.round(t);for(let s=-1;s<=1;s++){const o=Ie.clamp(i+s,0,e-1);for(let a=0;a<e;a++){const l=n?a*e+o:o*e+a;r[l]-=.16-Math.abs(s)*.06}}}function Ew({size:r=256,strength:e=1.4,seed:t=0}={}){const n=new Float32Array(r*r);for(let d=0;d<r;d++)for(let f=0;f<r;f++){const p=ig(f*.08+t*31,d*.08+t*17,4),_=Math.pow(ng(f*.6+t*11,d*.02+t*5),6)*.4;n[d*r+f]=p+_}const i=document.createElement("canvas");i.width=r,i.height=r;const s=i.getContext("2d"),o=s.createImageData(r,r);for(let d=0;d<r;d++)for(let f=0;f<r;f++){const p=n[d*r+(f-1+r)%r],_=n[d*r+(f+1)%r],m=n[(d-1+r)%r*r+f],g=n[(d+1)%r*r+f],y=(p-_)*e,v=(m-g)*e,x=Math.sqrt(y*y+v*v+1),R=(d*r+f)*4;o.data[R]=(-y/x*.5+.5)*255,o.data[R+1]=(-v/x*.5+.5)*255,o.data[R+2]=(1/x*.5+.5)*255,o.data[R+3]=255}s.putImageData(o,0,0);const a=new _r(i);a.wrapS=a.wrapT=Wt;const l=document.createElement("canvas");l.width=r,l.height=r;const c=l.getContext("2d"),h=c.createImageData(r,r);for(let d=0;d<r*r;d++){const f=Ie.clamp(.55+(n[d]-.5)*.7,.15,.95)*255;h.data[d*4]=h.data[d*4+1]=h.data[d*4+2]=f,h.data[d*4+3]=255}c.putImageData(h,0,0);const u=new _r(l);return u.wrapS=u.wrapT=Wt,{normalMap:a,roughnessMap:u}}const xh=new Map;function Cw(r,e){return xh.has(r)||xh.set(r,Aw(e)),xh.get(r)}let Mh=null;function sg(){return Mh||(Mh=Ew()),Mh}const Rw="/assets/models/bridge_console.glb",Pw="/assets/models/bridge_chair.glb",Iw=2.4;let Sh=null;function Lw(){return Sh||(Sh=new _c().loadAsync(Rw).then(r=>r.scene)),Sh}let bh=null;function Nw(){return bh||(bh=new _c().loadAsync(Pw).then(r=>r.scene)),bh}function Dw(){const r=new Mt;r.name="BridgeInterior";const e=19.4,t=22.3,n=-8.3,i=9.6,s=5.5,o=23.5,a=e+.95,l=e+2.55,c=new $e({color:7239296,roughness:.78,metalness:.18}),h=new $e({color:2830131,roughness:.55,metalness:.4}),u=new $e({color:1711652,roughness:.88,metalness:.12}),d=new Dn({color:13954808,transparent:!0,opacity:.11,roughness:.05,metalness:0,transmission:.55,thickness:.15,side:vn,depthWrite:!1}),f=new $e({color:1842978,roughness:.5,metalness:.4}),p=new $e({color:4014922,roughness:.5,metalness:.35}),_=new $e({color:1711392,roughness:.4,metalness:.5}),m=new $e({color:467498,roughness:.35,emissive:2078424,emissiveIntensity:.55}),g=new $e({color:2759174,roughness:.35,emissive:16751918,emissiveIntensity:.45}),y=new $e({color:13625599,emissive:11457778,emissiveIntensity:.9,roughness:.5}),v=new ce(new In(i-n,o-s),u);v.rotation.x=-Math.PI/2,v.position.set((n+i)/2,e,(s+o)/2),v.receiveShadow=!0,r.add(v);const x=new ce(new In(i-n,o-s),h);x.rotation.x=Math.PI/2,x.position.set((n+i)/2,t,(s+o)/2),r.add(x);for(let X=0;X<4;X++){const Y=-5.5+X*3.6,te=new ce(new it(2,.06,.2),y);te.position.set(Y,t-.05,14.5),r.add(te);const ge=new Si(14150648,5.5,16,1.6);ge.position.set(Y,t-.55,14.5),r.add(ge)}const R=new Yu(6980760,.55);r.add(R);const A=new Wo(13625599,1.15);A.position.set(0,e+3,o+8),A.target.position.set(0,e+1.2,14),r.add(A),r.add(A.target);function T(X,Y,te){return new ce(new it(X,Y,.22),te)}function I(X,Y,te,ge,ae){const C=te-Y,b=(Y+te)/2,U=T(C,a-e,c);U.position.set(b,(e+a)/2,X),r.add(U);const Z=T(C,t-l,c);if(Z.position.set(b,(l+t)/2,X),r.add(Z),ae){const K=T(C*.94,l-a,d);K.position.set(b,(a+l)/2,X),r.add(K);const ee=Math.max(2,Math.round(C/2.2));for(let ve=0;ve<=ee;ve++){const de=Y+C*ve/ee,ye=new ce(new it(.08,l-a,.24),f);ye.position.set(de,(a+l)/2,X),r.add(ye)}}else{const K=T(C*.94,l-a,c);K.position.set(b,(a+l)/2,X),r.add(K)}}function F(X,Y,te,ge){const ae=te-Y,C=(Y+te)/2,b=K=>(K.rotation.y=Math.PI/2,K),U=b(T(ae,a-e,c));U.position.set(X,(e+a)/2,C),r.add(U);const Z=b(T(ae,t-l,c));if(Z.position.set(X,(l+t)/2,C),r.add(Z),ge){const K=b(T(ae*.94,l-a,d));K.position.set(X,(a+l)/2,C),r.add(K);const ee=Math.max(2,Math.round(ae/2.2));for(let ve=0;ve<=ee;ve++){const de=Y+ae*ve/ee,ye=new ce(new it(.24,l-a,.08),f);ye.position.set(X,(a+l)/2,de),r.add(ye)}}else{const K=b(T(ae*.94,l-a,c));K.position.set(X,(a+l)/2,C),r.add(K)}}I(o,n,i,1,!0);const M=s+(o-s)*.32;F(n,M,o,!0),F(n,s,M,!1),F(i,M,o,!0),F(i,s,M,!1);const w=1.4;I(s,n,-w,-1,!1),I(s,w,i,-1,!1);const B=T(w*2,t-l,c);B.position.set(0,(l+t)/2,s),r.add(B);function z({screenColor:X,width:Y}){const te=new Mt,ge=new ce(new it(Y,1,.7),p);ge.position.y=.5,te.add(ge);const ae=new ce(new it(Y*.92,.5,.06),X);return ae.position.set(0,1.15,.28),ae.rotation.x=-.55,te.add(ae),te}function q({screenColor:X=m,glowColor:Y=2078424,width:te=2.4,withChair:ge=!0}={}){const ae=new Mt,C=z({screenColor:X,width:te});ae.add(C),Lw().then(U=>{const Z=U.clone(!0);Z.scale.setScalar(te/Iw),Z.traverse(K=>{K.isMesh&&(K.castShadow=!0,K.receiveShadow=!0,K.material?.name==="Console_Screen_Mat"&&(K.material=new $e({color:Y,emissive:Y,emissiveIntensity:.7,roughness:.35,metalness:0,side:vn})))}),Z.traverse(K=>K.layers.set(2)),ae.add(Z),ae.remove(C)});const b=new Si(Y,1.8,5,2);if(b.position.set(0,1,.5),ae.add(b),ge){const U=new Mt,Z=new ce(new dt(.34,.3,.12,10),_);Z.position.set(0,.5,-.85),U.add(Z);const K=new ce(new it(.6,.55,.1),_);K.position.set(0,.85,-1.12),U.add(K),ae.add(U),Nw().then(ee=>{const ve=ee.clone(!0);ve.position.set(0,0,-.85),ve.traverse(de=>{de.isMesh&&(de.castShadow=!0,de.receiveShadow=!0)}),ve.traverse(de=>de.layers.set(2)),ae.add(ve),ae.remove(U)})}return ae.traverse(U=>{U.isMesh&&(U.castShadow=!0,U.receiveShadow=!0)}),ae}const j=q({screenColor:m,glowColor:2078424,width:3});j.position.set(0,e,17.5),j.traverse(X=>X.layers.set(2)),r.add(j);const k=q({screenColor:g,glowColor:16751918,width:2.2});k.position.set(-5.6,e,12.5),k.rotation.y=.5,k.traverse(X=>X.layers.set(2)),r.add(k);const $=q({screenColor:m,glowColor:2078424,width:2.2});$.position.set(6.4,e,12.5),$.rotation.y=-.5,$.traverse(X=>X.layers.set(2)),r.add($);const L=new Mt;L.position.set(8.2,e,20.2);const Q=new ce(new dt(.18,.28,1.05,12),_);Q.position.y=.52,L.add(Q);const ne=new ce(new it(.55,.16,.28),p);ne.position.set(0,1.12,.05),L.add(ne);for(const X of[-.16,.16]){const Y=new ce(new dt(.06,.06,.34,10),f);Y.rotation.x=Math.PI/2,Y.position.set(X,1.12,.22),L.add(Y);const te=new ce(new Ho(.055,12),new $e({color:266264,emissive:2078424,emissiveIntensity:.35,roughness:.2}));te.position.set(X,1.12,.4),L.add(te)}const le=new Si(8308968,1.1,4.5,2);le.position.set(0,1.4,.3),L.add(le),L.traverse(X=>{X.isMesh&&(X.castShadow=!0,X.receiveShadow=!0)}),r.add(L);function we(X,Y,te){const ge=new ce(new Ur(.55,.72,32),new Ot({color:te,transparent:!0,opacity:.22,side:vn,depthWrite:!1}));ge.rotation.x=-Math.PI/2,ge.position.set(X,e+.02,Y),r.add(ge);const ae=new Si(te,.55,3.2,2);ae.position.set(X,e+.9,Y),r.add(ae)}we(0,12.9,5105919);const Fe=new S(-5.6,0,12.5).add(new S(0,0,-1.9).applyAxisAngle(new S(0,1,0),.5)),G=new S(6.4,0,12.5).add(new S(0,0,-1.9).applyAxisAngle(new S(0,1,0),-.5));we(Fe.x,Fe.z,16756782),we(G.x,G.z,5105919),we(8.2,20.2,4063136);const ie=new $e({color:4871520,roughness:.45,metalness:.7}),pe=new $e({color:1711650,roughness:.85,metalness:.15}),ue=new $e({color:6055020,roughness:.62,metalness:.28}),Oe=new $e({color:3814446,roughness:.9,metalness:.2}),Le=new $e({color:1843752,roughness:.78,metalness:.45});for(const X of[-6.2,7.4]){const Y=new ce(new it(.55,.08,o-s-2),ie);Y.position.set(X,t-.35,(s+o)/2),r.add(Y);for(let te=0;te<5;te++){const ge=new ce(new dt(.035,.035,o-s-3,6),pe);ge.rotation.x=Math.PI/2,ge.position.set(X+(te-2)*.09,t-.48,(s+o)/2),r.add(ge)}}for(const[X,Y,te]of[[n+.35,9.5,Math.PI/2],[i-.35,9.5,-Math.PI/2]]){const ge=new ce(new it(1.8,2.2,.28),ue);ge.position.set(X,e+1.4,Y),ge.rotation.y=te,r.add(ge);for(let ae=0;ae<4;ae++)for(let C=0;C<3;C++){const b=new ce(new it(.12,.08,.04),new $e({color:266264,emissive:(ae+C)%3===0?4063136:16756782,emissiveIntensity:.8,roughness:.4}));b.position.set(X+Math.sin(te)*.16,e+.7+ae*.4,Y+Math.cos(te)*.16+(C-1)*.35),r.add(b)}}const Ne=new ce(new it(2.4,.08,1.4),Le);Ne.position.set(0,e+.92,9.2),r.add(Ne);for(const X of[-1.05,1.05])for(const Y of[-.55,.55]){const te=new ce(new dt(.05,.05,.9,8),ie);te.position.set(X,e+.45,9.2+Y),r.add(te)}const ze=new ce(new In(1.8,1),new $e({color:666162,emissive:944762,emissiveIntensity:.35,roughness:.55}));ze.rotation.x=-Math.PI/2,ze.position.set(0,e+.97,9.2),r.add(ze);for(const X of[o-.55]){const Y=new ce(new dt(.035,.035,i-n-2,8),ie);Y.rotation.z=Math.PI/2,Y.position.set((n+i)/2,e+1.05,X),r.add(Y)}const se=new ce(new dt(.12,.14,.7,10),Oe);se.position.set(-2.2,e+.4,s+1.1),r.add(se);const P=new ce(new dt(.05,.05,.2,8),ie);P.position.set(-2.2,e+.85,s+1.1),r.add(P);for(let X=0;X<4;X++){const Y=new ce(new it(.55,.015,o-s-3),Le);Y.position.set(-4.5+X*3.2,e+.01,(s+o)/2),r.add(Y)}for(const X of[-2.4,2.4]){const Y=new ce(new it(1.1,.65,.08),_);Y.position.set(X,e+2.35,19.2),Y.rotation.x=-.25,r.add(Y);const te=new ce(new In(.95,.5),new $e({color:401448,emissive:2078424,emissiveIntensity:.55,roughness:.35}));te.position.set(X,e+2.35,19.25),te.rotation.x=-.25,r.add(te)}r.traverse(X=>{X.isMesh&&(X.castShadow=X.receiveShadow=!0)});const me={helm:new S(0,e+1.48,12.9),weaponsStation:new S(Fe.x,e+1.48,Fe.z-.55),radar:new S(G.x,e+1.48,G.z-.55),lookout:new S(8.2,e+1.72,20.2),spawn:new S(0,0,s+2.2),floorY:e,bounds:{minX:n+.4,maxX:i-.3,minZ:s+.6,maxZ:o-.8}};return{group:r,mountPoints:me}}function Co(r){const e=r.attributes.uv;if(!e)return r;let t=1/0,n=-1/0,i=1/0,s=-1/0;for(let l=0;l<e.count;l++){const c=e.getX(l),h=e.getY(l);c<t&&(t=c),c>n&&(n=c),h<i&&(i=h),h>s&&(s=h)}const o=n-t||1,a=s-i||1;for(let l=0;l<e.count;l++)e.setXY(l,(e.getX(l)-t)/o,(e.getY(l)-i)/a);return e.needsUpdate=!0,r}const yr={};function hn(r,e,t=.55,n=.4){return yr[r]||(yr[r]=new $e({color:e,roughness:t,metalness:n})),yr[r]}function Es(r,e,t,n,i,{roughness:s=1,metalness:o=.35,normalScale:a=.7,colorMul:l=1}={}){if(yr[r])return yr[r];const c=Cw(e,t),h=c.map.clone();h.needsUpdate=!0;const u=c.normalMap.clone();u.needsUpdate=!0;const d=c.roughnessMap.clone();d.needsUpdate=!0;for(const p of[h,u,d])p.repeat.set(n,i),p.wrapS=p.wrapT=Wt;const f=new $e({map:h,normalMap:u,roughnessMap:d,roughness:s,metalness:o,normalScale:new W(a,a)});return l!==1&&f.color.setScalar(l),yr[r]=f,f}function ed(r=9056047){const e=new Mt,t=110,n=13,i=6.5,s=new bn,o=t/2;s.moveTo(-o*.96,0),s.lineTo(-o,n*.3),s.lineTo(-o*.2,n*.5),s.lineTo(o*.6,n*.5),s.lineTo(o,0),s.lineTo(o*.6,-n*.5),s.lineTo(-o*.2,-n*.5),s.lineTo(-o,-n*.3),s.lineTo(-o*.96,0);const a=Co(new Xn(s,{depth:i,bevelEnabled:!0,bevelSize:.3,bevelThickness:.3,bevelSegments:2,steps:1}));a.rotateX(-Math.PI/2),a.rotateY(Math.PI/2);const l=Es("enemyHullTex","navalGrey",{baseColor:[.44,.46,.49],panelCols:9,panelRows:4,rustAmount:.4},9,3),c=new ce(a,l);c.castShadow=!0,c.receiveShadow=!0,e.add(c);const h=new it(n*1.02,.9,t*.92),u=new ce(h,hn("enemyStripe",790032,.6,.2));u.position.set(0,.3,0),e.add(u);const d=Es("enemySuperTex","navalGreySuper",{baseColor:[.52,.54,.57],panelCols:5,panelRows:5,rustAmount:.2},3,3,{normalScale:.5}),f=hn("enemyGlass",1186336,.2,.6),p=new bn;p.moveTo(-4.2,0),p.lineTo(4.2,0),p.lineTo(3.4,6),p.lineTo(-3.4,6),p.lineTo(-4.2,0);const _=Co(new Xn(p,{depth:11,bevelEnabled:!1}));_.rotateX(-Math.PI/2),_.translate(0,i,2.5);const m=new ce(_,d);m.castShadow=!0,e.add(m);const g=new ce(new it(7.6,1.1,.15),f);g.position.set(0,i+4.6,8.05),e.add(g);const y=new dt(.35,.55,9,6),v=new ce(y,d);v.position.set(0,i+6+4.5,4),v.castShadow=!0,e.add(v);const x=new ce(new dt(.1,.1,5,5),d);x.rotation.z=Math.PI/2,x.position.set(0,i+6+7,4),e.add(x);const R=new ce(new hi(.9,8,6),hn("enemyRadome",14212062,.4,.1));R.position.set(0,i+6+9.4,4),e.add(R);const A=new ce(new dt(.2,.2,5,8),hn("barrel",1447446,.4,.6));A.rotation.x=Math.PI/2,A.position.set(0,i+1.5,42),e.add(A);const T=new ce(new Dr(2.2,2.4,5),d);T.rotation.x=Math.PI/2,T.position.set(0,i+1.3,38.5),e.add(T);const I=hn("enemyRail",2764338,.6,.4);for(const F of[-1,1]){const M=new ce(new it(t*.55,.6,.08),I);M.position.set(-6,i+.9,F*n*.48),e.add(M)}return{group:e,length:t,beam:n,deckY:i}}function Uw(){const r=new Mt,e=150,t=21,n=9.5,i=e/2,s=new bn;s.moveTo(-i*.98,0),s.lineTo(-i,t*.32),s.lineTo(-i*.7,t*.5),s.lineTo(i*.55,t*.5),s.lineTo(i*.94,t*.18),s.lineTo(i,0),s.lineTo(i*.94,-t*.18),s.lineTo(i*.55,-t*.5),s.lineTo(-i*.7,-t*.5),s.lineTo(-i,-t*.32),s.lineTo(-i*.98,0);const o=Co(new Xn(s,{depth:n,bevelEnabled:!0,bevelSize:.3,bevelThickness:.3,bevelSegments:2,steps:1}));o.rotateX(-Math.PI/2),o.rotateY(Math.PI/2);const a=Es("merchantHullTex","merchantRust",{baseColor:[.66,.35,.16],panelCols:8,panelRows:5,rustAmount:.6,rustColor:[.22,.12,.08]},8,3),l=new ce(o,a);l.castShadow=!0,l.receiveShadow=!0,r.add(l);const c=new ce(new it(t*1.02,.9,e*.92),hn("merchantStripe",790032,.6,.2));c.position.set(0,.3,0),r.add(c);const h=Es("merchantUpperTex","merchantCream",{baseColor:[.78,.75,.65],panelCols:8,panelRows:2,rustAmount:.15},8,1,{normalScale:.4}),u=new ce(new it(t*.94,n*.32,e*.9),h);u.position.set(0,n*.86,0),r.add(u);const d=Es("merchantHouseTex","merchantCream",{baseColor:[.8,.77,.67],panelCols:4,panelRows:6,rustAmount:.12},3,4,{normalScale:.4}),f=hn("merchantGlass",1186336,.2,.6),p=-i*.68,_=new ce(new it(t*.72,12,16),d);_.position.set(0,n+6,p),_.castShadow=!0,r.add(_);const m=new ce(new it(t*.6,1.3,.15),f);m.position.set(0,n+11,p+8.05),r.add(m);const g=new ce(new dt(1.6,1.9,6,10),hn("merchantFunnel",9056047,.7,.1));g.position.set(0,n+15,p-3),g.castShadow=!0,r.add(g);const y=hn("merchantPost",3948614,.6,.4);for(const x of[i*.25,-i*.15]){const R=new ce(new dt(.5,.5,9,6),y);R.position.set(0,n+4.5,x),r.add(R);const A=new ce(new dt(.25,.25,11,6),y);A.rotation.z=Math.PI/2.6,A.position.set(0,n+7.5,x+3),r.add(A)}const v=hn("merchantRail",2764338,.6,.4);for(const x of[-1,1]){const R=new ce(new it(e*.6,.6,.08),v);R.position.set(-4,n+.9,x*t*.47),r.add(R)}return{group:r,length:e,beam:t,deckY:n}}function Ow(){const r=new Mt,e=Es("subBodyTex","darkHull",{baseColor:[.15,.16,.17],panelCols:7,panelRows:12,rustAmount:.3,rustColor:[.22,.17,.14]},9,4,{metalness:.5,normalScale:1}),t=[new W(0,-30),new W(1.6,-27.5),new W(3,-22),new W(3.6,-10),new W(3.7,5),new W(3.5,16),new W(2.6,24),new W(1.2,28.5),new W(0,30)],n=new Bs(t,24);n.rotateZ(Math.PI/2);const i=new ce(n,e);i.castShadow=!0,i.receiveShadow=!0,r.add(i);const s=new bn;s.moveTo(-4.5,0),s.lineTo(-3.8,5.4),s.lineTo(2.8,5.6),s.lineTo(3.6,0),s.lineTo(-4.5,0);const o=Co(new Xn(s,{depth:2.6,bevelEnabled:!0,bevelSize:.15,bevelThickness:.15,bevelSegments:1}));o.rotateX(-Math.PI/2),o.translate(0,3.5,4),o.rotateY(0);const a=new ce(o,e);a.position.y=0,a.castShadow=!0,r.add(a);const l=hn("subPlane",1316634,.4,.6);for(const u of[-1,1]){const d=new ce(new it(4.4,.18,1.1),l);d.position.set(u*2.6,6.2,4),d.rotation.z=u*.05,r.add(d)}const c=new ce(new dt(.13,.13,3.4,6),hn("periscope",657930));c.position.set(-.6,9.5,4.6),r.add(c);const h=new ce(new dt(.16,.16,2.6,6),hn("periscope",657930));h.position.set(.6,9.1,3.2),r.add(h);for(const u of[0,Math.PI/2]){const d=new it(.15,4.2,3.2),f=new ce(d,e);f.position.set(0,0,-27),f.rotation.x=u,r.add(f)}return r.traverse(u=>{u.isMesh&&(u.castShadow=!0)}),{group:r,length:70,beam:8,deckY:0}}function Fw(r=9056047){const e=new Mt,t=new oe(r),n=Es("aircraftSkinTex_"+r,"aircraftSkin_"+r,{baseColor:[t.r,t.g,t.b],panelCols:5,panelRows:10,rustAmount:.15,rustColor:[t.r*.4,t.g*.4,t.b*.4]},6,10,{metalness:.6,roughness:.7,normalScale:.8}),i=hn("aircraftDark",1710620,.3,.5),s=hn("aircraftGlass",1846840,.15,.7),o=[new W(0,-5.2),new W(.35,-4.6),new W(.62,-3.2),new W(.7,-.5),new W(.68,1.8),new W(.5,3.4),new W(.28,4.4),new W(0,4.9)],a=new Bs(o,18);a.rotateZ(Math.PI/2);const l=new ce(a,n);l.castShadow=!0,e.add(l);const c=new ce(new hi(.42,10,8),s);c.scale.set(1.7,.6,.85),c.position.set(1.3,.32,0),e.add(c);const h=new bn;h.moveTo(.9,0),h.lineTo(-1.6,0),h.lineTo(-3.4,4.6),h.lineTo(-2.6,4.6),h.lineTo(.2,.6),h.lineTo(.9,0);const u=Co(new Xn(h,{depth:.12,bevelEnabled:!0,bevelSize:.04,bevelThickness:.04,bevelSegments:1}));u.rotateX(-Math.PI/2),u.translate(-.4,-.06,0);const d=new ce(u,n);d.castShadow=!0,e.add(d);const f=d.clone();f.scale.z=-1,e.add(f);const p=new bn;p.moveTo(-1,0),p.lineTo(.7,0),p.lineTo(.2,1.8),p.lineTo(-.5,1.8),p.lineTo(-1,0);const _=new Xn(p,{depth:.1,bevelEnabled:!1});for(const g of[-1,1]){const y=new ce(_,i);y.position.set(-3.6,-.1,g*.55),y.rotation.y=Math.PI/2,y.rotation.x=g*.35,e.add(y)}const m=new ce(new dt(.34,.42,.7,10),i);return m.rotation.z=Math.PI/2,m.position.set(-4.7,0,0),e.add(m),e.traverse(g=>{g.isMesh&&(g.castShadow=!0)}),{group:e,length:10,beam:7,deckY:0}}let Bw=1;function rg(){return Bw++}const qo={SURFACE:"SURFACE",SUBSURFACE:"SUBSURFACE",AIR:"AIR"},Xo={FRIENDLY:"FRIENDLY",HOSTILE:"HOSTILE",NEUTRAL:"NEUTRAL"};class vc{constructor({name:e,domain:t,iff:n,maxHealth:i=100,position:s=new S}){this.id=rg(),this.name=e,this.domain=t,this.iff=n,this.maxHealth=i,this.health=i,this.position=s.clone(),this.heading=0,this.speed=0,this.alive=!0,this.destroyed=!1,this.group=new Mt,this.group.name=e,this.detected=!1}get forward(){return new S(-Math.sin(this.heading),0,-Math.cos(this.heading))}takeDamage(e){this.alive&&(this.health=Math.max(0,this.health-e),this.health<=0&&(this.alive=!1,this.onDestroyed?.()))}distanceTo(e){return this.position.distanceTo(e)}dispose(e){e.remove(this.group),this.group.traverse(t=>{t.geometry&&t.geometry.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(n=>n.dispose()):t.material.dispose())})}}const Qf="/assets/models/player_ship.glb";class wh{constructor(e,{hullKind:t="hero",iffColor:n=3107466,name:i="Ship",shipId:s}={}){if(this.scene=e,this.shipId=s,this.name=i,this.hullKind=t,this.group=new Mt,this.group.name=`CrewedShip:${s||i}`,e.add(this.group),this.mountPoints=null,this.usingPlaceholder=t==="hero",this.id=rg(),this.domain=qo.SURFACE,this.iff=Xo.FRIENDLY,this.maxHealth=100,this.health=100,this.alive=!0,this.destroyed=!1,this.ciwsAmmo=1500,this._ciwsCooldown=0,this.networked=!1,this._netTarget=null,t==="hero")this.physics=new Ol({length:188,beam:24,maxSpeedKn:30,accel:1.6,turnRate:.28}),this._loadPlaceholderImmediately(),this._tryLoadRealModel();else{const{group:o,length:a,beam:l,deckY:c}=ed(n);this.modelGroup=o,this.deckY=c,this.group.add(this.modelGroup),this.physics=new Ol({length:a,beam:l,maxSpeedKn:28,accel:1.3,turnRate:.24}),this.mountPoints=this._proceduralExteriorMounts(a,l,c),this._addBridgeInterior({scale:.5,center:new S(0,c+5.5,8)})}}_proceduralExteriorMounts(e,t,n){return{gunBarrelTip:new S(0,n+1.5,e*.38),missileTubes:[new S(0,n+1.2,e*.2),new S(0,n+1.2,e*.1)],ciws:[new S(0,n+8,-e*.1)]}}_loadPlaceholderImmediately(){const{group:e,mountPoints:t}=Tw({length:188,beam:24});this.modelGroup=e,this.mountPoints=t,this.group.add(this.modelGroup),this._addBridgeInterior()}_addBridgeInterior({scale:e=1,center:t=null}={}){if(this.bridgeInterior)return;const{group:n,mountPoints:i}=Dw();let s=new S(0,0,0);if(e!==1||t){const l=i.bounds.minX-.6,c=i.bounds.maxX+.3,h=new S((l+c)/2,i.floorY,(i.bounds.minZ-.6+i.bounds.maxZ+.8)/2),u=h.clone().multiplyScalar(e);s=(t||h).clone().sub(u),n.scale.setScalar(e),n.position.copy(s)}this.bridgeInterior=n,this.group.add(n);const o=l=>l.clone().multiplyScalar(e).add(s),a={helm:o(i.helm),weaponsStation:o(i.weaponsStation),radar:o(i.radar),lookout:o(i.lookout),spawn:o(i.spawn),floorY:i.floorY*e+s.y,bounds:{minX:i.bounds.minX*e+s.x,maxX:i.bounds.maxX*e+s.x,minZ:i.bounds.minZ*e+s.z,maxZ:i.bounds.maxZ*e+s.z}};this.mountPoints={...this.mountPoints,...a}}async _tryLoadRealModel(){const e=new _c;try{const n=(await e.loadAsync(Qf)).scene;n.traverse(s=>{s.isMesh&&(s.castShadow=!0,s.receiveShadow=!0)}),this._addMicroDetailMaps(n),n.rotation.y=-Math.PI/2;const i=this._extractMountPoints(n);this._reconcileWithBridgeInterior(n),this.group.remove(this.modelGroup),this.modelGroup=n,this.group.add(this.modelGroup),i&&(this.mountPoints={...this.mountPoints,...i}),this.usingPlaceholder=!1,console.log("[CrewedShip] Loaded high-detail model from",Qf)}catch(t){console.log("[CrewedShip] High-detail model not available yet, using placeholder.",t?.message||t)}}_addMicroDetailMaps(e){const{normalMap:t,roughnessMap:n}=sg(),i=new Set;e.traverse(s=>{if(!s.isMesh||!s.material)return;const o=Array.isArray(s.material)?s.material:[s.material];for(const a of o)if(!i.has(a.uuid)&&(i.add(a.uuid),!(!a.isMeshStandardMaterial&&!a.isMeshPhysicalMaterial)&&!(a.transparent||a.opacity<.95))){if(!a.normalMap){const l=t.clone();l.needsUpdate=!0,l.repeat.set(48,48),l.wrapS=l.wrapT=Wt,a.normalMap=l,a.normalScale=new W(.18,.18)}if(!a.roughnessMap){const l=n.clone();l.needsUpdate=!0,l.repeat.set(48,48),l.wrapS=l.wrapT=Wt,a.roughnessMap=l}typeof a.roughness=="number"&&(a.roughness=Math.max(.55,Math.min(.92,a.roughness+.2))),typeof a.metalness=="number"&&(a.metalness=Math.min(a.metalness,.25)),a.color&&a.color.multiplyScalar(.92),a.needsUpdate=!0}})}_reconcileWithBridgeInterior(e){const t=["Bridge_Glass","Bridge_Mullions","BridgeWing_P","BridgeWing_S","BridgeWingWall_P","BridgeWingWall_S","SS_Bridge","Bridge","BridgeInterior","Bridge_Roof","BridgeRoof"];for(const n of t){const i=e.getObjectByName(n);i&&(i.visible=!1)}e.traverse(n=>{if(!n.isMesh)return;const i=n.name||"";/bridge/i.test(i)&&!/radar|mast|antenna/i.test(i)&&(n.visible=!1)})}_extractMountPoints(e){const t={},n=[],i=[];return e.traverse(s=>{s.name==="Helm"?t.helm=s.position.clone():s.name==="WeaponsStation"?t.weaponsStation=s.position.clone():s.name==="GunBarrelTip"?t.gunBarrelTip=s.position.clone():s.name.startsWith("MissileTube")?n.push(s.position.clone()):s.name.startsWith("CIWS")&&i.push(s.position.clone())}),n.length&&(t.missileTubes=n),i.length&&(t.ciws=i),Object.keys(t).length?t:null}setCommand(e,t){this.physics.setCommand(e,t)}update(e,t,n){if(this.networked&&this._netTarget){const i=Math.min(1,e*6);this.physics.position.lerp(this._netTarget.pos,i),this.physics.heading=Ie.lerp(this.physics.heading,this._netTarget.heading,i),this.physics.speed=Ie.lerp(this.physics.speed,this._netTarget.speed,i),this.physics.roll=Ie.lerp(this.physics.roll||0,this._netTarget.roll||0,i),this.physics.pitch=Ie.lerp(this.physics.pitch||0,this._netTarget.pitch||0,i),this.physics.applyToObject3D(this.group);return}this.physics.update(e,n,t),this.physics.applyToObject3D(this.group)}applyNetworkState({pos:e,heading:t,speed:n,roll:i,pitch:s}){this._netTarget={pos:new S(e.x,e.y,e.z),heading:t,speed:n,roll:i,pitch:s}}getMountWorld(e,t=new S){return t.copy(e).applyMatrix4(this.group.matrixWorld)}get position(){return this.group.position}get forward(){return this.physics.forward}distanceTo(e){return this.group.position.distanceTo(e)}takeDamage(e){this.alive&&(this.health=Math.max(0,this.health-e),this.health<=0&&(this.alive=!1,this.destroyed=!0))}dispose(e){e.remove(this.group),this.group.traverse(t=>{t.geometry&&t.geometry.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(n=>n.dispose()):t.material.dispose())})}}class Th{constructor(e,{role:t="escort",stationOffset:n=null}={}){this.ship=e,this.role=t,this.stationOffset=n,this.helmEnabled=!0,this.weaponsEnabled=!0,this._fireCooldown=Math.random()*4}updateHelm(e,{anchorShip:t,waypoint:n}){if(!this.helmEnabled)return;const i=this.ship.physics;let s=0,o=0;if(this.role==="escort"&&t){const a=this.stationOffset.clone().applyQuaternion(t.group.quaternion).add(t.group.position),l=new S().subVectors(a,i.position),c=l.length();if(c>8){let u=Math.atan2(-l.x,-l.z)-i.heading;for(;u>Math.PI;)u-=Math.PI*2;for(;u<-Math.PI;)u+=Math.PI*2;o=Ie.clamp(u*1.3,-1,1);const d=t.physics.speed/t.physics.maxSpeedMs;s=Ie.clamp(d+Ie.clamp((c-40)/200,0,.5),-1,1)}else o=0,s=t.physics.speed/t.physics.maxSpeedMs}else{const a=n||i.position.clone().addScaledVector(i.forward,100),l=new S().subVectors(a,i.position);if(l.lengthSq()>400){let h=Math.atan2(l.x,l.z)-i.heading;for(;h>Math.PI;)h-=Math.PI*2;for(;h<-Math.PI;)h+=Math.PI*2;o=Ie.clamp(h*1.1,-1,1),s=.55}else s=.15,o=0}this.ship.setCommand(s,o)}updateWeapons(e,{hostiles:t,fireWeapon:n}){if(!this.weaponsEnabled||(this._fireCooldown-=e,this._fireCooldown>0||!t?.length))return;const i=this.ship.mountPoints;if(!i?.gunBarrelTip)return;const s=this.ship.group.position;let o=null,a=3200;for(const c of t){if(!c.alive)continue;const h=c.position.distanceTo(s);h<a&&(a=h,o=c)}if(!o)return;const l=this.ship.getMountWorld(i.gunBarrelTip,new S);n("playerShell",l,o.position.clone(),this.ship,o),this._fireCooldown=2.2+Math.random()*1.5}}const Lt={JOIN_ROOM:"join_room",LEAVE_ROOM:"leave_room",CLAIM_SLOT:"claim_slot",RELEASE_SLOT:"release_slot",SET_READY:"set_ready",START_PATROL:"start_patrol",SHIP_STATE:"ship_state",WEAPON_FIRE:"weapon_fire",ENTITY_HIT:"entity_hit",ENTITY_SPAWN:"entity_spawn",ENTITY_STATE:"entity_state",ENTITY_DESTROYED:"entity_destroyed",MISSION_STATE:"mission_state",SONAR_PING:"sonar_ping",COMMS:"comms",WELCOME:"welcome",ROOM_STATE:"room_state",SLOT_DENIED:"slot_denied"},kw=["player","escort1","escort2"],ep={player:"FS Meridian (DDG)",escort1:"FS Sentinel (DDG)",escort2:"FS Vanguard (CG)"},tp=["HELM","WEAPONS","RADAR","LOOKOUT"];class zw{constructor(){this.ws=null,this.playerId=null,this.roomCode=null,this.hostId=null,this.started=!1,this.players=[],this._listeners=new Map,this.connected=!1}on(e,t){return this._listeners.has(e)||this._listeners.set(e,new Set),this._listeners.get(e).add(t),()=>this._listeners.get(e)?.delete(t)}_emit(e,t){for(const n of this._listeners.get(e)||[])n(t)}get isHost(){return!!this.playerId&&this.playerId===this.hostId}get me(){return this.players.find(e=>e.id===this.playerId)||null}connect(e){return new Promise((t,n)=>{const i=new WebSocket(e);this.ws=i,i.addEventListener("open",()=>{this.connected=!0,t()}),i.addEventListener("error",s=>{this.connected||n(s)}),i.addEventListener("close",()=>{this.connected=!1,this._emit("disconnected",null)}),i.addEventListener("message",s=>{let o;try{o=JSON.parse(s.data)}catch{return}this._handle(o)})})}_handle(e){switch(e.t){case Lt.WELCOME:this.playerId=e.playerId,this.roomCode=e.code,this._emit("welcome",e);break;case Lt.ROOM_STATE:this.roomCode=e.code,this.hostId=e.hostId,this.started=e.started,this.players=e.players,this._emit("room_state",e);break;case Lt.SLOT_DENIED:this._emit("slot_denied",e);break;case Lt.START_PATROL:this.started=!0,this._emit("start_patrol",e);break;default:this._emit(e.t,e);break}}send(e,t={}){!this.ws||this.ws.readyState!==1||this.ws.send(JSON.stringify({t:e,...t}))}joinRoom(e,t){this.send(Lt.JOIN_ROOM,{code:e,name:t})}leaveRoom(){this.send(Lt.LEAVE_ROOM)}claimSlot(e,t){this.send(Lt.CLAIM_SLOT,{shipId:e,station:t})}releaseSlot(){this.send(Lt.RELEASE_SLOT)}setReady(e){this.send(Lt.SET_READY,{ready:e})}startPatrol(){this.send(Lt.START_PATROL)}sendShipState(e){this.send(Lt.SHIP_STATE,e)}sendWeaponFire(e){this.send(Lt.WEAPON_FIRE,e)}sendEntityHit(e){this.send(Lt.ENTITY_HIT,e)}sendEntitySpawn(e){this.send(Lt.ENTITY_SPAWN,e)}sendEntityState(e){this.send(Lt.ENTITY_STATE,e)}sendEntityDestroyed(e){this.send(Lt.ENTITY_DESTROYED,e)}sendMissionState(e){this.send(Lt.MISSION_STATE,e)}sendSonarPing(e){this.send(Lt.SONAR_PING,e)}sendComms(e){this.send(Lt.COMMS,e)}close(){this.ws&&this.ws.close()}}function Hw(){return`${location.protocol==="https:"?"wss:":"ws:"}//${location.host}/ws-relay`}class Gw{constructor({ships:e,name:t}){this.ships=e,this.localName=t,this.net=null,this.active=!1,this._sendAccum=0,this.soloShipId="player",this.onRoomState=null,this.onStartPatrol=null,this.onEntitySpawn=null,this.onEntityState=null,this.onEntityDestroyed=null,this.onMissionState=null,this.onDisconnected=null,this.onComms=null,this.onShipHitRemote=null,this._weaponSpawners=null}async start({code:e,name:t}){this.net=new zw,await this.net.connect(Hw()),this.localName=t||this.localName,this.net.on("room_state",n=>this.onRoomState?.(n)),this.net.on("start_patrol",()=>{this.active=!0,this.onStartPatrol?.()}),this.net.on("ship_state",n=>this._applyRemoteShipState(n)),this.net.on("weapon_fire",n=>this._applyRemoteWeaponFire(n)),this.net.on("entity_hit",n=>{n.localTargetShipId&&this.onShipHitRemote?.(n.localTargetShipId,n.damage)}),this.net.on("entity_spawn",n=>this.onEntitySpawn?.(n)),this.net.on("entity_state",n=>this.onEntityState?.(n)),this.net.on("entity_destroyed",n=>this.onEntityDestroyed?.(n)),this.net.on("mission_state",n=>this.onMissionState?.(n)),this.net.on("comms",n=>this.onComms?.(n)),this.net.on("disconnected",()=>{const n=this.active;this.net=null,this.active=!1,n&&this.onDisconnected?.()}),this.net.joinRoom(e,this.localName)}leave(){this.net&&(this.net.leaveRoom(),this.net.close()),this.net=null,this.active=!1}get inSession(){return!!this.net}get isHost(){return!this.net||this.net.isHost}get players(){return this.net?this.net.players:[]}slotHolder(e,t){return this.net&&this.net.players.find(n=>n.shipId===e&&n.station===t)||null}isLocalSlot(e,t){const n=this.slotHolder(e,t);return!!n&&n.id===this.net.playerId}iSimulateShip(e){if(!this.net)return!0;const t=this.slotHolder(e,"HELM");return t?t.id===this.net.playerId:this.isHost}helmIsHuman(e){return this.net?!!this.slotHolder(e,"HELM"):e===this.soloShipId}weaponsIsHuman(e){return this.net?!!this.slotHolder(e,"WEAPONS"):e===this.soloShipId}claimSlot(e,t){this.net?.claimSlot(e,t)}releaseSlot(){this.net?.releaseSlot()}setReady(e){this.net?.setReady(e)}startPatrol(){this.net?.startPatrol()}tick(e){if(this.net&&(this._sendAccum+=e,!(this._sendAccum<1/15))){this._sendAccum=0;for(const[t,n]of Object.entries(this.ships))this.iSimulateShip(t)&&this.net.sendShipState({shipId:t,pos:{x:n.physics.position.x,y:n.physics.position.y,z:n.physics.position.z},heading:n.physics.heading,speed:n.physics.speed,roll:n.physics.roll,pitch:n.physics.pitch,health:n.health})}}_applyRemoteShipState(e){const t=this.ships[e.shipId];t&&(this.iSimulateShip(e.shipId)||(t.networked=!0,t.applyNetworkState(e),typeof e.health=="number"&&(t.health=e.health)))}fireAndRelay(e,t,n,i,s={}){const o=e(t,n,i,s);return this.net&&this.net.sendWeaponFire({type:t,from:{x:n.x,y:n.y,z:n.z},target:{x:i.x,y:i.y,z:i.z},targetEntityId:s.targetEntity?.id??null}),o}_applyRemoteWeaponFire(e){if(!this._weaponSpawners)return;const t=new S(e.from.x,e.from.y,e.from.z),n=new S(e.target.x,e.target.y,e.target.z),i=e.targetEntityId!=null?this._weaponSpawners.findEntity(e.targetEntityId):null;this._weaponSpawners.spawn(e.type,t,n,{targetEntity:i})}setWeaponHooks({spawn:e,findEntity:t}){this._weaponSpawners={spawn:e,findEntity:t}}}const Vw=1.72,Ww=3.4,qw=6,Xw=.0022,xt={WALK:"WALK",HELM:"HELM",WEAPONS:"WEAPONS",RADAR:"RADAR",LOOKOUT:"LOOKOUT",TRANSITION:"TRANSITION"},tn={[xt.HELM]:{mountKey:"helm",lookOffset:new S(0,1.1,55),fov:58,lookLimits:{yaw:1.15,pitchMin:-.28,pitchMax:.22},hideLayers:[2],promptText:"Press E to take the Helm",barText:"HELM — W/S Throttle · A/D Rudder · E to leave",accent:"#4de8ff"},[xt.WEAPONS]:{mountKey:"weaponsStation",lookOffset:new S(18,.8,38),fov:50,lookLimits:{yaw:.85,pitchMin:-.35,pitchMax:.3},hideLayers:[2],promptText:"Press E to man Weapons Station",barText:"WEAPONS — 1-4 Select · Click Fire · Tab Target · E Leave",accent:"#ffb02e"},[xt.RADAR]:{mountKey:"radar",lookOffset:new S(-18,.8,38),fov:50,lookLimits:{yaw:.85,pitchMin:-.35,pitchMax:.3},hideLayers:[2],promptText:"Press E to man the Radar/Sonar Station",barText:"RADAR/SONAR — Q Sonar Ping · Tab Cycle · E to leave",accent:"#4de8ff"},[xt.LOOKOUT]:{mountKey:"lookout",lookOffset:new S(40,-.1,55),fov:38,lookLimits:{yaw:1.6,pitchMin:-.7,pitchMax:.45},promptText:"Press E to take the Lookout",barText:"LOOKOUT — Mouse Look · Scroll Zoom · E to leave",accent:"#3dffa0",zoomable:!0,zoomMin:28,zoomMax:55}},Yw=3.4;class Kw{constructor({camera:e,cameraRig:t,domElement:n,playerShip:i,onInteractPrompt:s,onStationChange:o}){this.camera=e,this.rig=t,this.dom=n,this.ship=i,this.onInteractPrompt=s||(()=>{}),this.onStationChange=o||(()=>{}),this.state=xt.WALK,this.locked=!1,this.keys=new Set,this._nearbyStation=null,this.mouseSensScale=1,this.invertY=!1,this.lookoutZoom=1,this._bindEvents(),this._initForShip(i),this.camera.layers.enable(2)}_initForShip(e){this.ship=e;const t=e.mountPoints?.spawn;this.localPos=t?t.clone():new S(0,0,8),this.walkYaw=Math.PI,this.walkPitch=-.02;const n=e.mountPoints?.bounds;this.walkBounds=n||{minX:-7.5,maxX:9,minZ:6,maxZ:22}}setShip(e){this._initForShip(e)}_bindEvents(){this.dom.addEventListener("click",()=>{this.state===xt.WALK&&!this.locked&&this.dom.requestPointerLock()}),document.addEventListener("pointerlockchange",()=>{this.locked=document.pointerLockElement===this.dom}),document.addEventListener("mousemove",e=>{if(!this.locked)return;const t=Xw*this.mouseSensScale,n=this.invertY?-e.movementY:e.movementY;this.state===xt.WALK?(this.walkYaw-=e.movementX*t,this.walkPitch-=n*t,this.walkPitch=Ie.clamp(this.walkPitch,-1.35,1.35)):tn[this.state]&&this.rig.addLook(-e.movementX*t,-n*t)}),window.addEventListener("keydown",e=>{this.keys.add(e.code),e.code==="KeyE"&&this._tryInteract(),e.code==="Escape"&&this.locked&&document.exitPointerLock()}),window.addEventListener("keyup",e=>this.keys.delete(e.code)),this.dom.addEventListener("wheel",e=>{const t=tn[this.state];if(!t?.zoomable)return;e.preventDefault();const n=Ie.clamp(this.rig.fov+Math.sign(e.deltaY)*2.4,t.zoomMin??28,t.zoomMax??60);this.rig.fov=n,this.lookoutZoom=(t.zoomMax??55)/n},{passive:!1})}_tryInteract(){this.state===xt.WALK&&this._nearbyStation?this._enterStation(this._nearbyStation):tn[this.state]&&this._exitStation()}_stationWorldPose(e,t={pos:new S,quat:new ct}){const n=tn[e],i=this.ship.mountPoints[n.mountKey],s=i.clone().add(n.lookOffset);this.ship.getMountWorld(i,t.pos);const o=this.ship.getMountWorld(s,new S),a=new Pe().lookAt(t.pos,o,new S(0,1,0));return t.quat.setFromRotationMatrix(a),t}_applyStationLookLimits(e){const n=tn[e]?.lookLimits;if(!n){this.rig.lookLimits={yaw:Math.PI,pitchMin:-1.3,pitchMax:1.3};return}this.rig.lookLimits={yaw:n.yaw,pitchMin:n.pitchMin,pitchMax:n.pitchMax}}_enterStation(e){if(!this.ship.mountPoints?.[tn[e].mountKey])return;this.state=xt.TRANSITION,this._transitionTarget={type:"station",name:e},this.rig.lookEnabled=!1,this.rig.resetLook(),this._applyStationLookLimits(e),this.onInteractPrompt(null),this.lookoutZoom=1,this._applyStationLayers(e,!0);const{pos:t,quat:n}=this._stationWorldPose(e),i=tn[e];this.rig.transitionTo(t,n,i.fov,1.05,()=>{this.state=e,this.rig.lookEnabled=!0,this.onStationChange(e)})}_exitStation(){const e=tn[this.state],t=this.state,n=this.ship.mountPoints[e.mountKey];this.localPos.set(n.x,0,n.z-1.6),this.localPos.x=Ie.clamp(this.localPos.x,this.walkBounds.minX,this.walkBounds.maxX),this.localPos.z=Ie.clamp(this.localPos.z,this.walkBounds.minZ,this.walkBounds.maxZ),this.walkYaw=Math.PI,this.walkPitch=-.05,this.lookoutZoom=1,this._applyStationLayers(t,!1),this.state=xt.TRANSITION,this._transitionTarget={type:"walk"},this.rig.lookEnabled=!1,this.onStationChange(null);const i=this._walkWorldPosition(),s=this._walkWorldQuaternion();this.rig.transitionTo(i,s,70,.9,()=>{this.state=xt.WALK,this.onStationChange("WALK")})}_applyStationLayers(e,t){const n=tn[e];if(!(!n?.hideLayers?.length||!this.camera))for(const i of n.hideLayers)t?this.camera.layers.disable(i):this.camera.layers.enable(i)}_walkWorldPosition(e=new S){const t=this.ship.mountPoints.floorY??this.ship.mountPoints.deckY;return e.set(this.localPos.x,t+Vw,this.localPos.z),this.ship.getMountWorld(e,e)}_walkWorldQuaternion(e=new ct){const t=this.ship.group.quaternion,n=new ct().setFromEuler(new Zt(this.walkPitch,this.walkYaw,0,"YXZ"));return e.copy(t).multiply(n)}update(e){if(this.state===xt.WALK)this._updateWalk(e);else if(tn[this.state]){const{pos:t,quat:n}=this._stationWorldPose(this.state);this.rig.position.copy(t),this.rig.quaternion.copy(n)}else if(this.state===xt.TRANSITION&&this._transitionTarget?.type==="station"){const{pos:t,quat:n}=this._stationWorldPose(this._transitionTarget.name);this.rig.retarget(t,n)}}_updateWalk(e){const t=this.keys.has("ShiftLeft")||this.keys.has("ShiftRight")?qw:Ww,n=new ct().setFromEuler(new Zt(0,this.walkYaw,0,"YXZ")),i=new S(0,0,-1).applyQuaternion(n),s=new S(1,0,0).applyQuaternion(n),o=new S;this.keys.has("KeyW")&&o.add(i),this.keys.has("KeyS")&&o.sub(i),this.keys.has("KeyD")&&o.add(s),this.keys.has("KeyA")&&o.sub(s),o.lengthSq()>0&&(o.normalize().multiplyScalar(t*e),this.localPos.x=Ie.clamp(this.localPos.x+o.x,this.walkBounds.minX,this.walkBounds.maxX),this.localPos.z=Ie.clamp(this.localPos.z+o.z,this.walkBounds.minZ,this.walkBounds.maxZ));const a=this._walkWorldPosition(),l=this._walkWorldQuaternion();this.rig.setImmediate(a,l,70);const c=this.ship.mountPoints;let h=null,u=Yw;for(const d of Object.keys(tn)){const f=c[tn[d].mountKey];if(!f)continue;const p=Math.hypot(this.localPos.x-f.x,this.localPos.z-f.z);p<u&&(u=p,h=d)}h!==this._nearbyStation&&(this._nearbyStation=h,this.onInteractPrompt(h))}forceEnter(e){tn[e]&&this._enterStation(e)}}const np=new S,$w={playerShell:{speed:340,homing:0,gravity:9.8,life:8,damage:18,radius:12,color:16773808,size:.4,trail:!0},ciwsRound:{speed:620,homing:0,gravity:3,life:3,damage:6,radius:8,color:16771466,size:.15,trail:!1},playerMissile:{speed:260,homing:2.4,gravity:0,life:14,damage:65,radius:22,color:14674158,size:.7,trail:!0,smoke:!0},playerTorpedo:{speed:55,homing:1.6,gravity:0,life:25,damage:90,radius:18,color:8960192,size:.6,trail:!0,underwater:!0},drone:{speed:40,homing:3,gravity:0,life:60,damage:0,radius:30,color:10475775,size:.5,trail:!1,isDrone:!0},enemyShell:{speed:300,homing:0,gravity:9.8,life:8,damage:14,radius:12,color:16747098,size:.4,trail:!0},enemyMissile:{speed:230,homing:2,gravity:0,life:16,damage:55,radius:22,color:16734780,size:.7,trail:!0,smoke:!0},torpedo:{speed:45,homing:1.4,gravity:0,life:30,damage:80,radius:18,color:16734780,size:.6,trail:!0,underwater:!0},airMissile:{speed:200,homing:2.6,gravity:0,life:12,damage:50,radius:20,color:16734780,size:.55,trail:!0,smoke:!0}};let Zw=1;class Jw{constructor(e,t,n,{sourceEntity:i=null,targetEntity:s=null,scene:o}){this.id=Zw++,this.type=e,this.cfg=$w[e],this.sourceEntity=i,this.targetEntity=s,this.position=t.clone(),this.targetPos=n.clone(),this.velocity=new S().subVectors(n,t).normalize().multiplyScalar(this.cfg.speed),this.age=0,this.dead=!1,this.exploded=!1;const a=this.cfg.trail?new zo(this.cfg.size*.4,this.cfg.size*2.2,2,6):new hi(this.cfg.size*.5,6,6),l=new Ot({color:this.cfg.color});if(this.mesh=new ce(a,l),this.mesh.rotation.x=Math.PI/2,o.add(this.mesh),this.cfg.trail){const c=new Ve,h=new Float32Array(2*3);c.setAttribute("position",new st(h,3));const u=new Jt({color:this.cfg.color,transparent:!0,opacity:.55});this.trailLine=new li(c,u),o.add(this.trailLine),this._trailHistory=[t.clone(),t.clone()]}this.scene=o}update(e){if(this.age+=e,this.age>this.cfg.life){this.dead=!0;return}if(this.cfg.homing>0&&this.targetEntity&&this.targetEntity.alive!==!1&&this.targetPos.copy(this.targetEntity.position??this.targetEntity),this.cfg.homing>0){const t=np.subVectors(this.targetPos,this.position).normalize().multiplyScalar(this.cfg.speed);this.velocity.lerp(t,Math.min(1,this.cfg.homing*e))}if(this.cfg.gravity&&(this.velocity.y-=this.cfg.gravity*e),this.position.addScaledVector(this.velocity,e),this.cfg.underwater&&this.position.y>-.3&&(this.position.y=-.3),this.mesh.position.copy(this.position),this.velocity.lengthSq()>.01){const t=np.copy(this.velocity).normalize();this.mesh.quaternion.setFromUnitVectors(new S(0,1,0),t)}if(this.trailLine){this._trailHistory[0].copy(this._trailHistory[1]),this._trailHistory[1].copy(this.position);const t=this.trailLine.geometry.attributes.position.array;t[0]=this._trailHistory[0].x,t[1]=this._trailHistory[0].y,t[2]=this._trailHistory[0].z,t[3]=this._trailHistory[1].x,t[4]=this._trailHistory[1].y,t[5]=this._trailHistory[1].z,this.trailLine.geometry.attributes.position.needsUpdate=!0}!this.cfg.underwater&&this.position.y<=0&&this.cfg.gravity>0&&(this.dead=!0,this.exploded=!0)}dispose(){this.scene.remove(this.mesh),this.mesh.geometry.dispose(),this.mesh.material.dispose(),this.trailLine&&(this.scene.remove(this.trailLine),this.trailLine.geometry.dispose(),this.trailLine.material.dispose())}}const ip=new hi(1,12,8);class jw{constructor(e,t,{scale:n=1,underwater:i=!1}={}){this.scene=e,this.age=0,this.life=1.1*n,this.scale=n,this.dead=!1;const s=i?6738152:16757575;this.mat=new Ot({color:s,transparent:!0,opacity:1,depthWrite:!1}),this.mesh=new ce(ip,this.mat),this.mesh.position.copy(t),this.mesh.scale.setScalar(.1),e.add(this.mesh),this.light=new Si(s,40*n,120*n,2),this.light.position.copy(t),e.add(this.light),this.core=new ce(ip,new Ot({color:16774872,transparent:!0,opacity:1,depthWrite:!1})),this.core.position.copy(t),this.core.scale.setScalar(.05),e.add(this.core)}update(e){this.age+=e;const t=this.age/this.life;if(t>=1){this.dead=!0;return}const n=1-Math.pow(1-Math.min(1,t*2.2),3);this.mesh.scale.setScalar(Ie.lerp(.5,9,n)*this.scale),this.mat.opacity=1-t,this.core.scale.setScalar(Ie.lerp(.3,3.5,Math.min(1,t*4))*this.scale),this.core.material.opacity=Math.max(0,1-t*3),this.light.intensity=40*this.scale*(1-t)}dispose(){this.scene.remove(this.mesh),this.scene.remove(this.core),this.scene.remove(this.light),this.mat.dispose(),this.core.material.dispose()}}const Ha={gun:{label:"130mm Deck Gun",ammoKey:null,cooldown:.7,projType:"playerShell"},missile:{label:"Anti-Ship Missile",ammoKey:"missile",maxAmmo:16,cooldown:1.6,projType:"playerMissile"},torpedo:{label:"ASROC Torpedo",ammoKey:"torpedo",maxAmmo:8,cooldown:2.4,projType:"playerTorpedo"},drone:{label:"Recon Drone",ammoKey:"drone",maxAmmo:2,cooldown:3,projType:"drone"}};class Qw{constructor(e,t={}){this.scene=e,this.projectiles=[],this.explosions=[],this.cb=t,this.ammo={missile:16,torpedo:8,drone:2},this.selectedWeapon="gun",this._cooldowns={gun:0,missile:0,torpedo:0,drone:0},this.ciwsRangeM=900,this.selectedTargetId=null}selectWeapon(e){Ha[e]&&(this.selectedWeapon=e)}canFireSelected(){const e=Ha[this.selectedWeapon];return!(this._cooldowns[this.selectedWeapon]>0||e.ammoKey&&this.ammo[e.ammoKey]<=0)}firePlayerWeapon(e,t,n=null){const i=this.selectedWeapon,s=Ha[i];return this.canFireSelected()?(this._cooldowns[i]=s.cooldown,s.ammoKey&&this.ammo[s.ammoKey]--,this.spawn(s.projType,e,t,{targetEntity:n}),this.cb.onFire?.(i),!0):!1}spawn(e,t,n,i={}){const s=new Jw(e,t,n,{...i,scene:this.scene});return this.projectiles.push(s),s}explode(e,t){this.explosions.push(new jw(this.scene,e,t)),this.cb.onExplosion?.(e,t)}update(e,{ships:t,enemies:n,elapsed:i}){for(const s in this._cooldowns)this._cooldowns[s]=Math.max(0,this._cooldowns[s]-e);for(const s of t){if(!s.alive||(s._ciwsCooldown=Math.max(0,s._ciwsCooldown-e),s._ciwsCooldown>0||s.ciwsAmmo<=0))continue;const o=s.group.position,a=this.projectiles.find(l=>!l.dead&&["enemyMissile","torpedo","airMissile"].includes(l.type)&&l.position.distanceTo(o)<this.ciwsRangeM);if(a&&a.type!=="torpedo"){s._ciwsCooldown=.12,s.ciwsAmmo-=1;const l=o.clone().add(new S(0,14,0));this.spawn("ciwsRound",l,a.position.clone(),{targetEntity:a}),this.cb.onFire?.("ciws")}}for(const s of this.projectiles){if(s.dead)continue;if(s.update(e),s.type==="ciwsRound"&&s.targetEntity&&!s.targetEntity.dead){s.position.distanceTo(s.targetEntity.position)<6&&(s.targetEntity.dead=!0,this.explode(s.targetEntity.position.clone(),{scale:.5}),s.dead=!0);continue}if(s.dead){s.exploded&&this.explode(s.position.clone(),{scale:.6,underwater:s.cfg.underwater});continue}if(["playerShell","playerMissile","playerTorpedo","ciwsRound"].includes(s.type)){for(const a of n)if(!(!a.alive||a.destroyed)&&!(a.domain==="SUBSURFACE"&&s.type!=="playerTorpedo")&&s.position.distanceTo(a.position)<s.cfg.radius){a.takeDamage(s.cfg.damage),this.cb.onHit?.(a,s.cfg.damage),this.explode(s.position.clone(),{scale:s.cfg.damage>40?1.4:.8,underwater:a.domain==="SUBSURFACE"}),s.dead=!0;break}}else for(const a of t)if(a.alive&&s.position.distanceTo(a.group.position)<s.cfg.radius){a.takeDamage(s.cfg.damage),this.cb.onShipHit?.(a,s.cfg.damage),this.explode(s.position.clone(),{scale:1.2}),s.dead=!0;break}}this.projectiles=this.projectiles.filter(s=>s.dead?(s.dispose(),!1):!0);for(const s of this.explosions)s.update(e);this.explosions=this.explosions.filter(s=>s.dead?(s.dispose(),!1):!0)}getWeaponInfo(e=this.selectedWeapon){const t=Ha[e];return{name:t.label,ammo:t.ammoKey?this.ammo[t.ammoKey]:1/0,maxAmmo:t.ammoKey?t.maxAmmo:1/0,ready:this._cooldowns[e]<=0&&(!t.ammoKey||this.ammo[t.ammoKey]>0)}}}class eT{constructor({rangeM:e=6e3,sonarPingRangeM:t=2400}={}){this.rangeM=e,this.sonarPingRangeM=t,this.sonarPingActive=!1,this.sonarPingOrigin=null,this._pingTimer=0}triggerSonarPing(e){this.sonarPingActive=!0,this.sonarPingOrigin=e.clone(),this._pingTimer=2.2}update(e){this._pingTimer>0&&(this._pingTimer-=e,this._pingTimer<=0&&(this.sonarPingActive=!1))}buildContacts(e,t,n){const i=[];for(const s of t){if(s.destroyed)continue;const o=s.position.distanceTo(e);o>this.rangeM||s.domain==="SUBSURFACE"&&!s.isVisible||i.push({id:s.id,x:s.position.x-e.x,z:s.position.z-e.z,domain:s.domain,iff:s.iff,name:s.name,selected:s.id===n,distanceM:Math.round(o),healthPct:Math.round(s.health/s.maxHealth*100)})}return i}get sonarContext(){return{sonarPingActive:this.sonarPingActive,sonarPingOrigin:this.sonarPingOrigin,sonarPingRadius:this.sonarPingRangeM}}}const Ga=[{id:"briefing",comms:[{speaker:"TASK FORCE ACTUAL",text:"MERIDIAN, this is HORIZON ACTUAL. Task Force 21 is proceeding to patrol station VIGIL. Take your station and get underway.",urgency:"normal"}],objective:{text:"Get underway — take the helm and set a course to VIGIL",bearing:null,distanceM:null}},{id:"transit",trigger:"depart",comms:[{speaker:"CIC",text:"Course laid in for patrol station VIGIL, bearing marked on your repeater. Task force screening units are holding formation off your beam.",urgency:"normal"}],objective:{text:"Proceed to patrol station VIGIL",useWaypoint:0}},{id:"first_contact",trigger:"nearWaypoint0",comms:[{speaker:"CIC",text:"New surface contact, bearing correlates with a hostile picket. Recommend weapons free once designated hostile.",urgency:"warning"}],objective:{text:"Investigate and neutralize the hostile picket",useWaypoint:0},spawn:"wave1"},{id:"sub_threat",trigger:"wave1Cleared",comms:[{speaker:"SONAR",text:"Conn, Sonar — transient contact, possible submerged hostile bearing two-two-zero. Recommend active sonar search.",urgency:"warning"}],objective:{text:"Localize and prosecute the submerged contact — use SONAR PING (Q) at Weapons Station"},spawn:"sub1"},{id:"air_raid",trigger:"subCleared",comms:[{speaker:"CIC",text:"Multiple inbound air contacts, angels two, closing fast. All hands, air defense stations.",urgency:"critical"}],objective:{text:"Defend the task force — intercept inbound aircraft"},spawn:"airWave"},{id:"final",trigger:"airWaveCleared",comms:[{speaker:"TASK FORCE ACTUAL",text:"Well done, MERIDIAN. Station VIGIL is secure. Return to formation and stand by for further tasking.",urgency:"normal"}],objective:{text:"Patrol station secure — return to task force formation",useWaypoint:1}}];class tT{constructor({onComms:e,onObjective:t}={}){this.onComms=e||(()=>{}),this.onObjective=t||(()=>{}),this.started=!1,this.beatIndex=0,this.waypoints=[new S(2600,0,4200),new S(-200,0,300)],this.flags=new Set,this._started=!1}start(){this._started=!0,this.started=!0,this._runBeat(0)}_runBeat(e){if(e>=Ga.length)return;this.beatIndex=e;const t=Ga[e];for(const n of t.comms)this.onComms(n);if(t.objective){const n={...t.objective};n.useWaypoint!=null&&(n.waypoint=this.waypoints[n.useWaypoint]),this.onObjective(n)}this._pendingSpawn=t.spawn||null}consumeSpawnRequest(){const e=this._pendingSpawn;return this._pendingSpawn=null,e}flag(e){if(this.flags.has(e))return;this.flags.add(e);const t=Ga.findIndex(n=>n.trigger===e);t>=0&&t>this.beatIndex&&this._runBeat(t)}syncBeat(e){e<=this.beatIndex&&this.started||(this.started=!0,this._started=!0,this._runBeat(e))}get currentWaypoint(){const e=Ga[this.beatIndex];return e?.objective?.useWaypoint!=null?this.waypoints[e.objective.useWaypoint]:null}}const ps={PATROL:"PATROL",ENGAGE:"ENGAGE",SINKING:"SINKING"},nT="/assets/models/enemy_destroyer.glb";let Ah=null;function iT(){return Ah||(Ah=new _c().loadAsync(nT).then(r=>r.scene)),Ah}class sT extends vc{constructor({name:e="Contact",position:t,patrolPoints:n=[],scene:i}){super({name:e,domain:qo.SURFACE,iff:Xo.HOSTILE,maxHealth:140,position:t});const{group:s,length:o,beam:a,deckY:l}=ed();this.group=s,this.deckY=l,this.length=o,this.beam=a,this.physics=new Ol({length:o,beam:a,maxSpeedKn:24,accel:1.1,turnRate:.22}),this.physics.position.copy(t),this.patrolPoints=n,this._patrolIdx=0,this.state=ps.PATROL,this.engageRangeM=3200,this.gunRangeM=2600,this.missileRangeM=4200,this._gunCooldown=0,this._missileCooldown=Math.random()*8+6,this._sinkT=0,i.add(this.group),this._tryUpgradeModel()}async _tryUpgradeModel(){try{const t=(await iT()).clone(!0);t.rotation.x=Math.PI/2,t.updateMatrixWorld(!0);const n=new Kt().setFromObject(t),i=new S;n.getSize(i);const s=this.length||110;i.z>1&&t.scale.setScalar(s/i.z),n.setFromObject(t);const o=new S;n.getCenter(o),t.position.x-=o.x,t.position.z-=o.z,t.position.y-=n.min.y;const{normalMap:a,roughnessMap:l}=sg();for(t.traverse(c=>{if(!c.isMesh)return;c.castShadow=!0,c.receiveShadow=!0;const h=Array.isArray(c.material)?c.material:[c.material];for(const u of h)if(!(!u||u.transparent)){if(!u.normalMap){const d=a.clone();d.needsUpdate=!0,d.repeat.set(40,40),d.wrapS=d.wrapT=Wt,u.normalMap=d,u.normalScale=new W(.45,.45)}if(!u.roughnessMap){const d=l.clone();d.needsUpdate=!0,d.repeat.set(40,40),d.wrapS=d.wrapT=Wt,u.roughnessMap=d}typeof u.roughness=="number"&&(u.roughness=Math.max(u.roughness,.45)),typeof u.metalness=="number"&&(u.metalness=Math.min(u.metalness,.35)),u.needsUpdate=!0}});this.group.children.length;)this.group.remove(this.group.children[0]);this.group.add(t),this.deckY=7.2*(s/140)}catch(e){console.warn("[EnemyShip] Blender destroyer unavailable, keeping procedural mesh.",e?.message||e)}}onDestroyed(){this.state=ps.SINKING,this._sinkT=0}update(e,t){const{playerPos:n,elapsed:i,fireWeapon:s,getWaveHeight:o}=t;if(this.state===ps.SINKING){this._sinkT+=e,this.group.rotation.z+=e*.15,this.group.position.y-=e*1.4,this.group.rotation.x+=e*.05,this._sinkT>8&&(this.destroyed=!0);return}const a=this.physics.position.distanceTo(n);if(this.state===ps.PATROL)if(a<this.engageRangeM)this.state=ps.ENGAGE;else if(this.patrolPoints.length){const l=this.patrolPoints[this._patrolIdx];this.physics.position.distanceTo(l)<60&&(this._patrolIdx=(this._patrolIdx+1)%this.patrolPoints.length),this._steerToward(l,.55)}else this.physics.setCommand(.3,0);else if(this.state===ps.ENGAGE)if(a>this.engageRangeM*1.35)this.state=ps.PATROL;else{const l=this.gunRangeM*.75,c=a>l?.85:a<l*.6?-.3:.15;this._steerToward(n,c),this._gunCooldown-=e,a<this.gunRangeM&&this._gunCooldown<=0&&(this._gunCooldown=1.4+Math.random()*.8,s("enemyShell",this._muzzleWorld(),n.clone(),this)),this._missileCooldown-=e,a<this.missileRangeM&&this._missileCooldown<=0&&(this._missileCooldown=14+Math.random()*10,s("enemyMissile",this._muzzleWorld(),n.clone(),this))}this.physics.update(e,o,i),this.physics.applyToObject3D(this.group),this.position.copy(this.physics.position),this.heading=this.physics.heading}_steerToward(e,t){const n=new S().subVectors(e,this.physics.position);let s=Math.atan2(-n.x,-n.z)-this.physics.heading;for(;s>Math.PI;)s-=Math.PI*2;for(;s<-Math.PI;)s+=Math.PI*2;const o=Ie.clamp(s*1.4,-1,1);this.physics.setCommand(t,o)}_muzzleWorld(){return this.group.localToWorld(new S(0,this.deckY+1.5,this.length*.38))}}const Jn={PATROL:"PATROL",STALK:"STALK",SURFACE_ATTACK:"SURFACE_ATTACK",SINKING:"SINKING"},rT=-.4,Eh=-14;class oT extends vc{constructor({name:e="Sonar Contact",position:t,scene:n}){super({name:e,domain:qo.SUBSURFACE,iff:Xo.HOSTILE,maxHealth:90,position:t});const{group:i}=Ow();this.group=i,this.depth=Eh,this.state=Jn.PATROL,this.heading=Math.random()*Math.PI*2,this.speedMs=4,this.torpedoRangeM=1400,this._attackTimer=0,this._torpedoCooldown=20,this._sinkT=0,this.sonarRevealed=!1,n.add(this.group)}onDestroyed(){this.state=Jn.SINKING,this._sinkT=0}update(e,t){const{playerPos:n,elapsed:i,fireWeapon:s,sonarPingActive:o,sonarPingOrigin:a,sonarPingRadius:l}=t;if(this.state===Jn.SINKING){this._sinkT+=e,this.depth-=e*2.2,this.group.rotation.x+=e*.3,this._sinkT>6&&(this.destroyed=!0),this._applyTransform();return}const c=this.position.distanceTo(n);o&&a&&this.position.distanceTo(a)<l&&(this.sonarRevealed=4.5),this.sonarRevealed>0&&(this.sonarRevealed-=e),this.state===Jn.PATROL?(this.depth=Ie.lerp(this.depth,Eh,e*.3),c<2600&&(this.state=Jn.STALK),this._wander(e)):this.state===Jn.STALK?(this.depth=Ie.lerp(this.depth,Eh,e*.3),this._steerToward(n,e),this._torpedoCooldown-=e,c<this.torpedoRangeM&&this._torpedoCooldown<=0&&(this.state=Jn.SURFACE_ATTACK,this._attackTimer=3.5),c>3200&&(this.state=Jn.PATROL)):this.state===Jn.SURFACE_ATTACK&&(this._attackTimer-=e,this.depth=Ie.lerp(this.depth,rT,e*.8),this._steerToward(n,e,.3),this._attackTimer<=0&&(s("torpedo",this.position.clone(),n.clone(),this),this._torpedoCooldown=22+Math.random()*10,this.state=Jn.STALK)),this.position.addScaledVector(this.forward,this.speedMs*e),this._applyTransform()}_wander(e){this.heading+=Math.sin(performance.now()*13e-5+this.id)*.15*e}_steerToward(e,t,n=1){const i=new S().subVectors(e,this.position);let o=Math.atan2(-i.x,-i.z)-this.heading;for(;o>Math.PI;)o-=Math.PI*2;for(;o<-Math.PI;)o+=Math.PI*2;this.heading+=Ie.clamp(o,-.4*t,.4*t)*3,this.speedMs=4.2*n}_applyTransform(){this.group.position.set(this.position.x,this.depth,this.position.z),this.group.rotation.y=this.heading}get isVisible(){return this.depth>-2.5||this.sonarRevealed>0}}const Hi={INBOUND:"INBOUND",ATTACK_RUN:"ATTACK_RUN",EGRESS:"EGRESS",SHOT_DOWN:"SHOT_DOWN"};class aT extends vc{constructor({name:e="Bandit",position:t,scene:n}){super({name:e,domain:qo.AIR,iff:Xo.HOSTILE,maxHealth:35,position:t});const{group:i}=Fw();this.group=i,this.altitude=180+Math.random()*60,this.speedMs=95,this.heading=0,this.state=Hi.INBOUND,this._fireCooldown=0,this._egressTimer=0,this._fallVel=0,n.add(this.group)}onDestroyed(){this.state=Hi.SHOT_DOWN,this._fallVel=2}update(e,t){const{playerPos:n,fireWeapon:i}=t;if(this.state===Hi.SHOT_DOWN){this._fallVel+=e*22,this.altitude-=this._fallVel*e,this.group.rotation.z+=e*3.2,this.group.rotation.x+=e*1.6,this.altitude<=0&&(this.destroyed=!0),this._applyTransform();return}const s=new S().subVectors(n,this.position),o=Math.hypot(s.x,s.z);let l=Math.atan2(-s.x,-s.z)-this.heading;for(;l>Math.PI;)l-=Math.PI*2;for(;l<-Math.PI;)l+=Math.PI*2;this.state===Hi.INBOUND?(this.heading+=Ie.clamp(l,-1,1)*e*1.2,o<900&&(this.state=Hi.ATTACK_RUN)):this.state===Hi.ATTACK_RUN?(this.heading+=Ie.clamp(l,-1,1)*e*.6,this.altitude=Ie.lerp(this.altitude,70,e*.4),this._fireCooldown-=e,o<500&&this._fireCooldown<=0&&(i("airMissile",this.position.clone().setY(this.altitude),n.clone(),this),this._fireCooldown=999,this._egressTimer=2.5),this._egressTimer>0&&(this._egressTimer-=e,this._egressTimer<=0&&(this.state=Hi.EGRESS))):this.state===Hi.EGRESS&&(this.heading+=e*.15,this.altitude=Ie.lerp(this.altitude,220,e*.3),o>2400&&(this.destroyed=!0)),this.position.addScaledVector(this.forward,this.speedMs*e),this._applyTransform()}_applyTransform(){this.group.position.set(this.position.x,this.altitude,this.position.z),this.group.rotation.y=this.heading}}class lT extends vc{constructor({name:e="MV Contact",position:t,waypoints:n,scene:i}){super({name:e,domain:qo.SURFACE,iff:Xo.NEUTRAL,maxHealth:260,position:t});const{group:s,length:o,beam:a,deckY:l}=Uw();this.group=s,this.deckY=l,this.physics=new Ol({length:o,beam:a,maxSpeedKn:14,accel:.4,turnRate:.12}),this.physics.position.copy(t),this.waypoints=n,this._wpIdx=1;const c=new S().subVectors(n[1],n[0]);this.physics.heading=Math.atan2(-c.x,-c.z),i.add(this.group)}update(e,t){const{elapsed:n,getWaveHeight:i}=t,s=this.waypoints[this._wpIdx],o=new S().subVectors(s,this.physics.position);Math.hypot(o.x,o.z)<150&&(this._wpIdx=(this._wpIdx+1)%this.waypoints.length);let l=Math.atan2(-o.x,-o.z)-this.physics.heading;for(;l>Math.PI;)l-=Math.PI*2;for(;l<-Math.PI;)l+=Math.PI*2;const c=Ie.clamp(l*.8,-1,1);this.physics.setCommand(.55,c),this.physics.update(e,i,n),this.physics.applyToObject3D(this.group),this.position.copy(this.physics.position),this.heading=this.physics.heading}}class cT{constructor(e,t){this.scene=e,this.weapons=t,this.entities=[]}spawnWave(e,t){if(e==="wave1"){const n=t.clone().add(new S(400,0,200));this.entities.push(new sT({name:"Master 1 (FFG)",position:n,patrolPoints:[n.clone(),n.clone().add(new S(600,0,-300))],scene:this.scene}))}else if(e==="sub1"){const n=t.clone().add(new S(-300,0,500));this.entities.push(new oT({name:"Sonar Contact Sierra-1",position:n,scene:this.scene}))}else if(e==="airWave")for(let n=0;n<2;n++){const i=t.clone().add(new S(-1500+n*200,0,-1800-n*150));this.entities.push(new aT({name:`Bandit ${n+1}`,position:i,scene:this.scene}))}}spawnMerchantTraffic(e){const t=e.clone().add(new S(-2800,0,-1200)),n=e.clone().add(new S(2600,0,2400));this.entities.push(new lT({name:"MV Kestrel Bay",position:t.clone(),waypoints:[t,n],scene:this.scene}))}spawnHorizonTaskForce(e){if(this._horizonSpawned)return;this._horizonSpawned=!0;const t=e.clone().add(new S(-6400,0,5400)),n=[new S(0,0,0),new S(340,0,-220),new S(-260,0,260)];for(const i of n){const{group:s}=ed();s.position.copy(t).add(i),s.rotation.y=Math.PI*.15,s.traverse(o=>{o.isMesh&&(o.castShadow=!1,o.receiveShadow=!1)}),this.scene.add(s)}}update(e,t){for(const i of this.entities)i.destroyed||i.update(e,t);const n=this.entities.filter(i=>i.destroyed);for(const i of n)i.dispose(this.scene);this.entities=this.entities.filter(i=>!i.destroyed)}aliveOfType(e){return this.entities.filter(t=>t.alive&&!t.destroyed&&(typeof e=="string"?t.domain===e:t instanceof e))}get hostiles(){return this.entities.filter(e=>e.iff==="HOSTILE"&&!e.destroyed)}}function Va(r,e){const t=Math.sin(r*127.1+e*311.7)*43758.5453;return t-Math.floor(t)}function hT(r,e){const t=Math.floor(r),n=Math.floor(e),i=r-t,s=e-n,o=Va(t,n),a=Va(t+1,n),l=Va(t,n+1),c=Va(t+1,n+1),h=i*i*(3-2*i),u=s*s*(3-2*s);return Ie.lerp(Ie.lerp(o,a,h),Ie.lerp(l,c,h),u)}function cr(r,e,t=5){let n=0,i=.5,s=1;for(let o=0;o<t;o++)n+=i*hT(r*s,e*s),s*=2.05,i*=.5;return n}function og({radius:r=260,peak:e=58,segments:t=128,seed:n=0,rockCount:i=60,scrubCount:s=140,lighthouse:o=!0}={}){const a=new Mt;a.name="Island";const l=n*517.3,c=n*291.7,h=new In(r*1.4,r*1.4,t,t);h.rotateX(-Math.PI/2);const u=h.attributes.position,d=new Float32Array(u.count*3),f=new oe(14206090),p=new oe(5012030),_=new oe(7038815),m=new oe(9407362),g=new oe;for(let $=0;$<u.count;$++){const L=u.getX($),Q=u.getZ($),ne=Math.sqrt(L*L+Q*Q)/r,le=Math.max(0,1-Math.pow(ne,2.1)),we=cr(L*.012+l,Q*.012+c,5),Fe=cr(L*.035+40+l,Q*.035+40+c,3);let G=le*e*(.55+.65*we)-Fe*6*le;G=Ie.lerp(-14,G,le),G=Math.max(G,-14),G<4&&G>-2&&(G*=.6),u.setY($,G);const ie=Math.abs(we-cr(L*.012+.6+l,Q*.012+c,5));let pe;G<1.2?pe=g.copy(f):G<9?pe=g.copy(f).lerp(p,Ie.smoothstep(G,1.2,9)):G<e*.62?pe=g.copy(p).lerp(_,Ie.smoothstep(ie,.08,.32)):pe=g.copy(_).lerp(m,Ie.smoothstep(G,e*.62,e*.95)),d[$*3]=pe.r,d[$*3+1]=pe.g,d[$*3+2]=pe.b}h.setAttribute("color",new st(d,3)),h.computeVertexNormals();const y=new $e({vertexColors:!0,roughness:.95,metalness:0}),v=new ce(h,y);v.receiveShadow=!0,v.castShadow=!0,a.add(v);const x=new Go(1,0),R=new $e({color:7236194,roughness:.95,flatShading:!0}),A=new So(x,R,i);A.castShadow=!0,A.receiveShadow=!0;const T=new Ze;let I=0,F=0;for(;I<i&&F<i*20;){F++;const $=Math.random()*Math.PI*2,L=Math.pow(Math.random(),.6)*r*.92,Q=Math.cos($)*L,ne=Math.sin($)*L,le=Math.sqrt(Q*Q+ne*ne)/r,we=Math.max(0,1-Math.pow(le,2.1)),Fe=cr(Q*.012+l,ne*.012+c,5),G=we*e*(.55+.65*Fe);if(G<2)continue;const ie=1.2+Math.random()*3.2;T.position.set(Q,G-.4,ne),T.rotation.set(Math.random()*6,Math.random()*6,Math.random()*6),T.scale.set(ie,ie*(.7+Math.random()*.6),ie),T.updateMatrix(),A.setMatrixAt(I,T.matrix),I++}A.count=I,a.add(A);const M=new Dr(1,2.2,6),w=new $e({color:4156212,roughness:.9,flatShading:!0}),B=new So(M,w,s);B.castShadow=!0;let z=0,q=0;for(;z<s&&q<s*20;){q++;const $=Math.random()*Math.PI*2,L=Math.pow(Math.random(),.5)*r*.75,Q=Math.cos($)*L,ne=Math.sin($)*L,le=Math.sqrt(Q*Q+ne*ne)/r,we=Math.max(0,1-Math.pow(le,2.1)),Fe=cr(Q*.012+l,ne*.012+c,5),G=we*e*(.55+.65*Fe);if(G<3||G>e*.55)continue;const ie=.7+Math.random()*1.1;T.position.set(Q,G+1*ie*.4,ne),T.rotation.set(0,Math.random()*6,0),T.scale.set(ie,ie*(.8+Math.random()*.7),ie),T.updateMatrix(),B.setMatrixAt(z,T.matrix),z++}B.count=z,a.add(B);let j=null,k=null;if(o){const $=new $e({color:15262416,roughness:.6}),L=new $e({color:11875631,roughness:.6}),Q=new Mt,ne=22,le=new dt(2.6,3.6,ne,12),we=new ce(le,$);we.position.y=ne/2,we.castShadow=!0,Q.add(we);for(let Ne=0;Ne<3;Ne++){const ze=new ce(new dt(2.62+Ne*.006,2.9+Ne*.5,ne/6,12),L);ze.position.y=ne*.18+Ne*(ne/3.1),Q.add(ze)}const Fe=new ce(new dt(2.2,2.2,3,10),new $e({color:1710618,roughness:.3,metalness:.4}));Fe.position.y=ne+1.5,Q.add(Fe);const G=new hi(1.1,10,8),ie=new $e({color:16774084,emissive:16768392,emissiveIntensity:2.2,roughness:.3});k=new ce(G,ie),k.position.y=ne+1.5,Q.add(k),j=new Si(16768392,8,400,2),j.position.y=ne+1.5,Q.add(j);const pe=r*.12,ue=-r*.08,Le=Math.max(0,1-Math.pow(Math.sqrt(pe*pe+ue*ue)/r,2.1))*e*(.55+.65*cr(pe*.012+l,ue*.012+c,5));Q.position.set(pe,Le,ue),a.add(Q)}return{group:a,radius:r,beaconLight:j,lamp:k}}function $h(r){const e=Math.hypot(r.x,r.y,r.z)||1;return{x:r.x/e,y:r.y/e,z:r.z/e}}function uT(r,e){return{x:r.x-e.x,y:r.y-e.y,z:r.z-e.z}}function dT(r,e){return r.x*e.x+r.y*e.y+r.z*e.z}function fT(r,e){return{x:r.y*e.z-r.z*e.y,y:r.z*e.x-r.x*e.z,z:r.x*e.y-r.y*e.x}}function pT(r){return Math.hypot(r.x,r.y,r.z)}function Ch(r,e,t){return Math.min(t,Math.max(e,r))}class mT{constructor(){this.position={x:0,y:0,z:0},this.forward={x:0,y:0,z:-1},this.up={x:0,y:1,z:0}}setPosition(e,t,n){this.position={x:e,y:t,z:n}}setOrientation(e,t){e&&(this.forward=$h(e)),t&&(this.up=$h(t))}}function gT(r,e,{refDistance:t=15,maxDistance:n=1200,rolloff:i=1.3}={}){if(!e)return{gain:1,pan:0,distance:0};const s=uT(e,r.position),o=pT(s);let a;if(o<=t)a=1;else if(o>=n)a=0;else{const h=Ch(o,t,n);a=Math.pow(t/h,i)}const l=$h(fT(r.forward,r.up));let c=0;if(o>1e-4){const h={x:s.x/o,y:s.y/o,z:s.z/o};c=Ch(dT(h,l),-1,1)}return{gain:Ch(a,0,1),pan:c,distance:o}}function ag(r,e,t){return Math.min(t,Math.max(e,r))}function Qn(r){return ag(r,0,1)}function Cn(r,e,t){return r+(e-r)*t}const Fl=1e-4;function Rn(r,e){return r+Math.random()*(e-r)}function Rh(r,e=2,t="white"){const n=r.sampleRate,i=Math.max(1,Math.floor(n*e)),s=r.createBuffer(1,i,n),o=s.getChannelData(0);if(t==="pink"){let a=0,l=0,c=0,h=0,u=0,d=0,f=0;for(let p=0;p<i;p++){const _=Math.random()*2-1;a=.99886*a+_*.0555179,l=.99332*l+_*.0750759,c=.969*c+_*.153852,h=.8665*h+_*.3104856,u=.55*u+_*.5329522,d=-.7616*d-_*.016898;const m=a+l+c+h+u+d+f+_*.5362;f=_*.115926,o[p]=m*.11}}else if(t==="brown"){let a=0;for(let l=0;l<i;l++){const c=Math.random()*2-1;a=(a+.02*c)/1.02,o[l]=a*3.5}}else for(let a=0;a<i;a++)o[a]=Math.random()*2-1;for(let a=0;a<i;a++)o[a]=ag(o[a],-1,1);return s}function Ht(r,e,t,n){const i=r.createBufferSource();i.buffer=e;const s=Math.min(n,e.duration-.02),o=Math.max(0,e.duration-s-.01),a=Math.random()*o;return i.start(t,a,s),i}function sp(r,{duration:e=2.5,decay:t=3,reverse:n=!1,brightness:i=.5}={}){const s=r.sampleRate,o=Math.max(1,Math.floor(s*e)),a=r.createBuffer(2,o,s);for(let l=0;l<2;l++){const c=a.getChannelData(l);let h=0;for(let u=0;u<o;u++){const d=u/o,f=Math.pow(1-d,t),p=Math.random()*2-1;h+=(p-h)*.35;const _=(p*i+h*(1-i))*f;c[n?o-u-1:u]=_}}return a}function ft(r,e,{attack:t=.005,decayTau:n=.15,peak:i=1}={}){r.cancelScheduledValues(e),r.setValueAtTime(Fl,e),r.linearRampToValueAtTime(i,e+Math.max(.001,t)),r.setTargetAtTime(Fl,e+Math.max(.001,t),Math.max(.001,n))}function Ei(r,e,{attack:t=.01,hold:n=.1,decayTau:i=.3,peak:s=1}={}){r.cancelScheduledValues(e),r.setValueAtTime(Fl,e),r.linearRampToValueAtTime(s,e+Math.max(.001,t)),r.setValueAtTime(s,e+t+n),r.setTargetAtTime(Fl,e+t+n,Math.max(.001,i))}function lg(r,e,t,n,i,s=!0){r.cancelScheduledValues(e),r.setValueAtTime(Math.max(t,1),e),s?r.exponentialRampToValueAtTime(Math.max(n,1),e+Math.max(.001,i)):r.linearRampToValueAtTime(n,e+Math.max(.001,i))}function Ph(r=50,e=2048){const t=new Float32Array(e),n=Math.PI/180;for(let i=0;i<e;i++){const s=i*2/e-1;t[i]=(3+r)*s*20*n/(Math.PI+r*Math.abs(s))}return t}function Bl(r,e,{frequency:t=1,depth:n=1,center:i=null}={}){const s=r.createOscillator();s.type="sine",s.frequency.value=t;const o=r.createGain();return o.gain.value=n,s.connect(o),o.connect(e),i!==null&&"value"in e&&(e.value=i),{osc:s,depthGain:o}}function rn(r,e,t={}){const n=r.ctx,i=n.createGain(),s=t.volume!=null?t.volume:1;let o=t.pan!=null?t.pan:0,a=1,l=0;if(t.position){const u=gT(r.listener,t.position,r.attenuationOpts);t.pan==null&&(o=u.pan),a=u.gain,l=u.distance}i.gain.value=Math.max(0,s*a);let c=null,h=i;return o!==0&&(c=n.createStereoPanner(),c.pan.value=Math.min(1,Math.max(-1,o)),i.connect(c),h=c),h.connect(e),{input:i,panNode:c,gain:i.gain.value,pan:o,distance:l}}class yc{constructor(e,{gainNode:t,onStop:n,onSetIntensity:i,onSetRpm:s}={}){this._engine=e,this._gainNode=t,this._onStop=n,this._onSetIntensity=i,this._onSetRpm=s,this._stopped=!1}setIntensity(e){this._stopped||!this._onSetIntensity||this._onSetIntensity(Qn(e))}setRpm(e){this._stopped||!this._onSetRpm||this._onSetRpm(Qn(e))}get stopped(){return this._stopped}stop(e=.5){if(this._stopped)return;this._stopped=!0;const n=this._engine.ctx.currentTime,i=Math.max(.02,e);if(this._gainNode){const s=this._gainNode.gain;s.cancelScheduledValues(n),s.setValueAtTime(Math.max(s.value,1e-4),n),s.linearRampToValueAtTime(1e-4,n+i)}this._onStop&&this._onStop(n+i+.05)}}function _T(r,e={}){const t=r.ctx,n=t.currentTime+.02,i=t.createGain();i.gain.setValueAtTime(1e-4,n),i.gain.linearRampToValueAtTime(1,n+1.5),i.connect(r.ambienceBus);const s=t.createGain(),o=t.createBiquadFilter();o.type="lowpass",o.frequency.value=500,o.Q.value=.5;const a=t.createBufferSource();a.buffer=r._buffers.brown,a.loop=!0,a.start(n),a.connect(o).connect(s).connect(i);const l=Bl(t,o.frequency,{frequency:.07,depth:220,center:500});l.osc.start(n);const c=t.createBiquadFilter();c.type="bandpass",c.frequency.value=3500,c.Q.value=.6;const h=t.createGain();h.gain.value=.1;const u=t.createBufferSource();u.buffer=r._buffers.white,u.loop=!0,u.start(n),u.connect(c).connect(h).connect(i);let d=Qn(e.intensity??.5);function f(v){d=v;const x=t.currentTime;s.gain.setTargetAtTime(Cn(.3,.9,v),x,.5),h.gain.setTargetAtTime(Cn(.04,.3,v),x,.5),l.depthGain.gain.setTargetAtTime(Cn(150,400,v),x,.5)}f(d);let p=!1,_=null;const m=[];function g(){if(p)return;const v=Rn(3,9)/(.4+d);_=setTimeout(()=>{p||(y(),g())},v*1e3)}function y(){const v=t.currentTime+.02,x=t.createBiquadFilter();x.type="bandpass",x.frequency.setValueAtTime(1800,v),x.frequency.exponentialRampToValueAtTime(280,v+1.2);const R=t.createGain();Ei(R.gain,v,{attack:.25,hold:.15,decayTau:.6,peak:.2+d*.4}),Ht(t,r._buffers.white,v,1.6).connect(x).connect(R).connect(i),r._scheduleCleanup([x,R],v+2.2)}return g(),new yc(r,{gainNode:i,onSetIntensity:f,onStop:v=>{p=!0,_&&clearTimeout(_),a.stop(v),u.stop(v),l.osc.stop(v),r._scheduleCleanup([i,s,o,c,h,l.depthGain,...m],v+.2)}})}function vT(r,e=.3){const t=r.ctx,n=t.currentTime+.02,i=t.createGain();i.gain.setValueAtTime(1e-4,n),i.gain.linearRampToValueAtTime(1,n+1.2),i.connect(r.ambienceBus);const s=y=>Cn(36,95,Qn(y)),o=y=>Cn(220,1500,Qn(y)),a=t.createOscillator();a.type="sawtooth",a.frequency.value=s(e);const l=t.createOscillator();l.type="sawtooth",l.frequency.value=s(e)*2.01;const c=t.createOscillator();c.type="sine",c.frequency.value=s(e)/2;const h=t.createGain();h.gain.value=.6;const u=t.createBiquadFilter();u.type="lowpass",u.frequency.value=o(e),u.Q.value=1.4;const d=t.createGain();d.gain.value=Cn(.4,.65,e),a.connect(u),l.connect(u),c.connect(h).connect(u),u.connect(d).connect(i);const f=Bl(t,d.gain,{frequency:6+e*4,depth:.05}),p=t.createBiquadFilter();p.type="bandpass",p.frequency.value=900,p.Q.value=.7;const _=t.createGain();_.gain.value=Cn(.04,.2,e);const m=t.createBufferSource();m.buffer=r._buffers.white,m.loop=!0,m.start(n),m.connect(p).connect(_).connect(i),a.start(n),l.start(n),c.start(n),f.osc.start(n);function g(y){const v=t.currentTime,x=s(y);a.frequency.setTargetAtTime(x,v,.4),l.frequency.setTargetAtTime(x*2.01,v,.4),c.frequency.setTargetAtTime(x/2,v,.4),u.frequency.setTargetAtTime(o(y),v,.4),d.gain.setTargetAtTime(Cn(.4,.65,y),v,.4),_.gain.setTargetAtTime(Cn(.04,.2,y),v,.4),f.osc.frequency.setTargetAtTime(6+y*4,v,.4)}return new yc(r,{gainNode:i,onSetRpm:g,onStop:y=>{a.stop(y),l.stop(y),c.stop(y),f.osc.stop(y),m.stop(y),r._scheduleCleanup([i,h,u,d,f.depthGain,p,_],y+.2)}})}function yT(r,e=.3){const t=r.ctx,n=t.currentTime+.02,i=t.createGain();i.gain.setValueAtTime(1e-4,n),i.gain.linearRampToValueAtTime(1,n+1),i.connect(r.ambienceBus);const s=t.createBiquadFilter();s.type="highpass",s.frequency.value=150;const o=t.createBiquadFilter();o.type="bandpass",o.frequency.value=Cn(500,2200,e),o.Q.value=.6;const a=t.createGain();a.gain.value=Cn(.15,.55,e);const l=t.createBufferSource();l.buffer=r._buffers.white,l.loop=!0,l.start(n),l.connect(s).connect(o).connect(a).connect(i);const c=Bl(t,a.gain,{frequency:.09,depth:.07}),h=Bl(t,a.gain,{frequency:.23,depth:.04});c.osc.start(n),h.osc.start(n);function u(d){const f=t.currentTime;o.frequency.setTargetAtTime(Cn(500,2200,d),f,.6),a.gain.setTargetAtTime(Cn(.15,.55,d),f,.6)}return u(e),new yc(r,{gainNode:i,onSetIntensity:u,onStop:d=>{l.stop(d),c.osc.stop(d),h.osc.stop(d),r._scheduleCleanup([i,o,s,a,c.depthGain,h.depthGain],d+.2)}})}function xT(r,e={}){const t=r.ctx,n=rn(r,r.sfxBus,e),i=t.currentTime+.002,s=t.createBiquadFilter();s.type="bandpass",s.frequency.value=2600,s.Q.value=.9;const o=t.createWaveShaper();o.curve=r._curves.gunCrack;const a=t.createGain();ft(a.gain,i,{attack:.001,decayTau:.028,peak:1}),Ht(t,r._buffers.white,i,.18).connect(s).connect(o).connect(a).connect(n.input);const c=t.createOscillator();c.type="triangle",lg(c.frequency,i,150,58,.09);const h=t.createGain();ft(h.gain,i,{attack:.002,decayTau:.045,peak:.9}),c.connect(h).connect(n.input),c.start(i),c.stop(i+.3);const u=i+.028,d=t.createBiquadFilter();d.type="bandpass",d.frequency.value=950,d.Q.value=3;const f=t.createGain();ft(f.gain,u,{attack:.001,decayTau:.018,peak:.35}),Ht(t,r._buffers.white,u,.05).connect(d).connect(f).connect(n.input),r._scheduleCleanup([n.input,n.panNode,s,o,a,h,d,f],i+.5)}function MT(r,e={}){const t=r.ctx,n=rn(r,r.sfxBus,e),i=t.currentTime+.002,s=t.createOscillator();s.type="sine",lg(s.frequency,i,58,32,.22);const o=t.createGain();ft(o.gain,i,{attack:.006,decayTau:.18,peak:1}),s.connect(o).connect(n.input),s.start(i),s.stop(i+.9);const a=t.createBiquadFilter();a.type="lowpass",a.Q.value=.7,a.frequency.setValueAtTime(250,i),a.frequency.linearRampToValueAtTime(2200,i+.25),a.frequency.linearRampToValueAtTime(900,i+1.1);const l=t.createWaveShaper();l.curve=r._curves.mildDrive;const c=t.createGain();Ei(c.gain,i,{attack:.04,hold:.35,decayTau:.55,peak:.85}),Ht(t,r._buffers.brown,i,1.3).connect(a).connect(l).connect(c).connect(n.input);const u=i+.08,d=t.createBiquadFilter();d.type="bandpass",d.Q.value=1.1,d.frequency.setValueAtTime(500,u),d.frequency.exponentialRampToValueAtTime(4200,u+.9);const f=t.createGain();Ei(f.gain,u,{attack:.15,hold:.2,decayTau:.35,peak:.55}),Ht(t,r._buffers.white,u,1).connect(d).connect(f).connect(n.input),r._scheduleCleanup([n.input,n.panNode,o,a,l,c,d,f],i+1.6)}function ST(r,e={}){const t=r.ctx,n=rn(r,r.sfxBus,e),i=t.currentTime+.002,s=e.duration??.55,o=e.rate??62,a=t.createBiquadFilter();a.type="bandpass",a.frequency.value=2100,a.Q.value=.8;const l=t.createGain();Ei(l.gain,i,{attack:.01,hold:s*.6,decayTau:.08,peak:.25}),Ht(t,r._buffers.white,i,s+.1).connect(a).connect(l).connect(n.input);const h=Math.round(s*o),u=[a,l];for(let d=0;d<h;d++){const f=i+d/o,p=t.createBiquadFilter();p.type="bandpass",p.frequency.value=Rn(1500,3200),p.Q.value=4;const _=t.createGain(),m=1-d/h*.35;ft(_.gain,f,{attack:8e-4,decayTau:.006,peak:.9*m}),Ht(t,r._buffers.white,f,.012).connect(p).connect(_).connect(n.input),u.push(p,_)}r._scheduleCleanup([n.input,n.panNode,...u],i+s+.3)}function bT(r,e={}){const t=r.ctx,n=rn(r,r.sfxBus,e),i=t.currentTime+.002,s=t.createBiquadFilter();s.type="bandpass",s.frequency.value=1250,s.Q.value=5;const o=t.createGain();ft(o.gain,i,{attack:.001,decayTau:.03,peak:.6}),Ht(t,r._buffers.white,i,.08).connect(s).connect(o).connect(n.input);const l=i+.01,c=t.createBiquadFilter();c.type="bandpass",c.frequency.setValueAtTime(900,l),c.frequency.exponentialRampToValueAtTime(300,l+.55),c.Q.value=.9;const h=t.createGain();Ei(h.gain,l,{attack:.02,hold:.12,decayTau:.3,peak:.75}),Ht(t,r._buffers.white,l,.7).connect(c).connect(h).connect(n.input);const d=t.createOscillator();d.type="sine",d.frequency.setValueAtTime(70,i),d.frequency.linearRampToValueAtTime(95,i+1);const f=t.createGain();Ei(f.gain,i+.05,{attack:.15,hold:.5,decayTau:.4,peak:.3}),d.connect(f).connect(n.input),d.start(i),d.stop(i+1.3);const p=[s,o,c,h,f],_=8;let m=i+.2;for(let g=0;g<_;g++){m+=Rn(.05,.14);const y=t.createOscillator();y.type="sine";const v=Rn(180,420);y.frequency.setValueAtTime(v,m),y.frequency.exponentialRampToValueAtTime(v*.6,m+.06);const x=t.createGain(),R=.18*(1-g/_);ft(x.gain,m,{attack:.003,decayTau:.03,peak:Math.max(R,.02)}),y.connect(x).connect(n.input),y.start(m),y.stop(m+.15),p.push(x)}r._scheduleCleanup([n.input,n.panNode,...p],i+1.6)}function wT(r,e={}){const t=r.ctx,n=rn(r,r.sfxBus,e),i=t.currentTime+.002,s=t.createBiquadFilter();s.type="lowpass",s.Q.value=.6,s.frequency.setValueAtTime(4500,i),s.frequency.exponentialRampToValueAtTime(400,i+.5);const o=t.createWaveShaper();o.curve=r._curves.mildDrive;const a=t.createGain();ft(a.gain,i,{attack:.003,decayTau:.14,peak:.9}),Ht(t,r._buffers.white,i,.6).connect(s).connect(o).connect(a).connect(n.input);const c=t.createOscillator();c.type="sine",c.frequency.setValueAtTime(120,i),c.frequency.exponentialRampToValueAtTime(45,i+.16);const h=t.createGain();ft(h.gain,i,{attack:.004,decayTau:.12,peak:1}),c.connect(h).connect(n.input),c.start(i),c.stop(i+.6),r._scheduleCleanup([n.input,n.panNode,s,o,a,h],i+.9)}function TT(r,e={}){const t=r.ctx,n=rn(r,r.sfxBus,e),i=t.currentTime+.002,s=[],o=t.createOscillator();o.type="sine",o.frequency.setValueAtTime(85,i),o.frequency.exponentialRampToValueAtTime(28,i+.5);const a=t.createOscillator();a.type="triangle",a.frequency.setValueAtTime(42,i),a.frequency.exponentialRampToValueAtTime(24,i+.9);const l=t.createGain();ft(l.gain,i,{attack:.005,decayTau:.6,peak:1}),o.connect(l),a.connect(l),l.connect(n.input),o.start(i),o.stop(i+2.2),a.start(i),a.stop(i+2.2);const c=t.createBiquadFilter();c.type="lowpass",c.Q.value=.5,c.frequency.setValueAtTime(6e3,i),c.frequency.exponentialRampToValueAtTime(300,i+.9);const h=t.createWaveShaper();h.curve=r._curves.heavyDrive;const u=t.createGain();Ei(u.gain,i,{attack:.004,hold:.05,decayTau:.4,peak:1}),Ht(t,r._buffers.white,i,1.2).connect(c).connect(h).connect(u),u.connect(n.input);const f=t.createConvolver();f.buffer=r._impulses.room;const p=t.createGain();p.gain.value=.35,u.connect(f).connect(p).connect(n.input);const _=2.4;let m=i+.1,g=55;for(;m<i+_;){const y=t.createBiquadFilter();y.type="bandpass",y.frequency.value=Rn(1200,5500),y.Q.value=Rn(2,8);const v=t.createGain(),x=(m-i)/_,R=Rn(.05,.22)*(1-x);ft(v.gain,m,{attack:.001,decayTau:Rn(.01,.035),peak:Math.max(R,.01)}),Ht(t,r._buffers.white,m,.05).connect(y).connect(v).connect(n.input),s.push(y,v),g*=.94,m+=1/Math.max(g,3)+Rn(0,.02)}r._scheduleCleanup([n.input,n.panNode,l,c,h,u,f,p,...s],i+_+.5)}function AT(r,e={}){const t=r.ctx,n=rn(r,r.sfxBus,e),i=t.currentTime+.005,s=e.frequency??950,o=t.createGain();o.gain.value=1;const a=t.createOscillator();a.type="sine",a.frequency.setValueAtTime(s,i),a.frequency.exponentialRampToValueAtTime(s*.97,i+.6);const l=t.createGain();ft(l.gain,i,{attack:.008,decayTau:.22,peak:.9}),a.connect(l).connect(o),a.start(i),a.stop(i+1.2);const c=t.createOscillator();c.type="sine",c.frequency.setValueAtTime(s*2,i),c.frequency.exponentialRampToValueAtTime(s*2*.97,i+.6);const h=t.createGain();ft(h.gain,i,{attack:.008,decayTau:.18,peak:.18}),c.connect(h).connect(o),c.start(i),c.stop(i+1.2);const u=t.createGain();u.gain.value=.5,o.connect(u).connect(n.input);const d=t.createConvolver();d.buffer=r._impulses.plate;const f=t.createGain();f.gain.value=e.reverbAmount??.85,o.connect(d).connect(f).connect(n.input),r._scheduleCleanup([n.input,n.panNode,o,l,h,u,d,f],i+4.2)}function ET(r,e={}){const t=r.ctx,n={volume:.5,...e},i=rn(r,r.sfxBus,n),s=t.currentTime+.002,o=e.frequency??2e3,a=t.createOscillator();a.type="sine",a.frequency.value=o;const l=t.createGain();ft(l.gain,s,{attack:.002,decayTau:.05,peak:.6}),a.connect(l).connect(i.input),a.start(s),a.stop(s+.2);const c=t.createBiquadFilter();c.type="highpass",c.frequency.value=4e3;const h=t.createGain();ft(h.gain,s,{attack:.001,decayTau:.012,peak:.15}),Ht(t,r._buffers.white,s,.03).connect(c).connect(h).connect(i.input),r._scheduleCleanup([i.input,i.panNode,l,c,h],s+.4)}function CT(r,e={}){const t=r.ctx,n=rn(r,r.sfxBus,{volume:.6,...e}),i=t.currentTime+.001,s=t.createOscillator();s.type="triangle",s.frequency.value=1100;const o=t.createGain();ft(o.gain,i,{attack:.001,decayTau:.012,peak:.5}),s.connect(o).connect(n.input),s.start(i),s.stop(i+.08);const a=t.createBiquadFilter();a.type="highpass",a.frequency.value=3500;const l=t.createGain();ft(l.gain,i,{attack:.001,decayTau:.008,peak:.35}),Ht(t,r._buffers.white,i,.02).connect(a).connect(l).connect(n.input),r._scheduleCleanup([n.input,n.panNode,o,a,l],i+.2)}function RT(r,e={}){const t=r.ctx,n=rn(r,r.sfxBus,{volume:.35,...e}),i=t.currentTime+.001,s=t.createOscillator();s.type="sine",s.frequency.value=700;const o=t.createGain();ft(o.gain,i,{attack:.015,decayTau:.05,peak:.4}),s.connect(o).connect(n.input),s.start(i),s.stop(i+.15),r._scheduleCleanup([n.input,n.panNode,o],i+.25)}function PT(r,e={}){const t=r.ctx,n=rn(r,r.sfxBus,{volume:.55,...e}),i=t.currentTime+.002,s=[{freq:660,t:0,dur:.14},{freq:990,t:.09,dur:.22}],o=[];for(const a of s){const l=i+a.t,c=t.createOscillator();c.type="sine",c.frequency.value=a.freq;const h=t.createGain();ft(h.gain,l,{attack:.006,decayTau:.08,peak:.5}),c.connect(h).connect(n.input),c.start(l),c.stop(l+a.dur+.05),o.push(h)}r._scheduleCleanup([n.input,n.panNode,...o],i+.5)}function IT(r,e={}){const t=r.ctx,n=rn(r,r.sfxBus,{volume:.55,...e}),i=t.currentTime+.002,s=t.createOscillator();s.type="square",s.frequency.setValueAtTime(320,i),s.frequency.linearRampToValueAtTime(220,i+.16);const o=t.createGain();ft(o.gain,i,{attack:.004,decayTau:.09,peak:.28});const a=t.createBiquadFilter();a.type="lowpass",a.frequency.value=1400,s.connect(a).connect(o).connect(n.input),s.start(i),s.stop(i+.3);const l=t.createOscillator();l.type="square";const c=i+.1;l.frequency.setValueAtTime(300,c),l.frequency.linearRampToValueAtTime(190,c+.18);const h=t.createGain();ft(h.gain,c,{attack:.004,decayTau:.1,peak:.28}),l.connect(a).connect(h).connect(n.input),l.start(c),l.stop(c+.3),r._scheduleCleanup([n.input,n.panNode,o,h,a],i+.6)}function LT(r,e={}){const t=r.ctx,n=rn(r,r.sfxBus,e),i=t.currentTime+.002,s=[],o=t.createBiquadFilter();o.type="highpass",o.frequency.value=1200;const a=t.createGain();ft(a.gain,i,{attack:.001,decayTau:.015,peak:.8}),Ht(t,r._buffers.white,i,.05).connect(o).connect(a).connect(n.input),s.push(o,a);const c=e.pitch??420,h=[1,1.62,2.31,3.38,4.6];for(let p=0;p<h.length;p++){const _=c*h[p],m=t.createOscillator();m.type="triangle",m.frequency.value=_;const g=t.createBiquadFilter();g.type="bandpass",g.frequency.value=_,g.Q.value=Rn(8,16);const y=t.createGain(),v=.55/(p+1),x=.12+p*.05;ft(y.gain,i+.002,{attack:.001,decayTau:x,peak:v}),m.connect(g).connect(y).connect(n.input),m.start(i),m.stop(i+1.2+x*3),s.push(g,y)}const u=t.createBiquadFilter();u.type="lowpass",u.frequency.value=220;const d=t.createGain();Ei(d.gain,i+.01,{attack:.02,hold:.05,decayTau:.35,peak:.5}),Ht(t,r._buffers.brown,i,.7).connect(u).connect(d).connect(n.input),s.push(u,d),r._scheduleCleanup([n.input,n.panNode,...s],i+2.2)}function NT(r,e={}){const t=r.ctx,n=rn(r,r.sfxBus,e),i=t.currentTime+.002,s=[],o=t.createBiquadFilter();o.type="bandpass",o.Q.value=.7,o.frequency.setValueAtTime(1800,i),o.frequency.exponentialRampToValueAtTime(500,i+.35);const a=t.createGain();Ei(a.gain,i,{attack:.02,hold:.03,decayTau:.18,peak:.85}),Ht(t,r._buffers.white,i,.5).connect(o).connect(a).connect(n.input),s.push(o,a);const c=i+.02,h=t.createOscillator();h.type="sine",h.frequency.setValueAtTime(1400,c),h.frequency.exponentialRampToValueAtTime(280,c+.12);const u=t.createGain();ft(u.gain,c,{attack:.002,decayTau:.06,peak:.4}),h.connect(u).connect(n.input),h.start(c),h.stop(c+.25),s.push(u);let d=i+.1;for(let f=0;f<5;f++){d+=Rn(.04,.1);const p=t.createBiquadFilter();p.type="bandpass",p.frequency.value=Rn(400,1200),p.Q.value=3;const _=t.createGain();ft(_.gain,d,{attack:.002,decayTau:.04,peak:Rn(.08,.18)}),Ht(t,r._buffers.white,d,.06).connect(p).connect(_).connect(n.input),s.push(p,_)}r._scheduleCleanup([n.input,n.panNode,...s],i+1)}function DT(r,e={}){const t=r.ctx,n=rn(r,r.sfxBus,{volume:.7,...e}),i=t.currentTime+.005,s=t.createGain();s.gain.setValueAtTime(1e-4,i),s.gain.linearRampToValueAtTime(1,i+.15);const o=t.createOscillator();o.type="sawtooth";const a=e.lowFreq??340,l=e.highFreq??440,c=e.warbleRate??2.2,h=t.createOscillator();h.type="sine",h.frequency.value=c;const u=t.createGain();u.gain.value=(l-a)/2,h.connect(u),u.connect(o.frequency),o.frequency.value=(l+a)/2;const d=t.createBiquadFilter();d.type="bandpass",d.frequency.value=900,d.Q.value=.8;const f=t.createWaveShaper();return f.curve=r._curves.mildDrive,o.connect(d).connect(f).connect(s).connect(n.input),o.start(i),h.start(i),new yc(r,{gainNode:s,onStop:_=>{o.stop(_),h.stop(_),r._scheduleCleanup([n.input,n.panNode,s,d,f,u],_+.1)}})}function UT(r,e={}){const t=r.ctx,n=rn(r,r.sfxBus,{volume:.5,...e}),i=t.currentTime+.002,s=t.createBiquadFilter();s.type="bandpass",s.frequency.value=2200,s.Q.value=.6;const o=t.createGain();ft(o.gain,i,{attack:.003,decayTau:.04,peak:.5}),Ht(t,r._buffers.white,i,.1).connect(s).connect(o).connect(n.input);const l=i+.03,c=t.createOscillator();c.type="square",c.frequency.setValueAtTime(1e3,l),c.frequency.exponentialRampToValueAtTime(1400,l+.06);const h=t.createBiquadFilter();h.type="lowpass",h.frequency.value=2600;const u=t.createGain();ft(u.gain,l,{attack:.004,decayTau:.045,peak:.35}),c.connect(h).connect(u).connect(n.input),c.start(l),c.stop(l+.15),r._scheduleCleanup([n.input,n.panNode,s,o,h,u],i+.35)}const rp=typeof window<"u"?window.AudioContext||window.webkitAudioContext:null;class OT{constructor(){this.ctx=null,this.masterGain=null,this.musicBus=null,this.sfxBus=null,this.ambienceBus=null,this.compressor=null,this._buffers=null,this._impulses=null,this._curves=null,this._masterVolume=1,this._musicVolume=.8,this._sfxVolume=1,this.listener=new mT,this.attenuationOpts={refDistance:15,maxDistance:1200,rolloff:1.3},this._unlockPromise=null,this._warnedNotUnlocked=!1,this._cleanupTimers=new Set}unlock(){return this._unlockPromise?this._unlockPromise.then(()=>{if(this.ctx&&this.ctx.state!=="running")return this.ctx.resume()}):(this._unlockPromise=(async()=>{if(!rp)throw new Error("[AudioEngine] Web Audio API is not available in this environment.");this.ctx=new rp,this._buildGraph(),this._buildCaches(),this.ctx.state!=="running"&&await this.ctx.resume()})(),this._unlockPromise)}async dispose(){for(const e of this._cleanupTimers)clearTimeout(e);if(this._cleanupTimers.clear(),this.ctx)try{await this.ctx.close()}catch{}this.ctx=null,this._unlockPromise=null}_buildGraph(){const e=this.ctx;this.masterGain=e.createGain(),this.musicBus=e.createGain(),this.sfxBus=e.createGain(),this.ambienceBus=e.createGain(),this.compressor=e.createDynamicsCompressor(),this.compressor.threshold.value=-18,this.compressor.knee.value=24,this.compressor.ratio.value=8,this.compressor.attack.value=.003,this.compressor.release.value=.25,this.musicBus.connect(this.masterGain),this.sfxBus.connect(this.masterGain),this.ambienceBus.connect(this.masterGain),this.masterGain.connect(this.compressor),this.compressor.connect(e.destination),this.masterGain.gain.value=this._masterVolume,this.musicBus.gain.value=this._musicVolume,this.sfxBus.gain.value=this._sfxVolume,this.ambienceBus.gain.value=this._sfxVolume}_buildCaches(){const e=this.ctx;this._buffers={white:Rh(e,4,"white"),pink:Rh(e,4,"pink"),brown:Rh(e,4,"brown")},this._impulses={plate:sp(e,{duration:3.2,decay:2.6,brightness:.65}),room:sp(e,{duration:1.6,decay:4.5,brightness:.3})},this._curves={mildDrive:Ph(20),heavyDrive:Ph(120),gunCrack:Ph(45)}}_ready(){return this.ctx?!0:(this._warnedNotUnlocked||(console.warn("[AudioEngine] Call ignored — unlock() has not completed yet. Call `await audioEngine.unlock()` from a user-gesture handler before triggering audio."),this._warnedNotUnlocked=!0),!1)}_scheduleCleanup(e,t){if(!this.ctx)return;const n=Math.max(0,(t-this.ctx.currentTime)*1e3)+30,i=setTimeout(()=>{for(const s of e)if(s&&typeof s.disconnect=="function")try{s.disconnect()}catch{}this._cleanupTimers.delete(i)},n);this._cleanupTimers.add(i)}_rampGain(e,t,n=.05){const i=this.ctx.currentTime;e.cancelScheduledValues(i),e.setValueAtTime(e.value,i),e.linearRampToValueAtTime(t,i+n)}setMasterVolume(e){this._masterVolume=Qn(e),this.masterGain&&this._rampGain(this.masterGain.gain,this._masterVolume)}setMusicVolume(e){this._musicVolume=Qn(e),this.musicBus&&this._rampGain(this.musicBus.gain,this._musicVolume)}setSfxVolume(e){this._sfxVolume=Qn(e),this.sfxBus&&this._rampGain(this.sfxBus.gain,this._sfxVolume),this.ambienceBus&&this._rampGain(this.ambienceBus.gain,this._sfxVolume)}startOceanAmbience(e={}){return this._ready()?_T(this,e):null}startEngineHum(e=.3){return this._ready()?vT(this,Qn(e)):null}startWind(e=.3){return this._ready()?yT(this,Qn(e)):null}playDeckGunFire(e={}){this._ready()&&xT(this,e)}playMissileLaunch(e={}){this._ready()&&MT(this,e)}playCiwsBurst(e={}){this._ready()&&ST(this,e)}playTorpedoLaunch(e={}){this._ready()&&bT(this,e)}playExplosionSmall(e={}){this._ready()&&wT(this,e)}playExplosionLarge(e={}){this._ready()&&TT(this,e)}playSonarPing(e={}){this._ready()&&AT(this,e)}playRadarBlip(e={}){this._ready()&&ET(this,e)}playAlarmKlaxon(e={}){return this._ready()?DT(this,e):null}playUiClick(e={}){this._ready()&&CT(this,e)}playUiHover(e={}){this._ready()&&RT(this,e)}playUiConfirm(e={}){this._ready()&&PT(this,e)}playUiError(e={}){this._ready()&&IT(this,e)}playHitImpact(e={}){this._ready()&&LT(this,e)}playSplash(e={}){this._ready()&&NT(this,e)}playRadioBlip(e={}){this._ready()&&UT(this,e)}setListenerPosition(e,t,n){this.listener.setPosition(e,t,n)}setListenerOrientation(e,t){this.listener.setOrientation(e,t)}}function Xi(r,e,t){return Math.min(t,Math.max(e,r))}function FT(r,e,t){let n=(e-r+540)%360-180;return(r+n*t+360)%360}function cg(r){return(r%360+360)%360}function Wn(r,e={},t=[]){const n=document.createElement(r);if(e.class&&(n.className=e.class),e.html!==void 0&&(n.innerHTML=e.html),e.text!==void 0&&(n.textContent=e.text),e.attrs)for(const[i,s]of Object.entries(e.attrs))n.setAttribute(i,s);e.style&&Object.assign(n.style,e.style);for(const i of t)i&&n.appendChild(i);return n}function ho(r){const e=Math.round(cg(r));return String(e).padStart(3,"0")}function Zh(r){return r==null||Number.isNaN(r)?"--":r>=1e3?`${(r/1e3).toFixed(1)}km`:`${Math.round(r)}m`}const BT=["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];function op(r){const e=Math.round(cg(r)/22.5)%16;return BT[e]}const Ih={engine:"M4 12h3l2-5 3 10 2-7 2 4h4",radar:"M12 3v5m0 0a9 9 0 0 1 9 9M12 8a9 9 0 0 0-9 9M12 8a4.5 4.5 0 0 1 4.5 4.5M12 8a4.5 4.5 0 0 0-4.5 4.5",weapons:"M4 20l6-6m0 0l7-7 3 3-7 7m-3-3l3 3M15 5l4 4"};class kT{constructor(e={}){this.options={compassSpan:120,...e},this.root=null,this._mounted=!1,this._displayHeading=0,this._targetHeading=0,this._rafId=null,this._lastState={}}mount(e=document.getElementById("ui-root")){return this._mounted?this.root:(this.root=Wn("div",{class:"ship-hud"}),this.root.innerHTML=this._template(),e.appendChild(this.root),this._cache(),this._mounted=!0,this._tick(),this.root)}_template(){return`
      <div class="shud-compass hud-panel">
        <div class="shud-compass-tape"></div>
        <div class="shud-compass-center-marker"></div>
        <div class="shud-compass-readout">
          <span class="shud-heading-num">000</span><span class="shud-heading-deg">&deg;</span>
          <span class="shud-heading-label">N</span>
        </div>
      </div>

      <div class="shud-objective hud-panel">
        <div class="hud-corners"></div>
        <div class="shud-obj-icon">&#9670;</div>
        <div class="shud-obj-body">
          <div class="hud-label">Objective</div>
          <div class="shud-obj-text">Standing by</div>
        </div>
        <div class="shud-obj-nav">
          <div class="shud-obj-arrow">&#9650;</div>
          <div class="shud-obj-dist">--</div>
        </div>
      </div>

      <div class="shud-bottom-left">
        <div class="shud-hull-block hud-panel">
          <div class="hud-corners"></div>
          <div class="hud-label">Hull Integrity</div>
          <div class="shud-hull-row">
            <div class="shud-hull-bar"><div class="shud-hull-fill"></div></div>
            <div class="shud-hull-pct">100%</div>
          </div>
          <div class="shud-subsystems">
            <div class="shud-sys" data-sys="engine">
              <svg viewBox="0 0 24 24"><path d="${Ih.engine}"/></svg>
              <span>ENG</span>
            </div>
            <div class="shud-sys" data-sys="radar">
              <svg viewBox="0 0 24 24"><path d="${Ih.radar}"/></svg>
              <span>RDR</span>
            </div>
            <div class="shud-sys" data-sys="weapons">
              <svg viewBox="0 0 24 24"><path d="${Ih.weapons}"/></svg>
              <span>WPN</span>
            </div>
          </div>
        </div>

        <div class="shud-speed-block hud-panel">
          <div class="hud-corners"></div>
          <div class="hud-label">Speed / Throttle</div>
          <div class="shud-speed-row">
            <div class="shud-speed-num">0.0</div>
            <div class="shud-speed-unit">KTS</div>
          </div>
          <div class="shud-throttle-bar">
            <div class="shud-throttle-zero"></div>
            <div class="shud-throttle-fill"></div>
          </div>
        </div>
      </div>

      <div class="shud-bottom-right">
        <div class="shud-weapon-block hud-panel">
          <div class="hud-corners"></div>
          <div class="shud-weapon-name">--</div>
          <div class="shud-weapon-row">
            <div class="shud-ammo-pips"></div>
            <div class="shud-ammo-count">0/0</div>
          </div>
          <div class="shud-weapon-status">STANDBY</div>
        </div>
      </div>

      <div class="shud-reticle" hidden>
        <svg viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="36" class="ret-ring"/>
          <line x1="60" y1="4" x2="60" y2="26" class="ret-tick"/>
          <line x1="60" y1="94" x2="60" y2="116" class="ret-tick"/>
          <line x1="4" y1="60" x2="26" y2="60" class="ret-tick"/>
          <line x1="94" y1="60" x2="116" y2="60" class="ret-tick"/>
          <circle cx="60" cy="60" r="2.2" class="ret-dot"/>
        </svg>
      </div>
    `}_cache(){const e=t=>this.root.querySelector(t);this.el={compassTape:e(".shud-compass-tape"),headingNum:e(".shud-heading-num"),headingLabel:e(".shud-heading-label"),objText:e(".shud-obj-text"),objArrow:e(".shud-obj-arrow"),objNav:e(".shud-obj-nav"),objDist:e(".shud-obj-dist"),hullFill:e(".shud-hull-fill"),hullPct:e(".shud-hull-pct"),hullBlock:e(".shud-hull-block"),speedNum:e(".shud-speed-num"),throttleFill:e(".shud-throttle-fill"),weaponName:e(".shud-weapon-name"),ammoPips:e(".shud-ammo-pips"),ammoCount:e(".shud-ammo-count"),weaponStatus:e(".shud-weapon-status"),weaponBlock:e(".shud-weapon-block"),reticle:e(".shud-reticle"),sysNodes:{engine:e('.shud-sys[data-sys="engine"]'),radar:e('.shud-sys[data-sys="radar"]'),weapons:e('.shud-sys[data-sys="weapons"]')}}}_tick(){if(this._rafId=requestAnimationFrame(()=>this._tick()),!this._mounted)return;const e=(this._targetHeading-this._displayHeading+540)%360-180;Math.abs(e)>.05&&(this._displayHeading=FT(this._displayHeading,this._targetHeading,.18),this._renderCompass(this._displayHeading))}_renderCompass(e){const t=this.options.compassSpan,n=this.el.compassTape.parentElement.clientWidth/t||4,i=[],s=Math.floor((e-t/2)/15)*15;for(let o=s;o<=e+t/2+15;o+=15){const a=(o%360+360)%360,l=(o-e)*n,c=a%90===0,h=a%45===0?op(a):a%15===0?ho(a):"";i.push(`<div class="shud-tick ${c?"major":""}" style="left:calc(50% + ${l}px)">
        <span class="shud-tick-line"></span>
        ${h?`<span class="shud-tick-label">${h}</span>`:""}
      </div>`)}this.el.compassTape.innerHTML=i.join(""),this.el.headingNum.textContent=ho(e),this.el.headingLabel.textContent=op(e)}update(e={}){if(!this._mounted)return;const t={...this._lastState,...e};if(this._lastState=t,typeof e.heading=="number"&&(this._targetHeading=(e.heading%360+360)%360),typeof t.speedKnots=="number"&&(this.el.speedNum.textContent=t.speedKnots.toFixed(1)),typeof t.throttleFraction=="number"){const n=Xi(t.throttleFraction,-1,1),i=Math.abs(n)*50;this.el.throttleFill.style.width=`${i}%`,this.el.throttleFill.style.left=n>=0?"50%":`${50-i}%`,this.el.throttleFill.classList.toggle("reverse",n<0)}if(typeof t.hullPct=="number"){const n=Xi(t.hullPct,0,100);this.el.hullFill.style.width=`${n}%`,this.el.hullPct.textContent=`${Math.round(n)}%`,this.el.hullBlock.classList.toggle("critical",n<=25),this.el.hullBlock.classList.toggle("warning",n>25&&n<=50)}if(t.subsystems)for(const[n,i]of Object.entries(this.el.sysNodes)){const s=t.subsystems[n];s&&(i.classList.remove("nominal","damaged","destroyed"),i.classList.add(s))}if(t.objective){this.el.objText.textContent=t.objective.text||"";const n=t.objective.bearing!=null;this.el.objNav.style.display=n?"":"none",n&&(this.el.objArrow.style.transform=`rotate(${t.objective.bearing}deg)`,this.el.objDist.textContent=Zh(t.objective.distanceM))}if(t.selectedWeapon){const n=t.selectedWeapon;this.el.weaponName.textContent=n.name||"--",this.el.ammoCount.textContent=`${n.ammo??0}/${n.maxAmmo??0}`,this._renderAmmoPips(n.ammo??0,n.maxAmmo??0),this.el.weaponStatus.textContent=n.ready?"READY":"RELOADING",this.el.weaponBlock.classList.toggle("not-ready",!n.ready)}}_renderAmmoPips(e,t){const n=Math.min(t||0,24),i=t>0?Math.round(e/t*n):0;let s="";for(let o=0;o<n;o++)s+=`<span class="shud-pip ${o<i?"filled":""}"></span>`;this.el.ammoPips.innerHTML=s}setAiming(e){this.el&&(this.el.reticle.hidden=!e)}show(){this.root&&this.root.classList.remove("shud-hidden")}hide(){this.root&&this.root.classList.add("shud-hidden")}dispose(){this._rafId&&cancelAnimationFrame(this._rafId),this.root&&this.root.parentElement&&this.root.parentElement.removeChild(this.root),this.root=null,this._mounted=!1}}const ap=4,zT=4.2,HT=70,GT=550,VT=400,WT=900,lp={friendly:"#3dffa0",hostile:"#ff4444",unknown:"#ffb02e"};class qT{constructor(e={}){this.options={northUp:!1,size:260,...e},this.onSelectContact=e.onSelectContact||null,this.root=null,this.canvas=null,this.ctx=null,this._mounted=!1,this._dpr=Math.min(window.devicePixelRatio||1,2),this._sweepAngle=0,this._stopTicker=null,this._data={rangeM:5e3,playerHeading:0,contacts:[]},this._contactState=new Map,this._hitTargets=[],this._northUp=this.options.northUp,this._onResize=this._onResize.bind(this),this._onClick=this._onClick.bind(this)}mount(e=document.getElementById("ui-root")){if(this._mounted)return this.root;this.root=Wn("div",{class:"tac-radar hud-panel"}),this.root.innerHTML=`
      <div class="hud-corners"></div>
      <div class="tac-radar-header">
        <span class="hud-label">Tactical</span>
        <span class="tac-radar-mode" title="Toggle orientation">${this._northUp?"NORTH UP":"HDG UP"}</span>
      </div>
      <canvas class="tac-radar-canvas"></canvas>
      <div class="tac-radar-range hud-label">RNG --</div>
    `,this.root.style.setProperty("--radar-size",`${this.options.size}px`),e.appendChild(this.root),this.canvas=this.root.querySelector(".tac-radar-canvas"),this.ctx=this.canvas.getContext("2d"),this._modeLabel=this.root.querySelector(".tac-radar-mode"),this._rangeLabel=this.root.querySelector(".tac-radar-range"),this._modeLabel.addEventListener("click",()=>this.setNorthUp(!this._northUp)),this.canvas.addEventListener("click",this._onClick),window.addEventListener("resize",this._onResize),this._resizeCanvas(),this._mounted=!0;let t=performance.now();const n=i=>{const s=Math.min((i-t)/1e3,.1);t=i,this._sweepAngle=(this._sweepAngle+s/zT*Math.PI*2)%(Math.PI*2),this._render(),this._rafId=requestAnimationFrame(n)};return this._rafId=requestAnimationFrame(n),this.root}_resizeCanvas(){const e=this.options.size;this.canvas.width=e*this._dpr,this.canvas.height=e*this._dpr,this.canvas.style.width=`${e}px`,this.canvas.style.height=`${e}px`,this.ctx.setTransform(this._dpr,0,0,this._dpr,0,0)}_onResize(){const e=Math.min(window.devicePixelRatio||1,2);e!==this._dpr&&(this._dpr=e,this._resizeCanvas())}update(e={}){if(e.rangeM!=null&&(this._data.rangeM=e.rangeM),e.playerHeading!=null&&(this._data.playerHeading=e.playerHeading),this._rangeLabel&&(this._rangeLabel.textContent=`RNG ${this._formatRange(this._data.rangeM)}`),e.contacts){const t=new Set,n=performance.now();for(const i of e.contacts){t.add(i.id);let s=this._contactState.get(i.id);s||(s={appearedAt:n,removing:!1},this._contactState.set(i.id,s)),s.data=i,s.removing=!1}for(const[i,s]of this._contactState.entries())!t.has(i)&&!s.removing&&(s.removing=!0,s.removedAt=n)}}_formatRange(e){return e>=1e3?`${(e/1e3).toFixed(1)}KM`:`${Math.round(e)}M`}_onClick(e){const t=this.canvas.getBoundingClientRect(),n=e.clientX-t.left,i=e.clientY-t.top;let s=null,o=1/0;for(const a of this._hitTargets){const l=Math.hypot(n-a.x,i-a.y);l<=Math.max(a.r,10)&&l<o&&(s=a,o=l)}s&&this.onSelectContact&&this.onSelectContact(s.id)}setNorthUp(e){this._northUp=e,this._modeLabel&&(this._modeLabel.textContent=e?"NORTH UP":"HDG UP")}_render(){const e=this.ctx,t=this.options.size,n=t/2,i=t/2,s=t/2-14;e.clearRect(0,0,t,t);const o=this._northUp?0:-this._data.playerHeading;this._drawRings(e,n,i,s),this._drawSweep(e,n,i,s),this._drawOwnShip(e,n,i,o),this._hitTargets=[],this._drawContacts(e,n,i,s,o)}_drawRings(e,t,n,i){e.save(),e.strokeStyle="rgba(120,210,230,0.28)",e.fillStyle="rgba(130,220,235,0.55)",e.font="9px var(--font-mono), monospace",e.lineWidth=1;for(let s=1;s<=ap;s++){const o=i*s/ap;e.beginPath(),e.arc(t,n,o,0,Math.PI*2),e.stroke()}e.beginPath(),e.moveTo(t-i,n),e.lineTo(t+i,n),e.moveTo(t,n-i),e.lineTo(t,n+i),e.strokeStyle="rgba(120,210,230,0.14)",e.stroke(),e.restore()}_drawSweep(e,t,n,i){e.save(),e.translate(t,n);const s=HT*Math.PI/180,o=e.createConicGradient?e.createConicGradient(this._sweepAngle-s,0,0):null;if(o)o.addColorStop(0,"rgba(77,232,255,0)"),o.addColorStop(1,"rgba(77,232,255,0.28)"),e.fillStyle=o,e.beginPath(),e.moveTo(0,0),e.arc(0,0,i,this._sweepAngle-s,this._sweepAngle),e.closePath(),e.fill();else for(let l=0;l<14;l++){const c=this._sweepAngle-s+s*l/14,h=this._sweepAngle-s+s*(l+1)/14;e.beginPath(),e.moveTo(0,0),e.arc(0,0,i,c,h),e.closePath(),e.fillStyle=`rgba(77,232,255,${.28*l/14})`,e.fill()}e.strokeStyle="rgba(77,232,255,0.9)",e.lineWidth=1.5,e.beginPath(),e.moveTo(0,0),e.lineTo(i*Math.cos(this._sweepAngle),i*Math.sin(this._sweepAngle)),e.stroke(),e.restore()}_drawOwnShip(e,t,n,i){e.save(),e.translate(t,n);const s=this._northUp?(this._data.playerHeading||0)*Math.PI/180:0;e.rotate(s),e.fillStyle="#ffb02e",e.beginPath(),e.moveTo(0,-8),e.lineTo(5,6),e.lineTo(0,3),e.lineTo(-5,6),e.closePath(),e.fill(),e.restore()}_drawContacts(e,t,n,i,s){const o=performance.now(),a=this._data.rangeM||1,l=[];for(const[c,h]of this._contactState.entries()){const u=h.data;if(!u)continue;let d=1;if(h.removing){const A=Xi((o-h.removedAt)/VT,0,1);if(d=1-A,A>=1){this._contactState.delete(c);continue}}else d=Xi((o-h.appearedAt)/GT,0,1);const f=Math.hypot(u.x,u.z),m=(Math.atan2(u.x,u.z)*180/Math.PI+s-90)*Math.PI/180,g=Xi(f/a,0,1)*i,y=t+g*Math.cos(m),v=n+g*Math.sin(m),x=lp[u.iff]||lp.unknown,R=h.removing?1:.5+.5*d;if(e.save(),e.globalAlpha=d,e.translate(y,v),e.scale(R,R),e.strokeStyle=x,e.fillStyle=x,e.lineWidth=1.4,e.shadowColor=x,e.shadowBlur=6,this._drawContactGlyph(e,u.domain),u.selected&&(e.shadowBlur=0,e.strokeStyle="rgba(255,255,255,0.85)",e.lineWidth=1,e.beginPath(),e.arc(0,0,9,0,Math.PI*2),e.stroke()),!h.removing){const A=(o-h.appearedAt)/WT;A>=0&&A<=1&&(e.shadowBlur=0,e.globalAlpha=d*(1-A),e.beginPath(),e.arc(0,0,4+A*16,0,Math.PI*2),e.strokeStyle=x,e.stroke())}e.restore(),u.name&&l.push({name:u.name,x:y+8,y:v-6,color:x,alpha:d}),this._hitTargets.push({id:c,x:y,y:v,r:10})}this._drawLabelsWithoutOverlap(e,l)}_drawLabelsWithoutOverlap(e,t){e.save(),e.font="9px var(--font-mono), monospace";const n=11,i=[];for(const s of t){const o=e.measureText(s.name).width+4;let a=s.y,l=0;for(;l<8&&i.some(h=>Math.abs(h.x-s.x)<(o+h.w)/2&&Math.abs(h.y-a)<n);)a+=n,l++;i.push({x:s.x,y:a,w:o}),e.globalAlpha=s.alpha,e.fillStyle=s.color,e.fillText(s.name,s.x,a)}e.restore()}_drawContactGlyph(e,t){e.beginPath(),t==="air"?(e.moveTo(0,-6),e.lineTo(5,0),e.lineTo(0,6),e.lineTo(-5,0),e.closePath(),e.stroke()):t==="subsurface"?(e.setLineDash([2,2]),e.arc(0,0,5,0,Math.PI*2),e.stroke(),e.setLineDash([])):(e.moveTo(0,-6),e.lineTo(5.5,5),e.lineTo(-5.5,5),e.closePath(),e.stroke())}show(){this.root&&this.root.classList.remove("tac-radar-hidden")}hide(){this.root&&this.root.classList.add("tac-radar-hidden")}setStationFocus(e){if(!this.root)return;const t=e?420:260;this.options.size=t,this.root.style.setProperty("--radar-size",`${t}px`),this.root.classList.toggle("stn-radar-focus",!!e),this._resizeCanvas()}dispose(){this._rafId&&cancelAnimationFrame(this._rafId),window.removeEventListener("resize",this._onResize),this.canvas&&this.canvas.removeEventListener("click",this._onClick),this.root&&this.root.parentElement&&this.root.parentElement.removeChild(this.root),this.root=null,this._mounted=!1,this._contactState.clear()}}class XT{constructor(e={}){this.options=e,this.root=null,this.bgSlot=null,this._mounted=!1}mount(e=document.getElementById("ui-root")){if(this._mounted)return this.root;this.root=Wn("div",{class:"meridian-menu main-menu"}),this.root.innerHTML=`
      <div class="menu-bg-slot"></div>
      <div class="menu-bg-fallback">
        <div class="menu-grid"></div>
        <div class="menu-horizon-glow"></div>
      </div>
      <div class="hud-scanlines"></div>

      <div class="menu-content">
        <div class="menu-title-block">
          <div class="menu-eyebrow hud-label">Naval Task Force</div>
          <h1 class="menu-title">MERIDIAN</h1>
          <div class="menu-title-rule"></div>
        </div>

        <nav class="menu-nav">
          <button class="meridian-btn" data-action="newPatrol" style="--i:0">
            <span class="meridian-btn-index">01</span>
            <span class="meridian-btn-label">New Patrol</span>
          </button>
          <button class="meridian-btn" data-action="continue" style="--i:1">
            <span class="meridian-btn-index">02</span>
            <span class="meridian-btn-label">Continue</span>
          </button>
          <button class="meridian-btn" data-action="multiplayer" style="--i:2">
            <span class="meridian-btn-index">03</span>
            <span class="meridian-btn-label">Multiplayer</span>
          </button>
          <button class="meridian-btn" data-action="settings" style="--i:3">
            <span class="meridian-btn-index">04</span>
            <span class="meridian-btn-label">Settings</span>
          </button>
          <button class="meridian-btn" data-action="credits" style="--i:4">
            <span class="meridian-btn-index">05</span>
            <span class="meridian-btn-label">Credits</span>
          </button>
        </nav>

        <div class="menu-footer hud-label">Task Force Command &middot; Build 1.0</div>
      </div>
    `,e.appendChild(this.root),this.bgSlot=this.root.querySelector(".menu-bg-slot"),this.options.backgroundCanvas&&(this.bgSlot.appendChild(this.options.backgroundCanvas),this.options.backgroundCanvas.classList.add("menu-bg-injected"),this.root.querySelector(".menu-bg-fallback").style.display="none");const t=this.root.querySelector('[data-action="continue"]');return this.options.continueEnabled===!1&&(t.classList.add("disabled"),t.setAttribute("aria-disabled","true")),this.root.querySelector('[data-action="newPatrol"]').addEventListener("click",()=>this.options.onNewPatrol?.()),t.addEventListener("click",()=>{this.options.continueEnabled!==!1&&this.options.onContinue?.()}),this.root.querySelector('[data-action="multiplayer"]').addEventListener("click",()=>this.options.onMultiplayer?.()),this.root.querySelector('[data-action="settings"]').addEventListener("click",()=>this.options.onSettings?.()),this.root.querySelector('[data-action="credits"]').addEventListener("click",()=>this.options.onCredits?.()),this._mounted=!0,this.root}update(e={}){this._mounted&&typeof e.continueEnabled=="boolean"&&(this.root.querySelector('[data-action="continue"]').classList.toggle("disabled",!e.continueEnabled),this.options.continueEnabled=e.continueEnabled)}show(){this.root&&(this.root.classList.remove("menu-hidden"),this.root.classList.remove("menu-play-in"),this.root.offsetWidth,this.root.classList.add("menu-play-in"))}hide(){this.root&&this.root.classList.add("menu-hidden")}dispose(){this.root&&this.root.parentElement&&this.root.parentElement.removeChild(this.root),this.root=null,this.bgSlot=null,this._mounted=!1}}class YT{constructor(e={}){this.options=e,this.root=null,this._mounted=!1}mount(e=document.getElementById("ui-root")){return this._mounted?this.root:(this.root=Wn("div",{class:"meridian-menu pause-menu menu-hidden"}),this.root.innerHTML=`
      <div class="pause-scrim"></div>
      <div class="menu-content pause-content">
        <div class="menu-title-block pause-title-block">
          <div class="menu-eyebrow hud-label">Task Paused</div>
          <h2 class="pause-title">STANDING BY</h2>
          <div class="menu-title-rule"></div>
        </div>
        <nav class="menu-nav">
          <button class="meridian-btn" data-action="resume" style="--i:0">
            <span class="meridian-btn-index">01</span>
            <span class="meridian-btn-label">Resume</span>
          </button>
          <button class="meridian-btn" data-action="settings" style="--i:1">
            <span class="meridian-btn-index">02</span>
            <span class="meridian-btn-label">Settings</span>
          </button>
          <button class="meridian-btn meridian-btn-danger" data-action="quit" style="--i:2">
            <span class="meridian-btn-index">03</span>
            <span class="meridian-btn-label">Quit to Main Menu</span>
          </button>
        </nav>
      </div>
    `,e.appendChild(this.root),this.root.querySelector('[data-action="resume"]').addEventListener("click",()=>this.options.onResume?.()),this.root.querySelector('[data-action="settings"]').addEventListener("click",()=>this.options.onSettings?.()),this.root.querySelector('[data-action="quit"]').addEventListener("click",()=>this.options.onQuitToMainMenu?.()),this._mounted=!0,this.root)}update(){}show(){this.root&&(this.root.classList.remove("menu-hidden"),this.root.classList.remove("menu-play-in"),this.root.offsetWidth,this.root.classList.add("menu-play-in"))}hide(){this.root&&this.root.classList.add("menu-hidden")}dispose(){this.root&&this.root.parentElement&&this.root.parentElement.removeChild(this.root),this.root=null,this._mounted=!1}}const KT={masterVolume:80,musicVolume:70,sfxVolume:85,mouseSensitivity:50,graphicsQuality:"high",invertY:!1},$T=["low","medium","high","ultra"];class ZT{constructor(e={}){this.options=e,this.values={...KT,...e.initialValues||{}},this.root=null,this._mounted=!1}mount(e=document.getElementById("ui-root")){return this._mounted?this.root:(this.root=Wn("div",{class:"meridian-menu settings-panel menu-hidden"}),this.root.innerHTML=`
      <div class="pause-scrim"></div>
      <div class="menu-content settings-content hud-panel">
        <div class="hud-corners"></div>
        <div class="settings-header">
          <div>
            <div class="menu-eyebrow hud-label">System</div>
            <h2 class="settings-title">SETTINGS</h2>
          </div>
          <button class="settings-close" data-action="close" aria-label="Close settings">&times;</button>
        </div>
        <div class="menu-title-rule"></div>

        <div class="settings-body">
          <div class="settings-group">
            <div class="hud-label settings-group-title">Audio</div>
            ${this._sliderRow("masterVolume","Master Volume")}
            ${this._sliderRow("musicVolume","Music Volume")}
            ${this._sliderRow("sfxVolume","SFX Volume")}
          </div>

          <div class="settings-group">
            <div class="hud-label settings-group-title">Controls</div>
            ${this._sliderRow("mouseSensitivity","Mouse Sensitivity")}
            ${this._toggleRow("invertY","Invert Y-Axis")}
          </div>

          <div class="settings-group">
            <div class="hud-label settings-group-title">Graphics</div>
            <div class="settings-row">
              <label class="settings-row-label">Quality</label>
              <div class="settings-segmented" data-key="graphicsQuality">
                ${$T.map(t=>`<button class="settings-seg-btn" data-value="${t}">${t}</button>`).join("")}
              </div>
            </div>
          </div>
        </div>
      </div>
    `,e.appendChild(this.root),this._wire(),this._syncControls(),this._mounted=!0,this.root)}_sliderRow(e,t){return`
      <div class="settings-row" data-key="${e}">
        <label class="settings-row-label">${t}</label>
        <div class="settings-slider-wrap">
          <input type="range" min="0" max="100" step="1" class="settings-slider" data-key="${e}" />
          <span class="settings-slider-val" data-key-val="${e}">0</span>
        </div>
      </div>
    `}_toggleRow(e,t){return`
      <div class="settings-row" data-key="${e}">
        <label class="settings-row-label">${t}</label>
        <button class="settings-toggle" data-key="${e}" role="switch" aria-checked="false">
          <span class="settings-toggle-knob"></span>
        </button>
      </div>
    `}_wire(){this.root.querySelectorAll(".settings-slider").forEach(t=>{t.addEventListener("input",()=>{const n=t.dataset.key,i=Number(t.value);this.values[n]=i,this.root.querySelector(`[data-key-val="${n}"]`).textContent=i,this.options.onChange?.(n,i)})}),this.root.querySelectorAll(".settings-toggle").forEach(t=>{t.addEventListener("click",()=>{const n=t.dataset.key,i=!this.values[n];this.values[n]=i,t.classList.toggle("on",i),t.setAttribute("aria-checked",String(i)),this.options.onChange?.(n,i)})});const e=this.root.querySelector(".settings-segmented");e.querySelectorAll(".settings-seg-btn").forEach(t=>{t.addEventListener("click",()=>{const n=t.dataset.value;this.values.graphicsQuality=n,e.querySelectorAll(".settings-seg-btn").forEach(i=>i.classList.toggle("active",i===t)),this.options.onChange?.("graphicsQuality",n)})}),this.root.querySelector('[data-action="close"]').addEventListener("click",()=>this.options.onClose?.())}_syncControls(){for(const n of["masterVolume","musicVolume","sfxVolume","mouseSensitivity"]){const i=this.root.querySelector(`.settings-slider[data-key="${n}"]`);i.value=this.values[n],this.root.querySelector(`[data-key-val="${n}"]`).textContent=this.values[n]}const e=this.root.querySelector('.settings-toggle[data-key="invertY"]');e.classList.toggle("on",!!this.values.invertY),e.setAttribute("aria-checked",String(!!this.values.invertY)),this.root.querySelector(".settings-segmented").querySelectorAll(".settings-seg-btn").forEach(n=>{n.classList.toggle("active",n.dataset.value===this.values.graphicsQuality)})}setValues(e={}){this.values={...this.values,...e},this._mounted&&this._syncControls()}update(e={}){this.setValues(e)}show(){this.root&&(this.root.classList.remove("menu-hidden"),this.root.classList.remove("menu-play-in"),this.root.offsetWidth,this.root.classList.add("menu-play-in"))}hide(){this.root&&this.root.classList.add("menu-hidden")}dispose(){this.root&&this.root.parentElement&&this.root.parentElement.removeChild(this.root),this.root=null,this._mounted=!1}}const cp={normal:4500,warning:6e3,critical:1/0};let JT=0;class jT{constructor(e={}){this.options={maxVisible:6,...e},this.root=null,this.stack=null,this._mounted=!1,this._timers=new Map}mount(e=document.getElementById("ui-root")){return this._mounted?this.root:(this.root=Wn("div",{class:"comms-log"}),this.stack=Wn("div",{class:"comms-stack"}),this.root.appendChild(this.stack),e.appendChild(this.root),this._mounted=!0,this.root)}update(){}push(e={}){if(!this._mounted)return null;const t=`comms-${++JT}`,n=e.urgency||"normal",i=e.durationMs??cp[n]??cp.normal,s=Wn("div",{class:`comms-card urgency-${n}`,attrs:{"data-id":t}});if(s.innerHTML=`
      <div class="comms-card-accent"></div>
      <div class="comms-card-body">
        <div class="comms-meta">
          <span class="comms-speaker">${this._escape(e.speaker||"COMMS")}</span>
          ${n!=="normal"?`<span class="comms-urgency-tag">${n}</span>`:""}
        </div>
        <div class="comms-text">${this._escape(e.text||"")}</div>
      </div>
      <button class="comms-dismiss" aria-label="Dismiss">&times;</button>
    `,s.querySelector(".comms-dismiss").addEventListener("click",()=>this.dismiss(t)),this.stack.appendChild(s),requestAnimationFrame(()=>s.classList.add("comms-in")),Number.isFinite(i)){const o=setTimeout(()=>this.dismiss(t),i);this._timers.set(t,o)}return this._trimOverflow(),t}_trimOverflow(){const e=this.stack.querySelectorAll(".comms-card"),t=e.length-this.options.maxVisible;for(let n=0;n<t;n++){const i=e[n].dataset.id;this.dismiss(i)}}dismiss(e){const t=this.stack?.querySelector(`[data-id="${e}"]`);if(!t)return;const n=this._timers.get(e);n&&(clearTimeout(n),this._timers.delete(e)),t.classList.remove("comms-in"),t.classList.add("comms-out"),t.addEventListener("animationend",()=>t.remove(),{once:!0}),setTimeout(()=>t.remove(),500)}clear(){if(this.stack){for(const e of this._timers.values())clearTimeout(e);this._timers.clear(),this.stack.innerHTML=""}}_escape(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}show(){this.root&&this.root.classList.remove("comms-hidden")}hide(){this.root&&this.root.classList.add("comms-hidden")}dispose(){this.clear(),this.root&&this.root.parentElement&&this.root.parentElement.removeChild(this.root),this.root=null,this.stack=null,this._mounted=!1}}class QT{constructor(e={}){this.options=e,this.root=null,this._mounted=!1,this._hullPct=100,this._flashTimer=null}mount(e=document.getElementById("ui-root")){return this._mounted?this.root:(this.root=Wn("div",{class:"damage-vignette"}),this.root.innerHTML=`
      <div class="dv-base"></div>
      <div class="dv-flash"></div>
    `,e.appendChild(this.root),this._base=this.root.querySelector(".dv-base"),this._flash=this.root.querySelector(".dv-flash"),this._mounted=!0,this._applyHullState(),this.root)}update(e={}){typeof e.hullPct=="number"&&this.setHullPct(e.hullPct)}setHullPct(e){this._hullPct=Xi(e,0,100),this._applyHullState()}_applyHullState(){if(!this._mounted)return;const e=Xi((60-this._hullPct)/60,0,1);this._base.style.setProperty("--dv-base-alpha",e.toFixed(3)),this.root.classList.toggle("dv-critical",this._hullPct<=25)}flashHit(e=.5){if(!this._mounted)return;const t=Xi(e,0,1);this._flash.style.setProperty("--dv-flash-alpha",(.25+t*.55).toFixed(3)),this._flash.classList.remove("dv-flash-play"),this._flash.offsetWidth,this._flash.classList.add("dv-flash-play")}show(){this.root&&this.root.classList.remove("dv-hidden")}hide(){this.root&&this.root.classList.add("dv-hidden")}dispose(){this._flashTimer&&clearTimeout(this._flashTimer),this.root&&this.root.parentElement&&this.root.parentElement.removeChild(this.root),this.root=null,this._mounted=!1}}const hp=[{key:"gun",digit:"1",name:"130mm Deck Gun",infinite:!0},{key:"missile",digit:"2",name:"Anti-Ship Missile",ammoKey:"missile"},{key:"torpedo",digit:"3",name:"ASROC Torpedo",ammoKey:"torpedo"},{key:"drone",digit:"4",name:"Recon Drone",ammoKey:"drone"}],eA=[{max:-.55,label:"FULL ASTERN"},{max:-.15,label:"SLOW ASTERN"},{max:.08,label:"ALL STOP"},{max:.35,label:"SLOW AHEAD"},{max:.7,label:"HALF AHEAD"},{max:2,label:"FLANK SPEED"}];function tA(r){for(const e of eA)if(r<=e.max)return e.label;return"FLANK SPEED"}class nA{constructor(){this.root=null,this._mounted=!1,this._station=null,this._panels={}}mount(e=document.getElementById("ui-root")){if(this._mounted)return this.root;this.root=Wn("div",{class:"station-overlay"}),this.root.innerHTML=`
      <div class="stn-chrome"></div>
      <div class="stn-topbar hud-panel">
        <div class="hud-corners"></div>
        <div class="stn-title" data-stn="title">—</div>
        <div class="stn-hint" data-stn="hint"></div>
      </div>

      <div class="stn-panel" data-panel="HELM" hidden>
        <div class="stn-helm-cluster">
          <div class="stn-gauge hud-panel">
            <div class="hud-corners"></div>
            <div class="hud-label">Heading</div>
            <div class="stn-gauge-value" data-helm="heading">000</div>
            <div class="stn-gauge-unit" data-helm="heading-label">N</div>
          </div>
          <div class="stn-telegraph hud-panel">
            <div class="hud-corners"></div>
            <div class="hud-label">Engine Order</div>
            <div class="stn-telegraph-track">
              <div class="stn-telegraph-zero"></div>
              <div class="stn-telegraph-fill" data-helm="throttle-fill"></div>
            </div>
            <div class="stn-order" data-helm="order">ALL STOP</div>
            <div class="stn-rudder">
              <span>PORT</span>
              <div class="stn-rudder-needle"><i data-helm="rudder"></i></div>
              <span>STBD</span>
            </div>
          </div>
          <div class="stn-gauge hud-panel">
            <div class="hud-corners"></div>
            <div class="hud-label">Speed</div>
            <div class="stn-gauge-value" data-helm="speed">0.0</div>
            <div class="stn-gauge-unit">KTS</div>
          </div>
        </div>
      </div>

      <div class="stn-panel" data-panel="WEAPONS" hidden>
        <div class="stn-weapons-reticle" aria-hidden="true">
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="38"/>
            <circle cx="60" cy="60" r="8"/>
            <line x1="60" y1="6" x2="60" y2="28"/>
            <line x1="60" y1="92" x2="60" y2="114"/>
            <line x1="6" y1="60" x2="28" y2="60"/>
            <line x1="92" y1="60" x2="114" y2="60"/>
          </svg>
        </div>
        <div class="stn-weapons-rack" data-wpn="rack"></div>
        <div class="stn-target-panel hud-panel">
          <div class="hud-corners"></div>
          <div class="hud-label">Tracked Contact</div>
          <div class="stn-target-name" data-wpn="target-name">NO TARGET</div>
          <div class="stn-target-meta">
            <div>BRG <strong data-wpn="brg">---</strong></div>
            <div>RNG <strong data-wpn="rng">---</strong></div>
            <div>DOM <strong data-wpn="domain">---</strong></div>
            <div>IFF <strong data-wpn="iff">---</strong></div>
          </div>
          <div class="stn-fire-status is-notarget" data-wpn="fire">SELECT TARGET · TAB</div>
        </div>
      </div>

      <div class="stn-panel" data-panel="RADAR" hidden>
        <div class="stn-radar-side">
          <div class="stn-contact-list hud-panel">
            <div class="hud-corners"></div>
            <div class="hud-label">Contact Track</div>
            <div class="stn-contact-list-body" data-rdr="list"></div>
          </div>
          <div class="stn-sonar-panel hud-panel">
            <div class="hud-corners"></div>
            <div class="hud-label">Active Sonar</div>
            <div class="stn-hint" style="margin-top:6px"><kbd>Q</kbd> Ping subsurface contacts</div>
            <div class="stn-sonar-pulse" data-rdr="sonar"><i></i></div>
          </div>
        </div>
      </div>

      <div class="stn-panel" data-panel="LOOKOUT" hidden>
        <div class="stn-lookout-frame"></div>
        <div class="stn-lookout-cross"></div>
        <div class="stn-lookout-readout hud-panel" data-look="readout">
          BINOCULAR STATION · SCROLL TO ZOOM · E TO STAND
        </div>
      </div>
    `,e.appendChild(this.root),this._title=this.root.querySelector('[data-stn="title"]'),this._hint=this.root.querySelector('[data-stn="hint"]');for(const t of this.root.querySelectorAll(".stn-panel"))this._panels[t.dataset.panel]=t;return this._helm={heading:this.root.querySelector('[data-helm="heading"]'),headingLabel:this.root.querySelector('[data-helm="heading-label"]'),speed:this.root.querySelector('[data-helm="speed"]'),fill:this.root.querySelector('[data-helm="throttle-fill"]'),order:this.root.querySelector('[data-helm="order"]'),rudder:this.root.querySelector('[data-helm="rudder"]')},this._wpn={rack:this.root.querySelector('[data-wpn="rack"]'),targetName:this.root.querySelector('[data-wpn="target-name"]'),brg:this.root.querySelector('[data-wpn="brg"]'),rng:this.root.querySelector('[data-wpn="rng"]'),domain:this.root.querySelector('[data-wpn="domain"]'),iff:this.root.querySelector('[data-wpn="iff"]'),fire:this.root.querySelector('[data-wpn="fire"]')},this._rdr={list:this.root.querySelector('[data-rdr="list"]'),sonar:this.root.querySelector('[data-rdr="sonar"]')},this._look={readout:this.root.querySelector('[data-look="readout"]')},this._mounted=!0,this.root}setStation(e){if(!this._mounted)return;const t=e&&e!=="WALK"?e:null;this._station=t,this.root.classList.toggle("is-active",!!t),this.root.setAttribute("aria-hidden",t?"false":"true");for(const[i,s]of Object.entries(this._panels))s.hidden=i!==t;const n=iA[t];n&&(this._title.textContent=n.title,this._hint.innerHTML=n.hint)}get station(){return this._station}update(e={}){!this._mounted||!this._station||(this._station==="HELM"?this._updateHelm(e):this._station==="WEAPONS"?this._updateWeapons(e):this._station==="RADAR"?this._updateRadar(e):this._station==="LOOKOUT"&&this._updateLookout(e))}triggerSonarPulse(){this._rdr.sonar&&(this._rdr.sonar.classList.remove("is-active"),this._rdr.sonar.offsetWidth,this._rdr.sonar.classList.add("is-active"))}_updateHelm(e){const t=(e.heading%360+360)%360;this._helm.heading.textContent=ho(t),this._helm.headingLabel.textContent=sA(t),this._helm.speed.textContent=(e.speedKnots??0).toFixed(1);const n=Math.max(-1,Math.min(1,e.throttleFraction??0)),i=Math.abs(n)*50;this._helm.fill.style.width=`${i}%`,this._helm.fill.style.left=n>=0?"50%":`${50-i}%`,this._helm.fill.classList.toggle("reverse",n<0),this._helm.order.textContent=tA(n);const s=Math.max(-1,Math.min(1,e.rudder??0));this._helm.rudder.style.transform=`translateX(${s*32}px)`}_updateWeapons(e){const t=e.ammo||{},n=e.selectedWeapon||"gun",i=!!e.weaponReady;let s="";for(const l of hp){const c=l.infinite?"∞":String(t[l.ammoKey]??0),h=!l.infinite&&(t[l.ammoKey]??0)<=0;s+=`<div class="stn-weapon-slot ${n===l.key?"is-selected":""} ${h?"is-empty":""}">
        <span class="stn-weapon-key">${l.digit}</span>
        <span class="stn-weapon-name">${l.name}</span>
        <span class="stn-weapon-ammo">${c}</span>
      </div>`}this._wpn.rack.innerHTML=s;const o=e.target;o?(this._wpn.targetName.textContent=o.name||"CONTACT",this._wpn.brg.textContent=o.bearing!=null?`${ho(o.bearing)}°`:"---",this._wpn.rng.textContent=o.distanceM!=null?Zh(o.distanceM):"---",this._wpn.domain.textContent=(o.domain||"—").toUpperCase(),this._wpn.iff.textContent=(o.iff||"—").toUpperCase()):(this._wpn.targetName.textContent="NO TARGET",this._wpn.brg.textContent="---",this._wpn.rng.textContent="---",this._wpn.domain.textContent="---",this._wpn.iff.textContent="---");const a=this._wpn.fire;if(a.classList.remove("is-reloading","is-empty","is-notarget"),!o)a.textContent="SELECT TARGET · TAB",a.classList.add("is-notarget");else if(!i)a.textContent="RELOADING",a.classList.add("is-reloading");else{const l=hp.find(h=>h.key===n);l&&!l.infinite&&(t[l.ammoKey]??0)<=0?(a.textContent="MAGAZINE EMPTY",a.classList.add("is-empty")):a.textContent="WEAPONS FREE · CLICK TO FIRE"}}_updateRadar(e){const t=e.contacts||[],n=e.selectedTargetId,i=t.slice(0,12).map(s=>{const o=(s.iff||"unknown").toLowerCase(),a=s.distanceM!=null?Zh(s.distanceM):"";return`<div class="stn-contact-row ${s.id===n?"is-selected":""}">
        <span class="stn-contact-dot ${o}"></span>
        <span>${s.name||s.id}</span>
        <span>${a}</span>
      </div>`});this._rdr.list.innerHTML=i.length?i.join(""):'<div class="stn-contact-row"><span></span><span>NO CONTACTS IN RANGE</span><span></span></div>'}_updateLookout(e){const t=e.lookoutZoom??1,n=e.heading!=null?ho(e.heading):"---";this._look.readout.textContent=`BRG ${n}°  ·  ZOOM ${t.toFixed(1)}×  ·  SCROLL TO ZOOM  ·  E TO STAND`}dispose(){this.root?.parentElement&&this.root.parentElement.removeChild(this.root),this.root=null,this._mounted=!1}}const iA={HELM:{title:"Helm Station",hint:"<kbd>W</kbd>/<kbd>S</kbd> Throttle · <kbd>A</kbd>/<kbd>D</kbd> Rudder · <kbd>E</kbd> Stand"},WEAPONS:{title:"Weapons Station",hint:"<kbd>1</kbd>–<kbd>4</kbd> Select · <kbd>Tab</kbd> Target · Click Fire · <kbd>E</kbd> Stand"},RADAR:{title:"Radar / Sonar",hint:"<kbd>Q</kbd> Sonar Ping · <kbd>Tab</kbd> Cycle Track · <kbd>E</kbd> Stand"},LOOKOUT:{title:"Bridge Wing Lookout",hint:"Mouse Look · Scroll Zoom · <kbd>E</kbd> Stand"}};function sA(r){const e=["N","NE","E","SE","S","SW","W","NW"],t=Math.round((r%360+360)%360/45)%8;return e[t]}const up={HELM:"Helm",WEAPONS:"Weapons",RADAR:"Radar/Sonar",LOOKOUT:"Lookout"};class rA{constructor(e={}){this.options=e,this.root=null,this._mounted=!1,this._state={code:null,hostId:null,players:[],localPlayerId:null}}mount(e=document.getElementById("ui-root")){return this._mounted?this.root:(this.root=Wn("div",{class:"meridian-menu lobby-menu menu-hidden"}),this.root.innerHTML=`
      <div class="menu-bg-fallback">
        <div class="menu-grid"></div>
        <div class="menu-horizon-glow"></div>
      </div>
      <div class="hud-scanlines"></div>
      <div class="menu-content">
        <div class="menu-title-block">
          <div class="menu-eyebrow hud-label">Task Force Command</div>
          <h1 class="menu-title" style="font-size:44px;">MULTIPLAYER</h1>
          <div class="menu-title-rule"></div>
        </div>
        <div class="lobby-entry-screen"></div>
        <div class="lobby-room-screen" style="display:none;"></div>
      </div>
    `,e.appendChild(this.root),this._renderEntry(),this._mounted=!0,this.root)}_renderEntry(){const e=this.root.querySelector(".lobby-entry-screen");e.innerHTML=`
      <div class="lobby-entry-form">
        <div>
          <label>Callsign</label>
          <input type="text" class="lobby-name-input" maxlength="24" placeholder="Officer name" value="${localStorage.getItem("warship-name")||""}" />
        </div>
        <div>
          <label>Room Code (leave blank to create one)</label>
          <input type="text" class="lobby-code-input" maxlength="5" placeholder="e.g. ABCDE" style="text-transform:uppercase;" />
        </div>
      </div>
      <div class="lobby-entry-row">
        <button class="meridian-btn" data-action="go" style="--i:0">
          <span class="meridian-btn-index">01</span>
          <span class="meridian-btn-label">Create / Join</span>
        </button>
        <button class="meridian-btn" data-action="back" style="--i:1">
          <span class="meridian-btn-index">02</span>
          <span class="meridian-btn-label">Back</span>
        </button>
      </div>
    `;const t=e.querySelector(".lobby-name-input"),n=e.querySelector(".lobby-code-input");e.querySelector('[data-action="go"]').addEventListener("click",()=>{const i=(t.value||"Officer").trim().slice(0,24)||"Officer";localStorage.setItem("warship-name",i);const s=(n.value||"").trim().toUpperCase();this.options.onJoin?.(s,i)}),e.querySelector('[data-action="back"]').addEventListener("click",()=>this.options.onLeave?.())}showRoom(){this.root.querySelector(".lobby-entry-screen").style.display="none",this.root.querySelector(".lobby-room-screen").style.display="",this._renderRoom()}showEntry(){this.root.querySelector(".lobby-entry-screen").style.display="",this.root.querySelector(".lobby-room-screen").style.display="none"}update(e){this._state={...this._state,...e},this.root?.querySelector(".lobby-room-screen")?.style.display!=="none"&&this._renderRoom()}_renderRoom(){const e=this.root.querySelector(".lobby-room-screen"),{code:t,hostId:n,players:i,localPlayerId:s}=this._state,o=i.find(h=>h.id===s),a=s===n,l=()=>{let h='<div class="lobby-grid-head"></div>';for(const u of tp)h+=`<div class="lobby-grid-head">${up[u]}</div>`;for(const u of kw){h+=`<div class="lobby-ship-label">${ep[u]}</div>`;for(const d of tp){const f=i.find(y=>y.shipId===u&&y.station===d),_=f&&f.id===s?"mine":f?"taken":"",m=f?f.name:d==="HELM"||d==="WEAPONS"?"AI crewed":"Unmanned";h+=`<div class="lobby-slot ${_} ${f?"":"ai"}" data-ship="${u}" data-station="${d}">${m}</div>`}}return h},c=i.map(h=>`
      <div class="lobby-roster-row ${h.ready?"ready":""}">
        <span class="dot"></span>
        <span>${h.name}</span>
        ${h.id===n?'<span class="host-tag">HOST</span>':""}
        <span style="margin-left:auto; color:var(--c-text-faint);">${h.shipId?`${ep[h.shipId]} · ${up[h.station]}`:"Unassigned"}</span>
      </div>
    `).join("");e.innerHTML=`
      <div class="lobby-room-header">
        <div><span class="lobby-room-code-label">Room Code</span><span class="lobby-room-code">${t||"-----"}</span></div>
        <div class="hud-label">${i.length} officer${i.length===1?"":"s"} aboard</div>
      </div>
      <div class="lobby-grid">${l()}</div>
      <div class="lobby-roster">${c}</div>
      <div class="lobby-actions">
        <button class="meridian-btn" data-action="ready">
          <span class="meridian-btn-index">01</span>
          <span class="meridian-btn-label">${o?.ready?"Not Ready":"Ready"}</span>
        </button>
        <button class="meridian-btn ${a?"":"disabled"}" data-action="start">
          <span class="meridian-btn-index">02</span>
          <span class="meridian-btn-label">${a?"Start Patrol":"Waiting for Host"}</span>
        </button>
        <button class="meridian-btn meridian-btn-danger" data-action="leave">
          <span class="meridian-btn-index">03</span>
          <span class="meridian-btn-label">Leave</span>
        </button>
      </div>
    `,e.querySelectorAll(".lobby-slot").forEach(h=>{h.addEventListener("click",()=>{const u=h.dataset.ship,d=h.dataset.station,f=i.find(p=>p.shipId===u&&p.station===d);f&&f.id===s?this.options.onRelease?.():f||this.options.onClaim?.(u,d)})}),e.querySelector('[data-action="ready"]').addEventListener("click",()=>this.options.onReady?.(!o?.ready)),e.querySelector('[data-action="start"]').addEventListener("click",()=>{a&&this.options.onStart?.()}),e.querySelector('[data-action="leave"]').addEventListener("click",()=>this.options.onLeave?.())}show(){this.root&&(this.root.classList.remove("menu-hidden"),this.root.classList.remove("menu-play-in"),this.root.offsetWidth,this.root.classList.add("menu-play-in"),this.showEntry())}hide(){this.root&&this.root.classList.add("menu-hidden")}dispose(){this.root&&this.root.parentElement&&this.root.parentElement.removeChild(this.root),this.root=null,this._mounted=!1}}const Yi=document.getElementById("scene"),Fr=new Ob(Yi),xc=Fr.renderer,Nn=new Cu,Vt=new Dt(70,window.innerWidth/window.innerHeight,.1,2e4);Fr.setup(Nn,Vt);const Mc=new Fb(xc,Nn),Cr=new Gb(xc,Mc.sunDirection);Nn.add(Cr.group);Cr.setEnvMap(Mc.envRT.texture);const hg=new oe(10339292);Nn.fog=new Fo(hg.getHex(),42e-5);Cr.setFogColor(hg);const gt={player:new wh(Nn,{hullKind:"hero",name:"FS Meridian (DDG)",shipId:"player"}),escort1:new wh(Nn,{hullKind:"escort",iffColor:3107466,name:"FS Sentinel (DDG)",shipId:"escort1"}),escort2:new wh(Nn,{hullKind:"escort",iffColor:3828298,name:"FS Vanguard (CG)",shipId:"escort2"})};gt.player.group.position.set(0,0,0);gt.escort1.physics.position.set(-420,0,-60);gt.escort2.physics.position.set(360,0,-180);const Jh={player:new Th(gt.player,{role:"lead"}),escort1:new Th(gt.escort1,{role:"escort",stationOffset:new S(-420,0,-60)}),escort2:new Th(gt.escort2,{role:"escort",stationOffset:new S(360,0,-180)})};let kl="player",mt=gt.player;const ht=new Gw({ships:gt,name:"Officer"}),Ro=og({radius:260,peak:58});Ro.group.position.set(2100,0,3500);Nn.add(Ro.group);const td=og({radius:95,peak:24,segments:72,seed:7,rockCount:30,scrubCount:36,lighthouse:!1});td.group.position.set(-1900,0,1e3);Nn.add(td.group);const ri=new Wb(Vt);ri.setImmediate(new S(0,20,30),new ct);const vt=new OT;let dp=!1;function nd(){dp||(dp=!0,vt.unlock(),vt.setMasterVolume(.8),vt.setSfxVolume(.85),vt.startOceanAmbience(),vt.startWind(.3),vt._engineHum=vt.startEngineHum(0))}let Sc=!1;const _t=new Qw(Nn,{onFire:r=>{r==="gun"?vt.playDeckGunFire():r==="missile"?vt.playMissileLaunch():r==="torpedo"?vt.playTorpedoLaunch():r==="ciws"&&vt.playCiwsBurst()},onExplosion:(r,e)=>{e?.underwater?vt.playExplosionSmall({position:r}):vt.playExplosionLarge({position:r}),fp(e?.scale>1?.5:.25)},onHit:()=>{},onShipHit:(r,e)=>{r!==mt||Sc||(vt.playHitImpact(),fp(.6),Yo.flashHit(Math.min(1,e/40)),mt.health<=0&&dA())}}),pr=new eT({rangeM:6e3,sonarPingRangeM:2400}),_n=new cT(Nn,_t),Yt=new tT({onComms:r=>{Gs.push(r),vt.playRadioBlip()},onObjective:r=>{oA(r),ht.isHost&&ht.inSession&&ht.net.sendMissionState({beatIndex:Yt.beatIndex})}});ht.onMissionState=r=>{ht.isHost||Yt.syncBeat(r.beatIndex)};ht.onDisconnected=()=>{Gs.push({speaker:"TASK FORCE COMMAND",text:"Link to the task force network lost — resuming independent command.",urgency:"warning"}),vt.playRadioBlip()};let jh=null;function oA(r){jh=r}let Vi=0;function fp(r){Vi=Math.max(Vi,r)}function aA(r,e,t,n){_t.spawn(r,e,t,{sourceEntity:n,targetEntity:cA(gt.player)})}function lA(r,e,t,n,i){ht.fireAndRelay((s,o,a,l)=>_t.spawn(s,o,a,l),r,e,t,{sourceEntity:n,targetEntity:i})}function cA(r){return{get position(){return r.group.position}}}const Ri=document.getElementById("ui-root"),Pi=new kT;Pi.mount(Ri);Pi.hide();const xn=new qT({onSelectContact:r=>{_t.selectedTargetId=r}});xn.mount(Ri);xn.hide();const Br=new nA;Br.mount(Ri);const Gs=new jT({maxVisible:6});Gs.mount(Ri);const Yo=new QT;Yo.mount(Ri);let id="main";const Vs=new ZT({onChange:(r,e)=>{r==="masterVolume"?vt.setMasterVolume(e/100):r==="musicVolume"?vt.setMusicVolume(e/100):r==="sfxVolume"?vt.setSfxVolume(e/100):r==="mouseSensitivity"?ln.mouseSensScale=e/50:r==="invertY"?ln.invertY=e:r==="graphicsQuality"&&hA(e)},onClose:()=>{Vs.hide(),Po=!1,id==="pause"?Ci.show():Sn.show()}});Vs.mount(Ri);Vs.hide();let Po=!1;function hA(r){const e=window.devicePixelRatio||1,t={low:1,medium:Math.min(1.25,e),high:Math.min(1.75,e),ultra:Math.min(2,e)};xc.setPixelRatio(t[r]??Math.min(1.5,e)),Fr.bloomPass.enabled=r!=="low"}let qn=!1,Ki=!1,Qh=!1;const Ci=new YT({onResume:()=>{ug()},onSettings:()=>{Ci.hide(),id="pause",Po=!0,Vs.show()},onQuitToMainMenu:()=>{Ki=!1,Ci.hide(),qn=!1,Pi.hide(),xn.hide(),Br.setStation(null),xn.setStationFocus(!1),document.pointerLockElement&&document.exitPointerLock(),ht.inSession&&ht.leave(),Sn.update({continueEnabled:!0}),Sn.show()}});Ci.mount(Ri);Ci.hide();function ug(){Ki=!1,Ci.hide(),Yi.requestPointerLock()}const Fs=document.createElement("div");Fs.className="hud-panel";Fs.style.cssText=`
  position:fixed; left:50%; top:50%; transform:translate(-50%,-50%);
  padding:36px 48px; text-align:center; z-index:80; display:none;
  min-width:360px;
`;Fs.innerHTML=`
  <div class="hud-corners"></div>
  <div class="hud-label" style="color:var(--c-red);">TASK FORCE COMMAND</div>
  <div style="font-family:var(--font-display); font-size:38px; color:var(--c-red); letter-spacing:0.08em; margin:8px 0 4px; text-shadow:0 0 16px rgba(255,68,68,0.6);">MERIDIAN LOST</div>
  <div style="color:var(--c-text-dim); font:13px var(--font-mono); margin-bottom:22px;">Hull integrity failure — all hands abandon ship.</div>
  <button id="gameover-restart" style="font:12px var(--font-mono); letter-spacing:0.12em; text-transform:uppercase; color:var(--c-text); background:var(--c-cyan-soft); border:1px solid var(--c-border-strong); padding:10px 22px; cursor:pointer; clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);">Return to Main Menu</button>
`;document.body.appendChild(Fs);Fs.querySelector("#gameover-restart").addEventListener("click",()=>{Fs.style.display="none",Sc=!1,mt.health=mt.maxHealth,Yo.setHullPct(100),qn=!1,Pi.hide(),xn.hide();for(const r of _n.entities)r.dispose(Nn);_n.entities=[];for(const[r,e]of Object.entries(gt)){e.health=e.maxHealth;const t=r==="player"?new S(0,0,0):Jh[r].stationOffset;e.physics.position.copy(t),e.physics.speed=0,e.physics.heading=0}_s=0,Ka=0,Yt.started=!1,Yt._started=!1,Yt.beatIndex=0,Yt.flags.clear(),eu=!1,document.pointerLockElement&&document.exitPointerLock(),Sn.update({continueEnabled:!1}),Sn.show()});function uA(){ri.lookEnabled=!1,ri.resetLook();const r=new S;Vt.getWorldDirection(r);const e=Vt.position.clone().addScaledVector(r,-65).add(new S(0,42,0)),t=mt.group.position.clone().add(new S(0,4,0)),n=new ct().setFromRotationMatrix(new Pe().lookAt(e,t,new S(0,1,0)));ri.transitionTo(e,n,62,3.6)}function dA(){Sc=!0,vt.playAlarmKlaxon(),Gs.push({speaker:"TASK FORCE ACTUAL",text:`${mt.name} is down. All units, converge and render assistance.`,urgency:"critical"}),document.pointerLockElement&&document.exitPointerLock(),uA(),setTimeout(()=>{Fs.style.display="block"},1200)}const wi=new rA({onJoin:async(r,e)=>{try{await ht.start({code:r,name:e}),wi.showRoom()}catch(t){console.warn("[Lobby] Could not reach the relay server.",t),Gs.push({speaker:"TASK FORCE COMMAND",text:"Could not reach the multiplayer relay — check the server is running.",urgency:"critical"}),wi.hide(),Sn.show()}},onClaim:(r,e)=>ht.claimSlot(r,e),onRelease:()=>ht.releaseSlot(),onReady:r=>ht.setReady(r),onStart:()=>ht.startPatrol(),onLeave:()=>{ht.inSession&&ht.leave(),wi.hide(),Sn.show()}});wi.mount(Ri);wi.hide();ht.onRoomState=r=>{wi.update({code:r.code,hostId:r.hostId,players:r.players,localPlayerId:ht.net?.playerId})};ht.onStartPatrol=()=>{kl=ht.net?.me?.shipId||"player",mt=gt[kl],ln.setShip(mt),wi.hide(),dg()};ht.setWeaponHooks({spawn:(r,e,t,n)=>_t.spawn(r,e,t,n),findEntity:r=>_n.entities.find(e=>e.id===r)||Object.values(gt).find(e=>e.id===r)||null});const Sn=new XT({onNewPatrol:()=>{nd(),Sn.hide(),kl="player",mt=gt.player,ln.setShip(mt),dg()},onContinue:()=>{Sn.hide(),qn=!0,Pi.show(),xn.show(),Yi.requestPointerLock()},onMultiplayer:()=>{Sn.hide(),wi.show()},onSettings:()=>{Sn.hide(),id="main",Po=!0,Vs.show()},onCredits:()=>{Gs.push({speaker:"MERIDIAN",text:"A naval combat tech demo — built with Three.js, procedural graphics/audio, zero external assets.",urgency:"normal"})},continueEnabled:!1});Sn.mount(Ri);Sn.show();function dg(){nd(),Yt.started||(Yt.start(),_n.spawnMerchantTraffic(gt.player.group.position),_n.spawnHorizonTaskForce(gt.player.group.position)),pA(()=>{qn=!0,Pi.show(),xn.show(),fA()})}window.addEventListener("keydown",r=>{if(r.code==="Escape"&&qn){if(Po){Vs.hide(),Po=!1,Ki&&Ci.show();return}Ki?ug():(Ki=!0,document.pointerLockElement&&document.exitPointerLock(),Ci.show())}});const uo=document.createElement("div");uo.className="stn-prompt";document.body.appendChild(uo);const Rr=document.createElement("div");Rr.className="hud-panel";Rr.style.cssText=`
  position:fixed; left:50%; bottom:9%; transform:translateX(-50%);
  padding:20px 30px; z-index:70; display:none; min-width:320px; text-align:left;
  animation: hud-fade-up 0.45s var(--ease-hud) both;
`;Rr.innerHTML=`
  <div class="hud-corners"></div>
  <div class="hud-label" style="color:var(--c-cyan); margin-bottom:12px;">BRIDGE ORIENTATION</div>
  <div style="display:grid; grid-template-columns:auto 1fr; gap:7px 20px; font:13px var(--font-mono); color:var(--c-text); white-space:nowrap;">
    <span style="color:var(--c-cyan);">W&nbsp;A&nbsp;S&nbsp;D</span><span>Move about the bridge</span>
    <span style="color:var(--c-cyan);">MOUSE</span><span>Look around</span>
    <span style="color:var(--c-cyan);">SHIFT</span><span>Sprint</span>
    <span style="color:var(--c-cyan);">E</span><span>Sit at a glowing station</span>
    <span style="color:var(--c-cyan);">ESC</span><span>Pause</span>
  </div>
  <div class="hud-label" style="margin-top:16px; opacity:0.7;">Click anywhere to take the deck</div>
`;document.body.appendChild(Rr);function fA(){Rr.style.display="block";let r=!1;const e=()=>{r||(r=!0,Rr.style.display="none",Yi.requestPointerLock(),window.removeEventListener("keydown",e),Yi.removeEventListener("click",e),clearTimeout(t))};window.addEventListener("keydown",e),Yi.addEventListener("click",e);const t=setTimeout(e,14e3)}function pA(r){Qh=!0;for(const d of Object.values(gt))d.physics.applyToObject3D(d.group);const e=mt.group.position.clone(),t=mt.group.quaternion.clone(),n=new S(0,1,0),s=new S(150,100,-230).clone().applyQuaternion(t).add(e),o=e.clone().add(new S(0,12,30)),a=new ct().setFromRotationMatrix(new Pe().lookAt(s,o,n)),c=new S(-70,26,40).clone().applyQuaternion(t).add(e),h=e.clone().add(new S(0,6,-10)),u=new ct().setFromRotationMatrix(new Pe().lookAt(c,h,n));ri.transitionTo(s,a,45,1.3,()=>{ri.transitionTo(c,u,55,2,()=>{const d=ln._walkWorldPosition(),f=ln._walkWorldQuaternion();ri.transitionTo(d,f,70,1.8,()=>{Qh=!1,r()})})})}const ln=new Kw({camera:Vt,cameraRig:ri,domElement:Yi,playerShip:mt,onInteractPrompt:r=>{const e=tn[r];e?(uo.innerHTML=`<kbd>E</kbd>${e.promptText.replace(/^Press E to /i,"")}`,uo.classList.add("is-visible")):uo.classList.remove("is-visible")},onStationChange:r=>{const e=r&&r!=="WALK"&&tn[r];Br.setStation(e?r:null),Pi.setAiming(r===xt.WEAPONS),xn.setStationFocus(r===xt.RADAR),r===xt.RADAR?xn.show():r&&r!=="WALK"?r===xt.LOOKOUT?xn.hide():xn.show():qn&&xn.show(),r===xt.HELM&&Yt.flag("depart"),e&&(nd(),vt.playUiConfirm())}});window.addEventListener("keydown",r=>{if(!qn||Ki)return;const e=ln.state;e!==xt.WEAPONS&&e!==xt.RADAR||(e===xt.WEAPONS&&(r.code==="Digit1"?_t.selectWeapon("gun"):r.code==="Digit2"?_t.selectWeapon("missile"):r.code==="Digit3"?_t.selectWeapon("torpedo"):r.code==="Digit4"&&_t.selectWeapon("drone")),r.code==="KeyQ"?(pr.triggerSonarPing(mt.group.position.clone()),vt.playSonarPing(),Br.triggerSonarPulse()):r.code==="Tab"&&(r.preventDefault(),mA()))});Yi.addEventListener("click",()=>{!qn||Ki||ln.state!==xt.WEAPONS||gA()});function mA(){const r=to||[];if(!r.length)return;const e=r.findIndex(n=>n.id===_t.selectedTargetId),t=r[(e+1)%r.length];_t.selectedTargetId=t.id}function gA(){const r=mt.mountPoints,e=_n.entities.find(a=>a.id===_t.selectedTargetId&&a.alive);let t=r.gunBarrelTip;_t.selectedWeapon==="missile"?t=r.missileTubes[0]:_t.selectedWeapon==="torpedo"&&(t=r.missileTubes[2]||r.missileTubes[0]);const n=mt.getMountWorld(t,new S);let i;if(e&&(i=e.position.clone(),_t.selectedWeapon==="torpedo"&&e.domain!=="SUBSURFACE"&&(i=null)),!i){const a=new S;Vt.getWorldDirection(a);const l=Math.abs(a.y)>.01?n.y/-a.y:2e3;i=n.clone().addScaledVector(a,l>0?l:2e3)}const s=_t.selectedWeapon;_t.firePlayerWeapon(n,i,e||null)&&ht.inSession&&ht.net.sendWeaponFire({type:{gun:"playerShell",missile:"playerMissile",torpedo:"playerTorpedo",drone:"drone"}[s],from:{x:n.x,y:n.y,z:n.z},target:{x:i.x,y:i.y,z:i.z},targetEntityId:e?.id??null})}window.GAME={pipeline:Fr,sky:Mc,ocean:Cr,camera:Vt,scene:Nn,renderer:xc,THREE:wb,ships:gt,localShipId:kl,cameraRig:ri,playerController:ln,weapons:_t,radar:pr,world:_n,mission:Yt,audio:vt,hud:Pi,tacRadar:xn,mainMenu:Sn,pauseMenu:Ci,settings:Vs,commsLog:Gs,damageVignette:Yo,island:Ro,islet:td,stationOverlay:Br,Station:xt,mp:ht,lobby:wi};window.addEventListener("resize",()=>{Vt.aspect=window.innerWidth/window.innerHeight,Vt.updateProjectionMatrix(),Fr.resize()});let _s=0,Ka=0,to=[],eu=!1;const pp=new mc;let Lh=0,Wa=0;const Io=document.createElement("div");Io.style.cssText="position:fixed;top:8px;left:8px;color:#7fffb0;font:12px monospace;z-index:100;background:rgba(0,0,0,0.4);padding:4px 8px;border-radius:4px;display:none;";document.body.appendChild(Io);window.addEventListener("keydown",r=>{r.code==="Backquote"&&(Io.style.display=Io.style.display==="none"?"block":"none")});function fg(){requestAnimationFrame(fg);const r=Math.min(pp.getDelta(),.05),e=pp.elapsedTime,t=(qn||Qh)&&!Ki&&!Sc,n=(s,o,a)=>Cr.getHeightAt(s,o,a);if(t){if(qn&&ln.state===xt.HELM){const s=ln.keys;_s=Ie.clamp(_s+((s.has("KeyW")?1:0)-(s.has("KeyS")?1:0))*r*.8,-1,1),Ka=(s.has("KeyD")?1:0)-(s.has("KeyA")?1:0)}for(const[s,o]of Object.entries(gt))o.networked=!ht.iSimulateShip(s),o.networked||(ht.helmIsHuman(s)?o===mt&&ln.state===xt.HELM&&o.setCommand(_s,Ka):Jh[s].updateHelm(r,{anchorShip:gt.player,waypoint:Yt.currentWaypoint}),ht.weaponsIsHuman(s)||Jh[s].updateWeapons(r,{hostiles:_n.hostiles,fireWeapon:lA})),o.update(r,e,n);ht.tick(r),qn&&ln.update(r)}ri.update(r),Vi>.001?(Vt.position.x+=(Math.random()-.5)*Vi,Vt.position.y+=(Math.random()-.5)*Vi,Vt.position.z+=(Math.random()-.5)*Vi,Vi*=.88):Vi=0,Mc.update(Vt,e),Cr.update(r,e,Vt);const i=1.6+Math.max(0,Math.sin(e*.9))*2.2;if(Ro.lamp.material.emissiveIntensity=i,Ro.beaconLight.intensity=i*3.2,t){pr.update(r),_n.update(r,{playerPos:gt.player.group.position,playerShip:gt.player,elapsed:e,fireWeapon:aA,getWaveHeight:n,...pr.sonarContext}),_t.update(r,{ships:Object.values(gt),enemies:_n.entities,elapsed:e});const s=Yt.currentWaypoint;s&&gt.player.group.position.distanceTo(s)<500&&Yt.flag("nearWaypoint0");const o=Yt.consumeSpawnRequest();o&&(_n.spawnWave(o,s||gt.player.group.position),eu=!0),eu&&_n.hostiles.length===0&&(Yt.flag("wave1Cleared"),Yt.flag("subCleared"),Yt.flag("airWaveCleared")),vt.setListenerPosition(Vt.position.x,Vt.position.y,Vt.position.z);const a=new S;Vt.getWorldDirection(a),vt.setListenerOrientation(a,new S(0,1,0)),vt._engineHum?.setRpm?.(Math.abs(_s));const l=(Ie.radToDeg(mt.physics.heading)%360+360)%360,c=_t.getWeaponInfo();Pi.update({heading:l,speedKnots:mt.physics.speedKnots,throttleFraction:_s,hullPct:mt.health/mt.maxHealth*100,subsystems:{engine:"nominal",radar:"nominal",weapons:"nominal"},objective:jh?{text:jh.text,bearing:null,distanceM:s?Math.round(gt.player.group.position.distanceTo(s)):null}:null,selectedWeapon:{name:c.name,ammo:c.ammo===1/0?999:c.ammo,maxAmmo:c.maxAmmo===1/0?999:c.maxAmmo,ready:c.ready}}),Yo.setHullPct(mt.health/mt.maxHealth*100);const h=[..._n.entities,...Object.values(gt).filter(u=>u!==mt)];if(to=pr.buildContacts(mt.group.position,h,_t.selectedTargetId),xn.update({rangeM:pr.rangeM,playerHeading:l,contacts:to.map(u=>({id:u.id,x:u.x,z:u.z,domain:u.domain.toLowerCase(),iff:u.iff.toLowerCase(),name:u.name,selected:u.selected}))}),tn[ln.state]){const u=to.find(f=>f.id===_t.selectedTargetId)||null;u&&_n.entities.find(f=>f.id===u.id);let d=null;if(u){const f=u.x,p=u.z,_=Math.hypot(f,p),m=(Ie.radToDeg(Math.atan2(f,p))%360+360)%360;d={name:u.name,domain:u.domain,iff:u.iff,distanceM:_,bearing:m}}Br.update({heading:l,speedKnots:mt.physics.speedKnots,throttleFraction:_s,rudder:Ka,selectedWeapon:_t.selectedWeapon,ammo:{..._t.ammo},weaponReady:_t.canFireSelected(),target:d,contacts:to.map(f=>({id:f.id,name:f.name,iff:f.iff,domain:f.domain,distanceM:Math.hypot(f.x,f.z)})),selectedTargetId:_t.selectedTargetId,lookoutZoom:ln.lookoutZoom})}}Fr.render(e),Lh++,Wa+=r,Wa>=.5&&(Io.textContent=`${Math.round(Lh/Wa)} fps`,Lh=0,Wa=0)}fg();
//# sourceMappingURL=index-DQHTkiGu.js.map
