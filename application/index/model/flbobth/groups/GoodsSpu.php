<?php
namespace app\index\model\flshop\groups;

use think\Model;
use traits\model\SoftDelete;

class GoodsSpu extends Model
{

    use SoftDelete;

    

    // 表名
    protected $name = 'booth_groups_goods_spu';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $modified = 'modified';
    protected $deleted = 'deleted';
}
