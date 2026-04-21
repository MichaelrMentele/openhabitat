// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	redirects: {
		'/': '/intro/',
	},
	integrations: [
		starlight({
			title: 'OpenHabitat',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			sidebar: [
				{ label: 'Introduction', slug: 'intro' },
				{ label: 'About', slug: 'about' },
				{
					label: 'You',
					items: [
						{ label: 'Overview', slug: 'you' },
						{ label: 'Dailies', slug: 'you/rhythms/dailies' },
						{ label: 'Weeklies', slug: 'you/rhythms/weeklies' },
						{ label: 'Monthlies', slug: 'you/rhythms/monthlies' },
						{ label: 'Yearlies', slug: 'you/rhythms/yearlies' },
					],
				},
				{
					label: 'Systems',
					items: [
						{ label: 'Overview', slug: 'habitat/systems' },
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
						{ label: 'Overview', slug: 'habitat/spaces' },
						{ label: 'Bedroom', slug: 'habitat/spaces/bedroom' },
						{ label: 'Kitchen', slug: 'habitat/spaces/kitchen' },
						{ label: 'Bathroom', slug: 'habitat/spaces/bathroom' },
						{ label: 'Office', slug: 'habitat/spaces/office' },
						{ label: 'Gym', slug: 'habitat/spaces/gym' },
						{ label: 'Closet', slug: 'habitat/spaces/closet' },
						{ label: 'Laundry', slug: 'habitat/spaces/laundry' },
					],
				},
				{ label: 'Give Back', slug: 'give' },
			],
		}),
	],
});
