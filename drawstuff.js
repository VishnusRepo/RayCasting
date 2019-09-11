/* classes */

// Color constructor
class Color {
    constructor(r,g,b,a) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0))
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255))
                throw "color component bigger than 255";
            else {
                this.r = r; this.g = g; this.b = b; this.a = a;
            }
        } // end try

        catch (e) {
            console.log(e);
        }
    } // end Color constructor

        // Color change method
    change(r,g,b,a) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0))
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255))
                throw "color component bigger than 255";
            else {
                this.r = r; this.g = g; this.b = b; this.a = a;
            }
        } // end throw

        catch (e) {
            console.log(e);
        }
    } // end Color change method
} // end color class


/* utility functions */

// draw a pixel at x,y using color
function drawPixel(imagedata,x,y,color) {
    try {
        if ((typeof(x) !== "number") || (typeof(y) !== "number"))
            throw "drawpixel location not a number";
        else if ((x<0) || (y<0) || (x>=imagedata.width) || (y>=imagedata.height))
            throw "drawpixel location outside of image";
        else if (color instanceof Color) {
            var pixelindex = (y*imagedata.width + x) * 4;
            imagedata.data[pixelindex] = color.r;
            imagedata.data[pixelindex+1] = color.g;
            imagedata.data[pixelindex+2] = color.b;
            imagedata.data[pixelindex+3] = color.a;
            console.log("real");
        } else
            throw "drawpixel color is not a Color";
    } // end try

    catch(e) {
        console.log(e);
    }
} // end drawPixel

//get the input boxex from the standard class URL
function getInputBoxes() {
    const INPUT_BOXES_URL =
        "https://ncsucgclass.github.io/prog1/boxes.json";

    // load the boxes file
    var httpReq = new XMLHttpRequest(); // a new http request
    httpReq.open("GET",INPUT_BOXES_URL,false); // init the request
    httpReq.send(null); // send the request
    var startTime = Date.now();
    while ((httpReq.status !== 200) && (httpReq.readyState !== XMLHttpRequest.DONE)) {
        if ((Date.now()-startTime) > 3000)
            break;
    } // until its loaded or we time out after three seconds
    if ((httpReq.status !== 200) || (httpReq.readyState !== XMLHttpRequest.DONE)) {
        console.log*("Unable to open input boxes file!");
        return String.null;
    } else
        return JSON.parse(httpReq.response);
} // end get input boxes


// put random points in the boxes from the class github
function corelogic(context) {
    var inputBoxes = getInputBoxes();
    var w = context.canvas.width;
    var h = context.canvas.height;
    var imagedata = context.createImageData(w,h);
console.log(inputBoxes[0].lx);
console.log(typeof(inputBoxes[0].lx));
var counter = 0;
    for(let y=0; y<=1; y=y+1/h)
    {
      for(let x=0; x<=1; x=x+1/w)
      {
        //real pixel locations
        var pixelX = x*w;
        var pixelY = y*h;

        //screen location px, py, pz
        var px = 0 + x * 1;
        var py = 0 + y * 1;
        var pz = 0;

        //eye coordinates
        var eyeX = 0.5;
        var eyeY = 0.5;
        var eyeZ = -0.5;

        //ray direction coordinates
        var rayX = px - eyeX;
        var rayY = py - eyeY;
        var rayZ = pz - eyeZ;
        for(var b=0;b<inputBoxes.length;b++)
        {
          var tlx = (inputBoxes[b].lx - eyeX)/rayX;
          var tly = (inputBoxes[b].rx - eyeX)/rayX;
          var tby = (inputBoxes[b].by - eyeY)/rayY;
          var tty = (inputBoxes[b].ty - eyeY)/rayY;
          var tfz = (inputBoxes[b].fz - eyeZ)/rayZ;
          var tbz = (inputBoxes[b].rz - eyeZ)/rayZ;
//console.log(tlx);
          var tx0 = Math.min(tlx, tly);
        //console.log("tx0: "+tx0);
          var tx1 = Math.max(tlx, tly);
          var ty0 = Math.min(tby, tty);
          var ty1 = Math.max(tby, tty);
          var tz0 = Math.min(tfz, tbz);
          var tz1 = Math.max(tfz, tbz);
//console.log(tx0 + ","+ty0+","+tz0);
          var t0 = Math.max(tx0,ty0, tz0);
          var t1 = Math.min(tx1,ty1, tz1);
//console.log("t0: " + t0);
//console.log("t1: " + t1);
          if(t0<=t1)
          {
            console.log("yo");
            var c = new Color(0,0,0,0);
            c.change(inputBoxes[b]["diffuse"][0]*255,
                    inputBoxes[b]["diffuse"][1]*255,
                    inputBoxes[b]["diffuse"][2]*255,255);
            drawPixel(imagedata, pixelX, pixelY, c);
          }
        //console.log(counter++);
        }
      }
    }
    context.putImageData(imagedata, 0, 0);
}

function main() {

    // Get the canvas and context
    var canvas = document.getElementById("viewport");
    var context = canvas.getContext("2d");

    corelogic(context);
}
