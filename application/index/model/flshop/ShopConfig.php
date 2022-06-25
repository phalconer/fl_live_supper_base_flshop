<?php
namespace app\index\model\flshop;

use think\Model;

/**
 * 配置模型
 */
class ShopConfig extends Model
{

    // 表名,不含前缀
    protected $name = 'flshop_shop_config';
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';
    
    // 定义时间戳字段名
    protected $created = 'created';
    protected $modified = 'modified';
	
	
	public function getTypeList()
	{
	    return [
			'freight' => __('商家店铺配置'), 
			'kuaidi' => __('快递100云打印配置'),
			'facesheet' => __('面单参数'),
			'mailing' => __('寄件人信息'),
			'return' => __('退货信息')
		];
	}
}
