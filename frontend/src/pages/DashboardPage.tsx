import { useState, useEffect, useCallback } from "react";
import { dashboardApi } from "../services/api";
import { SummaryCards, ProfessorUsageList, ReportDownload } from "../components/dashboard";
import type {
  DashboardSummaryResponse,
  DashboardProfessorsResponse,
} from "../types";
import styles from "./DashboardPage.module.css";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [professors, setProfessors] = useState<DashboardProfessorsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [summaryData, professorsData] = await Promise.all([
        dashboardApi.getSummary(),
        dashboardApi.getProfessors(),
      ]);

      setSummary(summaryData);
      setProfessors(professorsData);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const calculateTodayCost = () => {
    if (!summary) return 0;
    return summary.total_used * 800;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <span className={styles.loadingText}>데이터를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <span className={styles.errorIcon}>⚠️</span>
          <span className={styles.errorMessage}>{error}</span>
          <button className={styles.retryButton} onClick={fetchData}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>대시보드</h1>
      </div>

      <div className={styles.section}>
        <SummaryCards data={summary} todayCost={calculateTodayCost()} />
      </div>

      <div className={styles.section}>
        <ProfessorUsageList data={professors} />
      </div>

      <div className={styles.section}>
        <ReportDownload />
      </div>
    </div>
  );
}
