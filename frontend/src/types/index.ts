export interface Professor {
  id: number;
  name: string;
  student_name: string | null;
  contact: string | null;
  color_code: string;
}

export interface ProfessorInfo {
  id: number;
  name: string;
  color_code: string;
}

export interface Cage {
  id: number;
  rack_id: number;
  position: string;
  row_index: number;
  col_index: number;
  version: number;
  current_professor: ProfessorInfo | null;
}

export interface CageGridResponse {
  rack_id: number;
  rack_name: string;
  rows: number;
  columns: number;
  cages: Cage[];
}

export interface Rack {
  id: number;
  name: string;
  rows: number;
  columns: number;
  display_order: number;
}

export interface RackListResponse {
  racks: Rack[];
}

export interface RackCreate {
  name: string;
  rows: number;
  columns: number;
  display_order?: number;
}

export interface RackUpdate {
  name?: string;
  rows?: number;
  columns?: number;
  display_order?: number;
}

export interface RackActionResponse {
  success: boolean;
  message: string;
  rack: Rack | null;
}

export interface ProfessorListResponse {
  professors: Professor[];
}

export interface CageActionResponse {
  success: boolean;
  message: string;
  cage: Cage;
}

export interface AssignRequest {
  professor_id: number;
  version: number;
}

export interface ReleaseRequest {
  version: number;
}

export interface ApiError {
  status: number;
  message: string;
  isConflict: boolean;
}
