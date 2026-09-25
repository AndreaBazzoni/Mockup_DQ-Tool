import {
	varHasValue,
	multiVarHasValueAND,
	multiVarHasValueOR,
	varWithinInterval,
	dateCompareWithDateString,
	dateCompareWithDelta,
	dateWithinIntervalWithDeltas,
	varHasValueRepInstr,
	varHasValueWithPreviousSelfRepInstr,
	multiVarHasValueRepInstr,
	multiVarHasValueFirstVsLastInstRepInstr,  //1:1
	multiVarHasValueFixedVsLastInstRepInstr,  //1:1
	multiDateCompareFirstVsLastInstRepInstr,  //1:1
	multiDateCompareFixedVsLastInstRepInstr,  //1:1
	uniqueDateCompareToMaxDateRepInstr,  //1:1
	varWithinIntervalRepInstr,
	compareAllDatesToFixed,
	dateCompareWithDeltaRepInstr,
	dateCompareWithPreviousSelfRepInstr,	
	dateCompareToFixedDateRepInstr,  //n:1
	uniqueDateCompareToFixedDateRepInstr,  //1:1  (in realtà n:1, ma si presume che le n siano tutte uguali)
} from '@/utils/function-dqchecks';


// Define a mapping of check names to function references and parameters
export const dqChecks = [
/*	
	{
		name:'dq_1_0',
		desc:'Test of BL for ("bl_status_loco") with preCheck',
		prec:varHasValue,
		precParams:["bl_123_sys_ther_set", 1],
		func:varWithinInterval,
		params:["bl_status_loco", 0, 10],
		vars:["bl_123_sys_ther_set","bl_status_loco"]
	}
,
*/
	{
		name:'dq_1_1',
		desc:'Year of birth ("bl_dob") must be between 1900 and 2025',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["bl_dob", 1900, 2025],
		vars:["bl_dob"]
	}
,
	{
		name:'dq_1_2',
		desc:'Age at diagnosis ("bl_123_age_diag_man") must be between 18 and 100',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["bl_123_age_diag_man", 18, 100],
		vars:["bl_123_age_diag_man"]
	}
,
	{
		name:'dq_1_3',
		desc:'Date of registration ("bl_dor") must be subsequent to date of birth ("bl_dob")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_dor", "bl_dob", 0, ">="],
		vars:["bl_dor", "bl_dob"]
	}
,
	{
		name:'dq_1_4a',
		desc:'Date of registration ("bl_dor") must be >= first pathological diagnosis ("bl_1st_pathol_ddiag")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_dor", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_dor", "bl_1st_pathol_ddiag"]
	}
,
{
		name:'dq_1_4b',
		desc:'Date of registration ("bl_dor") must be <= first pathological diagnosis ("bl_1st_pathol_ddiag") + 180 days',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_dor", "bl_1st_pathol_ddiag", 180, "<="],
		vars:["bl_dor", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_5',
		desc:'Weight value ("bl_weight") must be between 20 and 250',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["bl_123_age_diag_man", 18, 100],
		vars:["bl_123_age_diag_man"]
	}
,
	{
		name:'dq_1_6',
		desc:'Height value ("bl_height") must be between 60 and 250',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["bl_weight", 60, 250],
		vars:["bl_weight"]
	}
,
	{
		name:'dq_1_7',
		desc:'Weight 3 months ago value ("bl_weight_3m") must be between 20 and 250',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["bl_weight_3m", 20, 250],
		vars:["bl_weight_3m"]
	}
,
	{
		name:'dq_1_8',
		desc:'Weight at presentation value ("bl_weight_presentation") must be between 60 and 250',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["bl_weight_presentation", 60, 250],
		vars:["bl_weight_presentation"]
	}
,
	{
		name:'dq_1_9',
		desc:'Hemoglobin at first consultation value ("bl_hemo_diag") must be between 1 and 25',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["bl_hemo_diag", 1, 25],
		vars:["bl_hemo_diag"]
	}
,
	{
		name:'dq_1_10',
		desc:'Fibrinogen at first consultation value ("bl_fibrin_diag") must be between 1 and 2000',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["bl_fibrin_diag", 1, 2000],
		vars:["bl_fibrin_diag"]
	}
,
	{
		name:'dq_1_11',
		desc:'GDF-15 value ("bl_gdf15") must be between 100 and 25000',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["bl_gdf15", 100, 25000],
		vars:["bl_gdf15"]
	}
,
	{
		name:'dq_1_12',
		desc:'Gender female - Menopausal status starting date ("bl_menopausal_dstart") must be subsequent to date of birth ("bl_dob")',
		prec:varHasValue,
		precParams:["bl_gender", 2],
		func:dateCompareWithDelta,
		params:["bl_menopausal_dstart", "bl_dob", 0, ">="],
		vars:["bl_gender", "bl_menopausal_dstart", "bl_dob"]
	}
,
	{
		name:'dq_1_13',
		desc:'Date of first pathological diagnosis ("bl_1st_pathol_ddiag") must be subsequent to date of birth ("bl_dob")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_1st_pathol_ddiag", "bl_dob", 0, ">="],
		vars:["bl_1st_pathol_ddiag", "bl_dob"]
	}
,
	{
		name:'dq_1_14',
		desc:'Mitotic index value ("bl_mitotic_index") must be between 1 and 99',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["bl_mitotic_index", 1, 99],
		vars:["bl_mitotic_index"]
	}
,
	{
		name:'dq_1_15',
		desc:'Primary size value ("bl_123_primary_size") must be between 1 and 300',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["bl_123_primary_size", 1, 300],
		vars:["bl_123_primary_size"]
	}
,
	{
		name:'dq_1_16',
		desc:'Lung - Multiple lesions: number of lesions ("bl_23_dis_ext_base_lung_les_spec") must be between 1 and 100',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["bl_23_dis_ext_base_lung_les_spec", 1, 100],
		vars:["bl_23_dis_ext_base_lung_les_spec"]
	}
,
	{
		name:'dq_1_17',
		desc:'Liver - Multiple lesions: number of lesions ("bl_23_dis_ext_base_liv_spec") must be between 1 and 100',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["bl_23_dis_ext_base_liv_spec", 1, 100],
		vars:["bl_23_dis_ext_base_liv_spec"]
	}
,
	{
		name:'dq_1_18',
		desc:'Bone - Multiple lesions: number of lesions ("bl_23_dis_ext_base_bone_les_spec") must be between 1 and 100',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["bl_23_dis_ext_base_bone_les_spec", 1, 100],
		vars:["bl_23_dis_ext_base_bone_les_spec"]
	}
,
	{
		name:'dq_1_19',
		desc:'Soft tissues (Limb) - Multiple lesions: number of lesions ("bl_23_dis_ext_base_soft_les_limb_spec") must be between 1 and 100',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["bl_23_dis_ext_base_soft_les_limb_spec", 1, 100],
		vars:["bl_23_dis_ext_base_soft_les_limb_spec"]
	}
,
	{
		name:'dq_1_20',
		desc:'Soft tissues (Superficial trunk) - Multiple lesions: number of lesions ("bl_23_dis_ext_base_soft_les_trunk") must be between 1 and 100',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["bl_23_dis_ext_base_soft_les_trunk", 1, 100],
		vars:["bl_23_dis_ext_base_soft_les_trunk"]
	}
,
	{
		name:'dq_1_21',
		desc:'Soft tissues (Intra-abdominal) - Multiple lesions: number of lesions ("bl_23_dis_ext_base_soft_les_abdo") must be between 1 and 100',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["bl_23_dis_ext_base_soft_les_abdo", 1, 100],
		vars:["bl_23_dis_ext_base_soft_les_abdo"]
	}
,
	{
		name:'dq_1_22',
		desc:'Soft tissues (Intrathoracic) - Multiple lesions: number of lesions ("bl_23_dis_ext_base_soft_les_thor") must be between 1 and 100',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["bl_23_dis_ext_base_soft_les_abdo", 1, 100],
		vars:["bl_23_dis_ext_base_soft_les_abdo"]
	}
,
	{
		name:'dq_1_23',
		desc:'Soft tissues (Head & neck) - Multiple lesions: number of lesions ("bl_23_dis_ext_base_soft_les_hn") must be between 1 and 100',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["bl_23_dis_ext_base_soft_les_abdo", 1, 100],
		vars:["bl_23_dis_ext_base_soft_les_abdo"]
	}
,
	{
		name:'dq_1_24',
		desc:'Other - Multiple lesions: number of lesions ("bl_23_dis_ext_base_oth") must be between 1 and 100',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["bl_23_dis_ext_base_soft_les_abdo", 1, 100],
		vars:["bl_23_dis_ext_base_soft_les_abdo"]
	}
,
	{
		name:'dq_1_25',
		desc:'Surveillance Starting date ("bl_123_survdstart") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_123_surv_dstart", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_123_surv_dstart", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_26',
		desc:'Surveillance Ending date ("bl_123_surv_dend") must be subsequent to Surveillance starting date ("bl_123_surv_dstart")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_123_surv_dend", "bl_123_surv_dstart", 0, ">="],
		vars:["bl_123_surv_dend", "bl_123_surv_dstart"]
	}
,
	{
		name:'dq_1_27',
		desc:'Surveillance ("bl_123_surv_yn")=1 - Systemic therapy ("bl_123_sys_ther_yn")=0 - Radiotherapy ("bl_123_radio_yn")=0 - Isolated limb perfusion ("bl_123_limb_yn")=0 - Local ablative techniques ("bl_123_abla_yn")=0 - Surgery ("bl_123_surg_yn")=0',
		prec:varHasValue,
		precParams:["bl_123_surv_yn", 1],
		func:multiVarHasValueAND,
		params:[["bl_123_sys_ther_yn", 0], ["bl_123_radio_yn", 0], ["bl_123_limb_yn", 0], ["bl_123_abla_yn", 0], ["bl_123_surg_yn", 0]],
		vars:["bl_123_surv_yn", "bl_123_sys_ther_yn", "bl_123_radio_yn", "bl_123_limb_yn", "bl_123_abla_yn", "bl_123_surg_yn"]
	}
,
	{
		name:'dq_1_28',
		desc:'Systemic therapy - Setting Preoperative ("bl_123_sys_ther_set")=1 - Systemic therapy - Preoperative - Starting date ("bl_123_sys_ther_pre_dstart") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:varHasValue,
		precParams:["bl_123_sys_ther_set", 1],
		func:dateCompareWithDelta,
		params:["bl_123_sys_ther_pre_dstart", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_123_sys_ther_set", "bl_123_sys_ther_pre_dstart", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_29',
		desc:'Systemic therapy - Setting Preoperative ("bl_123_sys_ther_set")=1 - Systemic therapy - Preoperative - Ending date ("bl_123_sys_ther_pre_dend") must be subsequent to Systemic therapy - Preoperative - Starting date ("bl_123_sys_ther_pre_dstart")',
		prec:varHasValue,
		precParams:["bl_123_sys_ther_set", 1],
		func:dateCompareWithDelta,
		params:["bl_123_sys_ther_pre_dend", "bl_123_sys_ther_pre_dstart", 0, ">="],
		vars:["bl_123_sys_ther_set", "bl_123_sys_ther_pre_dend", "bl_123_sys_ther_pre_dstart"]
	}
,
	{
		name:'dq_1_30',
		desc:'Systemic therapy - Setting Preoperative ("bl_123_sys_ther_set")=1 - Date of surgery ("bl_1_surg_dsurg") must be subsequent to max 90 days post Systemic therapy - Preoperative - Ending date ("bl_123_sys_ther_pre_dend")',
		prec:varHasValue,
		precParams:["bl_123_sys_ther_set", 1],
		func:dateWithinIntervalWithDeltas,
		params:["bl_1_surg_dsurg", "bl_123_sys_ther_pre_dend", 0, "bl_123_sys_ther_pre_dend", 90],
		vars:["bl_123_sys_ther_set", "bl_1_surg_dsurg", "bl_123_sys_ther_pre_dend"]
	}
,
	{
		name:'dq_1_31',
		desc:'Systemic therapy - Setting Postoperative ("bl_123_sys_ther_set")=2 - Systemic therapy - Postoperative - Starting date ("bl_123_sys_ther_post_dstart") must be subsequent to Date of surgery ("bl_1_surg_dsurg")',
		prec:varHasValue,
		precParams:["bl_123_sys_ther_set", 2],
		func:dateCompareWithDelta,
		params:["bl_123_sys_ther_post_dstart", "bl_1_surg_dsurg", 0, ">="],
		vars:["bl_123_sys_ther_set", "bl_123_sys_ther_post_dstart", "bl_1_surg_dsurg"]
	}
,
	{
		name:'dq_1_32',
		desc:'Systemic therapy - Setting Postoperative ("bl_123_sys_ther_set")=2 - Systemic therapy - Postoperative - Ending date ("bl_123_sys_ther_post_dend") must be subsequent to Systemic therapy - Postoperative - Starting date ("bl_123_sys_ther_post_dstart")',
		prec:varHasValue,
		precParams:["bl_123_sys_ther_set", 2],
		func:dateCompareWithDelta,
		params:["bl_123_sys_ther_post_dend", "bl_123_sys_ther_post_dstart", 0, ">="],
		vars:["bl_123_sys_ther_set", "bl_123_sys_ther_post_dend", "bl_123_sys_ther_post_dstart"]
	}
,
	{
		name:'dq_1_33',
		desc:'Systemic therapy - Setting Preoperative and Postoperative ("bl_123_sys_ther_set")=3 - Systemic therapy - Preoperative - Starting date ("bl_123_sys_ther_pre_dstart") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:varHasValue,
		precParams:["bl_123_sys_ther_set", 3],
		func:dateCompareWithDelta,
		params:["bl_123_sys_ther_pre_dstart", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_123_sys_ther_set", "bl_123_sys_ther_pre_dstart", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_34',
		desc:'Systemic therapy - Setting Preoperative and Postoperative ("bl_123_sys_ther_set")=3 - Systemic therapy - Preoperative - Ending date ("bl_123_sys_ther_pre_dend") must be subsequent to Systemic therapy - Preoperative - Starting date ("bl_123_sys_ther_pre_dstart")',
		prec:varHasValue,
		precParams:["bl_123_sys_ther_set", 3],
		func:dateCompareWithDelta,
		params:["bl_123_sys_ther_pre_dend", "bl_123_sys_ther_pre_dstart", 0, ">="],
		vars:["bl_123_sys_ther_set", "bl_123_sys_ther_pre_dend", "bl_123_sys_ther_pre_dstart"]
	}
,
	{
		name:'dq_1_35',
		desc:'Systemic therapy - Setting Preoperative and Postoperative ("bl_123_sys_ther_set")=3 - Date of surgery ("bl_1_surg_dsurg") must be subsequent to Systemic therapy - Preoperative - Ending date ("bl_123_sys_ther_pre_dend")',
		prec:varHasValue,
		precParams:["bl_123_sys_ther_set", 3],
		func:dateCompareWithDelta,
		params:["bl_1_surg_dsurg", "bl_123_sys_ther_pre_dend", 0, ">="],
		vars:["bl_123_sys_ther_set", "bl_1_surg_dsurg", "bl_123_sys_ther_pre_dend"]
	}
,
	{
		name:'dq_1_36',
		desc:'Systemic therapy - Setting Preoperative and Postoperative ("bl_123_sys_ther_set")=3- Systemic therapy - Postoperative - Starting date ("bl_123_sys_ther_post_dstart") must be subsequent to Date of surgery ("bl_1_surg_dsurg")',
		prec:varHasValue,
		precParams:["bl_123_sys_ther_set", 3],
		func:dateCompareWithDelta,
		params:["bl_123_sys_ther_post_dstart", "bl_1_surg_dsurg", 0, ">="],
		vars:["bl_123_sys_ther_set", "bl_123_sys_ther_post_dstart", "bl_1_surg_dsurg"]
	}
,
	{
		name:'dq_1_37',
		desc:'Systemic therapy - Setting Preoperative and Postoperative ("bl_123_sys_ther_set")=3 - Systemic therapy - Postoperative - Ending date ("bl_123_sys_ther_post_dend") must be subsequent to Systemic therapy - Postoperative - Starting date ("bl_123_sys_ther_post_dstart")',
		prec:varHasValue,
		precParams:["bl_123_sys_ther_set", 3],
		func:dateCompareWithDelta,
		params:["bl_123_sys_ther_post_dend", "bl_123_sys_ther_post_dstart", 0, ">="],
		vars:["bl_123_sys_ther_set", "bl_123_sys_ther_post_dend", "bl_123_sys_ther_post_dstart"]
	}
,
	{
		name:'dq_1_38',
		desc:'Systemic therapy - Setting Palliative ("bl_123_sys_ther_set")=4 - Systemic therapy - Palliative - Starting date ("bl_123_sys_ther_pal_dstart") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:varHasValue,
		precParams:["bl_123_sys_ther_set", 4],
		func:dateCompareWithDelta,
		params:["bl_123_sys_ther_pal_dstart", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_123_sys_ther_set", "bl_123_sys_ther_pal_dstart", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_39',
		desc:'Systemic therapy - Setting Palliative ("bl_123_sys_ther_set")=4 - Systemic therapy - Palliative - Ending date ("bl_123_sys_ther_pal_dend") must be subsequent to Systemic therapy - Palliative - Starting date ("bl_123_sys_ther_pal_dstart")',
		prec:varHasValue,
		precParams:["bl_123_sys_ther_set", 4],
		func:dateCompareWithDelta,
		params:["bl_123_sys_ther_pal_dend", "bl_123_sys_ther_pal_dstart", 0, ">="],
		vars:["bl_123_sys_ther_set", "bl_123_sys_ther_pal_dend", "bl_123_sys_ther_pal_dstart"]
	}
,
	{
		name:'dq_1_40',
		desc:'Systemic therapy - Setting Postoperative ("bl_123_sys_ther_set")=2 - Systemic therapy - Postoperative - Starting date ("bl_123_sys_ther_post_dstart") must be subsequent to max 90 days post Radiotherapy Setting Definitive ("bl_1_radio_set")=3 - Radiotherapy - Ending date ("bl_1_radio_set_dend")',
		prec:multiVarHasValueAND,
		precParams:[["bl_1_radio_set", 3], ["bl_123_sys_ther_set", 2]],
		func:dateWithinIntervalWithDeltas,
		params:["bl_123_sys_ther_post_dstart", "bl_1_radio_set_dend", 0, "bl_1_radio_set_dend", 90],
		vars:["bl_1_radio_set", "bl_123_sys_ther_set", "bl_123_sys_ther_post_dstart", "bl_1_radio_set_dend"]
	}
,
	{
		name:'dq_1_41',
		desc:'Systemic therapy - Setting Postoperative ("bl_123_sys_ther_set")=2 - Systemic therapy - Postoperative - Starting date ("bl_123_sys_ther_post_dstart") must be subsequent to max 90 days post Date of surgery ("bl_1_surg_dsurg")',
		prec:varHasValue,
		precParams:["bl_123_sys_ther_set", 2],
		func:dateWithinIntervalWithDeltas,
		params:["bl_123_sys_ther_post_dstart", "bl_1_surg_dsurg", 0, "bl_1_surg_dsurg", 90],
		vars:["bl_123_sys_ther_set", "bl_123_sys_ther_post_dstart", "bl_1_surg_dsurg"]
	}
,
	{
		name:'dq_1_42',
		desc:'Radiotherapy - Starting date ("bl_1_radio_set_dstart") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_1_radio_set_dstart", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_1_radio_set_dstart", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_43',
		desc:'Radiotherapy - Ending date ("bl_1_radio_set_dend") must be subsequent to Radiotherapy- Starting date ("bl_1_radio_set_dstart")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_1_radio_set_dend", "bl_1_radio_set_dstart", 0, ">="],
		vars:["bl_1_radio_set_dend", "bl_1_radio_set_dstart"]
	}
,
	{
		name:'dq_1_44',
		desc:'Radiotherapy Setting Preoperative ("bl_1_radio_set")=1 - Date of surgery ("bl_1_surg_dsurg") must be subsequent to Radiotherapy - Ending date ("bl_1_radio_set_dend")',
		prec:varHasValue,
		precParams:["bl_1_radio_set", 1],
		func:dateCompareWithDelta,
		params:["bl_1_surg_dsurg", "bl_1_radio_set_dend", 0, ">="],
		vars:["bl_1_radio_set", "bl_1_surg_dsurg", "bl_1_radio_set_dend"]
	}
,
	{
		name:'dq_1_45',
		desc:'Radiotherapy Setting Postoperative ("bl_1_radio_set")=2 - Radiotherapy - Starting date ("bl_1_radio_set_dstart") must be subsequent to to max 60 days post Date of surgery ("bl_1_surg_dsurg")',
		prec:varHasValue,
		precParams:["bl_1_radio_set", 2],
		func:dateWithinIntervalWithDeltas,
		params:["bl_1_radio_set_dstart", "bl_1_surg_dsurg", 0, "bl_1_surg_dsurg", 60],
		vars:["bl_1_radio_set", "bl_1_radio_set_dstart", "bl_1_surg_dsurg"]
	}
,
	{
		name:'dq_1_46',
		desc:'Radiotherapy Setting Palliative ("bl_1_radio_set")=4 - Radiotherapy - Starting date ("bl_1_radio_set_dstart") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:varHasValue,
		precParams:["bl_1_radio_set", 4],
		func:dateCompareWithDelta,
		params:["bl_1_radio_set_dstart", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_1_radio_set", "bl_1_radio_set_dstart", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_47',
		desc:'Radiotherapy Setting Definitive ("bl_1_radio_set")=3 - Radiotherapy - Starting date ("bl_1_radio_set_dstart") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:varHasValue,
		precParams:["bl_1_radio_set", 3],
		func:dateCompareWithDelta,
		params:["bl_1_radio_set_dstart", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_1_radio_set", "bl_1_radio_set_dstart", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_48',
		desc:'Radiotherapy Setting Definitive ("bl_1_radio_set")=3 - Radiotherapy ("bl_123_radio_yn")=1 - Surgery ("bl_123_surg_yn")=0',
		prec:varHasValue,
		precParams:["bl_1_radio_set", 3],
		func:multiVarHasValueAND,
		params:[["bl_123_radio_yn", 1], ["bl_123_surg_yn", 0]],
		vars:["bl_1_radio_set", "bl_123_radio_yn", "bl_123_surg_yn"]
	}
,
	{
		name:'dq_1_49',
		desc:'Radiotherapy Setting Definitive ("bl_1_radio_set")=3 - Radiotherapy - Starting date ("bl_1_radio_set_dstart") must be subsequent to max 60 days post Systemic therapy - Preoperative - Ending date ("bl_123_sys_ther_pre_dend")',
		prec:varHasValue,
		precParams:["bl_1_radio_set", 3],
		func:dateWithinIntervalWithDeltas,
		params:["bl_1_radio_set_dstart", "bl_123_sys_ther_pre_dend", 0, "bl_123_sys_ther_pre_dend", 60],
		vars:["bl_1_radio_set", "bl_1_radio_set_dstart", "bl_123_sys_ther_pre_dend"]
	}
,
	{
		name:'dq_1_50',
		desc:'Lung - Radiotherapy - Starting date ("bl_23_radio_lung_dstart") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_23_radio_lung_dstart", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_radio_lung_dstart", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_51',
		desc:'Lung - Radiotherapy - Ending date ("bl_23_radio_lung_dend") must be subsequent to Lung - Radiotherapy - Starting date ("bl_23_radio_lung_dstart")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_23_radio_lung_dend", "bl_23_radio_lung_dstart", 0, ">="],
		vars:["bl_23_radio_lung_dend", "bl_23_radio_lung_dstart"]
	}
,
	{
		name:'dq_1_52',
		desc:'Lung - Radiotherapy Setting Preoperative ("bl_23_lung_radio_set")=1 - Lung - Date of surgery ("bl_23_surg_dsurg_lung") must be subsequent to Lung - Radiotherapy - Ending date ("bl_23_radio_lung_dend")',
		prec:varHasValue,
		precParams:["bl_23_lung_radio_set", 1],
		func:dateCompareWithDelta,
		params:["bl_23_surg_dsurg_lung", "bl_23_radio_lung_dend", 0, ">="],
		vars:["bl_23_lung_radio_set", "bl_23_surg_dsurg_lung", "bl_23_radio_lung_dend"]
	}
,
	{
		name:'dq_1_53',
		desc:'Lung - Radiotherapy Setting Postoperative ("bl_23_lung_radio_set")=2 - Lung - Radiotherapy - Starting date ("bl_23_radio_lung_dstart") must be subsequent to Lung - Date of surgery ("bl_23_surg_dsurg_lung")',
		prec:varHasValue,
		precParams:["bl_23_lung_radio_set", 2],
		func:dateCompareWithDelta,
		params:["bl_23_radio_lung_dstart", "bl_23_surg_dsurg_lung", 0, ">="],
		vars:["bl_23_lung_radio_set", "bl_23_radio_lung_dstart", "bl_23_surg_dsurg_lung"]
	}
,
	{
		name:'dq_1_54',
		desc:'Lung - Radiotherapy Setting Palliative ("bl_23_lung_radio_set")=4 - Lung - Radiotherapy - Starting date ("bl_23_radio_lung_dstart") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:varHasValue,
		precParams:["bl_23_lung_radio_set", 4],
		func:dateCompareWithDelta,
		params:["bl_23_radio_lung_dstart", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_lung_radio_set", "bl_23_radio_lung_dstart", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_55',
		desc:'Lung - Radiotherapy Setting Definitive ("bl_23_lung_radio_set")=3 - Lung - Radiotherapy - Starting date ("bl_23_radio_lung_dstart") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:varHasValue,
		precParams:["bl_23_lung_radio_set", 3],
		func:dateCompareWithDelta,
		params:["bl_23_radio_lung_dstart", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_lung_radio_set", "bl_23_radio_lung_dstart", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_56',
		desc:'Liver - Radiotherapy - Starting date ("bl_23_radio_liv_dstart") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_23_radio_liv_dstart", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_radio_liv_dstart", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_57',
		desc:'Liver - Radiotherapy - Ending date ("bl_23_radio_liv_dend") must be subsequent to Liver - Radiotherapy - Starting date ("bl_23_radio_liv_dstart")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_23_radio_liv_dend", "bl_23_radio_liv_dstart", 0, ">="],
		vars:["bl_23_radio_liv_dend", "bl_23_radio_liv_dstart"]
	}
,
	{
		name:'dq_1_58',
		desc:'Liver - Radiotherapy Setting Preoperative ("bl_23_liv_radio_set")=1 - Liver - Date of surgery ("bl_23_surg_dsurg_liv") must be subsequent to Liver - Radiotherapy - Ending date ("bl_23_radio_liv_dend")',
		prec:varHasValue,
		precParams:["bl_23_liv_radio_set", 1],
		func:dateCompareWithDelta,
		params:["bl_23_surg_dsurg_liv", "bl_23_radio_liv_dend", 0, ">="],
		vars:["bl_23_liv_radio_set", "bl_23_surg_dsurg_liv", "bl_23_radio_liv_dend"]
	}
,
	{
		name:'dq_1_59',
		desc:'Liver - Radiotherapy Setting Postoperative ("bl_23_liv_radio_set")=2 - Liver - Radiotherapy - Starting date ("bl_23_radio_liv_dstart") must be subsequent to Liver - Date of surgery ("bl_23_surg_dsurg_liv")',
		prec:varHasValue,
		precParams:["bl_23_liv_radio_set", 2],
		func:dateCompareWithDelta,
		params:["bl_23_radio_liv_dstart", "bl_23_surg_dsurg_liv", 0, ">="],
		vars:["bl_23_liv_radio_set", "bl_23_radio_liv_dstart", "bl_23_surg_dsurg_liv"]
	}
,
	{
		name:'dq_1_60',
		desc:'Liver - Radiotherapy Setting Palliative ("bl_23_liver_radio_set")=4 - Liver - Radiotherapy - Starting date ("bl_23_radio_liv_dstart") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:varHasValue,
		precParams:["bl_23_liv_radio_set", 4],
		func:dateCompareWithDelta,
		params:["bl_23_radio_liv_dstart", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_liv_radio_set", "bl_23_radio_liv_dstart", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_61',
		desc:'Liver - Radiotherapy Setting Definitive ("bl_23_liver_radio_set")=3 - Liver - Radiotherapy - Starting date ("bl_23_radio_liv_dstart") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:varHasValue,
		precParams:["bl_23_liv_radio_set", 3],
		func:dateCompareWithDelta,
		params:["bl_23_radio_liv_dstart", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_liv_radio_set", "bl_23_radio_liv_dstart", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_62',
		desc:'Bone - Radiotherapy - Starting date ("bl_23_radio_liv_dstart") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_23_radio_bone_dstart", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_radio_bone_dstart", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_63',
		desc:'Bone - Radiotherapy - Ending date ("bl_23_radio_liv_dend") must be subsequent to Bone - Radiotherapy - Starting date ("bl_23_radio_liv_dstart")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_23_radio_bone_dend", "bl_23_radio_bone_dstart", 0, ">="],
		vars:["bl_23_radio_bone_dend", "bl_23_radio_bone_dstart"]
	}
,
	{
		name:'dq_1_64',
		desc:'Bone - Radiotherapy Setting Preoperative ("bl_23_bone_radio_set")=1 - Bone - Date of surgery ("bl_23_surg_dsurg_bone") must be subsequent to Bone - Radiotherapy - Ending date ("bl_23_radio_liv_dend")',
		prec:varHasValue,
		precParams:["bl_23_bone_radio_set", 1],
		func:dateCompareWithDelta,
		params:["bl_23_surg_dsurg_bone", "bl_23_radio_bone_dend", 0, ">="],
		vars:["bl_23_bone_radio_set", "bl_23_surg_dsurg_bone", "bl_23_radio_bone_dend"]
	}
,
	{
		name:'dq_1_65',
		desc:'Bone - Radiotherapy Setting Postoperative ("bl_23_bone_radio_set")=2 - Bone - Radiotherapy - Starting date ("bl_23_radio_liv_dstart") must be subsequent to Bone - Date of surgery ("bl_23_surg_dsurg_bone")',
		prec:varHasValue,
		precParams:["bl_23_bone_radio_set", 2],
		func:dateCompareWithDelta,
		params:["bl_23_radio_bone_dstart", "bl_23_surg_dsurg_bone", 0, ">="],
		vars:["bl_23_bone_radio_set", "bl_23_radio_bone_dstart", "bl_23_surg_dsurg_bone"]
	}
,
	{
		name:'dq_1_66',
		desc:'Bone - Radiotherapy Setting Palliative ("bl_23_bone_radio_set")=4 - Bone - Radiotherapy - Starting date ("bl_23_radio_bone_dstart") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:varHasValue,
		precParams:["bl_23_bone_radio_set", 4],
		func:dateCompareWithDelta,
		params:["bl_23_radio_bone_dstart", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_bone_radio_set", "bl_23_radio_bone_dstart", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_67',
		desc:'Bone - Radiotherapy Setting Definitive ("bl_23_bone_radio_set")=3 - Bone - Radiotherapy - Starting date ("bl_23_radio_bone_dstart") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:varHasValue,
		precParams:["bl_23_bone_radio_set", 3],
		func:dateCompareWithDelta,
		params:["bl_23_radio_bone_dstart", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_bone_radio_set", "bl_23_radio_bone_dstart", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_68',
		desc:'Soft tissues - Radiotherapy - Starting date ("bl_23_radio_liv_dstart") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_23_radio_soft_dstart", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_radio_soft_dstart", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_69',
		desc:'Soft tissues - Radiotherapy - Ending date ("bl_23_radio_liv_dend") must be subsequent to Soft tissues - Radiotherapy - Starting date ("bl_23_radio_liv_dstart")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_23_radio_soft_dend", "bl_23_radio_soft_dstart", 0, ">="],
		vars:["bl_23_radio_soft_dend", "bl_23_radio_soft_dstart"]
	}
,
	{
		name:'dq_1_70',
		desc:'Soft tissues - Radiotherapy Setting Preoperative ("bl_23_soft_radio_set")=1 - Soft tissues - Date of surgery ("bl_23_surg_dsurg_soft") must be subsequent to Soft tissues - Radiotherapy - Ending date ("bl_23_radio_liv_dend")',
		prec:varHasValue,
		precParams:["bl_23_soft_radio_set", 1],
		func:dateCompareWithDelta,
		params:["bl_23_surg_dsurg_soft", "bl_23_radio_soft_dend", 0, ">="],
		vars:["bl_23_soft_radio_set", "bl_23_surg_dsurg_soft", "bl_23_radio_soft_dend"]
	}
,
	{
		name:'dq_1_71',
		desc:'Soft tissues - Radiotherapy Setting Postoperative ("bl_23_soft_radio_set")=2 - Soft tissues - Radiotherapy - Starting date ("bl_23_radio_liv_dstart") must be subsequent to Soft tissues - Date of surgery ("bl_23_surg_dsurg_soft")',
		prec:varHasValue,
		precParams:["bl_23_soft_radio_set", 2],
		func:dateCompareWithDelta,
		params:["bl_23_radio_soft_dstart", "bl_23_surg_dsurg_soft", 0, ">="],
		vars:["bl_23_soft_radio_set", "bl_23_radio_soft_dstart", "bl_23_surg_dsurg_soft"]
	}
,
	{
		name:'dq_1_72',
		desc:'Soft tissues - Radiotherapy Setting Palliative ("bl_23_soft_radio_set")=4 - Soft tissues - Radiotherapy - Starting date ("bl_23_radio_soft_dstart") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:varHasValue,
		precParams:["bl_23_soft_radio_set", 4],
		func:dateCompareWithDelta,
		params:["bl_23_radio_soft_dstart", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_soft_radio_set", "bl_23_radio_soft_dstart", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_73',
		desc:'Soft tissues - Radiotherapy Setting Definitive ("bl_23_soft_radio_set")=3 - Soft tissues - Radiotherapy - Starting date ("bl_23_radio_soft_dstart") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:varHasValue,
		precParams:["bl_23_soft_radio_set", 3],
		func:dateCompareWithDelta,
		params:["bl_23_radio_soft_dstart", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_soft_radio_set", "bl_23_radio_soft_dstart", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_74',
		desc:'Lymph nodes - Radiotherapy - Starting date ("bl_23_radio_lymph_dstart") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_23_radio_lymph_dstart", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_radio_lymph_dstart", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_75',
		desc:'Lymph nodes - Radiotherapy - Ending date ("bl_23_radio_lymph_dend") must be subsequent to Lymph nodes - Radiotherapy - Starting date ("bl_23_radio_lymph_dstart")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_23_radio_lymph_dend", "bl_23_radio_lymph_dstart", 0, ">="],
		vars:["bl_23_radio_lymph_dend", "bl_23_radio_lymph_dstart"]
	}
,
	{
		name:'dq_1_76',
		desc:'Lymph nodes - Radiotherapy Setting Preoperative ("bl_23_lymph_radio_set")=1 - Lymph nodes - Date of surgery ("bl_23_surg_dsurg_lymph") must be subsequent to Lymph nodes - Radiotherapy - Ending date ("bl_23_radio_lymph_dend")',
		prec:varHasValue,
		precParams:["bl_23_lymph_radio_set", 1],
		func:dateCompareWithDelta,
		params:["bl_23_surg_dsurg_lymph", "bl_23_radio_lymph_dend", 0, ">="],
		vars:["bl_23_lymph_radio_set", "bl_23_surg_dsurg_lymph", "bl_23_radio_lymph_dend"]
	}
,
	{
		name:'dq_1_77',
		desc:'Lymph nodes - Radiotherapy Setting Postoperative ("bl_23_lymph_radio_set")=2 - Lymph nodes - Radiotherapy - Starting date ("bl_23_radio_lymph_dstart") must be subsequent to Lymph nodes - Date of surgery ("bl_23_surg_dsurg_lymph")',
		prec:varHasValue,
		precParams:["bl_23_lymph_radio_set", 2],
		func:dateCompareWithDelta,
		params:["bl_23_radio_lymph_dstart", "bl_23_surg_dsurg_lymph", 0, ">="],
		vars:["bl_23_lymph_radio_set", "bl_23_radio_lymph_dstart", "bl_23_surg_dsurg_lymph"]
	}
,
	{
		name:'dq_1_78',
		desc:'Lymph nodes - Radiotherapy Setting Palliative ("bl_23_lymph_radio_set")=4 - Lymph nodes - Radiotherapy - Starting date ("bl_23_radio_lymph_dstart") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:varHasValue,
		precParams:["bl_23_lymph_radio_set", 4],
		func:dateCompareWithDelta,
		params:["bl_23_radio_lymph_dstart", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_lymph_radio_set", "bl_23_radio_lymph_dstart", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_79',
		desc:'Lymph nodes - Radiotherapy Setting Definitive ("bl_23_lymph_radio_set")=3 - Lymph nodes - Radiotherapy - Starting date ("bl_23_radio_lymph_dstart") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:varHasValue,
		precParams:["bl_23_lymph_radio_set", 3],
		func:dateCompareWithDelta,
		params:["bl_23_radio_lymph_dstart", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_lymph_radio_set", "bl_23_radio_lymph_dstart", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_80',
		desc:'Serosal - Radiotherapy - Starting date ("bl_23_radio_sero_dstart") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_23_radio_lymph_dstart", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_radio_lymph_dstart", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_81',
		desc:'Serosal - Radiotherapy - Ending date ("bl_23_radio_sero_dend") must be subsequent to Serosal - Radiotherapy - Starting date ("bl_23_radio_sero_dstart")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_23_radio_lymph_dend", "bl_23_radio_lymph_dstart", 0, ">="],
		vars:["bl_23_radio_lymph_dend", "bl_23_radio_lymph_dstart"]
	}
,
	{
		name:'dq_1_82',
		desc:'Serosal - Radiotherapy Setting Preoperative ("bl_23_sero_radio_set")=1 - Serosal - Date of surgery ("bl_23_surg_dsurg_sero") must be subsequent to Serosal - Radiotherapy - Ending date ("bl_23_radio_sero_dend")',
		prec:varHasValue,
		precParams:["bl_23_sero_radio_set", 1],
		func:dateCompareWithDelta,
		params:["bl_23_surg_dsurg_lymph", "bl_23_radio_lymph_dend", 0, ">="],
		vars:["bl_23_sero_radio_set", "bl_23_surg_dsurg_lymph", "bl_23_radio_lymph_dend"]
	}
,
	{
		name:'dq_1_83',
		desc:'Serosal - Radiotherapy Setting Postoperative ("bl_23_sero_radio_set")=2 - Serosal - Radiotherapy - Starting date ("bl_23_radio_sero_dstart") must be subsequent to Serosal - Date of surgery ("bl_23_surg_dsurg_sero")',
		prec:varHasValue,
		precParams:["bl_23_sero_radio_set", 2],
		func:dateCompareWithDelta,
		params:["bl_23_radio_lymph_dstart", "bl_23_surg_dsurg_lymph", 0, ">="],
		vars:["bl_23_sero_radio_set", "bl_23_radio_lymph_dstart", "bl_23_surg_dsurg_lymph"]
	}
,
	{
		name:'dq_1_84',
		desc:'Serosal - Radiotherapy Setting Palliative ("bl_23_sero_radio_set")=4 - Serosal - Radiotherapy - Starting date ("bl_23_radio_sero_dstart") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:varHasValue,
		precParams:["bl_23_sero_radio_set", 4],
		func:dateCompareWithDelta,
		params:["bl_23_radio_lymph_dstart", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_sero_radio_set", "bl_23_radio_lymph_dstart", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_85',
		desc:'Serosal - Radiotherapy Setting Definitive ("bl_23_sero_radio_set")=3 - Serosal - Radiotherapy - Starting date ("bl_23_radio_sero_dstart") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:varHasValue,
		precParams:["bl_23_sero_radio_set", 3],
		func:dateCompareWithDelta,
		params:["bl_23_radio_lymph_dstart", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_sero_radio_set", "bl_23_radio_lymph_dstart", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_86',
		desc:'Other - Radiotherapy - Starting date ("bl_23_radio_oth_dstart") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_23_radio_oth_dstart", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_radio_oth_dstart", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_87',
		desc:'Other - Radiotherapy - Ending date ("bl_23_radio_oth_dend") must be subsequent to Other - Radiotherapy - Starting date ("bl_23_radio_oth_dstart")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_23_radio_oth_dend", "bl_23_radio_oth_dstart", 0, ">="],
		vars:["bl_23_radio_oth_dend", "bl_23_radio_oth_dstart"]
	}
,
	{
		name:'dq_1_88',
		desc:'Other - Radiotherapy Setting Preoperative ("bl_23_oth_radio_set")=1 - Other - Date of surgery ("bl_23_surg_dsurg_oth") must be subsequent to Other - Radiotherapy - Ending date ("bl_23_radio_oth_dend")',
		prec:varHasValue,
		precParams:["bl_23_oth_radio_set", 1],
		func:dateCompareWithDelta,
		params:["bl_23_surg_dsurg_oth", "bl_23_radio_oth_dend", 0, ">="],
		vars:["bl_23_oth_radio_set", "bl_23_surg_dsurg_oth", "bl_23_radio_oth_dend"]
	}
,
	{
		name:'dq_1_89',
		desc:'Other - Radiotherapy Setting Postoperative ("bl_23_oth_radio_set")=2 - Other - Radiotherapy - Starting date ("bl_23_radio_oth_dstart") must be subsequent to Other - Date of surgery ("bl_23_surg_dsurg_oth")',
		prec:varHasValue,
		precParams:["bl_23_oth_radio_set", 2],
		func:dateCompareWithDelta,
		params:["bl_23_radio_oth_dstart", "bl_23_surg_dsurg_oth", 0, ">="],
		vars:["bl_23_oth_radio_set", "bl_23_radio_oth_dstart", "bl_23_surg_dsurg_oth"]
	}
,
	{
		name:'dq_1_90',
		desc:'Other - Radiotherapy Setting Palliative ("bl_23_oth_radio_set")=4 - Other - Radiotherapy - Starting date ("bl_23_radio_oth_dstart") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:varHasValue,
		precParams:["bl_23_oth_radio_set", 4],
		func:dateCompareWithDelta,
		params:["bl_23_radio_oth_dstart", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_oth_radio_set", "bl_23_radio_oth_dstart", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_91',
		desc:'Other - Radiotherapy Setting Definitive ("bl_23_oth_radio_set")=3 - Other - Radiotherapy - Starting date ("bl_23_radio_oth_dstart") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:varHasValue,
		precParams:["bl_23_oth_radio_set", 3],
		func:dateCompareWithDelta,
		params:["bl_23_radio_oth_dstart", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_oth_radio_set", "bl_23_radio_oth_dstart", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_92',
		desc:'Isolated limb perfusion - Procedure date ("bl_123_limb_dproc") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_123_limb_dproc", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_123_limb_dproc", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_93',
		desc:'Isolated limb perfusion - Setting Preoperative ("bl_123_limb_set")=1 - Date of surgery ("bl_1_surg_dsurg") must be subsequent to max 90 days post Isolated limb perfusion - Procedure date ("bl_123_limb_dproc")',
		prec:varHasValue,
		precParams:["bl_123_limb_set", 1],
		func:dateWithinIntervalWithDeltas,
		params:["bl_1_surg_dsurg", "bl_123_limb_dproc", 0, "bl_123_limb_dproc", 90],
		vars:["bl_123_limb_set", "bl_1_surg_dsurg", "bl_123_limb_dproc"]
	}
,
	{
		name:'dq_1_94',
		desc:'Isolated limb perfusion - Setting Definitive ("bl_123_limb_set")=2 - Procedure date ("bl_123_limb_dproc") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:varHasValue,
		precParams:["bl_123_limb_set", 2],
		func:dateCompareWithDelta,
		params:["bl_123_limb_dproc", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_123_limb_set", "bl_123_limb_dproc", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_95',
		desc:'Local ablative techniques - Procedure date ("bl_1_abla_dproc") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_1_abla_dproc", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_1_abla_dproc", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_96',
		desc:'Local ablative techniques - Setting Preoperative ("bl_1_abla_set")=1 - Date of surgery ("bl_1_surg_dsurg") must be subsequent to max 90 days post Local ablative techniques - Procedure date ("bl_1_abla_dproc")',
		prec:varHasValue,
		precParams:["bl_1_abla_set", 1],
		func:dateWithinIntervalWithDeltas,
		params:["bl_1_surg_dsurg", "bl_1_abla_dproc", 0, "bl_1_abla_dproc", 90],
		vars:["bl_1_abla_set", "bl_1_surg_dsurg", "bl_1_abla_dproc"]
	}
,
	{
		name:'dq_1_97',
		desc:'Local ablative techniques - Setting Definitive ("bl_1_abla_set")=2 - Procedure date ("bl_1_abla_dproc") must be subsequent to max 90 days post Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:varHasValue,
		precParams:["bl_1_abla_set", 2],
		func:dateWithinIntervalWithDeltas,
		params:["bl_1_abla_dproc", "bl_1st_pathol_ddiag", 0, "bl_1st_pathol_ddiag", 90],
		vars:["bl_1_abla_set", "bl_1_abla_dproc", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_98',
		desc:'Local ablative techniques - Setting Definitive ("bl_1_abla_set")=2  - Local ablative techniques ("bl_123_abla_yn")=1 - Surgery ("bl_123_surg_yn")=0',
		prec:varHasValue,
		precParams:["bl_1_abla_set", 2],
		func:multiVarHasValueAND,
		params:[["bl_123_abla_yn", 1], ["bl_123_surg_yn", 0]],
		vars:["bl_1_abla_set", "bl_123_abla_yn", "bl_123_surg_yn"]
	}
,
	{
		name:'dq_1_99',
		desc:'Lung - Local ablative techniques - Procedure date ("bl_23_abla_dproc_lung") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_23_abla_dproc_lung", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_abla_dproc_lung", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_100',
		desc:'Lung - Local ablative techniques Setting Preoperative ("bl_23_abla_set_lung")=1 - Lung - Date of surgery ("bl_23_surg_dsurg_lung") must be subsequent to Lung - Local ablative techniques - Procedure date ("bl_23_abla_dproc_lung")',
		prec:varHasValue,
		precParams:["bl_23_abla_set_lung", 1],
		func:dateCompareWithDelta,
		params:["bl_23_surg_dsurg_lung", "bl_23_abla_dproc_lung", 0, ">="],
		vars:["bl_23_abla_set_lung", "bl_23_surg_dsurg_lung", "bl_23_abla_dproc_lung"]
	}
,
	{
		name:'dq_1_101',
		desc:'Lung - Local ablative techniques - Setting Definitive ("bl_23_abla_set_lung")=2 - Lung - Local ablative techniques - Procedure date ("bl_23_abla_dproc_lung") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:varHasValue,
		precParams:["bl_23_abla_set_lung", 2],
		func:dateCompareWithDelta,
		params:["bl_23_abla_dproc_lung", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_abla_set_lung", "bl_23_abla_dproc_lung", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_102',
		desc:'Liver - Local ablative techniques - Procedure date ("bl_23_abla_dproc_liv") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_23_abla_dproc_liv", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_abla_dproc_liv", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_103',
		desc:'Liver - Local ablative techniques Setting Preoperative ("bl_23_abla_set_liv")=1 - Liver - Date of surgery ("bl_23_surg_dsurg_liv") must be subsequent to Liver - Local ablative techniques - Procedure date ("bl_23_abla_dproc_liv")',
		prec:varHasValue,
		precParams:["bl_23_abla_set_liv", 1],
		func:dateCompareWithDelta,
		params:["bl_23_surg_dsurg_liv", "bl_23_abla_dproc_liv", 0, ">="],
		vars:["bl_23_abla_set_liv", "bl_23_surg_dsurg_liv", "bl_23_abla_dproc_liv"]
	}
,
	{
		name:'dq_1_104',
		desc:'Liver - Local ablative techniques - Setting Definitive ("bl_23_abla_set_liv")=2 - Liver - Local ablative techniques - Procedure date ("bl_23_abla_dproc_liv") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:varHasValue,
		precParams:["bl_23_abla_set_liv", 2],
		func:dateCompareWithDelta,
		params:["bl_23_abla_dproc_liv", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_abla_set_liv", "bl_23_abla_dproc_liv", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_105',
		desc:'Bone - Local ablative techniques - Procedure date ("bl_23_abla_dproc_bone") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_23_abla_dproc_bone", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_abla_dproc_bone", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_106',
		desc:'Bone - Local ablative techniques Setting Preoperative ("bl_23_abla_set_bone")=1 - Bone - Date of surgery ("bl_23_surg_dsurg_bone") must be subsequent to Bone - Local ablative techniques - Procedure date ("bl_23_abla_dproc_bone")',
		prec:varHasValue,
		precParams:["bl_23_abla_set_bone", 1],
		func:dateCompareWithDelta,
		params:["bl_23_surg_dsurg_bone", "bl_23_abla_dproc_bone", 0, ">="],
		vars:["bl_23_abla_set_bone", "bl_23_surg_dsurg_bone", "bl_23_abla_dproc_bone"]
	}
,
	{
		name:'dq_1_107',
		desc:'Bone - Local ablative techniques - Setting Definitive ("bl_23_abla_set_bone")=2 - Bone - Local ablative techniques - Procedure date ("bl_23_abla_dproc_bone") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:null,
		precParams:["bl_23_abla_set_bone", 2],
		func:dateCompareWithDelta,
		params:["bl_23_abla_dproc_bone", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_abla_set_bone", "bl_23_abla_dproc_bone", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_108',
		desc:'Soft tissues - Local ablative techniques - Procedure date ("bl_23_abla_dproc_soft") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_23_abla_dproc_soft", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_abla_dproc_soft", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_109',
		desc:'Soft tissues - Local ablative techniques Setting Preoperative ("bl_23_abla_set_soft")=1 - Soft tissues - Date of surgery ("bl_23_surg_dsurg_soft") must be subsequent to Soft tissues - Local ablative techniques - Procedure date ("bl_23_abla_dproc_soft")',
		prec:varHasValue,
		precParams:["bl_23_abla_set_soft", 1],
		func:dateCompareWithDelta,
		params:["bl_23_surg_dsurg_soft", "bl_23_abla_dproc_soft", 0, ">="],
		vars:["bl_23_abla_set_soft", "bl_23_surg_dsurg_soft", "bl_23_abla_dproc_soft"]
	}
,
	{
		name:'dq_1_110',
		desc:'Soft tissues - Local ablative techniques - Setting Definitive ("bl_23_abla_set_soft")=2 - Soft tissues - Local ablative techniques - Procedure date ("bl_23_abla_dproc_soft") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:varHasValue,
		precParams:["bl_23_abla_set_soft", 2],
		func:dateCompareWithDelta,
		params:["bl_23_abla_dproc_soft", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_abla_set_soft", "bl_23_abla_dproc_soft", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_111',
		desc:'Lymph nodes - Local ablative techniques - Procedure date ("bl_23_abla_dproc_lymph") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_23_abla_dproc_lymph", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_abla_dproc_lymph", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_112',
		desc:'Lymph nodes - Local ablative techniques Setting Preoperative ("bl_23_abla_set_lymph")=1 - Lymph nodes - Date of surgery ("bl_23_surg_dsurg_lymph") must be subsequent to Lymph nodes - Local ablative techniques - Procedure date ("bl_23_abla_dproc_lymph")',
		prec:varHasValue,
		precParams:["bl_23_abla_set_lymph", 1],
		func:dateCompareWithDelta,
		params:["bl_23_surg_dsurg_lymph", "bl_23_abla_dproc_lymph", 0, ">="],
		vars:["bl_23_abla_set_lymph", "bl_23_surg_dsurg_lymph", "bl_23_abla_dproc_lymph"]
	}
,
	{
		name:'dq_1_113',
		desc:'Lymph nodes - Local ablative techniques - Setting Definitive ("bl_23_abla_set_lymph")=2 - Lymph nodes - Local ablative techniques - Procedure date ("bl_23_abla_dproc_lymph") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:varHasValue,
		precParams:["bl_23_abla_set_lymph", 2],
		func:dateCompareWithDelta,
		params:["bl_23_abla_dproc_lymph", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_abla_set_lymph", "bl_23_abla_dproc_lymph", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_114',
		desc:'Serosal - Local ablative techniques - Procedure date ("bl_23_abla_dproc_serosal") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_23_abla_dproc_serosal", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_abla_dproc_serosal", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_115',
		desc:'Serosal - Local ablative techniques Setting Preoperative ("bl_23_abla_set_serosal")=1 - Serosal - Date of surgery ("bl_23_surg_dsurg_sero") must be subsequent to Serosal - Local ablative techniques - Procedure date ("bl_23_abla_dproc_serosal")',
		prec:varHasValue,
		precParams:["bl_23_abla_set_serosal", 1],
		func:dateCompareWithDelta,
		params:["bl_23_surg_dsurg_sero", "bl_23_abla_dproc_serosal", 0, ">="],
		vars:["bl_23_abla_set_serosal", "bl_23_surg_dsurg_sero", "bl_23_abla_dproc_serosal"]
	}
,
	{
		name:'dq_1_116',
		desc:'Serosal - Local ablative techniques - Setting Definitive ("bl_23_abla_set_serosal")=2 - Serosal - Local ablative techniques - Procedure date ("bl_23_abla_dproc_serosal") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:varHasValue,
		precParams:["bl_23_abla_set_serosal", 2],
		func:dateCompareWithDelta,
		params:["bl_23_abla_dproc_serosal", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_abla_set_serosal", "bl_23_abla_dproc_serosal", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_117',
		desc:'Other - Local ablative techniques - Procedure date ("bl_23_abla_dproc_oth") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_23_abla_dproc_oth", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_abla_dproc_oth", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_118',
		desc:'Other - Local ablative techniques Setting Preoperative ("bl_23_abla_set_oth")=1 - Other - Date of surgery ("bl_23_surg_dsurg_oth") must be subsequent to Other - Local ablative techniques - Procedure date ("bl_23_abla_dproc_oth")',
		prec:varHasValue,
		precParams:["bl_23_abla_set_oth", 1],
		func:dateCompareWithDelta,
		params:["bl_23_surg_dsurg_oth", "bl_23_abla_dproc_oth", 0, ">="],
		vars:["bl_23_abla_set_oth", "bl_23_surg_dsurg_oth", "bl_23_abla_dproc_oth"]
	}
,
	{
		name:'dq_1_119',
		desc:'Other - Local ablative techniques - Setting Definitive ("bl_23_abla_set_oth")=2 - Other - Local ablative techniques - Procedure date ("bl_23_abla_dproc_oth") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:varHasValue,
		precParams:["bl_23_abla_set_oth", 2],
		func:dateCompareWithDelta,
		params:["bl_23_abla_dproc_oth", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_abla_set_oth", "bl_23_abla_dproc_oth", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_120',
		desc:'Date of surgery ("bl_1_surg_dsurg") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_1_surg_dsurg", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_1_surg_dsurg", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_121',
		desc:'Date of surgery ("bl_1_surg_dsurg") must be subsequent to max 60 days post Radiotherapy Setting Preoperative ("bl_1_radio_set")=1 - Radiotherapy - Ending date ("bl_1_radio_set_dend")',
		prec:varHasValue,
		precParams:["bl_1_radio_set", 1],
		func:dateWithinIntervalWithDeltas,
		params:["bl_1_surg_dsurg", "bl_1_radio_set_dend", 0, "bl_1_radio_set_dend", 60],
		vars:["bl_1_radio_set", "bl_1_surg_dsurg", "bl_1_radio_set_dend"]
	}
,
	{
		name:'dq_1_122',
		desc:'Lung - Date of surgery ("bl_23_surg_dsurg_lung") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_23_surg_dsurg_lung", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_surg_dsurg_lung", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_123',
		desc:'Liver - Date of surgery ("bl_23_surg_dsurg_liv") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_23_surg_dsurg_liv", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_surg_dsurg_liv", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_124',
		desc:'Bone - Date of surgery ("bl_23_surg_dsurg_bone") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_23_surg_dsurg_bone", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_surg_dsurg_bone", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_125',
		desc:'Soft tissues - Date of surgery ("bl_23_surg_dsurg_soft") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_23_surg_dsurg_soft", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_surg_dsurg_soft", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_126',
		desc:'Lymph nodes - Date of surgery ("bl_23_surg_dsurg_lymph") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_23_surg_dsurg_lymph", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_surg_dsurg_lymph", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_127',
		desc:'Serosal - Date of surgery ("bl_23_surg_dsurg_sero") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_23_surg_dsurg_sero", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_surg_dsurg_sero", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_128',
		desc:'Other - Date of surgery ("bl_23_surg_dsurg_oth") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["bl_23_surg_dsurg_oth", "bl_1st_pathol_ddiag", 0, ">="],
		vars:["bl_23_surg_dsurg_oth", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_1_129',
		desc:'Size of pathological specimen ("bl_1_surg_specsize") must be between 1 and 300',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["bl_1_surg_specsize", 1, 300],
		vars:["bl_1_surg_specsize"]
	}
,
	{
		name:'dq_1_130',
		desc:'Lung - Size of pathological specimen ("bl_23_surg_specsize_lung") must be between 1 and 300',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["bl_23_surg_specsize_lung", 1, 300],
		vars:["bl_23_surg_specsize_lung"]
	}
,
	{
		name:'dq_1_131',
		desc:'Liver - Size of pathological specimen ("bl_23_surg_specsize_liv") must be between 1 and 300',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["bl_23_surg_specsize_liv", 1, 300],
		vars:["bl_23_surg_specsize_liv"]
	}
,
	{
		name:'dq_1_132',
		desc:'Bone - Size of pathological specimen ("bl_23_surg_specsize_bone") must be between 1 and 300',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["bl_23_surg_specsize_bone", 1, 300],
		vars:["bl_23_surg_specsize_bone"]
	}
,
	{
		name:'dq_1_133',
		desc:'Soft tissues - Size of pathological specimen ("bl_23_surg_specsize_soft") must be between 1 and 300',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["bl_23_surg_specsize_soft", 1, 300],
		vars:["bl_23_surg_specsize_soft"]
	}
,
	{
		name:'dq_1_134',
		desc:'Lymph nodes - Size of pathological specimen ("bl_23_surg_specsize_lymph") must be between 1 and 300',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["bl_23_surg_specsize_lymph", 1, 300],
		vars:["bl_23_surg_specsize_lymph"]
	}
,
	{
		name:'dq_1_135',
		desc:'Serosal - Size of pathological specimen ("bl_23_surg_specsize_sero") must be between 1 and 300',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["bl_23_surg_specsize_sero", 1, 300],
		vars:["bl_23_surg_specsize_sero"]
	}
,
	{
		name:'dq_1_136',
		desc:'Other - Size of pathological specimen ("bl_23_surg_specsize_oth") must be between 1 and 300',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["bl_23_surg_specsize_oth", 1, 300],
		vars:["bl_23_surg_specsize_oth"]
	}
,
	{
		name:'dq_1_137',
		desc:'First pathological diagnosis ("bl_1st_pathol_ddiag") must be >= 1st December 2023',
		prec:null,
		precParams:null,
		func:dateCompareWithDateString,
		params:["bl_1st_pathol_ddiag", "2023-12-01", 0, ">="],
		vars:["bl_1st_pathol_ddiag"]
	}
,
/*
REPLACED BY multiOR on the 4 variables (see below)
	{
		name:'dq_1_138',
		desc:'Molecular testing for WWTR1 ("bl_molec_test_wwtr1") must be 1 (positive) or 2 (negative)',
		prec:null,
		precParams:null,
		func:multiVarHasValueOR,
		params:[["bl_molec_test_wwtr1", 1], ["bl_molec_test_wwtr1", 2]],
		vars:["bl_molec_test_wwtr1"]
	}
,
	{
		name:'dq_1_139',
		desc:'Molecular testing for CAMTA1 ("bl_molec_test_camta1") must be 1 (positive) or 2 (negative)',
		prec:null,
		precParams:null,
		func:multiVarHasValueOR,
		params:[["bl_molec_test_camta1", 1], ["bl_molec_test_camta1", 2]],
		vars:["bl_molec_test_camta1"]
	}
,
	{
		name:'dq_1_140',
		desc:'Molecular testing for YAP ("bl_molec_test_yap") must be 1 (positive) or 2 (negative)',
		prec:null,
		precParams:null,
		func:multiVarHasValueOR,
		params:[["bl_molec_test_yap", 1], ["bl_molec_test_yap", 2]],
		vars:["bl_molec_test_yap"]
	}
,
	{
		name:'dq_1_141',
		desc:'Molecular testing for TFE3 ("bl_molec_test_tfe3") must be 1 (positive) or 2 (negative)',
		prec:null,
		precParams:null,
		func:multiVarHasValueOR,
		params:[["bl_molec_test_tfe3", 1], ["bl_molec_test_tfe3", 2]],
		vars:["bl_molec_test_tfe3"],
	}
,
*/
	{
		name:'dq_1_138',
		desc:'At least one of the molecular testings ("bl_molec_test_wwtr1", "bl_molec_test_camta1", "bl_molec_test_yap", "bl_molec_test_tfe3") must be 1 (positive) or 2 (negative)',
		prec:null,
		precParams:null,
		func:multiVarHasValueOR,
		params:[["bl_molec_test_wwtr1", 1], ["bl_molec_test_wwtr1", 2], ["bl_molec_test_camta1", 1], ["bl_molec_test_camta1", 2], ["bl_molec_test_yap", 1], ["bl_molec_test_yap", 2], ["bl_molec_test_tfe3", 1], ["bl_molec_test_tfe3", 2]],
		vars:["bl_molec_test_wwtr1", "bl_molec_test_camta1", "bl_molec_test_yap", "bl_molec_test_tfe3"]
	},
	{
		name:'dq_2_1',
		desc:'Date of follow-up ("ufu_date") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:null,
		precParams:null,
		func:dateCompareToFixedDateRepInstr,
		params:["ufu_date", "bl_1st_pathol_ddiag", 0, ">", 1],
		vars:["ufu_date", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_2_2',
		desc:'Date of follow-up ("ufu_date") must be subsequent to Previous Date of follow-up ("ufu_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithPreviousSelfRepInstr,
		params:["ufu_date", 0, ">"],
		vars:["ufu_date"]
	}
,
	{
		name:'dq_2_3',
		desc:'Weight at last visit ("ufu_weight") must be between 20 and 250',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["ufu_weight", 20, 250],
		vars:["ufu_weight"]
	}
,
	{
		name:'dq_2_4',
		desc:'Tumour-related weight loss % at the time of follow-up ("ufu_symptoms_tum_rel_weight_loss") must be between 1 and 100',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["ufu_symptoms_tum_rel_weight_loss", 1, 100],
		vars:["ufu_symptoms_tum_rel_weight_loss"]
	}
,
	{
		name:'dq_2_5',
		desc:'Hemoglobin value ("ufu_hemo") must be between 1 and 25',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["ufu_hemo", 1, 25],
		vars:["ufu_hemo"]
	}
,
	{
		name:'dq_2_6',
		desc:'Fibrinogen value ("ufu_fibrin") must be between 1 and 2000',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["ufu_fibrin", 1, 2000],
		vars:["ufu_fibrin"]
	}
,
	{
		name:'dq_2_7',
		desc:'GDF-15 value ("ufu_gdf15") must be between 100 and 25000',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["ufu_gdf15", 100, 25000],
		vars:["ufu_gdf15"]
	}
,
	{
		name:'dq_2_8',
		desc:'Gender female - Menopausal date ("ufu_menopausal_date") must be subsequent to date of birth ("bl_dob")',
		prec:varHasValue,
		precParams:["bl_gender", 2],
		func:uniqueDateCompareToFixedDateRepInstr,
		params:["ufu_menopausal_date", "bl_dob", 0, ">=", 1],
		vars:["bl_gender", "ufu_menopausal_date", "bl_dob"]
	}
,
	{
		name:'dq_2_9',
		desc:'Surveillance ongoing ("ufu_surveil_yn")=1 in current instance - Surveillance ongoing ("ufu_surveil_yn")=1 in previous instance',
		prec:null,
		precParams:null,
		func:varHasValueWithPreviousSelfRepInstr,
		params:["ufu_surveil_yn", 1],
		vars:["ufu_surveil_yn"]
	}
,
	{
		name:'dq_2_10',
		desc:'Systemic therapy ongoing ("ufu_syst_ther_yn")=1  in current instance - Systemic therapy ongoing ("ufu_syst_ther_yn")=1 in previous instance',
		prec:null,
		precParams:null,
		func:varHasValueWithPreviousSelfRepInstr,
		params:["ufu_syst_ther_yn", 1],
		vars:["ufu_syst_ther_yn"]
	}
,
	{
		name:'dq_2_11',
		desc:'Date of death ("ufu_dod") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:null,
		precParams:null,
		func:uniqueDateCompareToFixedDateRepInstr,
		params:["ufu_dod", "bl_1st_pathol_ddiag", 0, ">=", 1],
		vars:["ufu_dod", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_2_11b',
		desc:'Date of death ("ufu_dod") must be subsequent to Last Date of follow-up ("ufu_date")',
		prec:null,
		precParams:null,
		func:uniqueDateCompareToMaxDateRepInstr,
		params:["ufu_dod", "ufu_date", 0, ">=", 1],
		vars:["ufu_dod", "ufu_date"]
	}
,
	{
		name:'dq_3_1',
		desc:'Date of local recurrence ("ulr_date") must be subsequent to Previous Date of follow-up ("ufu_date")',
		prec:null,
		precParams:null,
		func:multiDateCompareFirstVsLastInstRepInstr,
		params:["ulr_date", "ufu_date"],
		vars:["ulr_date", "ufu_date"]
	}
,
	{
		name:'dq_3_2',
		desc:'Date of local recurrence ("ulr_date") must be subsequent to Previous Date of local recurrence ("ulr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithPreviousSelfRepInstr,
		params:["ulr_date", 0, ">"],
		vars:["ulr_date"]
	}
,
	{
		name:'dq_3_3',
		desc:'Local recurrence size ("ulr_size") must be between 1 and 300',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["ulr_size", 1, 300],
		vars:["ulr_size"]
	}
,
	{
		name:'dq_3_4',
		desc:'Weight at local recurrence ("ulr_weight") must be between 20 and 250',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["ulr_weight", 20, 250],
		vars:["ulr_weight"]
	}
,
	{
		name:'dq_3_5',
		desc:'Tumour-related weight loss % at the time of local recurrence ("ulr_symptoms_tum_rel_weight_loss") must be between 1 and 100',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["ulr_symptoms_tum_rel_weight_loss", 1, 100],
		vars:["ulr_symptoms_tum_rel_weight_loss"]
	}
,
	{
		name:'dq_3_6',
		desc:'Hemoglobin value ("ulr_hemo") must be between 1 and 25',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["ulr_hemo", 1, 25],
		vars:["ulr_hemo"]
	}
,
	{
		name:'dq_3_7',
		desc:'Fibrinogen value ("ulr_fibrin") must be between 1 and 2000',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["ulr_fibrin", 1, 2000],
		vars:["ulr_fibrin"]
	}
,
	{
		name:'dq_3_8',
		desc:'GDF-15 value ("ulr_gdf15") must be between 100 and 25000',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["ulr_gdf15", 100, 25000],
		vars:["ulr_gdf15"]
	}
,
	{
		name:'dq_3_9',
		desc:'Gender female - Menopausal date ("ulr_menopausal_date") must be subsequent to date of birth ("bl_dob")',
		prec:varHasValue,
		precParams:["bl_gender", 2],
		func:uniqueDateCompareToFixedDateRepInstr,
		params:["ulr_menopausal_date", "bl_dob", 0, ">", 1],
		vars:["bl_gender", "ulr_menopausal_date", "bl_dob"]
	}
,
	{
		name:'dq_3_10',
		desc:'Surveillance at last follow-up ("ulr_surveil_yn")=1 - Surveillance ongoing ("ufu_surveil_yn" previous instance)=1',
		prec:null,
		precParams:null,
		func:multiVarHasValueFirstVsLastInstRepInstr,
		params:[["ulr_surveil_yn", 1], ["ufu_surveil_yn", 1]],
		vars:["ulr_surveil_yn", "ufu_surveil_yn"]
	}
,
	{
		name:'dq_3_11',
		desc:'Surveillance at last follow-up ("ulr_surveil_yn")=0 - Surveillance ongoing ("ufu_surveil_yn" previous instance)=0',
		prec:null,
		precParams:null,
		func:multiVarHasValueFirstVsLastInstRepInstr,
		params:[["ulr_surveil_yn", 0], ["ufu_surveil_yn", 0]],
		vars:["ulr_surveil_yn", "ufu_surveil_yn"]
	}
,
	{
		name:'dq_3_12',
		desc:'Surveillance continue ("ulr_surveil_continue_yn")=1 - New medical therapy ("ulr_sys_ther_new_yn")=0 - Systemic therapy ("ulr_sys_ther_start_yn")=0 - Radiotherapy ("ulr_radio_yn")=0 - Surgery ("ulr_surg_yn")=0 - Isolated limb perfusion ("ulr_limbperf_yn")=0 - Local ablative techniques ("ulr_abla_yn")=0',
		prec:null,
		precParams:null,
		func:multiVarHasValueRepInstr,
		params:[["ulr_surveil_continue_yn", 1], ["ulr_sys_ther_new_yn", 0], ["ulr_sys_ther_start_yn", 0], ["ulr_radio_yn", 0], ["ulr_surg_yn", 0], ["ulr_limbperf_yn", 0], ["ulr_abla_yn", 0]],
		vars:["ulr_surveil_continue_yn", "ulr_sys_ther_new_yn", "ulr_sys_ther_start_yn", "ulr_radio_yn", "ulr_surg_yn", "ulr_limbperf_yn", "ulr_abla_yn"]
	}
,
	{
		name:'dq_3_13',
		desc:'Systhemic therapy at last follow-up ("ulr_sys_ther_yn")=1 - Systemic therapy ongoing ("ufu_syst_ther_yn")=1',
		prec:null,
		precParams:null,
		func:multiVarHasValueFirstVsLastInstRepInstr,
		params:[["ulr_sys_ther_yn", 1], ["ufu_syst_ther_yn", 1]],
		vars:["ulr_sys_ther_yn", "ufu_syst_ther_yn"]
	}
,
	{
		name:'dq_3_14',
		desc:'Systhemic therapy at last follow-up ("ulr_sys_ther_yn")=0 - Systemic therapy ongoing ("ufu_syst_ther_yn")=0',
		prec:null,
		precParams:null,
		func:multiVarHasValueFirstVsLastInstRepInstr,
		params:[["ulr_sys_ther_yn", 0], ["ufu_syst_ther_yn", 0]],
		vars:["ulr_sys_ther_yn", "ufu_syst_ther_yn"]
	}
,
	{
		name:'dq_3_15',
		desc:'Systhemic therapy continue ("ulr_sys_ther_continue_yn")=1 - Surveillance continue ("ulr_surveil_continue_yn")=0',
		prec:null,
		precParams:null,
		func:multiVarHasValueRepInstr,
		params:[["ulr_sys_ther_continue_yn", 1], ["ulr_surveil_continue_yn", 0]],
		vars:["ulr_sys_ther_continue_yn", "ulr_surveil_continue_yn"]
	}
,
	{
		name:'dq_3_16',
		desc:'New medical therapy - Starting date ("ulr_sys_ther_new_pre_start") must be subsequent to Date of local recurrence ("ulr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["ulr_sys_ther_new_pre_start", "ulr_date", 0, ">="],
		vars:["ulr_sys_ther_new_pre_start", "ulr_date"]
	}
,
	{
		name:'dq_3_16b',
		desc:'New medical therapy - Starting date ("ulr_sys_ther_new_post_start") must be subsequent to Date of local recurrence ("ulr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["ulr_sys_ther_new_post_start", "ulr_date", 0, ">="],
		vars:["ulr_sys_ther_new_post_start", "ulr_date"]
	}
,
	{
		name:'dq_3_16c',
		desc:'New medical therapy - Starting date ("ulr_sys_ther_new_pal_start") must be subsequent to Date of local recurrence ("ulr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["ulr_sys_ther_new_pal_start", "ulr_date", 0, ">="],
		vars:["ulr_sys_ther_new_pal_start", "ulr_date"]
	}
,
	{
		name:'dq_3_17',
		desc:'New medical therapy - Ending date ("ulr_sys_ther_new_pre_end") must be subsequent to New medical therapy - Starting date ("ulr_sys_ther_new_pre_start")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["ulr_sys_ther_new_pre_end", "ulr_sys_ther_new_pre_start", 0, ">="],
		vars:["ulr_sys_ther_new_pre_end", "ulr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_3_17b',
		desc:'New medical therapy - Ending date ("ulr_sys_ther_new_post_end") must be subsequent to New medical therapy - Starting date ("ulr_sys_ther_new_post_start")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["ulr_sys_ther_new_post_end", "ulr_sys_ther_new_post_start", 0, ">="],
		vars:["ulr_sys_ther_new_post_end", "ulr_sys_ther_new_post_start"]
	}
,
	{
		name:'dq_3_17c',
		desc:'New medical therapy - Ending date ("ulr_sys_ther_new_pal_end") must be subsequent to New medical therapy - Starting date ("ulr_sys_ther_new_pal_start")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["ulr_sys_ther_new_pal_end", "ulr_sys_ther_new_pal_start", 0, ">="],
		vars:["ulr_sys_ther_new_pal_end", "ulr_sys_ther_new_pal_start"]
	}
,
	{
		name:'dq_3_18',
		desc:'New medical therapy Setting Preoperative ("ulr_sys_ther_new_set")=1 - Date of surgery ("ulr_surg_date") must be subsequent to New medical therapy - Ending date ("ulr_sys_ther_new_pre_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["ulr_sys_ther_new_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["ulr_surg_date", "ulr_sys_ther_new_pre_end", 0, ">="],
		vars:["ulr_sys_ther_new_set", "ulr_surg_date", "ulr_sys_ther_new_pre_end"]
	}
,
	{
		name:'dq_3_19',
		desc:'New medical therapy Setting Postoperative ("ulr_sys_ther_new_set")=2 - New medical therapy - Starting date ("ulr_sys_ther_new_post_start") must be subsequent to Date of surgery ("ulr_surg_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["ulr_sys_ther_new_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["ulr_sys_ther_new_post_start", "ulr_surg_date", 0, ">="],
		vars:["ulr_sys_ther_new_set", "ulr_sys_ther_new_post_start", "ulr_surg_date"]
	}
,
	{
		name:'dq_3_20',
		desc:'New medical therapy Setting Pre and Postoperative ("ulr_sys_ther_new_set")=3 - Date of surgery ("ulr_surg_date") must be subsequent to New medical therapy - Preoperative - Starting date ("ulr_sys_ther_new_pre_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["ulr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["ulr_surg_date", "ulr_sys_ther_new_pre_start", 0, ">="],
		vars:["ulr_sys_ther_new_set", "ulr_surg_date", "ulr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_3_21',
		desc:'New medical therapy Setting Pre and Postoperative ("ulr_sys_ther_new_set")=3 - New medical therapy - Ending date ("ulr_sys_ther_new_post_end") must be subsequent to Date of surgery ("ulr_surg_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["ulr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["ulr_sys_ther_new_post_end", "ulr_surg_date", 0, ">="],
		vars:["ulr_sys_ther_new_set", "ulr_sys_ther_new_post_end", "ulr_surg_date"]
	}
,
	{
		name:'dq_3_22',
		desc:'New medical therapy Setting Palliative ("ulr_sys_ther_new_set")=4 - New medical therapy - Starting date ("ulr_sys_ther_new_pal_start") must be subsequent to Date of local recurrence ("ulr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["ulr_sys_ther_new_set", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["ulr_sys_ther_new_pal_start", "ulr_date", 0, ">="],
		vars:["ulr_sys_ther_new_set", "ulr_sys_ther_new_pal_start", "ulr_date"]
	}
,
	{
		name:'dq_3_23',
		desc:'New medical therapy Setting Palliative ("ulr_sys_ther_new_set")=4 - New medical therapy - Ending date ("ulr_sys_ther_new_pal_end") must be subsequent to New medical therapy - Starting date ("ulr_sys_ther_new_pal_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["ulr_sys_ther_new_set", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["ulr_sys_ther_new_pal_end", "ulr_sys_ther_new_pal_start", 0, ">="],
		vars:["ulr_sys_ther_new_set", "ulr_sys_ther_new_pal_end", "ulr_sys_ther_new_pal_start"]
	}
,
		
	{
		name:'dq_3_32',
		desc:'Radiotherapy - Starting date ("ulr_radio_start") must be subsequent to Date of local recurrence ("ulr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["ulr_radio_start", "ulr_date", 0, ">="],
		vars:["ulr_radio_start", "ulr_date"]
	}
,
	{
		name:'dq_3_33',
		desc:'Radiotherapy - Ending date ("ulr_radio_end") must be subsequent to Radiotherapy - Starting date ("ulr_radio_start")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["ulr_radio_end", "ulr_radio_start", 0, ">="],
		vars:["ulr_radio_end", "ulr_radio_start"]
	}
,
	{
		name:'dq_3_34',
		desc:'Radiotherapy Setting Preoperative ("ulr_radio_set")=1 - Date of surgery ("ulr_surg_date") must be subsequent to Radiotherapy - Ending date ("ulr_radio_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["ulr_radio_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["ulr_surg_date", "ulr_radio_end", 0, ">="],
		vars:["ulr_radio_set", "ulr_surg_date", "ulr_radio_end"]
	}
,
	{
		name:'dq_3_35',
		desc:'Radiotherapy Setting Postoperative ("ulr_radio_set")=2 - Radiotherapy - Starting date ("ulr_radio_start") must be subsequent to Date of surgery ("ulr_surg_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["ulr_radio_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["ulr_radio_start", "ulr_surg_date", 0, ">="],
		vars:["ulr_radio_set", "ulr_radio_start", "ulr_surg_date"]
	}
,
	{
		name:'dq_3_36',
		desc:'Radiotherapy Setting Palliative ("ulr_radio_set")=3 - Radiotherapy - Starting date ("ulr_radio_start") must be subsequent to Date of local recurrence ("ulr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["ulr_radio_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["ulr_radio_start", "ulr_date", 0, ">="],
		vars:["ulr_radio_set", "ulr_radio_start", "ulr_date"]
	}
,
	{
		name:'dq_3_37',
		desc:'Radiotherapy Setting Palliative ("ulr_radio_set")=3 - Radiotherapy - Ending date ("ulr_radio_end") must be subsequent to Radiotherapy - Starting date ("ulr_radio_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["ulr_radio_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["ulr_radio_end", "ulr_radio_start", 0, ">="],
		vars:["ulr_radio_set", "ulr_radio_end", "ulr_radio_start"]
	}
,
	{
		name:'dq_3_38',
		desc:'Radiotherapy Setting Definitive ("ulr_radio_set")=4 - Radiotherapy - Starting date ("ulr_radio_start") must be subsequent to Date of local recurrence ("ulr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["ulr_radio_set", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["ulr_radio_start", "ulr_date", 0, ">="],
		vars:["ulr_radio_set", "ulr_radio_start", "ulr_date"]
	}
,
	{
		name:'dq_3_39',
		desc:'Radiotherapy Setting Definitive ("ulr_radio_set")=4 - Radiotherapy - Ending date ("ulr_radio_end") must be subsequent to Radiotherapy - Starting date ("ulr_radio_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["ulr_radio_set", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["ulr_radio_end", "ulr_radio_start", 0, ">="],
		vars:["ulr_radio_set", "ulr_radio_end", "ulr_radio_start"]
	}
,
	{
		name:'dq_3_40',
		desc:'Radiotherapy Setting Definitive ("ulr_radio_set")=4 -  Radiotherapy ("ulr_radio_yn")=1 - Surgery ("ulr_surg_yn")=0',
		prec:multiVarHasValueRepInstr,
		precParams:[[["ulr_radio_set", 4]]],
		func:multiVarHasValueRepInstr,
		params:[["ulr_radio_yn", 1], ["ulr_surg_yn", 0]],
		vars:["ulr_radio_set", "ulr_radio_yn", "ulr_surg_yn"]
	}
,
	{
		name:'dq_3_41',
		desc:'Radiotherapy Setting Postoperative ("ulr_radio_set")=2 - Radiotherapy - Starting date ("ulr_radio_start") must be subsequent to to max 60 days post Surgery ("ulr_surg_yn")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["ulr_radio_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["ulr_radio_start", "ulr_surg_yn", 0, ">="],
		vars:["ulr_radio_set", "ulr_radio_start", "ulr_surg_yn"]
	}
,
	{
		name:'dq_3_42',
		desc:'Isolated limb perfusion - Procedure date ("ulr_limbperf_date") must be subsequent to Date of local recurrence ("ulr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["ulr_limbperf_date", "ulr_date", 0, ">="],
		vars:["ulr_limbperf_date", "ulr_date"]
	}
,
	{
		name:'dq_3_43',
		desc:'Isolated limb perfusion Setting Preoperative ("ulr_limbperf_set")=1 - Date of surgery ("ulr_surg_date") must be subsequent to Isolated limb perfusion - Procedure date ("ulr_limbperf_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["ulr_limbperf_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["ulr_surg_date", "ulr_limbperf_date", 0, ">="],
		vars:["ulr_limbperf_set", "ulr_surg_date", "ulr_limbperf_date"]
	}
,
	{
		name:'dq_3_44',
		desc:'Isolated limb perfusion Setting Definitive ("ulr_limbperf_set")=4 - Procedure date ("ulr_limbperf_date") must be subsequent to Date of local recurrence ("ulr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["ulr_limbperf_set", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["ulr_limbperf_date", "ulr_date", 0, ">="],
		vars:["ulr_limbperf_set", "ulr_limbperf_date", "ulr_date"]
	}
,
	{
		name:'dq_3_45',
		desc:'Local ablative techniques - Procedure date ("ulr_abla_date") must be subsequent to Date of local recurrence ("ulr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["ulr_abla_date", "ulr_date", 0, ">="],
		vars:["ulr_abla_date", "ulr_date"]
	}
,
	{
		name:'dq_3_46',
		desc:'Local ablative techniques Setting Preoperative ("ulr_abla_set")=1 - Date of surgery ("ulr_surg_date") must be subsequent to Local ablative techniques - Procedure date ("ulr_abla_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["ulr_abla_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["ulr_surg_date", "ulr_abla_date", 0, ">="],
		vars:["ulr_abla_set", "ulr_surg_date", "ulr_abla_date"]
	}
,
	{
		name:'dq_3_47',
		desc:'Local ablative techniques Setting Definitive ("ulr_abla_set")=4 - Local ablative techniques - Procedure date ("ulr_abla_date") must be subsequent to Date of local recurrence ("ulr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["ulr_abla_set", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["ulr_abla_date", "ulr_date", 0, ">="],
		vars:["ulr_abla_set", "ulr_abla_date", "ulr_date"]
	}
,
	{
		name:'dq_3_48',
		desc:'Local ablative techniques Setting Definitive ("ulr_abla_set")=4 - Local ablative techniques ("ulr_abla_yn")=1 - Surgery ("ulr_surg_yn")=0',
		prec:multiVarHasValueRepInstr,
		precParams:[[["ulr_abla_set", 4]]],
		func:multiVarHasValueRepInstr,
		params:[["ulr_abla_yn", 1], ["ulr_surg_yn", 0]],
		vars:["ulr_abla_set", "ulr_abla_yn", "ulr_surg_yn"]
	}
,
	{
		name:'dq_3_49',
		desc:'Date of surgery ("ulr_surg_date") must be subsequent to Date of local recurrence ("ulr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["ulr_surg_date", "ulr_date", 0, ">="],
		vars:["ulr_surg_date", "ulr_date"]
	}
,
	{
		name:'dq_3_50',
		desc:'Size of pathological specimen ("ulr_surg_specsize") must be between 1 and 300',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["ulr_surg_specsize", 1, 300],
		vars:["ulr_surg_specsize"]
	}
,
	{
		name:'dq_3_51',
		desc:'Date of local recurrence pathological diagnosis ("ulr_pathol_date") must be subsequent to Date of local recurrence ("ulr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["ulr_pathol_date", "ulr_date", 0, ">="],
		vars:["ulr_pathol_date", "ulr_date"]
	}
,
	{
		name:'dq_3_52',
		desc:'Mitotic index value ("ulr_pathol_prog_mito") must be between 1 and 99',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["ulr_pathol_prog_mito", 1, 99],
		vars:["ulr_pathol_prog_mito"]
	}
,
	{
		name:'dq_3_53',
		desc:'Date of death ("ulr_dod") must be subsequent to Date of registration ("bl_dor")',
		prec:null,
		precParams:null,
		func:uniqueDateCompareToFixedDateRepInstr,
		params:["ulr_dod", "bl_dor", 0, ">=", 1],
		vars:["ulr_dod", "bl_dor"]
	}
,
	{
		name:'dq_4_1',
		desc:'Date of distant metastases ("udm_date") must be subsequent to Previous Date of Local Recurrence ("ulr_date")',
		prec:null,
		precParams:null,
		func:multiDateCompareFixedVsLastInstRepInstr,
		params:["udm_date", "ulr_date", 0, ">"],
		vars:["udm_date", "ulr_date"]
	}
,
	{
		name:'dq_4_3',
		desc:'Lung - Multiple lesions: number of lesions ("udm_dis_ext_lung_les_spec") must be between 1 and 100',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["udm_dis_ext_lung_les_spec", 1, 100],
		vars:["udm_dis_ext_lung_les_spec"]
	}
,
	{
		name:'dq_4_4',
		desc:'Liver - Multiple lesions: number of lesions ("udm_dis_ext_liv_les_spec") must be between 1 and 100',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["udm_dis_ext_liv_les_spec", 1, 100],
		vars:["udm_dis_ext_liv_les_spec"]
	}
,
	{
		name:'dq_4_5',
		desc:'Bone - Multiple lesions: number of lesions ("udm_dis_ext_bone_les_spec") must be between 1 and 100',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["udm_dis_ext_bone_les_spec", 1, 100],
		vars:["udm_dis_ext_bone_les_spec"]
	}
,
	{
		name:'dq_4_6',
		desc:'Soft tissues (Limb) - Multiple lesions: number of lesions ("udm_dis_ext_soft_les_limb_spec") must be between 1 and 100',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["udm_dis_ext_soft_les_limb_spec", 1, 100],
		vars:["udm_dis_ext_soft_les_limb_spec"]
	}
,
	{
		name:'dq_4_7',
		desc:'Soft tissues (Superficial trunk) - Multiple lesions: number of lesions ("udm_dis_ext_soft_les_trunk_spec") must be between 1 and 100',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["udm_dis_ext_soft_les_trunk_spec", 1, 100],
		vars:["udm_dis_ext_soft_les_trunk_spec"]
	}
,
	{
		name:'dq_4_8',
		desc:'Soft tissues (Intra-abdominal) - Multiple lesions: number of lesions ("udm_dis_ext_soft_les_abdo_spec") must be between 1 and 100',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["udm_dis_ext_soft_les_abdo_spec", 1, 100],
		vars:["udm_dis_ext_soft_les_abdo_spec"]
	}
,
	{
		name:'dq_4_9',
		desc:'Soft tissues (Intrathoracic) - Multiple lesions: number of lesions ("udm_dis_ext_soft_les_thor_spec") must be between 1 and 100',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["udm_dis_ext_soft_les_thor_spec", 1, 100],
		vars:["udm_dis_ext_soft_les_thor_spec"]
	}
,
	{
		name:'dq_4_10',
		desc:'Soft tissues (Head & neck) - Multiple lesions: number of lesions ("udm_dis_ext_soft_les_hn_spec") must be between 1 and 100',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["udm_dis_ext_soft_les_hn_spec", 1, 100],
		vars:["udm_dis_ext_soft_les_hn_spec"]
	}
,
	{
		name:'dq_4_12',
		desc:'Weight at distant metastases ("udm_weight") must be between 20 and 250',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["udm_weight", 20, 250],
		vars:["udm_weight"]
	}
,
	{
		name:'dq_4_13',
		desc:'Tumour-related weight loss % at the time of distant metastases ("udm_symptoms_tum_rel_weight_loss") must be between 1 and 100',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["udm_symptoms_tum_rel_weight_loss", 1, 100],
		vars:["udm_symptoms_tum_rel_weight_loss"]
	}
,
	{
		name:'dq_4_14',
		desc:'Hemoglobin value ("udm_hemo") must be between 1 and 25',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["udm_hemo", 1, 25],
		vars:["udm_hemo"]
	}
,
	{
		name:'dq_4_15',
		desc:'Fibrinogen value ("udm_fibrin") must be between 1 and 2000',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["udm_fibrin", 1, 2000],
		vars:["udm_fibrin"]
	}
,
	{
		name:'dq_4_16',
		desc:'GDF-15 value ("udm_gdf15") must be between 100 and 25000',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["udm_gdf15", 100, 25000],
		vars:["udm_gdf15"]
	}
,
	{
		name:'dq_4_17',
		desc:'Gender female - Menopausal date ("udm_menopausal_date") must be subsequent to date of birth ("bl_dob")',
		prec:varHasValue,
		precParams:["bl_gender", 2],
		func:dateCompareWithDelta,
		params:["udm_menopausal_date", "bl_dob", 0, ">"],
		vars:["udm_menopausal_date", "bl_dob"]
	}
,
	{
		name:'dq_4_18',
		desc:'Surveillance at last follow-up ("udm_surveil_yn")=1 - Surveillance ongoing ("ufu_surveil_yn" previous instance)=1',
		prec:null,
		precParams:null,
		func:multiVarHasValueFixedVsLastInstRepInstr,
		params:[["udm_surveil_yn", 1], ["ufu_surveil_yn", 1]],
		vars:["udm_surveil_yn", "ufu_surveil_yn"]
	}
,
	{
		name:'dq_4_19',
		desc:'Surveillance at last follow-up ("udm_surveil_yn")=0 - Surveillance ongoing ("ufu_surveil_yn" previous instance)=0',
		prec:null,
		precParams:null,
		func:multiVarHasValueFixedVsLastInstRepInstr,
		params:[["udm_surveil_yn", 0], ["ufu_surveil_yn", 0]],
		vars:["udm_surveil_yn", "ufu_surveil_yn"]
	}
,
	{
		name:'dq_4_20',
		desc:'Surveillance continue ("udm_surveil_continue_yn")=1 - New medical therapy ("udm_sys_ther_new_yn")=0 - Radiotherapy ("udm_radio_yn")=0 - Isolated limb perfusion ("udm_limbperf_yn")=0 - Local ablative techniques ("udm_abla_yn")=0',
		prec:null,
		precParams:null,
		func:multiVarHasValueAND,
		params:[["udm_surveil_continue_yn", 1], ["udm_sys_ther_new_yn", 0], ["udm_radio_yn", 0], ["udm_limbperf_yn", 0], ["udm_abla_yn", 0]],
		vars:["udm_surveil_continue_yn", "udm_sys_ther_new_yn", "udm_radio_yn", "udm_limbperf_yn", "udm_abla_yn"]
	}
,
	{
		name:'dq_4_21',
		desc:'Systhemic therapy at last follow-up ("udm_sys_ther_yn")=1 - Systemic therapy ongoing ("ufu_syst_ther_yn")=1',
		prec:null,
		precParams:null,
		func:multiVarHasValueFixedVsLastInstRepInstr,
		params:[["udm_sys_ther_yn", 1], ["ufu_syst_ther_yn", 1]],
		vars:["udm_sys_ther_yn", "ufu_syst_ther_yn"]
	}
,
	{
		name:'dq_4_22',
		desc:'Systhemic therapy at last follow-up ("udm_sys_ther_yn")=0 - Systemic therapy ongoing ("ufu_syst_ther_yn")=0',
		prec:null,
		precParams:null,
		func:multiVarHasValueFixedVsLastInstRepInstr,
		params:[["udm_sys_ther_yn", 0], ["ufu_syst_ther_yn", 0]],
		vars:["udm_sys_ther_yn", "ufu_syst_ther_yn"]
	}
,
	{
		name:'dq_4_23',
		desc:'Systhemic therapy continue ("udm_sys_ther_continue_yn")=1 - Surveillance continue ("udm_surveil_continue_yn")=0',
		prec:null,
		precParams:null,
		func:multiVarHasValueAND,
		params:[["udm_sys_ther_continue_yn", 1], ["udm_surveil_continue_yn", 0]],
		vars:["udm_sys_ther_continue_yn", "udm_surveil_continue_yn"]
	}
,
	{
		name:'dq_4_24',
		desc:'New medical therapy - Starting date ("udm_sys_ther_new_start") must be subsequent to Date of distant metastases ("udm_date")',
		prec:null,
		precParams:null,
		func:compareAllDatesToFixed,
		params:[["udm_sys_ther_new_pre_start", "udm_sys_ther_new_post_start", "udm_sys_ther_new_pal_start"], "udm_date", 0, ">", 1],
		vars:["udm_sys_ther_new_pre_start", "udm_sys_ther_new_post_start", "udm_sys_ther_new_pal_start", "udm_date"]
	}
,
	{
		name:'dq_4_25',
		desc:'New medical therapy - Ending date ("udm_sys_ther_new_pre_end") must be subsequent to New medical therapy - Preoperative - Starting date ("udm_sys_ther_new_pre_start")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["udm_sys_ther_new_pre_end", "udm_sys_ther_new_pre_start", 0, ">"],
		vars:["udm_sys_ther_new_pre_end", "udm_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_4_26',
		desc:'New medical therapy Setting Preoperative ("udm_sys_ther_new_set")=1 - Date of surgery ("udm_surg_date") must be subsequent to New medical therapy - Preoperative - Ending date ("udm_sys_ther_new_pre_end")',
		prec:varHasValue,
		precParams:["udm_sys_ther_new_set", 1],
		func:dateCompareWithDelta,
		params:["udm_surg_date", "udm_sys_ther_new_pre_end", 0, ">"],
		vars:["udm_sys_ther_new_set", "udm_surg_date", "udm_sys_ther_new_pre_end"]
	}
,
	{
		name:'dq_4_27',
		desc:'New medical therapy Setting Postoperative  ("udm_sys_ther_new_set")=2 - New medical therapy - Starting date ("udm_sys_ther_new_pre_start") must be subsequent to Date of surgery ("udm_surg_date")',
		prec:varHasValue,
		precParams:["udm_sys_ther_new_set", 2],
		func:dateCompareWithDelta,
		params:["udm_sys_ther_new_pre_start", "udm_surg_date", 0, ">"],
		vars:["udm_sys_ther_new_set", "udm_sys_ther_new_pre_start", "udm_surg_date"]
	}
,
	{
		name:'dq_4_28',
		desc:'New medical therapy Setting Pre and Postoperative ("udm_sys_ther_new_set")=3 - Date of surgery ("udm_surg_date") must be subsequent to New medical therapy - Preoperative - Starting date ("udm_sys_ther_new_pre_start")',
		prec:varHasValue,
		precParams:["udm_sys_ther_new_set", 3],
		func:dateCompareWithDelta,
		params:["udm_surg_date", "udm_sys_ther_new_pre_start", 0, ">"],
		vars:["udm_sys_ther_new_set", "udm_surg_date", "udm_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_4_29',
		desc:'New medical therapy Setting Pre and Postoperative ("udm_sys_ther_new_set")=3 - New medical therapy - Ending date ("udm_sys_ther_new_post_end") must be subsequent to Date of surgery ("udm_surg_date")',
		prec:varHasValue,
		precParams:["udm_sys_ther_new_set", 3],
		func:dateCompareWithDelta,
		params:["udm_sys_ther_new_post_end", "udm_surg_date", 0, ">"],
		vars:["udm_sys_ther_new_set", "udm_sys_ther_new_post_end", "udm_surg_date"]
	}
,
	{
		name:'dq_4_30',
		desc:'New medical therapy Setting Palliative ("udm_sys_ther_new_set")=4 - New medical therapy - Starting date ("udm_sys_ther_new_pal_start") must be subsequent to Date of distant metastases ("udm_date")',
		prec:varHasValue,
		precParams:["udm_sys_ther_new_set", 4],
		func:dateCompareWithDelta,
		params:["udm_sys_ther_new_pal_start", "udm_date", 0, ">"],
		vars:["udm_sys_ther_new_set", "udm_sys_ther_new_pal_start", "udm_date"]
	}
,
	{
		name:'dq_4_31',
		desc:'New medical therapy Setting Palliative ("udm_sys_ther_new_set")=4 - New medical therapy - Ending date ("udm_sys_ther_new_pal_end") must be subsequent to New medical therapy - Starting date ("udm_sys_ther_new_pal_start")',
		prec:varHasValue,
		precParams:["udm_sys_ther_new_set", 4],
		func:dateCompareWithDelta,
		params:["udm_sys_ther_new_pal_end", "udm_sys_ther_new_pal_start", 0, ">"],
		vars:["udm_sys_ther_new_set", "udm_sys_ther_new_pal_end", "udm_sys_ther_new_pal_start"]
	}
,
	{
		name:'dq_4_40',
		desc:'Radiotherapy - Starting date ("udm_radio_start") must be subsequent to Date of distant metastases ("udm_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["udm_radio_start", "udm_date", 0, ">"],
		vars:["udm_radio_start", "udm_date"]
	}
,
	{
		name:'dq_4_41',
		desc:'Radiotherapy - Ending date ("udm_radio_end") must be subsequent to Radiotherapy - Starting date ("udm_radio_start")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["udm_radio_end", "udm_radio_start", 0, ">"],
		vars:["udm_radio_end", "udm_radio_start"]
	}
,
	{
		name:'dq_4_42',
		desc:'Radiotherapy Setting Preoperative ("udm_radio_set")=1 - Date of surgery ("udm_surg_date") must be subsequent to Radiotherapy - Ending date ("udm_radio_end")',
		prec:varHasValue,
		precParams:["udm_radio_set", 1],
		func:dateCompareWithDelta,
		params:["udm_surg_date", "udm_radio_end", 0, ">"],
		vars:["udm_radio_set", "udm_surg_date", "udm_radio_end"]
	}
,
	{
		name:'dq_4_43',
		desc:'Radiotherapy Setting Postoperative ("udm_radio_set")=2 - Radiotherapy - Starting date ("udm_radio_start") must be subsequent to Date of surgery ("udm_surg_date")',
		prec:varHasValue,
		precParams:["udm_radio_set", 2],
		func:dateCompareWithDelta,
		params:["udm_radio_start", "udm_surg_date", 0, ">"],
		vars:["udm_radio_set", "udm_radio_start", "udm_surg_date"]
	}
,
	{
		name:'dq_4_44',
		desc:'Radiotherapy Setting Palliative ("udm_radio_set")=5 - Radiotherapy - Starting date ("udm_radio_start") must be subsequent to Date of distant metastases ("udm_date")',
		prec:varHasValue,
		precParams:["udm_radio_set", 5],
		func:dateCompareWithDelta,
		params:["udm_radio_start", "udm_date", 0, ">"],
		vars:["udm_radio_set", "udm_radio_start", "udm_date"]
	}
,
	{
		name:'dq_4_45',
		desc:'Radiotherapy Setting Palliative ("udm_radio_set")=5 - Radiotherapy - Ending date ("udm_radio_end") must be subsequent to Radiotherapy - Starting date ("udm_radio_start")',
		prec:varHasValue,
		precParams:["udm_radio_set", 5],
		func:dateCompareWithDelta,
		params:["udm_radio_end", "udm_radio_start", 0, ">"],
		vars:["udm_radio_set", "udm_radio_end", "udm_radio_start"]
	}
,
	{
		name:'dq_4_46',
		desc:'Radiotherapy Setting Definitive ("udm_radio_set")=4 - Radiotherapy - Starting date ("udm_radio_start") must be subsequent to Date of distant metastases ("udm_date")',
		prec:varHasValue,
		precParams:["udm_radio_set", 4],
		func:dateCompareWithDelta,
		params:["udm_radio_start", "udm_date", 0, ">"],
		vars:["udm_radio_set", "udm_radio_start", "udm_date"]
	}
,
	{
		name:'dq_4_47',
		desc:'Radiotherapy Setting Definitive ("udm_radio_set")=4 - Radiotherapy - Ending date ("udm_radio_end") must be subsequent to Radiotherapy - Starting date ("udm_radio_start")',
		prec:varHasValue,
		precParams:["udm_radio_set", 4],
		func:dateCompareWithDelta,
		params:["udm_radio_end", "udm_radio_start", 0, ">"],
		vars:["udm_radio_set", "udm_radio_end", "udm_radio_start"]
	}
,
	{
		name:'dq_4_48',
		desc:'Radiotherapy Setting Definitive ("udm_radio_set")=4 - Radiotherapy ("udm_radio_yn")=1 - Surgery ("udm_surg_yn")=0',
		prec:varHasValue,
		precParams:["udm_radio_set", 4],
		func:multiVarHasValueAND,
		params:[["udm_radio_yn", 1], ["udm_surg_yn", 0]],
		vars:["udm_radio_set", "udm_radio_yn", "udm_surg_yn"]
	}
,
	{
		name:'dq_4_49',
		desc:'Isolated limb perfusion - Procedure date ("udm_limbperf_date") must be subsequent to Date of distant metastases ("udm_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["udm_limbperf_date", "udm_date", 0, ">"],
		vars:["udm_limbperf_date", "udm_date"]
	}
,
	{
		name:'dq_4_50',
		desc:'Isolated limb perfusion - Setting Preoperative ("udm_limbperf_set")=1 - Date of surgery ("udm_surg_date") must be subsequent to Isolated limb perfusion - Procedure date ("udm_limbperf_date")',
		prec:varHasValue,
		precParams:["udm_limbperf_set", 1],
		func:dateCompareWithDelta,
		params:["udm_surg_date", "udm_limbperf_date", 0, ">"],
		vars:["udm_limbperf_set", "udm_surg_date", "udm_limbperf_date"]
	}
,
	{
		name:'dq_4_51',
		desc:'Isolated limb perfusion Setting Definitive ("udm_limbperf_set")=4 - Procedure date ("udm_limbperf_date") must be subsequent to Date of distant metastases ("udm_date")',
		prec:varHasValue,
		precParams:["udm_limbperf_set", 4],
		func:dateCompareWithDelta,
		params:["udm_limbperf_date", "udm_date", 0, ">"],
		vars:["udm_limbperf_set", "udm_limbperf_date", "udm_date"]
	}
,
	{
		name:'dq_4_52',
		desc:'Isolated limb perfusion Setting Palliative ("udm_limbperf_set")=5 - Procedure date ("udm_limbperf_date") must be subsequent to Date of distant metastases ("udm_date")',
		prec:varHasValue,
		precParams:["udm_limbperf_set", 5],
		func:dateCompareWithDelta,
		params:["udm_limbperf_date", "udm_date", 0, ">"],
		vars:["udm_limbperf_set", "udm_limbperf_date", "udm_date"]
	}
,
	{
		name:'dq_4_53',
		desc:'Local ablative techniques - Procedure date ("udm_abla_date") must be subsequent to Date of distant metastases ("udm_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["udm_abla_date", "udm_date", 0, ">"],
		vars:["udm_abla_date", "udm_date"]
	}
,
	{
		name:'dq_4_54',
		desc:'Local ablative techniques Setting Preoperative ("udm_abla_set")=1 - Date of surgery ("udm_surg_date") must be subsequent to Local ablative techniques - Procedure date ("udm_abla_date")',
		prec:varHasValue,
		precParams:["udm_abla_set", 1],
		func:dateCompareWithDelta,
		params:["udm_surg_date", "udm_abla_date", 0, ">"],
		vars:["udm_abla_set", "udm_surg_date", "udm_abla_date"]
	}
,
	{
		name:'dq_4_55',
		desc:'Local ablative techniques Setting Definitive ("udm_abla_set")=4 - Local ablative techniques - Procedure date ("udm_abla_date") must be subsequent to Date of distant metastases ("udm_date")',
		prec:varHasValue,
		precParams:["udm_abla_set", 4],
		func:dateCompareWithDelta,
		params:["udm_abla_date", "udm_date", 0, ">"],
		vars:["udm_abla_set", "udm_abla_date", "udm_date"]
	}
,
	{
		name:'dq_4_56',
		desc:'Local ablative techniques Setting Definitive ("udm_abla_set")=4 - Surgery ("udm_surg_yn")=0',
		prec:varHasValue,
		precParams:["udm_abla_set", 4],
		func:varHasValue,
		params:["udm_surg_yn", 0],
		vars:["udm_abla_set", "udm_surg_yn"]
	}
,
	{
		name:'dq_4_57',
		desc:'Date of surgery ("udm_surg_date") must be subsequent to Date of distant metastases ("udm_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["udm_surg_date", "udm_date", 0, ">"],
		vars:["udm_surg_date", "udm_date"]
	}
,
	{
		name:'dq_4_58',
		desc:'Size of pathological specimen ("udm_surg_specsize") must be between 1 and 300',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["udm_surg_specsize", 1, 300],
		vars:["udm_surg_specsize"]
	}
,
	{
		name:'dq_4_59',
		desc:'Date of distant metastases pathological diagnosis ("udm_pathol_date") must be subsequent to Date of distant metastases ("udm_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["udm_pathol_date", "udm_date", 0, ">"],
		vars:["udm_pathol_date", "udm_date"]
	}
,
	{
		name:'dq_4_60',
		desc:'Mitotic index value ("udm_pathol_prog_mito") must be between 1 and 99',
		prec:null,
		precParams:null,
		func:varWithinInterval,
		params:["udm_pathol_prog_mito", 1, 99],
		vars:["udm_pathol_prog_mito"]
	}
,
	{
		name:'dq_4_61',
		desc:'Date of death ("udm_dod") must be subsequent to Date of registration ("bl_dor")',
		prec:null,
		precParams:null,
		func:dateCompareWithDelta,
		params:["udm_dod", "bl_dor", 0, ">"],
		vars:["udm_dod", "bl_dor"]
	}
,
	{
		name:'dq_5_1',
		desc:'Date of follow-up ("lfu_date") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag") or Surveillance Ending Date ("bl_123_surv_dend") or Systemic therapy - Preoperative - Ending date ("bl_123_sys_ther_pre_dend") or Systemic therapy - Postoperative - Ending date ("bl_123_sys_ther_post_dend") or Systemic therapy - Palliative - Ending date ("bl_123_sys_ther_pal_dend") or Radiotherapy - Ending date ("bl_1_radio_set_dend") or Isolated limb perfusion - Procedure date ("bl_123_limb_dproc") or Local ablative techniques - Procedure date ("bl_1_abla_dproc") or Date of surgery ("bl_1_surg_dsurg")',
		prec:null,
		precParams:null,
		func:dateCompareToFixedDateRepInstr,
		params:["lfu_date", "bl_1st_pathol_ddiag", 0, ">"],
		vars:["lfu_date", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_5_2',
		desc:'Date of follow-up ("lfu_date") must be subsequent to Previous Date of follow-up ("lfu_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithPreviousSelfRepInstr,
		params:["lfu_date", 0, ">"],
		vars:["lfu_date"]
	}
,
	{
		name:'dq_5_3',
		desc:'Weight at last visit ("lfu_weight") must be between 20 and 250',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["lfu_weight", 20, 250],
		vars:["lfu_weight"]
	}
,
	{
		name:'dq_5_4',
		desc:'Tumour-related weight loss % at the time of follow-up ("lfu_symptoms_tum_rel_weight_loss") must be between 1 and 100',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["lfu_symptoms_tum_rel_weight_loss", 1, 100],
		vars:["lfu_symptoms_tum_rel_weight_loss"]
	}
,
	{
		name:'dq_5_5',
		desc:'Hemoglobin value ("lfu_hemo") must be between 1 and 25',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["lfu_hemo", 1, 25],
		vars:["lfu_hemo"]
	}
,
	{
		name:'dq_5_6',
		desc:'Fibrinogen value ("lfu_fibrin") must be between 1 and 2000',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["lfu_fibrin", 1, 2000],
		vars:["lfu_fibrin"]
	}
,
	{
		name:'dq_5_7',
		desc:'GDF-15 value ("lfu_gdf15") must be between 100 and 25000',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["lfu_gdf15", 100, 25000],
		vars:["lfu_gdf15"]
	}
,
	{
		name:'dq_5_8',
		desc:'Gender female - Menopausal date ("lfu_menopausal_date") must be subsequent to date of birth ("bl_dob")',
		prec:varHasValue,
		precParams:["bl_gender", 2],
		func:uniqueDateCompareToFixedDateRepInstr,
		params:["lfu_menopausal_date", "bl_dob", 0, ">", 1],
		vars:["lfu_menopausal_date", "bl_dob"]
	}
,
		
	{
		name:'dq_5_10',
		desc:'Surveillance ongoing ("lfu_surveil_yn")=1 in current instance - Surveillance ongoing ("lfu_surveil_yn")=1 in previous instance',
		prec:null,
		precParams:null,
		func:varHasValueWithPreviousSelfRepInstr,
		params:["lfu_surveil_yn", 0, ">"],
		vars:["lfu_surveil_yn"]
	}
,
	{
		name:'dq_5_11',
		desc:'Systemic therapy ongoing ("lfu_syst_ther_yn")=1  in current instance - Systemic therapy ongoing ("lfu_syst_ther_yn")=1  in previous instance',
		prec:null,
		precParams:null,
		func:varHasValueWithPreviousSelfRepInstr,
		params:["lfu_syst_ther_yn", 0, ">"],
		vars:["lfu_syst_ther_yn"]
	}
,
	{
		name:'dq_5_12',
		desc:'Date of death ("lfu_dod") must be subsequent to Date of registration ("bl_dor")',
		prec:null,
		precParams:null,
		func:uniqueDateCompareToFixedDateRepInstr,
		params:["lfu_dod", "bl_dor", 0, ">", 1],
		vars:["lfu_dod", "bl_dor"]
	}
,
	{
		name:'dq_6_1',
		desc:'Date of progression ("lpr_date") must be subsequent to Previous Date of follow-up ("lfu_date")',
		prec:null,
		precParams:null,
		func:multiDateCompareFirstVsLastInstRepInstr,
		params:["lpr_date", "lfu_date"],
		vars:["lpr_date", "lfu_date"]
	}
,
	{
		name:'dq_6_2',
		desc:'Date of progression ("lpr_date") must be subsequent to Previous Date of Date of progression ("lpr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithPreviousSelfRepInstr,
		params:["lpr_date", 0, ">"],
		vars:["lpr_date"]
	}
,
	{
		name:'dq_6_3',
		desc:'Weight at progression ("lpr_weight") must be between 20 and 250',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["lpr_weight", 20, 250],
		vars:["lpr_weight"]
	}
,
	{
		name:'dq_6_4',
		desc:'Tumour-related weight loss % at the time of progression ("lpr_symptoms_tum_rel_weight_loss") must be between 1 and 100',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["lpr_symptoms_tum_rel_weight_loss", 1, 100],
		vars:["lpr_symptoms_tum_rel_weight_loss"]
	}
,
	{
		name:'dq_6_5',
		desc:'Hemoglobin value ("lpr_hemo") must be between 1 and 25',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["lpr_hemo", 1, 25],
		vars:["lpr_hemo"]
	}
,
	{
		name:'dq_6_6',
		desc:'Fibrinogen value ("lpr_fibrin") must be between 1 and 2000',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["lpr_fibrin", 1, 2000],
		vars:["lpr_fibrin"]
	}
,
	{
		name:'dq_6_7',
		desc:'GDF-15 value ("lpr_gdf15") must be between 100 and 25000',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["lpr_gdf15", 100, 25000],
		vars:["lpr_gdf15"]
	}
,
	{
		name:'dq_6_8',
		desc:'Gender female - Menopausal date ("lpr_menopausal_date") must be subsequent to date of birth ("bl_dob")',
		prec:varHasValue,
		precParams:["bl_gender", 2],
		func:uniqueDateCompareToFixedDateRepInstr,
		params:["lpr_menopausal_date", "bl_dob", 0, ">=", 1],
		vars:["bl_gender", "lpr_menopausal_date", "bl_dob"]
	}
,
	{
		name:'dq_6_9',
		desc:'Lung - Multiple lesions: number of lesions ("lpr_dis_ext_lung_les_spec") must be between 1 and 100',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["lpr_dis_ext_lung_les_spec", 1, 100],
		vars:["lpr_dis_ext_lung_les_spec"]
	}
,
	{
		name:'dq_6_10',
		desc:'Liver - Multiple lesions: number of lesions ("lpr_dis_ext_liv_les_spec") must be between 1 and 100',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["lpr_dis_ext_liv_les_spec", 1, 100],
		vars:["lpr_dis_ext_liv_les_spec"]
	}
,
	{
		name:'dq_6_11',
		desc:'Bone - Multiple lesions: number of lesions ("lpr_dis_ext_bone_les_spec") must be between 1 and 100',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["lpr_dis_ext_bone_les_spec", 1, 100],
		vars:["lpr_dis_ext_bone_les_spec"]
	}
,
	{
		name:'dq_6_12',
		desc:'Soft tissues (Limb) - Multiple lesions: number of lesions ("lpr_dis_ext_soft_les_limb_spec") must be between 1 and 100',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["lpr_dis_ext_soft_les_limb_spec", 1, 100],
		vars:["lpr_dis_ext_soft_les_limb_spec"]
	}
,
	{
		name:'dq_6_13',
		desc:'Soft tissues (Superficial trunk) - Multiple lesions: number of lesions ("lpr_dis_ext_soft_les_trunk_spec") must be between 1 and 100',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["lpr_dis_ext_soft_les_trunk_spec", 1, 100],
		vars:["lpr_dis_ext_soft_les_trunk_spec"]
	}
,
	{
		name:'dq_6_14',
		desc:'Soft tissues (Intra-abdominal) - Multiple lesions: number of lesions ("lpr_dis_ext_soft_les_abdo_spec") must be between 1 and 100',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["lpr_dis_ext_soft_les_abdo_spec", 1, 100],
		vars:["lpr_dis_ext_soft_les_abdo_spec"]
	}
,
	{
		name:'dq_6_15',
		desc:'Soft tissues (Intrathoracic) - Multiple lesions: number of lesions ("lpr_dis_ext_soft_les_thor_spec") must be between 1 and 100',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["lpr_dis_ext_soft_les_thor_spec", 1, 100],
		vars:["lpr_dis_ext_soft_les_thor_spec"]
	}
,
	{
		name:'dq_6_16',
		desc:'Soft tissues (Head & neck) - Multiple lesions: number of lesions ("lpr_dis_ext_soft_les_hn_spec") must be between 1 and 100',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["lpr_dis_ext_soft_les_hn_spec", 1, 100],
		vars:["lpr_dis_ext_soft_les_hn_spec"]
	}
,
	{
		name:'dq_6_18',
		desc:'Surveillance at last follow-up ("lpr_surveil_yn")=1 - Surveillance ongoing ("lfu_surveil_yn")=1',
		prec:null,
		precParams:null,
		func:multiVarHasValueFirstVsLastInstRepInstr,
		params:[["lpr_surveil_yn", 1], ["lfu_surveil_yn", 1]],
		vars:["lpr_surveil_yn", "lfu_surveil_yn"]
	}
,
	{
		name:'dq_6_19',
		desc:'Surveillance at last follow-up ("lpr_surveil_yn")=0 - Surveillance ongoing ("lfu_surveil_yn")=0',
		prec:null,
		precParams:null,
		func:multiVarHasValueFirstVsLastInstRepInstr,
		params:[["lpr_surveil_yn", 0], ["lfu_surveil_yn", 0]],
		vars:["lpr_surveil_yn", "lfu_surveil_yn"]
	}
,
	{
		name:'dq_6_20',
		desc:'Surveillance continue ("lpr_surveil_continue_yn")=1 - New medical therapy ("lpr_sys_ther_new_yn")=0 - Systemic therapy ("lpr_sys_ther_start_yn")=0 - Radiotherapy ("lpr_radio_yn")=0 - Surgery ("lpr_surg_yn")=0 - Isolated limb perfusion ("lpr_limbperf_yn")=0 - Local ablative techniques ("lpr_abla_yn")=0',
		prec:null,
		precParams:null,
		func:multiVarHasValueRepInstr,
		params:[["lpr_surveil_continue_yn", 1], ["lpr_sys_ther_new_yn", 0], ["lpr_sys_ther_start_yn", 0], ["lpr_radio_yn", 0], ["lpr_surg_yn", 0], ["lpr_limbperf_yn", 0], ["lpr_abla_yn", 0]],
		vars:["lpr_surveil_continue_yn", "lpr_sys_ther_new_yn", "lpr_sys_ther_start_yn", "lpr_radio_yn", "lpr_surg_yn", "lpr_limbperf_yn", "lpr_abla_yn"]
	}
,
	{
		name:'dq_6_21',
		desc:'Systhemic therapy at last follow-up ("lpr_sys_ther_yn")=1 - Systemic therapy ongoing ("lfu_syst_ther_yn")=1',
		prec:null,
		precParams:null,
		func:multiVarHasValueFirstVsLastInstRepInstr,
		params:[["lpr_sys_ther_yn", 1], ["lfu_syst_ther_yn", 1]],
		vars:["lpr_sys_ther_yn", "lfu_syst_ther_yn"]
	}
,
	{
		name:'dq_6_22',
		desc:'Systhemic therapy at last follow-up ("lpr_sys_ther_yn")=0 - Systemic therapy ongoing ("lfu_syst_ther_yn")=0',
		prec:null,
		precParams:null,
		func:multiVarHasValueFirstVsLastInstRepInstr,
		params:[["lpr_sys_ther_yn", 0], ["lfu_syst_ther_yn", 0]],
		vars:["lpr_sys_ther_yn", "lfu_syst_ther_yn"]
	}
,
	{
		name:'dq_6_23',
		desc:'Systhemic therapy continue ("lpr_sys_ther_continue_yn")=1 - Surveillance continue ("lpr_surveil_continue_yn")=0',
		prec:null,
		precParams:null,
		func:multiVarHasValueRepInstr,
		params:[["lpr_sys_ther_continue_yn", 1], ["lpr_surveil_continue_yn", 0]],
		vars:["lpr_sys_ther_continue_yn", "lpr_surveil_continue_yn"]
	}
,
	{
		name:'dq_6_24',
		desc:'New medical therapy - Starting date ("lpr_sys_ther_new_pre_start") must be subsequent to Date of local recurrence ("lpr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_pre_start", "lpr_date", 0, ">="],
		vars:["lpr_sys_ther_new_pre_start", "lpr_date"]
	}
,
	{
		name:'dq_6_24b',
		desc:'New medical therapy - Starting date ("lpr_sys_ther_new_post_start") must be subsequent to Date of local recurrence ("lpr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_post_start", "lpr_date", 0, ">="],
		vars:["lpr_sys_ther_new_post_start", "lpr_date"]
	}
,
	{
		name:'dq_6_24c',
		desc:'New medical therapy - Starting date ("lpr_sys_ther_new_pal_start") must be subsequent to Date of local recurrence ("lpr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_pal_start", "lpr_date", 0, ">="],
		vars:["lpr_sys_ther_new_pal_start", "lpr_date"]
	}
,
	{
		name:'dq_6_25',
		desc:'New medical therapy - Ending date ("lpr_sys_ther_new_pre_end") must be subsequent to New medical therapy - Starting date ("lpr_sys_ther_new_pre_start")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_pre_end", "lpr_sys_ther_new_pre_start", 0, ">="],
		vars:["lpr_sys_ther_new_pre_end", "lpr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_6_25b',
		desc:'New medical therapy - Ending date ("lpr_sys_ther_new_post_end") must be subsequent to New medical therapy - Starting date ("lpr_sys_ther_new_post_start")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_post_end", "lpr_sys_ther_new_post_start", 0, ">="],
		vars:["lpr_sys_ther_new_post_end", "lpr_sys_ther_new_post_start"]
	}
,
	{
		name:'dq_6_25c',
		desc:'New medical therapy - Ending date ("lpr_sys_ther_new_pal_end") must be subsequent to New medical therapy - Starting date ("lpr_sys_ther_new_pal_start")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_pal_end", "lpr_sys_ther_new_pal_start", 0, ">="],
		vars:["lpr_sys_ther_new_pal_end", "lpr_sys_ther_new_pal_start"]
	}
,
	{
		name:'dq_6_26',
		desc:'New medical therapy Setting Preoperative ("lpr_sys_ther_new_set")=1 - Date of surgery ("lpr_surg_date_lung") must be subsequent to New medical therapy - Ending date ("lpr_sys_ther_new_pre_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_lung", "lpr_sys_ther_new_pre_end", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_surg_date_lung", "lpr_sys_ther_new_pre_end"]
	}
,
	{
		name:'dq_6_26b',
		desc:'New medical therapy Setting Preoperative ("lpr_sys_ther_new_set")=1 - Date of surgery ("lpr_surg_date_liver") must be subsequent to New medical therapy - Ending date ("lpr_sys_ther_new_pre_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_liver", "lpr_sys_ther_new_pre_end", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_surg_date_liver", "lpr_sys_ther_new_pre_end"]
	}
,
	{
		name:'dq_6_26c',
		desc:'New medical therapy Setting Preoperative ("lpr_sys_ther_new_set")=1 - Date of surgery ("lpr_surg_date_bone") must be subsequent to New medical therapy - Ending date ("lpr_sys_ther_new_pre_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_bone", "lpr_sys_ther_new_pre_end", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_surg_date_bone", "lpr_sys_ther_new_pre_end"]
	}
,
	{
		name:'dq_6_26d',
		desc:'New medical therapy Setting Preoperative ("lpr_sys_ther_new_set")=1 - Date of surgery ("lpr_surg_date_soft") must be subsequent to New medical therapy - Ending date ("lpr_sys_ther_new_pre_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_soft", "lpr_sys_ther_new_pre_end", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_surg_date_soft", "lpr_sys_ther_new_pre_end"]
	}
,
	{
		name:'dq_6_26e',
		desc:'New medical therapy Setting Preoperative ("lpr_sys_ther_new_set")=1 - Date of surgery ("lpr_surg_date_lymph") must be subsequent to New medical therapy - Ending date ("lpr_sys_ther_new_pre_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_lymph", "lpr_sys_ther_new_pre_end", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_surg_date_lymph", "lpr_sys_ther_new_pre_end"]
	}
,
	{
		name:'dq_6_26f',
		desc:'New medical therapy Setting Preoperative ("lpr_sys_ther_new_set")=1 - Date of surgery ("lpr_surg_date_serosal") must be subsequent to New medical therapy - Ending date ("lpr_sys_ther_new_pre_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_serosal", "lpr_sys_ther_new_pre_end", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_surg_date_serosal", "lpr_sys_ther_new_pre_end"]
	}
,
	{
		name:'dq_6_26g',
		desc:'New medical therapy Setting Preoperative ("lpr_sys_ther_new_set")=1 - Date of surgery ("lpr_surg_date_oth") must be subsequent to New medical therapy - Ending date ("lpr_sys_ther_new_pre_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_oth", "lpr_sys_ther_new_pre_end", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_surg_date_oth", "lpr_sys_ther_new_pre_end"]
	}
,
	{
		name:'dq_6_27',
		desc:'New medical therapy Setting Postoperative ("lpr_sys_ther_new_set")=2 - New medical therapy - Starting date ("lpr_sys_ther_new_post_start") must be subsequent to Date of surgery ("lpr_surg_date_lung")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_post_start", "lpr_surg_date_lung", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_sys_ther_new_post_start", "lpr_surg_date_lung"]
	}
,
	{
		name:'dq_6_27b',
		desc:'New medical therapy Setting Postoperative ("lpr_sys_ther_new_set")=2 - New medical therapy - Starting date ("lpr_sys_ther_new_post_start") must be subsequent to Date of surgery ("lpr_surg_date_liver")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_post_start", "lpr_surg_date_liver", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_sys_ther_new_post_start", "lpr_surg_date_liver"]
	}
,
	{
		name:'dq_6_27c',
		desc:'New medical therapy Setting Postoperative ("lpr_sys_ther_new_set")=2 - New medical therapy - Starting date ("lpr_sys_ther_new_post_start") must be subsequent to Date of surgery ("lpr_surg_date_bone")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_post_start", "lpr_surg_date_bone", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_sys_ther_new_post_start", "lpr_surg_date_bone"]
	}
,
	{
		name:'dq_6_27d',
		desc:'New medical therapy Setting Postoperative ("lpr_sys_ther_new_set")=2 - New medical therapy - Starting date ("lpr_sys_ther_new_post_start") must be subsequent to Date of surgery ("lpr_surg_date_soft")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_post_start", "lpr_surg_date_soft", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_sys_ther_new_post_start", "lpr_surg_date_soft"]
	}
,
	{
		name:'dq_6_27e',
		desc:'New medical therapy Setting Postoperative ("lpr_sys_ther_new_set")=2 - New medical therapy - Starting date ("lpr_sys_ther_new_post_start") must be subsequent to Date of surgery ("lpr_surg_date_lymph")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_post_start", "lpr_surg_date_lymph", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_sys_ther_new_post_start", "lpr_surg_date_lymph"]
	}
,
	{
		name:'dq_6_27f',
		desc:'New medical therapy Setting Postoperative ("lpr_sys_ther_new_set")=2 - New medical therapy - Starting date ("lpr_sys_ther_new_post_start") must be subsequent to Date of surgery ("lpr_surg_date_serosal")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_post_start", "lpr_surg_date_serosal", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_sys_ther_new_post_start", "lpr_surg_date_serosal"]
	}
,
	{
		name:'dq_6_27g',
		desc:'New medical therapy Setting Postoperative ("lpr_sys_ther_new_set")=2 - New medical therapy - Starting date ("lpr_sys_ther_new_post_start") must be subsequent to Date of surgery ("lpr_surg_date_oth")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_post_start", "lpr_surg_date_oth", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_sys_ther_new_post_start", "lpr_surg_date_oth"]
	}
,
	{
		name:'dq_6_28',
		desc:'New medical therapy Setting Pre and Postoperative ("lpr_sys_ther_new_set")=3 - Date of surgery ("lpr_surg_date_lung") must be subsequent to New medical therapy - Preoperative - Starting date ("lpr_sys_ther_new_pre_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_lung", "lpr_sys_ther_new_pre_start", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_surg_date_lung", "lpr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_6_28b',
		desc:'New medical therapy Setting Pre and Postoperative ("lpr_sys_ther_new_set")=3 - Date of surgery ("lpr_surg_date_liver") must be subsequent to New medical therapy - Preoperative - Starting date ("lpr_sys_ther_new_pre_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_liver", "lpr_sys_ther_new_pre_start", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_surg_date_liver", "lpr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_6_28c',
		desc:'New medical therapy Setting Pre and Postoperative ("lpr_sys_ther_new_set")=3 - Date of surgery ("lpr_surg_date_bone") must be subsequent to New medical therapy - Preoperative - Starting date ("lpr_sys_ther_new_pre_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_bone", "lpr_sys_ther_new_pre_start", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_surg_date_bone", "lpr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_6_28d',
		desc:'New medical therapy Setting Pre and Postoperative ("lpr_sys_ther_new_set")=3 - Date of surgery ("lpr_surg_date_soft") must be subsequent to New medical therapy - Preoperative - Starting date ("lpr_sys_ther_new_pre_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_soft", "lpr_sys_ther_new_pre_start", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_surg_date_soft", "lpr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_6_28e',
		desc:'New medical therapy Setting Pre and Postoperative ("lpr_sys_ther_new_set")=3 - Date of surgery ("lpr_surg_date_lymph") must be subsequent to New medical therapy - Preoperative - Starting date ("lpr_sys_ther_new_pre_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_lymph", "lpr_sys_ther_new_pre_start", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_surg_date_lymph", "lpr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_6_28f',
		desc:'New medical therapy Setting Pre and Postoperative ("lpr_sys_ther_new_set")=3 - Date of surgery ("lpr_surg_date_serosal") must be subsequent to New medical therapy - Preoperative - Starting date ("lpr_sys_ther_new_pre_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_serosal", "lpr_sys_ther_new_pre_start", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_surg_date_serosal", "lpr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_6_28g',
		desc:'New medical therapy Setting Pre and Postoperative ("lpr_sys_ther_new_set")=3 - Date of surgery ("lpr_surg_date_oth") must be subsequent to New medical therapy - Preoperative - Starting date ("lpr_sys_ther_new_pre_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_oth", "lpr_sys_ther_new_pre_start", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_surg_date_oth", "lpr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_6_29',
		desc:'New medical therapy Setting Pre and Postoperative ("lpr_sys_ther_new_set")=3 - New medical therapy - Ending date ("lpr_sys_ther_new_post_end") must be subsequent to Date of surgery ("lpr_surg_date_lung")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_post_end", "lpr_surg_date_lung", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_sys_ther_new_post_end", "lpr_surg_date_lung"]
	}
,
	{
		name:'dq_6_29b',
		desc:'New medical therapy Setting Pre and Postoperative ("lpr_sys_ther_new_set")=3 - New medical therapy - Ending date ("lpr_sys_ther_new_post_end") must be subsequent to Date of surgery ("lpr_surg_date_liver")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_post_end", "lpr_surg_date_liver", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_sys_ther_new_post_end", "lpr_surg_date_liver"]
	}
,
	{
		name:'dq_6_29c',
		desc:'New medical therapy Setting Pre and Postoperative ("lpr_sys_ther_new_set")=3 - New medical therapy - Ending date ("lpr_sys_ther_new_post_end") must be subsequent to Date of surgery ("lpr_surg_date_bone")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_post_end", "lpr_surg_date_bone", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_sys_ther_new_post_end", "lpr_surg_date_bone"]
	}
,
	{
		name:'dq_6_29d',
		desc:'New medical therapy Setting Pre and Postoperative ("lpr_sys_ther_new_set")=3 - New medical therapy - Ending date ("lpr_sys_ther_new_post_end") must be subsequent to Date of surgery ("lpr_surg_date_soft")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_post_end", "lpr_surg_date_soft", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_sys_ther_new_post_end", "lpr_surg_date_soft"]
	}
,
	{
		name:'dq_6_29e',
		desc:'New medical therapy Setting Pre and Postoperative ("lpr_sys_ther_new_set")=3 - New medical therapy - Ending date ("lpr_sys_ther_new_post_end") must be subsequent to Date of surgery ("lpr_surg_date_lymph")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_post_end", "lpr_surg_date_lymph", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_sys_ther_new_post_end", "lpr_surg_date_lymph"]
	}
,
	{
		name:'dq_6_29f',
		desc:'New medical therapy Setting Pre and Postoperative ("lpr_sys_ther_new_set")=3 - New medical therapy - Ending date ("lpr_sys_ther_new_post_end") must be subsequent to Date of surgery ("lpr_surg_date_serosal")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_post_end", "lpr_surg_date_serosal", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_sys_ther_new_post_end", "lpr_surg_date_serosal"]
	}
,
	{
		name:'dq_6_29g',
		desc:'New medical therapy Setting Pre and Postoperative ("lpr_sys_ther_new_set")=3 - New medical therapy - Ending date ("lpr_sys_ther_new_post_end") must be subsequent to Date of surgery ("lpr_surg_date_oth")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_post_end", "lpr_surg_date_oth", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_sys_ther_new_post_end", "lpr_surg_date_oth"]
	}
,
	{
		name:'dq_6_30',
		desc:'New medical therapy Setting Palliative ("lpr_sys_ther_new_set")=4 - New medical therapy - Starting date ("lpr_sys_ther_new_pal_start") must be subsequent to Date of progression ("lpr_date") ',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_pal_start", "lpr_date", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_sys_ther_new_pal_start", "lpr_date"]
	}
,
	{
		name:'dq_6_31',
		desc:'New medical therapy Setting Palliative ("lpr_sys_ther_new_set")=4 - New medical therapy - Ending date ("lpr_sys_ther_new_pal_end") must be subsequent to New medical therapy - Starting date ("lpr_sys_ther_new_pal_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_pal_end", "lpr_sys_ther_new_pal_start", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_sys_ther_new_pal_end", "lpr_sys_ther_new_pal_start"]
	}
,
	{
		name:'dq_6_32',
		desc:'Systemic therapy - Starting date ("lpr_sys_ther_new_pre_start") must be subsequent to Date of progression ("lpr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_pre_start", "lpr_date", 0, ">"],
		vars:["lpr_sys_ther_new_pre_start", "lpr_date"]
	}
,
	{
		name:'dq_6_32b',
		desc:'Systemic therapy - Starting date ("lpr_sys_ther_new_post_start") must be subsequent to Date of progression ("lpr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_post_start", "lpr_date", 0, ">"],
		vars:["lpr_sys_ther_new_post_start", "lpr_date"]
	}
,
	{
		name:'dq_6_32c',
		desc:'Systemic therapy - Starting date ("lpr_sys_ther_new_pal_start") must be subsequent to Date of progression ("lpr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_pal_start", "lpr_date", 0, ">"],
		vars:["lpr_sys_ther_new_pal_start", "lpr_date"]
	}
,
	{
		name:'dq_6_33',
		desc:'Systemic therapy - Ending date ("lpr_sys_ther_new_pre_end") must be subsequent to Systemic therapy - Starting date ("lpr_sys_ther_new_pre_start")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_pre_end", "lpr_sys_ther_new_pre_start", 0, ">"],
		vars:["lpr_sys_ther_new_pre_end", "lpr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_6_33b',
		desc:'Systemic therapy - Ending date ("lpr_sys_ther_new_post_end") must be subsequent to Systemic therapy - Starting date ("lpr_sys_ther_new_post_start")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_post_end", "lpr_sys_ther_new_post_start", 0, ">"],
		vars:["lpr_sys_ther_new_post_end", "lpr_sys_ther_new_post_start"]
	}
,
	{
		name:'dq_6_33c',
		desc:'Systemic therapy - Ending date ("lpr_sys_ther_new_pal_end") must be subsequent to Systemic therapy - Starting date ("lpr_sys_ther_new_pal_start")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_pal_end", "lpr_sys_ther_new_pal_start", 0, ">"],
		vars:["lpr_sys_ther_new_pal_end", "lpr_sys_ther_new_pal_start"]
	}
,
	{
		name:'dq_6_34',
		desc:'Systemic therapy Setting Preoperative ("lpr_sys_ther_new_set")=1 - Date of surgery ("lpr_surg_date_lung") must be subsequent to Systemic therapy -  Ending date ("lpr_sys_ther_new_pre_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_lung", "lpr_sys_ther_new_pre_end", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_surg_date_lung", "lpr_sys_ther_new_pre_end"]
	}
,
	{
		name:'dq_6_34b',
		desc:'Systemic therapy Setting Preoperative ("lpr_sys_ther_new_set")=1 - Date of surgery ("lpr_surg_date_liver") must be subsequent to Systemic therapy -  Ending date ("lpr_sys_ther_new_pre_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_liver", "lpr_sys_ther_new_pre_end", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_surg_date_liver", "lpr_sys_ther_new_pre_end"]
	}
,
	{
		name:'dq_6_34c',
		desc:'Systemic therapy Setting Preoperative ("lpr_sys_ther_new_set")=1 - Date of surgery ("lpr_surg_date_bone") must be subsequent to Systemic therapy -  Ending date ("lpr_sys_ther_new_pre_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_bone", "lpr_sys_ther_new_pre_end", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_surg_date_bone", "lpr_sys_ther_new_pre_end"]
	}
,
	{
		name:'dq_6_34d',
		desc:'Systemic therapy Setting Preoperative ("lpr_sys_ther_new_set")=1 - Date of surgery ("lpr_surg_date_soft") must be subsequent to Systemic therapy -  Ending date ("lpr_sys_ther_new_pre_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_soft", "lpr_sys_ther_new_pre_end", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_surg_date_soft", "lpr_sys_ther_new_pre_end"]
	}
,
	{
		name:'dq_6_34e',
		desc:'Systemic therapy Setting Preoperative ("lpr_sys_ther_new_set")=1 - Date of surgery ("lpr_surg_date_lymph") must be subsequent to Systemic therapy -  Ending date ("lpr_sys_ther_new_pre_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_lymph", "lpr_sys_ther_new_pre_end", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_surg_date_lymph", "lpr_sys_ther_new_pre_end"]
	}
,
	{
		name:'dq_6_34f',
		desc:'Systemic therapy Setting Preoperative ("lpr_sys_ther_new_set")=1 - Date of surgery ("lpr_surg_date_serosal") must be subsequent to Systemic therapy -  Ending date ("lpr_sys_ther_new_pre_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_serosal", "lpr_sys_ther_new_pre_end", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_surg_date_serosal", "lpr_sys_ther_new_pre_end"]
	}
,
	{
		name:'dq_6_34g',
		desc:'Systemic therapy Setting Preoperative ("lpr_sys_ther_new_set")=1 - Date of surgery ("lpr_surg_date_oth") must be subsequent to Systemic therapy -  Ending date ("lpr_sys_ther_new_pre_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_oth", "lpr_sys_ther_new_pre_end", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_surg_date_oth", "lpr_sys_ther_new_pre_end"]
	}
,
	{
		name:'dq_6_35',
		desc:'Systemic therapy Setting Postoperative ("lpr_sys_ther_new_set")=2 - Systemic therapy - Starting date ("lpr_sys_ther_new_post_start") must be subsequent to Date of surgery ("lpr_surg_date_lung")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_post_start", "lpr_surg_date_lung", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_sys_ther_new_post_start", "lpr_surg_date_lung"]
	}
,
	{
		name:'dq_6_35b',
		desc:'Systemic therapy Setting Postoperative ("lpr_sys_ther_new_set")=2 - Systemic therapy - Starting date ("lpr_sys_ther_new_post_start") must be subsequent to Date of surgery ("lpr_surg_date_liver")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_post_start", "lpr_surg_date_liver", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_sys_ther_new_post_start", "lpr_surg_date_liver"]
	}
,
	{
		name:'dq_6_35c',
		desc:'Systemic therapy Setting Postoperative ("lpr_sys_ther_new_set")=2 - Systemic therapy - Starting date ("lpr_sys_ther_new_post_start") must be subsequent to Date of surgery ("lpr_surg_date_bone")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_post_start", "lpr_surg_date_bone", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_sys_ther_new_post_start", "lpr_surg_date_bone"]
	}
,
	{
		name:'dq_6_35d',
		desc:'Systemic therapy Setting Postoperative ("lpr_sys_ther_new_set")=2 - Systemic therapy - Starting date ("lpr_sys_ther_new_post_start") must be subsequent to Date of surgery ("lpr_surg_date_soft")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_post_start", "lpr_surg_date_soft", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_sys_ther_new_post_start", "lpr_surg_date_soft"]
	}
,
	{
		name:'dq_6_35e',
		desc:'Systemic therapy Setting Postoperative ("lpr_sys_ther_new_set")=2 - Systemic therapy - Starting date ("lpr_sys_ther_new_post_start") must be subsequent to Date of surgery ("lpr_surg_date_lymph")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_post_start", "lpr_surg_date_lymph", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_sys_ther_new_post_start", "lpr_surg_date_lymph"]
	}
,
	{
		name:'dq_6_35f',
		desc:'Systemic therapy Setting Postoperative ("lpr_sys_ther_new_set")=2 - Systemic therapy - Starting date ("lpr_sys_ther_new_post_start") must be subsequent to Date of surgery ("lpr_surg_date_serosal")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_post_start", "lpr_surg_date_serosal", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_sys_ther_new_post_start", "lpr_surg_date_serosal"]
	}
,
	{
		name:'dq_6_35g',
		desc:'Systemic therapy Setting Postoperative ("lpr_sys_ther_new_set")=2 - Systemic therapy - Starting date ("lpr_sys_ther_new_post_start") must be subsequent to Date of surgery ("lpr_surg_date_oth")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_post_start", "lpr_surg_date_oth", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_sys_ther_new_post_start", "lpr_surg_date_oth"]
	}
,
	{
		name:'dq_6_36',
		desc:'Systemic therapy Setting Pre and Postoperative ("lpr_sys_ther_new_set")=3 - Date of surgery ("lpr_surg_date_lung") must be subsequent to Systemic therapy - Starting date ("lpr_sys_ther_new_pre_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_lung", "lpr_sys_ther_new_pre_start", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_surg_date_lung", "lpr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_6_36b',
		desc:'Systemic therapy Setting Pre and Postoperative ("lpr_sys_ther_new_set")=3 - Date of surgery ("lpr_surg_date_liver") must be subsequent to Systemic therapy - Starting date ("lpr_sys_ther_new_pre_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_liver", "lpr_sys_ther_new_pre_start", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_surg_date_liver", "lpr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_6_36c',
		desc:'Systemic therapy Setting Pre and Postoperative ("lpr_sys_ther_new_set")=3 - Date of surgery ("lpr_surg_date_bone") must be subsequent to Systemic therapy - Starting date ("lpr_sys_ther_new_pre_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_bone", "lpr_sys_ther_new_pre_start", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_surg_date_bone", "lpr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_6_36d',
		desc:'Systemic therapy Setting Pre and Postoperative ("lpr_sys_ther_new_set")=3 - Date of surgery ("lpr_surg_date_soft") must be subsequent to Systemic therapy - Starting date ("lpr_sys_ther_new_pre_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_soft", "lpr_sys_ther_new_pre_start", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_surg_date_soft", "lpr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_6_36e',
		desc:'Systemic therapy Setting Pre and Postoperative ("lpr_sys_ther_new_set")=3 - Date of surgery ("lpr_surg_date_lymph") must be subsequent to Systemic therapy - Starting date ("lpr_sys_ther_new_pre_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_lymph", "lpr_sys_ther_new_pre_start", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_surg_date_lymph", "lpr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_6_36f',
		desc:'Systemic therapy Setting Pre and Postoperative ("lpr_sys_ther_new_set")=3 - Date of surgery ("lpr_surg_date_serosal") must be subsequent to Systemic therapy - Starting date ("lpr_sys_ther_new_pre_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_serosal", "lpr_sys_ther_new_pre_start", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_surg_date_serosal", "lpr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_6_36g',
		desc:'Systemic therapy Setting Pre and Postoperative ("lpr_sys_ther_new_set")=3 - Date of surgery ("lpr_surg_date_oth") must be subsequent to Systemic therapy - Starting date ("lpr_sys_ther_new_pre_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_oth", "lpr_sys_ther_new_pre_start", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_surg_date_oth", "lpr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_6_37',
		desc:'Systemic therapy Setting Pre and Postoperative ("lpr_sys_ther_new_set")=3 -  Systemic therapy -  Ending date ("lpr_sys_ther_new_post_end") must be subsequent to Date of surgery ("lpr_surg_date_lung")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_post_end", "lpr_surg_date_lung", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_sys_ther_new_post_end", "lpr_surg_date_lung"]
	}
,
	{
		name:'dq_6_37b',
		desc:'Systemic therapy Setting Pre and Postoperative ("lpr_sys_ther_new_set")=3 -  Systemic therapy -  Ending date ("lpr_sys_ther_new_post_end") must be subsequent to Date of surgery ("lpr_surg_date_liver")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_post_end", "lpr_surg_date_liver", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_sys_ther_new_post_end", "lpr_surg_date_liver"]
	}
,
	{
		name:'dq_6_37c',
		desc:'Systemic therapy Setting Pre and Postoperative ("lpr_sys_ther_new_set")=3 -  Systemic therapy -  Ending date ("lpr_sys_ther_new_post_end") must be subsequent to Date of surgery ("lpr_surg_date_bone")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_post_end", "lpr_surg_date_bone", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_sys_ther_new_post_end", "lpr_surg_date_bone"]
	}
,
	{
		name:'dq_6_37d',
		desc:'Systemic therapy Setting Pre and Postoperative ("lpr_sys_ther_new_set")=3 -  Systemic therapy -  Ending date ("lpr_sys_ther_new_post_end") must be subsequent to Date of surgery ("lpr_surg_date_soft")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_post_end", "lpr_surg_date_soft", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_sys_ther_new_post_end", "lpr_surg_date_soft"]
	}
,
	{
		name:'dq_6_37e',
		desc:'Systemic therapy Setting Pre and Postoperative ("lpr_sys_ther_new_set")=3 -  Systemic therapy -  Ending date ("lpr_sys_ther_new_post_end") must be subsequent to Date of surgery ("lpr_surg_date_lymph")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_post_end", "lpr_surg_date_lymph", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_sys_ther_new_post_end", "lpr_surg_date_lymph"]
	}
,
	{
		name:'dq_6_37f',
		desc:'Systemic therapy Setting Pre and Postoperative ("lpr_sys_ther_new_set")=3 -  Systemic therapy -  Ending date ("lpr_sys_ther_new_post_end") must be subsequent to Date of surgery ("lpr_surg_date_serosal")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_post_end", "lpr_surg_date_serosal", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_sys_ther_new_post_end", "lpr_surg_date_serosal"]
	}
,
	{
		name:'dq_6_37g',
		desc:'Systemic therapy Setting Pre and Postoperative ("lpr_sys_ther_new_set")=3 -  Systemic therapy -  Ending date ("lpr_sys_ther_new_post_end") must be subsequent to Date of surgery ("lpr_surg_date_oth")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_post_end", "lpr_surg_date_oth", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_sys_ther_new_post_end", "lpr_surg_date_oth"]
	}
,
	{
		name:'dq_6_38',
		desc:'Systemic therapy Setting Palliative ("lpr_sys_ther_new_set")=4 - Systemic therapy - Starting date ("lpr_sys_ther_new_pal_start") must be subsequent to Date of progression ("lpr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_pal_start", "lpr_date", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_sys_ther_new_pal_start", "lpr_date"]
	}
,
	{
		name:'dq_6_39',
		desc:'Systemic therapy Setting Palliative ("lpr_sys_ther_new_set")=4 - Systemic therapy -  Ending date ("lpr_sys_ther_new_pal_end") must be subsequent to Systemic therapy - Starting date ("lpr_sys_ther_new_pal_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_sys_ther_new_set", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_sys_ther_new_pal_end", "lpr_sys_ther_new_pal_start", 0, ">"],
		vars:["lpr_sys_ther_new_set", "lpr_sys_ther_new_pal_end", "lpr_sys_ther_new_pal_start"]
	}
,
	{
		name:'dq_6_49',
		desc:'Lung - Radiotherapy - Starting date ("lpr_radio_lung_start") must be subsequent to Date of progression ("lpr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_lung_start", "lpr_date", 0, ">"],
		vars:["lpr_radio_lung_start", "lpr_date"]
	}
,
	{
		name:'dq_6_50',
		desc:'Lung - Radiotherapy - Ending date ("lpr_radio_lung_end") must be subsequent to Lung - Radiotherapy - Starting date ("lpr_radio_lung_start")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_lung_end", "lpr_radio_lung_start", 0, ">"],
		vars:["lpr_radio_lung_end", "lpr_radio_lung_start"]
	}
,
	{
		name:'dq_6_51',
		desc:'Lung - Radiotherapy Setting Preoperative ("lpr_lung_radio_set")=1 - Lung - Date of surgery ("lpr_surg_date_lung") must be subsequent to Lung - Radiotherapy - Ending date ("lpr_radio_lung_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_lung_radio_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_lung", "lpr_radio_lung_end", 0, ">"],
		vars:["lpr_lung_radio_set", "lpr_surg_date_lung", "lpr_radio_lung_end"]
	}
,
	{
		name:'dq_6_52',
		desc:'Lung - Radiotherapy Setting Postoperative ("lpr_lung_radio_set")=2 - Lung - Radiotherapy - Starting date ("lpr_radio_lung_start") must be subsequent to Lung - Date of surgery ("lpr_surg_date_lung")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_lung_radio_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_lung_start", "lpr_surg_date_lung", 0, ">"],
		vars:["lpr_lung_radio_set", "lpr_radio_lung_start", "lpr_surg_date_lung"]
	}
,
	{
		name:'dq_6_53',
		desc:'Lung - Radiotherapy Setting Palliative ("lpr_lung_radio_set")=3 - Lung - Radiotherapy - Starting date ("lpr_radio_lung_start") must be subsequent to Date of progression ("lpr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_lung_radio_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_lung_start", "lpr_date", 0, ">"],
		vars:["lpr_lung_radio_set", "lpr_radio_lung_start", "lpr_date"]
	}
,
	{
		name:'dq_6_54',
		desc:'Lung - Radiotherapy Setting Definitive ("lpr_lung_radio_set")=4 - Lung - Radiotherapy - Starting date ("lpr_radio_lung_start") must be subsequent to Date of progression ("lpr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_lung_radio_set", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_lung_start", "lpr_date", 0, ">"],
		vars:["lpr_lung_radio_set", "lpr_radio_lung_start", "lpr_date"]
	}
,
	{
		name:'dq_6_55',
		desc:'Lung - Radiotherapy Setting Definitive ("lpr_lung_radio_set")=4  - Radiotherapy ("lpr_radio_yn")=1 - Surgery ("lpr_surg_yn")=0',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_lung_radio_set", 4]]],
		func:multiVarHasValueRepInstr,
		params:[["lpr_radio_yn", 1], ["lpr_surg_yn", 0]],
		vars:["lpr_lung_radio_set", "lpr_radio_yn", "lpr_surg_yn"]
	}
,
	{
		name:'dq_6_56',
		desc:'Liver - Radiotherapy - Starting date ("lpr_radio_liver_start") must be subsequent to Date of progression ("lpr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_liver_start", "lpr_date", 0, ">"],
		vars:["lpr_radio_liver_start", "lpr_date"]
	}
,
	{
		name:'dq_6_57',
		desc:'Liver - Radiotherapy - Ending date ("lpr_radio_liver_end") must be subsequent to Liver - Radiotherapy - Starting date ("lpr_radio_liver_start")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_liver_end", "lpr_radio_liver_start", 0, ">"],
		vars:["lpr_radio_liver_end", "lpr_radio_liver_start"]
	}
,
	{
		name:'dq_6_58',
		desc:'Liver - Radiotherapy Setting Preoperative ("lpr_radio_liver_set")=1 - Liver - Date of surgery ("lpr_surg_date_liver") must be subsequent to Liver - Radiotherapy - Ending date ("lpr_radio_liver_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_radio_liver_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_liver", "lpr_radio_liver_end", 0, ">"],
		vars:["lpr_radio_liver_set", "lpr_surg_date_liver", "lpr_radio_liver_end"]
	}
,
	{
		name:'dq_6_59',
		desc:'Liver - Radiotherapy Setting Postoperative ("lpr_radio_liver_set")=2 - Liver - Radiotherapy - Starting date ("lpr_radio_liver_start") must be subsequent to Liver - Date of surgery ("lpr_surg_date_liver")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_radio_liver_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_liver_start", "lpr_surg_date_liver", 0, ">"],
		vars:["lpr_radio_liver_set", "lpr_radio_liver_start", "lpr_surg_date_liver"]
	}
,
	{
		name:'dq_6_60',
		desc:'Liver - Radiotherapy Setting Palliative ("lpr_radio_liver_set")=3 - Liver - Radiotherapy - Starting date ("lpr_radio_liver_start") must be subsequent to Date of progression ("lpr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_radio_liver_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_liver_start", "lpr_date", 0, ">"],
		vars:["lpr_radio_liver_set", "lpr_radio_liver_start", "lpr_date"]
	}
,
	{
		name:'dq_6_61',
		desc:'Liver - Radiotherapy Setting Definitive ("lpr_radio_liver_set")=4 - Liver - Radiotherapy - Starting date ("lpr_radio_liver_start") must be subsequent to Date of progression ("lpr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_radio_liver_set", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_liver_start", "lpr_date", 0, ">"],
		vars:["lpr_radio_liver_set", "lpr_radio_liver_start", "lpr_date"]
	}
,
	{
		name:'dq_6_62',
		desc:'Liver - Radiotherapy Setting Definitive ("lpr_radio_liver_set")=4 - Radiotherapy ("lpr_radio_yn")=1 - Surgery ("lpr_surg_yn")=0',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_radio_liver_set", 4]]],
		func:multiVarHasValueRepInstr,
		params:[["lpr_radio_yn", 1], ["lpr_surg_yn", 0]],
		vars:["lpr_radio_liver_set"]
	}
,
	{
		name:'dq_6_63',
		desc:'Bone - Radiotherapy - Starting date ("lpr_radio_bone_start") must be subsequent to Date of progression ("lpr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_bone_start", "lpr_date", 0, ">"],
		vars:["lpr_radio_bone_start", "lpr_date"]
	}
,
	{
		name:'dq_6_64',
		desc:'Bone - Radiotherapy - Ending date ("lpr_radio_bone_end") must be subsequent to Bone - Radiotherapy - Starting date ("lpr_radio_bone_start")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_bone_end", "lpr_radio_bone_start", 0, ">"],
		vars:["lpr_radio_bone_end", "lpr_radio_bone_start"]
	}
,
	{
		name:'dq_6_65',
		desc:'Bone - Radiotherapy Setting Preoperative ("lpr_radio_bone_set")=1 - Bone - Date of surgery ("lpr_surg_date_bone") must be subsequent to Bone - Radiotherapy - Ending date ("lpr_radio_bone_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_radio_bone_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_bone", "lpr_radio_bone_end", 0, ">"],
		vars:["lpr_radio_bone_set", "lpr_surg_date_bone", "lpr_radio_bone_end"]
	}
,
	{
		name:'dq_6_66',
		desc:'Bone - Radiotherapy Setting Postoperative ("lpr_radio_bone_set")=2 - Bone - Radiotherapy - Starting date ("lpr_radio_bone_start") must be subsequent to Bone - Date of surgery ("lpr_surg_date_bone")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_radio_bone_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_bone_start", "lpr_surg_date_bone", 0, ">"],
		vars:["lpr_radio_bone_set", "lpr_radio_bone_start", "lpr_surg_date_bone"]
	}
,
	{
		name:'dq_6_67',
		desc:'Bone - Radiotherapy Setting Palliative ("lpr_radio_bone_set")=3 - Bone - Radiotherapy - Starting date ("lpr_radio_bone_start") must be subsequent to Date of progression ("lpr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_radio_bone_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_bone_start", "lpr_date", 0, ">"],
		vars:["lpr_radio_bone_set", "lpr_radio_bone_start", "lpr_date"]
	}
,
	{
		name:'dq_6_68',
		desc:'Bone - Radiotherapy Setting Definitive ("lpr_radio_bone_set")=4 - Bone - Radiotherapy - Starting date ("lpr_radio_bone_start") must be subsequent to Date of progression ("lpr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_radio_bone_set", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_bone_start", "lpr_date", 0, ">"],
		vars:["lpr_radio_bone_set", "lpr_radio_bone_start", "lpr_date"]
	}
,
	{
		name:'dq_6_69',
		desc:'Bone - Radiotherapy Setting Definitive ("lpr_radio_bone_set")=4 - Radiotherapy ("lpr_radio_yn")=1 - Surgery ("lpr_surg_yn")=0',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_radio_bone_set", 4]]],
		func:multiVarHasValueRepInstr,
		params:[["lpr_radio_yn", 1], ["lpr_surg_yn", 0]],
		vars:["lpr_radio_bone_set"]
	}
,
	{
		name:'dq_6_70',
		desc:'Soft tissues - Radiotherapy - Starting date ("lpr_radio_soft_start") must be subsequent to Date of progression ("lpr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_soft_start", "lpr_date", 0, ">"],
		vars:["lpr_radio_soft_start", "lpr_date"]
	}
,
	{
		name:'dq_6_71',
		desc:'Soft tissues - Radiotherapy - Ending date ("lpr_radio_soft_end") must be subsequent to Soft tissues - Radiotherapy - Starting date ("lpr_radio_soft_start")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_soft_end", "lpr_radio_soft_start", 0, ">"],
		vars:["lpr_radio_soft_end", "lpr_radio_soft_start"]
	}
,
	{
		name:'dq_6_72',
		desc:'Soft tissues - Radiotherapy Setting Preoperative ("lpr_radio_soft_set")=1 - Soft tissues - Date of surgery ("lpr_surg_date_soft") must be subsequent to Soft tissues - Radiotherapy - Ending date ("lpr_radio_soft_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_radio_soft_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_soft", "lpr_radio_soft_end", 0, ">"],
		vars:["lpr_radio_soft_set", "lpr_surg_date_soft", "lpr_radio_soft_end"]
	}
,
	{
		name:'dq_6_73',
		desc:'Soft tissues - Radiotherapy Setting Postoperative ("lpr_radio_soft_set")=2 - Soft tissues - Radiotherapy - Starting date ("lpr_radio_soft_start") must be subsequent to Soft tissues - Date of surgery ("lpr_surg_date_soft")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_radio_soft_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_soft_start", "lpr_surg_date_soft", 0, ">"],
		vars:["lpr_radio_soft_set", "lpr_radio_soft_start", "lpr_surg_date_soft"]
	}
,
	{
		name:'dq_6_74',
		desc:'Soft tissues - Radiotherapy Setting Palliative ("lpr_radio_soft_set")=3 - Soft tissues - Radiotherapy - Starting date ("lpr_radio_soft_start") must be subsequent to Date of progression ("lpr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_radio_soft_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_soft_start", "lpr_date", 0, ">"],
		vars:["lpr_radio_soft_set", "lpr_radio_soft_start", "lpr_date"]
	}
,
	{
		name:'dq_6_75',
		desc:'Soft tissues - Radiotherapy Setting Definitive ("lpr_radio_soft_set")=4 - Soft tissues - Radiotherapy - Starting date ("lpr_radio_soft_start") must be subsequent to Date of progression ("lpr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_radio_soft_set", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_soft_start", "lpr_date", 0, ">"],
		vars:["lpr_radio_soft_set", "lpr_radio_soft_start", "lpr_date"]
	}
,
	{
		name:'dq_6_76',
		desc:'Soft tissues - Radiotherapy Setting Definitive ("lpr_radio_soft_set")=4 - Radiotherapy ("lpr_radio_yn")=1 - Surgery ("lpr_surg_yn")=0',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_radio_soft_set", 4]]],
		func:multiVarHasValueRepInstr,
		params:[["lpr_radio_yn", 1], ["lpr_surg_yn", 0]],
		vars:["lpr_radio_soft_set"]
	}
,
	{
		name:'dq_6_77',
		desc:'Lymph nodes - Radiotherapy - Starting date ("lpr_radio_lymph_start") must be subsequent to Date of progression ("lpr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_lymph_start", "lpr_date", 0, ">"],
		vars:["lpr_radio_lymph_start", "lpr_date"]
	}
,
	{
		name:'dq_6_78',
		desc:'Lymph nodes - Radiotherapy - Ending date ("lpr_radio_lymph_end") must be subsequent to Lymph nodes - Radiotherapy - Starting date ("lpr_radio_lymph_start")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_lymph_end", "lpr_radio_lymph_start", 0, ">"],
		vars:["lpr_radio_lymph_end", "lpr_radio_lymph_start"]
	}
,
	{
		name:'dq_6_79',
		desc:'Lymph nodes - Radiotherapy Setting Preoperative ("lpr_radio_lymph_set")=1 - Lymph nodes - Date of surgery ("lpr_surg_date_lymph") must be subsequent to Lymph nodes - Radiotherapy - Ending date ("lpr_radio_lymph_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_radio_lymph_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_lymph", "lpr_radio_lymph_end", 0, ">"],
		vars:["lpr_radio_lymph_set", "lpr_surg_date_lymph", "lpr_radio_lymph_end"]
	}
,
	{
		name:'dq_6_80',
		desc:'Lymph nodes - Radiotherapy Setting Postoperative ("lpr_radio_lymph_set")=2 - Lymph nodes - Radiotherapy - Starting date ("lpr_radio_lymph_start") must be subsequent to Lymph nodes - Date of surgery ("lpr_surg_date_lymph")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_radio_lymph_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_lymph_start", "lpr_surg_date_lymph", 0, ">"],
		vars:["lpr_radio_lymph_set", "lpr_radio_lymph_start", "lpr_surg_date_lymph"]
	}
,
	{
		name:'dq_6_81',
		desc:'Lymph nodes - Radiotherapy Setting Palliative ("lpr_radio_lymph_set")=3 - Lymph nodes - Radiotherapy - Starting date ("lpr_radio_lymph_start") must be subsequent to Date of progression ("lpr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_radio_lymph_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_lymph_start", "lpr_date", 0, ">"],
		vars:["lpr_radio_lymph_set", "lpr_radio_lymph_start", "lpr_date"]
	}
,
	{
		name:'dq_6_82',
		desc:'Lymph nodes - Radiotherapy Setting Definitive ("lpr_radio_lymph_set")=4 - Lymph nodes - Radiotherapy - Starting date ("lpr_radio_lymph_start") must be subsequent to Date of progression ("lpr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_radio_lymph_set", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_lymph_start", "lpr_date", 0, ">"],
		vars:["lpr_radio_lymph_set", "lpr_radio_lymph_start", "lpr_date"]
	}
,
	{
		name:'dq_6_83',
		desc:'Lymph nodes - Radiotherapy Setting Definitive ("lpr_radio_lymph_set")=4 - Radiotherapy ("lpr_radio_yn")=1 - Surgery ("lpr_surg_yn")=0',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_radio_lymph_set", 4]]],
		func:multiVarHasValueRepInstr,
		params:[["lpr_radio_yn", 1], ["lpr_surg_yn", 0]],
		vars:["lpr_radio_lymph_set"]
	}
,
	{
		name:'dq_6_84',
		desc:'Serosal - Radiotherapy - Starting date ("lpr_radio_sero_start") must be subsequent to Date of progression ("lpr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_sero_start", "lpr_date", 0, ">"],
		vars:["lpr_radio_sero_start", "lpr_date"]
	}
,
	{
		name:'dq_6_85',
		desc:'Serosal - Radiotherapy - Ending date ("lpr_radio_sero_end") must be subsequent to Serosal - Radiotherapy - Starting date ("lpr_radio_sero_start")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_sero_end", "lpr_radio_sero_start", 0, ">"],
		vars:["lpr_radio_sero_end", "lpr_radio_sero_start"]
	}
,
	{
		name:'dq_6_86',
		desc:'Serosal - Radiotherapy Setting Preoperative ("lpr_radio_sero_set")=1 - Serosal - Date of surgery ("lpr_surg_date_sero") must be subsequent to Serosal - Radiotherapy - Ending date ("lpr_radio_sero_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_radio_sero_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_serosal", "lpr_radio_sero_end", 0, ">"],
		vars:["lpr_radio_sero_set", "lpr_surg_date_serosal", "lpr_radio_sero_end"]
	}
,
	{
		name:'dq_6_87',
		desc:'Serosal - Radiotherapy Setting Postoperative ("lpr_radio_sero_set")=2 - Serosal - Radiotherapy - Starting date ("lpr_radio_sero_start") must be subsequent to Serosal - Date of surgery ("lpr_surg_date_sero")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_radio_sero_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_sero_start", "lpr_surg_date_sero", 0, ">"],
		vars:["lpr_radio_sero_set", "lpr_radio_sero_start", "lpr_surg_date_sero"]
	}
,
	{
		name:'dq_6_88',
		desc:'Serosal - Radiotherapy Setting Palliative ("lpr_radio_sero_set")=3 - Serosal - Radiotherapy - Starting date ("lpr_radio_sero_start") must be subsequent to Date of progression ("lpr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_radio_sero_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_sero_start", "lpr_date", 0, ">"],
		vars:["lpr_radio_sero_set", "lpr_radio_sero_start", "lpr_date"]
	}
,
	{
		name:'dq_6_89',
		desc:'Serosal - Radiotherapy Setting Definitive ("lpr_radio_sero_set")=4 - Serosal - Radiotherapy - Starting date ("lpr_radio_sero_start") must be subsequent to Date of progression ("lpr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_radio_sero_set", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_sero_start", "lpr_date", 0, ">"],
		vars:["lpr_radio_sero_set", "lpr_radio_sero_start", "lpr_date"]
	}
,
	{
		name:'dq_6_90',
		desc:'Serosal - Radiotherapy Setting Definitive ("lpr_radio_sero_set")=4 - Radiotherapy ("lpr_radio_yn")=1 - Surgery ("lpr_surg_yn")=0',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_radio_sero_set", 4]]],
		func:multiVarHasValueRepInstr,
		params:[["lpr_radio_yn", 1], ["lpr_surg_yn", 0]],
		vars:["lpr_radio_sero_set"]
	}
,
	{
		name:'dq_6_91',
		desc:'Other - Radiotherapy - Starting date ("lpr_radio_oth_start") must be subsequent to Date of progression ("lpr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_oth_start", "lpr_date", 0, ">"],
		vars:["lpr_radio_oth_start", "lpr_date"]
	}
,
	{
		name:'dq_6_92',
		desc:'Other - Radiotherapy - Ending date ("lpr_radio_oth_end") must be subsequent to Other - Radiotherapy - Starting date ("lpr_radio_oth_start")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_oth_end", "lpr_radio_oth_start", 0, ">"],
		vars:["lpr_radio_oth_end", "lpr_radio_oth_start"]
	}
,
	{
		name:'dq_6_93',
		desc:'Other - Radiotherapy Setting Preoperative ("lpr_radio_oth_set")=1 - Other - Date of surgery ("lpr_surg_date_oth") must be subsequent to Other - Radiotherapy - Ending date ("lpr_radio_oth_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_radio_oth_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_oth", "lpr_radio_oth_end", 0, ">"],
		vars:["lpr_radio_oth_set", "lpr_surg_date_oth", "lpr_radio_oth_end"]
	}
,
	{
		name:'dq_6_94',
		desc:'Other - Radiotherapy Setting Postoperative ("lpr_radio_oth_set")=2 - Other - Radiotherapy - Starting date ("lpr_radio_oth_start") must be subsequent to Other - Date of surgery ("lpr_surg_date_oth")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_radio_oth_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_oth_start", "lpr_surg_date_oth", 0, ">"],
		vars:["lpr_radio_oth_set", "lpr_radio_oth_start", "lpr_surg_date_oth"]
	}
,
	{
		name:'dq_6_95',
		desc:'Other - Radiotherapy Setting Palliative ("lpr_radio_oth_set")=3 - Other - Radiotherapy - Starting date ("lpr_radio_oth_start") must be subsequent to Date of progression ("lpr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_radio_oth_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_oth_start", "lpr_date", 0, ">"],
		vars:["lpr_radio_oth_set", "lpr_radio_oth_start", "lpr_date"]
	}
,
	{
		name:'dq_6_96',
		desc:'Other - Radiotherapy Setting Definitive ("lpr_radio_oth_set")=4 - Other - Radiotherapy - Starting date ("lpr_radio_oth_start") must be subsequent to Date of progression ("lpr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_radio_oth_set", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_radio_oth_start", "lpr_date", 0, ">"],
		vars:["lpr_radio_oth_set", "lpr_radio_oth_start", "lpr_date"]
	}
,
	{
		name:'dq_6_97',
		desc:'Other - Radiotherapy Setting Definitive ("lpr_radio_oth_set")=4 - Radiotherapy ("lpr_radio_yn")=1 - Surgery ("lpr_surg_yn")=0',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_radio_oth_set", 4]]],
		func:multiVarHasValueRepInstr,
		params:[["lpr_radio_yn", 1], ["lpr_surg_yn", 0]],
		vars:["lpr_radio_oth_set"]
	}
,
	{
		name:'dq_6_98',
		desc:'Isolated limb perfusion - Procedure date ("lpr_limbperf_date") must be subsequent to Date of progression ("lpr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_limbperf_date", "lpr_date", 0, ">"],
		vars:["lpr_limbperf_date", "lpr_date"]
	}
,
	{	
		name: 'dq_6_99',
		desc: 'Isolated limb perfusion Setting Preoperative ("lpr_limbperf_set")=1 - Date of surgery ("lpr_surg_date_lung") must be subsequent to Isolated limb perfusion - Procedure date ("lpr_limbperf_date")',
		prec: multiVarHasValueRepInstr,
		precParams: [[["lpr_limbperf_set", 1]]],
		func: dateCompareWithDeltaRepInstr,
		params: ["lpr_surg_date_lung", "lpr_limbperf_date", 0, ">"],
		vars: ["lpr_limbperf_set", "lpr_surg_date_lung", "lpr_limbperf_date"]
	}	
	,	
	{	
		name: 'dq_6_99b',
		desc: 'Isolated limb perfusion Setting Preoperative ("lpr_limbperf_set")=1 - Date of surgery ("lpr_surg_date_liver") must be subsequent to Isolated limb perfusion - Procedure date ("lpr_limbperf_date")',
		prec: multiVarHasValueRepInstr,
		precParams: [[["lpr_limbperf_set", 1]]],
		func: dateCompareWithDeltaRepInstr,
		params: ["lpr_surg_date_liver", "lpr_limbperf_date", 0, ">"],
		vars: ["lpr_limbperf_set", "lpr_surg_date_liver", "lpr_limbperf_date"]
	}	
	,	
	{	
		name: 'dq_6_99c',
		desc: 'Isolated limb perfusion Setting Preoperative ("lpr_limbperf_set")=1 - Date of surgery ("lpr_surg_date_bone") must be subsequent to Isolated limb perfusion - Procedure date ("lpr_limbperf_date")',
		prec: multiVarHasValueRepInstr,
		precParams: [[["lpr_limbperf_set", 1]]],
		func: dateCompareWithDeltaRepInstr,
		params: ["lpr_surg_date_bone", "lpr_limbperf_date", 0, ">"],
		vars: ["lpr_limbperf_set", "lpr_surg_date_bone", "lpr_limbperf_date"]
	}	
	,	
	{	
		name: 'dq_6_99d',
		desc: 'Isolated limb perfusion Setting Preoperative ("lpr_limbperf_set")=1 - Date of surgery ("lpr_surg_date_soft") must be subsequent to Isolated limb perfusion - Procedure date ("lpr_limbperf_date")',
		prec: multiVarHasValueRepInstr,
		precParams: [[["lpr_limbperf_set", 1]]],
		func: dateCompareWithDeltaRepInstr,
		params: ["lpr_surg_date_soft", "lpr_limbperf_date", 0, ">"],
		vars: ["lpr_limbperf_set", "lpr_surg_date_soft", "lpr_limbperf_date"]
	}	
	,	
	{	
		name: 'dq_6_99e',
		desc: 'Isolated limb perfusion Setting Preoperative ("lpr_limbperf_set")=1 - Date of surgery ("lpr_surg_date_lymph") must be subsequent to Isolated limb perfusion - Procedure date ("lpr_limbperf_date")',
		prec: multiVarHasValueRepInstr,
		precParams: [[["lpr_limbperf_set", 1]]],
		func: dateCompareWithDeltaRepInstr,
		params: ["lpr_surg_date_lymph", "lpr_limbperf_date", 0, ">"],
		vars: ["lpr_limbperf_set", "lpr_surg_date_lymph", "lpr_limbperf_date"]
	}	
	,	
	{	
		name: 'dq_6_99f',
		desc: 'Isolated limb perfusion Setting Preoperative ("lpr_limbperf_set")=1 - Date of surgery ("lpr_surg_date_serosal") must be subsequent to Isolated limb perfusion - Procedure date ("lpr_limbperf_date")',
		prec: multiVarHasValueRepInstr,
		precParams: [[["lpr_limbperf_set", 1]]],
		func: dateCompareWithDeltaRepInstr,
		params: ["lpr_surg_date_serosal", "lpr_limbperf_date", 0, ">"],
		vars: ["lpr_limbperf_set", "lpr_surg_date_serosal", "lpr_limbperf_date"]
	}	
	,	
	{	
		name: 'dq_6_99g',
		desc: 'Isolated limb perfusion Setting Preoperative ("lpr_limbperf_set")=1 - Date of surgery ("lpr_surg_date_oth") must be subsequent to Isolated limb perfusion - Procedure date ("lpr_limbperf_date")',
		prec: multiVarHasValueRepInstr,
		precParams: [[["lpr_limbperf_set", 1]]],
		func: dateCompareWithDeltaRepInstr,
		params: ["lpr_surg_date_oth", "lpr_limbperf_date", 0, ">"],
		vars: ["lpr_limbperf_set", "lpr_surg_date_oth", "lpr_limbperf_date"]
	}	
	,
	{
		name:'dq_6_100',
		desc:'Isolated limb perfusion Setting Definitive ("lpr_limbperf_set")=4 - Procedure date ("lpr_limbperf_date") must be subsequent to Date of progression ("lpr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_limbperf_set", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_limbperf_date", "lpr_date", 0, ">"],
		vars:["lpr_limbperf_set", "lpr_limbperf_date", "lpr_date"]
	}
,
	{
		name:'dq_6_101',
		desc:'Local ablative techniques Setting Preoperative ("lpr_abla_set_lung") - Date of surgery ("lpr_surg_date_lung") must be subsequent to Local ablative techniques - Procedure date ("lpr_abla_date_lung")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_lung", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_lung", "lpr_abla_date_lung", 0, ">"],
		vars:["lpr_abla_set_lung", "lpr_surg_date_lung", "lpr_abla_date_lung"]
	}
,
	{
		name:'dq_6_101b',
		desc:'Local ablative techniques Setting Preoperative ("lpr_abla_set_liver") - Date of surgery ("lpr_surg_date_liver") must be subsequent to Local ablative techniques - Procedure date ("lpr_abla_date_liver")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_liver", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_liver", "lpr_abla_date_liver", 0, ">"],
		vars:["lpr_abla_set_liver", "lpr_surg_date_liver", "lpr_abla_date_liver"]
	}
,
	{
		name:'dq_6_101c',
		desc:'Local ablative techniques Setting Preoperative ("lpr_abla_set_bone") - Date of surgery ("lpr_surg_date_bone") must be subsequent to Local ablative techniques - Procedure date ("lpr_abla_date_bone")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_bone", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_bone", "lpr_abla_date_bone", 0, ">"],
		vars:["lpr_abla_set_bone", "lpr_surg_date_bone", "lpr_abla_date_bone"]
	}
,
	{
		name:'dq_6_101d',
		desc:'Local ablative techniques Setting Preoperative ("lpr_abla_set_soft") - Date of surgery ("lpr_surg_date_soft") must be subsequent to Local ablative techniques - Procedure date ("lpr_abla_date_soft")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_soft", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_soft", "lpr_abla_date_soft", 0, ">"],
		vars:["lpr_abla_set_soft", "lpr_surg_date_soft", "lpr_abla_date_soft"]
	}
,
	{
		name:'dq_6_101e',
		desc:'Local ablative techniques Setting Preoperative ("lpr_abla_set_serosal") - Date of surgery ("lpr_surg_date_serosal") must be subsequent to Local ablative techniques - Procedure date ("lpr_abla_date_serosal")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_serosal", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_serosal", "lpr_abla_date_serosal", 0, ">"],
		vars:["lpr_abla_set_serosal", "lpr_surg_date_serosal", "lpr_abla_date_serosal"]
	}
,
	{
		name:'dq_6_101f',
		desc:'Local ablative techniques Setting Preoperative ("lpr_abla_set_lymph") - Date of surgery ("lpr_surg_date_lymph") must be subsequent to Local ablative techniques - Procedure date ("lpr_abla_date_lymph")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_lymph", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_lymph", "lpr_abla_date_lymph", 0, ">"],
		vars:["lpr_abla_set_lymph", "lpr_surg_date_lymph", "lpr_abla_date_lymph"]
	}
,
	{
		name:'dq_6_101g',
		desc:'Local ablative techniques Setting Preoperative ("lpr_abla_set_oth") - Date of surgery ("lpr_surg_date_oth") must be subsequent to Local ablative techniques - Procedure date ("lpr_abla_date_oth")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_oth", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_oth", "lpr_abla_date_oth", 0, ">"],
		vars:["lpr_abla_set_oth", "lpr_surg_date_oth", "lpr_abla_date_oth"]
	}
,
	{
		name:'dq_6_102',
		desc:'Local ablative techniques Setting Definitive ("lpr_abla_set_lung") - Local ablative techniques - Procedure date ("lpr_abla_date_lung") must be subsequent to Date of progression ("lpr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_lung", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_abla_date_lung", "lpr_date", 0, ">"],
		vars:["lpr_abla_set_lung", "lpr_abla_date_lung", "lpr_date"]
	}
,
	{
		name:'dq_6_102b',
		desc:'Local ablative techniques Setting Definitive ("lpr_abla_set_liver") - Local ablative techniques - Procedure date ("lpr_abla_date_liver") must be subsequent to Date of progression ("lpr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_liver", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_abla_date_liver", "lpr_date", 0, ">"],
		vars:["lpr_abla_set_liver", "lpr_abla_date_liver", "lpr_date"]
	}
,
	{
		name:'dq_6_102c',
		desc:'Local ablative techniques Setting Definitive ("lpr_abla_set_bone") - Local ablative techniques - Procedure date ("lpr_abla_date_bone") must be subsequent to Date of progression ("lpr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_bone", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_abla_date_bone", "lpr_date", 0, ">"],
		vars:["lpr_abla_set_bone", "lpr_abla_date_bone", "lpr_date"]
	}
,
	{
		name:'dq_6_102d',
		desc:'Local ablative techniques Setting Definitive ("lpr_abla_set_soft") - Local ablative techniques - Procedure date ("lpr_abla_date_soft") must be subsequent to Date of progression ("lpr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_soft", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_abla_date_soft", "lpr_date", 0, ">"],
		vars:["lpr_abla_set_soft", "lpr_abla_date_soft", "lpr_date"]
	}
,
	{
		name:'dq_6_102e',
		desc:'Local ablative techniques Setting Definitive ("lpr_abla_set_serosal") - Local ablative techniques - Procedure date ("lpr_abla_date_serosal") must be subsequent to Date of progression ("lpr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_serosal", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_abla_date_serosal", "lpr_date", 0, ">"],
		vars:["lpr_abla_set_serosal", "lpr_abla_date_serosal", "lpr_date"]
	}
,
	{
		name:'dq_6_102f',
		desc:'Local ablative techniques Setting Definitive ("lpr_abla_set_lymph") - Local ablative techniques - Procedure date ("lpr_abla_date_lymph") must be subsequent to Date of progression ("lpr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_lymph", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_abla_date_lymph", "lpr_date", 0, ">"],
		vars:["lpr_abla_set_lymph", "lpr_abla_date_lymph", "lpr_date"]
	}
,
	{
		name:'dq_6_102g',
		desc:'Local ablative techniques Setting Definitive ("lpr_abla_set_oth") - Local ablative techniques - Procedure date ("lpr_abla_date_oth") must be subsequent to Date of progression ("lpr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_oth", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_abla_date_oth", "lpr_date", 0, ">"],
		vars:["lpr_abla_set_oth", "lpr_abla_date_oth", "lpr_date"]
	}
,
	{
		name:'dq_6_103',
		desc:'Local ablative techniques Setting Definitive ("lpr_abla_set_lung") - Local ablative techniques ("lpr_abla_yn")=1 - Surgery ("lpr_surg_yn")=0',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_lung", 4]]],
		func:multiVarHasValueRepInstr,
		params:[["lpr_abla_yn", 1], ["lpr_surg_yn", 0]],
		vars:["lpr_abla_set_lung"]
	}
,
	{
		name:'dq_6_103b',
		desc:'Local ablative techniques Setting Definitive ("lpr_abla_set_liver") - Local ablative techniques ("lpr_abla_yn")=1 - Surgery ("lpr_surg_yn")=0',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_liver", 4]]],
		func:multiVarHasValueRepInstr,
		params:[["lpr_abla_yn", 1], ["lpr_surg_yn", 0]],
		vars:["lpr_abla_set_liver"]
	}
,
	{
		name:'dq_6_103c',
		desc:'Local ablative techniques Setting Definitive ("lpr_abla_set_bone") - Local ablative techniques ("lpr_abla_yn")=1 - Surgery ("lpr_surg_yn")=0',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_bone", 4]]],
		func:multiVarHasValueRepInstr,
		params:[["lpr_abla_yn", 1], ["lpr_surg_yn", 0]],
		vars:["lpr_abla_set_bone"]
	}
,
	{
		name:'dq_6_103d',
		desc:'Local ablative techniques Setting Definitive ("lpr_abla_set_soft") - Local ablative techniques ("lpr_abla_yn")=1 - Surgery ("lpr_surg_yn")=0',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_soft", 4]]],
		func:multiVarHasValueRepInstr,
		params:[["lpr_abla_yn", 1], ["lpr_surg_yn", 0]],
		vars:["lpr_abla_set_soft"]
	}
,
	{
		name:'dq_6_103e',
		desc:'Local ablative techniques Setting Definitive ("lpr_abla_set_serosal") - Local ablative techniques ("lpr_abla_yn")=1 - Surgery ("lpr_surg_yn")=0',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_serosal", 4]]],
		func:multiVarHasValueRepInstr,
		params:[["lpr_abla_yn", 1], ["lpr_surg_yn", 0]],
		vars:["lpr_abla_set_serosal"]
	}
,
	{
		name:'dq_6_103f',
		desc:'Local ablative techniques Setting Definitive ("lpr_abla_set_lymph") - Local ablative techniques ("lpr_abla_yn")=1 - Surgery ("lpr_surg_yn")=0',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_lymph", 4]]],
		func:multiVarHasValueRepInstr,
		params:[["lpr_abla_yn", 1], ["lpr_surg_yn", 0]],
		vars:["lpr_abla_set_lymph"]
	}
,
	{
		name:'dq_6_103g',
		desc:'Local ablative techniques Setting Definitive ("lpr_abla_set_oth") - Local ablative techniques ("lpr_abla_yn")=1 - Surgery ("lpr_surg_yn")=0',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_oth", 4]]],
		func:multiVarHasValueRepInstr,
		params:[["lpr_abla_yn", 1], ["lpr_surg_yn", 0]],
		vars:["lpr_abla_set_oth"]
	}
,
	{
		name:'dq_6_104',
		desc:'Lung - Local ablative techniques - Procedure date ("lpr_abla_date_lung") must be subsequent to Date of progression ("lpr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_abla_date_lung", "lpr_date", 0, ">"],
		vars:["lpr_abla_date_lung", "lpr_date"]
	}
,
	{
		name:'dq_6_105',
		desc:'Lung - Local ablative techniques Setting Preoperative ("lpr_abla_set_lung")=1 - Lung - Date of surgery ("lpr_surg_date_lung") must be subsequent to Lung - Local ablative techniques - Procedure date ("lpr_abla_date_lung")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_lung", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_lung", "lpr_abla_date_lung", 0, ">"],
		vars:["lpr_abla_set_lung", "lpr_surg_date_lung", "lpr_abla_date_lung"]
	}
,
	{
		name:'dq_6_106',
		desc:'Lung - Local ablative techniques - Setting Definitive ("lpr_abla_set_lung")=4 - Lung - Local ablative techniques - Procedure date ("lpr_abla_date_lung") must be subsequent to Date of progression ("lpr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_lung", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_abla_date_lung", "lpr_date", 0, ">"],
		vars:["lpr_abla_set_lung", "lpr_abla_date_lung", "lpr_date"]
	}
,
	{
		name:'dq_6_107',
		desc:'Liver - Local ablative techniques - Procedure date ("lpr_abla_date_liver") must be subsequent to Date of progression ("lpr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_abla_date_liver", "lpr_date", 0, ">"],
		vars:["lpr_abla_date_liver", "lpr_date"]
	}
,
	{
		name:'dq_6_108',
		desc:'Liver - Local ablative techniques Setting Preoperative ("lpr_abla_set_liver")=1 - Liver - Date of surgery ("lpr_surg_date_liver") must be subsequent to Liver - Local ablative techniques - Procedure date ("lpr_abla_date_liver")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_liver", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_liver", "lpr_abla_date_liver", 0, ">"],
		vars:["lpr_abla_set_liver", "lpr_surg_date_liver", "lpr_abla_date_liver"]
	}
,
	{
		name:'dq_6_109',
		desc:'Liver - Local ablative techniques - Setting Definitive ("lpr_abla_set_liver")=4 - Liver - Local ablative techniques - Procedure date ("lpr_abla_date_liver") must be subsequent to Date of progression ("lpr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_liver", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_abla_date_liver", "lpr_date", 0, ">"],
		vars:["lpr_abla_set_liver", "lpr_abla_date_liver", "lpr_date"]
	}
,
	{
		name:'dq_6_110',
		desc:'Bone - Local ablative techniques - Procedure date ("lpr_abla_date_bone") must be subsequent to Date of progression ("lpr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_abla_date_bone", "lpr_date", 0, ">"],
		vars:["lpr_abla_date_bone", "lpr_date"]
	}
,
	{
		name:'dq_6_111',
		desc:'Bone - Local ablative techniques Setting Preoperative ("lpr_abla_set_bone")=1 - Bone - Date of surgery ("lpr_surg_date_bone") must be subsequent to Bone - Local ablative techniques - Procedure date ("lpr_abla_date_bone")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_bone", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_bone", "lpr_abla_date_bone", 0, ">"],
		vars:["lpr_abla_set_bone", "lpr_surg_date_bone", "lpr_abla_date_bone"]
	}
,
	{
		name:'dq_6_112',
		desc:'Bone - Local ablative techniques - Setting Definitive ("lpr_abla_set_bone")=4 - Bone - Local ablative techniques - Procedure date ("lpr_abla_date_bone") must be subsequent to Date of progression ("lpr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_bone", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_abla_date_bone", "lpr_date", 0, ">"],
		vars:["lpr_abla_set_bone", "lpr_abla_date_bone", "lpr_date"]
	}
,
	{
		name:'dq_6_113',
		desc:'Soft - Local ablative techniques - Procedure date ("lpr_abla_date_soft") must be subsequent to Date of progression ("lpr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_abla_date_soft", "lpr_date", 0, ">"],
		vars:["lpr_abla_date_soft", "lpr_date"]
	}
,
	{
		name:'dq_6_114',
		desc:'Soft - Local ablative techniques Setting Preoperative ("lpr_abla_set_soft")=1 - Soft - Date of surgery ("lpr_surg_date_soft") must be subsequent to Soft - Local ablative techniques - Procedure date ("lpr_abla_date_soft")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_soft", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_soft", "lpr_abla_date_soft", 0, ">"],
		vars:["lpr_abla_set_soft", "lpr_surg_date_soft", "lpr_abla_date_soft"]
	}
,
	{
		name:'dq_6_115',
		desc:'Soft - Local ablative techniques - Setting Definitive ("lpr_abla_set_soft")=4 - Soft - Local ablative techniques - Procedure date ("lpr_abla_date_soft") must be subsequent to Date of progression ("lpr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_soft", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_abla_date_soft", "lpr_date", 0, ">"],
		vars:["lpr_abla_set_soft", "lpr_abla_date_soft", "lpr_date"]
	}
,
	{
		name:'dq_6_116',
		desc:'Lymph - Local ablative techniques - Procedure date ("lpr_abla_date_lymph") must be subsequent to Date of progression ("lpr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_abla_date_lymph", "lpr_date", 0, ">"],
		vars:["lpr_abla_date_lymph", "lpr_date"]
	}
,
	{
		name:'dq_6_117',
		desc:'Lymph - Local ablative techniques Setting Preoperative ("lpr_abla_set_lymph")=1 - Lymph - Date of surgery ("lpr_surg_date_lymph") must be subsequent to Lymph - Local ablative techniques - Procedure date ("lpr_abla_date_lymph")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_lymph", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_lymph", "lpr_abla_date_lymph", 0, ">"],
		vars:["lpr_abla_set_lymph", "lpr_surg_date_lymph", "lpr_abla_date_lymph"]
	}
,
	{
		name:'dq_6_118',
		desc:'Lymph - Local ablative techniques - Setting Definitive ("lpr_abla_set_lymph")=4 - Lymph - Local ablative techniques - Procedure date ("lpr_abla_date_lymph") must be subsequent to Date of progression ("lpr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_lymph", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_abla_date_lymph", "lpr_date", 0, ">"],
		vars:["lpr_abla_set_lymph", "lpr_abla_date_lymph", "lpr_date"]
	}
,
	{
		name:'dq_6_119',
		desc:'Serosal - Local ablative techniques - Procedure date ("lpr_abla_date_serosal") must be subsequent to Date of progression ("lpr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_abla_date_serosal", "lpr_date", 0, ">"],
		vars:["lpr_abla_date_serosal", "lpr_date"]
	}
,
	{
		name:'dq_6_120',
		desc:'Serosal - Local ablative techniques Setting Preoperative ("lpr_abla_set_serosal")=1 - Serosal - Date of surgery ("lpr_surg_date_serosal") must be subsequent to Serosal - Local ablative techniques - Procedure date ("lpr_abla_date_serosal")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_serosal", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_serosal", "lpr_abla_date_serosal", 0, ">"],
		vars:["lpr_abla_set_serosal", "lpr_surg_date_serosal", "lpr_abla_date_serosal"]
	}
,
	{
		name:'dq_6_121',
		desc:'Serosal - Local ablative techniques - Setting Definitive ("lpr_abla_set_serosal")=4 - Serosal - Local ablative techniques - Procedure date ("lpr_abla_date_serosal") must be subsequent to Date of progression ("lpr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_serosal", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_abla_date_serosal", "lpr_date", 0, ">"],
		vars:["lpr_abla_set_serosal", "lpr_abla_date_serosal", "lpr_date"]
	}
,
	{
		name:'dq_6_122',
		desc:'Other - Local ablative techniques - Procedure date ("lpr_abla_date_oth") must be subsequent to Date of progression ("lpr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_abla_date_oth", "lpr_date", 0, ">"],
		vars:["lpr_abla_date_oth", "lpr_date"]
	}
,
	{
		name:'dq_6_123',
		desc:'Other - Local ablative techniques Setting Preoperative ("lpr_abla_set_oth")=1 - Other - Date of surgery ("lpr_surg_date_oth") must be subsequent to Other - Local ablative techniques - Procedure date ("lpr_abla_date_oth")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_oth", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_oth", "lpr_abla_date_oth", 0, ">"],
		vars:["lpr_abla_set_oth", "lpr_surg_date_oth", "lpr_abla_date_oth"]
	}
,
	{
		name:'dq_6_124',
		desc:'Other - Local ablative techniques - Setting Definitive ("lpr_abla_set_oth")=4 - Other - Local ablative techniques - Procedure date ("lpr_abla_date_oth") must be subsequent to Date of progression ("lpr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["lpr_abla_set_oth", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_abla_date_oth", "lpr_date", 0, ">"],
		vars:["lpr_abla_set_oth", "lpr_abla_date_oth", "lpr_date"]
	}
,
	{
		name:'dq_6_125',
		desc:'Lung - Date of surgery ("lpr_surg_date_lung") must be subsequent to Date of progression ("lpr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_lung", "lpr_date", 0, ">"],
		vars:["lpr_surg_date_lung", "lpr_date"]
	}
,
	{
		name:'dq_6_126',
		desc:'Liver - Date of surgery ("lpr_surg_date_liver") must be subsequent to Date of progression ("lpr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_liver", "lpr_date", 0, ">"],
		vars:["lpr_surg_date_liver", "lpr_date"]
	}
,
	{
		name:'dq_6_127',
		desc:'Bone - Date of surgery ("lpr_surg_date_bone") must be subsequent to Date of progression ("lpr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_bone", "lpr_date", 0, ">"],
		vars:["lpr_surg_date_bone", "lpr_date"]
	}
,
	{
		name:'dq_6_128',
		desc:'Soft tissues - Date of surgery ("lpr_surg_date_soft") must be subsequent to Date of progression ("lpr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_soft", "lpr_date", 0, ">"],
		vars:["lpr_surg_date_soft", "lpr_date"]
	}
,
	{
		name:'dq_6_129',
		desc:'Lymph nodes - Date of surgery ("lpr_surg_date_lymph") must be subsequent to Date of progression ("lpr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_lymph", "lpr_date", 0, ">"],
		vars:["lpr_surg_date_lymph", "lpr_date"]
	}
,
	{
		name:'dq_6_130',
		desc:'Serosal - Date of surgery ("lpr_surg_date_serosal") must be subsequent to Date of progression ("lpr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_serosal", "lpr_date", 0, ">"],
		vars:["lpr_surg_date_serosal", "lpr_date"]
	}
,
	{
		name:'dq_6_131',
		desc:'Other - Date of surgery ("lpr_surg_date_oth") must be subsequent to Date of progression ("lpr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_surg_date_oth", "lpr_date", 0, ">"],
		vars:["lpr_surg_date_oth", "lpr_date"]
	}
,
	{
		name:'dq_6_132',
		desc:'Lung - Size of pathological specimen ("lpr_surg_specsize_lung") must be between 1 and 300',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["lpr_surg_specsize_lung", 1, 300],
		vars:["lpr_surg_specsize_lung"]
	}
,
	{
		name:'dq_6_133',
		desc:'Liver - Size of pathological specimen ("lpr_surg_specsize_liver") must be between 1 and 300',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["lpr_surg_specsize_liver", 1, 300],
		vars:["lpr_surg_specsize_liver"]
	}
,
	{
		name:'dq_6_134',
		desc:'Bone - Size of pathological specimen ("lpr_surg_specsize_bone") must be between 1 and 300',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["lpr_surg_specsize_bone", 1, 300],
		vars:["lpr_surg_specsize_bone"]
	}
,
	{
		name:'dq_6_135',
		desc:'Soft tissues - Size of pathological specimen ("lpr_surg_specsize_soft") must be between 1 and 300',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["lpr_surg_specsize_soft", 1, 300],
		vars:["lpr_surg_specsize_soft"]
	}
,
	{
		name:'dq_6_136',
		desc:'Lymph nodes - Size of pathological specimen ("lpr_surg_specsize_lymph") must be between 1 and 300',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["lpr_surg_specsize_lymph", 1, 300],
		vars:["lpr_surg_specsize_lymph"]
	}
,
	{
		name:'dq_6_137',
		desc:'Serosal - Size of pathological specimen ("lpr_surg_specsize_serosal") must be between 1 and 300',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["lpr_surg_specsize_serosal", 1, 300],
		vars:["lpr_surg_specsize_serosal"]
	}
,
	{
		name:'dq_6_138',
		desc:'Liver - Size of pathological specimen ("lpr_surg_specsize_oth") must be between 1 and 300',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["lpr_surg_specsize_oth", 1, 300],
		vars:["lpr_surg_specsize_oth"]
	}
,
	{
		name:'dq_6_139',
		desc:'Date of local progressive site pathological diagnosis ("lpr_pathol_date") must be subsequent to Date of progression ("lpr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["lpr_pathol_date", "lpr_date", 0, ">"],
		vars:["lpr_pathol_date", "lpr_date"]
	}
,
	{
		name:'dq_6_140',
		desc:'Mitotic index value ("lpr_pathol_prog_mito") must be between 1 and 99',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["lpr_pathol_prog_mito", 1, 99],
		vars:["lpr_pathol_prog_mito"]
	}
,
	{
		name:'dq_6_141',
		desc:'Date of death ("lpr_dod") must be subsequent to Date of registration ("bl_dor")',
		prec:null,
		precParams:null,
		func:uniqueDateCompareToFixedDateRepInstr,
		params:["lpr_dod", "bl_dor", 0, ">=", 1],
		vars:["lpr_dod", "bl_dor"]
	}
,
	{
		name:'dq_7_1',
		desc:'Date of follow-up ("sfu_date") must be subsequent to Date of diagnosis ("bl_1st_pathol_ddiag")',
		prec:null,
		precParams:null,
		func:dateCompareToFixedDateRepInstr,
		params:["sfu_date", "bl_1st_pathol_ddiag", 0, ">", 1],
		vars:["sfu_date", "bl_1st_pathol_ddiag"]
	}
,
	{
		name:'dq_7_2',
		desc:'Date of follow-up ("sfu_date") must be subsequent to Previous Date of follow-up ("sfu_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithPreviousSelfRepInstr,
		params:["sfu_date", 0, ">"],
		vars:["sfu_date"]
	}
,
	{
		name:'dq_7_3',
		desc:'Weight at last visit ("sfu_weight") must be between 20 and 250',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["sfu_weight", 20, 250],
		vars:["sfu_weight"]
	}
,
	{
		name:'dq_7_4',
		desc:'Tumour-related weight loss % at the time of follow-up ("sfu_symptoms_tum_rel_weight_loss") must be between 1 and 100',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["sfu_symptoms_tum_rel_weight_loss", 1, 100],
		vars:["sfu_symptoms_tum_rel_weight_loss"]
	}
,
	{
		name:'dq_7_5',
		desc:'Hemoglobin value ("sfu_hemo") must be between 1 and 25',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["sfu_hemo", 1, 25],
		vars:["sfu_hemo"]
	}
,
	{
		name:'dq_7_6',
		desc:'Fibrinogen value ("sfu_fibrin") must be between 1 and 2000',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["sfu_fibrin", 1, 2000],
		vars:["sfu_fibrin"]
	}
,
	{
		name:'dq_7_7',
		desc:'GDF-15 value ("sfu_gdf15") must be between 100 and 25000',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["sfu_gdf15", 100, 25000],
		vars:["sfu_gdf15"]
	}
,
	{
		name:'dq_7_8',
		desc:'Gender female - Menopausal date ("sfu_menopausal_date") must be subsequent to date of birth ("bl_dob")',
		prec:varHasValue,
		precParams:["bl_gender", 2],
		func:uniqueDateCompareToFixedDateRepInstr,
		params:["sfu_menopausal_date", "bl_dob", 0, ">=", 1],
		vars:["bl_gender", "sfu_menopausal_date", "bl_dob"]
	}
,
		
	{
		name:'dq_7_10',
		desc:'Surveillance ongoing ("sfu_surveil_yn")=1 in current instance - Surveillance ongoing ("sfu_surveil_yn")=1 in previous instance',
		prec:null,
		precParams:null,
		func:varHasValueWithPreviousSelfRepInstr,
		params:["sfu_surveil_yn", 1],
		vars:["sfu_surveil_yn"]
	}
,
	{
		name:'dq_7_11',
		desc:'Systemic therapy ongoing ("sfu_syst_ther_yn")=1  in current instance - Systemic therapy ongoing ("sfu_syst_ther_yn")=1 in previous instance',
		prec:null,
		precParams:null,
		func:varHasValueWithPreviousSelfRepInstr,
		params:["sfu_syst_ther_yn", 1],
		vars:["sfu_syst_ther_yn"]
	}
,
	{
		name:'dq_7_12',
		desc:'Date of death ("sfu_dod") must be subsequent to Date of registration ("bl_dor")',
		prec:null,
		precParams:null,
		func:uniqueDateCompareToFixedDateRepInstr,
		params:["sfu_dod", "bl_dor", 0, ">=", 1],
		vars:["sfu_dod", "bl_dor"]
	}
,
	{
		name:'dq_8_1',
		desc:'Date of progression ("spr_date") must be subsequent to Previous Date of follow-up ("sfu_date")',
		prec:null,
		precParams:null,
		func:multiDateCompareFirstVsLastInstRepInstr,
		params:["spr_date", "sfu_date"],
		vars:["spr_date", "sfu_date"]
	}
,
	{
		name:'dq_8_2',
		desc:'Date of progression ("spr_date") must be subsequent to Previous Date of Date of progression ("spr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithPreviousSelfRepInstr,
		params:["spr_date", 0, ">"],
		vars:["spr_date"]
	}
,
	{
		name:'dq_8_3',
		desc:'Weight at progression ("spr_weight") must be between 20 and 250',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["spr_weight", 20, 250],
		vars:["spr_weight"]
	}
,
	{
		name:'dq_8_4',
		desc:'Tumour-related weight loss % at the time of progression ("spr_symptoms_tum_rel_weight_loss") must be between 1 and 100',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["spr_symptoms_tum_rel_weight_loss", 1, 100],
		vars:["spr_symptoms_tum_rel_weight_loss"]
	}
,
	{
		name:'dq_8_5',
		desc:'Hemoglobin value ("spr_hemo") must be between 1 and 25',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["spr_hemo", 1, 25],
		vars:["spr_hemo"]
	}
,
	{
		name:'dq_8_6',
		desc:'Fibrinogen value ("spr_fibrin") must be between 1 and 2000',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["spr_fibrin", 1, 2000],
		vars:["spr_fibrin"]
	}
,
	{
		name:'dq_8_7',
		desc:'GDF-15 value ("spr_gdf15") must be between 100 and 25000',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["spr_gdf15", 100, 25000],
		vars:["spr_gdf15"]
	}
,
	{
		name:'dq_8_8',
		desc:'Gender female - Menopausal date ("spr_menopausal_date") must be subsequent to date of birth ("bl_dob")',
		prec:varHasValue,
		precParams:["bl_gender", 2],
		func:uniqueDateCompareToFixedDateRepInstr,
		params:["spr_menopausal_date", "bl_dob", 0, ">=", 1],
		vars:["bl_gender", "spr_menopausal_date", "bl_dob"]
	}
,
	{
		name:'dq_8_9',
		desc:'Lung - Multiple lesions: number of lesions ("spr_dis_ext_lung_les_spec") must be between 1 and 100',
		prec:varHasValue,
		precParams:["spr_dis_ext_lung_les", 2],
		func:varWithinIntervalRepInstr,
		params:["spr_dis_ext_lung_les_spec", 1, 100],
		vars:["spr_dis_ext_lung_les", "spr_dis_ext_lung_les_spec"]
	}
,
	{
		name:'dq_8_10',
		desc:'Liver - Multiple lesions: number of lesions ("spr_dis_ext_liv_les_spec") must be between 1 and 100',
		prec:varHasValue,
		precParams:["spr_dis_ext_liv_les", 2],
		func:varWithinIntervalRepInstr,
		params:["spr_dis_ext_liv_les_spec", 1, 100],
		vars:["spr_dis_ext_liv_les", "spr_dis_ext_liv_les_spec"]
	}
,
	{
		name:'dq_8_11',
		desc:'Bone - Multiple lesions: number of lesions ("spr_dis_ext_bone_les_spec") must be between 1 and 100',
		prec:varHasValue,
		precParams:["spr_dis_ext_bone_les", 2],
		func:varWithinIntervalRepInstr,
		params:["spr_dis_ext_bone_les_spec", 1, 100],
		vars:["spr_dis_ext_bone_les", "spr_dis_ext_bone_les_spec"]
	}
,
	{
		name:'dq_8_12',
		desc:'Soft tissues (Limb) - Multiple lesions: number of lesions ("spr_dis_ext_soft_les_limb_spec") must be between 1 and 100',
		prec:varHasValue,
		precParams:["spr_dis_ext_soft_les_limb", 2],
		func:varWithinIntervalRepInstr,
		params:["spr_dis_ext_soft_les_limb_spec", 1, 100],
		vars:["spr_dis_ext_soft_les_limb", "spr_dis_ext_soft_les_limb_spec"]
	}
,
	{
		name:'dq_8_13',
		desc:'Soft tissues (Superficial trunk) - Multiple lesions: number of lesions ("spr_dis_ext_soft_les_trunk_spec") must be between 1 and 100',
		prec:varHasValue,
		precParams:["spr_dis_ext_soft_les_trunk", 2],
		func:varWithinIntervalRepInstr,
		params:["spr_dis_ext_soft_les_trunk_spec", 1, 100],
		vars:["spr_dis_ext_soft_les_trunk", "spr_dis_ext_soft_les_trunk_spec"]
	}
,
	{
		name:'dq_8_14',
		desc:'Soft tissues (Intra-abdominal) - Multiple lesions: number of lesions ("spr_dis_ext_soft_les_abdo_spec") must be between 1 and 100',
		prec:varHasValue,
		precParams:["spr_dis_ext_soft_les_abdo", 2],
		func:varWithinIntervalRepInstr,
		params:["spr_dis_ext_soft_les_abdo_spec", 1, 100],
		vars:["spr_dis_ext_soft_les_abdo", "spr_dis_ext_soft_les_abdo_spec"]
	}
,
	{
		name:'dq_8_15',
		desc:'Soft tissues (Intrathoracic) - Multiple lesions: number of lesions ("spr_dis_ext_soft_les_thor_spec") must be between 1 and 100',
		prec:varHasValue,
		precParams:["spr_dis_ext_soft_les_thor", 2],
		func:varWithinIntervalRepInstr,
		params:["spr_dis_ext_soft_les_thor_spec", 1, 100],
		vars:["spr_dis_ext_soft_les_thor", "spr_dis_ext_soft_les_thor_spec"]
	}
,
	{
		name:'dq_8_16',
		desc:'Soft tissues (Head & neck) - Multiple lesions: number of lesions ("spr_dis_ext_soft_les_hn_spec") must be between 1 and 100',
		prec:varHasValue,
		precParams:["spr_dis_ext_soft_les_hn", 2],
		func:varWithinIntervalRepInstr,
		params:["spr_dis_ext_soft_les_hn_spec", 1, 100],
		vars:["spr_dis_ext_soft_les_hn", "spr_dis_ext_soft_les_hn_spec"]
	}
,
		
	{
		name:'dq_8_18',
		desc:'Surveillance at last follow-up ("spr_surveil_yn")=1 - Surveillance ongoing ("sfu_surveil_yn")=1',
		prec:null,
		precParams:null,
		func:multiVarHasValueFirstVsLastInstRepInstr,
		params:[["spr_surveil_yn", 1], ["sfu_surveil_yn", 1]],
		vars:["spr_surveil_yn", "sfu_surveil_yn"]
	}
,
	{
		name:'dq_8_19',
		desc:'Surveillance at last follow-up ("spr_surveil_yn")=0 - Surveillance ongoing ("sfu_surveil_yn")=0',
		prec:null,
		precParams:null,
		func:multiVarHasValueFirstVsLastInstRepInstr,
		params:[["spr_surveil_yn", 0], ["sfu_surveil_yn", 0]],
		vars:["spr_surveil_yn", "sfu_surveil_yn"]
	}
,
	{
		name:'dq_8_20',
		desc:'Surveillance continue ("spr_surveil_continue_yn")=1 - New medical therapy ("spr_sys_ther_new_yn")=0 - Systemic therapy ("spr_sys_ther_start_yn")=0 - Radiotherapy ("spr_radio_yn")=0 - Surgery ("spr_surg_yn")=0 - Isolated limb perfusion ("spr_limbperf_yn")=0 - Local ablative techniques ("spr_abla_yn")=0',
		prec:null,
		precParams:null,
		func:multiVarHasValueRepInstr,
		params:[["spr_surveil_continue_yn", 1], ["spr_sys_ther_new_yn", 0], ["spr_sys_ther_start_yn", 0], ["spr_radio_yn", 0], ["spr_surg_yn", 0], ["spr_limbperf_yn", 0], ["spr_abla_yn", 0]],
		vars:["spr_surveil_continue_yn", "spr_sys_ther_new_yn", "spr_sys_ther_start_yn", "spr_radio_yn", "spr_surg_yn", "spr_limbperf_yn", "spr_abla_yn"]
	}
,
	{
		name:'dq_8_21',
		desc:'Systhemic therapy at last follow-up ("spr_sys_ther_yn")=1 - Systemic therapy ongoing ("sfu_syst_ther_yn")=1',
		prec:null,
		precParams:null,
		func:multiVarHasValueFirstVsLastInstRepInstr,
		params:[["spr_sys_ther_yn", 1], ["sfu_syst_ther_yn", 1]],
		vars:["spr_sys_ther_yn", "sfu_syst_ther_yn"]
	}
,
	{
		name:'dq_8_22',
		desc:'Systhemic therapy at last follow-up ("spr_sys_ther_yn")=0 - Systemic therapy ongoing ("sfu_syst_ther_yn")=0',
		prec:null,
		precParams:null,
		func:multiVarHasValueFirstVsLastInstRepInstr,
		params:[["spr_sys_ther_yn", 0], ["sfu_syst_ther_yn", 0]],
		vars:["spr_sys_ther_yn", "sfu_syst_ther_yn"]
	}
,
	{
		name:'dq_8_23',
		desc:'Systhemic therapy continue ("spr_sys_ther_continue_yn")=1 - Surveillance continue ("spr_surveil_continue_yn")=0',
		prec:null,
		precParams:null,
		func:multiVarHasValueRepInstr,
		params:[["spr_sys_ther_continue_yn", 1], ["spr_surveil_continue_yn", 0]],
		vars:["spr_sys_ther_continue_yn", "spr_surveil_continue_yn"]
	}
,
	{
		name:'dq_8_24',
		desc:'New medical therapy - Starting date ("spr_sys_ther_new_pre_start") must be subsequent to Date of local recurrence ("spr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_pre_start", "spr_date", 0, ">="],
		vars:["spr_sys_ther_new_pre_start", "spr_date"]
	}
,
	{
		name:'dq_8_24b',
		desc:'New medical therapy - Starting date ("spr_sys_ther_new_post_start") must be subsequent to Date of local recurrence ("spr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_post_start", "spr_date", 0, ">="],
		vars:["spr_sys_ther_new_post_start", "spr_date"]
	}
,
	{
		name:'dq_8_24c',
		desc:'New medical therapy - Starting date ("spr_sys_ther_new_pal_start") must be subsequent to Date of local recurrence ("spr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_pal_start", "spr_date", 0, ">="],
		vars:["spr_sys_ther_new_pal_start", "spr_date"]
	}
,
	{
		name:'dq_8_25',
		desc:'New medical therapy - Ending date ("spr_sys_ther_new_pre_end") must be subsequent to New medical therapy - Starting date ("spr_sys_ther_new_pre_start")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_pre_end", "spr_sys_ther_new_pre_start", 0, ">="],
		vars:["spr_sys_ther_new_pre_end", "spr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_8_25b',
		desc:'New medical therapy - Ending date ("spr_sys_ther_new_post_end") must be subsequent to New medical therapy - Starting date ("spr_sys_ther_new_post_start")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_post_end", "spr_sys_ther_new_post_start", 0, ">="],
		vars:["spr_sys_ther_new_post_end", "spr_sys_ther_new_post_start"]
	}
,
	{
		name:'dq_8_25c',
		desc:'New medical therapy - Ending date ("spr_sys_ther_new_pal_end") must be subsequent to New medical therapy - Starting date ("spr_sys_ther_new_pal_start")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_pal_end", "spr_sys_ther_new_pal_start", 0, ">="],
		vars:["spr_sys_ther_new_pal_end", "spr_sys_ther_new_pal_start"]
	}
,
	{
		name:'dq_8_26',
		desc:'New medical therapy Setting Preoperative ("spr_sys_ther_new_set")=1 - Date of surgery ("spr_surg_date_lung") must be subsequent to New medical therapy - Ending date ("spr_sys_ther_new_pre_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_lung", "spr_sys_ther_new_pre_end", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_surg_date_lung", "spr_sys_ther_new_pre_end"]
	}
,
	{
		name:'dq_8_26b',
		desc:'New medical therapy Setting Preoperative ("spr_sys_ther_new_set")=1 - Date of surgery ("spr_surg_date_liver") must be subsequent to New medical therapy - Ending date ("spr_sys_ther_new_pre_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_liver", "spr_sys_ther_new_pre_end", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_surg_date_liver", "spr_sys_ther_new_pre_end"]
	}
,
	{
		name:'dq_8_26c',
		desc:'New medical therapy Setting Preoperative ("spr_sys_ther_new_set")=1 - Date of surgery ("spr_surg_date_bone") must be subsequent to New medical therapy - Ending date ("spr_sys_ther_new_pre_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_bone", "spr_sys_ther_new_pre_end", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_surg_date_bone", "spr_sys_ther_new_pre_end"]
	}
,
	{
		name:'dq_8_26d',
		desc:'New medical therapy Setting Preoperative ("spr_sys_ther_new_set")=1 - Date of surgery ("spr_surg_date_soft") must be subsequent to New medical therapy - Ending date ("spr_sys_ther_new_pre_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_soft", "spr_sys_ther_new_pre_end", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_surg_date_soft", "spr_sys_ther_new_pre_end"]
	}
,
	{
		name:'dq_8_26e',
		desc:'New medical therapy Setting Preoperative ("spr_sys_ther_new_set")=1 - Date of surgery ("spr_surg_date_lymph") must be subsequent to New medical therapy - Ending date ("spr_sys_ther_new_pre_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_lymph", "spr_sys_ther_new_pre_end", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_surg_date_lymph", "spr_sys_ther_new_pre_end"]
	}
,
	{
		name:'dq_8_26f',
		desc:'New medical therapy Setting Preoperative ("spr_sys_ther_new_set")=1 - Date of surgery ("spr_surg_date_serosal") must be subsequent to New medical therapy - Ending date ("spr_sys_ther_new_pre_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_serosal", "spr_sys_ther_new_pre_end", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_surg_date_serosal", "spr_sys_ther_new_pre_end"]
	}
,
	{
		name:'dq_8_26g',
		desc:'New medical therapy Setting Preoperative ("spr_sys_ther_new_set")=1 - Date of surgery ("spr_surg_date_oth") must be subsequent to New medical therapy - Ending date ("spr_sys_ther_new_pre_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_oth", "spr_sys_ther_new_pre_end", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_surg_date_oth", "spr_sys_ther_new_pre_end"]
	}
,
	{
		name:'dq_8_27',
		desc:'New medical therapy Setting Postoperative ("spr_sys_ther_new_set")=2 - New medical therapy - Starting date ("spr_sys_ther_new_post_start") must be subsequent to Date of surgery ("spr_surg_date_lung")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_post_start", "spr_surg_date_lung", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_sys_ther_new_post_start", "spr_surg_date_lung"]
	}
,
	{
		name:'dq_8_27b',
		desc:'New medical therapy Setting Postoperative ("spr_sys_ther_new_set")=2 - New medical therapy - Starting date ("spr_sys_ther_new_post_start") must be subsequent to Date of surgery ("spr_surg_date_liver")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_post_start", "spr_surg_date_liver", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_sys_ther_new_post_start", "spr_surg_date_liver"]
	}
,
	{
		name:'dq_8_27c',
		desc:'New medical therapy Setting Postoperative ("spr_sys_ther_new_set")=2 - New medical therapy - Starting date ("spr_sys_ther_new_post_start") must be subsequent to Date of surgery ("spr_surg_date_bone")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_post_start", "spr_surg_date_bone", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_sys_ther_new_post_start", "spr_surg_date_bone"]
	}
,
	{
		name:'dq_8_27d',
		desc:'New medical therapy Setting Postoperative ("spr_sys_ther_new_set")=2 - New medical therapy - Starting date ("spr_sys_ther_new_post_start") must be subsequent to Date of surgery ("spr_surg_date_soft")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_post_start", "spr_surg_date_soft", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_sys_ther_new_post_start", "spr_surg_date_soft"]
	}
,
	{
		name:'dq_8_27e',
		desc:'New medical therapy Setting Postoperative ("spr_sys_ther_new_set")=2 - New medical therapy - Starting date ("spr_sys_ther_new_post_start") must be subsequent to Date of surgery ("spr_surg_date_lymph")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_post_start", "spr_surg_date_lymph", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_sys_ther_new_post_start", "spr_surg_date_lymph"]
	}
,
	{
		name:'dq_8_27f',
		desc:'New medical therapy Setting Postoperative ("spr_sys_ther_new_set")=2 - New medical therapy - Starting date ("spr_sys_ther_new_post_start") must be subsequent to Date of surgery ("spr_surg_date_serosal")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_post_start", "spr_surg_date_serosal", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_sys_ther_new_post_start", "spr_surg_date_serosal"]
	}
,
	{
		name:'dq_8_27g',
		desc:'New medical therapy Setting Postoperative ("spr_sys_ther_new_set")=2 - New medical therapy - Starting date ("spr_sys_ther_new_post_start") must be subsequent to Date of surgery ("spr_surg_date_oth")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_post_start", "spr_surg_date_oth", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_sys_ther_new_post_start", "spr_surg_date_oth"]
	}
,
	{
		name:'dq_8_28',
		desc:'New medical therapy Setting Pre and Postoperative ("spr_sys_ther_new_set")=3 - Date of surgery ("spr_surg_date_lung") must be subsequent to New medical therapy - Preoperative - Starting date ("spr_sys_ther_new_pre_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_lung", "spr_sys_ther_new_pre_start", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_surg_date_lung", "spr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_8_28b',
		desc:'New medical therapy Setting Pre and Postoperative ("spr_sys_ther_new_set")=3 - Date of surgery ("spr_surg_date_liver") must be subsequent to New medical therapy - Preoperative - Starting date ("spr_sys_ther_new_pre_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_liver", "spr_sys_ther_new_pre_start", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_surg_date_liver", "spr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_8_28c',
		desc:'New medical therapy Setting Pre and Postoperative ("spr_sys_ther_new_set")=3 - Date of surgery ("spr_surg_date_bone") must be subsequent to New medical therapy - Preoperative - Starting date ("spr_sys_ther_new_pre_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_bone", "spr_sys_ther_new_pre_start", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_surg_date_bone", "spr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_8_28d',
		desc:'New medical therapy Setting Pre and Postoperative ("spr_sys_ther_new_set")=3 - Date of surgery ("spr_surg_date_soft") must be subsequent to New medical therapy - Preoperative - Starting date ("spr_sys_ther_new_pre_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_soft", "spr_sys_ther_new_pre_start", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_surg_date_soft", "spr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_8_28e',
		desc:'New medical therapy Setting Pre and Postoperative ("spr_sys_ther_new_set")=3 - Date of surgery ("spr_surg_date_lymph") must be subsequent to New medical therapy - Preoperative - Starting date ("spr_sys_ther_new_pre_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_lymph", "spr_sys_ther_new_pre_start", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_surg_date_lymph", "spr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_8_28f',
		desc:'New medical therapy Setting Pre and Postoperative ("spr_sys_ther_new_set")=3 - Date of surgery ("spr_surg_date_serosal") must be subsequent to New medical therapy - Preoperative - Starting date ("spr_sys_ther_new_pre_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_serosal", "spr_sys_ther_new_pre_start", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_surg_date_serosal", "spr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_8_28g',
		desc:'New medical therapy Setting Pre and Postoperative ("spr_sys_ther_new_set")=3 - Date of surgery ("spr_surg_date_oth") must be subsequent to New medical therapy - Preoperative - Starting date ("spr_sys_ther_new_pre_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_oth", "spr_sys_ther_new_pre_start", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_surg_date_oth", "spr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_8_29',
		desc:'New medical therapy Setting Pre and Postoperative ("spr_sys_ther_new_set")=3 - New medical therapy - Ending date ("spr_sys_ther_new_post_end") must be subsequent to Date of surgery ("spr_surg_date_lung")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_post_end", "spr_surg_date_lung", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_sys_ther_new_post_end", "spr_surg_date_lung"]
	}
,
	{
		name:'dq_8_29b',
		desc:'New medical therapy Setting Pre and Postoperative ("spr_sys_ther_new_set")=3 - New medical therapy - Ending date ("spr_sys_ther_new_post_end") must be subsequent to Date of surgery ("spr_surg_date_liver")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_post_end", "spr_surg_date_liver", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_sys_ther_new_post_end", "spr_surg_date_liver"]
	}
,
	{
		name:'dq_8_29c',
		desc:'New medical therapy Setting Pre and Postoperative ("spr_sys_ther_new_set")=3 - New medical therapy - Ending date ("spr_sys_ther_new_post_end") must be subsequent to Date of surgery ("spr_surg_date_bone")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_post_end", "spr_surg_date_bone", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_sys_ther_new_post_end", "spr_surg_date_bone"]
	}
,
	{
		name:'dq_8_29d',
		desc:'New medical therapy Setting Pre and Postoperative ("spr_sys_ther_new_set")=3 - New medical therapy - Ending date ("spr_sys_ther_new_post_end") must be subsequent to Date of surgery ("spr_surg_date_soft")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_post_end", "spr_surg_date_soft", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_sys_ther_new_post_end", "spr_surg_date_soft"]
	}
,
	{
		name:'dq_8_29e',
		desc:'New medical therapy Setting Pre and Postoperative ("spr_sys_ther_new_set")=3 - New medical therapy - Ending date ("spr_sys_ther_new_post_end") must be subsequent to Date of surgery ("spr_surg_date_lymph")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_post_end", "spr_surg_date_lymph", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_sys_ther_new_post_end", "spr_surg_date_lymph"]
	}
,
	{
		name:'dq_8_29f',
		desc:'New medical therapy Setting Pre and Postoperative ("spr_sys_ther_new_set")=3 - New medical therapy - Ending date ("spr_sys_ther_new_post_end") must be subsequent to Date of surgery ("spr_surg_date_serosal")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_post_end", "spr_surg_date_serosal", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_sys_ther_new_post_end", "spr_surg_date_serosal"]
	}
,
	{
		name:'dq_8_29g',
		desc:'New medical therapy Setting Pre and Postoperative ("spr_sys_ther_new_set")=3 - New medical therapy - Ending date ("spr_sys_ther_new_post_end") must be subsequent to Date of surgery ("spr_surg_date_oth")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_post_end", "spr_surg_date_oth", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_sys_ther_new_post_end", "spr_surg_date_oth"]
	}
,
	{
		name:'dq_8_30',
		desc:'New medical therapy Setting Palliative ("spr_sys_ther_new_set")=4 - New medical therapy - Starting date ("spr_sys_ther_new_pal_start") must be subsequent to Date of progression ("spr_date") ',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_pal_start", "spr_date", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_sys_ther_new_pal_start", "spr_date"]
	}
,
	{
		name:'dq_8_31',
		desc:'New medical therapy Setting Palliative ("spr_sys_ther_new_set")=4 - New medical therapy - Ending date ("spr_sys_ther_new_pal_end") must be subsequent to New medical therapy - Starting date ("spr_sys_ther_new_pal_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_pal_end", "spr_sys_ther_new_pal_start", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_sys_ther_new_pal_end", "spr_sys_ther_new_pal_start"]
	}
,
	{
		name:'dq_8_32',
		desc:'Systemic therapy - Starting date ("spr_sys_ther_new_pre_start") must be subsequent to Date of progression ("spr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_pre_start", "spr_date", 0, ">"],
		vars:["spr_sys_ther_new_pre_start", "spr_date"]
	}
,
	{
		name:'dq_8_33',
		desc:'Systemic therapy - Ending date ("spr_sys_ther_new_pre_end") must be subsequent to Systemic therapy - Starting date ("spr_sys_ther_new_pre_start")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_pre_end", "spr_sys_ther_new_pre_start", 0, ">"],
		vars:["spr_sys_ther_new_pre_end", "spr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_8_34',
		desc:'Systemic therapy Setting Preoperative ("spr_sys_ther_new_set")=1 - Date of surgery ("spr_surg_date_lung") must be subsequent to Systemic therapy -  Ending date ("spr_sys_ther_new_pre_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_lung", "spr_sys_ther_new_pre_end", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_surg_date_lung", "spr_sys_ther_new_pre_end"]
	}
,
	{
		name:'dq_8_34b',
		desc:'Systemic therapy Setting Preoperative ("spr_sys_ther_new_set")=1 - Date of surgery ("spr_surg_date_liver") must be subsequent to Systemic therapy -  Ending date ("spr_sys_ther_new_pre_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_liver", "spr_sys_ther_new_pre_end", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_surg_date_liver", "spr_sys_ther_new_pre_end"]
	}
,
	{
		name:'dq_8_34c',
		desc:'Systemic therapy Setting Preoperative ("spr_sys_ther_new_set")=1 - Date of surgery ("spr_surg_date_bone") must be subsequent to Systemic therapy -  Ending date ("spr_sys_ther_new_pre_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_bone", "spr_sys_ther_new_pre_end", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_surg_date_bone", "spr_sys_ther_new_pre_end"]
	}
,
	{
		name:'dq_8_34d',
		desc:'Systemic therapy Setting Preoperative ("spr_sys_ther_new_set")=1 - Date of surgery ("spr_surg_date_soft") must be subsequent to Systemic therapy -  Ending date ("spr_sys_ther_new_pre_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_soft", "spr_sys_ther_new_pre_end", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_surg_date_soft", "spr_sys_ther_new_pre_end"]
	}
,
	{
		name:'dq_8_34e',
		desc:'Systemic therapy Setting Preoperative ("spr_sys_ther_new_set")=1 - Date of surgery ("spr_surg_date_lymph") must be subsequent to Systemic therapy -  Ending date ("spr_sys_ther_new_pre_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_lymph", "spr_sys_ther_new_pre_end", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_surg_date_lymph", "spr_sys_ther_new_pre_end"]
	}
,
	{
		name:'dq_8_34f',
		desc:'Systemic therapy Setting Preoperative ("spr_sys_ther_new_set")=1 - Date of surgery ("spr_surg_date_serosal") must be subsequent to Systemic therapy -  Ending date ("spr_sys_ther_new_pre_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_serosal", "spr_sys_ther_new_pre_end", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_surg_date_serosal", "spr_sys_ther_new_pre_end"]
	}
,
	{
		name:'dq_8_34g',
		desc:'Systemic therapy Setting Preoperative ("spr_sys_ther_new_set")=1 - Date of surgery ("spr_surg_date_oth") must be subsequent to Systemic therapy -  Ending date ("spr_sys_ther_new_pre_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_oth", "spr_sys_ther_new_pre_end", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_surg_date_oth", "spr_sys_ther_new_pre_end"]
	}
,
	{
		name:'dq_8_35',
		desc:'Systemic therapy Setting Postoperative ("spr_sys_ther_new_set")=2 - Systemic therapy - Starting date ("spr_sys_ther_new_post_start") must be subsequent to Date of surgery ("spr_surg_date_lung")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_post_start", "spr_surg_date_lung", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_sys_ther_new_post_start", "spr_surg_date_lung"]
	}
,
	{
		name:'dq_8_35b',
		desc:'Systemic therapy Setting Postoperative ("spr_sys_ther_new_set")=2 - Systemic therapy - Starting date ("spr_sys_ther_new_post_start") must be subsequent to Date of surgery ("spr_surg_date_liver")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_post_start", "spr_surg_date_liver", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_sys_ther_new_post_start", "spr_surg_date_liver"]
	}
,
	{
		name:'dq_8_35c',
		desc:'Systemic therapy Setting Postoperative ("spr_sys_ther_new_set")=2 - Systemic therapy - Starting date ("spr_sys_ther_new_post_start") must be subsequent to Date of surgery ("spr_surg_date_bone")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_post_start", "spr_surg_date_bone", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_sys_ther_new_post_start", "spr_surg_date_bone"]
	}
,
	{
		name:'dq_8_35d',
		desc:'Systemic therapy Setting Postoperative ("spr_sys_ther_new_set")=2 - Systemic therapy - Starting date ("spr_sys_ther_new_post_start") must be subsequent to Date of surgery ("spr_surg_date_soft")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_post_start", "spr_surg_date_soft", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_sys_ther_new_post_start", "spr_surg_date_soft"]
	}
,
	{
		name:'dq_8_35e',
		desc:'Systemic therapy Setting Postoperative ("spr_sys_ther_new_set")=2 - Systemic therapy - Starting date ("spr_sys_ther_new_post_start") must be subsequent to Date of surgery ("spr_surg_date_lymph")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_post_start", "spr_surg_date_lymph", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_sys_ther_new_post_start", "spr_surg_date_lymph"]
	}
,
	{
		name:'dq_8_35f',
		desc:'Systemic therapy Setting Postoperative ("spr_sys_ther_new_set")=2 - Systemic therapy - Starting date ("spr_sys_ther_new_post_start") must be subsequent to Date of surgery ("spr_surg_date_serosal")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_post_start", "spr_surg_date_serosal", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_sys_ther_new_post_start", "spr_surg_date_serosal"]
	}
,
	{
		name:'dq_8_35g',
		desc:'Systemic therapy Setting Postoperative ("spr_sys_ther_new_set")=2 - Systemic therapy - Starting date ("spr_sys_ther_new_post_start") must be subsequent to Date of surgery ("spr_surg_date_oth")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_post_start", "spr_surg_date_oth", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_sys_ther_new_post_start", "spr_surg_date_oth"]
	}
,
	{
		name:'dq_8_36',
		desc:'Systemic therapy Setting Pre and Postoperative ("spr_sys_ther_new_set")=3 - Date of surgery ("spr_surg_date_lung") must be subsequent to Systemic therapy - Starting date ("spr_sys_ther_new_pre_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_lung", "spr_sys_ther_new_pre_start", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_surg_date_lung", "spr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_8_36b',
		desc:'Systemic therapy Setting Pre and Postoperative ("spr_sys_ther_new_set")=3 - Date of surgery ("spr_surg_date_liver") must be subsequent to Systemic therapy - Starting date ("spr_sys_ther_new_pre_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_liver", "spr_sys_ther_new_pre_start", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_surg_date_liver", "spr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_8_36c',
		desc:'Systemic therapy Setting Pre and Postoperative ("spr_sys_ther_new_set")=3 - Date of surgery ("spr_surg_date_bone") must be subsequent to Systemic therapy - Starting date ("spr_sys_ther_new_pre_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_bone", "spr_sys_ther_new_pre_start", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_surg_date_bone", "spr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_8_36d',
		desc:'Systemic therapy Setting Pre and Postoperative ("spr_sys_ther_new_set")=3 - Date of surgery ("spr_surg_date_soft") must be subsequent to Systemic therapy - Starting date ("spr_sys_ther_new_pre_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_soft", "spr_sys_ther_new_pre_start", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_surg_date_soft", "spr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_8_36e',
		desc:'Systemic therapy Setting Pre and Postoperative ("spr_sys_ther_new_set")=3 - Date of surgery ("spr_surg_date_lymph") must be subsequent to Systemic therapy - Starting date ("spr_sys_ther_new_pre_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_lymph", "spr_sys_ther_new_pre_start", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_surg_date_lymph", "spr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_8_36f',
		desc:'Systemic therapy Setting Pre and Postoperative ("spr_sys_ther_new_set")=3 - Date of surgery ("spr_surg_date_serosal") must be subsequent to Systemic therapy - Starting date ("spr_sys_ther_new_pre_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_serosal", "spr_sys_ther_new_pre_start", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_surg_date_serosal", "spr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_8_36g',
		desc:'Systemic therapy Setting Pre and Postoperative ("spr_sys_ther_new_set")=3 - Date of surgery ("spr_surg_date_oth") must be subsequent to Systemic therapy - Starting date ("spr_sys_ther_new_pre_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_oth", "spr_sys_ther_new_pre_start", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_surg_date_oth", "spr_sys_ther_new_pre_start"]
	}
,
	{
		name:'dq_8_37',
		desc:'Systemic therapy Setting Pre and Postoperative ("spr_sys_ther_new_set")=3 -  Systemic therapy -  Ending date ("spr_sys_ther_new_post_end") must be subsequent to Date of surgery ("spr_surg_date_lung")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_post_end", "spr_surg_date_lung", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_sys_ther_new_post_end", "spr_surg_date_lung"]
	}
,
	{
		name:'dq_8_37b',
		desc:'Systemic therapy Setting Pre and Postoperative ("spr_sys_ther_new_set")=3 -  Systemic therapy -  Ending date ("spr_sys_ther_new_post_end") must be subsequent to Date of surgery ("spr_surg_date_liver")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_post_end", "spr_surg_date_liver", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_sys_ther_new_post_end", "spr_surg_date_liver"]
	}
,
	{
		name:'dq_8_37c',
		desc:'Systemic therapy Setting Pre and Postoperative ("spr_sys_ther_new_set")=3 -  Systemic therapy -  Ending date ("spr_sys_ther_new_post_end") must be subsequent to Date of surgery ("spr_surg_date_bone")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_post_end", "spr_surg_date_bone", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_sys_ther_new_post_end", "spr_surg_date_bone"]
	}
,
	{
		name:'dq_8_37d',
		desc:'Systemic therapy Setting Pre and Postoperative ("spr_sys_ther_new_set")=3 -  Systemic therapy -  Ending date ("spr_sys_ther_new_post_end") must be subsequent to Date of surgery ("spr_surg_date_soft")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_post_end", "spr_surg_date_soft", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_sys_ther_new_post_end", "spr_surg_date_soft"]
	}
,
	{
		name:'dq_8_37e',
		desc:'Systemic therapy Setting Pre and Postoperative ("spr_sys_ther_new_set")=3 -  Systemic therapy -  Ending date ("spr_sys_ther_new_post_end") must be subsequent to Date of surgery ("spr_surg_date_lymph")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_post_end", "spr_surg_date_lymph", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_sys_ther_new_post_end", "spr_surg_date_lymph"]
	}
,
	{
		name:'dq_8_37f',
		desc:'Systemic therapy Setting Pre and Postoperative ("spr_sys_ther_new_set")=3 -  Systemic therapy -  Ending date ("spr_sys_ther_new_post_end") must be subsequent to Date of surgery ("spr_surg_date_serosal")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_post_end", "spr_surg_date_serosal", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_sys_ther_new_post_end", "spr_surg_date_serosal"]
	}
,
	{
		name:'dq_8_37g',
		desc:'Systemic therapy Setting Pre and Postoperative ("spr_sys_ther_new_set")=3 -  Systemic therapy -  Ending date ("spr_sys_ther_new_post_end") must be subsequent to Date of surgery ("spr_surg_date_oth")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_post_end", "spr_surg_date_oth", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_sys_ther_new_post_end", "spr_surg_date_oth"]
	}
,
	{
		name:'dq_8_38',
		desc:'Systemic therapy Setting Palliative ("spr_sys_ther_new_set")=4 - Systemic therapy - Starting date ("spr_sys_ther_new_pal_start") must be subsequent to Date of progression ("spr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_pal_start", "spr_date", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_sys_ther_new_pal_start", "spr_date"]
	}
,
	{
		name:'dq_8_39',
		desc:'Systemic therapy Setting Palliative ("spr_sys_ther_new_set")=4 - Systemic therapy -  Ending date ("spr_sys_ther_new_pal_end") must be subsequent to Systemic therapy - Starting date ("spr_sys_ther_new_pal_start")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_sys_ther_new_set", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_sys_ther_new_pal_end", "spr_sys_ther_new_pal_start", 0, ">"],
		vars:["spr_sys_ther_new_set", "spr_sys_ther_new_pal_end", "spr_sys_ther_new_pal_start"]
	}
,
		
	{
		name:'dq_8_40',
		desc:'Lung - Radiotherapy - Starting date ("spr_radio_lung_start") must be subsequent to Date of progression ("spr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_lung_start", "spr_date", 0, ">"],
		vars:["spr_radio_lung_start", "spr_date"]
	}
,
	{
		name:'dq_8_41',
		desc:'Lung - Radiotherapy - Ending date ("spr_radio_lung_end") must be subsequent to Lung - Radiotherapy - Starting date ("spr_radio_lung_start")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_lung_end", "spr_radio_lung_start", 0, ">"],
		vars:["spr_radio_lung_end", "spr_radio_lung_start"]
	}
,
	{
		name:'dq_8_42',
		desc:'Lung - Radiotherapy Setting Preoperative ("spr_lung_radio_set")=1 - Lung - Date of surgery ("spr_surg_date_lung") must be subsequent to Lung - Radiotherapy - Ending date ("spr_radio_lung_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_lung_radio_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_lung", "spr_radio_lung_end", 0, ">"],
		vars:["spr_lung_radio_set", "spr_surg_date_lung", "spr_radio_lung_end"]
	}
,
	{
		name:'dq_8_43',
		desc:'Lung - Radiotherapy Setting Postoperative ("spr_lung_radio_set")=2 - Lung - Radiotherapy - Starting date ("spr_radio_lung_start") must be subsequent to Lung - Date of surgery ("spr_surg_date_lung")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_lung_radio_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_lung_start", "spr_surg_date_lung", 0, ">"],
		vars:["spr_lung_radio_set", "spr_radio_lung_start", "spr_surg_date_lung"]
	}
,
	{
		name:'dq_8_44',
		desc:'Lung - Radiotherapy Setting Palliative ("spr_lung_radio_set")=3 - Lung - Radiotherapy - Starting date ("spr_radio_lung_start") must be subsequent to Date of progression ("spr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_lung_radio_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_lung_start", "spr_date", 0, ">"],
		vars:["spr_lung_radio_set", "spr_radio_lung_start", "spr_date"]
	}
,
	{
		name:'dq_8_45',
		desc:'Lung - Radiotherapy Setting Definitive ("spr_lung_radio_set")=4 - Lung - Radiotherapy - Starting date ("spr_radio_lung_start") must be subsequent to Date of progression ("spr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_lung_radio_set", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_lung_start", "spr_date", 0, ">"],
		vars:["spr_lung_radio_set", "spr_radio_lung_start", "spr_date"]
	}
,
	{
		name:'dq_8_46',
		desc:'Lung - Radiotherapy Setting Definitive ("spr_lung_radio_set")=4  - Radiotherapy ("spr_radio_yn")=1 - Surgery ("spr_surg_yn")=0',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_lung_radio_set", 4]]],
		func:multiVarHasValueRepInstr,
		params:[["spr_radio_yn", 1], ["spr_surg_yn", 0]],
		vars:["spr_lung_radio_set", "spr_radio_yn", "spr_surg_yn"]
	}
,
	{
		name:'dq_8_47',
		desc:'Liver - Radiotherapy - Starting date ("spr_radio_liver_start") must be subsequent to Date of progression ("spr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_liver_start", "spr_date", 0, ">"],
		vars:["spr_radio_liver_start", "spr_date"]
	}
,
	{
		name:'dq_8_48',
		desc:'Liver - Radiotherapy - Ending date ("spr_radio_liver_end") must be subsequent to Liver - Radiotherapy - Starting date ("spr_radio_liver_start")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_liver_end", "spr_radio_liver_start", 0, ">"],
		vars:["spr_radio_liver_end", "spr_radio_liver_start"]
	}
,
	{
		name:'dq_8_49',
		desc:'Liver - Radiotherapy Setting Preoperative ("spr_radio_liver_set")=1 - Liver - Date of surgery ("spr_surg_date_liver") must be subsequent to Liver - Radiotherapy - Ending date ("spr_radio_liver_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_radio_liver_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_liver", "spr_radio_liver_end", 0, ">"],
		vars:["spr_radio_liver_set", "spr_surg_date_liver", "spr_radio_liver_end"]
	}
,
	{
		name:'dq_8_50',
		desc:'Liver - Radiotherapy Setting Postoperative ("spr_radio_liver_set")=2 - Liver - Radiotherapy - Starting date ("spr_radio_liver_start") must be subsequent to Liver - Date of surgery ("spr_surg_date_liver")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_radio_liver_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_liver_start", "spr_surg_date_liver", 0, ">"],
		vars:["spr_radio_liver_set", "spr_radio_liver_start", "spr_surg_date_liver"]
	}
,
	{
		name:'dq_8_51',
		desc:'Liver - Radiotherapy Setting Palliative ("spr_radio_liver_set")=3 - Liver - Radiotherapy - Starting date ("spr_radio_liver_start") must be subsequent to Date of progression ("spr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_radio_liver_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_liver_start", "spr_date", 0, ">"],
		vars:["spr_radio_liver_set", "spr_radio_liver_start", "spr_date"]
	}
,
	{
		name:'dq_8_52',
		desc:'Liver - Radiotherapy Setting Definitive ("spr_radio_liver_set")=4 - Liver - Radiotherapy - Starting date ("spr_radio_liver_start") must be subsequent to Date of progression ("spr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_radio_liver_set", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_liver_start", "spr_date", 0, ">"],
		vars:["spr_radio_liver_set", "spr_radio_liver_start", "spr_date"]
	}
,
	{
		name:'dq_8_53',
		desc:'Liver - Radiotherapy Setting Definitive ("spr_radio_liver_set")=4 - Radiotherapy ("spr_radio_yn")=1 - Surgery ("spr_surg_yn")=0',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_radio_liver_set", 4]]],
		func:multiVarHasValueRepInstr,
		params:[["spr_radio_yn", 1], ["spr_surg_yn", 0]],
		vars:["spr_radio_liver_set"]
	}
,
	{
		name:'dq_8_54',
		desc:'Bone - Radiotherapy - Starting date ("spr_radio_bone_start") must be subsequent to Date of progression ("spr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_bone_start", "spr_date", 0, ">"],
		vars:["spr_radio_bone_start", "spr_date"]
	}
,
	{
		name:'dq_8_55',
		desc:'Bone - Radiotherapy - Ending date ("spr_radio_bone_end") must be subsequent to Bone - Radiotherapy - Starting date ("spr_radio_bone_start")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_bone_end", "spr_radio_bone_start", 0, ">"],
		vars:["spr_radio_bone_end", "spr_radio_bone_start"]
	}
,
	{
		name:'dq_8_56',
		desc:'Bone - Radiotherapy Setting Preoperative ("spr_radio_bone_set")=1 - Bone - Date of surgery ("spr_surg_date_bone") must be subsequent to Bone - Radiotherapy - Ending date ("spr_radio_bone_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_radio_bone_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_bone", "spr_radio_bone_end", 0, ">"],
		vars:["spr_radio_bone_set", "spr_surg_date_bone", "spr_radio_bone_end"]
	}
,
	{
		name:'dq_8_57',
		desc:'Bone - Radiotherapy Setting Postoperative ("spr_radio_bone_set")=2 - Bone - Radiotherapy - Starting date ("spr_radio_bone_start") must be subsequent to Bone - Date of surgery ("spr_surg_date_bone")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_radio_bone_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_bone_start", "spr_surg_date_bone", 0, ">"],
		vars:["spr_radio_bone_set", "spr_radio_bone_start", "spr_surg_date_bone"]
	}
,
	{
		name:'dq_8_58',
		desc:'Bone - Radiotherapy Setting Palliative ("spr_radio_bone_set")=3 - Bone - Radiotherapy - Starting date ("spr_radio_bone_start") must be subsequent to Date of progression ("spr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_radio_bone_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_bone_start", "spr_date", 0, ">"],
		vars:["spr_radio_bone_set", "spr_radio_bone_start", "spr_date"]
	}
,
	{
		name:'dq_8_59',
		desc:'Bone - Radiotherapy Setting Definitive ("spr_radio_bone_set")=4 - Bone - Radiotherapy - Starting date ("spr_radio_bone_start") must be subsequent to Date of progression ("spr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_radio_bone_set", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_bone_start", "spr_date", 0, ">"],
		vars:["spr_radio_bone_set", "spr_radio_bone_start", "spr_date"]
	}
,
	{
		name:'dq_8_60',
		desc:'Bone - Radiotherapy Setting Definitive ("spr_radio_bone_set")=4 - Radiotherapy ("spr_radio_yn")=1 - Surgery ("spr_surg_yn")=0',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_radio_bone_set", 4]]],
		func:multiVarHasValueRepInstr,
		params:[["spr_radio_yn", 1], ["spr_surg_yn", 0]],
		vars:["spr_radio_bone_set"]
	}
,
	{
		name:'dq_8_61',
		desc:'Soft tissues - Radiotherapy - Starting date ("spr_radio_soft_start") must be subsequent to Date of progression ("spr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_soft_start", "spr_date", 0, ">"],
		vars:["spr_radio_soft_start", "spr_date"]
	}
,
	{
		name:'dq_8_62',
		desc:'Soft tissues - Radiotherapy - Ending date ("spr_radio_soft_end") must be subsequent to Soft tissues - Radiotherapy - Starting date ("spr_radio_soft_start")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_soft_end", "spr_radio_soft_start", 0, ">"],
		vars:["spr_radio_soft_end", "spr_radio_soft_start"]
	}
,
	{
		name:'dq_8_63',
		desc:'Soft tissues - Radiotherapy Setting Preoperative ("spr_radio_soft_set")=1 - Soft tissues - Date of surgery ("spr_surg_date_soft") must be subsequent to Soft tissues - Radiotherapy - Ending date ("spr_radio_soft_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_radio_soft_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_soft", "spr_radio_soft_end", 0, ">"],
		vars:["spr_radio_soft_set", "spr_surg_date_soft", "spr_radio_soft_end"]
	}
,
	{
		name:'dq_8_64',
		desc:'Soft tissues - Radiotherapy Setting Postoperative ("spr_radio_soft_set")=2 - Soft tissues - Radiotherapy - Starting date ("spr_radio_soft_start") must be subsequent to Soft tissues - Date of surgery ("spr_surg_date_soft")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_radio_soft_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_soft_start", "spr_surg_date_soft", 0, ">"],
		vars:["spr_radio_soft_set", "spr_radio_soft_start", "spr_surg_date_soft"]
	}
,
	{
		name:'dq_8_65',
		desc:'Soft tissues - Radiotherapy Setting Palliative ("spr_radio_soft_set")=3 - Soft tissues - Radiotherapy - Starting date ("spr_radio_soft_start") must be subsequent to Date of progression ("spr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_radio_soft_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_soft_start", "spr_date", 0, ">"],
		vars:["spr_radio_soft_set", "spr_radio_soft_start", "spr_date"]
	}
,
	{
		name:'dq_8_66',
		desc:'Soft tissues - Radiotherapy Setting Definitive ("spr_radio_soft_set")=4 - Soft tissues - Radiotherapy - Starting date ("spr_radio_soft_start") must be subsequent to Date of progression ("spr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_radio_soft_set", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_soft_start", "spr_date", 0, ">"],
		vars:["spr_radio_soft_set", "spr_radio_soft_start", "spr_date"]
	}
,
	{
		name:'dq_8_67',
		desc:'Soft tissues - Radiotherapy Setting Definitive ("spr_radio_soft_set")=4 - Radiotherapy ("spr_radio_yn")=1 - Surgery ("spr_surg_yn")=0',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_radio_soft_set", 4]]],
		func:multiVarHasValueRepInstr,
		params:[["spr_radio_yn", 1], ["spr_surg_yn", 0]],
		vars:["spr_radio_soft_set"]
	}
,
	{
		name:'dq_8_68',
		desc:'Lymph nodes - Radiotherapy - Starting date ("spr_radio_lymph_start") must be subsequent to Date of progression ("spr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_lymph_start", "spr_date", 0, ">"],
		vars:["spr_radio_lymph_start", "spr_date"]
	}
,
	{
		name:'dq_8_69',
		desc:'Lymph nodes - Radiotherapy - Ending date ("spr_radio_lymph_end") must be subsequent to Lymph nodes - Radiotherapy - Starting date ("spr_radio_lymph_start")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_lymph_end", "spr_radio_lymph_start", 0, ">"],
		vars:["spr_radio_lymph_end", "spr_radio_lymph_start"]
	}
,
	{
		name:'dq_8_70',
		desc:'Lymph nodes - Radiotherapy Setting Preoperative ("spr_radio_lymph_set")=1 - Lymph nodes - Date of surgery ("spr_surg_date_lymph") must be subsequent to Lymph nodes - Radiotherapy - Ending date ("spr_radio_lymph_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_radio_lymph_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_lymph", "spr_radio_lymph_end", 0, ">"],
		vars:["spr_radio_lymph_set", "spr_surg_date_lymph", "spr_radio_lymph_end"]
	}
,
	{
		name:'dq_8_71',
		desc:'Lymph nodes - Radiotherapy Setting Postoperative ("spr_radio_lymph_set")=2 - Lymph nodes - Radiotherapy - Starting date ("spr_radio_lymph_start") must be subsequent to Lymph nodes - Date of surgery ("spr_surg_date_lymph")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_radio_lymph_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_lymph_start", "spr_surg_date_lymph", 0, ">"],
		vars:["spr_radio_lymph_set", "spr_radio_lymph_start", "spr_surg_date_lymph"]
	}
,
	{
		name:'dq_8_72',
		desc:'Lymph nodes - Radiotherapy Setting Palliative ("spr_radio_lymph_set")=3 - Lymph nodes - Radiotherapy - Starting date ("spr_radio_lymph_start") must be subsequent to Date of progression ("spr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_radio_lymph_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_lymph_start", "spr_date", 0, ">"],
		vars:["spr_radio_lymph_set", "spr_radio_lymph_start", "spr_date"]
	}
,
	{
		name:'dq_8_73',
		desc:'Lymph nodes - Radiotherapy Setting Definitive ("spr_radio_lymph_set")=4 - Lymph nodes - Radiotherapy - Starting date ("spr_radio_lymph_start") must be subsequent to Date of progression ("spr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_radio_lymph_set", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_lymph_start", "spr_date", 0, ">"],
		vars:["spr_radio_lymph_set", "spr_radio_lymph_start", "spr_date"]
	}
,
	{
		name:'dq_8_74',
		desc:'Lymph nodes - Radiotherapy Setting Definitive ("spr_radio_lymph_set")=4 - Radiotherapy ("spr_radio_yn")=1 - Surgery ("spr_surg_yn")=0',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_radio_lymph_set", 4]]],
		func:multiVarHasValueRepInstr,
		params:[["spr_radio_yn", 1], ["spr_surg_yn", 0]],
		vars:["spr_radio_lymph_set"]
	}
,
	{
		name:'dq_8_75',
		desc:'Serosal - Radiotherapy - Starting date ("spr_radio_sero_start") must be subsequent to Date of progression ("spr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_sero_start", "spr_date", 0, ">"],
		vars:["spr_radio_sero_start", "spr_date"]
	}
,
	{
		name:'dq_8_76',
		desc:'Serosal - Radiotherapy - Ending date ("spr_radio_sero_end") must be subsequent to Serosal - Radiotherapy - Starting date ("spr_radio_sero_start")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_sero_end", "spr_radio_sero_start", 0, ">"],
		vars:["spr_radio_sero_end", "spr_radio_sero_start"]
	}
,
//{
//name:'dq_8_77',
//desc:'Serosal - Radiotherapy Setting Preoperative ("spr_radio_sero_set")=1 - Serosal - Date of surgery ("spr_surg_date_sero") must be subsequent to Serosal - Radiotherapy - Ending date ("spr_radio_sero_end")',
//prec:multiVarHasValueRepInstr,
//precParams:[[["spr_radio_sero_set", 1]]],
//func:dateCompareWithDeltaRepInstr,
//params:["spr_surg_date_sero", "spr_radio_sero_end", 0, ">"],
//vars:["spr_radio_sero_set", "spr_surg_date_sero", "spr_radio_sero_end"]
//}
//,
	{
		name:'dq_8_78',
		desc:'Serosal - Radiotherapy Setting Postoperative ("spr_radio_sero_set")=2 - Serosal - Radiotherapy - Starting date ("spr_radio_sero_start") must be subsequent to Serosal - Date of surgery ("spr_surg_date_sero")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_radio_sero_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_sero_start", "spr_surg_date_sero", 0, ">"],
		vars:["spr_radio_sero_set", "spr_radio_sero_start", "spr_surg_date_sero"]
	}
,
	{
		name:'dq_8_79',
		desc:'Serosal - Radiotherapy Setting Palliative ("spr_radio_sero_set")=3 - Serosal - Radiotherapy - Starting date ("spr_radio_sero_start") must be subsequent to Date of progression ("spr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_radio_sero_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_sero_start", "spr_date", 0, ">"],
		vars:["spr_radio_sero_set", "spr_radio_sero_start", "spr_date"]
	}
,
	{
		name:'dq_8_80',
		desc:'Serosal - Radiotherapy Setting Definitive ("spr_radio_sero_set")=4 - Serosal - Radiotherapy - Starting date ("spr_radio_sero_start") must be subsequent to Date of progression ("spr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_radio_sero_set", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_sero_start", "spr_date", 0, ">"],
		vars:["spr_radio_sero_set", "spr_radio_sero_start", "spr_date"]
	}
,
	{
		name:'dq_8_81',
		desc:'Serosal - Radiotherapy Setting Definitive ("spr_radio_sero_set")=4 - Radiotherapy ("spr_radio_yn")=1 - Surgery ("spr_surg_yn")=0',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_radio_sero_set", 4]]],
		func:multiVarHasValueRepInstr,
		params:[["spr_radio_yn", 1], ["spr_surg_yn", 0]],
		vars:["spr_radio_sero_set"]
	}
,
	{
		name:'dq_8_82',
		desc:'Other - Radiotherapy - Starting date ("spr_radio_oth_start") must be subsequent to Date of progression ("spr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_oth_start", "spr_date", 0, ">"],
		vars:["spr_radio_oth_start", "spr_date"]
	}
,
	{
		name:'dq_8_83',
		desc:'Other - Radiotherapy - Ending date ("spr_radio_oth_end") must be subsequent to Other - Radiotherapy - Starting date ("spr_radio_oth_start")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_oth_end", "spr_radio_oth_start", 0, ">"],
		vars:["spr_radio_oth_end", "spr_radio_oth_start"]
	}
,
	{
		name:'dq_8_84',
		desc:'Other - Radiotherapy Setting Preoperative ("spr_radio_oth_set")=1 - Other - Date of surgery ("spr_surg_date_oth") must be subsequent to Other - Radiotherapy - Ending date ("spr_radio_oth_end")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_radio_oth_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_oth", "spr_radio_oth_end", 0, ">"],
		vars:["spr_radio_oth_set", "spr_surg_date_oth", "spr_radio_oth_end"]
	}
,
	{
		name:'dq_8_85',
		desc:'Other - Radiotherapy Setting Postoperative ("spr_radio_oth_set")=2 - Other - Radiotherapy - Starting date ("spr_radio_oth_start") must be subsequent to Other - Date of surgery ("spr_surg_date_oth")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_radio_oth_set", 2]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_oth_start", "spr_surg_date_oth", 0, ">"],
		vars:["spr_radio_oth_set", "spr_radio_oth_start", "spr_surg_date_oth"]
	}
,
	{
		name:'dq_8_86',
		desc:'Other - Radiotherapy Setting Palliative ("spr_radio_oth_set")=3 - Other - Radiotherapy - Starting date ("spr_radio_oth_start") must be subsequent to Date of progression ("spr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_radio_oth_set", 3]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_oth_start", "spr_date", 0, ">"],
		vars:["spr_radio_oth_set", "spr_radio_oth_start", "spr_date"]
	}
,
	{
		name:'dq_8_87',
		desc:'Other - Radiotherapy Setting Definitive ("spr_radio_oth_set")=4 - Other - Radiotherapy - Starting date ("spr_radio_oth_start") must be subsequent to Date of progression ("spr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_radio_oth_set", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_radio_oth_start", "spr_date", 0, ">"],
		vars:["spr_radio_oth_set", "spr_radio_oth_start", "spr_date"]
	}
,
	{
		name:'dq_8_88',
		desc:'Other - Radiotherapy Setting Definitive ("spr_radio_oth_set")=4 - Radiotherapy ("spr_radio_yn")=1 - Surgery ("spr_surg_yn")=0',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_radio_oth_set", 4]]],
		func:multiVarHasValueRepInstr,
		params:[["spr_radio_yn", 1], ["spr_surg_yn", 0]],
		vars:["spr_radio_oth_set"]
	}
,
	{
		name:'dq_8_89',
		desc:'Isolated limb perfusion - Procedure date ("spr_limbperf_date") must be subsequent to Date of progression ("spr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["spr_limbperf_date", "spr_date", 0, ">"],
		vars:["spr_limbperf_date", "spr_date"]
	}
,
	{
		name:'dq_8_90',
		desc:'Isolated limb perfusion Setting Preoperative ("spr_limbperf_set")=1 - Date of surgery ("spr_surg_date_lung") must be subsequent to Isolated limb perfusion - Procedure date ("spr_limbperf_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_limbperf_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_lung", "spr_limbperf_date", 0, ">"],
		vars:["spr_limbperf_set", "spr_surg_date_lung", "spr_limbperf_date"]
	}
,
	{
		name:'dq_8_90b',
		desc:'Isolated limb perfusion Setting Preoperative ("spr_limbperf_set")=1 - Date of surgery ("spr_surg_date_liver") must be subsequent to Isolated limb perfusion - Procedure date ("spr_limbperf_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_limbperf_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_liver", "spr_limbperf_date", 0, ">"],
		vars:["spr_limbperf_set", "spr_surg_date_liver", "spr_limbperf_date"]
	}
,
	{
		name:'dq_8_90c',
		desc:'Isolated limb perfusion Setting Preoperative ("spr_limbperf_set")=1 - Date of surgery ("spr_surg_date_bone") must be subsequent to Isolated limb perfusion - Procedure date ("spr_limbperf_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_limbperf_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_bone", "spr_limbperf_date", 0, ">"],
		vars:["spr_limbperf_set", "spr_surg_date_bone", "spr_limbperf_date"]
	}
,
	{
		name:'dq_8_90d',
		desc:'Isolated limb perfusion Setting Preoperative ("spr_limbperf_set")=1 - Date of surgery ("spr_surg_date_soft") must be subsequent to Isolated limb perfusion - Procedure date ("spr_limbperf_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_limbperf_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_soft", "spr_limbperf_date", 0, ">"],
		vars:["spr_limbperf_set", "spr_surg_date_soft", "spr_limbperf_date"]
	}
,
	{
		name:'dq_8_90e',
		desc:'Isolated limb perfusion Setting Preoperative ("spr_limbperf_set")=1 - Date of surgery ("spr_surg_date_lymph") must be subsequent to Isolated limb perfusion - Procedure date ("spr_limbperf_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_limbperf_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_lymph", "spr_limbperf_date", 0, ">"],
		vars:["spr_limbperf_set", "spr_surg_date_lymph", "spr_limbperf_date"]
	}
,
	{
		name:'dq_8_90f',
		desc:'Isolated limb perfusion Setting Preoperative ("spr_limbperf_set")=1 - Date of surgery ("spr_surg_date_serosal") must be subsequent to Isolated limb perfusion - Procedure date ("spr_limbperf_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_limbperf_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_serosal", "spr_limbperf_date", 0, ">"],
		vars:["spr_limbperf_set", "spr_surg_date_serosal", "spr_limbperf_date"]
	}
,
	{
		name:'dq_8_90g',
		desc:'Isolated limb perfusion Setting Preoperative ("spr_limbperf_set")=1 - Date of surgery ("spr_surg_date_oth") must be subsequent to Isolated limb perfusion - Procedure date ("spr_limbperf_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_limbperf_set", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_oth", "spr_limbperf_date", 0, ">"],
		vars:["spr_limbperf_set", "spr_surg_date_oth", "spr_limbperf_date"]
	}
,
	{
		name:'dq_8_91',
		desc:'Isolated limb perfusion Setting Definitive ("spr_limbperf_set")=4 - Procedure date ("spr_limbperf_date") must be subsequent to Date of progression ("spr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_limbperf_set", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_limbperf_date", "spr_date", 0, ">"],
		vars:["spr_limbperf_set", "spr_limbperf_date", "spr_date"]
	}
,
	{
		name:'dq_8_92',
		desc:'Lung - Local ablative techniques - Procedure date ("spr_abla_date_lung") must be subsequent to Date of progression ("spr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["spr_abla_date_lung", "spr_date", 0, ">"],
		vars:["spr_abla_date_lung", "spr_date"]
	}
,
	{
		name:'dq_8_93',
		desc:'Lung - Local ablative techniques Setting Preoperative ("spr_abla_set_lung")=1 - Lung - Date of surgery ("spr_surg_date_lung") must be subsequent to Lung - Local ablative techniques - Procedure date ("spr_abla_date_lung")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_abla_set_lung", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_lung", "spr_abla_date_lung", 0, ">"],
		vars:["spr_abla_set_lung", "spr_surg_date_lung", "spr_abla_date_lung"]
	}
,
	{
		name:'dq_8_94',
		desc:'Lung - Local ablative techniques - Setting Definitive ("spr_abla_set_lung")=4 - Lung - Local ablative techniques - Procedure date ("spr_abla_date_lung") must be subsequent to Date of progression ("spr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_abla_set_lung", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_abla_date_lung", "spr_date", 0, ">"],
		vars:["spr_abla_set_lung", "spr_abla_date_lung", "spr_date"]
	}
,
	{
		name:'dq_8_95',
		desc:'Liver - Local ablative techniques - Procedure date ("spr_abla_date_liv") must be subsequent to Date of progression ("spr_date")',
		prec:null,
		precParams:[null],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_abla_date_liver", "spr_date", 0, ">"],
		vars:["spr_abla_date_liver", "spr_date"]
	}
,
	{
		name:'dq_8_96',
		desc:'Liver - Local ablative techniques Setting Preoperative ("spr_abla_set_liv"))=1 - Liver - Date of surgery ("spr_surg_date_liv") must be subsequent to Liver - Local ablative techniques - Procedure date ("spr_abla_date_liv")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_abla_set_liver", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_liver", "spr_abla_date_liver", 0, ">"],
		vars:["spr_abla_set_liver", "spr_surg_date_liver", "spr_abla_date_liver"]
	}
,
	{
		name:'dq_8_97',
		desc:'Liver - Local ablative techniques - Setting Definitive ("spr_abla_set_liv")=4 - Liver - Local ablative techniques - Procedure date ("spr_abla_date_liv") must be subsequent to Date of progression ("spr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_abla_set_liver", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_abla_date_liver", "spr_date", 0, ">"],
		vars:["spr_abla_set_liver", "spr_abla_date_liver", "spr_date"]
	}
,
	{
		name:'dq_8_98',
		desc:'Bone - Local ablative techniques - Procedure date ("spr_abla_date_bone") must be subsequent to Date of progression ("spr_date")',
		prec:null,
		precParams:[null],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_abla_date_bone", "spr_date", 0, ">"],
		vars:["spr_abla_date_bone", "spr_date"]
	}
,
	{
		name:'dq_8_99',
		desc:'Bone - Local ablative techniques Setting Preoperative ("spr_abla_set_bone")=1 - Bone - Date of surgery ("spr_surg_date_bone") must be subsequent to Bone - Local ablative techniques - Procedure date ("spr_abla_date_bone")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_abla_set_bone", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_bone", "spr_abla_date_bone", 0, ">"],
		vars:["spr_abla_set_bone", "spr_surg_date_bone", "spr_abla_date_bone"]
	}
,
	{
		name:'dq_8_100',
		desc:'Bone - Local ablative techniques - Setting Definitive ("spr_abla_set_bone")=4 - Bone - Local ablative techniques - Procedure date ("spr_abla_date_bone") must be subsequent to Date of progression ("spr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_abla_set_bone", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_abla_date_bone", "spr_date", 0, ">"],
		vars:["spr_abla_set_bone", "spr_abla_date_bone", "spr_date"]
	}
,
	{
		name:'dq_8_101',
		desc:'Soft tissues - Local ablative techniques - Procedure date ("spr_abla_date_soft") must be subsequent to Date of progression ("spr_date")',
		prec:null,
		precParams:[null],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_abla_date_soft", "spr_date", 0, ">"],
		vars:["spr_abla_date_soft", "spr_date"]
	}
,
	{
		name:'dq_8_102',
		desc:'Soft tissues - Local ablative techniques Setting Preoperative ("spr_abla_set_soft")=1 - Soft tissues - Date of surgery ("spr_surg_date_soft") must be subsequent to Soft tissues - Local ablative techniques - Procedure date ("spr_abla_date_soft")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_abla_set_soft", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_soft", "spr_abla_date_soft", 0, ">"],
		vars:["spr_abla_set_soft", "spr_surg_date_soft", "spr_abla_date_soft"]
	}
,
	{
		name:'dq_8_103',
		desc:'Soft tissues - Local ablative techniques - Setting Definitive ("spr_abla_set_soft")=4 - Soft tissues - Local ablative techniques - Procedure date ("spr_abla_date_soft") must be subsequent to Date of progression ("spr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_abla_set_soft", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_abla_date_soft", "spr_date", 0, ">"],
		vars:["spr_abla_set_soft", "spr_abla_date_soft", "spr_date"]
	}
,
	{
		name:'dq_8_104',
		desc:'Lymph nodes - Local ablative techniques - Procedure date ("spr_abla_date_lymph") must be subsequent to Date of progression ("spr_date")',
		prec:null,
		precParams:[null],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_abla_date_lymph", "spr_date", 0, ">"],
		vars:["spr_abla_date_lymph", "spr_date"]
	}
,
	{
		name:'dq_8_105',
		desc:'Lymph nodes - Local ablative techniques Setting Preoperative ("spr_abla_set_lymph")=1 - Lymph nodes - Date of surgery ("spr_surg_date_lymph") must be subsequent to Lymph nodes - Local ablative techniques - Procedure date ("spr_abla_date_lymph")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_abla_set_lymph", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_lymph", "spr_abla_date_lymph", 0, ">"],
		vars:["spr_abla_set_lymph", "spr_surg_date_lymph", "spr_abla_date_lymph"]
	}
,
	{
		name:'dq_8_106',
		desc:'Lymph nodes - Local ablative techniques - Setting Definitive ("spr_abla_set_lymph")=4 - Lymph nodes - Local ablative techniques - Procedure date ("spr_abla_date_lymph") must be subsequent to Date of progression ("spr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_abla_set_lymph", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_abla_date_lymph", "spr_date", 0, ">"],
		vars:["spr_abla_set_lymph", "spr_abla_date_lymph", "spr_date"]
	}
,
	{
		name:'dq_8_107',
		desc:'Serosal - Local ablative techniques - Procedure date ("spr_abla_date_serosal") must be subsequent to Date of progression ("spr_date")',
		prec:null,
		precParams:[null],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_abla_date_serosal", "spr_date", 0, ">"],
		vars:["spr_abla_date_serosal", "spr_date"]
	}
,
	{
		name:'dq_8_108',
		desc:'Serosal - Local ablative techniques Setting Preoperative ("spr_abla_set_serosal")=1 - Serosal - Date of surgery ("spr_surg_date_sero") must be subsequent to Serosal - Local ablative techniques - Procedure date ("spr_abla_date_serosal")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_abla_set_serosal", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_serosal", "spr_abla_date_serosal", 0, ">"],
		vars:["spr_abla_set_serosal", "spr_surg_date_serosal", "spr_abla_date_serosal"]
	}
,
	{
		name:'dq_8_109',
		desc:'Serosal - Local ablative techniques - Setting Definitive ("spr_abla_set_serosal")=4 - Serosal - Local ablative techniques - Procedure date ("spr_abla_date_serosal") must be subsequent to Date of progression ("spr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_abla_set_serosal", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_abla_date_serosal", "spr_date", 0, ">"],
		vars:["spr_abla_set_serosal", "spr_abla_date_serosal", "spr_date"]
	}
,
	{
		name:'dq_8_110',
		desc:'Other - Local ablative techniques - Procedure date ("spr_abla_date_oth") must be subsequent to Date of progression ("spr_date")',
		prec:null,
		precParams:[null],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_abla_date_oth", "spr_date", 0, ">"],
		vars:["spr_abla_date_oth", "spr_date"]
	}
,
	{
		name:'dq_8_111',
		desc:'Other - Local ablative techniques Setting Preoperative ("spr_abla_set_oth")=1 - Other - Date of surgery ("spr_surg_date_oth") must be subsequent to Other - Local ablative techniques - Procedure date ("spr_abla_date_oth")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_abla_set_oth", 1]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_oth", "spr_abla_date_oth", 0, ">"],
		vars:["spr_abla_set_oth", "spr_surg_date_oth", "spr_abla_date_oth"]
	}
,
	{
		name:'dq_8_112',
		desc:'Other - Local ablative techniques - Setting Definitive ("spr_abla_set_oth")=4 - Other - Local ablative techniques - Procedure date ("spr_abla_date_oth") must be subsequent to Date of progression ("spr_date")',
		prec:multiVarHasValueRepInstr,
		precParams:[[["spr_abla_set_oth", 4]]],
		func:dateCompareWithDeltaRepInstr,
		params:["spr_abla_date_oth", "spr_date", 0, ">"],
		vars:["spr_abla_set_oth", "spr_abla_date_oth", "spr_date"]
	}
,
	{
		name:'dq_8_113',
		desc:'Lung - Date of surgery ("spr_surg_date_lung") must be subsequent to Date of progression ("spr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_lung", "spr_date", 0, ">"],
		vars:["spr_surg_date_lung", "spr_date"]
	}
,
	{
		name:'dq_8_114',
		desc:'Liver - Date of surgery ("spr_surg_date_liver") must be subsequent to Date of progression ("spr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_liver", "spr_date", 0, ">"],
		vars:["spr_surg_date_liver", "spr_date"]
	}
,
	{
		name:'dq_8_115',
		desc:'Bone - Date of surgery ("spr_surg_date_bone") must be subsequent to Date of progression ("spr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_bone", "spr_date", 0, ">"],
		vars:["spr_surg_date_bone", "spr_date"]
	}
,
	{
		name:'dq_8_116',
		desc:'Soft tissues - Date of surgery ("spr_surg_date_soft") must be subsequent to Date of progression ("spr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_soft", "spr_date", 0, ">"],
		vars:["spr_surg_date_soft", "spr_date"]
	}
,
	{
		name:'dq_8_117',
		desc:'Lymph nodes - Date of surgery ("spr_surg_date_lymph") must be subsequent to Date of progression ("spr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_lymph", "spr_date", 0, ">"],
		vars:["spr_surg_date_lymph", "spr_date"]
	}
,
	{
		name:'dq_8_118',
		desc:'Serosal - Date of surgery ("spr_surg_date_serosal") must be subsequent to Date of progression ("spr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_serosal", "spr_date", 0, ">"],
		vars:["spr_surg_date_serosal", "spr_date"]
	}
,
	{
		name:'dq_8_119',
		desc:'Other - Date of surgery ("spr_surg_date_oth") must be subsequent to Date of progression ("spr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["spr_surg_date_oth", "spr_date", 0, ">"],
		vars:["spr_surg_date_oth", "spr_date"]
	}
,
	{
		name:'dq_8_120',
		desc:'Lung - Size of pathological specimen ("spr_surg_specsize_lung") must be between 1 and 300',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["spr_surg_specsize_lung", 1, 300],
		vars:["spr_surg_specsize_lung"]
	}
,
	{
		name:'dq_8_121',
		desc:'Liver - Size of pathological specimen ("spr_surg_specsize_liver") must be between 1 and 300',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["spr_surg_specsize_liver", 1, 300],
		vars:["spr_surg_specsize_liver"]
	}
,
	{
		name:'dq_8_122',
		desc:'Bone - Size of pathological specimen ("spr_surg_specsize_bone") must be between 1 and 300',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["spr_surg_specsize_bone", 1, 300],
		vars:["spr_surg_specsize_bone"]
	}
,
	{
		name:'dq_8_123',
		desc:'Soft tissues - Size of pathological specimen ("spr_surg_specsize_soft") must be between 1 and 300',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["spr_surg_specsize_soft", 1, 300],
		vars:["spr_surg_specsize_soft"]
	}
,
	{
		name:'dq_8_124',
		desc:'Lymph nodes - Size of pathological specimen ("spr_surg_specsize_lymph") must be between 1 and 300',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["spr_surg_specsize_lymph", 1, 300],
		vars:["spr_surg_specsize_lymph"]
	}
,
	{
		name:'dq_8_125',
		desc:'Serosal - Size of pathological specimen ("spr_surg_specsize_serosal") must be between 1 and 300',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["spr_surg_specsize_serosal", 1, 300],
		vars:["spr_surg_specsize_serosal"]
	}
,
	{
		name:'dq_8_126',
		desc:'Other - Size of pathological specimen ("spr_surg_specsize_oth") must be between 1 and 300',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["spr_surg_specsize_oth", 1, 300],
		vars:["spr_surg_specsize_oth"]
	}
,
	{
		name:'dq_8_127',
		desc:'Date of progressive site pathological diagnosis ("spr_pathol_date") must be subsequent to Date of progression ("spr_date")',
		prec:null,
		precParams:null,
		func:dateCompareWithDeltaRepInstr,
		params:["spr_pathol_date", "spr_date", 0, ">"],
		vars:["spr_pathol_date", "spr_date"]
	}
,
	{
		name:'dq_8_128',
		desc:'Mitotic index value ("spr_pathol_prog_mito") must be between 1 and 99',
		prec:null,
		precParams:null,
		func:varWithinIntervalRepInstr,
		params:["spr_pathol_prog_mito", 1, 99],
		vars:["spr_pathol_prog_mito"]
	}
,
	{
		name:'dq_8_129',
		desc:'Date of death ("spr_dod") must be subsequent to Date of registration ("bl_dor")',
		prec:null,
		precParams:null,
		func:uniqueDateCompareToFixedDateRepInstr,
		params:["spr_dod", "bl_dor", 0, ">=", 1],
		vars:["spr_dod", "bl_dor"]
	}
,
	{
		name:'dq_9_1',
		desc:'Life Status Update ("lsu_status") = 1, Alive: no evidence of disease OR 3, Dead: no evidence of disease - Baseline - Overall best radiological response per RECIST 1.1 ("bl_123_sys_ther_br_recist") <> 2, PD',
		prec:multiVarHasValueOR,
		precParams:[["lsu_status", 1], ["lsu_status", 3]],
		func:varHasValue,
		params:["bl_123_sys_ther_br_recist", 2, "!="],
		vars:["lsu_status", "bl_123_sys_ther_br_recist"]
	}
,
	{
		name:'dq_9_2',
		desc:'Life Status Update ("lsu_status") = 1, Alive: no evidence of disease OR 3, Dead: no evidence of disease - Baseline - Overall best radiological response ("bl_123_sys_ther_br") <> 2, PD',
		prec:multiVarHasValueOR,
		precParams:[["lsu_status", 1], ["lsu_status", 3]],
		func:varHasValue,
		params:["bl_123_sys_ther_br", 2, "!="],
		vars:["lsu_status", "bl_123_sys_ther_br"]
	}
,
	{
		name:'dq_9_3',
		desc:'Life Status Update ("lsu_status") = 1, Alive: no evidence of disease OR 3, Dead: no evidence of disease - Unifocal Follow Up - Surveillance - Overall best radiological response per RECIST 1.1 ("ufu_surveil_br_recist") <> 2, PD',
		prec:multiVarHasValueOR,
		precParams:[["lsu_status", 1], ["lsu_status", 3]],
		func:varHasValueRepInstr,
		params:["ufu_surveil_br_recist", 2, "!="],
		vars:["lsu_status", "ufu_surveil_br_recist"]
	}
,
	{
		name:'dq_9_4',
		desc:'Life Status Update ("lsu_status") = 1, Alive: no evidence of disease OR 3, Dead: no evidence of disease - Unifocal Follow Up - Surveillance - Overall best radiological response ("ufu_surveil_br") <> 2, PD',
		prec:multiVarHasValueOR,
		precParams:[["lsu_status", 1], ["lsu_status", 3]],
		func:varHasValueRepInstr,
		params:["ufu_surveil_br", 2, "!="],
		vars:["lsu_status", "ufu_surveil_br"]
	}
,
	{
		name:'dq_9_5',
		desc:'Life Status Update ("lsu_status") = 1, Alive: no evidence of disease OR 3, Dead: no evidence of disease - Unifocal Follow Up - Systemic therapy - Overall best radiological response per RECIST 1.1 ("ufu_sys_ther_br_recist") <> 2, PD',
		prec:multiVarHasValueOR,
		precParams:[["lsu_status", 1], ["lsu_status", 3]],
		func:varHasValueRepInstr,
		params:["ufu_sys_ther_br_recist", 2, "!="],
		vars:["lsu_status", "ufu_sys_ther_br_recist"]
	}
,
	{
		name:'dq_9_6',
		desc:'Life Status Update ("lsu_status") = 1, Alive: no evidence of disease OR 3, Dead: no evidence of disease - Unifocal Follow Up -  Systemic therapy - Overall best radiological response ("ufu_sys_ther_br") <> 2, PD',
		prec:multiVarHasValueOR,
		precParams:[["lsu_status", 1], ["lsu_status", 3]],
		func:varHasValueRepInstr,
		params:["ufu_sys_ther_br", 2, "!="],
		vars:["lsu_status", "ufu_sys_ther_br"]
	}
,
	{
		name:'dq_9_7',
		desc:'Life Status Update ("lsu_status") = 1, Alive: no evidence of disease OR 3, Dead: no evidence of disease - Unifocal Local Recurrence - Surveillance - Overall best radiological response per RECIST 1.1 ("ulr_surveil_br_recist") <> 2, PD',
		prec:multiVarHasValueOR,
		precParams:[["lsu_status", 1], ["lsu_status", 3]],
		func:varHasValueRepInstr,
		params:["ulr_surveil_br_recist", 2, "!="],
		vars:["lsu_status", "ulr_surveil_br_recist"]
	}
,
	{
		name:'dq_9_8',
		desc:'Life Status Update ("lsu_status") = 1, Alive: no evidence of disease OR 3, Dead: no evidence of disease - Unifocal Local Recurrence - Surveillance - Overall best radiological response ("ulr_surveil_br") <> 2, PD',
		prec:multiVarHasValueOR,
		precParams:[["lsu_status", 1], ["lsu_status", 3]],
		func:varHasValueRepInstr,
		params:["ulr_surveil_br", 2, "!="],
		vars:["lsu_status", "ulr_surveil_br"]
	}
,
	{
		name:'dq_9_9',
		desc:'Life Status Update ("lsu_status") = 1, Alive: no evidence of disease OR 3, Dead: no evidence of disease - Unifocal Local Recurrence - Systemic therapy - Overall best radiological response per RECIST 1.1 ("ulr_sys_ther_br_recist") <> 2, PD',
		prec:multiVarHasValueOR,
		precParams:[["lsu_status", 1], ["lsu_status", 3]],
		func:varHasValueRepInstr,
		params:["ulr_sys_ther_br_recist", 2, "!="],
		vars:["lsu_status", "ulr_sys_ther_br_recist"]
	}
,
	{
		name:'dq_9_10',
		desc:'Life Status Update ("lsu_status") = 1, Alive: no evidence of disease OR 3, Dead: no evidence of disease - Unifocal Local Recurrence - Systemic therapy- Overall best radiological response ("ulr_sys_ther_br") <> 2, PD',
		prec:multiVarHasValueOR,
		precParams:[["lsu_status", 1], ["lsu_status", 3]],
		func:varHasValueRepInstr,
		params:["ulr_sys_ther_br", 2, "!="],
		vars:["lsu_status", "ulr_sys_ther_br"]
	}
,
	{
		name:'dq_9_11',
		desc:'Life Status Update ("lsu_status") = 1, Alive: no evidence of disease OR 3, Dead: no evidence of disease - Unifocal Distant Metastases - Surveillance - Overall best radiological response per RECIST 1.1 ("udm_surveil_br_recist") <> 2, PD',
		prec:multiVarHasValueOR,
		precParams:[["lsu_status", 1], ["lsu_status", 3]],
		func:varHasValue,
		params:["udm_surveil_br_recist", 2, "!="],
		vars:["lsu_status", "udm_surveil_br_recist"]
	}
,
	{
		name:'dq_9_12',
		desc:'Life Status Update ("lsu_status") = 1, Alive: no evidence of disease OR 3, Dead: no evidence of disease - Unifocal Distant Metastases - Surveillance - Overall best radiological response ("udm_surveil_br") <> 2, PD',
		prec:multiVarHasValueOR,
		precParams:[["lsu_status", 1], ["lsu_status", 3]],
		func:varHasValue,
		params:["udm_surveil_br", 2, "!="],
		vars:["lsu_status", "udm_surveil_br"]
	}
,
	{
		name:'dq_9_13',
		desc:'Life Status Update ("lsu_status") = 1, Alive: no evidence of disease OR 3, Dead: no evidence of disease - Unifocal Distant Metastases - Systemic therapy - Overall best radiological response per RECIST 1.1 ("udm_sys_ther_br_recist") <> 2, PD',
		prec:multiVarHasValueOR,
		precParams:[["lsu_status", 1], ["lsu_status", 3]],
		func:varHasValue,
		params:["udm_sys_ther_br_recist", 2, "!="],
		vars:["lsu_status", "udm_sys_ther_br_recist"]
	}
,
	{
		name:'dq_9_14',
		desc:'Life Status Update ("lsu_status") = 1, Alive: no evidence of disease OR 3, Dead: no evidence of disease - Unifocal Distant Metastases - Systemic therapy - Overall best radiological response ("udm_sys_ther_br") <> 2, PD',
		prec:multiVarHasValueOR,
		precParams:[["lsu_status", 1], ["lsu_status", 3]],
		func:varHasValue,
		params:["udm_sys_ther_br", 2, "!="],
		vars:["lsu_status", "udm_sys_ther_br"]
	}
,
	{
		name:'dq_9_15',
		desc:'Life Status Update ("lsu_status") = 1, Alive: no evidence of disease OR 3, Dead: no evidence of disease - Locoregional Follow Up - Surveillance - Overall best radiological response per RECIST 1.1 ("lfu_surveil_br_recist") <> 2, PD',
		prec:multiVarHasValueOR,
		precParams:[["lsu_status", 1], ["lsu_status", 3]],
		func:varHasValueRepInstr,
		params:["lfu_surveil_br_recist", 2, "!="],
		vars:["lsu_status", "lfu_surveil_br_recist"]
	}
,
	{
		name:'dq_9_16',
		desc:'Life Status Update ("lsu_status") = 1, Alive: no evidence of disease OR 3, Dead: no evidence of disease - Locoregional Follow Up - Surveillance - Overall best radiological response ("lfu_surveil_br") <> 2, PD',
		prec:multiVarHasValueOR,
		precParams:[["lsu_status", 1], ["lsu_status", 3]],
		func:varHasValueRepInstr,
		params:["lfu_surveil_br", 2, "!="],
		vars:["lsu_status", "lfu_surveil_br"]
	}
,
	{
		name:'dq_9_17',
		desc:'Life Status Update ("lsu_status") = 1, Alive: no evidence of disease OR 3, Dead: no evidence of disease - Locoregional Follow Up - Systemic therapy - Overall best radiological response per RECIST 1.1 ("lfu_sys_ther_br_recist") <> 2, PD',
		prec:multiVarHasValueOR,
		precParams:[["lsu_status", 1], ["lsu_status", 3]],
		func:varHasValueRepInstr,
		params:["lfu_sys_ther_br_recist", 2, "!="],
		vars:["lsu_status", "lfu_sys_ther_br_recist"]
	}
,
	{
		name:'dq_9_18',
		desc:'Life Status Update ("lsu_status") = 1, Alive: no evidence of disease OR 3, Dead: no evidence of disease - Locoregional Follow Up - Systemic therapy - Overall best radiological response ("lfu_sys_ther_br") <> 2, PD',
		prec:multiVarHasValueOR,
		precParams:[["lsu_status", 1], ["lsu_status", 3]],
		func:varHasValueRepInstr,
		params:["lfu_sys_ther_br", 2, "!="],
		vars:["lsu_status", "lfu_sys_ther_br"]
	}
,
	{
		name:'dq_9_19',
		desc:'Life Status Update ("lsu_status") = 1, Alive: no evidence of disease OR 3, Dead: no evidence of disease - Locoregional Progression - Surveillance - Overall best radiological response per RECIST 1.1 ("spr_surveil_br_recist") <> 2, PD',
		prec:multiVarHasValueOR,
		precParams:[["lsu_status", 1], ["lsu_status", 3]],
		func:varHasValueRepInstr,
		params:["spr_surveil_br_recist", 2, "!="],
		vars:["lsu_status", "spr_surveil_br_recist"]
	}
,
	{
		name:'dq_9_20',
		desc:'Life Status Update ("lsu_status") = 1, Alive: no evidence of disease OR 3, Dead: no evidence of disease - Locoregional Progression - Surveillance - Overall best radiological response ("spr_surveil_br") <> 2, PD',
		prec:multiVarHasValueOR,
		precParams:[["lsu_status", 1], ["lsu_status", 3]],
		func:varHasValueRepInstr,
		params:["spr_surveil_br", 2, "!="],
		vars:["lsu_status", "spr_surveil_br"]
	}
,
	{
		name:'dq_9_21',
		desc:'Life Status Update ("lsu_status") = 1, Alive: no evidence of disease OR 3, Dead: no evidence of disease - Locoregional Progression - Systemic therapy - Overall best radiological response per RECIST 1.1 ("spr_sys_ther_br_recist") <> 2, PD',
		prec:multiVarHasValueOR,
		precParams:[["lsu_status", 1], ["lsu_status", 3]],
		func:varHasValueRepInstr,
		params:["spr_sys_ther_br_recist", 2, "!="],
		vars:["lsu_status", "spr_sys_ther_br_recist"]
	}
,
	{
		name:'dq_9_22',
		desc:'Life Status Update ("lsu_status") = 1, Alive: no evidence of disease OR 3, Dead: no evidence of disease - Locoregional Progression - Systemic therapy - Overall best radiological response ("spr_sys_ther_br") <> 2, PD',
		prec:multiVarHasValueOR,
		precParams:[["lsu_status", 1], ["lsu_status", 3]],
		func:varHasValueRepInstr,
		params:["spr_sys_ther_br", 2, "!="],
		vars:["lsu_status", "spr_sys_ther_br"]
	}
,
	{
		name:'dq_9_23',
		desc:'Life Status Update ("lsu_status") = 1, Alive: no evidence of disease OR 3, Dead: no evidence of disease - Systemic Metastases Follow Up - Surveillance - Overall best radiological response per RECIST 1.1 ("sfu_surveil_br_recist") <> 2, PD',
		prec:multiVarHasValueOR,
		precParams:[["lsu_status", 1], ["lsu_status", 3]],
		func:varHasValue,
		params:["sfu_surveil_br_recist", 2, "!="],
		vars:["lsu_status", "sfu_surveil_br_recist"]
	}
,
	{
		name:'dq_9_24',
		desc:'Life Status Update ("lsu_status") = 1, Alive: no evidence of disease OR 3, Dead: no evidence of disease - Systemic Metastases Follow Up - Surveillance - Overall best radiological response ("sfu_surveil_br") <> 2, PD',
		prec:multiVarHasValueOR,
		precParams:[["lsu_status", 1], ["lsu_status", 3]],
		func:varHasValue,
		params:["sfu_surveil_br", 2, "!="],
		vars:["lsu_status", "sfu_surveil_br"]
	}
,
	{
		name:'dq_9_25',
		desc:'Life Status Update ("lsu_status") = 1, Alive: no evidence of disease OR 3, Dead: no evidence of disease - Systemic Metastases Follow Up - Systemic therapy - Overall best radiological response per RECIST 1.1 ("sfu_sys_ther_br_recist") <> 2, PD',
		prec:multiVarHasValueOR,
		precParams:[["lsu_status", 1], ["lsu_status", 3]],
		func:varHasValue,
		params:["sfu_sys_ther_br_recist", 2, "!="],
		vars:["lsu_status", "sfu_sys_ther_br_recist"]
	}
,
	{
		name:'dq_9_26',
		desc:'Life Status Update ("lsu_status") = 1, Alive: no evidence of disease OR 3, Dead: no evidence of disease - Systemic Metastases Follow Up - Systemic therapy - Overall best radiological response ("sfu_sys_ther_br") <> 2, PD',
		prec:multiVarHasValueOR,
		precParams:[["lsu_status", 1], ["lsu_status", 3]],
		func:varHasValue,
		params:["sfu_sys_ther_br", 2, "!="],
		vars:["lsu_status", "sfu_sys_ther_br"],
	}

];
