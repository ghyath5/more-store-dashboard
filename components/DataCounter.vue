<template>
	<v-card
		@click="card.to ? $router.push(card.to) : null"
		style="height:9.5vw; max-height:220px; min-height:80px"
		class="pointer rounded-10"
		:color="card.color"
	>
		<v-card-text style="min-height:100%" class="py-1 px-6">
			<div class="text-left card-custom">
				<div>
					<p :class="`${card.titleColor || 'white'}--text mb-0 pb-0 text-xl-h6`">
						<slot name="card-title">
							{{ card.text }}
						</slot>
					</p>
				</div>
				<div>
					<h3 class="text-xl-h2 text-lg-h3 font-weight-bold" :class="`${card.textColor}--text`">
						<slot name="card-content" :data="count" :card="card">
							{{ count }}
						</slot>
					</h3>
				</div>
				<div>
					<p :class="`${card.titleColor || 'white'}--text size-mo mb-0 pb-0 text-xl-h6`" v-if="!loading">
						<slot name="card-subtitle">
							{{ subText }}
						</slot>
					</p>
				</div>
			</div>
		</v-card-text>
	</v-card>
</template>
<script>
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
<style>
.card-custom {
	display: -webkit-flex;
	display: flex;
	flex-direction: column;
	height: 9vw;
	max-height: 220px;
	min-height: 80px;
}
.card-custom div {
	flex: 1;
	display: -webkit-flex;
	display: flex;
	justify-content: center;
	flex-direction: column;
}
</style>
