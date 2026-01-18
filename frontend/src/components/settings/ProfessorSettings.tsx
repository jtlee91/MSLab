import { useState, useEffect, useCallback } from "react";
import { professorApi } from "../../services/api";
import type { ApiError } from "../../types";
import type { Professor, ProfessorCreate, ProfessorUpdate } from "../../types";
import { Button, useToast } from "../common";
import ProfessorFormModal from "./ProfessorFormModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import styles from "./ProfessorSettings.module.css";

export default function ProfessorSettings() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [professorToDelete, setProfessorToDelete] = useState<Professor | null>(null);

  const { showToast } = useToast();

  const fetchProfessors = useCallback(async () => {
    try {
      const response = await professorApi.getProfessors();
      setProfessors(response.professors);
    } catch {
      showToast("error", "교수 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchProfessors();
  }, [fetchProfessors]);

  const handleAddClick = () => {
    setSelectedProfessor(null);
    setShowFormModal(true);
  };

  const handleEditClick = (professor: Professor) => {
    setSelectedProfessor(professor);
    setShowFormModal(true);
  };

  const handleDeleteClick = (professor: Professor) => {
    setProfessorToDelete(professor);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (data: ProfessorCreate | ProfessorUpdate) => {
    setActionLoading(true);
    try {
      if (selectedProfessor) {
        const response = await professorApi.updateProfessor(selectedProfessor.id, data as ProfessorUpdate);
        showToast("success", response.message);
      } else {
        const response = await professorApi.createProfessor(data as ProfessorCreate);
        showToast("success", response.message);
      }
      setShowFormModal(false);
      await fetchProfessors();
    } catch (error) {
      const apiError = error as ApiError;
      showToast("error", apiError.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!professorToDelete) return;

    setActionLoading(true);
    try {
      const response = await professorApi.deleteProfessor(professorToDelete.id);
      showToast("success", response.message);
      setShowDeleteModal(false);
      setProfessorToDelete(null);
      await fetchProfessors();
    } catch (error) {
      const apiError = error as ApiError;
      showToast("error", apiError.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>교수 관리</h3>
        </div>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p>불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>교수 관리</h3>
          <p className={styles.description}>케이지를 배정할 교수 정보를 관리합니다.</p>
        </div>
        <Button variant="primary" size="small" onClick={handleAddClick}>
          + 새 교수 등록
        </Button>
      </div>

      {professors.length === 0 ? (
        <div className={styles.emptyState}>
          <p>등록된 교수가 없습니다.</p>
          <Button variant="secondary" onClick={handleAddClick}>
            첫 번째 교수 등록하기
          </Button>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>색상</th>
                <th>이름</th>
                <th>담당 학생</th>
                <th>연락처</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {professors.map((professor) => {
                const hasAssigned = professor.assigned_count > 0;

                return (
                  <tr key={professor.id}>
                    <td>
                      <span
                        className={styles.colorChip}
                        style={{ backgroundColor: professor.color_code }}
                        title={professor.color_code}
                      />
                    </td>
                    <td className={styles.nameCell}>
                      <span className={styles.nameWithBadge}>
                        {professor.name}
                        {hasAssigned && (
                          <span className={styles.assignedBadge}>
                            {professor.assigned_count}개 사용중
                          </span>
                        )}
                      </span>
                    </td>
                    <td className={styles.optionalCell}>
                      {professor.student_name || <span className={styles.emptyValue}>-</span>}
                    </td>
                    <td className={styles.optionalCell}>
                      {professor.contact || <span className={styles.emptyValue}>-</span>}
                    </td>
                    <td className={styles.actionsCell}>
                      <Button variant="ghost" size="small" onClick={() => handleEditClick(professor)}>
                        수정
                      </Button>
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => handleDeleteClick(professor)}
                        disabled={hasAssigned}
                        title={hasAssigned ? "사용 중인 케이지가 있어 삭제할 수 없습니다" : ""}
                      >
                        삭제
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ProfessorFormModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        professor={selectedProfessor}
        onSubmit={handleFormSubmit}
        loading={actionLoading}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setProfessorToDelete(null);
        }}
        title="교수 삭제"
        itemName={professorToDelete?.name || ""}
        onConfirm={handleDeleteConfirm}
        loading={actionLoading}
      />
    </div>
  );
}
