"use strict";
define(["jquery", "bootstrap", "backend", "table", "form", "vue"], function(t, e, n, a, p, s) {
	var i = {
		index: function() {
			a.api.init({
				extend: {
					index_url: "flshop/service/index" + location.search,
					add_url: "flshop/service/add",
					edit_url: "flshop/service/edit",
					del_url: "flshop/service/del",
					multi_url: "flshop/service/multi",
					table: "flshop_shop_service"
				}
			});
			var e = t("#table");
			e.bootstrapTable({
				url: t.fn.bootstrapTable.defaults.extend.index_url,
				pk: "id",
				sortName: "id",
				columns: [
					[{
						checkbox: !0
					}, {
						field: "id",
						title: __("Id")
					}, {
						field: "name",
						title: __("Name")
					}, {
						field: "description",
						title: __("Description")
					}, {
						field: "created",
						title: __("created"),
						operate: "RANGE",
						addclass: "datetimerange",
						formatter: a.api.formatter.datetime
					}, {
						field: "modified",
						title: __("modified"),
						operate: "RANGE",
						addclass: "datetimerange",
						formatter: a.api.formatter.datetime
					}, {
						field: "status",
						title: __("Status"),
						searchList: {
							normal: __("Normal"),
							hidden: __("Hidden")
						},
						formatter: a.api.formatter.status
					}, {
						field: "operate",
						title: __("Operate"),
						table: e,
						events: a.api.events.operate,
						formatter: a.api.formatter.operate
					}]
				]
			}), a.api.bindevent(e)
		},
		service: function() {
			function t(t) {
				var e = new Audio,
					n = t ? "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=6&text=" + encodeURI(t) : "";
				e.src = n, e.play()
			}
			new s({
				el: "#chatmsg",
				data: function() {
					return {
						isCount: [],
						msgList: [],
						isvoice: !0
					}
				},
				mounted: function() {
					var e = this,
						n = new WebSocket(Config.socketurl);
					n.onopen = function() {
						console.log("连接成功")
					}, n.onmessage = function(a) {
						var p = JSON.parse(a.data);
						if ("init" == p.type && Fast.api.ajax({
								url: "flshop/service/bind.html",
								data: {
									client_id: p.client_id
								}
							}, function(t, e) {
								return !1
							}), "ping" == p.type && n.send('{"type":"pong"}'), "service" == p.type) {
							e.msgList.some(function(n) {
								if (n.id == p.form.id) {
									var a = "";
									return n.created = p.created, "text" == p.message.type && (a = p.message.content.text), "img" ==
										p.message.type && (a = "[图片消息]"), "voice" == p.message.type && (a = "[语音消息]"), n.content = a, e.isCount
										.indexOf(n.id) < 0 && (n.count += 1, t("用户" + p.form.name + "发来消息：" + a)), !0
								}
							}) || e.chatList()
						}
					}, this.chatList()
				},
				methods: {
					chatList: function() {
						var t = this;
						Fast.api.ajax({
							url: "flshop/service/chatList.html"
						}, function(e, n) {
							return t.msgList = e, !1
						})
					},
					cdnurl: function(t) {
						if(t) return Fast.api.cdnurl(t)
					},
					publish: function(t) {
						var e = this;
						Fast.api.open("flshop/service/chat.html?to_id=" + t.id, "与 " + t.nickname + " 沟通", {
							area: ["750px", "600px"],
							callback: function(t) {
								e.isCount.forEach(function(n, a) {
									n == t && e.isCount.splice(a, 1)
								}), Fast.api.ajax({
									url: "flshop/service/chatEnd.html",
									data: {
										to_id: t
									}
								}, function(t, e) {
									return !1
								})
							}
						}), this.msgList.forEach(function(n, a) {
							n.id == t.id && (n.count = 0, e.isCount.indexOf(n.id) < 0 && e.isCount.push(n.id))
						})
					},
					chatTime: function(t) {
						var e = parseInt((new Date).getTime() / 1e3),
							n = e - t,
							a = ["日", "一", "二", "三", "四", "五", "六"],
							p = new Date(1e3 * t),
							s = p.getFullYear(),
							i = p.getMonth(),
							o = p.getDate(),
							r = p.getDay(),
							c = ("0" + p.getHours()).slice(-2),
							g = ("0" + p.getMinutes()).slice(-2);
						if (n < 86400) return c + ":" + g;
						if (!(n >= 86400 && n < 604800)) return n >= 604800 ? i + "月" + o + "日 " + c + ":" + g : s + "年" + i + "月" +
							o + "日 " + c + ":" + g;
						switch ((new Date).getDate() - o) {
							case 1:
								return "昨天" + c + ":" + g;
							case 2:
								return "前天" + c + ":" + g;
							default:
								return "星期" + a[r] + " " + c + ":" + g
						}
					}
				}
			})
		},
		chat: function() {
			new s({
				el: "#app",
				data: {
					user: Config.user,
					content: "",
					to_id: function(t) {
						for (var e = window.location.search.substring(1), n = e.split("&"), a = 0; a < n.length; a++) {
							var p = n[a].split("=");
							if (p[0] == t) return p[1]
						}
						return !1
					}("to_id"),
					msgList: [],
					emojiList: [],
					TabCur: "默认",
					showBox: !1,
					screenHeight: document.body.clientHeight
				},
				mounted: function() {
					var t = this;
					ws = new WebSocket(Config.socketurl), ws.onopen = function() {
						console.log("连接成功")
					}, ws.onmessage = function(e) {
						var n = JSON.parse(e.data);
						"init" == n.type && Fast.api.ajax({
							url: "flshop/service/bind.html",
							data: {
								client_id: n.client_id
							}
						}, function(t, e) {
							return !1
						}), "service" == n.type && n.form.id == t.to_id && t.onChat(n)
					}, window.onresize = function() {
						return function() {
							window.screenHeight = document.body.clientHeight, t.screenHeight = window.screenHeight
						}()
					}, this.history(), this.emojiList = this.emojiData()
				},
				watch: {
					screenHeight: function(t) {
						var e = this;
						this.timer || (this.screenHeight = t, this.timer = !0, setTimeout(function() {
							e.timer = !1
						}, 400))
					}
				},
				methods: {
					history: function() {
						var t = this;
						Fast.api.ajax({
							url: "flshop/service/history.html",
							data: {
								id: this.to_id
							}
						}, function(e, n) {
							return e.forEach(function(e) {
								"text" == e.message.type && (e.message.content.text = t.replaceEmoji(e.message.content.text))
							}), t.msgList = e, t.talk(), !1
						})
					},
					endChat: function() {
						Fast.api.close(this.to_id)
					},
					submit: function() {
						if (this.content) {
							var t = {
								text: this.content
							};
							this.sendMsg(t, "text"), this.content = ""
						}
					},
					sendMsg: function(t, e) {
						var n = {
							type: "service",
							to_id: this.to_id,
							form: {
								id: this.user.id,
								avatar: this.user.avatar,
								name: this.user.name
							},
							message: {
								type: e,
								content: t
							},
							created: parseInt((new Date).getTime() / 1e3)
						};
						this.onChat(JSON.parse(JSON.stringify(n))), this.send(n)
					},
					send: function(t) {
						Fast.api.ajax({
							url: "flshop/service/send.html",
							data: t
						}, function(t, e) {
							return !1
						})
					},
					onChat: function(t) {
						"service" == t.type && ("text" == t.message.type && this.addTextMsg(t), "voice" == t.message.type && this.addVoiceMsg(
							t), "img" == t.message.type && this.addImgMsg(t)), this.talk()
					},
					addTextMsg: function(t) {
						t.message.content.text = this.replaceEmoji(t.message.content.text), this.msgList.push(t), this.talk()
					},
					addVoiceMsg: function(t) {
						this.msgList.push(t)
					},
					addImgMsg: function(t) {
						this.msgList.push(t)
					},
					playVoice: function(t) {
						var e = new Audio;
						e.src = t, e.play()
					},
					cdnurl: function(t) {
						return Fast.api.cdnurl(t)
					},
					emojiData: function() {
						var t = [{
								phrase: "[微笑]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e3/2018new_weixioa02_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e3/2018new_weixioa02_org.png",
								value: "[微笑]",
								picid: ""
							}, {
								phrase: "[可爱]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/09/2018new_keai_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/09/2018new_keai_org.png",
								value: "[可爱]",
								picid: ""
							}, {
								phrase: "[太开心]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1e/2018new_taikaixin_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1e/2018new_taikaixin_org.png",
								value: "[太开心]",
								picid: ""
							}, {
								phrase: "[鼓掌]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6e/2018new_guzhang_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6e/2018new_guzhang_thumb.png",
								value: "[鼓掌]",
								picid: ""
							}, {
								phrase: "[嘻嘻]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/33/2018new_xixi_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/33/2018new_xixi_thumb.png",
								value: "[嘻嘻]",
								picid: ""
							}, {
								phrase: "[哈哈]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/8f/2018new_haha_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/8f/2018new_haha_thumb.png",
								value: "[哈哈]",
								picid: ""
							}, {
								phrase: "[笑cry]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/4a/2018new_xiaoku_thumb.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/4a/2018new_xiaoku_thumb.png",
								value: "[笑cry]",
								picid: ""
							}, {
								phrase: "[挤眼]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/43/2018new_jiyan_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/43/2018new_jiyan_org.png",
								value: "[挤眼]",
								picid: ""
							}, {
								phrase: "[馋嘴]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/fa/2018new_chanzui_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/fa/2018new_chanzui_org.png",
								value: "[馋嘴]",
								picid: ""
							}, {
								phrase: "[黑线]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a3/2018new_heixian_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a3/2018new_heixian_thumb.png",
								value: "[黑线]",
								picid: ""
							}, {
								phrase: "[汗]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/28/2018new_han_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/28/2018new_han_org.png",
								value: "[汗]",
								picid: ""
							}, {
								phrase: "[挖鼻]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9a/2018new_wabi_thumb.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9a/2018new_wabi_thumb.png",
								value: "[挖鼻]",
								picid: ""
							}, {
								phrase: "[哼]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7c/2018new_heng_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7c/2018new_heng_thumb.png",
								value: "[哼]",
								picid: ""
							}, {
								phrase: "[怒]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f6/2018new_nu_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f6/2018new_nu_thumb.png",
								value: "[怒]",
								picid: ""
							}, {
								phrase: "[委屈]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a5/2018new_weiqu_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a5/2018new_weiqu_thumb.png",
								value: "[委屈]",
								picid: ""
							}, {
								phrase: "[可怜]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/96/2018new_kelian_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/96/2018new_kelian_org.png",
								value: "[可怜]",
								picid: ""
							}, {
								phrase: "[失望]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/aa/2018new_shiwang_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/aa/2018new_shiwang_thumb.png",
								value: "[失望]",
								picid: ""
							}, {
								phrase: "[悲伤]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ee/2018new_beishang_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ee/2018new_beishang_org.png",
								value: "[悲伤]",
								picid: ""
							}, {
								phrase: "[泪]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6e/2018new_leimu_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6e/2018new_leimu_org.png",
								value: "[泪]",
								picid: ""
							}, {
								phrase: "[允悲]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/83/2018new_kuxiao_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/83/2018new_kuxiao_org.png",
								value: "[允悲]",
								picid: ""
							}, {
								phrase: "[害羞]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c1/2018new_haixiu_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c1/2018new_haixiu_org.png",
								value: "[害羞]",
								picid: ""
							}, {
								phrase: "[污]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/10/2018new_wu_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/10/2018new_wu_thumb.png",
								value: "[污]",
								picid: ""
							}, {
								phrase: "[爱你]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f6/2018new_aini_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f6/2018new_aini_org.png",
								value: "[爱你]",
								picid: ""
							}, {
								phrase: "[亲亲]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/2c/2018new_qinqin_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/2c/2018new_qinqin_thumb.png",
								value: "[亲亲]",
								picid: ""
							}, {
								phrase: "[色]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9d/2018new_huaxin_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9d/2018new_huaxin_org.png",
								value: "[色]",
								picid: ""
							}, {
								phrase: "[憧憬]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c9/2018new_chongjing_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c9/2018new_chongjing_org.png",
								value: "[憧憬]",
								picid: ""
							}, {
								phrase: "[舔屏]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3e/2018new_tianping_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3e/2018new_tianping_thumb.png",
								value: "[舔屏]",
								picid: ""
							}, {
								phrase: "[坏笑]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/4d/2018new_huaixiao_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/4d/2018new_huaixiao_org.png",
								value: "[坏笑]",
								picid: ""
							}, {
								phrase: "[阴险]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9e/2018new_yinxian_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9e/2018new_yinxian_org.png",
								value: "[阴险]",
								picid: ""
							}, {
								phrase: "[笑而不语]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/2d/2018new_xiaoerbuyu_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/2d/2018new_xiaoerbuyu_org.png",
								value: "[笑而不语]",
								picid: ""
							}, {
								phrase: "[偷笑]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/71/2018new_touxiao_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/71/2018new_touxiao_org.png",
								value: "[偷笑]",
								picid: ""
							}, {
								phrase: "[酷]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c4/2018new_ku_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c4/2018new_ku_org.png",
								value: "[酷]",
								picid: ""
							}, {
								phrase: "[并不简单]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/aa/2018new_bingbujiandan_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/aa/2018new_bingbujiandan_thumb.png",
								value: "[并不简单]",
								picid: ""
							}, {
								phrase: "[思考]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/30/2018new_sikao_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/30/2018new_sikao_org.png",
								value: "[思考]",
								picid: ""
							}, {
								phrase: "[疑问]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b8/2018new_ningwen_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b8/2018new_ningwen_org.png",
								value: "[疑问]",
								picid: ""
							}, {
								phrase: "[费解]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/2a/2018new_wenhao_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/2a/2018new_wenhao_thumb.png",
								value: "[费解]",
								picid: ""
							}, {
								phrase: "[晕]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/07/2018new_yun_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/07/2018new_yun_thumb.png",
								value: "[晕]",
								picid: ""
							}, {
								phrase: "[衰]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a2/2018new_shuai_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a2/2018new_shuai_thumb.png",
								value: "[衰]",
								picid: ""
							}, {
								phrase: "[骷髅]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a1/2018new_kulou_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a1/2018new_kulou_thumb.png",
								value: "[骷髅]",
								picid: ""
							}, {
								phrase: "[嘘]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b0/2018new_xu_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b0/2018new_xu_org.png",
								value: "[嘘]",
								picid: ""
							}, {
								phrase: "[闭嘴]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/62/2018new_bizui_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/62/2018new_bizui_org.png",
								value: "[闭嘴]",
								picid: ""
							}, {
								phrase: "[傻眼]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/dd/2018new_shayan_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/dd/2018new_shayan_org.png",
								value: "[傻眼]",
								picid: ""
							}, {
								phrase: "[吃惊]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/49/2018new_chijing_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/49/2018new_chijing_org.png",
								value: "[吃惊]",
								picid: ""
							}, {
								phrase: "[吐]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/08/2018new_tu_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/08/2018new_tu_org.png",
								value: "[吐]",
								picid: ""
							}, {
								phrase: "[感冒]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/2018new_kouzhao_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/2018new_kouzhao_thumb.png",
								value: "[感冒]",
								picid: ""
							}, {
								phrase: "[生病]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3b/2018new_shengbing_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3b/2018new_shengbing_thumb.png",
								value: "[生病]",
								picid: ""
							}, {
								phrase: "[拜拜]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/fd/2018new_baibai_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/fd/2018new_baibai_thumb.png",
								value: "[拜拜]",
								picid: ""
							}, {
								phrase: "[鄙视]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/da/2018new_bishi_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/da/2018new_bishi_org.png",
								value: "[鄙视]",
								picid: ""
							}, {
								phrase: "[白眼]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ef/2018new_landelini_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ef/2018new_landelini_org.png",
								value: "[白眼]",
								picid: ""
							}, {
								phrase: "[左哼哼]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/43/2018new_zuohengheng_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/43/2018new_zuohengheng_thumb.png",
								value: "[左哼哼]",
								picid: ""
							}, {
								phrase: "[右哼哼]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c1/2018new_youhengheng_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c1/2018new_youhengheng_thumb.png",
								value: "[右哼哼]",
								picid: ""
							}, {
								phrase: "[抓狂]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/17/2018new_zhuakuang_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/17/2018new_zhuakuang_org.png",
								value: "[抓狂]",
								picid: ""
							}, {
								phrase: "[怒骂]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/87/2018new_zhouma_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/87/2018new_zhouma_thumb.png",
								value: "[怒骂]",
								picid: ""
							}, {
								phrase: "[打脸]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/cb/2018new_dalian_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/cb/2018new_dalian_org.png",
								value: "[打脸]",
								picid: ""
							}, {
								phrase: "[顶]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ae/2018new_ding_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ae/2018new_ding_org.png",
								value: "[顶]",
								picid: ""
							}, {
								phrase: "[互粉]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/86/2018new_hufen02_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/86/2018new_hufen02_org.png",
								value: "[互粉]",
								picid: ""
							}, {
								phrase: "[钱]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a2/2018new_qian_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a2/2018new_qian_thumb.png",
								value: "[钱]",
								picid: ""
							}, {
								phrase: "[哈欠]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/55/2018new_dahaqian_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/55/2018new_dahaqian_org.png",
								value: "[哈欠]",
								picid: ""
							}, {
								phrase: "[困]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3c/2018new_kun_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3c/2018new_kun_thumb.png",
								value: "[困]",
								picid: ""
							}, {
								phrase: "[睡]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e2/2018new_shuijiao_thumb.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e2/2018new_shuijiao_thumb.png",
								value: "[睡]",
								picid: ""
							}, {
								phrase: "[吃瓜]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/01/2018new_chigua_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/01/2018new_chigua_thumb.png",
								value: "[吃瓜]",
								picid: ""
							}, {
								phrase: "[doge]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a1/2018new_doge02_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a1/2018new_doge02_org.png",
								value: "[doge]",
								picid: ""
							}, {
								phrase: "[二哈]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/22/2018new_erha_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/22/2018new_erha_org.png",
								value: "[二哈]",
								picid: ""
							}, {
								phrase: "[喵喵]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7b/2018new_miaomiao_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7b/2018new_miaomiao_thumb.png",
								value: "[喵喵]",
								picid: ""
							}, {
								phrase: "[赞]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e6/2018new_zan_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e6/2018new_zan_org.png",
								value: "[赞]",
								picid: ""
							}, {
								phrase: "[good]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/8a/2018new_good_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/8a/2018new_good_org.png",
								value: "[good]",
								picid: ""
							}, {
								phrase: "[ok]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/45/2018new_ok_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/45/2018new_ok_org.png",
								value: "[ok]",
								picid: ""
							}, {
								phrase: "[耶]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/29/2018new_ye_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/29/2018new_ye_thumb.png",
								value: "[耶]",
								picid: ""
							}, {
								phrase: "[握手]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e9/2018new_woshou_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e9/2018new_woshou_thumb.png",
								value: "[握手]",
								picid: ""
							}, {
								phrase: "[作揖]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e7/2018new_zuoyi_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e7/2018new_zuoyi_org.png",
								value: "[作揖]",
								picid: ""
							}, {
								phrase: "[来]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/42/2018new_guolai_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/42/2018new_guolai_thumb.png",
								value: "[来]",
								picid: ""
							}, {
								phrase: "[拳头]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/86/2018new_quantou_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/86/2018new_quantou_thumb.png",
								value: "[拳头]",
								picid: ""
							}, {
								phrase: "[点亮橙色]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f3/gongyi_dianliangchengse_org.png",
								hot: !0,
								common: !1,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f3/gongyi_dianliangchengse_thumb.png",
								value: "[点亮橙色]",
								picid: ""
							}, {
								phrase: "[人人公益节]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/35/huodong_renrengongyi_org.png",
								hot: !0,
								common: !1,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/35/huodong_renrengongyi_thumb.png",
								value: "[人人公益节]",
								picid: ""
							}, {
								phrase: "[中国赞]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6d/2018new_zhongguozan_org.png",
								hot: !0,
								common: !1,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6d/2018new_zhongguozan_org.png",
								value: "[中国赞]",
								picid: ""
							}, {
								phrase: "[锦鲤]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/94/hbf2019_jinli_org.png",
								hot: !0,
								common: !1,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/94/hbf2019_jinli_thumb.png",
								value: "[锦鲤]",
								picid: ""
							}, {
								phrase: "[抱抱]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/42/2018new_baobao_org.png",
								hot: !0,
								common: !1,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/42/2018new_baobao_thumb.png",
								value: "[抱抱]",
								picid: ""
							}, {
								phrase: "[摊手]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/62/2018new_tanshou_org.png",
								hot: !0,
								common: !1,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/62/2018new_tanshou_org.png",
								value: "[摊手]",
								picid: ""
							}, {
								phrase: "[跪了]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/75/2018new_gui_org.png",
								hot: !0,
								common: !1,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/75/2018new_gui_org.png",
								value: "[跪了]",
								picid: ""
							}, {
								phrase: "[酸]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b3/hot_wosuanle_org.png",
								hot: !0,
								common: !1,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b3/hot_wosuanle_thumb.png",
								value: "[酸]",
								picid: ""
							}, {
								phrase: "[哪吒开心]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/35/nezha_kaixin02_org.png",
								hot: !0,
								common: !1,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/35/nezha_kaixin02_thumb.png",
								value: "[哪吒开心]",
								picid: ""
							}, {
								phrase: "[冰雪奇缘艾莎]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/11/bingxueqiyuan_aisha_org.png",
								hot: !0,
								common: !1,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/11/bingxueqiyuan_aisha_thumb.png",
								value: "[冰雪奇缘艾莎]",
								picid: ""
							}, {
								phrase: "[冰雪奇缘安娜]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b3/bingxueqiyuan_anna_org.png",
								hot: !0,
								common: !1,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b3/bingxueqiyuan_anna_thumb.png",
								value: "[冰雪奇缘安娜]",
								picid: ""
							}, {
								phrase: "[冰雪奇缘雪宝]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/96/bingxueqiyuan_xuebao_org.png",
								hot: !0,
								common: !1,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/96/bingxueqiyuan_xuebao_thumb.png",
								value: "[冰雪奇缘雪宝]",
								picid: ""
							}, {
								phrase: "[心]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/8a/2018new_xin_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/8a/2018new_xin_thumb.png",
								value: "[心]",
								picid: ""
							}, {
								phrase: "[伤心]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6c/2018new_xinsui_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6c/2018new_xinsui_thumb.png",
								value: "[伤心]",
								picid: ""
							}, {
								phrase: "[鲜花]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d4/2018new_xianhua_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d4/2018new_xianhua_org.png",
								value: "[鲜花]",
								picid: ""
							}, {
								phrase: "[男孩儿]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0a/2018new_nanhai_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0a/2018new_nanhai_thumb.png",
								value: "[男孩儿]",
								picid: ""
							}, {
								phrase: "[女孩儿]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/39/2018new_nvhai_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/39/2018new_nvhai_thumb.png",
								value: "[女孩儿]",
								picid: ""
							}, {
								phrase: "[熊猫]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/aa/2018new_xiongmao_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/aa/2018new_xiongmao_thumb.png",
								value: "[熊猫]",
								picid: ""
							}, {
								phrase: "[兔子]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c6/2018new_tuzi_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c6/2018new_tuzi_thumb.png",
								value: "[兔子]",
								picid: ""
							}, {
								phrase: "[猪头]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1c/2018new_zhutou_thumb.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1c/2018new_zhutou_thumb.png",
								value: "[猪头]",
								picid: ""
							}, {
								phrase: "[草泥马]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3b/2018new_caonima_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3b/2018new_caonima_thumb.png",
								value: "[草泥马]",
								picid: ""
							}, {
								phrase: "[奥特曼]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c6/2018new_aoteman_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c6/2018new_aoteman_org.png",
								value: "[奥特曼]",
								picid: ""
							}, {
								phrase: "[太阳]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/cd/2018new_taiyang_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/cd/2018new_taiyang_org.png",
								value: "[太阳]",
								picid: ""
							}, {
								phrase: "[月亮]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d5/2018new_yueliang_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d5/2018new_yueliang_org.png",
								value: "[月亮]",
								picid: ""
							}, {
								phrase: "[浮云]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/61/2018new_yunduo_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/61/2018new_yunduo_thumb.png",
								value: "[浮云]",
								picid: ""
							}, {
								phrase: "[下雨]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7e/2018new_yu_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7e/2018new_yu_thumb.png",
								value: "[下雨]",
								picid: ""
							}, {
								phrase: "[沙尘暴]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b7/2018new_shachenbao_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b7/2018new_shachenbao_org.png",
								value: "[沙尘暴]",
								picid: ""
							}, {
								phrase: "[微风]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c7/2018new_weifeng_thumb.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c7/2018new_weifeng_thumb.png",
								value: "[微风]",
								picid: ""
							}, {
								phrase: "[围观]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6c/2018new_weiguan_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6c/2018new_weiguan_org.png",
								value: "[围观]",
								picid: ""
							}, {
								phrase: "[飞机]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/4a/2018new_feiji_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/4a/2018new_feiji_thumb.png",
								value: "[飞机]",
								picid: ""
							}, {
								phrase: "[照相机]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/78/2018new_xiangji_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/78/2018new_xiangji_thumb.png",
								value: "[照相机]",
								picid: ""
							}, {
								phrase: "[话筒]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/48/2018new_huatong_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/48/2018new_huatong_org.png",
								value: "[话筒]",
								picid: ""
							}, {
								phrase: "[蜡烛]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/16/2018new_lazhu_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/16/2018new_lazhu_org.png",
								value: "[蜡烛]",
								picid: ""
							}, {
								phrase: "[音乐]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1f/2018new_yinyue_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1f/2018new_yinyue_org.png",
								value: "[音乐]",
								picid: ""
							}, {
								phrase: "[喜]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e0/2018new_xizi_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e0/2018new_xizi_thumb.png",
								value: "[喜]",
								picid: ""
							}, {
								phrase: "[给力]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/36/2018new_geili_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/36/2018new_geili_thumb.png",
								value: "[给力]",
								picid: ""
							}, {
								phrase: "[威武]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/14/2018new_weiwu_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/14/2018new_weiwu_thumb.png",
								value: "[威武]",
								picid: ""
							}, {
								phrase: "[干杯]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/2018new_ganbei_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/2018new_ganbei_org.png",
								value: "[干杯]",
								picid: ""
							}, {
								phrase: "[蛋糕]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f9/2018new_dangao_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f9/2018new_dangao_org.png",
								value: "[蛋糕]",
								picid: ""
							}, {
								phrase: "[礼物]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0e/2018new_liwu_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0e/2018new_liwu_org.png",
								value: "[礼物]",
								picid: ""
							}, {
								phrase: "[钟]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/8e/2018new_zhong_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/8e/2018new_zhong_org.png",
								value: "[钟]",
								picid: ""
							}, {
								phrase: "[肥皂]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d6/2018new_feizao_thumb.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d6/2018new_feizao_thumb.png",
								value: "[肥皂]",
								picid: ""
							}, {
								phrase: "[绿丝带]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/cb/2018new_lvsidai_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/cb/2018new_lvsidai_thumb.png",
								value: "[绿丝带]",
								picid: ""
							}, {
								phrase: "[围脖]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/64/2018new_weibo_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/64/2018new_weibo_org.png",
								value: "[围脖]",
								picid: ""
							}, {
								phrase: "[浪]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/46/2018new_xinlang_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/46/2018new_xinlang_thumb.png",
								value: "[浪]",
								picid: ""
							}, {
								phrase: "[羞嗒嗒]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/df/lxhxiudada_org.gif",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/df/lxhxiudada_thumb.gif",
								value: "[羞嗒嗒]",
								picid: ""
							}, {
								phrase: "[好爱哦]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/74/lxhainio_org.gif",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/74/lxhainio_thumb.gif",
								value: "[好爱哦]",
								picid: ""
							}, {
								phrase: "[偷乐]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/fa/lxhtouxiao_thumb.gif",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/fa/lxhtouxiao_thumb.gif",
								value: "[偷乐]",
								picid: ""
							}, {
								phrase: "[赞啊]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/00/lxhzan_thumb.gif",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/00/lxhzan_thumb.gif",
								value: "[赞啊]",
								picid: ""
							}, {
								phrase: "[笑哈哈]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/32/lxhwahaha_org.gif",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/32/lxhwahaha_thumb.gif",
								value: "[笑哈哈]",
								picid: ""
							}, {
								phrase: "[好喜欢]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d6/lxhlike_thumb.gif",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d6/lxhlike_thumb.gif",
								value: "[好喜欢]",
								picid: ""
							}, {
								phrase: "[求关注]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ac/lxhqiuguanzhu_org.gif",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ac/lxhqiuguanzhu_thumb.gif",
								value: "[求关注]",
								picid: ""
							}, {
								phrase: "[胖丁微笑]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/68/film_pangdingsmile_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/68/film_pangdingsmile_thumb.png",
								value: "[胖丁微笑]",
								picid: ""
							}, {
								phrase: "[弱]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3d/2018new_ruo_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3d/2018new_ruo_org.png",
								value: "[弱]",
								picid: ""
							}, {
								phrase: "[NO]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1e/2018new_no_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1e/2018new_no_org.png",
								value: "[NO]",
								picid: ""
							}, {
								phrase: "[haha]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1d/2018new_hahashoushi_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1d/2018new_hahashoushi_org.png",
								value: "[haha]",
								picid: ""
							}, {
								phrase: "[加油]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9f/2018new_jiayou_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9f/2018new_jiayou_org.png",
								value: "[加油]",
								picid: ""
							}, {
								phrase: "[佩奇]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c6/hot_pigpeiqi_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c6/hot_pigpeiqi_thumb.png",
								value: "[佩奇]",
								picid: ""
							}, {
								phrase: "[大侦探皮卡丘微笑]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b3/pikaqiu_weixiao_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b3/pikaqiu_weixiao_thumb.png",
								value: "[大侦探皮卡丘微笑]",
								picid: ""
							}, {
								phrase: "[圣诞老人]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/93/xmax_oldman01_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/93/xmax_oldman01_thumb.png",
								value: "[圣诞老人]",
								picid: ""
							}, {
								phrase: "[紫金草]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e5/gongjiri_zijinhua_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e5/gongjiri_zijinhua_thumb.png",
								value: "[紫金草]",
								picid: ""
							}, {
								phrase: "[文明遛狗]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/93/gongyi_wenminglgnew_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/93/gongyi_wenminglgnew_thumb.png",
								value: "[文明遛狗]",
								picid: ""
							}, {
								phrase: "[神马]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/60/horse2_org.gif",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/60/horse2_thumb.gif",
								value: "[神马]",
								picid: ""
							}, {
								phrase: "[马到成功]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b0/mdcg_org.gif",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b0/mdcg_thumb.gif",
								value: "[马到成功]",
								picid: ""
							}, {
								phrase: "[炸鸡啤酒]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e2/zhajibeer_org.gif",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e2/zhajibeer_thumb.gif",
								value: "[炸鸡啤酒]",
								picid: ""
							}, {
								phrase: "[最右]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/be/remen_zuiyou180605_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/be/remen_zuiyou180605_thumb.png",
								value: "[最右]",
								picid: ""
							}, {
								phrase: "[织]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/41/zz2_org.gif",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/41/zz2_thumb.gif",
								value: "[织]",
								picid: ""
							}, {
								phrase: "[五仁月饼]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/10/2018zhongqiu_yuebing_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/10/2018zhongqiu_yuebing_thumb.png",
								value: "[五仁月饼]",
								picid: ""
							}, {
								phrase: "[给你小心心]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ca/qixi2018_xiaoxinxin_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ca/qixi2018_xiaoxinxin_thumb.png",
								value: "[给你小心心]",
								picid: ""
							}, {
								phrase: "[吃狗粮]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0b/qixi2018_chigouliang_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0b/qixi2018_chigouliang_thumb.png",
								value: "[吃狗粮]",
								picid: ""
							}, {
								phrase: "[弗莱见钱眼开]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/83/2018newyear_richdog_org.gif",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/83/2018newyear_richdog_thumb.gif",
								value: "[弗莱见钱眼开]",
								picid: ""
							}, {
								phrase: "[超新星全运会]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f9/huodong_starsports_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f9/huodong_starsports_thumb.png",
								value: "[超新星全运会]",
								picid: ""
							}, {
								phrase: "[看涨]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/fe/kanzhangv2_org.gif",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/fe/kanzhangv2_thumb.gif",
								value: "[看涨]",
								picid: ""
							}, {
								phrase: "[看跌]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c5/kandiev2_org.gif",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c5/kandiev2_thumb.gif",
								value: "[看跌]",
								picid: ""
							}, {
								phrase: "[带着微博去旅行]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ec/eventtravel_org.gif",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ec/eventtravel_thumb.gif",
								value: "[带着微博去旅行]",
								picid: ""
							}, {
								phrase: "[星星]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/76/hot_star171109_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/76/hot_star171109_thumb.png",
								value: "[星星]",
								picid: ""
							}, {
								phrase: "[半星]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f9/hot_halfstar_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f9/hot_halfstar_thumb.png",
								value: "[半星]",
								picid: ""
							}, {
								phrase: "[空星]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ff/hot_blankstar_org.png",
								hot: !1,
								common: !1,
								category: "其他",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ff/hot_blankstar_thumb.png",
								value: "[空星]",
								picid: ""
							}, {
								phrase: "[小黄人微笑]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f0/xhrnew_weixiao_org.png",
								hot: !1,
								common: !1,
								category: "小黄人",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f0/xhrnew_weixiao_org.png",
								value: "[小黄人微笑]",
								picid: ""
							}, {
								phrase: "[小黄人剪刀手]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/63/xhrnew_jiandaoshou_org.png",
								hot: !1,
								common: !1,
								category: "小黄人",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/63/xhrnew_jiandaoshou_org.png",
								value: "[小黄人剪刀手]",
								picid: ""
							}, {
								phrase: "[小黄人不屑]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b2/xhrnew_buxie_org.png",
								hot: !1,
								common: !1,
								category: "小黄人",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b2/xhrnew_buxie_org.png",
								value: "[小黄人不屑]",
								picid: ""
							}, {
								phrase: "[小黄人高兴]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/41/xhrnew_gaoxing_org.png",
								hot: !1,
								common: !1,
								category: "小黄人",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/41/xhrnew_gaoxing_org.png",
								value: "[小黄人高兴]",
								picid: ""
							}, {
								phrase: "[小黄人惊讶]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/fd/xhrnew_jingya_thumb.png",
								hot: !1,
								common: !1,
								category: "小黄人",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/fd/xhrnew_jingya_thumb.png",
								value: "[小黄人惊讶]",
								picid: ""
							}, {
								phrase: "[小黄人委屈]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/79/xhrnew_weiqu_org.png",
								hot: !1,
								common: !1,
								category: "小黄人",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/79/xhrnew_weiqu_org.png",
								value: "[小黄人委屈]",
								picid: ""
							}, {
								phrase: "[小黄人坏笑]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/be/xhrnew_huaixiao_thumb.png",
								hot: !1,
								common: !1,
								category: "小黄人",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/be/xhrnew_huaixiao_thumb.png",
								value: "[小黄人坏笑]",
								picid: ""
							}, {
								phrase: "[小黄人白眼]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e2/xhrnew_baiyan_org.png",
								hot: !1,
								common: !1,
								category: "小黄人",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e2/xhrnew_baiyan_org.png",
								value: "[小黄人白眼]",
								picid: ""
							}, {
								phrase: "[小黄人无奈]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/15/xhrnew_wunai_org.png",
								hot: !1,
								common: !1,
								category: "小黄人",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/15/xhrnew_wunai_thumb.png",
								value: "[小黄人无奈]",
								picid: ""
							}, {
								phrase: "[小黄人得意]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c8/xhrnew_deyi_org.png",
								hot: !1,
								common: !1,
								category: "小黄人",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c8/xhrnew_deyi_thumb.png",
								value: "[小黄人得意]",
								picid: ""
							}, {
								phrase: "[钢铁侠]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/27/avengers_ironman01_org.png",
								hot: !1,
								common: !1,
								category: "复仇者联盟",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/27/avengers_ironman01_thumb.png",
								value: "[钢铁侠]",
								picid: ""
							}, {
								phrase: "[美国队长]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d8/avengers_captain01_org.png",
								hot: !1,
								common: !1,
								category: "复仇者联盟",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d8/avengers_captain01_thumb.png",
								value: "[美国队长]",
								picid: ""
							}, {
								phrase: "[雷神]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3c/avengers_thor01_org.png",
								hot: !1,
								common: !1,
								category: "复仇者联盟",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3c/avengers_thor01_thumb.png",
								value: "[雷神]",
								picid: ""
							}, {
								phrase: "[浩克]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/44/avengers_hulk01_org.png",
								hot: !1,
								common: !1,
								category: "复仇者联盟",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/44/avengers_hulk01_thumb.png",
								value: "[浩克]",
								picid: ""
							}, {
								phrase: "[黑寡妇]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0e/avengers_blackwidow01_org.png",
								hot: !1,
								common: !1,
								category: "复仇者联盟",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0e/avengers_blackwidow01_thumb.png",
								value: "[黑寡妇]",
								picid: ""
							}, {
								phrase: "[鹰眼]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/93/avengers_clint01_org.png",
								hot: !1,
								common: !1,
								category: "复仇者联盟",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/93/avengers_clint01_thumb.png",
								value: "[鹰眼]",
								picid: ""
							}, {
								phrase: "[惊奇队长]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/44/avengers_captainmarvel01_org.png",
								hot: !1,
								common: !1,
								category: "复仇者联盟",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/44/avengers_captainmarvel01_thumb.png",
								value: "[惊奇队长]",
								picid: ""
							}, {
								phrase: "[奥克耶]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/62/avengers_aokeye01_org.png",
								hot: !1,
								common: !1,
								category: "复仇者联盟",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/62/avengers_aokeye01_thumb.png",
								value: "[奥克耶]",
								picid: ""
							}, {
								phrase: "[蚁人]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/cc/avengers_antman01_org.png",
								hot: !1,
								common: !1,
								category: "复仇者联盟",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/cc/avengers_antman01_thumb.png",
								value: "[蚁人]",
								picid: ""
							}, {
								phrase: "[灭霸]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ce/avengers_thanos01_org.png",
								hot: !1,
								common: !1,
								category: "复仇者联盟",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ce/avengers_thanos01_thumb.png",
								value: "[灭霸]",
								picid: ""
							}, {
								phrase: "[蜘蛛侠]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e2/avengers_spiderman01_org.png",
								hot: !1,
								common: !1,
								category: "复仇者联盟",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e2/avengers_spiderman01_thumb.png",
								value: "[蜘蛛侠]",
								picid: ""
							}, {
								phrase: "[洛基]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1f/avengers_locki01_org.png",
								hot: !1,
								common: !1,
								category: "复仇者联盟",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1f/avengers_locki01_thumb.png",
								value: "[洛基]",
								picid: ""
							}, {
								phrase: "[奇异博士]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9c/avengers_drstranger01_org.png",
								hot: !1,
								common: !1,
								category: "复仇者联盟",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9c/avengers_drstranger01_thumb.png",
								value: "[奇异博士]",
								picid: ""
							}, {
								phrase: "[冬兵]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/91/avengers_wintersolider01_org.png",
								hot: !1,
								common: !1,
								category: "复仇者联盟",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/91/avengers_wintersolider01_thumb.png",
								value: "[冬兵]",
								picid: ""
							}, {
								phrase: "[黑豹]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/86/avengers_panther01_org.png",
								hot: !1,
								common: !1,
								category: "复仇者联盟",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/86/avengers_panther01_thumb.png",
								value: "[黑豹]",
								picid: ""
							}, {
								phrase: "[猩红女巫]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a9/avengers_witch01_org.png",
								hot: !1,
								common: !1,
								category: "复仇者联盟",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a9/avengers_witch01_thumb.png",
								value: "[猩红女巫]",
								picid: ""
							}, {
								phrase: "[幻视]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/07/avengers_vision01_org.png",
								hot: !1,
								common: !1,
								category: "复仇者联盟",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/07/avengers_vision01_thumb.png",
								value: "[幻视]",
								picid: ""
							}, {
								phrase: "[星爵]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/35/avengers_starlord01_org.png",
								hot: !1,
								common: !1,
								category: "复仇者联盟",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/35/avengers_starlord01_thumb.png",
								value: "[星爵]",
								picid: ""
							}, {
								phrase: "[格鲁特]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7a/avengers_gelute01_org.png",
								hot: !1,
								common: !1,
								category: "复仇者联盟",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7a/avengers_gelute01_thumb.png",
								value: "[格鲁特]",
								picid: ""
							}, {
								phrase: "[螳螂妹]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7c/avengers_mantis01_org.png",
								hot: !1,
								common: !1,
								category: "复仇者联盟",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7c/avengers_mantis01_thumb.png",
								value: "[螳螂妹]",
								picid: ""
							}, {
								phrase: "[无限手套]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/38/avengers_gauntlet01_org.png",
								hot: !1,
								common: !1,
								category: "复仇者联盟",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/38/avengers_gauntlet01_thumb.png",
								value: "[无限手套]",
								picid: ""
							}, {
								phrase: "[大毛略略]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d0/yunying_damaoluelue_org.png",
								hot: !1,
								common: !1,
								category: "雪人奇缘",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d0/yunying_damaoluelue_thumb.png",
								value: "[大毛略略]",
								picid: ""
							}, {
								phrase: "[大毛惊讶]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/4d/yunying_damaojingya_org.png",
								hot: !1,
								common: !1,
								category: "雪人奇缘",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/4d/yunying_damaojingya_thumb.png",
								value: "[大毛惊讶]",
								picid: ""
							}, {
								phrase: "[大毛微笑]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/da/yunying_damaoweixiao_org.png",
								hot: !1,
								common: !1,
								category: "雪人奇缘",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/da/yunying_damaoweixiao_thumb.png",
								value: "[大毛微笑]",
								picid: ""
							}],
							e = {},
							n = [],
							a = {};
						return t.forEach(function(t) {
							var p = t.category.length > 0 ? t.category : "默认";
							e[p] || (e[p] = [], n.push(p)), e[p].push(t), a[t.phrase] = t.icon
						}), {
							groups: e,
							categories: n,
							map: a
						}
					},
					replaceEmoji: function(t) {
						var e = this;
						return t.replace(/\[([^(\]|\[)]*)\]/g, function(t, n) {
							return '<img src="' + e.emojiList.map[t] + '" width="18rpx">'
						}).replace(/(\r\n)|(\n)/g, "<br>")
					},
					tabSelect: function(t) {
						this.TabCur = t.currentTarget.dataset.id
					},
					addEmoji: function(t) {
						this.content += t
					},
					toggleBox: function() {
						this.showBox = !this.showBox
					},
					chatTime: function(t) {
						var e = parseInt((new Date).getTime() / 1e3),
							n = e - t,
							a = ["日", "一", "二", "三", "四", "五", "六"],
							p = new Date(1e3 * t),
							s = p.getFullYear(),
							i = p.getMonth(),
							o = p.getDate(),
							r = p.getDay(),
							c = ("0" + p.getHours()).slice(-2),
							g = ("0" + p.getMinutes()).slice(-2);
						if (n < 86400) return c + ":" + g;
						if (!(n >= 86400 && n < 604800)) return n >= 604800 ? i + "月" + o + "日 " + c + ":" + g : s + "年" + i + "月" +
							o + "日 " + c + ":" + g;
						switch ((new Date).getDate() - o) {
							case 1:
								return "昨天" + c + ":" + g;
							case 2:
								return "前天" + c + ":" + g;
							default:
								return "星期" + a[r] + " " + c + ":" + g
						}
					},
					talk: function() {
						this.$nextTick(function() {
							var t = document.getElementById("talk");
							t.scrollTop = t.scrollHeight
						})
					}
				}
			})
		},
		recyclebin: function() {
			a.api.init({
				extend: {
					dragsort_url: ""
				}
			});
			var e = t("#table");
			e.bootstrapTable({
				url: "flshop/service/recyclebin" + location.search,
				pk: "id",
				sortName: "id",
				columns: [
					[{
						checkbox: !0
					}, {
						field: "id",
						title: __("Id")
					}, {
						field: "name",
						title: __("Name"),
						align: "left"
					}, {
						field: "deleted",
						title: __("deleted"),
						operate: "RANGE",
						addclass: "datetimerange",
						formatter: a.api.formatter.datetime
					}, {
						field: "operate",
						width: "130px",
						title: __("Operate"),
						table: e,
						events: a.api.events.operate,
						buttons: [{
							name: "Restore",
							text: __("Restore"),
							classname: "btn btn-xs btn-info btn-ajax btn-restoreit",
							icon: "fa fa-rotate-left",
							url: "flshop/service/restore",
							refresh: !0
						}, {
							name: "Destroy",
							text: __("Destroy"),
							classname: "btn btn-xs btn-danger btn-ajax btn-destroyit",
							icon: "fa fa-times",
							url: "flshop/service/destroy",
							refresh: !0
						}],
						formatter: a.api.formatter.operate
					}]
				]
			}), a.api.bindevent(e)
		},
		add: function() {
			i.api.bindevent()
		},
		edit: function() {
			i.api.bindevent()
		},
		api: {
			bindevent: function() {
				p.api.bindevent(t("form[role=form]"))
			}
		}
	};
	return i
});
