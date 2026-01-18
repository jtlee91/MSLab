import { RackSettings, ProfessorSettings } from "../components/settings";
import styles from "./SettingsPage.module.css";

export default function SettingsPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>설정</h1>

      <div className={styles.sections}>
        <RackSettings />
        <ProfessorSettings />
      </div>
    </div>
  );
}
