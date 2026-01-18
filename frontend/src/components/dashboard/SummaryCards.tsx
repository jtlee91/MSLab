import type { DashboardSummaryResponse } from "../../types";
import styles from "./SummaryCards.module.css";

interface SummaryCardsProps {
  data: DashboardSummaryResponse | null;
  todayCost: number;
}

export function SummaryCards({ data, todayCost }: SummaryCardsProps) {
  if (!data) {
    return null;
  }

  const formatCost = (cost: number) => {
    return cost.toLocaleString("ko-KR") + "원";
  };

  const getProgressClass = (rate: number) => {
    if (rate < 50) return styles.progressLow;
    if (rate < 80) return styles.progressMedium;
    return styles.progressHigh;
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={`${styles.icon} ${styles.iconTotal}`}>📦</div>
            <span className={styles.label}>전체 케이지</span>
          </div>
          <div className={styles.value}>{data.total_cages}</div>
          <div className={styles.subValue}>{data.total_racks}개 랙</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={`${styles.icon} ${styles.iconUsed}`}>✅</div>
            <span className={styles.label}>사용 중</span>
          </div>
          <div className={styles.value}>{data.total_used}</div>
          <div className={styles.subValue}>사용률 {data.overall_usage_rate}%</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={`${styles.icon} ${styles.iconAvailable}`}>⬜</div>
            <span className={styles.label}>빈 케이지</span>
          </div>
          <div className={styles.value}>{data.total_available}</div>
          <div className={styles.subValue}>사용 가능</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={`${styles.icon} ${styles.iconCost}`}>💰</div>
            <span className={styles.label}>오늘 비용</span>
          </div>
          <div className={styles.value}>{formatCost(todayCost)}</div>
          <div className={styles.subValue}>800원/케이지/일</div>
        </div>
      </div>

      <h3 style={{ marginBottom: "var(--spacing-md)" }}>랙별 현황</h3>
      <div className={styles.rackGrid}>
        {data.racks.map((rack) => (
          <div key={rack.rack_id} className={styles.rackCard}>
            <div className={styles.rackName}>{rack.rack_name}</div>
            <div className={styles.rackStats}>
              <div className={styles.statRow}>
                <span className={styles.statLabel}>전체</span>
                <span className={styles.statValue}>{rack.total_cages}개</span>
              </div>
              <div className={styles.statRow}>
                <span className={styles.statLabel}>사용 중</span>
                <span className={styles.statValue}>{rack.used_cages}개</span>
              </div>
              <div className={styles.statRow}>
                <span className={styles.statLabel}>사용 가능</span>
                <span className={styles.statValue}>{rack.available_cages}개</span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={`${styles.progressFill} ${getProgressClass(rack.usage_rate)}`}
                  style={{ width: `${rack.usage_rate}%` }}
                />
              </div>
              <div className={styles.statRow}>
                <span className={styles.statLabel}>사용률</span>
                <span className={styles.statValue}>{rack.usage_rate}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
