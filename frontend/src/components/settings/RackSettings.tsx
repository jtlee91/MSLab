import { useState, useEffect, useCallback } from "react";
import { rackApi } from "../../services/api";
import type { ApiError } from "../../types";
import type { Rack, RackCreate, RackUpdate } from "../../types";
import { Button, useToast } from "../common";
import RackFormModal from "./RackFormModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import styles from "./RackSettings.module.css";

export default function RackSettings() {
  const [racks, setRacks] = useState<Rack[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedRack, setSelectedRack] = useState<Rack | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rackToDelete, setRackToDelete] = useState<Rack | null>(null);

  const { showToast } = useToast();

  const fetchRacks = useCallback(async () => {
    try {
      const response = await rackApi.getRacks();
      setRacks(response.racks);
    } catch {
      showToast("랙 목록을 불러오는데 실패했습니다.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchRacks();
  }, [fetchRacks]);

  const handleAddClick = () => {
    setSelectedRack(null);
    setShowFormModal(true);
  };

  const handleEditClick = (rack: Rack) => {
    setSelectedRack(rack);
    setShowFormModal(true);
  };

  const handleDeleteClick = (rack: Rack) => {
    setRackToDelete(rack);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (data: RackCreate | RackUpdate) => {
    setActionLoading(true);
    try {
      if (selectedRack) {
        const response = await rackApi.updateRack(selectedRack.id, data as RackUpdate);
        showToast(response.message, "success");
      } else {
        const response = await rackApi.createRack(data as RackCreate);
        showToast(response.message, "success");
      }
      setShowFormModal(false);
      await fetchRacks();
    } catch (error) {
      const apiError = error as ApiError;
      showToast(apiError.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!rackToDelete) return;

    setActionLoading(true);
    try {
      const response = await rackApi.deleteRack(rackToDelete.id);
      showToast(response.message, "success");
      setShowDeleteModal(false);
      setRackToDelete(null);
      await fetchRacks();
    } catch (error) {
      const apiError = error as ApiError;
      showToast(apiError.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const maxDisplayOrder = racks.length > 0 ? Math.max(...racks.map((r) => r.display_order)) : 0;

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>랙 관리</h3>
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
          <h3 className={styles.title}>랙 관리</h3>
          <p className={styles.description}>랙의 이름과 크기를 설정합니다.</p>
        </div>
        <Button variant="primary" size="small" onClick={handleAddClick}>
          + 새 랙 추가
        </Button>
      </div>

      {racks.length === 0 ? (
        <div className={styles.emptyState}>
          <p>등록된 랙이 없습니다.</p>
          <Button variant="secondary" onClick={handleAddClick}>
            첫 번째 랙 추가하기
          </Button>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>이름</th>
                <th>크기</th>
                <th>케이지 수</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {racks.map((rack) => (
                <tr key={rack.id}>
                  <td className={styles.nameCell}>{rack.name}</td>
                  <td>
                    {rack.rows}행 × {rack.columns}열
                  </td>
                  <td>{rack.rows * rack.columns}개</td>
                  <td className={styles.actionsCell}>
                    <Button variant="ghost" size="small" onClick={() => handleEditClick(rack)}>
                      수정
                    </Button>
                    <Button variant="ghost" size="small" onClick={() => handleDeleteClick(rack)}>
                      삭제
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <RackFormModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        rack={selectedRack}
        maxDisplayOrder={maxDisplayOrder}
        onSubmit={handleFormSubmit}
        loading={actionLoading}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setRackToDelete(null);
        }}
        title="랙 삭제"
        itemName={rackToDelete?.name || ""}
        onConfirm={handleDeleteConfirm}
        loading={actionLoading}
      />
    </div>
  );
}
