package com.spif.app.shared.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

public class UserDetailsImpl implements UserDetails {

    private final Long id;
    private final String prontuario;
    private final String senha;

    private final Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(Long id,
                           String prontuario,
                           String senha,
                           Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.prontuario = prontuario;
        this.senha = senha;
        this.authorities = authorities;
    }

    public Long getId() { return id; }
    public String getProntuario() { return prontuario; }

    @Override public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }
    @Override public String getPassword() { return senha; }
    @Override public String getUsername() { return prontuario; }

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}