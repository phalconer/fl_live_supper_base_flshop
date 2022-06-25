<?php

namespace app\common\model;

use think\Model;

/**
 * 短信验证码
 */
class Sms Extends Model
{

    // 开启自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';
    // 定义时间戳字段名
    protected $create_time = 'created';
    protected $modified = false;
    // 追加属性
    protected $append = [
    ];

}
