"use strict";define(["jquery","bootstrap","backend","table","form"],function(e,t,a,i,r){var l={index:function(){i.api.init({extend:{index_url:"flbooth/qrcode/index"+location.search,add_url:"flbooth/qrcode/add",edit_url:"flbooth/qrcode/edit",del_url:"flbooth/qrcode/del",multi_url:"flbooth/qrcode/multi",table:"flbooth_qrcode"}});var t=e("#table");t.bootstrapTable({url:e.fn.bootstrapTable.defaults.extend.index_url,pk:"id",sortName:"weigh",columns:[[{checkbox:!0},{field:"id",title:__("Id")},{field:"thumbnail_url",title:__("Thumbnail_url"),events:i.api.events.image,formatter:l.api.formatter.qrImg},{field:"name",title:__("Name")},{field:"template",title:__("Template"),searchList:{flboothqrlist001:__("Template flboothqrlist001"),flboothqr:__("Template flboothqr")},formatter:i.api.formatter.normal},{field:"canvas_width",title:__("Canvas_width")},{field:"canvas_height",title:__("Canvas_height")},{field:"thumbnail_width",title:__("Thumbnail_width")},{field:"created",title:__("created"),operate:"RANGE",addclass:"datetimerange",formatter:i.api.formatter.datetime},{field:"modified",title:__("modified"),operate:"RANGE",addclass:"datetimerange",formatter:i.api.formatter.datetime},{field:"weigh",title:__("Weigh")},{field:"status",title:__("Status"),searchList:{normal:__("Normal"),hidden:__("Hidden")},formatter:i.api.formatter.status},{field:"operate",title:__("Operate"),table:t,events:i.api.events.operate,formatter:i.api.formatter.operate}]]}),i.api.bindevent(t)},recyclebin:function(){i.api.init({extend:{dragsort_url:""}});var t=e("#table");t.bootstrapTable({url:"flbooth/qrcode/recyclebin"+location.search,pk:"id",sortName:"id",columns:[[{checkbox:!0},{field:"id",title:__("Id")},{field:"name",title:__("Name"),align:"left"},{field:"deleted",title:__("deleted"),operate:"RANGE",addclass:"datetimerange",formatter:i.api.formatter.datetime},{field:"operate",width:"130px",title:__("Operate"),table:t,events:i.api.events.operate,buttons:[{name:"Restore",text:__("Restore"),classname:"btn btn-xs btn-info btn-ajax btn-restoreit",icon:"fa fa-rotate-left",url:"flbooth/qrcode/restore",refresh:!0},{name:"Destroy",text:__("Destroy"),classname:"btn btn-xs btn-danger btn-ajax btn-destroyit",icon:"fa fa-times",url:"flbooth/qrcode/destroy",refresh:!0}],formatter:i.api.formatter.operate}]]}),i.api.bindevent(t)},add:function(){e("#c-template").change(function(){"flboothqrlist001"==e(this).val()?(e("#background").show(),e("#logo").show()):(e("#background").hide(),e("#logo").hide())}),l.api.bindevent()},edit:function(){"flboothqr"==e("#c-template").val()&&(e("#background").hide(),e("#logo").hide()),e("#c-template").change(function(){"flboothqrlist001"==e(this).val()?(e("#background").show(),e("#logo").show()):(e("#background").hide(),e("#logo").hide())}),l.api.bindevent()},api:{bindevent:function(){r.api.bindevent(e("form[role=form]"))},formatter:{qrImg:function(e,t,a){return e?'<a href="javascript:"><img class="img-sm img-center" src="'+Fast.api.cdnurl(e)+'"></a>':'<a href="javascript:"><img class="img-sm img-center" src="../../assets/addons/flbooth/img/qrcode/qrcode.png"></a>'}}}};return l});