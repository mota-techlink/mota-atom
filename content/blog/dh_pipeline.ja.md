---
title: "オープンソースプロジェクトでデジタルヒューマンを生成する方法"
date: "2025-12-26 08:31:05"
description: "MOTA ATOMオープンソースプロジェクトより同期：dh_pipeline 技術ホワイトペーパー"
categories: ["オープンソース", "ホワイトペーパー"]
tags: ["データパイプライン", "IoT"]
image: "https://raw.githubusercontent.com/mota-techlink/dh_pipeline/refs/heads/main/assets/images/cover.jpg"
canonicalUrl: "https://github.com/mota-techlink/dh_pipeline"
keywords: ["デジタルヒューマン", "LivePortrait", "MuseTalk", "AI動画パイプライン", "MOTA ATOM"]
author: "MOTA ATOM"
---

# オールインワン デジタルヒューマン動画パイプライン
<p align="center">
  <img src="https://raw.githubusercontent.com/mota-techlink/dh_pipeline/refs/heads/main/assets/images/cover.jpg" alt="MOTA dh_pipeline"/>
</p>

ローカル環境でリアルなデジタルヒューマン動画を生成するために設計された、モジュール式で高効率なパイプラインです。LivePortraitによるモーション同期、MuseTalkによる精密なリップシンクを統合し、MOTA ATOMの最適化ロジックによって駆動されます。

<div align="left">  
  <a href="https://zdoc.app/zh/mota-techlink/dh_pipeline">中文</a> | 
  <a href="https://zdoc.app/es/mota-techlink/dh_pipeline">Español</a> |  
  <a href="https://zdoc.app/de/mota-techlink/dh_pipeline">Deutsch</a> | 
  <a href="https://zdoc.app/fr/mota-techlink/dh_pipeline">Français</a> |      
  <a href="https://zdoc.app/pt/mota-techlink/dh_pipeline">Português</a> |   
  <a href="https://zdoc.app/ru/mota-techlink/dh_pipeline">Русский</a> |   
  <a href="https://zdoc.app/ko/mota-techlink/dh_pipeline">한국어</a> |   
  <a href="https://zdoc.app/ja/mota-techlink/dh_pipeline">日本語</a> |     
</div>

<br/>

> 本プロジェクトの価値：
>
> 単体ツールとは異なり、dh_pipelineはTorch 2.1.2とMMCV間のバージョン競合を解決し、ワンクリックデプロイ体験を保証します。
<br/>

## 1. 環境準備

> condaの使用を強く推奨します
```bash
mkdir dh_pipeline
cd dh_pipeline
conda create -n dh_pipeline python=3.10 -y
conda activate dh_pipeline
```

## 2. 翻訳と音声生成
> Google Deep TranslatorとMicrosoft EdgeTTSをインストールし、コンテンツを元の言語からターゲット言語に翻訳した後、対応する音声を生成します。
```bash
pip install deep-translator edge-tts
```

> 翻訳とTTS生成を実行
```bash
python run_tts.py
```

## 3. 動画合成
> 静止したアバターをサンプル動画内の人物の動きに合わせて動かします。

<p align="center">
  <img src="https://github.com/KlingTeam/LivePortrait/raw/main/assets/docs/showcase2.gif" alt="image"/>
</p>

### a. LivePortraitソースコードの取得
```bash
git clone https://github.com/KwaiVGI/LivePortrait
cd LivePortrait
```
### b. 依存関係のインストール

<details> 
 <summary>CUDAバージョンを確認してください！！！</summary>

