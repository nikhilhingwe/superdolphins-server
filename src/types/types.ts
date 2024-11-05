export type THTTPResponse = {
    success: boolean
    status: number
    request: {
        ip?: string | null
        method: string
        url: string
    }
    message: string
    data: unknown
}

export type THTTPError = {
    success: boolean
    status: number
    request: {
        ip?: string | null
        method: string
        url: string
    }
    message: string
    data: unknown
    trace?: object | null
}

export interface Applicant {
    id?: number 
    name: string
    email: string
    phone_no: string
    address?: string // Optional field
    department?: string // Optional field
    total_exp?: string
    current_ctc?: string
    expected_ctc?: string
    ctc_rate?: string
    cv?: string // Optional field (URL or file path)
    cover_letter?: string // Optional field (URL or file path)
    portfolio?: string,
    status?: string
}


// src/interfaces/JoiningForm.ts
export interface JoiningForm {
    id: number;
    full_name: string;
    gender: string;
    date_of_birth: Date;
    nationality: string;
    marital_status: string;
    permanent_address: string;
    current_address: string;
    telephone_number: string;
    email_address: string;
    emergency_contact_name: string;
    emergency_relationship: string;
    emergency_telephone: string;
    emergency_email: string;
    emergency_address: string;
    parent_name: string;
    parent_contact_number: string;
    parent_job_profile: string;
    parent_address: string;
    education_school_university: string;
    education_degree_diploma: string;
    education_year_of_graduation: number;
    previous_company: string;
    previous_position: string;
    previous_position_type: string;
    previous_dates_of_employment: string;
    previous_reason_for_leaving: string;
    bank_name: string;
    account_number: string;
    account_holder_name: string;
    bank_branch: string;
    blood_group: string;
    medical_conditions: string;
    medical_insurance: string;
    reference_name: string;
    reference_relationship: string;
    reference_telephone: string;
    reference_email: string;
    declaration_signature: string;
    declaration_date: Date;
    status: string;
}
