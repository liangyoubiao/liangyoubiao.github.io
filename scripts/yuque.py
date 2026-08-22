# -*- coding: utf-8 -*-
import re
import requests
import os
from pathlib import Path

# ===================== 配置项（修复文章目录路径）=====================
POSTS_DIR = Path("./src/content/posts")  # Vue 3 新项目: src/content/posts
IMG_SAVE_DIR = Path("./public/images/yuque")  # Vue 3 新项目: public/images/yuque
# 兼容带参数的语雀图片链接（如 ?x-oss-process=xxx）
YUQUE_IMG_PATTERN = r'(https?://cdn\.nlark\.com/yuque/.*?\.(jpeg|jpg|png|gif|webp))(\?.*?)?'
# =========================================================================

IMG_SAVE_DIR.mkdir(parents=True, exist_ok=True)


def download_yuque_image(img_url, save_path):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.yuque.com/'
    }
    try:
        resp = requests.get(img_url, headers=headers, timeout=15)
        resp.raise_for_status()
        with open(save_path, 'wb') as f:
            f.write(resp.content)
        return True
    except Exception as e:
        print(f"❌ 下载图片失败 {img_url}：{str(e)}")
        return False


def replace_img_url_in_md(md_file_path):
    if not md_file_path.exists():
        print(f"❌ 文章不存在：{md_file_path}")
        return

    with open(md_file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 提取所有语雀图片链接（兼容带参数）
    img_urls = re.findall(YUQUE_IMG_PATTERN, content)
    # 只保留图片链接的核心部分（去掉参数）
    img_urls = [url[0] for url in img_urls]

    if not img_urls:
        print(f"ℹ️ 文章 {md_file_path.name} 未找到语雀图片链接，跳过")
        return

    print(f"📄 处理文章：{md_file_path.name}，找到 {len(img_urls)} 个语雀图片")
    for img_url in img_urls:
        # 提取纯文件名（去掉链接中的路径/参数）
        img_filename = re.sub(r'.*/', '', img_url)
        # 去掉文件名中的参数（如 ?x-oss-process=xxx）
        img_filename = re.sub(r'\?.*', '', img_filename)
        img_local_path = IMG_SAVE_DIR / img_filename

        if not img_local_path.exists():
            print(f"📥 正在下载：{img_url}")
            if download_yuque_image(img_url, img_local_path):
                print(f"✅ 保存到：{img_local_path}")
            else:
                continue
        else:
            print(f"ℹ️ 图片 {img_filename} 已存在，跳过下载")

        # 替换链接（兼容带参数的原链接）
        new_img_url = f"/images/yuque/{img_filename}"
        # 替换所有匹配的链接（包括带参数的）
        content = re.sub(re.escape(img_url) + r'(\?.*?)?', new_img_url, content)
        print(f"🔄 替换链接：{img_url} → {new_img_url}")

    with open(md_file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✅ 文章 {md_file_path.name} 处理完成\n")


if __name__ == "__main__":
    print("===== 开始处理语雀图片 =====")
    # 统计找到的文章数
    md_files = list(POSTS_DIR.rglob("*.md"))
    if not md_files:
        print(f"❌ 未找到任何 Markdown 文章（目录：{POSTS_DIR}）")
    else:
        print(f"ℹ️ 共找到 {len(md_files)} 篇 Markdown 文章")
        for md_file in md_files:
            replace_img_url_in_md(md_file)
    print("===== 所有文章处理完成 =====")
