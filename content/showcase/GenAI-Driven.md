---
title: "GenAI-Driven Edge Computing: Smart Safety for Vertical Transport"
meta_title: "GenAI & Edge AI for Smart Elevator Safety - MOTA ATOM"
description: "Revolutionizing object detection with synthetic data generation and NPU quantization for real-time electric scooter detection in elevators. A privacy-first, low-latency Edge AI solution."
date: 2025-12-08
image: "/images/showcase/Edge-Computing/GenAI-Cover.png"
categories: ["Edge AI", "IOT","AI Engineering"]
tags: ["GenAI", "Edge Computing", "Computer Vision", "NPU", "IoT", "Synthetic Data"]
draft: false
---

## Project Overview

In high-density urban environments, the unauthorized transport of electric motocycles (e-motocycles) in elevators poses a severe fire hazard due to lithium battery instability. Property managers face a critical safety requirement: <Gradient from="red" to="orange"> stop e-motocycles before the doors close. </Gradient>

**MOTA ATOM** engineered an end-to-end **Edge AIoT solution** that detects prohibited objects in real-time. By pivoting from traditional data collection to **Generative AI (GenAI) synthetic data creation**, we bypassed data scarcity bottlenecks and deployed a highly optimized, privacy-compliant model directly onto embedded hardware.

## The Challenge: Safety vs. Data Constraints

Developing a robust detection system for the confined, dynamic environment of an elevator car presents unique engineering hurdles:

1.  **Data Scarcity & Privacy (GDPR):** Collecting real-world training data is legally complex. Capturing images of residents in elevators raises significant privacy concerns (GDPR/PIPL), and staging photos of motocycles is labor-intensive.
2.  **The "Long Tail" of Corner Cases:** Models often fail in unpredictable scenarios—crowded elevators, different lighting conditions, partially occluded motocycles, or confusing objects (e.g., wheelchairs vs. motocycles).
3.  **Edge Constraints:** The solution must operate **offline** with **ultra-low latency**. Sending video streams to the cloud for inference introduces unacceptable lag and dependency on internet connectivity. The system must run on low-power, cost-effective NPU hardware.

## The Solution: A GenAI-First Workflow

We reimagined the computer vision development lifecycle. Instead of 'collecting' data, we 'generated' it. This approach reduced the development cycle from months to days while improving model robustness.

### 1. Synthetic Data Generation (GenAI)
We utilized Multimodal Large Language Models (LLMs) and diffusion models to generate photorealistic scenes.
![GenAI Samples](/images/showcase/Edge-Computing/GenAI-Samples.jpg)
* **Domain Randomization:** We used prompts to vary lighting, elevator textures (mirrors, steel), and angles.
* **Privacy by Design:** Since the humans in the training data are AI-generated, there are no privacy or consent issues.
* **Edge Case Coverage:** We synthetically generated rare scenarios, such as motocycles covered by raincoats or viewed from extreme top-down angles.
 

* **Industry Validation:** <GifVideo src="/videos/GenAI_compressed.mp4" align="left"  width="30%" />This data-centric strategy mirrors the <Gradient from="red" to="orange">advanced methodologies employed by Tesla, who utilize generative simulation and synthetic data to <a href="https://bernardmarr.com/how-tesla-is-using-artificial-intelligence-to-create-the-autonomous-cars-of-the-future/"> train their Autopilot systems</a> </Gradient> for rare "corner cases" that are statistically improbable to capture in the real world.  This proves that synthetic data is not just a workaround, but a superior path to robustness.  

<div style={{ clear: 'both' }} />

### 2. Automated Annotation Pipeline
Manual labeling is the bottleneck of AI training. We integrated the <ColorText color="green">Segment Anything Model</ColorText> [SAM3](https://github.com/facebookresearch/sam3) into our pipeline.
* **Auto-Segmentation:** SAM automatically generated pixel-perfect bounding boxes and segmentation masks for the synthetic dataset.
* **Efficiency:** This automation reduced data preparation time by **90%** while ensuring consistent label quality that outperforms human annotators.
![](/images/showcase/Edge-Computing/SAM.jpg)

## Technical Execution: Edge Optimization

Training a model is only half the battle; deploying it to a low-power chip is where MOTA ATOM excels.

### NPU Quantization & Compression
To run on cost-effective IoT hardware (RISC-V/ARM Architectures), we could not use heavy GPU models.
* **PTQ (Post-Training Quantization):** We compressed the YOLO-based architecture from FP32 (Floating Point 32) to **INT8 (Integer 8)**.
* **Result:** This reduced the model size by **75%** and increased inference speed by **300%**, allowing it to run smoothly on edge NPUs with limited RAM.
![GenAI Samples](/images/showcase/Edge-Computing/Quantization.jpg)

### Real-Time Logic & Control
The system serves as an active controller, not just a passive camera.
* **Latency:** less than 100ms inference time.
* **Action:** Upon detecting a target with high confidence (>0.85), the edge device triggers a GPIO relay to **hold the elevator doors open** and plays a voice alert ("Prohibited object detected").
* **Safety Loop:** The elevator will not move until the object is removed, physically preventing the hazard.
![GenAI Samples](/images/showcase/Edge-Computing/CV-Controls.jpg)

## Impact & Results

* **Speed to Market:** Reduced model development time from **3 months to 2 weeks**.
* **Privacy Compliance:** 100% compliant with data privacy regulations via synthetic data.
* **Cost Efficiency:** Enabled the use of low-cost edge chips instead of expensive industrial PCs.
* **Accuracy:** Achieved **99.2%** detection accuracy in pilot deployments, successfully distinguishing between wheelchairs (allowed) and e-motocycles (prohibited).

## The Tech Stack

* **Training Framework:** PyTorch, Ultralytics YOLO
* **Data Generation:** Stable Diffusion, ControlNet
* **Annotation:** Meta AI SAM (Segment Anything Model)
* **Edge Inference:** TensorRT / TFLite Micro / RKNN (Rockchip NPU)
* **Hardware:** Custom RISC-V / ARM Embedded Board with Camera Module

## Conclusion

This project demonstrates **MOTA ATOM's** ability to bridge the gap between cutting-edge Generative AI and practical, ruggedized hardware. We solve real-world physical safety problems with software-defined intelligence.

**Looking to deploy AI on the Edge?** [Contact us](#) to learn how we can optimize your computer vision models for embedded devices.