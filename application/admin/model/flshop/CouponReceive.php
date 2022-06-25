<?php

namespace app\admin\model\flbooth;

use think\Model;
use traits\model\SoftDelete;

class CouponReceive extends Model
{

    use SoftDelete;

    

    // 表名
    protected $name = 'flbooth_coupon_receive';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $modified = 'modified';
    protected $deleted = 'deleted';

    // 追加属性
    protected $append = [
        'type_text',
        'usertype_text',
        'rangetype_text',
        'pretype_text'
    ];
    
    public function getTypeList()
    {
        return ['reduction' => __('Type reduction'), 'discount' => __('Type discount'), 'shipping' => __('Type shipping'), 'vip' => __('Type vip')];
    }

    public function getUsertypeList()
    {
        return ['reduction' => __('Usertype reduction'), 'discount' => __('Usertype discount')];
    }

    public function getRangetypeList()
    {
        return ['all' => __('Rangetype all'), 'goods' => __('Rangetype goods'), 'category' => __('Rangetype category')];
    }

    public function getPretypeList()
    {
        return ['appoint' => __('Pretype appoint'), 'fixed' => __('Pretype fixed')];
    }


    public function getTypeTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['type']) ? $data['type'] : '');
        $list = $this->getTypeList();
        return isset($list[$value]) ? $list[$value] : '';
    }


    public function getUsertypeTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['usertype']) ? $data['usertype'] : '');
        $list = $this->getUsertypeList();
        return isset($list[$value]) ? $list[$value] : '';
    }


    public function getRangetypeTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['rangetype']) ? $data['rangetype'] : '');
        $list = $this->getRangetypeList();
        return isset($list[$value]) ? $list[$value] : '';
    }


    public function getPretypeTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['pretype']) ? $data['pretype'] : '');
        $list = $this->getPretypeList();
        return isset($list[$value]) ? $list[$value] : '';
    }
	
	
}
