<template>
	<v-app id="inspire">
		<v-main>
			<v-container class="fill-height" fluid>
				<nuxt />
			</v-container>
		</v-main>
	</v-app>
</template>
<script>
export default {
	middleware: 'notAuth',
};
</script>
