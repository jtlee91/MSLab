import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { DashboardCostsResponse, CostPeriod } from "../../types";
import styles from "./CostChart.module.css";

interface CostChartProps {
  data: DashboardCostsResponse | null;
  period: CostPeriod;
  onPeriodChange: (period: CostPeriod) => void;
}

export function CostChart({ data, period, onPeriodChange }: CostChartProps) {
  const formatCost = (cost: number) => {
    return cost.toLocaleString("ko-KR") + "원";
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const periodLabels: Record<CostPeriod, string> = {
    daily: "일별 (7일)",
    weekly: "주별 (4주)",
    monthly: "월별 (3개월)",
  };

  const prepareChartData = () => {
    if (!data) return [];

    const dateMap = new Map<string, Record<string, number>>();
    const professorIds = new Set<number>();

    data.daily_costs.forEach((cost) => {
      professorIds.add(cost.professor_id);
      const existing = dateMap.get(cost.date) || {};
      existing[`professor_${cost.professor_id}`] = cost.cost;
      dateMap.set(cost.date, existing);
    });

    return Array.from(dateMap.entries()).map(([date, costs]) => ({
      date,
      dateLabel: formatDate(date),
      ...costs,
    }));
  };

  const chartData = prepareChartData();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>비용 현황</h3>
          {data && (
            <div className={styles.dateRange}>
              {data.start_date} ~ {data.end_date}
            </div>
          )}
        </div>
        <div className={styles.periodButtons}>
          {(["daily", "weekly", "monthly"] as CostPeriod[]).map((p) => (
            <button
              key={p}
              className={`${styles.periodButton} ${period === p ? styles.periodButtonActive : ""}`}
              onClick={() => onPeriodChange(p)}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      {!data || chartData.length === 0 ? (
        <div className={styles.empty}>해당 기간에 비용 데이터가 없습니다.</div>
      ) : (
        <>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="dateLabel"
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  axisLine={{ stroke: "#E5E7EB" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    const professor = data.professor_summaries.find(
                      (p) => `professor_${p.professor_id}` === name
                    );
                    return [formatCost(value), professor?.professor_name || name];
                  }}
                  labelFormatter={(label) => `날짜: ${label}`}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  formatter={(value: string) => {
                    const professor = data.professor_summaries.find(
                      (p) => `professor_${p.professor_id}` === value
                    );
                    return professor?.professor_name || value;
                  }}
                />
                {data.professor_summaries.map((professor) => (
                  <Bar
                    key={professor.professor_id}
                    dataKey={`professor_${professor.professor_id}`}
                    stackId="a"
                    fill={professor.color_code}
                    name={`professor_${professor.professor_id}`}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.summarySection}>
            <div className={styles.summaryTitle}>교수별 비용 요약</div>
            <div className={styles.summaryGrid}>
              {data.professor_summaries.map((professor) => (
                <div key={professor.professor_id} className={styles.summaryItem}>
                  <div
                    className={styles.summaryColor}
                    style={{ backgroundColor: professor.color_code }}
                  />
                  <div className={styles.summaryInfo}>
                    <div className={styles.summaryName}>{professor.professor_name}</div>
                    <div className={styles.summaryCost}>
                      {formatCost(professor.total_cost)}
                      <span style={{ fontSize: "12px", color: "#6B7280", marginLeft: "4px" }}>
                        ({professor.total_cage_days}일)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.totalCost}>
              <span className={styles.totalLabel}>총 비용</span>
              <span className={styles.totalValue}>{formatCost(data.total_cost)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
