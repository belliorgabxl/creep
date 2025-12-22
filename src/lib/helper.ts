import {
  ActivitiesRow,
  ApproveParams,
  BudgetTableValue,
  DateDurationValue,
  EditFormState,
  EstimateParams,
  ExpectParams,
  GeneralInfoParams,
  GoalParams,
  KPIParams,
  ProjectInformationResponse,
  StrategyParams,
} from "@/dto/projectDto";

export function mapFormToPayload(form: EditFormState) {
  return {
    project_name: form.generalInfo.name,
    plane_type: form.generalInfo.type,
    department_name: form.generalInfo.department_id,
    quantitative_goal: form.goal.quantityGoal,
    qualitative_goal: form.goal.qualityGoal,
  };
}

export function mapApiToForm(
  apiData: ProjectInformationResponse
): EditFormState {
  const generalInfo: GeneralInfoParams = {
    name: apiData.project_name,
    type: apiData.plane_type || "",
    department: apiData.department_name || "",
    owner_user_id: "",
  } as any;

  const goal: GoalParams = {
    quantityGoal: apiData.quantitative_goal || "",
    qualityGoal: apiData.qualitative_goal || "",
  };

  let startDate = "";
  let endDate = "";

  if (apiData.progress && apiData.progress.length > 0) {
    const startList = apiData.progress
      .map((p) => p.start_date)
      .filter((d): d is string => !!d);
    const endList = apiData.progress
      .map((p) => p.end_date)
      .filter((d): d is string => !!d);

    if (startList.length) {
      startDate = startList.sort()[0]!;
    }
    if (endList.length) {
      endDate = endList.sort()[endList.length - 1]!;
    }
  }

  const duration: DateDurationValue = {
    startDate,
    endDate,
    durationMonths: 0,
  };

  let budget: BudgetTableValue | null = null;

  if (apiData.budget_items && apiData.budget_items.length > 0) {
    const rows = apiData.budget_items.map((b, idx) => ({
      id: idx + 1,
      item: b.name || "",
      amount: String(b.amount ?? 0),
      note: b.remark || "",
    }));

    budget = {
      rows,
      total:
        typeof apiData.budget_amount === "number"
          ? apiData.budget_amount
          : rows.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0),
      sources: {
        source: apiData.budget_source || "",
        externalAgency: apiData.budget_source_department || "",
      },
    };
  }

  const activities: ActivitiesRow[] = (apiData.progress || []).map(
    (p, idx) =>
      ({
        id: p.sequence_number || idx + 1,
        activity: p.description || "",
        startDate: p.start_date || "",
        endDate: p.end_date || "",
        owner: p.responsible_name || "",
      } as ActivitiesRow)
  );

  const strategy: StrategyParams = {
    schoolPlan: "",
    ovEcPolicy: "",
    qaIndicator: "",
  };

  const kpi: KPIParams = {
    output: "",
    outcome: "",
  };

  const estimate: EstimateParams = {
    estimateType: "",
    evaluator: "",
    startDate: "",
    endDate: "",
  };

  const expect: ExpectParams = {
    results: [],
  };

  const approve: ApproveParams = {
    proposerName: "",
    proposerPosition: "",
    proposeDate: "",
    deptComment: "",
    directorComment: "",
  };

  return {
    id: String(apiData.created_at ?? ""),
    generalInfo,
    goal,
    duration,
    strategy,
    kpi,
    estimate,
    expect,
    budget,
    activities,
    approve,
  };
}
