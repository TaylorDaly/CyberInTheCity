
export interface NavItem {
  name: string,
  child: StaticNavItem[]
}

export interface StaticNavItem {
  title: string,
  content: string,
  parent: string,
  order: number
}
