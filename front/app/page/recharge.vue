﻿<template>
    <div>
        <Row>
            <Col span="24">
            <div style="float: right;">
                    <Poptip placement="bottom-end"  v-model="showSearch">
                        <Button>搜索</Button>
                        <div slot="title"><i>搜索条件</i></div>
                        <div slot="content">
                            <Form label-position="right" :label-width="80">
                                <Form-item label="手机号">
                                    <Input v-model="phone" size="small" style="width: 300px" ></Input>
                                </Form-item>
                                <Form-item label="卡号">
                                    <Input v-model="cardNo" size="small" style="width: 300px"></Input>
                                </Form-item>
                                <Form-item>
                                    <Button type="primary" @click="search" >确定</Button>
                                    <Button type="ghost" style="margin-left: 8px" @click="cancelSearch">取消</Button>
                                </Form-item>
                            </Form>
                        </div>
                    </Poptip>
            </div>

            </Col>
        </Row>
        <Table size="small" border  height="450" :data="tableData1" :columns="tableColumns1" stripe></Table>
        <Row>
            <Col span="12">
                <div style="margin: 10px">
                    <Button type="primary" size="small" @click="exportData(1)"><Icon type="ios-download-outline"></Icon> 导出原始数据</Button>
                    <Button type="primary" size="small" @click="exportData(2)"><Icon type="ios-download-outline"></Icon> 导出过滤后的数据</Button>
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
import config from 'widget/config';

export default {
    data () {
        return {
            tableData1: [],
            tableColumns1: [
                {
                    title: '序号',
                    key: 'Id',
                },
                {
                    title: '手机号',
                    key: 'Phone',
                },
                {
                    title: '卡号',
                    key: 'CardNo',
                },
                {
                    title: '充值金额',
                    key: 'Amount',
                },
                {
                    title: '充值时间',
                    key: 'CreateTime',
                },
            ],
            showSearch: false,
            current: 1,
            total: 0,
            pageSize: 10,
            phone: '',
            cardNo: '',
        };
    },
    created: function () {
        this.fetchdata();
    },
    methods: {
        changePage (index) {
            // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
            this.current = index;
            this.fetchdata();
        },
        onPageSizeChange (size) {
            this.pageSize = size;
            this.current = 1;
            this.fetchdata();
        },
        fetchdata () {
            // this.current = index;
            // 传统写法
            this.axios.post(config.postPath + 'mock/ReChargeIndex.json', {
                page: this.current,
                rows: this.pageSize,
                phone: this.phone,
                cardno: this.cardNo,
            }, { credentials: true, emulateJSON: true })
            .then((response) => {
                // 响应成功回调
                this.tableData1 = response.data.rows;
                this.total = response.data.records;
                // this.current = index;
            }, (response) => {
                // 响应错误回调
            });
        },
        exportData (type) {
            var url = config.postPath + 'ReCharge/Export?phone=' + this.phone + '&cardno=' + this.cardNo;
            document.location.href = url;
        },
        search () {
            this.fetchdata();
            this.showSearch = false;
        },
        cancelSearch () {
            console.log('cancel click');
            this.showSearch = false;
        },
    },
};
</script>