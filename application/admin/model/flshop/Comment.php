<?php

namespace app\admin\model\flshop;

use think\Model;
use traits\model\SoftDelete;

class Comment extends Model
{

    use SoftDelete;

    

    // 表名
    protected $name = 'flbooth_goods_comment';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $modified = 'modified';
    protected $deleted = 'deleted';

    // 追加属性
    protected $append = [
        'state_text',
        'status_text'
    ];
    

    
    public function getStateList()
    {
        return ['0' => __('State 0'), '1' => __('State 1'), '2' => __('State 2')];
    }

    public function getStatusList()
    {
        return ['normal' => __('Normal'), 'hidden' => __('Hidden')];
    }


    public function getStateTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['state']) ? $data['state'] : '');
        $list = $this->getStateList();
        return isset($list[$value]) ? $list[$value] : '';
    }


    public function getStatusTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['status']) ? $data['status'] : '');
        $list = $this->getStatusList();
        return isset($list[$value]) ? $list[$value] : '';
    }




    public function user()
    {
        return $this->belongsTo('app\admin\model\User', 'user_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }


    public function shop()
    {
        return $this->belongsTo('app\admin\model\flshop\Shop', 'shop_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }
    
    public function goods()
    {
        return $this->belongsTo('app\index\model\flshop\Goods', 'goods_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }
    
    public function groups()
    {
        return $this->belongsTo('app\index\model\flshop\groups\Goods', 'goods_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }
    
    public function ordergoods()
    {
        return $this->belongsTo('app\index\model\flshop\OrderGoods', 'order_goods_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }
    
    public function ordergroups()
    {
        return $this->belongsTo('app\index\model\flshop\groups\OrderGoods', 'order_goods_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }
}
