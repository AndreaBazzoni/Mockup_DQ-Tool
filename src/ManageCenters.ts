export interface Center {
  name: string;
  id: string;
  url: string;
}

export const ListOfCenters: Center[] = [
  {
    name: "BIOMERIS",
    id: "biomeris",
    url: "https://redcap.labmedinfo.org/api/",
  },
  {
    name: "BIOMERIS NEW",
    id: "biomeris-new",
    url: "https://redcap-new.labmedinfo.org/api/",
  },
];

export const CurrentAnalysis: string = "2027";