#!/usr/bin/env bash
#
# Valida o GITHUB_PAT do .env.local e o replica nos ambientes da Vercel.
# Uso: ./scripts/sync-github-token.sh [--local-only]
#
# O valor do token nunca é impresso: só o resultado das checagens.

set -euo pipefail

cd "$(dirname "$0")/.."

ENV_FILE=".env.local"
REPOS=(
  "jrbj001/colmeia---meusroteirosdefault"
  "jrbj001/image_brand_processing"
  "Mavimarmara/digital-branding"
)

if [[ ! -f "$ENV_FILE" ]]; then
  echo "erro: $ENV_FILE não encontrado" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
. "$ENV_FILE"
set +a

TOKEN="${GITHUB_TOKEN:-${GITHUB_PAT:-}}"
if [[ -z "$TOKEN" ]]; then
  echo "erro: defina GITHUB_PAT (ou GITHUB_TOKEN) em $ENV_FILE" >&2
  exit 1
fi

gh_status() {
  curl -s -o /dev/null -w '%{http_code}' \
    -H "Authorization: Bearer $TOKEN" \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    "https://api.github.com/$1"
}

echo "==> Validando credencial no GitHub"
user_status="$(gh_status user)"
if [[ "$user_status" != "200" ]]; then
  echo "falha: GET /user respondeu $user_status (401 = token expirado ou revogado)" >&2
  exit 1
fi
echo "    credencial aceita"

echo "==> Verificando acesso aos repositórios monitorados"
blocked=0
for repo in "${REPOS[@]}"; do
  status="$(gh_status "repos/$repo")"
  if [[ "$status" == "200" ]]; then
    echo "    ok    $repo"
  else
    echo "    $status   $repo (sem permissão de leitura)"
    blocked=1
  fi
done

if [[ "$blocked" == "1" ]]; then
  echo
  echo "aviso: o relatório de Entregas ignora os repos inacessíveis." >&2
  echo "Conceda leitura de Contents e Pull requests ao token nesses repositórios." >&2
fi

if [[ "${1:-}" == "--local-only" ]]; then
  echo "==> --local-only: Vercel não foi alterada"
  exit 0
fi

echo "==> Sincronizando GITHUB_PAT na Vercel"
for target in production preview development; do
  vercel env rm GITHUB_PAT "$target" --yes >/dev/null 2>&1 || true
  printf '%s' "$TOKEN" | vercel env add GITHUB_PAT "$target" >/dev/null
  echo "    atualizado: $target"
done

echo
echo "Pronto. Faça um novo deploy para produção consumir o token atualizado."
