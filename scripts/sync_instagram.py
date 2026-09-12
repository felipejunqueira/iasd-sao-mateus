#!/usr/bin/env python3
"""
CLI de Sincronização e Cadastro de Feed (Filosofia Unix < 85 linhas)
"""
import argparse
import datetime
import sys
from feed_utils import CATEGORIAS, carregar_feed, salvar_feed

def listar_posts():
    feed = carregar_feed()
    posts = feed.get("posts", [])
    print(f"\n--- {len(posts)} POSTS NO FEED DA IASD SÃO MATEUS ---")
    for idx, p in enumerate(posts, start=1):
        print(f"[{idx}] {p.get('title')} ({p.get('category_label')}) - {p.get('date')}")

def adicionar_post(title, caption, category, image, link=None, tags=None):
    feed = carregar_feed()
    cat_key = category.lower().strip() if category else "geral"
    cat_label = CATEGORIAS.get(cat_key, "Geral")
    hoje = datetime.date.today()
    meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
    data_fmt = f"{hoje.day:02d} de {meses[hoje.month - 1]} de {hoje.year}"

    novo_post = {
        "id": f"post_{len(feed.get('posts', [])) + 1:02d}",
        "category": cat_key, "category_label": cat_label,
        "image": image or "assets/images/real_worship.jpg",
        "title": title, "caption": caption, "date": data_fmt, "likes": 10,
        "link": link or "https://www.instagram.com/adventistassaomateus.sp/",
        "tags": tags or ["#IASD", "#SãoMateus", f"#{cat_key}"]
    }
    feed.setdefault("posts", []).insert(0, novo_post)
    salvar_feed(feed)
    print(f"[✓] Post '{title}' cadastrado com sucesso!")

def modo_interativo():
    print("\n--- Novo Post no Feed da Igreja ---")
    title = input("Título: ").strip()
    if not title: return
    caption = input("Legenda: ").strip()
    print("Categorias:", ", ".join(CATEGORIAS.keys()))
    category = input("Categoria: ").strip()
    image = input("Caminho da Imagem: ").strip()
    adicionar_post(title, caption, category, image)

def main():
    parser = argparse.ArgumentParser(description="Gerenciador de Feed IASD São Mateus")
    parser.add_argument("--list", action="store_true", help="Listar publicações")
    parser.add_argument("--interactive", action="store_true", help="Cadastro interativo")
    parser.add_argument("--add", action="store_true", help="Adicionar post via CLI")
    parser.add_argument("--title", type=str, help="Título")
    parser.add_argument("--caption", type=str, help="Legenda")
    parser.add_argument("--category", type=str, default="cultos", help="Categoria")
    parser.add_argument("--image", type=str, help="Imagem")
    args = parser.parse_args()

    if args.list: listar_posts()
    elif args.interactive: modo_interativo()
    elif args.add and args.title and args.caption:
        adicionar_post(args.title, args.caption, args.category, args.image)
    else:
        listar_posts()
        print("\nDica: use --interactive para cadastrar fotos facilmente.")

if __name__ == "__main__":
    main()
