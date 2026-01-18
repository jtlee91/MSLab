import { useState, useEffect, useCallback, useRef } from "react";
import { cageApi, rackApi, professorApi } from "../services/api";
import type { Cage, CageGridResponse, Rack, Professor, ApiError } from "../types";

const POLLING_INTERVAL = 4000;

export interface UseCageGridReturn {
  racks: Rack[];
  selectedRackId: number | null;
  gridData: CageGridResponse | null;
  professors: Professor[];
  loading: boolean;
  error: string | null;
  selectRack: (rackId: number) => void;
  assignCage: (cage: Cage, professorId: number) => Promise<{ success: boolean; error?: ApiError }>;
  releaseCage: (cage: Cage) => Promise<{ success: boolean; error?: ApiError }>;
  refreshGrid: () => Promise<void>;
}

export function useCageGrid(): UseCageGridReturn {
  const [racks, setRacks] = useState<Rack[]>([]);
  const [selectedRackId, setSelectedRackId] = useState<number | null>(null);
  const [gridData, setGridData] = useState<CageGridResponse | null>(null);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pollingRef = useRef<number | null>(null);
  const selectedRackIdRef = useRef<number | null>(null);

  selectedRackIdRef.current = selectedRackId;

  const fetchGridData = useCallback(async (rackId: number, showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      const data = await cageApi.getCageGrid(rackId);
      if (selectedRackIdRef.current === rackId) {
        setGridData(data);
        setError(null);
      }
    } catch {
      setError("케이지 데이터를 불러오는데 실패했습니다.");
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  const refreshGrid = useCallback(async () => {
    if (selectedRackIdRef.current) {
      await fetchGridData(selectedRackIdRef.current, false);
    }
  }, [fetchGridData]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        const [racksData, professorsData] = await Promise.all([
          rackApi.getRacks(),
          professorApi.getProfessors(),
        ]);

        setRacks(racksData.racks);
        setProfessors(professorsData.professors);

        if (racksData.racks.length > 0) {
          const firstRack = racksData.racks[0];
          setSelectedRackId(firstRack.id);
          await fetchGridData(firstRack.id, true);
        }
      } catch {
        setError("데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [fetchGridData]);

  useEffect(() => {
    if (selectedRackId) {
      pollingRef.current = window.setInterval(() => {
        fetchGridData(selectedRackId, false);
      }, POLLING_INTERVAL);
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [selectedRackId, fetchGridData]);

  const selectRack = useCallback(
    async (rackId: number) => {
      if (rackId === selectedRackId) return;
      setSelectedRackId(rackId);
      await fetchGridData(rackId, true);
    },
    [selectedRackId, fetchGridData]
  );

  const assignCage = useCallback(
    async (cage: Cage, professorId: number): Promise<{ success: boolean; error?: ApiError }> => {
      try {
        const result = await cageApi.assignCage(cage.id, {
          professor_id: professorId,
          version: cage.version,
        });

        if (result.success) {
          setGridData((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              cages: prev.cages.map((c) => (c.id === result.cage.id ? result.cage : c)),
            };
          });
        }

        return { success: true };
      } catch (error) {
        const apiError = error as ApiError;
        if (apiError.isConflict) {
          await refreshGrid();
        }
        return { success: false, error: apiError };
      }
    },
    [refreshGrid]
  );

  const releaseCage = useCallback(
    async (cage: Cage): Promise<{ success: boolean; error?: ApiError }> => {
      try {
        const result = await cageApi.releaseCage(cage.id, {
          version: cage.version,
        });

        if (result.success) {
          setGridData((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              cages: prev.cages.map((c) => (c.id === result.cage.id ? result.cage : c)),
            };
          });
        }

        return { success: true };
      } catch (error) {
        const apiError = error as ApiError;
        if (apiError.isConflict) {
          await refreshGrid();
        }
        return { success: false, error: apiError };
      }
    },
    [refreshGrid]
  );

  return {
    racks,
    selectedRackId,
    gridData,
    professors,
    loading,
    error,
    selectRack,
    assignCage,
    releaseCage,
    refreshGrid,
  };
}
