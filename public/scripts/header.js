let previousPosition = window.pageYOffset || document.documentElement.scrollTop; // previous scroll position
let is_header_fixed = false;

window.addEventListener("scroll", function () {
  var currentPosition =
    window.pageYOffset || document.documentElement.scrollTop; // current scroll position
  if (currentPosition <= 0) {
    document.querySelector("header").style.position = "absolute";
    document.querySelector("header").style.boxShadow =
      "0px 0px rgba(0, 0, 0, 0.1)";
    is_header_fixed = false;
  } else if (
    currentPosition > previousPosition &&
    currentPosition > document.querySelector("header").clientHeight &&
    !is_header_fixed
  ) {
    document.querySelector("header").style.transition =
      "box-shadow 0.35s 0.1s";
    document.querySelector("header").style.top = "-90px";
    document.querySelector("header").style.position = "fixed";
    this.setTimeout(function () {
      document.querySelector("header").style.transition =
        "box-shadow 0.35s 0.1s, top 0.35s ease-in-out 0.1s";
      document.querySelector("header").style.top = "0px";
      document.querySelector("header").style.boxShadow =
        "5px 0px 20px rgba(0, 0, 0, 0.1)";
    }, 10);
    is_header_fixed = true;
  }
  previousPosition = currentPosition; // previous scroll position
});