export interface Center {
  name: string;
  id: string;
  url: string;
}

export interface REDCapRecord {
  bl_record_id: string;
  [key: string]: any;
}

export interface AnonCheck {
  name: string;
  desc: string;
  prec: any;
  precParams: any;
  func: (data: REDCapRecord[], ...args: any[]) => REDCapRecord[];
  params: any[];
}

export interface ShareModalProps {
  center: Center;
  title: string;
  onClose: () => void;
}
