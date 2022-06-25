<?php
namespace app\index\model\flshop;

use think\Model;
use traits\model\SoftDelete;

class Page extends Model
{
    use SoftDelete;

    // 表名
    protected $name = 'flshop_page';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $modified = 'modified';
    protected $deleted = 'deleted';

    // 追加属性
    protected $append = [
        'type_text',
		'sort_text',
        'status_text'
    ];
    
	/**
	 * 将page字段转换数组
	 */
	public function getPageAttr($value)
	{
		$status = json_decode($value, true);
	    return $status;
	}
	
	/**
	 * 将item字段转换数组
	 */
	public function getItemAttr($value)
	{
		$status = json_decode($value, true);
	    return $status;
	}
    
    public function getTypeList()
    {
        return ['shop' => __('Shop'), 'page' => __('Page')];
    }
	
	public function getSortList()
	{
	    return ['product' => __('Sort product'), 'sort' => __('Sort sort'), 'page' => __('Sort page')];
	}

    public function getStatusList()
    {
        return ['normal' => __('Normal'), 'hidden' => __('Hidden')];
    }


    public function getTypeTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['type']) ? $data['type'] : '');
        $list = $this->getTypeList();
        return isset($list[$value]) ? $list[$value] : '';
    }
	
	public function getSortTextAttr($value, $data)
	{
	    $value = $value ? $value : (isset($data['type']) ? $data['type'] : '');
	    $list = $this->getSortList();
	    return isset($list[$value]) ? $list[$value] : '';
	}

    public function getStatusTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['status']) ? $data['status'] : '');
        $list = $this->getStatusList();
        return isset($list[$value]) ? $list[$value] : '';
    }

	


}
