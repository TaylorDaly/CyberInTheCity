export interface StaticPage {
  _id: string,
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
      child: [
        {
          title: 'Faculty & Staff',
          route: '/person',
          parent: 'People'
        }
      ]
    },
    {
      name: 'Research',
      route: '/research',
      child: [
        {
          title: 'All Research',
          route: '/research',
          parent: 'Research'
        }
      ]
    },
    {
      name: 'Education',
      route: '/education',
      child: [
        {
          title: 'All Courses',
          route: '/education',
          parent: 'Education'
        }
      ]
    },
    {
      name: 'Careers',
      route: '/careers',
      child: [
        {
          title: 'Employment Opportunities',
          route: '/careers',
          parent: 'Careers'
        }
      ]
    },
    {
      name: 'Events',
      route: '/events',
      child: [
        {
          title: 'School Events',
          route: '/events',
          parent: 'Events'
        }
      ]
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
