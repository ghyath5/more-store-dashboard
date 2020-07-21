<template>
	<div class="white rounded-10 py-2 px-5 mt-4">
		<v-row class="pb-8" justify-md="space-between" justify-sm="center" justify-xl="center">
			<v-col sm="12" md="8" cols="12">
				<v-row dense justify="space-between">
					<v-col class="top-inputs" sm="3" cols="12">
						<label class="text-body-1 font-weight-bold">Category Name</label>
						<v-text-field height="37" outlined dense hide-details v-model="editItem.name" />
					</v-col>
					<v-col class="top-inputs" sm="3" cols="12">
						<label class="text-body-1 font-weight-bold">Position</label>
						<v-text-field
							height="37"
							outlined
							dense
							:min="1"
							hide-details
							v-model="editItem.position"
							type="number"
						/>
					</v-col>
					<v-col class="top-inputs" sm="3" cols="12">
						<label class="text-body-1 font-weight-bold">Display Mode</label>
						<v-select
							:height="37"
							outlined
							:menu-props="{ offsetY: true }"
							:items="[
								{ text: 'Show', value: true },
								{ text: 'Hide', value: false },
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
					<v-col class="mt-4" cols="12">
						<v-row dense justify="space-between">
							<v-col sm="3" class="top-inputs">
								<auto-complete
									:height="37"
									label="Subcategory"
									v-model="editItem.sub_categories"
									:queryGql="categoriesGql"
									itemValue="id"
									itemText="name"
									:searchOptions="{ key: 'name', op: '_ilike' }"
									searchModel="categories"
									multiple
									:limit="30"
									:initialOrderBy="{
										updated_at: 'desc',
									}"
									:initialWhere="{ main: { _eq: false } }"
									returnObject
								>
									<template v-slot:select-item="{ item, attrs, on }">
										<v-list-item :value="item" v-on="on">
											<v-list-item-action>
												<v-icon
													:class="!attrs.inputValue ? 'material-icons-outlined' : ''"
													color="blue"
												>
													fiber_manual_record
												</v-icon>
											</v-list-item-action>

											<v-list-item-title>
												{{ item.name }}
											</v-list-item-title>
										</v-list-item>
									</template>
								</auto-complete>
							</v-col>
							<v-col sm="3" class="top-inputs">
								<label class="text-body-1 font-weight-bold">Create New Subcategory</label>
								<v-text-field
									class="mb-3"
									:height="37"
									outlined
									dense
									hide-details
									v-model="subcategory.name"
								/>
								<v-btn
									@click="createSubCategory"
									:loading="createSubLoading"
									color="blue"
									class="px-5 text-subtitle-2 white--text"
									rounded
								>
									Create
								</v-btn>
							</v-col>
							<v-col sm="3" class="top-inputs"></v-col>
						</v-row>
					</v-col>
					<v-col class="mt-1" cols="12">
						<v-chip
							class="ma-1"
							color="primary"
							v-for="sub in editItem.sub_categories"
							small
							:key="sub.id"
							close
							@click:close="
								editItem.sub_categories = editItem.sub_categories.filter(s => s.id !== sub.id)
							"
						>
							{{ sub.name }}
						</v-chip>
					</v-col>
					<v-col cols="12" class="mt-8">
						<label>Keywords</label>
						<v-textarea hide-details outlined v-model="editItem.keywords" />
					</v-col>
				</v-row>
			</v-col>
			<v-col sm="6" md="4" lg="3" cols="12" class="mt-4">
				<div style="max-width:90%;margin-left: 10%;">
					<image-uploader v-model="editItem.image" ref="image-uploader" />
					<v-btn
						small
						style="font-size:11px;"
						class="upload-btn"
						@click="$refs['image-uploader'].browse()"
						outlined
						rounded
					>
						Upload Image
					</v-btn>
					<span style="font-size:11px">
						Insert image in SVG or PNG format
					</span>
				</div>
			</v-col>
		</v-row>
		<v-row align="center" class="py-2 mt-4" style="border-top:2px solid #f4f6f9">
			<v-col cols="1" style="max-width:100px; min-width:70px">
				<v-btn @click="update" :loading="loading" color="blue" class="white--text" rounded>
					Save Update
				</v-btn>
			</v-col>
			<v-col cols="1">
				<v-btn @click="$router.push('/categories?returned')" rounded outlined>
					Cancel
				</v-btn>
			</v-col>
			<v-spacer />
			<v-col sm="2" class="text-right">
				<v-dialog v-model="deleteDialog.active" width="450">
					<template v-slot:activator="{ on }">
						<v-btn v-on="on" rounded color="secondary">
							Delete Category
							<v-icon small>mdi-trash-can-outline</v-icon>
						</v-btn>
					</template>

					<v-card>
						<v-card-title class="headline grey lighten-2" primary-title>
							Confirm
						</v-card-title>
						<v-card-text>
							<slot name="delete-dialog-content">
								Do you want to delete this permanently?
							</slot>
						</v-card-text>

						<v-divider></v-divider>

						<v-card-actions>
							<v-btn color="primary" text @click="deleteDialog.active = false">
								Cancel
							</v-btn>
							<v-spacer></v-spacer>
							<v-btn color="error" text @click="deleteCategory">
								Delete
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
			</v-col>
		</v-row>
	</div>
