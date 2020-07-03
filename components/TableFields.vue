<template>
	<tr>
		<td :key="column.id" v-for="column in parentProps.headers">
			<slot :props="parentProps" :column="column" name="table-field">
				<template v-if="column.viewer === 'text'">
					<span style="cursor:pointer" v-if="parentProps.item[column.value].length >= 30">
						{{ parentProps.item[column.value].substring(0, 30) }}...
					</span>
					<span v-else>
						{{ parentProps.item[column.value] }}
					</span>
				</template>
				<template v-else-if="column.viewer === 'imageViewer'">
					<template v-if="!column.many">
						<image-viewer v-model="parentProps.item[column.value]" />
					</template>
					<template v-else>
						<image-viewer
							v-if="parentProps.item[column.value].length"
							v-model="parentProps.item[column.value].find(i => i.type === column.mainType)['image']"
						/>
						<image-viewer v-else />
					</template>
				</template>
				<template v-else-if="column.viewer === 'date'">
					<span>{{ $moment(parentProps.item[column.value]).fromNow() }}</span>
				</template>
				<template v-else-if="column.viewer === 'checkbox'">
					<v-checkbox :input-value="parentProps.item[column.value]" readonly></v-checkbox>
				</template>
				<template v-else-if="column.viewer === 'boolean'">
					<v-icon v-if="parentProps.item[column.value]" color="primary">mdi-check-outline</v-icon>
				</template>
				<template v-else-if="column.viewer === 'actions'">
					<div class="d-flex">
						<slot
							v-if="
								$has_permission(`update_${model.permission}`) ||
									$has_permission(`manage_${model.permission}`)
							"
							name="edit-btn"
							:item="parentProps.item"
						>
							<v-icon
								@click="$router.push(`/${model.name}/${parentProps.item.id}/update`)"
								color="blue"
								class="pointer"
								:size="18"
							>
								mdi-square-edit-outline
							</v-icon>
						</slot>
						<v-dialog v-model="deleteDialog.active" width="450">
							<template v-slot:activator="{ on }">
								<v-icon
									v-on="on"
									color="error"
									v-if="
										$has_permission(`delete_${model.permission}`) ||
											$has_permission(`manage_${model.permission}`)
									"
									class="pointer"
									:size="18"
								>
									mdi-delete
								</v-icon>
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
									<v-btn
										color="error"
										text
										@click="
											$emit('deleteItem', parentProps.item);
											deleteDialog.active = false;
										"
									>
										Delete
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
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
	data() {
		return {
			deleteDialog: {
				active: false,
			},
		};
	},
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
