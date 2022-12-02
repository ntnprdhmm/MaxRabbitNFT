export type Metadata = {
  description: string;
  external_url: string;
  image: string;
  name: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
};

export type Token = {
  id: number;
  uri: string;
  ownerId: string;
} & Metadata;
