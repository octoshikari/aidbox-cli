export default {
  title: 'Aidbox tool',
  description: 'CLI tool',
  base: '/aidbox-tool/',
  themeConfig: {
    logo: '/octopus.png',
    socialLinks: [{ icon: 'github', link: 'https://github.com/octoshikari/aidbox-tool' }],
    nav: [{ text: 'Backlog', link: '/backlog' }],
    sidebar: [
      {
        text: 'Introduction',
        items: [{ text: 'What is Aidbox tool', link: '/' }],
      },
    ],
    editLink: {
      pattern: 'https://github.com/octoshikari/aidbox-tool/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © ${new Date().getFullYear()} Alex Streltsov`,
    },
  },

  markdown: {
    config: (md) => {
      md.use(require('markdown-it-task-lists'));
    },
  },
};
