var scrollTimer = -1;
var oldScroll=0;
var isRight;
var positionM=0;
window.onscroll = function(e) {
  // print "false" if direction is down and "true" if up
  if(this.oldScroll > this.scrollY)
  {
    document.getElementById("mario").className="marioRunL";
  }
  else
  {
    document.getElementById("mario").className="marioRunR";
  }
  if (scrollTimer != -1){                 
       clearTimeout(scrollTimer);
  }
      //position of 
    positionM=parseInt((scrollY/(document.body.scrollHeight-document.body.clientHeight))*100);
    document.getElementById("mario").style.left=positionM+"%";
    //console.log(positionM);

    scrollTimer = window.setTimeout("scrollFinished()", 350);
  this.oldScroll = this.scrollY;
}
function scrollFinished() {
   document.getElementById("mario").className="mariofaceR";
}
//add code for left and right on scroll up and down
//document.getElementById("mario").classList.add("marioRun");
var isInViewport = function (elem) {
  var distance = elem.getBoundingClientRect();
  return (
    distance.top >= 0 &&
    distance.left >= 0 &&
    distance.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    distance.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
  //is section displaying in viewport works now
};
function getScrollbarWidth() {
    // Creating invisible container
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll'; // forcing scrollbar to appear
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    document.body.appendChild(outer);
    // Creating inner element and placing it in the container
    const inner = document.createElement('div');
    outer.appendChild(inner);
    // Calculating difference between container's full width and the child width
    const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);
    // Removing temporary elements from the DOM
    outer.parentNode.removeChild(outer);
    return scrollbarWidth;
    }


    $(window).scroll(function(){
      var scroll = $(window).scrollTop(),
      dh=$(document).height(),
      wh=$(window).height(),
      //value=(scroll/(dh-wh)) * 100;
      value=(scrollY/(document.body.scrollHeight-document.body.clientHeight))*100;
     console.log(value);
      $('#container').css('left',-value * 6  + '%');
      containerSize=parseFloat($('#container').css('left'));
      if(parseInt(Math.round(value))==100){
        console.log("loading extra space");
        $('#container').css('left',containerSize-(6*getScrollbarWidth()));
      }

    //  console.log(containerSize);
    })
    function scrolltoY(num)
    {
      var toSubtract=getScrollbarWidth()*num;
      var bruh=100/6;
      num=num*bruh;
      console.log(num);
      var bleh=document.body.scrollHeight-document.body.clientHeight;
      var scrollAm=(num*bleh)/100;
      window.scrollTo(0,scrollAm+toSubtract);
    }

    function changeYPos()
    {
      var marioPos=parseInt($("#mario").position().top)-51;
      marioPos=marioPos+"px";
      console.log(marioPos);
      const demoClasses = document.querySelectorAll('.bottomTile');
      demoClasses.forEach(element => {
        element.style.top=marioPos;
      });
      const bruhClasses = document.querySelectorAll('.UbottomTile');
      bruhClasses.forEach(element => {
        element.style.top=marioPos;
      });
      set
    }
