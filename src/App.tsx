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

  return (
    
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Postulación a Trabajo</h1>
      {/* renderizado de la informacion del candidato*/}
      {candidate ? (
        <div style={{ background: '#e0f7fa', padding: '15px', borderRadius: '8px' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '1.1em' }}><strong>Candidato:</strong></p>
          <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
            <li><strong>Nombre:</strong> {candidate.firstName}</li>
            <li><strong>Apellido:</strong> {candidate.lastName}</li>
            <li><strong>Email:</strong> {candidate.email}</li>
            <li><strong>UUID:</strong> {candidate.uuid}</li>
            <li><strong>Candidate ID:</strong> {candidate.candidateId}</li>
            <li><strong>Application ID:</strong> {candidate.applicationId}</li>
          </ul>
        </div>
      ): (
        <p>Cargando datos del candidato...</p>
      )}
      {/* renderizado de la informacion de los trabajos disponibles */}
      <h2>Posiciones Abiertas</h2>
      {jobs.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {jobs.map((job) => (
            <div key={job.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', background: '#f9f9f9' }}>
              <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
                <li><strong>id:</strong> {job.id}</li>
                <li><strong>title:</strong> {job.title}</li>
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p>Cargando posiciones...</p>
      )}
    </div>
  );
}

export default App