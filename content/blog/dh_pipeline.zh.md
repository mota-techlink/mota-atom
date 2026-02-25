---
title: "如何通过开源项目生成数字人"
date: "2025-12-26 08:31:05"
description: "同步自 MOTA ATOM 开源项目：dh_pipeline 技术白皮书"
categories: ["开源", "白皮书"]
tags: ["数据管道", "IoT"]
image: "https://raw.githubusercontent.com/mota-techlink/dh_pipeline/refs/heads/main/assets/images/cover.jpg"
canonicalUrl: "https://github.com/mota-techlink/dh_pipeline"
keywords: ["数字人", "LivePortrait", "MuseTalk", "AI 视频管道", "MOTA ATOM"]
author: "MOTA ATOM"
---

# 一体化数字人视频管道
<p align="center">
  <img src="https://raw.githubusercontent.com/mota-techlink/dh_pipeline/refs/heads/main/assets/images/cover.jpg" alt="MOTA dh_pipeline"/>
</p>

一个模块化、高效率的管道，专为本地生成逼真数字人视频而设计。它集成了 LivePortrait 用于动作同步，MuseTalk 用于精准唇形同步，并由 MOTA ATOM 的优化逻辑驱动。

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

> 本项目的价值：
>
> 与独立工具不同，dh_pipeline 解决了 Torch 2.1.2 与 MMCV 之间的版本冲突，确保一键部署体验。
<br/>

## 1. 环境准备

> 强烈建议使用 conda
```bash
mkdir dh_pipeline
cd dh_pipeline
conda create -n dh_pipeline python=3.10 -y
conda activate dh_pipeline
```

## 2. 翻译与语音生成
> 安装 Google Deep Translator 和 Microsoft EdgeTTS，将内容从原始语言翻译为目标语言，然后相应生成语音。
```bash
pip install deep-translator edge-tts
```

> 运行翻译和 TTS 生成
```bash
python run_tts.py
```

## 3. 视频合成
> 让静态头像随样本视频中任何人的动作一起运动。

<p align="center">
  <img src="https://github.com/KlingTeam/LivePortrait/raw/main/assets/docs/showcase2.gif" alt="image"/>
</p>

### a. 获取 LivePortrait 源码
```bash
git clone https://github.com/KwaiVGI/LivePortrait
cd LivePortrait
```
### b. 安装依赖

<details> 
 <summary>检查你的 CUDA 版本！！！</summary>

