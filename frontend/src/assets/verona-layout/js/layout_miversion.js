/**  
 * Verona Layout para React - Adaptado de PrimeFaces  
 */  
window.VeronaLayout = {  
    // Variables de instancia  
    wrapper: null,  
    topbar: null,  
    menuContainer: null,  
    menuWrapper: null,  
    menuButton: null,  
    userDisplay: null,  
    topbarMenu: null,  
    topbarLinks: null,  
    searchInput: null,  
    menulinks: null,  
    expandedMenuitems: [],  
    configButton: null,  
    configurator: null,  
    configClicked: false,  
    menuButtonClick: false,  
    menuClick: false,  
    topbarMenuButtonClick: false,  
    topbarLinkClick: false,  
    menuActive: false,  
  
    init: function() {  
        // Inicializar elementos DOM  
        this.wrapper = $(document.body).children('.layout-wrapper');  
        this.topbar = this.wrapper.children('.topbar');  
        this.menuContainer = this.wrapper.children('.layout-menu-container');  
        this.menuWrapper = this.topbar.children('.layout-menu-wrapper');  
        this.menuButton = $('#menu-button');  
        this.userDisplay = $('#user-display');  
        this.topbarMenu = $('#topbar-menu');  
        this.topbarLinks = this.topbarMenu.find('a');  
        this.searchInput = this.topbarMenu.find('input');  
        this.menulinks = this.menuWrapper.find('a');  
        this.expandedMenuitems = this.expandedMenuitems || [];  
  
        this.configButton = $('#layout-config-button');  
        this.configurator = this.wrapper.children('.layout-config');  
        this.configClicked = false;  
  
        this.bindEvents();  
          
        if(this.wrapper.hasClass('layout-menu-static') || this.wrapper.hasClass('layout-menu-overlay')) {  
            this.restoreMenuState();  
        }  
    },

       bindEvents: function() {  
        var self = this;  
          
        // Evento del botón de menú  
        this.menuButton.off('click.menubutton').on('click.menubutton', function(e) {  
            if(self.isMobile()) {  
                if(self.wrapper.hasClass('layout-menu-static')) {  
                    if(self.wrapper.hasClass('layout-menu-static-inactive')) {  
                        self.wrapper.removeClass('layout-menu-static-inactive');  
                        self.menuWrapper.addClass('layout-menu-wrapper-active');  
                        self.menuButton.addClass('menu-button-active');  
                    }  
                    else {  
                        self.wrapper.addClass('layout-menu-static-inactive');  
                        self.menuWrapper.removeClass('layout-menu-wrapper-active');  
                        self.menuButton.removeClass('menu-button-active');  
                    }  
                }  
                else {  
                    self.menuWrapper.toggleClass('layout-menu-wrapper-active');  
                    self.menuButton.toggleClass('menu-button-active');  
                }  
            }  
            else {  
                if(self.wrapper.hasClass('layout-menu-static')) {  
                    self.wrapper.toggleClass('layout-menu-static-inactive');  
                    if(self.wrapper.hasClass('layout-menu-static-inactive')) {  
                        self.menuWrapper.removeClass('layout-menu-wrapper-active');  
                        self.menuButton.removeClass('menu-button-active');     
                    }  
                      
                    setTimeout(function() {  
                        $(window).trigger('resize');  
                    }, 300);  
                }  
                else {  
                    if(self.menuWrapper.hasClass('layout-menu-wrapper-active')) {  
                        self.hideMenu();  
                        self.menuButton.removeClass('menu-button-active');  
                    }  
                    else {  
                        self.menuWrapper.addClass('layout-menu-wrapper-active');  
                        self.menuButton.addClass('menu-button-active');  
                    }  
                }  
            }  
              
            self.isBodyOverflowOnMobile();  
            self.menuButtonClick = true;  
            e.preventDefault();  
        });  
          
        // Eventos de enlaces del menú (CRÍTICO para submenús)  
        this.menulinks.off('click.menulink').on('click.menulink', function(e) {  
            var link = $(this),  
            item = link.parent(),  
            submenu = item.children('ul');  
            self.menuClick = true;  
                                      
            if(self.isHorizontal()) {                  
                if(submenu.length) {  
                    if(item.hasClass('active-menuitem')) {  
                        item.removeClass('active-menuitem');  
                        submenu.hide();  
                          
                        if(item.parent().hasClass('layout-menu')) {  
                            self.menuActive = false;  
                        }  
                    }  
                    else {  
                        self.deactivateItems(item.siblings('.active-menuitem'), false);  
                        item.addClass('active-menuitem');  
                        self.addMenuitem(item.attr('id'));  
                        submenu.show();  
                        self.menuActive = true;  
                    }  
                      
                    e.preventDefault();  
                }  
            }  
            else {  
                if(item.hasClass('active-menuitem')) {  
                    if(submenu.length) {  
                        self.removeMenuitem(item.attr('id'));  
                        item.removeClass('active-menuitem');  
                        submenu.slideUp();  
                    }  
                }  
                else {  
                    self.deactivateItems(item.siblings(), true);  
                    if(typeof $.cookie === 'function') {  
                        $.cookie('verona_menu_scroll_state', link.attr('href') + ',' + self.menuContainer.scrollTop(), { path: '/' });  
                    }  
                    item.addClass('active-menuitem');  
                    self.addMenuitem(item.attr('id'));  
                    submenu.slideDown();  
                }  
                                          
                if(submenu.length) {  
                    e.preventDefault();  
                }  
            }  
        })  
        .off('mouseenter.menulink').on('mouseenter.menulink', function(e) {  
            if(self.isHorizontal()) {  
                var item = $(this).parent();  
  
                if(self.menuActive && item.parent().hasClass('layout-menu')) {  
                    self.deactivateItems(item.siblings('.active-menuitem'), false);  
                    item.addClass('active-menuitem');  
                    item.children('ul').show();  
                }  
            }  
        });

               // Eventos del usuario display  
        this.userDisplay.off('click.profilebutton').on('click.profilebutton', function(e) {  
            self.topbarMenuButtonClick = true;  
  
            if(self.topbarMenu.hasClass('topbar-menu-visible')) {  
                self.hideTopBar();  
            }  
            else {  
                self.topbarMenu.addClass('topbar-menu-visible fadeInDown');  
            }  
                          
            e.preventDefault();  
        });  
          
        // Eventos de enlaces del topbar  
        this.topbarLinks.off('click.topbarlink').on('click.topbarlink', function(e) {  
            var link = $(this),  
            item = link.parent();  
              
            self.topbarLinkClick = true;  
            item.siblings('.menuitem-active').removeClass('menuitem-active');  
            item.toggleClass('menuitem-active');  
              
            var href = link.attr('href');  
            if(href && href !== '#') {  
                window.location.href = href;  
            }  
  
            e.preventDefault();  
        });  
          
        // Evento de búsqueda  
        this.searchInput.off('click.search').on('click.search', function(e) {  
            self.topbarLinkClick = true;  
        });  
  
        // Eventos del configurador  
        this.configButton.off('click.configbutton').on('click.configbutton', function(e) {  
            self.configurator.toggleClass('layout-config-active');  
            self.configClicked = true;  
        });  
  
        this.configurator.off('click.config').on('click.config', function() {  
            self.configClicked = true;  
        });  
  
        // Evento global del body  
        $(document.body).off('click.layoutBody').on('click.layoutBody', function() {         
            if(!self.menuButtonClick && !self.menuClick && !self.isStatic()) {  
                if(self.isHorizontal()) {  
                    self.deactivateItems(self.menuWrapper.find('li.active-menuitem'), false);  
                    self.menuActive = false;  
                }  
                else {  
                    self.hideMenu();  
                    self.menuButton.removeClass('menu-button-active');  
                }  
            }  
              
            if(!self.topbarMenuButtonClick && !self.topbarLinkClick) {  
                self.hideTopBar();  
            }  
  
            self.isBodyOverflowOnMobile();  
  
            if (!self.configClicked && self.configurator.hasClass('layout-config-active')) {  
                self.configurator.removeClass('layout-config-active');  
            }  
  
            self.menuButtonClick = false;  
            self.menuClick = false;  
            self.topbarMenuButtonClick = false;  
            self.topbarLinkClick = false;  
            self.configClicked = false;  
        });  
    },

        hideTopBar: function() {  
        var self = this;  
        this.topbarMenu.addClass('fadeOutUp');  
          
        setTimeout(function() {  
            self.topbarMenu.removeClass('fadeOutUp topbar-menu-visible');  
        },450);  
    },  
      
    hideMenu: function() {  
        var self = this;  
        if(this.wrapper.hasClass('layout-menu-popup') && this.menuWrapper.hasClass('layout-menu-wrapper-active')) {  
            this.menuWrapper.addClass('fadeOutUp');  
              
            setTimeout(function() {  
                self.menuWrapper.removeClass('fadeOutUp layout-menu-wrapper-active');  
            }, 300);     
        }  
        else {  
            this.menuWrapper.removeClass('layout-menu-wrapper-active');  
            if(this.wrapper.hasClass('layout-menu-static')) {  
                this.wrapper.addClass('layout-menu-static-inactive');  
            }    
        }  
    },  
              
    deactivateItems: function(items, animate) {  
        var self = this;  
          
        for(var i = 0; i < items.length; i++) {  
            var item = items.eq(i),  
            submenu = item.children('ul');  
              
            if(submenu.length) {  
                if(item.hasClass('active-menuitem')) {  
                    var activeSubItems = item.find('.active-menuitem');  
                    item.removeClass('active-menuitem');  
                      
                    if(animate) {  
                        submenu.slideUp('normal', function() {  
                            $(this).parent().find('.active-menuitem').each(function() {  
                                self.deactivate($(this));  
                            });  
                        });  
                    }  
                    else {  
                        submenu.hide();  
                        item.find('.active-menuitem').each(function() {  
                            self.deactivate($(this));  
                        });  
                    }  
                      
                    self.removeMenuitem(item.attr('id'));  
                    activeSubItems.each(function() {  
                        self.removeMenuitem($(this).attr('id'));  
                    });  
                }  
                else {  
                    item.find('.active-menuitem').each(function() {  
                        var subItem = $(this);  
                        self.deactivate(subItem);  
                        self.removeMenuitem(subItem.attr('id'));  
                    });  
                }  
            }  
            else if(item.hasClass('active-menuitem')) {  
                self.deactivate(item);  
                self.removeMenuitem(item.attr('id'));  
            }  
        }  
    },  
      
    deactivate: function(item) {  
        var submenu = item.children('ul');  
        item.removeClass('active-menuitem');  
          
        if(submenu.length) {  
            submenu.hide();  
        }  
    },

        removeMenuitem: function (id) {  
        this.expandedMenuitems = $.grep(this.expandedMenuitems, function (value) {  
            return value !== id;  
        });  
        this.saveMenuState();  
    },  
      
    addMenuitem: function (id) {  
        if ($.inArray(id, this.expandedMenuitems) === -1) {  
            this.expandedMenuitems.push(id);  
        }  
        this.saveMenuState();  
    },  
      
    saveMenuState: function() {  
        if(typeof $.cookie === 'function') {  
            $.cookie('verona_expandeditems', this.expandedMenuitems.join(','), {path: '/'});  
        }  
    },  
  
    clearLayoutState: function() {  
        this.clearMenuState();  
        this.clearActiveItems();  
    },  
  
    clearActiveItems: function() {  
        var activeItems = this.wrapper.find('li.active-menuitem'),  
            subContainers = activeItems.children('ul');  
  
        activeItems.removeClass('active-menuitem');  
        if(subContainers && subContainers.length) {  
            subContainers.hide();  
        }  
    },  
  
    clearMenuState: function() {  
        if(typeof $.removeCookie === 'function') {  
            $.removeCookie('verona_expandeditems', {path: '/'});  
        }  
    },  
      
    restoreMenuState: function() {  
        var self = this;  
        if(typeof $.cookie !== 'function') return;  
          
        var menucookie = $.cookie('verona_expandeditems');  
        if (menucookie) {  
            this.expandedMenuitems = menucookie.split(',');  
            for (var i = 0; i < this.expandedMenuitems.length; i++) {  
                var id = this.expandedMenuitems[i];  
                if (id) {  
                    var menuitem = $("#" + this.expandedMenuitems[i].replace(/:/g, "\\:"));  
                    menuitem.addClass('active-menuitem');  
                      
                    var submenu = menuitem.children('ul');  
                    if(submenu.length) {  
                        submenu.show();  
                    }  
                }  
            }  
  
            setTimeout(function() {  
                if(menuitem && menuitem.length) {  
                    self.restoreScrollState(menuitem);  
                }  
            }, 100);  
        }  
    },  

        restoreScrollState: function(menuitem) {  
        if(typeof $.cookie !== 'function') return;  
          
        var scrollState = $.cookie('verona_menu_scroll_state');  
        if (scrollState) {  
            var state = scrollState.split(',');  
            if (state[0].startsWith(window.location.pathname) || this.isScrolledIntoView(menuitem, state[1])) {  
                this.menuContainer.scrollTop(parseInt(state[1], 10));  
            }  
            else {  
                this.scrollIntoView(menuitem.get(0));  
                if(typeof $.removeCookie === 'function') {  
                    $.removeCookie('verona_menu_scroll_state', { path: '/' });  
                }  
            }  
        }  
        else if (!this.isScrolledIntoView(menuitem, menuitem.scrollTop())){  
            this.scrollIntoView(menuitem.get(0));  
        }  
    },  
  
    scrollIntoView: function(elem) {  
        if (document.documentElement.scrollIntoView) {  
            elem.scrollIntoView({ block: "nearest", inline: 'start' });  
  
            var wrapper = $('.layout-menu-wrapper');  
            var scrollTop = wrapper.scrollTop();  
            if (scrollTop > 0) {  
                wrapper.scrollTop(scrollTop + parseFloat(this.topbar.height()));  
            }  
        }  
    },  
  
    isScrolledIntoView: function(elem, scrollTop) {  
        var viewBottom = parseInt(scrollTop, 10) + this.menuContainer.height();  
  
        var elemTop = elem.position().top;  
        var elemBottom = elemTop + elem.height();  
  
        return ((elemBottom <= viewBottom) && (elemTop >= scrollTop));  
    },

    isHorizontal: function() {  
        return window.innerWidth > 1024 && this.wrapper.hasClass('layout-menu-horizontal');  
    },  
      
    isStatic: function() {  
        return window.innerWidth > 1024 && this.wrapper.hasClass('layout-menu-static');  
    },  
      
    isOverlay: function() {  
        return window.innerWidth > 1024 && this.wrapper.hasClass('layout-menu-overlay');  
    },  
      
    isBodyOverflowOnMobile: function() {  
        if(this.isMobileDevice()) {  
            if(this.menuButton.hasClass('menu-button-active'))  
                $(document.body).css('overflow', 'hidden');  
            else  
                $(document.body).css('overflow', '');  
        }     
    },  
      
    isMobile: function() {  
        return window.innerWidth < 1025;  
    },  
      
    isMobileDevice: function() {  
        return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(window.navigator.userAgent.toLowerCase());  
    }  
};


