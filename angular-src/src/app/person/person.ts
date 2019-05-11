
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
  google_drive_link: string;
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



