<template>
    <div>
        <Row>
            <Col span="24">
            <!--建卡对话框-->
            <div style="float:left">
                <Button type="primary" @click="showCreateModel = true">建卡</Button>
                <Modal v-model="showCreateModel" title="开卡">
                    <Form ref="formValidate" :model="formValidate"  :rules="ruleValidate" :label-width="80">
                        <Form-item label="卡号" prop="cardno">
                            <Input  v-model="formValidate.cardno" placeholder="卡号由服务端生成"></Input>
                        </Form-item>
                        <Form-item label="机构" prop="agencyid">

                            <Select v-model="formValidate.agencyid" placeholder="请选择所在地">
                                <Option v-for="option in agencys" :value="option.value" :key="option.value">
                                    {{ option.text }}
                                </Option>
                            </Select>
                        </Form-item>
                        <Form-item label="手机号" prop="phone">
                            <Input   v-model="formValidate.phone" placeholder="请输入手机号"></Input>
                        </Form-item>
                        <Form-item label="开卡金额" prop="amount">
                            <Input  v-model="formValidate.amount" placeholder="请输入金额" number></Input>
                        </Form-item>                        
                        <Form-item>
                            <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                            <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
                        </Form-item>
                    </Form>
                </Modal>
            </div>
            <!-- 搜索框 -->
            <div style="float: right;">
                <Poptip placement="bottom-end"  v-model="showSearch">
                    <Button>搜索</Button>
                    <div slot="title">
                        <i>搜索条件</i>
                    </div>
                    <div slot="content">
                        <Form label-position="right" :label-width="80">
                            <Form-item label="手机号">
                                <Input v-model="phone" size="small" style="width: 300px"></Input>
                            </Form-item>
                            <Form-item label="卡号">
                                <Input v-model="cardNo" size="small" style="width: 300px"></Input>
                            </Form-item>
                            <Form-item label="状态">
                                <Select v-model="state" style="width:200px">
                                    <Option value="0">正常</Option>
                                    <Option value="1">挂失</Option>
                                    <Option value="2">冻结</Option>
                                    <Option value="3">作废</Option>
                                </Select>
                            </Form-item>
                            <Form-item label="类型">
                                <Select v-model="cardType" style="width:200px">
                                    <Option value="1">预付卡</Option>
                                    <Option value="2">次卡</Option>
                                </Select>
                            </Form-item>
                            <Form-item>
                                <Button type="primary" @click="search">确定</Button>
                                <Button type="ghost" style="margin-left: 8px" @click="cancelSearch">取消</Button>
                            </Form-item>
                        </Form>
                    </div>
                </Poptip>
            </div>
    
            </Col>
        </Row>
        <Table size="small" border height="450" :data="tableData1" :columns="tableColumns1" stripe></Table>
        <Row>
            <Col span="12">
            <div style="margin: 10px">
                <Button type="primary" size="small" @click="exportData(1)">
                    <Icon type="ios-download-outline"></Icon> 导出原始数据</Button>
                <Button type="primary" size="small" @click="exportData(2)">
                    <Icon type="ios-download-outline"></Icon> 导出过滤后的数据</Button>
            </div>
            </Col>
            <Col span="12">
            <div style="margin: 10px;float: right;">
                <Page :total="total" size="small" show-total show-sizer :current="current" :page-size="pageSize" :page-size-opts="[10, 20, 50, 100]" @on-page-size-change="onPageSizeChange" @on-change="changePage"></Page>
            </div>
            </Col>
        </Row>
    
    </div>
</template>
<script>
import config from 'widget/config'

class Agency {

    constructor(x, y, z){
        this.ID = x;
        this.FullName =y;
        this.SimpleName = z
    }
}

