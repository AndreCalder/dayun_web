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
};

export type WorkType = {
    _id?: ObjectId;
    work_id?: string;
    title: string;
    description?: string;
    measurements?: string;
    material?: string;
    technique?: string;
    img_url: string;
    gallery?: Array<string>;
};

export type ProjectType = {
    _id?: ObjectId;
    project_id?: string;
    title: string;
    description?: string;
    gallery: Array<string>;
};

export type MerchType = {
    _id?: ObjectId;
    name: string;
    description: string;
    price: number;
    rating?: number;
    image_urls: Array<string>;
};

export type ColumnType = {
    text: string;
    type: string;
    attribute: string;
    url?: string;
};

export type CardAction = {
    text: string;
    function: () => void;
};

export type CoverType = {
    _id?: ObjectId;
    title: string;
    img_url: string;
};

export type AboutImageType = {
    _id?: ObjectId;
    image_id?: string;
    title: string;
    img_url: string;
    order?: number;
};

export type CatalogType = {
    _id?: ObjectId;
    title: string;
    description?: string;
    pdf_url: string;
    type: "paintings" | "illustrations";
    created_at?: MongoDate;
};

export type AboutTextType = {
    _id?: ObjectId;
    key: string;
    texts: {
        [locale: string]: string;
    };
    date_added?: MongoDate;
    date_modified?: MongoDate;
};
