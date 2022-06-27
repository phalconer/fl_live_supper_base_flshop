<?php
namespace app\index\model\flbooth;

use think\Model;


class Withdraw extends Model
{
    // 表名
    protected $name = 'withdraw';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $modified = 'modified';
    protected $deleted = false;

    // 追加属性
    protected $append = [
        'status_text',
		'created_text',
		'modified_text',
        'transfertime_text'
    ];
    
	public function getTypeAttr($value)
	{
	    return [
			'alipay' => '支付宝',
			'ALIPAY' => '支付宝账户',
			'WECHAT' => '微信账户',
			'ICBC' => '工商银行',
			'ABC' => '农业银行',
			'PSBC' => '邮储银行',
			'CCB' => '建设银行',
			'CMB' => '招商银行',
			'BOC' => '中国银行',
			'COMM' => '交通银行',
			'SPDB' => '浦发银行',
			'GDB' => '广发银行',
			'CMBC' => '民生银行',
			'PAB' => '平安银行',
			'CEB' => '光大银行',
			'CIB' => '兴业银行',
			'CITIC' => '中信银行'
		][$value];
	}
    
    public function getStatusList()
    {
        return ['created' => __('Status created'), 'successed' => __('Status successed'), 'rejected' => __('Status rejected')];
    }


    public function getStatusTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['status']) ? $data['status'] : '');
        $list = $this->getStatusList();
        return isset($list[$value]) ? $list[$value] : '';
    }
	
	public function getcreatedTextAttr($value, $data)
	{
	    $value = $value ? $value : (isset($data['created']) ? $data['created'] : '');
	    return is_numeric($value) ? date("Y-m-d H:i:s", $value) : $value;
	}
	public function getmodifiedTextAttr($value, $data)
	{
	    $value = $value ? $value : (isset($data['modified']) ? $data['modified'] : '');
	    return is_numeric($value) ? date("Y-m-d H:i:s", $value) : $value;
	}
	
    public function getTransfertimeTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['transfertime']) ? $data['transfertime'] : '');
        return is_numeric($value) ? date("Y-m-d H:i:s", $value) : $value;
    }

    protected function setTransfertimeAttr($value)
    {
        return $value === '' ? null : ($value && !is_numeric($value) ? strtotime($value) : $value);
    }


}