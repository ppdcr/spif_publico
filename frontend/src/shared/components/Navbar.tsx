import { Link } from "react-router-dom";
import { Code2 } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="sticky top-0 inset-x-0 z-50 flex items-center justify-between px-8 py-5 border-b border-spif-card-border bg-spif-bg/80 backdrop-blur-md">
      <Link to="/" className="flex items-center gap-2">
        <Code2 className="w-7 h-7 text-spif-primary" />
        <span className="font-mono text-xl font-bold tracking-tighter">SPIF<span className="text-spif-primary">.</span></span>
      </Link>
      <div className="flex items-center gap-4">
        <Link
          to="/login"
          className="text-spif-secondary hover:text-spif-text font-semibold text-sm tracking-widest transition-colors uppercase"
        >
          entrar
        </Link>
        <Link
          to="/cadastro"
          className="bg-spif-primary text-spif-bg px-5 py-2.5 rounded-lg text-sm tracking-widest font-bold uppercase hover:bg-spif-primary-hover transition-colors shadow-lg shadow-spif-primary/20"
        >
          começar
        </Link>
      </div>
    </nav>
  )
}