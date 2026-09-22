export interface Center {
  name: string;
  id: string;
  url: string;
}

export interface REDCapRecord {
  bl_record_id: string;
  [key: string]: any;
}