export default {
    data() {

        const validateAmount = function(rule, value, callback){
            if (!value) {
                callback(new Error('金额不能为空'));
            } else if (!Number.isInteger(value)) {
                 callback(new Error('请输入数字值')); 
            }else{
                callback()
            }
        };
         const validateAgency = function(rule, value, callback){
            console.log(value)
            if (!value || Number( value) <=0) {
                
                callback(new Error('必须选个机构'));
            }else{
                callback()
            }
        };

        return {
            tableData1: [],
            tableColumns1: [
                {
                    title: '序号',
                    key: 'CardId'
                },
                {
                    title: '手机号',
                    key: 'Phone'
                },
                {
                    title: '卡号',
                    key: 'CardNo'
                },
                {
                    title: '余额',
                    key: 'Amount'
                },
                {
                    title: '发卡时间',
                    key: 'CreateTime'
                },
                {
                    title: '类型',
                    key: 'CardTypeText'
                },
                {
                    title: '状态',
                    key: 'StateText'
                },
                {
                    title: '操作',
                    key: 'CardNo',
                    render: (h, params) => {
                        return h('Dropdown', { on: { 'on-click': this.memuClick } }, [
                            h('Tag', {}, [
                                '下拉菜单'
                            ]),
                            h('Dropdown-menu', { slot: "list" }, [
                                h('Dropdown-item', { props: { name: "lost_" + params.row.CardNo } }, ['挂失']),
                                h('Dropdown-item', { props: { name: "delost_" + params.row.CardNo } }, ['解除挂失']),
                                h('Dropdown-item', { props: { name: "freeze_" + params.row.CardNo } }, ['冻结']),
                                h('Dropdown-item', { props: { name: "defreeze_" + params.row.CardNo } }, ['解除冻结']),
                                h('Dropdown-item', { props: { name: "disable_" + params.row.CardNo } }, ['作废'])
                            ])
                        ]);
                    }
                }
            ],
            showCreateModel: false,
            showSearch:false,
            current: 1,
            total: 0,
            pageSize: 10,
            phone: "",
            cardNo: "",
            cardType: "",
            state: "",
            
            formValidate:{
                cardno: "",
                phone: "",
                agencyid:0,
                amount:""
            },
            agencys:[],
            ruleValidate: {
                agencyid:[
                    { validator:validateAgency, trigger: 'blur'}
                ],
                phone: [
                    { required: true, message: '手机号不能为空', trigger: 'blur' }
                ],
                amount: [
                    { validator: validateAmount, trigger: 'blur'}
                ]
            }
        }
    },
    created: function () {
        this.fetchdata()
        this.fetchAgency()
    },
    methods: {
        changePage(index) {
            // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
            this.current = index;
            this.fetchdata();
        },
        onPageSizeChange(size) {
            this.pageSize = size;
            this.current = 1;
            this.fetchdata()
        },
        fetchdata() {
            this.axios.post(config.postPath + 'mock/Card.json',              {
                    page: this.current,
                    rows: this.pageSize,
                    phone: this.phone,
                    cardno: this.cardNo,
                    cardType: this.cardType,
                    state: this.state
                })
                .then((response) => {
                    // 响应成功回调
                    this.tableData1 = response.data.rows;
                    this.total = response.data.records;
                    //this.current = index;
                }, (response) => {
                    // 响应错误回调
                });
        },
        fetchAgency(){
            this.axios.post(config.postPath + 'mock/GetAgencys.json',{
            })
            .then((response) => {
                if(response && response.data){
                    for(let ay of response.data ){
                        this.agencys.push({ text: ay.FullName, value : ay.ID })
                    }
                }
            })

        },
        exportData(type) {
            let url = config.postPath+"Card/Export?phone=" + this.phone + "&cardno=" + this.cardNo;
            document.location.href = url;
        },
        search() {
            this.fetchdata();
            this.showSearch = false
        },
        cancelSearch() {
            this.showSearch = false
        },
        memuClick(name) {
            /* 表格弹出按钮的响应 */
            // let self = this;
            let action = '';
            let cardno = ''
            if (name.indexOf('_') > 0) {
                action = name.substring(0, name.indexOf('_'))
                cardno = name.substring(name.indexOf('_') + 1, name.length)
            }
            const actions = new Map([
                ['lost', [ config.postPath + 'Card/CardLost', '挂失']],
                ['delost', [config.postPath+ 'Card/CardDeLost', '解除挂失']],
                ['freeze', [config.postPath+ 'Card/CardFreeze', '冻结']],
                ['defreeze', [config.postPath+ 'Card/CardDeFreeze', '解除冻结']],
                ['disable', [config.postPath+ 'Card/CardDisable', '废除']]
            ])
            this.$Modal.confirm({
                title: '请确认',
                content: `<p>${actions.get(action)[1]}, 卡号:${cardno}</p>`,
                onOk: () => {
                    this.$http.post(actions.get(action)[0], {
                        cardno: cardno
                    }).then((response) => {
                        if (response.data.result === 0) {
                            this.$Message.success(response.data.message);
                            this.search();
                        } else {
                            this.$Message.error(response.data.message);
                        }
                    }, (response) => {
                        console.log(response)
                    });
                }
            });
        },
        //
        handleSubmit(name) {
            var self = this;
            self.$refs[name].validate((valid) => {
                if (valid) {
                    self.$http.post(config.postPath+ 'mock/Card.json', {
                        phone: self.formValidate.phone,
                        amount: Number( self.formValidate.amount),
                        agencyid: Number(self.formValidate.agencyid)
                    }).then(function(response){
                        if(response.data.result >0){
                            self.$Message.error(response.data.message);
                        }else{
                            self.$Message.success("新建的卡号:"+ response.data.message);
                            self.formValidate.cardno =response.data.cardno
                            self.showCreateModel = false;
                            self.fetchdata()
                        }

                    }, function(response){

                    });                   
                }
            })
        },
        handleReset(name) {
            this.$refs[name].resetFields();
        }
    }
}
</script>