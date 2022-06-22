<?php

namespace app\api\model\wanlshop;
use think\Model;

class Live extends Model
{


    // 表名
    protected $name = 'wanlshop_live';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $updateTime = 'updatetime';
	
	public function setGoodsIdsAttr($value)
	{
	    return is_array($value) ? implode(',', $value) : $value;
	}
	
	// 店铺
	public function shop()
	{
	    return $this->belongsTo('app\api\model\wanlshop\Shop', 'shop_id', 'id', [], 'LEFT')->setEagerlyType(0);
	}
}
