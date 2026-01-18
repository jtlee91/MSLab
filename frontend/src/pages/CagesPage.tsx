import { useState, useCallback } from "react";
import {
  CageGrid,
  RackTabs,
  ProfessorSelectModal,
  ConfirmReleaseModal,
} from "../components/cages";
import { useToast } from "../components/common";
import { useCageGrid } from "../hooks/useCageGrid";
import type { Cage, Professor } from "../types";
import styles from "./CagesPage.module.css";

export default function CagesPage() {
  const {
    racks,
    selectedRackId,
    gridData,
    professors,
    loading,
    error,
    selectRack,
    assignCage,
    releaseCage,
  } = useCageGrid();

  const { showToast } = useToast();

  const [selectedCage, setSelectedCage] = useState<Cage | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleCageDoubleClick = useCallback((cage: Cage) => {
    setSelectedCage(cage);
    if (cage.current_professor) {
      setShowReleaseModal(true);
    } else {
      setShowAssignModal(true);
    }
  }, []);

  const handleCloseModals = useCallback(() => {
    setShowAssignModal(false);
    setShowReleaseModal(false);
    setSelectedCage(null);
  }, []);

  const handleProfessorSelect = useCallback(
    async (professor: Professor) => {
      if (!selectedCage) return;

      setActionLoading(true);
      const result = await assignCage(selectedCage, professor.id);
      setActionLoading(false);

      if (result.success) {
        showToast("success", `${selectedCage.position}이(가) ${professor.name}에게 배정되었습니다`);
        handleCloseModals();
      } else if (result.error?.isConflict) {
        showToast("warning", "다른 사용자가 이 케이지를 수정했습니다. 최신 데이터를 불러왔습니다.");
        handleCloseModals();
      } else {
        showToast("error", result.error?.message || "배정에 실패했습니다");
      }
    },
    [selectedCage, assignCage, showToast, handleCloseModals]
  );

  const handleReleaseConfirm = useCallback(async () => {
    if (!selectedCage) return;

    setActionLoading(true);
    const result = await releaseCage(selectedCage);
    setActionLoading(false);

    if (result.success) {
      showToast("success", `${selectedCage.position} 케이지가 해제되었습니다`);
      handleCloseModals();
    } else if (result.error?.isConflict) {
      showToast("warning", "다른 사용자가 이 케이지를 수정했습니다. 최신 데이터를 불러왔습니다.");
      handleCloseModals();
    } else {
      showToast("error", result.error?.message || "해제에 실패했습니다");
    }
  }, [selectedCage, releaseCage, showToast, handleCloseModals]);

  if (loading && !gridData) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>케이지 관리</h1>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p>데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error && !gridData) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>케이지 관리</h1>
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>❌ {error}</p>
          <button
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>케이지 관리</h1>

      <div className={styles.card}>
        <RackTabs
          racks={racks}
          selectedRackId={selectedRackId}
          onSelectRack={selectRack}
        />

        {gridData && (
          <CageGrid gridData={gridData} onCageDoubleClick={handleCageDoubleClick} />
        )}
      </div>

      <ProfessorSelectModal
        isOpen={showAssignModal}
        onClose={handleCloseModals}
        cage={selectedCage}
        professors={professors}
        onSelect={handleProfessorSelect}
      />

      <ConfirmReleaseModal
        isOpen={showReleaseModal}
        onClose={handleCloseModals}
        cage={selectedCage}
        onConfirm={handleReleaseConfirm}
        loading={actionLoading}
      />
    </div>
  );
}
