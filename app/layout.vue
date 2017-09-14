<template>
    <!--body 入口-->
    <div class="layout">
        <!--头部导航-->
        <top></top>    
        <!--主体-->
        <Row class="layout-wrap">
            <Col class="nav-left">
                <Menu :theme="theme3" active-name="1" width="auto">
                    <MenuGroup>
                        <MenuItem name="1">
                            <router-link to="/" class="delivery" >
                               <Icon type="document-text"></Icon> 首页
                            </router-link>
                        </MenuItem>
                        <MenuItem name="2">
                            <router-link to="/bar" class="" >
                                <Icon type="chatbubbles"></Icon> 常用组件
                            </router-link>
                        </MenuItem>
                         <MenuItem name="3">
                            <router-link to="/tab" class="">
                               <Icon type="gear-a"></Icon> 使用方法
                            </router-link>
                        </MenuItem>
                    </MenuGroup>
                 </Menu>
            </Col>
            <Col class="content-right">
                <router-view class="min-width"></router-view>
            </Col>
        </Row>
    </div>
</template>
<style lang="sass">
    @import "../static/style.css"
</style>

<script>
    //引入模块
    import Top from 'widget/top.vue'

    export default {
        components: {
            Top
        },
        data() {
            return {
                theme3: 'dark'
            };
        },
        mounted() {

        },
        beforeDestroy() {

        }
      
    };
</script>