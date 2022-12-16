export interface valtModel {
  status: number;
  data: string;
}

export interface AddCardResponse {
  id: string;
  vaultResponse: valtModel;
}
