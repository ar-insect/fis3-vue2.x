import { Vue, iView, VueAxios, axios, VueRouter, Vuex, VueI18n } from '../widget/common/common.js'
import Routers from 'widget/router';
// import Locales from 'widget/locale';
import Util from 'widget/util';
import App from './layout.vue';
import 'iview/dist/styles/iview.css';
// import zhLocale from 'iview/src/locale/lang/zh-CN';
// import enLocale from 'iview/src/locale/lang/en-US';

Vue.use(VueRouter);
Vue.use(Vuex);
// Vue.use(VueI18n);
Vue.use(iView);

// // 自动设置语言
// const navLang = navigator.language;
// const localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false;
// const lang = window.localStorage.getItem('language') || localLang || 'zh-CN';

// Vue.config.lang = lang;

// // 多语言配置
// const locales = Locales;
// const mergeZH = Object.assign(zhLocale, locales['zh-CN']);
// const mergeEN = Object.assign(enLocale, locales['en-US']);
// Vue.locale('zh-CN', mergeZH);
// Vue.locale('en-US', mergeEN);

// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    next();
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});


const store = new Vuex.Store({
    state: {

    },
    getters: {

    },
    mutations: {

    },
    actions: {

    }
});

new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App)
});
