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
				{ label: 'About', slug: 'about'},
				{ label: 'Give Back', slug: 'give' },
				{
					label: 'You',
					items: [
						{ label: 'You', slug: 'you' },
						{
							label: 'Rhythms',
							autogenerate: { directory: 'you/rhythms' },
						},
					],
				},
				{
					label: 'Habitat',
					items: [
						{
							label: 'Systems',
							autogenerate: { directory: 'habitat/systems' },
						},
						{
							label: 'Spaces',
							autogenerate: { directory: 'habitat/spaces' },
						},
					],
				},
			],
		}),
	],
});
