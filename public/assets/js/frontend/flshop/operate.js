"use strict";define(["jquery","bootstrap","table","backend","form","vue"],function(e,t,i,a,r,n){var l={find:function(){i.api.init({extend:{index_url:"flbooth/find/index"+location.search,add_url:"flbooth/find/add",edit_url:"",del_url:"flbooth/find/del",multi_url:"",table:"flbooth_find"}});var t=e("#table");t.bootstrapTable({url:e.fn.bootstrapTable.defaults.extend.index_url,pk:"id",sortName:"id",columns:[[{checkbox:!0},{field:"id",title:__("Id")},{field:"type",title:__("Type"),searchList:{new:__("Type new"),live:__("Type live"),want:__("Type want"),activity:__("Type activity"),show:__("Type show")},formatter:i.api.formatter.normal},{field:"content",title:__("Content"),formatter:l.api.formatter.formatHtml},{field:"images",title:__("Images"),events:i.api.events.image,formatter:i.api.formatter.images},{field:"views",title:__("Views")},{field:"like",title:__("Like")},{field:"comments",title:__("Comments")},{field:"created",title:__("created"),operate:"RANGE",addclass:"datetimerange",formatter:i.api.formatter.datetime},{field:"operate",title:__("Operate"),table:t,events:i.api.events.operate,formatter:i.api.formatter.operate}]]}),i.api.bindevent(t)},api:{formatter:{formatHtml:function(e,t,i){var a={lt:"<",gt:">",nbsp:" ",amp:"&",quot:'"'};return e.replace(/&(lt|gt|nbsp|amp|quot);/gi,function(e,t){return a[t]}).replace(/<\/?.+?>/g,"").replace(/ /g,"").substring(0,12)+"..."}},bindevent:function(){r.api.bindevent(e("form[role=form]"))}}};return l});