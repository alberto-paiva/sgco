// Copyright 2023 Alberto L. Paiva.
// SPDX-License-Identifier: MIT

import { useEffect, useState } from "react";
import { CondominoService } from "libs/api/condomino-api.ts";
import { UnidadeService } from "libs/api/unidade-api.ts";

const useFetchCondominoData = (id: string | null) => {
  const [condominoData, setCondominoData] = useState<CondominoData | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCondominoData = async () => {
      try {
        const data = id
          ? await CondominoService.getInstance().getCondominoById(id)
          : null;
        setCondominoData(data);
        setLoading(false);
        setError(null);
      } catch (err) {
        setCondominoData(null);
        setLoading(false);
        setError("Error fetching data");
      }
    };

    fetchCondominoData();
  }, [id]);

  return { condominoData, loading, error };
};

const useFetchBlocoData = () => {
  const [blocoData, setBlocoData] = useState<string[]>([]);
  const [blocosLoading, setBlocosLoading] = useState<boolean>(true);
  const [blocosError, setBlocosError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCondominoData = async () => {
      try {
        const data = await UnidadeService.getInstance().getNomeBlocos();
        setBlocoData(data ? data.map((e) => e.label) : []);
        setBlocosLoading(false);
        setBlocosError(null);
      } catch (err) {
        setBlocoData([]);
        setBlocosLoading(false);
        setBlocosError("Error fetching data");
      }
    };

    fetchCondominoData();
  }, [blocoData]);

  return { blocoData, loading: blocosLoading, error: blocosError };
};

export { useFetchBlocoData, useFetchCondominoData };
