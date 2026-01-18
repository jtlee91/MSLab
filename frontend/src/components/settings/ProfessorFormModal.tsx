import { useState, useEffect } from "react";
import type { Professor, ProfessorCreate, ProfessorUpdate } from "../../types";
import { Modal, Button, Input } from "../common";
import styles from "./ProfessorFormModal.module.css";

const DEFAULT_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Amber
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#EF4444", // Red
  "#06B6D4", // Cyan
  "#84CC16", // Lime
];

interface ProfessorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  professor: Professor | null;
  onSubmit: (data: ProfessorCreate | ProfessorUpdate) => Promise<void>;
  loading?: boolean;
}

export default function ProfessorFormModal({
  isOpen,
  onClose,
  professor,
  onSubmit,
  loading = false,
}: ProfessorFormModalProps) {
  const isEdit = professor !== null;

  const [name, setName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [contact, setContact] = useState("");
  const [colorCode, setColorCode] = useState(DEFAULT_COLORS[0]);
  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    if (isOpen) {
      if (professor) {
        setName(professor.name);
        setStudentName(professor.student_name || "");
        setContact(professor.contact || "");
        setColorCode(professor.color_code);
      } else {
        setName("");
        setStudentName("");
        setContact("");
        setColorCode(DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)]);
      }
      setErrors({});
    }
  }, [isOpen, professor]);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = "교수 이름을 입력하세요.";
    } else if (name.length > 100) {
      newErrors.name = "교수 이름은 100자 이하로 입력하세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    if (isEdit) {
      const updateData: ProfessorUpdate = {};
      if (name !== professor.name) updateData.name = name;
      if (studentName !== (professor.student_name || "")) updateData.student_name = studentName || null;
      if (contact !== (professor.contact || "")) updateData.contact = contact || null;
      if (colorCode !== professor.color_code) updateData.color_code = colorCode;
      await onSubmit(updateData);
    } else {
      await onSubmit({
        name,
        student_name: studentName || null,
        contact: contact || null,
        color_code: colorCode,
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "교수 정보 수정" : "새 교수 등록"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            취소
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            {isEdit ? "수정" : "등록"}
          </Button>
        </>
      }
    >
      <div className={styles.form}>
        <Input
          label="교수 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 김교수"
          error={errors.name}
          disabled={loading}
        />
        <Input
          label="담당 학생"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="예: 홍길동 (선택사항)"
          disabled={loading}
        />
        <Input
          label="연락처"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="예: 010-1234-5678 (선택사항)"
          disabled={loading}
        />
        <div className={styles.colorSection}>
          <label className={styles.colorLabel}>구분 색상</label>
          <div className={styles.colorGrid}>
            {DEFAULT_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={`${styles.colorButton} ${colorCode === color ? styles.colorButtonSelected : ""}`}
                style={{ backgroundColor: color }}
                onClick={() => setColorCode(color)}
                aria-label={`색상 ${color} 선택`}
                disabled={loading}
              />
            ))}
          </div>
          <div className={styles.customColor}>
            <label className={styles.customColorLabel}>직접 입력:</label>
            <input
              type="color"
              value={colorCode}
              onChange={(e) => setColorCode(e.target.value)}
              className={styles.colorPicker}
              disabled={loading}
            />
            <span className={styles.colorValue}>{colorCode}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
