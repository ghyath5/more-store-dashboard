<template>
	<v-container>
		<item-editor
			:createGql="createGql"
			:headers="$store.state.productHeaders.filter(e => !e.notEditable)"
			@itemCreated="created"
		>
			<template v-slot:editorField="{ header, activeItem }">
				<template v-if="header.editor === 'imageUploader' && header.many">
					<v-container>
						<v-row align-content="center" justify="center">
							<v-col sm="4">
								<div class="text-center">
									Thumbnail
									<image-uploader @input="addThumbnail($event, activeItem)" />
								</div>
							</v-col>
						</v-row>
					</v-container>
				</template>
				<template v-else-if="header.editor === 'imagesUploader'">
					<v-row>
						<v-col cols="12" sm="6" md="4" lg="2" v-for="img of images" :key="img.id">
							<div class="text-center">
								<image-uploader @input="addImage($event, activeItem)" />
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
import createGql from '~/gql/products/create.gql';
export default {
	components: {
		ItemEditor,
	},
	data() {
		return {
			images: [{ id: '' }],
			createGql,
		};
	},
	middleware({ store, redirect }) {
		if (!store.state.permissions.includes('create_products')) {
			return redirect('/');
		}
	},
	methods: {
		addImageSlot() {
			this.images.push({
				id: this.images.length,
			});
		},
		addImage({ id }, activeItem) {
			let images = activeItem['images'] || {
				data: [],
			};
			images.data.push({ type: 'preview', image_id: id });
			activeItem['images'] = images;
		},
		addThumbnail({ id }, activeItem) {
			let images = activeItem['images'] || {
				data: [],
			};
			if (images.data.length && images.data.find(img => img.type === 'thumbnail')) {
				let thumbnail = images.data.find(img => img.type === 'thumbnail');
				thumbnail.image_id = id;
			} else {
				let thumbnail = { type: 'thumbnail', image_id: id };
				images.data.push(thumbnail);
			}
			activeItem['images'] = images;
		},
		created(data) {
			this.$store.commit('setSnack', {
				active: true,
				color: 'success',
				text: 'Product created successfully!',
			});
			this.$router.push('/products');
		},
	},
};
</script>
