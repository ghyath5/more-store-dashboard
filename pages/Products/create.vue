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
						<v-row>
							<v-col sm="2">
								<div class="text-center">
									<image-uploader v-model="activeItem[header.connectKey]" />
								</div>
							</v-col>
						</v-row>
					</v-container>
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
			createGql,
		};
	},
	middleware({ store, redirect }) {
		if (!store.state.permissions.includes('create_products')) {
			return redirect('/');
		}
	},
	methods: {
		addThumbnail(image_id, activeItem) {
			let images = activeItem['images'] || {
				data: [],
			};
			if (images.data.length && images.data.find(img => img.type === 'thumbnail')) {
				let thumbnail = images.data.find(img => img.type === 'thumbnail');
				thumbnail.image_id = image_id;
			} else {
				let thumbnail = { type: 'thumbnail', image_id };
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
