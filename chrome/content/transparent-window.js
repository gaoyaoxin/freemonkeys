var gTransparentWindow = {
  minWidth : 720,
  minHeight : 500,
  
  get prefs () {
    delete this.prefs;
    var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
    this.prefs = prefs.getBranch("freemonkeys.");
    return this.prefs;
  },
  
  resizers : {
    get top () {
      delete this.top;
      this.top = document.getElementById("sizer-top");
      return this.top;
    },
    get left () {
      delete this.left;
      this.left = document.getElementById("sizer-left");
      return this.left;
    },
    get right () {
      delete this.right;
      this.right = document.getElementById("sizer-right");
      return this.right;
    },
    get bottom () {
      delete this.bottom;
      this.bottom = document.getElementById("sizer-bottom");
      return this.bottom;
    },
  }
  
};


gTransparentWindow.ondragDown = function (event) {
  
  var initialEventX = event.screenX;
  var initialEventY = event.screenY;
  
  var initialX = window.screenX;
  var initialY = window.screenY;
  
  function move(event) {
    var diffX = event.screenX-initialEventX;
    var diffY = event.screenY-initialEventY;
    
    window.moveTo(initialX+diffX, initialY+diffY);
    
    event.stopPropagation();
    event.preventDefault();
  }
  document.addEventListener("mousemove", move,true);
  document.addEventListener("mouseup", function () {
    document.removeEventListener("mouseup",arguments.callee,true);
    document.removeEventListener("mousemove",move,true);
  },true);
  
  event.stopPropagation();
  event.preventDefault();
}

gTransparentWindow.sizerClick = function (event) {
  var sizer = event.originalTarget;
  if (!sizer) return;
  
  var isHorizontal = sizer.className.match(/horizontal/);
  var isVertical = sizer.className.match(/vertical/);
  
  var isMoving = sizer.className.match(/left|top/);
  var resizingFactor = sizer.className.match(/bottom|right/)?1:-1;
  
  var initialEventX = event.screenX;
  var initialEventY = event.screenY;
  
  var initialX = window.screenX;
  var initialY = window.screenY;
  
  var initialWidth = window.outerWidth;
  var initialHeight = window.outerHeight;
  
  function move(event) {
    var diffX = event.screenX-initialEventX;
    var diffY = event.screenY-initialEventY;
    if (isMoving) {
      window.moveTo(initialX+diffX, initialY+diffY);
    }
    
    var width = initialWidth+resizingFactor*diffX
    width = Math.max(gTransparentWindow.minWidth, width);
    var height = initialHeight+resizingFactor*diffY;
    height = Math.max(gTransparentWindow.minHeight, height);
    window.resizeTo(width, height);
    
    event.stopPropagation();
    event.preventDefault();
  }
  document.addEventListener("mousemove", move,true);
  document.addEventListener("mouseup", function () {
    document.removeEventListener("mouseup",arguments.callee,true);
    document.removeEventListener("mousemove",move,true);
  },true);
  
  event.stopPropagation();
  event.preventDefault();
}

gTransparentWindow.registerSizer = function (sizer) {
  sizer.addEventListener("mousedown",function (event) {
      gTransparentWindow.sizerClick(event);
    },false);
}

gTransparentWindow.saveWindowParams = function () {
  this.prefs.setIntPref("window.x",window.screenX);
  this.prefs.setIntPref("window.y",window.screenY);
  this.prefs.setIntPref("window.width",window.outerWidth);
  this.prefs.setIntPref("window.height",window.outerHeight);
}

gTransparentWindow.restoreWindowParams = function () {
  window.screenX = this.prefs.getIntPref("window.x");
  window.screenY = this.prefs.getIntPref("window.y");
  window.outerWidth = this.prefs.getIntPref("window.width");
  window.outerHeight = this.prefs.getIntPref("window.height");
}


gTransparentWindow.onload = function () {
  this.restoreWindowParams();
  var sizers = document.getElementsByClassName("sizer");
  for(var i=0; i<sizers.length; i++) {
    this.registerSizer(sizers[i]);
  }
  window.focus();
}

gTransparentWindow.onunload = function () {
  this.saveWindowParams();
}


window.addEventListener("load",function () {
  window.removeEventListener("load",arguments.callee,false);
  gTransparentWindow.onload();
},false);
window.addEventListener("unload",function () {
  gTransparentWindow.onunload();
},false);