"""
Utilitários de Manipulação do Feed (Filosofia Unix)
"""
import datetime
import json
import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FEED_JSON_PATH = os.path.join(BASE_DIR, "data", "feed.json")

CATEGORIAS = {
    "cultos": "Culto de Adoração",
    "desbravadores": "Clube de Desbravadores",
    "acao_social": "Ação Social (ASA)",
    "estudos": "Estudo Bíblico & Pequenos Grupos",
    "jovens": "Ministério Jovem & Louvor",
    "saude": "Vida Saudável",
    "geral": "Geral & Notícias"
}

def carregar_feed():
    """Carrega o arquivo JSON do feed."""
    if not os.path.exists(FEED_JSON_PATH):
        return {"last_updated": "", "posts": []}
    try:
        with open(FEED_JSON_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"[-] Erro ao ler JSON: {e}")
        sys.exit(1)

def salvar_feed(dados):
    """Salva os dados atualizados no feed.json."""
    try:
        dados["last_updated"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    except AttributeError:
        dados["last_updated"] = datetime.datetime.utcnow().isoformat() + "Z"
    try:
        with open(FEED_JSON_PATH, "w", encoding="utf-8") as f:
            json.dump(dados, f, indent=2, ensure_ascii=False)
        print(f"[+] Feed atualizado em: {FEED_JSON_PATH}")
    except Exception as e:
        print(f"[-] Erro ao salvar JSON: {e}")
        sys.exit(1)
