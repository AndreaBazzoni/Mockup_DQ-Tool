import type { Center } from "@/utils/types";


// ------------------------------- //
// ---- GESTIONE COMPILAZIONE ---- //
// ------------------------------- //

// Lista dei centri
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
  {
    name: "INT",
    id: "int",
    url: "https://redcap-int.istitutotumori.mi.it/api/",
  },
];

// ID dell'analisi corrente
export const CurrentAnalysis: string = "2026-a";

// Gestione della disponibilità delle funzionalità
export const availableQuality: boolean = true;
export const availableAnonymous: boolean = true;

// Indirizzo del Bucket S3
export const S3_Bucket: string = "ehe-public-617528855295-eu-south-1-an";
export const S3_Region: string = ".eu-south-1";
// ------------------------------- //
// ------------------------------- //
// ------------------------------- //
