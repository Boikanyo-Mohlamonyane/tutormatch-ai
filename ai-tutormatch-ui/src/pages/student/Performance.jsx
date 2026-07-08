import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { studentApi } from "../../api/studentApi";
import { useAuth } from "../../context/AuthContext";
import { PageHead, Spinner } from "../../components/ui/Common";
import MasteryRing from "../../components/ui/MasteryRing";
import Badge from "../../components/ui/Badge";
import { pick, formatDateOnly, toNumber } from "../../utils/format";
import { useToast } from "../../context/ToastContext";

export default function Performance() {
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [performance, setPerformance] = useState([]);
  const [risk, setRisk] = useState(null);
  const [calculating, setCalculating] = useState(false);

  const load = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await studentApi.getPerformance(user.id);
      setPerformance(data || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const calcRisk = async () => {
    setCalculating(true);
    try {
      const result = await studentApi.calculateRiskLevel(user.id);
      setRisk(result);
      toast.success("Risk level recalculated.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div>
      <PageHead
        eyebrow="Student · My activity"
        title="Performance"
        description="Your scores across subjects, and an up-to-date academic risk assessment."
        action={
          <button className="btn btn-primary" onClick={calcRisk} disabled={calculating}>
            {calculating ? <Spinner /> : <><ShieldAlert size={15} /> Recalculate risk level</>}
          </button>
        }
      />

      {risk && (
        <div className="panel" style={{ marginBottom: 22 }}>
          <div className="panel-body" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <ShieldAlert size={22} color="var(--accent-dark)" />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14.5 }}>Current risk level</div>
              <div className="muted" style={{ fontSize: 12.6 }}>Based on your latest sessions and scores</div>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <Badge tone={typeof risk === "string" ? risk : pick(risk, ["riskLevel", "level"], "Medium")}>
                {typeof risk === "string" ? risk : pick(risk, ["riskLevel", "level"], "Medium")}
              </Badge>
            </div>
          </div>
        </div>
      )}

      <div className="panel">
        <div className="panel-body no-pad">
          {loading ? (
            <div className="table-empty">
              <Spinner dark />
            </div>
          ) : performance.length === 0 ? (
            <div className="table-empty">
              <strong>No performance data yet</strong>
              Scores will show up here after you complete tutoring sessions.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Recorded</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {performance.map((p, i) => (
                  <tr key={pick(p, ["id", "performanceId"], i)}>
                    <td>{pick(p, ["subjectName"], "—")}</td>
                    <td className="cell-muted">{formatDateOnly(pick(p, ["recordedAt", "date"]))}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <MasteryRing value={toNumber(pick(p, ["score", "performanceScore"], 0))} size={36} stroke={4} />
                        {toNumber(pick(p, ["score", "performanceScore"], 0))}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
