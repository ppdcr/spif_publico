package com.spif.app.usuario.web.dto.out;

import com.spif.app.usuario.domain.Role;
import com.spif.app.usuario.domain.Usuario;
import lombok.Data;

@Data
public class UsuarioResumoResponse {
    private long id;
    private String prontuario;
    private String nickname;
    private Role role;

    public static UsuarioResumoResponse fromDomain(Usuario u) {
        if (u == null) return null;
        UsuarioResumoResponse r = new UsuarioResumoResponse();
        r.setId(u.getId());
        r.setProntuario(u.getProntuario());
        r.setNickname(u.getNickname());
        r.setRole(u.getRole());
        return r;
    }
}
