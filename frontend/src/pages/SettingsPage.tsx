import { RackSettings } from "../components/settings";
import styles from "./SettingsPage.module.css";

export default function SettingsPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>설정</h1>

      <div className={styles.sections}>
        <RackSettings />

        {/* Professor Settings - M3-4에서 구현 예정 */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>교수 관리</h3>
          <p className={styles.cardDescription}>교수 정보를 관리합니다.</p>
          <div className={styles.placeholder}>
            {[
              { name: "김교수", color: "#EF4444" },
              { name: "이교수", color: "#3B82F6" },
              { name: "박교수", color: "#10B981" },
            ].map((prof) => (
              <div key={prof.name} className={styles.professorItem}>
                <div
                  className={styles.professorColor}
                  style={{ backgroundColor: prof.color }}
                />
                {prof.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
