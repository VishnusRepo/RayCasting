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

function normalize(v)
{
  var base = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
  var normalized = [v[0]/base, v[1]/base, v[2]/base];
  return normalized;
}

function dotproduct(A, B)
{
  var ret = 0;
  for(var i=0;i<A.length;i++)
  {
    ret+=A[i]*B[i];
  }
  return ret;
}

function smallest(arr)
{
  var minIndex = -1;
  var min = 1000000000;
  for(var i=0;i<arr.length;i++)
  {
    if(arr[i]<min)
    {
      min = arr[i];
      minIndex = i;
    }
  }
  //console.log("smallest ret: " + minIndex);
  return minIndex;
}

// put random points in the boxes from the class github
function corelogic(context) {
    var inputBoxes = getInputBoxes();
    var w = context.canvas.width;
    var h = context.canvas.height;
    var imagedata = context.createImageData(w,h);
    var UL = [0,1,0];
    var LL = [0,0,0];
    var UR = [1,1,0];
    var LR = [1,0,0];
    var light = [-0.5, 1.5, -0.5];
    var lightColor = [1, 1, 1];
//console.log(inputBoxes[0].lx);
//console.log(typeof(inputBoxes[0].lx));
//var counter = 0;
    for(let y=1; y>=0; y=y-1/h)
    {
      for(let x=0; x<=1; x=x+1/w)
      {
        //real pixel locations
        var pixelX = x*w;
        var pixelY = y*h;

        //screen location px, py, pz
        var plx = UL[0] + y * (LL[0] - UL[0]);
        var prx = UR[0] + y * (LR[0] - UR[0]);
        var px = plx + x * (prx - plx);

        var ply = UL[1] + y * (LL[1] - UL[1]);
        var pry = UR[1] + y * (LR[1] - UR[1]);
        var py = ply + x * (pry - ply);

        var plz = UL[2] + y * (LL[2] - UL[2]);
        var prz = UR[2] + y * (LR[2] - UR[2]);
        var pz = plz + x * (prz - plz);
        //var pz = 0;

        //eye coordinates
        var eyeX = 0.5;
        var eyeY = 0.5;
        var eyeZ = -0.5;

        //ray direction coordinates
        var rayX = px - eyeX;
        var rayY = py - eyeY;
        var rayZ = pz - eyeZ;

        var objdists = [];
        var colors = [];

        for(var b=0;b<inputBoxes.length;b++)
        {
			/*
          var tlx = (inputBoxes[b].lx - eyeX)/rayX;
          var trx = (inputBoxes[b].rx - eyeX)/rayX;
          var tby = (inputBoxes[b].by - eyeY)/rayY;
          var tty = (inputBoxes[b].ty - eyeY)/rayY;
          var tfz = (inputBoxes[b].fz - eyeZ)/rayZ;
          var trz = (inputBoxes[b].rz - eyeZ)/rayZ;
//console.log(tlx);
          var tx0 = Math.min(tlx, trx);
        //console.log("tx0: "+tx0);
          var tx1 = Math.max(tlx, trx);
          var ty0 = Math.min(tby, tty);
          var ty1 = Math.max(tby, tty);
          var tz0 = Math.min(tfz, trz);
          var tz1 = Math.max(tfz, trz);
//console.log(tx0 + ","+ty0+","+tz0);
          var t0 = Math.max(tx0,ty0, tz0);
          var t1 = Math.min(tx1,ty1, tz1);
		  */
//console.log("t0: " + t0);
//console.log("t1: " + t1);
			var t0 = Number.MIN_VALUE;
			var t1 = Number.MAX_VALUE;
			if (rayX != 0)
			{
				var tlx = (inputBoxes[b].lx - eyeX)/rayX;
				var trx = (inputBoxes[b].rx - eyeX)/rayX;
				var tx0 = Math.min(tlx, trx);
				var tx1 = Math.max(tlx, trx);
				t0 = Math.max(t0, tx0);
				t1 = Math.min(t1, tx1);
			}
			if (rayY != 0)
			{
				var tby = (inputBoxes[b].by - eyeY)/rayY;
				var tty = (inputBoxes[b].ty - eyeY)/rayY;
				var ty0 = Math.min(tby, tty);
				var ty1 = Math.max(tby, tty);
				t0 = Math.max(t0, ty0);
				t1 = Math.min(t1, ty1);
			}
			if (rayZ != 0)
			{
				var tfz = (inputBoxes[b].fz - eyeZ)/rayZ;
				var trz = (inputBoxes[b].rz - eyeZ)/rayZ;
				var tz0 = Math.min(tfz, trz);
				var tz1 = Math.max(tfz, trz);
				t0 = Math.max(t0, tz0);
				t1 = Math.min(t1, tz1);
			}

          if(t0<=t1 && rayX!=0 && rayY!=0 && rayZ!=0)
          {
            //console.log("yo");

            //deduce intersection points on box
            var intrX = eyeX + t0 * rayX;
            var intrY = eyeY + t0 * rayY;
            var intrZ = eyeZ + t0 * rayZ;

            var N = [0,0,0];
            //console.log("Coordinates: " + intrX + "; " + intrY + "; " + intrZ);
            //identify normal vector to point (intrX, intrY, intrZ)
            var close = smallest([Math.abs(inputBoxes[b].lx-intrX), Math.abs(inputBoxes[b].rx-intrX),
            Math.abs(inputBoxes[b].by-intrY), Math.abs(inputBoxes[b].ty-intrY),
              Math.abs(inputBoxes[b].fz-intrZ), Math.abs(inputBoxes[b].rz-intrZ)]);

            if(close==0)
            {
              N[0] = -1 * inputBoxes[b].lx;
              //console.log("lx");
            }
            else if(close==1)
            {
              N[0] = inputBoxes[b].rx;
              //console.log("intrX: "+intrX);
              //console.log(inputBoxes[b].rx);
              //console.log("rx");
            }
            else if(close==2)
            {
              N[1] = -1 * inputBoxes[b].by;
              //console.log("by");
            }
            else if(close==3)
            {
              N[1] = inputBoxes[b].ty;
              //console.log("ty");
            }
            else if(close==4)
            {
              N[2] = -1 * inputBoxes[b].fz;
              //console.log("fz");
            }
            else
            {
              N[2] = inputBoxes[b].rz;
              //console.log("rz");
            }

            N = normalize(N);

            //eye vector
            var V = normalize([eyeX-intrX, eyeY-intrY, eyeZ-intrZ]);

            //light vector
            var L = normalize([light[0]-intrX, light[1]-intrY, light[2]-intrZ]);

            //Half vector
            var H = normalize([V[0]+L[0], V[1]+L[1], V[2]+L[2]]);

            var c = new Color(0,0,0,0);
/*Part 1            c.change(inputBoxes[b]["diffuse"][0]*255,
                    inputBoxes[b]["diffuse"][1]*255,
                    inputBoxes[b]["diffuse"][2]*255,255);
*/

            var red = inputBoxes[b]["ambient"][0]*lightColor[0]
            + inputBoxes[b]["diffuse"][0]*lightColor[0]*dotproduct(N,L)
            + inputBoxes[b]["specular"][0]*lightColor[0]*Math.pow(dotproduct(N,H), inputBoxes[b]["n"]);

            if (red<0) red = 0;
            else if (red>1) red = 1;

            var green = inputBoxes[b]["ambient"][1]*lightColor[1]
            + inputBoxes[b]["diffuse"][1]*lightColor[1]*dotproduct(N,L)
            + inputBoxes[b]["specular"][1]*lightColor[1]*Math.pow(dotproduct(N,H), inputBoxes[b]["n"]);

            if (green<0) green = 0;
            else if (green>1) green = 1;

            var blue = inputBoxes[b]["ambient"][2]*lightColor[2]
            + inputBoxes[b]["diffuse"][2]*lightColor[2]*dotproduct(N,L)
            + inputBoxes[b]["specular"][2]*lightColor[2]*Math.pow(dotproduct(N,H), inputBoxes[b]["n"]);

            if (blue<0) blue = 0;
            else if (blue>1) blue = 1;

            //console.log("red: " + red + ", green: " + green + ", blue: " + blue);

            red = Math.round(red*255);
            green = Math.round(green*255);
            blue = Math.round(blue*255);


            //c.change(red*255, green*255, blue*255, 255);
            c.change(red, green, blue, 255);
            objdists.push(t0);
            colors.push(c);
//            console.log(objs[t0]);
            //drawPixel(imagedata, pixelX, pixelY, c);
          }
/*          else {//Color pixel black
            var c = new Color(0,0,0,0);
            c.change(0,0,0,255);
            drawPixel(imagedata, pixelX, pixelY, c);
          }*/
        //console.log(counter++);
        }
        //chose closest object Color
        var closestDist = 1000000000;
        var pickedColor = new Color(0, 0, 0, 0);
        //console.log(objs);
        for(var i=0; i<objdists.length; i++)
        {
          if (closestDist > objdists[i])
          {
            closestDist = objdists[i];
            pickedColor = colors[i];
          }
        }
        drawPixel(imagedata, pixelX, pixelY, pickedColor);
      }
    }
    context.putImageData(imagedata, 0, 0);
}

function main() {
  document.body.style.backgroundColor = "black";

    // Get the canvas and context
    var canvas = document.getElementById("viewport");
    var context = canvas.getContext("2d");

    corelogic(context);
}
