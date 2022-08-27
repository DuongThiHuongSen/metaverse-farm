export interface UseCarNFT {
    attributes: Array<any>;
    collection: any;
    description: string;
    edition: number;
    external_url: string;
    image: string;
    name: string;
    properties: {
      files: Array<string>;
      category: string;
      creators: Array<string>;
    };
    seller_fee_basis_points: number;
    address: string;
    updateAuthority: string;
    rootUrl: string;
    file: string;
    texture: string;
  }