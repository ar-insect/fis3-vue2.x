const routers = [
    {
        path: '',
        alias: '/Home/NewIndex',
        meta: {
            title: '首页',
        },
        component: (resolve) => require(['app/page/index.vue'], resolve),
    },
    {
        path: '/recharge',
        name: 'recharge',
        meta: {
            title: '充值记录',
        },
        component: (resolve) => require(['app/page/recharge.vue'], resolve),
    },
    {
        path: '/payment',
        name: 'payment',
        meta: {
            title: '支付记录',
        },
        component: (resolve) => require(['app/page/payment.vue'], resolve),
    },
    {
        path: '/bill',
        name: 'bill',
        meta: {
            title: '支付单',
        },
        component: (resolve) => require(['app/page/bill.vue'], resolve),
    },
    {
        path: '/card',
        name: 'card',
        meta: {
            title: '预付卡',
        },
        component: (resolve) => require(['app/page/card.vue'], resolve),
    },
    {
        path: '/test',
        name: 'test',
        meta: {
            title: '预付卡',
        },
        component: (resolve) => require(['app/page/test.vue'], resolve),
    },
];

export default routers;
