<template>
    <v-container>
        <v-row justify="center">
			<v-col cols="12" sm="6" lg="3">
                <!-- <data-counter /> -->
			</v-col>
		</v-row>
    </v-container>
</template>
<script>
import dataCounter from '~/components/DataCounter'
export default {
    components:{
        dataCounter
    },
    computed: {
		overviewData() {
			let data = [
				{
					title: 'Total Clients',
					value: this.clients && this.clients.count,
				},
				{
					title: 'Total Orders',
					value: '23',
				},
				{
					title: 'Total Sales',
					value: this.products && this.products.count,
				},
				{
					title: 'Total Pending',
					value: '23',
				},
			];
			return data.filter(e => e);
		},
	},
    mounted(){
        this.$store.commit('setPageDetails',{
            pageTitle:'Activity'
        })
    }
}
</script>