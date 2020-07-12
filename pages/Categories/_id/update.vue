<template>
	<v-container class="pt-1">
		<!-- <item-editor
			mode="update"
			:updateGql="updateGql"
			:headers="$store.state.categoryHeaders.filter(e => !e.notEditable)"
			@itemUpdated="updated"
			:item="item"
		>
		
		</item-editor> -->
		<div class="white rounded-10 py-2 px-8">
			<v-row class="pb-8">
				<v-col sm="12" md="7" cols="12">
					<v-row dense justify="space-between">
						<v-col class="top-inputs" sm="3" cols="12">
							<label>Category Name</label>
							<v-text-field outlined dense hide-details v-model="editItem.name" />
						</v-col>
						<v-col class="top-inputs" sm="3" cols="12">
							<label>Position</label>
							<v-text-field
								outlined
								dense
								:min="1"
								hide-details
								v-model="editItem.position"
								type="number"
							/>
						</v-col>
						<v-col class="top-inputs" sm="3" cols="12">
							<label>Display Mode</label>
							<v-select
								class="customized"
								outlined
								:menu-props="{ offsetY: true }"
								:items="[
									{ text: 'Hide', value: false },
									{ text: 'Show', value: true },
								]"
								dense
								hide-details
								v-model="editItem.active"
							>
								<template v-slot:selection="{ item }">
									<span :class="item.value ? 'green--text' : 'red--text'">{{ item.text }}</span>
								</template>
							</v-select>
						</v-col>
						<v-col cols="12" class="mt-8">
							<label>Keywords</label>
							<v-textarea hide-details outlined v-model="editItem.keywords" />
						</v-col>
					</v-row>
				</v-col>
				<v-col sm="12" md="4" offset="1" cols="12" class="mt-4">
					<div class="ma-auto text-left" style="max-width:65% !important;">
						<image-uploader v-model="editItem.image" ref="image-uploader" />
						<v-btn
							small
							style="font-size:9px;"
							class="upload-btn"
							@click="$refs['image-uploader'].browse()"
							outlined
							rounded
						>
							Upload Image
						</v-btn>
						<span style="font-size:9px">
							Insert image in SVG or PNG format
						</span>
					</div>
				</v-col>
			</v-row>
			<v-row align="center" class="py-2 mt-4" style="border-top:2px solid #f4f6f9">
				<v-col>
					<v-btn @click="update" :loading="loading" color="blue" class="white--text" rounded>
						Save Update
					</v-btn>
				</v-col>
			</v-row>
		</div>
	</v-container>
</template>
<script>
import ItemEditor from '~/components/ItemEditor';
import categoryGql from '~/gql/categories/one.gql';
export default {
	components: {
		ItemEditor,
	},
	async asyncData({ store, app, params, query, redirect }) {
		let response = await app.apolloProvider.defaultClient.query({
			query: categoryGql,
			fetchPolicy: 'network-only',
			variables: {
				id: params.id,
			},
		});
		if (!response || !response.data || !response.data.categories_by_pk) {
			redirect('/categories');
		}
		return {
			item: response.data.categories_by_pk,
		};
	},
	data() {
		return {
			editItem: null,
			loading: false,
		};
	},
	middleware({ store, redirect }) {
		if (!store.state.permissions.includes('update_categories')) {
			return redirect('/');
		}
	},
	computed: {
		headers() {
			return this.$store.state.categoryHeaders.filter(e => !e.notEditable);
		},
		category() {
			return { ...this.item };
		},
	},
	methods: {
		update() {
			let pk = this.editItem.id;
			let _set = {};
			for (const header of this.headers) {
				if (header.value === 'keywords' && this.editItem[header.value]) {
					let words = this.editItem[header.value].toString().split(',');
					words = words.map(w => w.toLowerCase().trim()).filter(e => e);
					_set[header.value] = words;
				} else if (header.value === 'image') {
					_set[header.connectKey] = this.editItem[header.value].id;
				} else {
					_set[header.value] = this.editItem[header.value];
				}
			}
			this.loading = true;
			this.$apollo
				.mutate({
					mutation: updateGql,
					variables: {
						pk_columns: {
							id: pk,
						},
						_set,
					},
				})
				.then(({ data }) => {
					this.loading = false;
					this.$store.commit('setSnack', {
						active: true,
						color: 'success',
						text: 'Category saved successfully!',
					});
					this.$router.push('/categories');
				})
				.catch(e => {
					this.loading = false;
				});
		},
	},
	created() {
		this.editItem = { ...this.category };
	},
	mounted() {
		this.$store.commit('setPageDetails', {
			pageTitle: 'Categories Management',
			path: [
				{
					name: this.category.name,
					color: 'blue--text',
				},
			],
		});
	},
};
</script>

<style>
.top-inputs {
	min-width: 30% !important;
	/* flex: 0 0 30%; */
}
.upload-btn .v-btn__content {
	top: 0 !important;
}
</style>
