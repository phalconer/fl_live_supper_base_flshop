<?php
namespace app\index\model\flbooth;

use think\Model;
use traits\model\SoftDelete;

class Pay extends Model
{

    use SoftDelete;

    

    // 表名
    protected $name = 'booth_pay';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $modified = 'modified';
    protected $deleted = 'deleted';

    // 追加属性
    protected $append = [
        'pay_type_text',
        'pay_state_text',
        'status_text'
    ];
    

    
    public function getPayTypeList()
    {
        return ['0' => __('Pay_type 0'), '1' => __('Pay_type 1'), '2' => __('Pay_type 2')];
    }

    public function getPayStateList()
    {
        return ['0' => __('Pay_state 0'), '1' => __('Pay_state 1')];
    }

    public function getStatusList()
    {
        return ['normal' => __('Normal'), 'hidden' => __('Hidden')];
    }


    public function getPayTypeTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['pay_type']) ? $data['pay_type'] : '');
        $list = $this->getPayTypeList();
        return isset($list[$value]) ? $list[$value] : '';
    }


    public function getPayStateTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['pay_state']) ? $data['pay_state'] : '');
        $list = $this->getPayStateList();
        return isset($list[$value]) ? $list[$value] : '';
    }


    public function getStatusTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['status']) ? $data['status'] : '');
        $list = $this->getStatusList();
        return isset($list[$value]) ? $list[$value] : '';
    }




}