```
nvcc -V # バージョン例：11.1, 11.8, 12.1 など
```
次に対応するtorchバージョンをインストールします。以下は異なるCUDAバージョンの例です。お使いのCUDAバージョンが記載されていない場合は、[PyTorch公式サイト](https://pytorch.org/get-started/previous-versions)でインストールコマンドを確認してください：
```bash  
  # CUDA 11.8
  pip install torch==2.1.2 torchvision==0.16.2 torchaudio==2.1.2 --index-url https://download.pytorch.org/whl/cu118
  
  # CUDA 12.1
  pip install torch==2.1.2 torchvision==0.16.2 torchaudio==2.1.2 --index-url https://download.pytorch.org/whl/cu121
  # ...
  ```
  > `nvidia-smi` でCUDAバージョンを確認できます。CUDAバージョンが11.8以上の場合は、CUDA 11.8以上のインストールコマンドを使用し、MuseTalkとの競合を避けるためtorchバージョンは常に2.1.2を維持してください。
  **Numpyを確認してください。2.0より大きい場合はダウングレードが必要です**
  ```
  # Numpyバージョンの確認
  pip show numpy

  pip install "numpy==1.26.4"
  ```
</details>

残りの依存関係をインストール：

```bash
pip install -r requirements.txt
```

### c. 事前学習済みウェイトのダウンロード 📥
最も簡単な方法はHuggingFaceからダウンロードすることです：

```bash
# !pip install -U "huggingface_hub[cli]"
huggingface-cli download KlingTeam/LivePortrait --local-dir pretrained_weights --exclude "*.git*" "README.md" "docs"
```

Huggingfaceにアクセスできない場合は、hf-mirrorを使用してダウンロードできます：
```bash
# !pip install -U "huggingface_hub[cli]"
export HF_ENDPOINT=https://hf-mirror.com
huggingface-cli download KlingTeam/LivePortrait --local-dir pretrained_weights --exclude "*.git*" "README.md" "docs"
```

[Google Drive](https://drive.google.com/drive/folders/1UtKgzKjFAOmZkhNK-OYT0caJ_w2XAnib) または [百度云](https://pan.baidu.com/s/1MGctWmNla_vZxDbEp2Dtzw?pwd=z5cn) からすべての事前学習済みウェイトをダウンロードすることもできます。解凍後、./pretrained_weights ディレクトリに配置してください。

ディレクトリ構造が以下のようになっていることを確認してください：

> `pretrained_weights` ディレクトリ構造

```text
pretrained_weights
├── insightface
│   └── models
│       └── buffalo_l
│           ├── 2d106det.onnx
│           └── det_10g.onnx
├── liveportrait
│   ├── base_models
│   │   ├── appearance_feature_extractor.pth
│   │   ├── motion_extractor.pth
│   │   ├── spade_generator.pth
│   │   └── warping_module.pth
│   ├── landmark.onnx
│   └── retargeting_models
│       └── stitching_retargeting_module.pth
└── liveportrait_animals
    ├── base_models
    │   ├── appearance_feature_extractor.pth
    │   ├── motion_extractor.pth
    │   ├── spade_generator.pth
    │   └── warping_module.pth
    ├── retargeting_models
    │   └── stitching_retargeting_module.pth
    └── xpose.pth
```

**実行開始**
> デフォルトでは結果はLivePortrait/animationsに保存されます
```bash
 python inference.py
```

または画像とドライビング動画のパスを指定

```bash
python inference.py  --source "assets/examples/source/s12.jpg"   --driving "assets/examples/driving/d13.mp4"
```

## 4. リップシンク

![モデル構造](https://github.com/user-attachments/assets/02f4a214-1bdd-4326-983c-e70b478accba)

## デモ事例

<table>
<tr>
<td width="33%">

### 入力動画
---
https://github.com/TMElyralab/MuseTalk/assets/163980830/37a3a666-7b90-4244-8d3a-058cb0e44107

---
https://github.com/user-attachments/assets/1ce3e850-90ac-4a31-a45f-8dfa4f2960ac

---
https://github.com/user-attachments/assets/fa3b13a1-ae26-4d1d-899e-87435f8d22b3

---
https://github.com/user-attachments/assets/15800692-39d1-4f4c-99f2-aef044dc3251

---
https://github.com/user-attachments/assets/a843f9c9-136d-4ed4-9303-4a7269787a60

---
https://github.com/user-attachments/assets/6eb4e70e-9e19-48e9-85a9-bbfa589c5fcb

</td>
<td width="33%">

### MuseTalk 1.0
---
https://github.com/user-attachments/assets/c04f3cd5-9f77-40e9-aafd-61978380d0ef

---
https://github.com/user-attachments/assets/2051a388-1cef-4c1d-b2a2-3c1ceee5dc99

---
https://github.com/user-attachments/assets/b5f56f71-5cdc-4e2e-a519-454242000d32

---
https://github.com/user-attachments/assets/a5843835-04ab-4c31-989f-0995cfc22f34

---
https://github.com/user-attachments/assets/3dc7f1d7-8747-4733-bbdd-97874af0c028

---
https://github.com/user-attachments/assets/3c78064e-faad-4637-83ae-28452a22b09a

</td>
<td width="33%">

### MuseTalk 1.5
---
https://github.com/user-attachments/assets/999a6f5b-61dd-48e1-b902-bb3f9cbc7247

---
https://github.com/user-attachments/assets/d26a5c9a-003c-489d-a043-c9a331456e75

---
https://github.com/user-attachments/assets/471290d7-b157-4cf6-8a6d-7e899afa302c

---
https://github.com/user-attachments/assets/1ee77c4c-8c70-4add-b6db-583a12faa7dc

---
https://github.com/user-attachments/assets/370510ea-624c-43b7-bbb0-ab5333e0fcc4

---
https://github.com/user-attachments/assets/b011ece9-a332-4bc1-b8b7-ef6e383d7bde

</td>
</tr>
</table>

### a. コードのダウンロード
```bash
git clone https://github.com/TMElyralab/MuseTalk.git
cd MuseTalk
```

### b. 依存関係のインストール

```bash
pip install -r requirements.txt

# numpyが2.0未満であることを確認
# pip install "numpy==1.26.4"

# torchが2.1.2であることを確認
#pip install torch==2.1.2 torchvision==0.16.2 torchaudio==2.1.2 --index-url https://download.pytorch.org/whl/cu118

# mmcvバージョンが以下の通りであることを確認：
wget https://download.openmmlab.com/mmcv/dist/cu118/torch2.1.0/mmcv-2.1.0-cp310-cp310-manylinux1_x86_64.whl
pip install mmcv-2.1.0-cp310-cp310-manylinux1_x86_64.whl

# 残りの依存関係のバージョンを厳密に制限
pip install "transformers==4.37.2" "diffusers==0.24.0" "accelerate==0.26.0" "huggingface-hub==0.23.5" "tokenizers==0.15.2" "opencv-python-headless==4.9.0.80" "omegaconf" "imageio-ffmpeg" "av" "scipy"

# 最後にOpenMMLab関連をインストール
pip install "mmengine>=0.10.0" "mmpose>=1.1.0" "mmdet>=3.1.0"

# 検証
python -c "import torch; import cv2; import numpy; from mmcv.ops import MultiScaleDeformableAttention; print(f'✅ Perfect enviroment: Torch={torch.__version__}, NumPy={numpy.__version__}, MMCV OK')"
```

> '✅ Perfect enviroment: Torch=2.1.2+cu118, NumPy=1.26.4, MMCV OK' と表示されない場合は、最初からやり直してください！！！

### c. ウェイトのダウンロード
ウェイトは2つの方法でダウンロードできます：

#### 方法1：ダウンロードスクリプトを使用
自動ダウンロードスクリプトを提供しています：

Linux：
```bash
sh ./download_weights.sh
```

Windows：
```batch
# スクリプトを実行
download_weights.bat
```

以下のリンクからウェイトを手動でダウンロードすることもできます：

1. 当社がトレーニングした [ウェイト](https://huggingface.co/TMElyralab/MuseTalk/tree/main) をダウンロード
2. その他コンポーネントのウェイトをダウンロード：
   - [sd-vae-ft-mse](https://huggingface.co/stabilityai/sd-vae-ft-mse/tree/main)
   - [whisper](https://huggingface.co/openai/whisper-tiny/tree/main)
   - [dwpose](https://huggingface.co/yzd-v/DWPose/tree/main)
   - [syncnet](https://huggingface.co/ByteDance/LatentSync/tree/main)
   - [face-parse-bisent](https://drive.google.com/file/d/154JgKpzCPW82qINcVieuPH3fZ2e0P812/view?pli=1)
   - [resnet18](https://download.pytorch.org/models/resnet18-5c106cde.pth)

最終的に、これらのウェイトは `models` ディレクトリ内で以下の構造に配置する必要があります：
```
./models/
├── musetalk
│   └── musetalk.json
│   └── pytorch_model.bin
├── musetalkV15
│   └── musetalk.json
│   └── unet.pth
├── syncnet
│   └── latentsync_syncnet.pt
├── dwpose
│   └── dw-ll_ucoco_384.pth
├── face-parse-bisent
│   ├── 79999_iter.pth
│   └── resnet18-5c106cde.pth
├── sd-vae
│   ├── config.json
│   └── diffusion_pytorch_model.bin
└── whisper
    ├── config.json
    ├── pytorch_model.bin
    └── preprocessor_config.json
```

### d. 推論の実行
```bash
sh inference.sh v1.5 realtime
```

## ❓ よくある質問（FAQ）

**Q：このパイプラインはコンシューマー向けGPUで実行できますか？**
A：はい、8GB以上のVRAMを搭載したNVIDIA GPU（RTX 3060以上）向けに最適化されています。

**Q：リアルタイム生成に対応していますか？**
A：現在は高速オフライン推論をサポートしています。リアルタイム対応はMOTA ATOMのロードマップに含まれています。

**Q：なぜ他のプロバイダーではなくEdge-TTSを使用するのですか？**
A：Edge-TTSは、自然な韻律とゼロコストのローカル統合の間で最適なバランスを提供します。
