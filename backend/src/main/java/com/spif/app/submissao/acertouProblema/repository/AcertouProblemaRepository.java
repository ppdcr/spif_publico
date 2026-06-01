package com.spif.app.submissao.acertouProblema.repository;

import com.spif.app.submissao.acertouProblema.domain.AcertouProblema;

public interface AcertouProblemaRepository {
    AcertouProblema salvar(AcertouProblema acertouProblema);
    boolean acertouProblema(long alunoId, long problemaId);
}
