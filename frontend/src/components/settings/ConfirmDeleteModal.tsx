import { Modal, Button } from "../common";
import styles from "./ConfirmDeleteModal.module.css";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  itemName: string;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  title,
  itemName,
  onConfirm,
  loading = false,
}: ConfirmDeleteModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            취소
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            삭제
          </Button>
        </>
      }
    >
      <div className={styles.content}>
        <p className={styles.message}>
          <strong>"{itemName}"</strong>을(를) 삭제하시겠습니까?
        </p>
        <p className={styles.warning}>이 작업은 되돌릴 수 없습니다.</p>
      </div>
    </Modal>
  );
}
