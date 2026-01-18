import type { DashboardProfessorsResponse } from "../../types";
import styles from "./ProfessorUsageList.module.css";

interface ProfessorUsageListProps {
  data: DashboardProfessorsResponse | null;
}

export function ProfessorUsageList({ data }: ProfessorUsageListProps) {
  if (!data) {
    return null;
  }

  const maxCageCount = Math.max(...data.professors.map((p) => p.cage_count), 1);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>교수별 사용 현황</h3>
      </div>

      {data.professors.length === 0 ? (
        <div className={styles.empty}>등록된 교수가 없습니다.</div>
      ) : (
        <div className={styles.list}>
          {data.professors.map((professor) => (
            <div key={professor.professor_id} className={styles.item}>
              <div
                className={styles.colorDot}
                style={{ backgroundColor: professor.color_code }}
              />
              <span className={styles.professorName}>{professor.professor_name}</span>
              <div className={styles.barContainer}>
                <div
                  className={styles.bar}
                  style={{
                    backgroundColor: professor.color_code,
                    width: `${(professor.cage_count / maxCageCount) * 100}%`,
                    opacity: professor.cage_count === 0 ? 0.3 : 1,
                  }}
                />
                <span className={styles.barLabel}>{professor.cage_count}개</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
