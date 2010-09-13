// USE http://ted.mielczarek.org/code/mozilla/bookmarklet.html TO REDUCE

// ================================START================================
// HTML Elements for injection.
var head=document.getElementsByTagName('head')[0];  // doc head
var script = document.createElement('script');      // script element
// MHN Charting Script Source -- script to inject.
script.src="http://dev.mhnltd.co.uk/charting.js";
// set to true once script init is complete, to guard re-init.
var initComplete=false;
// function called to initialise script after injection.
var initFunc = 
  function()
  {
    if
      (
        !initComplete &&
        (
          !this.readyState ||
          // different readyState states for different browsers
          this.readyState == 'loaded' ||
          this.readyState == 'complete'
        )
      )
    {
      // avoid multiple triggerings due to races.
      initComplete=true;
      // call main entry function for charting.
      mhnChartingMain();
      // avoid re-init by removing reference to this func.
      script.onload = null;
      script.onreadystatechange = null;
      // remove init script element.
      head.removeChild(script);
    }
  };
script.onload = initFunc;
script.onreadystatechange = initFunc;

// add script to head of page.
head.appendChild(script);
//===============================END======================================