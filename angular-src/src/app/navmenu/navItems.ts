export interface StaticPage {
  title: string,
  content: string,
  route: string,
  parent: string,
}

export class navItems {
  parents = [
    {
      name: 'About Us',
      route: '/about',
      child: []
    },
    {
      name: 'People',
      route: '/person',
      child: []
    },
    {
      name: 'Research',
      route: '/research',
      child: [
        {
          route: '/research/labs',
          title: 'Research Labs'
        }
      ]
    },
    {
      name: 'Education',
      route: '/education',
      child: []
    },
    {
      name: 'Careers',
      route: '/careers',
      child: []
    },
    {
      name: 'Events',
      route: '/events',
      child: []
    },
    {
      name: 'News',
      route: '/news',
      child: []
    },
    {
      name: 'Contact Us',
      route: '/contact',
      child: []
    },
  ];

  getParents() {
    return this.parents;
  }

}
