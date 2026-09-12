#!/usr/bin/env python3
"""
====================================================================
Sincronizador de Feed e Fotos - Igreja Adventista do Sétimo Dia
Desenvolvido para gerenciamento fácil e dinâmico de publicações
====================================================================

Este script permite que você mantenha o site da igreja sempre
atualizado sem precisar mexer no código HTML/CSS!

Como usar:
  1. Modo Interativo (fácil):
     python3 scripts/sync_instagram.py --interactive

  2. Adicionar post via comando rápido:
     python3 scripts/sync_instagram.py --add --title "Batismo de Primavera" \
         --caption "Celebração emocionante de 10 vidas entregues a Cristo!" \
         --category "cultos" --image "assets/images/hero_worship.jpg"

  3. Listar todos os posts atuais:
     python3 scripts/sync_instagram.py --list

  4. Simular busca de novos posts do Instagram/Redes:
     python3 scripts/sync_instagram.py --sync
====================================================================
"""

import argparse
import datetime
import json
import os
import sys

# Caminho para a base de dados do feed
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
        print(f"[-] Erro: Arquivo {FEED_JSON_PATH} não encontrado.")
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
        print(f"[+] Feed atualizado com sucesso em: {FEED_JSON_PATH}")
    except Exception as e:
        print(f"[-] Erro ao salvar JSON: {e}")
        sys.exit(1)

def listar_posts():
    """Lista as publicações cadastradas no site."""
    feed = carregar_feed()
    posts = feed.get("posts", [])
    print("\n" + "=" * 60)
    print(f"  POSTS NO SITE DA IGREJA ({len(posts)} encontrados)")
    print(f"  Última atualização: {feed.get('last_updated', 'N/A')}")
    print("=" * 60)
    for idx, p in enumerate(posts, start=1):
        print(f"[{idx}] {p.get('title')} ({p.get('category_label')})")
        print(f"    Data: {p.get('date')} | Curtidas: {p.get('likes')}")
        print(f"    Imagem: {p.get('image')}")
        print(f"    Legenda: {p.get('caption')[:80]}...")
        print("-" * 60)

def adicionar_post(title, caption, category, image, link=None, tags=None):
    """Insere um novo post no topo da lista."""
    feed = carregar_feed()
    
    # Validação da categoria
    cat_key = category.lower().strip()
    if cat_key not in CATEGORIAS:
        cat_key = "geral"
    cat_label = CATEGORIAS[cat_key]

    # Data atual formatada em português
    meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ]
    hoje = datetime.date.today()
    data_formatada = f"{hoje.day:02d} de {meses[hoje.month - 1]} de {hoje.year}"

    # Criação do novo post
    novo_post = {
        "id": f"post_{len(feed.get('posts', [])) + 1:02d}",
        "category": cat_key,
        "category_label": cat_label,
        "image": image or "assets/images/hero_worship.jpg",
        "title": title,
        "caption": caption,
        "date": data_formatada,
        "likes": 12,
        "link": link or "https://www.instagram.com",
        "tags": tags or ["#IASD", "#IgrejaAdventista", f"#{cat_key.capitalize()}"]
    }

    # Adiciona no topo
    feed.setdefault("posts", []).insert(0, novo_post)
    salvar_feed(feed)
    print(f"[✓] Post '{title}' adicionado com sucesso ao site!")

def modo_interativo():
    """Menu interativo para facilitar para quem não quer digitar comandos longos."""
    print("\n--- Adicionar Nova Foto/Post ao Site da Igreja ---")
    title = input("Título da foto/publicação: ").strip()
    if not title:
        print("[-] O título não pode ser vazio.")
        return

    caption = input("Legenda / Descrição: ").strip()
    
    print("\nEscolha a categoria:")
    for key, label in CATEGORIAS.items():
        print(f"  - {key}: {label}")
    category = input("Digite o identificador da categoria (ex: cultos, desbravadores): ").strip()
    
    image = input("Caminho da imagem (ex: assets/images/minha_foto.jpg): ").strip()
    if not image:
        image = "assets/images/hero_worship.jpg"

    tags_raw = input("Tags separadas por vírgula (ex: #Sabado, #Musica): ").strip()
    tags = [t.strip() for t in tags_raw.split(",") if t.strip()] if tags_raw else None

    adicionar_post(title, caption, category, image, tags=tags)

def simular_sincronizacao():
    """
    Simula uma rotina de sincronização (ex: scraping de feed público ou webhook).
    """
    print("[*] Conectando ao serviço de sincronização do Instagram...")
    print("[*] Verificando novas mídias em @iasdcentral...")
    feed = carregar_feed()
    print(f"[✓] Conexão estabelecida com sucesso. {len(feed.get('posts', []))} publicações verificadas.")
    salvar_feed(feed)
    print("[✓] O arquivo 'data/feed.json' está pronto e o site exibirá as fotos atualizadas!")

def main():
    parser = argparse.ArgumentParser(
        description="Gerenciador e Sincronizador de Feed para o site da Igreja Adventista"
    )
    parser.add_argument("--list", action="store_true", help="Listar publicações existentes")
    parser.add_argument("--interactive", action="store_true", help="Adicionar post de forma interativa")
    parser.add_argument("--sync", action="store_true", help="Simular sincronização com redes sociais")
    parser.add_argument("--add", action="store_true", help="Adicionar post via argumentos")
    parser.add_argument("--title", type=str, help="Título do post")
    parser.add_argument("--caption", type=str, help="Legenda do post")
    parser.add_argument("--category", type=str, default="cultos", help="Categoria do post")
    parser.add_argument("--image", type=str, help="Caminho ou URL da imagem")
    parser.add_argument("--link", type=str, help="Link externo (ex: post do Instagram)")

    args = parser.parse_args()

    if args.list:
        listar_posts()
    elif args.interactive:
        modo_interativo()
    elif args.sync:
        simular_sincronizacao()
    elif args.add:
        if not args.title or not args.caption:
            print("[-] Erro: Para usar --add, informe --title e --caption.")
            sys.exit(1)
        adicionar_post(args.title, args.caption, args.category, args.image, args.link)
    else:
        # Se nenhum argumento for passado, exibe a listagem e instrução
        listar_posts()
        print("\nDica: Execute 'python3 scripts/sync_instagram.py --interactive' para cadastrar novas fotos!")

if __name__ == "__main__":
    main()
