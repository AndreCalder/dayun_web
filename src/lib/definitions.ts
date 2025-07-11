export type ObjectId = {
    $oid: string;
  };
  
  export type MongoDate = {
    $date: string;
  };
  
  export type UserType = {
    username: string;
    _id: ObjectId;
  };
  
  export type ClientType = {
    _id: ObjectId;
    name: string;
    email: string;
  };
  
  export type BlogPostType = {
    title: string;
    subtitle?: string;
    img_url: string;
    categories: Array<string>;
    content: string;
    tags: Array<string>;
  }

  export type WorkType = { 
    title: string;
    img_url: string;
  }

  export type MerchType = { 
    _id?: ObjectId;
    name: string;
    description: string;
    price: number;
    rating?: number;
    image_urls: Array<string>;
  }
  
  export type ColumnType = {
    text: string;
    type: string;
    attribute: string;
    url?: string;
  }
  
  export type CardAction = {
    text: string;
    function: () => void;
  }
  