```
nvcc -V # 示例版本：11.1, 11.8, 12.1 等
```
然后安装对应的 torch 版本。以下是不同 CUDA 版本的示例。如果你的 CUDA 版本未列出，请访问 [PyTorch 官方网站](https://pytorch.org/get-started/previous-versions)获取安装命令：
```bash  
  # CUDA 11.8
  pip install torch==2.1.2 torchvision==0.16.2 torchaudio==2.1.2 --index-url https://download.pytorch.org/whl/cu118
  
  # CUDA 12.1
  pip install torch==2.1.2 torchvision==0.16.2 torchaudio==2.1.2 --index-url https://download.pytorch.org/whl/cu121
  # ...
  ```
  > 你可以使用 `nvidia-smi` 检查 CUDA 版本。如果 CUDA 版本为 11.8 或更高，请使用 CUDA 11.8 或以上的安装命令，并始终保持 torch 版本为 2.1.2 以避免与 MuseTalk 的冲突。
  **检查 Numpy，不应大于 2.0，如果是则需降级**
  ```
  # 检查 Numpy 版本
  pip show numpy

  pip install "numpy==1.26.4"
  ```
</details>

安装其余依赖：

```bash
pip install -r requirements.txt
```

### c. 下载预训练权重 📥
最简单的方式是从 HuggingFace 下载：

```bash
# !pip install -U "huggingface_hub[cli]"
huggingface-cli download KlingTeam/LivePortrait --local-dir pretrained_weights --exclude "*.git*" "README.md" "docs"
```

如果无法访问 Huggingface，可以使用 hf-mirror 下载：
```bash
# !pip install -U "huggingface_hub[cli]"
export HF_ENDPOINT=https://hf-mirror.com
huggingface-cli download KlingTeam/LivePortrait --local-dir pretrained_weights --exclude "*.git*" "README.md" "docs"
```

也可以从 [Google Drive](https://drive.google.com/drive/folders/1UtKgzKjFAOmZkhNK-OYT0caJ_w2XAnib) 或 [百度云](https://pan.baidu.com/s/1MGctWmNla_vZxDbEp2Dtzw?pwd=z5cn) 下载所有预训练权重。解压后放入 ./pretrained_weights 目录。

确保目录结构如下：

> `pretrained_weights` 目录结构

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

**开始运行**
> 默认结果保存在 LivePortrait/animations
```bash
 python inference.py
```

或指定图片和驱动视频路径

```bash
python inference.py  --source "assets/examples/source/s12.jpg"   --driving "assets/examples/driving/d13.mp4"
```

## 4. 口型匹配

![模型结构](https://github.com/user-attachments/assets/02f4a214-1bdd-4326-983c-e70b478accba)

## 案例展示

<table>
<tr>
<td width="33%">

### 输入视频
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

### a. 下载代码
```bash
git clone https://github.com/TMElyralab/MuseTalk.git
cd MuseTalk
```

### b. 安装依赖

```bash
pip install -r requirements.txt

# 确保 numpy 低于 2.0
# pip install "numpy==1.26.4"

# 确保 torch 为 2.1.2
#pip install torch==2.1.2 torchvision==0.16.2 torchaudio==2.1.2 --index-url https://download.pytorch.org/whl/cu118

# 确保 mmcv 版本如下：
wget https://download.openmmlab.com/mmcv/dist/cu118/torch2.1.0/mmcv-2.1.0-cp310-cp310-manylinux1_x86_64.whl
pip install mmcv-2.1.0-cp310-cp310-manylinux1_x86_64.whl

# 严格限制其余依赖版本
pip install "transformers==4.37.2" "diffusers==0.24.0" "accelerate==0.26.0" "huggingface-hub==0.23.5" "tokenizers==0.15.2" "opencv-python-headless==4.9.0.80" "omegaconf" "imageio-ffmpeg" "av" "scipy"

# 最后安装 OpenMMLab 组件
pip install "mmengine>=0.10.0" "mmpose>=1.1.0" "mmdet>=3.1.0"

# 验证
python -c "import torch; import cv2; import numpy; from mmcv.ops import MultiScaleDeformableAttention; print(f'✅ Perfect enviroment: Torch={torch.__version__}, NumPy={numpy.__version__}, MMCV OK')"
```

> 如果没有显示 '✅ Perfect enviroment: Torch=2.1.2+cu118, NumPy=1.26.4, MMCV OK'，请从头开始！！！

### c. 下载权重
你可以通过两种方式下载权重：

#### 方式一：使用下载脚本
我们提供了自动下载脚本：

Linux：
```bash
sh ./download_weights.sh
```

Windows：
```batch
# 运行脚本
download_weights.bat
```

你也可以从以下链接手动下载权重：

1. 下载我们训练的 [权重](https://huggingface.co/TMElyralab/MuseTalk/tree/main)
2. 下载其他组件的权重：
   - [sd-vae-ft-mse](https://huggingface.co/stabilityai/sd-vae-ft-mse/tree/main)
   - [whisper](https://huggingface.co/openai/whisper-tiny/tree/main)
   - [dwpose](https://huggingface.co/yzd-v/DWPose/tree/main)
   - [syncnet](https://huggingface.co/ByteDance/LatentSync/tree/main)
   - [face-parse-bisent](https://drive.google.com/file/d/154JgKpzCPW82qINcVieuPH3fZ2e0P812/view?pli=1)
   - [resnet18](https://download.pytorch.org/models/resnet18-5c106cde.pth)

最终这些权重应按如下结构组织在 `models` 目录中：
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

### d. 运行推理
```bash
sh inference.sh v1.5 realtime
```

## ❓ 常见问题（FAQ）

**问：这个管道可以在消费级 GPU 上运行吗？**
答：可以，它针对至少 8GB 显存的 NVIDIA GPU（如 RTX 3060 及以上）进行了优化。

**问：是否支持实时生成？**
答：目前支持高速离线推理。实时支持已在 MOTA ATOM 路线图中。

**问：为什么使用 Edge-TTS 而不是其他服务商？**
答：Edge-TTS 在自然韵律和零成本本地集成之间提供了最佳平衡。
