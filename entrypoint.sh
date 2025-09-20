#!/bin/sh
# ---------------------------
# Запуск MinIO сервера
# ---------------------------
minio server /data --console-address ":9001" &

# Ждём пока MinIO станет доступен
sleep 5

# ---------------------------
# Настройка mc и публичного бакета
# ---------------------------
mc alias set local http://127.0.0.1:9000 $MINIO_ROOT_USER $MINIO_ROOT_PASSWORD

# Создаём бакет (если уже существует — пропускаем)
mc mb local/mybucket || true

# Делаем бакет публичным
mc policy set public local/mybucket

# ---------------------------
# Оставляем процесс MinIO на переднем плане
# ---------------------------
wait

