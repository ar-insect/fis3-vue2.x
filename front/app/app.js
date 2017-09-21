import { Vue, iView, VueAxios, axios, VueRouter, Vuex } from 'widget/common/common';
import Routers from 'widget/router';
import Util from 'widget/util';
import App from './layout.vue';
import 'iview/dist/styles/iview.css';

Vue.use(VueRouter);
Vue.use(VueAxios, axios);
Vue.use(iView);

// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: Routers,
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    next();
});

router.afterEach((to, from, next) => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

new Vue({
    el: '#app',
    router: router,
    render: (h) => h(App),
});
