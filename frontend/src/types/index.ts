export interface Professor {
  id: number;
  name: string;
  student_name: string | null;
  contact: string | null;
  color_code: string;
  assigned_count: number;
}

export interface ProfessorCreate {
  name: string;
  student_name?: string | null;
  contact?: string | null;
  color_code?: string;
}

export interface ProfessorUpdate {
  name?: string;
  student_name?: string | null;
  contact?: string | null;
  color_code?: string;
}

export interface ProfessorActionResponse {
  success: boolean;
  message: string;
  professor: Professor | null;
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
  assigned_count: number;
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

export interface RackSummary {
  rack_id: number;
  rack_name: string;
  total_cages: number;
  used_cages: number;
  available_cages: number;
  usage_rate: number;
}

export interface DashboardSummaryResponse {
  total_racks: number;
  total_cages: number;
  total_used: number;
  total_available: number;
  overall_usage_rate: number;
  racks: RackSummary[];
}

export interface ProfessorUsage {
  professor_id: number;
  professor_name: string;
  color_code: string;
  cage_count: number;
}

export interface DashboardProfessorsResponse {
  professors: ProfessorUsage[];
}

export interface DailyCost {
  date: string;
  professor_id: number;
  professor_name: string;
  color_code: string;
  cage_count: number;
  cost: number;
}

export interface ProfessorCostSummary {
  professor_id: number;
  professor_name: string;
  color_code: string;
  total_cage_days: number;
  total_cost: number;
}

export interface DashboardCostsResponse {
  period: string;
  start_date: string;
  end_date: string;
  cost_per_cage_day: number;
  total_cost: number;
  daily_costs: DailyCost[];
  professor_summaries: ProfessorCostSummary[];
}

export type CostPeriod = "daily" | "weekly" | "monthly";
