"use strict";define(["jquery","bootstrap","backend","form","table"],function(e,t,a,i,r){var l={select:function(){r.api.init({extend:{index_url:"flbooth/attachment/select"}});var t=[],i=e("#table");i.on("check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table",function(a,i){"check"==a.type||"uncheck"==a.type?i=[i]:t=[],e.each(i,function(e,i){if(a.type.indexOf("uncheck")>-1){var r=t.indexOf(i.url);r>-1&&t.splice(r,1)}else-1==t.indexOf(i.url)&&t.push(i.url)})}),i.bootstrapTable({url:e.fn.bootstrapTable.defaults.extend.index_url,sortName:"id",showToggle:!1,showExport:!1,columns:[[{field:"state",checkbox:!0},{field:"id",title:__("Id")},{field:"admin_id",title:__("Admin_id"),formatter:r.api.formatter.search,visible:!1},{field:"user_id",title:__("User_id"),formatter:r.api.formatter.search,visible:!1},{field:"url",title:__("Preview"),formatter:l.api.formatter.thumb,operate:!1},{field:"imagewidth",title:__("Imagewidth"),operate:!1},{field:"imageheight",title:__("Imageheight"),operate:!1},{field:"mime_type",title:__("mime_type"),operate:"LIKE %...%",process:function(e,t){return e.replace(/\*/g,"%")}},{field:"created",title:__("created"),formatter:r.api.formatter.datetime,operate:"RANGE",addclass:"datetimerange",sortable:!0},{field:"operate",title:__("Operate"),events:{"click .btn-chooseone":function(e,t,i,r){var l=a.api.query("multiple");l="true"==l,Fast.api.close({url:i.url,multiple:l})}},formatter:function(){return'<a href="javascript:;" class="btn btn-danger btn-chooseone btn-xs"><i class="fa fa-check"></i> '+__("Choose")+"</a>"}}]]}),e(document).on("click",".btn-choose-multi",function(){var e=a.api.query("multiple");e="true"==e,Fast.api.close({url:t.join(","),multiple:e})}),r.api.bindevent(i),require(["upload"],function(t){t.api.plupload(e("#toolbar .plupload"),function(){e(".btn-refresh").trigger("click")})})},api:{bindevent:function(){i.api.bindevent(e("form[role=form]"))},formatter:{thumb:function(e,t,a){if(t.mime_type.indexOf("image")>-1){var i="upyun"==t.storage?"!/fwfh/120x90":"";return'<a href="'+t.fullurl+'" target="_blank"><img src="'+t.fullurl+i+'" alt="" style="max-height:90px;max-width:120px"></a>'}return'<a href="'+t.fullurl+'" target="_blank"><img src="https://tool.fastadmin.net/icon/'+t.image_type+'.png" alt=""></a>'},url:function(e,t,a){return'<a href="'+t.fullurl+'" target="_blank" class="label bg-green">'+e+"</a>"}}}};return l});