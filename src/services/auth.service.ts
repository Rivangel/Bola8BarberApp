import type { SessionUser } from '@/types';
import { http } from './http';
import { usuarioToSessionUser } from './mappers';
import type { LoginResponseDTO, UsuarioDTO } from './types';

/**
 * Service de autenticación. Encapsula las llamadas a /api/auth y devuelve
 * tipos de dominio de la app (`SessionUser`) junto con el token JWT.
 */

/** POST /api/auth/login — valida credenciales y devuelve token + usuario. */
async function login(
  email: string,
  password: string,
): Promise<{ token: string; user: SessionUser }> {
  const { data } = await http.post<LoginResponseDTO>('/auth/login', {
    email: email.trim().toLowerCase(),
    password,
  });
  return { token: data.token, user: usuarioToSessionUser(data.usuario) };
}

/** GET /api/auth/me — usuario de la sesión actual (requiere token). */
async function me(): Promise<SessionUser> {
  const { data } = await http.get<UsuarioDTO>('/auth/me');
  return usuarioToSessionUser(data);
}

export const authService = { login, me };
