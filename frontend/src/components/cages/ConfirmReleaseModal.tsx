import type { Cage } from "../../types";
import { Modal, Button } from "../common";
import styles from "./ConfirmReleaseModal.module.css";

interface ConfirmReleaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  cage: Cage | null;
  onConfirm: () => void;
  loading?: boolean;
}

export default function ConfirmReleaseModal({
  isOpen,
  onClose,
  cage,
  onConfirm,
  loading = false,
}: ConfirmReleaseModalProps) {
  if (!cage) return null;

  const professor = cage.current_professor;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="사용 종료"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            취소
          </Button>
          <Button variant="primary" onClick={onConfirm} loading={loading}>
            종료
          </Button>
        </>
      }
    >
      <div className={styles.content}>
        <div className={styles.cageInfo}>
          <span
            className={styles.cageInfo__color}
            style={{ backgroundColor: professor?.color_code }}
          />
          <span className={styles.cageInfo__position}>{cage.position}</span>
          <span className={styles.cageInfo__professor}>{professor?.name}</span>
        </div>
        <p className={styles.message}>이 케이지의 사용을 종료하시겠어요?</p>
      </div>
    </Modal>
  );
}
