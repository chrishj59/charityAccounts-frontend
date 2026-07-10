export type AddressUI = {
  addressID: number;
  buildingCode?: string;
  room?: string;
  careOf?: string;
  street: string;
  street2?: string;
  street3?: string;
  houseNumber?: number;

  town?: string;
  county?: string;
  postCode: string;
  isoCountryId?: number;

  partnerId?: string;

  companyId?: string;
};
