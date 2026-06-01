package com.spif.app.usuario.infrastructure.persistence;

import com.spif.app.shared.security.UserDetailsImpl;
import com.spif.app.usuario.application.ports.out.UsuarioRepository;
import com.spif.app.usuario.domain.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DomainUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var usuario = usuarioRepository.buscarPorProntuario(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
        return map(usuario);
    }

    public UserDetails loadUserById(Long id) {
        var usuario = usuarioRepository.buscarPorId(id)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
        return map(usuario);
    }

    private UserDetails map(Usuario u) {
        var authorities = List.of(new SimpleGrantedAuthority(u.getRole().name()));
        return new UserDetailsImpl(
                u.getId(),
                u.getProntuario(),
                u.getSenha(),
                authorities
        );
    }
}