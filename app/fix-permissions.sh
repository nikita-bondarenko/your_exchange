#!/bin/bash

# Простой скрипт для установки прав
APP_DIR="/usr/src/app"

echo "Установка прав в $APP_DIR..."

# Полные права на всю папку приложения
chmod -R 755 $APP_DIR

# Особые права для папки data
mkdir -p $APP_DIR/data
chmod -R 777 $APP_DIR/data

echo "Готово! Права установлены."