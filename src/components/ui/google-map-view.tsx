"use client"

import React from "react"
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api"
import { siteConfig } from "@/config/site"

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "0.75rem", // 对应 rounded-xl
}

const center = siteConfig.google_map.mapCoordinates

export function GoogleMapView() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  })

  // 避免地图看起来太像默认样式，稍微去掉一些 UI 控件保持极简风格
  const options = {
    disableDefaultUI: true,
    zoomControl: true,
    styles: [
      // 可选：添加自定义地图样式 JSON 使其符合网站的 Dark Mode
      // 这里暂留空，使用默认样式
    ]
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-muted/20 animate-pulse rounded-xl flex items-center justify-center text-muted-foreground text-sm">
        Loading Map...
      </div>
    )
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      options={options}
    >
      <Marker position={center} />
    </GoogleMap>
  )
}