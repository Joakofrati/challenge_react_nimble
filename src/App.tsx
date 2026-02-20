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

function App() {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  //llamado a la api para obtener los datos del candidato
  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const email = import.meta.env.VITE_CANDIDATE_EMAIL;

        const response = await fetch(`${baseUrl}/api/candidate/get-by-email?email=${email}`);
        //manejo de errores
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || JSON.stringify(errorData));
        }
        const data: Candidate = await response.json();
        setCandidate(data);

      } catch (error) {
        console.error("Error de la API: ", error);
      }
    };

    fetchCandidateData();
  }, []);

  return (
    // renderizado de la informacion del candidato
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Postulación a Trabajo</h1>
      
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
      ) : (
        <p>Cargando tus datos...</p>
      )}
    </div>
  );
}

export default App
