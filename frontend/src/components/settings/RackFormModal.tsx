import { useState, useEffect } from "react";
import type { Rack, RackCreate, RackUpdate } from "../../types";
import { Modal, Button, Input } from "../common";
import styles from "./RackFormModal.module.css";

interface RackFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  rack: Rack | null;
  maxDisplayOrder: number;
  onSubmit: (data: RackCreate | RackUpdate) => Promise<void>;
  loading?: boolean;
}

export default function RackFormModal({
  isOpen,
  onClose,
  rack,
  maxDisplayOrder,
  onSubmit,
  loading = false,
}: RackFormModalProps) {
  const isEdit = rack !== null;

  const [name, setName] = useState("");
  const [rows, setRows] = useState(8);
  const [columns, setColumns] = useState(8);
  const [errors, setErrors] = useState<{ name?: string; rows?: string; columns?: string }>({});

  useEffect(() => {
    if (isOpen) {
      if (rack) {
        setName(rack.name);
        setRows(rack.rows);
        setColumns(rack.columns);
      } else {
        setName("");
        setRows(8);
        setColumns(8);
      }
      setErrors({});
    }
  }, [isOpen, rack]);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = "랙 이름을 입력하세요.";
    } else if (name.length > 100) {
      newErrors.name = "랙 이름은 100자 이하로 입력하세요.";
    }

    if (rows < 1 || rows > 26) {
      newErrors.rows = "행은 1~26 사이로 입력하세요.";
    }

    if (columns < 1 || columns > 26) {
      newErrors.columns = "열은 1~26 사이로 입력하세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    if (isEdit) {
      const updateData: RackUpdate = {};
      if (name !== rack.name) updateData.name = name;
      if (rows !== rack.rows) updateData.rows = rows;
      if (columns !== rack.columns) updateData.columns = columns;
      await onSubmit(updateData);
    } else {
      await onSubmit({
        name,
        rows,
        columns,
        display_order: maxDisplayOrder + 1,
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "랙 수정" : "새 랙 추가"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            취소
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            {isEdit ? "수정" : "추가"}
          </Button>
        </>
      }
    >
      <div className={styles.form}>
        <Input
          label="랙 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 랙1"
          error={errors.name}
          disabled={loading}
        />
        <div className={styles.sizeInputs}>
          <Input
            label="행 (세로)"
            type="number"
            min={1}
            max={26}
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            error={errors.rows}
            disabled={loading}
          />
          <Input
            label="열 (가로)"
            type="number"
            min={1}
            max={26}
            value={columns}
            onChange={(e) => setColumns(Number(e.target.value))}
            error={errors.columns}
            disabled={loading}
          />
        </div>
        <p className={styles.sizeHint}>
          총 {rows * columns}개의 케이지가 생성됩니다.
        </p>
      </div>
    </Modal>
  );
}
