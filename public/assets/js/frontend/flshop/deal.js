"use strict";define(["jquery","bootstrap","backend","table","form","vue"],function(e,t,i,a,r,l){return{index:function(){new l({el:"#app",data:{wahhhh:"dsfdsfsdf"},methods:{wah:function(){console.log("made")}}});a.api.init({extend:{index_url:"flshop/goods/index"+location.search,add_url:"flshop/goods/add",edit_url:"flshop/goods/edit",del_url:"flshop/goods/del",multi_url:"flshop/goods/multi",table:"flshop_goods"}});var t=e("#table");t.bootstrapTable({url:e.fn.bootstrapTable.defaults.extend.index_url,pk:"id",sortName:"weigh",columns:[[{checkbox:!0},{field:"id",title:__("Id")},{field:"shop_id",title:__("Shop_id")},{field:"shop_category_id",title:__("Shop_category_id")},{field:"category_id",title:__("Category_id")},{field:"title",title:__("Title")},{field:"image",title:__("Image"),events:a.api.events.image,formatter:a.api.formatter.image},{field:"images",title:__("Images"),events:a.api.events.image,formatter:a.api.formatter.images},{field:"description",title:__("Description")},{field:"flag",title:__("Flag"),searchList:{hot:__("Flag hot"),index:__("Flag index"),recommend:__("Flag recommend")},operate:"FIND_IN_SET",formatter:a.api.formatter.label},{field:"stock",title:__("Stock"),searchList:{porder:__("Stock porder"),payment:__("Stock payment")},formatter:a.api.formatter.normal},{field:"price",title:__("Price"),operate:"BETWEEN"},{field:"freight_id",title:__("Freight_id")},{field:"grounding",title:__("Grounding")},{field:"specs",title:__("Specs"),searchList:{single:__("Specs single"),multi:__("Specs multi")},formatter:a.api.formatter.normal},{field:"distribution",title:__("Distribution"),searchList:{true:__("Distribution true"),false:__("Distribution false")},formatter:a.api.formatter.normal},{field:"activity",title:__("Activity"),searchList:{true:__("Activity true"),false:__("Activity false")},formatter:a.api.formatter.normal},{field:"views",title:__("Views")},{field:"sales",title:__("Sales")},{field:"comment",title:__("Comment")},{field:"praise",title:__("Praise")},{field:"like",title:__("Like")},{field:"weigh",title:__("Weigh")},{field:"created",title:__("created"),operate:"RANGE",addclass:"datetimerange",formatter:a.api.formatter.datetime},{field:"modified",title:__("modified"),operate:"RANGE",addclass:"datetimerange",formatter:a.api.formatter.datetime},{field:"status",title:__("Status"),searchList:{normal:__("Normal"),hidden:__("Hidden")},formatter:a.api.formatter.status},{field:"operate",title:__("Operate"),table:t,events:a.api.events.operate,formatter:a.api.formatter.operate}]]}),a.api.bindevent(t)}}});