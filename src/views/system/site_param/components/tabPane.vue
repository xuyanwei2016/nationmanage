<template>
<div>
    <basic v-if="activeName === 'basic'"></basic>
    <email v-else-if="activeName === 'email'"></email>
    <memberParameters v-if="activeName === 'members'"></memberParameters>
    <message v-else-if="activeName === 'message'"></message>
</div>
</template>
<script>
import basic from './basic.vue'
import message from './short_message.vue'
import email from './email.vue'
import memberParameters from './member_parameters'
export default {
    props:{
        activeName:String
    },
    components: { basic , message, memberParameters, email } 
}
</script>

