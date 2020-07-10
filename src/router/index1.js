import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/** note: submenu only apppear when children.length>=1
 *   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
 **/

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
 **/
export const constantRouterMap = [{
  path: '/login',
  component: _import('login/index'),
  hidden: true
},
  {
    path: '/welcome',
    component: Layout,
    hidden: true,
    children: [{
      path: '/',
      component: _import('login/welcome'),
      hidden: true
    }

    ]
  },
  {
    path: '/authredirect',
    component: _import('login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: _import('errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: _import('errorPage/401'),
    hidden: true
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})

export const asyncRouterMap = [{
  path: '/',
  component: Layout,
  redirect: '/'
},
  {
    path: '/database',
    component: Layout,
    redirect: '/database/yizhu',
    alwaysShow: true,
    meta: {
      title: '数据管理',
      icon: 'table',
      routerIds: ['15']
    },
    children:[{
  path: 'yizhu',
  component: _import('database/yizhu/index'),
  name: 'yizhu',
  meta: {
    title: '医著',
    routerIds: ['1501']
  }
}, {
  path: 'yizhu/create_yizhu',
  component: _import('database/yizhu/create_yizhu'),
  name: 'create_yizhu',
  meta: {
    title: '新增医著',
    routerIds: ['1501']
  },
  hidden: true
}, {
  path: 'doctor',
  component: _import('database/doctor/index'),
  name: 'doctor',
  meta: {
    title: '医家',
    routerIds: ['1502']
  }
}, {
  path: 'doctor/create_doctor',
  component: _import('database/doctor/create_doctor'),
  name: 'create_doctor',
  meta: {
    title: '新增医家',
    routerIds: ['1502']
  },
  hidden: true
}, {
  path: 'theory',
  component: _import('database/theory/index'),
  name: 'theory',
  meta: {
    title: '理论',
    routerIds: ['1503']
  },
}, {
  path: 'medicine',
  component: _import('database/medicine/index'),
  name: 'medicine',
  meta: {
    title: '药物',
    routerIds: ['1504']
  },
}, {
  path: 'prescription',
  component: _import('database/prescription/index'),
  name: 'prescription',
  meta: {
    title: '方剂',
    routerIds: ['1504']
  },
}, {
  path: 'clinic',
  component: _import('database/clinic/index'),
  name: 'clinic',
  meta: {
    title: '临床',
    routerIds: ['1506']
  },
}, {
  path: 'consilia',
  component: _import('database/consilia/index'),
  name: 'consilia',
  meta: {
    title: '医案',
    routerIds: ['1507']
  },
},{
  path: 'medical',
  component: _import('database/medical/index'),
  name: 'medical',
  meta: {
    title: '医论',
    routerIds: ['1521']
  },
}, {
  path: 'culture',
  component: _import('database/culture/index'),
  name: 'culture',
  meta: {
    title: '文化',
    routerIds: ['1508']
  },
}, {
  path: 'organization',
  component: _import('database/organization/index'),
  name: 'organization',
  meta: {
    title: '机构',
    routerIds: ['1509']
  },
}, {
  path: 'other',
  component: _import('database/other/index'),
  name: 'other',
  meta: {
    title: '其他',
    routerIds: ['1510']
  },
}, {
  path: 'therapy',
  component: _import('database/therapy/index'),
  name: 'therapy',
  meta: {
    title: '特色疗法',
    routerIds: ['1519']
  },
}, {
  path: 'article',
  component: _import('database/article/index'),
  name: 'article',
  meta: {
    title: '未分类文章',
    routerIds: ['1511']
  }
}, {
  path: 'mongolian',
  component: _import('database/mongolian/index'),
  name: 'mongolian',
  meta: {
    title: '蒙文文章',
    routerIds: ['1512']
  },
},{
  path: 'classfiy',
  component: _import('database/classfiy/index'),
  name: 'classfiy',
  meta: {
    title: '自定义分类',
    routerIds: ['1513']
  },
}, {
  path: 'label',
  component: _import('database/label/index'),
  name: 'label',
  meta: {
    title: '标签管理',
    routerIds: ['1514']
  },
}, {
  path: 'recommend',
  component: _import('database/recommend/index'),
  name: 'recommend',
  meta: {
    title: '民族推荐位',
    routerIds: ['1515']
  }
}, {
  path: 'recommend/add_recommend',
  component: _import('database/recommend/add_recommend'),
  name: 'add_recommend',
  meta: {
    title: '新增民族推荐位',
    routerIds: ['1515']
  },
  hidden: true
}, {
  path: 'recommend/content',
  component: _import('database/recommend/content'),
  name: 'content',
  meta: {
    title: '推荐内容',
    routerIds: ['1515']
  },
  hidden: true
}, {
  path: 'recommend/edit',
  component: _import('database/recommend/edit'),
  name: 'edit',
  meta: {
    title: '修改推荐内容',
    routerIds: ['1515']
  },
  hidden: true
}, {
  path: 'video',
  component: _import('database/video/index'),
  name: 'video',
  meta: {
    title: '视频素材',
    routerIds: ['1516']
  }
}, {
  path: 'video/create_video',
  component: _import('database/video/create_video'),
  name: 'create_video',
  meta: {
    title: '新增视频素材',
    routerIds: ['1516']
  },
  hidden: true
}, {
  path: 'audio',
  component: _import('database/audio/index'),
  name: 'audio',
  meta: {
    title: '音频素材',
    routerIds: ['1517']
  },
}, {
  path: 'audio/create_audio',
  component: _import('database/audio/create_audio'),
  name: 'create_audio',
  meta: {
    title: '新增音频素材',
    routerIds: ['1517']
  },
  hidden: true
}, {
  path: 'pdf',
  component: _import('database/pdf/index'),
  name: 'pdf',
  meta: {
    title: 'PDF素材',
    routerIds: ['1518']
  },
}, {
  path: 'pdf/details',
  component: _import('database/pdf/details'),
  name: 'details',
  meta: {
    title: '查看PDF素材',
    routerIds: ['1518']
  },
  hidden: true
}, {
  path: 'article/edit_article',
  component: _import('database/article/edit_article'),
  name: 'edit_article',
  meta: {
    title: '修改视频库',
    routerIds: ['1511']
  },
  hidden: true
}, {
  path: 'label/basics_theory',
  component: _import('database/label/basics_theory'),
  name: 'basics_theory',
  meta: {
    title: '基础理论',
    routerIds: ['1514']
  },
  hidden: true
}, {
  path: 'create',
  component: _import('database/create'),
  name: 'create',
  meta: {
    title: '新增文章',
    routerIds: ['1512']
  },
  hidden: true
}, {
  path: 'mongolian_create',
  component: _import('database/mongolian/create'),
  name: 'mongolian_create',
  meta: {
    title: '新增蒙文文章',
    routerIds: ['1512']
  },
  hidden: true
}]
  },
  {
    path: '/websitemanage',
    component: Layout,
    redirect: '/websitemanage/classify',
    name: 'websitemanage',
    meta: {
      title: '平台管理',
      icon: 'international',
      routerIds: ['03']
    },
    children: [{
      path: 'nation',
      component: _import('websitemanage/nation/index'),
      name: 'nation',
      meta: {
        title: '民族主页',
        routerIds: ['0310']
      }
    }, {
      path: 'nation/add_nation',
      component: _import('websitemanage/nation/add_nation'),
      name: 'add_nation',
      meta: {
        title: '新增民族主页',
        routerIds: ['0310']
      },
      hidden: true
    }, {
      path: 'nation/edit',
      component: _import('websitemanage/nation/add_nation'),
      name: 'edit',
      meta: {
        title: '设置民族主页',
        routerIds: ['0310']
      },
      hidden: true
    }, {
      path: 'nation/edit',
      component: _import('websitemanage/nation/add_nation'),
      name: 'edit',
      meta: {
        title: '查看民族主页',
        routerIds: ['0310']
      },
      hidden: true
    },


      // {
      //     path: 'classify',
      //     component: _import('websitemanage/classify/index'),
      //     name: 'defineClassify',
      //     meta: {
      //         title: '自定义分类管理',
      //         routerIds: ['0301']
      //     }
      // },
      // {
      //     hidden: true,
      //     path: 'classify/recommended_goods',
      //     component: _import('websitemanage/classify/recommended_goods'),
      //     name: 'recommended_goods',
      //     meta: {
      //         title: '推荐商品管理',
      //         routerIds: ['0301']
      //     }
      // },
      {
        path: '/websitemanage/board_manage',
        component: _import('websitemanage/board_manage/index'),
        redirect: '/websitemanage/board_manage/index',
        meta: {
          title: '平台公告管理',
          routerIds: ['0302']
        },
        name: 'board_manage',
        children: [{
          path: 'index',
          component: _import('websitemanage/board_manage/board_list'),
          name: 'index',
          meta: {
            title: '栏目管理',
            routerIds: ['030201']
          }
        },
          {
            path: 'board_content',
            component: _import('websitemanage/board_manage/board_content/index'),
            name: 'board_content',
            meta: {
              title: '内容管理',
              routerIds: ['030202']
            }
          }, {
            hidden: true,
            path: 'board_content/content_detail',
            component: _import('websitemanage/board_manage/board_content/add_edit_board_content'),
            name: 'content_detail',
            meta: {
              title: '内容详情',
              routerIds: ['030202']
            }
          }
        ]
      },
      {
        hidden: true,
        path: '/add_edit_board_content',
        component: _import('websitemanage/board_manage/board_content/add_edit_board_content'),
        name: 'add_edit_board_content',
        meta: {
          title: '内容管理',
          routerIds: ['030202']
        }
      },
      // {
      //     path: 'recommendation_management',
      //     component: _import('websitemanage/recommendation_management/index'),
      //     name: 'recommendation_management',
      //     meta: {
      //         title: '平台推荐位管理',
      //         routerIds: ['0303']
      //     }
      // },
      // {
      //     hidden: true,
      //     path: 'recommendation_management/recommendation',
      //     component: _import('websitemanage/recommendation_management/recommendation'),
      //     name: 'recommendation',
      //     meta: {
      //         title: '平台推荐内容管理',
      //         routerIds: ['0303']
      //     }
      // },
      {
        path: 'common_position',
        component: _import('websitemanage/common_position/index'),
        name: 'common_position',
        meta: {
          title: '公共推荐位',
          routerIds: ['0312']
        }
      },
      {
        path: 'common_position/create',
        component: _import('websitemanage/common_position/create'),
        name: 'create',
        meta: {
          title: '添加推荐位',
          routerIds: ['0312']
        },
        hidden: true
      },

      {
        path: 'ad_pos',
        component: _import('websitemanage/ad_pos/index'),
        name: 'ad_pos',
        meta: {
          title: '平台广告位管理',
          routerIds: ['0304']
        }
      },
      {
        hidden: true,
        path: 'ad_pos/ad_content',
        component: _import('websitemanage/ad_pos/ad_content/index'),
        name: 'ad_content',
        meta: {
          title: '广告内容管理',
          routerIds: ['0304']
        }
      }, {
        hidden: true,
        path: 'ad_pos/ad_edit',
        component: _import('websitemanage/ad_pos/ad_edit'),
        name: 'ad_edit',
        meta: {
          title: '添加广告内容',
          routerIds: ['0304']
        }
      }, {
        hidden: true,
        path: 'ad_pos/ad_edit',
        component: _import('websitemanage/ad_pos/ad_edit'),
        name: 'ad_edit',
        meta: {
          title: '添加广告内容',
          routerIds: ['0304']
        }
      },
      // {
      //     path: 'hot_keyword',
      //     component: _import('websitemanage/hot_keyword'),
      //     name: 'hot_keyword',
      //     meta: {
      //         title: '热词管理',
      //         routerIds: ['0305']
      //     }
      // },
      {
        path: 'contribute',
        component: _import('websitemanage/contribute/index'),
        name: 'contribute',
        meta: {
          title: '在线投稿管理',
          routerIds: ['0311']
        }
      },
      {
        path: 'contribute/edit',
        component: _import('websitemanage/contribute/edit'),
        name: 'edit',
        meta: {
          title: '查看稿件',
          routerIds: ['0311']
        },
        hidden: true
      },
      {
        path: 'msg_management',
        component: _import('websitemanage/msg_management'),
        name: 'msg_management',
        meta: {
          title: '平台留言管理',
          routerIds: ['0306']
        }
      }, {
        path: 'error_management',
        component: _import('websitemanage/error_management'),
        name: 'error_management',
        meta: {
          title: '内容纠错管理',
          routerIds: ['0307']
        }
      }, {
        path: 'footer_management',
        component: _import('websitemanage/footer_management/index'),
        name: 'footer_management',
        meta: {
          title: '平台页脚管理',
          routerIds: ['0308']
        }
      }, {
        hidden: true,
        path: 'footer_management/edit_footer',
        component: _import('websitemanage/footer_management/edit_footer'),
        name: 'edit_footer',
        meta: {
          title: '编辑页脚',
          routerIds: ['0308']
        }
      }, {
        path: 'friendlink_management',
        component: _import('websitemanage/friendlink_management/index'),
        name: 'friendlink_management',
        meta: {
          title: '友情链接管理',
          routerIds: ['0309']
        }
      }, {
        hidden: true,
        path: 'friendlink_management/edit_friendlink',
        component: _import('websitemanage/friendlink_management/edit_friendlink'),
        name: 'edit_friendlink',
        meta: {
          title: '编辑友情链接',
          routerIds: ['0309']
        }
      }
    ]
  },
  {
    path: '/orders_management',
    component: Layout,
    redirect: '/orders_management/order',
    alwaysShow: true,
    meta: {
      title: '订单管理',
      icon: 'form',
      routerIds: ['05']
    },
    children: [{
      path: 'order',
      component: _import('orders_management/order/index'),
      name: 'order',
      meta: {
        title: '订单管理',
        routerIds: ['0501']
      }
    },
      {
        hidden: true,
        path: 'order/order_processing',
        component: _import('orders_management/order/order_processing'),
        name: 'order_processing',
        meta: {
          title: '订单处理',
          routerIds: ['0501']
        }
      }, {
        path: 'order/invoice',
        component: _import('orders_management/order/invoice'),
        name: 'invoice',
        meta: {
          title: '发票管理',
          routerIds: ['0502']
        }
      },
      // ,
      // {
      //     path: 'pick_order',
      //     component: _import('orders_management/pick_order/index'),
      //     name: 'pick_order',
      //     meta: {
      //         title: '配货单管理',
      //         routerIds: ['0502']
      //     }
      // },
      // {
      //     hidden: true,
      //     path: 'pick_order/pick_processing',
      //     component: _import('orders_management/pick_order/pick_processing'),
      //     name: 'pick_processing',
      //     meta: {
      //         title: '配货单管理',
      //         routerIds: ['0502']
      //     }
      // }, {
      //     hidden: true,
      //     path: 'pick_order/print',
      //     component: _import('orders_management/pick_order/print'),
      //     name: 'print',
      //     meta: {
      //         title: '打印配货单',
      //         routerIds: ['0502']
      //     }
      // }, {
      //     path: 'refund_order',
      //     component: _import('orders_management/refund_order'),
      //     name: 'refund_order',
      //     meta: {
      //         title: '退款单管理',
      //         routerIds: ['0503']
      //     }
      // },
      // {
      //     path: 'refund_goods',
      //     component: _import('orders_management/refund_goods/index'),
      //     name: 'refund_goods',
      //     meta: {
      //         title: '退货单管理',
      //         routerIds: ['0504']
      //     }
      // },
      // {
      //     hidden: true,
      //     path: 'refund_goods/goods_processing',
      //     component: _import('orders_management/refund_goods/goods_processing'),
      //     name: 'goods_processing',
      //     meta: {
      //         title: '退货单管理',
      //         routerIds: ['0504']
      //     }
      // },
      // {
      //     path: 'invoice',
      //     component: _import('orders_management/invoice'),
      //     name: 'invoice',
      //     meta: {
      //         title: '发票记录管理',
      //         routerIds: ['0505']
      //     }
      // }
    ]
  },
  {
    path: '/marketmanage',
    component: Layout,
    redirect: '/marketmanage/prepaid_card',
    alwaysShow: true,
    meta: {
      title: '营销管理',
      icon: 'shoppingCard',
      routerIds: ['06']
    },
    children: [{
      path: 'activity',
      component: _import('marketmanage/activity/index'),
      name: 'activity',
      meta: {
        title: '促销活动',
        routerIds: ['0606']
      }
    },
      {
        path: 'activity/create',
        component: _import('marketmanage/activity/create'),
        name: 'create',
        meta: {
          title: '新增活动',
          routerIds: ['0606']
        },
        hidden: true
      },
      {
        path: 'activity/content',
        component: _import('marketmanage/activity/content'),
        name: 'content',
        meta: {
          title: '促销活动内容',
          routerIds: ['0606']
        },
        hidden: true
      },
      // {
      //     path: 'prepaid_card',
      //     component: _import('marketmanage/prepaid_card'),
      //     name: 'prepaid_card',
      //     meta: {
      //         title: '充值卡管理',
      //         routerIds: ['0605']
      //     }
      // }, {
      //     path: 'sales_group',
      //     component: _import('marketmanage/sales_group/index'),
      //     name: 'sales_group',
      //     meta: {
      //         title: '促销组管理',
      //         routerIds: ['0603']
      //     }
      // }, {
      //     hidden: true,
      //     path: 'sales_group/sales_management',
      //     component: _import('marketmanage/sales_group/sales_management'),
      //     name: 'sales_management',
      //     meta: {
      //         title: '促销组详情',
      //         routerIds: ['0603']
      //     }
      // }, {
      //     path: 'recommendation_group',
      //     component: _import('marketmanage/recommendation_group/index'),
      //     name: 'recommendation_group',
      //     meta: {
      //         title: '推荐组管理',
      //         routerIds: ['0604']
      //     }
      // }, {
      //     hidden: true,
      //     path: 'recommendation_group/recommendation_group_management',
      //     component: _import('marketmanage/recommendation_group/recommendation_group_management'),
      //     name: 'recommendation_group_management',
      //     meta: {
      //         title: '推荐组详情',
      //         routerIds: ['0604']
      //     }
      // }
    ]
  },
  {
    path: '/societymanage',
    component: Layout,
    redirect: '/societymanage/resource',
    alwaysShow: true,
    meta: {
      title: '社群管理',
      icon: 'table',
      routerIds: ['14']
    },
    children: [{
      path: 'resource',
      component: _import('societymanage/resource/index'),
      name: 'resource',
      meta: {
        title: '资源评论',
        routerIds: ['1401']
      }
    }, {
      path: 'resource/review',
      component: _import('societymanage/resource/review'),
      name: 'review',
      meta: {
        title: '评论详情',
        routerIds: ['1401']
      },
      hidden: true
    }]

  },
  {
    path: '/membermanage',
    component: Layout,
    redirect: '/membermanage/person_member',
    alwaysShow: true,
    meta: {
      title: '会员管理',
      icon: 'peoples',
      routerIds: ['07']
    },
    children: [{
      path: 'person_member',
      component: _import('membermanage/person_member/index'),
      name: 'person_member',
      meta: {
        title: '个人会员管理',
        routerIds: ['0701']
      }
    }, {
      hidden: true,
      path: 'person_member/balance_check',
      component: _import('membermanage/person_member/balance_check'),
      props: {
        accountMember: 'str'
      },
      name: 'balance_check',
      meta: {
        title: '查询消费记录',
        routerIds: ['0701']
      }
    }, {
      hidden: true,
      path: 'person_member/score_check',
      component: _import('membermanage/person_member/score_check'),
      props: {
        accountMember: 'str'
      },
      name: 'score_check',
      meta: {
        title: '查询积分',
        routerIds: ['0701']
      }
    }, {
      path: 'expert',
      component: _import('membermanage/expert/index'),
      name: 'expert',
      meta: {
        title: '专家会员管理',
        routerIds: ['0702']
      }
    },
      {
        path: 'oranization_code',
        component: _import('membermanage/oranization_code'),
        name: 'oranization_code',
        meta: {
          title: '机构码管理',
          routerIds: ['0703']
        }
      }, {
        path: 'oranization_member',
        component: _import('membermanage/oranization_member'),
        name: 'oranization_member',
        meta: {
          title: '机构会员管理',
          routerIds: ['0704']
        }
      }, {
        path: 'mail',
        component: _import('membermanage/mail'),
        name: 'mail',
        meta: {
          title: '站内信管理',
          routerIds: ['0705']
        }
      }, {
        path: 'member_login',
        component: _import('membermanage/member_login'),
        name: 'member_login',
        meta: {
          title: '会员登录记录',
          routerIds: ['0706']
        }
      }, {
        path: 'mirroring',
        component: _import('membermanage/mirroring'),
        name: 'mirroring',
        meta: {
          title: '镜像库管理',
          routerIds: ['0707']
        }
      }
    ]
  },
  {
    path: '/authorizationmanage',
    component: Layout,
    redirect: '/authorizationmanage/department_management',
    alwaysShow: true,
    meta: {
      title: '权限管理',
      icon: 'lock',
      routerIds: ['08']
    },
    children: [{
      path: 'department_management',
      component: _import('authorizationmanage/department_management'),
      name: 'department_management',
      meta: {
        title: '部门管理',
        routerIds: ['0806']
      }
    }, {
      path: 'role_management',
      component: _import('authorizationmanage/role_management'),
      name: 'role_management',
      meta: {
        title: '角色管理',
        routerIds: ['0802']
      }
    }, {
      path: 'user_management',
      component: _import('authorizationmanage/user_management'),
      name: 'user_management',
      meta: {
        title: '用户管理',
        routerIds: ['0801']
      }
    }, {
      path: 'module_management',
      component: _import('authorizationmanage/module_management'),
      name: 'module_management',
      meta: {
        title: '模块管理',
        routerIds: ['0804']
      }
    }, {
      path: 'button_management',
      component: _import('authorizationmanage/button_management'),
      name: 'button_management',
      meta: {
        title: '按钮管理',
        routerIds: ['0805']
      }
    }]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/site_param',
    alwaysShow: true,
    meta: {
      title: '系统管理',
      icon: 'component',
      routerIds: ['09']
    },
    children: [{
      path: 'siteparam',
      component: _import('system/site_param/index'),
      name: 'siteparam',
      meta: {
        title: '平台参数设置',
        routerIds: ['0909']
      }
    }, {
      path: 'system_security',
      component: _import('system/system_security'),
      name: 'system_security',
      meta: {
        title: '系统安全设置',
        routerIds: ['0910']
      }
    },
      // {
      //     path: 'online_payment',
      //     component: _import('system/online_payment'),
      //     name: 'online_payment',
      //     meta: {
      //         title: '在线支付管理',
      //         routerIds: ['0903']
      //     }
      // },
      {
        path: 'update_search',
        component: _import('system/update_search'),
        name: 'update_search',
        meta: {
          title: '更新索引',
          routerIds: ['0911']
        }
      }, {
        path: 'data_dictionary',
        component: _import('system/data_dictionary'),
        name: 'data_dictionary',
        meta: {
          title: '数据字典管理',
          routerIds: ['0904']
        }
      }, {
        path: 'systemlog',
        component: _import('system/systemlog'),
        name: 'systemlog',
        meta: {
          title: '系统日志管理',
          routerIds: ['0908']
        }
      }

    ]
  },




  // {
  //     path: '/stockmanage',
  //     component: Layout,
  //     redirect: '/stockmanage/supplier',
  //     alwaysShow: true,
  //     meta: { title: '库存管理', icon: 'clipboard', routerIds: ['10'] },
  //     children: [{
  //         path: 'supplier',
  //         component: _import('stockmanage/supplier'),
  //         name: 'supplier',
  //         meta: { title: '供应商管理', routerIds: ['1015'] }
  //     }, {
  //         path: 'warehouse',
  //         component: _import('stockmanage/warehouse/index'),
  //         name: 'warehouse',
  //         meta: { title: '库区管理', routerIds: ['1014'] }
  //     }, {
  //         hidden: true,
  //         path: 'warehouse/storage_location',
  //         component: _import('stockmanage/warehouse/storage_location'),
  //         name: 'storage_location',
  //         meta: { title: '库位管理', routerIds: ['1014'] }
  //     }, {
  //         path: 'purchase',
  //         component: _import('stockmanage/purchase/index'),
  //         name: 'purchase',
  //         meta: { title: '采购单管理', routerIds: ['1009'] }
  //     }, {
  //         hidden: true,
  //         path: 'purchase/create_purchase',
  //         component: _import('stockmanage/purchase/create_purchase'),
  //         name: 'create_purchase',
  //         meta: { title: '创建采购单', routerIds: ['1009'] }
  //     }, {
  //         hidden: true,
  //         path: 'purchase/details_purchase',
  //         component: _import('stockmanage/purchase/details_purchase'),
  //         name: 'details_purchase',
  //         meta: { title: '查看采购单', routerIds: ['1009'] }
  //     }, {
  //         path: 'storage',
  //         component: _import('stockmanage/storage/index'),
  //         name: 'storage',
  //         meta: { title: '入库单管理', routerIds: ['1004'] }
  //     }, {
  //         hidden: true,
  //         path: 'storage/create_storage',
  //         component: _import('stockmanage/storage/create_storage'),
  //         name: 'create_storage',
  //         meta: { title: '创建入库单', routerIds: ['1004'] }
  //     }, {
  //         hidden: true,
  //         path: 'storage/details_storage',
  //         component: _import('stockmanage/storage/details_storage'),
  //         name: 'details_storage',
  //         meta: { title: '查看入库单', routerIds: ['1004'] }
  //     }, {
  //         path: 'delivery',
  //         component: _import('stockmanage/delivery/index'),
  //         name: 'delivery',
  //         meta: { title: '出库单管理', routerIds: ['1007'] }
  //     }, {
  //         hidden: true,
  //         path: 'delivery/create_delivery',
  //         component: _import('stockmanage/delivery/create_delivery'),
  //         name: 'create-delivery',
  //         meta: { title: '创建出库单', routerIds: ['1007'] }
  //     }, {
  //         hidden: true,
  //         path: 'delivery/details_delivery',
  //         component: _import('stockmanage/delivery/details_delivery'),
  //         name: 'details-delivery',
  //         meta: { title: '查看出库单', routerIds: ['1007'] }
  //     }, {
  //         path: 'repertory',
  //         component: _import('stockmanage/repertory'),
  //         name: 'repertory',
  //         meta: { title: '库存管理', routerIds: ['1002'] }
  //     }, {
  //         path: 'transfer',
  //         component: _import('stockmanage/transfer/index'),
  //         name: 'transfer',
  //         meta: { title: '调拨单管理', routerIds: ['1013'] }
  //     }, {
  //         hidden: true,
  //         path: 'transfer/create_transfer',
  //         component: _import('stockmanage/transfer/create_transfer'),
  //         name: 'create_transfer',
  //         meta: { title: '新增调拨单', routerIds: ['1013'] }
  //     }, {
  //         hidden: true,
  //         path: 'transfer/details_transfer',
  //         component: _import('stockmanage/transfer/details_transfer'),
  //         name: 'details_transfer',
  //         meta: { title: '查看调拨单', routerIds: ['1013'] }
  //     }, {
  //         path: 'inventory',
  //         component: _import('stockmanage/inventory/index'),
  //         name: 'inventory',
  //         meta: { title: '库存盘点', routerIds: ['1001'] }
  //     }, {
  //         hidden: true,
  //         path: 'inventory/details_inventory',
  //         component: _import('stockmanage/inventory/details_inventory'),
  //         name: 'details_inventory',
  //         meta: { title: '查看库存盘点', routerIds: ['1001'] }
  //     }, {
  //         hidden: true,
  //         path: 'inventory/update_inventory',
  //         component: _import('stockmanage/inventory/update_inventory'),
  //         name: 'update_inventory',
  //         meta: { title: '盘点', routerIds: ['1001'] }
  //     }, {
  //         hidden: true,
  //         path: 'inventory/handle_exception',
  //         component: _import('stockmanage/inventory/handle_exception'),
  //         name: 'handle_exception',
  //         meta: { title: '处理异常', routerIds: ['1001'] }
  //     }, {
  //         path: 'returnpurchase',
  //         component: _import('stockmanage/returnpurchase/index'),
  //         name: 'returnpurchase',
  //         meta: { title: '采购退货管理', routerIds: ['1011'] }
  //     }, {
  //         hidden: true,
  //         path: 'returnpurchase/create_returnpurchase',
  //         component: _import('stockmanage/returnpurchase/create_returnpurchase'),
  //         name: 'create_returnpurchase',
  //         meta: { title: '新增采购退货记录', routerIds: ['1011'] }
  //     }, {
  //         hidden: true,
  //         path: 'returnpurchase/details_returnpurchase',
  //         component: _import('stockmanage/returnpurchase/details_returnpurchase'),
  //         name: 'details_returnpurchase',
  //         meta: { title: '查看采购退货记录', routerIds: ['1011'] }
  //     }, {
  //         path: 'storage_book',
  //         component: _import('stockmanage/storage_book'),
  //         name: 'storage_book',
  //         meta: { title: '入库单书', routerIds: ['1017'] }
  //     }, {
  //         path: 'delivery_book',
  //         component: _import('stockmanage/delivery_book'),
  //         name: 'delivery_book',
  //         meta: { title: '出库单书', routerIds: ['1016'] }
  //     }, {
  //         path: 'wdb_storage',
  //         component: _import('stockmanage/wdb_storage'),
  //         name: 'wdb_storage',
  //         meta: { title: '网店宝库存管理', routerIds: ['1018'] }
  //     }]
  // },
  // {
  //     path: '/bookinfomanage',
  //     component: Layout,
  //     redirect: '/bookinfomanage/goods_info',
  //     alwaysShow: true,
  //     meta: {
  //         title: '商品管理',
  //         icon: 'documentation',
  //         routerIds: ['04']
  //     },
  //     children: [{
  //         path: 'goods_info',
  //         component: _import('bookinfomanage/goods_info/index'),
  //         name: 'goods_info',
  //         meta: {
  //             title: '商品信息管理',
  //             routerIds: ['0402']
  //         }
  //     }, {
  //         hidden: true,
  //         path: 'goods_info/add_edit_goods',
  //         component: _import('bookinfomanage/goods_info/add_edit_goods'),
  //         name: 'add_edit_goods',
  //         meta: {
  //             title: '商品详情',
  //             routerIds: ['0402']
  //         }
  //     }, {
  //         path: 'import_goods',
  //         component: _import('bookinfomanage/import_goods/index'),
  //         name: 'import_goods',
  //         meta: {
  //             title: '导入商品管理',
  //             routerIds: ['0410']
  //         }
  //     }, {
  //         hidden: true,
  //         path: 'import_goods/edit_import_data',
  //         component: _import('bookinfomanage/import_goods/edit_import_data'),
  //         name: 'edit_import_data',
  //         meta: {
  //             title: '导入详情',
  //             routerIds: ['0410']
  //         }
  //     }, {
  //         path: 'package_management',
  //         component: _import('bookinfomanage/package_management/index'),
  //         name: 'package_management',
  //         meta: {
  //             title: '套餐管理',
  //             routerIds: ['0411']
  //         }
  //     }, {
  //         hidden: true,
  //         path: 'package_management/add_edit_package',
  //         component: _import('bookinfomanage/package_management/add_edit_package'),
  //         name: 'add_edit_package',
  //         meta: {
  //             title: '套餐详情',
  //             routerIds: ['0411']
  //         }
  //     }, {
  //         path: 'publisher_management',
  //         component: _import('bookinfomanage/publisher_management'),
  //         name: 'publisher_management',
  //         meta: {
  //             title: '出版社管理',
  //             routerIds: ['0412']
  //         }
  //     }, {
  //         path: 'security_code',
  //         component: _import('bookinfomanage/security_code/index'),
  //         name: 'security_code',
  //         meta: {
  //             title: '防伪码管理',
  //             routerIds: ['0413']
  //         }
  //     }, {
  //         hidden: true,
  //         path: 'security_code/code_management',
  //         component: _import('bookinfomanage/security_code/code_management'),
  //         name: 'code_management',
  //         meta: {
  //             title: '防伪码和二维码管理',
  //             routerIds: ['0413']
  //         }
  //     }]
  // },

  // {
  //     path: '/postage',
  //     component: Layout,
  //     redirect: '/postage/user',
  //     alwaysShow: true,
  //     meta: {
  //         title: '邮费管理',
  //         icon: 'money',
  //         routerIds: ['11']
  //     },
  //     children: [{
  //         path: 'user',
  //         component: _import('postage/user/index'),
  //         name: 'user',
  //         meta: {
  //             title: '用户邮费',
  //             routerIds: ['1101']
  //         }
  //     }, {
  //         hidden: true,
  //         path: 'user/add_postage',
  //         component: _import('postage/user/add_postage'),
  //         name: 'add_postage',
  //         meta: {
  //             title: '添加配送方式',
  //             routerIds: ['1101']
  //         }
  //     }, {
  //         path: 'settle',
  //         component: _import('postage/settle/index'),
  //         name: 'settle',
  //         meta: {
  //             title: '结算邮费',
  //             routerIds: ['1102']
  //         }
  //     }, {
  //         hidden: true,
  //         path: 'settle/add_settle',
  //         component: _import('postage/settle/add_settle'),
  //         name: 'add_settle',
  //         meta: {
  //             title: '创建邮费规则',
  //             routerIds: ['1102']
  //         }
  //     }]
  // },


  // {
  //     path: '/resource_management',
  //     component: Layout,
  //     redirect: '/resource_management/video',
  //     alwaysShow: true,
  //     meta: {
  //         title: '资源管理',
  //         icon: 'form',
  //         routerIds: ['01']
  //     },
  //     children: [{
  //             path: 'video',
  //             component: _import('resource_management/video/index'),
  //             name: 'video',
  //             meta: {
  //                 title: '视频库',
  //                 routerIds: ['0104']
  //             }
  //         },
  //         {
  //             hidden: true,
  //             path: 'video/add_video',
  //             component: _import('resource_management/video/add_video'),
  //             name: 'add_video',
  //             meta: {
  //                 title: '新增视频库',
  //                 routerIds: ['0104']
  //             }
  //         },
  //         {
  //             path: 'course',
  //             component: _import('resource_management/course/index'),
  //             name: 'course',
  //             meta: {
  //                 title: '课程库',
  //                 routerIds: ['0105']
  //             }
  //         },
  //         {
  //             hidden: true,
  //             path: 'course/add_course',
  //             component: _import('resource_management/course/add_course'),
  //             name: 'add_course',
  //             meta: {
  //                 title: '新增课程库',
  //                 routerIds: ['0105']
  //             }
  //         },
  //         {
  //             hidden: true,
  //             path: 'course/set_course',
  //             component: _import('resource_management/course/set_course'),
  //             name: 'set_course',
  //             meta: {
  //                 title: '课程内容管理',
  //                 routerIds: ['0105']
  //             }
  //         },
  //     ]
  // },
  // {
  //     path: '/statistic_management',
  //     component: Layout,
  //     redirect: '/statistic_management/list_details',
  //     alwaysShow: true,
  //     meta: {
  //         title: '统计',
  //         icon: 'table',
  //         routerIds: ['12']
  //     },
  //     children: [{
  //             path: 'list_details',
  //             component: _import('statistic_management/list_details'),
  //             name: 'list_details',
  //             meta: {
  //                 title: '清单统计',
  //                 routerIds: ['1201']
  //             }
  //         },
  //         {
  //             path: 'book_details',
  //             component: _import('statistic_management/book_details'),
  //             name: 'book_details',
  //             meta: {
  //                 title: '单书统计',
  //                 routerIds: ['1202']
  //             }
  //         }
  //     ]
  // },


  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]
