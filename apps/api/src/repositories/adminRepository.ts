import { SESSION_HOURS } from '../config/auth'

export async function createSession(
  db: D1Database,
  tokenHash: string,
  githubId: number,
): Promise<void> {
  await db.batch([
    // Aprovechamos para limpiar las sesiones vencidas
    db.prepare("DELETE FROM admin_sessions WHERE expires_at <= datetime('now')"),
    db
      .prepare(
        "INSERT INTO admin_sessions (token_hash, github_id, expires_at) VALUES (?, ?, datetime('now', ?))",
      )
      .bind(tokenHash, githubId, `+${SESSION_HOURS} hours`),
  ])
}

export async function findSession(
  db: D1Database,
  tokenHash: string,
): Promise<{ github_id: number } | null> {
  return db
    .prepare(
      "SELECT github_id FROM admin_sessions WHERE token_hash = ? AND expires_at > datetime('now')",
    )
    .bind(tokenHash)
    .first<{ github_id: number }>()
}

export async function deleteSession(db: D1Database, tokenHash: string): Promise<void> {
  await db.prepare('DELETE FROM admin_sessions WHERE token_hash = ?').bind(tokenHash).run()
}

export async function writeAudit(db: D1Database, action: string, detail?: string): Promise<void> {
  await db
    .prepare('INSERT INTO audit_log (action, detail) VALUES (?, ?)')
    .bind(action, detail ?? null)
    .run()
}