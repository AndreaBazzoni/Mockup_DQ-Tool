export interface Center {
  name: string;
  id: string;
  url: string;
}


export interface REDCapRecord {
  bl_record_id: string;
  [key: string]: any;
}

export interface DQRecord {
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

export interface QualCheck {
  name: string;
  desc: string;
  prec: any | null;
  precParams: any[] | null;
  func: (recordData: any, ...throuples: any[]) => any;
  params: any[];
  vars: string[];
}


interface ShareModalQualityProps {
  center: Center;
  title: "quality";
  result: DQRecord;
  onClose: () => void;
}

interface ShareModalAnonymousProps {
  center: Center;
  title: "anonymous";
  result: REDCapRecord[][];
  onClose: () => void;
}

export type ShareModalProps = ShareModalQualityProps | ShareModalAnonymousProps;


export interface REDCapMetadataField {
  field_name: string;
  form_name: string;
  section_header: string;
  field_type: string;
  field_label: string;
  select_choices_or_calculations: string;
  field_note: string;
  text_validation_type_or_show_slider_number: string;
  text_validation_min: string;
  text_validation_max: string;
  identifier: string;
  branching_logic: string;
  required_field: string;
  custom_alignment: string;
  question_number: string;
  matrix_group_name: string;
  matrix_ranking: string;
  field_annotation: string;
}

export interface REDCapInstrVsEventsField {
  arm_num: string;
  unique_event_name: string;
  form: string;
}

export interface REDCapRepeatingsField {
  event_name: string;
  form_name: string;
  custom_form_label: string;
}

export interface DQContext {
  data: REDCapRecord[];
  metadata: REDCapMetadataField[];
  instrumentsVsEvents: REDCapInstrVsEventsField[];
  repeatingInstrumentsAndEvents: REDCapRepeatingsField[];
}


export interface BranchRefVar {
  name: string,
  instrument: string,
  event: string | null
}

export interface VariableRef {
  event: string | null;
  instrument: string | null;
  field: string | null;
  instance: string | null;
  orig: string;
  realField: string;
  realVar: string;
  raw: string[] | null;
}