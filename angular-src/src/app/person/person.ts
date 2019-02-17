// export interface Person {
//   name: string,
//   photo: Image,
//   role: string,
//   email: string,
//   my_website_link: string,
//   links: Array<Link>,
//   password: string,
// }

// export interface Image {
//   content_type: string,
//   buffer: string
// }
//
// export interface Link {
//   URL: string,
//   description: string
// }

export class Image {
  content_type: string;
  buffer: string;
}

export class Link {
  URL: string;
  description: string;
}

export class Person {
  name: string;
  photo: Image;
  role: string;
  email: string;
  my_website_link: string;
  links: Array<Link>;
  password: string;

  constructor() {
    this.photo = new Image();
  }
}



