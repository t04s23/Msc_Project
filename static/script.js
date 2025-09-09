!function(e) {
    var t = {};
    function r(o) {
        if (t[o])
            return t[o].exports;
        var s = t[o] = {
            i: o,
            l: !1,
            exports: {}
        };
        return e[o].call(s.exports, s, s.exports, r),
        s.l = !0,
        s.exports
    }
    r.m = e,
    r.c = t,
    r.d = function(e, t, o) {
        r.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: o
        })
    }
    ,
    r.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }
    ,
    r.t = function(e, t) {
        if (1 & t && (e = r(e)),
        8 & t)
            return e;
        if (4 & t && "object" == typeof e && e && e.__esModule)
            return e;
        var o = Object.create(null);
        if (r.r(o),
        Object.defineProperty(o, "default", {
            enumerable: !0,
            value: e
        }),
        2 & t && "string" != typeof e)
            for (var s in e)
                r.d(o, s, function(t) {
                    return e[t]
                }
                .bind(null, s));
        return o
    }
    ,
    r.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        }
        : function() {
            return e
        }
        ;
        return r.d(t, "a", t),
        t
    }
    ,
    r.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }
    ,
    r.p = "",
    r(r.s = 2)
}([function(e, t, r) {
    (function(e) {
        function t() {
            return 0 === e("#prospectus_results_container").length
        }
        function r(t, r) {
            var o = e(t.toString())
              , s = o.find("#prospectus_results");
            r = e.parseJSON(r),
            e("#prospectus_q").val() === r && resetSearchTerms(r),
            s.length || (s = o.filter("#prospectus_results")),
            e("#prospectus_results").replaceWith(s),
            e("#prospectus_results_container").removeClass("js_processing")
        }
        function o() {
            var o = e(".prospectus_search").serialize()
              , s = e(".prospectus_search").first().attr("action") + "?" + o;
            e("#prospectus_results_container").addClass("js_processing"),
            e.post(s, (function(o, s, n) {
                var u = n.getResponseHeader("X-Current-Page");
                t() || e("#initial_study_type").val() !== e("#prospectus_study_type").val() ? document.location.href = u : (r(o, n.getResponseHeader("X-Search-Terms")),
                history.pushState({}, "", u))
            }
            ))
        }
        function s(t, o, s) {
            o = o || !1,
            e("#prospectus_results_container").addClass("js_processing"),
            e.get(t, (function(e, n, u) {
                r(e, u.getResponseHeader("Search-Terms")),
                o || history.pushState({}, "", t),
                s()
            }
            ))
        }
        e(document).ready((function() {
            e("#prospectus_study_type").change((function() {
                t() || o()
            }
            ))
        }
        )),
        e("body").on("submit", "#prospectus_search", o),
        e(document).on("click", ".prospectus_results_table th a, .view_type_toolbar a, .pagination a, .prospectus_per_page a, .pagination_legend a", (function(t) {
            var r = e(t.target);
            return s(r.attr("href"), !1, (function() {
                (r.is(".pagination a") || r.is(".prospectus_per_page a")) && e("html, body").animate({
                    scrollTop: e("#prospectus_results").offset().top
                })
            }
            )),
            !1
        }
        )),
        e(document).on("click", ".promo_link", (function(t) {
            var r = e(t);
            if (r.data("term"))
                return e(".prospectus_search").val(r.data("term")),
                e(".prospectus_search").submit(),
                e("html, body").animate({
                    scrollTop: e(".prospectus_search").offset().top
                }),
                !1
        }
        )),
        e(window).on("popstate", (function(e) {
            return s(location.href, !0)
        }
        ))
    }
    ).call(this, r(1))
}
, function(e, t) {
    e.exports = $
}
, function(e, t, r) {
    r(0),
    e.exports = r(3)
}
, function(e, t, r) {
    (function(e) {
        r(0);
        var t = null
          , o = e("#prospectus_q").clone();
        function s() {
            var r = e("#prospectus_q").data("collections")
              , s = e("#prospectus_study_type").find("option:selected").val();
            t = r[s],
            e("#prospectus_q").data("flb.autocompletion") && (o.val(e("#prospectus_q").val()),
            e("#prospectus_q").replaceWith(o.clone())),
            e("#prospectus_q").autocompletion({
                datasets: {
                    organic: {
                        collection: t,
                        profile: "_default",
                        program: "https://abdn-search.funnelback.squiz.cloud/s/suggest.json",
                        format: "extended",
                        alpha: "0.5",
                        show: "10",
                        sort: "0",
                        group: !0
                    }
                },
                length: 2
            })
        }
        e(document).ready(s),
        e("body").on("change", "#prospectus_study_type", s)
    }
    ).call(this, r(1))
}
]);


/*
 * Funnelback auto-completion plugin
 * version 2.6.3
 *
 * author: Liliana Nowak
 * Copyright Funnelback, 2015-2019
 *
 * @requires jQuery https://jquery.com@1.10.2
 * @requires Typeahead https://twitter.github.io/typeahead.js@0.11.1
 * @requires Handlebars https://handlebarsjs.com@4.7.7
 */
(function($) {
    'use strict';

	var autocompletion = function(element, options) {
		// Global references
		this.$element = $(element);
		this.options  = options;

		this.init();
	}

	// Default options
	autocompletion.defaults = {
		// set configuration
		datasets : null,				// {set1: {url: ''}, set2: {...}, set3: {...}}
		/*
		defaultCall   : {				// 'string'|[]|{}; use to trigger auto-completion when input value is empty and length=0
			params    : {},						// {}; list of parameters added to request
			url       : '' 						// 'string'; URL to call request
			transform : customFunctionToMapData,// function(set, data); transform function used to map response data
		},
		defaultCall   : '',				// 'string'; query to replace empty value and call request
		defaultCall   : [],				// [{value: '', label: ''}, {value: '', label: ''}]; list of hardcoded data to fulfill dropdown menu
		defaultCall   : {
			data      : [],				// []; list of hardcoded data
			transform : function 		// function(set, data); transform function used to map hardcoded data
		},
		*/
		callback 		: null,			// function(set, suggestions); callback function applied to suggestions before returning them to typeahead plugin
		debounceDelay	: 300,	  		// integer; the debounce delay in milliseconds between the time the user stops typing a letter and the time the request is done\
		group 			: false,		// true|false; enable grouping suggestions based on parameter itemGroup
		groupOrder		: [],			// []; list of group headers used to sort grouped suggestions in that order
		facets 			: {				// {}; list of parameters applied when default search-based auto-completion is enabled
			blacklist	: [],	// []; list of facet categories names not to displayed
			whitelist	: [],	// []; list of facet categories names to display
			show		: 2,	// integer; maximum number of facets values to display per facet category; if not set will display all facet category values
			url 		: null, // string; the target URL to apply facets parameters to; By default it'll be current location
		},
		itemGroup 		: 'category',	// 'string'; the name of field used to group suggestions and display as group header in dropdown
		itemLabel 		: 'value',		// 'string'; the name of a field to be displayed in input field
		template 		: {				// {notFound: '', pending: '', header: '', footer: '', group: '', suggestion: ''}
			group: function(context) { return $('<div>').html(String(context.label)); },
			suggestion: function(context) { return $('<div>').html(String(context.label)); }
		},
		templateMerge 	: true,			// true|false; to wrap notFound and pending template with header and footer template
		transform 		: _processSetData, // function(set, suggestion, index); transform function used to map response data

		// URL settings
		collection 		: null,			// 'string'; the collection name
		dataType 		: 'json',		// 'json'|'jsonp'; the type of data returned back from the server
		alpha 			: '0.5',		// 'string'; adjust the balance between length and relevancy for spelling based suggestions
		format 			: 'extended',	// 'simple|extended'; mapping into 'json' or 'json++'
		params 			: null,			// {}; custom URL parameters
		profile 		: '_default',	// 'string'; the profile name
		program 		: '/s/suggest.json', // 'string'; program/URL used to generate auto-completion suggestions
		show 			: 10,			// integer; maximum number of suggestions to diplay in dropdown per set
		sort 			: 0,			// integer; set the auto-completion suggestions sort order when program='/s/suggest.json'
		queryKey 		: 'partial_query', // 'string'; the name of URL parameter to run search query
		queryVal 		: '%QUERY',		// 'string'; the value to be replaced in url with the URI encoded query

		// display settings
		length      	: 3,			// integer; the minimum character length to trigger query completion
		horizontal  	: false,		// true|false; if true, display datasets in columns, else one below the other
		scrollable  	: false,		// true|false; to limit height of a menu dropdown to maxheight by adding vertical scroll

		// logs
		logging 		: true,
		interactionLog 	: '/s/log',

		//typeahead settings
		typeahead: {
			classNames  : {},			// {}; to override any of default classes, more https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md#class-names
			highlight   : true,			// true|false; when suggestions are rendered, pattern matches for the current query in text nodes will be wrapped in a strong element with its class set to {{classNames.highlight}}
			hint        : false,		// true|false; to show a hint in input field,
			events      : {				// {eventName: function}; events get triggered on the input element during the life-cycle of a typeahead
				select  : function(event, suggestion) {
					_selectItem(suggestion, $(event.target));
				},
				afterselect: function(event, suggestion) {
					if (suggestion.extra.action_t == 'E') $(event.target).focus();
				}
			}
		},
	};

	/* Public methods */
	
	autocompletion.prototype.init = function() {
		this.option(this.options);

		if (_isEnabled(this.options)) this.initTypeahead();
		else this.destroy();
	}

	autocompletion.prototype.destroy = function () {
		this.destroyTypeahead;

		this.$element = null;
		this.options  = {};
	}

	autocompletion.prototype.option = function(key, val) {
		if (arguments.length === 0) {
			return this.options;
		}

		var that = this, options = $.isObject(key) ? key : {}, parts;
		if ($.isString(key)) {
			if (arguments.length === 1 || !$.isDefinied(val)) {
				return $.dataVals($.extend({}, that.options), key);
			}

			options[key] = val;
		}

		for (var k in options) _setOption(k, options[k]);

		function _setOption(key, val) {
			if (key === 'datasets') that.options[key] = _mapOptions(that.options, val);
			if (key === 'debug') _debug = val;
			if (key === 'horizontal' && val) {
				that.setTypeaheadClass('menu', 'tt-horizontal');

				that.options.typeahead.events.render = function(event) {
					_renderSetWidth(that.getTypeaheadMenu(), 'tt-horizontal', 'tt-dataset');
				};
			}
			if (key === 'scrollable' && val) that.setTypeaheadClass('menu', 'tt-scrollable');
		}
	}

	autocompletion.prototype.horizontal = function(val) {
		return this.option('horizontal', val);
	}

	autocompletion.prototype.scrollable = function(val) {
		return this.option('scrollable', val);
	}

	// Typeahead
	autocompletion.prototype.initTypeahead = function() {
		var that = this, data = [];

		$.each(that.options.datasets, function(name, set) {
			data.push(_getSetData(set, name));
		});

		that.$element.typeahead({
			minLength : parseInt(that.options.length),
			hint      : that.options.typeahead.hint,
			highlight : that.options.typeahead.highlight,
			classNames: that.options.typeahead.classNames
		}, data);

		if (that.options.typeahead.events) {
			$.each(that.options.typeahead.events, function(eventName, func) {
				that.$element.on('typeahead:' + eventName, func);
			});
		}

		if (that.options.horizontal) {
			var data = that.$element.data(), menu = that.getTypeaheadMenu();

			/* 
			 * 37 - code for left arrow key
			 * 38 - code for up arrow key
			 * 39 - code for right arrow key
			 * 40 - code for down arrow key
			 */
			data.ttTypeahead._onDownKeyed = function() {
				_navCursorUD(40, menu, that.$element);
			};
			data.ttTypeahead._onUpKeyed = function() {
				_navCursorUD(38, menu, that.$element);
			}

			var cols = menu.children('.tt-dataset');
			if (cols.length > 1) {
				data.ttTypeahead._onLeftKeyed = function() {
					_navCursorLR(37, cols, that.$element);
				};
				data.ttTypeahead._onRightKeyed = function() {
					_navCursorLR(39, cols, that.$element);
				}
			}

			that.$element.on('keydown', function(event) {
				var code = event.keyCode || event.which;
				if (code == 38 || code == 40) return false;
				if ((code == 37 || code == 39) && $.exist(_navCols.cursor)) return false;
			});
		}

		// Log interactions
		if (!that.options.logging) return;
		that.$element.on('typeahead:select', function(event, suggestion) {
			logInteraction(that.options, suggestion, $(event.target), 'select');
		});
	}

	autocompletion.prototype.destroyTypeahead = function() {
		this.$element.typeahead('destroy');
	}

	autocompletion.prototype.getTypeaheadMenu = function() {
		return this.$element.siblings('.tt-menu');
	}

	autocompletion.prototype.setTypeaheadClass = function(name, className) {
		if (!$.exist(this.options.typeahead.classNames[name], true)) this.options.typeahead.classNames[name] = 'tt-' + name; // default class
		this.options.typeahead.classNames[name] += ' ' + className;
	}

	/* Private variables */
	var _debug = false,
	_mapKeys = ['collection', 'callback', 'dataType', 'alpha', 'facets', 'transform', 'format', 'group', 'groupOrder', 'itemGroup', 'itemLabel', 'params', 'profile', 'program', 'show', 'sort', 'queryKey', 'queryVal', 'template', 'templateMerge', 'debounceDelay'],
	_navCols = {cursor : null, query  : ''};

	/* Private methods */
	
	// Check if there is enough data to trigger auto-completion
	function _isEnabled(options) {
		var bState = false;

		if (!$.isObject(options.datasets)) return bState;

		$.each(options.datasets, function(name, set) {
			if ($.exist(set.collection, true)) bState = true;
		});

		return bState;
	}

	// Map global options per dataset
	function _mapOptions(options, datasets) {
		var map = {};
		$.each(_mapKeys, function(i, key) { map[key] = options[key] });
		$.each(datasets, function(name, set) { datasets[name] = $.extend(true, {}, map, set) });
		return datasets;
	}

	// Handle set
	function _getSetData(set, name) {
		var engine = new Bloodhound({
			datumTokenizer : Bloodhound.tokenizers.obj.whitespace('value'),
			queryTokenizer : Bloodhound.tokenizers.whitespace,
			remote         : getBloodhoundRemote()
		});
		engine.initialize();

		return {
			name 	: name,
			limit 	: 10000, // hack to display all returned data
			source 	: source,
			display : displayVal,
			templates : _renderSetTemplate(set)
		}

		function displayVal(suggestion) {
			return $.isFunction(set.itemLabel) ? set.itemLabel.call(undefined, suggestion) : $.dataVals(suggestion, set.itemLabel);
		}

		function getBloodhoundRemote() {
			var remote = {
				url    : set.url ? set.url : _getSetUrl(set),
				filter : function (response) {
					var query = getQuery($(this).get(0).transport.lastReq);
					return _handleSetData(set, $.map(response, function(suggestion, i) { return set.transform(set, suggestion, i, name, query) }));
				},
				rateLimitWait: set.debounceDelay
			};
			if (set.dataType === 'jsonp') {
				remote['prepare'] = function(query, settings) {
					settings.dataType = 'jsonp';
					settings.url = settings.url.replace(set.queryVal, query);
					return settings;
				};
			} else {
				remote['wildcard'] = set.queryVal;
			}
			return remote;
		}

		function getQuery(str) {
			if (!$.exist(str, true)) return str;
			str = decodeURIComponent(str);
			return str.substring(str.lastIndexOf(set.queryKey + '=') + (set.queryKey.length + 1), str.lastIndexOf('GET'));
		}

		function displayVal(suggestion) {
			return $.isFunction(set.itemLabel) ? set.itemLabel.call(undefined, suggestion) : $.dataVals(suggestion, set.itemLabel);
		}

		function source(query, sync, async) {
			if (query.length < 1 && set.defaultCall) {
				if ($.isString(set.defaultCall)) {
					query = set.defaultCall;
				}
				else if ($.isArray(set.defaultCall)) {
					sync(_handleSetData(set, set.defaultCall));
					return;
				}
				else if ($.exist(set.defaultCall.data)) {
					sync(_handleSetData(set, set.defaultCall.transform(set, set.defaultCall.data)));
					return;
				}
				else if ($.exist(set.defaultCall.url, true)) {
					$.get(set.defaultCall.url, set.defaultCall.params, function(data) {
						async(_handleSetData(set.defaultCall.transform(set, data)));
						return;
					});
				}
			}

			engine.search(query, sync, async);
		}
	}

	// Returned request URL based on provided parameters
	function _getSetUrl(set) {
		var params = {collection: set.collection};

		if ($.exist(set.format, true)) params['fmt'] = set.format == 'simple' ? 'json' : 'json++';
		if ($.exist(set.alpha, true)) params['alpha'] = set.alpha;
		if ($.exist(set.profile, true)) params['profile'] = set.profile;
		if ($.exist(set.show, true)) params['show'] = set.show;
		if ($.exist(set.sort, true)) params['sort'] = set.sort;
		if ($.isObject(set.params)) params = $.extend(true, {}, params, set.params);

		return set.program + '?' + $.param(params) + '&' + set.queryKey + '=' + set.queryVal;
	}

	// Group results into categories
	function _groupSetData(set, results) {
		var grouped = {'':[]}, i, len;

		if ($.exist(set.groupOrder)) {
			for (i = 0, len = set.groupOrder.length; i < len; i++) {
				grouped[set.groupOrder[i]] = [{label: set.groupOrder[i]}];
			}
		}

		for (i = 0, len = results.length; i < len; i++) {
			if (!$.exist(grouped[results[i][set.itemGroup]])) grouped[results[i][set.itemGroup]] = [{label: results[i][set.itemGroup]}];
			grouped[results[i][set.itemGroup]].push(results[i]);
		}

		results = [];
		$.each(grouped, function(groupName, group) {
			if (group.length > 1) {
				if (!$.exist(groupName, true)) group.splice(0, 1);
				$.merge(results, group);
			}
		});

		return results;
	}

	// Limit number of returned results
	// Trigger grouping them or apply custom callback
	function _handleSetData(set, results) {
		results = results.slice(0, set.show);
		if (set.callback && $.isFunction(set.callback)) results = set.callback.call(undefined, set, results) || [];
		if (!set.group) return results;
		return _groupSetData(set, results);
	}

	function _processSetData(set, suggestion, i, name, query) {
		return $.autocompletion.processSetData(set, suggestion, i, name, query);
	}

	// Adjust columns width depends on columns number
	// If column has assigned CSS "width" property with "!important" declaration, this will be respected
	function _renderSetWidth(menu, classWrapper, className) {
		var cols = 0, colsW = 0, styles, parts, menuW = menu.width();
		className 	 = '.' + className;
		classWrapper = '.' + classWrapper;

		$.each(menu.children(className), function() {
			parts  = $(this).attr('class').split(' ');
			styles = $.cssStyle(classWrapper + ' .' + parts[1]) || $.cssStyle(classWrapper + ' .' + parts.join('.'));

			if (styles.width && styles.width.indexOf('important') && styles.width.indexOf('auto') < 0 && styles.width.indexOf('initial') < 0 && styles.width.indexOf('inherit') < 0) {
				if (styles.width.indexOf('%') > 0) colsW += menuW * parseFloat(styles.width) / 100;
				else colsW += parseFloat(styles.width);
			}
			else if ($.hasContent($(this))) cols++;
		});

		if (cols) {
			menuW -= colsW + 0.5;
			var minW = parseFloat(menu.children(className).css('min-width')), colW = menuW / cols;
			if (minW <= colW) menu.children(className).css('width', colW + 'px');
		}
	}

	// Pre-compile templates using Handlebars
	function _renderSetTemplate(set) {
		_setSetTemplateHeader(set);

		if (!set.template || $.isEmptyObject(set.template)) return {};

		$.each(set.template, function(k, obj) {
			if ($.isObject(obj)) set.template[k] = obj.prop('outerHTML');
		});

		if (set.templateMerge) {
			templateMerge('notFound');
			templateMerge('pending');
		}

		$.each(set.template, function(k, obj) {
			if ($.isString(obj)) set.template[k] = Handlebars.compile(obj);
		});

		return set.template;

		function templateMerge(temp) {
			if (set.template[temp] && $.isString(set.template[temp])) {
				if (set.template.header && $.isString(set.template.header)) set.template[temp] = set.template.header + set.template[temp];
				if (set.template.footer && $.isString(set.template.footer)) set.template[temp] += set.template.footer;
			}
		}
	}

	// Set default template to display column header if column name is defined
	function _setSetTemplateHeader(set) {
		if (!set.template.header && $.exist(set.name, true)) set.template.header = '<h5 class="tt-category">' + set.name + '</h5>';
	}

	// Handle selected item based on "action_t" parameter
	function _selectItem(item, target) {
		if ($.exist(item.extra)) {
			switch(item.extra.action_t) {
				case 'C':
					let actionFn = new Function(item.extra.action); actionFn();
					 break;
				case 'U':
					document.location = item.extra.action; break;
				case 'E':
					target.typeahead('val', item.extra.action); break;
				case undefined:
				case '':
				case 'S':
				case 'Q':
				default:
					formSend(item.value); break;
			}
		} else {
			formSend(item.value);
		}

		function formSend(val) { // Submit form on select
			target.val(val);
			target.closest('form').submit();
		}
	}

	function _getSelectableLabel(item) {
		return $.exist(item.data()) ? item.data().ttSelectableDisplay : item.text();
	}

	/* Handle Typeahead navigation */
	
	// Navigate dropdown list  left - right (switching between columns)
	function _navCursorLR(code, cols, target) {
		if (!$.exist(_navCols.cursor)) return;

		var currCol      = _navCols.cursor.parent(),
			currColIdx   = cols.index(currCol),
			delta        = code == 37 ? -1 : 1,
			nextColItems = getNextColItems(currColIdx),
			cursorIdx    = $(currCol).children('.tt-selectable').index(_navCols.cursor),
			nextCursor   = $.exist(nextColItems[cursorIdx]) ? nextColItems[cursorIdx] : nextColItems[nextColItems.length - 1];

		$(_navCols.cursor).removeClass('tt-cursor');
		_navCols.cursor = $(nextCursor).addClass('tt-cursor');
		target.data().ttTypeahead.input.setInputValue(_getSelectableLabel(_navCols.cursor));

		function getNextColItems(currColIdx) {
			var nextColIdx = code == 37
				? $.exist(cols[currColIdx - 1]) ? currColIdx - 1 : cols.length - 1
				: $.exist(cols[currColIdx + 1]) ? currColIdx + 1 : 0,
				nextColItems = $(cols[nextColIdx]).children('.tt-selectable');

			return $.exist(nextColItems) ? nextColItems : getNextColItems(nextColIdx);
		}
	}

	// Navigate dropdown list  up - down
	function _navCursorUD(code, menu, target) {
		if (!$.exist(menu.find('.tt-cursor'))) {
			_navCols.cursor = code == 38 ? menu.find('.tt-selectable').last() : menu.find('.tt-selectable').first();
			_navCols.cursor.addClass('tt-cursor');
			_navCols.query  = target.val();
			target.data().ttTypeahead.input.setInputValue(_getSelectableLabel(_navCols.cursor));
			return;
		}

		var currCol      = _navCols.cursor.parent(),
			currColItems = $(currCol).children('.tt-selectable');

		if(!$.exist(currColItems)) return;

		var cursorIdx = currColItems.index(_navCols.cursor), delta = code == 38 ? -1 : 1;

		$(_navCols.cursor).removeClass('tt-cursor');

		if (!$.exist(currColItems[cursorIdx + delta])) {
			_navCols.cursor = null;
			target.data().ttTypeahead.input.resetInputValue();
			target.data().ttTypeahead._updateHint();
		}
		else {
			_navCols.cursor = $(currColItems[cursorIdx + delta]).addClass('tt-cursor');
			target.data().ttTypeahead.input.setInputValue(_getSelectableLabel(_navCols.cursor));
		}
	}

	// Debug
	function logDebug(options, input, output, msg) {
		if (!_debug || !window.console) return;

		console.log(msg);
		console.log('Options: ', options);
		console.log('Input: ', input);
		console.log('Output: ', output);
		console.log('--------');
	}

	function logInteraction(options, input, target, event) {
		if (!options.logging || !$.exist(options.interactionLog, true)) return;
		if (!input.dataset || !options.datasets[input.dataset]) return;

		$.ajax({
			dataType: 'jsonp',
			type: 'GET',
			url:  getInteractionUrl(options.datasets[input.dataset], input),
		}).fail(function(qXHR, textStatus, errorThrown) {
			logDebug(options, input, qXHR, 'Interaction log error: ' + textStatus + ' ' + errorThrown);
		});

		function getInteractionUrl(set, suggestion) {
			var params = {
				collection: set.collection,
				type: event,
				partial_query: suggestion.query,
				client_time: new Date().getTime()
			};

			if ($.exist(set.profile, true)) params['profile'] = set.profile;
			if ($.exist(suggestion.extra)) params = $.extend(true, {}, params, suggestion.extra);

			return options.interactionLog + '?' + $.param(params);
		}
	}

	// Generate plugin
	function Plugin() {
		var args = [].slice.call(arguments), option = args.shift();

		return this.each(function () {
			var $this = $(this),
				data    = $this.data('flb.autocompletion'),
				options = $.extend(true, {}, autocompletion.defaults, data || {}, $.isObject(option) && option);

			if (!data && /destroy|hide/.test(option)) return;
			if (!data) $this.data('flb.autocompletion', (data = new autocompletion(this, options)));
			if ($.isString(option) && $.isFunction(data[option])) data[option].apply($this, args);
		});
	}

	$.fn.autocompletion             = Plugin;
	$.fn.autocompletion.Constructor = autocompletion;

	// List of predefined mapping functions
	$.autocompletion = {
		// Map /s/suggest.json output
		processSetData: function(set, suggestion, i, name, query) {
			var value = suggestion.key, label = suggestion.key;
			if (suggestion.action_t == 'Q') value = suggestion.action;
			if (suggestion.action_t == 'S') value = suggestion.disp;
			if (suggestion.disp_t == 'C') label = new Function("return " + suggestion.disp)();
			else if (suggestion.disp) label = suggestion.disp;

			return {
				label    : label,
				value    : value,
				extra    : suggestion,
				category : suggestion.cat ? suggestion.cat : '',
				rank     : i + 1,
				dataset	 : name,
				query    : query
			};
		},

		// Map /s/search.json output
		processSetDataFacets: function(set, suggestion, i, name, query) {
			if (i !== 'response' || !$.exist(suggestion.facets)) return;

			var suggestions = [], rank = 1;
			for (var i = 0, leni = suggestion.facets.length; i < leni; i++) {
				var facet = suggestion.facets[i];

				if (!$.exist(facet.allValues)) continue;
				if ($.exist(set.facets.blacklist) && set.facets.blacklist.indexOf(facet.name) > -1) continue;
				if ($.exist(set.facets.whitelist) && set.facets.whitelist.indexOf(facet.name) < 0) continue;

				for (var j = 0, lenj = facet.allValues.length; j < lenj; j++) {
					if ($.exist(set.facets.show) && j > parseInt(set.facets.show) - 1) break;
					if (!facet.allValues[j].count) continue;

					suggestions.push({
						label   : facet.allValues[j].label,
						value   : facet.allValues[j].data,
						extra   : {
							action  : getUrl(facet.allValues[j]),
							action_t: 'U'
						},
						category: facet.name,
						rank    : rank++,
						dataset	: name,
						query   : query
					});
				}
			}

			return suggestions;

			function getUrl(facet) {
				return ($.exist(set.facets.url, true) ? set.facets.url : window.location.origin + window.location.pathname) + facet.toggleUrl;
			}
		}
	}

	// Helpers
	$.exist      = function(obj, bString) { if (!$.isDefinied(bString)) bString = false; var obj = bString ? obj : $(obj); return $.isDefinied(obj) && obj != null && ($.isString(obj) ? obj + '' : obj).length > 0; }
	$.hasContent = function(obj) { return obj.html().trim().length ? true : false; }
	$.isDefinied = function(obj) { return typeof(obj) !== 'undefined'; }
	$.isFunction = function(obj) { return typeof(obj) === 'function'; }
	$.isString   = function(obj) { return typeof(obj) === 'string'; }
	$.isObject   = function(obj) { return typeof(obj) === 'object'; }
	$.dataKeys   = function(obj) { return iterateKeys(obj, ''); function iterateKeys(obj, prefix) { return $.map(Object.keys(obj), function(key) { if(obj[key] && $.isObject(obj[key])) return iterateKeys(obj[key], key); else return (prefix ? prefix + '-' + key : key);}); }}
	$.dataVals   = function(obj, key) { var parts = key.split('.'), key = parts.shift(); if (parts.length) { for (var i = 0, len = parts.length; i < len; i++) { obj = obj[key] || {}; key = parts[i]; } } return obj[key]; }
	$.cssStyle	 = function(className) {
		var styleSheets = window.document.styleSheets,  styles = {};

		for(var i = 0, leni = styleSheets.length; i < leni; i++){
			if (styleSheets[i].href && styleSheets[i].href.indexOf(window.location.host + '/') < 0) continue;

			var classes = styleSheets[i].rules || styleSheets[i].cssRules;
			if (!classes) continue;

			for (var j = 0, lenj = classes.length; j < lenj; j++) {
				if (classes[j].selectorText != className) continue;

				var properties = classes[j].style.cssText.split(';');
				for (var k = 0, lenk = properties.length; k < lenk; k++) {
					var part = properties[k].split(':');
					if (part.length == 2) styles[part[0].trim()] = part[1].trim();
				}
			}
		}
		return styles;
	}

}(jQuery));

String.prototype.capitalize = function() { return this.charAt(0).toUpperCase() + this.slice(1); }


/*!
 * typeahead.js 0.11.1
 * https://github.com/twitter/typeahead.js
 * Copyright 2013-2015 Twitter, Inc. and other contributors; Licensed MIT
*/
!function(t, e) {
    "function" == typeof define && define.amd ? define("bloodhound", ["jquery"], function(n) {
        return t.Bloodhound = e(n)
    }) : "object" == typeof exports ? module.exports = e(require("jquery")) : t.Bloodhound = e(jQuery)
}(this, function(t) {
    var e = function() {
        "use strict";
        return {
            isMsie: function() {
                return !!/(msie|trident)/i.test(navigator.userAgent) && navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2]
            },
            isBlankString: function(t) {
                return !t || /^\s*$/.test(t)
            },
            escapeRegExChars: function(t) {
                return t.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
            },
            isString: function(t) {
                return "string" == typeof t
            },
            isNumber: function(t) {
                return "number" == typeof t
            },
            isArray: t.isArray,
            isFunction: t.isFunction,
            isObject: t.isPlainObject,
            isUndefined: function(t) {
                return void 0 === t
            },
            isElement: function(t) {
                return !(!t || 1 !== t.nodeType)
            },
            isJQuery: function(e) {
                return e instanceof t
            },
            toStr: function(t) {
                return e.isUndefined(t) || null === t ? "" : t + ""
            },
            bind: t.proxy,
            each: function(e, n) {
                t.each(e, function(t, e) {
                    return n(e, t)
                })
            },
            map: t.map,
            filter: t.grep,
            every: function(e, n) {
                var i = !0;
                return e ? (t.each(e, function(t, r) {
                    if (!(i = n.call(null, r, t, e)))
                        return !1
                }),
                !!i) : i
            },
            some: function(e, n) {
                var i = !1;
                return e ? (t.each(e, function(t, r) {
                    if (i = n.call(null, r, t, e))
                        return !1
                }),
                !!i) : i
            },
            mixin: t.extend,
            identity: function(t) {
                return t
            },
            clone: function(e) {
                return t.extend(!0, {}, e)
            },
            getIdGenerator: function() {
                var t = 0;
                return function() {
                    return t++
                }
            },
            templatify: function(e) {
                return t.isFunction(e) ? e : function() {
                    return String(e)
                }
            },
            defer: function(t) {
                setTimeout(t, 0)
            },
            debounce: function(t, e, n) {
                var i, r;
                return function() {
                    var s, o, u = this, a = arguments;
                    return s = function() {
                        i = null,
                        n || (r = t.apply(u, a))
                    }
                    ,
                    o = n && !i,
                    clearTimeout(i),
                    i = setTimeout(s, e),
                    o && (r = t.apply(u, a)),
                    r
                }
            },
            throttle: function(t, e) {
                var n, i, r, s, o, u;
                return o = 0,
                u = function() {
                    o = new Date,
                    r = null,
                    s = t.apply(n, i)
                }
                ,
                function() {
                    var a = new Date
                      , c = e - (a - o);
                    return n = this,
                    i = arguments,
                    c <= 0 ? (clearTimeout(r),
                    r = null,
                    o = a,
                    s = t.apply(n, i)) : r || (r = setTimeout(u, c)),
                    s
                }
            },
            stringify: function(t) {
                return e.isString(t) ? t : JSON.stringify(t)
            },
            noop: function() {}
        }
    }()
      , n = "0.11.1"
      , i = function() {
        "use strict";
        return {
            nonword: n,
            whitespace: t,
            obj: {
                nonword: i(n),
                whitespace: i(t)
            }
        };
        function t(t) {
            return (t = e.toStr(t)) ? t.split(/\s+/) : []
        }
        function n(t) {
            return (t = e.toStr(t)) ? t.split(/\W+/) : []
        }
        function i(t) {
            return function(n) {
                return n = e.isArray(n) ? n : [].slice.call(arguments, 0),
                function(i) {
                    var r = [];
                    return e.each(n, function(n) {
                        r = r.concat(t(e.toStr(i[n])))
                    }),
                    r
                }
            }
        }
    }()
      , r = function() {
        "use strict";
        function n(n) {
            this.maxSize = e.isNumber(n) ? n : 100,
            this.reset(),
            this.maxSize <= 0 && (this.set = this.get = t.noop)
        }
        function i() {
            this.head = this.tail = null
        }
        return e.mixin(n.prototype, {
            set: function(t, e) {
                var n, i = this.list.tail;
                this.size >= this.maxSize && (this.list.remove(i),
                delete this.hash[i.key],
                this.size--),
                (n = this.hash[t]) ? (n.val = e,
                this.list.moveToFront(n)) : (n = new function(t, e) {
                    this.key = t,
                    this.val = e,
                    this.prev = this.next = null
                }
                (t,e),
                this.list.add(n),
                this.hash[t] = n,
                this.size++)
            },
            get: function(t) {
                var e = this.hash[t];
                if (e)
                    return this.list.moveToFront(e),
                    e.val
            },
            reset: function() {
                this.size = 0,
                this.hash = {},
                this.list = new i
            }
        }),
        e.mixin(i.prototype, {
            add: function(t) {
                this.head && (t.next = this.head,
                this.head.prev = t),
                this.head = t,
                this.tail = this.tail || t
            },
            remove: function(t) {
                t.prev ? t.prev.next = t.next : this.head = t.next,
                t.next ? t.next.prev = t.prev : this.tail = t.prev
            },
            moveToFront: function(t) {
                this.remove(t),
                this.add(t)
            }
        }),
        n
    }()
      , s = function() {
        "use strict";
        var n;
        try {
            (n = window.localStorage).setItem("~~~", "!"),
            n.removeItem("~~~")
        } catch (t) {
            n = null
        }
        function i(t, i) {
            this.prefix = ["__", t, "__"].join(""),
            this.ttlKey = "__ttl__",
            this.keyMatcher = new RegExp("^" + e.escapeRegExChars(this.prefix)),
            this.ls = i || n,
            !this.ls && this._noop()
        }
        return e.mixin(i.prototype, {
            _prefix: function(t) {
                return this.prefix + t
            },
            _ttlKey: function(t) {
                return this._prefix(t) + this.ttlKey
            },
            _noop: function() {
                this.get = this.set = this.remove = this.clear = this.isExpired = e.noop
            },
            _safeSet: function(t, e) {
                try {
                    this.ls.setItem(t, e)
                } catch (t) {
                    "QuotaExceededError" === t.name && (this.clear(),
                    this._noop())
                }
            },
            get: function(t) {
                return this.isExpired(t) && this.remove(t),
                o(this.ls.getItem(this._prefix(t)))
            },
            set: function(t, n, i) {
                return e.isNumber(i) ? this._safeSet(this._ttlKey(t), s(r() + i)) : this.ls.removeItem(this._ttlKey(t)),
                this._safeSet(this._prefix(t), s(n))
            },
            remove: function(t) {
                return this.ls.removeItem(this._ttlKey(t)),
                this.ls.removeItem(this._prefix(t)),
                this
            },
            clear: function() {
                var t, e = function(t) {
                    var e, i, r = [], s = n.length;
                    for (e = 0; e < s; e++)
                        (i = n.key(e)).match(t) && r.push(i.replace(t, ""));
                    return r
                }(this.keyMatcher);
                for (t = e.length; t--; )
                    this.remove(e[t]);
                return this
            },
            isExpired: function(t) {
                var n = o(this.ls.getItem(this._ttlKey(t)));
                return !!(e.isNumber(n) && r() > n)
            }
        }),
        i;
        function r() {
            return (new Date).getTime()
        }
        function s(t) {
            return JSON.stringify(e.isUndefined(t) ? null : t)
        }
        function o(e) {
            return t.parseJSON(e)
        }
    }()
      , o = function() {
        "use strict";
        var n = 0
          , i = {}
          , s = 6
          , o = new r(10);
        function u(t) {
            t = t || {},
            this.cancelled = !1,
            this.lastReq = null,
            this._send = t.transport,
            this._get = t.limiter ? t.limiter(this._get) : this._get,
            this._cache = !1 === t.cache ? new r(0) : o
        }
        return u.setMaxPendingRequests = function(t) {
            s = t
        }
        ,
        u.resetCache = function() {
            o.reset()
        }
        ,
        e.mixin(u.prototype, {
            _fingerprint: function(e) {
                return (e = e || {}).url + e.type + t.param(e.data || {})
            },
            _get: function(t, e) {
                var r, o, u = this;
                function a(t) {
                    e(null, t),
                    u._cache.set(r, t)
                }
                function c() {
                    e(!0)
                }
                r = this._fingerprint(t),
                this.cancelled || r !== this.lastReq || ((o = i[r]) ? o.done(a).fail(c) : n < s ? (n++,
                i[r] = this._send(t).done(a).fail(c).always(function() {
                    n--,
                    delete i[r],
                    u.onDeckRequestArgs && (u._get.apply(u, u.onDeckRequestArgs),
                    u.onDeckRequestArgs = null)
                })) : this.onDeckRequestArgs = [].slice.call(arguments, 0))
            },
            get: function(n, i) {
                var r, s;
                i = i || t.noop,
                n = e.isString(n) ? {
                    url: n
                } : n || {},
                s = this._fingerprint(n),
                this.cancelled = !1,
                this.lastReq = s,
                (r = this._cache.get(s)) ? i(null, r) : this._get(n, i)
            },
            cancel: function() {
                this.cancelled = !0
            }
        }),
        u
    }()
      , u = window.SearchIndex = function() {
        "use strict";
        var n = "c"
          , i = "i";
        function r(n) {
            (n = n || {}).datumTokenizer && n.queryTokenizer || t.error("datumTokenizer and queryTokenizer are both required"),
            this.identify = n.identify || e.stringify,
            this.datumTokenizer = n.datumTokenizer,
            this.queryTokenizer = n.queryTokenizer,
            this.reset()
        }
        return e.mixin(r.prototype, {
            bootstrap: function(t) {
                this.datums = t.datums,
                this.trie = t.trie
            },
            add: function(t) {
                var r = this;
                t = e.isArray(t) ? t : [t],
                e.each(t, function(t) {
                    var u, a;
                    r.datums[u = r.identify(t)] = t,
                    a = s(r.datumTokenizer(t)),
                    e.each(a, function(t) {
                        var e, s, a;
                        for (e = r.trie,
                        s = t.split(""); a = s.shift(); )
                            (e = e[n][a] || (e[n][a] = o()))[i].push(u)
                    })
                })
            },
            get: function(t) {
                var n = this;
                return e.map(t, function(t) {
                    return n.datums[t]
                })
            },
            search: function(t) {
                var r, o, u = this;
                return r = s(this.queryTokenizer(t)),
                e.each(r, function(t) {
                    var e, r, s, a;
                    if (o && 0 === o.length)
                        return !1;
                    for (e = u.trie,
                    r = t.split(""); e && (s = r.shift()); )
                        e = e[n][s];
                    if (!e || 0 !== r.length)
                        return o = [],
                        !1;
                    a = e[i].slice(0),
                    o = o ? function(t, e) {
                        var n = 0
                          , i = 0
                          , r = [];
                        t = t.sort(),
                        e = e.sort();
                        var s = t.length
                          , o = e.length;
                        for (; n < s && i < o; )
                            t[n] < e[i] ? n++ : t[n] > e[i] ? i++ : (r.push(t[n]),
                            n++,
                            i++);
                        return r
                    }(o, a) : a
                }),
                o ? e.map(function(t) {
                    for (var e = {}, n = [], i = 0, r = t.length; i < r; i++)
                        e[t[i]] || (e[t[i]] = !0,
                        n.push(t[i]));
                    return n
                }(o), function(t) {
                    return u.datums[t]
                }) : []
            },
            all: function() {
                var t = [];
                for (var e in this.datums)
                    t.push(this.datums[e]);
                return t
            },
            reset: function() {
                this.datums = {},
                this.trie = o()
            },
            serialize: function() {
                return {
                    datums: this.datums,
                    trie: this.trie
                }
            }
        }),
        r;
        function s(t) {
            return t = e.filter(t, function(t) {
                return !!t
            }),
            t = e.map(t, function(t) {
                return t.toLowerCase()
            })
        }
        function o() {
            var t = {};
            return t[i] = [],
            t[n] = {},
            t
        }
    }()
      , a = function() {
        "use strict";
        var t;
        function n(t) {
            this.url = t.url,
            this.ttl = t.ttl,
            this.cache = t.cache,
            this.prepare = t.prepare,
            this.transform = t.transform,
            this.transport = t.transport,
            this.thumbprint = t.thumbprint,
            this.storage = new s(t.cacheKey)
        }
        return t = {
            data: "data",
            protocol: "protocol",
            thumbprint: "thumbprint"
        },
        e.mixin(n.prototype, {
            _settings: function() {
                return {
                    url: this.url,
                    type: "GET",
                    dataType: "json"
                }
            },
            store: function(e) {
                this.cache && (this.storage.set(t.data, e, this.ttl),
                this.storage.set(t.protocol, location.protocol, this.ttl),
                this.storage.set(t.thumbprint, this.thumbprint, this.ttl))
            },
            fromCache: function() {
                var e, n = {};
                return this.cache ? (n.data = this.storage.get(t.data),
                n.protocol = this.storage.get(t.protocol),
                n.thumbprint = this.storage.get(t.thumbprint),
                e = n.thumbprint !== this.thumbprint || n.protocol !== location.protocol,
                n.data && !e ? n.data : null) : null
            },
            fromNetwork: function(t) {
                var e, n = this;
                t && (e = this.prepare(this._settings()),
                this.transport(e).fail(function() {
                    t(!0)
                }).done(function(e) {
                    t(null, n.transform(e))
                }))
            },
            clear: function() {
                return this.storage.clear(),
                this
            }
        }),
        n
    }()
      , c = function() {
        "use strict";
        function t(t) {
            this.url = t.url,
            this.prepare = t.prepare,
            this.transform = t.transform,
            this.transport = new o({
                cache: t.cache,
                limiter: t.limiter,
                transport: t.transport
            })
        }
        return e.mixin(t.prototype, {
            _settings: function() {
                return {
                    url: this.url,
                    type: "GET",
                    dataType: "json"
                }
            },
            get: function(t, e) {
                var n, i = this;
                if (e)
                    return t = t || "",
                    n = this.prepare(t, this._settings()),
                    this.transport.get(n, function(t, n) {
                        e(t ? [] : i.transform(n))
                    })
            },
            cancelLastRequest: function() {
                this.transport.cancel()
            }
        }),
        t
    }()
      , h = function() {
        "use strict";
        return function(r) {
            var s, o;
            return s = {
                initialize: !0,
                identify: e.stringify,
                datumTokenizer: null,
                queryTokenizer: null,
                sufficient: 5,
                sorter: null,
                local: [],
                prefetch: null,
                remote: null
            },
            !(r = e.mixin(s, r || {})).datumTokenizer && t.error("datumTokenizer is required"),
            !r.queryTokenizer && t.error("queryTokenizer is required"),
            o = r.sorter,
            r.sorter = o ? function(t) {
                return t.sort(o)
            }
            : e.identity,
            r.local = e.isFunction(r.local) ? r.local() : r.local,
            r.prefetch = function(r) {
                var s;
                if (!r)
                    return null;
                return s = {
                    url: null,
                    ttl: 864e5,
                    cache: !0,
                    cacheKey: null,
                    thumbprint: "",
                    prepare: e.identity,
                    transform: e.identity,
                    transport: null
                },
                r = e.isString(r) ? {
                    url: r
                } : r,
                !(r = e.mixin(s, r)).url && t.error("prefetch requires url to be set"),
                r.transform = r.filter || r.transform,
                r.cacheKey = r.cacheKey || r.url,
                r.thumbprint = n + r.thumbprint,
                r.transport = r.transport ? i(r.transport) : t.ajax,
                r
            }(r.prefetch),
            r.remote = function(n) {
                var r;
                if (!n)
                    return;
                return r = {
                    url: null,
                    cache: !0,
                    prepare: null,
                    replace: null,
                    wildcard: null,
                    limiter: null,
                    rateLimitBy: "debounce",
                    rateLimitWait: 300,
                    transform: e.identity,
                    transport: null
                },
                n = e.isString(n) ? {
                    url: n
                } : n,
                !(n = e.mixin(r, n)).url && t.error("remote requires url to be set"),
                n.transform = n.filter || n.transform,
                n.prepare = (l = n,
                f = l.prepare,
                d = l.replace,
                p = l.wildcard,
                f || (f = d ? function(t, e) {
                    return e.url = d(e.url, t),
                    e
                }
                : l.wildcard ? function(t, e) {
                    return e.url = e.url.replace(p, encodeURIComponent(t)),
                    e
                }
                : function(t, e) {
                    return e
                }
                )),
                n.limiter = (s = n,
                o = s.limiter,
                u = s.rateLimitBy,
                a = s.rateLimitWait,
                o || (o = /^throttle$/i.test(u) ? (h = a,
                function(t) {
                    return e.throttle(t, h)
                }
                ) : (c = a,
                function(t) {
                    return e.debounce(t, c)
                }
                )),
                o),
                n.transport = n.transport ? i(n.transport) : t.ajax,
                delete n.replace,
                delete n.wildcard,
                delete n.rateLimitBy,
                delete n.rateLimitWait,
                n;
                var s, o, u, a, c, h;
                var l, f, d, p
            }(r.remote),
            r
        }
        ;
        function i(n) {
            return function(i) {
                var r = t.Deferred();
                return n(i, function(t) {
                    e.defer(function() {
                        r.resolve(t)
                    })
                }, function(t) {
                    e.defer(function() {
                        r.reject(t)
                    })
                }),
                r
            }
        }
    }();
    return function() {
        "use strict";
        var n;
        function r(t) {
            t = h(t),
            this.sorter = t.sorter,
            this.identify = t.identify,
            this.sufficient = t.sufficient,
            this.local = t.local,
            this.remote = t.remote ? new c(t.remote) : null,
            this.prefetch = t.prefetch ? new a(t.prefetch) : null,
            this.index = new u({
                identify: this.identify,
                datumTokenizer: t.datumTokenizer,
                queryTokenizer: t.queryTokenizer
            }),
            !1 !== t.initialize && this.initialize()
        }
        return n = window && window.Bloodhound,
        r.noConflict = function() {
            return window && (window.Bloodhound = n),
            r
        }
        ,
        r.tokenizers = i,
        e.mixin(r.prototype, {
            __ttAdapter: function() {
                var t = this;
                return this.remote ? function(e, n, i) {
                    return t.search(e, n, i)
                }
                : function(e, n) {
                    return t.search(e, n)
                }
            },
            _loadPrefetch: function() {
                var e, n, i = this;
                return e = t.Deferred(),
                this.prefetch ? (n = this.prefetch.fromCache()) ? (this.index.bootstrap(n),
                e.resolve()) : this.prefetch.fromNetwork(function(t, n) {
                    if (t)
                        return e.reject();
                    i.add(n),
                    i.prefetch.store(i.index.serialize()),
                    e.resolve()
                }) : e.resolve(),
                e.promise()
            },
            _initialize: function() {
                var t = this;
                return this.clear(),
                (this.initPromise = this._loadPrefetch()).done(function() {
                    t.add(t.local)
                }),
                this.initPromise
            },
            initialize: function(t) {
                return !this.initPromise || t ? this._initialize() : this.initPromise
            },
            add: function(t) {
                return this.index.add(t),
                this
            },
            get: function(t) {
                return t = e.isArray(t) ? t : [].slice.call(arguments),
                this.index.get(t)
            },
            search: function(t, n, i) {
                var r, s = this;
                return r = this.sorter(this.index.search(t)),
                n(this.remote ? r.slice() : r),
                this.remote && r.length < this.sufficient ? this.remote.get(t, function(t) {
                    var n = [];
                    e.each(t, function(t) {
                        !e.some(r, function(e) {
                            return s.identify(t) === s.identify(e)
                        }) && n.push(t)
                    }),
                    i && i(n)
                }) : this.remote && this.remote.cancelLastRequest(),
                this
            },
            all: function() {
                return this.index.all()
            },
            clear: function() {
                return this.index.reset(),
                this
            },
            clearPrefetchCache: function() {
                return this.prefetch && this.prefetch.clear(),
                this
            },
            clearRemoteCache: function() {
                return o.resetCache(),
                this
            },
            ttAdapter: function() {
                return this.__ttAdapter()
            }
        }),
        r
    }()
}),
function(t, e) {
    "function" == typeof define && define.amd ? define("typeahead.js", ["jquery"], function(t) {
        return e(t)
    }) : "object" == typeof exports ? module.exports = e(require("jquery")) : e(jQuery)
}(0, function(t) {
    var e = function() {
        "use strict";
        return {
            isMsie: function() {
                return !!/(msie|trident)/i.test(navigator.userAgent) && navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2]
            },
            isBlankString: function(t) {
                return !t || /^\s*$/.test(t)
            },
            escapeRegExChars: function(t) {
                return t.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
            },
            isString: function(t) {
                return "string" == typeof t
            },
            isNumber: function(t) {
                return "number" == typeof t
            },
            isArray: t.isArray,
            isFunction: t.isFunction,
            isObject: t.isPlainObject,
            isUndefined: function(t) {
                return void 0 === t
            },
            isElement: function(t) {
                return !(!t || 1 !== t.nodeType)
            },
            isJQuery: function(e) {
                return e instanceof t
            },
            toStr: function(t) {
                return e.isUndefined(t) || null === t ? "" : t + ""
            },
            bind: t.proxy,
            each: function(e, n) {
                t.each(e, function(t, e) {
                    return n(e, t)
                })
            },
            map: t.map,
            filter: t.grep,
            every: function(e, n) {
                var i = !0;
                return e ? (t.each(e, function(t, r) {
                    if (!(i = n.call(null, r, t, e)))
                        return !1
                }),
                !!i) : i
            },
            some: function(e, n) {
                var i = !1;
                return e ? (t.each(e, function(t, r) {
                    if (i = n.call(null, r, t, e))
                        return !1
                }),
                !!i) : i
            },
            mixin: t.extend,
            identity: function(t) {
                return t
            },
            clone: function(e) {
                return t.extend(!0, {}, e)
            },
            getIdGenerator: function() {
                var t = 0;
                return function() {
                    return t++
                }
            },
            templatify: function(e) {
                return t.isFunction(e) ? e : function() {
                    return String(e)
                }
            },
            defer: function(t) {
                setTimeout(t, 0)
            },
            debounce: function(t, e, n) {
                var i, r;
                return function() {
                    var s, o, u = this, a = arguments;
                    return s = function() {
                        i = null,
                        n || (r = t.apply(u, a))
                    }
                    ,
                    o = n && !i,
                    clearTimeout(i),
                    i = setTimeout(s, e),
                    o && (r = t.apply(u, a)),
                    r
                }
            },
            throttle: function(t, e) {
                var n, i, r, s, o, u;
                return o = 0,
                u = function() {
                    o = new Date,
                    r = null,
                    s = t.apply(n, i)
                }
                ,
                function() {
                    var a = new Date
                      , c = e - (a - o);
                    return n = this,
                    i = arguments,
                    c <= 0 ? (clearTimeout(r),
                    r = null,
                    o = a,
                    s = t.apply(n, i)) : r || (r = setTimeout(u, c)),
                    s
                }
            },
            stringify: function(t) {
                return e.isString(t) ? t : JSON.stringify(t)
            },
            noop: function() {}
        }
    }()
      , n = function() {
        "use strict";
        var t = {
            wrapper: "twitter-typeahead",
            input: "tt-input",
            hint: "tt-hint",
            menu: "tt-menu",
            dataset: "tt-dataset",
            suggestion: "tt-suggestion",
            selectable: "tt-selectable",
            empty: "tt-empty",
            open: "tt-open",
            cursor: "tt-cursor",
            highlight: "tt-highlight",
            group: "tt-group"
        };
        return function(n) {
            var i, r;
            return r = e.mixin({}, t, n),
            {
                css: (i = {
                    css: (a = {
                        wrapper: {
                            position: "relative",
                            display: "inline-block"
                        },
                        hint: {
                            position: "absolute",
                            top: "0",
                            left: "0",
                            borderColor: "transparent",
                            boxShadow: "none",
                            opacity: "1"
                        },
                        input: {
                            position: "relative",
                            verticalAlign: "top",
                            backgroundColor: "transparent"
                        },
                        inputWithNoHint: {
                            position: "relative",
                            verticalAlign: "top"
                        },
                        menu: {
                            position: "absolute",
                            top: "100%",
                            left: "0",
                            zIndex: "100",
                            display: "none"
                        },
                        ltr: {
                            left: "0",
                            right: "auto"
                        },
                        rtl: {
                            left: "auto",
                            right: " 0"
                        }
                    },
                    e.isMsie() && e.mixin(a.input, {
                        backgroundImage: "url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)"
                    }),
                    a),
                    classes: r,
                    html: (u = r,
                    {
                        wrapper: '<span class="' + u.wrapper + '"></span>',
                        menu: '<div class="' + u.menu + '"></div>'
                    }),
                    selectors: (s = r,
                    o = {},
                    e.each(s, function(t, e) {
                        o[e] = "." + t
                    }),
                    o)
                }).css,
                html: i.html,
                classes: i.classes,
                selectors: i.selectors,
                mixin: function(t) {
                    e.mixin(t, i)
                }
            };
            var s, o;
            var u;
            var a
        }
    }()
      , i = function() {
        "use strict";
        var n, i;
        function r(e) {
            e && e.el || t.error("EventBus initialized without el"),
            this.$el = t(e.el)
        }
        return n = "typeahead:",
        i = {
            render: "rendered",
            cursorchange: "cursorchanged",
            select: "selected",
            autocomplete: "autocompleted"
        },
        e.mixin(r.prototype, {
            _trigger: function(e, i) {
                var r;
                return r = t.Event(n + e),
                (i = i || []).unshift(r),
                this.$el.trigger.apply(this.$el, i),
                r
            },
            after: function(t) {
                var e;
                return e = [].slice.call(arguments, 1),
                this._trigger("after" + t, e).isDefaultPrevented()
            },
            before: function(t) {
                var e;
                return e = [].slice.call(arguments, 1),
                this._trigger("before" + t, e).isDefaultPrevented()
            },
            trigger: function(t) {
                var e;
                this._trigger(t, [].slice.call(arguments, 1)),
                (e = i[t]) && this._trigger(e, [].slice.call(arguments, 1))
            }
        }),
        r
    }()
      , r = function() {
        "use strict";
        var t = /\s+/
          , e = function() {
            var t;
            t = window.setImmediate ? function(t) {
                setImmediate(function() {
                    t()
                })
            }
            : function(t) {
                setTimeout(function() {
                    t()
                }, 0)
            }
            ;
            return t
        }();
        return {
            onSync: function(t, e, i) {
                return n.call(this, "sync", t, e, i)
            },
            onAsync: function(t, e, i) {
                return n.call(this, "async", t, e, i)
            },
            off: function(e) {
                var n;
                if (!this._callbacks)
                    return this;
                e = e.split(t);
                for (; n = e.shift(); )
                    delete this._callbacks[n];
                return this
            },
            trigger: function(n) {
                var r, s, o, u, a;
                if (!this._callbacks)
                    return this;
                n = n.split(t),
                o = [].slice.call(arguments, 1);
                for (; (r = n.shift()) && (s = this._callbacks[r]); )
                    u = i(s.sync, this, [r].concat(o)),
                    a = i(s.async, this, [r].concat(o)),
                    u() && e(a);
                return this
            }
        };
        function n(e, n, i, r) {
            var s, o, u;
            if (!i)
                return this;
            for (n = n.split(t),
            i = r ? (u = r,
            (o = i).bind ? o.bind(u) : function() {
                o.apply(u, [].slice.call(arguments, 0))
            }
            ) : i,
            this._callbacks = this._callbacks || {}; s = n.shift(); )
                this._callbacks[s] = this._callbacks[s] || {
                    sync: [],
                    async: []
                },
                this._callbacks[s][e].push(i);
            return this
        }
        function i(t, e, n) {
            return function() {
                for (var i, r = 0, s = t.length; !i && r < s; r += 1)
                    i = !1 === t[r].apply(e, n);
                return !i
            }
        }
    }()
      , s = function(t) {
        "use strict";
        var n = {
            node: null,
            pattern: null,
            tagName: "strong",
            className: null,
            wordsOnly: !1,
            caseSensitive: !1
        };
        return function(i) {
            var r;
            (i = e.mixin({}, n, i)).node && i.pattern && (i.pattern = e.isArray(i.pattern) ? i.pattern : [i.pattern],
            r = function(t, n, i) {
                for (var r, s = [], o = 0, u = t.length; o < u; o++)
                    s.push(e.escapeRegExChars(t[o]));
                return r = i ? "\\b(" + s.join("|") + ")\\b" : "(" + s.join("|") + ")",
                n ? new RegExp(r) : new RegExp(r,"i")
            }(i.pattern, i.caseSensitive, i.wordsOnly),
            function t(e, n) {
                var i;
                for (var r = 0; r < e.childNodes.length; r++)
                    3 === (i = e.childNodes[r]).nodeType ? r += n(i) ? 1 : 0 : t(i, n)
            }(i.node, function(e) {
                var n, s, o;
                (n = r.exec(e.data)) && (o = t.createElement(i.tagName),
                i.className && (o.className = i.className),
                (s = e.splitText(n.index)).splitText(n[0].length),
                o.appendChild(s.cloneNode(!0)),
                e.parentNode.replaceChild(o, s));
                return !!n
            }))
        }
    }(window.document)
      , o = function() {
        "use strict";
        var n;
        function i(n, i) {
            var r;
            (n = n || {}).input || t.error("input is missing"),
            i.mixin(this),
            this.$hint = t(n.hint),
            this.$input = t(n.input),
            this.query = this.$input.val(),
            this.queryWhenFocused = this.hasFocus() ? this.query : null,
            this.$overflowHelper = (r = this.$input,
            t('<pre aria-hidden="true"></pre>').css({
                position: "absolute",
                visibility: "hidden",
                whiteSpace: "pre",
                fontFamily: r.css("font-family"),
                fontSize: r.css("font-size"),
                fontStyle: r.css("font-style"),
                fontVariant: r.css("font-variant"),
                fontWeight: r.css("font-weight"),
                wordSpacing: r.css("word-spacing"),
                letterSpacing: r.css("letter-spacing"),
                textIndent: r.css("text-indent"),
                textRendering: r.css("text-rendering"),
                textTransform: r.css("text-transform")
            }).insertAfter(r)),
            this._checkLanguageDirection(),
            0 === this.$hint.length && (this.setHint = this.getHint = this.clearHint = this.clearHintIfInvalid = e.noop)
        }
        return n = {
            9: "tab",
            27: "esc",
            37: "left",
            39: "right",
            13: "enter",
            38: "up",
            40: "down"
        },
        i.normalizeQuery = function(t) {
            return e.toStr(t).replace(/^\s*/g, "").replace(/\s{2,}/g, " ")
        }
        ,
        e.mixin(i.prototype, r, {
            _onBlur: function() {
                this.resetInputValue(),
                this.trigger("blurred")
            },
            _onFocus: function() {
                this.queryWhenFocused = this.query,
                this.trigger("focused")
            },
            _onKeydown: function(t) {
                var e = n[t.which || t.keyCode];
                this._managePreventDefault(e, t),
                e && this._shouldTrigger(e, t) && this.trigger(e + "Keyed", t)
            },
            _onInput: function() {
                this._setQuery(this.getInputValue()),
                this.clearHintIfInvalid(),
                this._checkLanguageDirection()
            },
            _managePreventDefault: function(t, e) {
                var n;
                switch (t) {
                case "up":
                case "down":
                    n = !s(e);
                    break;
                default:
                    n = !1
                }
                n && e.preventDefault()
            },
            _shouldTrigger: function(t, e) {
                var n;
                switch (t) {
                case "tab":
                    n = !s(e);
                    break;
                default:
                    n = !0
                }
                return n
            },
            _checkLanguageDirection: function() {
                var t = (this.$input.css("direction") || "ltr").toLowerCase();
                this.dir !== t && (this.dir = t,
                this.$hint.attr("dir", t),
                this.trigger("langDirChanged", t))
            },
            _setQuery: function(t, e) {
                var n, r, s, o;
                s = t,
                o = this.query,
                r = !!(n = i.normalizeQuery(s) === i.normalizeQuery(o)) && this.query.length !== t.length,
                this.query = t,
                e || n ? !e && r && this.trigger("whitespaceChanged", this.query) : this.trigger("queryChanged", this.query)
            },
            bind: function() {
                var t, i, r, s, o = this;
                return t = e.bind(this._onBlur, this),
                i = e.bind(this._onFocus, this),
                r = e.bind(this._onKeydown, this),
                s = e.bind(this._onInput, this),
                this.$input.on("blur.tt", t).on("focus.tt", i).on("keydown.tt", r),
                !e.isMsie() || e.isMsie() > 9 ? this.$input.on("input.tt", s) : this.$input.on("keydown.tt keypress.tt cut.tt paste.tt", function(t) {
                    n[t.which || t.keyCode] || e.defer(e.bind(o._onInput, o, t))
                }),
                this
            },
            focus: function() {
                this.$input.focus()
            },
            blur: function() {
                this.$input.blur()
            },
            getLangDir: function() {
                return this.dir
            },
            getQuery: function() {
                return this.query || ""
            },
            setQuery: function(t, e) {
                this.setInputValue(t),
                this._setQuery(t, e)
            },
            hasQueryChangedSinceLastFocus: function() {
                return this.query !== this.queryWhenFocused
            },
            getInputValue: function() {
                return this.$input.val()
            },
            setInputValue: function(t) {
                this.$input.val(t),
                this.clearHintIfInvalid(),
                this._checkLanguageDirection()
            },
            resetInputValue: function() {
                this.setInputValue(this.query)
            },
            getHint: function() {
                return this.$hint.val()
            },
            setHint: function(t) {
                this.$hint.val(t)
            },
            clearHint: function() {
                this.setHint("")
            },
            clearHintIfInvalid: function() {
                var t, e, n;
                n = (t = this.getInputValue()) !== (e = this.getHint()) && 0 === e.indexOf(t),
                !("" !== t && n && !this.hasOverflow()) && this.clearHint()
            },
            hasFocus: function() {
                return this.$input.is(":focus")
            },
            hasOverflow: function() {
                var t = this.$input.width() - 2;
                return this.$overflowHelper.text(this.getInputValue()),
                this.$overflowHelper.width() >= t
            },
            isCursorAtEnd: function() {
                var t, n, i;
                return t = this.$input.val().length,
                n = this.$input[0].selectionStart,
                e.isNumber(n) ? n === t : !document.selection || ((i = document.selection.createRange()).moveStart("character", -t),
                t === i.text.length)
            },
            destroy: function() {
                this.$hint.off(".tt"),
                this.$input.off(".tt"),
                this.$overflowHelper.remove(),
                this.$hint = this.$input = this.$overflowHelper = t("<div>")
            }
        }),
        i;
        function s(t) {
            return t.altKey || t.ctrlKey || t.metaKey || t.shiftKey
        }
    }()
      , u = function() {
        "use strict";
        var n, i;
        function o(n, r) {
            var s;
            (n = n || {}).templates = n.templates || {},
            n.templates.notFound = n.templates.notFound || n.templates.empty,
            n.source || t.error("missing source"),
            n.node || t.error("missing node"),
            n.name && (s = n.name,
            !/^[_a-zA-Z0-9-]+$/.test(s)) && t.error("invalid dataset name: " + n.name),
            r.mixin(this),
            this.highlight = !!n.highlight,
            this.name = n.name || i(),
            this.limit = n.limit || 5,
            this.displayFn = function(t) {
                return t = t || e.stringify,
                e.isFunction(t) ? t : function(e) {
                    return e[t]
                }
            }(n.display || n.displayKey),
            this.templates = function(n, i) {
                return {
                    notFound: n.notFound && e.templatify(n.notFound),
                    pending: n.pending && e.templatify(n.pending),
                    header: n.header && e.templatify(n.header),
                    footer: n.footer && e.templatify(n.footer),
                    suggestion: n.suggestion || function(e) {
                        return t("<div>").text(i(e))
                    }
                    ,
                    group: n.group || function(e) {
                        return t("<div>").text(i(e))
                    }
                }
            }(n.templates, this.displayFn),
            this.source = n.source.__ttAdapter ? n.source.__ttAdapter() : n.source,
            this.async = e.isUndefined(n.async) ? this.source.length > 2 : !!n.async,
            this._resetLastSuggestion(),
            this.$el = t(n.node).addClass(this.classes.dataset).addClass(this.classes.dataset + "-" + this.name)
        }
        return n = {
            val: "tt-selectable-display",
            obj: "tt-selectable-object"
        },
        i = e.getIdGenerator(),
        o.extractData = function(e) {
            var i = t(e);
            return i.data(n.obj) ? {
                val: i.data(n.val) || "",
                obj: i.data(n.obj) || null
            } : null
        }
        ,
        e.mixin(o.prototype, r, {
            _overwrite: function(t, e) {
                (e = e || []).length ? this._renderSuggestions(t, e) : this.async && this.templates.pending ? this._renderPending(t) : !this.async && this.templates.notFound ? this._renderNotFound(t) : this._empty(),
                this.trigger("rendered", this.name, e, !1)
            },
            _append: function(t, e) {
                (e = e || []).length && this.$lastSuggestion.length ? this._appendSuggestions(t, e) : e.length ? this._renderSuggestions(t, e) : !this.$lastSuggestion.length && this.templates.notFound && this._renderNotFound(t),
                this.trigger("rendered", this.name, e, !0)
            },
            _renderSuggestions: function(t, e) {
                var n;
                n = this._getSuggestionsFragment(t, e),
                this.$lastSuggestion = n.children().last(),
                this.$el.html(n).prepend(this._getHeader(t, e)).append(this._getFooter(t, e))
            },
            _appendSuggestions: function(t, e) {
                var n, i;
                i = (n = this._getSuggestionsFragment(t, e)).children().last(),
                this.$lastSuggestion.after(n),
                this.$lastSuggestion = i
            },
            _renderPending: function(t) {
                var e = this.templates.pending;
                this._resetLastSuggestion(),
                e && this.$el.html(e({
                    query: t,
                    dataset: this.name
                }))
            },
            _renderNotFound: function(t) {
                var e = this.templates.notFound;
                this._resetLastSuggestion(),
                e && this.$el.html(e({
                    query: t,
                    dataset: this.name
                }))
            },
            _empty: function() {
                this.$el.empty(),
                this._resetLastSuggestion()
            },
            _getSuggestionsFragment: function(i, r) {
                var o, u = this;
                return o = document.createDocumentFragment(),
                e.each(r, function(e) {
                    var r, s;
                    s = u._injectQuery(i, e),
                    r = e.value ? t(u.templates.suggestion(s)).data(n.obj, e).data(n.val, u.displayFn(e)).addClass(u.classes.suggestion + " " + u.classes.selectable) : t(u.templates.group(s)).addClass(u.classes.group),
                    o.appendChild(r[0])
                }),
                this.highlight && s({
                    className: this.classes.highlight,
                    node: o,
                    pattern: i
                }),
                t(o)
            },
            _getFooter: function(t, e) {
                return this.templates.footer ? this.templates.footer({
                    query: t,
                    suggestions: e,
                    dataset: this.name
                }) : null
            },
            _getHeader: function(t, e) {
                return this.templates.header ? this.templates.header({
                    query: t,
                    suggestions: e,
                    dataset: this.name
                }) : null
            },
            _resetLastSuggestion: function() {
                this.$lastSuggestion = t()
            },
            _injectQuery: function(t, n) {
                return e.isObject(n) ? e.mixin({
                    _query: t
                }, n) : n
            },
            update: function(e) {
                var n = this
                  , i = !1
                  , r = !1
                  , s = 0;
                function o(t) {
                    r || (r = !0,
                    t = (t || []).slice(0, n.limit),
                    s = t.length,
                    n._overwrite(e, t),
                    s < n.limit && n.async && n.trigger("asyncRequested", e))
                }
                this.cancel(),
                this.cancel = function() {
                    i = !0,
                    n.cancel = t.noop,
                    n.async && n.trigger("asyncCanceled", e)
                }
                ,
                this.source(e, o, function(r) {
                    r = r || [],
                    !i && s < n.limit && (n.cancel = t.noop,
                    s += r.length,
                    n._append(e, r.slice(0, n.limit - s)),
                    n.async && n.trigger("asyncReceived", e))
                }),
                !r && o([])
            },
            cancel: t.noop,
            clear: function() {
                this._empty(),
                this.cancel(),
                this.trigger("cleared")
            },
            isEmpty: function() {
                return this.$el.is(":empty")
            },
            destroy: function() {
                this.$el = t("<div>")
            }
        }),
        o
    }()
      , a = function() {
        "use strict";
        function n(n, i) {
            var r = this;
            (n = n || {}).node || t.error("node is required"),
            i.mixin(this),
            this.$node = t(n.node),
            this.query = null,
            this.datasets = e.map(n.datasets, function(e) {
                var n = r.$node.find(e.node).first();
                return e.node = n.length ? n : t("<div>").appendTo(r.$node),
                new u(e,i)
            })
        }
        return e.mixin(n.prototype, r, {
            _onSelectableClick: function(e) {
                this.trigger("selectableClicked", t(e.currentTarget))
            },
            _onRendered: function(t, e, n, i) {
                this.$node.toggleClass(this.classes.empty, this._allDatasetsEmpty()),
                this.trigger("datasetRendered", e, n, i)
            },
            _onCleared: function() {
                this.$node.toggleClass(this.classes.empty, this._allDatasetsEmpty()),
                this.trigger("datasetCleared")
            },
            _propagate: function() {
                this.trigger.apply(this, arguments)
            },
            _allDatasetsEmpty: function() {
                return e.every(this.datasets, function(t) {
                    return t.isEmpty()
                })
            },
            _getSelectables: function() {
                return this.$node.find(this.selectors.selectable)
            },
            _removeCursor: function() {
                var t = this.getActiveSelectable();
                t && t.removeClass(this.classes.cursor)
            },
            _ensureVisible: function(t) {
                var e, n, i, r;
                n = (e = t.position().top) + t.outerHeight(!0),
                i = this.$node.scrollTop(),
                r = this.$node.height() + parseInt(this.$node.css("paddingTop"), 10) + parseInt(this.$node.css("paddingBottom"), 10),
                e < 0 ? this.$node.scrollTop(i + e) : r < n && this.$node.scrollTop(i + (n - r))
            },
            bind: function() {
                var t, n = this;
                return t = e.bind(this._onSelectableClick, this),
                this.$node.on("click.tt", this.selectors.selectable, t),
                e.each(this.datasets, function(t) {
                    t.onSync("asyncRequested", n._propagate, n).onSync("asyncCanceled", n._propagate, n).onSync("asyncReceived", n._propagate, n).onSync("rendered", n._onRendered, n).onSync("cleared", n._onCleared, n)
                }),
                this
            },
            isOpen: function() {
                return this.$node.hasClass(this.classes.open)
            },
            open: function() {
                this.$node.addClass(this.classes.open)
            },
            close: function() {
                this.$node.removeClass(this.classes.open),
                this._removeCursor()
            },
            setLanguageDirection: function(t) {
                this.$node.attr("dir", t)
            },
            selectableRelativeToCursor: function(t) {
                var e, n, i;
                return n = this.getActiveSelectable(),
                e = this._getSelectables(),
                -1 === (i = (i = ((i = (n ? e.index(n) : -1) + t) + 1) % (e.length + 1) - 1) < -1 ? e.length - 1 : i) ? null : e.eq(i)
            },
            setCursor: function(t) {
                this._removeCursor(),
                (t = t && t.first()) && (t.addClass(this.classes.cursor),
                this._ensureVisible(t))
            },
            getSelectableData: function(t) {
                return t && t.length ? u.extractData(t) : null
            },
            getActiveSelectable: function() {
                var t = this._getSelectables().filter(this.selectors.cursor).first();
                return t.length ? t : null
            },
            getTopSelectable: function() {
                var t = this._getSelectables().first();
                return t.length ? t : null
            },
            update: function(t) {
                var n = t !== this.query;
                return n && (this.query = t,
                e.each(this.datasets, function(e) {
                    e.update(t)
                })),
                n
            },
            empty: function() {
                e.each(this.datasets, function(t) {
                    t.clear()
                }),
                this.query = null,
                this.$node.addClass(this.classes.empty)
            },
            destroy: function() {
                this.$node.off(".tt"),
                this.$node = t("<div>"),
                e.each(this.datasets, function(t) {
                    t.destroy()
                })
            }
        }),
        n
    }()
      , c = function() {
        "use strict";
        var t = a.prototype;
        function n() {
            a.apply(this, [].slice.call(arguments, 0))
        }
        return e.mixin(n.prototype, a.prototype, {
            open: function() {
                return !this._allDatasetsEmpty() && this._show(),
                t.open.apply(this, [].slice.call(arguments, 0))
            },
            close: function() {
                return this._hide(),
                t.close.apply(this, [].slice.call(arguments, 0))
            },
            _onRendered: function() {
                return this._allDatasetsEmpty() ? this._hide() : this.isOpen() && this._show(),
                t._onRendered.apply(this, [].slice.call(arguments, 0))
            },
            _onCleared: function() {
                return this._allDatasetsEmpty() ? this._hide() : this.isOpen() && this._show(),
                t._onCleared.apply(this, [].slice.call(arguments, 0))
            },
            setLanguageDirection: function(e) {
                return this.$node.css("ltr" === e ? this.css.ltr : this.css.rtl),
                t.setLanguageDirection.apply(this, [].slice.call(arguments, 0))
            },
            _hide: function() {
                this.$node.hide()
            },
            _show: function() {
                this.$node.css("display", "block")
            }
        }),
        n
    }()
      , h = function() {
        "use strict";
        function n(n, r) {
            var s, o, u, a, c, h, l, f, d, p, g;
            (n = n || {}).input || t.error("missing input"),
            n.menu || t.error("missing menu"),
            n.eventBus || t.error("missing event bus"),
            r.mixin(this),
            this.eventBus = n.eventBus,
            this.minLength = e.isNumber(n.minLength) ? n.minLength : 1,
            this.input = n.input,
            this.menu = n.menu,
            this.enabled = !0,
            this.active = !1,
            this.input.hasFocus() && this.activate(),
            this.dir = this.input.getLangDir(),
            this._hacks(),
            this.menu.bind().onSync("selectableClicked", this._onSelectableClicked, this).onSync("asyncRequested", this._onAsyncRequested, this).onSync("asyncCanceled", this._onAsyncCanceled, this).onSync("asyncReceived", this._onAsyncReceived, this).onSync("datasetRendered", this._onDatasetRendered, this).onSync("datasetCleared", this._onDatasetCleared, this),
            s = i(this, "activate", "open", "_onFocused"),
            o = i(this, "deactivate", "_onBlurred"),
            u = i(this, "isActive", "isOpen", "_onEnterKeyed"),
            a = i(this, "isActive", "isOpen", "_onTabKeyed"),
            c = i(this, "isActive", "_onEscKeyed"),
            h = i(this, "isActive", "open", "_onUpKeyed"),
            l = i(this, "isActive", "open", "_onDownKeyed"),
            f = i(this, "isActive", "isOpen", "_onLeftKeyed"),
            d = i(this, "isActive", "isOpen", "_onRightKeyed"),
            p = i(this, "_openIfActive", "_onQueryChanged"),
            g = i(this, "_openIfActive", "_onWhitespaceChanged"),
            this.input.bind().onSync("focused", s, this).onSync("blurred", o, this).onSync("enterKeyed", u, this).onSync("tabKeyed", a, this).onSync("escKeyed", c, this).onSync("upKeyed", h, this).onSync("downKeyed", l, this).onSync("leftKeyed", f, this).onSync("rightKeyed", d, this).onSync("queryChanged", p, this).onSync("whitespaceChanged", g, this).onSync("langDirChanged", this._onLangDirChanged, this)
        }
        return e.mixin(n.prototype, {
            _hacks: function() {
                var n, i;
                n = this.input.$input || t("<div>"),
                i = this.menu.$node || t("<div>"),
                n.on("blur.tt", function(t) {
                    var r, s, o;
                    r = document.activeElement,
                    s = i.is(r),
                    o = i.has(r).length > 0,
                    e.isMsie() && (s || o) && (t.preventDefault(),
                    t.stopImmediatePropagation(),
                    e.defer(function() {
                        n.focus()
                    }))
                }),
                i.on("mousedown.tt", function(t) {
                    t.preventDefault()
                })
            },
            _onSelectableClicked: function(t, e) {
                this.select(e)
            },
            _onDatasetCleared: function() {
                this._updateHint()
            },
            _onDatasetRendered: function(t, e, n, i) {
                this._updateHint(),
                this.eventBus.trigger("render", n, i, e)
            },
            _onAsyncRequested: function(t, e, n) {
                this.eventBus.trigger("asyncrequest", n, e)
            },
            _onAsyncCanceled: function(t, e, n) {
                this.eventBus.trigger("asynccancel", n, e)
            },
            _onAsyncReceived: function(t, e, n) {
                this.eventBus.trigger("asyncreceive", n, e)
            },
            _onFocused: function() {
                this._minLengthMet() && this.menu.update(this.input.getQuery())
            },
            _onBlurred: function() {
                this.input.hasQueryChangedSinceLastFocus() && this.eventBus.trigger("change", this.input.getQuery())
            },
            _onEnterKeyed: function(t, e) {
                var n;
                (n = this.menu.getActiveSelectable()) && this.select(n) && e.preventDefault()
            },
            _onTabKeyed: function(t, e) {
                var n;
                (n = this.menu.getActiveSelectable()) ? this.select(n) && e.preventDefault() : (n = this.menu.getTopSelectable()) && this.autocomplete(n) && e.preventDefault()
            },
            _onEscKeyed: function() {
                this.close()
            },
            _onUpKeyed: function() {
                this.moveCursor(-1)
            },
            _onDownKeyed: function() {
                this.moveCursor(1)
            },
            _onLeftKeyed: function() {
                "rtl" === this.dir && this.input.isCursorAtEnd() && this.autocomplete(this.menu.getTopSelectable())
            },
            _onRightKeyed: function() {
                "ltr" === this.dir && this.input.isCursorAtEnd() && this.autocomplete(this.menu.getTopSelectable())
            },
            _onQueryChanged: function(t, e) {
                this._minLengthMet(e) ? this.menu.update(e) : this.menu.empty()
            },
            _onWhitespaceChanged: function() {
                this._updateHint()
            },
            _onLangDirChanged: function(t, e) {
                this.dir !== e && (this.dir = e,
                this.menu.setLanguageDirection(e))
            },
            _openIfActive: function() {
                this.isActive() && this.open()
            },
            _minLengthMet: function(t) {
                return (t = e.isString(t) ? t : this.input.getQuery() || "").length >= this.minLength
            },
            _updateHint: function() {
                var t, n, i, r, s, u;
                t = this.menu.getTopSelectable(),
                n = this.menu.getSelectableData(t),
                i = this.input.getInputValue(),
                !n || e.isBlankString(i) || this.input.hasOverflow() ? this.input.clearHint() : (r = o.normalizeQuery(i),
                s = e.escapeRegExChars(r),
                (u = new RegExp("^(?:" + s + ")(.+$)","i").exec(n.val)) && this.input.setHint(i + u[1]))
            },
            isEnabled: function() {
                return this.enabled
            },
            enable: function() {
                this.enabled = !0
            },
            disable: function() {
                this.enabled = !1
            },
            isActive: function() {
                return this.active
            },
            activate: function() {
                return !!this.isActive() || !(!this.isEnabled() || this.eventBus.before("active")) && (this.active = !0,
                this.eventBus.trigger("active"),
                !0)
            },
            deactivate: function() {
                return !this.isActive() || !this.eventBus.before("idle") && (this.active = !1,
                this.close(),
                this.eventBus.trigger("idle"),
                !0)
            },
            isOpen: function() {
                return this.menu.isOpen()
            },
            open: function() {
                return this.isOpen() || this.eventBus.before("open") || (this.menu.open(),
                this._updateHint(),
                this.eventBus.trigger("open")),
                this.isOpen()
            },
            close: function() {
                return this.isOpen() && !this.eventBus.before("close") && (this.menu.close(),
                this.input.clearHint(),
                this.input.resetInputValue(),
                this.eventBus.trigger("close")),
                !this.isOpen()
            },
            setVal: function(t) {
                this.input.setQuery(e.toStr(t))
            },
            getVal: function() {
                return this.input.getQuery()
            },
            select: function(t) {
                var e = this.menu.getSelectableData(t);
                return !(!e || this.eventBus.before("select", e.obj)) && (this.input.setQuery(e.val, !0),
                this.eventBus.trigger("select", e.obj),
                this.close(),
                this.eventBus.after("select", e.obj),
                !0)
            },
            autocomplete: function(t) {
                var e, n;
                return e = this.input.getQuery(),
                !(!((n = this.menu.getSelectableData(t)) && e !== n.val) || this.eventBus.before("autocomplete", n.obj)) && (this.input.setQuery(n.val),
                this.eventBus.trigger("autocomplete", n.obj),
                !0)
            },
            moveCursor: function(t) {
                var e, n, i, r;
                return e = this.input.getQuery(),
                n = this.menu.selectableRelativeToCursor(t),
                r = (i = this.menu.getSelectableData(n)) ? i.obj : null,
                !(this._minLengthMet() && this.menu.update(e)) && !this.eventBus.before("cursorchange", r) && (this.menu.setCursor(n),
                i ? this.input.setInputValue(i.val) : (this.input.resetInputValue(),
                this._updateHint()),
                this.eventBus.trigger("cursorchange", r),
                !0)
            },
            destroy: function() {
                this.input.destroy(),
                this.menu.destroy()
            }
        }),
        n;
        function i(t) {
            var n = [].slice.call(arguments, 1);
            return function() {
                var i = [].slice.call(arguments);
                e.each(n, function(e) {
                    return t[e].apply(t, i)
                })
            }
        }
    }();
    !function() {
        "use strict";
        var r, s, u;
        function l(e, n) {
            e.each(function() {
                var e, i = t(this);
                (e = i.data(s.typeahead)) && n(e, i)
            })
        }
        function f(n) {
            var i;
            return (i = e.isJQuery(n) || e.isElement(n) ? t(n).first() : []).length ? i : null
        }
        r = t.fn.typeahead,
        s = {
            www: "tt-www",
            attrs: "tt-attrs",
            typeahead: "tt-typeahead"
        },
        u = {
            initialize: function(r, u) {
                var l;
                return u = e.isArray(u) ? u : [].slice.call(arguments, 1),
                l = n((r = r || {}).classNames),
                this.each(function() {
                    var n, d, p, g, m, y, v, _, b, w, S;
                    e.each(u, function(t) {
                        t.highlight = !!r.highlight
                    }),
                    n = t(this),
                    d = t(l.html.wrapper),
                    p = f(r.hint),
                    g = f(r.menu),
                    m = !1 !== r.hint && !p,
                    y = !1 !== r.menu && !g,
                    m && (x = n,
                    A = l,
                    p = x.clone().addClass(A.classes.hint).removeData().css(A.css.hint).css((k = x,
                    {
                        backgroundAttachment: k.css("background-attachment"),
                        backgroundClip: k.css("background-clip"),
                        backgroundColor: k.css("background-color"),
                        backgroundImage: k.css("background-image"),
                        backgroundOrigin: k.css("background-origin"),
                        backgroundPosition: k.css("background-position"),
                        backgroundRepeat: k.css("background-repeat"),
                        backgroundSize: k.css("background-size")
                    })).prop("readonly", !0).removeAttr("id name placeholder required").attr({
                        autocomplete: "off",
                        spellcheck: "false",
                        tabindex: -1
                    })),
                    y && (g = t(l.html.menu).css(l.css.menu)),
                    p && p.val(""),
                    n = function(t, e) {
                        t.data(s.attrs, {
                            dir: t.attr("dir"),
                            autocomplete: t.attr("autocomplete"),
                            spellcheck: t.attr("spellcheck"),
                            style: t.attr("style")
                        }),
                        t.addClass(e.classes.input).attr({
                            autocomplete: "off",
                            spellcheck: !1
                        });
                        try {
                            !t.attr("dir") && t.attr("dir", "auto")
                        } catch (t) {}
                        return t
                    }(n, l),
                    (m || y) && (d.css(l.css.wrapper),
                    n.css(m ? l.css.input : l.css.inputWithNoHint),
                    n.wrap(d).parent().prepend(m ? p : null).append(y ? g : null));
                    var x, A, k;
                    S = y ? c : a,
                    v = new i({
                        el: n
                    }),
                    _ = new o({
                        hint: p,
                        input: n
                    },l),
                    b = new S({
                        node: g,
                        datasets: u
                    },l),
                    w = new h({
                        input: _,
                        menu: b,
                        eventBus: v,
                        minLength: r.minLength
                    },l),
                    n.data(s.www, l),
                    n.data(s.typeahead, w)
                })
            },
            isEnabled: function() {
                var t;
                return l(this.first(), function(e) {
                    t = e.isEnabled()
                }),
                t
            },
            enable: function() {
                return l(this, function(t) {
                    t.enable()
                }),
                this
            },
            disable: function() {
                return l(this, function(t) {
                    t.disable()
                }),
                this
            },
            isActive: function() {
                var t;
                return l(this.first(), function(e) {
                    t = e.isActive()
                }),
                t
            },
            activate: function() {
                return l(this, function(t) {
                    t.activate()
                }),
                this
            },
            deactivate: function() {
                return l(this, function(t) {
                    t.deactivate()
                }),
                this
            },
            isOpen: function() {
                var t;
                return l(this.first(), function(e) {
                    t = e.isOpen()
                }),
                t
            },
            open: function() {
                return l(this, function(t) {
                    t.open()
                }),
                this
            },
            close: function() {
                return l(this, function(t) {
                    t.close()
                }),
                this
            },
            select: function(e) {
                var n = !1
                  , i = t(e);
                return l(this.first(), function(t) {
                    n = t.select(i)
                }),
                n
            },
            autocomplete: function(e) {
                var n = !1
                  , i = t(e);
                return l(this.first(), function(t) {
                    n = t.autocomplete(i)
                }),
                n
            },
            moveCursor: function(t) {
                var e = !1;
                return l(this.first(), function(n) {
                    e = n.moveCursor(t)
                }),
                e
            },
            val: function(t) {
                var e;
                return arguments.length ? (l(this, function(e) {
                    e.setVal(t)
                }),
                this) : (l(this.first(), function(t) {
                    e = t.getVal()
                }),
                e)
            },
            destroy: function() {
                return l(this, function(t, n) {
                    var i, r, o;
                    r = (i = n).data(s.www),
                    o = i.parent().filter(r.selectors.wrapper),
                    e.each(i.data(s.attrs), function(t, n) {
                        e.isUndefined(t) ? i.removeAttr(n) : i.attr(n, t)
                    }),
                    i.removeData(s.typeahead).removeData(s.www).removeData(s.attr).removeClass(r.classes.input),
                    o.length && (i.detach().insertAfter(o),
                    o.remove()),
                    t.destroy()
                }),
                this
            }
        },
        t.fn.typeahead = function(t) {
            return u[t] ? u[t].apply(this, [].slice.call(arguments, 1)) : u.initialize.apply(this, arguments)
        }
        ,
        t.fn.typeahead.noConflict = function() {
            return t.fn.typeahead = r,
            this
        }
    }()
});


/*! jQuery v3.6.0 | (c) OpenJS Foundation and other contributors | jquery.org/license */
!function(e, t) {
    "use strict";
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
        if (!e.document)
            throw new Error("jQuery requires a window with a document");
        return t(e)
    }
    : t(e)
}("undefined" != typeof window ? window : this, function(C, e) {
    "use strict";
    var t = []
      , r = Object.getPrototypeOf
      , s = t.slice
      , g = t.flat ? function(e) {
        return t.flat.call(e)
    }
    : function(e) {
        return t.concat.apply([], e)
    }
      , u = t.push
      , i = t.indexOf
      , n = {}
      , o = n.toString
      , v = n.hasOwnProperty
      , a = v.toString
      , l = a.call(Object)
      , y = {}
      , m = function(e) {
        return "function" == typeof e && "number" != typeof e.nodeType && "function" != typeof e.item
    }
      , x = function(e) {
        return null != e && e === e.window
    }
      , E = C.document
      , c = {
        type: !0,
        src: !0,
        nonce: !0,
        noModule: !0
    };
    function b(e, t, n) {
        var r, i, o = (n = n || E).createElement("script");
        if (o.text = e,
        t)
            for (r in c)
                (i = t[r] || t.getAttribute && t.getAttribute(r)) && o.setAttribute(r, i);
        n.head.appendChild(o).parentNode.removeChild(o)
    }
    function w(e) {
        return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? n[o.call(e)] || "object" : typeof e
    }
    var f = "3.6.0"
      , S = function(e, t) {
        return new S.fn.init(e,t)
    };
    function p(e) {
        var t = !!e && "length"in e && e.length
          , n = w(e);
        return !m(e) && !x(e) && ("array" === n || 0 === t || "number" == typeof t && 0 < t && t - 1 in e)
    }
    S.fn = S.prototype = {
        jquery: f,
        constructor: S,
        length: 0,
        toArray: function() {
            return s.call(this)
        },
        get: function(e) {
            return null == e ? s.call(this) : e < 0 ? this[e + this.length] : this[e]
        },
        pushStack: function(e) {
            var t = S.merge(this.constructor(), e);
            return t.prevObject = this,
            t
        },
        each: function(e) {
            return S.each(this, e)
        },
        map: function(n) {
            return this.pushStack(S.map(this, function(e, t) {
                return n.call(e, t, e)
            }))
        },
        slice: function() {
            return this.pushStack(s.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        even: function() {
            return this.pushStack(S.grep(this, function(e, t) {
                return (t + 1) % 2
            }))
        },
        odd: function() {
            return this.pushStack(S.grep(this, function(e, t) {
                return t % 2
            }))
        },
        eq: function(e) {
            var t = this.length
              , n = +e + (e < 0 ? t : 0);
            return this.pushStack(0 <= n && n < t ? [this[n]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor()
        },
        push: u,
        sort: t.sort,
        splice: t.splice
    },
    S.extend = S.fn.extend = function() {
        var e, t, n, r, i, o, a = arguments[0] || {}, s = 1, u = arguments.length, l = !1;
        for ("boolean" == typeof a && (l = a,
        a = arguments[s] || {},
        s++),
        "object" == typeof a || m(a) || (a = {}),
        s === u && (a = this,
        s--); s < u; s++)
            if (null != (e = arguments[s]))
                for (t in e)
                    r = e[t],
                    "__proto__" !== t && a !== r && (l && r && (S.isPlainObject(r) || (i = Array.isArray(r))) ? (n = a[t],
                    o = i && !Array.isArray(n) ? [] : i || S.isPlainObject(n) ? n : {},
                    i = !1,
                    a[t] = S.extend(l, o, r)) : void 0 !== r && (a[t] = r));
        return a
    }
    ,
    S.extend({
        expando: "jQuery" + (f + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(e) {
            throw new Error(e)
        },
        noop: function() {},
        isPlainObject: function(e) {
            var t, n;
            return !(!e || "[object Object]" !== o.call(e)) && (!(t = r(e)) || "function" == typeof (n = v.call(t, "constructor") && t.constructor) && a.call(n) === l)
        },
        isEmptyObject: function(e) {
            var t;
            for (t in e)
                return !1;
            return !0
        },
        globalEval: function(e, t, n) {
            b(e, {
                nonce: t && t.nonce
            }, n)
        },
        each: function(e, t) {
            var n, r = 0;
            if (p(e)) {
                for (n = e.length; r < n; r++)
                    if (!1 === t.call(e[r], r, e[r]))
                        break
            } else
                for (r in e)
                    if (!1 === t.call(e[r], r, e[r]))
                        break;
            return e
        },
        makeArray: function(e, t) {
            var n = t || [];
            return null != e && (p(Object(e)) ? S.merge(n, "string" == typeof e ? [e] : e) : u.call(n, e)),
            n
        },
        inArray: function(e, t, n) {
            return null == t ? -1 : i.call(t, e, n)
        },
        merge: function(e, t) {
            for (var n = +t.length, r = 0, i = e.length; r < n; r++)
                e[i++] = t[r];
            return e.length = i,
            e
        },
        grep: function(e, t, n) {
            for (var r = [], i = 0, o = e.length, a = !n; i < o; i++)
                !t(e[i], i) !== a && r.push(e[i]);
            return r
        },
        map: function(e, t, n) {
            var r, i, o = 0, a = [];
            if (p(e))
                for (r = e.length; o < r; o++)
                    null != (i = t(e[o], o, n)) && a.push(i);
            else
                for (o in e)
                    null != (i = t(e[o], o, n)) && a.push(i);
            return g(a)
        },
        guid: 1,
        support: y
    }),
    "function" == typeof Symbol && (S.fn[Symbol.iterator] = t[Symbol.iterator]),
    S.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(e, t) {
        n["[object " + t + "]"] = t.toLowerCase()
    });
    var d = function(n) {
        var e, d, b, o, i, h, f, g, w, u, l, T, C, a, E, v, s, c, y, S = "sizzle" + 1 * new Date, p = n.document, k = 0, r = 0, m = ue(), x = ue(), A = ue(), N = ue(), j = function(e, t) {
            return e === t && (l = !0),
            0
        }, D = {}.hasOwnProperty, t = [], q = t.pop, L = t.push, H = t.push, O = t.slice, P = function(e, t) {
            for (var n = 0, r = e.length; n < r; n++)
                if (e[n] === t)
                    return n;
            return -1
        }, R = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", M = "[\\x20\\t\\r\\n\\f]", I = "(?:\\\\[\\da-fA-F]{1,6}" + M + "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+", W = "\\[" + M + "*(" + I + ")(?:" + M + "*([*^$|!~]?=)" + M + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + I + "))|)" + M + "*\\]", F = ":(" + I + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + W + ")*)|.*)\\)|)", B = new RegExp(M + "+","g"), $ = new RegExp("^" + M + "+|((?:^|[^\\\\])(?:\\\\.)*)" + M + "+$","g"), _ = new RegExp("^" + M + "*," + M + "*"), z = new RegExp("^" + M + "*([>+~]|" + M + ")" + M + "*"), U = new RegExp(M + "|>"), X = new RegExp(F), V = new RegExp("^" + I + "$"), G = {
            ID: new RegExp("^#(" + I + ")"),
            CLASS: new RegExp("^\\.(" + I + ")"),
            TAG: new RegExp("^(" + I + "|[*])"),
            ATTR: new RegExp("^" + W),
            PSEUDO: new RegExp("^" + F),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + M + "*(even|odd|(([+-]|)(\\d*)n|)" + M + "*(?:([+-]|)" + M + "*(\\d+)|))" + M + "*\\)|)","i"),
            bool: new RegExp("^(?:" + R + ")$","i"),
            needsContext: new RegExp("^" + M + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + M + "*((?:-\\d)?\\d*)" + M + "*\\)|)(?=[^-]|$)","i")
        }, Y = /HTML$/i, Q = /^(?:input|select|textarea|button)$/i, J = /^h\d$/i, K = /^[^{]+\{\s*\[native \w/, Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, ee = /[+~]/, te = new RegExp("\\\\[\\da-fA-F]{1,6}" + M + "?|\\\\([^\\r\\n\\f])","g"), ne = function(e, t) {
            var n = "0x" + e.slice(1) - 65536;
            return t || (n < 0 ? String.fromCharCode(n + 65536) : String.fromCharCode(n >> 10 | 55296, 1023 & n | 56320))
        }, re = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g, ie = function(e, t) {
            return t ? "\0" === e ? "\ufffd" : e.slice(0, -1) + "\\" + e.charCodeAt(e.length - 1).toString(16) + " " : "\\" + e
        }, oe = function() {
            T()
        }, ae = be(function(e) {
            return !0 === e.disabled && "fieldset" === e.nodeName.toLowerCase()
        }, {
            dir: "parentNode",
            next: "legend"
        });
        try {
            H.apply(t = O.call(p.childNodes), p.childNodes),
            t[p.childNodes.length].nodeType
        } catch (e) {
            H = {
                apply: t.length ? function(e, t) {
                    L.apply(e, O.call(t))
                }
                : function(e, t) {
                    var n = e.length
                      , r = 0;
                    while (e[n++] = t[r++])
                        ;
                    e.length = n - 1
                }
            }
        }
        function se(t, e, n, r) {
            var i, o, a, s, u, l, c, f = e && e.ownerDocument, p = e ? e.nodeType : 9;
            if (n = n || [],
            "string" != typeof t || !t || 1 !== p && 9 !== p && 11 !== p)
                return n;
            if (!r && (T(e),
            e = e || C,
            E)) {
                if (11 !== p && (u = Z.exec(t)))
                    if (i = u[1]) {
                        if (9 === p) {
                            if (!(a = e.getElementById(i)))
                                return n;
                            if (a.id === i)
                                return n.push(a),
                                n
                        } else if (f && (a = f.getElementById(i)) && y(e, a) && a.id === i)
                            return n.push(a),
                            n
                    } else {
                        if (u[2])
                            return H.apply(n, e.getElementsByTagName(t)),
                            n;
                        if ((i = u[3]) && d.getElementsByClassName && e.getElementsByClassName)
                            return H.apply(n, e.getElementsByClassName(i)),
                            n
                    }
                if (d.qsa && !N[t + " "] && (!v || !v.test(t)) && (1 !== p || "object" !== e.nodeName.toLowerCase())) {
                    if (c = t,
                    f = e,
                    1 === p && (U.test(t) || z.test(t))) {
                        (f = ee.test(t) && ye(e.parentNode) || e) === e && d.scope || ((s = e.getAttribute("id")) ? s = s.replace(re, ie) : e.setAttribute("id", s = S)),
                        o = (l = h(t)).length;
                        while (o--)
                            l[o] = (s ? "#" + s : ":scope") + " " + xe(l[o]);
                        c = l.join(",")
                    }
                    try {
                        return H.apply(n, f.querySelectorAll(c)),
                        n
                    } catch (e) {
                        N(t, !0)
                    } finally {
                        s === S && e.removeAttribute("id")
                    }
                }
            }
            return g(t.replace($, "$1"), e, n, r)
        }
        function ue() {
            var r = [];
            return function e(t, n) {
                return r.push(t + " ") > b.cacheLength && delete e[r.shift()],
                e[t + " "] = n
            }
        }
        function le(e) {
            return e[S] = !0,
            e
        }
        function ce(e) {
            var t = C.createElement("fieldset");
            try {
                return !!e(t)
            } catch (e) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t),
                t = null
            }
        }
        function fe(e, t) {
            var n = e.split("|")
              , r = n.length;
            while (r--)
                b.attrHandle[n[r]] = t
        }
        function pe(e, t) {
            var n = t && e
              , r = n && 1 === e.nodeType && 1 === t.nodeType && e.sourceIndex - t.sourceIndex;
            if (r)
                return r;
            if (n)
                while (n = n.nextSibling)
                    if (n === t)
                        return -1;
            return e ? 1 : -1
        }
        function de(t) {
            return function(e) {
                return "input" === e.nodeName.toLowerCase() && e.type === t
            }
        }
        function he(n) {
            return function(e) {
                var t = e.nodeName.toLowerCase();
                return ("input" === t || "button" === t) && e.type === n
            }
        }
        function ge(t) {
            return function(e) {
                return "form"in e ? e.parentNode && !1 === e.disabled ? "label"in e ? "label"in e.parentNode ? e.parentNode.disabled === t : e.disabled === t : e.isDisabled === t || e.isDisabled !== !t && ae(e) === t : e.disabled === t : "label"in e && e.disabled === t
            }
        }
        function ve(a) {
            return le(function(o) {
                return o = +o,
                le(function(e, t) {
                    var n, r = a([], e.length, o), i = r.length;
                    while (i--)
                        e[n = r[i]] && (e[n] = !(t[n] = e[n]))
                })
            })
        }
        function ye(e) {
            return e && "undefined" != typeof e.getElementsByTagName && e
        }
        for (e in d = se.support = {},
        i = se.isXML = function(e) {
            var t = e && e.namespaceURI
              , n = e && (e.ownerDocument || e).documentElement;
            return !Y.test(t || n && n.nodeName || "HTML")
        }
        ,
        T = se.setDocument = function(e) {
            var t, n, r = e ? e.ownerDocument || e : p;
            return r != C && 9 === r.nodeType && r.documentElement && (a = (C = r).documentElement,
            E = !i(C),
            p != C && (n = C.defaultView) && n.top !== n && (n.addEventListener ? n.addEventListener("unload", oe, !1) : n.attachEvent && n.attachEvent("onunload", oe)),
            d.scope = ce(function(e) {
                return a.appendChild(e).appendChild(C.createElement("div")),
                "undefined" != typeof e.querySelectorAll && !e.querySelectorAll(":scope fieldset div").length
            }),
            d.attributes = ce(function(e) {
                return e.className = "i",
                !e.getAttribute("className")
            }),
            d.getElementsByTagName = ce(function(e) {
                return e.appendChild(C.createComment("")),
                !e.getElementsByTagName("*").length
            }),
            d.getElementsByClassName = K.test(C.getElementsByClassName),
            d.getById = ce(function(e) {
                return a.appendChild(e).id = S,
                !C.getElementsByName || !C.getElementsByName(S).length
            }),
            d.getById ? (b.filter.ID = function(e) {
                var t = e.replace(te, ne);
                return function(e) {
                    return e.getAttribute("id") === t
                }
            }
            ,
            b.find.ID = function(e, t) {
                if ("undefined" != typeof t.getElementById && E) {
                    var n = t.getElementById(e);
                    return n ? [n] : []
                }
            }
            ) : (b.filter.ID = function(e) {
                var n = e.replace(te, ne);
                return function(e) {
                    var t = "undefined" != typeof e.getAttributeNode && e.getAttributeNode("id");
                    return t && t.value === n
                }
            }
            ,
            b.find.ID = function(e, t) {
                if ("undefined" != typeof t.getElementById && E) {
                    var n, r, i, o = t.getElementById(e);
                    if (o) {
                        if ((n = o.getAttributeNode("id")) && n.value === e)
                            return [o];
                        i = t.getElementsByName(e),
                        r = 0;
                        while (o = i[r++])
                            if ((n = o.getAttributeNode("id")) && n.value === e)
                                return [o]
                    }
                    return []
                }
            }
            ),
            b.find.TAG = d.getElementsByTagName ? function(e, t) {
                return "undefined" != typeof t.getElementsByTagName ? t.getElementsByTagName(e) : d.qsa ? t.querySelectorAll(e) : void 0
            }
            : function(e, t) {
                var n, r = [], i = 0, o = t.getElementsByTagName(e);
                if ("*" === e) {
                    while (n = o[i++])
                        1 === n.nodeType && r.push(n);
                    return r
                }
                return o
            }
            ,
            b.find.CLASS = d.getElementsByClassName && function(e, t) {
                if ("undefined" != typeof t.getElementsByClassName && E)
                    return t.getElementsByClassName(e)
            }
            ,
            s = [],
            v = [],
            (d.qsa = K.test(C.querySelectorAll)) && (ce(function(e) {
                var t;
                a.appendChild(e).innerHTML = "<a id='" + S + "'></a><select id='" + S + "-\r\\' msallowcapture=''><option selected=''></option></select>",
                e.querySelectorAll("[msallowcapture^='']").length && v.push("[*^$]=" + M + "*(?:''|\"\")"),
                e.querySelectorAll("[selected]").length || v.push("\\[" + M + "*(?:value|" + R + ")"),
                e.querySelectorAll("[id~=" + S + "-]").length || v.push("~="),
                (t = C.createElement("input")).setAttribute("name", ""),
                e.appendChild(t),
                e.querySelectorAll("[name='']").length || v.push("\\[" + M + "*name" + M + "*=" + M + "*(?:''|\"\")"),
                e.querySelectorAll(":checked").length || v.push(":checked"),
                e.querySelectorAll("a#" + S + "+*").length || v.push(".#.+[+~]"),
                e.querySelectorAll("\\\f"),
                v.push("[\\r\\n\\f]")
            }),
            ce(function(e) {
                e.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                var t = C.createElement("input");
                t.setAttribute("type", "hidden"),
                e.appendChild(t).setAttribute("name", "D"),
                e.querySelectorAll("[name=d]").length && v.push("name" + M + "*[*^$|!~]?="),
                2 !== e.querySelectorAll(":enabled").length && v.push(":enabled", ":disabled"),
                a.appendChild(e).disabled = !0,
                2 !== e.querySelectorAll(":disabled").length && v.push(":enabled", ":disabled"),
                e.querySelectorAll("*,:x"),
                v.push(",.*:")
            })),
            (d.matchesSelector = K.test(c = a.matches || a.webkitMatchesSelector || a.mozMatchesSelector || a.oMatchesSelector || a.msMatchesSelector)) && ce(function(e) {
                d.disconnectedMatch = c.call(e, "*"),
                c.call(e, "[s!='']:x"),
                s.push("!=", F)
            }),
            v = v.length && new RegExp(v.join("|")),
            s = s.length && new RegExp(s.join("|")),
            t = K.test(a.compareDocumentPosition),
            y = t || K.test(a.contains) ? function(e, t) {
                var n = 9 === e.nodeType ? e.documentElement : e
                  , r = t && t.parentNode;
                return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r)))
            }
            : function(e, t) {
                if (t)
                    while (t = t.parentNode)
                        if (t === e)
                            return !0;
                return !1
            }
            ,
            j = t ? function(e, t) {
                if (e === t)
                    return l = !0,
                    0;
                var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                return n || (1 & (n = (e.ownerDocument || e) == (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !d.sortDetached && t.compareDocumentPosition(e) === n ? e == C || e.ownerDocument == p && y(p, e) ? -1 : t == C || t.ownerDocument == p && y(p, t) ? 1 : u ? P(u, e) - P(u, t) : 0 : 4 & n ? -1 : 1)
            }
            : function(e, t) {
                if (e === t)
                    return l = !0,
                    0;
                var n, r = 0, i = e.parentNode, o = t.parentNode, a = [e], s = [t];
                if (!i || !o)
                    return e == C ? -1 : t == C ? 1 : i ? -1 : o ? 1 : u ? P(u, e) - P(u, t) : 0;
                if (i === o)
                    return pe(e, t);
                n = e;
                while (n = n.parentNode)
                    a.unshift(n);
                n = t;
                while (n = n.parentNode)
                    s.unshift(n);
                while (a[r] === s[r])
                    r++;
                return r ? pe(a[r], s[r]) : a[r] == p ? -1 : s[r] == p ? 1 : 0
            }
            ),
            C
        }
        ,
        se.matches = function(e, t) {
            return se(e, null, null, t)
        }
        ,
        se.matchesSelector = function(e, t) {
            if (T(e),
            d.matchesSelector && E && !N[t + " "] && (!s || !s.test(t)) && (!v || !v.test(t)))
                try {
                    var n = c.call(e, t);
                    if (n || d.disconnectedMatch || e.document && 11 !== e.document.nodeType)
                        return n
                } catch (e) {
                    N(t, !0)
                }
            return 0 < se(t, C, null, [e]).length
        }
        ,
        se.contains = function(e, t) {
            return (e.ownerDocument || e) != C && T(e),
            y(e, t)
        }
        ,
        se.attr = function(e, t) {
            (e.ownerDocument || e) != C && T(e);
            var n = b.attrHandle[t.toLowerCase()]
              , r = n && D.call(b.attrHandle, t.toLowerCase()) ? n(e, t, !E) : void 0;
            return void 0 !== r ? r : d.attributes || !E ? e.getAttribute(t) : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
        }
        ,
        se.escape = function(e) {
            return (e + "").replace(re, ie)
        }
        ,
        se.error = function(e) {
            throw new Error("Syntax error, unrecognized expression: " + e)
        }
        ,
        se.uniqueSort = function(e) {
            var t, n = [], r = 0, i = 0;
            if (l = !d.detectDuplicates,
            u = !d.sortStable && e.slice(0),
            e.sort(j),
            l) {
                while (t = e[i++])
                    t === e[i] && (r = n.push(i));
                while (r--)
                    e.splice(n[r], 1)
            }
            return u = null,
            e
        }
        ,
        o = se.getText = function(e) {
            var t, n = "", r = 0, i = e.nodeType;
            if (i) {
                if (1 === i || 9 === i || 11 === i) {
                    if ("string" == typeof e.textContent)
                        return e.textContent;
                    for (e = e.firstChild; e; e = e.nextSibling)
                        n += o(e)
                } else if (3 === i || 4 === i)
                    return e.nodeValue
            } else
                while (t = e[r++])
                    n += o(t);
            return n
        }
        ,
        (b = se.selectors = {
            cacheLength: 50,
            createPseudo: le,
            match: G,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(e) {
                    return e[1] = e[1].replace(te, ne),
                    e[3] = (e[3] || e[4] || e[5] || "").replace(te, ne),
                    "~=" === e[2] && (e[3] = " " + e[3] + " "),
                    e.slice(0, 4)
                },
                CHILD: function(e) {
                    return e[1] = e[1].toLowerCase(),
                    "nth" === e[1].slice(0, 3) ? (e[3] || se.error(e[0]),
                    e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])),
                    e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && se.error(e[0]),
                    e
                },
                PSEUDO: function(e) {
                    var t, n = !e[6] && e[2];
                    return G.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && X.test(n) && (t = h(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t),
                    e[2] = n.slice(0, t)),
                    e.slice(0, 3))
                }
            },
            filter: {
                TAG: function(e) {
                    var t = e.replace(te, ne).toLowerCase();
                    return "*" === e ? function() {
                        return !0
                    }
                    : function(e) {
                        return e.nodeName && e.nodeName.toLowerCase() === t
                    }
                },
                CLASS: function(e) {
                    var t = m[e + " "];
                    return t || (t = new RegExp("(^|" + M + ")" + e + "(" + M + "|$)")) && m(e, function(e) {
                        return t.test("string" == typeof e.className && e.className || "undefined" != typeof e.getAttribute && e.getAttribute("class") || "")
                    })
                },
                ATTR: function(n, r, i) {
                    return function(e) {
                        var t = se.attr(e, n);
                        return null == t ? "!=" === r : !r || (t += "",
                        "=" === r ? t === i : "!=" === r ? t !== i : "^=" === r ? i && 0 === t.indexOf(i) : "*=" === r ? i && -1 < t.indexOf(i) : "$=" === r ? i && t.slice(-i.length) === i : "~=" === r ? -1 < (" " + t.replace(B, " ") + " ").indexOf(i) : "|=" === r && (t === i || t.slice(0, i.length + 1) === i + "-"))
                    }
                },
                CHILD: function(h, e, t, g, v) {
                    var y = "nth" !== h.slice(0, 3)
                      , m = "last" !== h.slice(-4)
                      , x = "of-type" === e;
                    return 1 === g && 0 === v ? function(e) {
                        return !!e.parentNode
                    }
                    : function(e, t, n) {
                        var r, i, o, a, s, u, l = y !== m ? "nextSibling" : "previousSibling", c = e.parentNode, f = x && e.nodeName.toLowerCase(), p = !n && !x, d = !1;
                        if (c) {
                            if (y) {
                                while (l) {
                                    a = e;
                                    while (a = a[l])
                                        if (x ? a.nodeName.toLowerCase() === f : 1 === a.nodeType)
                                            return !1;
                                    u = l = "only" === h && !u && "nextSibling"
                                }
                                return !0
                            }
                            if (u = [m ? c.firstChild : c.lastChild],
                            m && p) {
                                d = (s = (r = (i = (o = (a = c)[S] || (a[S] = {}))[a.uniqueID] || (o[a.uniqueID] = {}))[h] || [])[0] === k && r[1]) && r[2],
                                a = s && c.childNodes[s];
                                while (a = ++s && a && a[l] || (d = s = 0) || u.pop())
                                    if (1 === a.nodeType && ++d && a === e) {
                                        i[h] = [k, s, d];
                                        break
                                    }
                            } else if (p && (d = s = (r = (i = (o = (a = e)[S] || (a[S] = {}))[a.uniqueID] || (o[a.uniqueID] = {}))[h] || [])[0] === k && r[1]),
                            !1 === d)
                                while (a = ++s && a && a[l] || (d = s = 0) || u.pop())
                                    if ((x ? a.nodeName.toLowerCase() === f : 1 === a.nodeType) && ++d && (p && ((i = (o = a[S] || (a[S] = {}))[a.uniqueID] || (o[a.uniqueID] = {}))[h] = [k, d]),
                                    a === e))
                                        break;
                            return (d -= v) === g || d % g == 0 && 0 <= d / g
                        }
                    }
                },
                PSEUDO: function(e, o) {
                    var t, a = b.pseudos[e] || b.setFilters[e.toLowerCase()] || se.error("unsupported pseudo: " + e);
                    return a[S] ? a(o) : 1 < a.length ? (t = [e, e, "", o],
                    b.setFilters.hasOwnProperty(e.toLowerCase()) ? le(function(e, t) {
                        var n, r = a(e, o), i = r.length;
                        while (i--)
                            e[n = P(e, r[i])] = !(t[n] = r[i])
                    }) : function(e) {
                        return a(e, 0, t)
                    }
                    ) : a
                }
            },
            pseudos: {
                not: le(function(e) {
                    var r = []
                      , i = []
                      , s = f(e.replace($, "$1"));
                    return s[S] ? le(function(e, t, n, r) {
                        var i, o = s(e, null, r, []), a = e.length;
                        while (a--)
                            (i = o[a]) && (e[a] = !(t[a] = i))
                    }) : function(e, t, n) {
                        return r[0] = e,
                        s(r, null, n, i),
                        r[0] = null,
                        !i.pop()
                    }
                }),
                has: le(function(t) {
                    return function(e) {
                        return 0 < se(t, e).length
                    }
                }),
                contains: le(function(t) {
                    return t = t.replace(te, ne),
                    function(e) {
                        return -1 < (e.textContent || o(e)).indexOf(t)
                    }
                }),
                lang: le(function(n) {
                    return V.test(n || "") || se.error("unsupported lang: " + n),
                    n = n.replace(te, ne).toLowerCase(),
                    function(e) {
                        var t;
                        do {
                            if (t = E ? e.lang : e.getAttribute("xml:lang") || e.getAttribute("lang"))
                                return (t = t.toLowerCase()) === n || 0 === t.indexOf(n + "-")
                        } while ((e = e.parentNode) && 1 === e.nodeType);
                        return !1
                    }
                }),
                target: function(e) {
                    var t = n.location && n.location.hash;
                    return t && t.slice(1) === e.id
                },
                root: function(e) {
                    return e === a
                },
                focus: function(e) {
                    return e === C.activeElement && (!C.hasFocus || C.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                },
                enabled: ge(!1),
                disabled: ge(!0),
                checked: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && !!e.checked || "option" === t && !!e.selected
                },
                selected: function(e) {
                    return e.parentNode && e.parentNode.selectedIndex,
                    !0 === e.selected
                },
                empty: function(e) {
                    for (e = e.firstChild; e; e = e.nextSibling)
                        if (e.nodeType < 6)
                            return !1;
                    return !0
                },
                parent: function(e) {
                    return !b.pseudos.empty(e)
                },
                header: function(e) {
                    return J.test(e.nodeName)
                },
                input: function(e) {
                    return Q.test(e.nodeName)
                },
                button: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && "button" === e.type || "button" === t
                },
                text: function(e) {
                    var t;
                    return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                },
                first: ve(function() {
                    return [0]
                }),
                last: ve(function(e, t) {
                    return [t - 1]
                }),
                eq: ve(function(e, t, n) {
                    return [n < 0 ? n + t : n]
                }),
                even: ve(function(e, t) {
                    for (var n = 0; n < t; n += 2)
                        e.push(n);
                    return e
                }),
                odd: ve(function(e, t) {
                    for (var n = 1; n < t; n += 2)
                        e.push(n);
                    return e
                }),
                lt: ve(function(e, t, n) {
                    for (var r = n < 0 ? n + t : t < n ? t : n; 0 <= --r; )
                        e.push(r);
                    return e
                }),
                gt: ve(function(e, t, n) {
                    for (var r = n < 0 ? n + t : n; ++r < t; )
                        e.push(r);
                    return e
                })
            }
        }).pseudos.nth = b.pseudos.eq,
        {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        })
            b.pseudos[e] = de(e);
        for (e in {
            submit: !0,
            reset: !0
        })
            b.pseudos[e] = he(e);
        function me() {}
        function xe(e) {
            for (var t = 0, n = e.length, r = ""; t < n; t++)
                r += e[t].value;
            return r
        }
        function be(s, e, t) {
            var u = e.dir
              , l = e.next
              , c = l || u
              , f = t && "parentNode" === c
              , p = r++;
            return e.first ? function(e, t, n) {
                while (e = e[u])
                    if (1 === e.nodeType || f)
                        return s(e, t, n);
                return !1
            }
            : function(e, t, n) {
                var r, i, o, a = [k, p];
                if (n) {
                    while (e = e[u])
                        if ((1 === e.nodeType || f) && s(e, t, n))
                            return !0
                } else
                    while (e = e[u])
                        if (1 === e.nodeType || f)
                            if (i = (o = e[S] || (e[S] = {}))[e.uniqueID] || (o[e.uniqueID] = {}),
                            l && l === e.nodeName.toLowerCase())
                                e = e[u] || e;
                            else {
                                if ((r = i[c]) && r[0] === k && r[1] === p)
                                    return a[2] = r[2];
                                if ((i[c] = a)[2] = s(e, t, n))
                                    return !0
                            }
                return !1
            }
        }
        function we(i) {
            return 1 < i.length ? function(e, t, n) {
                var r = i.length;
                while (r--)
                    if (!i[r](e, t, n))
                        return !1;
                return !0
            }
            : i[0]
        }
        function Te(e, t, n, r, i) {
            for (var o, a = [], s = 0, u = e.length, l = null != t; s < u; s++)
                (o = e[s]) && (n && !n(o, r, i) || (a.push(o),
                l && t.push(s)));
            return a
        }
        function Ce(d, h, g, v, y, e) {
            return v && !v[S] && (v = Ce(v)),
            y && !y[S] && (y = Ce(y, e)),
            le(function(e, t, n, r) {
                var i, o, a, s = [], u = [], l = t.length, c = e || function(e, t, n) {
                    for (var r = 0, i = t.length; r < i; r++)
                        se(e, t[r], n);
                    return n
                }(h || "*", n.nodeType ? [n] : n, []), f = !d || !e && h ? c : Te(c, s, d, n, r), p = g ? y || (e ? d : l || v) ? [] : t : f;
                if (g && g(f, p, n, r),
                v) {
                    i = Te(p, u),
                    v(i, [], n, r),
                    o = i.length;
                    while (o--)
                        (a = i[o]) && (p[u[o]] = !(f[u[o]] = a))
                }
                if (e) {
                    if (y || d) {
                        if (y) {
                            i = [],
                            o = p.length;
                            while (o--)
                                (a = p[o]) && i.push(f[o] = a);
                            y(null, p = [], i, r)
                        }
                        o = p.length;
                        while (o--)
                            (a = p[o]) && -1 < (i = y ? P(e, a) : s[o]) && (e[i] = !(t[i] = a))
                    }
                } else
                    p = Te(p === t ? p.splice(l, p.length) : p),
                    y ? y(null, t, p, r) : H.apply(t, p)
            })
        }
        function Ee(e) {
            for (var i, t, n, r = e.length, o = b.relative[e[0].type], a = o || b.relative[" "], s = o ? 1 : 0, u = be(function(e) {
                return e === i
            }, a, !0), l = be(function(e) {
                return -1 < P(i, e)
            }, a, !0), c = [function(e, t, n) {
                var r = !o && (n || t !== w) || ((i = t).nodeType ? u(e, t, n) : l(e, t, n));
                return i = null,
                r
            }
            ]; s < r; s++)
                if (t = b.relative[e[s].type])
                    c = [be(we(c), t)];
                else {
                    if ((t = b.filter[e[s].type].apply(null, e[s].matches))[S]) {
                        for (n = ++s; n < r; n++)
                            if (b.relative[e[n].type])
                                break;
                        return Ce(1 < s && we(c), 1 < s && xe(e.slice(0, s - 1).concat({
                            value: " " === e[s - 2].type ? "*" : ""
                        })).replace($, "$1"), t, s < n && Ee(e.slice(s, n)), n < r && Ee(e = e.slice(n)), n < r && xe(e))
                    }
                    c.push(t)
                }
            return we(c)
        }
        return me.prototype = b.filters = b.pseudos,
        b.setFilters = new me,
        h = se.tokenize = function(e, t) {
            var n, r, i, o, a, s, u, l = x[e + " "];
            if (l)
                return t ? 0 : l.slice(0);
            a = e,
            s = [],
            u = b.preFilter;
            while (a) {
                for (o in n && !(r = _.exec(a)) || (r && (a = a.slice(r[0].length) || a),
                s.push(i = [])),
                n = !1,
                (r = z.exec(a)) && (n = r.shift(),
                i.push({
                    value: n,
                    type: r[0].replace($, " ")
                }),
                a = a.slice(n.length)),
                b.filter)
                    !(r = G[o].exec(a)) || u[o] && !(r = u[o](r)) || (n = r.shift(),
                    i.push({
                        value: n,
                        type: o,
                        matches: r
                    }),
                    a = a.slice(n.length));
                if (!n)
                    break
            }
            return t ? a.length : a ? se.error(e) : x(e, s).slice(0)
        }
        ,
        f = se.compile = function(e, t) {
            var n, v, y, m, x, r, i = [], o = [], a = A[e + " "];
            if (!a) {
                t || (t = h(e)),
                n = t.length;
                while (n--)
                    (a = Ee(t[n]))[S] ? i.push(a) : o.push(a);
                (a = A(e, (v = o,
                m = 0 < (y = i).length,
                x = 0 < v.length,
                r = function(e, t, n, r, i) {
                    var o, a, s, u = 0, l = "0", c = e && [], f = [], p = w, d = e || x && b.find.TAG("*", i), h = k += null == p ? 1 : Math.random() || .1, g = d.length;
                    for (i && (w = t == C || t || i); l !== g && null != (o = d[l]); l++) {
                        if (x && o) {
                            a = 0,
                            t || o.ownerDocument == C || (T(o),
                            n = !E);
                            while (s = v[a++])
                                if (s(o, t || C, n)) {
                                    r.push(o);
                                    break
                                }
                            i && (k = h)
                        }
                        m && ((o = !s && o) && u--,
                        e && c.push(o))
                    }
                    if (u += l,
                    m && l !== u) {
                        a = 0;
                        while (s = y[a++])
                            s(c, f, t, n);
                        if (e) {
                            if (0 < u)
                                while (l--)
                                    c[l] || f[l] || (f[l] = q.call(r));
                            f = Te(f)
                        }
                        H.apply(r, f),
                        i && !e && 0 < f.length && 1 < u + y.length && se.uniqueSort(r)
                    }
                    return i && (k = h,
                    w = p),
                    c
                }
                ,
                m ? le(r) : r))).selector = e
            }
            return a
        }
        ,
        g = se.select = function(e, t, n, r) {
            var i, o, a, s, u, l = "function" == typeof e && e, c = !r && h(e = l.selector || e);
            if (n = n || [],
            1 === c.length) {
                if (2 < (o = c[0] = c[0].slice(0)).length && "ID" === (a = o[0]).type && 9 === t.nodeType && E && b.relative[o[1].type]) {
                    if (!(t = (b.find.ID(a.matches[0].replace(te, ne), t) || [])[0]))
                        return n;
                    l && (t = t.parentNode),
                    e = e.slice(o.shift().value.length)
                }
                i = G.needsContext.test(e) ? 0 : o.length;
                while (i--) {
                    if (a = o[i],
                    b.relative[s = a.type])
                        break;
                    if ((u = b.find[s]) && (r = u(a.matches[0].replace(te, ne), ee.test(o[0].type) && ye(t.parentNode) || t))) {
                        if (o.splice(i, 1),
                        !(e = r.length && xe(o)))
                            return H.apply(n, r),
                            n;
                        break
                    }
                }
            }
            return (l || f(e, c))(r, t, !E, n, !t || ee.test(e) && ye(t.parentNode) || t),
            n
        }
        ,
        d.sortStable = S.split("").sort(j).join("") === S,
        d.detectDuplicates = !!l,
        T(),
        d.sortDetached = ce(function(e) {
            return 1 & e.compareDocumentPosition(C.createElement("fieldset"))
        }),
        ce(function(e) {
            return e.innerHTML = "<a href='#'></a>",
            "#" === e.firstChild.getAttribute("href")
        }) || fe("type|href|height|width", function(e, t, n) {
            if (!n)
                return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
        }),
        d.attributes && ce(function(e) {
            return e.innerHTML = "<input/>",
            e.firstChild.setAttribute("value", ""),
            "" === e.firstChild.getAttribute("value")
        }) || fe("value", function(e, t, n) {
            if (!n && "input" === e.nodeName.toLowerCase())
                return e.defaultValue
        }),
        ce(function(e) {
            return null == e.getAttribute("disabled")
        }) || fe(R, function(e, t, n) {
            var r;
            if (!n)
                return !0 === e[t] ? t.toLowerCase() : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
        }),
        se
    }(C);
    S.find = d,
    S.expr = d.selectors,
    S.expr[":"] = S.expr.pseudos,
    S.uniqueSort = S.unique = d.uniqueSort,
    S.text = d.getText,
    S.isXMLDoc = d.isXML,
    S.contains = d.contains,
    S.escapeSelector = d.escape;
    var h = function(e, t, n) {
        var r = []
          , i = void 0 !== n;
        while ((e = e[t]) && 9 !== e.nodeType)
            if (1 === e.nodeType) {
                if (i && S(e).is(n))
                    break;
                r.push(e)
            }
        return r
    }
      , T = function(e, t) {
        for (var n = []; e; e = e.nextSibling)
            1 === e.nodeType && e !== t && n.push(e);
        return n
    }
      , k = S.expr.match.needsContext;
    function A(e, t) {
        return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
    }
    var N = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
    function j(e, n, r) {
        return m(n) ? S.grep(e, function(e, t) {
            return !!n.call(e, t, e) !== r
        }) : n.nodeType ? S.grep(e, function(e) {
            return e === n !== r
        }) : "string" != typeof n ? S.grep(e, function(e) {
            return -1 < i.call(n, e) !== r
        }) : S.filter(n, e, r)
    }
    S.filter = function(e, t, n) {
        var r = t[0];
        return n && (e = ":not(" + e + ")"),
        1 === t.length && 1 === r.nodeType ? S.find.matchesSelector(r, e) ? [r] : [] : S.find.matches(e, S.grep(t, function(e) {
            return 1 === e.nodeType
        }))
    }
    ,
    S.fn.extend({
        find: function(e) {
            var t, n, r = this.length, i = this;
            if ("string" != typeof e)
                return this.pushStack(S(e).filter(function() {
                    for (t = 0; t < r; t++)
                        if (S.contains(i[t], this))
                            return !0
                }));
            for (n = this.pushStack([]),
            t = 0; t < r; t++)
                S.find(e, i[t], n);
            return 1 < r ? S.uniqueSort(n) : n
        },
        filter: function(e) {
            return this.pushStack(j(this, e || [], !1))
        },
        not: function(e) {
            return this.pushStack(j(this, e || [], !0))
        },
        is: function(e) {
            return !!j(this, "string" == typeof e && k.test(e) ? S(e) : e || [], !1).length
        }
    });
    var D, q = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
    (S.fn.init = function(e, t, n) {
        var r, i;
        if (!e)
            return this;
        if (n = n || D,
        "string" == typeof e) {
            if (!(r = "<" === e[0] && ">" === e[e.length - 1] && 3 <= e.length ? [null, e, null] : q.exec(e)) || !r[1] && t)
                return !t || t.jquery ? (t || n).find(e) : this.constructor(t).find(e);
            if (r[1]) {
                if (t = t instanceof S ? t[0] : t,
                S.merge(this, S.parseHTML(r[1], t && t.nodeType ? t.ownerDocument || t : E, !0)),
                N.test(r[1]) && S.isPlainObject(t))
                    for (r in t)
                        m(this[r]) ? this[r](t[r]) : this.attr(r, t[r]);
                return this
            }
            return (i = E.getElementById(r[2])) && (this[0] = i,
            this.length = 1),
            this
        }
        return e.nodeType ? (this[0] = e,
        this.length = 1,
        this) : m(e) ? void 0 !== n.ready ? n.ready(e) : e(S) : S.makeArray(e, this)
    }
    ).prototype = S.fn,
    D = S(E);
    var L = /^(?:parents|prev(?:Until|All))/
      , H = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    function O(e, t) {
        while ((e = e[t]) && 1 !== e.nodeType)
            ;
        return e
    }
    S.fn.extend({
        has: function(e) {
            var t = S(e, this)
              , n = t.length;
            return this.filter(function() {
                for (var e = 0; e < n; e++)
                    if (S.contains(this, t[e]))
                        return !0
            })
        },
        closest: function(e, t) {
            var n, r = 0, i = this.length, o = [], a = "string" != typeof e && S(e);
            if (!k.test(e))
                for (; r < i; r++)
                    for (n = this[r]; n && n !== t; n = n.parentNode)
                        if (n.nodeType < 11 && (a ? -1 < a.index(n) : 1 === n.nodeType && S.find.matchesSelector(n, e))) {
                            o.push(n);
                            break
                        }
            return this.pushStack(1 < o.length ? S.uniqueSort(o) : o)
        },
        index: function(e) {
            return e ? "string" == typeof e ? i.call(S(e), this[0]) : i.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(e, t) {
            return this.pushStack(S.uniqueSort(S.merge(this.get(), S(e, t))))
        },
        addBack: function(e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    }),
    S.each({
        parent: function(e) {
            var t = e.parentNode;
            return t && 11 !== t.nodeType ? t : null
        },
        parents: function(e) {
            return h(e, "parentNode")
        },
        parentsUntil: function(e, t, n) {
            return h(e, "parentNode", n)
        },
        next: function(e) {
            return O(e, "nextSibling")
        },
        prev: function(e) {
            return O(e, "previousSibling")
        },
        nextAll: function(e) {
            return h(e, "nextSibling")
        },
        prevAll: function(e) {
            return h(e, "previousSibling")
        },
        nextUntil: function(e, t, n) {
            return h(e, "nextSibling", n)
        },
        prevUntil: function(e, t, n) {
            return h(e, "previousSibling", n)
        },
        siblings: function(e) {
            return T((e.parentNode || {}).firstChild, e)
        },
        children: function(e) {
            return T(e.firstChild)
        },
        contents: function(e) {
            return null != e.contentDocument && r(e.contentDocument) ? e.contentDocument : (A(e, "template") && (e = e.content || e),
            S.merge([], e.childNodes))
        }
    }, function(r, i) {
        S.fn[r] = function(e, t) {
            var n = S.map(this, i, e);
            return "Until" !== r.slice(-5) && (t = e),
            t && "string" == typeof t && (n = S.filter(t, n)),
            1 < this.length && (H[r] || S.uniqueSort(n),
            L.test(r) && n.reverse()),
            this.pushStack(n)
        }
    });
    var P = /[^\x20\t\r\n\f]+/g;
    function R(e) {
        return e
    }
    function M(e) {
        throw e
    }
    function I(e, t, n, r) {
        var i;
        try {
            e && m(i = e.promise) ? i.call(e).done(t).fail(n) : e && m(i = e.then) ? i.call(e, t, n) : t.apply(void 0, [e].slice(r))
        } catch (e) {
            n.apply(void 0, [e])
        }
    }
    S.Callbacks = function(r) {
        var e, n;
        r = "string" == typeof r ? (e = r,
        n = {},
        S.each(e.match(P) || [], function(e, t) {
            n[t] = !0
        }),
        n) : S.extend({}, r);
        var i, t, o, a, s = [], u = [], l = -1, c = function() {
            for (a = a || r.once,
            o = i = !0; u.length; l = -1) {
                t = u.shift();
                while (++l < s.length)
                    !1 === s[l].apply(t[0], t[1]) && r.stopOnFalse && (l = s.length,
                    t = !1)
            }
            r.memory || (t = !1),
            i = !1,
            a && (s = t ? [] : "")
        }, f = {
            add: function() {
                return s && (t && !i && (l = s.length - 1,
                u.push(t)),
                function n(e) {
                    S.each(e, function(e, t) {
                        m(t) ? r.unique && f.has(t) || s.push(t) : t && t.length && "string" !== w(t) && n(t)
                    })
                }(arguments),
                t && !i && c()),
                this
            },
            remove: function() {
                return S.each(arguments, function(e, t) {
                    var n;
                    while (-1 < (n = S.inArray(t, s, n)))
                        s.splice(n, 1),
                        n <= l && l--
                }),
                this
            },
            has: function(e) {
                return e ? -1 < S.inArray(e, s) : 0 < s.length
            },
            empty: function() {
                return s && (s = []),
                this
            },
            disable: function() {
                return a = u = [],
                s = t = "",
                this
            },
            disabled: function() {
                return !s
            },
            lock: function() {
                return a = u = [],
                t || i || (s = t = ""),
                this
            },
            locked: function() {
                return !!a
            },
            fireWith: function(e, t) {
                return a || (t = [e, (t = t || []).slice ? t.slice() : t],
                u.push(t),
                i || c()),
                this
            },
            fire: function() {
                return f.fireWith(this, arguments),
                this
            },
            fired: function() {
                return !!o
            }
        };
        return f
    }
    ,
    S.extend({
        Deferred: function(e) {
            var o = [["notify", "progress", S.Callbacks("memory"), S.Callbacks("memory"), 2], ["resolve", "done", S.Callbacks("once memory"), S.Callbacks("once memory"), 0, "resolved"], ["reject", "fail", S.Callbacks("once memory"), S.Callbacks("once memory"), 1, "rejected"]]
              , i = "pending"
              , a = {
                state: function() {
                    return i
                },
                always: function() {
                    return s.done(arguments).fail(arguments),
                    this
                },
                "catch": function(e) {
                    return a.then(null, e)
                },
                pipe: function() {
                    var i = arguments;
                    return S.Deferred(function(r) {
                        S.each(o, function(e, t) {
                            var n = m(i[t[4]]) && i[t[4]];
                            s[t[1]](function() {
                                var e = n && n.apply(this, arguments);
                                e && m(e.promise) ? e.promise().progress(r.notify).done(r.resolve).fail(r.reject) : r[t[0] + "With"](this, n ? [e] : arguments)
                            })
                        }),
                        i = null
                    }).promise()
                },
                then: function(t, n, r) {
                    var u = 0;
                    function l(i, o, a, s) {
                        return function() {
                            var n = this
                              , r = arguments
                              , e = function() {
                                var e, t;
                                if (!(i < u)) {
                                    if ((e = a.apply(n, r)) === o.promise())
                                        throw new TypeError("Thenable self-resolution");
                                    t = e && ("object" == typeof e || "function" == typeof e) && e.then,
                                    m(t) ? s ? t.call(e, l(u, o, R, s), l(u, o, M, s)) : (u++,
                                    t.call(e, l(u, o, R, s), l(u, o, M, s), l(u, o, R, o.notifyWith))) : (a !== R && (n = void 0,
                                    r = [e]),
                                    (s || o.resolveWith)(n, r))
                                }
                            }
                              , t = s ? e : function() {
                                try {
                                    e()
                                } catch (e) {
                                    S.Deferred.exceptionHook && S.Deferred.exceptionHook(e, t.stackTrace),
                                    u <= i + 1 && (a !== M && (n = void 0,
                                    r = [e]),
                                    o.rejectWith(n, r))
                                }
                            }
                            ;
                            i ? t() : (S.Deferred.getStackHook && (t.stackTrace = S.Deferred.getStackHook()),
                            C.setTimeout(t))
                        }
                    }
                    return S.Deferred(function(e) {
                        o[0][3].add(l(0, e, m(r) ? r : R, e.notifyWith)),
                        o[1][3].add(l(0, e, m(t) ? t : R)),
                        o[2][3].add(l(0, e, m(n) ? n : M))
                    }).promise()
                },
                promise: function(e) {
                    return null != e ? S.extend(e, a) : a
                }
            }
              , s = {};
            return S.each(o, function(e, t) {
                var n = t[2]
                  , r = t[5];
                a[t[1]] = n.add,
                r && n.add(function() {
                    i = r
                }, o[3 - e][2].disable, o[3 - e][3].disable, o[0][2].lock, o[0][3].lock),
                n.add(t[3].fire),
                s[t[0]] = function() {
                    return s[t[0] + "With"](this === s ? void 0 : this, arguments),
                    this
                }
                ,
                s[t[0] + "With"] = n.fireWith
            }),
            a.promise(s),
            e && e.call(s, s),
            s
        },
        when: function(e) {
            var n = arguments.length
              , t = n
              , r = Array(t)
              , i = s.call(arguments)
              , o = S.Deferred()
              , a = function(t) {
                return function(e) {
                    r[t] = this,
                    i[t] = 1 < arguments.length ? s.call(arguments) : e,
                    --n || o.resolveWith(r, i)
                }
            };
            if (n <= 1 && (I(e, o.done(a(t)).resolve, o.reject, !n),
            "pending" === o.state() || m(i[t] && i[t].then)))
                return o.then();
            while (t--)
                I(i[t], a(t), o.reject);
            return o.promise()
        }
    });
    var W = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
    S.Deferred.exceptionHook = function(e, t) {
        C.console && C.console.warn && e && W.test(e.name) && C.console.warn("jQuery.Deferred exception: " + e.message, e.stack, t)
    }
    ,
    S.readyException = function(e) {
        C.setTimeout(function() {
            throw e
        })
    }
    ;
    var F = S.Deferred();
    function B() {
        E.removeEventListener("DOMContentLoaded", B),
        C.removeEventListener("load", B),
        S.ready()
    }
    S.fn.ready = function(e) {
        return F.then(e)["catch"](function(e) {
            S.readyException(e)
        }),
        this
    }
    ,
    S.extend({
        isReady: !1,
        readyWait: 1,
        ready: function(e) {
            (!0 === e ? --S.readyWait : S.isReady) || (S.isReady = !0) !== e && 0 < --S.readyWait || F.resolveWith(E, [S])
        }
    }),
    S.ready.then = F.then,
    "complete" === E.readyState || "loading" !== E.readyState && !E.documentElement.doScroll ? C.setTimeout(S.ready) : (E.addEventListener("DOMContentLoaded", B),
    C.addEventListener("load", B));
    var $ = function(e, t, n, r, i, o, a) {
        var s = 0
          , u = e.length
          , l = null == n;
        if ("object" === w(n))
            for (s in i = !0,
            n)
                $(e, t, s, n[s], !0, o, a);
        else if (void 0 !== r && (i = !0,
        m(r) || (a = !0),
        l && (a ? (t.call(e, r),
        t = null) : (l = t,
        t = function(e, t, n) {
            return l.call(S(e), n)
        }
        )),
        t))
            for (; s < u; s++)
                t(e[s], n, a ? r : r.call(e[s], s, t(e[s], n)));
        return i ? e : l ? t.call(e) : u ? t(e[0], n) : o
    }
      , _ = /^-ms-/
      , z = /-([a-z])/g;
    function U(e, t) {
        return t.toUpperCase()
    }
    function X(e) {
        return e.replace(_, "ms-").replace(z, U)
    }
    var V = function(e) {
        return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
    };
    function G() {
        this.expando = S.expando + G.uid++
    }
    G.uid = 1,
    G.prototype = {
        cache: function(e) {
            var t = e[this.expando];
            return t || (t = {},
            V(e) && (e.nodeType ? e[this.expando] = t : Object.defineProperty(e, this.expando, {
                value: t,
                configurable: !0
            }))),
            t
        },
        set: function(e, t, n) {
            var r, i = this.cache(e);
            if ("string" == typeof t)
                i[X(t)] = n;
            else
                for (r in t)
                    i[X(r)] = t[r];
            return i
        },
        get: function(e, t) {
            return void 0 === t ? this.cache(e) : e[this.expando] && e[this.expando][X(t)]
        },
        access: function(e, t, n) {
            return void 0 === t || t && "string" == typeof t && void 0 === n ? this.get(e, t) : (this.set(e, t, n),
            void 0 !== n ? n : t)
        },
        remove: function(e, t) {
            var n, r = e[this.expando];
            if (void 0 !== r) {
                if (void 0 !== t) {
                    n = (t = Array.isArray(t) ? t.map(X) : (t = X(t))in r ? [t] : t.match(P) || []).length;
                    while (n--)
                        delete r[t[n]]
                }
                (void 0 === t || S.isEmptyObject(r)) && (e.nodeType ? e[this.expando] = void 0 : delete e[this.expando])
            }
        },
        hasData: function(e) {
            var t = e[this.expando];
            return void 0 !== t && !S.isEmptyObject(t)
        }
    };
    var Y = new G
      , Q = new G
      , J = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/
      , K = /[A-Z]/g;
    function Z(e, t, n) {
        var r, i;
        if (void 0 === n && 1 === e.nodeType)
            if (r = "data-" + t.replace(K, "-$&").toLowerCase(),
            "string" == typeof (n = e.getAttribute(r))) {
                try {
                    n = "true" === (i = n) || "false" !== i && ("null" === i ? null : i === +i + "" ? +i : J.test(i) ? JSON.parse(i) : i)
                } catch (e) {}
                Q.set(e, t, n)
            } else
                n = void 0;
        return n
    }
    S.extend({
        hasData: function(e) {
            return Q.hasData(e) || Y.hasData(e)
        },
        data: function(e, t, n) {
            return Q.access(e, t, n)
        },
        removeData: function(e, t) {
            Q.remove(e, t)
        },
        _data: function(e, t, n) {
            return Y.access(e, t, n)
        },
        _removeData: function(e, t) {
            Y.remove(e, t)
        }
    }),
    S.fn.extend({
        data: function(n, e) {
            var t, r, i, o = this[0], a = o && o.attributes;
            if (void 0 === n) {
                if (this.length && (i = Q.get(o),
                1 === o.nodeType && !Y.get(o, "hasDataAttrs"))) {
                    t = a.length;
                    while (t--)
                        a[t] && 0 === (r = a[t].name).indexOf("data-") && (r = X(r.slice(5)),
                        Z(o, r, i[r]));
                    Y.set(o, "hasDataAttrs", !0)
                }
                return i
            }
            return "object" == typeof n ? this.each(function() {
                Q.set(this, n)
            }) : $(this, function(e) {
                var t;
                if (o && void 0 === e)
                    return void 0 !== (t = Q.get(o, n)) ? t : void 0 !== (t = Z(o, n)) ? t : void 0;
                this.each(function() {
                    Q.set(this, n, e)
                })
            }, null, e, 1 < arguments.length, null, !0)
        },
        removeData: function(e) {
            return this.each(function() {
                Q.remove(this, e)
            })
        }
    }),
    S.extend({
        queue: function(e, t, n) {
            var r;
            if (e)
                return t = (t || "fx") + "queue",
                r = Y.get(e, t),
                n && (!r || Array.isArray(n) ? r = Y.access(e, t, S.makeArray(n)) : r.push(n)),
                r || []
        },
        dequeue: function(e, t) {
            t = t || "fx";
            var n = S.queue(e, t)
              , r = n.length
              , i = n.shift()
              , o = S._queueHooks(e, t);
            "inprogress" === i && (i = n.shift(),
            r--),
            i && ("fx" === t && n.unshift("inprogress"),
            delete o.stop,
            i.call(e, function() {
                S.dequeue(e, t)
            }, o)),
            !r && o && o.empty.fire()
        },
        _queueHooks: function(e, t) {
            var n = t + "queueHooks";
            return Y.get(e, n) || Y.access(e, n, {
                empty: S.Callbacks("once memory").add(function() {
                    Y.remove(e, [t + "queue", n])
                })
            })
        }
    }),
    S.fn.extend({
        queue: function(t, n) {
            var e = 2;
            return "string" != typeof t && (n = t,
            t = "fx",
            e--),
            arguments.length < e ? S.queue(this[0], t) : void 0 === n ? this : this.each(function() {
                var e = S.queue(this, t, n);
                S._queueHooks(this, t),
                "fx" === t && "inprogress" !== e[0] && S.dequeue(this, t)
            })
        },
        dequeue: function(e) {
            return this.each(function() {
                S.dequeue(this, e)
            })
        },
        clearQueue: function(e) {
            return this.queue(e || "fx", [])
        },
        promise: function(e, t) {
            var n, r = 1, i = S.Deferred(), o = this, a = this.length, s = function() {
                --r || i.resolveWith(o, [o])
            };
            "string" != typeof e && (t = e,
            e = void 0),
            e = e || "fx";
            while (a--)
                (n = Y.get(o[a], e + "queueHooks")) && n.empty && (r++,
                n.empty.add(s));
            return s(),
            i.promise(t)
        }
    });
    var ee = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source
      , te = new RegExp("^(?:([+-])=|)(" + ee + ")([a-z%]*)$","i")
      , ne = ["Top", "Right", "Bottom", "Left"]
      , re = E.documentElement
      , ie = function(e) {
        return S.contains(e.ownerDocument, e)
    }
      , oe = {
        composed: !0
    };
    re.getRootNode && (ie = function(e) {
        return S.contains(e.ownerDocument, e) || e.getRootNode(oe) === e.ownerDocument
    }
    );
    var ae = function(e, t) {
        return "none" === (e = t || e).style.display || "" === e.style.display && ie(e) && "none" === S.css(e, "display")
    };
    function se(e, t, n, r) {
        var i, o, a = 20, s = r ? function() {
            return r.cur()
        }
        : function() {
            return S.css(e, t, "")
        }
        , u = s(), l = n && n[3] || (S.cssNumber[t] ? "" : "px"), c = e.nodeType && (S.cssNumber[t] || "px" !== l && +u) && te.exec(S.css(e, t));
        if (c && c[3] !== l) {
            u /= 2,
            l = l || c[3],
            c = +u || 1;
            while (a--)
                S.style(e, t, c + l),
                (1 - o) * (1 - (o = s() / u || .5)) <= 0 && (a = 0),
                c /= o;
            c *= 2,
            S.style(e, t, c + l),
            n = n || []
        }
        return n && (c = +c || +u || 0,
        i = n[1] ? c + (n[1] + 1) * n[2] : +n[2],
        r && (r.unit = l,
        r.start = c,
        r.end = i)),
        i
    }
    var ue = {};
    function le(e, t) {
        for (var n, r, i, o, a, s, u, l = [], c = 0, f = e.length; c < f; c++)
            (r = e[c]).style && (n = r.style.display,
            t ? ("none" === n && (l[c] = Y.get(r, "display") || null,
            l[c] || (r.style.display = "")),
            "" === r.style.display && ae(r) && (l[c] = (u = a = o = void 0,
            a = (i = r).ownerDocument,
            s = i.nodeName,
            (u = ue[s]) || (o = a.body.appendChild(a.createElement(s)),
            u = S.css(o, "display"),
            o.parentNode.removeChild(o),
            "none" === u && (u = "block"),
            ue[s] = u)))) : "none" !== n && (l[c] = "none",
            Y.set(r, "display", n)));
        for (c = 0; c < f; c++)
            null != l[c] && (e[c].style.display = l[c]);
        return e
    }
    S.fn.extend({
        show: function() {
            return le(this, !0)
        },
        hide: function() {
            return le(this)
        },
        toggle: function(e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                ae(this) ? S(this).show() : S(this).hide()
            })
        }
    });
    var ce, fe, pe = /^(?:checkbox|radio)$/i, de = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i, he = /^$|^module$|\/(?:java|ecma)script/i;
    ce = E.createDocumentFragment().appendChild(E.createElement("div")),
    (fe = E.createElement("input")).setAttribute("type", "radio"),
    fe.setAttribute("checked", "checked"),
    fe.setAttribute("name", "t"),
    ce.appendChild(fe),
    y.checkClone = ce.cloneNode(!0).cloneNode(!0).lastChild.checked,
    ce.innerHTML = "<textarea>x</textarea>",
    y.noCloneChecked = !!ce.cloneNode(!0).lastChild.defaultValue,
    ce.innerHTML = "<option></option>",
    y.option = !!ce.lastChild;
    var ge = {
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: [0, "", ""]
    };
    function ve(e, t) {
        var n;
        return n = "undefined" != typeof e.getElementsByTagName ? e.getElementsByTagName(t || "*") : "undefined" != typeof e.querySelectorAll ? e.querySelectorAll(t || "*") : [],
        void 0 === t || t && A(e, t) ? S.merge([e], n) : n
    }
    function ye(e, t) {
        for (var n = 0, r = e.length; n < r; n++)
            Y.set(e[n], "globalEval", !t || Y.get(t[n], "globalEval"))
    }
    ge.tbody = ge.tfoot = ge.colgroup = ge.caption = ge.thead,
    ge.th = ge.td,
    y.option || (ge.optgroup = ge.option = [1, "<select multiple='multiple'>", "</select>"]);
    var me = /<|&#?\w+;/;
    function xe(e, t, n, r, i) {
        for (var o, a, s, u, l, c, f = t.createDocumentFragment(), p = [], d = 0, h = e.length; d < h; d++)
            if ((o = e[d]) || 0 === o)
                if ("object" === w(o))
                    S.merge(p, o.nodeType ? [o] : o);
                else if (me.test(o)) {
                    a = a || f.appendChild(t.createElement("div")),
                    s = (de.exec(o) || ["", ""])[1].toLowerCase(),
                    u = ge[s] || ge._default,
                    a.innerHTML = u[1] + S.htmlPrefilter(o) + u[2],
                    c = u[0];
                    while (c--)
                        a = a.lastChild;
                    S.merge(p, a.childNodes),
                    (a = f.firstChild).textContent = ""
                } else
                    p.push(t.createTextNode(o));
        f.textContent = "",
        d = 0;
        while (o = p[d++])
            if (r && -1 < S.inArray(o, r))
                i && i.push(o);
            else if (l = ie(o),
            a = ve(f.appendChild(o), "script"),
            l && ye(a),
            n) {
                c = 0;
                while (o = a[c++])
                    he.test(o.type || "") && n.push(o)
            }
        return f
    }
    var be = /^([^.]*)(?:\.(.+)|)/;
    function we() {
        return !0
    }
    function Te() {
        return !1
    }
    function Ce(e, t) {
        return e === function() {
            try {
                return E.activeElement
            } catch (e) {}
        }() == ("focus" === t)
    }
    function Ee(e, t, n, r, i, o) {
        var a, s;
        if ("object" == typeof t) {
            for (s in "string" != typeof n && (r = r || n,
            n = void 0),
            t)
                Ee(e, s, n, r, t[s], o);
            return e
        }
        if (null == r && null == i ? (i = n,
        r = n = void 0) : null == i && ("string" == typeof n ? (i = r,
        r = void 0) : (i = r,
        r = n,
        n = void 0)),
        !1 === i)
            i = Te;
        else if (!i)
            return e;
        return 1 === o && (a = i,
        (i = function(e) {
            return S().off(e),
            a.apply(this, arguments)
        }
        ).guid = a.guid || (a.guid = S.guid++)),
        e.each(function() {
            S.event.add(this, t, i, r, n)
        })
    }
    function Se(e, i, o) {
        o ? (Y.set(e, i, !1),
        S.event.add(e, i, {
            namespace: !1,
            handler: function(e) {
                var t, n, r = Y.get(this, i);
                if (1 & e.isTrigger && this[i]) {
                    if (r.length)
                        (S.event.special[i] || {}).delegateType && e.stopPropagation();
                    else if (r = s.call(arguments),
                    Y.set(this, i, r),
                    t = o(this, i),
                    this[i](),
                    r !== (n = Y.get(this, i)) || t ? Y.set(this, i, !1) : n = {},
                    r !== n)
                        return e.stopImmediatePropagation(),
                        e.preventDefault(),
                        n && n.value
                } else
                    r.length && (Y.set(this, i, {
                        value: S.event.trigger(S.extend(r[0], S.Event.prototype), r.slice(1), this)
                    }),
                    e.stopImmediatePropagation())
            }
        })) : void 0 === Y.get(e, i) && S.event.add(e, i, we)
    }
    S.event = {
        global: {},
        add: function(t, e, n, r, i) {
            var o, a, s, u, l, c, f, p, d, h, g, v = Y.get(t);
            if (V(t)) {
                n.handler && (n = (o = n).handler,
                i = o.selector),
                i && S.find.matchesSelector(re, i),
                n.guid || (n.guid = S.guid++),
                (u = v.events) || (u = v.events = Object.create(null)),
                (a = v.handle) || (a = v.handle = function(e) {
                    return "undefined" != typeof S && S.event.triggered !== e.type ? S.event.dispatch.apply(t, arguments) : void 0
                }
                ),
                l = (e = (e || "").match(P) || [""]).length;
                while (l--)
                    d = g = (s = be.exec(e[l]) || [])[1],
                    h = (s[2] || "").split(".").sort(),
                    d && (f = S.event.special[d] || {},
                    d = (i ? f.delegateType : f.bindType) || d,
                    f = S.event.special[d] || {},
                    c = S.extend({
                        type: d,
                        origType: g,
                        data: r,
                        handler: n,
                        guid: n.guid,
                        selector: i,
                        needsContext: i && S.expr.match.needsContext.test(i),
                        namespace: h.join(".")
                    }, o),
                    (p = u[d]) || ((p = u[d] = []).delegateCount = 0,
                    f.setup && !1 !== f.setup.call(t, r, h, a) || t.addEventListener && t.addEventListener(d, a)),
                    f.add && (f.add.call(t, c),
                    c.handler.guid || (c.handler.guid = n.guid)),
                    i ? p.splice(p.delegateCount++, 0, c) : p.push(c),
                    S.event.global[d] = !0)
            }
        },
        remove: function(e, t, n, r, i) {
            var o, a, s, u, l, c, f, p, d, h, g, v = Y.hasData(e) && Y.get(e);
            if (v && (u = v.events)) {
                l = (t = (t || "").match(P) || [""]).length;
                while (l--)
                    if (d = g = (s = be.exec(t[l]) || [])[1],
                    h = (s[2] || "").split(".").sort(),
                    d) {
                        f = S.event.special[d] || {},
                        p = u[d = (r ? f.delegateType : f.bindType) || d] || [],
                        s = s[2] && new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                        a = o = p.length;
                        while (o--)
                            c = p[o],
                            !i && g !== c.origType || n && n.guid !== c.guid || s && !s.test(c.namespace) || r && r !== c.selector && ("**" !== r || !c.selector) || (p.splice(o, 1),
                            c.selector && p.delegateCount--,
                            f.remove && f.remove.call(e, c));
                        a && !p.length && (f.teardown && !1 !== f.teardown.call(e, h, v.handle) || S.removeEvent(e, d, v.handle),
                        delete u[d])
                    } else
                        for (d in u)
                            S.event.remove(e, d + t[l], n, r, !0);
                S.isEmptyObject(u) && Y.remove(e, "handle events")
            }
        },
        dispatch: function(e) {
            var t, n, r, i, o, a, s = new Array(arguments.length), u = S.event.fix(e), l = (Y.get(this, "events") || Object.create(null))[u.type] || [], c = S.event.special[u.type] || {};
            for (s[0] = u,
            t = 1; t < arguments.length; t++)
                s[t] = arguments[t];
            if (u.delegateTarget = this,
            !c.preDispatch || !1 !== c.preDispatch.call(this, u)) {
                a = S.event.handlers.call(this, u, l),
                t = 0;
                while ((i = a[t++]) && !u.isPropagationStopped()) {
                    u.currentTarget = i.elem,
                    n = 0;
                    while ((o = i.handlers[n++]) && !u.isImmediatePropagationStopped())
                        u.rnamespace && !1 !== o.namespace && !u.rnamespace.test(o.namespace) || (u.handleObj = o,
                        u.data = o.data,
                        void 0 !== (r = ((S.event.special[o.origType] || {}).handle || o.handler).apply(i.elem, s)) && !1 === (u.result = r) && (u.preventDefault(),
                        u.stopPropagation()))
                }
                return c.postDispatch && c.postDispatch.call(this, u),
                u.result
            }
        },
        handlers: function(e, t) {
            var n, r, i, o, a, s = [], u = t.delegateCount, l = e.target;
            if (u && l.nodeType && !("click" === e.type && 1 <= e.button))
                for (; l !== this; l = l.parentNode || this)
                    if (1 === l.nodeType && ("click" !== e.type || !0 !== l.disabled)) {
                        for (o = [],
                        a = {},
                        n = 0; n < u; n++)
                            void 0 === a[i = (r = t[n]).selector + " "] && (a[i] = r.needsContext ? -1 < S(i, this).index(l) : S.find(i, this, null, [l]).length),
                            a[i] && o.push(r);
                        o.length && s.push({
                            elem: l,
                            handlers: o
                        })
                    }
            return l = this,
            u < t.length && s.push({
                elem: l,
                handlers: t.slice(u)
            }),
            s
        },
        addProp: function(t, e) {
            Object.defineProperty(S.Event.prototype, t, {
                enumerable: !0,
                configurable: !0,
                get: m(e) ? function() {
                    if (this.originalEvent)
                        return e(this.originalEvent)
                }
                : function() {
                    if (this.originalEvent)
                        return this.originalEvent[t]
                }
                ,
                set: function(e) {
                    Object.defineProperty(this, t, {
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                        value: e
                    })
                }
            })
        },
        fix: function(e) {
            return e[S.expando] ? e : new S.Event(e)
        },
        special: {
            load: {
                noBubble: !0
            },
            click: {
                setup: function(e) {
                    var t = this || e;
                    return pe.test(t.type) && t.click && A(t, "input") && Se(t, "click", we),
                    !1
                },
                trigger: function(e) {
                    var t = this || e;
                    return pe.test(t.type) && t.click && A(t, "input") && Se(t, "click"),
                    !0
                },
                _default: function(e) {
                    var t = e.target;
                    return pe.test(t.type) && t.click && A(t, "input") && Y.get(t, "click") || A(t, "a")
                }
            },
            beforeunload: {
                postDispatch: function(e) {
                    void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                }
            }
        }
    },
    S.removeEvent = function(e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n)
    }
    ,
    S.Event = function(e, t) {
        if (!(this instanceof S.Event))
            return new S.Event(e,t);
        e && e.type ? (this.originalEvent = e,
        this.type = e.type,
        this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && !1 === e.returnValue ? we : Te,
        this.target = e.target && 3 === e.target.nodeType ? e.target.parentNode : e.target,
        this.currentTarget = e.currentTarget,
        this.relatedTarget = e.relatedTarget) : this.type = e,
        t && S.extend(this, t),
        this.timeStamp = e && e.timeStamp || Date.now(),
        this[S.expando] = !0
    }
    ,
    S.Event.prototype = {
        constructor: S.Event,
        isDefaultPrevented: Te,
        isPropagationStopped: Te,
        isImmediatePropagationStopped: Te,
        isSimulated: !1,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = we,
            e && !this.isSimulated && e.preventDefault()
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = we,
            e && !this.isSimulated && e.stopPropagation()
        },
        stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = we,
            e && !this.isSimulated && e.stopImmediatePropagation(),
            this.stopPropagation()
        }
    },
    S.each({
        altKey: !0,
        bubbles: !0,
        cancelable: !0,
        changedTouches: !0,
        ctrlKey: !0,
        detail: !0,
        eventPhase: !0,
        metaKey: !0,
        pageX: !0,
        pageY: !0,
        shiftKey: !0,
        view: !0,
        "char": !0,
        code: !0,
        charCode: !0,
        key: !0,
        keyCode: !0,
        button: !0,
        buttons: !0,
        clientX: !0,
        clientY: !0,
        offsetX: !0,
        offsetY: !0,
        pointerId: !0,
        pointerType: !0,
        screenX: !0,
        screenY: !0,
        targetTouches: !0,
        toElement: !0,
        touches: !0,
        which: !0
    }, S.event.addProp),
    S.each({
        focus: "focusin",
        blur: "focusout"
    }, function(e, t) {
        S.event.special[e] = {
            setup: function() {
                return Se(this, e, Ce),
                !1
            },
            trigger: function() {
                return Se(this, e),
                !0
            },
            _default: function() {
                return !0
            },
            delegateType: t
        }
    }),
    S.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(e, i) {
        S.event.special[e] = {
            delegateType: i,
            bindType: i,
            handle: function(e) {
                var t, n = e.relatedTarget, r = e.handleObj;
                return n && (n === this || S.contains(this, n)) || (e.type = r.origType,
                t = r.handler.apply(this, arguments),
                e.type = i),
                t
            }
        }
    }),
    S.fn.extend({
        on: function(e, t, n, r) {
            return Ee(this, e, t, n, r)
        },
        one: function(e, t, n, r) {
            return Ee(this, e, t, n, r, 1)
        },
        off: function(e, t, n) {
            var r, i;
            if (e && e.preventDefault && e.handleObj)
                return r = e.handleObj,
                S(e.delegateTarget).off(r.namespace ? r.origType + "." + r.namespace : r.origType, r.selector, r.handler),
                this;
            if ("object" == typeof e) {
                for (i in e)
                    this.off(i, t, e[i]);
                return this
            }
            return !1 !== t && "function" != typeof t || (n = t,
            t = void 0),
            !1 === n && (n = Te),
            this.each(function() {
                S.event.remove(this, e, n, t)
            })
        }
    });
    var ke = /<script|<style|<link/i
      , Ae = /checked\s*(?:[^=]|=\s*.checked.)/i
      , Ne = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
    function je(e, t) {
        return A(e, "table") && A(11 !== t.nodeType ? t : t.firstChild, "tr") && S(e).children("tbody")[0] || e
    }
    function De(e) {
        return e.type = (null !== e.getAttribute("type")) + "/" + e.type,
        e
    }
    function qe(e) {
        return "true/" === (e.type || "").slice(0, 5) ? e.type = e.type.slice(5) : e.removeAttribute("type"),
        e
    }
    function Le(e, t) {
        var n, r, i, o, a, s;
        if (1 === t.nodeType) {
            if (Y.hasData(e) && (s = Y.get(e).events))
                for (i in Y.remove(t, "handle events"),
                s)
                    for (n = 0,
                    r = s[i].length; n < r; n++)
                        S.event.add(t, i, s[i][n]);
            Q.hasData(e) && (o = Q.access(e),
            a = S.extend({}, o),
            Q.set(t, a))
        }
    }
    function He(n, r, i, o) {
        r = g(r);
        var e, t, a, s, u, l, c = 0, f = n.length, p = f - 1, d = r[0], h = m(d);
        if (h || 1 < f && "string" == typeof d && !y.checkClone && Ae.test(d))
            return n.each(function(e) {
                var t = n.eq(e);
                h && (r[0] = d.call(this, e, t.html())),
                He(t, r, i, o)
            });
        if (f && (t = (e = xe(r, n[0].ownerDocument, !1, n, o)).firstChild,
        1 === e.childNodes.length && (e = t),
        t || o)) {
            for (s = (a = S.map(ve(e, "script"), De)).length; c < f; c++)
                u = e,
                c !== p && (u = S.clone(u, !0, !0),
                s && S.merge(a, ve(u, "script"))),
                i.call(n[c], u, c);
            if (s)
                for (l = a[a.length - 1].ownerDocument,
                S.map(a, qe),
                c = 0; c < s; c++)
                    u = a[c],
                    he.test(u.type || "") && !Y.access(u, "globalEval") && S.contains(l, u) && (u.src && "module" !== (u.type || "").toLowerCase() ? S._evalUrl && !u.noModule && S._evalUrl(u.src, {
                        nonce: u.nonce || u.getAttribute("nonce")
                    }, l) : b(u.textContent.replace(Ne, ""), u, l))
        }
        return n
    }
    function Oe(e, t, n) {
        for (var r, i = t ? S.filter(t, e) : e, o = 0; null != (r = i[o]); o++)
            n || 1 !== r.nodeType || S.cleanData(ve(r)),
            r.parentNode && (n && ie(r) && ye(ve(r, "script")),
            r.parentNode.removeChild(r));
        return e
    }
    S.extend({
        htmlPrefilter: function(e) {
            return e
        },
        clone: function(e, t, n) {
            var r, i, o, a, s, u, l, c = e.cloneNode(!0), f = ie(e);
            if (!(y.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || S.isXMLDoc(e)))
                for (a = ve(c),
                r = 0,
                i = (o = ve(e)).length; r < i; r++)
                    s = o[r],
                    u = a[r],
                    void 0,
                    "input" === (l = u.nodeName.toLowerCase()) && pe.test(s.type) ? u.checked = s.checked : "input" !== l && "textarea" !== l || (u.defaultValue = s.defaultValue);
            if (t)
                if (n)
                    for (o = o || ve(e),
                    a = a || ve(c),
                    r = 0,
                    i = o.length; r < i; r++)
                        Le(o[r], a[r]);
                else
                    Le(e, c);
            return 0 < (a = ve(c, "script")).length && ye(a, !f && ve(e, "script")),
            c
        },
        cleanData: function(e) {
            for (var t, n, r, i = S.event.special, o = 0; void 0 !== (n = e[o]); o++)
                if (V(n)) {
                    if (t = n[Y.expando]) {
                        if (t.events)
                            for (r in t.events)
                                i[r] ? S.event.remove(n, r) : S.removeEvent(n, r, t.handle);
                        n[Y.expando] = void 0
                    }
                    n[Q.expando] && (n[Q.expando] = void 0)
                }
        }
    }),
    S.fn.extend({
        detach: function(e) {
            return Oe(this, e, !0)
        },
        remove: function(e) {
            return Oe(this, e)
        },
        text: function(e) {
            return $(this, function(e) {
                return void 0 === e ? S.text(this) : this.empty().each(function() {
                    1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = e)
                })
            }, null, e, arguments.length)
        },
        append: function() {
            return He(this, arguments, function(e) {
                1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || je(this, e).appendChild(e)
            })
        },
        prepend: function() {
            return He(this, arguments, function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = je(this, e);
                    t.insertBefore(e, t.firstChild)
                }
            })
        },
        before: function() {
            return He(this, arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this)
            })
        },
        after: function() {
            return He(this, arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            })
        },
        empty: function() {
            for (var e, t = 0; null != (e = this[t]); t++)
                1 === e.nodeType && (S.cleanData(ve(e, !1)),
                e.textContent = "");
            return this
        },
        clone: function(e, t) {
            return e = null != e && e,
            t = null == t ? e : t,
            this.map(function() {
                return S.clone(this, e, t)
            })
        },
        html: function(e) {
            return $(this, function(e) {
                var t = this[0] || {}
                  , n = 0
                  , r = this.length;
                if (void 0 === e && 1 === t.nodeType)
                    return t.innerHTML;
                if ("string" == typeof e && !ke.test(e) && !ge[(de.exec(e) || ["", ""])[1].toLowerCase()]) {
                    e = S.htmlPrefilter(e);
                    try {
                        for (; n < r; n++)
                            1 === (t = this[n] || {}).nodeType && (S.cleanData(ve(t, !1)),
                            t.innerHTML = e);
                        t = 0
                    } catch (e) {}
                }
                t && this.empty().append(e)
            }, null, e, arguments.length)
        },
        replaceWith: function() {
            var n = [];
            return He(this, arguments, function(e) {
                var t = this.parentNode;
                S.inArray(this, n) < 0 && (S.cleanData(ve(this)),
                t && t.replaceChild(e, this))
            }, n)
        }
    }),
    S.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(e, a) {
        S.fn[e] = function(e) {
            for (var t, n = [], r = S(e), i = r.length - 1, o = 0; o <= i; o++)
                t = o === i ? this : this.clone(!0),
                S(r[o])[a](t),
                u.apply(n, t.get());
            return this.pushStack(n)
        }
    });
    var Pe = new RegExp("^(" + ee + ")(?!px)[a-z%]+$","i")
      , Re = function(e) {
        var t = e.ownerDocument.defaultView;
        return t && t.opener || (t = C),
        t.getComputedStyle(e)
    }
      , Me = function(e, t, n) {
        var r, i, o = {};
        for (i in t)
            o[i] = e.style[i],
            e.style[i] = t[i];
        for (i in r = n.call(e),
        t)
            e.style[i] = o[i];
        return r
    }
      , Ie = new RegExp(ne.join("|"),"i");
    function We(e, t, n) {
        var r, i, o, a, s = e.style;
        return (n = n || Re(e)) && ("" !== (a = n.getPropertyValue(t) || n[t]) || ie(e) || (a = S.style(e, t)),
        !y.pixelBoxStyles() && Pe.test(a) && Ie.test(t) && (r = s.width,
        i = s.minWidth,
        o = s.maxWidth,
        s.minWidth = s.maxWidth = s.width = a,
        a = n.width,
        s.width = r,
        s.minWidth = i,
        s.maxWidth = o)),
        void 0 !== a ? a + "" : a
    }
    function Fe(e, t) {
        return {
            get: function() {
                if (!e())
                    return (this.get = t).apply(this, arguments);
                delete this.get
            }
        }
    }
    !function() {
        function e() {
            if (l) {
                u.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",
                l.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",
                re.appendChild(u).appendChild(l);
                var e = C.getComputedStyle(l);
                n = "1%" !== e.top,
                s = 12 === t(e.marginLeft),
                l.style.right = "60%",
                o = 36 === t(e.right),
                r = 36 === t(e.width),
                l.style.position = "absolute",
                i = 12 === t(l.offsetWidth / 3),
                re.removeChild(u),
                l = null
            }
        }
        function t(e) {
            return Math.round(parseFloat(e))
        }
        var n, r, i, o, a, s, u = E.createElement("div"), l = E.createElement("div");
        l.style && (l.style.backgroundClip = "content-box",
        l.cloneNode(!0).style.backgroundClip = "",
        y.clearCloneStyle = "content-box" === l.style.backgroundClip,
        S.extend(y, {
            boxSizingReliable: function() {
                return e(),
                r
            },
            pixelBoxStyles: function() {
                return e(),
                o
            },
            pixelPosition: function() {
                return e(),
                n
            },
            reliableMarginLeft: function() {
                return e(),
                s
            },
            scrollboxSize: function() {
                return e(),
                i
            },
            reliableTrDimensions: function() {
                var e, t, n, r;
                return null == a && (e = E.createElement("table"),
                t = E.createElement("tr"),
                n = E.createElement("div"),
                e.style.cssText = "position:absolute;left:-11111px;border-collapse:separate",
                t.style.cssText = "border:1px solid",
                t.style.height = "1px",
                n.style.height = "9px",
                n.style.display = "block",
                re.appendChild(e).appendChild(t).appendChild(n),
                r = C.getComputedStyle(t),
                a = parseInt(r.height, 10) + parseInt(r.borderTopWidth, 10) + parseInt(r.borderBottomWidth, 10) === t.offsetHeight,
                re.removeChild(e)),
                a
            }
        }))
    }();
    var Be = ["Webkit", "Moz", "ms"]
      , $e = E.createElement("div").style
      , _e = {};
    function ze(e) {
        var t = S.cssProps[e] || _e[e];
        return t || (e in $e ? e : _e[e] = function(e) {
            var t = e[0].toUpperCase() + e.slice(1)
              , n = Be.length;
            while (n--)
                if ((e = Be[n] + t)in $e)
                    return e
        }(e) || e)
    }
    var Ue = /^(none|table(?!-c[ea]).+)/
      , Xe = /^--/
      , Ve = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }
      , Ge = {
        letterSpacing: "0",
        fontWeight: "400"
    };
    function Ye(e, t, n) {
        var r = te.exec(t);
        return r ? Math.max(0, r[2] - (n || 0)) + (r[3] || "px") : t
    }
    function Qe(e, t, n, r, i, o) {
        var a = "width" === t ? 1 : 0
          , s = 0
          , u = 0;
        if (n === (r ? "border" : "content"))
            return 0;
        for (; a < 4; a += 2)
            "margin" === n && (u += S.css(e, n + ne[a], !0, i)),
            r ? ("content" === n && (u -= S.css(e, "padding" + ne[a], !0, i)),
            "margin" !== n && (u -= S.css(e, "border" + ne[a] + "Width", !0, i))) : (u += S.css(e, "padding" + ne[a], !0, i),
            "padding" !== n ? u += S.css(e, "border" + ne[a] + "Width", !0, i) : s += S.css(e, "border" + ne[a] + "Width", !0, i));
        return !r && 0 <= o && (u += Math.max(0, Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - o - u - s - .5)) || 0),
        u
    }
    function Je(e, t, n) {
        var r = Re(e)
          , i = (!y.boxSizingReliable() || n) && "border-box" === S.css(e, "boxSizing", !1, r)
          , o = i
          , a = We(e, t, r)
          , s = "offset" + t[0].toUpperCase() + t.slice(1);
        if (Pe.test(a)) {
            if (!n)
                return a;
            a = "auto"
        }
        return (!y.boxSizingReliable() && i || !y.reliableTrDimensions() && A(e, "tr") || "auto" === a || !parseFloat(a) && "inline" === S.css(e, "display", !1, r)) && e.getClientRects().length && (i = "border-box" === S.css(e, "boxSizing", !1, r),
        (o = s in e) && (a = e[s])),
        (a = parseFloat(a) || 0) + Qe(e, t, n || (i ? "border" : "content"), o, r, a) + "px"
    }
    function Ke(e, t, n, r, i) {
        return new Ke.prototype.init(e,t,n,r,i)
    }
    S.extend({
        cssHooks: {
            opacity: {
                get: function(e, t) {
                    if (t) {
                        var n = We(e, "opacity");
                        return "" === n ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            animationIterationCount: !0,
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            gridArea: !0,
            gridColumn: !0,
            gridColumnEnd: !0,
            gridColumnStart: !0,
            gridRow: !0,
            gridRowEnd: !0,
            gridRowStart: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {},
        style: function(e, t, n, r) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var i, o, a, s = X(t), u = Xe.test(t), l = e.style;
                if (u || (t = ze(s)),
                a = S.cssHooks[t] || S.cssHooks[s],
                void 0 === n)
                    return a && "get"in a && void 0 !== (i = a.get(e, !1, r)) ? i : l[t];
                "string" === (o = typeof n) && (i = te.exec(n)) && i[1] && (n = se(e, t, i),
                o = "number"),
                null != n && n == n && ("number" !== o || u || (n += i && i[3] || (S.cssNumber[s] ? "" : "px")),
                y.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (l[t] = "inherit"),
                a && "set"in a && void 0 === (n = a.set(e, n, r)) || (u ? l.setProperty(t, n) : l[t] = n))
            }
        },
        css: function(e, t, n, r) {
            var i, o, a, s = X(t);
            return Xe.test(t) || (t = ze(s)),
            (a = S.cssHooks[t] || S.cssHooks[s]) && "get"in a && (i = a.get(e, !0, n)),
            void 0 === i && (i = We(e, t, r)),
            "normal" === i && t in Ge && (i = Ge[t]),
            "" === n || n ? (o = parseFloat(i),
            !0 === n || isFinite(o) ? o || 0 : i) : i
        }
    }),
    S.each(["height", "width"], function(e, u) {
        S.cssHooks[u] = {
            get: function(e, t, n) {
                if (t)
                    return !Ue.test(S.css(e, "display")) || e.getClientRects().length && e.getBoundingClientRect().width ? Je(e, u, n) : Me(e, Ve, function() {
                        return Je(e, u, n)
                    })
            },
            set: function(e, t, n) {
                var r, i = Re(e), o = !y.scrollboxSize() && "absolute" === i.position, a = (o || n) && "border-box" === S.css(e, "boxSizing", !1, i), s = n ? Qe(e, u, n, a, i) : 0;
                return a && o && (s -= Math.ceil(e["offset" + u[0].toUpperCase() + u.slice(1)] - parseFloat(i[u]) - Qe(e, u, "border", !1, i) - .5)),
                s && (r = te.exec(t)) && "px" !== (r[3] || "px") && (e.style[u] = t,
                t = S.css(e, u)),
                Ye(0, t, s)
            }
        }
    }),
    S.cssHooks.marginLeft = Fe(y.reliableMarginLeft, function(e, t) {
        if (t)
            return (parseFloat(We(e, "marginLeft")) || e.getBoundingClientRect().left - Me(e, {
                marginLeft: 0
            }, function() {
                return e.getBoundingClientRect().left
            })) + "px"
    }),
    S.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(i, o) {
        S.cssHooks[i + o] = {
            expand: function(e) {
                for (var t = 0, n = {}, r = "string" == typeof e ? e.split(" ") : [e]; t < 4; t++)
                    n[i + ne[t] + o] = r[t] || r[t - 2] || r[0];
                return n
            }
        },
        "margin" !== i && (S.cssHooks[i + o].set = Ye)
    }),
    S.fn.extend({
        css: function(e, t) {
            return $(this, function(e, t, n) {
                var r, i, o = {}, a = 0;
                if (Array.isArray(t)) {
                    for (r = Re(e),
                    i = t.length; a < i; a++)
                        o[t[a]] = S.css(e, t[a], !1, r);
                    return o
                }
                return void 0 !== n ? S.style(e, t, n) : S.css(e, t)
            }, e, t, 1 < arguments.length)
        }
    }),
    ((S.Tween = Ke).prototype = {
        constructor: Ke,
        init: function(e, t, n, r, i, o) {
            this.elem = e,
            this.prop = n,
            this.easing = i || S.easing._default,
            this.options = t,
            this.start = this.now = this.cur(),
            this.end = r,
            this.unit = o || (S.cssNumber[n] ? "" : "px")
        },
        cur: function() {
            var e = Ke.propHooks[this.prop];
            return e && e.get ? e.get(this) : Ke.propHooks._default.get(this)
        },
        run: function(e) {
            var t, n = Ke.propHooks[this.prop];
            return this.options.duration ? this.pos = t = S.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e,
            this.now = (this.end - this.start) * t + this.start,
            this.options.step && this.options.step.call(this.elem, this.now, this),
            n && n.set ? n.set(this) : Ke.propHooks._default.set(this),
            this
        }
    }).init.prototype = Ke.prototype,
    (Ke.propHooks = {
        _default: {
            get: function(e) {
                var t;
                return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (t = S.css(e.elem, e.prop, "")) && "auto" !== t ? t : 0
            },
            set: function(e) {
                S.fx.step[e.prop] ? S.fx.step[e.prop](e) : 1 !== e.elem.nodeType || !S.cssHooks[e.prop] && null == e.elem.style[ze(e.prop)] ? e.elem[e.prop] = e.now : S.style(e.elem, e.prop, e.now + e.unit)
            }
        }
    }).scrollTop = Ke.propHooks.scrollLeft = {
        set: function(e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    },
    S.easing = {
        linear: function(e) {
            return e
        },
        swing: function(e) {
            return .5 - Math.cos(e * Math.PI) / 2
        },
        _default: "swing"
    },
    S.fx = Ke.prototype.init,
    S.fx.step = {};
    var Ze, et, tt, nt, rt = /^(?:toggle|show|hide)$/, it = /queueHooks$/;
    function ot() {
        et && (!1 === E.hidden && C.requestAnimationFrame ? C.requestAnimationFrame(ot) : C.setTimeout(ot, S.fx.interval),
        S.fx.tick())
    }
    function at() {
        return C.setTimeout(function() {
            Ze = void 0
        }),
        Ze = Date.now()
    }
    function st(e, t) {
        var n, r = 0, i = {
            height: e
        };
        for (t = t ? 1 : 0; r < 4; r += 2 - t)
            i["margin" + (n = ne[r])] = i["padding" + n] = e;
        return t && (i.opacity = i.width = e),
        i
    }
    function ut(e, t, n) {
        for (var r, i = (lt.tweeners[t] || []).concat(lt.tweeners["*"]), o = 0, a = i.length; o < a; o++)
            if (r = i[o].call(n, t, e))
                return r
    }
    function lt(o, e, t) {
        var n, a, r = 0, i = lt.prefilters.length, s = S.Deferred().always(function() {
            delete u.elem
        }), u = function() {
            if (a)
                return !1;
            for (var e = Ze || at(), t = Math.max(0, l.startTime + l.duration - e), n = 1 - (t / l.duration || 0), r = 0, i = l.tweens.length; r < i; r++)
                l.tweens[r].run(n);
            return s.notifyWith(o, [l, n, t]),
            n < 1 && i ? t : (i || s.notifyWith(o, [l, 1, 0]),
            s.resolveWith(o, [l]),
            !1)
        }, l = s.promise({
            elem: o,
            props: S.extend({}, e),
            opts: S.extend(!0, {
                specialEasing: {},
                easing: S.easing._default
            }, t),
            originalProperties: e,
            originalOptions: t,
            startTime: Ze || at(),
            duration: t.duration,
            tweens: [],
            createTween: function(e, t) {
                var n = S.Tween(o, l.opts, e, t, l.opts.specialEasing[e] || l.opts.easing);
                return l.tweens.push(n),
                n
            },
            stop: function(e) {
                var t = 0
                  , n = e ? l.tweens.length : 0;
                if (a)
                    return this;
                for (a = !0; t < n; t++)
                    l.tweens[t].run(1);
                return e ? (s.notifyWith(o, [l, 1, 0]),
                s.resolveWith(o, [l, e])) : s.rejectWith(o, [l, e]),
                this
            }
        }), c = l.props;
        for (!function(e, t) {
            var n, r, i, o, a;
            for (n in e)
                if (i = t[r = X(n)],
                o = e[n],
                Array.isArray(o) && (i = o[1],
                o = e[n] = o[0]),
                n !== r && (e[r] = o,
                delete e[n]),
                (a = S.cssHooks[r]) && "expand"in a)
                    for (n in o = a.expand(o),
                    delete e[r],
                    o)
                        n in e || (e[n] = o[n],
                        t[n] = i);
                else
                    t[r] = i
        }(c, l.opts.specialEasing); r < i; r++)
            if (n = lt.prefilters[r].call(l, o, c, l.opts))
                return m(n.stop) && (S._queueHooks(l.elem, l.opts.queue).stop = n.stop.bind(n)),
                n;
        return S.map(c, ut, l),
        m(l.opts.start) && l.opts.start.call(o, l),
        l.progress(l.opts.progress).done(l.opts.done, l.opts.complete).fail(l.opts.fail).always(l.opts.always),
        S.fx.timer(S.extend(u, {
            elem: o,
            anim: l,
            queue: l.opts.queue
        })),
        l
    }
    S.Animation = S.extend(lt, {
        tweeners: {
            "*": [function(e, t) {
                var n = this.createTween(e, t);
                return se(n.elem, e, te.exec(t), n),
                n
            }
            ]
        },
        tweener: function(e, t) {
            m(e) ? (t = e,
            e = ["*"]) : e = e.match(P);
            for (var n, r = 0, i = e.length; r < i; r++)
                n = e[r],
                lt.tweeners[n] = lt.tweeners[n] || [],
                lt.tweeners[n].unshift(t)
        },
        prefilters: [function(e, t, n) {
            var r, i, o, a, s, u, l, c, f = "width"in t || "height"in t, p = this, d = {}, h = e.style, g = e.nodeType && ae(e), v = Y.get(e, "fxshow");
            for (r in n.queue || (null == (a = S._queueHooks(e, "fx")).unqueued && (a.unqueued = 0,
            s = a.empty.fire,
            a.empty.fire = function() {
                a.unqueued || s()
            }
            ),
            a.unqueued++,
            p.always(function() {
                p.always(function() {
                    a.unqueued--,
                    S.queue(e, "fx").length || a.empty.fire()
                })
            })),
            t)
                if (i = t[r],
                rt.test(i)) {
                    if (delete t[r],
                    o = o || "toggle" === i,
                    i === (g ? "hide" : "show")) {
                        if ("show" !== i || !v || void 0 === v[r])
                            continue;
                        g = !0
                    }
                    d[r] = v && v[r] || S.style(e, r)
                }
            if ((u = !S.isEmptyObject(t)) || !S.isEmptyObject(d))
                for (r in f && 1 === e.nodeType && (n.overflow = [h.overflow, h.overflowX, h.overflowY],
                null == (l = v && v.display) && (l = Y.get(e, "display")),
                "none" === (c = S.css(e, "display")) && (l ? c = l : (le([e], !0),
                l = e.style.display || l,
                c = S.css(e, "display"),
                le([e]))),
                ("inline" === c || "inline-block" === c && null != l) && "none" === S.css(e, "float") && (u || (p.done(function() {
                    h.display = l
                }),
                null == l && (c = h.display,
                l = "none" === c ? "" : c)),
                h.display = "inline-block")),
                n.overflow && (h.overflow = "hidden",
                p.always(function() {
                    h.overflow = n.overflow[0],
                    h.overflowX = n.overflow[1],
                    h.overflowY = n.overflow[2]
                })),
                u = !1,
                d)
                    u || (v ? "hidden"in v && (g = v.hidden) : v = Y.access(e, "fxshow", {
                        display: l
                    }),
                    o && (v.hidden = !g),
                    g && le([e], !0),
                    p.done(function() {
                        for (r in g || le([e]),
                        Y.remove(e, "fxshow"),
                        d)
                            S.style(e, r, d[r])
                    })),
                    u = ut(g ? v[r] : 0, r, p),
                    r in v || (v[r] = u.start,
                    g && (u.end = u.start,
                    u.start = 0))
        }
        ],
        prefilter: function(e, t) {
            t ? lt.prefilters.unshift(e) : lt.prefilters.push(e)
        }
    }),
    S.speed = function(e, t, n) {
        var r = e && "object" == typeof e ? S.extend({}, e) : {
            complete: n || !n && t || m(e) && e,
            duration: e,
            easing: n && t || t && !m(t) && t
        };
        return S.fx.off ? r.duration = 0 : "number" != typeof r.duration && (r.duration in S.fx.speeds ? r.duration = S.fx.speeds[r.duration] : r.duration = S.fx.speeds._default),
        null != r.queue && !0 !== r.queue || (r.queue = "fx"),
        r.old = r.complete,
        r.complete = function() {
            m(r.old) && r.old.call(this),
            r.queue && S.dequeue(this, r.queue)
        }
        ,
        r
    }
    ,
    S.fn.extend({
        fadeTo: function(e, t, n, r) {
            return this.filter(ae).css("opacity", 0).show().end().animate({
                opacity: t
            }, e, n, r)
        },
        animate: function(t, e, n, r) {
            var i = S.isEmptyObject(t)
              , o = S.speed(e, n, r)
              , a = function() {
                var e = lt(this, S.extend({}, t), o);
                (i || Y.get(this, "finish")) && e.stop(!0)
            };
            return a.finish = a,
            i || !1 === o.queue ? this.each(a) : this.queue(o.queue, a)
        },
        stop: function(i, e, o) {
            var a = function(e) {
                var t = e.stop;
                delete e.stop,
                t(o)
            };
            return "string" != typeof i && (o = e,
            e = i,
            i = void 0),
            e && this.queue(i || "fx", []),
            this.each(function() {
                var e = !0
                  , t = null != i && i + "queueHooks"
                  , n = S.timers
                  , r = Y.get(this);
                if (t)
                    r[t] && r[t].stop && a(r[t]);
                else
                    for (t in r)
                        r[t] && r[t].stop && it.test(t) && a(r[t]);
                for (t = n.length; t--; )
                    n[t].elem !== this || null != i && n[t].queue !== i || (n[t].anim.stop(o),
                    e = !1,
                    n.splice(t, 1));
                !e && o || S.dequeue(this, i)
            })
        },
        finish: function(a) {
            return !1 !== a && (a = a || "fx"),
            this.each(function() {
                var e, t = Y.get(this), n = t[a + "queue"], r = t[a + "queueHooks"], i = S.timers, o = n ? n.length : 0;
                for (t.finish = !0,
                S.queue(this, a, []),
                r && r.stop && r.stop.call(this, !0),
                e = i.length; e--; )
                    i[e].elem === this && i[e].queue === a && (i[e].anim.stop(!0),
                    i.splice(e, 1));
                for (e = 0; e < o; e++)
                    n[e] && n[e].finish && n[e].finish.call(this);
                delete t.finish
            })
        }
    }),
    S.each(["toggle", "show", "hide"], function(e, r) {
        var i = S.fn[r];
        S.fn[r] = function(e, t, n) {
            return null == e || "boolean" == typeof e ? i.apply(this, arguments) : this.animate(st(r, !0), e, t, n)
        }
    }),
    S.each({
        slideDown: st("show"),
        slideUp: st("hide"),
        slideToggle: st("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(e, r) {
        S.fn[e] = function(e, t, n) {
            return this.animate(r, e, t, n)
        }
    }),
    S.timers = [],
    S.fx.tick = function() {
        var e, t = 0, n = S.timers;
        for (Ze = Date.now(); t < n.length; t++)
            (e = n[t])() || n[t] !== e || n.splice(t--, 1);
        n.length || S.fx.stop(),
        Ze = void 0
    }
    ,
    S.fx.timer = function(e) {
        S.timers.push(e),
        S.fx.start()
    }
    ,
    S.fx.interval = 13,
    S.fx.start = function() {
        et || (et = !0,
        ot())
    }
    ,
    S.fx.stop = function() {
        et = null
    }
    ,
    S.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    },
    S.fn.delay = function(r, e) {
        return r = S.fx && S.fx.speeds[r] || r,
        e = e || "fx",
        this.queue(e, function(e, t) {
            var n = C.setTimeout(e, r);
            t.stop = function() {
                C.clearTimeout(n)
            }
        })
    }
    ,
    tt = E.createElement("input"),
    nt = E.createElement("select").appendChild(E.createElement("option")),
    tt.type = "checkbox",
    y.checkOn = "" !== tt.value,
    y.optSelected = nt.selected,
    (tt = E.createElement("input")).value = "t",
    tt.type = "radio",
    y.radioValue = "t" === tt.value;
    var ct, ft = S.expr.attrHandle;
    S.fn.extend({
        attr: function(e, t) {
            return $(this, S.attr, e, t, 1 < arguments.length)
        },
        removeAttr: function(e) {
            return this.each(function() {
                S.removeAttr(this, e)
            })
        }
    }),
    S.extend({
        attr: function(e, t, n) {
            var r, i, o = e.nodeType;
            if (3 !== o && 8 !== o && 2 !== o)
                return "undefined" == typeof e.getAttribute ? S.prop(e, t, n) : (1 === o && S.isXMLDoc(e) || (i = S.attrHooks[t.toLowerCase()] || (S.expr.match.bool.test(t) ? ct : void 0)),
                void 0 !== n ? null === n ? void S.removeAttr(e, t) : i && "set"in i && void 0 !== (r = i.set(e, n, t)) ? r : (e.setAttribute(t, n + ""),
                n) : i && "get"in i && null !== (r = i.get(e, t)) ? r : null == (r = S.find.attr(e, t)) ? void 0 : r)
        },
        attrHooks: {
            type: {
                set: function(e, t) {
                    if (!y.radioValue && "radio" === t && A(e, "input")) {
                        var n = e.value;
                        return e.setAttribute("type", t),
                        n && (e.value = n),
                        t
                    }
                }
            }
        },
        removeAttr: function(e, t) {
            var n, r = 0, i = t && t.match(P);
            if (i && 1 === e.nodeType)
                while (n = i[r++])
                    e.removeAttribute(n)
        }
    }),
    ct = {
        set: function(e, t, n) {
            return !1 === t ? S.removeAttr(e, n) : e.setAttribute(n, n),
            n
        }
    },
    S.each(S.expr.match.bool.source.match(/\w+/g), function(e, t) {
        var a = ft[t] || S.find.attr;
        ft[t] = function(e, t, n) {
            var r, i, o = t.toLowerCase();
            return n || (i = ft[o],
            ft[o] = r,
            r = null != a(e, t, n) ? o : null,
            ft[o] = i),
            r
        }
    });
    var pt = /^(?:input|select|textarea|button)$/i
      , dt = /^(?:a|area)$/i;
    function ht(e) {
        return (e.match(P) || []).join(" ")
    }
    function gt(e) {
        return e.getAttribute && e.getAttribute("class") || ""
    }
    function vt(e) {
        return Array.isArray(e) ? e : "string" == typeof e && e.match(P) || []
    }
    S.fn.extend({
        prop: function(e, t) {
            return $(this, S.prop, e, t, 1 < arguments.length)
        },
        removeProp: function(e) {
            return this.each(function() {
                delete this[S.propFix[e] || e]
            })
        }
    }),
    S.extend({
        prop: function(e, t, n) {
            var r, i, o = e.nodeType;
            if (3 !== o && 8 !== o && 2 !== o)
                return 1 === o && S.isXMLDoc(e) || (t = S.propFix[t] || t,
                i = S.propHooks[t]),
                void 0 !== n ? i && "set"in i && void 0 !== (r = i.set(e, n, t)) ? r : e[t] = n : i && "get"in i && null !== (r = i.get(e, t)) ? r : e[t]
        },
        propHooks: {
            tabIndex: {
                get: function(e) {
                    var t = S.find.attr(e, "tabindex");
                    return t ? parseInt(t, 10) : pt.test(e.nodeName) || dt.test(e.nodeName) && e.href ? 0 : -1
                }
            }
        },
        propFix: {
            "for": "htmlFor",
            "class": "className"
        }
    }),
    y.optSelected || (S.propHooks.selected = {
        get: function(e) {
            var t = e.parentNode;
            return t && t.parentNode && t.parentNode.selectedIndex,
            null
        },
        set: function(e) {
            var t = e.parentNode;
            t && (t.selectedIndex,
            t.parentNode && t.parentNode.selectedIndex)
        }
    }),
    S.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        S.propFix[this.toLowerCase()] = this
    }),
    S.fn.extend({
        addClass: function(t) {
            var e, n, r, i, o, a, s, u = 0;
            if (m(t))
                return this.each(function(e) {
                    S(this).addClass(t.call(this, e, gt(this)))
                });
            if ((e = vt(t)).length)
                while (n = this[u++])
                    if (i = gt(n),
                    r = 1 === n.nodeType && " " + ht(i) + " ") {
                        a = 0;
                        while (o = e[a++])
                            r.indexOf(" " + o + " ") < 0 && (r += o + " ");
                        i !== (s = ht(r)) && n.setAttribute("class", s)
                    }
            return this
        },
        removeClass: function(t) {
            var e, n, r, i, o, a, s, u = 0;
            if (m(t))
                return this.each(function(e) {
                    S(this).removeClass(t.call(this, e, gt(this)))
                });
            if (!arguments.length)
                return this.attr("class", "");
            if ((e = vt(t)).length)
                while (n = this[u++])
                    if (i = gt(n),
                    r = 1 === n.nodeType && " " + ht(i) + " ") {
                        a = 0;
                        while (o = e[a++])
                            while (-1 < r.indexOf(" " + o + " "))
                                r = r.replace(" " + o + " ", " ");
                        i !== (s = ht(r)) && n.setAttribute("class", s)
                    }
            return this
        },
        toggleClass: function(i, t) {
            var o = typeof i
              , a = "string" === o || Array.isArray(i);
            return "boolean" == typeof t && a ? t ? this.addClass(i) : this.removeClass(i) : m(i) ? this.each(function(e) {
                S(this).toggleClass(i.call(this, e, gt(this), t), t)
            }) : this.each(function() {
                var e, t, n, r;
                if (a) {
                    t = 0,
                    n = S(this),
                    r = vt(i);
                    while (e = r[t++])
                        n.hasClass(e) ? n.removeClass(e) : n.addClass(e)
                } else
                    void 0 !== i && "boolean" !== o || ((e = gt(this)) && Y.set(this, "__className__", e),
                    this.setAttribute && this.setAttribute("class", e || !1 === i ? "" : Y.get(this, "__className__") || ""))
            })
        },
        hasClass: function(e) {
            var t, n, r = 0;
            t = " " + e + " ";
            while (n = this[r++])
                if (1 === n.nodeType && -1 < (" " + ht(gt(n)) + " ").indexOf(t))
                    return !0;
            return !1
        }
    });
    var yt = /\r/g;
    S.fn.extend({
        val: function(n) {
            var r, e, i, t = this[0];
            return arguments.length ? (i = m(n),
            this.each(function(e) {
                var t;
                1 === this.nodeType && (null == (t = i ? n.call(this, e, S(this).val()) : n) ? t = "" : "number" == typeof t ? t += "" : Array.isArray(t) && (t = S.map(t, function(e) {
                    return null == e ? "" : e + ""
                })),
                (r = S.valHooks[this.type] || S.valHooks[this.nodeName.toLowerCase()]) && "set"in r && void 0 !== r.set(this, t, "value") || (this.value = t))
            })) : t ? (r = S.valHooks[t.type] || S.valHooks[t.nodeName.toLowerCase()]) && "get"in r && void 0 !== (e = r.get(t, "value")) ? e : "string" == typeof (e = t.value) ? e.replace(yt, "") : null == e ? "" : e : void 0
        }
    }),
    S.extend({
        valHooks: {
            option: {
                get: function(e) {
                    var t = S.find.attr(e, "value");
                    return null != t ? t : ht(S.text(e))
                }
            },
            select: {
                get: function(e) {
                    var t, n, r, i = e.options, o = e.selectedIndex, a = "select-one" === e.type, s = a ? null : [], u = a ? o + 1 : i.length;
                    for (r = o < 0 ? u : a ? o : 0; r < u; r++)
                        if (((n = i[r]).selected || r === o) && !n.disabled && (!n.parentNode.disabled || !A(n.parentNode, "optgroup"))) {
                            if (t = S(n).val(),
                            a)
                                return t;
                            s.push(t)
                        }
                    return s
                },
                set: function(e, t) {
                    var n, r, i = e.options, o = S.makeArray(t), a = i.length;
                    while (a--)
                        ((r = i[a]).selected = -1 < S.inArray(S.valHooks.option.get(r), o)) && (n = !0);
                    return n || (e.selectedIndex = -1),
                    o
                }
            }
        }
    }),
    S.each(["radio", "checkbox"], function() {
        S.valHooks[this] = {
            set: function(e, t) {
                if (Array.isArray(t))
                    return e.checked = -1 < S.inArray(S(e).val(), t)
            }
        },
        y.checkOn || (S.valHooks[this].get = function(e) {
            return null === e.getAttribute("value") ? "on" : e.value
        }
        )
    }),
    y.focusin = "onfocusin"in C;
    var mt = /^(?:focusinfocus|focusoutblur)$/
      , xt = function(e) {
        e.stopPropagation()
    };
    S.extend(S.event, {
        trigger: function(e, t, n, r) {
            var i, o, a, s, u, l, c, f, p = [n || E], d = v.call(e, "type") ? e.type : e, h = v.call(e, "namespace") ? e.namespace.split(".") : [];
            if (o = f = a = n = n || E,
            3 !== n.nodeType && 8 !== n.nodeType && !mt.test(d + S.event.triggered) && (-1 < d.indexOf(".") && (d = (h = d.split(".")).shift(),
            h.sort()),
            u = d.indexOf(":") < 0 && "on" + d,
            (e = e[S.expando] ? e : new S.Event(d,"object" == typeof e && e)).isTrigger = r ? 2 : 3,
            e.namespace = h.join("."),
            e.rnamespace = e.namespace ? new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)") : null,
            e.result = void 0,
            e.target || (e.target = n),
            t = null == t ? [e] : S.makeArray(t, [e]),
            c = S.event.special[d] || {},
            r || !c.trigger || !1 !== c.trigger.apply(n, t))) {
                if (!r && !c.noBubble && !x(n)) {
                    for (s = c.delegateType || d,
                    mt.test(s + d) || (o = o.parentNode); o; o = o.parentNode)
                        p.push(o),
                        a = o;
                    a === (n.ownerDocument || E) && p.push(a.defaultView || a.parentWindow || C)
                }
                i = 0;
                while ((o = p[i++]) && !e.isPropagationStopped())
                    f = o,
                    e.type = 1 < i ? s : c.bindType || d,
                    (l = (Y.get(o, "events") || Object.create(null))[e.type] && Y.get(o, "handle")) && l.apply(o, t),
                    (l = u && o[u]) && l.apply && V(o) && (e.result = l.apply(o, t),
                    !1 === e.result && e.preventDefault());
                return e.type = d,
                r || e.isDefaultPrevented() || c._default && !1 !== c._default.apply(p.pop(), t) || !V(n) || u && m(n[d]) && !x(n) && ((a = n[u]) && (n[u] = null),
                S.event.triggered = d,
                e.isPropagationStopped() && f.addEventListener(d, xt),
                n[d](),
                e.isPropagationStopped() && f.removeEventListener(d, xt),
                S.event.triggered = void 0,
                a && (n[u] = a)),
                e.result
            }
        },
        simulate: function(e, t, n) {
            var r = S.extend(new S.Event, n, {
                type: e,
                isSimulated: !0
            });
            S.event.trigger(r, null, t)
        }
    }),
    S.fn.extend({
        trigger: function(e, t) {
            return this.each(function() {
                S.event.trigger(e, t, this)
            })
        },
        triggerHandler: function(e, t) {
            var n = this[0];
            if (n)
                return S.event.trigger(e, t, n, !0)
        }
    }),
    y.focusin || S.each({
        focus: "focusin",
        blur: "focusout"
    }, function(n, r) {
        var i = function(e) {
            S.event.simulate(r, e.target, S.event.fix(e))
        };
        S.event.special[r] = {
            setup: function() {
                var e = this.ownerDocument || this.document || this
                  , t = Y.access(e, r);
                t || e.addEventListener(n, i, !0),
                Y.access(e, r, (t || 0) + 1)
            },
            teardown: function() {
                var e = this.ownerDocument || this.document || this
                  , t = Y.access(e, r) - 1;
                t ? Y.access(e, r, t) : (e.removeEventListener(n, i, !0),
                Y.remove(e, r))
            }
        }
    });
    var bt = C.location
      , wt = {
        guid: Date.now()
    }
      , Tt = /\?/;
    S.parseXML = function(e) {
        var t, n;
        if (!e || "string" != typeof e)
            return null;
        try {
            t = (new C.DOMParser).parseFromString(e, "text/xml")
        } catch (e) {}
        return n = t && t.getElementsByTagName("parsererror")[0],
        t && !n || S.error("Invalid XML: " + (n ? S.map(n.childNodes, function(e) {
            return e.textContent
        }).join("\n") : e)),
        t
    }
    ;
    var Ct = /\[\]$/
      , Et = /\r?\n/g
      , St = /^(?:submit|button|image|reset|file)$/i
      , kt = /^(?:input|select|textarea|keygen)/i;
    function At(n, e, r, i) {
        var t;
        if (Array.isArray(e))
            S.each(e, function(e, t) {
                r || Ct.test(n) ? i(n, t) : At(n + "[" + ("object" == typeof t && null != t ? e : "") + "]", t, r, i)
            });
        else if (r || "object" !== w(e))
            i(n, e);
        else
            for (t in e)
                At(n + "[" + t + "]", e[t], r, i)
    }
    S.param = function(e, t) {
        var n, r = [], i = function(e, t) {
            var n = m(t) ? t() : t;
            r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(null == n ? "" : n)
        };
        if (null == e)
            return "";
        if (Array.isArray(e) || e.jquery && !S.isPlainObject(e))
            S.each(e, function() {
                i(this.name, this.value)
            });
        else
            for (n in e)
                At(n, e[n], t, i);
        return r.join("&")
    }
    ,
    S.fn.extend({
        serialize: function() {
            return S.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var e = S.prop(this, "elements");
                return e ? S.makeArray(e) : this
            }).filter(function() {
                var e = this.type;
                return this.name && !S(this).is(":disabled") && kt.test(this.nodeName) && !St.test(e) && (this.checked || !pe.test(e))
            }).map(function(e, t) {
                var n = S(this).val();
                return null == n ? null : Array.isArray(n) ? S.map(n, function(e) {
                    return {
                        name: t.name,
                        value: e.replace(Et, "\r\n")
                    }
                }) : {
                    name: t.name,
                    value: n.replace(Et, "\r\n")
                }
            }).get()
        }
    });
    var Nt = /%20/g
      , jt = /#.*$/
      , Dt = /([?&])_=[^&]*/
      , qt = /^(.*?):[ \t]*([^\r\n]*)$/gm
      , Lt = /^(?:GET|HEAD)$/
      , Ht = /^\/\//
      , Ot = {}
      , Pt = {}
      , Rt = "*/".concat("*")
      , Mt = E.createElement("a");
    function It(o) {
        return function(e, t) {
            "string" != typeof e && (t = e,
            e = "*");
            var n, r = 0, i = e.toLowerCase().match(P) || [];
            if (m(t))
                while (n = i[r++])
                    "+" === n[0] ? (n = n.slice(1) || "*",
                    (o[n] = o[n] || []).unshift(t)) : (o[n] = o[n] || []).push(t)
        }
    }
    function Wt(t, i, o, a) {
        var s = {}
          , u = t === Pt;
        function l(e) {
            var r;
            return s[e] = !0,
            S.each(t[e] || [], function(e, t) {
                var n = t(i, o, a);
                return "string" != typeof n || u || s[n] ? u ? !(r = n) : void 0 : (i.dataTypes.unshift(n),
                l(n),
                !1)
            }),
            r
        }
        return l(i.dataTypes[0]) || !s["*"] && l("*")
    }
    function Ft(e, t) {
        var n, r, i = S.ajaxSettings.flatOptions || {};
        for (n in t)
            void 0 !== t[n] && ((i[n] ? e : r || (r = {}))[n] = t[n]);
        return r && S.extend(!0, e, r),
        e
    }
    Mt.href = bt.href,
    S.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: bt.href,
            type: "GET",
            isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(bt.protocol),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": Rt,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /\bxml\b/,
                html: /\bhtml/,
                json: /\bjson\b/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": JSON.parse,
                "text xml": S.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(e, t) {
            return t ? Ft(Ft(e, S.ajaxSettings), t) : Ft(S.ajaxSettings, e)
        },
        ajaxPrefilter: It(Ot),
        ajaxTransport: It(Pt),
        ajax: function(e, t) {
            "object" == typeof e && (t = e,
            e = void 0),
            t = t || {};
            var c, f, p, n, d, r, h, g, i, o, v = S.ajaxSetup({}, t), y = v.context || v, m = v.context && (y.nodeType || y.jquery) ? S(y) : S.event, x = S.Deferred(), b = S.Callbacks("once memory"), w = v.statusCode || {}, a = {}, s = {}, u = "canceled", T = {
                readyState: 0,
                getResponseHeader: function(e) {
                    var t;
                    if (h) {
                        if (!n) {
                            n = {};
                            while (t = qt.exec(p))
                                n[t[1].toLowerCase() + " "] = (n[t[1].toLowerCase() + " "] || []).concat(t[2])
                        }
                        t = n[e.toLowerCase() + " "]
                    }
                    return null == t ? null : t.join(", ")
                },
                getAllResponseHeaders: function() {
                    return h ? p : null
                },
                setRequestHeader: function(e, t) {
                    return null == h && (e = s[e.toLowerCase()] = s[e.toLowerCase()] || e,
                    a[e] = t),
                    this
                },
                overrideMimeType: function(e) {
                    return null == h && (v.mimeType = e),
                    this
                },
                statusCode: function(e) {
                    var t;
                    if (e)
                        if (h)
                            T.always(e[T.status]);
                        else
                            for (t in e)
                                w[t] = [w[t], e[t]];
                    return this
                },
                abort: function(e) {
                    var t = e || u;
                    return c && c.abort(t),
                    l(0, t),
                    this
                }
            };
            if (x.promise(T),
            v.url = ((e || v.url || bt.href) + "").replace(Ht, bt.protocol + "//"),
            v.type = t.method || t.type || v.method || v.type,
            v.dataTypes = (v.dataType || "*").toLowerCase().match(P) || [""],
            null == v.crossDomain) {
                r = E.createElement("a");
                try {
                    r.href = v.url,
                    r.href = r.href,
                    v.crossDomain = Mt.protocol + "//" + Mt.host != r.protocol + "//" + r.host
                } catch (e) {
                    v.crossDomain = !0
                }
            }
            if (v.data && v.processData && "string" != typeof v.data && (v.data = S.param(v.data, v.traditional)),
            Wt(Ot, v, t, T),
            h)
                return T;
            for (i in (g = S.event && v.global) && 0 == S.active++ && S.event.trigger("ajaxStart"),
            v.type = v.type.toUpperCase(),
            v.hasContent = !Lt.test(v.type),
            f = v.url.replace(jt, ""),
            v.hasContent ? v.data && v.processData && 0 === (v.contentType || "").indexOf("application/x-www-form-urlencoded") && (v.data = v.data.replace(Nt, "+")) : (o = v.url.slice(f.length),
            v.data && (v.processData || "string" == typeof v.data) && (f += (Tt.test(f) ? "&" : "?") + v.data,
            delete v.data),
            !1 === v.cache && (f = f.replace(Dt, "$1"),
            o = (Tt.test(f) ? "&" : "?") + "_=" + wt.guid++ + o),
            v.url = f + o),
            v.ifModified && (S.lastModified[f] && T.setRequestHeader("If-Modified-Since", S.lastModified[f]),
            S.etag[f] && T.setRequestHeader("If-None-Match", S.etag[f])),
            (v.data && v.hasContent && !1 !== v.contentType || t.contentType) && T.setRequestHeader("Content-Type", v.contentType),
            T.setRequestHeader("Accept", v.dataTypes[0] && v.accepts[v.dataTypes[0]] ? v.accepts[v.dataTypes[0]] + ("*" !== v.dataTypes[0] ? ", " + Rt + "; q=0.01" : "") : v.accepts["*"]),
            v.headers)
                T.setRequestHeader(i, v.headers[i]);
            if (v.beforeSend && (!1 === v.beforeSend.call(y, T, v) || h))
                return T.abort();
            if (u = "abort",
            b.add(v.complete),
            T.done(v.success),
            T.fail(v.error),
            c = Wt(Pt, v, t, T)) {
                if (T.readyState = 1,
                g && m.trigger("ajaxSend", [T, v]),
                h)
                    return T;
                v.async && 0 < v.timeout && (d = C.setTimeout(function() {
                    T.abort("timeout")
                }, v.timeout));
                try {
                    h = !1,
                    c.send(a, l)
                } catch (e) {
                    if (h)
                        throw e;
                    l(-1, e)
                }
            } else
                l(-1, "No Transport");
            function l(e, t, n, r) {
                var i, o, a, s, u, l = t;
                h || (h = !0,
                d && C.clearTimeout(d),
                c = void 0,
                p = r || "",
                T.readyState = 0 < e ? 4 : 0,
                i = 200 <= e && e < 300 || 304 === e,
                n && (s = function(e, t, n) {
                    var r, i, o, a, s = e.contents, u = e.dataTypes;
                    while ("*" === u[0])
                        u.shift(),
                        void 0 === r && (r = e.mimeType || t.getResponseHeader("Content-Type"));
                    if (r)
                        for (i in s)
                            if (s[i] && s[i].test(r)) {
                                u.unshift(i);
                                break
                            }
                    if (u[0]in n)
                        o = u[0];
                    else {
                        for (i in n) {
                            if (!u[0] || e.converters[i + " " + u[0]]) {
                                o = i;
                                break
                            }
                            a || (a = i)
                        }
                        o = o || a
                    }
                    if (o)
                        return o !== u[0] && u.unshift(o),
                        n[o]
                }(v, T, n)),
                !i && -1 < S.inArray("script", v.dataTypes) && S.inArray("json", v.dataTypes) < 0 && (v.converters["text script"] = function() {}
                ),
                s = function(e, t, n, r) {
                    var i, o, a, s, u, l = {}, c = e.dataTypes.slice();
                    if (c[1])
                        for (a in e.converters)
                            l[a.toLowerCase()] = e.converters[a];
                    o = c.shift();
                    while (o)
                        if (e.responseFields[o] && (n[e.responseFields[o]] = t),
                        !u && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)),
                        u = o,
                        o = c.shift())
                            if ("*" === o)
                                o = u;
                            else if ("*" !== u && u !== o) {
                                if (!(a = l[u + " " + o] || l["* " + o]))
                                    for (i in l)
                                        if ((s = i.split(" "))[1] === o && (a = l[u + " " + s[0]] || l["* " + s[0]])) {
                                            !0 === a ? a = l[i] : !0 !== l[i] && (o = s[0],
                                            c.unshift(s[1]));
                                            break
                                        }
                                if (!0 !== a)
                                    if (a && e["throws"])
                                        t = a(t);
                                    else
                                        try {
                                            t = a(t)
                                        } catch (e) {
                                            return {
                                                state: "parsererror",
                                                error: a ? e : "No conversion from " + u + " to " + o
                                            }
                                        }
                            }
                    return {
                        state: "success",
                        data: t
                    }
                }(v, s, T, i),
                i ? (v.ifModified && ((u = T.getResponseHeader("Last-Modified")) && (S.lastModified[f] = u),
                (u = T.getResponseHeader("etag")) && (S.etag[f] = u)),
                204 === e || "HEAD" === v.type ? l = "nocontent" : 304 === e ? l = "notmodified" : (l = s.state,
                o = s.data,
                i = !(a = s.error))) : (a = l,
                !e && l || (l = "error",
                e < 0 && (e = 0))),
                T.status = e,
                T.statusText = (t || l) + "",
                i ? x.resolveWith(y, [o, l, T]) : x.rejectWith(y, [T, l, a]),
                T.statusCode(w),
                w = void 0,
                g && m.trigger(i ? "ajaxSuccess" : "ajaxError", [T, v, i ? o : a]),
                b.fireWith(y, [T, l]),
                g && (m.trigger("ajaxComplete", [T, v]),
                --S.active || S.event.trigger("ajaxStop")))
            }
            return T
        },
        getJSON: function(e, t, n) {
            return S.get(e, t, n, "json")
        },
        getScript: function(e, t) {
            return S.get(e, void 0, t, "script")
        }
    }),
    S.each(["get", "post"], function(e, i) {
        S[i] = function(e, t, n, r) {
            return m(t) && (r = r || n,
            n = t,
            t = void 0),
            S.ajax(S.extend({
                url: e,
                type: i,
                dataType: r,
                data: t,
                success: n
            }, S.isPlainObject(e) && e))
        }
    }),
    S.ajaxPrefilter(function(e) {
        var t;
        for (t in e.headers)
            "content-type" === t.toLowerCase() && (e.contentType = e.headers[t] || "")
    }),
    S._evalUrl = function(e, t, n) {
        return S.ajax({
            url: e,
            type: "GET",
            dataType: "script",
            cache: !0,
            async: !1,
            global: !1,
            converters: {
                "text script": function() {}
            },
            dataFilter: function(e) {
                S.globalEval(e, t, n)
            }
        })
    }
    ,
    S.fn.extend({
        wrapAll: function(e) {
            var t;
            return this[0] && (m(e) && (e = e.call(this[0])),
            t = S(e, this[0].ownerDocument).eq(0).clone(!0),
            this[0].parentNode && t.insertBefore(this[0]),
            t.map(function() {
                var e = this;
                while (e.firstElementChild)
                    e = e.firstElementChild;
                return e
            }).append(this)),
            this
        },
        wrapInner: function(n) {
            return m(n) ? this.each(function(e) {
                S(this).wrapInner(n.call(this, e))
            }) : this.each(function() {
                var e = S(this)
                  , t = e.contents();
                t.length ? t.wrapAll(n) : e.append(n)
            })
        },
        wrap: function(t) {
            var n = m(t);
            return this.each(function(e) {
                S(this).wrapAll(n ? t.call(this, e) : t)
            })
        },
        unwrap: function(e) {
            return this.parent(e).not("body").each(function() {
                S(this).replaceWith(this.childNodes)
            }),
            this
        }
    }),
    S.expr.pseudos.hidden = function(e) {
        return !S.expr.pseudos.visible(e)
    }
    ,
    S.expr.pseudos.visible = function(e) {
        return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length)
    }
    ,
    S.ajaxSettings.xhr = function() {
        try {
            return new C.XMLHttpRequest
        } catch (e) {}
    }
    ;
    var Bt = {
        0: 200,
        1223: 204
    }
      , $t = S.ajaxSettings.xhr();
    y.cors = !!$t && "withCredentials"in $t,
    y.ajax = $t = !!$t,
    S.ajaxTransport(function(i) {
        var o, a;
        if (y.cors || $t && !i.crossDomain)
            return {
                send: function(e, t) {
                    var n, r = i.xhr();
                    if (r.open(i.type, i.url, i.async, i.username, i.password),
                    i.xhrFields)
                        for (n in i.xhrFields)
                            r[n] = i.xhrFields[n];
                    for (n in i.mimeType && r.overrideMimeType && r.overrideMimeType(i.mimeType),
                    i.crossDomain || e["X-Requested-With"] || (e["X-Requested-With"] = "XMLHttpRequest"),
                    e)
                        r.setRequestHeader(n, e[n]);
                    o = function(e) {
                        return function() {
                            o && (o = a = r.onload = r.onerror = r.onabort = r.ontimeout = r.onreadystatechange = null,
                            "abort" === e ? r.abort() : "error" === e ? "number" != typeof r.status ? t(0, "error") : t(r.status, r.statusText) : t(Bt[r.status] || r.status, r.statusText, "text" !== (r.responseType || "text") || "string" != typeof r.responseText ? {
                                binary: r.response
                            } : {
                                text: r.responseText
                            }, r.getAllResponseHeaders()))
                        }
                    }
                    ,
                    r.onload = o(),
                    a = r.onerror = r.ontimeout = o("error"),
                    void 0 !== r.onabort ? r.onabort = a : r.onreadystatechange = function() {
                        4 === r.readyState && C.setTimeout(function() {
                            o && a()
                        })
                    }
                    ,
                    o = o("abort");
                    try {
                        r.send(i.hasContent && i.data || null)
                    } catch (e) {
                        if (o)
                            throw e
                    }
                },
                abort: function() {
                    o && o()
                }
            }
    }),
    S.ajaxPrefilter(function(e) {
        e.crossDomain && (e.contents.script = !1)
    }),
    S.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /\b(?:java|ecma)script\b/
        },
        converters: {
            "text script": function(e) {
                return S.globalEval(e),
                e
            }
        }
    }),
    S.ajaxPrefilter("script", function(e) {
        void 0 === e.cache && (e.cache = !1),
        e.crossDomain && (e.type = "GET")
    }),
    S.ajaxTransport("script", function(n) {
        var r, i;
        if (n.crossDomain || n.scriptAttrs)
            return {
                send: function(e, t) {
                    r = S("<script>").attr(n.scriptAttrs || {}).prop({
                        charset: n.scriptCharset,
                        src: n.url
                    }).on("load error", i = function(e) {
                        r.remove(),
                        i = null,
                        e && t("error" === e.type ? 404 : 200, e.type)
                    }
                    ),
                    E.head.appendChild(r[0])
                },
                abort: function() {
                    i && i()
                }
            }
    });
    var _t, zt = [], Ut = /(=)\?(?=&|$)|\?\?/;
    S.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var e = zt.pop() || S.expando + "_" + wt.guid++;
            return this[e] = !0,
            e
        }
    }),
    S.ajaxPrefilter("json jsonp", function(e, t, n) {
        var r, i, o, a = !1 !== e.jsonp && (Ut.test(e.url) ? "url" : "string" == typeof e.data && 0 === (e.contentType || "").indexOf("application/x-www-form-urlencoded") && Ut.test(e.data) && "data");
        if (a || "jsonp" === e.dataTypes[0])
            return r = e.jsonpCallback = m(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback,
            a ? e[a] = e[a].replace(Ut, "$1" + r) : !1 !== e.jsonp && (e.url += (Tt.test(e.url) ? "&" : "?") + e.jsonp + "=" + r),
            e.converters["script json"] = function() {
                return o || S.error(r + " was not called"),
                o[0]
            }
            ,
            e.dataTypes[0] = "json",
            i = C[r],
            C[r] = function() {
                o = arguments
            }
            ,
            n.always(function() {
                void 0 === i ? S(C).removeProp(r) : C[r] = i,
                e[r] && (e.jsonpCallback = t.jsonpCallback,
                zt.push(r)),
                o && m(i) && i(o[0]),
                o = i = void 0
            }),
            "script"
    }),
    y.createHTMLDocument = ((_t = E.implementation.createHTMLDocument("").body).innerHTML = "<form></form><form></form>",
    2 === _t.childNodes.length),
    S.parseHTML = function(e, t, n) {
        return "string" != typeof e ? [] : ("boolean" == typeof t && (n = t,
        t = !1),
        t || (y.createHTMLDocument ? ((r = (t = E.implementation.createHTMLDocument("")).createElement("base")).href = E.location.href,
        t.head.appendChild(r)) : t = E),
        o = !n && [],
        (i = N.exec(e)) ? [t.createElement(i[1])] : (i = xe([e], t, o),
        o && o.length && S(o).remove(),
        S.merge([], i.childNodes)));
        var r, i, o
    }
    ,
    S.fn.load = function(e, t, n) {
        var r, i, o, a = this, s = e.indexOf(" ");
        return -1 < s && (r = ht(e.slice(s)),
        e = e.slice(0, s)),
        m(t) ? (n = t,
        t = void 0) : t && "object" == typeof t && (i = "POST"),
        0 < a.length && S.ajax({
            url: e,
            type: i || "GET",
            dataType: "html",
            data: t
        }).done(function(e) {
            o = arguments,
            a.html(r ? S("<div>").append(S.parseHTML(e)).find(r) : e)
        }).always(n && function(e, t) {
            a.each(function() {
                n.apply(this, o || [e.responseText, t, e])
            })
        }
        ),
        this
    }
    ,
    S.expr.pseudos.animated = function(t) {
        return S.grep(S.timers, function(e) {
            return t === e.elem
        }).length
    }
    ,
    S.offset = {
        setOffset: function(e, t, n) {
            var r, i, o, a, s, u, l = S.css(e, "position"), c = S(e), f = {};
            "static" === l && (e.style.position = "relative"),
            s = c.offset(),
            o = S.css(e, "top"),
            u = S.css(e, "left"),
            ("absolute" === l || "fixed" === l) && -1 < (o + u).indexOf("auto") ? (a = (r = c.position()).top,
            i = r.left) : (a = parseFloat(o) || 0,
            i = parseFloat(u) || 0),
            m(t) && (t = t.call(e, n, S.extend({}, s))),
            null != t.top && (f.top = t.top - s.top + a),
            null != t.left && (f.left = t.left - s.left + i),
            "using"in t ? t.using.call(e, f) : c.css(f)
        }
    },
    S.fn.extend({
        offset: function(t) {
            if (arguments.length)
                return void 0 === t ? this : this.each(function(e) {
                    S.offset.setOffset(this, t, e)
                });
            var e, n, r = this[0];
            return r ? r.getClientRects().length ? (e = r.getBoundingClientRect(),
            n = r.ownerDocument.defaultView,
            {
                top: e.top + n.pageYOffset,
                left: e.left + n.pageXOffset
            }) : {
                top: 0,
                left: 0
            } : void 0
        },
        position: function() {
            if (this[0]) {
                var e, t, n, r = this[0], i = {
                    top: 0,
                    left: 0
                };
                if ("fixed" === S.css(r, "position"))
                    t = r.getBoundingClientRect();
                else {
                    t = this.offset(),
                    n = r.ownerDocument,
                    e = r.offsetParent || n.documentElement;
                    while (e && (e === n.body || e === n.documentElement) && "static" === S.css(e, "position"))
                        e = e.parentNode;
                    e && e !== r && 1 === e.nodeType && ((i = S(e).offset()).top += S.css(e, "borderTopWidth", !0),
                    i.left += S.css(e, "borderLeftWidth", !0))
                }
                return {
                    top: t.top - i.top - S.css(r, "marginTop", !0),
                    left: t.left - i.left - S.css(r, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                var e = this.offsetParent;
                while (e && "static" === S.css(e, "position"))
                    e = e.offsetParent;
                return e || re
            })
        }
    }),
    S.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(t, i) {
        var o = "pageYOffset" === i;
        S.fn[t] = function(e) {
            return $(this, function(e, t, n) {
                var r;
                if (x(e) ? r = e : 9 === e.nodeType && (r = e.defaultView),
                void 0 === n)
                    return r ? r[i] : e[t];
                r ? r.scrollTo(o ? r.pageXOffset : n, o ? n : r.pageYOffset) : e[t] = n
            }, t, e, arguments.length)
        }
    }),
    S.each(["top", "left"], function(e, n) {
        S.cssHooks[n] = Fe(y.pixelPosition, function(e, t) {
            if (t)
                return t = We(e, n),
                Pe.test(t) ? S(e).position()[n] + "px" : t
        })
    }),
    S.each({
        Height: "height",
        Width: "width"
    }, function(a, s) {
        S.each({
            padding: "inner" + a,
            content: s,
            "": "outer" + a
        }, function(r, o) {
            S.fn[o] = function(e, t) {
                var n = arguments.length && (r || "boolean" != typeof e)
                  , i = r || (!0 === e || !0 === t ? "margin" : "border");
                return $(this, function(e, t, n) {
                    var r;
                    return x(e) ? 0 === o.indexOf("outer") ? e["inner" + a] : e.document.documentElement["client" + a] : 9 === e.nodeType ? (r = e.documentElement,
                    Math.max(e.body["scroll" + a], r["scroll" + a], e.body["offset" + a], r["offset" + a], r["client" + a])) : void 0 === n ? S.css(e, t, i) : S.style(e, t, n, i)
                }, s, n ? e : void 0, n)
            }
        })
    }),
    S.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
        S.fn[t] = function(e) {
            return this.on(t, e)
        }
    }),
    S.fn.extend({
        bind: function(e, t, n) {
            return this.on(e, null, t, n)
        },
        unbind: function(e, t) {
            return this.off(e, null, t)
        },
        delegate: function(e, t, n, r) {
            return this.on(t, e, n, r)
        },
        undelegate: function(e, t, n) {
            return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
        },
        hover: function(e, t) {
            return this.mouseenter(e).mouseleave(t || e)
        }
    }),
    S.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function(e, n) {
        S.fn[n] = function(e, t) {
            return 0 < arguments.length ? this.on(n, null, e, t) : this.trigger(n)
        }
    });
    var Xt = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    S.proxy = function(e, t) {
        var n, r, i;
        if ("string" == typeof t && (n = e[t],
        t = e,
        e = n),
        m(e))
            return r = s.call(arguments, 2),
            (i = function() {
                return e.apply(t || this, r.concat(s.call(arguments)))
            }
            ).guid = e.guid = e.guid || S.guid++,
            i
    }
    ,
    S.holdReady = function(e) {
        e ? S.readyWait++ : S.ready(!0)
    }
    ,
    S.isArray = Array.isArray,
    S.parseJSON = JSON.parse,
    S.nodeName = A,
    S.isFunction = m,
    S.isWindow = x,
    S.camelCase = X,
    S.type = w,
    S.now = Date.now,
    S.isNumeric = function(e) {
        var t = S.type(e);
        return ("number" === t || "string" === t) && !isNaN(e - parseFloat(e))
    }
    ,
    S.trim = function(e) {
        return null == e ? "" : (e + "").replace(Xt, "")
    }
    ,
    "function" == typeof define && define.amd && define("jquery", [], function() {
        return S
    });
    var Vt = C.jQuery
      , Gt = C.$;
    return S.noConflict = function(e) {
        return C.$ === S && (C.$ = Gt),
        e && C.jQuery === S && (C.jQuery = Vt),
        S
    }
    ,
    "undefined" == typeof e && (C.jQuery = C.$ = S),
    S
});


/*! For license information please see abdn-design-system-site.js.LICENSE.txt */
( () => {
    var e = {
        1079: () => {
            var e = function(e, t) {
                "use strict";
                var i = {
                    q: function(e, i) {
                        return (i = i || t).querySelectorAll(e)
                    },
                    each: function(e, t) {
                        var i, o = e.length;
                        for (i = 0; i < o; i++)
                            t.call(this, i, e[i])
                    },
                    html: function(e) {
                        var i = t.createElement("div");
                        i.innerHTML = e;
                        var o = i.firstChild;
                        return o
                    },
                    toggleClass: function(e, t) {
                        if (e.classList)
                            e.classList.toggle(t);
                        else {
                            var i = e.className.split(" ")
                              , o = i.indexOf(t);
                            o >= 0 ? i.splice(o, 1) : i.push(t),
                            e.className = i.join(" ")
                        }
                    },
                    slugify: function(e) {
                        return e.toString().toLowerCase().replace(/\s+/g, "_").replace(/[^\w\_]+/g, "")
                    }
                }
                  , o = function(t, o, s) {
                    this.nav = t,
                    this.list = this.getListItemsHTML(this.nav),
                    this.listArray = this.listArray || [],
                    this.moreButton = o.moreButton,
                    this.moreButtonClass = o.moreButtonClass,
                    this.moreDropdownClass = o.moreDropdownClass,
                    this.uid = s;
                    var n = this;
                    return this.listArray.length || i.each(n.list, (function(e, t) {
                        n.listArray.push({
                            html: t.cloneNode(!0),
                            width: t.offsetWidth
                        })
                    }
                    )),
                    this.draw(),
                    function(t) {
                        e.addEventListener("resize", (function() {
                            t.draw()
                        }
                        ))
                    }(this),
                    this
                };
                o.prototype.getMoreBtnHTML = function(e) {
                    return i.q(".priority_plus_more", e)[0]
                }
                ,
                o.prototype.getListItemsHTML = function(e) {
                    return i.q("li", e)
                }
                ,
                o.prototype.getMoreListHTML = function(e) {
                    return i.q(".more_list", e)[0]
                }
                ,
                o.prototype.draw = function() {
                    var e, t, o, s, n = 0, a = [];
                    t = this.nav,
                    i.each(this.listArray, (function(e, t) {
                        n += t.width
                    }
                    )),
                    t.appendChild(i.html(this.moreButton));
                    var r = this.getMoreBtnHTML(t).offsetWidth;
                    t.removeChild(this.getMoreBtnHTML(t)),
                    e = this.getListItemsHTML(t),
                    i.each(e, (function(e, i) {
                        t.removeChild(i)
                    }
                    ));
                    var l = 0
                      , d = t.offsetWidth;
                    if (i.each(this.listArray, (function(e, i) {
                        l += i.width,
                        n >= d && l >= d - r - 5 ? a.push(i) : t.appendChild(i.html)
                    }
                    )),
                    !(n < d)) {
                        t.appendChild(i.html(this.moreButton)),
                        (o = this.getMoreBtnHTML(t)).appendChild(i.html('<ul class="more_list"></ul>')),
                        s = this.getMoreListHTML(t),
                        i.each(a, (function(e, t) {
                            s.appendChild(t.html)
                        }
                        ));
                        var c = i.q("." + this.moreButtonClass + ">a", t)[0];
                        s.setAttribute("id", "priority_list_" + this.uid),
                        c.setAttribute("aria-controls", "priority_list_" + this.uid),
                        c.setAttribute("aria-label", "Toggle display of more links"),
                        c.setAttribute("aria-expanded", "false"),
                        s.setAttribute("aria-hidden", "true");
                        c.onclick = function(e) {
                            i.toggleClass(o, "active"),
                            "true" === c.getAttribute("aria-expanded") ? (c.setAttribute("aria-expanded", "false"),
                            s.setAttribute("aria-hidden", "true")) : (c.setAttribute("aria-expanded", "true"),
                            s.setAttribute("aria-hidden", "false")),
                            e.preventDefault()
                        }
                    }
                }
                ;
                return function(e) {
                    var t, s, n = e || {};
                    this.selector = n.selector,
                    (s = {}).moreButtonClass = n.moreButtonClass || "priority_plus_more",
                    s.moreDropdownClass = n.moreButtonClass || "more_list",
                    s.moreButtonContent = n.moreButtonContent || '<a href="#"><b>More &#8964;</b></a>',
                    s.moreButton = '<li class="' + s.moreButtonClass + '">' + s.moreButtonContent + "</li>",
                    t = i.q(this.selector),
                    i.each(t, (function(e, t) {
                        var a = i.slugify(n.selector);
                        new o(t,s,a)
                    }
                    ))
                }
            }(window, document);
            window.PriorityPlusList = e
        }
        ,
        1669: e => {
            "use strict";
            e.exports = jQuery
        }
        ,
        1880: (e, t, o) => {
            function s(e) {
                $("#ccc").css("z-index", 2147483647),
                $(".section-nav-toggle").attr("aria-expanded", "false"),
                $("#section-nav").off("transitionend"),
                $("#section-nav").removeClass("active"),
                setTimeout((function() {
                    $(".section-nav-wrapper").removeClass("active"),
                    $("body").removeClass("section-nav-open"),
                    $("#top").removeClass("section-nav-open"),
                    $("main").removeClass("section-nav-open"),
                    n(),
                    e && $(".section-nav-toggle").focus()
                }
                ), 600)
            }
            function n() {
                $(".section-nav nav .clone").remove(),
                $(".section-nav nav .cloned").removeClass("animation-slide-in-right animation-slide-in-left cloned");
                var e = document.querySelectorAll(".section-nav nav .active");
                for (i = 0; i < e.length; i++)
                    e[i].classList.remove("active");
                var t = document.querySelectorAll(".section-nav nav [data-original-class]");
                for (i = 0; i < t.length; i++)
                    t[i].className = t[i].dataset.originalClass
            }
            var a, r, l, d;
            o(1079),
            window.hideSectionNav = s,
            $(document).ready((function() {
                if ("querySelector"in document && "addEventListener"in window) {
                    window.innerWidth <= 940 && (document.querySelector(".section-nav nav").classList.toggle("no-js"),
                    document.querySelector(".section-nav nav").classList.toggle("has-js"));
                    var e = document.querySelectorAll(".section-nav nav a");
                    for (i = 0; i < e.length; i++) {
                        if (0 == i && e[i].addEventListener("keydown", (function(e) {
                            document.querySelector(".section-nav nav").classList.contains("has-js") && this.classList.contains("active") && e.shiftKey && "Tab" == e.key && (e.preventDefault(),
                            document.querySelector(".section-nav-toggle").focus())
                        }
                        )),
                        e[i].parentNode.getElementsByTagName("ul").length) {
                            e[i].classList.add("has-subpages"),
                            (t = document.createElement("button")).className = "section-nav-expander",
                            (o = document.createElement("span")).className = "offscreen";
                            var t, o, c = document.createTextNode("Show submenu for " + e[i].innerText);
                            o.appendChild(c),
                            t.appendChild(o),
                            $(e[i]).wrap("<div></div>").parent().addClass("navigation-link"),
                            e[i].parentNode.insertBefore(t, e[i].nextElementSibling),
                            t.addEventListener("click", (function() {
                                $button = $(this),
                                $targetUl = $button.closest("ul"),
                                $targetUl.wrap("<div></div>"),
                                $animationWrapper = $targetUl.parent(),
                                $animationWrapper.addClass("animation-wrapper"),
                                $clone = $targetUl.clone(!0),
                                $clone.addClass("clone"),
                                $animationWrapper.prepend($clone),
                                $targetUl.addClass("cloned"),
                                $button.closest("li").addClass("active"),
                                $(".section-nav nav a.current").removeClass("current"),
                                $animationWrapper.addClass("animation-slide-out-left"),
                                $animationWrapper.on("animationend", (function() {
                                    $clone.remove(),
                                    $targetUl.unwrap(),
                                    $targetUl.removeClass("cloned")
                                }
                                ))
                            }
                            )),
                            (t = document.createElement("button")).className = "section-nav-collapser",
                            (o = document.createElement("span")).className = "offscreen";
                            c = document.createTextNode("Show full submenu for " + e[i].innerText);
                            o.appendChild(c),
                            t.appendChild(o),
                            e[i].parentNode.insertBefore(t, e[i]),
                            e[i].classList.contains("current") && t.classList.add("current"),
                            t.addEventListener("click", (function() {
                                $button = $(this),
                                $targetUl = $button.closest("ul"),
                                $targetUl.wrap("<div></div>"),
                                $animationWrapper = $targetUl.parent(),
                                $animationWrapper.addClass("animation-wrapper"),
                                $clone = $targetUl.clone(!0),
                                $clone.addClass("clone"),
                                $animationWrapper.append($clone),
                                $targetUl.addClass("cloned"),
                                $targetUl.find("li.active").removeClass("active"),
                                $button.closest("li").addClass("active"),
                                $(".section-nav nav a.current").removeClass("current"),
                                $animationWrapper.addClass("animation-slide-in-left"),
                                $animationWrapper.on("animationend", (function() {
                                    $clone.remove(),
                                    $targetUl.unwrap(),
                                    $targetUl.removeClass("cloned")
                                }
                                ))
                            }
                            ))
                        }
                        e[i].classList.contains("active-with-siblings") && e[i].parentNode.parentNode.parentNode.children[0].classList.add("current")
                    }
                    var p = document.querySelectorAll(".section-nav nav [class]");
                    for (i = 0; i < p.length; i++)
                        p[i].dataset.originalClass = p[i].className;
                    window.innerWidth <= 940 && (a = document.querySelector(".section-nav > nav > ul"),
                    r = document.querySelector(".section-nav > nav > ul > li > ul > li"),
                    l = document.querySelector(".section-nav > nav > ul > li"),
                    a.append(r),
                    d = a.removeChild(l));
                    var u = (h = function() {
                        var e = document.querySelector(".section-nav nav");
                        window.innerWidth <= 940 ? (e.classList.contains("no-js") && (a = document.querySelector(".section-nav > nav > ul"),
                        r = document.querySelector(".section-nav > nav > ul > li > ul > li"),
                        l = document.querySelector(".section-nav > nav > ul > li"),
                        a.append(r),
                        d = a.removeChild(l)),
                        e.classList.add("has-js"),
                        e.classList.remove("no-js")) : (n(),
                        e.classList.contains("has-js") && (a = document.querySelector(".section-nav > nav > ul"),
                        r = document.querySelector(".section-nav > nav > ul > li"),
                        temp_current_section_nav = a.removeChild(r),
                        a.appendChild(d),
                        document.querySelector(".section-nav > nav > ul > li > ul").append(temp_current_section_nav)),
                        e.classList.add("no-js"),
                        e.classList.remove("has-js"))
                    }
                    ,
                    f = 125,
                    function() {
                        var e = this
                          , t = arguments
                          , i = v && !g;
                        clearTimeout(g),
                        g = setTimeout((function() {
                            g = null,
                            v || h.apply(e, t)
                        }
                        ), f),
                        i && h.apply(e, t)
                    }
                    );
                    window.addEventListener("resize", u)
                }
                var h, f, v, g;
                $(".section-nav-wrapper").addClass("can-toggle"),
                $(".section-nav-toggle").attr("aria-controls", "section-nav"),
                $(".section-nav-toggle").attr("aria-expanded", "false"),
                $(".section-nav-toggle").click((function(e) {
                    e.preventDefault(),
                    section_nav_expanded = $(".section-nav-toggle").attr("aria-expanded"),
                    section_nav_expanded = "false" == section_nav_expanded ? "true" : "false",
                    "true" == section_nav_expanded ? (showModalOverlay(),
                    $("#ccc").css("z-index", 0),
                    $("body").addClass("section-nav-open"),
                    $("#top").addClass("section-nav-open"),
                    $("main").addClass("section-nav-open"),
                    $(".section-nav-toggle").attr("aria-expanded", "true"),
                    $("#section-nav").off("transitionend"),
                    $(".section-nav-wrapper").addClass("active"),
                    setTimeout((function() {
                        $("#section-nav").addClass("active");
                        var e = document.querySelector(".section-nav-toggle-wrapper").getBoundingClientRect().bottom;
                        $(".section-nav-wrapper").css({
                            top: e
                        })
                    }
                    ), 10),
                    $("#section-nav").on("keyup", (function(e) {
                        27 == e.which && (hideModalOverlay(),
                        s(!0))
                    }
                    )),
                    $("#section-nav").find("button, [href]").first().on("keydown", (function(e) {
                        9 == e.which && e.shiftKey && (e.preventDefault(),
                        $(".section-nav-toggle").focus())
                    }
                    ))) : (s(!0),
                    hideModalOverlay())
                }
                )),
                $(".section-nav-toggle").on("keydown", (function(e) {
                    9 == e.which && $("#section-nav").hasClass("active") && (e.preventDefault(),
                    $("#section-nav").find("button, [href]").filter(":visible:first").focus()),
                    27 == e.which && (hideModalOverlay(),
                    s(!0))
                }
                ))
            }
            ))
        }
        ,
        2703: (e, t, i) => {
            var o, s, n;
            !function() {
                "use strict";
                s = [i(1669)],
                void 0 === (n = "function" == typeof (o = function(e) {
                    var t, i, o = {
                        interval: 100,
                        sensitivity: 7,
                        timeout: 800
                    }, s = 0, n = function(e) {
                        t = e.pageX,
                        i = e.pageY
                    }, a = function e(o, s, a, r) {
                        if (Math.sqrt((a.pX - t) * (a.pX - t) + (a.pY - i) * (a.pY - i)) < r.sensitivity)
                            return s.off(a.event, n),
                            delete a.timeoutId,
                            a.isActive = !0,
                            o.pageX = t,
                            o.pageY = i,
                            delete a.pX,
                            delete a.pY,
                            r.over.apply(s[0], [o]);
                        a.pX = t,
                        a.pY = i,
                        a.timeoutId = setTimeout((function() {
                            e(o, s, a, r)
                        }
                        ), r.interval)
                    }, r = function(e, t, i, o) {
                        return delete t.data("hoverIntent")[i.id],
                        o.apply(t[0], [e])
                    };
                    e.fn.hoverIntent = function(t, i, l) {
                        var d = s++
                          , c = e.extend({}, o);
                        e.isPlainObject(t) ? (c = e.extend(c, t),
                        e.isFunction(c.out) || (c.out = c.over)) : c = e.isFunction(i) ? e.extend(c, {
                            over: t,
                            out: i,
                            selector: l
                        }) : e.extend(c, {
                            over: t,
                            out: t,
                            selector: i
                        });
                        var p = function(t) {
                            var i = e.extend({}, t)
                              , o = e(this)
                              , s = o.data("hoverIntent");
                            s || o.data("hoverIntent", s = {});
                            var l = s[d];
                            l || (s[d] = l = {
                                id: d
                            }),
                            l.timeoutId && (l.timeoutId = clearTimeout(l.timeoutId));
                            var p = l.event = "mousemove.hoverIntent.hoverIntent" + d;
                            if ("mouseenter" === t.type) {
                                if (l.isActive)
                                    return;
                                l.pX = i.pageX,
                                l.pY = i.pageY,
                                o.off(p, n).on(p, n),
                                l.timeoutId = setTimeout((function() {
                                    a(i, o, l, c)
                                }
                                ), c.interval)
                            } else {
                                if (!l.isActive)
                                    return;
                                o.off(p, n),
                                l.timeoutId = setTimeout((function() {
                                    r(i, o, l, c.out)
                                }
                                ), c.timeout)
                            }
                        };
                        return this.on({
                            "mouseenter.hoverIntent": p,
                            "mouseleave.hoverIntent": p
                        }, c.selector)
                    }
                }
                ) ? o.apply(t, s) : o) || (e.exports = n)
            }()
        }
        ,
        2992: () => {
            $(document).ready((function() {
                document.querySelector("#global_alert .alert-message p") && (document.querySelector("#global_alert .alert-message p").innerHTML += " ")
            }
            ))
        }
        ,
        3768: () => {
            window.abdnDesignSystem = window.abdnDesignSystem || {},
            window.abdnDesignSystem.search = window.abdnDesignSystem.search || {
                collection: "abdn~sp-meta-all",
                suggestionURL: "https://abdn-search.funnelback.squiz.cloud/s/suggest.json"
            },
            window.abdnDesignSystem.translations = window.abdnDesignSystem.translations || {
                unexpectedError: "An unexpected error occurred, please try again later.",
                validationFailed: "There has been a problem with your submission. Errors are highlighted below."
            },
            jQuery && jQuery.extend(jQuery.expr[":"], {
                focusable: function(e, t, i) {
                    return $(e).is('button, [href], input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])')
                }
            })
        }
        ,
        4143: () => {
            $(document).ready((function() {
                $('iframe[src*="kaltura.com"], iframe[src*="youtube.com"], iframe[src*="vimeo.com"], iframe[src*="prezi.com"], iframe[src*="panopto.eu"], div[class="kWidgetIframeContainer"]').each((function() {
                    var e = $(this);
                    if (e.removeAttr("style"),
                    e.hasClass("kWidgetIframeContainer"))
                        return e.removeClass("kWidgetIframeContainer"),
                        void e.addClass("video_container");
                    var t = e.attr("src");
                    t.indexOf("http:") > -1 && (t = t.replace("http:", "https:")),
                    t.indexOf("cdnapi.kaltura") > -1 && (t = t.replace("cdnapi.kaltura", "cdnapisec.kaltura")),
                    e.attr("src").match(/playlistAPI/) ? e.css("width", "100%") : (e.parent().hasClass("video_container") || e.parent().parent().hasClass("homepage_video_container") || e.wrap('<div class="video_container"></div>'),
                    t.indexOf("youtube") > -1 && (t.indexOf("rel=") > -1 ? t = t.replace(/rel=[1-9]/, "rel=0") : (-1 === t.indexOf("?") ? t += "?" : t += "&",
                    t += "rel=0")),
                    e.attr("src", t))
                }
                ))
            }
            ))
        }
        ,
        4210: () => {
            function e() {
                $(window).width() < 920 ? $(".facet_toggle_wrapper").length ? $(".facet_toggle_wrapper").hasClass("active") || ($(".facet_wrapper").append($(".search_refine")),
                $(".search_related").addClass("full"),
                $(".search_refine h2").addClass("offscreen"),
                $(".facet_toggle_wrapper").addClass("active")) : function() {
                    if ($(window).width() <= 940) {
                        var e = $('<div class="facet_toggle_wrapper active"></div>');
                        $("#search-result-count").before(e);
                        var t = $('<div id="facet_wrapper" class="facet_wrapper collapsed" style="display: none;"></div>');
                        e.append(t);
                        var i = $('<button class="facet_toggle" aria-controls="facet_wrapper" aria-expanded="false">Refine your search</button>');
                        t.before(i),
                        i.click((function() {
                            t.hasClass("collapsed") ? (t.removeClass("collapsed"),
                            i.attr("aria-expanded", "true"),
                            t.slideDown()) : (t.slideUp(),
                            setTimeout((function() {
                                t.addClass("collapsed"),
                                i.attr("aria-expanded", "false")
                            }
                            ), 401))
                        }
                        )),
                        t.append($(".search_refine")),
                        $(".search_refine h2").addClass("offscreen"),
                        $(".search_related").addClass("full");
                        var o = $('<div class="facet_clear_wrapper clearfix"></div>')
                          , s = $("<dl></dl>")
                          , n = $("<dt>Your Active Filter</dt>")
                          , a = $('<dd class="facet_clear_label"></dd>')
                          , r = $('<a href="#" class="facet_clear">Clear</a>');
                        t.after(o),
                        o.append(s),
                        s.append(n),
                        s.append(a),
                        o.append(r);
                        var l = $(".search_refine a.flaticon-all").attr("href");
                        if (r.attr("href", l),
                        $(".selected_facet").length) {
                            var d = $("#search-result-count .selected_facet").text();
                            a.text(d),
                            o.addClass("active")
                        }
                    }
                }() : $(".facet_toggle_wrapper").hasClass("active") && ($(".search_related").before($(".search_refine")),
                $(".search_related").removeClass("full"),
                $(".search_refine h2").removeClass("offscreen"),
                $(".facet_toggle_wrapper").removeClass("active"))
            }
            $(document).ready((function() {
                e(),
                $(window).resize((function() {
                    e()
                }
                ))
            }
            )),
            $(window).on("load", (function() {
                $(".people_img img").each((function() {
                    $(this).width() > $(this).height() && $(this).parent().addClass("landscape")
                }
                ))
            }
            ))
        }
        ,
        4686: () => {
            $(document).ready((function() {
                $("table").each((function() {
                    $(this).wrap('<div class="responsive_table"></div>'),
                    $(this).css("table-layout", "auto"),
                    $(this).css("width", "100%")
                }
                ))
            }
            ))
        }
        ,
        5306: (e, t, i) => {
            i(5969);
            var o = !1
              , s = !0;
            function n(e) {
                var t = e.parent();
                if (0 == (i = t.find(".slideshow_controls_wrapper")).length)
                    var i = $(document.createElement("div")).addClass("slideshow_controls_wrapper").appendTo(t);
                e.hasClass("gallery_area") || i.addClass("offscreen");
                var o = $(document.createElement("div")).addClass("slideshow_stats").appendTo(i);
                if (e.hasClass("slick-slider"))
                    var s = e;
                else
                    s = e.find(".slider").eq(0);
                s.on("focus", "button", (function(e) {
                    o.attr("aria-live", "polite")
                }
                )),
                s.on("blur", "button", (function(e) {
                    o.removeAttr("aria-live")
                }
                )),
                s.on("init reInit afterChange", (function(e, t, i, s) {
                    var n = (i || 0) + 1;
                    o.text("Image " + n + " of " + t.slideCount)
                }
                ))
            }
            function a(e) {
                e.find("a.lightbox").magnificPopup({
                    type: "image",
                    tLoading: "Loading image #%curr%...",
                    mainClass: "mfp-img-mobile",
                    gallery: {
                        enabled: !0,
                        navigateByImgClick: !0
                    },
                    image: {
                        tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
                        titleSrc: function(e) {
                            return lightboxTitle = "",
                            e.el.attr("title") && e.el.attr("title").length > 0 && (lightboxTitle = '<span id="lightboxTitle">' + e.el.attr("title") + "</span>"),
                            lightboxDescription = "",
                            e.el.attr("data-caption") && e.el.attr("data-caption").length > 0 && (lightboxDescription = '<small id="lightboxDescription">' + e.el.attr("data-caption") + "</small>"),
                            lightboxTitle + lightboxDescription
                        }
                    }
                }),
                $(".slider a.lightbox").on("mfpOpen", (function(e) {
                    $(".mfp-content").attr("aria-live", "polite"),
                    $(".mfp-content").attr("role", "dialog"),
                    $(".mfp-content").attr("aria-labelledby", "lightboxTitle"),
                    $(".mfp-content").attr("aria-describedby", "lightboxDescription"),
                    $(".slider").slick("slickPause"),
                    $(".slider_nav").slick("slickPause"),
                    $(".slideshow_controls").html("Play")
                }
                ))
            }
            "ontouchstart"in document.documentElement && navigator.userAgent.match(/Mobi/) && (s = !1,
            o = !0),
            function() {
                function e(e) {
                    if (e.hasClass("slick_slideshow")) {
                        (c = e).removeClass("slick_not_loaded"),
                        c.on("init", (function(e, t) {
                            $(this).find(".slick-dots > li > button").addClass("slideshow_dot")
                        }
                        )),
                        c.on("beforeChange", (function(e, t, i, o) {
                            var s = t.instanceUid.toString()
                              , n = document.getElementById("slick-slide" + s + i.toString())
                              , a = document.getElementById("slick-slide" + s + o.toString());
                            $(n).find("iframe").attr("tabindex", "-1"),
                            $(a).find("iframe").attr("tabindex", "0")
                        }
                        )),
                        c.slick({
                            autoplay: s,
                            autoplaySpeed: 7e3,
                            dots: c.find("> article").length > 1,
                            fade: !0,
                            infinite: !0,
                            adaptiveHeight: !0,
                            speed: 500,
                            pauseOnFocus: !0,
                            accessibility: !0
                        }),
                        $(".slick_slideshow button").click((function() {
                            o = !0
                        }
                        )),
                        $(".slick_slideshow button").keypress((function(e) {
                            13 === e.keyCode && (c.slick("slickPause"),
                            o = !0)
                        }
                        )),
                        c.hover((function() {
                            c.slick("slickPause")
                        }
                        ), (function() {
                            o || c.slick("slickPlay")
                        }
                        )),
                        c.find("article").each((function() {
                            var e = $(this).find("iframe").attr("title");
                            $(this).find(".video_container").prepend('<a class="video_overlay" href="#">Play ' + e + "</a>"),
                            $(this).find(".video_overlay").css("z-index", "2").attr("tabindex", "-1"),
                            $(this).find("iframe").css("z-index", "1").attr("tabindex", "-1"),
                            $(this).find(".video_overlay").click((function(e) {
                                e.preventDefault(),
                                o = !0,
                                $(this).css("display", "none");
                                var t = $(this).next()
                                  , i = t.attr("src");
                                (i.indexOf("youtube") > -1 || i.indexOf("vimeo") > -1) && (-1 === i.indexOf("?") ? i += "?" : i += "&",
                                i += "autoplay=1"),
                                i.indexOf("kaltura") >= 0 && (i += "&flashvars[autoPlay]=true"),
                                t.attr("src", i)
                            }
                            ))
                        }
                        ));
                        var t = c.find("article .video_overlay");
                        $(t[0]).attr("tabindex", "0");
                        var i = c.find("article iframe");
                        $(i[0]).attr("tabindex", "0"),
                        n(c)
                    } else if (e.hasClass("slick_carousel") || e.hasClass("slick_gallery")) {
                        var r = 1100;
                        if ($(".full_width").length > 0)
                            r = 940;
                        (c = e).removeClass("slick_not_loaded"),
                        c.slick({
                            autoplay: !1,
                            autoplaySpeed: 3e3,
                            dots: e.find("> div").length > 1,
                            slidesToShow: 3,
                            slidesToScroll: 3,
                            speed: 500,
                            responsive: [{
                                breakpoint: 1240,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 3
                                }
                            }, {
                                breakpoint: r,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 2
                                }
                            }, {
                                breakpoint: 600,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1
                                }
                            }]
                        })
                    } else if (e.hasClass("gallery_area")) {
                        $current_gallery = e,
                        $current_gallery.attr("id", "gallery_" + increment),
                        (c = $current_gallery.find(".slider.slick_not_loaded")).removeClass("slick_not_loaded"),
                        $current_gallery.find(".slider_nav").css("display", "block");
                        var l = $current_gallery.parent()
                          , d = $(document.createElement("div")).addClass("slideshow_controls_wrapper").appendTo(l);
                        $(document.createElement("button")).addClass("slideshow_controls").html("Play").appendTo(d),
                        n($current_gallery),
                        $current_gallery.find(".slider_for").slick({
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            arrows: !1,
                            fade: !0,
                            adaptiveHeight: !1,
                            asNavFor: ".slider_nav"
                        }),
                        $current_gallery.find(".slider_nav").slick({
                            slidesToShow: $(".news_item").length > 0 || $(".syndicated_details").length > 0 ? 2 : 5,
                            slidesToScroll: 1,
                            asNavFor: ".slider_for",
                            centerMode: !0,
                            focusOnSelect: !0,
                            responsive: [{
                                breakpoint: 1200,
                                settings: {
                                    slidesToShow: 5
                                }
                            }, {
                                breakpoint: 940,
                                settings: {
                                    slidesToShow: $(".news_item").length > 0 || $(".syndicated_details").length > 0 ? 2 : 5
                                }
                            }, {
                                breakpoint: 800,
                                settings: {
                                    slidesToShow: 4
                                }
                            }, {
                                breakpoint: 600,
                                settings: {
                                    slidesToShow: 3
                                }
                            }, {
                                breakpoint: 500,
                                settings: {
                                    slidesToShow: 2
                                }
                            }, {
                                breakpoint: 300,
                                settings: {
                                    slidesToShow: 1
                                }
                            }]
                        }),
                        a($current_gallery),
                        function(e) {
                            var t = e.find(".slider_nav");
                            t.length > 0 && e.find(".slideshow_controls").click((function() {
                                "Play" == $(this).html() ? (t.slick("slickPlay"),
                                $(this).html("Pause")) : ($(this).html("Play"),
                                t.slick("slickPause"))
                            }
                            ))
                        }($current_gallery.parent()),
                        increment++
                    } else if (e.hasClass("hero_slider")) {
                        var c;
                        (c = e).removeClass("slick_not_loaded"),
                        c.on("init", (function(e, t) {
                            $(t.$slides.get(0)).addClass("animate")
                        }
                        )),
                        c.on("beforeChange", (function(e, t, i, o) {
                            $(t.$slides.get(o)).addClass("animate")
                        }
                        )),
                        c.on("afterChange", (function(e, t, i) {
                            $(t.$slider).find(".hero_slide.animate:not(.slick-current)").removeClass("animate")
                        }
                        )),
                        c.slick({
                            autoplay: !0,
                            autoplaySpeed: 7e3,
                            dots: c.find("> article").length > 1,
                            fade: !0,
                            infinite: !0,
                            adaptiveHeight: !0,
                            speed: 500,
                            responsive: [{
                                breakpoint: 780,
                                settings: {
                                    arrows: !1
                                }
                            }],
                            pauseOnHover: !1
                        }),
                        $(".hero_slider button").click((function() {
                            o = !0
                        }
                        )),
                        $(".hero_slider button").keypress((function(e) {
                            13 === e.keyCode && (c.slick("slickPause"),
                            o = !0)
                        }
                        )),
                        c.find(".hero_slide_content, .hero_slide_link, .slick-dots").hover((function() {
                            c.slick("slickPause")
                        }
                        ), (function() {
                            o || c.slick("slickPlay")
                        }
                        )),
                        n(c)
                    }
                }
                $(document).ready((function() {
                    jQuery().slick && (increment = 1,
                    $(".slick_slideshow").each((function(t) {
                        $(this).wrap("<div></div>"),
                        $(this).parent().attr("aria-label", "slideshow_" + increment),
                        e($(this)),
                        increment++
                    }
                    )),
                    $(".slick_carousel").each((function(t) {
                        e($(this)),
                        increment++
                    }
                    )),
                    ($(".slick_gallery").length || $(".gallery_area").length || $(".zoomable").length) && $.getScript("https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/jquery.magnific-popup.js", (function() {
                        $(".slick_gallery").each((function(t) {
                            e($(this)),
                            a($(this)),
                            increment++
                        }
                        )),
                        $(".gallery_area").each((function(t) {
                            e($(this)),
                            a($(this)),
                            increment++
                        }
                        )),
                        $(".zoomable").each((function(e) {
                            a($(this))
                        }
                        ))
                    }
                    )),
                    $(".slick_slideshow").length > 0 && ($(window).scroll((function() {
                        $(".slick_slideshow").each((function() {
                            $(window).scrollTop() > $(this).offset().top + $(this).height() ? $(this).slick("slickPause") : o || $(this).slick("slickPlay")
                        }
                        ))
                    }
                    )),
                    $(".slick_slideshow").each((function() {
                        $(window).scrollTop() > $(this).offset().top + $(this).height() ? $(this).slick("slickPause") : o || $(this).slick("slickPlay")
                    }
                    ))),
                    $(".hero_slider").length > 0 && ($(".hero_slider").each((function(t) {
                        $(this).wrap("<div></div>"),
                        $(this).parent().attr("aria-label", "slideshow_" + increment),
                        e($(this)),
                        increment++
                    }
                    )),
                    $(window).scroll((function() {
                        $(".hero_slider").each((function() {
                            $(window).scrollTop() > $(this).offset().top + $(this).height() ? $(this).slick("slickPause") : o || $(this).slick("slickPlay")
                        }
                        ))
                    }
                    ))))
                }
                ))
            }()
        }
        ,
        5969: (e, t, i) => {
            var o, s, n;
            !function() {
                "use strict";
                s = [i(1669)],
                o = function(e) {
                    var t = window.Slick || {};
                    (t = function() {
                        var t = 0;
                        return function(i, o) {
                            var s, n = this;
                            n.defaults = {
                                accessibility: !0,
                                adaptiveHeight: !1,
                                appendArrows: e(i),
                                appendDots: e(i),
                                arrows: !0,
                                asNavFor: null,
                                prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
                                nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
                                autoplay: !1,
                                autoplaySpeed: 3e3,
                                centerMode: !1,
                                centerPadding: "50px",
                                cssEase: "ease",
                                customPaging: function(t, i) {
                                    return e('<button type="button" />').text(i + 1)
                                },
                                dots: !1,
                                dotsClass: "slick-dots",
                                draggable: !0,
                                easing: "linear",
                                edgeFriction: .35,
                                fade: !1,
                                focusOnSelect: !1,
                                focusOnChange: !1,
                                infinite: !0,
                                initialSlide: 0,
                                lazyLoad: "ondemand",
                                mobileFirst: !1,
                                pauseOnHover: !0,
                                pauseOnFocus: !0,
                                pauseOnDotsHover: !1,
                                respondTo: "window",
                                responsive: null,
                                rows: 1,
                                rtl: !1,
                                slide: "",
                                slidesPerRow: 1,
                                slidesToShow: 1,
                                slidesToScroll: 1,
                                speed: 500,
                                swipe: !0,
                                swipeToSlide: !1,
                                touchMove: !0,
                                touchThreshold: 5,
                                useCSS: !0,
                                useTransform: !0,
                                variableWidth: !1,
                                vertical: !1,
                                verticalSwiping: !1,
                                waitForAnimate: !0,
                                zIndex: 1e3
                            },
                            n.initials = {
                                animating: !1,
                                dragging: !1,
                                autoPlayTimer: null,
                                currentDirection: 0,
                                currentLeft: null,
                                currentSlide: 0,
                                direction: 1,
                                $dots: null,
                                listWidth: null,
                                listHeight: null,
                                loadIndex: 0,
                                $nextArrow: null,
                                $prevArrow: null,
                                scrolling: !1,
                                slideCount: null,
                                slideWidth: null,
                                $slideTrack: null,
                                $slides: null,
                                sliding: !1,
                                slideOffset: 0,
                                swipeLeft: null,
                                swiping: !1,
                                $list: null,
                                touchObject: {},
                                transformsEnabled: !1,
                                unslicked: !1
                            },
                            e.extend(n, n.initials),
                            n.activeBreakpoint = null,
                            n.animType = null,
                            n.animProp = null,
                            n.breakpoints = [],
                            n.breakpointSettings = [],
                            n.cssTransitions = !1,
                            n.focussed = !1,
                            n.interrupted = !1,
                            n.hidden = "hidden",
                            n.paused = !0,
                            n.positionProp = null,
                            n.respondTo = null,
                            n.rowCount = 1,
                            n.shouldClick = !0,
                            n.$slider = e(i),
                            n.$slidesCache = null,
                            n.transformType = null,
                            n.transitionType = null,
                            n.visibilityChange = "visibilitychange",
                            n.windowWidth = 0,
                            n.windowTimer = null,
                            s = e(i).data("slick") || {},
                            n.options = e.extend({}, n.defaults, o, s),
                            n.currentSlide = n.options.initialSlide,
                            n.originalSettings = n.options,
                            void 0 !== document.mozHidden ? (n.hidden = "mozHidden",
                            n.visibilityChange = "mozvisibilitychange") : void 0 !== document.webkitHidden && (n.hidden = "webkitHidden",
                            n.visibilityChange = "webkitvisibilitychange"),
                            n.autoPlay = e.proxy(n.autoPlay, n),
                            n.autoPlayClear = e.proxy(n.autoPlayClear, n),
                            n.autoPlayIterator = e.proxy(n.autoPlayIterator, n),
                            n.changeSlide = e.proxy(n.changeSlide, n),
                            n.clickHandler = e.proxy(n.clickHandler, n),
                            n.selectHandler = e.proxy(n.selectHandler, n),
                            n.setPosition = e.proxy(n.setPosition, n),
                            n.swipeHandler = e.proxy(n.swipeHandler, n),
                            n.dragHandler = e.proxy(n.dragHandler, n),
                            n.keyHandler = e.proxy(n.keyHandler, n),
                            n.instanceUid = t++,
                            n.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/,
                            n.registerBreakpoints(),
                            n.init(!0)
                        }
                    }()).prototype.activateADA = function() {
                        this.$slideTrack.find(".slick-active").attr({
                            "aria-hidden": "false"
                        }).find("a, input, button, select").attr({
                            tabindex: "0"
                        })
                    }
                    ,
                    t.prototype.addSlide = t.prototype.slickAdd = function(t, i, o) {
                        var s = this;
                        if ("boolean" == typeof i)
                            o = i,
                            i = null;
                        else if (i < 0 || i >= s.slideCount)
                            return !1;
                        s.unload(),
                        "number" == typeof i ? 0 === i && 0 === s.$slides.length ? e(t).appendTo(s.$slideTrack) : o ? e(t).insertBefore(s.$slides.eq(i)) : e(t).insertAfter(s.$slides.eq(i)) : !0 === o ? e(t).prependTo(s.$slideTrack) : e(t).appendTo(s.$slideTrack),
                        s.$slides = s.$slideTrack.children(this.options.slide),
                        s.$slideTrack.children(this.options.slide).detach(),
                        s.$slideTrack.append(s.$slides),
                        s.$slides.each((function(t, i) {
                            e(i).attr("data-slick-index", t)
                        }
                        )),
                        s.$slidesCache = s.$slides,
                        s.reinit()
                    }
                    ,
                    t.prototype.animateHeight = function() {
                        var e = this;
                        if (1 === e.options.slidesToShow && !0 === e.options.adaptiveHeight && !1 === e.options.vertical) {
                            var t = e.$slides.eq(e.currentSlide).outerHeight(!0);
                            e.$list.animate({
                                height: t
                            }, e.options.speed)
                        }
                    }
                    ,
                    t.prototype.animateSlide = function(t, i) {
                        var o = {}
                          , s = this;
                        s.animateHeight(),
                        !0 === s.options.rtl && !1 === s.options.vertical && (t = -t),
                        !1 === s.transformsEnabled ? !1 === s.options.vertical ? s.$slideTrack.animate({
                            left: t
                        }, s.options.speed, s.options.easing, i) : s.$slideTrack.animate({
                            top: t
                        }, s.options.speed, s.options.easing, i) : !1 === s.cssTransitions ? (!0 === s.options.rtl && (s.currentLeft = -s.currentLeft),
                        e({
                            animStart: s.currentLeft
                        }).animate({
                            animStart: t
                        }, {
                            duration: s.options.speed,
                            easing: s.options.easing,
                            step: function(e) {
                                e = Math.ceil(e),
                                !1 === s.options.vertical ? (o[s.animType] = "translate(" + e + "px, 0px)",
                                s.$slideTrack.css(o)) : (o[s.animType] = "translate(0px," + e + "px)",
                                s.$slideTrack.css(o))
                            },
                            complete: function() {
                                i && i.call()
                            }
                        })) : (s.applyTransition(),
                        t = Math.ceil(t),
                        !1 === s.options.vertical ? o[s.animType] = "translate3d(" + t + "px, 0px, 0px)" : o[s.animType] = "translate3d(0px," + t + "px, 0px)",
                        s.$slideTrack.css(o),
                        i && setTimeout((function() {
                            s.disableTransition(),
                            i.call()
                        }
                        ), s.options.speed))
                    }
                    ,
                    t.prototype.getNavTarget = function() {
                        var t = this
                          , i = t.options.asNavFor;
                        return i && null !== i && (i = e(i).not(t.$slider)),
                        i
                    }
                    ,
                    t.prototype.asNavFor = function(t) {
                        var i = this.getNavTarget();
                        null !== i && "object" == typeof i && i.each((function() {
                            var i = e(this).slick("getSlick");
                            i.unslicked || i.slideHandler(t, !0)
                        }
                        ))
                    }
                    ,
                    t.prototype.applyTransition = function(e) {
                        var t = this
                          , i = {};
                        !1 === t.options.fade ? i[t.transitionType] = t.transformType + " " + t.options.speed + "ms " + t.options.cssEase : i[t.transitionType] = "opacity " + t.options.speed + "ms " + t.options.cssEase,
                        !1 === t.options.fade ? t.$slideTrack.css(i) : t.$slides.eq(e).css(i)
                    }
                    ,
                    t.prototype.autoPlay = function() {
                        var e = this;
                        e.autoPlayClear(),
                        e.slideCount > e.options.slidesToShow && (e.autoPlayTimer = setInterval(e.autoPlayIterator, e.options.autoplaySpeed))
                    }
                    ,
                    t.prototype.autoPlayClear = function() {
                        var e = this;
                        e.autoPlayTimer && clearInterval(e.autoPlayTimer)
                    }
                    ,
                    t.prototype.autoPlayIterator = function() {
                        var e = this
                          , t = e.currentSlide + e.options.slidesToScroll;
                        e.paused || e.interrupted || e.focussed || (!1 === e.options.infinite && (1 === e.direction && e.currentSlide + 1 === e.slideCount - 1 ? e.direction = 0 : 0 === e.direction && (t = e.currentSlide - e.options.slidesToScroll,
                        e.currentSlide - 1 == 0 && (e.direction = 1))),
                        e.slideHandler(t))
                    }
                    ,
                    t.prototype.buildArrows = function() {
                        var t = this;
                        !0 === t.options.arrows && (t.$prevArrow = e(t.options.prevArrow).addClass("slick-arrow"),
                        t.$nextArrow = e(t.options.nextArrow).addClass("slick-arrow"),
                        t.slideCount > t.options.slidesToShow ? (t.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),
                        t.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),
                        t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.prependTo(t.options.appendArrows),
                        t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.appendTo(t.options.appendArrows),
                        !0 !== t.options.infinite && t.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : t.$prevArrow.add(t.$nextArrow).addClass("slick-hidden").attr({
                            "aria-disabled": "true",
                            tabindex: "-1"
                        }))
                    }
                    ,
                    t.prototype.buildDots = function() {
                        var t, i, o = this;
                        if (!0 === o.options.dots) {
                            for (o.$slider.addClass("slick-dotted"),
                            i = e("<ul />").addClass(o.options.dotsClass),
                            t = 0; t <= o.getDotCount(); t += 1)
                                i.append(e("<li />").append(o.options.customPaging.call(this, o, t)));
                            o.$dots = i.appendTo(o.options.appendDots),
                            o.$dots.find("li").first().addClass("slick-active")
                        }
                    }
                    ,
                    t.prototype.buildOut = function() {
                        var t = this;
                        t.$slides = t.$slider.children(t.options.slide + ":not(.slick-cloned)").addClass("slick-slide"),
                        t.slideCount = t.$slides.length,
                        t.$slides.each((function(t, i) {
                            e(i).attr("data-slick-index", t).data("originalStyling", e(i).attr("style") || "")
                        }
                        )),
                        t.$slider.addClass("slick-slider"),
                        t.$slideTrack = 0 === t.slideCount ? e('<div class="slick-track"/>').appendTo(t.$slider) : t.$slides.wrapAll('<div class="slick-track"/>').parent(),
                        t.$list = t.$slideTrack.wrap('<div class="slick-list"/>').parent(),
                        t.$slideTrack.css("opacity", 0),
                        !0 !== t.options.centerMode && !0 !== t.options.swipeToSlide || (t.options.slidesToScroll = 1),
                        e("img[data-lazy]", t.$slider).not("[src]").addClass("slick-loading"),
                        t.setupInfinite(),
                        t.buildArrows(),
                        t.buildDots(),
                        t.updateDots(),
                        t.setSlideClasses("number" == typeof t.currentSlide ? t.currentSlide : 0),
                        !0 === t.options.draggable && t.$list.addClass("draggable")
                    }
                    ,
                    t.prototype.buildRows = function() {
                        var e, t, i, o, s, n, a, r = this;
                        if (o = document.createDocumentFragment(),
                        n = r.$slider.children(),
                        r.options.rows > 1) {
                            for (a = r.options.slidesPerRow * r.options.rows,
                            s = Math.ceil(n.length / a),
                            e = 0; e < s; e++) {
                                var l = document.createElement("div");
                                for (t = 0; t < r.options.rows; t++) {
                                    var d = document.createElement("div");
                                    for (i = 0; i < r.options.slidesPerRow; i++) {
                                        var c = e * a + (t * r.options.slidesPerRow + i);
                                        n.get(c) && d.appendChild(n.get(c))
                                    }
                                    l.appendChild(d)
                                }
                                o.appendChild(l)
                            }
                            r.$slider.empty().append(o),
                            r.$slider.children().children().children().css({
                                width: 100 / r.options.slidesPerRow + "%",
                                display: "inline-block"
                            })
                        }
                    }
                    ,
                    t.prototype.checkResponsive = function(t, i) {
                        var o, s, n, a = this, r = !1, l = a.$slider.width(), d = window.innerWidth || e(window).width();
                        if ("window" === a.respondTo ? n = d : "slider" === a.respondTo ? n = l : "min" === a.respondTo && (n = Math.min(d, l)),
                        a.options.responsive && a.options.responsive.length && null !== a.options.responsive) {
                            for (o in s = null,
                            a.breakpoints)
                                a.breakpoints.hasOwnProperty(o) && (!1 === a.originalSettings.mobileFirst ? n < a.breakpoints[o] && (s = a.breakpoints[o]) : n > a.breakpoints[o] && (s = a.breakpoints[o]));
                            null !== s ? null !== a.activeBreakpoint ? (s !== a.activeBreakpoint || i) && (a.activeBreakpoint = s,
                            "unslick" === a.breakpointSettings[s] ? a.unslick(s) : (a.options = e.extend({}, a.originalSettings, a.breakpointSettings[s]),
                            !0 === t && (a.currentSlide = a.options.initialSlide),
                            a.refresh(t)),
                            r = s) : (a.activeBreakpoint = s,
                            "unslick" === a.breakpointSettings[s] ? a.unslick(s) : (a.options = e.extend({}, a.originalSettings, a.breakpointSettings[s]),
                            !0 === t && (a.currentSlide = a.options.initialSlide),
                            a.refresh(t)),
                            r = s) : null !== a.activeBreakpoint && (a.activeBreakpoint = null,
                            a.options = a.originalSettings,
                            !0 === t && (a.currentSlide = a.options.initialSlide),
                            a.refresh(t),
                            r = s),
                            t || !1 === r || a.$slider.trigger("breakpoint", [a, r])
                        }
                    }
                    ,
                    t.prototype.changeSlide = function(t, i) {
                        var o, s, n = this, a = e(t.currentTarget);
                        switch (a.is("a") && t.preventDefault(),
                        a.is("li") || (a = a.closest("li")),
                        o = n.slideCount % n.options.slidesToScroll != 0 ? 0 : (n.slideCount - n.currentSlide) % n.options.slidesToScroll,
                        t.data.message) {
                        case "previous":
                            s = 0 === o ? n.options.slidesToScroll : n.options.slidesToShow - o,
                            n.slideCount > n.options.slidesToShow && n.slideHandler(n.currentSlide - s, !1, i);
                            break;
                        case "next":
                            s = 0 === o ? n.options.slidesToScroll : o,
                            n.slideCount > n.options.slidesToShow && n.slideHandler(n.currentSlide + s, !1, i);
                            break;
                        case "index":
                            var r = 0 === t.data.index ? 0 : t.data.index || a.index() * n.options.slidesToScroll;
                            n.slideHandler(n.checkNavigable(r), !1, i),
                            a.children().trigger("focus");
                            break;
                        default:
                            return
                        }
                    }
                    ,
                    t.prototype.checkNavigable = function(e) {
                        var t, i;
                        if (i = 0,
                        e > (t = this.getNavigableIndexes())[t.length - 1])
                            e = t[t.length - 1];
                        else
                            for (var o in t) {
                                if (e < t[o]) {
                                    e = i;
                                    break
                                }
                                i = t[o]
                            }
                        return e
                    }
                    ,
                    t.prototype.cleanUpEvents = function() {
                        var t = this;
                        t.options.dots && null !== t.$dots && (e("li", t.$dots).off("click.slick", t.changeSlide).off("mouseenter.slick", e.proxy(t.interrupt, t, !0)).off("mouseleave.slick", e.proxy(t.interrupt, t, !1)),
                        !0 === t.options.accessibility && t.$dots.off("keydown.slick", t.keyHandler)),
                        t.$slider.off("focus.slick blur.slick"),
                        !0 === t.options.arrows && t.slideCount > t.options.slidesToShow && (t.$prevArrow && t.$prevArrow.off("click.slick", t.changeSlide),
                        t.$nextArrow && t.$nextArrow.off("click.slick", t.changeSlide),
                        !0 === t.options.accessibility && (t.$prevArrow && t.$prevArrow.off("keydown.slick", t.keyHandler),
                        t.$nextArrow && t.$nextArrow.off("keydown.slick", t.keyHandler))),
                        t.$list.off("touchstart.slick mousedown.slick", t.swipeHandler),
                        t.$list.off("touchmove.slick mousemove.slick", t.swipeHandler),
                        t.$list.off("touchend.slick mouseup.slick", t.swipeHandler),
                        t.$list.off("touchcancel.slick mouseleave.slick", t.swipeHandler),
                        t.$list.off("click.slick", t.clickHandler),
                        e(document).off(t.visibilityChange, t.visibility),
                        t.cleanUpSlideEvents(),
                        !0 === t.options.accessibility && t.$list.off("keydown.slick", t.keyHandler),
                        !0 === t.options.focusOnSelect && e(t.$slideTrack).children().off("click.slick", t.selectHandler),
                        e(window).off("orientationchange.slick.slick-" + t.instanceUid, t.orientationChange),
                        e(window).off("resize.slick.slick-" + t.instanceUid, t.resize),
                        e("[draggable!=true]", t.$slideTrack).off("dragstart", t.preventDefault),
                        e(window).off("load.slick.slick-" + t.instanceUid, t.setPosition)
                    }
                    ,
                    t.prototype.cleanUpSlideEvents = function() {
                        var t = this;
                        t.$list.off("mouseenter.slick", e.proxy(t.interrupt, t, !0)),
                        t.$list.off("mouseleave.slick", e.proxy(t.interrupt, t, !1))
                    }
                    ,
                    t.prototype.cleanUpRows = function() {
                        var e, t = this;
                        t.options.rows > 1 && ((e = t.$slides.children().children()).removeAttr("style"),
                        t.$slider.empty().append(e))
                    }
                    ,
                    t.prototype.clickHandler = function(e) {
                        !1 === this.shouldClick && (e.stopImmediatePropagation(),
                        e.stopPropagation(),
                        e.preventDefault())
                    }
                    ,
                    t.prototype.destroy = function(t) {
                        var i = this;
                        i.autoPlayClear(),
                        i.touchObject = {},
                        i.cleanUpEvents(),
                        e(".slick-cloned", i.$slider).detach(),
                        i.$dots && i.$dots.remove(),
                        i.$prevArrow && i.$prevArrow.length && (i.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""),
                        i.htmlExpr.test(i.options.prevArrow) && i.$prevArrow.remove()),
                        i.$nextArrow && i.$nextArrow.length && (i.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""),
                        i.htmlExpr.test(i.options.nextArrow) && i.$nextArrow.remove()),
                        i.$slides && (i.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each((function() {
                            e(this).attr("style", e(this).data("originalStyling"))
                        }
                        )),
                        i.$slideTrack.children(this.options.slide).detach(),
                        i.$slideTrack.detach(),
                        i.$list.detach(),
                        i.$slider.append(i.$slides)),
                        i.cleanUpRows(),
                        i.$slider.removeClass("slick-slider"),
                        i.$slider.removeClass("slick-initialized"),
                        i.$slider.removeClass("slick-dotted"),
                        i.unslicked = !0,
                        t || i.$slider.trigger("destroy", [i])
                    }
                    ,
                    t.prototype.disableTransition = function(e) {
                        var t = this
                          , i = {};
                        i[t.transitionType] = "",
                        !1 === t.options.fade ? t.$slideTrack.css(i) : t.$slides.eq(e).css(i)
                    }
                    ,
                    t.prototype.fadeSlide = function(e, t) {
                        var i = this;
                        !1 === i.cssTransitions ? (i.$slides.eq(e).css({
                            zIndex: i.options.zIndex
                        }),
                        i.$slides.eq(e).animate({
                            opacity: 1
                        }, i.options.speed, i.options.easing, t)) : (i.applyTransition(e),
                        i.$slides.eq(e).css({
                            opacity: 1,
                            zIndex: i.options.zIndex
                        }),
                        t && setTimeout((function() {
                            i.disableTransition(e),
                            t.call()
                        }
                        ), i.options.speed))
                    }
                    ,
                    t.prototype.fadeSlideOut = function(e) {
                        var t = this;
                        !1 === t.cssTransitions ? t.$slides.eq(e).animate({
                            opacity: 0,
                            zIndex: t.options.zIndex - 2
                        }, t.options.speed, t.options.easing) : (t.applyTransition(e),
                        t.$slides.eq(e).css({
                            opacity: 0,
                            zIndex: t.options.zIndex - 2
                        }))
                    }
                    ,
                    t.prototype.filterSlides = t.prototype.slickFilter = function(e) {
                        var t = this;
                        null !== e && (t.$slidesCache = t.$slides,
                        t.unload(),
                        t.$slideTrack.children(this.options.slide).detach(),
                        t.$slidesCache.filter(e).appendTo(t.$slideTrack),
                        t.reinit())
                    }
                    ,
                    t.prototype.focusHandler = function() {
                        var t = this;
                        t.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick", "*", (function(i) {
                            i.stopImmediatePropagation();
                            var o = e(this);
                            setTimeout((function() {
                                t.options.pauseOnFocus && (t.focussed = o.is(":focus"),
                                t.autoPlay())
                            }
                            ), 0)
                        }
                        ))
                    }
                    ,
                    t.prototype.getCurrent = t.prototype.slickCurrentSlide = function() {
                        return this.currentSlide
                    }
                    ,
                    t.prototype.getDotCount = function() {
                        var e = this
                          , t = 0
                          , i = 0
                          , o = 0;
                        if (!0 === e.options.infinite)
                            if (e.slideCount <= e.options.slidesToShow)
                                ++o;
                            else
                                for (; t < e.slideCount; )
                                    ++o,
                                    t = i + e.options.slidesToScroll,
                                    i += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
                        else if (!0 === e.options.centerMode)
                            o = e.slideCount;
                        else if (e.options.asNavFor)
                            for (; t < e.slideCount; )
                                ++o,
                                t = i + e.options.slidesToScroll,
                                i += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
                        else
                            o = 1 + Math.ceil((e.slideCount - e.options.slidesToShow) / e.options.slidesToScroll);
                        return o - 1
                    }
                    ,
                    t.prototype.getLeft = function(e) {
                        var t, i, o, s, n = this, a = 0;
                        return n.slideOffset = 0,
                        i = n.$slides.first().outerHeight(!0),
                        !0 === n.options.infinite ? (n.slideCount > n.options.slidesToShow && (n.slideOffset = n.slideWidth * n.options.slidesToShow * -1,
                        s = -1,
                        !0 === n.options.vertical && !0 === n.options.centerMode && (2 === n.options.slidesToShow ? s = -1.5 : 1 === n.options.slidesToShow && (s = -2)),
                        a = i * n.options.slidesToShow * s),
                        n.slideCount % n.options.slidesToScroll != 0 && e + n.options.slidesToScroll > n.slideCount && n.slideCount > n.options.slidesToShow && (e > n.slideCount ? (n.slideOffset = (n.options.slidesToShow - (e - n.slideCount)) * n.slideWidth * -1,
                        a = (n.options.slidesToShow - (e - n.slideCount)) * i * -1) : (n.slideOffset = n.slideCount % n.options.slidesToScroll * n.slideWidth * -1,
                        a = n.slideCount % n.options.slidesToScroll * i * -1))) : e + n.options.slidesToShow > n.slideCount && (n.slideOffset = (e + n.options.slidesToShow - n.slideCount) * n.slideWidth,
                        a = (e + n.options.slidesToShow - n.slideCount) * i),
                        n.slideCount <= n.options.slidesToShow && (n.slideOffset = 0,
                        a = 0),
                        !0 === n.options.centerMode && n.slideCount <= n.options.slidesToShow ? n.slideOffset = n.slideWidth * Math.floor(n.options.slidesToShow) / 2 - n.slideWidth * n.slideCount / 2 : !0 === n.options.centerMode && !0 === n.options.infinite ? n.slideOffset += n.slideWidth * Math.floor(n.options.slidesToShow / 2) - n.slideWidth : !0 === n.options.centerMode && (n.slideOffset = 0,
                        n.slideOffset += n.slideWidth * Math.floor(n.options.slidesToShow / 2)),
                        t = !1 === n.options.vertical ? e * n.slideWidth * -1 + n.slideOffset : e * i * -1 + a,
                        !0 === n.options.variableWidth && (o = n.slideCount <= n.options.slidesToShow || !1 === n.options.infinite ? n.$slideTrack.children(".slick-slide").eq(e) : n.$slideTrack.children(".slick-slide").eq(e + n.options.slidesToShow),
                        t = !0 === n.options.rtl ? o[0] ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width()) : 0 : o[0] ? -1 * o[0].offsetLeft : 0,
                        !0 === n.options.centerMode && (o = n.slideCount <= n.options.slidesToShow || !1 === n.options.infinite ? n.$slideTrack.children(".slick-slide").eq(e) : n.$slideTrack.children(".slick-slide").eq(e + n.options.slidesToShow + 1),
                        t = !0 === n.options.rtl ? o[0] ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width()) : 0 : o[0] ? -1 * o[0].offsetLeft : 0,
                        t += (n.$list.width() - o.outerWidth()) / 2)),
                        t
                    }
                    ,
                    t.prototype.getOption = t.prototype.slickGetOption = function(e) {
                        return this.options[e]
                    }
                    ,
                    t.prototype.getNavigableIndexes = function() {
                        var e, t = this, i = 0, o = 0, s = [];
                        for (!1 === t.options.infinite ? e = t.slideCount : (i = -1 * t.options.slidesToScroll,
                        o = -1 * t.options.slidesToScroll,
                        e = 2 * t.slideCount); i < e; )
                            s.push(i),
                            i = o + t.options.slidesToScroll,
                            o += t.options.slidesToScroll <= t.options.slidesToShow ? t.options.slidesToScroll : t.options.slidesToShow;
                        return s
                    }
                    ,
                    t.prototype.getSlick = function() {
                        return this
                    }
                    ,
                    t.prototype.getSlideCount = function() {
                        var t, i, o = this;
                        return i = !0 === o.options.centerMode ? o.slideWidth * Math.floor(o.options.slidesToShow / 2) : 0,
                        !0 === o.options.swipeToSlide ? (o.$slideTrack.find(".slick-slide").each((function(s, n) {
                            if (n.offsetLeft - i + e(n).outerWidth() / 2 > -1 * o.swipeLeft)
                                return t = n,
                                !1
                        }
                        )),
                        Math.abs(e(t).attr("data-slick-index") - o.currentSlide) || 1) : o.options.slidesToScroll
                    }
                    ,
                    t.prototype.goTo = t.prototype.slickGoTo = function(e, t) {
                        this.changeSlide({
                            data: {
                                message: "index",
                                index: parseInt(e)
                            }
                        }, t)
                    }
                    ,
                    t.prototype.init = function(t) {
                        var i = this;
                        e(i.$slider).hasClass("slick-initialized") || (e(i.$slider).addClass("slick-initialized"),
                        i.buildRows(),
                        i.buildOut(),
                        i.setProps(),
                        i.startLoad(),
                        i.loadSlider(),
                        i.initializeEvents(),
                        i.updateArrows(),
                        i.updateDots(),
                        i.checkResponsive(!0),
                        i.focusHandler()),
                        t && i.$slider.trigger("init", [i]),
                        !0 === i.options.accessibility && i.initADA(),
                        i.options.autoplay && (i.paused = !1,
                        i.autoPlay())
                    }
                    ,
                    t.prototype.initADA = function() {
                        var t = this
                          , i = Math.ceil(t.slideCount / t.options.slidesToShow)
                          , o = t.getNavigableIndexes().filter((function(e) {
                            return e >= 0 && e < t.slideCount
                        }
                        ));
                        t.$slides.add(t.$slideTrack.find(".slick-cloned")).attr({
                            "aria-hidden": "true",
                            tabindex: "-1"
                        }).find("a, input, button, select").attr({
                            tabindex: "-1"
                        }),
                        null !== t.$dots && (t.$slides.not(t.$slideTrack.find(".slick-cloned")).each((function(i) {
                            var s = o.indexOf(i);
                            e(this).attr({
                                role: "tabpanel",
                                id: "slick-slide" + t.instanceUid + i,
                                tabindex: -1
                            }),
                            -1 !== s && e(this).attr({
                                "aria-describedby": "slick-slide-control" + t.instanceUid + s
                            })
                        }
                        )),
                        t.$dots.attr("role", "tablist").find("li").each((function(s) {
                            var n = o[s];
                            e(this).attr({
                                role: "presentation"
                            }),
                            e(this).find("button").first().attr({
                                role: "tab",
                                id: "slick-slide-control" + t.instanceUid + s,
                                "aria-controls": "slick-slide" + t.instanceUid + n,
                                "aria-label": s + 1 + " of " + i,
                                "aria-selected": null,
                                tabindex: "-1"
                            })
                        }
                        )).eq(t.currentSlide).find("button").attr({
                            "aria-selected": "true",
                            tabindex: "0"
                        }).end());
                        for (var s = t.currentSlide, n = s + t.options.slidesToShow; s < n; s++)
                            t.$slides.eq(s).attr("tabindex", 0);
                        t.activateADA()
                    }
                    ,
                    t.prototype.initArrowEvents = function() {
                        var e = this;
                        !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow.off("click.slick").on("click.slick", {
                            message: "previous"
                        }, e.changeSlide),
                        e.$nextArrow.off("click.slick").on("click.slick", {
                            message: "next"
                        }, e.changeSlide),
                        !0 === e.options.accessibility && (e.$prevArrow.on("keydown.slick", e.keyHandler),
                        e.$nextArrow.on("keydown.slick", e.keyHandler)))
                    }
                    ,
                    t.prototype.initDotEvents = function() {
                        var t = this;
                        !0 === t.options.dots && (e("li", t.$dots).on("click.slick", {
                            message: "index"
                        }, t.changeSlide),
                        !0 === t.options.accessibility && t.$dots.on("keydown.slick", t.keyHandler)),
                        !0 === t.options.dots && !0 === t.options.pauseOnDotsHover && e("li", t.$dots).on("mouseenter.slick", e.proxy(t.interrupt, t, !0)).on("mouseleave.slick", e.proxy(t.interrupt, t, !1))
                    }
                    ,
                    t.prototype.initSlideEvents = function() {
                        var t = this;
                        t.options.pauseOnHover && (t.$list.on("mouseenter.slick", e.proxy(t.interrupt, t, !0)),
                        t.$list.on("mouseleave.slick", e.proxy(t.interrupt, t, !1)))
                    }
                    ,
                    t.prototype.initializeEvents = function() {
                        var t = this;
                        t.initArrowEvents(),
                        t.initDotEvents(),
                        t.initSlideEvents(),
                        t.$list.on("touchstart.slick mousedown.slick", {
                            action: "start"
                        }, t.swipeHandler),
                        t.$list.on("touchmove.slick mousemove.slick", {
                            action: "move"
                        }, t.swipeHandler),
                        t.$list.on("touchend.slick mouseup.slick", {
                            action: "end"
                        }, t.swipeHandler),
                        t.$list.on("touchcancel.slick mouseleave.slick", {
                            action: "end"
                        }, t.swipeHandler),
                        t.$list.on("click.slick", t.clickHandler),
                        e(document).on(t.visibilityChange, e.proxy(t.visibility, t)),
                        !0 === t.options.accessibility && t.$list.on("keydown.slick", t.keyHandler),
                        !0 === t.options.focusOnSelect && e(t.$slideTrack).children().on("click.slick", t.selectHandler),
                        e(window).on("orientationchange.slick.slick-" + t.instanceUid, e.proxy(t.orientationChange, t)),
                        e(window).on("resize.slick.slick-" + t.instanceUid, e.proxy(t.resize, t)),
                        e("[draggable!=true]", t.$slideTrack).on("dragstart", t.preventDefault),
                        e(window).on("load.slick.slick-" + t.instanceUid, t.setPosition),
                        e(t.setPosition)
                    }
                    ,
                    t.prototype.initUI = function() {
                        var e = this;
                        !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow.show(),
                        e.$nextArrow.show()),
                        !0 === e.options.dots && e.slideCount > e.options.slidesToShow && e.$dots.show()
                    }
                    ,
                    t.prototype.keyHandler = function(e) {
                        var t = this;
                        e.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === e.keyCode && !0 === t.options.accessibility ? t.changeSlide({
                            data: {
                                message: !0 === t.options.rtl ? "next" : "previous"
                            }
                        }) : 39 === e.keyCode && !0 === t.options.accessibility && t.changeSlide({
                            data: {
                                message: !0 === t.options.rtl ? "previous" : "next"
                            }
                        }))
                    }
                    ,
                    t.prototype.lazyLoad = function() {
                        function t(t) {
                            e("img[data-lazy]", t).each((function() {
                                var t = e(this)
                                  , i = e(this).attr("data-lazy")
                                  , o = e(this).attr("data-srcset")
                                  , s = e(this).attr("data-sizes") || n.$slider.attr("data-sizes")
                                  , a = document.createElement("img");
                                a.onload = function() {
                                    t.animate({
                                        opacity: 0
                                    }, 100, (function() {
                                        o && (t.attr("srcset", o),
                                        s && t.attr("sizes", s)),
                                        t.attr("src", i).animate({
                                            opacity: 1
                                        }, 200, (function() {
                                            t.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")
                                        }
                                        )),
                                        n.$slider.trigger("lazyLoaded", [n, t, i])
                                    }
                                    ))
                                }
                                ,
                                a.onerror = function() {
                                    t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),
                                    n.$slider.trigger("lazyLoadError", [n, t, i])
                                }
                                ,
                                a.src = i
                            }
                            ))
                        }
                        var i, o, s, n = this;
                        if (!0 === n.options.centerMode ? !0 === n.options.infinite ? s = (o = n.currentSlide + (n.options.slidesToShow / 2 + 1)) + n.options.slidesToShow + 2 : (o = Math.max(0, n.currentSlide - (n.options.slidesToShow / 2 + 1)),
                        s = n.options.slidesToShow / 2 + 1 + 2 + n.currentSlide) : (o = n.options.infinite ? n.options.slidesToShow + n.currentSlide : n.currentSlide,
                        s = Math.ceil(o + n.options.slidesToShow),
                        !0 === n.options.fade && (o > 0 && o--,
                        s <= n.slideCount && s++)),
                        i = n.$slider.find(".slick-slide").slice(o, s),
                        "anticipated" === n.options.lazyLoad)
                            for (var a = o - 1, r = s, l = n.$slider.find(".slick-slide"), d = 0; d < n.options.slidesToScroll; d++)
                                a < 0 && (a = n.slideCount - 1),
                                i = (i = i.add(l.eq(a))).add(l.eq(r)),
                                a--,
                                r++;
                        t(i),
                        n.slideCount <= n.options.slidesToShow ? t(n.$slider.find(".slick-slide")) : n.currentSlide >= n.slideCount - n.options.slidesToShow ? t(n.$slider.find(".slick-cloned").slice(0, n.options.slidesToShow)) : 0 === n.currentSlide && t(n.$slider.find(".slick-cloned").slice(-1 * n.options.slidesToShow))
                    }
                    ,
                    t.prototype.loadSlider = function() {
                        var e = this;
                        e.setPosition(),
                        e.$slideTrack.css({
                            opacity: 1
                        }),
                        e.$slider.removeClass("slick-loading"),
                        e.initUI(),
                        "progressive" === e.options.lazyLoad && e.progressiveLazyLoad()
                    }
                    ,
                    t.prototype.next = t.prototype.slickNext = function() {
                        this.changeSlide({
                            data: {
                                message: "next"
                            }
                        })
                    }
                    ,
                    t.prototype.orientationChange = function() {
                        var e = this;
                        e.checkResponsive(),
                        e.setPosition()
                    }
                    ,
                    t.prototype.pause = t.prototype.slickPause = function() {
                        var e = this;
                        e.autoPlayClear(),
                        e.paused = !0
                    }
                    ,
                    t.prototype.play = t.prototype.slickPlay = function() {
                        var e = this;
                        e.autoPlay(),
                        e.options.autoplay = !0,
                        e.paused = !1,
                        e.focussed = !1,
                        e.interrupted = !1
                    }
                    ,
                    t.prototype.postSlide = function(t) {
                        var i = this;
                        i.unslicked || (i.$slider.trigger("afterChange", [i, t]),
                        i.animating = !1,
                        i.slideCount > i.options.slidesToShow && i.setPosition(),
                        i.swipeLeft = null,
                        i.options.autoplay && i.autoPlay(),
                        !0 === i.options.accessibility && (i.initADA(),
                        i.options.focusOnChange && e(i.$slides.get(i.currentSlide)).attr("tabindex", 0).focus()))
                    }
                    ,
                    t.prototype.prev = t.prototype.slickPrev = function() {
                        this.changeSlide({
                            data: {
                                message: "previous"
                            }
                        })
                    }
                    ,
                    t.prototype.preventDefault = function(e) {
                        e.preventDefault()
                    }
                    ,
                    t.prototype.progressiveLazyLoad = function(t) {
                        t = t || 1;
                        var i, o, s, n, a, r = this, l = e("img[data-lazy]", r.$slider);
                        l.length ? (i = l.first(),
                        o = i.attr("data-lazy"),
                        s = i.attr("data-srcset"),
                        n = i.attr("data-sizes") || r.$slider.attr("data-sizes"),
                        (a = document.createElement("img")).onload = function() {
                            s && (i.attr("srcset", s),
                            n && i.attr("sizes", n)),
                            i.attr("src", o).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"),
                            !0 === r.options.adaptiveHeight && r.setPosition(),
                            r.$slider.trigger("lazyLoaded", [r, i, o]),
                            r.progressiveLazyLoad()
                        }
                        ,
                        a.onerror = function() {
                            t < 3 ? setTimeout((function() {
                                r.progressiveLazyLoad(t + 1)
                            }
                            ), 500) : (i.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),
                            r.$slider.trigger("lazyLoadError", [r, i, o]),
                            r.progressiveLazyLoad())
                        }
                        ,
                        a.src = o) : r.$slider.trigger("allImagesLoaded", [r])
                    }
                    ,
                    t.prototype.refresh = function(t) {
                        var i, o, s = this;
                        o = s.slideCount - s.options.slidesToShow,
                        !s.options.infinite && s.currentSlide > o && (s.currentSlide = o),
                        s.slideCount <= s.options.slidesToShow && (s.currentSlide = 0),
                        i = s.currentSlide,
                        s.destroy(!0),
                        e.extend(s, s.initials, {
                            currentSlide: i
                        }),
                        s.init(),
                        t || s.changeSlide({
                            data: {
                                message: "index",
                                index: i
                            }
                        }, !1)
                    }
                    ,
                    t.prototype.registerBreakpoints = function() {
                        var t, i, o, s = this, n = s.options.responsive || null;
                        if ("array" === e.type(n) && n.length) {
                            for (t in s.respondTo = s.options.respondTo || "window",
                            n)
                                if (o = s.breakpoints.length - 1,
                                n.hasOwnProperty(t)) {
                                    for (i = n[t].breakpoint; o >= 0; )
                                        s.breakpoints[o] && s.breakpoints[o] === i && s.breakpoints.splice(o, 1),
                                        o--;
                                    s.breakpoints.push(i),
                                    s.breakpointSettings[i] = n[t].settings
                                }
                            s.breakpoints.sort((function(e, t) {
                                return s.options.mobileFirst ? e - t : t - e
                            }
                            ))
                        }
                    }
                    ,
                    t.prototype.reinit = function() {
                        var t = this;
                        t.$slides = t.$slideTrack.children(t.options.slide).addClass("slick-slide"),
                        t.slideCount = t.$slides.length,
                        t.currentSlide >= t.slideCount && 0 !== t.currentSlide && (t.currentSlide = t.currentSlide - t.options.slidesToScroll),
                        t.slideCount <= t.options.slidesToShow && (t.currentSlide = 0),
                        t.registerBreakpoints(),
                        t.setProps(),
                        t.setupInfinite(),
                        t.buildArrows(),
                        t.updateArrows(),
                        t.initArrowEvents(),
                        t.buildDots(),
                        t.updateDots(),
                        t.initDotEvents(),
                        t.cleanUpSlideEvents(),
                        t.initSlideEvents(),
                        t.checkResponsive(!1, !0),
                        !0 === t.options.focusOnSelect && e(t.$slideTrack).children().on("click.slick", t.selectHandler),
                        t.setSlideClasses("number" == typeof t.currentSlide ? t.currentSlide : 0),
                        t.setPosition(),
                        t.focusHandler(),
                        t.paused = !t.options.autoplay,
                        t.autoPlay(),
                        t.$slider.trigger("reInit", [t])
                    }
                    ,
                    t.prototype.resize = function() {
                        var t = this;
                        e(window).width() !== t.windowWidth && (clearTimeout(t.windowDelay),
                        t.windowDelay = window.setTimeout((function() {
                            t.windowWidth = e(window).width(),
                            t.checkResponsive(),
                            t.unslicked || t.setPosition()
                        }
                        ), 50))
                    }
                    ,
                    t.prototype.removeSlide = t.prototype.slickRemove = function(e, t, i) {
                        var o = this;
                        if (e = "boolean" == typeof e ? !0 === (t = e) ? 0 : o.slideCount - 1 : !0 === t ? --e : e,
                        o.slideCount < 1 || e < 0 || e > o.slideCount - 1)
                            return !1;
                        o.unload(),
                        !0 === i ? o.$slideTrack.children().remove() : o.$slideTrack.children(this.options.slide).eq(e).remove(),
                        o.$slides = o.$slideTrack.children(this.options.slide),
                        o.$slideTrack.children(this.options.slide).detach(),
                        o.$slideTrack.append(o.$slides),
                        o.$slidesCache = o.$slides,
                        o.reinit()
                    }
                    ,
                    t.prototype.setCSS = function(e) {
                        var t, i, o = this, s = {};
                        !0 === o.options.rtl && (e = -e),
                        t = "left" == o.positionProp ? Math.ceil(e) + "px" : "0px",
                        i = "top" == o.positionProp ? Math.ceil(e) + "px" : "0px",
                        s[o.positionProp] = e,
                        !1 === o.transformsEnabled ? o.$slideTrack.css(s) : (s = {},
                        !1 === o.cssTransitions ? (s[o.animType] = "translate(" + t + ", " + i + ")",
                        o.$slideTrack.css(s)) : (s[o.animType] = "translate3d(" + t + ", " + i + ", 0px)",
                        o.$slideTrack.css(s)))
                    }
                    ,
                    t.prototype.setDimensions = function() {
                        var e = this;
                        !1 === e.options.vertical ? !0 === e.options.centerMode && e.$list.css({
                            padding: "0px " + e.options.centerPadding
                        }) : (e.$list.height(e.$slides.first().outerHeight(!0) * e.options.slidesToShow),
                        !0 === e.options.centerMode && e.$list.css({
                            padding: e.options.centerPadding + " 0px"
                        })),
                        e.listWidth = e.$list.width(),
                        e.listHeight = e.$list.height(),
                        !1 === e.options.vertical && !1 === e.options.variableWidth ? (e.slideWidth = Math.ceil(e.listWidth / e.options.slidesToShow),
                        e.$slideTrack.width(Math.ceil(e.slideWidth * e.$slideTrack.children(".slick-slide").length))) : !0 === e.options.variableWidth ? e.$slideTrack.width(5e3 * e.slideCount) : (e.slideWidth = Math.ceil(e.listWidth),
                        e.$slideTrack.height(Math.ceil(e.$slides.first().outerHeight(!0) * e.$slideTrack.children(".slick-slide").length)));
                        var t = e.$slides.first().outerWidth(!0) - e.$slides.first().width();
                        !1 === e.options.variableWidth && e.$slideTrack.children(".slick-slide").width(e.slideWidth - t)
                    }
                    ,
                    t.prototype.setFade = function() {
                        var t, i = this;
                        i.$slides.each((function(o, s) {
                            t = i.slideWidth * o * -1,
                            !0 === i.options.rtl ? e(s).css({
                                position: "relative",
                                right: t,
                                top: 0,
                                zIndex: i.options.zIndex - 2,
                                opacity: 0
                            }) : e(s).css({
                                position: "relative",
                                left: t,
                                top: 0,
                                zIndex: i.options.zIndex - 2,
                                opacity: 0
                            })
                        }
                        )),
                        i.$slides.eq(i.currentSlide).css({
                            zIndex: i.options.zIndex - 1,
                            opacity: 1
                        })
                    }
                    ,
                    t.prototype.setHeight = function() {
                        var e = this;
                        if (1 === e.options.slidesToShow && !0 === e.options.adaptiveHeight && !1 === e.options.vertical) {
                            var t = e.$slides.eq(e.currentSlide).outerHeight(!0);
                            e.$list.css("height", t)
                        }
                    }
                    ,
                    t.prototype.setOption = t.prototype.slickSetOption = function() {
                        var t, i, o, s, n, a = this, r = !1;
                        if ("object" === e.type(arguments[0]) ? (o = arguments[0],
                        r = arguments[1],
                        n = "multiple") : "string" === e.type(arguments[0]) && (o = arguments[0],
                        s = arguments[1],
                        r = arguments[2],
                        "responsive" === arguments[0] && "array" === e.type(arguments[1]) ? n = "responsive" : void 0 !== arguments[1] && (n = "single")),
                        "single" === n)
                            a.options[o] = s;
                        else if ("multiple" === n)
                            e.each(o, (function(e, t) {
                                a.options[e] = t
                            }
                            ));
                        else if ("responsive" === n)
                            for (i in s)
                                if ("array" !== e.type(a.options.responsive))
                                    a.options.responsive = [s[i]];
                                else {
                                    for (t = a.options.responsive.length - 1; t >= 0; )
                                        a.options.responsive[t].breakpoint === s[i].breakpoint && a.options.responsive.splice(t, 1),
                                        t--;
                                    a.options.responsive.push(s[i])
                                }
                        r && (a.unload(),
                        a.reinit())
                    }
                    ,
                    t.prototype.setPosition = function() {
                        var e = this;
                        e.setDimensions(),
                        e.setHeight(),
                        !1 === e.options.fade ? e.setCSS(e.getLeft(e.currentSlide)) : e.setFade(),
                        e.$slider.trigger("setPosition", [e])
                    }
                    ,
                    t.prototype.setProps = function() {
                        var e = this
                          , t = document.body.style;
                        e.positionProp = !0 === e.options.vertical ? "top" : "left",
                        "top" === e.positionProp ? e.$slider.addClass("slick-vertical") : e.$slider.removeClass("slick-vertical"),
                        void 0 === t.WebkitTransition && void 0 === t.MozTransition && void 0 === t.msTransition || !0 === e.options.useCSS && (e.cssTransitions = !0),
                        e.options.fade && ("number" == typeof e.options.zIndex ? e.options.zIndex < 3 && (e.options.zIndex = 3) : e.options.zIndex = e.defaults.zIndex),
                        void 0 !== t.OTransform && (e.animType = "OTransform",
                        e.transformType = "-o-transform",
                        e.transitionType = "OTransition",
                        void 0 === t.perspectiveProperty && void 0 === t.webkitPerspective && (e.animType = !1)),
                        void 0 !== t.MozTransform && (e.animType = "MozTransform",
                        e.transformType = "-moz-transform",
                        e.transitionType = "MozTransition",
                        void 0 === t.perspectiveProperty && void 0 === t.MozPerspective && (e.animType = !1)),
                        void 0 !== t.webkitTransform && (e.animType = "webkitTransform",
                        e.transformType = "-webkit-transform",
                        e.transitionType = "webkitTransition",
                        void 0 === t.perspectiveProperty && void 0 === t.webkitPerspective && (e.animType = !1)),
                        void 0 !== t.msTransform && (e.animType = "msTransform",
                        e.transformType = "-ms-transform",
                        e.transitionType = "msTransition",
                        void 0 === t.msTransform && (e.animType = !1)),
                        void 0 !== t.transform && !1 !== e.animType && (e.animType = "transform",
                        e.transformType = "transform",
                        e.transitionType = "transition"),
                        e.transformsEnabled = e.options.useTransform && null !== e.animType && !1 !== e.animType
                    }
                    ,
                    t.prototype.setSlideClasses = function(e) {
                        var t, i, o, s, n = this;
                        if (i = n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true"),
                        n.$slides.eq(e).addClass("slick-current"),
                        !0 === n.options.centerMode) {
                            var a = n.options.slidesToShow % 2 == 0 ? 1 : 0;
                            t = Math.floor(n.options.slidesToShow / 2),
                            !0 === n.options.infinite && (e >= t && e <= n.slideCount - 1 - t ? n.$slides.slice(e - t + a, e + t + 1).addClass("slick-active").attr("aria-hidden", "false") : (o = n.options.slidesToShow + e,
                            i.slice(o - t + 1 + a, o + t + 2).addClass("slick-active").attr("aria-hidden", "false")),
                            0 === e ? i.eq(i.length - 1 - n.options.slidesToShow).addClass("slick-center") : e === n.slideCount - 1 && i.eq(n.options.slidesToShow).addClass("slick-center")),
                            n.$slides.eq(e).addClass("slick-center")
                        } else
                            e >= 0 && e <= n.slideCount - n.options.slidesToShow ? n.$slides.slice(e, e + n.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : i.length <= n.options.slidesToShow ? i.addClass("slick-active").attr("aria-hidden", "false") : (s = n.slideCount % n.options.slidesToShow,
                            o = !0 === n.options.infinite ? n.options.slidesToShow + e : e,
                            n.options.slidesToShow == n.options.slidesToScroll && n.slideCount - e < n.options.slidesToShow ? i.slice(o - (n.options.slidesToShow - s), o + s).addClass("slick-active").attr("aria-hidden", "false") : i.slice(o, o + n.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false"));
                        "ondemand" !== n.options.lazyLoad && "anticipated" !== n.options.lazyLoad || n.lazyLoad()
                    }
                    ,
                    t.prototype.setupInfinite = function() {
                        var t, i, o, s = this;
                        if (!0 === s.options.fade && (s.options.centerMode = !1),
                        !0 === s.options.infinite && !1 === s.options.fade && (i = null,
                        s.slideCount > s.options.slidesToShow)) {
                            for (o = !0 === s.options.centerMode ? s.options.slidesToShow + 1 : s.options.slidesToShow,
                            t = s.slideCount; t > s.slideCount - o; t -= 1)
                                i = t - 1,
                                e(s.$slides[i]).clone(!0).attr("id", "").attr("data-slick-index", i - s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");
                            for (t = 0; t < o + s.slideCount; t += 1)
                                i = t,
                                e(s.$slides[i]).clone(!0).attr("id", "").attr("data-slick-index", i + s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");
                            s.$slideTrack.find(".slick-cloned").find("[id]").each((function() {
                                e(this).attr("id", "")
                            }
                            ))
                        }
                    }
                    ,
                    t.prototype.interrupt = function(e) {
                        var t = this;
                        e || t.autoPlay(),
                        t.interrupted = e
                    }
                    ,
                    t.prototype.selectHandler = function(t) {
                        var i = this
                          , o = e(t.target).is(".slick-slide") ? e(t.target) : e(t.target).parents(".slick-slide")
                          , s = parseInt(o.attr("data-slick-index"));
                        s || (s = 0),
                        i.slideCount <= i.options.slidesToShow ? i.slideHandler(s, !1, !0) : i.slideHandler(s)
                    }
                    ,
                    t.prototype.slideHandler = function(e, t, i) {
                        var o, s, n, a, r, l = null, d = this;
                        if (t = t || !1,
                        !(!0 === d.animating && !0 === d.options.waitForAnimate || !0 === d.options.fade && d.currentSlide === e))
                            if (!1 === t && d.asNavFor(e),
                            o = e,
                            l = d.getLeft(o),
                            a = d.getLeft(d.currentSlide),
                            d.currentLeft = null === d.swipeLeft ? a : d.swipeLeft,
                            !1 === d.options.infinite && !1 === d.options.centerMode && (e < 0 || e > d.getDotCount() * d.options.slidesToScroll))
                                !1 === d.options.fade && (o = d.currentSlide,
                                !0 !== i ? d.animateSlide(a, (function() {
                                    d.postSlide(o)
                                }
                                )) : d.postSlide(o));
                            else if (!1 === d.options.infinite && !0 === d.options.centerMode && (e < 0 || e > d.slideCount - d.options.slidesToScroll))
                                !1 === d.options.fade && (o = d.currentSlide,
                                !0 !== i ? d.animateSlide(a, (function() {
                                    d.postSlide(o)
                                }
                                )) : d.postSlide(o));
                            else {
                                if (d.options.autoplay && clearInterval(d.autoPlayTimer),
                                s = o < 0 ? d.slideCount % d.options.slidesToScroll != 0 ? d.slideCount - d.slideCount % d.options.slidesToScroll : d.slideCount + o : o >= d.slideCount ? d.slideCount % d.options.slidesToScroll != 0 ? 0 : o - d.slideCount : o,
                                d.animating = !0,
                                d.$slider.trigger("beforeChange", [d, d.currentSlide, s]),
                                n = d.currentSlide,
                                d.currentSlide = s,
                                d.setSlideClasses(d.currentSlide),
                                d.options.asNavFor && (r = (r = d.getNavTarget()).slick("getSlick")).slideCount <= r.options.slidesToShow && r.setSlideClasses(d.currentSlide),
                                d.updateDots(),
                                d.updateArrows(),
                                !0 === d.options.fade)
                                    return !0 !== i ? (d.fadeSlideOut(n),
                                    d.fadeSlide(s, (function() {
                                        d.postSlide(s)
                                    }
                                    ))) : d.postSlide(s),
                                    void d.animateHeight();
                                !0 !== i ? d.animateSlide(l, (function() {
                                    d.postSlide(s)
                                }
                                )) : d.postSlide(s)
                            }
                    }
                    ,
                    t.prototype.startLoad = function() {
                        var e = this;
                        !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow.hide(),
                        e.$nextArrow.hide()),
                        !0 === e.options.dots && e.slideCount > e.options.slidesToShow && e.$dots.hide(),
                        e.$slider.addClass("slick-loading")
                    }
                    ,
                    t.prototype.swipeDirection = function() {
                        var e, t, i, o, s = this;
                        return e = s.touchObject.startX - s.touchObject.curX,
                        t = s.touchObject.startY - s.touchObject.curY,
                        i = Math.atan2(t, e),
                        (o = Math.round(180 * i / Math.PI)) < 0 && (o = 360 - Math.abs(o)),
                        o <= 45 && o >= 0 || o <= 360 && o >= 315 ? !1 === s.options.rtl ? "left" : "right" : o >= 135 && o <= 225 ? !1 === s.options.rtl ? "right" : "left" : !0 === s.options.verticalSwiping ? o >= 35 && o <= 135 ? "down" : "up" : "vertical"
                    }
                    ,
                    t.prototype.swipeEnd = function(e) {
                        var t, i, o = this;
                        if (o.dragging = !1,
                        o.swiping = !1,
                        o.scrolling)
                            return o.scrolling = !1,
                            !1;
                        if (o.interrupted = !1,
                        o.shouldClick = !(o.touchObject.swipeLength > 10),
                        void 0 === o.touchObject.curX)
                            return !1;
                        if (!0 === o.touchObject.edgeHit && o.$slider.trigger("edge", [o, o.swipeDirection()]),
                        o.touchObject.swipeLength >= o.touchObject.minSwipe) {
                            switch (i = o.swipeDirection()) {
                            case "left":
                            case "down":
                                t = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide + o.getSlideCount()) : o.currentSlide + o.getSlideCount(),
                                o.currentDirection = 0;
                                break;
                            case "right":
                            case "up":
                                t = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide - o.getSlideCount()) : o.currentSlide - o.getSlideCount(),
                                o.currentDirection = 1
                            }
                            "vertical" != i && (o.slideHandler(t),
                            o.touchObject = {},
                            o.$slider.trigger("swipe", [o, i]))
                        } else
                            o.touchObject.startX !== o.touchObject.curX && (o.slideHandler(o.currentSlide),
                            o.touchObject = {})
                    }
                    ,
                    t.prototype.swipeHandler = function(e) {
                        var t = this;
                        if (!(!1 === t.options.swipe || "ontouchend"in document && !1 === t.options.swipe || !1 === t.options.draggable && -1 !== e.type.indexOf("mouse")))
                            switch (t.touchObject.fingerCount = e.originalEvent && void 0 !== e.originalEvent.touches ? e.originalEvent.touches.length : 1,
                            t.touchObject.minSwipe = t.listWidth / t.options.touchThreshold,
                            !0 === t.options.verticalSwiping && (t.touchObject.minSwipe = t.listHeight / t.options.touchThreshold),
                            e.data.action) {
                            case "start":
                                t.swipeStart(e);
                                break;
                            case "move":
                                t.swipeMove(e);
                                break;
                            case "end":
                                t.swipeEnd(e)
                            }
                    }
                    ,
                    t.prototype.swipeMove = function(e) {
                        var t, i, o, s, n, a, r = this;
                        return n = void 0 !== e.originalEvent ? e.originalEvent.touches : null,
                        !(!r.dragging || r.scrolling || n && 1 !== n.length) && (t = r.getLeft(r.currentSlide),
                        r.touchObject.curX = void 0 !== n ? n[0].pageX : e.clientX,
                        r.touchObject.curY = void 0 !== n ? n[0].pageY : e.clientY,
                        r.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(r.touchObject.curX - r.touchObject.startX, 2))),
                        a = Math.round(Math.sqrt(Math.pow(r.touchObject.curY - r.touchObject.startY, 2))),
                        !r.options.verticalSwiping && !r.swiping && a > 4 ? (r.scrolling = !0,
                        !1) : (!0 === r.options.verticalSwiping && (r.touchObject.swipeLength = a),
                        i = r.swipeDirection(),
                        void 0 !== e.originalEvent && r.touchObject.swipeLength > 4 && (r.swiping = !0,
                        e.preventDefault()),
                        s = (!1 === r.options.rtl ? 1 : -1) * (r.touchObject.curX > r.touchObject.startX ? 1 : -1),
                        !0 === r.options.verticalSwiping && (s = r.touchObject.curY > r.touchObject.startY ? 1 : -1),
                        o = r.touchObject.swipeLength,
                        r.touchObject.edgeHit = !1,
                        !1 === r.options.infinite && (0 === r.currentSlide && "right" === i || r.currentSlide >= r.getDotCount() && "left" === i) && (o = r.touchObject.swipeLength * r.options.edgeFriction,
                        r.touchObject.edgeHit = !0),
                        !1 === r.options.vertical ? r.swipeLeft = t + o * s : r.swipeLeft = t + o * (r.$list.height() / r.listWidth) * s,
                        !0 === r.options.verticalSwiping && (r.swipeLeft = t + o * s),
                        !0 !== r.options.fade && !1 !== r.options.touchMove && (!0 === r.animating ? (r.swipeLeft = null,
                        !1) : void r.setCSS(r.swipeLeft))))
                    }
                    ,
                    t.prototype.swipeStart = function(e) {
                        var t, i = this;
                        if (i.interrupted = !0,
                        1 !== i.touchObject.fingerCount || i.slideCount <= i.options.slidesToShow)
                            return i.touchObject = {},
                            !1;
                        void 0 !== e.originalEvent && void 0 !== e.originalEvent.touches && (t = e.originalEvent.touches[0]),
                        i.touchObject.startX = i.touchObject.curX = void 0 !== t ? t.pageX : e.clientX,
                        i.touchObject.startY = i.touchObject.curY = void 0 !== t ? t.pageY : e.clientY,
                        i.dragging = !0
                    }
                    ,
                    t.prototype.unfilterSlides = t.prototype.slickUnfilter = function() {
                        var e = this;
                        null !== e.$slidesCache && (e.unload(),
                        e.$slideTrack.children(this.options.slide).detach(),
                        e.$slidesCache.appendTo(e.$slideTrack),
                        e.reinit())
                    }
                    ,
                    t.prototype.unload = function() {
                        var t = this;
                        e(".slick-cloned", t.$slider).remove(),
                        t.$dots && t.$dots.remove(),
                        t.$prevArrow && t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.remove(),
                        t.$nextArrow && t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.remove(),
                        t.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "")
                    }
                    ,
                    t.prototype.unslick = function(e) {
                        var t = this;
                        t.$slider.trigger("unslick", [t, e]),
                        t.destroy()
                    }
                    ,
                    t.prototype.updateArrows = function() {
                        var e = this;
                        Math.floor(e.options.slidesToShow / 2),
                        !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && !e.options.infinite && (e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"),
                        e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"),
                        0 === e.currentSlide ? (e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"),
                        e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : (e.currentSlide >= e.slideCount - e.options.slidesToShow && !1 === e.options.centerMode || e.currentSlide >= e.slideCount - 1 && !0 === e.options.centerMode) && (e.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"),
                        e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")))
                    }
                    ,
                    t.prototype.updateDots = function() {
                        var e = this;
                        null !== e.$dots && (e.$dots.find("li").removeClass("slick-active").end(),
                        e.$dots.find("li").eq(Math.floor(e.currentSlide / e.options.slidesToScroll)).addClass("slick-active"))
                    }
                    ,
                    t.prototype.visibility = function() {
                        var e = this;
                        e.options.autoplay && (document[e.hidden] ? e.interrupted = !0 : e.interrupted = !1)
                    }
                    ,
                    e.fn.slick = function() {
                        var e, i, o = this, s = arguments[0], n = Array.prototype.slice.call(arguments, 1), a = o.length;
                        for (e = 0; e < a; e++)
                            if ("object" == typeof s || void 0 === s ? o[e].slick = new t(o[e],s) : i = o[e].slick[s].apply(o[e].slick, n),
                            void 0 !== i)
                                return i;
                        return o
                    }
                }
                ,
                void 0 === (n = "function" == typeof o ? o.apply(t, s) : o) || (e.exports = n)
            }()
        }
        ,
        6150: (e, t, i) => {
            function o() {
                if (!document.getElementById("search_top_buffer")) {
                    var e = $("#global_search").find("select, input, button, a");
                    search_top_trap = e[1],
                    search_bottom_trap = e[e.length - 1];
                    $("#global_search").prepend('<div id="search_top_buffer" tabindex="0"></div>'),
                    $("#global_search").append('<div id="search_bottom_buffer" tabindex="0"></div>');
                    $("#search_top_buffer").focus((function() {
                        a(),
                        s(!0)
                    }
                    )),
                    $("#search_bottom_buffer").focus((function() {
                        a(),
                        s(!0)
                    }
                    ))
                }
                $(".uni_search_toggle").attr("aria-expanded", "true"),
                $("#global_search").addClass("active"),
                $("#global_search").slideDown(400, (function() {
                    search_top_trap.focus()
                }
                )),
                $("#global_search").keyup((function(e) {
                    27 == e.which && (a(),
                    s(!0))
                }
                )),
                $("#section_nav").hasClass("active") && hideSectionNav(!1)
            }
            function s(e) {
                $(".uni_search_toggle").attr("aria-expanded", "false"),
                $("#global_search").removeClass("active"),
                $("#global_search").slideUp(400, (function() {
                    e && $(".uni_search_toggle").focus()
                }
                ))
            }
            function n() {
                $("#modal_fade").addClass("active"),
                $("#modal_fade").click((function() {
                    a()
                }
                ))
            }
            function a() {
                $("#modal_fade").removeClass("active"),
                $("#modal_fade").off("click"),
                $("#section-nav").hasClass("active") && hideSectionNav(),
                $("#global_search").hasClass("active") && s()
            }
            i(2703),
            $(document).ready((function() {
                var e = $(".uni_menu>ul>li");
                if ("ontouchstart"in document.documentElement)
                    $(".uni_menu_close").click((function() {
                        return $(".uni_menu>ul>li.hover").removeClass("hover"),
                        !1
                    }
                    )),
                    e.each((function() {
                        var t = $(this);
                        this.addEventListener("touchstart", (function(i) {
                            1 !== i.touches.length || $("body").hasClass("global-nav-open") || (i.stopPropagation(),
                            t.hasClass("hover") || (i.target !== this && i.target.parentNode !== this || i.preventDefault(),
                            e.removeClass("hover"),
                            t.addClass("hover"),
                            document.addEventListener("touchstart", closeDropdown = function(e) {
                                function t(t) {
                                    return e.apply(this, arguments)
                                }
                                return t.toString = function() {
                                    return e.toString()
                                }
                                ,
                                t
                            }((function(e) {
                                e.stopPropagation(),
                                t.removeClass("hover"),
                                document.removeEventListener("touchstart", closeDropdown)
                            }
                            )))))
                        }
                        ), !1)
                    }
                    ));
                else {
                    $(".uni_menu_close a").css("display", "none");
                    var t = $(".uni_menu > ul > li > a.uni_menu_section_link");
                    t.each((function(i, o) {
                        var s = $(this);
                        this.addEventListener("focus", (function() {
                            e.removeClass("hover"),
                            s.parent().addClass("hover")
                        }
                        )),
                        this.addEventListener("keydown", (function(o) {
                            "ArrowRight" === o.key && (t[i + 1] ? (e.removeClass("hover"),
                            t[i + 1].focus()) : (e.removeClass("hover"),
                            $("#uni_search_toggle").focus())),
                            "ArrowLeft" === o.key && t[i - 1] && (e.removeClass("hover"),
                            t[i - 1].focus()),
                            o.shiftKey && "Tab" === o.key && s.parent().removeClass("hover")
                        }
                        ))
                    }
                    )),
                    $("#uni_search_toggle").on("focus", (function() {
                        e.removeClass("hover")
                    }
                    )),
                    $("#uni_menu > ul > li > a").each((function() {
                        var e = $(this).html().toLowerCase().replace(/(\&amp;)/g, "").replace(/\s/g, "");
                        $(this).parent().find("a").addClass("uni_menu_" + e)
                    }
                    ))
                }
                $(".uni_menu").hoverIntent({
                    over: function() {
                        $(this).addClass("hover")
                    },
                    out: function() {
                        $(this).removeClass("hover")
                    },
                    timeout: 400,
                    selector: "ul li"
                }),
                $(".uni_search_toggle").attr("aria-controls", "global_search"),
                $(".uni_search_toggle").attr("aria-expanded", "false");
                $(".uni_search_toggle").click((function(e) {
                    e.preventDefault(),
                    search_expanded = $(".uni_search_toggle").attr("aria-expanded"),
                    search_expanded = "false" == search_expanded ? "true" : "false",
                    "true" == search_expanded ? (n(),
                    o()) : (s(!0),
                    a())
                }
                ));
                var i = []
                  , r = null;
                $global_nav = $(".uni_menu"),
                $global_nav_button = $('[aria-controls="uni_menu"]'),
                i.push($global_nav.attr("id")),
                $global_nav.find("> ul > li").each((function() {
                    null != $(this).attr("id") && i.push($(this).attr("id"))
                }
                )),
                $global_nav_internal_buttons = $global_nav.find('a[href^="#"]').filter((function(e, t) {
                    return i.includes($(t).attr("href").replace("#", ""))
                }
                )),
                $global_nav_button.on("click", (function(e) {
                    e.preventDefault(),
                    hideSectionNav(),
                    a(),
                    $("body").addClass("global-nav-open"),
                    $global_nav.addClass("animating animation-slide-in-right"),
                    $global_nav.on("animationend", (function() {
                        document.location.replace($global_nav_button.attr("href")),
                        $global_nav.removeClass("animating animation-slide-in-right"),
                        $global_nav.off("animationend")
                    }
                    ))
                }
                )),
                $global_nav.find(".close_button").on("click", (function(e) {
                    e.preventDefault(),
                    $target = $(document.location.hash),
                    $target.addClass("animating animation-slide-out-right"),
                    $target.on("animationend", (function() {
                        document.location.replace("#"),
                        $target.removeClass("animating animation-slide-out-right"),
                        $target.off("animationend")
                    }
                    ))
                }
                )),
                $global_nav_internal_buttons.on("click", (function(e) {
                    e.preventDefault(),
                    $target = $(e.currentTarget),
                    href = $target.attr("href"),
                    oldHash = document.location.hash,
                    document.location.replace("#"),
                    $("body").addClass("global-nav-open"),
                    $clone = $("#uni_menu").clone().attr("id", "uni_menu_clone"),
                    $clone.find("[id]").each((function(e, t) {
                        $(t).attr("id", $(t).attr("id") + "_clone")
                    }
                    )),
                    $cloneContainer = $('<div aria-hidden="true"></div>').insertAfter("#uni_menu"),
                    $cloneContainer.append($clone),
                    "#uni_menu" == href ? ($(href).addClass("animating animation-slide-in-left"),
                    $cloneContainer.find(oldHash + "_clone").addClass("animating animation-slide-out-right")) : ($(href).addClass("animating animation-slide-in-right"),
                    $cloneContainer.find(oldHash + "_clone").addClass("animating animation-slide-out-left")),
                    $(href).on("animationend", (function() {
                        $(href).removeClass("animating animation-slide-in-right animation-slide-in-left"),
                        $cloneContainer.remove(),
                        $(href).off("animationend")
                    }
                    )),
                    document.location.replace(href)
                }
                )),
                $(window).on("hashchange", (function() {
                    hash = document.location.hash.replace("#", ""),
                    $(".uni_menu_focus_trap").remove(),
                    i.includes(hash) ? (hideSectionNav(),
                    a(),
                    $("#ccc").css("z-index", 0),
                    $global_nav_button.attr("aria-expanded", !0),
                    $("body").addClass("global-nav-open"),
                    $target = $("#" + hash),
                    $focusable_elements = $target.find('button, [href], input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])'),
                    $focusable_elements = $focusable_elements.filter((function() {
                        return $(this).is(":visible")
                    }
                    )),
                    $first_focusable_element = $focusable_elements.first(),
                    $last_focusable_element = $focusable_elements.last(),
                    $target.append('<div class="uni_menu_focus_trap bottom_focus_trap" tabindex="0"></div>'),
                    $target.prepend('<div class="uni_menu_focus_trap top_focus_trap" tabindex="0"></div>'),
                    $focusable_elements = $focusable_elements.filter((function() {
                        return 0 == $(this).closest(".uni_menu_action_bar").length
                    }
                    )),
                    hash == $global_nav.attr("id") ? r && $global_nav.find('.forward_button[href="#' + r + '"]') ? $global_nav.find('.forward_button[href="#' + r + '"]').focus() : $(".uni_menu_overview .uni_menu_action_bar .close_button").focus() : $target.find(".uni_menu_action_bar .back_button").focus(),
                    $(".uni_menu_focus_trap.top_focus_trap").on("focus", (function() {
                        $last_focusable_element.focus()
                    }
                    )),
                    $(".uni_menu_focus_trap.bottom_focus_trap").on("focus", (function() {
                        $first_focusable_element.focus()
                    }
                    )),
                    r = hash) : $("body").hasClass("global-nav-open") && ($global_nav_button.focus().attr("aria-expanded", !1),
                    $("body").removeClass("global-nav-open"),
                    $("#ccc").css("z-index", 2147483647),
                    r = null)
                }
                ))
            }
            )),
            window.showModalOverlay = n,
            window.hideModalOverlay = a
        }
        ,
        6182: () => {
            $(document).ready((function() {
                $(".feature_box .feature_image img, .feature_box .feature_content h2, .feature_box .feature_more a").hover((function() {
                    if ($(this).parents(".feature_box").find(".feature_more a").length > 0) {
                        var e = $(this).parents(".feature_box")
                          , t = e.find(".feature_image")
                          , i = e.find(".feature_image img")
                          , o = e.find(".feature_content h2")
                          , s = e.find(".feature_more a")
                          , n = e.find(".feature_more a").attr("href");
                        e.find(".feature_more a").html();
                        s.addClass("hover"),
                        t.addClass("zoomed"),
                        i.add(o).css("cursor", "pointer"),
                        i.add(o).click((function() {
                            document.location = n
                        }
                        ))
                    }
                }
                ), (function() {
                    $(this).parents(".feature_box").find(".feature_image").removeClass("zoomed"),
                    $(this).parents(".feature_box").find(".feature_more a").removeClass("hover")
                }
                ))
            }
            ))
        }
        ,
        7682: () => {
            $(document).ready((function() {
                var e = /((https?|ftp|rtmp):\/\/)(www\.)?([-a-z0-9_]+\.)+([a-z]){2,63}/i;
                $("main").find("a").each((function() {
                    e.test($(this).text()) && $(this).addClass("wrap_url")
                }
                )),
                $("main").find('a[target="_blank"]').each((function() {
                    $(this).attr("rel", "noopener noreferrer")
                }
                ))
            }
            ))
        }
        ,
        7882: () => {
            !function(e) {
                e.fn.getDimensions = function(t, i) {
                    var o = e(this)
                      , s = o.parents(":hidden");
                    if (s.css({
                        display: "block"
                    }),
                    i) {
                        var n = o.css("maxHeight");
                        o.css({
                            display: i
                        }),
                        o.css({
                            maxHeight: "none"
                        }),
                        o.css({
                            visibility: "hidden"
                        }),
                        "none" !== n && n > 0 && o.css({
                            maxHeight: n
                        })
                    }
                    var a = {
                        width: t ? o.outerWidth() : o.innerWidth(),
                        height: t ? o.outerHeight() : o.innerHeight(),
                        offsetTop: o.offset().top,
                        offsetLeft: o.offset().left
                    };
                    return o.css({
                        display: ""
                    }),
                    o.css({
                        maxHeight: ""
                    }),
                    o.css({
                        visibility: ""
                    }),
                    s.css({
                        display: ""
                    }),
                    a
                }
                ,
                e.fn.focusWithoutScrolling = function() {
                    var t = e(document).scrollLeft()
                      , i = e(document).scrollTop();
                    return this.focus(),
                    window.scrollTo(t, i),
                    this
                }
                ,
                debounce = function(e, t, i) {
                    var o;
                    return function() {
                        var s = this
                          , n = arguments
                          , a = i && !o;
                        clearTimeout(o),
                        o = setTimeout((function() {
                            o = null,
                            i || e.apply(s, n)
                        }
                        ), t || 200),
                        a && e.apply(s, n)
                    }
                }
                ,
                e.fn.tabcordion = function() {
                    return this.each((function() {
                        this.$tabcordion = e(this),
                        this.config = {},
                        this.config.total_tabs_width = 0,
                        this.settings = {
                            forceAccordion: !1,
                            urlFragments: !1,
                            openFirstPanel: !1,
                            forceAccordionUntil: !1,
                            openTab: !1,
                            disableOpenTabAutoScroll: !1
                        },
                        this.mode = "accordion",
                        this.tabnav = e('<ul class="tabcordion_nav"></ul>'),
                        this.tabnav.attr("role", "tablist"),
                        this.$tabcordion.wrap('<div class="tabcordion_wrapper"></div>'),
                        this.$tabcordionWrapper = this.$tabcordion.parent();
                        var t = this;
                        function i() {
                            var e = t.$tabcordion.getDimensions(!0).width;
                            return !!(e < t.config.total_tabs_width || t.settings.forceAccordion || e < t.settings.forceAccordionUntil)
                        }
                        function o() {
                            return !i()
                        }
                        function s(e, s, n) {
                            o() && r(),
                            s = s || !1,
                            n = n || !1,
                            t.$tabcordion.find('> dt > div[role="tablist"] > a').eq(e).attr("aria-selected", "true"),
                            t.$tabcordionWrapper.find("> .tabcordion_nav > li > a").eq(e).attr({
                                "aria-selected": "true",
                                tabindex: 0
                            });
                            var a = t.$tabcordion.find("> dd").eq(e);
                            i() && a.data("height", a.getDimensions(!0, "block").height + 32),
                            n || (a.addClass("tabcordion_animating"),
                            a.outerWidth(),
                            a.css({
                                maxHeight: a.data("height")
                            })),
                            a.attr("aria-hidden", "false"),
                            a.attr("tabindex", "0"),
                            s && a.focusWithoutScrolling()
                        }
                        function n(e) {
                            return t.$tabcordion.find("> dt")
                        }
                        function a(e) {
                            return "true" === t.$tabcordion.find('> dt > div[role="tablist"] > a').eq(e).attr("aria-selected")
                        }
                        function r() {
                            t.$tabcordion.find('> dt a[aria-selected="true"]').attr("aria-selected", "false"),
                            t.$tabcordion.find('> dd[aria-hidden="false"]').attr("aria-hidden", "true"),
                            t.$tabcordion.find('> dd[tabindex="0"]').attr("tabindex", "-1"),
                            t.$tabcordionWrapper.find('> .tabcordion_nav > li a[aria-selected="true"]').attr({
                                "aria-selected": "false",
                                tabindex: -1
                            })
                        }
                        function l() {
                            var n, a, l = l || "tabs", d = t.mode, c = t.$tabcordion.find("> dt a:focus"), p = t.$tabcordionWrapper.find("> .tabcordion_nav > li > a:focus");
                            i() && (l = "accordion"),
                            t.mode = l,
                            n = d != l && d + "_to_" + l,
                            t.$tabcordion.removeClass("tabcordion_mode_tabs tabcordion_mode_accordion").addClass("tabcordion_mode_" + l),
                            t.$tabcordionWrapper.removeClass("tabcordion_mode_tabs tabcordion_mode_accordion").addClass("tabcordion_mode_" + l),
                            $panels = t.$tabcordion.find("> dd"),
                            $panels.each((function(t, i) {
                                e(i).data("height", "")
                            }
                            ));
                            var u = t.$tabcordion.find('> dt > div[role="tablist"] > a[aria-selected="true"]');
                            o() && !u.length && s(0),
                            o() && u.length > 1 && (r(),
                            s(u.first().data("index"))),
                            "accordion_to_tabs" === n && c.length > 0 && (a = c.data("index"),
                            t.$tabcordionWrapper.find("> .tabcordion_nav > li > a").eq(a).focus()),
                            "tabs_to_accordion" === n && p.length > 0 && (a = p.data("index"),
                            t.$tabcordion.find('> dt > div[role="tablist"] > a').eq(a).focus())
                        }
                        function d(i) {
                            if (!t.settings.urlFragments)
                                return !1;
                            var o = e(i.attr("href"))
                              , s = o.attr("id");
                            o.attr("id", o.attr("id") + "hashchange"),
                            a(o.data("index")) ? history.pushState({}, "", i.attr("href")) : history.pushState({}, "", location.href.replace(location.hash, "")),
                            o.attr("id", s)
                        }
                        this.$tabcordion.data("tabcordion") && e.extend(this.settings, this.$tabcordion.data("tabcordion")),
                        t.$tabcordion.find("> dd").on("transitionend", (function(t) {
                            var i = e(t.target);
                            i.is(".tabcordion > dd") && (i.removeClass("tabcordion_animating"),
                            i.css({
                                maxHeight: ""
                            }),
                            t.stopPropagation())
                        }
                        )),
                        t.$tabcordion.find("> dt a").click((function(o) {
                            var n = e(this).data("index");
                            a(n) ? function(e) {
                                t.$tabcordion.find('> dt > div[role="tablist"] > a').eq(e).attr("aria-selected", "false"),
                                t.$tabcordionWrapper.find("> .tabcordion_nav > li a").eq(e).attr({
                                    "aria-selected": "false",
                                    tabindex: -1
                                });
                                var o = t.$tabcordion.find("> dd").eq(e);
                                i() && (o.data("height", o.getDimensions(!0, "block").height + 32),
                                o.css({
                                    maxHeight: o.data("height")
                                }),
                                o.outerWidth(),
                                o.addClass("tabcordion_animating"),
                                o.css({
                                    maxHeight: 0
                                }));
                                var s = i() ? 301 : 1;
                                setTimeout((function() {
                                    o.attr("aria-hidden", "true"),
                                    o.attr("tabindex", "-1")
                                }
                                ), s),
                                setTimeout((function() {
                                    t.$tabcordion.find("> dt").eq(e).find("> a").focus()
                                }
                                ), 1)
                            }(n) : s(n, !0),
                            d(e(this)),
                            o.stopPropagation(),
                            o.preventDefault()
                        }
                        )),
                        t.$tabcordionWrapper.keydown((function(i) {
                            if (-1 !== [37, 39].indexOf(i.which)) {
                                var a = e('a[role="tab"]:focus');
                                if (a.length) {
                                    var r = {
                                        37: -1,
                                        39: 1
                                    }[i.which]
                                      , l = a.data("index");
                                    -1 == (l += r) && (l = n().length - 1),
                                    l == n().length && (l = 0),
                                    o() ? (t.$tabcordionWrapper.find("> .tabcordion_nav > li > a").eq(l).focus(),
                                    s(l)) : t.$tabcordion.find('> dt > div[role="tablist"] > a').eq(l).focus(),
                                    i.preventDefault(),
                                    i.stopPropagation()
                                }
                            }
                        }
                        )),
                        function() {
                            if (t.$tabcordion.addClass("tabcordion_loaded"),
                            t.$tabcordion.find("> dt").each((function(i, o) {
                                var n = e(this)
                                  , a = e('<li role="presentation"></li>')
                                  , l = t.$tabcordion.find("> dd").eq(i)
                                  , c = n.getDimensions(!0).width;
                                n.css({
                                    left: t.config.total_tabs_width
                                }),
                                $a = n.find("a"),
                                $a.data("index", i),
                                $a.attr("role", "tab"),
                                $a.attr("aria-controls", l.attr("id")),
                                $a.attr("aria-selected", "false"),
                                t.config.total_tabs_width += c,
                                l.wrapInner('<div role="tabpanel"></div>'),
                                l.attr("tabindex", "-1"),
                                a.html(n.html()),
                                a.find("a").data("index", i),
                                a.find("a").attr("tabindex", "-1"),
                                a.find("a").click((function(t) {
                                    var i = e(this).data("index");
                                    r(),
                                    s(i),
                                    d(e(this)),
                                    t.stopPropagation(),
                                    t.preventDefault()
                                }
                                )),
                                t.tabnav.append(a),
                                n.wrapInner('<div role="tablist"></div>')
                            }
                            )),
                            t.$tabcordion.before(t.tabnav),
                            t.$tabcordion.find("> dd").each((function(t, i) {
                                var o = e(this);
                                o.data("index", t),
                                o.attr("aria-hidden", "true")
                            }
                            )),
                            t.settings.urlFragments && window.location.hash.length > 0 || t.settings.openTab) {
                                var i = t.settings.openTab ? t.settings.openTab : window.location.hash.replace("#", "")
                                  , n = t.$tabcordion.find("> dd#" + i);
                                if (n.length)
                                    return s(n.data("index"), !1, !0),
                                    void (t.settings.disableOpenTabAutoScroll || e("html, body").animate({
                                        scrollTop: n.parents(".tabcordion_wrapper").first().offset().top
                                    }, 1200));
                                var a = -1;
                                if (t.$tabcordion.find("> dd").each((function() {
                                    if (e(this).find("dd#" + i).length)
                                        return a = e(this).data("index"),
                                        !1
                                }
                                )),
                                -1 != a)
                                    return void s(a, !1, !0)
                            }
                            (o() || t.settings.openFirstPanel) && s(0)
                        }(),
                        e(window).resize(debounce((function() {
                            l()
                        }
                        ), 16)).resize(),
                        "onhashchange"in window && e(window).on("hashchange", (function() {
                            var i = t.$tabcordionWrapper.find('> .tabcordion_nav a[href="' + window.location.hash + '"]');
                            if (i.length) {
                                var n = i.data("index");
                                a(n) || (r(),
                                s(n, !0),
                                o() ? e("html, body").animate({
                                    scrollTop: i.parents(".tabcordion_nav").first().offset().top
                                }, 1200) : e("html, body").animate({
                                    scrollTop: e('.tabcordion [aria-controls="' + i.attr("href").replace("#", "") + '"]').first().offset().top
                                }, 1200))
                            }
                        }
                        ))
                    }
                    ))
                }
                ,
                e(document).ready((function() {
                    e(".tabcordion:not(.tabcordion_loaded)").tabcordion()
                }
                ))
            }(jQuery)
        }
        ,
        7960: () => {
            $(document).ready((function() {
                $("#global_search input").autocompletion({
                    datasets: {
                        organic: {
                            collection: window.abdnDesignSystem.search.collection,
                            profile: "_default_preview",
                            program: window.abdnDesignSystem.search.suggestionURL,
                            dataType: "json"
                        }
                    },
                    length: 2
                }),
                $(".hero_search form input").autocompletion({
                    datasets: {
                        organic: {
                            collection: window.abdnDesignSystem.search.collection,
                            program: window.abdnDesignSystem.search.suggestionURL,
                            dataType: "json"
                        }
                    },
                    length: 2
                })
            }
            ))
        }
    }
      , t = {};
    function o(i) {
        var s = t[i];
        if (void 0 !== s)
            return s.exports;
        var n = t[i] = {
            exports: {}
        };
        return e[i](n, n.exports, o),
        n.exports
    }
    o(3768),
    o(4143),
    o(7682),
    o(6182),
    o(2992),
    o(7960),
    o(4210),
    o(1880),
    o(5306),
    o(7882),
    o(4686),
    o(6150)
}
)();



/*! jQuery v3.6.0 | (c) OpenJS Foundation and other contributors | jquery.org/license */
!function(e, t) {
    "use strict";
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
        if (!e.document)
            throw new Error("jQuery requires a window with a document");
        return t(e)
    }
    : t(e)
}("undefined" != typeof window ? window : this, function(C, e) {
    "use strict";
    var t = []
      , r = Object.getPrototypeOf
      , s = t.slice
      , g = t.flat ? function(e) {
        return t.flat.call(e)
    }
    : function(e) {
        return t.concat.apply([], e)
    }
      , u = t.push
      , i = t.indexOf
      , n = {}
      , o = n.toString
      , v = n.hasOwnProperty
      , a = v.toString
      , l = a.call(Object)
      , y = {}
      , m = function(e) {
        return "function" == typeof e && "number" != typeof e.nodeType && "function" != typeof e.item
    }
      , x = function(e) {
        return null != e && e === e.window
    }
      , E = C.document
      , c = {
        type: !0,
        src: !0,
        nonce: !0,
        noModule: !0
    };
    function b(e, t, n) {
        var r, i, o = (n = n || E).createElement("script");
        if (o.text = e,
        t)
            for (r in c)
                (i = t[r] || t.getAttribute && t.getAttribute(r)) && o.setAttribute(r, i);
        n.head.appendChild(o).parentNode.removeChild(o)
    }
    function w(e) {
        return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? n[o.call(e)] || "object" : typeof e
    }
    var f = "3.6.0"
      , S = function(e, t) {
        return new S.fn.init(e,t)
    };
    function p(e) {
        var t = !!e && "length"in e && e.length
          , n = w(e);
        return !m(e) && !x(e) && ("array" === n || 0 === t || "number" == typeof t && 0 < t && t - 1 in e)
    }
    S.fn = S.prototype = {
        jquery: f,
        constructor: S,
        length: 0,
        toArray: function() {
            return s.call(this)
        },
        get: function(e) {
            return null == e ? s.call(this) : e < 0 ? this[e + this.length] : this[e]
        },
        pushStack: function(e) {
            var t = S.merge(this.constructor(), e);
            return t.prevObject = this,
            t
        },
        each: function(e) {
            return S.each(this, e)
        },
        map: function(n) {
            return this.pushStack(S.map(this, function(e, t) {
                return n.call(e, t, e)
            }))
        },
        slice: function() {
            return this.pushStack(s.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        even: function() {
            return this.pushStack(S.grep(this, function(e, t) {
                return (t + 1) % 2
            }))
        },
        odd: function() {
            return this.pushStack(S.grep(this, function(e, t) {
                return t % 2
            }))
        },
        eq: function(e) {
            var t = this.length
              , n = +e + (e < 0 ? t : 0);
            return this.pushStack(0 <= n && n < t ? [this[n]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor()
        },
        push: u,
        sort: t.sort,
        splice: t.splice
    },
    S.extend = S.fn.extend = function() {
        var e, t, n, r, i, o, a = arguments[0] || {}, s = 1, u = arguments.length, l = !1;
        for ("boolean" == typeof a && (l = a,
        a = arguments[s] || {},
        s++),
        "object" == typeof a || m(a) || (a = {}),
        s === u && (a = this,
        s--); s < u; s++)
            if (null != (e = arguments[s]))
                for (t in e)
                    r = e[t],
                    "__proto__" !== t && a !== r && (l && r && (S.isPlainObject(r) || (i = Array.isArray(r))) ? (n = a[t],
                    o = i && !Array.isArray(n) ? [] : i || S.isPlainObject(n) ? n : {},
                    i = !1,
                    a[t] = S.extend(l, o, r)) : void 0 !== r && (a[t] = r));
        return a
    }
    ,
    S.extend({
        expando: "jQuery" + (f + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(e) {
            throw new Error(e)
        },
        noop: function() {},
        isPlainObject: function(e) {
            var t, n;
            return !(!e || "[object Object]" !== o.call(e)) && (!(t = r(e)) || "function" == typeof (n = v.call(t, "constructor") && t.constructor) && a.call(n) === l)
        },
        isEmptyObject: function(e) {
            var t;
            for (t in e)
                return !1;
            return !0
        },
        globalEval: function(e, t, n) {
            b(e, {
                nonce: t && t.nonce
            }, n)
        },
        each: function(e, t) {
            var n, r = 0;
            if (p(e)) {
                for (n = e.length; r < n; r++)
                    if (!1 === t.call(e[r], r, e[r]))
                        break
            } else
                for (r in e)
                    if (!1 === t.call(e[r], r, e[r]))
                        break;
            return e
        },
        makeArray: function(e, t) {
            var n = t || [];
            return null != e && (p(Object(e)) ? S.merge(n, "string" == typeof e ? [e] : e) : u.call(n, e)),
            n
        },
        inArray: function(e, t, n) {
            return null == t ? -1 : i.call(t, e, n)
        },
        merge: function(e, t) {
            for (var n = +t.length, r = 0, i = e.length; r < n; r++)
                e[i++] = t[r];
            return e.length = i,
            e
        },
        grep: function(e, t, n) {
            for (var r = [], i = 0, o = e.length, a = !n; i < o; i++)
                !t(e[i], i) !== a && r.push(e[i]);
            return r
        },
        map: function(e, t, n) {
            var r, i, o = 0, a = [];
            if (p(e))
                for (r = e.length; o < r; o++)
                    null != (i = t(e[o], o, n)) && a.push(i);
            else
                for (o in e)
                    null != (i = t(e[o], o, n)) && a.push(i);
            return g(a)
        },
        guid: 1,
        support: y
    }),
    "function" == typeof Symbol && (S.fn[Symbol.iterator] = t[Symbol.iterator]),
    S.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(e, t) {
        n["[object " + t + "]"] = t.toLowerCase()
    });
    var d = function(n) {
        var e, d, b, o, i, h, f, g, w, u, l, T, C, a, E, v, s, c, y, S = "sizzle" + 1 * new Date, p = n.document, k = 0, r = 0, m = ue(), x = ue(), A = ue(), N = ue(), j = function(e, t) {
            return e === t && (l = !0),
            0
        }, D = {}.hasOwnProperty, t = [], q = t.pop, L = t.push, H = t.push, O = t.slice, P = function(e, t) {
            for (var n = 0, r = e.length; n < r; n++)
                if (e[n] === t)
                    return n;
            return -1
        }, R = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", M = "[\\x20\\t\\r\\n\\f]", I = "(?:\\\\[\\da-fA-F]{1,6}" + M + "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+", W = "\\[" + M + "*(" + I + ")(?:" + M + "*([*^$|!~]?=)" + M + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + I + "))|)" + M + "*\\]", F = ":(" + I + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + W + ")*)|.*)\\)|)", B = new RegExp(M + "+","g"), $ = new RegExp("^" + M + "+|((?:^|[^\\\\])(?:\\\\.)*)" + M + "+$","g"), _ = new RegExp("^" + M + "*," + M + "*"), z = new RegExp("^" + M + "*([>+~]|" + M + ")" + M + "*"), U = new RegExp(M + "|>"), X = new RegExp(F), V = new RegExp("^" + I + "$"), G = {
            ID: new RegExp("^#(" + I + ")"),
            CLASS: new RegExp("^\\.(" + I + ")"),
            TAG: new RegExp("^(" + I + "|[*])"),
            ATTR: new RegExp("^" + W),
            PSEUDO: new RegExp("^" + F),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + M + "*(even|odd|(([+-]|)(\\d*)n|)" + M + "*(?:([+-]|)" + M + "*(\\d+)|))" + M + "*\\)|)","i"),
            bool: new RegExp("^(?:" + R + ")$","i"),
            needsContext: new RegExp("^" + M + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + M + "*((?:-\\d)?\\d*)" + M + "*\\)|)(?=[^-]|$)","i")
        }, Y = /HTML$/i, Q = /^(?:input|select|textarea|button)$/i, J = /^h\d$/i, K = /^[^{]+\{\s*\[native \w/, Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, ee = /[+~]/, te = new RegExp("\\\\[\\da-fA-F]{1,6}" + M + "?|\\\\([^\\r\\n\\f])","g"), ne = function(e, t) {
            var n = "0x" + e.slice(1) - 65536;
            return t || (n < 0 ? String.fromCharCode(n + 65536) : String.fromCharCode(n >> 10 | 55296, 1023 & n | 56320))
        }, re = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g, ie = function(e, t) {
            return t ? "\0" === e ? "\ufffd" : e.slice(0, -1) + "\\" + e.charCodeAt(e.length - 1).toString(16) + " " : "\\" + e
        }, oe = function() {
            T()
        }, ae = be(function(e) {
            return !0 === e.disabled && "fieldset" === e.nodeName.toLowerCase()
        }, {
            dir: "parentNode",
            next: "legend"
        });
        try {
            H.apply(t = O.call(p.childNodes), p.childNodes),
            t[p.childNodes.length].nodeType
        } catch (e) {
            H = {
                apply: t.length ? function(e, t) {
                    L.apply(e, O.call(t))
                }
                : function(e, t) {
                    var n = e.length
                      , r = 0;
                    while (e[n++] = t[r++])
                        ;
                    e.length = n - 1
                }
            }
        }
        function se(t, e, n, r) {
            var i, o, a, s, u, l, c, f = e && e.ownerDocument, p = e ? e.nodeType : 9;
            if (n = n || [],
            "string" != typeof t || !t || 1 !== p && 9 !== p && 11 !== p)
                return n;
            if (!r && (T(e),
            e = e || C,
            E)) {
                if (11 !== p && (u = Z.exec(t)))
                    if (i = u[1]) {
                        if (9 === p) {
                            if (!(a = e.getElementById(i)))
                                return n;
                            if (a.id === i)
                                return n.push(a),
                                n
                        } else if (f && (a = f.getElementById(i)) && y(e, a) && a.id === i)
                            return n.push(a),
                            n
                    } else {
                        if (u[2])
                            return H.apply(n, e.getElementsByTagName(t)),
                            n;
                        if ((i = u[3]) && d.getElementsByClassName && e.getElementsByClassName)
                            return H.apply(n, e.getElementsByClassName(i)),
                            n
                    }
                if (d.qsa && !N[t + " "] && (!v || !v.test(t)) && (1 !== p || "object" !== e.nodeName.toLowerCase())) {
                    if (c = t,
                    f = e,
                    1 === p && (U.test(t) || z.test(t))) {
                        (f = ee.test(t) && ye(e.parentNode) || e) === e && d.scope || ((s = e.getAttribute("id")) ? s = s.replace(re, ie) : e.setAttribute("id", s = S)),
                        o = (l = h(t)).length;
                        while (o--)
                            l[o] = (s ? "#" + s : ":scope") + " " + xe(l[o]);
                        c = l.join(",")
                    }
                    try {
                        return H.apply(n, f.querySelectorAll(c)),
                        n
                    } catch (e) {
                        N(t, !0)
                    } finally {
                        s === S && e.removeAttribute("id")
                    }
                }
            }
            return g(t.replace($, "$1"), e, n, r)
        }
        function ue() {
            var r = [];
            return function e(t, n) {
                return r.push(t + " ") > b.cacheLength && delete e[r.shift()],
                e[t + " "] = n
            }
        }
        function le(e) {
            return e[S] = !0,
            e
        }
        function ce(e) {
            var t = C.createElement("fieldset");
            try {
                return !!e(t)
            } catch (e) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t),
                t = null
            }
        }
        function fe(e, t) {
            var n = e.split("|")
              , r = n.length;
            while (r--)
                b.attrHandle[n[r]] = t
        }
        function pe(e, t) {
            var n = t && e
              , r = n && 1 === e.nodeType && 1 === t.nodeType && e.sourceIndex - t.sourceIndex;
            if (r)
                return r;
            if (n)
                while (n = n.nextSibling)
                    if (n === t)
                        return -1;
            return e ? 1 : -1
        }
        function de(t) {
            return function(e) {
                return "input" === e.nodeName.toLowerCase() && e.type === t
            }
        }
        function he(n) {
            return function(e) {
                var t = e.nodeName.toLowerCase();
                return ("input" === t || "button" === t) && e.type === n
            }
        }
        function ge(t) {
            return function(e) {
                return "form"in e ? e.parentNode && !1 === e.disabled ? "label"in e ? "label"in e.parentNode ? e.parentNode.disabled === t : e.disabled === t : e.isDisabled === t || e.isDisabled !== !t && ae(e) === t : e.disabled === t : "label"in e && e.disabled === t
            }
        }
        function ve(a) {
            return le(function(o) {
                return o = +o,
                le(function(e, t) {
                    var n, r = a([], e.length, o), i = r.length;
                    while (i--)
                        e[n = r[i]] && (e[n] = !(t[n] = e[n]))
                })
            })
        }
        function ye(e) {
            return e && "undefined" != typeof e.getElementsByTagName && e
        }
        for (e in d = se.support = {},
        i = se.isXML = function(e) {
            var t = e && e.namespaceURI
              , n = e && (e.ownerDocument || e).documentElement;
            return !Y.test(t || n && n.nodeName || "HTML")
        }
        ,
        T = se.setDocument = function(e) {
            var t, n, r = e ? e.ownerDocument || e : p;
            return r != C && 9 === r.nodeType && r.documentElement && (a = (C = r).documentElement,
            E = !i(C),
            p != C && (n = C.defaultView) && n.top !== n && (n.addEventListener ? n.addEventListener("unload", oe, !1) : n.attachEvent && n.attachEvent("onunload", oe)),
            d.scope = ce(function(e) {
                return a.appendChild(e).appendChild(C.createElement("div")),
                "undefined" != typeof e.querySelectorAll && !e.querySelectorAll(":scope fieldset div").length
            }),
            d.attributes = ce(function(e) {
                return e.className = "i",
                !e.getAttribute("className")
            }),
            d.getElementsByTagName = ce(function(e) {
                return e.appendChild(C.createComment("")),
                !e.getElementsByTagName("*").length
            }),
            d.getElementsByClassName = K.test(C.getElementsByClassName),
            d.getById = ce(function(e) {
                return a.appendChild(e).id = S,
                !C.getElementsByName || !C.getElementsByName(S).length
            }),
            d.getById ? (b.filter.ID = function(e) {
                var t = e.replace(te, ne);
                return function(e) {
                    return e.getAttribute("id") === t
                }
            }
            ,
            b.find.ID = function(e, t) {
                if ("undefined" != typeof t.getElementById && E) {
                    var n = t.getElementById(e);
                    return n ? [n] : []
                }
            }
            ) : (b.filter.ID = function(e) {
                var n = e.replace(te, ne);
                return function(e) {
                    var t = "undefined" != typeof e.getAttributeNode && e.getAttributeNode("id");
                    return t && t.value === n
                }
            }
            ,
            b.find.ID = function(e, t) {
                if ("undefined" != typeof t.getElementById && E) {
                    var n, r, i, o = t.getElementById(e);
                    if (o) {
                        if ((n = o.getAttributeNode("id")) && n.value === e)
                            return [o];
                        i = t.getElementsByName(e),
                        r = 0;
                        while (o = i[r++])
                            if ((n = o.getAttributeNode("id")) && n.value === e)
                                return [o]
                    }
                    return []
                }
            }
            ),
            b.find.TAG = d.getElementsByTagName ? function(e, t) {
                return "undefined" != typeof t.getElementsByTagName ? t.getElementsByTagName(e) : d.qsa ? t.querySelectorAll(e) : void 0
            }
            : function(e, t) {
                var n, r = [], i = 0, o = t.getElementsByTagName(e);
                if ("*" === e) {
                    while (n = o[i++])
                        1 === n.nodeType && r.push(n);
                    return r
                }
                return o
            }
            ,
            b.find.CLASS = d.getElementsByClassName && function(e, t) {
                if ("undefined" != typeof t.getElementsByClassName && E)
                    return t.getElementsByClassName(e)
            }
            ,
            s = [],
            v = [],
            (d.qsa = K.test(C.querySelectorAll)) && (ce(function(e) {
                var t;
                a.appendChild(e).innerHTML = "<a id='" + S + "'></a><select id='" + S + "-\r\\' msallowcapture=''><option selected=''></option></select>",
                e.querySelectorAll("[msallowcapture^='']").length && v.push("[*^$]=" + M + "*(?:''|\"\")"),
                e.querySelectorAll("[selected]").length || v.push("\\[" + M + "*(?:value|" + R + ")"),
                e.querySelectorAll("[id~=" + S + "-]").length || v.push("~="),
                (t = C.createElement("input")).setAttribute("name", ""),
                e.appendChild(t),
                e.querySelectorAll("[name='']").length || v.push("\\[" + M + "*name" + M + "*=" + M + "*(?:''|\"\")"),
                e.querySelectorAll(":checked").length || v.push(":checked"),
                e.querySelectorAll("a#" + S + "+*").length || v.push(".#.+[+~]"),
                e.querySelectorAll("\\\f"),
                v.push("[\\r\\n\\f]")
            }),
            ce(function(e) {
                e.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                var t = C.createElement("input");
                t.setAttribute("type", "hidden"),
                e.appendChild(t).setAttribute("name", "D"),
                e.querySelectorAll("[name=d]").length && v.push("name" + M + "*[*^$|!~]?="),
                2 !== e.querySelectorAll(":enabled").length && v.push(":enabled", ":disabled"),
                a.appendChild(e).disabled = !0,
                2 !== e.querySelectorAll(":disabled").length && v.push(":enabled", ":disabled"),
                e.querySelectorAll("*,:x"),
                v.push(",.*:")
            })),
            (d.matchesSelector = K.test(c = a.matches || a.webkitMatchesSelector || a.mozMatchesSelector || a.oMatchesSelector || a.msMatchesSelector)) && ce(function(e) {
                d.disconnectedMatch = c.call(e, "*"),
                c.call(e, "[s!='']:x"),
                s.push("!=", F)
            }),
            v = v.length && new RegExp(v.join("|")),
            s = s.length && new RegExp(s.join("|")),
            t = K.test(a.compareDocumentPosition),
            y = t || K.test(a.contains) ? function(e, t) {
                var n = 9 === e.nodeType ? e.documentElement : e
                  , r = t && t.parentNode;
                return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r)))
            }
            : function(e, t) {
                if (t)
                    while (t = t.parentNode)
                        if (t === e)
                            return !0;
                return !1
            }
            ,
            j = t ? function(e, t) {
                if (e === t)
                    return l = !0,
                    0;
                var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                return n || (1 & (n = (e.ownerDocument || e) == (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !d.sortDetached && t.compareDocumentPosition(e) === n ? e == C || e.ownerDocument == p && y(p, e) ? -1 : t == C || t.ownerDocument == p && y(p, t) ? 1 : u ? P(u, e) - P(u, t) : 0 : 4 & n ? -1 : 1)
            }
            : function(e, t) {
                if (e === t)
                    return l = !0,
                    0;
                var n, r = 0, i = e.parentNode, o = t.parentNode, a = [e], s = [t];
                if (!i || !o)
                    return e == C ? -1 : t == C ? 1 : i ? -1 : o ? 1 : u ? P(u, e) - P(u, t) : 0;
                if (i === o)
                    return pe(e, t);
                n = e;
                while (n = n.parentNode)
                    a.unshift(n);
                n = t;
                while (n = n.parentNode)
                    s.unshift(n);
                while (a[r] === s[r])
                    r++;
                return r ? pe(a[r], s[r]) : a[r] == p ? -1 : s[r] == p ? 1 : 0
            }
            ),
            C
        }
        ,
        se.matches = function(e, t) {
            return se(e, null, null, t)
        }
        ,
        se.matchesSelector = function(e, t) {
            if (T(e),
            d.matchesSelector && E && !N[t + " "] && (!s || !s.test(t)) && (!v || !v.test(t)))
                try {
                    var n = c.call(e, t);
                    if (n || d.disconnectedMatch || e.document && 11 !== e.document.nodeType)
                        return n
                } catch (e) {
                    N(t, !0)
                }
            return 0 < se(t, C, null, [e]).length
        }
        ,
        se.contains = function(e, t) {
            return (e.ownerDocument || e) != C && T(e),
            y(e, t)
        }
        ,
        se.attr = function(e, t) {
            (e.ownerDocument || e) != C && T(e);
            var n = b.attrHandle[t.toLowerCase()]
              , r = n && D.call(b.attrHandle, t.toLowerCase()) ? n(e, t, !E) : void 0;
            return void 0 !== r ? r : d.attributes || !E ? e.getAttribute(t) : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
        }
        ,
        se.escape = function(e) {
            return (e + "").replace(re, ie)
        }
        ,
        se.error = function(e) {
            throw new Error("Syntax error, unrecognized expression: " + e)
        }
        ,
        se.uniqueSort = function(e) {
            var t, n = [], r = 0, i = 0;
            if (l = !d.detectDuplicates,
            u = !d.sortStable && e.slice(0),
            e.sort(j),
            l) {
                while (t = e[i++])
                    t === e[i] && (r = n.push(i));
                while (r--)
                    e.splice(n[r], 1)
            }
            return u = null,
            e
        }
        ,
        o = se.getText = function(e) {
            var t, n = "", r = 0, i = e.nodeType;
            if (i) {
                if (1 === i || 9 === i || 11 === i) {
                    if ("string" == typeof e.textContent)
                        return e.textContent;
                    for (e = e.firstChild; e; e = e.nextSibling)
                        n += o(e)
                } else if (3 === i || 4 === i)
                    return e.nodeValue
            } else
                while (t = e[r++])
                    n += o(t);
            return n
        }
        ,
        (b = se.selectors = {
            cacheLength: 50,
            createPseudo: le,
            match: G,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(e) {
                    return e[1] = e[1].replace(te, ne),
                    e[3] = (e[3] || e[4] || e[5] || "").replace(te, ne),
                    "~=" === e[2] && (e[3] = " " + e[3] + " "),
                    e.slice(0, 4)
                },
                CHILD: function(e) {
                    return e[1] = e[1].toLowerCase(),
                    "nth" === e[1].slice(0, 3) ? (e[3] || se.error(e[0]),
                    e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])),
                    e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && se.error(e[0]),
                    e
                },
                PSEUDO: function(e) {
                    var t, n = !e[6] && e[2];
                    return G.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && X.test(n) && (t = h(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t),
                    e[2] = n.slice(0, t)),
                    e.slice(0, 3))
                }
            },
            filter: {
                TAG: function(e) {
                    var t = e.replace(te, ne).toLowerCase();
                    return "*" === e ? function() {
                        return !0
                    }
                    : function(e) {
                        return e.nodeName && e.nodeName.toLowerCase() === t
                    }
                },
                CLASS: function(e) {
                    var t = m[e + " "];
                    return t || (t = new RegExp("(^|" + M + ")" + e + "(" + M + "|$)")) && m(e, function(e) {
                        return t.test("string" == typeof e.className && e.className || "undefined" != typeof e.getAttribute && e.getAttribute("class") || "")
                    })
                },
                ATTR: function(n, r, i) {
                    return function(e) {
                        var t = se.attr(e, n);
                        return null == t ? "!=" === r : !r || (t += "",
                        "=" === r ? t === i : "!=" === r ? t !== i : "^=" === r ? i && 0 === t.indexOf(i) : "*=" === r ? i && -1 < t.indexOf(i) : "$=" === r ? i && t.slice(-i.length) === i : "~=" === r ? -1 < (" " + t.replace(B, " ") + " ").indexOf(i) : "|=" === r && (t === i || t.slice(0, i.length + 1) === i + "-"))
                    }
                },
                CHILD: function(h, e, t, g, v) {
                    var y = "nth" !== h.slice(0, 3)
                      , m = "last" !== h.slice(-4)
                      , x = "of-type" === e;
                    return 1 === g && 0 === v ? function(e) {
                        return !!e.parentNode
                    }
                    : function(e, t, n) {
                        var r, i, o, a, s, u, l = y !== m ? "nextSibling" : "previousSibling", c = e.parentNode, f = x && e.nodeName.toLowerCase(), p = !n && !x, d = !1;
                        if (c) {
                            if (y) {
                                while (l) {
                                    a = e;
                                    while (a = a[l])
                                        if (x ? a.nodeName.toLowerCase() === f : 1 === a.nodeType)
                                            return !1;
                                    u = l = "only" === h && !u && "nextSibling"
                                }
                                return !0
                            }
                            if (u = [m ? c.firstChild : c.lastChild],
                            m && p) {
                                d = (s = (r = (i = (o = (a = c)[S] || (a[S] = {}))[a.uniqueID] || (o[a.uniqueID] = {}))[h] || [])[0] === k && r[1]) && r[2],
                                a = s && c.childNodes[s];
                                while (a = ++s && a && a[l] || (d = s = 0) || u.pop())
                                    if (1 === a.nodeType && ++d && a === e) {
                                        i[h] = [k, s, d];
                                        break
                                    }
                            } else if (p && (d = s = (r = (i = (o = (a = e)[S] || (a[S] = {}))[a.uniqueID] || (o[a.uniqueID] = {}))[h] || [])[0] === k && r[1]),
                            !1 === d)
                                while (a = ++s && a && a[l] || (d = s = 0) || u.pop())
                                    if ((x ? a.nodeName.toLowerCase() === f : 1 === a.nodeType) && ++d && (p && ((i = (o = a[S] || (a[S] = {}))[a.uniqueID] || (o[a.uniqueID] = {}))[h] = [k, d]),
                                    a === e))
                                        break;
                            return (d -= v) === g || d % g == 0 && 0 <= d / g
                        }
                    }
                },
                PSEUDO: function(e, o) {
                    var t, a = b.pseudos[e] || b.setFilters[e.toLowerCase()] || se.error("unsupported pseudo: " + e);
                    return a[S] ? a(o) : 1 < a.length ? (t = [e, e, "", o],
                    b.setFilters.hasOwnProperty(e.toLowerCase()) ? le(function(e, t) {
                        var n, r = a(e, o), i = r.length;
                        while (i--)
                            e[n = P(e, r[i])] = !(t[n] = r[i])
                    }) : function(e) {
                        return a(e, 0, t)
                    }
                    ) : a
                }
            },
            pseudos: {
                not: le(function(e) {
                    var r = []
                      , i = []
                      , s = f(e.replace($, "$1"));
                    return s[S] ? le(function(e, t, n, r) {
                        var i, o = s(e, null, r, []), a = e.length;
                        while (a--)
                            (i = o[a]) && (e[a] = !(t[a] = i))
                    }) : function(e, t, n) {
                        return r[0] = e,
                        s(r, null, n, i),
                        r[0] = null,
                        !i.pop()
                    }
                }),
                has: le(function(t) {
                    return function(e) {
                        return 0 < se(t, e).length
                    }
                }),
                contains: le(function(t) {
                    return t = t.replace(te, ne),
                    function(e) {
                        return -1 < (e.textContent || o(e)).indexOf(t)
                    }
                }),
                lang: le(function(n) {
                    return V.test(n || "") || se.error("unsupported lang: " + n),
                    n = n.replace(te, ne).toLowerCase(),
                    function(e) {
                        var t;
                        do {
                            if (t = E ? e.lang : e.getAttribute("xml:lang") || e.getAttribute("lang"))
                                return (t = t.toLowerCase()) === n || 0 === t.indexOf(n + "-")
                        } while ((e = e.parentNode) && 1 === e.nodeType);
                        return !1
                    }
                }),
                target: function(e) {
                    var t = n.location && n.location.hash;
                    return t && t.slice(1) === e.id
                },
                root: function(e) {
                    return e === a
                },
                focus: function(e) {
                    return e === C.activeElement && (!C.hasFocus || C.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                },
                enabled: ge(!1),
                disabled: ge(!0),
                checked: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && !!e.checked || "option" === t && !!e.selected
                },
                selected: function(e) {
                    return e.parentNode && e.parentNode.selectedIndex,
                    !0 === e.selected
                },
                empty: function(e) {
                    for (e = e.firstChild; e; e = e.nextSibling)
                        if (e.nodeType < 6)
                            return !1;
                    return !0
                },
                parent: function(e) {
                    return !b.pseudos.empty(e)
                },
                header: function(e) {
                    return J.test(e.nodeName)
                },
                input: function(e) {
                    return Q.test(e.nodeName)
                },
                button: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && "button" === e.type || "button" === t
                },
                text: function(e) {
                    var t;
                    return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                },
                first: ve(function() {
                    return [0]
                }),
                last: ve(function(e, t) {
                    return [t - 1]
                }),
                eq: ve(function(e, t, n) {
                    return [n < 0 ? n + t : n]
                }),
                even: ve(function(e, t) {
                    for (var n = 0; n < t; n += 2)
                        e.push(n);
                    return e
                }),
                odd: ve(function(e, t) {
                    for (var n = 1; n < t; n += 2)
                        e.push(n);
                    return e
                }),
                lt: ve(function(e, t, n) {
                    for (var r = n < 0 ? n + t : t < n ? t : n; 0 <= --r; )
                        e.push(r);
                    return e
                }),
                gt: ve(function(e, t, n) {
                    for (var r = n < 0 ? n + t : n; ++r < t; )
                        e.push(r);
                    return e
                })
            }
        }).pseudos.nth = b.pseudos.eq,
        {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        })
            b.pseudos[e] = de(e);
        for (e in {
            submit: !0,
            reset: !0
        })
            b.pseudos[e] = he(e);
        function me() {}
        function xe(e) {
            for (var t = 0, n = e.length, r = ""; t < n; t++)
                r += e[t].value;
            return r
        }
        function be(s, e, t) {
            var u = e.dir
              , l = e.next
              , c = l || u
              , f = t && "parentNode" === c
              , p = r++;
            return e.first ? function(e, t, n) {
                while (e = e[u])
                    if (1 === e.nodeType || f)
                        return s(e, t, n);
                return !1
            }
            : function(e, t, n) {
                var r, i, o, a = [k, p];
                if (n) {
                    while (e = e[u])
                        if ((1 === e.nodeType || f) && s(e, t, n))
                            return !0
                } else
                    while (e = e[u])
                        if (1 === e.nodeType || f)
                            if (i = (o = e[S] || (e[S] = {}))[e.uniqueID] || (o[e.uniqueID] = {}),
                            l && l === e.nodeName.toLowerCase())
                                e = e[u] || e;
                            else {
                                if ((r = i[c]) && r[0] === k && r[1] === p)
                                    return a[2] = r[2];
                                if ((i[c] = a)[2] = s(e, t, n))
                                    return !0
                            }
                return !1
            }
        }
        function we(i) {
            return 1 < i.length ? function(e, t, n) {
                var r = i.length;
                while (r--)
                    if (!i[r](e, t, n))
                        return !1;
                return !0
            }
            : i[0]
        }
        function Te(e, t, n, r, i) {
            for (var o, a = [], s = 0, u = e.length, l = null != t; s < u; s++)
                (o = e[s]) && (n && !n(o, r, i) || (a.push(o),
                l && t.push(s)));
            return a
        }
        function Ce(d, h, g, v, y, e) {
            return v && !v[S] && (v = Ce(v)),
            y && !y[S] && (y = Ce(y, e)),
            le(function(e, t, n, r) {
                var i, o, a, s = [], u = [], l = t.length, c = e || function(e, t, n) {
                    for (var r = 0, i = t.length; r < i; r++)
                        se(e, t[r], n);
                    return n
                }(h || "*", n.nodeType ? [n] : n, []), f = !d || !e && h ? c : Te(c, s, d, n, r), p = g ? y || (e ? d : l || v) ? [] : t : f;
                if (g && g(f, p, n, r),
                v) {
                    i = Te(p, u),
                    v(i, [], n, r),
                    o = i.length;
                    while (o--)
                        (a = i[o]) && (p[u[o]] = !(f[u[o]] = a))
                }
                if (e) {
                    if (y || d) {
                        if (y) {
                            i = [],
                            o = p.length;
                            while (o--)
                                (a = p[o]) && i.push(f[o] = a);
                            y(null, p = [], i, r)
                        }
                        o = p.length;
                        while (o--)
                            (a = p[o]) && -1 < (i = y ? P(e, a) : s[o]) && (e[i] = !(t[i] = a))
                    }
                } else
                    p = Te(p === t ? p.splice(l, p.length) : p),
                    y ? y(null, t, p, r) : H.apply(t, p)
            })
        }
        function Ee(e) {
            for (var i, t, n, r = e.length, o = b.relative[e[0].type], a = o || b.relative[" "], s = o ? 1 : 0, u = be(function(e) {
                return e === i
            }, a, !0), l = be(function(e) {
                return -1 < P(i, e)
            }, a, !0), c = [function(e, t, n) {
                var r = !o && (n || t !== w) || ((i = t).nodeType ? u(e, t, n) : l(e, t, n));
                return i = null,
                r
            }
            ]; s < r; s++)
                if (t = b.relative[e[s].type])
                    c = [be(we(c), t)];
                else {
                    if ((t = b.filter[e[s].type].apply(null, e[s].matches))[S]) {
                        for (n = ++s; n < r; n++)
                            if (b.relative[e[n].type])
                                break;
                        return Ce(1 < s && we(c), 1 < s && xe(e.slice(0, s - 1).concat({
                            value: " " === e[s - 2].type ? "*" : ""
                        })).replace($, "$1"), t, s < n && Ee(e.slice(s, n)), n < r && Ee(e = e.slice(n)), n < r && xe(e))
                    }
                    c.push(t)
                }
            return we(c)
        }
        return me.prototype = b.filters = b.pseudos,
        b.setFilters = new me,
        h = se.tokenize = function(e, t) {
            var n, r, i, o, a, s, u, l = x[e + " "];
            if (l)
                return t ? 0 : l.slice(0);
            a = e,
            s = [],
            u = b.preFilter;
            while (a) {
                for (o in n && !(r = _.exec(a)) || (r && (a = a.slice(r[0].length) || a),
                s.push(i = [])),
                n = !1,
                (r = z.exec(a)) && (n = r.shift(),
                i.push({
                    value: n,
                    type: r[0].replace($, " ")
                }),
                a = a.slice(n.length)),
                b.filter)
                    !(r = G[o].exec(a)) || u[o] && !(r = u[o](r)) || (n = r.shift(),
                    i.push({
                        value: n,
                        type: o,
                        matches: r
                    }),
                    a = a.slice(n.length));
                if (!n)
                    break
            }
            return t ? a.length : a ? se.error(e) : x(e, s).slice(0)
        }
        ,
        f = se.compile = function(e, t) {
            var n, v, y, m, x, r, i = [], o = [], a = A[e + " "];
            if (!a) {
                t || (t = h(e)),
                n = t.length;
                while (n--)
                    (a = Ee(t[n]))[S] ? i.push(a) : o.push(a);
                (a = A(e, (v = o,
                m = 0 < (y = i).length,
                x = 0 < v.length,
                r = function(e, t, n, r, i) {
                    var o, a, s, u = 0, l = "0", c = e && [], f = [], p = w, d = e || x && b.find.TAG("*", i), h = k += null == p ? 1 : Math.random() || .1, g = d.length;
                    for (i && (w = t == C || t || i); l !== g && null != (o = d[l]); l++) {
                        if (x && o) {
                            a = 0,
                            t || o.ownerDocument == C || (T(o),
                            n = !E);
                            while (s = v[a++])
                                if (s(o, t || C, n)) {
                                    r.push(o);
                                    break
                                }
                            i && (k = h)
                        }
                        m && ((o = !s && o) && u--,
                        e && c.push(o))
                    }
                    if (u += l,
                    m && l !== u) {
                        a = 0;
                        while (s = y[a++])
                            s(c, f, t, n);
                        if (e) {
                            if (0 < u)
                                while (l--)
                                    c[l] || f[l] || (f[l] = q.call(r));
                            f = Te(f)
                        }
                        H.apply(r, f),
                        i && !e && 0 < f.length && 1 < u + y.length && se.uniqueSort(r)
                    }
                    return i && (k = h,
                    w = p),
                    c
                }
                ,
                m ? le(r) : r))).selector = e
            }
            return a
        }
        ,
        g = se.select = function(e, t, n, r) {
            var i, o, a, s, u, l = "function" == typeof e && e, c = !r && h(e = l.selector || e);
            if (n = n || [],
            1 === c.length) {
                if (2 < (o = c[0] = c[0].slice(0)).length && "ID" === (a = o[0]).type && 9 === t.nodeType && E && b.relative[o[1].type]) {
                    if (!(t = (b.find.ID(a.matches[0].replace(te, ne), t) || [])[0]))
                        return n;
                    l && (t = t.parentNode),
                    e = e.slice(o.shift().value.length)
                }
                i = G.needsContext.test(e) ? 0 : o.length;
                while (i--) {
                    if (a = o[i],
                    b.relative[s = a.type])
                        break;
                    if ((u = b.find[s]) && (r = u(a.matches[0].replace(te, ne), ee.test(o[0].type) && ye(t.parentNode) || t))) {
                        if (o.splice(i, 1),
                        !(e = r.length && xe(o)))
                            return H.apply(n, r),
                            n;
                        break
                    }
                }
            }
            return (l || f(e, c))(r, t, !E, n, !t || ee.test(e) && ye(t.parentNode) || t),
            n
        }
        ,
        d.sortStable = S.split("").sort(j).join("") === S,
        d.detectDuplicates = !!l,
        T(),
        d.sortDetached = ce(function(e) {
            return 1 & e.compareDocumentPosition(C.createElement("fieldset"))
        }),
        ce(function(e) {
            return e.innerHTML = "<a href='#'></a>",
            "#" === e.firstChild.getAttribute("href")
        }) || fe("type|href|height|width", function(e, t, n) {
            if (!n)
                return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
        }),
        d.attributes && ce(function(e) {
            return e.innerHTML = "<input/>",
            e.firstChild.setAttribute("value", ""),
            "" === e.firstChild.getAttribute("value")
        }) || fe("value", function(e, t, n) {
            if (!n && "input" === e.nodeName.toLowerCase())
                return e.defaultValue
        }),
        ce(function(e) {
            return null == e.getAttribute("disabled")
        }) || fe(R, function(e, t, n) {
            var r;
            if (!n)
                return !0 === e[t] ? t.toLowerCase() : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
        }),
        se
    }(C);
    S.find = d,
    S.expr = d.selectors,
    S.expr[":"] = S.expr.pseudos,
    S.uniqueSort = S.unique = d.uniqueSort,
    S.text = d.getText,
    S.isXMLDoc = d.isXML,
    S.contains = d.contains,
    S.escapeSelector = d.escape;
    var h = function(e, t, n) {
        var r = []
          , i = void 0 !== n;
        while ((e = e[t]) && 9 !== e.nodeType)
            if (1 === e.nodeType) {
                if (i && S(e).is(n))
                    break;
                r.push(e)
            }
        return r
    }
      , T = function(e, t) {
        for (var n = []; e; e = e.nextSibling)
            1 === e.nodeType && e !== t && n.push(e);
        return n
    }
      , k = S.expr.match.needsContext;
    function A(e, t) {
        return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
    }
    var N = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
    function j(e, n, r) {
        return m(n) ? S.grep(e, function(e, t) {
            return !!n.call(e, t, e) !== r
        }) : n.nodeType ? S.grep(e, function(e) {
            return e === n !== r
        }) : "string" != typeof n ? S.grep(e, function(e) {
            return -1 < i.call(n, e) !== r
        }) : S.filter(n, e, r)
    }
    S.filter = function(e, t, n) {
        var r = t[0];
        return n && (e = ":not(" + e + ")"),
        1 === t.length && 1 === r.nodeType ? S.find.matchesSelector(r, e) ? [r] : [] : S.find.matches(e, S.grep(t, function(e) {
            return 1 === e.nodeType
        }))
    }
    ,
    S.fn.extend({
        find: function(e) {
            var t, n, r = this.length, i = this;
            if ("string" != typeof e)
                return this.pushStack(S(e).filter(function() {
                    for (t = 0; t < r; t++)
                        if (S.contains(i[t], this))
                            return !0
                }));
            for (n = this.pushStack([]),
            t = 0; t < r; t++)
                S.find(e, i[t], n);
            return 1 < r ? S.uniqueSort(n) : n
        },
        filter: function(e) {
            return this.pushStack(j(this, e || [], !1))
        },
        not: function(e) {
            return this.pushStack(j(this, e || [], !0))
        },
        is: function(e) {
            return !!j(this, "string" == typeof e && k.test(e) ? S(e) : e || [], !1).length
        }
    });
    var D, q = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
    (S.fn.init = function(e, t, n) {
        var r, i;
        if (!e)
            return this;
        if (n = n || D,
        "string" == typeof e) {
            if (!(r = "<" === e[0] && ">" === e[e.length - 1] && 3 <= e.length ? [null, e, null] : q.exec(e)) || !r[1] && t)
                return !t || t.jquery ? (t || n).find(e) : this.constructor(t).find(e);
            if (r[1]) {
                if (t = t instanceof S ? t[0] : t,
                S.merge(this, S.parseHTML(r[1], t && t.nodeType ? t.ownerDocument || t : E, !0)),
                N.test(r[1]) && S.isPlainObject(t))
                    for (r in t)
                        m(this[r]) ? this[r](t[r]) : this.attr(r, t[r]);
                return this
            }
            return (i = E.getElementById(r[2])) && (this[0] = i,
            this.length = 1),
            this
        }
        return e.nodeType ? (this[0] = e,
        this.length = 1,
        this) : m(e) ? void 0 !== n.ready ? n.ready(e) : e(S) : S.makeArray(e, this)
    }
    ).prototype = S.fn,
    D = S(E);
    var L = /^(?:parents|prev(?:Until|All))/
      , H = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    function O(e, t) {
        while ((e = e[t]) && 1 !== e.nodeType)
            ;
        return e
    }
    S.fn.extend({
        has: function(e) {
            var t = S(e, this)
              , n = t.length;
            return this.filter(function() {
                for (var e = 0; e < n; e++)
                    if (S.contains(this, t[e]))
                        return !0
            })
        },
        closest: function(e, t) {
            var n, r = 0, i = this.length, o = [], a = "string" != typeof e && S(e);
            if (!k.test(e))
                for (; r < i; r++)
                    for (n = this[r]; n && n !== t; n = n.parentNode)
                        if (n.nodeType < 11 && (a ? -1 < a.index(n) : 1 === n.nodeType && S.find.matchesSelector(n, e))) {
                            o.push(n);
                            break
                        }
            return this.pushStack(1 < o.length ? S.uniqueSort(o) : o)
        },
        index: function(e) {
            return e ? "string" == typeof e ? i.call(S(e), this[0]) : i.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(e, t) {
            return this.pushStack(S.uniqueSort(S.merge(this.get(), S(e, t))))
        },
        addBack: function(e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    }),
    S.each({
        parent: function(e) {
            var t = e.parentNode;
            return t && 11 !== t.nodeType ? t : null
        },
        parents: function(e) {
            return h(e, "parentNode")
        },
        parentsUntil: function(e, t, n) {
            return h(e, "parentNode", n)
        },
        next: function(e) {
            return O(e, "nextSibling")
        },
        prev: function(e) {
            return O(e, "previousSibling")
        },
        nextAll: function(e) {
            return h(e, "nextSibling")
        },
        prevAll: function(e) {
            return h(e, "previousSibling")
        },
        nextUntil: function(e, t, n) {
            return h(e, "nextSibling", n)
        },
        prevUntil: function(e, t, n) {
            return h(e, "previousSibling", n)
        },
        siblings: function(e) {
            return T((e.parentNode || {}).firstChild, e)
        },
        children: function(e) {
            return T(e.firstChild)
        },
        contents: function(e) {
            return null != e.contentDocument && r(e.contentDocument) ? e.contentDocument : (A(e, "template") && (e = e.content || e),
            S.merge([], e.childNodes))
        }
    }, function(r, i) {
        S.fn[r] = function(e, t) {
            var n = S.map(this, i, e);
            return "Until" !== r.slice(-5) && (t = e),
            t && "string" == typeof t && (n = S.filter(t, n)),
            1 < this.length && (H[r] || S.uniqueSort(n),
            L.test(r) && n.reverse()),
            this.pushStack(n)
        }
    });
    var P = /[^\x20\t\r\n\f]+/g;
    function R(e) {
        return e
    }
    function M(e) {
        throw e
    }
    function I(e, t, n, r) {
        var i;
        try {
            e && m(i = e.promise) ? i.call(e).done(t).fail(n) : e && m(i = e.then) ? i.call(e, t, n) : t.apply(void 0, [e].slice(r))
        } catch (e) {
            n.apply(void 0, [e])
        }
    }
    S.Callbacks = function(r) {
        var e, n;
        r = "string" == typeof r ? (e = r,
        n = {},
        S.each(e.match(P) || [], function(e, t) {
            n[t] = !0
        }),
        n) : S.extend({}, r);
        var i, t, o, a, s = [], u = [], l = -1, c = function() {
            for (a = a || r.once,
            o = i = !0; u.length; l = -1) {
                t = u.shift();
                while (++l < s.length)
                    !1 === s[l].apply(t[0], t[1]) && r.stopOnFalse && (l = s.length,
                    t = !1)
            }
            r.memory || (t = !1),
            i = !1,
            a && (s = t ? [] : "")
        }, f = {
            add: function() {
                return s && (t && !i && (l = s.length - 1,
                u.push(t)),
                function n(e) {
                    S.each(e, function(e, t) {
                        m(t) ? r.unique && f.has(t) || s.push(t) : t && t.length && "string" !== w(t) && n(t)
                    })
                }(arguments),
                t && !i && c()),
                this
            },
            remove: function() {
                return S.each(arguments, function(e, t) {
                    var n;
                    while (-1 < (n = S.inArray(t, s, n)))
                        s.splice(n, 1),
                        n <= l && l--
                }),
                this
            },
            has: function(e) {
                return e ? -1 < S.inArray(e, s) : 0 < s.length
            },
            empty: function() {
                return s && (s = []),
                this
            },
            disable: function() {
                return a = u = [],
                s = t = "",
                this
            },
            disabled: function() {
                return !s
            },
            lock: function() {
                return a = u = [],
                t || i || (s = t = ""),
                this
            },
            locked: function() {
                return !!a
            },
            fireWith: function(e, t) {
                return a || (t = [e, (t = t || []).slice ? t.slice() : t],
                u.push(t),
                i || c()),
                this
            },
            fire: function() {
                return f.fireWith(this, arguments),
                this
            },
            fired: function() {
                return !!o
            }
        };
        return f
    }
    ,
    S.extend({
        Deferred: function(e) {
            var o = [["notify", "progress", S.Callbacks("memory"), S.Callbacks("memory"), 2], ["resolve", "done", S.Callbacks("once memory"), S.Callbacks("once memory"), 0, "resolved"], ["reject", "fail", S.Callbacks("once memory"), S.Callbacks("once memory"), 1, "rejected"]]
              , i = "pending"
              , a = {
                state: function() {
                    return i
                },
                always: function() {
                    return s.done(arguments).fail(arguments),
                    this
                },
                "catch": function(e) {
                    return a.then(null, e)
                },
                pipe: function() {
                    var i = arguments;
                    return S.Deferred(function(r) {
                        S.each(o, function(e, t) {
                            var n = m(i[t[4]]) && i[t[4]];
                            s[t[1]](function() {
                                var e = n && n.apply(this, arguments);
                                e && m(e.promise) ? e.promise().progress(r.notify).done(r.resolve).fail(r.reject) : r[t[0] + "With"](this, n ? [e] : arguments)
                            })
                        }),
                        i = null
                    }).promise()
                },
                then: function(t, n, r) {
                    var u = 0;
                    function l(i, o, a, s) {
                        return function() {
                            var n = this
                              , r = arguments
                              , e = function() {
                                var e, t;
                                if (!(i < u)) {
                                    if ((e = a.apply(n, r)) === o.promise())
                                        throw new TypeError("Thenable self-resolution");
                                    t = e && ("object" == typeof e || "function" == typeof e) && e.then,
                                    m(t) ? s ? t.call(e, l(u, o, R, s), l(u, o, M, s)) : (u++,
                                    t.call(e, l(u, o, R, s), l(u, o, M, s), l(u, o, R, o.notifyWith))) : (a !== R && (n = void 0,
                                    r = [e]),
                                    (s || o.resolveWith)(n, r))
                                }
                            }
                              , t = s ? e : function() {
                                try {
                                    e()
                                } catch (e) {
                                    S.Deferred.exceptionHook && S.Deferred.exceptionHook(e, t.stackTrace),
                                    u <= i + 1 && (a !== M && (n = void 0,
                                    r = [e]),
                                    o.rejectWith(n, r))
                                }
                            }
                            ;
                            i ? t() : (S.Deferred.getStackHook && (t.stackTrace = S.Deferred.getStackHook()),
                            C.setTimeout(t))
                        }
                    }
                    return S.Deferred(function(e) {
                        o[0][3].add(l(0, e, m(r) ? r : R, e.notifyWith)),
                        o[1][3].add(l(0, e, m(t) ? t : R)),
                        o[2][3].add(l(0, e, m(n) ? n : M))
                    }).promise()
                },
                promise: function(e) {
                    return null != e ? S.extend(e, a) : a
                }
            }
              , s = {};
            return S.each(o, function(e, t) {
                var n = t[2]
                  , r = t[5];
                a[t[1]] = n.add,
                r && n.add(function() {
                    i = r
                }, o[3 - e][2].disable, o[3 - e][3].disable, o[0][2].lock, o[0][3].lock),
                n.add(t[3].fire),
                s[t[0]] = function() {
                    return s[t[0] + "With"](this === s ? void 0 : this, arguments),
                    this
                }
                ,
                s[t[0] + "With"] = n.fireWith
            }),
            a.promise(s),
            e && e.call(s, s),
            s
        },
        when: function(e) {
            var n = arguments.length
              , t = n
              , r = Array(t)
              , i = s.call(arguments)
              , o = S.Deferred()
              , a = function(t) {
                return function(e) {
                    r[t] = this,
                    i[t] = 1 < arguments.length ? s.call(arguments) : e,
                    --n || o.resolveWith(r, i)
                }
            };
            if (n <= 1 && (I(e, o.done(a(t)).resolve, o.reject, !n),
            "pending" === o.state() || m(i[t] && i[t].then)))
                return o.then();
            while (t--)
                I(i[t], a(t), o.reject);
            return o.promise()
        }
    });
    var W = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
    S.Deferred.exceptionHook = function(e, t) {
        C.console && C.console.warn && e && W.test(e.name) && C.console.warn("jQuery.Deferred exception: " + e.message, e.stack, t)
    }
    ,
    S.readyException = function(e) {
        C.setTimeout(function() {
            throw e
        })
    }
    ;
    var F = S.Deferred();
    function B() {
        E.removeEventListener("DOMContentLoaded", B),
        C.removeEventListener("load", B),
        S.ready()
    }
    S.fn.ready = function(e) {
        return F.then(e)["catch"](function(e) {
            S.readyException(e)
        }),
        this
    }
    ,
    S.extend({
        isReady: !1,
        readyWait: 1,
        ready: function(e) {
            (!0 === e ? --S.readyWait : S.isReady) || (S.isReady = !0) !== e && 0 < --S.readyWait || F.resolveWith(E, [S])
        }
    }),
    S.ready.then = F.then,
    "complete" === E.readyState || "loading" !== E.readyState && !E.documentElement.doScroll ? C.setTimeout(S.ready) : (E.addEventListener("DOMContentLoaded", B),
    C.addEventListener("load", B));
    var $ = function(e, t, n, r, i, o, a) {
        var s = 0
          , u = e.length
          , l = null == n;
        if ("object" === w(n))
            for (s in i = !0,
            n)
                $(e, t, s, n[s], !0, o, a);
        else if (void 0 !== r && (i = !0,
        m(r) || (a = !0),
        l && (a ? (t.call(e, r),
        t = null) : (l = t,
        t = function(e, t, n) {
            return l.call(S(e), n)
        }
        )),
        t))
            for (; s < u; s++)
                t(e[s], n, a ? r : r.call(e[s], s, t(e[s], n)));
        return i ? e : l ? t.call(e) : u ? t(e[0], n) : o
    }
      , _ = /^-ms-/
      , z = /-([a-z])/g;
    function U(e, t) {
        return t.toUpperCase()
    }
    function X(e) {
        return e.replace(_, "ms-").replace(z, U)
    }
    var V = function(e) {
        return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
    };
    function G() {
        this.expando = S.expando + G.uid++
    }
    G.uid = 1,
    G.prototype = {
        cache: function(e) {
            var t = e[this.expando];
            return t || (t = {},
            V(e) && (e.nodeType ? e[this.expando] = t : Object.defineProperty(e, this.expando, {
                value: t,
                configurable: !0
            }))),
            t
        },
        set: function(e, t, n) {
            var r, i = this.cache(e);
            if ("string" == typeof t)
                i[X(t)] = n;
            else
                for (r in t)
                    i[X(r)] = t[r];
            return i
        },
        get: function(e, t) {
            return void 0 === t ? this.cache(e) : e[this.expando] && e[this.expando][X(t)]
        },
        access: function(e, t, n) {
            return void 0 === t || t && "string" == typeof t && void 0 === n ? this.get(e, t) : (this.set(e, t, n),
            void 0 !== n ? n : t)
        },
        remove: function(e, t) {
            var n, r = e[this.expando];
            if (void 0 !== r) {
                if (void 0 !== t) {
                    n = (t = Array.isArray(t) ? t.map(X) : (t = X(t))in r ? [t] : t.match(P) || []).length;
                    while (n--)
                        delete r[t[n]]
                }
                (void 0 === t || S.isEmptyObject(r)) && (e.nodeType ? e[this.expando] = void 0 : delete e[this.expando])
            }
        },
        hasData: function(e) {
            var t = e[this.expando];
            return void 0 !== t && !S.isEmptyObject(t)
        }
    };
    var Y = new G
      , Q = new G
      , J = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/
      , K = /[A-Z]/g;
    function Z(e, t, n) {
        var r, i;
        if (void 0 === n && 1 === e.nodeType)
            if (r = "data-" + t.replace(K, "-$&").toLowerCase(),
            "string" == typeof (n = e.getAttribute(r))) {
                try {
                    n = "true" === (i = n) || "false" !== i && ("null" === i ? null : i === +i + "" ? +i : J.test(i) ? JSON.parse(i) : i)
                } catch (e) {}
                Q.set(e, t, n)
            } else
                n = void 0;
        return n
    }
    S.extend({
        hasData: function(e) {
            return Q.hasData(e) || Y.hasData(e)
        },
        data: function(e, t, n) {
            return Q.access(e, t, n)
        },
        removeData: function(e, t) {
            Q.remove(e, t)
        },
        _data: function(e, t, n) {
            return Y.access(e, t, n)
        },
        _removeData: function(e, t) {
            Y.remove(e, t)
        }
    }),
    S.fn.extend({
        data: function(n, e) {
            var t, r, i, o = this[0], a = o && o.attributes;
            if (void 0 === n) {
                if (this.length && (i = Q.get(o),
                1 === o.nodeType && !Y.get(o, "hasDataAttrs"))) {
                    t = a.length;
                    while (t--)
                        a[t] && 0 === (r = a[t].name).indexOf("data-") && (r = X(r.slice(5)),
                        Z(o, r, i[r]));
                    Y.set(o, "hasDataAttrs", !0)
                }
                return i
            }
            return "object" == typeof n ? this.each(function() {
                Q.set(this, n)
            }) : $(this, function(e) {
                var t;
                if (o && void 0 === e)
                    return void 0 !== (t = Q.get(o, n)) ? t : void 0 !== (t = Z(o, n)) ? t : void 0;
                this.each(function() {
                    Q.set(this, n, e)
                })
            }, null, e, 1 < arguments.length, null, !0)
        },
        removeData: function(e) {
            return this.each(function() {
                Q.remove(this, e)
            })
        }
    }),
    S.extend({
        queue: function(e, t, n) {
            var r;
            if (e)
                return t = (t || "fx") + "queue",
                r = Y.get(e, t),
                n && (!r || Array.isArray(n) ? r = Y.access(e, t, S.makeArray(n)) : r.push(n)),
                r || []
        },
        dequeue: function(e, t) {
            t = t || "fx";
            var n = S.queue(e, t)
              , r = n.length
              , i = n.shift()
              , o = S._queueHooks(e, t);
            "inprogress" === i && (i = n.shift(),
            r--),
            i && ("fx" === t && n.unshift("inprogress"),
            delete o.stop,
            i.call(e, function() {
                S.dequeue(e, t)
            }, o)),
            !r && o && o.empty.fire()
        },
        _queueHooks: function(e, t) {
            var n = t + "queueHooks";
            return Y.get(e, n) || Y.access(e, n, {
                empty: S.Callbacks("once memory").add(function() {
                    Y.remove(e, [t + "queue", n])
                })
            })
        }
    }),
    S.fn.extend({
        queue: function(t, n) {
            var e = 2;
            return "string" != typeof t && (n = t,
            t = "fx",
            e--),
            arguments.length < e ? S.queue(this[0], t) : void 0 === n ? this : this.each(function() {
                var e = S.queue(this, t, n);
                S._queueHooks(this, t),
                "fx" === t && "inprogress" !== e[0] && S.dequeue(this, t)
            })
        },
        dequeue: function(e) {
            return this.each(function() {
                S.dequeue(this, e)
            })
        },
        clearQueue: function(e) {
            return this.queue(e || "fx", [])
        },
        promise: function(e, t) {
            var n, r = 1, i = S.Deferred(), o = this, a = this.length, s = function() {
                --r || i.resolveWith(o, [o])
            };
            "string" != typeof e && (t = e,
            e = void 0),
            e = e || "fx";
            while (a--)
                (n = Y.get(o[a], e + "queueHooks")) && n.empty && (r++,
                n.empty.add(s));
            return s(),
            i.promise(t)
        }
    });
    var ee = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source
      , te = new RegExp("^(?:([+-])=|)(" + ee + ")([a-z%]*)$","i")
      , ne = ["Top", "Right", "Bottom", "Left"]
      , re = E.documentElement
      , ie = function(e) {
        return S.contains(e.ownerDocument, e)
    }
      , oe = {
        composed: !0
    };
    re.getRootNode && (ie = function(e) {
        return S.contains(e.ownerDocument, e) || e.getRootNode(oe) === e.ownerDocument
    }
    );
    var ae = function(e, t) {
        return "none" === (e = t || e).style.display || "" === e.style.display && ie(e) && "none" === S.css(e, "display")
    };
    function se(e, t, n, r) {
        var i, o, a = 20, s = r ? function() {
            return r.cur()
        }
        : function() {
            return S.css(e, t, "")
        }
        , u = s(), l = n && n[3] || (S.cssNumber[t] ? "" : "px"), c = e.nodeType && (S.cssNumber[t] || "px" !== l && +u) && te.exec(S.css(e, t));
        if (c && c[3] !== l) {
            u /= 2,
            l = l || c[3],
            c = +u || 1;
            while (a--)
                S.style(e, t, c + l),
                (1 - o) * (1 - (o = s() / u || .5)) <= 0 && (a = 0),
                c /= o;
            c *= 2,
            S.style(e, t, c + l),
            n = n || []
        }
        return n && (c = +c || +u || 0,
        i = n[1] ? c + (n[1] + 1) * n[2] : +n[2],
        r && (r.unit = l,
        r.start = c,
        r.end = i)),
        i
    }
    var ue = {};
    function le(e, t) {
        for (var n, r, i, o, a, s, u, l = [], c = 0, f = e.length; c < f; c++)
            (r = e[c]).style && (n = r.style.display,
            t ? ("none" === n && (l[c] = Y.get(r, "display") || null,
            l[c] || (r.style.display = "")),
            "" === r.style.display && ae(r) && (l[c] = (u = a = o = void 0,
            a = (i = r).ownerDocument,
            s = i.nodeName,
            (u = ue[s]) || (o = a.body.appendChild(a.createElement(s)),
            u = S.css(o, "display"),
            o.parentNode.removeChild(o),
            "none" === u && (u = "block"),
            ue[s] = u)))) : "none" !== n && (l[c] = "none",
            Y.set(r, "display", n)));
        for (c = 0; c < f; c++)
            null != l[c] && (e[c].style.display = l[c]);
        return e
    }
    S.fn.extend({
        show: function() {
            return le(this, !0)
        },
        hide: function() {
            return le(this)
        },
        toggle: function(e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                ae(this) ? S(this).show() : S(this).hide()
            })
        }
    });
    var ce, fe, pe = /^(?:checkbox|radio)$/i, de = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i, he = /^$|^module$|\/(?:java|ecma)script/i;
    ce = E.createDocumentFragment().appendChild(E.createElement("div")),
    (fe = E.createElement("input")).setAttribute("type", "radio"),
    fe.setAttribute("checked", "checked"),
    fe.setAttribute("name", "t"),
    ce.appendChild(fe),
    y.checkClone = ce.cloneNode(!0).cloneNode(!0).lastChild.checked,
    ce.innerHTML = "<textarea>x</textarea>",
    y.noCloneChecked = !!ce.cloneNode(!0).lastChild.defaultValue,
    ce.innerHTML = "<option></option>",
    y.option = !!ce.lastChild;
    var ge = {
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: [0, "", ""]
    };
    function ve(e, t) {
        var n;
        return n = "undefined" != typeof e.getElementsByTagName ? e.getElementsByTagName(t || "*") : "undefined" != typeof e.querySelectorAll ? e.querySelectorAll(t || "*") : [],
        void 0 === t || t && A(e, t) ? S.merge([e], n) : n
    }
    function ye(e, t) {
        for (var n = 0, r = e.length; n < r; n++)
            Y.set(e[n], "globalEval", !t || Y.get(t[n], "globalEval"))
    }
    ge.tbody = ge.tfoot = ge.colgroup = ge.caption = ge.thead,
    ge.th = ge.td,
    y.option || (ge.optgroup = ge.option = [1, "<select multiple='multiple'>", "</select>"]);
    var me = /<|&#?\w+;/;
    function xe(e, t, n, r, i) {
        for (var o, a, s, u, l, c, f = t.createDocumentFragment(), p = [], d = 0, h = e.length; d < h; d++)
            if ((o = e[d]) || 0 === o)
                if ("object" === w(o))
                    S.merge(p, o.nodeType ? [o] : o);
                else if (me.test(o)) {
                    a = a || f.appendChild(t.createElement("div")),
                    s = (de.exec(o) || ["", ""])[1].toLowerCase(),
                    u = ge[s] || ge._default,
                    a.innerHTML = u[1] + S.htmlPrefilter(o) + u[2],
                    c = u[0];
                    while (c--)
                        a = a.lastChild;
                    S.merge(p, a.childNodes),
                    (a = f.firstChild).textContent = ""
                } else
                    p.push(t.createTextNode(o));
        f.textContent = "",
        d = 0;
        while (o = p[d++])
            if (r && -1 < S.inArray(o, r))
                i && i.push(o);
            else if (l = ie(o),
            a = ve(f.appendChild(o), "script"),
            l && ye(a),
            n) {
                c = 0;
                while (o = a[c++])
                    he.test(o.type || "") && n.push(o)
            }
        return f
    }
    var be = /^([^.]*)(?:\.(.+)|)/;
    function we() {
        return !0
    }
    function Te() {
        return !1
    }
    function Ce(e, t) {
        return e === function() {
            try {
                return E.activeElement
            } catch (e) {}
        }() == ("focus" === t)
    }
    function Ee(e, t, n, r, i, o) {
        var a, s;
        if ("object" == typeof t) {
            for (s in "string" != typeof n && (r = r || n,
            n = void 0),
            t)
                Ee(e, s, n, r, t[s], o);
            return e
        }
        if (null == r && null == i ? (i = n,
        r = n = void 0) : null == i && ("string" == typeof n ? (i = r,
        r = void 0) : (i = r,
        r = n,
        n = void 0)),
        !1 === i)
            i = Te;
        else if (!i)
            return e;
        return 1 === o && (a = i,
        (i = function(e) {
            return S().off(e),
            a.apply(this, arguments)
        }
        ).guid = a.guid || (a.guid = S.guid++)),
        e.each(function() {
            S.event.add(this, t, i, r, n)
        })
    }
    function Se(e, i, o) {
        o ? (Y.set(e, i, !1),
        S.event.add(e, i, {
            namespace: !1,
            handler: function(e) {
                var t, n, r = Y.get(this, i);
                if (1 & e.isTrigger && this[i]) {
                    if (r.length)
                        (S.event.special[i] || {}).delegateType && e.stopPropagation();
                    else if (r = s.call(arguments),
                    Y.set(this, i, r),
                    t = o(this, i),
                    this[i](),
                    r !== (n = Y.get(this, i)) || t ? Y.set(this, i, !1) : n = {},
                    r !== n)
                        return e.stopImmediatePropagation(),
                        e.preventDefault(),
                        n && n.value
                } else
                    r.length && (Y.set(this, i, {
                        value: S.event.trigger(S.extend(r[0], S.Event.prototype), r.slice(1), this)
                    }),
                    e.stopImmediatePropagation())
            }
        })) : void 0 === Y.get(e, i) && S.event.add(e, i, we)
    }
    S.event = {
        global: {},
        add: function(t, e, n, r, i) {
            var o, a, s, u, l, c, f, p, d, h, g, v = Y.get(t);
            if (V(t)) {
                n.handler && (n = (o = n).handler,
                i = o.selector),
                i && S.find.matchesSelector(re, i),
                n.guid || (n.guid = S.guid++),
                (u = v.events) || (u = v.events = Object.create(null)),
                (a = v.handle) || (a = v.handle = function(e) {
                    return "undefined" != typeof S && S.event.triggered !== e.type ? S.event.dispatch.apply(t, arguments) : void 0
                }
                ),
                l = (e = (e || "").match(P) || [""]).length;
                while (l--)
                    d = g = (s = be.exec(e[l]) || [])[1],
                    h = (s[2] || "").split(".").sort(),
                    d && (f = S.event.special[d] || {},
                    d = (i ? f.delegateType : f.bindType) || d,
                    f = S.event.special[d] || {},
                    c = S.extend({
                        type: d,
                        origType: g,
                        data: r,
                        handler: n,
                        guid: n.guid,
                        selector: i,
                        needsContext: i && S.expr.match.needsContext.test(i),
                        namespace: h.join(".")
                    }, o),
                    (p = u[d]) || ((p = u[d] = []).delegateCount = 0,
                    f.setup && !1 !== f.setup.call(t, r, h, a) || t.addEventListener && t.addEventListener(d, a)),
                    f.add && (f.add.call(t, c),
                    c.handler.guid || (c.handler.guid = n.guid)),
                    i ? p.splice(p.delegateCount++, 0, c) : p.push(c),
                    S.event.global[d] = !0)
            }
        },
        remove: function(e, t, n, r, i) {
            var o, a, s, u, l, c, f, p, d, h, g, v = Y.hasData(e) && Y.get(e);
            if (v && (u = v.events)) {
                l = (t = (t || "").match(P) || [""]).length;
                while (l--)
                    if (d = g = (s = be.exec(t[l]) || [])[1],
                    h = (s[2] || "").split(".").sort(),
                    d) {
                        f = S.event.special[d] || {},
                        p = u[d = (r ? f.delegateType : f.bindType) || d] || [],
                        s = s[2] && new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                        a = o = p.length;
                        while (o--)
                            c = p[o],
                            !i && g !== c.origType || n && n.guid !== c.guid || s && !s.test(c.namespace) || r && r !== c.selector && ("**" !== r || !c.selector) || (p.splice(o, 1),
                            c.selector && p.delegateCount--,
                            f.remove && f.remove.call(e, c));
                        a && !p.length && (f.teardown && !1 !== f.teardown.call(e, h, v.handle) || S.removeEvent(e, d, v.handle),
                        delete u[d])
                    } else
                        for (d in u)
                            S.event.remove(e, d + t[l], n, r, !0);
                S.isEmptyObject(u) && Y.remove(e, "handle events")
            }
        },
        dispatch: function(e) {
            var t, n, r, i, o, a, s = new Array(arguments.length), u = S.event.fix(e), l = (Y.get(this, "events") || Object.create(null))[u.type] || [], c = S.event.special[u.type] || {};
            for (s[0] = u,
            t = 1; t < arguments.length; t++)
                s[t] = arguments[t];
            if (u.delegateTarget = this,
            !c.preDispatch || !1 !== c.preDispatch.call(this, u)) {
                a = S.event.handlers.call(this, u, l),
                t = 0;
                while ((i = a[t++]) && !u.isPropagationStopped()) {
                    u.currentTarget = i.elem,
                    n = 0;
                    while ((o = i.handlers[n++]) && !u.isImmediatePropagationStopped())
                        u.rnamespace && !1 !== o.namespace && !u.rnamespace.test(o.namespace) || (u.handleObj = o,
                        u.data = o.data,
                        void 0 !== (r = ((S.event.special[o.origType] || {}).handle || o.handler).apply(i.elem, s)) && !1 === (u.result = r) && (u.preventDefault(),
                        u.stopPropagation()))
                }
                return c.postDispatch && c.postDispatch.call(this, u),
                u.result
            }
        },
        handlers: function(e, t) {
            var n, r, i, o, a, s = [], u = t.delegateCount, l = e.target;
            if (u && l.nodeType && !("click" === e.type && 1 <= e.button))
                for (; l !== this; l = l.parentNode || this)
                    if (1 === l.nodeType && ("click" !== e.type || !0 !== l.disabled)) {
                        for (o = [],
                        a = {},
                        n = 0; n < u; n++)
                            void 0 === a[i = (r = t[n]).selector + " "] && (a[i] = r.needsContext ? -1 < S(i, this).index(l) : S.find(i, this, null, [l]).length),
                            a[i] && o.push(r);
                        o.length && s.push({
                            elem: l,
                            handlers: o
                        })
                    }
            return l = this,
            u < t.length && s.push({
                elem: l,
                handlers: t.slice(u)
            }),
            s
        },
        addProp: function(t, e) {
            Object.defineProperty(S.Event.prototype, t, {
                enumerable: !0,
                configurable: !0,
                get: m(e) ? function() {
                    if (this.originalEvent)
                        return e(this.originalEvent)
                }
                : function() {
                    if (this.originalEvent)
                        return this.originalEvent[t]
                }
                ,
                set: function(e) {
                    Object.defineProperty(this, t, {
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                        value: e
                    })
                }
            })
        },
        fix: function(e) {
            return e[S.expando] ? e : new S.Event(e)
        },
        special: {
            load: {
                noBubble: !0
            },
            click: {
                setup: function(e) {
                    var t = this || e;
                    return pe.test(t.type) && t.click && A(t, "input") && Se(t, "click", we),
                    !1
                },
                trigger: function(e) {
                    var t = this || e;
                    return pe.test(t.type) && t.click && A(t, "input") && Se(t, "click"),
                    !0
                },
                _default: function(e) {
                    var t = e.target;
                    return pe.test(t.type) && t.click && A(t, "input") && Y.get(t, "click") || A(t, "a")
                }
            },
            beforeunload: {
                postDispatch: function(e) {
                    void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                }
            }
        }
    },
    S.removeEvent = function(e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n)
    }
    ,
    S.Event = function(e, t) {
        if (!(this instanceof S.Event))
            return new S.Event(e,t);
        e && e.type ? (this.originalEvent = e,
        this.type = e.type,
        this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && !1 === e.returnValue ? we : Te,
        this.target = e.target && 3 === e.target.nodeType ? e.target.parentNode : e.target,
        this.currentTarget = e.currentTarget,
        this.relatedTarget = e.relatedTarget) : this.type = e,
        t && S.extend(this, t),
        this.timeStamp = e && e.timeStamp || Date.now(),
        this[S.expando] = !0
    }
    ,
    S.Event.prototype = {
        constructor: S.Event,
        isDefaultPrevented: Te,
        isPropagationStopped: Te,
        isImmediatePropagationStopped: Te,
        isSimulated: !1,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = we,
            e && !this.isSimulated && e.preventDefault()
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = we,
            e && !this.isSimulated && e.stopPropagation()
        },
        stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = we,
            e && !this.isSimulated && e.stopImmediatePropagation(),
            this.stopPropagation()
        }
    },
    S.each({
        altKey: !0,
        bubbles: !0,
        cancelable: !0,
        changedTouches: !0,
        ctrlKey: !0,
        detail: !0,
        eventPhase: !0,
        metaKey: !0,
        pageX: !0,
        pageY: !0,
        shiftKey: !0,
        view: !0,
        "char": !0,
        code: !0,
        charCode: !0,
        key: !0,
        keyCode: !0,
        button: !0,
        buttons: !0,
        clientX: !0,
        clientY: !0,
        offsetX: !0,
        offsetY: !0,
        pointerId: !0,
        pointerType: !0,
        screenX: !0,
        screenY: !0,
        targetTouches: !0,
        toElement: !0,
        touches: !0,
        which: !0
    }, S.event.addProp),
    S.each({
        focus: "focusin",
        blur: "focusout"
    }, function(e, t) {
        S.event.special[e] = {
            setup: function() {
                return Se(this, e, Ce),
                !1
            },
            trigger: function() {
                return Se(this, e),
                !0
            },
            _default: function() {
                return !0
            },
            delegateType: t
        }
    }),
    S.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(e, i) {
        S.event.special[e] = {
            delegateType: i,
            bindType: i,
            handle: function(e) {
                var t, n = e.relatedTarget, r = e.handleObj;
                return n && (n === this || S.contains(this, n)) || (e.type = r.origType,
                t = r.handler.apply(this, arguments),
                e.type = i),
                t
            }
        }
    }),
    S.fn.extend({
        on: function(e, t, n, r) {
            return Ee(this, e, t, n, r)
        },
        one: function(e, t, n, r) {
            return Ee(this, e, t, n, r, 1)
        },
        off: function(e, t, n) {
            var r, i;
            if (e && e.preventDefault && e.handleObj)
                return r = e.handleObj,
                S(e.delegateTarget).off(r.namespace ? r.origType + "." + r.namespace : r.origType, r.selector, r.handler),
                this;
            if ("object" == typeof e) {
                for (i in e)
                    this.off(i, t, e[i]);
                return this
            }
            return !1 !== t && "function" != typeof t || (n = t,
            t = void 0),
            !1 === n && (n = Te),
            this.each(function() {
                S.event.remove(this, e, n, t)
            })
        }
    });
    var ke = /<script|<style|<link/i
      , Ae = /checked\s*(?:[^=]|=\s*.checked.)/i
      , Ne = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
    function je(e, t) {
        return A(e, "table") && A(11 !== t.nodeType ? t : t.firstChild, "tr") && S(e).children("tbody")[0] || e
    }
    function De(e) {
        return e.type = (null !== e.getAttribute("type")) + "/" + e.type,
        e
    }
    function qe(e) {
        return "true/" === (e.type || "").slice(0, 5) ? e.type = e.type.slice(5) : e.removeAttribute("type"),
        e
    }
    function Le(e, t) {
        var n, r, i, o, a, s;
        if (1 === t.nodeType) {
            if (Y.hasData(e) && (s = Y.get(e).events))
                for (i in Y.remove(t, "handle events"),
                s)
                    for (n = 0,
                    r = s[i].length; n < r; n++)
                        S.event.add(t, i, s[i][n]);
            Q.hasData(e) && (o = Q.access(e),
            a = S.extend({}, o),
            Q.set(t, a))
        }
    }
    function He(n, r, i, o) {
        r = g(r);
        var e, t, a, s, u, l, c = 0, f = n.length, p = f - 1, d = r[0], h = m(d);
        if (h || 1 < f && "string" == typeof d && !y.checkClone && Ae.test(d))
            return n.each(function(e) {
                var t = n.eq(e);
                h && (r[0] = d.call(this, e, t.html())),
                He(t, r, i, o)
            });
        if (f && (t = (e = xe(r, n[0].ownerDocument, !1, n, o)).firstChild,
        1 === e.childNodes.length && (e = t),
        t || o)) {
            for (s = (a = S.map(ve(e, "script"), De)).length; c < f; c++)
                u = e,
                c !== p && (u = S.clone(u, !0, !0),
                s && S.merge(a, ve(u, "script"))),
                i.call(n[c], u, c);
            if (s)
                for (l = a[a.length - 1].ownerDocument,
                S.map(a, qe),
                c = 0; c < s; c++)
                    u = a[c],
                    he.test(u.type || "") && !Y.access(u, "globalEval") && S.contains(l, u) && (u.src && "module" !== (u.type || "").toLowerCase() ? S._evalUrl && !u.noModule && S._evalUrl(u.src, {
                        nonce: u.nonce || u.getAttribute("nonce")
                    }, l) : b(u.textContent.replace(Ne, ""), u, l))
        }
        return n
    }
    function Oe(e, t, n) {
        for (var r, i = t ? S.filter(t, e) : e, o = 0; null != (r = i[o]); o++)
            n || 1 !== r.nodeType || S.cleanData(ve(r)),
            r.parentNode && (n && ie(r) && ye(ve(r, "script")),
            r.parentNode.removeChild(r));
        return e
    }
    S.extend({
        htmlPrefilter: function(e) {
            return e
        },
        clone: function(e, t, n) {
            var r, i, o, a, s, u, l, c = e.cloneNode(!0), f = ie(e);
            if (!(y.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || S.isXMLDoc(e)))
                for (a = ve(c),
                r = 0,
                i = (o = ve(e)).length; r < i; r++)
                    s = o[r],
                    u = a[r],
                    void 0,
                    "input" === (l = u.nodeName.toLowerCase()) && pe.test(s.type) ? u.checked = s.checked : "input" !== l && "textarea" !== l || (u.defaultValue = s.defaultValue);
            if (t)
                if (n)
                    for (o = o || ve(e),
                    a = a || ve(c),
                    r = 0,
                    i = o.length; r < i; r++)
                        Le(o[r], a[r]);
                else
                    Le(e, c);
            return 0 < (a = ve(c, "script")).length && ye(a, !f && ve(e, "script")),
            c
        },
        cleanData: function(e) {
            for (var t, n, r, i = S.event.special, o = 0; void 0 !== (n = e[o]); o++)
                if (V(n)) {
                    if (t = n[Y.expando]) {
                        if (t.events)
                            for (r in t.events)
                                i[r] ? S.event.remove(n, r) : S.removeEvent(n, r, t.handle);
                        n[Y.expando] = void 0
                    }
                    n[Q.expando] && (n[Q.expando] = void 0)
                }
        }
    }),
    S.fn.extend({
        detach: function(e) {
            return Oe(this, e, !0)
        },
        remove: function(e) {
            return Oe(this, e)
        },
        text: function(e) {
            return $(this, function(e) {
                return void 0 === e ? S.text(this) : this.empty().each(function() {
                    1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = e)
                })
            }, null, e, arguments.length)
        },
        append: function() {
            return He(this, arguments, function(e) {
                1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || je(this, e).appendChild(e)
            })
        },
        prepend: function() {
            return He(this, arguments, function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = je(this, e);
                    t.insertBefore(e, t.firstChild)
                }
            })
        },
        before: function() {
            return He(this, arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this)
            })
        },
        after: function() {
            return He(this, arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            })
        },
        empty: function() {
            for (var e, t = 0; null != (e = this[t]); t++)
                1 === e.nodeType && (S.cleanData(ve(e, !1)),
                e.textContent = "");
            return this
        },
        clone: function(e, t) {
            return e = null != e && e,
            t = null == t ? e : t,
            this.map(function() {
                return S.clone(this, e, t)
            })
        },
        html: function(e) {
            return $(this, function(e) {
                var t = this[0] || {}
                  , n = 0
                  , r = this.length;
                if (void 0 === e && 1 === t.nodeType)
                    return t.innerHTML;
                if ("string" == typeof e && !ke.test(e) && !ge[(de.exec(e) || ["", ""])[1].toLowerCase()]) {
                    e = S.htmlPrefilter(e);
                    try {
                        for (; n < r; n++)
                            1 === (t = this[n] || {}).nodeType && (S.cleanData(ve(t, !1)),
                            t.innerHTML = e);
                        t = 0
                    } catch (e) {}
                }
                t && this.empty().append(e)
            }, null, e, arguments.length)
        },
        replaceWith: function() {
            var n = [];
            return He(this, arguments, function(e) {
                var t = this.parentNode;
                S.inArray(this, n) < 0 && (S.cleanData(ve(this)),
                t && t.replaceChild(e, this))
            }, n)
        }
    }),
    S.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(e, a) {
        S.fn[e] = function(e) {
            for (var t, n = [], r = S(e), i = r.length - 1, o = 0; o <= i; o++)
                t = o === i ? this : this.clone(!0),
                S(r[o])[a](t),
                u.apply(n, t.get());
            return this.pushStack(n)
        }
    });
    var Pe = new RegExp("^(" + ee + ")(?!px)[a-z%]+$","i")
      , Re = function(e) {
        var t = e.ownerDocument.defaultView;
        return t && t.opener || (t = C),
        t.getComputedStyle(e)
    }
      , Me = function(e, t, n) {
        var r, i, o = {};
        for (i in t)
            o[i] = e.style[i],
            e.style[i] = t[i];
        for (i in r = n.call(e),
        t)
            e.style[i] = o[i];
        return r
    }
      , Ie = new RegExp(ne.join("|"),"i");
    function We(e, t, n) {
        var r, i, o, a, s = e.style;
        return (n = n || Re(e)) && ("" !== (a = n.getPropertyValue(t) || n[t]) || ie(e) || (a = S.style(e, t)),
        !y.pixelBoxStyles() && Pe.test(a) && Ie.test(t) && (r = s.width,
        i = s.minWidth,
        o = s.maxWidth,
        s.minWidth = s.maxWidth = s.width = a,
        a = n.width,
        s.width = r,
        s.minWidth = i,
        s.maxWidth = o)),
        void 0 !== a ? a + "" : a
    }
    function Fe(e, t) {
        return {
            get: function() {
                if (!e())
                    return (this.get = t).apply(this, arguments);
                delete this.get
            }
        }
    }
    !function() {
        function e() {
            if (l) {
                u.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",
                l.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",
                re.appendChild(u).appendChild(l);
                var e = C.getComputedStyle(l);
                n = "1%" !== e.top,
                s = 12 === t(e.marginLeft),
                l.style.right = "60%",
                o = 36 === t(e.right),
                r = 36 === t(e.width),
                l.style.position = "absolute",
                i = 12 === t(l.offsetWidth / 3),
                re.removeChild(u),
                l = null
            }
        }
        function t(e) {
            return Math.round(parseFloat(e))
        }
        var n, r, i, o, a, s, u = E.createElement("div"), l = E.createElement("div");
        l.style && (l.style.backgroundClip = "content-box",
        l.cloneNode(!0).style.backgroundClip = "",
        y.clearCloneStyle = "content-box" === l.style.backgroundClip,
        S.extend(y, {
            boxSizingReliable: function() {
                return e(),
                r
            },
            pixelBoxStyles: function() {
                return e(),
                o
            },
            pixelPosition: function() {
                return e(),
                n
            },
            reliableMarginLeft: function() {
                return e(),
                s
            },
            scrollboxSize: function() {
                return e(),
                i
            },
            reliableTrDimensions: function() {
                var e, t, n, r;
                return null == a && (e = E.createElement("table"),
                t = E.createElement("tr"),
                n = E.createElement("div"),
                e.style.cssText = "position:absolute;left:-11111px;border-collapse:separate",
                t.style.cssText = "border:1px solid",
                t.style.height = "1px",
                n.style.height = "9px",
                n.style.display = "block",
                re.appendChild(e).appendChild(t).appendChild(n),
                r = C.getComputedStyle(t),
                a = parseInt(r.height, 10) + parseInt(r.borderTopWidth, 10) + parseInt(r.borderBottomWidth, 10) === t.offsetHeight,
                re.removeChild(e)),
                a
            }
        }))
    }();
    var Be = ["Webkit", "Moz", "ms"]
      , $e = E.createElement("div").style
      , _e = {};
    function ze(e) {
        var t = S.cssProps[e] || _e[e];
        return t || (e in $e ? e : _e[e] = function(e) {
            var t = e[0].toUpperCase() + e.slice(1)
              , n = Be.length;
            while (n--)
                if ((e = Be[n] + t)in $e)
                    return e
        }(e) || e)
    }
    var Ue = /^(none|table(?!-c[ea]).+)/
      , Xe = /^--/
      , Ve = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }
      , Ge = {
        letterSpacing: "0",
        fontWeight: "400"
    };
    function Ye(e, t, n) {
        var r = te.exec(t);
        return r ? Math.max(0, r[2] - (n || 0)) + (r[3] || "px") : t
    }
    function Qe(e, t, n, r, i, o) {
        var a = "width" === t ? 1 : 0
          , s = 0
          , u = 0;
        if (n === (r ? "border" : "content"))
            return 0;
        for (; a < 4; a += 2)
            "margin" === n && (u += S.css(e, n + ne[a], !0, i)),
            r ? ("content" === n && (u -= S.css(e, "padding" + ne[a], !0, i)),
            "margin" !== n && (u -= S.css(e, "border" + ne[a] + "Width", !0, i))) : (u += S.css(e, "padding" + ne[a], !0, i),
            "padding" !== n ? u += S.css(e, "border" + ne[a] + "Width", !0, i) : s += S.css(e, "border" + ne[a] + "Width", !0, i));
        return !r && 0 <= o && (u += Math.max(0, Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - o - u - s - .5)) || 0),
        u
    }
    function Je(e, t, n) {
        var r = Re(e)
          , i = (!y.boxSizingReliable() || n) && "border-box" === S.css(e, "boxSizing", !1, r)
          , o = i
          , a = We(e, t, r)
          , s = "offset" + t[0].toUpperCase() + t.slice(1);
        if (Pe.test(a)) {
            if (!n)
                return a;
            a = "auto"
        }
        return (!y.boxSizingReliable() && i || !y.reliableTrDimensions() && A(e, "tr") || "auto" === a || !parseFloat(a) && "inline" === S.css(e, "display", !1, r)) && e.getClientRects().length && (i = "border-box" === S.css(e, "boxSizing", !1, r),
        (o = s in e) && (a = e[s])),
        (a = parseFloat(a) || 0) + Qe(e, t, n || (i ? "border" : "content"), o, r, a) + "px"
    }
    function Ke(e, t, n, r, i) {
        return new Ke.prototype.init(e,t,n,r,i)
    }
    S.extend({
        cssHooks: {
            opacity: {
                get: function(e, t) {
                    if (t) {
                        var n = We(e, "opacity");
                        return "" === n ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            animationIterationCount: !0,
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            gridArea: !0,
            gridColumn: !0,
            gridColumnEnd: !0,
            gridColumnStart: !0,
            gridRow: !0,
            gridRowEnd: !0,
            gridRowStart: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {},
        style: function(e, t, n, r) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var i, o, a, s = X(t), u = Xe.test(t), l = e.style;
                if (u || (t = ze(s)),
                a = S.cssHooks[t] || S.cssHooks[s],
                void 0 === n)
                    return a && "get"in a && void 0 !== (i = a.get(e, !1, r)) ? i : l[t];
                "string" === (o = typeof n) && (i = te.exec(n)) && i[1] && (n = se(e, t, i),
                o = "number"),
                null != n && n == n && ("number" !== o || u || (n += i && i[3] || (S.cssNumber[s] ? "" : "px")),
                y.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (l[t] = "inherit"),
                a && "set"in a && void 0 === (n = a.set(e, n, r)) || (u ? l.setProperty(t, n) : l[t] = n))
            }
        },
        css: function(e, t, n, r) {
            var i, o, a, s = X(t);
            return Xe.test(t) || (t = ze(s)),
            (a = S.cssHooks[t] || S.cssHooks[s]) && "get"in a && (i = a.get(e, !0, n)),
            void 0 === i && (i = We(e, t, r)),
            "normal" === i && t in Ge && (i = Ge[t]),
            "" === n || n ? (o = parseFloat(i),
            !0 === n || isFinite(o) ? o || 0 : i) : i
        }
    }),
    S.each(["height", "width"], function(e, u) {
        S.cssHooks[u] = {
            get: function(e, t, n) {
                if (t)
                    return !Ue.test(S.css(e, "display")) || e.getClientRects().length && e.getBoundingClientRect().width ? Je(e, u, n) : Me(e, Ve, function() {
                        return Je(e, u, n)
                    })
            },
            set: function(e, t, n) {
                var r, i = Re(e), o = !y.scrollboxSize() && "absolute" === i.position, a = (o || n) && "border-box" === S.css(e, "boxSizing", !1, i), s = n ? Qe(e, u, n, a, i) : 0;
                return a && o && (s -= Math.ceil(e["offset" + u[0].toUpperCase() + u.slice(1)] - parseFloat(i[u]) - Qe(e, u, "border", !1, i) - .5)),
                s && (r = te.exec(t)) && "px" !== (r[3] || "px") && (e.style[u] = t,
                t = S.css(e, u)),
                Ye(0, t, s)
            }
        }
    }),
    S.cssHooks.marginLeft = Fe(y.reliableMarginLeft, function(e, t) {
        if (t)
            return (parseFloat(We(e, "marginLeft")) || e.getBoundingClientRect().left - Me(e, {
                marginLeft: 0
            }, function() {
                return e.getBoundingClientRect().left
            })) + "px"
    }),
    S.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(i, o) {
        S.cssHooks[i + o] = {
            expand: function(e) {
                for (var t = 0, n = {}, r = "string" == typeof e ? e.split(" ") : [e]; t < 4; t++)
                    n[i + ne[t] + o] = r[t] || r[t - 2] || r[0];
                return n
            }
        },
        "margin" !== i && (S.cssHooks[i + o].set = Ye)
    }),
    S.fn.extend({
        css: function(e, t) {
            return $(this, function(e, t, n) {
                var r, i, o = {}, a = 0;
                if (Array.isArray(t)) {
                    for (r = Re(e),
                    i = t.length; a < i; a++)
                        o[t[a]] = S.css(e, t[a], !1, r);
                    return o
                }
                return void 0 !== n ? S.style(e, t, n) : S.css(e, t)
            }, e, t, 1 < arguments.length)
        }
    }),
    ((S.Tween = Ke).prototype = {
        constructor: Ke,
        init: function(e, t, n, r, i, o) {
            this.elem = e,
            this.prop = n,
            this.easing = i || S.easing._default,
            this.options = t,
            this.start = this.now = this.cur(),
            this.end = r,
            this.unit = o || (S.cssNumber[n] ? "" : "px")
        },
        cur: function() {
            var e = Ke.propHooks[this.prop];
            return e && e.get ? e.get(this) : Ke.propHooks._default.get(this)
        },
        run: function(e) {
            var t, n = Ke.propHooks[this.prop];
            return this.options.duration ? this.pos = t = S.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e,
            this.now = (this.end - this.start) * t + this.start,
            this.options.step && this.options.step.call(this.elem, this.now, this),
            n && n.set ? n.set(this) : Ke.propHooks._default.set(this),
            this
        }
    }).init.prototype = Ke.prototype,
    (Ke.propHooks = {
        _default: {
            get: function(e) {
                var t;
                return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (t = S.css(e.elem, e.prop, "")) && "auto" !== t ? t : 0
            },
            set: function(e) {
                S.fx.step[e.prop] ? S.fx.step[e.prop](e) : 1 !== e.elem.nodeType || !S.cssHooks[e.prop] && null == e.elem.style[ze(e.prop)] ? e.elem[e.prop] = e.now : S.style(e.elem, e.prop, e.now + e.unit)
            }
        }
    }).scrollTop = Ke.propHooks.scrollLeft = {
        set: function(e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    },
    S.easing = {
        linear: function(e) {
            return e
        },
        swing: function(e) {
            return .5 - Math.cos(e * Math.PI) / 2
        },
        _default: "swing"
    },
    S.fx = Ke.prototype.init,
    S.fx.step = {};
    var Ze, et, tt, nt, rt = /^(?:toggle|show|hide)$/, it = /queueHooks$/;
    function ot() {
        et && (!1 === E.hidden && C.requestAnimationFrame ? C.requestAnimationFrame(ot) : C.setTimeout(ot, S.fx.interval),
        S.fx.tick())
    }
    function at() {
        return C.setTimeout(function() {
            Ze = void 0
        }),
        Ze = Date.now()
    }
    function st(e, t) {
        var n, r = 0, i = {
            height: e
        };
        for (t = t ? 1 : 0; r < 4; r += 2 - t)
            i["margin" + (n = ne[r])] = i["padding" + n] = e;
        return t && (i.opacity = i.width = e),
        i
    }
    function ut(e, t, n) {
        for (var r, i = (lt.tweeners[t] || []).concat(lt.tweeners["*"]), o = 0, a = i.length; o < a; o++)
            if (r = i[o].call(n, t, e))
                return r
    }
    function lt(o, e, t) {
        var n, a, r = 0, i = lt.prefilters.length, s = S.Deferred().always(function() {
            delete u.elem
        }), u = function() {
            if (a)
                return !1;
            for (var e = Ze || at(), t = Math.max(0, l.startTime + l.duration - e), n = 1 - (t / l.duration || 0), r = 0, i = l.tweens.length; r < i; r++)
                l.tweens[r].run(n);
            return s.notifyWith(o, [l, n, t]),
            n < 1 && i ? t : (i || s.notifyWith(o, [l, 1, 0]),
            s.resolveWith(o, [l]),
            !1)
        }, l = s.promise({
            elem: o,
            props: S.extend({}, e),
            opts: S.extend(!0, {
                specialEasing: {},
                easing: S.easing._default
            }, t),
            originalProperties: e,
            originalOptions: t,
            startTime: Ze || at(),
            duration: t.duration,
            tweens: [],
            createTween: function(e, t) {
                var n = S.Tween(o, l.opts, e, t, l.opts.specialEasing[e] || l.opts.easing);
                return l.tweens.push(n),
                n
            },
            stop: function(e) {
                var t = 0
                  , n = e ? l.tweens.length : 0;
                if (a)
                    return this;
                for (a = !0; t < n; t++)
                    l.tweens[t].run(1);
                return e ? (s.notifyWith(o, [l, 1, 0]),
                s.resolveWith(o, [l, e])) : s.rejectWith(o, [l, e]),
                this
            }
        }), c = l.props;
        for (!function(e, t) {
            var n, r, i, o, a;
            for (n in e)
                if (i = t[r = X(n)],
                o = e[n],
                Array.isArray(o) && (i = o[1],
                o = e[n] = o[0]),
                n !== r && (e[r] = o,
                delete e[n]),
                (a = S.cssHooks[r]) && "expand"in a)
                    for (n in o = a.expand(o),
                    delete e[r],
                    o)
                        n in e || (e[n] = o[n],
                        t[n] = i);
                else
                    t[r] = i
        }(c, l.opts.specialEasing); r < i; r++)
            if (n = lt.prefilters[r].call(l, o, c, l.opts))
                return m(n.stop) && (S._queueHooks(l.elem, l.opts.queue).stop = n.stop.bind(n)),
                n;
        return S.map(c, ut, l),
        m(l.opts.start) && l.opts.start.call(o, l),
        l.progress(l.opts.progress).done(l.opts.done, l.opts.complete).fail(l.opts.fail).always(l.opts.always),
        S.fx.timer(S.extend(u, {
            elem: o,
            anim: l,
            queue: l.opts.queue
        })),
        l
    }
    S.Animation = S.extend(lt, {
        tweeners: {
            "*": [function(e, t) {
                var n = this.createTween(e, t);
                return se(n.elem, e, te.exec(t), n),
                n
            }
            ]
        },
        tweener: function(e, t) {
            m(e) ? (t = e,
            e = ["*"]) : e = e.match(P);
            for (var n, r = 0, i = e.length; r < i; r++)
                n = e[r],
                lt.tweeners[n] = lt.tweeners[n] || [],
                lt.tweeners[n].unshift(t)
        },
        prefilters: [function(e, t, n) {
            var r, i, o, a, s, u, l, c, f = "width"in t || "height"in t, p = this, d = {}, h = e.style, g = e.nodeType && ae(e), v = Y.get(e, "fxshow");
            for (r in n.queue || (null == (a = S._queueHooks(e, "fx")).unqueued && (a.unqueued = 0,
            s = a.empty.fire,
            a.empty.fire = function() {
                a.unqueued || s()
            }
            ),
            a.unqueued++,
            p.always(function() {
                p.always(function() {
                    a.unqueued--,
                    S.queue(e, "fx").length || a.empty.fire()
                })
            })),
            t)
                if (i = t[r],
                rt.test(i)) {
                    if (delete t[r],
                    o = o || "toggle" === i,
                    i === (g ? "hide" : "show")) {
                        if ("show" !== i || !v || void 0 === v[r])
                            continue;
                        g = !0
                    }
                    d[r] = v && v[r] || S.style(e, r)
                }
            if ((u = !S.isEmptyObject(t)) || !S.isEmptyObject(d))
                for (r in f && 1 === e.nodeType && (n.overflow = [h.overflow, h.overflowX, h.overflowY],
                null == (l = v && v.display) && (l = Y.get(e, "display")),
                "none" === (c = S.css(e, "display")) && (l ? c = l : (le([e], !0),
                l = e.style.display || l,
                c = S.css(e, "display"),
                le([e]))),
                ("inline" === c || "inline-block" === c && null != l) && "none" === S.css(e, "float") && (u || (p.done(function() {
                    h.display = l
                }),
                null == l && (c = h.display,
                l = "none" === c ? "" : c)),
                h.display = "inline-block")),
                n.overflow && (h.overflow = "hidden",
                p.always(function() {
                    h.overflow = n.overflow[0],
                    h.overflowX = n.overflow[1],
                    h.overflowY = n.overflow[2]
                })),
                u = !1,
                d)
                    u || (v ? "hidden"in v && (g = v.hidden) : v = Y.access(e, "fxshow", {
                        display: l
                    }),
                    o && (v.hidden = !g),
                    g && le([e], !0),
                    p.done(function() {
                        for (r in g || le([e]),
                        Y.remove(e, "fxshow"),
                        d)
                            S.style(e, r, d[r])
                    })),
                    u = ut(g ? v[r] : 0, r, p),
                    r in v || (v[r] = u.start,
                    g && (u.end = u.start,
                    u.start = 0))
        }
        ],
        prefilter: function(e, t) {
            t ? lt.prefilters.unshift(e) : lt.prefilters.push(e)
        }
    }),
    S.speed = function(e, t, n) {
        var r = e && "object" == typeof e ? S.extend({}, e) : {
            complete: n || !n && t || m(e) && e,
            duration: e,
            easing: n && t || t && !m(t) && t
        };
        return S.fx.off ? r.duration = 0 : "number" != typeof r.duration && (r.duration in S.fx.speeds ? r.duration = S.fx.speeds[r.duration] : r.duration = S.fx.speeds._default),
        null != r.queue && !0 !== r.queue || (r.queue = "fx"),
        r.old = r.complete,
        r.complete = function() {
            m(r.old) && r.old.call(this),
            r.queue && S.dequeue(this, r.queue)
        }
        ,
        r
    }
    ,
    S.fn.extend({
        fadeTo: function(e, t, n, r) {
            return this.filter(ae).css("opacity", 0).show().end().animate({
                opacity: t
            }, e, n, r)
        },
        animate: function(t, e, n, r) {
            var i = S.isEmptyObject(t)
              , o = S.speed(e, n, r)
              , a = function() {
                var e = lt(this, S.extend({}, t), o);
                (i || Y.get(this, "finish")) && e.stop(!0)
            };
            return a.finish = a,
            i || !1 === o.queue ? this.each(a) : this.queue(o.queue, a)
        },
        stop: function(i, e, o) {
            var a = function(e) {
                var t = e.stop;
                delete e.stop,
                t(o)
            };
            return "string" != typeof i && (o = e,
            e = i,
            i = void 0),
            e && this.queue(i || "fx", []),
            this.each(function() {
                var e = !0
                  , t = null != i && i + "queueHooks"
                  , n = S.timers
                  , r = Y.get(this);
                if (t)
                    r[t] && r[t].stop && a(r[t]);
                else
                    for (t in r)
                        r[t] && r[t].stop && it.test(t) && a(r[t]);
                for (t = n.length; t--; )
                    n[t].elem !== this || null != i && n[t].queue !== i || (n[t].anim.stop(o),
                    e = !1,
                    n.splice(t, 1));
                !e && o || S.dequeue(this, i)
            })
        },
        finish: function(a) {
            return !1 !== a && (a = a || "fx"),
            this.each(function() {
                var e, t = Y.get(this), n = t[a + "queue"], r = t[a + "queueHooks"], i = S.timers, o = n ? n.length : 0;
                for (t.finish = !0,
                S.queue(this, a, []),
                r && r.stop && r.stop.call(this, !0),
                e = i.length; e--; )
                    i[e].elem === this && i[e].queue === a && (i[e].anim.stop(!0),
                    i.splice(e, 1));
                for (e = 0; e < o; e++)
                    n[e] && n[e].finish && n[e].finish.call(this);
                delete t.finish
            })
        }
    }),
    S.each(["toggle", "show", "hide"], function(e, r) {
        var i = S.fn[r];
        S.fn[r] = function(e, t, n) {
            return null == e || "boolean" == typeof e ? i.apply(this, arguments) : this.animate(st(r, !0), e, t, n)
        }
    }),
    S.each({
        slideDown: st("show"),
        slideUp: st("hide"),
        slideToggle: st("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(e, r) {
        S.fn[e] = function(e, t, n) {
            return this.animate(r, e, t, n)
        }
    }),
    S.timers = [],
    S.fx.tick = function() {
        var e, t = 0, n = S.timers;
        for (Ze = Date.now(); t < n.length; t++)
            (e = n[t])() || n[t] !== e || n.splice(t--, 1);
        n.length || S.fx.stop(),
        Ze = void 0
    }
    ,
    S.fx.timer = function(e) {
        S.timers.push(e),
        S.fx.start()
    }
    ,
    S.fx.interval = 13,
    S.fx.start = function() {
        et || (et = !0,
        ot())
    }
    ,
    S.fx.stop = function() {
        et = null
    }
    ,
    S.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    },
    S.fn.delay = function(r, e) {
        return r = S.fx && S.fx.speeds[r] || r,
        e = e || "fx",
        this.queue(e, function(e, t) {
            var n = C.setTimeout(e, r);
            t.stop = function() {
                C.clearTimeout(n)
            }
        })
    }
    ,
    tt = E.createElement("input"),
    nt = E.createElement("select").appendChild(E.createElement("option")),
    tt.type = "checkbox",
    y.checkOn = "" !== tt.value,
    y.optSelected = nt.selected,
    (tt = E.createElement("input")).value = "t",
    tt.type = "radio",
    y.radioValue = "t" === tt.value;
    var ct, ft = S.expr.attrHandle;
    S.fn.extend({
        attr: function(e, t) {
            return $(this, S.attr, e, t, 1 < arguments.length)
        },
        removeAttr: function(e) {
            return this.each(function() {
                S.removeAttr(this, e)
            })
        }
    }),
    S.extend({
        attr: function(e, t, n) {
            var r, i, o = e.nodeType;
            if (3 !== o && 8 !== o && 2 !== o)
                return "undefined" == typeof e.getAttribute ? S.prop(e, t, n) : (1 === o && S.isXMLDoc(e) || (i = S.attrHooks[t.toLowerCase()] || (S.expr.match.bool.test(t) ? ct : void 0)),
                void 0 !== n ? null === n ? void S.removeAttr(e, t) : i && "set"in i && void 0 !== (r = i.set(e, n, t)) ? r : (e.setAttribute(t, n + ""),
                n) : i && "get"in i && null !== (r = i.get(e, t)) ? r : null == (r = S.find.attr(e, t)) ? void 0 : r)
        },
        attrHooks: {
            type: {
                set: function(e, t) {
                    if (!y.radioValue && "radio" === t && A(e, "input")) {
                        var n = e.value;
                        return e.setAttribute("type", t),
                        n && (e.value = n),
                        t
                    }
                }
            }
        },
        removeAttr: function(e, t) {
            var n, r = 0, i = t && t.match(P);
            if (i && 1 === e.nodeType)
                while (n = i[r++])
                    e.removeAttribute(n)
        }
    }),
    ct = {
        set: function(e, t, n) {
            return !1 === t ? S.removeAttr(e, n) : e.setAttribute(n, n),
            n
        }
    },
    S.each(S.expr.match.bool.source.match(/\w+/g), function(e, t) {
        var a = ft[t] || S.find.attr;
        ft[t] = function(e, t, n) {
            var r, i, o = t.toLowerCase();
            return n || (i = ft[o],
            ft[o] = r,
            r = null != a(e, t, n) ? o : null,
            ft[o] = i),
            r
        }
    });
    var pt = /^(?:input|select|textarea|button)$/i
      , dt = /^(?:a|area)$/i;
    function ht(e) {
        return (e.match(P) || []).join(" ")
    }
    function gt(e) {
        return e.getAttribute && e.getAttribute("class") || ""
    }
    function vt(e) {
        return Array.isArray(e) ? e : "string" == typeof e && e.match(P) || []
    }
    S.fn.extend({
        prop: function(e, t) {
            return $(this, S.prop, e, t, 1 < arguments.length)
        },
        removeProp: function(e) {
            return this.each(function() {
                delete this[S.propFix[e] || e]
            })
        }
    }),
    S.extend({
        prop: function(e, t, n) {
            var r, i, o = e.nodeType;
            if (3 !== o && 8 !== o && 2 !== o)
                return 1 === o && S.isXMLDoc(e) || (t = S.propFix[t] || t,
                i = S.propHooks[t]),
                void 0 !== n ? i && "set"in i && void 0 !== (r = i.set(e, n, t)) ? r : e[t] = n : i && "get"in i && null !== (r = i.get(e, t)) ? r : e[t]
        },
        propHooks: {
            tabIndex: {
                get: function(e) {
                    var t = S.find.attr(e, "tabindex");
                    return t ? parseInt(t, 10) : pt.test(e.nodeName) || dt.test(e.nodeName) && e.href ? 0 : -1
                }
            }
        },
        propFix: {
            "for": "htmlFor",
            "class": "className"
        }
    }),
    y.optSelected || (S.propHooks.selected = {
        get: function(e) {
            var t = e.parentNode;
            return t && t.parentNode && t.parentNode.selectedIndex,
            null
        },
        set: function(e) {
            var t = e.parentNode;
            t && (t.selectedIndex,
            t.parentNode && t.parentNode.selectedIndex)
        }
    }),
    S.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        S.propFix[this.toLowerCase()] = this
    }),
    S.fn.extend({
        addClass: function(t) {
            var e, n, r, i, o, a, s, u = 0;
            if (m(t))
                return this.each(function(e) {
                    S(this).addClass(t.call(this, e, gt(this)))
                });
            if ((e = vt(t)).length)
                while (n = this[u++])
                    if (i = gt(n),
                    r = 1 === n.nodeType && " " + ht(i) + " ") {
                        a = 0;
                        while (o = e[a++])
                            r.indexOf(" " + o + " ") < 0 && (r += o + " ");
                        i !== (s = ht(r)) && n.setAttribute("class", s)
                    }
            return this
        },
        removeClass: function(t) {
            var e, n, r, i, o, a, s, u = 0;
            if (m(t))
                return this.each(function(e) {
                    S(this).removeClass(t.call(this, e, gt(this)))
                });
            if (!arguments.length)
                return this.attr("class", "");
            if ((e = vt(t)).length)
                while (n = this[u++])
                    if (i = gt(n),
                    r = 1 === n.nodeType && " " + ht(i) + " ") {
                        a = 0;
                        while (o = e[a++])
                            while (-1 < r.indexOf(" " + o + " "))
                                r = r.replace(" " + o + " ", " ");
                        i !== (s = ht(r)) && n.setAttribute("class", s)
                    }
            return this
        },
        toggleClass: function(i, t) {
            var o = typeof i
              , a = "string" === o || Array.isArray(i);
            return "boolean" == typeof t && a ? t ? this.addClass(i) : this.removeClass(i) : m(i) ? this.each(function(e) {
                S(this).toggleClass(i.call(this, e, gt(this), t), t)
            }) : this.each(function() {
                var e, t, n, r;
                if (a) {
                    t = 0,
                    n = S(this),
                    r = vt(i);
                    while (e = r[t++])
                        n.hasClass(e) ? n.removeClass(e) : n.addClass(e)
                } else
                    void 0 !== i && "boolean" !== o || ((e = gt(this)) && Y.set(this, "__className__", e),
                    this.setAttribute && this.setAttribute("class", e || !1 === i ? "" : Y.get(this, "__className__") || ""))
            })
        },
        hasClass: function(e) {
            var t, n, r = 0;
            t = " " + e + " ";
            while (n = this[r++])
                if (1 === n.nodeType && -1 < (" " + ht(gt(n)) + " ").indexOf(t))
                    return !0;
            return !1
        }
    });
    var yt = /\r/g;
    S.fn.extend({
        val: function(n) {
            var r, e, i, t = this[0];
            return arguments.length ? (i = m(n),
            this.each(function(e) {
                var t;
                1 === this.nodeType && (null == (t = i ? n.call(this, e, S(this).val()) : n) ? t = "" : "number" == typeof t ? t += "" : Array.isArray(t) && (t = S.map(t, function(e) {
                    return null == e ? "" : e + ""
                })),
                (r = S.valHooks[this.type] || S.valHooks[this.nodeName.toLowerCase()]) && "set"in r && void 0 !== r.set(this, t, "value") || (this.value = t))
            })) : t ? (r = S.valHooks[t.type] || S.valHooks[t.nodeName.toLowerCase()]) && "get"in r && void 0 !== (e = r.get(t, "value")) ? e : "string" == typeof (e = t.value) ? e.replace(yt, "") : null == e ? "" : e : void 0
        }
    }),
    S.extend({
        valHooks: {
            option: {
                get: function(e) {
                    var t = S.find.attr(e, "value");
                    return null != t ? t : ht(S.text(e))
                }
            },
            select: {
                get: function(e) {
                    var t, n, r, i = e.options, o = e.selectedIndex, a = "select-one" === e.type, s = a ? null : [], u = a ? o + 1 : i.length;
                    for (r = o < 0 ? u : a ? o : 0; r < u; r++)
                        if (((n = i[r]).selected || r === o) && !n.disabled && (!n.parentNode.disabled || !A(n.parentNode, "optgroup"))) {
                            if (t = S(n).val(),
                            a)
                                return t;
                            s.push(t)
                        }
                    return s
                },
                set: function(e, t) {
                    var n, r, i = e.options, o = S.makeArray(t), a = i.length;
                    while (a--)
                        ((r = i[a]).selected = -1 < S.inArray(S.valHooks.option.get(r), o)) && (n = !0);
                    return n || (e.selectedIndex = -1),
                    o
                }
            }
        }
    }),
    S.each(["radio", "checkbox"], function() {
        S.valHooks[this] = {
            set: function(e, t) {
                if (Array.isArray(t))
                    return e.checked = -1 < S.inArray(S(e).val(), t)
            }
        },
        y.checkOn || (S.valHooks[this].get = function(e) {
            return null === e.getAttribute("value") ? "on" : e.value
        }
        )
    }),
    y.focusin = "onfocusin"in C;
    var mt = /^(?:focusinfocus|focusoutblur)$/
      , xt = function(e) {
        e.stopPropagation()
    };
    S.extend(S.event, {
        trigger: function(e, t, n, r) {
            var i, o, a, s, u, l, c, f, p = [n || E], d = v.call(e, "type") ? e.type : e, h = v.call(e, "namespace") ? e.namespace.split(".") : [];
            if (o = f = a = n = n || E,
            3 !== n.nodeType && 8 !== n.nodeType && !mt.test(d + S.event.triggered) && (-1 < d.indexOf(".") && (d = (h = d.split(".")).shift(),
            h.sort()),
            u = d.indexOf(":") < 0 && "on" + d,
            (e = e[S.expando] ? e : new S.Event(d,"object" == typeof e && e)).isTrigger = r ? 2 : 3,
            e.namespace = h.join("."),
            e.rnamespace = e.namespace ? new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)") : null,
            e.result = void 0,
            e.target || (e.target = n),
            t = null == t ? [e] : S.makeArray(t, [e]),
            c = S.event.special[d] || {},
            r || !c.trigger || !1 !== c.trigger.apply(n, t))) {
                if (!r && !c.noBubble && !x(n)) {
                    for (s = c.delegateType || d,
                    mt.test(s + d) || (o = o.parentNode); o; o = o.parentNode)
                        p.push(o),
                        a = o;
                    a === (n.ownerDocument || E) && p.push(a.defaultView || a.parentWindow || C)
                }
                i = 0;
                while ((o = p[i++]) && !e.isPropagationStopped())
                    f = o,
                    e.type = 1 < i ? s : c.bindType || d,
                    (l = (Y.get(o, "events") || Object.create(null))[e.type] && Y.get(o, "handle")) && l.apply(o, t),
                    (l = u && o[u]) && l.apply && V(o) && (e.result = l.apply(o, t),
                    !1 === e.result && e.preventDefault());
                return e.type = d,
                r || e.isDefaultPrevented() || c._default && !1 !== c._default.apply(p.pop(), t) || !V(n) || u && m(n[d]) && !x(n) && ((a = n[u]) && (n[u] = null),
                S.event.triggered = d,
                e.isPropagationStopped() && f.addEventListener(d, xt),
                n[d](),
                e.isPropagationStopped() && f.removeEventListener(d, xt),
                S.event.triggered = void 0,
                a && (n[u] = a)),
                e.result
            }
        },
        simulate: function(e, t, n) {
            var r = S.extend(new S.Event, n, {
                type: e,
                isSimulated: !0
            });
            S.event.trigger(r, null, t)
        }
    }),
    S.fn.extend({
        trigger: function(e, t) {
            return this.each(function() {
                S.event.trigger(e, t, this)
            })
        },
        triggerHandler: function(e, t) {
            var n = this[0];
            if (n)
                return S.event.trigger(e, t, n, !0)
        }
    }),
    y.focusin || S.each({
        focus: "focusin",
        blur: "focusout"
    }, function(n, r) {
        var i = function(e) {
            S.event.simulate(r, e.target, S.event.fix(e))
        };
        S.event.special[r] = {
            setup: function() {
                var e = this.ownerDocument || this.document || this
                  , t = Y.access(e, r);
                t || e.addEventListener(n, i, !0),
                Y.access(e, r, (t || 0) + 1)
            },
            teardown: function() {
                var e = this.ownerDocument || this.document || this
                  , t = Y.access(e, r) - 1;
                t ? Y.access(e, r, t) : (e.removeEventListener(n, i, !0),
                Y.remove(e, r))
            }
        }
    });
    var bt = C.location
      , wt = {
        guid: Date.now()
    }
      , Tt = /\?/;
    S.parseXML = function(e) {
        var t, n;
        if (!e || "string" != typeof e)
            return null;
        try {
            t = (new C.DOMParser).parseFromString(e, "text/xml")
        } catch (e) {}
        return n = t && t.getElementsByTagName("parsererror")[0],
        t && !n || S.error("Invalid XML: " + (n ? S.map(n.childNodes, function(e) {
            return e.textContent
        }).join("\n") : e)),
        t
    }
    ;
    var Ct = /\[\]$/
      , Et = /\r?\n/g
      , St = /^(?:submit|button|image|reset|file)$/i
      , kt = /^(?:input|select|textarea|keygen)/i;
    function At(n, e, r, i) {
        var t;
        if (Array.isArray(e))
            S.each(e, function(e, t) {
                r || Ct.test(n) ? i(n, t) : At(n + "[" + ("object" == typeof t && null != t ? e : "") + "]", t, r, i)
            });
        else if (r || "object" !== w(e))
            i(n, e);
        else
            for (t in e)
                At(n + "[" + t + "]", e[t], r, i)
    }
    S.param = function(e, t) {
        var n, r = [], i = function(e, t) {
            var n = m(t) ? t() : t;
            r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(null == n ? "" : n)
        };
        if (null == e)
            return "";
        if (Array.isArray(e) || e.jquery && !S.isPlainObject(e))
            S.each(e, function() {
                i(this.name, this.value)
            });
        else
            for (n in e)
                At(n, e[n], t, i);
        return r.join("&")
    }
    ,
    S.fn.extend({
        serialize: function() {
            return S.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var e = S.prop(this, "elements");
                return e ? S.makeArray(e) : this
            }).filter(function() {
                var e = this.type;
                return this.name && !S(this).is(":disabled") && kt.test(this.nodeName) && !St.test(e) && (this.checked || !pe.test(e))
            }).map(function(e, t) {
                var n = S(this).val();
                return null == n ? null : Array.isArray(n) ? S.map(n, function(e) {
                    return {
                        name: t.name,
                        value: e.replace(Et, "\r\n")
                    }
                }) : {
                    name: t.name,
                    value: n.replace(Et, "\r\n")
                }
            }).get()
        }
    });
    var Nt = /%20/g
      , jt = /#.*$/
      , Dt = /([?&])_=[^&]*/
      , qt = /^(.*?):[ \t]*([^\r\n]*)$/gm
      , Lt = /^(?:GET|HEAD)$/
      , Ht = /^\/\//
      , Ot = {}
      , Pt = {}
      , Rt = "*/".concat("*")
      , Mt = E.createElement("a");
    function It(o) {
        return function(e, t) {
            "string" != typeof e && (t = e,
            e = "*");
            var n, r = 0, i = e.toLowerCase().match(P) || [];
            if (m(t))
                while (n = i[r++])
                    "+" === n[0] ? (n = n.slice(1) || "*",
                    (o[n] = o[n] || []).unshift(t)) : (o[n] = o[n] || []).push(t)
        }
    }
    function Wt(t, i, o, a) {
        var s = {}
          , u = t === Pt;
        function l(e) {
            var r;
            return s[e] = !0,
            S.each(t[e] || [], function(e, t) {
                var n = t(i, o, a);
                return "string" != typeof n || u || s[n] ? u ? !(r = n) : void 0 : (i.dataTypes.unshift(n),
                l(n),
                !1)
            }),
            r
        }
        return l(i.dataTypes[0]) || !s["*"] && l("*")
    }
    function Ft(e, t) {
        var n, r, i = S.ajaxSettings.flatOptions || {};
        for (n in t)
            void 0 !== t[n] && ((i[n] ? e : r || (r = {}))[n] = t[n]);
        return r && S.extend(!0, e, r),
        e
    }
    Mt.href = bt.href,
    S.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: bt.href,
            type: "GET",
            isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(bt.protocol),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": Rt,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /\bxml\b/,
                html: /\bhtml/,
                json: /\bjson\b/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": JSON.parse,
                "text xml": S.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(e, t) {
            return t ? Ft(Ft(e, S.ajaxSettings), t) : Ft(S.ajaxSettings, e)
        },
        ajaxPrefilter: It(Ot),
        ajaxTransport: It(Pt),
        ajax: function(e, t) {
            "object" == typeof e && (t = e,
            e = void 0),
            t = t || {};
            var c, f, p, n, d, r, h, g, i, o, v = S.ajaxSetup({}, t), y = v.context || v, m = v.context && (y.nodeType || y.jquery) ? S(y) : S.event, x = S.Deferred(), b = S.Callbacks("once memory"), w = v.statusCode || {}, a = {}, s = {}, u = "canceled", T = {
                readyState: 0,
                getResponseHeader: function(e) {
                    var t;
                    if (h) {
                        if (!n) {
                            n = {};
                            while (t = qt.exec(p))
                                n[t[1].toLowerCase() + " "] = (n[t[1].toLowerCase() + " "] || []).concat(t[2])
                        }
                        t = n[e.toLowerCase() + " "]
                    }
                    return null == t ? null : t.join(", ")
                },
                getAllResponseHeaders: function() {
                    return h ? p : null
                },
                setRequestHeader: function(e, t) {
                    return null == h && (e = s[e.toLowerCase()] = s[e.toLowerCase()] || e,
                    a[e] = t),
                    this
                },
                overrideMimeType: function(e) {
                    return null == h && (v.mimeType = e),
                    this
                },
                statusCode: function(e) {
                    var t;
                    if (e)
                        if (h)
                            T.always(e[T.status]);
                        else
                            for (t in e)
                                w[t] = [w[t], e[t]];
                    return this
                },
                abort: function(e) {
                    var t = e || u;
                    return c && c.abort(t),
                    l(0, t),
                    this
                }
            };
            if (x.promise(T),
            v.url = ((e || v.url || bt.href) + "").replace(Ht, bt.protocol + "//"),
            v.type = t.method || t.type || v.method || v.type,
            v.dataTypes = (v.dataType || "*").toLowerCase().match(P) || [""],
            null == v.crossDomain) {
                r = E.createElement("a");
                try {
                    r.href = v.url,
                    r.href = r.href,
                    v.crossDomain = Mt.protocol + "//" + Mt.host != r.protocol + "//" + r.host
                } catch (e) {
                    v.crossDomain = !0
                }
            }
            if (v.data && v.processData && "string" != typeof v.data && (v.data = S.param(v.data, v.traditional)),
            Wt(Ot, v, t, T),
            h)
                return T;
            for (i in (g = S.event && v.global) && 0 == S.active++ && S.event.trigger("ajaxStart"),
            v.type = v.type.toUpperCase(),
            v.hasContent = !Lt.test(v.type),
            f = v.url.replace(jt, ""),
            v.hasContent ? v.data && v.processData && 0 === (v.contentType || "").indexOf("application/x-www-form-urlencoded") && (v.data = v.data.replace(Nt, "+")) : (o = v.url.slice(f.length),
            v.data && (v.processData || "string" == typeof v.data) && (f += (Tt.test(f) ? "&" : "?") + v.data,
            delete v.data),
            !1 === v.cache && (f = f.replace(Dt, "$1"),
            o = (Tt.test(f) ? "&" : "?") + "_=" + wt.guid++ + o),
            v.url = f + o),
            v.ifModified && (S.lastModified[f] && T.setRequestHeader("If-Modified-Since", S.lastModified[f]),
            S.etag[f] && T.setRequestHeader("If-None-Match", S.etag[f])),
            (v.data && v.hasContent && !1 !== v.contentType || t.contentType) && T.setRequestHeader("Content-Type", v.contentType),
            T.setRequestHeader("Accept", v.dataTypes[0] && v.accepts[v.dataTypes[0]] ? v.accepts[v.dataTypes[0]] + ("*" !== v.dataTypes[0] ? ", " + Rt + "; q=0.01" : "") : v.accepts["*"]),
            v.headers)
                T.setRequestHeader(i, v.headers[i]);
            if (v.beforeSend && (!1 === v.beforeSend.call(y, T, v) || h))
                return T.abort();
            if (u = "abort",
            b.add(v.complete),
            T.done(v.success),
            T.fail(v.error),
            c = Wt(Pt, v, t, T)) {
                if (T.readyState = 1,
                g && m.trigger("ajaxSend", [T, v]),
                h)
                    return T;
                v.async && 0 < v.timeout && (d = C.setTimeout(function() {
                    T.abort("timeout")
                }, v.timeout));
                try {
                    h = !1,
                    c.send(a, l)
                } catch (e) {
                    if (h)
                        throw e;
                    l(-1, e)
                }
            } else
                l(-1, "No Transport");
            function l(e, t, n, r) {
                var i, o, a, s, u, l = t;
                h || (h = !0,
                d && C.clearTimeout(d),
                c = void 0,
                p = r || "",
                T.readyState = 0 < e ? 4 : 0,
                i = 200 <= e && e < 300 || 304 === e,
                n && (s = function(e, t, n) {
                    var r, i, o, a, s = e.contents, u = e.dataTypes;
                    while ("*" === u[0])
                        u.shift(),
                        void 0 === r && (r = e.mimeType || t.getResponseHeader("Content-Type"));
                    if (r)
                        for (i in s)
                            if (s[i] && s[i].test(r)) {
                                u.unshift(i);
                                break
                            }
                    if (u[0]in n)
                        o = u[0];
                    else {
                        for (i in n) {
                            if (!u[0] || e.converters[i + " " + u[0]]) {
                                o = i;
                                break
                            }
                            a || (a = i)
                        }
                        o = o || a
                    }
                    if (o)
                        return o !== u[0] && u.unshift(o),
                        n[o]
                }(v, T, n)),
                !i && -1 < S.inArray("script", v.dataTypes) && S.inArray("json", v.dataTypes) < 0 && (v.converters["text script"] = function() {}
                ),
                s = function(e, t, n, r) {
                    var i, o, a, s, u, l = {}, c = e.dataTypes.slice();
                    if (c[1])
                        for (a in e.converters)
                            l[a.toLowerCase()] = e.converters[a];
                    o = c.shift();
                    while (o)
                        if (e.responseFields[o] && (n[e.responseFields[o]] = t),
                        !u && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)),
                        u = o,
                        o = c.shift())
                            if ("*" === o)
                                o = u;
                            else if ("*" !== u && u !== o) {
                                if (!(a = l[u + " " + o] || l["* " + o]))
                                    for (i in l)
                                        if ((s = i.split(" "))[1] === o && (a = l[u + " " + s[0]] || l["* " + s[0]])) {
                                            !0 === a ? a = l[i] : !0 !== l[i] && (o = s[0],
                                            c.unshift(s[1]));
                                            break
                                        }
                                if (!0 !== a)
                                    if (a && e["throws"])
                                        t = a(t);
                                    else
                                        try {
                                            t = a(t)
                                        } catch (e) {
                                            return {
                                                state: "parsererror",
                                                error: a ? e : "No conversion from " + u + " to " + o
                                            }
                                        }
                            }
                    return {
                        state: "success",
                        data: t
                    }
                }(v, s, T, i),
                i ? (v.ifModified && ((u = T.getResponseHeader("Last-Modified")) && (S.lastModified[f] = u),
                (u = T.getResponseHeader("etag")) && (S.etag[f] = u)),
                204 === e || "HEAD" === v.type ? l = "nocontent" : 304 === e ? l = "notmodified" : (l = s.state,
                o = s.data,
                i = !(a = s.error))) : (a = l,
                !e && l || (l = "error",
                e < 0 && (e = 0))),
                T.status = e,
                T.statusText = (t || l) + "",
                i ? x.resolveWith(y, [o, l, T]) : x.rejectWith(y, [T, l, a]),
                T.statusCode(w),
                w = void 0,
                g && m.trigger(i ? "ajaxSuccess" : "ajaxError", [T, v, i ? o : a]),
                b.fireWith(y, [T, l]),
                g && (m.trigger("ajaxComplete", [T, v]),
                --S.active || S.event.trigger("ajaxStop")))
            }
            return T
        },
        getJSON: function(e, t, n) {
            return S.get(e, t, n, "json")
        },
        getScript: function(e, t) {
            return S.get(e, void 0, t, "script")
        }
    }),
    S.each(["get", "post"], function(e, i) {
        S[i] = function(e, t, n, r) {
            return m(t) && (r = r || n,
            n = t,
            t = void 0),
            S.ajax(S.extend({
                url: e,
                type: i,
                dataType: r,
                data: t,
                success: n
            }, S.isPlainObject(e) && e))
        }
    }),
    S.ajaxPrefilter(function(e) {
        var t;
        for (t in e.headers)
            "content-type" === t.toLowerCase() && (e.contentType = e.headers[t] || "")
    }),
    S._evalUrl = function(e, t, n) {
        return S.ajax({
            url: e,
            type: "GET",
            dataType: "script",
            cache: !0,
            async: !1,
            global: !1,
            converters: {
                "text script": function() {}
            },
            dataFilter: function(e) {
                S.globalEval(e, t, n)
            }
        })
    }
    ,
    S.fn.extend({
        wrapAll: function(e) {
            var t;
            return this[0] && (m(e) && (e = e.call(this[0])),
            t = S(e, this[0].ownerDocument).eq(0).clone(!0),
            this[0].parentNode && t.insertBefore(this[0]),
            t.map(function() {
                var e = this;
                while (e.firstElementChild)
                    e = e.firstElementChild;
                return e
            }).append(this)),
            this
        },
        wrapInner: function(n) {
            return m(n) ? this.each(function(e) {
                S(this).wrapInner(n.call(this, e))
            }) : this.each(function() {
                var e = S(this)
                  , t = e.contents();
                t.length ? t.wrapAll(n) : e.append(n)
            })
        },
        wrap: function(t) {
            var n = m(t);
            return this.each(function(e) {
                S(this).wrapAll(n ? t.call(this, e) : t)
            })
        },
        unwrap: function(e) {
            return this.parent(e).not("body").each(function() {
                S(this).replaceWith(this.childNodes)
            }),
            this
        }
    }),
    S.expr.pseudos.hidden = function(e) {
        return !S.expr.pseudos.visible(e)
    }
    ,
    S.expr.pseudos.visible = function(e) {
        return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length)
    }
    ,
    S.ajaxSettings.xhr = function() {
        try {
            return new C.XMLHttpRequest
        } catch (e) {}
    }
    ;
    var Bt = {
        0: 200,
        1223: 204
    }
      , $t = S.ajaxSettings.xhr();
    y.cors = !!$t && "withCredentials"in $t,
    y.ajax = $t = !!$t,
    S.ajaxTransport(function(i) {
        var o, a;
        if (y.cors || $t && !i.crossDomain)
            return {
                send: function(e, t) {
                    var n, r = i.xhr();
                    if (r.open(i.type, i.url, i.async, i.username, i.password),
                    i.xhrFields)
                        for (n in i.xhrFields)
                            r[n] = i.xhrFields[n];
                    for (n in i.mimeType && r.overrideMimeType && r.overrideMimeType(i.mimeType),
                    i.crossDomain || e["X-Requested-With"] || (e["X-Requested-With"] = "XMLHttpRequest"),
                    e)
                        r.setRequestHeader(n, e[n]);
                    o = function(e) {
                        return function() {
                            o && (o = a = r.onload = r.onerror = r.onabort = r.ontimeout = r.onreadystatechange = null,
                            "abort" === e ? r.abort() : "error" === e ? "number" != typeof r.status ? t(0, "error") : t(r.status, r.statusText) : t(Bt[r.status] || r.status, r.statusText, "text" !== (r.responseType || "text") || "string" != typeof r.responseText ? {
                                binary: r.response
                            } : {
                                text: r.responseText
                            }, r.getAllResponseHeaders()))
                        }
                    }
                    ,
                    r.onload = o(),
                    a = r.onerror = r.ontimeout = o("error"),
                    void 0 !== r.onabort ? r.onabort = a : r.onreadystatechange = function() {
                        4 === r.readyState && C.setTimeout(function() {
                            o && a()
                        })
                    }
                    ,
                    o = o("abort");
                    try {
                        r.send(i.hasContent && i.data || null)
                    } catch (e) {
                        if (o)
                            throw e
                    }
                },
                abort: function() {
                    o && o()
                }
            }
    }),
    S.ajaxPrefilter(function(e) {
        e.crossDomain && (e.contents.script = !1)
    }),
    S.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /\b(?:java|ecma)script\b/
        },
        converters: {
            "text script": function(e) {
                return S.globalEval(e),
                e
            }
        }
    }),
    S.ajaxPrefilter("script", function(e) {
        void 0 === e.cache && (e.cache = !1),
        e.crossDomain && (e.type = "GET")
    }),
    S.ajaxTransport("script", function(n) {
        var r, i;
        if (n.crossDomain || n.scriptAttrs)
            return {
                send: function(e, t) {
                    r = S("<script>").attr(n.scriptAttrs || {}).prop({
                        charset: n.scriptCharset,
                        src: n.url
                    }).on("load error", i = function(e) {
                        r.remove(),
                        i = null,
                        e && t("error" === e.type ? 404 : 200, e.type)
                    }
                    ),
                    E.head.appendChild(r[0])
                },
                abort: function() {
                    i && i()
                }
            }
    });
    var _t, zt = [], Ut = /(=)\?(?=&|$)|\?\?/;
    S.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var e = zt.pop() || S.expando + "_" + wt.guid++;
            return this[e] = !0,
            e
        }
    }),
    S.ajaxPrefilter("json jsonp", function(e, t, n) {
        var r, i, o, a = !1 !== e.jsonp && (Ut.test(e.url) ? "url" : "string" == typeof e.data && 0 === (e.contentType || "").indexOf("application/x-www-form-urlencoded") && Ut.test(e.data) && "data");
        if (a || "jsonp" === e.dataTypes[0])
            return r = e.jsonpCallback = m(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback,
            a ? e[a] = e[a].replace(Ut, "$1" + r) : !1 !== e.jsonp && (e.url += (Tt.test(e.url) ? "&" : "?") + e.jsonp + "=" + r),
            e.converters["script json"] = function() {
                return o || S.error(r + " was not called"),
                o[0]
            }
            ,
            e.dataTypes[0] = "json",
            i = C[r],
            C[r] = function() {
                o = arguments
            }
            ,
            n.always(function() {
                void 0 === i ? S(C).removeProp(r) : C[r] = i,
                e[r] && (e.jsonpCallback = t.jsonpCallback,
                zt.push(r)),
                o && m(i) && i(o[0]),
                o = i = void 0
            }),
            "script"
    }),
    y.createHTMLDocument = ((_t = E.implementation.createHTMLDocument("").body).innerHTML = "<form></form><form></form>",
    2 === _t.childNodes.length),
    S.parseHTML = function(e, t, n) {
        return "string" != typeof e ? [] : ("boolean" == typeof t && (n = t,
        t = !1),
        t || (y.createHTMLDocument ? ((r = (t = E.implementation.createHTMLDocument("")).createElement("base")).href = E.location.href,
        t.head.appendChild(r)) : t = E),
        o = !n && [],
        (i = N.exec(e)) ? [t.createElement(i[1])] : (i = xe([e], t, o),
        o && o.length && S(o).remove(),
        S.merge([], i.childNodes)));
        var r, i, o
    }
    ,
    S.fn.load = function(e, t, n) {
        var r, i, o, a = this, s = e.indexOf(" ");
        return -1 < s && (r = ht(e.slice(s)),
        e = e.slice(0, s)),
        m(t) ? (n = t,
        t = void 0) : t && "object" == typeof t && (i = "POST"),
        0 < a.length && S.ajax({
            url: e,
            type: i || "GET",
            dataType: "html",
            data: t
        }).done(function(e) {
            o = arguments,
            a.html(r ? S("<div>").append(S.parseHTML(e)).find(r) : e)
        }).always(n && function(e, t) {
            a.each(function() {
                n.apply(this, o || [e.responseText, t, e])
            })
        }
        ),
        this
    }
    ,
    S.expr.pseudos.animated = function(t) {
        return S.grep(S.timers, function(e) {
            return t === e.elem
        }).length
    }
    ,
    S.offset = {
        setOffset: function(e, t, n) {
            var r, i, o, a, s, u, l = S.css(e, "position"), c = S(e), f = {};
            "static" === l && (e.style.position = "relative"),
            s = c.offset(),
            o = S.css(e, "top"),
            u = S.css(e, "left"),
            ("absolute" === l || "fixed" === l) && -1 < (o + u).indexOf("auto") ? (a = (r = c.position()).top,
            i = r.left) : (a = parseFloat(o) || 0,
            i = parseFloat(u) || 0),
            m(t) && (t = t.call(e, n, S.extend({}, s))),
            null != t.top && (f.top = t.top - s.top + a),
            null != t.left && (f.left = t.left - s.left + i),
            "using"in t ? t.using.call(e, f) : c.css(f)
        }
    },
    S.fn.extend({
        offset: function(t) {
            if (arguments.length)
                return void 0 === t ? this : this.each(function(e) {
                    S.offset.setOffset(this, t, e)
                });
            var e, n, r = this[0];
            return r ? r.getClientRects().length ? (e = r.getBoundingClientRect(),
            n = r.ownerDocument.defaultView,
            {
                top: e.top + n.pageYOffset,
                left: e.left + n.pageXOffset
            }) : {
                top: 0,
                left: 0
            } : void 0
        },
        position: function() {
            if (this[0]) {
                var e, t, n, r = this[0], i = {
                    top: 0,
                    left: 0
                };
                if ("fixed" === S.css(r, "position"))
                    t = r.getBoundingClientRect();
                else {
                    t = this.offset(),
                    n = r.ownerDocument,
                    e = r.offsetParent || n.documentElement;
                    while (e && (e === n.body || e === n.documentElement) && "static" === S.css(e, "position"))
                        e = e.parentNode;
                    e && e !== r && 1 === e.nodeType && ((i = S(e).offset()).top += S.css(e, "borderTopWidth", !0),
                    i.left += S.css(e, "borderLeftWidth", !0))
                }
                return {
                    top: t.top - i.top - S.css(r, "marginTop", !0),
                    left: t.left - i.left - S.css(r, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                var e = this.offsetParent;
                while (e && "static" === S.css(e, "position"))
                    e = e.offsetParent;
                return e || re
            })
        }
    }),
    S.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(t, i) {
        var o = "pageYOffset" === i;
        S.fn[t] = function(e) {
            return $(this, function(e, t, n) {
                var r;
                if (x(e) ? r = e : 9 === e.nodeType && (r = e.defaultView),
                void 0 === n)
                    return r ? r[i] : e[t];
                r ? r.scrollTo(o ? r.pageXOffset : n, o ? n : r.pageYOffset) : e[t] = n
            }, t, e, arguments.length)
        }
    }),
    S.each(["top", "left"], function(e, n) {
        S.cssHooks[n] = Fe(y.pixelPosition, function(e, t) {
            if (t)
                return t = We(e, n),
                Pe.test(t) ? S(e).position()[n] + "px" : t
        })
    }),
    S.each({
        Height: "height",
        Width: "width"
    }, function(a, s) {
        S.each({
            padding: "inner" + a,
            content: s,
            "": "outer" + a
        }, function(r, o) {
            S.fn[o] = function(e, t) {
                var n = arguments.length && (r || "boolean" != typeof e)
                  , i = r || (!0 === e || !0 === t ? "margin" : "border");
                return $(this, function(e, t, n) {
                    var r;
                    return x(e) ? 0 === o.indexOf("outer") ? e["inner" + a] : e.document.documentElement["client" + a] : 9 === e.nodeType ? (r = e.documentElement,
                    Math.max(e.body["scroll" + a], r["scroll" + a], e.body["offset" + a], r["offset" + a], r["client" + a])) : void 0 === n ? S.css(e, t, i) : S.style(e, t, n, i)
                }, s, n ? e : void 0, n)
            }
        })
    }),
    S.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
        S.fn[t] = function(e) {
            return this.on(t, e)
        }
    }),
    S.fn.extend({
        bind: function(e, t, n) {
            return this.on(e, null, t, n)
        },
        unbind: function(e, t) {
            return this.off(e, null, t)
        },
        delegate: function(e, t, n, r) {
            return this.on(t, e, n, r)
        },
        undelegate: function(e, t, n) {
            return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
        },
        hover: function(e, t) {
            return this.mouseenter(e).mouseleave(t || e)
        }
    }),
    S.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function(e, n) {
        S.fn[n] = function(e, t) {
            return 0 < arguments.length ? this.on(n, null, e, t) : this.trigger(n)
        }
    });
    var Xt = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    S.proxy = function(e, t) {
        var n, r, i;
        if ("string" == typeof t && (n = e[t],
        t = e,
        e = n),
        m(e))
            return r = s.call(arguments, 2),
            (i = function() {
                return e.apply(t || this, r.concat(s.call(arguments)))
            }
            ).guid = e.guid = e.guid || S.guid++,
            i
    }
    ,
    S.holdReady = function(e) {
        e ? S.readyWait++ : S.ready(!0)
    }
    ,
    S.isArray = Array.isArray,
    S.parseJSON = JSON.parse,
    S.nodeName = A,
    S.isFunction = m,
    S.isWindow = x,
    S.camelCase = X,
    S.type = w,
    S.now = Date.now,
    S.isNumeric = function(e) {
        var t = S.type(e);
        return ("number" === t || "string" === t) && !isNaN(e - parseFloat(e))
    }
    ,
    S.trim = function(e) {
        return null == e ? "" : (e + "").replace(Xt, "")
    }
    ,
    "function" == typeof define && define.amd && define("jquery", [], function() {
        return S
    });
    var Vt = C.jQuery
      , Gt = C.$;
    return S.noConflict = function(e) {
        return C.$ === S && (C.$ = Gt),
        e && C.jQuery === S && (C.jQuery = Vt),
        S
    }
    ,
    "undefined" == typeof e && (C.jQuery = C.$ = S),
    S
});


/*! For license information please see abdn-design-system-site.js.LICENSE.txt */
( () => {
    var e = {
        1079: () => {
            var e = function(e, t) {
                "use strict";
                var i = {
                    q: function(e, i) {
                        return (i = i || t).querySelectorAll(e)
                    },
                    each: function(e, t) {
                        var i, o = e.length;
                        for (i = 0; i < o; i++)
                            t.call(this, i, e[i])
                    },
                    html: function(e) {
                        var i = t.createElement("div");
                        i.innerHTML = e;
                        var o = i.firstChild;
                        return o
                    },
                    toggleClass: function(e, t) {
                        if (e.classList)
                            e.classList.toggle(t);
                        else {
                            var i = e.className.split(" ")
                              , o = i.indexOf(t);
                            o >= 0 ? i.splice(o, 1) : i.push(t),
                            e.className = i.join(" ")
                        }
                    },
                    slugify: function(e) {
                        return e.toString().toLowerCase().replace(/\s+/g, "_").replace(/[^\w\_]+/g, "")
                    }
                }
                  , o = function(t, o, s) {
                    this.nav = t,
                    this.list = this.getListItemsHTML(this.nav),
                    this.listArray = this.listArray || [],
                    this.moreButton = o.moreButton,
                    this.moreButtonClass = o.moreButtonClass,
                    this.moreDropdownClass = o.moreDropdownClass,
                    this.uid = s;
                    var n = this;
                    return this.listArray.length || i.each(n.list, (function(e, t) {
                        n.listArray.push({
                            html: t.cloneNode(!0),
                            width: t.offsetWidth
                        })
                    }
                    )),
                    this.draw(),
                    function(t) {
                        e.addEventListener("resize", (function() {
                            t.draw()
                        }
                        ))
                    }(this),
                    this
                };
                o.prototype.getMoreBtnHTML = function(e) {
                    return i.q(".priority_plus_more", e)[0]
                }
                ,
                o.prototype.getListItemsHTML = function(e) {
                    return i.q("li", e)
                }
                ,
                o.prototype.getMoreListHTML = function(e) {
                    return i.q(".more_list", e)[0]
                }
                ,
                o.prototype.draw = function() {
                    var e, t, o, s, n = 0, a = [];
                    t = this.nav,
                    i.each(this.listArray, (function(e, t) {
                        n += t.width
                    }
                    )),
                    t.appendChild(i.html(this.moreButton));
                    var r = this.getMoreBtnHTML(t).offsetWidth;
                    t.removeChild(this.getMoreBtnHTML(t)),
                    e = this.getListItemsHTML(t),
                    i.each(e, (function(e, i) {
                        t.removeChild(i)
                    }
                    ));
                    var l = 0
                      , d = t.offsetWidth;
                    if (i.each(this.listArray, (function(e, i) {
                        l += i.width,
                        n >= d && l >= d - r - 5 ? a.push(i) : t.appendChild(i.html)
                    }
                    )),
                    !(n < d)) {
                        t.appendChild(i.html(this.moreButton)),
                        (o = this.getMoreBtnHTML(t)).appendChild(i.html('<ul class="more_list"></ul>')),
                        s = this.getMoreListHTML(t),
                        i.each(a, (function(e, t) {
                            s.appendChild(t.html)
                        }
                        ));
                        var c = i.q("." + this.moreButtonClass + ">a", t)[0];
                        s.setAttribute("id", "priority_list_" + this.uid),
                        c.setAttribute("aria-controls", "priority_list_" + this.uid),
                        c.setAttribute("aria-label", "Toggle display of more links"),
                        c.setAttribute("aria-expanded", "false"),
                        s.setAttribute("aria-hidden", "true");
                        c.onclick = function(e) {
                            i.toggleClass(o, "active"),
                            "true" === c.getAttribute("aria-expanded") ? (c.setAttribute("aria-expanded", "false"),
                            s.setAttribute("aria-hidden", "true")) : (c.setAttribute("aria-expanded", "true"),
                            s.setAttribute("aria-hidden", "false")),
                            e.preventDefault()
                        }
                    }
                }
                ;
                return function(e) {
                    var t, s, n = e || {};
                    this.selector = n.selector,
                    (s = {}).moreButtonClass = n.moreButtonClass || "priority_plus_more",
                    s.moreDropdownClass = n.moreButtonClass || "more_list",
                    s.moreButtonContent = n.moreButtonContent || '<a href="#"><b>More &#8964;</b></a>',
                    s.moreButton = '<li class="' + s.moreButtonClass + '">' + s.moreButtonContent + "</li>",
                    t = i.q(this.selector),
                    i.each(t, (function(e, t) {
                        var a = i.slugify(n.selector);
                        new o(t,s,a)
                    }
                    ))
                }
            }(window, document);
            window.PriorityPlusList = e
        }
        ,
        1669: e => {
            "use strict";
            e.exports = jQuery
        }
        ,
        1880: (e, t, o) => {
            function s(e) {
                $("#ccc").css("z-index", 2147483647),
                $(".section-nav-toggle").attr("aria-expanded", "false"),
                $("#section-nav").off("transitionend"),
                $("#section-nav").removeClass("active"),
                setTimeout((function() {
                    $(".section-nav-wrapper").removeClass("active"),
                    $("body").removeClass("section-nav-open"),
                    $("#top").removeClass("section-nav-open"),
                    $("main").removeClass("section-nav-open"),
                    n(),
                    e && $(".section-nav-toggle").focus()
                }
                ), 600)
            }
            function n() {
                $(".section-nav nav .clone").remove(),
                $(".section-nav nav .cloned").removeClass("animation-slide-in-right animation-slide-in-left cloned");
                var e = document.querySelectorAll(".section-nav nav .active");
                for (i = 0; i < e.length; i++)
                    e[i].classList.remove("active");
                var t = document.querySelectorAll(".section-nav nav [data-original-class]");
                for (i = 0; i < t.length; i++)
                    t[i].className = t[i].dataset.originalClass
            }
            var a, r, l, d;
            o(1079),
            window.hideSectionNav = s,
            $(document).ready((function() {
                if ("querySelector"in document && "addEventListener"in window) {
                    window.innerWidth <= 940 && (document.querySelector(".section-nav nav").classList.toggle("no-js"),
                    document.querySelector(".section-nav nav").classList.toggle("has-js"));
                    var e = document.querySelectorAll(".section-nav nav a");
                    for (i = 0; i < e.length; i++) {
                        if (0 == i && e[i].addEventListener("keydown", (function(e) {
                            document.querySelector(".section-nav nav").classList.contains("has-js") && this.classList.contains("active") && e.shiftKey && "Tab" == e.key && (e.preventDefault(),
                            document.querySelector(".section-nav-toggle").focus())
                        }
                        )),
                        e[i].parentNode.getElementsByTagName("ul").length) {
                            e[i].classList.add("has-subpages"),
                            (t = document.createElement("button")).className = "section-nav-expander",
                            (o = document.createElement("span")).className = "offscreen";
                            var t, o, c = document.createTextNode("Show submenu for " + e[i].innerText);
                            o.appendChild(c),
                            t.appendChild(o),
                            $(e[i]).wrap("<div></div>").parent().addClass("navigation-link"),
                            e[i].parentNode.insertBefore(t, e[i].nextElementSibling),
                            t.addEventListener("click", (function() {
                                $button = $(this),
                                $targetUl = $button.closest("ul"),
                                $targetUl.wrap("<div></div>"),
                                $animationWrapper = $targetUl.parent(),
                                $animationWrapper.addClass("animation-wrapper"),
                                $clone = $targetUl.clone(!0),
                                $clone.addClass("clone"),
                                $animationWrapper.prepend($clone),
                                $targetUl.addClass("cloned"),
                                $button.closest("li").addClass("active"),
                                $(".section-nav nav a.current").removeClass("current"),
                                $animationWrapper.addClass("animation-slide-out-left"),
                                $animationWrapper.on("animationend", (function() {
                                    $clone.remove(),
                                    $targetUl.unwrap(),
                                    $targetUl.removeClass("cloned")
                                }
                                ))
                            }
                            )),
                            (t = document.createElement("button")).className = "section-nav-collapser",
                            (o = document.createElement("span")).className = "offscreen";
                            c = document.createTextNode("Show full submenu for " + e[i].innerText);
                            o.appendChild(c),
                            t.appendChild(o),
                            e[i].parentNode.insertBefore(t, e[i]),
                            e[i].classList.contains("current") && t.classList.add("current"),
                            t.addEventListener("click", (function() {
                                $button = $(this),
                                $targetUl = $button.closest("ul"),
                                $targetUl.wrap("<div></div>"),
                                $animationWrapper = $targetUl.parent(),
                                $animationWrapper.addClass("animation-wrapper"),
                                $clone = $targetUl.clone(!0),
                                $clone.addClass("clone"),
                                $animationWrapper.append($clone),
                                $targetUl.addClass("cloned"),
                                $targetUl.find("li.active").removeClass("active"),
                                $button.closest("li").addClass("active"),
                                $(".section-nav nav a.current").removeClass("current"),
                                $animationWrapper.addClass("animation-slide-in-left"),
                                $animationWrapper.on("animationend", (function() {
                                    $clone.remove(),
                                    $targetUl.unwrap(),
                                    $targetUl.removeClass("cloned")
                                }
                                ))
                            }
                            ))
                        }
                        e[i].classList.contains("active-with-siblings") && e[i].parentNode.parentNode.parentNode.children[0].classList.add("current")
                    }
                    var p = document.querySelectorAll(".section-nav nav [class]");
                    for (i = 0; i < p.length; i++)
                        p[i].dataset.originalClass = p[i].className;
                    window.innerWidth <= 940 && (a = document.querySelector(".section-nav > nav > ul"),
                    r = document.querySelector(".section-nav > nav > ul > li > ul > li"),
                    l = document.querySelector(".section-nav > nav > ul > li"),
                    a.append(r),
                    d = a.removeChild(l));
                    var u = (h = function() {
                        var e = document.querySelector(".section-nav nav");
                        window.innerWidth <= 940 ? (e.classList.contains("no-js") && (a = document.querySelector(".section-nav > nav > ul"),
                        r = document.querySelector(".section-nav > nav > ul > li > ul > li"),
                        l = document.querySelector(".section-nav > nav > ul > li"),
                        a.append(r),
                        d = a.removeChild(l)),
                        e.classList.add("has-js"),
                        e.classList.remove("no-js")) : (n(),
                        e.classList.contains("has-js") && (a = document.querySelector(".section-nav > nav > ul"),
                        r = document.querySelector(".section-nav > nav > ul > li"),
                        temp_current_section_nav = a.removeChild(r),
                        a.appendChild(d),
                        document.querySelector(".section-nav > nav > ul > li > ul").append(temp_current_section_nav)),
                        e.classList.add("no-js"),
                        e.classList.remove("has-js"))
                    }
                    ,
                    f = 125,
                    function() {
                        var e = this
                          , t = arguments
                          , i = v && !g;
                        clearTimeout(g),
                        g = setTimeout((function() {
                            g = null,
                            v || h.apply(e, t)
                        }
                        ), f),
                        i && h.apply(e, t)
                    }
                    );
                    window.addEventListener("resize", u)
                }
                var h, f, v, g;
                $(".section-nav-wrapper").addClass("can-toggle"),
                $(".section-nav-toggle").attr("aria-controls", "section-nav"),
                $(".section-nav-toggle").attr("aria-expanded", "false"),
                $(".section-nav-toggle").click((function(e) {
                    e.preventDefault(),
                    section_nav_expanded = $(".section-nav-toggle").attr("aria-expanded"),
                    section_nav_expanded = "false" == section_nav_expanded ? "true" : "false",
                    "true" == section_nav_expanded ? (showModalOverlay(),
                    $("#ccc").css("z-index", 0),
                    $("body").addClass("section-nav-open"),
                    $("#top").addClass("section-nav-open"),
                    $("main").addClass("section-nav-open"),
                    $(".section-nav-toggle").attr("aria-expanded", "true"),
                    $("#section-nav").off("transitionend"),
                    $(".section-nav-wrapper").addClass("active"),
                    setTimeout((function() {
                        $("#section-nav").addClass("active");
                        var e = document.querySelector(".section-nav-toggle-wrapper").getBoundingClientRect().bottom;
                        $(".section-nav-wrapper").css({
                            top: e
                        })
                    }
                    ), 10),
                    $("#section-nav").on("keyup", (function(e) {
                        27 == e.which && (hideModalOverlay(),
                        s(!0))
                    }
                    )),
                    $("#section-nav").find("button, [href]").first().on("keydown", (function(e) {
                        9 == e.which && e.shiftKey && (e.preventDefault(),
                        $(".section-nav-toggle").focus())
                    }
                    ))) : (s(!0),
                    hideModalOverlay())
                }
                )),
                $(".section-nav-toggle").on("keydown", (function(e) {
                    9 == e.which && $("#section-nav").hasClass("active") && (e.preventDefault(),
                    $("#section-nav").find("button, [href]").filter(":visible:first").focus()),
                    27 == e.which && (hideModalOverlay(),
                    s(!0))
                }
                ))
            }
            ))
        }
        ,
        2703: (e, t, i) => {
            var o, s, n;
            !function() {
                "use strict";
                s = [i(1669)],
                void 0 === (n = "function" == typeof (o = function(e) {
                    var t, i, o = {
                        interval: 100,
                        sensitivity: 7,
                        timeout: 800
                    }, s = 0, n = function(e) {
                        t = e.pageX,
                        i = e.pageY
                    }, a = function e(o, s, a, r) {
                        if (Math.sqrt((a.pX - t) * (a.pX - t) + (a.pY - i) * (a.pY - i)) < r.sensitivity)
                            return s.off(a.event, n),
                            delete a.timeoutId,
                            a.isActive = !0,
                            o.pageX = t,
                            o.pageY = i,
                            delete a.pX,
                            delete a.pY,
                            r.over.apply(s[0], [o]);
                        a.pX = t,
                        a.pY = i,
                        a.timeoutId = setTimeout((function() {
                            e(o, s, a, r)
                        }
                        ), r.interval)
                    }, r = function(e, t, i, o) {
                        return delete t.data("hoverIntent")[i.id],
                        o.apply(t[0], [e])
                    };
                    e.fn.hoverIntent = function(t, i, l) {
                        var d = s++
                          , c = e.extend({}, o);
                        e.isPlainObject(t) ? (c = e.extend(c, t),
                        e.isFunction(c.out) || (c.out = c.over)) : c = e.isFunction(i) ? e.extend(c, {
                            over: t,
                            out: i,
                            selector: l
                        }) : e.extend(c, {
                            over: t,
                            out: t,
                            selector: i
                        });
                        var p = function(t) {
                            var i = e.extend({}, t)
                              , o = e(this)
                              , s = o.data("hoverIntent");
                            s || o.data("hoverIntent", s = {});
                            var l = s[d];
                            l || (s[d] = l = {
                                id: d
                            }),
                            l.timeoutId && (l.timeoutId = clearTimeout(l.timeoutId));
                            var p = l.event = "mousemove.hoverIntent.hoverIntent" + d;
                            if ("mouseenter" === t.type) {
                                if (l.isActive)
                                    return;
                                l.pX = i.pageX,
                                l.pY = i.pageY,
                                o.off(p, n).on(p, n),
                                l.timeoutId = setTimeout((function() {
                                    a(i, o, l, c)
                                }
                                ), c.interval)
                            } else {
                                if (!l.isActive)
                                    return;
                                o.off(p, n),
                                l.timeoutId = setTimeout((function() {
                                    r(i, o, l, c.out)
                                }
                                ), c.timeout)
                            }
                        };
                        return this.on({
                            "mouseenter.hoverIntent": p,
                            "mouseleave.hoverIntent": p
                        }, c.selector)
                    }
                }
                ) ? o.apply(t, s) : o) || (e.exports = n)
            }()
        }
        ,
        2992: () => {
            $(document).ready((function() {
                document.querySelector("#global_alert .alert-message p") && (document.querySelector("#global_alert .alert-message p").innerHTML += " ")
            }
            ))
        }
        ,
        3768: () => {
            window.abdnDesignSystem = window.abdnDesignSystem || {},
            window.abdnDesignSystem.search = window.abdnDesignSystem.search || {
                collection: "abdn~sp-meta-all",
                suggestionURL: "https://abdn-search.funnelback.squiz.cloud/s/suggest.json"
            },
            window.abdnDesignSystem.translations = window.abdnDesignSystem.translations || {
                unexpectedError: "An unexpected error occurred, please try again later.",
                validationFailed: "There has been a problem with your submission. Errors are highlighted below."
            },
            jQuery && jQuery.extend(jQuery.expr[":"], {
                focusable: function(e, t, i) {
                    return $(e).is('button, [href], input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])')
                }
            })
        }
        ,
        4143: () => {
            $(document).ready((function() {
                $('iframe[src*="kaltura.com"], iframe[src*="youtube.com"], iframe[src*="vimeo.com"], iframe[src*="prezi.com"], iframe[src*="panopto.eu"], div[class="kWidgetIframeContainer"]').each((function() {
                    var e = $(this);
                    if (e.removeAttr("style"),
                    e.hasClass("kWidgetIframeContainer"))
                        return e.removeClass("kWidgetIframeContainer"),
                        void e.addClass("video_container");
                    var t = e.attr("src");
                    t.indexOf("http:") > -1 && (t = t.replace("http:", "https:")),
                    t.indexOf("cdnapi.kaltura") > -1 && (t = t.replace("cdnapi.kaltura", "cdnapisec.kaltura")),
                    e.attr("src").match(/playlistAPI/) ? e.css("width", "100%") : (e.parent().hasClass("video_container") || e.parent().parent().hasClass("homepage_video_container") || e.wrap('<div class="video_container"></div>'),
                    t.indexOf("youtube") > -1 && (t.indexOf("rel=") > -1 ? t = t.replace(/rel=[1-9]/, "rel=0") : (-1 === t.indexOf("?") ? t += "?" : t += "&",
                    t += "rel=0")),
                    e.attr("src", t))
                }
                ))
            }
            ))
        }
        ,
        4210: () => {
            function e() {
                $(window).width() < 920 ? $(".facet_toggle_wrapper").length ? $(".facet_toggle_wrapper").hasClass("active") || ($(".facet_wrapper").append($(".search_refine")),
                $(".search_related").addClass("full"),
                $(".search_refine h2").addClass("offscreen"),
                $(".facet_toggle_wrapper").addClass("active")) : function() {
                    if ($(window).width() <= 940) {
                        var e = $('<div class="facet_toggle_wrapper active"></div>');
                        $("#search-result-count").before(e);
                        var t = $('<div id="facet_wrapper" class="facet_wrapper collapsed" style="display: none;"></div>');
                        e.append(t);
                        var i = $('<button class="facet_toggle" aria-controls="facet_wrapper" aria-expanded="false">Refine your search</button>');
                        t.before(i),
                        i.click((function() {
                            t.hasClass("collapsed") ? (t.removeClass("collapsed"),
                            i.attr("aria-expanded", "true"),
                            t.slideDown()) : (t.slideUp(),
                            setTimeout((function() {
                                t.addClass("collapsed"),
                                i.attr("aria-expanded", "false")
                            }
                            ), 401))
                        }
                        )),
                        t.append($(".search_refine")),
                        $(".search_refine h2").addClass("offscreen"),
                        $(".search_related").addClass("full");
                        var o = $('<div class="facet_clear_wrapper clearfix"></div>')
                          , s = $("<dl></dl>")
                          , n = $("<dt>Your Active Filter</dt>")
                          , a = $('<dd class="facet_clear_label"></dd>')
                          , r = $('<a href="#" class="facet_clear">Clear</a>');
                        t.after(o),
                        o.append(s),
                        s.append(n),
                        s.append(a),
                        o.append(r);
                        var l = $(".search_refine a.flaticon-all").attr("href");
                        if (r.attr("href", l),
                        $(".selected_facet").length) {
                            var d = $("#search-result-count .selected_facet").text();
                            a.text(d),
                            o.addClass("active")
                        }
                    }
                }() : $(".facet_toggle_wrapper").hasClass("active") && ($(".search_related").before($(".search_refine")),
                $(".search_related").removeClass("full"),
                $(".search_refine h2").removeClass("offscreen"),
                $(".facet_toggle_wrapper").removeClass("active"))
            }
            $(document).ready((function() {
                e(),
                $(window).resize((function() {
                    e()
                }
                ))
            }
            )),
            $(window).on("load", (function() {
                $(".people_img img").each((function() {
                    $(this).width() > $(this).height() && $(this).parent().addClass("landscape")
                }
                ))
            }
            ))
        }
        ,
        4686: () => {
            $(document).ready((function() {
                $("table").each((function() {
                    $(this).wrap('<div class="responsive_table"></div>'),
                    $(this).css("table-layout", "auto"),
                    $(this).css("width", "100%")
                }
                ))
            }
            ))
        }
        ,
        5306: (e, t, i) => {
            i(5969);
            var o = !1
              , s = !0;
            function n(e) {
                var t = e.parent();
                if (0 == (i = t.find(".slideshow_controls_wrapper")).length)
                    var i = $(document.createElement("div")).addClass("slideshow_controls_wrapper").appendTo(t);
                e.hasClass("gallery_area") || i.addClass("offscreen");
                var o = $(document.createElement("div")).addClass("slideshow_stats").appendTo(i);
                if (e.hasClass("slick-slider"))
                    var s = e;
                else
                    s = e.find(".slider").eq(0);
                s.on("focus", "button", (function(e) {
                    o.attr("aria-live", "polite")
                }
                )),
                s.on("blur", "button", (function(e) {
                    o.removeAttr("aria-live")
                }
                )),
                s.on("init reInit afterChange", (function(e, t, i, s) {
                    var n = (i || 0) + 1;
                    o.text("Image " + n + " of " + t.slideCount)
                }
                ))
            }
            function a(e) {
                e.find("a.lightbox").magnificPopup({
                    type: "image",
                    tLoading: "Loading image #%curr%...",
                    mainClass: "mfp-img-mobile",
                    gallery: {
                        enabled: !0,
                        navigateByImgClick: !0
                    },
                    image: {
                        tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
                        titleSrc: function(e) {
                            return lightboxTitle = "",
                            e.el.attr("title") && e.el.attr("title").length > 0 && (lightboxTitle = '<span id="lightboxTitle">' + e.el.attr("title") + "</span>"),
                            lightboxDescription = "",
                            e.el.attr("data-caption") && e.el.attr("data-caption").length > 0 && (lightboxDescription = '<small id="lightboxDescription">' + e.el.attr("data-caption") + "</small>"),
                            lightboxTitle + lightboxDescription
                        }
                    }
                }),
                $(".slider a.lightbox").on("mfpOpen", (function(e) {
                    $(".mfp-content").attr("aria-live", "polite"),
                    $(".mfp-content").attr("role", "dialog"),
                    $(".mfp-content").attr("aria-labelledby", "lightboxTitle"),
                    $(".mfp-content").attr("aria-describedby", "lightboxDescription"),
                    $(".slider").slick("slickPause"),
                    $(".slider_nav").slick("slickPause"),
                    $(".slideshow_controls").html("Play")
                }
                ))
            }
            "ontouchstart"in document.documentElement && navigator.userAgent.match(/Mobi/) && (s = !1,
            o = !0),
            function() {
                function e(e) {
                    if (e.hasClass("slick_slideshow")) {
                        (c = e).removeClass("slick_not_loaded"),
                        c.on("init", (function(e, t) {
                            $(this).find(".slick-dots > li > button").addClass("slideshow_dot")
                        }
                        )),
                        c.on("beforeChange", (function(e, t, i, o) {
                            var s = t.instanceUid.toString()
                              , n = document.getElementById("slick-slide" + s + i.toString())
                              , a = document.getElementById("slick-slide" + s + o.toString());
                            $(n).find("iframe").attr("tabindex", "-1"),
                            $(a).find("iframe").attr("tabindex", "0")
                        }
                        )),
                        c.slick({
                            autoplay: s,
                            autoplaySpeed: 7e3,
                            dots: c.find("> article").length > 1,
                            fade: !0,
                            infinite: !0,
                            adaptiveHeight: !0,
                            speed: 500,
                            pauseOnFocus: !0,
                            accessibility: !0
                        }),
                        $(".slick_slideshow button").click((function() {
                            o = !0
                        }
                        )),
                        $(".slick_slideshow button").keypress((function(e) {
                            13 === e.keyCode && (c.slick("slickPause"),
                            o = !0)
                        }
                        )),
                        c.hover((function() {
                            c.slick("slickPause")
                        }
                        ), (function() {
                            o || c.slick("slickPlay")
                        }
                        )),
                        c.find("article").each((function() {
                            var e = $(this).find("iframe").attr("title");
                            $(this).find(".video_container").prepend('<a class="video_overlay" href="#">Play ' + e + "</a>"),
                            $(this).find(".video_overlay").css("z-index", "2").attr("tabindex", "-1"),
                            $(this).find("iframe").css("z-index", "1").attr("tabindex", "-1"),
                            $(this).find(".video_overlay").click((function(e) {
                                e.preventDefault(),
                                o = !0,
                                $(this).css("display", "none");
                                var t = $(this).next()
                                  , i = t.attr("src");
                                (i.indexOf("youtube") > -1 || i.indexOf("vimeo") > -1) && (-1 === i.indexOf("?") ? i += "?" : i += "&",
                                i += "autoplay=1"),
                                i.indexOf("kaltura") >= 0 && (i += "&flashvars[autoPlay]=true"),
                                t.attr("src", i)
                            }
                            ))
                        }
                        ));
                        var t = c.find("article .video_overlay");
                        $(t[0]).attr("tabindex", "0");
                        var i = c.find("article iframe");
                        $(i[0]).attr("tabindex", "0"),
                        n(c)
                    } else if (e.hasClass("slick_carousel") || e.hasClass("slick_gallery")) {
                        var r = 1100;
                        if ($(".full_width").length > 0)
                            r = 940;
                        (c = e).removeClass("slick_not_loaded"),
                        c.slick({
                            autoplay: !1,
                            autoplaySpeed: 3e3,
                            dots: e.find("> div").length > 1,
                            slidesToShow: 3,
                            slidesToScroll: 3,
                            speed: 500,
                            responsive: [{
                                breakpoint: 1240,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 3
                                }
                            }, {
                                breakpoint: r,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 2
                                }
                            }, {
                                breakpoint: 600,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1
                                }
                            }]
                        })
                    } else if (e.hasClass("gallery_area")) {
                        $current_gallery = e,
                        $current_gallery.attr("id", "gallery_" + increment),
                        (c = $current_gallery.find(".slider.slick_not_loaded")).removeClass("slick_not_loaded"),
                        $current_gallery.find(".slider_nav").css("display", "block");
                        var l = $current_gallery.parent()
                          , d = $(document.createElement("div")).addClass("slideshow_controls_wrapper").appendTo(l);
                        $(document.createElement("button")).addClass("slideshow_controls").html("Play").appendTo(d),
                        n($current_gallery),
                        $current_gallery.find(".slider_for").slick({
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            arrows: !1,
                            fade: !0,
                            adaptiveHeight: !1,
                            asNavFor: ".slider_nav"
                        }),
                        $current_gallery.find(".slider_nav").slick({
                            slidesToShow: $(".news_item").length > 0 || $(".syndicated_details").length > 0 ? 2 : 5,
                            slidesToScroll: 1,
                            asNavFor: ".slider_for",
                            centerMode: !0,
                            focusOnSelect: !0,
                            responsive: [{
                                breakpoint: 1200,
                                settings: {
                                    slidesToShow: 5
                                }
                            }, {
                                breakpoint: 940,
                                settings: {
                                    slidesToShow: $(".news_item").length > 0 || $(".syndicated_details").length > 0 ? 2 : 5
                                }
                            }, {
                                breakpoint: 800,
                                settings: {
                                    slidesToShow: 4
                                }
                            }, {
                                breakpoint: 600,
                                settings: {
                                    slidesToShow: 3
                                }
                            }, {
                                breakpoint: 500,
                                settings: {
                                    slidesToShow: 2
                                }
                            }, {
                                breakpoint: 300,
                                settings: {
                                    slidesToShow: 1
                                }
                            }]
                        }),
                        a($current_gallery),
                        function(e) {
                            var t = e.find(".slider_nav");
                            t.length > 0 && e.find(".slideshow_controls").click((function() {
                                "Play" == $(this).html() ? (t.slick("slickPlay"),
                                $(this).html("Pause")) : ($(this).html("Play"),
                                t.slick("slickPause"))
                            }
                            ))
                        }($current_gallery.parent()),
                        increment++
                    } else if (e.hasClass("hero_slider")) {
                        var c;
                        (c = e).removeClass("slick_not_loaded"),
                        c.on("init", (function(e, t) {
                            $(t.$slides.get(0)).addClass("animate")
                        }
                        )),
                        c.on("beforeChange", (function(e, t, i, o) {
                            $(t.$slides.get(o)).addClass("animate")
                        }
                        )),
                        c.on("afterChange", (function(e, t, i) {
                            $(t.$slider).find(".hero_slide.animate:not(.slick-current)").removeClass("animate")
                        }
                        )),
                        c.slick({
                            autoplay: !0,
                            autoplaySpeed: 7e3,
                            dots: c.find("> article").length > 1,
                            fade: !0,
                            infinite: !0,
                            adaptiveHeight: !0,
                            speed: 500,
                            responsive: [{
                                breakpoint: 780,
                                settings: {
                                    arrows: !1
                                }
                            }],
                            pauseOnHover: !1
                        }),
                        $(".hero_slider button").click((function() {
                            o = !0
                        }
                        )),
                        $(".hero_slider button").keypress((function(e) {
                            13 === e.keyCode && (c.slick("slickPause"),
                            o = !0)
                        }
                        )),
                        c.find(".hero_slide_content, .hero_slide_link, .slick-dots").hover((function() {
                            c.slick("slickPause")
                        }
                        ), (function() {
                            o || c.slick("slickPlay")
                        }
                        )),
                        n(c)
                    }
                }
                $(document).ready((function() {
                    jQuery().slick && (increment = 1,
                    $(".slick_slideshow").each((function(t) {
                        $(this).wrap("<div></div>"),
                        $(this).parent().attr("aria-label", "slideshow_" + increment),
                        e($(this)),
                        increment++
                    }
                    )),
                    $(".slick_carousel").each((function(t) {
                        e($(this)),
                        increment++
                    }
                    )),
                    ($(".slick_gallery").length || $(".gallery_area").length || $(".zoomable").length) && $.getScript("https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/jquery.magnific-popup.js", (function() {
                        $(".slick_gallery").each((function(t) {
                            e($(this)),
                            a($(this)),
                            increment++
                        }
                        )),
                        $(".gallery_area").each((function(t) {
                            e($(this)),
                            a($(this)),
                            increment++
                        }
                        )),
                        $(".zoomable").each((function(e) {
                            a($(this))
                        }
                        ))
                    }
                    )),
                    $(".slick_slideshow").length > 0 && ($(window).scroll((function() {
                        $(".slick_slideshow").each((function() {
                            $(window).scrollTop() > $(this).offset().top + $(this).height() ? $(this).slick("slickPause") : o || $(this).slick("slickPlay")
                        }
                        ))
                    }
                    )),
                    $(".slick_slideshow").each((function() {
                        $(window).scrollTop() > $(this).offset().top + $(this).height() ? $(this).slick("slickPause") : o || $(this).slick("slickPlay")
                    }
                    ))),
                    $(".hero_slider").length > 0 && ($(".hero_slider").each((function(t) {
                        $(this).wrap("<div></div>"),
                        $(this).parent().attr("aria-label", "slideshow_" + increment),
                        e($(this)),
                        increment++
                    }
                    )),
                    $(window).scroll((function() {
                        $(".hero_slider").each((function() {
                            $(window).scrollTop() > $(this).offset().top + $(this).height() ? $(this).slick("slickPause") : o || $(this).slick("slickPlay")
                        }
                        ))
                    }
                    ))))
                }
                ))
            }()
        }
        ,
        5969: (e, t, i) => {
            var o, s, n;
            !function() {
                "use strict";
                s = [i(1669)],
                o = function(e) {
                    var t = window.Slick || {};
                    (t = function() {
                        var t = 0;
                        return function(i, o) {
                            var s, n = this;
                            n.defaults = {
                                accessibility: !0,
                                adaptiveHeight: !1,
                                appendArrows: e(i),
                                appendDots: e(i),
                                arrows: !0,
                                asNavFor: null,
                                prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
                                nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
                                autoplay: !1,
                                autoplaySpeed: 3e3,
                                centerMode: !1,
                                centerPadding: "50px",
                                cssEase: "ease",
                                customPaging: function(t, i) {
                                    return e('<button type="button" />').text(i + 1)
                                },
                                dots: !1,
                                dotsClass: "slick-dots",
                                draggable: !0,
                                easing: "linear",
                                edgeFriction: .35,
                                fade: !1,
                                focusOnSelect: !1,
                                focusOnChange: !1,
                                infinite: !0,
                                initialSlide: 0,
                                lazyLoad: "ondemand",
                                mobileFirst: !1,
                                pauseOnHover: !0,
                                pauseOnFocus: !0,
                                pauseOnDotsHover: !1,
                                respondTo: "window",
                                responsive: null,
                                rows: 1,
                                rtl: !1,
                                slide: "",
                                slidesPerRow: 1,
                                slidesToShow: 1,
                                slidesToScroll: 1,
                                speed: 500,
                                swipe: !0,
                                swipeToSlide: !1,
                                touchMove: !0,
                                touchThreshold: 5,
                                useCSS: !0,
                                useTransform: !0,
                                variableWidth: !1,
                                vertical: !1,
                                verticalSwiping: !1,
                                waitForAnimate: !0,
                                zIndex: 1e3
                            },
                            n.initials = {
                                animating: !1,
                                dragging: !1,
                                autoPlayTimer: null,
                                currentDirection: 0,
                                currentLeft: null,
                                currentSlide: 0,
                                direction: 1,
                                $dots: null,
                                listWidth: null,
                                listHeight: null,
                                loadIndex: 0,
                                $nextArrow: null,
                                $prevArrow: null,
                                scrolling: !1,
                                slideCount: null,
                                slideWidth: null,
                                $slideTrack: null,
                                $slides: null,
                                sliding: !1,
                                slideOffset: 0,
                                swipeLeft: null,
                                swiping: !1,
                                $list: null,
                                touchObject: {},
                                transformsEnabled: !1,
                                unslicked: !1
                            },
                            e.extend(n, n.initials),
                            n.activeBreakpoint = null,
                            n.animType = null,
                            n.animProp = null,
                            n.breakpoints = [],
                            n.breakpointSettings = [],
                            n.cssTransitions = !1,
                            n.focussed = !1,
                            n.interrupted = !1,
                            n.hidden = "hidden",
                            n.paused = !0,
                            n.positionProp = null,
                            n.respondTo = null,
                            n.rowCount = 1,
                            n.shouldClick = !0,
                            n.$slider = e(i),
                            n.$slidesCache = null,
                            n.transformType = null,
                            n.transitionType = null,
                            n.visibilityChange = "visibilitychange",
                            n.windowWidth = 0,
                            n.windowTimer = null,
                            s = e(i).data("slick") || {},
                            n.options = e.extend({}, n.defaults, o, s),
                            n.currentSlide = n.options.initialSlide,
                            n.originalSettings = n.options,
                            void 0 !== document.mozHidden ? (n.hidden = "mozHidden",
                            n.visibilityChange = "mozvisibilitychange") : void 0 !== document.webkitHidden && (n.hidden = "webkitHidden",
                            n.visibilityChange = "webkitvisibilitychange"),
                            n.autoPlay = e.proxy(n.autoPlay, n),
                            n.autoPlayClear = e.proxy(n.autoPlayClear, n),
                            n.autoPlayIterator = e.proxy(n.autoPlayIterator, n),
                            n.changeSlide = e.proxy(n.changeSlide, n),
                            n.clickHandler = e.proxy(n.clickHandler, n),
                            n.selectHandler = e.proxy(n.selectHandler, n),
                            n.setPosition = e.proxy(n.setPosition, n),
                            n.swipeHandler = e.proxy(n.swipeHandler, n),
                            n.dragHandler = e.proxy(n.dragHandler, n),
                            n.keyHandler = e.proxy(n.keyHandler, n),
                            n.instanceUid = t++,
                            n.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/,
                            n.registerBreakpoints(),
                            n.init(!0)
                        }
                    }()).prototype.activateADA = function() {
                        this.$slideTrack.find(".slick-active").attr({
                            "aria-hidden": "false"
                        }).find("a, input, button, select").attr({
                            tabindex: "0"
                        })
                    }
                    ,
                    t.prototype.addSlide = t.prototype.slickAdd = function(t, i, o) {
                        var s = this;
                        if ("boolean" == typeof i)
                            o = i,
                            i = null;
                        else if (i < 0 || i >= s.slideCount)
                            return !1;
                        s.unload(),
                        "number" == typeof i ? 0 === i && 0 === s.$slides.length ? e(t).appendTo(s.$slideTrack) : o ? e(t).insertBefore(s.$slides.eq(i)) : e(t).insertAfter(s.$slides.eq(i)) : !0 === o ? e(t).prependTo(s.$slideTrack) : e(t).appendTo(s.$slideTrack),
                        s.$slides = s.$slideTrack.children(this.options.slide),
                        s.$slideTrack.children(this.options.slide).detach(),
                        s.$slideTrack.append(s.$slides),
                        s.$slides.each((function(t, i) {
                            e(i).attr("data-slick-index", t)
                        }
                        )),
                        s.$slidesCache = s.$slides,
                        s.reinit()
                    }
                    ,
                    t.prototype.animateHeight = function() {
                        var e = this;
                        if (1 === e.options.slidesToShow && !0 === e.options.adaptiveHeight && !1 === e.options.vertical) {
                            var t = e.$slides.eq(e.currentSlide).outerHeight(!0);
                            e.$list.animate({
                                height: t
                            }, e.options.speed)
                        }
                    }
                    ,
                    t.prototype.animateSlide = function(t, i) {
                        var o = {}
                          , s = this;
                        s.animateHeight(),
                        !0 === s.options.rtl && !1 === s.options.vertical && (t = -t),
                        !1 === s.transformsEnabled ? !1 === s.options.vertical ? s.$slideTrack.animate({
                            left: t
                        }, s.options.speed, s.options.easing, i) : s.$slideTrack.animate({
                            top: t
                        }, s.options.speed, s.options.easing, i) : !1 === s.cssTransitions ? (!0 === s.options.rtl && (s.currentLeft = -s.currentLeft),
                        e({
                            animStart: s.currentLeft
                        }).animate({
                            animStart: t
                        }, {
                            duration: s.options.speed,
                            easing: s.options.easing,
                            step: function(e) {
                                e = Math.ceil(e),
                                !1 === s.options.vertical ? (o[s.animType] = "translate(" + e + "px, 0px)",
                                s.$slideTrack.css(o)) : (o[s.animType] = "translate(0px," + e + "px)",
                                s.$slideTrack.css(o))
                            },
                            complete: function() {
                                i && i.call()
                            }
                        })) : (s.applyTransition(),
                        t = Math.ceil(t),
                        !1 === s.options.vertical ? o[s.animType] = "translate3d(" + t + "px, 0px, 0px)" : o[s.animType] = "translate3d(0px," + t + "px, 0px)",
                        s.$slideTrack.css(o),
                        i && setTimeout((function() {
                            s.disableTransition(),
                            i.call()
                        }
                        ), s.options.speed))
                    }
                    ,
                    t.prototype.getNavTarget = function() {
                        var t = this
                          , i = t.options.asNavFor;
                        return i && null !== i && (i = e(i).not(t.$slider)),
                        i
                    }
                    ,
                    t.prototype.asNavFor = function(t) {
                        var i = this.getNavTarget();
                        null !== i && "object" == typeof i && i.each((function() {
                            var i = e(this).slick("getSlick");
                            i.unslicked || i.slideHandler(t, !0)
                        }
                        ))
                    }
                    ,
                    t.prototype.applyTransition = function(e) {
                        var t = this
                          , i = {};
                        !1 === t.options.fade ? i[t.transitionType] = t.transformType + " " + t.options.speed + "ms " + t.options.cssEase : i[t.transitionType] = "opacity " + t.options.speed + "ms " + t.options.cssEase,
                        !1 === t.options.fade ? t.$slideTrack.css(i) : t.$slides.eq(e).css(i)
                    }
                    ,
                    t.prototype.autoPlay = function() {
                        var e = this;
                        e.autoPlayClear(),
                        e.slideCount > e.options.slidesToShow && (e.autoPlayTimer = setInterval(e.autoPlayIterator, e.options.autoplaySpeed))
                    }
                    ,
                    t.prototype.autoPlayClear = function() {
                        var e = this;
                        e.autoPlayTimer && clearInterval(e.autoPlayTimer)
                    }
                    ,
                    t.prototype.autoPlayIterator = function() {
                        var e = this
                          , t = e.currentSlide + e.options.slidesToScroll;
                        e.paused || e.interrupted || e.focussed || (!1 === e.options.infinite && (1 === e.direction && e.currentSlide + 1 === e.slideCount - 1 ? e.direction = 0 : 0 === e.direction && (t = e.currentSlide - e.options.slidesToScroll,
                        e.currentSlide - 1 == 0 && (e.direction = 1))),
                        e.slideHandler(t))
                    }
                    ,
                    t.prototype.buildArrows = function() {
                        var t = this;
                        !0 === t.options.arrows && (t.$prevArrow = e(t.options.prevArrow).addClass("slick-arrow"),
                        t.$nextArrow = e(t.options.nextArrow).addClass("slick-arrow"),
                        t.slideCount > t.options.slidesToShow ? (t.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),
                        t.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),
                        t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.prependTo(t.options.appendArrows),
                        t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.appendTo(t.options.appendArrows),
                        !0 !== t.options.infinite && t.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : t.$prevArrow.add(t.$nextArrow).addClass("slick-hidden").attr({
                            "aria-disabled": "true",
                            tabindex: "-1"
                        }))
                    }
                    ,
                    t.prototype.buildDots = function() {
                        var t, i, o = this;
                        if (!0 === o.options.dots) {
                            for (o.$slider.addClass("slick-dotted"),
                            i = e("<ul />").addClass(o.options.dotsClass),
                            t = 0; t <= o.getDotCount(); t += 1)
                                i.append(e("<li />").append(o.options.customPaging.call(this, o, t)));
                            o.$dots = i.appendTo(o.options.appendDots),
                            o.$dots.find("li").first().addClass("slick-active")
                        }
                    }
                    ,
                    t.prototype.buildOut = function() {
                        var t = this;
                        t.$slides = t.$slider.children(t.options.slide + ":not(.slick-cloned)").addClass("slick-slide"),
                        t.slideCount = t.$slides.length,
                        t.$slides.each((function(t, i) {
                            e(i).attr("data-slick-index", t).data("originalStyling", e(i).attr("style") || "")
                        }
                        )),
                        t.$slider.addClass("slick-slider"),
                        t.$slideTrack = 0 === t.slideCount ? e('<div class="slick-track"/>').appendTo(t.$slider) : t.$slides.wrapAll('<div class="slick-track"/>').parent(),
                        t.$list = t.$slideTrack.wrap('<div class="slick-list"/>').parent(),
                        t.$slideTrack.css("opacity", 0),
                        !0 !== t.options.centerMode && !0 !== t.options.swipeToSlide || (t.options.slidesToScroll = 1),
                        e("img[data-lazy]", t.$slider).not("[src]").addClass("slick-loading"),
                        t.setupInfinite(),
                        t.buildArrows(),
                        t.buildDots(),
                        t.updateDots(),
                        t.setSlideClasses("number" == typeof t.currentSlide ? t.currentSlide : 0),
                        !0 === t.options.draggable && t.$list.addClass("draggable")
                    }
                    ,
                    t.prototype.buildRows = function() {
                        var e, t, i, o, s, n, a, r = this;
                        if (o = document.createDocumentFragment(),
                        n = r.$slider.children(),
                        r.options.rows > 1) {
                            for (a = r.options.slidesPerRow * r.options.rows,
                            s = Math.ceil(n.length / a),
                            e = 0; e < s; e++) {
                                var l = document.createElement("div");
                                for (t = 0; t < r.options.rows; t++) {
                                    var d = document.createElement("div");
                                    for (i = 0; i < r.options.slidesPerRow; i++) {
                                        var c = e * a + (t * r.options.slidesPerRow + i);
                                        n.get(c) && d.appendChild(n.get(c))
                                    }
                                    l.appendChild(d)
                                }
                                o.appendChild(l)
                            }
                            r.$slider.empty().append(o),
                            r.$slider.children().children().children().css({
                                width: 100 / r.options.slidesPerRow + "%",
                                display: "inline-block"
                            })
                        }
                    }
                    ,
                    t.prototype.checkResponsive = function(t, i) {
                        var o, s, n, a = this, r = !1, l = a.$slider.width(), d = window.innerWidth || e(window).width();
                        if ("window" === a.respondTo ? n = d : "slider" === a.respondTo ? n = l : "min" === a.respondTo && (n = Math.min(d, l)),
                        a.options.responsive && a.options.responsive.length && null !== a.options.responsive) {
                            for (o in s = null,
                            a.breakpoints)
                                a.breakpoints.hasOwnProperty(o) && (!1 === a.originalSettings.mobileFirst ? n < a.breakpoints[o] && (s = a.breakpoints[o]) : n > a.breakpoints[o] && (s = a.breakpoints[o]));
                            null !== s ? null !== a.activeBreakpoint ? (s !== a.activeBreakpoint || i) && (a.activeBreakpoint = s,
                            "unslick" === a.breakpointSettings[s] ? a.unslick(s) : (a.options = e.extend({}, a.originalSettings, a.breakpointSettings[s]),
                            !0 === t && (a.currentSlide = a.options.initialSlide),
                            a.refresh(t)),
                            r = s) : (a.activeBreakpoint = s,
                            "unslick" === a.breakpointSettings[s] ? a.unslick(s) : (a.options = e.extend({}, a.originalSettings, a.breakpointSettings[s]),
                            !0 === t && (a.currentSlide = a.options.initialSlide),
                            a.refresh(t)),
                            r = s) : null !== a.activeBreakpoint && (a.activeBreakpoint = null,
                            a.options = a.originalSettings,
                            !0 === t && (a.currentSlide = a.options.initialSlide),
                            a.refresh(t),
                            r = s),
                            t || !1 === r || a.$slider.trigger("breakpoint", [a, r])
                        }
                    }
                    ,
                    t.prototype.changeSlide = function(t, i) {
                        var o, s, n = this, a = e(t.currentTarget);
                        switch (a.is("a") && t.preventDefault(),
                        a.is("li") || (a = a.closest("li")),
                        o = n.slideCount % n.options.slidesToScroll != 0 ? 0 : (n.slideCount - n.currentSlide) % n.options.slidesToScroll,
                        t.data.message) {
                        case "previous":
                            s = 0 === o ? n.options.slidesToScroll : n.options.slidesToShow - o,
                            n.slideCount > n.options.slidesToShow && n.slideHandler(n.currentSlide - s, !1, i);
                            break;
                        case "next":
                            s = 0 === o ? n.options.slidesToScroll : o,
                            n.slideCount > n.options.slidesToShow && n.slideHandler(n.currentSlide + s, !1, i);
                            break;
                        case "index":
                            var r = 0 === t.data.index ? 0 : t.data.index || a.index() * n.options.slidesToScroll;
                            n.slideHandler(n.checkNavigable(r), !1, i),
                            a.children().trigger("focus");
                            break;
                        default:
                            return
                        }
                    }
                    ,
                    t.prototype.checkNavigable = function(e) {
                        var t, i;
                        if (i = 0,
                        e > (t = this.getNavigableIndexes())[t.length - 1])
                            e = t[t.length - 1];
                        else
                            for (var o in t) {
                                if (e < t[o]) {
                                    e = i;
                                    break
                                }
                                i = t[o]
                            }
                        return e
                    }
                    ,
                    t.prototype.cleanUpEvents = function() {
                        var t = this;
                        t.options.dots && null !== t.$dots && (e("li", t.$dots).off("click.slick", t.changeSlide).off("mouseenter.slick", e.proxy(t.interrupt, t, !0)).off("mouseleave.slick", e.proxy(t.interrupt, t, !1)),
                        !0 === t.options.accessibility && t.$dots.off("keydown.slick", t.keyHandler)),
                        t.$slider.off("focus.slick blur.slick"),
                        !0 === t.options.arrows && t.slideCount > t.options.slidesToShow && (t.$prevArrow && t.$prevArrow.off("click.slick", t.changeSlide),
                        t.$nextArrow && t.$nextArrow.off("click.slick", t.changeSlide),
                        !0 === t.options.accessibility && (t.$prevArrow && t.$prevArrow.off("keydown.slick", t.keyHandler),
                        t.$nextArrow && t.$nextArrow.off("keydown.slick", t.keyHandler))),
                        t.$list.off("touchstart.slick mousedown.slick", t.swipeHandler),
                        t.$list.off("touchmove.slick mousemove.slick", t.swipeHandler),
                        t.$list.off("touchend.slick mouseup.slick", t.swipeHandler),
                        t.$list.off("touchcancel.slick mouseleave.slick", t.swipeHandler),
                        t.$list.off("click.slick", t.clickHandler),
                        e(document).off(t.visibilityChange, t.visibility),
                        t.cleanUpSlideEvents(),
                        !0 === t.options.accessibility && t.$list.off("keydown.slick", t.keyHandler),
                        !0 === t.options.focusOnSelect && e(t.$slideTrack).children().off("click.slick", t.selectHandler),
                        e(window).off("orientationchange.slick.slick-" + t.instanceUid, t.orientationChange),
                        e(window).off("resize.slick.slick-" + t.instanceUid, t.resize),
                        e("[draggable!=true]", t.$slideTrack).off("dragstart", t.preventDefault),
                        e(window).off("load.slick.slick-" + t.instanceUid, t.setPosition)
                    }
                    ,
                    t.prototype.cleanUpSlideEvents = function() {
                        var t = this;
                        t.$list.off("mouseenter.slick", e.proxy(t.interrupt, t, !0)),
                        t.$list.off("mouseleave.slick", e.proxy(t.interrupt, t, !1))
                    }
                    ,
                    t.prototype.cleanUpRows = function() {
                        var e, t = this;
                        t.options.rows > 1 && ((e = t.$slides.children().children()).removeAttr("style"),
                        t.$slider.empty().append(e))
                    }
                    ,
                    t.prototype.clickHandler = function(e) {
                        !1 === this.shouldClick && (e.stopImmediatePropagation(),
                        e.stopPropagation(),
                        e.preventDefault())
                    }
                    ,
                    t.prototype.destroy = function(t) {
                        var i = this;
                        i.autoPlayClear(),
                        i.touchObject = {},
                        i.cleanUpEvents(),
                        e(".slick-cloned", i.$slider).detach(),
                        i.$dots && i.$dots.remove(),
                        i.$prevArrow && i.$prevArrow.length && (i.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""),
                        i.htmlExpr.test(i.options.prevArrow) && i.$prevArrow.remove()),
                        i.$nextArrow && i.$nextArrow.length && (i.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""),
                        i.htmlExpr.test(i.options.nextArrow) && i.$nextArrow.remove()),
                        i.$slides && (i.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each((function() {
                            e(this).attr("style", e(this).data("originalStyling"))
                        }
                        )),
                        i.$slideTrack.children(this.options.slide).detach(),
                        i.$slideTrack.detach(),
                        i.$list.detach(),
                        i.$slider.append(i.$slides)),
                        i.cleanUpRows(),
                        i.$slider.removeClass("slick-slider"),
                        i.$slider.removeClass("slick-initialized"),
                        i.$slider.removeClass("slick-dotted"),
                        i.unslicked = !0,
                        t || i.$slider.trigger("destroy", [i])
                    }
                    ,
                    t.prototype.disableTransition = function(e) {
                        var t = this
                          , i = {};
                        i[t.transitionType] = "",
                        !1 === t.options.fade ? t.$slideTrack.css(i) : t.$slides.eq(e).css(i)
                    }
                    ,
                    t.prototype.fadeSlide = function(e, t) {
                        var i = this;
                        !1 === i.cssTransitions ? (i.$slides.eq(e).css({
                            zIndex: i.options.zIndex
                        }),
                        i.$slides.eq(e).animate({
                            opacity: 1
                        }, i.options.speed, i.options.easing, t)) : (i.applyTransition(e),
                        i.$slides.eq(e).css({
                            opacity: 1,
                            zIndex: i.options.zIndex
                        }),
                        t && setTimeout((function() {
                            i.disableTransition(e),
                            t.call()
                        }
                        ), i.options.speed))
                    }
                    ,
                    t.prototype.fadeSlideOut = function(e) {
                        var t = this;
                        !1 === t.cssTransitions ? t.$slides.eq(e).animate({
                            opacity: 0,
                            zIndex: t.options.zIndex - 2
                        }, t.options.speed, t.options.easing) : (t.applyTransition(e),
                        t.$slides.eq(e).css({
                            opacity: 0,
                            zIndex: t.options.zIndex - 2
                        }))
                    }
                    ,
                    t.prototype.filterSlides = t.prototype.slickFilter = function(e) {
                        var t = this;
                        null !== e && (t.$slidesCache = t.$slides,
                        t.unload(),
                        t.$slideTrack.children(this.options.slide).detach(),
                        t.$slidesCache.filter(e).appendTo(t.$slideTrack),
                        t.reinit())
                    }
                    ,
                    t.prototype.focusHandler = function() {
                        var t = this;
                        t.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick", "*", (function(i) {
                            i.stopImmediatePropagation();
                            var o = e(this);
                            setTimeout((function() {
                                t.options.pauseOnFocus && (t.focussed = o.is(":focus"),
                                t.autoPlay())
                            }
                            ), 0)
                        }
                        ))
                    }
                    ,
                    t.prototype.getCurrent = t.prototype.slickCurrentSlide = function() {
                        return this.currentSlide
                    }
                    ,
                    t.prototype.getDotCount = function() {
                        var e = this
                          , t = 0
                          , i = 0
                          , o = 0;
                        if (!0 === e.options.infinite)
                            if (e.slideCount <= e.options.slidesToShow)
                                ++o;
                            else
                                for (; t < e.slideCount; )
                                    ++o,
                                    t = i + e.options.slidesToScroll,
                                    i += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
                        else if (!0 === e.options.centerMode)
                            o = e.slideCount;
                        else if (e.options.asNavFor)
                            for (; t < e.slideCount; )
                                ++o,
                                t = i + e.options.slidesToScroll,
                                i += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
                        else
                            o = 1 + Math.ceil((e.slideCount - e.options.slidesToShow) / e.options.slidesToScroll);
                        return o - 1
                    }
                    ,
                    t.prototype.getLeft = function(e) {
                        var t, i, o, s, n = this, a = 0;
                        return n.slideOffset = 0,
                        i = n.$slides.first().outerHeight(!0),
                        !0 === n.options.infinite ? (n.slideCount > n.options.slidesToShow && (n.slideOffset = n.slideWidth * n.options.slidesToShow * -1,
                        s = -1,
                        !0 === n.options.vertical && !0 === n.options.centerMode && (2 === n.options.slidesToShow ? s = -1.5 : 1 === n.options.slidesToShow && (s = -2)),
                        a = i * n.options.slidesToShow * s),
                        n.slideCount % n.options.slidesToScroll != 0 && e + n.options.slidesToScroll > n.slideCount && n.slideCount > n.options.slidesToShow && (e > n.slideCount ? (n.slideOffset = (n.options.slidesToShow - (e - n.slideCount)) * n.slideWidth * -1,
                        a = (n.options.slidesToShow - (e - n.slideCount)) * i * -1) : (n.slideOffset = n.slideCount % n.options.slidesToScroll * n.slideWidth * -1,
                        a = n.slideCount % n.options.slidesToScroll * i * -1))) : e + n.options.slidesToShow > n.slideCount && (n.slideOffset = (e + n.options.slidesToShow - n.slideCount) * n.slideWidth,
                        a = (e + n.options.slidesToShow - n.slideCount) * i),
                        n.slideCount <= n.options.slidesToShow && (n.slideOffset = 0,
                        a = 0),
                        !0 === n.options.centerMode && n.slideCount <= n.options.slidesToShow ? n.slideOffset = n.slideWidth * Math.floor(n.options.slidesToShow) / 2 - n.slideWidth * n.slideCount / 2 : !0 === n.options.centerMode && !0 === n.options.infinite ? n.slideOffset += n.slideWidth * Math.floor(n.options.slidesToShow / 2) - n.slideWidth : !0 === n.options.centerMode && (n.slideOffset = 0,
                        n.slideOffset += n.slideWidth * Math.floor(n.options.slidesToShow / 2)),
                        t = !1 === n.options.vertical ? e * n.slideWidth * -1 + n.slideOffset : e * i * -1 + a,
                        !0 === n.options.variableWidth && (o = n.slideCount <= n.options.slidesToShow || !1 === n.options.infinite ? n.$slideTrack.children(".slick-slide").eq(e) : n.$slideTrack.children(".slick-slide").eq(e + n.options.slidesToShow),
                        t = !0 === n.options.rtl ? o[0] ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width()) : 0 : o[0] ? -1 * o[0].offsetLeft : 0,
                        !0 === n.options.centerMode && (o = n.slideCount <= n.options.slidesToShow || !1 === n.options.infinite ? n.$slideTrack.children(".slick-slide").eq(e) : n.$slideTrack.children(".slick-slide").eq(e + n.options.slidesToShow + 1),
                        t = !0 === n.options.rtl ? o[0] ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width()) : 0 : o[0] ? -1 * o[0].offsetLeft : 0,
                        t += (n.$list.width() - o.outerWidth()) / 2)),
                        t
                    }
                    ,
                    t.prototype.getOption = t.prototype.slickGetOption = function(e) {
                        return this.options[e]
                    }
                    ,
                    t.prototype.getNavigableIndexes = function() {
                        var e, t = this, i = 0, o = 0, s = [];
                        for (!1 === t.options.infinite ? e = t.slideCount : (i = -1 * t.options.slidesToScroll,
                        o = -1 * t.options.slidesToScroll,
                        e = 2 * t.slideCount); i < e; )
                            s.push(i),
                            i = o + t.options.slidesToScroll,
                            o += t.options.slidesToScroll <= t.options.slidesToShow ? t.options.slidesToScroll : t.options.slidesToShow;
                        return s
                    }
                    ,
                    t.prototype.getSlick = function() {
                        return this
                    }
                    ,
                    t.prototype.getSlideCount = function() {
                        var t, i, o = this;
                        return i = !0 === o.options.centerMode ? o.slideWidth * Math.floor(o.options.slidesToShow / 2) : 0,
                        !0 === o.options.swipeToSlide ? (o.$slideTrack.find(".slick-slide").each((function(s, n) {
                            if (n.offsetLeft - i + e(n).outerWidth() / 2 > -1 * o.swipeLeft)
                                return t = n,
                                !1
                        }
                        )),
                        Math.abs(e(t).attr("data-slick-index") - o.currentSlide) || 1) : o.options.slidesToScroll
                    }
                    ,
                    t.prototype.goTo = t.prototype.slickGoTo = function(e, t) {
                        this.changeSlide({
                            data: {
                                message: "index",
                                index: parseInt(e)
                            }
                        }, t)
                    }
                    ,
                    t.prototype.init = function(t) {
                        var i = this;
                        e(i.$slider).hasClass("slick-initialized") || (e(i.$slider).addClass("slick-initialized"),
                        i.buildRows(),
                        i.buildOut(),
                        i.setProps(),
                        i.startLoad(),
                        i.loadSlider(),
                        i.initializeEvents(),
                        i.updateArrows(),
                        i.updateDots(),
                        i.checkResponsive(!0),
                        i.focusHandler()),
                        t && i.$slider.trigger("init", [i]),
                        !0 === i.options.accessibility && i.initADA(),
                        i.options.autoplay && (i.paused = !1,
                        i.autoPlay())
                    }
                    ,
                    t.prototype.initADA = function() {
                        var t = this
                          , i = Math.ceil(t.slideCount / t.options.slidesToShow)
                          , o = t.getNavigableIndexes().filter((function(e) {
                            return e >= 0 && e < t.slideCount
                        }
                        ));
                        t.$slides.add(t.$slideTrack.find(".slick-cloned")).attr({
                            "aria-hidden": "true",
                            tabindex: "-1"
                        }).find("a, input, button, select").attr({
                            tabindex: "-1"
                        }),
                        null !== t.$dots && (t.$slides.not(t.$slideTrack.find(".slick-cloned")).each((function(i) {
                            var s = o.indexOf(i);
                            e(this).attr({
                                role: "tabpanel",
                                id: "slick-slide" + t.instanceUid + i,
                                tabindex: -1
                            }),
                            -1 !== s && e(this).attr({
                                "aria-describedby": "slick-slide-control" + t.instanceUid + s
                            })
                        }
                        )),
                        t.$dots.attr("role", "tablist").find("li").each((function(s) {
                            var n = o[s];
                            e(this).attr({
                                role: "presentation"
                            }),
                            e(this).find("button").first().attr({
                                role: "tab",
                                id: "slick-slide-control" + t.instanceUid + s,
                                "aria-controls": "slick-slide" + t.instanceUid + n,
                                "aria-label": s + 1 + " of " + i,
                                "aria-selected": null,
                                tabindex: "-1"
                            })
                        }
                        )).eq(t.currentSlide).find("button").attr({
                            "aria-selected": "true",
                            tabindex: "0"
                        }).end());
                        for (var s = t.currentSlide, n = s + t.options.slidesToShow; s < n; s++)
                            t.$slides.eq(s).attr("tabindex", 0);
                        t.activateADA()
                    }
                    ,
                    t.prototype.initArrowEvents = function() {
                        var e = this;
                        !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow.off("click.slick").on("click.slick", {
                            message: "previous"
                        }, e.changeSlide),
                        e.$nextArrow.off("click.slick").on("click.slick", {
                            message: "next"
                        }, e.changeSlide),
                        !0 === e.options.accessibility && (e.$prevArrow.on("keydown.slick", e.keyHandler),
                        e.$nextArrow.on("keydown.slick", e.keyHandler)))
                    }
                    ,
                    t.prototype.initDotEvents = function() {
                        var t = this;
                        !0 === t.options.dots && (e("li", t.$dots).on("click.slick", {
                            message: "index"
                        }, t.changeSlide),
                        !0 === t.options.accessibility && t.$dots.on("keydown.slick", t.keyHandler)),
                        !0 === t.options.dots && !0 === t.options.pauseOnDotsHover && e("li", t.$dots).on("mouseenter.slick", e.proxy(t.interrupt, t, !0)).on("mouseleave.slick", e.proxy(t.interrupt, t, !1))
                    }
                    ,
                    t.prototype.initSlideEvents = function() {
                        var t = this;
                        t.options.pauseOnHover && (t.$list.on("mouseenter.slick", e.proxy(t.interrupt, t, !0)),
                        t.$list.on("mouseleave.slick", e.proxy(t.interrupt, t, !1)))
                    }
                    ,
                    t.prototype.initializeEvents = function() {
                        var t = this;
                        t.initArrowEvents(),
                        t.initDotEvents(),
                        t.initSlideEvents(),
                        t.$list.on("touchstart.slick mousedown.slick", {
                            action: "start"
                        }, t.swipeHandler),
                        t.$list.on("touchmove.slick mousemove.slick", {
                            action: "move"
                        }, t.swipeHandler),
                        t.$list.on("touchend.slick mouseup.slick", {
                            action: "end"
                        }, t.swipeHandler),
                        t.$list.on("touchcancel.slick mouseleave.slick", {
                            action: "end"
                        }, t.swipeHandler),
                        t.$list.on("click.slick", t.clickHandler),
                        e(document).on(t.visibilityChange, e.proxy(t.visibility, t)),
                        !0 === t.options.accessibility && t.$list.on("keydown.slick", t.keyHandler),
                        !0 === t.options.focusOnSelect && e(t.$slideTrack).children().on("click.slick", t.selectHandler),
                        e(window).on("orientationchange.slick.slick-" + t.instanceUid, e.proxy(t.orientationChange, t)),
                        e(window).on("resize.slick.slick-" + t.instanceUid, e.proxy(t.resize, t)),
                        e("[draggable!=true]", t.$slideTrack).on("dragstart", t.preventDefault),
                        e(window).on("load.slick.slick-" + t.instanceUid, t.setPosition),
                        e(t.setPosition)
                    }
                    ,
                    t.prototype.initUI = function() {
                        var e = this;
                        !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow.show(),
                        e.$nextArrow.show()),
                        !0 === e.options.dots && e.slideCount > e.options.slidesToShow && e.$dots.show()
                    }
                    ,
                    t.prototype.keyHandler = function(e) {
                        var t = this;
                        e.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === e.keyCode && !0 === t.options.accessibility ? t.changeSlide({
                            data: {
                                message: !0 === t.options.rtl ? "next" : "previous"
                            }
                        }) : 39 === e.keyCode && !0 === t.options.accessibility && t.changeSlide({
                            data: {
                                message: !0 === t.options.rtl ? "previous" : "next"
                            }
                        }))
                    }
                    ,
                    t.prototype.lazyLoad = function() {
                        function t(t) {
                            e("img[data-lazy]", t).each((function() {
                                var t = e(this)
                                  , i = e(this).attr("data-lazy")
                                  , o = e(this).attr("data-srcset")
                                  , s = e(this).attr("data-sizes") || n.$slider.attr("data-sizes")
                                  , a = document.createElement("img");
                                a.onload = function() {
                                    t.animate({
                                        opacity: 0
                                    }, 100, (function() {
                                        o && (t.attr("srcset", o),
                                        s && t.attr("sizes", s)),
                                        t.attr("src", i).animate({
                                            opacity: 1
                                        }, 200, (function() {
                                            t.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")
                                        }
                                        )),
                                        n.$slider.trigger("lazyLoaded", [n, t, i])
                                    }
                                    ))
                                }
                                ,
                                a.onerror = function() {
                                    t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),
                                    n.$slider.trigger("lazyLoadError", [n, t, i])
                                }
                                ,
                                a.src = i
                            }
                            ))
                        }
                        var i, o, s, n = this;
                        if (!0 === n.options.centerMode ? !0 === n.options.infinite ? s = (o = n.currentSlide + (n.options.slidesToShow / 2 + 1)) + n.options.slidesToShow + 2 : (o = Math.max(0, n.currentSlide - (n.options.slidesToShow / 2 + 1)),
                        s = n.options.slidesToShow / 2 + 1 + 2 + n.currentSlide) : (o = n.options.infinite ? n.options.slidesToShow + n.currentSlide : n.currentSlide,
                        s = Math.ceil(o + n.options.slidesToShow),
                        !0 === n.options.fade && (o > 0 && o--,
                        s <= n.slideCount && s++)),
                        i = n.$slider.find(".slick-slide").slice(o, s),
                        "anticipated" === n.options.lazyLoad)
                            for (var a = o - 1, r = s, l = n.$slider.find(".slick-slide"), d = 0; d < n.options.slidesToScroll; d++)
                                a < 0 && (a = n.slideCount - 1),
                                i = (i = i.add(l.eq(a))).add(l.eq(r)),
                                a--,
                                r++;
                        t(i),
                        n.slideCount <= n.options.slidesToShow ? t(n.$slider.find(".slick-slide")) : n.currentSlide >= n.slideCount - n.options.slidesToShow ? t(n.$slider.find(".slick-cloned").slice(0, n.options.slidesToShow)) : 0 === n.currentSlide && t(n.$slider.find(".slick-cloned").slice(-1 * n.options.slidesToShow))
                    }
                    ,
                    t.prototype.loadSlider = function() {
                        var e = this;
                        e.setPosition(),
                        e.$slideTrack.css({
                            opacity: 1
                        }),
                        e.$slider.removeClass("slick-loading"),
                        e.initUI(),
                        "progressive" === e.options.lazyLoad && e.progressiveLazyLoad()
                    }
                    ,
                    t.prototype.next = t.prototype.slickNext = function() {
                        this.changeSlide({
                            data: {
                                message: "next"
                            }
                        })
                    }
                    ,
                    t.prototype.orientationChange = function() {
                        var e = this;
                        e.checkResponsive(),
                        e.setPosition()
                    }
                    ,
                    t.prototype.pause = t.prototype.slickPause = function() {
                        var e = this;
                        e.autoPlayClear(),
                        e.paused = !0
                    }
                    ,
                    t.prototype.play = t.prototype.slickPlay = function() {
                        var e = this;
                        e.autoPlay(),
                        e.options.autoplay = !0,
                        e.paused = !1,
                        e.focussed = !1,
                        e.interrupted = !1
                    }
                    ,
                    t.prototype.postSlide = function(t) {
                        var i = this;
                        i.unslicked || (i.$slider.trigger("afterChange", [i, t]),
                        i.animating = !1,
                        i.slideCount > i.options.slidesToShow && i.setPosition(),
                        i.swipeLeft = null,
                        i.options.autoplay && i.autoPlay(),
                        !0 === i.options.accessibility && (i.initADA(),
                        i.options.focusOnChange && e(i.$slides.get(i.currentSlide)).attr("tabindex", 0).focus()))
                    }
                    ,
                    t.prototype.prev = t.prototype.slickPrev = function() {
                        this.changeSlide({
                            data: {
                                message: "previous"
                            }
                        })
                    }
                    ,
                    t.prototype.preventDefault = function(e) {
                        e.preventDefault()
                    }
                    ,
                    t.prototype.progressiveLazyLoad = function(t) {
                        t = t || 1;
                        var i, o, s, n, a, r = this, l = e("img[data-lazy]", r.$slider);
                        l.length ? (i = l.first(),
                        o = i.attr("data-lazy"),
                        s = i.attr("data-srcset"),
                        n = i.attr("data-sizes") || r.$slider.attr("data-sizes"),
                        (a = document.createElement("img")).onload = function() {
                            s && (i.attr("srcset", s),
                            n && i.attr("sizes", n)),
                            i.attr("src", o).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"),
                            !0 === r.options.adaptiveHeight && r.setPosition(),
                            r.$slider.trigger("lazyLoaded", [r, i, o]),
                            r.progressiveLazyLoad()
                        }
                        ,
                        a.onerror = function() {
                            t < 3 ? setTimeout((function() {
                                r.progressiveLazyLoad(t + 1)
                            }
                            ), 500) : (i.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),
                            r.$slider.trigger("lazyLoadError", [r, i, o]),
                            r.progressiveLazyLoad())
                        }
                        ,
                        a.src = o) : r.$slider.trigger("allImagesLoaded", [r])
                    }
                    ,
                    t.prototype.refresh = function(t) {
                        var i, o, s = this;
                        o = s.slideCount - s.options.slidesToShow,
                        !s.options.infinite && s.currentSlide > o && (s.currentSlide = o),
                        s.slideCount <= s.options.slidesToShow && (s.currentSlide = 0),
                        i = s.currentSlide,
                        s.destroy(!0),
                        e.extend(s, s.initials, {
                            currentSlide: i
                        }),
                        s.init(),
                        t || s.changeSlide({
                            data: {
                                message: "index",
                                index: i
                            }
                        }, !1)
                    }
                    ,
                    t.prototype.registerBreakpoints = function() {
                        var t, i, o, s = this, n = s.options.responsive || null;
                        if ("array" === e.type(n) && n.length) {
                            for (t in s.respondTo = s.options.respondTo || "window",
                            n)
                                if (o = s.breakpoints.length - 1,
                                n.hasOwnProperty(t)) {
                                    for (i = n[t].breakpoint; o >= 0; )
                                        s.breakpoints[o] && s.breakpoints[o] === i && s.breakpoints.splice(o, 1),
                                        o--;
                                    s.breakpoints.push(i),
                                    s.breakpointSettings[i] = n[t].settings
                                }
                            s.breakpoints.sort((function(e, t) {
                                return s.options.mobileFirst ? e - t : t - e
                            }
                            ))
                        }
                    }
                    ,
                    t.prototype.reinit = function() {
                        var t = this;
                        t.$slides = t.$slideTrack.children(t.options.slide).addClass("slick-slide"),
                        t.slideCount = t.$slides.length,
                        t.currentSlide >= t.slideCount && 0 !== t.currentSlide && (t.currentSlide = t.currentSlide - t.options.slidesToScroll),
                        t.slideCount <= t.options.slidesToShow && (t.currentSlide = 0),
                        t.registerBreakpoints(),
                        t.setProps(),
                        t.setupInfinite(),
                        t.buildArrows(),
                        t.updateArrows(),
                        t.initArrowEvents(),
                        t.buildDots(),
                        t.updateDots(),
                        t.initDotEvents(),
                        t.cleanUpSlideEvents(),
                        t.initSlideEvents(),
                        t.checkResponsive(!1, !0),
                        !0 === t.options.focusOnSelect && e(t.$slideTrack).children().on("click.slick", t.selectHandler),
                        t.setSlideClasses("number" == typeof t.currentSlide ? t.currentSlide : 0),
                        t.setPosition(),
                        t.focusHandler(),
                        t.paused = !t.options.autoplay,
                        t.autoPlay(),
                        t.$slider.trigger("reInit", [t])
                    }
                    ,
                    t.prototype.resize = function() {
                        var t = this;
                        e(window).width() !== t.windowWidth && (clearTimeout(t.windowDelay),
                        t.windowDelay = window.setTimeout((function() {
                            t.windowWidth = e(window).width(),
                            t.checkResponsive(),
                            t.unslicked || t.setPosition()
                        }
                        ), 50))
                    }
                    ,
                    t.prototype.removeSlide = t.prototype.slickRemove = function(e, t, i) {
                        var o = this;
                        if (e = "boolean" == typeof e ? !0 === (t = e) ? 0 : o.slideCount - 1 : !0 === t ? --e : e,
                        o.slideCount < 1 || e < 0 || e > o.slideCount - 1)
                            return !1;
                        o.unload(),
                        !0 === i ? o.$slideTrack.children().remove() : o.$slideTrack.children(this.options.slide).eq(e).remove(),
                        o.$slides = o.$slideTrack.children(this.options.slide),
                        o.$slideTrack.children(this.options.slide).detach(),
                        o.$slideTrack.append(o.$slides),
                        o.$slidesCache = o.$slides,
                        o.reinit()
                    }
                    ,
                    t.prototype.setCSS = function(e) {
                        var t, i, o = this, s = {};
                        !0 === o.options.rtl && (e = -e),
                        t = "left" == o.positionProp ? Math.ceil(e) + "px" : "0px",
                        i = "top" == o.positionProp ? Math.ceil(e) + "px" : "0px",
                        s[o.positionProp] = e,
                        !1 === o.transformsEnabled ? o.$slideTrack.css(s) : (s = {},
                        !1 === o.cssTransitions ? (s[o.animType] = "translate(" + t + ", " + i + ")",
                        o.$slideTrack.css(s)) : (s[o.animType] = "translate3d(" + t + ", " + i + ", 0px)",
                        o.$slideTrack.css(s)))
                    }
                    ,
                    t.prototype.setDimensions = function() {
                        var e = this;
                        !1 === e.options.vertical ? !0 === e.options.centerMode && e.$list.css({
                            padding: "0px " + e.options.centerPadding
                        }) : (e.$list.height(e.$slides.first().outerHeight(!0) * e.options.slidesToShow),
                        !0 === e.options.centerMode && e.$list.css({
                            padding: e.options.centerPadding + " 0px"
                        })),
                        e.listWidth = e.$list.width(),
                        e.listHeight = e.$list.height(),
                        !1 === e.options.vertical && !1 === e.options.variableWidth ? (e.slideWidth = Math.ceil(e.listWidth / e.options.slidesToShow),
                        e.$slideTrack.width(Math.ceil(e.slideWidth * e.$slideTrack.children(".slick-slide").length))) : !0 === e.options.variableWidth ? e.$slideTrack.width(5e3 * e.slideCount) : (e.slideWidth = Math.ceil(e.listWidth),
                        e.$slideTrack.height(Math.ceil(e.$slides.first().outerHeight(!0) * e.$slideTrack.children(".slick-slide").length)));
                        var t = e.$slides.first().outerWidth(!0) - e.$slides.first().width();
                        !1 === e.options.variableWidth && e.$slideTrack.children(".slick-slide").width(e.slideWidth - t)
                    }
                    ,
                    t.prototype.setFade = function() {
                        var t, i = this;
                        i.$slides.each((function(o, s) {
                            t = i.slideWidth * o * -1,
                            !0 === i.options.rtl ? e(s).css({
                                position: "relative",
                                right: t,
                                top: 0,
                                zIndex: i.options.zIndex - 2,
                                opacity: 0
                            }) : e(s).css({
                                position: "relative",
                                left: t,
                                top: 0,
                                zIndex: i.options.zIndex - 2,
                                opacity: 0
                            })
                        }
                        )),
                        i.$slides.eq(i.currentSlide).css({
                            zIndex: i.options.zIndex - 1,
                            opacity: 1
                        })
                    }
                    ,
                    t.prototype.setHeight = function() {
                        var e = this;
                        if (1 === e.options.slidesToShow && !0 === e.options.adaptiveHeight && !1 === e.options.vertical) {
                            var t = e.$slides.eq(e.currentSlide).outerHeight(!0);
                            e.$list.css("height", t)
                        }
                    }
                    ,
                    t.prototype.setOption = t.prototype.slickSetOption = function() {
                        var t, i, o, s, n, a = this, r = !1;
                        if ("object" === e.type(arguments[0]) ? (o = arguments[0],
                        r = arguments[1],
                        n = "multiple") : "string" === e.type(arguments[0]) && (o = arguments[0],
                        s = arguments[1],
                        r = arguments[2],
                        "responsive" === arguments[0] && "array" === e.type(arguments[1]) ? n = "responsive" : void 0 !== arguments[1] && (n = "single")),
                        "single" === n)
                            a.options[o] = s;
                        else if ("multiple" === n)
                            e.each(o, (function(e, t) {
                                a.options[e] = t
                            }
                            ));
                        else if ("responsive" === n)
                            for (i in s)
                                if ("array" !== e.type(a.options.responsive))
                                    a.options.responsive = [s[i]];
                                else {
                                    for (t = a.options.responsive.length - 1; t >= 0; )
                                        a.options.responsive[t].breakpoint === s[i].breakpoint && a.options.responsive.splice(t, 1),
                                        t--;
                                    a.options.responsive.push(s[i])
                                }
                        r && (a.unload(),
                        a.reinit())
                    }
                    ,
                    t.prototype.setPosition = function() {
                        var e = this;
                        e.setDimensions(),
                        e.setHeight(),
                        !1 === e.options.fade ? e.setCSS(e.getLeft(e.currentSlide)) : e.setFade(),
                        e.$slider.trigger("setPosition", [e])
                    }
                    ,
                    t.prototype.setProps = function() {
                        var e = this
                          , t = document.body.style;
                        e.positionProp = !0 === e.options.vertical ? "top" : "left",
                        "top" === e.positionProp ? e.$slider.addClass("slick-vertical") : e.$slider.removeClass("slick-vertical"),
                        void 0 === t.WebkitTransition && void 0 === t.MozTransition && void 0 === t.msTransition || !0 === e.options.useCSS && (e.cssTransitions = !0),
                        e.options.fade && ("number" == typeof e.options.zIndex ? e.options.zIndex < 3 && (e.options.zIndex = 3) : e.options.zIndex = e.defaults.zIndex),
                        void 0 !== t.OTransform && (e.animType = "OTransform",
                        e.transformType = "-o-transform",
                        e.transitionType = "OTransition",
                        void 0 === t.perspectiveProperty && void 0 === t.webkitPerspective && (e.animType = !1)),
                        void 0 !== t.MozTransform && (e.animType = "MozTransform",
                        e.transformType = "-moz-transform",
                        e.transitionType = "MozTransition",
                        void 0 === t.perspectiveProperty && void 0 === t.MozPerspective && (e.animType = !1)),
                        void 0 !== t.webkitTransform && (e.animType = "webkitTransform",
                        e.transformType = "-webkit-transform",
                        e.transitionType = "webkitTransition",
                        void 0 === t.perspectiveProperty && void 0 === t.webkitPerspective && (e.animType = !1)),
                        void 0 !== t.msTransform && (e.animType = "msTransform",
                        e.transformType = "-ms-transform",
                        e.transitionType = "msTransition",
                        void 0 === t.msTransform && (e.animType = !1)),
                        void 0 !== t.transform && !1 !== e.animType && (e.animType = "transform",
                        e.transformType = "transform",
                        e.transitionType = "transition"),
                        e.transformsEnabled = e.options.useTransform && null !== e.animType && !1 !== e.animType
                    }
                    ,
                    t.prototype.setSlideClasses = function(e) {
                        var t, i, o, s, n = this;
                        if (i = n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true"),
                        n.$slides.eq(e).addClass("slick-current"),
                        !0 === n.options.centerMode) {
                            var a = n.options.slidesToShow % 2 == 0 ? 1 : 0;
                            t = Math.floor(n.options.slidesToShow / 2),
                            !0 === n.options.infinite && (e >= t && e <= n.slideCount - 1 - t ? n.$slides.slice(e - t + a, e + t + 1).addClass("slick-active").attr("aria-hidden", "false") : (o = n.options.slidesToShow + e,
                            i.slice(o - t + 1 + a, o + t + 2).addClass("slick-active").attr("aria-hidden", "false")),
                            0 === e ? i.eq(i.length - 1 - n.options.slidesToShow).addClass("slick-center") : e === n.slideCount - 1 && i.eq(n.options.slidesToShow).addClass("slick-center")),
                            n.$slides.eq(e).addClass("slick-center")
                        } else
                            e >= 0 && e <= n.slideCount - n.options.slidesToShow ? n.$slides.slice(e, e + n.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : i.length <= n.options.slidesToShow ? i.addClass("slick-active").attr("aria-hidden", "false") : (s = n.slideCount % n.options.slidesToShow,
                            o = !0 === n.options.infinite ? n.options.slidesToShow + e : e,
                            n.options.slidesToShow == n.options.slidesToScroll && n.slideCount - e < n.options.slidesToShow ? i.slice(o - (n.options.slidesToShow - s), o + s).addClass("slick-active").attr("aria-hidden", "false") : i.slice(o, o + n.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false"));
                        "ondemand" !== n.options.lazyLoad && "anticipated" !== n.options.lazyLoad || n.lazyLoad()
                    }
                    ,
                    t.prototype.setupInfinite = function() {
                        var t, i, o, s = this;
                        if (!0 === s.options.fade && (s.options.centerMode = !1),
                        !0 === s.options.infinite && !1 === s.options.fade && (i = null,
                        s.slideCount > s.options.slidesToShow)) {
                            for (o = !0 === s.options.centerMode ? s.options.slidesToShow + 1 : s.options.slidesToShow,
                            t = s.slideCount; t > s.slideCount - o; t -= 1)
                                i = t - 1,
                                e(s.$slides[i]).clone(!0).attr("id", "").attr("data-slick-index", i - s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");
                            for (t = 0; t < o + s.slideCount; t += 1)
                                i = t,
                                e(s.$slides[i]).clone(!0).attr("id", "").attr("data-slick-index", i + s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");
                            s.$slideTrack.find(".slick-cloned").find("[id]").each((function() {
                                e(this).attr("id", "")
                            }
                            ))
                        }
                    }
                    ,
                    t.prototype.interrupt = function(e) {
                        var t = this;
                        e || t.autoPlay(),
                        t.interrupted = e
                    }
                    ,
                    t.prototype.selectHandler = function(t) {
                        var i = this
                          , o = e(t.target).is(".slick-slide") ? e(t.target) : e(t.target).parents(".slick-slide")
                          , s = parseInt(o.attr("data-slick-index"));
                        s || (s = 0),
                        i.slideCount <= i.options.slidesToShow ? i.slideHandler(s, !1, !0) : i.slideHandler(s)
                    }
                    ,
                    t.prototype.slideHandler = function(e, t, i) {
                        var o, s, n, a, r, l = null, d = this;
                        if (t = t || !1,
                        !(!0 === d.animating && !0 === d.options.waitForAnimate || !0 === d.options.fade && d.currentSlide === e))
                            if (!1 === t && d.asNavFor(e),
                            o = e,
                            l = d.getLeft(o),
                            a = d.getLeft(d.currentSlide),
                            d.currentLeft = null === d.swipeLeft ? a : d.swipeLeft,
                            !1 === d.options.infinite && !1 === d.options.centerMode && (e < 0 || e > d.getDotCount() * d.options.slidesToScroll))
                                !1 === d.options.fade && (o = d.currentSlide,
                                !0 !== i ? d.animateSlide(a, (function() {
                                    d.postSlide(o)
                                }
                                )) : d.postSlide(o));
                            else if (!1 === d.options.infinite && !0 === d.options.centerMode && (e < 0 || e > d.slideCount - d.options.slidesToScroll))
                                !1 === d.options.fade && (o = d.currentSlide,
                                !0 !== i ? d.animateSlide(a, (function() {
                                    d.postSlide(o)
                                }
                                )) : d.postSlide(o));
                            else {
                                if (d.options.autoplay && clearInterval(d.autoPlayTimer),
                                s = o < 0 ? d.slideCount % d.options.slidesToScroll != 0 ? d.slideCount - d.slideCount % d.options.slidesToScroll : d.slideCount + o : o >= d.slideCount ? d.slideCount % d.options.slidesToScroll != 0 ? 0 : o - d.slideCount : o,
                                d.animating = !0,
                                d.$slider.trigger("beforeChange", [d, d.currentSlide, s]),
                                n = d.currentSlide,
                                d.currentSlide = s,
                                d.setSlideClasses(d.currentSlide),
                                d.options.asNavFor && (r = (r = d.getNavTarget()).slick("getSlick")).slideCount <= r.options.slidesToShow && r.setSlideClasses(d.currentSlide),
                                d.updateDots(),
                                d.updateArrows(),
                                !0 === d.options.fade)
                                    return !0 !== i ? (d.fadeSlideOut(n),
                                    d.fadeSlide(s, (function() {
                                        d.postSlide(s)
                                    }
                                    ))) : d.postSlide(s),
                                    void d.animateHeight();
                                !0 !== i ? d.animateSlide(l, (function() {
                                    d.postSlide(s)
                                }
                                )) : d.postSlide(s)
                            }
                    }
                    ,
                    t.prototype.startLoad = function() {
                        var e = this;
                        !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow.hide(),
                        e.$nextArrow.hide()),
                        !0 === e.options.dots && e.slideCount > e.options.slidesToShow && e.$dots.hide(),
                        e.$slider.addClass("slick-loading")
                    }
                    ,
                    t.prototype.swipeDirection = function() {
                        var e, t, i, o, s = this;
                        return e = s.touchObject.startX - s.touchObject.curX,
                        t = s.touchObject.startY - s.touchObject.curY,
                        i = Math.atan2(t, e),
                        (o = Math.round(180 * i / Math.PI)) < 0 && (o = 360 - Math.abs(o)),
                        o <= 45 && o >= 0 || o <= 360 && o >= 315 ? !1 === s.options.rtl ? "left" : "right" : o >= 135 && o <= 225 ? !1 === s.options.rtl ? "right" : "left" : !0 === s.options.verticalSwiping ? o >= 35 && o <= 135 ? "down" : "up" : "vertical"
                    }
                    ,
                    t.prototype.swipeEnd = function(e) {
                        var t, i, o = this;
                        if (o.dragging = !1,
                        o.swiping = !1,
                        o.scrolling)
                            return o.scrolling = !1,
                            !1;
                        if (o.interrupted = !1,
                        o.shouldClick = !(o.touchObject.swipeLength > 10),
                        void 0 === o.touchObject.curX)
                            return !1;
                        if (!0 === o.touchObject.edgeHit && o.$slider.trigger("edge", [o, o.swipeDirection()]),
                        o.touchObject.swipeLength >= o.touchObject.minSwipe) {
                            switch (i = o.swipeDirection()) {
                            case "left":
                            case "down":
                                t = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide + o.getSlideCount()) : o.currentSlide + o.getSlideCount(),
                                o.currentDirection = 0;
                                break;
                            case "right":
                            case "up":
                                t = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide - o.getSlideCount()) : o.currentSlide - o.getSlideCount(),
                                o.currentDirection = 1
                            }
                            "vertical" != i && (o.slideHandler(t),
                            o.touchObject = {},
                            o.$slider.trigger("swipe", [o, i]))
                        } else
                            o.touchObject.startX !== o.touchObject.curX && (o.slideHandler(o.currentSlide),
                            o.touchObject = {})
                    }
                    ,
                    t.prototype.swipeHandler = function(e) {
                        var t = this;
                        if (!(!1 === t.options.swipe || "ontouchend"in document && !1 === t.options.swipe || !1 === t.options.draggable && -1 !== e.type.indexOf("mouse")))
                            switch (t.touchObject.fingerCount = e.originalEvent && void 0 !== e.originalEvent.touches ? e.originalEvent.touches.length : 1,
                            t.touchObject.minSwipe = t.listWidth / t.options.touchThreshold,
                            !0 === t.options.verticalSwiping && (t.touchObject.minSwipe = t.listHeight / t.options.touchThreshold),
                            e.data.action) {
                            case "start":
                                t.swipeStart(e);
                                break;
                            case "move":
                                t.swipeMove(e);
                                break;
                            case "end":
                                t.swipeEnd(e)
                            }
                    }
                    ,
                    t.prototype.swipeMove = function(e) {
                        var t, i, o, s, n, a, r = this;
                        return n = void 0 !== e.originalEvent ? e.originalEvent.touches : null,
                        !(!r.dragging || r.scrolling || n && 1 !== n.length) && (t = r.getLeft(r.currentSlide),
                        r.touchObject.curX = void 0 !== n ? n[0].pageX : e.clientX,
                        r.touchObject.curY = void 0 !== n ? n[0].pageY : e.clientY,
                        r.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(r.touchObject.curX - r.touchObject.startX, 2))),
                        a = Math.round(Math.sqrt(Math.pow(r.touchObject.curY - r.touchObject.startY, 2))),
                        !r.options.verticalSwiping && !r.swiping && a > 4 ? (r.scrolling = !0,
                        !1) : (!0 === r.options.verticalSwiping && (r.touchObject.swipeLength = a),
                        i = r.swipeDirection(),
                        void 0 !== e.originalEvent && r.touchObject.swipeLength > 4 && (r.swiping = !0,
                        e.preventDefault()),
                        s = (!1 === r.options.rtl ? 1 : -1) * (r.touchObject.curX > r.touchObject.startX ? 1 : -1),
                        !0 === r.options.verticalSwiping && (s = r.touchObject.curY > r.touchObject.startY ? 1 : -1),
                        o = r.touchObject.swipeLength,
                        r.touchObject.edgeHit = !1,
                        !1 === r.options.infinite && (0 === r.currentSlide && "right" === i || r.currentSlide >= r.getDotCount() && "left" === i) && (o = r.touchObject.swipeLength * r.options.edgeFriction,
                        r.touchObject.edgeHit = !0),
                        !1 === r.options.vertical ? r.swipeLeft = t + o * s : r.swipeLeft = t + o * (r.$list.height() / r.listWidth) * s,
                        !0 === r.options.verticalSwiping && (r.swipeLeft = t + o * s),
                        !0 !== r.options.fade && !1 !== r.options.touchMove && (!0 === r.animating ? (r.swipeLeft = null,
                        !1) : void r.setCSS(r.swipeLeft))))
                    }
                    ,
                    t.prototype.swipeStart = function(e) {
                        var t, i = this;
                        if (i.interrupted = !0,
                        1 !== i.touchObject.fingerCount || i.slideCount <= i.options.slidesToShow)
                            return i.touchObject = {},
                            !1;
                        void 0 !== e.originalEvent && void 0 !== e.originalEvent.touches && (t = e.originalEvent.touches[0]),
                        i.touchObject.startX = i.touchObject.curX = void 0 !== t ? t.pageX : e.clientX,
                        i.touchObject.startY = i.touchObject.curY = void 0 !== t ? t.pageY : e.clientY,
                        i.dragging = !0
                    }
                    ,
                    t.prototype.unfilterSlides = t.prototype.slickUnfilter = function() {
                        var e = this;
                        null !== e.$slidesCache && (e.unload(),
                        e.$slideTrack.children(this.options.slide).detach(),
                        e.$slidesCache.appendTo(e.$slideTrack),
                        e.reinit())
                    }
                    ,
                    t.prototype.unload = function() {
                        var t = this;
                        e(".slick-cloned", t.$slider).remove(),
                        t.$dots && t.$dots.remove(),
                        t.$prevArrow && t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.remove(),
                        t.$nextArrow && t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.remove(),
                        t.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "")
                    }
                    ,
                    t.prototype.unslick = function(e) {
                        var t = this;
                        t.$slider.trigger("unslick", [t, e]),
                        t.destroy()
                    }
                    ,
                    t.prototype.updateArrows = function() {
                        var e = this;
                        Math.floor(e.options.slidesToShow / 2),
                        !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && !e.options.infinite && (e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"),
                        e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"),
                        0 === e.currentSlide ? (e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"),
                        e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : (e.currentSlide >= e.slideCount - e.options.slidesToShow && !1 === e.options.centerMode || e.currentSlide >= e.slideCount - 1 && !0 === e.options.centerMode) && (e.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"),
                        e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")))
                    }
                    ,
                    t.prototype.updateDots = function() {
                        var e = this;
                        null !== e.$dots && (e.$dots.find("li").removeClass("slick-active").end(),
                        e.$dots.find("li").eq(Math.floor(e.currentSlide / e.options.slidesToScroll)).addClass("slick-active"))
                    }
                    ,
                    t.prototype.visibility = function() {
                        var e = this;
                        e.options.autoplay && (document[e.hidden] ? e.interrupted = !0 : e.interrupted = !1)
                    }
                    ,
                    e.fn.slick = function() {
                        var e, i, o = this, s = arguments[0], n = Array.prototype.slice.call(arguments, 1), a = o.length;
                        for (e = 0; e < a; e++)
                            if ("object" == typeof s || void 0 === s ? o[e].slick = new t(o[e],s) : i = o[e].slick[s].apply(o[e].slick, n),
                            void 0 !== i)
                                return i;
                        return o
                    }
                }
                ,
                void 0 === (n = "function" == typeof o ? o.apply(t, s) : o) || (e.exports = n)
            }()
        }
        ,
        6150: (e, t, i) => {
            function o() {
                if (!document.getElementById("search_top_buffer")) {
                    var e = $("#global_search").find("select, input, button, a");
                    search_top_trap = e[1],
                    search_bottom_trap = e[e.length - 1];
                    $("#global_search").prepend('<div id="search_top_buffer" tabindex="0"></div>'),
                    $("#global_search").append('<div id="search_bottom_buffer" tabindex="0"></div>');
                    $("#search_top_buffer").focus((function() {
                        a(),
                        s(!0)
                    }
                    )),
                    $("#search_bottom_buffer").focus((function() {
                        a(),
                        s(!0)
                    }
                    ))
                }
                $(".uni_search_toggle").attr("aria-expanded", "true"),
                $("#global_search").addClass("active"),
                $("#global_search").slideDown(400, (function() {
                    search_top_trap.focus()
                }
                )),
                $("#global_search").keyup((function(e) {
                    27 == e.which && (a(),
                    s(!0))
                }
                )),
                $("#section_nav").hasClass("active") && hideSectionNav(!1)
            }
            function s(e) {
                $(".uni_search_toggle").attr("aria-expanded", "false"),
                $("#global_search").removeClass("active"),
                $("#global_search").slideUp(400, (function() {
                    e && $(".uni_search_toggle").focus()
                }
                ))
            }
            function n() {
                $("#modal_fade").addClass("active"),
                $("#modal_fade").click((function() {
                    a()
                }
                ))
            }
            function a() {
                $("#modal_fade").removeClass("active"),
                $("#modal_fade").off("click"),
                $("#section-nav").hasClass("active") && hideSectionNav(),
                $("#global_search").hasClass("active") && s()
            }
            i(2703),
            $(document).ready((function() {
                var e = $(".uni_menu>ul>li");
                if ("ontouchstart"in document.documentElement)
                    $(".uni_menu_close").click((function() {
                        return $(".uni_menu>ul>li.hover").removeClass("hover"),
                        !1
                    }
                    )),
                    e.each((function() {
                        var t = $(this);
                        this.addEventListener("touchstart", (function(i) {
                            1 !== i.touches.length || $("body").hasClass("global-nav-open") || (i.stopPropagation(),
                            t.hasClass("hover") || (i.target !== this && i.target.parentNode !== this || i.preventDefault(),
                            e.removeClass("hover"),
                            t.addClass("hover"),
                            document.addEventListener("touchstart", closeDropdown = function(e) {
                                function t(t) {
                                    return e.apply(this, arguments)
                                }
                                return t.toString = function() {
                                    return e.toString()
                                }
                                ,
                                t
                            }((function(e) {
                                e.stopPropagation(),
                                t.removeClass("hover"),
                                document.removeEventListener("touchstart", closeDropdown)
                            }
                            )))))
                        }
                        ), !1)
                    }
                    ));
                else {
                    $(".uni_menu_close a").css("display", "none");
                    var t = $(".uni_menu > ul > li > a.uni_menu_section_link");
                    t.each((function(i, o) {
                        var s = $(this);
                        this.addEventListener("focus", (function() {
                            e.removeClass("hover"),
                            s.parent().addClass("hover")
                        }
                        )),
                        this.addEventListener("keydown", (function(o) {
                            "ArrowRight" === o.key && (t[i + 1] ? (e.removeClass("hover"),
                            t[i + 1].focus()) : (e.removeClass("hover"),
                            $("#uni_search_toggle").focus())),
                            "ArrowLeft" === o.key && t[i - 1] && (e.removeClass("hover"),
                            t[i - 1].focus()),
                            o.shiftKey && "Tab" === o.key && s.parent().removeClass("hover")
                        }
                        ))
                    }
                    )),
                    $("#uni_search_toggle").on("focus", (function() {
                        e.removeClass("hover")
                    }
                    )),
                    $("#uni_menu > ul > li > a").each((function() {
                        var e = $(this).html().toLowerCase().replace(/(\&amp;)/g, "").replace(/\s/g, "");
                        $(this).parent().find("a").addClass("uni_menu_" + e)
                    }
                    ))
                }
                $(".uni_menu").hoverIntent({
                    over: function() {
                        $(this).addClass("hover")
                    },
                    out: function() {
                        $(this).removeClass("hover")
                    },
                    timeout: 400,
                    selector: "ul li"
                }),
                $(".uni_search_toggle").attr("aria-controls", "global_search"),
                $(".uni_search_toggle").attr("aria-expanded", "false");
                $(".uni_search_toggle").click((function(e) {
                    e.preventDefault(),
                    search_expanded = $(".uni_search_toggle").attr("aria-expanded"),
                    search_expanded = "false" == search_expanded ? "true" : "false",
                    "true" == search_expanded ? (n(),
                    o()) : (s(!0),
                    a())
                }
                ));
                var i = []
                  , r = null;
                $global_nav = $(".uni_menu"),
                $global_nav_button = $('[aria-controls="uni_menu"]'),
                i.push($global_nav.attr("id")),
                $global_nav.find("> ul > li").each((function() {
                    null != $(this).attr("id") && i.push($(this).attr("id"))
                }
                )),
                $global_nav_internal_buttons = $global_nav.find('a[href^="#"]').filter((function(e, t) {
                    return i.includes($(t).attr("href").replace("#", ""))
                }
                )),
                $global_nav_button.on("click", (function(e) {
                    e.preventDefault(),
                    hideSectionNav(),
                    a(),
                    $("body").addClass("global-nav-open"),
                    $global_nav.addClass("animating animation-slide-in-right"),
                    $global_nav.on("animationend", (function() {
                        document.location.replace($global_nav_button.attr("href")),
                        $global_nav.removeClass("animating animation-slide-in-right"),
                        $global_nav.off("animationend")
                    }
                    ))
                }
                )),
                $global_nav.find(".close_button").on("click", (function(e) {
                    e.preventDefault(),
                    $target = $(document.location.hash),
                    $target.addClass("animating animation-slide-out-right"),
                    $target.on("animationend", (function() {
                        document.location.replace("#"),
                        $target.removeClass("animating animation-slide-out-right"),
                        $target.off("animationend")
                    }
                    ))
                }
                )),
                $global_nav_internal_buttons.on("click", (function(e) {
                    e.preventDefault(),
                    $target = $(e.currentTarget),
                    href = $target.attr("href"),
                    oldHash = document.location.hash,
                    document.location.replace("#"),
                    $("body").addClass("global-nav-open"),
                    $clone = $("#uni_menu").clone().attr("id", "uni_menu_clone"),
                    $clone.find("[id]").each((function(e, t) {
                        $(t).attr("id", $(t).attr("id") + "_clone")
                    }
                    )),
                    $cloneContainer = $('<div aria-hidden="true"></div>').insertAfter("#uni_menu"),
                    $cloneContainer.append($clone),
                    "#uni_menu" == href ? ($(href).addClass("animating animation-slide-in-left"),
                    $cloneContainer.find(oldHash + "_clone").addClass("animating animation-slide-out-right")) : ($(href).addClass("animating animation-slide-in-right"),
                    $cloneContainer.find(oldHash + "_clone").addClass("animating animation-slide-out-left")),
                    $(href).on("animationend", (function() {
                        $(href).removeClass("animating animation-slide-in-right animation-slide-in-left"),
                        $cloneContainer.remove(),
                        $(href).off("animationend")
                    }
                    )),
                    document.location.replace(href)
                }
                )),
                $(window).on("hashchange", (function() {
                    hash = document.location.hash.replace("#", ""),
                    $(".uni_menu_focus_trap").remove(),
                    i.includes(hash) ? (hideSectionNav(),
                    a(),
                    $("#ccc").css("z-index", 0),
                    $global_nav_button.attr("aria-expanded", !0),
                    $("body").addClass("global-nav-open"),
                    $target = $("#" + hash),
                    $focusable_elements = $target.find('button, [href], input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])'),
                    $focusable_elements = $focusable_elements.filter((function() {
                        return $(this).is(":visible")
                    }
                    )),
                    $first_focusable_element = $focusable_elements.first(),
                    $last_focusable_element = $focusable_elements.last(),
                    $target.append('<div class="uni_menu_focus_trap bottom_focus_trap" tabindex="0"></div>'),
                    $target.prepend('<div class="uni_menu_focus_trap top_focus_trap" tabindex="0"></div>'),
                    $focusable_elements = $focusable_elements.filter((function() {
                        return 0 == $(this).closest(".uni_menu_action_bar").length
                    }
                    )),
                    hash == $global_nav.attr("id") ? r && $global_nav.find('.forward_button[href="#' + r + '"]') ? $global_nav.find('.forward_button[href="#' + r + '"]').focus() : $(".uni_menu_overview .uni_menu_action_bar .close_button").focus() : $target.find(".uni_menu_action_bar .back_button").focus(),
                    $(".uni_menu_focus_trap.top_focus_trap").on("focus", (function() {
                        $last_focusable_element.focus()
                    }
                    )),
                    $(".uni_menu_focus_trap.bottom_focus_trap").on("focus", (function() {
                        $first_focusable_element.focus()
                    }
                    )),
                    r = hash) : $("body").hasClass("global-nav-open") && ($global_nav_button.focus().attr("aria-expanded", !1),
                    $("body").removeClass("global-nav-open"),
                    $("#ccc").css("z-index", 2147483647),
                    r = null)
                }
                ))
            }
            )),
            window.showModalOverlay = n,
            window.hideModalOverlay = a
        }
        ,
        6182: () => {
            $(document).ready((function() {
                $(".feature_box .feature_image img, .feature_box .feature_content h2, .feature_box .feature_more a").hover((function() {
                    if ($(this).parents(".feature_box").find(".feature_more a").length > 0) {
                        var e = $(this).parents(".feature_box")
                          , t = e.find(".feature_image")
                          , i = e.find(".feature_image img")
                          , o = e.find(".feature_content h2")
                          , s = e.find(".feature_more a")
                          , n = e.find(".feature_more a").attr("href");
                        e.find(".feature_more a").html();
                        s.addClass("hover"),
                        t.addClass("zoomed"),
                        i.add(o).css("cursor", "pointer"),
                        i.add(o).click((function() {
                            document.location = n
                        }
                        ))
                    }
                }
                ), (function() {
                    $(this).parents(".feature_box").find(".feature_image").removeClass("zoomed"),
                    $(this).parents(".feature_box").find(".feature_more a").removeClass("hover")
                }
                ))
            }
            ))
        }
        ,
        7682: () => {
            $(document).ready((function() {
                var e = /((https?|ftp|rtmp):\/\/)(www\.)?([-a-z0-9_]+\.)+([a-z]){2,63}/i;
                $("main").find("a").each((function() {
                    e.test($(this).text()) && $(this).addClass("wrap_url")
                }
                )),
                $("main").find('a[target="_blank"]').each((function() {
                    $(this).attr("rel", "noopener noreferrer")
                }
                ))
            }
            ))
        }
        ,
        7882: () => {
            !function(e) {
                e.fn.getDimensions = function(t, i) {
                    var o = e(this)
                      , s = o.parents(":hidden");
                    if (s.css({
                        display: "block"
                    }),
                    i) {
                        var n = o.css("maxHeight");
                        o.css({
                            display: i
                        }),
                        o.css({
                            maxHeight: "none"
                        }),
                        o.css({
                            visibility: "hidden"
                        }),
                        "none" !== n && n > 0 && o.css({
                            maxHeight: n
                        })
                    }
                    var a = {
                        width: t ? o.outerWidth() : o.innerWidth(),
                        height: t ? o.outerHeight() : o.innerHeight(),
                        offsetTop: o.offset().top,
                        offsetLeft: o.offset().left
                    };
                    return o.css({
                        display: ""
                    }),
                    o.css({
                        maxHeight: ""
                    }),
                    o.css({
                        visibility: ""
                    }),
                    s.css({
                        display: ""
                    }),
                    a
                }
                ,
                e.fn.focusWithoutScrolling = function() {
                    var t = e(document).scrollLeft()
                      , i = e(document).scrollTop();
                    return this.focus(),
                    window.scrollTo(t, i),
                    this
                }
                ,
                debounce = function(e, t, i) {
                    var o;
                    return function() {
                        var s = this
                          , n = arguments
                          , a = i && !o;
                        clearTimeout(o),
                        o = setTimeout((function() {
                            o = null,
                            i || e.apply(s, n)
                        }
                        ), t || 200),
                        a && e.apply(s, n)
                    }
                }
                ,
                e.fn.tabcordion = function() {
                    return this.each((function() {
                        this.$tabcordion = e(this),
                        this.config = {},
                        this.config.total_tabs_width = 0,
                        this.settings = {
                            forceAccordion: !1,
                            urlFragments: !1,
                            openFirstPanel: !1,
                            forceAccordionUntil: !1,
                            openTab: !1,
                            disableOpenTabAutoScroll: !1
                        },
                        this.mode = "accordion",
                        this.tabnav = e('<ul class="tabcordion_nav"></ul>'),
                        this.tabnav.attr("role", "tablist"),
                        this.$tabcordion.wrap('<div class="tabcordion_wrapper"></div>'),
                        this.$tabcordionWrapper = this.$tabcordion.parent();
                        var t = this;
                        function i() {
                            var e = t.$tabcordion.getDimensions(!0).width;
                            return !!(e < t.config.total_tabs_width || t.settings.forceAccordion || e < t.settings.forceAccordionUntil)
                        }
                        function o() {
                            return !i()
                        }
                        function s(e, s, n) {
                            o() && r(),
                            s = s || !1,
                            n = n || !1,
                            t.$tabcordion.find('> dt > div[role="tablist"] > a').eq(e).attr("aria-selected", "true"),
                            t.$tabcordionWrapper.find("> .tabcordion_nav > li > a").eq(e).attr({
                                "aria-selected": "true",
                                tabindex: 0
                            });
                            var a = t.$tabcordion.find("> dd").eq(e);
                            i() && a.data("height", a.getDimensions(!0, "block").height + 32),
                            n || (a.addClass("tabcordion_animating"),
                            a.outerWidth(),
                            a.css({
                                maxHeight: a.data("height")
                            })),
                            a.attr("aria-hidden", "false"),
                            a.attr("tabindex", "0"),
                            s && a.focusWithoutScrolling()
                        }
                        function n(e) {
                            return t.$tabcordion.find("> dt")
                        }
                        function a(e) {
                            return "true" === t.$tabcordion.find('> dt > div[role="tablist"] > a').eq(e).attr("aria-selected")
                        }
                        function r() {
                            t.$tabcordion.find('> dt a[aria-selected="true"]').attr("aria-selected", "false"),
                            t.$tabcordion.find('> dd[aria-hidden="false"]').attr("aria-hidden", "true"),
                            t.$tabcordion.find('> dd[tabindex="0"]').attr("tabindex", "-1"),
                            t.$tabcordionWrapper.find('> .tabcordion_nav > li a[aria-selected="true"]').attr({
                                "aria-selected": "false",
                                tabindex: -1
                            })
                        }
                        function l() {
                            var n, a, l = l || "tabs", d = t.mode, c = t.$tabcordion.find("> dt a:focus"), p = t.$tabcordionWrapper.find("> .tabcordion_nav > li > a:focus");
                            i() && (l = "accordion"),
                            t.mode = l,
                            n = d != l && d + "_to_" + l,
                            t.$tabcordion.removeClass("tabcordion_mode_tabs tabcordion_mode_accordion").addClass("tabcordion_mode_" + l),
                            t.$tabcordionWrapper.removeClass("tabcordion_mode_tabs tabcordion_mode_accordion").addClass("tabcordion_mode_" + l),
                            $panels = t.$tabcordion.find("> dd"),
                            $panels.each((function(t, i) {
                                e(i).data("height", "")
                            }
                            ));
                            var u = t.$tabcordion.find('> dt > div[role="tablist"] > a[aria-selected="true"]');
                            o() && !u.length && s(0),
                            o() && u.length > 1 && (r(),
                            s(u.first().data("index"))),
                            "accordion_to_tabs" === n && c.length > 0 && (a = c.data("index"),
                            t.$tabcordionWrapper.find("> .tabcordion_nav > li > a").eq(a).focus()),
                            "tabs_to_accordion" === n && p.length > 0 && (a = p.data("index"),
                            t.$tabcordion.find('> dt > div[role="tablist"] > a').eq(a).focus())
                        }
                        function d(i) {
                            if (!t.settings.urlFragments)
                                return !1;
                            var o = e(i.attr("href"))
                              , s = o.attr("id");
                            o.attr("id", o.attr("id") + "hashchange"),
                            a(o.data("index")) ? history.pushState({}, "", i.attr("href")) : history.pushState({}, "", location.href.replace(location.hash, "")),
                            o.attr("id", s)
                        }
                        this.$tabcordion.data("tabcordion") && e.extend(this.settings, this.$tabcordion.data("tabcordion")),
                        t.$tabcordion.find("> dd").on("transitionend", (function(t) {
                            var i = e(t.target);
                            i.is(".tabcordion > dd") && (i.removeClass("tabcordion_animating"),
                            i.css({
                                maxHeight: ""
                            }),
                            t.stopPropagation())
                        }
                        )),
                        t.$tabcordion.find("> dt a").click((function(o) {
                            var n = e(this).data("index");
                            a(n) ? function(e) {
                                t.$tabcordion.find('> dt > div[role="tablist"] > a').eq(e).attr("aria-selected", "false"),
                                t.$tabcordionWrapper.find("> .tabcordion_nav > li a").eq(e).attr({
                                    "aria-selected": "false",
                                    tabindex: -1
                                });
                                var o = t.$tabcordion.find("> dd").eq(e);
                                i() && (o.data("height", o.getDimensions(!0, "block").height + 32),
                                o.css({
                                    maxHeight: o.data("height")
                                }),
                                o.outerWidth(),
                                o.addClass("tabcordion_animating"),
                                o.css({
                                    maxHeight: 0
                                }));
                                var s = i() ? 301 : 1;
                                setTimeout((function() {
                                    o.attr("aria-hidden", "true"),
                                    o.attr("tabindex", "-1")
                                }
                                ), s),
                                setTimeout((function() {
                                    t.$tabcordion.find("> dt").eq(e).find("> a").focus()
                                }
                                ), 1)
                            }(n) : s(n, !0),
                            d(e(this)),
                            o.stopPropagation(),
                            o.preventDefault()
                        }
                        )),
                        t.$tabcordionWrapper.keydown((function(i) {
                            if (-1 !== [37, 39].indexOf(i.which)) {
                                var a = e('a[role="tab"]:focus');
                                if (a.length) {
                                    var r = {
                                        37: -1,
                                        39: 1
                                    }[i.which]
                                      , l = a.data("index");
                                    -1 == (l += r) && (l = n().length - 1),
                                    l == n().length && (l = 0),
                                    o() ? (t.$tabcordionWrapper.find("> .tabcordion_nav > li > a").eq(l).focus(),
                                    s(l)) : t.$tabcordion.find('> dt > div[role="tablist"] > a').eq(l).focus(),
                                    i.preventDefault(),
                                    i.stopPropagation()
                                }
                            }
                        }
                        )),
                        function() {
                            if (t.$tabcordion.addClass("tabcordion_loaded"),
                            t.$tabcordion.find("> dt").each((function(i, o) {
                                var n = e(this)
                                  , a = e('<li role="presentation"></li>')
                                  , l = t.$tabcordion.find("> dd").eq(i)
                                  , c = n.getDimensions(!0).width;
                                n.css({
                                    left: t.config.total_tabs_width
                                }),
                                $a = n.find("a"),
                                $a.data("index", i),
                                $a.attr("role", "tab"),
                                $a.attr("aria-controls", l.attr("id")),
                                $a.attr("aria-selected", "false"),
                                t.config.total_tabs_width += c,
                                l.wrapInner('<div role="tabpanel"></div>'),
                                l.attr("tabindex", "-1"),
                                a.html(n.html()),
                                a.find("a").data("index", i),
                                a.find("a").attr("tabindex", "-1"),
                                a.find("a").click((function(t) {
                                    var i = e(this).data("index");
                                    r(),
                                    s(i),
                                    d(e(this)),
                                    t.stopPropagation(),
                                    t.preventDefault()
                                }
                                )),
                                t.tabnav.append(a),
                                n.wrapInner('<div role="tablist"></div>')
                            }
                            )),
                            t.$tabcordion.before(t.tabnav),
                            t.$tabcordion.find("> dd").each((function(t, i) {
                                var o = e(this);
                                o.data("index", t),
                                o.attr("aria-hidden", "true")
                            }
                            )),
                            t.settings.urlFragments && window.location.hash.length > 0 || t.settings.openTab) {
                                var i = t.settings.openTab ? t.settings.openTab : window.location.hash.replace("#", "")
                                  , n = t.$tabcordion.find("> dd#" + i);
                                if (n.length)
                                    return s(n.data("index"), !1, !0),
                                    void (t.settings.disableOpenTabAutoScroll || e("html, body").animate({
                                        scrollTop: n.parents(".tabcordion_wrapper").first().offset().top
                                    }, 1200));
                                var a = -1;
                                if (t.$tabcordion.find("> dd").each((function() {
                                    if (e(this).find("dd#" + i).length)
                                        return a = e(this).data("index"),
                                        !1
                                }
                                )),
                                -1 != a)
                                    return void s(a, !1, !0)
                            }
                            (o() || t.settings.openFirstPanel) && s(0)
                        }(),
                        e(window).resize(debounce((function() {
                            l()
                        }
                        ), 16)).resize(),
                        "onhashchange"in window && e(window).on("hashchange", (function() {
                            var i = t.$tabcordionWrapper.find('> .tabcordion_nav a[href="' + window.location.hash + '"]');
                            if (i.length) {
                                var n = i.data("index");
                                a(n) || (r(),
                                s(n, !0),
                                o() ? e("html, body").animate({
                                    scrollTop: i.parents(".tabcordion_nav").first().offset().top
                                }, 1200) : e("html, body").animate({
                                    scrollTop: e('.tabcordion [aria-controls="' + i.attr("href").replace("#", "") + '"]').first().offset().top
                                }, 1200))
                            }
                        }
                        ))
                    }
                    ))
                }
                ,
                e(document).ready((function() {
                    e(".tabcordion:not(.tabcordion_loaded)").tabcordion()
                }
                ))
            }(jQuery)
        }
        ,
        7960: () => {
            $(document).ready((function() {
                $("#global_search input").autocompletion({
                    datasets: {
                        organic: {
                            collection: window.abdnDesignSystem.search.collection,
                            profile: "_default_preview",
                            program: window.abdnDesignSystem.search.suggestionURL,
                            dataType: "json"
                        }
                    },
                    length: 2
                }),
                $(".hero_search form input").autocompletion({
                    datasets: {
                        organic: {
                            collection: window.abdnDesignSystem.search.collection,
                            program: window.abdnDesignSystem.search.suggestionURL,
                            dataType: "json"
                        }
                    },
                    length: 2
                })
            }
            ))
        }
    }
      , t = {};
    function o(i) {
        var s = t[i];
        if (void 0 !== s)
            return s.exports;
        var n = t[i] = {
            exports: {}
        };
        return e[i](n, n.exports, o),
        n.exports
    }
    o(3768),
    o(4143),
    o(7682),
    o(6182),
    o(2992),
    o(7960),
    o(4210),
    o(1880),
    o(5306),
    o(7882),
    o(4686),
    o(6150)
}
)();


!function(e) {
    var t = {};
    function r(o) {
        if (t[o])
            return t[o].exports;
        var s = t[o] = {
            i: o,
            l: !1,
            exports: {}
        };
        return e[o].call(s.exports, s, s.exports, r),
        s.l = !0,
        s.exports
    }
    r.m = e,
    r.c = t,
    r.d = function(e, t, o) {
        r.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: o
        })
    }
    ,
    r.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }
    ,
    r.t = function(e, t) {
        if (1 & t && (e = r(e)),
        8 & t)
            return e;
        if (4 & t && "object" == typeof e && e && e.__esModule)
            return e;
        var o = Object.create(null);
        if (r.r(o),
        Object.defineProperty(o, "default", {
            enumerable: !0,
            value: e
        }),
        2 & t && "string" != typeof e)
            for (var s in e)
                r.d(o, s, function(t) {
                    return e[t]
                }
                .bind(null, s));
        return o
    }
    ,
    r.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        }
        : function() {
            return e
        }
        ;
        return r.d(t, "a", t),
        t
    }
    ,
    r.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }
    ,
    r.p = "",
    r(r.s = 2)
}([function(e, t, r) {
    (function(e) {
        function t() {
            return 0 === e("#prospectus_results_container").length
        }
        function r(t, r) {
            var o = e(t.toString())
              , s = o.find("#prospectus_results");
            r = e.parseJSON(r),
            e("#prospectus_q").val() === r && resetSearchTerms(r),
            s.length || (s = o.filter("#prospectus_results")),
            e("#prospectus_results").replaceWith(s),
            e("#prospectus_results_container").removeClass("js_processing")
        }
        function o() {
            var o = e(".prospectus_search").serialize()
              , s = e(".prospectus_search").first().attr("action") + "?" + o;
            e("#prospectus_results_container").addClass("js_processing"),
            e.post(s, (function(o, s, n) {
                var u = n.getResponseHeader("X-Current-Page");
                t() || e("#initial_study_type").val() !== e("#prospectus_study_type").val() ? document.location.href = u : (r(o, n.getResponseHeader("X-Search-Terms")),
                history.pushState({}, "", u))
            }
            ))
        }
        function s(t, o, s) {
            o = o || !1,
            e("#prospectus_results_container").addClass("js_processing"),
            e.get(t, (function(e, n, u) {
                r(e, u.getResponseHeader("Search-Terms")),
                o || history.pushState({}, "", t),
                s()
            }
            ))
        }
        e(document).ready((function() {
            e("#prospectus_study_type").change((function() {
                t() || o()
            }
            ))
        }
        )),
        e("body").on("submit", "#prospectus_search", o),
        e(document).on("click", ".prospectus_results_table th a, .view_type_toolbar a, .pagination a, .prospectus_per_page a, .pagination_legend a", (function(t) {
            var r = e(t.target);
            return s(r.attr("href"), !1, (function() {
                (r.is(".pagination a") || r.is(".prospectus_per_page a")) && e("html, body").animate({
                    scrollTop: e("#prospectus_results").offset().top
                })
            }
            )),
            !1
        }
        )),
        e(document).on("click", ".promo_link", (function(t) {
            var r = e(t);
            if (r.data("term"))
                return e(".prospectus_search").val(r.data("term")),
                e(".prospectus_search").submit(),
                e("html, body").animate({
                    scrollTop: e(".prospectus_search").offset().top
                }),
                !1
        }
        )),
        e(window).on("popstate", (function(e) {
            return s(location.href, !0)
        }
        ))
    }
    ).call(this, r(1))
}
, function(e, t) {
    e.exports = $
}
, function(e, t, r) {
    r(0),
    e.exports = r(3)
}
, function(e, t, r) {
    (function(e) {
        r(0);
        var t = null
          , o = e("#prospectus_q").clone();
        function s() {
            var r = e("#prospectus_q").data("collections")
              , s = e("#prospectus_study_type").find("option:selected").val();
            t = r[s],
            e("#prospectus_q").data("flb.autocompletion") && (o.val(e("#prospectus_q").val()),
            e("#prospectus_q").replaceWith(o.clone())),
            e("#prospectus_q").autocompletion({
                datasets: {
                    organic: {
                        collection: t,
                        profile: "_default",
                        program: "https://abdn-search.funnelback.squiz.cloud/s/suggest.json",
                        format: "extended",
                        alpha: "0.5",
                        show: "10",
                        sort: "0",
                        group: !0
                    }
                },
                length: 2
            })
        }
        e(document).ready(s),
        e("body").on("change", "#prospectus_study_type", s)
    }
    ).call(this, r(1))
}
]);


/*!
 * typeahead.js 0.11.1
 * https://github.com/twitter/typeahead.js
 * Copyright 2013-2015 Twitter, Inc. and other contributors; Licensed MIT
*/
!function(t, e) {
    "function" == typeof define && define.amd ? define("bloodhound", ["jquery"], function(n) {
        return t.Bloodhound = e(n)
    }) : "object" == typeof exports ? module.exports = e(require("jquery")) : t.Bloodhound = e(jQuery)
}(this, function(t) {
    var e = function() {
        "use strict";
        return {
            isMsie: function() {
                return !!/(msie|trident)/i.test(navigator.userAgent) && navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2]
            },
            isBlankString: function(t) {
                return !t || /^\s*$/.test(t)
            },
            escapeRegExChars: function(t) {
                return t.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
            },
            isString: function(t) {
                return "string" == typeof t
            },
            isNumber: function(t) {
                return "number" == typeof t
            },
            isArray: t.isArray,
            isFunction: t.isFunction,
            isObject: t.isPlainObject,
            isUndefined: function(t) {
                return void 0 === t
            },
            isElement: function(t) {
                return !(!t || 1 !== t.nodeType)
            },
            isJQuery: function(e) {
                return e instanceof t
            },
            toStr: function(t) {
                return e.isUndefined(t) || null === t ? "" : t + ""
            },
            bind: t.proxy,
            each: function(e, n) {
                t.each(e, function(t, e) {
                    return n(e, t)
                })
            },
            map: t.map,
            filter: t.grep,
            every: function(e, n) {
                var i = !0;
                return e ? (t.each(e, function(t, r) {
                    if (!(i = n.call(null, r, t, e)))
                        return !1
                }),
                !!i) : i
            },
            some: function(e, n) {
                var i = !1;
                return e ? (t.each(e, function(t, r) {
                    if (i = n.call(null, r, t, e))
                        return !1
                }),
                !!i) : i
            },
            mixin: t.extend,
            identity: function(t) {
                return t
            },
            clone: function(e) {
                return t.extend(!0, {}, e)
            },
            getIdGenerator: function() {
                var t = 0;
                return function() {
                    return t++
                }
            },
            templatify: function(e) {
                return t.isFunction(e) ? e : function() {
                    return String(e)
                }
            },
            defer: function(t) {
                setTimeout(t, 0)
            },
            debounce: function(t, e, n) {
                var i, r;
                return function() {
                    var s, o, u = this, a = arguments;
                    return s = function() {
                        i = null,
                        n || (r = t.apply(u, a))
                    }
                    ,
                    o = n && !i,
                    clearTimeout(i),
                    i = setTimeout(s, e),
                    o && (r = t.apply(u, a)),
                    r
                }
            },
            throttle: function(t, e) {
                var n, i, r, s, o, u;
                return o = 0,
                u = function() {
                    o = new Date,
                    r = null,
                    s = t.apply(n, i)
                }
                ,
                function() {
                    var a = new Date
                      , c = e - (a - o);
                    return n = this,
                    i = arguments,
                    c <= 0 ? (clearTimeout(r),
                    r = null,
                    o = a,
                    s = t.apply(n, i)) : r || (r = setTimeout(u, c)),
                    s
                }
            },
            stringify: function(t) {
                return e.isString(t) ? t : JSON.stringify(t)
            },
            noop: function() {}
        }
    }()
      , n = "0.11.1"
      , i = function() {
        "use strict";
        return {
            nonword: n,
            whitespace: t,
            obj: {
                nonword: i(n),
                whitespace: i(t)
            }
        };
        function t(t) {
            return (t = e.toStr(t)) ? t.split(/\s+/) : []
        }
        function n(t) {
            return (t = e.toStr(t)) ? t.split(/\W+/) : []
        }
        function i(t) {
            return function(n) {
                return n = e.isArray(n) ? n : [].slice.call(arguments, 0),
                function(i) {
                    var r = [];
                    return e.each(n, function(n) {
                        r = r.concat(t(e.toStr(i[n])))
                    }),
                    r
                }
            }
        }
    }()
      , r = function() {
        "use strict";
        function n(n) {
            this.maxSize = e.isNumber(n) ? n : 100,
            this.reset(),
            this.maxSize <= 0 && (this.set = this.get = t.noop)
        }
        function i() {
            this.head = this.tail = null
        }
        return e.mixin(n.prototype, {
            set: function(t, e) {
                var n, i = this.list.tail;
                this.size >= this.maxSize && (this.list.remove(i),
                delete this.hash[i.key],
                this.size--),
                (n = this.hash[t]) ? (n.val = e,
                this.list.moveToFront(n)) : (n = new function(t, e) {
                    this.key = t,
                    this.val = e,
                    this.prev = this.next = null
                }
                (t,e),
                this.list.add(n),
                this.hash[t] = n,
                this.size++)
            },
            get: function(t) {
                var e = this.hash[t];
                if (e)
                    return this.list.moveToFront(e),
                    e.val
            },
            reset: function() {
                this.size = 0,
                this.hash = {},
                this.list = new i
            }
        }),
        e.mixin(i.prototype, {
            add: function(t) {
                this.head && (t.next = this.head,
                this.head.prev = t),
                this.head = t,
                this.tail = this.tail || t
            },
            remove: function(t) {
                t.prev ? t.prev.next = t.next : this.head = t.next,
                t.next ? t.next.prev = t.prev : this.tail = t.prev
            },
            moveToFront: function(t) {
                this.remove(t),
                this.add(t)
            }
        }),
        n
    }()
      , s = function() {
        "use strict";
        var n;
        try {
            (n = window.localStorage).setItem("~~~", "!"),
            n.removeItem("~~~")
        } catch (t) {
            n = null
        }
        function i(t, i) {
            this.prefix = ["__", t, "__"].join(""),
            this.ttlKey = "__ttl__",
            this.keyMatcher = new RegExp("^" + e.escapeRegExChars(this.prefix)),
            this.ls = i || n,
            !this.ls && this._noop()
        }
        return e.mixin(i.prototype, {
            _prefix: function(t) {
                return this.prefix + t
            },
            _ttlKey: function(t) {
                return this._prefix(t) + this.ttlKey
            },
            _noop: function() {
                this.get = this.set = this.remove = this.clear = this.isExpired = e.noop
            },
            _safeSet: function(t, e) {
                try {
                    this.ls.setItem(t, e)
                } catch (t) {
                    "QuotaExceededError" === t.name && (this.clear(),
                    this._noop())
                }
            },
            get: function(t) {
                return this.isExpired(t) && this.remove(t),
                o(this.ls.getItem(this._prefix(t)))
            },
            set: function(t, n, i) {
                return e.isNumber(i) ? this._safeSet(this._ttlKey(t), s(r() + i)) : this.ls.removeItem(this._ttlKey(t)),
                this._safeSet(this._prefix(t), s(n))
            },
            remove: function(t) {
                return this.ls.removeItem(this._ttlKey(t)),
                this.ls.removeItem(this._prefix(t)),
                this
            },
            clear: function() {
                var t, e = function(t) {
                    var e, i, r = [], s = n.length;
                    for (e = 0; e < s; e++)
                        (i = n.key(e)).match(t) && r.push(i.replace(t, ""));
                    return r
                }(this.keyMatcher);
                for (t = e.length; t--; )
                    this.remove(e[t]);
                return this
            },
            isExpired: function(t) {
                var n = o(this.ls.getItem(this._ttlKey(t)));
                return !!(e.isNumber(n) && r() > n)
            }
        }),
        i;
        function r() {
            return (new Date).getTime()
        }
        function s(t) {
            return JSON.stringify(e.isUndefined(t) ? null : t)
        }
        function o(e) {
            return t.parseJSON(e)
        }
    }()
      , o = function() {
        "use strict";
        var n = 0
          , i = {}
          , s = 6
          , o = new r(10);
        function u(t) {
            t = t || {},
            this.cancelled = !1,
            this.lastReq = null,
            this._send = t.transport,
            this._get = t.limiter ? t.limiter(this._get) : this._get,
            this._cache = !1 === t.cache ? new r(0) : o
        }
        return u.setMaxPendingRequests = function(t) {
            s = t
        }
        ,
        u.resetCache = function() {
            o.reset()
        }
        ,
        e.mixin(u.prototype, {
            _fingerprint: function(e) {
                return (e = e || {}).url + e.type + t.param(e.data || {})
            },
            _get: function(t, e) {
                var r, o, u = this;
                function a(t) {
                    e(null, t),
                    u._cache.set(r, t)
                }
                function c() {
                    e(!0)
                }
                r = this._fingerprint(t),
                this.cancelled || r !== this.lastReq || ((o = i[r]) ? o.done(a).fail(c) : n < s ? (n++,
                i[r] = this._send(t).done(a).fail(c).always(function() {
                    n--,
                    delete i[r],
                    u.onDeckRequestArgs && (u._get.apply(u, u.onDeckRequestArgs),
                    u.onDeckRequestArgs = null)
                })) : this.onDeckRequestArgs = [].slice.call(arguments, 0))
            },
            get: function(n, i) {
                var r, s;
                i = i || t.noop,
                n = e.isString(n) ? {
                    url: n
                } : n || {},
                s = this._fingerprint(n),
                this.cancelled = !1,
                this.lastReq = s,
                (r = this._cache.get(s)) ? i(null, r) : this._get(n, i)
            },
            cancel: function() {
                this.cancelled = !0
            }
        }),
        u
    }()
      , u = window.SearchIndex = function() {
        "use strict";
        var n = "c"
          , i = "i";
        function r(n) {
            (n = n || {}).datumTokenizer && n.queryTokenizer || t.error("datumTokenizer and queryTokenizer are both required"),
            this.identify = n.identify || e.stringify,
            this.datumTokenizer = n.datumTokenizer,
            this.queryTokenizer = n.queryTokenizer,
            this.reset()
        }
        return e.mixin(r.prototype, {
            bootstrap: function(t) {
                this.datums = t.datums,
                this.trie = t.trie
            },
            add: function(t) {
                var r = this;
                t = e.isArray(t) ? t : [t],
                e.each(t, function(t) {
                    var u, a;
                    r.datums[u = r.identify(t)] = t,
                    a = s(r.datumTokenizer(t)),
                    e.each(a, function(t) {
                        var e, s, a;
                        for (e = r.trie,
                        s = t.split(""); a = s.shift(); )
                            (e = e[n][a] || (e[n][a] = o()))[i].push(u)
                    })
                })
            },
            get: function(t) {
                var n = this;
                return e.map(t, function(t) {
                    return n.datums[t]
                })
            },
            search: function(t) {
                var r, o, u = this;
                return r = s(this.queryTokenizer(t)),
                e.each(r, function(t) {
                    var e, r, s, a;
                    if (o && 0 === o.length)
                        return !1;
                    for (e = u.trie,
                    r = t.split(""); e && (s = r.shift()); )
                        e = e[n][s];
                    if (!e || 0 !== r.length)
                        return o = [],
                        !1;
                    a = e[i].slice(0),
                    o = o ? function(t, e) {
                        var n = 0
                          , i = 0
                          , r = [];
                        t = t.sort(),
                        e = e.sort();
                        var s = t.length
                          , o = e.length;
                        for (; n < s && i < o; )
                            t[n] < e[i] ? n++ : t[n] > e[i] ? i++ : (r.push(t[n]),
                            n++,
                            i++);
                        return r
                    }(o, a) : a
                }),
                o ? e.map(function(t) {
                    for (var e = {}, n = [], i = 0, r = t.length; i < r; i++)
                        e[t[i]] || (e[t[i]] = !0,
                        n.push(t[i]));
                    return n
                }(o), function(t) {
                    return u.datums[t]
                }) : []
            },
            all: function() {
                var t = [];
                for (var e in this.datums)
                    t.push(this.datums[e]);
                return t
            },
            reset: function() {
                this.datums = {},
                this.trie = o()
            },
            serialize: function() {
                return {
                    datums: this.datums,
                    trie: this.trie
                }
            }
        }),
        r;
        function s(t) {
            return t = e.filter(t, function(t) {
                return !!t
            }),
            t = e.map(t, function(t) {
                return t.toLowerCase()
            })
        }
        function o() {
            var t = {};
            return t[i] = [],
            t[n] = {},
            t
        }
    }()
      , a = function() {
        "use strict";
        var t;
        function n(t) {
            this.url = t.url,
            this.ttl = t.ttl,
            this.cache = t.cache,
            this.prepare = t.prepare,
            this.transform = t.transform,
            this.transport = t.transport,
            this.thumbprint = t.thumbprint,
            this.storage = new s(t.cacheKey)
        }
        return t = {
            data: "data",
            protocol: "protocol",
            thumbprint: "thumbprint"
        },
        e.mixin(n.prototype, {
            _settings: function() {
                return {
                    url: this.url,
                    type: "GET",
                    dataType: "json"
                }
            },
            store: function(e) {
                this.cache && (this.storage.set(t.data, e, this.ttl),
                this.storage.set(t.protocol, location.protocol, this.ttl),
                this.storage.set(t.thumbprint, this.thumbprint, this.ttl))
            },
            fromCache: function() {
                var e, n = {};
                return this.cache ? (n.data = this.storage.get(t.data),
                n.protocol = this.storage.get(t.protocol),
                n.thumbprint = this.storage.get(t.thumbprint),
                e = n.thumbprint !== this.thumbprint || n.protocol !== location.protocol,
                n.data && !e ? n.data : null) : null
            },
            fromNetwork: function(t) {
                var e, n = this;
                t && (e = this.prepare(this._settings()),
                this.transport(e).fail(function() {
                    t(!0)
                }).done(function(e) {
                    t(null, n.transform(e))
                }))
            },
            clear: function() {
                return this.storage.clear(),
                this
            }
        }),
        n
    }()
      , c = function() {
        "use strict";
        function t(t) {
            this.url = t.url,
            this.prepare = t.prepare,
            this.transform = t.transform,
            this.transport = new o({
                cache: t.cache,
                limiter: t.limiter,
                transport: t.transport
            })
        }
        return e.mixin(t.prototype, {
            _settings: function() {
                return {
                    url: this.url,
                    type: "GET",
                    dataType: "json"
                }
            },
            get: function(t, e) {
                var n, i = this;
                if (e)
                    return t = t || "",
                    n = this.prepare(t, this._settings()),
                    this.transport.get(n, function(t, n) {
                        e(t ? [] : i.transform(n))
                    })
            },
            cancelLastRequest: function() {
                this.transport.cancel()
            }
        }),
        t
    }()
      , h = function() {
        "use strict";
        return function(r) {
            var s, o;
            return s = {
                initialize: !0,
                identify: e.stringify,
                datumTokenizer: null,
                queryTokenizer: null,
                sufficient: 5,
                sorter: null,
                local: [],
                prefetch: null,
                remote: null
            },
            !(r = e.mixin(s, r || {})).datumTokenizer && t.error("datumTokenizer is required"),
            !r.queryTokenizer && t.error("queryTokenizer is required"),
            o = r.sorter,
            r.sorter = o ? function(t) {
                return t.sort(o)
            }
            : e.identity,
            r.local = e.isFunction(r.local) ? r.local() : r.local,
            r.prefetch = function(r) {
                var s;
                if (!r)
                    return null;
                return s = {
                    url: null,
                    ttl: 864e5,
                    cache: !0,
                    cacheKey: null,
                    thumbprint: "",
                    prepare: e.identity,
                    transform: e.identity,
                    transport: null
                },
                r = e.isString(r) ? {
                    url: r
                } : r,
                !(r = e.mixin(s, r)).url && t.error("prefetch requires url to be set"),
                r.transform = r.filter || r.transform,
                r.cacheKey = r.cacheKey || r.url,
                r.thumbprint = n + r.thumbprint,
                r.transport = r.transport ? i(r.transport) : t.ajax,
                r
            }(r.prefetch),
            r.remote = function(n) {
                var r;
                if (!n)
                    return;
                return r = {
                    url: null,
                    cache: !0,
                    prepare: null,
                    replace: null,
                    wildcard: null,
                    limiter: null,
                    rateLimitBy: "debounce",
                    rateLimitWait: 300,
                    transform: e.identity,
                    transport: null
                },
                n = e.isString(n) ? {
                    url: n
                } : n,
                !(n = e.mixin(r, n)).url && t.error("remote requires url to be set"),
                n.transform = n.filter || n.transform,
                n.prepare = (l = n,
                f = l.prepare,
                d = l.replace,
                p = l.wildcard,
                f || (f = d ? function(t, e) {
                    return e.url = d(e.url, t),
                    e
                }
                : l.wildcard ? function(t, e) {
                    return e.url = e.url.replace(p, encodeURIComponent(t)),
                    e
                }
                : function(t, e) {
                    return e
                }
                )),
                n.limiter = (s = n,
                o = s.limiter,
                u = s.rateLimitBy,
                a = s.rateLimitWait,
                o || (o = /^throttle$/i.test(u) ? (h = a,
                function(t) {
                    return e.throttle(t, h)
                }
                ) : (c = a,
                function(t) {
                    return e.debounce(t, c)
                }
                )),
                o),
                n.transport = n.transport ? i(n.transport) : t.ajax,
                delete n.replace,
                delete n.wildcard,
                delete n.rateLimitBy,
                delete n.rateLimitWait,
                n;
                var s, o, u, a, c, h;
                var l, f, d, p
            }(r.remote),
            r
        }
        ;
        function i(n) {
            return function(i) {
                var r = t.Deferred();
                return n(i, function(t) {
                    e.defer(function() {
                        r.resolve(t)
                    })
                }, function(t) {
                    e.defer(function() {
                        r.reject(t)
                    })
                }),
                r
            }
        }
    }();
    return function() {
        "use strict";
        var n;
        function r(t) {
            t = h(t),
            this.sorter = t.sorter,
            this.identify = t.identify,
            this.sufficient = t.sufficient,
            this.local = t.local,
            this.remote = t.remote ? new c(t.remote) : null,
            this.prefetch = t.prefetch ? new a(t.prefetch) : null,
            this.index = new u({
                identify: this.identify,
                datumTokenizer: t.datumTokenizer,
                queryTokenizer: t.queryTokenizer
            }),
            !1 !== t.initialize && this.initialize()
        }
        return n = window && window.Bloodhound,
        r.noConflict = function() {
            return window && (window.Bloodhound = n),
            r
        }
        ,
        r.tokenizers = i,
        e.mixin(r.prototype, {
            __ttAdapter: function() {
                var t = this;
                return this.remote ? function(e, n, i) {
                    return t.search(e, n, i)
                }
                : function(e, n) {
                    return t.search(e, n)
                }
            },
            _loadPrefetch: function() {
                var e, n, i = this;
                return e = t.Deferred(),
                this.prefetch ? (n = this.prefetch.fromCache()) ? (this.index.bootstrap(n),
                e.resolve()) : this.prefetch.fromNetwork(function(t, n) {
                    if (t)
                        return e.reject();
                    i.add(n),
                    i.prefetch.store(i.index.serialize()),
                    e.resolve()
                }) : e.resolve(),
                e.promise()
            },
            _initialize: function() {
                var t = this;
                return this.clear(),
                (this.initPromise = this._loadPrefetch()).done(function() {
                    t.add(t.local)
                }),
                this.initPromise
            },
            initialize: function(t) {
                return !this.initPromise || t ? this._initialize() : this.initPromise
            },
            add: function(t) {
                return this.index.add(t),
                this
            },
            get: function(t) {
                return t = e.isArray(t) ? t : [].slice.call(arguments),
                this.index.get(t)
            },
            search: function(t, n, i) {
                var r, s = this;
                return r = this.sorter(this.index.search(t)),
                n(this.remote ? r.slice() : r),
                this.remote && r.length < this.sufficient ? this.remote.get(t, function(t) {
                    var n = [];
                    e.each(t, function(t) {
                        !e.some(r, function(e) {
                            return s.identify(t) === s.identify(e)
                        }) && n.push(t)
                    }),
                    i && i(n)
                }) : this.remote && this.remote.cancelLastRequest(),
                this
            },
            all: function() {
                return this.index.all()
            },
            clear: function() {
                return this.index.reset(),
                this
            },
            clearPrefetchCache: function() {
                return this.prefetch && this.prefetch.clear(),
                this
            },
            clearRemoteCache: function() {
                return o.resetCache(),
                this
            },
            ttAdapter: function() {
                return this.__ttAdapter()
            }
        }),
        r
    }()
}),
function(t, e) {
    "function" == typeof define && define.amd ? define("typeahead.js", ["jquery"], function(t) {
        return e(t)
    }) : "object" == typeof exports ? module.exports = e(require("jquery")) : e(jQuery)
}(0, function(t) {
    var e = function() {
        "use strict";
        return {
            isMsie: function() {
                return !!/(msie|trident)/i.test(navigator.userAgent) && navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2]
            },
            isBlankString: function(t) {
                return !t || /^\s*$/.test(t)
            },
            escapeRegExChars: function(t) {
                return t.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
            },
            isString: function(t) {
                return "string" == typeof t
            },
            isNumber: function(t) {
                return "number" == typeof t
            },
            isArray: t.isArray,
            isFunction: t.isFunction,
            isObject: t.isPlainObject,
            isUndefined: function(t) {
                return void 0 === t
            },
            isElement: function(t) {
                return !(!t || 1 !== t.nodeType)
            },
            isJQuery: function(e) {
                return e instanceof t
            },
            toStr: function(t) {
                return e.isUndefined(t) || null === t ? "" : t + ""
            },
            bind: t.proxy,
            each: function(e, n) {
                t.each(e, function(t, e) {
                    return n(e, t)
                })
            },
            map: t.map,
            filter: t.grep,
            every: function(e, n) {
                var i = !0;
                return e ? (t.each(e, function(t, r) {
                    if (!(i = n.call(null, r, t, e)))
                        return !1
                }),
                !!i) : i
            },
            some: function(e, n) {
                var i = !1;
                return e ? (t.each(e, function(t, r) {
                    if (i = n.call(null, r, t, e))
                        return !1
                }),
                !!i) : i
            },
            mixin: t.extend,
            identity: function(t) {
                return t
            },
            clone: function(e) {
                return t.extend(!0, {}, e)
            },
            getIdGenerator: function() {
                var t = 0;
                return function() {
                    return t++
                }
            },
            templatify: function(e) {
                return t.isFunction(e) ? e : function() {
                    return String(e)
                }
            },
            defer: function(t) {
                setTimeout(t, 0)
            },
            debounce: function(t, e, n) {
                var i, r;
                return function() {
                    var s, o, u = this, a = arguments;
                    return s = function() {
                        i = null,
                        n || (r = t.apply(u, a))
                    }
                    ,
                    o = n && !i,
                    clearTimeout(i),
                    i = setTimeout(s, e),
                    o && (r = t.apply(u, a)),
                    r
                }
            },
            throttle: function(t, e) {
                var n, i, r, s, o, u;
                return o = 0,
                u = function() {
                    o = new Date,
                    r = null,
                    s = t.apply(n, i)
                }
                ,
                function() {
                    var a = new Date
                      , c = e - (a - o);
                    return n = this,
                    i = arguments,
                    c <= 0 ? (clearTimeout(r),
                    r = null,
                    o = a,
                    s = t.apply(n, i)) : r || (r = setTimeout(u, c)),
                    s
                }
            },
            stringify: function(t) {
                return e.isString(t) ? t : JSON.stringify(t)
            },
            noop: function() {}
        }
    }()
      , n = function() {
        "use strict";
        var t = {
            wrapper: "twitter-typeahead",
            input: "tt-input",
            hint: "tt-hint",
            menu: "tt-menu",
            dataset: "tt-dataset",
            suggestion: "tt-suggestion",
            selectable: "tt-selectable",
            empty: "tt-empty",
            open: "tt-open",
            cursor: "tt-cursor",
            highlight: "tt-highlight",
            group: "tt-group"
        };
        return function(n) {
            var i, r;
            return r = e.mixin({}, t, n),
            {
                css: (i = {
                    css: (a = {
                        wrapper: {
                            position: "relative",
                            display: "inline-block"
                        },
                        hint: {
                            position: "absolute",
                            top: "0",
                            left: "0",
                            borderColor: "transparent",
                            boxShadow: "none",
                            opacity: "1"
                        },
                        input: {
                            position: "relative",
                            verticalAlign: "top",
                            backgroundColor: "transparent"
                        },
                        inputWithNoHint: {
                            position: "relative",
                            verticalAlign: "top"
                        },
                        menu: {
                            position: "absolute",
                            top: "100%",
                            left: "0",
                            zIndex: "100",
                            display: "none"
                        },
                        ltr: {
                            left: "0",
                            right: "auto"
                        },
                        rtl: {
                            left: "auto",
                            right: " 0"
                        }
                    },
                    e.isMsie() && e.mixin(a.input, {
                        backgroundImage: "url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)"
                    }),
                    a),
                    classes: r,
                    html: (u = r,
                    {
                        wrapper: '<span class="' + u.wrapper + '"></span>',
                        menu: '<div class="' + u.menu + '"></div>'
                    }),
                    selectors: (s = r,
                    o = {},
                    e.each(s, function(t, e) {
                        o[e] = "." + t
                    }),
                    o)
                }).css,
                html: i.html,
                classes: i.classes,
                selectors: i.selectors,
                mixin: function(t) {
                    e.mixin(t, i)
                }
            };
            var s, o;
            var u;
            var a
        }
    }()
      , i = function() {
        "use strict";
        var n, i;
        function r(e) {
            e && e.el || t.error("EventBus initialized without el"),
            this.$el = t(e.el)
        }
        return n = "typeahead:",
        i = {
            render: "rendered",
            cursorchange: "cursorchanged",
            select: "selected",
            autocomplete: "autocompleted"
        },
        e.mixin(r.prototype, {
            _trigger: function(e, i) {
                var r;
                return r = t.Event(n + e),
                (i = i || []).unshift(r),
                this.$el.trigger.apply(this.$el, i),
                r
            },
            after: function(t) {
                var e;
                return e = [].slice.call(arguments, 1),
                this._trigger("after" + t, e).isDefaultPrevented()
            },
            before: function(t) {
                var e;
                return e = [].slice.call(arguments, 1),
                this._trigger("before" + t, e).isDefaultPrevented()
            },
            trigger: function(t) {
                var e;
                this._trigger(t, [].slice.call(arguments, 1)),
                (e = i[t]) && this._trigger(e, [].slice.call(arguments, 1))
            }
        }),
        r
    }()
      , r = function() {
        "use strict";
        var t = /\s+/
          , e = function() {
            var t;
            t = window.setImmediate ? function(t) {
                setImmediate(function() {
                    t()
                })
            }
            : function(t) {
                setTimeout(function() {
                    t()
                }, 0)
            }
            ;
            return t
        }();
        return {
            onSync: function(t, e, i) {
                return n.call(this, "sync", t, e, i)
            },
            onAsync: function(t, e, i) {
                return n.call(this, "async", t, e, i)
            },
            off: function(e) {
                var n;
                if (!this._callbacks)
                    return this;
                e = e.split(t);
                for (; n = e.shift(); )
                    delete this._callbacks[n];
                return this
            },
            trigger: function(n) {
                var r, s, o, u, a;
                if (!this._callbacks)
                    return this;
                n = n.split(t),
                o = [].slice.call(arguments, 1);
                for (; (r = n.shift()) && (s = this._callbacks[r]); )
                    u = i(s.sync, this, [r].concat(o)),
                    a = i(s.async, this, [r].concat(o)),
                    u() && e(a);
                return this
            }
        };
        function n(e, n, i, r) {
            var s, o, u;
            if (!i)
                return this;
            for (n = n.split(t),
            i = r ? (u = r,
            (o = i).bind ? o.bind(u) : function() {
                o.apply(u, [].slice.call(arguments, 0))
            }
            ) : i,
            this._callbacks = this._callbacks || {}; s = n.shift(); )
                this._callbacks[s] = this._callbacks[s] || {
                    sync: [],
                    async: []
                },
                this._callbacks[s][e].push(i);
            return this
        }
        function i(t, e, n) {
            return function() {
                for (var i, r = 0, s = t.length; !i && r < s; r += 1)
                    i = !1 === t[r].apply(e, n);
                return !i
            }
        }
    }()
      , s = function(t) {
        "use strict";
        var n = {
            node: null,
            pattern: null,
            tagName: "strong",
            className: null,
            wordsOnly: !1,
            caseSensitive: !1
        };
        return function(i) {
            var r;
            (i = e.mixin({}, n, i)).node && i.pattern && (i.pattern = e.isArray(i.pattern) ? i.pattern : [i.pattern],
            r = function(t, n, i) {
                for (var r, s = [], o = 0, u = t.length; o < u; o++)
                    s.push(e.escapeRegExChars(t[o]));
                return r = i ? "\\b(" + s.join("|") + ")\\b" : "(" + s.join("|") + ")",
                n ? new RegExp(r) : new RegExp(r,"i")
            }(i.pattern, i.caseSensitive, i.wordsOnly),
            function t(e, n) {
                var i;
                for (var r = 0; r < e.childNodes.length; r++)
                    3 === (i = e.childNodes[r]).nodeType ? r += n(i) ? 1 : 0 : t(i, n)
            }(i.node, function(e) {
                var n, s, o;
                (n = r.exec(e.data)) && (o = t.createElement(i.tagName),
                i.className && (o.className = i.className),
                (s = e.splitText(n.index)).splitText(n[0].length),
                o.appendChild(s.cloneNode(!0)),
                e.parentNode.replaceChild(o, s));
                return !!n
            }))
        }
    }(window.document)
      , o = function() {
        "use strict";
        var n;
        function i(n, i) {
            var r;
            (n = n || {}).input || t.error("input is missing"),
            i.mixin(this),
            this.$hint = t(n.hint),
            this.$input = t(n.input),
            this.query = this.$input.val(),
            this.queryWhenFocused = this.hasFocus() ? this.query : null,
            this.$overflowHelper = (r = this.$input,
            t('<pre aria-hidden="true"></pre>').css({
                position: "absolute",
                visibility: "hidden",
                whiteSpace: "pre",
                fontFamily: r.css("font-family"),
                fontSize: r.css("font-size"),
                fontStyle: r.css("font-style"),
                fontVariant: r.css("font-variant"),
                fontWeight: r.css("font-weight"),
                wordSpacing: r.css("word-spacing"),
                letterSpacing: r.css("letter-spacing"),
                textIndent: r.css("text-indent"),
                textRendering: r.css("text-rendering"),
                textTransform: r.css("text-transform")
            }).insertAfter(r)),
            this._checkLanguageDirection(),
            0 === this.$hint.length && (this.setHint = this.getHint = this.clearHint = this.clearHintIfInvalid = e.noop)
        }
        return n = {
            9: "tab",
            27: "esc",
            37: "left",
            39: "right",
            13: "enter",
            38: "up",
            40: "down"
        },
        i.normalizeQuery = function(t) {
            return e.toStr(t).replace(/^\s*/g, "").replace(/\s{2,}/g, " ")
        }
        ,
        e.mixin(i.prototype, r, {
            _onBlur: function() {
                this.resetInputValue(),
                this.trigger("blurred")
            },
            _onFocus: function() {
                this.queryWhenFocused = this.query,
                this.trigger("focused")
            },
            _onKeydown: function(t) {
                var e = n[t.which || t.keyCode];
                this._managePreventDefault(e, t),
                e && this._shouldTrigger(e, t) && this.trigger(e + "Keyed", t)
            },
            _onInput: function() {
                this._setQuery(this.getInputValue()),
                this.clearHintIfInvalid(),
                this._checkLanguageDirection()
            },
            _managePreventDefault: function(t, e) {
                var n;
                switch (t) {
                case "up":
                case "down":
                    n = !s(e);
                    break;
                default:
                    n = !1
                }
                n && e.preventDefault()
            },
            _shouldTrigger: function(t, e) {
                var n;
                switch (t) {
                case "tab":
                    n = !s(e);
                    break;
                default:
                    n = !0
                }
                return n
            },
            _checkLanguageDirection: function() {
                var t = (this.$input.css("direction") || "ltr").toLowerCase();
                this.dir !== t && (this.dir = t,
                this.$hint.attr("dir", t),
                this.trigger("langDirChanged", t))
            },
            _setQuery: function(t, e) {
                var n, r, s, o;
                s = t,
                o = this.query,
                r = !!(n = i.normalizeQuery(s) === i.normalizeQuery(o)) && this.query.length !== t.length,
                this.query = t,
                e || n ? !e && r && this.trigger("whitespaceChanged", this.query) : this.trigger("queryChanged", this.query)
            },
            bind: function() {
                var t, i, r, s, o = this;
                return t = e.bind(this._onBlur, this),
                i = e.bind(this._onFocus, this),
                r = e.bind(this._onKeydown, this),
                s = e.bind(this._onInput, this),
                this.$input.on("blur.tt", t).on("focus.tt", i).on("keydown.tt", r),
                !e.isMsie() || e.isMsie() > 9 ? this.$input.on("input.tt", s) : this.$input.on("keydown.tt keypress.tt cut.tt paste.tt", function(t) {
                    n[t.which || t.keyCode] || e.defer(e.bind(o._onInput, o, t))
                }),
                this
            },
            focus: function() {
                this.$input.focus()
            },
            blur: function() {
                this.$input.blur()
            },
            getLangDir: function() {
                return this.dir
            },
            getQuery: function() {
                return this.query || ""
            },
            setQuery: function(t, e) {
                this.setInputValue(t),
                this._setQuery(t, e)
            },
            hasQueryChangedSinceLastFocus: function() {
                return this.query !== this.queryWhenFocused
            },
            getInputValue: function() {
                return this.$input.val()
            },
            setInputValue: function(t) {
                this.$input.val(t),
                this.clearHintIfInvalid(),
                this._checkLanguageDirection()
            },
            resetInputValue: function() {
                this.setInputValue(this.query)
            },
            getHint: function() {
                return this.$hint.val()
            },
            setHint: function(t) {
                this.$hint.val(t)
            },
            clearHint: function() {
                this.setHint("")
            },
            clearHintIfInvalid: function() {
                var t, e, n;
                n = (t = this.getInputValue()) !== (e = this.getHint()) && 0 === e.indexOf(t),
                !("" !== t && n && !this.hasOverflow()) && this.clearHint()
            },
            hasFocus: function() {
                return this.$input.is(":focus")
            },
            hasOverflow: function() {
                var t = this.$input.width() - 2;
                return this.$overflowHelper.text(this.getInputValue()),
                this.$overflowHelper.width() >= t
            },
            isCursorAtEnd: function() {
                var t, n, i;
                return t = this.$input.val().length,
                n = this.$input[0].selectionStart,
                e.isNumber(n) ? n === t : !document.selection || ((i = document.selection.createRange()).moveStart("character", -t),
                t === i.text.length)
            },
            destroy: function() {
                this.$hint.off(".tt"),
                this.$input.off(".tt"),
                this.$overflowHelper.remove(),
                this.$hint = this.$input = this.$overflowHelper = t("<div>")
            }
        }),
        i;
        function s(t) {
            return t.altKey || t.ctrlKey || t.metaKey || t.shiftKey
        }
    }()
      , u = function() {
        "use strict";
        var n, i;
        function o(n, r) {
            var s;
            (n = n || {}).templates = n.templates || {},
            n.templates.notFound = n.templates.notFound || n.templates.empty,
            n.source || t.error("missing source"),
            n.node || t.error("missing node"),
            n.name && (s = n.name,
            !/^[_a-zA-Z0-9-]+$/.test(s)) && t.error("invalid dataset name: " + n.name),
            r.mixin(this),
            this.highlight = !!n.highlight,
            this.name = n.name || i(),
            this.limit = n.limit || 5,
            this.displayFn = function(t) {
                return t = t || e.stringify,
                e.isFunction(t) ? t : function(e) {
                    return e[t]
                }
            }(n.display || n.displayKey),
            this.templates = function(n, i) {
                return {
                    notFound: n.notFound && e.templatify(n.notFound),
                    pending: n.pending && e.templatify(n.pending),
                    header: n.header && e.templatify(n.header),
                    footer: n.footer && e.templatify(n.footer),
                    suggestion: n.suggestion || function(e) {
                        return t("<div>").text(i(e))
                    }
                    ,
                    group: n.group || function(e) {
                        return t("<div>").text(i(e))
                    }
                }
            }(n.templates, this.displayFn),
            this.source = n.source.__ttAdapter ? n.source.__ttAdapter() : n.source,
            this.async = e.isUndefined(n.async) ? this.source.length > 2 : !!n.async,
            this._resetLastSuggestion(),
            this.$el = t(n.node).addClass(this.classes.dataset).addClass(this.classes.dataset + "-" + this.name)
        }
        return n = {
            val: "tt-selectable-display",
            obj: "tt-selectable-object"
        },
        i = e.getIdGenerator(),
        o.extractData = function(e) {
            var i = t(e);
            return i.data(n.obj) ? {
                val: i.data(n.val) || "",
                obj: i.data(n.obj) || null
            } : null
        }
        ,
        e.mixin(o.prototype, r, {
            _overwrite: function(t, e) {
                (e = e || []).length ? this._renderSuggestions(t, e) : this.async && this.templates.pending ? this._renderPending(t) : !this.async && this.templates.notFound ? this._renderNotFound(t) : this._empty(),
                this.trigger("rendered", this.name, e, !1)
            },
            _append: function(t, e) {
                (e = e || []).length && this.$lastSuggestion.length ? this._appendSuggestions(t, e) : e.length ? this._renderSuggestions(t, e) : !this.$lastSuggestion.length && this.templates.notFound && this._renderNotFound(t),
                this.trigger("rendered", this.name, e, !0)
            },
            _renderSuggestions: function(t, e) {
                var n;
                n = this._getSuggestionsFragment(t, e),
                this.$lastSuggestion = n.children().last(),
                this.$el.html(n).prepend(this._getHeader(t, e)).append(this._getFooter(t, e))
            },
            _appendSuggestions: function(t, e) {
                var n, i;
                i = (n = this._getSuggestionsFragment(t, e)).children().last(),
                this.$lastSuggestion.after(n),
                this.$lastSuggestion = i
            },
            _renderPending: function(t) {
                var e = this.templates.pending;
                this._resetLastSuggestion(),
                e && this.$el.html(e({
                    query: t,
                    dataset: this.name
                }))
            },
            _renderNotFound: function(t) {
                var e = this.templates.notFound;
                this._resetLastSuggestion(),
                e && this.$el.html(e({
                    query: t,
                    dataset: this.name
                }))
            },
            _empty: function() {
                this.$el.empty(),
                this._resetLastSuggestion()
            },
            _getSuggestionsFragment: function(i, r) {
                var o, u = this;
                return o = document.createDocumentFragment(),
                e.each(r, function(e) {
                    var r, s;
                    s = u._injectQuery(i, e),
                    r = e.value ? t(u.templates.suggestion(s)).data(n.obj, e).data(n.val, u.displayFn(e)).addClass(u.classes.suggestion + " " + u.classes.selectable) : t(u.templates.group(s)).addClass(u.classes.group),
                    o.appendChild(r[0])
                }),
                this.highlight && s({
                    className: this.classes.highlight,
                    node: o,
                    pattern: i
                }),
                t(o)
            },
            _getFooter: function(t, e) {
                return this.templates.footer ? this.templates.footer({
                    query: t,
                    suggestions: e,
                    dataset: this.name
                }) : null
            },
            _getHeader: function(t, e) {
                return this.templates.header ? this.templates.header({
                    query: t,
                    suggestions: e,
                    dataset: this.name
                }) : null
            },
            _resetLastSuggestion: function() {
                this.$lastSuggestion = t()
            },
            _injectQuery: function(t, n) {
                return e.isObject(n) ? e.mixin({
                    _query: t
                }, n) : n
            },
            update: function(e) {
                var n = this
                  , i = !1
                  , r = !1
                  , s = 0;
                function o(t) {
                    r || (r = !0,
                    t = (t || []).slice(0, n.limit),
                    s = t.length,
                    n._overwrite(e, t),
                    s < n.limit && n.async && n.trigger("asyncRequested", e))
                }
                this.cancel(),
                this.cancel = function() {
                    i = !0,
                    n.cancel = t.noop,
                    n.async && n.trigger("asyncCanceled", e)
                }
                ,
                this.source(e, o, function(r) {
                    r = r || [],
                    !i && s < n.limit && (n.cancel = t.noop,
                    s += r.length,
                    n._append(e, r.slice(0, n.limit - s)),
                    n.async && n.trigger("asyncReceived", e))
                }),
                !r && o([])
            },
            cancel: t.noop,
            clear: function() {
                this._empty(),
                this.cancel(),
                this.trigger("cleared")
            },
            isEmpty: function() {
                return this.$el.is(":empty")
            },
            destroy: function() {
                this.$el = t("<div>")
            }
        }),
        o
    }()
      , a = function() {
        "use strict";
        function n(n, i) {
            var r = this;
            (n = n || {}).node || t.error("node is required"),
            i.mixin(this),
            this.$node = t(n.node),
            this.query = null,
            this.datasets = e.map(n.datasets, function(e) {
                var n = r.$node.find(e.node).first();
                return e.node = n.length ? n : t("<div>").appendTo(r.$node),
                new u(e,i)
            })
        }
        return e.mixin(n.prototype, r, {
            _onSelectableClick: function(e) {
                this.trigger("selectableClicked", t(e.currentTarget))
            },
            _onRendered: function(t, e, n, i) {
                this.$node.toggleClass(this.classes.empty, this._allDatasetsEmpty()),
                this.trigger("datasetRendered", e, n, i)
            },
            _onCleared: function() {
                this.$node.toggleClass(this.classes.empty, this._allDatasetsEmpty()),
                this.trigger("datasetCleared")
            },
            _propagate: function() {
                this.trigger.apply(this, arguments)
            },
            _allDatasetsEmpty: function() {
                return e.every(this.datasets, function(t) {
                    return t.isEmpty()
                })
            },
            _getSelectables: function() {
                return this.$node.find(this.selectors.selectable)
            },
            _removeCursor: function() {
                var t = this.getActiveSelectable();
                t && t.removeClass(this.classes.cursor)
            },
            _ensureVisible: function(t) {
                var e, n, i, r;
                n = (e = t.position().top) + t.outerHeight(!0),
                i = this.$node.scrollTop(),
                r = this.$node.height() + parseInt(this.$node.css("paddingTop"), 10) + parseInt(this.$node.css("paddingBottom"), 10),
                e < 0 ? this.$node.scrollTop(i + e) : r < n && this.$node.scrollTop(i + (n - r))
            },
            bind: function() {
                var t, n = this;
                return t = e.bind(this._onSelectableClick, this),
                this.$node.on("click.tt", this.selectors.selectable, t),
                e.each(this.datasets, function(t) {
                    t.onSync("asyncRequested", n._propagate, n).onSync("asyncCanceled", n._propagate, n).onSync("asyncReceived", n._propagate, n).onSync("rendered", n._onRendered, n).onSync("cleared", n._onCleared, n)
                }),
                this
            },
            isOpen: function() {
                return this.$node.hasClass(this.classes.open)
            },
            open: function() {
                this.$node.addClass(this.classes.open)
            },
            close: function() {
                this.$node.removeClass(this.classes.open),
                this._removeCursor()
            },
            setLanguageDirection: function(t) {
                this.$node.attr("dir", t)
            },
            selectableRelativeToCursor: function(t) {
                var e, n, i;
                return n = this.getActiveSelectable(),
                e = this._getSelectables(),
                -1 === (i = (i = ((i = (n ? e.index(n) : -1) + t) + 1) % (e.length + 1) - 1) < -1 ? e.length - 1 : i) ? null : e.eq(i)
            },
            setCursor: function(t) {
                this._removeCursor(),
                (t = t && t.first()) && (t.addClass(this.classes.cursor),
                this._ensureVisible(t))
            },
            getSelectableData: function(t) {
                return t && t.length ? u.extractData(t) : null
            },
            getActiveSelectable: function() {
                var t = this._getSelectables().filter(this.selectors.cursor).first();
                return t.length ? t : null
            },
            getTopSelectable: function() {
                var t = this._getSelectables().first();
                return t.length ? t : null
            },
            update: function(t) {
                var n = t !== this.query;
                return n && (this.query = t,
                e.each(this.datasets, function(e) {
                    e.update(t)
                })),
                n
            },
            empty: function() {
                e.each(this.datasets, function(t) {
                    t.clear()
                }),
                this.query = null,
                this.$node.addClass(this.classes.empty)
            },
            destroy: function() {
                this.$node.off(".tt"),
                this.$node = t("<div>"),
                e.each(this.datasets, function(t) {
                    t.destroy()
                })
            }
        }),
        n
    }()
      , c = function() {
        "use strict";
        var t = a.prototype;
        function n() {
            a.apply(this, [].slice.call(arguments, 0))
        }
        return e.mixin(n.prototype, a.prototype, {
            open: function() {
                return !this._allDatasetsEmpty() && this._show(),
                t.open.apply(this, [].slice.call(arguments, 0))
            },
            close: function() {
                return this._hide(),
                t.close.apply(this, [].slice.call(arguments, 0))
            },
            _onRendered: function() {
                return this._allDatasetsEmpty() ? this._hide() : this.isOpen() && this._show(),
                t._onRendered.apply(this, [].slice.call(arguments, 0))
            },
            _onCleared: function() {
                return this._allDatasetsEmpty() ? this._hide() : this.isOpen() && this._show(),
                t._onCleared.apply(this, [].slice.call(arguments, 0))
            },
            setLanguageDirection: function(e) {
                return this.$node.css("ltr" === e ? this.css.ltr : this.css.rtl),
                t.setLanguageDirection.apply(this, [].slice.call(arguments, 0))
            },
            _hide: function() {
                this.$node.hide()
            },
            _show: function() {
                this.$node.css("display", "block")
            }
        }),
        n
    }()
      , h = function() {
        "use strict";
        function n(n, r) {
            var s, o, u, a, c, h, l, f, d, p, g;
            (n = n || {}).input || t.error("missing input"),
            n.menu || t.error("missing menu"),
            n.eventBus || t.error("missing event bus"),
            r.mixin(this),
            this.eventBus = n.eventBus,
            this.minLength = e.isNumber(n.minLength) ? n.minLength : 1,
            this.input = n.input,
            this.menu = n.menu,
            this.enabled = !0,
            this.active = !1,
            this.input.hasFocus() && this.activate(),
            this.dir = this.input.getLangDir(),
            this._hacks(),
            this.menu.bind().onSync("selectableClicked", this._onSelectableClicked, this).onSync("asyncRequested", this._onAsyncRequested, this).onSync("asyncCanceled", this._onAsyncCanceled, this).onSync("asyncReceived", this._onAsyncReceived, this).onSync("datasetRendered", this._onDatasetRendered, this).onSync("datasetCleared", this._onDatasetCleared, this),
            s = i(this, "activate", "open", "_onFocused"),
            o = i(this, "deactivate", "_onBlurred"),
            u = i(this, "isActive", "isOpen", "_onEnterKeyed"),
            a = i(this, "isActive", "isOpen", "_onTabKeyed"),
            c = i(this, "isActive", "_onEscKeyed"),
            h = i(this, "isActive", "open", "_onUpKeyed"),
            l = i(this, "isActive", "open", "_onDownKeyed"),
            f = i(this, "isActive", "isOpen", "_onLeftKeyed"),
            d = i(this, "isActive", "isOpen", "_onRightKeyed"),
            p = i(this, "_openIfActive", "_onQueryChanged"),
            g = i(this, "_openIfActive", "_onWhitespaceChanged"),
            this.input.bind().onSync("focused", s, this).onSync("blurred", o, this).onSync("enterKeyed", u, this).onSync("tabKeyed", a, this).onSync("escKeyed", c, this).onSync("upKeyed", h, this).onSync("downKeyed", l, this).onSync("leftKeyed", f, this).onSync("rightKeyed", d, this).onSync("queryChanged", p, this).onSync("whitespaceChanged", g, this).onSync("langDirChanged", this._onLangDirChanged, this)
        }
        return e.mixin(n.prototype, {
            _hacks: function() {
                var n, i;
                n = this.input.$input || t("<div>"),
                i = this.menu.$node || t("<div>"),
                n.on("blur.tt", function(t) {
                    var r, s, o;
                    r = document.activeElement,
                    s = i.is(r),
                    o = i.has(r).length > 0,
                    e.isMsie() && (s || o) && (t.preventDefault(),
                    t.stopImmediatePropagation(),
                    e.defer(function() {
                        n.focus()
                    }))
                }),
                i.on("mousedown.tt", function(t) {
                    t.preventDefault()
                })
            },
            _onSelectableClicked: function(t, e) {
                this.select(e)
            },
            _onDatasetCleared: function() {
                this._updateHint()
            },
            _onDatasetRendered: function(t, e, n, i) {
                this._updateHint(),
                this.eventBus.trigger("render", n, i, e)
            },
            _onAsyncRequested: function(t, e, n) {
                this.eventBus.trigger("asyncrequest", n, e)
            },
            _onAsyncCanceled: function(t, e, n) {
                this.eventBus.trigger("asynccancel", n, e)
            },
            _onAsyncReceived: function(t, e, n) {
                this.eventBus.trigger("asyncreceive", n, e)
            },
            _onFocused: function() {
                this._minLengthMet() && this.menu.update(this.input.getQuery())
            },
            _onBlurred: function() {
                this.input.hasQueryChangedSinceLastFocus() && this.eventBus.trigger("change", this.input.getQuery())
            },
            _onEnterKeyed: function(t, e) {
                var n;
                (n = this.menu.getActiveSelectable()) && this.select(n) && e.preventDefault()
            },
            _onTabKeyed: function(t, e) {
                var n;
                (n = this.menu.getActiveSelectable()) ? this.select(n) && e.preventDefault() : (n = this.menu.getTopSelectable()) && this.autocomplete(n) && e.preventDefault()
            },
            _onEscKeyed: function() {
                this.close()
            },
            _onUpKeyed: function() {
                this.moveCursor(-1)
            },
            _onDownKeyed: function() {
                this.moveCursor(1)
            },
            _onLeftKeyed: function() {
                "rtl" === this.dir && this.input.isCursorAtEnd() && this.autocomplete(this.menu.getTopSelectable())
            },
            _onRightKeyed: function() {
                "ltr" === this.dir && this.input.isCursorAtEnd() && this.autocomplete(this.menu.getTopSelectable())
            },
            _onQueryChanged: function(t, e) {
                this._minLengthMet(e) ? this.menu.update(e) : this.menu.empty()
            },
            _onWhitespaceChanged: function() {
                this._updateHint()
            },
            _onLangDirChanged: function(t, e) {
                this.dir !== e && (this.dir = e,
                this.menu.setLanguageDirection(e))
            },
            _openIfActive: function() {
                this.isActive() && this.open()
            },
            _minLengthMet: function(t) {
                return (t = e.isString(t) ? t : this.input.getQuery() || "").length >= this.minLength
            },
            _updateHint: function() {
                var t, n, i, r, s, u;
                t = this.menu.getTopSelectable(),
                n = this.menu.getSelectableData(t),
                i = this.input.getInputValue(),
                !n || e.isBlankString(i) || this.input.hasOverflow() ? this.input.clearHint() : (r = o.normalizeQuery(i),
                s = e.escapeRegExChars(r),
                (u = new RegExp("^(?:" + s + ")(.+$)","i").exec(n.val)) && this.input.setHint(i + u[1]))
            },
            isEnabled: function() {
                return this.enabled
            },
            enable: function() {
                this.enabled = !0
            },
            disable: function() {
                this.enabled = !1
            },
            isActive: function() {
                return this.active
            },
            activate: function() {
                return !!this.isActive() || !(!this.isEnabled() || this.eventBus.before("active")) && (this.active = !0,
                this.eventBus.trigger("active"),
                !0)
            },
            deactivate: function() {
                return !this.isActive() || !this.eventBus.before("idle") && (this.active = !1,
                this.close(),
                this.eventBus.trigger("idle"),
                !0)
            },
            isOpen: function() {
                return this.menu.isOpen()
            },
            open: function() {
                return this.isOpen() || this.eventBus.before("open") || (this.menu.open(),
                this._updateHint(),
                this.eventBus.trigger("open")),
                this.isOpen()
            },
            close: function() {
                return this.isOpen() && !this.eventBus.before("close") && (this.menu.close(),
                this.input.clearHint(),
                this.input.resetInputValue(),
                this.eventBus.trigger("close")),
                !this.isOpen()
            },
            setVal: function(t) {
                this.input.setQuery(e.toStr(t))
            },
            getVal: function() {
                return this.input.getQuery()
            },
            select: function(t) {
                var e = this.menu.getSelectableData(t);
                return !(!e || this.eventBus.before("select", e.obj)) && (this.input.setQuery(e.val, !0),
                this.eventBus.trigger("select", e.obj),
                this.close(),
                this.eventBus.after("select", e.obj),
                !0)
            },
            autocomplete: function(t) {
                var e, n;
                return e = this.input.getQuery(),
                !(!((n = this.menu.getSelectableData(t)) && e !== n.val) || this.eventBus.before("autocomplete", n.obj)) && (this.input.setQuery(n.val),
                this.eventBus.trigger("autocomplete", n.obj),
                !0)
            },
            moveCursor: function(t) {
                var e, n, i, r;
                return e = this.input.getQuery(),
                n = this.menu.selectableRelativeToCursor(t),
                r = (i = this.menu.getSelectableData(n)) ? i.obj : null,
                !(this._minLengthMet() && this.menu.update(e)) && !this.eventBus.before("cursorchange", r) && (this.menu.setCursor(n),
                i ? this.input.setInputValue(i.val) : (this.input.resetInputValue(),
                this._updateHint()),
                this.eventBus.trigger("cursorchange", r),
                !0)
            },
            destroy: function() {
                this.input.destroy(),
                this.menu.destroy()
            }
        }),
        n;
        function i(t) {
            var n = [].slice.call(arguments, 1);
            return function() {
                var i = [].slice.call(arguments);
                e.each(n, function(e) {
                    return t[e].apply(t, i)
                })
            }
        }
    }();
    !function() {
        "use strict";
        var r, s, u;
        function l(e, n) {
            e.each(function() {
                var e, i = t(this);
                (e = i.data(s.typeahead)) && n(e, i)
            })
        }
        function f(n) {
            var i;
            return (i = e.isJQuery(n) || e.isElement(n) ? t(n).first() : []).length ? i : null
        }
        r = t.fn.typeahead,
        s = {
            www: "tt-www",
            attrs: "tt-attrs",
            typeahead: "tt-typeahead"
        },
        u = {
            initialize: function(r, u) {
                var l;
                return u = e.isArray(u) ? u : [].slice.call(arguments, 1),
                l = n((r = r || {}).classNames),
                this.each(function() {
                    var n, d, p, g, m, y, v, _, b, w, S;
                    e.each(u, function(t) {
                        t.highlight = !!r.highlight
                    }),
                    n = t(this),
                    d = t(l.html.wrapper),
                    p = f(r.hint),
                    g = f(r.menu),
                    m = !1 !== r.hint && !p,
                    y = !1 !== r.menu && !g,
                    m && (x = n,
                    A = l,
                    p = x.clone().addClass(A.classes.hint).removeData().css(A.css.hint).css((k = x,
                    {
                        backgroundAttachment: k.css("background-attachment"),
                        backgroundClip: k.css("background-clip"),
                        backgroundColor: k.css("background-color"),
                        backgroundImage: k.css("background-image"),
                        backgroundOrigin: k.css("background-origin"),
                        backgroundPosition: k.css("background-position"),
                        backgroundRepeat: k.css("background-repeat"),
                        backgroundSize: k.css("background-size")
                    })).prop("readonly", !0).removeAttr("id name placeholder required").attr({
                        autocomplete: "off",
                        spellcheck: "false",
                        tabindex: -1
                    })),
                    y && (g = t(l.html.menu).css(l.css.menu)),
                    p && p.val(""),
                    n = function(t, e) {
                        t.data(s.attrs, {
                            dir: t.attr("dir"),
                            autocomplete: t.attr("autocomplete"),
                            spellcheck: t.attr("spellcheck"),
                            style: t.attr("style")
                        }),
                        t.addClass(e.classes.input).attr({
                            autocomplete: "off",
                            spellcheck: !1
                        });
                        try {
                            !t.attr("dir") && t.attr("dir", "auto")
                        } catch (t) {}
                        return t
                    }(n, l),
                    (m || y) && (d.css(l.css.wrapper),
                    n.css(m ? l.css.input : l.css.inputWithNoHint),
                    n.wrap(d).parent().prepend(m ? p : null).append(y ? g : null));
                    var x, A, k;
                    S = y ? c : a,
                    v = new i({
                        el: n
                    }),
                    _ = new o({
                        hint: p,
                        input: n
                    },l),
                    b = new S({
                        node: g,
                        datasets: u
                    },l),
                    w = new h({
                        input: _,
                        menu: b,
                        eventBus: v,
                        minLength: r.minLength
                    },l),
                    n.data(s.www, l),
                    n.data(s.typeahead, w)
                })
            },
            isEnabled: function() {
                var t;
                return l(this.first(), function(e) {
                    t = e.isEnabled()
                }),
                t
            },
            enable: function() {
                return l(this, function(t) {
                    t.enable()
                }),
                this
            },
            disable: function() {
                return l(this, function(t) {
                    t.disable()
                }),
                this
            },
            isActive: function() {
                var t;
                return l(this.first(), function(e) {
                    t = e.isActive()
                }),
                t
            },
            activate: function() {
                return l(this, function(t) {
                    t.activate()
                }),
                this
            },
            deactivate: function() {
                return l(this, function(t) {
                    t.deactivate()
                }),
                this
            },
            isOpen: function() {
                var t;
                return l(this.first(), function(e) {
                    t = e.isOpen()
                }),
                t
            },
            open: function() {
                return l(this, function(t) {
                    t.open()
                }),
                this
            },
            close: function() {
                return l(this, function(t) {
                    t.close()
                }),
                this
            },
            select: function(e) {
                var n = !1
                  , i = t(e);
                return l(this.first(), function(t) {
                    n = t.select(i)
                }),
                n
            },
            autocomplete: function(e) {
                var n = !1
                  , i = t(e);
                return l(this.first(), function(t) {
                    n = t.autocomplete(i)
                }),
                n
            },
            moveCursor: function(t) {
                var e = !1;
                return l(this.first(), function(n) {
                    e = n.moveCursor(t)
                }),
                e
            },
            val: function(t) {
                var e;
                return arguments.length ? (l(this, function(e) {
                    e.setVal(t)
                }),
                this) : (l(this.first(), function(t) {
                    e = t.getVal()
                }),
                e)
            },
            destroy: function() {
                return l(this, function(t, n) {
                    var i, r, o;
                    r = (i = n).data(s.www),
                    o = i.parent().filter(r.selectors.wrapper),
                    e.each(i.data(s.attrs), function(t, n) {
                        e.isUndefined(t) ? i.removeAttr(n) : i.attr(n, t)
                    }),
                    i.removeData(s.typeahead).removeData(s.www).removeData(s.attr).removeClass(r.classes.input),
                    o.length && (i.detach().insertAfter(o),
                    o.remove()),
                    t.destroy()
                }),
                this
            }
        },
        t.fn.typeahead = function(t) {
            return u[t] ? u[t].apply(this, [].slice.call(arguments, 1)) : u.initialize.apply(this, arguments)
        }
        ,
        t.fn.typeahead.noConflict = function() {
            return t.fn.typeahead = r,
            this
        }
    }()
});


/*
 * Funnelback auto-completion plugin
 * version 2.6.3
 *
 * author: Liliana Nowak
 * Copyright Funnelback, 2015-2019
 *
 * @requires jQuery https://jquery.com@1.10.2
 * @requires Typeahead https://twitter.github.io/typeahead.js@0.11.1
 * @requires Handlebars https://handlebarsjs.com@4.7.7
 */
(function($) {
    'use strict';

	var autocompletion = function(element, options) {
		// Global references
		this.$element = $(element);
		this.options  = options;

		this.init();
	}

	// Default options
	autocompletion.defaults = {
		// set configuration
		datasets : null,				// {set1: {url: ''}, set2: {...}, set3: {...}}
		/*
		defaultCall   : {				// 'string'|[]|{}; use to trigger auto-completion when input value is empty and length=0
			params    : {},						// {}; list of parameters added to request
			url       : '' 						// 'string'; URL to call request
			transform : customFunctionToMapData,// function(set, data); transform function used to map response data
		},
		defaultCall   : '',				// 'string'; query to replace empty value and call request
		defaultCall   : [],				// [{value: '', label: ''}, {value: '', label: ''}]; list of hardcoded data to fulfill dropdown menu
		defaultCall   : {
			data      : [],				// []; list of hardcoded data
			transform : function 		// function(set, data); transform function used to map hardcoded data
		},
		*/
		callback 		: null,			// function(set, suggestions); callback function applied to suggestions before returning them to typeahead plugin
		debounceDelay	: 300,	  		// integer; the debounce delay in milliseconds between the time the user stops typing a letter and the time the request is done\
		group 			: false,		// true|false; enable grouping suggestions based on parameter itemGroup
		groupOrder		: [],			// []; list of group headers used to sort grouped suggestions in that order
		facets 			: {				// {}; list of parameters applied when default search-based auto-completion is enabled
			blacklist	: [],	// []; list of facet categories names not to displayed
			whitelist	: [],	// []; list of facet categories names to display
			show		: 2,	// integer; maximum number of facets values to display per facet category; if not set will display all facet category values
			url 		: null, // string; the target URL to apply facets parameters to; By default it'll be current location
		},
		itemGroup 		: 'category',	// 'string'; the name of field used to group suggestions and display as group header in dropdown
		itemLabel 		: 'value',		// 'string'; the name of a field to be displayed in input field
		template 		: {				// {notFound: '', pending: '', header: '', footer: '', group: '', suggestion: ''}
			group: function(context) { return $('<div>').html(String(context.label)); },
			suggestion: function(context) { return $('<div>').html(String(context.label)); }
		},
		templateMerge 	: true,			// true|false; to wrap notFound and pending template with header and footer template
		transform 		: _processSetData, // function(set, suggestion, index); transform function used to map response data

		// URL settings
		collection 		: null,			// 'string'; the collection name
		dataType 		: 'json',		// 'json'|'jsonp'; the type of data returned back from the server
		alpha 			: '0.5',		// 'string'; adjust the balance between length and relevancy for spelling based suggestions
		format 			: 'extended',	// 'simple|extended'; mapping into 'json' or 'json++'
		params 			: null,			// {}; custom URL parameters
		profile 		: '_default',	// 'string'; the profile name
		program 		: '/s/suggest.json', // 'string'; program/URL used to generate auto-completion suggestions
		show 			: 10,			// integer; maximum number of suggestions to diplay in dropdown per set
		sort 			: 0,			// integer; set the auto-completion suggestions sort order when program='/s/suggest.json'
		queryKey 		: 'partial_query', // 'string'; the name of URL parameter to run search query
		queryVal 		: '%QUERY',		// 'string'; the value to be replaced in url with the URI encoded query

		// display settings
		length      	: 3,			// integer; the minimum character length to trigger query completion
		horizontal  	: false,		// true|false; if true, display datasets in columns, else one below the other
		scrollable  	: false,		// true|false; to limit height of a menu dropdown to maxheight by adding vertical scroll

		// logs
		logging 		: true,
		interactionLog 	: '/s/log',

		//typeahead settings
		typeahead: {
			classNames  : {},			// {}; to override any of default classes, more https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md#class-names
			highlight   : true,			// true|false; when suggestions are rendered, pattern matches for the current query in text nodes will be wrapped in a strong element with its class set to {{classNames.highlight}}
			hint        : false,		// true|false; to show a hint in input field,
			events      : {				// {eventName: function}; events get triggered on the input element during the life-cycle of a typeahead
				select  : function(event, suggestion) {
					_selectItem(suggestion, $(event.target));
				},
				afterselect: function(event, suggestion) {
					if (suggestion.extra.action_t == 'E') $(event.target).focus();
				}
			}
		},
	};

	/* Public methods */
	
	autocompletion.prototype.init = function() {
		this.option(this.options);

		if (_isEnabled(this.options)) this.initTypeahead();
		else this.destroy();
	}

	autocompletion.prototype.destroy = function () {
		this.destroyTypeahead;

		this.$element = null;
		this.options  = {};
	}

	autocompletion.prototype.option = function(key, val) {
		if (arguments.length === 0) {
			return this.options;
		}

		var that = this, options = $.isObject(key) ? key : {}, parts;
		if ($.isString(key)) {
			if (arguments.length === 1 || !$.isDefinied(val)) {
				return $.dataVals($.extend({}, that.options), key);
			}

			options[key] = val;
		}

		for (var k in options) _setOption(k, options[k]);

		function _setOption(key, val) {
			if (key === 'datasets') that.options[key] = _mapOptions(that.options, val);
			if (key === 'debug') _debug = val;
			if (key === 'horizontal' && val) {
				that.setTypeaheadClass('menu', 'tt-horizontal');

				that.options.typeahead.events.render = function(event) {
					_renderSetWidth(that.getTypeaheadMenu(), 'tt-horizontal', 'tt-dataset');
				};
			}
			if (key === 'scrollable' && val) that.setTypeaheadClass('menu', 'tt-scrollable');
		}
	}

	autocompletion.prototype.horizontal = function(val) {
		return this.option('horizontal', val);
	}

	autocompletion.prototype.scrollable = function(val) {
		return this.option('scrollable', val);
	}

	// Typeahead
	autocompletion.prototype.initTypeahead = function() {
		var that = this, data = [];

		$.each(that.options.datasets, function(name, set) {
			data.push(_getSetData(set, name));
		});

		that.$element.typeahead({
			minLength : parseInt(that.options.length),
			hint      : that.options.typeahead.hint,
			highlight : that.options.typeahead.highlight,
			classNames: that.options.typeahead.classNames
		}, data);

		if (that.options.typeahead.events) {
			$.each(that.options.typeahead.events, function(eventName, func) {
				that.$element.on('typeahead:' + eventName, func);
			});
		}

		if (that.options.horizontal) {
			var data = that.$element.data(), menu = that.getTypeaheadMenu();

			/* 
			 * 37 - code for left arrow key
			 * 38 - code for up arrow key
			 * 39 - code for right arrow key
			 * 40 - code for down arrow key
			 */
			data.ttTypeahead._onDownKeyed = function() {
				_navCursorUD(40, menu, that.$element);
			};
			data.ttTypeahead._onUpKeyed = function() {
				_navCursorUD(38, menu, that.$element);
			}

			var cols = menu.children('.tt-dataset');
			if (cols.length > 1) {
				data.ttTypeahead._onLeftKeyed = function() {
					_navCursorLR(37, cols, that.$element);
				};
				data.ttTypeahead._onRightKeyed = function() {
					_navCursorLR(39, cols, that.$element);
				}
			}

			that.$element.on('keydown', function(event) {
				var code = event.keyCode || event.which;
				if (code == 38 || code == 40) return false;
				if ((code == 37 || code == 39) && $.exist(_navCols.cursor)) return false;
			});
		}

		// Log interactions
		if (!that.options.logging) return;
		that.$element.on('typeahead:select', function(event, suggestion) {
			logInteraction(that.options, suggestion, $(event.target), 'select');
		});
	}

	autocompletion.prototype.destroyTypeahead = function() {
		this.$element.typeahead('destroy');
	}

	autocompletion.prototype.getTypeaheadMenu = function() {
		return this.$element.siblings('.tt-menu');
	}

	autocompletion.prototype.setTypeaheadClass = function(name, className) {
		if (!$.exist(this.options.typeahead.classNames[name], true)) this.options.typeahead.classNames[name] = 'tt-' + name; // default class
		this.options.typeahead.classNames[name] += ' ' + className;
	}

	/* Private variables */
	var _debug = false,
	_mapKeys = ['collection', 'callback', 'dataType', 'alpha', 'facets', 'transform', 'format', 'group', 'groupOrder', 'itemGroup', 'itemLabel', 'params', 'profile', 'program', 'show', 'sort', 'queryKey', 'queryVal', 'template', 'templateMerge', 'debounceDelay'],
	_navCols = {cursor : null, query  : ''};

	/* Private methods */
	
	// Check if there is enough data to trigger auto-completion
	function _isEnabled(options) {
		var bState = false;

		if (!$.isObject(options.datasets)) return bState;

		$.each(options.datasets, function(name, set) {
			if ($.exist(set.collection, true)) bState = true;
		});

		return bState;
	}

	// Map global options per dataset
	function _mapOptions(options, datasets) {
		var map = {};
		$.each(_mapKeys, function(i, key) { map[key] = options[key] });
		$.each(datasets, function(name, set) { datasets[name] = $.extend(true, {}, map, set) });
		return datasets;
	}

	// Handle set
	function _getSetData(set, name) {
		var engine = new Bloodhound({
			datumTokenizer : Bloodhound.tokenizers.obj.whitespace('value'),
			queryTokenizer : Bloodhound.tokenizers.whitespace,
			remote         : getBloodhoundRemote()
		});
		engine.initialize();

		return {
			name 	: name,
			limit 	: 10000, // hack to display all returned data
			source 	: source,
			display : displayVal,
			templates : _renderSetTemplate(set)
		}

		function displayVal(suggestion) {
			return $.isFunction(set.itemLabel) ? set.itemLabel.call(undefined, suggestion) : $.dataVals(suggestion, set.itemLabel);
		}

		function getBloodhoundRemote() {
			var remote = {
				url    : set.url ? set.url : _getSetUrl(set),
				filter : function (response) {
					var query = getQuery($(this).get(0).transport.lastReq);
					return _handleSetData(set, $.map(response, function(suggestion, i) { return set.transform(set, suggestion, i, name, query) }));
				},
				rateLimitWait: set.debounceDelay
			};
			if (set.dataType === 'jsonp') {
				remote['prepare'] = function(query, settings) {
					settings.dataType = 'jsonp';
					settings.url = settings.url.replace(set.queryVal, query);
					return settings;
				};
			} else {
				remote['wildcard'] = set.queryVal;
			}
			return remote;
		}

		function getQuery(str) {
			if (!$.exist(str, true)) return str;
			str = decodeURIComponent(str);
			return str.substring(str.lastIndexOf(set.queryKey + '=') + (set.queryKey.length + 1), str.lastIndexOf('GET'));
		}

		function displayVal(suggestion) {
			return $.isFunction(set.itemLabel) ? set.itemLabel.call(undefined, suggestion) : $.dataVals(suggestion, set.itemLabel);
		}

		function source(query, sync, async) {
			if (query.length < 1 && set.defaultCall) {
				if ($.isString(set.defaultCall)) {
					query = set.defaultCall;
				}
				else if ($.isArray(set.defaultCall)) {
					sync(_handleSetData(set, set.defaultCall));
					return;
				}
				else if ($.exist(set.defaultCall.data)) {
					sync(_handleSetData(set, set.defaultCall.transform(set, set.defaultCall.data)));
					return;
				}
				else if ($.exist(set.defaultCall.url, true)) {
					$.get(set.defaultCall.url, set.defaultCall.params, function(data) {
						async(_handleSetData(set.defaultCall.transform(set, data)));
						return;
					});
				}
			}

			engine.search(query, sync, async);
		}
	}

	// Returned request URL based on provided parameters
	function _getSetUrl(set) {
		var params = {collection: set.collection};

		if ($.exist(set.format, true)) params['fmt'] = set.format == 'simple' ? 'json' : 'json++';
		if ($.exist(set.alpha, true)) params['alpha'] = set.alpha;
		if ($.exist(set.profile, true)) params['profile'] = set.profile;
		if ($.exist(set.show, true)) params['show'] = set.show;
		if ($.exist(set.sort, true)) params['sort'] = set.sort;
		if ($.isObject(set.params)) params = $.extend(true, {}, params, set.params);

		return set.program + '?' + $.param(params) + '&' + set.queryKey + '=' + set.queryVal;
	}

	// Group results into categories
	function _groupSetData(set, results) {
		var grouped = {'':[]}, i, len;

		if ($.exist(set.groupOrder)) {
			for (i = 0, len = set.groupOrder.length; i < len; i++) {
				grouped[set.groupOrder[i]] = [{label: set.groupOrder[i]}];
			}
		}

		for (i = 0, len = results.length; i < len; i++) {
			if (!$.exist(grouped[results[i][set.itemGroup]])) grouped[results[i][set.itemGroup]] = [{label: results[i][set.itemGroup]}];
			grouped[results[i][set.itemGroup]].push(results[i]);
		}

		results = [];
		$.each(grouped, function(groupName, group) {
			if (group.length > 1) {
				if (!$.exist(groupName, true)) group.splice(0, 1);
				$.merge(results, group);
			}
		});

		return results;
	}

	// Limit number of returned results
	// Trigger grouping them or apply custom callback
	function _handleSetData(set, results) {
		results = results.slice(0, set.show);
		if (set.callback && $.isFunction(set.callback)) results = set.callback.call(undefined, set, results) || [];
		if (!set.group) return results;
		return _groupSetData(set, results);
	}

	function _processSetData(set, suggestion, i, name, query) {
		return $.autocompletion.processSetData(set, suggestion, i, name, query);
	}

	// Adjust columns width depends on columns number
	// If column has assigned CSS "width" property with "!important" declaration, this will be respected
	function _renderSetWidth(menu, classWrapper, className) {
		var cols = 0, colsW = 0, styles, parts, menuW = menu.width();
		className 	 = '.' + className;
		classWrapper = '.' + classWrapper;

		$.each(menu.children(className), function() {
			parts  = $(this).attr('class').split(' ');
			styles = $.cssStyle(classWrapper + ' .' + parts[1]) || $.cssStyle(classWrapper + ' .' + parts.join('.'));

			if (styles.width && styles.width.indexOf('important') && styles.width.indexOf('auto') < 0 && styles.width.indexOf('initial') < 0 && styles.width.indexOf('inherit') < 0) {
				if (styles.width.indexOf('%') > 0) colsW += menuW * parseFloat(styles.width) / 100;
				else colsW += parseFloat(styles.width);
			}
			else if ($.hasContent($(this))) cols++;
		});

		if (cols) {
			menuW -= colsW + 0.5;
			var minW = parseFloat(menu.children(className).css('min-width')), colW = menuW / cols;
			if (minW <= colW) menu.children(className).css('width', colW + 'px');
		}
	}

	// Pre-compile templates using Handlebars
	function _renderSetTemplate(set) {
		_setSetTemplateHeader(set);

		if (!set.template || $.isEmptyObject(set.template)) return {};

		$.each(set.template, function(k, obj) {
			if ($.isObject(obj)) set.template[k] = obj.prop('outerHTML');
		});

		if (set.templateMerge) {
			templateMerge('notFound');
			templateMerge('pending');
		}

		$.each(set.template, function(k, obj) {
			if ($.isString(obj)) set.template[k] = Handlebars.compile(obj);
		});

		return set.template;

		function templateMerge(temp) {
			if (set.template[temp] && $.isString(set.template[temp])) {
				if (set.template.header && $.isString(set.template.header)) set.template[temp] = set.template.header + set.template[temp];
				if (set.template.footer && $.isString(set.template.footer)) set.template[temp] += set.template.footer;
			}
		}
	}

	// Set default template to display column header if column name is defined
	function _setSetTemplateHeader(set) {
		if (!set.template.header && $.exist(set.name, true)) set.template.header = '<h5 class="tt-category">' + set.name + '</h5>';
	}

	// Handle selected item based on "action_t" parameter
	function _selectItem(item, target) {
		if ($.exist(item.extra)) {
			switch(item.extra.action_t) {
				case 'C':
					let actionFn = new Function(item.extra.action); actionFn();
					 break;
				case 'U':
					document.location = item.extra.action; break;
				case 'E':
					target.typeahead('val', item.extra.action); break;
				case undefined:
				case '':
				case 'S':
				case 'Q':
				default:
					formSend(item.value); break;
			}
		} else {
			formSend(item.value);
		}

		function formSend(val) { // Submit form on select
			target.val(val);
			target.closest('form').submit();
		}
	}

	function _getSelectableLabel(item) {
		return $.exist(item.data()) ? item.data().ttSelectableDisplay : item.text();
	}

	/* Handle Typeahead navigation */
	
	// Navigate dropdown list  left - right (switching between columns)
	function _navCursorLR(code, cols, target) {
		if (!$.exist(_navCols.cursor)) return;

		var currCol      = _navCols.cursor.parent(),
			currColIdx   = cols.index(currCol),
			delta        = code == 37 ? -1 : 1,
			nextColItems = getNextColItems(currColIdx),
			cursorIdx    = $(currCol).children('.tt-selectable').index(_navCols.cursor),
			nextCursor   = $.exist(nextColItems[cursorIdx]) ? nextColItems[cursorIdx] : nextColItems[nextColItems.length - 1];

		$(_navCols.cursor).removeClass('tt-cursor');
		_navCols.cursor = $(nextCursor).addClass('tt-cursor');
		target.data().ttTypeahead.input.setInputValue(_getSelectableLabel(_navCols.cursor));

		function getNextColItems(currColIdx) {
			var nextColIdx = code == 37
				? $.exist(cols[currColIdx - 1]) ? currColIdx - 1 : cols.length - 1
				: $.exist(cols[currColIdx + 1]) ? currColIdx + 1 : 0,
				nextColItems = $(cols[nextColIdx]).children('.tt-selectable');

			return $.exist(nextColItems) ? nextColItems : getNextColItems(nextColIdx);
		}
	}

	// Navigate dropdown list  up - down
	function _navCursorUD(code, menu, target) {
		if (!$.exist(menu.find('.tt-cursor'))) {
			_navCols.cursor = code == 38 ? menu.find('.tt-selectable').last() : menu.find('.tt-selectable').first();
			_navCols.cursor.addClass('tt-cursor');
			_navCols.query  = target.val();
			target.data().ttTypeahead.input.setInputValue(_getSelectableLabel(_navCols.cursor));
			return;
		}

		var currCol      = _navCols.cursor.parent(),
			currColItems = $(currCol).children('.tt-selectable');

		if(!$.exist(currColItems)) return;

		var cursorIdx = currColItems.index(_navCols.cursor), delta = code == 38 ? -1 : 1;

		$(_navCols.cursor).removeClass('tt-cursor');

		if (!$.exist(currColItems[cursorIdx + delta])) {
			_navCols.cursor = null;
			target.data().ttTypeahead.input.resetInputValue();
			target.data().ttTypeahead._updateHint();
		}
		else {
			_navCols.cursor = $(currColItems[cursorIdx + delta]).addClass('tt-cursor');
			target.data().ttTypeahead.input.setInputValue(_getSelectableLabel(_navCols.cursor));
		}
	}

	// Debug
	function logDebug(options, input, output, msg) {
		if (!_debug || !window.console) return;

		console.log(msg);
		console.log('Options: ', options);
		console.log('Input: ', input);
		console.log('Output: ', output);
		console.log('--------');
	}

	function logInteraction(options, input, target, event) {
		if (!options.logging || !$.exist(options.interactionLog, true)) return;
		if (!input.dataset || !options.datasets[input.dataset]) return;

		$.ajax({
			dataType: 'jsonp',
			type: 'GET',
			url:  getInteractionUrl(options.datasets[input.dataset], input),
		}).fail(function(qXHR, textStatus, errorThrown) {
			logDebug(options, input, qXHR, 'Interaction log error: ' + textStatus + ' ' + errorThrown);
		});

		function getInteractionUrl(set, suggestion) {
			var params = {
				collection: set.collection,
				type: event,
				partial_query: suggestion.query,
				client_time: new Date().getTime()
			};

			if ($.exist(set.profile, true)) params['profile'] = set.profile;
			if ($.exist(suggestion.extra)) params = $.extend(true, {}, params, suggestion.extra);

			return options.interactionLog + '?' + $.param(params);
		}
	}

	// Generate plugin
	function Plugin() {
		var args = [].slice.call(arguments), option = args.shift();

		return this.each(function () {
			var $this = $(this),
				data    = $this.data('flb.autocompletion'),
				options = $.extend(true, {}, autocompletion.defaults, data || {}, $.isObject(option) && option);

			if (!data && /destroy|hide/.test(option)) return;
			if (!data) $this.data('flb.autocompletion', (data = new autocompletion(this, options)));
			if ($.isString(option) && $.isFunction(data[option])) data[option].apply($this, args);
		});
	}

	$.fn.autocompletion             = Plugin;
	$.fn.autocompletion.Constructor = autocompletion;

	// List of predefined mapping functions
	$.autocompletion = {
		// Map /s/suggest.json output
		processSetData: function(set, suggestion, i, name, query) {
			var value = suggestion.key, label = suggestion.key;
			if (suggestion.action_t == 'Q') value = suggestion.action;
			if (suggestion.action_t == 'S') value = suggestion.disp;
			if (suggestion.disp_t == 'C') label = new Function("return " + suggestion.disp)();
			else if (suggestion.disp) label = suggestion.disp;

			return {
				label    : label,
				value    : value,
				extra    : suggestion,
				category : suggestion.cat ? suggestion.cat : '',
				rank     : i + 1,
				dataset	 : name,
				query    : query
			};
		},

		// Map /s/search.json output
		processSetDataFacets: function(set, suggestion, i, name, query) {
			if (i !== 'response' || !$.exist(suggestion.facets)) return;

			var suggestions = [], rank = 1;
			for (var i = 0, leni = suggestion.facets.length; i < leni; i++) {
				var facet = suggestion.facets[i];

				if (!$.exist(facet.allValues)) continue;
				if ($.exist(set.facets.blacklist) && set.facets.blacklist.indexOf(facet.name) > -1) continue;
				if ($.exist(set.facets.whitelist) && set.facets.whitelist.indexOf(facet.name) < 0) continue;

				for (var j = 0, lenj = facet.allValues.length; j < lenj; j++) {
					if ($.exist(set.facets.show) && j > parseInt(set.facets.show) - 1) break;
					if (!facet.allValues[j].count) continue;

					suggestions.push({
						label   : facet.allValues[j].label,
						value   : facet.allValues[j].data,
						extra   : {
							action  : getUrl(facet.allValues[j]),
							action_t: 'U'
						},
						category: facet.name,
						rank    : rank++,
						dataset	: name,
						query   : query
					});
				}
			}

			return suggestions;

			function getUrl(facet) {
				return ($.exist(set.facets.url, true) ? set.facets.url : window.location.origin + window.location.pathname) + facet.toggleUrl;
			}
		}
	}

	// Helpers
	$.exist      = function(obj, bString) { if (!$.isDefinied(bString)) bString = false; var obj = bString ? obj : $(obj); return $.isDefinied(obj) && obj != null && ($.isString(obj) ? obj + '' : obj).length > 0; }
	$.hasContent = function(obj) { return obj.html().trim().length ? true : false; }
	$.isDefinied = function(obj) { return typeof(obj) !== 'undefined'; }
	$.isFunction = function(obj) { return typeof(obj) === 'function'; }
	$.isString   = function(obj) { return typeof(obj) === 'string'; }
	$.isObject   = function(obj) { return typeof(obj) === 'object'; }
	$.dataKeys   = function(obj) { return iterateKeys(obj, ''); function iterateKeys(obj, prefix) { return $.map(Object.keys(obj), function(key) { if(obj[key] && $.isObject(obj[key])) return iterateKeys(obj[key], key); else return (prefix ? prefix + '-' + key : key);}); }}
	$.dataVals   = function(obj, key) { var parts = key.split('.'), key = parts.shift(); if (parts.length) { for (var i = 0, len = parts.length; i < len; i++) { obj = obj[key] || {}; key = parts[i]; } } return obj[key]; }
	$.cssStyle	 = function(className) {
		var styleSheets = window.document.styleSheets,  styles = {};

		for(var i = 0, leni = styleSheets.length; i < leni; i++){
			if (styleSheets[i].href && styleSheets[i].href.indexOf(window.location.host + '/') < 0) continue;

			var classes = styleSheets[i].rules || styleSheets[i].cssRules;
			if (!classes) continue;

			for (var j = 0, lenj = classes.length; j < lenj; j++) {
				if (classes[j].selectorText != className) continue;

				var properties = classes[j].style.cssText.split(';');
				for (var k = 0, lenk = properties.length; k < lenk; k++) {
					var part = properties[k].split(':');
					if (part.length == 2) styles[part[0].trim()] = part[1].trim();
				}
			}
		}
		return styles;
	}

}(jQuery));

String.prototype.capitalize = function() { return this.charAt(0).toUpperCase() + this.slice(1); }
