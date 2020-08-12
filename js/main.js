$(document).ready(function(){

    // Make Secondary Dropdown on Click
    $('.dropdown-submenu a.dropdown-submenu-toggle').on("click", function(e){
      $('.dropdown-submenu ul').removeAttr('style');
      $(this).next('ul').toggle();
      e.stopPropagation();
      e.preventDefault();
   });
 
   // Make Secondary Dropdown on Hover
   $('.dropdown-submenu a.dropdown-submenu-toggle').hover(function(){
      $('.dropdown-submenu ul').removeAttr('style');
      $(this).next('ul').toggle();
   });
 
   // Make Regular Dropdowns work on Hover too
   $('.dropdown a.dropdown-toggle').hover(function(){
      $('.navbar-nav .dropdown').removeClass('open');
      $(this).parent().addClass('open');
   });
 
   // Clear secondary dropdowns on.Hidden
   $('#bs-navbar-collapse-1').on('hidden.bs.dropdown', function () {
      $('.navbar-nav .dropdown-submenu ul.dropdown-menu').removeAttr('style');
   });
  // Initialize Tooltip
  $('[data-toggle="tooltip"]').tooltip();

  // Add smooth scrolling to all links in navbar + footer link
  $(".navbar a, footer a[href='#myPage']").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {

      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (900) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 900, function(){

        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });
})
