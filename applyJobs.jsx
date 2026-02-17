const { useEffect, useState } = React;

const BASE_URL =
	"https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net";
const CANDIDATE_EMAIL = "gpanelli3@gmail.com";

async function getCandidateByEmail(email) {
	const response = await fetch(
		`${BASE_URL}/api/candidate/get-by-email?email=${encodeURIComponent(email)}`
	);
	const data = await response.json();

	if (!response.ok) {
		const message = data?.message || "No se pudo obtener el candidato.";
		throw new Error(message);
	}

	return data;
}

async function getJobsList() {
	const response = await fetch(`${BASE_URL}/api/jobs/get-list`);
	const data = await response.json();

	if (!response.ok) {
		const message = data?.message || "No se pudo obtener la lista de posiciones.";
		throw new Error(message);
	}

	return data;
}

function ApplyJobs() {
	const [candidate, setCandidate] = useState(null);
	const [loadingCandidate, setLoadingCandidate] = useState(false);
	const [candidateError, setCandidateError] = useState("");
	const [jobs, setJobs] = useState([]);
	const [loadingJobs, setLoadingJobs] = useState(false);
	const [jobsError, setJobsError] = useState("");
	const [repoUrls, setRepoUrls] = useState({});
	const [submittingJobId, setSubmittingJobId] = useState(null);
	const [submitError, setSubmitError] = useState("");
	const [submitOk, setSubmitOk] = useState(false);

	const uuid = candidate?.uuid || "";
	const candidateId = candidate?.candidateId || "";
	const applicationId = candidate?.applicationId || "";
	const isCandidateDataReady = Boolean(uuid && candidateId && applicationId);

	useEffect(() => {
		const loadData = async () => {
			setLoadingCandidate(true);
			setLoadingJobs(true);
			setCandidateError("");
			setJobsError("");

			try {
				const [candidateData, jobsData] = await Promise.all([
					getCandidateByEmail(CANDIDATE_EMAIL),
					getJobsList(),
				]);
				console.log("candidate data", candidateData);
				console.log("jobs list", jobsData);
				setCandidate(candidateData);
				setJobs(jobsData);
			} catch (error) {
				const message = error?.message || "Error inesperado.";
				setCandidateError(message);
				setJobsError(message);
			} finally {
				setLoadingCandidate(false);
				setLoadingJobs(false);
			}
		};

		loadData();
	}, []);

	const handleRepoChange = (jobId, value) => {
		setRepoUrls((current) => ({ ...current, [jobId]: value }));
	};

	const handleSubmit = async (jobId) => {
		setSubmitError("");
		setSubmitOk(false);

		if (!isCandidateDataReady) {
			setSubmitError("Missing uuid, candidateId, or applicationId.");
			return;
		}

		const repoUrl = (repoUrls[jobId] || "").trim();
		if (!repoUrl) {
			setSubmitError("Repo URL is required.");
			return;
		}

		setSubmittingJobId(jobId);

		try {
			const payload = { uuid, jobId, candidateId, applicationId, repoUrl };
			console.log("apply-to-job payload", payload);
			const response = await fetch(
				`${BASE_URL}/api/candidate/apply-to-job`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				}
			);

			const data = await response.json();
			console.log("apply-to-job response", data);

			if (!response.ok) {
				const message = data?.message || "No se pudo enviar la postulacion.";
				throw new Error(message);
			}

			setSubmitOk(true);
		} catch (error) {
			console.error("apply-to-job error", error);
			setSubmitError(error?.message || "Error inesperado.");
		} finally {
			setSubmittingJobId(null);
		}
	};

	return (
		<section>
			<h2>Open positions</h2>
			{loadingCandidate && <p>Loading candidate data...</p>}
			{candidateError && <p>{candidateError}</p>}
			{loadingJobs && <p>Loading positions...</p>}
			{jobsError && <p>{jobsError}</p>}
			{submitError && <p>{submitError}</p>}
			{submitOk && <p>Application submitted.</p>}

			<ul>
				{jobs.map((job) => (
					<li key={job.id}>
						<strong>{job.title}</strong>
						<div>
							<input
								type="url"
								placeholder="https://github.com/tu-usuario/tu-repo"
								value={repoUrls[job.id] || ""}
								onChange={(event) =>
									handleRepoChange(job.id, event.target.value)
								}
							/>
							<button
								type="button"
								disabled={submittingJobId === job.id}
								onClick={() => handleSubmit(job.id)}
							>
								{submittingJobId === job.id ? "Submitting..." : "Submit"}
							</button>
						</div>
					</li>
				))}
			</ul>
		</section>
	);
}

const rootElement = document.getElementById("root");

if (rootElement && window.ReactDOM?.createRoot) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(<ApplyJobs />);
}
