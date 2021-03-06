<?php
namespace app\index\model\flshop\groups;

use think\Model;

class OrderAddress extends Model
{
    // 表名
    protected $name = 'booth_groups_order_address';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $modified = 'modified';
	
	// 店铺
	public function shop()
	{
	    return $this->belongsTo('app\index\model\flshop\Shop', 'shop_id', 'id', [], 'LEFT')->setEagerlyType(0);
	}
}
