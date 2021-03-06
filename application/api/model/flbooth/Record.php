<?php

namespace app\api\model\flbooth;

use think\Model;
use traits\model\SoftDelete;

class Record extends Model
{

    use SoftDelete;

    

    // 表名
    protected $name = 'booth_record';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $modified = 'modified';
    protected $deleted = 'deleted';
	
	// 商品
	public function goods()
	{
	    return $this->belongsTo('app\api\model\flbooth\Goods', 'goods_id', 'id', [], 'LEFT')->setEagerlyType(0);
	}
	
	// 拼团商品
	public function groups()
	{
	    return $this->belongsTo('app\api\model\flbooth\groups\Goods', 'goods_id', 'id', [], 'LEFT')->setEagerlyType(0);
	}
}
