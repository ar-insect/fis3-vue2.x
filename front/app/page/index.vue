<template>
    <div>
        <Row>
            <Col span="24">
                <p>Hello World</p>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        methods: {
            handleStart () {
                this.$Modal.info({
                    title: 'Bravo',
                    content: 'Now, enjoy the convenience of iView.'
                });
            }
        }
    }
</script>
