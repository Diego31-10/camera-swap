# 📸 SwapCamera (Snap & Swipe)

<div align="center">

![SwapCamera Logo](https://img.shields.io/badge/SwapCamera-Snap%20%26%20Swipe-7C3AED?style=for-the-badge&logo=react)

**Captura, desliza y decide con gestos**

Aplicación móvil desarrollada con **React Native y Expo** que permite capturar fotografías y aplicar **gestos de swipe** para guardarlas o descartarlas de forma intuitiva.

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Reanimated](https://img.shields.io/badge/Reanimated-5B2D8B?style=flat)](https://docs.swmansion.com/react-native-reanimated/)
[![Gesture Handler](https://img.shields.io/badge/Gesture_Handler-3A86FF?style=flat)](https://docs.swmansion.com/react-native-gesture-handler/)

[Características](#-características-principales) • [Gestos](#-interacción-por-gestos) • [Tecnologías](#%EF%B8%8F-tecnologías-utilizadas)  • [Autor](#autor) 

</div>

---
## 📽️Video Demostrativo

<div align="left">
  <a  target="_blank" href="https://youtube.com/shorts/h8m3-QWQ4fk">
    <img 
      src="https://img.shields.io/badge/Ver%20video%20en%20YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white"
      alt="Ver video"
    />
  </a>
</div>

## 📋 Descripción

**SwapCamera (Snap & Swipe)** es una aplicación móvil enfocada en la **experiencia táctil**, que permite capturar imágenes con la cámara del dispositivo y decidir su destino mediante **gestos de deslizamiento**, sin botones innecesarios.

La aplicación fue desarrollada como **proyecto académico**, priorizando una arquitectura limpia, modular y fácil de explicar.


### 💡 ¿Qué hace especial a SwapCamera?

- 📸 **Captura de fotos en tiempo real** usando Expo Camera  
- 👉 **Gestos intuitivos** para guardar o descartar imágenes  
- 🎞️ **Galería interna** para visualizar fotos guardadas  
- 🧱 **Arquitectura profesional** separando UI, lógica y estado  
- 🎨 **Diseño moderno** enfocado en la experiencia móvil  

---

## ✨ Características Principales

### 📸 Cámara

- Solicitud de permisos de cámara
- Vista previa en tiempo real
- Captura de imágenes con calidad nativa
- Manejo correcto del ciclo de vida de la cámara

### 🎞️ Galería Interna

- Visualización de imágenes guardadas
- Render optimizado de imágenes
- Persistencia local de archivos

---

## 🌀 Interacción por Gestos

- 👈 **Swipe a la izquierda** → Descartar imagen  
- 👉 **Swipe a la derecha** → Guardar imagen  
- 📏 Decisión basada en la distancia del gesto  
- ✨ Animaciones fluidas con Reanimated  
- 👁️ Indicadores visuales durante el gesto  

Implementado usando:
- `react-native-gesture-handler`
- `react-native-reanimated`

---

## 🎨 UI / UX

- Diseño limpio y moderno
- Inspiración **Material / Dracula Theme**
- Jerarquía visual clara
- Componentes reutilizables
- Iconografía profesional con **Lucide React Native**
- Estilos definidos con **StyleSheet** (sin estilos inline)

---

## 🛠️ Tecnologías utilizadas

### Core

- **React Native** – Desarrollo móvil multiplataforma  
- **Expo** – Entorno de desarrollo y despliegue  
- **TypeScript** – Tipado estático  
- **Expo Router** – Navegación basada en archivos  

### Cámara y Gestos

- **Expo Camera** – Acceso a la cámara del dispositivo  
- **react-native-gesture-handler** – Manejo de gestos  
- **react-native-reanimated** – Animaciones de alto rendimiento  

### UI y Utilidades

- **Lucide React Native** – Iconos modernos  
- **StyleSheet** – Estilos nativos  
- **Expo File System** – Almacenamiento local de imágenes  

---

### Autor

Diego Torres

