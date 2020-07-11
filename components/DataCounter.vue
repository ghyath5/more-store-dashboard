<template>
	<v-card height="130" flat class="pointer overview-card" :color="card.color">
		<v-card-text class="pa-3">
			<div class="text-left">
				<p style="font-size:14px" class="white--text mb-5" v-text="card.text" />
				<h3 class="text-h4" :class="`${card.textColor}--text`">
					{{ count }}
				</h3>
				<p style="font-size:14px" class="mt-5 white--text">{{ card.subText }}</p>
			</div>
		</v-card-text>
	</v-card>
</template>
<script>
import gql from 'graphql-tag';
export default {
	props: {
		card: {
			type: Object,
			default() {
				return {};
			},
		},
	},
	data() {
		return {
			count: 'Loading...',
			loading: 0,
			data: {},
		};
	},
	apollo: {
		data: {
			// skip:true,
			query() {
				return this.card.query;
			},
			update() {
				return null;
			},
			subscribeToMore: {
				document() {
					return this.card.subscription;
				},
				// Variables passed to the subscription. Since we're using a function,
				// they are reactive
				variables() {
					return this.card.gqlVars;
				},
				// Mutate the previous result
				updateQuery(previousResult, { subscriptionData: { data } }) {
					if (data && data[`${this.card.model.name}_aggregate`]) {
						let aggregate = data[`${this.card.model.name}_aggregate`].aggregate;
						this.count = aggregate.count;
					}
				},
			},
			variables() {
				return this.card.gqlVars;
			},
			// Result hook
			// Don't forget to destructure `data`
			result({ data }) {
				if (data && data[`${this.card.model.name}_aggregate`]) {
					let aggregate = data[`${this.card.model.name}_aggregate`].aggregate;
					this.count = aggregate.count;
				} else {
					this.count = '';
				}
			},
		},
	},
};
</script>
