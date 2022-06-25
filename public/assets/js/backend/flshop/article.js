"use strict";define(["jquery","bootstrap","backend","table","form"],function(e,t,a,i,r){var l={index:function(){i.api.init({extend:{index_url:"flbooth/article/index"+location.search,add_url:"flbooth/article/add",edit_url:"flbooth/article/edit",del_url:"flbooth/article/del",multi_url:"flbooth/article/multi",table:"flbooth_article"}});var t=e("#table");t.bootstrapTable({url:e.fn.bootstrapTable.defaults.extend.index_url,pk:"id",sortName:"weigh",columns:[[{checkbox:!0},{field:"id",title:__("Id")},{field:"category.name",title:__("Category_id"),formatter:i.api.formatter.search},{field:"category_id",title:__("类目ID"),visible:!1,operate:"in",formatter:i.api.formatter.search},{field:"title",title:__("Title")},{field:"flag",title:__("Flag"),searchList:{hot:__("Flag hot"),index:__("Flag index"),recommend:__("Flag recommend")},operate:"FIND_IN_SET",formatter:i.api.formatter.label},{field:"image",title:__("Image"),events:i.api.events.image,formatter:i.api.formatter.image},{field:"created",title:__("created"),operate:"RANGE",addclass:"datetimerange",formatter:i.api.formatter.datetime},{field:"modified",title:__("modified"),operate:"RANGE",addclass:"datetimerange",formatter:i.api.formatter.datetime},{field:"views",title:__("Views")},{field:"status",title:__("Status"),searchList:{normal:__("Normal"),hidden:__("Hidden")},formatter:i.api.formatter.status},{field:"operate",title:__("Operate"),table:t,events:i.api.events.operate,formatter:i.api.formatter.operate}]]}),i.api.bindevent(t),require(["jstree"],function(){e(document).on("click","#checkall",function(){e("#channeltree").jstree(e(this).prop("checked")?"check_all":"uncheck_all")}),e(document).on("click","#expandall",function(){e("#channeltree").jstree(e(this).prop("checked")?"open_all":"close_all")}),e("#channeltree").on("changed.jstree",function(a,i){return e(".form-horizontal input[name=category_id]").val(i.selected.join(",")),t.bootstrapTable("refresh",{}),!1}),e("#channeltree").jstree({themes:{stripes:!0},checkbox:{keep_selected_style:!1},types:{article:{icon:"fa fa-list"},link:{icon:"fa fa-link"},disabled:{check_node:!1,uncheck_node:!1}},plugins:["types","checkbox"],core:{multiple:!0,check_callback:!0,data:Config.channelList}})})},recyclebin:function(){i.api.init({extend:{dragsort_url:""}});var t=e("#table");t.bootstrapTable({url:"flbooth/article/recyclebin"+location.search,pk:"id",sortName:"id",columns:[[{checkbox:!0},{field:"id",title:__("Id")},{field:"title",title:__("Title"),align:"left"},{field:"deleted",title:__("deleted"),operate:"RANGE",addclass:"datetimerange",formatter:i.api.formatter.datetime},{field:"operate",width:"130px",title:__("Operate"),table:t,events:i.api.events.operate,buttons:[{name:"Restore",text:__("Restore"),classname:"btn btn-xs btn-info btn-ajax btn-restoreit",icon:"fa fa-rotate-left",url:"flbooth/article/restore",refresh:!0},{name:"Destroy",text:__("Destroy"),classname:"btn btn-xs btn-danger btn-ajax btn-destroyit",icon:"fa fa-times",url:"flbooth/article/destroy",refresh:!0}],formatter:i.api.formatter.operate}]]}),i.api.bindevent(t)},select:function(){i.api.init({extend:{index_url:"flbooth/article/select"}});var t=[],r=e("#table");r.on("check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table",function(a,i){"check"==a.type||"uncheck"==a.type?i=[i]:t=[],e.each(i,function(e,i){if(a.type.indexOf("uncheck")>-1){var r=t.indexOf(i.id);r>-1&&t.splice(r,1)}else-1==t.indexOf(i.id)&&t.push(i.id)})}),r.bootstrapTable({url:e.fn.bootstrapTable.defaults.extend.index_url,sortName:"id",showToggle:!1,showExport:!1,columns:[[{checkbox:!0},{field:"id",title:__("Id")},{field:"title",title:__("Title")},{field:"image",title:__("Image"),events:i.api.events.image,formatter:i.api.formatter.image},{field:"category.name",title:__("Category_id"),formatter:i.api.formatter.search},{field:"created",title:__("created"),operate:"RANGE",addclass:"datetimerange",formatter:i.api.formatter.datetime},{field:"modified",title:__("modified"),operate:"RANGE",addclass:"datetimerange",formatter:i.api.formatter.datetime},{field:"operate",title:__("Operate"),events:{"click .btn-chooseone":function(e,t,i,r){var l=a.api.query("multiple");l="true"==l,Fast.api.close({id:i.id,title:i.title,multiple:l})}},formatter:function(){return'<a href="javascript:;" class="btn btn-danger btn-chooseone btn-xs"><i class="fa fa-check"></i> '+__("Choose")+"</a>"}}]]}),e(document).on("click",".btn-choose-multi",function(){var e=a.api.query("multiple");e="true"==e,Fast.api.close({id:t.join(","),multiple:e})}),i.api.bindevent(r)},add:function(){l.api.bindevent()},edit:function(){l.api.bindevent()},api:{bindevent:function(){r.api.bindevent(e("form[role=form]"))}}};return l});