</template>
<script>
import categoryGql from '~/gql/categories/one.gql';
import categoriesGql from '~/gql/categories/all.gql';
import deleteGql from '~/gql/categories/delete.gql';
import deleteSubGql from '~/gql/categories/delete_sub.gql';
import createSubGql from '~/gql/categories/create_sub.gql';
import createGql from '~/gql/categories/create.gql';
import updateGql from '~/gql/categories/update.gql';
export default {
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
			categoriesGql,
			editItem: {},
			loading: false,
			deleteDialog: {
				active: false,
			},
			subcategory: {
				main: false,
			},
			createSubLoading: false,
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
			this.updateSubCategories();
			let pk = this.editItem.id;
			let _set = {};
			for (const header of this.headers) {
				if (!this.editItem[header.value]) {
					continue;
				}
				if (header.value === 'keywords' && this.editItem[header.value]) {
					let words = this.editItem[header.value].toString().split(',');
					words = words.map(w => w.toLowerCase().trim()).filter(e => e);
					_set[header.value] = words;
				} else if (header.value === 'image' && this.editItem[header.value] && this.editItem[header.value].id) {
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
					this.$router.push('/categories?returned');
				})
				.catch(e => {
					if (e.graphQLErrors[0].message && e.graphQLErrors[0].message.includes('Uniqueness violation')) {
						this.$store.commit('setSnack', {
							active: true,
							color: 'error',
							text: 'Can not be created, already exist!',
						});
					}
					this.loading = false;
				});
		},
		deleteCategory() {
			this.loading = true;
			this.$apollo
				.mutate({
					mutation: deleteGql,
					variables: {
						id: this.item.id,
					},
				})
				.then(({ data }) => {
					this.loading = false;
					this.$store.commit('setSnack', {
						active: true,
						color: 'success',
						text: 'Category has been deleted',
					});
					this.$router.push('/categories');
				})
				.catch(e => {
					this.loading = false;
				});
		},
		createSubCategory() {
			this.createSubLoading = true;
			this.$apollo
				.mutate({
					mutation: createGql,
					variables: {
						object: this.subcategory,
					},
				})
				.then(({ data }) => {
					this.createSubLoading = false;
					this.editItem.sub_categories.push(data.insert_categories_one);
					this.subcategory.name = '';
				})
				.catch(e => {
					console.log(e);
					this.createSubLoading = false;
				});
		},
		async updateSubCategories() {
			let ids = this.editItem.sub_categories.map(sub => sub.id);
			this.loading = true;
			await this.$apollo.mutate({
				mutation: deleteSubGql,
				variables: {
					where: {
						_and: [{ parent_id: { _eq: this.editItem.id } }, { child_id: { _nin: ids } }],
					},
				},
			});
			let subcategories = this.editItem.sub_categories.map(sub => {
				return {
					parent_id: this.editItem.id,
					child_id: sub.id,
				};
			});
			await this.$apollo.mutate({
				mutation: createSubGql,
				variables: {
					objects: subcategories,
					on_conflict: {
						constraint: 'category_to_category_pkey',
						update_columns: ['child_id', 'parent_id'],
					},
				},
			});
			return;
		},
	},
	created() {
		this.category.sub_categories = this.category.sub_categories.map(sub => sub.child);
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
