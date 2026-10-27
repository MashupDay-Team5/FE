import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { getCategories } from '@/api/categories';
import type { TreatmentCategoriesContext } from '@/hooks/useTreatmentCategories';
import type { MedicalCategory } from '@/types/treatment';

type CategoriesState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'success'; categories: MedicalCategory[] };

function TreatmentCategoriesRoute() {
  const [state, setState] = useState<CategoriesState>({ status: 'loading' });
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    getCategories(controller.signal)
      .then((response) => {
        if (controller.signal.aborted) {
          return;
        }

        const categories = response.map((medicalCategory) => ({
          id: medicalCategory.medicalCategoryId,
          name: medicalCategory.name,
          treatmentCategories: medicalCategory.treatmentCategories.map(
            (treatmentCategory) => ({
              id: treatmentCategory.treatmentCategoryId,
              name: treatmentCategory.name,
              treatments: treatmentCategory.treatments.map((treatment) => ({
                id: treatment.treatmentId,
                name: treatment.name,
              })),
            }),
          ),
        }));

        setState({ status: 'success', categories });
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setState({ status: 'error' });
        }
      });

    return () => controller.abort();
  }, [requestCount]);

  const context: TreatmentCategoriesContext = {
    status: state.status,
    categories: state.status === 'success' ? state.categories : [],
    retry: () => {
      setState({ status: 'loading' });
      setRequestCount((count) => count + 1);
    },
  };
  return <Outlet context={context} />;
}

export default TreatmentCategoriesRoute;
