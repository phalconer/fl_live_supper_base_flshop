<?php

namespace app\index\model\flshop;
use think\Model;

class Brand extends Model
{
    // 表名
    protected $name = 'booth_brand';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $modified = 'modified';
	// 追加属性
	protected $append = [
	    'status_text',
	    'state_text'
	];
	
	
	protected static function init()
	{
	    self::afterInsert(function ($row) {
	        $pk = $row->getPk();
	        $row->getQuery()->where($pk, $row[$pk])->update(['weigh' => $row[$pk]]);
	    });
	}
	
	
	public function getStatusList()
	{
	    return ['normal' => __('Normal'), 'hidden' => __('Hidden')];
	}
	
	public function getStateList()
	{
	    return ['0' => __('State 0'), '1' => __('State 1')];
	}
	
	
	public function getStatusTextAttr($value, $data)
	{
	    $value = $value ? $value : (isset($data['status']) ? $data['status'] : '');
	    $list = $this->getStatusList();
	    return isset($list[$value]) ? $list[$value] : '';
	}
	
	
	public function getStateTextAttr($value, $data)
	{
	    $value = $value ? $value : (isset($data['state']) ? $data['state'] : '');
	    $list = $this->getStateList();
	    return isset($list[$value]) ? $list[$value] : '';
	}
	
	
	
	public function category()
	{
	    return $this->belongsTo('app\index\model\flshop\Category', 'category_id', 'id', [], 'LEFT')->setEagerlyType(0);
	}
}
