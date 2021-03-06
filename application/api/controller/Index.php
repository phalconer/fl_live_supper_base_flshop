<?php

namespace app\api\controller;

use app\common\controller\Api;

/**
 * 首页接口
 */
class Index extends Api
{
    protected $noNeedLogin = ['*'];
    protected $noNeedRight = ['*'];



    /**
     * 首页
     *
     * @ApiSummary  (flbooth 获取首页、应用、展商)
     * @ApiMethod   (GET)
     *
     */
    public function index()
    {
        $cacheTime = 60; //   查询缓存

        $booth_id=1;
        $article_id=1;

        //banner 活动图
        $activity = \app\admin\model\Activity::where('id', $booth_id)->find();
        $activity['activity_img'] ='http://flshop.com//assets/addons/flshop/img/show/main_bg3x.png';
        //
        $article = model('app\api\model\flbooth\Article')
            ->where(['id' => $article_id])
            ->find();


        $Exhibitor = model('app\admin\model\Exhibitor')
            ->field('*')
            ->order('edit_time desc')
            ->paginate(3,0)->toArray();



        $homeModules=
            array(
                'items'=>array(
                    array(
                        'name'=>'电子门票',
                        "type"=> "ticket",
                        "style"=>array(
                            "color"=>"#000000",
                            "margin"=> "8px 12.5px 0 12.5px",
                            "border-radius"=> "10px",
                            "overflow"=>"hidden"   ),
                        "params"=>array(
                            "interval"=>"2800",
                            "height"=> "115px",
                            "banstyle"=> "1",
                            "overflow"=>"hidden"
                        ),
                    ),
                    array(
                        'name'=>'场馆导览',
                        "type"=> "guide",
                        "style"=>array(
                            "color"=>"#000000",
                            "margin"=> "8px 12.5px 0 12.5px",
                            "border-radius"=> "10px",
                            "overflow"=>"hidden"   ),
                        "params"=>array(
                            "interval"=>"2800",
                            "height"=> "115px",
                            "banstyle"=> "1",
                            "overflow"=>"hidden"
                        ),
                    ),
                    array(
                        'name'=>'合作洽谈',
                        "type"=> "cooperation",
                        "style"=>array(
                            "color"=>"#000000",
                            "margin"=> "8px 12.5px 0 12.5px",
                            "border-radius"=> "10px",
                            "overflow"=>"hidden"   ),
                        "params"=>array(
                            "interval"=>"2800",
                            "height"=> "115px",
                            "banstyle"=> "1",
                            "overflow"=>"hidden"
                        ),
                    ),
                    array(
                        'name'=>'场馆服务',
                        "type"=> "service",
                        "style"=>array(
                            "color"=>"#000000",
                            "margin"=> "8px 12.5px 0 12.5px",
                            "border-radius"=> "10px",
                            "overflow"=>"hidden"   ),
                        "params"=>array(
                            "interval"=>"2800",
                            "height"=> "115px",
                            "banstyle"=> "1",
                            "overflow"=>"hidden"
                        ),
                    ),
                    array(
                        'name'=>'名片夹',
                        "type"=> "card",
                        "style"=>array(
                            "color"=>"#000000",
                            "margin"=> "8px 12.5px 0 12.5px",
                            "border-radius"=> "10px",
                            "overflow"=>"hidden"   ),
                        "params"=>array(
                            "interval"=>"2800",
                            "height"=> "115px",
                            "banstyle"=> "1",
                            "overflow"=>"hidden"
                        ),
                    ), )
            );
        $modulesData  = [
            "banner" => $activity,
            "article" => $article,
            "homeModules" => $homeModules,
            "exhibitors" => $Exhibitor['data'],
        ];
        $this->success('', $modulesData);
    }

}
