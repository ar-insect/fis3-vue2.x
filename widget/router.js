
const routers = [
  {
      path: '/',
      meta: {
          title: 'iview demo'
      },
      component: (resolve) => require(['../app/page/index.vue'], resolve)
  },
  {
      path: '/bar',
      meta: {
          title: 'iview demo'
      },
      component: (resolve) => require(['../app/page/bar.vue'], resolve)
  },
  {
      path: '/tab',
      meta: {
          title: 'iview tab'
      },
      component: (resolve) => require(['../app/page/tab.vue'], resolve)
  }
];
export default routers;