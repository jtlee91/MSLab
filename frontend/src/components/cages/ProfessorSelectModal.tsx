import type { Professor, Cage } from "../../types";
import { Modal } from "../common";
import styles from "./ProfessorSelectModal.module.css";

interface ProfessorSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  cage: Cage | null;
  professors: Professor[];
  onSelect: (professor: Professor) => void;
}

export default function ProfessorSelectModal({
  isOpen,
  onClose,
  cage,
  professors,
  onSelect,
}: ProfessorSelectModalProps) {
  if (!cage) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${cage.position} 케이지 배정`}>
      <p className={styles.description}>배정할 교수를 선택하세요</p>
      <ul className={styles.professorList}>
        {professors.map((professor) => (
          <li key={professor.id}>
            <button
              className={styles.professorItem}
              onClick={() => onSelect(professor)}
              style={{ "--professor-color": professor.color_code } as React.CSSProperties}
            >
              <span
                className={styles.professorItem__color}
                style={{ backgroundColor: professor.color_code }}
              />
              <span className={styles.professorItem__name}>{professor.name}</span>
              {professor.student_name && (
                <span className={styles.professorItem__student}>{professor.student_name}</span>
              )}
            </button>
          </li>
        ))}
      </ul>
      {professors.length === 0 && (
        <p className={styles.emptyMessage}>등록된 교수가 없습니다. 설정에서 교수를 추가해주세요.</p>
      )}
    </Modal>
  );
}
