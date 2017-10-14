var searchVisible = 0;
var transparent = true;

var transparentDemo = true;
var fixedTop = false;

var mobile_menu_visible = 0,
    mobile_menu_initialized = false,
    toggle_initialized = false,
    bootstrap_nav_initialized = false;

var seq = 0,
    delays = 80,
    durations = 500;
var seq2 = 0,
    delays2 = 80,
    durations2 = 500;


$(document).ready(function() {


  //Click dropdown
    // $('#showPanel').click(function() {
    //     //get data-for attribute
    //     var dataFor = $(this).attr('data-for');
    //     var idFor = $(dataFor);
    //     idFor.slideToggle(400)
    // });

    //displaying popoover
    //  $('[data-toggle="popover"]').popover({
    //    placement:'bottom',
    //    title:"hey",
    //    content:"hello world!"
    //  });

    $sidebar = $('.sidebar');
// $('.pop1').popover({
//      placement: 'bottom',
//      html: 'true',
//      title : 'Profile',
//      content : '<button type="button" id="close" class="close" onclick="$(&quot;#example&quot;).popover(&quot;hide&quot;);">&times;</button>'+
//                '<a href="/logout"> Logout</a>'
//    });
  //    $.material.init();
  //sidebar collapse code
  $('#sidebarCollapse').on('click', function () {
      $('#sideBar').toggleClass('active');
  });


    window_width = $(window).width();

    md.initSidebarsCheck();

    // check if there is an image set for the sidebar's background
    md.checkSidebarImage();

    //  Activate the tooltips
    $('[rel="tooltip"]').tooltip();

    $('.form-control').on("focus", function() {
        $(this).parent('.input-group').addClass("input-group-focus");
    }).on("blur", function() {
        $(this).parent(".input-group").removeClass("input-group-focus");
    });

    //create card fon click function
    // $('#cardText').click('showDiv')

});

function showDiv(event){
document.getElementById('cardTitle').style="display:block";
document.getElementById('createCardsFooter').style="display:block";
}

//hide panels
$('.panel').hide()
 //
 // $(document).ready(function(){
  //  $("#person-info").popover({
  //    placement: 'bottom',
  //    html: 'true',
  //    title : 'Profile',
  //    content : '<button type="button" id="close" class="close" onclick="$(&quot;#example&quot;).popover(&quot;hide&quot;);">&times;</button>'+
  //              '<a href="/logout"> Logout</a>'
  //  });
 //
 // })


$(document).on('click', '.navbar-toggle', function() {
    $toggle = $(this);

    if (mobile_menu_visible == 1) {
        $('html').removeClass('nav-open');

        $('.close-layer').remove();
        setTimeout(function() {
            $toggle.removeClass('toggled');
        }, 400);

        mobile_menu_visible = 0;
    } else {
        setTimeout(function() {
            $toggle.addClass('toggled');
        }, 430);

        div = '<div id="bodyClick"></div>';
        $(div).appendTo('body').click(function() {
            $('html').removeClass('nav-open');
            mobile_menu_visible = 0;
            setTimeout(function() {
                $toggle.removeClass('toggled');
                $('#bodyClick').remove();
            }, 550);
        });

        $('html').addClass('nav-open');
        mobile_menu_visible = 1;

    }
});

// activate collapse right menu when the windows is resized
$(window).resize(function() {
    md.initSidebarsCheck();
    // reset the seq for charts drawing animations
    seq = seq2 = 0;
});

md = {
    misc: {
        navbar_menu_visible: 0,
        active_collapse: true,
        disabled_collapse_init: 0,
    },

    checkSidebarImage: function() {
        $sidebar = $('.sidebar');
        image_src = $sidebar.data('image');

        if (image_src !== undefined) {
            sidebar_container = '<div class="sidebar-background" style="background-image: url(' + image_src + ') "/>'
            $sidebar.append(sidebar_container);
        }
    },

    checkScrollForTransparentNavbar: debounce(function() {
        if ($(document).scrollTop() > 260) {
            if (transparent) {
                transparent = false;
                $('.navbar-color-on-scroll').removeClass('navbar-transparent');
            }
        } else {
            if (!transparent) {
                transparent = true;
                $('.navbar-color-on-scroll').addClass('navbar-transparent');
            }
        }
    }, 17),

    initSidebarsCheck: function() {
        if ($(window).width() <= 991) {
            if ($sidebar.length != 0) {
                md.initRightMenu();
            }
        }
    },

    initRightMenu: debounce(function() {
        $sidebar_wrapper = $('.sidebar-wrapper');

        if (!mobile_menu_initialized) {
            $navbar = $('nav').find('.navbar-collapse').children('.navbar-nav.navbar-right');

            mobile_menu_content = '';

            nav_content = $navbar.html();

            nav_content = '<ul class="nav nav-mobile-menu">' + nav_content + '</ul>';

            navbar_form = $('nav').find('.navbar-form').get(0).outerHTML;

            $sidebar_nav = $sidebar_wrapper.find(' > .nav');

            // insert the navbar form before the sidebar list
            $nav_content = $(nav_content);
            $navbar_form = $(navbar_form);
            $nav_content.insertBefore($sidebar_nav);
            $navbar_form.insertBefore($nav_content);

            $(".sidebar-wrapper .dropdown .dropdown-menu > li > a").click(function(event) {
                event.stopPropagation();

            });

            // simulate resize so all the charts/maps will be redrawn
            window.dispatchEvent(new Event('resize'));

            mobile_menu_initialized = true;
        } else {
            if ($(window).width() > 991) {
                // reset all the additions that we made for the sidebar wrapper only if the screen is bigger than 991px
                $sidebar_wrapper.find('.navbar-form').remove();
                $sidebar_wrapper.find('.nav-mobile-menu').remove();

                mobile_menu_initialized = false;
            }
        }
    }, 200)
}


// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
    };
};

function openNav() {
    document.getElementById("sideBar").style.width = "250px";
    document.getElementById("mainPanel").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("sideBar").style.width = "0";
    document.getElementById("mainPanel").style.marginLeft= "0";
}

// function showPanel(){
//   $('.panel').slideToggle('show');
// }
