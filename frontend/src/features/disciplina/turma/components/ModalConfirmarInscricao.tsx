import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle, Users } from 'lucide-react';
import { useAceitarConviteQrCode } from '../turma-usuario/turma-usuario.hooks';

interface ModalConfirmarInscricaoProps {
  isOpen: boolean;
  onClose: () => void;
  codigoConvite: string;
  disciplinaId: number;
  nomeTurma: string;
}

export default function ModalConfirmarInscricao({
  isOpen,
  onClose,
  codigoConvite,
  disciplinaId,
  nomeTurma
}: ModalConfirmarInscricaoProps) {
  const navigate = useNavigate();
  
  const { mutate, isPending, isSuccess, isError } = useAceitarConviteQrCode(disciplinaId);

  if (!isOpen) return null;

  const handleAceitar = () => {
    mutate(codigoConvite);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-card max-w-md w-full p-8 flex flex-col items-center text-center gap-6 border border-spif-card-border bg-spif-bg">
        
        {/* ESTADO 1: PROCESSANDO/CARREGANDO */}
        {isPending && (
          <div className="flex flex-col items-center gap-4 py-6 animate-pulse">
            <Loader2 className="w-12 h-12 text-spif-primary animate-spin" />
            <h3 className="font-black uppercase tracking-wider text-sm text-spif-text">
              Processando sua matrícula...
            </h3>
            <p className="text-xs text-spif-secondary">Comunicando com o servidor, aguarde.</p>
          </div>
        )}

        {/* ESTADO 2: TUDO CERTO (SUCESSO) */}
        {isSuccess && !isPending && (
          <div className="flex flex-col items-center gap-6 py-2">
            <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black uppercase tracking-wide text-spif-text">Tudo Certo!</h3>
              <p className="text-sm text-spif-secondary">
                Sua inscrição na turma foi efetuada com sucesso.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                navigate(`/minhas-disciplinas/${disciplinaId}`);
              }}
              className="w-full bg-spif-primary text-spif-bg font-black uppercase tracking-widest text-xs py-3.5 rounded-xl shadow-lg shadow-spif-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Ir para a Disciplina
            </button>
          </div>
        )}

        {/* ESTADO 3: ERRO (NÃO PERTENCE À DISCIPLINA / CODIGO EXPIRADO) */}
        {isError && !isPending && (
          <div className="flex flex-col items-center gap-6 py-2">
            <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
              <XCircle className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black uppercase tracking-wide text-red-500">Acesso Negado</h3>
              <p className="text-sm text-spif-secondary px-4">
                Você não pertence a essa disciplina ou o código informado é inválido.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                navigate('/minhas-disciplinas'); // Redireciona para o painel global
              }}
              className="w-full border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white font-black uppercase tracking-widest text-xs py-3.5 rounded-xl bg-red-500/5 active:scale-95 transition-all"
            >
              Voltar para Disciplinas
            </button>
          </div>
        )}

        {/* ESTADO PADRÃO: CONFIRMAÇÃO DE ENTRADA */}
        {!isPending && !isSuccess && !isError && (
          <>
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-spif-primary block">
                Convite Recebido
              </span>
              <h3 className="text-xl font-black tracking-tight text-spif-text">
                Deseja entrar em <span className="text-spif-primary">{nomeTurma}</span>?
              </h3>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-3 w-full mt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3.5 rounded-xl border border-spif-card-border text-[10px] font-black uppercase tracking-widest text-spif-secondary hover:text-spif-text transition-all bg-spif-card/50 active:scale-95"
              >
                Cancelar
              </button>
              <button
                onClick={handleAceitar}
                className="flex-1 py-3.5 rounded-xl bg-spif-primary text-spif-bg text-[10px] font-black uppercase tracking-widest shadow-md shadow-spif-primary/10 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Aceitar Convite
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}