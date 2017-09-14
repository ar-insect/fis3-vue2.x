<template>
    <div span="24" class="index">
        <Row type="flex" justify="center" align="middle">
            <Col span="24">
                <h1>
                   首页
                </h1>
                <h2>
                    <p>Welcome to your iView app!</p>
                   <Button type="primary" @click="modal1 = true">显示对话框</Button>
                    <Modal
                        v-model="modal1"
                        title="普通的Modal对话框标题"
                        @on-ok="ok"
                        @on-cancel="cancel">
                        <p>对话框内容</p>
                        <p>对话框内容</p>
                        <p>对话框内容</p>
                    </Modal>
                </h2>
            </Col>
        </Row>
    </div>
</template>
<style scoped lang="sass">
    .index {
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        text-align: center;
        h1 {
            height: 150px;
             img {
                height: 100%;
            }
        }
        h2{
             color: #666;
            margin-bottom: 200px;
            p {
                margin: 0 0 50px;
                color: green;
            }
        } 
        .ivu-row-flex {
            height: 100%;
        }
    }
</style>
<script>
    export default {
       data () {
            return {
                modal1: false
            }
        },
        methods: {
            ok () {
                this.$Message.info('点击了确定');
            },
            cancel () {
                this.$Message.info('点击了取消');
            }
        }
    };
</script>