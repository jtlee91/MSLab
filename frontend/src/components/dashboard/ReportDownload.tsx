import { useState } from "react";
import { reportApi } from "../../services/api";
import styles from "./ReportDownload.module.css";

export function ReportDownload() {
  const today = new Date().toISOString().split("T")[0];
  const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(lastMonth);
  const [endDate, setEndDate] = useState(today);

  const handleDownload = () => {
    if (!startDate || !endDate) return;
    const url = reportApi.getDownloadUrl(startDate, endDate);
    window.open(url, "_blank");
  };

  const setPreset = (days: number) => {
    const end = new Date();
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  };

  const isValid = startDate && endDate && startDate <= endDate;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>📥 리포트 다운로드</h3>
      </div>

      <div className={styles.form}>
        <div className={styles.dateGroup}>
          <label className={styles.label}>시작일</label>
          <input
            type="date"
            className={styles.dateInput}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={endDate}
          />
        </div>

        <div className={styles.dateGroup}>
          <label className={styles.label}>종료일</label>
          <input
            type="date"
            className={styles.dateInput}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
            max={today}
          />
        </div>

        <button
          className={styles.downloadButton}
          onClick={handleDownload}
          disabled={!isValid}
        >
          <span className={styles.icon}>📄</span>
          Excel 다운로드
        </button>
      </div>

      <div className={styles.presetButtons}>
        <button className={styles.presetButton} onClick={() => setPreset(7)}>
          최근 7일
        </button>
        <button className={styles.presetButton} onClick={() => setPreset(30)}>
          최근 30일
        </button>
        <button className={styles.presetButton} onClick={() => setPreset(90)}>
          최근 90일
        </button>
      </div>

      <div className={styles.description}>
        <div className={styles.descriptionTitle}>📋 리포트 내용</div>
        <ul className={styles.descriptionList}>
          <li><strong>[요약]</strong> 시트: 교수별 사용 케이지 수 및 총 비용</li>
          <li><strong>[상세]</strong> 시트: 일별 케이지 사용 내역 (날짜, 랙, 위치, 교수, 비용)</li>
        </ul>
      </div>
    </div>
  );
}
