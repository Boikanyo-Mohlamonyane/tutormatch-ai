import { useEffect, useState } from "react";
import { tutorApi } from "../../api/tutorApi";
import { PageHead, Spinner } from "../../components/ui/Common";
import MasteryRing from "../../components/ui/MasteryRing";
import Badge from "../../components/ui/Badge";
import { pick, formatDateOnly, toNumber } from "../../utils/format";
import { useToast } from "../../context/ToastContext";

export default function StudentPerformance() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [performance, setPerformance] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await tutorApi.getStudentPerformance();
        setPerformance(data || []);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <PageHead
        eyebrow="Tutor · Insights"
        title="Student performance"
        description="Scores and risk signals for the students you teach."
      />

      <div className="panel">
        <div className="panel-body no-pad">
          {loading ? (
            <div className="table-empty">
              <Spinner dark />
            </div>
          ) : performance.length === 0 ? (
            <div className="table-empty">
              <strong>No performance data yet</strong>
              Scores will appear once your students complete sessions.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Subject</th>
                  <th>Recorded</th>
                  <th>Score</th>
                  <th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {performance.map((p, i) => (
                  <tr key={pick(p, ["id", "performanceId"], i)}>
                    <td>{pick(p, ["studentName"], `Student #${pick(p, ["studentId"], "—")}`)}</td>
                    <td className="cell-muted">{pick(p, ["subjectName"], "—")}</td>
                    <td className="cell-muted">{formatDateOnly(pick(p, ["recordedAt", "date"]))}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <MasteryRing value={toNumber(pick(p, ["score", "performanceScore"], 0))} size={36} stroke={4} />
                        {toNumber(pick(p, ["score", "performanceScore"], 0))}%
                      </div>
                    </td>
                    <td>
                      <Badge tone={pick(p, ["riskLevel"], "low")}>{pick(p, ["riskLevel"], "Low")}</Badge>
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
