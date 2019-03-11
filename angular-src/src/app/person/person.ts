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
  _id: string;
  name: string;
  photo: Image;
  role: string;
  email: string;
  biography: string;
  my_website_link: string;
  links: Array<Link>;
  password: string;
  sys_role: string;
  verified: boolean;
  phone_number: string;
  office_location: string;

  constructor() {
    this.photo = new Image();
  }
}



