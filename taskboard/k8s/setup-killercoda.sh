#!/usr/bin/env bash
set -euo pipefail

NAMESPACE="taskboard"
BACKEND_IMAGE="taskboard-backend:1.0.0"
FRONTEND_IMAGE="taskboard-frontend:1.0.0"
MIRROR="mirror.gcr.io"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

step() {
	printf '\n\033[1;35m==> %s\033[0m\n' "$1"
}

pull_base_image() {
	local image="$1"

	if docker pull "${MIRROR}/library/${image}"; then
		docker tag "${MIRROR}/library/${image}" "$image"
	else
		docker pull "$image"
	fi
}

step "Ресурсы машины"
CPUS="$(nproc)"
MEM_MB="$(free -m | awk '/^Mem:/ {print $2}')"
echo "CPU: ${CPUS}, RAM: ${MEM_MB} МБ"

step "Установка kubectl и minikube"
if ! command -v kubectl > /dev/null; then
	KUBECTL_VERSION="$(curl -fsSL https://dl.k8s.io/release/stable.txt)"
	curl -fsSLo /usr/local/bin/kubectl "https://dl.k8s.io/release/${KUBECTL_VERSION}/bin/linux/amd64/kubectl"
	chmod +x /usr/local/bin/kubectl
fi
if ! command -v minikube > /dev/null; then
	curl -fsSLo /usr/local/bin/minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
	chmod +x /usr/local/bin/minikube
fi
kubectl version --client | head -1
minikube version | head -1

step "Запуск minikube (среда выполнения контейнеров: docker)"
MINIKUBE_MEM=$((MEM_MB - 700))
if [ "$MINIKUBE_MEM" -gt 4096 ]; then
	MINIKUBE_MEM=4096
fi
if [ "$MINIKUBE_MEM" -lt 1800 ]; then
	MINIKUBE_MEM=1800
fi
START_ARGS=(
	--driver=docker
	--container-runtime=docker
	--force
	--memory="${MINIKUBE_MEM}mb"
	--registry-mirror="https://${MIRROR}"
)
if [ "$CPUS" -lt 2 ]; then
	START_ARGS+=(--cpus=1 --extra-config=kubeadm.ignore-preflight-errors=NumCPU)
else
	START_ARGS+=(--cpus=2)
fi
if minikube status > /dev/null 2>&1; then
	echo "minikube уже запущен"
else
	minikube start "${START_ARGS[@]}"
fi

step "Бэкенд: сборка внутри minikube (eval \$(minikube docker-env) + docker build)"
eval "$(minikube docker-env)"
echo "Docker-демон: ${MINIKUBE_ACTIVE_DOCKERD:-не minikube}"
docker build -t "$BACKEND_IMAGE" "$PROJECT_DIR/backend"

step "Фронтенд: сборка на машине и загрузка в minikube (docker build + minikube image load)"
eval "$(minikube docker-env --unset)"
pull_base_image node:22-alpine
pull_base_image nginx:1.29-alpine
docker build -t "$FRONTEND_IMAGE" "$PROJECT_DIR/frontend"
minikube image load "$FRONTEND_IMAGE"

step "Образы в minikube"
minikube image ls | grep taskboard

step "Namespace и секрет с паролем базы данных"
kubectl apply -f "$PROJECT_DIR/k8s/00-namespace.yaml"
if kubectl -n "$NAMESPACE" get secret taskboard-db > /dev/null 2>&1; then
	echo "Секрет taskboard-db уже существует"
else
	kubectl -n "$NAMESPACE" create secret generic taskboard-db \
		--from-literal=DB_USER=taskboard \
		--from-literal=DB_PASSWORD="$(openssl rand -hex 16)"
fi
kubectl config set-context --current --namespace="$NAMESPACE" > /dev/null

step "Готово. Команды для записи:"
cat << NEXT
  cd ${PROJECT_DIR}
  kubectl apply -f k8s/
  kubectl get pods -w
  kubectl scale deployment backend --replicas=3
  kubectl scale deployment frontend --replicas=2
  kubectl get pods -o wide
  kubectl port-forward --address 0.0.0.0 svc/frontend 8080:80
NEXT
