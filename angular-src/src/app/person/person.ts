
export interface Person {
  name: string,
  email: string,
  role: string,
  photo: Image,
  phone_number: string,
  office_location: string,
  links: Link[],
  google_scholar_link: object
}

export interface Link {
  URL: string,
  description: string
}

export interface Image {
  buffer: string,
  content_type: string
}
