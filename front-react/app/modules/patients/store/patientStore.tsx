import { create } from "zustand";
import { Patient, PatientState, DocumentType, Gender, Department, Municipality } from "../interfaces";

export const usePatientStore = create<PatientState>((set) => ({
  patients: [] as Patient[],
  pagination: null,
  documentTypes: [] as DocumentType[],
  genders: [] as Gender[],
  departments: [] as Department[],
  municipalities: [] as Municipality[],
  setPatients: (patients) => set({ patients }),
  setPagination: (pagination) => set({ pagination }),
  setDocumentTypes: (documentTypes) => set({ documentTypes }),
  setGenders: (genders) => set({ genders }),
  setDepartments: (departments) => set({ departments }),
  setMunicipalities: (municipalities) => set({ municipalities }),
}));