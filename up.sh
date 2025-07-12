#!/bin/bash

echo "Construindo imagens Docker..."
docker-compose build

echo "Iniciando contêineres Docker..."
docker-compose up -d

echo "Projeto está rodando! Acesse em http://localhost:8080"