/*
-------------------------------------------------------------------------
* Template Name    : tomillo - Multi Purpose Angular Business Template  *
* Author           : ParExcellence                                      *
* Version          : 1.0.0                                              *
* File Description : Main js file of the template                       *
*------------------------------------------------------------------------
*/
$(document).ready(function () {
  "use strict";

  /*----JQUERY EASING FIX-----*/
  if ($.easing) {
    $.extend($.easing, {
      easeInOutExpo: function (x) {
        return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
      }
    });
  }


  /*----TYPED JS-----*/
  (function ($) {
    $(".typed").typed({
      strings: ["Your Journey to Success Starts Here with Featec."],
      stringsElement: null,
      typeSpeed: 30,
      startDelay: 1200,
      backSpeed: 20,
      backDelay: 500,
      loop: true,
      loopCount: 5,
      showCursor: false,
      cursorChar: "|",
      attr: null,
      contentType: 'html',
      callback: function () { },
      preStringTyped: function () { },
      onStringTyped: function () { },
      resetCallback: function () { }
    });
  })(jQuery);

  /*----DROPDOWN HOVER JS-----*/
  (function ($) {
    var viewPortWidth = jQuery(window).width();
    if (viewPortWidth > 991) {
      $(".dropdown").on('mouseover', function () {
        $('.dropdown-menu', this).stop(true, true).fadeIn("fast");
        $(this).addClass('open');
      });
      $(".dropdown").on('mouseleave', function () {
        $('.dropdown-menu', this).stop(true, true).fadeOut("fast");
        $(this).removeClass('open');
      });
    }
  })(jQuery);

  /*----ENLLAX SCROLLING JS-----*/
  (function ($) {
    $('.scroll-title').enllax();
  })(jQuery);

  /*----TESTIMONIAL SLIDER-----*/
  (function ($) {
    var testimonialCarousel = $('.client-slider');
    if (testimonialCarousel.length > 0) {
      testimonialCarousel.owlCarousel({
        margin: 0,
        loop: true,
        nav: true,
        center: false,
        dots: false,
        autoplay: true,
        autoplayTimeout: 5000,
        items: 3,
        responsiveClass: true,
        navText: ['<span class="mdi mdi-arrow-left"></span>', '<span class="mdi mdi-arrow-right"></span>'],
        responsive: {
          0: {
            items: 1,
          },
          600: {
            items: 2,
          },
          1000: {
            items: 3,
          }
        }
      });
    }
  })(jQuery);

  /*----ACCORDIAN JS-----*/
  (function ($) {
    $(".question-card").on('click', function () {
      if ($(this).hasClass('active')) {
        $('.question-card').removeClass('active');
        $(this).removeClass('active')
      } else {
        $('.question-card').removeClass('active');
        $(this).addClass('active')
      }
    });
  })(jQuery);

  /*----ISOTOP JS-----*/
  if (('.portfolio-items').length > 0) {
    var $container = $('.portfolio-items');
    var $filter = $('#portfolio-filter');
    $container.isotope({
      filter: '*',
      layoutMode: 'masonry',
      animationOptions: {
        duration: 750,
        easing: 'linear'
      }
    });
    $filter.find('a').on("click", function () {
      var selector = $(this).attr('data-filter');
      $filter.find('a').removeClass('active');
      $(this).addClass('active');
      $container.isotope({
        filter: selector,
        animationOptions: {
          animationDuration: 750,
          easing: 'linear',
          queue: false,
          touchSensitivity: 2,
        }
      });
      return false;
    });
  }

  /*----MAGNIFIC POPUP JS-----*/
  if (('.portfolio-items').length > 0) {
    $('.portfolio-items').each(function () {
      $(this).magnificPopup({
        delegate: '.js-zoom-gallery',
        type: 'image',
        gallery: {
          enabled: true
        }
      });
    });
  }

  /*----MAP INITIALIZE FUNCTION-----*/
  initialize();
});


/*----ONSCROLL JS-----*/
$(window).on("scroll", function () {
  "use strict";

  /*----COUNTER JS-----*/
  var a = 0;
  (function ($) {
    var CounterLength = $('#counter');
    if (CounterLength.length > 0) {
      var oTop = $('#counter').offset().top - window.innerHeight;
      if (a == 0 && $(window).scrollTop() > oTop) {
        $('.counter-value').each(function () {
          var $this = $(this),
            countTo = $this.attr('data-count');
          $({
            countNum: $this.text()
          }).animate({
            countNum: countTo
          },
            {
              duration: 2000,
              easing: 'swing',
              step: function () {
                $this.text(Math.floor(this.countNum));
              },
              complete: function () {
                $this.text(this.countNum);
                //alert('finished');
              }
            });
        });
        a = 1;
      }
    }
  })(jQuery);

  var sections = $('section'),
    nav = $('.onepage-scroll'),
    nav_height = nav.outerHeight() + 25,
    win_scroll_top = $(window).scrollTop();
  win_scroll_top >= 20 ? $("nav").addClass("sticky-header") : $(".sticky").removeClass("sticky-header");
  win_scroll_top > 100 ? $(".back_top").fadeIn() : $(".back_top").fadeOut();
  /*----ON SCROLL CHANGE ACTIVE MENU-----*/
  var cur_pos = $(this).scrollTop();
  sections.each(function () {
    var top = $(this).offset().top - nav_height,
      bottom = top + $(this).outerHeight();
    if (cur_pos >= top && cur_pos <= bottom) {
      nav.find('li').removeClass('active');
      $(this).addClass('active');
      nav.find('a[href="#' + $(this).attr('id') + '"]').parent().addClass('active');
    }
  });
}), $(".menu-close-btn").on("click", function () {
  $('.navbar-collapse').removeClass('show');
}), $(".onepage-scroll .nav-item a").on("click", function (o) {
  var t = $(this);
  $('.nav-item').removeClass('active');
  $(t).parent().addClass('active');
  $("html, body").stop().animate({
    scrollTop: $(t.attr("href")).offset().top - 50
  }, 1500, "easeInOutExpo"), o.preventDefault()
}), $(document).on("click", ".navbar-collapse.show", function (o) {
  $(o.target).is("a") && $(this).collapse("hide")
}), $(".back_top").on("click", function () {
  return $("html, body").animate({
    scrollTop: 0
  }, 1e3), !1
});

/*----OTHER LINK JS-----*/
(function ($) {
  "use strict";
  $(".scroll-next, .contact_btn a").on("click", function (event) {
    var t = $(this);
    $("html, body").stop().animate({
      scrollTop: $(t.attr("href")).offset().top - 50
    }, 2000, "easeInOutExpo"), event.preventDefault()
  })
})(jQuery);


/*----MAP INITIALIZE JS-----*/

function initialize() {
  var CounterLength = $('#map');
  if (CounterLength.length > 0) {
    var map;
    var myLatlng = new google.maps.LatLng(9.948153139927184, 78.14069502550765);
    var mapOptions = {
      zoom: 15,
      center: myLatlng
    };
    map = new google.maps.Map(document.getElementById('map'),
      mapOptions);

    var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: ''
    });
  }
}
