# 📸 SwapCamera (Snap & Swipe)

Aplicación móvil desarrollada con **React Native + Expo** que permite capturar fotografías y decidir acciones mediante **gestos de deslizamiento (swipe)**, enfocada en la experiencia táctil y una arquitectura limpia.

Este proyecto fue desarrollado como **evaluación académica**, siguiendo buenas prácticas de organización, modularidad y control de versiones.

---

## 🎯 Objetivo del Proyecto

El objetivo principal de **SwapCamera** es permitir al usuario:

- Capturar fotografías utilizando la cámara del dispositivo.
- Interactuar con las imágenes mediante gestos (swipe).
- Decidir acciones según el gesto:
  - 👉 **Swipe a la derecha** → Guardar imagen.
  - 👈 **Swipe a la izquierda** → Descartar imagen.
- Visualizar las imágenes guardadas en una **galería interna**.

La aplicación funciona **sin backend**, utilizando almacenamiento y estado local.

---

## 👤 Rol de Usuario

**Usuario único**
- Capturar fotos.
- Aplicar gestos sobre imágenes.
- Guardar o eliminar imágenes.
- Navegar entre cámara y galería.

---

## 🧱 Arquitectura y Enfoque

El proyecto sigue una **arquitectura limpia y modular**, separando:

- UI (componentes visuales)
- Lógica de negocio
- Manejo de estado
- Navegación

Se prioriza:
- Reutilización de componentes
- Código tipado con TypeScript
- Claridad y facilidad de mantenimiento

---

## 🧭 Navegación

La aplicación utiliza **Expo Router (file-based routing)** con las siguientes pantallas principales:

- **Camera** → Captura de imágenes y gestos
- **Gallery** → Visualización de imágenes guardadas

---

## 🌀 Interacciones por Gestos

- Implementación con **react-native-gesture-handler**
- Animaciones fluidas con **react-native-reanimated**
- Decisión de acción basada en la distancia del gesto
- Indicadores visuales durante el swipe

---

## 💾 Manejo de Estado y Almacenamiento

- Estado global simple para manejar las imágenes capturadas
- Almacenamiento local de imágenes usando **expo-file-system**
- Persistencia de las fotos guardadas entre sesiones

---

## 🎨 UI / UX

- Diseño moderno y limpio
- Inspiración en **Material / Dracula Theme**
- Enfoque en experiencia táctil
- Jerarquía visual clara
- Uso de iconos con **lucide-react-native**
- Estilos definidos con **StyleSheet** (sin estilos inline)

---

## 🛠️ Tecnologías Utilizadas

- **React Native**
- **Expo**
- **TypeScript**
- **Expo Router**
- **Expo Camera**
- **react-native-gesture-handler**
- **react-native-reanimated**
- **expo-file-system**
- **lucide-react-native**
- **Git / GitHub**

---
