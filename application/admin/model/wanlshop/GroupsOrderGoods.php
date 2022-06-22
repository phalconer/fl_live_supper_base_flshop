<?php
namespace app\admin\model\wanlshop;

use think\Model;
use traits\model\SoftDelete;

class GroupsOrderGoods extends Model
{
	use SoftDelete;
	
    // 表名
    protected $name = 'wanlshop_groups_order_goods';
	
	// 自动写入时间戳字段
	protected $autoWriteTimestamp = 'int';
	
	// 定义时间戳字段名
	protected $created = 'created';
	protected $updateTime = 'updatetime';
	protected $deleteTime = 'deletetime';
    
	public function user()
	{
	    return $this->belongsTo('app\common\model\User', 'user_id', 'id', [], 'LEFT')->setEagerlyType(0);
	}
}
