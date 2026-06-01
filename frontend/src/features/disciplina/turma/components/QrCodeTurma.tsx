import { QRCodeSVG } from 'qrcode.react';
import type { TurmaResponse } from '../turma.types';

interface AbaQrCodeProps {
  disciplinaId: number;
  turma: TurmaResponse;
}

export default function QrCodeTurma({ disciplinaId, turma }: AbaQrCodeProps) {

  const frontendUrl = window.location.origin;
  const linkPageConvite = `${frontendUrl}/minhas-disciplinas/${disciplinaId}/aceitar-convite-turma?codigo=${turma.codigoConvite}&nome=${turma.nome}`;

  return (
    <div className="flex flex-col items-center justify-center max-w-2xl mx-auto py-6">
      <div className="p-6 bg-white rounded-2xl shadow-xl border-4 border-spif-card-border">
        <QRCodeSVG
          value={linkPageConvite}
          size={400}
          level="Q" 
          fgColor="#000000"
          bgColor="#FFFFFF"
        />
      </div>
    </div>
  );
};