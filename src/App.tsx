import { useState, useEffect } from 'react'
// contenedor de informacion de un candidato
interface Candidate {
  uuid: string;
  candidateId: string;
  applicationId: string;
  firstName: string;
  lastName: string;
  email: string;
}
// contenedor de informacion de un trabajo
interface Job {
  id: string;
  title: string;
}

function App() {
  //estado para almacenar la informacion del candidato
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  //estado para almacenar la informacion de los trabajos
  const [jobs, setJobs] = useState<Job[]>([]);
  //estado para almacenar las urls
  const [urls, setUrls] = useState<Record<string, string>>({});
  
  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const email = import.meta.env.VITE_CANDIDATE_EMAIL;
        //llamado a la api para obtener los datos del candidato
        const response = await fetch(`${baseUrl}/api/candidate/get-by-email?email=${email}`);
        //manejo de errores
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || JSON.stringify(errorData));
        }
        const data: Candidate = await response.json();
        setCandidate(data);
        //llamado a la api para obtener los trabajos disponibles
        const resJobs = await fetch(`${baseUrl}/api/jobs/get-list`);
        if (!resJobs.ok) {
          const err = await resJobs.json();
          throw new Error(err.message || JSON.stringify(err));
        }
        const dataJobs = await resJobs.json();
        setJobs(dataJobs);

      } catch (error) {
        console.error("Error de la API: ", error);
      }
    };

    fetchCandidateData();
  }, []);
  
  //funcion para manejar el cambio de las urls en los inpus
  const handleUrlChange = (jobId: string, value: string) => {
    setUrls({
      ...urls, [jobId]: value 
    });
  };

  //funcion para manejar el submit del formulario 
  const handleSubmit = async (jobId: string) => {
    const urlIngresada = urls[jobId];
    
    if (!urlIngresada || !candidate) {
      alert("Faltan datos.");
      return;
    }

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      
      const response = await fetch(`${baseUrl}/api/candidate/apply-to-job`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uuid: candidate.uuid,
          jobId: jobId,
          candidateId: candidate.candidateId,
          repoUrl: urlIngresada
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || JSON.stringify(errorData));
      }

      const data = await response.json();
      
      if (data.ok) {
        alert("Exito al enviar la postulación.");
      }
      
    } catch (error) {
      console.error(error);
      alert("Error al enviar la postulación.");
    }
  };

  return (
    <div>
      {/* renderizado de la informacion del candidato como header */}
      <header>
        <h1>Postulación a Trabajo</h1>
        {candidate ? (
          <fieldset>
            <legend>Candidato</legend>
            <p><strong>Nombre:</strong> {candidate.firstName} {candidate.lastName}</p>
            <p><strong>Email:</strong> {candidate.email}</p>
            <p><strong>UUID:</strong> {candidate.uuid}</p>
            <p><strong>Candidate ID:</strong> {candidate.candidateId}</p>
            <p><strong>Application ID:</strong> {candidate.applicationId}</p>
          </fieldset>
        ) : (
          <p>Cargando datos del candidato...</p>
        )}
      </header>

      <hr />

      {/* renderizado de informacion de los trabajos y boton de submit */}
      <main>
        <h2>Posiciones Abiertas</h2>
        {jobs.length > 0 ? (
          <div>
            {jobs.map((job) => (
              <fieldset key={job.id}>
                <legend>Posición</legend>
                <ul>
                  <li><strong>id:</strong> {job.id}</li>
                  <li><strong>title:</strong> {job.title}</li>
                </ul>
                <div>
                  <label>URL del repositorio: </label>
                  <input 
                    type="text" 
                    placeholder="https://github.com/tu-usuario/tu-repo"
                    value={urls[job.id] || ""} 
                    onChange={(e) => handleUrlChange(job.id, e.target.value)}
                  />
                  <button onClick={() => handleSubmit(job.id)}>
                    Submit
                  </button>
                </div>
              </fieldset>
            ))}
          </div>
        ) : (
          <p>Cargando posiciones...</p>
        )}
      </main>
    </div>
  );
}

export default App;