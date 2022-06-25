"use strict";define(["jquery","bootstrap","backend","table","form"],function(e,t,a,r,i){var n={index:function(){r.api.init({extend:{index_url:"flbooth/coupon/index"+location.search,add_url:"flbooth/coupon/add",edit_url:"flbooth/coupon/edit",del_url:"flbooth/coupon/del",multi_url:"",import_url:"",table:"flbooth_coupon"}});var t=e("#table");t.bootstrapTable({url:e.fn.bootstrapTable.defaults.extend.index_url,pk:"id",fixedColumns:!0,fixedNumber:3,fixedRightNumber:2,columns:[[{checkbox:!0},{field:"id",title:__("Id")},{field:"shop.shopname",title:__("Shop.shopname"),align:"left",operate:"LIKE"},{field:"name",title:__("Name"),align:"left",operate:"LIKE"},{field:"usenum",title:__("Usenum"),formatter:n.api.formatter.alreadygrant},{field:"type",title:__("Type"),searchList:{reduction:__("Type reduction"),discount:__("Type discount"),shipping:__("Type shipping"),vip:__("Type vip")},formatter:r.api.formatter.normal},{field:"rangetype",title:__("Rangetype"),searchList:{all:__("Rangetype all"),goods:__("Rangetype goods"),category:__("Rangetype category")},formatter:r.api.formatter.normal},{field:"limit",title:__("Limit"),operate:"BETWEEN"},{field:"id",title:__("优惠方式"),operate:!1,formatter:n.api.formatter.mode},{field:"grant",title:__("Grant"),operate:!1,formatter:n.api.formatter.grant},{field:"alreadygrant",title:__("Alreadygrant"),formatter:n.api.formatter.alreadygrant},{field:"id",title:__("有效期"),formatter:n.api.formatter.overdue},{field:"invalid",title:__("Invalid"),searchList:{0:__("正常"),1:__("已失效")},formatter:r.api.formatter.status},{field:"created",title:__("created"),operate:"RANGE",addclass:"datetimerange",formatter:r.api.formatter.datetime}]]}),r.api.bindevent(t)},recyclebin:function(){r.api.init({extend:{dragsort_url:""}});var t=e("#table");t.bootstrapTable({url:"flbooth/coupon/recyclebin"+location.search,pk:"id",sortName:"id",columns:[[{checkbox:!0},{field:"id",title:__("Id")},{field:"name",title:__("Name"),align:"left"},{field:"deleted",title:__("deleted"),operate:"RANGE",addclass:"datetimerange",formatter:r.api.formatter.datetime},{field:"operate",width:"130px",title:__("Operate"),table:t,events:r.api.events.operate,buttons:[{name:"Restore",text:__("Restore"),classname:"btn btn-xs btn-info btn-ajax btn-restoreit",icon:"fa fa-rotate-left",url:"flbooth/coupon/restore",refresh:!0},{name:"Destroy",text:__("Destroy"),classname:"btn btn-xs btn-danger btn-ajax btn-destroyit",icon:"fa fa-times",url:"flbooth/coupon/destroy",refresh:!0}],formatter:r.api.formatter.operate}]]}),r.api.bindevent(t)},api:{formatter:{mode:function(e,t,a){return"reduction"==t.type||"reduction"==t.usertype?"立减 "+t.price+" 元":"商品 "+t.price+" 折"},usenum:function(e,t,a){return 0==e?e:'<span class="label label-danger">'+e+"</span>"},alreadygrant:function(e,t,a){return 0==e?e:'<span class="label label-success">'+e+"</span>"},overdue:function(e,t,a){return"fixed"==t.pretype?t.enddate:0==t.validity?"长期有效":"领取 "+t.validity+" 天"},grant:function(e,t,a){return"-1"==e?"不限":e+" 张"}},bindevent:function(){i.api.bindevent(e("form[role=form]"))}}};return n});