<template>
	<v-container>
		<item-editor
			ref="editor"
			mode="update"
			:updateGql="updateGql"
			:headers="$store.state.productHeaders.filter(e => !e.notEditable)"
			@itemUpdated="updated"
			:item="item"
			customAction
			@action="updateAction"
		>
			<template v-slot:editorField="{ header, activeItem }">
				<template v-if="header.editor === 'imageUploader' && header.many">
					<v-container>
						<v-row align-content="center" justify="center">
							<v-col sm="4">
								<div class="text-center">
									Thumbnail
									<image-uploader
										:value="itemImages.find(img => img.type === 'thumbnail').image"
										@remove="removeImage($event, 'thumbnail')"
										@input="addThumbnail($event, activeItem)"
									/>
								</div>
							</v-col>
						</v-row>
					</v-container>
				</template>
				<template v-else-if="header.editor === 'imagesUploader'">
					<v-row>
						<v-col
							cols="12"
							sm="6"
							md="4"
							lg="2"
							v-for="img of itemImages.filter(img => img.type !== 'thumbnail')"
							:key="img.id"
						>
							<div class="text-center">
								<image-uploader :value="img.image" @remove="removeImage" />
							</div>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12" sm="6" md="4" lg="2" v-for="img of images" :key="img.id">
							<div class="text-center">
								<image-uploader @remove="removeImage" @input="addImage($event, activeItem)" />
							</div>
						</v-col>
						<v-col cols="12" sm="6" md="4" lg="2">
							<v-card height="75" hover @click="addImageSlot" outlined>
								<v-row style="height:100%" align="center" justify="center">
									<v-icon>add</v-icon>
								</v-row>
							</v-card>
						</v-col>
					</v-row>
				</template>
			</template>
		</item-editor>
	</v-container>
</template>
<script>
import ItemEditor from '~/components/ItemEditor';
import productGql from '~/gql/products/one.gql';
import updateGql from '~/gql/products/update.gql';
import deleteImagesGql from '~/gql/images/delete.gql';
import gql from 'graphql-tag';
export default {
	components: {
		ItemEditor,
	},
	async asyncData({ store, app, params, query, redirect }) {
		let response = await app.apolloProvider.defaultClient.query({
			query: productGql,
			fetchPolicy: 'network-only',
			variables: {
				id: params.id,
			},
		});
		if (!response || !response.data || !response.data.products_by_pk) {
			redirect('/products');
		}
		return {
			item: response.data.products_by_pk,
		};
	},
	created() {
		this.itemImages = this.item.images;
	},
	data() {
		return {
			images: [{ id: '' }],
			itemImages: [],
			dbImages: null,
			updateGql,
			removedImages: [],
			// categoriesGql,
		};
	},
	middleware({ store, redirect }) {
		if (!store.state.permissions.includes('update_products')) {
			return redirect('/');
		}
	},
	methods: {
		async delete_images() {
			await this.$apollo.mutate({
				mutation: deleteImagesGql,
				variables: {
					where: {
						id: { _in: this.removedImages },
					},
				},
			});
		},
		removeImage(image, type) {
			this.itemImages =
				type !== 'thumbnail' ? this.itemImages.filter(img => img.image.id !== image.id) : this.itemImages;
			this.dbImages = this.dbImages && this.dbImages.filter(img => img.image_id !== image.id);
			this.removedImages.push(image.id);
		},
		async updateAction({ item }) {
			delete item['images'];
			if (this.dbImages && this.dbImages.length) {
				await this.$apollo.mutate({
					mutation: gql`
						mutation insert_images($images: [product_image_insert_input!]!) {
							insert_product_image(objects: $images) {
								affected_rows
							}
						}
					`,
					variables: {
						images: this.dbImages,
					},
				});
			}
			await this.delete_images();
			this.$refs.editor.update();
		},
		addImageSlot() {
			this.images.push({
				id: this.images.length,
			});
		},
		addImage({ id }, activeItem) {
			this.dbImages = this.dbImages || [];
			this.dbImages.push({ type: 'preview', image_id: id, product_id: activeItem.id });
		},
		addThumbnail({ id }, activeItem) {
			this.dbImages = this.dbImages || [];
			let thumbnail = this.dbImages.find(image => image.type === 'thumbnail') || {};
			thumbnail.image_id = id;
			thumbnail.product_id = activeItem.id;
			thumbnail.type = 'thumbnail';
			this.dbImages.push(thumbnail);
		},
		updated(data) {
			this.$store.commit('setSnack', {
				active: true,
				color: 'success',
				text: 'Product saved successfully!',
			});
			this.$router.push('/products');
		},
	},
};
</script>
