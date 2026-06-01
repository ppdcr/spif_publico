import { useParams } from 'react-router-dom';
import { useUsuariosAtivosDisciplina } from '../../disciplina/disciplina-usuario/disciplina-usuario.hooks';
import UsuarioCard from './UsuarioCard';

export default function ListaUsuarios() {
  const { id } = useParams();
  const { data: usuarios, isLoading } = useUsuariosAtivosDisciplina(Number(id));

  if (isLoading) return <div className="animate-pulse text-[10px] uppercase py-10 opacity-50 tracking-widest">Sincronizando usuários...</div>;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl animate-in fade-in duration-700">
      {usuarios?.length === 0 ? (
        <p className="text-[10px] uppercase opacity-40 tracking-[0.2em] col-span-full">Nenhum usuário ativo nesta disciplina.</p>
      ) : (
        usuarios?.map((user) => (
          <UsuarioCard key={user.id} usuario={user} />
        ))
      )}
    </div>
  );
}