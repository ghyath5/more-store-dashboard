<template>
	<v-row dense justify="space-between" align="center" class="pagination-container">
		<div>Showing {{ pagination.pageStart || 1 }} to {{ pagination.pageStop }} of {{ pagination.itemsLength }}</div>
		<v-col class="text-right">
			<paginate
				:page-count="pagination.pageCount"
				:click-handler="clickCallback"
				:itemsLength="paginationLength(pagination.itemsLength / pagination.itemPerPage)"
				v-model="pagination.page"
				prev-text="<button class='v-btn v-btn--depressed v-btn--flat v-btn--outlined v-btn--rounded theme--light v-size--small' style='font-size:12px;padding-bottom: 1px;'>Previous</button>"
				next-text="<button class='v-btn v-btn--depressed v-btn--flat v-btn--outlined v-btn--rounded theme--light v-size--small ' style='font-size:12px; padding-bottom: 1px;'>Next</button>"
				container-class="pr-5 custom-pagination v-pagination--circle theme--light"
				page-link-class="v-pagination__item mx-1 v-btn--rounded v-btn bordered v-size--small customize-pagination-btns"
				active-class="v-pagination__item--active secondary"
				no-li-surround
			>
				<span slot="breakViewContent">
					<!-- <v-menu offset-y :rounded="false">
                <template v-slot:activator="{ on }">
                <v-btn v-on="on" x-small icon>
                    
                </v-btn>
                </template>
                <v-card max-width="50">
                    <v-list dense>
                        <v-hover :key="page" v-slot:default="{ hover }" v-for="page in otherPages">
                            <v-list-item
                                dense
                                class="pointer"
                                @click="clickCallback(page)"
                            >
                                
                                    <v-list-item-title
                                        :class="{ 'grey--text': hover }"
                                        class="text-caption"
                                        v-text="page"
                                    />

                                    <v-divider />
                            </v-list-item>
                        </v-hover>
                    </v-list>
                </v-card>
            </v-menu> -->
					<svg width="16" height="4" viewBox="0 0 16 4">
						<circle fill="#999999" cx="2" cy="2" r="2" />
						<circle fill="#999999" cx="8" cy="2" r="2" />
						<circle fill="#999999" cx="14" cy="2" r="2" />
					</svg>
				</span>
			</paginate>
		</v-col>
	</v-row>
</template>
<script>
export default {
	props: {
		pagination: {
			type: Object,
			default() {
				return null;
			},
		},
	},
	data() {
		return {
			otherPages: [2, 5],
		};
	},
	created() {
		// this.otherPages.push(this.pagination.itemsLength)
	},
	methods: {
		clickCallback(n) {
			this.$emit('input', n);
		},
		paginationLength(number) {
			if (number === Infinity) number = 1;
			return Math.ceil(number);
		},
	},
};
</script>

<style>
.customize-pagination-btns {
	height: 28px !important;
	width: 29px !important;
	min-width: 29px !important;
}
.pagination-container {
	border-top: 3px solid #f4f6f9;
	align-content: center;
	width: 98%;
	margin: auto;
}
</style>
