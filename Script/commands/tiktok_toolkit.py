import os
import sys
import json
import requests
import subprocess
from PIL import Image, ImageEnhance, ImageStat

def fetch_tiktok_data(tiktok_url):
    try:
        api_url = f"https://www.tikwm.com/api/?url={tiktok_url}"
        headers = {"User-Agent": "Mozilla/5.0"}
        res = requests.get(api_url, headers=headers, timeout=15).json()
        if res.get("code") == 0:
            return res.get("data")
    except Exception as e:
        print(f"[Error TikTok API]: {e}", file=sys.stderr)
    return None

def download_video(tiktok_url):
    data = fetch_tiktok_data(tiktok_url)
    if not data:
        return None
    try:
        v_url = data.get("hdplay") or data.get("play")
        if not v_url.startswith("http"):
            v_url = "https://www.tikwm.com" + v_url
        content = requests.get(v_url, timeout=25).content
        out_path = f"temp_vid_{os.getpid()}.mp4"
        with open(out_path, "wb") as f:
            f.write(content)
        return out_path
    except Exception as e:
        print(f"[Video Error]: {e}", file=sys.stderr)
        return None

def download_audio(tiktok_url):
    data = fetch_tiktok_data(tiktok_url)
    if not data:
        return None
    try:
        a_url = data.get("music")
        if a_url:
            if not a_url.startswith("http"):
                a_url = "https://www.tikwm.com" + a_url
            content = requests.get(a_url, timeout=25).content
            out_path = f"temp_aud_{os.getpid()}.mp3"
            with open(out_path, "wb") as f:
                f.write(content)
            return out_path
    except Exception as e:
        print(f"[Audio Error]: {e}", file=sys.stderr)
    return None

def get_frame_score(img_path):
    try:
        img = Image.open(img_path).convert('L')
        return ImageStat.Stat(img).stddev[0]
    except Exception:
        return 0

def extract_banners(tiktok_url, count=12):
    count = max(1, min(12, int(count)))
    v_path = download_video(tiktok_url)
    if not v_path or not os.path.exists(v_path):
        return []

    try:
        cmd_dur = f"ffprobe -v error -show_entries format=duration -of default=noprintwrappers=1:nokey=1 \"{v_path}\""
        dur_str = subprocess.check_output(cmd_dur, shell=True).decode().strip()
        duration = float(dur_str)
    except Exception:
        duration = 15.0

    sample_count = 30
    step = duration / (sample_count + 1)
    scanned_frames = []

    for i in range(1, sample_count + 1):
        f_path = f"temp_frame_{os.getpid()}_{i}.jpg"
        cmd = f"ffmpeg -ss {step * i} -i \"{v_path}\" -vframes 1 -q:v 1 \"{f_path}\" -y"
        subprocess.run(cmd, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if os.path.exists(f_path):
            score = get_frame_score(f_path)
            scanned_frames.append((f_path, score))

    scanned_frames.sort(key=lambda x: x[1], reverse=True)
    selected = scanned_frames[:count]

    banner_paths = []
    for idx, (f_path, _) in enumerate(selected):
        try:
            img = Image.open(f_path).convert("RGB")
            img = ImageEnhance.Sharpness(img).enhance(2.0)
            img = ImageEnhance.Contrast(img).enhance(1.08)
            b_name = f"temp_banner_{os.getpid()}_{idx+1}.jpg"
            img.save(b_name, quality=100)
            banner_paths.append(b_name)
        except Exception:
            pass

    if os.path.exists(v_path):
        os.remove(v_path)
    for f_path, _ in scanned_frames:
        if os.path.exists(f_path):
            os.remove(f_path)

    return banner_paths

if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(1)

    action = sys.argv[1]
    url = sys.argv[2]
    param = sys.argv[3] if len(sys.argv) > 3 else "12"

    res = {}
    if action == "video":
        f = download_video(url)
        res = {"status": "ok" if f else "error", "file": f}
    elif action == "audio":
        f = download_audio(url)
        res = {"status": "ok" if f else "error", "file": f}
    elif action == "banner":
        files = extract_banners(url, param)
        res = {"status": "ok" if files else "error", "files": files}

    print(json.dumps(res))
