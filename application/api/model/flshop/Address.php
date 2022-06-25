<?php
namespace app\api\model\flshop;

use think\Model;

class Address extends Model
{
    // 表名
    protected $name = 'flshop_address';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $modified = 'modified';
}
