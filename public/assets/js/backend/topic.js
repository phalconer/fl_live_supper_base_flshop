define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'topic/index' + location.search,
                    add_url: 'topic/add',
                    edit_url: 'topic/edit',
                    del_url: 'topic/del',
                    multi_url: 'topic/multi',
                    import_url: 'topic/import',
                    table: 'booth_topic',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'id',
                fixedColumns: true,
                fixedRightNumber: 1,
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'name', title: __('Name'), operate: 'LIKE'},
                        {field: 'is_recommend', title: __('Is_recommend')},
                        {field: 'act_id', title: __('Act_id')},
                        {field: 'hall_id', title: __('Hall_id')},
                        {field: 'start_time', title: __('Start_time'), operate:'RANGE', addclass:'datetimerange', autocomplete:false, formatter: Table.api.formatter.datetime},
                        {field: 'end_time', title: __('End_time'), operate:'RANGE', addclass:'datetimerange', autocomplete:false, formatter: Table.api.formatter.datetime},
                        {field: 'template', title: __('Template'), operate: 'LIKE'},
                        {field: 'topic_img', title: __('Topic_img'), operate: 'LIKE'},
                        {field: 'title_img', title: __('Title_img'), operate: 'LIKE'},
                        {field: 'base_style', title: __('Base_style')},
                        {field: 'htmls', title: __('Htmls')},
                        {field: 'keywords', title: __('Keywords'), operate: 'LIKE'},
                        {field: 'description', title: __('Description'), operate: 'LIKE'},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
        },
        add: function () {
            Controller.api.bindevent();
        },
        edit: function () {
            Controller.api.bindevent();
        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});
