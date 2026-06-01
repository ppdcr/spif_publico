package com.spif.app.submissao.infrastructure.executor;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.async.ResultCallback;
import com.github.dockerjava.api.command.CreateContainerResponse;
import com.github.dockerjava.api.model.Capability;
import com.github.dockerjava.api.model.HostConfig;
import com.spif.app.submissao.domain.Linguagem;
import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

@Component
@Slf4j
public class ContainerPool {

    private final DockerClient dockerClient;
    private final Map<Linguagem, BlockingQueue<String>> pools = new ConcurrentHashMap<>();
    private static final int POOL_SIZE = 2;

    private static final String SECCOMP_PROFILE = buildSeccompProfile();

    public ContainerPool(DockerClient dockerClient) {
        this.dockerClient = dockerClient;
        limparOrfaos();
        for (Linguagem lang : Linguagem.values()) {
            pools.put(lang, new LinkedBlockingQueue<>());
            for (int i = 0; i < POOL_SIZE; i++) {
                aquecer(lang);
            }
        }
    }

    private void limparOrfaos() {
        try {
            dockerClient.listContainersCmd()
                    .withLabelFilter(Map.of("spif.pool", "true"))
                    .exec()
                    .forEach(c -> destruir(c.getId()));
            log.info("Containers órfãos limpos com sucesso");
        } catch (Exception e) {
            log.warn("Falha ao limpar containers órfãos", e);
        }
    }

    public String adquirir(Linguagem lang, int memoriaLimiteMb) {
        String id = pools.get(lang).poll();
        if (id != null && isContainerVivo(id)) return id;
        return criarContainer(lang, memoriaLimiteMb);
    }

    public void devolver(String containerId, Linguagem lang) {
        try {
            executarSh(containerId, "rm -rf /app/*");
            if (pools.get(lang).size() < POOL_SIZE) {
                pools.get(lang).offer(containerId);
                return;
            }
        } catch (Exception ignored) {}
        destruir(containerId);
    }

    public void destruir(String containerId) {
        try {
            dockerClient.removeContainerCmd(containerId).withForce(true).exec();
        } catch (Exception e) {
            log.warn("Falha ao destruir container {}", containerId, e);
        }
    }

    private void aquecer(Linguagem lang) {
        try {
            String id = criarContainer(lang, 256);
            pools.get(lang).offer(id);
        } catch (Exception e) {
            log.error("Falha ao pré-aquecer container para {}", lang, e);
        }
    }

    private String criarContainer(Linguagem lang, int memoriaLimiteMb) {
        long memoriaBytes = Math.max(memoriaLimiteMb, 256) * 1024 * 1024L;

        CreateContainerResponse container = dockerClient.createContainerCmd(getImagem(lang))
                .withLabels(Map.of("spif.pool", "true", "spif.lang", lang.name()))
                .withHostConfig(HostConfig.newHostConfig()
                        .withMemory(memoriaBytes)
                        .withMemorySwap(memoriaBytes)
                        .withPidsLimit(64L)
                        .withNetworkMode("none")
                        .withSecurityOpts(List.of("seccomp=" + SECCOMP_PROFILE))
                        .withCapDrop(Capability.ALL)
                )
                // sem .withUser("nobody") aqui — define por exec individualmente
                .withWorkingDir("/app")
                .withCmd("sh", "-c", "mkdir -p /app && chmod 777 /app && sleep infinity")
                .exec();

        String id = container.getId();
        dockerClient.startContainerCmd(id).exec();

        // pequena espera para o mkdir/chmod executar antes de usar o container
        try { Thread.sleep(200); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }

        return id;
    }

    private boolean isContainerVivo(String id) {
        try {
            return Boolean.TRUE.equals(
                    dockerClient.inspectContainerCmd(id).exec().getState().getRunning()
            );
        } catch (Exception e) {
            return false;
        }
    }

    private void executarSh(String containerId, String cmd) throws InterruptedException {
        var exec = dockerClient.execCreateCmd(containerId)
                .withUser("root")
                .withCmd("sh", "-c", cmd).exec();
        dockerClient.execStartCmd(exec.getId())
                .exec(new ResultCallback.Adapter<>())
                .awaitCompletion(3, TimeUnit.SECONDS);
    }

    @PreDestroy
    public void shutdown() {
        pools.values().stream()
                .flatMap(q -> q.stream())
                .forEach(this::destruir);
    }

    private String getImagem(Linguagem lang) {
        return switch (lang) {
            case JAVA       -> "eclipse-temurin:17-jdk-jammy";
            case PYTHON     -> "python:3.11-slim";
            case CPP, C     -> "gcc:latest";
            case JAVASCRIPT -> "node:18-slim";
        };
    }

