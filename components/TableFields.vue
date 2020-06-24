<template>
	<tr>
		<td :key="column.id" v-for="column in parentProps.headers">
			<slot :props="parentProps" :column="column" name="table-field">
				<template v-if="column.viewer === 'text'">
					<span>{{ parentProps.item[column.value] }}</span>
				</template>
				<template v-else-if="column.viewer === 'imageViewer'">
					<image-viewer v-model="parentProps.item[column.value]" />
				</template>
				<template v-else-if="column.viewer === 'date'">
					<span>{{ $moment(parentProps.item[column.value]).fromNow() }}</span>
				</template>
				<template v-else-if="column.viewer === 'actions'">
					<div class="d-flex">
						<v-icon v-if="$has_permission(`update_${model.permission}`)" class="pointer" :size="18">
							mdi-square-edit-outline
						</v-icon>
						<v-icon
							v-if="$has_permission(`delete_${model.permission}`)"
							@click="$emit('deleteItem', parentProps.item)"
							class="pointer"
							:size="18"
						>
							mdi-delete
						</v-icon>
					</div>
				</template>
				<template v-else-if="column.viewer === 'icon' && column.defaultIcon">
					<v-icon small>{{ column.defaultIcon }}</v-icon>
				</template>
			</slot>
		</td>
	</tr>
</template>
<script>
export default {
	name: 'TableFields',
	props: {
		model: {
			type: Object,
			default() {
				return {};
			},
		},
		parentProps: {
			type: Object,
			default() {
				return {};
			},
		},
	},
};
</script>
