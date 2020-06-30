<template>
	<v-container fluid>
		<v-row>
			<v-col v-for="(info, i) in overviewData" :key="i" cols="12" sm="6" lg="3">
				<material-stats-card :color="info.color" :icon="info.icon" :title="info.title" :value="info.value" />
			</v-col>

			<v-col cols="12" lg="6">
				<material-card color="orange" title="Employee Stats" text="New employees on 15th September, 2016">
					<v-data-table :headers="headers" :items="items" hide-default-footer />
				</material-card>
			</v-col>

			<v-col cols="12" lg="6">
				<material-card class="card-tabs" color="green">
					<template v-slot:header>
						<v-tabs v-model="tabs" background-color="transparent" slider-color="white">
							<span class="subheading font-weight-light mx-3" style="align-self: center">
								Tasks:
							</span>
							<v-tab class="mr-3">
								<v-icon class="mr-2">
									mdi-bug
								</v-icon>
								Bugs
							</v-tab>
							<v-tab class="mr-3">
								<v-icon class="mr-2">
									mdi-code-tags
								</v-icon>
								Website
							</v-tab>
							<v-tab>
								<v-icon class="mr-2">
									mdi-cloud
								</v-icon>
								Server
							</v-tab>
						</v-tabs>
					</template>

					<v-tabs-items v-model="tabs">
						<v-tab-item v-for="n in 3" :key="n">
							<v-list three-line class="py-0">
								<v-list-item @click="complete(0)">
									<v-list-item-action class="align-self-center">
										<v-checkbox :value="list[0]" color="green" />
									</v-list-item-action>

									<v-list-item-title>
										Sign contract for "What are conference organized afraid of?"
									</v-list-item-title>

									<div class="d-flex">
										<v-tooltip top content-class="top">
											<template v-slot:activator="{ attrs, on }">
												<v-btn
													class="v-btn--simple"
													color="green"
													icon
													v-bind="attrs"
													v-on="on"
												>
													<v-icon color="primary">
														mdi-pencil
													</v-icon>
												</v-btn>
											</template>
											<span>Edit</span>
										</v-tooltip>

										<v-tooltip top content-class="top">
											<template v-slot:activator="{ attrs, on }">
												<v-btn
													class="v-btn--simple"
													color="danger"
													icon
													v-bind="attrs"
													v-on="on"
												>
													<v-icon color="error">
														mdi-close
													</v-icon>
												</v-btn>
											</template>
											<span>Close</span>
										</v-tooltip>
									</div>
								</v-list-item>

								<v-divider />

								<v-list-item @click="complete(1)">
									<v-list-item-action class="align-self-center">
										<v-checkbox :value="list[1]" color="green" />
									</v-list-item-action>

									<v-list-item-title>
										Lines From Great Russian Literature? Or E-mails From My Boss?
									</v-list-item-title>

									<div class="d-flex">
										<v-tooltip top content-class="top">
											<template v-slot:activator="{ attrs, on }">
												<v-btn
													class="v-btn--simple"
													color="green"
													icon
													v-bind="attrs"
													v-on="on"
												>
													<v-icon color="primary">
														mdi-pencil
													</v-icon>
												</v-btn>
											</template>
											<span>Edit</span>
										</v-tooltip>

										<v-tooltip top content-class="top">
											<template v-slot:activator="{ attrs, on }">
												<v-btn
													class="v-btn--simple"
													color="danger"
													icon
													v-bind="attrs"
													v-on="on"
												>
													<v-icon color="error">
														mdi-close
													</v-icon>
												</v-btn>
											</template>
											<span>Close</span>
										</v-tooltip>
									</div>
								</v-list-item>

								<v-divider />

								<v-list-item @click="complete(2)">
									<v-list-item-action class="align-self-center">
										<v-checkbox :value="list[2]" color="green" />
									</v-list-item-action>

									<v-list-item-title>
										Flooded: One year later, assessing what was lost and what was found when a
										ravaging rain swept through metro Detroit
									</v-list-item-title>

									<div class="d-flex">
										<v-tooltip top content-class="top">
											<template v-slot:activator="{ attrs, on }">
												<v-btn
													class="v-btn--simple"
													color="green"
													icon
													v-bind="attrs"
													v-on="on"
												>
													<v-icon color="primary">
														mdi-pencil
													</v-icon>
												</v-btn>
											</template>
											<span>Edit</span>
										</v-tooltip>

										<v-tooltip top content-class="top">
											<template v-slot:activator="{ attrs, on }">
												<v-btn
													class="v-btn--simple"
													color="danger"
													icon
													v-bind="attrs"
													v-on="on"
												>
													<v-icon color="error">
														mdi-close
													</v-icon>
												</v-btn>
											</template>
											<span>Close</span>
										</v-tooltip>
									</div>
								</v-list-item>
							</v-list>
						</v-tab-item>
					</v-tabs-items>
				</material-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	data() {
		return {
			emailsSubscriptionChart: {
				data: {
					labels: ['Ja', 'Fe', 'Ma', 'Ap', 'Mai', 'Ju', 'Jul', 'Au', 'Se', 'Oc', 'No', 'De'],
					series: [[542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]],
				},
				options: {
					axisX: {
						showGrid: false,
					},
					low: 0,
					high: 1000,
					chartPadding: {
						top: 0,
						right: 5,
						bottom: 0,
						left: 0,
					},
				},
				responsiveOptions: [
					[
						'screen and (max-width: 640px)',
						{
							seriesBarDistance: 5,
							axisX: {
								labelInterpolationFnc: function(value) {
									return value[0];
								},
							},
						},
					],
				],
			},
			headers: [
				{
					sortable: false,
					text: 'ID',
					value: 'id',
				},
				{
					sortable: false,
					text: 'Name',
					value: 'name',
				},
				{
					sortable: false,
					text: 'Salary',
					value: 'salary',
					align: 'right',
				},
				{
					sortable: false,
					text: 'Country',
					value: 'country',
					align: 'right',
				},
				{
					sortable: false,
					text: 'City',
					value: 'city',
					align: 'right',
				},
			],
			items: [
				{
					id: 1,
					name: 'Dakota Rice',
					country: 'Niger',
					city: 'Oud-Tunrhout',
					salary: '$35,738',
				},
				{
					id: 2,
					name: 'Minerva Hooper',
					country: 'Curaçao',
					city: 'Sinaai-Waas',
					salary: '$23,738',
				},
				{
					id: 3,
					name: 'Sage Rodriguez',
					country: 'Netherlands',
					city: 'Overland Park',
					salary: '$56,142',
				},
				{
					id: 4,
					name: 'Philip Chanley',
					country: 'Korea, South',
					city: 'Gloucester',
					salary: '$38,735',
				},
				{
					id: 5,
					name: 'Doris Greene',
					country: 'Malawi',
					city: 'Feldkirchen in Kārnten',
					salary: '$63,542',
				},
			],
			overviewData: [
				{
					color: 'red',
					icon: 'mdi-account-group-outline',
					title: 'Clients',
					value: '23',
				},
				{
					color: 'green',
					icon: 'card_travel',
					title: 'Orders',
					value: '23',
				},
				{
					color: 'black',
					icon: 'mdi-storefront',
					title: 'Products',
					value: '234',
				},
				{
					color: 'orange',
					icon: 'attach_money',
					title: 'Earning',
					value: '23',
				},
			],
			tabs: 0,
			list: {
				0: false,
				1: false,
				2: false,
			},
		};
	},
	methods: {
		complete(index) {
			this.list[index] = !this.list[index];
		},
	},
};
</script>