    private static String buildSeccompProfile() {
        // Blocklist em cima do default do Docker.
        // Muito mais compatível com kernels diferentes — o default já cobre
        // o que o runc precisa para inicializar o container.
        return """
        {
            "defaultAction": "SCMP_ACT_ERRNO",
            "archMap": [
                {
                    "architecture": "SCMP_ARCH_X86_64",
                    "subArchitectures": ["SCMP_ARCH_X86", "SCMP_ARCH_X32"]
                },
                {
                    "architecture": "SCMP_ARCH_AARCH64",
                    "subArchitectures": ["SCMP_ARCH_ARM"]
                }
            ],
            "syscalls": [
                {
                    "names": [
                        "accept", "accept4", "access", "adjtimex", "alarm",
                        "bind", "brk", "capget", "capset", "chdir", "chmod",
                        "chown", "chroot", "clock_adjtime", "clock_getres",
                        "clock_gettime", "clock_nanosleep", "clock_settime",
                        "close", "connect", "copy_file_range", "creat", "dup",
                        "dup2", "dup3", "epoll_create", "epoll_create1",
                        "epoll_ctl", "epoll_pwait", "epoll_wait", "eventfd",
                        "eventfd2", "execve", "execveat", "exit", "exit_group",
                        "faccessat", "faccessat2", "fadvise64", "fallocate",
                        "fanotify_mark", "fchdir", "fchmod", "fchmodat",
                        "fchown", "fchownat", "fcntl", "fdatasync", "fgetxattr",
                        "flistxattr", "flock", "fork", "fremovexattr",
                        "fsetxattr", "fstat", "fstatfs", "fsync", "ftruncate",
                        "futex", "futimesat", "getcpu", "getcwd", "getdents",
                        "getdents64", "getegid", "geteuid", "getgid",
                        "getgroups", "getitimer", "getpeername", "getpgid",
                        "getpgrp", "getpid", "getppid", "getpriority",
                        "getrandom", "getresgid", "getresuid", "getrlimit",
                        "getrusage", "getsid", "getsockname", "getsockopt",
                        "gettid", "gettimeofday", "getuid", "getxattr",
                        "inotify_add_watch", "inotify_init", "inotify_init1",
                        "inotify_rm_watch", "io_cancel", "io_destroy",
                        "io_getevents", "io_setup", "io_submit", "ioctl",
                        "ioprio_get", "ioprio_set", "ipc", "kill", "lchown",
                        "lgetxattr", "link", "linkat", "listen", "listxattr",
                        "llistxattr", "lremovexattr", "lseek", "lsetxattr",
                        "lstat", "madvise", "memfd_create", "mincore", "mkdir",
                        "mkdirat", "mknod", "mknodat", "mlock", "mlock2",
                        "mlockall", "mmap", "mprotect", "mq_getsetattr",
                        "mq_notify", "mq_open", "mq_timedreceive",
                        "mq_timedsend", "mq_unlink", "mremap", "msgctl",
                        "msgget", "msgrcv", "msgsnd", "msync", "munlock",
                        "munlockall", "munmap", "nanosleep", "newfstatat",
                        "open", "openat", "openat2", "pause", "pipe", "pipe2",
                        "poll", "ppoll", "prctl", "pread64", "preadv",
                        "preadv2", "prlimit64", "pselect6", "pwrite64",
                        "pwritev", "pwritev2", "read", "readahead", "readlink",
                        "readlinkat", "readv", "recv", "recvfrom", "recvmmsg",
                        "recvmsg", "remap_file_pages", "removexattr", "rename",
                        "renameat", "renameat2", "restart_syscall", "rmdir",
                        "rt_sigaction", "rt_sigpending", "rt_sigprocmask",
                        "rt_sigqueueinfo", "rt_sigreturn", "rt_sigsuspend",
                        "rt_sigtimedwait", "rt_tgsigqueueinfo", "sched_get_priority_max",
                        "sched_get_priority_min", "sched_getaffinity",
                        "sched_getattr", "sched_getparam", "sched_getscheduler",
                        "sched_setaffinity", "sched_setattr", "sched_setparam",
                        "sched_setscheduler", "sched_yield", "seccomp",
                        "select", "semctl", "semget", "semop", "semtimedop",
                        "send", "sendfile", "sendmmsg", "sendmsg", "sendto",
                        "set_robust_list", "set_tid_address", "setfsgid",
                        "setfsuid", "setgid", "setgroups", "setitimer",
                        "setpgid", "setpriority", "setregid", "setresgid",
                        "setresuid", "setreuid", "setrlimit", "setsid",
                        "setsockopt", "setuid", "setxattr", "shmat", "shmctl",
                        "shmdt", "shmget", "shutdown", "sigaltstack",
                        "signalfd", "signalfd4", "socket", "socketpair",
                        "splice", "stat", "statfs", "statx", "symlink",
                        "symlinkat", "sync", "sync_file_range", "syncfs",
                        "sysinfo", "tee", "tgkill", "time", "timer_create",
                        "timer_delete", "timer_getoverrun", "timer_gettime",
                        "timer_settime", "timerfd_create", "timerfd_gettime",
                        "timerfd_settime", "times", "tkill", "truncate",
                        "uname", "unlink", "unlinkat", "utime", "utimensat",
                        "utimes", "vfork", "vmsplice", "wait4", "waitid",
                        "waitpid", "write", "writev",
                        "arch_prctl", "set_thread_area", "get_thread_area",
                        "futex_waitv", "process_vm_readv", "process_vm_writev", "clone3", "posix_spawn", "pidfd_open", "faccessat2", "execveat"
                    ],
                    "action": "SCMP_ACT_ALLOW"
                },
                {
                    "names": ["clone"],
                    "action": "SCMP_ACT_ALLOW",
                    "args": [{
                        "index": 0,
                        "value": 2114060288,
                        "op": "SCMP_CMP_MASKED_EQ",
                        "valueTwo": 0
                    }]
                },
                {
                    "names": [
                        "ptrace", "process_vm_readv", "process_vm_writev",
                        "kexec_load", "kexec_file_load",
                        "open_by_handle_at",
                        "perf_event_open",
                        "bpf"
                    ],
                    "action": "SCMP_ACT_ERRNO"
                }
            ]
        }
        """;
    }
}