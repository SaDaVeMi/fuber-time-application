var WIDTH;
var HEIGHT;
var canvas;
var con;
var g;
var pxs = [];
var rint = 100;

//@author Florian Bruderer, copied from source: www.stackoverflow.com

//********************** This class is used for the moving textboxes on Starting page **********************

function Random(min, max) {
  return Math.random() * (max - min) + min;
}

function isCollide(a, b) {
    return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );
}

$(document).ready(function(){
	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight;
	$('#container').width(WIDTH).height(HEIGHT);
	canvas = document.getElementById('particles');
	$(canvas).attr('width', WIDTH).attr('height',HEIGHT);
  
  $('.wrap').each(function() {
    var l = Random(25, WIDTH - 100);
    var t = Random(25, HEIGHT - 250);
    $(this).offset({top: t, left: l});
  });
  
  
});

setInterval(function() {
  $('.wrap').each(function() {
    
    var l = Random(25, WIDTH - 100);
    var t = Random(25, HEIGHT - 250);
    $(this).offset({top: t, left: l});
  });
}, 25000);


//Clock
setInterval(showTime,1000);
function showTime() {
    let today = new Date();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();
	const time = `${hours} : ${minutes} : ${seconds} `;
    document.getElementById('clock').innerHTML = time;

}
showTime();


