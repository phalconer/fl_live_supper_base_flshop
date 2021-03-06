"use strict";
define(["jquery", "bootstrap", "backend", "table", "form", "vue"], function(t, e, n, a, p, s) {
	var i = {
		index: function() {
			a.api.init({
				extend: {
					index_url: "flbooth/service/index" + location.search,
					add_url: "flbooth/service/add",
					edit_url: "flbooth/service/edit",
					del_url: "flbooth/service/del",
					multi_url: "flbooth/service/multi",
					table: "flbooth_shop_service"
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
						console.log("θΏζ₯ζε")
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
										p.message.type && (a = "[εΎηζΆζ―]"), "voice" == p.message.type && (a = "[θ―­ι³ζΆζ―]"), n.content = a, e.isCount
										.indexOf(n.id) < 0 && (n.count += 1, t("η¨ζ·" + p.form.name + "εζ₯ζΆζ―οΌ" + a)), !0
								}
							}) || e.chatList()
						}
					}, this.chatList()
				},
				methods: {
					chatList: function() {
						var t = this;
						Fast.api.ajax({
							url: "flbooth/service/chatList.html"
						}, function(e, n) {
							return t.msgList = e, !1
						})
					},
					cdnurl: function(t) {
						if(t) return Fast.api.cdnurl(t)
					},
					publish: function(t) {
						var e = this;
						Fast.api.open("flbooth/service/chat.html?to_id=" + t.id, "δΈ " + t.nickname + " ζ²ι", {
							area: ["750px", "600px"],
							callback: function(t) {
								e.isCount.forEach(function(n, a) {
									n == t && e.isCount.splice(a, 1)
								}), Fast.api.ajax({
									url: "flbooth/service/chatEnd.html",
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
							a = ["ζ₯", "δΈ", "δΊ", "δΈ", "ε", "δΊ", "ε­"],
							p = new Date(1e3 * t),
							s = p.getFullYear(),
							i = p.getMonth(),
							o = p.getDate(),
							r = p.getDay(),
							c = ("0" + p.getHours()).slice(-2),
							g = ("0" + p.getMinutes()).slice(-2);
						if (n < 86400) return c + ":" + g;
						if (!(n >= 86400 && n < 604800)) return n >= 604800 ? i + "ζ" + o + "ζ₯ " + c + ":" + g : s + "εΉ΄" + i + "ζ" +
							o + "ζ₯ " + c + ":" + g;
						switch ((new Date).getDate() - o) {
							case 1:
								return "ζ¨ε€©" + c + ":" + g;
							case 2:
								return "εε€©" + c + ":" + g;
							default:
								return "ζζ" + a[r] + " " + c + ":" + g
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
					TabCur: "ι»θ?€",
					showBox: !1,
					screenHeight: document.body.clientHeight
				},
				mounted: function() {
					var t = this;
					ws = new WebSocket(Config.socketurl), ws.onopen = function() {
						console.log("θΏζ₯ζε")
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
								phrase: "[εΎ?η¬]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e3/2018new_weixioa02_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e3/2018new_weixioa02_org.png",
								value: "[εΎ?η¬]",
								picid: ""
							}, {
								phrase: "[ε―η±]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/09/2018new_keai_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/09/2018new_keai_org.png",
								value: "[ε―η±]",
								picid: ""
							}, {
								phrase: "[ε€ͺεΌεΏ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1e/2018new_taikaixin_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1e/2018new_taikaixin_org.png",
								value: "[ε€ͺεΌεΏ]",
								picid: ""
							}, {
								phrase: "[ιΌζ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6e/2018new_guzhang_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6e/2018new_guzhang_thumb.png",
								value: "[ιΌζ]",
								picid: ""
							}, {
								phrase: "[ε»ε»]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/33/2018new_xixi_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/33/2018new_xixi_thumb.png",
								value: "[ε»ε»]",
								picid: ""
							}, {
								phrase: "[εε]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/8f/2018new_haha_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/8f/2018new_haha_thumb.png",
								value: "[εε]",
								picid: ""
							}, {
								phrase: "[η¬cry]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/4a/2018new_xiaoku_thumb.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/4a/2018new_xiaoku_thumb.png",
								value: "[η¬cry]",
								picid: ""
							}, {
								phrase: "[ζ€ηΌ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/43/2018new_jiyan_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/43/2018new_jiyan_org.png",
								value: "[ζ€ηΌ]",
								picid: ""
							}, {
								phrase: "[ι¦ε΄]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/fa/2018new_chanzui_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/fa/2018new_chanzui_org.png",
								value: "[ι¦ε΄]",
								picid: ""
							}, {
								phrase: "[ι»ηΊΏ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a3/2018new_heixian_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a3/2018new_heixian_thumb.png",
								value: "[ι»ηΊΏ]",
								picid: ""
							}, {
								phrase: "[ζ±]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/28/2018new_han_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/28/2018new_han_org.png",
								value: "[ζ±]",
								picid: ""
							}, {
								phrase: "[ζιΌ»]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9a/2018new_wabi_thumb.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9a/2018new_wabi_thumb.png",
								value: "[ζιΌ»]",
								picid: ""
							}, {
								phrase: "[εΌ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7c/2018new_heng_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7c/2018new_heng_thumb.png",
								value: "[εΌ]",
								picid: ""
							}, {
								phrase: "[ζ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f6/2018new_nu_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f6/2018new_nu_thumb.png",
								value: "[ζ]",
								picid: ""
							}, {
								phrase: "[ε§ε±]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a5/2018new_weiqu_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a5/2018new_weiqu_thumb.png",
								value: "[ε§ε±]",
								picid: ""
							}, {
								phrase: "[ε―ζ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/96/2018new_kelian_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/96/2018new_kelian_org.png",
								value: "[ε―ζ]",
								picid: ""
							}, {
								phrase: "[ε€±ζ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/aa/2018new_shiwang_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/aa/2018new_shiwang_thumb.png",
								value: "[ε€±ζ]",
								picid: ""
							}, {
								phrase: "[ζ²δΌ€]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ee/2018new_beishang_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ee/2018new_beishang_org.png",
								value: "[ζ²δΌ€]",
								picid: ""
							}, {
								phrase: "[ζ³ͺ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6e/2018new_leimu_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6e/2018new_leimu_org.png",
								value: "[ζ³ͺ]",
								picid: ""
							}, {
								phrase: "[εζ²]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/83/2018new_kuxiao_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/83/2018new_kuxiao_org.png",
								value: "[εζ²]",
								picid: ""
							}, {
								phrase: "[ε?³ηΎ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c1/2018new_haixiu_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c1/2018new_haixiu_org.png",
								value: "[ε?³ηΎ]",
								picid: ""
							}, {
								phrase: "[ζ±‘]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/10/2018new_wu_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/10/2018new_wu_thumb.png",
								value: "[ζ±‘]",
								picid: ""
							}, {
								phrase: "[η±δ½ ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f6/2018new_aini_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f6/2018new_aini_org.png",
								value: "[η±δ½ ]",
								picid: ""
							}, {
								phrase: "[δΊ²δΊ²]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/2c/2018new_qinqin_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/2c/2018new_qinqin_thumb.png",
								value: "[δΊ²δΊ²]",
								picid: ""
							}, {
								phrase: "[θ²]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9d/2018new_huaxin_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9d/2018new_huaxin_org.png",
								value: "[θ²]",
								picid: ""
							}, {
								phrase: "[ζ§ζ¬]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c9/2018new_chongjing_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c9/2018new_chongjing_org.png",
								value: "[ζ§ζ¬]",
								picid: ""
							}, {
								phrase: "[θε±]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3e/2018new_tianping_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3e/2018new_tianping_thumb.png",
								value: "[θε±]",
								picid: ""
							}, {
								phrase: "[εη¬]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/4d/2018new_huaixiao_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/4d/2018new_huaixiao_org.png",
								value: "[εη¬]",
								picid: ""
							}, {
								phrase: "[ι΄ι©]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9e/2018new_yinxian_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9e/2018new_yinxian_org.png",
								value: "[ι΄ι©]",
								picid: ""
							}, {
								phrase: "[η¬θδΈθ―­]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/2d/2018new_xiaoerbuyu_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/2d/2018new_xiaoerbuyu_org.png",
								value: "[η¬θδΈθ―­]",
								picid: ""
							}, {
								phrase: "[ε·η¬]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/71/2018new_touxiao_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/71/2018new_touxiao_org.png",
								value: "[ε·η¬]",
								picid: ""
							}, {
								phrase: "[ι·]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c4/2018new_ku_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c4/2018new_ku_org.png",
								value: "[ι·]",
								picid: ""
							}, {
								phrase: "[εΉΆδΈη?ε]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/aa/2018new_bingbujiandan_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/aa/2018new_bingbujiandan_thumb.png",
								value: "[εΉΆδΈη?ε]",
								picid: ""
							}, {
								phrase: "[ζθ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/30/2018new_sikao_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/30/2018new_sikao_org.png",
								value: "[ζθ]",
								picid: ""
							}, {
								phrase: "[ηι?]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b8/2018new_ningwen_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b8/2018new_ningwen_org.png",
								value: "[ηι?]",
								picid: ""
							}, {
								phrase: "[θ΄Ήθ§£]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/2a/2018new_wenhao_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/2a/2018new_wenhao_thumb.png",
								value: "[θ΄Ήθ§£]",
								picid: ""
							}, {
								phrase: "[ζ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/07/2018new_yun_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/07/2018new_yun_thumb.png",
								value: "[ζ]",
								picid: ""
							}, {
								phrase: "[θ‘°]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a2/2018new_shuai_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a2/2018new_shuai_thumb.png",
								value: "[θ‘°]",
								picid: ""
							}, {
								phrase: "[ιͺ·ι«]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a1/2018new_kulou_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a1/2018new_kulou_thumb.png",
								value: "[ιͺ·ι«]",
								picid: ""
							}, {
								phrase: "[ε]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b0/2018new_xu_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b0/2018new_xu_org.png",
								value: "[ε]",
								picid: ""
							}, {
								phrase: "[ι­ε΄]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/62/2018new_bizui_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/62/2018new_bizui_org.png",
								value: "[ι­ε΄]",
								picid: ""
							}, {
								phrase: "[ε»ηΌ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/dd/2018new_shayan_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/dd/2018new_shayan_org.png",
								value: "[ε»ηΌ]",
								picid: ""
							}, {
								phrase: "[εζ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/49/2018new_chijing_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/49/2018new_chijing_org.png",
								value: "[εζ]",
								picid: ""
							}, {
								phrase: "[ε]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/08/2018new_tu_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/08/2018new_tu_org.png",
								value: "[ε]",
								picid: ""
							}, {
								phrase: "[ζε]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/2018new_kouzhao_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/2018new_kouzhao_thumb.png",
								value: "[ζε]",
								picid: ""
							}, {
								phrase: "[ηη]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3b/2018new_shengbing_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3b/2018new_shengbing_thumb.png",
								value: "[ηη]",
								picid: ""
							}, {
								phrase: "[ζζ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/fd/2018new_baibai_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/fd/2018new_baibai_thumb.png",
								value: "[ζζ]",
								picid: ""
							}, {
								phrase: "[ιθ§]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/da/2018new_bishi_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/da/2018new_bishi_org.png",
								value: "[ιθ§]",
								picid: ""
							}, {
								phrase: "[η½ηΌ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ef/2018new_landelini_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ef/2018new_landelini_org.png",
								value: "[η½ηΌ]",
								picid: ""
							}, {
								phrase: "[ε·¦εΌεΌ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/43/2018new_zuohengheng_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/43/2018new_zuohengheng_thumb.png",
								value: "[ε·¦εΌεΌ]",
								picid: ""
							}, {
								phrase: "[ε³εΌεΌ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c1/2018new_youhengheng_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c1/2018new_youhengheng_thumb.png",
								value: "[ε³εΌεΌ]",
								picid: ""
							}, {
								phrase: "[ζη]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/17/2018new_zhuakuang_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/17/2018new_zhuakuang_org.png",
								value: "[ζη]",
								picid: ""
							}, {
								phrase: "[ζιͺ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/87/2018new_zhouma_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/87/2018new_zhouma_thumb.png",
								value: "[ζιͺ]",
								picid: ""
							}, {
								phrase: "[ζθΈ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/cb/2018new_dalian_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/cb/2018new_dalian_org.png",
								value: "[ζθΈ]",
								picid: ""
							}, {
								phrase: "[ι‘Ά]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ae/2018new_ding_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ae/2018new_ding_org.png",
								value: "[ι‘Ά]",
								picid: ""
							}, {
								phrase: "[δΊη²]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/86/2018new_hufen02_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/86/2018new_hufen02_org.png",
								value: "[δΊη²]",
								picid: ""
							}, {
								phrase: "[ι±]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a2/2018new_qian_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a2/2018new_qian_thumb.png",
								value: "[ι±]",
								picid: ""
							}, {
								phrase: "[εζ¬ ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/55/2018new_dahaqian_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/55/2018new_dahaqian_org.png",
								value: "[εζ¬ ]",
								picid: ""
							}, {
								phrase: "[ε°]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3c/2018new_kun_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3c/2018new_kun_thumb.png",
								value: "[ε°]",
								picid: ""
							}, {
								phrase: "[η‘]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e2/2018new_shuijiao_thumb.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e2/2018new_shuijiao_thumb.png",
								value: "[η‘]",
								picid: ""
							}, {
								phrase: "[εη]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/01/2018new_chigua_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/01/2018new_chigua_thumb.png",
								value: "[εη]",
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
								phrase: "[δΊε]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/22/2018new_erha_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/22/2018new_erha_org.png",
								value: "[δΊε]",
								picid: ""
							}, {
								phrase: "[ε΅ε΅]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7b/2018new_miaomiao_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7b/2018new_miaomiao_thumb.png",
								value: "[ε΅ε΅]",
								picid: ""
							}, {
								phrase: "[θ΅]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e6/2018new_zan_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e6/2018new_zan_org.png",
								value: "[θ΅]",
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
								phrase: "[θΆ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/29/2018new_ye_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/29/2018new_ye_thumb.png",
								value: "[θΆ]",
								picid: ""
							}, {
								phrase: "[ζ‘ζ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e9/2018new_woshou_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e9/2018new_woshou_thumb.png",
								value: "[ζ‘ζ]",
								picid: ""
							}, {
								phrase: "[δ½ζ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e7/2018new_zuoyi_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e7/2018new_zuoyi_org.png",
								value: "[δ½ζ]",
								picid: ""
							}, {
								phrase: "[ζ₯]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/42/2018new_guolai_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/42/2018new_guolai_thumb.png",
								value: "[ζ₯]",
								picid: ""
							}, {
								phrase: "[ζ³ε€΄]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/86/2018new_quantou_org.png",
								hot: !1,
								common: !0,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/86/2018new_quantou_thumb.png",
								value: "[ζ³ε€΄]",
								picid: ""
							}, {
								phrase: "[ηΉδΊ?ζ©θ²]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f3/gongyi_dianliangchengse_org.png",
								hot: !0,
								common: !1,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f3/gongyi_dianliangchengse_thumb.png",
								value: "[ηΉδΊ?ζ©θ²]",
								picid: ""
							}, {
								phrase: "[δΊΊδΊΊε¬ηθ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/35/huodong_renrengongyi_org.png",
								hot: !0,
								common: !1,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/35/huodong_renrengongyi_thumb.png",
								value: "[δΊΊδΊΊε¬ηθ]",
								picid: ""
							}, {
								phrase: "[δΈ­ε½θ΅]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6d/2018new_zhongguozan_org.png",
								hot: !0,
								common: !1,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6d/2018new_zhongguozan_org.png",
								value: "[δΈ­ε½θ΅]",
								picid: ""
							}, {
								phrase: "[ι¦ι²€]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/94/hbf2019_jinli_org.png",
								hot: !0,
								common: !1,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/94/hbf2019_jinli_thumb.png",
								value: "[ι¦ι²€]",
								picid: ""
							}, {
								phrase: "[ζ±ζ±]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/42/2018new_baobao_org.png",
								hot: !0,
								common: !1,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/42/2018new_baobao_thumb.png",
								value: "[ζ±ζ±]",
								picid: ""
							}, {
								phrase: "[ζζ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/62/2018new_tanshou_org.png",
								hot: !0,
								common: !1,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/62/2018new_tanshou_org.png",
								value: "[ζζ]",
								picid: ""
							}, {
								phrase: "[θ·ͺδΊ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/75/2018new_gui_org.png",
								hot: !0,
								common: !1,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/75/2018new_gui_org.png",
								value: "[θ·ͺδΊ]",
								picid: ""
							}, {
								phrase: "[ιΈ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b3/hot_wosuanle_org.png",
								hot: !0,
								common: !1,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b3/hot_wosuanle_thumb.png",
								value: "[ιΈ]",
								picid: ""
							}, {
								phrase: "[εͺεεΌεΏ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/35/nezha_kaixin02_org.png",
								hot: !0,
								common: !1,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/35/nezha_kaixin02_thumb.png",
								value: "[εͺεεΌεΏ]",
								picid: ""
							}, {
								phrase: "[ε°ιͺε₯ηΌθΎθ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/11/bingxueqiyuan_aisha_org.png",
								hot: !0,
								common: !1,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/11/bingxueqiyuan_aisha_thumb.png",
								value: "[ε°ιͺε₯ηΌθΎθ]",
								picid: ""
							}, {
								phrase: "[ε°ιͺε₯ηΌε?ε¨]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b3/bingxueqiyuan_anna_org.png",
								hot: !0,
								common: !1,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b3/bingxueqiyuan_anna_thumb.png",
								value: "[ε°ιͺε₯ηΌε?ε¨]",
								picid: ""
							}, {
								phrase: "[ε°ιͺε₯ηΌιͺε?]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/96/bingxueqiyuan_xuebao_org.png",
								hot: !0,
								common: !1,
								category: "",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/96/bingxueqiyuan_xuebao_thumb.png",
								value: "[ε°ιͺε₯ηΌιͺε?]",
								picid: ""
							}, {
								phrase: "[εΏ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/8a/2018new_xin_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/8a/2018new_xin_thumb.png",
								value: "[εΏ]",
								picid: ""
							}, {
								phrase: "[δΌ€εΏ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6c/2018new_xinsui_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6c/2018new_xinsui_thumb.png",
								value: "[δΌ€εΏ]",
								picid: ""
							}, {
								phrase: "[ι²θ±]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d4/2018new_xianhua_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d4/2018new_xianhua_org.png",
								value: "[ι²θ±]",
								picid: ""
							}, {
								phrase: "[η·ε­©εΏ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0a/2018new_nanhai_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0a/2018new_nanhai_thumb.png",
								value: "[η·ε­©εΏ]",
								picid: ""
							}, {
								phrase: "[ε₯³ε­©εΏ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/39/2018new_nvhai_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/39/2018new_nvhai_thumb.png",
								value: "[ε₯³ε­©εΏ]",
								picid: ""
							}, {
								phrase: "[ηη«]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/aa/2018new_xiongmao_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/aa/2018new_xiongmao_thumb.png",
								value: "[ηη«]",
								picid: ""
							}, {
								phrase: "[εε­]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c6/2018new_tuzi_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c6/2018new_tuzi_thumb.png",
								value: "[εε­]",
								picid: ""
							}, {
								phrase: "[ηͺε€΄]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1c/2018new_zhutou_thumb.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1c/2018new_zhutou_thumb.png",
								value: "[ηͺε€΄]",
								picid: ""
							}, {
								phrase: "[θζ³₯ι©¬]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3b/2018new_caonima_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3b/2018new_caonima_thumb.png",
								value: "[θζ³₯ι©¬]",
								picid: ""
							}, {
								phrase: "[ε₯₯ηΉζΌ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c6/2018new_aoteman_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c6/2018new_aoteman_org.png",
								value: "[ε₯₯ηΉζΌ]",
								picid: ""
							}, {
								phrase: "[ε€ͺι³]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/cd/2018new_taiyang_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/cd/2018new_taiyang_org.png",
								value: "[ε€ͺι³]",
								picid: ""
							}, {
								phrase: "[ζδΊ?]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d5/2018new_yueliang_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d5/2018new_yueliang_org.png",
								value: "[ζδΊ?]",
								picid: ""
							}, {
								phrase: "[ζ΅?δΊ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/61/2018new_yunduo_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/61/2018new_yunduo_thumb.png",
								value: "[ζ΅?δΊ]",
								picid: ""
							}, {
								phrase: "[δΈι¨]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7e/2018new_yu_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7e/2018new_yu_thumb.png",
								value: "[δΈι¨]",
								picid: ""
							}, {
								phrase: "[ζ²ε°ζ΄]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b7/2018new_shachenbao_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b7/2018new_shachenbao_org.png",
								value: "[ζ²ε°ζ΄]",
								picid: ""
							}, {
								phrase: "[εΎ?ι£]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c7/2018new_weifeng_thumb.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c7/2018new_weifeng_thumb.png",
								value: "[εΎ?ι£]",
								picid: ""
							}, {
								phrase: "[ε΄θ§]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6c/2018new_weiguan_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6c/2018new_weiguan_org.png",
								value: "[ε΄θ§]",
								picid: ""
							}, {
								phrase: "[ι£ζΊ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/4a/2018new_feiji_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/4a/2018new_feiji_thumb.png",
								value: "[ι£ζΊ]",
								picid: ""
							}, {
								phrase: "[η§ηΈζΊ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/78/2018new_xiangji_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/78/2018new_xiangji_thumb.png",
								value: "[η§ηΈζΊ]",
								picid: ""
							}, {
								phrase: "[θ―η­]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/48/2018new_huatong_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/48/2018new_huatong_org.png",
								value: "[θ―η­]",
								picid: ""
							}, {
								phrase: "[θ‘η]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/16/2018new_lazhu_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/16/2018new_lazhu_org.png",
								value: "[θ‘η]",
								picid: ""
							}, {
								phrase: "[ι³δΉ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1f/2018new_yinyue_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1f/2018new_yinyue_org.png",
								value: "[ι³δΉ]",
								picid: ""
							}, {
								phrase: "[ε]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e0/2018new_xizi_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e0/2018new_xizi_thumb.png",
								value: "[ε]",
								picid: ""
							}, {
								phrase: "[η»ε]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/36/2018new_geili_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/36/2018new_geili_thumb.png",
								value: "[η»ε]",
								picid: ""
							}, {
								phrase: "[ε¨ζ­¦]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/14/2018new_weiwu_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/14/2018new_weiwu_thumb.png",
								value: "[ε¨ζ­¦]",
								picid: ""
							}, {
								phrase: "[εΉ²ζ―]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/2018new_ganbei_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/2018new_ganbei_org.png",
								value: "[εΉ²ζ―]",
								picid: ""
							}, {
								phrase: "[θη³]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f9/2018new_dangao_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f9/2018new_dangao_org.png",
								value: "[θη³]",
								picid: ""
							}, {
								phrase: "[η€Όη©]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0e/2018new_liwu_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0e/2018new_liwu_org.png",
								value: "[η€Όη©]",
								picid: ""
							}, {
								phrase: "[ι]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/8e/2018new_zhong_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/8e/2018new_zhong_org.png",
								value: "[ι]",
								picid: ""
							}, {
								phrase: "[θ₯η]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d6/2018new_feizao_thumb.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d6/2018new_feizao_thumb.png",
								value: "[θ₯η]",
								picid: ""
							}, {
								phrase: "[η»ΏδΈεΈ¦]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/cb/2018new_lvsidai_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/cb/2018new_lvsidai_thumb.png",
								value: "[η»ΏδΈεΈ¦]",
								picid: ""
							}, {
								phrase: "[ε΄θ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/64/2018new_weibo_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/64/2018new_weibo_org.png",
								value: "[ε΄θ]",
								picid: ""
							}, {
								phrase: "[ζ΅ͺ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/46/2018new_xinlang_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/46/2018new_xinlang_thumb.png",
								value: "[ζ΅ͺ]",
								picid: ""
							}, {
								phrase: "[ηΎεε]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/df/lxhxiudada_org.gif",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/df/lxhxiudada_thumb.gif",
								value: "[ηΎεε]",
								picid: ""
							}, {
								phrase: "[ε₯½η±ε¦]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/74/lxhainio_org.gif",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/74/lxhainio_thumb.gif",
								value: "[ε₯½η±ε¦]",
								picid: ""
							}, {
								phrase: "[ε·δΉ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/fa/lxhtouxiao_thumb.gif",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/fa/lxhtouxiao_thumb.gif",
								value: "[ε·δΉ]",
								picid: ""
							}, {
								phrase: "[θ΅ε]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/00/lxhzan_thumb.gif",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/00/lxhzan_thumb.gif",
								value: "[θ΅ε]",
								picid: ""
							}, {
								phrase: "[η¬εε]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/32/lxhwahaha_org.gif",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/32/lxhwahaha_thumb.gif",
								value: "[η¬εε]",
								picid: ""
							}, {
								phrase: "[ε₯½εζ¬’]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d6/lxhlike_thumb.gif",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d6/lxhlike_thumb.gif",
								value: "[ε₯½εζ¬’]",
								picid: ""
							}, {
								phrase: "[ζ±ε³ζ³¨]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ac/lxhqiuguanzhu_org.gif",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ac/lxhqiuguanzhu_thumb.gif",
								value: "[ζ±ε³ζ³¨]",
								picid: ""
							}, {
								phrase: "[θδΈεΎ?η¬]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/68/film_pangdingsmile_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/68/film_pangdingsmile_thumb.png",
								value: "[θδΈεΎ?η¬]",
								picid: ""
							}, {
								phrase: "[εΌ±]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3d/2018new_ruo_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3d/2018new_ruo_org.png",
								value: "[εΌ±]",
								picid: ""
							}, {
								phrase: "[NO]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1e/2018new_no_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1e/2018new_no_org.png",
								value: "[NO]",
								picid: ""
							}, {
								phrase: "[haha]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1d/2018new_hahashoushi_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1d/2018new_hahashoushi_org.png",
								value: "[haha]",
								picid: ""
							}, {
								phrase: "[ε ζ²Ή]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9f/2018new_jiayou_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9f/2018new_jiayou_org.png",
								value: "[ε ζ²Ή]",
								picid: ""
							}, {
								phrase: "[δ½©ε₯]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c6/hot_pigpeiqi_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c6/hot_pigpeiqi_thumb.png",
								value: "[δ½©ε₯]",
								picid: ""
							}, {
								phrase: "[ε€§δΎ¦ζ’η?ε‘δΈεΎ?η¬]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b3/pikaqiu_weixiao_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b3/pikaqiu_weixiao_thumb.png",
								value: "[ε€§δΎ¦ζ’η?ε‘δΈεΎ?η¬]",
								picid: ""
							}, {
								phrase: "[ε£θ―θδΊΊ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/93/xmax_oldman01_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/93/xmax_oldman01_thumb.png",
								value: "[ε£θ―θδΊΊ]",
								picid: ""
							}, {
								phrase: "[η΄«ιθ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e5/gongjiri_zijinhua_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e5/gongjiri_zijinhua_thumb.png",
								value: "[η΄«ιθ]",
								picid: ""
							}, {
								phrase: "[ζζιη]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/93/gongyi_wenminglgnew_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/93/gongyi_wenminglgnew_thumb.png",
								value: "[ζζιη]",
								picid: ""
							}, {
								phrase: "[η₯ι©¬]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/60/horse2_org.gif",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/60/horse2_thumb.gif",
								value: "[η₯ι©¬]",
								picid: ""
							}, {
								phrase: "[ι©¬ε°ζε]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b0/mdcg_org.gif",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b0/mdcg_thumb.gif",
								value: "[ι©¬ε°ζε]",
								picid: ""
							}, {
								phrase: "[ηΈιΈ‘ε€ι]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e2/zhajibeer_org.gif",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e2/zhajibeer_thumb.gif",
								value: "[ηΈιΈ‘ε€ι]",
								picid: ""
							}, {
								phrase: "[ζε³]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/be/remen_zuiyou180605_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/be/remen_zuiyou180605_thumb.png",
								value: "[ζε³]",
								picid: ""
							}, {
								phrase: "[η»]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/41/zz2_org.gif",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/41/zz2_thumb.gif",
								value: "[η»]",
								picid: ""
							}, {
								phrase: "[δΊδ»ζι₯Ό]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/10/2018zhongqiu_yuebing_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/10/2018zhongqiu_yuebing_thumb.png",
								value: "[δΊδ»ζι₯Ό]",
								picid: ""
							}, {
								phrase: "[η»δ½ ε°εΏεΏ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ca/qixi2018_xiaoxinxin_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ca/qixi2018_xiaoxinxin_thumb.png",
								value: "[η»δ½ ε°εΏεΏ]",
								picid: ""
							}, {
								phrase: "[εηη²?]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0b/qixi2018_chigouliang_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0b/qixi2018_chigouliang_thumb.png",
								value: "[εηη²?]",
								picid: ""
							}, {
								phrase: "[εΌθ±θ§ι±ηΌεΌ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/83/2018newyear_richdog_org.gif",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/83/2018newyear_richdog_thumb.gif",
								value: "[εΌθ±θ§ι±ηΌεΌ]",
								picid: ""
							}, {
								phrase: "[θΆζ°ζε¨θΏδΌ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f9/huodong_starsports_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f9/huodong_starsports_thumb.png",
								value: "[θΆζ°ζε¨θΏδΌ]",
								picid: ""
							}, {
								phrase: "[ηζΆ¨]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/fe/kanzhangv2_org.gif",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/fe/kanzhangv2_thumb.gif",
								value: "[ηζΆ¨]",
								picid: ""
							}, {
								phrase: "[ηθ·]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c5/kandiev2_org.gif",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c5/kandiev2_thumb.gif",
								value: "[ηθ·]",
								picid: ""
							}, {
								phrase: "[εΈ¦ηεΎ?εε»ζθ‘]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ec/eventtravel_org.gif",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ec/eventtravel_thumb.gif",
								value: "[εΈ¦ηεΎ?εε»ζθ‘]",
								picid: ""
							}, {
								phrase: "[ζζ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/76/hot_star171109_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/76/hot_star171109_thumb.png",
								value: "[ζζ]",
								picid: ""
							}, {
								phrase: "[εζ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f9/hot_halfstar_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f9/hot_halfstar_thumb.png",
								value: "[εζ]",
								picid: ""
							}, {
								phrase: "[η©Ίζ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ff/hot_blankstar_org.png",
								hot: !1,
								common: !1,
								category: "εΆδ»",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ff/hot_blankstar_thumb.png",
								value: "[η©Ίζ]",
								picid: ""
							}, {
								phrase: "[ε°ι»δΊΊεΎ?η¬]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f0/xhrnew_weixiao_org.png",
								hot: !1,
								common: !1,
								category: "ε°ι»δΊΊ",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f0/xhrnew_weixiao_org.png",
								value: "[ε°ι»δΊΊεΎ?η¬]",
								picid: ""
							}, {
								phrase: "[ε°ι»δΊΊεͺεζ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/63/xhrnew_jiandaoshou_org.png",
								hot: !1,
								common: !1,
								category: "ε°ι»δΊΊ",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/63/xhrnew_jiandaoshou_org.png",
								value: "[ε°ι»δΊΊεͺεζ]",
								picid: ""
							}, {
								phrase: "[ε°ι»δΊΊδΈε±]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b2/xhrnew_buxie_org.png",
								hot: !1,
								common: !1,
								category: "ε°ι»δΊΊ",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b2/xhrnew_buxie_org.png",
								value: "[ε°ι»δΊΊδΈε±]",
								picid: ""
							}, {
								phrase: "[ε°ι»δΊΊι«ε΄]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/41/xhrnew_gaoxing_org.png",
								hot: !1,
								common: !1,
								category: "ε°ι»δΊΊ",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/41/xhrnew_gaoxing_org.png",
								value: "[ε°ι»δΊΊι«ε΄]",
								picid: ""
							}, {
								phrase: "[ε°ι»δΊΊζθ?Ά]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/fd/xhrnew_jingya_thumb.png",
								hot: !1,
								common: !1,
								category: "ε°ι»δΊΊ",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/fd/xhrnew_jingya_thumb.png",
								value: "[ε°ι»δΊΊζθ?Ά]",
								picid: ""
							}, {
								phrase: "[ε°ι»δΊΊε§ε±]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/79/xhrnew_weiqu_org.png",
								hot: !1,
								common: !1,
								category: "ε°ι»δΊΊ",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/79/xhrnew_weiqu_org.png",
								value: "[ε°ι»δΊΊε§ε±]",
								picid: ""
							}, {
								phrase: "[ε°ι»δΊΊεη¬]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/be/xhrnew_huaixiao_thumb.png",
								hot: !1,
								common: !1,
								category: "ε°ι»δΊΊ",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/be/xhrnew_huaixiao_thumb.png",
								value: "[ε°ι»δΊΊεη¬]",
								picid: ""
							}, {
								phrase: "[ε°ι»δΊΊη½ηΌ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e2/xhrnew_baiyan_org.png",
								hot: !1,
								common: !1,
								category: "ε°ι»δΊΊ",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e2/xhrnew_baiyan_org.png",
								value: "[ε°ι»δΊΊη½ηΌ]",
								picid: ""
							}, {
								phrase: "[ε°ι»δΊΊζ ε₯]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/15/xhrnew_wunai_org.png",
								hot: !1,
								common: !1,
								category: "ε°ι»δΊΊ",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/15/xhrnew_wunai_thumb.png",
								value: "[ε°ι»δΊΊζ ε₯]",
								picid: ""
							}, {
								phrase: "[ε°ι»δΊΊεΎζ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c8/xhrnew_deyi_org.png",
								hot: !1,
								common: !1,
								category: "ε°ι»δΊΊ",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c8/xhrnew_deyi_thumb.png",
								value: "[ε°ι»δΊΊεΎζ]",
								picid: ""
							}, {
								phrase: "[ι’ιδΎ ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/27/avengers_ironman01_org.png",
								hot: !1,
								common: !1,
								category: "ε€δ»θθη",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/27/avengers_ironman01_thumb.png",
								value: "[ι’ιδΎ ]",
								picid: ""
							}, {
								phrase: "[ηΎε½ιιΏ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d8/avengers_captain01_org.png",
								hot: !1,
								common: !1,
								category: "ε€δ»θθη",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d8/avengers_captain01_thumb.png",
								value: "[ηΎε½ιιΏ]",
								picid: ""
							}, {
								phrase: "[ι·η₯]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3c/avengers_thor01_org.png",
								hot: !1,
								common: !1,
								category: "ε€δ»θθη",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3c/avengers_thor01_thumb.png",
								value: "[ι·η₯]",
								picid: ""
							}, {
								phrase: "[ζ΅©ε]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/44/avengers_hulk01_org.png",
								hot: !1,
								common: !1,
								category: "ε€δ»θθη",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/44/avengers_hulk01_thumb.png",
								value: "[ζ΅©ε]",
								picid: ""
							}, {
								phrase: "[ι»ε―‘ε¦]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0e/avengers_blackwidow01_org.png",
								hot: !1,
								common: !1,
								category: "ε€δ»θθη",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0e/avengers_blackwidow01_thumb.png",
								value: "[ι»ε―‘ε¦]",
								picid: ""
							}, {
								phrase: "[ιΉ°ηΌ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/93/avengers_clint01_org.png",
								hot: !1,
								common: !1,
								category: "ε€δ»θθη",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/93/avengers_clint01_thumb.png",
								value: "[ιΉ°ηΌ]",
								picid: ""
							}, {
								phrase: "[ζε₯ιιΏ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/44/avengers_captainmarvel01_org.png",
								hot: !1,
								common: !1,
								category: "ε€δ»θθη",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/44/avengers_captainmarvel01_thumb.png",
								value: "[ζε₯ιιΏ]",
								picid: ""
							}, {
								phrase: "[ε₯₯εθΆ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/62/avengers_aokeye01_org.png",
								hot: !1,
								common: !1,
								category: "ε€δ»θθη",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/62/avengers_aokeye01_thumb.png",
								value: "[ε₯₯εθΆ]",
								picid: ""
							}, {
								phrase: "[θδΊΊ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/cc/avengers_antman01_org.png",
								hot: !1,
								common: !1,
								category: "ε€δ»θθη",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/cc/avengers_antman01_thumb.png",
								value: "[θδΊΊ]",
								picid: ""
							}, {
								phrase: "[η­ιΈ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ce/avengers_thanos01_org.png",
								hot: !1,
								common: !1,
								category: "ε€δ»θθη",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ce/avengers_thanos01_thumb.png",
								value: "[η­ιΈ]",
								picid: ""
							}, {
								phrase: "[θθδΎ ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e2/avengers_spiderman01_org.png",
								hot: !1,
								common: !1,
								category: "ε€δ»θθη",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e2/avengers_spiderman01_thumb.png",
								value: "[θθδΎ ]",
								picid: ""
							}, {
								phrase: "[ζ΄εΊ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1f/avengers_locki01_org.png",
								hot: !1,
								common: !1,
								category: "ε€δ»θθη",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1f/avengers_locki01_thumb.png",
								value: "[ζ΄εΊ]",
								picid: ""
							}, {
								phrase: "[ε₯εΌεε£«]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9c/avengers_drstranger01_org.png",
								hot: !1,
								common: !1,
								category: "ε€δ»θθη",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9c/avengers_drstranger01_thumb.png",
								value: "[ε₯εΌεε£«]",
								picid: ""
							}, {
								phrase: "[ε¬ε΅]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/91/avengers_wintersolider01_org.png",
								hot: !1,
								common: !1,
								category: "ε€δ»θθη",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/91/avengers_wintersolider01_thumb.png",
								value: "[ε¬ε΅]",
								picid: ""
							}, {
								phrase: "[ι»θ±Ή]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/86/avengers_panther01_org.png",
								hot: !1,
								common: !1,
								category: "ε€δ»θθη",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/86/avengers_panther01_thumb.png",
								value: "[ι»θ±Ή]",
								picid: ""
							}, {
								phrase: "[η©ηΊ’ε₯³ε·«]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a9/avengers_witch01_org.png",
								hot: !1,
								common: !1,
								category: "ε€δ»θθη",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a9/avengers_witch01_thumb.png",
								value: "[η©ηΊ’ε₯³ε·«]",
								picid: ""
							}, {
								phrase: "[εΉ»θ§]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/07/avengers_vision01_org.png",
								hot: !1,
								common: !1,
								category: "ε€δ»θθη",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/07/avengers_vision01_thumb.png",
								value: "[εΉ»θ§]",
								picid: ""
							}, {
								phrase: "[ζη΅]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/35/avengers_starlord01_org.png",
								hot: !1,
								common: !1,
								category: "ε€δ»θθη",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/35/avengers_starlord01_thumb.png",
								value: "[ζη΅]",
								picid: ""
							}, {
								phrase: "[ζ Όι²ηΉ]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7a/avengers_gelute01_org.png",
								hot: !1,
								common: !1,
								category: "ε€δ»θθη",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7a/avengers_gelute01_thumb.png",
								value: "[ζ Όι²ηΉ]",
								picid: ""
							}, {
								phrase: "[θ³θε¦Ή]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7c/avengers_mantis01_org.png",
								hot: !1,
								common: !1,
								category: "ε€δ»θθη",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7c/avengers_mantis01_thumb.png",
								value: "[θ³θε¦Ή]",
								picid: ""
							}, {
								phrase: "[ζ ιζε₯]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/38/avengers_gauntlet01_org.png",
								hot: !1,
								common: !1,
								category: "ε€δ»θθη",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/38/avengers_gauntlet01_thumb.png",
								value: "[ζ ιζε₯]",
								picid: ""
							}, {
								phrase: "[ε€§ζ―η₯η₯]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d0/yunying_damaoluelue_org.png",
								hot: !1,
								common: !1,
								category: "ιͺδΊΊε₯ηΌ",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d0/yunying_damaoluelue_thumb.png",
								value: "[ε€§ζ―η₯η₯]",
								picid: ""
							}, {
								phrase: "[ε€§ζ―ζθ?Ά]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/4d/yunying_damaojingya_org.png",
								hot: !1,
								common: !1,
								category: "ιͺδΊΊε₯ηΌ",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/4d/yunying_damaojingya_thumb.png",
								value: "[ε€§ζ―ζθ?Ά]",
								picid: ""
							}, {
								phrase: "[ε€§ζ―εΎ?η¬]",
								type: "face",
								url: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/da/yunying_damaoweixiao_org.png",
								hot: !1,
								common: !1,
								category: "ιͺδΊΊε₯ηΌ",
								icon: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/da/yunying_damaoweixiao_thumb.png",
								value: "[ε€§ζ―εΎ?η¬]",
								picid: ""
							}],
							e = {},
							n = [],
							a = {};
						return t.forEach(function(t) {
							var p = t.category.length > 0 ? t.category : "ι»θ?€";
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
							a = ["ζ₯", "δΈ", "δΊ", "δΈ", "ε", "δΊ", "ε­"],
							p = new Date(1e3 * t),
							s = p.getFullYear(),
							i = p.getMonth(),
							o = p.getDate(),
							r = p.getDay(),
							c = ("0" + p.getHours()).slice(-2),
							g = ("0" + p.getMinutes()).slice(-2);
						if (n < 86400) return c + ":" + g;
						if (!(n >= 86400 && n < 604800)) return n >= 604800 ? i + "ζ" + o + "ζ₯ " + c + ":" + g : s + "εΉ΄" + i + "ζ" +
							o + "ζ₯ " + c + ":" + g;
						switch ((new Date).getDate() - o) {
							case 1:
								return "ζ¨ε€©" + c + ":" + g;
							case 2:
								return "εε€©" + c + ":" + g;
							default:
								return "ζζ" + a[r] + " " + c + ":" + g
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
				url: "flbooth/service/recyclebin" + location.search,
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
							url: "flbooth/service/restore",
							refresh: !0
						}, {
							name: "Destroy",
							text: __("Destroy"),
							classname: "btn btn-xs btn-danger btn-ajax btn-destroyit",
							icon: "fa fa-times",
							url: "flbooth/service/destroy",
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
