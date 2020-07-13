<template>
	<v-card @click="card.to ? $router.push(card.to) : null" height="110" flat class="pointer d" :color="card.color">
		<v-card-text class="px-3 py-2">
			<div class="text-left">
				<p style="font-size:13px" class="white--text mb-3" v-text="card.text" />
				<h3 class="text-h4 " :class="`${card.textColor}--text`">
					{{ count }}
				</h3>
				<p style="font-size:13px" class="mt-3 white--text" v-if="!loading">{{ subText }}</p>
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
			cards: {},
		};
	},
	apollo: {
		cards: {
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
				variables() {
					return this.card.gqlVars;
				},
				// Mutate the previous result
				updateQuery(previousResult, { subscriptionData: { data } }) {
					if (data && data[`${this.card.model.name}_aggregate`]) {
						let aggregate = data[`${this.card.model.name}_aggregate`].aggregate;
						this.count = aggregate.count;
						this.$emit('dataChanged', { cardId: this.card.id, data: this.count });
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
	computed: {
		subText() {
			if (this.card.id === 'non-active-clients') {
				return 'Total Clients ' + (Number(this.count) + Number(this.card.subText));
			}
			return this.card.subText;
		},
	},
};
</script>