// Configurador de Verona adaptado para React  
window.VeronaConfigurator = {  
    changeMenuMode: function(menuMode) {  
        var wrapper = $(document.body).children('.layout-wrapper');  
        switch (menuMode) {  
            case 'static':  
                wrapper.addClass('layout-menu-static').removeClass('layout-menu-overlay layout-menu-popup layout-menu-horizontal');  
                this.clearLayoutState();  
                break;  
  
            case 'overlay':  
                wrapper.addClass('layout-menu-overlay').removeClass('layout-menu-static layout-menu-popup layout-menu-horizontal');  
                this.clearLayoutState();  
                break;  
  
            case 'popup':  
                wrapper.addClass('layout-menu-popup').removeClass('layout-menu-static layout-menu-overlay layout-menu-horizontal');  
                this.clearLayoutState();  
                break;  
  
            case 'horizontal':  
                wrapper.addClass('layout-menu-horizontal').removeClass('layout-menu-static layout-menu-overlay layout-menu-popup');  
                this.clearLayoutState();  
                break;  
  
            default:  
                wrapper.addClass('layout-menu-static').removeClass('layout-menu-overlay layout-menu-popup layout-menu-horizontal');  
                this.clearLayoutState();  
                break;  
        }  
    },  
  
    changeLayout: function(layoutTheme) {  
        var linkElement = $('link[href*="layout-"]');  
        var href = linkElement.attr('href');  
        var startIndexOf = href.indexOf('layout-') + 7;  
        var endIndexOf = href.indexOf('.css');  
        var currentColor = href.substring(startIndexOf, endIndexOf);  
  
        this.replaceLink(linkElement, href.replace(currentColor, layoutTheme));  
    },  
  
    replaceLink: function(linkElement, href) {  
        var isIE = this.isIE();  
  
        if (isIE) {  
            linkElement.attr('href', href);  
        }  
        else {  
            var cloneLinkElement = linkElement.clone(false);  
            cloneLinkElement.attr('href', href);  
            linkElement.after(cloneLinkElement);  
  
            cloneLinkElement.off('load').on('load', function() {  
                linkElement.remove();  
            });  
        }  
    },  
  
    clearLayoutState: function() {  
        if (window.VeronaLayout) {  
            window.VeronaLayout.clearLayoutState();  
        }  
    },  
  
    isIE: function() {  
        return /(MSIE|Trident\/|Edge\/)/i.test(navigator.userAgent);  
    },  
  
    updateInputStyle: function(value) {  
        if (value === 'filled')  
            $(document.body).addClass('ui-input-filled');  
        else  
            $(document.body).removeClass('ui-input-filled');  
    }  
};


/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD (Register as an anonymous module)
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// Node/CommonJS
		module.exports = factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write

		if (arguments.length > 1 && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {},
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling $.cookie().
			cookies = document.cookie ? document.cookie.split('; ') : [],
			i = 0,
			l = cookies.length;

		for (; i < l; i++) {
			var parts = cookies[i].split('='),
				name = decode(parts.shift()),
				cookie = parts.join('=');

			if (key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

}));
