<template>
	<div class="white rounded-10 py-2 px-5 mt-4">
		<v-row class="pb-8" justify-md="space-between" justify-sm="center" justify-xl="center">
			<v-col sm="12" md="8" cols="12">
				<v-row dense justify="space-between">
					<v-col class="top-inputs" sm="3" cols="12">
						<label>Category Name</label>
						<v-text-field outlined dense hide-details v-model="editItem.name" />
					</v-col>
					<v-col class="top-inputs" sm="3" cols="12">
						<label>Position</label>
						<v-text-field outlined dense :min="1" hide-details v-model="editItem.position" type="number" />
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
			<v-col sm="6" md="4" lg="3" cols="12" class="mt-4">
				<div style="max-width:90%;margin-left: 10%;">
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
			<v-col cols="1" class="">
				<v-btn @click="create" :loading="loading" color="blue" class="white--text" rounded>
					Create
				</v-btn>
			</v-col>
			<v-col cols="1">
				<v-btn @click="$router.push('/categories?returned')" rounded outlined>
					Cancel
				</v-btn>
			</v-col>
		</v-row>
	</div>
</template>
<script>
import createGql from '~/gql/categories/create.gql';
export default {
	data() {
		return {
			loading: false,
			editItem: {},
		};
	},
	middleware({ store, redirect }) {
		if (!store.state.permissions.includes('create_categories')) {
			return redirect('/');
		}
	},
	computed: {
		headers() {
			return this.$store.state.categoryHeaders.filter(e => !e.notEditable);
		},
	},
	methods: {
		create() {
			let pk = this.editItem.id;
			let object = {};
			for (const header of this.headers) {
				if (header.value === 'keywords' && this.editItem[header.value]) {
					let words = this.editItem[header.value].toString().split(',');
					words = words.map(w => w.toLowerCase().trim()).filter(e => e);
					object[header.value] = words;
				} else if (header.value === 'image' && this.editItem[header.value] && this.editItem[header.value].id) {
					object[header.connectKey] = this.editItem[header.value].id;
				} else {
					object[header.value] = this.editItem[header.value];
				}
			}
			this.loading = true;
			this.$apollo
				.mutate({
					mutation: createGql,
					variables: {
						object,
					},
				})
				.then(({ data }) => {
					this.loading = false;
					this.$store.commit('setSnack', {
						active: true,
						color: 'success',
						text: 'Category created successfully!',
					});
					this.$router.push('/categories?returned');
				})
				.catch(e => {
					this.loading = false;
				});
		},
	},
	mounted() {
		this.$store.commit('setPageDetails', {
			pageTitle: 'Create Category',
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
