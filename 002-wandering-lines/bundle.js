(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";var Rbush=require(9),Simplex=require(10),Lerp=require(8),Random=require(6),Intersection=require(3),Draw=require(2),Shortcuts=require(4),TAU=2*Math.PI;function _cutOutIntersections(e,n){var i,t=1/0,a=n.line;return e.forEach(function(e){var n=e.line,r=Intersection(a[0],a[1],a[2],a[3],n[0],n[1],n[2],n[3]);if(r){var o=(r[0]-a[0])*(r[0]-a[0])+(r[1]-a[1])*(r[1]-a[1]);o<t&&(t=o,i=r)}}),!!i&&_lineToBounds([a[0],a[1],i[0],i[1]])}function _lineToBounds(e){var n=[Math.min(e[0],e[2]),Math.min(e[1],e[3]),Math.max(e[0],e[2]),Math.max(e[1],e[3])];return n.line=e,n.theta=Math.atan2(e[3]-e[1],e[2]-e[0]),n}function _newLine(e,n,i,t,a,r,o){var s=n.simplex3(i*n.simplexScale,t*n.simplexScale,o*n.simplexDepthScale),u=a-(s-.5*s)*n.turnSpeed,c=_lineToBounds([i,t,i+Math.cos(u)*n.lineLength,t+Math.sin(u)*n.lineLength]),l=_cutOutIntersections(e.tree.search(c),c);if(l&&(c=l),c.line.generation=r,e.tree.insert(c),e.lines.push(c.line),e.newLines.push(c.line),!l)return c}function _createStageBoundary(e,n){var i=.5*e.margin,t=.5-i,a=.5+i,r=.5-i,o=.5+i;n.stageBoundary=[Lerp(.5,t,.5),Lerp(.5,r,.5),Lerp(.5,a,.5),Lerp(.5,o,.5)]}function _createInitialLine(e,n){n.random(e.stageBoundary[0],e.stageBoundary[2]),n.random(e.stageBoundary[1],e.stageBoundary[3]);var i=Math.log(e.generation++);e.active[0]=_newLine(e,n,.5,.5,0,i,0)}function _updateLines(e,n){var i=e.active,t=[];e.iteration++,e.newLines.length=0;for(var a=0;a<n.maxLines&&a<i.length;a++){var r=(e.activeIndex+a)%i.length,o=i[r];if(o){var s=o.line[2],u=o.line[3],c=o.generation;n.random()<n.chanceToBranch&&t.push(_startBranch(e,n,o.line)),i[r]=_newLine(e,n,s,u,o.theta,c,e.iteration)}else i.splice(r,1),a--}e.active=i.concat(t),e.activeIndex=a%i.length,e.firstRun=!1}function _startBranch(e,n,i){var t=(i[2]-i[0])*n.nubSize,a=(i[3]-i[1])*n.nubSize,r=n.random()>.5?[-a,t]:[a,-t],o=(i[0]+i[2])/2,s=(i[1]+i[3])/2,u=_lineToBounds([o+.5*r[0],s+.5*r[1],o+r[0],s+r[1]]);return u.line.generation=Math.pow(i.generation||2,2),e.tree.insert(u),e.lines.push(u.line),e.active.push(u),e.newLines.push(u.line),u}function init(){var e=window.location.hash.substr(1)||String(Math.random()).split(".")[1],n=Random(e),i=new Simplex(n),t=i.noise3D.bind(i);Shortcuts(e),console.log("current seed",e);var a={margin:1.5,maxLines:200,random:n,simplex3:t,lineLength:.002,simplexScale:1,simplexDepthScale:1e-4,nubSize:.001,chanceToBranch:.1,turnSpeed:.01*Math.PI},r={firstRun:!0,tree:Rbush(9),active:[],activeIndex:0,lines:[],newLines:[],stageBoundary:null,generation:2,iteration:0};_createStageBoundary(a,r),_createInitialLine(r,a);var o=Draw(r);requestAnimationFrame(function e(){_updateLines(r,a),o(),requestAnimationFrame(e)}),window.onhashchange=function(){location.reload()}}init();

},{"10":10,"2":2,"3":3,"4":4,"6":6,"8":8,"9":9}],2:[function(require,module,exports){
"use strict";var TAU=2*Math.PI;function _drawLines(t,e,i,n){t.strokeStyle=e.lineColor,t.lineCap="round";var r=!0,o=!1,h=void 0;try{for(var d,a=n[Symbol.iterator]();!(r=(d=a.next()).done);r=!0){var s=d.value;t.lineWidth=e.lineWidth,t.beginPath(),t.moveTo(i.x(s[0],s[1]),i.y(s[0],s[1])),t.lineTo(i.x(s[2],s[3]),i.y(s[2],s[3])),t.stroke(),t.closePath()}}catch(t){o=!0,h=t}finally{try{r||null==a.return||a.return()}finally{if(o)throw h}}}function _prepCanvasAndGetCtx(t){function e(){t.width=window.innerWidth*devicePixelRatio,t.height=window.innerHeight*devicePixelRatio}return e(),window.addEventListener("resize",e,!1),t.getContext("2d")}function _setupPlotting(t,e,i){function n(){e.ratio=i.width/i.height,e.ratio<1?(e.width=i.width,e.height=i.height*e.ratio):(e.ratio=1/e.ratio,e.width=i.width*e.ratio,e.height=i.height),e.offsetX=(i.width-e.width)/2,e.offsetY=(i.height-e.height)/2,e.size=Math.sqrt(i.width*i.width+i.height*i.height)/t.baseScreenDiagonal}n(),window.addEventListener("resize",n,!1);var r=.5*(1-t.shrink);return{x:function(i,n){return e.offsetX+(r+t.shrink*i)*e.width},y:function(i,n){return e.offsetY+(r+t.shrink*n)*e.height},line:function(t){return t*e.size}}}module.exports=function(t){var e={shrink:.75,baseScreenDiagonal:1e3,lineWidth:2,lineColor:"#ddd"},i=document.createElement("canvas");document.body.appendChild(i);var n=_prepCanvasAndGetCtx(i),r=_setupPlotting(e,{ratio:1,width:0,height:0},i);function o(i){_drawLines(n,e,r,t.lines)}return window.addEventListener("resize",function(){return o()},!1),o};

},{}],3:[function(require,module,exports){
"use strict";module.exports=function(r,t,e,u,i,n,o,f){if(r===i&&t==n||r===o&&t==f||e===i&&u==n||e===o&&u==f)return!1;var s=(f-n)*(e-r)-(o-i)*(u-t),v=(o-i)*(t-n)-(f-n)*(r-i),a=(e-r)*(t-n)-(u-t)*(r-i);if(0===s||0===v&&0===a)return!1;var c=v/s,d=a/s;return c>=0&&c<=1&&d>=0&&d<=1?[c*(e-r)+r,c*(u-t)+t]:void 0};

},{}],4:[function(require,module,exports){
"use strict";var Keycode=require(7);function _click(e){var c=document.querySelector(e);c&&c.click()}function executeIfExists(e){"function"==typeof e&&e()}module.exports=function(e){window.addEventListener("keydown",function(c){switch(Keycode(c)){case"h":document.body.classList.toggle("hide-ui");break;case"r":window.location.reload();break;case"s":history.pushState(null,document.title,window.location.pathname+"#"+e);break;case"f":if(document.fullscreenElement)document.exitFullscreen&&document.exitFullscreen();else{var t=document.querySelector("canvas");t.requestFullscreen&&t.requestFullscreen()}break;case"left":_click("#prev");break;case"right":_click("#next")}},!1)};

},{"7":7}],5:[function(require,module,exports){
function _mashFn(){var r=4022871197;return function(n){n=n.toString();for(var t=0;t<n.length;t++){var e=.02519603282416938*(r+=n.charCodeAt(t));e-=r=e>>>0,r=(e*=r)>>>0,r+=4294967296*(e-=r)}return 2.3283064365386963e-10*(r>>>0)}}module.exports=function(){var r=Array.prototype.slice.call(arguments),n=0,t=0,e=0,a=1;0===r.length&&(r=[+new Date]);var o=_mashFn();n=t=e=o(" ");for(var u=0;u<r.length;u++)(n-=o(r[u]))<0&&(n+=1),(t-=o(r[u]))<0&&(t+=1),(e-=o(r[u]))<0&&(e+=1);return function(){var r=2091639*n+2.3283064365386963e-10*a;return n=t,t=e,e=r-(a=0|r)}};

},{}],6:[function(require,module,exports){
var Alea=require(5);module.exports=function(){var r=Alea.apply(this,arguments);return function(e,a,n){a=void 0===a?1:a;var t=(e=void 0===e?0:e)+r()*(a-e);return n?parseInt(t,10):t}};

},{"5":5}],7:[function(require,module,exports){
function keyCode(e){if(e&&"object"==typeof e){var o=e.which||e.keyCode||e.charCode;o&&(e=o)}if("number"==typeof e)return names[e];var a,r=String(e);return(a=codes[r.toLowerCase()])?a:(a=aliases[r.toLowerCase()])||(1===r.length?r.charCodeAt(0):void 0)}keyCode.isEventKey=function(e,o){if(e&&"object"==typeof e){var a=e.which||e.keyCode||e.charCode;if(null==a)return!1;if("string"==typeof o){var r;if(r=codes[o.toLowerCase()])return r===a;if(r=aliases[o.toLowerCase()])return r===a}else if("number"==typeof o)return o===a;return!1}},exports=module.exports=keyCode;var codes=exports.code=exports.codes={backspace:8,tab:9,enter:13,shift:16,ctrl:17,alt:18,"pause/break":19,"caps lock":20,esc:27,space:32,"page up":33,"page down":34,end:35,home:36,left:37,up:38,right:39,down:40,insert:45,delete:46,command:91,"left command":91,"right command":93,"numpad *":106,"numpad +":107,"numpad -":109,"numpad .":110,"numpad /":111,"num lock":144,"scroll lock":145,"my computer":182,"my calculator":183,";":186,"=":187,",":188,"-":189,".":190,"/":191,"`":192,"[":219,"\\":220,"]":221,"'":222},aliases=exports.aliases={windows:91,"⇧":16,"⌥":18,"⌃":17,"⌘":91,ctl:17,control:17,option:18,pause:19,break:19,caps:20,return:13,escape:27,spc:32,spacebar:32,pgup:33,pgdn:34,ins:45,del:46,cmd:91};for(i=97;i<123;i++)codes[String.fromCharCode(i)]=i-32;for(var i=48;i<58;i++)codes[i-48]=i;for(i=1;i<13;i++)codes["f"+i]=i+111;for(i=0;i<10;i++)codes["numpad "+i]=i+96;var names=exports.names=exports.title={};for(i in codes)names[codes[i]]=i;for(var alias in aliases)codes[alias]=aliases[alias];

},{}],8:[function(require,module,exports){
function lerp(e,r,l){return e*(1-l)+r*l}module.exports=lerp;

},{}],9:[function(require,module,exports){
!function(){"use strict";function t(i,n){if(!(this instanceof t))return new t(i,n);this._maxEntries=Math.max(4,i||9),this._minEntries=Math.max(2,Math.ceil(.4*this._maxEntries)),n&&this._initFormat(n),this.clear()}function i(t,i){t.bbox=n(t,0,t.children.length,i)}function n(t,i,n,r){for(var o,a=e(),s=i;s<n;s++)o=t.children[s],h(a,t.leaf?r(o):o.bbox);return a}function e(){return[1/0,1/0,-1/0,-1/0]}function h(t,i){return t[0]=Math.min(t[0],i[0]),t[1]=Math.min(t[1],i[1]),t[2]=Math.max(t[2],i[2]),t[3]=Math.max(t[3],i[3]),t}function r(t,i){return t.bbox[0]-i.bbox[0]}function o(t,i){return t.bbox[1]-i.bbox[1]}function a(t){return(t[2]-t[0])*(t[3]-t[1])}function s(t){return t[2]-t[0]+(t[3]-t[1])}function l(t,i){return t[0]<=i[0]&&t[1]<=i[1]&&i[2]<=t[2]&&i[3]<=t[3]}function u(t,i){return i[0]<=t[2]&&i[1]<=t[3]&&i[2]>=t[0]&&i[3]>=t[1]}function f(t,i,n,e,h){for(var r,o=[i,n];o.length;)(n=o.pop())-(i=o.pop())<=e||(c(t,i,n,r=i+Math.ceil((n-i)/e/2)*e,h),o.push(i,r,r,n))}function c(t,i,n,e,h){for(var r,o,a,s,l,u,f;n>i;){for(n-i>600&&(r=n-i+1,o=e-i+1,a=Math.log(r),s=.5*Math.exp(2*a/3),l=.5*Math.sqrt(a*s*(r-s)/r)*(o-r/2<0?-1:1),c(t,Math.max(i,Math.floor(e-o*s/r+l)),Math.min(n,Math.floor(e+(r-o)*s/r+l)),e,h)),u=t[e],o=i,f=n,d(t,i,e),h(t[n],u)>0&&d(t,i,n);o<f;){for(d(t,o,f),o++,f--;h(t[o],u)<0;)o++;for(;h(t[f],u)>0;)f--}0===h(t[i],u)?d(t,i,f):d(t,++f,n),f<=e&&(i=f+1),e<=f&&(n=f-1)}}function d(t,i,n){var e=t[i];t[i]=t[n],t[n]=e}t.prototype={all:function(){return this._all(this.data,[])},search:function(t){var i=this.data,n=[],e=this.toBBox;if(!u(t,i.bbox))return n;for(var h,r,o,a,s=[];i;){for(h=0,r=i.children.length;h<r;h++)o=i.children[h],u(t,a=i.leaf?e(o):o.bbox)&&(i.leaf?n.push(o):l(t,a)?this._all(o,n):s.push(o));i=s.pop()}return n},collides:function(t){var i=this.data,n=this.toBBox;if(!u(t,i.bbox))return!1;for(var e,h,r,o,a=[];i;){for(e=0,h=i.children.length;e<h;e++)if(r=i.children[e],u(t,o=i.leaf?n(r):r.bbox)){if(i.leaf||l(t,o))return!0;a.push(r)}i=a.pop()}return!1},load:function(t){if(!t||!t.length)return this;if(t.length<this._minEntries){for(var i=0,n=t.length;i<n;i++)this.insert(t[i]);return this}var e=this._build(t.slice(),0,t.length-1,0);if(this.data.children.length)if(this.data.height===e.height)this._splitRoot(this.data,e);else{if(this.data.height<e.height){var h=this.data;this.data=e,e=h}this._insert(e,this.data.height-e.height-1,!0)}else this.data=e;return this},insert:function(t){return t&&this._insert(t,this.data.height-1),this},clear:function(){return this.data={children:[],height:1,bbox:e(),leaf:!0},this},remove:function(t){if(!t)return this;for(var i,n,e,h,r=this.data,o=this.toBBox(t),a=[],s=[];r||a.length;){if(r||(r=a.pop(),n=a[a.length-1],i=s.pop(),h=!0),r.leaf&&-1!==(e=r.children.indexOf(t)))return r.children.splice(e,1),a.push(r),this._condense(a),this;h||r.leaf||!l(r.bbox,o)?n?(i++,r=n.children[i],h=!1):r=null:(a.push(r),s.push(i),i=0,n=r,r=r.children[0])}return this},toBBox:function(t){return t},compareMinX:function(t,i){return t[0]-i[0]},compareMinY:function(t,i){return t[1]-i[1]},toJSON:function(){return this.data},fromJSON:function(t){return this.data=t,this},_all:function(t,i){for(var n=[];t;)t.leaf?i.push.apply(i,t.children):n.push.apply(n,t.children),t=n.pop();return i},_build:function(t,n,e,h){var r,o=e-n+1,a=this._maxEntries;if(o<=a)return i(r={children:t.slice(n,e+1),height:1,bbox:null,leaf:!0},this.toBBox),r;h||(h=Math.ceil(Math.log(o)/Math.log(a)),a=Math.ceil(o/Math.pow(a,h-1))),r={children:[],height:h,bbox:null,leaf:!1};var s,l,u,c,d=Math.ceil(o/a),x=d*Math.ceil(Math.sqrt(a));for(f(t,n,e,x,this.compareMinX),s=n;s<=e;s+=x)for(f(t,s,u=Math.min(s+x-1,e),d,this.compareMinY),l=s;l<=u;l+=d)c=Math.min(l+d-1,u),r.children.push(this._build(t,l,c,h-1));return i(r,this.toBBox),r},_chooseSubtree:function(t,i,n,e){for(var h,r,o,s,l,u,f,c,d,x;e.push(i),!i.leaf&&e.length-1!==n;){for(f=c=1/0,h=0,r=i.children.length;h<r;h++)l=a((o=i.children[h]).bbox),d=t,x=o.bbox,(u=(Math.max(x[2],d[2])-Math.min(x[0],d[0]))*(Math.max(x[3],d[3])-Math.min(x[1],d[1]))-l)<c?(c=u,f=l<f?l:f,s=o):u===c&&l<f&&(f=l,s=o);i=s||i.children[0]}return i},_insert:function(t,i,n){var e=this.toBBox,r=n?t.bbox:e(t),o=[],a=this._chooseSubtree(r,this.data,i,o);for(a.children.push(t),h(a.bbox,r);i>=0&&o[i].children.length>this._maxEntries;)this._split(o,i),i--;this._adjustParentBBoxes(r,o,i)},_split:function(t,n){var e=t[n],h=e.children.length,r=this._minEntries;this._chooseSplitAxis(e,r,h);var o=this._chooseSplitIndex(e,r,h),a={children:e.children.splice(o,e.children.length-o),height:e.height,bbox:null,leaf:!1};e.leaf&&(a.leaf=!0),i(e,this.toBBox),i(a,this.toBBox),n?t[n-1].children.push(a):this._splitRoot(e,a)},_splitRoot:function(t,n){this.data={children:[t,n],height:t.height+1,bbox:null,leaf:!1},i(this.data,this.toBBox)},_chooseSplitIndex:function(t,i,e){var h,r,o,s,l,u,f,c,d,x,p,b,M,m;for(u=f=1/0,h=i;h<=e-i;h++)r=n(t,0,h,this.toBBox),o=n(t,h,e,this.toBBox),d=r,x=o,p=void 0,b=void 0,M=void 0,m=void 0,p=Math.max(d[0],x[0]),b=Math.max(d[1],x[1]),M=Math.min(d[2],x[2]),m=Math.min(d[3],x[3]),s=Math.max(0,M-p)*Math.max(0,m-b),l=a(r)+a(o),s<u?(u=s,c=h,f=l<f?l:f):s===u&&l<f&&(f=l,c=h);return c},_chooseSplitAxis:function(t,i,n){var e=t.leaf?this.compareMinX:r,h=t.leaf?this.compareMinY:o;this._allDistMargin(t,i,n,e)<this._allDistMargin(t,i,n,h)&&t.children.sort(e)},_allDistMargin:function(t,i,e,r){t.children.sort(r);var o,a,l=this.toBBox,u=n(t,0,i,l),f=n(t,e-i,e,l),c=s(u)+s(f);for(o=i;o<e-i;o++)a=t.children[o],h(u,t.leaf?l(a):a.bbox),c+=s(u);for(o=e-i-1;o>=i;o--)a=t.children[o],h(f,t.leaf?l(a):a.bbox),c+=s(f);return c},_adjustParentBBoxes:function(t,i,n){for(var e=n;e>=0;e--)h(i[e].bbox,t)},_condense:function(t){for(var n,e=t.length-1;e>=0;e--)0===t[e].children.length?e>0?(n=t[e-1].children).splice(n.indexOf(t[e]),1):this.clear():i(t[e],this.toBBox)},_initFormat:function(t){var i=["return a"," - b",";"];this.compareMinX=new Function("a","b",i.join(t[0])),this.compareMinY=new Function("a","b",i.join(t[1])),this.toBBox=new Function("a","return [a"+t.join(", a")+"];")}},"function"==typeof define&&define.amd?define("rbush",function(){return t}):"undefined"!=typeof module?module.exports=t:"undefined"!=typeof self?self.rbush=t:window.rbush=t}();

},{}],10:[function(require,module,exports){
!function(){"use strict";var r=.5*(Math.sqrt(3)-1),e=(3-Math.sqrt(3))/6,t=1/6,a=(Math.sqrt(5)-1)/4,o=(5-Math.sqrt(5))/20;function i(r){var e;e="function"==typeof r?r:r?function(){var r=0,e=0,t=0,a=1,o=(i=4022871197,function(r){r=r.toString();for(var e=0;e<r.length;e++){var t=.02519603282416938*(i+=r.charCodeAt(e));t-=i=t>>>0,i=(t*=i)>>>0,i+=4294967296*(t-=i)}return 2.3283064365386963e-10*(i>>>0)});var i;r=o(" "),e=o(" "),t=o(" ");for(var n=0;n<arguments.length;n++)(r-=o(arguments[n]))<0&&(r+=1),(e-=o(arguments[n]))<0&&(e+=1),(t-=o(arguments[n]))<0&&(t+=1);return o=null,function(){var o=2091639*r+2.3283064365386963e-10*a;return r=e,e=t,t=o-(a=0|o)}}(r):Math.random,this.p=n(e),this.perm=new Uint8Array(512),this.permMod12=new Uint8Array(512);for(var t=0;t<512;t++)this.perm[t]=this.p[255&t],this.permMod12[t]=this.perm[t]%12}function n(r){var e,t=new Uint8Array(256);for(e=0;e<256;e++)t[e]=e;for(e=0;e<255;e++){var a=e+~~(r()*(256-e)),o=t[e];t[e]=t[a],t[a]=o}return t}i.prototype={grad3:new Float32Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1]),grad4:new Float32Array([0,1,1,1,0,1,1,-1,0,1,-1,1,0,1,-1,-1,0,-1,1,1,0,-1,1,-1,0,-1,-1,1,0,-1,-1,-1,1,0,1,1,1,0,1,-1,1,0,-1,1,1,0,-1,-1,-1,0,1,1,-1,0,1,-1,-1,0,-1,1,-1,0,-1,-1,1,1,0,1,1,1,0,-1,1,-1,0,1,1,-1,0,-1,-1,1,0,1,-1,1,0,-1,-1,-1,0,1,-1,-1,0,-1,1,1,1,0,1,1,-1,0,1,-1,1,0,1,-1,-1,0,-1,1,1,0,-1,1,-1,0,-1,-1,1,0,-1,-1,-1,0]),noise2D:function(t,a){var o,i,n=this.permMod12,f=this.perm,s=this.grad3,v=0,h=0,l=0,u=(t+a)*r,d=Math.floor(t+u),p=Math.floor(a+u),M=(d+p)*e,m=t-(d-M),c=a-(p-M);m>c?(o=1,i=0):(o=0,i=1);var y=m-o+e,w=c-i+e,g=m-1+2*e,A=c-1+2*e,x=255&d,q=255&p,D=.5-m*m-c*c;if(D>=0){var S=3*n[x+f[q]];v=(D*=D)*D*(s[S]*m+s[S+1]*c)}var U=.5-y*y-w*w;if(U>=0){var b=3*n[x+o+f[q+i]];h=(U*=U)*U*(s[b]*y+s[b+1]*w)}var F=.5-g*g-A*A;if(F>=0){var N=3*n[x+1+f[q+1]];l=(F*=F)*F*(s[N]*g+s[N+1]*A)}return 70*(v+h+l)},noise3D:function(r,e,a){var o,i,n,f,s,v,h,l,u,d,p=this.permMod12,M=this.perm,m=this.grad3,c=(r+e+a)*(1/3),y=Math.floor(r+c),w=Math.floor(e+c),g=Math.floor(a+c),A=(y+w+g)*t,x=r-(y-A),q=e-(w-A),D=a-(g-A);x>=q?q>=D?(s=1,v=0,h=0,l=1,u=1,d=0):x>=D?(s=1,v=0,h=0,l=1,u=0,d=1):(s=0,v=0,h=1,l=1,u=0,d=1):q<D?(s=0,v=0,h=1,l=0,u=1,d=1):x<D?(s=0,v=1,h=0,l=0,u=1,d=1):(s=0,v=1,h=0,l=1,u=1,d=0);var S=x-s+t,U=q-v+t,b=D-h+t,F=x-l+2*t,N=q-u+2*t,C=D-d+2*t,P=x-1+.5,T=q-1+.5,_=D-1+.5,j=255&y,k=255&w,z=255&g,B=.6-x*x-q*q-D*D;if(B<0)o=0;else{var E=3*p[j+M[k+M[z]]];o=(B*=B)*B*(m[E]*x+m[E+1]*q+m[E+2]*D)}var G=.6-S*S-U*U-b*b;if(G<0)i=0;else{var H=3*p[j+s+M[k+v+M[z+h]]];i=(G*=G)*G*(m[H]*S+m[H+1]*U+m[H+2]*b)}var I=.6-F*F-N*N-C*C;if(I<0)n=0;else{var J=3*p[j+l+M[k+u+M[z+d]]];n=(I*=I)*I*(m[J]*F+m[J+1]*N+m[J+2]*C)}var K=.6-P*P-T*T-_*_;if(K<0)f=0;else{var L=3*p[j+1+M[k+1+M[z+1]]];f=(K*=K)*K*(m[L]*P+m[L+1]*T+m[L+2]*_)}return 32*(o+i+n+f)},noise4D:function(r,e,t,i){var n,f,s,v,h,l,u,d,p,M,m,c,y,w,g,A,x,q=this.perm,D=this.grad4,S=(r+e+t+i)*a,U=Math.floor(r+S),b=Math.floor(e+S),F=Math.floor(t+S),N=Math.floor(i+S),C=(U+b+F+N)*o,P=r-(U-C),T=e-(b-C),_=t-(F-C),j=i-(N-C),k=0,z=0,B=0,E=0;P>T?k++:z++,P>_?k++:B++,P>j?k++:E++,T>_?z++:B++,T>j?z++:E++,_>j?B++:E++;var G=P-(l=k>=3?1:0)+o,H=T-(u=z>=3?1:0)+o,I=_-(d=B>=3?1:0)+o,J=j-(p=E>=3?1:0)+o,K=P-(M=k>=2?1:0)+2*o,L=T-(m=z>=2?1:0)+2*o,O=_-(c=B>=2?1:0)+2*o,Q=j-(y=E>=2?1:0)+2*o,R=P-(w=k>=1?1:0)+3*o,V=T-(g=z>=1?1:0)+3*o,W=_-(A=B>=1?1:0)+3*o,X=j-(x=E>=1?1:0)+3*o,Y=P-1+4*o,Z=T-1+4*o,$=_-1+4*o,rr=j-1+4*o,er=255&U,tr=255&b,ar=255&F,or=255&N,ir=.6-P*P-T*T-_*_-j*j;if(ir<0)n=0;else{var nr=q[er+q[tr+q[ar+q[or]]]]%32*4;n=(ir*=ir)*ir*(D[nr]*P+D[nr+1]*T+D[nr+2]*_+D[nr+3]*j)}var fr=.6-G*G-H*H-I*I-J*J;if(fr<0)f=0;else{var sr=q[er+l+q[tr+u+q[ar+d+q[or+p]]]]%32*4;f=(fr*=fr)*fr*(D[sr]*G+D[sr+1]*H+D[sr+2]*I+D[sr+3]*J)}var vr=.6-K*K-L*L-O*O-Q*Q;if(vr<0)s=0;else{var hr=q[er+M+q[tr+m+q[ar+c+q[or+y]]]]%32*4;s=(vr*=vr)*vr*(D[hr]*K+D[hr+1]*L+D[hr+2]*O+D[hr+3]*Q)}var lr=.6-R*R-V*V-W*W-X*X;if(lr<0)v=0;else{var ur=q[er+w+q[tr+g+q[ar+A+q[or+x]]]]%32*4;v=(lr*=lr)*lr*(D[ur]*R+D[ur+1]*V+D[ur+2]*W+D[ur+3]*X)}var dr=.6-Y*Y-Z*Z-$*$-rr*rr;if(dr<0)h=0;else{var pr=q[er+1+q[tr+1+q[ar+1+q[or+1]]]]%32*4;h=(dr*=dr)*dr*(D[pr]*Y+D[pr+1]*Z+D[pr+2]*$+D[pr+3]*rr)}return 27*(n+f+s+v+h)}},i._buildPermutationTable=n,"undefined"!=typeof define&&define.amd&&define(function(){return i}),"undefined"!=typeof exports?exports.SimplexNoise=i:"undefined"!=typeof window&&(window.SimplexNoise=i),"undefined"!=typeof module&&(module.exports=i)}();

},{}]},{},[1])
//# sourceMappingURL=bundle.js.map
