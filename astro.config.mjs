// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightSidebarTopics from 'starlight-sidebar-topics';

const startHere = {
	label: 'Start Here',
	items: [
		{ label: 'Introduction', slug: 'you/intro' },
		{ label: 'Overview', slug: 'you/overview' },
		{ label: 'Compass', slug: 'you/youth' },
	],
};

const caseStudies = {
	label: 'Case Studies',
	items: [
		{ label: 'Michael Mentele', slug: 'case-studies/michael-mentele' },
	],
};

// https://astro.build/config
export default defineConfig({
	redirects: {
		'/': '/you/intro/',
	},
	integrations: [
		starlight({
			title: 'OpenHabitat',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			components: {
				SocialIcons: './src/components/SocialIcons.astro',
			},
			customCss: ['./src/styles/sidebar-topics.css'],
			plugins: [
				starlightSidebarTopics([
					{
						id: 'you',
						label: 'You',
						link: '/you/youth/',
						icon: 'seti:rails',
						items: [
							startHere,
							{
								label: 'Behaviors',
								items: [
									{ label: 'Purchasing', slug: 'you/behaviors/purchasing' },
								],
							},
							{
								label: 'Rhythms',
								items: [
									{ label: 'Dailies', slug: 'you/rhythms/dailies' },
									{ label: 'Weeklies', slug: 'you/rhythms/weeklies' },
									{ label: 'Monthlies', slug: 'you/rhythms/monthlies' },
									{ label: 'Yearlies', slug: 'you/rhythms/yearlies' },
								],
							},
							{
								label: 'Body',
								items: [
									{ label: 'Introduction', slug: 'you/body/intro' },
									{ label: 'Gut', slug: 'you/body/gut' },
									{ label: 'Skin', slug: 'you/body/skin' },
									{ label: 'Hair', slug: 'you/body/hair' },
									{ label: 'Joints', slug: 'you/body/joints' },
								],
							},
							caseStudies,
						],
					},
					{
						id: 'habitat',
						label: 'Habitat',
						link: '/habitat/intro/',
						icon: 'seti:home',
						items: [
							{
								label: 'Start Here',
								items: [
									{ label: 'Introduction', slug: 'habitat/intro' },
									{ label: 'Overview', slug: 'habitat/overview' },
									{ label: 'Quickstart', slug: 'habitat/quickstart' },
								],
							},
							{
								label: 'Systems',
								items: [
									{ label: 'Air', slug: 'habitat/systems/air' },
									{ label: 'Water', slug: 'habitat/systems/water' },
									{ label: 'Light', slug: 'habitat/systems/light' },
									{ label: 'Circadian', slug: 'habitat/systems/circadian' },
									{ label: 'Sound', slug: 'habitat/systems/sound' },
									{ label: 'Textiles', slug: 'habitat/systems/textiles' },
								],
							},
							{
								label: 'Spaces',
								items: [
									{ label: 'Bedroom', slug: 'habitat/spaces/bedroom' },
									{ label: 'Kitchen', slug: 'habitat/spaces/kitchen' },
									{ label: 'Bathroom', slug: 'habitat/spaces/bathroom' },
									{ label: 'Office', slug: 'habitat/spaces/office' },
									{ label: 'Gym', slug: 'habitat/spaces/gym' },
									{ label: 'Closet', slug: 'habitat/spaces/closet' },
									{ label: 'Laundry', slug: 'habitat/spaces/laundry' },
								],
							},
						],
					},
				], {
					topics: {
						you: ['/you/**'],
						habitat: ['/habitat/**'],
					},
					exclude: ['/about', '/give'],
				}),
			],
		}),
	],
});
