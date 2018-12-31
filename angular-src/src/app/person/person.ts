export interface Person {
  name: string,
  photo: Image,
  role: string,
  email: string,
  my_website_link: string,
  links: Array<Link>
}

export interface Image {
  content_type: string,
  buffer: string
}

export interface Link {
  URL: string,
  description: string
}
