<?php
// 2020年2月17日21:41:44
namespace app\index\controller\flshop;

use app\common\controller\flshop;

/**
 * 附件管理
 *
 * @icon fa fa-circle-o
 * @remark 主要用于管理上传到又拍云的数据或上传至本服务的上传数据
 */
class Attachment extends flshop
{

    /**
     * @var \app\common\model\Attachment
     */
    protected $model = null;
    protected $noNeedLogin = '';
    protected $noNeedRight = '*';
    public function _initialize()
    {
        parent::_initialize();
        $this->model = model('Attachment');
        $this->view->assign("mime_typeList", \app\common\model\Attachment::getmime_typeList());
    }
    
    /**
     * 查看
     */
    public function index()
    {
        //设置过滤方法
        $this->request->filter(['strip_tags']);
        if ($this->request->isAjax()) {
            $mime_typeQuery = [];
            $filter = $this->request->request('filter');
            $filterArr = (array)json_decode($filter, true);
            if (isset($filterArr['mime_type']) && preg_match("/[]\,|\*]/", $filterArr['mime_type'])) {
                $this->request->get(['filter' => json_encode(array_diff_key($filterArr, ['mime_type' => '']))]);
                $mime_typeQuery = function ($query) use ($filterArr) {
                    $mime_typeArr = explode(',', $filterArr['mime_type']);
                    foreach ($mime_typeArr as $index => $item) {
                        if (stripos($item, "/*") !== false) {
                            $query->whereOr('mime_type', 'like', str_replace("/*", "/", $item) . '%');
                        } else {
                            $query->whereOr('mime_type', 'like', '%' . $item . '%');
                        }
                    }
                };
            }
    
            list($where, $sort, $order, $offset, $limit) = $this->buildparams();
            $total = $this->model
                ->where($mime_typeQuery)
                ->where($where)
                ->order($sort, $order)
                ->count();
    
            $list = $this->model
                ->where($mime_typeQuery)
                ->where($where)
                ->order($sort, $order)
                ->limit($offset, $limit)
                ->select();
            $cdnurl = preg_replace("/\/(\w+)\.php$/i", '', $this->request->root());
            foreach ($list as $k => &$v) {
                $v['fullurl'] = ($v['storage'] == 'local' ? $cdnurl : $this->view->config['upload']['cdnurl']) . $v['url'];
            }
            unset($v);
            $result = array("total" => $total, "rows" => $list);
    
            return json($result);
        }
        return $this->view->fetch();
    }
    
    /**
     * 选择附件
     */
    public function select()
    {
        if ($this->request->isAjax()) {
            return $this->index();
        }
        return $this->view->fetch();
    }
    
    /**
     * 删除附件
     * @param array $ids
     */
    public function del($ids = "")
    {
        if ($ids) {
            \think\Hook::add('upload_delete', function ($params) {
                $attachmentFile = ROOT_PATH . '/public' . $params['url'];
                if (is_file($attachmentFile)) {
                    @unlink($attachmentFile);
                }
            });
            $attachmentlist = $this->model->where('id', 'in', $ids)->select();
            foreach ($attachmentlist as $attachment) {
                \think\Hook::listen("upload_delete", $attachment);
                $attachment->delete();
            }
            $this->success();
        }
        $this->error(__('Parameter %s can not be empty', 'ids'));
    }
}
