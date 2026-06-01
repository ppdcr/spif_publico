import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import ModalConfirmarInscricao from '../components/ModalConfirmarInscricao';
import { Loader2 } from 'lucide-react';

export default function IngressarTurmaPage() {
  const [searchParams] = useSearchParams()
  const { disciplinaIdParam } = useParams()

  const navigate = useNavigate()
  
  const codigoConvite = searchParams.get('codigo')
  const nomeTurma = searchParams.get('nome')
  const disciplinaId = Number(disciplinaIdParam)

  const [modalAberto, setModalAberto] = useState(false)

  useEffect(() => {
    if (codigoConvite && disciplinaId && nomeTurma) {
      setModalAberto(true);
    } else {
      navigate('/minhas-disciplinas');
    }
  }, [codigoConvite, disciplinaId, nomeTurma, navigate]);

  return (
    <div className="min-h-screen bg-spif-bg flex flex-col items-center justify-center p-6 text-spif-text">
      {/* Enquanto o modal não decide o destino, mostra uma tela de fundo elegante */}
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <Loader2 className="w-10 h-10 text-spif-primary animate-spin" />
        <span className="tracking-widest uppercase text-xs font-black text-spif-secondary">
          Carregando convite da turma...
        </span>
      </div>

      {/* O Modal entra em ação aqui, injetando os dados capturados da URL */}
      {codigoConvite && disciplinaId && nomeTurma && (
        <ModalConfirmarInscricao
          isOpen={modalAberto}
          onClose={() => {
            setModalAberto(false);
            navigate('/minhas-disciplinas');
          }}
          codigoConvite={codigoConvite}
          disciplinaId={disciplinaId}
          nomeTurma={nomeTurma}
        />
      )}
    </div>
  );
}