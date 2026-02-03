export interface DocumentType {
  id: number;
  code: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Gender {
  id: number;
  code: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: number;
  code: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Municipality {
  id: number;
  department_id: number;
  code: string;
  name: string;
  created_at: string;
  updated_at: string;
  department?: Department;
}

export interface Patient {
  id: number;
  document_type_id: number;
  document_number: string;
  first_name: string;
  second_name: string | null;
  first_surname: string;
  second_surname: string | null;
  gender_id: number;
  department_id: number;
  municipality_id: number;
  email: string;
  created_at: string;
  updated_at: string;
  document_type: DocumentType;
  gender: Gender;
  department: Department;
  municipality: Municipality;
  full_name?: string;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface PatientState {
  patients: Patient[];
  pagination: Omit<PaginatedResponse<Patient>, 'data'> | null;
  documentTypes: DocumentType[];
  genders: Gender[];
  departments: Department[];
  municipalities: Municipality[];
  setPatients: (patients: Patient[]) => void;
  setPagination: (pagination: Omit<PaginatedResponse<Patient>, 'data'>) => void;
  setDocumentTypes: (documentTypes: DocumentType[]) => void;
  setGenders: (genders: Gender[]) => void;
  setDepartments: (departments: Department[]) => void;
  setMunicipalities: (municipalities: Municipality[]) => void;
}