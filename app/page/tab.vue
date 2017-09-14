
<template>
    <div class="tab">
       <h3> {{msg}} </h3>
        <Input v-model="value" size="large" placeholder="large size"></Input>
    </div>
</template>
<style scoped lang="sass">
   
</style>
<script>
 export default {
    name: 'tab',
    data () {
        return {
            msg: '欢迎来到教程！' ,
            value: 'aaaaaaaaa'
        }
  }

 }
</script>